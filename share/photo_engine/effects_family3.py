#!/usr/bin/env python3
"""effects_family3.py — Bandarchy Stark Snapshot & Sector Colour-Snatch Engine (Family 3: Effects 09–12).

Standalone, Bandarchy-compatible visual effect processor implementing:
  - 09_Zine_Halftone_Colour_Snatch
  - 10_Pulsar_Ridgeline_Colour_Snatch
  - 11_Glitch_Sector_Chromatic_Shear
  - 12_CRT_Phosphor_Sector_Snatch

Designed for seamless integration into Bandarchy (`bin/bandarchy` and `Visualiser.qml`)
while operating non-destructively on user photographs in `~/Pictures/bandarchy/sources/`
and writing stark colour-snatch copies to `~/Pictures/bandarchy/effects/` or
`~/.cache/bandarchy/stark-art/`.

All prose, comments, documentation, and CLI outputs strictly adhere to British English.
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
from typing import Any, Callable

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

# Safety ceilings matching bin/bandarchy security invariants
MAX_ART_BYTES = 15 * 1024 * 1024  # 15 MiB ceiling
MAX_IMAGE_PIXELS = 36_000_000     # Protect against decompression bombs
VALID_IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")
SYNTHETIC_CHROMA_THRESHOLD = 0.04  # Below this mean saturation, source is treated as B&W

Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS

# Bandarchy / Omarchy signature palettes (from PsychedelicEngine.js & Omarchy themes)
BANDARCHY_PALETTES: dict[str, list[str]] = {
    "Omarchy Cyber": ["#6ee7b7", "#f472b6", "#38bdf8", "#fbbf24", "#a78bfa", "#34d399"],
    "Acid Rainbow": ["#ff007f", "#00f5d4", "#fee440", "#9b5de5", "#00bbf9", "#f15bb5"],
    "Cyber Neon": ["#00f5ff", "#ff2a85", "#7b2cbf", "#38b000", "#ffbe0b", "#4cc9f0"],
    "Solar Flare": ["#ff4800", "#ff9e00", "#ff0055", "#ffd000", "#ff6d00", "#ff206e"],
    "Tokyo Synthwave": ["#ff00a0", "#00f0ff", "#7a04eb", "#fe75fe", "#ff124f", "#05d9e8"],
    "Outrun Sunset": ["#ff2a6d", "#ff9e00", "#d1f7ff", "#05d9e8", "#7700a6", "#ffbe0b"],
    "Emerald Matrix": ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#059669", "#22d3ee"],
    "Ultraviolet Rave": ["#c084fc", "#f472b6", "#38bdf8", "#818cf8", "#e879f9", "#22d3ee"],
}

FAMILY3_EFFECT_NAMES: tuple[str, ...] = (
    "09_Zine_Halftone_Colour_Snatch",
    "10_Pulsar_Ridgeline_Colour_Snatch",
    "11_Glitch_Sector_Chromatic_Shear",
    "12_CRT_Phosphor_Sector_Snatch",
)


class StarkEffectError(ValueError):
    """Operational error raised when validating or processing a stark image copy."""


@dataclass(frozen=True)
class AudioModulation:
    """Live or static Bandarchy 48-band FFT / beat envelope modulation parameters."""

    bass: float = 0.35
    mid: float = 0.35
    high: float = 0.35
    onset: float = 0.25

    def clamped(self) -> "AudioModulation":
        return AudioModulation(
            bass=float(np.clip(self.bass, 0.0, 2.0)),
            mid=float(np.clip(self.mid, 0.0, 2.0)),
            high=float(np.clip(self.high, 0.0, 2.0)),
            onset=float(np.clip(self.onset, 0.0, 2.0)),
        )


@dataclass
class LuminanceSectorAnalysis:
    """Decomposed luminance, saturation, edge gradient, and B&W classification."""

    rgb: np.ndarray          # float32 (H, W, 3) in [0, 1]
    luminance: np.ndarray    # float32 (H, W) in [0, 1] (Rec.709 Y)
    stark_lum: np.ndarray    # float32 (H, W) in [0, 1] local-contrast S-curve luminance
    saturation: np.ndarray   # float32 (H, W) in [0, 1] HSV saturation
    edge_mag: np.ndarray     # float32 (H, W) in [0, 1] normalised Sobel gradient magnitude
    mean_saturation: float   # scalar mean saturation across frame
    is_monochrome: bool      # True if mean_saturation < SYNTHETIC_CHROMA_THRESHOLD
    black_sector: np.ndarray   # bool (H, W) deep shadow sector (< 0.35)
    mid_sector: np.ndarray     # bool (H, W) structural mid-tone sector (0.35..0.72)
    white_sector: np.ndarray   # bool (H, W) bright highlight sector (> 0.72)


# ---------------------------------------------------------------------------
# Security, I/O, XDG Resolution & Colour Conversion Utilities
# ---------------------------------------------------------------------------


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


def list_source_images(sources_dir: str) -> list[str]:
    """Return sorted regular, non-symlinked image paths inside `sources_dir`."""
    abs_sources_dir = os.path.abspath(sources_dir)
    if not os.path.isdir(abs_sources_dir):
        raise StarkEffectError(f"Sources directory does not exist: {abs_sources_dir}")
    valid_paths: list[str] = []
    for fn in sorted(os.listdir(abs_sources_dir)):
        if fn.startswith("."):
            continue
        if os.path.splitext(fn)[1].lower() not in VALID_IMAGE_EXTENSIONS:
            continue
        candidate = os.path.join(abs_sources_dir, fn)
        try:
            lst = os.lstat(candidate)
        except OSError:
            continue
        if stat.S_ISLNK(lst.st_mode) or not stat.S_ISREG(lst.st_mode):
            continue
        if 0 < lst.st_size <= MAX_ART_BYTES:
            valid_paths.append(candidate)
    return valid_paths


def hex_to_rgb_float(hex_colour: str) -> np.ndarray:
    """Convert a '#rrggbb' hex string into a float32 RGB vector in [0, 1]."""
    clean = hex_colour.strip().lstrip("#")
    if len(clean) != 6:
        raise StarkEffectError(f"Invalid hex colour string: {hex_colour!r}")
    r = int(clean[0:2], 16) / 255.0
    g = int(clean[2:4], 16) / 255.0
    b = int(clean[4:6], 16) / 255.0
    return np.array([r, g, b], dtype=np.float32)


def get_palette_rgb(palette_name: str = "Omarchy Cyber") -> np.ndarray:
    """Return an (N, 3) float32 array of RGB colours in [0, 1] for the named Bandarchy palette."""
    hex_list = BANDARCHY_PALETTES.get(palette_name) or BANDARCHY_PALETTES["Omarchy Cyber"]
    return np.stack([hex_to_rgb_float(h) for h in hex_list], axis=0)


def validate_source_image_path(path: str) -> str:
    """Verify source path is a regular, non-symlinked image file within MAX_ART_BYTES."""
    if not path or not isinstance(path, str):
        raise StarkEffectError("Source image path must be a non-empty string.")
    abs_path = os.path.abspath(path)
    ext = os.path.splitext(abs_path)[1].lower()
    if ext not in VALID_IMAGE_EXTENSIONS:
        raise StarkEffectError(
            f"Unsupported image extension {ext!r} for {abs_path}; allowed: {VALID_IMAGE_EXTENSIONS}"
        )
    try:
        lst = os.lstat(abs_path)
    except OSError as exc:
        raise StarkEffectError(f"Cannot stat source image {abs_path}: {exc}") from exc

    if stat.S_ISLNK(lst.st_mode):
        raise StarkEffectError(f"Refusing symlinked source image: {abs_path}")
    if not stat.S_ISREG(lst.st_mode):
        raise StarkEffectError(f"Source path is not a regular file: {abs_path}")
    if lst.st_size <= 0:
        raise StarkEffectError(f"Source image file is empty: {abs_path}")
    if lst.st_size > MAX_ART_BYTES:
        raise StarkEffectError(
            f"Source image exceeds MAX_ART_BYTES ({lst.st_size} > {MAX_ART_BYTES}): {abs_path}"
        )
    return abs_path


def load_source_image(path: str, max_dim: int = 1280) -> Image.Image:
    """Safely load, EXIF-transpose, and convert a source image to RGB without mutating the source."""
    abs_path = validate_source_image_path(path)
    try:
        with Image.open(abs_path) as raw_im:
            raw_im.load()
            oriented = ImageOps.exif_transpose(raw_im)
            rgb_im = oriented.convert("RGB")
            w, h = rgb_im.size
            if w <= 0 or h <= 0:
                raise StarkEffectError(f"Invalid image dimensions {w}x{h}")
            if max_dim > 0 and max(w, h) > max_dim:
                scale = max_dim / float(max(w, h))
                new_w = max(1, int(round(w * scale)))
                new_h = max(1, int(round(h * scale)))
                rgb_im = rgb_im.resize((new_w, new_h), Image.Resampling.LANCZOS)
            return rgb_im
    except StarkEffectError:
        raise
    except Exception as exc:
        raise StarkEffectError(f"Failed to decode image {abs_path}: {exc}") from exc


def atomic_save_png(image: Image.Image, output_path: str) -> str:
    """Write an image atomically via a temporary file in the target directory, rejecting symlinks."""
    if not output_path or not isinstance(output_path, str):
        raise StarkEffectError("Output path must be a non-empty string.")
    abs_out = os.path.abspath(output_path)
    try:
        out_lst = os.lstat(abs_out)
        if stat.S_ISLNK(out_lst.st_mode):
            raise StarkEffectError(f"Refusing to overwrite symlinked output path: {abs_out}")
        if stat.S_ISDIR(out_lst.st_mode):
            raise StarkEffectError(f"Output path is a directory: {abs_out}")
    except FileNotFoundError:
        pass
    out_dir = os.path.dirname(abs_out)
    os.makedirs(out_dir, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(prefix=".bandarchy_stark_", suffix=".png", dir=out_dir)
    try:
        with os.fdopen(fd, "wb") as fobj:
            image.save(fobj, format="PNG")
        os.chmod(tmp_path, 0o644)
        os.replace(tmp_path, abs_out)
    except Exception:
        if os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
        raise
    return abs_out


# ---------------------------------------------------------------------------
# Luminance, Edge & Sector Colour-Snatch Analysis
# ---------------------------------------------------------------------------


def _sobel_gradients(lum: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Compute horizontal (gx), vertical (gy), and normalised gradient magnitude on a 2D array."""
    p = np.pad(lum, 1, mode="edge")
    gx = (
        (p[:-2, 2:] + 2.0 * p[1:-1, 2:] + p[2:, 2:])
        - (p[:-2, :-2] + 2.0 * p[1:-1, :-2] + p[2:, :-2])
    ).astype(np.float32)
    gy = (
        (p[2:, :-2] + 2.0 * p[2:, 1:-1] + p[2:, 2:])
        - (p[:-2, :-2] + 2.0 * p[:-2, 1:-1] + p[:-2, 2:])
    ).astype(np.float32)
    mag = np.hypot(gx, gy)
    sub_mag = mag[::4, ::4] if mag.shape[0] >= 16 and mag.shape[1] >= 16 else mag
    p98 = float(np.percentile(sub_mag, 98.5)) if sub_mag.size > 0 else 1.0
    norm_mag = np.clip(mag * np.float32(1.0 / max(p98, 1e-5)), 0.0, 1.0).astype(np.float32)
    return gx, gy, norm_mag


def analyse_sectors(image: Image.Image) -> LuminanceSectorAnalysis:
    """Decompose an RGB PIL Image into Rec.709 luminance, stark local contrast, saturation, and sectors."""
    rgb_im = image.convert("RGB")
    # Unsharp mask copy to accentuate architectural ribs, foliage, and mechanical contours
    crisped_im = rgb_im.filter(ImageFilter.UnsharpMask(radius=2.2, percent=170, threshold=2))
    rgb = np.asarray(rgb_im, dtype=np.float32) * np.float32(1.0 / 255.0)
    rgb_crisp = np.asarray(crisped_im, dtype=np.float32) * np.float32(1.0 / 255.0)

    # Rec.709 luminance
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    lum = (np.float32(0.2126) * r + np.float32(0.7152) * g + np.float32(0.0722) * b).astype(np.float32)
    lum_crisp = (
        np.float32(0.2126) * rgb_crisp[..., 0]
        + np.float32(0.7152) * rgb_crisp[..., 1]
        + np.float32(0.0722) * rgb_crisp[..., 2]
    ).astype(np.float32)

    # Normalise luminance percentiles for stark dynamic range
    sub_lc = lum_crisp[::4, ::4] if lum_crisp.shape[0] >= 16 and lum_crisp.shape[1] >= 16 else lum_crisp
    if sub_lc.size > 0:
        lo_v, hi_v = np.percentile(sub_lc, [3.0, 97.0])
        lo, hi = float(lo_v), float(hi_v)
    else:
        lo, hi = 0.0, 1.0
    stretched = np.clip((lum_crisp - np.float32(lo)) * np.float32(1.0 / max(hi - lo, 0.08)), 0.0, 1.0)
    # Steep S-curve for brutalist starkness
    s_curve = stretched * stretched * (np.float32(3.0) - np.float32(2.0) * stretched)
    stark_lum = np.clip(np.float32(0.5) + (s_curve - np.float32(0.5)) * np.float32(1.28), 0.0, 1.0).astype(np.float32)

    # HSV Saturation (using pairwise np.maximum/minimum for 10x faster execution than axis=-1 reduction)
    cmax = np.maximum(np.maximum(r, g), b)
    cmin = np.minimum(np.minimum(r, g), b)
    delta = cmax - cmin
    saturation = np.where(cmax > 1e-5, delta / np.maximum(cmax, 1e-5), np.float32(0.0)).astype(np.float32)
    mean_sat = float(saturation.mean()) if saturation.size > 0 else 0.0
    is_mono = mean_sat < SYNTHETIC_CHROMA_THRESHOLD

    _, _, edge_mag = _sobel_gradients(stark_lum)

    black_sector = stark_lum < 0.35
    mid_sector = (stark_lum >= 0.35) & (stark_lum <= 0.72)
    white_sector = stark_lum > 0.72

    return LuminanceSectorAnalysis(
        rgb=rgb,
        luminance=lum,
        stark_lum=stark_lum,
        saturation=saturation,
        edge_mag=edge_mag,
        mean_saturation=mean_sat,
        is_monochrome=is_mono,
        black_sector=black_sector,
        mid_sector=mid_sector,
        white_sector=white_sector,
    )


def boost_chroma(rgb: np.ndarray, boost: float = 1.9, vibrance: float = 0.25) -> np.ndarray:
    """Hyper-saturate RGB colours while preserving perceptual luminance."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    lum = (np.float32(0.2126) * r + np.float32(0.7152) * g + np.float32(0.0722) * b)[..., None]
    diff = rgb - lum
    cmax = np.maximum(np.maximum(r, g), b)[..., None]
    cmin = np.minimum(np.minimum(r, g), b)[..., None]
    sat = np.where(cmax > 1e-5, (cmax - cmin) / np.maximum(cmax, 1e-5), np.float32(0.0))
    # Vibrance boosts moderately saturated pixels strongly without clipping already-maxed neon
    adaptive_gain = np.float32(boost) + np.float32(vibrance) * (np.float32(1.0) - sat)
    boosted = lum + diff * adaptive_gain
    # Slight highlight lift so snatched colours glow vividly
    boosted = np.clip(boosted * np.float32(1.08) + np.float32(0.02), 0.0, 1.0)
    return boosted.astype(np.float32)


def synthesise_palette_colour_field(
    analysis: LuminanceSectorAnalysis,
    palette_name: str = "Omarchy Cyber",
    phase_shift: float = 0.0,
) -> np.ndarray:
    """Generate a rich synthetic colour-snatch field for B&W (or low-chroma) images using Bandarchy palettes.

    Maps luminance sectors, local structural edges, and spatial coordinates into
    smooth multi-stop Bandarchy palette colours so monochrome sources exhibit striking
    sector colour-snatching.
    """
    pal = get_palette_rgb(palette_name)
    n_cols = len(pal)
    h, w = analysis.stark_lum.shape
    yy = np.linspace(0.0, 1.0, h, dtype=np.float32)[:, None]
    xx = np.linspace(0.0, 1.0, w, dtype=np.float32)[None, :]

    # Combine luminance, edge energy, and subtle diagonal wave to index into the palette
    wave = 0.55 * analysis.stark_lum + 0.25 * analysis.edge_mag + 0.20 * (0.6 * xx + 0.4 * yy)
    pos = np.mod(wave + phase_shift, 1.0) * (n_cols - 1)
    idx0 = np.floor(pos).astype(np.int32)
    idx1 = np.clip(idx0 + 1, 0, n_cols - 1)
    frac = (pos - idx0)[..., None].astype(np.float32)

    col = pal[idx0] * (1.0 - frac) + pal[idx1] * frac
    # Modulate brightness by lifted luminance so texture & detail remain razor-sharp
    detail_lum = np.clip(0.32 + 0.78 * analysis.stark_lum + 0.25 * analysis.edge_mag, 0.20, 1.05)[..., None]
    return np.clip(col * detail_lum, 0.0, 1.0).astype(np.float32)


def get_snatch_colour_field(
    analysis: LuminanceSectorAnalysis,
    palette_name: str = "Omarchy Cyber",
    chroma_boost: float = 1.95,
    phase_shift: float = 0.0,
) -> np.ndarray:
    """Return hyper-saturated true colours for colour images, or synthetic Bandarchy palette colours for B&W."""
    if analysis.is_monochrome:
        return synthesise_palette_colour_field(analysis, palette_name=palette_name, phase_shift=phase_shift)

    # For colour images, boost existing chroma AND blend synthetic palette colour into low-saturation bright areas
    boosted_true = boost_chroma(analysis.rgb, boost=chroma_boost, vibrance=0.35)
    synth_field = synthesise_palette_colour_field(analysis, palette_name=palette_name, phase_shift=phase_shift)
    # Where the source pixel already has colour (sat > 0.12), keep its true boosted colour;
    # where a colour photo has neutral grey structures inside a snatched sector, infuse subtle palette tint
    chroma_weight = np.clip((analysis.saturation - 0.06) / 0.22, 0.0, 1.0)[..., None]
    tint_blend = boosted_true * (0.35 + 0.65 * chroma_weight) + synth_field * (0.65 * (1.0 - chroma_weight))
    return np.clip(tint_blend, 0.0, 1.0).astype(np.float32)


def _smooth_mask(mask: np.ndarray, radius: float = 2.0) -> np.ndarray:
    """Feather a 2D float32 mask in [0, 1] using a fast PIL GaussianBlur."""
    u8 = np.clip(mask * 255.0, 0.0, 255.0).astype(np.uint8)
    blurred = Image.fromarray(u8, mode="L").filter(ImageFilter.GaussianBlur(radius=radius))
    return (np.asarray(blurred, dtype=np.float32) / 255.0)


# ---------------------------------------------------------------------------
# Effect 09: 09_Zine_Halftone_Colour_Snatch
# ---------------------------------------------------------------------------


def effect_09_zine_halftone_colour_snatch(
    image: Image.Image,
    palette_name: str = "Omarchy Cyber",
    audio: AudioModulation | None = None,
    analysis: LuminanceSectorAnalysis | None = None,
) -> Image.Image:
    """09_Zine_Halftone_Colour_Snatch: Coarse underground zine halftone screen in B&W sectors with unscreened colour-snatch in the primary focal sector."""
    aud = (audio or AudioModulation()).clamped()
    if analysis is None:
        analysis = analyse_sectors(image)
    h, w = analysis.stark_lum.shape

    # 1. Build 45-degree rotated underground zine halftone dot screen for B&W sectors
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    pitch = max(4.5, 7.0 - 1.2 * aud.bass)  # Dot cell pitch in pixels
    angle = math.radians(45.0)
    cos_a, sin_a = math.cos(angle), math.sin(angle)
    u = (xx * cos_a - yy * sin_a) / pitch
    v = (xx * sin_a + yy * cos_a) / pitch

    # Radial dot profile in [-1, 1] -> [0, 1]
    dot_wave = 0.5 * (np.cos(2.0 * np.pi * u) + np.cos(2.0 * np.pi * v))
    dot_norm = 0.5 + 0.5 * dot_wave  # 1 at dot centre, 0 at cell corner

    # Map stark luminance against the halftone screen with slight anti-aliased edge
    lum_screen = analysis.stark_lum * 0.92 + 0.04
    halftone_val = np.clip((lum_screen - (1.0 - dot_norm)) * 7.5 + 0.5, 0.0, 1.0)

    # Reinforce stark inked woodcut/comic contours in the B&W halftone sectors
    ink_contour = np.clip((analysis.edge_mag - 0.32) * 2.5, 0.0, 1.0)
    halftone_bw = halftone_val * (1.0 - 0.85 * ink_contour)

    # Zine paper palette: deep printing-press obsidian ink (#0a0c12) on stark warm chalk newsprint (#f5f3ec)
    ink_dark = np.array([0.039, 0.047, 0.071], dtype=np.float32)
    paper_light = np.array([0.961, 0.953, 0.925], dtype=np.float32)
    bw_zine_rgb = ink_dark[None, None, :] * (1.0 - halftone_bw[..., None]) + paper_light[None, None, :] * halftone_bw[..., None]

    # 2. Compute Primary Subject / Focal Sector Mask for unscreened Colour-Snatching
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0
    nx = (xx / max(w - 1, 1)) * 2.0 - 1.0
    radial_dist = np.hypot(nx * 0.85, ny * 0.85)
    centre_focus = np.clip(1.15 - 0.55 * radial_dist, 0.25, 1.0)

    if not analysis.is_monochrome:
        # Normalise saturation per-image so both subtle architectural photos and neon photos snatch a bold ~34% sector
        s_lo = float(np.percentile(analysis.saturation, 35.0))
        s_hi = float(np.percentile(analysis.saturation, 96.0))
        norm_sat = np.clip((analysis.saturation - s_lo) / max(s_hi - s_lo, 0.05), 0.0, 1.0)
        tonal_gate = np.clip((analysis.stark_lum - 0.10) / 0.18, 0.0, 1.0)
        snatch_raw = (0.65 * norm_sat + 0.35 * analysis.edge_mag) * tonal_gate * (0.50 + 0.50 * centre_focus)
    else:
        # B&W source: synthetic colour-snatch in the upper-mid / focal structural sector
        mid_distance = 1.0 - np.clip(np.abs(analysis.stark_lum - 0.58) / 0.38, 0.0, 1.0)
        snatch_raw = (0.60 * mid_distance + 0.40 * analysis.edge_mag) * (0.45 + 0.55 * centre_focus)

    snatch_raw_smooth = _smooth_mask(snatch_raw, radius=3.2)
    p64 = float(np.percentile(snatch_raw_smooth, 64.0))
    p72 = float(np.percentile(snatch_raw_smooth, 72.0))
    span = max(p72 - p64, 0.04)
    snatch_mask = np.clip((snatch_raw_smooth - p64) / span, 0.0, 1.0)
    snatch_mask = _smooth_mask(snatch_mask, radius=1.8)

    # Quantise mask for a bold zine stencil cut-out look with a dark printing-ink keyline border
    stencil_core = np.clip((snatch_mask - 0.35) * 4.5, 0.0, 1.0)
    stencil_border = np.clip(1.0 - np.abs(snatch_mask - 0.35) * 9.0, 0.0, 1.0)

    # 3. Unscreened hyper-vivid colour in the snatched sector
    colour_field = get_snatch_colour_field(
        analysis, palette_name=palette_name, chroma_boost=2.35 + 0.25 * aud.onset, phase_shift=0.12
    )
    # Add crisp micro-contrast to the unscreened colour sector
    colour_snatched = np.clip(
        colour_field * (0.88 + 0.28 * analysis.stark_lum[..., None]) * (1.0 - 0.32 * ink_contour[..., None]),
        0.0,
        1.0,
    )

    # Composite: B&W Halftone Sectors + Dark Zine Keyline around Snatch Boundary + Unscreened Colour Snatch
    out = bw_zine_rgb * (1.0 - stencil_core[..., None]) + colour_snatched * stencil_core[..., None]
    out = out * (1.0 - 0.78 * stencil_border[..., None]) + ink_dark[None, None, :] * (0.78 * stencil_border[..., None])
    out_u8 = np.clip(out * 255.0, 0.0, 255.0).astype(np.uint8)
    return Image.fromarray(out_u8, mode="RGB")


# ---------------------------------------------------------------------------
# Effect 10: 10_Pulsar_Ridgeline_Colour_Snatch
# ---------------------------------------------------------------------------


def _smooth_horizontal_1d(arr: np.ndarray, radius_px: float) -> np.ndarray:
    """Apply fast 1D horizontal Gaussian smoothing along axis=1 without blurring vertically."""
    r = max(1, int(round(radius_px * 2.0)))
    if r <= 1 or arr.shape[1] <= 2:
        return arr
    offsets = np.arange(-r, r + 1, dtype=np.float32)
    sigma = max(radius_px, 0.8)
    kernel = np.exp(-(offsets ** 2) / (2.0 * (sigma ** 2))).astype(np.float32)
    kernel /= kernel.sum()
    padded = np.pad(arr, ((0, 0), (r, r)), mode="edge")
    out = np.zeros_like(arr, dtype=np.float32)
    for idx, weight in enumerate(kernel):
        out += weight * padded[:, idx : idx + arr.shape[1]]
    return out


def effect_10_pulsar_ridgeline_colour_snatch(
    image: Image.Image,
    palette_name: str = "Acid Rainbow",
    audio: AudioModulation | None = None,
    analysis: LuminanceSectorAnalysis | None = None,
) -> Image.Image:
    """10_Pulsar_Ridgeline_Colour_Snatch: CP 1919 Unknown Pleasures horizontal luminance elevation ridgelines over stark obsidian, snatching vivid colour on high-elevation ridge sectors."""
    aud = (audio or AudioModulation()).clamped()
    rgb_im = image.convert("RGB")
    w, h = rgb_im.size

    # Number of horizontal pulsar scanlines (preserving full vertical separation on extreme panorama strips)
    if h <= 8:
        n_lines = max(2, h)
        row_positions = np.linspace(0.0, float(max(0, h - 1)), n_lines)
    else:
        n_lines = max(12, min(68, max(2, h // 10 if h >= 20 else h)))
        row_positions = np.linspace(int(h * 0.08), int(h * 0.96), n_lines)
    row_indices = np.clip(np.round(row_positions).astype(np.int32), 0, h - 1)
    max_elev = max(2.0, (h / float(n_lines)) * (4.1 + 0.8 * aud.bass))

    if analysis is not None:
        is_mono = analysis.is_monochrome
        rows_lum = analysis.stark_lum[row_indices, :]
        rows_edge = analysis.edge_mag[row_indices, :]
        rows_rgb = analysis.rgb[row_indices, :, :]
        rows_sat = analysis.saturation[row_indices, :]
    else:
        rgb_u8 = np.asarray(rgb_im, dtype=np.uint8)
        step_y = max(1, h // 90)
        step_x = max(1, w // 120)
        sub_rgb = rgb_u8[::step_y, ::step_x].astype(np.float32) * np.float32(1.0 / 255.0)
        sub_lum = (
            np.float32(0.2126) * sub_rgb[..., 0]
            + np.float32(0.7152) * sub_rgb[..., 1]
            + np.float32(0.0722) * sub_rgb[..., 2]
        )
        if sub_lum.size > 0:
            lo_v, hi_v = np.percentile(sub_lum, [3.0, 97.0])
            lo, hi = float(lo_v), float(hi_v)
        else:
            lo, hi = 0.0, 1.0
        span_lum = max(hi - lo, 0.08)
        sub_cmax = np.maximum(np.maximum(sub_rgb[..., 0], sub_rgb[..., 1]), sub_rgb[..., 2])
        sub_cmin = np.minimum(np.minimum(sub_rgb[..., 0], sub_rgb[..., 1]), sub_rgb[..., 2])
        sub_sat = np.where(sub_cmax > 1e-5, (sub_cmax - sub_cmin) / np.maximum(sub_cmax, 1e-5), np.float32(0.0))
        is_mono = (float(sub_sat.mean()) if sub_sat.size > 0 else 0.0) < SYNTHETIC_CHROMA_THRESHOLD

        row_prev = np.clip(row_indices - 1, 0, h - 1)
        row_next = np.clip(row_indices + 1, 0, h - 1)
        rows_rgb = rgb_u8[row_indices, :, :].astype(np.float32) * np.float32(1.0 / 255.0)
        prev_rgb = rgb_u8[row_prev, :, :].astype(np.float32) * np.float32(1.0 / 255.0)
        next_rgb = rgb_u8[row_next, :, :].astype(np.float32) * np.float32(1.0 / 255.0)

        raw_lum = (
            np.float32(0.2126) * rows_rgb[..., 0]
            + np.float32(0.7152) * rows_rgb[..., 1]
            + np.float32(0.0722) * rows_rgb[..., 2]
        )
        prev_lum = (
            np.float32(0.2126) * prev_rgb[..., 0]
            + np.float32(0.7152) * prev_rgb[..., 1]
            + np.float32(0.0722) * prev_rgb[..., 2]
        )
        next_lum = (
            np.float32(0.2126) * next_rgb[..., 0]
            + np.float32(0.7152) * next_rgb[..., 1]
            + np.float32(0.0722) * next_rgb[..., 2]
        )
        stretched = np.clip((raw_lum - np.float32(lo)) * np.float32(1.0 / span_lum), 0.0, 1.0)
        s_curve = stretched * stretched * (np.float32(3.0) - np.float32(2.0) * stretched)
        rows_lum = np.clip(np.float32(0.5) + (s_curve - np.float32(0.5)) * np.float32(1.28), 0.0, 1.0)

        gx = np.zeros_like(rows_lum)
        if w > 2:
            gx[:, 1:-1] = np.abs(rows_lum[:, 2:] - rows_lum[:, :-2])
        gy = np.abs(next_lum - prev_lum) * np.float32(1.5)
        raw_edge = gx + gy
        e_p98 = max(float(np.percentile(raw_edge, 98.5)), 0.05) if raw_edge.size > 0 else 1.0
        rows_edge = np.clip(raw_edge * np.float32(1.0 / e_p98), 0.0, 1.0)

        rcmax = np.maximum(np.maximum(rows_rgb[..., 0], rows_rgb[..., 1]), rows_rgb[..., 2])
        rcmin = np.minimum(np.minimum(rows_rgb[..., 0], rows_rgb[..., 1]), rows_rgb[..., 2])
        rows_sat = np.where(rcmax > 1e-5, (rcmax - rcmin) / np.maximum(rcmax, 1e-5), np.float32(0.0))

    # Smooth luminance & edge profiles horizontally along the sampled ridgeline rows
    target_rx = max(1.0, w / 260.0)
    rows_smooth_lum = _smooth_horizontal_1d(rows_lum, target_rx)
    rows_smooth_edge = _smooth_horizontal_1d(rows_edge, target_rx)
    rows_elev = np.clip(0.65 * rows_smooth_lum + 0.35 * rows_smooth_edge, 0.0, 1.0)

    if not is_mono:
        rows_sat_sm = _smooth_horizontal_1d(rows_sat, 2.0)
        s_p90 = max(float(np.percentile(rows_sat_sm, 90.0)), 0.10) if rows_sat_sm.size > 0 else 0.10
        norm_sat = np.clip(rows_sat_sm * np.float32(1.0 / s_p90), 0.0, 1.0)
        rows_drive = np.clip(0.55 * rows_elev + 0.45 * norm_sat, 0.0, 1.0)
    else:
        rows_drive = rows_elev

    if rows_drive.size > 0:
        p55_v, p85_v = np.percentile(rows_drive, [54.0, 86.0])
        snatch_p55, snatch_p85 = float(p55_v), float(p85_v)
    else:
        snatch_p55, snatch_p85 = 0.2, 0.8
    drive_span = max(snatch_p85 - snatch_p55, 0.08)
    rows_snatch_w = np.clip((rows_drive - np.float32(snatch_p55)) * np.float32(1.0 / drive_span), 0.0, 1.0)

    # Compute vivid colour-snatch source field on the active ridgeline rows
    x_norm = np.linspace(0.0, 1.0, w, dtype=np.float32)
    pal = get_palette_rgb(palette_name)
    n_cols = len(pal)
    rows_yy = (row_indices.astype(np.float32) / max(h - 1, 1))[:, None]
    wave = 0.55 * rows_lum + 0.25 * rows_edge + 0.20 * (0.6 * x_norm[None, :] + 0.4 * rows_yy)
    pos = np.mod(wave + 0.08, 1.0) * (n_cols - 1)
    idx0 = np.floor(pos).astype(np.int32)
    idx1 = np.clip(idx0 + 1, 0, n_cols - 1)
    frac = (pos - idx0)[..., None].astype(np.float32)
    synth_rows = pal[idx0] * (1.0 - frac) + pal[idx1] * frac
    detail_lum = np.clip(0.32 + 0.78 * rows_lum + 0.25 * rows_edge, 0.20, 1.05)[..., None]
    synth_rows = np.clip(synth_rows * detail_lum, 0.0, 1.0).astype(np.float32)

    if is_mono:
        rows_snatch_rgb = boost_chroma(synth_rows, boost=1.65, vibrance=0.40)
    else:
        boosted_rows = boost_chroma(rows_rgb, boost=2.45, vibrance=0.35)
        chroma_w = np.clip((rows_sat - 0.06) / 0.22, 0.0, 1.0)[..., None]
        blend_rows = np.clip(
            boosted_rows * (0.35 + 0.65 * chroma_w) + synth_rows * (0.65 * (1.0 - chroma_w)),
            0.0,
            1.0,
        ).astype(np.float32)
        rows_snatch_rgb = boost_chroma(blend_rows, boost=1.65, vibrance=0.40)

    chalk_white = np.array([0.95, 0.95, 0.96], dtype=np.float32)
    vivid_ridge_cols = np.clip(rows_snatch_rgb * 1.25 + 0.08, 0.0, 1.0)
    rows_ridge_rgb = (
        chalk_white[None, None, :] * (1.0 - rows_snatch_w[..., None])
        + vivid_ridge_cols * rows_snatch_w[..., None]
    )

    r_indices = np.arange(n_lines, dtype=np.float32)[:, None]
    carriers = 0.035 * np.sin(x_norm[None, :] * np.float32(26.0 * np.pi) + r_indices * np.float32(0.75)) * rows_elev
    curves_y = row_positions.astype(np.float32)[:, None] - (rows_elev + carriers) * np.float32(max_elev)

    # Pack ridge crest, neon under-glow skirt, and pitch-black obsidian void into a 1D RGBA uint32 LUT
    rows_ridge_u32 = (
        np.clip(rows_ridge_rgb[..., 0] * 255.0, 0, 255).astype(np.uint32)
        | (np.clip(rows_ridge_rgb[..., 1] * 255.0, 0, 255).astype(np.uint32) << 8)
        | (np.clip(rows_ridge_rgb[..., 2] * 255.0, 0, 255).astype(np.uint32) << 16)
        | np.uint32(0xFF000000)
    ).ravel()
    skirt_glow_rgb = (
        np.array([0.027, 0.027, 0.030], dtype=np.float32)[None, None, :]
        + rows_snatch_rgb * (rows_snatch_w[..., None] * 0.62)
    )
    rows_skirt_u32 = (
        np.clip(skirt_glow_rgb[..., 0] * 255.0, 0, 255).astype(np.uint32)
        | (np.clip(skirt_glow_rgb[..., 1] * 255.0, 0, 255).astype(np.uint32) << 8)
        | (np.clip(skirt_glow_rgb[..., 2] * 255.0, 0, 255).astype(np.uint32) << 16)
        | np.uint32(0xFF000000)
    ).ravel()
    obsidian_u32 = np.uint32(0xFF080707)
    lut_u32 = np.concatenate([rows_ridge_u32, rows_skirt_u32, np.array([obsidian_u32], dtype=np.uint32)])
    n_rw = n_lines * w

    # Painter's algorithm from top (back) to bottom (front) within each ridgeline's active vertical band
    state_grid = np.full((h, w), 2 * n_rw, dtype=np.int32)
    yy_int = np.arange(h, dtype=np.float32)[:, None]
    x_arange = np.arange(w, dtype=np.int32)[None, :]
    skirt_split = max_elev * 0.42

    for r_idx in range(n_lines):
        base_y = float(row_positions[r_idx])
        curve_y = curves_y[r_idx]
        y0 = max(0, int(math.floor(float(curve_y.min()) - 2.0)))
        y1 = min(h, int(math.ceil(base_y + 2.5)) + 1)
        if y0 >= y1:
            continue
        yy_sub = yy_int[y0:y1]
        dy = yy_sub - curve_y[None, :]
        sub_state = state_grid[y0:y1]
        base_idx = r_idx * w + x_arange

        # 1. Occlusion skirt below curve_y down to base_y + 2.5
        m_low = (dy > skirt_split) & (yy_sub <= (base_y + 2.5))
        sub_state[m_low] = 2 * n_rw
        m_up = (dy >= 0.0) & (dy <= skirt_split) & (yy_sub <= (base_y + 2.5))
        np.copyto(sub_state, n_rw + base_idx, where=m_up)

        # 2. Ridgeline waveform + neon crest
        m_line = np.abs(dy) <= (1.25 + 0.65 * rows_snatch_w[r_idx][None, :])
        np.copyto(sub_state, base_idx, where=m_line)

    final_u32 = lut_u32[state_grid]
    return Image.frombuffer("RGBA", (w, h), final_u32.tobytes(), "raw", "RGBA", 0, 1).convert("RGB")


# ---------------------------------------------------------------------------
# Effect 11: 11_Glitch_Sector_Chromatic_Shear
# ---------------------------------------------------------------------------


def effect_11_glitch_sector_chromatic_shear(
    image: Image.Image,
    palette_name: str = "Cyber Neon",
    audio: AudioModulation | None = None,
    analysis: LuminanceSectorAnalysis | None = None,
) -> Image.Image:
    """11_Glitch_Sector_Chromatic_Shear: Stark high-contrast B&W base where high-gradient tonal sectors are horizontally sheared with RGB prism channel separation and colour-snatch slices."""
    aud = (audio or AudioModulation()).clamped()
    if analysis is None:
        analysis = analyse_sectors(image)
    h, w = analysis.stark_lum.shape

    # 1. Stark Brutalist B&W Base (high-contrast silver/obsidian with crisp edge reinforcement)
    bw_val = np.clip(analysis.stark_lum * 0.92 + analysis.edge_mag * 0.22, 0.0, 1.0)
    # Apply subtle 6-step tonal posterisation in the deepest shadows for graphic punch
    bw_val = np.where(bw_val < 0.22, np.floor(bw_val * 8.0) / 8.0, bw_val)
    bw_base = np.stack([bw_val, bw_val, bw_val * 1.02], axis=-1).clip(0.0, 1.0)

    # 2. Prepare Vivid Colour-Snatch Source for Sheared Sectors
    snatch_rgb = get_snatch_colour_field(
        analysis, palette_name=palette_name, chroma_boost=2.20, phase_shift=0.22
    )

    # 3. Deterministic per-image seed from pixel digest so shears are reproducible
    digest = hashlib.sha256(analysis.stark_lum[:16, :16].tobytes()).digest()
    seed = int.from_bytes(digest[:4], "little")
    rng = np.random.default_rng(seed)

    # Compute horizontal row energy from Sobel gradient + saturation to locate high-energy glitch bands
    row_energy = analysis.edge_mag.mean(axis=1) + 0.5 * analysis.saturation.mean(axis=1)
    row_thresh = float(np.percentile(row_energy, 55.0))

    # Build horizontal block shear map (stepped tectonic bands + micro scanline tears)
    shear_px = np.zeros(h, dtype=np.int32)
    band_active = np.zeros(h, dtype=np.float32)

    y_cursor = 0
    max_shift = max(2, int(round(w * (0.032 + 0.015 * aud.high))))
    while y_cursor < h:
        band_h = int(rng.integers(max(2, h // 48), max(5, h // 14)))
        y_end = min(h, y_cursor + band_h)
        local_e = float(row_energy[y_cursor:y_end].mean())
        if local_e >= row_thresh or rng.random() < 0.28:
            direction = -1 if rng.random() < 0.5 else 1
            mag = int(rng.integers(max(2, max_shift // 3), max_shift + 1))
            shear_px[y_cursor:y_end] = direction * mag
            band_active[y_cursor:y_end] = np.clip((local_e / max(row_thresh, 1e-4)) * 0.85, 0.45, 1.0)
        y_cursor = y_end

    # Add fine single/double-row high-frequency tears on the sharpest horizontal edges
    fine_rows = np.where(row_energy > np.percentile(row_energy, 85.0))[0]
    for r in fine_rows:
        if shear_px[r] == 0:
            shear_px[r] = int((1 if (r % 2 == 0) else -1) * max(2, max_shift // 2))
            band_active[r] = 0.90

    # 4. Apply Horizontal Shear & RGB Prism Channel Separation across rows
    prism_sep = max(1, int(round(w * 0.014)))
    sheared_rgb = np.empty_like(snatch_rgb)
    sheared_edge = np.empty_like(analysis.edge_mag)
    sheared_lum = np.empty_like(analysis.stark_lum)
    sheared_sat = np.empty_like(analysis.saturation)

    x_idx = np.arange(w, dtype=np.int32)
    for r in range(h):
        dx = int(shear_px[r])
        if dx != 0:
            # R channel shifted by dx + prism_sep, G by dx, B by dx - prism_sep
            idx_r = (x_idx - (dx + prism_sep)) % w
            idx_g = (x_idx - dx) % w
            idx_b = (x_idx - (dx - prism_sep)) % w
            sheared_rgb[r, :, 0] = snatch_rgb[r, idx_r, 0]
            sheared_rgb[r, :, 1] = snatch_rgb[r, idx_g, 1]
            sheared_rgb[r, :, 2] = snatch_rgb[r, idx_b, 2]
            sheared_edge[r, :] = np.maximum(analysis.edge_mag[r, idx_r], analysis.edge_mag[r, idx_b])
            sheared_lum[r, :] = analysis.stark_lum[r, idx_g]
            sheared_sat[r, :] = analysis.saturation[r, idx_g]
        else:
            # Even in un-sheared rows, high-gradient contours get a tight chromatic prism fringe
            idx_r = (x_idx - prism_sep) % w
            idx_b = (x_idx + prism_sep) % w
            sheared_rgb[r, :, 0] = snatch_rgb[r, idx_r, 0]
            sheared_rgb[r, :, 1] = snatch_rgb[r, :, 1]
            sheared_rgb[r, :, 2] = snatch_rgb[r, idx_b, 2]
            sheared_edge[r, :] = analysis.edge_mag[r, :]
            sheared_lum[r, :] = analysis.stark_lum[r, :]
            sheared_sat[r, :] = analysis.saturation[r, :]

    # 5. Sector Mask: Snatch vivid prism-sheared colour inside active glitch bands & high-gradient tonal sectors,
    # while locking calm background/shadow sectors to stark brutalist B&W.
    active_2d = band_active[:, None]
    gradient_gate = np.clip((sheared_edge - 0.18) * 3.2, 0.0, 1.0)
    mid_white_gate = np.clip((sheared_lum - 0.22) * 2.5, 0.0, 1.0)
    if not analysis.is_monochrome:
        chroma_gate = np.clip((sheared_sat - 0.12) * 3.0, 0.0, 1.0)
    else:
        chroma_gate = mid_white_gate * 0.65

    sector_snatch_mask = np.clip(
        active_2d * (0.55 + 0.45 * mid_white_gate) + 0.65 * gradient_gate + 0.45 * chroma_gate * active_2d,
        0.0,
        1.0,
    )

    # Boost neon intensity along sheared edges
    prism_glow = np.clip(sheared_rgb * (1.05 + 0.45 * sheared_edge[..., None]), 0.0, 1.0)

    # Subtle scanline interlace inside the sheared bands
    interlace = np.where((np.arange(h)[:, None] % 2) == 0, 1.0, 0.86).astype(np.float32)
    prism_glow = prism_glow * (1.0 - 0.14 * active_2d[..., None] * (1.0 - interlace[..., None]))

    out = bw_base * (1.0 - sector_snatch_mask[..., None]) + prism_glow * sector_snatch_mask[..., None]
    out_u8 = np.clip(out * 255.0, 0.0, 255.0).astype(np.uint8)
    return Image.fromarray(out_u8, mode="RGB")


# ---------------------------------------------------------------------------
# Effect 12: 12_CRT_Phosphor_Sector_Snatch
# ---------------------------------------------------------------------------


def effect_12_crt_phosphor_sector_snatch(
    image: Image.Image,
    palette_name: str = "Tokyo Synthwave",
    audio: AudioModulation | None = None,
    analysis: LuminanceSectorAnalysis | None = None,
) -> Image.Image:
    """12_CRT_Phosphor_Sector_Snatch: Stark dark scanline grid in the shadow sectors with glowing RGB aperture-grille colour snatched exclusively in the bright luminance sectors."""
    aud = (audio or AudioModulation()).clamped()
    if analysis is None:
        analysis = analyse_sectors(image)
    h, w = analysis.stark_lum.shape

    yy = np.arange(h, dtype=np.float32)[:, None]
    xx = np.arange(w, dtype=np.float32)[None, :]

    # 1. Shadow & Lower-Mid Sector: Stark Dark Scanline Grid (Monochrome CRT)
    # Horizontal scanline wave (3-pixel pitch)
    scan_wave = 0.55 + 0.45 * (np.sin(yy * (np.pi / 1.5)) ** 2)
    # Fine vertical shadow-mask grid in dark sectors
    dark_grid_x = 0.82 + 0.18 * np.cos(xx * (2.0 * np.pi / 3.0))
    mono_lum = np.clip((analysis.stark_lum ** 1.25) * 0.88 + 0.08 * analysis.edge_mag, 0.0, 1.0)
    # Slight cool phosphor-silver tint in the monochrome shadow scanlines
    bw_scanline_rgb = (
        mono_lum[..., None]
        * scan_wave[..., None]
        * dark_grid_x[..., None]
        * np.array([0.84, 0.89, 0.96], dtype=np.float32)[None, None, :]
    )

    # 2. Bright Luminance / Vibrant Sector: Glowing RGB Aperture-Grille Phosphor Colour-Snatch
    snatch_rgb = get_snatch_colour_field(
        analysis, palette_name=palette_name, chroma_boost=2.30, phase_shift=0.35
    )

    # Build authentic Sony Trinitron-style 3-column RGB aperture-grille sub-pixel mask
    col_mod = np.mod(np.arange(w, dtype=np.int32), 3)
    grille = np.full((1, w, 3), 0.34, dtype=np.float32)  # Base cross-bleed so bright phosphors stay lush
    grille[0, col_mod == 0, 0] = 1.38  # Red phosphor stripe
    grille[0, col_mod == 1, 1] = 1.38  # Green phosphor stripe
    grille[0, col_mod == 2, 2] = 1.38  # Blue phosphor stripe

    # Horizontal phosphor beam profile (brighter and fuller in high-luminance sectors due to beam bloom)
    beam_bloom = np.clip(0.62 + 0.38 * analysis.stark_lum, 0.62, 1.0)
    bright_scan = beam_bloom + (1.0 - beam_bloom) * (np.sin(yy * (np.pi / 1.5)) ** 2)

    # Periodic horizontal damper wire shadow (classic Trinitron detail at 1/3 and 2/3 height)
    damper = np.ones((h, 1, 1), dtype=np.float32)
    if h >= 60:
        damper[int(h * 0.33), 0, 0] = 0.55
        damper[int(h * 0.67), 0, 0] = 0.55

    phosphor_direct = snatch_rgb * grille * bright_scan[..., None] * damper

    # Add CRT Phosphor Halation / Bloom (soft glowing aura spilling across adjacent triads and scanlines)
    bloom_src_u8 = np.clip(snatch_rgb * (analysis.stark_lum[..., None] ** 1.2) * 255.0, 0, 255).astype(np.uint8)
    bloom_im = Image.fromarray(bloom_src_u8, mode="RGB").filter(
        ImageFilter.GaussianBlur(radius=max(1.5, min(w, h) / 95.0))
    )
    bloom_rgb = np.asarray(bloom_im, dtype=np.float32) / 255.0
    phosphor_rgb = np.clip(phosphor_direct * 0.88 + bloom_rgb * (0.58 + 0.20 * aud.onset), 0.0, 1.0)

    # 3. Compute Bright Luminance Sector Snatch Mask
    # Lock shadows/low-mids (0..48%) to the stark dark monochrome scanline grid,
    # and snatch glowing RGB phosphor colour in the bright luminance sector (> 48%) and vivid edges.
    lum_p52 = float(np.percentile(analysis.stark_lum, 50.0))
    bright_cutoff = min(0.50, max(0.36, lum_p52))
    bright_sector_mask = np.clip((analysis.stark_lum - bright_cutoff) / 0.18, 0.0, 1.0)
    if not analysis.is_monochrome:
        vivid_boost = np.clip((analysis.saturation - 0.22) * 2.2, 0.0, 1.0) * np.clip(
            (analysis.stark_lum - 0.20) / 0.20, 0.0, 1.0
        )
        bright_sector_mask = np.maximum(bright_sector_mask, vivid_boost * 0.85)

    bright_sector_mask = _smooth_mask(bright_sector_mask, radius=1.6)

    # Subtle CRT glass curvature corner vignette
    ny = (yy / max(h - 1, 1)) * 2.0 - 1.0
    nx = (xx / max(w - 1, 1)) * 2.0 - 1.0
    vignette = np.clip(1.06 - 0.22 * (nx ** 2 + ny ** 2), 0.72, 1.0)[..., None]

    out = (
        bw_scanline_rgb * (1.0 - bright_sector_mask[..., None])
        + phosphor_rgb * bright_sector_mask[..., None]
    ) * vignette
    out_u8 = np.clip(out * 255.0, 0.0, 255.0).astype(np.uint8)
    return Image.fromarray(out_u8, mode="RGB")


# ---------------------------------------------------------------------------
# Dispatcher & Contact Sheet Generator
# ---------------------------------------------------------------------------


EFFECT_REGISTRY: dict[str, Callable[..., Image.Image]] = {
    "09_Zine_Halftone_Colour_Snatch": effect_09_zine_halftone_colour_snatch,
    "10_Pulsar_Ridgeline_Colour_Snatch": effect_10_pulsar_ridgeline_colour_snatch,
    "11_Glitch_Sector_Chromatic_Shear": effect_11_glitch_sector_chromatic_shear,
    "12_CRT_Phosphor_Sector_Snatch": effect_12_crt_phosphor_sector_snatch,
}

DEFAULT_EFFECT_PALETTES: dict[str, str] = {
    "09_Zine_Halftone_Colour_Snatch": "Omarchy Cyber",
    "10_Pulsar_Ridgeline_Colour_Snatch": "Acid Rainbow",
    "11_Glitch_Sector_Chromatic_Shear": "Cyber Neon",
    "12_CRT_Phosphor_Sector_Snatch": "Tokyo Synthwave",
}


def apply_effect_to_file(
    effect_name: str,
    source_path: str,
    output_path: str,
    palette_name: str | None = None,
    audio: AudioModulation | None = None,
) -> dict[str, Any]:
    """Apply a named Family 3 stark effect to `source_path` and atomically write PNG to `output_path`."""
    if effect_name not in EFFECT_REGISTRY:
        raise StarkEffectError(
            f"Unknown Family 3 effect {effect_name!r}. Valid effects: {list(EFFECT_REGISTRY)}"
        )
    if not output_path or not isinstance(output_path, str):
        raise StarkEffectError("Output path must be a non-empty string.")
    t0 = time.monotonic()
    abs_src = validate_source_image_path(source_path)
    abs_out = os.path.abspath(output_path)
    if abs_src == abs_out or os.path.realpath(abs_src) == os.path.realpath(abs_out):
        raise StarkEffectError(
            f"Refusing to overwrite source image in-place (source is strictly read-only): {abs_src}"
        )
    src_im = load_source_image(abs_src)
    analysis = analyse_sectors(src_im)
    chosen_palette = palette_name or DEFAULT_EFFECT_PALETTES.get(effect_name, "Omarchy Cyber")
    fn = EFFECT_REGISTRY[effect_name]
    out_im = fn(src_im, palette_name=chosen_palette, audio=audio, analysis=analysis)
    saved_path = atomic_save_png(out_im, abs_out)
    elapsed_ms = round((time.monotonic() - t0) * 1000.0, 2)
    return {
        "ok": True,
        "effect": effect_name,
        "source": abs_src,
        "output": saved_path,
        "width": out_im.width,
        "height": out_im.height,
        "isMonochromeSource": bool(analysis.is_monochrome),
        "meanSaturation": round(analysis.mean_saturation, 4),
        "palette": chosen_palette,
        "elapsedMs": elapsed_ms,
    }


def _load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    """Resolve a clean monospace/sans system font on Arch/Omarchy, falling back to default."""
    candidates = (
        [
            "/usr/share/fonts/TTF/JetBrainsMonoNerdFont-Bold.ttf",
            "/usr/share/fonts/TTF/JetBrainsMono-Bold.ttf",
            "/usr/share/fonts/TTF/DejaVuSansMono-Bold.ttf",
            "/usr/share/fonts/noto/NotoSans-Bold.ttf",
        ]
        if bold
        else [
            "/usr/share/fonts/TTF/JetBrainsMonoNerdFont-Regular.ttf",
            "/usr/share/fonts/TTF/JetBrainsMono-Regular.ttf",
            "/usr/share/fonts/TTF/DejaVuSansMono.ttf",
            "/usr/share/fonts/noto/NotoSans-Regular.ttf",
        ]
    )
    for path in candidates:
        if os.path.isfile(path):
            try:
                return ImageFont.truetype(path, size=size)
            except Exception:
                continue
    return ImageFont.load_default()


def build_effect_contact_sheet(
    effect_name: str,
    records: list[dict[str, Any]],
    output_path: str,
    thumb_size: tuple[int, int] = (360, 270),
    cols: int = 4,
) -> str:
    """Create a 4x3 labelled comparison contact sheet for a single effect across all 12 source images."""
    if not records:
        raise StarkEffectError("Cannot build contact sheet from empty records list.")
    rows = math.ceil(len(records) / float(cols))
    tw, th = thumb_size
    pad = 20
    label_h = 34
    header_h = 72

    sheet_w = pad + cols * (tw + pad)
    sheet_h = header_h + pad + rows * (th + label_h + pad)
    sheet = Image.new("RGB", (sheet_w, sheet_h), (10, 12, 18))
    draw = ImageDraw.Draw(sheet)

    title_font = _load_font(22, bold=True)
    sub_font = _load_font(14, bold=False)
    cell_font = _load_font(13, bold=False)

    draw.text(
        (pad, 16),
        f"BANDARCHY STARK SNAPSHOT & COLOUR-SNATCH — {effect_name}",
        fill=(110, 231, 183),
        font=title_font,
    )
    draw.text(
        (pad, 44),
        "Family 3 (Halftone, Ridgeline & Optical Slicing) • Source Categories: Architecture / Nature / Objects (Colour & B&W)",
        fill=(180, 190, 210),
        font=sub_font,
    )

    for idx, rec in enumerate(records):
        r = idx // cols
        c = idx % cols
        x0 = pad + c * (tw + pad)
        y0 = header_h + pad + r * (th + label_h + pad)

        with Image.open(rec["output"]) as im:
            thumb = ImageOps.fit(im.convert("RGB"), (tw, th), method=Image.Resampling.LANCZOS)
        sheet.paste(thumb, (x0, y0))
        draw.rectangle([x0 - 1, y0 - 1, x0 + tw, y0 + th], outline=(56, 189, 248), width=1)

        src_stem = os.path.splitext(os.path.basename(rec["source"]))[0]
        mode_tag = "SYNTH-PALETTE" if rec["isMonochromeSource"] else "TRUE-CHROMA"
        caption = f"{src_stem[:28]} [{mode_tag}]"
        draw.text((x0 + 4, y0 + th + 7), caption, fill=(230, 236, 245), font=cell_font)

    return atomic_save_png(sheet, output_path)


def build_family3_master_contact_sheet(
    all_records: list[dict[str, Any]],
    sources: list[str],
    output_path: str,
    thumb_size: tuple[int, int] = (256, 192),
) -> str:
    """Create the master Family 3 comparison matrix (rows = 12 sources, columns = Original + Effects 09..12)."""
    if not sources or not all_records:
        raise StarkEffectError("Sources and records must be non-empty for master contact sheet.")

    rec_map: dict[tuple[str, str], dict[str, Any]] = {}
    for rec in all_records:
        rec_map[(rec["effect"], os.path.abspath(rec["source"]))] = rec

    tw, th = thumb_size
    cols = 1 + len(FAMILY3_EFFECT_NAMES)  # Original + 4 effects = 5 columns
    rows = len(sources)
    pad = 16
    label_h = 28
    header_h = 84

    sheet_w = pad + cols * (tw + pad)
    sheet_h = header_h + pad + rows * (th + label_h + pad)
    sheet = Image.new("RGB", (sheet_w, sheet_h), (8, 10, 16))
    draw = ImageDraw.Draw(sheet)

    title_font = _load_font(22, bold=True)
    col_font = _load_font(13, bold=True)
    cell_font = _load_font(12, bold=False)

    draw.text(
        (pad, 14),
        "BANDARCHY FAMILY 3 — HALFTONE, PULSAR RIDGELINE, GLITCH SHEAR & CRT PHOSPHOR COLOUR-SNATCH",
        fill=(110, 231, 183),
        font=title_font,
    )
    col_headers = ["00_Original_Source", *FAMILY3_EFFECT_NAMES]
    for c_idx, header_text in enumerate(col_headers):
        cx = pad + c_idx * (tw + pad)
        draw.text((cx + 4, 52), header_text[:30], fill=(244, 114, 182), font=col_font)

    for r_idx, src_path in enumerate(sources):
        abs_src = os.path.abspath(src_path)
        src_stem = os.path.splitext(os.path.basename(abs_src))[0]
        y0 = header_h + pad + r_idx * (th + label_h + pad)

        # Column 0: Original source
        x0 = pad
        src_im = load_source_image(abs_src)
        orig_thumb = ImageOps.fit(src_im, (tw, th), method=Image.Resampling.LANCZOS)
        sheet.paste(orig_thumb, (x0, y0))
        draw.rectangle([x0 - 1, y0 - 1, x0 + tw, y0 + th], outline=(100, 116, 139), width=1)
        draw.text((x0 + 4, y0 + th + 5), f"SRC: {src_stem[:24]}", fill=(180, 190, 205), font=cell_font)

        # Columns 1..4: Effects 09..12
        for e_idx, eff_name in enumerate(FAMILY3_EFFECT_NAMES):
            cx = pad + (e_idx + 1) * (tw + pad)
            rec = rec_map.get((eff_name, abs_src))
            if not rec:
                continue
            with Image.open(rec["output"]) as e_im:
                e_thumb = ImageOps.fit(e_im.convert("RGB"), (tw, th), method=Image.Resampling.LANCZOS)
            sheet.paste(e_thumb, (cx, y0))
            draw.rectangle([cx - 1, y0 - 1, cx + tw, y0 + th], outline=(56, 189, 248), width=1)
            tag = "SYNTH" if rec["isMonochromeSource"] else "CHROMA"
            draw.text(
                (cx + 4, y0 + th + 5),
                f"{eff_name[:16]} [{tag}]",
                fill=(235, 240, 250),
                font=cell_font,
            )

    return atomic_save_png(sheet, output_path)


def run_batch(
    sources_dir: str,
    effects_dir: str,
) -> dict[str, Any]:
    """Run all 4 Family 3 effects across every valid image in `sources_dir` and build contact sheets."""
    abs_sources_dir = os.path.abspath(sources_dir)
    abs_effects_dir = os.path.abspath(effects_dir)
    source_files = list_source_images(abs_sources_dir)
    if not source_files:
        raise StarkEffectError(f"No valid source images found in {abs_sources_dir}")
    os.makedirs(abs_effects_dir, exist_ok=True)

    all_records: list[dict[str, Any]] = []
    contact_sheets: list[str] = []

    for effect_name in FAMILY3_EFFECT_NAMES:
        effect_records: list[dict[str, Any]] = []
        for src_path in source_files:
            src_stem = os.path.splitext(os.path.basename(src_path))[0]
            out_name = f"{effect_name}__{src_stem}.png"
            out_path = os.path.join(abs_effects_dir, out_name)
            rec = apply_effect_to_file(effect_name, src_path, out_path)
            effect_records.append(rec)
            all_records.append(rec)

        per_effect_sheet = os.path.join(abs_effects_dir, f"ContactSheet_{effect_name}.png")
        contact_sheets.append(build_effect_contact_sheet(effect_name, effect_records, per_effect_sheet))

    master_sheet = os.path.join(abs_effects_dir, "ContactSheet_Family3_HalftoneRidgelineGlitchCRT.png")
    contact_sheets.append(build_family3_master_contact_sheet(all_records, source_files, master_sheet))

    return {
        "ok": True,
        "family": 3,
        "effects": list(FAMILY3_EFFECT_NAMES),
        "sourceCount": len(source_files),
        "generatedCount": len(all_records),
        "contactSheets": contact_sheets,
        "results": all_records,
    }


# ---------------------------------------------------------------------------
# Built-in Self-Test Suite (Edge Cases & Security Boundaries)
# ---------------------------------------------------------------------------


def run_self_tests() -> dict[str, Any]:
    """Execute automated functional and edge-case tests for Family 3 effects."""
    passed: list[str] = []

    with tempfile.TemporaryDirectory(prefix="bandarchy_f3_test_") as tmpdir:
        # 1. Test tiny dimensions (1x1, 7x5), extreme panorama aspect ratios (1024x4, 4x1024), RGBA & Palette modes
        for label, mode, size in [
            ("1x1_min", "RGB", (1, 1)),
            ("7x5_odd", "RGB", (7, 5)),
            ("wide_banner", "RGBA", (180, 32)),
            ("tall_column", "P", (36, 160)),
            ("extreme_panorama_1024x4", "RGB", (1024, 4)),
            ("extreme_vertical_4x1024", "RGB", (4, 1024)),
        ]:
            im = Image.new(mode, size, (120, 40, 200) if mode != "P" else 12)
            src_p = os.path.join(tmpdir, f"{label}.png")
            im.save(src_p, format="PNG")
            loaded = load_source_image(src_p)
            for eff_name, eff_fn in EFFECT_REGISTRY.items():
                res = eff_fn(loaded, audio=AudioModulation(bass=1.5, mid=0.8, high=1.9, onset=1.2))
                assert res.size == loaded.size, f"Size mismatch for {eff_name} on {label}"
                assert res.mode == "RGB", f"Mode mismatch for {eff_name} on {label}"
                arr = np.asarray(res)
                assert not np.isnan(arr).any(), f"NaN in {eff_name} on {label}"
            passed.append(f"edge_geometry_{label}")

        # 2. Test pure B&W source triggers Synthetic Sector Colour-Snatching (output has > 0 chroma)
        y_grad = np.linspace(0, 255, 128, dtype=np.uint8)[:, None]
        x_grad = np.linspace(0, 255, 128, dtype=np.uint8)[None, :]
        bw_arr = ((y_grad * 0.6 + x_grad * 0.4)).astype(np.uint8)
        bw_rgb = np.stack([bw_arr, bw_arr, bw_arr], axis=-1)
        bw_path = os.path.join(tmpdir, "pure_bw.png")
        Image.fromarray(bw_rgb, mode="RGB").save(bw_path)

        bw_loaded = load_source_image(bw_path)
        bw_analysis = analyse_sectors(bw_loaded)
        assert bw_analysis.is_monochrome is True, "Pure B&W image must be detected as monochrome"
        for eff_name in FAMILY3_EFFECT_NAMES:
            out_p = os.path.join(tmpdir, f"out_{eff_name}.png")
            rec = apply_effect_to_file(eff_name, bw_path, out_p)
            assert rec["isMonochromeSource"] is True
            out_arr = np.asarray(Image.open(out_p).convert("RGB"), dtype=np.float32) / 255.0
            cmax = out_arr.max(axis=-1)
            cmin = out_arr.min(axis=-1)
            out_sat = np.where(cmax > 1e-5, (cmax - cmin) / np.maximum(cmax, 1e-5), 0.0)
            assert float(out_sat.max()) > 0.25, f"{eff_name} failed to inject synthetic colour into B&W source"
        passed.append("synthetic_colour_snatch_on_bw")

        # 3. Test symlink rejection on source and output, and in-place source overwrite rejection
        symlink_p = os.path.join(tmpdir, "symlink_img.png")
        os.symlink(bw_path, symlink_p)
        try:
            validate_source_image_path(symlink_p)
            raise AssertionError("Symlinked image should have been rejected")
        except StarkEffectError:
            passed.append("reject_symlink_source")

        out_symlink = os.path.join(tmpdir, "symlink_out.png")
        os.symlink(bw_path, out_symlink)
        try:
            atomic_save_png(bw_loaded, out_symlink)
            raise AssertionError("Symlinked output path should have been rejected")
        except StarkEffectError:
            passed.append("reject_symlink_output")

        try:
            apply_effect_to_file(FAMILY3_EFFECT_NAMES[0], bw_path, bw_path)
            raise AssertionError("In-place source overwrite should have been rejected")
        except StarkEffectError:
            passed.append("reject_inplace_source_overwrite")

        # 4. Test empty file rejection
        empty_p = os.path.join(tmpdir, "empty.jpg")
        with open(empty_p, "wb"):
            pass
        try:
            validate_source_image_path(empty_p)
            raise AssertionError("Empty file should have been rejected")
        except StarkEffectError:
            passed.append("reject_empty_file")

        # 5. Test corrupted / truncated JPEG stream rejection
        corrupt_jpg = os.path.join(tmpdir, "corrupt_stream.jpg")
        with open(corrupt_jpg, "wb") as f:
            f.write(b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdaTRUNCATED")
        try:
            load_source_image(corrupt_jpg)
            raise AssertionError("Corrupted/truncated JPEG should have been rejected")
        except StarkEffectError:
            passed.append("reject_corrupted_jpeg_stream")

        # 6. Test unsupported extension rejection
        bad_ext_p = os.path.join(tmpdir, "malicious.svg")
        with open(bad_ext_p, "wb") as f:
            f.write(b"<svg></svg>")
        try:
            validate_source_image_path(bad_ext_p)
            raise AssertionError("Unsupported extension should have been rejected")
        except StarkEffectError:
            passed.append("reject_unsupported_extension")

        # 7. Test oversized file (> MAX_ART_BYTES) rejection via sparse file
        huge_p = os.path.join(tmpdir, "huge.png")
        with open(huge_p, "wb") as f:
            f.truncate(MAX_ART_BYTES + 1024)
        try:
            validate_source_image_path(huge_p)
            raise AssertionError("Oversized file should have been rejected")
        except StarkEffectError:
            passed.append("reject_oversized_file")

    return {"ok": True, "testsPassed": len(passed), "passed": passed}


# ---------------------------------------------------------------------------
# CLI Entry Point (Bandarchy JSON-compatible)
# ---------------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    default_root = resolve_pictures_bandarchy_dir()
    parser = argparse.ArgumentParser(
        description="Bandarchy Family 3 Stark Snapshot & Sector Colour-Snatch Processor (Effects 09–12)."
    )
    parser.add_argument(
        "--sources-dir",
        default=os.path.join(default_root, "sources"),
        help="Directory containing source images (default: $XDG_PICTURES_DIR/bandarchy/sources).",
    )
    parser.add_argument(
        "--effects-dir",
        default=os.path.join(default_root, "effects"),
        help="Directory to write processed stark copies and contact sheets (default: $XDG_PICTURES_DIR/bandarchy/effects).",
    )
    parser.add_argument(
        "--effect",
        choices=list(FAMILY3_EFFECT_NAMES),
        help="Optional single effect ID to apply when --input and --output are specified.",
    )
    parser.add_argument("--input", help="Single source image path.")
    parser.add_argument("--output", help="Single output PNG path.")
    parser.add_argument(
        "--palette",
        choices=list(BANDARCHY_PALETTES),
        default=None,
        help="Optional Bandarchy palette override for synthetic/tinted sector colour-snatching.",
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Run built-in edge-case and security verification tests.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit a single bounded JSON object on stdout (Bandarchy helper protocol).",
    )

    args = parser.parse_args(argv)

    try:
        if args.self_test:
            res = run_self_tests()
        elif args.input and args.output:
            eff = args.effect or FAMILY3_EFFECT_NAMES[0]
            res = apply_effect_to_file(eff, args.input, args.output, palette_name=args.palette)
        else:
            res = run_batch(args.sources_dir, args.effects_dir)

        if args.json:
            print(json.dumps(res, indent=2))
        else:
            if args.self_test:
                print(f"[OK] Passed {res['testsPassed']} self-tests: {', '.join(res['passed'])}")
            elif args.input and args.output:
                print(f"[OK] {res['effect']} -> {res['output']} ({res['elapsedMs']} ms)")
            else:
                print(
                    f"[OK] Family 3 complete: generated {res['generatedCount']} images "
                    f"across {res['sourceCount']} sources and {len(res['contactSheets'])} contact sheets."
                )
                for cs in res["contactSheets"]:
                    print(f"  Contact sheet: {cs}")
        return 0
    except StarkEffectError as exc:
        err = {"ok": False, "error": str(exc)}
        if args.json:
            print(json.dumps(err))
        else:
            print(f"[ERROR] {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
