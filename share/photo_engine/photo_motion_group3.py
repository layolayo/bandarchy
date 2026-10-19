#!/usr/bin/env python3
"""Bandarchy Stage-2 Real-Time Photo Motion & World-Bending Engine — Group C (Effects M13–M18).

Sector Separation, Chromatic Prism Split, 48-Band FFT Slicing, Louvre 3D Flip & Shatter Physics.

Implements Group C (`M13`–`M18`) of the 25 Stage-2 Real-Time Photo Motion, Strobe &
World-Bending Visualiser Effects for the Bandarchy Photo Layer, operating on the 16
pre-rendered Stage-1 Stark & Sector Colour-Snatch variants (`01`..`16`) of a single
source photograph in `~/Pictures/bandarchy/processed/<category>/`:

  - M13_Tri_Sector_3D_Parallax_Separation:
      Physically separates the photograph's 3 tonal sectors (Obsidian Black, Mid-Tone
      Structure, and Stark White / Snatched Colour) into 3 floating 3D Z-planes that
      tilt, orbit, and parallax independently while strobing the mid and white sectors
      across the 16 Stark variants and boosting active Bandarchy palette colours.
  - M14_Voronoi_Crystal_Shatter_And_Reform:
      Fractures the photo plane into 48–64 Voronoi geometric shards that blast outward
      in 3D XYZ space with angular spin on kick/snare hits—each shard strobing through
      different Stark effect variants (`01..16`) of the same image—before smoothly
      reforming into crystal-clear unity on breakdowns.
  - M15_48_Band_FFT_Ribbon_Slicer:
      Slices the photograph into 48 vertical or horizontal ribbons mapped 1:1 to
      Bandarchy's 48 Cava FFT spectrum bars, displacing each strip in 3D depth, cycling
      its Stark effect variant on spectral peaks, and igniting palette-matched colours.
  - M16_Prismatic_Palette_Channel_Orbit:
      Separates the image into 4 spectral/palette-matched colour & luminance layers
      that orbit the centre in phase-locked Lissajous trajectories, creating psychedelic
      ghosting that snaps into razor-sharp unity on bar downbeats.
  - M17_Venetian_Louvre_3D_Flip_Strobe:
      Slices the image into 3D rotating louvre slats that flip 180° in sequence across
      the screen—displaying one Stark effect variant on the front face and another Stark
      effect variant of the same image on the reverse face, with glowing palette-coloured
      slat edges.
  - M18_Quantum_Swarm_Sector_Dissolve:
      Dissolves the bright white and colour-snatched sectors into swirling divergence-free
      curl-noise particle streams while the stark silhouette morphs between the 16
      processed variants of the same image.

Fade, Cross-Dissolve & Per-Sector Opacity Pipeline:
  - Master `opacity` / `fade_mix` (`0.0`..`1.0`): Global layer alpha / backdrop blend.
  - Per-Sector Opacity (`black_opacity`, `mid_opacity`, `white_opacity`, `colour_opacity`
    plus aliases `photo_black_opacity`, `photo_mid_opacity`, `photo_white_opacity`,
    `photo_colour_snatch_opacity` in `[0.0, 1.0]`): Independently controls the opacity of
    obsidian black shadows, mid-tone structure, chalk white highlights, and snatched neon
    colour sectors across every effect.
  - Smooth Variant Cross-Fade (`variant_fade` in `[0.0, 1.0]` across `linear`,
    `smoothstep`, `luma_wipe`, and `palette_key` modes): Smoothly blends between the 16
    Stark variants of the same image during sector separation, Voronoi shatter, ribbon
    slicing, prismatic orbit, louvre flips, and quantum dissolve.

Also provides drop-in QML / HTML5 Context2D / GLSL Shader specifications (`GROUP_C_QML_SPECS`)
for direct integration into Bandarchy's `Visualiser.qml` and `PsychedelicEngine.js`.

All prose, documentation, comments, and identifiers strictly adhere to British English.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys
from typing import Any, Callable

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

import bandarchy_photo_import as bpi
import effects_family1 as f1
import photo_motion_group1 as pmg1

os.umask(0o077)

MAX_ART_BYTES = f1.MAX_ART_BYTES
IMAGE_EXTENSIONS = f1.IMAGE_EXTENSIONS
ALL_16_EFFECTS = bpi.ALL_16_EFFECTS

BANDARCHY_PALETTE_LIST = pmg1.BANDARCHY_PALETTE_LIST
BANDARCHY_PALETTES = pmg1.BANDARCHY_PALETTES
SECTOR_ALPHA_MODES = pmg1.SECTOR_ALPHA_MODES
VARIANT_FADE_MODES = pmg1.VARIANT_FADE_MODES

PhotoMotionError = pmg1.PhotoMotionError
PhotoMotionGroup3Error = PhotoMotionError

GROUP3_MOTION_EFFECTS: tuple[str, ...] = (
    "M13_Tri_Sector_3D_Parallax_Separation",
    "M14_Voronoi_Crystal_Shatter_And_Reform",
    "M15_48_Band_FFT_Ribbon_Slicer",
    "M16_Prismatic_Palette_Channel_Orbit",
    "M17_Venetian_Louvre_3D_Flip_Strobe",
    "M18_Quantum_Swarm_Sector_Dissolve",
)

# Compatibility aliases for any caller referencing alternative Group C IDs
GROUP3_EFFECT_ALIASES: dict[str, str] = {
    "M13_RGB_And_Palette_Channel_Vector_Separation": "M13_Tri_Sector_3D_Parallax_Separation",
    "M14_48Band_FFT_Vertical_Venetian_Shredder": "M15_48_Band_FFT_Ribbon_Slicer",
    "M15_High_Frequency_Rave_Shutter_Variant_Strobe": "M17_Venetian_Louvre_3D_Flip_Strobe",
    "M16_Concentric_Radar_Ring_Sector_Shear": "M16_Prismatic_Palette_Channel_Orbit",
    "M17_Voronoi_Glass_Shatter_And_Beat_Reform": "M14_Voronoi_Crystal_Shatter_And_Reform",
    "M18_Scanline_Phase_Slip_And_VHS_Tracking_Tear": "M18_Quantum_Swarm_Sector_Dissolve",
}


def _clamp_finite(val: Any, lo: float = 0.0, hi: float = 1.0, default: float = 1.0) -> float:
    """Safely clamp a numeric parameter into `[lo, hi]`, guarding against NaN/Inf/None."""
    if val is None:
        return default
    try:
        fval = float(val)
    except (TypeError, ValueError):
        return default
    if not math.isfinite(fval):
        return default
    return float(min(max(fval, lo), hi))


def _clamp_int(val: Any, lo: int, hi: int, default: int) -> int:
    """Safely clamp an integer parameter into `[lo, hi]`, guarding against NaN/Inf/None."""
    return int(round(_clamp_finite(val, float(lo), float(hi), float(default))))


def _safe_palette_index(palette_index: Any) -> int | None:
    """Safely normalise `palette_index` to an `int` or `None` if NaN/Inf/invalid."""
    if palette_index is None:
        return None
    try:
        fval = float(palette_index)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(fval):
        return None
    return int(round(fval))


def _safe_gradient_2d(
    arr: np.ndarray,
    dy: float = 1.0,
    dx: float = 1.0,
) -> tuple[np.ndarray, np.ndarray]:
    """Compute 2D spatial gradients `(df/dy, df/dx)` safely even on 1xN or Nx1 arrays."""
    h, w = arr.shape[:2]
    gy = (
        np.gradient(arr, dy, axis=0).astype(np.float32)
        if h >= 2
        else np.zeros_like(arr, dtype=np.float32)
    )
    gx = (
        np.gradient(arr, dx, axis=1).astype(np.float32)
        if w >= 2
        else np.zeros_like(arr, dtype=np.float32)
    )
    return gy, gx


def _resolve_opacity(
    opacity: float = 1.0,
    fade_mix: float | None = None,
    photo_opacity: float | None = None,
) -> float:
    """Resolve master `opacity` / `fade_mix` / `photo_opacity` in `[0.0, 1.0]`."""
    if fade_mix is not None:
        return _clamp_finite(fade_mix, 0.0, 1.0, 1.0)
    if photo_opacity is not None:
        return _clamp_finite(photo_opacity, 0.0, 1.0, 1.0)
    return _clamp_finite(opacity, 0.0, 1.0, 1.0)


def _resolve_sector_opacities(
    black_opacity: float = 1.0,
    mid_opacity: float = 1.0,
    white_opacity: float = 1.0,
    colour_opacity: float = 1.0,
    *,
    photo_black_opacity: float | None = None,
    photo_mid_opacity: float | None = None,
    photo_white_opacity: float | None = None,
    photo_colour_snatch_opacity: float | None = None,
) -> tuple[float, float, float, float]:
    """Resolve per-sector opacities `(black_op, mid_op, white_op, colour_op)` in `[0.0, 1.0]`."""
    b_op = _clamp_finite(
        photo_black_opacity if photo_black_opacity is not None else black_opacity,
        0.0,
        1.0,
        1.0,
    )
    m_op = _clamp_finite(
        photo_mid_opacity if photo_mid_opacity is not None else mid_opacity,
        0.0,
        1.0,
        1.0,
    )
    w_op = _clamp_finite(
        photo_white_opacity if photo_white_opacity is not None else white_opacity,
        0.0,
        1.0,
        1.0,
    )
    c_op = _clamp_finite(
        photo_colour_snatch_opacity if photo_colour_snatch_opacity is not None else colour_opacity,
        0.0,
        1.0,
        1.0,
    )
    return b_op, m_op, w_op, c_op


# Re-export core helpers from Group 1 so callers have a consistent API across groups
get_palette_rgb_matrix = pmg1.get_palette_rgb_matrix
crossfade_variants = pmg1.crossfade_variants
enhance_palette_colours = pmg1.enhance_palette_colours
load_source_16_variants = pmg1.load_source_16_variants
rotation_matrix_xyz = pmg1.rotation_matrix_xyz
bilinear_sample_rgb = pmg1.bilinear_sample_rgb
project_3d_plane = pmg1.project_3d_plane
render_cyber_horizon_backdrop = pmg1.render_cyber_horizon_backdrop
finalise_motion_frame = pmg1.finalise_motion_frame


def _normalise_bundle_input(
    bundle_or_variants: dict[str, Any] | list[np.ndarray] | list[Image.Image] | Image.Image | np.ndarray,
) -> dict[str, Any]:
    """Normalise either a `load_source_16_variants` bundle dict or a list/array/PIL Image into a bundle dict."""
    if isinstance(bundle_or_variants, dict) and "ordered_list" in bundle_or_variants:
        ordered = bundle_or_variants["ordered_list"]
        if not ordered:
            raise PhotoMotionError("bundle['ordered_list'] cannot be empty")
        h, w = ordered[0].shape[:2]
        return {
            "category": bundle_or_variants.get("category", "custom"),
            "source_stem": bundle_or_variants.get("source_stem", "custom_stem"),
            "width": int(bundle_or_variants.get("width", w)),
            "height": int(bundle_or_variants.get("height", h)),
            "ordered_list": ordered,
            "effect_names": bundle_or_variants.get("effect_names", list(ALL_16_EFFECTS[: len(ordered)])),
        }

    if isinstance(bundle_or_variants, Image.Image):
        arr = np.asarray(bundle_or_variants.convert("RGB"), dtype=np.float32) / 255.0
        ordered = [arr for _ in range(16)]
    elif isinstance(bundle_or_variants, np.ndarray):
        if bundle_or_variants.ndim != 3 or bundle_or_variants.shape[2] < 3:
            raise PhotoMotionError("Expected (H, W, 3) numpy array")
        arr = bundle_or_variants[:, :, :3].astype(np.float32)
        if float(arr.max()) > 1.001:
            arr = arr / 255.0
        arr = np.clip(np.nan_to_num(arr, nan=0.0, posinf=1.0, neginf=0.0), 0.0, 1.0)
        ordered = [arr for _ in range(16)]
    elif isinstance(bundle_or_variants, (list, tuple)) and len(bundle_or_variants) > 0:
        conv: list[np.ndarray] = []
        target_hw: tuple[int, int] | None = None
        for item in bundle_or_variants:
            if isinstance(item, Image.Image):
                a = np.asarray(item.convert("RGB"), dtype=np.float32) / 255.0
            else:
                raw = np.asarray(item, dtype=np.float32)
                if raw.ndim != 3 or raw.shape[2] < 3:
                    raise PhotoMotionError("Expected (H, W, 3) array in variants list")
                a = raw[:, :, :3]
                if float(a.max()) > 1.001:
                    a = a / 255.0
                a = np.clip(np.nan_to_num(a, nan=0.0, posinf=1.0, neginf=0.0), 0.0, 1.0)
            if target_hw is None:
                target_hw = (a.shape[0], a.shape[1])
            elif (a.shape[0], a.shape[1]) != target_hw:
                pil_tmp = Image.fromarray((a * 255.0).astype(np.uint8), mode="RGB").resize(
                    (target_hw[1], target_hw[0]), Image.Resampling.BILINEAR
                )
                a = np.asarray(pil_tmp, dtype=np.float32) / 255.0
            conv.append(a)
        ordered = [conv[i % len(conv)] for i in range(max(len(conv), 16))]
    else:
        raise PhotoMotionError("Unsupported input type for Group C photo motion effect")

    h, w = ordered[0].shape[:2]
    return {
        "category": "custom",
        "source_stem": "direct_array",
        "width": w,
        "height": h,
        "ordered_list": ordered,
        "effect_names": list(ALL_16_EFFECTS[: len(ordered)]),
    }


def decompose_tonal_and_colour_sectors(
    rgb: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Decompose a `[0, 1]` float32 RGB image into continuous partition-of-unity sector weights.

    Returns `(black_w, mid_w, white_w, colour_w, luma, sat)` where:
      - `black_w`: Obsidian shadow sector weight (`Y < 0.28`, non-chromatic)
      - `mid_w`: Structural grey/silver mid-tone sector weight (`0.22 <= Y <= 0.74`, non-chromatic)
      - `white_w`: Chalk white highlight sector weight (`Y > 0.68`, non-chromatic)
      - `colour_w`: High-saturation snatched neon colour sector weight (`sat > 0.14`)
      - `black_w + mid_w + white_w + colour_w == 1.0` at every pixel.
    """
    clean = np.clip(np.nan_to_num(rgb, nan=0.0, posinf=1.0, neginf=0.0), 0.0, 1.0)
    luma = 0.2126 * clean[:, :, 0] + 0.7152 * clean[:, :, 1] + 0.0722 * clean[:, :, 2]
    max_c = np.max(clean, axis=2)
    min_c = np.min(clean, axis=2)
    sat = (max_c - min_c) / np.maximum(max_c, 1e-5)

    colour_w = (f1.smoothstep(0.14, 0.36, sat) * f1.smoothstep(0.08, 0.24, max_c)).astype(np.float32)
    non_col = 1.0 - colour_w

    black_raw = 1.0 - f1.smoothstep(0.08, 0.32, luma)
    white_raw = f1.smoothstep(0.66, 0.88, luma)
    mid_raw = np.clip(1.0 - black_raw - white_raw, 0.0, 1.0)

    total_bw = np.maximum(black_raw + mid_raw + white_raw, 1e-5)
    black_w = (non_col * (black_raw / total_bw)).astype(np.float32)
    mid_w = (non_col * (mid_raw / total_bw)).astype(np.float32)
    white_w = (non_col * (white_raw / total_bw)).astype(np.float32)

    return black_w, mid_w, white_w, colour_w, luma.astype(np.float32), sat.astype(np.float32)


def compute_sector_alpha(
    rgb: np.ndarray,
    opacity: float = 1.0,
    sector_alpha_mode: str = "black_void_transparent",
    black_void_floor: float = 0.18,
    *,
    fade_mix: float | None = None,
    black_opacity: float = 1.0,
    mid_opacity: float = 1.0,
    white_opacity: float = 1.0,
    colour_opacity: float = 1.0,
    photo_black_opacity: float | None = None,
    photo_mid_opacity: float | None = None,
    photo_white_opacity: float | None = None,
    photo_colour_snatch_opacity: float | None = None,
) -> np.ndarray:
    """Compute a per-pixel float32 alpha map `(H, W)` in `[0.0, 1.0]` combining master
    `opacity` / `fade_mix`, `sector_alpha_mode`, and independent per-sector opacities
    (`black_opacity`, `mid_opacity`, `white_opacity`, `colour_opacity`).
    """
    base_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)
    h, w = rgb.shape[:2]
    if base_opacity <= 1e-5:
        return np.zeros((h, w), dtype=np.float32)

    b_op, m_op, w_op, c_op = _resolve_sector_opacities(
        black_opacity=black_opacity,
        mid_opacity=mid_opacity,
        white_opacity=white_opacity,
        colour_opacity=colour_opacity,
        photo_black_opacity=photo_black_opacity,
        photo_mid_opacity=photo_mid_opacity,
        photo_white_opacity=photo_white_opacity,
        photo_colour_snatch_opacity=photo_colour_snatch_opacity,
    )

    black_w, mid_w, white_w, colour_w, luma, sat = decompose_tonal_and_colour_sectors(rgb)
    sector_mult = (
        black_w * b_op
        + mid_w * m_op
        + white_w * w_op
        + colour_w * c_op
    )

    floor_val = _clamp_finite(black_void_floor, 0.0, 1.0, 0.18)
    if sector_alpha_mode == "solid":
        mode_alpha = np.ones((h, w), dtype=np.float32)
    elif sector_alpha_mode == "chalk_and_neon_only":
        signal = np.maximum(f1.smoothstep(0.08, 0.45, luma), f1.smoothstep(0.12, 0.40, sat))
        floor = float(np.clip(floor_val * 0.4, 0.0, 1.0))
        mode_alpha = floor + (1.0 - floor) * signal
    elif sector_alpha_mode == "ghost_veil":
        signal = 0.35 + 0.65 * np.maximum(luma, sat)
        mode_alpha = np.clip(signal, 0.20, 0.92)
    else:
        # "black_void_transparent"
        signal = np.maximum(f1.smoothstep(0.04, 0.24, luma), f1.smoothstep(0.10, 0.32, sat))
        floor = float(np.clip(floor_val, 0.0, 1.0))
        mode_alpha = floor + (1.0 - floor) * signal

    combined = mode_alpha * sector_mult * base_opacity
    return np.clip(combined, 0.0, 1.0).astype(np.float32)


def _bilinear_sample_pixel_coords(
    tex: np.ndarray,
    x_px: np.ndarray,
    y_px: np.ndarray,
    wrap: bool = False,
) -> tuple[np.ndarray, np.ndarray]:
    """Vectorised 2D bilinear sampler for pixel coordinates `x_px in [0, W-1], y_px in [0, H-1]`.

    Returns `(sampled_rgb, valid_mask)`.
    """
    th, tw = tex.shape[:2]
    if wrap:
        valid = np.ones(x_px.shape, dtype=bool)
        ux = np.mod(x_px, float(tw))
        uy = np.mod(y_px, float(th))
    else:
        valid = (x_px >= 0.0) & (x_px <= float(tw - 1)) & (y_px >= 0.0) & (y_px <= float(th - 1))
        ux = np.clip(x_px, 0.0, float(tw - 1.0001))
        uy = np.clip(y_px, 0.0, float(th - 1.0001))

    x0 = np.floor(ux).astype(np.int32) % tw
    y0 = np.floor(uy).astype(np.int32) % th
    x1 = (x0 + 1) % tw if wrap else np.minimum(x0 + 1, tw - 1)
    y1 = (y0 + 1) % th if wrap else np.minimum(y0 + 1, th - 1)

    wx = (ux - np.floor(ux)).astype(np.float32)[:, :, None]
    wy = (uy - np.floor(uy)).astype(np.float32)[:, :, None]

    sampled = (
        tex[y0, x0] * (1.0 - wx) * (1.0 - wy)
        + tex[y0, x1] * wx * (1.0 - wy)
        + tex[y1, x0] * (1.0 - wx) * wy
        + tex[y1, x1] * wx * wy
    )
    if not wrap:
        sampled = sampled * valid[:, :, None].astype(np.float32)
    return sampled.astype(np.float32), valid


def generate_48_band_spectrum(
    time_s: float = 1.25,
    beat_pulse: float = 0.88,
    fft_bands: list[float] | np.ndarray | None = None,
) -> np.ndarray:
    """Resolve or synthesise a realistic 48-band Cava FFT spectrum in `[0.0, 1.0]`."""
    if fft_bands is not None:
        arr = np.asarray(fft_bands, dtype=np.float32).ravel()
        if arr.size > 0:
            arr = np.clip(np.nan_to_num(arr, nan=0.0, posinf=1.0, neginf=0.0), 0.0, 1.0)
            if arr.size == 48:
                return arr
            idx = np.linspace(0, arr.size - 1, 48)
            return np.interp(idx, np.arange(arr.size), arr).astype(np.float32)

    t = _clamp_finite(time_s, -1e5, 1e5, 1.25)
    bp = _clamp_finite(beat_pulse, 0.0, 1.5, 0.88)
    bands = np.arange(48, dtype=np.float32)
    norm_b = bands / 47.0

    # Sub-bass & kick peak (bands 0..9), Acid synth mids (bands 12..30), Hi-hat air (bands 32..47)
    sub_bass = np.exp(-((norm_b - 0.08) / 0.11) ** 2) * (0.55 + 0.45 * bp)
    mid_harmonic = (
        0.55
        + 0.45 * np.sin(bands * 0.52 - t * 4.2) * np.cos(bands * 0.23 + t * 2.7)
    ) * np.exp(-((norm_b - 0.46) / 0.28) ** 2)
    high_air = (
        0.40 + 0.60 * np.abs(np.sin(bands * 1.15 + t * 7.5))
    ) * np.exp(-((norm_b - 0.82) / 0.22) ** 2) * (0.45 + 0.45 * bp)

    spec = np.clip(0.12 + 0.88 * np.maximum(np.maximum(sub_bass, mid_harmonic * 0.85), high_air), 0.05, 1.0)
    return spec.astype(np.float32)


# ============================================================================
# Group C Motion & World-Bending Effect Implementations (M13–M18)
# ============================================================================


def effect_m13_tri_sector_3d_parallax_separation(
    bundle: dict[str, Any] | list[np.ndarray] | Image.Image,
    *,
    time_s: float = 1.30,
    beat_pulse: float = 0.90,
    separation: float = 1.0,
    pitch_deg: float = -18.0,
    yaw_deg: float = 24.0,
    roll_deg: float = -6.0,
    z_depth: float = 1.92,
    palette_name: str = "Omarchy Cyber",
    palette_index: int | None = None,
    palette_boost: float = 1.48,
    bloom_strength: float = 0.46,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float | None = None,
    fade_mode: str = "smoothstep",
    sector_alpha_mode: str = "black_void_transparent",
    black_opacity: float = 1.0,
    mid_opacity: float = 1.0,
    white_opacity: float = 1.0,
    colour_opacity: float = 1.0,
    return_rgba: bool = False,
    **kwargs: Any,
) -> Image.Image:
    """M13: Tri-Sector 3D Parallax Separation.

    Physically separates the photograph's 3 tonal sectors:
      1. **Obsidian Black Shadow Plane (`Z_back`)**: Deep shadow & dark architectural
         cutouts outlined with a subtle dark-neon contour, tilting and receding in Z.
      2. **Mid-Tone Structural Plane (`Z_mid`)**: Silver/chrome structural mid-tones
         strobing and cross-fading across the 16 Stark variants on a counter-tilted
         middle 3D plane.
      3. **Stark White & Snatched Neon Colour Plane (`Z_front`)**: Blinding chalk
         highlights and hyper-saturated active-palette colour-snatched sectors surging
         forward toward the viewer on an independent 3D orbit with glowing registration
         laser struts connecting the separated planes.
    """
    b = _normalise_bundle_input(bundle)
    w, h = b["width"], b["height"]
    variants: list[np.ndarray] = b["ordered_list"]
    num_v = len(variants)
    t = _clamp_finite(time_s, -1e5, 1e5, 1.30)
    bp = _clamp_finite(beat_pulse, 0.0, 1.5, 0.90)
    sep = _clamp_finite(separation, 0.0, 2.5, 1.0) * (0.65 + 0.45 * bp)

    p_idx = _safe_palette_index(palette_index)
    p_boost = _clamp_finite(palette_boost, 0.0, 5.0, 1.48)
    b_str = _clamp_finite(bloom_strength, 0.0, 2.0, 0.46)
    bv_floor = _clamp_finite(kwargs.get("black_void_floor"), 0.0, 1.0, 0.22)

    pal = get_palette_rgb_matrix(palette_name, palette_index=p_idx)
    master_opacity = _resolve_opacity(
        opacity=opacity,
        fade_mix=fade_mix,
        photo_opacity=kwargs.get("photo_opacity"),
    )
    b_op, m_op, w_op, c_op = _resolve_sector_opacities(
        black_opacity=black_opacity,
        mid_opacity=mid_opacity,
        white_opacity=white_opacity,
        colour_opacity=colour_opacity,
        photo_black_opacity=kwargs.get("photo_black_opacity"),
        photo_mid_opacity=kwargs.get("photo_mid_opacity"),
        photo_white_opacity=kwargs.get("photo_white_opacity"),
        photo_colour_snatch_opacity=kwargs.get("photo_colour_snatch_opacity"),
    )

    phase = t * 6.5 + bp * 1.4
    idx_base = int(math.floor(phase)) % num_v
    frac = (phase - math.floor(phase)) if variant_fade is None else _clamp_finite(variant_fade, 0.0, 1.0, 0.38)

    # Distinct variant pairs for the 3 separated sector planes of the SAME source photograph
    tex_black_src = crossfade_variants(
        variants[idx_base],
        variants[(idx_base + 2) % num_v],
        variant_fade=frac,
        fade_mode=fade_mode,
        palette_rgb=pal,
    )
    tex_mid_src = crossfade_variants(
        variants[(idx_base + 5) % num_v],
        variants[(idx_base + 9) % num_v],
        variant_fade=frac,
        fade_mode=fade_mode,
        palette_rgb=pal,
    )
    tex_front_src = crossfade_variants(
        variants[(idx_base + 12) % num_v],
        variants[(idx_base + 15) % num_v],
        variant_fade=frac,
        fade_mode=fade_mode,
        palette_rgb=pal,
    )
    tex_front_enh = enhance_palette_colours(
        tex_front_src,
        palette_name=palette_name,
        palette_index=p_idx,
        palette_boost=p_boost,
        bloom_strength=b_str,
        beat_pulse=bp,
    )

    # Decompose tonal & chromatic masks so each 3D plane carries its dedicated physical sector
    blk_w1, _, _, _, luma_b, _ = decompose_tonal_and_colour_sectors(tex_black_src)
    _, mid_w2, _, col_w2, luma_m, _ = decompose_tonal_and_colour_sectors(tex_mid_src)
    _, _, wht_w3, col_w3, luma_f, _ = decompose_tonal_and_colour_sectors(tex_front_enh)

    # Add crisp Sobel structural rim to the obsidian black sector plane so its floating silhouette pops in 3D
    gy_b, gx_b = _safe_gradient_2d(luma_b)
    edge_b = np.clip(np.hypot(gx_b, gy_b) * 4.2, 0.0, 1.0)
    obsidian_tint = np.array([0.04, 0.05, 0.09], dtype=np.float32)[None, None, :]
    plane1_rgb = np.clip(
        obsidian_tint * (1.0 - edge_b[:, :, None] * 0.55)
        + pal[2 % len(pal)][None, None, :] * (edge_b * 0.65)[:, :, None]
        + tex_black_src * 0.25,
        0.0,
        1.0,
    )
    plane1_base_a = blk_w1 * (0.25 + 0.75 * max(bv_floor, 0.70)) + edge_b * 0.45
    plane1_alpha = np.clip(plane1_base_a * b_op, 0.0, 1.0).astype(np.float32)

    # Plane 2: Mid-Tone Architectural Structure Plane
    gy_m, gx_m = _safe_gradient_2d(luma_m)
    edge_m = np.clip(np.hypot(gx_m, gy_m) * 3.6, 0.0, 1.0)
    plane2_rgb = enhance_palette_colours(
        tex_mid_src,
        palette_name=palette_name,
        palette_index=p_idx,
        palette_boost=p_boost * 0.75,
        bloom_strength=b_str * 0.35,
        beat_pulse=bp,
    )
    plane2_alpha = np.clip(
        (mid_w2 * 0.92 + edge_m * 0.40) * m_op + col_w2 * 0.25 * c_op,
        0.0,
        1.0,
    ).astype(np.float32)

    # Plane 3: Stark White & Snatched Neon Colour Plane (Foreground Z-plane)
    gy_f, gx_f = _safe_gradient_2d(luma_f)
    edge_f = np.clip(np.hypot(gx_f, gy_f) * 4.0, 0.0, 1.0)
    plane3_rgb = tex_front_enh
    plane3_alpha = np.clip(
        (wht_w3 * w_op + col_w3 * c_op + edge_f * 0.35 * max(w_op, c_op)),
        0.0,
        1.0,
    ).astype(np.float32)

    if sector_alpha_mode == "chalk_and_neon_only":
        plane1_alpha *= 0.25
        plane2_alpha *= 0.65
    elif sector_alpha_mode == "ghost_veil":
        plane1_alpha *= 0.65
        plane2_alpha *= 0.75
        plane3_alpha *= 0.82

    canvas = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=pitch_deg, yaw_deg=yaw_deg, beat_pulse=bp)
    backdrop = canvas.copy()
    accum_alpha = np.zeros((h, w), dtype=np.float32)

    # 3D Parallax trajectories for the 3 separated tonal planes (rendered back-to-front)
    z_base = _clamp_finite(z_depth, 0.9, 4.0, 1.92)
    p_base = _clamp_finite(pitch_deg, -65.0, 65.0, -18.0)
    y_base = _clamp_finite(yaw_deg, -65.0, 65.0, 24.0)
    r_base = _clamp_finite(roll_deg, -180.0, 180.0, -6.0)

    planes_spec = [
        # (rgb, alpha, pitch, yaw, roll, tx, ty, tz, border_rgb, border_w)
        (
            plane1_rgb,
            plane1_alpha,
            p_base - 9.0 * sep * math.cos(t * 1.3),
            y_base - 14.0 * sep * math.sin(t * 1.1),
            r_base - 6.0 * sep,
            -0.22 * sep,
            0.12 * sep,
            z_base + 0.56 * sep,
            pal[2 % len(pal)],
            0.028,
        ),
        (
            plane2_rgb,
            plane2_alpha,
            p_base + 4.0 * sep * math.sin(t * 1.6),
            y_base + 3.0 * sep * math.cos(t * 1.4),
            r_base,
            0.0,
            0.0,
            z_base,
            pal[1 % len(pal)],
            0.034,
        ),
        (
            plane3_rgb,
            plane3_alpha,
            p_base + 10.0 * sep * math.cos(t * 1.5),
            y_base + 15.0 * sep * math.sin(t * 1.2),
            r_base + 7.0 * sep,
            0.20 * sep,
            -0.11 * sep,
            max(0.85, z_base - 0.38 * sep),
            pal[0 % len(pal)],
            0.042,
        ),
    ]

    plane_centres_px: list[tuple[int, int]] = []
    for p_rgb, p_a, p_d, y_d, r_d, tx, ty, tz, b_col, b_w in planes_spec:
        proj_rgb, proj_a, valid_m, _, _ = project_3d_plane(
            p_rgb,
            w,
            h,
            pitch_deg=p_d,
            yaw_deg=y_d,
            roll_deg=r_d,
            tx=tx,
            ty=ty,
            tz=tz,
            scale_x=0.96,
            scale_y=0.74,
            fov_deg=55.0,
            border_rgb=b_col,
            border_width=b_w,
            plane_alpha_map=p_a,
        )
        canvas = canvas * (1.0 - proj_a[:, :, None]) + proj_rgb * proj_a[:, :, None]
        accum_alpha = np.clip(accum_alpha + proj_a * (1.0 - accum_alpha), 0.0, 1.0)
        if np.any(valid_m):
            ys, xs = np.nonzero(valid_m)
            plane_centres_px.append((int(xs.mean()), int(ys.mean())))

    # Draw glowing 3D parallax axis struts linking the 3 separated tonal planes when separated
    if len(plane_centres_px) >= 2 and sep > 0.05 and max(b_op, m_op, w_op, c_op) > 0.05:
        strut_im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(strut_im)
        c_u8 = tuple((pal[0] * 255.0).astype(np.uint8).tolist())
        for dx_off, dy_off in [(-int(w * 0.22), -int(h * 0.16)), (int(w * 0.22), -int(h * 0.16)), (0, 0)]:
            pts = [(cx + dx_off, cy + dy_off) for (cx, cy) in plane_centres_px]
            s_draw.line(pts, fill=(*c_u8, 175), width=2)
        s_arr = np.asarray(strut_im, dtype=np.float32) / 255.0
        sa = s_arr[:, :, 3] * max(w_op, c_op)
        canvas = canvas * (1.0 - sa[:, :, None]) + s_arr[:, :, :3] * sa[:, :, None]
        accum_alpha = np.clip(accum_alpha + sa * (1.0 - accum_alpha), 0.0, 1.0)

    return finalise_motion_frame(
        canvas, accum_alpha, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


def effect_m14_voronoi_crystal_shatter_and_reform(
    bundle: dict[str, Any] | list[np.ndarray] | Image.Image,
    *,
    time_s: float = 1.45,
    beat_pulse: float = 0.92,
    shard_count: int = 56,
    shatter_explosion: float | None = None,
    palette_name: str = "Tokyo Synthwave",
    palette_index: int | None = None,
    palette_boost: float = 1.45,
    bloom_strength: float = 0.44,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.36,
    fade_mode: str = "smoothstep",
    sector_alpha_mode: str = "black_void_transparent",
    black_opacity: float = 1.0,
    mid_opacity: float = 1.0,
    white_opacity: float = 1.0,
    colour_opacity: float = 1.0,
    return_rgba: bool = False,
    **kwargs: Any,
) -> Image.Image:
    """M14: Voronoi Crystal Shatter & Reform.

    Fractures the photo plane into `48..64` Voronoi geometric crystal shards that
    blast outward in 3D XYZ space with angular spin on kick/snare hits—each shard
    strobing and cross-fading through different Stark effect variants (`01..16`) of
    the same image—before smoothly reforming into razor-sharp unity on breakdowns.
    """
    b = _normalise_bundle_input(bundle)
    w, h = b["width"], b["height"]
    variants: list[np.ndarray] = b["ordered_list"]
    num_v = len(variants)

    t = _clamp_finite(time_s, -1e5, 1e5, 1.45)
    bp = _clamp_finite(beat_pulse, 0.0, 1.5, 0.92)
    n_shards = _clamp_int(shard_count, 16, 96, 56)
    v_fade = _clamp_finite(variant_fade, 0.0, 1.0, 0.36)
    p_idx = _safe_palette_index(palette_index)
    p_boost = _clamp_finite(palette_boost, 0.0, 5.0, 1.45)
    b_str = _clamp_finite(bloom_strength, 0.0, 2.0, 0.44)
    bv_floor = _clamp_finite(kwargs.get("black_void_floor"), 0.0, 1.0, 0.22)

    # When shatter_explosion is explicitly provided (e.g. 0.0 for breakdown reform), honour it;
    # otherwise modulate from beat_pulse and time_s envelope.
    if shatter_explosion is not None:
        blast = _clamp_finite(shatter_explosion, 0.0, 2.0, 0.85)
    else:
        wave = 0.35 + 0.65 * max(0.0, math.sin(t * 2.1))
        blast = float(np.clip(0.28 * wave + 0.72 * bp, 0.0, 1.5))

    pal = get_palette_rgb_matrix(palette_name, palette_index=p_idx)
    master_opacity = _resolve_opacity(
        opacity=opacity,
        fade_mix=fade_mix,
        photo_opacity=kwargs.get("photo_opacity"),
    )
    b_op, m_op, w_op, c_op = _resolve_sector_opacities(
        black_opacity=black_opacity,
        mid_opacity=mid_opacity,
        white_opacity=white_opacity,
        colour_opacity=colour_opacity,
        photo_black_opacity=kwargs.get("photo_black_opacity"),
        photo_mid_opacity=kwargs.get("photo_mid_opacity"),
        photo_white_opacity=kwargs.get("photo_white_opacity"),
        photo_colour_snatch_opacity=kwargs.get("photo_colour_snatch_opacity"),
    )

    # Generate deterministic golden-angle + stratified Voronoi crystal seeds in [-1, 1]^2
    idx_arr = np.arange(n_shards, dtype=np.float32)
    golden_ang = idx_arr * 2.3999632
    rad = np.sqrt((idx_arr + 0.5) / float(n_shards)) * 0.92
    seed_x = (rad * np.cos(golden_ang) * 1.05).astype(np.float32)
    seed_y = (rad * np.sin(golden_ang) * 1.05).astype(np.float32)

    # Compute Voronoi cell assignment and fracture distance on a fast grid, upsampled if large
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx / max(w - 1, 1)) * 2.0 - 1.0
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0

    # Outward 3D XYZ blast displacement of shard centres
    seed_dist = np.hypot(seed_x, seed_y) + 1e-4
    dir_x = seed_x / seed_dist
    dir_y = seed_y / seed_dist
    # Per-shard pseudo-random Z surge and angular spin velocity
    shard_hash = np.sin(idx_arr * 12.9898 + 78.233) * 43758.5453
    shard_rand = (shard_hash - np.floor(shard_hash)).astype(np.float32)

    disp_mag = blast * (0.14 + 0.18 * shard_rand) * (0.45 + 0.65 * seed_dist)
    curr_sx = seed_x + dir_x * disp_mag
    curr_sy = seed_y + dir_y * disp_mag
    # Per-shard 3D Z-depth scale factor (> 1 means zoomed toward camera, < 1 receding)
    shard_z_scale = np.clip(1.0 + blast * (shard_rand - 0.38) * 0.42, 0.62, 1.48).astype(np.float32)
    # Per-shard angular spin in radians
    shard_spin = (blast * (shard_rand - 0.5) * 1.15 * math.sin(t * 1.9 + 0.8)).astype(np.float32)

    # Vectorised distance evaluation in chunks to keep memory small and speed high
    best_d2 = np.full((h, w), 1e9, dtype=np.float32)
    second_d2 = np.full((h, w), 1e9, dtype=np.float32)
    best_id = np.zeros((h, w), dtype=np.int32)

    chunk_size = 16
    for start in range(0, n_shards, chunk_size):
        end = min(start + chunk_size, n_shards)
        dx = nx[:, :, None] - curr_sx[None, None, start:end]
        dy = ny[:, :, None] - curr_sy[None, None, start:end]
        d2 = dx * dx + dy * dy
        for k in range(end - start):
            s_id = start + k
            dk = d2[:, :, k]
            closer = dk < best_d2
            second_d2 = np.where(closer, best_d2, np.minimum(second_d2, dk))
            best_d2 = np.where(closer, dk, best_d2)
            best_id = np.where(closer, s_id, best_id)

    d1 = np.sqrt(np.maximum(best_d2, 0.0))
    d2_sqrt = np.sqrt(np.maximum(second_d2, 0.0))
    border_delta = d2_sqrt - d1

    # When `blast > 0`, shards separate along their boundaries creating physical 3D gaps between shards
    gap_width = 0.022 * blast
    inside_shard = border_delta >= gap_width
    bevel_edge = np.exp(-((np.maximum(border_delta - gap_width, 0.0)) / (0.016 + 0.008 * bp)) ** 2) * inside_shard

    # Inverse-transform each pixel's coordinate back to its original pre-shatter source UV
    cx_curr = curr_sx[best_id]
    cy_curr = curr_sy[best_id]
    cx_orig = seed_x[best_id]
    cy_orig = seed_y[best_id]
    spin_ang = shard_spin[best_id]
    z_sc = shard_z_scale[best_id]

    rel_x = (nx - cx_curr) / z_sc
    rel_y = (ny - cy_curr) / z_sc
    cos_a = np.cos(-spin_ang)
    sin_a = np.sin(-spin_ang)
    rot_x = rel_x * cos_a - rel_y * sin_a
    rot_y = rel_x * sin_a + rel_y * cos_a

    src_nx = cx_orig + rot_x
    src_ny = cy_orig + rot_y
    src_x_px = ((src_nx + 1.0) * 0.5) * (w - 1)
    src_y_px = ((src_ny + 1.0) * 0.5) * (h - 1)

    # Pre-build 8 cross-faded + palette-enhanced Stark variant banks from the 16 variants of the same image
    step_base = int(math.floor(t * 6.0))
    n_banks = 8
    bank_rgbs: list[np.ndarray] = []
    for b_idx in range(n_banks):
        va = variants[(step_base + b_idx * 2) % num_v]
        vb = variants[(step_base + b_idx * 2 + 5) % num_v]
        local_f = float(np.clip(v_fade + 0.15 * math.sin(b_idx + t * 2.0), 0.0, 1.0))
        blended = crossfade_variants(va, vb, variant_fade=local_f, fade_mode=fade_mode, palette_rgb=pal)
        enh = enhance_palette_colours(
            blended,
            palette_name=palette_name,
            palette_index=p_idx,
            palette_boost=p_boost,
            bloom_strength=b_str * 0.45,
            beat_pulse=bp,
        )
        bank_rgbs.append(enh)

    # If blast == 0.0 (breakdown unity), all shards lock to bank 0 so the image reforms seamlessly!
    shard_bank_idx = (best_id % n_banks) if blast > 1e-4 else np.zeros_like(best_id)

    sampled_shatter = np.zeros((h, w, 3), dtype=np.float32)
    in_bounds_mask = np.zeros((h, w), dtype=bool)
    for b_idx in range(n_banks):
        sel = shard_bank_idx == b_idx
        if not np.any(sel):
            continue
        samp_b, val_b = _bilinear_sample_pixel_coords(bank_rgbs[b_idx], src_x_px, src_y_px, wrap=False)
        sampled_shatter[sel] = samp_b[sel]
        in_bounds_mask[sel] = val_b[sel]

    valid_shard_px = inside_shard & in_bounds_mask

    # Apply 3D facet tilt lighting per shard + glowing palette crystal bevels
    facet_shade = np.clip(0.86 + 0.28 * np.cos(spin_ang * 2.0) * z_sc, 0.65, 1.22)
    bevel_pal = pal[best_id % len(pal)]
    shard_lit_rgb = np.clip(
        sampled_shatter * facet_shade[:, :, None]
        + bevel_pal * (bevel_edge * (0.75 + 0.55 * bp))[:, :, None],
        0.0,
        1.0,
    )

    shard_sector_alpha = compute_sector_alpha(
        shard_lit_rgb,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=bv_floor,
        black_opacity=b_op,
        mid_opacity=m_op,
        white_opacity=w_op,
        colour_opacity=c_op,
    )
    shard_alpha = shard_sector_alpha * valid_shard_px.astype(np.float32)

    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-14.0, yaw_deg=18.0, beat_pulse=bp)
    # Add glowing fracture plasma inside the inter-shard cracks
    crack_glow = (~inside_shard).astype(np.float32) * np.exp(-border_delta * 38.0) * (0.55 + 0.45 * bp)
    backdrop_with_cracks = np.clip(
        backdrop + pal[0][None, None, :] * crack_glow[:, :, None],
        0.0,
        1.0,
    )

    canvas = backdrop_with_cracks * (1.0 - shard_alpha[:, :, None]) + shard_lit_rgb * shard_alpha[:, :, None]
    accum_alpha = np.clip(shard_alpha + crack_glow * 0.45 * max(w_op, c_op), 0.0, 1.0)

    return finalise_motion_frame(
        canvas, accum_alpha, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


def effect_m15_48_band_fft_ribbon_slicer(
    bundle: dict[str, Any] | list[np.ndarray] | Image.Image,
    *,
    time_s: float = 1.60,
    beat_pulse: float = 0.90,
    ribbon_count: int = 48,
    orientation: str = "vertical",
    fft_bands: list[float] | np.ndarray | None = None,
    palette_name: str = "Cyber Neon",
    palette_index: int | None = None,
    palette_boost: float = 1.46,
    bloom_strength: float = 0.44,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.40,
    fade_mode: str = "palette_key",
    sector_alpha_mode: str = "black_void_transparent",
    black_opacity: float = 1.0,
    mid_opacity: float = 1.0,
    white_opacity: float = 1.0,
    colour_opacity: float = 1.0,
    return_rgba: bool = False,
    **kwargs: Any,
) -> Image.Image:
    """M15: 48-Band FFT Ribbon Slicer.

    Slices the photograph into 48 vertical or horizontal ribbons mapped 1:1 to
    Bandarchy's 48 Cava FFT spectrum bars, displacing each strip in 3D depth and
    shear, cycling its Stark effect variant (`01..16`) on spectral peaks with
    smooth variant cross-fading, and igniting palette-matched colours.
    """
    b = _normalise_bundle_input(bundle)
    w, h = b["width"], b["height"]
    variants: list[np.ndarray] = b["ordered_list"]
    num_v = len(variants)

    t = _clamp_finite(time_s, -1e5, 1e5, 1.60)
    bp = _clamp_finite(beat_pulse, 0.0, 1.5, 0.90)
    n_ribbons = _clamp_int(ribbon_count, 8, 96, 48)
    v_fade = _clamp_finite(variant_fade, 0.0, 1.0, 0.40)
    p_idx = _safe_palette_index(palette_index)
    p_boost = _clamp_finite(palette_boost, 0.0, 5.0, 1.46)
    b_str = _clamp_finite(bloom_strength, 0.0, 2.0, 0.44)
    bv_floor = _clamp_finite(kwargs.get("black_void_floor"), 0.0, 1.0, 0.22)
    is_horiz = str(orientation or "vertical").strip().lower().startswith("h")

    raw_spec = generate_48_band_spectrum(time_s=t, beat_pulse=bp, fft_bands=fft_bands)
    if n_ribbons == 48:
        spec = raw_spec
    else:
        spec = np.interp(
            np.linspace(0, 47, n_ribbons),
            np.arange(48, dtype=np.float32),
            raw_spec,
        ).astype(np.float32)

    pal = get_palette_rgb_matrix(palette_name, palette_index=p_idx)
    master_opacity = _resolve_opacity(
        opacity=opacity,
        fade_mix=fade_mix,
        photo_opacity=kwargs.get("photo_opacity"),
    )
    b_op, m_op, w_op, c_op = _resolve_sector_opacities(
        black_opacity=black_opacity,
        mid_opacity=mid_opacity,
        white_opacity=white_opacity,
        colour_opacity=colour_opacity,
        photo_black_opacity=kwargs.get("photo_black_opacity"),
        photo_mid_opacity=kwargs.get("photo_mid_opacity"),
        photo_white_opacity=kwargs.get("photo_white_opacity"),
        photo_colour_snatch_opacity=kwargs.get("photo_colour_snatch_opacity"),
    )

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    if is_horiz:
        primary_coord = yy / max(h - 1, 1)  # [0, 1] across ribbons
        along_coord = xx / max(w - 1, 1)    # [0, 1] along each ribbon
    else:
        primary_coord = xx / max(w - 1, 1)  # [0, 1] across 48 vertical columns
        along_coord = yy / max(h - 1, 1)    # [0, 1] along each vertical ribbon

    scaled_rib = np.clip(primary_coord * n_ribbons, 0.0, float(n_ribbons - 1e-4))
    rib_idx = np.floor(scaled_rib).astype(np.int32)
    rib_frac = scaled_rib - rib_idx  # [0, 1) local position across ribbon width

    energy = spec[rib_idx]  # (H, W) live FFT bar energy in [0, 1]
    alt_sign = np.where((rib_idx % 2) == 0, 1.0, -1.0).astype(np.float32)

    # 1. 3D Z-depth displacement per ribbon: high-energy FFT ribbons surge toward the camera
    # (`z_scale > 1.0`), magnifying their local texture and casting depth shadows at ribbon seams
    z_scale = 0.88 + 0.34 * energy
    # 2. Shear displacement along the ribbon axis driven by FFT energy & alternating polarity
    shear_offset = alt_sign * (energy - 0.32) * (0.14 + 0.08 * bp)
    new_along = (along_coord - 0.5) / z_scale + 0.5 + shear_offset
    new_primary = (rib_idx.astype(np.float32) + (rib_frac - 0.5) / z_scale + 0.5) / float(n_ribbons)

    if is_horiz:
        samp_x = new_along * (w - 1)
        samp_y = new_primary * (h - 1)
    else:
        samp_x = new_primary * (w - 1)
        samp_y = new_along * (h - 1)

    # Build 8 spectral-tier Stark variant blends so low/mid/high energy ribbons cycle across the 16 variants
    step_base = int(math.floor(t * 7.0))
    n_tiers = 8
    tier_banks: list[np.ndarray] = []
    for k in range(n_tiers):
        va = variants[(step_base + k * 2) % num_v]
        vb = variants[(step_base + k * 2 + 7) % num_v]
        tier_fade = float(np.clip(v_fade + 0.12 * (k - 3.5), 0.0, 1.0))
        blended = crossfade_variants(va, vb, variant_fade=tier_fade, fade_mode=fade_mode, palette_rgb=pal)
        enh = enhance_palette_colours(
            blended,
            palette_name=palette_name,
            palette_index=p_idx,
            palette_boost=p_boost * (0.85 + 0.08 * k),
            bloom_strength=b_str * 0.45,
            beat_pulse=bp,
        )
        tier_banks.append(enh)

    # Continuous cross-fade between adjacent spectral tiers based on ribbon energy + ribbon index
    continuous_tier = np.clip(energy * (n_tiers - 1.01) + (rib_idx % 3) * 0.65, 0.0, float(n_tiers - 1.001))
    tier_lo = np.floor(continuous_tier).astype(np.int32)
    tier_hi = np.minimum(tier_lo + 1, n_tiers - 1)
    tier_mix = (continuous_tier - tier_lo).astype(np.float32)[:, :, None]

    sampled_lo = np.zeros((h, w, 3), dtype=np.float32)
    sampled_hi = np.zeros((h, w, 3), dtype=np.float32)
    valid_mask = np.zeros((h, w), dtype=bool)

    for k in range(n_tiers):
        sel_lo = tier_lo == k
        sel_hi = tier_hi == k
        if not (np.any(sel_lo) or np.any(sel_hi)):
            continue
        samp_k, val_k = _bilinear_sample_pixel_coords(tier_banks[k], samp_x, samp_y, wrap=False)
        if np.any(sel_lo):
            sampled_lo[sel_lo] = samp_k[sel_lo]
            valid_mask[sel_lo] = val_k[sel_lo]
        if np.any(sel_hi):
            sampled_hi[sel_hi] = samp_k[sel_hi]

    ribbon_rgb = (1.0 - tier_mix) * sampled_lo + tier_mix * sampled_hi

    # Palette colour ignition on peak FFT ribbons + glowing neon ribbon divider seams
    rib_pal_col = pal[rib_idx % len(pal)]
    seam_dist = np.minimum(rib_frac, 1.0 - rib_frac)
    seam_glow = np.exp(-(seam_dist / 0.085) ** 2) * (0.35 + 0.65 * energy)
    seam_core = (seam_dist < 0.032).astype(np.float32) * 0.55

    # Subtle 3D cylindrical shading across each ribbon + FFT peak palette overdrive
    cyl_shade = 0.82 + 0.26 * np.sin(rib_frac * math.pi)
    peak_ignite = f1.smoothstep(0.58, 0.92, energy) * (0.28 + 0.22 * bp)
    ribbon_lit = (
        ribbon_rgb * cyl_shade[:, :, None] * (1.0 - seam_core[:, :, None])
        + rib_pal_col * (seam_glow * 0.75 + peak_ignite * 0.45)[:, :, None]
    )
    ribbon_lit = np.clip(ribbon_lit, 0.0, 1.0)

    # Apply mild 3D camera perspective tilt so the 48-band ribbon wall sits dynamically in 3D space
    sec_alpha = compute_sector_alpha(
        ribbon_lit,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=bv_floor,
        black_opacity=b_op,
        mid_opacity=m_op,
        white_opacity=w_op,
        colour_opacity=c_op,
    ) * valid_mask.astype(np.float32)

    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-10.0, yaw_deg=12.0, beat_pulse=bp)
    proj_rgb, proj_a, _, _, _ = project_3d_plane(
        ribbon_lit,
        w,
        h,
        pitch_deg=-9.0 + 4.0 * math.sin(t * 1.4),
        yaw_deg=11.0 * math.cos(t * 1.1),
        roll_deg=-2.5,
        tx=0.0,
        ty=0.0,
        tz=1.64 - 0.10 * bp,
        scale_x=1.08,
        scale_y=0.82,
        fov_deg=54.0,
        border_rgb=pal[0],
        border_width=0.032,
        plane_alpha_map=sec_alpha,
    )

    canvas = backdrop * (1.0 - proj_a[:, :, None]) + proj_rgb * proj_a[:, :, None]
    return finalise_motion_frame(
        canvas, proj_a, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


def effect_m16_prismatic_palette_channel_orbit(
    bundle: dict[str, Any] | list[np.ndarray] | Image.Image,
    *,
    time_s: float = 1.75,
    beat_pulse: float = 0.86,
    orbit_radius: float = 0.16,
    downbeat_snap: float = 0.0,
    palette_name: str = "Holographic Prism",
    palette_index: int | None = None,
    palette_boost: float = 1.50,
    bloom_strength: float = 0.48,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.42,
    fade_mode: str = "smoothstep",
    sector_alpha_mode: str = "black_void_transparent",
    black_opacity: float = 1.0,
    mid_opacity: float = 1.0,
    white_opacity: float = 1.0,
    colour_opacity: float = 1.0,
    return_rgba: bool = False,
    **kwargs: Any,
) -> Image.Image:
    """M16: Prismatic Palette Channel Orbit.

    Separates the image into 4 spectral/palette-matched colour & luminance layers
    that orbit the centre in phase-locked Lissajous trajectories (`(1:2)`, `(2:3)`,
    `(3:2)`, `(3:4)` frequency ratios), creating psychedelic prismatic ghosting
    that snaps into razor-sharp registration on bar downbeats (`downbeat_snap -> 1.0`).
    """
    b = _normalise_bundle_input(bundle)
    w, h = b["width"], b["height"]
    variants: list[np.ndarray] = b["ordered_list"]
    num_v = len(variants)

    t = _clamp_finite(time_s, -1e5, 1e5, 1.75)
    bp = _clamp_finite(beat_pulse, 0.0, 1.5, 0.86)
    rad = _clamp_finite(orbit_radius, 0.0, 0.65, 0.16)
    snap = _clamp_finite(downbeat_snap, 0.0, 1.0, 0.0)
    v_fade = _clamp_finite(variant_fade, 0.0, 1.0, 0.42)
    p_idx = _safe_palette_index(palette_index)
    p_boost = _clamp_finite(palette_boost, 0.0, 5.0, 1.50)
    b_str = _clamp_finite(bloom_strength, 0.0, 2.0, 0.48)
    bv_floor_arg = kwargs.get("black_void_floor")

    pal = get_palette_rgb_matrix(palette_name, palette_index=p_idx)
    master_opacity = _resolve_opacity(
        opacity=opacity,
        fade_mix=fade_mix,
        photo_opacity=kwargs.get("photo_opacity"),
    )
    b_op, m_op, w_op, c_op = _resolve_sector_opacities(
        black_opacity=black_opacity,
        mid_opacity=mid_opacity,
        white_opacity=white_opacity,
        colour_opacity=colour_opacity,
        photo_black_opacity=kwargs.get("photo_black_opacity"),
        photo_mid_opacity=kwargs.get("photo_mid_opacity"),
        photo_white_opacity=kwargs.get("photo_white_opacity"),
        photo_colour_snatch_opacity=kwargs.get("photo_colour_snatch_opacity"),
    )

    orbit_envelope = (1.0 - snap) * rad * (0.70 + 0.45 * bp)
    step_base = int(math.floor(t * 5.0))

    # 4 Lissajous harmonic ratios (fx, fy, phase_delta, variant_offset_a, variant_offset_b)
    lissajous_specs = [
        (1.0, 2.0, 0.0, 0, 4),
        (2.0, 3.0, math.pi * 0.5, 3, 11),
        (3.0, 2.0, math.pi * 1.0, 7, 13),
        (3.0, 4.0, math.pi * 1.5, 12, 15),
    ]

    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-12.0, yaw_deg=16.0, beat_pulse=bp)
    canvas = backdrop.copy()
    accum_alpha = np.zeros((h, w), dtype=np.float32)

    for k, (fx, fy, delta, off_a, off_b) in enumerate(lissajous_specs):
        va = variants[(step_base + off_a) % num_v]
        vb = variants[(step_base + off_b) % num_v]
        blended = crossfade_variants(
            va,
            vb,
            variant_fade=float(np.clip(v_fade + 0.1 * k * (1.0 - snap), 0.0, 1.0)),
            fade_mode=fade_mode,
            palette_rgb=pal,
        )
        enh = enhance_palette_colours(
            blended,
            palette_name=palette_name,
            palette_index=p_idx,
            palette_boost=p_boost,
            bloom_strength=b_str * (0.65 if k == 3 else 0.35),
            beat_pulse=bp,
        )

        blk_w, mid_w, wht_w, col_w, luma_k, _ = decompose_tonal_and_colour_sectors(enh)
        layer_tint = pal[k % len(pal)]

        if k < 3:
            # Spectral/Palette chromatic channel ghost tinted with `pal[k]`
            channel_weight = np.clip(0.35 * mid_w + 0.85 * wht_w + 1.0 * col_w, 0.0, 1.0)
            layer_rgb = np.clip(
                enh * 0.45 + layer_tint[None, None, :] * (luma_k * 0.85 + col_w * 0.55)[:, :, None],
                0.0,
                1.0,
            )
            layer_op = 0.62 if snap < 0.95 else 0.85
        else:
            # Layer 3: Anchor structural spine (obsidian + chalk + snatched neon)
            channel_weight = np.ones_like(luma_k)
            layer_rgb = enh
            layer_op = 0.88

        default_fl = 0.14 if k < 3 else 0.26
        fl_k = _clamp_finite(bv_floor_arg, 0.0, 1.0, default_fl) if bv_floor_arg is not None else default_fl
        sec_a = compute_sector_alpha(
            layer_rgb,
            opacity=layer_op,
            sector_alpha_mode=sector_alpha_mode,
            black_void_floor=fl_k,
            black_opacity=b_op,
            mid_opacity=m_op,
            white_opacity=w_op,
            colour_opacity=c_op,
        ) * channel_weight

        # Lissajous 3D trajectory (collapses to identical 0.0 centre when `downbeat_snap == 1.0`)
        omega = t * 2.2
        tx_k = orbit_envelope * 1.45 * math.sin(fx * omega + delta)
        ty_k = orbit_envelope * 1.05 * math.cos(fy * omega + delta)
        tz_k = 1.78 + (1.0 - snap) * 0.18 * (2 - k)
        pitch_k = -12.0 + (1.0 - snap) * 9.0 * math.sin(omega + k)
        yaw_k = 14.0 + (1.0 - snap) * 12.0 * math.cos(omega - k)
        roll_k = (1.0 - snap) * 6.5 * math.sin(omega * 0.8 + k * 1.2)

        proj_rgb, proj_a, _, _, _ = project_3d_plane(
            layer_rgb,
            w,
            h,
            pitch_deg=pitch_k,
            yaw_deg=yaw_k,
            roll_deg=roll_k,
            tx=tx_k,
            ty=ty_k,
            tz=tz_k,
            scale_x=0.98,
            scale_y=0.76,
            fov_deg=54.0,
            border_rgb=layer_tint,
            border_width=0.030,
            plane_alpha_map=sec_a,
        )

        # Additive-screen prismatic ghost blending for layers 0..2, crisp over-blend for anchor spine
        if k < 3 and snap < 0.99:
            screen_rgb = 1.0 - (1.0 - canvas) * (1.0 - proj_rgb * proj_a[:, :, None] * 0.85)
            canvas = canvas * (1.0 - proj_a[:, :, None] * 0.55) + screen_rgb * (proj_a[:, :, None] * 0.55)
        else:
            canvas = canvas * (1.0 - proj_a[:, :, None]) + proj_rgb * proj_a[:, :, None]
        accum_alpha = np.clip(accum_alpha + proj_a * (1.0 - accum_alpha), 0.0, 1.0)

    canvas = np.clip(canvas, 0.0, 1.0)
    return finalise_motion_frame(
        canvas, accum_alpha, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


def effect_m17_venetian_louvre_3d_flip_strobe(
    bundle: dict[str, Any] | list[np.ndarray] | Image.Image,
    *,
    time_s: float = 1.50,
    beat_pulse: float = 0.90,
    slat_count: int = 16,
    orientation: str = "vertical",
    palette_name: str = "Berlin Strobe",
    palette_index: int | None = None,
    palette_boost: float = 1.48,
    bloom_strength: float = 0.45,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.35,
    fade_mode: str = "luma_wipe",
    sector_alpha_mode: str = "black_void_transparent",
    black_opacity: float = 1.0,
    mid_opacity: float = 1.0,
    white_opacity: float = 1.0,
    colour_opacity: float = 1.0,
    return_rgba: bool = False,
    **kwargs: Any,
) -> Image.Image:
    """M17: Venetian Louvre 3D Flip Strobe.

    Slices the image into 3D rotating louvre slats that flip 180° in sequence across
    the screen—displaying one Stark effect variant (`01..16`) on the front face and
    a contrasting Stark effect variant of the same image on the reverse face, with
    true 3D perspective slat foreshortening and glowing palette-coloured slat edges.
    """
    b = _normalise_bundle_input(bundle)
    w, h = b["width"], b["height"]
    variants: list[np.ndarray] = b["ordered_list"]
    num_v = len(variants)

    t = _clamp_finite(time_s, -1e5, 1e5, 1.50)
    bp = _clamp_finite(beat_pulse, 0.0, 1.5, 0.90)
    n_slats = _clamp_int(slat_count, 4, 64, 16)
    v_fade = _clamp_finite(variant_fade, 0.0, 1.0, 0.35)
    p_idx = _safe_palette_index(palette_index)
    p_boost = _clamp_finite(palette_boost, 0.0, 5.0, 1.48)
    b_str = _clamp_finite(bloom_strength, 0.0, 2.0, 0.45)
    bv_floor = _clamp_finite(kwargs.get("black_void_floor"), 0.0, 1.0, 0.22)
    is_horiz = str(orientation or "vertical").strip().lower().startswith("h")

    pal = get_palette_rgb_matrix(palette_name, palette_index=p_idx)
    master_opacity = _resolve_opacity(
        opacity=opacity,
        fade_mix=fade_mix,
        photo_opacity=kwargs.get("photo_opacity"),
    )
    b_op, m_op, w_op, c_op = _resolve_sector_opacities(
        black_opacity=black_opacity,
        mid_opacity=mid_opacity,
        white_opacity=white_opacity,
        colour_opacity=colour_opacity,
        photo_black_opacity=kwargs.get("photo_black_opacity"),
        photo_mid_opacity=kwargs.get("photo_mid_opacity"),
        photo_white_opacity=kwargs.get("photo_white_opacity"),
        photo_colour_snatch_opacity=kwargs.get("photo_colour_snatch_opacity"),
    )

    step_base = int(math.floor(t * 4.0))
    # Build Front-Face and Reverse-Face Stark textures (plus cross-fade support)
    front_a = variants[step_base % num_v]
    front_b = variants[(step_base + 3) % num_v]
    back_a = variants[(step_base + 8) % num_v]
    back_b = variants[(step_base + 12) % num_v]

    front_tex = enhance_palette_colours(
        crossfade_variants(front_a, front_b, variant_fade=v_fade, fade_mode=fade_mode, palette_rgb=pal),
        palette_name=palette_name,
        palette_index=p_idx,
        palette_boost=p_boost,
        bloom_strength=b_str * 0.45,
        beat_pulse=bp,
    )
    back_tex = enhance_palette_colours(
        crossfade_variants(back_a, back_b, variant_fade=v_fade, fade_mode=fade_mode, palette_rgb=pal),
        palette_name=palette_name,
        palette_index=p_idx,
        palette_boost=p_boost * 1.1,
        bloom_strength=b_str * 0.55,
        beat_pulse=bp,
    )
    # Also prepare a secondary pair of front/back variants so alternating slats strobe across 4 distinct variants
    front_alt = enhance_palette_colours(
        variants[(step_base + 5) % num_v],
        palette_name=palette_name,
        palette_index=p_idx,
        palette_boost=p_boost,
        bloom_strength=b_str * 0.35,
        beat_pulse=bp,
    )
    back_alt = enhance_palette_colours(
        variants[(step_base + 14) % num_v],
        palette_name=palette_name,
        palette_index=p_idx,
        palette_boost=p_boost,
        bloom_strength=b_str * 0.45,
        beat_pulse=bp,
    )

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    if is_horiz:
        across = yy / max(h - 1, 1)
        along = xx / max(w - 1, 1)
    else:
        across = xx / max(w - 1, 1)
        along = yy / max(h - 1, 1)

    scaled_slat = np.clip(across * n_slats, 0.0, float(n_slats - 1e-4))
    slat_idx = np.floor(scaled_slat).astype(np.int32)
    local_u = (scaled_slat - slat_idx) * 2.0 - 1.0  # [-1, 1] across the slat width

    # Travelling flip wave across the slats so some slats show their front face (`cos > 0`),
    # some are mid-flip at oblique 3D angles, and others have flipped 180° to their reverse face (`cos < 0`)
    theta = t * 2.6 - slat_idx.astype(np.float32) * (math.pi * 1.65 / max(n_slats, 1)) + bp * 0.55
    cos_t = np.cos(theta).astype(np.float32)
    sin_t = np.sin(theta).astype(np.float32)

    # Projected apparent half-width of the rotating 3D slat in [-1, 1] slot space
    proj_half_w = np.clip(np.abs(cos_t), 0.16, 0.98)
    hit_slat = np.abs(local_u) <= proj_half_w
    # Thickness edge bevel right outside `proj_half_w` where the slat's 3D rim catches neon light
    rim_band = (np.abs(local_u) > proj_half_w * 0.84) & (np.abs(local_u) <= np.minimum(proj_half_w + 0.11, 1.0))

    # Surface coordinate `u_surf in [-1, 1]` on the slat face (inverted when flipped to the reverse face)
    u_surf = np.clip(local_u / np.where(cos_t >= 0.0, proj_half_w, -proj_half_w), -1.0, 1.0)
    # 3D perspective keystone foreshortening along the slat length (`z_local = u_surf * sin_t`)
    z_local = u_surf * sin_t * 0.24
    v_surf = (along - 0.5) * (1.0 + z_local) + 0.5

    tex_across = (slat_idx.astype(np.float32) + (u_surf + 1.0) * 0.5) / float(n_slats)
    if is_horiz:
        sx = v_surf * (w - 1)
        sy = tex_across * (h - 1)
    else:
        sx = tex_across * (w - 1)
        sy = v_surf * (h - 1)

    samp_front, val_f = _bilinear_sample_pixel_coords(front_tex, sx, sy, wrap=False)
    samp_back, val_b = _bilinear_sample_pixel_coords(back_tex, sx, sy, wrap=False)
    samp_front_alt, _ = _bilinear_sample_pixel_coords(front_alt, sx, sy, wrap=False)
    samp_back_alt, _ = _bilinear_sample_pixel_coords(back_alt, sx, sy, wrap=False)

    is_odd_slat = ((slat_idx % 2) == 1)[:, :, None]
    f_combined = np.where(is_odd_slat, 0.65 * samp_front + 0.35 * samp_front_alt, samp_front)
    b_combined = np.where(is_odd_slat, 0.65 * samp_back + 0.35 * samp_back_alt, samp_back)

    is_front_face = (cos_t >= 0.0)[:, :, None]
    slat_rgb = np.where(is_front_face, f_combined, b_combined)
    valid_slat = hit_slat & np.where(cos_t >= 0.0, val_f, val_b)

    # 3D Lambertian + specular lighting across each rotating slat + glowing palette slat edge bevels
    lambert = 0.55 + 0.45 * np.abs(cos_t)
    specular = (np.abs(sin_t) ** 3) * 0.32 * bp
    edge_col = pal[slat_idx % len(pal)]
    edge_glow = np.exp(-((np.abs(local_u) - proj_half_w) / 0.09) ** 2) * (0.55 + 0.45 * np.abs(sin_t))

    slat_lit = np.clip(
        slat_rgb * lambert[:, :, None]
        + edge_col * (specular[:, :, None] + edge_glow[:, :, None] * 0.85),
        0.0,
        1.0,
    )

    sec_alpha = compute_sector_alpha(
        slat_lit,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=bv_floor,
        black_opacity=b_op,
        mid_opacity=m_op,
        white_opacity=w_op,
        colour_opacity=c_op,
    )
    active_alpha = np.clip(
        sec_alpha * valid_slat.astype(np.float32) + rim_band.astype(np.float32) * 0.82 * max(w_op, c_op),
        0.0,
        1.0,
    )

    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-14.0, yaw_deg=18.0, beat_pulse=bp)
    canvas = backdrop * (1.0 - active_alpha[:, :, None]) + slat_lit * active_alpha[:, :, None]

    return finalise_motion_frame(
        canvas, active_alpha, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


def effect_m18_quantum_swarm_sector_dissolve(
    bundle: dict[str, Any] | list[np.ndarray] | Image.Image,
    *,
    time_s: float = 1.85,
    beat_pulse: float = 0.92,
    curl_strength: float = 1.0,
    swarm_steps: int = 10,
    palette_name: str = "Bioluminescence",
    palette_index: int | None = None,
    palette_boost: float = 1.52,
    bloom_strength: float = 0.50,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.48,
    fade_mode: str = "luma_wipe",
    sector_alpha_mode: str = "black_void_transparent",
    black_opacity: float = 1.0,
    mid_opacity: float = 1.0,
    white_opacity: float = 1.0,
    colour_opacity: float = 1.0,
    return_rgba: bool = False,
    **kwargs: Any,
) -> Image.Image:
    """M18: Quantum Swarm Sector Dissolve.

    Dissolves the bright white and colour-snatched sectors into swirling divergence-free
    curl-noise particle streams (`u = dPsi/dy, v = -dPsi/dx`) while the underlying stark
    silhouette morphs continuously between the 16 processed variants of the same image.
    """
    b = _normalise_bundle_input(bundle)
    w, h = b["width"], b["height"]
    variants: list[np.ndarray] = b["ordered_list"]
    num_v = len(variants)

    t = _clamp_finite(time_s, -1e5, 1e5, 1.85)
    bp = _clamp_finite(beat_pulse, 0.0, 1.5, 0.92)
    c_str = _clamp_finite(curl_strength, 0.0, 3.0, 1.0) * (0.65 + 0.50 * bp)
    n_steps = _clamp_int(swarm_steps, 3, 20, 10)
    v_fade = _clamp_finite(variant_fade, 0.0, 1.0, 0.48)
    p_idx = _safe_palette_index(palette_index)
    p_boost = _clamp_finite(palette_boost, 0.0, 5.0, 1.52)
    b_str = _clamp_finite(bloom_strength, 0.0, 2.0, 0.50)
    bv_floor = _clamp_finite(kwargs.get("black_void_floor"), 0.0, 1.0, 0.20)

    pal = get_palette_rgb_matrix(palette_name, palette_index=p_idx)
    master_opacity = _resolve_opacity(
        opacity=opacity,
        fade_mix=fade_mix,
        photo_opacity=kwargs.get("photo_opacity"),
    )
    b_op, m_op, w_op, c_op = _resolve_sector_opacities(
        black_opacity=black_opacity,
        mid_opacity=mid_opacity,
        white_opacity=white_opacity,
        colour_opacity=colour_opacity,
        photo_black_opacity=kwargs.get("photo_black_opacity"),
        photo_mid_opacity=kwargs.get("photo_mid_opacity"),
        photo_white_opacity=kwargs.get("photo_white_opacity"),
        photo_colour_snatch_opacity=kwargs.get("photo_colour_snatch_opacity"),
    )

    # 1. Morph the stark silhouette across the 16 variants of the same source image
    step_idx = int(math.floor(t * 4.5))
    sil_a = variants[step_idx % num_v]
    sil_b = variants[(step_idx + 6) % num_v]
    swarm_src_v = variants[(step_idx + 12) % num_v]

    morphed_silhouette = crossfade_variants(
        sil_a, sil_b, variant_fade=v_fade, fade_mode=fade_mode, palette_rgb=pal
    )
    swarm_source = enhance_palette_colours(
        crossfade_variants(morphed_silhouette, swarm_src_v, variant_fade=0.5, fade_mode="palette_key", palette_rgb=pal),
        palette_name=palette_name,
        palette_index=p_idx,
        palette_boost=p_boost,
        bloom_strength=b_str * 0.45,
        beat_pulse=bp,
    )

    blk_w, mid_w, wht_w, col_w, luma_s, _ = decompose_tonal_and_colour_sectors(swarm_source)
    gy_s, gx_s = _safe_gradient_2d(luma_s)
    edge_s = np.clip(np.hypot(gx_s, gy_s) * 4.8, 0.0, 1.0)

    # 2. Analytical 2-octave divergence-free 2D curl-noise velocity field `(curl_x, curl_y)`
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx / max(w - 1, 1)) * 2.0 - 1.0
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0

    # Stream function Psi(nx, ny, t); curl velocity = (dPsi/dny, -dPsi/dnx)
    k1, k2 = 3.8, 7.8
    psi = (
        np.sin(k1 * nx + t * 1.5) * np.cos(k1 * ny - t * 1.2)
        + 0.48 * np.sin(k2 * nx - t * 2.3 + 1.1) * np.cos(k2 * ny + t * 1.9)
    ).astype(np.float32)
    dpsi_dy, dpsi_dx = _safe_gradient_2d(psi, 2.0 / max(h - 1, 1), 2.0 / max(w - 1, 1))
    vel_x = dpsi_dy * (w * 0.052 * c_str)
    vel_y = -dpsi_dx * (h * 0.052 * c_str)

    # Streamline filament comb so flat white areas dissolve into distinct swirling ribbons & sparks
    stream_ribbons = (0.5 + 0.5 * np.sin(psi * math.pi * 7.0 - t * 4.0)).astype(np.float32) ** 2.2
    dissolve_mask = np.clip(
        wht_w * w_op * (0.22 + 0.78 * np.maximum(edge_s, stream_ribbons))
        + col_w * c_op * (0.45 + 0.55 * np.maximum(edge_s, stream_ribbons))
        + edge_s * 0.65 * max(w_op, c_op),
        0.0,
        1.0,
    )
    emissive_seed_rgb = swarm_source * dissolve_mask[:, :, None]

    # Advect emissive sectors along curl streamlines and modulate with a sparkling quantum particle lattice
    accum_swarm = np.zeros((h, w, 3), dtype=np.float32)
    weight_sum = 0.0
    for s in range(1, n_steps + 1):
        frac_s = s / float(n_steps)
        sx = xx - vel_x * frac_s
        sy = yy - vel_y * frac_s
        samp_s, _ = _bilinear_sample_pixel_coords(emissive_seed_rgb, sx, sy, wrap=True)

        # Quantum particle cellular sparkle lattice along the advected streamline
        cell_phase = np.sin(sx * 0.36 + s * 1.9 + t * 6.0) * np.cos(sy * 0.36 - s * 1.4 - t * 5.0)
        spark_comb = (f1.smoothstep(0.28, 0.92, cell_phase) ** 1.6).astype(np.float32)
        tint_s = pal[s % len(pal)]

        step_rgb = (
            samp_s * (0.45 + 0.45 * spark_comb[:, :, None])
            + tint_s[None, None, :] * np.max(samp_s, axis=2, keepdims=True) * (0.35 + 0.65 * spark_comb[:, :, None])
        )
        decay = (1.0 - 0.60 * frac_s) ** 1.25
        accum_swarm += step_rgb * decay
        weight_sum += decay

    swarm_stream_rgb = (accum_swarm / max(weight_sum, 1e-4)) * (0.95 + 0.35 * bp)

    # Anchor silhouette keeps obsidian black and structural mid-tones crisp while white/colour sectors dissolve outward
    silhouette_base = (
        morphed_silhouette
        * (
            blk_w * b_op
            + mid_w * m_op * 0.88
            + wht_w * w_op * (0.28 + 0.35 * stream_ribbons)
            + col_w * c_op * 0.52
        )[:, :, None]
    )
    swarm_mag = np.max(swarm_stream_rgb, axis=2, keepdims=True)
    combined_rgb = np.clip(silhouette_base * (1.0 - 0.35 * swarm_mag) + swarm_stream_rgb, 0.0, 1.0)

    sec_alpha = compute_sector_alpha(
        combined_rgb,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=bv_floor,
        black_opacity=b_op,
        mid_opacity=m_op,
        white_opacity=w_op,
        colour_opacity=c_op,
    )

    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-12.0, yaw_deg=15.0, beat_pulse=bp)
    canvas = backdrop * (1.0 - sec_alpha[:, :, None]) + combined_rgb * sec_alpha[:, :, None]

    return finalise_motion_frame(
        canvas, sec_alpha, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


MOTION_GROUP3_DISPATCH: dict[str, Callable[..., Image.Image]] = {
    "M13_Tri_Sector_3D_Parallax_Separation": effect_m13_tri_sector_3d_parallax_separation,
    "M14_Voronoi_Crystal_Shatter_And_Reform": effect_m14_voronoi_crystal_shatter_and_reform,
    "M15_48_Band_FFT_Ribbon_Slicer": effect_m15_48_band_fft_ribbon_slicer,
    "M16_Prismatic_Palette_Channel_Orbit": effect_m16_prismatic_palette_channel_orbit,
    "M17_Venetian_Louvre_3D_Flip_Strobe": effect_m17_venetian_louvre_3d_flip_strobe,
    "M18_Quantum_Swarm_Sector_Dissolve": effect_m18_quantum_swarm_sector_dissolve,
}

GROUP3_DISPATCH_WITH_ALIASES: dict[str, Callable[..., Image.Image]] = {
    **MOTION_GROUP3_DISPATCH,
    **{
        alias: MOTION_GROUP3_DISPATCH[target]
        for alias, target in GROUP3_EFFECT_ALIASES.items()
    },
}

EFFECTS_GROUP_3 = MOTION_GROUP3_DISPATCH


def render_group3_effect(
    effect_name: str,
    bundle: dict[str, Any] | list[np.ndarray] | Image.Image,
    **kwargs: Any,
) -> Image.Image:
    """Dispatch and render a Group C effect by canonical ID, alias ID, or short code (`M13`..`M18`)."""
    canonical = resolve_group3_effect_name(effect_name)
    return MOTION_GROUP3_DISPATCH[canonical](bundle, **kwargs)


# ============================================================================
# Drop-in QML / Canvas / Shader Specifications for Bandarchy Visualiser.qml
# ============================================================================

GROUP_C_QML_SPECS: dict[str, dict[str, Any]] = {
    "M13_Tri_Sector_3D_Parallax_Separation": {
        "id": "M13_Tri_Sector_3D_Parallax_Separation",
        "code": "M13",
        "title": "Tri-Sector 3D Parallax Separation",
        "family": "Group C: Sector Separation, Chromatic Prism Split & Shatter Physics",
        "description": (
            "Physically separates the photograph's 3 tonal sectors (Obsidian Black, Mid-Tone "
            "Structure, and Stark White / Snatched Colour) into 3 floating 3D Z-planes that "
            "tilt, orbit, and parallax independently while strobing the mid and white sectors "
            "across the 16 Stark variants and boosting active Bandarchy palette colours."
        ),
        "audio_links": [
            {"source": "bassSmooth", "method": "Direct Value", "target": "sectorZSeparationDepth"},
            {"source": "beatPulse", "method": "Trigger / Step", "target": "midAndWhiteSectorVariantIndex"},
            {"source": "midSmooth", "method": "Phase Accumulator", "target": "sectorParallaxOrbitAngle"},
            {"source": "highSmooth", "method": "Direct Value", "target": "whiteAndColourSectorBloom"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.94},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.94},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.38},
            "blackOpacity": {"min": 0.0, "max": 1.0, "default": 0.90},
            "midOpacity": {"min": 0.0, "max": 1.0, "default": 0.95},
            "whiteOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "colourOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.22},
            "separation": {"min": 0.0, "max": 2.5, "default": 1.00},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.48},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M13: Tri-Sector 3D Parallax Separation
Repeater {
    model: 3 // 0: Obsidian Back Plane, 1: Mid-Tone Structure Plane, 2: White & Snatched Colour Front Plane
    delegate: Item {
        anchors.fill: parent
        property real sectorAlpha: index === 0 ? state.photoBlackOpacity : (index === 1 ? state.photoMidOpacity : Math.max(state.photoWhiteOpacity, state.photoColourOpacity))
        opacity: state.photoLayerOpacity * sectorAlpha
        property int planeVariantIdx: (state.beatCount * 2 + index * 5) % 16
        transform: [
            Rotation {
                origin.x: width * 0.5; origin.y: height * 0.5
                axis { x: 1; y: 0; z: 0 }
                angle: -18.0 + (index - 1) * 10.0 * state.bassSmooth
            },
            Rotation {
                origin.x: width * 0.5; origin.y: height * 0.5
                axis { x: 0; y: 1; z: 0 }
                angle: 22.0 + (index - 1) * 14.0 * Math.sin(state.time * 1.4)
            },
            Scale {
                origin.x: width * 0.5; origin.y: height * 0.5
                xScale: 0.78 + index * 0.14 * (0.7 + 0.5 * state.beatPulse)
                yScale: 0.78 + index * 0.14 * (0.7 + 0.5 * state.beatPulse)
            }
        ]
    }
}
""".strip(),
    },
    "M14_Voronoi_Crystal_Shatter_And_Reform": {
        "id": "M14_Voronoi_Crystal_Shatter_And_Reform",
        "code": "M14",
        "title": "Voronoi Crystal Shatter & Reform",
        "family": "Group C: Sector Separation, Chromatic Prism Split & Shatter Physics",
        "description": (
            "Fractures the photo plane into 48-64 Voronoi geometric shards that blast outward "
            "in 3D XYZ space with angular spin on kick/snare hits—each shard strobing through "
            "different Stark effect variants (01..16) of the same image—before smoothly "
            "reforming on breakdowns."
        ),
        "audio_links": [
            {"source": "beatPulse", "method": "Spring Impulse", "target": "voronoiShardBlastExplosion"},
            {"source": "dropVsBreakdown", "method": "Direct Value", "target": "shardReformCohesion"},
            {"source": "highSmooth", "method": "Trigger / Step", "target": "perShardVariantPermutation"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.95},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.95},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.36},
            "blackOpacity": {"min": 0.0, "max": 1.0, "default": 0.92},
            "midOpacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "whiteOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "colourOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.22},
            "shardCount": {"min": 48, "max": 64, "default": 56},
            "shatterExplosion": {"min": 0.0, "max": 1.5, "default": 0.85},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.45},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M14: Voronoi Crystal Shatter & Reform
Repeater {
    model: state.voronoiShardCount // 48..64 polygonal Voronoi shards
    delegate: Item {
        anchors.fill: parent
        opacity: state.photoLayerOpacity
        property real blast: state.dropVsBreakdown * (0.35 + 0.65 * state.beatPulse)
        property int shardVariantIdx: (index * 3 + state.beatCount) % 16
        rotation: blast * ((index % 7) - 3.0) * 18.0
        scale: 1.0 + blast * ((index % 5) - 2.0) * 0.12
    }
}
""".strip(),
    },
    "M15_48_Band_FFT_Ribbon_Slicer": {
        "id": "M15_48_Band_FFT_Ribbon_Slicer",
        "code": "M15",
        "title": "48-Band FFT Ribbon Slicer",
        "family": "Group C: Sector Separation, Chromatic Prism Split & Shatter Physics",
        "description": (
            "Slices the photo into 48 vertical or horizontal ribbons mapped 1:1 to Bandarchy's "
            "48 Cava FFT spectrum bars, displacing each strip in 3D depth, cycling its Stark "
            "effect variant on spectral peaks, and igniting palette-matched colours."
        ),
        "audio_links": [
            {"source": "spectrum[0..47]", "method": "Direct Value", "target": "ribbon3DDepthAndShear"},
            {"source": "spectrum[0..47]", "method": "Trigger / Step", "target": "ribbonPeakVariantIndex"},
            {"source": "beatPulse", "method": "Direct Value", "target": "ribbonSeamNeonIgnition"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.96},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.40},
            "blackOpacity": {"min": 0.0, "max": 1.0, "default": 0.92},
            "midOpacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "whiteOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "colourOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.22},
            "ribbonCount": {"min": 16, "max": 48, "default": 48},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.46},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M15: 48-Band FFT Ribbon Slicer
Repeater {
    model: 48
    delegate: Item {
        width: parent.width / 48.0
        height: parent.height
        x: index * width
        property real bandEnergy: state.spectrum[index] || 0.0
        property int ribbonVariantIdx: (Math.floor(bandEnergy * 12.0) + index + state.beatCount) % 16
        opacity: state.photoLayerOpacity * (0.75 + 0.25 * bandEnergy)
        y: ((index % 2 === 0) ? 1 : -1) * (bandEnergy - 0.3) * height * 0.14
        scale: 0.92 + 0.28 * bandEnergy
    }
}
""".strip(),
    },
    "M16_Prismatic_Palette_Channel_Orbit": {
        "id": "M16_Prismatic_Palette_Channel_Orbit",
        "code": "M16",
        "title": "Prismatic Palette Channel Orbit",
        "family": "Group C: Sector Separation, Chromatic Prism Split & Shatter Physics",
        "description": (
            "Separates the image into 4 spectral/palette-matched colour & luminance layers "
            "that orbit the centre in phase-locked Lissajous trajectories, creating psychedelic "
            "ghosting that snaps into razor-sharp unity on bar downbeats."
        ),
        "audio_links": [
            {"source": "midSmooth", "method": "Phase Accumulator", "target": "lissajousOrbitPhase"},
            {"source": "beatPulse", "method": "Inverse Snap", "target": "downbeatUnityLock"},
            {"source": "bassSmooth", "method": "Direct Value", "target": "orbitRadiusAmplitude"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.94},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.94},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.42},
            "blackOpacity": {"min": 0.0, "max": 1.0, "default": 0.90},
            "midOpacity": {"min": 0.0, "max": 1.0, "default": 0.95},
            "whiteOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "colourOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.20},
            "orbitRadius": {"min": 0.0, "max": 0.50, "default": 0.16},
            "downbeatSnap": {"min": 0.0, "max": 1.0, "default": 0.00},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.50},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M16: Prismatic Palette Channel Orbit
Repeater {
    model: 4 // 4 Lissajous spectral & palette channel layers
    delegate: Item {
        anchors.fill: parent
        property real snapFactor: 1.0 - state.downbeatSnap
        opacity: state.photoLayerOpacity * (index === 3 ? 0.88 : 0.62)
        x: snapFactor * Math.sin(state.time * (index + 1) * 1.6 + index * 1.57) * width * state.orbitRadius
        y: snapFactor * Math.cos(state.time * (index + 2) * 1.4 + index * 1.57) * height * state.orbitRadius
    }
}
""".strip(),
    },
    "M17_Venetian_Louvre_3D_Flip_Strobe": {
        "id": "M17_Venetian_Louvre_3D_Flip_Strobe",
        "code": "M17",
        "title": "Venetian Louvre 3D Flip Strobe",
        "family": "Group C: Sector Separation, Chromatic Prism Split & Shatter Physics",
        "description": (
            "Slices the image into 3D rotating louvre slats that flip 180 degrees in sequence "
            "across the screen—displaying one Stark effect variant on the front face and "
            "another Stark effect variant of the same image on the reverse face, with glowing "
            "palette-coloured slat edges."
        ),
        "audio_links": [
            {"source": "bassSmooth", "method": "Phase Accumulator", "target": "louvreFlipWaveSpeed"},
            {"source": "beatPulse", "method": "Trigger / Step", "target": "frontBackVariantPair"},
            {"source": "highSmooth", "method": "Direct Value", "target": "slatBevelEdgeGlow"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.95},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.95},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.35},
            "blackOpacity": {"min": 0.0, "max": 1.0, "default": 0.92},
            "midOpacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "whiteOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "colourOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.22},
            "slatCount": {"min": 6, "max": 36, "default": 16},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.48},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M17: Venetian Louvre 3D Flip Strobe
Repeater {
    model: state.louvreSlatCount
    delegate: Item {
        width: parent.width / state.louvreSlatCount
        height: parent.height
        x: index * width
        opacity: state.photoLayerOpacity
        property real flipAngle: (state.time * 150.0 - index * 22.5 + state.beatPulse * 45.0) % 360.0
        property bool isReverseFace: Math.cos(flipAngle * Math.PI / 180.0) < 0.0
        property int slatVariantIdx: isReverseFace ? ((state.beatCount + 8) % 16) : (state.beatCount % 16)
        transform: Rotation {
            origin.x: width * 0.5; origin.y: height * 0.5
            axis { x: 0; y: 1; z: 0 }
            angle: flipAngle
        }
    }
}
""".strip(),
    },
    "M18_Quantum_Swarm_Sector_Dissolve": {
        "id": "M18_Quantum_Swarm_Sector_Dissolve",
        "code": "M18",
        "title": "Quantum Swarm Sector Dissolve",
        "family": "Group C: Sector Separation, Chromatic Prism Split & Shatter Physics",
        "description": (
            "Dissolves the bright white and colour-snatched sectors into swirling curl-noise "
            "particle streams while the stark silhouette morphs between the 16 processed "
            "variants of the same image."
        ),
        "audio_links": [
            {"source": "midSmooth", "method": "Direct Value", "target": "curlNoiseSwarmTurbulence"},
            {"source": "beatPulse", "method": "Direct Value", "target": "quantumSparkEmission"},
            {"source": "bassSmooth", "method": "Direct Value", "target": "silhouetteMorphCrossfade"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.96},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.48},
            "blackOpacity": {"min": 0.0, "max": 1.0, "default": 0.92},
            "midOpacity": {"min": 0.0, "max": 1.0, "default": 0.95},
            "whiteOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "colourOpacity": {"min": 0.0, "max": 1.0, "default": 1.00},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.20},
            "curlStrength": {"min": 0.0, "max": 3.0, "default": 1.00},
            "swarmSteps": {"min": 4, "max": 18, "default": 10},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.52},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M18: Quantum Swarm Sector Dissolve
Item {
    id: m18QuantumSwarmLayer
    anchors.fill: parent
    opacity: state.photoLayerOpacity
    property real curlStrength: state.curlStrength * (0.65 + 0.55 * state.midSmooth)
    property real silhouetteVariantFade: state.photoVariantFade
}
""".strip(),
    },
}


# ============================================================================
# Contact Sheet & Showcase Preview Generator (Writes to ~/Pictures/bandarchy/Old/)
# ============================================================================


def render_group3_showcase_and_contact_sheet(
    category: str = "custom",
    source_stem: str | None = None,
    output_dir: str | None = None,
    contact_sheet_filename: str = "ContactSheet_Motion_Group3_Separation_Shatter.png",
) -> dict[str, Any]:
    """Render Group C (`M13`–`M18`) preview frames and build the comparison contact sheet.

    Writes all preview frames and `ContactSheet_Motion_Group3_Separation_Shatter.png` into
    `~/Pictures/bandarchy/Old/` so `categories/`, `processed/`, and `imported/` remain clean.
    """
    base_dir = bpi.resolve_pictures_bandarchy_dir()
    out_dir = output_dir or os.path.join(base_dir, "Old")
    os.makedirs(out_dir, exist_ok=True)

    bundle = load_source_16_variants(
        category=category,
        source_stem=source_stem,
        root_dir=base_dir,
        target_size=(800, 600),
    )
    stem = bundle["source_stem"]

    palettes_cycle = [
        "Omarchy Cyber",
        "Tokyo Synthwave",
        "Cyber Neon",
        "Holographic Prism",
        "Berlin Strobe",
        "Bioluminescence",
    ]

    rendered_frames: list[dict[str, Any]] = []
    effect_images: dict[str, Image.Image] = {}

    for idx, eff_name in enumerate(GROUP3_MOTION_EFFECTS):
        pal_name = palettes_cycle[idx % len(palettes_cycle)]
        fn = MOTION_GROUP3_DISPATCH[eff_name]
        im_out = fn(
            bundle,
            time_s=1.30 + idx * 0.25,
            beat_pulse=0.92,
            palette_name=pal_name,
            palette_boost=1.48,
            bloom_strength=0.46,
            opacity=0.96,
            variant_fade=0.40,
        )
        effect_images[eff_name] = im_out
        frame_filename = f"{eff_name}__{stem}.png"
        frame_path = os.path.join(out_dir, frame_filename)
        f1.atomic_save_png(im_out, frame_path)

        arr_hsv = np.asarray(im_out.convert("HSV"), dtype=np.float32) / 255.0
        rendered_frames.append(
            {
                "effect": eff_name,
                "title": GROUP_C_QML_SPECS[eff_name]["title"],
                "palette": pal_name,
                "category": category,
                "source_stem": stem,
                "output_path": frame_path,
                "mean_saturation": round(float(arr_hsv[:, :, 1].mean()), 4),
                "max_saturation": round(float(arr_hsv[:, :, 1].max()), 4),
            }
        )

    # Build a high-resolution 3x2 + top strip showcase Contact Sheet in Old/
    thumb_w, thumb_h = 520, 390
    pad_x, pad_y = 24, 24
    header_h = 195
    label_h = 56
    cols = 3
    rows = 2

    sheet_w = pad_x + cols * (thumb_w + pad_x)
    sheet_h = header_h + pad_y + rows * (thumb_h + label_h + pad_y)
    sheet = Image.new("RGB", (sheet_w, sheet_h), (7, 9, 14))
    draw = ImageDraw.Draw(sheet)

    try:
        font_title = ImageFont.truetype("/usr/share/fonts/TTF/DejaVuSans-Bold.ttf", 21)
        font_sub = ImageFont.truetype("/usr/share/fonts/TTF/DejaVuSans.ttf", 14)
        font_lbl = ImageFont.truetype("/usr/share/fonts/TTF/DejaVuSans-Bold.ttf", 14)
        font_small = ImageFont.truetype("/usr/share/fonts/TTF/DejaVuSans.ttf", 12)
    except OSError:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_lbl = ImageFont.load_default()
        font_small = ImageFont.load_default()

    draw.text(
        (pad_x, 16),
        "BANDARCHY STAGE-2 PHOTO MOTION - GROUP C (M13-M18): SECTOR SEPARATION, PRISM ORBIT & SHATTER",
        fill=(110, 231, 183),
        font=font_title,
    )
    draw.text(
        (pad_x, 46),
        f"Source Stem: {stem} ({category}) | Strobing across all 16 Stark Variants with Per-Sector Opacity, Variant Cross-Fade & Palette Bloom",
        fill=(203, 213, 225),
        font=font_sub,
    )

    # Top ribbon: miniature strip of the 16 pre-rendered Stark variants of the same image
    mini_w = (sheet_w - 2 * pad_x - 15 * 6) // 16
    mini_h = 78
    strip_y = 78
    for v_i, v_rgb in enumerate(bundle["ordered_list"]):
        v_im = Image.fromarray((v_rgb * 255.0).astype(np.uint8), mode="RGB")
        v_thumb = ImageOps.fit(v_im, (mini_w, mini_h), Image.Resampling.LANCZOS)
        mx = pad_x + v_i * (mini_w + 6)
        sheet.paste(v_thumb, (mx, strip_y))
        draw.rectangle([mx, strip_y, mx + mini_w - 1, strip_y + mini_h - 1], outline=(56, 189, 248), width=1)
        draw.text((mx + 3, strip_y + mini_h + 3), f"E{v_i + 1:02d}", fill=(148, 163, 184), font=font_small)

    # 3x2 grid of M13..M18
    for idx, eff_name in enumerate(GROUP3_MOTION_EFFECTS):
        r = idx // cols
        c = idx % cols
        cx = pad_x + c * (thumb_w + pad_x)
        cy = header_h + pad_y + r * (thumb_h + label_h + pad_y)

        im_thumb = ImageOps.fit(effect_images[eff_name], (thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(im_thumb, (cx, cy))
        draw.rectangle([cx, cy, cx + thumb_w - 1, cy + thumb_h - 1], outline=(110, 231, 183), width=2)

        spec = GROUP_C_QML_SPECS[eff_name]
        pal_name = palettes_cycle[idx % len(palettes_cycle)]
        clean_desc = spec["description"].replace("\u2013", "-").replace("\u2014", "-")
        draw.text(
            (cx + 6, cy + thumb_h + 6),
            f"{eff_name[:3]}: {spec['title']}  [Palette: {pal_name}]",
            fill=(244, 114, 182),
            font=font_lbl,
        )
        draw.text(
            (cx + 6, cy + thumb_h + 28),
            clean_desc[:76] + "...",
            fill=(203, 213, 225),
            font=font_small,
        )

    sheet_path = os.path.join(out_dir, contact_sheet_filename)
    f1.atomic_save_png(sheet, sheet_path)

    return {
        "ok": True,
        "group": "Group C (M13-M18): Sector Separation, Chromatic Prism Split & Shatter Physics",
        "category": category,
        "source_stem": stem,
        "variants_loaded": len(bundle["ordered_list"]),
        "effects_rendered": len(rendered_frames),
        "contact_sheet": sheet_path,
        "contact_sheet_path": sheet_path,
        "frames": rendered_frames,
    }


build_group3_contact_sheet = render_group3_showcase_and_contact_sheet


def resolve_group3_effect_name(name: str) -> str:
    """Resolve a canonical, aliased, or short-code (`M13`..`M18`) Group C effect name."""
    raw = str(name or "").strip()
    if raw in MOTION_GROUP3_DISPATCH:
        return raw
    if raw in GROUP3_EFFECT_ALIASES:
        return GROUP3_EFFECT_ALIASES[raw]
    upper = raw.upper()
    for eff in GROUP3_MOTION_EFFECTS:
        if eff.upper() == upper or eff[:3].upper() == upper:
            return eff
    for alias, target in GROUP3_EFFECT_ALIASES.items():
        if alias.upper() == upper:
            return target
    raise PhotoMotionError(f"Unknown Group C effect: {name}")


def main(argv: list[str] | None = None) -> int:
    short_codes = tuple(eff[:3] for eff in GROUP3_MOTION_EFFECTS)
    all_choices = tuple(list(GROUP3_MOTION_EFFECTS) + list(GROUP3_EFFECT_ALIASES.keys()) + list(short_codes))
    parser = argparse.ArgumentParser(
        description="Bandarchy Stage-2 Photo Motion Engine — Group C (Effects M13–M18)."
    )
    parser.add_argument("--category", default="custom", help="Category in processed/<cat>/ (default: custom)")
    parser.add_argument("--source-stem", default=None, help="Specific source stem in processed/<cat>/")
    parser.add_argument(
        "--effect",
        default=None,
        choices=all_choices,
        help="Render a single Group C effect",
    )
    parser.add_argument(
        "--palette",
        default="Omarchy Cyber",
        choices=tuple(BANDARCHY_PALETTES.keys()),
        help="Active Bandarchy palette",
    )
    parser.add_argument("--palette-index", type=int, default=None, help="Active Bandarchy palette index (0..30)")
    parser.add_argument("--opacity", type=float, default=0.96, help="Master layer opacity / fade_mix in [0.0, 1.0]")
    parser.add_argument("--fade-mix", type=float, default=None, help="Alias for master layer opacity / fade_mix in [0.0, 1.0]")
    parser.add_argument("--black-opacity", type=float, default=1.0, help="Obsidian black sector opacity in [0.0, 1.0]")
    parser.add_argument("--mid-opacity", type=float, default=1.0, help="Mid-tone structural sector opacity in [0.0, 1.0]")
    parser.add_argument("--white-opacity", type=float, default=1.0, help="Stark white sector opacity in [0.0, 1.0]")
    parser.add_argument("--colour-opacity", type=float, default=1.0, help="Snatched colour sector opacity in [0.0, 1.0]")
    parser.add_argument("--variant-fade", type=float, default=0.40, help="Cross-fade mix between Stark variants in [0.0, 1.0]")
    parser.add_argument("--time", type=float, default=1.35, help="Simulation timestamp in seconds")
    parser.add_argument("--beat-pulse", type=float, default=0.92, help="Audio beat transient pulse in [0.0, 1.5]")
    parser.add_argument("--output-dir", default=None, help="Output directory (defaults to ~/Pictures/bandarchy/Old)")
    parser.add_argument("--contact-sheet", action="store_true", help="Render the Group C showcase and contact sheet into Old/")
    parser.add_argument("--dump-qml-specs", action="store_true", help="Emit Group C QML/Shader integration specs as JSON")
    parser.add_argument("--json", action="store_true", help="Emit single-line JSON output")
    args = parser.parse_args(argv)

    try:
        resolved_opacity = _resolve_opacity(opacity=args.opacity, fade_mix=args.fade_mix)
        b_op, m_op, w_op, c_op = _resolve_sector_opacities(
            black_opacity=args.black_opacity,
            mid_opacity=args.mid_opacity,
            white_opacity=args.white_opacity,
            colour_opacity=args.colour_opacity,
        )
        v_fade = _clamp_finite(args.variant_fade, 0.0, 1.0, 0.40)
        if args.dump_qml_specs:
            payload: dict[str, Any] = {"ok": True, "group": "Group C (M13-M18)", "specs": GROUP_C_QML_SPECS}
        elif args.effect and not args.contact_sheet:
            canonical_eff = resolve_group3_effect_name(args.effect)
            base_dir = bpi.resolve_pictures_bandarchy_dir()
            out_dir = args.output_dir or os.path.join(base_dir, "Old")
            os.makedirs(out_dir, exist_ok=True)
            bundle = load_source_16_variants(category=args.category, source_stem=args.source_stem, root_dir=base_dir)
            fn = MOTION_GROUP3_DISPATCH[canonical_eff]
            im = fn(
                bundle,
                time_s=args.time,
                beat_pulse=args.beat_pulse,
                palette_name=args.palette,
                palette_index=args.palette_index,
                opacity=resolved_opacity,
                fade_mix=args.fade_mix,
                black_opacity=b_op,
                mid_opacity=m_op,
                white_opacity=w_op,
                colour_opacity=c_op,
                variant_fade=v_fade,
            )
            out_path = os.path.join(out_dir, f"{canonical_eff}__{bundle['source_stem']}.png")
            f1.atomic_save_png(im, out_path)
            payload = {
                "ok": True,
                "effect": canonical_eff,
                "requested_effect": args.effect,
                "category": args.category,
                "source_stem": bundle["source_stem"],
                "palette": args.palette,
                "palette_index": args.palette_index,
                "opacity": resolved_opacity,
                "black_opacity": b_op,
                "mid_opacity": m_op,
                "white_opacity": w_op,
                "colour_opacity": c_op,
                "variant_fade": v_fade,
                "output_path": out_path,
            }
        else:
            payload = render_group3_showcase_and_contact_sheet(
                category=args.category,
                source_stem=args.source_stem,
                output_dir=args.output_dir,
            )
    except (PhotoMotionError, f1.StarkSnatchError) as exc:
        print(json.dumps({"ok": False, "error": str(exc)}))
        return 1

    if args.json:
        print(json.dumps(payload))
    else:
        print(json.dumps(payload, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
