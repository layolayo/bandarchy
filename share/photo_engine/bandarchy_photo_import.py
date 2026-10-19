#!/usr/bin/env python3
"""Bandarchy Photo Layer Category Organiser, Incremental Importer & Stark Translator.

Manages the category-based photograph pipeline inside `$XDG_PICTURES_DIR/bandarchy`
(falling back to `~/Pictures/bandarchy`) for the Bandarchy Visualiser Photo Layer:

Directory Architecture:
  ~/Pictures/bandarchy/
  ├── categories/            # Drop-in inbox folders where users place new raw photos
  │   ├── brutalist/
  │   ├── architecture/
  │   ├── nature/
  │   ├── objects/
  │   ├── cyberpunk/
  │   ├── characters/
  │   └── custom/
  ├── processed/             # Translated Stark & Sector Colour-Snatch PNGs per category
  │   ├── brutalist/
  │   ├── architecture/
  │   ├── nature/
  │   ├── objects/
  │   ├── cyberpunk/
  │   ├── characters/
  │   └── custom/
  ├── imported/              # Raw source photos moved here after a successful translation
  │   ├── brutalist/
  │   ├── architecture/
  │   ├── nature/
  │   ├── objects/
  │   ├── cyberpunk/
  │   ├── characters/
  │   └── custom/
  ├── sources/               # Preserved reference test corpus (12 original images)
  ├── effects/               # Preserved reference showcase outputs & contact sheets
  └── manifest.json          # Master translation index for the Bandarchy Photo Layer

Workflow:
  1. Users drop new raw images (`.jpg`, `.jpeg`, `.png`, `.webp`) into any folder
     under `~/Pictures/bandarchy/categories/<category>/`.
  2. Clicking the "Import Photos" button in Bandarchy (or running this script with
     `--import`) scans all category drop-in folders for new raw images.
  3. Each new raw image is validated (non-symlink, regular file, <= 15 MiB) and
     translated through all 16 Stark & Sector Colour-Snatch effects (Families 1–4)
     into `~/Pictures/bandarchy/processed/<category>/`.
  4. Once all translations for a source image succeed, the raw source file is moved
     atomically into `~/Pictures/bandarchy/imported/<category>/` so subsequent clicks
     of the "Import Photos" button only translate newly added photographs.
  5. When the Photo Layer is active in Bandarchy, the user selects a category
     (`brutalist`, `architecture`, `nature`, `objects`, `cyberpunk`, `characters`, `custom`, or `all`),
     and Bandarchy picks translated stark snapshots from `processed/<category>/` and
     applies secondary real-time audio-reactive visualiser effects on top.

All prose, comments, documentation, and CLI outputs strictly adhere to British English.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import datetime
import fcntl
import hashlib
import json
import os
import random
import re
import shutil
import stat
import struct
import sys
import tempfile
import time
from typing import Any

# Ensure sibling effect modules in ~/Pictures/bandarchy are importable regardless of cwd
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

np: Any = None
Image: Any = None
f1: Any = None
f2: Any = None
f3: Any = None
f4: Any = None


def _ensure_effect_modules() -> None:
    """Lazy-load numpy, Pillow, and effect families 1–4 only when translating images."""
    global np, Image, f1, f2, f3, f4
    if f1 is not None and f2 is not None and f3 is not None and f4 is not None:
        return
    import numpy as _np
    from PIL import Image as _Image
    import effects_family1 as _f1
    import effects_family2 as _f2
    import effects_family3 as _f3
    import effects_family4 as _f4

    np = _np
    Image = _Image
    f1 = _f1
    f2 = _f2
    f3 = _f3
    f4 = _f4


os.umask(0o077)

MAX_ART_BYTES = 15 * 1024 * 1024  # 15 MiB ceiling matching bin/bandarchy
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")
CATEGORY_NAME_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,48}$")

STANDARD_CATEGORIES: tuple[str, ...] = (
    "brutalist",
    "architecture",
    "nature",
    "objects",
    "cyberpunk",
    "characters",
    "custom",
)

ALL_16_EFFECTS: tuple[str, ...] = (
    # Family 1: Stark Sector Colour-Snatch (01–04)
    "01_SinCity_Chroma_Snatch",
    "02_White_Sector_Colour_Snatch",
    "03_Shadow_Void_Neon_Snatch",
    "04_Slash_Window_Sector_Snatch",
    # Family 2: Duotone, Brutalist Stencil & Sabattier (05–08)
    "05_Omarchy_Cyber_Tritone_Stark",
    "06_Brutalist_Woodcut_Spot_Snatch",
    "07_Sabattier_Solarised_Snatch",
    "08_Acid_Poster_4Sector_Snatch",
    # Family 3: Halftone, Ridgeline & Optical Slicing (09–12)
    "09_Zine_Halftone_Colour_Snatch",
    "10_Pulsar_Ridgeline_Colour_Snatch",
    "11_Glitch_Sector_Chromatic_Shear",
    "12_CRT_Phosphor_Sector_Snatch",
    # Family 4: Neon Edge Contours, Metallic Relief, Braille & Prism (13–16)
    "13_Obsidian_Neon_Edge_Snatch",
    "14_Metallic_Relief_Sector_Snatch",
    "15_Braille_Matrix_Sector_Snatch",
    "16_Prism_Kaleidoscope_Sector_Snatch",
)
ALL_16_EFFECTS_SET: frozenset[str] = frozenset(ALL_16_EFFECTS)

# Default category mapping for the 12 reference source images in ~/Pictures/bandarchy/sources/
DEFAULT_SOURCE_CATEGORY_MAP: dict[str, str] = {
    "01_Arch_Brutalist_Concrete_Colour.jpg": "brutalist",
    "03_Arch_Gothic_Industrial_Arches_BW.jpg": "brutalist",
    "04_Arch_Spiral_Staircase_BW.jpg": "architecture",
    "02_Arch_Neon_Night_Arcade_Colour.jpg": "cyberpunk",
    "10_Objects_Neon_Retro_Vinyl_Colour.jpg": "cyberpunk",
    "05_Nature_Vibrant_Botanical_Leaves_Colour.jpg": "nature",
    "06_Nature_Sunset_Forest_Canopy_Colour.jpg": "nature",
    "07_Nature_Alpine_Peaks_Mist_BW.jpg": "nature",
    "08_Nature_Ocean_Wave_Volcanic_BW.jpg": "nature",
    "09_Objects_Vintage_Synth_Turntable_Colour.jpg": "objects",
    "11_Objects_Classic_Camera_Gears_BW.jpg": "objects",
    "12_Objects_Marble_Bust_Valves_BW.jpg": "custom",
}


class PhotoImportError(ValueError):
    """Operational error raised when validating or importing Bandarchy photographs."""


def resolve_pictures_bandarchy_dir(base_dir: str | None = None) -> str:
    """Resolve `$XDG_PICTURES_DIR/bandarchy` or fallback to `~/Pictures/bandarchy`."""
    if base_dir:
        return os.path.abspath(os.path.expanduser(base_dir))
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


def _probe_image_dimensions(path: str) -> tuple[int, int]:
    """Read PNG/JPEG image width and height directly from file headers without loading PIL."""
    try:
        with open(path, "rb") as fh:
            header = fh.read(32)
            if len(header) >= 24 and header[:8] == b"\x89PNG\r\n\x1a\n" and header[12:16] == b"IHDR":
                w, h = struct.unpack(">II", header[16:24])
                if w > 0 and h > 0:
                    return int(w), int(h)
    except OSError:
        pass
    try:
        from PIL import Image as _PilImage

        with _PilImage.open(path) as im:
            return im.size
    except Exception:
        return 960, 640


def validate_category_name(category: str) -> str:
    """Validate and normalise a category slug."""
    slug = (category or "").strip().lower()
    if not CATEGORY_NAME_RE.match(slug):
        raise PhotoImportError(
            f"Invalid category name {category!r}: must match {CATEGORY_NAME_RE.pattern}"
        )
    return slug


def atomic_write_json(payload: dict[str, Any], dest_path: str) -> str:
    """Atomically write a JSON dictionary to `dest_path` with `0o644` permissions."""
    abs_dest = os.path.abspath(dest_path)
    parent = os.path.dirname(abs_dest)
    os.makedirs(parent, mode=0o755, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(dir=parent, prefix=".manifest_", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            json.dump(payload, fh, indent=2, ensure_ascii=False)
            fh.write("\n")
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


def atomic_save_png(im: Any, dest_path: str) -> str:
    """Atomically save a `PIL.Image.Image` as a PNG with `0o644` permissions."""
    abs_dest = os.path.abspath(dest_path)
    parent = os.path.dirname(abs_dest)
    os.makedirs(parent, mode=0o755, exist_ok=True)
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


def compute_sha256(file_path: str) -> str:
    """Compute the SHA-256 hex digest of a validated regular file."""
    h = hashlib.sha256()
    with open(file_path, "rb") as fh:
        while True:
            chunk = fh.read(65536)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()


def is_generated_artifact_filename(filename: str) -> bool:
    """Return True if `filename` is an effect output, contact sheet, or temp file."""
    base = os.path.basename(filename)
    if base.startswith(".") or base.startswith("ContactSheet_") or "__" in base:
        return True
    if base.endswith(".json"):
        return True
    return any(base.startswith(eff) for eff in ALL_16_EFFECTS)


def validate_raw_source_file(path: str) -> str:
    """Verify `path` is a safe, non-symlinked regular image file within `MAX_ART_BYTES`."""
    if not path or not isinstance(path, str):
        raise PhotoImportError("Empty source image path.")
    abs_path = os.path.abspath(path)
    try:
        st = os.lstat(abs_path)
    except OSError as exc:
        raise PhotoImportError(f"Cannot stat image path {abs_path}: {exc}") from exc
    if stat.S_ISLNK(st.st_mode):
        raise PhotoImportError(f"Refusing symlinked image file: {abs_path}")
    if not stat.S_ISREG(st.st_mode):
        raise PhotoImportError(f"Not a regular file: {abs_path}")
    if st.st_size <= 64:
        raise PhotoImportError(f"Image file too small ({st.st_size} bytes): {abs_path}")
    if st.st_size > MAX_ART_BYTES:
        raise PhotoImportError(
            f"Image file exceeds MAX_ART_BYTES ({st.st_size} > {MAX_ART_BYTES}): {abs_path}"
        )
    ext = os.path.splitext(abs_path)[1].lower()
    if ext not in IMAGE_EXTENSIONS:
        raise PhotoImportError(f"Unsupported image extension {ext!r} for {abs_path}")
    return abs_path


def ensure_directory_structure(
    base_dir: str | None = None,
    extra_categories: list[str] | None = None,
) -> dict[str, Any]:
    """Ensure `categories/<cat>`, `processed/<cat>`, and `imported/<cat>` exist safely."""
    root = resolve_pictures_bandarchy_dir(base_dir)
    if os.path.lexists(root) and os.path.islink(root):
        raise PhotoImportError(f"Refusing symlinked Bandarchy root directory: {root}")
    os.makedirs(root, mode=0o755, exist_ok=True)

    categories_root = os.path.join(root, "categories")
    processed_root = os.path.join(root, "processed")
    imported_root = os.path.join(root, "imported")

    for sub in (categories_root, processed_root, imported_root):
        if os.path.lexists(sub) and os.path.islink(sub):
            raise PhotoImportError(f"Refusing symlinked subdirectory: {sub}")
        os.makedirs(sub, mode=0o755, exist_ok=True)

    cat_set = list(STANDARD_CATEGORIES)
    if extra_categories:
        for c in extra_categories:
            slug = validate_category_name(c)
            if slug not in cat_set:
                cat_set.append(slug)

    # Also discover any existing user-created category folders under categories/
    for entry in sorted(os.listdir(categories_root)):
        if entry.startswith("."):
            continue
        full = os.path.join(categories_root, entry)
        if os.path.isdir(full) and not os.path.islink(full) and CATEGORY_NAME_RE.match(entry.lower()):
            slug = entry.lower()
            if slug not in cat_set:
                cat_set.append(slug)

    category_paths: dict[str, dict[str, str]] = {}
    for slug in cat_set:
        c_drop = os.path.join(categories_root, slug)
        c_proc = os.path.join(processed_root, slug)
        c_imp = os.path.join(imported_root, slug)
        for p in (c_drop, c_proc, c_imp):
            if os.path.lexists(p) and os.path.islink(p):
                raise PhotoImportError(f"Refusing symlinked category directory: {p}")
            os.makedirs(p, mode=0o755, exist_ok=True)
        category_paths[slug] = {
            "drop_in": c_drop,
            "processed": c_proc,
            "imported": c_imp,
        }

    return {
        "root": root,
        "categories_root": categories_root,
        "processed_root": processed_root,
        "imported_root": imported_root,
        "categories": category_paths,
    }


def classify_source_filename(filename: str) -> str:
    """Determine the target category for a source filename when seeding."""
    base = os.path.basename(filename)
    if base in DEFAULT_SOURCE_CATEGORY_MAP:
        return DEFAULT_SOURCE_CATEGORY_MAP[base]
    lower = base.lower()
    if "brutalist" in lower or "gothic" in lower or "concrete" in lower:
        return "brutalist"
    if "neon" in lower or "cyber" in lower or "arcade" in lower:
        return "cyberpunk"
    if "arch" in lower or "stair" in lower or "building" in lower:
        return "architecture"
    if "nature" in lower or "forest" in lower or "alpine" in lower or "ocean" in lower or "botanical" in lower:
        return "nature"
    if "object" in lower or "synth" in lower or "camera" in lower or "vinyl" in lower:
        return "objects"
    if "character" in lower or "portrait" in lower or "person" in lower or "face" in lower or "figure" in lower:
        return "characters"
    return "custom"


def seed_categories_from_sources(
    base_dir: str | None = None,
    sources_dir: str | None = None,
    *,
    force: bool = False,
) -> dict[str, Any]:
    """Copy the 12 reference images from `sources/` into `categories/<category>/` for import.

    Leaves `~/Pictures/bandarchy/sources/` untouched so existing Family 1–4 scripts and
    unit tests continue to work without modification.
    """
    layout = ensure_directory_structure(base_dir)
    root = layout["root"]
    src_dir = os.path.abspath(sources_dir or os.path.join(root, "sources"))
    if not os.path.isdir(src_dir) or os.path.islink(src_dir):
        raise PhotoImportError(f"Sources directory not found or invalid: {src_dir}")

    seeded: list[dict[str, str]] = []
    skipped: list[dict[str, str]] = []

    for entry in sorted(os.listdir(src_dir)):
        if entry.startswith(".") or is_generated_artifact_filename(entry):
            continue
        ext = os.path.splitext(entry)[1].lower()
        if ext not in IMAGE_EXTENSIONS:
            continue
        src_path = os.path.join(src_dir, entry)
        validate_raw_source_file(src_path)
        category = classify_source_filename(entry)
        cat_dirs = layout["categories"][category]
        drop_target = os.path.join(cat_dirs["drop_in"], entry)
        imported_target = os.path.join(cat_dirs["imported"], entry)

        if not force and os.path.isfile(imported_target):
            skipped.append(
                {
                    "filename": entry,
                    "category": category,
                    "reason": "already_imported",
                    "imported_path": imported_target,
                }
            )
            continue

        # Copy non-destructively into categories/<category>/<entry>
        fd, tmp_path = tempfile.mkstemp(dir=cat_dirs["drop_in"], prefix=".seed_", suffix=ext)
        os.close(fd)
        try:
            shutil.copyfile(src_path, tmp_path)
            os.chmod(tmp_path, 0o644)
            os.replace(tmp_path, drop_target)
        except Exception:
            if os.path.exists(tmp_path):
                try:
                    os.unlink(tmp_path)
                except OSError:
                    pass
            raise

        seeded.append(
            {
                "filename": entry,
                "category": category,
                "source_path": src_path,
                "drop_in_path": drop_target,
            }
        )

    return {
        "ok": True,
        "seeded_count": len(seeded),
        "skipped_count": len(skipped),
        "seeded": seeded,
        "skipped": skipped,
    }


def translate_single_image_all_effects(
    source_path: str,
    processed_category_dir: str,
    *,
    effects: list[str] | tuple[str, ...] = ALL_16_EFFECTS,
    max_dim: int = 480,
    palette_index: int = 0,
) -> dict[str, Any]:
    """Translate a validated raw source image across the requested effects (01–16).

    Writes each output PNG atomically to `processed_category_dir/<EffectID>__<SourceStem>.png`.
    """
    _ensure_effect_modules()
    t0 = time.monotonic()
    abs_src = validate_raw_source_file(source_path)
    stem = os.path.splitext(os.path.basename(abs_src))[0]
    sha256_hex = compute_sha256(abs_src)

    # Decode and normalise via PIL (applying EXIF orientation and bounding dimensions)
    try:
        im_base = f1.load_image_non_destructive(abs_src, max_dim=max_dim)
        if max_dim <= 480 and im_base.size != (480, 360):
            from PIL import ImageOps as _ImageOps
            im_base = _ImageOps.fit(im_base, (480, 360), method=Image.Resampling.BILINEAR)
    except Exception as exc:
        raise PhotoImportError(f"Failed to decode image {abs_src}: {exc}") from exc

    # Pre-compute luminance/sector analyses once per required family
    need_f1 = any(e in f1.EFFECT_DISPATCH for e in effects)
    need_f2 = any(e in f2.EFFECT_REGISTRY for e in effects)
    need_f3 = any(e in f3.EFFECT_REGISTRY for e in effects)

    f1_analysis = f1.compute_luminance_and_sectors(im_base) if need_f1 else None
    f2_analysis = f2.analyse_source_image(im_base) if need_f2 else None
    f3_analysis = f3.analyse_sectors(im_base) if need_f3 else None

    is_bw_source = bool(
        f1_analysis["is_bw"]
        if f1_analysis is not None
        else (
            f2_analysis.is_bw_source
            if f2_analysis is not None
            else (
                f3_analysis.is_monochrome
                if f3_analysis is not None
                else f1.compute_luminance_and_sectors(im_base)["is_bw"]
            )
        )
    )

    generated: list[dict[str, Any]] = []
    for eff_idx, effect_name in enumerate(effects):
        if effect_name not in ALL_16_EFFECTS_SET:
            raise PhotoImportError(f"Unknown effect {effect_name!r}")

        t_eff = time.monotonic()
        if effect_name in f1.EFFECT_DISPATCH:
            out_im = f1.EFFECT_DISPATCH[effect_name](im_base, analysis=f1_analysis)
        elif effect_name in f2.EFFECT_REGISTRY:
            out_im = f2.apply_effect_to_image(
                im_base,
                effect_name,
                analysis=f2_analysis,
                palette_index=(palette_index + eff_idx) % len(f2.BANDARCHY_PSYCHEDELIC_PALETTES),
            )
        elif effect_name in f3.EFFECT_REGISTRY:
            chosen_pal = f3.DEFAULT_EFFECT_PALETTES.get(effect_name, "Omarchy Cyber")
            out_im = f3.EFFECT_REGISTRY[effect_name](
                im_base,
                palette_name=chosen_pal,
                analysis=f3_analysis,
            )
        elif effect_name in f4.EFFECTS_FAMILY_4:
            pal_idx = (palette_index + eff_idx) % len(f4.BANDARCHY_PALETTES)
            out_im = f4.EFFECTS_FAMILY_4[effect_name](im_base, palette_index=pal_idx)
        else:
            raise PhotoImportError(f"Unhandled effect {effect_name!r}")

        out_filename = f"{effect_name}__{stem}.png"
        out_path = atomic_save_png(out_im, os.path.join(processed_category_dir, out_filename))
        generated.append(
            {
                "effect": effect_name,
                "output_filename": out_filename,
                "output_path": out_path,
                "width": out_im.width,
                "height": out_im.height,
                "elapsed_ms": round((time.monotonic() - t_eff) * 1000.0, 2),
            }
        )

    return {
        "source_filename": os.path.basename(abs_src),
        "source_stem": stem,
        "sha256": sha256_hex,
        "width": im_base.width,
        "height": im_base.height,
        "is_bw_source": is_bw_source,
        "effects_count": len(generated),
        "outputs": generated,
        "elapsed_ms": round((time.monotonic() - t0) * 1000.0, 2),
    }


def _import_worker(task: dict[str, Any]) -> dict[str, Any]:
    """Worker function for parallel source-image translation and `/imported` archiving."""
    _ensure_effect_modules()
    category = task["category"]
    src_path = task["src_path"]
    processed_dir = task["processed_dir"]
    imported_dir = task["imported_dir"]
    effects = task["effects"]
    max_dim = task["max_dim"]
    palette_index = task["palette_index"]

    # Validate before processing
    abs_src = validate_raw_source_file(src_path)
    filename = os.path.basename(abs_src)
    raw_stem, ext = os.path.splitext(filename)
    ext_lower = ext.lower()

    # Disambiguate if another file with the same stem but a different extension is already in imported/<cat>/
    has_other_ext_in_imported = any(
        os.path.exists(os.path.join(imported_dir, f"{raw_stem}{other_ext}"))
        for other_ext in IMAGE_EXTENSIONS
        if other_ext != ext_lower
    )
    if task.get("disambiguate_ext") or has_other_ext_in_imported:
        ext_tag = ext_lower.lstrip(".")
        filename = f"{raw_stem}_{ext_tag}{ext_lower}"
        stem = f"{raw_stem}_{ext_tag}"
        disambiguated_src = os.path.join(os.path.dirname(abs_src), filename)
        if disambiguated_src != abs_src:
            os.replace(abs_src, disambiguated_src)
            abs_src = disambiguated_src
    else:
        stem = raw_stem

    dest_imported_path = os.path.join(imported_dir, filename)
    src_sha256 = compute_sha256(abs_src)

    # Check if an identical file was already imported and all requested effect PNGs already exist
    already_identical = False
    if os.path.isfile(dest_imported_path) and not os.path.islink(dest_imported_path):
        try:
            imp_sha256 = compute_sha256(dest_imported_path)
            if imp_sha256 == src_sha256:
                all_outputs_exist = all(
                    os.path.isfile(os.path.join(processed_dir, f"{eff}__{stem}.png"))
                    for eff in effects
                )
                if all_outputs_exist:
                    already_identical = True
        except OSError:
            already_identical = False

    if already_identical:
        # Move the duplicate drop-in file into imported/<category>/ without re-running all 16 effects
        os.replace(abs_src, dest_imported_path)
        im_check = f1.load_image_non_destructive(dest_imported_path, max_dim=max_dim)
        w, h = im_check.size
        is_bw_dedup = bool(f1.compute_luminance_and_sectors(im_check)["is_bw"])
        outputs = [
            {
                "effect": eff,
                "output_filename": f"{eff}__{stem}.png",
                "output_path": os.path.join(processed_dir, f"{eff}__{stem}.png"),
                "width": w,
                "height": h,
                "elapsed_ms": 0.0,
            }
            for eff in effects
        ]
        return {
            "status": "deduplicated",
            "category": category,
            "source_filename": filename,
            "source_stem": stem,
            "sha256": src_sha256,
            "imported_path": dest_imported_path,
            "processed_dir": processed_dir,
            "width": w,
            "height": h,
            "is_bw_source": is_bw_dedup,
            "effects_count": len(outputs),
            "outputs": outputs,
            "elapsed_ms": 0.0,
        }

    # Translate across all requested effects into processed/<category>/
    translation = translate_single_image_all_effects(
        abs_src,
        processed_dir,
        effects=effects,
        max_dim=max_dim,
        palette_index=palette_index,
    )

    # Move the raw source file atomically into imported/<category>/<filename>
    os.makedirs(imported_dir, mode=0o755, exist_ok=True)
    os.replace(abs_src, dest_imported_path)

    return {
        "status": "imported",
        "category": category,
        "source_filename": filename,
        "source_stem": stem,
        "sha256": translation["sha256"],
        "imported_path": dest_imported_path,
        "processed_dir": processed_dir,
        "width": translation["width"],
        "height": translation["height"],
        "is_bw_source": translation["is_bw_source"],
        "effects_count": translation["effects_count"],
        "outputs": translation["outputs"],
        "elapsed_ms": translation["elapsed_ms"],
    }


def rebuild_manifests(base_dir: str | None = None) -> dict[str, Any]:
    """Scan `categories/`, `processed/`, and `imported/` and write per-category and master manifests."""
    layout = ensure_directory_structure(base_dir)
    root = layout["root"]
    categories_summary: dict[str, Any] = {}
    total_pending = 0
    total_imported = 0
    total_processed = 0

    for category, dirs in layout["categories"].items():
        drop_dir = dirs["drop_in"]
        proc_dir = dirs["processed"]
        imp_dir = dirs["imported"]

        with os.scandir(drop_dir) as it_drop:
            pending_files = sorted(
                de.name
                for de in it_drop
                if not de.name.startswith(".")
                and os.path.splitext(de.name)[1].lower() in IMAGE_EXTENSIONS
                and not is_generated_artifact_filename(de.name)
                and de.is_file(follow_symlinks=False)
            )

        with os.scandir(imp_dir) as it_imp:
            imported_files = sorted(
                de.name
                for de in it_imp
                if not de.name.startswith(".")
                and os.path.splitext(de.name)[1].lower() in IMAGE_EXTENSIONS
                and de.is_file(follow_symlinks=False)
            )

        with os.scandir(proc_dir) as it_proc:
            processed_files = sorted(
                de.name
                for de in it_proc
                if not de.name.startswith(".")
                and de.name.lower().endswith(".png")
                and "__" in de.name
                and de.is_file(follow_symlinks=False)
            )

        by_effect: dict[str, list[str]] = {eff: [] for eff in ALL_16_EFFECTS}
        by_source_stem: dict[str, list[str]] = {}
        for pf in processed_files:
            eff_part, stem_with_ext = pf.split("__", 1)
            stem = os.path.splitext(stem_with_ext)[0]
            full_pf = os.path.join(proc_dir, pf)
            if eff_part in by_effect:
                by_effect[eff_part].append(full_pf)
            by_source_stem.setdefault(stem, []).append(full_pf)

        cat_manifest = {
            "category": category,
            "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "drop_in_dir": drop_dir,
            "processed_dir": proc_dir,
            "imported_dir": imp_dir,
            "pending_count": len(pending_files),
            "imported_count": len(imported_files),
            "processed_count": len(processed_files),
            "pending_files": [os.path.join(drop_dir, f) for f in pending_files],
            "imported_files": [os.path.join(imp_dir, f) for f in imported_files],
            "processed_files": [os.path.join(proc_dir, f) for f in processed_files],
            "by_effect": {k: v for k, v in by_effect.items() if v},
            "by_source_stem": by_source_stem,
        }
        atomic_write_json(cat_manifest, os.path.join(proc_dir, "category_manifest.json"))

        categories_summary[category] = {
            "drop_in_dir": drop_dir,
            "processed_dir": proc_dir,
            "imported_dir": imp_dir,
            "pending_count": len(pending_files),
            "imported_count": len(imported_files),
            "processed_count": len(processed_files),
            "stems": sorted(by_source_stem.keys()),
        }
        total_pending += len(pending_files)
        total_imported += len(imported_files)
        total_processed += len(processed_files)

    master_manifest = {
        "ok": True,
        "schema_version": 1,
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "root_dir": root,
        "standard_categories": list(STANDARD_CATEGORIES),
        "all_effects": list(ALL_16_EFFECTS),
        "total_pending_raw": total_pending,
        "total_imported_sources": total_imported,
        "total_processed_outputs": total_processed,
        "categories": categories_summary,
    }
    manifest_path = atomic_write_json(master_manifest, os.path.join(root, "manifest.json"))
    master_manifest["manifest_path"] = manifest_path
    return master_manifest


def import_new_photos(
    base_dir: str | None = None,
    *,
    category: str | None = None,
    effects: list[str] | tuple[str, ...] | None = None,
    max_dim: int = 480,
    max_workers: int | None = None,
) -> dict[str, Any]:
    """Scan `categories/<category>/` for new raw images, translate them into `processed/<category>/`,
    and atomically move the raw sources into `imported/<category>/`.

    Uses a non-blocking exclusive `fcntl.flock` lockfile (`.photo_import.lock`) inside the
    Bandarchy root directory so rapid double-clicks of the "Import Photos" button in the UI
    never race on the same drop-in files.
    """
    t0 = time.monotonic()
    extra_cats = [category] if category and category.lower() != "all" else None
    layout = ensure_directory_structure(base_dir, extra_categories=extra_cats)

    lock_path = os.path.join(layout["root"], ".photo_import.lock")
    if os.path.lexists(lock_path) and os.path.islink(lock_path):
        raise PhotoImportError(f"Refusing symlinked lockfile: {lock_path}")
    lock_fd = os.open(lock_path, os.O_CREAT | os.O_RDWR, 0o600)
    try:
        try:
            fcntl.flock(lock_fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            raise PhotoImportError(
                "A Bandarchy photo import is already in progress (.photo_import.lock held)."
            ) from exc

        selected_effects = tuple(effects) if effects else ALL_16_EFFECTS
        for eff in selected_effects:
            if eff not in ALL_16_EFFECTS:
                raise PhotoImportError(f"Unknown effect {eff!r}. Valid effects: {list(ALL_16_EFFECTS)}")

        target_categories: list[str]
        if category and category.lower() != "all":
            slug = validate_category_name(category)
            target_categories = [slug]
        else:
            target_categories = list(layout["categories"].keys())

        tasks: list[dict[str, Any]] = []
        errors: list[dict[str, str]] = []

        for cat_idx, slug in enumerate(target_categories):
            dirs = layout["categories"][slug]
            drop_dir = dirs["drop_in"]
            proc_dir = dirs["processed"]
            imp_dir = dirs["imported"]

            raw_entries = [
                e
                for e in sorted(os.listdir(drop_dir))
                if not e.startswith(".")
                and not is_generated_artifact_filename(e)
                and os.path.splitext(e)[1].lower() in IMAGE_EXTENSIONS
            ]
            # Count stems within this category's drop-in batch so same-stem different-extension files
            # (e.g. brutalist_01.jpg and brutalist_01.png) are disambiguated rather than colliding
            stem_counts: dict[str, int] = {}
            for e in raw_entries:
                s = os.path.splitext(e)[0]
                stem_counts[s] = stem_counts.get(s, 0) + 1

            for entry in raw_entries:
                full_src = os.path.join(drop_dir, entry)
                try:
                    validate_raw_source_file(full_src)
                except PhotoImportError as exc:
                    errors.append(
                        {
                            "category": slug,
                            "file": full_src,
                            "error": str(exc),
                        }
                    )
                    continue

                entry_stem = os.path.splitext(entry)[0]
                tasks.append(
                    {
                        "category": slug,
                        "src_path": full_src,
                        "processed_dir": proc_dir,
                        "imported_dir": imp_dir,
                        "effects": selected_effects,
                        "max_dim": max_dim,
                        "palette_index": (cat_idx + len(tasks)) % 5,
                        "disambiguate_ext": stem_counts.get(entry_stem, 0) > 1,
                    }
                )

        imported_records: list[dict[str, Any]] = []
        deduplicated_records: list[dict[str, Any]] = []

        if tasks:
            workers = max_workers or min(len(tasks), max(1, (os.cpu_count() or 4) // 2))
            if workers <= 1 or len(tasks) == 1:
                for task in tasks:
                    try:
                        rec = _import_worker(task)
                        if rec["status"] == "deduplicated":
                            deduplicated_records.append(rec)
                        else:
                            imported_records.append(rec)
                    except Exception as exc:
                        errors.append(
                            {
                                "category": task["category"],
                                "file": task["src_path"],
                                "error": str(exc),
                            }
                        )
            else:
                with concurrent.futures.ProcessPoolExecutor(max_workers=workers) as pool:
                    future_map = {pool.submit(_import_worker, t): t for t in tasks}
                    for fut in concurrent.futures.as_completed(future_map):
                        t_info = future_map[fut]
                        try:
                            rec = fut.result()
                            if rec["status"] == "deduplicated":
                                deduplicated_records.append(rec)
                            else:
                                imported_records.append(rec)
                        except Exception as exc:
                            errors.append(
                                {
                                    "category": t_info["category"],
                                    "file": t_info["src_path"],
                                    "error": str(exc),
                                }
                            )

        imported_records.sort(key=lambda r: (r["category"], r["source_filename"]))
        deduplicated_records.sort(key=lambda r: (r["category"], r["source_filename"]))

        manifest_state = rebuild_manifests(base_dir)
        elapsed_ms = round((time.monotonic() - t0) * 1000.0, 2)

        generated_png_count = sum(r["effects_count"] for r in imported_records)
        return {
            "ok": len(errors) == 0,
            "action": "import",
            "root_dir": layout["root"],
            "scanned_categories": target_categories,
            "imported_sources_count": len(imported_records),
            "deduplicated_sources_count": len(deduplicated_records),
            "generated_outputs_count": generated_png_count,
            "errors_count": len(errors),
            "elapsed_ms": elapsed_ms,
            "manifest_path": manifest_state["manifest_path"],
            "categories_summary": manifest_state["categories"],
            "imported": imported_records,
            "deduplicated": deduplicated_records,
            "errors": errors,
        }
    finally:
        try:
            fcntl.flock(lock_fd, fcntl.LOCK_UN)
        except OSError:
            pass
        os.close(lock_fd)


def pick_category_photo(
    base_dir: str | None = None,
    *,
    category: str = "all",
    effect: str | None = None,
    stem: str | None = None,
    exclude_stem: str | None = None,
    seed: int | None = None,
) -> dict[str, Any]:
    """Select a translated stark image from `processed/<category>/` for the Bandarchy Photo Layer."""
    layout = ensure_directory_structure(base_dir)
    cat_slug = (category or "all").strip().lower()

    if cat_slug == "all":
        candidate_categories = list(layout["categories"].keys())
    else:
        cat_slug = validate_category_name(cat_slug)
        if cat_slug not in layout["categories"]:
            raise PhotoImportError(
                f"Unknown category {cat_slug!r}. Available: {list(layout['categories'].keys())}"
            )
        candidate_categories = [cat_slug]

    if effect and effect not in ALL_16_EFFECTS_SET:
        raise PhotoImportError(
            f"Unknown effect {effect!r}. Available: {list(ALL_16_EFFECTS)}"
        )

    candidates: list[dict[str, str]] = []
    stem_effects: dict[tuple[str, str], dict[str, str]] = {}
    for slug in candidate_categories:
        proc_dir = layout["categories"][slug]["processed"]
        imp_dir = layout["categories"][slug]["imported"]
        if not os.path.isdir(proc_dir) or os.path.islink(proc_dir):
            continue
        with os.scandir(proc_dir) as it_proc:
            proc_entries = sorted(
                de.name
                for de in it_proc
                if not de.name.startswith(".")
                and de.name.lower().endswith(".png")
                and "__" in de.name
                and de.is_file(follow_symlinks=False)
            )
        for entry in proc_entries:
            eff_part, stem_with_ext = entry.split("__", 1)
            cand_stem = os.path.splitext(stem_with_ext)[0]
            full_png = os.path.join(proc_dir, entry)
            if eff_part in ALL_16_EFFECTS_SET:
                stem_effects.setdefault((slug, cand_stem), {})[eff_part] = full_png
            if effect and eff_part != effect:
                continue
            if stem and cand_stem != stem:
                continue
            candidates.append(
                {
                    "category": slug,
                    "effect": eff_part,
                    "source_stem": cand_stem,
                    "processed_dir": proc_dir,
                    "processed_path": full_png,
                    "imported_dir": imp_dir,
                }
            )

    if not candidates:
        raise PhotoImportError(
            f"No translated images available for category={cat_slug!r}, effect={effect!r}. "
            "Drop images into ~/Pictures/bandarchy/categories/<category>/ and click Import."
        )

    if exclude_stem and not stem:
        if cat_slug in ("", "all"):
            excluded_cats = [c["category"] for c in candidates if c["source_stem"] == exclude_stem]
            if excluded_cats:
                locked_cat = excluded_cats[0]
                same_cat_candidates = [c for c in candidates if c["category"] == locked_cat]
                if same_cat_candidates:
                    candidates = same_cat_candidates
        non_excluded = [c for c in candidates if c["source_stem"] != exclude_stem]
        if non_excluded:
            candidates = non_excluded

    rng = random.Random(seed)
    chosen = rng.choice(candidates)
    width, height = _probe_image_dimensions(chosen["processed_path"])

    chosen_proc_dir = chosen["processed_dir"]
    chosen_imp_dir = chosen["imported_dir"]
    chosen_stem = chosen["source_stem"]
    chosen_cat = chosen["category"]
    chosen_effect = chosen["effect"]

    archived_src = ""
    for ext in IMAGE_EXTENSIONS:
        cand_imp = os.path.join(chosen_imp_dir, f"{chosen_stem}{ext}")
        if os.path.isfile(cand_imp) and not os.path.islink(cand_imp):
            archived_src = cand_imp
            break
    chosen["imported_source_path"] = archived_src

    known_stem_vars = stem_effects.get((chosen_cat, chosen_stem), {})
    variants_map: dict[str, str] = {}
    for eff_id in ALL_16_EFFECTS:
        if eff_id in known_stem_vars:
            variants_map[eff_id] = known_stem_vars[eff_id]
        else:
            cand_var = os.path.join(chosen_proc_dir, f"{eff_id}__{chosen_stem}.png")
            if os.path.isfile(cand_var) and not os.path.islink(cand_var):
                variants_map[eff_id] = cand_var

    # Build category peer cohorts for the `;` key 3-mode pool selector:
    #   Mode 0: Effects of Same Image (in category) -> `variants`
    #   Mode 1: Images of Same Effect (in category) -> `sameEffectPeers` & `sameEffectByVariant`
    #   Mode 2: Randomisation of 1 & 2 (in category) -> `randomPoolPeers`
    chosen_key = (chosen_cat, chosen_stem)
    peer_keys = [k for k in sorted(stem_effects.keys()) if k != chosen_key and k[0] == chosen_cat]
    rng.shuffle(peer_keys)
    ordered_stems = [chosen_key, *peer_keys] if chosen_key in stem_effects else peer_keys

    same_effect_by_variant: dict[str, dict[str, str]] = {}
    for target_eff in ALL_16_EFFECTS:
        slot_map: dict[str, str] = {}
        fallback_path = variants_map.get(target_eff, chosen["processed_path"])
        for slot_idx, slot_eff_key in enumerate(ALL_16_EFFECTS):
            if ordered_stems:
                peer_k = ordered_stems[slot_idx % len(ordered_stems)]
                peer_eff_map = stem_effects.get(peer_k, {})
                slot_map[slot_eff_key] = peer_eff_map.get(target_eff, fallback_path)
            else:
                slot_map[slot_eff_key] = fallback_path
        same_effect_by_variant[target_eff] = slot_map

    same_effect_peers = same_effect_by_variant.get(
        chosen_effect,
        same_effect_by_variant.get(ALL_16_EFFECTS[0], dict(variants_map)),
    )

    shuffled_effects = list(ALL_16_EFFECTS)
    rng.shuffle(shuffled_effects)
    random_pool_peers: dict[str, str] = {}
    for slot_idx, slot_eff_key in enumerate(ALL_16_EFFECTS):
        if slot_idx == 0:
            random_pool_peers[slot_eff_key] = chosen["processed_path"]
            continue
        rand_eff = shuffled_effects[slot_idx % len(shuffled_effects)]
        if ordered_stems:
            peer_k = ordered_stems[slot_idx % len(ordered_stems)]
            peer_eff_map = stem_effects.get(peer_k, {})
            if rand_eff in peer_eff_map:
                random_pool_peers[slot_eff_key] = peer_eff_map[rand_eff]
            elif peer_eff_map:
                first_avail = next(iter(peer_eff_map.values()))
                random_pool_peers[slot_eff_key] = first_avail
            else:
                random_pool_peers[slot_eff_key] = variants_map.get(rand_eff, chosen["processed_path"])
        else:
            random_pool_peers[slot_eff_key] = variants_map.get(rand_eff, chosen["processed_path"])

    return {
        "ok": True,
        "action": "pick",
        "category": chosen_cat,
        "effect": chosen_effect,
        "source_stem": chosen_stem,
        "processed_dir": chosen_proc_dir,
        "processed_path": chosen["processed_path"],
        "imported_source_path": chosen["imported_source_path"],
        "variants": variants_map,
        "sameEffectPeers": same_effect_peers,
        "sameEffectByVariant": same_effect_by_variant,
        "randomPoolPeers": random_pool_peers,
        "categoryStemCount": len(ordered_stems),
        "width": width,
        "height": height,
        "available_in_pool": len(candidates),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Bandarchy Photo Layer Category Organiser, Incremental Importer & Stark Translator."
    )
    parser.add_argument(
        "--base-dir",
        default=None,
        help="Override ~/Pictures/bandarchy root directory.",
    )
    parser.add_argument(
        "--init-dirs",
        action="store_true",
        help="Ensure categories/, processed/, and imported/ folders exist for all categories.",
    )
    parser.add_argument(
        "--seed-from-sources",
        action="store_true",
        help="Copy reference images from sources/ into categories/<category>/ for import testing.",
    )
    parser.add_argument(
        "--force-seed",
        action="store_true",
        help="When used with --seed-from-sources, copy even if already present in imported/<category>/.",
    )
    parser.add_argument(
        "--import",
        dest="do_import",
        action="store_true",
        help="Translate any new raw images in categories/<category>/ into processed/<category>/ and move raw files to imported/<category>/.",
    )
    parser.add_argument(
        "--status",
        action="store_true",
        help="Rebuild manifests and print category counts (pending, imported, processed).",
    )
    parser.add_argument(
        "--pick",
        action="store_true",
        help="Pick a translated stark image from processed/<category>/ for the Bandarchy Photo Layer.",
    )
    parser.add_argument(
        "--category",
        default=None,
        help="Filter by category name (brutalist, architecture, nature, objects, cyberpunk, characters, custom, or all).",
    )
    parser.add_argument(
        "--effect",
        default=None,
        help="Filter by a specific effect ID (01..16) when using --pick or --import.",
    )
    parser.add_argument(
        "--stem",
        default=None,
        help="Filter by a specific source_stem when using --pick.",
    )
    parser.add_argument(
        "--exclude-stem",
        default=None,
        help="Exclude a specific source_stem when randomly picking with --pick.",
    )
    parser.add_argument(
        "--effects",
        default=None,
        help="Comma-separated list of effect IDs to run during --import (defaults to all 16).",
    )
    parser.add_argument(
        "--max-dim",
        type=int,
        default=480,
        help="Maximum image dimension in pixels for translated stark copies (default: 480).",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=None,
        help="Optional RNG seed for deterministic --pick selection.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit a single bounded JSON object on stdout (Bandarchy QML helper protocol).",
    )
    args = parser.parse_args(argv)

    try:
        effects_list: list[str] | None = None
        if args.effects:
            effects_list = [e.strip() for e in args.effects.split(",") if e.strip()]
        elif args.effect and not args.pick:
            effects_list = [args.effect.strip()]

        if args.seed_from_sources:
            seed_res = seed_categories_from_sources(
                args.base_dir,
                force=args.force_seed,
            )
            if args.do_import:
                imp_res = import_new_photos(
                    args.base_dir,
                    category=args.category,
                    effects=effects_list,
                    max_dim=args.max_dim,
                )
                imp_res["seed_summary"] = seed_res
                payload = imp_res
            else:
                payload = seed_res
        elif args.pick:
            payload = pick_category_photo(
                args.base_dir,
                category=args.category or "all",
                effect=args.effect,
                stem=args.stem,
                exclude_stem=args.exclude_stem,
                seed=args.seed,
            )
        elif args.status:
            payload = rebuild_manifests(args.base_dir)
        elif args.init_dirs and not args.do_import:
            ensure_directory_structure(args.base_dir)
            payload = rebuild_manifests(args.base_dir)
        else:
            # Default action is --import
            payload = import_new_photos(
                args.base_dir,
                category=args.category,
                effects=effects_list,
                max_dim=args.max_dim,
            )
    except PhotoImportError as exc:
        err_payload = {"ok": False, "error": str(exc)}
        if args.json:
            print(json.dumps(err_payload, ensure_ascii=False))
        else:
            print(json.dumps(err_payload, indent=2, ensure_ascii=False), file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps(payload, ensure_ascii=False))
    else:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
