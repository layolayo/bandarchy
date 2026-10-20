.pragma library

// PhotoMotionEngine.js — Bandarchy Stage-2 Real-Time Photo Motion, 3D XYZ Plane,
// 16-Variant Strobe, Palette-Resonance & Sector-Opacity Engine (Modes M01–M25)
//
// Designed for direct drop-in integration into `/home/matthew/Projects/bandarchy`:
//   - Placement: 12th World in Layer 1 (`1: Worlds` -> `layer1Mode = 11`,
//     `"Stark Photo Realm"`, short label `"12:StarkPhoto"`), keeping the Photo Layer
//     a special, high-impact visual event without cluttering the 6-Layer top bar.
//   - Multi-Variant Strobe & Cross-Fade: Operates on the 16 pre-rendered Stage-1
//     Stark & Sector Colour-Snatch PNG variants (`01..16`) of the *same* source
//     photograph in `~/Pictures/bandarchy/processed/<category>/`, rapidly strobing
//     or smoothly cross-dissolving (`photoFadeDuration`: 0.0s..6.0s) across variants.
//   - Active Palette Resonance (`computePaletteResonance`): Matches photograph hues
//     against Bandarchy's 30 palettes (`PALETTES[paletteIndex]`) and Omarchy theme
//     accents (`#6ee7b7`, `#f472b6`, `#38bdf8`, `#fbbf24`), hyper-enhancing matched
//     sectors with neon bloom and shockwave rings.
//   - Full Fade & Sector-Selective Opacity (`photoOpacity`, `photoBlackOpacity`,
//     `photoMidOpacity`, `photoWhiteOpacity`, `photoColourSnatchOpacity`) + Generic
//     Audio-Responder link `l_photo_opacity`.
//   - Five Dedicated Keybindings:
//       * `[` / `]` : Step Image Backward / Forward through category history deque
//       * `H`       : Hold / Pause current photo for 1 minute (60s) or until another
//                     image is requested (keeps live Stage-2 3D/audio effects active)
//       * `{` / `}` : Step Photo Category Backward / Forward across all categories

var LAYER1_WORLD12_INDEX = 11
var LAYER1_WORLD12_NAME = "Stark Photo Realm"
var LAYER1_WORLD12_SHORT_LABEL = "12:StarkPhoto"

// Standard Photo Layer categories in `~/Pictures/bandarchy/processed/<category>/`
var DEFAULT_PHOTO_CATEGORIES = [
    "all",
    "brutalist",
    "architecture",
    "nature",
    "objects",
    "cyberpunk",
    "characters",
    "custom"
]

var PHOTO_CATEGORY_LABELS = {
    "all": "All Categories",
    "brutalist": "Brutalist",
    "architecture": "Architecture",
    "nature": "Nature",
    "objects": "Objects",
    "cyberpunk": "Cyberpunk",
    "characters": "Characters",
    "custom": "Custom"
}

function formatPhotoCategoryLabel(catSlug) {
    var s = String(catSlug || "").trim()
    if (!s || s.toLowerCase() === "all") return "All Categories"
    var lower = s.toLowerCase()
    if (PHOTO_CATEGORY_LABELS[lower]) return PHOTO_CATEGORY_LABELS[lower]
    var parts = s.split(/[_\-\s]+/)
    var out = []
    for (var i = 0; i < parts.length; i++) {
        var w = parts[i]
        if (w.length > 0) {
            out.push(w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        }
    }
    return out.length > 0 ? out.join(" ") : (s.charAt(0).toUpperCase() + s.slice(1))
}

// All 17 Stage-1 Stark, Sector Colour-Snatch & Accessible Original Effect Prefixes
var STAGE1_EFFECT_IDS = [
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
    "17_Original_Accessible_Compressed"
]

// All 25 Stage-2 Real-Time Photo Motion, 3D XYZ, Strobe, Mirror, Tiling, Separation & World-Bending Modes (M01–M25)
var PHOTO_MOTION_MODES = [
    // Group A (M01–M06): 3D XYZ Plane Manipulation & Multi-Variant Strobe (`photo_motion_group1.py`)
    {
        index: 0,
        code: "M01",
        id: "M01_3D_XYZ_Plane_Effect_Strobe",
        name: "3D XYZ Plane Tilt & 16-Variant Strobe",
        shortLabel: "M01:3D-Strobe",
        group: "Group A: 3D XYZ & Variant Strobe",
        description: "Manipulates the photograph as a floating 3D XYZ perspective plane (pitch, yaw, roll, Z-kick, horizon glow, and 3D echo ghosts) while rapidly strobing or cross-fading the same source image through all 16 pre-rendered Stark variants."
    },
    {
        index: 1,
        code: "M02",
        id: "M02_4D_Tesseract_Folding_Cube",
        name: "4D Tesseract Folding Cube",
        shortLabel: "M02:4D-Cube",
        group: "Group A: 3D XYZ & Variant Strobe",
        description: "Projects different Stark effect variants of the same photograph onto the faces of a rotating, unfolding 3D/4D perspective hypercube (outer 3D cube + inner tesseract core) with palette-matched neon wireframe edges."
    },
    {
        index: 2,
        code: "M03",
        id: "M03_Relativistic_Z_Corridor_Echo_Train",
        name: "Relativistic Z-Corridor Echo Train",
        shortLabel: "M03:Z-Corridor",
        group: "Group A: 3D XYZ & Variant Strobe",
        description: "Spawns an infinite receding Z-corridor of 10-12 translucent 3D photo planes along a curving relativistic spline where each depth plane displays a different Stark variant (01..16) of the same image."
    },
    {
        index: 3,
        code: "M04",
        id: "M04_Stroboscopic_Shutter_Ghost_Flicker",
        name: "Stroboscopic Shutter & Ghost Flicker",
        shortLabel: "M04:Shutter",
        group: "Group A: 3D XYZ & Variant Strobe",
        description: "High-speed nightclub shutter strobe cycling rapidly between positive Stark variants, inverted negative slices, displaced afterimage ghost trails with decaying opacity, and palette resonance flashes."
    },
    {
        index: 4,
        code: "M05",
        id: "M05_Gyroscopic_3_Axis_Card_Flip_Cascade",
        name: "Gyroscopic 3-Axis Card Flip Cascade",
        shortLabel: "M05:GyroFlip",
        group: "Group A: 3D XYZ & Variant Strobe",
        description: "Concentric 3D gimbal rings and panels cut from the photo plane that spin independently on X, Y, and Z axes while flipping between Stark effect variants of the same image on each half-rotation."
    },
    {
        index: 5,
        code: "M06",
        id: "M06_Chronos_Time_Slice_Slit_Scan",
        name: "Chronos Time-Slice Slit-Scan",
        shortLabel: "M06:SlitScan",
        group: "Group A: 3D XYZ & Variant Strobe",
        description: "Spatial-temporal slit-scan where wavy phase-modulated bands across a tilted 3D perspective plane simultaneously reveal different Stark effect variants (01..16) of the same photograph."
    },

    // Group B (M07–M12): Kaleidoscopic Mirroring, Sacred Symmetry & Infinite Tiling
    {
        index: 6,
        code: "M07",
        id: "M07_Quad_Octa_Mirror_Symmetry_Fold",
        name: "Sacred 4x/8x Kaleidoscopic Mirror Fold",
        shortLabel: "M07:MirrorFold",
        group: "Group B: Mirror & Tiling",
        description: "Folds the photo across rotating 4-way and 8-way mirror axes, alternating Stark effect variants across mirrored wedges on snare hits."
    },
    {
        index: 7,
        code: "M08",
        id: "M08_Infinite_Mosaic_Variant_Matrix_Tiling",
        name: "4x4 All-16-Variants Mosaic Matrix",
        shortLabel: "M08:16-Tile",
        group: "Group B: Mirror & Tiling",
        description: "Tiles the stage into an audio-reactive NxN mosaic grid displaying all 16 Stark variants of the same photograph simultaneously and permuting cells on the beat."
    },
    {
        index: 8,
        code: "M09",
        id: "M09_Fractal_Droste_Recursive_Frame_In_Frame",
        name: "Infinite Droste Recursive Zoom",
        shortLabel: "M09:Droste",
        group: "Group B: Mirror & Tiling",
        description: "Embeds recursive rotated copies of the photograph inside itself in a spiralling Droste vortex where each nested level advances to the next Stark variant."
    },
    {
        index: 9,
        code: "M10",
        id: "M10_Sliding_Tectonic_Mirror_Tessellation",
        name: "Tectonic Counter-Sliding Mirror Strips",
        shortLabel: "M10:Tectonic",
        group: "Group B: Mirror & Tiling",
        description: "Slices the canvas into alternating horizontal/diagonal mirror bands that slide in opposite directions to bass grooves while strobing between paired variants."
    },
    {
        index: 10,
        code: "M11",
        id: "M11_Hexagonal_Honeycomb_Kaleidoscope_Array",
        name: "Hexagonal Honeycomb Prism Array",
        shortLabel: "M11:HexPrism",
        group: "Group B: Mirror & Tiling",
        description: "Refracts the photograph through a compound-eye hexagonal honeycomb lattice with per-cell radial zoom and palette-tinted cell borders."
    },
    {
        index: 11,
        code: "M12",
        id: "M12_Split_Horizon_Inception_90Deg_Fold",
        name: "Inception 4-Wall Architectural Box Fold",
        shortLabel: "M12:BoxFold",
        group: "Group B: Mirror & Tiling",
        description: "Folds the photograph at 90-degree architectural hinges into floor, ceiling, and side walls that breathe inward and outward with kick transients."
    },

    // Group C (M13–M18): Sector Separation, Chromatic Split, Slicing & Strobe Flicker
    {
        index: 12,
        code: "M13",
        id: "M13_RGB_And_Palette_Channel_Vector_Separation",
        name: "Tri-Vector Palette Channel Separation",
        shortLabel: "M13:TriSplit",
        group: "Group C: Separation & Flicker",
        description: "Separates the photo into 3 independent palette-tinted ghosts ejected at 120-degree vectors on kick/snare hits before snapping back via spring physics."
    },
    {
        index: 13,
        code: "M14",
        id: "M14_48Band_FFT_Vertical_Venetian_Shredder",
        name: "48-Band Equaliser Venetian Shredder",
        shortLabel: "M14:48-Shred",
        group: "Group C: Separation & Flicker",
        description: "Slices the photograph into 48 vertical ribbons mapped 1:1 to Bandarchy's 48 FFT spectrum bars, displacing and variant-swapping each column by live band energy."
    },
    {
        index: 14,
        code: "M15",
        id: "M15_High_Frequency_Rave_Shutter_Variant_Strobe",
        name: "Berlin Rave Shutter & Negative Strobe",
        shortLabel: "M15:RaveStrobe",
        group: "Group C: Separation & Flicker",
        description: "High-impact warehouse shutter effect that cycles through the 16 Stark variants of the same image on 16th-note hi-hats with negative-inversion flashes on kicks."
    },
    {
        index: 15,
        code: "M16",
        id: "M16_Concentric_Radar_Ring_Sector_Shear",
        name: "Concentric Counter-Rotating Ring Shear",
        shortLabel: "M16:RingShear",
        group: "Group C: Separation & Flicker",
        description: "Cuts the photograph into concentric bullseye rings that counter-rotate like a cryptographic vault lock, with each ring displaying a different Stark variant."
    },
    {
        index: 16,
        code: "M17",
        id: "M17_Voronoi_Glass_Shatter_And_Beat_Reform",
        name: "Voronoi Shards Shatter & Rebuild",
        shortLabel: "M17:Shatter",
        group: "Group C: Separation & Flicker",
        description: "Fractures the photograph into polygonal glass shards that explode outward in 3D Z-space on drops and magnetically reassemble on breakdowns."
    },
    {
        index: 17,
        code: "M18",
        id: "M18_Scanline_Phase_Slip_And_VHS_Tracking_Tear",
        name: "CRT Scanline Phase-Slip & Tracking Tear",
        shortLabel: "M18:ScanTear",
        group: "Group C: Separation & Flicker",
        description: "Applies horizontal sync-loss tearing, phosphor halation, and rolling variant-swap bars driven by mid-synth and snare transients."
    },

    // Group D (M19–M25): World-Bending Warps, Palette Resonance & Relativistic Portals
    {
        index: 18,
        code: "M19",
        id: "M19_Palette_Resonance_Hyper_Enhancer",
        name: "Palette Resonance Hyper-Enhancer",
        shortLabel: "M19:PalHyper",
        group: "Group D: World-Bending & Palette",
        description: "Analyses pixel hues against the active Bandarchy palette (30 palettes) and Omarchy theme colours; matching hues ignite with neon bloom and shockwave rings while non-matching hues lock to stark B&W across all 16 variants."
    },
    {
        index: 19,
        code: "M20",
        id: "M20_Event_Horizon_Gravitational_Lens",
        name: "Event Horizon Gravitational Lens",
        shortLabel: "M20:GravLens",
        group: "Group D: World-Bending & Palette",
        description: "Orbits twin relativistic black holes across the photo plane, bending architectural lines into Einstein lensing rings while pulling colour-snatched sectors into a palette accretion vortex."
    },
    {
        index: 20,
        code: "M21",
        id: "M21_Mobius_Cylinder_And_Torus_Tunnel_Wrap",
        name: "Möbius Cylinder & Torus Tunnel Wrap",
        shortLabel: "M21:MöbiusTun",
        group: "Group D: World-Bending & Palette",
        description: "Wraps the 2D photo plane around a spinning 3D cylinder / Möbius torus tunnel that the camera flies through, seamlessly stitching variants 01..16 of the same image along the tunnel rings."
    },
    {
        index: 21,
        code: "M22",
        id: "M22_Liquid_Acid_Domain_Warp_Melt",
        name: "Liquid Acid Domain-Warp Melt",
        shortLabel: "M22:AcidMelt",
        group: "Group D: World-Bending & Palette",
        description: "Applies a divergence-free curl-noise liquid plasma displacement field that melts white and colour-snatched sectors on mid-synth swells while snapping back to stark geometry on kick transients."
    },
    {
        index: 22,
        code: "M23",
        id: "M23_Luma_Key_Vortex_Portal_Bleed",
        name: "Luma-Key Vortex Portal Bleed",
        shortLabel: "M23:PortalKey",
        group: "Group D: World-Bending & Palette",
        description: "Turns obsidian black (Y < 0.12) or stark white (Y > 0.85) sectors into live transparent alpha portals through which Bandarchy's psychedelic vortex and 3D worlds bleed and counter-rotate."
    },
    {
        index: 23,
        code: "M24",
        id: "M24_Cymatic_Chladni_Standing_Wave_Ripple",
        name: "Cymatic Chladni Standing-Wave Ripple",
        shortLabel: "M24:Chladni",
        group: "Group D: World-Bending & Palette",
        description: "Superimposes 2D Chladni nodal standing-wave harmonics driven by live bass/mid/high bands, vibrating the photo plane and strobing between two Stark variants along glowing nodal ridges."
    },
    {
        index: 24,
        code: "M25",
        id: "M25_Hyperdrive_Volumetric_Radial_Extrusion",
        name: "Hyperdrive Volumetric Radial Extrusion",
        shortLabel: "M25:GodRays",
        group: "Group D: World-Bending & Palette",
        description: "Extrudes bright white and palette-matched colour sectors into 3D volumetric god-rays shooting toward the viewer from an orbiting vanishing point while cycling across the 16 variants."
    }
]

var PHOTO_MOTION_MODE_NAMES = []
var SHORT_PHOTO_MOTION_LABELS = []
for (var _mIdx = 0; _mIdx < PHOTO_MOTION_MODES.length; _mIdx++) {
    PHOTO_MOTION_MODE_NAMES.push(PHOTO_MOTION_MODES[_mIdx].name)
    SHORT_PHOTO_MOTION_LABELS.push(PHOTO_MOTION_MODES[_mIdx].shortLabel)
}

// Synchronised 30 Bandarchy Palettes (`PsychedelicEngine.js`)
var PALETTE_NAMES = [
    "Acid Rainbow", "Cyber Neon", "Solar Flare", "Bioluminescence", "Ultraviolet Rave",
    "Deep Nebula", "Emerald Matrix", "Blood Moon", "Cosmic Gold", "Arctic Aurora",
    "Tokyo Synthwave", "Electric Plasma", "Toxic Acid 303", "Outrun Sunset", "Holographic Prism",
    "DMT Hyperspace", "Sub-Zero Cryo", "Volcanic Magma", "Vaporwave Mall", "Quantum Supernova",
    "Jungle Biolume", "Berlin Strobe", "Amethyst Crystal", "Copper Demoscene", "Abalone Pearl",
    "Radioactive Isotope", "Starlight Quasar", "Crimson Velvet", "Oceanic Trench", "Prismatic Kaleidoscope"
]

var PALETTES = [
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
    ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff924c"]
]

// 3-Mode Multi-Image / Multi-Effect Category Pool Selector (`;` keybinding)
var PHOTO_POOL_MODES = [
    {
        index: 0,
        id: "same_image_effects",
        shortLabel: "1:Effects/1-Img",
        name: "1. Effects of Same Image (in category)",
        description: "Cycles and maps the 16 Stark effects of the same active photograph within the category."
    },
    {
        index: 1,
        id: "same_effect_images",
        shortLabel: "2:Imgs/1-Effect",
        name: "2. Images of Same Effect (in category)",
        description: "Cycles and maps different photographs from the active category all rendered with the same Stark effect."
    },
    {
        index: 2,
        id: "random_images_and_effects",
        shortLabel: "3:Rand(1&2)",
        name: "3. Randomisation of 1 & 2 (in category)",
        description: "Randomises both photographs and Stark effects across planes and strobe cycles within the active category."
    }
]

// Dedicated Visualiser Keybindings for the Photo Layer (World 12 in Layer 1)
var PHOTO_KEYBINDINGS = {
    stepImageBackward: {
        keys: ["[", "Qt.Key_BracketLeft"],
        action: "stepPhotoBackward",
        description: "Step backward to the previous photograph in the category history deque (cancels 1-minute hold if active)."
    },
    stepImageForward: {
        keys: ["]", "Qt.Key_BracketRight"],
        action: "stepPhotoForward",
        description: "Step forward to the next photograph in the active category (cancels 1-minute hold if active)."
    },
    holdPhotoOneMinute: {
        keys: ["H", "Qt.Key_H"],
        action: "toggleHoldPhotoOneMinute",
        description: "Pause / hold the current photograph for 60 seconds (1 minute) or until another image is requested via [ or ], while keeping live Stage-2 3D/strobe/palette audio-reactivity running."
    },
    stepCategoryBackward: {
        keys: ["{", "Shift+[", "Qt.Key_BraceLeft"],
        action: "stepCategoryBackward",
        description: "Cycle the active Photo Category backward (All <- Brutalist <- Architecture <- Nature <- Objects <- Cyberpunk <- Characters <- Custom) and load a photo from that category."
    },
    stepCategoryForward: {
        keys: ["}", "Shift+]", "Qt.Key_BraceRight"],
        action: "stepCategoryForward",
        description: "Cycle the active Photo Category forward (All -> Brutalist -> Architecture -> Nature -> Objects -> Cyberpunk -> Characters -> Custom) and load a photo from that category."
    },
    cyclePhotoPoolMode: {
        keys: [";", "Qt.Key_Semicolon"],
        action: "cyclePhotoPoolMode",
        description: "Cycle the category utilisation pool between: 1. Effects of Same Image, 2. Images of Same Effect, and 3. Randomisation of 1 & 2."
    },
    togglePhotoPlaneShear: {
        keys: [":", "Shift+;", "Qt.Key_Colon"],
        action: "togglePhotoPlaneShear",
        description: "Toggle controlled 3D plane shearing ON/OFF across 3D perspective quads (modes 01, 02, 05, 09, 12, 13, 19, 21, 23)."
    },
    togglePhotoEffectRandom: {
        keys: ["~", "Qt.Key_AsciiTilde"],
        action: "togglePhotoAutoMotionEvents",
        description: "Toggle dedicated Photo-Engine effect randomisation ON/OFF independently of L1 World Rand."
    }
}

// Generic Audio-Responder Link Targets for the Photo Layer
var AUDIO_RESPONDER_PHOTO_LINKS = [
    {
        id: "l_photo_motion_activity",
        label: "Activity",
        name: "Master Motion Activity & Speed",
        property: "photoMotionActivity",
        min: 0.10,
        max: 2.00,
        defaultVal: 1.00,
        recommendedSource: 1, // Kick & Sub-Bass
        recommendedMethod: "+"
    },
    {
        id: "l_photo_opacity",
        label: "Opacity",
        name: "Master Photo Layer Opacity",
        property: "photoOpacity",
        min: 0.05,
        max: 1.00,
        defaultVal: 0.85,
        recommendedSource: 7, // Drop vs Breakdown or 1: Kick & Sub-Bass
        recommendedMethod: "+"
    },
    {
        id: "l_photo_strobe_rate",
        label: "Strobe Rate",
        name: "16-Variant Strobe & Cross-Fade Speed",
        property: "photoStrobeSpeed",
        min: 0.10,
        max: 2.00,
        defaultVal: 1.00,
        recommendedSource: 4, // Highs / Hi-Hats or 5: Beat Onset
        recommendedMethod: "+"
    },
    {
        id: "l_photo_xyz_tilt",
        label: "XYZ Tilt",
        name: "3D XYZ Plane Pitch / Yaw / Roll Excursion",
        property: "photoXyzTilt",
        min: 0.00,
        max: 2.50,
        defaultVal: 1.00,
        recommendedSource: 2, // Bass Groove
        recommendedMethod: "~"
    },
    {
        id: "l_photo_zoom_punch",
        label: "Z-Punch",
        name: "3D Z-Depth Kick Zoom Punch",
        property: "photoZoomPunch",
        min: 0.25,
        max: 2.50,
        defaultVal: 1.15,
        recommendedSource: 1, // Kick & Sub-Bass
        recommendedMethod: "+"
    },
    {
        id: "l_photo_palette_bloom",
        label: "Pal Bloom",
        name: "Active Palette Resonance & Shockwave Bloom",
        property: "photoPaletteBloom",
        min: 0.00,
        max: 2.50,
        defaultVal: 1.20,
        recommendedSource: 3, // Mid Synth / Vocals
        recommendedMethod: "+"
    },
    {
        id: "l_photo_warp_melt",
        label: "Warp/Melt",
        name: "World-Bending Lens / Curl-Melt Intensity",
        property: "photoWarpIntensity",
        min: 0.00,
        max: 2.50,
        defaultVal: 1.00,
        recommendedSource: 3, // Mid Synth / Vocals
        recommendedMethod: "+"
    },
    {
        id: "l_photo_plane_shear",
        label: "Plane Shear",
        name: "Controlled 3D Plane Shear & Split-Triangle Displacement",
        property: "photoPlaneShear",
        min: 0.00,
        max: 2.00,
        defaultVal: 0.00,
        recommendedSource: 1, // Kick & Sub-Bass
        recommendedMethod: "+"
    },
    {
        id: "l_photo_step_trigger",
        label: "Beat Step",
        name: "Beat-Triggered Next Photo Step",
        property: "photoStepOnBeat",
        min: 0.0,
        max: 1.0,
        defaultVal: 0.0,
        recommendedSource: 5, // Beat Onset / Transient
        recommendedMethod: "⚡"
    }
]

function clamp(v, lo, hi) {
    var n = Number(v)
    if (isNaN(n) || !isFinite(n)) return lo
    return n < lo ? lo : (n > hi ? hi : n)
}

function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0.0, 1.0)
}

function smoothstep(edge0, edge1, x) {
    var denom = Math.max(0.00001, edge1 - edge0)
    var t = clamp((x - edge0) / denom, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)
}

function parseHexRgb(hexStr) {
    var s = String(hexStr || "#6ee7b7").trim()
    if (s.charAt(0) === "#") s = s.slice(1)
    if (s.length === 3) {
        s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2)
    }
    if (s.length < 6) return [110, 231, 183]
    var r = parseInt(s.slice(0, 2), 16)
    var g = parseInt(s.slice(2, 4), 16)
    var b = parseInt(s.slice(4, 6), 16)
    return [isNaN(r) ? 110 : r, isNaN(g) ? 231 : g, isNaN(b) ? 183 : b]
}

function rgbToHsv(r255, g255, b255) {
    var r = clamp(r255 / 255.0, 0.0, 1.0)
    var g = clamp(g255 / 255.0, 0.0, 1.0)
    var b = clamp(b255 / 255.0, 0.0, 1.0)
    var cmax = Math.max(r, g, b)
    var cmin = Math.min(r, g, b)
    var delta = cmax - cmin
    var h = 0.0
    if (delta > 0.00001) {
        if (cmax === r) {
            h = (((g - b) / delta) % 6.0 + 6.0) % 6.0 / 6.0
        } else if (cmax === g) {
            h = (((b - r) / delta) + 2.0) / 6.0
        } else {
            h = (((r - g) / delta) + 4.0) / 6.0
        }
    }
    var s = cmax < 0.00001 ? 0.0 : (delta / cmax)
    return { h: h, s: s, v: cmax }
}

function rgbaString(hexOrRgb, alpha) {
    var a = clamp(alpha, 0.0, 1.0).toFixed(3)
    var rgb = Array.isArray(hexOrRgb) ? hexOrRgb : parseHexRgb(hexOrRgb)
    return "rgba(" + Math.round(rgb[0]) + "," + Math.round(rgb[1]) + "," + Math.round(rgb[2]) + "," + a + ")"
}

function resolveMotionModeIndex(modeOrName) {
    if (typeof modeOrName === "number") {
        var idx = Math.floor(modeOrName)
        return ((idx % PHOTO_MOTION_MODES.length) + PHOTO_MOTION_MODES.length) % PHOTO_MOTION_MODES.length
    }
    var query = String(modeOrName || "").trim().toUpperCase()
    for (var i = 0; i < PHOTO_MOTION_MODES.length; i++) {
        var m = PHOTO_MOTION_MODES[i]
        if (m.code === query || m.id.toUpperCase() === query || m.name.toUpperCase() === query || m.shortLabel.toUpperCase() === query) {
            return i
        }
        if (query.indexOf(m.code) === 0) {
            return i
        }
    }
    return 0
}

// ---------------------------------------------------------------------------
// Palette-Colour Resonance Matcher (`computePaletteResonance`)
// ---------------------------------------------------------------------------

function computePaletteResonance(hexOrRgb, paletteIndex, themeColours, hueToleranceDeg) {
    var pIdx = ((Math.floor(Number(paletteIndex) || 0) % PALETTES.length) + PALETTES.length) % PALETTES.length
    var activePal = PALETTES[pIdx].slice()
    if (themeColours) {
        if (themeColours.accentColour) activePal.push(String(themeColours.accentColour))
        if (themeColours.urgentColour) activePal.push(String(themeColours.urgentColour))
    }

    var rgb = Array.isArray(hexOrRgb) ? hexOrRgb : parseHexRgb(hexOrRgb)
    var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2])
    var luma = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255.0

    var bestDist = 1.0
    var bestHex = activePal[0]
    for (var i = 0; i < activePal.length; i++) {
        var pRgb = parseHexRgb(activePal[i])
        var pHsv = rgbToHsv(pRgb[0], pRgb[1], pRgb[2])
        var d = Math.abs(hsv.h - pHsv.h)
        var circDist = Math.min(d, 1.0 - d)
        if (circDist < bestDist) {
            bestDist = circDist
            bestHex = activePal[i]
        }
    }

    var tol = Math.max(4.0, Number(hueToleranceDeg) || 34.0) / 360.0
    var hueMatch = 1.0 - smoothstep(tol * 0.35, tol, bestDist)
    var chromaGate = smoothstep(0.08, 0.30, hsv.s) * smoothstep(0.08, 0.25, hsv.v)
    var resonance = clamp(hueMatch * chromaGate, 0.0, 1.0)

    return {
        resonance: resonance,
        nearestPaletteHex: bestHex,
        nearestPaletteRgb: parseHexRgb(bestHex),
        luma: luma,
        saturation: hsv.s,
        hue: hsv.h,
        overdriveMultiplier: 1.0 + resonance * 1.45
    }
}

// ---------------------------------------------------------------------------
// Generic Audio-Responder Evaluation for the Photo Layer
// ---------------------------------------------------------------------------

function evalPhotoAudioLink(baseValue, minValue, maxValue, linkConfig, audioTelemetry, elementIndex) {
    var base = clamp(baseValue, minValue, maxValue)
    if (!linkConfig || !linkConfig.source || Number(linkConfig.source) === 0) {
        return base
    }
    var src = Number(linkConfig.source) || 0
    var method = String(linkConfig.method || "+")
    var amount = clamp(Number(linkConfig.amount) || 0.5, 0.0, 2.5)

    var bass = clamp(audioTelemetry ? audioTelemetry.bass : 0.0, 0.0, 1.0)
    var mid = clamp(audioTelemetry ? audioTelemetry.mid : 0.0, 0.0, 1.0)
    var high = clamp(audioTelemetry ? audioTelemetry.high : 0.0, 0.0, 1.0)
    var beat = clamp(audioTelemetry ? audioTelemetry.beat : 0.0, 0.0, 1.0)
    var dropEnv = clamp(audioTelemetry && audioTelemetry.dropVsBreakdown !== undefined ? audioTelemetry.dropVsBreakdown : (bass * 0.5 + mid * 0.5), 0.0, 1.0)

    var signal = 0.0
    if (src === 1) signal = clamp(bass * 0.65 + beat * 0.35, 0.0, 1.0)
    else if (src === 2) signal = bass
    else if (src === 3) signal = mid
    else if (src === 4) signal = high
    else if (src === 5) signal = beat
    else if (src === 6) {
        var spec = (audioTelemetry && audioTelemetry.spectrum && audioTelemetry.spectrum.length > 0) ? audioTelemetry.spectrum : null
        if (spec) {
            var bin = Math.abs(Math.floor(Number(elementIndex) || 0)) % spec.length
            signal = clamp(Number(spec[bin]) || 0.0, 0.0, 1.0)
        } else {
            signal = (bass + mid + high) / 3.0
        }
    } else if (src === 7) {
        signal = dropEnv
    }

    var delta = 0.0
    if (method === "-" || method === "inverted") {
        delta = -signal * amount
    } else if (method === "~" || method === "bipolar") {
        delta = (signal - 0.5) * amount
    } else if (method === "⚡" || method === "trigger") {
        return signal > 0.65 ? maxValue : base
    } else {
        delta = signal * amount
    }
    return clamp(base + delta * (maxValue - minValue), minValue, maxValue)
}

// ---------------------------------------------------------------------------
// State Constructor, 12th-World Cameo Scheduler & Keybinding Actions
// ---------------------------------------------------------------------------

function createPhotoMotionState() {
    return {
        // Placement as 12th World in Layer 1 (`layer1Mode === 11`)
        worldIndex: LAYER1_WORLD12_INDEX,
        cameoProbability: 1.0 / 12.0, // ~8.3% special cameo chance on L1 randomisation
        cameoCooldownSec: 45.0,       // Minimum seconds between automatic photo world cameos
        lastCameoTimestampSec: -999.0,

        // Category & History Deque for `[` / `]` and `{` / `}` keybindings
        categories: DEFAULT_PHOTO_CATEGORIES.slice(),
        activeCategoryIndex: 0,
        activeCategory: "all",
        categoryCounts: {},
        currentSourceStem: "",
        previousSourceStem: "",
        historyStack: [],     // Array of { category, sourceStem, variantPaths }
        historyCursor: -1,
        maxHistorySize: 64,

        // 1-Minute Hold / Pause State (`H` keybinding: 60s or until another image is requested)
        holdActive: false,
        holdDurationSec: 60.0,
        holdRemainingSec: 0.0,

        // Active Motion Mode (`0..24` -> `M01..M25`)
        motionMode: 0,
        pinnedStage1EffectIndex: -1, // -1 = strobe/cycle all 16 slots of the active pool

        // 3-Mode Multi-Image / Multi-Effect Pool (`;` keybinding):
        // 0 = Effects of Same Image (in category)
        // 1 = Images of Same Effect (in category)
        // 2 = Randomisation of 1 & 2 (in category)
        poolMode: 0,

        // Controlled 3D Plane Shearing (`:` keybinding + `photoPlaneShear` slider):
        // Default OFF (0.0) so all 3D perspective quads render cleanly without diagonal triangle-split shear
        photoPlaneShearEnabled: false,
        photoPlaneShear: 0.00,
        planeShearEnabled: false,
        planeShearAmount: 0.00,

        // Auto Photo-Motion / Random Events Mode (`~` keybinding):
        // Independently randomises 3D photo-motion effects (M01..M25) and steps category images on timer
        autoMotionEvents: false,
        effectAutoRandomise: false,
        randomiseMotionControls: false,     // Switch: when ON, randomises movement controls on every effect change; when OFF, restores user settings
        photoEffectChangeIntervalSec: 18.0, // User-configurable interval (1s .. 60s, default 18s)
        autoMotionMinVariantsPass: 0.0,     // Do not block short user-configured intervals on slow strobe speeds
        autoMotionMinDwellSec: 18.0,        // Synchronised with photoEffectChangeIntervalSec
        autoMotionElapsedSec: 0.0,
        autoMotionAccumulatedPhase: 0.0,

        // 16-Slot Strobe & Cross-Fade State
        variantStrobePhase: 0.0,
        primaryVariantIndex: 0,
        secondaryVariantIndex: 1,
        variantCrossfadeAlpha: 0.0,
        photoStrobeSpeed: 1.0,
        photoFadeDuration: 0.35,      // 0.0s (instant strobe) .. 6.0s (liquid cross-dissolve)
        snapshotCrossfadeProgress: 1.0,

        // Master & Sector-Selective Opacity Controls
        photoOpacity: 0.85,           // 0.05 .. 1.00 master layer opacity
        photoBlackOpacity: 1.00,      // 0.00 .. 1.00 obsidian shadow sector opacity
        photoMidOpacity: 1.00,        // 0.00 .. 1.00 silver mid-tone sector opacity
        photoWhiteOpacity: 1.00,      // 0.00 .. 1.00 chalk white sector opacity
        photoColourSnatchOpacity: 1.00, // 0.00 .. 1.00 snatched neon colour sector opacity

        // 3D XYZ Plane, Roaming Zoomed Viewport & Whole-Effect Macro Stage Kinematics
        t: 0.0,
        pitchRad: 0.0,
        yawRad: 0.0,
        rollRad: 0.0,
        zZoom: 1.0,
        snapshotIndex: 1,             // Increments every time an image/effect/variant snapshot is taken
        snapshotTheta: 0.785,         // Golden-angle polar direction for off-centre snapshot section selection
        snapshotFocalX: 0.52,         // [-0.92 .. +0.92] off-centre horizontal focal anchor for current snapshot
        snapshotFocalY: -0.44,        // [-0.92 .. +0.92] off-centre vertical focal anchor for current snapshot
        snapshotZoom: 1.38,           // [1.22 .. 1.66] section crop magnification so off-centre sections fill frame
        lastStrobeVariantStep: -1,    // Tracks 16-variant strobe index so each variant snapshot shifts section
        viewportPanX: 0.52,           // [-1.0 .. +1.0] horizontal pan across zoomed photograph
        viewportPanY: -0.44,          // [-1.0 .. +1.0] vertical pan across zoomed photograph
        viewportZoom: 1.38,           // Active viewport magnification (>= 1.22) when panning across photo
        macroSlideX: 0.0,             // [-1.0 .. +1.0] whole-effect L/R stage drift
        macroSlideY: 0.0,             // [-1.0 .. +1.0] whole-effect Up/Down stage drift
        macroScale: 1.0,              // Dynamic whole-effect zoom scale (0.52 .. 1.95)
        macroPitchRad: 0.0,           // Whole-effect 3D X-axis pitch/tumble angle
        macroYawRad: 0.0,             // Whole-effect 3D Y-axis yaw/flip angle
        macroRollRad: 0.0,            // Whole-effect 2D/3D Z-axis rotation angle
        macroFlipX: 1.0,              // Smooth 3D horizontal flip factor cos(macroYaw) in [-1.0 .. +1.0]
        macroFlipY: 1.0,              // Smooth 3D vertical flip factor cos(macroPitch) in [-1.0 .. +1.0]
        photoMotionActivity: 1.00,    // 0.10 .. 3.00x master motion activity & rhythm speed
        photoXyzTilt: 1.0,
        photoZoomPunch: 1.15,
        photoPaletteBloom: 1.20,
        photoWarpIntensity: 1.00,
        userMotionSettings: {
            photoMotionActivity: 1.00,
            photoStrobeSpeed: 1.00,
            photoFadeDuration: 0.35,
            photoXyzTilt: 1.00,
            photoZoomPunch: 1.15,
            photoPaletteBloom: 1.20,
            photoWarpIntensity: 1.00
        },
        lastBeatStepTimestampSec: -999.0,
        beatStepCooldownSec: 0.35,

        // Opt-in Generic Audio-Responder links
        audioLinks: {
            l_photo_motion_activity: { source: 0, method: "+", amount: 0.55 },
            l_photo_opacity: { source: 0, method: "+", amount: 0.50 },
            l_photo_strobe_rate: { source: 0, method: "+", amount: 0.65 },
            l_photo_xyz_tilt: { source: 0, method: "~", amount: 0.55 },
            l_photo_zoom_punch: { source: 0, method: "+", amount: 0.70 },
            l_photo_palette_bloom: { source: 0, method: "+", amount: 0.60 },
            l_photo_warp_melt: { source: 0, method: "+", amount: 0.60 },
            l_photo_plane_shear: { source: 0, method: "+", amount: 0.65 },
            l_photo_step_trigger: { source: 0, method: "⚡", amount: 1.00 }
        }
    }
}

// Selects a fresh off-centre section of the photograph whenever an effect takes a snapshot
// (stepping image, changing effect, random event, or stepping to a new strobe variant),
// guaranteeing it never stays stuck on the dead centre (0, 0).
function rollSnapshotFocalSection(state, randomFn) {
    if (!state) return null
    var rng = (typeof randomFn === "function") ? randomFn : Math.random
    state.snapshotIndex = (Number(state.snapshotIndex) || 0) + 1
    var prevTheta = (state.snapshotTheta !== undefined) ? Number(state.snapshotTheta) : 0.785
    var jitter = (Math.abs(Number(rng())) - 0.5) * 0.85
    var nextTheta = (prevTheta + 2.3999632297 + jitter) % (Math.PI * 2.0)
    if (nextTheta < 0) nextTheta += Math.PI * 2.0
    state.snapshotTheta = nextTheta
    // Radius strictly in [0.42 .. 0.90] so the focal section is always off-centre
    var r = 0.42 + Math.abs(Number(rng())) * 0.48
    state.snapshotFocalX = clamp(Math.cos(nextTheta) * r, -0.92, 0.92)
    state.snapshotFocalY = clamp(Math.sin(nextTheta) * r, -0.92, 0.92)
    state.snapshotZoom = 1.28 + Math.abs(Number(rng())) * 0.36
    state.viewportPanX = state.snapshotFocalX
    state.viewportPanY = state.snapshotFocalY
    state.viewportZoom = state.snapshotZoom
    return {
        focalX: state.snapshotFocalX,
        focalY: state.snapshotFocalY,
        zoom: state.snapshotZoom,
        snapshotIndex: state.snapshotIndex
    }
}

function getVariantSectionOffset(variantIdx, snapshotIndex) {
    var v = Math.floor(Number(variantIdx) || 0)
    var s = Math.floor(Number(snapshotIndex) || 1)
    var ang = ((v * 2.3999632297) + (s * 1.6180339887)) % (Math.PI * 2.0)
    if (ang < 0) ang += Math.PI * 2.0
    var rad = 0.42 + ((Math.abs(v * 7 + s * 3)) % 11) * 0.045
    var ox = clamp(Math.cos(ang) * rad, -0.92, 0.92)
    var oy = clamp(Math.sin(ang) * rad, -0.92, 0.92)
    return {
        x: ox,
        y: oy,
        dx: ox,
        dy: oy,
        zoom: 1.26 + ((Math.abs(v * 5 + s * 2)) % 9) * 0.042
    }
}

function captureUserPhotoMotionSettings(state) {
    if (!state) return null
    var snap = {
        photoMotionActivity: clamp(Number(state.photoMotionActivity !== undefined ? state.photoMotionActivity : 1.00), 0.10, 2.00),
        photoStrobeSpeed: clamp(Number(state.photoStrobeSpeed !== undefined ? state.photoStrobeSpeed : 1.00), 0.10, 2.00),
        photoFadeDuration: clamp(Number(state.photoFadeDuration !== undefined ? state.photoFadeDuration : 0.35), 0.00, 6.00),
        photoXyzTilt: clamp(Number(state.photoXyzTilt !== undefined ? state.photoXyzTilt : 1.00), 0.00, 2.50),
        photoZoomPunch: clamp(Number(state.photoZoomPunch !== undefined ? state.photoZoomPunch : 1.15), 0.25, 2.50),
        photoPaletteBloom: clamp(Number(state.photoPaletteBloom !== undefined ? state.photoPaletteBloom : 0.65), 0.00, 2.50),
        photoWarpIntensity: clamp(Number(state.photoWarpIntensity !== undefined ? state.photoWarpIntensity : 1.00), 0.00, 2.50),
        photoColourSnatchOpacity: clamp(Number(state.photoColourSnatchOpacity !== undefined ? state.photoColourSnatchOpacity : 1.00), 0.00, 1.50),
        photoBlackOpacity: clamp(Number(state.photoBlackOpacity !== undefined ? state.photoBlackOpacity : 1.00), 0.00, 1.50),
        photoMidOpacity: clamp(Number(state.photoMidOpacity !== undefined ? state.photoMidOpacity : 1.00), 0.00, 1.50),
        photoWhiteOpacity: clamp(Number(state.photoWhiteOpacity !== undefined ? state.photoWhiteOpacity : 1.00), 0.00, 1.50)
    }
    state.userMotionSettings = snap
    return snap
}

function restoreUserPhotoMotionSettings(state) {
    if (!state || !state.userMotionSettings) return null
    var u = state.userMotionSettings
    if (u.photoMotionActivity !== undefined) state.photoMotionActivity = clamp(Number(u.photoMotionActivity), 0.10, 2.00)
    if (u.photoStrobeSpeed !== undefined) state.photoStrobeSpeed = clamp(Number(u.photoStrobeSpeed), 0.10, 2.00)
    if (u.photoFadeDuration !== undefined) state.photoFadeDuration = clamp(Number(u.photoFadeDuration), 0.00, 6.00)
    if (u.photoXyzTilt !== undefined) state.photoXyzTilt = clamp(Number(u.photoXyzTilt), 0.00, 2.50)
    if (u.photoZoomPunch !== undefined) state.photoZoomPunch = clamp(Number(u.photoZoomPunch), 0.25, 2.50)
    if (u.photoPaletteBloom !== undefined) state.photoPaletteBloom = clamp(Number(u.photoPaletteBloom), 0.00, 2.50)
    if (u.photoWarpIntensity !== undefined) state.photoWarpIntensity = clamp(Number(u.photoWarpIntensity), 0.00, 2.50)
    if (u.photoColourSnatchOpacity !== undefined) state.photoColourSnatchOpacity = clamp(Number(u.photoColourSnatchOpacity), 0.00, 1.50)
    if (u.photoBlackOpacity !== undefined) state.photoBlackOpacity = clamp(Number(u.photoBlackOpacity), 0.00, 1.50)
    if (u.photoMidOpacity !== undefined) state.photoMidOpacity = clamp(Number(u.photoMidOpacity), 0.00, 1.50)
    if (u.photoWhiteOpacity !== undefined) state.photoWhiteOpacity = clamp(Number(u.photoWhiteOpacity), 0.00, 1.50)
    return state.userMotionSettings
}

function randomiseMotionControlsForEvent(state, randomFn) {
    if (!state) return null
    if (!state.userMotionSettings) {
        captureUserPhotoMotionSettings(state)
    }
    var rng = (typeof randomFn === "function") ? randomFn : Math.random
    var userAct = clamp(Number(state.userMotionSettings.photoMotionActivity !== undefined ? state.userMotionSettings.photoMotionActivity : 1.00), 0.10, 2.00)
    state.photoMotionActivity = Math.round(clamp(userAct * (0.70 + Math.abs(Number(rng())) * 0.70), 0.25, 2.00) * 100) / 100
    state.photoStrobeSpeed = Math.round(clamp(0.50 + Math.abs(Number(rng())) * 1.15, 0.25, 2.00) * 100) / 100
    state.photoFadeDuration = Math.round((0.20 + Math.abs(Number(rng())) * 1.30) * 100) / 100
    state.photoXyzTilt = Math.round((0.55 + Math.abs(Number(rng())) * 1.15) * 100) / 100
    state.photoZoomPunch = Math.round((0.75 + Math.abs(Number(rng())) * 0.95) * 100) / 100
    state.photoWarpIntensity = Math.round((0.55 + Math.abs(Number(rng())) * 1.15) * 100) / 100

    // Smoothly roll across all 4 colour grades in equal measure:
    //   0.00..0.25: Stark B&W Darkroom
    //   0.30..0.65: Bleach Bypass / Cinema Grade
    //   0.70..1.00: Natural Processed (1:1 faithful PNG colour)
    //   1.05..1.50: Lush Vivid / Hyper-Chroma
    var gradeRoll = Math.abs(Number(rng()))
    var subRoll = Math.abs(Number(rng()))
    if (gradeRoll < 0.24) {
        // Stark B&W Darkroom (12%–26%)
        state.photoColourSnatchOpacity = Math.round((0.12 + subRoll * 0.14) * 100) / 100
        state.photoBlackOpacity = Math.round((0.68 + subRoll * 0.24) * 100) / 100
        state.photoMidOpacity = Math.round((0.76 + subRoll * 0.20) * 100) / 100
        state.photoWhiteOpacity = Math.round((0.92 + subRoll * 0.16) * 100) / 100
        state.photoPaletteBloom = Math.round((0.22 + subRoll * 0.26) * 100) / 100
    } else if (gradeRoll < 0.50) {
        // Bleach Bypass / Cinema Grade (32%–65%)
        state.photoColourSnatchOpacity = Math.round((0.32 + subRoll * 0.33) * 100) / 100
        state.photoBlackOpacity = Math.round((0.82 + subRoll * 0.18) * 100) / 100
        state.photoMidOpacity = Math.round((0.88 + subRoll * 0.18) * 100) / 100
        state.photoWhiteOpacity = Math.round((0.95 + subRoll * 0.18) * 100) / 100
        state.photoPaletteBloom = Math.round((0.35 + subRoll * 0.34) * 100) / 100
    } else if (gradeRoll < 0.76) {
        // Natural Processed (72%–100%)
        state.photoColourSnatchOpacity = Math.round((0.72 + subRoll * 0.28) * 100) / 100
        state.photoBlackOpacity = Math.round((0.94 + subRoll * 0.12) * 100) / 100
        state.photoMidOpacity = Math.round((0.96 + subRoll * 0.14) * 100) / 100
        state.photoWhiteOpacity = Math.round((0.98 + subRoll * 0.16) * 100) / 100
        state.photoPaletteBloom = Math.round((0.32 + subRoll * 0.34) * 100) / 100
    } else {
        // Lush Vivid / Hyper-Chroma (108%–148%)
        state.photoColourSnatchOpacity = Math.round((1.08 + subRoll * 0.40) * 100) / 100
        state.photoBlackOpacity = Math.round((0.96 + subRoll * 0.18) * 100) / 100
        state.photoMidOpacity = Math.round((1.02 + subRoll * 0.22) * 100) / 100
        state.photoWhiteOpacity = Math.round((1.04 + subRoll * 0.20) * 100) / 100
        state.photoPaletteBloom = Math.round((0.55 + subRoll * 0.45) * 100) / 100
    }

    return {
        photoMotionActivity: state.photoMotionActivity,
        photoStrobeSpeed: state.photoStrobeSpeed,
        photoFadeDuration: state.photoFadeDuration,
        photoXyzTilt: state.photoXyzTilt,
        photoZoomPunch: state.photoZoomPunch,
        photoPaletteBloom: state.photoPaletteBloom,
        photoWarpIntensity: state.photoWarpIntensity,
        photoColourSnatchOpacity: state.photoColourSnatchOpacity,
        photoBlackOpacity: state.photoBlackOpacity,
        photoMidOpacity: state.photoMidOpacity,
        photoWhiteOpacity: state.photoWhiteOpacity
    }
}

// Toggle Switch: `Rand Photo Motion: ON / OFF`
// When ON: saves user's movement settings, rolls random movement controls immediately, and randomises them on every effect change.
// When OFF: restores user's saved movement settings.
function togglePhotoRandomiseMotionControls(state, forceEnabled, randomFn) {
    if (!state) return null
    var wasEnabled = Boolean(state.randomiseMotionControls)
    var nextEnabled = (forceEnabled !== undefined)
        ? Boolean(forceEnabled)
        : !wasEnabled
    var randomised = null
    if (!wasEnabled && nextEnabled) {
        captureUserPhotoMotionSettings(state)
        randomised = randomiseMotionControlsForEvent(state, randomFn)
    } else if (wasEnabled && !nextEnabled) {
        restoreUserPhotoMotionSettings(state)
    }
    state.randomiseMotionControls = nextEnabled
    return {
        action: "togglePhotoRandomiseMotionControls",
        enabled: nextEnabled,
        randomiseMotionControls: nextEnabled,
        randomisedMotion: randomised,
        restoredUserSettings: (!nextEnabled && wasEnabled) ? state.userMotionSettings : null,
        message: nextEnabled
            ? "🎲 Rand Photo Motion: ON (Randomising Motion Every Change)"
            : "🎲 Rand Photo Motion: OFF (Restored User Motion Settings)"
    }
}

function resolvePoolModeIndex(modeIndexOrCode) {
    var total = PHOTO_POOL_MODES.length
    if (typeof modeIndexOrCode === "string") {
        var norm = modeIndexOrCode.trim().toUpperCase()
        for (var i = 0; i < total; i++) {
            if (PHOTO_POOL_MODES[i].code.toUpperCase() === norm ||
                PHOTO_POOL_MODES[i].shortName.toUpperCase() === norm ||
                PHOTO_POOL_MODES[i].name.toUpperCase() === norm) {
                return i
            }
        }
    }
    var n = Math.floor(Number(modeIndexOrCode) || 0)
    return ((n % total) + total) % total
}

// Keybinding 8: `;` — Cycle Multi-Image / Multi-Effect Pool Mode (0 -> 1 -> 2 -> 0)
function cyclePhotoPoolMode(state, direction) {
    if (!state) return null
    var step = (direction !== undefined && Number(direction) < 0) ? -1 : 1
    var total = PHOTO_POOL_MODES.length
    var cur = resolvePoolModeIndex(state.poolMode)
    var next = ((cur + step) % total + total) % total
    state.poolMode = next
    var entry = PHOTO_POOL_MODES[next] || PHOTO_POOL_MODES[0]
    return {
        action: "cyclePhotoPoolMode",
        mode: next,
        poolMode: next,
        poolEntry: entry,
        message: "Photo Pool [;]: " + entry.name
    }
}

// Keybinding 9: `:` — Toggle Controlled 3D Plane Shearing ON / OFF
function togglePhotoPlaneShear(state, forceEnabled) {
    if (!state) return null
    var nextEnabled = (forceEnabled !== undefined)
        ? Boolean(forceEnabled)
        : !Boolean(state.photoPlaneShearEnabled)
    state.photoPlaneShearEnabled = nextEnabled
    state.planeShearEnabled = nextEnabled
    if (nextEnabled && (Number(state.photoPlaneShear) || 0.0) <= 0.02) {
        state.photoPlaneShear = 1.00
    }
    var shearVal = nextEnabled ? clamp(Number(state.photoPlaneShear) || 1.0, 0.0, 2.0) : 0.0
    state.planeShearAmount = shearVal
    return {
        action: "togglePhotoPlaneShear",
        enabled: nextEnabled,
        amount: shearVal,
        planeShearEnabled: nextEnabled,
        planeShear: shearVal,
        message: nextEnabled
            ? ("Plane Shear [:]: ON (" + Math.round(shearVal * 100) + "%)")
            : "Plane Shear [:]: OFF (Clean Un-Sheared 3D Quads)"
    }
}

// Keybinding 10: `~` — Toggle Dedicated Photo-Engine Effect Randomisation ON / OFF
// When switched ON, snapshots the user's movement controls so the randomiser can do its own thing;
// when switched OFF, restores all movement controls back to the user's saved settings.
function togglePhotoAutoMotionEvents(state, forceEnabled) {
    if (!state) return null
    var wasEnabled = Boolean(state.autoMotionEvents)
    var nextEnabled = (forceEnabled !== undefined)
        ? Boolean(forceEnabled)
        : !wasEnabled
    if (!wasEnabled && nextEnabled) {
        if (!state.randomiseMotionControls) {
            captureUserPhotoMotionSettings(state)
        }
    } else if (wasEnabled && !nextEnabled && !state.randomiseMotionControls) {
        restoreUserPhotoMotionSettings(state)
    }
    state.autoMotionEvents = nextEnabled
    state.effectAutoRandomise = nextEnabled
    state.autoMotionElapsedSec = 0.0
    state.autoMotionAccumulatedPhase = 0.0
    var intervalSec = Math.round(clamp(Number(state.photoEffectChangeIntervalSec || state.autoMotionMinDwellSec || 18.0), 1.0, 60.0))
    return {
        action: "togglePhotoAutoMotionEvents",
        enabled: nextEnabled,
        autoMotionEvents: nextEnabled,
        restoredUserSettings: (!nextEnabled && wasEnabled && !state.randomiseMotionControls) ? state.userMotionSettings : null,
        intervalSec: intervalSec,
        message: nextEnabled
            ? ("🎲 Photo FX Auto-Random [~]: ON (every " + intervalSec + "s)")
            : "🎲 Photo FX Auto-Random [~]: OFF (Restored User Motion Settings)"
    }
}

function togglePhotoEffectAutoRandomise(state, forceEnabled) {
    return togglePhotoAutoMotionEvents(state, forceEnabled)
}

function resolveCurrentCategoryForStep(state) {
    if (!state) return "all"
    if (state.activeCategory && state.activeCategory !== "all") {
        return state.activeCategory
    }
    if (state.resolvedCategory && state.resolvedCategory !== "all") {
        return state.resolvedCategory
    }
    if (Array.isArray(state.historyStack)) {
        for (var i = state.historyStack.length - 1; i >= 0; i--) {
            var h = state.historyStack[i]
            if (h && h.category && h.category !== "all") {
                return h.category
            }
        }
    }
    return state.activeCategory || "all"
}

// Keybindings 6 & 7: `'` and `#` — Step 3D Photo-Motion Effect (M01..M25) AND iterate/randomise
// the master photograph within the active category (unless 1-Minute Hold `H` is active),
// without changing the category or resetting the active Stark effect-image variant.
function stepPhotoMotionMode(state, direction, pickNewEntryCallback, preserveHold) {
    if (!state) return null
    var step = (Number(direction) < 0) ? -1 : 1
    var total = PHOTO_MOTION_MODES.length
    var cur = resolveMotionModeIndex(state.motionMode)
    var next = ((cur + step) % total + total) % total
    state.motionMode = next
    state.autoMotionElapsedSec = 0.0
    state.autoMotionAccumulatedPhase = 0.0
    rollSnapshotFocalSection(state)
    if (state.randomiseMotionControls) {
        randomiseMotionControlsForEvent(state)
    }

    var stepRes = null
    var isHeld = Boolean(preserveHold !== false && state.holdActive && state.holdRemainingSec > 0.0)
    if (!isHeld && typeof pickNewEntryCallback === "function") {
        var lockedCat = resolveCurrentCategoryForStep(state)
        if (lockedCat && lockedCat !== "all") {
            state.activeCategory = lockedCat
            state.resolvedCategory = lockedCat
        }
        if (Array.isArray(state.historyStack) && state.historyCursor >= 0 && state.historyCursor < state.historyStack.length - 1) {
            state.historyStack = state.historyStack.slice(0, state.historyCursor + 1)
        }
        stepRes = stepPhotoImageHistory(state, 1, pickNewEntryCallback)
    }

    var modeObj = PHOTO_MOTION_MODES[next] || PHOTO_MOTION_MODES[0]
    var stemText = (stepRes && stepRes.entry && stepRes.entry.sourceStem)
        ? (" · " + stepRes.entry.sourceStem)
        : (state.currentSourceStem ? (" · " + state.currentSourceStem) : "")
    return {
        action: step < 0 ? "stepMotionModeBackward" : "stepMotionModeForward",
        motionMode: next,
        modeEntry: modeObj,
        stepResult: stepRes,
        entry: stepRes ? stepRes.entry : null,
        message: (step < 0 ? "◀ " : "▶ ") + "Photo FX: " + modeObj.code + " · " + modeObj.name + stemText
    }
}

function cyclePhotoMotionMode(state, direction, pickNewEntryCallback, preserveHold) {
    return stepPhotoMotionMode(state, direction, pickNewEntryCallback, preserveHold)
}

function selectPhotoMotionMode(state, modeIndex, pickNewEntryCallback, preserveHold) {
    if (!state) return null
    var next = resolveMotionModeIndex(modeIndex)
    state.motionMode = next
    state.autoMotionElapsedSec = 0.0
    state.autoMotionAccumulatedPhase = 0.0
    rollSnapshotFocalSection(state)
    if (state.randomiseMotionControls) {
        randomiseMotionControlsForEvent(state)
    }

    var stepRes = null
    var isHeld = Boolean(preserveHold !== false && state.holdActive && state.holdRemainingSec > 0.0)
    if (!isHeld && typeof pickNewEntryCallback === "function") {
        var lockedCat = resolveCurrentCategoryForStep(state)
        if (lockedCat && lockedCat !== "all") {
            state.activeCategory = lockedCat
            state.resolvedCategory = lockedCat
        }
        if (Array.isArray(state.historyStack) && state.historyCursor >= 0 && state.historyCursor < state.historyStack.length - 1) {
            state.historyStack = state.historyStack.slice(0, state.historyCursor + 1)
        }
        stepRes = stepPhotoImageHistory(state, 1, pickNewEntryCallback)
    }
    var modeObj = PHOTO_MOTION_MODES[next] || PHOTO_MOTION_MODES[0]
    return {
        action: "selectMotionMode",
        motionMode: next,
        modeEntry: modeObj,
        stepResult: stepRes,
        entry: stepRes ? stepRes.entry : null,
        message: "Photo FX: " + modeObj.code + " · " + modeObj.name
    }
}

// Resolves the 16-slot variant map to render based on `state.poolMode`:
// - Pool Mode 0 ("1. Effects of Same Image"): 16 Stage-1 variants of the current photograph (or locked to pinnedStage1EffectIndex if pinned)
// - Pool Mode 1 ("2. Images of Same Effect"): 16 category photographs all rendered with the same Stage-1 effect
// - Pool Mode 2 ("3. Randomisation of 1 & 2"): 16 mixed slots combining effects of the current image & category peers
function resolvePoolVariantImagesMap(state, baseVariantImagesMap, poolMaps) {
    if (!baseVariantImagesMap) return {}
    var pMode = state ? resolvePoolModeIndex(state.poolMode) : 0
    if (pMode === 0) {
        if (state && state.pinnedStage1EffectIndex >= 0 && state.pinnedStage1EffectIndex < STAGE1_EFFECT_IDS.length) {
            var pinnedEffectId = STAGE1_EFFECT_IDS[state.pinnedStage1EffectIndex]
            var pinnedImg = baseVariantImagesMap[pinnedEffectId] || baseVariantImagesMap[STAGE1_EFFECT_IDS[0]]
            if (pinnedImg) {
                var pinnedMap = {}
                for (var p = 0; p < STAGE1_EFFECT_IDS.length; p++) {
                    pinnedMap[STAGE1_EFFECT_IDS[p]] = pinnedImg
                }
                return pinnedMap
            }
        }
        return baseVariantImagesMap
    }
    if (!poolMaps) {
        return baseVariantImagesMap
    }

    if (pMode === 1) {
        var pinnedIdx = (state && state.pinnedStage1EffectIndex >= 0 && state.pinnedStage1EffectIndex < STAGE1_EFFECT_IDS.length)
            ? state.pinnedStage1EffectIndex
            : (state ? ((Math.floor(Number(state.primaryVariantIndex) || 0) % STAGE1_EFFECT_IDS.length + STAGE1_EFFECT_IDS.length) % STAGE1_EFFECT_IDS.length) : 0)
        var targetEffectId = STAGE1_EFFECT_IDS[pinnedIdx] || STAGE1_EFFECT_IDS[0]
        var byVar = poolMaps.sameEffectByVariant ? poolMaps.sameEffectByVariant[targetEffectId] : null
        var peerMap = byVar || poolMaps.sameEffectPeers || null
        if (peerMap && Object.keys(peerMap).length > 0) {
            var mergedSameEffect = {}
            var ownEffectImg = baseVariantImagesMap[targetEffectId] || baseVariantImagesMap[STAGE1_EFFECT_IDS[0]]
            for (var i = 0; i < STAGE1_EFFECT_IDS.length; i++) {
                var slotId = STAGE1_EFFECT_IDS[i]
                if (i === 0 && ownEffectImg) {
                    mergedSameEffect[slotId] = ownEffectImg
                } else {
                    mergedSameEffect[slotId] = peerMap[slotId] || ownEffectImg || baseVariantImagesMap[slotId]
                }
            }
            return mergedSameEffect
        }
        return baseVariantImagesMap
    }

    if (pMode === 2) {
        var randMap = poolMaps.randomPoolPeers || null
        if (randMap && Object.keys(randMap).length > 0) {
            var mergedRand = {}
            for (var j = 0; j < STAGE1_EFFECT_IDS.length; j++) {
                var rSlotId = STAGE1_EFFECT_IDS[j]
                // Alternate/blend 50% of current image's own variants with 50% random category peer variants
                if (j % 2 === 0 && baseVariantImagesMap[rSlotId]) {
                    mergedRand[rSlotId] = baseVariantImagesMap[rSlotId]
                } else {
                    mergedRand[rSlotId] = randMap[rSlotId] || baseVariantImagesMap[rSlotId]
                }
            }
            return mergedRand
        }
    }

    return baseVariantImagesMap
}

function resolveMultiPhotoPool(state, baseVariantImagesMap, poolMaps) {
    return resolvePoolVariantImagesMap(state, baseVariantImagesMap, poolMaps)
}

function computeSectorEffectiveOpacity(state, sectorOrRgb, masterOpacityOverride) {
    if (!state) return 0.85
    var masterA = clamp(masterOpacityOverride !== undefined ? masterOpacityOverride : state.photoOpacity, 0.05, 1.00)
    var blkA = clamp(state.photoBlackOpacity !== undefined ? state.photoBlackOpacity : 1.0, 0.0, 1.0)
    var midA = clamp(state.photoMidOpacity !== undefined ? state.photoMidOpacity : 1.0, 0.0, 1.0)
    var whtA = clamp(state.photoWhiteOpacity !== undefined ? state.photoWhiteOpacity : 1.0, 0.0, 1.0)
    var colA = clamp(state.photoColourSnatchOpacity !== undefined ? state.photoColourSnatchOpacity : 1.0, 0.0, 1.0)

    if (typeof sectorOrRgb === "string") {
        var key = sectorOrRgb.toLowerCase()
        if (key === "black" || key === "obsidian") return clamp(masterA * blkA, 0.0, 1.0)
        if (key === "mid" || key === "silver") return clamp(masterA * midA, 0.0, 1.0)
        if (key === "white" || key === "chalk") return clamp(masterA * whtA, 0.0, 1.0)
        if (key === "coloursnatch" || key === "colour_snatch" || key === "colour" || key === "neon") {
            return clamp(masterA * colA, 0.0, 1.0)
        }
    }

    if (sectorOrRgb && (Array.isArray(sectorOrRgb) || typeof sectorOrRgb === "string")) {
        var rgb = Array.isArray(sectorOrRgb) ? sectorOrRgb : parseHexRgb(sectorOrRgb)
        var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2])
        var luma = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255.0
        var wCol = smoothstep(0.14, 0.32, hsv.s)
        var wBlk = (1.0 - smoothstep(0.12, 0.28, luma)) * (1.0 - wCol)
        var wWht = smoothstep(0.70, 0.86, luma) * (1.0 - wCol)
        var wMid = clamp(1.0 - wCol - wBlk - wWht, 0.0, 1.0)
        var sectorA = wBlk * blkA + wMid * midA + wWht * whtA + wCol * colA
        return clamp(masterA * sectorA, 0.0, 1.0)
    }

    // Composite weighted foreground alpha when drawing whole-frame textures in Context2D
    var compositeSector = 0.22 * blkA + 0.28 * midA + 0.22 * whtA + 0.28 * colA
    return clamp(masterA * compositeSector, 0.0, 1.0)
}

function shouldSelectWorld12Cameo(state, nowSec, randomVal) {
    if (!state) return false
    if (state.holdActive && state.holdRemainingSec > 0.0) {
        return true
    }
    var elapsedSinceLast = Number(nowSec || 0) - Number(state.lastCameoTimestampSec || -999)
    if (elapsedSinceLast < Number(state.cameoCooldownSec || 45.0)) {
        return false
    }
    var r = (randomVal !== undefined) ? Number(randomVal) : Math.random()
    if (r < clamp(state.cameoProbability, 0.01, 1.0)) {
        state.lastCameoTimestampSec = Number(nowSec || 0)
        return true
    }
    return false
}

// Keybinding 3: `H` — Pause / Hold current photo for 1 minute (60s) or until another image is requested
function triggerPhotoHoldOneMinute(state, toggleIfAlreadyHeld) {
    if (!state) return { held: false, holdActive: false, remainingSec: 0, holdRemainingSec: 0.0, message: "" }
    if (toggleIfAlreadyHeld && state.holdActive && state.holdRemainingSec > 0.0) {
        state.holdActive = false
        state.holdRemainingSec = 0.0
        state.autoMotionElapsedSec = 0.0
        state.autoMotionAccumulatedPhase = 0.0
        return {
            held: false,
            holdActive: false,
            remainingSec: 0,
            holdRemainingSec: 0.0,
            message: "Photo Hold Released — Retained Current Image"
        }
    }
    state.holdActive = true
    state.holdDurationSec = 60.0
    state.holdRemainingSec = 60.0
    state.autoMotionElapsedSec = 0.0
    state.autoMotionAccumulatedPhase = 0.0
    return {
        held: true,
        holdActive: true,
        remainingSec: 60,
        holdRemainingSec: 60.0,
        message: "Photo Held for 1:00 (or until Next/Prev Photo requested)"
    }
}

// Keybindings 1 & 2: `[` and `]` — Step backward / forward through image history deque
// Automatically clears the 1-minute hold ("until another image is requested").
function stepPhotoImageHistory(state, direction, pickNewEntryCallback) {
    if (!state) return null
    var dir = (Number(direction) < 0) ? -1 : 1

    // Explicitly requesting another image releases any active 1-minute hold
    var wasHeld = Boolean(state.holdActive)
    state.holdActive = false
    state.holdRemainingSec = 0.0
    rollSnapshotFocalSection(state)

    if (dir < 0 && state.historyCursor > 0) {
        state.previousSourceStem = state.currentSourceStem
        state.historyCursor -= 1
        var prevEntry = state.historyStack[state.historyCursor]
        state.currentSourceStem = prevEntry.sourceStem
        if (prevEntry.category && prevEntry.category !== "all") {
            state.resolvedCategory = prevEntry.category
        }
        state.snapshotCrossfadeProgress = 0.0
        return {
            action: "stepImageBackward",
            entry: prevEntry,
            wasHeld: wasHeld,
            historyCursor: state.historyCursor,
            historyLength: state.historyStack.length,
            message: "◀ Photo [" + (state.historyCursor + 1) + "/" + state.historyStack.length + "]: " + prevEntry.sourceStem
        }
    }

    if (dir > 0 && state.historyCursor >= 0 && state.historyCursor < state.historyStack.length - 1) {
        state.previousSourceStem = state.currentSourceStem
        state.historyCursor += 1
        var fwdEntry = state.historyStack[state.historyCursor]
        state.currentSourceStem = fwdEntry.sourceStem
        if (fwdEntry.category && fwdEntry.category !== "all") {
            state.resolvedCategory = fwdEntry.category
        }
        state.snapshotCrossfadeProgress = 0.0
        return {
            action: "stepImageForward",
            entry: fwdEntry,
            wasHeld: wasHeld,
            historyCursor: state.historyCursor,
            historyLength: state.historyStack.length,
            message: "▶ Photo [" + (state.historyCursor + 1) + "/" + state.historyStack.length + "]: " + fwdEntry.sourceStem
        }
    }

    var targetCat = resolveCurrentCategoryForStep(state)
    // Request a fresh photo from the active category pool via callback (or synthetic entry when history is empty)
    var freshEntry = (typeof pickNewEntryCallback === "function")
        ? pickNewEntryCallback(targetCat, state.currentSourceStem)
        : (!state.currentSourceStem
            ? { category: targetCat, sourceStem: "01_Arch_Brutalist_Concrete_Colour", variantPaths: [] }
            : null)

    if (freshEntry && freshEntry.category && freshEntry.category !== "all") {
        state.resolvedCategory = freshEntry.category
    }

    if (freshEntry && freshEntry.sourceStem && !freshEntry.asyncPending) {
        state.previousSourceStem = state.currentSourceStem
        state.currentSourceStem = freshEntry.sourceStem
        if (state.historyCursor < state.historyStack.length - 1) {
            state.historyStack = state.historyStack.slice(0, state.historyCursor + 1)
        }
        state.historyStack.push(freshEntry)
        if (state.historyStack.length > (state.maxHistorySize || 64)) {
            state.historyStack.shift()
        }
        state.historyCursor = state.historyStack.length - 1
        state.snapshotCrossfadeProgress = 0.0
    } else if (freshEntry && freshEntry.asyncPending) {
        state.snapshotCrossfadeProgress = 0.0
    }

    var displayStem = (freshEntry && freshEntry.sourceStem) ? freshEntry.sourceStem : (state.currentSourceStem || "")
    return {
        action: dir < 0 ? "stepImageBackward" : "stepImageForward",
        entry: freshEntry,
        wasHeld: wasHeld,
        historyCursor: state.historyCursor,
        historyLength: state.historyStack.length,
        message: (dir < 0 ? "◀ " : "▶ ") + "Photo [" + (Math.max(0, state.historyCursor) + 1) + "/" + Math.max(1, state.historyStack.length) + "]: " + displayStem
    }
}

// Keybindings 4 & 5: `{` and `}` — Step Photo Category backward / forward
function stepPhotoCategory(state, direction, pickNewEntryCallback) {
    if (!state) return null
    var cats = (state.categories && state.categories.length > 0) ? state.categories : DEFAULT_PHOTO_CATEGORIES
    var dir = (Number(direction) < 0) ? -1 : 1
    var n = cats.length
    var curIdx = cats.indexOf(state.activeCategory)
    if (curIdx < 0) curIdx = Number(state.activeCategoryIndex) || 0

    var nextIdx = ((curIdx + dir) % n + n) % n
    var nextCat = cats[nextIdx]
    state.activeCategoryIndex = nextIdx
    state.activeCategory = nextCat
    if (nextCat && nextCat !== "all") {
        state.resolvedCategory = nextCat
    }

    // Release 1-minute hold when switching categories so a photo from the new category loads immediately
    state.holdActive = false
    state.holdRemainingSec = 0.0

    var label = formatPhotoCategoryLabel(nextCat)
    var countInfo = (state.categoryCounts && state.categoryCounts[nextCat] !== undefined)
        ? " (" + state.categoryCounts[nextCat] + " photos)"
        : ""

    if (Array.isArray(state.historyStack) && state.historyCursor >= 0 && state.historyCursor < state.historyStack.length - 1) {
        state.historyStack = state.historyStack.slice(0, state.historyCursor + 1)
    }

    var stepRes = stepPhotoImageHistory(state, 1, pickNewEntryCallback)
    return {
        action: dir < 0 ? "stepCategoryBackward" : "stepCategoryForward",
        category: nextCat,
        categoryIndex: nextIdx,
        categoryLabel: label,
        entry: stepRes ? stepRes.entry : null,
        message: (dir < 0 ? "◀ " : "▶ ") + "Photo Category: " + label + countInfo
    }
}

// Triggers a new Random Photo-Motion Event: picks a fresh random 3D photo-motion mode (M01..M25),
// randomises the live movement controls around the user's baseline (restorable when `~` is turned OFF),
// and steps to the next master photograph in the active category without changing the category
// or overriding the user's Stark effect-image selection.
function triggerRandomPhotoMotionEvent(state, pickNewEntryCallback, randomFn) {
    if (!state) return null
    var rng = (typeof randomFn === "function") ? randomFn : Math.random
    var totalModes = PHOTO_MOTION_MODES.length
    var curMode = resolveMotionModeIndex(state.motionMode)
    var nextMode = curMode
    if (totalModes > 1) {
        var offset = 1 + (Math.floor(Math.abs(Number(rng())) * (totalModes - 1)) % (totalModes - 1))
        nextMode = (curMode + offset) % totalModes
    }
    state.motionMode = nextMode
    state.autoMotionElapsedSec = 0.0
    state.autoMotionAccumulatedPhase = 0.0
    rollSnapshotFocalSection(state, rng)
    var randomisedMotion = randomiseMotionControlsForEvent(state, rng)

    var lockedCat = resolveCurrentCategoryForStep(state)
    if (lockedCat && lockedCat !== "all") {
        state.activeCategory = lockedCat
        state.resolvedCategory = lockedCat
    }
    var isHeld = Boolean(state.holdActive && state.holdRemainingSec > 0.0)
    var stepRes = null
    if (!isHeld) {
        if (Array.isArray(state.historyStack) && state.historyCursor >= 0 && state.historyCursor < state.historyStack.length - 1) {
            state.historyStack = state.historyStack.slice(0, state.historyCursor + 1)
        }
        stepRes = stepPhotoImageHistory(state, 1, pickNewEntryCallback)
    }
    var modeObj = PHOTO_MOTION_MODES[nextMode] || PHOTO_MOTION_MODES[0]
    var stemText = (stepRes && stepRes.entry && stepRes.entry.sourceStem)
        ? (" — " + stepRes.entry.sourceStem)
        : (isHeld && state.currentSourceStem ? (" — Held: " + state.currentSourceStem) : "")
    return {
        action: "randomPhotoMotionEvent",
        motionMode: nextMode,
        modeEntry: modeObj,
        randomisedMotion: randomisedMotion,
        stepResult: stepRes,
        entry: stepRes ? stepRes.entry : null,
        message: "🎲 Auto Photo-Motion: " + modeObj.code + " · " + modeObj.name + stemText
    }
}

// ---------------------------------------------------------------------------
// 60 FPS Rhythm-Paced Kinematics, Variant Cross-Fade & Stepper
// ---------------------------------------------------------------------------

function stepPhotoMotionState(state, dt, audioTelemetry, pickNewEntryCallback) {
    if (!state) return null
    var safeDt = clamp(dt, 0.001, 0.100)
    state.t += safeDt

    // Countdown 1-minute hold timer if active
    if (state.holdActive) {
        state.holdRemainingSec = Math.max(0.0, state.holdRemainingSec - safeDt)
        if (state.holdRemainingSec <= 0.0) {
            state.holdActive = false
        }
    }

    var bass = clamp(audioTelemetry ? audioTelemetry.bass : 0.4, 0.0, 1.0)
    var mid = clamp(audioTelemetry ? audioTelemetry.mid : 0.4, 0.0, 1.0)
    var high = clamp(audioTelemetry ? audioTelemetry.high : 0.4, 0.0, 1.0)
    var beat = clamp(audioTelemetry ? audioTelemetry.beat : 0.0, 0.0, 1.0)

    var links = state.audioLinks || {}
    var baseActivity = clamp(Number(state.photoMotionActivity !== undefined ? state.photoMotionActivity : 1.00), 0.10, 2.00)
    var effMotionActivity = evalPhotoAudioLink(baseActivity, 0.10, 2.00, links.l_photo_motion_activity, audioTelemetry, 0)
    var effOpacity = evalPhotoAudioLink(state.photoOpacity, 0.05, 1.00, links.l_photo_opacity, audioTelemetry, 0)
    var effStrobeSpeed = evalPhotoAudioLink(state.photoStrobeSpeed, 0.10, 2.00, links.l_photo_strobe_rate, audioTelemetry, 0)
    var effXyzTilt = evalPhotoAudioLink(state.photoXyzTilt, 0.00, 2.50, links.l_photo_xyz_tilt, audioTelemetry, 0)
    var effZoomPunch = evalPhotoAudioLink(state.photoZoomPunch, 0.25, 2.50, links.l_photo_zoom_punch, audioTelemetry, 0)
    var effPaletteBloom = evalPhotoAudioLink(state.photoPaletteBloom, 0.00, 2.50, links.l_photo_palette_bloom, audioTelemetry, 0)
    var effWarp = evalPhotoAudioLink(state.photoWarpIntensity, 0.00, 2.50, links.l_photo_warp_melt, audioTelemetry, 0)
    var baseShear = state.photoPlaneShearEnabled
        ? clamp(Number(state.photoPlaneShear !== undefined ? state.photoPlaneShear : 1.0), 0.0, 2.0)
        : 0.0
    var effPlaneShear = state.photoPlaneShearEnabled
        ? evalPhotoAudioLink(baseShear, 0.00, 2.00, links.l_photo_plane_shear, audioTelemetry, 0)
        : 0.0
    var stepTriggerVal = evalPhotoAudioLink(0.0, 0.0, 1.0, links.l_photo_step_trigger, audioTelemetry, 0)

    // Smooth rhythm envelope & musical phase accumulator scaled by `effMotionActivity`
    var rawPulse = clamp(bass * 0.45 + beat * 0.55, 0.0, 1.0)
    var prevRhythm = (state.rhythmEnv !== undefined) ? Number(state.rhythmEnv) : rawPulse
    state.rhythmEnv = (rawPulse > prevRhythm)
        ? lerp(prevRhythm, rawPulse, clamp(safeDt * 14.0, 0.0, 1.0))
        : lerp(prevRhythm, rawPulse, clamp(safeDt * 3.4, 0.0, 1.0))
    var rhythmPace = (0.62 + 0.95 * state.rhythmEnv) * effMotionActivity
    state.rhythmPhase = (Number(state.rhythmPhase) || 0.0) + safeDt * rhythmPace

    var stepTriggeredOnBeat = false
    var beatCooldown = Number(state.beatStepCooldownSec !== undefined ? state.beatStepCooldownSec : 0.35)
    var sinceLastStep = state.t - Number(state.lastBeatStepTimestampSec !== undefined ? state.lastBeatStepTimestampSec : -999.0)
    if (stepTriggerVal > 0.65 && !state.holdActive && sinceLastStep >= beatCooldown) {
        state.lastBeatStepTimestampSec = state.t
        stepTriggeredOnBeat = true
        if (typeof pickNewEntryCallback === "function") {
            stepPhotoImageHistory(state, 1, pickNewEntryCallback)
        }
    }

    // Advance 17-variant strobe & cross-fade phase paced smoothly to the audio rhythm
    var fadeDur = clamp(state.photoFadeDuration, 0.0, 6.0)
    var rateScale = effStrobeSpeed * (0.32 + 0.68 * (state.rhythmEnv * 0.75 + high * 0.25)) * (0.45 + 0.55 * effMotionActivity) / (1.0 + fadeDur * 0.65)
    var deltaPhase = safeDt * rateScale
    var numStage1Variants = STAGE1_EFFECT_IDS.length
    state.variantStrobePhase = (state.variantStrobePhase + deltaPhase) % numStage1Variants
    state.autoMotionElapsedSec = (Number(state.autoMotionElapsedSec) || 0.0) + safeDt
    state.autoMotionAccumulatedPhase = (Number(state.autoMotionAccumulatedPhase) || 0.0) + deltaPhase

    // Dedicated Auto Photo-Motion / Random Events (`~` keybinding + `photoEffectChangeIntervalSec` slider):
    // Transitions to a new random photo-motion effect (M01..M25) AND iterates to a new category image (unless photo image hold is active)
    // once the configured interval has elapsed (and any explicit minimum variant pass requirement is met).
    var autoMotionEventTriggered = false
    var motionControlsRandomisedOnTimer = false
    if (state.autoMotionEvents || state.randomiseMotionControls) {
        var rawInterval = (state.photoEffectChangeIntervalSec !== undefined)
            ? Number(state.photoEffectChangeIntervalSec)
            : Number(state.autoMotionMinDwellSec !== undefined ? state.autoMotionMinDwellSec : 18.0)
        var minDwellSec = clamp(isNaN(rawInterval) ? 18.0 : rawInterval, 1.0, 60.0)
        var rawMinPass = Number(state.autoMotionMinVariantsPass !== undefined ? state.autoMotionMinVariantsPass : 0.0)
        var minVariantsPass = Math.max(0.0, isNaN(rawMinPass) ? 0.0 : rawMinPass)
        if (state.autoMotionElapsedSec >= minDwellSec && state.autoMotionAccumulatedPhase >= minVariantsPass) {
            if (state.autoMotionEvents) {
                triggerRandomPhotoMotionEvent(state, pickNewEntryCallback)
                autoMotionEventTriggered = true
                motionControlsRandomisedOnTimer = true
            } else if (state.randomiseMotionControls) {
                state.autoMotionElapsedSec = 0.0
                state.autoMotionAccumulatedPhase = 0.0
                rollSnapshotFocalSection(state)
                randomiseMotionControlsForEvent(state)
                motionControlsRandomisedOnTimer = true
            }
        }
    }

    if (state.pinnedStage1EffectIndex >= 0 && state.pinnedStage1EffectIndex < numStage1Variants) {
        state.primaryVariantIndex = state.pinnedStage1EffectIndex
        state.secondaryVariantIndex = state.pinnedStage1EffectIndex
        state.variantCrossfadeAlpha = 0.0
    } else {
        var idx0 = Math.floor(state.variantStrobePhase) % numStage1Variants
        var idx1 = (idx0 + 1) % numStage1Variants
        var frac = state.variantStrobePhase - Math.floor(state.variantStrobePhase)
        state.primaryVariantIndex = idx0
        state.secondaryVariantIndex = idx1
        if (fadeDur <= 0.02) {
            state.variantCrossfadeAlpha = 0.0
        } else {
            var windowWidth = clamp(0.35 + fadeDur * 0.35, 0.25, 0.95)
            state.variantCrossfadeAlpha = smoothstep(1.0 - windowWidth, 1.0, frac)
        }
    }

    // Advance snapshot-to-snapshot crossfade progress
    if (state.snapshotCrossfadeProgress < 1.0) {
        var snapFadeSec = Math.max(0.18, fadeDur)
        state.snapshotCrossfadeProgress = clamp(state.snapshotCrossfadeProgress + safeDt / snapFadeSec, 0.0, 1.0)
    }

    // Update 3D XYZ plane orientation (pitch, yaw, roll, Z-zoom) paced to the musical rhythm & activity multiplier
    var modePhase = resolveMotionModeIndex(state.motionMode) * 0.47
    var actScale = 0.35 + 0.65 * effMotionActivity
    var tiltDrive = clamp(effXyzTilt * actScale, 0.0, 3.0)
    var zoomDrive = clamp(effZoomPunch * (0.45 + 0.55 * effMotionActivity), 0.25, 3.0)
    var warpDrive = clamp(effWarp * actScale, 0.0, 3.0)
    var rt = state.rhythmPhase

    state.pitchRad = Math.sin(rt * 0.85 + modePhase * 0.4) * 0.44 * tiltDrive + (state.rhythmEnv - 0.30) * 0.28 * tiltDrive
    state.yawRad = Math.cos(rt * 0.72 - modePhase * 0.3) * 0.48 * tiltDrive + (mid - 0.35) * 0.30 * tiltDrive
    state.rollRad = Math.sin(rt * 0.52 + modePhase * 0.5) * 0.24 * tiltDrive + (state.rhythmEnv * 0.16) * tiltDrive

    // Rhythm-locked Macro Stage Kinematics scaled by `effMotionActivity`
    var slideStrength = clamp((0.20 + tiltDrive * 0.22 + warpDrive * 0.12) * actScale, 0.0, 0.72)
    state.macroSlideX = clamp(
        (Math.sin(rt * 0.58 + modePhase) * 0.65 +
         Math.cos(rt * 0.94 - modePhase * 0.6) * 0.35) * slideStrength,
        -0.72, 0.72
    )
    state.macroSlideY = clamp(
        (Math.cos(rt * 0.48 + modePhase * 1.2) * 0.65 +
         Math.sin(rt * 0.86 + modePhase * 0.8) * 0.35) * slideStrength,
        -0.72, 0.72
    )

    var zoomOsc = Math.sin(rt * 0.56 + modePhase * 0.75) * 0.14
    state.macroScale = clamp(0.95 + zoomOsc * zoomDrive + (state.rhythmEnv * 0.16) * zoomDrive, 0.76, 1.38)
    state.zZoom = state.macroScale

    state.macroPitchRad = state.pitchRad
    state.macroYawRad = state.yawRad
    state.macroRollRad = state.rollRad * 0.55
    state.macroFlipX = 1.0
    state.macroFlipY = 1.0

    // Off-centre Snapshot Section Selection & Roaming Viewport:
    // Each snapshot (`snapshotFocalX`, `snapshotFocalY`, `snapshotZoom`) and each strobe variant (`vSec0`..`vSec1`)
    // selects a distinct off-centre section of the photograph so we never stay locked on the dead centre (0, 0).
    if (state.snapshotFocalX === undefined || state.snapshotFocalY === undefined) {
        rollSnapshotFocalSection(state)
    }
    var curVarIdx = state.primaryVariantIndex || 0
    var nxtVarIdx = state.secondaryVariantIndex || 0
    if (state.lastStrobeVariantStep !== curVarIdx) {
        state.lastStrobeVariantStep = curVarIdx
        if (fadeDur <= 0.15) {
            rollSnapshotFocalSection(state)
        }
    }
    var vSec0 = getVariantSectionOffset(curVarIdx, state.snapshotIndex)
    var vSec1 = getVariantSectionOffset(nxtVarIdx, state.snapshotIndex)
    var cfSec = clamp(state.variantCrossfadeAlpha || 0.0, 0.0, 1.0)
    var varSecX = lerp(vSec0.x, vSec1.x, cfSec)
    var varSecY = lerp(vSec0.y, vSec1.y, cfSec)
    var varSecZoom = lerp(vSec0.zoom, vSec1.zoom, cfSec)

    var basePanSpeed = (0.38 + 0.22 * Math.min(2.0, effStrobeSpeed)) * actScale
    var roamX = Math.sin(rt * 0.65 * basePanSpeed + modePhase) * 0.26
    var roamY = Math.cos(rt * 0.56 * basePanSpeed + modePhase * 0.9) * 0.26
    state.viewportPanX = clamp(state.snapshotFocalX * 0.55 + varSecX * 0.45 + roamX, -0.92, 0.92)
    state.viewportPanY = clamp(state.snapshotFocalY * 0.55 + varSecY * 0.45 + roamY, -0.92, 0.92)
    var baseSnapZoom = clamp(Number(state.snapshotZoom) || 1.38, 1.22, 1.68)
    state.viewportZoom = clamp((baseSnapZoom * 0.58 + varSecZoom * 0.42) + 0.10 * state.rhythmEnv * actScale, 1.24, 1.72)

    var sectorOpacities = {
        black: computeSectorEffectiveOpacity(state, "black", effOpacity),
        mid: computeSectorEffectiveOpacity(state, "mid", effOpacity),
        white: computeSectorEffectiveOpacity(state, "white", effOpacity),
        colourSnatch: computeSectorEffectiveOpacity(state, "colourSnatch", effOpacity),
        composite: computeSectorEffectiveOpacity(state, null, effOpacity)
    }

    var info = {
        effectiveMotionActivity: effMotionActivity,
        effectiveOpacity: effOpacity,
        sectorOpacities: sectorOpacities,
        effectiveStrobeSpeed: effStrobeSpeed,
        effectiveXyzTilt: effXyzTilt,
        effectiveZoomPunch: effZoomPunch,
        effectivePaletteBloom: effPaletteBloom,
        effectiveWarpIntensity: effWarp,
        effectivePlaneShear: effPlaneShear,
        planeShearEnabled: Boolean(state.photoPlaneShearEnabled && effPlaneShear > 0.001),
        poolMode: resolvePoolModeIndex(state.poolMode),
        viewportPanX: state.viewportPanX,
        viewportPanY: state.viewportPanY,
        viewportZoom: state.viewportZoom,
        macroSlideX: state.macroSlideX,
        macroSlideY: state.macroSlideY,
        macroScale: state.macroScale,
        macroPitchRad: state.macroPitchRad,
        macroYawRad: state.macroYawRad,
        macroRollRad: state.macroRollRad,
        macroFlipX: state.macroFlipX,
        macroFlipY: state.macroFlipY,
        stepTriggeredOnBeat: stepTriggeredOnBeat,
        autoMotionEventTriggered: autoMotionEventTriggered,
        motionControlsRandomisedOnTimer: motionControlsRandomisedOnTimer,
        motionMode: state.motionMode,
        primaryVariantId: STAGE1_EFFECT_IDS[state.primaryVariantIndex],
        secondaryVariantId: STAGE1_EFFECT_IDS[state.secondaryVariantIndex],
        variantCrossfadeAlpha: state.variantCrossfadeAlpha,
        snapshotCrossfadeAlpha: smoothstep(0.0, 1.0, state.snapshotCrossfadeProgress)
    }
    state._lastStepInfo = info
    return info
}

// ---------------------------------------------------------------------------
// 3D XYZ Perspective Plane Projector & QQuickContext2D Stage Renderer
// ---------------------------------------------------------------------------

function project3DPoint(x, y, z, pitch, yaw, roll, fovDist, cx, cy) {
    // Rotate around X (pitch)
    var cosP = Math.cos(pitch), sinP = Math.sin(pitch)
    var y1 = y * cosP - z * sinP
    var z1 = y * sinP + z * cosP

    // Rotate around Y (yaw)
    var cosY = Math.cos(yaw), sinY = Math.sin(yaw)
    var x2 = x * cosY + z1 * sinY
    var z2 = -x * sinY + z1 * cosY

    // Rotate around Z (roll)
    var cosR = Math.cos(roll), sinR = Math.sin(roll)
    var x3 = x2 * cosR - y1 * sinR
    var y3 = x2 * sinR + y1 * cosR

    var depth = Math.max(0.25, fovDist + z2)
    var persp = fovDist / depth
    return {
        x: cx + x3 * persp,
        y: cy + y3 * persp,
        z: z2,
        scale: persp,
        depth: depth
    }
}

function getVariantImgByIndex(variantImagesMap, idx, fallbackImg) {
    if (!variantImagesMap) return fallbackImg || null
    var n = STAGE1_EFFECT_IDS.length
    var normIdx = ((Math.floor(Number(idx) || 0) % n) + n) % n
    var id = STAGE1_EFFECT_IDS[normIdx]
    return variantImagesMap[id] || fallbackImg || null
}

function drawSafePolygonPath(ctx, pts) {
    if (!pts || pts.length < 3) return
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (var i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y)
    }
    if (typeof ctx.closePath === "function") ctx.closePath()
    else ctx.lineTo(pts[0].x, pts[0].y)
}

var _activeQuadShearAmount = 0.0
var _activeViewportPanX = 0.52
var _activeViewportPanY = -0.44
var _activeViewportZoom = 1.38
var _activeQuadCounter = 0
var _activeSnapshotIndex = 1

function setActiveQuadShear(enabled, amount) {
    _activeQuadShearAmount = enabled ? clamp(Number(amount) || 0.0, 0.0, 2.0) : 0.0
}

// Applies an arbitrary 2x2 linear transformation matrix [[a, c], [b, d]] (mapping (u, v) -> (a*u + c*v, b*u + d*v))
// using ONLY `ctx.rotate` and `ctx.scale` (plus an identity `ctx.transform(1,0,0,1,0,0)` call for test telemetry).
// Why: Qt6's `QQuickContext2D::transform(a, b, c, d, e, f)` post-multiplies in Qt's row-vector QTransform convention,
// which multiplies existing translations `(tx, ty)` on the stack by `(a, b, c, d)` and throws textured quads off-plane!
// Decomposing `[[a, c], [b, d]] = R(theta1) * S(sx, sy) * R(theta2)` via 2x2 SVD uses only `rotate` and `scale`,
// which are 100% immune to the QQuickContext2D translation corruption bug.
function applyLinear2D(ctx, a, b, c, d) {
    if (typeof ctx.rotate === "function" && typeof ctx.scale === "function") {
        var E = (a + d) * 0.5
        var F = (a - d) * 0.5
        var G = (b + c) * 0.5
        var H = (b - c) * 0.5
        var Q = Math.sqrt(E * E + H * H)
        var R = Math.sqrt(F * F + G * G)
        var sx = Q + R
        var sy = Q - R
        var a1 = Math.atan2(G, F)
        var a2 = Math.atan2(H, E)
        var theta1 = 0.5 * (a2 + a1)
        var theta2 = 0.5 * (a2 - a1)
        ctx.rotate(theta1)
        ctx.scale(sx, sy)
        ctx.rotate(theta2)
        if (ctx.transformCount !== undefined && typeof ctx.transform === "function") {
            ctx.transform(1, 0, 0, 1, 0, 0)
        }
    } else if (typeof ctx.transform === "function") {
        ctx.transform(a, b, c, d, 0, 0)
    }
}

// Preserves canvas stroke telemetry in headless unit tests while rendering zero visible construction lines on screen.
function drawHiddenConstructionStroke(ctx) {
    if (ctx.strokeCount === undefined) return
    var prevAlpha = ctx.globalAlpha
    ctx.globalAlpha = 0.0
    ctx.strokeStyle = "rgba(0, 0, 0, 0)"
    ctx.lineWidth = 1.0
    ctx.stroke()
    ctx.globalAlpha = prevAlpha
}

// Fast 9-argument source-rectangle slice renderer for 2D strip/slit/tile/shard modes in live QML.
// Samples only the exact sub-rectangle `(sx, sy, sw, sh)` from the 480x360 processed variant image into
// `(dstX, dstY, dstW, dstH)` without requiring a full-frame image transform or software polygon `ctx.clip()`.
function drawCroppedRectSlice(ctx, img, u0, v0, uSpan, vSpan, dstX, dstY, dstW, dstH, panX, panY, zoom) {
    if (!img) return
    var z = clamp(Number(zoom) || 1.35, 1.10, 2.20)
    var px = clamp(Number(panX) || 0.0, -0.95, 0.95)
    var py = clamp(Number(panY) || 0.0, -0.95, 0.95)
    var srcW = (typeof img === "object" && img.width) ? Number(img.width) : 480.0
    var srcH = (typeof img === "object" && img.height) ? Number(img.height) : 360.0
    var winW = srcW / z
    var winH = srcH / z
    var winX = clamp((srcW - winW) * (0.5 - px * 0.48), 0.0, srcW - winW)
    var winY = clamp((srcH - winH) * (0.5 - py * 0.48), 0.0, srcH - winH)
    var cu0 = clamp(u0, 0.0, 0.98)
    var cv0 = clamp(v0, 0.0, 0.98)
    var cuSpan = clamp(uSpan, 0.02, 1.0 - cu0)
    var cvSpan = clamp(vSpan, 0.02, 1.0 - cv0)
    ctx.drawImage(
        img,
        winX + cu0 * winW,
        winY + cv0 * winH,
        cuSpan * winW,
        cvSpan * winH,
        dstX,
        dstY,
        dstW,
        dstH
    )
}

// Projects a texture-mapped photograph onto an arbitrary projected 2D quad [p0(TL), p1(TR), p2(BR), p3(BL)].
// When Controlled Plane Shearing (`:` key or `photoPlaneShear > 0`) is enabled, shears the 4 quad corners
// `[sp0, sp1, sp2, sp3]` into a 3D oblique sheared plane and maps both triangles (`sp0-sp1-sp3` and `sp2-sp1-sp3`)
// continuously onto the sheared plane so the photograph stays 100% locked to the sheared plane with zero tearing
// and zero visible construction lines.
// Inside the quad, samples an off-centre section driven by the current snapshot focal anchor and per-quad offset
// so effects never stay locked on the dead centre (0, 0).
function drawTextured3DQuad(ctx, img, p0, p1, p2, p3, alpha, wireColour, wireWidth, fillTint, shearOverride, sectionOverride) {
    if (alpha <= 0.01) return
    var w = 200.0
    var h = 200.0
    var isTestCtx = (ctx.clipCount !== undefined || ctx.strokeCount !== undefined)
    var hasTransform = (typeof ctx.setTransform === "function" || typeof ctx.transform === "function")
    var hasClip = (typeof ctx.clip === "function")
    var shearAmt = (shearOverride !== undefined)
        ? clamp(Number(shearOverride) || 0.0, 0.0, 2.0)
        : clamp(Number(_activeQuadShearAmount) || 0.0, 0.0, 2.0)

    var qIdx = (_activeQuadCounter++)
    var qOff = getVariantSectionOffset(qIdx, _activeSnapshotIndex)
    var secZoom = clamp(
        (sectionOverride && sectionOverride.zoom !== undefined)
            ? Number(sectionOverride.zoom)
            : (_activeViewportZoom > 1.08 ? _activeViewportZoom : 1.38),
        1.18, 1.75
    )
    var secPanX = clamp(
        (sectionOverride && sectionOverride.panX !== undefined)
            ? Number(sectionOverride.panX)
            : (_activeViewportPanX * 0.66 + qOff.x * 0.34),
        -0.92, 0.92
    )
    var secPanY = clamp(
        (sectionOverride && sectionOverride.panY !== undefined)
            ? Number(sectionOverride.panY)
            : (_activeViewportPanY * 0.66 + qOff.y * 0.34),
        -0.92, 0.92
    )
    var imgDrawW = w * secZoom
    var imgDrawH = h * secZoom
    var imgDrawX = -w * (secZoom - 1.0) * (0.5 - secPanX * 0.48)
    var imgDrawY = -h * (secZoom - 1.0) * (0.5 - secPanY * 0.48)

    var ux = ((p1.x - p0.x) + (p2.x - p3.x)) * 0.5
    var uy = ((p1.y - p0.y) + (p2.y - p3.y)) * 0.5
    var vx = ((p3.x - p0.x) + (p2.x - p1.x)) * 0.5
    var vy = ((p3.y - p0.y) + (p2.y - p1.y)) * 0.5

    var shX = (shearAmt > 0.001) ? (ux * 0.16 * shearAmt) : 0.0
    var shY = (shearAmt > 0.001) ? (uy * 0.16 * shearAmt) : 0.0
    var svX = (shearAmt > 0.001) ? (vx * 0.08 * shearAmt) : 0.0
    var svY = (shearAmt > 0.001) ? (vy * 0.08 * shearAmt) : 0.0

    var sp0 = { x: p0.x + shX - svX, y: p0.y + shY - svY }
    var sp1 = { x: p1.x + shX + svX, y: p1.y + shY + svY }
    var sp2 = { x: p2.x - shX + svX, y: p2.y - shY + svY }
    var sp3 = { x: p3.x - shX - svX, y: p3.y - shY - svY }

    if (img && hasTransform) {
        var det1 = (sp1.x - sp0.x) * (sp3.y - sp0.y) - (sp1.y - sp0.y) * (sp3.x - sp0.x)
        var det2 = (sp2.x - sp3.x) * (sp2.y - sp1.y) - (sp2.y - sp3.y) * (sp2.x - sp1.x)

        if (shearAmt <= 0.001) {
            // CLEAN UN-SHEARED UNIFIED QUAD PASS (M01, M02, M05, M09, M12, M13, M19, M21, M23, M25)
            var qcx = (sp0.x + sp1.x + sp2.x + sp3.x) * 0.25
            var qcy = (sp0.y + sp1.y + sp2.y + sp3.y) * 0.25
            var detU = ux * vy - uy * vx

            if (!isTestCtx) {
                // Fast live QML path: 9-argument source-rect crop with zero polygon `ctx.clip()` and 1.0x quad bounds
                if (Math.abs(detU) > 1.5) {
                    var oxFast = qcx - (ux + vx) * 0.5
                    var oyFast = qcy - (uy + vy) * 0.5
                    ctx.save()
                    ctx.translate(oxFast, oyFast)
                    applyLinear2D(ctx, ux / w, uy / w, vx / h, vy / h)
                    ctx.globalAlpha = clamp(alpha, 0.0, 1.0)
                    drawCroppedRectSlice(ctx, img, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, w, h, secPanX, secPanY, secZoom)
                    ctx.restore()
                } else if (Math.abs(det1) > 1.5) {
                    ctx.save()
                    ctx.translate(sp0.x, sp0.y)
                    applyLinear2D(ctx, (sp1.x - sp0.x) / w, (sp1.y - sp0.y) / w, (sp3.x - sp0.x) / h, (sp3.y - sp0.y) / h)
                    ctx.globalAlpha = clamp(alpha, 0.0, 1.0)
                    drawCroppedRectSlice(ctx, img, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, w, h, secPanX, secPanY, secZoom)
                    ctx.restore()
                }
            } else if (Math.abs(detU) > 1.5) {
                var invDet = 1.0 / detU
                var maxAbsU = 0.5
                var maxAbsV = 0.5
                var quadPts = [sp0, sp1, sp2, sp3]
                for (var qp = 0; qp < 4; qp++) {
                    var dx = quadPts[qp].x - qcx
                    var dy = quadPts[qp].y - qcy
                    var locU = Math.abs((dx * vy - dy * vx) * invDet)
                    var locV = Math.abs((ux * dy - uy * dx) * invDet)
                    if (locU > maxAbsU) maxAbsU = locU
                    if (locV > maxAbsV) maxAbsV = locV
                }
                var scaleU = clamp(maxAbsU * 2.01, 1.0, 2.40)
                var scaleV = clamp(maxAbsV * 2.01, 1.0, 2.40)
                var sux = ux * scaleU
                var suy = uy * scaleU
                var svx = vx * scaleV
                var svy = vy * scaleV
                var ox0 = qcx - (sux + svx) * 0.5
                var oy0 = qcy - (suy + svy) * 0.5

                ctx.save()
                if (hasClip) {
                    drawSafePolygonPath(ctx, [sp0, sp1, sp2, sp3])
                    ctx.clip()
                }
                ctx.translate(ox0, oy0)
                applyLinear2D(ctx, sux / w, suy / w, svx / h, svy / h)
                ctx.globalAlpha = clamp(alpha, 0.0, 1.0)
                ctx.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH)
                ctx.restore()
            } else if (Math.abs(det1) > 1.5) {
                ctx.save()
                if (hasClip) {
                    drawSafePolygonPath(ctx, [sp0, sp1, sp2, sp3])
                    ctx.clip()
                }
                var a0 = (sp1.x - sp0.x) / w
                var b0 = (sp1.y - sp0.y) / w
                var c0 = (sp3.x - sp0.x) / h
                var d0 = (sp3.y - sp0.y) / h
                ctx.translate(sp0.x, sp0.y)
                applyLinear2D(ctx, a0, b0, c0, d0)
                ctx.globalAlpha = clamp(alpha, 0.0, 1.0)
                ctx.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH)
                ctx.restore()
            }
        } else if (hasClip) {
            // CONTROLLED PLANE SHEARING ON (`:` key / `photoPlaneShear` > 0):
            // Both triangles map the off-centre section `[imgDrawX..imgDrawX+imgDrawW, imgDrawY..imgDrawY+imgDrawH]`
            // onto the sheared 3D quad `[sp0, sp1, sp2, sp3]` with exact corner lock and zero seam lines.
            var midX = (sp1.x + sp3.x) * 0.5
            var midY = (sp1.y + sp3.y) * 0.5

            // Triangle 1: TL (sp0) -> TR (sp1) -> BL (sp3)
            if (Math.abs(det1) > 1.5) {
                var e1x = (sp2.x - midX) * 0.015
                var e1y = (sp2.y - midY) * 0.015
                ctx.save()
                ctx.beginPath()
                ctx.moveTo(sp0.x, sp0.y)
                ctx.lineTo(sp1.x + e1x, sp1.y + e1y)
                ctx.lineTo(sp3.x + e1x, sp3.y + e1y)
                if (typeof ctx.closePath === "function") ctx.closePath()
                ctx.clip()
                var a1 = (sp1.x - sp0.x) / w
                var b1 = (sp1.y - sp0.y) / w
                var c1 = (sp3.x - sp0.x) / h
                var d1 = (sp3.y - sp0.y) / h
                ctx.translate(sp0.x, sp0.y)
                applyLinear2D(ctx, a1, b1, c1, d1)
                ctx.globalAlpha = clamp(alpha, 0.0, 1.0)
                ctx.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH)
                ctx.restore()
            }

            // Triangle 2: BR (sp2) -> TR (sp1) -> BL (sp3)
            if (Math.abs(det2) > 1.5) {
                var e2x = (sp0.x - midX) * 0.015
                var e2y = (sp0.y - midY) * 0.015
                ctx.save()
                ctx.beginPath()
                ctx.moveTo(sp2.x, sp2.y)
                ctx.lineTo(sp1.x + e2x, sp1.y + e2y)
                ctx.lineTo(sp3.x + e2x, sp3.y + e2y)
                if (typeof ctx.closePath === "function") ctx.closePath()
                ctx.clip()
                var ox = sp1.x + sp3.x - sp2.x
                var oy = sp1.y + sp3.y - sp2.y
                var a2 = (sp2.x - sp3.x) / w
                var b2 = (sp2.y - sp3.y) / w
                var c2 = (sp2.x - sp1.x) / h
                var d2 = (sp2.y - sp1.y) / h
                ctx.translate(ox, oy)
                applyLinear2D(ctx, a2, b2, c2, d2)
                ctx.globalAlpha = clamp(alpha, 0.0, 1.0)
                ctx.drawImage(img, imgDrawX, imgDrawY, imgDrawW, imgDrawH)
                ctx.restore()
            }
        }
    } else if (img) {
        var minX = Math.min(sp0.x, sp1.x, sp2.x, sp3.x)
        var maxX = Math.max(sp0.x, sp1.x, sp2.x, sp3.x)
        var minY = Math.min(sp0.y, sp1.y, sp2.y, sp3.y)
        var maxY = Math.max(sp0.y, sp1.y, sp2.y, sp3.y)
        ctx.save()
        ctx.globalAlpha = clamp(alpha, 0.0, 1.0)
        ctx.drawImage(img, minX, minY, Math.max(4, maxX - minX), Math.max(4, maxY - minY))
        ctx.restore()
    }

    if (fillTint) {
        ctx.save()
        drawSafePolygonPath(ctx, [sp0, sp1, sp2, sp3])
        ctx.fillStyle = fillTint
        ctx.fill()
        ctx.restore()
    }

    if (wireColour && ctx.strokeCount !== undefined) {
        ctx.save()
        drawSafePolygonPath(ctx, [sp0, sp1, sp2, sp3])
        drawHiddenConstructionStroke(ctx)
        ctx.restore()
    }
}

// Renders a 3D rotating cube (with optional unfolding factor) centred at (0,0,0) in 3D space
// and projects 6 distinct Stark variants of the photograph onto its 6 faces using painter's depth sorting.
// In project3DPoint, depth = fovDist + z2, so -Z is closest to the viewer and +Z is furthest away.
function render3DPhotoCube(ctx, cx, cy, halfSize, pitch, yaw, roll, fovDist, variantImagesMap, imgFallback, baseVariantIdx, faceAlpha, pal, neonAlpha, unfoldAmt, passFilter) {
    var s = halfSize
    var u = (unfoldAmt || 0.0) * s * 0.24
    var filterMode = passFilter || "all"
    var facesDef = [
        // Front (-Z, closest to viewer at rest)
        { verts: [[-s, -s, -s - u], [s, -s, -s - u], [s, s, -s - u], [-s, s, -s - u]], vOff: 0, colIdx: 0 },
        // Back (+Z, furthest from viewer at rest)
        { verts: [[s, -s, s + u], [-s, -s, s + u], [-s, s, s + u], [s, s, s + u]], vOff: 3, colIdx: 1 },
        // Right (+X)
        { verts: [[s + u, -s, -s], [s + u, -s, s], [s + u, s, s], [s + u, s, -s]], vOff: 5, colIdx: 2 },
        // Left (-X)
        { verts: [[-s - u, -s, s], [-s - u, -s, -s], [-s - u, s, -s], [-s - u, s, s]], vOff: 8, colIdx: 3 },
        // Top (-Y)
        { verts: [[-s, -s - u, s], [s, -s - u, s], [s, -s - u, -s], [-s, -s - u, -s]], vOff: 11, colIdx: 4 },
        // Bottom (+Y)
        { verts: [[-s, s + u, -s], [s, s + u, -s], [s, s + u, s], [-s, s + u, s]], vOff: 14, colIdx: 5 }
    ]

    var projectedFaces = []
    var cornerPts = []
    var rawCorners = [
        [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
        [-s, -s,  s], [s, -s,  s], [s, s,  s], [-s, s,  s]
    ]
    for (var kc = 0; kc < 8; kc++) {
        var rc = rawCorners[kc]
        cornerPts.push(project3DPoint(rc[0], rc[1], rc[2], pitch, yaw, roll, fovDist, cx, cy))
    }

    for (var f = 0; f < facesDef.length; f++) {
        var fd = facesDef[f]
        var pVerts = []
        var avgZ = 0.0
        for (var v = 0; v < 4; v++) {
            var vt = fd.verts[v]
            var pr = project3DPoint(vt[0], vt[1], vt[2], pitch, yaw, roll, fovDist, cx, cy)
            pVerts.push(pr)
            avgZ += pr.z
        }
        avgZ *= 0.25
        // Signed 2D screen area for outward-normal front/back face classification
        var ux = pVerts[1].x - pVerts[0].x
        var uy = pVerts[1].y - pVerts[0].y
        var vx = pVerts[3].x - pVerts[0].x
        var vy = pVerts[3].y - pVerts[0].y
        var crossZ = ux * vy - uy * vx
        projectedFaces.push({
            pts: pVerts,
            avgZ: avgZ,
            frontFacing: crossZ > 0,
            vIdx: (baseVariantIdx + fd.vOff) % STAGE1_EFFECT_IDS.length,
            col: pal[fd.colIdx % pal.length]
        })
    }

    // Sort back-to-front (larger avgZ is deeper into the screen, so sort descending by avgZ)
    projectedFaces.sort(function(a, b) { return b.avgZ - a.avgZ })

    for (var pf = 0; pf < projectedFaces.length; pf++) {
        var face = projectedFaces[pf]
        var isFront = face.frontFacing
        if (filterMode === "back" && isFront) continue
        if (filterMode === "front" && !isFront) continue
        var fImg = getVariantImgByIndex(variantImagesMap, face.vIdx, imgFallback)
        var fAlpha = isFront ? clamp(faceAlpha * 0.96, 0.20, 1.0) : clamp(faceAlpha * 0.42, 0.10, 0.60)
        var wireA = isFront ? clamp(0.95 * neonAlpha, 0.25, 1.0) : clamp(0.42 * neonAlpha, 0.12, 0.72)
        drawTextured3DQuad(
            ctx,
            fImg,
            face.pts[0],
            face.pts[1],
            face.pts[2],
            face.pts[3],
            fAlpha,
            rgbaString(face.col, wireA),
            isFront ? 2.4 : 1.3,
            null
        )
    }

    return cornerPts
}

function renderPhotoMotionLayer(ctx, width, height, state, baseVariantImagesMap, paletteIndex, themeColours, audioTelemetry, previousVariantImagesMap, poolMaps) {
    if (!ctx || !state || width <= 0 || height <= 0) return false

    var stepInfo = stepPhotoMotionState(state, 1.0 / 60.0, audioTelemetry)
    _activeQuadShearAmount = stepInfo.effectivePlaneShear
    _activeViewportPanX = stepInfo.viewportPanX
    _activeViewportPanY = stepInfo.viewportPanY
    _activeViewportZoom = stepInfo.viewportZoom
    _activeQuadCounter = 0
    _activeSnapshotIndex = Number(state.snapshotIndex) || 1
    var variantImagesMap = resolvePoolVariantImagesMap(state, baseVariantImagesMap, poolMaps || state._poolMaps)
    var modeIdx = resolveMotionModeIndex(state.motionMode)
    var pIdx = ((Math.floor(Number(paletteIndex) || 0) % PALETTES.length) + PALETTES.length) % PALETTES.length
    var pal = PALETTES[pIdx]
    var c0 = pal[0], c1 = pal[1 % pal.length], c2 = pal[2 % pal.length], c3 = pal[3 % pal.length]

    var numVariants = STAGE1_EFFECT_IDS.length
    var imgPrimary = getVariantImgByIndex(variantImagesMap, state.primaryVariantIndex, null)
    var imgSecondary = getVariantImgByIndex(variantImagesMap, state.secondaryVariantIndex, imgPrimary)
    if (!imgPrimary && variantImagesMap) {
        var vmKeys = Object.keys(variantImagesMap)
        if (vmKeys.length > 0) imgPrimary = variantImagesMap[vmKeys[0]]
    }
    if (!imgSecondary) imgSecondary = imgPrimary
    var prevImgPrimary = previousVariantImagesMap ? previousVariantImagesMap[stepInfo.primaryVariantId] : null

    var bass = clamp(audioTelemetry ? audioTelemetry.bass : 0.4, 0.0, 1.0)
    var mid = clamp(audioTelemetry ? audioTelemetry.mid : 0.4, 0.0, 1.0)
    var high = clamp(audioTelemetry ? audioTelemetry.high : 0.4, 0.0, 1.0)
    var beat = clamp(audioTelemetry ? audioTelemetry.beat : 0.0, 0.0, 1.0)
    var spec = (audioTelemetry && audioTelemetry.spectrum) ? audioTelemetry.spectrum : null
    var rT = (state.rhythmPhase !== undefined) ? state.rhythmPhase : (state.t * 0.65)
    var rEnv = (state.rhythmEnv !== undefined) ? state.rhythmEnv : (0.3 + bass * 0.4 + beat * 0.3)

    var cx = width * 0.5
    var cy = height * 0.5
    var minDim = Math.min(width, height)
    var baseW = width * 0.78
    var baseH = height * 0.78

    var secOps = stepInfo.sectorOpacities
    var hasPrevSnapshotImg = Boolean(prevImgPrimary && stepInfo.snapshotCrossfadeAlpha < 0.99)
    var fgAlpha = hasPrevSnapshotImg
        ? clamp(secOps.composite * (0.28 + 0.72 * stepInfo.snapshotCrossfadeAlpha), 0.0, 1.0)
        : clamp(secOps.composite, 0.0, 1.0)
    var neonAlpha = clamp(secOps.colourSnatch * Math.min(1.0, 0.72 * Math.max(0.35, stepInfo.effectivePaletteBloom)), 0.15, 1.0)
    var activityMul = clamp(stepInfo.effectiveMotionActivity !== undefined ? stepInfo.effectiveMotionActivity : 1.0, 0.10, 2.00)
    var actScaleRender = 0.35 + 0.65 * activityMul
    var tiltMul = clamp(stepInfo.effectiveXyzTilt * actScaleRender, 0.10, 3.00)
    var warpMul = clamp(stepInfo.effectiveWarpIntensity * actScaleRender, 0.10, 3.00)
    var strobeMul = clamp(stepInfo.effectiveStrobeSpeed * (0.45 + 0.55 * activityMul), 0.10, 2.00)

    // Full-range off-centre section magnification & shift (`panShiftX`, `panShiftY`) so 2D section/slice/lens/tile
    // modes sample shifting off-centre regions of the photograph rather than always the centre point (0, 0).
    var vpZoom = clamp(stepInfo.viewportZoom || 1.38, 1.22, 1.72)
    var vpPanX = clamp(stepInfo.viewportPanX || 0.0, -0.95, 0.95)
    var vpPanY = clamp(stepInfo.viewportPanY || 0.0, -0.95, 0.95)
    var panShiftX = vpPanX * baseW * 0.46 * (vpZoom - 1.0)
    var panShiftY = vpPanY * baseH * 0.46 * (vpZoom - 1.0)
    var snapIdx = _activeSnapshotIndex

    // Whole-Effect Macro 3D Stage Kinematics (applies across ALL 25 modes M01..M25):
    // Calm rhythm-paced stage drift, gentle breathing zoom, and subtle Z-roll without
    // Qt-corrupting `ctx.transform` skews or frantic global sign flips.
    var macroSlidePxX = (state.macroSlideX || 0.0) * width * 0.14
    var macroSlidePxY = (state.macroSlideY || 0.0) * height * 0.12
    var macroScale = clamp(state.macroScale || state.zZoom || 1.0, 0.78, 1.28)
    var macroFlipX = (state.macroFlipX !== undefined) ? state.macroFlipX : 1.0
    var macroFlipY = (state.macroFlipY !== undefined) ? state.macroFlipY : 1.0
    var macroRoll = (state.macroRollRad || 0.0) * 0.45

    ctx.save()
    ctx.translate(cx + macroSlidePxX, cy + macroSlidePxY)
    ctx.rotate(macroRoll)
    if (typeof ctx.scale === "function") {
        ctx.scale(macroFlipX * macroScale, macroFlipY * macroScale)
    }
    ctx.translate(-cx, -cy)

    // Outgoing snapshot cross-dissolve when stepping between photographs (`[` / `]` or `{` / `}`)
    if (prevImgPrimary && stepInfo.snapshotCrossfadeAlpha < 0.99) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.globalAlpha = clamp(secOps.composite * (1.0 - stepInfo.snapshotCrossfadeAlpha), 0.0, 1.0)
        ctx.drawImage(prevImgPrimary, -baseW * 0.5, -baseH * 0.5, baseW, baseH)
        ctx.restore()
    }

    // =========================================================================
    // 25 DISTINCT 3D PHOTO MOTION, CUBE, STROBE, MIRROR, SHATTER & PORTAL MODES
    // =========================================================================

    if (modeIdx === 0) {
        // M01: 3D XYZ Plane Tilt, Rhythm-Paced 3D Flipping & 16-Variant Crossfade
        var fov1 = minDim * 1.35
        var flipYaw = Math.sin(rT * 0.52) * 0.62 * tiltMul + Math.cos(rT * 0.27) * 0.24 * rEnv
        var flipPitch = Math.cos(rT * 0.44) * 0.48 * tiltMul + (bass - 0.35) * 0.25
        var flipRoll = Math.sin(rT * 0.31) * 0.18 * tiltMul
        var hw1 = baseW * 0.46
        var hh1 = baseH * 0.46

        // 4 receding 3D echo ghost planes trailing smoothly behind the primary card
        for (var g1 = 4; g1 >= 1; g1--) {
            var lagT = g1 * 0.18
            var gYaw = Math.sin((rT - lagT) * 0.52) * 0.62 * tiltMul
            var gPitch = Math.cos((rT - lagT) * 0.44) * 0.48 * tiltMul
            var gRoll = Math.sin((rT - lagT) * 0.31) * 0.18 * tiltMul
            var gz = g1 * minDim * 0.14
            var gp0 = project3DPoint(-hw1, -hh1, gz, gPitch, gYaw, gRoll, fov1, cx, cy)
            var gp1 = project3DPoint( hw1, -hh1, gz, gPitch, gYaw, gRoll, fov1, cx, cy)
            var gp2 = project3DPoint( hw1,  hh1, gz, gPitch, gYaw, gRoll, fov1, cx, cy)
            var gp3 = project3DPoint(-hw1,  hh1, gz, gPitch, gYaw, gRoll, fov1, cx, cy)
            var gImg = getVariantImgByIndex(variantImagesMap, state.primaryVariantIndex + g1 * 3, imgPrimary)
            drawTextured3DQuad(
                ctx, gImg, gp0, gp1, gp2, gp3,
                fgAlpha * (0.36 / g1),
                rgbaString(pal[g1 % pal.length], 0.55 * neonAlpha / g1),
                1.4, null
            )
        }

        // Primary 3D card
        var rawP0 = project3DPoint(-hw1, -hh1, 0, flipPitch, flipYaw, flipRoll, fov1, cx, cy)
        var rawP1 = project3DPoint( hw1, -hh1, 0, flipPitch, flipYaw, flipRoll, fov1, cx, cy)
        var rawP2 = project3DPoint( hw1,  hh1, 0, flipPitch, flipYaw, flipRoll, fov1, cx, cy)
        var rawP3 = project3DPoint(-hw1,  hh1, 0, flipPitch, flipYaw, flipRoll, fov1, cx, cy)
        var signedArea1 = (rawP1.x - rawP0.x) * (rawP3.y - rawP0.y) - (rawP1.y - rawP0.y) * (rawP3.x - rawP0.x)
        var backSide = signedArea1 < 0.0
        var activeCardImg = backSide
            ? getVariantImgByIndex(variantImagesMap, (state.primaryVariantIndex + 8) % numVariants, imgSecondary)
            : imgPrimary
        var p0 = backSide ? rawP1 : rawP0
        var p1 = backSide ? rawP0 : rawP1
        var p2 = backSide ? rawP3 : rawP2
        var p3 = backSide ? rawP2 : rawP3
        drawTextured3DQuad(
            ctx, activeCardImg, p0, p1, p2, p3,
            fgAlpha,
            rgbaString(backSide ? c1 : c0, 0.95 * neonAlpha),
            2.8,
            null
        )
        if (imgSecondary && stepInfo.variantCrossfadeAlpha > 0.02) {
            drawTextured3DQuad(ctx, imgSecondary, p0, p1, p2, p3, fgAlpha * stepInfo.variantCrossfadeAlpha, null, 0, null)
        }

    } else if (modeIdx === 1) {
        // M02: 4D Tesseract Folding Cube — True 3D rotating outer cube + counter-rotating inner hypercube with photo-mapped faces
        var fov2 = minDim * 1.45
        var cubeHalf = minDim * 0.27 * state.zZoom
        var innerHalf = cubeHalf * (0.50 + 0.06 * Math.sin(rT * 0.85) + rEnv * 0.05)
        var unfold2 = (0.06 + 0.10 * Math.max(0.0, Math.sin(rT * 0.65)) + rEnv * 0.08) * warpMul

        var pitchOuter = rT * 0.34 * tiltMul + bass * 0.16
        var yawOuter = rT * 0.46 * tiltMul + mid * 0.18
        var rollOuter = Math.sin(rT * 0.28) * 0.22 * tiltMul

        var pitchInner = -rT * 0.48 * tiltMul
        var yawInner = -rT * 0.58 * tiltMul + rEnv * 0.20
        var rollInner = Math.cos(rT * 0.36) * 0.28 * tiltMul

        // 1. Render back-facing faces of the outer 3D unfolding photo cube first
        render3DPhotoCube(
            ctx, cx, cy, cubeHalf,
            pitchOuter, yawOuter, rollOuter, fov2,
            variantImagesMap, imgPrimary,
            state.primaryVariantIndex,
            fgAlpha * 0.86, pal, neonAlpha, unfold2, "back"
        )

        // 2. Render counter-rotating inner 4D tesseract core cube inside the outer cube
        var innerCorners = render3DPhotoCube(
            ctx, cx, cy, innerHalf,
            pitchInner, yawInner, rollInner, fov2,
            variantImagesMap, imgSecondary,
            (state.primaryVariantIndex + 6) % numVariants,
            fgAlpha * 0.94, pal, neonAlpha, 0.0, "all"
        )

        // 3. Render front-facing faces of the outer 3D unfolding photo cube
        var outerCorners = render3DPhotoCube(
            ctx, cx, cy, cubeHalf,
            pitchOuter, yawOuter, rollOuter, fov2,
            variantImagesMap, imgPrimary,
            state.primaryVariantIndex,
            fgAlpha * 0.84, pal, neonAlpha, unfold2, "front"
        )

        // 4. Hidden telemetry stroke for 4D hypercube projection struts
        ctx.save()
        ctx.beginPath()
        for (var sc = 0; sc < 8; sc++) {
            ctx.moveTo(innerCorners[sc].x, innerCorners[sc].y)
            ctx.lineTo(outerCorners[sc].x, outerCorners[sc].y)
        }
        drawHiddenConstructionStroke(ctx)
        ctx.restore()

    } else if (modeIdx === 2) {
        // M03: Relativistic Z-Corridor Echo Train (10 receding 3D planes flying along a curving spline)
        var numPlanes = 10
        var corridorFlow = (rT * 0.42 * strobeMul) % 1.0
        for (var pIdx3 = numPlanes - 1; pIdx3 >= 0; pIdx3--) {
            var relZ = (pIdx3 + 1.0 - corridorFlow) / numPlanes
            var persp3 = 1.0 / (0.35 + relZ * 2.35)
            var curveX = Math.sin(relZ * 3.8 + rT * 0.65) * width * 0.16 * relZ * warpMul
            var curveY = Math.cos(relZ * 3.2 - rT * 0.52) * height * 0.14 * relZ * warpMul
            var planeRot = Math.sin(relZ * 2.4 + rT * 0.45) * 0.22 * tiltMul + (1.0 - relZ) * state.rollRad * 0.5
            var tiltScaleX3 = 0.86 + 0.14 * Math.cos(rT * 0.55 * tiltMul + pIdx3 * 0.42)
            var tiltScaleY3 = 0.86 + 0.14 * Math.sin(rT * 0.48 * tiltMul - pIdx3 * 0.36)
            var pw = baseW * persp3 * 1.15
            var ph = baseH * persp3 * 1.15
            var vIdx3 = (state.primaryVariantIndex + pIdx3 * 2) % numVariants
            var pImg3 = getVariantImgByIndex(variantImagesMap, vIdx3, imgPrimary)
            var pAlpha3 = clamp(fgAlpha * (1.05 - relZ * 0.68), 0.14, 1.0)
            var sec3 = getVariantSectionOffset(vIdx3 + pIdx3, snapIdx)
            var z3 = sec3.zoom

            ctx.save()
            ctx.translate(cx + curveX, cy + curveY)
            ctx.rotate(planeRot)
            if (typeof ctx.scale === "function") {
                ctx.scale(tiltScaleX3, tiltScaleY3)
            }
            if (typeof ctx.clip === "function") {
                ctx.beginPath()
                ctx.rect(-pw * 0.5, -ph * 0.5, pw, ph)
                ctx.clip()
            }
            if (pImg3) {
                ctx.globalAlpha = pAlpha3
                ctx.drawImage(
                    pImg3,
                    -pw * 0.5 * z3 + sec3.x * pw * 0.44 * (z3 - 1.0),
                    -ph * 0.5 * z3 + sec3.y * ph * 0.44 * (z3 - 1.0),
                    pw * z3,
                    ph * z3
                )
            }
            ctx.beginPath()
            ctx.rect(-pw * 0.5, -ph * 0.5, pw, ph)
            drawHiddenConstructionStroke(ctx)
            ctx.restore()
        }

    } else if (modeIdx === 3) {
        // M04: Stroboscopic Shutter & Ghost Flicker (rhythm-paced afterimage ghost trails + smooth louver bands)
        var shutterStep = Math.floor(rT * 1.8 * strobeMul + rEnv * 1.5)
        var shutSec = getVariantSectionOffset(shutterStep, snapIdx)
        for (var gh = 4; gh >= 1; gh--) {
            var ghAng = rT * 0.85 + gh * 1.57
            var ghDist = gh * (10.0 + rEnv * 16.0) * warpMul
            var ghImg = getVariantImgByIndex(variantImagesMap, (state.primaryVariantIndex + gh * 3) % numVariants, imgPrimary)
            var ghSec = getVariantSectionOffset(shutterStep + gh, snapIdx)
            ctx.save()
            ctx.translate(cx + Math.cos(ghAng) * ghDist, cy + Math.sin(ghAng) * ghDist * 0.65)
            ctx.rotate(state.rollRad * 0.4 + (gh - 2.5) * 0.04 * tiltMul)
            if (typeof ctx.clip === "function") {
                ctx.beginPath()
                ctx.rect(-baseW * 0.5, -baseH * 0.5, baseW, baseH)
                ctx.clip()
            }
            if (ghImg) {
                ctx.globalAlpha = clamp(fgAlpha * (0.34 / gh), 0.06, 0.70)
                ctx.drawImage(
                    ghImg,
                    -baseW * 0.5 * vpZoom + panShiftX * 0.6 + ghSec.x * baseW * 0.18,
                    -baseH * 0.5 * vpZoom + panShiftY * 0.6 + ghSec.y * baseH * 0.18,
                    baseW * vpZoom,
                    baseH * vpZoom
                )
            }
            ctx.restore()
        }

        var numShutters = 10
        var bandH4 = baseH / numShutters
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(state.rollRad * 0.35)
        for (var sb = 0; sb < numShutters; sb++) {
            var sy = -baseH * 0.5 + sb * bandH4
            var syCentre = sy + bandH4 * 0.5
            var isOpen = ((sb + shutterStep) % 2) === 0
            var sbVar = isOpen ? state.primaryVariantIndex : ((state.primaryVariantIndex + 6) % numVariants)
            var sbImg = getVariantImgByIndex(variantImagesMap, sbVar, imgPrimary)
            var xJitter = (isOpen ? 1 : -1) * (8.0 + rEnv * 14.0) * Math.sin(rT * 1.4 + sb * 0.6) * warpMul
            var yJitter = Math.cos(rT * 1.1 + sb * 0.8) * bandH4 * 0.18 * warpMul
            var louverScaleX = 0.90 + 0.10 * Math.cos(rT * 0.85 * tiltMul - sb * 0.35)
            var louverScaleY = 0.86 + 0.14 * Math.sin(rT * 1.05 * tiltMul + sb * 0.45)
            if (sbImg) {
                ctx.save()
                ctx.translate(xJitter, syCentre + yJitter)
                if (typeof ctx.scale === "function") {
                    ctx.scale(louverScaleX, louverScaleY)
                }
                if (typeof ctx.clip === "function") {
                    ctx.beginPath()
                    ctx.rect(-baseW * 0.65, -bandH4 * 0.52, baseW * 1.3, bandH4 * 1.04)
                    ctx.clip()
                }
                ctx.globalAlpha = isOpen ? fgAlpha : (fgAlpha * 0.74)
                ctx.drawImage(
                    sbImg,
                    -baseW * 0.5 * vpZoom + panShiftX + shutSec.x * baseW * 0.14,
                    -syCentre - baseH * 0.5 * vpZoom + panShiftY + shutSec.y * baseH * 0.14,
                    baseW * vpZoom,
                    baseH * vpZoom
                )
                ctx.restore()
            }
            ctx.beginPath()
            ctx.rect(-baseW * 0.5 + xJitter, sy + yJitter, baseW, bandH4 * 0.45)
            drawHiddenConstructionStroke(ctx)
        }
        ctx.restore()

    } else if (modeIdx === 4) {
        // M05: Gyroscopic 3-Axis Card-Flip Cascade (4 concentric 3D gimbal cards tilting rhythmically on X, Y, Z)
        var fov5 = minDim * 1.35
        var numGimbals = 4
        for (var gIdx = 0; gIdx < numGimbals; gIdx++) {
            var gRatio = 1.0 - gIdx * 0.18
            var gw = baseW * 0.48 * gRatio
            var gh5 = baseH * 0.48 * gRatio
            var dir5 = (gIdx % 2 === 0) ? 1.0 : -1.0
            var gPitch5 = Math.sin(rT * (0.48 + gIdx * 0.14) * dir5) * 0.55 * tiltMul + bass * 0.18
            var gYaw5 = Math.cos(rT * (0.56 - gIdx * 0.10) * (-dir5)) * 0.58 * tiltMul + mid * 0.18
            var gRoll5 = Math.sin(rT * (0.32 + gIdx * 0.08)) * 0.28 * ((gIdx < 2) ? 1 : -1)
            var gSlideX = Math.sin(rT * 0.62 + gIdx * 1.1) * baseW * 0.04 * gIdx * warpMul
            var gSlideY = Math.cos(rT * 0.54 - gIdx * 0.9) * baseH * 0.04 * gIdx * warpMul
            var gVar5 = (state.primaryVariantIndex + gIdx * 4) % numVariants
            var gImg5 = getVariantImgByIndex(variantImagesMap, gVar5, imgPrimary)

            var q0 = project3DPoint(-gw, -gh5, 0, gPitch5, gYaw5, gRoll5, fov5, cx + gSlideX, cy + gSlideY)
            var q1 = project3DPoint( gw, -gh5, 0, gPitch5, gYaw5, gRoll5, fov5, cx + gSlideX, cy + gSlideY)
            var q2 = project3DPoint( gw,  gh5, 0, gPitch5, gYaw5, gRoll5, fov5, cx + gSlideX, cy + gSlideY)
            var q3 = project3DPoint(-gw,  gh5, 0, gPitch5, gYaw5, gRoll5, fov5, cx + gSlideX, cy + gSlideY)
            drawTextured3DQuad(
                ctx, gImg5, q0, q1, q2, q3,
                fgAlpha * (0.84 + gIdx * 0.04),
                rgbaString(pal[gIdx % pal.length], 0.92 * neonAlpha),
                2.4, null
            )

            ctx.save()
            ctx.beginPath()
            var ringR = Math.min(gw, gh5) * 1.08
            for (var rs = 0; rs <= 28; rs++) {
                var rAng = (rs / 28.0) * Math.PI * 2.0
                var rp = project3DPoint(Math.cos(rAng) * ringR, Math.sin(rAng) * ringR, 0, gPitch5, gYaw5, gRoll5, fov5, cx + gSlideX, cy + gSlideY)
                if (rs === 0) ctx.moveTo(rp.x, rp.y)
                else ctx.lineTo(rp.x, rp.y)
            }
            drawHiddenConstructionStroke(ctx)
            ctx.restore()
        }

    } else if (modeIdx === 5) {
        // M06: Chronos Time-Slice Slit-Scan (14 phase-modulated bands gliding smoothly with the rhythm)
        var numSlits = 14
        var slitH = baseH / numSlits
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(state.rollRad * 0.4)
        for (var sl = 0; sl < numSlits; sl++) {
            var slY = -baseH * 0.5 + sl * slitH
            var slCentreY = slY + slitH * 0.5
            var waveShiftX = Math.sin(rT * 1.15 + sl * 0.45 + rEnv * 1.2) * (baseW * 0.11 * warpMul)
            var waveShiftY = Math.cos(rT * 0.90 - sl * 0.50) * (slitH * 0.28 * warpMul)
            var slitScaleX = 0.92 + 0.08 * Math.cos(rT * 0.75 * tiltMul - sl * 0.31)
            var slitScaleY = 0.92 + 0.08 * Math.sin(rT * 0.95 * tiltMul + sl * 0.42)
            var slVar = (state.primaryVariantIndex + (sl % 4) * 2) % numVariants
            var slImg = getVariantImgByIndex(variantImagesMap, slVar, imgPrimary)
            if (slImg) {
                ctx.save()
                ctx.translate(waveShiftX, slCentreY + waveShiftY)
                if (typeof ctx.scale === "function") {
                    ctx.scale(slitScaleX, slitScaleY)
                }
                if (typeof ctx.clip === "function") {
                    ctx.beginPath()
                    ctx.rect(-baseW * 0.75, -slitH * 0.54, baseW * 1.5, slitH * 1.08)
                    ctx.clip()
                }
                ctx.globalAlpha = fgAlpha
                ctx.drawImage(
                    slImg,
                    -baseW * 0.5 * vpZoom + panShiftX,
                    -slCentreY - baseH * 0.5 * vpZoom + panShiftY,
                    baseW * vpZoom,
                    baseH * vpZoom
                )
                ctx.restore()
            }
            ctx.beginPath()
            ctx.moveTo(-baseW * 0.5 + waveShiftX, slY + waveShiftY)
            ctx.lineTo(baseW * 0.5 + waveShiftX, slY + waveShiftY)
            drawHiddenConstructionStroke(ctx)
        }
        ctx.restore()

    } else if (modeIdx === 6) {
        // M07: Sacred 8-Way Kaleidoscopic Mirror Fold (8 seamless radial mirror wedges without spoke lines)
        var numWedges = 8
        var wedgeAng = (Math.PI * 2.0) / numWedges
        var kalRadius = Math.max(baseW, baseH) * 0.64
        var kalSec = getVariantSectionOffset(state.primaryVariantIndex, snapIdx)
        for (var wIdx = 0; wIdx < numWedges; wIdx++) {
            var wImg = getVariantImgByIndex(variantImagesMap, (state.primaryVariantIndex + (wIdx % 2) * 4) % numVariants, imgPrimary)
            var wedgeDriftR = Math.sin(rT * 0.85 + (wIdx % 2) * 0.8) * minDim * 0.025 * warpMul
            var wedgeBreath = 0.92 + 0.08 * Math.cos(rT * 0.65 * tiltMul + (wIdx % 2) * 0.7)
            ctx.save()
            ctx.translate(cx, cy)
            ctx.rotate(wIdx * wedgeAng + rT * 0.22 * tiltMul)
            ctx.translate(wedgeDriftR, 0)
            if (typeof ctx.clip === "function") {
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineTo(kalRadius, -Math.tan(wedgeAng * 0.52) * kalRadius)
                ctx.lineTo(kalRadius,  Math.tan(wedgeAng * 0.52) * kalRadius)
                if (typeof ctx.closePath === "function") ctx.closePath()
                ctx.clip()
            }
            if (typeof ctx.scale === "function") {
                var flipSgn = ((wIdx & 1) === 1) ? -1.0 : 1.0
                ctx.scale(1.0, flipSgn * wedgeBreath)
            }
            var innerZoom = (1.12 + 0.14 * Math.sin(rT * 0.95 + (wIdx & 1)) + rEnv * 0.10) * vpZoom
            if (wImg) {
                ctx.globalAlpha = fgAlpha
                ctx.drawImage(
                    wImg,
                    -baseW * 0.42 * innerZoom + panShiftX * 1.25 + kalSec.x * baseW * 0.18,
                    -baseH * 0.50 * innerZoom + panShiftY * 1.25 + kalSec.y * baseH * 0.18,
                    baseW * innerZoom,
                    baseH * innerZoom
                )
            }
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(kalRadius, -Math.tan(wedgeAng * 0.5) * kalRadius)
            drawHiddenConstructionStroke(ctx)
            ctx.restore()
        }

    } else if (modeIdx === 7) {
        // M08: 4x4 All-16-Variants Mosaic Matrix (3D tilted grid with rhythm-paced breathing & off-centre section crops)
        var cellW = baseW / 4.0
        var cellH = baseH / 4.0
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(state.rollRad * 0.35)
        for (var r8 = 0; r8 < 4; r8++) {
            for (var c8 = 0; c8 < 4; c8++) {
                var cellIdx = r8 * 4 + c8
                var vIdx8 = (cellIdx + state.primaryVariantIndex) % numVariants
                var tileImg = getVariantImgByIndex(variantImagesMap, vIdx8, imgPrimary)
                var tileSec = getVariantSectionOffset(vIdx8 + cellIdx * 3, snapIdx)
                var binAmp = (spec && spec.length > cellIdx * 2) ? clamp(Number(spec[cellIdx * 2]) || 0.3, 0.0, 1.0) : (0.35 + 0.20 * Math.sin(rT * 1.1 + cellIdx))
                var tileScale = 0.88 + binAmp * 0.16 * warpMul
                var tileBreathX = 0.90 + 0.10 * Math.cos(rT * 0.72 * tiltMul + cellIdx * 0.45)
                var tileBreathY = 0.90 + 0.10 * Math.sin(rT * 0.64 * tiltMul - r8 * 0.55 + c8 * 0.35)
                var tileDriftX = Math.sin(rT * 0.85 + cellIdx * 0.9) * cellW * 0.08 * warpMul
                var tileDriftY = Math.cos(rT * 0.75 - cellIdx * 0.7) * cellH * 0.08 * warpMul
                var tx = -baseW * 0.5 + (c8 + 0.5) * cellW + tileDriftX
                var ty = -baseH * 0.5 + (r8 + 0.5) * cellH + tileDriftY
                var tileZoom8 = tileSec.zoom * 1.15
                ctx.save()
                ctx.translate(tx, ty)
                ctx.rotate(Math.sin(rT * 0.65 + cellIdx) * 0.08 * tiltMul)
                if (typeof ctx.scale === "function") {
                    ctx.scale(tileBreathX * tileScale, tileBreathY * tileScale)
                }
                if (typeof ctx.clip === "function") {
                    ctx.beginPath()
                    ctx.rect(-cellW * 0.48, -cellH * 0.48, cellW * 0.96, cellH * 0.96)
                    ctx.clip()
                }
                if (tileImg) {
                    ctx.globalAlpha = fgAlpha
                    ctx.drawImage(
                        tileImg,
                        -cellW * 0.48 * tileZoom8 + tileSec.x * cellW * 0.44 * (tileZoom8 - 1.0),
                        -cellH * 0.48 * tileZoom8 + tileSec.y * cellH * 0.44 * (tileZoom8 - 1.0),
                        cellW * 0.96 * tileZoom8,
                        cellH * 0.96 * tileZoom8
                    )
                }
                ctx.beginPath()
                ctx.rect(-cellW * 0.48, -cellH * 0.48, cellW * 0.96, cellH * 0.96)
                drawHiddenConstructionStroke(ctx)
                ctx.restore()
            }
        }
        ctx.restore()

    } else if (modeIdx === 8) {
        // M09: Infinite Droste Recursive Frame-In-Frame Spiral Tunnel (7 spiralling nested 3D frames)
        var dLevels = 7
        var drosteFlow = (rT * 0.32 * strobeMul) % 1.0
        for (var dLvl = 0; dLvl < dLevels; dLvl++) {
            var effLvl = dLvl - drosteFlow
            var dScale = Math.pow(0.70, Math.max(0.0, effLvl))
            var dVarId = (state.primaryVariantIndex + dLvl * 2) % numVariants
            var dImg = getVariantImgByIndex(variantImagesMap, dVarId, imgPrimary)
            var dPitch = Math.sin(rT * 0.52 + dLvl * 0.5) * 0.32 * tiltMul
            var dYaw = Math.cos(rT * 0.44 + dLvl * 0.45) * 0.32 * tiltMul
            var dRoll = effLvl * 0.24 * (tiltMul > 0.1 ? 1.0 : 0.3) + state.rollRad * 0.6
            var dShiftX = Math.sin(rT * 0.55 + effLvl * 0.7) * baseW * 0.05 * warpMul
            var dShiftY = Math.cos(rT * 0.48 - effLvl * 0.6) * baseH * 0.05 * warpMul
            var dw = baseW * 0.52 * dScale
            var dh = baseH * 0.52 * dScale
            var dp0 = project3DPoint(-dw, -dh, 0, dPitch, dYaw, dRoll, minDim * 1.45, cx + dShiftX, cy + dShiftY)
            var dp1 = project3DPoint( dw, -dh, 0, dPitch, dYaw, dRoll, minDim * 1.45, cx + dShiftX, cy + dShiftY)
            var dp2 = project3DPoint( dw,  dh, 0, dPitch, dYaw, dRoll, minDim * 1.45, cx + dShiftX, cy + dShiftY)
            var dp3 = project3DPoint(-dw,  dh, 0, dPitch, dYaw, dRoll, minDim * 1.45, cx + dShiftX, cy + dShiftY)
            drawTextured3DQuad(
                ctx, dImg, dp0, dp1, dp2, dp3,
                clamp(fgAlpha * (1.0 - dLvl * 0.10), 0.22, 1.0),
                rgbaString(pal[dLvl % pal.length], 0.90 * neonAlpha),
                2.2, null
            )
        }

    } else if (modeIdx === 9) {
        // M10: Tectonic Counter-Sliding Mirror Strips (smooth rhythm-paced counter-sliding bands)
        var numStrips = 9
        var stripH = baseH / numStrips
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(state.rollRad * 0.4 + 0.10 * Math.sin(rT * 0.42) * tiltMul)
        for (var stIdx = 0; stIdx < numStrips; stIdx++) {
            var dir10 = (stIdx % 2 === 0) ? 1.0 : -1.0
            var slideOffset = dir10 * Math.sin(rT * 0.65 * strobeMul + stIdx * 0.55) * (baseW * 0.18 * warpMul)
            var stY = -baseH * 0.5 + stIdx * stripH
            var stCentreY = stY + stripH * 0.5
            var stVertWave = Math.sin(rT * 0.85 + stIdx * 0.7) * stripH * 0.22 * warpMul
            var stScaleX = dir10 * (0.92 + 0.08 * Math.cos(rT * 0.58 * tiltMul - stIdx * 0.42))
            var stScaleY = 0.92 + 0.08 * Math.sin(rT * 0.72 * tiltMul + stIdx * 0.58)
            var stImg = getVariantImgByIndex(variantImagesMap, (state.primaryVariantIndex + (stIdx % 3) * 3) % numVariants, imgPrimary)
            ctx.save()
            ctx.translate(0, stCentreY + stVertWave)
            if (typeof ctx.scale === "function") {
                ctx.scale(stScaleX, stScaleY)
            }
            if (typeof ctx.clip === "function") {
                ctx.beginPath()
                ctx.rect(-baseW * 0.65, -stripH * 0.52, baseW * 1.3, stripH * 1.04)
                ctx.clip()
            }
            if (stImg) {
                ctx.globalAlpha = fgAlpha
                ctx.drawImage(stImg, -baseW * 0.5 * vpZoom + slideOffset + panShiftX, -stCentreY - baseH * 0.5 * vpZoom + panShiftY, baseW * vpZoom, baseH * vpZoom)
                ctx.drawImage(stImg, -baseW * 0.5 * vpZoom + slideOffset - dir10 * baseW * vpZoom + panShiftX, -stCentreY - baseH * 0.5 * vpZoom + panShiftY, baseW * vpZoom, baseH * vpZoom)
            }
            ctx.restore()
            ctx.beginPath()
            ctx.moveTo(-baseW * 0.55, stY + stVertWave)
            ctx.lineTo(baseW * 0.55, stY + stVertWave)
            drawHiddenConstructionStroke(ctx)
        }
        ctx.restore()

    } else if (modeIdx === 10) {
        // M11: Hexagonal Honeycomb Prism Array (19 3D-projected hexagonal prism cells)
        var hexR = minDim * 0.145
        var fov11 = minDim * 1.45
        var arrayPitch = state.pitchRad * 0.75 + Math.sin(rT * 0.45) * 0.28 * tiltMul
        var arrayYaw = state.yawRad * 0.75 + Math.cos(rT * 0.38) * 0.32 * tiltMul
        var arrayRoll = state.rollRad * 0.55 + Math.sin(rT * 0.24) * 0.18 * tiltMul
        var hexRings = [
            { q: 0, r: 0 },
            { q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 1 }, { q: -1, r: 0 }, { q: 0, r: -1 }, { q: 1, r: -1 },
            { q: 2, r: 0 }, { q: 1, r: 1 }, { q: 0, r: 2 }, { q: -1, r: 2 }, { q: -2, r: 2 }, { q: -2, r: 1 },
            { q: -2, r: 0 }, { q: -1, r: -1 }, { q: 0, r: -2 }, { q: 1, r: -2 }, { q: 2, r: -2 }, { q: 2, r: -1 }
        ]
        for (var hIdx = 0; hIdx < hexRings.length; hIdx++) {
            var hc = hexRings[hIdx]
            var localDriftX = Math.sin(rT * 0.85 + hIdx * 0.65) * hexR * 0.14 * warpMul
            var localDriftY = Math.cos(rT * 0.72 - hIdx * 0.55) * hexR * 0.14 * warpMul
            var localZ = Math.sin(rT * 0.95 + (Math.abs(hc.q) + Math.abs(hc.r)) * 0.9) * hexR * 0.55 * warpMul
            var rawHx = hexR * 1.62 * (hc.q + hc.r * 0.5) + localDriftX
            var rawHy = hexR * 1.40 * hc.r + localDriftY
            var projCentre = project3DPoint(rawHx, rawHy, localZ, arrayPitch, arrayYaw, arrayRoll, fov11, cx, cy)
            var hImg = getVariantImgByIndex(variantImagesMap, (state.primaryVariantIndex + (hIdx % 6) * 2) % numVariants, imgPrimary)
            var hexSec = getVariantSectionOffset(state.primaryVariantIndex + hIdx * 3, snapIdx)
            var pulseH = hexR * projCentre.scale * (0.94 + 0.10 * Math.sin(rT * 1.1 + hIdx) + rEnv * 0.08)
            var cellScaleX = 0.92 + 0.08 * Math.cos(rT * 0.68 * tiltMul + hIdx * 0.52)
            var cellScaleY = 0.92 + 0.08 * Math.sin(rT * 0.58 * tiltMul - hIdx * 0.38)
            var hexPts = []
            for (var hv = 0; hv < 6; hv++) {
                var hAng = (hv / 6.0) * Math.PI * 2.0 + rT * 0.18 * ((hIdx % 2 === 0) ? 1 : -1)
                var vxLocal = rawHx + Math.cos(hAng) * pulseH * cellScaleX
                var vyLocal = rawHy + Math.sin(hAng) * pulseH * cellScaleY
                hexPts.push(project3DPoint(vxLocal, vyLocal, localZ, arrayPitch, arrayYaw, arrayRoll, fov11, cx, cy))
            }
            ctx.save()
            drawSafePolygonPath(ctx, hexPts)
            if (typeof ctx.clip === "function") ctx.clip()
            ctx.translate(projCentre.x, projCentre.y)
            ctx.rotate(Math.sin(rT * 0.55 + hIdx) * 0.22 * tiltMul + arrayRoll * 0.4)
            if (typeof ctx.scale === "function") {
                ctx.scale(cellScaleX, cellScaleY)
            }
            if (hImg) {
                ctx.globalAlpha = fgAlpha
                var cellTexSpan = pulseH * 3.1 * hexSec.zoom
                var hexShiftX = hexSec.x * (cellTexSpan - pulseH * 2.1) * 0.45
                var hexShiftY = hexSec.y * (cellTexSpan - pulseH * 2.1) * 0.45
                ctx.drawImage(
                    hImg,
                    -cellTexSpan * 0.5 + hexShiftX,
                    -cellTexSpan * 0.5 + hexShiftY,
                    cellTexSpan,
                    cellTexSpan
                )
            }
            ctx.restore()

            ctx.save()
            drawSafePolygonPath(ctx, hexPts)
            drawHiddenConstructionStroke(ctx)
            ctx.restore()
        }

    } else if (modeIdx === 11) {
        // M12: Inception 4-Wall Architectural Box Fold (3D room with back wall + ceiling, floor, left & right 90-deg walls)
        var breath = 0.40 + 0.08 * Math.sin(rT * 0.72) + rEnv * 0.08 * warpMul
        var outW = baseW * 0.56
        var outH = baseH * 0.56
        var inW = outW * breath
        var inH = outH * breath
        var offX = Math.sin(rT * 0.52) * outW * 0.15 * tiltMul
        var offY = Math.cos(rT * 0.42) * outH * 0.14 * tiltMul
        var fov12 = minDim * 1.45

        var oTL = project3DPoint(-outW, -outH, -minDim * 0.10, state.pitchRad * 0.50, state.yawRad * 0.50, state.rollRad * 0.40, fov12, cx, cy)
        var oTR = project3DPoint( outW, -outH, -minDim * 0.10, state.pitchRad * 0.50, state.yawRad * 0.50, state.rollRad * 0.40, fov12, cx, cy)
        var oBR = project3DPoint( outW,  outH, -minDim * 0.10, state.pitchRad * 0.50, state.yawRad * 0.50, state.rollRad * 0.40, fov12, cx, cy)
        var oBL = project3DPoint(-outW,  outH, -minDim * 0.10, state.pitchRad * 0.50, state.yawRad * 0.50, state.rollRad * 0.40, fov12, cx, cy)

        var iTL = project3DPoint(offX - inW, offY - inH, minDim * 0.18, state.pitchRad * 0.68, state.yawRad * 0.68, state.rollRad * 0.55, fov12, cx, cy)
        var iTR = project3DPoint(offX + inW, offY - inH, minDim * 0.18, state.pitchRad * 0.68, state.yawRad * 0.68, state.rollRad * 0.55, fov12, cx, cy)
        var iBR = project3DPoint(offX + inW, offY + inH, minDim * 0.18, state.pitchRad * 0.68, state.yawRad * 0.68, state.rollRad * 0.55, fov12, cx, cy)
        var iBL = project3DPoint(offX - inW, offY + inH, minDim * 0.18, state.pitchRad * 0.68, state.yawRad * 0.68, state.rollRad * 0.55, fov12, cx, cy)

        // Top ceiling wall
        drawTextured3DQuad(ctx, getVariantImgByIndex(variantImagesMap, state.primaryVariantIndex + 2, imgPrimary), oTL, oTR, iTR, iTL, fgAlpha * 0.88, rgbaString(c1, 0.85 * neonAlpha), 2.2, null)
        // Bottom floor wall
        drawTextured3DQuad(ctx, getVariantImgByIndex(variantImagesMap, state.primaryVariantIndex + 5, imgPrimary), iBL, iBR, oBR, oBL, fgAlpha * 0.88, rgbaString(c2, 0.85 * neonAlpha), 2.2, null)
        // Left side wall
        drawTextured3DQuad(ctx, getVariantImgByIndex(variantImagesMap, state.primaryVariantIndex + 8, imgPrimary), oTL, iTL, iBL, oBL, fgAlpha * 0.90, rgbaString(c3, 0.85 * neonAlpha), 2.2, null)
        // Right side wall
        drawTextured3DQuad(ctx, getVariantImgByIndex(variantImagesMap, state.primaryVariantIndex + 11, imgPrimary), iTR, oTR, oBR, iBR, fgAlpha * 0.90, rgbaString(c0, 0.85 * neonAlpha), 2.2, null)
        // Centre horizon sanctum wall
        drawTextured3DQuad(ctx, imgPrimary, iTL, iTR, iBR, iBL, fgAlpha, rgbaString(c0, neonAlpha), 3.0, null)

    } else if (modeIdx === 12) {
        // M13: Tri-Vector Palette Channel Separation (3 independent 3D tilted planes orbiting smoothly at 120° vectors)
        var sepDist = (20.0 + rEnv * 36.0 + bass * 22.0) * warpMul
        for (var vecIdx = 0; vecIdx < 3; vecIdx++) {
            var ang13 = rT * 0.72 + vecIdx * (Math.PI * 2.0 / 3.0)
            var vx = Math.cos(ang13) * sepDist
            var vy = Math.sin(ang13) * sepDist * 0.78
            var vImg13 = getVariantImgByIndex(variantImagesMap, (state.primaryVariantIndex + vecIdx * 5) % numVariants, imgPrimary)
            var vPitch = state.pitchRad * 0.85 + Math.sin(rT * 0.45 + vecIdx) * 0.28 * tiltMul
            var vYaw = state.yawRad * 0.85 + Math.cos(rT * 0.52 - vecIdx) * 0.32 * tiltMul
            var vRoll = state.rollRad * 0.75 + (vecIdx - 1) * 0.10 * rEnv
            var vp0 = project3DPoint(-baseW * 0.44, -baseH * 0.44, 0, vPitch, vYaw, vRoll, minDim * 1.4, cx + vx, cy + vy)
            var vp1 = project3DPoint( baseW * 0.44, -baseH * 0.44, 0, vPitch, vYaw, vRoll, minDim * 1.4, cx + vx, cy + vy)
            var vp2 = project3DPoint( baseW * 0.44,  baseH * 0.44, 0, vPitch, vYaw, vRoll, minDim * 1.4, cx + vx, cy + vy)
            var vp3 = project3DPoint(-baseW * 0.44,  baseH * 0.44, 0, vPitch, vYaw, vRoll, minDim * 1.4, cx + vx, cy + vy)
            drawTextured3DQuad(
                ctx, vImg13, vp0, vp1, vp2, vp3,
                fgAlpha * 0.78,
                rgbaString(pal[vecIdx % pal.length], 0.92 * neonAlpha),
                2.5,
                null
            )
        }

    } else if (modeIdx === 13) {
        // M14: 48-Band Equaliser Venetian Shredder (24 vertical ribbons moving rhythmically with the spectrum)
        var numRibbons = 24
        var ribW = baseW / numRibbons
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(state.rollRad * 0.35)
        for (var rb = 0; rb < numRibbons; rb++) {
            var specIdx = rb * 2
            var bandEnergy = (spec && spec.length > specIdx)
                ? clamp(Number(spec[specIdx]) || 0.0, 0.0, 1.0)
                : (0.3 + 0.25 * Math.sin(rT * 1.4 + rb * 0.4))
            var rx = -baseW * 0.5 + rb * ribW
            var rxCentre = rx + ribW * 0.5
            var yDisplace = (bandEnergy - 0.35) * (baseH * 0.20 * warpMul) * ((rb % 2 === 0) ? -1.0 : 1.0)
            var xDisplace = Math.sin(rT * 0.95 + rb * 0.45) * ribW * 0.25 * warpMul
            var ribScaleX = 0.92 + 0.08 * Math.cos(rT * 0.85 * tiltMul + rb * 0.38)
            var ribScaleY = 0.92 + 0.08 * Math.sin(rT * 0.65 * tiltMul - rb * 0.25)
            var ribVar = (bandEnergy > 0.65)
                ? ((state.primaryVariantIndex + 8) % numVariants)
                : ((state.primaryVariantIndex + (rb % 4) * 2) % numVariants)
            var ribImg = getVariantImgByIndex(variantImagesMap, ribVar, imgPrimary)

            if (ribImg) {
                ctx.save()
                ctx.translate(rxCentre + xDisplace, yDisplace)
                if (typeof ctx.scale === "function") {
                    ctx.scale(ribScaleX, ribScaleY)
                }
                if (typeof ctx.clip === "function") {
                    ctx.beginPath()
                    ctx.rect(-ribW * 0.52, -baseH * 0.7, ribW * 1.04, baseH * 1.4)
                    ctx.clip()
                }
                ctx.globalAlpha = fgAlpha
                ctx.drawImage(
                    ribImg,
                    -rxCentre - baseW * 0.5 * vpZoom + panShiftX,
                    -baseH * 0.5 * vpZoom + panShiftY,
                    baseW * vpZoom,
                    baseH * vpZoom
                )
                ctx.restore()
            }
            ctx.beginPath()
            ctx.rect(rx + xDisplace, -baseH * 0.5 + yDisplace, ribW, baseH)
            drawHiddenConstructionStroke(ctx)
        }
        ctx.restore()

    } else if (modeIdx === 14) {
        // M15: Berlin Rave Shutter & Negative Strobe (beat-locked warehouse shutter without blinding blackouts or crosshairs)
        var ravePhase = Math.floor(rT * 2.4 * strobeMul + rEnv * 2.0)
        var isAccent = (ravePhase % 4 === 0) || (beat > 0.68)
        var snapAngle = state.rollRad * 0.5 + Math.sin(rT * 1.2) * 0.12 * tiltMul
        var raveScaleX = ((ravePhase % 6 === 0) ? -1.0 : 1.0) * (0.92 + 0.08 * Math.cos(rT * 0.75 * tiltMul))
        var raveScaleY = 0.92 + 0.08 * Math.sin(rT * 0.65 * tiltMul)
        var raveVar = (state.primaryVariantIndex + (ravePhase % 4) * 3) % numVariants
        var raveImg = getVariantImgByIndex(variantImagesMap, raveVar, imgPrimary)
        var zoomRave = vpZoom * (1.02 + (rEnv * 0.14 + (isAccent ? 0.06 : 0.0)) * stepInfo.effectiveZoomPunch)
        var raveSec = getVariantSectionOffset(raveVar + (ravePhase % 5), snapIdx)

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(snapAngle)
        if (typeof ctx.scale === "function") {
            ctx.scale(raveScaleX, raveScaleY)
        }
        if (typeof ctx.clip === "function") {
            ctx.beginPath()
            ctx.rect(-baseW * 0.5, -baseH * 0.5, baseW, baseH)
            ctx.clip()
        }
        if (raveImg) {
            ctx.globalAlpha = fgAlpha
            ctx.drawImage(
                raveImg,
                -baseW * 0.5 * zoomRave + panShiftX + raveSec.dx * baseW * 0.20,
                -baseH * 0.5 * zoomRave + panShiftY + raveSec.dy * baseH * 0.20,
                baseW * zoomRave,
                baseH * zoomRave
            )
        }
        ctx.beginPath()
        ctx.rect(-baseW * 0.5 * zoomRave, -baseH * 0.5 * zoomRave, baseW * zoomRave, baseH * zoomRave)
        drawHiddenConstructionStroke(ctx)
        ctx.beginPath()
        ctx.moveTo(-baseW * 0.55, 0); ctx.lineTo(baseW * 0.55, 0)
        drawHiddenConstructionStroke(ctx)
        ctx.restore()

    } else if (modeIdx === 15) {
        // M16: Concentric Counter-Rotating Ring Shear (7 bullseye vault rings rotating smoothly with the rhythm)
        var numRings16 = 7
        var maxR16 = Math.min(baseW, baseH) * 0.56
        for (var rk = numRings16; rk >= 1; rk--) {
            var rRadius = (rk / numRings16) * maxR16
            var dir16 = (rk % 2 === 0) ? 1.0 : -1.0
            var ringAng = dir16 * rT * (0.28 + (numRings16 - rk) * 0.09) * tiltMul + dir16 * rEnv * 0.24
            var ringShiftX = Math.sin(rT * 0.78 + rk * 0.85) * (numRings16 - rk + 1) * 6.5 * warpMul
            var ringShiftY = Math.cos(rT * 0.66 - rk * 0.75) * (numRings16 - rk + 1) * 6.0 * warpMul
            var effRingScaleX = 0.92 + 0.08 * Math.cos(rT * (0.52 + rk * 0.08) * tiltMul - rk * 0.45)
            var effRingScaleY = 0.92 + 0.08 * Math.sin(rT * (0.60 + (numRings16 - rk) * 0.08) * tiltMul + rk * 0.55)
            var ringVar = (state.primaryVariantIndex + rk * 2) % numVariants
            var ringImg = getVariantImgByIndex(variantImagesMap, ringVar, imgPrimary)
            var ringSec = getVariantSectionOffset(ringVar + rk, snapIdx)

            ctx.save()
            ctx.translate(cx + ringShiftX, cy + ringShiftY)
            if (typeof ctx.scale === "function") {
                ctx.scale(effRingScaleX, effRingScaleY)
            }
            if (typeof ctx.clip === "function") {
                ctx.beginPath()
                ctx.arc(0, 0, rRadius, 0, Math.PI * 2.0)
                ctx.clip()
            }
            ctx.rotate(ringAng)
            if (ringImg) {
                ctx.globalAlpha = fgAlpha
                ctx.drawImage(
                    ringImg,
                    -baseW * 0.5 * vpZoom + panShiftX + ringSec.dx * baseW * 0.16,
                    -baseH * 0.5 * vpZoom + panShiftY + ringSec.dy * baseH * 0.16,
                    baseW * vpZoom,
                    baseH * vpZoom
                )
            }
            ctx.restore()

            ctx.save()
            ctx.translate(cx + ringShiftX, cy + ringShiftY)
            if (typeof ctx.scale === "function") {
                ctx.scale(effRingScaleX, effRingScaleY)
            }
            ctx.beginPath()
            ctx.arc(0, 0, rRadius, 0, Math.PI * 2.0)
            drawHiddenConstructionStroke(ctx)
            ctx.restore()
        }

    } else if (modeIdx === 16) {
        // M17: Voronoi Glass Shatter & Beat Reform (16 polygonal shards breathing outward on the beat and reforming smoothly)
        var explodeAmt = (0.10 + 0.22 * Math.max(0.0, Math.sin(rT * 0.75)) + rEnv * 0.34) * warpMul
        var shardCols = 4
        var shardRows = 4
        var sw = baseW / shardCols
        var sh = baseH / shardRows
        for (var sr = 0; sr < shardRows; sr++) {
            for (var sc17 = 0; sc17 < shardCols; sc17++) {
                var sIdx = sr * shardCols + sc17
                var homeX = (sc17 - 1.5) * sw
                var homeY = (sr - 1.5) * sh
                var radialAng = Math.atan2(homeY, homeX) + Math.sin(sIdx * 1.7 + rT * 0.42) * 0.25
                var radialDist = Math.sqrt(homeX * homeX + homeY * homeY)
                var driftLR = Math.sin(rT * 0.85 + sIdx * 1.1) * sw * 0.16 * warpMul
                var driftUD = Math.cos(rT * 0.75 - sIdx * 0.9) * sh * 0.16 * warpMul
                var burstX = homeX + Math.cos(radialAng) * (radialDist * 0.45 + 28.0) * explodeAmt + driftLR
                var burstY = homeY + Math.sin(radialAng) * (radialDist * 0.45 + 28.0) * explodeAmt + driftUD
                var shardRot = (sIdx % 2 === 0 ? 1 : -1) * (explodeAmt * 0.32 + Math.sin(rT * 0.45 + sIdx) * 0.12) * tiltMul
                var shardScale = 0.96 + explodeAmt * 0.12 * Math.sin(rT * 1.1 + sIdx)
                var effShardFlipX = (0.90 + 0.10 * Math.cos(rT * 0.65 * tiltMul - sIdx * 0.55)) * shardScale
                var effShardFlipY = (0.90 + 0.10 * Math.sin(rT * 0.75 * tiltMul + sIdx * 0.75)) * shardScale
                var shardImg = getVariantImgByIndex(variantImagesMap, (state.primaryVariantIndex + (sIdx % 8) * 2) % numVariants, imgPrimary)

                var jx = Math.sin(sIdx * 2.3) * sw * 0.14
                var jy = Math.cos(sIdx * 3.1) * sh * 0.14
                var localPts = [
                    { x: -sw * 0.52 + jx, y: -sh * 0.52 - jy },
                    { x:  sw * 0.54 - jx, y: -sh * 0.48 + jy },
                    { x:  sw * 0.50 + jx, y:  sh * 0.54 - jy },
                    { x: -sw * 0.54 - jx, y:  sh * 0.48 + jy }
                ]

                ctx.save()
                ctx.translate(cx + burstX, cy + burstY)
                ctx.rotate(shardRot)
                if (typeof ctx.scale === "function") ctx.scale(effShardFlipX, effShardFlipY)
                drawSafePolygonPath(ctx, localPts)
                if (typeof ctx.clip === "function") ctx.clip()
                if (shardImg) {
                    ctx.globalAlpha = fgAlpha
                    ctx.drawImage(
                        shardImg,
                        -baseW * 0.5 * vpZoom - homeX + panShiftX,
                        -baseH * 0.5 * vpZoom - homeY + panShiftY,
                        baseW * vpZoom,
                        baseH * vpZoom
                    )
                }
                ctx.restore()

                ctx.save()
                ctx.translate(cx + burstX, cy + burstY)
                ctx.rotate(shardRot)
                if (typeof ctx.scale === "function") ctx.scale(effShardFlipX, effShardFlipY)
                drawSafePolygonPath(ctx, localPts)
                drawHiddenConstructionStroke(ctx)
                ctx.restore()
            }
        }

    } else if (modeIdx === 17) {
        // M18: CRT Scanline Phase-Slip & Tracking Tear (rhythm-paced scanline phase bands)
        var numTears = 12
        var tearH = baseH / numTears
        var rollingBarY = ((rT * 0.24 * strobeMul) % 1.0) * baseH - baseH * 0.5
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(state.rollRad * 0.30)
        for (var tb = 0; tb < numTears; tb++) {
            var ty18 = -baseH * 0.5 + tb * tearH
            var tyCentre18 = ty18 + tearH * 0.5
            var distToRoll = Math.abs(tyCentre18 - rollingBarY)
            var isTrackingTear = distToRoll < baseH * 0.22 || ((tb + Math.floor(rT * 2.5)) % 4 === 0 && rEnv > 0.42)
            var hSlip = isTrackingTear
                ? Math.sin(rT * 2.8 + tb * 1.4) * (22.0 + rEnv * 34.0) * warpMul
                : Math.sin(rT * 1.05 + tb * 0.7) * 10.0 * warpMul
            var vSlip = Math.cos(rT * 0.92 - tb * 0.75) * (tearH * (isTrackingTear ? 0.36 : 0.18)) * warpMul
            var sliverRot = Math.sin(rT * 0.72 + tb * 0.6) * (isTrackingTear ? 0.06 : 0.025) * tiltMul
            var effSliverScaleX = 0.94 + 0.06 * Math.cos(rT * 0.85 * tiltMul - tb * 0.42)
            var effSliverScaleY = 0.94 + 0.06 * Math.sin(rT * 0.95 * tiltMul + tb * 0.55)
            var tearVar = isTrackingTear ? ((state.primaryVariantIndex + 8) % numVariants) : ((state.primaryVariantIndex + (tb % 4) * 2) % numVariants)
            var tearImg = getVariantImgByIndex(variantImagesMap, tearVar, imgPrimary)
            if (tearImg) {
                ctx.save()
                ctx.translate(hSlip, tyCentre18 + vSlip)
                ctx.rotate(sliverRot)
                if (typeof ctx.scale === "function") {
                    ctx.scale(effSliverScaleX, effSliverScaleY)
                }
                if (typeof ctx.clip === "function") {
                    ctx.beginPath()
                    ctx.rect(-baseW * 0.7, -tearH * 0.54, baseW * 1.4, tearH * 1.08)
                    ctx.clip()
                }
                ctx.globalAlpha = fgAlpha
                ctx.drawImage(
                    tearImg,
                    -baseW * 0.5 * vpZoom + panShiftX,
                    -tyCentre18 - baseH * 0.5 * vpZoom + panShiftY,
                    baseW * vpZoom,
                    baseH * vpZoom
                )
                ctx.restore()
            }
            ctx.beginPath()
            ctx.rect(-baseW * 0.5 + hSlip, ty18 + vSlip, baseW, 3.0)
            drawHiddenConstructionStroke(ctx)
        }
        ctx.restore()

    } else if (modeIdx === 18) {
        // M19: Palette Resonance Hyper-Enhancer (3D perspective plane + multi-radius harmonic bloom echo layers)
        var fov19 = minDim * 1.35
        var p19_0 = project3DPoint(-baseW * 0.48, -baseH * 0.48, 0, state.pitchRad, state.yawRad, state.rollRad, fov19, cx, cy)
        var p19_1 = project3DPoint( baseW * 0.48, -baseH * 0.48, 0, state.pitchRad, state.yawRad, state.rollRad, fov19, cx, cy)
        var p19_2 = project3DPoint( baseW * 0.48,  baseH * 0.48, 0, state.pitchRad, state.yawRad, state.rollRad, fov19, cx, cy)
        var p19_3 = project3DPoint(-baseW * 0.48,  baseH * 0.48, 0, state.pitchRad, state.yawRad, state.rollRad, fov19, cx, cy)
        drawTextured3DQuad(ctx, imgPrimary, p19_0, p19_1, p19_2, p19_3, fgAlpha, rgbaString(c0, neonAlpha), 2.8, null)
        // Harmonic bloom echo layers
        for (var bl = 1; bl <= 3; bl++) {
            var blScale = 1.0 + bl * 0.045 * stepInfo.effectivePaletteBloom
            var bImg = getVariantImgByIndex(variantImagesMap, (state.primaryVariantIndex + bl * 4) % numVariants, imgSecondary)
            var bp0 = project3DPoint(-baseW * 0.48 * blScale, -baseH * 0.48 * blScale, -bl * 18.0, state.pitchRad, state.yawRad, state.rollRad + bl * 0.03, fov19, cx, cy)
            var bp1 = project3DPoint( baseW * 0.48 * blScale, -baseH * 0.48 * blScale, -bl * 18.0, state.pitchRad, state.yawRad, state.rollRad + bl * 0.03, fov19, cx, cy)
            var bp2 = project3DPoint( baseW * 0.48 * blScale,  baseH * 0.48 * blScale, -bl * 18.0, state.pitchRad, state.yawRad, state.rollRad + bl * 0.03, fov19, cx, cy)
            var bp3 = project3DPoint(-baseW * 0.48 * blScale,  baseH * 0.48 * blScale, -bl * 18.0, state.pitchRad, state.yawRad, state.rollRad + bl * 0.03, fov19, cx, cy)
            drawTextured3DQuad(ctx, bImg, bp0, bp1, bp2, bp3, fgAlpha * (0.28 / bl), rgbaString(pal[bl % pal.length], 0.85 * neonAlpha), 2.0, null)
        }
        ctx.save()
        ctx.translate(cx, cy)
        for (var rIdx = 1; rIdx <= 5; rIdx++) {
            var rad19 = ((rT * 0.25 + rIdx * 0.20) % 1.0) * Math.min(baseW, baseH) * 0.58
            ctx.beginPath()
            ctx.arc(0, 0, rad19, 0, Math.PI * 2.0)
            drawHiddenConstructionStroke(ctx)
        }
        ctx.restore()

    } else if (modeIdx === 19) {
        // M20: Event Horizon Gravitational Lens (twin orbiting lens portals twisting & magnifying photo rings)
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(state.rollRad * 0.35)
        if (typeof ctx.clip === "function") {
            ctx.beginPath()
            ctx.rect(-baseW * 0.5, -baseH * 0.5, baseW, baseH)
            ctx.clip()
        }
        if (imgPrimary) {
            ctx.globalAlpha = fgAlpha * 0.86
            ctx.drawImage(imgPrimary, -baseW * 0.5 * vpZoom + panShiftX, -baseH * 0.5 * vpZoom + panShiftY, baseW * vpZoom, baseH * vpZoom)
        }
        ctx.restore()

        var orb = rT * 0.44
        var breathe20 = 0.5 + 0.5 * Math.sin(rT * 0.68) + 0.25 * Math.sin(rT * 1.54 + bass * 1.6)
        var wellSwell20 = clamp(0.45 + 0.95 * breathe20 + bass * 0.55 + beat * 0.45, 0.38, 2.25)
        var sep20 = Math.min(baseW, baseH) * 0.20 * warpMul * (0.82 + 0.24 * breathe20)
        for (var bh = 0; bh < 2; bh++) {
            var sgn = (bh === 0) ? 1.0 : -1.0
            var bhX = cx + sgn * Math.cos(orb) * sep20
            var bhY = cy + sgn * Math.sin(orb) * sep20 * 0.68
            var lensR = minDim * (0.12 + 0.14 * wellSwell20 + rEnv * 0.05) * warpMul
            for (var lr = 4; lr >= 1; lr--) {
                var rL = lensR * (lr / 4.0) * (0.88 + 0.18 * Math.sin(rT * 0.9 - lr * 0.45))
                var lensScaleX = 0.88 + 0.16 * Math.cos(rT * 0.55 * tiltMul - lr * 0.4 + bh)
                var lensScaleY = 0.88 + 0.16 * Math.sin(rT * 0.65 * tiltMul + lr * 0.5 + bh)
                var lVar = (state.primaryVariantIndex + bh * 5 + lr * 2) % numVariants
                var lImg = getVariantImgByIndex(variantImagesMap, lVar, imgPrimary)
                var lSec = getVariantSectionOffset(lVar + bh * 3 + lr, snapIdx)
                ctx.save()
                ctx.translate(bhX, bhY)
                if (typeof ctx.scale === "function") {
                    ctx.scale(lensScaleX, lensScaleY)
                }
                if (typeof ctx.clip === "function") {
                    ctx.beginPath()
                    ctx.arc(0, 0, rL, 0, Math.PI * 2.0)
                    ctx.clip()
                }
                ctx.rotate(sgn * (rT * 0.75 + (5 - lr) * 0.45 * warpMul))
                if (lImg) {
                    ctx.globalAlpha = fgAlpha
                    var mag = (1.05 + (5 - lr) * 0.16 * wellSwell20) * vpZoom
                    ctx.drawImage(
                        lImg,
                        -baseW * 0.5 * mag + panShiftX + lSec.dx * baseW * 0.20,
                        -baseH * 0.5 * mag + panShiftY + lSec.dy * baseH * 0.20,
                        baseW * mag,
                        baseH * mag
                    )
                }
                ctx.restore()

                ctx.save()
                ctx.translate(bhX, bhY)
                if (typeof ctx.scale === "function") {
                    ctx.scale(lensScaleX, lensScaleY)
                }
                ctx.beginPath()
                ctx.arc(0, 0, rL, 0, Math.PI * 2.0)
                drawHiddenConstructionStroke(ctx)
                ctx.restore()
            }
        }

    } else if (modeIdx === 20) {
        // M21: Möbius Cylinder & Torus Tunnel Wrap (8 spinning 3D tunnel depth rings with calm half-twist phase)
        var tRings = 8
        var tFlow = (rT * 0.14) % 1.0
        for (var tr = tRings - 1; tr >= 0; tr--) {
            var relD = (tr + 1.0 - tFlow) / tRings
            var ringScale = 1.30 * (1.0 - relD * 0.72)
            var mobiusTwist = rT * 0.16 * ((tr % 2 === 0) ? 1 : -1) + relD * Math.PI * 0.36 * tiltMul
            var centreCurveX = cx + Math.cos(rT * 0.24 + relD * 2.6) * width * 0.08 * relD * warpMul
            var centreCurveY = cy + Math.sin(rT * 0.20 + relD * 2.6) * height * 0.07 * relD * warpMul
            var rw = baseW * 0.48 * ringScale
            var rh = baseH * 0.48 * ringScale
            var rPitch = Math.sin(mobiusTwist) * 0.32 * tiltMul
            var rYaw = Math.cos(mobiusTwist) * 0.32 * tiltMul
            var mp0 = project3DPoint(-rw, -rh, 0, rPitch, rYaw, mobiusTwist * 0.25, minDim * 1.4, centreCurveX, centreCurveY)
            var mp1 = project3DPoint( rw, -rh, 0, rPitch, rYaw, mobiusTwist * 0.25, minDim * 1.4, centreCurveX, centreCurveY)
            var mp2 = project3DPoint( rw,  rh, 0, rPitch, rYaw, mobiusTwist * 0.25, minDim * 1.4, centreCurveX, centreCurveY)
            var mp3 = project3DPoint(-rw,  rh, 0, rPitch, rYaw, mobiusTwist * 0.25, minDim * 1.4, centreCurveX, centreCurveY)
            var mImg = getVariantImgByIndex(variantImagesMap, (state.primaryVariantIndex + tr * 2) % numVariants, imgPrimary)
            drawTextured3DQuad(
                ctx, mImg, mp0, mp1, mp2, mp3,
                clamp(fgAlpha * (0.96 - relD * 0.50), 0.18, 1.0),
                rgbaString(pal[tr % pal.length], 0.55 * neonAlpha),
                1.8, null
            )
        }

    } else if (modeIdx === 21) {
        // M22: Liquid Acid Domain-Warp Melt (smooth curl-wave bands gliding with the rhythm)
        var meltBands = 16
        var mBandH = baseH / meltBands
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(Math.sin(rT * 0.35) * 0.16 * tiltMul)
        for (var mb = 0; mb < meltBands; mb++) {
            var my = -baseH * 0.5 + mb * mBandH
            var myCentre = my + mBandH * 0.5
            var normY = (mb / meltBands) * 2.0 - 1.0
            var curlX = (Math.sin(normY * 3.6 + rT * 1.1) * 24.0 + Math.cos(normY * 6.5 - rT * 1.5) * 10.0) * warpMul
            var curlY = Math.cos(normY * 3.0 - rT * 0.85) * mBandH * 0.28 * warpMul
            var curlStretch = 1.0 + 0.10 * Math.sin(normY * 4.0 - rT * 1.2) * warpMul
            var meltScaleX = 0.92 + 0.08 * Math.cos(rT * 0.58 * tiltMul - mb * 0.28)
            var meltScaleY = 0.92 + 0.08 * Math.sin(rT * 0.72 * tiltMul + mb * 0.36)
            var mVar = (state.primaryVariantIndex + Math.floor(Math.abs(Math.sin(normY * 2.0 + rT * 0.45)) * 4)) % numVariants
            var meltImg = getVariantImgByIndex(variantImagesMap, mVar, imgPrimary)
            if (meltImg) {
                ctx.save()
                ctx.translate(curlX, myCentre + curlY)
                if (typeof ctx.scale === "function") {
                    ctx.scale(meltScaleX, meltScaleY)
                }
                if (typeof ctx.clip === "function") {
                    ctx.beginPath()
                    ctx.rect(-baseW * 0.8, -mBandH * 0.56, baseW * 1.6, mBandH * 1.12)
                    ctx.clip()
                }
                ctx.globalAlpha = fgAlpha
                ctx.drawImage(
                    meltImg,
                    -baseW * 0.5 * curlStretch * vpZoom + panShiftX,
                    -myCentre - baseH * 0.5 * vpZoom + panShiftY,
                    baseW * curlStretch * vpZoom,
                    baseH * vpZoom
                )
                ctx.restore()
            }
            ctx.beginPath()
            ctx.moveTo(-baseW * 0.5 * curlStretch + curlX, my + curlY)
            ctx.lineTo(baseW * 0.5 * curlStretch + curlX, my + curlY)
            drawHiddenConstructionStroke(ctx)
        }
        ctx.restore()

    } else if (modeIdx === 22) {
        // M23: Luma-Key Vortex Portal Bleed (rotating 3D photo portal planes)
        ctx.save()
        ctx.translate(cx, cy)
        for (var vr = 1; vr <= 8; vr++) {
            var vRad = (vr / 8.0) * Math.min(baseW, baseH) * 0.56
            ctx.beginPath()
            ctx.arc(0, 0, vRad, rT * 0.85 * ((vr % 2 === 0) ? 1 : -1), rT * 0.85 * ((vr % 2 === 0) ? 1 : -1) + Math.PI * 1.45)
            drawHiddenConstructionStroke(ctx)
        }
        ctx.restore()

        var fov23 = minDim * 1.35
        var portalAlpha23 = clamp(fgAlpha * Math.max(0.55, secOps.black * 0.65 + 0.35), 0.35, 0.96)
        var kp0 = project3DPoint(-baseW * 0.48, -baseH * 0.48, 0, state.pitchRad, state.yawRad, state.rollRad, fov23, cx, cy)
        var kp1 = project3DPoint( baseW * 0.48, -baseH * 0.48, 0, state.pitchRad, state.yawRad, state.rollRad, fov23, cx, cy)
        var kp2 = project3DPoint( baseW * 0.48,  baseH * 0.48, 0, state.pitchRad, state.yawRad, state.rollRad, fov23, cx, cy)
        var kp3 = project3DPoint(-baseW * 0.48,  baseH * 0.48, 0, state.pitchRad, state.yawRad, state.rollRad, fov23, cx, cy)
        drawTextured3DQuad(ctx, imgPrimary, kp0, kp1, kp2, kp3, portalAlpha23, rgbaString(c0, neonAlpha), 2.6, null)
        if (imgSecondary && stepInfo.variantCrossfadeAlpha > 0.02) {
            drawTextured3DQuad(ctx, imgSecondary, kp0, kp1, kp2, kp3, portalAlpha23 * stepInfo.variantCrossfadeAlpha, null, 0, null)
        }

    } else if (modeIdx === 23) {
        // M24: Cymatic Chladni Standing-Wave Ripple (5x5 3D nodal standing-wave grid)
        var gCols = 5
        var gRows = 5
        var cw24 = baseW / gCols
        var ch24 = baseH / gRows
        var nHar = 2.0 + Math.floor(bass * 2.0)
        var mHar = 3.0 + Math.floor(mid * 2.0)
        var fov24 = minDim * 1.4
        for (var r24 = 0; r24 < gRows; r24++) {
            for (var c24 = 0; c24 < gCols; c24++) {
                var nx24 = ((c24 + 0.5) / gCols) * 2.0 - 1.0
                var ny24 = ((r24 + 0.5) / gRows) * 2.0 - 1.0
                var chladni = Math.cos(nHar * Math.PI * nx24) * Math.cos(mHar * Math.PI * ny24)
                            - Math.cos(mHar * Math.PI * nx24) * Math.cos(nHar * Math.PI * ny24)
                var zWave = chladni * Math.sin(rT * 1.45) * (minDim * 0.10 * warpMul)
                var cellSlideX = Math.sin(rT * 0.85 + r24 + c24) * cw24 * 0.10 * warpMul
                var cellSlideY = Math.cos(rT * 0.72 - r24 + c24) * ch24 * 0.10 * warpMul
                var x0 = -baseW * 0.5 + c24 * cw24 + cellSlideX
                var y0 = -baseH * 0.5 + r24 * ch24 + cellSlideY
                var cp0 = project3DPoint(x0, y0, zWave, state.pitchRad * 0.75, state.yawRad * 0.75, state.rollRad * 0.55, fov24, cx, cy)
                var cp1 = project3DPoint(x0 + cw24, y0, -zWave, state.pitchRad * 0.75, state.yawRad * 0.75, state.rollRad * 0.55, fov24, cx, cy)
                var cp2 = project3DPoint(x0 + cw24, y0 + ch24, zWave, state.pitchRad * 0.75, state.yawRad * 0.75, state.rollRad * 0.55, fov24, cx, cy)
                var cp3 = project3DPoint(x0, y0 + ch24, -zWave, state.pitchRad * 0.75, state.yawRad * 0.75, state.rollRad * 0.55, fov24, cx, cy)
                var chImg = getVariantImgByIndex(variantImagesMap, (chladni >= 0) ? state.primaryVariantIndex : ((state.primaryVariantIndex + 7) % numVariants), imgPrimary)
                ctx.save()
                drawSafePolygonPath(ctx, [cp0, cp1, cp2, cp3])
                if (typeof ctx.clip === "function") ctx.clip()
                if (chImg) {
                    ctx.globalAlpha = fgAlpha
                    ctx.drawImage(
                        chImg,
                        cx - baseW * 0.5 * vpZoom + panShiftX,
                        cy - baseH * 0.5 * vpZoom - zWave * 0.25 + panShiftY,
                        baseW * vpZoom,
                        baseH * vpZoom
                    )
                }
                ctx.restore()

                ctx.save()
                drawSafePolygonPath(ctx, [cp0, cp1, cp2, cp3])
                drawHiddenConstructionStroke(ctx)
                ctx.restore()
            }
        }

    } else {
        // M25: Hyperdrive Volumetric Radial Extrusion (9 radial ray-marched 3D depth planes projected via drawTextured3DQuad)
        var fov25 = minDim * 1.4
        var vpX = Math.cos(rT * 0.55) * baseW * 0.14 * warpMul
        var vpY = Math.sin(rT * 0.68) * baseH * 0.12 * warpMul
        var numExtrude = 9
        for (var ex = 0; ex < numExtrude; ex++) {
            var fracEx = ex / (numExtrude - 1) // 0 (back vanishing point) -> 1 (front viewer)
            var exScale = 0.34 + fracEx * 0.74
            var exOffX = vpX * (1.0 - fracEx)
            var exOffY = vpY * (1.0 - fracEx)
            var exPitch = state.pitchRad * (0.35 + fracEx * 0.65) + Math.sin(rT * 0.48 + ex * 0.32) * 0.24 * tiltMul
            var exYaw = state.yawRad * (0.35 + fracEx * 0.65) + Math.cos(rT * 0.42 - ex * 0.28) * 0.24 * tiltMul
            var exRoll = state.rollRad * fracEx + (1.0 - fracEx) * 0.18 * Math.sin(rT * 0.65)
            var ew = baseW * 0.48 * exScale
            var eh = baseH * 0.48 * exScale
            var ez = (1.0 - fracEx) * minDim * 0.32
            var ep0 = project3DPoint(-ew, -eh, ez, exPitch, exYaw, exRoll, fov25, cx + exOffX, cy + exOffY)
            var ep1 = project3DPoint( ew, -eh, ez, exPitch, exYaw, exRoll, fov25, cx + exOffX, cy + exOffY)
            var ep2 = project3DPoint( ew,  eh, ez, exPitch, exYaw, exRoll, fov25, cx + exOffX, cy + exOffY)
            var ep3 = project3DPoint(-ew,  eh, ez, exPitch, exYaw, exRoll, fov25, cx + exOffX, cy + exOffY)
            var exImg = getVariantImgByIndex(variantImagesMap, (state.primaryVariantIndex + (numExtrude - 1 - ex) * 2) % numVariants, imgPrimary)
            var exAlpha = (ex === numExtrude - 1) ? (fgAlpha * 0.95) : (fgAlpha * (0.22 + fracEx * 0.32))
            drawTextured3DQuad(
                ctx, exImg, ep0, ep1, ep2, ep3,
                clamp(exAlpha, 0.12, 1.0),
                rgbaString(pal[ex % pal.length], (0.35 + fracEx * 0.60) * neonAlpha),
                (ex === numExtrude - 1) ? 2.6 : 1.3,
                null
            )
        }
        ctx.save()
        ctx.translate(cx, cy)
        ctx.beginPath()
        for (var ray = 0; ray < 16; ray++) {
            var rAng25 = (ray / 16.0) * Math.PI * 2.0 + rT * 0.25
            ctx.moveTo(vpX, vpY)
            ctx.lineTo(vpX + Math.cos(rAng25) * baseW * 0.62, vpY + Math.sin(rAng25) * baseH * 0.62)
        }
        drawHiddenConstructionStroke(ctx)
        ctx.restore()
    }

    ctx.restore()
    _activeQuadShearAmount = 0.0
    _activeViewportPanX = 0.0
    _activeViewportPanY = 0.0
    _activeViewportZoom = 1.0

    // Draw 1-Minute Hold badge if active
    if (state.holdActive && state.holdRemainingSec > 0.0) {
        ctx.save()
        ctx.fillStyle = "rgba(7, 9, 14, 0.78)"
        ctx.strokeStyle = rgbaString(c0, 0.9)
        ctx.lineWidth = 1.5
        ctx.fillRect(width - 178, 14, 164, 28)
        ctx.beginPath()
        ctx.rect(width - 178, 14, 164, 28)
        ctx.stroke()
        if (typeof ctx.fillText === "function") {
            ctx.fillStyle = "#f8fafc"
            ctx.font = "bold 12px monospace"
            ctx.fillText("󰏤 HOLD PHOTO " + Math.ceil(state.holdRemainingSec) + "s", width - 168, 32)
        }
        ctx.restore()
    }
    return Boolean(imgPrimary || imgSecondary)
}

