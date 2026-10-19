#!/usr/bin/env python3
"""Bandarchy Stage-2 Real-Time Photo Motion Engine — Group D (Effects M19–M25).

World-Bending Warps, Palette Resonance, Relativistic Portals & Fade/Opacity Pipeline.

This module implements Group D (`M19`–`M25`) of Bandarchy's 25 Stage-2 real-time
photo motion, flicker, mirror, tiling, separation, strobe, and world-bending
visualiser effects, operating directly on the 16 pre-rendered Stage-1 Stark &
Sector Colour-Snatch variants in `~/Pictures/bandarchy/processed/<category>/`.

Implemented Group D Effects (`M19`–`M25`):
- `M19_Palette_Resonance_Hyper_Enhancer`:
  Analyses pixel hues against the active Bandarchy palette (`PALETTES[palette_index]`,
  30 palettes) and Omarchy theme colours; pixels matching active palette hues are
  hyper-enhanced with neon bloom, shockwave rings, and harmonic pulsing while
  non-matching hues lock to stark obsidian/chalk B&W, strobing across the 16
  variants of the same image.
- `M20_Event_Horizon_Gravitational_Lens`:
  Orbits twin relativistic black holes across the photo plane, bending
  architectural/custom lines into Einstein lensing rings while pulling
  colour-snatched sectors into a swirling palette-coloured accretion vortex.
- `M21_Mobius_Cylinder_And_Torus_Tunnel_Wrap`:
  Wraps the 2D photo plane around a spinning 3D cylinder / Möbius torus tunnel
  that the camera flies through, seamlessly stitching multiple Stark effect
  variants (`01..16`) of the same image along the tunnel rings.
- `M22_Liquid_Acid_Domain_Warp_Melt`:
  Applies an audio-reactive curl-noise / liquid plasma displacement field that
  melts the photo's white and colour-snatched sectors on mid-synth swells while
  snapping back to stark geometry on kick transients.
- `M23_Luma_Key_Vortex_Portal_Bleed`:
  Turns the photo's obsidian black sectors (`Y < 0.12`) or stark white sectors
  (`Y > 0.85`) into live transparent alpha portals through which a psychedelic
  vortex / synth-grid field bleeds and counter-rotates while the foreground
  strobes across the 16 variants.
- `M24_Cymatic_Chladni_Standing_Wave_Ripple`:
  Superimposes 2D Chladni nodal standing-wave harmonics
  (`cos(n*pi*x)*cos(m*pi*y) - cos(m*pi*x)*cos(n*pi*y)`) driven by live
  bass/mid/high bands, vibrating the photo plane and strobing between two Stark
  variants along the nodal lines.
- `M25_Hyperdrive_Volumetric_Radial_Extrusion`:
  Extrudes the bright white and palette-matched colour sectors into 3D
  volumetric god-rays / light-beams shooting toward the viewer from an orbiting
  vanishing point while cycling through the 16 processed variants of the same image.

Fade & Opacity Pipeline Included:
- `photo_opacity` (`0.05`–`1.00`, default `0.85`): Master Photo Layer alpha.
- `photo_fade_duration` (`0.0`–`6.0` seconds): Smooth cross-dissolve vs instant strobe
  across the 16 Stark variants of the same photograph or between category snapshots.
- Sector-Selective Opacity (`photo_black_opacity`, `photo_mid_opacity`,
  `photo_white_opacity`, `photo_colour_snatch_opacity`): Independently fades
  obsidian black, silver mid-tone, chalk white, or colour-snatched sectors so
  Bandarchy's underlying GPU Vortex or 3D Worlds shine through.
- Audio-Responder Opacity Link (`l_photo_opacity`): Modulates layer opacity from
  `Drop vs Breakdown`, `Kick & Sub-Bass`, `Mid Synth`, or `Beat Onset`.
"""

from __future__ import annotations

import argparse
import glob
import io
import json
import math
import os
import stat
import sys
import tempfile
import time
from typing import Any, Callable

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

os.umask(0o077)

MAX_ART_BYTES = 15 * 1024 * 1024
MAX_IMAGE_PIXELS = 36_000_000
Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")

# All 16 Stage-1 Stark & Sector Colour-Snatch Effect IDs
STAGE1_EFFECT_IDS: tuple[str, ...] = (
    "01_SinCity_Chroma_Snatch",
    "02_White_Sector_Colour_Snatch",
    "03_Shadow_Void_Neon_Snatch",
    "04_Slash_Window_Sector_Snatch",
    "05_Omarchy_Cyber_Tritone_Stark",
    "06_Brutalist_Woodcut_Spot_Snatch",
    "07_Sabattier_Solarised_Snatch",
    "08_Acid_Poster_4Sector_Snatch",
    "09_Zine_Halftone_Colour_Snatch",
    "10_Pulsar_Ridgeline_Colour_Snatch",
    "11_Glitch_Sector_Chromatic_Shear",
    "12_CRT_Phosphor_Sector_Snatch",
    "13_Obsidian_Neon_Edge_Snatch",
    "14_Metallic_Relief_Sector_Snatch",
    "15_Braille_Matrix_Sector_Snatch",
    "16_Prism_Kaleidoscope_Sector_Snatch",
)

# All 30 Bandarchy Palettes from PsychedelicEngine.js (strictly synchronised)
PALETTE_NAMES: list[str] = [
    "Acid Rainbow",
    "Cyber Neon",
    "Solar Flare",
    "Bioluminescence",
    "Ultraviolet Rave",
    "Deep Nebula",
    "Emerald Matrix",
    "Blood Moon",
    "Cosmic Gold",
    "Arctic Aurora",
    "Tokyo Synthwave",
    "Electric Plasma",
    "Toxic Acid 303",
    "Outrun Sunset",
    "Holographic Prism",
    "DMT Hyperspace",
    "Sub-Zero Cryo",
    "Volcanic Magma",
    "Vaporwave Mall",
    "Quantum Supernova",
    "Jungle Biolume",
    "Berlin Strobe",
    "Amethyst Crystal",
    "Copper Demoscene",
    "Abalone Pearl",
    "Radioactive Isotope",
    "Starlight Quasar",
    "Crimson Velvet",
    "Oceanic Trench",
    "Prismatic Kaleidoscope",
]

PALETTES: list[list[str]] = [
    ["#ff007f", "#00f5d4", "#fee440", "#9b5de5", "#00bbf9", "#f15bb5"],
    ["#00f5ff", "#ff2a85", "#7b2cbf", "#38b000", "#ffbe0b", "#4cc9f0"],
    ["#ff4800", "#ff9e00", "#ff0055", "#ffd000", "#ff6d00", "#ff206e"],
    ["#00f5d4", "#38bdf8", "#a78bfa", "#4ade80", "#f472b6", "#2dd4bf"],
    ["#c084fc", "#f472b6", "#38bdf8", "#818cf8", "#e879f9", "#22d3ee"],
    ["#6366f1", "#ec4899", "#14b8a6", "#f59e0b", "#8b5cf6", "#06b6d4"],
    ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#059669", "#22d3ee"],
    ["#ef4444", "#f97316", "#f43f5e", "#eab308", "#ec4899", "#dc2626"],
    ["#fbbf24", "#f59e0b", "#fde047", "#38bdf8", "#f472b6", "#fb923c"],
    ["#2dd4bf", "#38bdf8", "#818cf8", "#c084fc", "#4ade80", "#60a5fa"],
    ["#ff00a0", "#00f0ff", "#7a04eb", "#fe75fe", "#ff124f", "#05d9e8"],
    ["#00ffff", "#7df9ff", "#b5179e", "#4cc9f0", "#f72585", "#4361ee"],
    ["#ccff00", "#00ff66", "#ff0055", "#faff00", "#10b981", "#7c3aed"],
    ["#ff2a6d", "#ff9e00", "#d1f7ff", "#05d9e8", "#7700a6", "#ffbe0b"],
    ["#67e8f9", "#f472b6", "#c084fc", "#fde047", "#34d399", "#fb7185"],
    ["#ff007f", "#ffbe0b", "#8338ec", "#3a86ff", "#fb5607", "#06d6a0"],
    ["#00f5d4", "#00bbf9", "#e0fbfc", "#38bdf8", "#818cf8", "#90e0ef"],
    ["#ff1744", "#ff6d00", "#ffea00", "#d50000", "#ff9100", "#ff3d00"],
    ["#ff71ce", "#01cdfe", "#05ffa1", "#b967ff", "#fffb96", "#f687b3"],
    ["#f72585", "#4cc9f0", "#ffd166", "#7209b7", "#06d6a0", "#ef476f"],
    ["#4ade80", "#a3e635", "#2dd4bf", "#facc15", "#38bdf8", "#c084fc"],
    ["#f8fafc", "#ff1e38", "#00e5ff", "#e2e8f0", "#f43f5e", "#38bdf8"],
    ["#d8b4fe", "#a855f7", "#f472b6", "#818cf8", "#e879f9", "#60a5fa"],
    ["#ff9f1c", "#ffbf69", "#e71d36", "#2ec4b6", "#cbf3f0", "#ff595e"],
    ["#a5f3fc", "#f9a8d4", "#d8b4fe", "#fde68a", "#6ee7b7", "#93c5fd"],
    ["#a3e635", "#22c55e", "#eab308", "#06b6d4", "#d9f99d", "#14b8a6"],
    ["#38bdf8", "#f43f5e", "#fbbf24", "#a855f7", "#2dd4bf", "#ffffff"],
    ["#ff0054", "#ff5400", "#ffbd00", "#9e0059", "#390099", "#ff85a1"],
    ["#00e5ff", "#0077b6", "#48cae4", "#00f5d4", "#7209b7", "#90e0ef"],
    ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff924c"],
]

DEFAULT_OMARCHY_THEME_COLOURS: dict[str, str] = {
    "accent": "#6ee7b7",
    "urgent": "#f472b6",
    "cyan": "#38bdf8",
    "gold": "#fbbf24",
    "foreground": "#e2e8f0",
    "background": "#07090e",
}

GROUP4_EFFECT_NAMES: tuple[str, ...] = (
    "M19_Palette_Resonance_Hyper_Enhancer",
    "M20_Event_Horizon_Gravitational_Lens",
    "M21_Mobius_Cylinder_And_Torus_Tunnel_Wrap",
    "M22_Liquid_Acid_Domain_Warp_Melt",
    "M23_Luma_Key_Vortex_Portal_Bleed",
    "M24_Cymatic_Chladni_Standing_Wave_Ripple",
    "M25_Hyperdrive_Volumetric_Radial_Extrusion",
)

FONT_CANDIDATES = (
    "/usr/share/fonts/TTF/JetBrainsMonoNerdFont-Bold.ttf",
    "/usr/share/fonts/TTF/JetBrainsMonoNerdFont-Regular.ttf",
    "/usr/share/fonts/TTF/DejaVuSansMono-Bold.ttf",
    "/usr/share/fonts/TTF/DejaVuSansMono.ttf",
    "/usr/share/fonts/noto/NotoSansMono-Bold.ttf",
)


class PhotoMotionGroup4Error(ValueError):
    """Operational error raised on invalid or unsafe photo motion inputs."""


def _clamp(val: float, lo: float = 0.0, hi: float = 1.0, default: float = 0.5) -> float:
    """Safely clamp a float into `[lo, hi]`, guarding against NaN and Inf."""
    try:
        fval = float(val)
    except (TypeError, ValueError):
        return default
    if not math.isfinite(fval):
        return default
    return min(max(fval, lo), hi)


def resolve_pictures_bandarchy_dir(custom_dir: str | None = None) -> str:
    """Resolve `$XDG_PICTURES_DIR/bandarchy` or fallback to `~/Pictures/bandarchy`."""
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
    """Convert `#RRGGBB` string into float32 RGB array in `[0.0, 1.0]`."""
    clean = str(hex_colour or "").strip().lstrip("#")
    if len(clean) == 3:
        clean = "".join(ch * 2 for ch in clean)
    if len(clean) < 6:
        return np.array([0.431, 0.906, 0.718], dtype=np.float32)
    try:
        r = int(clean[0:2], 16) / 255.0
        g = int(clean[2:4], 16) / 255.0
        b = int(clean[4:6], 16) / 255.0
        return np.array([r, g, b], dtype=np.float32)
    except ValueError:
        return np.array([0.431, 0.906, 0.718], dtype=np.float32)


def rgb_to_hsv_element(rgb: np.ndarray) -> tuple[float, float, float]:
    """Convert a 3-element float RGB `[0..1]` vector into `(h, s, v)` in `[0..1]`."""
    r, g, b = float(rgb[0]), float(rgb[1]), float(rgb[2])
    cmax = max(r, g, b)
    cmin = min(r, g, b)
    delta = cmax - cmin
    if delta < 1e-6:
        h = 0.0
    elif cmax == r:
        h = ((g - b) / delta) % 6.0 / 6.0
    elif cmax == g:
        h = (((b - r) / delta) + 2.0) / 6.0
    else:
        h = (((r - g) / delta) + 4.0) / 6.0
    s = 0.0 if cmax < 1e-6 else delta / cmax
    return h % 1.0, s, cmax


def rgb_to_hsv_array(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Vectorised RGB `[0..1]` `(H, W, 3)` to `(hue, sat, val)` in `[0..1]`."""
    r = rgb[:, :, 0]
    g = rgb[:, :, 1]
    b = rgb[:, :, 2]
    cmax = np.maximum(np.maximum(r, g), b)
    cmin = np.minimum(np.minimum(r, g), b)
    delta = cmax - cmin

    sat = np.where(cmax > 1e-5, delta / np.maximum(cmax, 1e-5), 0.0)
    hue = np.zeros_like(cmax)
    mask = delta > 1e-5

    r_max = mask & (cmax == r)
    g_max = mask & (cmax == g) & ~r_max
    b_max = mask & ~r_max & ~g_max

    hue[r_max] = ((g[r_max] - b[r_max]) / delta[r_max]) % 6.0
    hue[g_max] = ((b[g_max] - r[g_max]) / delta[g_max]) + 2.0
    hue[b_max] = ((r[b_max] - g[b_max]) / delta[b_max]) + 4.0
    hue = (hue / 6.0) % 1.0
    return hue.astype(np.float32), sat.astype(np.float32), cmax.astype(np.float32)


def smoothstep(edge0: float | np.ndarray, edge1: float | np.ndarray, x: np.ndarray) -> np.ndarray:
    """Hermite smoothstep interpolation in `[0.0, 1.0]`."""
    denom = np.maximum(np.asarray(edge1, dtype=np.float32) - np.asarray(edge0, dtype=np.float32), 1e-5)
    t = np.clip((x - edge0) / denom, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def safe_read_image(path: str, max_bytes: int = MAX_ART_BYTES) -> Image.Image:
    """Validate and read a regular non-symlinked image file without mutating the source."""
    if not path or not isinstance(path, str):
        raise PhotoMotionGroup4Error("Empty or invalid image path")
    abs_path = os.path.abspath(path)
    ext = os.path.splitext(abs_path)[1].lower()
    if ext not in IMAGE_EXTENSIONS:
        raise PhotoMotionGroup4Error(f"Unsupported image extension: {ext}")

    uid = os.getuid()
    try:
        st_l = os.lstat(abs_path)
    except OSError as exc:
        raise PhotoMotionGroup4Error(f"Cannot stat image {abs_path}: {exc}") from exc

    if stat.S_ISLNK(st_l.st_mode) or not stat.S_ISREG(st_l.st_mode):
        raise PhotoMotionGroup4Error(f"Refusing symlink or non-regular file: {abs_path}")
    if st_l.st_uid not in (uid, 0):
        raise PhotoMotionGroup4Error(f"Refusing foreign-owned file: {abs_path}")
    if st_l.st_size < 32 or st_l.st_size > max_bytes:
        raise PhotoMotionGroup4Error(
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
                raise PhotoMotionGroup4Error(f"File verification failed on open: {abs_path}")
            chunks: list[bytes] = []
            total = 0
            while True:
                chunk = os.read(fd, 65536)
                if not chunk:
                    break
                total += len(chunk)
                if total > max_bytes:
                    raise PhotoMotionGroup4Error(f"Image exceeds MAX_ART_BYTES: {abs_path}")
                chunks.append(chunk)
            raw_bytes = b"".join(chunks)
        finally:
            os.close(fd)
    except PhotoMotionGroup4Error:
        raise
    except OSError as exc:
        raise PhotoMotionGroup4Error(f"Failed reading {abs_path}: {exc}") from exc

    try:
        with Image.open(io.BytesIO(raw_bytes)) as im:
            im.load()
            w, h = im.size
            if w <= 0 or h <= 0 or (w * h) > MAX_IMAGE_PIXELS:
                raise PhotoMotionGroup4Error(f"Invalid image dimensions {w}x{h}")
            im_oriented = ImageOps.exif_transpose(im)
            if im_oriented.mode in ("RGBA", "LA") or (
                im_oriented.mode == "P" and "transparency" in im_oriented.info
            ):
                rgba = im_oriented.convert("RGBA")
                bg = Image.new("RGBA", rgba.size, (7, 9, 14, 255))
                bg.alpha_composite(rgba)
                return bg.convert("RGB")
            return im_oriented.convert("RGB")
    except PhotoMotionGroup4Error:
        raise
    except Exception as exc:
        raise PhotoMotionGroup4Error(f"Failed decoding image {abs_path}: {exc}") from exc


def safe_write_image(img: Image.Image, dst_path: str) -> str:
    """Atomically write a PIL Image (`RGB` or `RGBA`) to `dst_path` with `0644` permissions."""
    abs_dst = os.path.abspath(dst_path)
    parent = os.path.dirname(abs_dst)
    os.makedirs(parent, mode=0o755, exist_ok=True)
    if os.path.lexists(abs_dst):
        st = os.lstat(abs_dst)
        if stat.S_ISLNK(st.st_mode):
            raise PhotoMotionGroup4Error(f"Refusing to overwrite symlink: {abs_dst}")

    fd, tmp_path = tempfile.mkstemp(prefix=".bandarchy_m4_", suffix=".png", dir=parent)
    try:
        os.fchmod(fd, 0o644)
        with os.fdopen(fd, "wb") as fh:
            img.save(fh, format="PNG", optimize=False)
            fh.flush()
            os.fsync(fh.fileno())
        os.replace(tmp_path, abs_dst)
    except Exception:
        if os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
        raise
    return abs_dst


def _load_monospace_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in FONT_CANDIDATES:
        if os.path.isfile(path):
            try:
                return ImageFont.truetype(path, size=size)
            except OSError:
                continue
    return ImageFont.load_default()


# ---------------------------------------------------------------------------
# Multi-Variant Loader & Cross-Fade / Strobe Controller (16 Variants of Same Photo)
# ---------------------------------------------------------------------------

def extract_source_stem_from_processed_filename(filename: str) -> str:
    """Extract `<SourceStem>` from `<EffectID>__<SourceStem>.png`."""
    base = os.path.splitext(os.path.basename(filename))[0]
    if "__" in base:
        return base.split("__", 1)[1]
    return base


def load_16_variants_for_source(
    processed_dir: str,
    source_stem: str,
    target_size: tuple[int, int] | None = None,
) -> list[np.ndarray]:
    """Load all available Stage-1 Stark variants (`01..16`) for `source_stem` in `processed_dir`
    as float32 RGB arrays in `[0.0, 1.0]` of shape `(H, W, 3)`.
    """
    abs_dir = os.path.abspath(processed_dir)
    variants: list[np.ndarray] = []
    first_size = target_size

    for eff_id in STAGE1_EFFECT_IDS:
        cand = os.path.join(abs_dir, f"{eff_id}__{source_stem}.png")
        if os.path.isfile(cand) and not os.path.islink(cand):
            im = safe_read_image(cand)
            if first_size is None:
                first_size = im.size
            elif im.size != first_size:
                im = im.resize(first_size, Image.Resampling.BILINEAR)
            variants.append(np.asarray(im, dtype=np.float32) / 255.0)

    if not variants:
        # Fallback if a direct file path or non-standard stem was given
        matches = sorted(glob.glob(os.path.join(abs_dir, f"*{source_stem}*.png")))
        for mpath in matches[:16]:
            if os.path.isfile(mpath) and not os.path.islink(mpath):
                im = safe_read_image(mpath)
                if first_size is None:
                    first_size = im.size
                elif im.size != first_size:
                    im = im.resize(first_size, Image.Resampling.BILINEAR)
                variants.append(np.asarray(im, dtype=np.float32) / 255.0)

    if not variants:
        raise PhotoMotionGroup4Error(
            f"No processed Stark variants found for stem '{source_stem}' in {abs_dir}"
        )
    return variants


def prepare_variants_list(
    image_or_variants: Image.Image | list[Image.Image] | list[np.ndarray] | np.ndarray,
    palette_index: int = 0,
) -> list[np.ndarray]:
    """Normalise an input image or list of 16 Stage-1 variant images into a list of
    float32 RGB arrays `(H, W, 3)` in `[0.0, 1.0]`. If only a single image is passed,
    synthesises multi-variant tonal/hue-shifted representations so multi-variant strobe
    and tunnel stitching always have distinct variants to cycle across.
    """
    if isinstance(image_or_variants, list) and len(image_or_variants) > 0:
        out: list[np.ndarray] = []
        ref_h, ref_w = 0, 0
        for item in image_or_variants:
            if isinstance(item, Image.Image):
                rgb_im = item.convert("RGB")
                if ref_h == 0:
                    ref_w, ref_h = rgb_im.size
                elif rgb_im.size != (ref_w, ref_h):
                    rgb_im = rgb_im.resize((ref_w, ref_h), Image.Resampling.BILINEAR)
                arr = np.asarray(rgb_im, dtype=np.float32) / 255.0
            else:
                arr = np.asarray(item, dtype=np.float32)
                if arr.max() > 1.05:
                    arr = arr / 255.0
                if ref_h == 0:
                    ref_h, ref_w = arr.shape[:2]
            out.append(np.clip(arr[:, :, :3], 0.0, 1.0))
        if len(out) >= 2:
            return out
        base = out[0]
    elif isinstance(image_or_variants, Image.Image):
        base = np.asarray(image_or_variants.convert("RGB"), dtype=np.float32) / 255.0
    elif isinstance(image_or_variants, np.ndarray):
        base = np.asarray(image_or_variants, dtype=np.float32)
        if base.max() > 1.05:
            base = base / 255.0
        base = np.clip(base[:, :, :3], 0.0, 1.0)
    else:
        raise PhotoMotionGroup4Error("Unsupported image_or_variants input type")

    # Synthesise 4 complementary stark variants from the single frame if only 1 was provided
    pal = PALETTES[palette_index % len(PALETTES)]
    c0 = hex_to_rgb_float(pal[0])
    c1 = hex_to_rgb_float(pal[1])
    c2 = hex_to_rgb_float(pal[2])
    luma = 0.2126 * base[:, :, 0] + 0.7152 * base[:, :, 1] + 0.0722 * base[:, :, 2]
    gy, gx = np.gradient(luma)
    edges = np.clip(np.hypot(gx, gy) * 4.5, 0.0, 1.0)

    v1 = base
    # Variant 2: Inverted Sabattier neon edge
    v2 = np.clip(
        (1.0 - luma[:, :, None]) * 0.25 + edges[:, :, None] * c0[None, None, :] * 1.35,
        0.0,
        1.0,
    )
    # Variant 3: High-contrast woodcut + cyan/magenta split
    hi_mask = (luma > 0.58).astype(np.float32)
    mid_mask = ((luma >= 0.25) & (luma <= 0.58)).astype(np.float32)
    v3 = np.clip(
        hi_mask[:, :, None] * np.array([0.97, 0.98, 0.99], dtype=np.float32)
        + mid_mask[:, :, None] * c1[None, None, :]
        + edges[:, :, None] * c2[None, None, :],
        0.0,
        1.0,
    )
    # Variant 4: Shadow void snatch
    sh_mask = ((luma >= 0.10) & (luma < 0.48)).astype(np.float32)
    v4 = np.clip(
        (luma > 0.55)[:, :, None].astype(np.float32) * 0.95
        + sh_mask[:, :, None] * c2[None, None, :] * 1.15,
        0.0,
        1.0,
    )
    return [v1.astype(np.float32), v2.astype(np.float32), v3.astype(np.float32), v4.astype(np.float32)]


def resolve_variant_blend(
    variants: list[np.ndarray],
    strobe_phase: float,
    photo_fade_duration: float = 0.35,
    strobe_rate_hz: float = 4.0,
) -> np.ndarray:
    """Resolve the active frame across the 16 Stark variants of the same image.
    - When `photo_fade_duration <= 0.01`: Instantaneous razor-sharp strobe cut between variants.
    - When `photo_fade_duration > 0.01`: Smooth Hermite cross-dissolve between adjacent variants
      scaled by `photo_fade_duration` (`0.0s` instant strobe to `6.0s` liquid cross-dissolve).
    """
    n = len(variants)
    if n == 1:
        return variants[0].copy()

    fade_s = _clamp(photo_fade_duration, 0.0, 6.0, 0.35)
    rate = max(0.1, float(strobe_rate_hz))
    # Effective cycle speed slows down gracefully as fade duration approaches 6.0s
    effective_pos = float(strobe_phase) * n / (1.0 + fade_s * 0.45)
    idx0 = int(math.floor(effective_pos)) % n
    idx1 = (idx0 + 1) % n
    frac = effective_pos - math.floor(effective_pos)

    if fade_s <= 0.02:
        return variants[idx0].copy()

    # Window over which cross-fade occurs within each step (from sharp transition to continuous liquid blend)
    blend_window = _clamp(fade_s * rate / 2.5, 0.05, 1.0, 0.5)
    start_edge = max(0.0, 1.0 - blend_window)
    t = float(smoothstep(start_edge, 1.0, np.asarray(frac, dtype=np.float32)))
    return ((1.0 - t) * variants[idx0] + t * variants[idx1]).astype(np.float32)


def _bilinear_sample(img: np.ndarray, sample_x: np.ndarray, sample_y: np.ndarray, wrap: bool = False) -> np.ndarray:
    """Vectorised bilinear sampler on `img` `(H, W, C)` using pixel coordinates `sample_x`, `sample_y`."""
    h, w = img.shape[:2]
    if wrap:
        sx = np.mod(sample_x, float(w - 1))
        sy = np.mod(sample_y, float(h - 1))
    else:
        sx = np.clip(sample_x, 0.0, float(w - 1.001))
        sy = np.clip(sample_y, 0.0, float(h - 1.001))

    x0 = np.floor(sx).astype(np.int32)
    y0 = np.floor(sy).astype(np.int32)
    x1 = np.minimum(x0 + 1, w - 1)
    y1 = np.minimum(y0 + 1, h - 1)

    wx = (sx - x0)[:, :, None].astype(np.float32)
    wy = (sy - y0)[:, :, None].astype(np.float32)

    Ia = img[y0, x0]
    Ib = img[y0, x1]
    Ic = img[y1, x0]
    Id = img[y1, x1]

    top = Ia * (1.0 - wx) + Ib * wx
    bot = Ic * (1.0 - wx) + Id * wx
    return (top * (1.0 - wy) + bot * wy).astype(np.float32)


# ---------------------------------------------------------------------------
# Palette-Colour Resonance Engine (Matches Active Bandarchy Palette & Omarchy Theme)
# ---------------------------------------------------------------------------

def compute_palette_resonance(
    rgb: np.ndarray,
    palette_index: int = 0,
    theme_colours: dict[str, str] | None = None,
    hue_tolerance_deg: float = 34.0,
    phase_shift: float = 0.0,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Analyse every pixel's hue, saturation, and luminance against the active
    Bandarchy palette (`PALETTES[palette_index]`) and Omarchy theme colours.

    Returns:
      - `resonance_mask` `(H, W)` float32 in `[0.0, 1.0]`: How strongly each pixel
        resonates with the active palette/theme hues (or synthetic geometric harmonic
        sectors when the underlying frame is pure B&W).
      - `nearest_palette_rgb` `(H, W, 3)` float32 in `[0.0, 1.0]`: The matched active
        palette colour for each pixel.
      - `luma` `(H, W)` float32 in `[0.0, 1.0]`: Rec.709 luminance.
    """
    pal_hexes = list(PALETTES[palette_index % len(PALETTES)])
    theme = theme_colours or DEFAULT_OMARCHY_THEME_COLOURS
    for k in ("accent", "urgent", "cyan", "gold"):
        if k in theme and theme[k] not in pal_hexes:
            pal_hexes.append(theme[k])

    pal_rgbs = np.stack([hex_to_rgb_float(hx) for hx in pal_hexes], axis=0)  # (P, 3)
    pal_hues = np.array([rgb_to_hsv_element(c)[0] for c in pal_rgbs], dtype=np.float32)  # (P,)

    hue, sat, val = rgb_to_hsv_array(rgb)
    luma = (0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]).astype(np.float32)

    # Circular hue distance to each palette colour: shape (H, W, P)
    diff = np.abs(hue[:, :, None] - pal_hues[None, None, :])
    circ_dist = np.minimum(diff, 1.0 - diff)  # in [0.0, 0.5]

    best_idx = np.argmin(circ_dist, axis=2)
    min_dist = np.min(circ_dist, axis=2)

    tol = max(4.0, float(hue_tolerance_deg)) / 360.0
    hue_match = 1.0 - smoothstep(tol * 0.35, tol, min_dist)
    chroma_gate = smoothstep(0.08, 0.30, sat) * smoothstep(0.08, 0.25, val)
    resonance = (hue_match * chroma_gate).astype(np.float32)

    # Nearest palette RGB map
    nearest_rgb = pal_rgbs[best_idx]

    # If the frame has very few chromatic pixels (e.g. a stark woodcut/halftone B&W sector),
    # inject harmonic spatial-edge resonance so M19/M25 always ignite the active palette!
    if float(np.mean(resonance > 0.15)) < 0.03:
        h, w = luma.shape
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        nx = (xx / max(w - 1, 1)) * 2.0 - 1.0
        ny = (yy / max(h - 1, 1)) * 2.0 - 1.0
        gy, gx = np.gradient(luma)
        edge_mag = np.clip(np.hypot(gx, gy) * 4.0, 0.0, 1.0)
        angle = (np.arctan2(ny, nx) / (2.0 * math.pi) + 0.5 + phase_shift) % 1.0
        p_idx = np.floor(angle * len(PALETTES[palette_index % len(PALETTES)])).astype(np.int32) % len(
            PALETTES[palette_index % len(PALETTES)]
        )
        nearest_rgb = pal_rgbs[p_idx]
        synth_res = np.clip(edge_mag * 0.85 + smoothstep(0.65, 0.90, luma) * 0.55, 0.0, 1.0)
        resonance = np.maximum(resonance, synth_res).astype(np.float32)

    return resonance, nearest_rgb.astype(np.float32), luma


# ---------------------------------------------------------------------------
# Fade, Sector-Selective Opacity & Audio-Responder Opacity Modulation
# ---------------------------------------------------------------------------

def compute_audio_modulated_opacity(
    base_opacity: float = 0.85,
    audio_source: str | int = 0,
    audio_method: str = "+",
    audio_amount: float = 0.50,
    bass: float = 0.5,
    mid: float = 0.5,
    high: float = 0.5,
    beat: float = 0.0,
    drop_vs_breakdown: float = 0.5,
) -> float:
    """Evaluate the Generic Audio-Responder link (`l_photo_opacity`:
    `AudioSource → Method → photoOpacity`) in `[0.05, 1.00]`.
    """
    base = _clamp(base_opacity, 0.05, 1.00, 0.85)
    amt = _clamp(audio_amount, 0.0, 2.5, 0.50)

    src_map = {
        0: 0.0,
        "0": 0.0,
        "off": 0.0,
        1: _clamp(0.65 * bass + 0.35 * beat, 0.0, 1.0),
        "1": _clamp(0.65 * bass + 0.35 * beat, 0.0, 1.0),
        "kick_sub_bass": _clamp(0.65 * bass + 0.35 * beat, 0.0, 1.0),
        2: _clamp(bass, 0.0, 1.0),
        "2": _clamp(bass, 0.0, 1.0),
        "bass_groove": _clamp(bass, 0.0, 1.0),
        3: _clamp(mid, 0.0, 1.0),
        "3": _clamp(mid, 0.0, 1.0),
        "mid_synth": _clamp(mid, 0.0, 1.0),
        4: _clamp(high, 0.0, 1.0),
        "4": _clamp(high, 0.0, 1.0),
        "highs": _clamp(high, 0.0, 1.0),
        5: _clamp(beat, 0.0, 1.0),
        "5": _clamp(beat, 0.0, 1.0),
        "beat_onset": _clamp(beat, 0.0, 1.0),
        6: _clamp((bass + mid + high) / 3.0, 0.0, 1.0),
        "6": _clamp((bass + mid + high) / 3.0, 0.0, 1.0),
        "spectrum_wave": _clamp((bass + mid + high) / 3.0, 0.0, 1.0),
        7: _clamp(drop_vs_breakdown, 0.0, 1.0),
        "7": _clamp(drop_vs_breakdown, 0.0, 1.0),
        "drop_vs_breakdown": _clamp(drop_vs_breakdown, 0.0, 1.0),
    }
    key = audio_source.lower() if isinstance(audio_source, str) else audio_source
    sig = float(src_map.get(key, 0.0))
    if key in (0, "0", "off"):
        return base

    m = str(audio_method or "+").strip().lower()
    if m in ("-", "inverted"):
        mod = -sig * amt
    elif m in ("~", "bipolar"):
        mod = (sig - 0.5) * amt
    elif m in ("⚡", "trigger", "step"):
        mod = (1.0 - base) if sig > 0.65 else 0.0
    else:
        mod = sig * amt

    return _clamp(base + mod, 0.05, 1.00, base)


def compute_sector_alpha_map(
    rgb: np.ndarray,
    photo_opacity: float = 0.85,
    photo_black_opacity: float = 1.0,
    photo_mid_opacity: float = 1.0,
    photo_white_opacity: float = 1.0,
    photo_colour_snatch_opacity: float = 1.0,
) -> np.ndarray:
    """Compute a per-pixel alpha mask `(H, W)` in `[0.0, 1.0]` combining:
    - Master Photo Layer Opacity (`photo_opacity` in `[0.05, 1.00]`)
    - Sector-Selective Opacities:
      - `photo_black_opacity` (`Y < 0.22`, low saturation)
      - `photo_mid_opacity` (`0.22 <= Y <= 0.75`, low saturation)
      - `photo_white_opacity` (`Y > 0.75`, low saturation)
      - `photo_colour_snatch_opacity` (chromatic / colour-snatched sectors `S >= 0.18`)
    """
    master_a = _clamp(photo_opacity, 0.05, 1.00, 0.85)
    blk_a = _clamp(photo_black_opacity, 0.0, 1.0, 1.0)
    mid_a = _clamp(photo_mid_opacity, 0.0, 1.0, 1.0)
    wht_a = _clamp(photo_white_opacity, 0.0, 1.0, 1.0)
    col_a = _clamp(photo_colour_snatch_opacity, 0.0, 1.0, 1.0)

    _, sat, _ = rgb_to_hsv_array(rgb)
    luma = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]

    # Smooth sector weights
    w_colour = smoothstep(0.14, 0.32, sat)
    w_black = (1.0 - smoothstep(0.12, 0.28, luma)) * (1.0 - w_colour)
    w_white = smoothstep(0.70, 0.86, luma) * (1.0 - w_colour)
    w_mid = np.clip(1.0 - w_colour - w_black - w_white, 0.0, 1.0)

    sector_alpha = (
        w_black * blk_a
        + w_mid * mid_a
        + w_white * wht_a
        + w_colour * col_a
    )
    return np.clip(master_a * sector_alpha, 0.0, 1.0).astype(np.float32)


def finalise_motion_output(
    rgb: np.ndarray,
    photo_opacity: float = 1.0,
    photo_black_opacity: float = 1.0,
    photo_mid_opacity: float = 1.0,
    photo_white_opacity: float = 1.0,
    photo_colour_snatch_opacity: float = 1.0,
    return_rgba: bool = False,
    underlay_rgb: np.ndarray | None = None,
) -> Image.Image:
    """Apply master & sector-selective opacity to `rgb` `(H, W, 3)` and return either
    an `RGBA` PIL image (`return_rgba=True`) or composite over `underlay_rgb` / obsidian
    stage (`return_rgba=False`).
    """
    rgb_clipped = np.clip(rgb, 0.0, 1.0)
    alpha = compute_sector_alpha_map(
        rgb_clipped,
        photo_opacity=photo_opacity,
        photo_black_opacity=photo_black_opacity,
        photo_mid_opacity=photo_mid_opacity,
        photo_white_opacity=photo_white_opacity,
        photo_colour_snatch_opacity=photo_colour_snatch_opacity,
    )
    if return_rgba:
        rgba_u8 = np.dstack(
            [
                (rgb_clipped * 255.0).astype(np.uint8),
                (alpha * 255.0).astype(np.uint8),
            ]
        )
        return Image.fromarray(rgba_u8, mode="RGBA")

    if underlay_rgb is None:
        bg = np.array([7.0 / 255.0, 9.0 / 255.0, 14.0 / 255.0], dtype=np.float32)[None, None, :]
    else:
        bg = np.clip(underlay_rgb, 0.0, 1.0)
    comp = rgb_clipped * alpha[:, :, None] + bg * (1.0 - alpha[:, :, None])
    return Image.fromarray((np.clip(comp, 0.0, 1.0) * 255.0).astype(np.uint8), mode="RGB")


# ---------------------------------------------------------------------------
# Group D Effects (M19 – M25)
# ---------------------------------------------------------------------------

def effect_m19_palette_resonance_hyper_enhancer(
    image_or_variants: Image.Image | list[Image.Image] | list[np.ndarray] | np.ndarray,
    palette_index: int = 0,
    bass: float = 0.65,
    mid: float = 0.60,
    high: float = 0.55,
    beat: float = 0.45,
    strobe_phase: float = 0.22,
    photo_opacity: float = 1.0,
    photo_fade_duration: float = 0.35,
    photo_black_opacity: float = 1.0,
    photo_mid_opacity: float = 1.0,
    photo_white_opacity: float = 1.0,
    photo_colour_snatch_opacity: float = 1.0,
    return_rgba: bool = False,
) -> Image.Image:
    """M19: Palette Resonance Hyper-Enhancer.

    Analyses pixel hues against the active Bandarchy palette (`PALETTES[palette_index]`,
    30 palettes) and Omarchy theme colours. Pixels matching active palette hues are
    hyper-enhanced with neon bloom, concentric shockwave rings, and harmonic pulsing
    while non-matching hues lock to stark obsidian/chalk B&W, strobing/cross-fading
    across the 16 variants of the same image.
    """
    bass_v = _clamp(bass, 0.0, 1.0, 0.65)
    mid_v = _clamp(mid, 0.0, 1.0, 0.60)
    high_v = _clamp(high, 0.0, 1.0, 0.55)
    beat_v = _clamp(beat, 0.0, 1.0, 0.45)

    variants = prepare_variants_list(image_or_variants, palette_index=palette_index)
    # Anchor against Variant 0 (SinCity Chroma Snatch) so obsidian shadows remain razor-sharp across strobes
    anchor_rgb = variants[0]
    strobe_rgb = resolve_variant_blend(variants, strobe_phase, photo_fade_duration)
    active_rgb = 0.45 * anchor_rgb + 0.55 * strobe_rgb
    alt_rgb = resolve_variant_blend(variants, strobe_phase + 0.37, photo_fade_duration * 0.5)

    h, w = active_rgb.shape[:2]
    resonance, nearest_pal_rgb, luma = compute_palette_resonance(
        active_rgb,
        palette_index=palette_index,
        hue_tolerance_deg=34.0 + 18.0 * mid_v,
        phase_shift=strobe_phase,
    )
    anchor_luma = (
        0.2126 * anchor_rgb[:, :, 0] + 0.7152 * anchor_rgb[:, :, 1] + 0.0722 * anchor_rgb[:, :, 2]
    ).astype(np.float32)

    # Stark Obsidian / Chalk B&W base for non-resonant pixels (true S-curve contrast)
    obsidian = np.array([0.027, 0.035, 0.055], dtype=np.float32)
    chalk = np.array([0.96, 0.97, 0.99], dtype=np.float32)
    gy, gx = np.gradient(anchor_luma)
    edges = np.clip(np.hypot(gx, gy) * 5.0, 0.0, 1.0)
    stark_luma = np.clip(smoothstep(0.24, 0.72, anchor_luma) * 0.88 + edges * 0.32, 0.0, 1.0)
    # Keep deep obsidian shadows anchored
    shadow_crush = smoothstep(0.10, 0.26, anchor_luma)
    stark_luma = stark_luma * shadow_crush
    stark_bw = (
        obsidian[None, None, :] * (1.0 - stark_luma[:, :, None])
        + chalk[None, None, :] * stark_luma[:, :, None]
    )

    # Centroid of highest palette resonance for concentric shockwave emission
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    w_sum = float(np.sum(resonance))
    if w_sum > 10.0:
        cx = float(np.sum(xx * resonance) / w_sum)
        cy = float(np.sum(yy * resonance) / w_sum)
    else:
        cx, cy = w * 0.5, h * 0.5

    aspect = w / max(h, 1)
    dx = ((xx - cx) / max(w, 1)) * aspect
    dy = (yy - cy) / max(h, 1)
    rad = np.hypot(dx, dy)

    # Sharp concentric harmonic shockwave rings radiating from the palette-resonant centroid
    ring_freq = 14.0 + 10.0 * bass_v
    ring_wave = 0.5 + 0.5 * np.cos(rad * ring_freq * math.pi - strobe_phase * math.pi * 6.0)
    shockwave = (ring_wave ** 10) * np.exp(-rad * 1.8) * (0.55 + 0.45 * (bass_v + beat_v * 0.5))

    # Mix alt strobe variant along shockwave crests and structural edges
    _, alt_pal_rgb, _ = compute_palette_resonance(
        alt_rgb, palette_index=palette_index, phase_shift=strobe_phase + 0.5
    )
    shadow_keep = smoothstep(0.08, 0.24, anchor_luma + edges * 0.6)
    combined_res = np.clip((resonance * 0.92 + shockwave * 0.70 + edges * 0.50) * shadow_keep, 0.0, 1.0)

    hyper_colour = (
        0.18 * active_rgb
        + 0.82 * nearest_pal_rgb * (0.45 + 0.65 * np.maximum(luma, edges)[:, :, None])
        + shockwave[:, :, None] * alt_pal_rgb * 0.95
    )
    hyper_colour = np.clip(hyper_colour * (1.20 + 0.35 * high_v), 0.0, 1.0)

    # Multi-radius neon bloom on the resonant colour layer
    bloom_src = Image.fromarray((np.clip(hyper_colour * combined_res[:, :, None], 0.0, 1.0) * 255.0).astype(np.uint8))
    bloom_wide = np.asarray(bloom_src.filter(ImageFilter.GaussianBlur(radius=7.0)), dtype=np.float32) / 255.0
    bloom_tight = np.asarray(bloom_src.filter(ImageFilter.GaussianBlur(radius=2.5)), dtype=np.float32) / 255.0
    bloom = (bloom_wide * 0.52 + bloom_tight * 0.45) * (0.80 + 0.35 * bass_v)

    # Specular white-hot core on peak resonance edges
    hot_core = smoothstep(0.84, 0.98, combined_res) * edges

    out_rgb = (
        stark_bw * (1.0 - combined_res[:, :, None])
        + hyper_colour * combined_res[:, :, None]
        + bloom * 0.65
        + hot_core[:, :, None] * chalk[None, None, :] * 0.42
    )

    return finalise_motion_output(
        out_rgb,
        photo_opacity=photo_opacity,
        photo_black_opacity=photo_black_opacity,
        photo_mid_opacity=photo_mid_opacity,
        photo_white_opacity=photo_white_opacity,
        photo_colour_snatch_opacity=photo_colour_snatch_opacity,
        return_rgba=return_rgba,
    )


def effect_m20_event_horizon_gravitational_lens(
    image_or_variants: Image.Image | list[Image.Image] | list[np.ndarray] | np.ndarray,
    palette_index: int = 0,
    bass: float = 0.70,
    mid: float = 0.60,
    high: float = 0.55,
    beat: float = 0.40,
    strobe_phase: float = 0.18,
    photo_opacity: float = 1.0,
    photo_fade_duration: float = 0.35,
    photo_black_opacity: float = 1.0,
    photo_mid_opacity: float = 1.0,
    photo_white_opacity: float = 1.0,
    photo_colour_snatch_opacity: float = 1.0,
    return_rgba: bool = False,
) -> Image.Image:
    """M20: Event Horizon Gravitational Lens.

    Orbits twin relativistic black holes across the photo plane, bending
    architectural/custom lines into Einstein lensing rings while pulling
    colour-snatched sectors into a swirling palette-coloured accretion vortex.
    """
    bass_v = _clamp(bass, 0.0, 1.0, 0.70)
    mid_v = _clamp(mid, 0.0, 1.0, 0.60)
    high_v = _clamp(high, 0.0, 1.0, 0.55)
    beat_v = _clamp(beat, 0.0, 1.0, 0.40)

    variants = prepare_variants_list(image_or_variants, palette_index=palette_index)
    active_rgb = resolve_variant_blend(variants, strobe_phase, photo_fade_duration)
    inner_ring_rgb = resolve_variant_blend(variants, strobe_phase + 0.5, photo_fade_duration * 0.4)

    h, w = active_rgb.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx / max(w - 1, 1)) * 2.0 - 1.0
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0
    aspect = w / max(h, 1)
    nx_a = nx * aspect

    # Twin orbiting black hole centres
    orb_angle = strobe_phase * math.pi * 2.0
    sep = 0.36 + 0.08 * math.sin(orb_angle * 2.0)
    bh1_x = sep * math.cos(orb_angle) * aspect
    bh1_y = sep * 0.65 * math.sin(orb_angle)
    bh2_x = -bh1_x
    bh2_y = -bh1_y

    # Relativistic Schwarzschild deflection + frame-dragging swirl for both singularities
    rs1 = 0.11 + 0.05 * bass_v + 0.03 * beat_v
    rs2 = 0.09 + 0.04 * mid_v

    dx1, dy1 = nx_a - bh1_x, ny - bh1_y
    r1 = np.hypot(dx1, dy1) + 1e-4
    dx2, dy2 = nx_a - bh2_x, ny - bh2_y
    r2 = np.hypot(dx2, dy2) + 1e-4

    # Einstein ring deflection vector + tangential frame-dragging vortex
    defl1 = (rs1 * rs1) / (r1 * r1 + 0.008)
    swirl1 = (rs1 * 1.45 * (0.7 + 0.6 * mid_v)) / (r1 + 0.06)
    defl2 = (rs2 * rs2) / (r2 * r2 + 0.008)
    swirl2 = -(rs2 * 1.35 * (0.7 + 0.6 * high_v)) / (r2 + 0.06)

    # Radial pull + tangential frame drag
    ux1 = -dx1 / r1 * defl1 - (dy1 / r1) * swirl1 * np.exp(-r1 * 2.4)
    uy1 = -dy1 / r1 * defl1 + (dx1 / r1) * swirl1 * np.exp(-r1 * 2.4)
    ux2 = -dx2 / r2 * defl2 - (dy2 / r2) * swirl2 * np.exp(-r2 * 2.4)
    uy2 = -dy2 / r2 * defl2 + (dx2 / r2) * swirl2 * np.exp(-r2 * 2.4)

    warped_nx = (nx_a + ux1 + ux2) / aspect
    warped_ny = ny + uy1 + uy2

    sample_x = (warped_nx * 0.5 + 0.5) * (w - 1)
    sample_y = (warped_ny * 0.5 + 0.5) * (h - 1)

    lensed_primary = _bilinear_sample(active_rgb, sample_x, sample_y, wrap=True)
    lensed_secondary = _bilinear_sample(inner_ring_rgb, sample_x, sample_y, wrap=True)

    # Einstein photon ring & swirling palette accretion disk
    pal = PALETTES[palette_index % len(PALETTES)]
    c_acc1 = hex_to_rgb_float(pal[0])
    c_acc2 = hex_to_rgb_float(pal[1 % len(pal)])
    c_acc3 = hex_to_rgb_float(pal[2 % len(pal)])

    ang1 = np.arctan2(dy1, dx1)
    ang2 = np.arctan2(dy2, dx2)

    # Accretion spiral arms around each singularity
    spiral1 = 0.5 + 0.5 * np.sin(ang1 * 4.0 - 12.0 * np.log(r1 + 0.02) + orb_angle * 4.0)
    spiral2 = 0.5 + 0.5 * np.cos(ang2 * 4.0 + 12.0 * np.log(r2 + 0.02) - orb_angle * 4.0)

    photon_ring1 = np.exp(-((r1 - rs1 * 1.35) ** 2) / (2.0 * (0.028 ** 2)))
    photon_ring2 = np.exp(-((r2 - rs2 * 1.35) ** 2) / (2.0 * (0.025 ** 2)))

    disk1 = np.exp(-((r1 - rs1 * 2.1) ** 2) / (2.0 * (0.095 ** 2))) * spiral1
    disk2 = np.exp(-((r2 - rs2 * 2.1) ** 2) / (2.0 * (0.085 ** 2))) * spiral2

    # Blend secondary Stark variant inside the Einstein lensed zone
    einstein_mix = np.clip(photon_ring1 + photon_ring2 + 0.5 * (disk1 + disk2), 0.0, 1.0)
    base_lensed = lensed_primary * (1.0 - einstein_mix[:, :, None] * 0.65) + lensed_secondary * (
        einstein_mix[:, :, None] * 0.65
    )

    accretion_glow = (
        disk1[:, :, None] * c_acc1[None, None, :] * (1.1 + 0.5 * bass_v)
        + disk2[:, :, None] * c_acc2[None, None, :] * (1.1 + 0.5 * mid_v)
        + (photon_ring1 + photon_ring2)[:, :, None]
        * (0.65 * c_acc3[None, None, :] + 0.55 * np.ones((1, 1, 3), dtype=np.float32))
    )

    # Event horizon interior crush to pure relativistic obsidian void
    horizon_mask1 = smoothstep(rs1 * 0.68, rs1 * 1.05, r1)
    horizon_mask2 = smoothstep(rs2 * 0.68, rs2 * 1.05, r2)
    horizon_keep = horizon_mask1 * horizon_mask2

    obsidian = np.array([0.02, 0.025, 0.04], dtype=np.float32)
    out_rgb = (base_lensed + accretion_glow) * horizon_keep[:, :, None] + obsidian[None, None, :] * (
        1.0 - horizon_keep[:, :, None]
    )

    return finalise_motion_output(
        out_rgb,
        photo_opacity=photo_opacity,
        photo_black_opacity=photo_black_opacity,
        photo_mid_opacity=photo_mid_opacity,
        photo_white_opacity=photo_white_opacity,
        photo_colour_snatch_opacity=photo_colour_snatch_opacity,
        return_rgba=return_rgba,
    )


def effect_m21_mobius_cylinder_and_torus_tunnel_wrap(
    image_or_variants: Image.Image | list[Image.Image] | list[np.ndarray] | np.ndarray,
    palette_index: int = 0,
    bass: float = 0.65,
    mid: float = 0.60,
    high: float = 0.55,
    beat: float = 0.35,
    strobe_phase: float = 0.15,
    photo_opacity: float = 1.0,
    photo_fade_duration: float = 0.35,
    photo_black_opacity: float = 1.0,
    photo_mid_opacity: float = 1.0,
    photo_white_opacity: float = 1.0,
    photo_colour_snatch_opacity: float = 1.0,
    return_rgba: bool = False,
) -> Image.Image:
    """M21: Möbius Cylinder & Torus Tunnel Wrap.

    Wraps the 2D photo plane around a spinning 3D cylinder / Möbius torus tunnel
    that the camera flies through, seamlessly stitching multiple Stark effect
    variants (`01..16`) of the same image along the tunnel rings.
    """
    bass_v = _clamp(bass, 0.0, 1.0, 0.65)
    mid_v = _clamp(mid, 0.0, 1.0, 0.60)
    high_v = _clamp(high, 0.0, 1.0, 0.55)
    beat_v = _clamp(beat, 0.0, 1.0, 0.35)

    variants = prepare_variants_list(image_or_variants, palette_index=palette_index)
    n_var = len(variants)
    h, w = variants[0].shape[:2]

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx / max(w - 1, 1)) * 2.0 - 1.0
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0
    aspect = w / max(h, 1)

    # Orbiting curved torus tunnel vanishing point
    vp_x = 0.16 * math.cos(strobe_phase * math.pi * 2.0)
    vp_y = 0.12 * math.sin(strobe_phase * math.pi * 2.0)
    dx = (nx - vp_x) * aspect
    dy = ny - vp_y

    rad = np.hypot(dx, dy) + 1e-4
    theta = np.arctan2(dy, dx)  # [-pi, pi]

    # Log-polar tunnel depth coordinate + Möbius half-twist
    travel = strobe_phase * (3.5 + 1.5 * bass_v)
    z_depth = (0.42 / np.maximum(rad, 0.045)) + travel
    mobius_twist = theta + 0.5 * z_depth * (0.65 + 0.55 * mid_v) + strobe_phase * math.pi

    # Seamless mirrored wrap for u (around tunnel circumference) and v (along tunnel depth)
    u_raw = (mobius_twist / math.pi + 1.0) * 0.5  # [0, 1] per half-turn
    u_mirror = 1.0 - np.abs(np.mod(u_raw * 2.0, 2.0) - 1.0)
    v_ring_pos = z_depth * 0.85
    v_mirror = 1.0 - np.abs(np.mod(v_ring_pos, 2.0) - 1.0)

    sample_x = u_mirror * (w - 1)
    sample_y = v_mirror * (h - 1)

    # Stitch different Stage-1 Stark variants along consecutive tunnel depth rings!
    ring_index = np.floor(v_ring_pos).astype(np.int32)
    ring_frac = v_ring_pos - np.floor(v_ring_pos)

    # Sample up to 4 distinct variants from the pool and stitch across rings
    chosen_indices = [
        int((k + math.floor(strobe_phase * n_var)) % n_var) for k in range(min(4, n_var))
    ]
    sampled_rings = [
        _bilinear_sample(variants[v_idx], sample_x, sample_y, wrap=True)
        for v_idx in chosen_indices
    ]

    num_s = len(sampled_rings)
    ring_slot = np.mod(ring_index, num_s)
    next_slot = np.mod(ring_index + 1, num_s)

    tunnel_rgb = np.zeros_like(variants[0])
    fade_edge = _clamp(0.15 + 0.12 * photo_fade_duration, 0.05, 0.48, 0.20)
    blend_t = smoothstep(1.0 - fade_edge, 1.0, ring_frac)

    for s_idx in range(num_s):
        mask_cur = (ring_slot == s_idx)[:, :, None].astype(np.float32)
        mask_nxt = (next_slot == s_idx)[:, :, None].astype(np.float32)
        tunnel_rgb += sampled_rings[s_idx] * (
            mask_cur * (1.0 - blend_t[:, :, None]) + mask_nxt * blend_t[:, :, None]
        )

    # Neon ring seam highlights & Möbius longitudinal ribs in active palette colours
    pal = PALETTES[palette_index % len(PALETTES)]
    c_ring = hex_to_rgb_float(pal[0])
    c_rib = hex_to_rgb_float(pal[1 % len(pal)])

    ring_seam = np.exp(-((ring_frac - 0.5) ** 2) / (2.0 * (0.045 ** 2)))
    rib_seam = np.exp(-((np.sin(mobius_twist * 3.0)) ** 2) / (2.0 * (0.08 ** 2)))

    # Relativistic depth shading near the vanishing point core
    depth_fog = smoothstep(0.04, 0.24, rad)
    core_glow = np.exp(-(rad ** 2) / (2.0 * (0.09 ** 2))) * (0.85 + 0.45 * (bass_v + beat_v))

    out_rgb = (
        tunnel_rgb * (0.25 + 0.75 * depth_fog[:, :, None])
        + ring_seam[:, :, None] * c_ring[None, None, :] * (0.35 + 0.40 * bass_v) * depth_fog[:, :, None]
        + rib_seam[:, :, None] * c_rib[None, None, :] * (0.25 + 0.35 * high_v) * depth_fog[:, :, None]
        + core_glow[:, :, None] * (0.6 * c_ring[None, None, :] + 0.4 * c_rib[None, None, :])
    )

    return finalise_motion_output(
        out_rgb,
        photo_opacity=photo_opacity,
        photo_black_opacity=photo_black_opacity,
        photo_mid_opacity=photo_mid_opacity,
        photo_white_opacity=photo_white_opacity,
        photo_colour_snatch_opacity=photo_colour_snatch_opacity,
        return_rgba=return_rgba,
    )


def effect_m22_liquid_acid_domain_warp_melt(
    image_or_variants: Image.Image | list[Image.Image] | list[np.ndarray] | np.ndarray,
    palette_index: int = 0,
    bass: float = 0.55,
    mid: float = 0.80,
    high: float = 0.60,
    beat: float = 0.25,
    strobe_phase: float = 0.30,
    photo_opacity: float = 1.0,
    photo_fade_duration: float = 0.35,
    photo_black_opacity: float = 1.0,
    photo_mid_opacity: float = 1.0,
    photo_white_opacity: float = 1.0,
    photo_colour_snatch_opacity: float = 1.0,
    return_rgba: bool = False,
) -> Image.Image:
    """M22: Liquid Acid Domain-Warp Melt.

    Applies an audio-reactive curl-noise / liquid plasma displacement field that
    melts the photo's white and colour-snatched sectors on mid-synth swells while
    snapping back to stark geometry on kick transients.
    """
    bass_v = _clamp(bass, 0.0, 1.0, 0.55)
    mid_v = _clamp(mid, 0.0, 1.0, 0.80)
    high_v = _clamp(high, 0.0, 1.0, 0.60)
    beat_v = _clamp(beat, 0.0, 1.0, 0.25)

    variants = prepare_variants_list(image_or_variants, palette_index=palette_index)
    # Use a crisp non-ridgeline Stark variant as primary base when cycling through the pool
    active_rgb = 0.55 * variants[0] + 0.45 * resolve_variant_blend(variants, strobe_phase, photo_fade_duration)
    melt_partner_rgb = resolve_variant_blend(variants, strobe_phase + 0.31, photo_fade_duration)

    h, w = active_rgb.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx / max(w - 1, 1)) * 2.0 - 1.0
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0

    # Multi-octave analytical stream function Psi(nx, ny) for divergence-free 2D curl flow
    t_phase = strobe_phase * math.pi * 2.0
    psi = (
        np.sin(nx * 3.8 + t_phase) * np.cos(ny * 3.8 - t_phase * 0.7)
        + 0.55 * np.sin((nx * 6.5 - ny * 5.2) + t_phase * 1.4)
        + 0.30 * np.cos((nx * 11.0 + ny * 9.5) - t_phase * 2.1)
    )
    # Compute derivatives wrt normalised coordinates (nx, ny) in [-1, 1] so curl velocity is O(1)
    step_y = 2.0 / max(h - 1, 1)
    step_x = 2.0 / max(w - 1, 1)
    dpsi_dny, dpsi_dnx = np.gradient(psi, step_y, step_x)
    # Normalise curl velocity field (u = dPsi/dny, v = -dPsi/dnx) to O(1) range
    curl_u = (dpsi_dny / 4.5).astype(np.float32)
    curl_v = (-dpsi_dnx / 4.5).astype(np.float32)

    # Identify white and colour-snatched sectors (which melt more intensely than stark black anchors)
    _, sat, _ = rgb_to_hsv_array(active_rgb)
    luma = 0.2126 * active_rgb[:, :, 0] + 0.7152 * active_rgb[:, :, 1] + 0.0722 * active_rgb[:, :, 2]
    melt_susceptibility = np.clip(
        0.25 + 0.75 * np.maximum(smoothstep(0.38, 0.82, luma), smoothstep(0.14, 0.42, sat)),
        0.0,
        1.0,
    )

    # Kick transients (`beat_v` / heavy `bass_v`) snap geometry back toward crisp structure;
    # `mid_v` swells drive deep liquid acid domain-warping
    snap_recoil = 1.0 - 0.55 * _clamp(beat_v * 0.8 + bass_v * 0.2, 0.0, 0.85)
    scale_px = min(w, h) / 360.0
    melt_amp_px = (14.0 + 44.0 * mid_v) * scale_px * snap_recoil * melt_susceptibility

    # Iterative 2-pass domain warp (q = p + curl(p), r = p + curl(q))
    sx1 = xx + curl_u * melt_amp_px * 0.65
    sy1 = yy + curl_v * melt_amp_px * 0.65
    u2 = _bilinear_sample(curl_u[:, :, None], sx1, sy1, wrap=True)[:, :, 0]
    v2 = _bilinear_sample(curl_v[:, :, None], sx1, sy1, wrap=True)[:, :, 0]

    sx_final = xx + (0.45 * curl_u + 0.55 * u2) * melt_amp_px
    sy_final = yy + (0.45 * curl_v + 0.55 * v2) * melt_amp_px

    warped_main = _bilinear_sample(active_rgb, sx_final, sy_final, wrap=True)
    # Chromatic acid dispersion on the melt tendrils
    chroma_shift = (2.5 + 7.5 * high_v) * scale_px * melt_susceptibility
    warped_r = _bilinear_sample(active_rgb[:, :, 0:1], sx_final + chroma_shift, sy_final, wrap=True)[:, :, 0]
    warped_b = _bilinear_sample(active_rgb[:, :, 2:3], sx_final - chroma_shift, sy_final, wrap=True)[:, :, 0]
    warped_partner = _bilinear_sample(melt_partner_rgb, sx_final, sy_final, wrap=True)

    warped_rgb = np.stack([warped_r, warped_main[:, :, 1], warped_b], axis=-1)

    # Iridescent acid contour veins where curl shear & vorticity are highest
    pal = PALETTES[palette_index % len(PALETTES)]
    c0 = hex_to_rgb_float(pal[0])
    c1 = hex_to_rgb_float(pal[1 % len(pal)])
    c2 = hex_to_rgb_float(pal[2 % len(pal)])
    vorticity = np.hypot(u2 - curl_u, v2 - curl_v) + 0.35 * np.abs(np.sin(psi * math.pi * 2.0))
    acid_veins = smoothstep(0.28, 0.92, vorticity) * melt_susceptibility

    phase_tint = (
        c0[None, None, :] * (0.5 + 0.5 * np.sin(psi * 2.0)[:, :, None])
        + c1[None, None, :] * (0.5 + 0.5 * np.cos(psi * 2.0)[:, :, None])
        + c2[None, None, :] * 0.35
    )

    out_rgb = (
        warped_rgb * (1.0 - acid_veins[:, :, None] * 0.48)
        + warped_partner * (acid_veins[:, :, None] * 0.32)
        + acid_veins[:, :, None] * phase_tint * (0.55 + 0.45 * mid_v)
    )

    return finalise_motion_output(
        out_rgb,
        photo_opacity=photo_opacity,
        photo_black_opacity=photo_black_opacity,
        photo_mid_opacity=photo_mid_opacity,
        photo_white_opacity=photo_white_opacity,
        photo_colour_snatch_opacity=photo_colour_snatch_opacity,
        return_rgba=return_rgba,
    )


def effect_m23_luma_key_vortex_portal_bleed(
    image_or_variants: Image.Image | list[Image.Image] | list[np.ndarray] | np.ndarray,
    palette_index: int = 0,
    bass: float = 0.65,
    mid: float = 0.60,
    high: float = 0.60,
    beat: float = 0.40,
    strobe_phase: float = 0.25,
    portal_mode: str = "both",
    photo_opacity: float = 1.0,
    photo_fade_duration: float = 0.35,
    photo_black_opacity: float = 0.15,
    photo_mid_opacity: float = 1.0,
    photo_white_opacity: float = 0.35,
    photo_colour_snatch_opacity: float = 1.0,
    return_rgba: bool = False,
) -> Image.Image:
    """M23: Luma-Key Vortex Portal Bleed.

    Turns the photo's obsidian black sectors (`Y < 0.12`) and/or stark white sectors
    (`Y > 0.85`) into live transparent alpha portals through which a counter-rotating
    psychedelic spiral vortex & synth-grid field bleeds while the foreground
    strobes across the 16 variants.
    """
    bass_v = _clamp(bass, 0.0, 1.0, 0.65)
    mid_v = _clamp(mid, 0.0, 1.0, 0.60)
    high_v = _clamp(high, 0.0, 1.0, 0.60)
    beat_v = _clamp(beat, 0.0, 1.0, 0.40)

    variants = prepare_variants_list(image_or_variants, palette_index=palette_index)
    fg_rgb = resolve_variant_blend(variants, strobe_phase, photo_fade_duration)
    edge_variant_rgb = resolve_variant_blend(variants, strobe_phase + 0.4, photo_fade_duration * 0.5)

    h, w = fg_rgb.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx / max(w - 1, 1)) * 2.0 - 1.0
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0
    aspect = w / max(h, 1)
    dx = nx * aspect
    dy = ny
    rad = np.hypot(dx, dy) + 1e-4
    ang = np.arctan2(dy, dx)

    # Synthesise the live Layer-5 GPU Vortex + Layer-1 Outrun Synth-Grid portal world
    pal = PALETTES[palette_index % len(PALETTES)]
    c0 = hex_to_rgb_float(pal[0])
    c1 = hex_to_rgb_float(pal[1 % len(pal)])
    c2 = hex_to_rgb_float(pal[2 % len(pal)])
    c3 = hex_to_rgb_float(pal[3 % len(pal)])

    t_ang = strobe_phase * math.pi * 2.0
    vortex_arm1 = 0.5 + 0.5 * np.sin(ang * 6.0 - 10.0 * np.log(rad + 0.05) + t_ang * 3.0)
    vortex_arm2 = 0.5 + 0.5 * np.cos(ang * 8.0 + 14.0 * rad - t_ang * 2.5)
    hex_rings = 0.5 + 0.5 * np.sin(24.0 * rad - t_ang * 4.0)

    # Perspective synth-grid horizon lines inside the portal
    persp_z = 1.0 / np.maximum(np.abs(ny) + 0.08, 0.08)
    grid_x = np.abs(np.sin((nx * persp_z * 2.5 + strobe_phase * 2.0) * math.pi))
    grid_z = np.abs(np.sin((persp_z * 1.4 - strobe_phase * 6.0) * math.pi))
    synth_grid = np.clip(np.exp(-grid_x * 14.0) + np.exp(-grid_z * 12.0), 0.0, 1.0)

    vortex_world = (
        vortex_arm1[:, :, None] * c0[None, None, :] * (0.65 + 0.45 * bass_v)
        + vortex_arm2[:, :, None] * c1[None, None, :] * (0.55 + 0.45 * mid_v)
        + hex_rings[:, :, None] * c2[None, None, :] * 0.40
        + synth_grid[:, :, None] * c3[None, None, :] * (0.65 + 0.50 * high_v)
    )
    vortex_world = np.clip(vortex_world, 0.0, 1.0)

    # Compute Luma-Key Portal transparency on the foreground Stark photograph
    _, sat, _ = rgb_to_hsv_array(fg_rgb)
    luma = 0.2126 * fg_rgb[:, :, 0] + 0.7152 * fg_rgb[:, :, 1] + 0.0722 * fg_rgb[:, :, 2]
    gy, gx = np.gradient(luma)
    edges = np.clip(np.hypot(gx, gy) * 4.5, 0.0, 1.0)

    # Colour-snatched and structural edge sectors stay locked in the foreground
    fg_anchor = np.maximum(smoothstep(0.18, 0.38, sat), edges * 0.90)

    blk_op = _clamp(photo_black_opacity, 0.0, 1.0, 0.15)
    wht_op = _clamp(photo_white_opacity, 0.0, 1.0, 0.35)
    black_portal = (1.0 - smoothstep(0.06, 0.22, luma)) * (1.0 - fg_anchor) * (1.0 - blk_op * 0.5)
    white_portal = smoothstep(0.78, 0.92, luma) * (1.0 - smoothstep(0.20, 0.45, sat)) * (1.0 - wht_op * 0.5)

    pmode = str(portal_mode or "both").lower()
    if pmode == "black":
        portal_open = black_portal
    elif pmode == "white":
        portal_open = white_portal
    else:
        portal_open = np.clip(black_portal + white_portal * 0.85, 0.0, 1.0)

    # Glowing portal rim where foreground meets the vortex portal
    py, px = np.gradient(portal_open)
    portal_rim = np.clip(np.hypot(px, py) * 3.8, 0.0, 1.0)

    fg_mixed = fg_rgb * (1.0 - edges[:, :, None] * 0.35) + edge_variant_rgb * (edges[:, :, None] * 0.35)
    out_rgb = (
        fg_mixed * (1.0 - portal_open[:, :, None])
        + vortex_world * portal_open[:, :, None]
        + portal_rim[:, :, None] * (0.6 * c0[None, None, :] + 0.4 * c3[None, None, :]) * (0.8 + 0.5 * beat_v)
    )

    if return_rgba:
        # Compute alpha directly from the foreground photograph (`fg_rgb`) and portal_open so
        # obsidian/white portals become genuine transparent alpha windows in RGBA mode!
        fg_alpha = compute_sector_alpha_map(
            fg_rgb,
            photo_opacity=photo_opacity,
            photo_black_opacity=blk_op,
            photo_mid_opacity=photo_mid_opacity,
            photo_white_opacity=wht_op,
            photo_colour_snatch_opacity=photo_colour_snatch_opacity,
        )
        portal_alpha = np.clip(
            fg_alpha * (1.0 - portal_open * (1.0 - np.minimum(blk_op, wht_op))),
            0.0,
            _clamp(photo_opacity, 0.05, 1.0, 1.0),
        )
        rgba_u8 = np.dstack(
            [
                (np.clip(out_rgb, 0.0, 1.0) * 255.0).astype(np.uint8),
                (portal_alpha * 255.0).astype(np.uint8),
            ]
        )
        return Image.fromarray(rgba_u8, mode="RGBA")

    return finalise_motion_output(
        out_rgb,
        photo_opacity=photo_opacity,
        photo_black_opacity=blk_op,
        photo_mid_opacity=photo_mid_opacity,
        photo_white_opacity=wht_op,
        photo_colour_snatch_opacity=photo_colour_snatch_opacity,
        return_rgba=False,
        underlay_rgb=vortex_world,
    )


def effect_m24_cymatic_chladni_standing_wave_ripple(
    image_or_variants: Image.Image | list[Image.Image] | list[np.ndarray] | np.ndarray,
    palette_index: int = 0,
    bass: float = 0.70,
    mid: float = 0.65,
    high: float = 0.60,
    beat: float = 0.45,
    strobe_phase: float = 0.20,
    photo_opacity: float = 1.0,
    photo_fade_duration: float = 0.35,
    photo_black_opacity: float = 1.0,
    photo_mid_opacity: float = 1.0,
    photo_white_opacity: float = 1.0,
    photo_colour_snatch_opacity: float = 1.0,
    return_rgba: bool = False,
) -> Image.Image:
    """M24: Cymatic Chladni Standing-Wave Ripple.

    Superimposes 2D Chladni nodal standing-wave harmonics
    (`cos(n*pi*x)*cos(m*pi*y) - cos(m*pi*x)*cos(n*pi*y)`) driven by live
    bass/mid/high bands, vibrating the photo plane and strobing between two
    Stark variants along the nodal lines.
    """
    bass_v = _clamp(bass, 0.0, 1.0, 0.70)
    mid_v = _clamp(mid, 0.0, 1.0, 0.65)
    high_v = _clamp(high, 0.0, 1.0, 0.60)
    beat_v = _clamp(beat, 0.0, 1.0, 0.45)

    variants = prepare_variants_list(image_or_variants, palette_index=palette_index)
    var_a = resolve_variant_blend(variants, strobe_phase, photo_fade_duration)
    var_b = resolve_variant_blend(variants, strobe_phase + 0.5, photo_fade_duration)

    h, w = var_a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx / max(w - 1, 1)) * 2.0 - 1.0
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0

    # Audio-driven Chladni mode numbers (n, m)
    n_mode = 2.0 + round(bass_v * 4.0)
    m_mode = 3.0 + round(mid_v * 5.0)
    if abs(n_mode - m_mode) < 0.5:
        m_mode += 1.0

    phase = strobe_phase * math.pi * 2.0
    chladni_1 = np.cos(n_mode * math.pi * nx + phase * 0.5) * np.cos(m_mode * math.pi * ny) - np.cos(
        m_mode * math.pi * nx
    ) * np.cos(n_mode * math.pi * ny - phase * 0.5)
    # Second high-frequency harmonic overtone
    n2, m2 = n_mode + 2.0, m_mode + 3.0
    chladni_2 = np.cos(n2 * math.pi * nx) * np.cos(m2 * math.pi * ny) - np.cos(m2 * math.pi * nx) * np.cos(
        n2 * math.pi * ny
    )
    chladni = (0.75 * chladni_1 + 0.25 * high_v * chladni_2).astype(np.float32)

    # Standing-wave vibration displacement normal to the Chladni nodal lines (wrt normalised coords)
    step_y = 2.0 / max(h - 1, 1)
    step_x = 2.0 / max(w - 1, 1)
    cy_grad, cx_grad = np.gradient(chladni, step_y, step_x)
    grad_norm = np.hypot(cx_grad, cy_grad) + 1e-4
    nx_grad = cx_grad / grad_norm
    ny_grad = cy_grad / grad_norm

    scale_px = min(w, h) / 360.0
    vib_amp = (6.0 + 16.0 * (bass_v + 0.5 * beat_v)) * scale_px * np.sin(phase * 2.0 + chladni * math.pi)
    sx = xx + nx_grad * vib_amp
    sy = yy + ny_grad * vib_amp

    rippled_a = _bilinear_sample(var_a, sx, sy, wrap=True)
    rippled_b = _bilinear_sample(var_b, sx, sy, wrap=True)

    # Strobe / partition between Variant A (positive antinodes) and Variant B (negative antinodes)
    domain_mix = smoothstep(-0.22, 0.22, chladni)
    combined_photo = rippled_a * domain_mix[:, :, None] + rippled_b * (1.0 - domain_mix[:, :, None])

    # Nodal lines occur where |chladni| -> 0 (where cymatic sand/light collects)
    nodal_line = np.exp(-(np.abs(chladni) / (0.11 + 0.04 * high_v)) ** 2)
    nodal_fine = np.exp(-(np.abs(chladni) / 0.032) ** 2)

    pal = PALETTES[palette_index % len(PALETTES)]
    c_node1 = hex_to_rgb_float(pal[0])
    c_node2 = hex_to_rgb_float(pal[1 % len(pal)])
    chalk = np.array([0.97, 0.98, 0.99], dtype=np.float32)

    nodal_glow = (
        nodal_line[:, :, None]
        * (c_node1[None, None, :] * 0.65 + c_node2[None, None, :] * 0.35)
        * (0.75 + 0.55 * (mid_v + beat_v * 0.5))
        + nodal_fine[:, :, None] * chalk[None, None, :] * (0.45 + 0.45 * high_v)
    )

    out_rgb = combined_photo + nodal_glow

    return finalise_motion_output(
        out_rgb,
        photo_opacity=photo_opacity,
        photo_black_opacity=photo_black_opacity,
        photo_mid_opacity=photo_mid_opacity,
        photo_white_opacity=photo_white_opacity,
        photo_colour_snatch_opacity=photo_colour_snatch_opacity,
        return_rgba=return_rgba,
    )


def effect_m25_hyperdrive_volumetric_radial_extrusion(
    image_or_variants: Image.Image | list[Image.Image] | list[np.ndarray] | np.ndarray,
    palette_index: int = 0,
    bass: float = 0.75,
    mid: float = 0.60,
    high: float = 0.65,
    beat: float = 0.50,
    strobe_phase: float = 0.28,
    photo_opacity: float = 1.0,
    photo_fade_duration: float = 0.35,
    photo_black_opacity: float = 1.0,
    photo_mid_opacity: float = 1.0,
    photo_white_opacity: float = 1.0,
    photo_colour_snatch_opacity: float = 1.0,
    return_rgba: bool = False,
) -> Image.Image:
    """M25: Hyperdrive Volumetric Radial Extrusion.

    Extrudes the bright white and palette-matched colour sectors into 3D
    volumetric god-rays / light-beams shooting toward the viewer from an orbiting
    vanishing point while cycling through the 16 processed variants of the same image.
    """
    bass_v = _clamp(bass, 0.0, 1.0, 0.75)
    mid_v = _clamp(mid, 0.0, 1.0, 0.60)
    high_v = _clamp(high, 0.0, 1.0, 0.65)
    beat_v = _clamp(beat, 0.0, 1.0, 0.50)

    variants = prepare_variants_list(image_or_variants, palette_index=palette_index)
    n_var = len(variants)
    base_rgb = 0.55 * variants[0] + 0.45 * resolve_variant_blend(variants, strobe_phase, photo_fade_duration)

    h, w = base_rgb.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)

    # Orbiting vanishing point in pixel coordinates
    orb = strobe_phase * math.pi * 2.0
    vx = w * (0.48 + 0.14 * math.cos(orb))
    vy = h * (0.46 + 0.12 * math.sin(orb * 1.5))

    dx = xx - vx
    dy = yy - vy
    ang = np.arctan2(dy, dx)
    # Sharp angular god-ray comb so extruded light forms distinct radial shafts with obsidian gaps between rays
    shaft_a = (0.5 + 0.5 * np.sin(ang * 24.0 + orb * 3.0)) ** 3
    shaft_b = (0.5 + 0.5 * np.cos(ang * 38.0 - orb * 5.0)) ** 4
    ray_comb = np.clip(0.70 * shaft_a + 0.50 * shaft_b, 0.0, 1.0).astype(np.float32)

    pal = PALETTES[palette_index % len(PALETTES)]
    c0 = hex_to_rgb_float(pal[0])
    c1 = hex_to_rgb_float(pal[1 % len(pal)])
    c2 = hex_to_rgb_float(pal[2 % len(pal)])
    c3 = hex_to_rgb_float(pal[3 % len(pal)])
    tints = [c0, c1, c2, c3]

    # Pre-build 4 emissive variant layers gated by structural edges & palette resonance
    emissive_layers: list[np.ndarray] = []
    for k in range(4):
        v_rgb = variants[(int(math.floor(strobe_phase * n_var)) + k * max(1, n_var // 4)) % n_var]
        res_k, pal_rgb_k, luma_k = compute_palette_resonance(
            v_rgb, palette_index=palette_index, phase_shift=strobe_phase + k * 0.25
        )
        gy_k, gx_k = np.gradient(luma_k)
        edge_k = np.clip(np.hypot(gx_k, gy_k) * 5.5, 0.0, 1.0)
        white_emit = smoothstep(0.75, 0.96, luma_k) * (0.18 + 0.82 * edge_k) * ray_comb
        colour_emit = res_k * (0.25 + 0.75 * edge_k) * (0.30 + 0.70 * ray_comb)
        tint_k = tints[k % 4]
        emit_rgb = (
            pal_rgb_k * colour_emit[:, :, None] * 0.75
            + tint_k[None, None, :] * (white_emit * 0.65 + edge_k * ray_comb * 0.55)[:, :, None]
        )
        emissive_layers.append(np.clip(emit_rgb, 0.0, 1.0))

    # 18-step volumetric radial ray-marching from `(vx, vy)` toward `(xx, yy)`
    num_steps = 18
    max_extrude = 0.40 + 0.22 * (bass_v + 0.5 * beat_v)
    accum_rays = np.zeros_like(base_rgb)
    weight_sum = 0.0

    for step in range(num_steps):
        frac = (step + 1) / float(num_steps)
        scale_t = frac * max_extrude
        sx = xx - dx * scale_t
        sy = yy - dy * scale_t
        layer_idx = (step * 4) // num_steps
        sampled_emit = _bilinear_sample(emissive_layers[layer_idx], sx, sy, wrap=False)
        decay = (1.0 - frac * 0.70) ** 1.30
        accum_rays += sampled_emit * decay
        weight_sum += decay

    raw_beams = (
        (accum_rays / max(weight_sum, 1e-4))
        * (0.20 + 0.95 * ray_comb[:, :, None])
        * (1.25 + 0.55 * (bass_v + high_v * 0.5))
    )
    # Soft-knee tone mapping on the volumetric beams so saturated neon colours never clip all 3 channels to flat white
    volumetric_beams = raw_beams / (1.0 + 0.45 * raw_beams)

    # Forward hyperdrive zoom on the base frame with anchored obsidian contrast
    zoom_factor = 1.0 - 0.06 * (bass_v + beat_v * 0.5)
    zx = vx + dx * zoom_factor
    zy = vy + dy * zoom_factor
    zoomed_base = _bilinear_sample(base_rgb, zx, zy, wrap=False)
    base_luma = (
        0.2126 * zoomed_base[:, :, 0] + 0.7152 * zoomed_base[:, :, 1] + 0.0722 * zoomed_base[:, :, 2]
    )
    shadow_anchor = smoothstep(0.08, 0.25, base_luma)[:, :, None]

    # Preserve deep obsidian shadow pockets in the troughs between radial god-ray shafts
    ray_mask = (shadow_anchor * (0.45 - 0.12 * base_luma[:, :, None]))
    out_rgb = zoomed_base * ray_mask + volumetric_beams * (0.25 + 0.75 * np.maximum(shadow_anchor, ray_comb[:, :, None]))

    return finalise_motion_output(
        out_rgb,
        photo_opacity=photo_opacity,
        photo_black_opacity=photo_black_opacity,
        photo_mid_opacity=photo_mid_opacity,
        photo_white_opacity=photo_white_opacity,
        photo_colour_snatch_opacity=photo_colour_snatch_opacity,
        return_rgba=return_rgba,
    )


EFFECTS_GROUP_4: dict[str, Callable[..., Image.Image]] = {
    "M19_Palette_Resonance_Hyper_Enhancer": effect_m19_palette_resonance_hyper_enhancer,
    "M20_Event_Horizon_Gravitational_Lens": effect_m20_event_horizon_gravitational_lens,
    "M21_Mobius_Cylinder_And_Torus_Tunnel_Wrap": effect_m21_mobius_cylinder_and_torus_tunnel_wrap,
    "M22_Liquid_Acid_Domain_Warp_Melt": effect_m22_liquid_acid_domain_warp_melt,
    "M23_Luma_Key_Vortex_Portal_Bleed": effect_m23_luma_key_vortex_portal_bleed,
    "M24_Cymatic_Chladni_Standing_Wave_Ripple": effect_m24_cymatic_chladni_standing_wave_ripple,
    "M25_Hyperdrive_Volumetric_Radial_Extrusion": effect_m25_hyperdrive_volumetric_radial_extrusion,
}


# ---------------------------------------------------------------------------
# Contact Sheet Renderer for Group D (`M19`–`M25` + Fade/Opacity Showcase)
# ---------------------------------------------------------------------------

def build_group4_contact_sheet(
    processed_custom_dir: str | None = None,
    output_path: str | None = None,
    source_stem: str | None = None,
    palette_index: int = 0,
) -> dict[str, Any]:
    """Render all 7 Group D effects (`M19`–`M25`) plus a Sector-Selective Fade/Opacity
    showcase panel using a 16-variant custom photograph set from `processed/custom/`,
    saving the contact sheet into `~/Pictures/bandarchy/Old/ContactSheet_Motion_Group4_WorldBending_Palette.png`.
    """
    t0 = time.monotonic()
    root_dir = resolve_pictures_bandarchy_dir()
    proc_dir = os.path.abspath(processed_custom_dir or os.path.join(root_dir, "processed", "custom"))
    old_dir = os.path.join(root_dir, "Old")
    os.makedirs(old_dir, mode=0o755, exist_ok=True)
    out_cs = os.path.abspath(
        output_path or os.path.join(old_dir, "ContactSheet_Motion_Group4_WorldBending_Palette.png")
    )

    if not source_stem:
        candidates = sorted(glob.glob(os.path.join(proc_dir, "01_SinCity_Chroma_Snatch__*.png")))
        if not candidates:
            raise PhotoMotionGroup4Error(f"No processed custom PNGs found in {proc_dir}")
        preferred = [c for c in candidates if "12_Objects_Marble_Bust_Valves_BW" in os.path.basename(c)]
        chosen = preferred[0] if preferred else candidates[0]
        source_stem = extract_source_stem_from_processed_filename(chosen)

    variants = load_16_variants_for_source(proc_dir, source_stem)
    base_im = Image.fromarray((variants[0] * 255.0).astype(np.uint8), mode="RGB")

    panels: list[tuple[str, str, Image.Image]] = [
        (
            "00_Stage1_MultiVariant_Pool",
            f"Source: {source_stem} (16 Stark Variants Loaded)",
            base_im,
        )
    ]

    subtitles = {
        "M19_Palette_Resonance_Hyper_Enhancer": "Active Palette Hue Match + Shockwave Bloom + 16-Variant Strobe",
        "M20_Event_Horizon_Gravitational_Lens": "Twin Orbiting Black Holes + Einstein Ring Lensing + Accretion Vortex",
        "M21_Mobius_Cylinder_And_Torus_Tunnel_Wrap": "3D Möbius Torus Tunnel Stitching Variants 01..16 Along Rings",
        "M22_Liquid_Acid_Domain_Warp_Melt": "Divergence-Free Curl-Noise Acid Melt + Kick Transient Snap-Back",
        "M23_Luma_Key_Vortex_Portal_Bleed": "Obsidian/White Sector Luma-Key Portals + Counter-Rotating Vortex",
        "M24_Cymatic_Chladni_Standing_Wave_Ripple": "2D Chladni Standing-Wave Harmonics + Dual-Variant Nodal Strobe",
        "M25_Hyperdrive_Volumetric_Radial_Extrusion": "18-Step 3D Volumetric God-Ray Extrusion Across 16 Variants",
    }

    sample_paths: list[str] = []
    for idx, (m_name, m_fn) in enumerate(EFFECTS_GROUP_4.items()):
        pal_idx = (palette_index + idx * 3) % len(PALETTES)
        pal_label = PALETTE_NAMES[pal_idx]
        rendered = m_fn(
            variants,
            palette_index=pal_idx,
            bass=0.72,
            mid=0.68,
            high=0.64,
            beat=0.48,
            strobe_phase=0.17 * (idx + 1),
            photo_opacity=0.95,
            photo_fade_duration=0.40,
        )
        sample_file = os.path.join(old_dir, f"Preview_{m_name}__{source_stem}.png")
        safe_write_image(rendered, sample_file)
        sample_paths.append(sample_file)
        panels.append((m_name, f"{subtitles[m_name]} [{pal_label}]", rendered))

    # Assemble 4 columns × 2 rows contact sheet (Base + 7 Group D effects = 8 panels)
    thumb_w, thumb_h = 360, 270
    pad = 18
    header_h = 84
    label_h = 46
    cols = 4
    rows = 2

    sheet_w = pad + cols * (thumb_w + pad)
    sheet_h = header_h + pad + rows * (thumb_h + label_h + pad)
    sheet = Image.new("RGB", (sheet_w, sheet_h), (7, 9, 14))
    draw = ImageDraw.Draw(sheet)

    title_font = _load_monospace_font(19)
    sub_font = _load_monospace_font(12)
    cap_font = _load_monospace_font(11)

    draw.rectangle([0, 0, sheet_w, header_h], fill=(13, 18, 28))
    draw.text(
        (pad, 14),
        "BANDARCHY STAGE-2 PHOTO MOTION — GROUP D (M19–M25: WORLD-BENDING WARPS, PALETTE RESONANCE & PORTALS)",
        fill=(110, 231, 183),
        font=title_font,
    )
    draw.text(
        (pad, 46),
        f"Source Stem: {source_stem} (16 Variants Active) • Includes Master/Sector Opacity & Cross-Fade Pipeline",
        fill=(203, 213, 225),
        font=sub_font,
    )

    for idx, (title, subtitle, im) in enumerate(panels):
        r_idx = idx // cols
        c_idx = idx % cols
        x0 = pad + c_idx * (thumb_w + pad)
        y0 = header_h + pad + r_idx * (thumb_h + label_h + pad)

        thumb = im.convert("RGB").resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(thumb, (x0, y0))
        border_col = (244, 114, 182) if idx > 0 else (110, 231, 183)
        draw.rectangle([x0 - 1, y0 - 1, x0 + thumb_w, y0 + thumb_h], outline=border_col, width=2)
        draw.text((x0 + 2, y0 + thumb_h + 5), title[:42], fill=(248, 250, 252), font=sub_font)
        draw.text((x0 + 2, y0 + thumb_h + 24), subtitle[:54], fill=(148, 163, 184), font=cap_font)

    saved_cs = safe_write_image(sheet, out_cs)
    elapsed_ms = round((time.monotonic() - t0) * 1000.0, 2)
    return {
        "ok": True,
        "group": "Group D (M19-M25)",
        "source_stem": source_stem,
        "variants_loaded": len(variants),
        "contact_sheet_path": saved_cs,
        "sample_paths": sample_paths,
        "effects": list(EFFECTS_GROUP_4.keys()),
        "elapsed_ms": elapsed_ms,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Bandarchy Stage-2 Photo Motion Group D (M19–M25) Engine & Contact Sheet Builder"
    )
    parser.add_argument("--source-stem", default=None, help="Source stem inside processed/custom/")
    parser.add_argument("--processed-dir", default=None, help="Directory containing 16 Stark variants")
    parser.add_argument("--output-contact-sheet", default=None, help="Output contact sheet PNG path")
    parser.add_argument("--palette-index", type=int, default=0, help="Bandarchy palette index (0..29)")
    parser.add_argument("--json", action="store_true", help="Emit single-line JSON output")
    args = parser.parse_args(argv)

    try:
        summary = build_group4_contact_sheet(
            processed_custom_dir=args.processed_dir,
            output_path=args.output_contact_sheet,
            source_stem=args.source_stem,
            palette_index=args.palette_index,
        )
        if args.json:
            print(json.dumps(summary))
        else:
            print(f"Generated Group D Contact Sheet: {summary['contact_sheet_path']} ({summary['elapsed_ms']} ms)")
        return 0
    except Exception as exc:
        if args.json:
            print(json.dumps({"ok": False, "error": str(exc)}))
        else:
            print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
