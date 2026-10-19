#!/usr/bin/env python3
"""effects_family2.py — Bandarchy Stark Snapshot & Sector Colour-Snatch Engine (Family 2: Effects 05–08).

Duotone, Brutalist Stencil & Sabattier Specialist module for Bandarchy.
Designed for standalone execution and direct integration into Bandarchy's
`bin/bandarchy` helper and `Visualiser.qml` stage pipeline.

Effects implemented:
  05_Omarchy_Cyber_Tritone_Stark   — 3-sector razor-sharp quantisation mapped to
                                     Obsidian (#07090e), Omarchy Emerald (#6ee7b7),
                                     and Urgent Magenta (#f472b6).
  06_Brutalist_Woodcut_Spot_Snatch — Adaptive local-contrast binary woodcut threshold
                                     (pure ink black + stark bone white) with a central
                                     radial colour-snatch spotlight preserving original
                                     or synthetic Bandarchy palette hues.
  07_Sabattier_Solarised_Snatch    — Darkroom Man Ray Sabattier tonal curve inversion
                                     where mid-highlights invert into metallic charcoal
                                     while Mackie contour boundaries blaze with snatched
                                     electric colour.
  08_Acid_Poster_4Sector_Snatch    — 4-sector hard posterisation where outer sectors
                                     remain stark black and stark white, and the two
                                     inner tonal sectors snatch complementary psychedelic
                                     palette colours.

Compliance & Security Guarantees:
  - Source images in ~/Pictures/bandarchy/sources are strictly read-only.
  - Rejects symlinks, non-regular files, and files exceeding MAX_ART_BYTES (15 MiB).
  - Writes output images atomically via temporary files in the destination directory.
  - Strictly uses British English orthography throughout.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import stat
import sys
import tempfile
import time
from dataclasses import dataclass
from typing import Callable, Sequence

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps

os.umask(0o077)

# Bandarchy safety ceilings & supported extensions
MAX_ART_BYTES = 15 * 1024 * 1024  # 15 MiB ceiling matching bin/bandarchy
MAX_IMAGE_PIXELS = 36_000_000     # Guard against decompression bombs
DEFAULT_STAGE_MAX_DIM = 1400      # High-definition visualiser stage resolution
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")
BW_SATURATION_THRESHOLD = 0.04    # Mean HSV saturation below which source is treated as B&W

Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS


def resolve_pictures_bandarchy_dir() -> str:
    """Resolve $XDG_PICTURES_DIR/bandarchy dynamically, falling back to ~/Pictures/bandarchy."""
    home = os.path.expanduser("~")
    xdg_pics = (os.environ.get("XDG_PICTURES_DIR") or "").strip()
    if not xdg_pics:
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
                            raw = raw.replace("$HOME", home)
                            if os.path.isabs(raw):
                                xdg_pics = raw
                            break
            except OSError:
                pass
    if not xdg_pics:
        xdg_pics = os.path.join(home, "Pictures")
    return os.path.join(xdg_pics, "bandarchy")


def resolve_cache_stark_dir() -> str:
    """Resolve ~/.cache/bandarchy/stark-art for runtime non-destructive caching."""
    home = os.path.expanduser("~")
    cache_root = os.environ.get("BANDARCHY_CACHE_DIR") or os.path.join(
        os.environ.get("XDG_CACHE_HOME") or os.path.join(home, ".cache"),
        "bandarchy",
    )
    return os.path.join(cache_root, "stark-art")


# Bandarchy signature palettes (from PsychedelicEngine.js) and Omarchy theme accents
OMARCHY_CYBER_TRITONE = {
    "obsidian": (7, 9, 14),        # #07090e
    "obsidian_lift": (18, 24, 36), # #121824
    "emerald_deep": (5, 150, 105), # #059669
    "emerald": (110, 231, 183),    # #6ee7b7
    "magenta": (244, 114, 182),    # #f472b6
    "magenta_hot": (255, 42, 133), # #ff2a85
    "specular": (248, 250, 252),   # #f8fafc
}

BANDARCHY_PSYCHEDELIC_PALETTES: list[tuple[str, list[tuple[int, int, int]]]] = [
    (
        "Acid Rainbow",
        [
            (255, 0, 127),   # #ff007f Acid Magenta
            (0, 245, 212),   # #00f5d4 Biolume Cyan
            (254, 228, 64),  # #fee440 Solar Acid Yellow
            (155, 93, 229),  # #9b5de5 Ultraviolet
            (0, 187, 249),   # #00bbf9 Electric Sky
            (241, 91, 181),  # #f15bb5 Hot Pink
        ],
    ),
    (
        "Omarchy Emerald & Urgent Magenta",
        [
            (110, 231, 183), # #6ee7b7 Omarchy Emerald
            (244, 114, 182), # #f472b6 Urgent Magenta
            (56, 189, 248),  # #38bdf8 Cyber Cyan
            (251, 191, 36),  # #fbbf24 Solar Gold
            (192, 132, 252), # #c084fc Ultraviolet Rave
            (52, 211, 153),  # #34d399 Matrix Mint
        ],
    ),
    (
        "Toxic Acid 303",
        [
            (204, 255, 0),   # #ccff00 Acid Lime
            (255, 0, 85),    # #ff0055 Laser Crimson
            (0, 255, 102),   # #00ff66 Neon Green
            (124, 58, 237),  # #7c3aed Deep Violet
            (250, 255, 0),   # #faff00 Strobe Yellow
            (16, 185, 129),  # #10b981 Emerald
        ],
    ),
    (
        "Tokyo Synthwave",
        [
            (255, 0, 160),   # #ff00a0 Synth Magenta
            (0, 240, 255),   # #00f0ff Cyber Cyan
            (122, 4, 235),   # #7a04eb Electric Indigo
            (254, 117, 254), # #fe75fe Neon Orchid
            (255, 18, 79),   # #ff124f Crimson Pulse
            (5, 217, 232),   # #05d9e8 Laser Aqua
        ],
    ),
]


class StarkEffectError(ValueError):
    """Operational error raised when validating or processing a stark image copy."""


@dataclass(frozen=True)
class SourceAnalysis:
    """Decomposed luminance, saturation, hue, and structural gradient fields for a source image."""

    rgb_float: np.ndarray        # (H, W, 3) float32 in [0.0, 1.0]
    luminance: np.ndarray        # (H, W) float32 ITU-R BT.709 luminance in [0.0, 1.0]
    lum_stretched: np.ndarray    # (H, W) float32 contrast-normalised + unsharp luminance in [0.0, 1.0]
    hue: np.ndarray              # (H, W) float32 hue in [0.0, 1.0]
    saturation: np.ndarray       # (H, W) float32 HSV saturation in [0.0, 1.0]
    value: np.ndarray            # (H, W) float32 HSV value in [0.0, 1.0]
    gradient: np.ndarray         # (H, W) float32 normalised Sobel edge magnitude in [0.0, 1.0]
    mean_saturation: float       # Scalar mean saturation
    is_bw_source: bool           # True when mean_saturation < BW_SATURATION_THRESHOLD


def _normalise_pil_to_rgb(img: Image.Image) -> Image.Image:
    """Composite alpha cleanly over dark obsidian (#07090e) if source has transparency, and convert to RGB."""
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        rgba = img.convert("RGBA")
        bg = Image.new("RGBA", rgba.size, (7, 9, 14, 255))
        return Image.alpha_composite(bg, rgba).convert("RGB")
    if img.mode != "RGB":
        return img.convert("RGB")
    return img


def validate_and_load_image(
    source_path: str,
    max_dim: int = DEFAULT_STAGE_MAX_DIM,
) -> Image.Image:
    """Validate that source_path is a safe, non-symlinked regular file within MAX_ART_BYTES and load it.

    The original file is opened strictly read-only, transposed according to EXIF
    orientation, converted to RGB, and downscaled if larger than max_dim.
    """
    if not source_path or not isinstance(source_path, str):
        raise StarkEffectError("Empty or invalid source image path.")

    abs_path = os.path.abspath(source_path)
    try:
        lst = os.lstat(abs_path)
    except OSError as exc:
        raise StarkEffectError(f"Cannot stat source image '{abs_path}': {exc}") from exc

    if stat.S_ISLNK(lst.st_mode):
        raise StarkEffectError(f"Refusing symlinked image path: '{abs_path}'")
    if not stat.S_ISREG(lst.st_mode):
        raise StarkEffectError(f"Refusing non-regular image file: '{abs_path}'")
    if lst.st_size <= 0:
        raise StarkEffectError(f"Refusing empty image file: '{abs_path}'")
    if lst.st_size > MAX_ART_BYTES:
        raise StarkEffectError(
            f"Image '{abs_path}' ({lst.st_size} bytes) exceeds MAX_ART_BYTES ({MAX_ART_BYTES} bytes)."
        )

    ext = os.path.splitext(abs_path)[1].lower()
    if ext not in IMAGE_EXTENSIONS:
        raise StarkEffectError(
            f"Unsupported image extension '{ext}' for '{abs_path}'. Allowed: {IMAGE_EXTENSIONS}"
        )

    try:
        with open(abs_path, "rb") as fh:
            img = Image.open(fh)
            raw_w, raw_h = img.size
            if raw_w <= 0 or raw_h <= 0:
                raise StarkEffectError(f"Invalid image dimensions {raw_w}x{raw_h} for '{abs_path}'.")
            if raw_w * raw_h > MAX_IMAGE_PIXELS:
                raise StarkEffectError(
                    f"Image '{abs_path}' ({raw_w}x{raw_h} = {raw_w * raw_h} px) exceeds MAX_IMAGE_PIXELS ({MAX_IMAGE_PIXELS})."
                )
            img.load()
    except StarkEffectError:
        raise
    except Exception as exc:
        raise StarkEffectError(f"Failed to decode image '{abs_path}': {exc}") from exc

    img = ImageOps.exif_transpose(img)
    img = _normalise_pil_to_rgb(img)

    w, h = img.size
    if w <= 0 or h <= 0:
        raise StarkEffectError(f"Invalid image dimensions {w}x{h} for '{abs_path}'.")

    if max_dim > 0 and max(w, h) > max_dim:
        scale = max_dim / float(max(w, h))
        new_w = max(1, int(round(w * scale)))
        new_h = max(1, int(round(h * scale)))
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    return img


def atomic_save_png(img: Image.Image, target_path: str) -> str:
    """Write a PIL Image atomically as a PNG to target_path without partial-file hazards."""
    abs_target = os.path.abspath(target_path)
    parent_dir = os.path.dirname(abs_target)
    os.makedirs(parent_dir, mode=0o755, exist_ok=True)

    fd, tmp_path = tempfile.mkstemp(
        prefix=".bandarchy_stark_",
        suffix=".png",
        dir=parent_dir,
    )
    try:
        with os.fdopen(fd, "wb") as fh:
            img.save(fh, format="PNG", compress_level=1)
        os.chmod(tmp_path, 0o644)
        os.replace(tmp_path, abs_target)
    except Exception:
        try:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        except OSError:
            pass
        raise
    return abs_target


def _rgb_to_hsv_arrays(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Vectorised RGB [0, 1] -> HSV [0, 1] conversion."""
    r = rgb[:, :, 0]
    g = rgb[:, :, 1]
    b = rgb[:, :, 2]

    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    delta = maxc - minc

    # Saturation
    sat = np.where(maxc > 1e-6, delta / np.maximum(maxc, 1e-6), 0.0).astype(np.float32)

    # Hue
    hue = np.zeros_like(maxc, dtype=np.float32)
    mask = delta > 1e-6
    safe_delta = np.where(mask, delta, 1.0)

    r_max = mask & (r == maxc)
    g_max = mask & (g == maxc) & ~r_max
    b_max = mask & ~r_max & ~g_max

    hue = np.where(r_max, ((g - b) / safe_delta) % 6.0, hue)
    hue = np.where(g_max, ((b - r) / safe_delta) + 2.0, hue)
    hue = np.where(b_max, ((r - g) / safe_delta) + 4.0, hue)
    hue = (hue / 6.0) % 1.0

    return hue.astype(np.float32), sat, maxc.astype(np.float32)


def _hsv_to_rgb_arrays(h: np.ndarray, s: np.ndarray, v: np.ndarray) -> np.ndarray:
    """Vectorised HSV [0, 1] -> RGB [0, 1] conversion."""
    h6 = (h % 1.0) * 6.0
    i = np.floor(h6).astype(np.int32)
    f = h6 - i
    p = v * (1.0 - s)
    q = v * (1.0 - s * f)
    t = v * (1.0 - s * (1.0 - f))

    i_mod = i % 6
    r = np.select(
        [i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
        [v, q, p, p, t, v],
        default=v,
    )
    g = np.select(
        [i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
        [t, v, v, q, p, p],
        default=v,
    )
    b = np.select(
        [i_mod == 0, i_mod == 1, i_mod == 2, i_mod == 3, i_mod == 4, i_mod == 5],
        [p, p, t, v, v, q],
        default=v,
    )
    return np.clip(np.stack([r, g, b], axis=-1), 0.0, 1.0).astype(np.float32)


def _sobel_gradient(lum: np.ndarray) -> np.ndarray:
    """Compute normalised Sobel structural gradient magnitude in [0, 1] without SciPy."""
    padded = np.pad(lum, 1, mode="edge")
    gx = (
        -1.0 * padded[:-2, :-2]
        + 1.0 * padded[:-2, 2:]
        - 2.0 * padded[1:-1, :-2]
        + 2.0 * padded[1:-1, 2:]
        - 1.0 * padded[2:, :-2]
        + 1.0 * padded[2:, 2:]
    )
    gy = (
        -1.0 * padded[:-2, :-2]
        - 2.0 * padded[:-2, 1:-1]
        - 1.0 * padded[:-2, 2:]
        + 1.0 * padded[2:, :-2]
        + 2.0 * padded[2:, 1:-1]
        + 1.0 * padded[2:, 2:]
    )
    mag = np.hypot(gx, gy)
    p98 = float(np.percentile(mag, 98.5))
    denom = max(p98, 1e-4)
    return np.clip(mag / denom, 0.0, 1.0).astype(np.float32)


def _gaussian_blur_float(arr: np.ndarray, radius: float) -> np.ndarray:
    """Apply a fast PIL C-accelerated Gaussian blur to a 2D float32 array in [0, 1]."""
    if radius <= 0.05 or min(arr.shape) < 2:
        return arr.copy()
    u8 = np.clip(arr * 255.0, 0.0, 255.0).astype(np.uint8)
    pil_l = Image.fromarray(u8, mode="L").filter(ImageFilter.GaussianBlur(radius=float(radius)))
    return (np.asarray(pil_l, dtype=np.float32) / 255.0).astype(np.float32)


def analyse_source_image(img: Image.Image) -> SourceAnalysis:
    """Decompose an RGB PIL Image into ITU-R BT.709 luminance, unsharp-stretched luminance, HSV, and Sobel edges."""
    img = _normalise_pil_to_rgb(img)

    rgb_u8 = np.asarray(img, dtype=np.uint8)
    rgb_float = (rgb_u8.astype(np.float32)) / 255.0

    # ITU-R BT.709 luminance: Y = 0.2126 R + 0.7152 G + 0.0722 B
    lum = (
        0.2126 * rgb_float[:, :, 0]
        + 0.7152 * rgb_float[:, :, 1]
        + 0.0722 * rgb_float[:, :, 2]
    ).astype(np.float32)

    # Local unsharp mask + robust percentile contrast stretch so stark sectors have graphic clarity
    lum_u8 = np.clip(lum * 255.0, 0.0, 255.0).astype(np.uint8)
    pil_lum = Image.fromarray(lum_u8, mode="L")
    if min(pil_lum.size) >= 8:
        pil_sharp = pil_lum.filter(ImageFilter.UnsharpMask(radius=2.2, percent=175, threshold=2))
    else:
        pil_sharp = pil_lum
    sharp_arr = np.asarray(pil_sharp, dtype=np.float32) / 255.0

    p_low = float(np.percentile(sharp_arr, 2.5))
    p_high = float(np.percentile(sharp_arr, 97.5))
    if p_high - p_low > 1e-4:
        lum_stretched = np.clip((sharp_arr - p_low) / (p_high - p_low), 0.0, 1.0)
    else:
        lum_stretched = np.clip(sharp_arr, 0.0, 1.0)

    hue, sat, val = _rgb_to_hsv_arrays(rgb_float)
    grad = _sobel_gradient(lum_stretched)

    # Denoise isolated 8x8 JPEG chroma block artefacts when deciding B&W vs Colour
    sat_smooth = _gaussian_blur_float(sat, radius=1.2)
    mean_sat = float(np.mean(sat_smooth))
    p92_sat = float(np.percentile(sat_smooth, 92.0))
    is_bw = (mean_sat < BW_SATURATION_THRESHOLD) or (p92_sat < 0.065)

    return SourceAnalysis(
        rgb_float=rgb_float,
        luminance=lum,
        lum_stretched=lum_stretched.astype(np.float32),
        hue=hue,
        saturation=sat,
        value=val,
        gradient=grad,
        mean_saturation=mean_sat,
        is_bw_source=is_bw,
    )


def _adaptive_threshold(values: np.ndarray, quantile: float, fixed_target: float, blend: float = 0.55) -> float:
    """Compute a stable threshold blending an image quantile with a fixed tonal target."""
    q_val = float(np.percentile(values, quantile * 100.0))
    return float(blend * q_val + (1.0 - blend) * fixed_target)


# ===========================================================================
# Effect 05: 05_Omarchy_Cyber_Tritone_Stark
# ===========================================================================
def effect_05_omarchy_cyber_tritone_stark(
    img: Image.Image,
    analysis: SourceAnalysis | None = None,
    *,
    bass: float = 0.0,
    mid: float = 0.0,
    high: float = 0.0,
    onset: float = 0.0,
    palette_index: int = 1,
) -> Image.Image:
    """Quantise the image into 3 razor-sharp sectors mapped to Obsidian (#07090e),
    Omarchy Emerald (#6ee7b7), and Urgent Magenta (#f472b6).

    - Deep Black Sector (< ~36%): Obsidian (#07090e).
    - Mid-Structure Sector (~36%–72%): Omarchy Emerald (#6ee7b7).
    - Stark Highlight & Chroma-Snatch Sector (> ~72%): Urgent Magenta (#f472b6).
    - Every pixel is strictly quantised to one of the 3 exact tritone hex colours.
      On Colour sources, high-saturation focal clusters in the mid-tone range are
      snatched directly into the Urgent Magenta sector.
    """
    if analysis is None:
        analysis = analyse_source_image(img)

    lum = analysis.lum_stretched
    grad = analysis.gradient
    sat = analysis.saturation

    # Audio-reactive threshold modulation (defaults to 0 when unlinked)
    shift = float(np.clip(0.06 * (bass - high) - 0.03 * onset, -0.10, 0.10))
    t_black = _adaptive_threshold(lum, 0.36, 0.35) + shift
    t_white = _adaptive_threshold(lum, 0.72, 0.72) + shift * 0.5
    t_white = max(t_black + 0.12, min(0.90, t_white))

    # Enhance razor-sharp sector crispness with local unsharp structural bias
    local_mean = _gaussian_blur_float(lum, radius=5.0)
    local_detail = lum - local_mean
    crisp_lum = np.clip(lum + 0.50 * local_detail, 0.0, 1.0)

    # On colour sources, high-chroma focal regions in the mid-bright zone get snatched
    # into the Urgent Magenta highlight sector
    if not analysis.is_bw_source:
        p78_sat = float(np.percentile(sat, 78.0))
        chroma_boost = np.where((sat > max(0.30, p78_sat)) & (crisp_lum > t_black * 0.85), 0.22 * sat, 0.0)
        effective_lum = np.clip(crisp_lum + chroma_boost, 0.0, 1.0)
    else:
        # On B&W sources, high-gradient structural ridges in upper-mids snatch into Magenta
        effective_lum = np.clip(crisp_lum + np.where(crisp_lum > 0.50, 0.14 * grad, -0.06 * grad), 0.0, 1.0)

    h_px, w_px = lum.shape
    out_u8 = np.zeros((h_px, w_px, 3), dtype=np.uint8)

    obsidian_u8 = np.array(OMARCHY_CYBER_TRITONE["obsidian"], dtype=np.uint8) # #07090e
    emerald_u8 = np.array(OMARCHY_CYBER_TRITONE["emerald"], dtype=np.uint8)   # #6ee7b7
    magenta_u8 = np.array(OMARCHY_CYBER_TRITONE["magenta"], dtype=np.uint8)   # #f472b6

    sec_black = effective_lum < t_black
    sec_mid = (effective_lum >= t_black) & (effective_lum < t_white)
    sec_white = effective_lum >= t_white

    out_u8[sec_black] = obsidian_u8
    out_u8[sec_mid] = emerald_u8
    out_u8[sec_white] = magenta_u8

    # Razor-sharp ink keylines along strong structural boundaries
    keyline = (grad > 0.62) & (effective_lum < t_white * 0.98)
    out_u8[keyline] = obsidian_u8

    return Image.fromarray(out_u8, mode="RGB")


# ===========================================================================
# Effect 06: 06_Brutalist_Woodcut_Spot_Snatch
# ===========================================================================
def effect_06_brutalist_woodcut_spot_snatch(
    img: Image.Image,
    analysis: SourceAnalysis | None = None,
    *,
    bass: float = 0.0,
    mid: float = 0.0,
    high: float = 0.0,
    onset: float = 0.0,
    palette_index: int = 1,
) -> Image.Image:
    """Adaptive local-contrast binary threshold (pure black + stark bone white)
    with a single central radial 'colour-snatch spotlight' preserving original/palette hues.

    - Outer frame: Brutalist woodcut / linocut block print in pure ink black (#06070a)
      and stark bone white (#f4f1ea) using multi-scale adaptive local thresholding.
    - Central radial spotlight: Punches a crisp architectural aperture near the image centre
      where vibrant colour is snatched across the tonal sectors while preserving the
      etched woodcut black ink lines for structural cohesion.
    - Automatic B&W fallback: When the source image is B&W, synthesises rich Bandarchy
      palette colour-snatch inside the spotlight across luminance & angular sectors.
    """
    if analysis is None:
        analysis = analyse_source_image(img)

    lum = analysis.lum_stretched
    grad = analysis.gradient
    h_px, w_px = lum.shape
    min_dim = float(min(h_px, w_px))

    # Multi-scale local mean for authentic woodcut adaptive threshold
    r_fine = max(2.0, min_dim * 0.014)
    r_coarse = max(6.0, min_dim * 0.055)
    mean_fine = _gaussian_blur_float(lum, radius=r_fine)
    mean_coarse = _gaussian_blur_float(lum, radius=r_coarse)
    local_thresh = 0.45 * mean_fine + 0.35 * mean_coarse + 0.20 * float(np.median(lum))

    # Woodcut binary decision: bright local surfaces -> Bone White, etched grooves/shadows -> Ink Black
    woodcut_white_mask = (lum > (local_thresh - 0.015)) & ~(
        (grad > 0.46) & (lum < local_thresh + 0.08)
    )

    ink_black = np.array([6.0, 7.0, 10.0], dtype=np.float32) / 255.0       # #06070a
    bone_white = np.array([244.0, 241.0, 234.0], dtype=np.float32) / 255.0 # #f4f1ea

    woodcut_rgb = np.where(woodcut_white_mask[:, :, None], bone_white, ink_black)

    # Determine spotlight centre (lightly biased toward central visual energy, anchored near centre)
    yy, xx = np.mgrid[0:h_px, 0:w_px].astype(np.float32)
    ny = (yy - 0.5 * h_px) / max(min_dim, 1.0)
    nx = (xx - 0.5 * w_px) / max(min_dim, 1.0)
    centre_prior = np.exp(-(nx * nx + ny * ny) / (2.0 * (0.22 ** 2)))
    energy = (0.55 * grad + 0.45 * analysis.saturation + 0.15) * centre_prior
    total_energy = float(np.sum(energy))
    if total_energy > 1e-5:
        cy = float(np.sum(yy * energy) / total_energy)
        cx = float(np.sum(xx * energy) / total_energy)
        # Clamp within central 14% of frame so it always reads as a deliberate central spotlight
        cy = float(np.clip(cy, 0.43 * h_px, 0.57 * h_px))
        cx = float(np.clip(cx, 0.43 * w_px, 0.57 * w_px))
    else:
        cy, cx = 0.5 * h_px, 0.5 * w_px

    dist = np.hypot(xx - cx, yy - cy) / max(min_dim, 1.0)
    spot_radius = 0.34 * (1.0 + 0.08 * bass + 0.05 * onset)

    # Build the Colour-Snatch layer inside the spotlight
    if not analysis.is_bw_source:
        # Boost chroma aggressively and quantise value slightly for graphic print punch,
        # blending smoothly toward solar amber / cyber cyan on low-saturation pixels to avoid step discontinuities
        boosted_sat = np.clip(analysis.saturation * 1.95 + 0.18, 0.0, 1.0).astype(np.float32)
        use_val = np.clip(0.28 + 0.72 * lum, 0.0, 1.0).astype(np.float32)
        native_rgb = _hsv_to_rgb_arrays(analysis.hue, boosted_sat, use_val)

        synth_hue = np.where(lum > 0.55, 0.09, 0.50).astype(np.float32)  # Solar amber vs Cyber cyan
        synth_sat = np.full_like(lum, 0.68, dtype=np.float32)
        synth_rgb = _hsv_to_rgb_arrays(synth_hue, synth_sat, use_val)

        chroma_blend = np.clip((analysis.saturation - 0.04) / 0.12, 0.0, 1.0)[:, :, None]
        snatch_rgb = synth_rgb * (1.0 - chroma_blend) + native_rgb * chroma_blend
    else:
        # Synthetic Sector Colour-Snatch for B&W sources using Bandarchy palette hues
        _, pal = BANDARCHY_PSYCHEDELIC_PALETTES[palette_index % len(BANDARCHY_PSYCHEDELIC_PALETTES)]
        c_emerald = np.array(pal[0], dtype=np.float32) / 255.0
        c_magenta = np.array(pal[1], dtype=np.float32) / 255.0
        c_cyan = np.array(pal[2], dtype=np.float32) / 255.0
        c_gold = np.array(pal[3], dtype=np.float32) / 255.0

        angle = (np.arctan2(yy - cy, xx - cx) / (2.0 * math.pi) + 0.5) % 1.0
        ang_mix = (0.5 + 0.5 * np.sin(angle * 2.0 * math.pi * 2.0))[:, :, None]

        mid_col = c_cyan * (1.0 - ang_mix) + c_emerald * ang_mix
        hi_col = c_magenta * (1.0 - ang_mix) + c_gold * ang_mix
        lum_t = np.clip((lum - 0.25) / 0.65, 0.0, 1.0)[:, :, None]
        snatch_rgb = mid_col * (1.0 - lum_t) + hi_col * lum_t

    # Inside the spotlight: deep woodcut ink grooves stay crisp dark while mid/bright sectors snatch vivid colour
    deep_ink_inside = (~woodcut_white_mask) & (lum < local_thresh - 0.08)
    vivid_spot = np.where(
        deep_ink_inside[:, :, None],
        ink_black * 0.75 + snatch_rgb * 0.25,
        np.where(
            woodcut_white_mask[:, :, None],
            np.clip(snatch_rgb * 1.08 + 0.06, 0.0, 1.0),
            snatch_rgb * 0.72,
        ),
    )

    # Crisp radial transition with a brutalist double-stencil ring at the spotlight perimeter
    inner_edge = spot_radius - 0.008
    outer_edge = spot_radius + 0.008
    spot_alpha = np.clip((outer_edge - dist) / max(outer_edge - inner_edge, 1e-4), 0.0, 1.0)[:, :, None]

    out = woodcut_rgb * (1.0 - spot_alpha) + vivid_spot * spot_alpha

    # Architectural stencil rings framing the spotlight
    ring_1 = (np.abs(dist - spot_radius) < 0.0038)
    ring_2 = (np.abs(dist - (spot_radius + 0.012)) < 0.0022)
    accent_ring_col = np.array(OMARCHY_CYBER_TRITONE["magenta"], dtype=np.float32) / 255.0
    out = np.where(ring_1[:, :, None], accent_ring_col, out)
    out = np.where(ring_2[:, :, None], bone_white, out)

    out_u8 = np.clip(np.round(out * 255.0), 0.0, 255.0).astype(np.uint8)
    return Image.fromarray(out_u8, mode="RGB")


# ===========================================================================
# Effect 07: 07_Sabattier_Solarised_Snatch
# ===========================================================================
def effect_07_sabattier_solarised_snatch(
    img: Image.Image,
    analysis: SourceAnalysis | None = None,
    *,
    bass: float = 0.0,
    mid: float = 0.0,
    high: float = 0.0,
    onset: float = 0.0,
    palette_index: int = 0,
) -> Image.Image:
    """Darkroom tonal curve inversion (Man Ray Sabattier effect) where mid-highlights
    invert into metallic charcoal while contour boundaries blaze with snatched electric colour.

    - Classic darkroom Sabattier tonal curve: deep shadows stay obsidian, lower-mids rise
      to silver-pewter, upper-mid highlights (52%–86%) invert sharply into dark metallic
      charcoal (#1d2330), and extreme specular peaks re-ascend into gleaming silver.
    - Mackie Line & Contour Colour-Snatch: The darkroom phase-cancellation lines (around the
      inversion inflection point) and high-gradient structural edges blaze with snatched
      electric colour (boosted native chroma on Colour images, or electric cyan/magenta/gold
      synthetic neon on B&W sources).
    """
    if analysis is None:
        analysis = analyse_source_image(img)

    lum = analysis.lum_stretched
    grad = analysis.gradient

    # Inflection point for Man Ray darkroom re-exposure (modulated subtly by mid/high if linked)
    inflection = float(np.clip(0.56 - 0.05 * (mid + high), 0.45, 0.65))

    # Construct C0-continuous Sabattier metallic tonal curve:
    #   [0, inflection]: rises smoothly from 0.04 to 0.88 (pewter silver)
    #   [inflection, 0.86]: inverts smoothly down from 0.88 to 0.14 (metallic charcoal at lum=0.86)
    #   [0.86, 1.0]: rebounds continuously from 0.14 up to 0.92 (specular silver highlight)
    t1 = np.clip(lum / max(inflection, 1e-4), 0.0, 1.0)
    rise_1 = 0.04 + 0.84 * (t1 * t1 * (3.0 - 2.0 * t1))

    span_2 = max(0.86 - inflection, 1e-4)
    t2 = np.clip((lum - inflection) / span_2, 0.0, 1.0)
    dip_charcoal = 0.88 - 0.74 * np.sin(t2 * math.pi * 0.5)

    t3 = np.clip((lum - 0.86) / 0.14, 0.0, 1.0)
    specular_rebound = 0.14 + 0.78 * (t3 ** 1.25)

    sab_lum = np.where(lum < inflection, rise_1, np.where(lum < 0.86, dip_charcoal, specular_rebound)).astype(
        np.float32
    )

    # Metallic charcoal & silver base tint (subtle cool gunmetal sheen)
    charcoal_r = np.clip(sab_lum * 0.93, 0.0, 1.0)
    charcoal_g = np.clip(sab_lum * 0.97, 0.0, 1.0)
    charcoal_b = np.clip(sab_lum * 1.05 + 0.02, 0.0, 1.0)
    metallic_base = np.stack([charcoal_r, charcoal_g, charcoal_b], axis=-1)

    # Mackie Line detection: darkroom phase-inversion boundary + structural gradient contours
    mackie_band = np.exp(-((lum - inflection) ** 2) / (2.0 * (0.075 ** 2)))
    second_band = np.exp(-((lum - 0.86) ** 2) / (2.0 * (0.055 ** 2)))
    contour_energy = np.clip(
        0.65 * grad + 0.75 * mackie_band * (0.35 + 0.65 * grad) + 0.55 * second_band,
        0.0,
        1.0,
    )

    if not analysis.is_bw_source:
        # Snatch high-chroma regions + blaze electric colour along Mackie contours
        chroma_mask = np.clip((analysis.saturation - 0.12) / 0.55, 0.0, 1.0)
        snatch_weight = np.clip(
            np.maximum(contour_energy, chroma_mask * (0.45 + 0.55 * mackie_band)),
            0.0,
            1.0,
        )
        # Electric hue: preserve vivid source hues; where saturation is low on a Mackie line,
        # inject electric cyan (#00f5d4) or hot magenta (#ff007f) based on luminance side
        fallback_hue = np.where(lum >= inflection, 0.91, 0.48).astype(np.float32)
        electric_hue = np.where(analysis.saturation > 0.14, analysis.hue, fallback_hue)
        electric_sat = np.clip(np.maximum(analysis.saturation * 2.1, 0.88), 0.0, 1.0).astype(np.float32)
        electric_val = np.clip(0.55 + 0.45 * np.maximum(sab_lum, contour_energy), 0.0, 1.0).astype(np.float32)
        electric_rgb = _hsv_to_rgb_arrays(electric_hue, electric_sat, electric_val)
    else:
        # Synthetic electric colour-snatch for B&W images along Mackie phase-inversion bands & edges
        snatch_weight = np.clip(
            contour_energy * (0.75 + 0.25 * mackie_band) + 0.35 * mackie_band,
            0.0,
            1.0,
        )
        # Map luminance phase across Electric Cyan (0.48), Ultraviolet (0.76), and Urgent Magenta (0.91)
        synth_hue = np.where(
            lum < inflection - 0.04,
            0.48,  # Electric Cyan #00f5d4 on lower Mackie rim
            np.where(
                lum < 0.78,
                0.91,  # Urgent Magenta #f472b6 inside inverted solarised dip
                0.13,  # Solar Gold #fbbf24 on upper specular rim
            ),
        ).astype(np.float32)
        electric_sat = np.full_like(lum, 0.90, dtype=np.float32)
        electric_val = np.clip(0.45 + 0.55 * np.maximum(contour_energy, sab_lum), 0.0, 1.0).astype(np.float32)
        electric_rgb = _hsv_to_rgb_arrays(synth_hue, electric_sat, electric_val)

    mix = (snatch_weight ** 0.85)[:, :, None]
    out = metallic_base * (1.0 - mix) + electric_rgb * mix

    # Preserve deep obsidian crushing in the lowest 10% shadow sector for stark contrast
    shadow_crush = np.clip(lum / 0.10, 0.0, 1.0)[:, :, None]
    obsidian = np.array([7.0, 9.0, 14.0], dtype=np.float32) / 255.0
    out = obsidian * (1.0 - shadow_crush) + out * shadow_crush

    out_u8 = np.clip(np.round(out * 255.0), 0.0, 255.0).astype(np.uint8)
    return Image.fromarray(out_u8, mode="RGB")


# ===========================================================================
# Effect 08: 08_Acid_Poster_4Sector_Snatch
# ===========================================================================
def _extract_dominant_circular_hue(
    hue: np.ndarray,
    sat: np.ndarray,
    mask: np.ndarray,
    min_fraction: float = 0.015,
) -> float | None:
    """Compute saturation-weighted circular mean hue on mask if enough coherent chroma exists."""
    total_px = max(int(mask.size), 1)
    active_count = int(np.count_nonzero(mask))
    if active_count < max(4, int(total_px * min_fraction)):
        return None
    angles = hue[mask] * (2.0 * math.pi)
    weights = sat[mask]
    w_sum = float(np.sum(weights))
    if w_sum <= 1e-5:
        return None
    mean_sin = float(np.sum(np.sin(angles) * weights)) / w_sum
    mean_cos = float(np.sum(np.cos(angles) * weights)) / w_sum
    # Guard against antipodal hue cancellation or incoherent chroma noise
    if math.hypot(mean_sin, mean_cos) < 0.05:
        return None
    return (math.atan2(mean_sin, mean_cos) / (2.0 * math.pi)) % 1.0


def effect_08_acid_poster_4sector_snatch(
    img: Image.Image,
    analysis: SourceAnalysis | None = None,
    *,
    bass: float = 0.0,
    mid: float = 0.0,
    high: float = 0.0,
    onset: float = 0.0,
    palette_index: int = 0,
) -> Image.Image:
    """4-sector hard posterisation where two sectors remain stark black and stark white,
    and the two inner tonal sectors snatch complementary psychedelic palette colours.

    - Sector 0 (0–25% luminance): Stark Ink Black (#05070b).
    - Sector 1 (25–52% luminance): Inner Tonal Sector A — hard-posterised psychedelic
      primary colour snatched from the image's dominant chroma cluster (or palette
      Biolume Cyan #00f5d4 / Toxic Lime #ccff00 on B&W sources).
    - Sector 2 (52–78% luminance): Inner Tonal Sector B — hard-posterised complementary
      psychedelic colour (180-degree hue complement / Acid Magenta #ff007f / Solar Acid
      Yellow #fee440).
    - Sector 3 (78–100% luminance): Stark Chalk White (#f8fafc).
    """
    if analysis is None:
        analysis = analyse_source_image(img)

    # Light Gaussian smoothing on luminance before hard 4-sector posterisation so sectors
    # form cohesive silkscreen poster shapes rather than pixel-level noise
    smooth_lum = _gaussian_blur_float(analysis.lum_stretched, radius=1.15)
    grad = analysis.gradient

    # Audio-reactive threshold modulation (0 when static)
    shift = float(np.clip(0.05 * (bass - high) - 0.025 * onset, -0.08, 0.08))
    q1 = _adaptive_threshold(smooth_lum, 0.25, 0.25, blend=0.50) + shift
    q2 = _adaptive_threshold(smooth_lum, 0.52, 0.52, blend=0.50) + shift * 0.5
    q3 = _adaptive_threshold(smooth_lum, 0.78, 0.78, blend=0.50) - shift * 0.5
    q1 = float(np.clip(q1, 0.08, 0.45))
    q2 = max(q1 + 0.10, min(0.70, q2))
    q3 = max(q2 + 0.10, min(0.92, q3))

    stark_black = np.array([5, 7, 11], dtype=np.uint8)     # #05070b
    stark_white = np.array([248, 250, 252], dtype=np.uint8) # #f8fafc

    _, pal = BANDARCHY_PSYCHEDELIC_PALETTES[palette_index % len(BANDARCHY_PSYCHEDELIC_PALETTES)]
    pal_col_a = np.array(pal[1], dtype=np.float32) / 255.0  # e.g. Biolume Cyan #00f5d4
    pal_col_b = np.array(pal[0], dtype=np.float32) / 255.0  # e.g. Acid Magenta #ff007f

    sec0 = smooth_lum < q1
    sec1 = (smooth_lum >= q1) & (smooth_lum < q2)
    sec2 = (smooth_lum >= q2) & (smooth_lum < q3)
    sec3 = smooth_lum >= q3

    hue_shift = float(0.06 * mid + 0.04 * onset)

    if not analysis.is_bw_source:
        # Snatch the dominant hue from the inner sectors (requiring >= 1.5% coherent chromatic pixels
        # so isolated JPEG chroma-noise pixels on neutral subjects never hijack the poster palette)
        inner_mask = (sec1 | sec2) & (analysis.saturation > 0.15)
        dom_hue = _extract_dominant_circular_hue(
            analysis.hue,
            analysis.saturation,
            inner_mask,
            min_fraction=0.015,
        )
        if dom_hue is None:
            # Try full-image chromatic pixels before falling back to the psychedelic palette preset
            dom_hue = _extract_dominant_circular_hue(
                analysis.hue,
                analysis.saturation,
                analysis.saturation > 0.18,
                min_fraction=0.015,
            )

        if dom_hue is not None:
            dom_hue = (dom_hue + hue_shift) % 1.0
            comp_hue = (dom_hue + 0.50) % 1.0  # Exact 180-degree psychedelic hue complement
            dom_rgb = _hsv_to_rgb_arrays(
                np.array([[dom_hue]], dtype=np.float32),
                np.array([[0.95]], dtype=np.float32),
                np.array([[0.94]], dtype=np.float32),
            )[0, 0]
            comp_rgb = _hsv_to_rgb_arrays(
                np.array([[comp_hue]], dtype=np.float32),
                np.array([[0.96]], dtype=np.float32),
                np.array([[0.98]], dtype=np.float32),
            )[0, 0]
            sec1_u8 = np.clip(np.round(dom_rgb * 255.0), 0, 255).astype(np.uint8)
            sec2_u8 = np.clip(np.round(comp_rgb * 255.0), 0, 255).astype(np.uint8)
        else:
            sec1_u8 = np.clip(np.round(pal_col_a * 255.0), 0, 255).astype(np.uint8)
            sec2_u8 = np.clip(np.round(pal_col_b * 255.0), 0, 255).astype(np.uint8)
    else:
        sec1_u8 = np.clip(np.round(pal_col_a * 255.0), 0, 255).astype(np.uint8)
        sec2_u8 = np.clip(np.round(pal_col_b * 255.0), 0, 255).astype(np.uint8)

    h_px, w_px = smooth_lum.shape
    out_u8 = np.zeros((h_px, w_px, 3), dtype=np.uint8)
    out_u8[sec0] = stark_black
    out_u8[sec1] = sec1_u8
    out_u8[sec2] = sec2_u8
    out_u8[sec3] = stark_white

    # Silkscreen registration ink keylines on strong structural boundaries between sectors
    ink_line = (grad > 0.58) & (~sec3)
    out_u8[ink_line] = stark_black

    return Image.fromarray(out_u8, mode="RGB")


# ===========================================================================
# Registry & Public Bandarchy Integration API
# ===========================================================================
EFFECT_REGISTRY: dict[str, Callable[..., Image.Image]] = {
    "05_Omarchy_Cyber_Tritone_Stark": effect_05_omarchy_cyber_tritone_stark,
    "06_Brutalist_Woodcut_Spot_Snatch": effect_06_brutalist_woodcut_spot_snatch,
    "07_Sabattier_Solarised_Snatch": effect_07_sabattier_solarised_snatch,
    "08_Acid_Poster_4Sector_Snatch": effect_08_acid_poster_4sector_snatch,
}

FAMILY2_EFFECT_NAMES: tuple[str, ...] = tuple(EFFECT_REGISTRY.keys())


def apply_effect_to_image(
    img: Image.Image,
    effect_name: str,
    *,
    analysis: SourceAnalysis | None = None,
    bass: float = 0.0,
    mid: float = 0.0,
    high: float = 0.0,
    onset: float = 0.0,
    palette_index: int = 0,
) -> Image.Image:
    """Apply a named Family 2 stark effect to an in-memory PIL.Image.Image."""
    if effect_name not in EFFECT_REGISTRY:
        raise StarkEffectError(
            f"Unknown Family 2 effect '{effect_name}'. Valid effects: { list(EFFECT_REGISTRY.keys()) }"
        )
    if analysis is None:
        analysis = analyse_source_image(img)
    fn = EFFECT_REGISTRY[effect_name]
    return fn(
        img,
        analysis,
        bass=bass,
        mid=mid,
        high=high,
        onset=onset,
        palette_index=palette_index,
    )


def _compute_cache_digest(
    source_path: str,
    effect_name: str,
    max_dim: int,
    bass: float,
    mid: float,
    high: float,
    onset: float,
    palette_index: int,
) -> str:
    """Compute a deterministic 12-character SHA-256 hex digest over source file bytes and parameters."""
    hasher = hashlib.sha256()
    with open(source_path, "rb") as fh:
        while True:
            chunk = fh.read(65536)
            if not chunk:
                break
            hasher.update(chunk)
    meta = f"|{effect_name}|{max_dim}|{palette_index}|{bass:.3f}|{mid:.3f}|{high:.3f}|{onset:.3f}"
    hasher.update(meta.encode("utf-8"))
    return hasher.hexdigest()[:12]


def process_source_file(
    source_path: str,
    effect_name: str,
    output_dir: str | None = None,
    *,
    output_filename: str | None = None,
    max_dim: int = DEFAULT_STAGE_MAX_DIM,
    bass: float = 0.0,
    mid: float = 0.0,
    high: float = 0.0,
    onset: float = 0.0,
    palette_index: int = 0,
) -> dict[str, object]:
    """Validate a source image, apply a Family 2 effect non-destructively, and save atomically.

    If output_dir is None, writes to ~/.cache/bandarchy/stark-art/ using a deterministic
    content hash suitable for live Bandarchy QML visualiser caching.
    """
    t0 = time.monotonic()
    img = validate_and_load_image(source_path, max_dim=max_dim)
    analysis = analyse_source_image(img)
    out_img = apply_effect_to_image(
        img,
        effect_name,
        analysis=analysis,
        bass=bass,
        mid=mid,
        high=high,
        onset=onset,
        palette_index=palette_index,
    )

    stem = os.path.splitext(os.path.basename(source_path))[0]
    use_cache_dir = output_dir is None
    if use_cache_dir:
        output_dir = resolve_cache_stark_dir()
    if output_filename is None:
        if use_cache_dir:
            digest = _compute_cache_digest(
                os.path.abspath(source_path),
                effect_name,
                max_dim,
                bass,
                mid,
                high,
                onset,
                palette_index,
            )
            output_filename = f"{effect_name}__{stem}__{digest}.png"
        else:
            output_filename = f"{effect_name}__{stem}.png"

    target_path = os.path.join(output_dir, output_filename)
    saved_path = atomic_save_png(out_img, target_path)
    elapsed_ms = round((time.monotonic() - t0) * 1000.0, 2)

    return {
        "ok": True,
        "effect": effect_name,
        "source_path": os.path.abspath(source_path),
        "source_stem": stem,
        "output_path": saved_path,
        "width": out_img.width,
        "height": out_img.height,
        "is_bw_source": bool(analysis.is_bw_source),
        "mean_saturation": round(analysis.mean_saturation, 4),
        "elapsed_ms": elapsed_ms,
    }


def list_source_images(sources_dir: str) -> list[str]:
    """Return sorted absolute paths of all valid non-symlinked source images in sources_dir."""
    if not os.path.isdir(sources_dir):
        return []
    found: list[str] = []
    for entry in sorted(os.listdir(sources_dir)):
        if entry.startswith("."):
            continue
        ext = os.path.splitext(entry)[1].lower()
        if ext not in IMAGE_EXTENSIONS:
            continue
        full = os.path.join(sources_dir, entry)
        try:
            lst = os.lstat(full)
        except OSError:
            continue
        if stat.S_ISLNK(lst.st_mode) or not stat.S_ISREG(lst.st_mode):
            continue
        if 0 < lst.st_size <= MAX_ART_BYTES:
            found.append(os.path.abspath(full))
    return found


def _load_label_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    """Load a crisp monospace or sans-serif system font for contact sheet headers."""
    candidates = (
        "/usr/share/fonts/TTF/JetBrainsMonoNerdFont-Bold.ttf",
        "/usr/share/fonts/TTF/JetBrainsMono-Bold.ttf",
        "/usr/share/fonts/TTF/DejaVuSansMono-Bold.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/noto/NotoSans-Bold.ttf",
    )
    for path in candidates:
        if os.path.isfile(path):
            try:
                return ImageFont.truetype(path, size=size)
            except Exception:
                continue
    return ImageFont.load_default()


def build_family2_contact_sheet(
    sources_dir: str,
    effects_dir: str,
    *,
    sheet_filename: str = "ContactSheet_Family2_DuotoneSabattier.png",
    thumb_w: int = 320,
    thumb_h: int = 220,
) -> str:
    """Build a high-resolution comparison contact sheet showing Original + Effects 05–08 for every source image."""
    sources = list_source_images(sources_dir)
    if not sources:
        raise StarkEffectError(f"No valid source images found in '{sources_dir}'.")

    cols = 1 + len(FAMILY2_EFFECT_NAMES)  # Original + 4 effects = 5 columns
    rows = len(sources)

    pad = 16
    header_h = 84
    label_h = 34
    cell_w = thumb_w
    cell_h = thumb_h + label_h

    sheet_w = pad + cols * (cell_w + pad)
    sheet_h = header_h + pad + rows * (cell_h + pad)

    sheet = Image.new("RGB", (sheet_w, sheet_h), (7, 9, 14))
    draw = ImageDraw.Draw(sheet)
    title_font = _load_label_font(22)
    col_font = _load_label_font(14)
    caption_font = _load_label_font(12)

    # Header banner
    draw.rectangle([0, 0, sheet_w, header_h], fill=(13, 17, 26))
    draw.line([0, header_h - 2, sheet_w, header_h - 2], fill=(110, 231, 183), width=2)
    draw.text(
        (pad, 16),
        "BANDARCHY — FAMILY 2: DUOTONE, BRUTALIST STENCIL & SABATTIER (EFFECTS 05–08)",
        fill=(110, 231, 183),
        font=title_font,
    )
    draw.text(
        (pad, 48),
        "Columns: [00 Original Source]  [05 Omarchy Cyber Tritone Stark]  [06 Brutalist Woodcut Spot Snatch]  [07 Sabattier Solarised Snatch]  [08 Acid Poster 4Sector Snatch]",
        fill=(244, 114, 182),
        font=col_font,
    )

    col_titles = ("00_Original_Source", *FAMILY2_EFFECT_NAMES)

    for r_idx, src_path in enumerate(sources):
        stem = os.path.splitext(os.path.basename(src_path))[0]
        src_img = validate_and_load_image(src_path, max_dim=thumb_w * 2)
        src_analysis = analyse_source_image(src_img)
        bw_tag = "B&W Source -> Synthetic Snatch" if src_analysis.is_bw_source else "Colour Source -> Native Snatch"

        for c_idx, col_name in enumerate(col_titles):
            x0 = pad + c_idx * (cell_w + pad)
            y0 = header_h + pad + r_idx * (cell_h + pad)

            # Frame background
            draw.rectangle([x0 - 1, y0 - 1, x0 + cell_w + 1, y0 + cell_h + 1], outline=(38, 46, 64), width=1)
            draw.rectangle([x0, y0, x0 + cell_w, y0 + label_h], fill=(16, 21, 32))

            if c_idx == 0:
                tile_img = src_img
                header_text = f"{stem[:28]} ({'B&W' if src_analysis.is_bw_source else 'Colour'})"
                header_col = (226, 232, 240)
            else:
                eff_path = os.path.join(effects_dir, f"{col_name}__{stem}.png")
                if os.path.isfile(eff_path):
                    tile_img = validate_and_load_image(eff_path, max_dim=thumb_w * 2)
                else:
                    tile_img = apply_effect_to_image(src_img, col_name, analysis=src_analysis)
                header_text = col_name
                header_col = (110, 231, 183) if c_idx % 2 == 1 else (244, 114, 182)

            draw.text((x0 + 8, y0 + 9), header_text[:34], fill=header_col, font=caption_font)

            # Fit thumbnail preserving aspect ratio with centre crop to fill thumb_w x thumb_h cleanly
            fitted = ImageOps.fit(tile_img, (thumb_w, thumb_h), method=Image.Resampling.LANCZOS)
            sheet.paste(fitted, (x0, y0 + label_h))

    sheet_path = os.path.join(effects_dir, sheet_filename)
    return atomic_save_png(sheet, sheet_path)


def run_batch(
    sources_dir: str,
    effects_dir: str,
    *,
    max_dim: int = DEFAULT_STAGE_MAX_DIM,
) -> dict[str, object]:
    """Run all 4 Family 2 effects across all images in sources_dir and generate the Family 2 contact sheet."""
    os.makedirs(effects_dir, mode=0o755, exist_ok=True)
    sources = list_source_images(sources_dir)
    if not sources:
        raise StarkEffectError(f"No valid source images found in '{sources_dir}'.")

    results: list[dict[str, object]] = []
    t_start = time.monotonic()

    for src_idx, src_path in enumerate(sources):
        img = validate_and_load_image(src_path, max_dim=max_dim)
        analysis = analyse_source_image(img)
        stem = os.path.splitext(os.path.basename(src_path))[0]

        for eff_idx, effect_name in enumerate(FAMILY2_EFFECT_NAMES):
            t_eff = time.monotonic()
            out_img = apply_effect_to_image(
                img,
                effect_name,
                analysis=analysis,
                palette_index=(src_idx + eff_idx) % len(BANDARCHY_PSYCHEDELIC_PALETTES),
            )
            out_name = f"{effect_name}__{stem}.png"
            out_path = atomic_save_png(out_img, os.path.join(effects_dir, out_name))
            results.append(
                {
                    "effect": effect_name,
                    "source_stem": stem,
                    "source_path": src_path,
                    "output_path": out_path,
                    "width": out_img.width,
                    "height": out_img.height,
                    "is_bw_source": bool(analysis.is_bw_source),
                    "mean_saturation": round(analysis.mean_saturation, 4),
                    "elapsed_ms": round((time.monotonic() - t_eff) * 1000.0, 2),
                }
            )

    contact_sheet_path = build_family2_contact_sheet(
        sources_dir,
        effects_dir,
        sheet_filename="ContactSheet_Family2_DuotoneSabattier.png",
    )

    total_ms = round((time.monotonic() - t_start) * 1000.0, 2)
    return {
        "ok": True,
        "family": "Family 2: Duotone, Brutalist Stencil & Sabattier (Effects 05–08)",
        "effects": list(FAMILY2_EFFECT_NAMES),
        "source_count": len(sources),
        "generated_count": len(results),
        "contact_sheet": contact_sheet_path,
        "total_elapsed_ms": total_ms,
        "outputs": results,
    }


def main(argv: Sequence[str] | None = None) -> int:
    """CLI entry point supporting batch showcase generation and single-image Bandarchy helper mode."""
    base_dir = resolve_pictures_bandarchy_dir()
    parser = argparse.ArgumentParser(
        description="Bandarchy Family 2 Stark & Sector Colour-Snatch Effects (05–08)."
    )
    parser.add_argument(
        "--sources-dir",
        default=os.path.join(base_dir, "sources"),
        help="Directory containing source images (default: ~/Pictures/bandarchy/sources)",
    )
    parser.add_argument(
        "--effects-dir",
        default=os.path.join(base_dir, "effects"),
        help="Directory to write generated stark effect PNGs (default: ~/Pictures/bandarchy/effects)",
    )
    parser.add_argument(
        "--source",
        default="",
        help="Optional single source image path to process instead of batch mode.",
    )
    parser.add_argument(
        "--effect",
        default="",
        choices=("", *FAMILY2_EFFECT_NAMES),
        help="Specific effect name when using --source.",
    )
    parser.add_argument(
        "--cache",
        action="store_true",
        help="Write single-source output to ~/.cache/bandarchy/stark-art/ with content hash.",
    )
    parser.add_argument(
        "--max-dim",
        type=int,
        default=DEFAULT_STAGE_MAX_DIM,
        help="Maximum image dimension in pixels (default: 1400).",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit a single bounded JSON object on stdout (Bandarchy helper protocol).",
    )
    args = parser.parse_args(argv)

    try:
        if args.source:
            eff = args.effect or FAMILY2_EFFECT_NAMES[0]
            res = process_source_file(
                args.source,
                eff,
                output_dir=None if args.cache else args.effects_dir,
                max_dim=args.max_dim,
            )
        else:
            res = run_batch(
                args.sources_dir,
                args.effects_dir,
                max_dim=args.max_dim,
            )
    except StarkEffectError as exc:
        err_payload = {"ok": False, "error": str(exc)}
        if args.json:
            print(json.dumps(err_payload))
        else:
            print(f"Error: {exc}", file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps(res))
    else:
        if "outputs" in res:
            print(
                f"Processed {res['source_count']} sources across {len(FAMILY2_EFFECT_NAMES)} effects "
                f"-> {res['generated_count']} images in {res['total_elapsed_ms']} ms."
            )
            print(f"Contact sheet: {res['contact_sheet']}")
        else:
            print(f"Saved {res['effect']} -> {res['output_path']} ({res['elapsed_ms']} ms)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
