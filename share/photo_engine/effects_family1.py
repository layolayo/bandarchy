#!/usr/bin/env python3
"""Bandarchy Stark Copy & Sector Colour-Snatch Engine — Family 1 (Effects 01–04).

Standalone, Bandarchy-compatible image processing module implementing non-destructive
stark B&W sector quantisation and selective colour-snatching for user photographs in
`$XDG_PICTURES_DIR/bandarchy` (falling back to `~/Pictures/bandarchy`).

Designed for direct integration into `bin/bandarchy`:
- Zero home-directory mutation at install time (paths resolved dynamically at runtime).
- Strictly read-only access to source photographs (verifies regular non-symlinked files
  within `MAX_ART_BYTES = 15 MiB` and writes stark copies atomically).
- Automatic detection of Black & White source images (`mean(Saturation) < 0.04`) with
  Synthetic Sector Colour-Snatching from Bandarchy's 30 visualiser palettes and the
  active Omarchy theme colours.
"""

from __future__ import annotations

import argparse
import glob
import hashlib
import json
import math
import os
import random
import stat
import sys
import tempfile
from typing import Any

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

# Safety ceilings matching bin/bandarchy
MAX_ART_BYTES = 15 * 1024 * 1024  # 15 MiB
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")

# Bandarchy palettes from PsychedelicEngine.js + Omarchy signature colours
BANDARCHY_PALETTES: dict[str, list[str]] = {
    "Omarchy Cyber": ["#6ee7b7", "#38bdf8", "#f472b6", "#fbbf24", "#a855f7", "#00f5d4"],
    "Berlin Strobe": ["#ff1e38", "#00e5ff", "#f43f5e", "#38bdf8", "#fbbf24", "#f8fafc"],
    "Acid Rainbow": ["#ff007f", "#00f5d4", "#fee440", "#9b5de5", "#00bbf9", "#f15bb5"],
    "Cyber Neon": ["#00f5ff", "#ff2a85", "#7b2cbf", "#38b000", "#ffbe0b", "#4cc9f0"],
    "Solar Flare": ["#ff4800", "#ff9e00", "#ff0055", "#ffd000", "#ff6d00", "#ff206e"],
    "Bioluminescence": ["#00f5d4", "#38bdf8", "#a78bfa", "#4ade80", "#f472b6", "#2dd4bf"],
    "Ultraviolet Rave": ["#c084fc", "#f472b6", "#38bdf8", "#818cf8", "#e879f9", "#22d3ee"],
    "Tokyo Synthwave": ["#ff00a0", "#00f0ff", "#7a04eb", "#fe75fe", "#ff124f", "#05d9e8"],
}

FAMILY1_EFFECTS = (
    "01_SinCity_Chroma_Snatch",
    "02_White_Sector_Colour_Snatch",
    "03_Shadow_Void_Neon_Snatch",
    "04_Slash_Window_Sector_Snatch",
)


class StarkSnatchError(ValueError):
    """Expected operational error for unsafe or invalid image inputs."""


def resolve_pictures_bandarchy_dir() -> str:
    """Resolve `$XDG_PICTURES_DIR/bandarchy` or fallback to `~/Pictures/bandarchy`."""
    home = os.path.expanduser("~")
    xdg_pics = (os.environ.get("XDG_PICTURES_DIR") or "").strip()
    if not xdg_pics:
        xdg_pics = os.path.join(home, "Pictures")
    return os.path.join(xdg_pics, "bandarchy")


def resolve_stark_cache_dir() -> str:
    """Resolve `~/.cache/bandarchy/stark-art` for runtime non-destructive caching."""
    home = os.path.expanduser("~")
    cache_root = os.environ.get("BANDARCHY_CACHE_DIR") or os.path.join(
        os.environ.get("XDG_CACHE_HOME") or os.path.join(home, ".cache"),
        "bandarchy",
    )
    return os.path.join(cache_root, "stark-art")


def validate_source_image(path: str) -> str:
    """Verify `path` is a regular, non-symlinked image file within `MAX_ART_BYTES`."""
    if not path or not isinstance(path, str):
        raise StarkSnatchError("empty image path")
    abs_path = os.path.abspath(path)
    try:
        st = os.lstat(abs_path)
    except OSError as exc:
        raise StarkSnatchError(f"cannot stat image path: {exc}") from exc
    if stat.S_ISLNK(st.st_mode):
        raise StarkSnatchError(f"refusing symlinked image file: {abs_path}")
    if not stat.S_ISREG(st.st_mode):
        raise StarkSnatchError(f"not a regular file: {abs_path}")
    if st.st_size <= 64:
        raise StarkSnatchError(f"image file too small ({st.st_size} bytes): {abs_path}")
    if st.st_size > MAX_ART_BYTES:
        raise StarkSnatchError(
            f"image file exceeds MAX_ART_BYTES ({st.st_size} > {MAX_ART_BYTES}): {abs_path}"
        )
    ext = os.path.splitext(abs_path)[1].lower()
    if ext not in IMAGE_EXTENSIONS:
        raise StarkSnatchError(f"unsupported image extension: {ext}")
    return abs_path


def hex_to_rgb_float(hex_colour: str) -> np.ndarray:
    """Convert `#rrggbb` hex string to float32 RGB array in `[0.0, 1.0]`."""
    h = hex_colour.lstrip("#")
    return np.array(
        [int(h[0:2], 16) / 255.0, int(h[2:4], 16) / 255.0, int(h[4:6], 16) / 255.0],
        dtype=np.float32,
    )


def smoothstep(edge0: float | np.ndarray, edge1: float | np.ndarray, x: np.ndarray) -> np.ndarray:
    """Hermite smoothstep interpolation in `[0.0, 1.0]`."""
    denom = np.maximum(edge1 - edge0, 1e-6)
    t = np.clip((x - edge0) / denom, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


MAX_IMAGE_PIXELS = 64_000_000  # 64 MP decompression bomb ceiling
Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS


def _convert_to_rgb_preserving_range(raw_im: Image.Image) -> Image.Image:
    """Convert any PIL image mode (including 16-bit greyscale `I;16`/`I`/`F` and
    transparent `RGBA`/`LA`/`P`) to 8-bit `RGB` without dynamic-range clipping or
    alpha-channel blowout.
    """
    mode = raw_im.mode
    if mode == "RGB":
        return raw_im.copy()
    if mode in ("I;16", "I;16L", "I;16B", "I", "F"):
        arr = np.asarray(raw_im, dtype=np.float32)
        lo, hi = float(np.min(arr)), float(np.max(arr))
        if hi > 255.0 or lo < 0.0:
            if hi > lo:
                arr = (arr - lo) * (255.0 / (hi - lo))
            else:
                arr = np.clip(arr / 257.0, 0.0, 255.0)
        u8 = np.clip(arr, 0.0, 255.0).astype(np.uint8)
        rgb_arr = np.stack([u8, u8, u8], axis=-1)
        return Image.fromarray(rgb_arr, mode="RGB")
    if mode in ("RGBA", "LA") or (mode == "P" and "transparency" in raw_im.info):
        rgba = raw_im.convert("RGBA")
        bg = Image.new("RGBA", rgba.size, (8, 8, 8, 255))
        bg.alpha_composite(rgba)
        return bg.convert("RGB")
    return raw_im.convert("RGB")


def load_image_non_destructive(path: str, max_dim: int = 1024) -> Image.Image:
    """Read, validate, and auto-orient a copy of the source image without mutating it."""
    abs_path = validate_source_image(path)
    try:
        with Image.open(abs_path) as raw_im:
            w, h = raw_im.size
            if w <= 0 or h <= 0 or (w * h) > MAX_IMAGE_PIXELS:
                raise StarkSnatchError(
                    f"image dimensions ({w}x{h}) exceed safety ceiling ({MAX_IMAGE_PIXELS} px)"
                )
            transposed = ImageOps.exif_transpose(raw_im)
            im = _convert_to_rgb_preserving_range(transposed)
    except StarkSnatchError:
        raise
    except Exception as exc:
        raise StarkSnatchError(f"failed to decode image {abs_path}: {exc}") from exc
    if max_dim > 0 and max(im.size) > max_dim:
        im.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    return im


def compute_luminance_and_sectors(im: Image.Image) -> dict[str, Any]:
    """Decompose an RGB PIL image into Rec.709 luminance, stark micro-contrast luminance,
    Sobel structural edge magnitude, HSV channels, and Colour vs B&W classification.
    """
    rgb = np.asarray(im, dtype=np.float32) / 255.0
    # Crisp unsharp mask copy for micro-contrast and vibrant colour extraction
    sharp_im = im.filter(ImageFilter.UnsharpMask(radius=2.2, percent=175, threshold=2))
    rgb_sharp = np.asarray(sharp_im, dtype=np.float32) / 255.0

    # Rec.709 perceptual luminance
    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    lum_sharp = (
        0.2126 * rgb_sharp[:, :, 0] + 0.7152 * rgb_sharp[:, :, 1] + 0.0722 * rgb_sharp[:, :, 2]
    )

    # Normalise luminance between 2nd and 98th percentile for adaptive dynamic range
    p2, p98 = np.percentile(lum_sharp, [2.0, 98.0])
    lum_norm = np.clip((lum_sharp - p2) / max(float(p98 - p2), 1e-4), 0.0, 1.0)

    # Local detail enhancement (high-pass graphic structure)
    blur_im = im.convert("L").filter(ImageFilter.GaussianBlur(radius=12.0))
    lum_local_mean = np.asarray(blur_im, dtype=np.float32) / 255.0
    local_detail = np.clip(lum_norm + 0.45 * (lum_norm - lum_local_mean), 0.0, 1.0)

    # Brutalist S-curve stark luminance
    stark_bw = smoothstep(0.14, 0.86, local_detail)

    # Sobel structural edge magnitude
    gx = np.zeros_like(lum_norm)
    gy = np.zeros_like(lum_norm)
    gx[:, 1:-1] = (
        (lum_norm[:, 2:] - lum_norm[:, :-2]) * 0.5
    )
    gy[1:-1, :] = (
        (lum_norm[2:, :] - lum_norm[:-2, :]) * 0.5
    )
    edges = np.hypot(gx, gy)
    e_p98 = float(np.percentile(edges, 98.5))
    edges_norm = np.clip(edges / max(e_p98, 1e-4), 0.0, 1.0)

    # HSV decomposition
    hsv = np.asarray(im.convert("HSV"), dtype=np.float32) / 255.0
    hue = hsv[:, :, 0]
    sat = hsv[:, :, 1]
    val = hsv[:, :, 2]

    mean_sat = float(np.mean(sat))
    is_bw = bool(mean_sat < 0.04)

    return {
        "rgb": rgb,
        "rgb_sharp": rgb_sharp,
        "lum": lum,
        "lum_norm": lum_norm,
        "local_detail": local_detail,
        "stark_bw": stark_bw,
        "edges": edges_norm,
        "hue": hue,
        "sat": sat,
        "val": val,
        "mean_sat": mean_sat,
        "is_bw": is_bw,
    }


def boost_chroma(rgb: np.ndarray, factor: float = 1.9, contrast: float = 1.15) -> np.ndarray:
    """Hyper-saturate and contrast-boost an RGB float array in `[0.0, 1.0]`."""
    lum = (0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2])[:, :, None]
    boosted = lum + (rgb - lum) * factor
    boosted = (boosted - 0.5) * contrast + 0.5
    return np.clip(boosted, 0.0, 1.0)


def apply_01_sincity_chroma_snatch(
    im: Image.Image,
    analysis: dict[str, Any] | None = None,
    palette_name: str = "Berlin Strobe",
) -> Image.Image:
    """Effect 01: `01_SinCity_Chroma_Snatch`
    Crushes the photograph into a stark obsidian-and-chalk B&W photocopy while snatching
    and boosting the dominant vibrant colour sector (or injecting crimson/emerald into
    the focal structural sector on B&W sources).
    """
    data = analysis or compute_luminance_and_sectors(im)
    rgb_sharp = data["rgb_sharp"]
    lum_norm = data["lum_norm"]
    stark_bw = data["stark_bw"]
    edges = data["edges"]
    hue = data["hue"]
    sat = data["sat"]
    is_bw = data["is_bw"]
    h, w = lum_norm.shape

    # Stark obsidian (#080808) to chalk-white (#f8f8f8) graphic B&W base
    obsidian = hex_to_rgb_float("#080808")
    chalk = hex_to_rgb_float("#f8f8f8")
    crushed_lum = smoothstep(0.22, 0.78, stark_bw)
    # Crisp ink-black edge reinforcement in mid-tones
    crushed_lum = np.clip(crushed_lum - 0.25 * edges * (1.0 - crushed_lum), 0.0, 1.0)
    bw_base = obsidian[None, None, :] * (1.0 - crushed_lum[:, :, None]) + chalk[None, None, :] * (
        crushed_lum[:, :, None]
    )

    if not is_bw:
        # Locate dominant vibrant hue cluster via saturation-weighted circular histogram
        bins = 36
        weights = (sat ** 1.6) * smoothstep(0.12, 0.35, lum_norm) * (1.0 - smoothstep(0.92, 0.99, lum_norm))
        hist, _ = np.histogram(hue, bins=bins, range=(0.0, 1.0), weights=weights)
        peak_bin = int(np.argmax(hist))
        peak_hue = (peak_bin + 0.5) / bins

        # Circular hue distance in [0, 0.5]
        hue_dist = np.abs(hue - peak_hue)
        hue_dist = np.minimum(hue_dist, 1.0 - hue_dist)

        # Snatch pixels close to dominant vibrant hue OR ultra-high saturation accents
        hue_affinity = 1.0 - smoothstep(0.06, 0.17, hue_dist)
        sat_gate = smoothstep(float(np.percentile(sat, 58.0)), float(np.percentile(sat, 82.0)), sat)
        ultra_sat = smoothstep(float(np.percentile(sat, 85.0)), float(np.percentile(sat, 96.0)), sat)
        snatch_mask = np.clip(np.maximum(hue_affinity * sat_gate, ultra_sat * 0.9), 0.0, 1.0)

        # Boost snatched colour to 2.05x chroma with warm Sin City punch
        snatched_rgb = boost_chroma(rgb_sharp, factor=2.05, contrast=1.18)
    else:
        # Synthetic Focal Sector Colour-Snatching for B&W sources
        pal = BANDARCHY_PALETTES.get(palette_name, BANDARCHY_PALETTES["Berlin Strobe"])
        c_primary = hex_to_rgb_float(pal[0])   # Sin City Crimson (#ff1e38)
        c_secondary = hex_to_rgb_float("#6ee7b7")  # Omarchy Emerald accent
        c_gold = hex_to_rgb_float("#fbbf24")

        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        ny = (yy / max(h - 1, 1)) - 0.5
        nx = (xx / max(w - 1, 1)) - 0.5
        radial = np.exp(-((nx * 1.35) ** 2 + (ny * 1.35) ** 2) * 1.8)

        # Focal high-energy structural sector (bright mid-tones + crisp edges in focal zone)
        tonal_band = smoothstep(0.42, 0.58, lum_norm) * (1.0 - smoothstep(0.84, 0.95, lum_norm))
        structural_energy = np.clip(tonal_band * 0.75 + edges * 0.65, 0.0, 1.0) * (0.45 + 0.55 * radial)
        p68, p88 = np.percentile(structural_energy, [68.0, 88.0])
        snatch_mask = smoothstep(p68, p88, structural_energy)

        # Map luminance & edges within snatched sector to crimson + emerald/gold highlights
        blend_t = smoothstep(0.45, 0.85, lum_norm)
        synth_col = (
            c_primary[None, None, :] * (1.0 - blend_t[:, :, None])
            + c_gold[None, None, :] * (blend_t[:, :, None] * 0.65)
            + c_secondary[None, None, :] * (edges[:, :, None] * 0.35)
        )
        snatched_rgb = np.clip(synth_col * (0.35 + 0.85 * lum_norm[:, :, None]), 0.0, 1.0)

    out = bw_base * (1.0 - snatch_mask[:, :, None]) + snatched_rgb * snatch_mask[:, :, None]
    return Image.fromarray(np.clip(out * 255.0, 0, 255).astype(np.uint8), mode="RGB")


def apply_02_white_sector_colour_snatch(
    im: Image.Image,
    analysis: dict[str, Any] | None = None,
    palette_name: str = "Omarchy Cyber",
) -> Image.Image:
    """Effect 02: `02_White_Sector_Colour_Snatch`
    Deep shadows and lower mid-tones (`0–55%`) are locked to stark ink-black and crisp
    white halftone/structural edges, while the bright highlight sector (`55–100%`)
    snatches hyper-vivid colour.
    """
    data = analysis or compute_luminance_and_sectors(im)
    rgb_sharp = data["rgb_sharp"]
    lum_norm = data["lum_norm"]
    local_detail = data["local_detail"]
    edges = data["edges"]
    sat = data["sat"]
    is_bw = data["is_bw"]
    h, w = lum_norm.shape

    # Shadow/mid sector (0-55%): stark neutral ink-black with subtle geometric halftone/edge grit
    ink_black = hex_to_rgb_float("#080808")
    bone_white = hex_to_rgb_float("#f4f4f4")

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    # Fine 6px graphic screen dot pattern in the upper-shadow transition zone
    dot_wave = 0.5 + 0.5 * np.cos(xx * (2.0 * math.pi / 6.0)) * np.cos(yy * (2.0 * math.pi / 6.0))
    shadow_halftone = (local_detail > (0.32 + 0.28 * dot_wave)).astype(np.float32) * 0.28
    shadow_edge_gleam = smoothstep(0.30, 0.75, edges) * 0.55
    shadow_val = np.clip(np.maximum(shadow_halftone * smoothstep(0.20, 0.52, lum_norm), shadow_edge_gleam), 0.0, 1.0)
    dark_sector_rgb = (
        ink_black[None, None, :] * (1.0 - shadow_val[:, :, None])
        + bone_white[None, None, :] * shadow_val[:, :, None]
    )

    # White sector mask (55% - 100% luminance)
    thresh_lo = max(0.48, float(np.percentile(lum_norm, 52.0)) - 0.04)
    thresh_hi = min(0.64, thresh_lo + 0.10)
    white_sector_mask = smoothstep(thresh_lo, thresh_hi, local_detail)

    pal = BANDARCHY_PALETTES.get(palette_name, BANDARCHY_PALETTES["Omarchy Cyber"])
    c1 = hex_to_rgb_float(pal[0])  # Emerald #6ee7b7
    c2 = hex_to_rgb_float(pal[1])  # Cyan #38bdf8
    c3 = hex_to_rgb_float(pal[2])  # Magenta #f472b6
    c4 = hex_to_rgb_float(pal[3])  # Solar Gold #fbbf24

    # Spatial + tonal palette map for B&W sources (or desaturated glare highlights)
    angle_field = 0.5 + 0.5 * np.sin((xx / max(w, 1)) * 3.2 + (yy / max(h, 1)) * 2.4)
    t_hi = smoothstep(thresh_lo, 0.98, lum_norm)
    synth_highlight = (
        c1[None, None, :] * ((1.0 - t_hi[:, :, None]) * angle_field[:, :, None])
        + c2[None, None, :] * ((1.0 - t_hi[:, :, None]) * (1.0 - angle_field[:, :, None]))
        + c3[None, None, :] * (t_hi[:, :, None] * (1.0 - angle_field[:, :, None]))
        + c4[None, None, :] * (t_hi[:, :, None] * angle_field[:, :, None])
    )
    synth_highlight = np.clip(synth_highlight * (0.65 + 0.45 * lum_norm[:, :, None]), 0.0, 1.0)

    if not is_bw:
        # Snatch true colour in white sector with 2.2x chroma boost; where highlights are
        # naturally blown out (low saturation), infuse palette/dominant chroma so the white
        # sector always blazes with vivid colour.
        true_boosted = boost_chroma(rgb_sharp, factor=2.25, contrast=1.12)
        local_sat_weight = smoothstep(0.06, 0.28, sat)[:, :, None]
        white_sector_rgb = true_boosted * local_sat_weight + synth_highlight * (1.0 - local_sat_weight) * 0.85
    else:
        white_sector_rgb = synth_highlight

    out = (
        dark_sector_rgb * (1.0 - white_sector_mask[:, :, None])
        + white_sector_rgb * white_sector_mask[:, :, None]
    )
    return Image.fromarray(np.clip(out * 255.0, 0, 255).astype(np.uint8), mode="RGB")


def apply_03_shadow_void_neon_snatch(
    im: Image.Image,
    analysis: dict[str, Any] | None = None,
    palette_name: str = "Ultraviolet Rave",
) -> Image.Image:
    """Effect 03: `03_Shadow_Void_Neon_Snatch`
    Highlights and mid-tones (`42–100%`) remain stark high-contrast B&W photography,
    while the black shadow sector (`0–42%`) is snatched with deep ultraviolet, emerald,
    and electric magenta neon luminance.
    """
    data = analysis or compute_luminance_and_sectors(im)
    rgb_sharp = data["rgb_sharp"]
    lum_norm = data["lum_norm"]
    stark_bw = data["stark_bw"]
    edges = data["edges"]
    sat = data["sat"]
    is_bw = data["is_bw"]
    h, w = lum_norm.shape

    # Highlights and mid-tones: crisp silver-gelatin / chalk B&W print
    hi_lum = smoothstep(0.32, 0.94, stark_bw)
    hi_lum = np.clip(hi_lum + 0.18 * edges * smoothstep(0.4, 0.8, lum_norm), 0.0, 1.0)
    bw_light_sector = np.repeat(hi_lum[:, :, None], 3, axis=2)

    # Shadow sector mask (0 - 44% luminance percentile)
    cutoff = min(0.48, max(0.36, float(np.percentile(lum_norm, 44.0))))
    shadow_mask = 1.0 - smoothstep(cutoff - 0.06, cutoff + 0.06, lum_norm)

    # Deep Void Neon palette: Ultraviolet (#a855f7), Omarchy Emerald (#00f5d4), Magenta (#f472b6), Void (#070510)
    void_bg = hex_to_rgb_float("#070512")
    uv_violet = hex_to_rgb_float("#a855f7")
    neon_emerald = hex_to_rgb_float("#00f5d4")
    neon_magenta = hex_to_rgb_float("#f472b6")

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    wave_phase = 0.5 + 0.5 * np.sin((xx / max(w, 1)) * 4.5 - (yy / max(h, 1)) * 3.5)

    # Normalised depth within the shadow sector (0 = deepest abyss, 1 = upper shadow boundary)
    shadow_depth = np.clip(lum_norm / max(cutoff, 1e-4), 0.0, 1.0)
    # Inverted shadow contour glow so internal dark textures and edges radiate neon
    shadow_contour = np.clip((1.0 - np.abs(shadow_depth - 0.55) * 1.8) + edges * 0.85, 0.0, 1.0)

    neon_grad = (
        uv_violet[None, None, :] * (1.0 - wave_phase[:, :, None])
        + neon_emerald[None, None, :] * wave_phase[:, :, None]
    )
    neon_grad = (
        neon_grad * (1.0 - smoothstep(0.35, 0.85, edges)[:, :, None])
        + neon_magenta[None, None, :] * smoothstep(0.35, 0.85, edges)[:, :, None]
    )

    if not is_bw:
        # Combine boosted original shadow hues with ultraviolet/emerald neon luminescence
        shadow_chroma = boost_chroma(rgb_sharp, factor=2.4, contrast=1.25)
        has_sat = smoothstep(0.10, 0.35, sat)[:, :, None]
        blended_neon = shadow_chroma * has_sat * 0.65 + neon_grad * (1.0 - has_sat * 0.45)
    else:
        blended_neon = neon_grad

    shadow_neon_rgb = (
        void_bg[None, None, :] * (1.0 - shadow_contour[:, :, None] * 0.88)
        + blended_neon * (shadow_contour[:, :, None] * 0.95 + 0.12)
    )
    shadow_neon_rgb = np.clip(shadow_neon_rgb, 0.0, 1.0)

    out = (
        bw_light_sector * (1.0 - shadow_mask[:, :, None])
        + shadow_neon_rgb * shadow_mask[:, :, None]
    )
    return Image.fromarray(np.clip(out * 255.0, 0, 255).astype(np.uint8), mode="RGB")


def apply_04_slash_window_sector_snatch(
    im: Image.Image,
    analysis: dict[str, Any] | None = None,
    palette_name: str = "Tokyo Synthwave",
) -> Image.Image:
    """Effect 04: `04_Slash_Window_Sector_Snatch`
    Stark brutalist B&W threshold across the frame, sliced by angled geometric
    'snapshot windows' where raw high-contrast colour bursts through the monochrome sectors.
    """
    data = analysis or compute_luminance_and_sectors(im)
    rgb_sharp = data["rgb_sharp"]
    lum_norm = data["lum_norm"]
    local_detail = data["local_detail"]
    edges = data["edges"]
    sat = data["sat"]
    is_bw = data["is_bw"]
    h, w = lum_norm.shape

    # Outside monochrome sectors: brutalist 2-tone woodcut/photocopy with sharp neutral charcoal edge sector
    obsidian = hex_to_rgb_float("#080808")
    charcoal = hex_to_rgb_float("#2c2c2c")
    stark_white = hex_to_rgb_float("#f6f6f6")

    s_white = smoothstep(0.50, 0.56, local_detail)
    s_mid = smoothstep(0.32, 0.38, local_detail) * (1.0 - s_white)
    bw_brutalist = (
        obsidian[None, None, :] * (1.0 - s_white[:, :, None] - s_mid[:, :, None])
        + charcoal[None, None, :] * s_mid[:, :, None]
        + stark_white[None, None, :] * s_white[:, :, None]
    )

    # Geometric Slash Window Geometry (normalised coordinates [-0.5, 0.5])
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx / max(w - 1, 1)) - 0.5
    ny = (yy / max(h - 1, 1)) - 0.5

    # Primary diagonal slash (-32 deg) + secondary offset harmonic slash + focal cross-window
    theta = math.radians(-32.0)
    u = nx * math.cos(theta) - ny * math.sin(theta)
    v = nx * math.sin(theta) + ny * math.cos(theta)

    # Primary wide slash band + two satellite razor slashes
    band_main = (np.abs(u + 0.03) < 0.145) & (np.abs(v) < 0.44)
    band_sat1 = (np.abs(u - 0.23) < 0.042) & (v > -0.36) & (v < 0.38)
    band_sat2 = (np.abs(u + 0.25) < 0.032) & (v > -0.38) & (v < 0.32)
    # Horizontal offset brutalist snapshot bar intersecting the slash
    band_horiz = (np.abs(ny - 0.06) < 0.065) & (nx > -0.38) & (nx < 0.38)

    window_bool = band_main | band_sat1 | band_sat2 | band_horiz
    window_mask = window_bool.astype(np.float32)

    # Crisp 2px neon border frame around the geometric slash windows
    window_im = Image.fromarray((window_mask * 255.0).astype(np.uint8), mode="L")
    dilated = np.asarray(window_im.filter(ImageFilter.MaxFilter(5)), dtype=np.float32) / 255.0
    eroded = np.asarray(window_im.filter(ImageFilter.MinFilter(3)), dtype=np.float32) / 255.0
    border_mask = np.clip(dilated - eroded, 0.0, 1.0)

    pal = BANDARCHY_PALETTES.get(palette_name, BANDARCHY_PALETTES["Tokyo Synthwave"])
    c_shadow = hex_to_rgb_float("#140826")
    c_mid1 = hex_to_rgb_float(pal[0])   # Neon Magenta #ff00a0
    c_mid2 = hex_to_rgb_float(pal[1])   # Cyber Cyan #00f0ff
    c_hi = hex_to_rgb_float("#fee440")  # Solar Yellow highlight
    border_col = hex_to_rgb_float("#6ee7b7")  # Omarchy Emerald hairline frame

    # Synthetic multi-sector vibrant colour inside the slash windows (used for B&W or low-sat areas)
    t1 = smoothstep(0.18, 0.48, lum_norm)[:, :, None]
    t2 = smoothstep(0.48, 0.78, lum_norm)[:, :, None]
    t3 = smoothstep(0.78, 0.96, lum_norm)[:, :, None]
    synth_window_rgb = (
        c_shadow[None, None, :] * (1.0 - t1)
        + c_mid1[None, None, :] * (t1 * (1.0 - t2))
        + c_mid2[None, None, :] * (t2 * (1.0 - t3))
        + c_hi[None, None, :] * t3
    )
    synth_window_rgb = np.clip(synth_window_rgb + 0.22 * edges[:, :, None], 0.0, 1.0)

    if not is_bw:
        # Raw hyper-saturated colour bursting through the slash window
        vivid_rgb = boost_chroma(rgb_sharp, factor=2.15, contrast=1.20)
        sat_blend = smoothstep(0.05, 0.22, sat)[:, :, None]
        window_rgb = vivid_rgb * sat_blend + synth_window_rgb * (1.0 - sat_blend) * 0.9
    else:
        window_rgb = synth_window_rgb

    out = bw_brutalist * (1.0 - window_mask[:, :, None]) + window_rgb * window_mask[:, :, None]
    out = out * (1.0 - border_mask[:, :, None] * 0.85) + border_col[None, None, :] * (
        border_mask[:, :, None] * 0.85
    )
    return Image.fromarray(np.clip(out * 255.0, 0, 255).astype(np.uint8), mode="RGB")


EFFECT_DISPATCH = {
    "01_SinCity_Chroma_Snatch": apply_01_sincity_chroma_snatch,
    "02_White_Sector_Colour_Snatch": apply_02_white_sector_colour_snatch,
    "03_Shadow_Void_Neon_Snatch": apply_03_shadow_void_neon_snatch,
    "04_Slash_Window_Sector_Snatch": apply_04_slash_window_sector_snatch,
}


def atomic_save_png(im: Image.Image, dest_path: str) -> str:
    """Atomically write `im` as a PNG to `dest_path` with safe `0o644` permissions."""
    abs_dest = os.path.abspath(dest_path)
    parent = os.path.dirname(abs_dest)
    os.makedirs(parent, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(dir=parent, prefix=".stark_", suffix=".png")
    os.close(fd)
    try:
        im.save(tmp_path, format="PNG", optimize=False)
        os.chmod(tmp_path, 0o644)
        os.replace(tmp_path, abs_dest)
    except Exception:
        if os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
        raise
    return abs_dest


def parse_source_tag(filename: str) -> str:
    """Derive a clean `<Category>_<ColourOrBW>` suffix from a source filename."""
    stem = os.path.splitext(os.path.basename(filename))[0]
    parts = stem.split("_")
    if len(parts) >= 2 and parts[0].isdigit():
        return "_".join(parts[1:])
    return stem


def process_image_effect(
    source_path: str,
    effect_name: str,
    output_dir: str | None = None,
    max_dim: int = 960,
) -> dict[str, Any]:
    """Apply `effect_name` non-destructively to `source_path` and write the output PNG."""
    if effect_name not in EFFECT_DISPATCH:
        raise StarkSnatchError(f"unknown effect: {effect_name}")
    im = load_image_non_destructive(source_path, max_dim=max_dim)
    analysis = compute_luminance_and_sectors(im)
    out_im = EFFECT_DISPATCH[effect_name](im, analysis=analysis)

    target_dir = output_dir or resolve_stark_cache_dir()
    tag = parse_source_tag(source_path)
    out_name = f"{effect_name}__{tag}.png"
    out_path = atomic_save_png(out_im, os.path.join(target_dir, out_name))

    out_hsv = np.asarray(out_im.convert("HSV"), dtype=np.float32) / 255.0
    return {
        "ok": True,
        "effect": effect_name,
        "source": os.path.abspath(source_path),
        "source_tag": tag,
        "output": out_path,
        "width": out_im.width,
        "height": out_im.height,
        "is_bw_source": analysis["is_bw"],
        "source_mean_sat": round(analysis["mean_sat"], 4),
        "output_mean_sat": round(float(out_hsv[:, :, 1].mean()), 4),
        "output_max_sat": round(float(out_hsv[:, :, 1].max()), 4),
    }


def is_generated_effect_filename(filename: str) -> bool:
    """Return True if `filename` is a generated effect output or contact sheet rather than a raw source."""
    base = os.path.basename(filename)
    if "__" in base or base.startswith("ContactSheet_") or base.startswith(".stark_"):
        return True
    return any(base.startswith(eff) for eff in FAMILY1_EFFECTS)


def build_contact_sheet(
    sources_dir: str,
    effects_dir: str,
    output_filename: str = "ContactSheet_Family1_SectorSnatch.png",
) -> str:
    """Build a high-resolution labelled comparison contact sheet across all 12 sources
    and Effects 01–04.
    """
    source_files = sorted(
        p
        for p in glob.glob(os.path.join(sources_dir, "*"))
        if os.path.splitext(p)[1].lower() in IMAGE_EXTENSIONS
        and not os.path.islink(p)
        and not is_generated_effect_filename(p)
    )
    if not source_files:
        raise StarkSnatchError(f"no source images found in {sources_dir}")

    thumb_w, thumb_h = 280, 210
    pad_x, pad_y = 18, 18
    label_h = 34
    header_h = 84
    cols = 1 + len(FAMILY1_EFFECTS)  # Source column + 4 effect columns
    rows = len(source_files)

    sheet_w = pad_x + cols * (thumb_w + pad_x)
    sheet_h = header_h + pad_y + rows * (thumb_h + label_h + pad_y)

    sheet = Image.new("RGB", (sheet_w, sheet_h), (10, 12, 18))
    draw = ImageDraw.Draw(sheet)

    try:
        font_title = ImageFont.truetype("/usr/share/fonts/TTF/DejaVuSans-Bold.ttf", 22)
        font_col = ImageFont.truetype("/usr/share/fonts/TTF/DejaVuSans-Bold.ttf", 14)
        font_lbl = ImageFont.truetype("/usr/share/fonts/TTF/DejaVuSans.ttf", 12)
    except OSError:
        font_title = ImageFont.load_default()
        font_col = ImageFont.load_default()
        font_lbl = ImageFont.load_default()

    draw.text(
        (pad_x, 16),
        "BANDARCHY - FAMILY 1: STARK SECTOR COLOUR-SNATCH SHOWCASE (EFFECTS 01-04)",
        fill=(110, 231, 183),
        font=font_title,
    )

    col_headers = ["00_Original_Source", *FAMILY1_EFFECTS]
    for c_idx, h_text in enumerate(col_headers):
        cx = pad_x + c_idx * (thumb_w + pad_x)
        draw.text((cx + 4, 52), h_text, fill=(244, 114, 182) if c_idx > 0 else (148, 163, 184), font=font_col)

    for r_idx, src_path in enumerate(source_files):
        tag = parse_source_tag(src_path)
        ry = header_h + pad_y + r_idx * (thumb_h + label_h + pad_y)

        # Column 0: Original source
        src_im = load_image_non_destructive(src_path, max_dim=thumb_w * 2)
        src_thumb = ImageOps.fit(src_im, (thumb_w, thumb_h), Image.Resampling.LANCZOS)
        cx0 = pad_x
        sheet.paste(src_thumb, (cx0, ry))
        draw.rectangle([cx0, ry, cx0 + thumb_w - 1, ry + thumb_h - 1], outline=(71, 85, 105), width=1)
        draw.text((cx0 + 4, ry + thumb_h + 6), f"SRC: {tag[:32]}", fill=(203, 213, 225), font=font_lbl)

        # Columns 1..4: Effects 01..04
        for e_idx, eff_name in enumerate(FAMILY1_EFFECTS):
            cx = pad_x + (e_idx + 1) * (thumb_w + pad_x)
            eff_path = os.path.join(effects_dir, f"{eff_name}__{tag}.png")
            if not os.path.isfile(eff_path):
                process_image_effect(src_path, eff_name, output_dir=effects_dir)
            with Image.open(eff_path) as e_im:
                eff_thumb = ImageOps.fit(e_im.convert("RGB"), (thumb_w, thumb_h), Image.Resampling.LANCZOS)
            sheet.paste(eff_thumb, (cx, ry))
            draw.rectangle([cx, ry, cx + thumb_w - 1, ry + thumb_h - 1], outline=(110, 231, 183), width=1)
            short_eff = eff_name.split("_", 1)[1] if "_" in eff_name else eff_name
            draw.text((cx + 4, ry + thumb_h + 6), f"{eff_name[:2]}: {short_eff[:28]}", fill=(110, 231, 183), font=font_lbl)

    sheet_path = os.path.join(effects_dir, output_filename)
    return atomic_save_png(sheet, sheet_path)


def run_all_family1_effects(
    sources_dir: str | None = None,
    effects_dir: str | None = None,
) -> dict[str, Any]:
    """Run Effects 01–04 across all source photographs and build the Family 1 contact sheet."""
    base_dir = resolve_pictures_bandarchy_dir()
    src_dir = sources_dir or os.path.join(base_dir, "sources")
    out_dir = effects_dir or os.path.join(base_dir, "effects")
    os.makedirs(out_dir, exist_ok=True)

    source_files = sorted(
        p
        for p in glob.glob(os.path.join(src_dir, "*"))
        if os.path.splitext(p)[1].lower() in IMAGE_EXTENSIONS
        and not os.path.islink(p)
        and not is_generated_effect_filename(p)
    )
    if not source_files:
        raise StarkSnatchError(f"no valid source images found in {src_dir}")

    results: list[dict[str, Any]] = []
    for src_path in source_files:
        im = load_image_non_destructive(src_path, max_dim=960)
        analysis = compute_luminance_and_sectors(im)
        tag = parse_source_tag(src_path)
        for effect_name in FAMILY1_EFFECTS:
            out_im = EFFECT_DISPATCH[effect_name](im, analysis=analysis)
            out_name = f"{effect_name}__{tag}.png"
            out_path = atomic_save_png(out_im, os.path.join(out_dir, out_name))
            out_hsv = np.asarray(out_im.convert("HSV"), dtype=np.float32) / 255.0
            results.append(
                {
                    "effect": effect_name,
                    "source": os.path.basename(src_path),
                    "source_tag": tag,
                    "output": out_path,
                    "is_bw_source": analysis["is_bw"],
                    "source_mean_sat": round(analysis["mean_sat"], 4),
                    "output_mean_sat": round(float(out_hsv[:, :, 1].mean()), 4),
                    "output_max_sat": round(float(out_hsv[:, :, 1].max()), 4),
                }
            )

    contact_sheet = build_contact_sheet(src_dir, out_dir)
    return {
        "ok": True,
        "family": "Family 1: Stark Sector Colour-Snatch (Effects 01–04)",
        "sources_count": len(source_files),
        "effects_count": len(FAMILY1_EFFECTS),
        "generated_count": len(results),
        "contact_sheet": contact_sheet,
        "results": results,
    }


def pick_random_stark_snapshot(
    effect_name: str | None = None,
    sources_dir: str | None = None,
    output_dir: str | None = None,
    seed: int | None = None,
) -> dict[str, Any]:
    """Bandarchy runtime helper: randomly grab an image from `~/Pictures/bandarchy/sources`
    (or `~/Pictures/bandarchy`) and produce a non-destructive stark sector colour-snatch copy.
    """
    base_dir = resolve_pictures_bandarchy_dir()
    search_dirs = [sources_dir] if sources_dir else [os.path.join(base_dir, "sources"), base_dir]
    candidates: list[str] = []
    for d in search_dirs:
        if d and os.path.isdir(d) and not os.path.islink(d):
            for entry in sorted(os.listdir(d)):
                if is_generated_effect_filename(entry):
                    continue
                full = os.path.join(d, entry)
                if os.path.splitext(entry)[1].lower() in IMAGE_EXTENSIONS and not os.path.islink(full):
                    try:
                        validate_source_image(full)
                        candidates.append(full)
                    except StarkSnatchError:
                        continue
        if candidates:
            break

    if not candidates:
        raise StarkSnatchError(f"no valid images found in {base_dir}")

    rng = random.Random(seed)
    shuffled = list(candidates)
    rng.shuffle(shuffled)
    chosen_effect = effect_name if effect_name in EFFECT_DISPATCH else rng.choice(FAMILY1_EFFECTS)
    last_err: StarkSnatchError | None = None
    for chosen_src in shuffled:
        try:
            return process_image_effect(chosen_src, chosen_effect, output_dir=output_dir)
        except StarkSnatchError as exc:
            last_err = exc
            continue
    raise last_err or StarkSnatchError(f"no decodable images found in {base_dir}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Bandarchy Stark Sector Colour-Snatch Engine (Effects 01–04)."
    )
    parser.add_argument("--sources-dir", default=None, help="Directory of source images")
    parser.add_argument("--effects-dir", default=None, help="Directory for output PNGs")
    parser.add_argument("--effect", default=None, choices=FAMILY1_EFFECTS, help="Specific effect to run")
    parser.add_argument("--source", default=None, help="Single source image path")
    parser.add_argument("--random", action="store_true", help="Grab a random image and apply a stark effect")
    parser.add_argument("--seed", type=int, default=None, help="Optional RNG seed for --random")
    parser.add_argument("--json", action="store_true", help="Emit single-line JSON output for Bandarchy QML IPC")
    args = parser.parse_args(argv)

    try:
        if args.random:
            summary = pick_random_stark_snapshot(
                effect_name=args.effect,
                sources_dir=args.sources_dir,
                output_dir=args.effects_dir,
                seed=args.seed,
            )
        elif args.source:
            eff = args.effect or FAMILY1_EFFECTS[0]
            summary = process_image_effect(args.source, eff, output_dir=args.effects_dir)
        else:
            summary = run_all_family1_effects(sources_dir=args.sources_dir, effects_dir=args.effects_dir)
    except StarkSnatchError as exc:
        err_payload = {"ok": False, "error": str(exc)}
        print(json.dumps(err_payload))
        return 1

    if args.json:
        print(json.dumps(summary))
    else:
        print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
