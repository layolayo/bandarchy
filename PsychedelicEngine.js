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
    "TRON Battlezone Landscape",
    "Death Star Trench Run",
    "Obsidian Deep Void"
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
    "Chaos Strange Attractor"
]

var LAYER2_MODES = MODE_NAMES

var LAYER3_MODES = [
    "Shatter & Evolving Rebuild",
    "Cellular Automata Growth",
    "Blackhole Accretion & Nova",
    "Tectonic Shear & Acid Melt",
    "Swarm Flocking Vortex",
    "Omarchy TTE Keyframe Morph"
]

var LAYER1_MODE_NAMES = LAYER1_MODES
var LAYER2_MODE_NAMES = LAYER2_MODES
var LAYER3_MODE_NAMES = LAYER3_MODES

var BACKDROP_MODES = [
    "Harmonic Ripple Flower",
    "Stained-Glass Rose",
    "Volumetric Plasma",
    "Julia Seahorse Fractal",
    "Raymarched Shape Field",
    "Cosmic Aura Pulse",
    "Relativistic Event Horizon"
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
    "Tralis Voxel City"
]

var LAYER1_EQ_LAYOUTS = [
    "Low→High",
    "Centre-Out",
    "Stereo Mirror"
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
    "Arctic Aurora"
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
    ["#2dd4bf", "#38bdf8", "#818cf8", "#c084fc", "#4ade80", "#60a5fa"]
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
        lastFrameMs: 0.0
    }
}

function rebuildArtCells(state, asciiLines, mode) {
    if (!asciiLines || asciiLines.length === 0) {
        state.artCells = []
        state.artSourceKey = ""
        return
    }
    var key = (mode || "braille") + ":" + asciiLines.length + ":" + (asciiLines[0] || "").slice(0, 28) + ":" + (asciiLines[Math.floor(asciiLines.length / 2)] || "").slice(0, 28)
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
        var maxBeatShapes = Math.max(1, Math.min(18, Math.round(6 * shapeDenBeat)))
        if (state.shockwaves.length < maxBeatShapes) {
            state.shockwaves.push({
                r: l1Dir < 0 ? 1.38 : 0.02,
                alpha: 0.88,
                sizeMul: 0.50 + Math.random() * 1.30,
                speed: 0.36 + Math.random() * 0.68 + state.bassSmooth * 0.45,
                laneX: (Math.random() * 2.0 - 1.0) * 0.42,
                laneY: (Math.random() * 2.0 - 1.0) * 0.34,
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
    var bdSpeed = clamp(Number(cfg && cfg.backdropSpeed !== undefined ? cfg.backdropSpeed : 1.0), 0.1, 3.0)
    var bdDirCfg = Number(cfg && cfg.backdropDirection !== undefined ? cfg.backdropDirection : (cfg && cfg.layer1Direction !== undefined ? cfg.layer1Direction : 1))
    var bdDir = (bdDirCfg === 0) ? Math.sin((state.t || 0.0) * 0.72) : clamp(bdDirCfg, -1, 1)
    var trSpeedCfg = clamp(Number(cfg && cfg.tracerSpeed !== undefined ? cfg.tracerSpeed : 1.0), 0.2, 2.5)
    var timeStep = dt * l2Speed * (active ? (0.35 + state.energySmooth * 0.45) : 0.18)
    state.t += timeStep
    state.l1Time = (state.l1Time || 0.0) + dt * l1Speed * l1Dir * (active ? (0.85 + state.bassSmooth * 0.55) : 0.45)
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
            hue: state.hueShift
        })
        if (state.eqRidgeHistory.length > 24) {
            state.eqRidgeHistory.length = 24
        }
    } else if (state.eqRidgeHistory.length > 0) {
        state.eqRidgeHistory[0] = {
            bins: liveBins36,
            bass: state.bass,
            energy: state.energy,
            hue: state.hueShift
        }
    }

    // Step Layer #1 Beat Shapes (obeying Tri-State l1Dir and scaling count with cfg.layer1ShapeDensity!)
    var shapeSpeed = clamp(Number(cfg && cfg.layer1ShapeSpeed !== undefined ? cfg.layer1ShapeSpeed : 1.0), 0.2, 3.0)
    var shapeDensity = clamp(Number(cfg && cfg.layer1ShapeDensity !== undefined ? cfg.layer1ShapeDensity : 1.0), 0.25, 2.5)
    var shapesOn = cfg ? (cfg.layer1ShapesEnabled !== false) : true
    var targetShapeCount = Math.max(1, Math.min(16, Math.round(4 * shapeDensity)))
    var maxShapeCount = Math.max(targetShapeCount, Math.min(18, Math.round(6 * shapeDensity)))
    if (state.shockwaves.length > maxShapeCount) {
        state.shockwaves.length = maxShapeCount
    }
    if (shapesOn && active && state.shockwaves.length < targetShapeCount) {
        var missing = targetShapeCount - state.shockwaves.length
        for (var ms = 0; ms < missing; ms++) {
            var idxS = state.shockwaves.length
            var staggerFrac = targetShapeCount > 1 ? (idxS / targetShapeCount) : 0.0
            var spawnR = l1Dir < 0
                ? clamp(1.35 - staggerFrac * 1.10, 0.12, 1.38)
                : clamp(0.08 + staggerFrac * 1.10, 0.06, 1.28)
            state.shockwaves.push({
                r: spawnR,
                alpha: clamp(0.92 - staggerFrac * 0.32, 0.35, 0.92),
                sizeMul: 0.50 + Math.random() * 1.30,
                speed: 0.36 + Math.random() * 0.68 + state.bassSmooth * 0.45,
                laneX: (Math.random() * 2.0 - 1.0) * 0.42,
                laneY: (Math.random() * 2.0 - 1.0) * 0.34,
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
        wave.r += dt * wave.speed * shapeSpeed * 0.72 * (rawL1Dir === 0 ? (0.25 + 0.75 * l1Dir) : l1Dir)
        wave.alpha -= dt * 0.34 * (0.6 + 0.4 * shapeSpeed)
        if (wave.alpha <= 0.02 || wave.r > 1.45 || wave.r < 0.01) {
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

        if (dismantleGate > 0.02) {
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

function drawLayer1Background(ctx, canvasItem, w, h, state, theme, palette, cfg) {
    var bgHex = (theme && theme.background) ? theme.background.toString() : "#06080e"
    var enabled = cfg ? Boolean(cfg.layer1Enabled) : true
    var fieldOn = cfg && cfg.layer1FieldEnabled !== undefined ? Boolean(cfg.layer1FieldEnabled) : true
    var eqOn = cfg && cfg.layer1EqEnabled !== undefined ? Boolean(cfg.layer1EqEnabled) : (cfg && Number(cfg.layer1Mode) === 4)
    var shapesOn = cfg && cfg.layer1ShapesEnabled !== undefined ? Boolean(cfg.layer1ShapesEnabled) : true
    var l2On = cfg ? Boolean(cfg.layer2Enabled) : true
    var l2BackdropOn = cfg ? Boolean(cfg.backdropEnabled) : false
    var l3On = cfg ? Boolean(cfg.layer3Enabled) : true
    var l1Mode = cfg ? ((Number(cfg.layer1Mode) || 0) % LAYER1_MODES.length) : 0
    var gpuHw = cfg && cfg.gpuShaderEnabled !== undefined ? Boolean(cfg.gpuShaderEnabled) : true
    var gpuOn = Boolean(gpuHw && l2BackdropOn)

    // Detect any layer or L1 sub-system ON/OFF toggle so disabled layers clear from the persistent buffer immediately
    if (state.lastL1 !== enabled || state.lastL2 !== l2On || state.lastL3 !== l3On
        || state.lastL1Field !== fieldOn || state.lastL1Eq !== eqOn || state.lastL1Shapes !== shapesOn
        || state.lastGpuOn !== gpuOn) {
        state.lastL1 = enabled
        state.lastL2 = l2On
        state.lastL3 = l3On
        state.lastL1Field = fieldOn
        state.lastL1Eq = eqOn
        state.lastL1Shapes = shapesOn
        state.lastGpuOn = gpuOn
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
        var veilAlpha = (fieldOn && l1Mode === 5)
            ? clamp(0.48 + dim * 0.48, 0.40, 0.95)
            : clamp((1.0 - trail) * 1.15 + dim * 0.35 + 0.16, 0.24, 0.72)
        ctx.fillStyle = colourWithAlpha(bgHex, veilAlpha)
        ctx.fillRect(0, 0, w, h)
    }

    var horizonY = Math.round(h * 0.50)
    var vanishX = cx + Math.sin(driftT * 0.42) * w * 0.14

    // =========================================================================
    // SUB-SYSTEM 1: L1 FIELD (7 Volumetric Background Fields)
    // =========================================================================
    if (fieldOn) {
        if (l1Mode === 0) {
            // Mode 0: MilkDrop / Geiss 3D Expanding Logarithmic Warp Tunnel Web & Volumetric Curtains
            // Rings expand/contract smoothly with l1T (Towards / Away / Breathe)!
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var ringCount = Math.max(5, Math.min(11, Math.round(7 * density)))
            var segs = 24
            var ringsPts = []
            var warpFract = (((l1T * 0.28) % 1.0) + 1.0) % 1.0
            for (var rIdx = 0; rIdx < ringCount; rIdx++) {
                var rProg = (rIdx + warpFract) / ringCount
                var baseR = Math.pow(rProg, 1.85) * diagR * 1.18
                var ringCX = cx + endPt.dx * 0.65 * Math.pow(1.0 - rProg, 1.25)
                var ringCY = cy + endPt.dy * 0.65 * Math.pow(1.0 - rProg, 1.25)
                var rot = state.phase * (rIdx % 2 === 0 ? 0.30 : -0.30)
                var pts = []
                for (var s = 0; s <= segs; s++) {
                    var ang = (s / segs) * Math.PI * 2 + rot
                    var bVal = state.smoothBands[(s * 2 + rIdx * 7) & 63]
                    var rr = baseR * (1.0 + Math.sin(ang * 4.0 + l1T * 1.1) * 0.07 + bVal * 0.14)
                    pts.push({
                        x: ringCX + Math.cos(ang) * rr,
                        y: ringCY + Math.sin(ang) * rr,
                        prog: rProg
                    })
                }
                ringsPts.push(pts)
            }

            // Translucent 3D warp-tunnel curtains between adjacent expanding rings
            for (var cIdx = 0; cIdx < ringCount - 1; cIdx++) {
                var r0 = ringsPts[cIdx]
                var r1 = ringsPts[cIdx + 1]
                var pAlpha = (0.04 + r1[0].prog * 0.08 + state.bass * 0.05) * (1.0 - dim) * (gpuOn ? 0.55 : 1.0)
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
            for (var rb = 0; rb < 3; rb++) {
                ctx.strokeStyle = colourWithAlpha(palette[(rb * 2 + 1) % palette.length], (0.26 + state.bass * 0.34) * (1.0 - dim))
                ctx.lineWidth = 1.5 + rb * 0.5 + state.bass * 1.4
                ctx.beginPath()
                for (var rIdx2 = rb; rIdx2 < ringCount; rIdx2 += 3) {
                    var rPts = ringsPts[rIdx2]
                    for (var s2 = 0; s2 <= segs; s2++) {
                        if (s2 === 0) ctx.moveTo(rPts[s2].x, rPts[s2].y)
                        else ctx.lineTo(rPts[s2].x, rPts[s2].y)
                    }
                    if (rIdx2 > 0) {
                        var prevPts = ringsPts[rIdx2 - 1]
                        for (var sr = 0; sr < segs; sr += 3) {
                            ctx.moveTo(prevPts[sr].x, prevPts[sr].y)
                            ctx.lineTo(rPts[sr].x, rPts[sr].y)
                        }
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
            var fCount = Math.max(8, Math.min(28, Math.floor(15 * density)))
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
            var flameCount = Math.min(flames.length, Math.max(8, Math.round(flames.length * clamp(density * 0.65, 0.25, 1.0))))
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
            var starLimit = Math.min(state.stars.length, Math.max(18, Math.floor(90 * density)))
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

            // Internal wireframe ridge facets on the Battlezone mountains + volcano plume
            ctx.strokeStyle = colourWithAlpha(palette[2 % palette.length], (0.38 + state.mid * 0.28) * (1.0 - dim))
            ctx.lineWidth = 1.2
            ctx.beginPath()
            for (var mr = 2; mr < mtnNodes.length - 2; mr += 4) {
                var pkX = mtnNodes[mr] * w
                var pkY = horizonY - mtnNodes[mr + 1] * mtnMaxH * (1.0 + state.bass * 0.12)
                ctx.moveTo(pkX, pkY)
                ctx.lineTo(pkX + (mr % 8 === 2 ? -w * 0.035 : w * 0.035), horizonY)
            }
            ctx.stroke()

            // 2. True 1/z Perspective Scrolling TRON / Battlezone Ground Grid below `horizonY`
            //    Fixed, clean grid spacing (rows = 10, cols = 12) so the landscape is always filled cleanly without clutter!
            var rows = 10
            var cols = 12
            var worldScroll = l1T * 0.095
            var scrollFract = (((worldScroll * rows) % 1.0) + 1.0) % 1.0

            // Translucent volumetric floor bands marching towards/away from the viewer
            ctx.fillStyle = colourWithAlpha(palette[2 % palette.length], (0.06 + state.bass * 0.09) * (1.0 - dim) * (gpuOn ? 0.45 : 1.0))
            ctx.beginPath()
            for (var rf = 0; rf < rows; rf += 2) {
                var u0 = (rf + scrollFract) / rows
                var u1 = Math.min(1.0, (rf + 0.65 + scrollFract) / rows)
                var y0 = horizonY + Math.pow(u0, 2.05) * groundH
                var y1 = horizonY + Math.pow(u1, 2.05) * groundH
                ctx.rect(0, y0, w, Math.max(1.5, y1 - y0))
            }
            ctx.fill()

            // Crisp neon horizon line + scrolling transverse ground lines + longitudinal perspective lanes
            ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], (0.42 + state.bass * 0.38) * (1.0 - dim))
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
            //    - Shapes in Battlezone appear BOTH on the terrain AND flying/floating OFF the land in the 3D sky above the landscape!
            //    - 3D wireframe Battlezone tanks simultaneously roll across the ground plane firing vector shells!
            var activeShapeStyle = cfg && cfg.layer1ShapeStyle !== undefined ? ((Number(cfg.layer1ShapeStyle) || 0) % LAYER1_SHAPE_STYLES.length) : 0
            var shapeScaleBz = cfg && cfg.layer1ShapeScale !== undefined ? clamp(Number(cfg.layer1ShapeScale), 0.3, 2.5) : 1.0
            var shapeDenBz = cfg && cfg.layer1ShapeDensity !== undefined ? clamp(Number(cfg.layer1ShapeDensity), 0.25, 2.5) : 1.0
            var obsCount = Math.max(2, Math.min(18, Math.round((shapesOn ? 6 : 4) * density * shapeDenBz)))
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
            var tankCount = Math.max(2, Math.min(10, Math.round(4 * density)))
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
            ctx.restore()
        } else if (l1Mode === 5) {
            // Mode 5: 1983 Atari Star Wars Color-QuadraScan XY Vector Death Star Trench Run (Open Viewport, Zero Cockpit)
            //   - Zero solid polygon fills on trench walls, floor, or catwalk blockades (100% transparent wireframe strokes)
            //   - Strict 8-Colour RGB QuadraScan Vector Palette (#FFFF11 Yellow, #00FFFF Cyan, #11FF11 Green, #FF1111 Red, #FF00FF Magenta, #FFFFFF White)
            //   - Single-wall left & right vertical trench walls opening wide to screen limits (±halfWNear = ±w * 0.54)
            //   - Smooth vertical altitude motion (`camAlt`) weaving under and over 3D wireframe girder catwalk blockades
            //   - Trench rim 3D wireframe box gun turrets, rotating 8-pointed star plasma fireballs, Thermal Exhaust Port & CRT Vertex Bloom dots
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
            var tFlow = l1T * 1.95
            var tScroll = ((tFlow % 1.0) + 1.0) % 1.0
            var baseWorldSlice = Math.floor(tFlow)
            var visAlpha = 1.0 - dim
            var strokeW = 1.7 + state.bass * 0.9

            var blockades = []
            var rimTurrets = []
            var bloomDots = []

            // 1. Yellow (#FFFF11) Single-Wall Longitudinal Rails & Scrolling Vertical Wall Panels (Left & Right Walls)
            ctx.strokeStyle = colourWithAlpha("#FFFF11", (0.82 + state.bass * 0.18) * visAlpha)
            ctx.lineWidth = strokeW
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
                    // Inner rectangular detail panels on the single left & right trench walls (pure wireframe, zero fill)
                    if ((wSlice & 1) === 0) {
                        var yp0a = lerp(yT, yB, 0.20), yp0b = lerp(yT, yB, 0.80)
                        var yp1a = lerp(yTNext, yBNext, 0.20), yp1b = lerp(yTNext, yBNext, 0.80)
                        ctx.moveTo(xL, yp0a); ctx.lineTo(xLNext, yp1a); ctx.lineTo(xLNext, yp1b); ctx.lineTo(xL, yp0b); ctx.closePath()
                        ctx.moveTo(xR, yp0a); ctx.lineTo(xRNext, yp1a); ctx.lineTo(xRNext, yp1b); ctx.lineTo(xR, yp0b); ctx.closePath()
                    }

                    // Collect 3D wireframe girder catwalk blockades (with front face at pS and recessed 3D back face at pBack)
                    if (((wSlice % blockadeStride) + blockadeStride) % blockadeStride === 0 && uS > 0.10) {
                        var blkIdx = Math.floor(wSlice / blockadeStride)
                        var blkSlot = ((blkIdx % 3) + 3) % 3
                        var bFrac0 = blkSlot === 0 ? 0.16 : (blkSlot === 1 ? 0.42 : 0.66)
                        var bFrac1 = blkSlot === 0 ? 0.32 : (blkSlot === 1 ? 0.58 : 0.82)
                        var pBack = lerp(pS, pNext, 0.34)
                        var vxBack = trenchVX * (1.0 - pBack)
                        var xLBack = vxBack - lerp(halfWFar, halfWNear, pBack)
                        var xRBack = vxBack + lerp(halfWFar, halfWNear, pBack)
                        var yTBack = lerp(yTFar, yTNear, pBack)
                        var yBBack = lerp(yBFar, yBNear, pBack)
                        blockades.push({
                            xL: xL,
                            xR: xR,
                            y0: lerp(yT, yB, bFrac0),
                            y1: lerp(yT, yB, bFrac1),
                            xLBack: xLBack,
                            xRBack: xRBack,
                            y0Back: lerp(yTBack, yBBack, bFrac0),
                            y1Back: lerp(yTBack, yBBack, bFrac1),
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
                }

                if (uS > 0.18 && uS < 0.80) {
                    bloomDots.push({ x: xL, y: yT }, { x: xR, y: yT }, { x: xL, y: yB }, { x: xR, y: yB })
                }
            }
            ctx.stroke()

            // 2. Cyan (#00FFFF) Top Trench Rim Lip Edges, Catwalk End-Caps & Rim Turret Wireframe Bases
            ctx.strokeStyle = colourWithAlpha("#00FFFF", (0.90 + state.high * 0.10) * visAlpha)
            ctx.lineWidth = strokeW * 1.15
            ctx.beginPath()
            // Distinct cyan top lip/rim line on left and right walls
            ctx.moveTo(trenchVX - halfWFar, yTFar); ctx.lineTo(-halfWNear, yTNear)
            ctx.moveTo(trenchVX + halfWFar, yTFar); ctx.lineTo(halfWNear, yTNear)
            // Catwalk wall-attachment end-caps & 3D depth edges
            for (var bc = 0; bc < blockades.length; bc++) {
                var blkC = blockades[bc]
                ctx.moveTo(blkC.xL, blkC.y0); ctx.lineTo(blkC.xLBack, blkC.y0Back)
                ctx.moveTo(blkC.xL, blkC.y1); ctx.lineTo(blkC.xLBack, blkC.y1Back)
                ctx.moveTo(blkC.xR, blkC.y0); ctx.lineTo(blkC.xRBack, blkC.y0Back)
                ctx.moveTo(blkC.xR, blkC.y1); ctx.lineTo(blkC.xRBack, blkC.y1Back)
            }
            // 3D wireframe box bases of the trench rim gun turrets (mounted along the top ledges)
            for (var rt = 0; rt < rimTurrets.length; rt++) {
                var tur = rimTurrets[rt]
                var tw0 = (tur.xR0 - tur.xL0) * 0.085
                var tw1 = (tur.xR1 - tur.xL1) * 0.085
                var th0 = tw0 * 0.85
                var th1 = tw1 * 0.85
                // Left rim 3D box turret base (protruding inward onto the top ledge so it stays strictly inside ±halfWNear)
                var lx0 = tur.xL0, lx0In = tur.xL0 + tw0, ly0 = tur.yT0, ly0Top = tur.yT0 - th0
                var lx1 = tur.xL1, lx1In = tur.xL1 + tw1, ly1 = tur.yT1, ly1Top = tur.yT1 - th1
                ctx.moveTo(lx0, ly0);    ctx.lineTo(lx0In, ly0);    ctx.lineTo(lx0In, ly0Top); ctx.lineTo(lx0, ly0Top); ctx.closePath()
                ctx.moveTo(lx1, ly1);    ctx.lineTo(lx1In, ly1);    ctx.lineTo(lx1In, ly1Top); ctx.lineTo(lx1, ly1Top); ctx.closePath()
                ctx.moveTo(lx0, ly0Top); ctx.lineTo(lx1, ly1Top);   ctx.moveTo(lx0In, ly0Top); ctx.lineTo(lx1In, ly1Top)
                // Right rim 3D box turret base
                var rx0 = tur.xR0, rx0In = tur.xR0 - tw0, ry0 = tur.yT0, ry0Top = tur.yT0 - th0
                var rx1 = tur.xR1, rx1In = tur.xR1 - tw1, ry1 = tur.yT1, ry1Top = tur.yT1 - th1
                ctx.moveTo(rx0, ry0);    ctx.lineTo(rx0In, ry0);    ctx.lineTo(rx0In, ry0Top); ctx.lineTo(rx0, ry0Top); ctx.closePath()
                ctx.moveTo(rx1, ry1);    ctx.lineTo(rx1In, ry1);    ctx.lineTo(rx1In, ry1Top); ctx.lineTo(rx1, ry1Top); ctx.closePath()
                ctx.moveTo(rx0, ry0Top); ctx.lineTo(rx1, ry1Top);   ctx.moveTo(rx0In, ry0Top); ctx.lineTo(rx1In, ry1Top)
            }
            ctx.stroke()

            // 3. Green (#11FF11) Trench Floor Grid & Distant Thermal Exhaust Port Trench Extension Frame
            ctx.strokeStyle = colourWithAlpha("#11FF11", (0.84 + state.bass * 0.16) * visAlpha)
            ctx.lineWidth = strokeW
            ctx.beginPath()
            // Longitudinal trench floor grid lanes
            for (var fl = 1; fl <= 3; fl++) {
                var ff = fl / 4.0
                ctx.moveTo(trenchVX + lerp(-halfWFar, halfWFar, ff), yBFar)
                ctx.lineTo(lerp(-halfWNear, halfWNear, ff), yBNear)
            }
            // Scrolling horizontal floor cross-lines rushing underneath the player
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
            ctx.stroke()

            // 4. Red (#FF1111) 3D Wireframe Girder Catwalks (Horizontal Blockades), Turret Gun Tops & Rotating 8-Pointed Star Fireballs
            ctx.strokeStyle = colourWithAlpha("#FF1111", (0.90 + state.beatPulse * 0.10) * visAlpha)
            ctx.lineWidth = strokeW * 1.15
            ctx.beginPath()
            for (var bj = 0; bj < blockades.length; bj++) {
                var blk = blockades[bj]
                // Front & back 3D cuboid wireframe faces of the horizontal catwalk girder (pure stroke, w > h!)
                ctx.rect(blk.xL, blk.y0, blk.xR - blk.xL, blk.y1 - blk.y0)
                ctx.rect(blk.xLBack, blk.y0Back, blk.xRBack - blk.xLBack, blk.y1Back - blk.y0Back)
                // Internal 3D vector X-bracing struts across the girder bays
                var trussSegs = 6
                for (var ts = 0; ts < trussSegs; ts++) {
                    var f0 = ts / trussSegs
                    var f1 = (ts + 1) / trussSegs
                    var tx0 = lerp(blk.xL, blk.xR, f0)
                    var tx1 = lerp(blk.xL, blk.xR, f1)
                    var tx0B = lerp(blk.xLBack, blk.xRBack, f0)
                    ctx.moveTo(tx0, blk.y0); ctx.lineTo(tx0, blk.y1)
                    ctx.moveTo(tx0, blk.y0); ctx.lineTo(tx1, blk.y1)
                    ctx.moveTo(tx1, blk.y0); ctx.lineTo(tx0, blk.y1)
                    ctx.moveTo(tx0, blk.y0); ctx.lineTo(tx0B, blk.y0Back)
                }
                if (blk.p < 0.78) {
                    bloomDots.push(
                        { x: blk.xL, y: blk.y0 }, { x: blk.xR, y: blk.y0 },
                        { x: blk.xL, y: blk.y1 }, { x: blk.xR, y: blk.y1 }
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
            // Incoming rotating 8-pointed star/asterisk wireframe plasma fireballs (* in 3D)
            var fbCount = Math.max(1, Math.min(4, Math.round(2 * density)))
            for (var fbi = 0; fbi < fbCount; fbi++) {
                var fbU = (((l1T * 0.72 + fbi * (1.0 / fbCount)) % 1.0) + 1.0) % 1.0
                if (fbU < 0.12 || fbU > 0.88) continue
                var fbP = Math.pow(fbU, 1.85)
                var fbSide = (fbi % 2 === 0) ? -1.0 : 1.0
                var fbX = trenchVX * (1.0 - fbP) + fbSide * lerp(halfWFar, halfWNear, fbP) * 0.34
                var fbY = lerp(lerp(yTFar, yBFar, 0.45), lerp(yTNear, yBNear, 0.48), fbP)
                var fbR = Math.max(3.5, (4.0 + fbP * minDim * 0.065) * (1.0 + state.beatPulse * 0.25))
                var fbRot = l1T * 6.5 + fbi * 1.1
                for (var spk = 0; spk < 8; spk++) {
                    var spkA = fbRot + (spk / 8.0) * Math.PI * 2
                    var spkNext = fbRot + (((spk + 3) % 8) / 8.0) * Math.PI * 2
                    ctx.moveTo(fbX, fbY)
                    ctx.lineTo(fbX + Math.cos(spkA) * fbR, fbY + Math.sin(spkA) * fbR)
                    ctx.moveTo(fbX + Math.cos(spkA) * fbR * 0.82, fbY + Math.sin(spkA) * fbR * 0.82)
                    ctx.lineTo(fbX + Math.cos(spkNext) * fbR * 0.42, fbY + Math.sin(spkNext) * fbR * 0.42)
                }
                bloomDots.push({ x: fbX, y: fbY })
            }
            ctx.stroke()

            // 5. Magenta (#FF00FF) & White (#FFFFFF) Flashing Thermal Exhaust Port Octagon + Proton Torpedo Star-Bursts
            ctx.strokeStyle = colourWithAlpha((Math.floor(l1T * 10.0) & 1) === 0 ? "#FF00FF" : "#FFFFFF", (0.92 + state.beatPulse * 0.08) * visAlpha)
            ctx.lineWidth = strokeW * 1.1
            ctx.beginPath()
            var octR = portFrameW * (0.62 + state.beatPulse * 0.18)
            for (var oi = 0; oi <= 8; oi++) {
                var oa = (oi / 8.0) * Math.PI * 2 + (Math.PI / 8.0)
                var ox = trenchVX + Math.cos(oa) * octR
                var oy = portFrameY + Math.sin(oa) * octR
                if (oi === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy)
            }
            ctx.stroke()

            // 6. CRT Electron-Beam Vertex Bloom ("Vector Dots" at line intersections + space stars above trench rim)
            ctx.fillStyle = colourWithAlpha("#FFFFFF", (0.88 + state.high * 0.12) * visAlpha)
            ctx.beginPath()
            var dotR = 1.6 + state.beatPulse * 0.7
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
            var spiralArms = Math.max(8, Math.min(24, Math.round(14 * density)))
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
        }
    }

    // =========================================================================
    // SUB-SYSTEM 2: L1 EQUALISER (Independent ON/OFF — works over ANY L1 Field!)
    // =========================================================================
    if (eqOn) {
        var eqStyle = cfg && cfg.layer1EqStyle !== undefined ? ((Number(cfg.layer1EqStyle) || 0) % LAYER1_EQ_STYLES.length) : 0
        var eqLayout = cfg && cfg.layer1EqLayout !== undefined ? ((Number(cfg.layer1EqLayout) || 0) % LAYER1_EQ_LAYOUTS.length) : 0
        var eqGain = cfg && cfg.layer1EqGain !== undefined ? clamp(Number(cfg.layer1EqGain), 0.2, 3.0) : 1.25
        var eqDamping = cfg && cfg.layer1EqDamping !== undefined ? ((Number(cfg.layer1EqDamping) || 0) % 3) : 0
        var maxEqH = h * 0.42

        ctx.save()
        ctx.globalCompositeOperation = "source-over"

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
            // across the 3D horizon landscape using `state.eqRidgeHistory` + continuous fractional advection `zPhase`!
            var ridgeHist = (state.eqRidgeHistory && state.eqRidgeHistory.length > 0) ? state.eqRidgeHistory : null
            var ridgeCount = 16
            var binCount3 = 36
            var zPhase = (((l1T * 2.8) % 1.0) + 1.0) % 1.0

            // Render back-to-front (from horizonY at depthSlot=0 down to foreground at depthSlot=ridgeCount-1)
            for (var depthSlot = 0; depthSlot < ridgeCount; depthSlot++) {
                var uDepth = clamp((depthSlot + zPhase) / ridgeCount, 0.01, 0.999)
                // Map depthSlot to the historical frequency slice so ridges carry their recorded waveform as they travel in Z!
                var histIdx = l1Dir >= 0
                    ? Math.min((ridgeHist ? ridgeHist.length : 1) - 1, depthSlot)
                    : Math.min((ridgeHist ? ridgeHist.length : 1) - 1, (ridgeCount - 1) - depthSlot)
                var sliceObj = ridgeHist ? ridgeHist[histIdx] : null

                // Perspective depth mapping (`z` from 3.4 at horizon to 0.45 in foreground, `persp = 1.0 / z`)
                var zDist = lerp(3.4, 0.45, uDepth)
                var persp = 1.0 / zDist
                var perspNorm = clamp((persp - (1.0 / 3.4)) / ((1.0 / 0.45) - (1.0 / 3.4)), 0.0, 1.0)
                var ridgeBaseY = horizonY + (h * 0.96 - horizonY) * perspNorm
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
                    var ripple3D = 0.88 + 0.16 * Math.sin(uBin * 12.0 + (depthSlot - zPhase) * 0.7)
                    var bv3 = rawVal * eqGain * pulsarEnv * ripple3D * (0.45 + 0.85 * perspNorm)
                    var rx = leftXEq + uBin * ridgeW
                    var ry = ridgeBaseY - bv3 * maxEqH * 0.74
                    curCoords.push({ x: rx, y: ry })
                }

                // Occluding dark-tinted 3D terrain skirt + glowing neon frequency ridge crest (no cross-grid clutter!)
                var ridgeCol = palette[(depthSlot + Math.floor((state.hueShift || 0) / 30)) % palette.length]
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
                    var harmMod = Math.sin(cw * 0.35 + l1T * 1.4 + wingPass) * 0.15 + 0.85
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
                var tilt = Math.sin(l1T * f1 + p1) * 0.38
                         + Math.cos(l1T * f2 - p2) * 0.26
                         + Math.sin(l1T * f3 + p3 + v6 * 0.85) * 0.19
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
            // Style 7: 3D Sonic Orb — Floating, Tumbling 3D Geodesic Harmonic Polyhedron in 3D Space (`project3DPoint`)
            // Depth-sorted 3D triangular/quad facets and smooth radial frequency lobes (zero `ctx.rect` squares!)
            var orbCX = vanishX + Math.sin(driftT * 0.65) * w * 0.14
            var orbCY = clamp(horizonY - minDim * 0.12 + Math.cos(driftT * 0.52) * h * 0.08, h * 0.24, h * 0.72)
            var orbBaseScale = minDim * (0.22 + state.bassSmooth * 0.08)
            var orbRx = l1T * 0.52 + Math.sin(driftT * 0.4) * 0.38
            var orbRy = l1T * 0.76
            var orbRz = Math.cos(l1T * 0.35) * 0.32
            var latRings = 7
            var lonSegs = 14
            var orbGrid = []
            var spineSegments = [[], [], [], []]

            for (var rLat = 0; rLat < latRings; rLat++) {
                var vLat = rLat / (latRings - 1)
                var phi = (vLat - 0.5) * Math.PI * 0.88
                var cosPhi = Math.cos(phi)
                var sinPhi = Math.sin(phi)
                var ringPts = []

                for (var cLon = 0; cLon < lonSegs; cLon++) {
                    var theta = (cLon / lonSegs) * Math.PI * 2.0
                    var slotIdx = rLat * lonSegs + cLon
                    var bIdx7 = mapEqBandIndex(slotIdx, latRings * lonSegs, eqLayout)
                    var v7 = sampleEqBandValue(state, bIdx7, eqDamping, eqGain)

                    var nx3 = cosPhi * Math.cos(theta)
                    var ny3 = sinPhi
                    var nz3 = cosPhi * Math.sin(theta)

                    // Harmonic spherical lobe modulation + live band extrusion
                    var lobeHarm = 1.0 + 0.18 * Math.sin(theta * 3.0 + l1T * 1.8) * Math.cos(phi * 2.0)
                    var rInner3 = 0.42
                    var rOuter3 = (0.54 + v7 * 0.82) * lobeHarm

                    var pIn = project3DPoint(nx3 * rInner3, ny3 * rInner3, nz3 * rInner3, orbRx, orbRy, orbRz, orbCX, orbCY, orbBaseScale, 3.6)
                    var pOut = project3DPoint(nx3 * rOuter3, ny3 * rOuter3, nz3 * rOuter3, orbRx, orbRy, orbRz, orbCX, orbCY, orbBaseScale, 3.6)
                    pOut.v = v7

                    ringPts.push(pOut)
                    spineSegments[(rLat + cLon) & 3].push({ p0: pIn, p1: pOut })
                }
                orbGrid.push(ringPts)
            }

            // 1. Translucent 3D geodesic quad facets + glowing wireframe lattice on the deformed outer frequency surface
            for (var rl = 0; rl < latRings - 1; rl++) {
                var facetCol = palette[(rl * 2 + 1) % palette.length]
                var wireCol = palette[(rl * 2) % palette.length]
                ctx.fillStyle = colourWithAlpha(facetCol, (0.12 + state.energy * 0.14) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(wireCol, (0.62 + state.bass * 0.30) * (1.0 - dim))
                ctx.lineWidth = 1.35 + state.bass * 0.85
                ctx.beginPath()
                for (var cl = 0; cl < lonSegs; cl++) {
                    var nextCl = (cl + 1) % lonSegs
                    var pt00 = orbGrid[rl][cl]
                    var pt01 = orbGrid[rl][nextCl]
                    var pt11 = orbGrid[rl + 1][nextCl]
                    var pt10 = orbGrid[rl + 1][cl]
                    ctx.moveTo(pt00.x, pt00.y)
                    ctx.lineTo(pt01.x, pt01.y)
                    ctx.lineTo(pt11.x, pt11.y)
                    ctx.lineTo(pt10.x, pt10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }

            // 2. Radial 3D frequency spines extruding from the inner core to the deformed outer vertices
            for (var sbk = 0; sbk < 4; sbk++) {
                var segList = spineSegments[sbk]
                ctx.strokeStyle = colourWithAlpha(palette[(sbk * 3 + 2) % palette.length], (0.76 + state.beatPulse * 0.24) * (1.0 - dim))
                ctx.lineWidth = 1.7 + state.bass * 1.0
                ctx.beginPath()
                for (var si = 0; si < segList.length; si++) {
                    ctx.moveTo(segList[si].p0.x, segList[si].p0.y)
                    ctx.lineTo(segList[si].p1.x, segList[si].p1.y)
                }
                ctx.stroke()
            }
        } else if (eqStyle === 8) {
            // Style 8: 3D Torus Reactor — Giant Tumbling 3D Toroidal Tokamak / Wormhole Ring in 3D Space (`project3DPoint`)
            // Frequency bands wrap around the 3D major ring azimuth (`u = 0..2π`) while amplitude dynamically
            // inflates and twists the minor tube radius (`r = rBase + eqVal * rAudio`), plus spiralling helical plasma coils!
            var torCX = vanishX + Math.sin(driftT * 0.55) * w * 0.10
            var torCY = clamp(horizonY - minDim * 0.08 + Math.cos(driftT * 0.48) * h * 0.06, h * 0.25, h * 0.72)
            var torScale = minDim * (0.24 + state.bassSmooth * 0.06)
            var torRx = 0.68 + Math.sin(l1T * 0.42) * 0.35
            var torRy = l1T * 0.64
            var torRz = Math.cos(l1T * 0.38) * 0.40
            var majorSegs = 24
            var minorSegs = 8
            var Rmajor = 0.92
            var torRings = []

            for (var uIdx = 0; uIdx < majorSegs; uIdx++) {
                var uAng = (uIdx / majorSegs) * Math.PI * 2.0
                var cosU = Math.cos(uAng)
                var sinU = Math.sin(uAng)
                var bIdx8 = mapEqBandIndex(uIdx, majorSegs, eqLayout)
                var v8 = sampleEqBandValue(state, bIdx8, eqDamping, eqGain)
                var rMinor = 0.16 + v8 * 0.38
                var tubePts = []

                for (var vIdx = 0; vIdx < minorSegs; vIdx++) {
                    var vAng = (vIdx / minorSegs) * Math.PI * 2.0 + uAng * 1.5 + l1T * 1.8
                    var rLocal = rMinor * (1.0 + 0.18 * Math.cos(vAng * 2.0 - l1T * 2.4))
                    var radXY = Rmajor + rLocal * Math.cos(vAng)
                    var tx3 = radXY * cosU
                    var ty3 = rLocal * Math.sin(vAng)
                    var tz3 = radXY * sinU
                    tubePts.push(project3DPoint(tx3, ty3, tz3, torRx, torRy, torRz, torCX, torCY, torScale, 3.8))
                }
                torRings.push({ pts: tubePts, v: v8 })
            }

            // 1. Poloidal plasma containment rings around each frequency slice of the torus
            for (var ur = 0; ur < majorSegs; ur++) {
                var ringObj = torRings[ur]
                var rPts = ringObj.pts
                var col8 = palette[(ur + Math.floor((state.hueShift || 0) / 30)) % palette.length]
                ctx.fillStyle = colourWithAlpha(col8, (0.10 + ringObj.v * 0.14) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(col8, (0.62 + ringObj.v * 0.34) * (1.0 - dim))
                ctx.lineWidth = 1.3 + ringObj.v * 1.1
                ctx.beginPath()
                for (var vr = 0; vr < minorSegs; vr++) {
                    if (vr === 0) ctx.moveTo(rPts[vr].x, rPts[vr].y)
                    else ctx.lineTo(rPts[vr].x, rPts[vr].y)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            // 2. Helical Tokamak Magnetic Flux Coils spiralling around the 3D torus
            for (var coil = 0; coil < minorSegs; coil += 2) {
                ctx.strokeStyle = colourWithAlpha(palette[(coil * 2 + 1) % palette.length], (0.78 + state.beatPulse * 0.22) * (1.0 - dim))
                ctx.lineWidth = 1.8 + state.bass * 1.0
                ctx.beginPath()
                for (var uc = 0; uc <= majorSegs; uc++) {
                    var uWrap = uc % majorSegs
                    var vWrap = (coil + Math.floor(uc / 2)) % minorSegs
                    var pCoil = torRings[uWrap].pts[vWrap]
                    if (uc === 0) ctx.moveTo(pCoil.x, pCoil.y)
                    else ctx.lineTo(pCoil.x, pCoil.y)
                }
                ctx.stroke()
            }
        } else if (eqStyle === 9) {
            // Style 9: Cymatic Chladni — 3D Acoustic Cymatics / Chladni Standing-Wave Resonance Plate in 3D Space
            // Concentric and petal-shaped 3D nodal standing-wave interference contours (`cos(n·θ + phase) * sin(m·r)`)
            // where bass/mid/treble dominant frequencies dynamically shift harmonic integers `(n, m)` and warp elevation in 3D!
            var cymCX = vanishX
            var cymCY = clamp(horizonY - minDim * 0.05, h * 0.28, h * 0.70)
            var cymScale = minDim * (0.34 + state.bassSmooth * 0.06)
            var cymRx = 0.78 + Math.sin(driftT * 0.45) * 0.22
            var cymRy = l1T * 0.38
            var cymRz = Math.sin(l1T * 0.28) * 0.25

            // Harmonic mode numbers driven by live frequency distribution
            var modeN = 3.0 + Math.floor(((state.bassSmooth * 3.0 + state.midSmooth * 4.0) % 4.0))
            var modeM = 2.0 + Math.floor(((state.highSmooth * 4.0 + state.energySmooth * 3.0) % 4.0))
            var ringContours = 7
            var angSteps = 48
            var contourRings = []

            for (var rc = 1; rc <= ringContours; rc++) {
                var rNorm = rc / ringContours
                var ringCol = palette[(rc * 2) % palette.length]
                var cPts = []

                for (var aStep = 0; aStep < angSteps; aStep++) {
                    var theta9 = (aStep / angSteps) * Math.PI * 2.0
                    var bIdx9 = mapEqBandIndex((aStep + rc * 5) % angSteps, angSteps, eqLayout)
                    var v9 = sampleEqBandValue(state, bIdx9, eqDamping, eqGain)

                    // Chladni standing-wave nodal interference equation: cos(n*theta)*sin(m*pi*r) - cos(m*theta)*sin(n*pi*r)
                    var chladni = Math.cos(modeN * theta9 + l1T * 1.2) * Math.sin(modeM * Math.PI * rNorm)
                                - Math.cos(modeM * theta9 - l1T * 0.9) * Math.sin(modeN * Math.PI * rNorm)
                    var rDisplaced = rNorm * (0.78 + 0.26 * chladni * (0.45 + v9 * 0.85))
                    var zElev = chladni * v9 * 0.48 + Math.sin(rNorm * Math.PI * 3.0 - l1T * 2.4) * v9 * 0.22
                    var cx3 = rDisplaced * Math.cos(theta9)
                    var cy3 = zElev
                    var cz3 = rDisplaced * Math.sin(theta9)
                    cPts.push(project3DPoint(cx3, cy3, cz3, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, 3.4))
                }
                contourRings.push(cPts)

                // Draw closed 3D nodal standing-wave contour ring + translucent harmonic membrane
                ctx.fillStyle = colourWithAlpha(ringCol, (0.07 + (1.0 - rNorm) * 0.08 + state.energy * 0.06) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(ringCol, (0.68 + state.bass * 0.28) * (1.0 - dim))
                ctx.lineWidth = 1.4 + (1.0 - rNorm * 0.4) * 1.2
                ctx.beginPath()
                for (var cp = 0; cp < angSteps; cp++) {
                    if (cp === 0) ctx.moveTo(cPts[cp].x, cPts[cp].y)
                    else ctx.lineTo(cPts[cp].x, cPts[cp].y)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            // Radial standing-wave antinode filaments linking inner and outer Chladni harmonic shells
            ctx.strokeStyle = colourWithAlpha("#ffffff", (0.46 + state.beatPulse * 0.34) * (1.0 - dim))
            ctx.lineWidth = 1.2
            ctx.beginPath()
            for (var spk = 0; spk < angSteps; spk += 3) {
                for (var rLink = 0; rLink < contourRings.length - 1; rLink++) {
                    var pA9 = contourRings[rLink][spk]
                    var pB9 = contourRings[rLink + 1][spk]
                    ctx.moveTo(pA9.x, pA9.y)
                    ctx.lineTo(pB9.x, pB9.y)
                }
            }
            ctx.stroke()
        } else if (eqStyle === 10) {
            // Style 10: 3D Helix Vortex — Full-3D Spiralling Triple-Helix Tornado Vortex Plunging Through 3D Depth
            // Three intertwined 3D phase-strands and triangular base-pair energy bridges plunge from deep space
            // right towards/away from the viewer (`project3DPoint`), twisting and expanding radially in 360°!
            var vorCX = vanishX
            var vorCY = clamp(horizonY - minDim * 0.04, h * 0.26, h * 0.72)
            var vorScale = minDim * 0.36
            var vorRx = Math.sin(driftT * 0.5) * 0.24
            var vorRy = Math.cos(driftT * 0.4) * 0.24
            var vorRz = l1T * 0.45
            var depthNodes = 28
            var strandCount = 3
            var strands3D = [[], [], []]
            var zAdvect = (((l1T * 2.2) % 1.0) + 1.0) % 1.0

            for (var dn = 0; dn < depthNodes; dn++) {
                var uZ = clamp((dn + zAdvect) / depthNodes, 0.02, 0.99)
                // Z depth from far (+2.6) to near (-1.0) relative to camera at camDist = 3.2
                var z3 = lerp(2.2, -1.1, uZ)
                var bIdx10 = mapEqBandIndex(dn, depthNodes, eqLayout)
                var v10 = sampleEqBandValue(state, bIdx10, eqDamping, eqGain)
                var funnelRad = (0.14 + uZ * 0.62) * (0.65 + v10 * 0.85)
                var baseTwist = uZ * Math.PI * 5.0 - l1T * 2.6

                for (var stIdx = 0; stIdx < strandCount; stIdx++) {
                    var sAng = baseTwist + (stIdx * Math.PI * 2.0) / strandCount
                    var hx3 = Math.cos(sAng) * funnelRad + Math.sin(uZ * Math.PI * 2.0 + l1T) * 0.08
                    var hy3 = Math.sin(sAng) * funnelRad + Math.cos(uZ * Math.PI * 2.0 - l1T) * 0.08
                    var projH = project3DPoint(hx3, hy3, z3, vorRx, vorRy, vorRz, vorCX, vorCY, vorScale, 2.8)
                    projH.v = v10
                    projH.uZ = uZ
                    strands3D[stIdx].push(projH)
                }
            }

            // 1. Triangular 3D base-pair energy bridges across the vortex core at each depth ring
            for (var br = 0; br < depthNodes; br++) {
                var p0 = strands3D[0][br]
                var p1 = strands3D[1][br]
                var p2 = strands3D[2][br]
                var brCol = palette[(br + 2) % palette.length]
                ctx.fillStyle = colourWithAlpha(brCol, (0.06 + p0.uZ * 0.10 + p0.v * 0.08) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(brCol, (0.35 + p0.uZ * 0.55) * (1.0 - dim))
                ctx.lineWidth = 1.0 + p0.uZ * 1.4
                ctx.beginPath()
                ctx.moveTo(p0.x, p0.y)
                ctx.lineTo(p1.x, p1.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            // 2. Three intertwined 3D helical vortex backbone strands plunging towards the viewer
            for (var sPass = 0; sPass < strandCount; sPass++) {
                var sPts = strands3D[sPass]
                ctx.strokeStyle = colourWithAlpha(palette[(sPass * 3 + 1) % palette.length], (0.86 + state.bass * 0.14) * (1.0 - dim))
                ctx.lineWidth = 2.2 + state.bass * 1.2
                ctx.beginPath()
                for (var sp10 = 0; sp10 < sPts.length; sp10++) {
                    if (sp10 === 0) ctx.moveTo(sPts[sp10].x, sPts[sp10].y)
                    else ctx.lineTo(sPts[sp10].x, sPts[sp10].y)
                }
                ctx.stroke()
            }
        } else if (eqStyle === 11) {
            // Style 11: Tesla Plasma Arcs — High-Voltage Branching 3D Tesla Coil Plasma Globe
            // A levitating central 3D high-voltage electrode core firing jagged, branching fractal lightning
            // filaments out in 360° / 3D space towards frequency-tuned orbital attractors!
            var teslaCX = vanishX
            var teslaCY = clamp(horizonY - minDim * 0.06, h * 0.26, h * 0.72)
            var maxPlasmaR = minDim * (0.42 + state.bassSmooth * 0.08)
            var coreR = minDim * (0.055 + state.bass * 0.025)
            var boltCount = 24

            // 1. Outer translucent plasma containment shell & corona rings
            ctx.strokeStyle = colourWithAlpha(palette[2 % palette.length], (0.32 + state.energy * 0.28) * (1.0 - dim))
            ctx.lineWidth = 1.4
            ctx.beginPath()
            ctx.arc(teslaCX, teslaCY, maxPlasmaR, 0, Math.PI * 2)
            ctx.stroke()

            // 2. Multi-pass 360° jagged fractal lightning bolts + forked sub-branches driven by frequency bands
            for (var passT = 0; passT < 2; passT++) {
                // Pass 0 = wide outer plasma ionized glow; Pass 1 = crisp white-hot inner lightning core
                for (var bBolt = 0; bBolt < boltCount; bBolt++) {
                    var bIdx11 = mapEqBandIndex(bBolt, boltCount, eqLayout)
                    var v11 = sampleEqBandValue(state, bIdx11, eqDamping, eqGain)
                    var baseAng = (bBolt / boltCount) * Math.PI * 2.0 + Math.sin(l1T * 0.85 + bBolt * 1.7) * 0.16
                    var boltReach = coreR + (maxPlasmaR - coreR) * clamp(0.28 + v11 * 0.78, 0.20, 1.12)
                    var boltCol = passT === 0
                        ? palette[(bBolt + Math.floor((state.hueShift || 0) / 30)) % palette.length]
                        : "#ffffff"

                    ctx.strokeStyle = colourWithAlpha(boltCol, (passT === 0 ? (0.48 + v11 * 0.36) : (0.78 + v11 * 0.22)) * (1.0 - dim))
                    ctx.lineWidth = passT === 0 ? (2.6 + v11 * 2.2) : (1.1 + v11 * 0.8)
                    ctx.beginPath()

                    var segSteps = 7
                    var prevBX = teslaCX + Math.cos(baseAng) * coreR
                    var prevBY = teslaCY + Math.sin(baseAng) * coreR
                    ctx.moveTo(prevBX, prevBY)

                    var perpX = -Math.sin(baseAng)
                    var perpY = Math.cos(baseAng)

                    for (var sStep = 1; sStep <= segSteps; sStep++) {
                        var uStep = sStep / segSteps
                        var rDist = lerp(coreR, boltReach, uStep)
                        // High-frequency deterministic fractal crackle displacement (zero at endpoints, maximum mid-arc)
                        var envJit = Math.sin(uStep * Math.PI)
                        var crackle = (Math.sin(l1T * 19.0 + bBolt * 5.3 + sStep * 3.7)
                                     + 0.6 * Math.cos(l1T * 31.0 - bBolt * 2.9 + sStep * 6.1)) * minDim * (0.018 + v11 * 0.032) * envJit
                        var curBX = teslaCX + Math.cos(baseAng) * rDist + perpX * crackle
                        var curBY = teslaCY + Math.sin(baseAng) * rDist + perpY * crackle
                        ctx.lineTo(curBX, curBY)

                        // Forked lightning sub-branch on active mid-arc nodes
                        if (sStep === 4 && v11 > 0.24) {
                            var forkSign = (bBolt & 1) ? 1.0 : -1.0
                            var forkAng = baseAng + forkSign * (0.38 + 0.18 * Math.sin(l1T * 7.0 + bBolt))
                            var forkLen = (boltReach - rDist) * (0.55 + v11 * 0.35)
                            var midFX = curBX + Math.cos(forkAng) * forkLen * 0.52 + perpX * crackle * 0.4
                            var midFY = curBY + Math.sin(forkAng) * forkLen * 0.52 + perpY * crackle * 0.4
                            var tipFX = curBX + Math.cos(forkAng + forkSign * 0.18) * forkLen
                            var tipFY = curBY + Math.sin(forkAng + forkSign * 0.18) * forkLen
                            ctx.moveTo(curBX, curBY)
                            ctx.lineTo(midFX, midFY)
                            ctx.lineTo(tipFX, tipFY)
                            ctx.moveTo(curBX, curBY)
                        }
                    }
                    ctx.stroke()
                }
            }

            // 3. Central High-Voltage 3D Electrode Core
            ctx.fillStyle = colourWithAlpha(palette[0], (0.45 + state.bass * 0.35) * (1.0 - dim))
            ctx.strokeStyle = colourWithAlpha("#ffffff", (0.90 + state.beatPulse * 0.10) * (1.0 - dim))
            ctx.lineWidth = 2.0 + state.bass * 1.2
            ctx.beginPath()
            ctx.arc(teslaCX, teslaCY, coreR, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
        } else {
            // Style 12: Tralis Voxel City — Plexamp *Tralis* 16 × 5 Matrix of 3D Wireframe Skyscrapers (`project3DPoint`)
            // Sitting on the 3D perspective ground grid and marching towards/away from the viewer while extruding
            // upward with bass, mid, and treble across historical spectrum rows (zero 2D `ctx.rect` squares!).
            var cityHist = (state.eqRidgeHistory && state.eqRidgeHistory.length > 0) ? state.eqRidgeHistory : null
            var cityCols = 16
            var cityRows = 5
            var zPhaseCity = (((l1T * 1.65) % 1.0) + 1.0) % 1.0
            var cityCX = vanishX
            var cityCY = horizonY
            var cityScale = minDim * 0.62
            var cityRx = 0.24 // subtle downward camera pitch onto the 3D voxel metropolis
            var cityRy = Math.sin(driftT * 0.35) * 0.10
            var cityRz = 0.0

            // Render back-to-front (from farthest horizon row `rCity = 0` to nearest foreground row `rCity = cityRows - 1`)
            for (var rCity = 0; rCity < cityRows; rCity++) {
                var uRow = clamp((rCity + zPhaseCity) / cityRows, 0.02, 0.995)
                var histRowIdx = l1Dir >= 0
                    ? Math.min((cityHist ? cityHist.length : 1) - 1, rCity * 3)
                    : Math.min((cityHist ? cityHist.length : 1) - 1, (cityRows - 1 - rCity) * 3)
                var rowSlice = cityHist ? cityHist[histRowIdx] : null
                var rowFade = Math.sin(uRow * Math.PI)

                // World Z from far horizon (+2.8) to near foreground (-0.8) with camDist = 2.6
                var zCenter = lerp(2.6, -0.75, uRow)
                var halfDepthZ = 0.16
                var zBack = zCenter + halfDepthZ
                var zFront = zCenter - halfDepthZ
                var groundY3 = 0.68 // ground plane below horizonY in 3D space

                var rowCol = palette[(rCity * 2 + Math.floor((state.hueShift || 0) / 30)) % palette.length]
                var roofCol = palette[(rCity * 2 + 2 + Math.floor((state.hueShift || 0) / 30)) % palette.length]

                // Batch wireframe tower edges and glowing 3D rooftop quads per row for blazing-fast 60 FPS rendering
                ctx.fillStyle = colourWithAlpha(roofCol, clamp((0.18 + 0.28 * uRow) * rowFade * (1.0 - dim), 0.04, 0.85))
                ctx.strokeStyle = colourWithAlpha(rowCol, clamp((0.40 + 0.58 * uRow) * (0.35 + 0.65 * rowFade) * (1.0 - dim), 0.10, 1.0))
                ctx.lineWidth = 1.0 + 1.4 * uRow

                // 1. Translucent 3D Rooftop Quads & Front Facades (occluding background geometry cleanly)
                ctx.beginPath()
                var rowTowers = []
                for (var cCity = 0; cCity < cityCols; cCity++) {
                    var uCol = (cCity + 0.5) / cityCols
                    var xCenter = (uCol - 0.5) * 3.4
                    var halfW = 0.072

                    var bIdx12 = mapEqBandIndex(cCity, cityCols, eqLayout)
                    var bin36City = Math.min(35, Math.floor((bIdx12 / 63.0) * 35))
                    var rawBandVal = rowSlice && rowSlice.bins ? (rowSlice.bins[bin36City] || 0.06) : sampleEqBandValue(state, bIdx12, eqDamping, eqGain)
                    // Modulate with bass (inner columns), mid (mid columns), and treble (outer wings)
                    var colDist = Math.abs(uCol - 0.5) * 2.0
                    var bmtBoost = colDist < 0.35 ? (0.85 + state.bassSmooth * 0.55) : (colDist < 0.70 ? (0.85 + state.midSmooth * 0.55) : (0.85 + state.highSmooth * 0.55))
                    var towerH = clamp(rawBandVal * eqGain * bmtBoost * 1.15, 0.06, 1.55)
                    var topY3 = groundY3 - towerH

                    var xL = xCenter - halfW
                    var xR = xCenter + halfW

                    // 8 corners of the 3D skyscraper box
                    var bFL = project3DPoint(xL, groundY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var bFR = project3DPoint(xR, groundY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var bBR = project3DPoint(xR, groundY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var bBL = project3DPoint(xL, groundY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)

                    var tFL = project3DPoint(xL, topY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var tFR = project3DPoint(xR, topY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var tBR = project3DPoint(xR, topY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var tBL = project3DPoint(xL, topY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)

                    rowTowers.push({ bFL: bFL, bFR: bFR, bBR: bBR, bBL: bBL, tFL: tFL, tFR: tFR, tBR: tBR, tBL: tBL })

                    // 3D Rooftop quad
                    ctx.moveTo(tFL.x, tFL.y)
                    ctx.lineTo(tFR.x, tFR.y)
                    ctx.lineTo(tBR.x, tBR.y)
                    ctx.lineTo(tBL.x, tBL.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()

                // 2. 3D Wireframe Skyscraper Vertical Pillars & Base Footprint Edges
                ctx.beginPath()
                for (var twi = 0; twi < rowTowers.length; twi++) {
                    var tw = rowTowers[twi]
                    // 4 vertical edges of the 3D skyscraper
                    ctx.moveTo(tw.bFL.x, tw.bFL.y); ctx.lineTo(tw.tFL.x, tw.tFL.y)
                    ctx.moveTo(tw.bFR.x, tw.bFR.y); ctx.lineTo(tw.tFR.x, tw.tFR.y)
                    ctx.moveTo(tw.bBR.x, tw.bBR.y); ctx.lineTo(tw.tBR.x, tw.tBR.y)
                    ctx.moveTo(tw.bBL.x, tw.bBL.y); ctx.lineTo(tw.tBL.x, tw.tBL.y)
                    // Front & side base edges sitting on the perspective ground grid
                    ctx.moveTo(tw.bFL.x, tw.bFL.y); ctx.lineTo(tw.bFR.x, tw.bFR.y)
                    ctx.moveTo(tw.bFR.x, tw.bFR.y); ctx.lineTo(tw.bBR.x, tw.bBR.y)
                    ctx.moveTo(tw.bBL.x, tw.bBL.y); ctx.lineTo(tw.bFL.x, tw.bFL.y)
                }
                ctx.stroke()
            }
        }
        ctx.restore()
    }

    // =========================================================================
    // SUB-SYSTEM 3: L1 BEAT SHAPES & 3D ARCADE VECTOR CRAFT
    // (Spawning at the distant vanishing point and moving all the way OFF screen,
    //  including flying OFF the land in the 3D sky when Battlezone `l1Mode === 4` is active!)
    // =========================================================================
    if (shapesOn && state.shockwaves.length > 0) {
        var shapeStyle = cfg && cfg.layer1ShapeStyle !== undefined ? ((Number(cfg.layer1ShapeStyle) || 0) % LAYER1_SHAPE_STYLES.length) : 0
        var shapeSpin = cfg && cfg.layer1ShapeSpin !== undefined ? clamp(Number(cfg.layer1ShapeSpin), -2.5, 2.5) : 0.25
        var shapeScale = cfg && cfg.layer1ShapeScale !== undefined ? clamp(Number(cfg.layer1ShapeScale), 0.3, 2.5) : 1.0
        var shapeDensityDraw = cfg && cfg.layer1ShapeDensity !== undefined ? clamp(Number(cfg.layer1ShapeDensity), 0.25, 2.5) : 1.0
        var maxDrawShapes = Math.max(1, Math.min(state.shockwaves.length, Math.round(6 * shapeDensityDraw)))

        ctx.save()
        ctx.globalCompositeOperation = "source-over"
        for (var sw = 0; sw < maxDrawShapes; sw++) {
            var wave = state.shockwaves[sw]
            var uProg = clamp(wave.r / 1.45, 0.0, 1.25)
            var wSizeMul = wave.sizeMul !== undefined ? wave.sizeMul : (0.65 + ((sw * 29) % 9) * 0.11)
            // Perspective size grows from pinpoint at distant horizon/endpoint to past diagR off screen, scaled by per-shape sizeMul!
            var wr = Math.pow(uProg, 1.45) * diagR * 0.92 * shapeScale * wSizeMul
            var wLaneX = wave.laneX !== undefined ? wave.laneX : (((sw % 3) - 1) * 0.26)
            var wLaneY = wave.laneY !== undefined ? wave.laneY : ((sw % 2 === 0 ? -1 : 1) * 0.18)
            var laneOffset = wLaneX * w * Math.pow(uProg, 1.15)
            var wcx = lerp(vanishX, cx + laneOffset, Math.min(1.0, uProg * 1.15))
            var isGroundUnit = (shapeStyle === 0 || (shapeStyle === 2 && (sw & 1) === 1))
            var wcy = isGroundUnit
                ? lerp(horizonY, h * 0.96, Math.pow(uProg, 1.35))
                : ((fieldOn && l1Mode === 4)
                    ? lerp(horizonY - h * 0.06, h * (0.26 + wLaneY * 0.45) + Math.sin(l1T * 1.5 + sw) * h * 0.06, Math.min(1.0, uProg * 1.1))
                    : lerp(cy + endPt.dy * 0.35, cy + wLaneY * h * uProg, uProg))
            var spinAngle = l1T * shapeSpin * 0.85 + (shapeSpin !== 0 ? sw * 0.25 : 0.0)
            var sAlpha = clamp(wave.alpha * (1.0 - dim), 0.06, 1.0)

            ctx.fillStyle = hslToHex((wave.hueOffset + 35) % 360, 0.92, 0.55, sAlpha * 0.14)
            ctx.strokeStyle = hslToHex(wave.hueOffset, 0.95, 0.62, sAlpha * 0.88)
            ctx.lineWidth = (1.8 + state.bass * 2.0) * Math.sqrt(shapeScale * wSizeMul)
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

            if (shapeStyle === 0) {
                // 0: 3D Battlezone Tanks (1980 Atari Battlezone 3D Wireframe Vector Tank rotating in 3D!)
                var ts = Math.max(10.0, wr * 0.38)
                var tankPitch = 0.22 + Math.sin(l1T * 0.85 + sw * 1.4) * 0.14
                var tankYaw = Math.sin(l1T * 0.9 + sw * 1.7) * 0.52 + spinAngle * spY * 0.45
                var tankRoll = Math.cos(l1T * 0.7 + sw * 1.1) * 0.12
                var turYaw = Math.sin(l1T * 1.45 + sw * 2.1) * 0.65
                var gunEl = 0.08 + state.beatPulse * 0.14
                var radSp = l1T * 4.5 + sw * 1.3
                append3DWireframeTank(ctx, wcx, wcy, ts, tankPitch, tankYaw, tankRoll, turYaw, gunEl, radSp)
                ctx.fill()
                ctx.stroke()
            } else if (shapeStyle === 1) {
                // 1: 1983 Atari Color-QuadraScan XY Vector Star Wars Craft (Standard TIE, Vader TIE Advanced x1, Rebel X-Wing)
                var cs = Math.max(10.0, wr * 0.40)
                var swPitch = Math.sin(l1T * 1.15 + sw * 1.9) * 0.34 + rx3 * 0.25
                var swYaw = Math.cos(l1T * 0.95 + sw * 1.5) * 0.48 + ry3 * 0.35
                var swRoll = Math.sin(l1T * 1.4 + sw * 2.1) * 0.32 + rz3 * 0.35
                append3DStarWarsFighter(ctx, craftVar, wcx, wcy, cs, swPitch, swYaw, swRoll)
                ctx.stroke()
            } else if (shapeStyle === 2) {
                // 2: 3D TRON Recognizers (1982 TRON 3D Wireframe Arch Craft rotating in 3D!)
                var rs = Math.max(12.0, wr * 0.42)
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
// (Seahorse Valley crevice / budding filament neck) of the Mandelbrot & Julia fractal shape,
// allowing the boundary to recursively subdivide ("fractal out/in") across self-similar generations!
function drawMode5JuliaFractals(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)

    // Smooth monotonic zoom accumulator (`state.zoomTime`) — supports Towards (1), Away (-1), and Breathe (0)!
    var zoomFlow = (state.zoomTime !== undefined ? state.zoomTime : state.t * 0.8) * 1.28
    var zoomFract = ((zoomFlow % 1.0) + 1.0) % 1.0
    var zoomGen = Math.floor(zoomFlow)

    // Active complex-plane POI coordinate (poiRe + i*poiIm) & Julia constant (cRe + i*cIm)
    var poiRe = (state.fractalRe !== undefined ? state.fractalRe : -0.7436) + Math.cos(state.t * 0.22) * 0.03
    var poiIm = (state.fractalIm !== undefined ? state.fractalIm : 0.1318) + Math.sin(state.t * 0.27) * 0.03
    var cRe = (state.fractalCRe !== undefined ? state.fractalCRe : -0.745) + Math.cos(state.t * 0.31) * (0.04 + state.bassSmooth * 0.04)
    var cIm = (state.fractalCIm !== undefined ? state.fractalCIm : 0.186) + Math.sin(state.t * 0.37) * (0.04 + state.midSmooth * 0.04)

    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)
    // Zoom focal point on screen (where the boundary section of the fractal is pinned as we zoom in/out)
    var focalX = cx + endPt.dx * 0.38
    var focalY = cy + endPt.dy * 0.38

    var trEnabled = cfg.layer2TracersEnabled !== undefined ? Boolean(cfg.layer2TracersEnabled) : true
    var trCount = trEnabled ? clamp(Math.round(Number(cfg.tracerCount) || 7), 1, 16) : 3
    var octaves = Math.max(5, Math.min(10, Math.round(4 + trCount * 0.35 * comp)))
    var ratio = 2.08 // Logarithmic magnification per self-similar boundary generation
    var baseScale = minDim * 0.014
    var folds = clamp(Math.round(Number(cfg.layer2Facets) || 6), 3, 12)
    var contourSteps = Math.max(64, Math.min(112, Math.floor(80 * comp)))
    var palShift = Math.floor((state.hueShift || 0) / 45)

    // Helper: evaluate a point on the multi-lobed Mandelbrot + Julia fractal boundary in local complex space,
    // where the Seahorse Valley boundary point (`theta = Math.PI * 0.82`) sits at local `(poiLocX, poiLocY)`.
    function evalFractalBoundaryLocal(theta, subDetail, cReVal, cImVal, bVal) {
        // 1. Exact Mandelbrot main cardioid: c(t) = 0.5*e^{it} - 0.25*e^{2it}
        var cardX = 0.5 * Math.cos(theta) - 0.25 * Math.cos(2.0 * theta)
        var cardY = 0.5 * Math.sin(theta) - 0.25 * Math.sin(2.0 * theta)

        // 2. Period-2 head bulb at theta ~ PI, Period-3 coronal bulbs at theta ~ ±PI/2, and apical antenna
        var dHead = Math.cos((theta - Math.PI) * 0.5)
        var headBulb = Math.pow(Math.max(0.0, dHead), 6.0) * 0.42
        var dTop = Math.cos((theta - Math.PI * 0.52) * 0.5)
        var dBot = Math.cos((theta + Math.PI * 0.52) * 0.5)
        var period3Bulbs = (Math.pow(Math.max(0.0, dTop), 8.0) + Math.pow(Math.max(0.0, dBot), 8.0)) * 0.26

        // 3. True z_{n+1} = z_n^2 + c escape-time orbit modulation along the boundary
        var zr = cardX + poiRe * 0.25
        var zi = cardY + poiIm * 0.25
        var smoothIter = 0.0
        for (var it = 0; it < 6; it++) {
            var r2 = zr * zr, i2 = zi * zi
            if (r2 + i2 > 6.5) break
            zi = 2.0 * zr * zi + cImVal
            zr = r2 - i2 + cReVal
            smoothIter += 1.0 / (1.0 + (r2 + i2) * 0.35)
        }
        var escapePot = clamp(smoothIter / 4.2, 0.15, 1.45)

        // 4. Recursive self-similar fractal sub-buds ("fractalling out/in" as subDetail increases with zoom!)
        var bud1 = Math.sin(folds * theta + escapePot * 2.4) * 0.14
        var bud2 = Math.cos(folds * 2.0 * theta - escapePot * 3.6 + state.phase * 0.5) * 0.09 * subDetail
        var bud3 = Math.sin(folds * 4.0 * theta + escapePot * 5.2 - state.t * 1.4) * 0.06 * subDetail * subDetail
        var radialOut = 1.0 + headBulb + period3Bulbs + bud1 + bud2 + bud3 + bVal * 0.18

        var nx = Math.cos(theta), ny = Math.sin(theta)
        return {
            x: cardX * radialOut - headBulb * 0.35 + nx * (bud1 + bud2 + bud3) * 0.45,
            y: cardY * radialOut + ny * (bud1 + bud2 + bud3) * 0.45,
            escapePot: escapePot
        }
    }

    // Boundary section angle on the Mandelbrot perimeter to zoom directly into (Seahorse Valley crevice at theta = 0.82 * PI)
    var poiTheta = Math.PI * 0.82 + Math.sin(state.t * 0.19) * 0.14

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    for (var oct = octaves - 1; oct >= 0; oct--) {
        var octProgress = oct + zoomFract
        var uOct = octProgress / octaves
        var octScale = baseScale * Math.pow(ratio, octProgress)
        var octWorld = zoomGen - oct

        // Smooth birth & exit fade-in/out envelope so new octaves emerge seamlessly from the boundary section
        var envAlpha = smoothstep(0.0, 0.20, uOct) * smoothstep(1.08, 0.82, uOct)
        if (envAlpha < 0.01) continue

        // Progressive recursive subdivision detail as this fractal generation zooms in ("fractals out/in")
        var subDetail = smoothstep(0.08, 0.88, uOct) * (0.75 + state.bassSmooth * 0.35)
        var octRot = octWorld * 0.42 + Math.sin(state.phase * 0.22 + octWorld * 0.7) * 0.24
        var cosR = Math.cos(octRot), sinR = Math.sin(octRot)

        // Pin the chosen boundary section `poiPt` of the fractal shape to `(focalX, focalY)` so the camera
        // genuinely zooms INTO the boundary edge of the fractal shape (not its dead interior centre)!
        var poiPt = evalFractalBoundaryLocal(poiTheta, subDetail, cRe, cIm, state.bassSmooth * 0.5)
        var poiRotX = poiPt.x * cosR - poiPt.y * sinR
        var poiRotY = poiPt.x * sinR + poiPt.y * cosR
        var shapeOriginX = focalX - poiRotX * octScale
        var shapeOriginY = focalY - poiRotY * octScale

        var colPrimary = palette[((octWorld * 2 + palShift) % palette.length + palette.length) % palette.length]
        var colSecondary = palette[((octWorld * 2 + 1 + palShift) % palette.length + palette.length) % palette.length]
        var colAccent = palette[((octWorld * 2 + 3 + palShift) % palette.length + palette.length) % palette.length]

        // 1. Main Mandelbrot & Julia Boundary Shape zooming through the boundary section at (focalX, focalY)
        ctx.fillStyle = colourWithAlpha(colPrimary, (0.10 + (1.0 - uOct) * 0.12 + state.bassSmooth * 0.06) * envAlpha)
        ctx.strokeStyle = colourWithAlpha(colSecondary, (0.58 + envAlpha * 0.40) * envAlpha)
        ctx.lineWidth = (1.2 + uOct * 2.6 + state.beatPulse * 1.1) * envAlpha

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

        // 2. Recursive Fractal Sub-Buds & Seahorse Valley Double-Spiral Filaments budding directly off the boundary!
        var budStride = Math.max(4, Math.floor(contourSteps / Math.max(5, Math.min(12, folds * 2))))
        ctx.strokeStyle = colourWithAlpha(colAccent, (0.66 + state.highSmooth * 0.32) * envAlpha)
        ctx.fillStyle = colourWithAlpha(colSecondary, (0.16 + state.bassSmooth * 0.12) * envAlpha)
        ctx.lineWidth = (1.0 + uOct * 1.8 + state.bassSmooth * 0.8) * envAlpha

        for (var bi = 0; bi < contourSteps; bi += budStride) {
            var bNode = boundaryPts[bi]
            var budScale = octScale * (0.16 + subDetail * 0.14 + bNode.band * 0.10)
            var outAng = bNode.theta

            if (((bi / budStride) + octWorld) & 1) {
                // Self-similar mini-Mandelbrot cardioid & head bulb budding outward from the parent boundary
                ctx.beginPath()
                var cSteps = 18
                for (var cs = 0; cs <= cSteps; cs++) {
                    var ct = (cs / cSteps) * Math.PI * 2
                    var cr = budScale * (0.55 * (1.0 - Math.cos(ct)) + 0.24 * Math.pow(Math.max(0.0, -Math.cos(ct)), 3.0))
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
            } else {
                // Unfurling Seahorse Valley logarithmic double-spiral dendrite fractalling out/in from the boundary node
                ctx.beginPath()
                var spSteps = 14
                var curlSign = ((bi & 2) === 0) ? 1.0 : -1.0
                for (var sp = 0; sp <= spSteps; sp++) {
                    var su = sp / spSteps
                    var sTheta = outAng + curlSign * su * Math.PI * (2.2 + subDetail * 1.2)
                    var sRad = budScale * 1.25 * Math.pow(1.0 - su * 0.82, 1.30)
                    var spx = bNode.x + Math.cos(sTheta) * sRad
                    var spy = bNode.y + Math.sin(sTheta) * sRad
                    if (sp === 0) ctx.moveTo(spx, spy)
                    else ctx.lineTo(spx, spy)
                }
                ctx.stroke()
            }
        }
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
    else drawMode11StrangeAttractor(ctx, w, h, state, palette, cfg)
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

function drawLayer3AlbumArt(ctx, w, h, state, palette, cfg, asciiLines, ttfxFrames) {
    if (!cfg || !cfg.layer3Enabled) return

    var l3Mode = (Number(cfg.layer3Mode) || 0) % LAYER3_MODES.length
    var rawAsciiMode = String(cfg.layer3AsciiMode || cfg.asciiMode || "braille").toLowerCase()
    var isWordsSource = (l3Mode === 5 || cfg.useAlbumArt === false || rawAsciiMode === "banner")
    var isBlockGlyph = (rawAsciiMode === "block")
    var isBrailleGlyph = !isBlockGlyph

    // Select source lines:
    //   - Words source (`useAlbumArt === false` or `l3Mode === 5`): prefer `cfg.bannerLines`, fallback to `asciiLines`
    //   - Art source (`useAlbumArt === true`): prefer `cfg.artLines`, fallback to `asciiLines`
    var effectiveLines = asciiLines
    if (isWordsSource && cfg.bannerLines && cfg.bannerLines.length > 0) {
        effectiveLines = cfg.bannerLines
    } else if (!isWordsSource && cfg.artLines && cfg.artLines.length > 0) {
        effectiveLines = cfg.artLines
    }

    if (!effectiveLines || effectiveLines.length === 0) return

    var glyphStyleKey = (isWordsSource ? "words:" : "art:") + (isBlockGlyph ? "block" : "braille")
    rebuildArtCells(state, effectiveLines, glyphStyleKey)
    var cells = state.artCells
    if (!cells || cells.length === 0) return

    var cx = w * 0.5
    var cy = h * 0.5
    var scale = clamp(Number(cfg.layer3Scale !== undefined ? cfg.layer3Scale : 1.0), 0.5, 2.5)
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

    // Layer #3 3D Graded History Tracers (`layer3Tracers`)
    var l3Tracers = clamp(Math.round(Number(cfg.layer3Tracers !== undefined ? cfg.layer3Tracers : 3)), 1, 6)
    var tracerSpeed = state.liveTracerSpeed !== undefined
        ? state.liveTracerSpeed
        : clamp(Number(cfg.tracerSpeed !== undefined ? cfg.tracerSpeed : 1.15), 0.15, 3.0)
    var tracerDrift = state.liveTracerDrift !== undefined
        ? state.liveTracerDrift
        : clamp(Number(cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0), 0.0, 2.5)
    var tracerDir = Number(cfg.tracerDirection !== undefined ? cfg.tracerDirection : 1)
    var endPt = computeTracerEndpoint(w, h, state.driftTime !== undefined ? state.driftTime : state.t, tracerDrift, 1.0)
    var numBuckets = 6

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

        ctx.save()
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = clamp(passAlpha, 0.05, 1.0)
        if (isEcho) {
            ctx.translate(cx + tx, cy + ty)
            ctx.scale(zScale, zScale)
            ctx.translate(-cx, -cy)
        }

        for (var b = 0; b < numBuckets; b++) {
            var col = palette[(b + e + Math.floor(state.hueShift / 60)) % palette.length]
            ctx.fillStyle = col
            ctx.beginPath()

            for (var i = b; i < cells.length; i += cellStride) {
                var p = cells[i]
                if (l3Mode === 1 && p.alive < 0.42) continue

                var bVal = state.smoothBands[(i * 3) & 63] || 0.0
                var px = cx + p.x * halfW
                var py = cy + p.y * halfH

                if (activeTtfxFrame && p.gy < activeTtfxFrame.length) {
                    var tLine = activeTtfxFrame[p.gy] || ""
                    var tCh = p.gx < tLine.length ? tLine.charAt(p.gx) : " "
                    if (tCh === " " || tCh === "⠀") {
                        px += Math.cos(p.phase + state.t * 2.4) * (14.0 + state.bassSmooth * 28.0)
                        py += Math.sin(p.phase - state.t * 2.4) * (14.0 + state.bassSmooth * 28.0)
                    }
                }

                var pulseBoost = 0.82 + p.density * 0.18 + bVal * 0.22
                var szW = tileW * pulseBoost
                var szH = tileH * pulseBoost

                if (isBrailleGlyph) {
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
            }
            ctx.fill()
        }
        ctx.restore()
    }
}

// ---------------------------------------------------------------------------
// Master 3-Layer Composite Frame Renderer
// ---------------------------------------------------------------------------

function normaliseConfig(cfg, mode, asciiLines) {
    var c = cfg || {}
    var pos = Number(c.position) || 0.0
    var dur = Number(c.duration) || 0.0
    var prog = c.trackProgress !== undefined ? Number(c.trackProgress) : (dur > 0 ? clamp(pos / dur, 0.0, 1.0) : 0.0)
    var geomDetail = c.geometryDetail !== undefined ? clamp(Number(c.geometryDetail), 0.50, 2.00) : 1.0
    var l2TrOn = c.layer2TracersEnabled !== undefined ? Boolean(c.layer2TracersEnabled) : true
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
        backdropEnabled: c.backdropEnabled !== undefined ? Boolean(c.backdropEnabled) : false,
        backdropMode: c.backdropMode !== undefined ? clamp(Math.round(Number(c.backdropMode)), 0, 6) : 0,
        backdropSpeed: c.backdropSpeed !== undefined ? clamp(Number(c.backdropSpeed), 0.1, 3.0) : 1.0,
        backdropIntensity: c.backdropIntensity !== undefined ? clamp(Number(c.backdropIntensity), 0.2, 2.0) : 1.0,
        backdropSymmetry: c.backdropSymmetry !== undefined ? clamp(Math.round(Number(c.backdropSymmetry)), 2, 16) : 6,
        backdropDirection: c.backdropDirection !== undefined ? Number(c.backdropDirection) : 1,
        trackArcMode: c.trackArcMode !== undefined ? clamp(Math.round(Number(c.trackArcMode)), 0, 4) : 0,
        tracerCount: l2TrOn ? (c.tracerCount !== undefined ? clamp(Math.round(Number(c.tracerCount)), 1, 16) : 4) : 1,
        tracerSpeed: c.tracerSpeed !== undefined ? clamp(Number(c.tracerSpeed), 0.15, 3.0) : 1.15,
        tracerDrift: c.tracerDrift !== undefined ? clamp(Number(c.tracerDrift), 0.0, 2.5) : 1.0,
        tracerDirection: c.tracerDirection !== undefined ? Number(c.tracerDirection) : 1,
        layer1Enabled: c.layer1Enabled !== undefined ? Boolean(c.layer1Enabled) : true,
        layer1FieldEnabled: c.layer1FieldEnabled !== undefined ? Boolean(c.layer1FieldEnabled) : true,
        layer1Mode: Number(c.layer1Mode) || 0,
        layer1Direction: c.layer1Direction !== undefined ? Number(c.layer1Direction) : 1,
        layer1Trail: Number(c.layer1Trail !== undefined ? c.layer1Trail : (c.layer1Persistence !== undefined ? c.layer1Persistence : 0.85)),
        layer1Speed: Number(c.layer1Speed !== undefined ? c.layer1Speed : 1.0),
        layer1Density: Number(c.layer1Density !== undefined ? c.layer1Density : 1.0) * geomDetail,
        layer1Dim: Number(c.layer1Dim !== undefined ? c.layer1Dim : 0.15),
        layer1EqEnabled: c.layer1EqEnabled !== undefined ? Boolean(c.layer1EqEnabled) : false,
        layer1EqStyle: c.layer1EqStyle !== undefined ? clamp(Math.round(Number(c.layer1EqStyle)), 0, LAYER1_EQ_STYLES.length - 1) : 0,
        layer1EqLayout: c.layer1EqLayout !== undefined ? clamp(Math.round(Number(c.layer1EqLayout)), 0, 2) : 0,
        layer1EqGain: c.layer1EqGain !== undefined ? clamp(Number(c.layer1EqGain), 0.4, 2.5) : 1.25,
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
        layer2Mode: Number(c.layer2Mode !== undefined ? c.layer2Mode : (c.mode !== undefined ? c.mode : (mode || 0))),
        layer2Facets: Number(c.layer2Facets !== undefined ? c.layer2Facets : (c.symmetryFolds !== undefined ? c.symmetryFolds : 6)),
        layer2Complexity: Number(c.layer2Complexity !== undefined ? c.layer2Complexity : 1.0) * geomDetail,
        layer2Speed: Number(c.layer2Speed !== undefined ? c.layer2Speed : 1.0),
        layer2Reactivity: Number(c.layer2Reactivity !== undefined ? c.layer2Reactivity : (c.sensitivity !== undefined ? c.sensitivity : 1.35)),
        layer2Zoom: Number(c.layer2Zoom !== undefined ? c.layer2Zoom : 1.0),
        layer2Chaos: Number(c.layer2Chaos !== undefined ? c.layer2Chaos : 0.45),
        layer3Enabled: c.layer3Enabled !== undefined ? Boolean(c.layer3Enabled) : true,
        layer3Mode: Number(c.layer3Mode) || 0,
        layer3Dismantle: Number(c.layer3Dismantle !== undefined ? c.layer3Dismantle : 1.15),
        layer3Rebuild: Number(c.layer3Rebuild !== undefined ? c.layer3Rebuild : 1.0),
        layer3Evolution: Number(c.layer3Evolution !== undefined ? c.layer3Evolution : 0.85),
        layer3Scale: Number(c.layer3Scale !== undefined ? c.layer3Scale : 1.0),
        layer3Tracers: c.layer3Tracers !== undefined ? clamp(Math.round(Number(c.layer3Tracers)), 1, 6) : 3,
        layer3AsciiMode: c.layer3AsciiMode || c.asciiMode || "braille",
        asciiMode: c.asciiMode || c.layer3AsciiMode || "braille",
        useAlbumArt: c.useAlbumArt !== undefined ? Boolean(c.useAlbumArt) : true,
        bannerLines: c.bannerLines || [],
        artLines: c.artLines || [],
        trackProgress: prog
    }
}

function renderFrame(ctx, w, h, state, mode, theme, asciiLines, asciiSource, ttfxFrames, cfg, canvasItem) {
    if (w <= 4 || h <= 4) return

    // Backward-compatible support if called with 6 args: renderFrame(ctx, w, h, state, rawBands, opts)
    if (Array.isArray(mode) && typeof theme === "object" && asciiLines === undefined) {
        var legacyBands = mode
        var legacyOpts = theme || {}
        var legacyCfg = normaliseConfig(legacyOpts, legacyOpts.mode || 0, legacyOpts.asciiLines)
        stepState(state, legacyBands, legacyCfg.playing, legacyCfg, 0.016)
        var legacyPalette = buildPalette(legacyOpts.themeColours, state.hueShift, legacyCfg.palette)
        drawLayer1Background(ctx, null, w, h, state, legacyOpts.themeColours, legacyPalette, legacyCfg)
        drawLayer2Visualiser(ctx, w, h, state, legacyPalette, legacyCfg)
        drawLayer3AlbumArt(ctx, w, h, state, legacyPalette, legacyCfg, legacyOpts.asciiLines || [], legacyOpts.ttfxFrames || [])
        return
    }

    var effectiveCfg = normaliseConfig(cfg, mode, asciiLines)
    var palette = buildPalette(theme, state.hueShift, effectiveCfg.palette)

    // Layer #1: Background & Iterative Framebuffer Feedback
    drawLayer1Background(ctx, canvasItem, w, h, state, theme, palette, effectiveCfg)

    // Layer #2: Psychedelic & Nightclub Visualiser Engine (with Universal 3D Graded History Tracers)
    drawLayer2Visualiser(ctx, w, h, state, palette, effectiveCfg)

    // Layer #3: Album Art & Words Dismantle, Evolution, Tracers & Rebuild Engine
    drawLayer3AlbumArt(ctx, w, h, state, palette, effectiveCfg, asciiLines, ttfxFrames)
}
