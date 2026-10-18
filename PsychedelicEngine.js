.pragma library

// PsychedelicEngine.js — 3-Layer Configurable Psychedelic & Classic Nightclub Visualiser Engine
//
// Engineered for locked 60–120 FPS buttery-smooth rendering in Qt6 QQuickContext2D:
//   - Adaptive Gain Controller (AGC) + dual-band sub-bass/snare onset beat detector
//   - Colour-bucketed path batching (< 2ms CPU frame time at 1080p)
//   - Layer #1: Background & Iterative Framebuffer Feedback Engine (MilkDrop/Geiss/G-Force/Cthugha)
//   - Layer #2: 12 Psychedelic & Classic PC Nightclub Visualiser Modes (MilkDrop, AVS SuperScope,
//               G-Force WaveShape, Cthugha Rave Scope, Jeff Minter VLM, Mandelbulb/Julia, DMT Lotus,
//               Spacetime Quasar, Alien Mycelium, Cyber Matrix, 4D Sacred Polytopes, Strange Attractors)
//   - Layer #3: Autonomous Album Art Dismantle, Evolution & Rebuild Engine (6 choreographies +
//               permanent track-progress evolution + Omarchy `/usr/bin/ttfx` keyframe morphing)

var LAYER1_MODES = [
    "MilkDrop Liquid Feedback Warp",
    "G-Force Polar FlowField",
    "Cthugha Rave Flame",
    "Relativistic Starfield",
    "Atari Battlezone Landscape",
    "Death Star Trench Run",
    "Obsidian Deep Void",
    "TRON 1982 Grid",
    "SynthGrid Outrun Canyon",
    "Demoscene Polygon Tunnel",
    "Tempest & Asteroids 3D"
]

var MODE_NAMES = [
    "MilkDrop Geiss Cathedral",
    "AVS 3D SuperScope",
    "G-Force WaveShape Vortex",
    "Cthugha Rave Oscilloscope",
    "Minter VLM Neon Lattice",
    "Julia & Fractal Orbit",
    "DMT Lotus Hyperspace",
    "Spacetime Quasar Grid",
    "Bioluminescent Mycelium",
    "Cyber Matrix Tunnel",
    "4D Sacred Polytope",
    "Chaos Strange Attractor",
    "3D Sierpinski Fractal"
]

var LAYER2_MODES = MODE_NAMES

var LAYER3_MODES = [
    "Shatter & Evolving Rebuild",
    "Cellular Automata Growth",
    "Blackhole Accretion & Nova",
    "Tectonic Shear & Acid Melt",
    "Swarm Flocking Vortex",
    "Omarchy TTE Keyframe Morph",
    "Liquid Acid Wave",
    "3D Cylinder Banner",
    "Rubber Accordion",
    "3D Perspective Crawl",
    "Chromatic Mirror",
    "Fisheye Sonic Lens"
]

var LAYER3_TEXT_STYLES = [
    "Cyber Techno",
    "Psychedelic Liquid",
    "Rave Laser Stencil",
    "Dance Chrome",
    "Club LED Wall",
    "Acid Glitch IDM",
    "Psytrance UV Glow",
    "Berlin Brutalist",
    "Holographic Sci-Fi HUD",
    "Oscilloscope Vector Beam",
    "3D Isometric Extrude",
    "Plasma Arc Tesla",
    "Y2K Iridescent Mercury",
    "Demoscene Copperbars",
    "Bioluminescent Mycelium",
    "Quantum Matrix Datastream"
]
var LAYER3_TEXT_STYLE_NAMES = LAYER3_TEXT_STYLES

var LAYER3_CYLINDER_DIRS = [
    "L→R",
    "R→L",
    "U→D",
    "D→U",
    "360° Spin CW",
    "360° Spin CCW"
]

var LAYER3_COLOUR_MODES = [
    "Style Signature",
    "Line Palette",
    "Duotone Contrast",
    "Audio Spectrum",
    "Prism Wave",
    "Letter Alternate"
]
var SHORT_LAYER3_COLOUR_MODES = [
    "Style",
    "Line Pal",
    "Duotone",
    "EQ Spec",
    "Prism",
    "Letter"
]

var LAYER4_MODES = [
    "Cyber Tunnel",
    "Spiral Vortex",
    "Twin Ripple",
    "Binary Twin Vortex",
    "Butterchurn Liquid Mesh",
    "projectM Fluid Preset",
    "Magic Liquid Waves",
    "VS Synth Matrix",
    "VSXu Fluid Ribbons",
    "TouchDesigner Curl Fluid",
    "Metaball Liquid Chrome",
    "Wormhole Bend",
    "Moiré Dual Grids",
    "Mandelbrot Deep Dive",
    "Gargantua Blackhole",
    "Voronoi Bio-Cells"
]

var LAYER4_WALL_PATTERNS = [
    "Rings",
    "Hex Grid",
    "Ribbons",
    "Matrix",
    "Strobe"
]

var LAYER1_MODE_NAMES = LAYER1_MODES
var LAYER2_MODE_NAMES = LAYER2_MODES
var LAYER3_MODE_NAMES = LAYER3_MODES
var LAYER4_MODE_NAMES = LAYER4_MODES

var BACKDROP_MODES = [
    "Harmonic Ripple Flower",
    "Stained-Glass Rose",
    "Volumetric Plasma",
    "Julia Seahorse Fractal",
    "Raymarched Shape Field",
    "Cosmic Aura Pulse",
    "Relativistic Event Horizon",
    "Voronoi Bio-Cells"
]
var BACKDROP_MODE_NAMES = BACKDROP_MODES

var LAYER1_EQ_STYLES = [
    "Skyline Mountain",
    "LED Bars & Peaks",
    "Mirrored Reflection",
    "3D Waterfall Ridges",
    "Sun Rays",
    "Centre Twin Wave",
    "Horizon Spotlights",
    "3D Sonic Orb",
    "3D Torus Reactor",
    "Cymatic Chladni",
    "3D Helix Vortex",
    "Tesla Plasma Arcs",
    "Tralis Voxel City",
    "Aurora Curtains",
    "DNA Helix Beam",
    "Ferrofluid Lake"
]

var LAYER1_EQ_LAYOUTS = [
    "Bottom ▲ (Up)",
    "Mid ▲ (Up)",
    "Mid ▼ (Down)",
    "Top ▼ (Down)"
]

var LAYER1_EQ_DAMPING = [
    "Snappy",
    "Smooth",
    "Peak-Hold"
]

var LAYER1_SHAPE_STYLES = [
    "Battlezone Tanks",
    "Star Wars Craft",
    "TRON Recognizers",
    "Sacred Polygons",
    "Merkaba Starbursts",
    "Sonic Boom Rings"
]

var TRACK_ARC_MODES = [
    "Dynamic Audio Arc",
    "Song Climax Arc (75% Peak)",
    "Progressive Dismantle (0→100%)",
    "Progressive Rebuild (0→100%)",
    "Quarter-Track Chapters (25/50/75%)"
]

var TTFX_EFFECTS = [
    "waves",
    "blackhole",
    "beams",
    "crumble",
    "swarm",
    "rings",
    "fireworks",
    "matrix"
]

var SYMMETRY_OPTIONS = [1, 2, 4, 6, 8, 12, 16]

var DEFAULT_STATEMENTS = [
    "WE ARE THE FREQUENCIES",
    "RESONANCE IS ARCHITECTURE",
    "SOUND BECOMES GEOMETRY",
    "ENTER THE VORTEX",
    "ACID IN THE CIRCUITRY",
    "SYNTHESISE THE INFINITE",
    "PULSE OF THE UNDERGROUND",
    "SUBWOOFER CATHEDRAL",
    "VOLTAGE AND VELVET",
    "BEYOND THE EVENT HORIZON",
    "ANALOGUE SOUL DIGITAL VOID",
    "HYPNOTIC MOMENTUM",
    "DANCE IN THE VECTOR FIELD",
    "FUTURE PRIMITIVE RAVE",
    "PHOSPHOR DREAMS IN 60HZ",
    "NO BORDERS IN THE BASSLINE",
    "LUMINOUS FREQUENCIES",
    "TRANSMITTING FROM THE DEEP",
    "KINETIC EUPHORIA",
    "CYBERNETIC ECSTASY",
    "EVERY BEAT REWRITES SPACE",
    "MODULATE REALITY",
    "ELECTRIC MYCELIUM",
    "HIGH VOLTAGE SERENITY",
    "ECHOES OF TOMORROW",
    "THE FLOOR IS LIQUID LIGHT",
    "WAREHOUSE TELEPATHY",
    "OSCILLATE FOREVER",
    "INFINITE FEEDBACK LOOP",
    "LASER THROUGH THE FOG",
    "CHROMATIC TRANSCENDENCE",
    "SYNTHESIS IS LIBERATION",
    "DEEP SPACE SUBHARMONICS",
    "VECTOR HORIZON",
    "PURE WAVEFORM ALCHEMY",
    "NIGHT DRIVE TO INFINITY",
    "NEURAL RAVE SYNCHRONISATION",
    "SONIC HOLOGRAPHY",
    "FRACTAL MEMORY",
    "RHYTHM OF THE COSMOS",
    "SUBTERRANEAN SUNRISE",
    "ZERO GRAVITY GROOVE",
    "PHANTOM OSCILLATOR",
    "ULTRA VIOLET VELOCITY",
    "SIGNAL IN THE NOISE",
    "SILICON AND STARLIGHT",
    "TIME DISSOLVES IN REVERB",
    "POLYPHONIC REBELLION",
    "BASS IS THE FOUNDATION",
    "LIQUID CHROME HORIZON",
    "PERPETUAL MOTION ENGINE",
    "THE MACHINE BREATHES MUSIC",
    "ASTRAL PROJECTION",
    "HYPERDIMENSIONAL DUB",
    "ACID HOUSE FOREVER",
    "DEMOSCENE FOREVER",
    "GREETINGS TO ALL NIGHT OWLS",
    "STAY IN THE FREQUENCY",
    "WE NEVER STOP DANCING",
    "LIGHT SPEED ARPEGGIO"
]

var PALETTE_NAMES = [
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
    "Prismatic Kaleidoscope"
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

var BRAILLE_MUTANTS = ["⣿", "⣷", "⣯", "⣟", "⡿", "⢿", "⣻", "⣽", "⣾", "⢕", "⢝", "⢕", "✦", "◈", "⟡", "░", "▒", "▓", "█"]
var varBRAILLE_MUTANTS = BRAILLE_MUTANTS

// Precomputed 4096-entry Fast Trig Lookup Table for inner-loop 3D projection & wave evaluation
var LUT_SIZE = 4096
var LUT_MASK = 4095
var LUT_FACTOR = 4096.0 / (Math.PI * 2.0)
var SIN_LUT = []
var COS_LUT = []
for (var _lutIdx = 0; _lutIdx < LUT_SIZE; _lutIdx++) {
    var _lutAng = (_lutIdx / LUT_SIZE) * Math.PI * 2.0
    SIN_LUT.push(Math.sin(_lutAng))
    COS_LUT.push(Math.cos(_lutAng))
}

function fastSin(rad) {
    return SIN_LUT[(Math.floor(rad * LUT_FACTOR) & LUT_MASK)]
}

function fastCos(rad) {
    return COS_LUT[(Math.floor(rad * LUT_FACTOR) & LUT_MASK)]
}

function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v)
}

function lerp(a, b, t) {
    return a + (b - a) * t
}

function smoothstep(edge0, edge1, x) {
    if (edge0 > edge1) {
        return 1.0 - smoothstep(edge1, edge0, x)
    }
    var t = clamp((x - edge0) / Math.max(0.00001, edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)
}

function hslToHex(h, s, l, a) {
    h = ((h % 360) + 360) % 360
    s = clamp(s, 0, 1)
    l = clamp(l, 0, 1)
    var c = (1 - Math.abs(2 * l - 1)) * s
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    var m = l - c / 2
    var r = 0, g = 0, b = 0
    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    var ri = Math.round((r + m) * 255)
    var gi = Math.round((g + m) * 255)
    var bi = Math.round((b + m) * 255)
    if (a !== undefined && a < 0.999) {
        return "rgba(" + ri + "," + gi + "," + bi + "," + clamp(a, 0, 1).toFixed(3) + ")"
    }
    return "rgb(" + ri + "," + gi + "," + bi + ")"
}

function colourWithAlpha(col, alpha) {
    var a = clamp(alpha, 0, 1).toFixed(3)
    if (!col) return "rgba(110,231,183," + a + ")"
    if (typeof col === "object" && col.r !== undefined) {
        return "rgba(" + Math.round(col.r * 255) + "," + Math.round(col.g * 255) + "," + Math.round(col.b * 255) + "," + a + ")"
    }
    var s = col.toString()
    if (s.charAt(0) === "#" && s.length >= 7) {
        var offset = s.length === 9 ? 3 : 1
        var r = parseInt(s.slice(offset, offset + 2), 16)
        var g = parseInt(s.slice(offset + 2, offset + 4), 16)
        var b = parseInt(s.slice(offset + 4, offset + 6), 16)
        return "rgba(" + r + "," + g + "," + b + "," + a + ")"
    }
    if (s.indexOf("rgb(") === 0) {
        return "rgba(" + s.slice(4, -1) + "," + a + ")"
    }
    return s
}

function parseRgbTriplet(col) {
    if (!col) return [110, 231, 183]
    if (typeof col === "object" && col.r !== undefined) {
        return [Math.round(col.r * 255), Math.round(col.g * 255), Math.round(col.b * 255)]
    }
    var s = col.toString()
    if (s.charAt(0) === "#" && s.length >= 7) {
        var offset = s.length === 9 ? 3 : 1
        return [
            parseInt(s.slice(offset, offset + 2), 16) || 0,
            parseInt(s.slice(offset + 2, offset + 4), 16) || 0,
            parseInt(s.slice(offset + 4, offset + 6), 16) || 0
        ]
    }
    if (s.indexOf("rgb(") === 0) {
        var parts = s.slice(4, -1).split(",")
        if (parts.length >= 3) {
            return [parseInt(parts[0], 10) || 0, parseInt(parts[1], 10) || 0, parseInt(parts[2], 10) || 0]
        }
    }
    return [110, 231, 183]
}

function mixHexColours(colA, colB, t) {
    var f = clamp(Number(t) || 0, 0, 1)
    var a = parseRgbTriplet(colA)
    var b = parseRgbTriplet(colB)
    var r = Math.round(a[0] + (b[0] - a[0]) * f)
    var g = Math.round(a[1] + (b[1] - a[1]) * f)
    var bl = Math.round(a[2] + (b[2] - a[2]) * f)
    return "rgb(" + r + "," + g + "," + bl + ")"
}

function rgbToHsl(col) {
    var rgb = parseRgbTriplet(col)
    var r = (rgb[0] || 0) / 255
    var g = (rgb[1] || 0) / 255
    var b = (rgb[2] || 0) / 255
    var maxC = Math.max(r, g, b)
    var minC = Math.min(r, g, b)
    var h = 0
    var s = 0
    var l = (maxC + minC) * 0.5
    if (maxC !== minC) {
        var d = maxC - minC
        s = l > 0.5 ? d / (2 - maxC - minC) : d / (maxC + minC)
        if (maxC === r) {
            h = ((g - b) / d + (g < b ? 6 : 0)) * 60
        } else if (maxC === g) {
            h = ((b - r) / d + 2) * 60
        } else {
            h = ((r - g) / d + 4) * 60
        }
    }
    return [((h % 360) + 360) % 360, clamp(s, 0, 1), clamp(l, 0, 1)]
}

function hueDistanceDeg(h1, h2) {
    var diff = Math.abs((((h1 - h2) % 360) + 540) % 360 - 180)
    return diff
}

function deriveDistinctTypographyTriad(pal, baseIdx, slotIdx, anchorIdx) {
    var palLen = Math.max(1, pal ? pal.length : 1)
    var rawCh = pal[baseIdx % palLen] || "#38BDF8"
    var rawAlt = pal[(baseIdx + 2) % palLen] || "#F43F5E"
    var rawAcc = pal[(baseIdx + 4) % palLen] || "#FDE047"
    var rawAnchor = pal[(anchorIdx !== undefined ? anchorIdx : 0) % palLen] || rawCh

    var hslAnchor = rgbToHsl(rawAnchor)
    var hslCh = rgbToHsl(rawCh)
    var hslAlt = rgbToHsl(rawAlt)
    var hslAcc = rgbToHsl(rawAcc)

    var hCh = hslCh[0]
    var sCh = clamp(Math.max(hslCh[1], 0.88), 0.82, 1.0)
    var lTargets = [0.76, 0.62, 0.68, 0.72]
    var lTarget = lTargets[slotIdx % lTargets.length]
    var lCh = clamp(hslCh[2] * 0.35 + lTarget * 0.65, 0.56, 0.86)

    // If this line/character swatch is too close in hue to the anchor swatch (monochromatic palette),
    // rotate hue by 68 deg per slot so adjacent lines/letters remain unmistakably distinct.
    if (slotIdx > 0 && hueDistanceDeg(hCh, hslAnchor[0]) < 52) {
        hCh = (hslAnchor[0] + slotIdx * 68) % 360
    }

    // Ensure the 3D extrusion / outer rim (colAlt) has >= 95 deg hue separation from the letter face (colCh)
    var hAlt = hslAlt[0]
    if (hueDistanceDeg(hAlt, hCh) < 95) {
        hAlt = (hCh + 125) % 360
    }
    var sAlt = clamp(Math.max(hslAlt[1], 0.90), 0.84, 1.0)
    var lAlt = clamp(hslAlt[2] * 0.35 + 0.54 * 0.65, 0.48, 0.66)

    // Ensure the highlight / third bevel (colAcc) is separated from both colCh and colAlt
    var hAcc = hslAcc[0]
    if (hueDistanceDeg(hAcc, hCh) < 85 || hueDistanceDeg(hAcc, hAlt) < 65) {
        hAcc = (hCh + 225) % 360
    }
    var sAcc = clamp(Math.max(hslAcc[1], 0.92), 0.86, 1.0)
    var lAcc = clamp(hslAcc[2] * 0.35 + 0.68 * 0.65, 0.58, 0.82)

    return {
        colCh: hslToHex(hCh, sCh, lCh),
        colAlt: hslToHex(hAlt, sAlt, lAlt),
        colAcc: hslToHex(hAcc, sAcc, lAcc)
    }
}


function buildPalette(theme, hueShift, paletteIndex) {
    var palIdx = ((Number(paletteIndex) || 0) % PALETTES.length + PALETTES.length) % PALETTES.length
    var preset = PALETTES[palIdx] || PALETTES[0]
    var h = Number(hueShift) || 0
    return [
        preset[0],
        preset[1],
        preset[2],
        preset[3],
        preset[4],
        preset[5],
        (theme && theme.accent) ? theme.accent.toString() : "#6ee7b7",
        (theme && theme.urgent) ? theme.urgent.toString() : "#f472b6",
        hslToHex(h, 0.96, 0.58),
        hslToHex(h + 45, 0.96, 0.60),
        hslToHex(h + 95, 0.95, 0.58),
        hslToHex(h + 145, 0.94, 0.60),
        hslToHex(h + 195, 0.96, 0.62),
        hslToHex(h + 245, 0.95, 0.60),
        hslToHex(h + 295, 0.96, 0.62),
        hslToHex(h + 335, 0.98, 0.68)
    ]
}

function createState() {
    var smooth = []
    var peaks = []
    var waveHist = []
    for (var i = 0; i < 64; i++) {
        smooth.push(0.04)
        peaks.push(0.06)
    }
    for (var wh = 0; wh < 18; wh++) {
        var snap = []
        for (var b = 0; b < 32; b++) snap.push(0.05)
        waveHist.push({
            bands: snap,
            bass: 0.05,
            mid: 0.05,
            high: 0.05,
            hue: (wh * 20) % 360
        })
    }

    var eqRidgeHist = []
    for (var rh = 0; rh < 24; rh++) {
        var rBins = []
        for (var rb = 0; rb < 36; rb++) rBins.push(0.05)
        eqRidgeHist.push({
            bins: rBins,
            bass: 0.05,
            energy: 0.05,
            hue: (rh * 15) % 360
        })
    }

    var stars = []
    for (var s = 0; s < 140; s++) {
        stars.push({
            x: (Math.random() - 0.5) * 2.2,
            y: (Math.random() - 0.5) * 2.2,
            z: Math.random() * 0.95 + 0.05,
            pz: 1.0,
            hue: (s * 29) % 360
        })
    }

    var shockwaves = []
    var flames = []
    for (var f = 0; f < 48; f++) {
        flames.push({
            x: f / 47.0,
            y: Math.random(),
            vx: (Math.random() - 0.5) * 0.04,
            vy: 0.25 + Math.random() * 0.35,
            energy: 0.2,
            hueOffset: (f * 15) % 360
        })
    }

    return {
        t: 0.0,
        l1Time: 0.0,
        eqSpinTime: 0.0,
        backdropTime: 0.0,
        driftTime: 0.0,
        zoomTime: 0.0,
        tunnelTime: 0.0,
        matrixTime: 0.0,
        phase: 0.0,
        hueShift: 0.0,
        rollingPeak: 120.0,
        silentFrames: 0,
        smoothBands: smooth,
        peakBands: peaks,
        waveHistory: waveHist,
        eqRidgeHistory: eqRidgeHist,
        eqRidgeStepIdx: 0,
        waveform: [],
        bass: 0.0,
        mid: 0.0,
        high: 0.0,
        bassSmooth: 0.0,
        midSmooth: 0.0,
        highSmooth: 0.0,
        energySmooth: 0.0,
        beatSmooth: 0.0,
        bassFast: 0.08,
        bassSlow: 0.08,
        midFast: 0.08,
        midSlow: 0.08,
        trebFast: 0.08,
        trebSlow: 0.08,
        bassAtt: 1.0,
        midAtt: 1.0,
        trebAtt: 1.0,
        energy: 0.0,
        kickFast: 0.0,
        kickSlow: 0.0,
        snareFast: 0.0,
        snareSlow: 0.0,
        beatPulse: 0.0,
        beatFlash: 0.0,
        beatCooldown: 0.0,
        beatCount: 0,
        rotPolarity: 1.0,
        avsHarmonics: { m: 3, n: 5, k: 2, twist: 1.4, style: 0 },
        avsTarget: { m: 3, n: 5, k: 2, twist: 1.4, style: 0 },
        stars: stars,
        shockwaves: shockwaves,
        flames: flames,
        artSourceKey: "",
        artCells: [],
        artRows: 0,
        artCols: 0,
        artBurst: 0.0,
        clearFeedbackFrames: 0,
        lastL1: true,
        lastL2: true,
        lastL3: true,
        lastFrameMs: 0.0,
        tronHeading: 0,
        tronYaw: 0.0,
        tronYawVel: 0.0,
        tronBikeYaw: 0.0,
        tronTargetYaw: 0.0,
        tronTurnRoll: 0.0,
        tronX: 0.0,
        tronZ: 0.0,
        tronCamX: 0.0,
        tronCamZ: -290.0,
        tronTurnTimer: 1.85,
        tronTurnSeq: 0,
        tronTrail: [[0.0, -400.0], [0.0, 0.0]],
        tronRivalHeading: 0,
        tronRivalYaw: 0.0,
        tronRivalTargetYaw: 0.0,
        tronRivalX: 160.0,
        tronRivalZ: 80.0,
        tronRivalTurnTimer: 1.10,
        tronRivalTurnSeq: 2,
        tronRivalTrail: [[160.0, -320.0], [160.0, 80.0]]
    }
}

function rebuildArtCells(state, asciiLines, mode) {
    if (!asciiLines || asciiLines.length === 0) {
        state.artCells = []
        state.artSourceKey = ""
        return
    }
    var lineHash = 5381
    for (var hi = 0; hi < asciiLines.length; hi++) {
        var hLine = asciiLines[hi] || ""
        for (var hj = 0; hj < hLine.length; hj += 2) {
            lineHash = (((lineHash << 5) + lineHash) + hLine.charCodeAt(hj)) | 0
        }
    }
    var key = (mode || "braille") + ":" + asciiLines.length + ":" + lineHash + ":" + (asciiLines[0] || "").slice(0, 28)
    if (key === state.artSourceKey && state.artCells.length > 0) {
        return
    }
    state.artSourceKey = key

    var rows = asciiLines.length
    var cols = 0
    for (var r = 0; r < rows; r++) {
        if (asciiLines[r] && asciiLines[r].length > cols) cols = asciiLines[r].length
    }
    state.artRows = rows
    state.artCols = Math.max(1, cols)

    // Sample non-blank cells (up to 960 for ASCII banner words so zero letter strokes are dropped, 560 for cover art)
    var candidates = []
    for (var y = 0; y < rows; y++) {
        var line = asciiLines[y] || ""
        for (var x = 0; x < line.length; x++) {
            var ch = line.charAt(x)
            if (ch === " " || ch === "⠀") continue
            var code = ch.charCodeAt(0)
            var density = 0.72
            var brailleMask = 0
            if (code >= 0x2800 && code <= 0x28FF) {
                brailleMask = code - 0x2800
                var pop = 0
                for (var b = 0; b < 8; b++) {
                    if ((brailleMask >> b) & 1) pop++
                }
                if (pop <= 1) continue
                density = pop / 8.0
            } else if (ch === "▀") {
                density = 0.68
                brailleMask = 0x1B // top 4 Braille dots (dots 1, 2, 4, 5)
            } else if (ch === "▄") {
                density = 0.68
                brailleMask = 0xE4 // bottom 4 Braille dots (dots 3, 6, 7, 8)
            } else if (ch === "▌") {
                density = 0.68
                brailleMask = 0x47 // left column 4 Braille dots (dots 1, 2, 3, 7)
            } else if (ch === "▐") {
                density = 0.68
                brailleMask = 0xB8 // right column 4 Braille dots (dots 4, 5, 6, 8)
            } else if (ch === "░" || ch === "." || ch === "·") {
                density = 0.35
                brailleMask = 0x09 // diagonal sparse Braille dots
            } else if (ch === "▒" || ch === ":") {
                density = 0.62
                brailleMask = 0x5A // checkerboard 4 Braille dots
            } else if (ch === "▓") {
                density = 0.85
                brailleMask = 0x7F // 7 Braille dots
            } else if (ch === "█") {
                density = 1.0
                brailleMask = 0xFF // all 8 Braille dots (⣿)
            } else {
                density = 0.80
                brailleMask = 0xFF
            }
            var nx = (x / Math.max(1, cols - 1)) * 2.0 - 1.0
            var ny = (y / Math.max(1, rows - 1)) * 2.0 - 1.0
            candidates.push({
                gx: x,
                gy: y,
                nx: nx,
                ny: ny,
                ch: ch,
                brailleMask: brailleMask,
                density: density
            })
        }
    }

    var maxParticles = 420
    var stride = candidates.length > maxParticles ? (candidates.length / maxParticles) : 1.0
    var cells = []
    var count = Math.min(maxParticles, candidates.length)
    for (var i = 0; i < count; i++) {
        var c = candidates[Math.min(candidates.length - 1, Math.floor(i * stride))]
        var dist = Math.sqrt(c.nx * c.nx + c.ny * c.ny)
        var ang = Math.atan2(c.ny, c.nx)
        // Evolved target coordinates stay anchored near the true glyph coordinates (c.nx, c.ny)
        // with a subtle harmonic wave offset so letters remain recognisable even during evolution
        var evoX = c.nx + Math.cos(ang * 3.0 + dist * 4.0) * 0.08
        var evoY = c.ny + Math.sin(ang * 3.0 - dist * 4.0) * 0.08

        cells.push({
            gx: c.gx,
            gy: c.gy,
            homeX: c.nx,
            homeY: c.ny,
            evoX: evoX,
            evoY: evoY,
            x: c.nx,
            y: c.ny,
            vx: 0.0,
            vy: 0.0,
            ch: c.ch,
            brailleMask: c.brailleMask,
            mutCh: BRAILLE_MUTANTS[i % BRAILLE_MUTANTS.length],
            density: c.density,
            colIdx: Math.floor(((ang + Math.PI) / (Math.PI * 2)) * 8 + dist * 3) % 8,
            phase: (i * 0.137) % (Math.PI * 2),
            alive: 1.0
        })
    }
    state.artCells = cells
}

function triggerArtBurst(state, strength) {
    if (!state) return
    state.artBurst = Math.max(state.artBurst || 0.0, strength || 1.2)
    var cells = state.artCells || []
    for (var i = 0; i < cells.length; i++) {
        var p = cells[i]
        var ang = Math.atan2(p.y, p.x) + (Math.random() - 0.5) * 0.7
        var spd = (0.4 + Math.random() * 0.9) * (strength || 1.0)
        p.vx += Math.cos(ang) * spd
        p.vy += Math.sin(ang) * spd
    }
}

function shatterAlbumArt(state, strength) {
    triggerArtBurst(state, strength)
}

var FRACTAL_POIS = [
    { re: -0.7436439, im:  0.1318259, cRe: -0.745, cIm:  0.186, folds: 2, name: "Seahorse Valley" },
    { re:  0.2817179, im:  0.5771053, cRe:  0.285, cIm:  0.010, folds: 3, name: "Elephant Valley" },
    { re: -0.0880000, im:  0.6540000, cRe: -0.400, cIm:  0.600, folds: 3, name: "Triple Spiral Valley" },
    { re: -1.7492046, im:  0.0000000, cRe: -0.800, cIm:  0.156, folds: 2, name: "Mini-Mandelbrot Island" },
    { re: -0.1225612, im:  0.7448618, cRe: -0.123, cIm:  0.745, folds: 3, name: "Douady Rabbit Spiral" },
    { re: -0.7500000, im:  0.1100000, cRe: -0.750, cIm:  0.110, folds: 2, name: "San Marco Dragon" },
    { re: -0.3905408, im: -0.5867879, cRe: -0.391, cIm: -0.587, folds: 5, name: "Siegel Disc Vortex" },
    { re: -0.1010964, im:  0.9562865, cRe: -0.701, cIm: -0.384, folds: 4, name: "Dendrite Lightning" }
]

function randomiseState(state) {
    if (!state) return
    state.hueShift = (state.hueShift + 65 + Math.random() * 190) % 360
    state.beatCount = (state.beatCount || 0) + 1
    state.avsTarget = {
        m: 1 + Math.floor(Math.random() * 3),
        n: 2 + Math.floor(Math.random() * 3),
        k: 1 + Math.floor(Math.random() * 2),
        twist: 0.6 + Math.random() * 1.2,
        style: Math.floor(Math.random() * 3)
    }
    state.fractalPoiIndex = ((state.fractalPoiIndex || 0) + 1 + Math.floor(Math.random() * (FRACTAL_POIS.length - 1))) % FRACTAL_POIS.length
    state.shockwaves = []
    triggerArtBurst(state, 1.15)
}

function stepState(state, rawBands, active, cfg, dt) {
    cfg = normaliseConfig(cfg)
    dt = clamp(Number(dt) || 0.016, 0.004, 0.055)
    var audioSens = clamp(Number(cfg.audioSensitivity) || 1.0, 0.30, 2.50)
    var beatPunch = clamp(Number(cfg.beatPunch) || 1.0, 0.25, 2.00)
    var smoothSpeedMul = clamp(1.45 - clamp(Number(cfg.audioSmoothing) || 0.65, 0.20, 0.92) * 1.15, 0.25, 1.35)
    var reactivity = clamp((Number(cfg.layer2Reactivity) || 1.35) * audioSens, 0.15, 4.5)
    var l2Speed = clamp(Number(cfg.layer2Speed) || 1.0, 0.1, 4.0)
    var chaos = clamp(Number(cfg.layer2Chaos !== undefined ? cfg.layer2Chaos : 0.4), 0.0, 2.0)

    var n = rawBands ? rawBands.length : 0
    var maxRaw = 0.0
    for (var r = 0; r < n; r++) {
        var rv = Number(rawBands[r]) || 0.0
        if (rv > maxRaw) maxRaw = rv
    }
    if (maxRaw > 1.0) {
        state.silentFrames = 0
        state.rollingPeak = (maxRaw > state.rollingPeak)
            ? (state.rollingPeak + (maxRaw - state.rollingPeak) * 0.22)
            : Math.max(60.0, state.rollingPeak * (1.0 - dt * 0.35))
    } else {
        state.silentFrames = (state.silentFrames || 0) + 1
    }

    var denom = Math.max(60.0, state.rollingPeak)
    var useSynthFallback = active && state.silentFrames > 15
    var bassSum = 0.0, midSum = 0.0, highSum = 0.0

    for (var i = 0; i < 64; i++) {
        var norm = 0.0
        if (useSynthFallback) {
            var beatWave = Math.pow(Math.max(0.0, Math.sin(state.t * 2.2)), 4.0)
            var sub = i < 10 ? beatWave * 0.65 : 0.0
            var harm = (0.26 + 0.20 * Math.sin(state.t * 1.4 + i * 0.22) + 0.14 * Math.cos(state.t * 2.1 - i * 0.35))
            norm = clamp((sub + harm) * reactivity * 0.72, 0.03, 1.0)
        } else if (n > 0) {
            var raw = Number(rawBands[i % n]) || 0.0
            norm = clamp(Math.pow(clamp(raw / denom, 0.0, 1.25), 0.75) * reactivity, 0.0, 1.0)
        } else {
            norm = 0.03 + 0.02 * Math.sin(state.t * 1.1 + i * 0.2)
        }
        var prev = state.smoothBands[i] || 0.0
        var attack = norm > prev ? clamp(dt * 9.0 * smoothSpeedMul, 0.03, 0.28) : clamp(dt * 4.5 * smoothSpeedMul, 0.015, 0.16)
        var s = prev + (norm - prev) * attack
        state.smoothBands[i] = s

        if (s >= (state.peakBands[i] || 0.0)) {
            state.peakBands[i] = s
        } else {
            state.peakBands[i] = Math.max(s, (state.peakBands[i] || 0.0) - dt * 0.38)
        }

        if (i < 10) bassSum += s * (i < 5 ? 1.35 : 0.85)
        else if (i < 34) midSum += s
        else highSum += s
    }

    var bassRaw = clamp(bassSum / 11.0, 0.0, 1.0)
    var midRaw = clamp(midSum / 24.0, 0.0, 1.0)
    var highRaw = clamp(highSum / 30.0, 0.0, 1.0)

    // MilkDrop relative audio attenuation (`bass_att`, `mid_att`, `treb_att`)
    state.bassFast = 0.82 * (state.bassFast || bassRaw) + 0.18 * bassRaw
    state.bassSlow = 0.988 * (state.bassSlow || bassRaw) + 0.012 * bassRaw
    state.midFast = 0.82 * (state.midFast || midRaw) + 0.18 * midRaw
    state.midSlow = 0.988 * (state.midSlow || midRaw) + 0.012 * midRaw
    state.trebFast = 0.82 * (state.trebFast || highRaw) + 0.18 * highRaw
    state.trebSlow = 0.988 * (state.trebSlow || highRaw) + 0.012 * highRaw

    state.bassAtt = clamp(state.bassFast / Math.max(0.04, state.bassSlow), 0.35, 2.4)
    state.midAtt = clamp(state.midFast / Math.max(0.04, state.midSlow), 0.35, 2.4)
    state.trebAtt = clamp(state.trebFast / Math.max(0.04, state.trebSlow), 0.35, 2.4)

    var bass = clamp(bassRaw * (0.58 + 0.42 * state.bassAtt), 0.0, 1.2)
    var mid = clamp(midRaw * (0.58 + 0.42 * state.midAtt), 0.0, 1.2)
    var high = clamp(highRaw * (0.58 + 0.42 * state.trebAtt), 0.0, 1.2)

    state.energy = clamp(bass * 0.50 + mid * 0.32 + high * 0.18, 0.0, 1.0)

    // Silky-smooth macro envelopes so geometry breathes organically without twitching
    var envRate = clamp(dt * 5.5 * smoothSpeedMul, 0.02, 0.22)
    state.bassSmooth = lerp(state.bassSmooth || 0.0, bassRaw, envRate)
    state.midSmooth = lerp(state.midSmooth || 0.0, midRaw, envRate)
    state.highSmooth = lerp(state.highSmooth || 0.0, highRaw, envRate)
    state.energySmooth = lerp(state.energySmooth || 0.0, state.energy, envRate)

    state.bass = state.bassSmooth
    state.mid = state.midSmooth
    state.high = state.highSmooth

    // Dual-envelope onset / beat detector
    state.kickFast = lerp(state.kickFast || bass, bass, clamp(dt * 18.0, 0.08, 0.55))
    state.kickSlow = lerp(state.kickSlow || bass, bass, clamp(dt * 3.2, 0.02, 0.18))
    state.snareFast = lerp(state.snareFast || mid, (mid + high) * 0.5, clamp(dt * 16.0, 0.08, 0.55))
    state.snareSlow = lerp(state.snareSlow || mid, (mid + high) * 0.5, clamp(dt * 3.5, 0.02, 0.18))

    state.beatCooldown = Math.max(0.0, (state.beatCooldown || 0.0) - dt)
    var kickRatio = state.kickSlow > 0.04 ? (state.kickFast / state.kickSlow) : 1.0
    var snareRatio = state.snareSlow > 0.04 ? (state.snareFast / state.snareSlow) : 1.0

    var rawL1Dir = cfg && cfg.layer1Direction !== undefined ? Number(cfg.layer1Direction) : 1
    var l1Dir = (rawL1Dir === 0) ? Math.sin((state.t || 0.0) * 0.45) : (rawL1Dir < 0 ? -1.0 : 1.0)

    if ((kickRatio > 1.22 && state.kickFast > 0.16 || snareRatio > 1.28 && state.snareFast > 0.20) && state.beatCooldown <= 0.0) {
        state.beatPulse = clamp(beatPunch, 0.25, 2.0)
        state.beatFlash = clamp(beatPunch, 0.25, 2.0)
        state.beatCooldown = 0.28
        state.beatCount = (state.beatCount || 0) + 1
        // Update target harmonics on every 8th beat (low, clean ratios so AVS Scope is never noisy!)
        if (state.beatCount % 8 === 0) {
            state.avsTarget = {
                m: 1 + (state.beatCount % 3),
                n: 2 + ((state.beatCount * 2) % 3),
                k: 1 + (state.beatCount % 2),
                twist: 0.65 + ((state.beatCount * 0.7) % 1.1) * (0.5 + chaos * 0.3),
                style: state.beatCount % 3
            }
        }
        if (state.beatCount % 16 === 0) {
            state.fractalPoiIndex = ((state.fractalPoiIndex || 0) + 1 + (state.beatCount % 3)) % FRACTAL_POIS.length
        }
        var shapeDenBeat = clamp(Number(cfg && cfg.layer1ShapeDensity !== undefined ? cfg.layer1ShapeDensity : 1.0), 0.25, 2.5)
        var beatTargetShapes = shapeDenBeat <= 1.5
            ? Math.round(1.0 + Math.pow((shapeDenBeat - 0.25) / 1.25, 1.15) * 4.0)
            : Math.round(5.0 + Math.pow(shapeDenBeat - 1.5, 0.78) * 3.0)
        var maxBeatShapes = Math.max(1, Math.min(9, beatTargetShapes + 1))
        if (state.shockwaves.length < maxBeatShapes) {
            state.shockwaves.push({
                r: l1Dir < 0 ? 1.58 : 0.015,
                alpha: 0.96,
                sizeMul: 0.42 + Math.random() * 0.52,
                speed: 0.24 + Math.random() * 0.38 + state.bassSmooth * 0.24,
                laneX: (Math.random() * 2.0 - 1.0) * 0.58,
                laneY: (Math.random() * 2.0 - 1.0) * 0.44,
                spinX: (Math.random() * 2.0 - 1.0) * 1.5,
                spinY: (Math.random() * 2.0 - 1.0) * 1.5,
                spinZ: (Math.random() * 2.0 - 1.0) * 1.5,
                variant: Math.floor(Math.random() * 6),
                hueOffset: (state.hueShift + state.beatCount * 35 + Math.random() * 50) % 360,
                sides: 3 + Math.floor(Math.random() * 7)
            })
        }
    } else {
        state.beatPulse = Math.max(0.0, state.beatPulse - dt * 2.6)
        state.beatFlash = Math.max(0.0, state.beatFlash - dt * 4.0)
    }

    state.beatSmooth = lerp(state.beatSmooth || 0.0, state.beatPulse, clamp(dt * 6.0 * smoothSpeedMul, 0.03, 0.22))
    // Keep beatPulse smooth for downstream visual modes so nothing snaps abruptly on beat frames
    state.beatPulse = state.beatSmooth

    // Smoothly interpolate AVS harmonics toward avsTarget instead of snapping integers
    if (!state.avsHarmonics) state.avsHarmonics = { m: 1, n: 2, k: 1, twist: 0.9, style: 0 }
    if (!state.avsTarget) state.avsTarget = { m: 1, n: 2, k: 1, twist: 0.9, style: 0 }
    var harmRate = clamp(dt * 1.2, 0.01, 0.05)
    state.avsHarmonics.m = lerp(state.avsHarmonics.m, state.avsTarget.m, harmRate)
    state.avsHarmonics.n = lerp(state.avsHarmonics.n, state.avsTarget.n, harmRate)
    state.avsHarmonics.k = lerp(state.avsHarmonics.k, state.avsTarget.k, harmRate)
    state.avsHarmonics.twist = lerp(state.avsHarmonics.twist, state.avsTarget.twist, harmRate)
    state.avsHarmonics.style = state.avsTarget.style

    // Smoothly interpolate active Fractal POI coordinates so fractal zoom wanders across random fractal regions
    var targetPoi = FRACTAL_POIS[(state.fractalPoiIndex || 0) % FRACTAL_POIS.length]
    var poiRate = clamp(dt * 0.65, 0.005, 0.03)
    state.fractalRe = lerp(state.fractalRe !== undefined ? state.fractalRe : targetPoi.re, targetPoi.re, poiRate)
    state.fractalIm = lerp(state.fractalIm !== undefined ? state.fractalIm : targetPoi.im, targetPoi.im, poiRate)
    state.fractalCRe = lerp(state.fractalCRe !== undefined ? state.fractalCRe : targetPoi.cRe, targetPoi.cRe, poiRate)
    state.fractalCIm = lerp(state.fractalCIm !== undefined ? state.fractalCIm : targetPoi.cIm, targetPoi.cIm, poiRate)

    state.artBurst = Math.max(0.0, (state.artBurst || 0.0) - dt * 1.4)

    // Music-Driven Parameter Modulation envelopes (`musicDrive`) & Song Track Progress Arc (`trackArcMode`)
    var rawIntensity = clamp(state.energySmooth * 0.68 + state.beatSmooth * 0.22 + (state.bassAtt - 1.0) * 0.15, 0.0, 1.35)
    state.musicIntensity = lerp(state.musicIntensity || 0.35, rawIntensity, clamp(dt * 3.5, 0.02, 0.12))
    state.musicCalm = clamp(1.0 - state.musicIntensity * 0.80, 0.12, 1.0)

    var trackProg = clamp(Number(cfg.trackProgress) || 0.0, 0.0, 1.0)
    var arcMode = cfg.trackArcMode !== undefined ? clamp(Math.round(Number(cfg.trackArcMode)), 0, 4) : 1
    var arcDismantleMul = 1.0
    var arcRebuildMul = 1.0
    var arcEvoBoost = 0.55 * trackProg
    var arcSpeedBoost = 1.0
    state.trackArcChapter = Math.min(3, Math.floor(trackProg * 4.0))

    if (arcMode === 0) {
        var audioSurge = clamp((state.musicIntensity - 0.32) * 1.45 + Math.max(0.0, state.bassAtt - 1.0) * 0.45, 0.0, 1.35)
        arcDismantleMul = 0.45 + 1.15 * audioSurge
        arcRebuildMul = clamp(1.65 - 0.85 * audioSurge, 0.45, 1.85)
        arcEvoBoost = 0.65 * audioSurge
        arcSpeedBoost = 0.82 + 0.48 * audioSurge
    } else if (arcMode === 1) {
        var climaxCurve = Math.sin(Math.pow(trackProg, 0.82) * Math.PI)
        arcDismantleMul = 0.55 + 1.05 * climaxCurve
        arcRebuildMul = 1.35 - 0.65 * climaxCurve + (trackProg > 0.82 ? (trackProg - 0.82) * 3.5 : 0.0)
        arcEvoBoost = 0.78 * climaxCurve
        arcSpeedBoost = 0.85 + 0.35 * climaxCurve
    } else if (arcMode === 2) {
        arcDismantleMul = 0.25 + 1.85 * trackProg
        arcRebuildMul = clamp(1.85 - 1.45 * trackProg, 0.25, 2.2)
        arcEvoBoost = 1.15 * trackProg
        arcSpeedBoost = 0.80 + 0.50 * trackProg
    } else if (arcMode === 3) {
        arcDismantleMul = clamp(1.90 - 1.65 * trackProg, 0.20, 2.2)
        arcRebuildMul = 0.35 + 2.10 * trackProg
        arcEvoBoost = 0.95 * (1.0 - trackProg)
        arcSpeedBoost = 1.25 - 0.35 * trackProg
    } else if (arcMode === 4) {
        var ch = state.trackArcChapter
        arcDismantleMul = (ch === 0 ? 0.65 : (ch === 1 ? 1.15 : (ch === 2 ? 1.65 : 0.75)))
        arcRebuildMul = (ch === 0 ? 1.35 : (ch === 1 ? 0.95 : (ch === 2 ? 0.65 : 1.75)))
        arcEvoBoost = ch * 0.32
        arcSpeedBoost = 0.85 + ch * 0.18
    }

    var mDrive = cfg.musicDrive !== undefined ? Boolean(cfg.musicDrive) : true
    var targetDismantle = mDrive
        ? clamp(cfg.layer3Dismantle * (0.25 + 1.10 * state.musicIntensity + state.beatSmooth * 0.55) * arcDismantleMul, 0.10, 3.50)
        : clamp(cfg.layer3Dismantle * arcDismantleMul, 0.10, 3.50)
    var targetRebuild = mDrive
        ? clamp(cfg.layer3Rebuild * (0.45 + 1.50 * state.musicCalm) * arcRebuildMul, 0.15, 3.50)
        : clamp(cfg.layer3Rebuild * arcRebuildMul, 0.15, 3.50)
    var targetEvolution = mDrive
        ? clamp(cfg.layer3Evolution * (0.40 + 0.95 * state.midSmooth + arcEvoBoost), 0.10, 3.00)
        : clamp(cfg.layer3Evolution * (0.65 + arcEvoBoost), 0.10, 3.00)
    var targetTracerSpeed = mDrive
        ? clamp(cfg.tracerSpeed * (0.65 + 0.65 * state.musicIntensity + state.beatSmooth * 0.25) * arcSpeedBoost, 0.15, 3.00)
        : clamp(cfg.tracerSpeed * arcSpeedBoost, 0.15, 3.00)
    var targetTracerDrift = mDrive
        ? clamp(cfg.tracerDrift * (0.65 + 0.65 * state.midSmooth), 0.0, 2.50)
        : cfg.tracerDrift

    var liveRate = clamp(dt * 3.0, 0.02, 0.10)
    state.liveDismantle = lerp(state.liveDismantle !== undefined ? state.liveDismantle : targetDismantle, targetDismantle, liveRate)
    state.liveRebuild = lerp(state.liveRebuild !== undefined ? state.liveRebuild : targetRebuild, targetRebuild, liveRate)
    state.liveEvolution = lerp(state.liveEvolution !== undefined ? state.liveEvolution : targetEvolution, targetEvolution, liveRate)
    state.liveTracerSpeed = lerp(state.liveTracerSpeed !== undefined ? state.liveTracerSpeed : targetTracerSpeed, targetTracerSpeed, liveRate)
    state.liveTracerDrift = lerp(state.liveTracerDrift !== undefined ? state.liveTracerDrift : targetTracerDrift, targetTracerDrift, liveRate)

    // Smoothly integrated phase accumulators (honours Tri-State l1Dir: +1 Towards, -1 Away, 0 Breathe!)
    var l1Speed = clamp(Number(cfg && cfg.layer1Speed !== undefined ? cfg.layer1Speed : 1.0), 0.05, 4.0)
    var eqSpinCfg = clamp(Number(cfg && cfg.layer1EqSpin !== undefined ? cfg.layer1EqSpin : 1.0), -2.5, 2.5)
    var bdSpeed = clamp(Number(cfg && cfg.backdropSpeed !== undefined ? cfg.backdropSpeed : 1.0), 0.1, 3.0)
    var bdDirCfg = Number(cfg && cfg.backdropDirection !== undefined ? cfg.backdropDirection : (cfg && cfg.layer1Direction !== undefined ? cfg.layer1Direction : 1))
    var bdDir = (bdDirCfg === 0) ? Math.sin((state.t || 0.0) * 0.72) : clamp(bdDirCfg, -1, 1)
    var trSpeedCfg = clamp(Number(cfg && cfg.tracerSpeed !== undefined ? cfg.tracerSpeed : 1.0), 0.2, 2.5)
    var timeStep = dt * l2Speed * (active ? (0.35 + state.energySmooth * 0.45) : 0.18)
    state.t += timeStep
    state.l1Time = (state.l1Time || 0.0) + dt * l1Speed * l1Dir * (active ? (0.85 + state.bassSmooth * 0.55) : 0.45)
    state.eqSpinTime = (state.eqSpinTime || 0.0) + dt * eqSpinCfg * (active ? (0.85 + state.bassSmooth * 0.55) : 0.45)
    state.backdropTime = (state.backdropTime || 0.0) + dt * bdSpeed * bdDir * (active ? (0.42 + state.energySmooth * 0.45) : 0.22)
    state.driftTime = (state.driftTime || 0.0) + dt * 0.28 * trSpeedCfg
    state.zoomTime = (state.zoomTime || 0.0) + dt * 0.38 * l2Speed * (0.75 + state.bassSmooth * 0.45)
    state.tunnelTime = (state.tunnelTime || 0.0) + dt * 0.52 * l2Speed * trSpeedCfg * (0.72 + state.bassSmooth * 0.42)
    state.matrixTime = (state.matrixTime || 0.0) + dt * 0.65 * l2Speed * (0.75 + state.energySmooth * 0.25)
    state.phase += timeStep * 0.55 * state.rotPolarity
    var colCycleSpd = clamp(Number(cfg && cfg.colourCycleSpeed !== undefined ? cfg.colourCycleSpeed : 1.0), 0.0, 2.5)
    state.hueShift = (state.hueShift + dt * (8.0 + state.energySmooth * 14.0) * colCycleSpd) % 360.0

    // Periodically drift to a new random fractal region every ~14 seconds even without beat triggers
    if (Math.floor((state.t - timeStep) / 14.0) !== Math.floor(state.t / 14.0)) {
        state.fractalPoiIndex = ((state.fractalPoiIndex || 0) + 1 + Math.floor(Math.random() * (FRACTAL_POIS.length - 1))) % FRACTAL_POIS.length
    }

    // Record 32-band snapshot into state.waveHistory ring buffer (for Cthugha 3D Plasma Tunnel)
    if (!state.waveHistory) state.waveHistory = []
    var snapBands = []
    for (var wb = 0; wb < 32; wb++) {
        snapBands.push(state.smoothBands[wb * 2] || 0.04)
    }
    state.waveHistory.unshift({
        bands: snapBands,
        bass: state.bass,
        mid: state.mid,
        high: state.high,
        hue: state.hueShift
    })
    if (state.waveHistory.length > 18) {
        state.waveHistory.length = 18
    }

    // Record 36-bin snapshot into state.eqRidgeHistory synchronised with state.l1Time * 2.8 depth advection
    if (!state.eqRidgeHistory) state.eqRidgeHistory = []
    var liveBins36 = []
    for (var rb36 = 0; rb36 < 36; rb36++) {
        var bIdx36 = Math.min(63, Math.floor((rb36 / 35.0) * 63))
        liveBins36.push(state.smoothBands[bIdx36] || 0.04)
    }
    var curRidgeStep = Math.floor((state.l1Time || 0.0) * 2.8)
    if (state.eqRidgeHistory.length < 24 || curRidgeStep !== state.eqRidgeStepIdx) {
        state.eqRidgeStepIdx = curRidgeStep
        state.eqRidgeHistory.unshift({
            bins: liveBins36,
            bass: state.bass,
            energy: state.energy,
            hue: state.hueShift,
            stepIdx: curRidgeStep
        })
        if (state.eqRidgeHistory.length > 24) {
            state.eqRidgeHistory.length = 24
        }
    } else if (state.eqRidgeHistory.length > 0) {
        state.eqRidgeHistory[0] = {
            bins: liveBins36,
            bass: state.bass,
            energy: state.energy,
            hue: state.hueShift,
            stepIdx: curRidgeStep
        }
    }

    // Step Layer #1 Beat Shapes (`3: Vectors`) — always spawn new shapes at the furthest depth point away
    // so they emerge from the horizon/vanishing point rather than popping in directly in front of the display.
    var shapeSpeed = clamp(Number(cfg && cfg.layer1ShapeSpeed !== undefined ? cfg.layer1ShapeSpeed : 1.0), 0.2, 3.0)
    var shapeDensity = clamp(Number(cfg && cfg.layer1ShapeDensity !== undefined ? cfg.layer1ShapeDensity : 1.0), 0.25, 2.5)
    var shapesOn = cfg ? (cfg.layer1ShapesEnabled !== false) : true
    var rawTargetShapes = shapeDensity <= 1.5
        ? Math.round(1.0 + Math.pow((shapeDensity - 0.25) / 1.25, 1.15) * 4.0)
        : Math.round(5.0 + Math.pow(shapeDensity - 1.5, 0.78) * 3.0)
    var targetShapeCount = Math.max(1, Math.min(8, rawTargetShapes))
    var maxShapeCount = Math.max(targetShapeCount, Math.min(9, targetShapeCount + 1))
    if (state.shockwaves.length > maxShapeCount) {
        state.shockwaves.length = maxShapeCount
    }
    if (shapesOn && active && state.shockwaves.length < targetShapeCount) {
        var existingCount = state.shockwaves.length
        var missing = targetShapeCount - existingCount
        for (var ms = 0; ms < missing; ms++) {
            var idxS = state.shockwaves.length
            // If initialising from empty, stagger gently across the far distance (0.015..0.36);
            // if replenishing an expired shape, ALWAYS spawn at the furthest point away (0.015..0.06)!
            var farStagger = (existingCount === 0 && missing > 1)
                ? ((ms / missing) * 0.34)
                : (ms * 0.035)
            var spawnR = l1Dir < 0
                ? clamp(1.58 - farStagger, 1.15, 1.60)
                : clamp(0.015 + farStagger, 0.012, 0.38)
            state.shockwaves.push({
                r: spawnR,
                alpha: 0.96,
                sizeMul: 0.42 + Math.random() * 0.52,
                speed: 0.24 + Math.random() * 0.38 + state.bassSmooth * 0.24,
                laneX: (Math.random() * 2.0 - 1.0) * 0.58,
                laneY: (Math.random() * 2.0 - 1.0) * 0.44,
                spinX: (Math.random() * 2.0 - 1.0) * 1.5,
                spinY: (Math.random() * 2.0 - 1.0) * 1.5,
                spinZ: (Math.random() * 2.0 - 1.0) * 1.5,
                variant: Math.floor(Math.random() * 6),
                hueOffset: (state.hueShift + (state.beatCount + idxS) * 35 + Math.random() * 50) % 360,
                sides: 3 + Math.floor(Math.random() * 7)
            })
        }
    }
    for (var sw = state.shockwaves.length - 1; sw >= 0; sw--) {
        var wave = state.shockwaves[sw]
        wave.r += dt * wave.speed * shapeSpeed * 0.46 * (rawL1Dir === 0 ? (0.25 + 0.75 * l1Dir) : l1Dir)
        wave.alpha -= dt * 0.14 * (0.55 + 0.45 * shapeSpeed)
        if (wave.alpha <= 0.02 || wave.r > 1.65 || wave.r < 0.01) {
            state.shockwaves.splice(sw, 1)
        }
    }

    // Step Layer #1 Starfield (obeying Tri-State l1Dir: Towards, Away, or Breathe!)
    var starVel = dt * l1Speed * (0.22 + state.bassSmooth * 0.65) * l1Dir
    for (var st = 0; st < state.stars.length; st++) {
        var star = state.stars[st]
        star.pz = star.z
        star.z -= starVel
        if (star.z <= 0.03) {
            star.x = (Math.random() - 0.5) * 2.2
            star.y = (Math.random() - 0.5) * 2.2
            star.z = 1.0
            star.pz = 1.0
        } else if (star.z >= 1.0) {
            star.x = (Math.random() - 0.5) * 2.2
            star.y = (Math.random() - 0.5) * 2.2
            star.z = 0.04
            star.pz = 0.04
        }
    }

    // Step Layer #1 Cthugha Flame ribbons (obeying Tri-State l1Dir)
    var flameDir = rawL1Dir === 0 ? (0.35 + 0.65 * Math.abs(l1Dir)) : (l1Dir < 0 ? -1.0 : 1.0)
    for (var fl = 0; fl < state.flames.length; fl++) {
        var fm = state.flames[fl]
        var bIdx = Math.min(63, Math.floor(fm.x * 63))
        var bandE = state.smoothBands[bIdx] || 0.1
        fm.y -= dt * l1Speed * flameDir * (fm.vy * 0.65 + bandE * 0.45 + state.bassSmooth * 0.25)
        fm.x += Math.sin(state.l1Time * 1.2 + fl * 0.5) * dt * 0.04 * (1.0 + state.midSmooth * 0.5)
        fm.energy = lerp(fm.energy, bandE, 0.15)
        if (fm.y < -0.05) {
            fm.y = 1.02
            fm.x = (fl + (Math.random() - 0.5) * 0.6) / 48.0
            fm.energy = bandE
        } else if (fm.y > 1.05) {
            fm.y = -0.02
            fm.x = (fl + (Math.random() - 0.5) * 0.6) / 48.0
            fm.energy = bandE
        }
    }

    // Step Layer #1 TRON 1982 Light Cycle & Rival Light Cycle along true 90-degree (PI/2) orthogonal world grid axes
    // Turns are strictly flat horizontal ground-plane yaw rotations around the vertical Y-axis (zero Z-axis roll!)
    var tronDirsStep = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    // Includes 3-turn loops (1, 1, 1 and -1, -1, -1) so bikes periodically loop back across existing jetwalls and trigger 3D vector crashes!
    var tronTurnChoices = [1, 1, 1, -1, 1, -1, -1, -1, 1, -1, 1, 1]
    if (state.tronHeading === undefined) state.tronHeading = 0
    if (state.tronYaw === undefined) state.tronYaw = 0.0
    if (state.tronYawVel === undefined || !isFinite(state.tronYawVel)) state.tronYawVel = 0.0
    if (state.tronBikeYaw === undefined) state.tronBikeYaw = 0.0
    if (state.tronTargetYaw === undefined) state.tronTargetYaw = 0.0
    if (state.tronX === undefined) state.tronX = 0.0
    if (state.tronZ === undefined) state.tronZ = 0.0
    if (state.tronTurnTimer === undefined) state.tronTurnTimer = 1.45
    if (state.tronTurnSeq === undefined) state.tronTurnSeq = 0
    if (state.tronCrashCooldown === undefined) state.tronCrashCooldown = 0.0
    if (state.tronSinceCrash === undefined) state.tronSinceCrash = 0.0
    if (!state.tronCrashes) state.tronCrashes = []
    if (!state.tronTrail || state.tronTrail.length < 2) {
        state.tronTrail = [[state.tronX, state.tronZ - 480.0], [state.tronX, state.tronZ]]
    }
    if (state.tronRivalHeading === undefined) state.tronRivalHeading = 0
    if (state.tronRivalYaw === undefined) state.tronRivalYaw = 0.0
    if (state.tronRivalTargetYaw === undefined) state.tronRivalTargetYaw = 0.0
    if (state.tronRivalX === undefined) state.tronRivalX = 160.0
    if (state.tronRivalZ === undefined) state.tronRivalZ = 80.0
    if (state.tronRivalTurnTimer === undefined) state.tronRivalTurnTimer = 1.05
    if (state.tronRivalTurnSeq === undefined) state.tronRivalTurnSeq = 2
    if (state.tronRivalCrashCooldown === undefined) state.tronRivalCrashCooldown = 0.0
    if (state.tronRivalSinceCrash === undefined) state.tronRivalSinceCrash = 0.0
    if (!state.tronRivalTrail || state.tronRivalTrail.length < 2) {
        state.tronRivalTrail = [[state.tronRivalX, state.tronRivalZ - 400.0], [state.tronRivalX, state.tronRivalZ]]
    }

    if (cfg && cfg.layer1Enabled !== false && cfg.layer1FieldEnabled !== false && Number(cfg.layer1Mode) === 7) {
    // Step active 3D world-space vectored crashes (bikes continue moving without losing flow!)
    for (var ci = state.tronCrashes.length - 1; ci >= 0; ci--) {
        state.tronCrashes[ci].age += dt
        if (state.tronCrashes[ci].age >= state.tronCrashes[ci].maxAge) {
            state.tronCrashes.splice(ci, 1)
        }
    }

    function spawnTronVectorCrash(cx, cz, cyaw, ccol) {
        state.tronCrashes.push({
            x: cx,
            z: cz,
            yaw: cyaw,
            age: 0.0,
            maxAge: 1.55,
            col: ccol
        })
        if (state.tronCrashes.length > 6) {
            state.tronCrashes.shift()
        }
    }

    function checkJetwallHit(ax, az, bx, bz, ownTrail, otherTrail) {
        var hitTol = 14.0
        function segHit(cx, cz, dx, dz) {
            var minABX = Math.min(ax, bx) - hitTol, maxABX = Math.max(ax, bx) + hitTol
            var minABZ = Math.min(az, bz) - hitTol, maxABZ = Math.max(az, bz) + hitTol
            var minCDX = Math.min(cx, dx) - hitTol, maxCDX = Math.max(cx, dx) + hitTol
            var minCDZ = Math.min(cz, dz) - hitTol, maxCDZ = Math.max(cz, dz) + hitTol
            if (maxABX < minCDX || minABX > maxCDX || maxABZ < minCDZ || minABZ > maxCDZ) return null
            var rX = bx - ax, rZ = bz - az
            var sX = dx - cx, sZ = dz - cz
            var denom = rX * sZ - rZ * sX
            if (Math.abs(denom) < 0.001) return null
            var u = ((cx - ax) * rZ - (cz - az) * rX) / denom
            var t = ((cx - ax) * sZ - (cz - az) * sX) / denom
            if (t >= -0.06 && t <= 1.06 && u >= -0.03 && u <= 1.03) {
                return [ax + clamp(t, 0.0, 1.0) * rX, az + clamp(t, 0.0, 1.0) * rZ]
            }
            return null
        }
        // Check own earlier jetwall segments (skip active last segment and immediate prior corner segment)
        if (ownTrail && ownTrail.length >= 4) {
            for (var oi = 0; oi <= ownTrail.length - 4; oi++) {
                var hOwn = segHit(ownTrail[oi][0], ownTrail[oi][1], ownTrail[oi + 1][0], ownTrail[oi + 1][1])
                if (hOwn) return hOwn
            }
        }
        // Check rival/other bike's standing jetwall segments
        if (otherTrail && otherTrail.length >= 2) {
            for (var ti = 0; ti <= otherTrail.length - 2; ti++) {
                var hOth = segHit(otherTrail[ti][0], otherTrail[ti][1], otherTrail[ti + 1][0], otherTrail[ti + 1][1])
                if (hOth) return hOth
            }
        }
        return null
    }

    var tronSpeed = (390.0 + state.bassSmooth * 180.0) * clamp(l1Speed, 0.25, 2.5)
    var pDir = tronDirsStep[state.tronHeading & 3]
    var prevPX = state.tronX, prevPZ = state.tronZ
    state.tronX += pDir[0] * tronSpeed * dt
    state.tronZ += pDir[1] * tronSpeed * dt
    state.tronSinceCrash += dt
    if (state.tronCrashCooldown > 0.0) state.tronCrashCooldown = Math.max(0.0, state.tronCrashCooldown - dt)

    var pHit = (state.tronCrashCooldown <= 0.0)
        ? checkJetwallHit(prevPX, prevPZ, state.tronX, state.tronZ, state.tronTrail, state.tronRivalTrail)
        : null
    if (pHit) {
        // Trigger 3D vectored crash at impact coordinates while Player Light Cycle continues without losing flow!
        spawnTronVectorCrash(pHit[0], pHit[1], state.tronBikeYaw, "#33FFFF")
        state.tronCrashCooldown = 0.65
        state.tronSinceCrash = 0.0
    }
    state.tronTrail[state.tronTrail.length - 1][0] = state.tronX
    state.tronTrail[state.tronTrail.length - 1][1] = state.tronZ
    state.tronTurnTimer -= dt * clamp(l1Speed, 0.4, 1.8)
    var camSettled = Math.abs(state.tronTargetYaw - state.tronYaw) < 0.06
    if ((state.tronTurnTimer <= 0.0 && camSettled) || (state.beatFlash > 0.72 && state.tronTurnTimer < 0.35 && camSettled)) {
        // Snap corner vertex to 80-unit Game Grid intersection and turn the Light Cycle an instant 90 degrees (+PI/2 or -PI/2) around the vertical Y-axis!
        state.tronX = Math.round(state.tronX / 80.0) * 80.0
        state.tronZ = Math.round(state.tronZ / 80.0) * 80.0
        state.tronTrail[state.tronTrail.length - 1][0] = state.tronX
        state.tronTrail[state.tronTrail.length - 1][1] = state.tronZ
        var tSign = tronTurnChoices[state.tronTurnSeq % tronTurnChoices.length]
        if (state.tronSinceCrash > 7.5) {
            // Force a tight box loop so the bike slices across its own or rival's jetwall for a 3D vectored crash!
            tSign = 1
        }
        state.tronTurnSeq = (state.tronTurnSeq + 1) % 1024
        state.tronHeading = (state.tronHeading + tSign + 4) & 3
        state.tronTargetYaw += tSign * (Math.PI * 0.5)
        state.tronBikeYaw = state.tronTargetYaw
        state.tronTrail.push([state.tronX, state.tronZ])
        if (state.tronTrail.length > 16) {
            state.tronTrail.shift()
        }
        state.tronTurnTimer = (state.tronSinceCrash > 6.5)
            ? (0.90 + ((state.tronTurnSeq * 19) % 5) * 0.12)
            : (1.50 + ((state.tronTurnSeq * 37) % 7) * 0.14)
    }

    // Bike turn is 100% instantaneous; camera yaw glides smoothly with rate-limited ease-in / ease-out
    state.tronBikeYaw = state.tronTargetYaw
    var yawErr = state.tronTargetYaw - state.tronYaw
    var maxYawRate = 1.80 * clamp(l1Speed, 0.55, 1.40)
    var desiredYawVel = clamp(yawErr * 2.25, -maxYawRate, maxYawRate)
    state.tronYawVel += (desiredYawVel - state.tronYawVel) * Math.min(1.0, dt * 6.0)
    var yawStep = state.tronYawVel * dt
    if (Math.abs(yawStep) >= Math.abs(yawErr) || Math.abs(yawErr) < 0.0005) {
        state.tronYaw = state.tronTargetYaw
        state.tronYawVel = 0.0
    } else {
        state.tronYaw += yawStep
    }
    state.tronTurnRoll = 0.0
    var tronCamDist = 290.0
    var targetTronCamX = state.tronX - Math.sin(state.tronYaw) * tronCamDist
    var targetTronCamZ = state.tronZ - Math.cos(state.tronYaw) * tronCamDist
    if (state.tronCamX === undefined || !isFinite(state.tronCamX)) state.tronCamX = targetTronCamX
    if (state.tronCamZ === undefined || !isFinite(state.tronCamZ)) state.tronCamZ = targetTronCamZ
    state.tronCamX += (targetTronCamX - state.tronCamX) * Math.min(1.0, dt * 5.2)
    state.tronCamZ += (targetTronCamZ - state.tronCamZ) * Math.min(1.0, dt * 5.2)

    // Step Rival Sark Yellow Light Cycle in the same world space (triggers 3D vectored crashes while continuing at full speed!)
    var rDir = tronDirsStep[state.tronRivalHeading & 3]
    var prevRX = state.tronRivalX, prevRZ = state.tronRivalZ
    state.tronRivalX += rDir[0] * tronSpeed * 1.04 * dt
    state.tronRivalZ += rDir[1] * tronSpeed * 1.04 * dt
    state.tronRivalSinceCrash += dt
    if (state.tronRivalCrashCooldown > 0.0) state.tronRivalCrashCooldown = Math.max(0.0, state.tronRivalCrashCooldown - dt)

    var rHit = (state.tronRivalCrashCooldown <= 0.0)
        ? checkJetwallHit(prevRX, prevRZ, state.tronRivalX, state.tronRivalZ, state.tronRivalTrail, state.tronTrail)
        : null
    if (rHit) {
        spawnTronVectorCrash(rHit[0], rHit[1], state.tronRivalYaw, "#FFAA00")
        state.tronRivalCrashCooldown = 0.65
        state.tronRivalSinceCrash = 0.0
    }
    state.tronRivalTrail[state.tronRivalTrail.length - 1][0] = state.tronRivalX
    state.tronRivalTrail[state.tronRivalTrail.length - 1][1] = state.tronRivalZ
    state.tronRivalTurnTimer -= dt * clamp(l1Speed, 0.4, 2.2)
    if (state.tronRivalTurnTimer <= 0.0) {
        state.tronRivalX = Math.round(state.tronRivalX / 80.0) * 80.0
        state.tronRivalZ = Math.round(state.tronRivalZ / 80.0) * 80.0
        state.tronRivalTrail[state.tronRivalTrail.length - 1][0] = state.tronRivalX
        state.tronRivalTrail[state.tronRivalTrail.length - 1][1] = state.tronRivalZ
        var rSign = (state.tronRivalSinceCrash > 5.5) ? -1 : tronTurnChoices[(state.tronRivalTurnSeq + 3) % tronTurnChoices.length]
        state.tronRivalTurnSeq = (state.tronRivalTurnSeq + 1) % 1024
        state.tronRivalHeading = (state.tronRivalHeading + rSign + 4) & 3
        state.tronRivalTargetYaw += rSign * (Math.PI * 0.5)
        state.tronRivalYaw = state.tronRivalTargetYaw
        // Keep rival near the player's arena sector if it drifts too far away
        if (Math.abs(state.tronRivalX - state.tronX) > 960.0 || Math.abs(state.tronRivalZ - state.tronZ) > 960.0) {
            var pFwd = tronDirsStep[state.tronHeading & 3]
            var pRight = [pFwd[1], -pFwd[0]]
            state.tronRivalX = Math.round((state.tronX + pFwd[0] * 160.0 + pRight[0] * 160.0) / 80.0) * 80.0
            state.tronRivalZ = Math.round((state.tronZ + pFwd[1] * 160.0 + pRight[1] * 160.0) / 80.0) * 80.0
            state.tronRivalHeading = state.tronHeading
            state.tronRivalTargetYaw = state.tronTargetYaw
            state.tronRivalYaw = state.tronTargetYaw
            state.tronRivalTrail = [
                [state.tronRivalX - pFwd[0] * 320.0, state.tronRivalZ - pFwd[1] * 320.0],
                [state.tronRivalX, state.tronRivalZ]
            ]
        } else {
            state.tronRivalTrail.push([state.tronRivalX, state.tronRivalZ])
            if (state.tronRivalTrail.length > 16) {
                state.tronRivalTrail.shift()
            }
        }
        state.tronRivalTurnTimer = 0.85 + ((state.tronRivalTurnSeq * 29) % 6) * 0.12
    }
    state.tronRivalYaw = state.tronRivalTargetYaw
    }

    // Step Layer #3 Autonomous Album Art Particle Cells
    if (cfg && cfg.layer3Enabled && state.artCells && state.artCells.length > 0) {
        stepArtCells(state, cfg, dt)
    }
}

function stepArtCells(state, cfg, dt) {
    var cells = state.artCells
    var n = cells.length
    if (n === 0) return

    var l3Mode = (Number(cfg.layer3Mode) || 0) % LAYER3_MODES.length
    var isWordsSource = (cfg.useAlbumArt === false)

    var dismantle = state.liveDismantle !== undefined
        ? state.liveDismantle
        : clamp(Number(cfg.layer3Dismantle !== undefined ? cfg.layer3Dismantle : 1.15), 0.0, 4.0)
    var rebuild = state.liveRebuild !== undefined
        ? state.liveRebuild
        : clamp(Number(cfg.layer3Rebuild !== undefined ? cfg.layer3Rebuild : 1.0), 0.05, 4.0)
    var evoRate = state.liveEvolution !== undefined
        ? state.liveEvolution
        : clamp(Number(cfg.layer3Evolution !== undefined ? cfg.layer3Evolution : 0.65), 0.0, 3.0)

    // Audio-driven & cyclic "Form & Hold -> Dismantle on Drops/Beats -> Reform on Quiet Passages" envelope:
    var cycleWave = Math.cos(state.t * 0.52)
    var baseForm = clamp((cycleWave + 0.38) / 0.88, 0.0, 1.0)
    var audioExcite = (cfg && cfg.musicDrive !== false)
        ? clamp(state.bassSmooth * 0.48 + state.beatSmooth * 0.55 + Math.max(0.0, state.energySmooth - 0.38) * 0.65, 0.0, 1.0)
        : 0.0
    var rawForm = clamp(baseForm * (1.0 - audioExcite * 0.62) + (1.0 - audioExcite) * 0.28, 0.0, 1.0)
    if ((state.artBurst || 0.0) > 0.12) {
        rawForm = clamp(rawForm - state.artBurst * 0.88, 0.0, 1.0)
    }
    state.l3FormFactor = lerp(state.l3FormFactor !== undefined ? state.l3FormFactor : 0.9, rawForm, clamp(dt * 4.5, 0.03, 0.18))
    var formFactor = state.l3FormFactor
    var dismantleGate = Math.pow(1.0 - formFactor, 1.30) * dismantle

    // During Hold phase (formFactor -> 1), evoMix -> 0 so particles form exact letters/art at (homeX, homeY)
    var evoMix = isWordsSource ? 0.0 : clamp((1.0 - formFactor) * 0.35 * evoRate, 0.0, 0.45)

    // Strong restoring spring during Form & Hold phase; responsive damping prevents overshoot
    var springK = (6.5 + 22.0 * formFactor) * clamp(rebuild, 0.35, 3.0)
    var damping = Math.exp(-dt * (5.5 + formFactor * 6.5 + rebuild * 1.5))

    for (var i = 0; i < n; i++) {
        var p = cells[i]
        var tx = lerp(p.homeX, p.evoX, evoMix)
        var ty = lerp(p.homeY, p.evoY, evoMix)

        var bIdx = (i * 3) & 63
        var bandVal = state.smoothBands[bIdx] || 0.0

        // Gentle breathing wave even while formed so the formed words feel alive without losing legibility
        var gentleBreath = 0.008 * (1.0 + state.bassSmooth * 0.8)
        tx += Math.sin(p.homeY * 4.0 + state.t * 1.2) * gentleBreath
        ty += Math.cos(p.homeX * 4.0 - state.t * 1.0) * gentleBreath

        if (l3Mode >= 6) {
            // Modes 6..11: Coherent readable musical warp & stretch modes (evaluated directly in drawLayer3AlbumArt)
            p.alive = 1.0
            tx = p.homeX
            ty = p.homeY
        } else if (dismantleGate > 0.02) {
            if (l3Mode === 0) {
                // Mode 0: Shatter & Reassemble
                var rx = p.homeX || 0.001
                var ry = p.homeY || 0.001
                var rDist = Math.sqrt(rx * rx + ry * ry) + 0.08
                var fault = Math.sin(p.homeX * 6.0 + p.homeY * 4.5 + state.t * 0.6)
                var shatter = (0.35 + bandVal * 0.85 + state.beatSmooth * 0.95) * dismantleGate * (0.4 + 0.6 * Math.abs(fault))
                p.vx += (rx / rDist + Math.sin(p.phase + state.t * 0.8) * 0.35) * shatter * dt * 2.4
                p.vy += (ry / rDist + Math.cos(p.phase - state.t * 0.8) * 0.35) * shatter * dt * 2.4
            } else if (l3Mode === 1) {
                // Mode 1: Cellular Automata & Mycelial Organic Growth
                var caAngle = Math.sin(p.x * 3.8 + state.t * 0.85) * Math.cos(p.y * 3.8 - state.t * 0.72) * Math.PI * 2
                var caPush = (0.25 + bandVal * 0.95 + state.midSmooth * 0.75) * dismantleGate
                p.vx += Math.cos(caAngle + p.phase) * caPush * dt * 2.0
                p.vy += Math.sin(caAngle + p.phase) * caPush * dt * 2.0
                p.alive = lerp(0.45 + 0.55 * Math.abs(Math.sin(state.t * 1.1 + p.gx * 0.35 + p.gy * 0.35)), 1.0, formFactor)
            } else if (l3Mode === 2) {
                // Mode 2: Blackhole Accretion & Supernova Ejection
                var bx = -p.x
                var by = -p.y
                var bDist = Math.sqrt(bx * bx + by * by) + 0.10
                var suckOrBlast = (state.beatSmooth > 0.45 || Math.sin(state.t * 0.55) < -0.5) ? -1.4 : 1.05
                var grav = dismantleGate * (0.40 + state.bassSmooth * 0.95) / (bDist * 0.85 + 0.35)
                p.vx += ((bx / bDist) * suckOrBlast - (by / bDist) * 1.2) * grav * dt * 1.5
                p.vy += ((by / bDist) * suckOrBlast + (bx / bDist) * 1.2) * grav * dt * 1.5
            } else if (l3Mode === 3) {
                // Mode 3: Tectonic Shear & Melted Acid Drizzle
                var strata = Math.floor((p.homeY + 1.0) * 6.0)
                var shearDir = (strata % 2 === 0) ? 1.0 : -1.0
                p.vx += shearDir * (0.3 + state.bassSmooth * 0.95 + bandVal * 0.8) * dismantleGate * dt * 2.0
                p.vy += (0.15 + state.highSmooth * 0.95 + bandVal * 0.8) * dismantleGate * dt * 1.5
            } else if (l3Mode === 4) {
                // Mode 4: Boids Swarm Flocking & Vortex Morph
                var flockX = Math.cos(state.t * 0.78 + (i % 5) * 1.25) * 0.52
                var flockY = Math.sin(state.t * 0.96 + (i % 5) * 1.25) * 0.52
                var dxF = flockX - p.x
                var dyF = flockY - p.y
                p.vx += (dxF * 1.5 - dyF * 1.8) * dismantleGate * (0.4 + state.energySmooth * 0.85) * dt
                p.vy += (dyF * 1.5 + dxF * 1.8) * dismantleGate * (0.4 + state.energySmooth * 0.85) * dt
            } else {
                // Mode 5: Omarchy TTE Keyframe Evolution + Wave Ripple
                var waveX = Math.sin(p.homeY * 5.0 + state.t * 1.4) * 0.22 * dismantleGate * (0.35 + state.bassSmooth * 0.85)
                var waveY = Math.cos(p.homeX * 5.0 - state.t * 1.2) * 0.22 * dismantleGate * (0.35 + state.midSmooth * 0.85)
                tx += waveX
                ty += waveY
            }
        } else {
            p.alive = 1.0
        }

        // Restoring spring toward letter/art home target (tx, ty)
        p.vx += (tx - p.x) * springK * dt
        p.vy += (ty - p.y) * springK * dt

        p.vx *= damping
        p.vy *= damping
        p.x = clamp(p.x + p.vx * dt, -1.65, 1.65)
        p.y = clamp(p.y + p.vy * dt, -1.65, 1.65)
    }
}

// ---------------------------------------------------------------------------
// LAYER #1 — 3 Independent Sub-Systems:
//   1. L1 Field (6 Volumetric Background Fields)
//   2. L1 Equaliser (Independent ON/OFF 6-Style Equaliser over ANY L1 Field)
//   3. L1 Beat Shapes (6 Audio-Reactive Shockwave Shape Styles, Spin, Speed, Scale)
// ---------------------------------------------------------------------------

function mapEqBandIndex(slot, totalSlots, layoutMode) {
    var norm = slot / Math.max(1, totalSlots - 1)
    if (layoutMode === 1) {
        // Centre-Out: Bass (band 0) in the centre, expanding symmetrically to highs at left/right edges
        var distFromCentre = Math.abs(norm - 0.5) * 2.0
        return clamp(Math.floor(distFromCentre * 63), 0, 63)
    }
    if (layoutMode === 2) {
        // Stereo Mirror: High->Low->High mirrored wings
        var wing = 1.0 - Math.abs(norm - 0.5) * 2.0
        return clamp(Math.floor(wing * 63), 0, 63)
    }
    // Default 0: Low->High left-to-right
    return clamp(Math.floor(norm * 63), 0, 63)
}

function sampleEqBandValue(state, bandIdx, dampingMode, eqGain) {
    var s = state.smoothBands[bandIdx] || 0.0
    var p = state.peakBands[bandIdx] || s
    var val = s
    if (dampingMode === 0) {
        // Snappy transient punch
        val = s * (1.0 + state.beatPulse * 0.45)
    } else if (dampingMode === 2) {
        // Peak-Hold weighted
        val = lerp(s, p, 0.65)
    } else {
        // Smooth liquid
        var prevB = state.smoothBands[Math.max(0, bandIdx - 1)] || s
        var nextB = state.smoothBands[Math.min(63, bandIdx + 1)] || s
        val = (prevB + s * 2.0 + nextB) * 0.25
    }
    return clamp(val * eqGain, 0.0, 1.6)
}

// True 3-axis 3D vertex rotation (rx = pitch, ry = yaw, rz = roll) + perspective projection
function project3DPoint(vx, vy, vz, rx, ry, rz, cx, cy, scale, fovDist) {
    // Rotate around Y (yaw)
    var cyaw = Math.cos(ry), syaw = Math.sin(ry)
    var x1 = vx * cyaw + vz * syaw
    var z1 = -vx * syaw + vz * cyaw
    var y1 = vy
    // Rotate around X (pitch)
    var cp = Math.cos(rx), sp = Math.sin(rx)
    var y2 = y1 * cp - z1 * sp
    var z2 = y1 * sp + z1 * cp
    var x2 = x1
    // Rotate around Z (roll)
    var cr = Math.cos(rz), sr = Math.sin(rz)
    var x3 = x2 * cr - y2 * sr
    var y3 = x2 * sr + y2 * cr
    var z3 = z2
    var fd = fovDist || 3.8
    var persp = fd / Math.max(0.45, fd - z3)
    return {
        x: cx + x3 * scale * persp,
        y: cy + y3 * scale * persp,
        z: z3,
        persp: persp
    }
}

// Appends a complete 1980 Atari Battlezone 3D Wireframe Tank (12-edge lower tread hull +
// 8-edge sloped glacis + 12-edge 360°-rotating 3D turret + elevating 3D gun barrel + spinning 3D radar dish)
// to the active ctx path, and returns the projected muzzle tip { x, y, dx, dy } for cannon shell firing.
function append3DWireframeTank(ctx, cx, cy, scale, rx, ry, rz, turretYawRel, gunElev, radarSpin) {
    // 1. Hull & Caterpillar Tracks (12 vertices: 0..3 bottom treads, 4..7 mid chine, 8..11 upper glacis deck)
    var hullV = [
        [-0.92,  0.36, -1.15], [ 0.92,  0.36, -1.15], [ 0.92,  0.36,  1.15], [-0.92,  0.36,  1.15],
        [-1.06,  0.08, -1.30], [ 1.06,  0.08, -1.30], [ 1.06,  0.08,  1.30], [-1.06,  0.08,  1.30],
        [-0.72, -0.16, -0.90], [ 0.72, -0.16, -0.90], [ 0.72, -0.16,  0.94], [-0.72, -0.16,  0.94]
    ]
    var hp = []
    for (var i = 0; i < hullV.length; i++) {
        hp.push(project3DPoint(hullV[i][0], hullV[i][1], hullV[i][2], rx, ry, rz, cx, cy, scale, 4.0))
    }
    var hullEdges = [
        // Bottom tread loop (4 edges)
        0, 1,  1, 2,  2, 3,  3, 0,
        // Mid chine loop (4 edges)
        4, 5,  5, 6,  6, 7,  7, 4,
        // Lower tread verticals (4 edges)
        0, 4,  1, 5,  2, 6,  3, 7,
        // Upper glacis deck loop (4 edges)
        8, 9,  9, 10, 10, 11, 11, 8,
        // Sloped glacis struts (4 edges)
        4, 8,  5, 9,  6, 10, 7, 11
    ]
    for (var he = 0; he < hullEdges.length; he += 2) {
        var pA = hp[hullEdges[he]], pB = hp[hullEdges[he + 1]]
        ctx.moveTo(pA.x, pA.y)
        ctx.lineTo(pB.x, pB.y)
    }

    // 2. 360° Rotating Polygonal 3D Turret (8 vertices: 0..3 turret base, 4..7 turret roof)
    var tYaw = ry + (turretYawRel || 0.0)
    var turV = [
        [-0.46, -0.16, -0.52], [ 0.46, -0.16, -0.52], [ 0.46, -0.16,  0.56], [-0.46, -0.16,  0.56],
        [-0.30, -0.48, -0.34], [ 0.30, -0.48, -0.34], [ 0.30, -0.48,  0.38], [-0.30, -0.48,  0.38]
    ]
    var tp = []
    for (var ti = 0; ti < turV.length; ti++) {
        tp.push(project3DPoint(turV[ti][0], turV[ti][1], turV[ti][2], rx, tYaw, rz, cx, cy, scale, 4.0))
    }
    var turEdges = [
        0, 1,  1, 2,  2, 3,  3, 0,
        4, 5,  5, 6,  6, 7,  7, 4,
        0, 4,  1, 5,  2, 6,  3, 7
    ]
    for (var te = 0; te < turEdges.length; te += 2) {
        var tA = tp[turEdges[te]], tB = tp[turEdges[te + 1]]
        ctx.moveTo(tA.x, tA.y)
        ctx.lineTo(tB.x, tB.y)
    }

    // 3. Elevating 3D Cannon Barrel (Twin parallel vector gun rails + muzzle cross-bar)
    var elev = clamp(gunElev || 0.12, -0.05, 0.55)
    var bLen = 1.42
    var tipY = -0.32 - Math.sin(elev) * bLen
    var tipZ = 0.48 + Math.cos(elev) * bLen
    var gL0 = project3DPoint(-0.06, -0.32, 0.48, rx, tYaw, rz, cx, cy, scale, 4.0)
    var gR0 = project3DPoint( 0.06, -0.32, 0.48, rx, tYaw, rz, cx, cy, scale, 4.0)
    var gL1 = project3DPoint(-0.04, tipY, tipZ, rx, tYaw, rz, cx, cy, scale, 4.0)
    var gR1 = project3DPoint( 0.04, tipY, tipZ, rx, tYaw, rz, cx, cy, scale, 4.0)
    ctx.moveTo(gL0.x, gL0.y); ctx.lineTo(gL1.x, gL1.y)
    ctx.moveTo(gR0.x, gR0.y); ctx.lineTo(gR1.x, gR1.y)
    ctx.moveTo(gL1.x, gL1.y); ctx.lineTo(gR1.x, gR1.y)

    // 4. Spinning 3D Radar Mast & Diamond Dish on Turret Roof
    var rMastBase = project3DPoint(0.0, -0.48, -0.10, rx, tYaw, rz, cx, cy, scale, 4.0)
    var rMastTop  = project3DPoint(0.0, -0.76, -0.10, rx, tYaw, rz, cx, cy, scale, 4.0)
    var rDishW = Math.cos(radarSpin || 0.0) * 0.24
    var rDishZ = Math.sin(radarSpin || 0.0) * 0.24
    var rLeft  = project3DPoint(-rDishW, -0.76, -0.10 - rDishZ, rx, tYaw, rz, cx, cy, scale, 4.0)
    var rRight = project3DPoint( rDishW, -0.76, -0.10 + rDishZ, rx, tYaw, rz, cx, cy, scale, 4.0)
    ctx.moveTo(rMastBase.x, rMastBase.y); ctx.lineTo(rMastTop.x, rMastTop.y)
    ctx.moveTo(rLeft.x, rLeft.y); ctx.lineTo(rRight.x, rRight.y)

    var muzzleMidX = (gL1.x + gR1.x) * 0.5
    var muzzleMidY = (gL1.y + gR1.y) * 0.5
    var breechMidX = (gL0.x + gR0.x) * 0.5
    var breechMidY = (gL0.y + gR0.y) * 0.5
    return {
        x: muzzleMidX,
        y: muzzleMidY,
        dx: muzzleMidX - breechMidX,
        dy: muzzleMidY - breechMidY
    }
}

// Appends a 1983 Atari Color-QuadraScan XY Vector Star Wars spacecraft to the active ctx path:
//   variant 0: Standard TIE Fighter (3D octahedron/hexagon central ball cockpit + smaller front octagon window +
//              horizontal axle struts + vertical elongated hexagonal wings divided into 6 triangular segments by radial spokes)
//   variant 1: Darth Vader's TIE Advanced x1 (central ball cockpit + front octagon window + horizontal axle struts +
//              angled/bent [ ] bracket solar wings with radial internal spokes)
//   variant 2: Rebel X-Wing Starfighter (tapered hexagonal fuselage + canopy ridge + 4 S-Foil wings + 4 wingtip laser cannons)
function append3DStarWarsFighter(ctx, variant, cx, cy, scale, rx, ry, rz) {
    var vMode = ((variant % 3) + 3) % 3
    if (vMode === 2) {
        var xwFus = [
            [ 0.0,  -0.14,  0.88], // 0: Nose cone tip
            [ 0.18, -0.10, -0.15], // 1: Right cockpit shoulder
            [ 0.14,  0.10, -0.68], // 2: Right rear engine block
            [-0.14,  0.10, -0.68], // 3: Left rear engine block
            [-0.18, -0.10, -0.15], // 4: Left cockpit shoulder
            [ 0.0,  -0.26, -0.22]  // 5: Canopy dorsal ridge
        ]
        var xp = []
        for (var xfi = 0; xfi < xwFus.length; xfi++) {
            xp.push(project3DPoint(xwFus[xfi][0], xwFus[xfi][1], xwFus[xfi][2], rx, ry, rz, cx, cy, scale, 3.6))
        }
        var xFusEdges = [0, 1,  1, 2,  2, 3,  3, 4,  4, 0,  0, 5,  5, 2,  5, 3,  1, 5,  4, 5]
        for (var xfe = 0; xfe < xFusEdges.length; xfe += 2) {
            ctx.moveTo(xp[xFusEdges[xfe]].x, xp[xFusEdges[xfe]].y)
            ctx.lineTo(xp[xFusEdges[xfe + 1]].x, xp[xFusEdges[xfe + 1]].y)
        }
        for (var wxS = -1; wxS <= 1; wxS += 2) {
            for (var wyS = -1; wyS <= 1; wyS += 2) {
                var rF = project3DPoint(wxS * 0.15, wyS * 0.06, -0.18, rx, ry, rz, cx, cy, scale, 3.6)
                var rR = project3DPoint(wxS * 0.14, wyS * 0.08, -0.58, rx, ry, rz, cx, cy, scale, 3.6)
                var tF = project3DPoint(wxS * 0.96, wyS * 0.44, -0.14, rx, ry, rz, cx, cy, scale, 3.6)
                var tR = project3DPoint(wxS * 0.96, wyS * 0.52, -0.48, rx, ry, rz, cx, cy, scale, 3.6)
                var cT = project3DPoint(wxS * 0.96, wyS * 0.44,  0.50, rx, ry, rz, cx, cy, scale, 3.6)
                ctx.moveTo(rF.x, rF.y); ctx.lineTo(tF.x, tF.y); ctx.lineTo(tR.x, tR.y); ctx.lineTo(rR.x, rR.y); ctx.closePath()
                ctx.moveTo(tR.x, tR.y); ctx.lineTo(cT.x, cT.y)
            }
        }
        return
    }

    // 1. Central 3D wireframe octahedron/octagon ball cockpit + smaller front octagon viewport window + radial viewport spokes
    var ballR = 0.28
    var winR = 0.14
    var outerRing = []
    var innerWin = []
    for (var bi = 0; bi < 8; bi++) {
        var ba = (bi / 8.0) * Math.PI * 2 + (Math.PI / 8.0)
        var ca = Math.cos(ba), sa = Math.sin(ba)
        outerRing.push(project3DPoint(ca * ballR, sa * ballR, 0.0, rx, ry, rz, cx, cy, scale, 3.6))
        innerWin.push(project3DPoint(ca * winR, sa * winR, 0.20, rx, ry, rz, cx, cy, scale, 3.6))
    }
    for (var b0 = 0; b0 < 8; b0++) {
        var b1 = (b0 + 1) & 7
        ctx.moveTo(outerRing[b0].x, outerRing[b0].y); ctx.lineTo(outerRing[b1].x, outerRing[b1].y)
        ctx.moveTo(innerWin[b0].x, innerWin[b0].y);   ctx.lineTo(innerWin[b1].x, innerWin[b1].y)
        ctx.moveTo(innerWin[b0].x, innerWin[b0].y);   ctx.lineTo(outerRing[b0].x, outerRing[b0].y)
    }

    // 2. Horizontal axle struts connecting the central cockpit ball to left and right wing hubs
    var wingX = (vMode === 1) ? 0.78 : 0.74
    var pL0 = project3DPoint(-ballR, 0.0, 0.0, rx, ry, rz, cx, cy, scale, 3.6)
    var pL1 = project3DPoint(-wingX, 0.0, 0.0, rx, ry, rz, cx, cy, scale, 3.6)
    var pR0 = project3DPoint( ballR, 0.0, 0.0, rx, ry, rz, cx, cy, scale, 3.6)
    var pR1 = project3DPoint( wingX, 0.0, 0.0, rx, ry, rz, cx, cy, scale, 3.6)
    ctx.moveTo(pL0.x, pL0.y); ctx.lineTo(pL1.x, pL1.y)
    ctx.moveTo(pR0.x, pR0.y); ctx.lineTo(pR1.x, pR1.y)

    // 3. Solar array wings with internal radiating spokes from the centre hub
    for (var side = -1; side <= 1; side += 2) {
        var hubPt = (side < 0) ? pL1 : pR1
        if (vMode === 0) {
            // Standard TIE Fighter: Flat, vertical elongated hexagon divided into 6 triangular segments by internal spokes
            var hexV = [
                [side * wingX,  0.00,  0.54], // 0: Front middle apex
                [side * wingX, -0.76,  0.34], // 1: Top-front corner
                [side * wingX, -0.76, -0.34], // 2: Top-rear corner
                [side * wingX,  0.00, -0.54], // 3: Rear middle apex
                [side * wingX,  0.76, -0.34], // 4: Bottom-rear corner
                [side * wingX,  0.76,  0.34]  // 5: Bottom-front corner
            ]
            var hp = []
            for (var hi = 0; hi < 6; hi++) {
                hp.push(project3DPoint(hexV[hi][0], hexV[hi][1], hexV[hi][2], rx, ry, rz, cx, cy, scale, 3.6))
            }
            for (var h0 = 0; h0 < 6; h0++) {
                var h1 = (h0 + 1) % 6
                // Outer hexagon perimeter segment
                ctx.moveTo(hp[h0].x, hp[h0].y); ctx.lineTo(hp[h1].x, hp[h1].y)
                // Internal spoke radiating from centre wing hub (dividing wing into 6 triangular segments)
                ctx.moveTo(hubPt.x, hubPt.y);   ctx.lineTo(hp[h0].x, hp[h0].y)
            }
        } else {
            // Darth Vader's TIE Advanced x1: Angled/bent top and bottom panels forming a [ ] bracket profile head-on
            var vadV = [
                [side * wingX,  0.00,  0.56], // 0: Centre-front apex
                [side * wingX, -0.32,  0.44], // 1: Upper-knuckle front
                [side * 0.50,  -0.74,  0.36], // 2: Bent top-tip front
                [side * 0.50,  -0.74, -0.36], // 3: Bent top-tip rear
                [side * wingX, -0.32, -0.44], // 4: Upper-knuckle rear
                [side * wingX,  0.00, -0.56], // 5: Centre-rear apex
                [side * wingX,  0.32, -0.44], // 6: Lower-knuckle rear
                [side * 0.50,   0.74, -0.36], // 7: Bent bottom-tip rear
                [side * 0.50,   0.74,  0.36], // 8: Bent bottom-tip front
                [side * wingX,  0.32,  0.44]  // 9: Lower-knuckle front
            ]
            var vp = []
            for (var vi = 0; vi < vadV.length; vi++) {
                vp.push(project3DPoint(vadV[vi][0], vadV[vi][1], vadV[vi][2], rx, ry, rz, cx, cy, scale, 3.6))
            }
            for (var v0 = 0; v0 < vadV.length; v0++) {
                var v1 = (v0 + 1) % vadV.length
                ctx.moveTo(vp[v0].x, vp[v0].y); ctx.lineTo(vp[v1].x, vp[v1].y)
            }
            // Internal fold ribs + radial hub spokes
            ctx.moveTo(vp[1].x, vp[1].y); ctx.lineTo(vp[4].x, vp[4].y)
            ctx.moveTo(vp[9].x, vp[9].y); ctx.lineTo(vp[6].x, vp[6].y)
            var spokeIdx = [0, 1, 4, 5, 6, 9]
            for (var si = 0; si < spokeIdx.length; si++) {
                var spP = vp[spokeIdx[si]]
                ctx.moveTo(hubPt.x, hubPt.y); ctx.lineTo(spP.x, spP.y)
            }
        }
    }
}

// 1983 Atari Amplifone / Wells-Gardner Color-QuadraScan XY Vector CRT Dual-Pass Phosphor Glow Stroke
function strokeQuadraScanPass(ctx, hexColor, coreWidth, alpha, hotCore) {
    var a = clamp(alpha, 0.05, 1.0)
    // Pass 1: Wide outer CRT phosphor bloom halo
    ctx.strokeStyle = colourWithAlpha(hexColor, a * 0.36)
    ctx.lineWidth = coreWidth * 2.65
    ctx.stroke()
    // Pass 2: Crisp saturated QuadraScan neon vector beam
    ctx.strokeStyle = colourWithAlpha(hexColor, a)
    ctx.lineWidth = coreWidth
    ctx.stroke()
    // Optional Pass 3: White-hot electron-beam centre core for primary foreground vectors
    if (hotCore) {
        ctx.strokeStyle = colourWithAlpha("#FFFFFF", a * 0.48)
        ctx.lineWidth = Math.max(0.75, coreWidth * 0.42)
        ctx.stroke()
    }
}

// Multi-colour 1983 Atari Star Wars Color-QuadraScan 3D Fighter renderer:
//   - Solar array hexagonal/bent panels & 6 radial hub spokes in Red (#FF1111) / Yellow (#FFFF11)
//   - Central 3D spherical/octahedral cockpit pod & horizontal axle struts in Green (#11FF11)
//   - Front octagonal viewport window, 8 radial window spokes & laser tips in Cyan (#00FFFF)
function drawMultiColourStarWarsFighter(ctx, variant, cx, cy, scale, rx, ry, rz, strokeW, visAlpha, bloomDots, minXClamp, maxXClamp) {
    var vMode = ((variant % 3) + 3) % 3
    var hasClamp = (minXClamp !== undefined && maxXClamp !== undefined)
    function p3(vx, vy, vz) {
        var pt = project3DPoint(vx, vy, vz, rx, ry, rz, cx, cy, scale, 3.6)
        if (hasClamp) {
            pt.x = clamp(pt.x, minXClamp, maxXClamp)
        }
        return pt
    }

    if (vMode === 2) {
        // Rebel X-Wing Starfighter: Cyan fuselage + Red/Yellow S-Foil wings & 4 wingtip laser cannons
        var xwFus = [
            [ 0.0,  -0.14,  0.88],
            [ 0.18, -0.10, -0.15],
            [ 0.14,  0.10, -0.68],
            [-0.14,  0.10, -0.68],
            [-0.18, -0.10, -0.15],
            [ 0.0,  -0.26, -0.22]
        ]
        var xp = []
        for (var xfi = 0; xfi < xwFus.length; xfi++) {
            xp.push(p3(xwFus[xfi][0], xwFus[xfi][1], xwFus[xfi][2]))
        }
        ctx.beginPath()
        for (var wxS = -1; wxS <= 1; wxS += 2) {
            for (var wyS = -1; wyS <= 1; wyS += 2) {
                var rF = p3(wxS * 0.15, wyS * 0.06, -0.18)
                var rR = p3(wxS * 0.14, wyS * 0.08, -0.58)
                var tF = p3(wxS * 0.96, wyS * 0.44, -0.14)
                var tR = p3(wxS * 0.96, wyS * 0.52, -0.48)
                var cT = p3(wxS * 0.96, wyS * 0.44,  0.50)
                ctx.moveTo(rF.x, rF.y); ctx.lineTo(tF.x, tF.y); ctx.lineTo(tR.x, tR.y); ctx.lineTo(rR.x, rR.y); ctx.closePath()
                ctx.moveTo(tR.x, tR.y); ctx.lineTo(cT.x, cT.y)
                if (bloomDots) bloomDots.push({ x: cT.x, y: cT.y })
            }
        }
        strokeQuadraScanPass(ctx, "#FF1111", strokeW, visAlpha, true)

        ctx.beginPath()
        var xFusEdges = [0, 1,  1, 2,  2, 3,  3, 4,  4, 0,  0, 5,  5, 2,  5, 3,  1, 5,  4, 5]
        for (var xfe = 0; xfe < xFusEdges.length; xfe += 2) {
            ctx.moveTo(xp[xFusEdges[xfe]].x, xp[xFusEdges[xfe]].y)
            ctx.lineTo(xp[xFusEdges[xfe + 1]].x, xp[xFusEdges[xfe + 1]].y)
        }
        strokeQuadraScanPass(ctx, "#00FFFF", strokeW * 1.05, visAlpha, true)
        return
    }

    var ballR = 0.28
    var winR = 0.14
    var wingX = (vMode === 1) ? 0.78 : 0.74
    var pL0 = p3(-ballR, 0.0, 0.0)
    var pL1 = p3(-wingX, 0.0, 0.0)
    var pR0 = p3( ballR, 0.0, 0.0)
    var pR1 = p3( wingX, 0.0, 0.0)
    var pL0Top = p3(-ballR * 0.85, -0.07, 0.0), pL1Top = p3(-wingX, -0.05, 0.0)
    var pR0Top = p3( ballR * 0.85, -0.07, 0.0), pR1Top = p3( wingX, -0.05, 0.0)

    // Pass 1: Solar Array Wings & 6 Internal Radial Spokes in Red (#FF1111) / Yellow (#FFFF11)
    ctx.beginPath()
    for (var side = -1; side <= 1; side += 2) {
        var hubPt = (side < 0) ? pL1 : pR1
        if (vMode === 0) {
            var hexV = [
                [side * wingX,  0.00,  0.54],
                [side * wingX, -0.78,  0.35],
                [side * wingX, -0.78, -0.35],
                [side * wingX,  0.00, -0.54],
                [side * wingX,  0.78, -0.35],
                [side * wingX,  0.78,  0.35]
            ]
            var hp = []
            for (var hi = 0; hi < 6; hi++) {
                hp.push(p3(hexV[hi][0], hexV[hi][1], hexV[hi][2]))
            }
            for (var h0 = 0; h0 < 6; h0++) {
                var h1 = (h0 + 1) % 6
                ctx.moveTo(hp[h0].x, hp[h0].y); ctx.lineTo(hp[h1].x, hp[h1].y)
                ctx.moveTo(hubPt.x, hubPt.y);   ctx.lineTo(hp[h0].x, hp[h0].y)
            }
        } else {
            // Darth Vader's TIE Advanced x1: Angled/bent [ ] solar wings with internal fold ribs & radial spokes
            var vadV = [
                [side * wingX,  0.00,  0.56],
                [side * wingX, -0.34,  0.44],
                [side * 0.48,  -0.76,  0.36],
                [side * 0.48,  -0.76, -0.36],
                [side * wingX, -0.34, -0.44],
                [side * wingX,  0.00, -0.56],
                [side * wingX,  0.34, -0.44],
                [side * 0.48,   0.76, -0.36],
                [side * 0.48,   0.76,  0.36],
                [side * wingX,  0.34,  0.44]
            ]
            var vp = []
            for (var vi = 0; vi < vadV.length; vi++) {
                vp.push(p3(vadV[vi][0], vadV[vi][1], vadV[vi][2]))
            }
            for (var v0 = 0; v0 < vadV.length; v0++) {
                var v1 = (v0 + 1) % vadV.length
                ctx.moveTo(vp[v0].x, vp[v0].y); ctx.lineTo(vp[v1].x, vp[v1].y)
            }
            ctx.moveTo(vp[1].x, vp[1].y); ctx.lineTo(vp[4].x, vp[4].y)
            ctx.moveTo(vp[9].x, vp[9].y); ctx.lineTo(vp[6].x, vp[6].y)
            var spokeIdx = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            for (var si = 0; si < spokeIdx.length; si++) {
                var spP = vp[spokeIdx[si]]
                ctx.moveTo(hubPt.x, hubPt.y); ctx.lineTo(spP.x, spP.y)
            }
        }
    }
    strokeQuadraScanPass(ctx, vMode === 1 ? "#FFFF11" : "#FF1111", strokeW * 1.02, visAlpha * 0.94, false)

    // Pass 2: Central 3D Spherical Cockpit Ball & Tubular Wing Struts in QuadraScan Green (#11FF11)
    var outerRing = []
    var innerWin = []
    var latRing = []
    for (var bi = 0; bi < 8; bi++) {
        var ba = (bi / 8.0) * Math.PI * 2 + (Math.PI / 8.0)
        var ca = Math.cos(ba), sa = Math.sin(ba)
        outerRing.push(p3(ca * ballR, sa * ballR, 0.0))
        innerWin.push(p3(ca * winR, sa * winR, 0.22))
        latRing.push(p3(ca * ballR * 0.86, 0.0, sa * ballR * 0.86))
    }
    ctx.beginPath()
    for (var b0 = 0; b0 < 8; b0++) {
        var b1 = (b0 + 1) & 7
        ctx.moveTo(outerRing[b0].x, outerRing[b0].y); ctx.lineTo(outerRing[b1].x, outerRing[b1].y)
        ctx.moveTo(latRing[b0].x, latRing[b0].y);     ctx.lineTo(latRing[b1].x, latRing[b1].y)
    }
    ctx.moveTo(pL0.x, pL0.y);       ctx.lineTo(pL1.x, pL1.y)
    ctx.moveTo(pR0.x, pR0.y);       ctx.lineTo(pR1.x, pR1.y)
    ctx.moveTo(pL0Top.x, pL0Top.y); ctx.lineTo(pL1Top.x, pL1Top.y)
    ctx.moveTo(pR0Top.x, pR0Top.y); ctx.lineTo(pR1Top.x, pR1Top.y)
    strokeQuadraScanPass(ctx, "#11FF11", strokeW * 1.08, visAlpha * 0.96, true)

    // Pass 3: Front Octagonal Viewport Window & 8 Radial Viewport Spokes in QuadraScan Cyan (#00FFFF)
    ctx.beginPath()
    for (var w0 = 0; w0 < 8; w0++) {
        var w1 = (w0 + 1) & 7
        ctx.moveTo(innerWin[w0].x, innerWin[w0].y); ctx.lineTo(innerWin[w1].x, innerWin[w1].y)
        ctx.moveTo(innerWin[w0].x, innerWin[w0].y); ctx.lineTo(outerRing[w0].x, outerRing[w0].y)
    }
    strokeQuadraScanPass(ctx, "#00FFFF", strokeW * 0.95, visAlpha * 0.96, true)

    if (bloomDots) {
        var cFront = p3(0.0, 0.0, 0.24)
        bloomDots.push({ x: cFront.x, y: cFront.y }, { x: pL1.x, y: pL1.y }, { x: pR1.x, y: pR1.y })
    }
}

function drawLayer1Background(ctx, canvasItem, w, h, state, theme, palette, cfg) {
    var rawBgHex = (theme && theme.background) ? theme.background.toString() : "#06080e"
    var enabled = cfg ? Boolean(cfg.layer1Enabled) : true
    var fieldOn = cfg && cfg.layer1FieldEnabled !== undefined ? Boolean(cfg.layer1FieldEnabled) : true
    var eqOn = cfg && cfg.layer1EqEnabled !== undefined ? Boolean(cfg.layer1EqEnabled) : (cfg && Number(cfg.layer1Mode) === 4)
    var shapesOn = cfg && cfg.layer1ShapesEnabled !== undefined ? Boolean(cfg.layer1ShapesEnabled) : true
    var l2On = cfg ? Boolean(cfg.layer2Enabled) : true
    var l2BackdropOn = cfg ? Boolean(cfg.backdropEnabled) : false
    var l3On = cfg ? Boolean(cfg.layer3Enabled) : true
    var l1Mode = cfg ? ((Number(cfg.layer1Mode) || 0) % LAYER1_MODES.length) : 0
    var isStarWarsMode = Boolean(enabled && fieldOn && l1Mode === 5)
    var gpuHw = cfg && cfg.gpuShaderEnabled !== undefined ? Boolean(cfg.gpuShaderEnabled) : true
    var gpuOn = Boolean(gpuHw && l2BackdropOn)
    var bgHex = (isStarWarsMode && !gpuOn) ? "#000000" : rawBgHex

    // Detect any layer or L1 sub-system ON/OFF toggle so disabled layers clear from the persistent buffer immediately
    if (state.lastL1 !== enabled || state.lastL2 !== l2On || state.lastL3 !== l3On
        || state.lastL1Field !== fieldOn || state.lastL1Eq !== eqOn || state.lastL1Shapes !== shapesOn
        || state.lastGpuOn !== gpuOn || state.lastStarWarsMode !== isStarWarsMode) {
        state.lastL1 = enabled
        state.lastL2 = l2On
        state.lastL3 = l3On
        state.lastL1Field = fieldOn
        state.lastL1Eq = eqOn
        state.lastL1Shapes = shapesOn
        state.lastGpuOn = gpuOn
        state.lastStarWarsMode = isStarWarsMode
        state.clearFeedbackFrames = Math.max(state.clearFeedbackFrames || 0, 2)
    }

    if (gpuOn) {
        // When native GPU ShaderEffect is active behind vizCanvas, clear canvas to transparent
        // so the per-pixel GPU shader shines through cleanly!
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = 1.0
        ctx.clearRect(0, 0, w, h)
        if (!enabled) return
    } else if (!enabled || (state.clearFeedbackFrames && state.clearFeedbackFrames > 0)) {
        if (state.clearFeedbackFrames && state.clearFeedbackFrames > 0) {
            state.clearFeedbackFrames = state.clearFeedbackFrames - 1
        }
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = 1.0
        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = bgHex
        ctx.fillRect(0, 0, w, h)
        if (!enabled) return
    }

    var trail = cfg && cfg.layer1Trail !== undefined ? clamp(Number(cfg.layer1Trail), 0.10, 0.97) : 0.84
    var dim = cfg && cfg.layer1Dim !== undefined ? clamp(Number(cfg.layer1Dim), 0.0, 0.92) : 0.16
    var density = cfg && cfg.layer1Density !== undefined ? clamp(Number(cfg.layer1Density), 0.2, 3.0) : 1.0
    var l1T = state.l1Time !== undefined ? state.l1Time : state.t
    var l1Dir = (cfg && cfg.layer1Direction !== undefined) ? Number(cfg.layer1Direction) : 1
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t

    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)
    var diagR = Math.sqrt(w * w + h * h) * 0.68
    var endPt = computeTracerEndpoint(
        w,
        h,
        driftT,
        state.liveTracerDrift !== undefined ? state.liveTracerDrift : (cfg ? cfg.tracerDrift : 1.0),
        1.0
    )

    if (!gpuOn) {
        // Zero-copy persistent framebuffer trail fade (no QQuickCanvasItem::toImage() CPU deep copy!)
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = 1.0
        var veilAlpha = isStarWarsMode
            ? clamp(0.60 + dim * 0.36, 0.52, 0.96)
            : clamp((1.0 - trail) * 1.15 + dim * 0.35 + 0.16, 0.24, 0.72)
        ctx.fillStyle = colourWithAlpha(bgHex, veilAlpha)
        ctx.fillRect(0, 0, w, h)
    }

    var horizonY = Math.round(h * 0.50)
    var vanishX = cx + Math.sin(driftT * 0.42) * w * 0.14

    // Non-linear density curve (`minimal -> many`) so 0.25x..0.5x is genuinely minimal and 1.5x..2.0x is a dense swarm
    var denCurve = Math.pow(density, 1.55)

    // =========================================================================
    // SUB-SYSTEM 1: L1 FIELD (11 Volumetric Background Fields 0..10)
    // =========================================================================
    if (fieldOn) {
        if (l1Mode === 0) {
            // Mode 0: MilkDrop / Geiss 3D Expanding Logarithmic Warp Tunnel Web & Volumetric Curtains
            // Rings expand all the way past diagR so every ring moves towards the user and passes OFF the screen!
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var ringCount = Math.max(2, Math.min(14, Math.round(6 * denCurve)))
            var segs = 24
            var ringsPts = []
            var fract0 = (((l1T * 0.28) % 1.0) + 1.0) % 1.0
            for (var rIdx = 0; rIdx < ringCount; rIdx++) {
                var rProg = (rIdx + fract0) / ringCount
                var baseR = Math.pow(rProg, 1.85) * diagR * 1.18
                var ringCX = cx + endPt.dx * 0.65 * Math.pow(1.0 - rProg, 1.25)
                var ringCY = cy + endPt.dy * 0.65 * Math.pow(1.0 - rProg, 1.25)
                var rot = state.phase * (rIdx % 2 === 0 ? 0.30 : -0.30)
                var bFade0 = smoothstep(0.0, 0.22, rProg)
                var pts = []
                for (var s = 0; s <= segs; s++) {
                    var ang = (s / segs) * Math.PI * 2 + rot
                    var bVal = state.smoothBands[(s * 2 + rIdx * 7) & 63]
                    var rr = baseR * (1.0 + Math.sin(ang * 4.0 + l1T * 1.1) * 0.07 + bVal * 0.14)
                    pts.push({
                        x: ringCX + Math.cos(ang) * rr,
                        y: ringCY + Math.sin(ang) * rr,
                        prog: rProg,
                        fade: bFade0
                    })
                }
                ringsPts.push(pts)
            }

            // Translucent 3D warp-tunnel curtains between adjacent expanding rings
            for (var cIdx = 0; cIdx < ringCount - 1; cIdx++) {
                var r0 = ringsPts[cIdx]
                var r1 = ringsPts[cIdx + 1]
                var cFade = r0[0].fade
                if (cFade < 0.02) continue
                var pAlpha = (0.04 + r1[0].prog * 0.08 + state.bass * 0.05) * cFade * (1.0 - dim) * (gpuOn ? 0.55 : 1.0)
                ctx.fillStyle = colourWithAlpha(palette[(cIdx * 2) % palette.length], pAlpha)
                ctx.beginPath()
                for (var s0 = 0; s0 < segs; s0 += 2) {
                    ctx.moveTo(r0[s0].x, r0[s0].y)
                    ctx.lineTo(r0[s0 + 1].x, r0[s0 + 1].y)
                    ctx.lineTo(r1[s0 + 1].x, r1[s0 + 1].y)
                    ctx.lineTo(r1[s0].x, r1[s0].y)
                    ctx.closePath()
                }
                ctx.fill()
            }

            // Radial warp struts + glowing logarithmic tunnel rings
            for (var rIdx2 = 0; rIdx2 < ringCount; rIdx2++) {
                var rPts = ringsPts[rIdx2]
                var rFade2 = rPts[0].fade
                if (rFade2 < 0.02) continue
                var rb = rIdx2 % 3
                ctx.strokeStyle = colourWithAlpha(palette[(rb * 2 + 1) % palette.length], (0.26 + state.bass * 0.34) * rFade2 * (1.0 - dim))
                ctx.lineWidth = (1.5 + rb * 0.5 + state.bass * 1.4) * rFade2
                ctx.beginPath()
                for (var s2 = 0; s2 <= segs; s2++) {
                    if (s2 === 0) ctx.moveTo(rPts[s2].x, rPts[s2].y)
                    else ctx.lineTo(rPts[s2].x, rPts[s2].y)
                }
                if (rIdx2 > 0 && ringsPts[rIdx2 - 1][0].fade > 0.02) {
                    var prevPts = ringsPts[rIdx2 - 1]
                    for (var sr = 0; sr < segs; sr += 3) {
                        ctx.moveTo(prevPts[sr].x, prevPts[sr].y)
                        ctx.lineTo(rPts[sr].x, rPts[sr].y)
                    }
                }
                ctx.stroke()
            }
            ctx.restore()
        } else if (l1Mode === 1) {
            // Mode 1: G-Force 3D Polar FlowField Spiral Ribbons & Plasma Wakes from Moving Endpoint
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var focalX = cx + endPt.dx * 0.55
            var focalY = cy + endPt.dy * 0.55
            var fCount = Math.max(3, Math.min(32, Math.round(12 * denCurve)))
            var segSteps = 5
            for (var fb = 0; fb < 3; fb++) {
                var ribCol = palette[(fb * 3) % palette.length]
                ctx.fillStyle = colourWithAlpha(ribCol, (0.10 + state.mid * 0.14) * (1.0 - dim) * (gpuOn ? 0.55 : 1.0))
                ctx.strokeStyle = colourWithAlpha(palette[(fb * 3 + 1) % palette.length], (0.32 + state.mid * 0.32) * (1.0 - dim))
                ctx.lineWidth = 1.6 + state.bass * 1.2
                ctx.beginPath()
                for (var fi = fb; fi < fCount; fi += 3) {
                    var baseA = (fi / fCount) * Math.PI * 2 + fb * 0.65 + l1T * 0.28
                    var depthBase = (((fi * 0.17 + l1T * 0.22) % 0.78) + 0.78) % 0.78
                    var bVal1 = state.smoothBands[(fi * 3) & 63]
                    var curl = (0.20 + state.mid * 0.24) * (fi % 2 === 0 ? 1.0 : -1.0)
                    var leftX = [], leftY = [], rightX = [], rightY = []
                    for (var stp = 0; stp <= segSteps; stp++) {
                        var u = stp / segSteps
                        var dp = depthBase + u * (0.20 + bVal1 * 0.18)
                        var r = diagR * (0.03 + Math.pow(dp, 1.55) * 0.95)
                        var a = baseA + u * curl * 2.0
                        var ox = lerp(focalX, cx, Math.min(1.0, dp))
                        var oy = lerp(focalY, cy, Math.min(1.0, dp))
                        var px = ox + Math.cos(a) * r
                        var py = oy + Math.sin(a) * r
                        var halfW = (2.5 + u * 7.5 * (0.6 + bVal1)) * (1.0 - u * 0.35)
                        var nx = -Math.sin(a) * halfW
                        var ny = Math.cos(a) * halfW
                        leftX.push(px + nx)
                        leftY.push(py + ny)
                        rightX.push(px - nx)
                        rightY.push(py - ny)
                    }
                    ctx.moveTo(leftX[0], leftY[0])
                    for (var k = 1; k <= segSteps; k++) ctx.lineTo(leftX[k], leftY[k])
                    for (var k2 = segSteps; k2 >= 0; k2--) ctx.lineTo(rightX[k2], rightY[k2])
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }
            ctx.restore()
        } else if (l1Mode === 2) {
            // Mode 2: Cthugha 3D Volumetric Rave Flame Curtains & Rising Plasma Tongues
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var hist = state.waveHistory || []
            var flameSheets = 3
            for (var sh = flameSheets - 1; sh >= 0; sh--) {
                var shFrac = sh / flameSheets
                var snap = (hist.length > sh * 2 && hist[sh * 2] && hist[sh * 2].bands) ? hist[sh * 2].bands : state.smoothBands
                var baseY = h * (0.98 - shFrac * 0.12)
                ctx.fillStyle = colourWithAlpha(palette[(sh * 2 + 1) % palette.length], (0.12 + (1.0 - shFrac) * 0.12 + state.bass * 0.10) * (1.0 - dim) * (gpuOn ? 0.55 : 1.0))
                ctx.strokeStyle = colourWithAlpha(palette[(sh * 2) % palette.length], (0.38 + (1.0 - shFrac) * 0.32) * (1.0 - dim))
                ctx.lineWidth = 1.6 + (1.0 - shFrac) * 1.2
                ctx.beginPath()
                ctx.moveTo(0, h)
                for (var sb = 0; sb < 32; sb++) {
                    var u = sb / 31.0
                    var bv = snap[sb] !== undefined ? snap[sb] : (state.smoothBands[sb * 2] || 0.08)
                    var lick = Math.sin(sb * 0.7 + l1T * 1.5 - sh * 1.3) * 0.15 + 0.85
                    var fx = u * w + endPt.dx * 0.18 * shFrac
                    var fy = baseY - (bv * h * (0.26 + state.bass * 0.16) * density * lick)
                    ctx.lineTo(fx, fy)
                }
                ctx.lineTo(w, h)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            // Rising organic plasma flame tongues (curved diamond/teardrop plumes)
            var flames = state.flames || []
            var flameCount = Math.min(flames.length, Math.max(4, Math.round(flames.length * clamp(0.42 * denCurve, 0.08, 1.0))))
            for (var cBucket = 0; cBucket < 4; cBucket++) {
                ctx.fillStyle = colourWithAlpha(palette[(cBucket * 2) % palette.length], (0.14 + state.bass * 0.20) * (1.0 - dim) * (gpuOn ? 0.55 : 1.0))
                ctx.strokeStyle = colourWithAlpha(palette[(cBucket * 2 + 1) % palette.length], (0.26 + state.mid * 0.22) * (1.0 - dim))
                ctx.lineWidth = 1.2
                ctx.beginPath()
                for (var f = cBucket; f < flameCount; f += 4) {
                    var fm = flames[f]
                    var fx2 = fm.x * w + endPt.dx * 0.28 * (1.0 - fm.y)
                    var fy2 = fm.y * h
                    var fw = (w / 24.0) * (0.65 + fm.energy * 1.45) * clamp(density, 0.5, 1.8)
                    var fh = h * (0.07 + fm.energy * 0.20) * clamp(density, 0.5, 1.8)
                    var sway = Math.sin(l1T * 1.4 + f) * fw * 0.40
                    ctx.moveTo(fx2 + sway, fy2 - fh * 0.65)
                    ctx.lineTo(fx2 + fw * 0.5, fy2)
                    ctx.lineTo(fx2 - sway * 0.4, fy2 + fh * 0.45)
                    ctx.lineTo(fx2 - fw * 0.5, fy2)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()

                // Glowing rising embers detaching from the flame tips
                ctx.fillStyle = colourWithAlpha(palette[(cBucket * 2 + 2) % palette.length], (0.52 + state.high * 0.32) * (1.0 - dim))
                ctx.beginPath()
                for (var fe = cBucket; fe < flameCount; fe += 4) {
                    var fme = flames[fe]
                    var emberPhase = (((l1T * 0.16 + fe * 0.13) % 0.45) + 0.45) % 0.45
                    var emberY = (((fme.y - emberPhase) % 1.0) + 1.0) % 1.0 * h
                    var emberX = fme.x * w + Math.sin(l1T * 1.2 + fe * 1.7) * 14.0 + endPt.dx * 0.25 * (1.0 - emberY / h)
                    var er = 1.6 + fme.energy * 2.2
                    ctx.rect(emberX - er, emberY - er, er * 2.0, er * 2.0)
                }
                ctx.fill()
            }
            ctx.restore()
        } else if (l1Mode === 3) {
            // Mode 3: Relativistic 3D Starfield Warp & Volumetric Nebula Clouds
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var starOriginX = cx + endPt.dx * 0.60
            var starOriginY = cy + endPt.dy * 0.60

            // Volumetric 3D nebula cloud rings around warp origin
            var nebFract = (((l1T * 0.20) % 1.0) + 1.0) % 1.0
            for (var nb = 2; nb >= 0; nb--) {
                var nebProg = (nb + nebFract) / 3.0
                var nebR = diagR * (0.08 + Math.pow(nebProg, 1.5) * 0.72) * (1.0 + state.bass * 0.18)
                var nebX = lerp(starOriginX, cx, nebProg * 0.5)
                var nebY = lerp(starOriginY, cy, nebProg * 0.5)
                ctx.fillStyle = colourWithAlpha(palette[(nb * 3 + 1) % palette.length], (0.06 + (1.0 - nebProg) * 0.07) * (1.0 - dim) * (gpuOn ? 0.55 : 1.0))
                ctx.strokeStyle = colourWithAlpha(palette[(nb * 3) % palette.length], (0.20 + state.mid * 0.22) * (1.0 - dim))
                ctx.lineWidth = 1.4 + state.bass * 1.2
                ctx.beginPath()
                var nebSegs = 20
                for (var ns = 0; ns <= nebSegs; ns++) {
                    var na = (ns / nebSegs) * Math.PI * 2 + state.phase * (nb % 2 === 0 ? 0.25 : -0.25)
                    var nr = nebR * (1.0 + state.smoothBands[(ns * 3 + nb * 7) & 63] * 0.24)
                    var npx = nebX + Math.cos(na) * nr
                    var npy = nebY + Math.sin(na) * nr
                    if (ns === 0) ctx.moveTo(npx, npy)
                    else ctx.lineTo(npx, npy)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            // Relativistic hyperspace star streaks + glowing star heads
            var starLimit = Math.min(state.stars.length, Math.max(9, Math.round(72 * denCurve)))
            for (var sbk = 0; sbk < 3; sbk++) {
                var stCol = palette[(sbk * 3) % palette.length]
                ctx.strokeStyle = colourWithAlpha(stCol, (0.52 + state.high * 0.42) * (1.0 - dim))
                ctx.fillStyle = colourWithAlpha(palette[(sbk * 3 + 1) % palette.length], (0.75 + state.bass * 0.25) * (1.0 - dim))
                ctx.lineWidth = 1.5 + sbk * 0.5 + state.bass * 1.2
                ctx.beginPath()
                for (var sIdx = sbk; sIdx < starLimit; sIdx += 3) {
                    var st = state.stars[sIdx]
                    var sx0 = starOriginX + (st.x / st.pz) * minDim * 0.55
                    var sy0 = starOriginY + (st.y / st.pz) * minDim * 0.55
                    var sx1 = starOriginX + (st.x / st.z) * minDim * 0.55
                    var sy1 = starOriginY + (st.y / st.z) * minDim * 0.55
                    ctx.moveTo(sx0, sy0)
                    ctx.lineTo(sx1, sy1)
                }
                ctx.stroke()

                // Glowing star head pinpoints on near stars
                ctx.beginPath()
                for (var sIdx2 = sbk; sIdx2 < starLimit; sIdx2 += 3) {
                    var st2 = state.stars[sIdx2]
                    if (st2.z > 0.55) continue
                    var hx = starOriginX + (st2.x / st2.z) * minDim * 0.55
                    var hy = starOriginY + (st2.y / st2.z) * minDim * 0.55
                    var hr = clamp((1.0 - st2.z) * 3.2, 1.2, 3.4)
                    ctx.rect(hx - hr, hy - hr, hr * 2.0, hr * 2.0)
                }
                ctx.fill()
            }
            ctx.restore()
        } else if (l1Mode === 4) {
            // Mode 4: TRON / Atari Battlezone Fixed-Horizon Scrolling 3D Vector Landscape!
            // Features:
            //   1. Rock-steady fixed horizon at `horizonY` (never bobs vertically!)
            //   2. Jagged Atari Battlezone vector mountain range + active volcano peak + vector crescent moon on the horizon
            //   3. True 1/z perspective ground grid scrolling smoothly at calibrated speed (`l1T * 0.095`) in Towards / Away / Breathe
            //   4. 3D wireframe TRON / Battlezone pyramids, monolith blocks & tanks scaled by Content Density (`density`)
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var groundH = h - horizonY
            var panShift = Math.sin(driftT * 0.25) * w * 0.08

            // 1. Atari Battlezone Vector Crescent Moon & Distant Horizon Mountains above `horizonY`
            var moonX = w * 0.78 - panShift * 0.45
            var moonY = horizonY - Math.min(horizonY * 0.58, minDim * 0.26)
            var moonR = minDim * 0.055
            ctx.strokeStyle = colourWithAlpha(palette[1 % palette.length], (0.58 + state.high * 0.28) * (1.0 - dim))
            ctx.lineWidth = 1.6
            ctx.beginPath()
            for (var ma = 0; ma <= 16; ma++) {
                var mAng = -Math.PI * 0.65 + (ma / 16.0) * Math.PI * 1.3
                var mx = moonX + Math.cos(mAng) * moonR
                var my = moonY + Math.sin(mAng) * moonR
                if (ma === 0) ctx.moveTo(mx, my)
                else ctx.lineTo(mx, my)
            }
            for (var ma2 = 16; ma2 >= 0; ma2--) {
                var mAng2 = -Math.PI * 0.65 + (ma2 / 16.0) * Math.PI * 1.3
                var mx2 = moonX + moonR * 0.34 + Math.cos(mAng2) * moonR * 0.82
                var my2 = moonY + Math.sin(mAng2) * moonR * 0.88
                ctx.lineTo(mx2, my2)
            }
            ctx.closePath()
            ctx.stroke()

            // Jagged Atari Battlezone vector mountain silhouette + volcano crater along `horizonY`
            var mtnNodes = [
                0.00, 0.06,  0.06, 0.18,  0.11, 0.11,  0.18, 0.28,  0.24, 0.14,
                0.31, 0.22,  0.37, 0.08,  0.44, 0.34,  0.47, 0.31,  0.50, 0.35, // volcano crater at 0.44..0.50
                0.56, 0.09,  0.63, 0.24,  0.70, 0.13,  0.77, 0.29,  0.84, 0.12,
                0.91, 0.21,  0.96, 0.09,  1.00, 0.06
            ]
            var mtnMaxH = Math.min(horizonY * 0.55, h * 0.26)
            ctx.fillStyle = colourWithAlpha(palette[3 % palette.length], (0.09 + state.bass * 0.08) * (1.0 - dim) * (gpuOn ? 0.5 : 1.0))
            ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], (0.68 + state.bass * 0.28) * (1.0 - dim))
            ctx.lineWidth = 1.9 + state.bass * 1.0
            ctx.beginPath()
            ctx.moveTo(0, horizonY)
            for (var mn = 0; mn < mtnNodes.length; mn += 2) {
                var mnx = mtnNodes[mn] * w
                var mny = horizonY - mtnNodes[mn + 1] * mtnMaxH * (1.0 + state.bass * 0.12)
                ctx.lineTo(mnx, mny)
            }
            ctx.lineTo(w, horizonY)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()

            // Internal wireframe ridge facets on the Battlezone mountains + erupting Volcano Smoke/Lava Plume
            ctx.strokeStyle = colourWithAlpha(palette[2 % palette.length], (0.42 + state.mid * 0.28) * (1.0 - dim))
            ctx.lineWidth = 1.2
            ctx.beginPath()
            for (var mr = 2; mr < mtnNodes.length - 2; mr += 4) {
                var pkX = mtnNodes[mr] * w
                var pkY = horizonY - mtnNodes[mr + 1] * mtnMaxH * (1.0 + state.bass * 0.12)
                ctx.moveTo(pkX, pkY)
                ctx.lineTo(pkX + (mr % 8 === 2 ? -w * 0.035 : w * 0.035), horizonY)
            }
            // Erupting volcano crater plume particles (from battlezone_1980.html)
            var volcCraterX = 0.47 * w
            var volcCraterY = horizonY - 0.34 * mtnMaxH * (1.0 + state.bass * 0.12)
            for (var vp = 0; vp < 8; vp++) {
                var vpLife = (((l1T * 0.85 + vp * 0.125) % 1.0) + 1.0) % 1.0
                var vpSpread = (vp % 2 === 0 ? 1.0 : -1.0) * (0.3 + (vp % 3) * 0.35) * vpLife * w * 0.035
                var vpHeight = Math.sin(vpLife * Math.PI * 0.85) * mtnMaxH * (0.42 + state.bassSmooth * 0.28)
                var vpx = volcCraterX + vpSpread
                var vpy = volcCraterY - vpHeight
                ctx.moveTo(vpx - 2.5, vpy)
                ctx.lineTo(vpx + 2.5, vpy + 3.0)
            }
            ctx.stroke()

            // 2. True 1/z Perspective Checkered & Scrolling TRON / Battlezone Ground Grid below `horizonY`
            //    Fixed, clean grid spacing (rows = 16, cols = 18) with alternating perspective checkered floor tiles!
            var rows = 16
            var cols = 18
            var worldScroll = l1T * 0.095
            var scrollFract = (((worldScroll * rows) % 1.0) + 1.0) % 1.0
            var worldRowBase = Math.floor(worldScroll * rows)

            // Perspective checkered floor tiles marching towards/away from the viewer
            ctx.fillStyle = colourWithAlpha(palette[2 % palette.length], (0.09 + state.bass * 0.10) * (1.0 - dim) * (gpuOn ? 0.50 : 1.0))
            ctx.beginPath()
            for (var rf = 0; rf < rows - 1; rf++) {
                var u0 = (rf + scrollFract) / rows
                var u1 = (rf + 1.0 + scrollFract) / rows
                var p0 = Math.pow(u0, 2.05)
                var p1 = Math.pow(u1, 2.05)
                var y0 = horizonY + p0 * groundH
                var y1 = horizonY + p1 * groundH
                var rParity = ((rf - worldRowBase) & 1 + 2) & 1
                for (var cf = -8; cf < 8; cf++) {
                    if (((cf + rParity) & 1) !== 0) continue
                    var topX0 = vanishX + cf * (w * 0.014), topX1 = vanishX + (cf + 1) * (w * 0.014)
                    var botX0 = vanishX + cf * (w * 0.18),  botX1 = vanishX + (cf + 1) * (w * 0.18)
                    var x00 = lerp(topX0, botX0, p0), x01 = lerp(topX1, botX1, p0)
                    var x11 = lerp(topX1, botX1, p1), x10 = lerp(topX0, botX0, p1)
                    ctx.moveTo(x00, y0)
                    ctx.lineTo(x01, y0)
                    ctx.lineTo(x11, y1)
                    ctx.lineTo(x10, y1)
                    ctx.closePath()
                }
            }
            ctx.fill()

            // Crisp neon horizon line + scrolling transverse ground lines + longitudinal perspective lanes
            ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], (0.46 + state.bass * 0.38) * (1.0 - dim))
            ctx.lineWidth = 1.4 + state.bass * 1.1
            ctx.beginPath()
            ctx.moveTo(0, horizonY)
            ctx.lineTo(w, horizonY)
            for (var r = 0; r < rows; r++) {
                var uRow = (r + scrollFract) / rows
                var gy = horizonY + Math.pow(uRow, 2.05) * groundH
                ctx.moveTo(0, gy)
                ctx.lineTo(w, gy)
            }
            for (var c = -cols; c <= cols; c++) {
                var topX = vanishX + c * (w * 0.014)
                var botX = vanishX + c * (w * 0.18)
                ctx.moveTo(topX, horizonY)
                ctx.lineTo(botX, h)
            }
            ctx.stroke()

            // 3. Full 3-Axis 3D Wireframe Landscape & Airborne Models scaled by Field Density (`density`) and Shape Density (`shapeDenBz`)!
            //    - Non-linear minimal-to-many curve (`bzDenCurve`): 1 obstacle & 1 tank at 0.25x..0.5x up to 16 obstacles & 9 tanks at 2.0x+!
            //    - Shapes in Battlezone appear BOTH on the terrain AND flying/floating OFF the land in the 3D sky above the landscape!
            //    - 3D wireframe Battlezone tanks simultaneously roll across the ground plane firing vector shells!
            var activeShapeStyle = cfg && cfg.layer1ShapeStyle !== undefined ? ((Number(cfg.layer1ShapeStyle) || 0) % LAYER1_SHAPE_STYLES.length) : 0
            var shapeScaleBz = cfg && cfg.layer1ShapeScale !== undefined ? clamp(Number(cfg.layer1ShapeScale), 0.3, 2.5) : 1.0
            var shapeDenBz = cfg && cfg.layer1ShapeDensity !== undefined ? clamp(Number(cfg.layer1ShapeDensity), 0.25, 2.5) : 1.0
            var bzDenCurve = Math.pow(density * shapeDenBz, 1.65)
            var obsCount = Math.max(1, Math.min(16, Math.round((shapesOn ? 3.5 : 2.5) * bzDenCurve)))
            var objSpinCfg = cfg && cfg.layer1ShapeSpin !== undefined ? clamp(Number(cfg.layer1ShapeSpin), -2.5, 2.5) : 1.0
            for (var ob = 0; ob < obsCount; ob++) {
                var obProg = ((((ob / obsCount) + worldScroll) % 1.0) + 1.0) % 1.0
                var horizonFade = smoothstep(0.0, 0.14, obProg)
                if (horizonFade < 0.02) continue
                var perspOb = Math.pow(obProg, 2.05) // 0 at horizon -> 1 at foreground bottom
                var sideSign = (ob % 2 === 0) ? -1.0 : 1.0
                var laneSpread = 0.20 + ((ob * 3) % 5) * 0.13
                var obX = vanishX + sideSign * laneSpread * w * (0.03 + perspOb * 0.88)
                var obY = horizonY + perspOb * groundH * 1.05
                var obSizeMul = 0.55 + ((ob * 37) % 11) * 0.095
                var obScale = (5.5 + perspOb * minDim * 0.115) * (1.0 + state.bass * 0.16) * Math.sqrt(shapeScaleBz) * obSizeMul
                // Allow a portion of Battlezone shapes to fly/float OFF the land in the 3D sky above the terrain & horizon!
                var isAirborne = shapesOn ? (ob % 2 === 0 || activeShapeStyle === 1) : (ob % 3 === 2)
                var skyAltitude = isAirborne
                    ? (minDim * (0.16 + 0.13 * ((ob * 3) % 3)) + Math.sin(l1T * 1.6 + ob * 1.9) * minDim * 0.05) * (0.42 + perspOb * 0.85)
                    : 0.0
                var hoverY = obY - obScale * (0.85 + 0.18 * Math.sin(l1T * 1.8 + ob * 2.1)) - skyAltitude

                // Full 3-axis 3D rotation angles (rx, ry, rz) with per-object polarity and speed variation
                var obSpinDir = (ob % 3 === 1) ? -1.0 : 1.0
                var ry = l1T * (0.75 + ((ob * 7) % 5) * 0.28) * obSpinDir * (objSpinCfg !== 0 ? objSpinCfg : 0.6) + ob * 1.57
                var rx = Math.sin(l1T * 0.72 + ob * 1.9) * 0.42 + (ob % 3 === 2 ? l1T * 0.65 * obSpinDir : 0.18)
                var rz = Math.cos(l1T * 0.64 + ob * 1.3) * 0.34

                ctx.strokeStyle = colourWithAlpha(palette[(1 + ob) % palette.length], (0.78 + state.high * 0.22) * horizonFade * (1.0 - dim))
                ctx.lineWidth = (1.5 + perspOb * 1.2 + state.bass * 0.8)
                ctx.beginPath()

                if (shapesOn && activeShapeStyle === 1) {
                    // Style 1: 1983 Atari Color-QuadraScan XY Vector Star Wars Craft (Standard TIE, Vader TIE Advanced x1, X-Wing)
                    var csBz = Math.max(7.0, obScale * 1.15)
                    append3DStarWarsFighter(ctx, ob % 3, obX, hoverY, csBz, rx * 0.6, ry, rz * 0.6)
                } else if (shapesOn && activeShapeStyle === 2) {
                    // Style 2: 3D TRON Recognizers marching & flying across the Battlezone grid
                    var rsBz = Math.max(8.0, obScale * 1.15)
                    var recBoxes = [
                        [-0.48, -0.88, -0.22,  0.48, -0.72, 0.22],
                        [-0.82, -0.62, -0.28,  0.82, -0.34, 0.28],
                        [-0.80, -0.34, -0.24, -0.44,  0.54, 0.24],
                        [ 0.44, -0.34, -0.24,  0.80,  0.54, 0.24],
                        [-0.96,  0.54, -0.32, -0.38,  0.72, 0.32],
                        [ 0.38,  0.54, -0.32,  0.96,  0.72, 0.32]
                    ]
                    var bEdgesBz = [0, 1,  1, 2,  2, 3,  3, 0,  4, 5,  5, 6,  6, 7,  7, 4,  0, 4,  1, 5,  2, 6,  3, 7]
                    for (var rbi = 0; rbi < recBoxes.length; rbi++) {
                        var bx = recBoxes[rbi]
                        var bvBz = [
                            [bx[0], bx[1], bx[2]], [bx[3], bx[1], bx[2]], [bx[3], bx[1], bx[5]], [bx[0], bx[1], bx[5]],
                            [bx[0], bx[4], bx[2]], [bx[3], bx[4], bx[2]], [bx[3], bx[4], bx[5]], [bx[0], bx[4], bx[5]]
                        ]
                        var bpRec = []
                        for (var bvi = 0; bvi < 8; bvi++) {
                            bpRec.push(project3DPoint(bvBz[bvi][0], bvBz[bvi][1], bvBz[bvi][2], rx * 0.4, ry, rz * 0.3, obX, hoverY, rsBz, 3.8))
                        }
                        for (var bei = 0; bei < bEdgesBz.length; bei += 2) {
                            ctx.moveTo(bpRec[bEdgesBz[bei]].x, bpRec[bEdgesBz[bei]].y)
                            ctx.lineTo(bpRec[bEdgesBz[bei + 1]].x, bpRec[bEdgesBz[bei + 1]].y)
                        }
                    }
                } else if (!shapesOn || activeShapeStyle === 0 || activeShapeStyle === 3) {
                    // Style 0/3 or Default Battlezone Obstacles: 3D Sacred Polyhedra (Pyramids, Monolith Cubes & Octahedra/Prisms)
                    if (ob % 3 === 1) {
                        var pyrV = [
                            [-1.0,  0.75, -1.0],
                            [ 1.0,  0.75, -1.0],
                            [ 1.0,  0.75,  1.0],
                            [-1.0,  0.75,  1.0],
                            [ 0.0, -1.15,  0.0]
                        ]
                        var pp = []
                        for (var pv = 0; pv < 5; pv++) {
                            pp.push(project3DPoint(pyrV[pv][0], pyrV[pv][1], pyrV[pv][2], rx, ry, rz, obX, hoverY, obScale, 3.8))
                        }
                        ctx.moveTo(pp[0].x, pp[0].y); ctx.lineTo(pp[1].x, pp[1].y); ctx.lineTo(pp[2].x, pp[2].y); ctx.lineTo(pp[3].x, pp[3].y); ctx.closePath()
                        for (var pc = 0; pc < 4; pc++) {
                            ctx.moveTo(pp[pc].x, pp[pc].y); ctx.lineTo(pp[4].x, pp[4].y)
                        }
                    } else if (ob % 3 === 0) {
                        var cubV = [
                            [-0.82,  0.88, -0.82], [ 0.82,  0.88, -0.82], [ 0.82,  0.88,  0.82], [-0.82,  0.88,  0.82],
                            [-0.82, -0.88, -0.82], [ 0.82, -0.88, -0.82], [ 0.82, -0.88,  0.82], [-0.82, -0.88,  0.82]
                        ]
                        var cp = []
                        for (var cv = 0; cv < 8; cv++) {
                            cp.push(project3DPoint(cubV[cv][0], cubV[cv][1], cubV[cv][2], rx, ry, rz, obX, hoverY, obScale, 3.8))
                        }
                        var cubEdges = [0, 1,  1, 2,  2, 3,  3, 0,  4, 5,  5, 6,  6, 7,  7, 4,  0, 4,  1, 5,  2, 6,  3, 7]
                        for (var ce = 0; ce < cubEdges.length; ce += 2) {
                            ctx.moveTo(cp[cubEdges[ce]].x, cp[cubEdges[ce]].y)
                            ctx.lineTo(cp[cubEdges[ce + 1]].x, cp[cubEdges[ce + 1]].y)
                        }
                    } else {
                        var sidesBz = 6 + (ob & 1) * 2
                        var topPtsBz = [], botPtsBz = []
                        for (var vBz = 0; vBz < sidesBz; vBz++) {
                            var angBz = (vBz / sidesBz) * Math.PI * 2
                            topPtsBz.push(project3DPoint(Math.cos(angBz), Math.sin(angBz),  0.42, rx, ry, rz, obX, hoverY, obScale * 1.15, 3.6))
                            botPtsBz.push(project3DPoint(Math.cos(angBz), Math.sin(angBz), -0.42, rx, ry, rz, obX, hoverY, obScale * 1.15, 3.6))
                        }
                        for (var v1B = 0; v1B <= sidesBz; v1B++) {
                            var pTB = topPtsBz[v1B % sidesBz]
                            if (v1B === 0) ctx.moveTo(pTB.x, pTB.y); else ctx.lineTo(pTB.x, pTB.y)
                        }
                        for (var v2B = 0; v2B <= sidesBz; v2B++) {
                            var pBB = botPtsBz[v2B % sidesBz]
                            if (v2B === 0) ctx.moveTo(pBB.x, pBB.y); else ctx.lineTo(pBB.x, pBB.y)
                        }
                        for (var v3B = 0; v3B < sidesBz; v3B++) {
                            ctx.moveTo(topPtsBz[v3B].x, topPtsBz[v3B].y)
                            ctx.lineTo(botPtsBz[v3B].x, botPtsBz[v3B].y)
                        }
                    }
                } else if (activeShapeStyle === 4) {
                    // Style 4: 3D Merkaba Starbursts (Dual-Apex 3D Star Tetrahedra hovering & flying over the terrain)
                    var pts2Bz = 12
                    var starRingBz = []
                    for (var svB = 0; svB < pts2Bz; svB++) {
                        var ang2B = (svB / pts2Bz) * Math.PI * 2
                        var r2B = (svB % 2 === 0) ? 1.0 : 0.48
                        var szB = (svB % 2 === 0) ? ((svB % 4 === 0) ? 0.32 : -0.32) : 0.0
                        var sPtB = project3DPoint(Math.cos(ang2B) * r2B, Math.sin(ang2B) * r2B, szB, rx, ry, rz, obX, hoverY, obScale * 1.2, 3.6)
                        starRingBz.push(sPtB)
                        if (svB === 0) ctx.moveTo(sPtB.x, sPtB.y); else ctx.lineTo(sPtB.x, sPtB.y)
                    }
                    ctx.closePath()
                    var apexFB = project3DPoint(0, 0,  0.68, rx, ry, rz, obX, hoverY, obScale * 1.2, 3.6)
                    var apexBB = project3DPoint(0, 0, -0.68, rx, ry, rz, obX, hoverY, obScale * 1.2, 3.6)
                    for (var sv2B = 0; sv2B < pts2Bz; sv2B += 2) {
                        ctx.moveTo(starRingBz[sv2B].x, starRingBz[sv2B].y); ctx.lineTo(apexFB.x, apexFB.y)
                        ctx.moveTo(starRingBz[sv2B].x, starRingBz[sv2B].y); ctx.lineTo(apexBB.x, apexBB.y)
                    }
                } else {
                    // Style 5: 3D Sonic Boom Rings (3D Gyroscopic Harmonic Portal Rings across the landscape & sky)
                    var ringSegsBz = 24
                    for (var rs2B = 0; rs2B <= ringSegsBz; rs2B++) {
                        var ang1B = (rs2B / ringSegsBz) * Math.PI * 2
                        var mod1B = 1.0 + Math.sin(ang1B * 4.0) * state.bass * 0.08
                        var rzWaveB = Math.sin(ang1B * 3.0 + l1T * 2.5) * 0.18 * (0.4 + state.bass)
                        var rp1B = project3DPoint(Math.cos(ang1B) * mod1B, Math.sin(ang1B) * mod1B, rzWaveB, rx * 0.65, ry * 0.65, rz, obX, hoverY, obScale * 1.25, 3.6)
                        if (rs2B === 0) ctx.moveTo(rp1B.x, rp1B.y); else ctx.lineTo(rp1B.x, rp1B.y)
                    }
                    ctx.closePath()
                }
                ctx.stroke()
            }

            // 4. 3D Wireframe 1980 Atari Battlezone Tanks Rolling on the Landscape + Cannon Shells!
            var tankCount = Math.max(1, Math.min(9, Math.round(2.5 * bzDenCurve)))
            var shellMuzzles = []
            for (var tk = 0; tk < tankCount; tk++) {
                var tkProg = ((((tk / tankCount) + worldScroll + 0.12) % 1.0) + 1.0) % 1.0
                var tkFade = smoothstep(0.0, 0.14, tkProg)
                if (tkFade < 0.02) continue
                var perspTk = Math.pow(tkProg, 2.05)
                var tkSide = (tk % 2 === 0) ? 1.0 : -1.0
                var tkSteer = Math.sin(l1T * 0.35 + tk * 2.3) * 0.10
                var tkLane = ((tk % 3) * 0.18 + 0.18) * tkSide + tkSteer
                var tkX = vanishX + tkLane * w * (0.04 + perspTk * 0.86)
                var tkY = horizonY + perspTk * groundH * 1.02
                var tkScale = (6.0 + perspTk * minDim * 0.115) * (1.0 + state.bass * 0.12)

                // Tank hull 3D orientation (steering yaw + terrain pitch + subtle suspension roll)
                var hullYaw = Math.sin(l1T * 0.42 + tk * 1.9) * 0.42 - tkSide * 0.22
                var hullPitch = 0.16 + Math.sin(l1T * 1.2 + tk) * 0.04
                var hullRoll = Math.cos(l1T * 0.9 + tk * 1.7) * 0.05
                var turretYawRel = Math.sin(l1T * 0.65 + tk * 2.4) * 0.85 + Math.cos(l1T * 0.28 + tk) * 0.45
                var gunElev = 0.12 + state.bassSmooth * 0.18 + state.beatPulse * 0.12
                var radarSpin = l1T * 2.8 + tk * 1.57

                ctx.strokeStyle = colourWithAlpha(palette[(tk * 2) % palette.length], (0.84 + state.bass * 0.16) * tkFade * (1.0 - dim))
                ctx.lineWidth = 1.6 + perspTk * 1.3 + state.beatPulse * 0.8
                ctx.beginPath()
                var muzzle = append3DWireframeTank(
                    ctx,
                    tkX,
                    tkY - tkScale * 0.34,
                    tkScale,
                    hullPitch,
                    hullYaw,
                    hullRoll,
                    turretYawRel,
                    gunElev,
                    radarSpin
                )
                ctx.stroke()

                if (tkProg > 0.16) {
                    shellMuzzles.push({
                        x: muzzle.x,
                        y: muzzle.y,
                        dx: muzzle.dx,
                        dy: muzzle.dy,
                        scale: tkScale,
                        fade: tkFade,
                        idx: tk
                    })
                }
            }

            // Audio-reactive vector cannon shells / tracer rounds firing from the Battlezone tank turrets!
            if (shellMuzzles.length > 0) {
                ctx.strokeStyle = colourWithAlpha("#fff3a1", (0.88 + state.beatPulse * 0.12) * (1.0 - dim))
                ctx.lineWidth = 2.0 + state.bass * 1.4
                ctx.beginPath()
                for (var sm = 0; sm < shellMuzzles.length; sm++) {
                    var mObj = shellMuzzles[sm]
                    var shotTravel = (((l1T * 0.95 + mObj.idx * 0.37) % 1.0) + 1.0) % 1.0
                    var sx0 = mObj.x + mObj.dx * (0.4 + shotTravel * 4.2)
                    var sy0 = mObj.y + mObj.dy * (0.4 + shotTravel * 4.2)
                    var sx1 = mObj.x + mObj.dx * (1.0 + shotTravel * 4.2)
                    var sy1 = mObj.y + mObj.dy * (1.0 + shotTravel * 4.2)
                    ctx.moveTo(sx0, sy0)
                    ctx.lineTo(sx1, sy1)
                    var flareR = Math.max(2.5, mObj.scale * 0.14 * (1.0 - shotTravel * 0.4))
                    ctx.moveTo(sx1 - flareR, sy1); ctx.lineTo(sx1 + flareR, sy1)
                    ctx.moveTo(sx1, sy1 - flareR); ctx.lineTo(sx1, sy1 + flareR)
                }
                ctx.stroke()
            }

            // 1980 Atari Battlezone 6-Sided 2-Tier Flying Saucer (Bonus 5,000 Pt Disc cruising across the plain)
            var saucerPhase = (l1T * 0.14) % 1.0
            var saucerX = lerp(w * 0.12, w * 0.88, saucerPhase)
            var saucerY = horizonY + h * (0.045 + 0.025 * Math.sin(l1T * 1.4))
            var saucerScale = Math.min(w, h) * 0.042
            var saucerSpin = l1T * 2.4
            ctx.strokeStyle = colourWithAlpha("#24FF44", (0.86 + state.treble * 0.14) * (1.0 - dim))
            ctx.lineWidth = 1.6 + state.beatPulse * 0.8
            ctx.beginPath()
            for (var si = 0; si < 6; si++) {
                var sa0 = saucerSpin + (si / 6) * Math.PI * 2
                var sa1 = saucerSpin + ((si + 1) / 6) * Math.PI * 2
                var rimX0 = saucerX + Math.cos(sa0) * saucerScale
                var rimY0 = saucerY + Math.sin(sa0) * saucerScale * 0.34
                var rimX1 = saucerX + Math.cos(sa1) * saucerScale
                var rimY1 = saucerY + Math.sin(sa1) * saucerScale * 0.34
                var domeX0 = saucerX + Math.cos(sa0) * saucerScale * 0.48
                var domeY0 = saucerY - saucerScale * 0.32 + Math.sin(sa0) * saucerScale * 0.16
                var domeX1 = saucerX + Math.cos(sa1) * saucerScale * 0.48
                var domeY1 = saucerY - saucerScale * 0.32 + Math.sin(sa1) * saucerScale * 0.16
                var baseX0 = saucerX + Math.cos(sa0) * saucerScale * 0.55
                var baseY0 = saucerY + saucerScale * 0.22 + Math.sin(sa0) * saucerScale * 0.18
                var baseX1 = saucerX + Math.cos(sa1) * saucerScale * 0.55
                var baseY1 = saucerY + saucerScale * 0.22 + Math.sin(sa1) * saucerScale * 0.18
                ctx.moveTo(rimX0, rimY0); ctx.lineTo(rimX1, rimY1)
                ctx.moveTo(domeX0, domeY0); ctx.lineTo(domeX1, domeY1)
                ctx.moveTo(baseX0, baseY0); ctx.lineTo(baseX1, baseY1)
                ctx.moveTo(rimX0, rimY0); ctx.lineTo(domeX0, domeY0)
                ctx.moveTo(rimX0, rimY0); ctx.lineTo(baseX0, baseY0)
            }
            ctx.stroke()

            // Authentic 1980 Atari Battlezone Top Red-Gel Circular Radar Scope & Direction Triangles
            var radarR = Math.min(w, h) * 0.068
            var radarCX = cx
            var radarCY = Math.max(radarR + 14, horizonY * 0.42)
            ctx.strokeStyle = colourWithAlpha("#FF2A1E", 0.78 * (1.0 - dim))
            ctx.lineWidth = 1.5
            ctx.beginPath()
            for (var rSeg = 0; rSeg < 24; rSeg++) {
                var ra0 = (rSeg / 24) * Math.PI * 2
                var ra1 = ((rSeg + 1) / 24) * Math.PI * 2
                ctx.moveTo(radarCX + Math.cos(ra0) * radarR, radarCY + Math.sin(ra0) * radarR)
                ctx.lineTo(radarCX + Math.cos(ra1) * radarR, radarCY + Math.sin(ra1) * radarR)
            }
            // Forward FOV wedge & cross ticks
            ctx.moveTo(radarCX, radarCY); ctx.lineTo(radarCX - Math.sin(0.46) * radarR, radarCY - Math.cos(0.46) * radarR)
            ctx.moveTo(radarCX, radarCY); ctx.lineTo(radarCX + Math.sin(0.46) * radarR, radarCY - Math.cos(0.46) * radarR)
            var sweepA = -l1T * 3.1
            ctx.moveTo(radarCX, radarCY); ctx.lineTo(radarCX + Math.cos(sweepA) * radarR, radarCY + Math.sin(sweepA) * radarR)
            // Enemy radar blips
            for (var rb = 0; rb < shellMuzzles.length; rb++) {
                var blipX = radarCX + ((shellMuzzles[rb].x - cx) / (w * 0.5)) * radarR * 0.65
                var blipY = radarCY - (1.0 - shellMuzzles[rb].fade * 0.65) * radarR * 0.72
                ctx.moveTo(blipX - 2.5, blipY - 2.5); ctx.lineTo(blipX + 2.5, blipY + 2.5)
                ctx.moveTo(blipX - 2.5, blipY + 2.5); ctx.lineTo(blipX + 2.5, blipY - 2.5)
            }
            ctx.stroke()

            // Authentic Green-Gel Periscope Sight & Rangefinder Stadia Reticle
            var stadiaSplit = (state.beatPulse > 0.35 || state.bass > 0.55) ? 0.0 : w * 0.014
            var sightY = horizonY + (h - horizonY) * 0.24
            var sightSpan = Math.min(w, h) * 0.095
            ctx.strokeStyle = colourWithAlpha("#24FF44", (0.52 + state.beatPulse * 0.38) * (1.0 - dim))
            ctx.lineWidth = 1.4
            ctx.beginPath()
            ctx.moveTo(cx, sightY - sightSpan * 1.35); ctx.lineTo(cx, sightY - sightSpan * 0.24)
            ctx.moveTo(cx, sightY + sightSpan * 0.24); ctx.lineTo(cx, sightY + sightSpan * 1.35)
            ctx.moveTo(cx - sightSpan, sightY); ctx.lineTo(cx - sightSpan * 0.24, sightY)
            ctx.moveTo(cx + sightSpan * 0.24, sightY); ctx.lineTo(cx + sightSpan, sightY)
            ctx.moveTo(cx - sightSpan * 0.45 - stadiaSplit, sightY - sightSpan * 0.58)
            ctx.lineTo(cx + sightSpan * 0.45 - stadiaSplit, sightY - sightSpan * 0.58)
            ctx.moveTo(cx - sightSpan * 0.45 + stadiaSplit, sightY + sightSpan * 0.58)
            ctx.lineTo(cx + sightSpan * 0.45 + stadiaSplit, sightY + sightSpan * 0.58)
            ctx.stroke()

            ctx.restore()
        } else if (l1Mode === 5) {
            // Mode 5: 1983 Atari Star Wars Color-QuadraScan XY Vector Arcade Experience (Open Viewport, Zero Cockpit)
            //   - Pure #000000 CRT Void + Dual-Pass QuadraScan Phosphor Glow (`strokeQuadraScanPass`) + White CRT Vertex Bloom Dots
            //   - Looming 3D Wireframe Death Star Sphere (#11FF11 Green) in upper sky with recessed Superlaser Dish & Equatorial Trench
            //   - Tall 3D Surface Defense Towers (#FFFF11 Yellow / #00FFFF Cyan / #FF1111 Red) & Trench Rim 3D Box Gun Turrets
            //   - Deep 3D Death Star Trench with Recessed Greeble Bays & 3D Cuboid X-Braced Girder Catwalk Blockades
            //   - Built-in Multi-Colour 3D TIE Fighter & Darth Vader TIE Advanced x1 Squadron Dogfighting in the Trench
            //   - Player X-Wing Quad Corner Laser Bolts (#FF1111 Red / #11FF11 Green) + Rotating 8-Pointed Star Fireballs + Thermal Exhaust Port
            ctx.save()
            ctx.globalCompositeOperation = "source-over"

            var bankAngle = Math.sin(driftT * 0.48) * 0.06
            var trenchVX = Math.sin(driftT * 0.42) * w * 0.06
            var camAlt = clamp(
                Math.sin(l1T * 0.82 + driftT * 0.35) * 0.60
                + Math.cos(l1T * 0.41 - driftT * 0.28) * 0.22
                + (state.bassSmooth - state.midSmooth) * 0.20,
                -0.88,
                0.88
            )

            ctx.translate(cx, cy)
            ctx.rotate(bankAngle)

            var halfWFar = w * 0.032
            var halfWNear = w * 0.54
            var halfHFar = h * 0.068
            var halfHNear = h * 1.12

            var vyFar = camAlt * h * 0.24
            var vyNear = camAlt * h * 0.50
            var yTFar = vyFar - halfHFar
            var yBFar = vyFar + halfHFar
            var yTNear = vyNear - halfHNear
            var yBNear = vyNear + halfHNear

            var sliceCount = 12
            var blockadeStride = density >= 1.55 ? 2 : (density <= 0.65 ? 4 : 3)
            var towerStride = density >= 1.45 ? 2 : (density <= 0.65 ? 4 : 3)
            var tFlow = l1T * 1.95
            var tScroll = ((tFlow % 1.0) + 1.0) % 1.0
            var baseWorldSlice = Math.floor(tFlow)
            var visAlpha = 1.0 - dim
            var strokeW = 1.65 + state.bass * 0.85

            var blockades = []
            var rimTurrets = []
            var surfaceTowers = []
            var bloomDots = []

            // 1. Yellow (#FFFF11) Single-Wall Longitudinal Trench Rails, Vertical Wall Ribs, Recessed 3D Greeble Bays & Tall 3D Surface Defense Towers
            ctx.beginPath()
            for (var wl = 1; wl <= 6; wl++) {
                var wf = wl / 6.0
                var yFarRail = lerp(yTFar, yBFar, wf)
                var yNearRail = lerp(yTNear, yBNear, wf)
                ctx.moveTo(trenchVX - halfWFar, yFarRail)
                ctx.lineTo(-halfWNear, yNearRail)
                ctx.moveTo(trenchVX + halfWFar, yFarRail)
                ctx.lineTo(halfWNear, yNearRail)
            }
            for (var sf = 0; sf < sliceCount; sf++) {
                var uS = (sf + tScroll) / sliceCount
                var pS = Math.pow(uS, 1.85)
                var vxs = trenchVX * (1.0 - pS)
                var xL = vxs - lerp(halfWFar, halfWNear, pS)
                var xR = vxs + lerp(halfWFar, halfWNear, pS)
                var yT = lerp(yTFar, yTNear, pS)
                var yB = lerp(yBFar, yBNear, pS)

                // Left & right vertical wall rib lines
                ctx.moveTo(xL, yT); ctx.lineTo(xL, yB)
                ctx.moveTo(xR, yT); ctx.lineTo(xR, yB)

                if (sf + 1 < sliceCount) {
                    var uNext = (sf + 1 + tScroll) / sliceCount
                    var pNext = Math.pow(uNext, 1.85)
                    var vxNext = trenchVX * (1.0 - pNext)
                    var xLNext = vxNext - lerp(halfWFar, halfWNear, pNext)
                    var xRNext = vxNext + lerp(halfWFar, halfWNear, pNext)
                    var yTNext = lerp(yTFar, yTNear, pNext)
                    var yBNext = lerp(yBFar, yBNear, pNext)

                    var wSlice = baseWorldSlice - sf
                    // Recessed 3D rectangular detail greeble bays on the left & right trench walls
                    if ((wSlice & 1) === 0) {
                        var yp0a = lerp(yT, yB, 0.18), yp0b = lerp(yT, yB, 0.82)
                        var yp1a = lerp(yTNext, yBNext, 0.18), yp1b = lerp(yTNext, yBNext, 0.82)
                        ctx.moveTo(xL, yp0a); ctx.lineTo(xLNext, yp1a); ctx.lineTo(xLNext, yp1b); ctx.lineTo(xL, yp0b); ctx.closePath()
                        ctx.moveTo(xR, yp0a); ctx.lineTo(xRNext, yp1a); ctx.lineTo(xRNext, yp1b); ctx.lineTo(xR, yp0b); ctx.closePath()
                        var ypMid0 = lerp(yT, yB, 0.50), ypMid1 = lerp(yTNext, yBNext, 0.50)
                        ctx.moveTo(xL, ypMid0); ctx.lineTo(xLNext, ypMid1)
                        ctx.moveTo(xR, ypMid0); ctx.lineTo(xRNext, ypMid1)
                    }

                    // Collect true 3D hexagonal-prism barrier beams spanning wall-to-wall across the tunnel
                    if (((wSlice % blockadeStride) + blockadeStride) % blockadeStride === 0 && uS > 0.10) {
                        var blkIdx = Math.floor(wSlice / blockadeStride)
                        var blkSlot = ((blkIdx % 3) + 3) % 3
                        var bFrac0 = blkSlot === 0 ? 0.17 : (blkSlot === 1 ? 0.43 : 0.67)
                        var bFrac1 = blkSlot === 0 ? 0.31 : (blkSlot === 1 ? 0.57 : 0.81)
                        var pRear = lerp(pS, pNext, 0.36)
                        var vxRear = trenchVX * (1.0 - pRear)
                        var xLRear = vxRear - lerp(halfWFar, halfWNear, pRear)
                        var xRRear = vxRear + lerp(halfWFar, halfWNear, pRear)
                        var yTRear = lerp(yTFar, yTNear, pRear)
                        var yBRear = lerp(yBFar, yBNear, pRear)
                        blockades.push({
                            xL0: xL,
                            xR0: xR,
                            y0: lerp(yT, yB, bFrac0),
                            y1: lerp(yT, yB, bFrac1),
                            xL1: xLRear,
                            xR1: xRRear,
                            y0Rear: lerp(yTRear, yBRear, bFrac0),
                            y1Rear: lerp(yTRear, yBRear, bFrac1),
                            p: pS,
                            slot: blkSlot
                        })
                    }

                    // Collect top-ledge 3D wireframe gun turrets along the left & right trench rims
                    if ((wSlice & 1) === 1 && uS > 0.16 && uS < 0.72) {
                        var pTurRear = lerp(pS, pNext, 0.42)
                        var vxTurRear = trenchVX * (1.0 - pTurRear)
                        var xLTurRear = vxTurRear - lerp(halfWFar, halfWNear, pTurRear)
                        var xRTurRear = vxTurRear + lerp(halfWFar, halfWNear, pTurRear)
                        var yTTurRear = lerp(yTFar, yTNear, pTurRear)
                        rimTurrets.push({
                            xL0: xL, xR0: xR, yT0: yT,
                            xL1: xLTurRear, xR1: xRTurRear, yT1: yTTurRear,
                            p: pS, wSlice: wSlice
                        })
                    }

                    // Collect tall 3D Surface Defense Towers rising from the upper Death Star surface deck
                    if (((wSlice % towerStride) + towerStride) % towerStride === 0 && uS > 0.14 && uS < 0.70) {
                        var pTowRear = lerp(pS, pNext, 0.48)
                        var vxTowRear = trenchVX * (1.0 - pTowRear)
                        var xLTowRear = vxTowRear - lerp(halfWFar, halfWNear, pTowRear)
                        var xRTowRear = vxTowRear + lerp(halfWFar, halfWNear, pTowRear)
                        var yTTowRear = lerp(yTFar, yTNear, pTowRear)
                        var span0 = xR - xL
                        var span1 = xRTowRear - xLTowRear
                        var towW0 = span0 * 0.13
                        var towW1 = span1 * 0.13
                        var hMul = 0.34 + ((Math.abs(wSlice) * 5) % 3) * 0.10
                        var towH0 = span0 * hMul
                        var towH1 = span1 * hMul
                        surfaceTowers.push({
                            lx0: clamp(xL - towW0 * 0.15, -halfWNear * 0.96, halfWNear * 0.96),
                            lx0In: clamp(xL + towW0 * 0.85, -halfWNear * 0.96, halfWNear * 0.96),
                            lx1: clamp(xLTowRear - towW1 * 0.15, -halfWNear * 0.96, halfWNear * 0.96),
                            lx1In: clamp(xLTowRear + towW1 * 0.85, -halfWNear * 0.96, halfWNear * 0.96),
                            rx0: clamp(xR + towW0 * 0.15, -halfWNear * 0.96, halfWNear * 0.96),
                            rx0In: clamp(xR - towW0 * 0.85, -halfWNear * 0.96, halfWNear * 0.96),
                            rx1: clamp(xRTowRear + towW1 * 0.15, -halfWNear * 0.96, halfWNear * 0.96),
                            rx1In: clamp(xRTowRear - towW1 * 0.85, -halfWNear * 0.96, halfWNear * 0.96),
                            yB0: yT, yT0: yT - towH0,
                            yB1: yTTowRear, yT1: yTTowRear - towH1,
                            p: pS
                        })
                    }
                }

                if (uS > 0.18 && uS < 0.80) {
                    bloomDots.push({ x: xL, y: yT }, { x: xR, y: yT }, { x: xL, y: yB }, { x: xR, y: yB })
                }
            }
            // Append tall 3D Surface Defense Tower vertical columns & cross-braced tiers to Yellow batch
            for (var sti = 0; sti < surfaceTowers.length; sti++) {
                var stw = surfaceTowers[sti]
                // Left tower 4 vertical columns + front X-brace
                ctx.moveTo(stw.lx0, stw.yB0);   ctx.lineTo(stw.lx0, stw.yT0)
                ctx.moveTo(stw.lx0In, stw.yB0); ctx.lineTo(stw.lx0In, stw.yT0)
                ctx.moveTo(stw.lx1, stw.yB1);   ctx.lineTo(stw.lx1, stw.yT1)
                ctx.moveTo(stw.lx1In, stw.yB1); ctx.lineTo(stw.lx1In, stw.yT1)
                ctx.moveTo(stw.lx0, stw.yB0);   ctx.lineTo(stw.lx0In, stw.yT0)
                ctx.moveTo(stw.lx0In, stw.yB0); ctx.lineTo(stw.lx0, stw.yT0)
                // Right tower 4 vertical columns + front X-brace
                ctx.moveTo(stw.rx0, stw.yB0);   ctx.lineTo(stw.rx0, stw.yT0)
                ctx.moveTo(stw.rx0In, stw.yB0); ctx.lineTo(stw.rx0In, stw.yT0)
                ctx.moveTo(stw.rx1, stw.yB1);   ctx.lineTo(stw.rx1, stw.yT1)
                ctx.moveTo(stw.rx1In, stw.yB1); ctx.lineTo(stw.rx1In, stw.yT1)
                ctx.moveTo(stw.rx0, stw.yB0);   ctx.lineTo(stw.rx0In, stw.yT0)
                ctx.moveTo(stw.rx0In, stw.yB0); ctx.lineTo(stw.rx0, stw.yT0)
            }
            strokeQuadraScanPass(ctx, "#FFFF11", strokeW, (0.84 + state.bass * 0.16) * visAlpha, false)

            // 2. Cyan (#00FFFF) Top Trench Rim Lip, Rim Gunbox Bases & Surface Tower Roof Decks
            ctx.beginPath()
            ctx.moveTo(trenchVX - halfWFar, yTFar); ctx.lineTo(-halfWNear, yTNear)
            ctx.moveTo(trenchVX + halfWFar, yTFar); ctx.lineTo(halfWNear, yTNear)
            for (var rt = 0; rt < rimTurrets.length; rt++) {
                var tur = rimTurrets[rt]
                var tw0 = (tur.xR0 - tur.xL0) * 0.085
                var tw1 = (tur.xR1 - tur.xL1) * 0.085
                var th0 = tw0 * 0.85
                var th1 = tw1 * 0.85
                var lx0 = tur.xL0, lx0In = tur.xL0 + tw0, ly0 = tur.yT0, ly0Top = tur.yT0 - th0
                var lx1 = tur.xL1, lx1In = tur.xL1 + tw1, ly1 = tur.yT1, ly1Top = tur.yT1 - th1
                ctx.moveTo(lx0, ly0);    ctx.lineTo(lx0In, ly0);    ctx.lineTo(lx0In, ly0Top); ctx.lineTo(lx0, ly0Top); ctx.closePath()
                ctx.moveTo(lx1, ly1);    ctx.lineTo(lx1In, ly1);    ctx.lineTo(lx1In, ly1Top); ctx.lineTo(lx1, ly1Top); ctx.closePath()
                ctx.moveTo(lx0, ly0Top); ctx.lineTo(lx1, ly1Top);   ctx.moveTo(lx0In, ly0Top); ctx.lineTo(lx1In, ly0Top)
                var rx0 = tur.xR0, rx0In = tur.xR0 - tw0, ry0 = tur.yT0, ry0Top = tur.yT0 - th0
                var rx1 = tur.xR1, rx1In = tur.xR1 - tw1, ry1 = tur.yT1, ry1Top = tur.yT1 - th1
                ctx.moveTo(rx0, ry0);    ctx.lineTo(rx0In, ry0);    ctx.lineTo(rx0In, ry0Top); ctx.lineTo(rx0, ry0Top); ctx.closePath()
                ctx.moveTo(rx1, ry1);    ctx.lineTo(rx1In, ry1);    ctx.lineTo(rx1In, ry1Top); ctx.lineTo(rx1, ry1Top); ctx.closePath()
                ctx.moveTo(rx0, ry0Top); ctx.lineTo(rx1, ry1Top);   ctx.moveTo(rx0In, ry0Top); ctx.lineTo(rx1In, ry1Top)
            }
            for (var stc = 0; stc < surfaceTowers.length; stc++) {
                var stwC = surfaceTowers[stc]
                var lMidY0 = lerp(stwC.yB0, stwC.yT0, 0.55), lMidY1 = lerp(stwC.yB1, stwC.yT1, 0.55)
                ctx.moveTo(stwC.lx0, stwC.yT0); ctx.lineTo(stwC.lx0In, stwC.yT0); ctx.lineTo(stwC.lx1In, stwC.yT1); ctx.lineTo(stwC.lx1, stwC.yT1); ctx.closePath()
                ctx.moveTo(stwC.lx0, lMidY0);   ctx.lineTo(stwC.lx0In, lMidY0);   ctx.lineTo(stwC.lx1In, lMidY1);   ctx.lineTo(stwC.lx1, lMidY1);   ctx.closePath()
                ctx.moveTo(stwC.rx0, stwC.yT0); ctx.lineTo(stwC.rx0In, stwC.yT0); ctx.lineTo(stwC.rx1In, stwC.yT1); ctx.lineTo(stwC.rx1, stwC.yT1); ctx.closePath()
                ctx.moveTo(stwC.rx0, lMidY0);   ctx.lineTo(stwC.rx0In, lMidY0);   ctx.lineTo(stwC.rx1In, lMidY1);   ctx.lineTo(stwC.rx1, lMidY1);   ctx.closePath()
            }
            strokeQuadraScanPass(ctx, "#00FFFF", strokeW * 1.12, (0.90 + state.high * 0.10) * visAlpha, true)

            // 3. Green (#11FF11) Looming 3D Wireframe Death Star Sphere in Upper Horizon + Scrolling Trench Floor Grid + Exhaust Port Bay
            ctx.beginPath()
            // 3A. Looming 3D Wireframe Death Star Sphere (latitude bands, longitude meridians, equatorial trench & Superlaser Dish)
            var dsR = minDim * (0.145 + state.bassSmooth * 0.025)
            var dsX = clamp(trenchVX * 0.65 - w * 0.18, -halfWNear * 0.65, halfWNear * 0.65)
            var dsY = Math.min(yTFar - dsR * 1.18, -h * 0.24)
            var dsSegs = 20
            for (var dsi = 0; dsi <= dsSegs; dsi++) {
                var dsa = (dsi / dsSegs) * Math.PI * 2
                var dspx = clamp(dsX + Math.cos(dsa) * dsR, -halfWNear * 0.95, halfWNear * 0.95)
                var dspy = dsY + Math.sin(dsa) * dsR
                if (dsi === 0) ctx.moveTo(dspx, dspy); else ctx.lineTo(dspx, dspy)
            }
            // Latitude rings & double Equatorial Trench band
            var latFracs = [-0.68, -0.36, -0.05, 0.05, 0.38, 0.70]
            for (var lfi = 0; lfi < latFracs.length; lfi++) {
                var lf = latFracs[lfi]
                var latY = dsY + lf * dsR
                var latHalfW = Math.sqrt(Math.max(0.0, 1.0 - lf * lf)) * dsR
                var latCurve = (1.0 - lf * lf) * dsR * 0.10
                for (var lsi = 0; lsi <= 10; lsi++) {
                    var lsu = (lsi / 10.0) * 2.0 - 1.0
                    var lxPt = clamp(dsX + lsu * latHalfW, -halfWNear * 0.95, halfWNear * 0.95)
                    var lyPt = latY + (1.0 - lsu * lsu) * latCurve
                    if (lsi === 0) ctx.moveTo(lxPt, lyPt); else ctx.lineTo(lxPt, lyPt)
                }
            }
            // Rotating 3D Longitude Meridians
            var dsRot = driftT * 0.24
            for (var mri = 0; mri < 5; mri++) {
                var mAng = dsRot + (mri / 5.0) * Math.PI
                var mHoriz = Math.cos(mAng) * dsR
                for (var msi = 0; msi <= 12; msi++) {
                    var mTheta = (msi / 12.0 - 0.5) * Math.PI
                    var mxPt = clamp(dsX + Math.cos(mTheta) * mHoriz, -halfWNear * 0.95, halfWNear * 0.95)
                    var myPt = dsY + Math.sin(mTheta) * dsR
                    if (msi === 0) ctx.moveTo(mxPt, myPt); else ctx.lineTo(mxPt, myPt)
                }
            }
            // Recessed circular Superlaser Dish in upper hemisphere with 8 radial focus spokes
            var dishX = dsX + dsR * 0.32
            var dishY = dsY - dsR * 0.28
            var dishR = dsR * 0.30
            for (var ddi = 0; ddi <= 12; ddi++) {
                var dda = (ddi / 12.0) * Math.PI * 2
                var ddx = clamp(dishX + Math.cos(dda) * dishR * 0.88, -halfWNear * 0.95, halfWNear * 0.95)
                var ddy = dishY + Math.sin(dda) * dishR
                if (ddi === 0) ctx.moveTo(ddx, ddy); else ctx.lineTo(ddx, ddy)
            }
            for (var dsp = 0; dsp < 8; dsp++) {
                var dspa = (dsp / 8.0) * Math.PI * 2
                ctx.moveTo(dishX, dishY)
                ctx.lineTo(clamp(dishX + Math.cos(dspa) * dishR * 0.88, -halfWNear * 0.95, halfWNear * 0.95), dishY + Math.sin(dspa) * dishR)
            }
            bloomDots.push({ x: dishX, y: dishY })

            // 3B. Longitudinal trench floor grid lanes & scrolling horizontal floor cross-lines
            for (var fl = 1; fl <= 3; fl++) {
                var ff = fl / 4.0
                ctx.moveTo(trenchVX + lerp(-halfWFar, halfWFar, ff), yBFar)
                ctx.lineTo(lerp(-halfWNear, halfWNear, ff), yBNear)
            }
            for (var sfFloor = 0; sfFloor < sliceCount; sfFloor++) {
                var uF = (sfFloor + tScroll) / sliceCount
                var pF = Math.pow(uF, 1.85)
                var vxF = trenchVX * (1.0 - pF)
                var xLF = vxF - lerp(halfWFar, halfWNear, pF)
                var xRF = vxF + lerp(halfWFar, halfWNear, pF)
                var yBF = lerp(yBFar, yBNear, pF)
                ctx.moveTo(xLF, yBF); ctx.lineTo(xRF, yBF)
            }
            // Far back-wall terminator & recessed square wireframe frame of the Thermal Exhaust Port
            ctx.moveTo(trenchVX - halfWFar, yTFar); ctx.lineTo(trenchVX + halfWFar, yTFar)
            ctx.lineTo(trenchVX + halfWFar, yBFar); ctx.lineTo(trenchVX - halfWFar, yBFar); ctx.closePath()
            var portFrameW = halfWFar * 0.56
            var portFrameY = lerp(yTFar, yBFar, 0.68)
            ctx.moveTo(trenchVX - portFrameW, portFrameY - portFrameW); ctx.lineTo(trenchVX + portFrameW, portFrameY - portFrameW)
            ctx.lineTo(trenchVX + portFrameW, portFrameY + portFrameW); ctx.lineTo(trenchVX - portFrameW, portFrameY + portFrameW); ctx.closePath()
            strokeQuadraScanPass(ctx, "#11FF11", strokeW * 1.04, (0.86 + state.bass * 0.14) * visAlpha, false)

            // 4. Red (#FF1111) True 3D Hexagonal Prism Barriers Spanning the Trench, Tower/Rim Laser Turret Tops & Rotating 8-Pointed Star Fireballs
            ctx.beginPath()
            for (var bj = 0; bj < blockades.length; bj++) {
                var blk = blockades[bj]
                // Build a 6-vertex 3D hexagonal cross-section ring at horizontal fraction uSpan (0 = left trench wall, 1 = right trench wall)
                var hexVertsAt = function(uSpan) {
                    var xFront = lerp(blk.xL0, blk.xR0, uSpan)
                    var xBack  = lerp(blk.xL1, blk.xR1, uSpan)
                    var xMid   = (xFront + xBack) * 0.5
                    var yTopF  = blk.y0
                    var yBotF  = blk.y1
                    var yTopB  = blk.y0Rear
                    var yBotB  = blk.y1Rear
                    var yMidF  = (yTopF + yBotF) * 0.5
                    var yMidB  = (yTopB + yBotB) * 0.5
                    // 6 vertices of the 3D hexagonal cross-section (Top-Front, Mid-Front nose, Bot-Front, Bot-Rear, Mid-Rear tail, Top-Rear)
                    return [
                        { x: lerp(xFront, xMid, 0.35), y: lerp(yTopF, yMidF, 0.16) },
                        { x: xFront,                   y: yMidF },
                        { x: lerp(xFront, xMid, 0.35), y: lerp(yBotF, yMidF, 0.16) },
                        { x: lerp(xBack,  xMid, 0.35), y: lerp(yBotB, yMidB, 0.16) },
                        { x: xBack,                    y: yMidB },
                        { x: lerp(xBack,  xMid, 0.35), y: lerp(yTopB, yMidB, 0.16) }
                    ]
                }
                var hL  = hexVertsAt(0.0)
                var hM1 = hexVertsAt(0.333)
                var hM2 = hexVertsAt(0.667)
                var hR  = hexVertsAt(1.0)

                // Draw the 4 hexagonal cross-section rings (left wall cap, 2 interior structural ribs, right wall cap)
                var hexRings = [hL, hM1, hM2, hR]
                for (var hri = 0; hri < hexRings.length; hri++) {
                    var hr = hexRings[hri]
                    ctx.moveTo(hr[0].x, hr[0].y)
                    for (var hvi = 1; hvi < 6; hvi++) {
                        ctx.lineTo(hr[hvi].x, hr[hvi].y)
                    }
                    ctx.closePath()
                }
                // Draw the 6 longitudinal prism edges running straight from the left wall hexagonal cap to the right wall hexagonal cap
                for (var hei = 0; hei < 6; hei++) {
                    ctx.moveTo(hL[hei].x, hL[hei].y)
                    ctx.lineTo(hR[hei].x, hR[hei].y)
                }

                if (blk.p < 0.78) {
                    bloomDots.push(
                        { x: hL[1].x, y: hL[1].y },
                        { x: hR[1].x, y: hR[1].y },
                        { x: hM1[1].x, y: hM1[1].y },
                        { x: hM2[1].x, y: hM2[1].y }
                    )
                }
            }
            // Angled gun turret tops & laser barrels on the trench rim turrets
            for (var rt2 = 0; rt2 < rimTurrets.length; rt2++) {
                var tur2 = rimTurrets[rt2]
                var tw2 = (tur2.xR0 - tur2.xL0) * 0.085
                var th2 = tw2 * 0.85
                var lGunX = tur2.xL0 + tw2 * 0.5, lGunY = tur2.yT0 - th2
                var rGunX = tur2.xR0 - tw2 * 0.5, rGunY = tur2.yT0 - th2
                ctx.moveTo(lGunX, lGunY); ctx.lineTo(lGunX + tw2 * 0.75, lGunY + th2 * 0.45)
                ctx.moveTo(rGunX, rGunY); ctx.lineTo(rGunX - tw2 * 0.75, rGunY + th2 * 0.45)
                bloomDots.push({ x: lGunX, y: lGunY }, { x: rGunX, y: rGunY })
            }
            // Pyramidal rotating laser turret crowns & twin barrels on the tall 3D Surface Defense Towers
            for (var stt = 0; stt < surfaceTowers.length; stt++) {
                var stwT = surfaceTowers[stt]
                var lApexX = (stwT.lx0 + stwT.lx0In + stwT.lx1 + stwT.lx1In) * 0.25
                var lApexY = (stwT.yT0 + stwT.yT1) * 0.5 - Math.abs(stwT.lx0In - stwT.lx0) * 0.55
                ctx.moveTo(stwT.lx0, stwT.yT0);   ctx.lineTo(lApexX, lApexY)
                ctx.moveTo(stwT.lx0In, stwT.yT0); ctx.lineTo(lApexX, lApexY)
                ctx.moveTo(stwT.lx1, stwT.yT1);   ctx.lineTo(lApexX, lApexY)
                ctx.moveTo(stwT.lx1In, stwT.yT1); ctx.lineTo(lApexX, lApexY)
                var rApexX = (stwT.rx0 + stwT.rx0In + stwT.rx1 + stwT.rx1In) * 0.25
                var rApexY = (stwT.yT0 + stwT.yT1) * 0.5 - Math.abs(stwT.rx0 - stwT.rx0In) * 0.55
                ctx.moveTo(stwT.rx0, stwT.yT0);   ctx.lineTo(rApexX, rApexY)
                ctx.moveTo(stwT.rx0In, stwT.yT0); ctx.lineTo(rApexX, rApexY)
                ctx.moveTo(stwT.rx1, stwT.yT1);   ctx.lineTo(rApexX, rApexY)
                ctx.moveTo(stwT.rx1In, stwT.yT1); ctx.lineTo(rApexX, rApexY)
                bloomDots.push({ x: lApexX, y: lApexY }, { x: rApexX, y: rApexY })
            }
            // Incoming rotating 8-pointed star/asterisk wireframe plasma fireballs (* in 3D)
            var fbCount = Math.max(1, Math.min(6, Math.round(2.5 * denCurve)))
            for (var fbi = 0; fbi < fbCount; fbi++) {
                var fbU = (((l1T * 0.72 + fbi * (1.0 / fbCount)) % 1.0) + 1.0) % 1.0
                if (fbU < 0.12 || fbU > 0.88) continue
                var fbP = Math.pow(fbU, 1.85)
                var fbSide = (fbi % 2 === 0) ? -1.0 : 1.0
                var fbX = clamp(trenchVX * (1.0 - fbP) + fbSide * lerp(halfWFar, halfWNear, fbP) * 0.34, -halfWNear * 0.90, halfWNear * 0.90)
                var fbY = lerp(lerp(yTFar, yBFar, 0.45), lerp(yTNear, yBNear, 0.48), fbP)
                var fbR = Math.max(4.0, (4.5 + fbP * minDim * 0.068) * (1.0 + state.beatPulse * 0.28))
                var fbRot = l1T * 6.5 + fbi * 1.1
                for (var spk = 0; spk < 8; spk++) {
                    var spkA = fbRot + (spk / 8.0) * Math.PI * 2
                    var spkNext = fbRot + (((spk + 3) % 8) / 8.0) * Math.PI * 2
                    ctx.moveTo(fbX, fbY)
                    ctx.lineTo(clamp(fbX + Math.cos(spkA) * fbR, -halfWNear * 0.95, halfWNear * 0.95), fbY + Math.sin(spkA) * fbR)
                    ctx.moveTo(clamp(fbX + Math.cos(spkA) * fbR * 0.82, -halfWNear * 0.95, halfWNear * 0.95), fbY + Math.sin(spkA) * fbR * 0.82)
                    ctx.lineTo(clamp(fbX + Math.cos(spkNext) * fbR * 0.42, -halfWNear * 0.95, halfWNear * 0.95), fbY + Math.sin(spkNext) * fbR * 0.42)
                }
                bloomDots.push({ x: fbX, y: fbY })
            }
            strokeQuadraScanPass(ctx, "#FF1111", strokeW * 1.15, (0.92 + state.beatPulse * 0.08) * visAlpha, true)

            // 5. Built-In Squadron of Multi-Colour 3D TIE Fighters & Darth Vader's Bent-Wing TIE Advanced x1 Dogfighting in the Trench
            var tieCount = Math.max(1, Math.min(6, Math.round(2.5 * denCurve)))
            var leadTargetX = trenchVX
            var leadTargetY = lerp(yTFar, yBFar, 0.46)
            for (var ti = tieCount - 1; ti >= 0; ti--) {
                var tieU = (((l1T * 0.34 + ti * (1.0 / tieCount)) % 1.0) + 1.0) % 1.0
                var tieDepth = 0.18 + tieU * 0.64
                var tieP = Math.pow(tieDepth, 1.65)
                var tieW = lerp(halfWFar, halfWNear, tieP)
                var tieSwayX = Math.sin(l1T * 1.45 + ti * 2.1) * tieW * (ti === 0 ? 0.28 : 0.48)
                var tieSwayY = Math.cos(l1T * 1.15 + ti * 1.7) * (lerp(yBFar, yBNear, tieP) - lerp(yTFar, yTNear, tieP)) * 0.16
                var tieX = clamp(trenchVX * (1.0 - tieP) + tieSwayX, -halfWNear * 0.76, halfWNear * 0.76)
                var tieY = lerp(lerp(yTFar, yBFar, 0.46), lerp(yTNear, yBNear, 0.44), tieP) + tieSwayY
                var tieScale = Math.max(11.0, minDim * (0.040 + tieP * 0.165) * (1.0 + state.bassSmooth * 0.12))
                var tiePitch = Math.sin(l1T * 1.2 + ti * 1.5) * 0.24
                var tieYaw = Math.cos(l1T * 1.1 + ti * 1.9) * 0.38
                var tieRoll = Math.sin(l1T * 1.6 + ti * 2.3) * 0.32
                var tieVar = (ti === 0) ? 1 : 0 // Lead fighter is Darth Vader's bent-wing TIE Advanced x1, flanked by Imperial TIE wingmen
                if (ti === 0) {
                    leadTargetX = tieX
                    leadTargetY = tieY
                }
                drawMultiColourStarWarsFighter(
                    ctx, tieVar, tieX, tieY, tieScale,
                    tiePitch, tieYaw, tieRoll,
                    strokeW * 1.04, visAlpha * clamp(0.65 + tieDepth * 0.45, 0.65, 1.0),
                    bloomDots, -halfWNear * 0.94, halfWNear * 0.94
                )
            }

            // 6. Player X-Wing Quad Corner Laser Bolts (Open Viewport, Zero Cockpit) Converging on Active Trench Target + Impact Sparks
            var corners = [
                { x: -halfWNear * 0.88, y: -h * 0.40 },
                { x:  halfWNear * 0.88, y: -h * 0.40 },
                { x: -halfWNear * 0.88, y:  h * 0.40 },
                { x:  halfWNear * 0.88, y:  h * 0.40 }
            ]
            var laserPulse = ((l1T * 2.8) % 1.0 + 1.0) % 1.0
            var laserPair = (Math.floor(l1T * 2.8) & 1)
            ctx.beginPath()
            for (var ci = 0; ci < 4; ci++) {
                var cOrig = corners[ci]
                var boltU0 = clamp(((laserPulse + (ci & 1) * 0.22) % 1.0) * 0.82, 0.04, 0.82)
                var boltU1 = clamp(boltU0 + 0.18 + state.bass * 0.08, 0.12, 0.96)
                var bx0 = lerp(cOrig.x, leadTargetX, boltU0)
                var by0 = lerp(cOrig.y, leadTargetY, boltU0)
                var bx1 = lerp(cOrig.x, leadTargetX, boltU1)
                var by1 = lerp(cOrig.y, leadTargetY, boltU1)
                ctx.moveTo(bx0, by0); ctx.lineTo(bx1, by1)
            }
            // Vector laser convergence cross-sparks on the target
            var sparkR = Math.max(4.5, minDim * (0.022 + state.beatPulse * 0.018))
            for (var spI = 0; spI < 6; spI++) {
                var spAng = l1T * 5.0 + (spI / 6.0) * Math.PI * 2
                ctx.moveTo(leadTargetX, leadTargetY)
                ctx.lineTo(
                    clamp(leadTargetX + Math.cos(spAng) * sparkR, -halfWNear * 0.94, halfWNear * 0.94),
                    leadTargetY + Math.sin(spAng) * sparkR
                )
            }
            strokeQuadraScanPass(ctx, laserPair === 0 ? "#FF1111" : "#11FF11", strokeW * 1.18, (0.88 + state.beatPulse * 0.12) * visAlpha, true)

            // 7. Magenta (#FF00FF) & White (#FFFFFF) Flashing Thermal Exhaust Port Octagon + Twin Proton Torpedoes
            ctx.beginPath()
            var octR = portFrameW * (0.62 + state.beatPulse * 0.18)
            for (var oi = 0; oi <= 8; oi++) {
                var oa = (oi / 8.0) * Math.PI * 2 + (Math.PI / 8.0)
                var ox = trenchVX + Math.cos(oa) * octR
                var oy = portFrameY + Math.sin(oa) * octR
                if (oi === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy)
            }
            // Twin Proton Torpedo star-bursts diving into the Thermal Exhaust Port
            var torpU = (((l1T * 0.95) % 1.0) + 1.0) % 1.0
            for (var tSide = -1; tSide <= 1; tSide += 2) {
                var txTorp = lerp(tSide * halfWNear * 0.22, trenchVX + tSide * octR * 0.35, torpU)
                var tyTorp = lerp(h * 0.32, portFrameY, torpU)
                var trTorp = Math.max(2.5, (1.0 - torpU * 0.65) * minDim * 0.024)
                for (var tSpk = 0; tSpk < 4; tSpk++) {
                    var tAng = l1T * 7.0 + (tSpk / 4.0) * Math.PI
                    ctx.moveTo(txTorp - Math.cos(tAng) * trTorp, tyTorp - Math.sin(tAng) * trTorp)
                    ctx.lineTo(txTorp + Math.cos(tAng) * trTorp, tyTorp + Math.sin(tAng) * trTorp)
                }
            }
            strokeQuadraScanPass(ctx, (Math.floor(l1T * 10.0) & 1) === 0 ? "#FF00FF" : "#FFFFFF", strokeW * 1.12, (0.94 + state.beatPulse * 0.06) * visAlpha, true)

            // 8. CRT Electron-Beam Vertex Bloom ("Vector Dots" at line intersections)
            ctx.fillStyle = colourWithAlpha("#FFFFFF", (0.90 + state.high * 0.10) * visAlpha)
            ctx.beginPath()
            var dotR = 1.65 + state.beatPulse * 0.75
            for (var di = 0; di < bloomDots.length; di++) {
                var bd = bloomDots[di]
                ctx.moveTo(bd.x + dotR, bd.y)
                ctx.arc(bd.x, bd.y, dotR, 0, Math.PI * 2)
            }
            ctx.fill()

            ctx.restore()
        } else if (l1Mode === 6) {
            // Mode 6: Relativistic Gargantua Black Hole — Infalling Spiral Accretion Vortex, Einstein Lensing Halo & Polar Jets
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var bhX = cx + endPt.dx * 0.35
            var bhY = cy + endPt.dy * 0.35
            var ehR = minDim * (0.11 + state.bassSmooth * 0.035)
            var tiltA = -0.24 + Math.sin(driftT * 0.38) * 0.14
            var palShift6 = Math.floor(state.hueShift / 45)

            ctx.translate(bhX, bhY)
            ctx.rotate(tiltA)

            // 1. Twin Relativistic Polar Pulsar Jets shooting out past diagR
            var jetReach = diagR * (0.75 + state.bassSmooth * 0.35)
            for (var pole = -1; pole <= 1; pole += 2) {
                ctx.strokeStyle = colourWithAlpha(palette[(pole < 0 ? 2 : 4 + palShift6) % palette.length], (0.38 + state.highSmooth * 0.35) * (1.0 - dim))
                ctx.lineWidth = 1.8 + state.bassSmooth * 1.6
                ctx.beginPath()
                for (var jStrand = -1; jStrand <= 1; jStrand++) {
                    for (var js = 0; js <= 14; js++) {
                        var ju = js / 14.0
                        var jy = pole * (ehR * 0.85 + Math.pow(ju, 1.25) * jetReach)
                        var jSpread = (ehR * 0.12 + Math.pow(ju, 1.4) * minDim * 0.18) * (1.0 + state.smoothBands[(js * 4) & 63] * 0.45)
                        var jx = Math.sin(ju * 9.0 - l1T * 4.5 + jStrand * 1.4) * jSpread
                        if (js === 0) ctx.moveTo(jx, jy)
                        else ctx.lineTo(jx, jy)
                    }
                }
                ctx.stroke()
            }

            // 2. Gravitational-Lensing Upper & Lower Einstein Halo Arches (rear disc bent over & under the shadow)
            for (var arch = -1; arch <= 1; arch += 2) {
                ctx.strokeStyle = colourWithAlpha(palette[(1 + palShift6) % palette.length], (0.52 + state.bassSmooth * 0.36) * (1.0 - dim))
                ctx.lineWidth = 2.2 + state.bassSmooth * 1.8
                ctx.beginPath()
                for (var as = 0; as <= 28; as++) {
                    var au = (as / 28.0) * Math.PI
                    var bHalo = state.smoothBands[(as * 2) & 63]
                    var archR = ehR * (1.08 + Math.sin(au) * (0.28 + bHalo * 0.22))
                    var ax = Math.cos(au) * archR * 1.35
                    var ay = arch * Math.sin(au) * archR * 0.95
                    if (as === 0) ctx.moveTo(ax, ay)
                    else ctx.lineTo(ax, ay)
                }
                ctx.stroke()
            }

            // 3. Infalling Logarithmic Spiral Matter Streams pulled from diagR into the Event Horizon
            var spiralArms = Math.max(3, Math.min(28, Math.round(12 * denCurve)))
            var inflowScroll = (((l1T * 0.55) % 1.0) + 1.0) % 1.0
            for (var arm = 0; arm < spiralArms; arm++) {
                var armCol = palette[(arm + palShift6) % palette.length]
                var armBaseA = (arm / spiralArms) * Math.PI * 2 - l1T * 0.65
                ctx.strokeStyle = colourWithAlpha(armCol, (0.42 + state.midSmooth * 0.38) * (1.0 - dim))
                ctx.lineWidth = 1.4 + state.bassSmooth * 1.2
                ctx.beginPath()
                for (var sp = 0; sp <= 16; sp++) {
                    var su = clamp((sp + 1.0 - inflowScroll) / 16.0, 0.02, 1.0)
                    var sr = ehR * 1.02 + Math.pow(su, 1.75) * (diagR - ehR)
                    // Frame-dragging angular acceleration as matter approaches r -> ehR
                    var sAng = armBaseA + 2.6 / (su + 0.18)
                    var sbv = state.smoothBands[(arm * 3 + sp * 2) & 63]
                    var sx = Math.cos(sAng) * sr * (1.0 + sbv * 0.08)
                    var sy = Math.sin(sAng) * sr * 0.44 * (1.0 + sbv * 0.08)
                    if (sp === 0) ctx.moveTo(sx, sy)
                    else ctx.lineTo(sx, sy)
                }
                ctx.stroke()
            }

            // 4. Pure Obsidian Event Horizon Singularity Core + White-Hot Asymmetric Photon Sphere
            ctx.fillStyle = "#010104"
            ctx.strokeStyle = colourWithAlpha("#fff5cc", (0.88 + state.beatSmooth * 0.12) * (1.0 - dim))
            ctx.lineWidth = 2.4 + state.bassSmooth * 2.0
            ctx.beginPath()
            ctx.arc(0, 0, ehR, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()

            ctx.restore()
        } else if (l1Mode === 7) {
            // Mode 7: 1982 TRON Game Grid (Robert Abel / MAGI Synthavision / Bally Midway Vector & CSG Engine)
            //   - True Cumulative 90-Degree (PI/2) World-Space Camera & Light Cycle Turns (`state.tronYaw`, `state.tronTargetYaw`)
            //   - Dense 80-Unit 3D Cyan/Blue Game Grid Floor (`cellSize = 80.0`) with Major 4-Cell Avenue Lines
            //   - World-Space 3D Recognizers (#FF1E38), MCP 14-Facet Cone (#FF1166) & I/O Tower, Rival (#FFAA00) & Player (#33FFFF) Light Cycles + Standing 90° Jetwalls
            //   - Authentic 1982 TRON Jetwall Collision & 3D Derezz Explosion (`state.tronCrashTimer`, `state.tronRivalCrashTimer`)
            ctx.save()
            ctx.globalCompositeOperation = "source-over"

            if (!gpuOn) {
                ctx.fillStyle = "rgba(1, 3, 10, " + clamp(0.84 - dim * 0.35, 0.45, 0.92).toFixed(3) + ")"
                ctx.fillRect(0, 0, w, h)
            }

            var camYaw = state.tronYaw || 0.0
            var bikeYaw = state.tronBikeYaw !== undefined
                ? state.tronBikeYaw
                : (state.tronTargetYaw !== undefined ? state.tronTargetYaw : camYaw)
            var bikeX = state.tronX || 0.0
            var bikeZ = state.tronZ || 0.0
            var playerTrail = (state.tronTrail && state.tronTrail.length >= 2) ? state.tronTrail : [[bikeX, bikeZ - 320.0], [bikeX, bikeZ]]
            var rivalTrail = (state.tronRivalTrail && state.tronRivalTrail.length >= 2) ? state.tronRivalTrail : [[bikeX + 160.0, bikeZ - 240.0], [bikeX + 160.0, bikeZ + 80.0]]
            var rivalX = state.tronRivalX !== undefined ? state.tronRivalX : rivalTrail[rivalTrail.length - 1][0]
            var rivalZ = state.tronRivalZ !== undefined ? state.tronRivalZ : rivalTrail[rivalTrail.length - 1][1]
            var rivalYaw = state.tronRivalYaw !== undefined
                ? state.tronRivalYaw
                : (state.tronRivalTargetYaw !== undefined ? state.tronRivalTargetYaw : bikeYaw)

            var camDist = 290.0
            var camX = (state.tronCamX !== undefined && isFinite(state.tronCamX))
                ? state.tronCamX
                : (bikeX - Math.sin(camYaw) * camDist)
            var camZ = (state.tronCamZ !== undefined && isFinite(state.tronCamZ))
                ? state.tronCamZ
                : (bikeZ - Math.cos(camYaw) * camDist)
            var camY = 132.0 + state.bassSmooth * 18.0
            var focal = minDim * 0.64
            var zNear = 14.0
            var zFar = 3600.0
            var tronHorizonY = horizonY - h * 0.04

            // Pure horizontal Y-axis yaw projection on the XZ ground plane (zero Z-axis camera roll)
            function projectTron3D(wx, wy, wz) {
                var dx = wx - camX
                var dy = wy - camY
                var dz = wz - camZ
                var cosY = Math.cos(camYaw), sinY = Math.sin(camYaw)
                var rx = dx * cosY - dz * sinY
                var ry = dy
                var rz = dx * sinY + dz * cosY
                return { rx: rx, ry: ry, rz: rz }
            }

            function appendClippedTronLine(x1, y1, z1, x2, y2, z2) {
                var p1 = projectTron3D(x1, y1, z1)
                var p2 = projectTron3D(x2, y2, z2)
                if (p1.rz < zNear && p2.rz < zNear) return
                if (p1.rz > zFar && p2.rz > zFar) return
                if (p1.rz < zNear) {
                    var t1 = (zNear - p1.rz) / (p2.rz - p1.rz)
                    p1.rx += t1 * (p2.rx - p1.rx)
                    p1.ry += t1 * (p2.ry - p1.ry)
                    p1.rz = zNear
                } else if (p2.rz < zNear) {
                    var t2 = (zNear - p2.rz) / (p1.rz - p2.rz)
                    p2.rx += t2 * (p1.rx - p2.rx)
                    p2.ry += t2 * (p1.ry - p2.ry)
                    p2.rz = zNear
                }
                var sx1 = cx + (p1.rx * focal) / p1.rz
                var sy1 = tronHorizonY - (p1.ry * focal) / p1.rz
                var sx2 = cx + (p2.rx * focal) / p2.rz
                var sy2 = tronHorizonY - (p2.ry * focal) / p2.rz
                ctx.moveTo(sx1, sy1)
                ctx.lineTo(sx2, sy2)
            }

            // 1. Dense 1982 TRON Game Grid Floor (`cellSize = 80.0`) + Major 4-Cell Avenue Lines rotating a full 90° with `state.tronYaw`!
            var cellSize = 80.0
            var baseGX = Math.floor(camX / cellSize) * cellSize
            var baseGZ = Math.floor(camZ / cellSize) * cellSize
            var gridCells = Math.max(8, Math.min(24, Math.round(15 * denCurve)))
            var spanDist = gridCells * cellSize

            // Minor 80-unit grid cells in electric blue
            ctx.beginPath()
            for (var gi = -gridCells; gi <= gridCells; gi++) {
                var gxLine = baseGX + gi * cellSize
                var gzLine = baseGZ + gi * cellSize
                var isMajorX = (Math.round(gxLine / cellSize) & 3) === 0
                var isMajorZ = (Math.round(gzLine / cellSize) & 3) === 0
                if (!isMajorX) appendClippedTronLine(gxLine, 0, baseGZ - spanDist, gxLine, 0, baseGZ + spanDist)
                if (!isMajorZ) appendClippedTronLine(baseGX - spanDist, 0, gzLine, baseGX + spanDist, 0, gzLine)
            }
            strokeQuadraScanPass(ctx, "#0066CC", 1.05, 0.55 * (1.0 - dim), false)

            // Major 320-unit avenue lines + horizon line in glowing cyan
            ctx.beginPath()
            for (var gMaj = -gridCells; gMaj <= gridCells; gMaj++) {
                var gxMaj = baseGX + gMaj * cellSize
                var gzMaj = baseGZ + gMaj * cellSize
                if ((Math.round(gxMaj / cellSize) & 3) === 0) {
                    appendClippedTronLine(gxMaj, 0, baseGZ - spanDist, gxMaj, 0, baseGZ + spanDist)
                }
                if ((Math.round(gzMaj / cellSize) & 3) === 0) {
                    appendClippedTronLine(baseGX - spanDist, 0, gzMaj, baseGX + spanDist, 0, gzMaj)
                }
            }
            ctx.moveTo(0, tronHorizonY)
            ctx.lineTo(w, tronHorizonY)
            strokeQuadraScanPass(ctx, "#00E5FF", 1.45 + state.bass * 0.5, 0.80 * (1.0 - dim), true)

            // 2. World-Space Rotating 14-Facet Master Control Program (MCP) Cone & Central I/O Energy Tower Spire
            var mcpSectorX = Math.round(bikeX / 2400.0) * 2400.0
            var mcpSectorZ = Math.round(bikeZ / 2400.0) * 2400.0 + 1800.0
            var mcpFacets = 12
            var mcpRBase = 240.0
            var mcpRTop = 165.0
            var mcpHTop = 520.0
            var mcpRot = l1T * 0.95
            ctx.beginPath()
            for (var mf = 0; mf < mcpFacets; mf++) {
                var ma0 = mcpRot + (mf / mcpFacets) * Math.PI * 2.0
                var ma1 = mcpRot + ((mf + 1) / mcpFacets) * Math.PI * 2.0
                var mbx0 = mcpSectorX + Math.cos(ma0) * mcpRBase, mbz0 = mcpSectorZ + Math.sin(ma0) * mcpRBase
                var mbx1 = mcpSectorX + Math.cos(ma1) * mcpRBase, mbz1 = mcpSectorZ + Math.sin(ma1) * mcpRBase
                var mtx0 = mcpSectorX + Math.cos(ma0) * mcpRTop,  mtz0 = mcpSectorZ + Math.sin(ma0) * mcpRTop
                var mtx1 = mcpSectorX + Math.cos(ma1) * mcpRTop,  mtz1 = mcpSectorZ + Math.sin(ma1) * mcpRTop
                appendClippedTronLine(mbx0, 0, mbz0, mbx1, 0, mbz1)
                appendClippedTronLine(mtx0, mcpHTop, mtz0, mtx1, mcpHTop, mtz1)
                appendClippedTronLine(mbx0, 0, mbz0, mtx0, mcpHTop, mtz0)
            }
            strokeQuadraScanPass(ctx, "#FF1166", 1.5 + state.bass * 0.6, 0.82 * (1.0 - dim), true)

            ctx.beginPath()
            appendClippedTronLine(mcpSectorX - 78, 0, mcpSectorZ, mcpSectorX - 78, mcpHTop * 1.45, mcpSectorZ)
            appendClippedTronLine(mcpSectorX + 78, 0, mcpSectorZ, mcpSectorX + 78, mcpHTop * 1.45, mcpSectorZ)
            strokeQuadraScanPass(ctx, "#33FFFF", 1.8 + state.beatPulse * 0.8, 0.88 * (1.0 - dim), true)

            // 3. World-Space Patrolling 3D TRON Recognizers (#FF1E38) marching along fixed orthogonal grid avenues
            var recBoxes = [
                [-125, 0, -48, -75, 24, 48],   [75, 0, -48, 125, 24, 48],
                [-112, 24, -26, -82, 240, 26], [82, 24, -26, 112, 240, 26],
                [-82, 135, -22, 82, 160, 22],  [-130, 240, -34, 130, 275, 34],
                [-42, 160, -28, 42, 240, 28],  [-78, 292, -24, 78, 330, 24]
            ]
            var recCount7 = Math.max(1, Math.min(4, Math.round(2.0 * denCurve)))
            ctx.beginPath()
            for (var rIdx = 0; rIdx < recCount7; rIdx++) {
                var recHeadingYaw = (rIdx & 1) === 0 ? 0.0 : (Math.PI * 0.5)
                var cosRY = Math.cos(recHeadingYaw), sinRY = Math.sin(recHeadingYaw)
                var patrolOff = Math.sin(l1T * 0.55 + rIdx * 2.1) * 380.0
                var recWX = Math.round(bikeX / 640.0) * 640.0 + ((rIdx & 1) === 0 ? -320.0 : 320.0) * (1 + Math.floor(rIdx / 2)) + sinRY * patrolOff
                var recWZ = Math.round(bikeZ / 640.0) * 640.0 + ((rIdx & 1) === 0 ? 640.0 : -320.0) * (1 + Math.floor(rIdx / 2)) + cosRY * patrolOff
                for (var bi = 0; bi < recBoxes.length; bi++) {
                    var b = recBoxes[bi]
                    var bv = [
                        [b[0], b[1], b[2]], [b[3], b[1], b[2]], [b[3], b[1], b[5]], [b[0], b[1], b[5]],
                        [b[0], b[4], b[2]], [b[3], b[4], b[2]], [b[3], b[4], b[5]], [b[0], b[4], b[5]]
                    ]
                    var wv = []
                    for (var vi = 0; vi < 8; vi++) {
                        wv.push([
                            recWX + bv[vi][0] * cosRY + bv[vi][2] * sinRY,
                            bv[vi][1],
                            recWZ - bv[vi][0] * sinRY + bv[vi][2] * cosRY
                        ])
                    }
                    var boxEdges = [0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7]
                    for (var ei = 0; ei < boxEdges.length; ei += 2) {
                        var vA = wv[boxEdges[ei]], vB = wv[boxEdges[ei + 1]]
                        appendClippedTronLine(vA[0], vA[1], vA[2], vB[0], vB[1], vB[2])
                    }
                }
            }
            strokeQuadraScanPass(ctx, "#FF1E38", 1.55 + state.bass * 0.6, 0.88 * (1.0 - dim), true)

            // 4. Extruded 3D Light Cycle Jetwall Ribbon & 3D Light Cycle Bike Mesh (Rival #FFAA00 + Player #33FFFF) + 3D Derezz Explosion
            var lcVerts = [
                [-16, 6, -48], [16, 6, -48], [18, 24, -36], [-18, 24, -36], [-16, 40, -22], [16, 40, -22],
                [-18, 8, 0], [18, 8, 0], [14, 48, -4], [-14, 48, -4],
                [-16, 8, 32], [16, 8, 32], [12, 34, 28], [-12, 34, 28], [-8, 16, 54], [8, 16, 54]
            ]
            var lcEdges = [
                0,1, 1,2, 2,3, 3,0, 3,4, 4,5, 5,2,
                6,7, 7,8, 8,9, 9,6,
                0,6, 1,7, 3,9, 2,8, 4,9, 5,8,
                6,10, 7,11, 8,12, 9,13,
                10,11, 11,12, 12,13, 13,10,
                10,14, 11,15, 12,15, 13,14, 14,15
            ]

            function drawTronLightCycleAndTrail(trailPts, bx, bz, bYaw, bikeCol) {
                var wallH = 52.0 + state.bassSmooth * 10.0

                ctx.beginPath()
                for (var ti = 0; ti < trailPts.length - 1; ti++) {
                    var x1 = trailPts[ti][0], z1 = trailPts[ti][1]
                    var x2 = trailPts[ti + 1][0], z2 = trailPts[ti + 1][1]
                    appendClippedTronLine(x1, wallH, z1, x2, wallH, z2)
                    appendClippedTronLine(x1, wallH * 0.68, z1, x2, wallH * 0.68, z2)
                    appendClippedTronLine(x1, wallH * 0.34, z1, x2, wallH * 0.34, z2)
                    appendClippedTronLine(x1, 0, z1, x2, 0, z2)
                    appendClippedTronLine(x1, 0, z1, x1, wallH, z1)
                    appendClippedTronLine(x2, 0, z2, x2, wallH, z2)
                }
                strokeQuadraScanPass(ctx, bikeCol, 1.7 + state.beatPulse * 0.7, 0.90 * (1.0 - dim), true)

                ctx.beginPath()
                for (var tw = 0; tw < trailPts.length - 1; tw++) {
                    appendClippedTronLine(trailPts[tw][0], wallH + 2, trailPts[tw][1], trailPts[tw + 1][0], wallH + 2, trailPts[tw + 1][1])
                }
                strokeQuadraScanPass(ctx, "#FFFFFF", 1.3, 0.85 * (1.0 - dim), false)

                var cosB = Math.cos(bYaw), sinB = Math.sin(bYaw)
                var bScale = 1.28

                // Intact Light Cycle rendering pivoted horizontally around its rear jetwall nozzle (lv[2] + 48.0)
                var wPts = []
                for (var vi = 0; vi < lcVerts.length; vi++) {
                    var lv = lcVerts[vi]
                    var lx = lv[0] * bScale
                    var lz = (lv[2] + 48.0) * bScale
                    wPts.push([
                        bx + lx * cosB + lz * sinB,
                        lv[1] * bScale,
                        bz - lx * sinB + lz * cosB
                    ])
                }
                ctx.beginPath()
                for (var ei = 0; ei < lcEdges.length; ei += 2) {
                    var pA = wPts[lcEdges[ei]], pB = wPts[lcEdges[ei + 1]]
                    appendClippedTronLine(pA[0], pA[1], pA[2], pB[0], pB[1], pB[2])
                }
                var wheelZOffsets = [14.0, 80.0]
                var wheelR = 16.0 * bScale
                for (var wzIdx = 0; wzIdx < 2; wzIdx++) {
                    var wzLocal = wheelZOffsets[wzIdx] * bScale
                    for (var wSide = -1; wSide <= 1; wSide += 2) {
                        var wxLocal = wSide * 17.5 * bScale
                        for (var ws = 0; ws < 8; ws++) {
                            var wa0 = (ws / 8) * Math.PI * 2.0 + l1T * 6.0
                            var wa1 = ((ws + 1) / 8) * Math.PI * 2.0 + l1T * 6.0
                            var z0 = wzLocal + Math.cos(wa0) * wheelR
                            var y0 = wheelR + Math.sin(wa0) * wheelR
                            var z1 = wzLocal + Math.cos(wa1) * wheelR
                            var y1 = wheelR + Math.sin(wa1) * wheelR
                            appendClippedTronLine(
                                bx + wxLocal * cosB + z0 * sinB, y0, bz - wxLocal * sinB + z0 * cosB,
                                bx + wxLocal * cosB + z1 * sinB, y1, bz - wxLocal * sinB + z1 * cosB
                            )
                        }
                    }
                }
                strokeQuadraScanPass(ctx, bikeCol, 1.9 + state.bass * 0.8, 0.96 * (1.0 - dim), true)
            }

            drawTronLightCycleAndTrail(rivalTrail, rivalX, rivalZ, rivalYaw, "#FFAA00")
            drawTronLightCycleAndTrail(playerTrail, bikeX, bikeZ, bikeYaw, "#33FFFF")

            // 4B. 3D Vectored Light Cycle Crash Explosions in World Space in Vivid RED (while bikes continue moving without losing flow!)
            var crashesList = state.tronCrashes || []
            for (var crIdx = 0; crIdx < crashesList.length; crIdx++) {
                var cr = crashesList[crIdx]
                var crashProg = clamp(cr.age / (cr.maxAge || 1.55), 0.0, 1.0)
                var crX = cr.x, crZ = cr.z, crYaw = cr.yaw || 0.0
                var cosC = Math.cos(crYaw), sinC = Math.sin(crYaw)
                var crScale = 1.38

                // A. Shattering 3D Vector Light Cycle Chassis & Wheel Shards + Radial Smash Rays flying outward & upward in RED
                ctx.beginPath()
                for (var eiC = 0; eiC < lcEdges.length; eiC += 2) {
                    var vA0 = lcVerts[lcEdges[eiC]], vB0 = lcVerts[lcEdges[eiC + 1]]
                    var shardIdx = eiC >> 1
                    var shAng = shardIdx * 1.15 + crYaw
                    var shSpeed = 105.0 + (shardIdx % 5) * 48.0
                    var shOut = crashProg * shSpeed
                    var shUp = Math.sin(crashProg * Math.PI * 0.88) * (82.0 + (shardIdx % 4) * 44.0)
                    var shSpin = crashProg * (3.8 + (shardIdx % 3) * 2.0)
                    var mx = ((vA0[0] + vB0[0]) * 0.5) * crScale
                    var my = ((vA0[1] + vB0[1]) * 0.5) * crScale
                    var mz = ((vA0[2] + vB0[2]) * 0.5 + 48.0) * crScale
                    var dxS = (vB0[0] - vA0[0]) * 0.62 * crScale * Math.cos(shSpin)
                    var dyS = (vB0[1] - vA0[1]) * 0.62 * crScale + Math.sin(shSpin) * 18.0
                    var dzS = (vB0[2] - vA0[2]) * 0.62 * crScale * Math.cos(shSpin * 0.7)
                    var wxC = crX + mx * cosC + mz * sinC + Math.cos(shAng) * shOut
                    var wyC = Math.max(2.0, my + shUp)
                    var wzC = crZ - mx * sinC + mz * cosC + Math.sin(shAng) * shOut
                    appendClippedTronLine(wxC - dxS, wyC - dyS, wzC - dzS, wxC + dxS, wyC + dyS, wzC + dzS)
                }
                // High-velocity 3D radial smash vector spikes erupting from the impact point
                for (var spk = 0; spk < 12; spk++) {
                    var spkAng = (spk / 12.0) * Math.PI * 2.0 + crYaw * 0.5
                    var spkElev = 0.18 + (spk % 3) * 0.24
                    var rInner = crashProg * 55.0
                    var rOuter = rInner + (52.0 + (spk % 2) * 34.0) * (1.0 - crashProg * 0.35)
                    appendClippedTronLine(
                        crX + Math.cos(spkAng) * rInner, 10.0 + rInner * spkElev, crZ + Math.sin(spkAng) * rInner,
                        crX + Math.cos(spkAng) * rOuter, 14.0 + rOuter * spkElev, crZ + Math.sin(spkAng) * rOuter
                    )
                }
                // B. Expanding 3D Octagonal Derezz Shockwave Rings on the Game Grid floor
                for (var sRing = 0; sRing < 3; sRing++) {
                    var rPhase = clamp(crashProg * 1.25 - sRing * 0.18, 0.02, 1.0)
                    var shockR = rPhase * (215.0 + sRing * 75.0)
                    var shockY = 4.0 + sRing * 18.0 * (1.0 - rPhase * 0.5)
                    for (var os = 0; os < 8; os++) {
                        var oa0 = (os / 8.0) * Math.PI * 2.0 + crashProg * 1.6
                        var oa1 = ((os + 1) / 8.0) * Math.PI * 2.0 + crashProg * 1.6
                        appendClippedTronLine(
                            crX + Math.cos(oa0) * shockR, shockY, crZ + Math.sin(oa0) * shockR,
                            crX + Math.cos(oa1) * shockR, shockY, crZ + Math.sin(oa1) * shockR
                        )
                    }
                }
                strokeQuadraScanPass(ctx, (Math.floor(l1T * 20.0) & 1) === 0 ? "#FF111E" : "#FF3824", 2.45, (1.0 - crashProg * 0.30) * (1.0 - dim), true)

                // C. Towering Vertical RED Derezz Energy Beam Spire shooting into the sky (classic 1982 TRON de-resolution column)
                ctx.beginPath()
                var pillarH = (205.0 + crashProg * 390.0) * (1.0 - crashProg * 0.25)
                var pillarR = 30.0 * (1.0 - crashProg * 0.55)
                for (var pb = 0; pb < 4; pb++) {
                    var pAng = (pb / 4.0) * Math.PI * 2.0 + l1T * 5.5
                    var px = crX + Math.cos(pAng) * pillarR
                    var pz = crZ + Math.sin(pAng) * pillarR
                    appendClippedTronLine(px, 0, pz, px, pillarH, pz)
                }
                strokeQuadraScanPass(ctx, "#FF0022", 2.25, (1.0 - crashProg * 0.40) * (1.0 - dim), true)
            }

            // 5. Floating 3D "Bit" Companion (Octahedron binary entity in upper-left camera space)
            var bitYes = (Math.floor(l1T * 1.2) % 2 === 0) || state.beatPulse > 0.35
            var bitCol = bitYes ? "#FFEE33" : "#FFFFFF"
            var bitR = (bitYes ? 28.0 : 21.0) * (1.0 + state.beatPulse * 0.25)
            var bitWX = camX + Math.sin(camYaw - 0.36) * 210.0
            var bitWZ = camZ + Math.cos(camYaw - 0.36) * 210.0
            var bitWY = camY + 42.0 + Math.sin(l1T * 3.2) * 10.0
            var bitRot = l1T * 2.4
            var bCos = Math.cos(bitRot), bSin = Math.sin(bitRot)
            var bitV = [
                [bitWX, bitWY + bitR, bitWZ],
                [bitWX, bitWY - bitR, bitWZ],
                [bitWX - bitR * bCos, bitWY, bitWZ - bitR * bSin],
                [bitWX + bitR * bCos, bitWY, bitWZ + bitR * bSin],
                [bitWX + bitR * bSin, bitWY, bitWZ - bitR * bCos],
                [bitWX - bitR * bSin, bitWY, bitWZ + bitR * bCos]
            ]
            var bitEdges = [0,2, 0,3, 0,4, 0,5, 1,2, 1,3, 1,4, 1,5, 2,4, 4,3, 3,5, 5,2]
            ctx.beginPath()
            for (var be = 0; be < bitEdges.length; be += 2) {
                var bvA = bitV[bitEdges[be]], bvB = bitV[bitEdges[be + 1]]
                appendClippedTronLine(bvA[0], bvA[1], bvA[2], bvB[0], bvB[1], bvB[2])
            }
            strokeQuadraScanPass(ctx, bitCol, 1.6, 0.90 * (1.0 - dim), true)

            ctx.restore()
        } else if (l1Mode === 8) {
            // Mode 8: SynthGrid Outrun Canyon — Flying 3D Synthwave Terrain Canyon, Retro Segmented Horizon Sun & Scrolling Monoliths
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var groundH8 = h - horizonY
            var rows8 = Math.max(5, Math.min(20, Math.round(11 * denCurve)))
            var cols8 = Math.max(6, Math.min(22, Math.round(13 * denCurve)))
            var scrollFract8 = (((l1T * 0.45) % 1.0) + 1.0) % 1.0

            // 1. Segmented Retro Synthwave Outrun Horizon Sun at (vanishX, horizonY)
            var outrunSunR = minDim * (0.22 + state.bassSmooth * 0.04)
            ctx.fillStyle = colourWithAlpha(palette[1 % palette.length], (0.28 + state.bassSmooth * 0.18) * (1.0 - dim) * (gpuOn ? 0.55 : 1.0))
            ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], (0.78 + state.highSmooth * 0.22) * (1.0 - dim))
            ctx.lineWidth = 1.8
            for (var sBand = 0; sBand < 7; sBand++) {
                var yTopFrac = sBand / 7.0
                var yBotFrac = (sBand + 0.72) / 7.0
                var sy0 = horizonY - outrunSunR * (1.0 - yTopFrac * 0.92)
                var sy1 = horizonY - outrunSunR * (1.0 - yBotFrac * 0.92)
                var dyMid = ((sy0 + sy1) * 0.5 - horizonY) / outrunSunR
                var chordHalfW = Math.sqrt(Math.max(0.0, 1.0 - dyMid * dyMid)) * outrunSunR
                if (chordHalfW > 2.0) {
                    ctx.beginPath()
                    ctx.rect(vanishX - chordHalfW, sy0, chordHalfW * 2.0, Math.max(1.5, sy1 - sy0))
                    ctx.fill()
                    ctx.stroke()
                }
            }

            // 2. Left & Right 3D Perspective Wireframe Mountain Canyon Walls rising from the valley edges
            ctx.strokeStyle = colourWithAlpha(palette[3 % palette.length], (0.64 + state.midSmooth * 0.30) * (1.0 - dim))
            ctx.fillStyle = colourWithAlpha(palette[4 % palette.length], (0.10 + state.bassSmooth * 0.08) * (1.0 - dim) * (gpuOn ? 0.45 : 1.0))
            ctx.lineWidth = 1.5 + state.bassSmooth * 1.0
            for (var cSide = -1; cSide <= 1; cSide += 2) {
                ctx.beginPath()
                for (var cr = 0; cr < rows8; cr++) {
                    var uC0 = (cr + scrollFract8) / rows8
                    var uC1 = Math.min(1.0, (cr + 1.0 + scrollFract8) / rows8)
                    var pC0 = Math.pow(uC0, 1.85), pC1 = Math.pow(uC1, 1.85)
                    var gy0 = horizonY + pC0 * groundH8
                    var gy1 = horizonY + pC1 * groundH8
                    var valleyX0 = lerp(vanishX + cSide * w * 0.06, cx + cSide * w * 0.34, pC0)
                    var valleyX1 = lerp(vanishX + cSide * w * 0.06, cx + cSide * w * 0.34, pC1)
                    var outerX0 = lerp(vanishX + cSide * w * 0.18, cx + cSide * w * 0.62, pC0)
                    var outerX1 = lerp(vanishX + cSide * w * 0.18, cx + cSide * w * 0.62, pC1)
                    var bMtn = state.smoothBands[((cr * 3 + (cSide > 0 ? 16 : 0)) & 63)] || 0.15
                    var peakH0 = (0.06 + pC0 * 0.28) * h * (0.65 + bMtn * 0.85)
                    var peakH1 = (0.06 + pC1 * 0.28) * h * (0.65 + bMtn * 0.85)
                    ctx.moveTo(valleyX0, gy0)
                    ctx.lineTo(outerX0, gy0 - peakH0)
                    ctx.lineTo(outerX1, gy1 - peakH1)
                    ctx.lineTo(valleyX1, gy1)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }

            // 3. Perspective SynthGrid Valley Floor Bands & Crisp Neon Grid Lines below horizonY
            ctx.fillStyle = colourWithAlpha(palette[2 % palette.length], (0.08 + state.bass * 0.12) * (1.0 - dim) * (gpuOn ? 0.45 : 1.0))
            ctx.beginPath()
            for (var rf8 = 0; rf8 < rows8; rf8 += 2) {
                var d08 = (rf8 + scrollFract8) / rows8
                var d18 = Math.min(1.0, (rf8 + 0.65 + scrollFract8) / rows8)
                var y08 = horizonY + Math.pow(d08, 1.85) * groundH8
                var y18 = horizonY + Math.pow(d18, 1.85) * groundH8
                ctx.rect(0, y08, w, Math.max(1.5, y18 - y08))
            }
            ctx.fill()

            ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], (0.42 + state.bass * 0.38) * (1.0 - dim))
            ctx.lineWidth = 1.4 + state.bass * 1.2
            ctx.beginPath()
            ctx.moveTo(0, horizonY); ctx.lineTo(w, horizonY)
            for (var r8 = 0; r8 < rows8; r8++) {
                var uRow8 = (r8 + scrollFract8) / rows8
                var gy8 = horizonY + Math.pow(uRow8, 1.85) * groundH8
                ctx.moveTo(0, gy8); ctx.lineTo(w, gy8)
            }
            for (var c8 = -cols8; c8 <= cols8; c8++) {
                ctx.moveTo(vanishX + c8 * (w * 0.015), horizonY)
                ctx.lineTo(cx + c8 * (w * 0.14), h)
            }
            ctx.stroke()
            ctx.restore()
        } else if (l1Mode === 9) {
            // Mode 9: Demoscene Polygon Tunnel — Expanding 3D Multi-Ring Geometric Polygon Tunnel & Struts
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var polyRings = Math.max(3, Math.min(16, Math.round(8 * denCurve)))
            var polySides = 5 + (Math.floor(state.t * 0.12) % 4)
            var polyScroll = (((l1T * 0.36) % 1.0) + 1.0) % 1.0
            var polyWorldBase = Math.floor(l1T * 0.36)
            var prevPolyPts = null

            for (var pr = 0; pr < polyRings; pr++) {
                var uP = (pr + polyScroll) / polyRings
                var pFade = smoothstep(0.0, 0.18, uP)
                if (pFade < 0.02) continue
                var radP = Math.pow(uP, 1.95) * diagR * 1.22
                var ringCX9 = lerp(cx + endPt.dx * 0.58, cx, Math.min(1.0, uP * 1.15))
                var ringCY9 = lerp(cy + endPt.dy * 0.58, cy, Math.min(1.0, uP * 1.15))
                var wRingIdx = polyWorldBase - pr
                var rotP = wRingIdx * 0.22 + l1T * 0.25 * (wRingIdx & 1 ? 1.0 : -1.0)
                var curPolyPts = []
                for (var ps = 0; ps <= polySides; ps++) {
                    var pAng = (ps / polySides) * Math.PI * 2.0 + rotP
                    var bVal9 = state.smoothBands[(ps * 5 + pr * 7) & 63] || 0.1
                    var rMod = radP * (1.0 + bVal9 * 0.16)
                    curPolyPts.push({
                        x: ringCX9 + Math.cos(pAng) * rMod,
                        y: ringCY9 + Math.sin(pAng) * rMod
                    })
                }
                var col9 = palette[((wRingIdx * 2) % palette.length + palette.length) % palette.length]
                ctx.strokeStyle = colourWithAlpha(col9, (0.38 + uP * 0.56) * pFade * (1.0 - dim))
                ctx.lineWidth = (1.2 + uP * 2.6 + state.bassSmooth * 1.2) * pFade
                ctx.beginPath()
                for (var ps2 = 0; ps2 <= polySides; ps2++) {
                    if (ps2 === 0) ctx.moveTo(curPolyPts[ps2].x, curPolyPts[ps2].y)
                    else ctx.lineTo(curPolyPts[ps2].x, curPolyPts[ps2].y)
                }
                if (prevPolyPts) {
                    for (var ps3 = 0; ps3 < polySides; ps3++) {
                        ctx.moveTo(prevPolyPts[ps3].x, prevPolyPts[ps3].y)
                        ctx.lineTo(curPolyPts[ps3].x, curPolyPts[ps3].y)
                    }
                }
                ctx.stroke()
                prevPolyPts = curPolyPts
            }
            ctx.restore()
        } else if (l1Mode === 10) {
            // Mode 10: Tempest & Asteroids 3D — 1981 Atari Tempest Color-QuadraScan 3D Tube Web, Deep Tunnel Dive, Full Enemy Roster, Zapper Starbursts + Tumbling 3D Vector Asteroids
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            if (!gpuOn) {
                ctx.fillStyle = "rgba(1, 2, 10, " + clamp(0.84 - dim * 0.35, 0.48, 0.92).toFixed(3) + ")"
                ctx.fillRect(0, 0, w, h)
            }
            var webLanes = 16
            var webRings = 9
            // Dramatic tunnel-dive zoom & axial travel so the camera & Claw plunge deep down into the tube and surge back to the rim!
            var diveWave = 0.5 + 0.5 * Math.sin(l1T * 0.78)
            var tubeZoom = 0.56 + 1.06 * diveWave + state.bassSmooth * 0.28
            var webOriginX = cx + endPt.dx * (0.30 + 0.16 * Math.sin(l1T * 0.52))
            var webOriginY = cy + endPt.dy * (0.30 + 0.16 * Math.cos(l1T * 0.52))
            var webFlow = (((l1T * 0.85) % 1.0) + 1.0) % 1.0
            var webShapeMode = Math.floor(Math.abs(l1T) * 0.10) % 3

            function evalTempestRimNode(laneVal, radiusVal) {
                var uL = (((laneVal % webLanes) + webLanes) % webLanes) / webLanes
                var theta = uL * Math.PI * 2.0 + Math.sin(l1T * 0.32) * 0.28
                var lobe = 1.0
                if (webShapeMode === 1) {
                    // Clover / Star Tempest web
                    lobe = 0.78 + 0.26 * Math.cos(theta * 4.0)
                } else if (webShapeMode === 2) {
                    // Pinch / Hourglass Tempest web
                    lobe = 0.82 + 0.24 * Math.cos(theta * 2.0)
                }
                return {
                    x: Math.cos(theta) * radiusVal * lobe * 1.12,
                    y: Math.sin(theta) * radiusVal * lobe * 0.88
                }
            }

            function evalTempestPoint(laneVal, uDepth) {
                var uClamped = clamp(uDepth, 0.04, 1.38)
                var rW = minDim * (0.036 + Math.pow(uClamped, 1.75) * 0.52 * tubeZoom)
                var wxC = lerp(webOriginX, cx, Math.min(1.15, uClamped))
                var wyC = lerp(webOriginY, cy, Math.min(1.15, uClamped))
                var offset = evalTempestRimNode(laneVal, rW)
                return { x: wxC + offset.x, y: wyC + offset.y, r: rW, u: uClamped }
            }

            // 1. Electric Blue (#2255FF) 16-Lane 3D Perspective Tempest Tube Web surging up & down the tunnel
            var ringNodes = []
            for (var wr = 0; wr <= webRings; wr++) {
                var uW = clamp((wr + webFlow) / webRings, 0.04, 1.12)
                var rowPts = []
                for (var wl = 0; wl <= webLanes; wl++) {
                    rowPts.push(evalTempestPoint(wl, uW))
                }
                ringNodes.push(rowPts)
            }

            ctx.beginPath()
            for (var wr2 = 0; wr2 < ringNodes.length; wr2++) {
                var rRow = ringNodes[wr2]
                for (var wl2 = 0; wl2 <= webLanes; wl2++) {
                    if (wl2 === 0) ctx.moveTo(rRow[wl2].x, rRow[wl2].y)
                    else ctx.lineTo(rRow[wl2].x, rRow[wl2].y)
                }
            }
            for (var wl3 = 0; wl3 < webLanes; wl3++) {
                var nearPt = evalTempestPoint(wl3, 1.05)
                var farPt = evalTempestPoint(wl3, 0.04)
                ctx.moveTo(farPt.x, farPt.y)
                ctx.lineTo(nearPt.x, nearPt.y)
            }
            strokeQuadraScanPass(ctx, "#2255FF", 1.75 + state.bassSmooth * 0.7, 0.88 * (1.0 - dim), true)

            // 2. Active Player Lane Highlight Rails + Yellow (#FFFF11) Tempest Claw Blaster plunging up & down the tunnel + Rapid Dual-Rail Zapper Laser Bolts
            var clawLanePos = ((l1T * 3.1) % webLanes + webLanes) % webLanes
            var clawLane = Math.floor(clawLanePos)
            // Claw dives deep down into the tunnel (uClaw = 0.56) and surges back up to the rim (uClaw = 1.00)
            var uClaw = 0.56 + 0.44 * (0.5 + 0.5 * Math.cos(l1T * 0.85))
            var railNear0 = evalTempestPoint(clawLane, 1.05)
            var railNear1 = evalTempestPoint(clawLane + 1, 1.05)
            var railFar0 = evalTempestPoint(clawLane, 0.04)
            var railFar1 = evalTempestPoint(clawLane + 1, 0.04)

            ctx.beginPath()
            ctx.moveTo(railFar0.x, railFar0.y); ctx.lineTo(railNear0.x, railNear0.y)
            ctx.moveTo(railFar1.x, railFar1.y); ctx.lineTo(railNear1.x, railNear1.y)
            strokeQuadraScanPass(ctx, "#FFFF11", 2.0 + state.beatPulse * 0.9, 0.88 * (1.0 - dim), false)

            var cP0 = evalTempestPoint(clawLanePos - 0.08, uClaw)
            var cP1 = evalTempestPoint(clawLanePos + 1.08, uClaw)
            var cMidInner = evalTempestPoint(clawLanePos + 0.5, uClaw * 0.88)
            var cMidOuter = evalTempestPoint(clawLanePos + 0.5, uClaw * 1.11)
            var cTipL = evalTempestPoint(clawLanePos + 0.16, uClaw * 1.07)
            var cTipR = evalTempestPoint(clawLanePos + 0.84, uClaw * 1.07)
            ctx.beginPath()
            ctx.moveTo(cTipL.x, cTipL.y)
            ctx.lineTo(cP0.x, cP0.y)
            ctx.lineTo(cMidOuter.x, cMidOuter.y)
            ctx.lineTo(cP1.x, cP1.y)
            ctx.lineTo(cTipR.x, cTipR.y)
            ctx.lineTo(cMidInner.x, cMidInner.y)
            ctx.closePath()
            strokeQuadraScanPass(ctx, "#FFFF11", 2.6 + state.beatPulse * 1.0, 0.98 * (1.0 - dim), true)

            // Rapid Dual-Rail Player Zapper Laser Bolts firing down the tunnel lanes + 1981 Atari Tempest Vector Starburst Explosions!
            ctx.beginPath()
            for (var zb = 0; zb < 10; zb++) {
                var zPhase = (((l1T * 4.8 + zb * 0.10) % 1.0) + 1.0) % 1.0
                var uShot = lerp(uClaw * 0.95, 0.06, zPhase)
                var shotLane = (clawLane - (zb % 4) + webLanes) % webLanes + 0.5
                var sPtA = evalTempestPoint(shotLane, uShot)
                var sPtB = evalTempestPoint(shotLane, Math.max(0.04, uShot - 0.085))
                var sPtL = evalTempestPoint(shotLane - 0.26, uShot - 0.04)
                var sPtR = evalTempestPoint(shotLane + 0.26, uShot - 0.04)
                ctx.moveTo(sPtA.x, sPtA.y); ctx.lineTo(sPtB.x, sPtB.y)
                ctx.moveTo(sPtL.x, sPtL.y); ctx.lineTo(sPtR.x, sPtR.y)
                ctx.moveTo(sPtA.x, sPtA.y); ctx.lineTo(sPtL.x, sPtL.y); ctx.lineTo(sPtB.x, sPtB.y); ctx.lineTo(sPtR.x, sPtR.y); ctx.closePath()
            }
            strokeQuadraScanPass(ctx, "#FFFFFF", 2.1 + state.highSmooth * 0.9, 0.95 * (1.0 - dim), true)

            // 3. Red (#FF1111) Flippers (Bowtie Vector Enemies) gliding smoothly up & down the tunnel lanes and flipping across lane boundaries
            ctx.beginPath()
            var flipperCount = Math.max(1, Math.min(10, Math.round(5.5 * denCurve)))
            for (var flp = 0; flp < flipperCount; flp++) {
                var flpWave = l1T * (0.95 + (flp % 3) * 0.22) + flp * 1.37
                var uFlip = 0.16 + 0.80 * (0.5 + 0.5 * Math.sin(flpWave))
                var uFlipTop = Math.min(1.10, uFlip + 0.11)
                var baseLane = (flp * 3 + Math.floor(l1T * 1.4 + flp)) % webLanes
                var flipStrut = Math.max(0.0, Math.sin(l1T * 4.2 + flp * 1.9))
                var fL0 = baseLane - 0.06 + flipStrut * 0.50
                var fL1 = baseLane + 1.06 + flipStrut * 0.50
                var fpA = evalTempestPoint(fL0, uFlip)
                var fpB = evalTempestPoint(fL1, uFlip)
                var fpC = evalTempestPoint(fL0, uFlipTop)
                var fpD = evalTempestPoint(fL1, uFlipTop)
                var fpMid = evalTempestPoint((fL0 + fL1) * 0.5, (uFlip + uFlipTop) * 0.5)
                ctx.moveTo(fpA.x, fpA.y); ctx.lineTo(fpD.x, fpD.y)
                ctx.lineTo(fpB.x, fpB.y); ctx.lineTo(fpC.x, fpC.y)
                ctx.closePath()
                ctx.moveTo(fpA.x, fpA.y); ctx.lineTo(fpB.x, fpB.y)
                ctx.moveTo(fpC.x, fpC.y); ctx.lineTo(fpD.x, fpD.y)
                ctx.moveTo(fpMid.x - 3, fpMid.y); ctx.lineTo(fpMid.x + 3, fpMid.y)
            }
            strokeQuadraScanPass(ctx, "#FF1111", 2.35 + state.bassSmooth * 0.85, 0.96 * (1.0 - dim), true)

            // 4. Magenta (#FF22FF) Heavy Diamond Tankers climbing & descending the tunnel lanes
            ctx.beginPath()
            var tankerCount = Math.max(1, Math.min(7, Math.round(3.5 * denCurve)))
            for (var tnk = 0; tnk < tankerCount; tnk++) {
                var tnkLane = ((tnk * 4 + 2) % webLanes) + 0.5
                var uTank = 0.18 + 0.76 * (0.5 + 0.5 * Math.cos(l1T * 0.78 + tnk * 1.65))
                var tTop = evalTempestPoint(tnkLane, uTank + 0.095)
                var tBot = evalTempestPoint(tnkLane, Math.max(0.05, uTank - 0.095))
                var tLeft = evalTempestPoint(tnkLane - 0.54, uTank)
                var tRight = evalTempestPoint(tnkLane + 0.54, uTank)
                var tInL = evalTempestPoint(tnkLane - 0.26, uTank)
                var tInR = evalTempestPoint(tnkLane + 0.26, uTank)
                var tInTop = evalTempestPoint(tnkLane, uTank + 0.045)
                var tInBot = evalTempestPoint(tnkLane, Math.max(0.05, uTank - 0.045))
                ctx.moveTo(tTop.x, tTop.y); ctx.lineTo(tRight.x, tRight.y)
                ctx.lineTo(tBot.x, tBot.y); ctx.lineTo(tLeft.x, tLeft.y); ctx.closePath()
                ctx.moveTo(tInTop.x, tInTop.y); ctx.lineTo(tInR.x, tInR.y)
                ctx.lineTo(tInBot.x, tInBot.y); ctx.lineTo(tInL.x, tInL.y); ctx.closePath()
                ctx.moveTo(tTop.x, tTop.y); ctx.lineTo(tBot.x, tBot.y)
                ctx.moveTo(tLeft.x, tLeft.y); ctx.lineTo(tRight.x, tRight.y)
            }
            strokeQuadraScanPass(ctx, "#FF22FF", 2.25 + state.midSmooth * 0.8, 0.94 * (1.0 - dim), true)

            // 5. Green (#11FF33) Spikers extending green spike rails up & down the tunnel with spinning spiral heads
            ctx.beginPath()
            var spikerCount = Math.max(1, Math.min(6, Math.round(3.5 * denCurve)))
            for (var spk = 0; spk < spikerCount; spk++) {
                var spkLane = ((spk * 4 + 1) % webLanes) + 0.5
                var uSpikeTip = 0.26 + 0.64 * (0.5 + 0.5 * Math.sin(l1T * 1.15 + spk * 1.57))
                var spkBase = evalTempestPoint(spkLane, 0.05)
                var spkTip = evalTempestPoint(spkLane, uSpikeTip)
                ctx.moveTo(spkBase.x, spkBase.y)
                ctx.lineTo(spkTip.x, spkTip.y)
                // Spinning spiral Spiker head at uSpikeTip
                var headR = Math.max(6.5, spkTip.r * 0.135)
                for (var sh = 0; sh <= 14; sh++) {
                    var shU = sh / 14.0
                    var shAng = shU * Math.PI * 4.0 + l1T * 7.0 * (spk & 1 ? 1.0 : -1.0)
                    var sxH = spkTip.x + Math.cos(shAng) * headR * shU
                    var syH = spkTip.y + Math.sin(shAng) * headR * shU
                    if (sh === 0) ctx.moveTo(sxH, syH)
                    else ctx.lineTo(sxH, syH)
                }
            }
            strokeQuadraScanPass(ctx, "#11FF33", 2.15 + state.bassSmooth * 0.75, 0.94 * (1.0 - dim), true)

            // 6. Cyan (#00FFFF) Crackling Fuseballs zig-zagging along the lane rails + Pulsars + Vector Starburst Enemy Explosions
            ctx.beginPath()
            var fuseCount = Math.max(1, Math.min(6, Math.round(3.5 * denCurve)))
            for (var fzb = 0; fzb < fuseCount; fzb++) {
                var fzRail = (fzb * 4 + Math.floor(l1T * 0.9)) % webLanes
                var uFuse = 0.18 + 0.76 * (0.5 + 0.5 * Math.sin(l1T * 1.65 + fzb * 2.1))
                var fzCenter = evalTempestPoint(fzRail + 0.14 * Math.sin(l1T * 9.0 + fzb), uFuse)
                var fzRad = Math.max(7.0, fzCenter.r * 0.125 * (1.0 + state.beatPulse * 0.35))
                for (var fSpoke = 0; fSpoke < 8; fSpoke++) {
                    var fAng = (fSpoke / 8.0) * Math.PI * 2.0 + l1T * 8.5
                    var fMidX = fzCenter.x + Math.cos(fAng + 0.32) * fzRad * 0.55
                    var fMidY = fzCenter.y + Math.sin(fAng + 0.32) * fzRad * 0.55
                    var fEndX = fzCenter.x + Math.cos(fAng) * fzRad
                    var fEndY = fzCenter.y + Math.sin(fAng) * fzRad
                    ctx.moveTo(fzCenter.x, fzCenter.y)
                    ctx.lineTo(fMidX, fMidY)
                    ctx.lineTo(fEndX, fEndY)
                }
            }
            // Pulsars: electric zigzag waveform arcs pulsing across lanes
            var pulsarCount = Math.max(1, Math.min(5, Math.round(2.5 * denCurve)))
            for (var pls = 0; pls < pulsarCount; pls++) {
                var plsLane = (pls * 5 + 3) % webLanes
                var uPulsar = 0.24 + 0.66 * (0.5 + 0.5 * Math.cos(l1T * 1.25 + pls * 2.0))
                var plsSteps = 6
                for (var psI = 0; psI <= plsSteps; psI++) {
                    var psFrac = psI / plsSteps
                    var zigU = uPulsar + ((psI & 1) ? 0.042 : -0.042) * (0.6 + state.bassSmooth * 0.8)
                    var plsPt = evalTempestPoint(plsLane + psFrac, zigU)
                    if (psI === 0) ctx.moveTo(plsPt.x, plsPt.y)
                    else ctx.lineTo(plsPt.x, plsPt.y)
                }
            }
            strokeQuadraScanPass(ctx, "#00FFFF", 2.05 + state.highSmooth * 0.8, 0.94 * (1.0 - dim), true)

            // 6B. 1981 Atari Tempest Vector Starburst Explosions where Zapper bolts blast enemies in the active lanes!
            ctx.beginPath()
            for (var exI = 0; exI < 2; exI++) {
                var exLife = (((l1T * 2.2 + exI * 0.5) % 1.0) + 1.0) % 1.0
                if (exLife > 0.68) continue
                var exProg = exLife / 0.68
                var exLane = (clawLane - exI + webLanes) % webLanes + 0.5
                var exU = 0.34 + exI * 0.26
                var exCenter = evalTempestPoint(exLane, exU)
                var exMaxR = Math.max(10.0, exCenter.r * 0.22) * exProg
                for (var eSpk = 0; eSpk < 10; eSpk++) {
                    var eAng = (eSpk / 10.0) * Math.PI * 2.0 + exI * 0.4
                    var rIn = exMaxR * 0.32
                    var rOut = exMaxR * ((eSpk & 1) ? 1.0 : 0.68)
                    ctx.moveTo(exCenter.x + Math.cos(eAng) * rIn, exCenter.y + Math.sin(eAng) * rIn)
                    ctx.lineTo(exCenter.x + Math.cos(eAng) * rOut, exCenter.y + Math.sin(eAng) * rOut)
                }
            }
            strokeQuadraScanPass(ctx, "#FFFF11", 2.1, 0.92 * (1.0 - dim), true)

            // 7. Tumbling 3D Vector Asteroids (1979 Atari Asteroids Craggy 3D Polyhedra) orbiting in outer space
            var astCount = Math.max(1, Math.min(10, Math.round(5.0 * denCurve)))
            ctx.beginPath()
            for (var ai = 0; ai < astCount; ai++) {
                var aAng = (ai / astCount) * Math.PI * 2.0 + l1T * 0.22 * (ai & 1 ? 1.0 : -1.0)
                var aDist = minDim * (0.46 + (ai % 3) * 0.11)
                var axC = cx + Math.cos(aAng) * aDist * 1.18
                var ayC = cy + Math.sin(aAng) * aDist * 0.82
                var aScale = minDim * (0.042 + (ai % 3) * 0.016) * (1.0 + state.bassSmooth * 0.18)
                var arx = l1T * (0.9 + ai * 0.2), ary = l1T * (0.7 + ai * 0.15), arz = l1T * 0.5
                var aPts = []
                for (var av = 0; av < 8; av++) {
                    var va = (av / 8.0) * Math.PI * 2.0
                    var crag = (av % 2 === 0) ? 1.0 : 0.68
                    var vz = ((av % 3) - 1) * 0.45
                    aPts.push(project3DPoint(Math.cos(va) * crag, Math.sin(va) * crag, vz, arx, ary, arz, axC, ayC, aScale, 3.6))
                }
                for (var ae = 0; ae < 8; ae++) {
                    var an = (ae + 1) & 7
                    var ac = (ae + 3) & 7
                    ctx.moveTo(aPts[ae].x, aPts[ae].y); ctx.lineTo(aPts[an].x, aPts[an].y)
                    if ((ae & 1) === 0) {
                        ctx.moveTo(aPts[ae].x, aPts[ae].y); ctx.lineTo(aPts[ac].x, aPts[ac].y)
                    }
                }
            }
            strokeQuadraScanPass(ctx, "#00FFFF", 1.5 + state.highSmooth * 0.6, 0.82 * (1.0 - dim), true)
            ctx.restore()
        }
    }

    // =========================================================================
    // SUB-SYSTEM 2: L1 EQUALISER (Independent ON/OFF — works over ANY L1 Field!)
    // =========================================================================
    if (eqOn) {
        var eqStyle = cfg && cfg.layer1EqStyle !== undefined ? ((Number(cfg.layer1EqStyle) || 0) % LAYER1_EQ_STYLES.length) : 0
        var eqLayout = cfg && cfg.layer1EqLayout !== undefined ? clamp(Math.round(Number(cfg.layer1EqLayout)), 0, 3) : 0
        var eqGain = cfg && cfg.layer1EqGain !== undefined ? clamp(Number(cfg.layer1EqGain), 0.2, 3.0) : 1.25
        var eqScale = cfg && cfg.layer1EqScale !== undefined ? clamp(Number(cfg.layer1EqScale), 0.15, 2.25) : 1.0
        var eqSpin = cfg && cfg.layer1EqSpin !== undefined ? clamp(Number(cfg.layer1EqSpin), -2.5, 2.5) : 1.0
        var eqSpinT = state.eqSpinTime !== undefined ? state.eqSpinTime : (l1T * eqSpin)
        var eqSpinDir = eqSpin === 0 ? 0.0 : (eqSpin < 0 ? -1.0 : 1.0)
        var eqDamping = cfg && cfg.layer1EqDamping !== undefined ? ((Number(cfg.layer1EqDamping) || 0) % 3) : 0
        var maxEqH = h * 0.42 * eqScale

        ctx.save()
        ctx.globalCompositeOperation = "source-over"

        // Universal L1 Equaliser Position & Orientation Transform (`eqLayout` 0..3) affecting ALL 16 EQ styles (0..15):
        //   Every EQ style (0..15) anchors its base/centre relative to `horizonY` pointing UPWARD (`y <= horizonY`) in local space:
        //   0: Bottom ▲ (Up)   — Shift anchor from horizonY down to bottom edge (h * 0.94), pointing UP
        //   1: Mid ▲ (Up)      — Keep anchor at horizonY, pointing UP (identity)
        //   2: Mid ▼ (Down)    — Flip vertically around horizonY to point DOWN
        //   3: Top ▼ (Down)    — Shift anchor to top edge (h * 0.06) and flip vertically to point DOWN
        var isSculptural3D = (eqStyle >= 7 && eqStyle <= 12)
        if (isSculptural3D) {
            // Sculptural 3D EQs (7: 3D Sonic Orb, 8: 3D Torus Reactor, 9: Cymatic Chladni, 10: Helix, 11: Tesla, 12: Voxel City)
            // Anchor directly towards the vertical screen zone defined by `eqLayout` (0: Bottom, 1/2: Middle, 3: Top),
            // roam across horizontal zones within that band, and scale in/out (breathe-style) around their local centre!
            var zoneTargetY = (eqLayout === 0)
                ? (h * 0.78)
                : ((eqLayout === 3) ? (h * 0.22) : (eqLayout === 2 ? (h * 0.54) : (h * 0.46)))
            var localAnchorY = (eqStyle === 10 || eqStyle === 12) ? (horizonY - minDim * 0.22) : (horizonY - minDim * 0.20)
            var wanderScale = clamp(Math.abs(eqSpin), 0.0, 1.0)
            var eqBreathe = (Math.abs(eqSpin) < 0.01)
                ? (0.88 + state.bassSmooth * 0.10)
                : (0.42 + 0.56 * (0.5 + 0.5 * Math.sin(eqSpinT * 0.55 + eqStyle * 0.9)) + state.bassSmooth * 0.10)
            var eqWanderX = (Math.sin(eqSpinT * 0.52 + eqStyle * 0.7) * 0.24 + Math.cos(eqSpinT * 0.29 + eqStyle * 1.3) * 0.08) * w * wanderScale
            var eqWanderY = Math.cos(eqSpinT * 0.44 + eqStyle * 1.1) * (h * 0.065) * wanderScale
            var effEqScale = eqScale * eqBreathe
            ctx.translate(vanishX + eqWanderX, zoneTargetY + eqWanderY)
            ctx.scale(effEqScale, effEqScale)
            ctx.translate(-vanishX, -localAnchorY)
        } else {
            if (eqLayout === 0) {
                ctx.translate(0, h * 0.94 - horizonY)
            } else if (eqLayout === 1) {
                // 1: Mid -> Point Up: anchor stays at horizonY, pointing up (identity)
            } else if (eqLayout === 2) {
                ctx.translate(0, horizonY)
                ctx.scale(1, -1)
                ctx.translate(0, -horizonY)
            } else if (eqLayout === 3) {
                ctx.translate(0, h * 0.06)
                ctx.scale(1, -1)
                ctx.translate(0, -horizonY)
            }

            if (eqStyle === 4 || eqStyle >= 13) {
                var scaleAnchorY = (eqStyle === 4 || eqStyle === 15) ? horizonY : (horizonY - minDim * 0.20)
                ctx.translate(vanishX, scaleAnchorY)
                ctx.scale(eqScale, eqScale)
                ctx.translate(-vanishX, -scaleAnchorY)
            }
        }

        if (eqStyle === 0) {
            // Style 0: Skyline Mountain (Multi-layer neon mountain silhouette + glowing crest)
            for (var mLayer = 1; mLayer >= 0; mLayer--) {
                var layerScale = mLayer === 0 ? 1.0 : 0.62
                ctx.fillStyle = colourWithAlpha(palette[(mLayer * 3 + 2) % palette.length], (0.20 + state.energy * 0.28) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(palette[(mLayer * 2 + 1) % palette.length], (0.72 + state.bass * 0.26) * (1.0 - dim))
                ctx.lineWidth = mLayer === 0 ? 2.4 : 1.5
                ctx.beginPath()
                ctx.moveTo(0, horizonY)
                for (var b0 = 0; b0 < 64; b0++) {
                    var idx0 = mapEqBandIndex((b0 + mLayer * 5) & 63, 64, eqLayout)
                    var v0 = sampleEqBandValue(state, idx0, eqDamping, eqGain) * layerScale
                    ctx.lineTo((b0 / 63.0) * w, horizonY - v0 * maxEqH)
                }
                ctx.lineTo(w, horizonY)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 1) {
            // Style 1: LED Bars & Floating Peak-Hold Indicators (clean floating bars + peak caps without a dividing horizon line)
            var barCount = 32
            var slotW = w / barCount
            var barW = slotW * 0.72
            for (var bk = 0; bk < 4; bk++) {
                ctx.fillStyle = colourWithAlpha(palette[(bk * 3) % palette.length], (0.55 + state.bass * 0.35) * (1.0 - dim))
                ctx.beginPath()
                for (var bi = bk; bi < barCount; bi += 4) {
                    var idx1 = mapEqBandIndex(bi, barCount, eqLayout)
                    var v1 = sampleEqBandValue(state, idx1, eqDamping, eqGain)
                    var bh1 = v1 * maxEqH
                    var bx1 = bi * slotW + (slotW - barW) * 0.5
                    ctx.rect(bx1, horizonY - bh1, barW, bh1)
                }
                ctx.fill()
            }
            // Floating Peak-Hold caps
            ctx.fillStyle = colourWithAlpha(palette[7 % palette.length], 0.92 * (1.0 - dim))
            ctx.beginPath()
            for (var pi = 0; pi < barCount; pi++) {
                var idxP = mapEqBandIndex(pi, barCount, eqLayout)
                var pk = clamp((state.peakBands[idxP] || 0.06) * eqGain, 0.02, 1.65)
                var pY = horizonY - pk * maxEqH - 4.0
                var pX = pi * slotW + (slotW - barW) * 0.5
                ctx.rect(pX, pY, barW, 3.0)
            }
            ctx.fill()
        } else if (eqStyle === 2) {
            // Style 2: Mirrored Horizon Reflection (Upward bars + downward translucent water reflection without a dividing horizon line)
            var mBars = 40
            var mSlot = w / mBars
            var mBarW = mSlot * 0.74
            for (var mb = 0; mb < 3; mb++) {
                ctx.fillStyle = colourWithAlpha(palette[(mb * 4) % palette.length], (0.58 + state.energy * 0.32) * (1.0 - dim))
                ctx.beginPath()
                for (var mi = mb; mi < mBars; mi += 3) {
                    var idx2 = mapEqBandIndex(mi, mBars, eqLayout)
                    var v2 = sampleEqBandValue(state, idx2, eqDamping, eqGain)
                    var upH = v2 * maxEqH
                    ctx.rect(mi * mSlot, horizonY - upH, mBarW, upH)
                }
                ctx.fill()

                // Downward water reflection
                ctx.fillStyle = colourWithAlpha(palette[(mb * 4 + 2) % palette.length], 0.24 * (1.0 - dim))
                ctx.beginPath()
                for (var mr = mb; mr < mBars; mr += 3) {
                    var idx2r = mapEqBandIndex(mr, mBars, eqLayout)
                    var v2r = sampleEqBandValue(state, idx2r, eqDamping, eqGain)
                    var dnH = v2r * (h - horizonY) * 0.68
                    ctx.rect(mr * mSlot, horizonY + 2, mBarW, dnH)
                }
                ctx.fill()
            }
        } else if (eqStyle === 3) {
            // Style 3: 3D Waterfall Ridges — Joy Division / Plexamp 3D Pulsar Spectrum Ridges
            // Clean horizontal pulsar waveform ridges (`ctx.fill()` occlusion mask + crisp `ctx.stroke()` crest line)
            // marching Towards Us (`l1Dir >= 0`), Away From Us (`l1Dir < 0`), or Breathing (`l1Dir === 0`)
            // anchored at `horizonY` pointing upward so all 4 `eqLayout` positions (Bottom ▲, Mid ▲, Mid ▼, Top ▼) work identically!
            var ridgeHist = (state.eqRidgeHistory && state.eqRidgeHistory.length > 0) ? state.eqRidgeHistory : null
            var ridgeCount = 16
            var binCount3 = 36
            var worldRidgeStep = Math.floor(eqSpinT * 2.8)
            var zPhase = (((eqSpinT * 2.8) % 1.0) + 1.0) % 1.0

            // Render back-to-front (from distant depthSlot=0 down to foreground at horizonY at depthSlot=ridgeCount-1)
            for (var depthSlot = 0; depthSlot < ridgeCount; depthSlot++) {
                var uDepth = clamp((depthSlot + zPhase) / ridgeCount, 0.01, 0.999)
                // Map depthSlot to the historical frequency slice so ridges carry their recorded waveform as they travel in Z!
                var histIdx = eqSpinDir >= 0
                    ? Math.min((ridgeHist ? ridgeHist.length : 1) - 1, depthSlot)
                    : Math.min((ridgeHist ? ridgeHist.length : 1) - 1, (ridgeCount - 1) - depthSlot)
                var sliceObj = ridgeHist ? ridgeHist[histIdx] : null
                var worldId = sliceObj && sliceObj.stepIdx !== undefined
                    ? sliceObj.stepIdx
                    : (worldRidgeStep - (eqSpinDir >= 0 ? depthSlot : -depthSlot))

                // Perspective depth mapping (`z` from 3.4 at far ridge to 0.45 at foreground `horizonY`)
                var zDist = lerp(3.4, 0.45, uDepth)
                var persp = 1.0 / zDist
                var perspNorm = clamp((persp - (1.0 / 3.4)) / ((1.0 / 0.45) - (1.0 / 3.4)), 0.0, 1.0)
                var ridgeBaseY = horizonY - h * 0.22 * (1.0 - perspNorm)
                var ridgeW = w * lerp(0.34, 1.16, Math.pow(perspNorm, 0.78))
                var leftXEq = vanishX - ridgeW * 0.5
                var edgeFade = Math.sin(uDepth * Math.PI)

                var curCoords = []
                for (var sb3 = 0; sb3 < binCount3; sb3++) {
                    var uBin = sb3 / (binCount3 - 1)
                    var bMapped3 = mapEqBandIndex(sb3, binCount3, eqLayout)
                    var bin36Idx = Math.min(35, Math.floor((bMapped3 / 63.0) * 35))
                    var rawVal = sliceObj && sliceObj.bins ? (sliceObj.bins[bin36Idx] || 0.05) : (state.smoothBands[bMapped3] || 0.05)
                    // Pulsar/terrain envelope: prominent central sculpture + full-width stereo wings
                    var pulsarEnv = 0.42 + 0.58 * Math.pow(Math.sin(uBin * Math.PI), 0.65)
                    var ripple3D = 0.88 + 0.16 * Math.sin(uBin * 12.0 + worldId * 0.7)
                    var bv3 = rawVal * eqGain * pulsarEnv * ripple3D * (0.45 + 0.85 * perspNorm)
                    var rx = leftXEq + uBin * ridgeW
                    var ry = ridgeBaseY - bv3 * maxEqH * 0.68
                    curCoords.push({ x: rx, y: ry })
                }

                // Occluding dark-tinted 3D terrain skirt + glowing neon frequency ridge crest (no cross-grid clutter!)
                var ridgeColIdx = (((worldId + Math.floor((state.hueShift || 0) / 30)) % palette.length) + palette.length) % palette.length
                var ridgeCol = palette[ridgeColIdx]
                ctx.fillStyle = colourWithAlpha("#060812", (0.58 + 0.28 * perspNorm) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(ridgeCol, clamp((0.35 + 0.65 * perspNorm) * (0.35 + 0.65 * edgeFade) * (1.0 - dim), 0.08, 1.0))
                ctx.lineWidth = 1.2 + 1.8 * perspNorm
                ctx.beginPath()
                ctx.moveTo(leftXEq, ridgeBaseY)
                for (var ptIdx = 0; ptIdx < binCount3; ptIdx++) {
                    ctx.lineTo(curCoords[ptIdx].x, curCoords[ptIdx].y)
                }
                ctx.lineTo(leftXEq + ridgeW, ridgeBaseY)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 4) {
            // Style 4: Sun Rays — Clean Open Sun Horizon & Colour-Adaptive Radial Equaliser Corona Rays
            // (No internal horizontal slice bars filling the sun disc!)
            var sunR = minDim * (0.20 + state.bass * 0.05)
            var rayCount = 44
            var palShiftSun = Math.floor((state.hueShift || 0) / 45)
            ctx.lineWidth = 2.2 + state.bass * 1.4

            // Subtle upper horizon sun rim arc
            ctx.strokeStyle = colourWithAlpha(palette[(1 + palShiftSun) % palette.length], (0.42 + state.bass * 0.24) * (1.0 - dim))
            ctx.beginPath()
            ctx.arc(vanishX, horizonY, sunR * 0.94, Math.PI, Math.PI * 2)
            ctx.stroke()

            // Radial equaliser rays erupting around the upper semicircle of the sun with subtle colour adaptation across rays
            var numRayBuckets = 4
            for (var rBucket = 0; rBucket < numRayBuckets; rBucket++) {
                var baseCol = palette[(1 + palShiftSun) % palette.length]
                var adjCol = palette[(1 + rBucket + palShiftSun) % palette.length]
                var rayCol = mixHexColours(baseCol, adjCol, 0.16 * rBucket)
                ctx.strokeStyle = colourWithAlpha(rayCol, (0.80 + state.beatPulse * 0.20) * (1.0 - dim))
                ctx.beginPath()
                for (var ryIdx = rBucket; ryIdx <= rayCount; ryIdx += numRayBuckets) {
                    var rAng = Math.PI + (ryIdx / rayCount) * Math.PI
                    var bIdx4 = mapEqBandIndex(ryIdx, rayCount + 1, eqLayout)
                    var v4 = sampleEqBandValue(state, bIdx4, eqDamping, eqGain)
                    var rInner = sunR * 0.95
                    var rOuter = sunR + v4 * maxEqH * 0.85
                    ctx.moveTo(vanishX + Math.cos(rAng) * rInner, horizonY + Math.sin(rAng) * rInner)
                    ctx.lineTo(vanishX + Math.cos(rAng) * rOuter, horizonY + Math.sin(rAng) * rOuter)
                }
                ctx.stroke()
            }
        } else if (eqStyle === 5) {
            // Style 5: Centre-Symmetric Twin Wave Ribbon (Bass anchored at vanishX expanding to wings)
            for (var wingPass = 0; wingPass < 3; wingPass++) {
                ctx.strokeStyle = colourWithAlpha(palette[(wingPass * 3) % palette.length], (0.75 - wingPass * 0.15) * (1.0 - dim))
                ctx.fillStyle = colourWithAlpha(palette[(wingPass * 3 + 1) % palette.length], 0.14 * (1.0 - dim))
                ctx.lineWidth = 2.4 - wingPass * 0.5
                ctx.beginPath()
                ctx.moveTo(0, horizonY)
                for (var cw = 0; cw < 64; cw++) {
                    var distC = Math.abs((cw / 63.0) - 0.5) * 2.0
                    var cBand = clamp(Math.floor(distC * 63), 0, 63)
                    var cv = sampleEqBandValue(state, cBand, eqDamping, eqGain) * (1.0 - wingPass * 0.22)
                    var harmMod = Math.sin(cw * 0.35 + eqSpinT * 1.4 + wingPass) * 0.15 + 0.85
                    var wy5 = horizonY - cv * maxEqH * harmMod * (1.0 - distC * 0.25)
                    ctx.lineTo((cw / 63.0) * w, wy5)
                }
                ctx.lineTo(w, horizonY)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 6) {
            // Style 6: Horizon Spotlights — Pure Volumetric Concert Searchlight Cones & Hot Emitter Cores
            // (No floating dust-mote squares, no dark fixture boxes, and no horizontal baseline bars!)
            var spotCount = 12
            var maxReach = Math.max(horizonY * 1.38, h * 0.96)
            var palShiftSpot = Math.floor((state.hueShift || 0) / 45)
            var hasGrad = typeof ctx.createLinearGradient === "function"

            for (var sp = 0; sp < spotCount; sp++) {
                var uSp = (sp + 0.5) / spotCount
                var baseX = uSp * w
                var bIdx6 = mapEqBandIndex(sp, spotCount, eqLayout)
                var v6 = clamp(sampleEqBandValue(state, bIdx6, eqDamping, eqGain), 0.05, 1.65)
                var spotCol = palette[(sp + palShiftSpot) % palette.length]
                var coreCol = palette[(sp + 2 + palShiftSpot) % palette.length]

                // Independent, non-repeating 3-harmonic pseudo-random searchlight sweep per fixture
                var f1 = 0.41 + ((sp * 7) % 11) * 0.093
                var f2 = 0.27 + ((sp * 5 + 3) % 13) * 0.071
                var f3 = 0.68 + ((sp * 11 + 1) % 9) * 0.117
                var p1 = sp * 2.39996 // golden angle (~137.5°)
                var p2 = sp * 4.18879 + 1.13
                var p3 = sp * 1.71828 + 2.47
                var tilt = Math.sin(eqSpinT * f1 + p1) * 0.38
                         + Math.cos(eqSpinT * f2 - p2) * 0.26
                         + Math.sin(eqSpinT * f3 + p3 + v6 * 0.85) * 0.19
                         + (uSp - 0.5) * -0.18
                var dirX = Math.sin(tilt)
                var dirY = -Math.cos(tilt)
                // Perpendicular normal to beam axis so cone width is never skewed when tilted
                var nx = Math.cos(tilt)
                var ny = Math.sin(tilt)

                // Beam width strongly linked to both frequency pitch (bass = wide floodlight, treble = tight laser pencil) and live band energy v6
                var freqNorm = clamp(bIdx6 / 63.0, 0.0, 1.0)
                var freqWidthMul = 1.75 - freqNorm * 1.25
                var reach = maxReach * (0.76 + v6 * 0.44)
                var topX = baseX + dirX * reach
                var topY = horizonY + dirY * reach
                var baseHalfW = w * (0.0018 + v6 * 0.0048) * freqWidthMul
                var topHalfW = w * (0.006 + Math.pow(v6, 1.15) * 0.064) * freqWidthMul

                // 0. Soft downward Stage Floor Reflection Spill below horizonY
                var spillLen = Math.min(h - horizonY, h * (0.06 + v6 * 0.06))
                if (spillLen > 2.0) {
                    var spillX = baseX - dirX * spillLen * 0.55
                    var spillY = horizonY + spillLen
                    var spillW = topHalfW * 0.55
                    if (hasGrad) {
                        var spillGrad = ctx.createLinearGradient(baseX, horizonY, spillX, spillY)
                        spillGrad.addColorStop(0.0, colourWithAlpha(spotCol, (0.28 + v6 * 0.22) * (1.0 - dim)))
                        spillGrad.addColorStop(1.0, colourWithAlpha(spotCol, 0.0))
                        ctx.fillStyle = spillGrad
                    } else {
                        ctx.fillStyle = colourWithAlpha(spotCol, 0.14 * (1.0 - dim))
                    }
                    ctx.beginPath()
                    ctx.moveTo(baseX - baseHalfW * 1.4, horizonY)
                    ctx.lineTo(spillX - spillW, spillY)
                    ctx.lineTo(spillX + spillW, spillY)
                    ctx.lineTo(baseX + baseHalfW * 1.4, horizonY)
                    ctx.closePath()
                    ctx.fill()
                }

                // 1. Outer Soft Atmospheric Haze Cone (wide volumetric scatter)
                var hazeHalfW = topHalfW * 1.68
                if (hasGrad) {
                    var hazeGrad = ctx.createLinearGradient(baseX, horizonY, topX, topY)
                    hazeGrad.addColorStop(0.0, colourWithAlpha(spotCol, (0.20 + v6 * 0.18) * (1.0 - dim)))
                    hazeGrad.addColorStop(0.45, colourWithAlpha(coreCol, (0.10 + v6 * 0.12) * (1.0 - dim)))
                    hazeGrad.addColorStop(1.0, colourWithAlpha(spotCol, 0.0))
                    ctx.fillStyle = hazeGrad
                } else {
                    ctx.fillStyle = colourWithAlpha(spotCol, (0.12 + v6 * 0.10) * (1.0 - dim))
                }
                ctx.beginPath()
                ctx.moveTo(baseX - nx * baseHalfW * 1.6, horizonY - ny * baseHalfW * 1.6)
                ctx.lineTo(topX - nx * hazeHalfW, topY - ny * hazeHalfW)
                ctx.lineTo(topX + nx * hazeHalfW, topY + ny * hazeHalfW)
                ctx.lineTo(baseX + nx * baseHalfW * 1.6, horizonY + ny * baseHalfW * 1.6)
                ctx.closePath()
                ctx.fill()

                // 2. Main Collimated Searchlight Cone (with longitudinal gradient fade to 0.0 alpha)
                if (hasGrad) {
                    var mainGrad = ctx.createLinearGradient(baseX, horizonY, topX, topY)
                    mainGrad.addColorStop(0.0, colourWithAlpha("#ffffff", clamp((0.55 + v6 * 0.35) * (1.0 - dim), 0.0, 1.0)))
                    mainGrad.addColorStop(0.18, colourWithAlpha(spotCol, clamp((0.40 + v6 * 0.34) * (1.0 - dim), 0.0, 1.0)))
                    mainGrad.addColorStop(0.62, colourWithAlpha(coreCol, clamp((0.16 + v6 * 0.18) * (1.0 - dim), 0.0, 1.0)))
                    mainGrad.addColorStop(1.0, colourWithAlpha(spotCol, 0.0))
                    ctx.fillStyle = mainGrad
                } else {
                    ctx.fillStyle = colourWithAlpha(spotCol, (0.26 + v6 * 0.24) * (1.0 - dim))
                }
                ctx.beginPath()
                ctx.moveTo(baseX - nx * baseHalfW, horizonY - ny * baseHalfW)
                ctx.lineTo(topX - nx * topHalfW, topY - ny * topHalfW)
                ctx.lineTo(topX + nx * topHalfW, topY + ny * topHalfW)
                ctx.lineTo(baseX + nx * baseHalfW, horizonY + ny * baseHalfW)
                ctx.closePath()
                ctx.fill()

                // 3. Inner White-Hot Xenon Pencil Core
                var coreBaseW = baseHalfW * 0.45
                var coreTopW = topHalfW * 0.24
                var coreReach = reach * 0.88
                var coreTopX = baseX + dirX * coreReach
                var coreTopY = horizonY + dirY * coreReach
                if (hasGrad) {
                    var coreGrad = ctx.createLinearGradient(baseX, horizonY, coreTopX, coreTopY)
                    coreGrad.addColorStop(0.0, colourWithAlpha("#ffffff", clamp((0.85 + v6 * 0.15) * (1.0 - dim), 0.0, 1.0)))
                    coreGrad.addColorStop(0.35, colourWithAlpha(coreCol, clamp((0.48 + v6 * 0.32) * (1.0 - dim), 0.0, 1.0)))
                    coreGrad.addColorStop(1.0, colourWithAlpha(coreCol, 0.0))
                    ctx.fillStyle = coreGrad
                } else {
                    ctx.fillStyle = colourWithAlpha("#ffffff", (0.52 + v6 * 0.28) * (1.0 - dim))
                }
                ctx.beginPath()
                ctx.moveTo(baseX - nx * coreBaseW, horizonY - ny * coreBaseW)
                ctx.lineTo(coreTopX - nx * coreTopW, coreTopY - ny * coreTopW)
                ctx.lineTo(coreTopX + nx * coreTopW, coreTopY + ny * coreTopW)
                ctx.lineTo(baseX + nx * coreBaseW, horizonY + ny * coreBaseW)
                ctx.closePath()
                ctx.fill()

                // 4. 3-Facet Internal Prism-Split Laser Shafts on active frequency peaks
                if (v6 > 0.22) {
                    var prismSpread = 0.042 + v6 * 0.035
                    if (hasGrad) {
                        var shaftGrad = ctx.createLinearGradient(baseX, horizonY, coreTopX, coreTopY)
                        shaftGrad.addColorStop(0.0, colourWithAlpha("#ffffff", clamp(0.82 * (1.0 - dim), 0.0, 1.0)))
                        shaftGrad.addColorStop(0.55, colourWithAlpha(coreCol, clamp(0.45 * (1.0 - dim), 0.0, 1.0)))
                        shaftGrad.addColorStop(1.0, colourWithAlpha(spotCol, 0.0))
                        ctx.strokeStyle = shaftGrad
                    } else {
                        ctx.strokeStyle = colourWithAlpha(coreCol, 0.55 * (1.0 - dim))
                    }
                    ctx.lineWidth = 1.2 + v6 * 1.1
                    ctx.beginPath()
                    for (var pf = -1; pf <= 1; pf++) {
                        var pTilt = tilt + pf * prismSpread
                        var pLen = reach * (pf === 0 ? 0.92 : 0.78)
                        ctx.moveTo(baseX, horizonY)
                        ctx.lineTo(baseX + Math.sin(pTilt) * pLen, horizonY - Math.cos(pTilt) * pLen)
                    }
                    ctx.stroke()
                }

                // 5. Pure Hot Stage Emitter Core Orb (no housing boxes or horizontal lines)
                ctx.fillStyle = colourWithAlpha("#ffffff", clamp((0.88 + v6 * 0.12) * (1.0 - dim), 0.0, 1.0))
                ctx.beginPath()
                ctx.arc(baseX, horizonY, 2.2 + v6 * 1.8, 0, Math.PI * 2)
                ctx.fill()
            }
        } else if (eqStyle === 7) {
            // Style 7: 3D Sonic Orb — Slowly Revolving 3-Axis 3D Sphere Wrapped in 16×8 Extruded Segmented Hardware LED Level Tiles
            var orbCX = vanishX
            var orbCY = horizonY - minDim * 0.20
            var orbScale = minDim * (0.165 + state.bassSmooth * 0.022)
            // Continuous 3-axis 360° 3D revolution so poles, equator, and radial extrusions are seen from every angle
            var orbRx = eqSpinT * 0.36
            var orbRy = eqSpinT * 0.54
            var orbRz = eqSpinT * 0.22
            var orbFov = 4.6
            var lonCols = 16
            var latTiers = 8

            // 1. Solid dark matte hardware chassis sphere + 3D revolving equatorial & polar gimbal rings
            ctx.fillStyle = "rgba(4, 6, 12, " + clamp(0.72 * (1.0 - dim * 0.4), 0.45, 0.82).toFixed(3) + ")"
            ctx.beginPath()
            ctx.arc(orbCX, orbCY, orbScale * 1.02, 0, Math.PI * 2)
            ctx.fill()

            ctx.strokeStyle = colourWithAlpha("#00e5ff", 0.44 * (1.0 - dim))
            ctx.lineWidth = 1.5
            ctx.beginPath()
            for (var grRing = 0; grRing < 2; grRing++) {
                for (var gs7 = 0; gs7 <= 28; gs7++) {
                    var ga7 = (gs7 / 28.0) * Math.PI * 2.0
                    var gx7 = grRing === 0 ? Math.cos(ga7) * 1.12 : 0.0
                    var gy7 = grRing === 0 ? 0.0 : Math.sin(ga7) * 1.12
                    var gz7 = grRing === 0 ? Math.sin(ga7) * 1.12 : Math.cos(ga7) * 1.12
                    var gp7 = project3DPoint(gx7, gy7, gz7, orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov)
                    if (gs7 === 0) ctx.moveTo(gp7.x, gp7.y)
                    else ctx.lineTo(gp7.x, gp7.y)
                }
            }
            ctx.stroke()

            // Sample and spatially smooth 16 longitude frequency columns
            var rawColVals = []
            for (var cS = 0; cS < lonCols; cS++) {
                var bIdx7 = mapEqBandIndex(cS, lonCols, eqLayout)
                rawColVals.push(clamp(sampleEqBandValue(state, bIdx7, eqDamping, eqGain), 0.04, 1.15))
            }
            var smoothColVals = []
            for (var cSm = 0; cSm < lonCols; cSm++) {
                var prevV = rawColVals[(cSm + lonCols - 1) % lonCols]
                var curV = rawColVals[cSm]
                var nextV = rawColVals[(cSm + 1) % lonCols]
                smoothColVals.push(0.25 * prevV + 0.50 * curV + 0.25 * nextV)
            }

            // 2. Render discrete 3D spherical LED tiles with radial 3D extrusion on lit frequency tiers
            var unlitBuckets = []
            var litBuckets = [[], [], [], []] // 0: Emerald low, 1: Cyan mid-low, 2: Amber mid-high, 3: Crimson peak
            var ledCols7 = ["#00ff9d", "#00e5ff", "#ffb300", "#ff1744"]

            for (var cLon = 0; cLon < lonCols; cLon++) {
                var theta0 = ((cLon + 0.14) / lonCols) * Math.PI * 2.0
                var theta1 = ((cLon + 0.86) / lonCols) * Math.PI * 2.0
                var thetaMid = (theta0 + theta1) * 0.5
                var colLevel = clamp(smoothColVals[cLon] * 1.05, 0.08, 1.0)
                var litTierCount = Math.max(1, Math.min(latTiers, Math.round(colLevel * latTiers)))

                for (var rTier = 0; rTier < latTiers; rTier++) {
                    var u0 = (rTier + 0.14) / latTiers
                    var u1 = (rTier + 0.86) / latTiers
                    var phi0 = (0.5 - u0) * Math.PI * 0.84
                    var phi1 = (0.5 - u1) * Math.PI * 0.84
                    var phiMid = (phi0 + phi1) * 0.5
                    var isLit7 = (rTier < litTierCount)
                    var rRad = isLit7 ? (1.0 + colLevel * 0.18 + (rTier / latTiers) * 0.08) : 1.0

                    var cMid = project3DPoint(
                        Math.cos(phiMid) * Math.cos(thetaMid) * rRad,
                        Math.sin(phiMid) * rRad,
                        Math.cos(phiMid) * Math.sin(thetaMid) * rRad,
                        orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov
                    )
                    if (cMid.z < -0.05) continue

                    var p00 = project3DPoint(Math.cos(phi0) * Math.cos(theta0) * rRad, Math.sin(phi0) * rRad, Math.cos(phi0) * Math.sin(theta0) * rRad, orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov)
                    var p01 = project3DPoint(Math.cos(phi0) * Math.cos(theta1) * rRad, Math.sin(phi0) * rRad, Math.cos(phi0) * Math.sin(theta1) * rRad, orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov)
                    var p11 = project3DPoint(Math.cos(phi1) * Math.cos(theta1) * rRad, Math.sin(phi1) * rRad, Math.cos(phi1) * Math.sin(theta1) * rRad, orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov)
                    var p10 = project3DPoint(Math.cos(phi1) * Math.cos(theta0) * rRad, Math.sin(phi1) * rRad, Math.cos(phi1) * Math.sin(theta0) * rRad, orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov)

                    var quad = { p00: p00, p01: p01, p11: p11, p10: p10 }
                    if (isLit7) {
                        var tierBucket = rTier < 3 ? 0 : (rTier < 5 ? 1 : (rTier < 7 ? 2 : 3))
                        litBuckets[tierBucket].push(quad)
                    } else {
                        unlitBuckets.push(quad)
                    }
                }
            }

            // Draw unlit recessed LED sockets on the sphere
            if (unlitBuckets.length > 0) {
                ctx.fillStyle = "rgba(18, 28, 44, " + (0.52 * (1.0 - dim)).toFixed(3) + ")"
                ctx.strokeStyle = "rgba(40, 62, 92, " + (0.38 * (1.0 - dim)).toFixed(3) + ")"
                ctx.lineWidth = 0.85
                ctx.beginPath()
                for (var ui = 0; ui < unlitBuckets.length; ui++) {
                    var uq = unlitBuckets[ui]
                    ctx.moveTo(uq.p00.x, uq.p00.y)
                    ctx.lineTo(uq.p01.x, uq.p01.y)
                    ctx.lineTo(uq.p11.x, uq.p11.y)
                    ctx.lineTo(uq.p10.x, uq.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }

            // Draw lit hardware LED tiers (Emerald -> Cyan -> Amber -> Crimson Peak)
            for (var lb = 0; lb < 4; lb++) {
                var bList = litBuckets[lb]
                if (bList.length === 0) continue
                var ledHex = ledCols7[lb]
                ctx.fillStyle = colourWithAlpha(ledHex, (0.82 + state.bassSmooth * 0.16) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha("#ffffff", (0.55 + lb * 0.12) * (1.0 - dim))
                ctx.lineWidth = 1.05
                ctx.beginPath()
                for (var li = 0; li < bList.length; li++) {
                    var lq = bList[li]
                    ctx.moveTo(lq.p00.x, lq.p00.y)
                    ctx.lineTo(lq.p01.x, lq.p01.y)
                    ctx.lineTo(lq.p11.x, lq.p11.y)
                    ctx.lineTo(lq.p10.x, lq.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 8) {
            // Style 8: 3D Torus Reactor — Slowly 3D-Tumbling Circular Segmented LED VU-Meter Torus Ring
            var torCX = vanishX
            var torCY = horizonY - minDim * 0.20
            var torScale = minDim * (0.22 + state.bassSmooth * 0.025)
            // Continuous 3-axis 3D revolution so the torus flips smoothly through edge-on, angled, and face-on perspectives
            var torRx = eqSpinT * 0.38
            var torRy = eqSpinT * 0.52
            var torRz = eqSpinT * 0.24
            var torFov = 4.2
            var radialCols = 24
            var ringTiers = 6
            var rInner = 0.44
            var rOuter = 1.24

            // 1. Solid dark matte 3D torus chassis ring (occluding background lines between rInner and rOuter)
            ctx.fillStyle = "rgba(4, 6, 12, " + clamp(0.72 * (1.0 - dim * 0.4), 0.45, 0.82).toFixed(3) + ")"
            ctx.strokeStyle = colourWithAlpha("#00e5ff", 0.42 * (1.0 - dim))
            ctx.lineWidth = 1.5
            for (var cSeg = 0; cSeg < radialCols; cSeg++) {
                var a0 = (cSeg / radialCols) * Math.PI * 2.0
                var a1 = ((cSeg + 1) / radialCols) * Math.PI * 2.0
                var cIn0 = project3DPoint(Math.cos(a0) * rInner, 0.0, Math.sin(a0) * rInner, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                var cIn1 = project3DPoint(Math.cos(a1) * rInner, 0.0, Math.sin(a1) * rInner, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                var cOut1 = project3DPoint(Math.cos(a1) * rOuter, 0.0, Math.sin(a1) * rOuter, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                var cOut0 = project3DPoint(Math.cos(a0) * rOuter, 0.0, Math.sin(a0) * rOuter, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                ctx.beginPath()
                ctx.moveTo(cIn0.x, cIn0.y)
                ctx.lineTo(cIn1.x, cIn1.y)
                ctx.lineTo(cOut1.x, cOut1.y)
                ctx.lineTo(cOut0.x, cOut0.y)
                ctx.closePath()
                ctx.fill()
            }

            // 2. Render 24 radial columns × 6 concentric 3D LED level segments with 3D poloidal tube arch
            var unlitTorus = []
            var litTorus = [[], [], [], []]
            var ledCols8 = ["#00ff9d", "#00e5ff", "#ffb300", "#ff1744"]

            for (var uIdx = 0; uIdx < radialCols; uIdx++) {
                var bIdx8 = mapEqBandIndex(uIdx, radialCols, eqLayout)
                var v8 = clamp(sampleEqBandValue(state, bIdx8, eqDamping, eqGain) * 1.10, 0.06, 1.0)
                var litRings = Math.max(1, Math.min(ringTiers, Math.round(v8 * ringTiers)))
                var uAng0 = ((uIdx + 0.14) / radialCols) * Math.PI * 2.0
                var uAng1 = ((uIdx + 0.86) / radialCols) * Math.PI * 2.0
                var cos0 = Math.cos(uAng0), sin0 = Math.sin(uAng0)
                var cos1 = Math.cos(uAng1), sin1 = Math.sin(uAng1)

                for (var rt = 0; rt < ringTiers; rt++) {
                    var t0 = (rt + 0.14) / ringTiers
                    var t1 = (rt + 0.86) / ringTiers
                    var rad0 = lerp(rInner + 0.04, rOuter - 0.04, t0)
                    var rad1 = lerp(rInner + 0.04, rOuter - 0.04, t1)
                    // 3D poloidal torus arch elevation boosted by audio energy
                    var archBoost = (rt < litRings) ? (0.22 + v8 * 0.16) : 0.14
                    var archY0 = -archBoost * Math.sin(t0 * Math.PI)
                    var archY1 = -archBoost * Math.sin(t1 * Math.PI)

                    var tp00 = project3DPoint(cos0 * rad0, archY0, sin0 * rad0, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                    var tp01 = project3DPoint(cos1 * rad0, archY0, sin1 * rad0, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                    var tp11 = project3DPoint(cos1 * rad1, archY1, sin1 * rad1, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                    var tp10 = project3DPoint(cos0 * rad1, archY1, sin0 * rad1, torRx, torRy, torRz, torCX, torCY, torScale, torFov)

                    var tQuad = { p00: tp00, p01: tp01, p11: tp11, p10: tp10 }
                    if (rt < litRings) {
                        var tb8 = rt < 2 ? 0 : (rt < 4 ? 1 : (rt < 5 ? 2 : 3))
                        litTorus[tb8].push(tQuad)
                    } else {
                        unlitTorus.push(tQuad)
                    }
                }
            }

            if (unlitTorus.length > 0) {
                ctx.fillStyle = "rgba(18, 26, 40, " + (0.55 * (1.0 - dim)).toFixed(3) + ")"
                ctx.strokeStyle = "rgba(42, 60, 88, " + (0.35 * (1.0 - dim)).toFixed(3) + ")"
                ctx.lineWidth = 0.85
                ctx.beginPath()
                for (var ut = 0; ut < unlitTorus.length; ut++) {
                    var qU = unlitTorus[ut]
                    ctx.moveTo(qU.p00.x, qU.p00.y)
                    ctx.lineTo(qU.p01.x, qU.p01.y)
                    ctx.lineTo(qU.p11.x, qU.p11.y)
                    ctx.lineTo(qU.p10.x, qU.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }

            for (var lb8 = 0; lb8 < 4; lb8++) {
                var list8 = litTorus[lb8]
                if (list8.length === 0) continue
                ctx.fillStyle = colourWithAlpha(ledCols8[lb8], (0.85 + state.bassSmooth * 0.14) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha("#ffffff", (0.52 + lb8 * 0.14) * (1.0 - dim))
                ctx.lineWidth = 1.05
                ctx.beginPath()
                for (var l8 = 0; l8 < list8.length; l8++) {
                    var qL = list8[l8]
                    ctx.moveTo(qL.p00.x, qL.p00.y)
                    ctx.lineTo(qL.p01.x, qL.p01.y)
                    ctx.lineTo(qL.p11.x, qL.p11.y)
                    ctx.lineTo(qL.p10.x, qL.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 9) {
            // Style 9: Cymatic Chladni — Slowly 3D-Revolving 16×8 Tenori-On / Launchpad LED Resonance Matrix Deck
            var cymCX = vanishX
            var cymCY = horizonY - minDim * 0.20
            var cymScale = minDim * 0.27
            // Continuous 3D yaw revolution + organic 3D pitch & roll tilt so you see the 3D relief from all angles
            var cymRx = 0.68 + Math.sin(eqSpinT * 0.34) * 0.42
            var cymRy = eqSpinT * 0.40
            var cymRz = Math.sin(eqSpinT * 0.26) * 0.26
            var cymFov = 3.8
            var padCols = 16
            var padRows = 8
            var deckW = 1.56
            var deckD = 0.88

            // 1. Solid dark matte 3D hardware Launchpad chassis board + metallic bezel border
            var chFL = project3DPoint(-deckW, 0.06, -deckD, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
            var chFR = project3DPoint( deckW, 0.06, -deckD, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
            var chBR = project3DPoint( deckW, 0.06,  deckD, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
            var chBL = project3DPoint(-deckW, 0.06,  deckD, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)

            ctx.fillStyle = "rgba(4, 6, 12, " + clamp(0.72 * (1.0 - dim * 0.4), 0.48, 0.84).toFixed(3) + ")"
            ctx.strokeStyle = colourWithAlpha("#00e5ff", 0.55 * (1.0 - dim))
            ctx.lineWidth = 2.0
            ctx.beginPath()
            ctx.moveTo(chFL.x, chFL.y)
            ctx.lineTo(chFR.x, chFR.y)
            ctx.lineTo(chBR.x, chBR.y)
            ctx.lineTo(chBL.x, chBL.y)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()

            // Harmonic Chladni standing-wave mode numbers driven by bass/mid/treble
            var modeN = 2.0 + Math.floor(((state.bassSmooth * 3.0 + state.midSmooth * 3.0) % 4.0))
            var modeM = 1.0 + Math.floor(((state.highSmooth * 3.0 + state.energySmooth * 3.0) % 3.0))

            var unlitPads = []
            var litPads = [[], [], [], []]
            var ledCols9 = ["#00ff9d", "#00e5ff", "#ffb300", "#ff1744"]

            for (var pr = padRows - 1; pr >= 0; pr--) {
                var vR0 = (pr + 0.16) / padRows
                var vR1 = (pr + 0.84) / padRows
                var z0 = lerp(-deckD * 0.92, deckD * 0.92, vR0)
                var z1 = lerp(-deckD * 0.92, deckD * 0.92, vR1)
                var nyNorm = ((pr + 0.5) / padRows - 0.5) * 2.0

                for (var pc = 0; pc < padCols; pc++) {
                    var uC0 = (pc + 0.16) / padCols
                    var uC1 = (pc + 0.84) / padCols
                    var x0 = lerp(-deckW * 0.94, deckW * 0.94, uC0)
                    var x1 = lerp(-deckW * 0.94, deckW * 0.94, uC1)
                    var nxNorm = ((pc + 0.5) / padCols - 0.5) * 2.0

                    var bIdx9 = mapEqBandIndex(pc, padCols, eqLayout)
                    var v9 = sampleEqBandValue(state, bIdx9, eqDamping, eqGain)

                    // 2D Chladni standing-wave resonance pattern across the 16×8 LED pad matrix
                    var chladniVal = Math.abs(
                        Math.cos(modeN * Math.PI * nxNorm * 0.5 + eqSpinT * 1.1) * Math.cos(modeM * Math.PI * nyNorm * 0.5) -
                        Math.cos(modeM * Math.PI * nxNorm * 0.5 - eqSpinT * 0.9) * Math.cos(modeN * Math.PI * nyNorm * 0.5)
                    )
                    var padEnergy = clamp(chladniVal * (0.42 + v9 * 0.95), 0.0, 1.2)
                    var elevY = padEnergy > 0.22 ? -padEnergy * 0.24 : 0.0

                    var pp00 = project3DPoint(x0, elevY, z0, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
                    var pp01 = project3DPoint(x1, elevY, z0, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
                    var pp11 = project3DPoint(x1, elevY, z1, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
                    var pp10 = project3DPoint(x0, elevY, z1, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
                    var pQuad = { p00: pp00, p01: pp01, p11: pp11, p10: pp10 }

                    if (padEnergy < 0.22) {
                        unlitPads.push(pQuad)
                    } else if (padEnergy < 0.45) {
                        litPads[0].push(pQuad)
                    } else if (padEnergy < 0.68) {
                        litPads[1].push(pQuad)
                    } else if (padEnergy < 0.88) {
                        litPads[2].push(pQuad)
                    } else {
                        litPads[3].push(pQuad)
                    }
                }
            }

            if (unlitPads.length > 0) {
                ctx.fillStyle = "rgba(18, 26, 40, " + (0.65 * (1.0 - dim)).toFixed(3) + ")"
                ctx.strokeStyle = "rgba(42, 60, 88, " + (0.40 * (1.0 - dim)).toFixed(3) + ")"
                ctx.lineWidth = 0.85
                ctx.beginPath()
                for (var up9 = 0; up9 < unlitPads.length; up9++) {
                    var q9U = unlitPads[up9]
                    ctx.moveTo(q9U.p00.x, q9U.p00.y)
                    ctx.lineTo(q9U.p01.x, q9U.p01.y)
                    ctx.lineTo(q9U.p11.x, q9U.p11.y)
                    ctx.lineTo(q9U.p10.x, q9U.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }

            for (var lb9 = 0; lb9 < 4; lb9++) {
                var list9 = litPads[lb9]
                if (list9.length === 0) continue
                ctx.fillStyle = colourWithAlpha(ledCols9[lb9], (0.86 + state.bassSmooth * 0.14) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha("#ffffff", (0.55 + lb9 * 0.12) * (1.0 - dim))
                ctx.lineWidth = 1.05
                ctx.beginPath()
                for (var l9 = 0; l9 < list9.length; l9++) {
                    var q9L = list9[l9]
                    ctx.moveTo(q9L.p00.x, q9L.p00.y)
                    ctx.lineTo(q9L.p01.x, q9L.p01.y)
                    ctx.lineTo(q9L.p11.x, q9L.p11.y)
                    ctx.lineTo(q9L.p10.x, q9L.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 10) {
            // Style 10: 3D Helix Vortex — Stereo Flanking 3D-Tumbling Segmented LED DNA Equaliser Cylinders
            var towerFlanks = [-1, 1]
            var rungCount = 16
            var towerScale = minDim * 0.20
            var ledCols10 = ["#00ff9d", "#ffb300", "#ff1744"]

            for (var tf = 0; tf < towerFlanks.length; tf++) {
                var sideSign = towerFlanks[tf]
                var towCX = w * 0.5 + sideSign * w * 0.28
                var towCY = horizonY - minDim * 0.22
                // Continuous 3-axis 3D revolution so each stereo DNA helix cylinder tumbles in 3D space
                var towRx = Math.sin(eqSpinT * 0.42 + sideSign) * 0.65
                var towRy = eqSpinT * 0.78 * sideSign
                var towRz = Math.cos(eqSpinT * 0.31 + sideSign) * 0.42

                // 1. 3D Revolving Cylindrical End-Cap Rings & Axial Core Spine
                ctx.strokeStyle = colourWithAlpha("#00e5ff", 0.45 * (1.0 - dim))
                ctx.lineWidth = 1.4
                ctx.beginPath()
                for (var capEnd = -1; capEnd <= 1; capEnd += 2) {
                    for (var cs10 = 0; cs10 <= 16; cs10++) {
                        var ca10 = (cs10 / 16.0) * Math.PI * 2.0
                        var cp10 = project3DPoint(Math.cos(ca10) * 0.42, capEnd * 1.12, Math.sin(ca10) * 0.42, towRx, towRy, towRz, towCX, towCY, towerScale, 3.6)
                        if (cs10 === 0) ctx.moveTo(cp10.x, cp10.y)
                        else ctx.lineTo(cp10.x, cp10.y)
                    }
                }
                ctx.stroke()

                var strandA = []
                var strandB = []
                for (var rn = 0; rn < rungCount; rn++) {
                    var uY = rn / (rungCount - 1)
                    var y3 = lerp(1.08, -1.08, uY)
                    var bIdx10 = mapEqBandIndex(rn, rungCount, eqLayout)
                    var v10 = clamp(sampleEqBandValue(state, bIdx10, eqDamping, eqGain) * 1.15, 0.08, 1.0)
                    var twistAng = uY * Math.PI * 3.2 - eqSpinT * 2.2 * sideSign
                    var rad3 = 0.32 + v10 * 0.14

                    var pA = project3DPoint(Math.cos(twistAng) * rad3, y3, Math.sin(twistAng) * rad3, towRx, towRy, towRz, towCX, towCY, towerScale, 3.6)
                    var pB = project3DPoint(Math.cos(twistAng + Math.PI) * rad3, y3, Math.sin(twistAng + Math.PI) * rad3, towRx, towRy, towRz, towCX, towCY, towerScale, 3.6)
                    strandA.push(pA)
                    strandB.push(pB)

                    // Segmented 5-step LED meter rung bridging strandA and strandB (lights up from centre outward)
                    var activeSegs = Math.max(1, Math.min(3, Math.ceil(v10 * 3.0)))
                    for (var sStep = -2; sStep <= 2; sStep++) {
                        var distStep = Math.abs(sStep) // 0 = centre (Emerald), 1 = mid (Amber), 2 = outer peak (Crimson)
                        var uSeg0 = (sStep + 2.12) / 5.0
                        var uSeg1 = (sStep + 2.88) / 5.0
                        var sx0 = lerp(pA.x, pB.x, uSeg0), sy0 = lerp(pA.y, pB.y, uSeg0)
                        var sx1 = lerp(pA.x, pB.x, uSeg1), sy1 = lerp(pA.y, pB.y, uSeg1)
                        var isLit = distStep < activeSegs
                        ctx.strokeStyle = isLit
                            ? colourWithAlpha(ledCols10[distStep], (0.90 + state.bassSmooth * 0.10) * (1.0 - dim))
                            : "rgba(28, 40, 62, " + (0.48 * (1.0 - dim)).toFixed(3) + ")"
                        ctx.lineWidth = isLit ? 3.4 : 2.0
                        ctx.beginPath()
                        ctx.moveTo(sx0, sy0)
                        ctx.lineTo(sx1, sy1)
                        ctx.stroke()
                    }
                }

                // Glowing 3D double-helix backbone rails
                for (var spSide = 0; spSide < 2; spSide++) {
                    var pts10 = spSide === 0 ? strandA : strandB
                    ctx.strokeStyle = colourWithAlpha(spSide === 0 ? "#00e5ff" : "#ff00aa", 0.85 * (1.0 - dim))
                    ctx.lineWidth = 2.2
                    ctx.beginPath()
                    for (var kp = 0; kp < pts10.length; kp++) {
                        if (kp === 0) ctx.moveTo(pts10[kp].x, pts10[kp].y)
                        else ctx.lineTo(pts10[kp].x, pts10[kp].y)
                    }
                    ctx.stroke()
                }
            }
        } else if (eqStyle === 11) {
            // Style 11: Tesla Plasma Arcs — Slowly 3D-Revolving Cylindrical Carousel of 16 Vacuum Plasma Equaliser Tubes
            var tubeCount = 16
            var tierSteps = 8
            var bankCX = vanishX
            var bankCY = horizonY - minDim * 0.20
            var bankScale = minDim * 0.34
            // Continuous 3D revolution so the 3D carousel of 16 vacuum plasma tubes revolves in 3D space
            var bankRx = 0.36 + Math.sin(eqSpinT * 0.38) * 0.36
            var bankRy = eqSpinT * 0.44
            var bankRz = Math.sin(eqSpinT * 0.26) * 0.22
            var bankFov = 3.8
            var ledCols11 = ["#00ff9d", "#00e5ff", "#ffb300", "#ff1744"]
            var carouselR = 1.05

            for (var tb = 0; tb < tubeCount; tb++) {
                var uTube = (tb + 0.5) / tubeCount
                var arcAng = (uTube - 0.5) * Math.PI * 1.75
                var txCenter = Math.sin(arcAng) * carouselR
                var tzCenter = Math.cos(arcAng) * carouselR * 0.72
                var tubeHalfW = 0.048
                var yBot3 = 0.38
                var yTop3 = -0.46

                var bL = project3DPoint(txCenter - tubeHalfW, yBot3, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                var bR = project3DPoint(txCenter + tubeHalfW, yBot3, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                var tR = project3DPoint(txCenter + tubeHalfW, yTop3, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                var tL = project3DPoint(txCenter - tubeHalfW, yTop3, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)

                // 1. Dark glass 3D vacuum tube silhouette + metallic cathode base & anode cap
                ctx.fillStyle = "rgba(4, 6, 12, " + clamp(0.76 * (1.0 - dim * 0.4), 0.48, 0.86).toFixed(3) + ")"
                ctx.strokeStyle = colourWithAlpha("#00e5ff", 0.42 * (1.0 - dim))
                ctx.lineWidth = 1.25
                ctx.beginPath()
                ctx.moveTo(bL.x, bL.y)
                ctx.lineTo(bR.x, bR.y)
                ctx.lineTo(tR.x, tR.y)
                ctx.lineTo(tL.x, tL.y)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()

                var bIdx11 = mapEqBandIndex(tb, tubeCount, eqLayout)
                var v11 = clamp(sampleEqBandValue(state, bIdx11, eqDamping, eqGain) * 1.12, 0.08, 1.0)
                var litCells = Math.max(1, Math.min(tierSteps, Math.round(v11 * tierSteps)))

                // 2. Segmented 8-tier LED / Nixie plasma cells inside the vacuum tube
                var topLitY3 = yBot3
                for (var ts = 0; ts < tierSteps; ts++) {
                    var uS0 = (ts + 0.18) / tierSteps
                    var uS1 = (ts + 0.82) / tierSteps
                    var sy0 = lerp(yBot3 - 0.03, yTop3 + 0.06, uS0)
                    var sy1 = lerp(yBot3 - 0.03, yTop3 + 0.06, uS1)
                    var inW = tubeHalfW * 0.72
                    var c00 = project3DPoint(txCenter - inW, sy0, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                    var c01 = project3DPoint(txCenter + inW, sy0, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                    var c11 = project3DPoint(txCenter + inW, sy1, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                    var c10 = project3DPoint(txCenter - inW, sy1, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)

                    if (ts < litCells) {
                        topLitY3 = sy1
                        var cBucket = ts < 3 ? 0 : (ts < 5 ? 1 : (ts < 7 ? 2 : 3))
                        ctx.fillStyle = colourWithAlpha(ledCols11[cBucket], (0.86 + state.bassSmooth * 0.14) * (1.0 - dim))
                    } else {
                        ctx.fillStyle = "rgba(18, 26, 40, " + (0.45 * (1.0 - dim)).toFixed(3) + ")"
                    }
                    ctx.beginPath()
                    ctx.moveTo(c00.x, c00.y)
                    ctx.lineTo(c01.x, c01.y)
                    ctx.lineTo(c11.x, c11.y)
                    ctx.lineTo(c10.x, c10.y)
                    ctx.closePath()
                    ctx.fill()
                }

                // 3. Compact high-voltage Tesla plasma arc inside the upper vacuum tube (from top lit cell to anode cap)
                var arcStart = project3DPoint(txCenter, topLitY3, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                var arcEnd = project3DPoint(txCenter, yTop3 + 0.02, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                var jitX = Math.sin((state.t || 0.0) * 22.0 + tb * 4.1) * (bR.x - bL.x) * 0.28
                ctx.strokeStyle = colourWithAlpha("#ffffff", (0.72 + v11 * 0.28) * (1.0 - dim))
                ctx.lineWidth = 1.2 + v11 * 0.9
                ctx.beginPath()
                ctx.moveTo(arcStart.x, arcStart.y)
                ctx.lineTo((arcStart.x + arcEnd.x) * 0.5 + jitX, (arcStart.y + arcEnd.y) * 0.5)
                ctx.lineTo(arcEnd.x, arcEnd.y)
                ctx.stroke()
            }
        } else if (eqStyle === 12) {
            // Style 12: Tralis Voxel City — Slowly 3D-Revolving 12 × 4 Architectural 3D Segmented-LED Skyscraper Metropolis
            var cityHist = (state.eqRidgeHistory && state.eqRidgeHistory.length > 0) ? state.eqRidgeHistory : null
            var cityCols = 12
            var cityRows = 4
            var colSpan = 2.85
            var colSpacing = colSpan / cityCols
            var halfW = colSpacing * 0.30
            var worldCityStep = Math.floor(eqSpinT * 2.4)
            var zPhaseCity = (((eqSpinT * 2.4) % 1.0) + 1.0) % 1.0
            var cityCX = vanishX
            var cityCY = horizonY - minDim * 0.22
            var cityScale = minDim * 0.42
            // Continuous 3D yaw revolution + pitch/roll oscillation so all 3D sides of the voxel towers are revealed
            var cityRx = 0.42 + Math.sin(eqSpinT * 0.29) * 0.22
            var cityRy = Math.sin(eqSpinT * 0.32) * 0.78
            var cityRz = Math.sin(eqSpinT * 0.21) * 0.14
            var ledCols12 = ["#00ff9d", "#00e5ff", "#ffb300", "#ff1744"]

            // Precompute outer-to-inner column draw order so inner towers cleanly occlude outer towers' inner side faces
            var colOrder = []
            for (var cOrd = 0; cOrd < cityCols; cOrd++) {
                colOrder.push(cOrd)
            }
            var midColIdx = (cityCols - 1) * 0.5
            colOrder.sort(function(a, b) {
                return Math.abs(b - midColIdx) - Math.abs(a - midColIdx)
            })

            // Render strictly back-to-front (from farthest horizon row `rCity = 0` to nearest foreground row `rCity = cityRows - 1`)
            for (var rCity = 0; rCity < cityRows; rCity++) {
                var uRow = clamp((rCity + zPhaseCity) / cityRows, 0.04, 0.995)
                var histRowIdx = eqSpinDir >= 0
                    ? Math.min((cityHist ? cityHist.length : 1) - 1, rCity)
                    : Math.min((cityHist ? cityHist.length : 1) - 1, (cityRows - 1 - rCity))
                var rowSlice = cityHist ? cityHist[histRowIdx] : null
                var rowFade = Math.sin(uRow * Math.PI)

                // World Z from far horizon (+2.45) to near foreground (-0.65) with generous row avenue spacing
                var zCenter = lerp(2.45, -0.65, uRow)
                var halfDepthZ = 0.13
                var zBack = zCenter + halfDepthZ
                var zFront = zCenter - halfDepthZ
                var groundY3 = 0.30 // anchored near horizonY in local space so towers rise upward into y <= horizonY

                // 1. Sample raw column heights across the row, then apply 3-tap spatial smoothing (0.25*prev + 0.50*cur + 0.25*next)
                var rawHeights = []
                for (var cRaw = 0; cRaw < cityCols; cRaw++) {
                    var uColRaw = (cRaw + 0.5) / cityCols
                    var bIdx12 = mapEqBandIndex(cRaw, cityCols, eqLayout)
                    var bin36City = Math.min(35, Math.floor((bIdx12 / 63.0) * 35))
                    var rawBandVal = rowSlice && rowSlice.bins ? (rowSlice.bins[bin36City] || 0.06) : sampleEqBandValue(state, bIdx12, eqDamping, eqGain)
                    var colDist = Math.abs(uColRaw - 0.5) * 2.0
                    var bmtBoost = colDist < 0.35 ? (0.85 + state.bassSmooth * 0.50) : (colDist < 0.70 ? (0.85 + state.midSmooth * 0.45) : (0.85 + state.highSmooth * 0.45))
                    rawHeights.push(clamp(rawBandVal * eqGain * bmtBoost * 1.02, 0.08, 1.32))
                }

                var hullFillStyle = "rgba(4, 6, 12, " + clamp(0.92 * (0.48 + 0.52 * rowFade), 0.45, 0.95).toFixed(3) + ")"
                ctx.lineWidth = 1.05 + 1.20 * uRow

                // 2. Render columns from outer edges inward toward cityCX so inner towers cleanly occlude outer towers
                for (var oi = 0; oi < colOrder.length; oi++) {
                    var cCity = colOrder[oi]
                    var prevH = rawHeights[Math.max(0, cCity - 1)]
                    var curH = rawHeights[cCity]
                    var nextH = rawHeights[Math.min(cityCols - 1, cCity + 1)]
                    var towerH = 0.25 * prevH + 0.50 * curH + 0.25 * nextH
                    var topY3 = groundY3 - towerH
                    var normH = clamp(towerH / 1.32, 0.08, 1.0)
                    var topTierIdx = normH < 0.35 ? 0 : (normH < 0.62 ? 1 : (normH < 0.84 ? 2 : 3))
                    var topLedCol = ledCols12[topTierIdx]

                    var uCol = (cCity + 0.5) / cityCols
                    var xCenter = (uCol - 0.5) * colSpan
                    var xL = xCenter - halfW
                    var xR = xCenter + halfW

                    // Project visible corners of the 3D skyscraper prism
                    var bFL = project3DPoint(xL, groundY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var bFR = project3DPoint(xR, groundY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var bBR = project3DPoint(xR, groundY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var bBL = project3DPoint(xL, groundY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)

                    var tFL = project3DPoint(xL, topY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var tFR = project3DPoint(xR, topY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var tBR = project3DPoint(xR, topY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var tBL = project3DPoint(xL, topY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)

                    // Step A: Solid dark matte hull fill on visible front face, inner side face, and roof to occlude background clutter
                    ctx.fillStyle = hullFillStyle
                    ctx.beginPath()
                    ctx.moveTo(bFL.x, bFL.y)
                    ctx.lineTo(bFR.x, bFR.y)
                    ctx.lineTo(tFR.x, tFR.y)
                    ctx.lineTo(tFL.x, tFL.y)
                    ctx.closePath()
                    if (xCenter < -0.02) {
                        ctx.moveTo(bFR.x, bFR.y)
                        ctx.lineTo(bBR.x, bBR.y)
                        ctx.lineTo(tBR.x, tBR.y)
                        ctx.lineTo(tFR.x, tFR.y)
                        ctx.closePath()
                    } else if (xCenter > 0.02) {
                        ctx.moveTo(bBL.x, bBL.y)
                        ctx.lineTo(bFL.x, bFL.y)
                        ctx.lineTo(tFL.x, tFL.y)
                        ctx.lineTo(tBL.x, tBL.y)
                        ctx.closePath()
                    }
                    ctx.moveTo(tFL.x, tFL.y)
                    ctx.lineTo(tFR.x, tFR.y)
                    ctx.lineTo(tBR.x, tBR.y)
                    ctx.lineTo(tBL.x, tBL.y)
                    ctx.closePath()
                    ctx.fill()

                    // Step B: Glowing LED level-colour tint on the 3D rooftop quad
                    ctx.fillStyle = colourWithAlpha(topLedCol, clamp((0.42 + 0.38 * uRow) * (0.40 + 0.60 * rowFade) * (1.0 - dim), 0.12, 0.90))
                    ctx.beginPath()
                    ctx.moveTo(tFL.x, tFL.y)
                    ctx.lineTo(tFR.x, tFR.y)
                    ctx.lineTo(tBR.x, tBR.y)
                    ctx.lineTo(tBL.x, tBL.y)
                    ctx.closePath()
                    ctx.fill()

                    // Step C: Discrete horizontal LED floor-level bars on the front facade (Emerald -> Cyan -> Amber -> Crimson)
                    var maxFloors = 6
                    var activeFloors = Math.max(1, Math.min(maxFloors, Math.round(normH * maxFloors)))
                    for (var fl = 0; fl < activeFloors; fl++) {
                        var uFloor = (fl + 0.5) / maxFloors
                        var fY3 = groundY3 - uFloor * 1.25
                        if (fY3 < topY3 + 0.03) break
                        var fBucket = fl < 2 ? 0 : (fl < 4 ? 1 : (fl < 5 ? 2 : 3))
                        var fL = project3DPoint(xL + halfW * 0.22, fY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                        var fR = project3DPoint(xR - halfW * 0.22, fY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                        ctx.strokeStyle = colourWithAlpha(ledCols12[fBucket], clamp((0.62 + 0.34 * uRow) * rowFade * (1.0 - dim), 0.18, 0.98))
                        ctx.lineWidth = 1.4 + 1.4 * uRow
                        ctx.beginPath()
                        ctx.moveTo(fL.x, fL.y)
                        ctx.lineTo(fR.x, fR.y)
                        ctx.stroke()
                    }

                    // Step D: Crisp neon outer edges on visible faces ONLY (zero hidden back-corner wireframe bleed)
                    ctx.strokeStyle = colourWithAlpha(topLedCol, clamp((0.52 + 0.46 * uRow) * (0.40 + 0.60 * rowFade) * (1.0 - dim), 0.16, 1.0))
                    ctx.lineWidth = 1.05 + 1.20 * uRow
                    ctx.beginPath()
                    ctx.moveTo(bFL.x, bFL.y)
                    ctx.lineTo(bFR.x, bFR.y)
                    ctx.lineTo(tFR.x, tFR.y)
                    ctx.lineTo(tFL.x, tFL.y)
                    ctx.closePath()
                    ctx.moveTo(tFL.x, tFL.y)
                    ctx.lineTo(tFR.x, tFR.y)
                    ctx.lineTo(tBR.x, tBR.y)
                    ctx.lineTo(tBL.x, tBL.y)
                    ctx.closePath()
                    if (xCenter < -0.02) {
                        ctx.moveTo(bFR.x, bFR.y)
                        ctx.lineTo(bBR.x, bBR.y)
                        ctx.lineTo(tBR.x, tBR.y)
                    } else if (xCenter > 0.02) {
                        ctx.moveTo(bFL.x, bFL.y)
                        ctx.lineTo(bBL.x, bBL.y)
                        ctx.lineTo(tBL.x, tBL.y)
                    }
                    ctx.stroke()
                }
            }
        } else if (eqStyle === 13) {
            // Style 13: Aurora Curtains — 3D Undulating Northern Lights Spectral Ribbons
            var curtainCount = 4
            var segCount13 = 40
            for (var c13 = curtainCount - 1; c13 >= 0; c13--) {
                var uC13 = c13 / Math.max(1, curtainCount - 1)
                var baseCol13 = palette[(c13 * 2 + Math.floor((state.hueShift || 0) / 45)) % palette.length]
                var topCol13 = palette[(c13 * 2 + 1 + Math.floor((state.hueShift || 0) / 45)) % palette.length]
                var baseY13 = horizonY - uC13 * minDim * 0.08
                ctx.fillStyle = colourWithAlpha(baseCol13, (0.14 + (1.0 - uC13) * 0.14) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(topCol13, (0.68 + state.highSmooth * 0.28) * (1.0 - dim))
                ctx.lineWidth = 1.8 + (1.0 - uC13) * 1.2
                ctx.beginPath()
                var botPts13 = []
                var topPts13 = []
                for (var s13 = 0; s13 <= segCount13; s13++) {
                    var uS13 = s13 / segCount13
                    var bIdx13 = mapEqBandIndex(s13, segCount13 + 1, eqLayout)
                    var v13 = sampleEqBandValue(state, bIdx13, eqDamping, eqGain)
                    var waveX13 = uS13 * w + Math.sin(uS13 * 6.0 + eqSpinT * 1.4 + c13 * 1.2) * w * 0.025
                    var waveY13 = baseY13 - Math.sin(uS13 * Math.PI * 3.0 - eqSpinT * 1.1 + c13) * minDim * 0.05
                    var curtainH13 = (0.08 + v13 * 0.78) * maxEqH * (0.72 + 0.28 * (1.0 - uC13))
                    botPts13.push({ x: waveX13, y: waveY13 })
                    topPts13.push({ x: waveX13 + Math.cos(eqSpinT * 0.9 + uS13 * 5.0) * 10.0, y: waveY13 - curtainH13 })
                }
                ctx.moveTo(botPts13[0].x, botPts13[0].y)
                for (var i13 = 1; i13 <= segCount13; i13++) ctx.lineTo(botPts13[i13].x, botPts13[i13].y)
                for (var j13 = segCount13; j13 >= 0; j13--) ctx.lineTo(topPts13[j13].x, topPts13[j13].y)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 14) {
            // Style 14: DNA Helix Beam — Horizontal Full-Width 3D Double-Helix Spectral Equaliser Bridge
            var rungCount14 = 32
            var beamCY14 = horizonY - minDim * 0.18
            var beamAmp14 = minDim * (0.14 + state.bassSmooth * 0.05)
            var strandA14 = []
            var strandB14 = []
            for (var r14 = 0; r14 < rungCount14; r14++) {
                var u14 = r14 / (rungCount14 - 1)
                var x14 = lerp(w * 0.06, w * 0.94, u14)
                var bIdx14 = mapEqBandIndex(r14, rungCount14, eqLayout)
                var v14 = clamp(sampleEqBandValue(state, bIdx14, eqDamping, eqGain), 0.06, 1.35)
                var ang14 = u14 * Math.PI * 4.0 - eqSpinT * 2.4
                var rad14 = beamAmp14 * (0.45 + v14 * 0.85)
                var yA14 = beamCY14 + Math.sin(ang14) * rad14
                var yB14 = beamCY14 - Math.sin(ang14) * rad14
                strandA14.push({ x: x14, y: yA14 })
                strandB14.push({ x: x14, y: yB14 })
                var rungCol14 = palette[(r14 + Math.floor((state.hueShift || 0) / 30)) % palette.length]
                ctx.strokeStyle = colourWithAlpha(rungCol14, (0.65 + v14 * 0.30) * (1.0 - dim))
                ctx.lineWidth = 2.2 + v14 * 1.8
                ctx.beginPath()
                ctx.moveTo(x14, yA14)
                ctx.lineTo(x14, yB14)
                ctx.stroke()
            }
            for (var st14 = 0; st14 < 2; st14++) {
                var sPts14 = st14 === 0 ? strandA14 : strandB14
                ctx.strokeStyle = colourWithAlpha(st14 === 0 ? "#00f5d4" : "#ff007f", 0.90 * (1.0 - dim))
                ctx.lineWidth = 2.6 + state.bassSmooth * 1.2
                ctx.beginPath()
                for (var k14 = 0; k14 < sPts14.length; k14++) {
                    if (k14 === 0) ctx.moveTo(sPts14[k14].x, sPts14[k14].y)
                    else ctx.lineTo(sPts14[k14].x, sPts14[k14].y)
                }
                ctx.stroke()
            }
        } else {
            // Style 15: Ferrofluid Lake — Magnetic Spiked Liquid-Metal Spectral Pool & Inverted Mirror
            var spikeCount15 = 48
            var colMain15 = palette[(Math.floor((state.hueShift || 0) / 45)) % palette.length]
            var colRim15 = palette[(2 + Math.floor((state.hueShift || 0) / 45)) % palette.length]
            for (var mir15 = 1; mir15 >= 0; mir15--) {
                var sign15 = mir15 === 0 ? -1.0 : 0.48
                ctx.fillStyle = mir15 === 0
                    ? "rgba(8, 12, 22, " + clamp(0.88 * (1.0 - dim * 0.4), 0.50, 0.92).toFixed(3) + ")"
                    : colourWithAlpha(colMain15, 0.20 * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(mir15 === 0 ? colRim15 : colMain15, (mir15 === 0 ? 0.92 : 0.45) * (1.0 - dim))
                ctx.lineWidth = mir15 === 0 ? (2.2 + state.bassSmooth * 1.4) : 1.3
                ctx.beginPath()
                ctx.moveTo(0, horizonY)
                for (var sp15 = 0; sp15 <= spikeCount15; sp15++) {
                    var u15 = sp15 / spikeCount15
                    var bIdx15 = mapEqBandIndex(sp15, spikeCount15 + 1, eqLayout)
                    var v15 = sampleEqBandValue(state, bIdx15, eqDamping, eqGain)
                    var thorn = Math.pow(0.5 + 0.5 * Math.sin(sp15 * Math.PI + eqSpinT * 3.2), 2.2)
                    var h15 = (0.04 + v15 * (0.45 + 0.65 * thorn)) * maxEqH
                    var x15 = u15 * w
                    var y15 = horizonY + sign15 * h15
                    ctx.lineTo(x15, y15)
                }
                ctx.lineTo(w, horizonY)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        }
        ctx.restore()
    }

    // =========================================================================
    // SUB-SYSTEM 3: L1 BEAT SHAPES & 3D ARCADE VECTOR CRAFT
    // (Spawning at the distant vanishing point and moving all the way OFF screen;
    //  skipped when Battlezone `l1Mode === 4` is active since Mode 4 renders its own 3D terrain & airborne craft!)
    // =========================================================================
    if (shapesOn && !(fieldOn && l1Mode === 4) && state.shockwaves.length > 0) {
        var shapeStyle = cfg && cfg.layer1ShapeStyle !== undefined ? ((Number(cfg.layer1ShapeStyle) || 0) % LAYER1_SHAPE_STYLES.length) : 0
        var shapeSpin = cfg && cfg.layer1ShapeSpin !== undefined ? clamp(Number(cfg.layer1ShapeSpin), -2.5, 2.5) : 0.25
        var shapeScale = cfg && cfg.layer1ShapeScale !== undefined ? clamp(Number(cfg.layer1ShapeScale), 0.3, 2.5) : 1.0
        var shapeDensityDraw = cfg && cfg.layer1ShapeDensity !== undefined ? clamp(Number(cfg.layer1ShapeDensity), 0.25, 2.5) : 1.0
        var drawTargetCount = shapeDensityDraw <= 1.5
            ? Math.round(1.0 + Math.pow((shapeDensityDraw - 0.25) / 1.25, 1.15) * 4.0)
            : Math.round(5.0 + Math.pow(shapeDensityDraw - 1.5, 0.78) * 3.0)
        var maxDrawShapes = Math.max(1, Math.min(state.shockwaves.length, Math.min(8, drawTargetCount)))

        ctx.save()
        ctx.globalCompositeOperation = "source-over"
        for (var sw = 0; sw < maxDrawShapes; sw++) {
            var wave = state.shockwaves[sw]
            var uProg = clamp(wave.r / 1.60, 0.0, 1.15)
            var wSizeMul = wave.sizeMul !== undefined ? wave.sizeMul : (0.52 + ((sw * 29) % 7) * 0.06)
            // Perspective size grows from a tiny pinpoint at the distant horizon/vanishing point and expands only as it nears the viewer
            var wr = Math.pow(uProg, 1.95) * diagR * 0.56 * shapeScale * wSizeMul
            var wLaneX = wave.laneX !== undefined ? wave.laneX : (((sw % 3) - 1) * 0.32)
            var wLaneY = wave.laneY !== undefined ? wave.laneY : ((sw % 2 === 0 ? -1 : 1) * 0.22)
            var laneOffset = wLaneX * w * Math.pow(uProg, 1.20)
            var wcx = lerp(vanishX, cx + laneOffset, Math.min(1.0, uProg * 1.15))
            var isGroundUnit = (shapeStyle === 0 || (shapeStyle === 2 && (sw & 1) === 1))
            var wcy = isGroundUnit
                ? lerp(horizonY, h * 0.96, Math.pow(uProg, 1.45))
                : ((fieldOn && l1Mode === 4)
                    ? lerp(horizonY - h * 0.06, h * (0.26 + wLaneY * 0.45) + Math.sin(l1T * 1.5 + sw) * h * 0.06, Math.min(1.0, uProg * 1.1))
                    : lerp(cy + endPt.dy * 0.35, cy + wLaneY * h * uProg, uProg))
            var spinAngle = l1T * shapeSpin * 0.85 + (shapeSpin !== 0 ? sw * 0.25 : 0.0)
            var distFadeIn = smoothstep(0.0, 0.10, uProg)
            var nearFadeOut = 1.0 - smoothstep(0.88, 1.12, uProg)
            var sAlpha = clamp(wave.alpha * (1.0 - dim) * distFadeIn * nearFadeOut, 0.04, 0.95)

            ctx.fillStyle = hslToHex((wave.hueOffset + 35) % 360, 0.92, 0.55, sAlpha * 0.12)
            ctx.strokeStyle = hslToHex(wave.hueOffset, 0.95, 0.62, sAlpha * 0.85)
            ctx.lineWidth = (1.3 + state.bass * 1.5) * Math.sqrt(shapeScale * wSizeMul) * (0.45 + 0.55 * Math.min(1.0, uProg))
            ctx.beginPath()

            // True 3-axis 3D rotation angles (rx, ry, rz) with per-shape randomised spinX, spinY, spinZ
            var spinRate = (shapeSpin !== 0.0) ? shapeSpin : 0.45
            var spX = wave.spinX !== undefined ? wave.spinX : 0.85
            var spY = wave.spinY !== undefined ? wave.spinY : 1.00
            var spZ = wave.spinZ !== undefined ? wave.spinZ : 0.65
            var ry3 = l1T * spinRate * spY * 0.95 + sw * 1.15
            var rx3 = Math.sin(l1T * 0.75 + sw * 1.65) * 0.38 + l1T * spinRate * spX * 0.52
            var rz3 = Math.cos(l1T * 0.62 + sw * 1.35) * 0.30 + spinAngle * spZ * 0.45
            var craftVar = (wave.variant !== undefined ? wave.variant : sw) % 3

            if (shapeStyle === 1) {
                // 1: 1983 Atari Color-QuadraScan XY Vector Star Wars Craft (Standard TIE, Vader TIE Advanced x1, Rebel X-Wing)
                var cs = Math.max(2.5, wr * 0.38)
                var swPitch = Math.sin(l1T * 1.15 + sw * 1.9) * 0.34 + rx3 * 0.25
                var swYaw = Math.cos(l1T * 0.95 + sw * 1.5) * 0.48 + ry3 * 0.35
                var swRoll = Math.sin(l1T * 1.4 + sw * 2.1) * 0.32 + rz3 * 0.35
                drawMultiColourStarWarsFighter(
                    ctx, craftVar, wcx, wcy, cs,
                    swPitch, swYaw, swRoll,
                    (1.3 + state.bass * 1.2) * Math.sqrt(shapeScale * wSizeMul) * (0.45 + 0.55 * Math.min(1.0, uProg)),
                    sAlpha * 0.90, null
                )
            } else if (shapeStyle === 0) {
                // 0: 3D Battlezone Tanks (1980 Atari Battlezone 3D Wireframe Vector Tank rotating in 3D!)
                var ts = Math.max(2.5, wr * 0.36)
                var tankPitch = 0.22 + Math.sin(l1T * 0.85 + sw * 1.4) * 0.14
                var tankYaw = Math.sin(l1T * 0.9 + sw * 1.7) * 0.52 + spinAngle * spY * 0.45
                var tankRoll = Math.cos(l1T * 0.7 + sw * 1.1) * 0.12
                var turYaw = Math.sin(l1T * 1.45 + sw * 2.1) * 0.65
                var gunEl = 0.08 + state.beatPulse * 0.14
                var radSp = l1T * 4.5 + sw * 1.3
                append3DWireframeTank(ctx, wcx, wcy, ts, tankPitch, tankYaw, tankRoll, turYaw, gunEl, radSp)
                ctx.fill()
                ctx.stroke()
            } else if (shapeStyle === 2) {
                // 2: 3D TRON Recognizers (1982 TRON 3D Wireframe Arch Craft rotating in 3D!)
                var rs = Math.max(3.0, wr * 0.40)
                var rHover = Math.sin(l1T * 2.4 + sw) * rs * 0.08
                var rcy = wcy + rHover
                var recPitch = 0.14 + Math.sin(l1T * 0.8 + sw) * 0.16
                var recYaw = Math.sin(l1T * 0.95 + sw * 1.5) * 0.55 + spinAngle * 0.45
                var recRoll = Math.cos(l1T * 0.75 + sw * 1.2) * 0.12

                function recBox(x0, y0, z0, x1, y1, z1) {
                    var bv = [
                        [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1],
                        [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]
                    ]
                    var bp = []
                    for (var bi = 0; bi < 8; bi++) {
                        bp.push(project3DPoint(bv[bi][0], bv[bi][1], bv[bi][2], recPitch, recYaw, recRoll, wcx, rcy, rs, 3.8))
                    }
                    var bEdges = [
                        0, 1,  1, 2,  2, 3,  3, 0,
                        4, 5,  5, 6,  6, 7,  7, 4,
                        0, 4,  1, 5,  2, 6,  3, 7
                    ]
                    for (var be = 0; be < bEdges.length; be += 2) {
                        ctx.moveTo(bp[bEdges[be]].x, bp[bEdges[be]].y)
                        ctx.lineTo(bp[bEdges[be + 1]].x, bp[bEdges[be + 1]].y)
                    }
                }
                // Floating upper command eye block + main horizontal bridge + left/right legs + foot pads
                recBox(-0.48, -0.88, -0.22,  0.48, -0.72, 0.22)
                recBox(-0.82, -0.62, -0.28,  0.82, -0.34, 0.28)
                recBox(-0.80, -0.34, -0.24, -0.44,  0.54, 0.24)
                recBox( 0.44, -0.34, -0.24,  0.80,  0.54, 0.24)
                recBox(-0.96,  0.54, -0.32, -0.38,  0.72, 0.32)
                recBox( 0.38,  0.54, -0.32,  0.96,  0.72, 0.32)
                ctx.fill()
                ctx.stroke()
            } else if (shapeStyle === 3) {
                // 3: 3D Sacred Polyhedra (Dual-Ring 3D Prism / Antiprism rotating in 3-axis 3D!)
                var sides = wave.sides || 6
                var topPts = []
                var botPts = []
                for (var v = 0; v < sides; v++) {
                    var ang0 = (v / sides) * Math.PI * 2
                    var px3 = Math.cos(ang0)
                    var py3 = Math.sin(ang0)
                    topPts.push(project3DPoint(px3, py3,  0.32, rx3, ry3, rz3, wcx, wcy, wr * 0.85, 3.6))
                    botPts.push(project3DPoint(px3, py3, -0.32, rx3, ry3, rz3, wcx, wcy, wr * 0.85, 3.6))
                }
                for (var v1 = 0; v1 <= sides; v1++) {
                    var pT = topPts[v1 % sides]
                    if (v1 === 0) ctx.moveTo(pT.x, pT.y)
                    else ctx.lineTo(pT.x, pT.y)
                }
                for (var v2 = 0; v2 <= sides; v2++) {
                    var pB = botPts[v2 % sides]
                    if (v2 === 0) ctx.moveTo(pB.x, pB.y)
                    else ctx.lineTo(pB.x, pB.y)
                }
                for (var v3 = 0; v3 < sides; v3++) {
                    ctx.moveTo(topPts[v3].x, topPts[v3].y)
                    ctx.lineTo(botPts[v3].x, botPts[v3].y)
                }
                ctx.fill()
                ctx.stroke()
            } else if (shapeStyle === 4) {
                // 4: 3D Merkaba Starbursts (3D Star Tetrahedron / Dual-Apex 3D Star rotating in 3-axis 3D!)
                var pts2 = (wave.sides || 6) * 2
                var starRing = []
                for (var sv = 0; sv < pts2; sv++) {
                    var ang2 = (sv / pts2) * Math.PI * 2
                    var r2 = (sv % 2 === 0) ? 1.0 : 0.48
                    var sz = (sv % 2 === 0) ? ((sv % 4 === 0) ? 0.28 : -0.28) : 0.0
                    var sPt = project3DPoint(Math.cos(ang2) * r2, Math.sin(ang2) * r2, sz, rx3, ry3, rz3, wcx, wcy, wr * 0.90, 3.6)
                    starRing.push(sPt)
                    if (sv === 0) ctx.moveTo(sPt.x, sPt.y)
                    else ctx.lineTo(sPt.x, sPt.y)
                }
                ctx.closePath()
                var apexFront = project3DPoint(0, 0,  0.65, rx3, ry3, rz3, wcx, wcy, wr * 0.90, 3.6)
                var apexBack  = project3DPoint(0, 0, -0.65, rx3, ry3, rz3, wcx, wcy, wr * 0.90, 3.6)
                for (var sv2 = 0; sv2 < pts2; sv2 += 2) {
                    ctx.moveTo(starRing[sv2].x, starRing[sv2].y)
                    ctx.lineTo(apexFront.x, apexFront.y)
                    ctx.moveTo(starRing[sv2].x, starRing[sv2].y)
                    ctx.lineTo(apexBack.x, apexBack.y)
                }
                ctx.fill()
                ctx.stroke()
            } else {
                // 5: 3D Sonic Boom Rings (3D Gyroscopic Harmonic Wave Rings tilting in 3-axis 3D!)
                var ringSegs = 28
                for (var rs2 = 0; rs2 <= ringSegs; rs2++) {
                    var ang1 = (rs2 / ringSegs) * Math.PI * 2
                    var mod1 = 1.0 + Math.sin(ang1 * 4.0) * state.bass * 0.08
                    var rzWave = Math.sin(ang1 * 3.0 + l1T * 2.5) * 0.18 * (0.4 + state.bass)
                    var rp1 = project3DPoint(Math.cos(ang1) * mod1, Math.sin(ang1) * mod1, rzWave, rx3 * 0.65, ry3 * 0.65, rz3, wcx, wcy, wr * 0.92, 3.6)
                    if (rs2 === 0) ctx.moveTo(rp1.x, rp1.y)
                    else ctx.lineTo(rp1.x, rp1.y)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        }
        ctx.restore()
    }
}

// ---------------------------------------------------------------------------
// Universal 3D Graded History Tracer Helpers (Shared by L1, L2, and L3)
// ---------------------------------------------------------------------------

function computeTracerEndpoint(w, h, t, drift, speed) {
    var d = clamp(Number(drift !== undefined ? drift : 1.0), 0.0, 2.5)
    var wt = t * 0.32
    var dx = (Math.sin(wt) * 0.22 + Math.cos(wt * 0.63 + 1.3) * 0.12) * w * d
    var dy = (Math.cos(wt * 0.79) * 0.20 + Math.sin(wt * 0.51 + 2.1) * 0.11) * h * d
    return { dx: dx, dy: dy }
}

function rotatePaletteForEcho(palette, echoIdx) {
    if (!palette || palette.length === 0 || echoIdx <= 0) return palette
    var out = []
    var len = palette.length
    for (var i = 0; i < len; i++) {
        out.push(palette[(i + echoIdx) % len])
    }
    return out
}

// ---------------------------------------------------------------------------
// LAYER #2 — 12 Psychedelic & Classic Nightclub Visualiser Modes (Batched)
// ---------------------------------------------------------------------------

// Mode 0: MilkDrop / Geiss 3D Cathedral Warp Mesh & Stained-Glass Rose Window Vaults
function drawMode0MilkDrop(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var diagR = Math.sqrt(w * w + h * h) * 0.72 * (cfg.layer2Zoom || 1.0)
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var facets = clamp(Math.round(Number(cfg.layer2Facets) || 6), 4, 12)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var trCount = clamp(Math.round(Number(cfg.tracerCount) || 6), 1, 16)
    var numVaults = isEcho ? 3 : Math.max(5, Math.min(11, Math.round(4 + trCount * 0.45 * comp)))
    var ptsPerFacet = isEcho ? 6 : Math.max(8, Math.floor(11 * clamp(comp, 0.5, 1.35)))
    var hist = state.waveHistory || []
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    var prevVaultRing = null
    var prevVaultFade = 0.0
    var vaultTravel = tunT * 0.42
    var vaultZFract = ((vaultTravel % 1.0) + 1.0) % 1.0
    var vaultZBase = Math.floor(vaultTravel)
    // 1. 3D Vaulted Cathedral Dome expanding from diminishing endpoint (zProg -> 0) out past all 4 screen borders (zProg -> 1)
    for (var v = 0; v < numVaults; v++) {
        var zProg = clamp((v + vaultZFract) / numVaults, 0.0, 1.15) // 0 = deep apex, 1 = past screen borders
        var worldVault = vaultZBase - v
        var birthFade0 = smoothstep(0.0, 0.20, zProg)
        var persp = Math.pow(zProg, 1.78) * 1.38
        var spineX = endPt.dx * 0.65 * Math.pow(1.0 - Math.min(1.0, zProg), 1.35)
        var spineY = endPt.dy * 0.65 * Math.pow(1.0 - Math.min(1.0, zProg), 1.35)
        var curRing = []

        for (var f = 0; f < facets; f++) {
            var baseAng = (f * Math.PI * 2) / facets + state.phase * 0.30 + worldVault * 0.22
            var flip = (f % 2 === 0) ? 1.0 : -1.0
            for (var i = 0; i < ptsPerFacet; i++) {
                var u = i / ptsPerFacet
                var bIdx = (i * 2 + (worldVault & 15) * 5) & 63
                var bv = state.smoothBands[bIdx] || 0.1
                var arch = Math.sin(u * Math.PI) * (0.28 + bv * 0.28 + state.bass * 0.14)
                var r = diagR * persp * (0.28 + arch)
                var theta = baseAng + flip * ((u - 0.5) * (Math.PI * 2 / facets) + Math.sin(u * 4.0 + state.t * 1.4 + worldVault * 0.45) * (0.12 + state.mid * 0.16))
                curRing.push({
                    x: spineX + Math.cos(theta) * r,
                    y: spineY + Math.sin(theta) * r
                })
            }
        }

        var vColIdx0 = ((worldVault * 2 + palShift) % palette.length + palette.length) % palette.length
        var vColIdx1 = ((worldVault * 2 + 1 + palShift) % palette.length + palette.length) % palette.length
        var vaultCol = palette[vColIdx0]
        var ribCol = palette[vColIdx1]
        var totalPts = curRing.length

        if (prevVaultRing && (!isEcho || (state.echoIndex || 0) < 2)) {
            var wallFade0 = Math.min(prevVaultFade, birthFade0)
            if (wallFade0 > 0.01) {
                ctx.fillStyle = colourWithAlpha(vaultCol, (0.06 + (1.0 - zProg * 0.5) * 0.10 + state.bass * 0.06) * wallFade0 * (isEcho ? 0.5 : 1.0))
                ctx.beginPath()
                for (var q = 0; q < totalPts; q += 2) {
                    var qNext = (q + 1) % totalPts
                    ctx.moveTo(prevVaultRing[q].x, prevVaultRing[q].y)
                    ctx.lineTo(prevVaultRing[qNext].x, prevVaultRing[qNext].y)
                    ctx.lineTo(curRing[qNext].x, curRing[qNext].y)
                    ctx.lineTo(curRing[q].x, curRing[q].y)
                    ctx.closePath()
                }
                ctx.fill()

                ctx.strokeStyle = colourWithAlpha(vaultCol, (0.24 + zProg * 0.38) * wallFade0)
                ctx.lineWidth = (0.8 + zProg * 1.6) * wallFade0
                ctx.beginPath()
                for (var qr = 0; qr < totalPts; qr += Math.max(2, Math.floor(ptsPerFacet / 2))) {
                    ctx.moveTo(prevVaultRing[qr].x, prevVaultRing[qr].y)
                    ctx.lineTo(curRing[qr].x, curRing[qr].y)
                }
                ctx.stroke()
            }
        }

        if (birthFade0 > 0.01) {
            ctx.strokeStyle = colourWithAlpha(ribCol, (0.42 + Math.sin(Math.min(1.0, zProg) * Math.PI) * 0.52) * birthFade0)
            ctx.lineWidth = clamp(1.2 + zProg * 2.8 + state.beatPulse * 0.8, 0.8, 4.5) * birthFade0 * (isEcho ? 0.75 : 1.0)
            ctx.beginPath()
            for (var p = 0; p <= totalPts; p++) {
                var pt = curRing[p % totalPts]
                if (p === 0) ctx.moveTo(pt.x, pt.y)
                else ctx.lineTo(pt.x, pt.y)
            }
            ctx.stroke()
        }

        prevVaultRing = curRing
        prevVaultFade = birthFade0
    }

    // 2. Central Dual-Channel Geiss Custom Waveform Ribbon at the diminishing endpoint
    if (!isEcho || (state.echoIndex || 0) < 2) {
        var wavePts = isEcho ? 20 : 36
        var coreR = minDim * (0.12 + state.bass * 0.08)
        var ch0Bands = (hist.length > 0 && hist[0] && hist[0].bands) ? hist[0].bands : state.smoothBands
        var ch1Bands = (hist.length > 2 && hist[2] && hist[2].bands) ? hist[2].bands : state.smoothBands
        var outerWave = []
        var innerWave = []
        for (var wIdx = 0; wIdx <= wavePts; wIdx++) {
            var wa = (wIdx / wavePts) * Math.PI * 2 + state.phase * 0.65
            var wb0 = ch0Bands[wIdx & 31] !== undefined ? ch0Bands[wIdx & 31] : (state.smoothBands[(wIdx * 2) & 63] || 0.1)
            var wb1 = ch1Bands[(wIdx + 8) & 31] !== undefined ? ch1Bands[(wIdx + 8) & 31] : (state.smoothBands[(wIdx * 2 + 1) & 63] || 0.1)
            var rOuter = coreR * (0.88 + wb0 * 0.52 + Math.sin(wa * facets - state.t * 2.2) * 0.18)
            var rInner = coreR * (0.48 + wb1 * 0.32 - Math.cos(wa * facets + state.t * 1.8) * 0.12)
            outerWave.push({ x: endPt.dx * 0.65 + Math.cos(wa) * rOuter, y: endPt.dy * 0.65 + Math.sin(wa) * rOuter })
            innerWave.push({ x: endPt.dx * 0.65 + Math.cos(wa) * rInner, y: endPt.dy * 0.65 + Math.sin(wa) * rInner })
        }
        ctx.fillStyle = colourWithAlpha(palette[2 % palette.length], 0.18 + state.bass * 0.14)
        ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], 0.90)
        ctx.lineWidth = clamp(2.2 + state.beatPulse * 1.4, 2.0, 4.2)
        ctx.beginPath()
        for (var w0 = 0; w0 <= wavePts; w0++) {
            if (w0 === 0) ctx.moveTo(outerWave[w0].x, outerWave[w0].y)
            else ctx.lineTo(outerWave[w0].x, outerWave[w0].y)
        }
        for (var w1 = wavePts; w1 >= 0; w1--) {
            ctx.lineTo(innerWave[w1].x, innerWave[w1].y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    ctx.restore()
}

// Mode 1: Winamp AVS 3D SuperScope (Clean 3D Parametric Oscilloscope Wave Ribbon & Stereo Lissajous Core)
function drawMode1AvsSuperScope(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)
    var trEnabled = cfg.layer2TracersEnabled !== undefined ? Boolean(cfg.layer2TracersEnabled) : true
    var trCount = trEnabled ? clamp(Math.round(Number(cfg.tracerCount) || 6), 1, 12) : 1
    var ringPasses = Math.max(1, Math.min(5, Math.ceil(trCount * 0.4)))
    var N = Math.max(36, Math.min(72, Math.floor(48 * comp)))
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)

    var rotX = Math.sin(state.t * 0.38) * 0.42 + state.bassSmooth * 0.18
    var rotY = state.t * 0.44
    var cosX = Math.cos(rotX), sinX = Math.sin(rotX)
    var cosY = Math.cos(rotY), sinY = Math.sin(rotY)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    // 1. Clean 3D Parametric AVS Oscilloscope Wave Rings (smooth 1:1 circular / 1:2 saddle wave — zero tangled knot noise!)
    for (var pass = ringPasses - 1; pass >= 0; pass--) {
        var uPass = ringPasses > 1 ? (pass / (ringPasses - 1)) : 0.0
        var passLag = pass * 0.14
        var tPass = state.t - passLag
        var depthScale = minDim * (0.36 - uPass * 0.14 + state.bassSmooth * 0.05)
        var offX = endPt.dx * 0.35 * uPass
        var offY = endPt.dy * 0.35 * uPass
        var alpha = pass === 0 ? 0.92 : (0.48 * (1.0 - uPass * 0.68))

        var ptsTop = []
        var ptsBot = []
        var ribHalfH = (4.5 + state.bassSmooth * 9.0) * (1.0 - uPass * 0.45)

        for (var i = 0; i <= N; i++) {
            var u = (i / N) * Math.PI * 2
            var bVal = state.smoothBands[(i + pass * 5) & 63] || 0.08
            // Smooth AVS oscilloscope displacement along 3D ring
            var waveY = (bVal - 0.18) * 0.55 * Math.sin(u * 3.0 + tPass * 2.4)
                      + Math.cos(u * 2.0 - tPass * 1.6) * (0.12 + state.midSmooth * 0.18)
            var rMod = 1.0 + (bVal * 0.24) * Math.cos(u * 4.0 - tPass * 1.8)
            var x3 = Math.cos(u) * rMod
            var z3 = Math.sin(u) * rMod
            var y3 = waveY

            var x1 = x3 * cosY - z3 * sinY
            var z1 = x3 * sinY + z3 * cosY
            var y2 = y3 * cosX - z1 * sinX
            var z2 = y3 * sinX + z1 * cosX

            var persp = 1.75 / (2.35 - clamp(z2, -1.15, 1.15))
            var sx = offX + x1 * depthScale * persp
            var sy = offY + y2 * depthScale * persp
            var hw = ribHalfH * persp
            ptsTop.push({ x: sx, y: sy - hw, p: persp, b: bVal })
            ptsBot.push({ x: sx, y: sy + hw })
        }

        var colFill = palette[(pass * 2 + palShift) % palette.length]
        var colLine = palette[(pass * 2 + 1 + palShift) % palette.length]

        if (pass < 2) {
            ctx.fillStyle = colourWithAlpha(colFill, (0.14 + state.bassSmooth * 0.10) * alpha)
            ctx.beginPath()
            for (var f0 = 0; f0 <= N; f0++) {
                if (f0 === 0) ctx.moveTo(ptsTop[f0].x, ptsTop[f0].y)
                else ctx.lineTo(ptsTop[f0].x, ptsTop[f0].y)
            }
            for (var f1 = N; f1 >= 0; f1--) {
                ctx.lineTo(ptsBot[f1].x, ptsBot[f1].y)
            }
            ctx.closePath()
            ctx.fill()
        }

        ctx.strokeStyle = colourWithAlpha(colLine, alpha)
        ctx.lineWidth = (pass === 0 ? 2.4 : 1.5) + state.beatPulse * 0.9
        ctx.beginPath()
        for (var s0 = 0; s0 <= N; s0++) {
            if (s0 === 0) ctx.moveTo(ptsTop[s0].x, ptsTop[s0].y)
            else ctx.lineTo(ptsTop[s0].x, ptsTop[s0].y)
        }
        ctx.stroke()
    }

    // 2. Central Stereo Lissajous Phase-Scope (clean 1:2 / 2:3 figure-8 harmonic loop at core)
    var lissSteps = 48
    var lissR = minDim * (0.16 + state.bassSmooth * 0.06)
    ctx.strokeStyle = colourWithAlpha(palette[(3 + palShift) % palette.length], 0.86)
    ctx.lineWidth = 2.0 + state.highSmooth * 1.2
    ctx.beginPath()
    for (var li = 0; li <= lissSteps; li++) {
        var lu = (li / lissSteps) * Math.PI * 2
        var lb = state.smoothBands[(li * 2) & 63] || 0.08
        var lx = Math.sin(lu + state.t * 1.1) * lissR * (0.85 + lb * 0.30)
        var ly = Math.sin(lu * 2.0 - state.t * 0.85) * lissR * (0.55 + state.midSmooth * 0.28)
        if (li === 0) ctx.moveTo(lx, ly)
        else ctx.lineTo(lx, ly)
    }
    ctx.closePath()
    ctx.stroke()

    ctx.restore()
}

// Mode 2: SoundSpectrum G-Force 3D Logarithmic Vortex Funnel & Plasma Ribbons
// Rings expand all the way past diagR so every wave ring moves towards the user and exits OFF the screen!
function drawMode2GForceWaveShape(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var diagR = Math.sqrt(w * w + h * h) * 0.76 * (cfg.layer2Zoom || 1.0)
    var petals = clamp(Math.round(Number(cfg.layer2Facets) || 6), 4, 12)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var trCount = clamp(Math.round(Number(cfg.tracerCount) || 6), 1, 16)
    var numRings = isEcho ? 3 : Math.max(5, Math.min(11, Math.round(4 + trCount * 0.45 * comp)))
    var steps = isEcho ? 28 : Math.max(36, Math.floor(54 * clamp(comp, 0.5, 1.3)))
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    var prevFunnelPts = null
    var prevFunnelFade = 0.0
    var gfTravel = tunT * 0.40
    var gfZFract = ((gfTravel % 1.0) + 1.0) % 1.0
    var gfZBase = Math.floor(gfTravel)
    // Render 3D logarithmic vortex funnel from deep core (zProg -> 0) out past all 4 screen borders (zProg -> 1)
    for (var layer = 0; layer < numRings; layer++) {
        var zProg = clamp((layer + gfZFract) / numRings, 0.0, 1.15)
        var worldRing = gfZBase - layer
        var birthFade2 = smoothstep(0.0, 0.20, zProg)
        var persp = Math.pow(zProg, 1.78) * 1.28
        // Continuous spiral twist along worldRing — never flip sign by (layer % 2)!
        var spiralTwist = (1.0 - Math.min(1.0, zProg)) * (1.0 + state.high * 0.85) + state.phase * 0.45 + worldRing * 0.28
        var ringX = endPt.dx * 0.65 * Math.pow(1.0 - Math.min(1.0, zProg), 1.3)
        var ringY = endPt.dy * 0.65 * Math.pow(1.0 - Math.min(1.0, zProg), 1.3)

        var curPts = []
        for (var i = 0; i <= steps; i++) {
            var a = (i / steps) * Math.PI * 2
            var bIdx = (i + (worldRing & 15) * 7) & 63
            var bv = state.smoothBands[bIdx] || 0.1
            var wave = Math.sin(a * petals + state.t * 1.8 - worldRing * 0.38) * (0.16 + state.mid * 0.20)
                     + Math.cos(a * (petals * 2 - 1) - state.t * 1.4 + worldRing * 0.22) * (0.10 + bv * 0.28)
            var r = diagR * persp * (0.76 + wave + state.bass * 0.14)
            var spiralA = a + spiralTwist
            curPts.push({
                x: ringX + Math.cos(spiralA) * r,
                y: ringY + Math.sin(spiralA) * r
            })
        }

        var cIdx0 = ((worldRing * 2 + palShift) % palette.length + palette.length) % palette.length
        var cIdx1 = ((worldRing * 2 + 1 + palShift) % palette.length + palette.length) % palette.length
        var curtainCol = palette[cIdx0]
        var crestCol = palette[cIdx1]

        if (prevFunnelPts && (!isEcho || (state.echoIndex || 0) < 3)) {
            var wallFade2 = Math.min(prevFunnelFade, birthFade2)
            if (wallFade2 > 0.01) {
                ctx.fillStyle = colourWithAlpha(curtainCol, (0.06 + zProg * 0.10 + state.bass * 0.06) * wallFade2 * (isEcho ? 0.5 : 1.0))
                ctx.beginPath()
                for (var k = 0; k <= steps; k++) {
                    if (k === 0) ctx.moveTo(curPts[k].x, curPts[k].y)
                    else ctx.lineTo(curPts[k].x, curPts[k].y)
                }
                for (var kBack = steps; kBack >= 0; kBack--) {
                    ctx.lineTo(prevFunnelPts[kBack].x, prevFunnelPts[kBack].y)
                }
                ctx.closePath()
                ctx.fill()

                ctx.strokeStyle = colourWithAlpha(curtainCol, (0.22 + zProg * 0.36) * wallFade2)
                ctx.lineWidth = (0.8 + zProg * 1.5) * wallFade2
                ctx.beginPath()
                for (var vr = 0; vr < steps; vr += 3) {
                    ctx.moveTo(prevFunnelPts[vr].x, prevFunnelPts[vr].y)
                    ctx.lineTo(curPts[vr].x, curPts[vr].y)
                }
                ctx.stroke()
            }
        }

        if (birthFade2 > 0.01) {
            ctx.strokeStyle = colourWithAlpha(crestCol, (0.42 + Math.sin(Math.min(1.0, zProg) * Math.PI) * 0.52) * birthFade2)
            ctx.lineWidth = (1.1 + zProg * 2.7 + state.bass * 1.2) * birthFade2 * (isEcho ? 0.75 : 1.0)
            ctx.beginPath()
            for (var p = 0; p <= steps; p++) {
                if (p === 0) ctx.moveTo(curPts[p].x, curPts[p].y)
                else ctx.lineTo(curPts[p].x, curPts[p].y)
            }
            ctx.closePath()
            ctx.stroke()
        }

        prevFunnelPts = curPts
        prevFunnelFade = birthFade2
    }
    ctx.restore()
}

// Mode 3: Cthugha 3D Volumetric Plasma & Flame Oscilloscope Tunnel
function drawMode3CthughaRave(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var diagR = Math.sqrt(w * w + h * h) * 0.72 * (cfg.layer2Zoom || 1.0)
    var maxR = Math.min(w, h) * 0.46 * (cfg.layer2Zoom || 1.0)
    var isEcho = Boolean(state.isTracerEcho)
    var trCount = clamp(Math.round(Number(cfg.tracerCount) || 6), 1, 16)
    var numSlices = isEcho ? 3 : Math.max(5, Math.min(10, Math.round(4 + trCount * 0.4)))
    var ringSteps = isEcho ? 28 : 48
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    var cthTravel = tunT * 0.38
    var cthZFract = ((cthTravel % 1.0) + 1.0) % 1.0
    var cthZBase = Math.floor(cthTravel)

    // 1. Volumetric Flame & Plasma Shroud Waves expanding past all 4 screen borders
    for (var s = numSlices - 1; s >= 0; s--) {
        var zProg = clamp((s + cthZFract) / numSlices, 0.0, 1.15)
        var worldSlice = cthZBase - s
        var birthFade3 = smoothstep(0.0, 0.20, zProg)
        if (birthFade3 < 0.01) continue
        var persp = Math.pow(zProg, 1.68) * 1.26
        var baseR = diagR * persp * (0.78 + state.bass * 0.18)
        var rot = state.phase * 0.42 + worldSlice * 0.28
        var colFill = palette[((worldSlice * 2 + palShift) % palette.length + palette.length) % palette.length]
        var colStroke = palette[((worldSlice * 2 + 3 + palShift) % palette.length + palette.length) % palette.length]
        var ringX = endPt.dx * 0.60 * Math.pow(1.0 - Math.min(1.0, zProg), 1.25)
        var ringY = endPt.dy * 0.60 * Math.pow(1.0 - Math.min(1.0, zProg), 1.25)

        ctx.fillStyle = colourWithAlpha(colFill, (0.14 + (1.0 - Math.min(1.0, zProg)) * 0.14 + state.bass * 0.06) * birthFade3 * (isEcho ? 0.52 : 1.0))
        ctx.strokeStyle = colourWithAlpha(colStroke, (0.45 + Math.sin(Math.min(1.0, zProg) * Math.PI) * 0.50) * birthFade3)
        ctx.lineWidth = (1.0 + zProg * 2.6 + state.bass * 1.2) * birthFade3 * (isEcho ? 0.75 : 1.0)

        ctx.beginPath()
        for (var i = 0; i <= ringSteps; i++) {
            var u = i / ringSteps
            var a = u * Math.PI * 2 + rot
            var bIdx = (i + (worldSlice & 15) * 3) & 63
            var wVal = state.smoothBands[bIdx] || 0.05
            var flame = Math.sin(u * Math.PI * 10 + state.t * 3.2 - worldSlice * 0.65) * (0.10 + state.mid * 0.18)
            var excursion = (wVal - 0.14 + flame) * diagR * persp * (0.28 + state.energy * 0.24)
            var r = Math.max(0.0, baseR + excursion)
            var px = ringX + Math.cos(a) * r
            var py = ringY + Math.sin(a) * r - Math.abs(excursion) * 0.18
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    // 2. Dual-Channel Stereo Flame Ribbon Oscilloscope across the horizon core
    if (!isEcho || (state.echoIndex || 0) < 3) {
        var hSteps = isEcho ? 24 : 48
        var spanW = w * 0.44 * (cfg.layer2Zoom || 1.0)
        ctx.fillStyle = colourWithAlpha(palette[1 % palette.length], 0.22 + state.bass * 0.14)
        ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], 0.90)
        ctx.lineWidth = 2.4 + state.beatPulse * 1.5
        ctx.beginPath()
        for (var k = 0; k <= hSteps; k++) {
            var kx = ((k / hSteps) * 2.0 - 1.0) * spanW
            var kb = state.smoothBands[(k * 2) & 63]
            var ky = (kb - 0.25) * Math.sin(k * 0.55 + state.t * 4.2) * maxR * (0.42 + state.bass * 0.35)
            if (k === 0) ctx.moveTo(kx, ky)
            else ctx.lineTo(kx, ky)
        }
        for (var k2 = hSteps; k2 >= 0; k2--) {
            var kx2 = ((k2 / hSteps) * 2.0 - 1.0) * spanW
            var kb2 = state.smoothBands[(k2 * 2 + 1) & 63]
            var ky2 = -(kb2 * 0.55 + 0.08) * maxR * 0.28
            ctx.lineTo(kx2, ky2)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    ctx.restore()
}

// Helper for Mode 4: Evaluate C64 / Llamasoft VLM shape profile for an integer or continuous family index
function _evalSingleMinterProfile(kindInt, a, baseFolds) {
    var k = ((kindInt % 5) + 5) % 5
    if (k === 0) {
        // Tempest 2000 Star-Web profile
        return 0.78 + 0.32 * Math.abs(Math.cos(baseFolds * a * 0.5))
    } else if (k === 1) {
        // C64 Psychedelia Diamond / Rhombus profile
        return 0.72 / (Math.abs(Math.cos(a)) * 0.65 + Math.abs(Math.sin(a)) * 0.65 + 0.35)
    } else if (k === 2) {
        // Llamasoft Clover / Flower profile
        return 0.82 + 0.26 * Math.cos(baseFolds * a)
    } else if (k === 3) {
        // C64 Cross / Plus portal profile
        return 0.74 + 0.30 * Math.cos(4.0 * a)
    }
    // Classic Hex / Octagon tube profile
    return 0.88 + 0.14 * Math.cos(6.0 * a)
}

function evalMinterShapeProfile(kindOrPhase, a, baseFolds) {
    var folds = baseFolds || 6
    var kFloor = Math.floor(kindOrPhase)
    var kFract = kindOrPhase - kFloor
    if (kFract <= 0.00001) {
        return _evalSingleMinterProfile(kFloor, a, folds)
    }
    var smoothBlend = kFract * kFract * (3.0 - 2.0 * kFract)
    var p0 = _evalSingleMinterProfile(kFloor, a, folds)
    var p1 = _evalSingleMinterProfile(kFloor + 1, a, folds)
    return lerp(p0, p1, smoothBlend)
}

// Mode 4: Commodore 64 / Jeff Minter VLM (Psychedelia / Tempest 2000) 3D Shape Tunnel!
// Authentic C64 / Llamasoft 3D shape tunnel where distinct geometric shapes (Tempest Star-Webs,
// C64 Octagons, Sacred Diamonds, Llamasoft Crosses, Delta Triangles, and Hex-Portals) spawn at the
// wandering diminishing endpoint and expand with true perspective ALL THE WAY PAST THE SCREEN BORDERS!
function drawMode4MinterVlm(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var diagR = Math.sqrt(w * w + h * h) * 0.88 * (cfg.layer2Zoom || 1.0)
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var trCount = clamp(Math.round(Number(cfg.tracerCount) || 8), 1, 16)

    // Number of 3D tunnel shape rings marching from diminishing endpoint off the screen
    var depthRings = isEcho ? 6 : Math.max(8, Math.min(16, Math.round(6 + trCount * 0.55 * comp)))
    var facets = isEcho ? 16 : 24

    // Smooth monotonic tunnel travel phase (`state.tunnelTime`) — zero phase teleportation!
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var tracerDir = Number(cfg && cfg.tracerDirection !== undefined ? cfg.tracerDirection : 1)
    var dirSign = (tracerDir < 0) ? -1.0 : 1.0
    var travelPhase = tunT * 1.45 * dirSign
    var zFract = ((travelPhase % 1.0) + 1.0) % 1.0
    var zBaseWorld = Math.floor(travelPhase)

    // Wandering 3D diminishing endpoint offset (snaking C64 tunnel spine)
    var driftScale = state.liveTracerDrift !== undefined
        ? state.liveTracerDrift
        : clamp(Number(cfg && cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0), 0.0, 2.5)
    var endPt = computeTracerEndpoint(w, h, driftT, Math.max(0.45, driftScale), 1.0)
    var curveX = endPt.dx * 0.82
    var curveY = endPt.dy * 0.82
    var baseFolds = clamp(Math.round(Number(cfg.layer2Facets) || 6), 3, 12)
    var palShift = Math.floor((state.hueShift || 0) / 45)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    // Precompute 3D shape tunnel rings from diminishing endpoint (d = 0, r -> 0.0px pinpoint)
    // out past all 4 borders of the viewport (d = depthRings, r -> diagR * 1.25)!
    var ringPts = []
    var ringZ = []
    var ringFade = []
    var ringWorld = []
    for (var d = 0; d <= depthRings; d++) {
        var zProg = clamp((d + zFract) / depthRings, 0.0, 1.15)
        ringZ.push(zProg)
        var birthFade = smoothstep(0.0, 0.22, zProg)
        ringFade.push(birthFade)
        var worldZ = zBaseWorld - d
        ringWorld.push(worldZ)

        // True perspective expansion: starts at exact 0.0 pinpoint at endpoint (zProg=0) and expands past diagR (zProg=1)
        var persp = Math.pow(zProg, 1.88)
        var rBase = persp * diagR * (1.16 + state.bass * 0.14)

        // Progressive 3D spine bend toward the wandering diminishing endpoint (zero wobble at zProg -> 0 so apex never snaps!)
        var bendAmt = Math.pow(1.0 - Math.min(1.0, zProg), 1.35)
        var wobbleEnv = zProg * (1.0 - Math.min(1.0, zProg) * 0.65)
        var wobbleX = Math.sin(worldZ * 0.35 + tunT * 1.2) * minDim * 0.045 * wobbleEnv
        var wobbleY = Math.cos(worldZ * 0.30 - tunT * 1.0) * minDim * 0.045 * wobbleEnv
        var spineX = curveX * bendAmt + wobbleX
        var spineY = curveY * bendAmt + wobbleY

        // Smooth C64 / Minter corkscrew rotation along tunnel depth
        var twist = state.phase * 0.65 + worldZ * 0.14

        // Smoothly interpolate between consecutive C64 / Minter shape families along worldZ
        // (eliminates discrete shape-jump joints between adjacent tunnel rings!)
        var worldPhase = worldZ * 0.18

        var pts = []
        for (var s = 0; s <= facets; s++) {
            var u = s / facets
            var a = u * Math.PI * 2
            var bIdx = ((s % facets) * 2 + (worldZ & 15) * 4) & 63
            var bVal = state.smoothBands[bIdx]
            var shapeProfile = evalMinterShapeProfile(worldPhase, a, baseFolds)
            var r = rBase * shapeProfile * (1.0 + bVal * 0.18)
            var rotA = a + twist

            pts.push({
                x: spineX + Math.cos(rotA) * r,
                y: spineY + Math.sin(rotA) * r,
                band: bVal
            })
        }
        ringPts.push(pts)
    }

    // 1. Checkered Llamasoft VLM Tunnel Wall Panels rendered back-to-front
    //    Inner bays (`ringFade[d0] < 0.99`) fade in smoothly by `ringFade[d0]` from 0.0 at d0=0 so zero joint pops in!
    if (!isEcho || (state.echoIndex || 0) < 3) {
        var baseWallAlpha = isEcho ? 0.08 : (0.12 + state.bass * 0.10)
        for (var pBucket = 0; pBucket < 2; pBucket++) {
            var panelCol = palette[(pBucket * 4 + palShift) % palette.length]
            for (var d0 = 0; d0 < depthRings; d0++) {
                var bf0 = ringFade[d0]
                if (bf0 < 0.01) continue
                if (bf0 < 0.99) {
                    ctx.fillStyle = colourWithAlpha(panelCol, baseWallAlpha * bf0)
                    ctx.beginPath()
                    var p0 = ringPts[d0]
                    var p1 = ringPts[d0 + 1]
                    var wZ = ringWorld[d0]
                    for (var s0 = 0; s0 < facets; s0++) {
                        if (((wZ + s0) & 1) !== pBucket) continue
                        ctx.moveTo(p0[s0].x, p0[s0].y)
                        ctx.lineTo(p0[s0 + 1].x, p0[s0 + 1].y)
                        ctx.lineTo(p1[s0 + 1].x, p1[s0 + 1].y)
                        ctx.lineTo(p1[s0].x, p1[s0].y)
                        ctx.closePath()
                    }
                    ctx.fill()
                }
            }
            ctx.fillStyle = colourWithAlpha(panelCol, baseWallAlpha)
            ctx.beginPath()
            for (var dOuter = 0; dOuter < depthRings; dOuter++) {
                if (ringFade[dOuter] < 0.99) continue
                var p0o = ringPts[dOuter]
                var p1o = ringPts[dOuter + 1]
                var wZo = ringWorld[dOuter]
                for (var s0o = 0; s0o < facets; s0o++) {
                    if (((wZo + s0o) & 1) !== pBucket) continue
                    ctx.moveTo(p0o[s0o].x, p0o[s0o].y)
                    ctx.lineTo(p0o[s0o + 1].x, p0o[s0o + 1].y)
                    ctx.lineTo(p1o[s0o + 1].x, p1o[s0o + 1].y)
                    ctx.lineTo(p1o[s0o].x, p1o[s0o].y)
                    ctx.closePath()
                }
            }
            ctx.fill()
        }
    }

    // 2. Longitudinal Tempest Web Lane Rails radiating from diminishing endpoint past all 4 screen edges
    //    Inner rail segments (`ringFade[dLane - 1] < 0.99`) fade in smoothly from 0 alpha & 0 width at the apex!
    var laneCol = palette[(1 + palShift) % palette.length]
    var baseLaneAlpha = 0.68 + state.high * 0.25
    var baseLaneWidth = (isEcho ? 1.5 : 2.2) + state.bass * 1.4
    for (var dLane = 1; dLane <= depthRings; dLane++) {
        var bfLane = ringFade[dLane - 1]
        if (bfLane < 0.01 || bfLane >= 0.99) continue
        ctx.strokeStyle = colourWithAlpha(laneCol, baseLaneAlpha * bfLane)
        ctx.lineWidth = baseLaneWidth * bfLane
        ctx.beginPath()
        for (var sLaneIn = 0; sLaneIn < facets; sLaneIn += 2) {
            ctx.moveTo(ringPts[dLane - 1][sLaneIn].x, ringPts[dLane - 1][sLaneIn].y)
            ctx.lineTo(ringPts[dLane][sLaneIn].x, ringPts[dLane][sLaneIn].y)
        }
        ctx.stroke()
    }
    ctx.strokeStyle = colourWithAlpha(laneCol, baseLaneAlpha)
    ctx.lineWidth = baseLaneWidth
    ctx.beginPath()
    for (var dLaneOut = 1; dLaneOut <= depthRings; dLaneOut++) {
        if (ringFade[dLaneOut - 1] < 0.99) continue
        for (var sLaneOut = 0; sLaneOut < facets; sLaneOut += 2) {
            ctx.moveTo(ringPts[dLaneOut - 1][sLaneOut].x, ringPts[dLaneOut - 1][sLaneOut].y)
            ctx.lineTo(ringPts[dLaneOut][sLaneOut].x, ringPts[dLaneOut][sLaneOut].y)
        }
    }
    ctx.stroke()

    // 3. Bright C64 / Minter Shape Rings expanding towards the user and passing completely OFF screen
    //    Each ring fades and thickens smoothly from 0 at the diminishing endpoint (`birthFade`)!
    for (var dr = 0; dr <= depthRings; dr++) {
        var zp = ringZ[dr]
        var bf = ringFade[dr]
        if (bf < 0.01) continue
        var ptsR = ringPts[dr]
        var wIdx = ((ringWorld[dr] * 2 + palShift) % palette.length + palette.length) % palette.length
        ctx.strokeStyle = colourWithAlpha(palette[wIdx], clamp((0.28 + zp * 0.72) * bf, 0.0, 1.0))
        ctx.lineWidth = (0.8 + zp * 4.2 + state.beatPulse * 1.2) * bf * (isEcho ? 0.72 : 1.0)
        ctx.beginPath()
        for (var sr = 0; sr <= facets; sr++) {
            if (sr === 0) ctx.moveTo(ptsR[sr].x, ptsR[sr].y)
            else ctx.lineTo(ptsR[sr].x, ptsR[sr].y)
        }
        ctx.stroke()
    }

    ctx.restore()
}

// Mode 5: True Complex-Plane Mandelbrot & Julia Boundary Deep-Zoom Engine
// Zooms continuously in (Towards), out (Away), or breathes (Breathe) directly into a boundary section
// (Seahorse Valley, Elephant Valley, Double Sceptre, Triple Spiral, Feigenbaum Mini-Brot) from the full
// Mandelbrot cardioid/bulb (-0.5, 0.0), allowing the boundary to fractal in and out across generations!
function drawMode5JuliaFractals(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)
    var gpuActive = cfg && cfg.gpuShaderEnabled !== undefined ? Boolean(cfg.gpuShaderEnabled) : true
    var isEcho = Boolean(state.isTracerEcho)

    var trDir = cfg && cfg.tracerDirection !== undefined ? Number(cfg.tracerDirection) : 1
    var dirSign = trDir === 0 ? Math.sin((state.t || 0.0) * 0.45) : (trDir < 0 ? -1.0 : 1.0)
    var zoomFlow = (state.zoomTime !== undefined ? state.zoomTime : state.t * 0.8) * 1.28 * (dirSign < 0 ? -1.0 : 1.0)
    var zoomFract = ((zoomFlow % 1.0) + 1.0) % 1.0
    var zoomGen = Math.floor(zoomFlow)

    var cycPhase = (((state.zoomTime || state.t) * 0.14) % 1.0 + 1.0) % 1.0
    var diveT = trDir === 0
        ? (0.5 - 0.5 * Math.cos(cycPhase * Math.PI * 2.0))
        : (trDir > 0
            ? smoothstep(0.0, 0.78, cycPhase) * (1.0 - smoothstep(0.78, 1.0, cycPhase))
            : smoothstep(0.0, 0.22, cycPhase) * (1.0 - smoothstep(0.22, 1.0, cycPhase)))

    var poiRe = (state.fractalRe !== undefined ? state.fractalRe : -0.74364388) + Math.cos(state.t * 0.22) * 0.015
    var poiIm = (state.fractalIm !== undefined ? state.fractalIm : 0.13182590) + Math.sin(state.t * 0.27) * 0.015
    var cRe = (state.fractalCRe !== undefined ? state.fractalCRe : -0.745) + Math.cos(state.t * 0.31) * (0.04 + state.bassSmooth * 0.04)
    var cIm = (state.fractalCIm !== undefined ? state.fractalCIm : 0.186) + Math.sin(state.t * 0.37) * (0.04 + state.midSmooth * 0.04)

    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)
    var focalX = cx + endPt.dx * 0.38
    var focalY = cy + endPt.dy * 0.38

    var trEnabled = cfg.layer2TracersEnabled !== undefined ? Boolean(cfg.layer2TracersEnabled) : true
    var trCount = trEnabled ? clamp(Math.round(Number(cfg.tracerCount) || 7), 1, 16) : 3
    var octaves = isEcho ? 2 : (gpuActive ? 4 : Math.max(5, Math.min(9, Math.round(4 + trCount * 0.35 * comp))))
    var ratio = 2.08
    var baseScale = minDim * (0.014 + diveT * 0.018)
    var folds = clamp(Math.round(Number(cfg.layer2Facets) || 6), 3, 12)
    var contourSteps = isEcho ? 40 : Math.max(64, Math.min(104, Math.floor(76 * comp)))
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var gpuAlphaMul = gpuActive ? 0.32 : 1.0

    function evalFractalBoundaryLocal(theta, subDetail, cReVal, cImVal, bVal) {
        var cardX = 0.5 * Math.cos(theta) - 0.25 * Math.cos(2.0 * theta)
        var cardY = 0.5 * Math.sin(theta) - 0.25 * Math.sin(2.0 * theta)
        var dHead = Math.cos((theta - Math.PI) * 0.5)
        var headBulb = Math.pow(Math.max(0.0, dHead), 6.0) * 0.42
        var dTop = Math.cos((theta - Math.PI * 0.52) * 0.5)
        var dBot = Math.cos((theta + Math.PI * 0.52) * 0.5)
        var period3Bulbs = (Math.pow(Math.max(0.0, dTop), 8.0) + Math.pow(Math.max(0.0, dBot), 8.0)) * 0.26

        var zr = cardX + poiRe * 0.25
        var zi = cardY + poiIm * 0.25
        var smoothIter = 0.0
        for (var it = 0; it < 8; it++) {
            var r2 = zr * zr, i2 = zi * zi
            if (r2 + i2 > 8.0) break
            zi = 2.0 * zr * zi + cImVal
            zr = r2 - i2 + cReVal
            smoothIter += 1.0 / (1.0 + (r2 + i2) * 0.35)
        }
        var escapePot = clamp(smoothIter / 4.8, 0.15, 1.55)
        var detailGain = subDetail * (0.65 + diveT * 0.65)
        var bud1 = Math.sin(folds * theta + escapePot * 2.4) * 0.14
        var bud2 = Math.cos(folds * 2.0 * theta - escapePot * 3.6 + state.phase * 0.5) * 0.09 * detailGain
        var bud3 = Math.sin(folds * 4.0 * theta + escapePot * 5.2 - state.t * 1.4) * 0.06 * detailGain * detailGain
        var radialOut = 1.0 + headBulb + period3Bulbs + bud1 + bud2 + bud3 + bVal * 0.18
        var nx = Math.cos(theta), ny = Math.sin(theta)
        return {
            x: cardX * radialOut - headBulb * 0.35 + nx * (bud1 + bud2 + bud3) * 0.45,
            y: cardY * radialOut + ny * (bud1 + bud2 + bud3) * 0.45,
            escapePot: escapePot
        }
    }

    var poiTheta = Math.atan2(poiIm, poiRe + 0.25)

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    for (var oct = octaves - 1; oct >= 0; oct--) {
        var octProgress = oct + zoomFract
        var uOct = octProgress / octaves
        var octScale = baseScale * Math.pow(ratio, octProgress)
        var octWorld = zoomGen - oct
        var envAlpha = smoothstep(0.0, 0.20, uOct) * smoothstep(1.08, 0.82, uOct)
        if (envAlpha < 0.01) continue

        var subDetail = smoothstep(0.08, 0.88, uOct) * (0.75 + state.bassSmooth * 0.35)
        var octRot = octWorld * 0.38 + Math.sin(state.phase * 0.22 + octWorld * 0.7) * 0.20
        var cosR = Math.cos(octRot), sinR = Math.sin(octRot)

        var panToBoundary = smoothstep(0.0, 0.75, diveT * 0.75 + uOct * 0.55)
        var poiPt = evalFractalBoundaryLocal(poiTheta, subDetail, cRe, cIm, state.bassSmooth * 0.5)
        var camLocX = lerp(-0.25, poiPt.x, panToBoundary)
        var camLocY = lerp(0.0, poiPt.y, panToBoundary)
        var poiRotX = camLocX * cosR - camLocY * sinR
        var poiRotY = camLocX * sinR + camLocY * cosR
        var shapeOriginX = focalX - poiRotX * octScale
        var shapeOriginY = focalY - poiRotY * octScale

        var colPrimary = palette[((octWorld * 2 + palShift) % palette.length + palette.length) % palette.length]
        var colSecondary = palette[((octWorld * 2 + 1 + palShift) % palette.length + palette.length) % palette.length]
        var colAccent = palette[((octWorld * 2 + 3 + palShift) % palette.length + palette.length) % palette.length]

        ctx.fillStyle = colourWithAlpha(colPrimary, (0.09 + (1.0 - uOct) * 0.10 + state.bassSmooth * 0.05) * envAlpha * gpuAlphaMul)
        ctx.strokeStyle = colourWithAlpha(colSecondary, (0.52 + envAlpha * 0.38) * envAlpha * (gpuActive ? 0.65 : 1.0))
        ctx.lineWidth = (1.1 + uOct * 2.2 + state.beatPulse * 0.9) * envAlpha

        var boundaryPts = []
        ctx.beginPath()
        for (var s = 0; s <= contourSteps; s++) {
            var u = s / contourSteps
            var theta = u * Math.PI * 2
            var bVal = state.smoothBands[(s + (octWorld & 15) * 4) & 63] || 0.08
            var ptL = evalFractalBoundaryLocal(theta, subDetail, cRe, cIm, bVal)
            var rx = ptL.x * cosR - ptL.y * sinR
            var ry = ptL.x * sinR + ptL.y * cosR
            var jx = shapeOriginX + rx * octScale
            var jy = shapeOriginY + ry * octScale
            boundaryPts.push({ x: jx, y: jy, theta: theta + octRot, pot: ptL.escapePot, band: bVal })
            if (s === 0) ctx.moveTo(jx, jy)
            else ctx.lineTo(jx, jy)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        if (!isEcho) {
            var budStride = Math.max(5, Math.floor(contourSteps / Math.max(5, Math.min(10, folds * 2))))
            ctx.strokeStyle = colourWithAlpha(colAccent, (0.62 + state.highSmooth * 0.30) * envAlpha * (gpuActive ? 0.65 : 1.0))
            ctx.fillStyle = colourWithAlpha(colSecondary, (0.14 + state.bassSmooth * 0.10) * envAlpha * gpuAlphaMul)
            ctx.lineWidth = (1.0 + uOct * 1.6 + state.bassSmooth * 0.7) * envAlpha

            for (var bi = 0; bi < contourSteps; bi += budStride) {
                var bNode = boundaryPts[bi]
                var budScale = octScale * (0.14 + subDetail * 0.14 + bNode.band * 0.09)
                var outAng = bNode.theta
                ctx.beginPath()
                var cSteps = 16
                for (var cs = 0; cs <= cSteps; cs++) {
                    var ct = (cs / cSteps) * Math.PI * 2
                    var cr = budScale * (0.55 * (1.0 - Math.cos(ct)) + 0.26 * Math.pow(Math.max(0.0, -Math.cos(ct)), 3.0))
                    var lx = Math.cos(ct) * cr + budScale * 0.28
                    var ly = Math.sin(ct) * cr
                    var bx = bNode.x + lx * Math.cos(outAng) - ly * Math.sin(outAng)
                    var by = bNode.y + lx * Math.sin(outAng) + ly * Math.cos(outAng)
                    if (cs === 0) ctx.moveTo(bx, by)
                    else ctx.lineTo(bx, by)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        }
    }

    ctx.restore()
}

// Mode 12: 3D Sierpinski Fractal — Recursive 3D Sierpinski Tetrahedron / Triforce Pyramid & 3D Fractal Canopy
function drawMode12SierpinskiFractal(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)
    var isEcho = Boolean(state.isTracerEcho)
    var palShift = Math.floor((state.hueShift || 0) / 45)

    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)
    var focalX = cx + endPt.dx * 0.30
    var focalY = cy + endPt.dy * 0.30

    var rx = 0.32 + Math.sin(state.t * 0.42) * 0.28 + state.bassSmooth * 0.14
    var ry = state.phase * 0.48
    var rz = Math.cos(state.t * 0.31) * 0.22
    var pyrScale = minDim * (0.34 + state.bassSmooth * 0.06)
    var fov = 3.8

    // Master 3D regular tetrahedron vertices (apex + 3 base corners)
    var rootV0 = [0.0, -1.06, 0.0]
    var rootV1 = [-0.96, 0.56, -0.55]
    var rootV2 = [ 0.96, 0.56, -0.55]
    var rootV3 = [ 0.0,  0.56,  1.10]

    // Audio-reactive breathing separation between recursive sub-tetrahedrons
    var shrink = clamp(0.48 - state.bassSmooth * 0.05, 0.38, 0.50)
    var maxDepth = isEcho ? 2 : (comp > 1.25 ? 3 : 2)
    var leafTetras = []

    function stepTowards(a, b, t) {
        return [
            a[0] + (b[0] - a[0]) * t,
            a[1] + (b[1] - a[1]) * t,
            a[2] + (b[2] - a[2]) * t
        ]
    }

    function collectSierpinski(v0, v1, v2, v3, depth, branchTag) {
        if (depth <= 0) {
            var p0 = project3DPoint(v0[0], v0[1], v0[2], rx, ry, rz, focalX, focalY, pyrScale, fov)
            var p1 = project3DPoint(v1[0], v1[1], v1[2], rx, ry, rz, focalX, focalY, pyrScale, fov)
            var p2 = project3DPoint(v2[0], v2[1], v2[2], rx, ry, rz, focalX, focalY, pyrScale, fov)
            var p3 = project3DPoint(v3[0], v3[1], v3[2], rx, ry, rz, focalX, focalY, pyrScale, fov)
            var avgZ = (p0.z + p1.z + p2.z + p3.z) * 0.25
            leafTetras.push({ p0: p0, p1: p1, p2: p2, p3: p3, z: avgZ, tag: branchTag })
            return
        }
        var dNext = depth - 1
        collectSierpinski(
            v0,
            stepTowards(v0, v1, shrink),
            stepTowards(v0, v2, shrink),
            stepTowards(v0, v3, shrink),
            dNext, branchTag * 4 + 0
        )
        collectSierpinski(
            stepTowards(v1, v0, shrink),
            v1,
            stepTowards(v1, v2, shrink),
            stepTowards(v1, v3, shrink),
            dNext, branchTag * 4 + 1
        )
        collectSierpinski(
            stepTowards(v2, v0, shrink),
            stepTowards(v2, v1, shrink),
            v2,
            stepTowards(v2, v3, shrink),
            dNext, branchTag * 4 + 2
        )
        collectSierpinski(
            stepTowards(v3, v0, shrink),
            stepTowards(v3, v1, shrink),
            stepTowards(v3, v2, shrink),
            v3,
            dNext, branchTag * 4 + 3
        )
    }

    collectSierpinski(rootV0, rootV1, rootV2, rootV3, maxDepth, 0)

    // Painter's sort back-to-front by 3D depth `z`
    leafTetras.sort(function(a, b) { return a.z - b.z })

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    // 1. Render depth-sorted 3D Sierpinski sub-tetrahedrons in colour buckets
    var bucketCount = 4
    for (var bk = 0; bk < bucketCount; bk++) {
        var faceCol = palette[(bk * 2 + palShift) % palette.length]
        var edgeCol = palette[(bk * 2 + 1 + palShift) % palette.length]
        ctx.fillStyle = colourWithAlpha(faceCol, (0.14 + state.bassSmooth * 0.12) * (isEcho ? 0.55 : 1.0))
        ctx.strokeStyle = colourWithAlpha(edgeCol, (0.78 + state.beatPulse * 0.20) * (isEcho ? 0.65 : 1.0))
        ctx.lineWidth = (1.35 + state.bassSmooth * 1.1) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()

        for (var ti = 0; ti < leafTetras.length; ti++) {
            var tet = leafTetras[ti]
            if ((tet.tag % bucketCount) !== bk) continue
            var a = tet.p0, b = tet.p1, c = tet.p2, d = tet.p3

            // Front-Left & Front-Right triangular facets
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(d.x, d.y); ctx.closePath()
            ctx.moveTo(a.x, a.y); ctx.lineTo(d.x, d.y); ctx.lineTo(c.x, c.y); ctx.closePath()
            // Remaining tetrahedral edges
            ctx.moveTo(b.x, b.y); ctx.lineTo(c.x, c.y)
        }
        ctx.fill()
        ctx.stroke()
    }

    // 2. Recursive 3D Fractal Canopy Branches radiating from the central octahedral void
    if (!isEcho) {
        var symBranches = clamp(Math.round(Number(cfg.layer2Facets) || 6), 4, 10)
        var spreadAng = 0.42 + state.midSmooth * 0.34
        ctx.strokeStyle = colourWithAlpha(palette[(3 + palShift) % palette.length], 0.72 + state.highSmooth * 0.26)
        ctx.lineWidth = 1.4 + state.highSmooth * 0.9
        ctx.beginPath()

        for (var sb = 0; sb < symBranches; sb++) {
            var baseAz = (sb / symBranches) * Math.PI * 2.0 + state.phase * 0.25
            var bVal = state.smoothBands[(sb * 7) & 63] || 0.15
            var r1 = 0.42 + bVal * 0.32
            var x1 = Math.cos(baseAz) * r1
            var y1 = -0.10 + Math.sin(sb + state.t) * 0.16
            var z1 = Math.sin(baseAz) * r1
            var pRoot = project3DPoint(0.0, 0.08, 0.0, rx, ry, rz, focalX, focalY, pyrScale, fov)
            var pMid = project3DPoint(x1, y1, z1, rx, ry, rz, focalX, focalY, pyrScale, fov)
            ctx.moveTo(pRoot.x, pRoot.y)
            ctx.lineTo(pMid.x, pMid.y)

            // Recursive fork generation 2 & 3
            for (var fk = -1; fk <= 1; fk += 2) {
                var az2 = baseAz + fk * spreadAng
                var r2 = r1 * (1.58 + state.bassSmooth * 0.24)
                var x2 = Math.cos(az2) * r2
                var y2 = y1 - (0.28 + bVal * 0.24) * fk
                var z2 = Math.sin(az2) * r2
                var pTip = project3DPoint(x2, y2, z2, rx, ry, rz, focalX, focalY, pyrScale, fov)
                ctx.moveTo(pMid.x, pMid.y)
                ctx.lineTo(pTip.x, pTip.y)

                for (var fk2 = -1; fk2 <= 1; fk2 += 2) {
                    var az3 = az2 + fk2 * spreadAng * 0.75
                    var r3 = r2 * 1.32
                    var pLeaf = project3DPoint(Math.cos(az3) * r3, y2 - 0.18 * fk2, Math.sin(az3) * r3, rx, ry, rz, focalX, focalY, pyrScale, fov)
                    ctx.moveTo(pTip.x, pTip.y)
                    ctx.lineTo(pLeaf.x, pLeaf.y)
                }
            }
        }
        ctx.stroke()
    }

    ctx.restore()
}

// Mode 6: 3D Sacred Lotus Hyperspace Dome & Harmonic Ripple Flower
function drawMode6DmtChrysanthemum(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.46 * (cfg.layer2Zoom || 1.0)
    var diagR = Math.hypot(w, h) * 0.68 * (cfg.layer2Zoom || 1.0)
    var symmetry = clamp(Math.round(Number(cfg.layer2Facets) || 6), 4, 16)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var rings = isEcho ? 4 : Math.max(6, Math.min(10, Math.round(7 * (cfg.layer2Complexity || 1.0) * lod)))
    var steps = isEcho ? 28 : 48
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)

    // 3D hemispherical dome camera breathing (pitch & roll)
    var camTilt = Math.sin(state.t * 0.48) * 0.28
    var camRoll = Math.cos(state.t * 0.36) * 0.14 * (1.0 + state.mid * 0.5)
    var cosTilt = Math.cos(camTilt), sinTilt = Math.sin(camTilt)

    ctx.save()
    ctx.translate(cx + endPt.dx * 0.28, cy + endPt.dy * 0.28)
    ctx.rotate(camRoll)
    ctx.globalCompositeOperation = "source-over"

    var prevDomeRing = null
    // 1. Concentric Harmonic Ripple Flower (`sin(r * 18.0 - t * 4.0 + sin(a * petals + t))`) & 3D Lotus Dome Tiers
    for (var r = rings; r >= 1; r--) {
        var frac = r / rings
        var domeZ = Math.cos(frac * Math.PI * 0.46) * (0.42 + state.bass * 0.24)
        var curRing = []

        for (var i = 0; i <= steps; i++) {
            var a = (i / steps) * Math.PI * 2
            var bVal = state.smoothBands[(i + r * 7) & 63]
            // Exact Harmonic Ripple Flower wave equation: sin(r * 18 - t * 4 + sin(a * petals + t)) * 0.5 + 0.5
            var flowerWave = Math.sin(frac * 18.0 - state.t * 4.0 + Math.sin(a * symmetry + state.t) * (1.0 + state.bass * 0.75)) * 0.5 + 0.5
            var petal = (flowerWave - 0.5) * (0.26 + bVal * 0.24 + state.mid * 0.12)
                      + Math.cos(a * symmetry * 2.0 - state.phase * 1.2) * 0.06
            var rad3 = frac * (0.86 + state.bass * 0.18 + petal)
            var x3 = Math.cos(a) * rad3
            var y3 = Math.sin(a) * rad3
            var z3 = domeZ + petal * 0.35

            // 3D pitch rotation & perspective projection expanding out toward diagR
            var yRot = y3 * cosTilt - z3 * sinTilt
            var zRot = y3 * sinTilt + z3 * cosTilt
            var persp = 1.55 / (2.10 - clamp(zRot, -1.1, 1.1))
            var ringScale = lerp(maxR, diagR * 0.86, frac * frac)
            curRing.push({
                x: x3 * ringScale * persp,
                y: yRot * ringScale * persp
            })
        }

        var jewelCol = palette[(r * 2 + palShift) % palette.length]
        var goldCol = palette[(r * 2 + 1 + palShift) % palette.length]

        // Filled translucent jewelled lotus petals & harmonic flower wave cells between tiers
        if (prevDomeRing && (!isEcho || (state.echoIndex || 0) < 3)) {
            ctx.fillStyle = colourWithAlpha(jewelCol, (0.09 + (1.0 - frac) * 0.14 + state.bass * 0.08) * (isEcho ? 0.5 : 1.0))
            ctx.beginPath()
            for (var k = 0; k <= steps; k++) {
                if (k === 0) ctx.moveTo(curRing[k].x, curRing[k].y)
                else ctx.lineTo(curRing[k].x, curRing[k].y)
            }
            for (var kBack = steps; kBack >= 0; kBack--) {
                ctx.lineTo(prevDomeRing[kBack].x, prevDomeRing[kBack].y)
            }
            ctx.closePath()
            ctx.fill()

            // Radial jewelled lattice filaments connecting dome tiers
            ctx.strokeStyle = colourWithAlpha(jewelCol, 0.28 + (1.0 - frac) * 0.38)
            ctx.lineWidth = 1.0 + (1.0 - frac) * 1.2
            ctx.beginPath()
            for (var rf = 0; rf < steps; rf += 2) {
                ctx.moveTo(prevDomeRing[rf].x, prevDomeRing[rf].y)
                ctx.lineTo(curRing[rf].x, curRing[rf].y)
            }
            ctx.stroke()
        }

        // Thick glowing harmonic ripple flower crest
        ctx.strokeStyle = colourWithAlpha(goldCol, 0.54 + (1.0 - frac) * 0.44)
        ctx.lineWidth = (1.6 + (1.0 - frac) * 2.2 + state.beatPulse * 1.2) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var p = 0; p <= steps; p++) {
            if (p === 0) ctx.moveTo(curRing[p].x, curRing[p].y)
            else ctx.lineTo(curRing[p].x, curRing[p].y)
        }
        ctx.closePath()
        ctx.stroke()

        prevDomeRing = curRing
    }

    // 2. Counter-Rotating 3D Inner Merkaba / Sri Yantra Star Polyhedron & Radiant Core Filaments at the Dome Apex
    if (!isEcho || (state.echoIndex || 0) < 2) {
        var starR = maxR * (0.24 + state.bass * 0.12 + state.beatPulse * 0.08)
        for (var tri = 0; tri < 2; tri++) {
            var triRot = state.phase * (tri === 0 ? 1.35 : -1.35) + tri * (Math.PI / symmetry)
            ctx.fillStyle = colourWithAlpha(palette[(tri * 4 + 2 + palShift) % palette.length], 0.16 + state.bass * 0.14)
            ctx.strokeStyle = colourWithAlpha(palette[(tri * 4 + palShift) % palette.length], 0.88)
            ctx.lineWidth = 2.2 + state.beatPulse * 1.2
            ctx.beginPath()
            for (var sv = 0; sv <= symmetry; sv++) {
                var sa = (sv / symmetry) * Math.PI * 2 + triRot
                var sr = (sv % 2 === 0) ? starR : (starR * 0.42)
                var sx = Math.cos(sa) * sr
                var sy = Math.sin(sa) * sr * cosTilt
                if (sv === 0) ctx.moveTo(sx, sy)
                else ctx.lineTo(sx, sy)
            }
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
        }

        // Radiant crown stamen filaments erupting from the sacred lotus apex
        ctx.strokeStyle = colourWithAlpha(palette[(1 + palShift) % palette.length], 0.74 + state.high * 0.26)
        ctx.lineWidth = 1.4 + state.bass * 1.2
        ctx.beginPath()
        for (var cf = 0; cf < symmetry; cf++) {
            var cfa = (cf / symmetry) * Math.PI * 2 - state.phase * 0.75
            var cfr = starR * (0.68 + state.smoothBands[(cf * 4) & 63] * 0.55)
            ctx.moveTo(0, 0)
            ctx.lineTo(Math.cos(cfa) * cfr, Math.sin(cfa) * cfr * cosTilt)
        }
        ctx.stroke()
    }

    ctx.restore()
}

// Mode 7: 3D Relativistic Gargantua Black Hole, Infalling Spiral Accretion Vortex, Einstein Lensing & Twin Quasar Jets
function drawMode7SpacetimeQuasar(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)
    var zoom = clamp(cfg.layer2Zoom || 1.0, 0.5, 2.5)
    var diagR = Math.hypot(w, h) * 0.72 * zoom
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)
    var trCount = clamp(Math.round(Number(cfg && cfg.tracerCount !== undefined ? cfg.tracerCount : 9)), 2, 16)
    var palShift = Math.floor(state.hueShift / 45)

    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)
    var bhX = cx + endPt.dx * 0.28
    var bhY = cy + endPt.dy * 0.28
    var ehR = minDim * (0.095 + state.bassSmooth * 0.032) * zoom

    // 3D orbital precession and disc inclination
    var precession = -0.28 + Math.sin(driftT * 0.34) * 0.22
    var discTilt = 0.36 + Math.cos(driftT * 0.27) * 0.08

    ctx.save()
    ctx.translate(bhX, bhY)
    ctx.rotate(precession)
    ctx.globalCompositeOperation = "source-over"

    // 1. Twin Relativistic Helical Quasar Plasma Jets blasting from North & South Poles past diagR
    var jetLen = diagR * (0.78 + state.bassSmooth * 0.32)
    var jetSteps = 18
    for (var pole = -1; pole <= 1; pole += 2) {
        var jetCol = palette[(pole < 0 ? 3 : 5 + palShift) % palette.length]
        var coreCol = palette[(1 + palShift) % palette.length]
        var leftJet = [], rightJet = []
        for (var js = 0; js <= jetSteps; js++) {
            var ju = js / jetSteps
            var jy = pole * (ehR * 0.82 + Math.pow(ju, 1.22) * jetLen)
            var bJet = state.smoothBands[(js * 3 + (pole > 0 ? 0 : 16)) & 63]
            var coneW = (ehR * 0.14 + Math.pow(ju, 1.38) * minDim * 0.22) * (1.0 + bJet * 0.55)
            var helixSwirl = Math.sin(ju * 8.5 - tunT * 5.2 * pole) * coneW
            leftJet.push({ x: helixSwirl - coneW * 0.45, y: jy })
            rightJet.push({ x: helixSwirl + coneW * 0.45, y: jy })
        }

        ctx.fillStyle = colourWithAlpha(jetCol, 0.18 + state.bassSmooth * 0.20)
        ctx.strokeStyle = colourWithAlpha(coreCol, 0.84 + state.beatSmooth * 0.16)
        ctx.lineWidth = 2.0 + state.bassSmooth * 2.0
        ctx.beginPath()
        for (var j0 = 0; j0 <= jetSteps; j0++) {
            if (j0 === 0) ctx.moveTo(leftJet[j0].x, leftJet[j0].y)
            else ctx.lineTo(leftJet[j0].x, leftJet[j0].y)
        }
        for (var j1 = jetSteps; j1 >= 0; j1--) {
            ctx.lineTo(rightJet[j1].x, rightJet[j1].y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    // 2. Gravitational-Lensing Einstein Halo Arches (rear accretion disc bent OVER and UNDER the event horizon)
    for (var arch = -1; arch <= 1; arch += 2) {
        for (var hBand = 1; hBand >= 0; hBand--) {
            var archCol = palette[(hBand * 2 + (arch < 0 ? 0 : 2) + palShift) % palette.length]
            ctx.fillStyle = colourWithAlpha(archCol, 0.14 + (1 - hBand) * 0.12 + state.bassSmooth * 0.12)
            ctx.strokeStyle = colourWithAlpha(palette[(hBand + 1 + palShift) % palette.length], 0.78 + state.beatSmooth * 0.22)
            ctx.lineWidth = (hBand === 0 ? 2.5 : 1.5) + state.bassSmooth * 1.6
            ctx.beginPath()
            var archSteps = 32
            for (var as = 0; as <= archSteps; as++) {
                var au = (as / archSteps) * Math.PI
                var bH = state.smoothBands[(as * 2 + hBand * 7) & 63]
                var rOuter = ehR * (1.06 + hBand * 0.18 + Math.sin(au) * (0.42 + bH * 0.28 + state.bassSmooth * 0.18))
                var ax = Math.cos(au) * rOuter * 1.38
                var ay = arch * Math.sin(au) * rOuter * 0.96
                if (as === 0) ctx.moveTo(ax, ay)
                else ctx.lineTo(ax, ay)
            }
            for (var asBack = archSteps; asBack >= 0; asBack--) {
                var au2 = (asBack / archSteps) * Math.PI
                var rInner = ehR * (0.98 + hBand * 0.12)
                ctx.lineTo(Math.cos(au2) * rInner * 1.15, arch * Math.sin(au2) * rInner * 0.84)
            }
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
        }
    }

    // 3. Infalling Logarithmic Spiral Matter Streams pulled from diagR into the Event Horizon
    var armCount = Math.max(10, Math.min(28, Math.round((8 + trCount) * comp)))
    var inflowPhase = (tunT * 0.68) % 1.0
    for (var arm = 0; arm < armCount; arm++) {
        var armCol = palette[(arm + palShift) % palette.length]
        var baseAng = (arm / armCount) * Math.PI * 2 - state.phase * 1.15
        ctx.strokeStyle = colourWithAlpha(armCol, 0.62 + state.midSmooth * 0.34)
        ctx.lineWidth = 1.6 + state.bassSmooth * 1.5
        ctx.beginPath()
        var segSteps = 18
        for (var sp = 0; sp <= segSteps; sp++) {
            var su = clamp((sp + 1.0 - inflowPhase) / segSteps, 0.015, 1.0)
            var sr = ehR * 1.02 + Math.pow(su, 1.78) * (diagR - ehR)
            // Relativistic frame-dragging angular whip as matter spirals into r -> ehR
            var sAng = baseAng + 3.1 / (su + 0.16)
            var bArm = state.smoothBands[(arm * 3 + sp * 2) & 63]
            // Doppler beaming stretches & brightens the approaching left side
            var doppler = 1.0 + 0.22 * Math.cos(sAng)
            var sx = Math.cos(sAng) * sr * doppler * (1.0 + bArm * 0.10)
            var sy = Math.sin(sAng) * sr * discTilt * (1.0 + bArm * 0.14)
            if (sp === 0) ctx.moveTo(sx, sy)
            else ctx.lineTo(sx, sy)
        }
        ctx.stroke()
    }

    // 4. Central Obsidian Event Horizon Singularity Core & Asymmetric Relativistic Photon Ring
    ctx.fillStyle = "#010104"
    ctx.strokeStyle = colourWithAlpha("#fff6d6", 0.94)
    ctx.lineWidth = 2.6 + state.bassSmooth * 2.2
    ctx.beginPath()
    ctx.arc(0, 0, ehR, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
}

// Mode 8: 3D Bioluminescent Deep-Sea Jellyfish & Volumetric Mycelial Canopy
function drawMode8AlienMycelium(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var tendrils = isEcho ? 8 : 12
    var segs = isEcho ? 8 : Math.max(10, Math.min(16, Math.round(12 * comp)))
    var hist = state.waveHistory || []

    // 3D pulsing jellyfish propulsion cycle driven by bass & phase
    var pulseContract = Math.sin(state.t * 3.2 + state.bass * 2.0)
    var swayAngle = Math.sin(state.t * 0.55) * 0.18
    var bellCentreY = -minDim * (0.10 + pulseContract * 0.04)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(swayAngle)
    ctx.globalCompositeOperation = "source-over"

    // 1. 3D Translucent Bioluminescent Jellyfish Bell / Mycelial Canopy Dome (3 layered umbrella bells)
    var bellLayers = isEcho ? 2 : 4
    var bellSteps = isEcho ? 20 : 32
    var palShift = Math.floor((state.hueShift || 0) / 45)
    for (var bl = bellLayers - 1; bl >= 0; bl--) {
        var bFrac = (bl + 1) / bellLayers
        var bellW = minDim * (0.14 + bFrac * 0.22) * (1.0 - pulseContract * 0.14 + state.bass * 0.18)
        var bellH = minDim * (0.09 + bFrac * 0.14) * (1.0 + pulseContract * 0.18 + state.bass * 0.14)
        var canopyCol = palette[(bl * 2 + palShift) % palette.length]
        var rimCol = palette[(bl * 2 + 1 + palShift) % palette.length]

        ctx.fillStyle = colourWithAlpha(canopyCol, (0.10 + (1.0 - bFrac) * 0.12 + state.bass * 0.08) * (isEcho ? 0.5 : 1.0))
        ctx.strokeStyle = colourWithAlpha(rimCol, 0.55 + (1.0 - bFrac) * 0.40)
        ctx.lineWidth = (1.5 + (1.0 - bFrac) * 2.0 + state.beatPulse * 1.2) * (isEcho ? 0.75 : 1.0)

        ctx.beginPath()
        // Upper 3D umbrella dome arch
        for (var bs = 0; bs <= bellSteps; bs++) {
            var u = bs / bellSteps
            var a = Math.PI + u * Math.PI // upper semicircle
            var bVal0 = state.smoothBands[(bs * 2 + bl * 7) & 63]
            var scallop = Math.sin(u * Math.PI * 8 + state.t * 3.0) * minDim * 0.018 * (1.0 + bVal0)
            var bx = Math.cos(a) * (bellW + scallop)
            var by = bellCentreY + Math.sin(a) * bellH
            if (bs === 0) ctx.moveTo(bx, by)
            else ctx.lineTo(bx, by)
        }
        // Scalloped lower sub-umbrella margin closing the 3D bell
        for (var bs2 = bellSteps; bs2 >= 0; bs2--) {
            var u2 = bs2 / bellSteps
            var sc = Math.sin(u2 * Math.PI * 10 + state.t * 4.2 + bl) * minDim * (0.018 + state.mid * 0.025)
            var mx = Math.cos(u2 * Math.PI) * bellW
            var my = bellCentreY + Math.sin(u2 * Math.PI) * (bellH * 0.28) + sc
            ctx.lineTo(mx, my)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    // 2. Extruded 3D Bioluminescent Ribbon Tentacles & Travelling Synaptic Spore Pods
    var baseSpanW = minDim * 0.28 * (1.0 - pulseContract * 0.12)
    var travelPulse = (state.t * 3.6) % segs
    for (var bucket = 0; bucket < 3; bucket++) {
        var tendrilFill = palette[(bucket * 3 + 1) % palette.length]
        var tendrilStroke = palette[(bucket * 3) % palette.length]
        ctx.fillStyle = colourWithAlpha(tendrilFill, (0.15 + state.mid * 0.16) * (isEcho ? 0.55 : 1.0))
        ctx.strokeStyle = colourWithAlpha(tendrilStroke, 0.65 + state.bass * 0.32)
        ctx.lineWidth = 1.8 + state.bass * 1.5
        ctx.beginPath()

        var nodeSpores = []
        for (var td = bucket; td < tendrils; td += 3) {
            var tNorm = (td / Math.max(1, tendrils - 1)) * 2.0 - 1.0 // -1 .. +1 across bell rim
            var px = tNorm * baseSpanW
            var py = bellCentreY + Math.sin((td / tendrils) * Math.PI) * minDim * 0.04
            var stepLen = (minDim * (0.36 + state.bass * 0.16)) / segs
            var leftX = [px - 3.2], leftY = [py]
            var rightX = [px + 3.2], rightY = [py]

            for (var s = 1; s <= segs; s++) {
                var frac = s / segs
                var snap = (hist.length > s && hist[s] && hist[s].bands) ? hist[s].bands : state.smoothBands
                var bVal = snap[(td * 2 + s) & 31] !== undefined ? snap[(td * 2 + s) & 31] : (state.smoothBands[(td * 3 + s) & 63] || 0.1)
                var wave = Math.sin(state.t * 3.1 - s * 0.48 + td * 0.7) * (0.38 + state.mid * 0.55 + bVal * 0.45)
                var curAng = Math.PI * 0.5 + tNorm * 0.28 * (1.0 - frac * 0.5) + wave * frac
                px += Math.cos(curAng) * stepLen
                py += Math.sin(curAng) * stepLen
                var ribW = (4.2 * (1.0 - frac * 0.72) + bVal * 4.5) * (isEcho ? 0.65 : 1.0)
                var nx = -Math.sin(curAng) * ribW
                var ny = Math.cos(curAng) * ribW
                leftX.push(px + nx)
                leftY.push(py + ny)
                rightX.push(px - nx)
                rightY.push(py - ny)

                var isTravelHead = Math.abs(((s - travelPulse + segs) % segs) - 1.0) < 1.2
                if (!isEcho && (s % 4 === 0 || s === segs || isTravelHead)) {
                    nodeSpores.push(px, py, (isTravelHead ? 3.2 : 2.0) + bVal * 4.2)
                }
            }

            ctx.moveTo(leftX[0], leftY[0])
            for (var k0 = 1; k0 <= segs; k0++) ctx.lineTo(leftX[k0], leftY[k0])
            for (var k1 = segs; k1 >= 0; k1--) ctx.lineTo(rightX[k1], rightY[k1])
            ctx.closePath()
        }
        ctx.fill()
        ctx.stroke()

        // Glowing synaptic bioluminescent pods along tentacles
        if (nodeSpores.length > 0) {
            ctx.fillStyle = colourWithAlpha(palette[(bucket * 3 + 2) % palette.length], 0.85)
            ctx.beginPath()
            for (var sp = 0; sp < nodeSpores.length; sp += 3) {
                var sx = nodeSpores[sp], sy = nodeSpores[sp + 1], sr = nodeSpores[sp + 2]
                ctx.rect(sx - sr, sy - sr, sr * 2.0, sr * 2.0)
            }
            ctx.fill()
        }
    }

    // 3. Drifting 3D Bioluminescent Plankton & Mycelial Spore Cloud around the Canopy
    if (!isEcho) {
        var sporeCount = Math.min(state.spores ? state.spores.length : 0, 24)
        if (sporeCount > 0) {
            ctx.fillStyle = colourWithAlpha(palette[4 % palette.length], 0.68 + state.high * 0.28)
            ctx.beginPath()
            for (var scIdx = 0; scIdx < sporeCount; scIdx++) {
                var spObj = state.spores[scIdx]
                var spX = (spObj.x - 0.5) * minDim * 0.92
                var spY = (spObj.y - 0.5) * minDim * 0.92
                var spR = 1.6 + (state.smoothBands[(scIdx * 3) & 63] || 0.1) * 3.0
                ctx.rect(spX - spR, spY - spR, spR * 2.0, spR * 2.0)
            }
            ctx.fill()
        }
    }

    ctx.restore()
}

// Mode 9: Classic Matrix Digital Rain Waterfall (Multi-Depth 3D Parallax Phosphor-Green Code Cascade)
function drawMode9CyberMatrix(ctx, w, h, state, palette, cfg) {
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)
    var zoom = clamp(cfg.layer2Zoom || 1.0, 0.5, 2.2)
    var trCount = clamp(Math.round(Number(cfg.tracerCount) || 8), 1, 16)
    var matT = state.matrixTime !== undefined ? state.matrixTime : state.t

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    function addMatrixGlyph(ctx, gx, gy, gw, gh, seed) {
        var pat = (seed & 7)
        var barH = Math.max(1.3, gh * 0.18)
        var barW = Math.max(1.3, gw * 0.22)
        ctx.rect(gx - gw * 0.42, gy - gh * 0.42, gw * 0.84, barH)
        if (pat === 0) {
            ctx.rect(gx + gw * 0.20, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.24, gw * 0.84, barH)
        } else if (pat === 1) {
            ctx.rect(gx - gw * 0.36, gy - gh * 0.06, gw * 0.72, barH)
            ctx.rect(gx - barW * 0.5, gy - gh * 0.06, barW, gh * 0.48)
        } else if (pat === 2) {
            ctx.rect(gx - gw * 0.34, gy - barH * 0.5, gw * 0.68, barH)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.26, gw * 0.84, barH)
        } else if (pat === 3) {
            ctx.rect(gx - gw * 0.38, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx + gw * 0.16, gy - gh * 0.12, barW, gh * 0.54)
        } else if (pat === 4) {
            ctx.rect(gx - barW * 0.5, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.04, gw * 0.32, barH)
            ctx.rect(gx + gw * 0.12, gy - gh * 0.12, gw * 0.30, barH)
        } else if (pat === 5) {
            ctx.rect(gx + gw * 0.20, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.36, gy - barH * 0.5, gw * 0.68, barH)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.26, gw * 0.84, barH)
        } else if (pat === 6) {
            ctx.rect(gx - gw * 0.32, gy - gh * 0.20, barW, gh * 0.52)
            ctx.rect(gx + gw * 0.12, gy - gh * 0.42, barW, gh * 0.84)
        } else {
            ctx.rect(gx - barW * 0.5, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.40, gy - barH * 0.5, gw * 0.80, barH)
            ctx.rect(gx - gw * 0.38, gy + gh * 0.24, barW, barH * 1.2)
            ctx.rect(gx + gw * 0.18, gy + gh * 0.24, barW, barH * 1.2)
        }
    }

    // 3 Depth Planes of Pure Vertical Falling Matrix Digital Rain
    for (var zPlane = 0; zPlane <= 2; zPlane++) {
        var cols = Math.max(16, Math.min(46, Math.round((18 + zPlane * 9) * clamp(comp, 0.65, 1.35) / Math.sqrt(zoom))))
        var colW = w / cols
        var glyphW = clamp(colW * 0.64, 4.5, 22.0)
        var glyphH = glyphW * 1.28
        var trailLen = Math.max(6, Math.min(20, Math.round(5 + zPlane * 3 + trCount * 0.6)))
        var planeAlpha = 0.38 + zPlane * 0.30

        var colHead = "#eafff5"
        var colNear = zPlane === 2 ? "#00ff66" : "#10d96b"
        var colMid  = zPlane === 1 ? "#09bd56" : "#059e47"
        var colTail = "#034d1f"

        // 1. Subtle vertical phosphor scanline beam behind active columns
        if (zPlane >= 1) {
            ctx.fillStyle = colourWithAlpha("#00ff66", 0.04 + state.bass * 0.06)
            ctx.beginPath()
            for (var cBeam = 0; cBeam < cols; cBeam++) {
                var bBeam = state.smoothBands[(cBeam * 2 + zPlane * 7) & 63]
                if (bBeam < 0.20) continue
                var cSeedB = ((cBeam * 73 + zPlane * 131) % 97) / 97.0
                var fallSpdB = 0.24 + cSeedB * 0.36 + zPlane * 0.12
                var headYB = (((matT * fallSpdB + cSeedB * 3.7) % 1.45) - 0.15) * h
                var beamH = trailLen * glyphH * 0.85
                var bx = (cBeam + 0.5) * colW
                ctx.rect(bx - glyphW * 0.45, headYB - beamH, glyphW * 0.90, beamH + glyphH)
            }
            ctx.fill()
        }

        // 2. Trailing Phosphor-Green Glyph Cascade (pure vertical columns, constant per-column fall speed!)
        var tierColours = [colNear, colMid, colTail]
        var tierAlphas = [0.92 * planeAlpha, 0.64 * planeAlpha, 0.34 * planeAlpha]

        for (var tier = 2; tier >= 0; tier--) {
            ctx.fillStyle = colourWithAlpha(tierColours[tier], tierAlphas[tier])
            ctx.beginPath()
            var tStart = tier === 0 ? 1 : (tier === 1 ? 3 : Math.floor(trailLen * 0.55))
            var tEnd = tier === 0 ? 2 : (tier === 1 ? Math.floor(trailLen * 0.55) - 1 : trailLen)

            for (var c = 0; c < cols; c++) {
                var cSeed = ((c * 73 + zPlane * 131) % 97) / 97.0
                var fallSpeed = 0.24 + cSeed * 0.36 + zPlane * 0.12
                var streams = (zPlane === 2 && (c % 3 === 0)) ? 2 : 1

                for (var st = 0; st < streams; st++) {
                    var headY = (((matT * fallSpeed + cSeed * 3.7 + st * 0.68) % 1.45) - 0.15) * h
                    var gx = (c + 0.5) * colW

                    for (var k = tStart; k <= tEnd; k++) {
                        var gy = headY - k * glyphH * 1.12
                        if (gy < -glyphH || gy > h + glyphH) continue
                        var charTick = Math.floor(matT * (5.0 + (k & 3) * 2.0))
                        var gSeed = (c * 31 + k * 17 + zPlane * 53 + st * 19 + charTick) & 255
                        var scaleK = 1.0 - (k / (trailLen + 2)) * 0.22
                        addMatrixGlyph(ctx, gx, gy, glyphW * scaleK, glyphH * scaleK, gSeed)
                    }
                }
            }
            ctx.fill()
        }

        // 3. White-Hot Phosphor-Mint Leading Head Glyphs dropping vertically at the tip of every Matrix stream
        ctx.fillStyle = colourWithAlpha(colHead, clamp(0.96 * planeAlpha, 0.2, 1.0))
        ctx.strokeStyle = colourWithAlpha("#00ff66", 0.55 * planeAlpha)
        ctx.lineWidth = 1.2
        ctx.beginPath()
        for (var ch = 0; ch < cols; ch++) {
            var bIdxH = (ch * 2 + zPlane * 9) & 63
            var bValH = state.smoothBands[bIdxH]
            var cSeedH = ((ch * 73 + zPlane * 131) % 97) / 97.0
            var fallSpeedH = 0.24 + cSeedH * 0.36 + zPlane * 0.12
            var streamsH = (zPlane === 2 && (ch % 3 === 0)) ? 2 : 1

            for (var stH = 0; stH < streamsH; stH++) {
                var headYH = (((matT * fallSpeedH + cSeedH * 3.7 + stH * 0.68) % 1.45) - 0.15) * h
                if (headYH < -glyphH || headYH > h + glyphH) continue
                var gxH = (ch + 0.5) * colW
                var headBoost = 1.06 + bValH * 0.20
                var headSeed = (ch * 41 + Math.floor(matT * 10.0) + zPlane * 19 + stH * 11) & 255
                addMatrixGlyph(ctx, gxH, headYH, glyphW * headBoost, glyphH * headBoost, headSeed)
            }
        }
        ctx.fill()
        ctx.stroke()
    }

    ctx.restore()
}

// Precomputed 4D Tesseract cell quad faces for volumetric hyper-facet rendering
var TESSERACT_FACES = [
    [0, 1, 3, 2], [4, 5, 7, 6], [8, 9, 11, 10], [12, 13, 15, 14],
    [0, 1, 9, 8], [2, 3, 11, 10], [4, 5, 13, 12], [6, 7, 15, 14]
]

// Mode 10: Unlocked Pure 4D Hypercube (Tesseract rotating freely in all 6 4D/3D planes with Volumetric Hyper-Facets)
function drawMode10SacredPolytope(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var scale = Math.min(w, h) * 0.32 * (cfg.layer2Zoom || 1.0) * (1.0 + state.bass * 0.28 + state.beatPulse * 0.16)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    // Full 6-plane 4D rotation (XW, YW, ZW + 3D XY, XZ, YZ) — completely unlocked!
    var aXW = state.t * 0.78 + state.bass * 0.95
    var aYW = state.t * 0.56 - state.mid * 0.75
    var aZW = state.t * 0.41 + state.high * 0.65
    var aXY = state.phase * 0.48
    var aXZ = state.t * 0.33

    var cosXW = Math.cos(aXW), sinXW = Math.sin(aXW)
    var cosYW = Math.cos(aYW), sinYW = Math.sin(aYW)
    var cosZW = Math.cos(aZW), sinZW = Math.sin(aZW)
    var cosXY = Math.cos(aXY), sinXY = Math.sin(aXY)
    var cosXZ = Math.cos(aXZ), sinXZ = Math.sin(aXZ)

    var proj = []
    for (var i = 0; i < 16; i++) {
        var bVal = state.smoothBands[(i * 4) & 63]
        var m = 1.0 + bVal * 0.32
        var x = ((i & 1) ? 1 : -1) * m
        var y = ((i & 2) ? 1 : -1) * m
        var z = ((i & 4) ? 1 : -1) * m
        var w4 = ((i & 8) ? 1 : -1) * m

        // 4D plane rotations (XW, YW, ZW)
        var x1 = x * cosXW - w4 * sinXW
        var w1 = x * sinXW + w4 * cosXW
        var y2 = y * cosYW - w1 * sinYW
        var w2 = y * sinYW + w1 * cosYW
        var z3 = z * cosZW - w2 * sinZW
        var w3 = z * sinZW + w2 * cosZW

        // Free 3D spatial rotations (XY, XZ)
        var rx1 = x1 * cosXY - y2 * sinXY
        var ry1 = x1 * sinXY + y2 * cosXY
        var rx2 = rx1 * cosXZ - z3 * sinXZ
        var rz2 = rx1 * sinXZ + z3 * cosXZ

        var d4 = 2.65 / (3.35 - clamp(w3, -1.85, 1.85))
        var d3 = 2.25 / (3.15 - clamp(rz2 * d4, -1.85, 1.85))
        var pScale = d4 * d3
        proj.push({
            x: rx2 * pScale * scale,
            y: ry1 * pScale * scale,
            p: pScale
        })
    }

    // Translucent Volumetric 4D Hyper-Cell Faces
    if (!state.isTracerEcho || (state.echoIndex || 0) < 3) {
        for (var f = 0; f < TESSERACT_FACES.length; f++) {
            var face = TESSERACT_FACES[f]
            ctx.fillStyle = colourWithAlpha(palette[(f * 2) % palette.length], state.isTracerEcho ? 0.05 : (0.09 + state.bass * 0.08))
            ctx.beginPath()
            ctx.moveTo(proj[face[0]].x, proj[face[0]].y)
            ctx.lineTo(proj[face[1]].x, proj[face[1]].y)
            ctx.lineTo(proj[face[2]].x, proj[face[2]].y)
            ctx.lineTo(proj[face[3]].x, proj[face[3]].y)
            ctx.closePath()
            ctx.fill()
        }
    }

    // Group 0: Inner 3D cube cell (w = -1, vertices 0..7, 12 edges)
    ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], 0.82 + state.bass * 0.18)
    ctx.lineWidth = 2.2 + state.beatPulse * 1.4
    ctx.beginPath()
    for (var u0 = 0; u0 < 8; u0++) {
        for (var b0 = 0; b0 < 3; b0++) {
            var v0 = u0 ^ (1 << b0)
            if (u0 < v0) {
                ctx.moveTo(proj[u0].x, proj[u0].y)
                ctx.lineTo(proj[v0].x, proj[v0].y)
            }
        }
    }
    ctx.stroke()

    // Group 1: Outer 3D cube cell (w = +1, vertices 8..15, 12 edges)
    ctx.strokeStyle = colourWithAlpha(palette[3 % palette.length], 0.82 + state.mid * 0.18)
    ctx.lineWidth = 2.2 + state.beatPulse * 1.4
    ctx.beginPath()
    for (var u1 = 8; u1 < 16; u1++) {
        for (var b1 = 0; b1 < 3; b1++) {
            var v1 = u1 ^ (1 << b1)
            if (u1 < v1) {
                ctx.moveTo(proj[u1].x, proj[u1].y)
                ctx.lineTo(proj[v1].x, proj[v1].y)
            }
        }
    }
    ctx.stroke()

    // Group 2: 8 Fourth-Dimensional W-axis Hyper-Struts connecting inner and outer cubes (bit 3)
    ctx.strokeStyle = colourWithAlpha(palette[6 % palette.length], 0.88 + state.high * 0.12)
    ctx.lineWidth = 2.5 + state.bass * 1.6
    ctx.beginPath()
    for (var u2 = 0; u2 < 8; u2++) {
        var v2 = u2 ^ 8
        ctx.moveTo(proj[u2].x, proj[u2].y)
        ctx.lineTo(proj[v2].x, proj[v2].y)
    }
    ctx.stroke()

    // Glowing 4D corner vertices on the front slices
    if (!state.isTracerEcho || (state.echoIndex || 0) < 3) {
        ctx.fillStyle = colourWithAlpha(palette[1 % palette.length], 0.88)
        ctx.beginPath()
        for (var k = 0; k < 16; k++) {
            var nr = Math.max(1.8, 2.4 * proj[k].p)
            ctx.rect(proj[k].x - nr, proj[k].y - nr, nr * 2.0, nr * 2.0)
        }
        ctx.fill()
    }

    ctx.restore()
}

// Mode 11: 3D Lorenz / Clifford Chaos Ribbon Manifold & Phase-Space Vortex
function drawMode11StrangeAttractor(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var scale = Math.min(w, h) * 0.34 * (cfg.layer2Zoom || 1.0) * (1.0 + state.bass * 0.22)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var steps = isEcho ? 34 : Math.max(44, Math.floor(72 * clamp(comp, 0.5, 1.35)))

    // 3D camera rotation around the chaotic strange attractor lobes
    var rotX = state.t * 0.54 + state.bass * 0.65
    var rotY = state.t * 0.72 - state.mid * 0.55
    var cosX = Math.cos(rotX), sinX = Math.sin(rotX)
    var cosY = Math.cos(rotY), sinY = Math.sin(rotY)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(state.phase * 0.22)
    ctx.globalCompositeOperation = "source-over"

    var ribbonCount = isEcho ? 2 : 3
    for (var ribbon = 0; ribbon < ribbonCount; ribbon++) {
        var rPhase = ribbon * (Math.PI * 2 / 3.0)
        var leftPts = []
        var rightPts = []
        var corePts = []

        // Continuous 3D double-scroll Lorenz/Clifford chaotic manifold parameterised along u
        for (var i = 0; i <= steps; i++) {
            var u = (i / steps) * Math.PI * 4.0
            var bVal = state.smoothBands[(i + ribbon * 17) & 63]
            // Smooth transition between two counter-scrolling 3D strange attractor wings
            var wing = Math.sin(u * 0.5 + state.t * 0.85 + rPhase)
            var lobeR = 0.38 + (0.28 + bVal * 0.36) * Math.cos(u * 1.5 - state.t * 1.4 + rPhase)
            var x3 = wing * 0.52 + lobeR * Math.cos(u * 2.0 + rPhase)
            var y3 = lobeR * Math.sin(u * 2.0 + rPhase) + Math.sin(u * 3.0 + state.t * 1.6) * (0.18 + state.mid * 0.22)
            var z3 = Math.cos(u + state.t * 1.1 + rPhase) * (0.45 + bVal * 0.42 + state.bass * 0.25)

            // 3D rotation & perspective projection
            var x1 = x3 * cosY - z3 * sinY
            var z1 = x3 * sinY + z3 * cosY
            var y2 = y3 * cosX - z1 * sinX
            var z2 = y3 * sinX + z1 * cosX
            var persp = 1.68 / (2.25 - clamp(z2, -1.25, 1.25))

            var sx = x1 * scale * persp
            var sy = y2 * scale * persp
            var halfW = (3.2 + bVal * 10.5 + state.bass * 5.5) * persp * (isEcho ? 0.65 : 1.0)
            corePts.push({ x: sx, y: sy, w: halfW, band: bVal, p: persp })
        }

        for (var k = 0; k <= steps; k++) {
            var pPrev = corePts[k > 0 ? k - 1 : 0]
            var pNext = corePts[k < steps ? k + 1 : steps]
            var dx = pNext.x - pPrev.x
            var dy = pNext.y - pPrev.y
            var len = Math.sqrt(dx * dx + dy * dy) || 1.0
            var nx = -dy / len
            var ny = dx / len
            var hw = corePts[k].w
            leftPts.push({ x: corePts[k].x + nx * hw, y: corePts[k].y + ny * hw })
            rightPts.push({ x: corePts[k].x - nx * hw, y: corePts[k].y - ny * hw })
        }

        var palShift = Math.floor((state.hueShift || 0) / 45)
        var ribFillCol = palette[(ribbon * 3 + palShift) % palette.length]
        var ribStrokeCol = palette[(ribbon * 3 + 1 + palShift) % palette.length]

        // 1. Filled translucent 3D phase-space manifold ribbon
        if (!isEcho || (state.echoIndex || 0) < 3) {
            ctx.fillStyle = colourWithAlpha(ribFillCol, (0.14 + state.energy * 0.16) * (isEcho ? 0.55 : 1.0))
            ctx.beginPath()
            for (var f0 = 0; f0 <= steps; f0++) {
                if (f0 === 0) ctx.moveTo(leftPts[f0].x, leftPts[f0].y)
                else ctx.lineTo(leftPts[f0].x, leftPts[f0].y)
            }
            for (var f1 = steps; f1 >= 0; f1--) {
                ctx.lineTo(rightPts[f1].x, rightPts[f1].y)
            }
            ctx.closePath()
            ctx.fill()
        }

        // 2. Thick glowing trajectory rails (lineWidth = 2.2..4.2)
        ctx.strokeStyle = colourWithAlpha(ribStrokeCol, 0.74 + state.energy * 0.26)
        ctx.lineWidth = clamp(2.2 + state.bass * 1.8, 2.2, 4.2) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var s0 = 0; s0 <= steps; s0++) {
            if (s0 === 0) ctx.moveTo(corePts[s0].x, corePts[s0].y)
            else ctx.lineTo(corePts[s0].x, corePts[s0].y)
        }
        ctx.stroke()

        // 3. Orbiting 3D phase-space energy packets pulsing & travelling along the attractor lobes
        if (!isEcho) {
            var flowIdx = Math.floor((state.t * 14.0 + ribbon * 5) % 6)
            ctx.fillStyle = colourWithAlpha(palette[(ribbon * 3 + 2) % palette.length], 0.90)
            ctx.beginPath()
            for (var np = flowIdx; np <= steps; np += 6) {
                var cp = corePts[np]
                var nr = (2.2 + cp.band * 3.8 + state.beatPulse * 1.4) * cp.p
                ctx.rect(cp.x - nr, cp.y - nr, nr * 2.0, nr * 2.0)
            }
            ctx.fill()
        }
    }
    ctx.restore()
}

function drawSingleLayer2Mode(ctx, w, h, state, palette, cfg, m) {
    if (m === 0) drawMode0MilkDrop(ctx, w, h, state, palette, cfg)
    else if (m === 1) drawMode1AvsSuperScope(ctx, w, h, state, palette, cfg)
    else if (m === 2) drawMode2GForceWaveShape(ctx, w, h, state, palette, cfg)
    else if (m === 3) drawMode3CthughaRave(ctx, w, h, state, palette, cfg)
    else if (m === 4) drawMode4MinterVlm(ctx, w, h, state, palette, cfg)
    else if (m === 5) drawMode5JuliaFractals(ctx, w, h, state, palette, cfg)
    else if (m === 6) drawMode6DmtChrysanthemum(ctx, w, h, state, palette, cfg)
    else if (m === 7) drawMode7SpacetimeQuasar(ctx, w, h, state, palette, cfg)
    else if (m === 8) drawMode8AlienMycelium(ctx, w, h, state, palette, cfg)
    else if (m === 9) drawMode9CyberMatrix(ctx, w, h, state, palette, cfg)
    else if (m === 10) drawMode10SacredPolytope(ctx, w, h, state, palette, cfg)
    else if (m === 11) drawMode11StrangeAttractor(ctx, w, h, state, palette, cfg)
    else drawMode12SierpinskiFractal(ctx, w, h, state, palette, cfg)
}

function drawLayer2Visualiser(ctx, w, h, state, palette, cfg) {
    if (cfg && !cfg.layer2Enabled) return
    if (cfg && cfg.layer2VizEnabled === false) return
    var m = ((Number(cfg && cfg.layer2Mode !== undefined ? cfg.layer2Mode : (cfg && cfg.mode)) || 0) % MODE_NAMES.length + MODE_NAMES.length) % MODE_NAMES.length

    var trEnabled = cfg && cfg.layer2TracersEnabled !== undefined ? Boolean(cfg.layer2TracersEnabled) : true
    var tracerCount = trEnabled ? clamp(Math.round(Number(cfg && cfg.tracerCount !== undefined ? cfg.tracerCount : 9)), 1, 16) : 1
    var tracerSpeed = state.liveTracerSpeed !== undefined
        ? state.liveTracerSpeed
        : clamp(Number(cfg && cfg.tracerSpeed !== undefined ? cfg.tracerSpeed : 1.15), 0.15, 3.0)
    var tracerDrift = state.liveTracerDrift !== undefined
        ? state.liveTracerDrift
        : clamp(Number(cfg && cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0), 0.0, 2.5)
    var tracerDir = Number(cfg && cfg.tracerDirection !== undefined ? cfg.tracerDirection : 1)

    // Modes 0, 1, 2, 3, 4, 5, 7, and 9 already render native 3D depth tunnels, oscilloscope rings, fractal cascades, or full-screen Matrix rain
    // using cfg.tracerCount directly for their ring/slice/octave/arm/trail count.
    var isNativeTunnelOrFullScreen = (m === 0 || m === 1 || m === 2 || m === 3 || m === 4 || m === 5 || m === 7 || m === 9)
    if (tracerCount <= 1 || isNativeTunnelOrFullScreen) {
        state.isTracerEcho = false
        state.echoIndex = 0
        state.echoCount = tracerCount
        state.echoAge = 0.0
        state.echoLod = 1.0
        drawSingleLayer2Mode(ctx, w, h, state, palette, cfg, m)
        return
    }

    var cx = w * 0.5
    var cy = h * 0.5
    var baseT = state.t
    var basePhase = state.phase
    var endPt = computeTracerEndpoint(w, h, state.driftTime !== undefined ? state.driftTime : baseT, tracerDrift, 1.0)
    var lagStep = 0.052 * (0.45 + 0.55 * tracerSpeed)
    var effDir = (tracerDir === 0) ? Math.sin(baseT * 0.55) : clamp(tracerDir, -1, 1)
    var echoAtten = 1.0 / (1.0 + Math.sqrt(tracerCount) * 0.45)

    var noopFill = function() {}
    for (var e = tracerCount - 1; e >= 0; e--) {
        var u = e / Math.max(1, tracerCount - 1)
        var curveU = Math.pow(u, 1.10)

        state.t = baseT - e * lagStep
        state.phase = basePhase - e * lagStep * 1.35
        state.echoIndex = e
        state.echoCount = tracerCount
        state.echoAge = u
        state.isTracerEcho = (e > 0)
        state.echoLod = (e === 0) ? 1.0 : (e >= 2 ? 0.34 : 0.48)

        var echoPalette = rotatePaletteForEcho(palette, e)

        var zScale = 1.0
        var tx = 0.0
        var ty = 0.0
        if (effDir >= 0) {
            var towardsAmt = 0.5 + 0.5 * effDir
            zScale = 0.58 + curveU * (1.05 + 0.65 * tracerSpeed * towardsAmt)
            tx = endPt.dx * (0.45 * (1.0 - curveU) - 0.35 * curveU)
            ty = endPt.dy * (0.45 * (1.0 - curveU) - 0.35 * curveU)
        } else {
            var awayAmt = Math.abs(effDir)
            zScale = 1.18 / (1.0 + curveU * (1.35 + 0.75 * tracerSpeed * awayAmt))
            tx = endPt.dx * curveU
            ty = endPt.dy * curveU
        }

        var alphaE = (e === 0) ? 0.98 : (Math.pow(1.0 - u * 0.86, 1.42) * 0.78 * echoAtten)
        var twistAngle = Math.sin(baseT * 0.36) * 0.14 * curveU

        ctx.save()
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = clamp(alphaE, 0.04, 1.0)
        ctx.translate(cx + tx, cy + ty)
        ctx.scale(zScale, zScale)
        ctx.rotate(twistAngle)
        ctx.translate(-cx, -cy)
        var savedFill = ctx.fill
        if (e > 0 && m !== 9) {
            ctx.fill = noopFill
        }
        drawSingleLayer2Mode(ctx, w, h, state, echoPalette, cfg, m)
        if (e > 0 && m !== 9) {
            ctx.fill = savedFill
        }
        ctx.restore()
    }

    state.t = baseT
    state.phase = basePhase
    state.isTracerEcho = false
    state.echoIndex = 0
    state.echoLod = 1.0
}

// ---------------------------------------------------------------------------
// LAYER #3 — Album Art & Song Words Dismantle, Evolution, Tracers & Rebuild
// ---------------------------------------------------------------------------

// Precomputed 2x4 Braille dot relative offsets within [-0.36..+0.36, -0.40..+0.40]
var BRAILLE_DOT_DX = [-0.24, -0.24, -0.24,  0.24,  0.24,  0.24, -0.24,  0.24]
var BRAILLE_DOT_DY = [-0.36, -0.12,  0.12, -0.36, -0.12,  0.12,  0.36,  0.36]

var LAYER3_STYLE_FONTS = [
    "'Orbitron', 'Rajdhani', 'Eurostile', 'JetBrainsMono Nerd Font', sans-serif",          // 0: Cyber Techno
    "'Syne', 'Space Grotesk', 'JetBrainsMono Nerd Font', sans-serif",                      // 1: Psychedelic Liquid
    "'Chakra Petch', 'Orbitron', 'JetBrainsMono Nerd Font', monospace",                    // 2: Rave Laser Stencil
    "'Montserrat', 'Orbitron', 'JetBrainsMono Nerd Font', sans-serif",                     // 3: Dance Chrome
    "'JetBrainsMono Nerd Font', 'JetBrains Mono', monospace",                              // 4: Club LED Wall
    "'JetBrainsMono Nerd Font', 'JetBrains Mono', monospace",                              // 5: Acid Glitch IDM
    "'Cinzel', 'Orbitron', 'JetBrainsMono Nerd Font', sans-serif",                         // 6: Psytrance UV Glow
    "'Impact', 'Arial Black', 'JetBrainsMono Nerd Font', sans-serif",                      // 7: Berlin Brutalist
    "'Rajdhani', 'Orbitron', 'JetBrainsMono Nerd Font', monospace",                        // 8: Holographic Sci-Fi HUD
    "'Share Tech Mono', 'JetBrainsMono Nerd Font', monospace",                             // 9: Oscilloscope Vector Beam
    "'Orbitron', 'Montserrat', 'JetBrainsMono Nerd Font', sans-serif",                     // 10: 3D Isometric Extrude
    "'Chakra Petch', 'Orbitron', 'JetBrainsMono Nerd Font', sans-serif",                   // 11: Plasma Arc Tesla
    "'Syne', 'Montserrat', 'JetBrainsMono Nerd Font', sans-serif",                         // 12: Y2K Iridescent Mercury
    "'Press Start 2P', 'JetBrainsMono Nerd Font', monospace",                              // 13: Demoscene Copperbars
    "'Space Grotesk', 'Syne', 'JetBrainsMono Nerd Font', sans-serif",                      // 14: Bioluminescent Mycelium
    "'JetBrainsMono Nerd Font', 'Share Tech Mono', monospace"                              // 15: Quantum Matrix Datastream
]
var LAYER3_STYLE_PALETTES = [
    ["#00F5FF", "#FF1493", "#E2F9FF", "#7B2CBF", "#00FFB2", "#FFBE0B"], // 0: Cyber Techno
    ["#FF007F", "#FFAA00", "#00FFCC", "#BF00FF", "#FFFF33", "#00C8FF"], // 1: Psychedelic Liquid
    ["#00FF88", "#00F0FF", "#FF0055", "#E6FF00", "#00FFCC", "#FF2A85"], // 2: Rave Laser Stencil
    ["#E8F7FF", "#00E5FF", "#FF2A9D", "#FFFFFF", "#9B5DE5", "#FFD166"], // 3: Dance Chrome
    ["#00FF88", "#00E5FF", "#FFB800", "#FF007F", "#38BDF8", "#A3E635"], // 4: Club LED Wall
    ["#E6FF00", "#00F0FF", "#FF1E56", "#F8FAFC", "#A855F7", "#10B981"], // 5: Acid Glitch IDM
    ["#B5179E", "#00FFFF", "#FFD700", "#7209B7", "#4CC9F0", "#F72585"], // 6: Psytrance UV Glow
    ["#F4F4F6", "#FF1E38", "#E6FF00", "#FFFFFF", "#FF3B30", "#D1D5DB"], // 7: Berlin Brutalist
    ["#00FFD5", "#00B4D8", "#90E0EF", "#38F9D7", "#48CAE4", "#E0FBFC"], // 8: Holographic Sci-Fi HUD
    ["#00FF66", "#33FFCC", "#CCFFDD", "#00E5FF", "#80FFAA", "#FFFFFF"], // 9: Oscilloscope Vector Beam
    ["#00F5D4", "#F15BB5", "#9B5DE5", "#FEE440", "#00BBF9", "#FFFFFF"], // 10: 3D Isometric Extrude
    ["#7DF9FF", "#B5179E", "#FFFFFF", "#4CC9F0", "#9D4EDD", "#E0AAFF"], // 11: Plasma Arc Tesla
    ["#F8FAFC", "#A5F3FC", "#F5D0FE", "#C4B5FD", "#67E8F9", "#F472B6"], // 12: Y2K Iridescent Mercury
    ["#FF0055", "#FF8800", "#FFEE00", "#00FF66", "#00CCFF", "#AA00FF"], // 13: Demoscene Copperbars
    ["#00FFB2", "#38BDF8", "#A3E635", "#E879F9", "#2DD4BF", "#FDE047"], // 14: Bioluminescent Mycelium
    ["#00FF99", "#10B981", "#FFD166", "#6EE7B7", "#34D399", "#ECFDF5"]  // 15: Quantum Matrix Datastream
]

function drawLayer3AlbumArt(ctx, w, h, state, palette, cfg, asciiLines, ttfxFrames) {
    if (!cfg || !cfg.layer3Enabled) return

    var l3Mode = (Number(cfg.layer3Mode) || 0) % LAYER3_MODES.length
    var rawAsciiMode = String(cfg.layer3AsciiMode || cfg.asciiMode || "braille").toLowerCase()
    var isWordsSource = (l3Mode === 5 || cfg.useAlbumArt === false || rawAsciiMode === "banner")
    var isTextGlyph = (rawAsciiMode === "text")
    var isBlockGlyph = (rawAsciiMode === "block")
    var isBrailleGlyph = (!isBlockGlyph && !isTextGlyph)

    var cx = w * 0.5
    var cy = h * 0.5
    var l3T = state.t || 0.0
    var baseL3Scale = clamp(Number(cfg.layer3Scale !== undefined ? cfg.layer3Scale : 1.0), 0.45, 2.5)
    var randomScaleWave = cfg.layer3AutoRandomise
        ? (0.68 + 0.58 * (0.5 + 0.5 * Math.sin(l3T * 0.72 + Math.cos(l3T * 0.31) * 0.8)))
        : 1.0
    var scale = clamp(baseL3Scale * randomScaleWave, 0.38, 2.6)
    var l3Tracers = clamp(Math.round(Number(cfg.layer3Tracers !== undefined ? cfg.layer3Tracers : 3)), 1, 8)
    var tracerSpeed = state.liveTracerSpeed !== undefined
        ? state.liveTracerSpeed
        : clamp(Number(cfg.tracerSpeed !== undefined ? cfg.tracerSpeed : 1.15), 0.15, 3.0)
    var tracerDrift = state.liveTracerDrift !== undefined
        ? state.liveTracerDrift
        : clamp(Number(cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0), 0.0, 2.5)
    var tracerDir = Number(cfg.tracerDirection !== undefined ? cfg.tracerDirection : 1)
    var endPt = computeTracerEndpoint(w, h, state.driftTime !== undefined ? state.driftTime : state.t, tracerDrift, 1.0)
    var warpIntensity = clamp(Number(cfg.layer3Dismantle !== undefined ? cfg.layer3Dismantle : 1.15), 0.15, 3.0) * (0.65 + state.bassSmooth * 0.55)
    var evoFreq = clamp(Number(cfg.layer3Evolution !== undefined ? cfg.layer3Evolution : 0.85), 0.2, 2.5)

    var showArtist = cfg.layer3ShowArtist !== undefined ? Boolean(cfg.layer3ShowArtist) : true
    var showTrack = cfg.layer3ShowTrack !== undefined ? Boolean(cfg.layer3ShowTrack) : true
    var showAlbum = cfg.layer3ShowAlbum !== undefined ? Boolean(cfg.layer3ShowAlbum) : true
    var showStatements = cfg.layer3ShowStatements !== undefined ? Boolean(cfg.layer3ShowStatements) : false
    var anyTextEnabled = (showArtist || showTrack || showAlbum || showStatements)
    var textStyle = clamp(Math.round(Number(cfg.layer3TextStyle !== undefined ? cfg.layer3TextStyle : 0)), 0, LAYER3_TEXT_STYLES.length - 1)
    var colourMode = clamp(Math.round(Number(cfg.layer3ColourMode !== undefined ? cfg.layer3ColourMode : 0)), 0, LAYER3_COLOUR_MODES.length - 1)
    var cylDir = clamp(Math.round(Number(cfg.layer3CylinderDir !== undefined ? cfg.layer3CylinderDir : 0)), 0, LAYER3_CYLINDER_DIRS.length - 1)

    var rawArtist = String(cfg.trackArtist || "").trim().toUpperCase()
    var rawTitle = String(cfg.trackTitle || "").trim().toUpperCase()
    var rawAlbum = String(cfg.trackAlbum || "").trim().toUpperCase()
    var rawStatement = String(cfg.statementText || "").trim().toUpperCase()
    if (!rawStatement && DEFAULT_STATEMENTS.length > 0) {
        rawStatement = DEFAULT_STATEMENTS[Math.floor(Math.max(0, l3T) * 0.12) % DEFAULT_STATEMENTS.length]
    }
    if (!rawArtist && !rawTitle && !rawAlbum) {
        rawArtist = "BANDARCHY"
        rawTitle = "AUDIO STREAM"
        rawAlbum = "LIVE SYNTHESIS"
    }

    var textLines = []
    if (showArtist && rawArtist) {
        textLines.push(rawArtist)
    }
    if (showTrack && rawTitle && (textLines.length === 0 || rawTitle !== textLines[textLines.length - 1])) {
        textLines.push(rawTitle)
    }
    if (showAlbum && rawAlbum && (textLines.length === 0 || (rawAlbum !== rawTitle && rawAlbum !== rawArtist))) {
        textLines.push(rawAlbum)
    }
    if (showStatements && rawStatement && (textLines.length === 0 || textLines.indexOf(rawStatement) < 0)) {
        textLines.push(rawStatement)
    }
    if (anyTextEnabled && textLines.length === 0) {
        textLines.push(rawStatement || rawArtist || rawTitle || rawAlbum || "BANDARCHY")
    }
    var textStream = textLines.length > 0 ? (textLines.join(" • ") + " • ") : " "

    var activeStylePal = (colourMode === 0)
        ? (LAYER3_STYLE_PALETTES[textStyle] || palette)
        : ((palette && palette.length > 0) ? palette : LAYER3_STYLE_PALETTES[textStyle])
    var activeFontFamily = LAYER3_STYLE_FONTS[textStyle] || "'JetBrainsMono Nerd Font', sans-serif"

    // Select source lines early so if Art has no lines yet, Crisp Text still renders full-screen
    var effectiveLines = asciiLines
    if (isWordsSource && cfg.bannerLines && cfg.bannerLines.length > 0) {
        effectiveLines = cfg.bannerLines
    } else if (!isWordsSource && cfg.artLines && cfg.artLines.length > 0) {
        effectiveLines = cfg.artLines
    }

    // If in Words / Crisp Text mode (or no art lines) and all 4 text toggles (A/S/D/F) are OFF, draw nothing
    if (!anyTextEnabled && (isWordsSource || isTextGlyph || !effectiveLines || effectiveLines.length === 0)) {
        return
    }

    // Dedicated Crisp Warped Typography Showcase when Words + Crisp Text (or when Art lines are empty) across ALL 12 Layer 3 Modes (0..11)
    if (isTextGlyph && (isWordsSource || !effectiveLines || effectiveLines.length === 0)) {
        var displayLines = textLines.slice()
        if (textStyle === 0 && displayLines.length > 0) {
            displayLines[0] = "◢ " + displayLines[0] + " ◣"
        } else if (textStyle === 6 && displayLines.length > 0) {
            displayLines[0] = "❖ " + displayLines[0] + " ❖"
        } else if (textStyle === 8 && displayLines.length > 0) {
            displayLines[0] = "⌜ " + displayLines[0] + " ⌝"
        }
        var maxChars = 10
        for (var li = 0; li < displayLines.length; li++) {
            if (displayLines[li].length > maxChars) maxChars = displayLines[li].length
        }
        var baseFontPx = Math.floor(clamp((w * 0.80 * scale) / Math.max(8, maxChars * 0.66), 20, h * 0.145 * scale))
        var lineSpanH = baseFontPx * 1.52
        var totalTextH = displayLines.length * lineSpanH

        var lens1X = Math.sin(l3T * 0.88) * 0.66
        var lens1Y = Math.cos(l3T * 1.15) * 0.30
        var lens2X = Math.cos(l3T * 0.64) * 0.66
        var lens2Y = Math.sin(l3T * 0.92) * 0.30
        var lensRad = 0.52 + state.bassSmooth * 0.22

        ctx.save()
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        for (var te = l3Tracers - 1; te >= 0; te--) {
            var isEchoT = (te > 0)
            var uT = l3Tracers > 1 ? (te / (l3Tracers - 1)) : 0.0
            var zScaleT = (tracerDir >= 0)
                ? (1.0 + uT * 0.30 * tracerSpeed)
                : (1.0 / (1.0 + uT * 0.45 * tracerSpeed))
            var txT = endPt.dx * uT * 0.38 * (tracerDir >= 0 ? -1.0 : 1.0)
            var tyT = endPt.dy * uT * 0.38 * (tracerDir >= 0 ? -1.0 : 1.0)
            var passAlphaT = isEchoT ? (Math.pow(1.0 - uT * 0.80, 1.35) * (textStyle === 6 ? 0.50 : 0.38)) : 0.98

            ctx.save()
            ctx.globalAlpha = clamp(passAlphaT, 0.06, 1.0)
            if (isEchoT) {
                ctx.translate(cx + txT, cy + tyT)
                ctx.scale(zScaleT, zScaleT)
                ctx.translate(-cx, -cy)
            }

            for (var rowIdx = 0; rowIdx < displayLines.length; rowIdx++) {
                var str = displayLines[rowIdx]
                var nCh = str.length
                if (nCh === 0) continue
                var rowFontPx = (rowIdx === 0) ? baseFontPx : Math.max(15, Math.floor(baseFontPx * (rowIdx === 1 ? 0.78 : 0.60)))
                var trackingMul = (textStyle === 7 || textStyle === 8)
                    ? (0.72 + state.bassSmooth * 0.10)
                    : (textStyle === 0 || textStyle === 10 ? 0.70 : 0.66)
                var charStep = rowFontPx * trackingMul
                var rowHalfW = Math.max(1.0, (nCh - 1) * charStep * 0.5)
                var hyNorm = (displayLines.length === 1) ? 0.0 : ((rowIdx / (displayLines.length - 1)) * 2.0 - 1.0) * 0.55
                var baseRowY = cy + (rowIdx - (displayLines.length - 1) * 0.5) * lineSpanH

                // Row-level stage plates / brutalist bars / laser scanlines / futuristic HUD & Copperbars on front pass
                if (!isEchoT) {
                    var plateW = rowHalfW * 2.0 + rowFontPx * 1.45
                    var plateH = rowFontPx * 1.18
                    var modeUsesPlate = (l3Mode === 1 || l3Mode === 5 || l3Mode === 6 || l3Mode === 8 || l3Mode === 10)
                    if (textStyle === 0 && modeUsesPlate) {
                        // Style 0: Cyber Techno chamfered dark backing plate + dual cyan/magenta laser keylines
                        var chCut = Math.min(14.0, plateH * 0.30)
                        ctx.save()
                        ctx.beginPath()
                        ctx.moveTo(cx - plateW * 0.5 + chCut, baseRowY - plateH * 0.5)
                        ctx.lineTo(cx + plateW * 0.5, baseRowY - plateH * 0.5)
                        ctx.lineTo(cx + plateW * 0.5 - chCut, baseRowY + plateH * 0.5)
                        ctx.lineTo(cx - plateW * 0.5, baseRowY + plateH * 0.5)
                        ctx.closePath()
                        ctx.fillStyle = "rgba(5, 8, 18, 0.78)"
                        ctx.fill()
                        ctx.lineWidth = 1.8 + state.beatPulse * 1.2
                        ctx.strokeStyle = rowIdx === 0 ? "#00F5FF" : "#FF1493"
                        ctx.stroke()
                        ctx.restore()
                    } else if (textStyle === 2 && modeUsesPlate) {
                        // Style 2: Rave Laser Stencil horizontal laser beam scanline
                        var scanY = baseRowY + Math.sin(l3T * 6.5 + rowIdx * 1.7) * (plateH * 0.36)
                        ctx.save()
                        ctx.strokeStyle = colourWithAlpha("#00FF99", 0.52 + state.beatPulse * 0.40)
                        ctx.lineWidth = 1.6 + state.bassSmooth * 2.0
                        ctx.beginPath()
                        ctx.moveTo(cx - plateW * 0.54, scanY)
                        ctx.lineTo(cx + plateW * 0.54, scanY)
                        ctx.stroke()
                        ctx.restore()
                    } else if (textStyle === 7 && modeUsesPlate) {
                        // Style 7: Berlin Brutalist monumental high-contrast inverted poster bar
                        ctx.save()
                        ctx.fillStyle = (rowIdx === 0)
                            ? (state.beatPulse > 0.42 ? "#FF1E38" : "#F4F4F6")
                            : "rgba(8, 8, 12, 0.88)"
                        ctx.fillRect(cx - plateW * 0.5, baseRowY - plateH * 0.5, plateW, plateH)
                        ctx.lineWidth = 2.4
                        ctx.strokeStyle = (rowIdx === 0) ? "#060609" : "#FF1E38"
                        if (typeof ctx.strokeRect === "function") ctx.strokeRect(cx - plateW * 0.5, baseRowY - plateH * 0.5, plateW, plateH)
                        ctx.restore()
                    } else if (textStyle === 8) {
                        // Style 8: Holographic Sci-Fi HUD reticle brackets & telemetry scanline
                        ctx.save()
                        var hudX0 = cx - plateW * 0.52
                        var hudX1 = cx + plateW * 0.52
                        var hudY0 = baseRowY - plateH * 0.52
                        var hudY1 = baseRowY + plateH * 0.52
                        var brk = Math.min(18.0, plateH * 0.34)
                        ctx.fillStyle = "rgba(2, 18, 28, 0.46)"
                        ctx.fillRect(hudX0, hudY0, hudX1 - hudX0, hudY1 - hudY0)
                        ctx.strokeStyle = colourWithAlpha("#00FFD5", 0.72 + state.beatPulse * 0.25)
                        ctx.lineWidth = 1.8
                        ctx.beginPath()
                        ctx.moveTo(hudX0, hudY0 + brk); ctx.lineTo(hudX0, hudY0); ctx.lineTo(hudX0 + brk, hudY0)
                        ctx.moveTo(hudX1 - brk, hudY0); ctx.lineTo(hudX1, hudY0); ctx.lineTo(hudX1, hudY0 + brk)
                        ctx.moveTo(hudX0, hudY1 - brk); ctx.lineTo(hudX0, hudY1); ctx.lineTo(hudX0 + brk, hudY1)
                        ctx.moveTo(hudX1 - brk, hudY1); ctx.lineTo(hudX1, hudY1); ctx.lineTo(hudX1, hudY1 - brk)
                        var hScanY = hudY0 + ((l3T * 0.85 + rowIdx * 0.37) % 1.0) * (hudY1 - hudY0)
                        ctx.moveTo(hudX0 + 6, hScanY); ctx.lineTo(hudX1 - 6, hScanY)
                        ctx.stroke()
                        ctx.restore()
                    } else if (textStyle === 9) {
                        // Style 9: Oscilloscope Vector Beam continuous audio carrier waveform behind row
                        ctx.save()
                        ctx.strokeStyle = colourWithAlpha("#00FF66", 0.52 + state.bassSmooth * 0.35)
                        ctx.lineWidth = 1.8 + state.beatPulse * 1.4
                        ctx.beginPath()
                        var oscSegs = 28
                        for (var oi = 0; oi <= oscSegs; oi++) {
                            var ou = oi / oscSegs
                            var ox = cx + (ou * 2.0 - 1.0) * (plateW * 0.52)
                            var obin = (oi * 2 + rowIdx * 7) & 63
                            var oAmp = (state.smoothBands[obin] || 0.2) * plateH * 0.42
                            var oy = baseRowY + Math.sin(ou * 12.0 - l3T * 8.0 + rowIdx) * oAmp
                            if (oi === 0) ctx.moveTo(ox, oy)
                            else ctx.lineTo(ox, oy)
                        }
                        ctx.stroke()
                        ctx.restore()
                    } else if (textStyle === 11) {
                        // Style 11: Plasma Arc Tesla high-voltage jagged lightning filament across row
                        ctx.save()
                        ctx.strokeStyle = colourWithAlpha("#7DF9FF", 0.58 + state.beatPulse * 0.38)
                        ctx.lineWidth = 1.5 + state.bassSmooth * 1.8
                        ctx.beginPath()
                        var arcSteps = 18
                        for (var ai = 0; ai <= arcSteps; ai++) {
                            var au = ai / arcSteps
                            var ax = cx + (au * 2.0 - 1.0) * (rowHalfW + rowFontPx * 0.4)
                            var jag = (ai === 0 || ai === arcSteps) ? 0.0 : Math.sin(ai * 7.3 + Math.floor(l3T * 24.0) * 3.1 + rowIdx) * (rowFontPx * 0.28 * (0.5 + state.bassSmooth))
                            var ay = baseRowY + jag
                            if (ai === 0) ctx.moveTo(ax, ay)
                            else ctx.lineTo(ax, ay)
                        }
                        ctx.stroke()
                        ctx.restore()
                    } else if (textStyle === 13) {
                        // Style 13: Demoscene Copperbars classic Amiga multi-band raster bars slicing behind row
                        ctx.save()
                        var nBars = 5
                        var barH = Math.max(2.5, plateH * 0.14)
                        for (var bi = 0; bi < nBars; bi++) {
                            var bOff = Math.sin(l3T * 3.8 + bi * 0.72 + rowIdx * 1.1) * (plateH * 0.36)
                            ctx.fillStyle = colourWithAlpha(activeStylePal[(bi + rowIdx) % activeStylePal.length], 0.68)
                            ctx.fillRect(cx - plateW * 0.52, baseRowY + bOff - barH * 0.5, plateW * 1.04, barH)
                        }
                        ctx.restore()
                    } else if (textStyle === 14) {
                        // Style 14: Bioluminescent Mycelium organic glowing synaptic tendrils behind row
                        ctx.save()
                        ctx.strokeStyle = colourWithAlpha("#00FFB2", 0.42 + state.midSmooth * 0.35)
                        ctx.lineWidth = 1.6
                        ctx.beginPath()
                        var mycSteps = 20
                        for (var mi = 0; mi <= mycSteps; mi++) {
                            var mu = mi / mycSteps
                            var mx = cx + (mu * 2.0 - 1.0) * (rowHalfW + rowFontPx * 0.3)
                            var my = baseRowY + Math.sin(mu * 7.0 + l3T * 2.4 + rowIdx) * (rowFontPx * 0.24)
                            if (mi === 0) ctx.moveTo(mx, my)
                            else ctx.lineTo(mx, my)
                        }
                        ctx.stroke()
                        ctx.restore()
                    }
                }

                var fontSlope = (textStyle === 1 || textStyle === 3 || textStyle === 12) ? "900 italic " : "900 "
                ctx.font = fontSlope + rowFontPx + "px " + activeFontFamily

                // In 3D Cylinder mode (l3Mode === 7), sort characters back-to-front by 3D cylinder Z depth
                // so characters orbiting across the back hemisphere are cleanly occluded by the front hemisphere!
                var charIndices = []
                for (var ciInit = 0; ciInit < nCh; ciInit++) {
                    var hxInit = (nCh <= 1) ? 0.0 : ((ciInit / (nCh - 1)) * 2.0 - 1.0)
                    var sortZ = ciInit * 0.0001
                    if (l3Mode === 7) {
                        var sSign = (cylDir === 1 || cylDir === 3 || cylDir === 5) ? -1.0 : 1.0
                        var sAng = ((cylDir === 2 || cylDir === 3) ? (hyNorm * Math.PI * 0.82 + hxInit * 0.22) : (hxInit * Math.PI * 0.90))
                                 + sSign * l3T * 1.55 * evoFreq + rowIdx * 0.36
                        sortZ = Math.cos(sAng)
                    }
                    charIndices.push({ ci: ciInit, z: sortZ })
                }
                if (l3Mode === 7) {
                    charIndices.sort(function(a, b) { return a.z - b.z })
                }

                for (var cOrd = 0; cOrd < charIndices.length; cOrd++) {
                    var ci = charIndices[cOrd].ci
                    var ch = str.charAt(ci)
                    if (ch === " ") continue
                    var hxNorm = (nCh <= 1) ? 0.0 : ((ci / (nCh - 1)) * 2.0 - 1.0)
                    var cpx = cx + (ci - (nCh - 1) * 0.5) * charStep
                    var cpy = baseRowY
                    var sx = 1.0
                    var sy = 1.0
                    var rot = 0.0
                    var cylDepthAlpha = 1.0
                    var charPhase = (ci * 0.57 + rowIdx * 1.73)

                    if (l3Mode === 0) {
                        // Mode 0: Shatter & Evolving Rebuild
                        var shCycle = Math.max(0.0, Math.sin(l3T * 1.15 * evoFreq + rowIdx * 0.6))
                        var shBurst = (shCycle * shCycle * 0.28 + (state.artBurst || 0.0) * 0.45 + state.beatPulse * 0.22) * warpIntensity
                        var radA = Math.atan2(hyNorm + Math.sin(charPhase) * 0.25, hxNorm + Math.cos(charPhase) * 0.25)
                        cpx += Math.cos(radA + charPhase * 0.3) * rowHalfW * 0.32 * shBurst
                        cpy += Math.sin(radA + charPhase * 0.3) * lineSpanH * 0.85 * shBurst
                        rot = Math.sin(l3T * 2.2 + charPhase) * 0.35 * shBurst
                        sx = clamp(1.0 + state.beatPulse * 0.24, 0.75, 1.65)
                        sy = sx
                    } else if (l3Mode === 1) {
                        // Mode 1: Cellular Automata Growth
                        var cellWave = Math.sin(ci * 0.75 - l3T * 2.8 * evoFreq + rowIdx * 1.4)
                        var cellPulse = clamp(0.68 + 0.32 * cellWave + state.bassSmooth * 0.28, 0.45, 1.48)
                        sx = cellPulse
                        sy = cellPulse
                        cpy += Math.round(Math.sin(l3T * 1.9 + charPhase) * 2.0) * (rowFontPx * 0.08 * warpIntensity)
                    } else if (l3Mode === 2) {
                        // Mode 2: Blackhole Accretion & Nova — Continuous 360°+ whole-word orbital revolution around the vortex core
                        var bhPull = (0.5 + 0.5 * Math.sin(l3T * 1.35 * evoFreq)) * 0.38 * warpIntensity
                        var wordSpin360 = l3T * 1.10 * evoFreq * (tracerDir >= 0 ? 1.0 : -1.0) + rowIdx * 0.45
                        var swAng = wordSpin360 + bhPull * 0.45 * (1.0 - Math.abs(hxNorm) * 0.35)
                        var dx0 = cpx - cx, dy0 = cpy - cy
                        var cosSw = Math.cos(swAng), sinSw = Math.sin(swAng)
                        var novaScale = clamp(1.0 - bhPull * 0.36 + state.beatPulse * 0.38 * warpIntensity, 0.52, 1.55)
                        cpx = cx + (dx0 * cosSw - dy0 * sinSw) * novaScale
                        cpy = cy + (dx0 * sinSw + dy0 * cosSw) * novaScale
                        rot = swAng
                        sx = clamp(novaScale, 0.60, 1.55)
                        sy = sx
                    } else if (l3Mode === 3) {
                        // Mode 3: Tectonic Shear & Acid Melt
                        var shearX = Math.sin(l3T * 2.1 * evoFreq + rowIdx * 2.2) * charStep * 0.95 * warpIntensity
                        var dripY = Math.max(0.0, Math.sin(hxNorm * 5.0 + l3T * 2.4 * evoFreq + rowIdx)) * lineSpanH * 0.48 * warpIntensity
                        cpx += shearX
                        cpy += dripY
                        sy = clamp(1.0 + (dripY / Math.max(1.0, lineSpanH)) * 0.85, 0.85, 1.95)
                    } else if (l3Mode === 4) {
                        // Mode 4: Swarm Flocking Vortex
                        var flockAmt = (0.18 + state.midSmooth * 0.26) * warpIntensity
                        cpx += Math.sin(l3T * 2.2 * evoFreq + charPhase) * charStep * 1.35 * flockAmt
                        cpy += Math.cos(l3T * 1.8 * evoFreq + charPhase * 1.3) * lineSpanH * 0.72 * flockAmt
                        rot = Math.sin(l3T * 2.6 + charPhase) * 0.22 * flockAmt
                    } else if (l3Mode === 5) {
                        // Mode 5: Omarchy TTE Keyframe Morph
                        var tteBeam = Math.sin(hxNorm * 3.6 - l3T * 3.2 * evoFreq + rowIdx * 0.9)
                        cpy += tteBeam * lineSpanH * 0.28 * warpIntensity
                        sx = clamp(1.0 + Math.max(0.0, tteBeam) * 0.36 * warpIntensity, 0.75, 1.65)
                        sy = sx
                    } else if (l3Mode === 6) {
                        var bin6 = clamp(Math.floor(((hxNorm + 1.0) * 0.5) * 63), 0, 63)
                        var fft6 = state.smoothBands[bin6] || 0.0
                        sy = clamp(1.0 + (fft6 * 0.85 + state.bassSmooth * 0.35) * warpIntensity * 0.55, 0.80, 2.25)
                        var waveY = Math.sin(hxNorm * 4.2 * evoFreq - l3T * 2.6) * lineSpanH * 0.42 * warpIntensity
                        var waveX = Math.sin(hyNorm * 3.5 + l3T * 2.1) * charStep * 0.35 * warpIntensity
                        cpx += waveX
                        cpy += waveY
                        rot = Math.cos(hxNorm * 4.2 * evoFreq - l3T * 2.6) * 0.14 * warpIntensity
                    } else if (l3Mode === 7) {
                        // Mode 7: True 360° Revolving 3D Cylinder Banner (0: L→R, 1: R→L, 2: U→D, 3: D→U, 4: 360° Spin CW, 5: 360° Spin CCW)
                        // Centred at z = 0 with a permanent 3D perspective camera tilt so the circular cross-section projects as a clear
                        // 3D ellipse — words sweep across the closer lower/front arc and wrap 360° around the farther upper/back arc!
                        var cylR = 1.08 + state.bassSmooth * 0.18 * warpIntensity
                        var cylProjScale = Math.max(w * 0.34, rowHalfW)
                        if (cylDir < 2) {
                            // Horizontal 360°+ revolution around vertical Y-axis cylinder (0 = L→R, 1 = R→L)
                            var hSign = (cylDir === 1) ? -1.0 : 1.0
                            var wordOrbitAngle = hSign * l3T * 1.55 * evoFreq + rowIdx * 0.36
                            var cylAng = hxNorm * (Math.PI * 0.90) + wordOrbitAngle
                            var cosA = Math.cos(cylAng), sinA = Math.sin(cylAng)
                            var camPitch = -0.44 - Math.sin(l3T * 0.35) * 0.10
                            var cylRoll = Math.sin(l3T * 0.55 * evoFreq) * 0.18 * hSign
                            var projC = project3DPoint(
                                sinA * cylR,
                                hyNorm * 0.58,
                                cosA * cylR * 0.92,
                                camPitch, 0.0, cylRoll,
                                cx, cy, cylProjScale, 3.0
                            )
                            var projPrev = project3DPoint(
                                Math.sin(cylAng - 0.09) * cylR,
                                hyNorm * 0.58,
                                Math.cos(cylAng - 0.09) * cylR * 0.92,
                                camPitch, 0.0, cylRoll,
                                cx, cy, cylProjScale, 3.0
                            )
                            var projNext = project3DPoint(
                                Math.sin(cylAng + 0.09) * cylR,
                                hyNorm * 0.58,
                                Math.cos(cylAng + 0.09) * cylR * 0.92,
                                camPitch, 0.0, cylRoll,
                                cx, cy, cylProjScale, 3.0
                            )
                            cpx = projC.x
                            cpy = projC.y
                            var dX = projNext.x - projPrev.x
                            var dY = projNext.y - projPrev.y
                            rot = Math.atan2(dY, Math.abs(dX) + 0.001) * (cosA >= 0.0 ? 1.0 : -1.0)
                            var magSX = clamp(Math.max(0.20, Math.abs(cosA)) * projC.persp * 1.22, 0.20, 1.98)
                            sx = (cosA >= 0.0 ? 1.0 : -1.0) * magSX
                            sy = clamp(projC.persp * 1.15, 0.52, 1.95)
                            cylDepthAlpha = 0.26 + 0.74 * (0.5 + 0.5 * cosA)
                        } else if (cylDir < 4) {
                            // Vertical 360°+ revolution around horizontal X-axis cylinder / drum (2 = U→D, 3 = D→U)
                            var vSign = (cylDir === 3) ? -1.0 : 1.0
                            var drumOrbitAngle = vSign * l3T * 1.55 * evoFreq
                            var drumAng = hyNorm * (Math.PI * 0.82) + drumOrbitAngle + hxNorm * 0.22 * warpIntensity
                            var cosD = Math.cos(drumAng), sinD = Math.sin(drumAng)
                            var camYaw = 0.44 + Math.cos(l3T * 0.35) * 0.10
                            var drumRoll = Math.cos(l3T * 0.52 * evoFreq) * 0.16 * vSign
                            var projD = project3DPoint(
                                hxNorm * 0.94,
                                sinD * cylR * 0.72,
                                cosD * cylR * 0.92,
                                0.0, camYaw, drumRoll,
                                cx, cy, cylProjScale, 3.0
                            )
                            cpx = projD.x
                            cpy = projD.y
                            rot = drumRoll + sinD * 0.14
                            sx = clamp(projD.persp * 1.15, 0.52, 1.95)
                            var magSY = clamp(Math.max(0.20, Math.abs(cosD)) * projD.persp * 1.22, 0.20, 1.98)
                            sy = (cosD >= 0.0 ? 1.0 : -1.0) * magSY
                            cylDepthAlpha = 0.26 + 0.74 * (0.5 + 0.5 * cosD)
                        } else {
                            // 4 = 360° Spin CW, 5 = 360° Spin CCW: Full 360° cylinder orbit + 360° multi-revolution gyro spin
                            var spinSign7 = (cylDir === 5) ? -1.0 : 1.0
                            var orbit7 = spinSign7 * l3T * 1.55 * evoFreq + rowIdx * 0.32
                            var cylAng7 = hxNorm * (Math.PI * 0.88) + orbit7
                            var cos7 = Math.cos(cylAng7), sin7 = Math.sin(cylAng7)
                            var fullSpin7 = l3T * 1.25 * evoFreq * spinSign7
                            var gyroYaw7 = l3T * 0.95 * evoFreq * spinSign7
                            var gyroPitch7 = -0.42 + Math.sin(l3T * 0.55 * evoFreq) * 0.38
                            var projS7 = project3DPoint(
                                sin7 * cylR,
                                hyNorm * 0.58,
                                cos7 * cylR * 0.92,
                                gyroPitch7, gyroYaw7, fullSpin7,
                                cx, cy, cylProjScale, 3.0
                            )
                            var projL7 = project3DPoint(Math.sin(cylAng7 - 0.08) * cylR, hyNorm * 0.58, Math.cos(cylAng7 - 0.08) * cylR * 0.92, gyroPitch7, gyroYaw7, fullSpin7, cx, cy, cylProjScale, 3.0)
                            var projR7 = project3DPoint(Math.sin(cylAng7 + 0.08) * cylR, hyNorm * 0.58, Math.cos(cylAng7 + 0.08) * cylR * 0.92, gyroPitch7, gyroYaw7, fullSpin7, cx, cy, cylProjScale, 3.0)
                            cpx = projS7.x
                            cpy = projS7.y
                            rot = Math.atan2(projR7.y - projL7.y, projR7.x - projL7.x)
                            sx = clamp(Math.max(0.24, Math.abs(cos7)) * projS7.persp * 1.20, 0.24, 1.98)
                            sy = clamp(projS7.persp * 1.15, 0.50, 1.95)
                            cylDepthAlpha = clamp(0.28 + 0.72 * ((projS7.z / Math.max(0.5, cylR)) * 0.5 + 0.5), 0.24, 1.0)
                        }
                    } else if (l3Mode === 8) {
                        var accB = Math.sin(l3T * 2.4) * (0.35 + state.bassSmooth * 0.55) * warpIntensity
                        sx = clamp(1.0 + accB * 0.42 + Math.cos(hyNorm * Math.PI * evoFreq + l3T * 1.8) * 0.18 * warpIntensity, 0.55, 1.72)
                        sy = clamp(1.0 - accB * 0.30 + (0.25 + state.midSmooth * 0.55) * Math.cos(hxNorm * Math.PI * 1.5 - l3T * 2.1) * 0.38 * warpIntensity, 0.62, 1.92)
                        cpx = cx + (ci - (nCh - 1) * 0.5) * charStep * sx
                        cpy = cy + (rowIdx - (displayLines.length - 1) * 0.5) * lineSpanH * sy
                    } else if (l3Mode === 9) {
                        // Mode 9: 3D Perspective Crawl & 360°+ Whole-Word Gyro Spin
                        var dirSign9 = (cylDir === 1 || cylDir === 3 || cylDir === 5) ? -1.0 : 1.0
                        var spinYaw9 = l3T * 1.15 * evoFreq * dirSign9
                        var spinPitch9 = Math.sin(l3T * 0.55) * 0.45 + ((cylDir === 2 || cylDir === 3) ? l3T * 1.05 * evoFreq * dirSign9 : 0.0)
                        var spinRoll9 = l3T * 0.68 * evoFreq * dirSign9
                        var zW9 = Math.sin(hxNorm * 3.0 - l3T * 2.3) * (0.14 + state.bassSmooth * 0.20) * warpIntensity
                        var scale9 = Math.max(w * 0.36, rowHalfW)
                        var projP = project3DPoint(
                            hxNorm * 0.96,
                            hyNorm * 0.68,
                            zW9,
                            spinPitch9,
                            spinYaw9,
                            spinRoll9,
                            cx, cy, scale9, 2.8
                        )
                        var projL9 = project3DPoint(-0.5, hyNorm * 0.68, 0.0, spinPitch9, spinYaw9, spinRoll9, cx, cy, scale9, 2.8)
                        var projR9 = project3DPoint(0.5, hyNorm * 0.68, 0.0, spinPitch9, spinYaw9, spinRoll9, cx, cy, scale9, 2.8)
                        var projectedWordAngle9 = Math.atan2(projR9.y - projL9.y, projR9.x - projL9.x)
                        cpx = projP.x
                        cpy = projP.y
                        rot = projectedWordAngle9
                        sx = clamp(projP.persp * 1.12, 0.52, 1.95)
                        sy = sx
                    } else if (l3Mode === 10) {
                        var br10 = Math.sin(hxNorm * 3.0 + l3T * 1.8) * lineSpanH * 0.12 * warpIntensity
                        var chrOff = isEchoT ? ((te % 2 === 1 ? 1.0 : -1.0) * (5.0 + state.bassSmooth * 16.0) * warpIntensity) : 0.0
                        cpx += chrOff
                        cpy = cy - totalTextH * 0.22 + (rowIdx - (displayLines.length - 1) * 0.5) * lineSpanH * 0.88 + br10
                    } else if (l3Mode === 11) {
                        var wx = hxNorm, wy = hyNorm, mag = 1.0
                        var dxA = wx - lens1X, dyA = (wy - lens1Y) * 0.75
                        var dA = Math.sqrt(dxA * dxA + dyA * dyA)
                        if (dA < lensRad && dA > 0.0001) {
                            var uA = 1.0 - dA / lensRad
                            var bA = uA * uA * (0.46 + state.bassSmooth * 0.52) * warpIntensity
                            wx += (dxA / dA) * bA * 0.26
                            wy += (dyA / dA) * bA * 0.34
                            mag += bA * 1.18
                        }
                        var dxB = wx - lens2X, dyB = (wy - lens2Y) * 0.75
                        var dB = Math.sqrt(dxB * dxB + dyB * dyB)
                        if (dB < lensRad && dB > 0.0001) {
                            var uB = 1.0 - dB / lensRad
                            var bB = uB * uB * (0.42 + state.midSmooth * 0.48) * warpIntensity
                            wx += (dxB / dB) * bB * 0.22
                            wy += (dyB / dB) * bB * 0.30
                            mag += bB * 0.96
                        }
                        cpx = cx + wx * rowHalfW
                        cpy = cy + wy * totalTextH * 0.85
                        sx = clamp(mag, 0.85, 2.30)
                        sy = sx
                    }

                    // Style-specific per-character kinetic modulation
                    if (textStyle === 1) {
                        // Style 1: Psychedelic Liquid harmonic wave undulation & breathing scale
                        cpy += Math.sin(ci * 0.65 - l3T * 3.1 + rowIdx) * rowFontPx * 0.14
                        rot += Math.cos(ci * 0.55 - l3T * 2.4) * 0.09
                        sx *= (1.0 + Math.sin(l3T * 2.8 + ci * 0.4) * 0.10)
                        sy *= (1.0 + Math.cos(l3T * 2.8 + ci * 0.4) * 0.12)
                    } else if (textStyle === 5) {
                        // Style 5: Acid Glitch IDM beat-triggered horizontal slice shear
                        var glitchTrig = Math.sin(ci * 3.7 + Math.floor(l3T * 14.0) * 1.9 + rowIdx * 2.3)
                        if (glitchTrig > 0.52) {
                            cpx += (glitchTrig > 0.76 ? 1.0 : -1.0) * (3.5 + state.beatPulse * rowFontPx * 0.34)
                            cpy += (ci & 1 ? -1.0 : 1.0) * (2.0 + state.high * 4.5)
                        }
                    } else if (textStyle === 9) {
                        // Style 9: Oscilloscope Vector Beam high-frequency FFT vertical deflection
                        var oscBin = (ci * 5 + rowIdx * 13) & 63
                        cpy += ((state.smoothBands[oscBin] || 0.0) - 0.35) * rowFontPx * 0.24
                    } else if (textStyle === 11) {
                        // Style 11: Plasma Arc Tesla high-voltage micro-jitter on beat peaks
                        cpx += Math.sin(l3T * 32.0 + ci * 4.1) * (1.2 + state.beatPulse * 4.5)
                        cpy += Math.cos(l3T * 29.0 + ci * 5.3) * (1.2 + state.high * 4.0)
                    } else if (textStyle === 12) {
                        // Style 12: Y2K Iridescent Mercury anti-gravity float & liquid-chrome stretch
                        cpy += Math.sin(l3T * 2.2 + ci * 0.55 + rowIdx) * rowFontPx * 0.12
                        sx *= 1.0 + Math.sin(l3T * 3.0 + ci * 0.7) * 0.11
                        sy *= 1.0 - Math.sin(l3T * 3.0 + ci * 0.7) * 0.08
                    } else if (textStyle === 13) {
                        // Style 13: Demoscene Copperbars classic Amiga sine-scroller bounce
                        cpy += Math.abs(Math.sin(l3T * 3.6 + ci * 0.48 + rowIdx * 0.9)) * (-rowFontPx * 0.22)
                    } else if (textStyle === 14) {
                        // Style 14: Bioluminescent Mycelium organic breathing pulse
                        var bioPulse = 1.0 + Math.sin(l3T * 2.5 + ci * 0.8) * (0.08 + state.midSmooth * 0.12)
                        sx *= bioPulse
                        sy *= bioPulse
                    }

                    var palLen = Math.max(1, activeStylePal.length)
                    var hueStep = Math.floor(state.hueShift / 42)
                    var bValCh = state.smoothBands[((ci * 5 + rowIdx * 11) & 63)] || 0.0
                    var colCh, colAlt, colAcc
                    if (colourMode === 1) {
                        // 1: Line Palette (Global Palette coloured line-by-line with contrast & hue-separation boost)
                        var lineAnchorIdx = (te + hueStep) % palLen
                        var lineIdx = (rowIdx * 2 + te + hueStep) % palLen
                        var lineTriad = deriveDistinctTypographyTriad(activeStylePal, lineIdx, rowIdx, lineAnchorIdx)
                        colCh = lineTriad.colCh
                        colAlt = lineTriad.colAlt
                        colAcc = lineTriad.colAcc
                    } else if (colourMode === 2) {
                        // 2: Duotone Contrast (Ice-white lead line + contrast-boosted global palette rims & sub-lines)
                        var duoAnchorIdx = (te + hueStep) % palLen
                        var duoIdx = (rowIdx * 2 + te + hueStep) % palLen
                        var duoTriad = deriveDistinctTypographyTriad(activeStylePal, duoIdx, rowIdx, duoAnchorIdx)
                        colCh = (rowIdx === 0 && !isEchoT) ? "#F8FAFC" : duoTriad.colCh
                        colAlt = duoTriad.colAlt
                        colAcc = duoTriad.colAcc
                    } else if (colourMode === 3) {
                        // 3: Audio Spectrum (EQ frequency-driven colour per line & character bin)
                        var eqHue = (state.hueShift + rowIdx * 68 + bValCh * 140 + state.bassSmooth * 52) % 360
                        colCh = hslToHex(eqHue, 0.96, clamp(0.55 + bValCh * 0.22, 0.48, 0.80))
                        colAlt = hslToHex((eqHue + 75) % 360, 0.92, 0.56)
                        colAcc = hslToHex((eqHue + 165) % 360, 0.95, 0.66)
                    } else if (colourMode === 4) {
                        // 4: Prism Wave (Smooth horizontal gradient sweep across each word & tracer echo)
                        var prismFrac = nCh > 1 ? (ci / (nCh - 1)) : 0.0
                        var prismHue = (state.hueShift + prismFrac * 180 + rowIdx * 55 + te * 32 + l3T * 36) % 360
                        colCh = hslToHex(prismHue, 0.96, 0.60)
                        colAlt = hslToHex((prismHue + 90) % 360, 0.92, 0.55)
                        colAcc = hslToHex((prismHue + 180) % 360, 0.95, 0.66)
                    } else if (colourMode === 5) {
                        // 5: Letter Alternate (Global Palette per letter with hue-separation boost)
                        var letAnchorIdx = (rowIdx * 2 + te + Math.floor(state.hueShift / 40)) % palLen
                        var letIdx = (ci + rowIdx * 2 + te + Math.floor(state.hueShift / 40)) % palLen
                        var letTriad = deriveDistinctTypographyTriad(activeStylePal, letIdx, (ci + rowIdx) % 4, letAnchorIdx)
                        colCh = letTriad.colCh
                        colAlt = letTriad.colAlt
                        colAcc = letTriad.colAcc
                    } else {
                        // 0: Style Signature (default — uses each typography style's curated 6-colour palette)
                        var palIdx = (ci + rowIdx * 2 + te + Math.floor(state.hueShift / 40)) % palLen
                        colCh = activeStylePal[palIdx]
                        colAlt = activeStylePal[(palIdx + 2) % palLen]
                        colAcc = activeStylePal[(palIdx + 4) % palLen]
                    }
                    var useSigCols = (colourMode === 0)

                    ctx.save()
                    ctx.globalAlpha = clamp(passAlphaT * cylDepthAlpha, 0.06, 1.0)
                    ctx.translate(cpx, cpy)
                    if (rot !== 0.0) ctx.rotate(rot)
                    ctx.scale(sx, sy)
                    var hasStrokeText = (typeof ctx.strokeText === "function")

                    if (textStyle === 0) {
                        // 0: Cyber Techno — dual-bevel dark + neon laser rim + crisp cyber fill
                        if (!isEchoT && hasStrokeText) {
                            ctx.lineWidth = Math.max(3.5, rowFontPx * 0.20)
                            ctx.strokeStyle = "rgba(4, 6, 14, 0.94)"
                            ctx.strokeText(ch, 0, 0)
                            ctx.lineWidth = Math.max(1.6, rowFontPx * 0.08)
                            ctx.strokeStyle = useSigCols ? ((rowIdx === 0) ? "#00F5FF" : "#FF1493") : colAlt
                            ctx.strokeText(ch, 1.2, -1.2)
                        }
                        ctx.fillStyle = (rowIdx === 0 && (ci === 0 || ci === nCh - 1)) ? (useSigCols ? "#FF1493" : colAcc) : colCh
                        ctx.fillText(ch, 0, 0)
                    } else if (textStyle === 1) {
                        // 1: Psychedelic Liquid — concentric multi-ring rainbow prism aura halos + solarised fill
                        if (!isEchoT && hasStrokeText) {
                            ctx.lineWidth = Math.max(5.0, rowFontPx * 0.28)
                            ctx.strokeStyle = colourWithAlpha(colAlt, 0.58 + state.bassSmooth * 0.32)
                            ctx.strokeText(ch, 0, 0)
                            ctx.lineWidth = Math.max(2.2, rowFontPx * 0.12)
                            ctx.strokeStyle = "rgba(10, 3, 22, 0.88)"
                            ctx.strokeText(ch, 0, 0)
                        }
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                    } else if (textStyle === 2) {
                        // 2: Rave Laser Stencil — wide RGB chromatic anaglyph split + hollow high-voltage neon vector outline
                        var laserSplit = (2.2 + state.bassSmooth * 6.5 + state.beatPulse * 5.0)
                        if (!isEchoT && hasStrokeText) {
                            ctx.lineWidth = Math.max(1.8, rowFontPx * 0.09)
                            ctx.strokeStyle = useSigCols ? "rgba(255, 0, 85, 0.78)" : colourWithAlpha(colAlt, 0.78)
                            ctx.strokeText(ch, -laserSplit, 0)
                            ctx.strokeStyle = useSigCols ? "rgba(0, 255, 204, 0.78)" : colourWithAlpha(colAcc, 0.78)
                            ctx.strokeText(ch, laserSplit, 0)
                        }
                        ctx.fillStyle = "rgba(5, 8, 14, 0.86)"
                        ctx.fillText(ch, 0, 0)
                        if (hasStrokeText) {
                            ctx.lineWidth = Math.max(2.0, rowFontPx * 0.11)
                            ctx.strokeStyle = colCh
                            ctx.strokeText(ch, 0, 0)
                        }
                    } else if (textStyle === 3) {
                        // 3: Dance Chrome — 3D extruded shadow + neon rim + metallic chrome + specular horizon bar
                        if (!isEchoT) {
                            ctx.fillStyle = "#090418"
                            ctx.fillText(ch, rowFontPx * 0.08, rowFontPx * 0.09)
                            if (hasStrokeText) {
                                ctx.lineWidth = Math.max(3.0, rowFontPx * 0.16)
                                ctx.strokeStyle = colAlt
                                ctx.strokeText(ch, 0, 0)
                            }
                        }
                        ctx.fillStyle = useSigCols ? ((rowIdx === 0) ? "#E8F7FF" : colCh) : colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT) {
                            ctx.fillStyle = "rgba(255, 255, 255, 0.88)"
                            ctx.fillRect(-rowFontPx * 0.28, -rowFontPx * 0.07, rowFontPx * 0.56, Math.max(2.0, rowFontPx * 0.08))
                        }
                    } else if (textStyle === 4) {
                        // 4: Club LED Wall — dark SMD LED cabinet matrix cell + high-intensity stage LED bloom
                        if (!isEchoT) {
                            var cellBoxW = charStep * 0.90
                            var cellBoxH = rowFontPx * 1.04
                            ctx.fillStyle = "rgba(4, 9, 18, 0.84)"
                            ctx.fillRect(-cellBoxW * 0.5, -cellBoxH * 0.5, cellBoxW, cellBoxH)
                            ctx.lineWidth = 1.0
                            ctx.strokeStyle = colourWithAlpha(colCh, 0.42)
                            if (typeof ctx.strokeRect === "function") ctx.strokeRect(-cellBoxW * 0.5, -cellBoxH * 0.5, cellBoxW, cellBoxH)
                        }
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT && state.beatPulse > 0.25) {
                            ctx.fillStyle = "rgba(255, 255, 255, 0.70)"
                            ctx.fillText(ch, 0, 0)
                        }
                    } else if (textStyle === 5) {
                        // 5: Acid Glitch IDM — inverted strobe block accents + sharp glitch typography
                        var isStrobeCell = (!isEchoT && Math.sin(ci * 2.9 + Math.floor(l3T * 12.0)) > 0.62)
                        if (isStrobeCell) {
                            var stW = charStep * 0.94
                            var stH = rowFontPx * 1.06
                            ctx.fillStyle = colCh
                            ctx.fillRect(-stW * 0.5, -stH * 0.5, stW, stH)
                            ctx.fillStyle = "#05060A"
                            ctx.fillText(ch, 0, 0)
                        } else {
                            if (!isEchoT && hasStrokeText) {
                                ctx.lineWidth = Math.max(2.5, rowFontPx * 0.14)
                                ctx.strokeStyle = "rgba(5, 6, 10, 0.92)"
                                ctx.strokeText(ch, 0, 0)
                            }
                            ctx.fillStyle = colCh
                            ctx.fillText(ch, 0, 0)
                        }
                    } else if (textStyle === 6) {
                        // 6: Psytrance UV Glow — deep ultraviolet & electric cyan phosphorescent multi-halo bloom
                        if (hasStrokeText) {
                            ctx.lineWidth = Math.max(4.5, rowFontPx * 0.26)
                            ctx.strokeStyle = colourWithAlpha(useSigCols ? "#7209B7" : colAcc, 0.72)
                            ctx.strokeText(ch, 0, 0)
                            if (!isEchoT) {
                                ctx.lineWidth = Math.max(2.2, rowFontPx * 0.12)
                                ctx.strokeStyle = useSigCols ? "#00FFFF" : colAlt
                                ctx.strokeText(ch, 0, 0)
                            }
                        }
                        ctx.fillStyle = (rowIdx === 0 && (ci === 0 || ci === nCh - 1)) ? (useSigCols ? "#FFD700" : colAcc) : colCh
                        ctx.fillText(ch, 0, 0)
                    } else if (textStyle === 7) {
                        // 7: Berlin Brutalist — monumental heavy block cutout / stark industrial stencil
                        if (rowIdx === 0 && !isEchoT && (l3Mode === 1 || l3Mode === 5 || l3Mode === 6 || l3Mode === 8 || l3Mode === 10)) {
                            ctx.fillStyle = "#060609"
                            ctx.fillText(ch, 0, 0)
                        } else {
                            if (!isEchoT && hasStrokeText) {
                                ctx.lineWidth = Math.max(3.5, rowFontPx * 0.18)
                                ctx.strokeStyle = "#060609"
                                ctx.strokeText(ch, 0, 0)
                            }
                            ctx.fillStyle = useSigCols ? ((rowIdx === 0) ? "#F4F4F6" : "#FF1E38") : colCh
                            ctx.fillText(ch, 0, 0)
                        }
                    } else if (textStyle === 8) {
                        // 8: Holographic Sci-Fi HUD — phase-shifted hologram ghost + cyan/emerald HUD reticle glyph + telemetry tick
                        var holoShift = (1.8 + state.beatPulse * 3.8) * Math.sin(l3T * 9.0 + ci)
                        ctx.fillStyle = useSigCols ? "rgba(0, 180, 216, 0.42)" : colourWithAlpha(colAlt, 0.42)
                        ctx.fillText(ch, holoShift, -1.6)
                        if (!isEchoT && hasStrokeText) {
                            ctx.lineWidth = Math.max(1.8, rowFontPx * 0.09)
                            ctx.strokeStyle = useSigCols ? "#00FFD5" : colAlt
                            ctx.strokeText(ch, 0, 0)
                        }
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT) {
                            ctx.fillStyle = useSigCols ? "#00FFD5" : colAcc
                            ctx.fillRect(-charStep * 0.34, rowFontPx * 0.46, charStep * 0.68, 2.0)
                        }
                    } else if (textStyle === 9) {
                        // 9: Oscilloscope Vector Beam — Tektronix green/cyan phosphor outer bloom + crisp vector stroke + CRT vertex dots
                        if (hasStrokeText) {
                            ctx.lineWidth = Math.max(4.2, rowFontPx * 0.22)
                            ctx.strokeStyle = useSigCols ? "rgba(0, 255, 102, 0.34)" : colourWithAlpha(colAlt, 0.38)
                            ctx.strokeText(ch, 0, 0)
                            ctx.lineWidth = Math.max(1.5, rowFontPx * 0.08)
                            ctx.strokeStyle = useSigCols ? "#CCFFDD" : colCh
                            ctx.strokeText(ch, 0, 0)
                        }
                        ctx.fillStyle = "rgba(4, 24, 14, 0.72)"
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT) {
                            ctx.fillStyle = useSigCols ? "#FFFFFF" : colAcc
                            ctx.fillRect(-1.8, -rowFontPx * 0.42, 3.6, 3.6)
                            ctx.fillRect(-1.8, rowFontPx * 0.38, 3.6, 3.6)
                        }
                    } else if (textStyle === 10) {
                        // 10: 3D Isometric Extrude — 5-step deep isometric block extrusion receding toward audio-reactive vanishing angle
                        var isoDX = (1.6 + state.bassSmooth * 1.4) * Math.cos(l3T * 0.9)
                        var isoDY = (1.6 + state.bassSmooth * 1.4) * Math.sin(l3T * 0.9) + 1.2
                        if (!isEchoT) {
                            var isoCols = useSigCols
                                ? ["#1E0B36", "#5A189A", "#9B5DE5", "#F15BB5"]
                                : [colourWithAlpha(colAcc, 0.45), colourWithAlpha(colAcc, 0.70), colAcc, colAlt]
                            for (var stp = 4; stp >= 1; stp--) {
                                ctx.fillStyle = isoCols[4 - stp]
                                ctx.fillText(ch, isoDX * stp, isoDY * stp)
                            }
                            if (hasStrokeText) {
                                ctx.lineWidth = Math.max(2.6, rowFontPx * 0.14)
                                ctx.strokeStyle = "#080714"
                                ctx.strokeText(ch, 0, 0)
                            }
                        }
                        ctx.fillStyle = useSigCols ? ((rowIdx === 0) ? "#00F5D4" : colCh) : colCh
                        ctx.fillText(ch, 0, 0)
                    } else if (textStyle === 11) {
                        // 11: Plasma Arc Tesla — violet/cyan high-voltage corona discharge + white-hot ionised core
                        if (hasStrokeText) {
                            ctx.lineWidth = Math.max(5.0, rowFontPx * 0.28)
                            ctx.strokeStyle = colourWithAlpha(useSigCols ? "#B5179E" : colAcc, 0.56 + state.beatPulse * 0.34)
                            ctx.strokeText(ch, 0, 0)
                            ctx.lineWidth = Math.max(2.4, rowFontPx * 0.12)
                            ctx.strokeStyle = useSigCols ? "#7DF9FF" : colAlt
                            ctx.strokeText(ch, 0, 0)
                        }
                        ctx.fillStyle = useSigCols ? "#FFFFFF" : colCh
                        ctx.fillText(ch, 0, 0)
                    } else if (textStyle === 12) {
                        // 12: Y2K Iridescent Mercury — liquid-metal pearlescent triple rim + star specular glint
                        if (!isEchoT && hasStrokeText) {
                            ctx.lineWidth = Math.max(4.6, rowFontPx * 0.24)
                            ctx.strokeStyle = useSigCols ? "#F472B6" : colAcc
                            ctx.strokeText(ch, -1.2, 1.2)
                            ctx.lineWidth = Math.max(2.6, rowFontPx * 0.14)
                            ctx.strokeStyle = useSigCols ? "#67E8F9" : colAlt
                            ctx.strokeText(ch, 1.0, -1.0)
                        }
                        ctx.fillStyle = useSigCols ? "#F8FAFC" : colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT && ((ci + Math.floor(l3T * 4.0)) % 4 === 0)) {
                            var glintR = Math.max(3.5, rowFontPx * 0.18) * (0.7 + state.beatPulse * 0.6)
                            ctx.fillStyle = "#FFFFFF"
                            ctx.fillRect(-glintR, -rowFontPx * 0.34 - 1.0, glintR * 2.0, 2.0)
                            ctx.fillRect(-1.0, -rowFontPx * 0.34 - glintR, 2.0, glintR * 2.0)
                        }
                    } else if (textStyle === 13) {
                        // 13: Demoscene Copperbars — Amiga raster-bar silhouette shadow + crisp copper-lit glyph
                        if (!isEchoT) {
                            ctx.fillStyle = "#080412"
                            ctx.fillText(ch, 2.6, 2.8)
                            if (hasStrokeText) {
                                ctx.lineWidth = Math.max(2.8, rowFontPx * 0.15)
                                ctx.strokeStyle = "#120624"
                                ctx.strokeText(ch, 0, 0)
                            }
                        }
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT) {
                            ctx.fillStyle = "rgba(255, 255, 255, 0.78)"
                            ctx.fillRect(-charStep * 0.32, -rowFontPx * 0.16, charStep * 0.64, Math.max(2.0, rowFontPx * 0.08))
                        }
                    } else if (textStyle === 14) {
                        // 14: Bioluminescent Mycelium — deep-sea bioluminescent halo + drifting glowing spore nodes
                        if (hasStrokeText) {
                            ctx.lineWidth = Math.max(4.4, rowFontPx * 0.24)
                            ctx.strokeStyle = colourWithAlpha(colAlt, 0.52 + state.midSmooth * 0.34)
                            ctx.strokeText(ch, 0, 0)
                        }
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT) {
                            var spX = Math.cos(l3T * 2.7 + ci * 1.9) * charStep * 0.42
                            var spY = Math.sin(l3T * 3.1 + ci * 2.3) * rowFontPx * 0.44
                            ctx.fillStyle = useSigCols ? "#FDE047" : colAcc
                            ctx.fillRect(spX - 2.2, spY - 2.2, 4.4, 4.4)
                        }
                    } else {
                        // 15: Quantum Matrix Datastream — vertical cascading telemetry ticks + beat-triggered decrypt glyph + phosphor core
                        if (!isEchoT) {
                            ctx.fillStyle = useSigCols ? "rgba(16, 185, 129, 0.34)" : colourWithAlpha(colAlt, 0.36)
                            for (var qk = -2; qk <= 2; qk++) {
                                var qy = ((qk * 0.28 + (l3T * 1.6 + ci * 0.23) % 1.0) - 0.5) * rowFontPx * 1.25
                                ctx.fillRect(-2.0, qy, 4.0, Math.max(2.5, rowFontPx * 0.10))
                            }
                            if (hasStrokeText) {
                                ctx.lineWidth = Math.max(2.6, rowFontPx * 0.14)
                                ctx.strokeStyle = "rgba(2, 22, 16, 0.92)"
                                ctx.strokeText(ch, 0, 0)
                            }
                        }
                        var qGlyph = (!isEchoT && state.beatPulse > 0.55 && ((ci + Math.floor(l3T * 18.0)) % 5 === 0))
                            ? String.fromCharCode(0x30A2 + ((ci * 7 + Math.floor(l3T * 20.0)) % 42))
                            : ch
                        ctx.fillStyle = (qGlyph !== ch) ? (useSigCols ? "#FFD166" : colAcc) : colCh
                        ctx.fillText(qGlyph, 0, 0)
                    }
                    ctx.restore()

                    if (l3Mode === 10 && !isEchoT) {
                        ctx.save()
                        var reflRip = Math.sin(ci * 0.7 + l3T * 5.2) * (4.0 + state.bassSmooth * 10.0) * warpIntensity
                        ctx.translate(cpx + reflRip, cy + totalTextH * 0.52 + (displayLines.length - 1 - rowIdx) * lineSpanH * 0.52)
                        ctx.scale(sx, -sy * 0.55)
                        ctx.globalAlpha = passAlphaT * 0.38
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                        ctx.restore()
                    }
                }
            }
            ctx.restore()
        }
        ctx.restore()
        return
    }

    if (!effectiveLines || effectiveLines.length === 0) return

    var glyphStyleKey = (isWordsSource ? "words:" : "art:") + (isTextGlyph ? "text" : (isBlockGlyph ? "block" : "braille"))
    rebuildArtCells(state, effectiveLines, glyphStyleKey)
    var cells = state.artCells
    if (!cells || cells.length === 0) return

    var cols = Math.max(16, state.artCols || 60)
    var rows = Math.max(6, state.artRows || 20)

    // Auto-compress/fit boxW and boxH so wide ASCII banners (like 'BASS COMMUNION') fit 100% inside the viewport
    var maxBoxW = w * 0.88 * scale
    var maxBoxH = h * 0.76 * scale
    var cellW = Math.min(maxBoxW / cols, (maxBoxH / rows) * 0.72)
    var cellH = Math.min(maxBoxH / rows, cellW * 1.65)
    var boxW = Math.min(maxBoxW, cellW * cols)
    var boxH = Math.min(maxBoxH, cellH * rows)
    var halfW = boxW * 0.5
    var halfH = boxH * 0.5

    var tileW = Math.max(2.0, cellW * 0.88)
    var tileH = Math.max(2.0, cellH * 0.88)

    // If Mode 5 (Omarchy TTE Keyframe Evolution) and ttfxFrames are available, modulate positions/visibility from current TTE frame
    var activeTtfxFrame = null
    if (l3Mode === 5 && ttfxFrames && ttfxFrames.length > 0) {
        var fPos = (state.t * 3.2 + state.bassSmooth * 1.8) % (ttfxFrames.length * 2)
        var fIdx = Math.floor(fPos >= ttfxFrames.length ? (ttfxFrames.length * 2 - 1 - fPos) : fPos)
        activeTtfxFrame = ttfxFrames[clamp(fIdx, 0, ttfxFrames.length - 1)]
    }

    var numBuckets = 6
    var cellFontPx = Math.max(8, Math.round(Math.min(tileW, tileH) * 1.35))

    for (var e = l3Tracers - 1; e >= 0; e--) {
        var isEcho = (e > 0)
        var u = l3Tracers > 1 ? (e / (l3Tracers - 1)) : 0.0
        var zScale = (tracerDir >= 0)
            ? (1.0 + u * 0.36 * tracerSpeed)
            : (1.0 / (1.0 + u * 0.55 * tracerSpeed))
        var tx = endPt.dx * u * 0.42 * (tracerDir >= 0 ? -1.0 : 1.0)
        var ty = endPt.dy * u * 0.42 * (tracerDir >= 0 ? -1.0 : 1.0)
        var passAlpha = isEcho ? (Math.pow(1.0 - u * 0.82, 1.4) * 0.34) : (0.84 + state.bassSmooth * 0.16)
        var cellStride = isEcho ? (e >= 2 ? numBuckets * 3 : numBuckets * 2) : numBuckets
        if (isTextGlyph && isEcho) cellStride *= 2

        ctx.save()
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = clamp(passAlpha, 0.05, 1.0)
        if (isEcho) {
            ctx.translate(cx + tx, cy + ty)
            ctx.scale(zScale, zScale)
            ctx.translate(-cx, -cy)
        }
        if (isTextGlyph) {
            ctx.font = "900 " + cellFontPx + "px " + activeFontFamily
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
        }

        var lens1X = Math.sin(l3T * 0.88) * 0.66
        var lens1Y = Math.cos(l3T * 1.15) * 0.30
        var lens2X = Math.cos(l3T * 0.64) * 0.66
        var lens2Y = Math.sin(l3T * 0.92) * 0.30
        var lensRad = 0.52 + state.bassSmooth * 0.22

        for (var b = 0; b < numBuckets; b++) {
            var bPalLen = Math.max(1, activeStylePal.length)
            var bHueStep = Math.floor(state.hueShift / 50)
            var col = activeStylePal[(b + e + bHueStep) % bPalLen]
            if (colourMode === 1 || colourMode === 5) {
                var bTriad = deriveDistinctTypographyTriad(activeStylePal, (b + e + bHueStep) % bPalLen, b % 4, (e + bHueStep) % bPalLen)
                col = bTriad.colCh
            } else if (colourMode === 2) {
                var bDuo = deriveDistinctTypographyTriad(activeStylePal, (b + e + bHueStep) % bPalLen, b % 4, (e + bHueStep) % bPalLen)
                col = (b === 0 && !isEcho) ? "#F8FAFC" : bDuo.colCh
            } else if (colourMode === 3) {
                var bEqVal = state.smoothBands[(b * 10) & 63] || 0.0
                var bEqHue = (state.hueShift + b * 55 + bEqVal * 130 + state.bassSmooth * 50) % 360
                col = hslToHex(bEqHue, 0.96, clamp(0.55 + bEqVal * 0.22, 0.48, 0.80))
            } else if (colourMode === 4) {
                var bPrismHue = (state.hueShift + b * 36 + e * 30 + l3T * 36) % 360
                col = hslToHex(bPrismHue, 0.96, 0.60)
            }
            ctx.fillStyle = col
            if (!isTextGlyph) ctx.beginPath()

            for (var i = b; i < cells.length; i += cellStride) {
                var p = cells[i]
                if (l3Mode === 1 && p.alive < 0.42) continue

                var bVal = state.smoothBands[(i * 3) & 63] || 0.0
                var hx = p.homeX !== undefined ? p.homeX : p.x
                var hy = p.homeY !== undefined ? p.homeY : p.y
                var px = cx + p.x * halfW
                var py = cy + p.y * halfH
                var scaleW = 1.0
                var scaleH = 1.0

                if (l3Mode === 6) {
                    var colBin = clamp(Math.floor(((hx + 1.0) * 0.5) * 63), 0, 63)
                    var colFFT = state.smoothBands[colBin] || 0.0
                    var stretchY6 = 1.0 + (colFFT * 0.78 + state.bassSmooth * 0.32) * warpIntensity * 0.52
                    var waveDX6 = Math.sin(hy * 3.8 * evoFreq + l3T * 2.2) * 0.11 * warpIntensity
                    var waveDY6 = Math.sin(hx * 4.2 * evoFreq - l3T * 2.6) * 0.16 * warpIntensity
                                + Math.cos(hx * 8.4 + l3T * 3.4) * 0.06 * state.midSmooth
                    px = cx + (hx + waveDX6) * halfW
                    py = cy + (hy * stretchY6 + waveDY6) * halfH
                    scaleW = 1.06
                    scaleH = clamp(stretchY6, 0.85, 2.15)
                } else if (l3Mode === 7) {
                    var cylRad7 = 1.08 + state.bassSmooth * 0.20 * warpIntensity
                    var yAspect7 = (halfH / Math.max(1.0, halfW))
                    if (cylDir < 2) {
                        var hSign7 = (cylDir === 1) ? -1.0 : 1.0
                        var cylAng7 = hx * (Math.PI * 0.90) + hSign7 * l3T * 1.55 * evoFreq
                        var cos7 = Math.cos(cylAng7), sin7 = Math.sin(cylAng7)
                        var camPitch7B = -0.44 - Math.sin(l3T * 0.35) * 0.10
                        var proj7 = project3DPoint(
                            sin7 * cylRad7,
                            hy * (0.72 + state.midSmooth * 0.20) * yAspect7,
                            cos7 * cylRad7 * 0.92,
                            camPitch7B, 0.0, Math.sin(l3T * 0.55 * evoFreq) * 0.18 * hSign7,
                            cx, cy, halfW * 0.96, 3.0
                        )
                        px = proj7.x
                        py = proj7.y
                        scaleW = clamp(Math.max(0.24, Math.abs(cos7)) * proj7.persp * 1.18, 0.24, 1.95)
                        scaleH = clamp(proj7.persp * 1.14, 0.56, 1.92)
                    } else if (cylDir < 4) {
                        var vSign7 = (cylDir === 3) ? -1.0 : 1.0
                        var drumAng7 = hy * (Math.PI * 0.84) + vSign7 * l3T * 1.55 * evoFreq + hx * 0.20 * warpIntensity
                        var cosD7 = Math.cos(drumAng7), sinD7 = Math.sin(drumAng7)
                        var camYaw7B = 0.44 + Math.cos(l3T * 0.35) * 0.10
                        var projD7 = project3DPoint(
                            hx * 0.94,
                            sinD7 * cylRad7 * yAspect7 * 0.82,
                            cosD7 * cylRad7 * 0.92,
                            0.0, camYaw7B, Math.cos(l3T * 0.52 * evoFreq) * 0.16 * vSign7,
                            cx, cy, halfW * 0.96, 3.0
                        )
                        px = projD7.x
                        py = projD7.y
                        scaleW = clamp(projD7.persp * 1.14, 0.56, 1.92)
                        scaleH = clamp(Math.max(0.24, Math.abs(cosD7)) * projD7.persp * 1.18, 0.24, 1.95)
                    } else {
                        var spinSign7B = (cylDir === 5) ? -1.0 : 1.0
                        var cylAng7S = hx * (Math.PI * 0.88) + spinSign7B * l3T * 1.55 * evoFreq
                        var cos7S = Math.cos(cylAng7S), sin7S = Math.sin(cylAng7S)
                        var fullSpin7B = l3T * 1.25 * evoFreq * spinSign7B
                        var gyroYaw7B = l3T * 0.95 * evoFreq * spinSign7B
                        var gyroPitch7B = -0.42 + Math.sin(l3T * 0.55 * evoFreq) * 0.38
                        var projS7B = project3DPoint(
                            sin7S * cylRad7,
                            hy * yAspect7 * 0.78,
                            cos7S * cylRad7 * 0.92,
                            gyroPitch7B, gyroYaw7B, fullSpin7B,
                            cx, cy, halfW * 0.96, 3.0
                        )
                        px = projS7B.x
                        py = projS7B.y
                        scaleW = clamp(Math.max(0.26, Math.abs(cos7S)) * projS7B.persp * 1.16, 0.26, 1.95)
                        scaleH = clamp(projS7B.persp * 1.14, 0.52, 1.92)
                    }
                } else if (l3Mode === 8) {
                    var accBeat8 = Math.sin(l3T * 2.4) * (0.35 + state.bassSmooth * 0.55) * warpIntensity
                    var stretchX8 = clamp(1.0 + accBeat8 * 0.40 + Math.cos(hy * Math.PI * evoFreq + l3T * 1.8) * 0.18 * warpIntensity, 0.58, 1.65)
                    var stretchY8 = clamp(1.0 - accBeat8 * 0.30 + (0.25 + state.midSmooth * 0.55) * Math.cos(hx * Math.PI * 1.5 - l3T * 2.1) * 0.35 * warpIntensity, 0.62, 1.88)
                    var concX8 = hx * stretchX8 + Math.sin(hx * Math.PI * 2.0 + l3T * 2.0) * 0.06 * warpIntensity
                    var concY8 = hy * stretchY8
                    px = cx + concX8 * halfW
                    py = cy + concY8 * halfH
                    scaleW = stretchX8 * 1.08
                    scaleH = stretchY8 * 1.08
                } else if (l3Mode === 9) {
                    var dirSign9B = (cylDir === 1 || cylDir === 3 || cylDir === 5) ? -1.0 : 1.0
                    var crawlRx9 = Math.sin(l3T * 0.55) * 0.45 + ((cylDir === 2 || cylDir === 3) ? l3T * 1.05 * evoFreq * dirSign9B : 0.0)
                    var crawlRy9 = l3T * 1.15 * evoFreq * dirSign9B
                    var crawlRz9 = l3T * 0.68 * evoFreq * dirSign9B
                    var zWave9 = Math.sin(hx * 3.2 - l3T * 2.4) * (0.16 + state.bassSmooth * 0.22) * warpIntensity
                    var proj9 = project3DPoint(
                        hx * 1.02,
                        hy * (halfH / Math.max(1.0, halfW)) * 0.96,
                        zWave9,
                        crawlRx9, crawlRy9, crawlRz9,
                        cx, cy, halfW * 0.96, 2.8
                    )
                    px = proj9.x
                    py = proj9.y
                    scaleW = clamp(proj9.persp * 1.10, 0.55, 1.95)
                    scaleH = scaleW
                } else if (l3Mode === 10) {
                    var breath10 = Math.sin(hx * 3.0 + l3T * 1.8) * 0.04 * warpIntensity
                    var splitOff = (e > 0) ? ((e % 2 === 1 ? 1.0 : -1.0) * (6.0 + state.bassSmooth * 18.0 + state.beatPulse * 12.0) * warpIntensity) : 0.0
                    px = cx + hx * halfW + splitOff
                    py = cy - halfH * 0.16 + (hy + breath10) * halfH * 0.78
                } else if (l3Mode === 11) {
                    var wx11 = hx
                    var wy11 = hy
                    var mag11 = 1.0
                    var dx1 = wx11 - lens1X, dy1 = (wy11 - lens1Y) * 0.75
                    var d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
                    if (d1 < lensRad && d1 > 0.0001) {
                        var u1 = 1.0 - d1 / lensRad
                        var bulge1 = u1 * u1 * (0.46 + state.bassSmooth * 0.52) * warpIntensity
                        var sw1 = u1 * 0.22 * Math.sin(l3T * 1.6)
                        wx11 += (dx1 / d1) * bulge1 * 0.28 - dy1 * sw1
                        wy11 += (dy1 / d1) * bulge1 * 0.36 + dx1 * sw1
                        mag11 += bulge1 * 1.15
                    }
                    var dx2 = wx11 - lens2X, dy2 = (wy11 - lens2Y) * 0.75
                    var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
                    if (d2 < lensRad && d2 > 0.0001) {
                        var u2 = 1.0 - d2 / lensRad
                        var bulge2 = u2 * u2 * (0.42 + state.midSmooth * 0.48) * warpIntensity
                        wx11 += (dx2 / d2) * bulge2 * 0.24
                        wy11 += (dy2 / d2) * bulge2 * 0.32
                        mag11 += bulge2 * 0.95
                    }
                    px = cx + wx11 * halfW
                    py = cy + wy11 * halfH
                    scaleW = clamp(mag11, 0.85, 2.25)
                    scaleH = scaleW
                } else if (activeTtfxFrame && p.gy < activeTtfxFrame.length) {
                    var tLine = activeTtfxFrame[p.gy] || ""
                    var tCh = p.gx < tLine.length ? tLine.charAt(p.gx) : " "
                    if (tCh === " " || tCh === "⠀") {
                        px += Math.cos(p.phase + state.t * 2.4) * (14.0 + state.bassSmooth * 28.0)
                        py += Math.sin(p.phase - state.t * 2.4) * (14.0 + state.bassSmooth * 28.0)
                    }
                }

                var pulseBoost = 0.82 + p.density * 0.18 + bVal * 0.22
                var szW = tileW * pulseBoost * scaleW
                var szH = tileH * pulseBoost * scaleH

                if (isTextGlyph) {
                    // Crisp readable character rendering for Art · Crisp Text (typographic mosaic)
                    var chCell = textStream.charAt((p.gx + p.gy * 11) % textStream.length)
                    if (chCell === " ") chCell = "★"
                    ctx.fillText(chCell, px, py)
                } else if (isBrailleGlyph) {
                    // Crisp, ultra-fast 2-dot Braille pinpoint rendering for Art · Braille and Words · Braille
                    var mask = p.brailleMask || (((i * 37 + 13) & 0xFF) | 0x09)
                    var dotW = Math.max(1.6, szW * 0.30)
                    var dotH = Math.max(1.6, szH * 0.26)
                    var maxDots = isEcho ? 1 : 2
                    var drawnDots = 0
                    for (var bit = 0; bit < 8; bit++) {
                        if ((mask >> bit) & 1) {
                            var dx = px + BRAILLE_DOT_DX[bit] * szW
                            var dy = py + BRAILLE_DOT_DY[bit] * szH
                            ctx.rect(dx - dotW * 0.5, dy - dotH * 0.5, dotW, dotH)
                            drawnDots++
                            if (drawnDots >= maxDots) break
                        }
                    }
                } else {
                    // Explicit Block glyph rendering (`█ Block`) for both Art · Block and Words · Block
                    if (p.ch === "░" || p.ch === "." || p.ch === "·") {
                        ctx.rect(px - szW * 0.22, py - szH * 0.22, szW * 0.44, szH * 0.44)
                    } else if (p.ch === "▒" || p.ch === ":") {
                        ctx.rect(px - szW * 0.34, py - szH * 0.34, szW * 0.68, szH * 0.68)
                    } else if (p.ch === "▓") {
                        ctx.rect(px - szW * 0.42, py - szH * 0.42, szW * 0.84, szH * 0.84)
                    } else if (p.ch === "▀") {
                        ctx.rect(px - szW * 0.46, py - szH * 0.46, szW * 0.92, szH * 0.48)
                    } else if (p.ch === "▄") {
                        ctx.rect(px - szW * 0.46, py + szH * 0.02, szW * 0.92, szH * 0.48)
                    } else if (p.ch === "▌") {
                        ctx.rect(px - szW * 0.46, py - szH * 0.46, szW * 0.48, szH * 0.92)
                    } else if (p.ch === "▐") {
                        ctx.rect(px + szW * 0.02, py - szH * 0.46, szW * 0.48, szH * 0.92)
                    } else {
                        ctx.rect(px - szW * 0.45, py - szH * 0.45, szW * 0.90, szH * 0.90)
                    }
                }

                // Mode 10 (Chromatic Mirror): Shimmering water-rippled inverted reflection beneath the baseline
                if (l3Mode === 10 && !isEcho && (i & 1) === 0 && !isTextGlyph) {
                    var reflRippleX = Math.sin(hy * 14.0 + l3T * 5.2) * (5.0 + state.bassSmooth * 12.0) * warpIntensity
                    var reflX = px + reflRippleX
                    var reflY = (cy + halfH * 0.66) + (1.0 - hy) * halfH * 0.36
                    ctx.rect(reflX - szW * 0.38, reflY - szH * 0.24, szW * 0.76, szH * 0.48)
                }
            }
            if (!isTextGlyph) ctx.fill()
        }

        // When Art source + Crisp Text (or when Statements is enabled), also render the styled Artist / Track / Album / Statements banners
        if ((isTextGlyph || showStatements) && !isEcho) {
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            var artMaxCh = 10
            for (var ali = 0; ali < textLines.length; ali++) {
                if (textLines[ali].length > artMaxCh) artMaxCh = textLines[ali].length
            }
            var artHeaderPx = Math.floor(clamp((w * 0.72 * scale) / Math.max(10, artMaxCh * 0.64), 18, h * 0.085 * scale))
            var artFontSlope = (textStyle === 1 || textStyle === 3) ? "900 italic " : "900 "
            ctx.font = artFontSlope + artHeaderPx + "px " + activeFontFamily
            var topLineText = (textStyle === 0) ? ("◢ " + textLines[0] + " ◣") : ((textStyle === 6) ? ("❖ " + textLines[0] + " ❖") : textLines[0])
            var topBannerY = Math.max(artHeaderPx * 1.25, cy - halfH - artHeaderPx * 0.65 + Math.sin(l3T * 2.0) * 5.0)
            var topBanPalLen = Math.max(1, activeStylePal.length)
            var topBanHueStep = Math.floor(state.hueShift / 45)
            var topBanTriad = (colourMode === 0)
                ? { colCh: activeStylePal[topBanHueStep % topBanPalLen], colAlt: (textStyle === 6 ? "#7209B7" : "rgba(5, 6, 14, 0.92)") }
                : deriveDistinctTypographyTriad(activeStylePal, topBanHueStep % topBanPalLen, 0, topBanHueStep % topBanPalLen)
            ctx.lineWidth = Math.max(3.5, artHeaderPx * 0.20)
            ctx.strokeStyle = (colourMode === 0) ? topBanTriad.colAlt : "rgba(5, 6, 14, 0.92)"
            if (typeof ctx.strokeText === "function") ctx.strokeText(topLineText, cx, topBannerY)
            ctx.fillStyle = (colourMode === 2) ? "#F8FAFC" : topBanTriad.colCh
            ctx.fillText(topLineText, cx, topBannerY)

            if (textLines.length > 1) {
                var subHeaderPx = Math.max(14, Math.floor(artHeaderPx * 0.78))
                ctx.font = artFontSlope + subHeaderPx + "px " + activeFontFamily
                var botBannerY = Math.min(h - subHeaderPx * 1.2, cy + halfH + subHeaderPx * 0.78 + Math.cos(l3T * 2.0) * 4.0)
                var botLineText = textLines.slice(1).join("  •  ")
                var botBanTriad = (colourMode === 0)
                    ? { colCh: activeStylePal[(2 + topBanHueStep) % topBanPalLen] }
                    : deriveDistinctTypographyTriad(activeStylePal, (2 + topBanHueStep) % topBanPalLen, 1, topBanHueStep % topBanPalLen)
                ctx.lineWidth = Math.max(3.0, subHeaderPx * 0.18)
                ctx.strokeStyle = "rgba(5, 6, 14, 0.92)"
                if (typeof ctx.strokeText === "function") ctx.strokeText(botLineText, cx, botBannerY)
                ctx.fillStyle = botBanTriad.colCh
                ctx.fillText(botLineText, cx, botBannerY)
            }
        }
        ctx.restore()
    }
}

// ---------------------------------------------------------------------------
// Master 4-Layer Composite Frame Renderer
// ---------------------------------------------------------------------------

function normaliseConfig(cfg, mode, asciiLines) {
    var c = cfg || {}
    var pos = Number(c.position) || 0.0
    var dur = Number(c.duration) || 0.0
    var prog = c.trackProgress !== undefined ? Number(c.trackProgress) : (dur > 0 ? clamp(pos / dur, 0.0, 1.0) : 0.0)
    var geomDetail = c.geometryDetail !== undefined ? clamp(Number(c.geometryDetail), 0.50, 2.00) : 1.0
    var l2TrOn = c.layer2TracersEnabled !== undefined ? Boolean(c.layer2TracersEnabled) : true
    var l4On = c.layer4Enabled !== undefined
        ? Boolean(c.layer4Enabled)
        : (c.backdropEnabled !== undefined ? Boolean(c.backdropEnabled) : false)
    var l4ModeRaw = c.layer4Mode !== undefined ? c.layer4Mode : (c.backdropMode !== undefined ? c.backdropMode : 0)
    return {
        playing: c.playing !== undefined ? Boolean(c.playing) : true,
        palette: Number(c.palette) || 0,
        musicDrive: c.musicDrive !== undefined ? Boolean(c.musicDrive) : true,
        geometryDetail: geomDetail,
        audioSensitivity: c.audioSensitivity !== undefined ? clamp(Number(c.audioSensitivity), 0.30, 2.50) : 1.0,
        beatPunch: c.beatPunch !== undefined ? clamp(Number(c.beatPunch), 0.25, 2.00) : 1.0,
        audioSmoothing: c.audioSmoothing !== undefined ? clamp(Number(c.audioSmoothing), 0.20, 0.92) : 0.65,
        colourCycleSpeed: c.colourCycleSpeed !== undefined ? clamp(Number(c.colourCycleSpeed), 0.0, 2.50) : 1.0,
        masterBrightness: c.masterBrightness !== undefined ? clamp(Number(c.masterBrightness), 0.50, 1.50) : 1.0,
        gpuShaderEnabled: c.gpuShaderEnabled !== undefined ? Boolean(c.gpuShaderEnabled) : true,
        backdropEnabled: l4On,
        backdropMode: c.backdropMode !== undefined ? clamp(Math.round(Number(c.backdropMode)), 0, BACKDROP_MODES.length - 1) : 0,
        backdropSpeed: c.backdropSpeed !== undefined ? clamp(Number(c.backdropSpeed), 0.1, 3.0) : 1.0,
        backdropIntensity: c.backdropIntensity !== undefined ? clamp(Number(c.backdropIntensity), 0.2, 2.0) : 1.0,
        backdropSymmetry: c.backdropSymmetry !== undefined ? clamp(Math.round(Number(c.backdropSymmetry)), 2, 16) : 6,
        backdropDirection: c.backdropDirection !== undefined ? Number(c.backdropDirection) : 1,
        layer4Enabled: l4On,
        layer4Mode: clamp(Math.round(Number(l4ModeRaw) || 0), 0, LAYER4_MODES.length - 1),
        layer4DualEnabled: c.layer4DualEnabled !== undefined ? Boolean(c.layer4DualEnabled) : false,
        layer4SecondaryMode: c.layer4SecondaryMode !== undefined ? clamp(Math.round(Number(c.layer4SecondaryMode)), 0, LAYER4_MODES.length - 1) : 1,
        layer4DualMix: c.layer4DualMix !== undefined ? clamp(Number(c.layer4DualMix), 0.15, 0.85) : 0.50,
        layer4WallPattern: c.layer4WallPattern !== undefined ? clamp(Math.round(Number(c.layer4WallPattern)), 0, LAYER4_WALL_PATTERNS.length - 1) : 0,
        layer4Twist: c.layer4Twist !== undefined ? clamp(Number(c.layer4Twist), -2.5, 2.5) : 1.0,
        layer4Speed: c.layer4Speed !== undefined ? clamp(Number(c.layer4Speed), 0.1, 3.0) : (c.backdropSpeed !== undefined ? clamp(Number(c.backdropSpeed), 0.1, 3.0) : 1.0),
        layer4Glow: c.layer4Glow !== undefined ? clamp(Number(c.layer4Glow), 0.2, 2.0) : (c.backdropIntensity !== undefined ? clamp(Number(c.backdropIntensity), 0.2, 2.0) : 1.0),
        layer4Symmetry: c.layer4Symmetry !== undefined ? clamp(Math.round(Number(c.layer4Symmetry)), 2, 16) : (c.backdropSymmetry !== undefined ? clamp(Math.round(Number(c.backdropSymmetry)), 2, 16) : 6),
        layer4Direction: c.layer4Direction !== undefined ? Number(c.layer4Direction) : (c.backdropDirection !== undefined ? Number(c.backdropDirection) : 1),
        trackArcMode: c.trackArcMode !== undefined ? clamp(Math.round(Number(c.trackArcMode)), 0, 4) : 0,
        tracerCount: l2TrOn ? (c.tracerCount !== undefined ? clamp(Math.round(Number(c.tracerCount)), 1, 16) : 4) : 1,
        tracerSpeed: c.tracerSpeed !== undefined ? clamp(Number(c.tracerSpeed), 0.15, 3.0) : 1.15,
        tracerDrift: c.tracerDrift !== undefined ? clamp(Number(c.tracerDrift), 0.0, 2.5) : 1.0,
        tracerDirection: c.tracerDirection !== undefined ? Number(c.tracerDirection) : 1,
        layer1Enabled: c.layer1Enabled !== undefined ? Boolean(c.layer1Enabled) : true,
        layer1FieldEnabled: c.layer1FieldEnabled !== undefined ? Boolean(c.layer1FieldEnabled) : true,
        layer1Mode: c.layer1Mode !== undefined ? clamp(Math.round(Number(c.layer1Mode)), 0, LAYER1_MODES.length - 1) : 0,
        layer1Direction: c.layer1Direction !== undefined ? Number(c.layer1Direction) : 1,
        layer1Trail: Number(c.layer1Trail !== undefined ? c.layer1Trail : (c.layer1Persistence !== undefined ? c.layer1Persistence : 0.85)),
        layer1Speed: Number(c.layer1Speed !== undefined ? c.layer1Speed : 1.0),
        layer1Density: Number(c.layer1Density !== undefined ? c.layer1Density : 1.0) * geomDetail,
        layer1Dim: Number(c.layer1Dim !== undefined ? c.layer1Dim : 0.15),
        layer1EqEnabled: c.layer1EqEnabled !== undefined ? Boolean(c.layer1EqEnabled) : false,
        layer1EqStyle: c.layer1EqStyle !== undefined ? clamp(Math.round(Number(c.layer1EqStyle)), 0, LAYER1_EQ_STYLES.length - 1) : 0,
        layer1EqLayout: c.layer1EqLayout !== undefined ? clamp(Math.round(Number(c.layer1EqLayout)), 0, 3) : 0,
        layer1EqGain: c.layer1EqGain !== undefined ? clamp(Number(c.layer1EqGain), 0.4, 2.5) : 1.25,
        layer1EqScale: c.layer1EqScale !== undefined ? clamp(Number(c.layer1EqScale), 0.15, 2.25) : 1.0,
        layer1EqSpin: c.layer1EqSpin !== undefined ? clamp(Number(c.layer1EqSpin), -2.5, 2.5) : 1.0,
        layer1EqDamping: c.layer1EqDamping !== undefined ? clamp(Math.round(Number(c.layer1EqDamping)), 0, 2) : 0,
        layer1ShapesEnabled: c.layer1ShapesEnabled !== undefined ? Boolean(c.layer1ShapesEnabled) : true,
        layer1ShapeStyle: c.layer1ShapeStyle !== undefined ? clamp(Math.round(Number(c.layer1ShapeStyle)), 0, 5) : 0,
        layer1ShapeSpin: c.layer1ShapeSpin !== undefined ? clamp(Number(c.layer1ShapeSpin), -2.5, 2.5) : 0.25,
        layer1ShapeSpeed: c.layer1ShapeSpeed !== undefined ? clamp(Number(c.layer1ShapeSpeed), 0.2, 3.0) : 1.0,
        layer1ShapeScale: c.layer1ShapeScale !== undefined ? clamp(Number(c.layer1ShapeScale), 0.3, 2.5) : 1.0,
        layer1ShapeDensity: c.layer1ShapeDensity !== undefined ? clamp(Number(c.layer1ShapeDensity), 0.25, 2.5) : 1.0,
        layer2Enabled: c.layer2Enabled !== undefined ? Boolean(c.layer2Enabled) : true,
        layer2VizEnabled: c.layer2VizEnabled !== undefined ? Boolean(c.layer2VizEnabled) : true,
        layer2TracersEnabled: c.layer2TracersEnabled !== undefined ? Boolean(c.layer2TracersEnabled) : true,
        layer2Mode: clamp(Math.round(Number(c.layer2Mode !== undefined ? c.layer2Mode : (c.mode !== undefined ? c.mode : (mode || 0)))), 0, MODE_NAMES.length - 1),
        layer2Facets: Number(c.layer2Facets !== undefined ? c.layer2Facets : (c.symmetryFolds !== undefined ? c.symmetryFolds : 6)),
        layer2Complexity: Number(c.layer2Complexity !== undefined ? c.layer2Complexity : 1.0) * geomDetail,
        layer2Speed: Number(c.layer2Speed !== undefined ? c.layer2Speed : 1.0),
        layer2Reactivity: Number(c.layer2Reactivity !== undefined ? c.layer2Reactivity : (c.sensitivity !== undefined ? c.sensitivity : 1.35)),
        layer2Zoom: Number(c.layer2Zoom !== undefined ? c.layer2Zoom : 1.0),
        layer2Chaos: Number(c.layer2Chaos !== undefined ? c.layer2Chaos : 0.45),
        layer3Enabled: c.layer3Enabled !== undefined ? Boolean(c.layer3Enabled) : true,
        layer3AutoRandomise: Boolean(c.layer3AutoRandomise),
        autoCycle: Boolean(c.autoCycle),
        layer3Mode: c.layer3Mode !== undefined ? clamp(Math.round(Number(c.layer3Mode)), 0, LAYER3_MODES.length - 1) : 0,
        layer3TextStyle: c.layer3TextStyle !== undefined ? clamp(Math.round(Number(c.layer3TextStyle)), 0, LAYER3_TEXT_STYLES.length - 1) : 0,
        layer3ColourMode: c.layer3ColourMode !== undefined ? clamp(Math.round(Number(c.layer3ColourMode)), 0, LAYER3_COLOUR_MODES.length - 1) : 0,
        layer3CylinderDir: c.layer3CylinderDir !== undefined ? clamp(Math.round(Number(c.layer3CylinderDir)), 0, LAYER3_CYLINDER_DIRS.length - 1) : 0,
        layer3ShowArtist: c.layer3ShowArtist !== undefined ? Boolean(c.layer3ShowArtist) : true,
        layer3ShowTrack: c.layer3ShowTrack !== undefined ? Boolean(c.layer3ShowTrack) : true,
        layer3ShowAlbum: c.layer3ShowAlbum !== undefined ? Boolean(c.layer3ShowAlbum) : true,
        layer3ShowStatements: c.layer3ShowStatements !== undefined ? Boolean(c.layer3ShowStatements) : false,
        statementText: String(c.statementText || ""),
        layer3Dismantle: Number(c.layer3Dismantle !== undefined ? c.layer3Dismantle : 1.15),
        layer3Rebuild: Number(c.layer3Rebuild !== undefined ? c.layer3Rebuild : 1.0),
        layer3Evolution: Number(c.layer3Evolution !== undefined ? c.layer3Evolution : 0.85),
        layer3Scale: Number(c.layer3Scale !== undefined ? c.layer3Scale : 1.0),
        layer3Tracers: c.layer3Tracers !== undefined ? clamp(Math.round(Number(c.layer3Tracers)), 1, 8) : 3,
        layer3AsciiMode: c.layer3AsciiMode || c.asciiMode || "braille",
        asciiMode: c.asciiMode || c.layer3AsciiMode || "braille",
        useAlbumArt: c.useAlbumArt !== undefined ? Boolean(c.useAlbumArt) : true,
        bannerLines: c.bannerLines || [],
        artLines: c.artLines || [],
        trackTitle: String(c.trackTitle || ""),
        trackArtist: String(c.trackArtist || ""),
        trackAlbum: String(c.trackAlbum || ""),
        trackProgress: prog
    }
}

function renderFrame(ctx, w, h, state, mode, theme, asciiLines, asciiSource, ttfxFrames, cfg, canvasItem) {
    if (w <= 4 || h <= 4) return

    if (typeof ctx.resetTransform === "function") {
        ctx.resetTransform()
    } else if (typeof ctx.setTransform === "function") {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
    ctx.globalAlpha = 1.0
    ctx.globalCompositeOperation = "source-over"

    // Backward-compatible support if called with 6 args: renderFrame(ctx, w, h, state, rawBands, opts)
    if (Array.isArray(mode) && typeof theme === "object" && asciiLines === undefined) {
        var legacyBands = mode
        var legacyOpts = theme || {}
        var legacyCfg = normaliseConfig(legacyOpts, legacyOpts.mode || 0, legacyOpts.asciiLines)
        stepState(state, legacyBands, legacyCfg.playing, legacyCfg, 0.016)
        var legacyPalette = buildPalette(legacyOpts.themeColours, state.hueShift, legacyCfg.palette)
        ctx.save(); try { drawLayer1Background(ctx, null, w, h, state, legacyOpts.themeColours, legacyPalette, legacyCfg) } finally { ctx.restore() }
        ctx.save(); try { drawLayer2Visualiser(ctx, w, h, state, legacyPalette, legacyCfg) } finally { ctx.restore() }
        ctx.save(); try { drawLayer3AlbumArt(ctx, w, h, state, legacyPalette, legacyCfg, legacyOpts.asciiLines || [], legacyOpts.ttfxFrames || []) } finally { ctx.restore() }
        return
    }

    var effectiveCfg = normaliseConfig(cfg, mode, asciiLines)
    var palette = buildPalette(theme, state.hueShift, effectiveCfg.palette)

    // Layer #1: Background & Iterative Framebuffer Feedback
    ctx.save()
    try {
        drawLayer1Background(ctx, canvasItem, w, h, state, theme, palette, effectiveCfg)
    } finally {
        ctx.restore()
    }

    // Layer #2: Psychedelic & Nightclub Visualiser Engine (with Universal 3D Graded History Tracers)
    ctx.save()
    try {
        drawLayer2Visualiser(ctx, w, h, state, palette, effectiveCfg)
    } finally {
        ctx.restore()
    }

    // Layer #3: Album Art & Words Dismantle, Evolution, Tracers & Rebuild Engine
    ctx.save()
    try {
        drawLayer3AlbumArt(ctx, w, h, state, palette, effectiveCfg, asciiLines, ttfxFrames)
    } finally {
        ctx.restore()
    }
}
