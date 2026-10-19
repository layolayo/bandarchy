#!/usr/bin/env python3
"""Bandarchy Stage-2 Real-Time Photo Motion & World-Bending Engine — Group B (Effects M07–M12).

Implements Group B (Kaleidoscopic Mirrors, Sacred Symmetry & Infinite Tiling) of the 25
Stage-2 Real-Time Photo Motion, Strobe & World-Bending Visualiser Effects for the
Bandarchy Photo Layer:

  - M07_Fractal_Mirror_Cathedral_Fold:
      Dynamic 2/4/6/8/12/16-fold bilateral and dihedral mirror folding where mirror axes
      rotate and fold inward on bass hits into a Gothic rose-window cathedral geometry,
      alternating and smoothly cross-fading Stark effect variants (`01`..`16`) across
      mirror wedges while enhancing colours matching the active Bandarchy palette
      (`PALETTES[paletteIndex]`).
  - M08_Escher_Hyperbolic_Infinite_Tiling:
      Log-polar and hyperbolic Poincaré disc conformal tiling that repeats the stark
      photograph infinitely toward both the centre singularity and the circular horizon
      while alternating and cross-fading between different Stark effect variants
      (`01`..`16`) of the same image across adjacent hyperbolic ring tiles.
  - M09_Hexagonal_Honeycomb_Multi_Effect_Mosaic:
      Tiles the visualiser stage into an audio-pulsing hexagonal honeycomb lattice where
      each hexagonal cell renders a synchronised zoomed and rotated view of the photograph
      strobing and cross-fading through different Stark effect variants (`01`..`16`)
      with active-palette highlighted hex borders.
  - M10_Droste_Recursive_Portal_Zoom:
      Infinite recursive Picture-in-Picture spiral Droste zoom where each nested frame
      and the photograph's obsidian black (`Y < 0.14`) or stark white (`Y > 0.84`) sector
      acts as a live recursive window containing the next Stark effect variant of the
      same image scaled and rotated inside it.
  - M11_Sliding_2D_Torus_Parallax_Wall:
      Three depth-layered infinite-scrolling 2D torus-tiled walls moving at orthogonal
      and diagonal parallax vectors: background tiled in `13_Obsidian_Neon_Edge_Snatch`,
      midground counter-sliding in `05_Omarchy_Cyber_Tritone_Stark`, and foreground
      luma-keyed in `01_SinCity_Chroma_Snatch`, with full variant cross-fading and
      sector-selective alpha blending.
  - M12_Sacred_Mandala_Aperture_Blades:
      Slices the photograph into 8–12 overlapping mechanical camera-iris / sacred lotus
      aperture blades that twist and open/close with the music envelope, alternating
      Stark effect variants across even/odd blades and blooming active palette colours.

Also provides drop-in QML / HTML5 Context2D / GLSL Shader specifications (`GROUP_B_QML_SPECS`)
for direct integration into Bandarchy's `Visualiser.qml`, `PsychedelicEngine.js`, and
`PhotoMotionEngine.js`.

All prose, documentation, comments, and identifiers strictly adhere to British English.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys
from typing import Any

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
ALL_16_STARK_EFFECTS = bpi.ALL_16_EFFECTS

BANDARCHY_PALETTE_LIST = pmg1.BANDARCHY_PALETTE_LIST
BANDARCHY_PALETTES = pmg1.BANDARCHY_PALETTES
SECTOR_ALPHA_MODES = pmg1.SECTOR_ALPHA_MODES
VARIANT_FADE_MODES = pmg1.VARIANT_FADE_MODES
PhotoMotionError = pmg1.PhotoMotionError
PhotoMotionGroup2Error = pmg1.PhotoMotionError

GROUP2_MOTION_EFFECTS: tuple[str, ...] = (
    "M07_Fractal_Mirror_Cathedral_Fold",
    "M08_Escher_Hyperbolic_Infinite_Tiling",
    "M09_Hexagonal_Honeycomb_Multi_Effect_Mosaic",
    "M10_Droste_Recursive_Portal_Zoom",
    "M11_Sliding_2D_Torus_Parallax_Wall",
    "M12_Sacred_Mandala_Aperture_Blades",
)
GROUP2_EFFECT_IDS: tuple[str, ...] = GROUP2_MOTION_EFFECTS

# Compatibility aliases synchronised with PhotoMotionEngine.js / BANDARCHY_PHOTO_LAYER_GUIDE.md
GROUP2_EFFECT_ALIASES: dict[str, str] = {
    "M07_Quad_Octa_Mirror_Symmetry_Fold": "M07_Fractal_Mirror_Cathedral_Fold",
    "M08_Infinite_Mosaic_Variant_Matrix_Tiling": "M08_Escher_Hyperbolic_Infinite_Tiling",
    "M09_Fractal_Droste_Recursive_Frame_In_Frame": "M10_Droste_Recursive_Portal_Zoom",
    "M10_Sliding_Tectonic_Mirror_Tessellation": "M11_Sliding_2D_Torus_Parallax_Wall",
    "M11_Hexagonal_Honeycomb_Kaleidoscope_Array": "M09_Hexagonal_Honeycomb_Multi_Effect_Mosaic",
    "M12_Split_Horizon_Inception_90Deg_Fold": "M12_Sacred_Mandala_Aperture_Blades",
}


# Re-export shared helpers so photo_motion_group2 is self-contained and consistent with Group 1
_resolve_opacity = pmg1._resolve_opacity
get_palette_rgb_matrix = pmg1.get_palette_rgb_matrix
crossfade_variants = pmg1.crossfade_variants
compute_sector_alpha = pmg1.compute_sector_alpha
enhance_palette_colours = pmg1.enhance_palette_colours
load_source_16_variants = pmg1.load_source_16_variants
bilinear_sample_rgb = pmg1.bilinear_sample_rgb
render_cyber_horizon_backdrop = pmg1.render_cyber_horizon_backdrop
finalise_motion_frame = pmg1.finalise_motion_frame


# ============================================================================
# 1. Group B Geometric & Symmetry Sampling Utilities
# ============================================================================


def _pingpong01(val: np.ndarray) -> np.ndarray:
    """Fold arbitrary real coordinates continuously into `[0.0, 1.0]` via triangle reflection."""
    mod2 = np.mod(val, 2.0)
    return np.where(mod2 <= 1.0, mod2, 2.0 - mod2).astype(np.float32)


def _sample_wrapped_or_mirrored(
    tex: np.ndarray,
    u: np.ndarray,
    v: np.ndarray,
    mirror: bool = True,
) -> np.ndarray:
    """Sample a texture `(H, W, 3)` using either mirror-reflected or torus-wrapped UV coordinates."""
    if mirror:
        u_norm = np.clip(_pingpong01(u), 0.0, 1.0)
        v_norm = np.clip(_pingpong01(v), 0.0, 1.0)
    else:
        u_norm = np.clip(np.mod(u, 1.0), 0.0, 1.0)
        v_norm = np.clip(np.mod(v, 1.0), 0.0, 1.0)
    valid = np.ones(u_norm.shape, dtype=bool)
    return bilinear_sample_rgb(tex, u_norm, v_norm, valid)


def _prepare_blended_variant(
    variants: list[np.ndarray],
    idx_a: int,
    idx_b: int,
    variant_fade: float,
    fade_mode: str,
    pal: np.ndarray,
) -> np.ndarray:
    """Return a cross-faded Stark variant pair in `[0.0, 1.0]` float32 RGB."""
    num_v = len(variants)
    va = variants[int(idx_a) % num_v]
    vb = variants[int(idx_b) % num_v]
    return crossfade_variants(
        va,
        vb,
        variant_fade=variant_fade,
        fade_mode=fade_mode,
        palette_rgb=pal,
    )


# ============================================================================
# 2. Group B Motion, Mirror & Tiling Effect Implementations (M07–M12)
# ============================================================================


def effect_m07_fractal_mirror_cathedral_fold(
    bundle: dict[str, Any],
    *,
    time_s: float = 1.35,
    beat_pulse: float = 0.92,
    folds: int = 8,
    inward_fold: float = 0.36,
    axis_angle_deg: float = 22.5,
    cathedral_rings: int = 3,
    palette_name: str = "Omarchy Cyber",
    palette_index: int | None = None,
    palette_boost: float = 1.48,
    bloom_strength: float = 0.44,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.38,
    fade_mode: str = "smoothstep",
    sector_alpha_mode: str = "black_void_transparent",
    black_void_floor: float = 0.18,
    return_rgba: bool = False,
) -> Image.Image:
    """M07: Fractal Mirror Cathedral Fold.

    Folds the photograph across dynamic 2/4/6/8/12/16-fold bilateral and dihedral mirror
    axes that rotate and fold inward on bass hits into a Gothic rose-window cathedral
    vault:
      - Even and odd dihedral wedges alternate between complementary Stark effect variants
        (`01`..`16`) of the same source image, smoothly cross-fading across variants via
        `variant_fade` and across mirror boundaries.
      - Concentric Gothic pointed-arch rings fold inward on `beat_pulse` and swap to the
        `13_Obsidian_Neon_Edge_Snatch` and `16_Prism_Kaleidoscope_Sector_Snatch` variants.
      - Enhances colours matching the active Bandarchy palette (`PALETTES[paletteIndex]`)
        and illuminates the dihedral mirror seams with glowing palette laser ribs.
    """
    w, h = bundle["width"], bundle["height"]
    variants: list[np.ndarray] = bundle["ordered_list"]
    num_v = len(variants)
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)

    allowed_folds = (2, 4, 6, 8, 12, 16)
    n_folds = min(allowed_folds, key=lambda k: abs(k - int(folds)))
    pulse = float(np.clip(beat_pulse, 0.0, 1.5))
    fold_depth = float(np.clip(inward_fold, 0.0, 1.0)) * (0.75 + 0.35 * pulse)

    backdrop = render_cyber_horizon_backdrop(
        w, h, pal, pitch_deg=-14.0, yaw_deg=float(time_s) * 12.0, beat_pulse=pulse
    )

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    aspect = w / max(h, 1)
    nx = ((xx / max(w - 1, 1)) * 2.0 - 1.0) * aspect
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0

    # Bilateral + cathedral pointed-arch inward fold on bass hits
    arch_shift = 0.18 * fold_depth * (1.0 - np.exp(-np.abs(nx) * 2.2))
    fx = np.abs(nx) - fold_depth * 0.22 * np.sin(np.abs(ny) * math.pi * 1.5 + float(time_s) * 1.4)
    fy = np.abs(ny + arch_shift) - fold_depth * 0.18 * np.cos(np.abs(nx) * math.pi * 1.5)

    r = np.hypot(nx, ny)
    theta = np.arctan2(ny, nx) + math.radians(float(axis_angle_deg) + float(time_s) * 18.0 + pulse * 14.0)

    sector_angle = (2.0 * math.pi) / float(n_folds)
    theta_pos = np.mod(theta, 2.0 * math.pi)
    wedge_idx = np.floor(theta_pos / sector_angle).astype(np.int32)
    wedge_parity = np.mod(wedge_idx, 2).astype(np.float32)

    # Dihedral reflection inside each wedge: 0 -> sector_angle -> 0
    local_theta = np.mod(theta_pos, sector_angle)
    folded_theta = np.where(local_theta > 0.5 * sector_angle, sector_angle - local_theta, local_theta)
    norm_wedge = folded_theta / max(0.5 * sector_angle, 1e-5)

    # Pointed Gothic cathedral rose-window radial modulation
    n_rings = max(1, min(int(cathedral_rings), 6))
    arch_petal = 0.5 + 0.5 * np.cos(norm_wedge * math.pi)
    r_cathedral = r * (1.0 - 0.24 * fold_depth * arch_petal) + 0.08 * fold_depth * np.sin(
        r * n_rings * math.pi * 2.0 - float(time_s) * 2.4
    )
    ring_idx = np.mod(np.floor(np.clip(r_cathedral, 0.0, 3.0) * float(n_rings)), n_rings).astype(np.int32)

    # Folded UV coordinates into the photograph
    u_fold = 0.5 + 0.48 * (r_cathedral * np.cos(folded_theta * 1.35) + 0.35 * fx)
    v_fold = 0.5 + 0.48 * (r_cathedral * np.sin(folded_theta * 1.35) + 0.35 * fy)

    step_base = int(math.floor(float(time_s) * 2.5 + pulse * 2.0)) % num_v
    var_even = _prepare_blended_variant(
        variants,
        (step_base + 0) % num_v,
        (step_base + 4) % num_v,
        variant_fade=variant_fade,
        fade_mode=fade_mode,
        pal=pal,
    )
    var_odd = _prepare_blended_variant(
        variants,
        (step_base + 12) % num_v,
        (step_base + 15) % num_v,
        variant_fade=variant_fade,
        fade_mode=fade_mode,
        pal=pal,
    )
    var_arch = _prepare_blended_variant(
        variants,
        (step_base + 7) % num_v,
        (step_base + 9) % num_v,
        variant_fade=variant_fade,
        fade_mode=fade_mode,
        pal=pal,
    )

    sample_even = _sample_wrapped_or_mirrored(var_even, u_fold, v_fold, mirror=True)
    sample_odd = _sample_wrapped_or_mirrored(var_odd, u_fold * 1.08 + 0.06, v_fold * 1.08 - 0.04, mirror=True)
    sample_arch = _sample_wrapped_or_mirrored(var_arch, 1.0 - u_fold, v_fold, mirror=True)

    # Smooth cross-fade across dihedral wedge seams and cathedral rose-window rings
    seam_dist = np.minimum(norm_wedge, 1.0 - norm_wedge)
    wedge_blend = np.where(
        wedge_parity < 0.5,
        f1.smoothstep(0.0, 0.14, seam_dist),
        1.0 - f1.smoothstep(0.0, 0.14, seam_dist),
    )[:, :, None]
    composited = sample_even * wedge_blend + sample_odd * (1.0 - wedge_blend)

    ring_mask = (np.mod(ring_idx, 2) == 1).astype(np.float32)
    ring_wave = f1.smoothstep(0.35, 0.65, 0.5 + 0.5 * np.sin(r_cathedral * n_rings * math.pi)) * ring_mask
    composited = composited * (1.0 - 0.48 * ring_wave[:, :, None]) + sample_arch * (0.48 * ring_wave[:, :, None])

    # Glowing palette-coloured cathedral mirror ribs & rose-window tracery
    rib_glow = np.exp(-seam_dist * 44.0) * (0.40 + 0.24 * pulse)
    ring_boundary = np.abs(np.sin(r_cathedral * n_rings * math.pi))
    tracery_glow = np.exp(-ring_boundary * 36.0) * (0.28 + 0.18 * pulse)

    c_rib = pal[0 % len(pal)]
    c_tracery = pal[1 % len(pal)]
    c_core = pal[2 % len(pal)]
    centre_rose = np.exp(-r * r * 14.0) * (0.22 + 0.18 * pulse)

    composited = (
        composited
        + c_rib[None, None, :] * rib_glow[:, :, None]
        + c_tracery[None, None, :] * tracery_glow[:, :, None]
        + c_core[None, None, :] * centre_rose[:, :, None]
    )
    composited = enhance_palette_colours(
        np.clip(composited, 0.0, 1.0),
        palette_name=palette_name,
        palette_index=palette_index,
        palette_boost=palette_boost,
        bloom_strength=bloom_strength,
        beat_pulse=pulse,
    )

    fg_alpha = compute_sector_alpha(
        composited,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=black_void_floor,
    )
    fg_alpha = np.clip(np.maximum(fg_alpha, rib_glow * 0.95 + tracery_glow * 0.85), 0.0, 1.0)
    blended_scene = backdrop * (1.0 - fg_alpha[:, :, None]) + composited * fg_alpha[:, :, None]

    return finalise_motion_frame(
        blended_scene,
        fg_alpha,
        backdrop,
        opacity=master_opacity,
        return_rgba=return_rgba,
    )


def effect_m08_escher_hyperbolic_infinite_tiling(
    bundle: dict[str, Any],
    *,
    time_s: float = 1.40,
    beat_pulse: float = 0.90,
    ring_Period: float = 0.62,
    angular_branches: int = 6,
    mobius_drift: float = 0.24,
    palette_name: str = "Tokyo Synthwave",
    palette_index: int | None = None,
    palette_boost: float = 1.45,
    bloom_strength: float = 0.45,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.42,
    fade_mode: str = "luma_wipe",
    sector_alpha_mode: str = "black_void_transparent",
    black_void_floor: float = 0.20,
    return_rgba: bool = False,
) -> Image.Image:
    """M08: Escher Hyperbolic Infinite Tiling (Log-Polar & Poincaré Disc Conformal Tessellation).

    Applies a conformal Poincaré hyperbolic disc and log-polar mapping that tiles the
    stark photograph infinitely toward both the centre singularity (`r -> 0`) and the
    circular hyperbolic horizon (`r -> 1`), whilst an outer hyperbolic architectural
    spandrel tiles toward the screen corners:
      - Adjacent conformal ring tiles and angular sectors alternate across all 16
        pre-rendered Stark variants (`01`..`16`) of the same image with smooth
        cross-fading (`variant_fade`).
      - Geodesic hyperbolic arcs glow in the active Bandarchy palette colours.
    """
    w, h = bundle["width"], bundle["height"]
    variants: list[np.ndarray] = bundle["ordered_list"]
    num_v = len(variants)
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)
    pulse = float(np.clip(beat_pulse, 0.0, 1.5))

    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-10.0, yaw_deg=-18.0, beat_pulse=pulse)

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    aspect = w / max(h, 1)
    zx = ((xx / max(w - 1, 1)) * 2.0 - 1.0) * aspect * 0.92
    zy = ((yy / max(h - 1, 1)) * 2.0 - 1.0) * 0.92

    # Möbius automorphism of the unit disc: w = (z - a) / (1 - conj(a) * z)
    drift_mag = float(np.clip(mobius_drift, 0.0, 0.65)) * (0.65 + 0.35 * pulse)
    ax = drift_mag * math.cos(float(time_s) * 0.9)
    ay = drift_mag * math.sin(float(time_s) * 0.9)

    num_x = zx - ax
    num_y = zy - ay
    den_x = 1.0 - (ax * zx + ay * zy)
    den_y = -(ax * zy - ay * zx)
    den_norm2 = np.maximum(den_x * den_x + den_y * den_y, 1e-5)

    wx = (num_x * den_x + num_y * den_y) / den_norm2
    wy = (num_y * den_x - num_x * den_y) / den_norm2

    r_disc = np.hypot(wx, wy)
    theta = np.arctan2(wy, wx) + float(time_s) * 0.45

    # Hyperbolic metric distance: rho = artanh(clamp(r, 0, 0.992)) + log-polar near origin
    r_clamped_inner = np.clip(r_disc, 0.035, 0.985)
    hyperbolic_rho = np.arctanh(r_clamped_inner) * 1.35 - np.log(r_clamped_inner) * 0.55

    # Outside the unit Poincaré horizon (r > 1), reflect reciprocally (r -> 1/r) so corners also tile infinitely
    r_outer = np.clip(1.0 / np.maximum(r_disc, 1.001), 0.05, 0.985)
    rho_outer = np.arctanh(r_outer) * 1.35 + np.log(np.maximum(r_disc, 1.0)) * 1.25
    in_disc = r_disc <= 1.0
    rho = np.where(in_disc, hyperbolic_rho, rho_outer)

    period = max(float(ring_Period), 0.20)
    branches = max(2, int(angular_branches))

    radial_coord = rho / period - float(time_s) * (0.85 + 0.35 * pulse)
    angular_coord = (theta / (2.0 * math.pi)) * float(branches)

    # Escher spiral shear coupling radial and angular coordinates
    spiral_u = radial_coord + 0.25 * angular_coord
    spiral_v = angular_coord - 0.15 * radial_coord

    ring_cell = np.floor(spiral_u).astype(np.int32)
    sect_cell = np.floor(spiral_v).astype(np.int32)

    local_u = _pingpong01(spiral_u)
    local_v = _pingpong01(spiral_v)

    base_step = int(math.floor(float(time_s) * 2.0)) % num_v
    v_pairs = [
        _prepare_blended_variant(
            variants, (base_step + k * 4) % num_v, (base_step + k * 4 + 2) % num_v, variant_fade, fade_mode, pal
        )
        for k in range(4)
    ]

    sampled_tiles = [_sample_wrapped_or_mirrored(vp, local_u, local_v, mirror=True) for vp in v_pairs]
    tile_selector = np.mod(ring_cell + sect_cell + np.where(in_disc, 0, 2), 4)

    composited = np.zeros((h, w, 3), dtype=np.float32)
    for k in range(4):
        mask_k = (tile_selector == k)[:, :, None].astype(np.float32)
        composited += sampled_tiles[k] * mask_k

    # Cross-fade tile borders with hyperbolic geodesic arcs in active palette colours
    du = np.minimum(local_u, 1.0 - local_u)
    dv = np.minimum(local_v, 1.0 - local_v)
    cell_edge = np.minimum(du, dv)
    geodesic_glow = np.exp(-cell_edge * 32.0) * (0.45 + 0.30 * pulse)
    horizon_circle_glow = np.exp(-np.abs(r_disc - 1.0) * 34.0) * (0.75 + 0.30 * pulse)

    c0 = pal[0 % len(pal)]
    c1 = pal[1 % len(pal)]
    c2 = pal[3 % len(pal)]
    ring_tint = np.where((np.mod(ring_cell, 2) == 0)[:, :, None], c0[None, None, :], c1[None, None, :])

    composited = (
        composited
        + ring_tint * geodesic_glow[:, :, None]
        + c2[None, None, :] * horizon_circle_glow[:, :, None]
    )
    composited = enhance_palette_colours(
        np.clip(composited, 0.0, 1.0),
        palette_name=palette_name,
        palette_index=palette_index,
        palette_boost=palette_boost,
        bloom_strength=bloom_strength,
        beat_pulse=pulse,
    )

    fg_alpha = compute_sector_alpha(
        composited,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=black_void_floor,
    )
    fg_alpha = np.clip(np.maximum(fg_alpha, geodesic_glow * 0.90 + horizon_circle_glow * 0.95), 0.0, 1.0)
    blended_scene = backdrop * (1.0 - fg_alpha[:, :, None]) + composited * fg_alpha[:, :, None]

    return finalise_motion_frame(
        blended_scene,
        fg_alpha,
        backdrop,
        opacity=master_opacity,
        return_rgba=return_rgba,
    )


def effect_m09_hexagonal_honeycomb_multi_effect_mosaic(
    bundle: dict[str, Any],
    *,
    time_s: float = 1.30,
    beat_pulse: float = 0.94,
    hex_cols: int = 6,
    cell_zoom: float = 1.18,
    cell_twist_deg: float = 18.0,
    palette_name: str = "Cyber Neon",
    palette_index: int | None = None,
    palette_boost: float = 1.50,
    bloom_strength: float = 0.46,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.40,
    fade_mode: str = "palette_key",
    sector_alpha_mode: str = "black_void_transparent",
    black_void_floor: float = 0.20,
    return_rgba: bool = False,
) -> Image.Image:
    """M09: Hexagonal Honeycomb Multi-Effect Mosaic.

    Tiles the visualiser stage into an audio-pulsing hexagonal honeycomb lattice where
    each hex cell `(q, r)` renders a synchronised zoomed and rotated view of the
    photograph strobing and cross-fading through all 16 pre-rendered Stark effect
    variants (`01`..`16`) of the same image, framed by bevelled active-palette neon
    hexagonal borders.
    """
    w, h = bundle["width"], bundle["height"]
    variants: list[np.ndarray] = bundle["ordered_list"]
    num_v = len(variants)
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)
    pulse = float(np.clip(beat_pulse, 0.0, 1.5))

    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-16.0, yaw_deg=14.0, beat_pulse=pulse)

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    aspect = w / max(h, 1)
    nx = ((xx / max(w - 1, 1)) * 2.0 - 1.0) * aspect
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0

    cols = max(2, min(int(hex_cols), 16))
    hex_radius = (aspect * 2.0) / (math.sqrt(3.0) * float(cols))
    sqrt3 = math.sqrt(3.0)

    q_f = (sqrt3 / 3.0 * nx - 1.0 / 3.0 * ny) / max(hex_radius, 1e-5)
    r_f = (2.0 / 3.0 * ny) / max(hex_radius, 1e-5)
    s_f = -q_f - r_f

    rq = np.round(q_f)
    rr = np.round(r_f)
    rs = np.round(s_f)

    dq = np.abs(rq - q_f)
    dr = np.abs(rr - r_f)
    ds = np.abs(rs - s_f)

    cond_q = (dq > dr) & (dq > ds)
    cond_r = (~cond_q) & (dr > ds)
    rq = np.where(cond_q, -rr - rs, rq)
    rr = np.where(cond_r, -rq - rs, rr)
    rs = np.where((~cond_q) & (~cond_r), -rq - rr, rs)

    q_int = rq.astype(np.int32)
    r_int = rr.astype(np.int32)

    cx = hex_radius * sqrt3 * (rq + 0.5 * rr)
    cy = hex_radius * 1.5 * rr

    lx = (nx - cx) / max(hex_radius, 1e-5)
    ly = (ny - cy) / max(hex_radius, 1e-5)

    hex_dist = np.maximum(np.abs(lx) * (2.0 / sqrt3), np.abs(lx) / sqrt3 + np.abs(ly))

    cell_dist_origin = np.hypot(cx, cy)
    cell_phase = cell_dist_origin * 2.2 - float(time_s) * 2.6
    rot_rad = math.radians(float(cell_twist_deg)) * np.sin(cell_phase) * (0.6 + 0.5 * pulse)
    cos_a = np.cos(rot_rad)
    sin_a = np.sin(rot_rad)

    zoom = max(float(cell_zoom), 0.35) * (1.0 - 0.14 * pulse * np.cos(cell_phase))
    rx = (lx * cos_a - ly * sin_a) / np.maximum(zoom, 0.25)
    ry = (lx * sin_a + ly * cos_a) / np.maximum(zoom, 0.25)

    global_u = (nx / max(aspect, 1e-5) + 1.0) * 0.5
    global_v = (ny + 1.0) * 0.5
    cell_u = 0.5 + 0.42 * rx + 0.22 * (global_u - 0.5)
    cell_v = 0.5 + 0.42 * ry + 0.22 * (global_v - 0.5)

    step = int(math.floor(float(time_s) * 3.0 + pulse * 2.0)) % num_v
    cell_hash = np.mod(q_int * 5 + r_int * 9 + step, 8)

    variant_pool: list[np.ndarray] = []
    for k in range(8):
        va_idx = (step + k * 2) % num_v
        vb_idx = (step + k * 2 + 1) % num_v
        variant_pool.append(
            _prepare_blended_variant(
                variants,
                va_idx,
                vb_idx,
                variant_fade=variant_fade,
                fade_mode=fade_mode,
                pal=pal,
            )
        )

    composited = np.zeros((h, w, 3), dtype=np.float32)
    for k in range(8):
        mask_k = (cell_hash == k)[:, :, None].astype(np.float32)
        if np.any(mask_k):
            sampled_k = _sample_wrapped_or_mirrored(variant_pool[k], cell_u, cell_v, mirror=True)
            composited += sampled_k * mask_k

    bevel_dark = 1.0 - 0.35 * f1.smoothstep(0.76, 0.96, hex_dist)
    border_rim = f1.smoothstep(0.86, 0.99, hex_dist) * (0.75 + 0.30 * pulse)
    corner_spark = np.exp(-np.abs(hex_dist - 0.98) * 35.0) * f1.smoothstep(0.65, 0.98, np.hypot(lx, ly))

    pal_cell_idx = np.mod(q_int * 3 - r_int * 2, len(pal))
    cell_pal_rgb = pal[pal_cell_idx]

    composited = (
        composited * bevel_dark[:, :, None]
        + cell_pal_rgb * (border_rim + 0.65 * corner_spark)[:, :, None]
    )
    composited = enhance_palette_colours(
        np.clip(composited, 0.0, 1.0),
        palette_name=palette_name,
        palette_index=palette_index,
        palette_boost=palette_boost,
        bloom_strength=bloom_strength,
        beat_pulse=pulse,
    )

    fg_alpha = compute_sector_alpha(
        composited,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=black_void_floor,
    )
    fg_alpha = np.clip(np.maximum(fg_alpha, border_rim * 0.96), 0.0, 1.0)
    blended_scene = backdrop * (1.0 - fg_alpha[:, :, None]) + composited * fg_alpha[:, :, None]

    return finalise_motion_frame(
        blended_scene,
        fg_alpha,
        backdrop,
        opacity=master_opacity,
        return_rgba=return_rgba,
    )


def effect_m10_droste_recursive_portal_zoom(
    bundle: dict[str, Any],
    *,
    time_s: float = 1.45,
    beat_pulse: float = 0.92,
    levels: int = 6,
    scale_ratio: float = 0.62,
    spiral_twist_deg: float = 16.0,
    portal_sector: str = "black_and_frame",
    palette_name: str = "Berlin Strobe",
    palette_index: int | None = None,
    palette_boost: float = 1.46,
    bloom_strength: float = 0.48,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.36,
    fade_mode: str = "smoothstep",
    sector_alpha_mode: str = "black_void_transparent",
    black_void_floor: float = 0.16,
    return_rgba: bool = False,
) -> Image.Image:
    """M10: Droste Recursive Portal Zoom.

    Infinite recursive Picture-in-Picture spiral zoom where:
      1. Nested Droste frames (`levels`, default `6`) spiral inward with continuous
         logarithmic zoom (`time_s`) and per-level rotation (`spiral_twist_deg`), where
         each recursive depth level renders the next Stark effect variant (`01`..`16`)
         of the same photograph (`(base_idx + level * 3) % 16`) with smooth `variant_fade`.
      2. Crucially, the outer level's obsidian black (`Y < 0.15`) or stark white (`Y > 0.85`)
         sectors also act as live recursive alpha portals (`portal_sector`), allowing the
         deeper rotated Stark variant to shine directly through the dark or bright sectors
         of the parent level!
    """
    w, h = bundle["width"], bundle["height"]
    variants: list[np.ndarray] = bundle["ordered_list"]
    num_v = len(variants)
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)
    pulse = float(np.clip(beat_pulse, 0.0, 1.5))

    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-12.0, yaw_deg=20.0, beat_pulse=pulse)

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx / max(w - 1, 1)) * 2.0 - 1.0
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0

    n_levels = max(2, min(int(levels), 10))
    ratio = float(np.clip(scale_ratio, 0.42, 0.82))
    zoom_phase = (float(time_s) * 0.75 + pulse * 0.22) % 1.0
    live_scale_boost = math.pow(1.0 / ratio, zoom_phase)

    step_base = int(math.floor(float(time_s) * 0.75 + pulse * 0.22)) % num_v

    composited = backdrop.copy()
    accum_alpha = np.zeros((h, w), dtype=np.float32)

    level_layers: list[tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]] = []
    for lvl in range(n_levels):
        lvl_scale = math.pow(ratio, lvl) * live_scale_boost
        if lvl_scale > 2.4:
            continue

        angle_rad = math.radians((lvl - zoom_phase) * float(spiral_twist_deg) + math.sin(float(time_s)) * 6.0)
        ca, sa = math.cos(angle_rad), math.sin(angle_rad)

        ux = (nx * ca + ny * sa) / max(lvl_scale, 1e-4)
        uy = (-nx * sa + ny * ca) / max(lvl_scale, 1e-4)
        max_c = np.maximum(np.abs(ux), np.abs(uy))
        in_box = max_c <= 1.0

        va_idx = (step_base + lvl * 3) % num_v
        vb_idx = (step_base + lvl * 3 + 5) % num_v
        lvl_tex = _prepare_blended_variant(
            variants,
            va_idx,
            vb_idx,
            variant_fade=variant_fade,
            fade_mode=fade_mode,
            pal=pal,
        )

        u_norm = np.clip((ux + 1.0) * 0.5, 0.0, 1.0)
        v_norm = np.clip((uy + 1.0) * 0.5, 0.0, 1.0)
        sampled_rgb = bilinear_sample_rgb(lvl_tex, u_norm, v_norm, in_box)

        frame_col = pal[lvl % len(pal)]
        rim = f1.smoothstep(0.92, 0.995, max_c) * in_box.astype(np.float32)
        outer_glow = (
            (1.0 - f1.smoothstep(1.0, 1.08, max_c))
            * (max_c > 1.0).astype(np.float32)
            * (0.55 + 0.35 * pulse)
        )
        sampled_rgb = np.clip(
            sampled_rgb * (1.0 - 0.65 * rim[:, :, None])
            + frame_col[None, None, :] * (rim * 1.25 + outer_glow * 0.85)[:, :, None],
            0.0,
            1.0,
        )
        box_alpha = np.clip(
            in_box.astype(np.float32) * (1.0 - f1.smoothstep(0.985, 1.002, max_c)) + outer_glow * 0.65,
            0.0,
            1.0,
        )
        level_layers.append((sampled_rgb, box_alpha, max_c, frame_col))

    for idx, (lvl_rgb, box_alpha, max_c, _frame_col) in enumerate(level_layers):
        luma = 0.2126 * lvl_rgb[:, :, 0] + 0.7152 * lvl_rgb[:, :, 1] + 0.0722 * lvl_rgb[:, :, 2]
        if idx + 1 < len(level_layers):
            next_rgb = level_layers[idx + 1][0]
            if portal_sector == "white_sector":
                portal_bleed = f1.smoothstep(0.75, 0.94, luma) * 0.58
            elif portal_sector == "black_sector":
                portal_bleed = (1.0 - f1.smoothstep(0.05, 0.22, luma)) * 0.62
            else:
                portal_bleed = (1.0 - f1.smoothstep(0.04, 0.20, luma)) * 0.48
            lvl_rgb = lvl_rgb * (1.0 - portal_bleed[:, :, None]) + next_rgb * portal_bleed[:, :, None]

        composited = composited * (1.0 - box_alpha[:, :, None]) + lvl_rgb * box_alpha[:, :, None]
        accum_alpha = np.clip(accum_alpha + box_alpha * (1.0 - accum_alpha), 0.0, 1.0)

    composited = enhance_palette_colours(
        np.clip(composited, 0.0, 1.0),
        palette_name=palette_name,
        palette_index=palette_index,
        palette_boost=palette_boost,
        bloom_strength=bloom_strength,
        beat_pulse=pulse,
    )

    sector_alpha = compute_sector_alpha(
        composited,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=black_void_floor,
    )
    fg_alpha = np.clip(accum_alpha * sector_alpha, 0.0, 1.0)
    blended_scene = backdrop * (1.0 - fg_alpha[:, :, None]) + composited * fg_alpha[:, :, None]

    return finalise_motion_frame(
        blended_scene,
        fg_alpha,
        backdrop,
        opacity=master_opacity,
        return_rgba=return_rgba,
    )


def effect_m11_sliding_2d_torus_parallax_wall(
    bundle: dict[str, Any],
    *,
    time_s: float = 1.35,
    beat_pulse: float = 0.92,
    bg_tiles: tuple[int, int] = (4, 4),
    mid_tiles: tuple[int, int] = (2, 2),
    fg_tiles: tuple[int, int] = (1, 1),
    scroll_speed: float = 0.42,
    palette_name: str = "Acid Rainbow",
    palette_index: int | None = None,
    palette_boost: float = 1.44,
    bloom_strength: float = 0.45,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.35,
    fade_mode: str = "smoothstep",
    sector_alpha_mode: str = "black_void_transparent",
    black_void_floor: float = 0.18,
    return_rgba: bool = False,
) -> Image.Image:
    """M11: Sliding 2D Torus Parallax Wall.

    Composites 3 depth-layered infinite-scrolling 2D torus-tiled walls moving at
    orthogonal and diagonal parallax vectors:
      - **Background Wall (`4x4` torus tiles)**: Tiled in `13_Obsidian_Neon_Edge_Snatch`
        (cross-faded with `10_Pulsar_Ridgeline_Colour_Snatch` via `variant_fade`),
        scrolling diagonally (`+vx, -vy`).
      - **Midground Wall (`2x2` counter-sliding tectonic torus tiles)**: Tiled in
        `05_Omarchy_Cyber_Tritone_Stark` (cross-faded with `08_Acid_Poster_4Sector_Snatch`),
        where alternating horizontal bands counter-slide to bass grooves and obsidian
        black sectors are alpha-keyed so the background neon edge grid shines through.
      - **Foreground Hero Wall (`1x1` or `2x1` torus plane)**: Tiled in
        `01_SinCity_Chroma_Snatch` (cross-faded with `14_Metallic_Relief_Sector_Snatch`),
        luma- and chroma-keyed over the midground and background walls with glowing
        active-palette parallax seam dividers.
    """
    w, h = bundle["width"], bundle["height"]
    variants_rgb: dict[str, np.ndarray] = bundle["variants_rgb"]
    ordered_list: list[np.ndarray] = bundle["ordered_list"]
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)
    pulse = float(np.clip(beat_pulse, 0.0, 1.5))
    spd = float(scroll_speed) * (0.75 + 0.40 * pulse)

    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-15.0, yaw_deg=16.0, beat_pulse=pulse)

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    u0 = xx / max(w - 1, 1)
    v0 = yy / max(h - 1, 1)

    v13_bg = variants_rgb.get("13_Obsidian_Neon_Edge_Snatch", ordered_list[12 % len(ordered_list)])
    v10_bg = variants_rgb.get("10_Pulsar_Ridgeline_Colour_Snatch", ordered_list[9 % len(ordered_list)])
    tex_bg = crossfade_variants(v13_bg, v10_bg, variant_fade=variant_fade * 0.65, fade_mode=fade_mode, palette_rgb=pal)

    v05_mid = variants_rgb.get("05_Omarchy_Cyber_Tritone_Stark", ordered_list[4 % len(ordered_list)])
    v08_mid = variants_rgb.get("08_Acid_Poster_4Sector_Snatch", ordered_list[7 % len(ordered_list)])
    tex_mid = crossfade_variants(v05_mid, v08_mid, variant_fade=variant_fade, fade_mode=fade_mode, palette_rgb=pal)

    v01_fg = variants_rgb.get("01_SinCity_Chroma_Snatch", ordered_list[0])
    v14_fg = variants_rgb.get("14_Metallic_Relief_Sector_Snatch", ordered_list[13 % len(ordered_list)])
    tex_fg = crossfade_variants(v01_fg, v14_fg, variant_fade=variant_fade, fade_mode=fade_mode, palette_rgb=pal)

    # 1. Background layer: diagonal torus scroll (4x4)
    bx, by = max(1, int(bg_tiles[0])), max(1, int(bg_tiles[1]))
    u_bg = u0 * bx + float(time_s) * spd * 0.95
    v_bg = v0 * by - float(time_s) * spd * 0.65
    layer_bg = _sample_wrapped_or_mirrored(tex_bg, u_bg, v_bg, mirror=False)
    bg_seam = np.maximum(
        np.exp(-np.minimum(np.mod(u_bg, 1.0), 1.0 - np.mod(u_bg, 1.0)) * 32.0),
        np.exp(-np.minimum(np.mod(v_bg, 1.0), 1.0 - np.mod(v_bg, 1.0)) * 32.0),
    )
    layer_bg = np.clip(layer_bg + pal[0 % len(pal)][None, None, :] * (bg_seam * 0.42)[:, :, None], 0.0, 1.0)

    # 2. Midground layer: orthogonal counter-sliding tectonic torus strips (2x2)
    mx, my = max(1, int(mid_tiles[0])), max(1, int(mid_tiles[1]))
    strip_dir = np.where(np.mod(np.floor(v0 * (my * 2)), 2) == 0, 1.0, -1.0).astype(np.float32)
    u_mid = u0 * mx + strip_dir * float(time_s) * spd * 1.35
    v_mid = v0 * my + 0.12 * math.sin(float(time_s) * 1.8)
    layer_mid = _sample_wrapped_or_mirrored(tex_mid, u_mid, v_mid, mirror=False)
    mid_seam = np.maximum(
        np.exp(-np.minimum(np.mod(u_mid, 1.0), 1.0 - np.mod(u_mid, 1.0)) * 28.0),
        np.exp(-np.minimum(np.mod(v0 * (my * 2), 1.0), 1.0 - np.mod(v0 * (my * 2), 1.0)) * 34.0),
    )
    layer_mid = np.clip(layer_mid + pal[1 % len(pal)][None, None, :] * (mid_seam * 0.55)[:, :, None], 0.0, 1.0)
    alpha_mid = compute_sector_alpha(
        layer_mid, opacity=0.78, sector_alpha_mode="chalk_and_neon_only", black_void_floor=0.12
    )
    alpha_mid = np.clip(np.maximum(alpha_mid, mid_seam * 0.85), 0.0, 1.0)

    # 3. Foreground layer: luma & chroma-keyed hero torus plane (1x1) with slow orbital drift
    fx, fy = max(1, int(fg_tiles[0])), max(1, int(fg_tiles[1]))
    u_fg = (u0 - 0.5) * (0.92 - 0.08 * pulse) * fx + 0.5 - 0.08 * math.cos(float(time_s) * 1.1)
    v_fg = (v0 - 0.5) * (0.92 - 0.08 * pulse) * fy + 0.5 + 0.06 * math.sin(float(time_s) * 1.1)
    layer_fg = _sample_wrapped_or_mirrored(tex_fg, u_fg, v_fg, mirror=True)

    luma_fg = 0.2126 * layer_fg[:, :, 0] + 0.7152 * layer_fg[:, :, 1] + 0.0722 * layer_fg[:, :, 2]
    max_fg = np.max(layer_fg, axis=2)
    min_fg = np.min(layer_fg, axis=2)
    sat_fg = (max_fg - min_fg) / np.maximum(max_fg, 1e-5)

    fg_key = np.maximum(f1.smoothstep(0.32, 0.72, luma_fg), f1.smoothstep(0.14, 0.38, sat_fg)) * 0.88

    composited = backdrop * 0.15 + layer_bg * 0.85
    composited = composited * (1.0 - alpha_mid[:, :, None]) + layer_mid * alpha_mid[:, :, None]
    composited = composited * (1.0 - fg_key[:, :, None]) + layer_fg * fg_key[:, :, None]

    composited = enhance_palette_colours(
        np.clip(composited, 0.0, 1.0),
        palette_name=palette_name,
        palette_index=palette_index,
        palette_boost=palette_boost,
        bloom_strength=bloom_strength,
        beat_pulse=pulse,
    )

    fg_alpha = compute_sector_alpha(
        composited,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=black_void_floor,
    )
    blended_scene = backdrop * (1.0 - fg_alpha[:, :, None]) + composited * fg_alpha[:, :, None]

    return finalise_motion_frame(
        blended_scene,
        fg_alpha,
        backdrop,
        opacity=master_opacity,
        return_rgba=return_rgba,
    )


def effect_m12_sacred_mandala_aperture_blades(
    bundle: dict[str, Any],
    *,
    time_s: float = 1.50,
    beat_pulse: float = 0.95,
    blade_count: int = 10,
    aperture_open: float = 0.34,
    blade_twist_deg: float = 28.0,
    palette_name: str = "Ultraviolet Rave",
    palette_index: int | None = None,
    palette_boost: float = 1.52,
    bloom_strength: float = 0.50,
    opacity: float = 1.0,
    fade_mix: float | None = None,
    variant_fade: float = 0.40,
    fade_mode: str = "palette_key",
    sector_alpha_mode: str = "black_void_transparent",
    black_void_floor: float = 0.18,
    return_rgba: bool = False,
) -> Image.Image:
    """M12: Sacred Mandala Aperture Blades.

    Slices the photograph into `8`–`12` overlapping camera-iris / sacred lotus-petal
    aperture blades that twist and open/close with the music envelope (`beat_pulse`):
      - Even and odd iris blades (plus an inner sacred lotus ring and central iris
        sanctum) alternate across different Stark effect variants (`01`..`16`) of the
        same photograph with smooth cross-fading (`variant_fade`).
      - Blade overlap edges cast subtle depth shadows and ignite with blooming active
        Bandarchy palette laser bevels.
    """
    w, h = bundle["width"], bundle["height"]
    variants: list[np.ndarray] = bundle["ordered_list"]
    num_v = len(variants)
    pal = get_palette_rgb_matrix(palette_name, palette_index=palette_index)
    master_opacity = _resolve_opacity(opacity=opacity, fade_mix=fade_mix)
    pulse = float(np.clip(beat_pulse, 0.0, 1.5))

    n_blades = max(6, min(int(blade_count), 16))
    iris_radius = float(np.clip(aperture_open, 0.10, 0.72)) * (0.78 + 0.32 * pulse)

    backdrop = render_cyber_horizon_backdrop(w, h, pal, pitch_deg=-10.0, yaw_deg=-22.0, beat_pulse=pulse)

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    aspect = w / max(h, 1)
    nx = ((xx / max(w - 1, 1)) * 2.0 - 1.0) * aspect
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0

    r = np.hypot(nx, ny)
    theta = np.arctan2(ny, nx)

    blade_sector = (2.0 * math.pi) / float(n_blades)
    spiral_theta = theta + 0.68 * np.log(np.maximum(r, 0.06)) - float(time_s) * 0.55
    blade_pos = np.mod(spiral_theta, 2.0 * math.pi) / blade_sector
    blade_idx = np.floor(blade_pos).astype(np.int32)
    blade_frac = blade_pos - blade_idx
    blade_parity = np.mod(blade_idx, 2)

    lotus_curve = iris_radius + 0.16 * np.sin(blade_frac * math.pi) + 0.08 * math.sin(float(time_s) * 2.2)
    outer_lotus_curve = lotus_curve + 0.42 + 0.14 * np.cos((1.0 - blade_frac) * math.pi)

    twist_rad = math.radians(float(blade_twist_deg) * (0.65 + 0.45 * pulse))
    angle_even = twist_rad + 0.18 * blade_frac
    angle_odd = -twist_rad - 0.18 * (1.0 - blade_frac)
    angle_sanctum = -float(time_s) * 0.65

    def _rotate_uv(ang: float | np.ndarray, zoom_s: float) -> tuple[np.ndarray, np.ndarray]:
        ca = np.cos(ang)
        sa = np.sin(ang)
        rx = (nx * ca - ny * sa) / (aspect * zoom_s)
        ry = (nx * sa + ny * ca) / zoom_s
        return (rx + 1.0) * 0.5, (ry + 1.0) * 0.5

    step = int(math.floor(float(time_s) * 2.4 + pulse * 1.8)) % num_v
    tex_sanctum = _prepare_blended_variant(
        variants, (step + 15) % num_v, (step + 0) % num_v, variant_fade, fade_mode, pal
    )
    tex_even_inner = _prepare_blended_variant(
        variants, (step + 2) % num_v, (step + 6) % num_v, variant_fade, fade_mode, pal
    )
    tex_odd_inner = _prepare_blended_variant(
        variants, (step + 4) % num_v, (step + 12) % num_v, variant_fade, fade_mode, pal
    )
    tex_even_outer = _prepare_blended_variant(
        variants, (step + 8) % num_v, (step + 13) % num_v, variant_fade, fade_mode, pal
    )
    tex_odd_outer = _prepare_blended_variant(
        variants, (step + 10) % num_v, (step + 14) % num_v, variant_fade, fade_mode, pal
    )

    u_sanc, v_sanc = _rotate_uv(angle_sanctum, 0.78)
    u_even, v_even = _rotate_uv(angle_even, 0.94)
    u_odd, v_odd = _rotate_uv(angle_odd, 1.06)

    rgb_sanctum = _sample_wrapped_or_mirrored(tex_sanctum, u_sanc, v_sanc, mirror=True)
    rgb_even_in = _sample_wrapped_or_mirrored(tex_even_inner, u_even, v_even, mirror=True)
    rgb_odd_in = _sample_wrapped_or_mirrored(tex_odd_inner, u_odd, v_odd, mirror=True)
    rgb_even_out = _sample_wrapped_or_mirrored(tex_even_outer, u_odd, v_even, mirror=True)
    rgb_odd_out = _sample_wrapped_or_mirrored(tex_odd_outer, u_even, v_odd, mirror=True)

    inner_rgb = np.where((blade_parity == 0)[:, :, None], rgb_even_in, rgb_odd_in)
    outer_rgb = np.where((blade_parity == 0)[:, :, None], rgb_even_out, rgb_odd_out)

    w_sanctum = 1.0 - f1.smoothstep(lotus_curve - 0.035, lotus_curve + 0.035, r)
    w_inner = (1.0 - w_sanctum) * (1.0 - f1.smoothstep(outer_lotus_curve - 0.04, outer_lotus_curve + 0.04, r))
    w_outer = np.clip(1.0 - w_sanctum - w_inner, 0.0, 1.0)

    composited = (
        rgb_sanctum * w_sanctum[:, :, None]
        + inner_rgb * w_inner[:, :, None]
        + outer_rgb * w_outer[:, :, None]
    )

    blade_seam_dist = np.minimum(blade_frac, 1.0 - blade_frac)
    overlap_shadow = 1.0 - 0.32 * f1.smoothstep(0.0, 0.18, 0.18 - blade_frac) * (1.0 - w_sanctum)
    blade_bevel_glow = np.exp(-blade_seam_dist * 30.0) * (1.0 - 0.5 * w_sanctum) * (0.65 + 0.35 * pulse)
    sanctum_rim_glow = np.exp(-np.abs(r - lotus_curve) * 34.0) * (0.85 + 0.35 * pulse)
    outer_rim_glow = np.exp(-np.abs(r - outer_lotus_curve) * 28.0) * (0.70 + 0.30 * pulse)

    c_blade = pal[np.mod(blade_idx, len(pal))]
    c_sanctum = pal[0 % len(pal)]
    c_outer = pal[2 % len(pal)]

    composited = (
        composited * overlap_shadow[:, :, None]
        + c_blade * blade_bevel_glow[:, :, None]
        + c_sanctum[None, None, :] * sanctum_rim_glow[:, :, None]
        + c_outer[None, None, :] * outer_rim_glow[:, :, None]
    )

    composited = enhance_palette_colours(
        np.clip(composited, 0.0, 1.0),
        palette_name=palette_name,
        palette_index=palette_index,
        palette_boost=palette_boost,
        bloom_strength=bloom_strength,
        beat_pulse=pulse,
    )

    fg_alpha = compute_sector_alpha(
        composited,
        opacity=1.0,
        sector_alpha_mode=sector_alpha_mode,
        black_void_floor=black_void_floor,
    )
    fg_alpha = np.clip(
        np.maximum(fg_alpha, blade_bevel_glow * 0.92 + sanctum_rim_glow * 0.96 + outer_rim_glow * 0.88),
        0.0,
        1.0,
    )
    blended_scene = backdrop * (1.0 - fg_alpha[:, :, None]) + composited * fg_alpha[:, :, None]

    return finalise_motion_frame(
        blended_scene,
        fg_alpha,
        backdrop,
        opacity=master_opacity,
        return_rgba=return_rgba,
    )


MOTION_GROUP2_DISPATCH: dict[str, Any] = {
    "M07_Fractal_Mirror_Cathedral_Fold": effect_m07_fractal_mirror_cathedral_fold,
    "M08_Escher_Hyperbolic_Infinite_Tiling": effect_m08_escher_hyperbolic_infinite_tiling,
    "M09_Hexagonal_Honeycomb_Multi_Effect_Mosaic": effect_m09_hexagonal_honeycomb_multi_effect_mosaic,
    "M10_Droste_Recursive_Portal_Zoom": effect_m10_droste_recursive_portal_zoom,
    "M11_Sliding_2D_Torus_Parallax_Wall": effect_m11_sliding_2d_torus_parallax_wall,
    "M12_Sacred_Mandala_Aperture_Blades": effect_m12_sacred_mandala_aperture_blades,
}
for _alias, _canonical in GROUP2_EFFECT_ALIASES.items():
    MOTION_GROUP2_DISPATCH[_alias] = MOTION_GROUP2_DISPATCH[_canonical]


# ============================================================================
# 3. Drop-In QML / Canvas / Shader Specifications for Bandarchy Integration
# ============================================================================


GROUP_B_QML_SPECS: dict[str, dict[str, Any]] = {
    "M07_Fractal_Mirror_Cathedral_Fold": {
        "id": "M07_Fractal_Mirror_Cathedral_Fold",
        "alias_id": "M07_Quad_Octa_Mirror_Symmetry_Fold",
        "title": "Fractal Mirror Cathedral Fold",
        "family": "Group B: Kaleidoscopic Mirrors, Sacred Symmetry & Infinite Tiling",
        "description": (
            "Dynamic 2/4/6/8/12/16-fold bilateral and dihedral mirror folding where mirror "
            "axes rotate and fold inward on bass hits into a Gothic rose-window cathedral, "
            "alternating and cross-fading Stark effect variants across wedges while enhancing "
            "colours matching the active Bandarchy palette (PALETTES[paletteIndex])."
        ),
        "audio_links": [
            {"source": "bassSmooth", "method": "Direct Value", "target": "inwardFoldDepth"},
            {"source": "beatPulse", "method": "Trigger / Step", "target": "dihedralFoldCount"},
            {"source": "midSmooth", "method": "Phase Accumulator", "target": "mirrorAxisAngleDeg"},
            {"source": "highSmooth", "method": "Direct Value", "target": "cathedralTraceryBloom"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.96},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.38},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.18},
            "folds": {"min": 2, "max": 16, "default": 8},
            "inwardFold": {"min": 0.0, "max": 1.0, "default": 0.36},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.48},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M07: Fractal Mirror Cathedral Fold
Item {
    id: m07CathedralFoldLayer
    anchors.fill: parent
    opacity: state.photoLayerOpacity
    property int dihedralFolds: state.mirrorFolds || 8
    property real axisAngleDeg: state.time * 18.0 + state.beatPulse * 14.0
    property real inwardFold: 0.28 + state.bassSmooth * 0.42
}
""".strip(),
    },
    "M08_Escher_Hyperbolic_Infinite_Tiling": {
        "id": "M08_Escher_Hyperbolic_Infinite_Tiling",
        "alias_id": "M08_Infinite_Mosaic_Variant_Matrix_Tiling",
        "title": "Escher Hyperbolic Infinite Tiling",
        "family": "Group B: Kaleidoscopic Mirrors, Sacred Symmetry & Infinite Tiling",
        "description": (
            "Log-polar and hyperbolic Poincaré disc conformal tiling that repeats the stark "
            "photograph infinitely toward both the centre singularity and the horizon while "
            "alternating between Stark effect variants (01..16) of the same image across "
            "adjacent hyperbolic ring tiles."
        ),
        "audio_links": [
            {"source": "bassSmooth", "method": "Phase Accumulator", "target": "hyperbolicRadialScroll"},
            {"source": "midSmooth", "method": "Direct Value", "target": "mobiusAutomorphismDrift"},
            {"source": "beatPulse", "method": "Trigger / Step", "target": "ringVariantPermutation"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.96},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.42},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.20},
            "angularBranches": {"min": 3, "max": 12, "default": 6},
            "mobiusDrift": {"min": 0.0, "max": 0.65, "default": 0.24},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.45},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M08: Escher Hyperbolic Infinite Tiling
Item {
    id: m08HyperbolicTilingLayer
    anchors.fill: parent
    opacity: state.photoLayerOpacity
    property int angularBranches: 6
    property real radialPhase: state.time * (0.85 + state.bassSmooth * 0.45)
    property real mobiusDrift: 0.22 * (0.65 + 0.35 * state.beatPulse)
}
""".strip(),
    },
    "M09_Hexagonal_Honeycomb_Multi_Effect_Mosaic": {
        "id": "M09_Hexagonal_Honeycomb_Multi_Effect_Mosaic",
        "alias_id": "M11_Hexagonal_Honeycomb_Kaleidoscope_Array",
        "title": "Hexagonal Honeycomb Multi-Effect Mosaic",
        "family": "Group B: Kaleidoscopic Mirrors, Sacred Symmetry & Infinite Tiling",
        "description": (
            "Tiles the stage into an audio-pulsing hexagonal honeycomb lattice where each "
            "hex cell renders a synchronised zoomed and rotated view of the photograph "
            "strobing and cross-fading through different Stark effect variants (01..16) "
            "with active-palette highlighted hex borders."
        ),
        "audio_links": [
            {"source": "beatPulse", "method": "Spring Impulse", "target": "hexCellZoomPulse"},
            {"source": "midSmooth", "method": "Direct Value", "target": "hexCellTwistDeg"},
            {"source": "highSmooth", "method": "Trigger / Step", "target": "hexVariantStrobeStep"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.96},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.40},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.20},
            "hexCols": {"min": 3, "max": 14, "default": 6},
            "cellZoom": {"min": 0.5, "max": 2.2, "default": 1.18},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.50},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M09: Hexagonal Honeycomb Multi-Effect Mosaic
Item {
    id: m09HoneycombMosaicLayer
    anchors.fill: parent
    opacity: state.photoLayerOpacity
    property int hexCols: 6
    property real cellZoom: 1.18 - state.beatPulse * 0.16
    property real cellTwistDeg: 18.0 * Math.sin(state.time * 2.2)
}
""".strip(),
    },
    "M10_Droste_Recursive_Portal_Zoom": {
        "id": "M10_Droste_Recursive_Portal_Zoom",
        "alias_id": "M09_Fractal_Droste_Recursive_Frame_In_Frame",
        "title": "Droste Recursive Portal Zoom",
        "family": "Group B: Kaleidoscopic Mirrors, Sacred Symmetry & Infinite Tiling",
        "description": (
            "Infinite recursive Picture-in-Picture spiral zoom where each nested frame and "
            "the photograph's obsidian black or stark white sector acts as a recursive "
            "window containing the next Stark effect variant of the same image scaled and "
            "rotated inside it."
        ),
        "audio_links": [
            {"source": "bassSmooth", "method": "Phase Accumulator", "target": "drosteSpiralZoomPhase"},
            {"source": "midSmooth", "method": "Direct Value", "target": "drosteTwistDeg"},
            {"source": "beatPulse", "method": "Direct Value", "target": "sectorPortalBleedAlpha"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.96},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.36},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.16},
            "levels": {"min": 3, "max": 9, "default": 6},
            "scaleRatio": {"min": 0.45, "max": 0.80, "default": 0.62},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.46},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M10: Droste Recursive Portal Zoom
Repeater {
    model: 6
    delegate: Item {
        anchors.fill: parent
        property real zoomPhase: (state.time * 0.75 + state.beatPulse * 0.22) % 1.0
        scale: Math.pow(0.62, index - zoomPhase)
        rotation: (index - zoomPhase) * 16.0
        opacity: state.photoLayerOpacity * 0.94
    }
}
""".strip(),
    },
    "M11_Sliding_2D_Torus_Parallax_Wall": {
        "id": "M11_Sliding_2D_Torus_Parallax_Wall",
        "alias_id": "M10_Sliding_Tectonic_Mirror_Tessellation",
        "title": "Sliding 2D Torus Parallax Wall",
        "family": "Group B: Kaleidoscopic Mirrors, Sacred Symmetry & Infinite Tiling",
        "description": (
            "Three depth-layered infinite-scrolling tiled walls moving at orthogonal and "
            "diagonal parallax vectors: background tiled in 13_Obsidian_Neon_Edge_Snatch, "
            "midground in 05_Omarchy_Cyber_Tritone_Stark, and foreground luma-keyed in "
            "01_SinCity_Chroma_Snatch."
        ),
        "audio_links": [
            {"source": "bassSmooth", "method": "Phase Accumulator", "target": "midgroundTectonicSlide"},
            {"source": "highSmooth", "method": "Phase Accumulator", "target": "backgroundDiagonalScroll"},
            {"source": "beatPulse", "method": "Direct Value", "target": "foregroundLumaKeyThreshold"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.96},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.35},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.18},
            "scrollSpeed": {"min": 0.05, "max": 1.50, "default": 0.42},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.44},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M11: Sliding 2D Torus Parallax Wall
Item {
    id: m11TorusParallaxLayer
    anchors.fill: parent
    opacity: state.photoLayerOpacity
    property string bgEffect: "13_Obsidian_Neon_Edge_Snatch"
    property string midEffect: "05_Omarchy_Cyber_Tritone_Stark"
    property string fgEffect: "01_SinCity_Chroma_Snatch"
}
""".strip(),
    },
    "M12_Sacred_Mandala_Aperture_Blades": {
        "id": "M12_Sacred_Mandala_Aperture_Blades",
        "alias_id": "M12_Split_Horizon_Inception_90Deg_Fold",
        "title": "Sacred Mandala Aperture Blades",
        "family": "Group B: Kaleidoscopic Mirrors, Sacred Symmetry & Infinite Tiling",
        "description": (
            "Slices the photograph into 8–12 overlapping camera-iris / lotus-petal aperture "
            "blades that twist and open/close with the music envelope, alternating Stark "
            "effect variants across even/odd blades and blooming active palette colours."
        ),
        "audio_links": [
            {"source": "bassSmooth", "method": "Direct Value", "target": "apertureIrisRadius"},
            {"source": "midSmooth", "method": "Direct Value", "target": "bladeTwistDeg"},
            {"source": "beatPulse", "method": "Trigger / Step", "target": "evenOddBladeVariantSwap"},
        ],
        "uniforms": {
            "opacity": {"min": 0.0, "max": 1.0, "default": 0.96},
            "fadeMix": {"min": 0.0, "max": 1.0, "default": 0.96},
            "variantFade": {"min": 0.0, "max": 1.0, "default": 0.40},
            "blackVoidAlpha": {"min": 0.0, "max": 1.0, "default": 0.18},
            "bladeCount": {"min": 6, "max": 16, "default": 10},
            "apertureOpen": {"min": 0.10, "max": 0.72, "default": 0.34},
            "paletteBoost": {"min": 0.0, "max": 2.5, "default": 1.52},
        },
        "qml_snippet": """
// Bandarchy Visualiser.qml — M12: Sacred Mandala Aperture Blades
Item {
    id: m12MandalaApertureLayer
    anchors.fill: parent
    opacity: state.photoLayerOpacity
    property int bladeCount: 10
    property real apertureRadius: 0.34 * (0.78 + 0.32 * state.beatPulse)
    property real bladeTwistDeg: 28.0 * (0.65 + 0.45 * state.beatPulse)
}
""".strip(),
    },
}
GROUP2_QML_SPECS = GROUP_B_QML_SPECS


# ============================================================================
# 4. Contact Sheet & Showcase Preview Generator (Writes to ~/Pictures/bandarchy/Old/)
# ============================================================================


def render_group2_showcase_and_contact_sheet(
    category: str = "custom",
    source_stem: str | None = None,
    output_dir: str | None = None,
    contact_sheet_filename: str = "ContactSheet_Motion_Group2_Mirrors_Tiling.png",
) -> dict[str, Any]:
    """Render Group B (`M07`–`M12`) preview frames and build the comparison contact sheet.

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

    for idx, eff_name in enumerate(GROUP2_MOTION_EFFECTS):
        pal_name = palettes_cycle[idx % len(palettes_cycle)]
        fn = MOTION_GROUP2_DISPATCH[eff_name]
        im_out = fn(
            bundle,
            time_s=1.30 + idx * 0.32,
            beat_pulse=0.92,
            palette_name=pal_name,
            palette_boost=1.48,
            bloom_strength=0.45,
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
                "title": GROUP_B_QML_SPECS[eff_name]["title"],
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
        "BANDARCHY STAGE-2 PHOTO MOTION - GROUP B (M07-M12): KALEIDOSCOPIC MIRRORS, SACRED SYMMETRY & TILING",
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

    # 3x2 grid of M07..M12
    for idx, eff_name in enumerate(GROUP2_MOTION_EFFECTS):
        r = idx // cols
        c = idx % cols
        cx = pad_x + c * (thumb_w + pad_x)
        cy = header_h + pad_y + r * (thumb_h + label_h + pad_y)

        im_thumb = ImageOps.fit(effect_images[eff_name], (thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(im_thumb, (cx, cy))
        draw.rectangle([cx, cy, cx + thumb_w - 1, cy + thumb_h - 1], outline=(110, 231, 183), width=2)

        spec = GROUP_B_QML_SPECS[eff_name]
        pal_name = palettes_cycle[idx % len(palettes_cycle)]
        clean_desc = (
            spec["description"]
            .replace("\u2013", "-")
            .replace("\u2014", "-")
            .replace("\u00e9", "e")
        )
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
        "group": "Group B (M07-M12): Kaleidoscopic Mirrors, Sacred Symmetry & Infinite Tiling",
        "category": category,
        "source_stem": stem,
        "variants_loaded": len(bundle["ordered_list"]),
        "effects_rendered": len(rendered_frames),
        "contact_sheet": sheet_path,
        "frames": rendered_frames,
    }


def main(argv: list[str] | None = None) -> int:
    all_choices = tuple(GROUP2_MOTION_EFFECTS) + tuple(GROUP2_EFFECT_ALIASES.keys())
    parser = argparse.ArgumentParser(
        description="Bandarchy Stage-2 Photo Motion Engine — Group B (Effects M07–M12)."
    )
    parser.add_argument("--category", default="custom", help="Category in processed/<cat>/ (default: custom)")
    parser.add_argument("--source-stem", default=None, help="Specific source stem in processed/<cat>/")
    parser.add_argument("--effect", default=None, choices=all_choices, help="Render a single Group B effect")
    parser.add_argument(
        "--palette",
        default="Omarchy Cyber",
        choices=tuple(BANDARCHY_PALETTES.keys()),
        help="Active Bandarchy palette",
    )
    parser.add_argument("--palette-index", type=int, default=None, help="Active Bandarchy palette index (0..30)")
    parser.add_argument("--opacity", type=float, default=0.96, help="Master layer opacity / fade_mix in [0.0, 1.0]")
    parser.add_argument(
        "--fade-mix", type=float, default=None, help="Alias for master layer opacity / fade_mix in [0.0, 1.0]"
    )
    parser.add_argument(
        "--variant-fade",
        type=float,
        default=0.38,
        help="Cross-fade mix between consecutive Stark variants in [0.0, 1.0]",
    )
    parser.add_argument("--time", type=float, default=1.35, help="Simulation timestamp in seconds")
    parser.add_argument("--beat-pulse", type=float, default=0.92, help="Audio beat transient pulse in [0.0, 1.5]")
    parser.add_argument("--output-dir", default=None, help="Output directory (defaults to ~/Pictures/bandarchy/Old)")
    parser.add_argument("--contact-sheet", action="store_true", help="Render the Group B showcase and contact sheet into Old/")
    parser.add_argument("--dump-qml-specs", action="store_true", help="Emit Group B QML/Shader integration specs as JSON")
    parser.add_argument("--json", action="store_true", help="Emit single-line JSON output")
    args = parser.parse_args(argv)

    try:
        resolved_opacity = _resolve_opacity(opacity=args.opacity, fade_mix=args.fade_mix)
        if args.dump_qml_specs:
            payload: dict[str, Any] = {"ok": True, "group": "Group B (M07-M12)", "specs": GROUP_B_QML_SPECS}
        elif args.effect:
            canonical_eff = GROUP2_EFFECT_ALIASES.get(args.effect, args.effect)
            base_dir = bpi.resolve_pictures_bandarchy_dir()
            out_dir = args.output_dir or os.path.join(base_dir, "Old")
            os.makedirs(out_dir, exist_ok=True)
            bundle = load_source_16_variants(category=args.category, source_stem=args.source_stem, root_dir=base_dir)
            fn = MOTION_GROUP2_DISPATCH[canonical_eff]
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
                "variant_fade": args.variant_fade,
                "output_path": out_path,
            }
        else:
            payload = render_group2_showcase_and_contact_sheet(
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
