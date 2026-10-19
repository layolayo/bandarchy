#!/usr/bin/env python3
"""Bandarchy Stark Snapshot & Sector Colour-Snatch Engine — Family 4 (Effects 13–16).

Standalone, non-destructive image processing module compatible with Bandarchy's
runtime helper (`bin/bandarchy`) and Omarchy marketplace packaging rules:
- Resolves `$XDG_PICTURES_DIR/bandarchy` (falling back to `~/Pictures/bandarchy`)
  dynamically at runtime without mutating `$HOME` at package install time.
- Validates source images with `O_NOFOLLOW`, ownership, symlink, magic-byte, and
  `MAX_ART_BYTES` (15 MiB) checks; never modifies source files.
- Writes processed stark copies and contact sheets atomically via `mkstemp` +
  `fchmod` + `fsync` + `os.replace`.
- Automatically detects monochrome / low-chroma photographs (`mean(S) < 0.04`)
  and performs Synthetic Sector Colour-Snatching using Bandarchy's psychedelic
  palettes and Omarchy theme accents (`#6ee7b7`, `#f472b6`, `#38bdf8`, `#fbbf24`).

Implemented Effects (Family 4 — Neon Edge Contours, Relief & Braille Hybrid):
13. `13_Obsidian_Neon_Edge_Snatch`
14. `14_Metallic_Relief_Sector_Snatch`
15. `15_Braille_Matrix_Sector_Snatch`
16. `16_Prism_Kaleidoscope_Sector_Snatch`
"""

from __future__ import annotations

import argparse
import glob
import io
import json
import math
import os
import re
import stat
import sys
import tempfile
import time
from typing import Callable

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

os.umask(0o077)

MAX_ART_BYTES = 15 * 1024 * 1024
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")
BW_SATURATION_THRESHOLD = 0.04

# Default Omarchy / Bandarchy theme & palette colours (British English naming)
DEFAULT_THEME_COLOURS = {
    "obsidian": "#07090e",
    "emerald": "#6ee7b7",
    "magenta": "#f472b6",
    "cyan": "#38bdf8",
    "gold": "#fbbf24",
    "amethyst": "#c084fc",
    "chalk": "#f8fafc",
    "silver": "#cbd5e1",
    "gunmetal": "#334155",
}

BANDARCHY_PALETTES = [
    ["#6ee7b7", "#f472b6", "#38bdf8", "#fbbf24", "#c084fc", "#2dd4bf"],
    ["#ff007f", "#00f5d4", "#fee440", "#9b5de5", "#00bbf9", "#f15bb5"],
    ["#00f5ff", "#ff2a85", "#7b2cbf", "#38b000", "#ffbe0b", "#4cc9f0"],
    ["#10b981", "#38bdf8", "#f472b6", "#fbbf24", "#a855f7", "#22d3ee"],
    ["#f72585", "#4cc9f0", "#ffd166", "#7209b7", "#06d6a0", "#ef476f"],
]

BRAILLE_MUTANTS = [
    "⣿", "⣷", "⣯", "⣟", "⡿", "⢿", "⣻", "⣽", "⣾",
    "⢕", "⢝", "✦", "◈", "⟡", "░", "▒", "▓", "█",
]

FONT_CANDIDATES = (
    "/usr/share/fonts/TTF/JetBrainsMonoNerdFont-Bold.ttf",
    "/usr/share/fonts/TTF/JetBrainsMonoNerdFont-Regular.ttf",
    "/usr/share/fonts/TTF/DejaVuSansMono-Bold.ttf",
    "/usr/share/fonts/TTF/DejaVuSansMono.ttf",
    "/usr/share/fonts/noto/NotoSansMono-Bold.ttf",
)


class BandarchyEffectError(ValueError):
    """Expected operational error for invalid or unsafe image inputs."""


def _clamp_unit(val: float, default: float = 0.5) -> float:
    """Safely clamp an audio/modulation parameter into `[0.0, 1.0]`, guarding against NaN/Inf."""
    try:
        fval = float(val)
    except (TypeError, ValueError):
        return default
    if not math.isfinite(fval):
        return default
    return min(max(fval, 0.0), 1.0)


def resolve_pictures_bandarchy_dir(custom_dir: str | None = None) -> str:
    """Resolve `$XDG_PICTURES_DIR/bandarchy` or fallback `~/Pictures/bandarchy` at runtime."""
    if custom_dir:
        return os.path.abspath(os.path.expanduser(custom_dir))
    env_override = (os.environ.get("BANDARCHY_PICTURES_DIR") or "").strip()
    if env_override:
        return os.path.abspath(os.path.expanduser(env_override))
    xdg_pics = (os.environ.get("XDG_PICTURES_DIR") or "").strip()
    if xdg_pics:
        return os.path.join(os.path.abspath(os.path.expanduser(xdg_pics)), "bandarchy")
    home = os.path.expanduser("~")
    user_dirs = os.path.join(
        os.environ.get("XDG_CONFIG_HOME") or os.path.join(home, ".config"),
        "user-dirs.dirs",
    )
    if os.path.isfile(user_dirs):
        try:
            with open(user_dirs, "r", encoding="utf-8", errors="replace") as fh:
                for line in fh:
                    line = line.strip()
                    if line.startswith("XDG_PICTURES_DIR="):
                        raw = line.split("=", 1)[1].strip().strip('"').strip("'")
                        raw = raw.replace("$HOME", home).replace("${HOME}", home)
                        if raw:
                            return os.path.join(os.path.abspath(raw), "bandarchy")
        except OSError:
            pass
    return os.path.join(home, "Pictures", "bandarchy")


def hex_to_rgb_float(hex_colour: str) -> np.ndarray:
    """Convert a `#RRGGBB` colour string to a float32 RGB array in `[0.0, 1.0]`."""
    clean = hex_colour.strip().lstrip("#")
    if len(clean) == 3:
        clean = "".join(ch * 2 for ch in clean)
    if len(clean) != 6:
        return np.array([0.431, 0.906, 0.718], dtype=np.float32)
    r = int(clean[0:2], 16) / 255.0
    g = int(clean[2:4], 16) / 255.0
    b = int(clean[4:6], 16) / 255.0
    return np.array([r, g, b], dtype=np.float32)


def safe_read_image(path: str, max_bytes: int = MAX_ART_BYTES) -> Image.Image:
    """Safely read an image file without following symlinks or modifying the source."""
    if not path or not isinstance(path, str):
        raise BandarchyEffectError("Empty or invalid image path")
    abs_path = os.path.abspath(path)
    ext = os.path.splitext(abs_path)[1].lower()
    if ext not in IMAGE_EXTENSIONS:
        raise BandarchyEffectError(f"Unsupported image extension: {ext}")

    uid = os.getuid()
    try:
        st_l = os.lstat(abs_path)
    except OSError as exc:
        raise BandarchyEffectError(f"Cannot stat image {abs_path}: {exc}") from exc

    if stat.S_ISLNK(st_l.st_mode) or not stat.S_ISREG(st_l.st_mode):
        raise BandarchyEffectError(f"Refusing symlink or non-regular file: {abs_path}")
    if st_l.st_uid not in (uid, 0):
        raise BandarchyEffectError(f"Refusing foreign-owned file: {abs_path}")
    if st_l.st_size < 32 or st_l.st_size > max_bytes:
        raise BandarchyEffectError(
            f"Image file size {st_l.st_size} outside bounds [32, {max_bytes}]"
        )

    flags = os.O_RDONLY
    if hasattr(os, "O_NOFOLLOW"):
        flags |= os.O_NOFOLLOW

    try:
        fd = os.open(abs_path, flags)
        try:
            st_f = os.fstat(fd)
            if (
                not stat.S_ISREG(st_f.st_mode)
                or st_f.st_ino != st_l.st_ino
                or st_f.st_dev != st_l.st_dev
                or st_f.st_size > max_bytes
            ):
                raise BandarchyEffectError(f"File verification failed on open: {abs_path}")
            chunks: list[bytes] = []
            total = 0
            while total <= max_bytes:
                chunk = os.read(fd, min(65536, max_bytes + 1 - total))
                if not chunk:
                    break
                chunks.append(chunk)
                total += len(chunk)
            if total > max_bytes:
                raise BandarchyEffectError(f"Image exceeds MAX_ART_BYTES ({max_bytes})")
            raw_bytes = b"".join(chunks)
        finally:
            os.close(fd)
    except BandarchyEffectError:
        raise
    except OSError as exc:
        raise BandarchyEffectError(f"Failed reading image {abs_path}: {exc}") from exc

    if not (
        raw_bytes.startswith(b"\xff\xd8\xff")
        or raw_bytes.startswith(b"\x89PNG\r\n\x1a\n")
        or (raw_bytes[:4] == b"RIFF" and raw_bytes[8:12] == b"WEBP")
    ):
        raise BandarchyEffectError(f"Unrecognised image magic header in {abs_path}")

    try:
        with Image.open(io.BytesIO(raw_bytes)) as img:
            img.load()
            try:
                oriented = ImageOps.exif_transpose(img)
            except Exception:
                oriented = img
            if oriented.mode in ("I;16", "I", "F"):
                arr_raw = np.asarray(oriented, dtype=np.float32)
                amax = float(arr_raw.max())
                scale = 255.0 / amax if amax > 255.0 else 1.0
                u8 = np.clip(arr_raw * scale, 0.0, 255.0).astype(np.uint8)
                rgb = Image.fromarray(u8, mode="L").convert("RGB")
            else:
                rgb = oriented.convert("RGB")
            w, h = rgb.size
            if w < 16 or h < 16 or w * h > 36_000_000:
                raise BandarchyEffectError(f"Invalid image dimensions: {w}x{h}")
            return rgb
    except BandarchyEffectError:
        raise
    except Exception as exc:
        raise BandarchyEffectError(f"Failed decoding image {abs_path}: {exc}") from exc


def safe_write_image(img: Image.Image, target_path: str, mode: int = 0o644) -> str:
    """Atomically write a PIL Image to `target_path` using mkstemp + fsync + os.replace."""
    abs_path = os.path.abspath(target_path)
    target_dir = os.path.dirname(abs_path)
    os.makedirs(target_dir, mode=0o755, exist_ok=True)

    st_dir = os.lstat(target_dir)
    if stat.S_ISLNK(st_dir.st_mode) or not stat.S_ISDIR(st_dir.st_mode):
        raise BandarchyEffectError(f"Refusing symlinked output directory: {target_dir}")

    if os.path.lexists(abs_path):
        st_file = os.lstat(abs_path)
        if stat.S_ISLNK(st_file.st_mode):
            raise BandarchyEffectError(f"Refusing to overwrite symlink: {abs_path}")

    buf = io.BytesIO()
    ext = os.path.splitext(abs_path)[1].lower()
    fmt = "PNG" if ext == ".png" else ("WEBP" if ext == ".webp" else "JPEG")
    save_kwargs = {"compress_level": 4} if fmt == "PNG" else {"quality": 94}
    img.save(buf, format=fmt, **save_kwargs)
    payload = buf.getvalue()

    tmp_path = ""
    try:
        fd, tmp_path = tempfile.mkstemp(
            prefix=f".{os.path.basename(abs_path)}.",
            suffix=".tmp",
            dir=target_dir,
        )
        try:
            os.fchmod(fd, mode)
            os.write(fd, payload)
            os.fsync(fd)
        finally:
            os.close(fd)
        os.replace(tmp_path, abs_path)
        tmp_path = ""
        return abs_path
    finally:
        if tmp_path and os.path.lexists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass


# ---------------------------------------------------------------------------
# Core Luminance, Chroma & Gradient Decomposition Utilities
# ---------------------------------------------------------------------------

def rgb_to_hsv_np(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Vectorised RGB `[0, 1]` to HSV `(H, S, V)` in `[0, 1]`."""
    r = rgb[..., 0]
    g = rgb[..., 1]
    b = rgb[..., 2]
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    diff = maxc - minc

    s = np.where(maxc > 1e-6, diff / np.maximum(maxc, 1e-6), 0.0).astype(np.float32)
    v = maxc.astype(np.float32)

    h = np.zeros_like(maxc, dtype=np.float32)
    mask = diff > 1e-6
    safe_diff = np.where(mask, diff, 1.0)

    r_max = mask & (r == maxc)
    g_max = mask & (g == maxc) & (~r_max)
    b_max = mask & (~r_max) & (~g_max)

    h = np.where(r_max, ((g - b) / safe_diff) % 6.0, h)
    h = np.where(g_max, ((b - r) / safe_diff) + 2.0, h)
    h = np.where(b_max, ((r - g) / safe_diff) + 4.0, h)
    h = (h / 6.0) % 1.0
    return h.astype(np.float32), s, v


def hsv_to_rgb_np(h: np.ndarray, s: np.ndarray, v: np.ndarray) -> np.ndarray:
    """Vectorised HSV `[0, 1]` to RGB `[0, 1]`."""
    h6 = (h % 1.0) * 6.0
    i = np.floor(h6).astype(np.int32)
    f = h6 - i
    p = v * (1.0 - s)
    q = v * (1.0 - s * f)
    t = v * (1.0 - s * (1.0 - f))

    i_mod = i % 6
    r = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5], [v, q, p, p, t, v], default=v)
    g = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5], [t, v, v, q, p, p], default=v)
    b = np.select([i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5], [p, p, t, v, v, q], default=v)
    return np.stack([r, g, b], axis=-1).astype(np.float32)


def gaussian_blur_np(arr: np.ndarray, radius: float) -> np.ndarray:
    """Blur a 2D `(H, W)` or 3D `(H, W, 3)` float32 array in `[0, 1]` via Pillow's fast C GaussianBlur."""
    if radius <= 0.05:
        return arr.copy()
    clipped = np.clip(arr * 255.0, 0.0, 255.0).astype(np.uint8)
    if arr.ndim == 2:
        pil_im = Image.fromarray(clipped, mode="L")
        blurred = pil_im.filter(ImageFilter.GaussianBlur(radius=float(radius)))
        return np.asarray(blurred, dtype=np.float32) / 255.0
    pil_im = Image.fromarray(clipped, mode="RGB")
    blurred = pil_im.filter(ImageFilter.GaussianBlur(radius=float(radius)))
    return np.asarray(blurred, dtype=np.float32) / 255.0


def compute_luminance_and_sectors(rgb: np.ndarray) -> dict[str, np.ndarray | float | bool]:
    """Decompose RGB `[0, 1]` into local-contrast-enhanced luminance `Y`, gradients, and stark sectors."""
    # Rec. 709 perceptual luminance
    y_raw = (0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]).astype(np.float32)

    # Percentile stretch gated by dynamic range so uniform bright/dark images keep their true luminance
    p2, p98 = np.percentile(y_raw, [2.0, 98.0])
    dyn_range = float(p98 - p2)
    stretch_gate = float(np.clip((dyn_range - 0.02) / 0.12, 0.0, 1.0))
    span = max(dyn_range, 1e-4)
    y_stretched = np.clip((y_raw - p2) / span, 0.0, 1.0)
    y_norm = (stretch_gate * y_stretched + (1.0 - stretch_gate) * y_raw).astype(np.float32)

    # Pre-smooth before Scharr derivatives to suppress 8x8 JPEG macroblock quantisation steps
    y_smooth = gaussian_blur_np(y_norm, radius=1.25)
    yp = np.pad(y_smooth, 1, mode="edge")
    gx_raw = (
        3.0 * (yp[:-2, 2:] - yp[:-2, :-2])
        + 10.0 * (yp[1:-1, 2:] - yp[1:-1, :-2])
        + 3.0 * (yp[2:, 2:] - yp[2:, :-2])
    ) / 32.0
    gy_raw = (
        3.0 * (yp[2:, :-2] - yp[:-2, :-2])
        + 10.0 * (yp[2:, 1:-1] - yp[:-2, 1:-1])
        + 3.0 * (yp[2:, 2:] - yp[:-2, 2:])
    ) / 32.0

    grad_mag_raw = np.hypot(gx_raw, gy_raw).astype(np.float32)
    # Soft deadband suppresses 1-2 LSB JPEG compression block edges in smooth skies
    noise_floor = 0.011
    edge_gate = np.clip((grad_mag_raw - noise_floor) / 0.022, 0.0, 1.0).astype(np.float32)
    gx = (gx_raw * edge_gate).astype(np.float32)
    gy = (gy_raw * edge_gate).astype(np.float32)
    grad_mag = (grad_mag_raw * edge_gate).astype(np.float32)

    # Local contrast enhancement gated by structure so flat skies do not develop JPEG block stucco
    y_local_mean = gaussian_blur_np(y_norm, radius=14.0)
    y_detail = (y_norm - y_local_mean) * (0.15 + 0.85 * gaussian_blur_np(edge_gate, radius=3.0))
    y_stark = np.clip(y_norm + 0.55 * y_detail, 0.0, 1.0).astype(np.float32)

    g99 = max(float(np.percentile(grad_mag, 99.2)), 0.04)
    grad_norm = np.clip(grad_mag / g99, 0.0, 1.0).astype(np.float32)
    grad_angle = np.arctan2(gy, gx).astype(np.float32)  # [-pi, pi]

    # Non-maximum suppression along gradient direction for razor-thin Canny ridges
    angle_deg = (np.degrees(grad_angle) + 180.0) % 180.0
    g_pad = np.pad(grad_norm, 1, mode="constant", constant_values=0.0)

    # Quantise direction into 4 axes: 0 (E-W), 45 (NE-SW), 90 (N-S), 135 (NW-SE)
    dir_0 = (angle_deg < 22.5) | (angle_deg >= 157.5)
    dir_45 = (angle_deg >= 22.5) & (angle_deg < 67.5)
    dir_90 = (angle_deg >= 67.5) & (angle_deg < 112.5)
    dir_135 = (angle_deg >= 112.5) & (angle_deg < 157.5)

    n1 = np.zeros_like(grad_norm)
    n2 = np.zeros_like(grad_norm)
    n1 = np.where(dir_0, g_pad[1:-1, 2:], n1)
    n2 = np.where(dir_0, g_pad[1:-1, :-2], n2)
    n1 = np.where(dir_45, g_pad[2:, 2:], n1)
    n2 = np.where(dir_45, g_pad[:-2, :-2], n2)
    n1 = np.where(dir_90, g_pad[2:, 1:-1], n1)
    n2 = np.where(dir_90, g_pad[:-2, 1:-1], n2)
    n1 = np.where(dir_135, g_pad[2:, :-2], n1)
    n2 = np.where(dir_135, g_pad[:-2, 2:], n2)

    nms_ridge = np.where((grad_norm >= n1) & (grad_norm >= n2), grad_norm, 0.0).astype(np.float32)

    h, s, v = rgb_to_hsv_np(rgb)
    mean_sat = float(np.mean(s))
    is_bw = mean_sat < BW_SATURATION_THRESHOLD

    # Stark luminance sectors: Black (< 0.35), Mid (0.35..0.72), White (> 0.72)
    black_sector = (y_stark < 0.35).astype(np.float32)
    mid_sector = ((y_stark >= 0.35) & (y_stark <= 0.72)).astype(np.float32)
    white_sector = (y_stark > 0.72).astype(np.float32)

    return {
        "y_raw": y_raw,
        "y_stark": y_stark,
        "gx": gx,
        "gy": gy,
        "grad_norm": grad_norm,
        "grad_angle": grad_angle,
        "nms_ridge": nms_ridge,
        "h": h,
        "s": s,
        "v": v,
        "mean_sat": mean_sat,
        "is_bw": is_bw,
        "black_sector": black_sector,
        "mid_sector": mid_sector,
        "white_sector": white_sector,
    }


def synthesise_snatched_colours(
    rgb: np.ndarray,
    decomp: dict,
    palette_index: int = 0,
    sat_boost: float = 2.0,
) -> np.ndarray:
    """Produce hyper-vivid snatched RGB colours for both Colour and B&W source images.

    - For Colour photographs (`mean_sat >= 0.04`): boosts native chroma (`sat_boost`)
      and lifts value so snatched sectors glow with the photograph's true hues; pixels
      with near-zero chroma inside an active sector receive a sympathetic palette tint
      anchored to the image's dominant hue.
    - For Black & White photographs (`mean_sat < 0.04`): performs Synthetic Sector
      Colour-Snatching across Omarchy Emerald (`#6ee7b7`), Urgent Magenta (`#f472b6`),
      Electric Cyan (`#38bdf8`), and Solar Gold (`#fbbf24`) modulated by luminance
      sector, spatial geometry, and contour orientation.
    """
    h_img, w_img = rgb.shape[:2]
    pal = BANDARCHY_PALETTES[palette_index % len(BANDARCHY_PALETTES)]
    c_emerald = hex_to_rgb_float(pal[0])
    c_magenta = hex_to_rgb_float(pal[1])
    c_cyan = hex_to_rgb_float(pal[2])
    c_gold = hex_to_rgb_float(pal[3])
    c_amethyst = hex_to_rgb_float(pal[4])

    y_stark = decomp["y_stark"]
    grad_norm = decomp["grad_norm"]
    grad_angle = decomp["grad_angle"]
    h, s, v = decomp["h"], decomp["s"], decomp["v"]

    yy, xx = np.meshgrid(
        np.linspace(0.0, 1.0, h_img, dtype=np.float32),
        np.linspace(0.0, 1.0, w_img, dtype=np.float32),
        indexing="ij",
    )

    # Gate angle modulation by gradient strength so zero-gradient regions never inject atan2 noise
    angle_weight = np.clip(grad_norm * 2.2, 0.0, 1.0)
    angle_phase = ((grad_angle + math.pi) / (2.0 * math.pi)) * angle_weight
    spatial_wave_1 = 0.5 + 0.5 * np.sin((xx * 2.6 - yy * 1.9 + angle_phase * 0.45) * math.pi)
    spatial_wave_2 = 0.5 + 0.5 * np.cos((xx * 1.7 + yy * 2.4 - angle_phase * 0.35) * math.pi)
    lum_band = np.clip((y_stark - 0.18) / 0.76, 0.0, 1.0)

    # Blend between Emerald -> Cyan -> Magenta -> Gold across luminance & spatial sectors
    w1 = np.clip(1.0 - np.abs(lum_band - 0.15) * 2.6, 0.0, 1.0)[..., None]
    w2 = np.clip(1.0 - np.abs(lum_band - 0.48) * 2.6, 0.0, 1.0)[..., None]
    w3 = np.clip(1.0 - np.abs(lum_band - 0.78) * 2.6, 0.0, 1.0)[..., None]
    w4 = np.clip((lum_band - 0.65) * 2.4, 0.0, 1.0)[..., None]

    m1 = spatial_wave_1[..., None]
    m2 = spatial_wave_2[..., None]
    col_low = m1 * c_emerald + (1.0 - m1) * c_amethyst
    col_mid = m2 * c_cyan + (1.0 - m2) * c_magenta
    col_high = m1 * c_magenta + (1.0 - m1) * (m2 * c_emerald + (1.0 - m2) * c_cyan)
    col_peak = m2 * c_gold + (1.0 - m2) * (m1 * c_emerald + (1.0 - m1) * c_magenta)

    w_sum = np.maximum(w1 + w2 + w3 + w4, 1e-4)
    synth_rgb = (w1 * col_low + w2 * col_mid + w3 * col_high + w4 * col_peak) / w_sum
    synth_h, synth_s, synth_v = rgb_to_hsv_np(np.clip(synth_rgb, 0.0, 1.0))
    synth_vivid = hsv_to_rgb_np(synth_h, np.clip(synth_s * 1.18, 0.72, 1.0), np.clip(synth_v * 1.12, 0.88, 1.0))

    if decomp["is_bw"]:
        return synth_vivid

    # Colour source: boost native saturation & value, and spread nearby chroma into neutral edge pixels
    s_boosted = np.clip(s * sat_boost + 0.18, 0.0, 1.0)
    v_boosted = np.clip(np.maximum(v, y_stark) * 1.22 + 0.12, 0.35, 1.0)
    native_vivid = hsv_to_rgb_np(h, s_boosted, v_boosted)

    # Dilate chroma slightly via Gaussian blur so edges right next to saturated regions snatch that colour
    s_smooth = gaussian_blur_np(s, radius=6.0)
    rgb_smooth = gaussian_blur_np(native_vivid, radius=6.0)
    hs, ss, vs = rgb_to_hsv_np(rgb_smooth)
    propagated_vivid = hsv_to_rgb_np(hs, np.clip(ss * 1.8 + 0.25, 0.45, 1.0), np.clip(vs * 1.15 + 0.15, 0.5, 1.0))

    local_weight = np.clip((s - 0.05) / 0.18, 0.0, 1.0)[..., None]
    near_weight = np.clip((s_smooth - 0.04) / 0.14, 0.0, 1.0)[..., None]
    combined_colour = local_weight * native_vivid + (1.0 - local_weight) * (
        near_weight * propagated_vivid + (1.0 - near_weight) * synth_vivid
    )
    return np.clip(combined_colour, 0.0, 1.0).astype(np.float32)


def make_stark_bw_base(y_stark: np.ndarray, grad_norm: np.ndarray) -> np.ndarray:
    """Create a high-contrast brutalist B&W photograph copy with deep obsidian blacks and chalk highlights."""
    # Fixed-endpoint logistic S-curve so smooth gradients never suffer step-jump posterisation
    # and uniform bright/dark images retain their true tonal polarity.
    s_raw = 1.0 / (1.0 + np.exp(-9.0 * (y_stark - 0.47)))
    s_0 = 1.0 / (1.0 + math.exp(-9.0 * (0.0 - 0.47)))
    s_1 = 1.0 / (1.0 + math.exp(-9.0 * (1.0 - 0.47)))
    s_curve = np.clip((s_raw - s_0) / (s_1 - s_0), 0.0, 1.0)

    # Continuous C1 3-sector brutalist curve (deep black <0.28, crisp mid 0.28..0.72, chalk white >0.72)
    sector_smooth = np.where(
        y_stark < 0.28,
        y_stark * (0.12 / 0.28),
        np.where(
            y_stark > 0.72,
            0.78 + (y_stark - 0.72) * (0.22 / 0.28),
            0.12 + (y_stark - 0.28) * (0.66 / 0.44),
        ),
    )
    bw = np.clip(0.72 * s_curve + 0.28 * sector_smooth + 0.10 * grad_norm, 0.0, 1.0).astype(np.float32)

    # Tint deepest shadows slightly toward Bandarchy obsidian (#07090e) for rich tonal depth
    obsidian = hex_to_rgb_float(DEFAULT_THEME_COLOURS["obsidian"])
    chalk = hex_to_rgb_float(DEFAULT_THEME_COLOURS["chalk"])
    bw_rgb = obsidian[None, None, :] * (1.0 - bw[..., None]) + chalk[None, None, :] * bw[..., None]
    return np.clip(bw_rgb, 0.0, 1.0).astype(np.float32)


# ---------------------------------------------------------------------------
# Effect 13: 13_Obsidian_Neon_Edge_Snatch
# ---------------------------------------------------------------------------

def effect_13_obsidian_neon_edge_snatch(
    img: Image.Image,
    *,
    palette_index: int = 0,
    bass: float = 0.5,
    high: float = 0.5,
) -> Image.Image:
    """13_Obsidian_Neon_Edge_Snatch:
    Pitch-black void with Canny/Sobel structural contours glowing in snatched colour
    and stark white inner cores.
    """
    bass_c = _clamp_unit(bass, 0.5)
    high_c = _clamp_unit(high, 0.5)
    rgb = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0
    decomp = compute_luminance_and_sectors(rgb)
    grad_norm = decomp["grad_norm"]
    nms_ridge = decomp["nms_ridge"]

    snatched_rgb = synthesise_snatched_colours(rgb, decomp, palette_index=palette_index, sat_boost=2.2)
    obsidian = hex_to_rgb_float(DEFAULT_THEME_COLOURS["obsidian"])
    chalk = np.array([1.0, 1.0, 1.0], dtype=np.float32)

    # True pitch-black obsidian void (#07090e) so glowing neon structural contours pop with maximum contrast
    void_base = np.broadcast_to(obsidian[None, None, :], rgb.shape).copy()

    # Hybrid percentile + absolute floor threshold so smooth skies remain completely noise-free
    g_p60 = float(np.percentile(grad_norm, 60.0))
    edge_floor = max(g_p60 * 0.72, 0.055)
    contour_strength = np.clip((grad_norm - edge_floor) / max(1.0 - edge_floor, 1e-4), 0.0, 1.0)
    contour_strength = np.power(contour_strength, 0.80).astype(np.float32)

    # Multi-scale neon bloom around structural contours
    coloured_edges = snatched_rgb * contour_strength[..., None]
    bloom_tight = gaussian_blur_np(coloured_edges, radius=1.6)
    bloom_mid = gaussian_blur_np(coloured_edges, radius=4.5)
    bloom_wide = gaussian_blur_np(coloured_edges, radius=10.0)

    neon_factor = 1.0 + 0.28 * bass_c
    neon_glow = (
        1.20 * coloured_edges
        + 1.38 * bloom_tight
        + 1.08 * bloom_mid
        + 0.72 * bloom_wide
    ) * neon_factor

    # Razor-sharp stark white inner cores on Canny non-maximum-suppressed ridge peaks
    ridge_p85 = float(np.percentile(grad_norm, 85.0))
    ridge_floor = max(ridge_p85 * 0.65, 0.14)
    core_mask = np.clip((nms_ridge - ridge_floor) / max(1.0 - ridge_floor, 1e-4), 0.0, 1.0)
    core_mask = np.power(core_mask, 0.65) * (0.88 + 0.12 * high_c)
    core_halo = gaussian_blur_np(core_mask, radius=0.8)
    white_core = np.clip(core_mask * 0.95 + core_halo * 0.35, 0.0, 1.0)[..., None]

    out = void_base + neon_glow
    out = out * (1.0 - white_core) + chalk[None, None, :] * white_core
    out_u8 = np.clip(out * 255.0, 0.0, 255.0).astype(np.uint8)
    return Image.fromarray(out_u8, mode="RGB")


# ---------------------------------------------------------------------------
# Effect 14: 14_Metallic_Relief_Sector_Snatch
# ---------------------------------------------------------------------------

def effect_14_metallic_relief_sector_snatch(
    img: Image.Image,
    *,
    palette_index: int = 0,
    bass: float = 0.5,
    mid: float = 0.5,
) -> Image.Image:
    """14_Metallic_Relief_Sector_Snatch:
    High-contrast embossed bas-relief in stark silver/black with selective
    colour-snatch pooling along high-energy gradients.
    """
    mid_c = _clamp_unit(mid, 0.5)
    rgb = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0
    decomp = compute_luminance_and_sectors(rgb)
    y_stark = decomp["y_stark"]
    gx = decomp["gx"]
    gy = decomp["gy"]
    grad_norm = decomp["grad_norm"]

    # Construct multi-scale surface normal field with smooth deadband so skies look like sleek brushed metal
    y_med = gaussian_blur_np(y_stark, radius=2.6)
    yp = np.pad(y_med, 1, mode="edge")
    gx_med_raw = (yp[1:-1, 2:] - yp[1:-1, :-2]) * 0.5
    gy_med_raw = (yp[2:, 1:-1] - yp[:-2, 1:-1]) * 0.5
    g_med_mag = np.hypot(gx_med_raw, gy_med_raw)
    med_gate = np.clip((g_med_mag - 0.009) / 0.020, 0.0, 1.0).astype(np.float32)
    gx_med = gx_med_raw * med_gate
    gy_med = gy_med_raw * med_gate

    nx = -(5.6 * gx + 3.8 * gx_med)
    ny = -(5.6 * gy + 3.8 * gy_med)
    nz = np.ones_like(nx, dtype=np.float32) * 0.42
    norm_len = np.maximum(np.sqrt(nx * nx + ny * ny + nz * nz), 1e-5)
    nx /= norm_len
    ny /= norm_len
    nz /= norm_len

    # Primary grazing key light (-45 deg azimuth, 28 deg elevation)
    lx, ly, lz = -0.62, -0.62, 0.48
    ndotl = np.clip(nx * lx + ny * ly + nz * lz, 0.0, 1.0)

    # Half-vector for Blinn-Phong liquid chrome specular highlights
    hx, hy, hz = lx, ly, lz + 1.0
    hlen = math.sqrt(hx * hx + hy * hy + hz * hz)
    hx, hy, hz = hx / hlen, hy / hlen, hz / hlen
    ndoth = np.clip(nx * hx + ny * hy + nz * hz, 0.0, 1.0)
    specular = (np.power(ndoth, 16.0) * 0.92 + np.power(ndoth, 4.0) * 0.25) * np.clip(grad_norm * 3.5 + 0.15, 0.0, 1.0)

    # Stark metallic shading curve: fixed-endpoint S-curve so uniform images retain true tonal height
    relief_lum = np.clip(0.76 * ndotl + 0.24 * y_stark, 0.0, 1.0)
    r_raw = 1.0 / (1.0 + np.exp(-9.5 * (relief_lum - 0.44)))
    r_0 = 1.0 / (1.0 + math.exp(-9.5 * (0.0 - 0.44)))
    r_1 = 1.0 / (1.0 + math.exp(-9.5 * (1.0 - 0.44)))
    relief_stark = np.clip((r_raw - r_0) / (r_1 - r_0), 0.0, 1.0).astype(np.float32)

    obsidian = hex_to_rgb_float("#05070b")
    gunmetal = hex_to_rgb_float("#334155")
    silver = hex_to_rgb_float("#e2e8f0")
    chrome_white = np.array([1.0, 1.0, 1.0], dtype=np.float32)

    low_mix = np.clip(relief_stark * 2.0, 0.0, 1.0)[..., None]
    high_mix = np.clip((relief_stark - 0.5) * 2.0, 0.0, 1.0)[..., None]
    metallic_base = np.where(
        relief_stark[..., None] < 0.5,
        obsidian * (1.0 - low_mix) + gunmetal * low_mix,
        gunmetal * (1.0 - high_mix) + silver * high_mix,
    )
    metallic_base = np.clip(metallic_base + specular[..., None] * chrome_white, 0.0, 1.0)

    # Selective Colour-Snatch Pooling along high-energy gradients & relief basins
    energy_pool = gaussian_blur_np(grad_norm, radius=3.0)
    pool_p62 = float(np.percentile(energy_pool, 62.0))
    pool_floor = max(pool_p62 * 0.85, 0.05)
    pool_mask = np.clip((energy_pool - pool_floor) / max(1.0 - pool_floor, 1e-4), 0.0, 1.0)
    pool_mask = np.power(pool_mask, 0.68) * (0.45 + 0.55 * np.clip(grad_norm * 1.8 + specular * 0.6, 0.0, 1.0))
    pool_mask = np.clip(pool_mask * (1.05 + 0.15 * mid_c), 0.0, 0.96)[..., None]

    snatched_rgb = synthesise_snatched_colours(rgb, decomp, palette_index=palette_index, sat_boost=2.35)
    pool_bloom = gaussian_blur_np(snatched_rgb * pool_mask, radius=2.2)
    # Modulate snatched colour by metallic lighting + specular sheen so it reads as molten anodised metal
    anodised_colour = np.clip(
        snatched_rgb * (0.55 + 0.85 * relief_stark[..., None])
        + pool_bloom * 0.45
        + specular[..., None] * 0.55 * snatched_rgb
        + specular[..., None] * 0.22,
        0.0,
        1.0,
    )

    out = metallic_base * (1.0 - pool_mask) + anodised_colour * pool_mask
    out_u8 = np.clip(out * 255.0, 0.0, 255.0).astype(np.uint8)
    return Image.fromarray(out_u8, mode="RGB")


# ---------------------------------------------------------------------------
# Effect 15: 15_Braille_Matrix_Sector_Snatch
# ---------------------------------------------------------------------------

def _load_monospace_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in FONT_CANDIDATES:
        if os.path.isfile(path):
            try:
                return ImageFont.truetype(path, size=size)
            except Exception:
                continue
    return ImageFont.load_default()


# Ordered 4x2 Bayer dither offsets in [-0.30, +0.30] so smooth white sectors
# naturally progress through sparse-to-dense 8-dot Braille glyphs (⢕ -> ⢝ -> ⣾ -> ⣯ -> ⣷ -> ⣿)
_BRAILLE_BAYER_4X2 = np.array(
    [
        [-0.28, 0.08],
        [0.16, -0.18],
        [-0.08, 0.24],
        [0.30, -0.04],
    ],
    dtype=np.float32,
)

# Standard Unicode Braille bit values for a 4-row x 2-col dot matrix
_BRAILLE_BIT_WEIGHTS = np.array(
    [
        [0x01, 0x08],
        [0x02, 0x10],
        [0x04, 0x20],
        [0x40, 0x80],
    ],
    dtype=np.int32,
)


def _encode_braille_char(sub_4x2: np.ndarray, threshold: float) -> str:
    """Encode a 4-row × 2-col luminance patch into an 8-dot Unicode Braille glyph (`U+2800..U+28FF`)."""
    active = sub_4x2 >= threshold
    bits = int(np.sum(_BRAILLE_BIT_WEIGHTS[active]))
    if bits == 0:
        return "⢕"
    return chr(0x2800 | bits)


def effect_15_braille_matrix_sector_snatch(
    img: Image.Image,
    *,
    palette_index: int = 0,
    bass: float = 0.5,
    high: float = 0.5,
) -> Image.Image:
    """15_Braille_Matrix_Sector_Snatch:
    Stark B&W photograph copy overlaid with Bandarchy's `⣿⣷⣯` Unicode Braille &
    Block glyph matrix rendered in neon colour across the white luminance sectors.
    """
    bass_c = _clamp_unit(bass, 0.5)
    high_c = _clamp_unit(high, 0.5)
    rgb = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0
    h_img, w_img = rgb.shape[:2]
    decomp = compute_luminance_and_sectors(rgb)
    y_stark = decomp["y_stark"]
    grad_norm = decomp["grad_norm"]

    # 1. Stark B&W photograph copy as base
    bw_base = make_stark_bw_base(y_stark, grad_norm)
    snatched_rgb = synthesise_snatched_colours(rgb, decomp, palette_index=palette_index, sat_boost=2.3)

    # 2. Cell grid dimensions scaled to image size (~96 cols x 45 rows on 960x720)
    # Use math.ceil so 100% of the canvas (including odd prime dimensions) is covered.
    cell_w = max(8, round(w_img / 96))
    cell_h = max(14, round(h_img / 45))
    cols = math.ceil(w_img / cell_w)
    rows = math.ceil(h_img / cell_h)

    font = _load_monospace_font(size=max(11, int(cell_h * 0.90)))
    glyph_layer = Image.new("RGB", (w_img, h_img), (0, 0, 0))
    mask_layer = Image.new("L", (w_img, h_img), 0)
    plate_layer = Image.new("L", (w_img, h_img), 0)

    draw_glyph = ImageDraw.Draw(glyph_layer)
    draw_mask = ImageDraw.Draw(mask_layer)
    draw_plate = ImageDraw.Draw(plate_layer)

    # Adaptive threshold for the white & bright-edge luminance sector
    lum_p54 = float(np.percentile(y_stark, 54.0))
    white_cutoff = min(max(lum_p54, 0.45), 0.64)
    white_span = max(0.98 - white_cutoff, 0.22)

    mutant_accents = ("✦", "◈", "⟡", "░", "▒", "▓")

    for r_idx in range(rows):
        y0 = r_idx * cell_h
        y1 = min(y0 + cell_h, h_img)
        ph = max(1, y1 - y0)
        for c_idx in range(cols):
            x0 = c_idx * cell_w
            x1 = min(x0 + cell_w, w_img)
            pw = max(1, x1 - x0)

            patch_y = y_stark[y0:y1, x0:x1]
            patch_g = grad_norm[y0:y1, x0:x1]
            mean_y = float(patch_y.mean())
            mean_g = float(patch_g.mean())

            # Target the white luminance sector (plus high-contrast bright structural contours)
            in_white_sector = (mean_y >= white_cutoff) or (mean_y >= white_cutoff - 0.10 and mean_g >= 0.34)
            if not in_white_sector:
                continue

            sector_intensity = float(
                np.clip((mean_y - (white_cutoff - 0.08)) / max(1.0 - (white_cutoff - 0.08), 1e-4), 0.42, 1.0)
            )
            patch_col = snatched_rgb[y0:y1, x0:x1].mean(axis=(0, 1))
            col_u8 = tuple(int(np.clip(ch * 255.0, 0, 255)) for ch in patch_col)

            # Deep obsidian terminal cell backing in the active Braille sector so neon dots pop sharply
            plate_alpha = int(np.clip(235 * sector_intensity, 185, 245))
            draw_plate.rectangle([x0, y0, x1 - 1, y1 - 1], fill=plate_alpha)

            # Sample 4x2 sub-grid for authentic 8-dot Unicode Braille encoding
            sub_4x2 = np.zeros((4, 2), dtype=np.float32)
            for sr in range(4):
                sy0 = (sr * ph) // 4
                sy1 = max(sy0 + 1, ((sr + 1) * ph) // 4)
                for sc in range(2):
                    sx0 = (sc * pw) // 2
                    sx1 = max(sx0 + 1, ((sc + 1) * pw) // 2)
                    sub_4x2[sr, sc] = float(patch_y[sy0:sy1, sx0:sx1].mean())

            # Normalise sub-cell luminance across the white sector + local contrast + Bayer dither
            # so smooth gradients naturally step through 2..8 Braille dots without solid diagonal stripe artefacts
            local_dev = (sub_4x2 - mean_y) * 2.6
            norm_sub = (sub_4x2 - white_cutoff) / white_span + local_dev + _BRAILLE_BAYER_4X2
            # Add subtle cell-checker modulation at peak brightness so 100% white still shows rich 6/7/8-dot Braille texture
            cell_mod = 0.12 if ((r_idx + c_idx) % 2 == 1) else 0.0
            active_dots = norm_sub >= (0.38 + cell_mod)
            if int(np.sum(active_dots)) < 2:
                active_dots[0, 0] = True
                active_dots[2, 1] = True

            # Along sharp high-energy structural edges on full-size cells, sprinkle Bandarchy cyber mutant glyphs
            if ph >= 12 and pw >= 7 and mean_g > 0.56 and ((r_idx * 7 + c_idx * 13) % 9 == 0):
                glyph = mutant_accents[(r_idx * 3 + c_idx) % len(mutant_accents)]
                draw_glyph.text((x0 + 1, y0 - 1), glyph, fill=col_u8, font=font)
                draw_mask.text((x0 + 1, y0 - 1), glyph, fill=int(250 * sector_intensity), font=font)
            else:
                # Render crisp 2x4 Braille dot matrix scaled to cell dimensions (never overlapping on partial border cells)
                n_sr = 4 if ph >= 8 else max(1, ph // 3)
                n_sc = 2 if pw >= 4 else 1
                dot_rx = min(max(0.55, pw * 0.125), max(0.55, (pw / (2.0 * n_sc)) * 0.65))
                dot_ry = min(max(0.55, ph * 0.078), max(0.55, (ph / (2.0 * n_sr)) * 0.65))
                for sr in range(n_sr):
                    cy = y0 + (sr + 0.5) * (ph / float(n_sr))
                    for sc in range(n_sc):
                        cx = x0 + (sc + 0.5) * (pw / float(n_sc))
                        if active_dots[sr, sc]:
                            bbox = [cx - dot_rx, cy - dot_ry, cx + dot_rx, cy + dot_ry]
                            draw_glyph.ellipse(bbox, fill=col_u8)
                            draw_mask.ellipse(bbox, fill=int(250 * sector_intensity))
                        elif ph >= 10 and pw >= 6:
                            # Subtle dim inactive matrix pin so the 2x4 terminal grid structure reads clearly
                            dim_col = tuple(max(10, c // 6) for c in col_u8)
                            draw_glyph.point((int(round(cx)), int(round(cy))), fill=dim_col)
                            draw_mask.point((int(round(cx)), int(round(cy))), fill=int(48 * sector_intensity))

    glyph_np = np.asarray(glyph_layer, dtype=np.float32) / 255.0
    mask_np = (np.asarray(mask_layer, dtype=np.float32) / 255.0)[..., None]
    # Feather the obsidian terminal plate slightly so sector boundaries are smooth and organic
    plate_raw = np.asarray(plate_layer, dtype=np.float32) / 255.0
    plate_np = np.maximum(plate_raw, gaussian_blur_np(plate_raw, radius=2.8))[..., None]

    # Deep obsidian terminal plate behind the white-sector Braille cells (retaining 10% stark photo ghost)
    obsidian = hex_to_rgb_float(DEFAULT_THEME_COLOURS["obsidian"])
    staged_base = bw_base * (1.0 - plate_np * 0.90) + obsidian[None, None, :] * (plate_np * 0.90)
    # Subtle neon rim along the boundary of the obsidian terminal plate
    plate_edge = np.clip(np.abs(plate_raw - gaussian_blur_np(plate_raw, radius=2.2)) * 3.0, 0.0, 1.0)[..., None]

    glow_tight = gaussian_blur_np(glyph_np, radius=1.15)
    glow_wide = gaussian_blur_np(glyph_np, radius=2.6)
    neon_scale = 1.0 + 0.16 * bass_c
    neon_braille = np.clip((glyph_np * 1.15 + glow_tight * 0.44 + glow_wide * 0.16) * neon_scale, 0.0, 1.0)

    # White-hot inner core at Braille dot centres
    core_boost = np.clip(mask_np * 1.32 - 0.65, 0.0, 1.0) * (0.42 + 0.12 * high_c)
    out = staged_base * (1.0 - mask_np * 0.92) + neon_braille + core_boost + plate_edge * snatched_rgb * 0.32
    out_u8 = np.clip(out * 255.0, 0.0, 255.0).astype(np.uint8)
    return Image.fromarray(out_u8, mode="RGB")


# ---------------------------------------------------------------------------
# Effect 16: 16_Prism_Kaleidoscope_Sector_Snatch
# ---------------------------------------------------------------------------

def _regular_polygon_sdf(dx: np.ndarray, dy: np.ndarray, radius: float, n_sides: int, rotation_rad: float = 0.0) -> np.ndarray:
    """Signed distance (negative inside, positive outside) to a regular n-sided polygon."""
    ang = np.arctan2(dy, dx) - rotation_rad
    sector = 2.0 * math.pi / n_sides
    local_ang = ((ang + sector * 0.5) % sector) - sector * 0.5
    r = np.hypot(dx, dy)
    inradius = radius * math.cos(math.pi / n_sides)
    return r * np.cos(local_ang) - inradius


def _bilinear_sample_channel(channel: np.ndarray, kx: np.ndarray, ky: np.ndarray) -> np.ndarray:
    """Vectorised bilinear interpolation on a 2D `(H, W)` float32 channel."""
    h_img, w_img = channel.shape
    x_clamped = np.clip(kx, 0.0, float(w_img - 1))
    y_clamped = np.clip(ky, 0.0, float(h_img - 1))

    x0 = np.floor(x_clamped).astype(np.int32)
    y0 = np.floor(y_clamped).astype(np.int32)
    x1 = np.minimum(x0 + 1, w_img - 1)
    y1 = np.minimum(y0 + 1, h_img - 1)

    wx = (x_clamped - x0).astype(np.float32)
    wy = (y_clamped - y0).astype(np.float32)

    v00 = channel[y0, x0]
    v01 = channel[y0, x1]
    v10 = channel[y1, x0]
    v11 = channel[y1, x1]

    top = v00 * (1.0 - wx) + v01 * wx
    bot = v10 * (1.0 - wx) + v11 * wx
    return top * (1.0 - wy) + bot * wy


def effect_16_prism_kaleidoscope_sector_Snatch(
    img: Image.Image,
    *,
    palette_index: int = 0,
    bass: float = 0.5,
    high: float = 0.5,
) -> Image.Image:
    """16_Prism_Kaleidoscope_Sector_Snatch:
    Outer frame locked to stark B&W high-contrast photography while a central
    sacred-geometry diamond/hexagonal sector snatches and reflects the colour sectors.
    """
    bass_c = _clamp_unit(bass, 0.5)
    high_c = _clamp_unit(high, 0.5)
    rgb = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0
    h_img, w_img = rgb.shape[:2]
    decomp = compute_luminance_and_sectors(rgb)
    y_stark = decomp["y_stark"]
    grad_norm = decomp["grad_norm"]

    # 1. Outer frame locked to stark high-contrast B&W photography
    bw_outer = make_stark_bw_base(y_stark, grad_norm)

    # 2. Coordinate grid centred at `(cx, cy)` with aspect compensation on extreme banner aspect ratios
    cy = h_img * 0.5
    cx = w_img * 0.5
    min_dim = float(min(w_img, h_img))
    max_dim = float(max(w_img, h_img))
    aspect = max_dim / max(min_dim, 1.0)

    yy, xx = np.meshgrid(np.arange(h_img, dtype=np.float32), np.arange(w_img, dtype=np.float32), indexing="ij")
    dx_raw = xx - cx
    dy_raw = yy - cy

    if aspect > 1.8:
        # Gently compress the long axis so the central sacred-geometry aperture stays prominent on banners
        long_scale = math.sqrt(aspect / 1.35)
        dx = dx_raw / (long_scale if w_img > h_img else 1.0)
        dy = dy_raw / (long_scale if h_img > w_img else 1.0)
    else:
        dx = dx_raw
        dy = dy_raw

    r = np.hypot(dx, dy)
    theta = np.arctan2(dy, dx)  # [-pi, pi]

    # Sacred-geometry aperture: union of central Hexagon + rotated Diamond/Octagram star
    r_outer = min_dim * 0.42
    r_mid = min_dim * 0.29
    r_inner = min_dim * 0.145

    sdf_hex = _regular_polygon_sdf(dx, dy, radius=r_outer, n_sides=6, rotation_rad=math.pi / 6.0)
    sdf_diamond = _regular_polygon_sdf(dx, dy, radius=r_outer * 1.05, n_sides=4, rotation_rad=math.pi / 4.0)
    sdf_square = _regular_polygon_sdf(dx, dy, radius=r_outer * 0.96, n_sides=4, rotation_rad=0.0)
    sdf_outer = np.minimum(sdf_hex, np.minimum(sdf_diamond, sdf_square))

    sdf_mid_hex = _regular_polygon_sdf(dx, dy, radius=r_mid, n_sides=6, rotation_rad=0.0)
    sdf_inner_dia = _regular_polygon_sdf(dx, dy, radius=r_inner, n_sides=4, rotation_rad=math.pi / 4.0)

    # Anti-aliased sacred-geometry aperture mask (1.0 inside prism, 0.0 in stark B&W outer frame)
    aa_width = max(1.2, min_dim * 0.003)
    prism_mask = np.clip(0.5 - sdf_outer / aa_width, 0.0, 1.0).astype(np.float32)

    # 3. 12-fold (6-axis dihedral) kaleidoscopic reflection + radial prism refraction inside the sector
    snatched_rgb = synthesise_snatched_colours(rgb, decomp, palette_index=palette_index, sat_boost=2.25)
    shaded_colour = np.clip(
        snatched_rgb * (0.28 + 0.88 * y_stark[..., None]) + 0.22 * grad_norm[..., None] * snatched_rgb,
        0.0,
        1.0,
    ).astype(np.float32)

    n_folds = 12  # 6 mirror axes = 12 sectors of 30 degrees
    sector_angle = (2.0 * math.pi) / n_folds
    theta_pos = (theta + 2.0 * math.pi) % (2.0 * math.pi)
    sector_idx = np.floor(theta_pos / sector_angle).astype(np.int32)
    local_theta = theta_pos - sector_idx * sector_angle
    # Mirror every odd sector for true dihedral kaleidoscope symmetry
    folded_theta = np.where(sector_idx % 2 == 1, sector_angle - local_theta, local_theta)
    # Offset reference angle to sample rich central/diagonal image features
    ref_angle = folded_theta + math.pi * 0.22

    # Ring-dependent radial refraction (inner diamond, mid hexagon, outer octagram facets)
    ring_zoom = np.where(sdf_inner_dia < 0.0, 0.72, np.where(sdf_mid_hex < 0.0, 0.88, 1.04))
    r_kaleido = r * ring_zoom

    # Bilinearly sample kaleidoscopic coordinates with subtle RGB prism chromatic dispersion
    kaleido_rgb = np.zeros_like(rgb)
    disp_px = max(0.8, min_dim * 0.0032) * (0.85 + 0.30 * bass_c)
    dispersion_shifts = (-disp_px, 0.0, disp_px)
    cos_ref = np.cos(ref_angle)
    sin_ref = np.sin(ref_angle)
    for ch_idx, disp in enumerate(dispersion_shifts):
        kx = cx + (r_kaleido + disp) * cos_ref
        ky = cy + (r_kaleido + disp) * sin_ref
        kaleido_rgb[..., ch_idx] = _bilinear_sample_channel(shaded_colour[..., ch_idx], kx, ky)

    # Apply facet-indexed prismatic hue shimmer and blend strongly toward pure 12-fold symmetry
    hk, sk, vk = rgb_to_hsv_np(kaleido_rgb)
    facet_hue_shift = ((sector_idx % 6) - 2.5) * 0.028
    kaleido_prism = hsv_to_rgb_np(
        (hk + facet_hue_shift) % 1.0,
        np.clip(sk * 1.15, 0.48, 1.0),
        np.clip(vk * 1.12, 0.0, 1.0),
    )
    interior_rgb = np.clip(0.80 * kaleido_prism + 0.20 * shaded_colour, 0.0, 1.0)

    # 4. Sacred-geometry wireframe boundaries & radial facet ribs
    lw = max(0.9, min_dim * 0.0022)
    line_outer = np.exp(-np.square(sdf_outer / (lw * 1.2)))
    line_hex = np.exp(-np.square(sdf_hex / lw)) * (sdf_outer <= lw * 1.5)
    line_dia = np.exp(-np.square(sdf_diamond / lw)) * (sdf_outer <= lw * 1.5)
    line_mid = np.exp(-np.square(sdf_mid_hex / lw)) * (sdf_outer <= 0.0)
    line_inner = np.exp(-np.square(sdf_inner_dia / lw)) * (sdf_outer <= 0.0)

    # Radial facet spokes along the 12 kaleidoscope mirror axes
    spoke_dist = r * np.sin(np.minimum(local_theta, sector_angle - local_theta))
    line_spokes = np.exp(-np.square(spoke_dist / (lw * 0.85))) * (sdf_outer <= 0.0) * (r >= r_inner * 0.35)

    wire_core = np.clip(
        line_outer * 1.0 + line_hex * 0.65 + line_dia * 0.65 + line_mid * 0.75 + line_inner * 0.85 + line_spokes * 0.55,
        0.0,
        1.0,
    ).astype(np.float32) * (0.90 + 0.10 * high_c)
    wire_glow = gaussian_blur_np(wire_core, radius=max(1.0, min_dim * 0.004))

    emerald = hex_to_rgb_float(DEFAULT_THEME_COLOURS["emerald"])
    magenta = hex_to_rgb_float(DEFAULT_THEME_COLOURS["magenta"])
    chalk = np.array([1.0, 1.0, 1.0], dtype=np.float32)
    glow_tint = emerald[None, None, :] * 0.6 + magenta[None, None, :] * 0.4

    # Darken outer B&W slightly right outside the prism border for dramatic sacred-geometry separation
    shadow_falloff = max(3.0, min_dim * 0.018)
    outer_shadow = np.exp(-np.square(np.maximum(sdf_outer, 0.0) / shadow_falloff)) * (sdf_outer > 0.0)
    bw_framed = bw_outer * (1.0 - outer_shadow[..., None] * 0.45)

    pm = prism_mask[..., None]
    combined = bw_framed * (1.0 - pm) + interior_rgb * pm
    combined = np.clip(combined + wire_glow[..., None] * glow_tint * 0.85, 0.0, 1.0)
    combined = combined * (1.0 - wire_core[..., None] * 0.92) + chalk[None, None, :] * (wire_core[..., None] * 0.92)

    out_u8 = np.clip(combined * 255.0, 0.0, 255.0).astype(np.uint8)
    return Image.fromarray(out_u8, mode="RGB")


# Allow both exact British/canonical casing aliases
effect_16_prism_kaleidoscope_sector_snatch = effect_16_prism_kaleidoscope_sector_Snatch


# ---------------------------------------------------------------------------
# Registry of Family 4 Effects (13–16)
# ---------------------------------------------------------------------------

EFFECTS_FAMILY_4: dict[str, Callable[..., Image.Image]] = {
    "13_Obsidian_Neon_Edge_Snatch": effect_13_obsidian_neon_edge_snatch,
    "14_Metallic_Relief_Sector_Snatch": effect_14_metallic_relief_sector_snatch,
    "15_Braille_Matrix_Sector_Snatch": effect_15_braille_matrix_sector_snatch,
    "16_Prism_Kaleidoscope_Sector_Snatch": effect_16_prism_kaleidoscope_sector_snatch,
}


def apply_effect(
    effect_name: str,
    source_path: str,
    output_path: str | None = None,
    *,
    palette_index: int = 0,
    bass: float = 0.5,
    mid: float = 0.5,
    high: float = 0.5,
) -> tuple[Image.Image, str | None]:
    """Apply a named Family 4 effect to `source_path` and optionally write to `output_path`."""
    if effect_name not in EFFECTS_FAMILY_4:
        raise BandarchyEffectError(
            f"Unknown Family 4 effect '{effect_name}'. Valid: {list(EFFECTS_FAMILY_4)}"
        )
    img = safe_read_image(source_path)
    fn = EFFECTS_FAMILY_4[effect_name]
    kwargs = {"palette_index": palette_index, "bass": bass}
    if "mid" in fn.__code__.co_varnames:
        kwargs["mid"] = mid
    if "high" in fn.__code__.co_varnames:
        kwargs["high"] = high
    result_img = fn(img, **kwargs)
    saved_path = None
    if output_path:
        saved_path = safe_write_image(result_img, output_path)
    return result_img, saved_path


# ---------------------------------------------------------------------------
# Contact Sheet Generation for Visual Review
# ---------------------------------------------------------------------------

def build_effect_contact_sheet(
    effect_name: str,
    pairs: list[tuple[str, Image.Image, Image.Image]],
    output_path: str,
) -> str:
    """Create a labelled contact sheet for a single effect across all 12 source images."""
    thumb_w, thumb_h = 320, 240
    pad = 18
    header_h = 68
    label_h = 34
    cols = 4
    rows = max(1, math.ceil(len(pairs) / cols))

    sheet_w = pad + cols * (thumb_w + pad)
    sheet_h = header_h + pad + rows * (thumb_h + label_h + pad)

    sheet = Image.new("RGB", (sheet_w, sheet_h), (7, 9, 14))
    draw = ImageDraw.Draw(sheet)
    title_font = _load_monospace_font(20)
    sub_font = _load_monospace_font(12)

    draw.rectangle([0, 0, sheet_w, header_h], fill=(13, 18, 28))
    draw.text(
        (pad, 14),
        f"BANDARCHY STARK SNAPSHOT & SECTOR COLOUR-SNATCH — {effect_name}",
        fill=(110, 231, 183),
        font=title_font,
    )
    draw.text(
        (pad, 42),
        "Family 4 (Neon Edge Contours, Metallic Relief, Braille Matrix & Sacred-Geometry Prism) — British English",
        fill=(203, 213, 225),
        font=sub_font,
    )

    for idx, (stem, orig_im, fx_im) in enumerate(pairs):
        r_idx = idx // cols
        c_idx = idx % cols
        x0 = pad + c_idx * (thumb_w + pad)
        y0 = header_h + pad + r_idx * (thumb_h + label_h + pad)

        thumb = fx_im.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        # Inset small original preview in bottom-right corner for instant before/after comparison
        inset_w, inset_h = 84, 63
        inset = orig_im.resize((inset_w, inset_h), Image.Resampling.LANCZOS)
        thumb.paste(inset, (thumb_w - inset_w - 6, thumb_h - inset_h - 6))
        t_draw = ImageDraw.Draw(thumb)
        t_draw.rectangle(
            [thumb_w - inset_w - 6, thumb_h - inset_h - 6, thumb_w - 6, thumb_h - 6],
            outline=(110, 231, 183),
            width=1,
        )

        sheet.paste(thumb, (x0, y0))
        draw.rectangle([x0 - 1, y0 - 1, x0 + thumb_w, y0 + thumb_h], outline=(51, 65, 85), width=1)
        draw.text((x0 + 2, y0 + thumb_h + 6), stem[:38], fill=(226, 232, 240), font=sub_font)

    return safe_write_image(sheet, output_path)


def build_family4_master_contact_sheet(
    results_by_source: list[tuple[str, Image.Image, dict[str, Image.Image]]],
    output_path: str,
) -> str:
    """Create the master Family 4 comparison grid: 12 rows (sources) × 5 columns (Original + Effects 13–16)."""
    thumb_w, thumb_h = 256, 192
    pad = 14
    header_h = 76
    row_label_h = 24
    col_headers = [
        "00_Original_Source",
        "13_Obsidian_Neon_Edge_Snatch",
        "14_Metallic_Relief_Sector_Snatch",
        "15_Braille_Matrix_Sector_Snatch",
        "16_Prism_Kaleidoscope_Sector_Snatch",
    ]
    cols = len(col_headers)
    rows = len(results_by_source)

    sheet_w = pad + cols * (thumb_w + pad)
    sheet_h = header_h + pad + rows * (thumb_h + row_label_h + pad)

    sheet = Image.new("RGB", (sheet_w, sheet_h), (7, 9, 14))
    draw = ImageDraw.Draw(sheet)
    title_font = _load_monospace_font(19)
    col_font = _load_monospace_font(12)
    label_font = _load_monospace_font(11)

    draw.rectangle([0, 0, sheet_w, header_h], fill=(13, 18, 28))
    draw.text(
        (pad, 12),
        "BANDARCHY FAMILY 4 CONTACT SHEET — EFFECTS 13–16 ACROSS ALL 12 SOURCES (COLOUR & B&W)",
        fill=(110, 231, 183),
        font=title_font,
    )
    for c_idx, cname in enumerate(col_headers):
        cx = pad + c_idx * (thumb_w + pad)
        accent = (244, 114, 182) if c_idx > 0 else (148, 163, 184)
        draw.text((cx + 2, 46), cname[:34], fill=accent, font=col_font)

    for r_idx, (stem, orig_im, fx_map) in enumerate(results_by_source):
        y0 = header_h + pad + r_idx * (thumb_h + row_label_h + pad)
        row_imgs = [orig_im] + [fx_map[k] for k in col_headers[1:]]
        for c_idx, im in enumerate(row_imgs):
            x0 = pad + c_idx * (thumb_w + pad)
            thumb = im.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            sheet.paste(thumb, (x0, y0))
            border_col = (110, 231, 183) if c_idx > 0 else (71, 85, 105)
            draw.rectangle([x0 - 1, y0 - 1, x0 + thumb_w, y0 + thumb_h], outline=border_col, width=1)
            caption = f"{stem}" if c_idx == 0 else f"{col_headers[c_idx][:18]} • {stem[:16]}"
            draw.text((x0 + 2, y0 + thumb_h + 4), caption, fill=(226, 232, 240), font=label_font)

    return safe_write_image(sheet, output_path)


def run_batch(
    base_dir: str | None = None,
    sources_dir: str | None = None,
    effects_dir: str | None = None,
) -> dict:
    """Run all 4 Family 4 effects (13–16) across every source image in `sources_dir`."""
    t0 = time.monotonic()
    root_dir = resolve_pictures_bandarchy_dir(base_dir)
    src_dir = os.path.abspath(sources_dir or os.path.join(root_dir, "sources"))
    out_dir = os.path.abspath(effects_dir or os.path.join(root_dir, "effects"))
    os.makedirs(out_dir, mode=0o755, exist_ok=True)

    source_files = sorted(
        p
        for p in glob.glob(os.path.join(src_dir, "*"))
        if os.path.splitext(p)[1].lower() in IMAGE_EXTENSIONS and os.path.isfile(p) and not os.path.islink(p)
    )
    if not source_files:
        raise BandarchyEffectError(f"No valid source images found in {src_dir}")

    generated_files: list[str] = []
    per_effect_pairs: dict[str, list[tuple[str, Image.Image, Image.Image]]] = {
        name: [] for name in EFFECTS_FAMILY_4
    }
    master_rows: list[tuple[str, Image.Image, dict[str, Image.Image]]] = []

    for idx, src_path in enumerate(source_files):
        stem = os.path.splitext(os.path.basename(src_path))[0]
        orig_img = safe_read_image(src_path)
        fx_map: dict[str, Image.Image] = {}

        for effect_idx, (effect_name, effect_fn) in enumerate(EFFECTS_FAMILY_4.items()):
            pal_idx = (idx + effect_idx) % len(BANDARCHY_PALETTES)
            fx_img = effect_fn(orig_img, palette_index=pal_idx)
            out_name = f"{effect_name}__{stem}.png"
            out_path = os.path.join(out_dir, out_name)
            safe_write_image(fx_img, out_path)
            generated_files.append(out_path)
            per_effect_pairs[effect_name].append((stem, orig_img, fx_img))
            fx_map[effect_name] = fx_img

        master_rows.append((stem, orig_img, fx_map))

    contact_sheets: list[str] = []
    for effect_name, pairs in per_effect_pairs.items():
        cs_path = os.path.join(out_dir, f"ContactSheet_{effect_name}.png")
        build_effect_contact_sheet(effect_name, pairs, cs_path)
        contact_sheets.append(cs_path)

    master_cs_1 = os.path.join(out_dir, "ContactSheet_Family4_EdgeReliefBraillePrism.png")
    master_cs_2 = os.path.join(out_dir, "ContactSheet_Family4.png")
    build_family4_master_contact_sheet(master_rows, master_cs_1)
    build_family4_master_contact_sheet(master_rows, master_cs_2)
    contact_sheets.extend([master_cs_1, master_cs_2])

    elapsed = round(time.monotonic() - t0, 3)
    return {
        "ok": True,
        "family": 4,
        "effects": list(EFFECTS_FAMILY_4.keys()),
        "sources_count": len(source_files),
        "outputs_count": len(generated_files),
        "contact_sheets": contact_sheets,
        "elapsed_seconds": elapsed,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Bandarchy Stark Snapshot & Sector Colour-Snatch — Family 4 (Effects 13–16)"
    )
    parser.add_argument("--base-dir", default=None, help="Override ~/Pictures/bandarchy directory")
    parser.add_argument("--sources-dir", default=None, help="Override sources directory")
    parser.add_argument("--effects-dir", default=None, help="Override effects output directory")
    parser.add_argument("--source", default=None, help="Process a single source image path")
    parser.add_argument(
        "--effect",
        default=None,
        choices=list(EFFECTS_FAMILY_4.keys()),
        help="Single effect to apply when --source is given",
    )
    parser.add_argument("--output", default=None, help="Target output path for single image mode")
    parser.add_argument("--palette-index", type=int, default=0, help="Bandarchy palette index (0..4)")
    parser.add_argument("--json", action="store_true", help="Emit bounded JSON status on stdout")
    args = parser.parse_args(argv)

    try:
        if args.source:
            eff = args.effect or "13_Obsidian_Neon_Edge_Snatch"
            out_path = args.output
            if not out_path:
                root_dir = resolve_pictures_bandarchy_dir(args.base_dir)
                stem = os.path.splitext(os.path.basename(args.source))[0]
                out_path = os.path.join(root_dir, "effects", f"{eff}__{stem}.png")
            _, saved = apply_effect(
                eff,
                args.source,
                out_path,
                palette_index=args.palette_index,
            )
            payload = {"ok": True, "effect": eff, "source": args.source, "output": saved}
        else:
            payload = run_batch(
                base_dir=args.base_dir,
                sources_dir=args.sources_dir,
                effects_dir=args.effects_dir,
            )
        if args.json:
            print(json.dumps(payload, ensure_ascii=False))
        else:
            print(
                f"[Family 4] Processed {payload.get('sources_count', 1)} source(s) -> "
                f"{payload.get('outputs_count', 1)} output image(s) in {payload.get('elapsed_seconds', 0.0)}s"
            )
        return 0
    except Exception as exc:
        err = {"ok": False, "error": str(exc)}
        if args.json:
            print(json.dumps(err, ensure_ascii=False))
        else:
            print(f"[Family 4 Error] {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
