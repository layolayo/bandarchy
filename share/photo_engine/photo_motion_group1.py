#!/usr/bin/env python3
"""Bandarchy Stage-2 Real-Time Photo Motion & World-Bending Engine — Group A (Effects M01–M06).

Implements Group A of the 25 Stage-2 Real-Time Photo Motion, Strobe & World-Bending
Visualiser Effects for the Bandarchy Photo Layer:

  - M01_3D_XYZ_Plane_Effect_Strobe:
      Manipulates the photograph as a 3D plane in XYZ perspective space (pitch, yaw,
      roll, Z-depth surge, perspective foreshortening with horizon glow and trailing
      3D echo ghosts) while rapidly strobing the *same source image* through its 16
      pre-rendered Stark/Colour-Snatch variants (`01`..`16`) on beat/FFT triggers,
      with smooth variant cross-fading (`variant_fade`), sector-selective alpha/opacity,
      and active Bandarchy palette colour enhancement & bloom.
  - M02_4D_Tesseract_Folding_Cube:
      Projects different Stark effect variants of the same photograph onto the faces
      of a rotating, unfolding 3D/4D perspective hypercube (outer 3D cube + inner
      tesseract core connected by 4D projection struts) with palette-matched neon
      wireframe edges, variant cross-fading, and translucent face compositing.
  - M03_Relativistic_Z_Corridor_Echo_Train:
      Infinite receding Z-corridor of 10–12 translucent 3D photo planes flying along
      a curving 3D relativistic spline, where each depth plane displays a different
      Stark effect variant (`01`..`16`) of the same image with black-void alpha
      keying and depth-attenuated opacity fade.
  - M04_Stroboscopic_Shutter_Ghost_Flicker:
      High-speed nightclub shutter strobe cycling rapidly between positive Stark
      variants, inverted negative slices, displaced afterimage ghost trails with
      decaying opacity, variant cross-fades, and palette-colour resonance flashes.
  - M05_Gyroscopic_3_Axis_Card_Flip_Cascade:
      Concentric 3D gimbal rings and panels cut from the photo plane that spin
      independently on X, Y, and Z axes while flipping between Stark effect variants
      on each half-rotation, accented by glowing palette gimbal bevels and translucent
      shadow projection.
  - M06_Chronos_Time_Slice_Slit_Scan:
      Spatial-temporal slit-scan where wavy phase-modulated bands across a tilted 3D
      perspective plane simultaneously reveal different Stark effect variants (`01`..`16`)
      of the same photograph with smooth cross-faded band boundaries and active palette
      colour boosting.

Also provides drop-in QML / HTML5 Context2D / GLSL Shader specifications (`GROUP_A_QML_SPECS`)
for direct integration into Bandarchy's `Visualiser.qml` and `PsychedelicEngine.js`.

All prose, documentation, comments, and identifiers strictly adhere to British English.
"""

from __future__ import annotations

import argparse
import glob
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

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

import bandarchy_photo_import as bpi
import effects_family1 as f1

os.umask(0o077)

MAX_ART_BYTES = f1.MAX_ART_BYTES
IMAGE_EXTENSIONS = f1.IMAGE_EXTENSIONS
ALL_16_EFFECTS = bpi.ALL_16_EFFECTS

# All 30 Bandarchy Palettes from PsychedelicEngine.js (strictly synchronised) + Omarchy Cyber
BANDARCHY_PALETTE_LIST: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("Acid Rainbow", ("#ff007f", "#00f5d4", "#fee440", "#9b5de5", "#00bbf9", "#f15bb5")),
    ("Cyber Neon", ("#00f5ff", "#ff2a85", "#7b2cbf", "#38b000", "#ffbe0b", "#4cc9f0")),
    ("Solar Flare", ("#ff4800", "#ff9e00", "#ff0055", "#ffd000", "#ff6d00", "#ff206e")),
    ("Bioluminescence", ("#00f5d4", "#38bdf8", "#a78bfa", "#4ade80", "#f472b6", "#2dd4bf")),
    ("Ultraviolet Rave", ("#c084fc", "#f472b6", "#38bdf8", "#818cf8", "#e879f9", "#22d3ee")),
    ("Deep Nebula", ("#6366f1", "#ec4899", "#14b8a6", "#f59e0b", "#8b5cf6", "#06b6d4")),
    ("Emerald Matrix", ("#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#059669", "#22d3ee")),
    ("Blood Moon", ("#ef4444", "#f97316", "#f43f5e", "#eab308", "#ec4899", "#dc2626")),
    ("Cosmic Gold", ("#fbbf24", "#f59e0b", "#fde047", "#38bdf8", "#f472b6", "#fb923c")),
    ("Arctic Aurora", ("#2dd4bf", "#38bdf8", "#818cf8", "#c084fc", "#4ade80", "#60a5fa")),
    ("Tokyo Synthwave", ("#ff00a0", "#00f0ff", "#7a04eb", "#fe75fe", "#ff124f", "#05d9e8")),
    ("Electric Plasma", ("#00ffff", "#7df9ff", "#b5179e", "#4cc9f0", "#f72585", "#4361ee")),
    ("Toxic Acid 303", ("#ccff00", "#00ff66", "#ff0055", "#faff00", "#10b981", "#7c3aed")),
    ("Outrun Sunset", ("#ff2a6d", "#ff9e00", "#d1f7ff", "#05d9e8", "#7700a6", "#ffbe0b")),
    ("Holographic Prism", ("#67e8f9", "#f472b6", "#c084fc", "#fde047", "#34d399", "#fb7185")),
    ("DMT Hyperspace", ("#ff007f", "#ffbe0b", "#8338ec", "#3a86ff", "#fb5607", "#06d6a0")),
    ("Sub-Zero Cryo", ("#00f5d4", "#00bbf9", "#e0fbfc", "#38bdf8", "#818cf8", "#90e0ef")),
    ("Volcanic Magma", ("#ff1744", "#ff6d00", "#ffea00", "#d50000", "#ff9100", "#ff3d00")),
    ("Vaporwave Mall", ("#ff71ce", "#01cdfe", "#05ffa1", "#b967ff", "#fffb96", "#f687b3")),
    ("Quantum Supernova", ("#f72585", "#4cc9f0", "#ffd166", "#7209b7", "#06d6a0", "#ef476f")),
    ("Jungle Biolume", ("#4ade80", "#a3e635", "#2dd4bf", "#facc15", "#38bdf8", "#c084fc")),
    ("Berlin Strobe", ("#f8fafc", "#ff1e38", "#00e5ff", "#e2e8f0", "#f43f5e", "#38bdf8")),
    ("Amethyst Crystal", ("#d8b4fe", "#a855f7", "#f472b6", "#818cf8", "#e879f9", "#60a5fa")),
    ("Copper Demoscene", ("#ff9f1c", "#ffbf69", "#e71d36", "#2ec4b6", "#cbf3f0", "#ff595e")),
    ("Abalone Pearl", ("#a5f3fc", "#f9a8d4", "#d8b4fe", "#fde68a", "#6ee7b7", "#93c5fd")),
    ("Radioactive Isotope", ("#a3e635", "#22c55e", "#eab308", "#06b6d4", "#d9f99d", "#14b8a6")),
    ("Starlight Quasar", ("#38bdf8", "#f43f5e", "#fbbf24", "#a855f7", "#2dd4bf", "#ffffff")),
    ("Crimson Velvet", ("#ff0054", "#ff5400", "#ffbd00", "#9e0059", "#390099", "#ff85a1")),
    ("Oceanic Trench", ("#00e5ff", "#0077b6", "#48cae4", "#00f5d4", "#7209b7", "#90e0ef")),
    ("Prismatic Kaleidoscope", ("#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff924c")),
    ("Omarchy Cyber", ("#6ee7b7", "#f472b6", "#38bdf8", "#fbbf24", "#a855f7", "#34d399")),
)

BANDARCHY_PALETTES: dict[str, tuple[str, ...]] = {
    name: hexes for name, hexes in BANDARCHY_PALETTE_LIST
}
for _k, _v in f1.BANDARCHY_PALETTES.items():
    BANDARCHY_PALETTES.setdefault(_k, tuple(_v))

GROUP1_MOTION_EFFECTS: tuple[str, ...] = (
    "M01_3D_XYZ_Plane_Effect_Strobe",
    "M02_4D_Tesseract_Folding_Cube",
    "M03_Relativistic_Z_Corridor_Echo_Train",
    "M04_Stroboscopic_Shutter_Ghost_Flicker",
    "M05_Gyroscopic_3_Axis_Card_Flip_Cascade",
    "M06_Chronos_Time_Slice_Slit_Scan",
)

SECTOR_ALPHA_MODES: tuple[str, ...] = (
    "solid",
    "black_void_transparent",
    "chalk_and_neon_only",
    "ghost_veil",
)

VARIANT_FADE_MODES: tuple[str, ...] = (
    "linear",
    "smoothstep",
    "luma_wipe",
    "palette_key",
)


class PhotoMotionError(ValueError):
    """Expected operational error for invalid motion parameters or missing variants."""


def _resolve_opacity(opacity: float = 1.0, fade_mix: float | None = None) -> float:
    """Resolve master `opacity` / `fade_mix` in `[0.0, 1.0]`."""
    val = fade_mix if fade_mix is not None else opacity
    return float(np.clip(float(val), 0.0, 1.0))


# ============================================================================
# 1. Palette Colour Matching, Resonance Enhancement & Opacity / Fade Helpers
# ============================================================================


def get_palette_rgb_matrix(
    palette_name: str = "Omarchy Cyber",
    palette_index: int | None = None,
) -> np.ndarray:
    """Return an `(N, 3)` float32 RGB matrix in `[0.0, 1.0]` for the active Bandarchy palette."""
    if palette_index is not None:
        idx = int(palette_index) % len(BANDARCHY_PALETTE_LIST)
        hex_list = BANDARCHY_PALETTE_LIST[idx][1]
    else:
        hex_list = BANDARCHY_PALETTES.get(palette_name) or BANDARCHY_PALETTES["Omarchy Cyber"]
    return np.stack([f1.hex_to_rgb_float(h) for h in hex_list], axis=0).astype(np.float32)


def crossfade_variants(
    img_a: np.ndarray,
    img_b: np.ndarray,
    variant_fade: float = 0.0,
    fade_mode: str = "smoothstep",
    palette_rgb: np.ndarray | None = None,
) -> np.ndarray:
    """Cross-fade between two normalised `[0.0, 1.0]` float32 RGB Stark variants of the same image.

    Supports four cross-fade transitions:
      - `linear`: Direct linear interpolation `(1 - alpha) * A + alpha * B`.
      - `smoothstep`: Hermite S-curve cross-fade for snappy beat transitions.
      - `luma_wipe`: Luminance-keyed threshold wipe where bright/neon sectors transition first.
      - `palette_key`: Pixels resonant with the active palette transition ahead of monochrome sectors.
    """
    t = float(np.clip(variant_fade, 0.0, 1.0))
    if t <= 1e-5:
        return img_a.astype(np.float32, copy=True)
    if t >= 1.0 - 1e-5:
        return img_b.astype(np.float32, copy=True)

    if fade_mode == "linear":
        mix = t
    elif fade_mode == "luma_wipe":
        luma_b = (
            0.2126 * img_b[:, :, 0]
            + 0.7152 * img_b[:, :, 1]
            + 0.0722 * img_b[:, :, 2]
        )
        # Map t in [0..1] to a moving luminance wave
        thresh = 1.15 * (1.0 - t) - 0.15
        mix = f1.smoothstep(thresh - 0.18, thresh + 0.18, luma_b)[:, :, None]
    elif fade_mode == "palette_key":
        pal = (
            np.asarray(palette_rgb, dtype=np.float32)
            if palette_rgb is not None
            else get_palette_rgb_matrix("Omarchy Cyber")
        )
        if pal.ndim == 1:
            pal = pal[None, :]
        max_c = np.max(img_b, axis=2)
        min_c = np.min(img_b, axis=2)
        sat_b = (max_c - min_c) / np.maximum(max_c, 1e-5)
        rgb_norm = img_b / np.maximum(np.linalg.norm(img_b, axis=2, keepdims=True), 1e-5)
        pal_norm = pal / np.maximum(np.linalg.norm(pal, axis=1, keepdims=True), 1e-5)
        best_sim = np.max(np.tensordot(rgb_norm, pal_norm, axes=([2], [1])), axis=2)
        pal_affinity = f1.smoothstep(0.65, 0.98, best_sim)
        weight = np.clip(0.50 * (sat_b * pal_affinity) + 0.30 * pal_affinity + 0.20 * max_c, 0.0, 1.0)
        thresh = 1.15 * (1.0 - t) - 0.15
        mix = f1.smoothstep(thresh - 0.20, thresh + 0.20, weight)[:, :, None]
    else:
        # Default smoothstep
        mix = t * t * (3.0 - 2.0 * t)

    return np.clip((1.0 - mix) * img_a + mix * img_b, 0.0, 1.0).astype(np.float32)


def compute_sector_alpha(
    rgb: np.ndarray,
    opacity: float = 1.0,
    sector_alpha_mode: str = "black_void_transparent",
    black_void_floor: float = 0.18,
    *,
    fade_mix: float | None = None,
) -> np.ndarray:
    """Compute a per-pixel float32 alpha map `(H, W)` in `[0.0, 1.0]` from a Stark RGB image.

    Allows obsidian black sectors (`Y < 0.12`) to become partially or fully transparent
    so deeper 3D planes, strobe ghosts, or Bandarchy's background shader bleed through.
    """
    base_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)
    h, w = rgb.shape[:2]
    if base_opacity <= 1e-5:
        return np.zeros((h, w), dtype=np.float32)

    if sector_alpha_mode == "solid":
        return np.full((h, w), base_opacity, dtype=np.float32)

    luma = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    max_c = np.max(rgb, axis=2)
    min_c = np.min(rgb, axis=2)
    sat = (max_c - min_c) / np.maximum(max_c, 1e-5)

    if sector_alpha_mode == "chalk_and_neon_only":
        # Only bright chalk structure or high-saturation snatched colour stays opaque
        signal = np.maximum(f1.smoothstep(0.08, 0.45, luma), f1.smoothstep(0.12, 0.40, sat))
        floor = float(np.clip(black_void_floor * 0.4, 0.0, 1.0))
        alpha = floor + (1.0 - floor) * signal
    elif sector_alpha_mode == "ghost_veil":
        signal = 0.35 + 0.65 * np.maximum(luma, sat)
        alpha = np.clip(signal, 0.20, 0.92)
    else:
        # "black_void_transparent": obsidian black void dips to `black_void_floor`,
        # while midtones, chalk whites, and neon colour-snatched sectors remain crisp
        signal = np.maximum(f1.smoothstep(0.04, 0.24, luma), f1.smoothstep(0.10, 0.32, sat))
        floor = float(np.clip(black_void_floor, 0.0, 1.0))
        alpha = floor + (1.0 - floor) * signal

    return np.clip(alpha * base_opacity, 0.0, 1.0).astype(np.float32)


def enhance_palette_colours(
    rgb: np.ndarray,
    palette_name: str = "Omarchy Cyber",
    palette_boost: float = 1.35,
    bloom_strength: float = 0.42,
    beat_pulse: float = 0.8,
    *,
    palette_index: int | None = None,
) -> np.ndarray:
    """Selectively enhance, harmonise, and bloom colours matching the active Bandarchy palette.

    1. Measures each pixel's chromaticity & affinity to the active palette (`PALETTES[paletteIndex]`).
    2. Pulls snatched chromatic sectors toward their closest active palette colour and boosts
       saturation & vibrancy (`palette_boost`), while preserving pure obsidian black (`#07090e`)
       and chalk white (`#f8fafc`) architectural contrast.
    3. Extracts a palette-resonant highlight mask and applies a multi-radius neon bloom pass
       scaled by `bloom_strength` and `beat_pulse`.
    """
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)  # (K, 3)
    boost = float(np.clip(palette_boost, 0.0, 3.0))
    bloom = float(np.clip(bloom_strength, 0.0, 2.0))
    pulse = float(np.clip(beat_pulse, 0.0, 1.5))

    if boost <= 1e-4 and bloom <= 1e-4:
        return np.clip(rgb, 0.0, 1.0).astype(np.float32)

    h, w = rgb.shape[:2]
    max_c = np.max(rgb, axis=2)
    min_c = np.min(rgb, axis=2)
    chroma = max_c - min_c
    sat = chroma / np.maximum(max_c, 1e-5)
    luma = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]

    # Normalise pixel colour vectors and palette vectors to compute cosine similarity
    rgb_norm = rgb / np.maximum(np.linalg.norm(rgb, axis=2, keepdims=True), 1e-5)
    pal_norm = pal / np.maximum(np.linalg.norm(pal, axis=1, keepdims=True), 1e-5)

    # Similarity shape: (H, W, K)
    sim = np.tensordot(rgb_norm, pal_norm, axes=([2], [1]))
    best_idx = np.argmax(sim, axis=2)
    best_sim = np.max(sim, axis=2)
    nearest_pal_rgb = pal[best_idx]  # (H, W, 3)

    # Chromatic sector mask: pixels that already carry colour snatching
    chroma_mask = f1.smoothstep(0.10, 0.36, sat) * f1.smoothstep(0.05, 0.22, max_c)
    # Resonance weight: strongest when pixel is chromatic and aligns with a palette colour
    resonance = chroma_mask * f1.smoothstep(0.72, 0.96, best_sim)

    # Pull chromatic pixels towards the active palette and amplify vibrancy
    pull_strength = np.clip(0.45 * boost, 0.0, 0.88)
    target_tinted = nearest_pal_rgb * np.clip(max_c[:, :, None] * (1.0 + 0.32 * boost), 0.0, 1.0)
    enhanced = (
        rgb * (1.0 - pull_strength * chroma_mask[:, :, None])
        + target_tinted * (pull_strength * chroma_mask[:, :, None])
    )

    # Also inject a subtle edge-contour palette shimmer along stark black/white boundaries
    gx = np.zeros_like(luma)
    gy = np.zeros_like(luma)
    gx[:, 1:-1] = luma[:, 2:] - luma[:, :-2]
    gy[1:-1, :] = luma[2:, :] - luma[:-2, :]
    edge_mag = np.hypot(gx, gy)
    edge_shimmer_mask = f1.smoothstep(0.18, 0.55, edge_mag) * (1.0 - chroma_mask) * 0.42 * pulse
    # Cycle palette colours spatially across the canvas for monochrome edges
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    spatial_idx = np.mod(((xx / max(w, 1) * 3.0 + yy / max(h, 1) * 2.0) * len(pal)).astype(np.int32), len(pal))
    edge_pal_rgb = pal[spatial_idx]
    enhanced = enhanced + edge_pal_rgb * edge_shimmer_mask[:, :, None]

    # Multi-radius neon bloom on palette-resonant regions
    if bloom > 1e-4:
        emitter_weight = np.maximum(resonance * (0.7 + 0.5 * pulse), edge_shimmer_mask)
        emitter_rgb = np.clip(enhanced * emitter_weight[:, :, None], 0.0, 1.0)
        emitter_im = Image.fromarray((emitter_rgb * 255.0).astype(np.uint8), mode="RGB")
        glow_tight = np.asarray(
            emitter_im.filter(ImageFilter.GaussianBlur(radius=6.0)), dtype=np.float32
        ) / 255.0
        glow_wide = np.asarray(
            emitter_im.filter(ImageFilter.GaussianBlur(radius=18.0)), dtype=np.float32
        ) / 255.0
        enhanced = enhanced + bloom * (0.75 * glow_tight + 0.65 * glow_wide)

    return np.clip(enhanced, 0.0, 1.0).astype(np.float32)


# ============================================================================
# 2. Loading the 16 Pre-Rendered Stark Variants for a Single Source Photograph
# ============================================================================


def load_source_16_variants(
    category: str = "custom",
    source_stem: str | None = None,
    root_dir: str | None = None,
    target_size: tuple[int, int] | None = (800, 600),
) -> dict[str, Any]:
    """Load all 16 pre-rendered Stark/Colour-Snatch PNG variants for a single source stem.

    Reads from `~/Pictures/bandarchy/processed/<category>/<EffectID>__<SourceStem>.png`.
    Never mutates `categories/`, `processed/`, or `imported/`.
    """
    base_dir = root_dir or bpi.resolve_pictures_bandarchy_dir()
    proc_dir = os.path.join(base_dir, "processed", category)
    if not os.path.isdir(proc_dir) or os.path.islink(proc_dir):
        raise PhotoMotionError(f"processed category directory not found or symlinked: {proc_dir}")

    # Discover available source stems in processed/<category>/
    if not source_stem:
        prefix = f"{ALL_16_EFFECTS[0]}__"
        candidates: list[str] = []
        for entry in sorted(os.listdir(proc_dir)):
            if entry.startswith(prefix) and entry.endswith(".png"):
                stem = entry[len(prefix) : -4]
                if stem:
                    candidates.append(stem)
        if not candidates:
            raise PhotoMotionError(f"no processed Stark variants found in {proc_dir}")
        preferred = "12_Objects_Marble_Bust_Valves_BW"
        source_stem = preferred if preferred in candidates else candidates[0]

    variants_rgb: dict[str, np.ndarray] = {}
    variant_paths: dict[str, str] = {}
    resolved_size: tuple[int, int] | None = target_size

    for eff_name in ALL_16_EFFECTS:
        fname = f"{eff_name}__{source_stem}.png"
        fpath = os.path.join(proc_dir, fname)
        if not os.path.isfile(fpath) or os.path.islink(fpath):
            raise PhotoMotionError(f"missing or unsafe variant file: {fpath}")
        f1.validate_source_image(fpath)
        with Image.open(fpath) as im:
            rgb_im = im.convert("RGB")
            if resolved_size is None:
                resolved_size = rgb_im.size
            elif rgb_im.size != resolved_size:
                rgb_im = ImageOps.fit(rgb_im, resolved_size, Image.Resampling.LANCZOS)
            variants_rgb[eff_name] = np.asarray(rgb_im, dtype=np.float32) / 255.0
            variant_paths[eff_name] = fpath

    assert resolved_size is not None
    return {
        "category": category,
        "source_stem": source_stem,
        "width": resolved_size[0],
        "height": resolved_size[1],
        "variants_rgb": variants_rgb,
        "variant_paths": variant_paths,
        "ordered_list": [variants_rgb[eff] for eff in ALL_16_EFFECTS],
        "effect_names": list(ALL_16_EFFECTS),
    }


# ============================================================================
# 3. 3D XYZ Perspective Homography & Bilinear Plane Sampler
# ============================================================================


def rotation_matrix_xyz(pitch_deg: float, yaw_deg: float, roll_deg: float) -> np.ndarray:
    """Construct a `3x3` float32 3D rotation matrix `R = R_z(roll) @ R_y(yaw) @ R_x(pitch)`."""
    rx = math.radians(float(pitch_deg))
    ry = math.radians(float(yaw_deg))
    rz = math.radians(float(roll_deg))

    cx, sx = math.cos(rx), math.sin(rx)
    cy, sy = math.cos(ry), math.sin(ry)
    cz, sz = math.cos(rz), math.sin(rz)

    mat_x = np.array([[1.0, 0.0, 0.0], [0.0, cx, -sx], [0.0, sx, cx]], dtype=np.float32)
    mat_y = np.array([[cy, 0.0, sy], [0.0, 1.0, 0.0], [-sy, 0.0, cy]], dtype=np.float32)
    mat_z = np.array([[cz, -sz, 0.0], [sz, cz, 0.0], [0.0, 0.0, 1.0]], dtype=np.float32)
    return mat_z @ mat_y @ mat_x


def bilinear_sample_rgb(
    tex: np.ndarray,
    u_norm: np.ndarray,
    v_norm: np.ndarray,
    valid_mask: np.ndarray,
) -> np.ndarray:
    """Vectorised bilinear texture sampler for normalised coordinates `u_norm, v_norm in [0, 1]`."""
    th, tw = tex.shape[:2]
    out = np.zeros((u_norm.shape[0], u_norm.shape[1], tex.shape[2]), dtype=np.float32)
    if not np.any(valid_mask):
        return out

    u_px = np.clip(u_norm[valid_mask] * (tw - 1), 0.0, tw - 1.0001)
    v_px = np.clip(v_norm[valid_mask] * (th - 1), 0.0, th - 1.0001)

    x0 = np.floor(u_px).astype(np.int32)
    y0 = np.floor(v_px).astype(np.int32)
    x1 = np.minimum(x0 + 1, tw - 1)
    y1 = np.minimum(y0 + 1, th - 1)

    wx = (u_px - x0)[:, None]
    wy = (v_px - y0)[:, None]

    c00 = tex[y0, x0]
    c10 = tex[y0, x1]
    c01 = tex[y1, x0]
    c11 = tex[y1, x1]

    sampled = (
        c00 * (1.0 - wx) * (1.0 - wy)
        + c10 * wx * (1.0 - wy)
        + c01 * (1.0 - wx) * wy
        + c11 * wx * wy
    )
    out[valid_mask] = sampled
    return out


def project_3d_plane(
    plane_rgb: np.ndarray,
    canvas_w: int,
    canvas_h: int,
    pitch_deg: float = -18.0,
    yaw_deg: float = 22.0,
    roll_deg: float = -6.0,
    tx: float = 0.0,
    ty: float = 0.0,
    tz: float = 2.0,
    scale_x: float = 1.22,
    scale_y: float = 0.92,
    fov_deg: float = 54.0,
    border_rgb: np.ndarray | None = None,
    border_width: float = 0.032,
    plane_alpha_map: np.ndarray | None = None,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Project a 2D image texture onto a 3D plane in XYZ camera space via ray-plane homography.

    Returns `(projected_rgb, projected_alpha, valid_mask, u_coord, v_coord)` where:
      - `projected_rgb`: `(canvas_h, canvas_w, 3)` float32 RGB in `[0, 1]`
      - `projected_alpha`: `(canvas_h, canvas_w)` float32 alpha in `[0, 1]`
      - `valid_mask`: boolean mask of pixels hitting the bounded 3D quad `|u|<=1, |v|<=1`
      - `u_coord`, `v_coord`: local plane coordinates in `[-1, 1]`
    """
    rot = rotation_matrix_xyz(pitch_deg, yaw_deg, roll_deg)
    sx_safe = float(scale_x) if abs(float(scale_x)) >= 1e-3 else (1e-3 if float(scale_x) >= 0.0 else -1e-3)
    sy_safe = float(scale_y) if abs(float(scale_y)) >= 1e-3 else (1e-3 if float(scale_y) >= 0.0 else -1e-3)
    e_u = rot[:, 0] * sx_safe
    e_v = rot[:, 1] * sy_safe
    plane_normal = rot[:, 2]
    centre = np.array([float(tx), float(ty), max(float(tz), 0.25)], dtype=np.float32)

    # Ensure plane does not pass directly through the camera origin (dot(centre, normal) != 0)
    normal_dist = float(np.dot(centre, plane_normal))
    if abs(normal_dist) < 0.05:
        sign = 1.0 if normal_dist >= 0.0 else -1.0
        centre = centre + plane_normal * (sign * 0.05 - normal_dist)

    # Homography basis matrix M = [e_u, e_v, centre]
    mat_m = np.column_stack([e_u, e_v, centre]).astype(np.float32)
    inv_m = np.linalg.inv(mat_m)

    aspect = canvas_w / max(canvas_h, 1)
    focal = 1.0 / math.tan(math.radians(np.clip(fov_deg, 15.0, 120.0)) * 0.5)

    yy, xx = np.mgrid[0:canvas_h, 0:canvas_w].astype(np.float32)
    x_cam = ((xx / max(canvas_w - 1, 1)) * 2.0 - 1.0) * aspect / focal
    y_cam = ((yy / max(canvas_h - 1, 1)) * 2.0 - 1.0) / focal

    # Apply inv_m to [x_cam, y_cam, 1.0]
    q_u = inv_m[0, 0] * x_cam + inv_m[0, 1] * y_cam + inv_m[0, 2]
    q_v = inv_m[1, 0] * x_cam + inv_m[1, 1] * y_cam + inv_m[1, 2]
    q_w = inv_m[2, 0] * x_cam + inv_m[2, 1] * y_cam + inv_m[2, 2]

    in_front = q_w > 0.05
    safe_qw = np.where(in_front, q_w, 1.0)
    u = np.where(in_front, q_u / safe_qw, 99.0)
    v = np.where(in_front, q_v / safe_qw, 99.0)
    z_depth = np.where(in_front, 1.0 / safe_qw, 99.0)

    max_uv = np.maximum(np.abs(u), np.abs(v))
    valid_mask = in_front & (max_uv <= 1.0)

    u_norm = (u + 1.0) * 0.5
    v_norm = (v + 1.0) * 0.5

    sampled_rgb = bilinear_sample_rgb(plane_rgb, u_norm, v_norm, valid_mask)
    if plane_alpha_map is not None:
        sampled_alpha = bilinear_sample_rgb(
            plane_alpha_map[:, :, None], u_norm, v_norm, valid_mask
        )[:, :, 0]
    else:
        sampled_alpha = valid_mask.astype(np.float32)

    # Anti-aliased quad edge feathering
    edge_aa = 1.0 - f1.smoothstep(0.975, 1.002, max_uv)
    sampled_alpha = sampled_alpha * edge_aa * valid_mask.astype(np.float32)

    # Depth perspective shading (subtle atmospheric falloff for distant vertices)
    depth_shade = np.clip(1.18 - 0.10 * z_depth, 0.55, 1.15)
    sampled_rgb = np.clip(sampled_rgb * depth_shade[:, :, None], 0.0, 1.0)

    # Optional neon wireframe border & outer halo around the 3D plane
    if border_rgb is not None:
        rim = f1.smoothstep(1.0 - border_width, 0.995, max_uv) * valid_mask.astype(np.float32)
        outer_halo = (
            (1.0 - f1.smoothstep(1.0, 1.0 + border_width * 1.8, max_uv))
            * (max_uv > 1.0).astype(np.float32)
            * in_front.astype(np.float32)
        )
        sampled_rgb = np.clip(
            sampled_rgb * (1.0 - rim[:, :, None] * 0.65)
            + border_rgb[None, None, :] * (rim * 1.25 + outer_halo * 0.75)[:, :, None],
            0.0,
            1.0,
        )
        sampled_alpha = np.clip(np.maximum(sampled_alpha, rim * 0.98 + outer_halo * 0.55), 0.0, 1.0)

    return sampled_rgb, sampled_alpha, valid_mask, u, v


def render_cyber_horizon_backdrop(
    canvas_w: int,
    canvas_h: int,
    palette_rgb: np.ndarray,
    pitch_deg: float = -18.0,
    yaw_deg: float = 22.0,
    beat_pulse: float = 0.85,
) -> np.ndarray:
    """Render a deep obsidian 3D perspective horizon grid & radial nebula backdrop."""
    yy, xx = np.mgrid[0:canvas_h, 0:canvas_w].astype(np.float32)
    nx = (xx / max(canvas_w - 1, 1)) * 2.0 - 1.0
    ny = (yy / max(canvas_h - 1, 1)) * 2.0 - 1.0

    obsidian = np.array([7.0 / 255.0, 9.0 / 255.0, 14.0 / 255.0], dtype=np.float32)
    c0 = palette_rgb[0 % len(palette_rgb)]
    c1 = palette_rgb[1 % len(palette_rgb)]
    c2 = palette_rgb[2 % len(palette_rgb)]

    # Horizon line shifts slightly with camera pitch/yaw
    horizon_y = -0.12 + 0.008 * pitch_deg
    dy = ny - horizon_y
    horizon_glow = np.exp(-np.abs(dy) * 5.5) * (0.35 + 0.25 * beat_pulse)

    # Perspective floor/ceiling grid rays
    floor_mask = np.abs(dy) > 0.02
    safe_dy = np.where(floor_mask, dy, 1.0)
    proj_x = nx / safe_dy + 0.02 * yaw_deg
    proj_z = 1.6 / np.abs(safe_dy)

    grid_u = np.exp(-np.abs(np.sin(proj_x * math.pi * 2.5)) * 22.0)
    grid_v = np.exp(-np.abs(np.sin(proj_z * math.pi * 1.4)) * 18.0)
    grid = np.maximum(grid_u, grid_v) * f1.smoothstep(0.03, 0.35, np.abs(dy)) * 0.28

    radial = np.exp(-(nx * nx + ny * ny) * 1.4) * 0.18
    bg = (
        obsidian[None, None, :]
        + c0[None, None, :] * horizon_glow[:, :, None]
        + c1[None, None, :] * grid[:, :, None]
        + c2[None, None, :] * radial[:, :, None]
    )
    return np.clip(bg, 0.0, 1.0).astype(np.float32)


def finalise_motion_frame(
    composited_rgb: np.ndarray,
    foreground_alpha: np.ndarray,
    backdrop_rgb: np.ndarray,
    opacity: float = 1.0,
    return_rgba: bool = False,
    *,
    fade_mix: float | None = None,
) -> Image.Image:
    """Apply master `opacity` / `fade_mix` over the backdrop and return PIL RGB or RGBA image."""
    fade = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)
    final_rgb = np.clip(
        backdrop_rgb * (1.0 - fade) + composited_rgb * fade,
        0.0,
        1.0,
    )
    rgb_u8 = (final_rgb * 255.0 + 0.5).astype(np.uint8)
    if return_rgba:
        alpha_u8 = (np.clip(foreground_alpha * fade, 0.0, 1.0) * 255.0 + 0.5).astype(np.uint8)
        rgba_u8 = np.dstack([rgb_u8, alpha_u8])
        return Image.fromarray(rgba_u8, mode="RGBA")
    return Image.fromarray(rgb_u8, mode="RGB")


# ============================================================================
# 4. Group A Motion & Strobe Effect Implementations (M01–M06)
# ============================================================================


def effect_m01_3d_xyz_plane_effect_strobe(
    bundle: dict[str, Any],
    *,
    time_s: float = 1.25,
    beat_pulse: float = 0.92,
    strobe_rate_hz: float = 8.0,
    pitch_deg: float = -22.0,
    yaw_deg: float = 26.0,
    roll_deg: float = -8.0,
    z_depth: float = 1.82,
    palette_name: str = "Omarchy Cyber",
    palette_index: int | None = None,
    palette_boost: float = 1.45,
    bloom_strength: float = 0.48,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float | None = None,
    fade_mode: str = "luma_wipe",
    sector_alpha_mode: str = "black_void_transparent",
    echo_count: int = 4,
    return_rgba: bool = False,
) -> Image.Image:
    """M01: 3D XYZ Plane Effect Strobe (The User's Signature World-Bending Concept).

    Manipulates the photograph as a floating 3D plane in XYZ perspective space
    (pitch, yaw, roll, Z-depth surge, perspective foreshortening with horizon grid glow)
    while rapidly strobing the *same source image* through all 16 pre-rendered
    Stark/Colour-Snatch variants (`01`..`16`) on beat/FFT triggers:
      - Cross-fades smoothly between consecutive Stark variants (`variant_fade`).
      - Renders `echo_count` trailing 3D ghost planes behind the main plane along the Z-axis,
        each showing an earlier Stark effect variant from the strobe history with decaying
        opacity and sector-selective black-void transparency.
      - Selectively enhances and blooms colours matching the active Bandarchy palette.
    """
    w, h = bundle["width"], bundle["height"]
    variants: list[np.ndarray] = bundle["ordered_list"]
    num_v = len(variants)
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)

    # Compute active strobe phase across the 16 Stark variants of the same image
    phase = float(time_s) * float(max(strobe_rate_hz, 0.1)) + float(beat_pulse) * 1.7
    idx_a = int(math.floor(phase)) % num_v
    idx_b = (idx_a + 5) % num_v  # Jump across effect families for maximum visual contrast
    frac = phase - math.floor(phase) if variant_fade is None else float(np.clip(variant_fade, 0.0, 1.0))

    canvas = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=pitch_deg, yaw_deg=yaw_deg, beat_pulse=beat_pulse)
    backdrop = canvas.copy()
    accum_alpha = np.zeros((h, w), dtype=np.float32)

    # Render trailing 3D strobe ghost planes from farthest Z to nearest Z
    n_echoes = int(np.clip(echo_count, 0, 8))
    for e_idx in range(n_echoes, -1, -1):
        is_primary = e_idx == 0
        # Each echo plane steps back in the 16-variant strobe history
        v_idx_1 = (idx_a - e_idx * 3) % num_v
        v_idx_2 = (idx_b - e_idx * 3) % num_v
        local_fade = frac if is_primary else ((frac + 0.25 * e_idx) % 1.0)

        blended_tex = crossfade_variants(
            variants[v_idx_1],
            variants[v_idx_2],
            variant_fade=local_fade,
            fade_mode=fade_mode,
            palette_rgb=pal,
        )
        # Enhance colours belonging to the active palette
        enhanced_tex = enhance_palette_colours(
            blended_tex,
            palette_name=palette_name,
            palette_index=palette_index,
            palette_boost=palette_boost * (1.0 if is_primary else 0.85),
            bloom_strength=bloom_strength if is_primary else bloom_strength * 0.4,
            beat_pulse=beat_pulse,
        )

        # Compute sector-selective alpha so obsidian black sectors let deeper strobe echoes show through
        plane_opacity = 1.0 if is_primary else (0.58 * (0.72 ** (e_idx - 1)))
        void_floor = 0.32 if is_primary else 0.08
        tex_alpha = compute_sector_alpha(
            enhanced_tex,
            opacity=plane_opacity,
            sector_alpha_mode=sector_alpha_mode,
            black_void_floor=void_floor,
        )

        # 3D XYZ trajectory: primary plane surges forward on beat_pulse; echoes trail in Z/pitch/yaw
        tz_i = float(z_depth) - 0.16 * float(beat_pulse) + e_idx * 0.38
        pitch_i = float(pitch_deg) + e_idx * 4.0 * math.sin(time_s * 1.8 + e_idx)
        yaw_i = float(yaw_deg) - e_idx * 5.5 * math.cos(time_s * 1.4 + e_idx)
        roll_i = float(roll_deg) + e_idx * 4.0
        tx_i = -0.14 * e_idx * math.sin(math.radians(yaw_deg))
        ty_i = -0.09 * e_idx * math.sin(math.radians(pitch_deg))

        border_col = pal[e_idx % len(pal)]
        proj_rgb, proj_a, _, _, _ = project_3d_plane(
            enhanced_tex,
            w,
            h,
            pitch_deg=pitch_i,
            yaw_deg=yaw_i,
            roll_deg=roll_i,
            tx=tx_i,
            ty=ty_i,
            tz=tz_i,
            scale_x=0.96,
            scale_y=0.72,
            fov_deg=54.0,
            border_rgb=border_col,
            border_width=0.038 if is_primary else 0.024,
            plane_alpha_map=tex_alpha,
        )

        canvas = canvas * (1.0 - proj_a[:, :, None]) + proj_rgb * proj_a[:, :, None]
        accum_alpha = np.clip(accum_alpha + proj_a * (1.0 - accum_alpha), 0.0, 1.0)

    return finalise_motion_frame(
        canvas, accum_alpha, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


def effect_m02_4d_tesseract_folding_cube(
    bundle: dict[str, Any],
    *,
    time_s: float = 1.6,
    beat_pulse: float = 0.88,
    palette_name: str = "Tokyo Synthwave",
    palette_index: int | None = None,
    palette_boost: float = 1.40,
    bloom_strength: float = 0.45,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.38,
    fade_mode: str = "smoothstep",
    sector_alpha_mode: str = "black_void_transparent",
    return_rgba: bool = False,
) -> Image.Image:
    """M02: 4D Tesseract Folding Cube.

    Projects different Stark effect variants of the same photograph onto the faces of a
    rotating, unfolding 3D/4D perspective hypercube (outer 3D cube faces + inner 4D
    tesseract core faces connected by glowing 4D perspective struts).
    """
    w, h = bundle["width"], bundle["height"]
    variants: list[np.ndarray] = bundle["ordered_list"]
    num_v = len(variants)
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)

    canvas = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-12.0, yaw_deg=32.0, beat_pulse=beat_pulse)
    backdrop = canvas.copy()
    accum_alpha = np.zeros((h, w), dtype=np.float32)

    # Define 7 visible planes of an unfolding 4D hypercube (back-to-front depth order):
    # (pitch, yaw, roll, tx, ty, tz, scale, variant_idx_a, variant_idx_b, face_opacity, void_floor)
    unfold = 0.14 * float(beat_pulse)
    face_specs = [
        # Outer back & side unfolded wings
        (-15.0, -58.0, -4.0, -0.82 - unfold, 0.08, 2.75, 0.64, 2, 10, 0.72, 0.15),
        (-15.0, 58.0, 4.0, 0.82 + unfold, 0.08, 2.75, 0.64, 6, 14, 0.72, 0.15),
        (56.0, 18.0, -6.0, 0.05, -0.68 - unfold, 2.55, 0.62, 4, 12, 0.75, 0.18),
        (-56.0, 18.0, 6.0, -0.05, 0.68 + unfold, 2.55, 0.62, 8, 15, 0.75, 0.18),
        # Outer Cube main oblique left & right faces
        (-14.0, -34.0, -3.0, -0.46, 0.02, 2.15, 0.74, 0, 7, 0.86, 0.22),
        (-14.0, 38.0, 3.0, 0.48, -0.02, 2.10, 0.74, 3, 11, 0.86, 0.22),
        # Inner 4D Tesseract Core floating centrally with high-contrast strobe variant
        (10.0, -12.0, 12.0, 0.0, 0.0, 1.58 - 0.12 * beat_pulse, 0.56, 12, 15, 0.96, 0.30),
    ]

    phase_offset = int(math.floor(time_s * 5.0))
    for f_idx, (p_deg, y_deg, r_deg, tx, ty, tz, sc, va, vb, f_op, v_floor) in enumerate(face_specs):
        tex_a = variants[(va + phase_offset) % num_v]
        tex_b = variants[(vb + phase_offset) % num_v]
        blended = crossfade_variants(tex_a, tex_b, variant_fade=variant_fade, fade_mode=fade_mode, palette_rgb=pal)
        enhanced = enhance_palette_colours(
            blended,
            palette_name=palette_name,
            palette_index=palette_index,
            palette_boost=palette_boost,
            bloom_strength=bloom_strength * (1.1 if f_idx == len(face_specs) - 1 else 0.55),
            beat_pulse=beat_pulse,
        )
        alpha_map = compute_sector_alpha(
            enhanced,
            opacity=f_op,
            sector_alpha_mode=sector_alpha_mode,
            black_void_floor=v_floor,
        )
        border_col = pal[f_idx % len(pal)]
        proj_rgb, proj_a, _, _, _ = project_3d_plane(
            enhanced,
            w,
            h,
            pitch_deg=p_deg,
            yaw_deg=y_deg,
            roll_deg=r_deg,
            tx=tx,
            ty=ty,
            tz=tz,
            scale_x=sc * 1.18,
            scale_y=sc * 0.95,
            fov_deg=55.0,
            border_rgb=border_col,
            border_width=0.042,
            plane_alpha_map=alpha_map,
        )
        canvas = canvas * (1.0 - proj_a[:, :, None]) + proj_rgb * proj_a[:, :, None]
        accum_alpha = np.clip(accum_alpha + proj_a * (1.0 - accum_alpha), 0.0, 1.0)

    # Draw 4D hypercube diagonal projection struts connecting outer cube to inner core
    strut_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(strut_layer)
    cx, cy = w // 2, h // 2
    outer_pts = [
        (int(cx - w * 0.36), int(cy - h * 0.30)),
        (int(cx + w * 0.36), int(cy - h * 0.30)),
        (int(cx + w * 0.36), int(cy + h * 0.30)),
        (int(cx - w * 0.36), int(cy + h * 0.30)),
    ]
    inner_pts = [
        (int(cx - w * 0.17), int(cy - h * 0.15)),
        (int(cx + w * 0.17), int(cy - h * 0.15)),
        (int(cx + w * 0.17), int(cy + h * 0.15)),
        (int(cx - w * 0.17), int(cy + h * 0.15)),
    ]
    for i in range(4):
        col_u8 = tuple((pal[i % len(pal)] * 255.0).astype(np.uint8).tolist())
        draw.line([outer_pts[i], inner_pts[i]], fill=(*col_u8, 235), width=2)
        draw.line([outer_pts[i], outer_pts[(i + 1) % 4]], fill=(*col_u8, 210), width=1)

    strut_arr = np.asarray(strut_layer, dtype=np.float32) / 255.0
    strut_rgb = strut_arr[:, :, :3]
    strut_a = strut_arr[:, :, 3]
    canvas = canvas * (1.0 - strut_a[:, :, None]) + strut_rgb * strut_a[:, :, None]
    accum_alpha = np.clip(accum_alpha + strut_a * (1.0 - accum_alpha), 0.0, 1.0)

    return finalise_motion_frame(
        canvas, accum_alpha, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


def effect_m03_relativistic_z_corridor_echo_train(
    bundle: dict[str, Any],
    *,
    time_s: float = 2.1,
    beat_pulse: float = 0.90,
    corridor_planes: int = 10,
    palette_name: str = "Cyber Neon",
    palette_index: int | None = None,
    palette_boost: float = 1.42,
    bloom_strength: float = 0.44,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.30,
    fade_mode: str = "palette_key",
    sector_alpha_mode: str = "black_void_transparent",
    return_rgba: bool = False,
) -> Image.Image:
    """M03: Relativistic Z-Corridor Echo Train.

    Infinite receding Z-corridor of `10..12` translucent 3D photo planes flying along a
    curving 3D spline, where each depth plane displays a different Stark effect variant
    (`01`..`16`) of the same image. Black sectors and foreground portal apertures become
    translucent windows so deeper variant planes glow through the foreground planes.
    """
    w, h = bundle["width"], bundle["height"]
    variants: list[np.ndarray] = bundle["ordered_list"]
    num_v = len(variants)
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)

    canvas = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-6.0, yaw_deg=8.0, beat_pulse=beat_pulse)
    backdrop = canvas.copy()
    accum_alpha = np.zeros((h, w), dtype=np.float32)

    n_planes = int(np.clip(corridor_planes, 4, 14))
    z_travel = (float(time_s) * 1.8) % 1.0
    base_step = int(math.floor(float(time_s) * 1.8))

    tex_h, tex_w = variants[0].shape[:2]
    ty_grid, tx_grid = np.mgrid[0:tex_h, 0:tex_w].astype(np.float32)
    tu_norm = (tx_grid / max(tex_w - 1, 1)) * 2.0 - 1.0
    tv_norm = (ty_grid / max(tex_h - 1, 1)) * 2.0 - 1.0
    radial_uv = np.hypot(tu_norm, tv_norm)

    # Render from deepest Z plane (back) to nearest Z plane (front)
    for k in range(n_planes - 1, -1, -1):
        rel_depth = (k + 1.0 - z_travel) / n_planes  # in (0, 1]
        tz = 1.38 + rel_depth * 3.95
        # Curving relativistic S-spline trajectory
        spline_phase = rel_depth * math.pi * 2.0 + time_s * 1.2
        tx = 0.46 * math.sin(spline_phase) * rel_depth
        ty = 0.28 * math.cos(spline_phase * 0.8) * rel_depth
        yaw = 18.0 * math.cos(spline_phase)
        pitch = -10.0 * math.sin(spline_phase * 0.7)
        roll = 22.0 * math.sin(rel_depth * math.pi - time_s * 0.9)

        v_idx_a = (base_step + k * 2) % num_v
        v_idx_b = (v_idx_a + 1) % num_v
        blended = crossfade_variants(
            variants[v_idx_a],
            variants[v_idx_b],
            variant_fade=variant_fade,
            fade_mode=fade_mode,
            palette_rgb=pal,
        )
        enhanced = enhance_palette_colours(
            blended,
            palette_name=palette_name,
            palette_index=palette_index,
            palette_boost=palette_boost * (1.15 - 0.35 * rel_depth),
            bloom_strength=bloom_strength * (1.0 - 0.5 * rel_depth),
            beat_pulse=beat_pulse,
        )

        # Depth-attenuated opacity + translucent portal cutout in the centre of foreground planes
        depth_opacity = float(np.clip(0.92 - 0.42 * rel_depth, 0.34, 0.90))
        alpha_map = compute_sector_alpha(
            enhanced,
            opacity=depth_opacity,
            sector_alpha_mode=sector_alpha_mode,
            black_void_floor=0.05 if k < 4 else 0.14,
        )
        if k < 4:
            # Foreground planes open a semi-transparent central corridor aperture so deeper planes shine through
            portal_radius = 0.62 - 0.12 * k
            portal_window = 0.32 + 0.68 * f1.smoothstep(portal_radius * 0.45, portal_radius, radial_uv)
            alpha_map = alpha_map * portal_window

        border_col = pal[k % len(pal)]
        proj_rgb, proj_a, _, _, _ = project_3d_plane(
            enhanced,
            w,
            h,
            pitch_deg=pitch,
            yaw_deg=yaw,
            roll_deg=roll,
            tx=tx,
            ty=ty,
            tz=tz,
            scale_x=1.18,
            scale_y=0.88,
            fov_deg=58.0,
            border_rgb=border_col,
            border_width=0.038,
            plane_alpha_map=alpha_map,
        )
        canvas = canvas * (1.0 - proj_a[:, :, None]) + proj_rgb * proj_a[:, :, None]
        accum_alpha = np.clip(accum_alpha + proj_a * (1.0 - accum_alpha), 0.0, 1.0)

    return finalise_motion_frame(
        canvas, accum_alpha, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


def effect_m04_stroboscopic_shutter_ghost_flicker(
    bundle: dict[str, Any],
    *,
    time_s: float = 0.85,
    beat_pulse: float = 0.95,
    shutter_slices: int = 9,
    ghost_count: int = 3,
    palette_name: str = "Berlin Strobe",
    palette_index: int | None = None,
    palette_boost: float = 1.55,
    bloom_strength: float = 0.52,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.45,
    fade_mode: str = "luma_wipe",
    sector_alpha_mode: str = "black_void_transparent",
    return_rgba: bool = False,
) -> Image.Image:
    """M04: Stroboscopic Shutter Ghost Flicker.

    High-speed Berlin techno shutter strobe cycling rapidly between positive Stark
    variants, inverted Sabattier-negative shutter blinds, displaced afterimage ghost
    trails with decaying opacity, and palette-colour resonance flashes.
    """
    w, h = bundle["width"], bundle["height"]
    variants: list[np.ndarray] = bundle["ordered_list"]
    num_v = len(variants)
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)

    step = int(math.floor(float(time_s) * 12.0))
    primary_a = variants[step % num_v]
    primary_b = variants[(step + 7) % num_v]
    alt_neg_src = variants[(step + 12) % num_v]

    base_blend = crossfade_variants(
        primary_a, primary_b, variant_fade=variant_fade, fade_mode=fade_mode, palette_rgb=pal
    )

    # Construct inverted negative + palette-tinted counterpart for the strobe shutter slices
    luma_neg = 1.0 - (
        0.2126 * alt_neg_src[:, :, 0]
        + 0.7152 * alt_neg_src[:, :, 1]
        + 0.0722 * alt_neg_src[:, :, 2]
    )
    strobe_col_a = pal[0 % len(pal)]
    strobe_col_b = pal[1 % len(pal)]
    inverted_variant = np.clip(
        luma_neg[:, :, None] * (0.45 + 0.55 * strobe_col_a[None, None, :])
        + (1.0 - alt_neg_src) * 0.35 * strobe_col_b[None, None, :],
        0.0,
        1.0,
    )

    # Angled venetian shutter mask across the frame
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = xx / max(w - 1, 1)
    ny = yy / max(h - 1, 1)
    shutter_coord = (nx * 0.65 + ny * 0.75) * float(max(shutter_slices, 2)) + time_s * 4.0
    shutter_wave = np.sin(shutter_coord * math.pi * 2.0)
    shutter_mask = f1.smoothstep(-0.18, 0.18, shutter_wave)[:, :, None]

    # Combine positive variant and inverted shutter bands
    composite = base_blend * (1.0 - shutter_mask * 0.82) + inverted_variant * (shutter_mask * 0.82)

    # Layer displaced stroboscopic afterimage ghost trails from other Stark variants
    n_ghosts = int(np.clip(ghost_count, 0, 6))
    for g in range(1, n_ghosts + 1):
        ghost_v = variants[(step + g * 4) % num_v]
        dx = int(round((14 * g) * math.cos(time_s * 3.0 + g)))
        dy = int(round((8 * g) * math.sin(time_s * 2.3 + g)))
        shifted = np.roll(np.roll(ghost_v, dy, axis=0), dx, axis=1)
        ghost_alpha = compute_sector_alpha(
            shifted,
            opacity=0.38 / g,
            sector_alpha_mode="chalk_and_neon_only",
            black_void_floor=0.0,
        )[:, :, None]
        ghost_tint = pal[(g + 1) % len(pal)][None, None, :]
        shifted_tinted = np.clip(shifted * 0.65 + shifted * ghost_tint * 0.65, 0.0, 1.0)
        composite = composite * (1.0 - ghost_alpha) + shifted_tinted * ghost_alpha

    # Enhance active palette colours & trigger high-intensity beat strobe flash
    enhanced = enhance_palette_colours(
        composite,
        palette_name=palette_name,
        palette_index=palette_index,
        palette_boost=palette_boost,
        bloom_strength=bloom_strength,
        beat_pulse=beat_pulse,
    )

    # Subtle 3D perspective camera jolt on beat
    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-8.0, yaw_deg=10.0, beat_pulse=beat_pulse)
    fg_alpha = compute_sector_alpha(
        enhanced,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=0.25,
    )
    proj_rgb, proj_a, _, _, _ = project_3d_plane(
        enhanced,
        w,
        h,
        pitch_deg=-7.0 * beat_pulse,
        yaw_deg=9.0 * beat_pulse,
        roll_deg=-3.5 * math.sin(time_s * 6.0),
        tx=0.0,
        ty=0.0,
        tz=1.62,
        scale_x=1.34,
        scale_y=1.00,
        fov_deg=54.0,
        border_rgb=pal[0],
        border_width=0.028,
        plane_alpha_map=fg_alpha,
    )
    canvas = backdrop * (1.0 - proj_a[:, :, None]) + proj_rgb * proj_a[:, :, None]
    return finalise_motion_frame(
        canvas, proj_a, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


def effect_m05_gyroscopic_3_axis_card_flip_cascade(
    bundle: dict[str, Any],
    *,
    time_s: float = 1.9,
    beat_pulse: float = 0.88,
    gimbal_rings: int = 4,
    palette_name: str = "Acid Rainbow",
    palette_index: int | None = None,
    palette_boost: float = 1.40,
    bloom_strength: float = 0.45,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float | None = None,
    fade_mode: str = "smoothstep",
    sector_alpha_mode: str = "black_void_transparent",
    return_rgba: bool = False,
) -> Image.Image:
    """M05: Gyroscopic 3-Axis Card-Flip Cascade.

    Concentric 3D gimbal rings and inner core cut from the photo plane that spin
    independently on X (pitch), Y (yaw), and Z (roll) axes in 3D perspective space
    while flipping between different Stark effect variants of the same image on each
    half-rotation (`180 deg` card flip).
    """
    w, h = bundle["width"], bundle["height"]
    variants: list[np.ndarray] = bundle["ordered_list"]
    num_v = len(variants)
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)

    canvas = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-14.0, yaw_deg=18.0, beat_pulse=beat_pulse)
    backdrop = canvas.copy()
    accum_alpha = np.zeros((h, w), dtype=np.float32)

    n_rings = int(np.clip(gimbal_rings, 2, 6))
    # Radii boundaries in plane UV space: [1.02, 0.76, 0.51, 0.25, 0.0]
    radii = np.linspace(1.02, 0.0, n_rings + 1)

    for r_idx in range(n_rings):
        r_outer = float(radii[r_idx])
        r_inner = float(radii[r_idx + 1])

        # Continuous independent 3-axis gimbal spin (degrees) per concentric ring
        spin_rate_deg = 110.0 + r_idx * 35.0
        continuous_spin = float(time_s) * spin_rate_deg + r_idx * 65.0 + float(beat_pulse) * 25.0
        half_turns = int(math.floor((continuous_spin + 90.0) / 180.0))
        # Fold angle into [-58, +58] deg perspective card presentation so face remains visible
        folded_angle = ((continuous_spin + 90.0) % 180.0) - 90.0
        card_tilt = 56.0 * math.sin(math.radians(folded_angle))
        # Distance to the nearest 90-degree half-rotation flip boundary drives automatic variant cross-fade
        flip_phase = ((continuous_spin + 90.0) % 180.0) / 180.0

        if r_idx % 3 == 0:
            # X-axis (pitch) primary card flip + Y/Z gimbal precession
            pitch = card_tilt
            yaw = 28.0 * math.sin(time_s * 1.2 + r_idx)
            roll = (continuous_spin * 0.25) % 360.0 - 180.0
        elif r_idx % 3 == 1:
            # Y-axis (yaw) primary card flip + X/Z gimbal precession
            pitch = 26.0 * math.cos(time_s * 1.5 + r_idx)
            yaw = card_tilt
            roll = -(continuous_spin * 0.30) % 360.0 + 180.0
        else:
            # Z-axis (roll) + coupled X/Y diagonal card flip
            pitch = card_tilt * 0.72
            yaw = -card_tilt * 0.68
            roll = ((continuous_spin * 0.65) % 360.0) - 180.0

        tz = 1.95 - r_idx * 0.14 - 0.08 * beat_pulse
        # Flip Stark variant index on every half-rotation (half_turns)
        v_a = (r_idx * 4 + half_turns * 3) % num_v
        v_b = (v_a + 3) % num_v
        local_fade = float(variant_fade) if variant_fade is not None else float(f1.smoothstep(0.65, 0.98, flip_phase))

        blended = crossfade_variants(
            variants[v_a], variants[v_b], variant_fade=local_fade, fade_mode=fade_mode, palette_rgb=pal
        )
        enhanced = enhance_palette_colours(
            blended,
            palette_name=palette_name,
            palette_index=palette_index,
            palette_boost=palette_boost,
            bloom_strength=bloom_strength,
            beat_pulse=beat_pulse,
        )
        sec_alpha = compute_sector_alpha(
            enhanced,
            opacity=0.94,
            sector_alpha_mode=sector_alpha_mode,
            black_void_floor=0.22,
        )

        proj_rgb, proj_a, valid_mask, u_coord, v_coord = project_3d_plane(
            enhanced,
            w,
            h,
            pitch_deg=pitch,
            yaw_deg=yaw,
            roll_deg=roll,
            tx=0.0,
            ty=0.0,
            tz=tz,
            scale_x=1.28,
            scale_y=0.96,
            fov_deg=55.0,
            border_rgb=None,
            plane_alpha_map=sec_alpha,
        )

        # Carve concentric circular/elliptical gimbal annulus in local (u, v) plane coordinates
        rad_uv = np.hypot(u_coord, v_coord)
        outer_cut = 1.0 - f1.smoothstep(r_outer - 0.025, r_outer + 0.015, rad_uv)
        if r_idx < n_rings - 1:
            inner_cut = f1.smoothstep(r_inner - 0.015, r_inner + 0.025, rad_uv)
        else:
            inner_cut = np.ones_like(rad_uv)
        ring_mask = outer_cut * inner_cut * valid_mask.astype(np.float32)

        # Glowing neon gimbal bevel along both inner and outer ring rims
        outer_rim = np.exp(-np.abs(rad_uv - r_outer) * 55.0) * valid_mask.astype(np.float32)
        inner_rim = (
            np.exp(-np.abs(rad_uv - r_inner) * 55.0) * valid_mask.astype(np.float32)
            if r_idx < n_rings - 1
            else np.zeros_like(rad_uv)
        )
        bevel = np.clip(outer_rim + inner_rim, 0.0, 1.0)
        ring_col = pal[r_idx % len(pal)]

        ring_rgb = np.clip(
            proj_rgb * (1.0 - bevel[:, :, None] * 0.55) + ring_col[None, None, :] * (bevel * 1.35)[:, :, None],
            0.0,
            1.0,
        )
        ring_alpha = np.clip(np.maximum(proj_a * ring_mask, bevel * 0.95), 0.0, 1.0)

        canvas = canvas * (1.0 - ring_alpha[:, :, None]) + ring_rgb * ring_alpha[:, :, None]
        accum_alpha = np.clip(accum_alpha + ring_alpha * (1.0 - accum_alpha), 0.0, 1.0)

    return finalise_motion_frame(
        canvas, accum_alpha, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


def effect_m06_chronos_time_slice_slit_scan(
    bundle: dict[str, Any],
    *,
    time_s: float = 1.4,
    beat_pulse: float = 0.90,
    slit_bands: int = 12,
    wave_amplitude: float = 0.08,
    palette_name: str = "Ultraviolet Rave",
    palette_index: int | None = None,
    palette_boost: float = 1.45,
    bloom_strength: float = 0.46,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.50,
    fade_mode: str = "smoothstep",
    sector_alpha_mode: str = "black_void_transparent",
    return_rgba: bool = False,
) -> Image.Image:
    """M06: Chronos Time-Slice Slit-Scan.

    Spatial-temporal slit-scan where wavy phase-modulated bands across a tilted 3D
    perspective plane simultaneously reveal all 16 pre-rendered Stark effect variants
    (`01`..`16`) of the same photograph side-by-side, with smooth cross-faded band
    transitions (`variant_fade`), laser phase dividers, and active palette colour boosting.
    """
    w, h = bundle["width"], bundle["height"]
    variants: list[np.ndarray] = bundle["ordered_list"]
    num_v = len(variants)
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = xx / max(w - 1, 1)
    ny = yy / max(h - 1, 1)

    # Wavy diagonal slit-scan phase across texture space
    n_bands = float(np.clip(slit_bands, 3, 24))
    wave = float(wave_amplitude) * np.sin(ny * math.pi * 4.0 + time_s * 3.0) + 0.04 * np.cos(
        nx * math.pi * 6.0 - time_s * 2.2
    )
    scan_pos = (nx * 0.78 + ny * 0.35 + wave + time_s * 0.25) * n_bands

    band_int = np.floor(scan_pos).astype(np.int32)
    band_frac = scan_pos - np.floor(scan_pos)

    # Smooth cross-fade width controlled by `variant_fade`
    feather = float(np.clip(0.12 + 0.36 * float(variant_fade), 0.05, 0.49))
    blend_t = f1.smoothstep(1.0 - feather, 1.0, band_frac)

    slit_composite = np.zeros((h, w, 3), dtype=np.float32)
    for b_idx in range(num_v):
        mask_a = (np.mod(band_int, num_v) == b_idx).astype(np.float32)
        if not np.any(mask_a > 0):
            continue
        tex_a = variants[b_idx]
        tex_b = variants[(b_idx + 1) % num_v]
        # Slight horizontal phase shear per slit band on beat transients
        shear_px = int(round(6.0 * float(beat_pulse) * math.sin(b_idx * 1.3 + time_s * 4.0)))
        tex_a_s = np.roll(tex_a, shear_px, axis=1)
        band_rgb = tex_a_s * (1.0 - blend_t[:, :, None]) + tex_b * blend_t[:, :, None]
        slit_composite += band_rgb * mask_a[:, :, None]

    # Add glowing palette laser lines along slit-scan band boundaries
    boundary_glow = np.exp(-np.minimum(band_frac, 1.0 - band_frac) * 34.0) * (0.55 + 0.45 * beat_pulse)
    pal_idx = np.mod(band_int, len(pal))
    laser_rgb = pal[pal_idx]
    slit_composite = np.clip(
        slit_composite + laser_rgb * boundary_glow[:, :, None] * 0.75,
        0.0,
        1.0,
    )

    enhanced = enhance_palette_colours(
        slit_composite,
        palette_name=palette_name,
        palette_index=palette_index,
        palette_boost=palette_boost,
        bloom_strength=bloom_strength,
        beat_pulse=beat_pulse,
    )

    # Project the Chronos Slit-Scan plane into 3D XYZ perspective space with a subtle S-warp echo
    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-16.0, yaw_deg=15.0, beat_pulse=beat_pulse)
    fg_alpha = compute_sector_alpha(
        enhanced,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=0.26,
    )
    proj_rgb, proj_a, _, _, _ = project_3d_plane(
        enhanced,
        w,
        h,
        pitch_deg=-15.0,
        yaw_deg=14.0,
        roll_deg=-4.0,
        tx=0.0,
        ty=0.0,
        tz=1.68,
        scale_x=1.32,
        scale_y=0.98,
        fov_deg=54.0,
        border_rgb=pal[0],
        border_width=0.032,
        plane_alpha_map=fg_alpha,
    )
    canvas = backdrop * (1.0 - proj_a[:, :, None]) + proj_rgb * proj_a[:, :, None]
    return finalise_motion_frame(
        canvas, proj_a, backdrop, opacity=master_opacity, return_rgba=return_rgba
    )


MOTION_GROUP1_DISPATCH: dict[str, Any] = {
    "M01_3D_XYZ_Plane_Effect_Strobe": effect_m01_3d_xyz_plane_effect_strobe,
    "M02_4D_Tesseract_Folding_Cube": effect_m02_4d_tesseract_folding_cube,
    "M03_Relativistic_Z_Corridor_Echo_Train": effect_m03_relativistic_z_corridor_echo_train,
    "M04_Stroboscopic_Shutter_Ghost_Flicker": effect_m04_stroboscopic_shutter_ghost_flicker,
    "M05_Gyroscopic_3_Axis_Card_Flip_Cascade": effect_m05_gyroscopic_3_axis_card_flip_cascade,
    "M06_Chronos_Time_Slice_Slit_Scan": effect_m06_chronos_time_slice_slit_scan,
}


# ============================================================================
# 5. Drop-In QML / Canvas / GLSL Shader Specifications for Bandarchy
# ============================================================================


GROUP_A_QML_SPECS: dict[str, dict[str, Any]] = {
    "M01_3D_XYZ_Plane_Effect_Strobe": {
        "id": "M01_3D_XYZ_Plane_Effect_Strobe",
        "title": "3D XYZ Plane Effect Strobe",
        "family": "Group A: 3D XYZ Plane Manipulation, Multi-Effect Strobe & Temporal Flicker",
        "description": (
            "Manipulates the active photograph as a floating 3D plane in XYZ perspective space "
            "(pitch, yaw, roll, Z-depth kick surge) while rapidly strobing the same source image "
            "through all 16 pre-rendered Stark/Colour-Snatch variants with cross-fade, trailing "
            "3D Z-echoes, black-void alpha bleed-through, and active palette colour bloom."
        ),
        "audio_links": [
            {"source": "bassSmooth", "method": "Direct Value", "target": "photoPlaneZSurge"},
            {"source": "beatPulse", "method": "Trigger / Step", "target": "photoStrobeVariantIndex"},
            {"source": "midSmooth", "method": "Phase Accumulator", "target": "photoYawPitchOrbit"},
            {"source": "highSmooth", "method": "Direct Value", "target": "photoPaletteBloom"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.92},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.92},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.35},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.25},
            "pitchDeg": {"min": -65.0, "max": 65.0, "default": -22.0},
            "yawDeg": {"min": -65.0, "max": 65.0, "default": 26.0},
            "rollDeg": {"min": -180.0, "max": 180.0, "default": -8.0},
            "zDepth": {"min": 0.8, "max": 4.0, "default": 1.82},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.45},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M01: 3D XYZ Plane Effect Strobe
Item {
    id: m01PlaneStrobeLayer
    anchors.fill: parent
    opacity: state.photoLayerOpacity // 0.0 .. 1.0 master fade

    property int activeVariantIdx: Math.floor(state.time * state.photoStrobeHz + state.beatCount * 3) % 16
    property int nextVariantIdx: (activeVariantIdx + 5) % 16
    property real variantCrossfade: state.photoVariantFade

    transform: [
        Rotation {
            origin.x: width * 0.5; origin.y: height * 0.5
            axis { x: 1; y: 0; z: 0 }
            angle: state.photoPitchDeg + Math.sin(state.time * 1.7) * 18.0 * state.midSmooth
        },
        Rotation {
            origin.x: width * 0.5; origin.y: height * 0.5
            axis { x: 0; y: 1; z: 0 }
            angle: state.photoYawDeg + Math.cos(state.time * 1.3) * 24.0 * state.bassSmooth
        },
        Rotation {
            origin.x: width * 0.5; origin.y: height * 0.5
            axis { x: 0; y: 0; z: 1 }
            angle: state.photoRollDeg + state.beatPulse * 8.0
        },
        Scale {
            origin.x: width * 0.5; origin.y: height * 0.5
            xScale: (1.0 / Math.max(0.45, state.photoZDepth - state.bassSmooth * 0.35))
            yScale: (1.0 / Math.max(0.45, state.photoZDepth - state.bassSmooth * 0.35))
        }
    ]
}
""".strip(),
    },
    "M02_4D_Tesseract_Folding_Cube": {
        "id": "M02_4D_Tesseract_Folding_Cube",
        "title": "4D Tesseract Folding Cube",
        "family": "Group A: 3D XYZ Plane Manipulation, Multi-Effect Strobe & Temporal Flicker",
        "description": (
            "Projects 6+1 distinct Stark effect variants of the same photograph onto the "
            "unfolding faces of an outer 3D perspective cube and inner 4D hypercube core, "
            "linked by palette-matched neon projection struts."
        ),
        "audio_links": [
            {"source": "beatPulse", "method": "Spring Impulse", "target": "tesseractUnfoldAngle"},
            {"source": "bassSmooth", "method": "Direct Value", "target": "innerCoreScale"},
            {"source": "highSmooth", "method": "Trigger / Step", "target": "faceVariantPermutation"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.94},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.94},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.38},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.22},
            "unfoldFactor": {"min": 0.0, "max": 1.0, "default": 0.25},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.40},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M02: 4D Tesseract Folding Cube
Repeater {
    model: 7
    delegate: Item {
        anchors.fill: parent
        opacity: state.photoLayerOpacity * (index === 6 ? 0.96 : 0.78)
        property int faceVariantIdx: (index * 2 + state.beatCount) % 16
        transform: [
            Rotation {
                origin.x: width * 0.5; origin.y: height * 0.5
                axis { x: 0; y: 1; z: 0 }
                angle: (index - 3) * (24.0 + state.beatPulse * 14.0)
            }
        ]
    }
}
""".strip(),
    },
    "M03_Relativistic_Z_Corridor_Echo_Train": {
        "id": "M03_Relativistic_Z_Corridor_Echo_Train",
        "title": "Relativistic Z-Corridor Echo Train",
        "family": "Group A: 3D XYZ Plane Manipulation, Multi-Effect Strobe & Temporal Flicker",
        "description": (
            "Infinite receding Z-corridor of 10–12 translucent 3D photo planes flying along "
            "a curving 3D spline where each depth plane displays a different Stark variant "
            "(01..16) of the same image with black-void alpha bleed-through."
        ),
        "audio_links": [
            {"source": "bassSmooth", "method": "Phase Accumulator", "target": "corridorZVelocity"},
            {"source": "midSmooth", "method": "Direct Value", "target": "splineCurvatureXY"},
            {"source": "beatPulse", "method": "Direct Value", "target": "corridorPaletteBloom"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.90},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.90},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.30},
            "corridorPlanes": {"min": 4, "max": 14, "default": 10},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.12},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.42},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M03: Relativistic Z-Corridor Echo Train
Repeater {
    model: state.corridorPlanes
    delegate: Item {
        anchors.fill: parent
        property real relDepth: ((index + 1.0 - ((state.time * 1.8) % 1.0)) / state.corridorPlanes)
        opacity: state.photoLayerOpacity * Math.max(0.32, 0.95 - 0.45 * relDepth)
        scale: 1.0 / (1.0 + relDepth * 2.4)
        x: Math.sin(relDepth * 6.283 + state.time * 1.2) * width * 0.14 * relDepth
        y: Math.cos(relDepth * 5.026 + state.time * 1.2) * height * 0.10 * relDepth
    }
}
""".strip(),
    },
    "M04_Stroboscopic_Shutter_Ghost_Flicker": {
        "id": "M04_Stroboscopic_Shutter_Ghost_Flicker",
        "title": "Stroboscopic Shutter Ghost Flicker",
        "family": "Group A: 3D XYZ Plane Manipulation, Multi-Effect Strobe & Temporal Flicker",
        "description": (
            "High-speed nightclub shutter strobe cycling rapidly between positive Stark "
            "variants, inverted negative shutter blinds, displaced afterimage ghost trails "
            "with decaying opacity, and palette-colour resonance flashes."
        ),
        "audio_links": [
            {"source": "beatPulse", "method": "Trigger / Step", "target": "shutterPolarityInvert"},
            {"source": "highSmooth", "method": "Direct Value", "target": "ghostTrailDisplacement"},
            {"source": "bassSmooth", "method": "Direct Value", "target": "shutterSliceFrequency"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.95},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.95},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.45},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.25},
            "shutterSlices": {"min": 2, "max": 24, "default": 9},
            "ghostCount": {"min": 0, "max": 6, "default": 3},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.55},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M04: Stroboscopic Shutter Ghost Flicker
Item {
    id: m04ShutterFlickerLayer
    anchors.fill: parent
    opacity: state.photoLayerOpacity
    property int shutterStep: Math.floor(state.time * 12.0 + state.beatCount * 2) % 16
    property real shutterBlindFreq: state.shutterSlices + state.bassSmooth * 6.0
}
""".strip(),
    },
    "M05_Gyroscopic_3_Axis_Card_Flip_Cascade": {
        "id": "M05_Gyroscopic_3_Axis_Card_Flip_Cascade",
        "title": "Gyroscopic 3-Axis Card-Flip Cascade",
        "family": "Group A: 3D XYZ Plane Manipulation, Multi-Effect Strobe & Temporal Flicker",
        "description": (
            "Concentric 3D gimbal rings cut from the photo plane that spin independently on "
            "X, Y, and Z axes while flipping between Stark effect variants on each half-rotation."
        ),
        "audio_links": [
            {"source": "bassSmooth", "method": "Phase Accumulator", "target": "outerGimbalPitch"},
            {"source": "midSmooth", "method": "Phase Accumulator", "target": "midGimbalYaw"},
            {"source": "highSmooth", "method": "Phase Accumulator", "target": "innerCoreRoll"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.94},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.94},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.35},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.22},
            "gimbalRings": {"min": 2, "max": 6, "default": 4},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.40},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M05: Gyroscopic 3-Axis Card-Flip Cascade
Repeater {
    model: state.gimbalRings
    delegate: Item {
        anchors.fill: parent
        opacity: state.photoLayerOpacity * 0.94
        property real spinDeg: state.time * (110.0 + index * 35.0) + index * 65.0
        property int halfTurnVariant: (index * 4 + Math.floor((spinDeg + 90.0) / 180.0) * 3) % 16
    }
}
""".strip(),
    },
    "M06_Chronos_Time_Slice_Slit_Scan": {
        "id": "M06_Chronos_Time_Slice_Slit_Scan",
        "title": "Chronos Time-Slice Slit-Scan",
        "family": "Group A: 3D XYZ Plane Manipulation, Multi-Effect Strobe & Temporal Flicker",
        "description": (
            "Spatial-temporal slit-scan where wavy phase-modulated bands across a tilted 3D "
            "plane simultaneously reveal all 16 Stark effect variants of the same photograph "
            "with cross-faded band boundaries and active palette laser dividers."
        ),
        "audio_links": [
            {"source": "spectrum[0..47]", "method": "Direct Value", "target": "slitBandWavePhase"},
            {"source": "beatPulse", "method": "Spring Impulse", "target": "slitHorizontalShear"},
            {"source": "midSmooth", "method": "Direct Value", "target": "variantBandCrossfade"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.96},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.50},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.26},
            "slitBands": {"min": 3, "max": 24, "default": 12},
            "waveAmplitude": {"min": 0.0, "max": 0.25, "default": 0.08},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.45},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M06: Chronos Time-Slice Slit-Scan
Item {
    id: m06ChronosSlitScanLayer
    anchors.fill: parent
    opacity: state.photoLayerOpacity
    property int slitBands: state.slitBands
    property real waveAmplitude: state.waveAmplitude + state.midSmooth * 0.06
}
""".strip(),
    },
}


# ============================================================================
# 6. Contact Sheet & Showcase Preview Generator (Writes to ~/Pictures/bandarchy/Old/)
# ============================================================================


def render_group1_showcase_and_contact_sheet(
    category: str = "custom",
    source_stem: str | None = None,
    output_dir: str | None = None,
    contact_sheet_filename: str = "ContactSheet_Motion_Group1_XYZ_Strobe.png",
) -> dict[str, Any]:
    """Render Group A (`M01`–`M06`) preview frames and build the comparison contact sheet.

    Writes all preview frames and the contact sheet into `~/Pictures/bandarchy/Old/`
    so `categories/`, `processed/`, and `imported/` remain completely clean.
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
        "Berlin Strobe",
        "Acid Rainbow",
        "Ultraviolet Rave",
    ]

    rendered_frames: list[dict[str, Any]] = []
    effect_images: dict[str, Image.Image] = {}

    for idx, eff_name in enumerate(GROUP1_MOTION_EFFECTS):
        pal_name = palettes_cycle[idx % len(palettes_cycle)]
        fn = MOTION_GROUP1_DISPATCH[eff_name]
        im_out = fn(
            bundle,
            time_s=1.25 + idx * 0.35,
            beat_pulse=0.92,
            palette_name=pal_name,
            palette_boost=1.45,
            bloom_strength=0.46,
            opacity=0.96,
            variant_fade=0.38,
        )
        effect_images[eff_name] = im_out
        frame_filename = f"{eff_name}__{stem}.png"
        frame_path = os.path.join(out_dir, frame_filename)
        f1.atomic_save_png(im_out, frame_path)

        arr_hsv = np.asarray(im_out.convert("HSV"), dtype=np.float32) / 255.0
        rendered_frames.append(
            {
                "effect": eff_name,
                "title": GROUP_A_QML_SPECS[eff_name]["title"],
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
        font_title = ImageFont.truetype("/usr/share/fonts/TTF/DejaVuSans-Bold.ttf", 22)
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
        "BANDARCHY STAGE-2 PHOTO MOTION - GROUP A (M01-M06): 3D XYZ PLANE STROBE, TESSERACT & FLICKER",
        fill=(110, 231, 183),
        font=font_title,
    )
    draw.text(
        (pad_x, 46),
        f"Source Stem: {stem} ({category}) | Strobing across all 16 Stark Colour-Snatch variants with Variant Cross-Fade, Sector Alpha & Palette Bloom",
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

    # 3x2 grid of M01..M06
    for idx, eff_name in enumerate(GROUP1_MOTION_EFFECTS):
        r = idx // cols
        c = idx % cols
        cx = pad_x + c * (thumb_w + pad_x)
        cy = header_h + pad_y + r * (thumb_h + label_h + pad_y)

        im_thumb = ImageOps.fit(effect_images[eff_name], (thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(im_thumb, (cx, cy))
        draw.rectangle([cx, cy, cx + thumb_w - 1, cy + thumb_h - 1], outline=(110, 231, 183), width=2)

        spec = GROUP_A_QML_SPECS[eff_name]
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
        "group": "Group A (M01-M06): 3D XYZ Plane Manipulation, Multi-Effect Strobe & Temporal Flicker",
        "category": category,
        "source_stem": stem,
        "variants_loaded": len(bundle["ordered_list"]),
        "effects_rendered": len(rendered_frames),
        "contact_sheet": sheet_path,
        "frames": rendered_frames,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Bandarchy Stage-2 Photo Motion Engine — Group A (Effects M01–M06)."
    )
    parser.add_argument("--category", default="custom", help="Category in processed/<cat>/ (default: custom)")
    parser.add_argument("--source-stem", default=None, help="Specific source stem in processed/<cat>/")
    parser.add_argument("--effect", default=None, choices=GROUP1_MOTION_EFFECTS, help="Render a single Group A effect")
    parser.add_argument("--palette", default="Omarchy Cyber", choices=tuple(BANDARCHY_PALETTES.keys()), help="Active Bandarchy palette")
    parser.add_argument("--palette-index", type=int, default=None, help="Active Bandarchy palette index (0..30)")
    parser.add_argument("--opacity", type=float, default=0.96, help="Master layer opacity / fade_mix in [0.0, 1.0]")
    parser.add_argument("--fade-mix", type=float, default=None, help="Alias for master layer opacity / fade_mix in [0.0, 1.0]")
    parser.add_argument("--variant-fade", type=float, default=0.38, help="Cross-fade mix between consecutive Stark variants in [0.0, 1.0]")
    parser.add_argument("--time", type=float, default=1.25, help="Simulation timestamp in seconds")
    parser.add_argument("--beat-pulse", type=float, default=0.92, help="Audio beat transient pulse in [0.0, 1.5]")
    parser.add_argument("--output-dir", default=None, help="Output directory (defaults to ~/Pictures/bandarchy/Old)")
    parser.add_argument("--dump-qml-specs", action="store_true", help="Emit Group A QML/Shader integration specs as JSON")
    parser.add_argument("--json", action="store_true", help="Emit single-line JSON output")
    args = parser.parse_args(argv)

    try:
        resolved_opacity = _resolve_opacity(opacity=args.opacity, fade_mix=args.fade_mix)
        if args.dump_qml_specs:
            payload: dict[str, Any] = {"ok": True, "group": "Group A (M01-M06)", "specs": GROUP_A_QML_SPECS}
        elif args.effect:
            base_dir = bpi.resolve_pictures_bandarchy_dir()
            out_dir = args.output_dir or os.path.join(base_dir, "Old")
            os.makedirs(out_dir, exist_ok=True)
            bundle = load_source_16_variants(category=args.category, source_stem=args.source_stem, root_dir=base_dir)
            fn = MOTION_GROUP1_DISPATCH[args.effect]
            im = fn(
                bundle,
                time_s=args.time,
                beat_pulse=args.beat_pulse,
                palette_name=args.palette,
                palette_index=args.palette_index,
                opacity=resolved_opacity,
                fade_mix=args.fade_mix,
                variant_fade=args.variant_fade,
            )
            out_path = os.path.join(out_dir, f"{args.effect}__{bundle['source_stem']}.png")
            f1.atomic_save_png(im, out_path)
            payload = {
                "ok": True,
                "effect": args.effect,
                "category": args.category,
                "source_stem": bundle["source_stem"],
                "palette": args.palette,
                "palette_index": args.palette_index,
                "opacity": resolved_opacity,
                "variant_fade": args.variant_fade,
                "output_path": out_path,
            }
        else:
            payload = render_group1_showcase_and_contact_sheet(
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
