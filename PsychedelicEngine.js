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
    "Synthwave Horizon EQ",
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

var LAYER1_EQ_STYLES = [
    "Skyline Mountain",
    "LED Bars & Peaks",
    "Mirrored Reflection",
    "3D Waterfall Ridges",
    "Synth Sun Rays",
    "Centre Twin Wave"
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
    "Sacred Polygons",
    "Sonic Boom Rings",
    "Merkaba Starbursts",
    "Diamond Portals",
    "Cyber Hex Brackets",
    "Lotus Ripple Waves"
]

var TRACK_ARC_MODES = [
    "Off (Manual)",
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
        phase: 0.0,
        hueShift: 0.0,
        rollingPeak: 120.0,
        silentFrames: 0,
        smoothBands: smooth,
        peakBands: peaks,
        waveHistory: waveHist,
        waveform: [],
        bass: 0.0,
        mid: 0.0,
        high: 0.0,
        bassSmooth: 0.0,
        midSmooth: 0.0,
        highSmooth: 0.0,
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
    var key = asciiLines.length + ":" + (asciiLines[0] || "").slice(0, 24) + ":" + (asciiLines[Math.floor(asciiLines.length / 2)] || "").slice(0, 24)
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

    // Sample non-blank cells up to 520 autonomous particles (48x24 active grid budget) for <0.4ms 60 FPS
    var candidates = []
    for (var y = 0; y < rows; y++) {
        var line = asciiLines[y] || ""
        for (var x = 0; x < line.length; x++) {
            var ch = line.charAt(x)
            if (ch === " " || ch === "⠀") continue
            var code = ch.charCodeAt(0)
            var density = 0.65
            var brailleMask = 0
            if (code >= 0x2800 && code <= 0x28FF) {
                brailleMask = code - 0x2800
                var pop = 0
                for (var b = 0; b < 8; b++) {
                    if ((brailleMask >> b) & 1) pop++
                }
                if (pop <= 1) continue
                density = pop / 8.0
            } else if (ch === "░" || ch === "." || ch === "·") {
                density = 0.25
            } else if (ch === "▒" || ch === ":") {
                density = 0.50
            } else if (ch === "▓") {
                density = 0.78
            } else if (ch === "█") {
                density = 1.0
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

    var maxParticles = 520
    var stride = candidates.length > maxParticles ? (candidates.length / maxParticles) : 1.0
    var cells = []
    var count = Math.min(maxParticles, candidates.length)
    for (var i = 0; i < count; i++) {
        var c = candidates[Math.min(candidates.length - 1, Math.floor(i * stride))]
        var dist = Math.sqrt(c.nx * c.nx + c.ny * c.ny)
        var ang = Math.atan2(c.ny, c.nx)
        // Evolved target coordinates: morphing into a phyllotaxis spiral / sacred mandala
        var goldenAng = i * 2.399963229728653
        var spiralR = Math.sqrt((i + 0.5) / Math.max(1, count)) * 0.92
        var mandAng = Math.round(ang / (Math.PI / 6.0)) * (Math.PI / 6.0) + Math.sin(dist * 6.0) * 0.28
        var evoX = lerp(Math.cos(goldenAng) * spiralR, Math.cos(mandAng) * dist, 0.5)
        var evoY = lerp(Math.sin(goldenAng) * spiralR, Math.sin(mandAng) * dist, 0.5)

        cells.push({
            gx: c.gx,
            gy: c.gy,
            homeX: c.nx,
            homeY: c.ny,
            evoX: evoX,
            evoY: evoY,
            x: c.nx + (Math.random() - 0.5) * 0.15,
            y: c.ny + (Math.random() - 0.5) * 0.15,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
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
        var spd = (0.6 + Math.random() * 1.4) * (strength || 1.0)
        p.vx += Math.cos(ang) * spd
        p.vy += Math.sin(ang) * spd
    }
}

function shatterAlbumArt(state, strength) {
    triggerArtBurst(state, strength)
}

function randomiseState(state) {
    if (!state) return
    state.hueShift = (state.hueShift + 65 + Math.random() * 190) % 360
    state.rotPolarity = -state.rotPolarity
    state.beatCount = (state.beatCount || 0) + 1
    state.avsHarmonics = {
        m: 2 + Math.floor(Math.random() * 7),
        n: 3 + Math.floor(Math.random() * 9),
        k: 1 + Math.floor(Math.random() * 6),
        twist: 0.8 + Math.random() * 2.8,
        style: Math.floor(Math.random() * 3)
    }
    triggerArtBurst(state, 1.35)
}

function stepState(state, rawBands, active, cfg, dt) {
    cfg = normaliseConfig(cfg)
    dt = clamp(Number(dt) || 0.016, 0.004, 0.055)
    var reactivity = clamp(Number(cfg.layer2Reactivity !== undefined ? cfg.layer2Reactivity : 1.35), 0.15, 4.0)
    var l2Speed = clamp(Number(cfg.layer2Speed !== undefined ? cfg.layer2Speed : 1.0), 0.1, 4.0)
    var chaos = clamp(Number(cfg.layer2Chaos !== undefined ? cfg.layer2Chaos : 0.4), 0.0, 2.0)

    var n = rawBands ? rawBands.length : 0
    var maxRaw = 0.0
    for (var r = 0; r < n; r++) {
        var rv = Number(rawBands[r]) || 0.0
        if (rv > maxRaw) maxRaw = rv
    }

    if (maxRaw > 1.0) {
        state.silentFrames = 0
        if (maxRaw > state.rollingPeak) {
            state.rollingPeak = state.rollingPeak + (maxRaw - state.rollingPeak) * 0.38
        } else {
            state.rollingPeak = Math.max(60.0, state.rollingPeak * (1.0 - dt * 0.45))
        }
    } else {
        state.silentFrames = (state.silentFrames || 0) + 1
    }

    var denom = Math.max(60.0, state.rollingPeak)
    var useSynthFallback = active && state.silentFrames > 15
    var bassSum = 0.0, midSum = 0.0, highSum = 0.0

    for (var i = 0; i < 64; i++) {
        var norm = 0.0
        if (useSynthFallback) {
            var beatWave = Math.pow(Math.max(0.0, Math.sin(state.t * 4.4)), 6.0)
            var sub = i < 10 ? beatWave * 0.85 : 0.0
            var harm = (0.28 + 0.24 * Math.sin(state.t * 2.7 + i * 0.22) + 0.18 * Math.cos(state.t * 5.3 - i * 0.35))
            norm = clamp((sub + harm) * reactivity * 0.75, 0.03, 1.0)
        } else if (n > 0) {
            var raw = Number(rawBands[i % n]) || 0.0
            norm = clamp(Math.pow(clamp(raw / denom, 0.0, 1.25), 0.72) * reactivity, 0.0, 1.0)
        } else {
            norm = 0.03 + 0.02 * Math.sin(state.t * 1.8 + i * 0.2)
        }

        var prev = state.smoothBands[i] || 0.0
        var attack = norm > prev ? clamp(dt * 34.0, 0.2, 0.82) : clamp(dt * 12.0, 0.08, 0.45)
        var s = prev + (norm - prev) * attack
        state.smoothBands[i] = s

        if (s >= (state.peakBands[i] || 0.0)) {
            state.peakBands[i] = s
        } else {
            state.peakBands[i] = Math.max(s, (state.peakBands[i] || 0.0) - dt * 0.65)
        }

        if (i < 10) bassSum += s * (i < 5 ? 1.35 : 0.85)
        else if (i < 34) midSum += s
        else highSum += s
    }

    var bassRaw = clamp(bassSum / 11.0, 0.0, 1.0)
    var midRaw = clamp(midSum / 24.0, 0.0, 1.0)
    var highRaw = clamp(highSum / 30.0, 0.0, 1.0)

    // MilkDrop relative audio attenuation (`bass_att`, `mid_att`, `treb_att`)
    state.bassFast = 0.65 * (state.bassFast || bassRaw) + 0.35 * bassRaw
    state.bassSlow = 0.985 * (state.bassSlow || bassRaw) + 0.015 * bassRaw
    state.midFast = 0.65 * (state.midFast || midRaw) + 0.35 * midRaw
    state.midSlow = 0.985 * (state.midSlow || midRaw) + 0.015 * midRaw
    state.trebFast = 0.65 * (state.trebFast || highRaw) + 0.35 * highRaw
    state.trebSlow = 0.985 * (state.trebSlow || highRaw) + 0.015 * highRaw

    state.bassAtt = clamp(state.bassFast / Math.max(0.04, state.bassSlow), 0.2, 3.5)
    state.midAtt = clamp(state.midFast / Math.max(0.04, state.midSlow), 0.2, 3.5)
    state.trebAtt = clamp(state.trebFast / Math.max(0.04, state.trebSlow), 0.2, 3.5)

    var bass = clamp(bassRaw * (0.58 + 0.42 * state.bassAtt), 0.0, 1.35)
    var mid = clamp(midRaw * (0.58 + 0.42 * state.midAtt), 0.0, 1.35)
    var high = clamp(highRaw * (0.58 + 0.42 * state.trebAtt), 0.0, 1.35)

    state.bass = clamp(bass, 0.0, 1.0)
    state.mid = clamp(mid, 0.0, 1.0)
    state.high = clamp(high, 0.0, 1.0)
    state.bassSmooth = state.bass
    state.midSmooth = state.mid
    state.highSmooth = state.high
    state.energy = clamp(state.bass * 0.50 + state.mid * 0.32 + state.high * 0.18, 0.0, 1.0)

    // Dual-envelope onset / beat detector
    state.kickFast = lerp(state.kickFast || bass, bass, clamp(dt * 28.0, 0.1, 0.85))
    state.kickSlow = lerp(state.kickSlow || bass, bass, clamp(dt * 3.8, 0.02, 0.25))
    state.snareFast = lerp(state.snareFast || mid, (mid + high) * 0.5, clamp(dt * 26.0, 0.1, 0.85))
    state.snareSlow = lerp(state.snareSlow || mid, (mid + high) * 0.5, clamp(dt * 4.2, 0.02, 0.25))

    state.beatCooldown = Math.max(0.0, (state.beatCooldown || 0.0) - dt)
    var kickRatio = state.kickSlow > 0.04 ? (state.kickFast / state.kickSlow) : 1.0
    var snareRatio = state.snareSlow > 0.04 ? (state.snareFast / state.snareSlow) : 1.0

    if ((kickRatio > 1.18 && state.kickFast > 0.14 || snareRatio > 1.26 && state.snareFast > 0.18) && state.beatCooldown <= 0.0) {
        state.beatPulse = 1.0
        state.beatFlash = 1.0
        state.beatCooldown = 0.19
        state.beatCount = (state.beatCount || 0) + 1
        if (state.beatCount % 2 === 0) {
            state.rotPolarity = -state.rotPolarity
        }
        // AVS SuperScope onBeat harmonic mutation
        state.avsHarmonics = {
            m: 2 + ((state.beatCount * 3) % 7),
            n: 3 + ((state.beatCount * 5) % 9),
            k: 1 + ((state.beatCount * 2) % 6),
            twist: 0.8 + ((state.beatCount * 1.7) % 3.2) * (0.5 + chaos * 0.6),
            style: state.beatCount % 3
        }
        if (state.shockwaves.length < 7) {
            state.shockwaves.push({
                r: 0.02,
                alpha: 0.92,
                speed: 0.85 + bass * 1.45,
                hueOffset: (state.hueShift + state.beatCount * 47) % 360,
                sides: 3 + (state.beatCount % 7)
            })
        }
    } else {
        state.beatPulse = Math.max(0.0, state.beatPulse - dt * 4.2)
        state.beatFlash = Math.max(0.0, state.beatFlash - dt * 6.5)
    }

    state.artBurst = Math.max(0.0, (state.artBurst || 0.0) - dt * 1.8)

    // Music-Driven Parameter Modulation envelopes (`musicDrive`) & Song Track Progress Arc (`trackArcMode`)
    var rawIntensity = clamp(state.energy * 0.65 + state.beatPulse * 0.45 + (state.bassAtt - 1.0) * 0.25, 0.0, 1.5)
    state.musicIntensity = lerp(state.musicIntensity || 0.35, rawIntensity, clamp(dt * 8.0, 0.05, 0.4))
    state.musicCalm = clamp(1.0 - state.musicIntensity * 0.85, 0.08, 1.0)

    var trackProg = clamp(Number(cfg.trackProgress) || 0.0, 0.0, 1.0)
    var arcMode = cfg.trackArcMode !== undefined ? clamp(Math.round(Number(cfg.trackArcMode)), 0, 4) : 1
    var arcDismantleMul = 1.0
    var arcRebuildMul = 1.0
    var arcEvoBoost = 0.55 * trackProg
    var arcSpeedBoost = 1.0
    state.trackArcChapter = Math.min(3, Math.floor(trackProg * 4.0))

    if (arcMode === 0) {
        // 0: Off (Manual) — parameters stay independent of track position
        arcEvoBoost = 0.0
    } else if (arcMode === 1) {
        // 1: Song Climax Arc (0% Calm -> 75% Peak -> 100% Resolve)
        var climaxCurve = Math.sin(Math.pow(trackProg, 0.82) * Math.PI)
        arcDismantleMul = 0.55 + 1.05 * climaxCurve
        arcRebuildMul = 1.35 - 0.65 * climaxCurve + (trackProg > 0.82 ? (trackProg - 0.82) * 3.5 : 0.0)
        arcEvoBoost = 0.78 * climaxCurve
        arcSpeedBoost = 0.85 + 0.45 * climaxCurve
    } else if (arcMode === 2) {
        // 2: Progressive Dismantle (0% Intact -> 100% Shattered)
        arcDismantleMul = 0.25 + 1.85 * trackProg
        arcRebuildMul = clamp(1.85 - 1.45 * trackProg, 0.25, 2.2)
        arcEvoBoost = 1.15 * trackProg
        arcSpeedBoost = 0.80 + 0.65 * trackProg
    } else if (arcMode === 3) {
        // 3: Progressive Rebuild (0% Chaos -> 100% Coalesced)
        arcDismantleMul = clamp(1.90 - 1.65 * trackProg, 0.20, 2.2)
        arcRebuildMul = 0.35 + 2.10 * trackProg
        arcEvoBoost = 0.95 * (1.0 - trackProg)
        arcSpeedBoost = 1.35 - 0.45 * trackProg
    } else if (arcMode === 4) {
        // 4: Quarter-Track Chapters (25% / 50% / 75% Shifts)
        var ch = state.trackArcChapter // 0, 1, 2, 3
        arcDismantleMul = (ch === 0 ? 0.65 : (ch === 1 ? 1.15 : (ch === 2 ? 1.65 : 0.75)))
        arcRebuildMul = (ch === 0 ? 1.35 : (ch === 1 ? 0.95 : (ch === 2 ? 0.65 : 1.75)))
        arcEvoBoost = ch * 0.32
        arcSpeedBoost = 0.85 + ch * 0.22
    }

    var mDrive = cfg.musicDrive !== undefined ? Boolean(cfg.musicDrive) : true
    state.liveDismantle = mDrive
        ? clamp(cfg.layer3Dismantle * (0.20 + 1.45 * state.musicIntensity + state.beatPulse * 1.15) * arcDismantleMul, 0.10, 3.50)
        : clamp(cfg.layer3Dismantle * arcDismantleMul, 0.10, 3.50)
    state.liveRebuild = mDrive
        ? clamp(cfg.layer3Rebuild * (0.45 + 1.65 * state.musicCalm) * arcRebuildMul, 0.15, 3.50)
        : clamp(cfg.layer3Rebuild * arcRebuildMul, 0.15, 3.50)
    state.liveEvolution = mDrive
        ? clamp(cfg.layer3Evolution * (0.40 + 1.15 * state.mid + arcEvoBoost), 0.10, 3.00)
        : clamp(cfg.layer3Evolution * (0.65 + arcEvoBoost), 0.10, 3.00)
    state.liveTracerSpeed = mDrive
        ? clamp(cfg.tracerSpeed * (0.60 + 0.95 * state.musicIntensity + state.beatPulse * 0.55) * arcSpeedBoost, 0.15, 3.00)
        : clamp(cfg.tracerSpeed * arcSpeedBoost, 0.15, 3.00)
    state.liveTracerDrift = mDrive
        ? clamp(cfg.tracerDrift * (0.65 + 0.85 * state.mid), 0.0, 2.50)
        : cfg.tracerDrift

    var timeStep = dt * l2Speed * (active ? (0.85 + state.energy * 1.85 + state.beatPulse * 0.65) : 0.25)
    state.t += timeStep
    state.phase += timeStep * 0.75 * state.rotPolarity
    state.hueShift = (state.hueShift + dt * (22.0 + state.energy * 95.0 + state.beatPulse * 80.0)) % 360.0

    // Record 32-band snapshot into state.waveHistory ring buffer (for Cthugha 3D Plasma Tunnel & L1 3D Waterfall EQ)
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

    // Step Layer #1 Beat Shapes (shockwaves moving towards the user)
    var shapeSpeed = clamp(Number(cfg && cfg.layer1ShapeSpeed !== undefined ? cfg.layer1ShapeSpeed : 1.0), 0.2, 3.0)
    var shapesOn = cfg ? (cfg.layer1ShapesEnabled !== false) : true
    if (shapesOn && active && state.shockwaves.length === 0) {
        state.shockwaves.push({
            r: 0.08,
            alpha: 0.85,
            speed: 0.75 + bass * 1.15,
            hueOffset: (state.hueShift + state.beatCount * 47) % 360,
            sides: 3 + (state.beatCount % 6)
        })
    }
    for (var sw = state.shockwaves.length - 1; sw >= 0; sw--) {
        var wave = state.shockwaves[sw]
        wave.r += dt * wave.speed * shapeSpeed
        wave.alpha -= dt * 0.55 * (0.6 + 0.4 * shapeSpeed)
        if (wave.alpha <= 0.02 || wave.r > 1.45) {
            state.shockwaves.splice(sw, 1)
        }
    }

    // Step Layer #1 Starfield
    var l1Speed = clamp(Number(cfg && cfg.layer1Speed !== undefined ? cfg.layer1Speed : 1.0), 0.1, 4.0)
    var starVel = dt * l1Speed * (0.35 + bass * 1.65 + state.beatPulse * 0.95)
    for (var st = 0; st < state.stars.length; st++) {
        var star = state.stars[st]
        star.pz = star.z
        star.z -= starVel
        if (star.z <= 0.03) {
            star.x = (Math.random() - 0.5) * 2.2
            star.y = (Math.random() - 0.5) * 2.2
            star.z = 1.0
            star.pz = 1.0
        }
    }

    // Step Layer #1 Cthugha Flame ribbons
    for (var fl = 0; fl < state.flames.length; fl++) {
        var fm = state.flames[fl]
        var bIdx = Math.min(63, Math.floor(fm.x * 63))
        var bandE = state.smoothBands[bIdx] || 0.1
        fm.y -= dt * l1Speed * (fm.vy + bandE * 0.95 + bass * 0.45)
        fm.x += Math.sin(state.t * 2.2 + fl * 0.5) * dt * 0.08 * (1.0 + mid)
        fm.energy = lerp(fm.energy, bandE, 0.35)
        if (fm.y < -0.05) {
            fm.y = 1.02
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
    var dismantle = state.liveDismantle !== undefined
        ? state.liveDismantle
        : clamp(Number(cfg.layer3Dismantle !== undefined ? cfg.layer3Dismantle : 1.15), 0.0, 4.0)
    var rebuild = state.liveRebuild !== undefined
        ? state.liveRebuild
        : clamp(Number(cfg.layer3Rebuild !== undefined ? cfg.layer3Rebuild : 1.0), 0.05, 4.0)
    var evoRate = state.liveEvolution !== undefined
        ? state.liveEvolution
        : clamp(Number(cfg.layer3Evolution !== undefined ? cfg.layer3Evolution : 0.65), 0.0, 3.0)
    var trackProg = clamp(Number(cfg.trackProgress) || 0.0, 0.0, 1.0)
    var arcMode = cfg.trackArcMode !== undefined ? clamp(Math.round(Number(cfg.trackArcMode)), 0, 4) : 1

    // Evolution blend: responds to trackProgress & trackArcMode so cover art evolves across the song
    var progWeight = arcMode === 0 ? 0.0 : (arcMode === 3 ? (1.0 - trackProg) : trackProg)
    var evoMix = clamp(
        progWeight * 0.72 * evoRate + (0.5 - 0.5 * Math.cos(state.t * 0.22 * evoRate)) * 0.38 * evoRate,
        0.0,
        1.0
    )

    // Cyclic dismantle wave: periodically dismantles on beats and phrases, then rebuilds
    var phraseWave = Math.max(0.0, Math.sin(state.t * 0.85))
    var forceScale = dismantle * (state.bass * 1.15 + state.beatPulse * 1.85 + state.artBurst * 1.6 + phraseWave * 0.35)
    var springK = rebuild * (3.2 + (1.0 - phraseWave) * 4.5)
    var damping = Math.exp(-dt * (3.4 + rebuild * 1.4))

    for (var i = 0; i < n; i++) {
        var p = cells[i]
        // Target home morphs from original cover-art pixel (homeX, homeY) to evolved coordinates (evoX, evoY)
        var tx = lerp(p.homeX, p.evoX, evoMix)
        var ty = lerp(p.homeY, p.evoY, evoMix)

        var bIdx = (i * 3) & 63
        var bandVal = state.smoothBands[bIdx] || 0.0

        if (l3Mode === 0) {
            // Mode 0: Shatter & Imperfect Evolving Reassemble
            var rx = p.x || 0.001
            var ry = p.y || 0.001
            var rDist = Math.sqrt(rx * rx + ry * ry) + 0.05
            if (state.beatPulse > 0.35 || forceScale > 0.8) {
                var fault = Math.sin(p.homeX * 7.0 + p.homeY * 5.0 + state.beatCount * 1.3)
                var shatter = (bandVal * 1.4 + state.beatPulse * 1.8) * dismantle * (0.4 + 0.6 * Math.abs(fault))
                p.vx += (rx / rDist + Math.sin(p.phase + state.t) * 0.45) * shatter * dt * 5.2
                p.vy += (ry / rDist + Math.cos(p.phase - state.t) * 0.45) * shatter * dt * 5.2
            }
        } else if (l3Mode === 1) {
            // Mode 1: Cellular Automata & Mycelial Organic Growth
            var caAngle = Math.sin(p.x * 4.5 + state.t * 1.4) * Math.cos(p.y * 4.5 - state.t * 1.1) * Math.PI * 2
            var caPush = (0.35 + bandVal * 1.8 + state.mid * 1.2) * dismantle
            p.vx += Math.cos(caAngle + p.phase) * caPush * dt * 3.8
            p.vy += Math.sin(caAngle + p.phase) * caPush * dt * 3.8
            p.alive = 0.35 + 0.65 * Math.abs(Math.sin(state.t * 2.5 + p.gx * 0.35 + p.gy * 0.35 + bandVal * 4.0))
        } else if (l3Mode === 2) {
            // Mode 2: Blackhole Accretion & Supernova Ejection
            var bx = -p.x
            var by = -p.y
            var bDist = Math.sqrt(bx * bx + by * by) + 0.06
            // Tangential swirl + gravity cycle (suck in during build-up, blast out on beat drop!)
            var suckOrBlast = (state.beatPulse > 0.3 || Math.sin(state.t * 0.9) < -0.45) ? -2.8 : 1.65
            var grav = dismantle * (0.6 + state.bass * 1.9) / (bDist * 0.8 + 0.25)
            p.vx += ((bx / bDist) * suckOrBlast - (by / bDist) * 1.85) * grav * dt * 2.4
            p.vy += ((by / bDist) * suckOrBlast + (bx / bDist) * 1.85) * grav * dt * 2.4
        } else if (l3Mode === 3) {
            // Mode 3: Tectonic Shear & Melted Acid Drizzle
            var strata = Math.floor((p.homeY + 1.0) * 6.0)
            var shearDir = (strata % 2 === 0) ? 1.0 : -1.0
            p.vx += shearDir * (state.bass * 1.8 + bandVal * 1.5) * dismantle * dt * 4.5
            p.vy += (0.25 + state.high * 2.2 + bandVal * 1.6) * dismantle * dt * 3.2
            if (p.y > 1.25) {
                p.y = -1.15
                p.vy = 0.0
            }
        } else if (l3Mode === 4) {
            // Mode 4: Boids Swarm Flocking & Vortex Morph
            var flockX = Math.cos(state.t * 1.3 + (i % 5) * 1.25) * 0.55
            var flockY = Math.sin(state.t * 1.7 + (i % 5) * 1.25) * 0.55
            var dxF = flockX - p.x
            var dyF = flockY - p.y
            p.vx += (dxF * 2.2 - dyF * 2.6) * dismantle * (0.4 + state.energy * 1.5) * dt
            p.vy += (dyF * 2.2 + dxF * 2.6) * dismantle * (0.4 + state.energy * 1.5) * dt
        } else {
            // Mode 5: Omarchy TTE Keyframe Evolution + Wave Ripple
            var waveX = Math.sin(p.homeY * 6.0 + state.t * 3.2) * 0.28 * dismantle * (0.3 + state.bass * 1.6)
            var waveY = Math.cos(p.homeX * 6.0 - state.t * 2.8) * 0.28 * dismantle * (0.3 + state.mid * 1.6)
            tx += waveX
            ty += waveY
        }

        // Restoring spring toward evolved target (tx, ty)
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

function drawLayer1Background(ctx, canvasItem, w, h, state, theme, palette, cfg) {
    var bgHex = (theme && theme.background) ? theme.background.toString() : "#06080e"
    var enabled = cfg ? Boolean(cfg.layer1Enabled) : true
    var fieldOn = cfg && cfg.layer1FieldEnabled !== undefined ? Boolean(cfg.layer1FieldEnabled) : true
    var eqOn = cfg && cfg.layer1EqEnabled !== undefined ? Boolean(cfg.layer1EqEnabled) : (cfg && Number(cfg.layer1Mode) === 4)
    var shapesOn = cfg && cfg.layer1ShapesEnabled !== undefined ? Boolean(cfg.layer1ShapesEnabled) : true
    var l2On = cfg ? Boolean(cfg.layer2Enabled) : true
    var l3On = cfg ? Boolean(cfg.layer3Enabled) : true

    // Detect any layer or L1 sub-system ON/OFF toggle so disabled layers clear from the persistent buffer immediately
    if (state.lastL1 !== enabled || state.lastL2 !== l2On || state.lastL3 !== l3On
        || state.lastL1Field !== fieldOn || state.lastL1Eq !== eqOn || state.lastL1Shapes !== shapesOn) {
        state.lastL1 = enabled
        state.lastL2 = l2On
        state.lastL3 = l3On
        state.lastL1Field = fieldOn
        state.lastL1Eq = eqOn
        state.lastL1Shapes = shapesOn
        state.clearFeedbackFrames = Math.max(state.clearFeedbackFrames || 0, 2)
    }

    if (!enabled || (state.clearFeedbackFrames && state.clearFeedbackFrames > 0)) {
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

    var l1Mode = cfg ? ((Number(cfg.layer1Mode) || 0) % LAYER1_MODES.length) : 0
    var trail = cfg && cfg.layer1Trail !== undefined ? clamp(Number(cfg.layer1Trail), 0.10, 0.97) : 0.84
    var dim = cfg && cfg.layer1Dim !== undefined ? clamp(Number(cfg.layer1Dim), 0.0, 0.92) : 0.16
    var density = cfg && cfg.layer1Density !== undefined ? clamp(Number(cfg.layer1Density), 0.2, 3.0) : 1.0
    var speed = cfg && cfg.layer1Speed !== undefined ? clamp(Number(cfg.layer1Speed), 0.1, 4.0) : 1.0
    if (cfg && cfg.musicDrive) {
        speed = clamp(speed * (0.65 + 0.95 * (state.musicIntensity || 0.35)), 0.1, 4.0)
    }

    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)
    var endPt = computeTracerEndpoint(
        w,
        h,
        state.t,
        state.liveTracerDrift !== undefined ? state.liveTracerDrift : (cfg ? cfg.tracerDrift : 1.0),
        speed
    )

    // Zero-copy persistent framebuffer trail fade (no QQuickCanvasItem::toImage() CPU deep copy!)
    // Anti-bleach floor (0.24..0.72) ensures L1 + L2 never accumulate to blown-out white
    ctx.globalCompositeOperation = "source-over"
    ctx.globalAlpha = 1.0
    var veilAlpha = (fieldOn && l1Mode === 5)
        ? clamp(0.48 + dim * 0.48, 0.40, 0.95)
        : clamp((1.0 - trail) * 1.15 + dim * 0.35 + 0.16, 0.24, 0.72)
    ctx.fillStyle = colourWithAlpha(bgHex, veilAlpha)
    ctx.fillRect(0, 0, w, h)

    var horizonY = cy + h * 0.08 + endPt.dy * 0.22
    var vanishX = cx + endPt.dx * 0.48

    // =========================================================================
    // SUB-SYSTEM 1: L1 FIELD (6 Volumetric Background Fields)
    // =========================================================================
    if (fieldOn) {
        if (l1Mode === 0) {
            // Mode 0: MilkDrop / Geiss 3D Expanding Logarithmic Warp Tunnel Web & Volumetric Curtains
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var ringCount = Math.max(5, Math.min(9, Math.round(7 * density)))
            var segs = 24
            var ringsPts = []
            for (var rIdx = 0; rIdx < ringCount; rIdx++) {
                var rProg = ((rIdx + (state.t * 0.32 * speed) % 1.0) / ringCount)
                var baseR = Math.pow(rProg, 1.45) * minDim * 0.72
                var ringCX = cx + endPt.dx * 0.65 * (1.0 - rProg)
                var ringCY = cy + endPt.dy * 0.65 * (1.0 - rProg)
                var rot = state.phase * (rIdx % 2 === 0 ? 0.35 : -0.35)
                var pts = []
                for (var s = 0; s <= segs; s++) {
                    var ang = (s / segs) * Math.PI * 2 + rot
                    var bVal = state.smoothBands[(s * 2 + rIdx * 7) & 63]
                    var rr = baseR * (1.0 + Math.sin(ang * 4.0 + state.t * 1.8) * 0.08 + bVal * 0.18)
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
                var pAlpha = (0.05 + r1[0].prog * 0.09 + state.bass * 0.06) * (1.0 - dim)
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
                ctx.strokeStyle = colourWithAlpha(palette[(rb * 2 + 1) % palette.length], (0.28 + state.bass * 0.38) * (1.0 - dim))
                ctx.lineWidth = 1.6 + rb * 0.5 + state.bass * 1.8
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
            var fCount = Math.max(8, Math.min(24, Math.floor(15 * density)))
            var segSteps = 5
            for (var fb = 0; fb < 3; fb++) {
                var ribCol = palette[(fb * 3) % palette.length]
                ctx.fillStyle = colourWithAlpha(ribCol, (0.11 + state.mid * 0.16) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(palette[(fb * 3 + 1) % palette.length], (0.34 + state.mid * 0.36) * (1.0 - dim))
                ctx.lineWidth = 1.7 + state.bass * 1.5
                ctx.beginPath()
                for (var fi = fb; fi < fCount; fi += 3) {
                    var baseA = (fi / fCount) * Math.PI * 2 + fb * 0.65 + state.t * 0.38 * speed
                    var depthBase = (fi * 0.17 + state.t * 0.28 * speed) % 0.62
                    var bVal1 = state.smoothBands[(fi * 3) & 63]
                    var curl = (0.22 + state.mid * 0.28) * (fi % 2 === 0 ? 1.0 : -1.0)
                    var leftX = [], leftY = [], rightX = [], rightY = []
                    for (var stp = 0; stp <= segSteps; stp++) {
                        var u = stp / segSteps
                        var dp = depthBase + u * (0.18 + bVal1 * 0.22)
                        var r = minDim * (0.04 + Math.pow(dp, 1.35) * 0.72)
                        var a = baseA + u * curl * 2.2
                        var ox = lerp(focalX, cx, dp)
                        var oy = lerp(focalY, cy, dp)
                        var px = ox + Math.cos(a) * r
                        var py = oy + Math.sin(a) * r
                        var halfW = (2.5 + u * 8.5 * (0.6 + bVal1)) * (1.0 - u * 0.35)
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
                ctx.fillStyle = colourWithAlpha(palette[(sh * 2 + 1) % palette.length], (0.14 + (1.0 - shFrac) * 0.14 + state.bass * 0.12) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(palette[(sh * 2) % palette.length], (0.42 + (1.0 - shFrac) * 0.35) * (1.0 - dim))
                ctx.lineWidth = 1.8 + (1.0 - shFrac) * 1.4
                ctx.beginPath()
                ctx.moveTo(0, h)
                for (var sb = 0; sb < 32; sb++) {
                    var u = sb / 31.0
                    var bv = snap[sb] !== undefined ? snap[sb] : (state.smoothBands[sb * 2] || 0.08)
                    var lick = Math.sin(sb * 0.7 + state.t * 5.2 - sh * 1.3) * 0.18 + 0.82
                    var fx = u * w + endPt.dx * 0.18 * shFrac
                    var fy = baseY - (bv * h * (0.28 + state.bass * 0.18) * density * lick)
                    ctx.lineTo(fx, fy)
                }
                ctx.lineTo(w, h)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            // Rising organic plasma flame tongues (curved diamond/teardrop plumes)
            var flames = state.flames || []
            for (var cBucket = 0; cBucket < 4; cBucket++) {
                ctx.fillStyle = colourWithAlpha(palette[(cBucket * 2) % palette.length], (0.16 + state.bass * 0.24) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(palette[(cBucket * 2 + 1) % palette.length], (0.28 + state.mid * 0.25) * (1.0 - dim))
                ctx.lineWidth = 1.2
                ctx.beginPath()
                for (var f = cBucket; f < flames.length; f += 4) {
                    var fm = flames[f]
                    var fx2 = fm.x * w + endPt.dx * 0.28 * (1.0 - fm.y)
                    var fy2 = fm.y * h
                    var fw = (w / 24.0) * (0.65 + fm.energy * 1.65) * density
                    var fh = h * (0.07 + fm.energy * 0.22) * density
                    var sway = Math.sin(state.t * 4.5 + f) * fw * 0.45
                    ctx.moveTo(fx2 + sway, fy2 - fh * 0.65)
                    ctx.lineTo(fx2 + fw * 0.5, fy2)
                    ctx.lineTo(fx2 - sway * 0.4, fy2 + fh * 0.45)
                    ctx.lineTo(fx2 - fw * 0.5, fy2)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()

                // Glowing rising embers detaching from the flame tips
                ctx.fillStyle = colourWithAlpha(palette[(cBucket * 2 + 2) % palette.length], (0.55 + state.high * 0.35) * (1.0 - dim))
                ctx.beginPath()
                for (var fe = cBucket; fe < flames.length; fe += 4) {
                    var fme = flames[fe]
                    var emberY = ((fme.y - (state.t * 0.22 * speed + fe * 0.13) % 0.45 + 1.0) % 1.0) * h
                    var emberX = fme.x * w + Math.sin(state.t * 3.8 + fe * 1.7) * 18.0 + endPt.dx * 0.25 * (1.0 - emberY / h)
                    var er = 1.6 + fme.energy * 2.4
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
            for (var nb = 2; nb >= 0; nb--) {
                var nebProg = ((nb + (state.t * 0.25 * speed) % 1.0) / 3.0)
                var nebR = minDim * (0.10 + nebProg * 0.42) * (1.0 + state.bass * 0.22)
                var nebX = lerp(starOriginX, cx, nebProg * 0.5)
                var nebY = lerp(starOriginY, cy, nebProg * 0.5)
                ctx.fillStyle = colourWithAlpha(palette[(nb * 3 + 1) % palette.length], (0.07 + (1.0 - nebProg) * 0.08) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(palette[(nb * 3) % palette.length], (0.22 + state.mid * 0.24) * (1.0 - dim))
                ctx.lineWidth = 1.5 + state.bass * 1.4
                ctx.beginPath()
                var nebSegs = 20
                for (var ns = 0; ns <= nebSegs; ns++) {
                    var na = (ns / nebSegs) * Math.PI * 2 + state.phase * (nb % 2 === 0 ? 0.3 : -0.3)
                    var nr = nebR * (1.0 + state.smoothBands[(ns * 3 + nb * 7) & 63] * 0.28)
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
            var starLimit = Math.min(state.stars.length, Math.floor(90 * density))
            for (var sbk = 0; sbk < 3; sbk++) {
                var stCol = palette[(sbk * 3) % palette.length]
                ctx.strokeStyle = colourWithAlpha(stCol, (0.52 + state.high * 0.42) * (1.0 - dim))
                ctx.fillStyle = colourWithAlpha(palette[(sbk * 3 + 1) % palette.length], (0.75 + state.bass * 0.25) * (1.0 - dim))
                ctx.lineWidth = 1.6 + sbk * 0.6 + state.bass * 1.4
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
            // Mode 4: 3D Perspective SynthGrid Horizon Floor & Volumetric Horizon Glow
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var rows = Math.max(5, Math.floor(11 * density))
            var cols = Math.max(8, Math.floor(16 * density))

            // Translucent volumetric SynthGrid floor bands
            ctx.fillStyle = colourWithAlpha(palette[2 % palette.length], (0.08 + state.bass * 0.12) * (1.0 - dim))
            ctx.beginPath()
            for (var rf = 1; rf <= rows; rf += 2) {
                var d0 = ((rf / rows) + (state.t * 0.45 * speed) % (1.0 / rows)) % 1.0
                var d1 = Math.min(1.0, d0 + (0.65 / rows))
                var y0 = horizonY + Math.pow(d0, 1.85) * (h - horizonY)
                var y1 = horizonY + Math.pow(d1, 1.85) * (h - horizonY)
                ctx.rect(0, y0, w, Math.max(1.5, y1 - y0))
            }
            ctx.fill()

            // Perspective SynthGrid floor lines below horizonY
            ctx.strokeStyle = colourWithAlpha(palette[0], (0.28 + state.bass * 0.42) * (1.0 - dim))
            ctx.lineWidth = 1.2 + state.bass * 1.4
            ctx.beginPath()
            for (var r = 1; r <= rows; r++) {
                var depth = ((r / rows) + (state.t * 0.45 * speed) % (1.0 / rows))
                if (depth > 1.0) depth -= 1.0
                var gy = horizonY + Math.pow(depth, 1.85) * (h - horizonY)
                ctx.moveTo(0, gy)
                ctx.lineTo(w, gy)
            }
            for (var c = -cols; c <= cols; c++) {
                var topX = vanishX + c * (w * 0.015)
                var botX = cx + c * (w * 0.14)
                ctx.moveTo(topX, horizonY)
                ctx.lineTo(botX, h)
            }
            ctx.stroke()
            ctx.restore()
        } else if (l1Mode === 5) {
            // Mode 5: Deep-Space Event Horizon Void & Gravitational Lensing Corona
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var bhX = cx + endPt.dx * 0.42
            var bhY = cy + endPt.dy * 0.42
            var ehR = minDim * (0.14 + state.bass * 0.05)

            // Subtle volumetric accretion corona shroud + photon ring around the dark singularity
            for (var cr = 2; cr >= 0; cr--) {
                var cScale = 1.0 + cr * 0.42
                ctx.fillStyle = colourWithAlpha(palette[(cr * 3) % palette.length], (0.06 - cr * 0.015) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(palette[(cr * 3 + 1) % palette.length], (0.28 - cr * 0.06 + state.bass * 0.22) * (1.0 - dim))
                ctx.lineWidth = (cr === 0 ? 2.2 : 1.3) + state.beatPulse * 1.2
                ctx.beginPath()
                var cSteps = 28
                for (var cs = 0; cs <= cSteps; cs++) {
                    var ca = (cs / cSteps) * Math.PI * 2 + state.phase * (cr % 2 === 0 ? 0.4 : -0.4)
                    var cbv = state.smoothBands[(cs * 2 + cr * 9) & 63]
                    var radC = ehR * cScale * (1.0 + cbv * 0.22)
                    var cpx = bhX + Math.cos(ca) * radC
                    var cpy = bhY + Math.sin(ca) * radC * 0.72
                    if (cs === 0) ctx.moveTo(cpx, cpy)
                    else ctx.lineTo(cpx, cpy)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            // Spiralling gravitational lensing dust filaments curving into the event horizon
            var dustCount = Math.max(6, Math.min(14, Math.round(10 * density)))
            ctx.strokeStyle = colourWithAlpha(palette[2 % palette.length], (0.22 + state.mid * 0.24) * (1.0 - dim))
            ctx.lineWidth = 1.2 + state.bass * 1.0
            ctx.beginPath()
            for (var df = 0; df < dustCount; df++) {
                var dBaseA = (df / dustCount) * Math.PI * 2 - state.t * 0.45 * speed
                for (var ds = 0; ds <= 6; ds++) {
                    var du = ds / 6.0
                    var dr = ehR * (1.05 + Math.pow(du, 1.4) * 2.1)
                    var da = dBaseA + (1.0 - du) * 1.35
                    var dx = bhX + Math.cos(da) * dr
                    var dy = bhY + Math.sin(da) * dr * 0.72
                    if (ds === 0) ctx.moveTo(dx, dy)
                    else ctx.lineTo(dx, dy)
                }
            }
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
                ctx.fillStyle = colourWithAlpha(palette[(mLayer * 3 + 2) % palette.length], (0.20 + state.energy * 0.30) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(palette[(mLayer * 2 + 1) % palette.length], (0.72 + state.bass * 0.28) * (1.0 - dim))
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
            // Style 1: LED Bars & Floating Peak-Hold Indicators
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
            // Style 2: Mirrored Horizon Reflection (Upward bars + downward translucent water reflection)
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
            // Style 3: 3D Waterfall Spectrum Ridges marching down towards the user!
            var histEq = state.waveHistory || []
            var ridgeCount = Math.min(10, histEq.length)
            for (var rg = ridgeCount - 1; rg >= 0; rg--) {
                var snapEq = histEq[rg]
                var rFrac = rg / Math.max(1, ridgeCount - 1)
                var ridgeBaseY = lerp(horizonY, h * 0.92, Math.pow(1.0 - rFrac, 1.35))
                var ridgeW = lerp(w * 0.42, w * 0.98, 1.0 - rFrac)
                var leftXEq = vanishX * rFrac + (w - ridgeW) * 0.5 * (1.0 - rFrac)
                ctx.fillStyle = colourWithAlpha(palette[(rg * 2 + 1) % palette.length], (0.14 - rFrac * 0.08) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(palette[(rg * 2) % palette.length], (0.85 - rFrac * 0.58) * (1.0 - dim))
                ctx.lineWidth = 2.4 - rFrac * 1.2
                ctx.beginPath()
                ctx.moveTo(leftXEq, ridgeBaseY)
                for (var sb3 = 0; sb3 < 32; sb3++) {
                    var bMapped = Math.floor(mapEqBandIndex(sb3, 32, eqLayout) / 2)
                    var bv3 = (snapEq.bands[bMapped] || 0.05) * eqGain * (1.15 - rFrac * 0.45)
                    var rx = leftXEq + (sb3 / 31.0) * ridgeW
                    var ry = ridgeBaseY - bv3 * maxEqH * 0.65
                    ctx.lineTo(rx, ry)
                }
                ctx.lineTo(leftXEq + ridgeW, ridgeBaseY)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 4) {
            // Style 4: Synthwave Horizon Sun & Radial Equaliser Corona Rays
            var sunR = minDim * (0.20 + state.bass * 0.06)
            // Segmented retro sun bands
            for (var sl = 0; sl < 6; sl++) {
                ctx.fillStyle = colourWithAlpha(palette[(sl + 8) % palette.length], (0.32 - sl * 0.03) * (1.0 - dim))
                var bandTop = horizonY - sunR * (1.0 - sl * 0.15)
                var bandH = sunR * 0.11
                var chordW = Math.sqrt(Math.max(0.0, sunR * sunR - Math.pow(horizonY - bandTop, 2))) * 2.0
                ctx.fillRect(vanishX - chordW * 0.5, bandTop, chordW, bandH)
            }
            // Radial equaliser rays erupting around the upper semicircle of the sun
            ctx.strokeStyle = colourWithAlpha(palette[1], (0.78 + state.beatPulse * 0.22) * (1.0 - dim))
            ctx.lineWidth = 2.2 + state.bass * 1.5
            ctx.beginPath()
            var rayCount = 40
            for (var ryIdx = 0; ryIdx <= rayCount; ryIdx++) {
                var rAng = Math.PI + (ryIdx / rayCount) * Math.PI
                var bIdx4 = mapEqBandIndex(ryIdx, rayCount + 1, eqLayout)
                var v4 = sampleEqBandValue(state, bIdx4, eqDamping, eqGain)
                var rInner = sunR * 0.95
                var rOuter = sunR + v4 * maxEqH * 0.85
                ctx.moveTo(vanishX + Math.cos(rAng) * rInner, horizonY + Math.sin(rAng) * rInner)
                ctx.lineTo(vanishX + Math.cos(rAng) * rOuter, horizonY + Math.sin(rAng) * rOuter)
            }
            ctx.stroke()
        } else {
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
                    var harmMod = Math.sin(cw * 0.35 + state.t * 3.0 + wingPass) * 0.15 + 0.85
                    var wy5 = horizonY - cv * maxEqH * harmMod * (1.0 - distC * 0.25)
                    ctx.lineTo((cw / 63.0) * w, wy5)
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
    // SUB-SYSTEM 3: L1 BEAT SHAPES (Audio-Reactive Shapes Moving Towards User)
    // =========================================================================
    if (shapesOn && state.shockwaves.length > 0) {
        var shapeStyle = cfg && cfg.layer1ShapeStyle !== undefined ? ((Number(cfg.layer1ShapeStyle) || 0) % LAYER1_SHAPE_STYLES.length) : 0
        var shapeSpin = cfg && cfg.layer1ShapeSpin !== undefined ? clamp(Number(cfg.layer1ShapeSpin), -2.5, 2.5) : 0.25
        var shapeScale = cfg && cfg.layer1ShapeScale !== undefined ? clamp(Number(cfg.layer1ShapeScale), 0.3, 2.5) : 1.0

        ctx.save()
        ctx.globalCompositeOperation = "source-over"
        for (var sw = 0; sw < state.shockwaves.length; sw++) {
            var wave = state.shockwaves[sw]
            var wr = wave.r * minDim * 0.68 * shapeScale
            var wcx = cx + endPt.dx * 0.3 * (1.0 - wave.r)
            var wcy = cy + endPt.dy * 0.3 * (1.0 - wave.r)
            var spinAngle = state.t * shapeSpin * 1.4 + (shapeSpin !== 0 ? sw * 0.25 : 0.0)
            var sAlpha = clamp(wave.alpha * (1.0 - dim), 0.04, 1.0)

            ctx.fillStyle = hslToHex((wave.hueOffset + 35) % 360, 0.92, 0.55, sAlpha * 0.12)
            ctx.strokeStyle = hslToHex(wave.hueOffset, 0.95, 0.62, sAlpha * 0.65)
            ctx.lineWidth = (1.8 + state.bass * 2.4) * Math.sqrt(shapeScale)
            ctx.beginPath()

            if (shapeStyle === 0) {
                // 0: Sacred Polygons (3-8 sided polygons)
                var sides = wave.sides || 6
                for (var v = 0; v <= sides; v++) {
                    var ang0 = (v / sides) * Math.PI * 2 + spinAngle
                    var vx0 = wcx + Math.cos(ang0) * wr
                    var vy0 = wcy + Math.sin(ang0) * wr
                    if (v === 0) ctx.moveTo(vx0, vy0)
                    else ctx.lineTo(vx0, vy0)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            } else if (shapeStyle === 1) {
                // 1: Sonic Boom Rings (concentric circular pulse rings)
                var ringSegs = 28
                for (var rs = 0; rs <= ringSegs; rs++) {
                    var ang1 = (rs / ringSegs) * Math.PI * 2 + spinAngle
                    var mod1 = 1.0 + Math.sin(ang1 * 4.0) * state.bass * 0.06
                    var vx1 = wcx + Math.cos(ang1) * wr * mod1
                    var vy1 = wcy + Math.sin(ang1) * wr * mod1
                    if (rs === 0) ctx.moveTo(vx1, vy1)
                    else ctx.lineTo(vx1, vy1)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            } else if (shapeStyle === 2) {
                // 2: Merkaba Starbursts (multi-pointed geometric stars)
                var pts2 = (wave.sides || 6) * 2
                for (var sv = 0; sv <= pts2; sv++) {
                    var ang2 = (sv / pts2) * Math.PI * 2 + spinAngle
                    var r2 = (sv % 2 === 0) ? wr : (wr * 0.48)
                    var vx2 = wcx + Math.cos(ang2) * r2
                    var vy2 = wcy + Math.sin(ang2) * r2
                    if (sv === 0) ctx.moveTo(vx2, vy2)
                    else ctx.lineTo(vx2, vy2)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            } else if (shapeStyle === 3) {
                // 3: Diamond Portals (4-point sacred rhombus frames)
                for (var dv = 0; dv <= 4; dv++) {
                    var ang3 = (dv / 4) * Math.PI * 2 + spinAngle
                    var rxScale = (dv % 2 === 0) ? 1.22 : 0.82
                    var vx3 = wcx + Math.cos(ang3) * wr * rxScale
                    var vy3 = wcy + Math.sin(ang3) * wr * rxScale
                    if (dv === 0) ctx.moveTo(vx3, vy3)
                    else ctx.lineTo(vx3, vy3)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            } else if (shapeStyle === 4) {
                // 4: Cyber Hex Brackets (segmented tech-HUD portal frames)
                var hexSides = 6
                for (var hs = 0; hs < hexSides; hs++) {
                    var aStart = (hs / hexSides) * Math.PI * 2 + spinAngle + 0.08
                    var aMid = ((hs + 0.5) / hexSides) * Math.PI * 2 + spinAngle
                    var aEnd = ((hs + 1.0) / hexSides) * Math.PI * 2 + spinAngle - 0.08
                    ctx.moveTo(wcx + Math.cos(aStart) * wr, wcy + Math.sin(aStart) * wr)
                    ctx.lineTo(wcx + Math.cos(aMid) * wr * 1.08, wcy + Math.sin(aMid) * wr * 1.08)
                    ctx.lineTo(wcx + Math.cos(aEnd) * wr, wcy + Math.sin(aEnd) * wr)
                    ctx.lineTo(wcx + Math.cos(aMid) * wr * 0.88, wcy + Math.sin(aMid) * wr * 0.88)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            } else {
                // 5: Lotus Ripple Waves (harmonic petalled wave rings)
                var lSteps = 32
                var lPetals = wave.sides || 6
                for (var ls = 0; ls <= lSteps; ls++) {
                    var ang5 = (ls / lSteps) * Math.PI * 2 + spinAngle
                    var r5 = wr * (0.88 + 0.18 * Math.sin(ang5 * lPetals))
                    var vx5 = wcx + Math.cos(ang5) * r5
                    var vy5 = wcy + Math.sin(ang5) * r5
                    if (ls === 0) ctx.moveTo(vx5, vy5)
                    else ctx.lineTo(vx5, vy5)
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
    var sp = clamp(Number(speed !== undefined ? speed : 1.0), 0.15, 3.0)
    var wt = t * 0.42 * sp
    var dx = (Math.sin(wt) * 0.24 + Math.cos(wt * 0.63 + 1.3) * 0.14) * w * d
    var dy = (Math.cos(wt * 0.79) * 0.22 + Math.sin(wt * 0.51 + 2.1) * 0.12) * h * d
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
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var facets = clamp(Math.round(Number(cfg.layer2Facets) || 6), 4, 12)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var numVaults = isEcho ? 3 : Math.max(4, Math.min(7, Math.round(5 * comp)))
    var ptsPerFacet = isEcho ? 6 : Math.max(8, Math.floor(12 * clamp(comp, 0.5, 1.4)))
    var hist = state.waveHistory || []

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    var prevVaultRing = null
    // 1. 3D Vaulted Cathedral Dome receding into perspective (back-to-front: v = numVaults - 1 .. 0)
    for (var v = numVaults - 1; v >= 0; v--) {
        var zProg = ((v + (state.t * 0.52) % 1.0) / numVaults) // 0 = deep apex, 1 = foreground arch
        var persp = 0.16 + Math.pow(zProg, 1.38) * 0.92
        var snap = (hist.length > v * 2 && hist[v * 2] && hist[v * 2].bands) ? hist[v * 2].bands : state.smoothBands
        var curRing = []

        for (var f = 0; f < facets; f++) {
            var baseAng = (f * Math.PI * 2) / facets + state.phase * (v % 2 === 0 ? 0.42 : -0.36)
            var flip = (f % 2 === 0) ? 1.0 : -1.0
            for (var i = 0; i < ptsPerFacet; i++) {
                var u = i / ptsPerFacet
                var bIdx = (i * 2 + v * 5) & 31
                var bv = snap[bIdx] !== undefined ? snap[bIdx] : (state.smoothBands[bIdx] || 0.1)
                // Gothic pointed arch profile + audio harmonic modulation
                var arch = Math.sin(u * Math.PI) * (0.28 + bv * 0.36 + state.bass * 0.16)
                var r = minDim * persp * (0.22 + arch)
                var theta = baseAng + flip * ((u - 0.5) * (Math.PI * 2 / facets) + Math.sin(u * 4.0 + state.t * 2.1 + v) * (0.14 + state.mid * 0.22))
                curRing.push({
                    x: Math.cos(theta) * r,
                    y: Math.sin(theta) * r
                })
            }
        }

        var vaultCol = palette[(v * 2 + state.beatCount) % palette.length]
        var ribCol = palette[(v * 2 + 1 + state.beatCount) % palette.length]
        var totalPts = curRing.length

        // Filled translucent stained-glass cathedral vault bays between consecutive 3D depth rings
        if (prevVaultRing && (!isEcho || (state.echoIndex || 0) < 2)) {
            ctx.fillStyle = colourWithAlpha(vaultCol, (0.08 + zProg * 0.14 + state.bass * 0.08) * (isEcho ? 0.5 : 1.0))
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

            // Radial gothic groin-vault ribs linking depth slices
            ctx.strokeStyle = colourWithAlpha(vaultCol, 0.28 + zProg * 0.42)
            ctx.lineWidth = 1.1 + zProg * 1.4
            ctx.beginPath()
            for (var qr = 0; qr < totalPts; qr += Math.max(2, Math.floor(ptsPerFacet / 2))) {
                ctx.moveTo(prevVaultRing[qr].x, prevVaultRing[qr].y)
                ctx.lineTo(curRing[qr].x, curRing[qr].y)
            }
            ctx.stroke()
        }

        // Thick glowing rose-window arch ring outline (lineWidth = 2.2..4.5)
        ctx.strokeStyle = colourWithAlpha(ribCol, 0.45 + zProg * 0.52)
        ctx.lineWidth = clamp(2.2 + zProg * 2.3 + state.beatPulse * 0.8, 2.2, 4.5) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var p = 0; p <= totalPts; p++) {
            var pt = curRing[p % totalPts]
            if (p === 0) ctx.moveTo(pt.x, pt.y)
            else ctx.lineTo(pt.x, pt.y)
        }
        ctx.stroke()

        prevVaultRing = curRing
    }

    // 2. Central Dual-Channel Geiss Custom Waveform Ribbon driven by state.waveHistory
    if (!isEcho || (state.echoIndex || 0) < 2) {
        var wavePts = isEcho ? 20 : 36
        var coreR = minDim * (0.14 + state.bass * 0.10)
        var ch0Bands = (hist.length > 0 && hist[0] && hist[0].bands) ? hist[0].bands : state.smoothBands
        var ch1Bands = (hist.length > 2 && hist[2] && hist[2].bands) ? hist[2].bands : state.smoothBands
        var outerWave = []
        var innerWave = []
        for (var wIdx = 0; wIdx <= wavePts; wIdx++) {
            var wa = (wIdx / wavePts) * Math.PI * 2 + state.phase * 0.8
            var wb0 = ch0Bands[wIdx & 31] !== undefined ? ch0Bands[wIdx & 31] : (state.smoothBands[(wIdx * 2) & 63] || 0.1)
            var wb1 = ch1Bands[(wIdx + 8) & 31] !== undefined ? ch1Bands[(wIdx + 8) & 31] : (state.smoothBands[(wIdx * 2 + 1) & 63] || 0.1)
            var rOuter = coreR * (0.88 + wb0 * 0.65 + Math.sin(wa * facets - state.t * 3.5) * 0.22)
            var rInner = coreR * (0.48 + wb1 * 0.38 - Math.cos(wa * facets + state.t * 2.8) * 0.14)
            outerWave.push({ x: Math.cos(wa) * rOuter, y: Math.sin(wa) * rOuter })
            innerWave.push({ x: Math.cos(wa) * rInner, y: Math.sin(wa) * rInner })
        }
        ctx.fillStyle = colourWithAlpha(palette[2 % palette.length], 0.20 + state.bass * 0.18)
        ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], 0.92)
        ctx.lineWidth = clamp(2.4 + state.beatPulse * 1.8, 2.2, 4.5)
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

// Mode 1: Winamp AVS 3D SuperScope (3D Volumetric Extruded Torus-Knot Ribbon Tube & Harmonic Flares)
function drawMode1AvsSuperScope(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var scale = Math.min(w, h) * 0.44 * (cfg.layer2Zoom || 1.0)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var N = isEcho ? 36 : Math.max(44, Math.floor(76 * clamp(comp, 0.5, 1.4)))
    var harm = state.avsHarmonics || { m: 3, n: 5, k: 2, twist: 1.4, style: 0 }

    var rotX = state.t * 0.68 + state.bass * 0.85
    var rotY = state.t * 0.88 - state.mid * 0.75
    var cosX = Math.cos(rotX), sinX = Math.sin(rotX)
    var cosY = Math.cos(rotY), sinY = Math.sin(rotY)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    var strandCount = isEcho ? 2 : 3
    for (var strand = 0; strand < strandCount; strand++) {
        var sPhase = strand * (Math.PI * 2 / 3.0)
        var spine = []

        for (var i = 0; i <= N; i++) {
            var u = (i / N) * Math.PI * 2
            var bIdx = (i + strand * 11) & 63
            var v = state.smoothBands[bIdx]
            var R = 0.56 + (0.24 + v * 0.38) * Math.cos(harm.n * u + state.t * 1.9 + sPhase)
            var x3 = R * Math.cos(harm.m * u + sPhase)
            var y3 = R * Math.sin(harm.m * u + sPhase)
            var z3 = (0.38 + v * 0.48 + state.bass * 0.26) * Math.sin(harm.k * u + state.t * harm.twist)

            // 3D rotation
            var x1 = x3 * cosY - z3 * sinY
            var z1 = x3 * sinY + z3 * cosY
            var y2 = y3 * cosX - z1 * sinX
            var z2 = y3 * sinX + z1 * cosX

            var persp = 1.68 / (2.25 - clamp(z2, -1.25, 1.25))
            var tubeW = (3.5 + v * 11.5 + state.bass * 6.5) * persp * (isEcho ? 0.65 : 1.0)
            spine.push({
                x: x1 * scale * persp,
                y: y2 * scale * persp,
                w: tubeW,
                persp: persp,
                band: v
            })
        }

        // Compute 2D normal-extruded left/right tube rails
        var leftRail = []
        var rightRail = []
        for (var k = 0; k <= N; k++) {
            var pPrev = spine[k > 0 ? k - 1 : N - 1]
            var pNext = spine[k < N ? k + 1 : 1]
            var dx = pNext.x - pPrev.x
            var dy = pNext.y - pPrev.y
            var len = Math.sqrt(dx * dx + dy * dy) || 1.0
            var nx = -dy / len
            var ny = dx / len
            var hw = spine[k].w
            leftRail.push({ x: spine[k].x + nx * hw, y: spine[k].y + ny * hw })
            rightRail.push({ x: spine[k].x - nx * hw, y: spine[k].y - ny * hw })
        }

        var fillCol = palette[(strand * 3 + state.beatCount) % palette.length]
        var railCol = palette[(strand * 3 + 1 + state.beatCount) % palette.length]

        // 1. Filled translucent 3D extruded torus-knot ribbon body
        if (!isEcho || (state.echoIndex || 0) < 3) {
            ctx.fillStyle = colourWithAlpha(fillCol, (0.14 + state.bass * 0.16) * (isEcho ? 0.55 : 1.0))
            ctx.beginPath()
            for (var f0 = 0; f0 <= N; f0++) {
                if (f0 === 0) ctx.moveTo(leftRail[f0].x, leftRail[f0].y)
                else ctx.lineTo(leftRail[f0].x, leftRail[f0].y)
            }
            for (var f1 = N; f1 >= 0; f1--) {
                ctx.lineTo(rightRail[f1].x, rightRail[f1].y)
            }
            ctx.closePath()
            ctx.fill()
        }

        // 2. Thick high-luminance neon edge rails (lineWidth = 2.4..4.8) + cross-section tube ribs
        ctx.strokeStyle = colourWithAlpha(railCol, 0.74 + state.bass * 0.26)
        ctx.lineWidth = clamp(2.4 + (strand === 0 ? 0.6 : 0.0) + state.bass * 1.0 + state.beatPulse * 0.8, 2.4, 4.8) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var r0 = 0; r0 <= N; r0++) {
            if (r0 === 0) ctx.moveTo(leftRail[r0].x, leftRail[r0].y)
            else ctx.lineTo(leftRail[r0].x, leftRail[r0].y)
        }
        for (var r1 = 0; r1 <= N; r1++) {
            if (r1 === 0) ctx.moveTo(rightRail[r1].x, rightRail[r1].y)
            else ctx.lineTo(rightRail[r1].x, rightRail[r1].y)
        }
        // Cross-sectional torus tube rings every 4 steps
        for (var cr = 0; cr < N; cr += 4) {
            ctx.moveTo(leftRail[cr].x, leftRail[cr].y)
            ctx.lineTo(rightRail[cr].x, rightRail[cr].y)
        }
        ctx.stroke()

        // 3. Beat-reactive glowing harmonic vertex flares along the 3D torus knot
        if (!isEcho) {
            ctx.fillStyle = colourWithAlpha(palette[(strand * 3 + 2 + state.beatCount) % palette.length], 0.82 + state.beatPulse * 0.18)
            ctx.beginPath()
            for (var vf = 0; vf < N; vf += 6) {
                var spPt = spine[vf]
                var fr = (2.0 + spPt.band * 3.8 + state.beatPulse * 2.4) * spPt.persp
                ctx.rect(spPt.x - fr, spPt.y - fr, fr * 2.0, fr * 2.0)
            }
            ctx.fill()
        }
    }
    ctx.restore()
}

// Mode 2: SoundSpectrum G-Force 3D Logarithmic Vortex Funnel & Plasma Ribbons
function drawMode2GForceWaveShape(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.46 * (cfg.layer2Zoom || 1.0)
    var petals = clamp(Math.round(Number(cfg.layer2Facets) || 6), 4, 12)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var numRings = isEcho ? 3 : Math.max(5, Math.min(8, Math.round(6 * comp)))
    var steps = isEcho ? 28 : Math.max(36, Math.floor(56 * clamp(comp, 0.5, 1.3)))
    var hist = state.waveHistory || []

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    var prevFunnelPts = null
    // Render 3D logarithmic vortex funnel from deep core (layer = numRings - 1) out to foreground rim (layer = 0)
    for (var layer = numRings - 1; layer >= 0; layer--) {
        var depthFrac = layer / Math.max(1, numRings - 1) // 0 = front rim, 1 = deep vortex core
        var persp = Math.pow(1.0 - depthFrac * 0.80, 1.25)
        var snap = (hist.length > layer * 2 && hist[layer * 2] && hist[layer * 2].bands) ? hist[layer * 2].bands : state.smoothBands
        var dir = (layer % 2 === 0) ? 1.0 : -1.0
        var spiralTwist = (1.0 - persp) * (1.2 + state.high * 1.4) * dir + state.phase * 0.55

        var curPts = []
        for (var i = 0; i <= steps; i++) {
            var a = (i / steps) * Math.PI * 2
            var bIdx = (i + layer * 7) & 31
            var bv = snap[bIdx] !== undefined ? snap[bIdx] : (state.smoothBands[bIdx] || 0.1)
            var wave = Math.sin(a * petals + state.t * 2.6 * dir - layer * 0.4) * (0.18 + state.mid * 0.26)
                     + Math.cos(a * (petals * 2 - 1) - state.t * 1.9) * (0.12 + bv * 0.34)
            var r = maxR * persp * (0.76 + wave + state.bass * 0.18)
            var spiralA = a + spiralTwist
            curPts.push({
                x: Math.cos(spiralA) * r,
                y: Math.sin(spiralA) * r
            })
        }

        var curtainCol = palette[(layer * 2 + state.beatCount) % palette.length]
        var crestCol = palette[(layer * 2 + 1 + state.beatCount) % palette.length]

        // 1. Filled translucent 3D plasma funnel curtain linking adjacent depth rings
        if (prevFunnelPts && (!isEcho || (state.echoIndex || 0) < 3)) {
            ctx.fillStyle = colourWithAlpha(curtainCol, (0.08 + (1.0 - depthFrac) * 0.14 + state.bass * 0.08) * (isEcho ? 0.5 : 1.0))
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

            // Spiralling 3D vortex ribs rushing out of the funnel core
            ctx.strokeStyle = colourWithAlpha(curtainCol, 0.26 + (1.0 - depthFrac) * 0.42)
            ctx.lineWidth = 1.0 + (1.0 - depthFrac) * 1.4
            ctx.beginPath()
            for (var vr = 0; vr < steps; vr += 3) {
                ctx.moveTo(prevFunnelPts[vr].x, prevFunnelPts[vr].y)
                ctx.lineTo(curPts[vr].x, curPts[vr].y)
            }
            ctx.stroke()
        }

        // 2. Thick glowing harmonic WaveShape crest
        ctx.strokeStyle = colourWithAlpha(crestCol, 0.48 + (1.0 - depthFrac) * 0.50)
        ctx.lineWidth = (1.5 + (1.0 - depthFrac) * 2.5 + state.bass * 1.5) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var p = 0; p <= steps; p++) {
            if (p === 0) ctx.moveTo(curPts[p].x, curPts[p].y)
            else ctx.lineTo(curPts[p].x, curPts[p].y)
        }
        ctx.closePath()
        ctx.stroke()

        prevFunnelPts = curPts
    }
    ctx.restore()
}

// Mode 3: Cthugha 3D Volumetric Plasma & Flame Oscilloscope Tunnel
function drawMode3CthughaRave(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.46 * (cfg.layer2Zoom || 1.0)
    var isEcho = Boolean(state.isTracerEcho)
    var numSlices = isEcho ? 3 : 8
    var ringSteps = isEcho ? 28 : 48
    var hist = state.waveHistory
    var histLen = hist ? hist.length : 0

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    // 1. Volumetric Flame & Plasma Shroud Waves rendered from OUTERMOST shroud (s = 0)
    // inward to DEEPEST INNER CORE (s = numSlices - 1) using "source-over" so each inner ring
    // paints its own saturated palette colour over outer rings & L1 without ever bleaching to white!
    for (var s = 0; s < numSlices; s++) {
        var depthFrac = s / Math.max(1, numSlices - 1) // 0 = outer front rim, 1 = deep inner core
        var persp = 1.0 - depthFrac * 0.72
        var baseR = maxR * persp * (0.88 + state.bass * 0.24)
        var snapEntry = (histLen > 0 && hist[(s * 2) % histLen]) ? hist[(s * 2) % histLen] : null
        var waveSlice = (snapEntry && snapEntry.bands) ? snapEntry.bands : state.smoothBands
        var rot = state.phase * (s % 2 === 0 ? 0.65 : -0.55) + s * 0.28
        var colFill = palette[(s * 2 + state.beatCount) % palette.length]
        var colStroke = palette[(s * 2 + 3 + state.beatCount) % palette.length]

        ctx.fillStyle = colourWithAlpha(colFill, (0.24 + depthFrac * 0.22 + state.bass * 0.08) * (isEcho ? 0.52 : 1.0))
        ctx.strokeStyle = colourWithAlpha(colStroke, 0.58 + (1.0 - depthFrac) * 0.40)
        ctx.lineWidth = (1.4 + (1.0 - depthFrac) * 2.2 + state.bass * 1.4) * (isEcho ? 0.75 : 1.0)

        ctx.beginPath()
        for (var i = 0; i <= ringSteps; i++) {
            var u = i / ringSteps
            var a = u * Math.PI * 2 + rot
            var bIdx = (i + s * 3) & 31
            var wVal = waveSlice[bIdx] !== undefined ? waveSlice[bIdx] : state.smoothBands[bIdx]
            var flame = Math.sin(u * Math.PI * 12 + state.t * 5.5 - s * 0.9) * (0.12 + state.mid * 0.22)
            var excursion = (wVal - 0.14 + flame) * maxR * persp * (0.42 + state.energy * 0.35)
            var r = Math.max(8, baseR + excursion)
            var px = Math.cos(a) * r
            var py = Math.sin(a) * r - Math.abs(excursion) * 0.22 * (1.0 - depthFrac) // upward Cthugha flame lift
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
        ctx.fillStyle = colourWithAlpha(palette[1 % palette.length], 0.24 + state.bass * 0.16)
        ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], 0.90)
        ctx.lineWidth = 2.4 + state.beatPulse * 1.8
        ctx.beginPath()
        for (var k = 0; k <= hSteps; k++) {
            var kx = ((k / hSteps) * 2.0 - 1.0) * spanW
            var kb = state.smoothBands[(k * 2) & 63]
            var ky = (kb - 0.25) * Math.sin(k * 0.55 + state.t * 7.0) * maxR * (0.48 + state.bass * 0.45)
            if (k === 0) ctx.moveTo(kx, ky)
            else ctx.lineTo(kx, ky)
        }
        for (var k2 = hSteps; k2 >= 0; k2--) {
            var kx2 = ((k2 / hSteps) * 2.0 - 1.0) * spanW
            var kb2 = state.smoothBands[(k2 * 2 + 1) & 63]
            var ky2 = -(kb2 * 0.55 + 0.08) * maxR * 0.32
            ctx.lineTo(kx2, ky2)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    ctx.restore()
}

// Mode 4: Jeff Minter VLM (Virtual Light Machine / Tempest 2000) Continuous 3D Morphing & Rotating Tube
function drawMode4MinterVlm(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod

    // Continuous 3D tube slice resolution (10..14 depth rings, 20..28 circumferential facets)
    var depthRings = isEcho ? 6 : Math.max(9, Math.min(14, Math.round(11 * comp)))
    var facets = isEcho ? 14 : Math.max(18, Math.min(28, Math.round(22 * clamp(comp, 0.6, 1.3))))

    // Travelling INTO vs PULLING OUT of the tube:
    //   cfg.tracerDirection > 0  -> rushing deep into the tube with beat surges
    //   cfg.tracerDirection < 0  -> pulling rapidly out of the tube
    //   cfg.tracerDirection === 0 -> oscillating between plunging deep into the tube and pulling back out!
    var tracerDir = Number(cfg && cfg.tracerDirection !== undefined ? cfg.tracerDirection : 1)
    var travelDir = (tracerDir === 0)
        ? Math.sin(state.t * 0.48)
        : (tracerDir > 0 ? (1.0 - 0.55 * Math.max(0.0, Math.sin(state.t * 0.42))) : -1.0)
    var travelPhase = state.t * (1.85 + state.bass * 1.15) * travelDir + Math.sin(state.t * 1.6) * (0.45 + state.beatPulse * 0.35)
    var zFract = ((travelPhase % 1.0) + 1.0) % 1.0
    var zBaseWorld = Math.floor(travelPhase)

    // Wandering 3D diminishing endpoint offset (snaking spine curvature)
    var driftScale = state.liveTracerDrift !== undefined
        ? state.liveTracerDrift
        : clamp(Number(cfg && cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0), 0.0, 2.5)
    var endPt = computeTracerEndpoint(w, h, state.t * 1.15, Math.max(0.45, driftScale), 1.1)
    var curveX = endPt.dx * 0.72 + Math.sin(state.t * 1.1) * minDim * 0.14
    var curveY = endPt.dy * 0.72 + Math.cos(state.t * 0.85) * minDim * 0.12

    // Drifting cross-sectional harmonic lobe counts (morphing smoothly through figure-8, clover, star, hex, and Tempest web)
    var baseFolds = clamp(Math.round(Number(cfg.layer2Facets) || 6), 3, 12)
    var m1 = 2 + Math.round((Math.sin(state.t * 0.31) * 0.5 + 0.5) * (baseFolds - 2)) // 2..baseFolds lobes
    var m2 = baseFolds + 1 + ((state.beatCount || 0) % 4)                             // high-order Tempest star spikes

    var maxR = minDim * (0.52 + state.bass * 0.14 + state.beatPulse * 0.10)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    // Precompute 3D curved & morphing tube rings from diminishing endpoint (d = 0) out to foreground rim (d = depthRings)
    var ringPts = []
    var ringZ = []
    var ringWorld = []
    for (var d = 0; d <= depthRings; d++) {
        var zProg = clamp((d + zFract) / (depthRings + 0.35), 0.03, 1.08)
        ringZ.push(zProg)
        var worldZ = zBaseWorld + (depthRings - d)
        ringWorld.push(worldZ)

        // Perspective radius expands from pinpoint at the diminishing endpoint out to surrounding camera rim
        var persp = Math.pow(zProg, 1.52)
        var rBase = maxR * (0.04 + persp * 0.98)

        // Progressive 3D spine bend toward the wandering diminishing endpoint
        var bendAmt = Math.pow(1.0 - zProg, 1.35)
        var wobbleX = Math.sin(worldZ * 0.45 + state.t * 2.2) * minDim * 0.045 * (1.0 - zProg * 0.5)
        var wobbleY = Math.cos(worldZ * 0.38 - state.t * 1.9) * minDim * 0.045 * (1.0 - zProg * 0.5)
        var spineX = curveX * bendAmt + wobbleX
        var spineY = curveY * bendAmt + wobbleY

        // Continuous tube rotation + progressive corkscrew twist along depth
        var twist = state.phase * 0.85 + worldZ * 0.22 * Math.sin(state.t * 0.65) + (1.0 - zProg) * (0.95 + state.mid * 0.85)

        // Cross-section aspect ratio & harmonic shape drift along the tube's length
        var ellipX = 1.0 + 0.22 * Math.sin(worldZ * 0.32 + state.t * 0.9)
        var ellipY = 1.0 + 0.22 * Math.cos(worldZ * 0.32 + state.t * 0.9)

        var pts = []
        for (var s = 0; s <= facets; s++) {
            var u = s / facets
            var a = u * Math.PI * 2
            var bIdx = ((s % facets) * 3 + (worldZ & 15) * 4) & 63
            var bVal = state.smoothBands[bIdx]

            // Drifting multi-harmonic tube cross-section (figure-8 / clover / star-web / spiky Tempest profile)
            var lobe1 = Math.cos(m1 * a + worldZ * 0.35 + state.t * 1.4) * (0.22 + state.mid * 0.16)
            var lobe2 = Math.sin(m2 * a - worldZ * 0.25 + state.t * 1.9) * (0.14 + state.high * 0.14)
            var spike = (1.0 + bVal * 0.38 * (((s + d) & 1) === 0 ? 1.0 : -0.45))
            var r = Math.max(3.0, rBase * (0.86 + lobe1 + lobe2) * spike)
            var rotA = a + twist

            pts.push({
                x: spineX + Math.cos(rotA) * r * ellipX,
                y: spineY + Math.sin(rotA) * r * ellipY,
                band: bVal
            })
        }
        ringPts.push(pts)
    }

    // 0. Dark void cap at the deep diminishing endpoint (d = 0) so the tube's distant core never bleaches out
    if (!isEcho) {
        var deepRing = ringPts[0]
        ctx.fillStyle = colourWithAlpha("#05050a", 0.78)
        ctx.beginPath()
        for (var dv = 0; dv <= facets; dv++) {
            if (dv === 0) ctx.moveTo(deepRing[dv].x, deepRing[dv].y)
            else ctx.lineTo(deepRing[dv].x, deepRing[dv].y)
        }
        ctx.closePath()
        ctx.fill()
    }

    // 1. Textured / Checkered Llamasoft Tube Wall Panels rendered back-to-front (d = 0 -> depthRings - 1)
    if (!isEcho || (state.echoIndex || 0) < 3) {
        for (var pBucket = 0; pBucket < 2; pBucket++) {
            var panelCol = palette[(pBucket * 4 + state.beatCount * 2) % palette.length]
            ctx.fillStyle = colourWithAlpha(panelCol, isEcho ? 0.12 : (0.18 + state.bass * 0.14))
            ctx.beginPath()
            for (var d0 = 0; d0 < depthRings; d0++) {
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
            }
            ctx.fill()
        }
    }

    // 2. Thick High-Luminance Longitudinal Tube Lane Rails curving into the diminishing endpoint
    ctx.strokeStyle = colourWithAlpha(palette[(1 + state.beatCount) % palette.length], 0.80 + state.high * 0.20)
    ctx.lineWidth = (isEcho ? 1.8 : 2.8) + state.bass * 2.2
    ctx.beginPath()
    for (var sLane = 0; sLane < facets; sLane += (isEcho ? 2 : 1)) {
        ctx.moveTo(ringPts[0][sLane].x, ringPts[0][sLane].y)
        for (var dLane = 1; dLane <= depthRings; dLane++) {
            ctx.lineTo(ringPts[dLane][sLane].x, ringPts[dLane][sLane].y)
        }
    }
    ctx.stroke()

    // 3. Thick Neon Morphing Tube Cross-Section Rings surging past the viewer (up to 6.5px on foreground rim)
    for (var dr = 0; dr <= depthRings; dr++) {
        var zp = ringZ[dr]
        var ptsR = ringPts[dr]
        var wIdx = ((ringWorld[dr] * 2 + state.beatCount) % palette.length + palette.length) % palette.length
        ctx.strokeStyle = colourWithAlpha(palette[wIdx], 0.36 + zp * 0.64)
        ctx.lineWidth = (1.6 + zp * 3.6 + state.beatPulse * 1.6) * (isEcho ? 0.72 : 1.0)
        ctx.beginPath()
        for (var sr = 0; sr <= facets; sr++) {
            if (sr === 0) ctx.moveTo(ptsR[sr].x, ptsR[sr].y)
            else ctx.lineTo(ptsR[sr].x, ptsR[sr].y)
        }
        ctx.stroke()
    }

    ctx.restore()
}

// Mode 5: True Continuous Infinite Fractal Zoom (Logarithmic Scale-Invariant Julia Seahorse Spiral + 3-Gen Recursive Fractal)
function drawMode5JuliaFractals(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod

    // Continuous Infinite Zoom Direction & Phase:
    //   cfg.tracerDirection > 0  -> continuous infinite zoom INTO the fractal core
    //   cfg.tracerDirection < 0  -> continuous infinite zoom OUT of the fractal core
    //   cfg.tracerDirection === 0 -> smoothly cycles zooming deep in and back out!
    var tracerDir = Number(cfg && cfg.tracerDirection !== undefined ? cfg.tracerDirection : 1)
    var zoomDir = (tracerDir === 0) ? Math.sin(state.t * 0.32) : (tracerDir > 0 ? 1.0 : -1.0)
    var zoomSpeed = (0.78 + state.bass * 0.62) * (cfg.layer2Speed || 1.0)
    var zoomFlow = state.t * zoomSpeed * zoomDir
    var zoomFract = ((zoomFlow % 1.0) + 1.0) % 1.0
    var zoomGen = Math.floor(zoomFlow)

    // Live audio-modulated Douady / Seahorse Valley Julia constant c = cRe + i*cIm
    var cRe = -0.745 + Math.cos(state.t * 0.35) * (0.11 + state.bass * 0.08)
    var cIm = 0.186 + Math.sin(state.t * 0.42) * (0.11 + state.mid * 0.08)

    // Subtle wandering focal spiral centre as we zoom into the fractal valley
    var focalX = cx + Math.sin(state.t * 0.41) * minDim * 0.04
    var focalY = cy + Math.cos(state.t * 0.33) * minDim * 0.04

    var octaves = isEcho ? 4 : Math.max(5, Math.min(8, Math.round(7 * clamp(comp, 0.65, 1.25))))
    var ratio = 1.82 // Logarithmic scale factor per octave (1.82^7 ≈ 66x continuous scale range!)
    var baseScale = minDim * 0.011
    var arms = clamp(Math.round(Number(cfg.layer2Facets) || 6), 5, 8)
    var spiralSteps = isEcho ? 30 : 48

    ctx.save()
    ctx.translate(focalX, focalY)
    ctx.globalCompositeOperation = "source-over"

    // Render from largest outer fractal octave (oct = octaves - 1) inward to smallest micro-octave (oct = 0)
    // using "source-over" so each inner self-similar octave paints crisp saturated colours without ever bleaching!
    for (var oct = octaves - 1; oct >= 0; oct--) {
        var octProgress = oct + zoomFract // 0.0 (microscopic core) -> octaves (outer boundary)
        var uOct = octProgress / octaves  // normalised [0..1] across visible zoom window
        var octScale = baseScale * Math.pow(ratio, octProgress)
        var octWorld = zoomGen - oct      // invariant integer identity of this fractal generation

        // Smooth bell-curve envelope at microscopic birth (uOct -> 0) and outer viewport exit (uOct -> 1)
        var envAlpha = Math.sin(clamp(uOct, 0.02, 0.98) * Math.PI)
        var octRot = octWorld * 0.523598 + state.phase * 0.38 // 30-degree self-similar golden spiral twist per octave

        var colPrimary = palette[((octWorld * 2) % palette.length + palette.length) % palette.length]
        var colSecondary = palette[((octWorld * 2 + 1) % palette.length + palette.length) % palette.length]
        var colAccent = palette[((octWorld * 2 + 3) % palette.length + palette.length) % palette.length]

        // -------------------------------------------------------------------
        // A. Iterated Julia / Mandelbrot Escape-Time Seahorse Spiral Contour
        // -------------------------------------------------------------------
        ctx.fillStyle = colourWithAlpha(colPrimary, (0.16 + (1.0 - uOct) * 0.14 + state.bass * 0.08) * envAlpha * (isEcho ? 0.5 : 1.0))
        ctx.strokeStyle = colourWithAlpha(colSecondary, (0.48 + envAlpha * 0.46) * (isEcho ? 0.65 : 1.0))
        ctx.lineWidth = (1.2 + uOct * 2.4 + state.beatPulse * 1.1) * (isEcho ? 0.75 : 1.0)

        ctx.beginPath()
        for (var s = 0; s <= spiralSteps; s++) {
            var u = s / spiralSteps
            var theta = u * Math.PI * 2 + octRot
            // Evaluate 4-iteration complex Julia polynomial z_{n+1} = z_n^2 + c
            var zr = Math.cos(theta * (arms * 0.5)) * 0.84
            var zi = Math.sin(theta * (arms * 0.5)) * 0.84
            for (var it = 0; it < 4; it++) {
                var tr = zr * zr - zi * zi + cRe
                zi = 2.0 * zr * zi + cIm
                zr = tr
            }
            var escapePot = Math.atan(Math.sqrt(zr * zr + zi * zi)) / 1.5708 // [0..1]
            var bVal = state.smoothBands[(s + (octWorld & 15) * 4) & 63]
            var rJulia = octScale * (0.64 + 0.52 * escapePot + bVal * 0.28 + Math.sin(u * arms * Math.PI * 2) * 0.16)
            var curlA = theta + (escapePot - 0.5) * 0.42
            var jx = Math.cos(curlA) * rJulia
            var jy = Math.sin(curlA) * rJulia
            if (s === 0) ctx.moveTo(jx, jy)
            else ctx.lineTo(jx, jy)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // -------------------------------------------------------------------
        // B. 3-Generation Recursive Self-Similar Fractal Dendrite & Koch Arms
        // -------------------------------------------------------------------
        var branchSplit = 0.58 + state.mid * 0.24 + Math.sin(state.t * 0.9 + octWorld) * 0.12
        var subRatio = 0.48
        ctx.strokeStyle = colourWithAlpha(colAccent, (0.58 + envAlpha * 0.40) * (isEcho ? 0.65 : 1.0))
        ctx.lineWidth = (1.1 + uOct * 1.9 + state.bass * 0.9) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()

        var tipDiamonds = []
        for (var arm = 0; arm < arms; arm++) {
            var armA = (arm / arms) * Math.PI * 2 + octRot
            var bArm = state.smoothBands[(arm * 7 + (octWorld & 7) * 5) & 63]
            var len1 = octScale * (0.68 + bArm * 0.34)
            var x0 = Math.cos(armA) * (octScale * 0.22)
            var y0 = Math.sin(armA) * (octScale * 0.22)
            var x1 = x0 + Math.cos(armA) * len1
            var y1 = y0 + Math.sin(armA) * len1
            // Generation 1 primary fractal limb
            ctx.moveTo(x0, y0)
            ctx.lineTo(x1, y1)

            // Generation 2 twin self-similar child limbs
            var len2 = len1 * subRatio
            for (var s1 = -1; s1 <= 1; s1 += 2) {
                var a2 = armA + s1 * branchSplit
                var x2 = x1 + Math.cos(a2) * len2
                var y2 = y1 + Math.sin(a2) * len2
                ctx.moveTo(x1, y1)
                ctx.lineTo(x2, y2)

                // Generation 3 fine recursive fractal twigs & Sierpinski/Koch diamond buds
                if (!isEcho || oct >= 2) {
                    var len3 = len2 * subRatio
                    for (var s2 = -1; s2 <= 1; s2 += 2) {
                        var a3 = a2 + s2 * (branchSplit * 0.88)
                        var x3 = x2 + Math.cos(a3) * len3
                        var y3 = y2 + Math.sin(a3) * len3
                        ctx.moveTo(x2, y2)
                        ctx.lineTo(x3, y3)
                        if (!isEcho) {
                            tipDiamonds.push(x3, y3, a3, Math.max(1.5, len3 * 0.36))
                        }
                    }
                }
            }
        }
        ctx.stroke()

        // Recursive Sierpinski/Koch jewel buds at Generation-3 fractal tips
        if (tipDiamonds.length > 0) {
            ctx.fillStyle = colourWithAlpha(colSecondary, 0.72 * envAlpha)
            ctx.beginPath()
            for (var td = 0; td < tipDiamonds.length; td += 4) {
                var tx = tipDiamonds[td], ty = tipDiamonds[td + 1]
                var ta = tipDiamonds[td + 2], tr2 = tipDiamonds[td + 3]
                var dx = Math.cos(ta) * tr2, dy = Math.sin(ta) * tr2
                var nx = -dy * 0.6, ny = dx * 0.6
                ctx.moveTo(tx + dx, ty + dy)
                ctx.lineTo(tx + nx, ty + ny)
                ctx.lineTo(tx - dx, ty - dy)
                ctx.lineTo(tx - nx, ty - ny)
                ctx.closePath()
            }
            ctx.fill()
        }
    }

    ctx.restore()
}

// Mode 6: 3D Sacred Lotus Hyperspace Dome & Jewelled Mandala Vault
function drawMode6DmtChrysanthemum(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.46 * (cfg.layer2Zoom || 1.0)
    var symmetry = clamp(Math.round(Number(cfg.layer2Facets) || 8), 6, 16)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var rings = isEcho ? 3 : Math.max(4, Math.min(7, Math.round(5 * (cfg.layer2Complexity || 1.0) * lod)))
    var steps = isEcho ? 24 : 40

    // 3D hemispherical dome camera breathing (pitch & roll)
    var camTilt = Math.sin(state.t * 0.48) * 0.34
    var camRoll = Math.cos(state.t * 0.36) * 0.14 * (1.0 + state.mid * 0.5)
    var cosTilt = Math.cos(camTilt), sinTilt = Math.sin(camTilt)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(camRoll)
    ctx.globalCompositeOperation = "source-over"

    var prevDomeRing = null
    // 1. 3D Hemispherical Lotus Dome Tiers (outer rim r = rings inward to apex r = 1)
    for (var r = rings; r >= 1; r--) {
        var frac = r / rings
        // Hemispherical z-elevation rises toward the central dome apex
        var domeZ = Math.cos(frac * Math.PI * 0.46) * (0.45 + state.bass * 0.28)
        var rot = state.phase * ((r % 2 === 0) ? 1.0 : -1.0) * (1.25 - frac * 0.45)
        var curRing = []

        for (var i = 0; i <= steps; i++) {
            var a = (i / steps) * Math.PI * 2
            var bVal = state.smoothBands[(i + r * 7) & 63]
            var petal = Math.sin(a * symmetry + rot) * (0.14 + bVal * 0.24 + state.mid * 0.10)
                      + Math.cos(a * symmetry * 2.0 - rot * 1.5) * 0.06
            var rad3 = frac * (0.82 + state.bass * 0.22 + petal)
            var x3 = Math.cos(a) * rad3
            var y3 = Math.sin(a) * rad3
            var z3 = domeZ + petal * 0.35

            // 3D pitch rotation & perspective projection
            var yRot = y3 * cosTilt - z3 * sinTilt
            var zRot = y3 * sinTilt + z3 * cosTilt
            var persp = 1.55 / (2.10 - clamp(zRot, -1.1, 1.1))
            curRing.push({
                x: x3 * maxR * persp,
                y: yRot * maxR * persp
            })
        }

        var jewelCol = palette[(r * 2 + state.beatCount) % palette.length]
        var goldCol = palette[(r * 2 + 1 + state.beatCount) % palette.length]

        // Filled translucent jewelled lotus petals & dome cells between tiers
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

        // Thick glowing sacred lotus tier crest
        ctx.strokeStyle = colourWithAlpha(goldCol, 0.54 + (1.0 - frac) * 0.44)
        ctx.lineWidth = (1.6 + (1.0 - frac) * 2.2 + state.beatPulse * 1.4) * (isEcho ? 0.75 : 1.0)
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
            ctx.fillStyle = colourWithAlpha(palette[(tri * 4 + 2) % palette.length], 0.16 + state.bass * 0.14)
            ctx.strokeStyle = colourWithAlpha(palette[(tri * 4) % palette.length], 0.88)
            ctx.lineWidth = 2.2 + state.beatPulse * 1.4
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
        ctx.strokeStyle = colourWithAlpha(palette[1 % palette.length], 0.74 + state.high * 0.26)
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

// Mode 7: 3D Relativistic Black Hole Gravity Funnel, Volumetric Accretion Disc & Twin Quasar Jets
function drawMode7SpacetimeQuasar(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod

    // 3D camera tilt and orbital precession for the relativistic gravity funnel & quasar axis
    var tiltX = 0.92 + Math.sin(state.t * 0.42) * 0.18
    var precession = Math.sin(state.t * 0.31) * 0.28
    var cosT = Math.cos(tiltX), sinT = Math.sin(tiltX)

    function proj3D(x3, y3, z3) {
        var yr = y3 * cosT - z3 * sinT
        var zr = y3 * sinT + z3 * cosT
        var persp = 1.75 / (2.35 - clamp(zr, -1.35, 1.35))
        return {
            x: x3 * minDim * 0.46 * persp,
            y: yr * minDim * 0.46 * persp,
            p: persp
        }
    }

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(precession)
    ctx.globalCompositeOperation = "source-over"

    // 1. 3D Flamm's Paraboloid Spacetime Gravity Funnel (concentric depth rings + geodesic meridians)
    var rRings = isEcho ? 4 : Math.max(5, Math.min(9, Math.round(7 * comp)))
    var meridians = isEcho ? 14 : 24
    var gravWell = 0.28 + state.bass * 0.34 + state.beatPulse * 0.18
    var funnelGrid = []

    for (var rIdx = 0; rIdx < rRings; rIdx++) {
        var rFrac = (rIdx + 1) / rRings // 0.14 (throat) .. 1.0 (outer spacetime fabric)
        var r3 = 0.12 + Math.pow(rFrac, 1.25) * 0.92
        // Relativistic Flamm's paraboloid depression z = -G / r
        var zWell = -gravWell / (rFrac + 0.26) + 0.22
        var frameDrag = state.phase * (1.25 / (rFrac + 0.35))
        var ringPts = []
        for (var m = 0; m <= meridians; m++) {
            var ang = (m / meridians) * Math.PI * 2 + frameDrag
            var bVal = state.smoothBands[(m * 2 + rIdx * 5) & 63]
            var ripple = Math.sin(ang * 4.0 - state.t * 3.2) * bVal * 0.08
            var radM = r3 + ripple
            ringPts.push(proj3D(Math.cos(ang) * radM, Math.sin(ang) * radM, zWell))
        }
        funnelGrid.push(ringPts)
    }

    // Fill translucent warped spacetime funnel cells between concentric gravity rings
    if (!isEcho || (state.echoIndex || 0) < 2) {
        for (var fr = 0; fr < rRings - 1; fr++) {
            var g0 = funnelGrid[fr]
            var g1 = funnelGrid[fr + 1]
            ctx.fillStyle = colourWithAlpha(palette[(fr * 2) % palette.length], (0.06 + (1.0 - fr / rRings) * 0.10) * (isEcho ? 0.5 : 1.0))
            ctx.beginPath()
            for (var ms = 0; ms < meridians; ms += 2) {
                ctx.moveTo(g0[ms].x, g0[ms].y)
                ctx.lineTo(g0[ms + 1].x, g0[ms + 1].y)
                ctx.lineTo(g1[ms + 1].x, g1[ms + 1].y)
                ctx.lineTo(g1[ms].x, g1[ms].y)
                ctx.closePath()
            }
            ctx.fill()
        }
    }

    // Batched geodesic rings + frame-dragged radial meridians
    ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], 0.42 + state.bass * 0.35)
    ctx.lineWidth = 1.3 + state.bass * 1.1
    ctx.beginPath()
    for (var gr = 0; gr < rRings; gr++) {
        var ring = funnelGrid[gr]
        for (var gm = 0; gm <= meridians; gm++) {
            if (gm === 0) ctx.moveTo(ring[gm].x, ring[gm].y)
            else ctx.lineTo(ring[gm].x, ring[gm].y)
        }
    }
    for (var gm2 = 0; gm2 < meridians; gm2 += 2) {
        ctx.moveTo(funnelGrid[0][gm2].x, funnelGrid[0][gm2].y)
        for (var gr2 = 1; gr2 < rRings; gr2++) {
            ctx.lineTo(funnelGrid[gr2][gm2].x, funnelGrid[gr2][gm2].y)
        }
    }
    ctx.stroke()

    // 2. Volumetric Relativistic Accretion Disc & Gravitational-Lensing Photon Halo
    var discSteps = isEcho ? 24 : 36
    for (var dBand = 2; dBand >= 0; dBand--) {
        var rIn = 0.16 + dBand * 0.11
        var rOut = rIn + 0.12 + state.bass * 0.08
        var discCol = palette[(dBand * 2 + 1 + state.beatCount) % palette.length]
        ctx.fillStyle = colourWithAlpha(discCol, (0.18 + (2 - dBand) * 0.08 + state.bass * 0.14) * (isEcho ? 0.55 : 1.0))
        ctx.strokeStyle = colourWithAlpha(palette[(dBand * 2 + state.beatCount) % palette.length], 0.78 + state.beatPulse * 0.22)
        ctx.lineWidth = (dBand === 0 ? 2.6 : 1.6) + state.bass * 1.6
        ctx.beginPath()
        for (var ds = 0; ds <= discSteps; ds++) {
            var da = (ds / discSteps) * Math.PI * 2 + state.phase * (2.2 - dBand * 0.4)
            var dbv = state.smoothBands[(ds * 2 + dBand * 9) & 63]
            // Relativistic Doppler beaming boosts thickness & luminosity on the approaching (left) side
            var doppler = 1.0 + 0.26 * Math.cos(da)
            var ro = (rOut + dbv * 0.16) * doppler
            var pOut = proj3D(Math.cos(da) * ro, Math.sin(da) * ro, 0.0)
            if (ds === 0) ctx.moveTo(pOut.x, pOut.y)
            else ctx.lineTo(pOut.x, pOut.y)
        }
        for (var dsBack = discSteps; dsBack >= 0; dsBack--) {
            var da2 = (dsBack / discSteps) * Math.PI * 2 + state.phase * (2.2 - dBand * 0.4)
            var pIn = proj3D(Math.cos(da2) * rIn, Math.sin(da2) * rIn, 0.0)
            ctx.lineTo(pIn.x, pIn.y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    // Gravitational-lensing vertical photon halo arc bent over and under the black hole shadow
    if (!isEcho || (state.echoIndex || 0) < 2) {
        var haloR = minDim * (0.095 + state.bass * 0.025)
        ctx.strokeStyle = colourWithAlpha(palette[2 % palette.length], 0.85 + state.beatPulse * 0.15)
        ctx.lineWidth = 2.4 + state.bass * 1.8
        ctx.beginPath()
        for (var hs = 0; hs <= 28; hs++) {
            var ha = (hs / 28) * Math.PI * 2
            var hx = Math.cos(ha) * haloR * 1.08
            var hy = Math.sin(ha) * haloR * 0.96
            if (hs === 0) ctx.moveTo(hx, hy)
            else ctx.lineTo(hx, hy)
        }
        ctx.closePath()
        ctx.stroke()
    }

    // 3. Twin Relativistic Helical Quasar Plasma Jets blasting from North & South Poles
    var jetLen = 0.65 + state.bass * 0.52 + state.beatPulse * 0.35
    var jetSteps = isEcho ? 10 : 18
    for (var pole = -1; pole <= 1; pole += 2) {
        var jetCol = palette[(pole < 0 ? 3 : 5) % palette.length]
        var coreCol = palette[1 % palette.length]
        var leftJet = [], rightJet = []
        for (var js = 0; js <= jetSteps; js++) {
            var ju = js / jetSteps
            var jz = pole * (0.08 + ju * jetLen)
            var coneR = (0.03 + Math.pow(ju, 1.35) * (0.16 + state.bass * 0.12)) * (1.0 + state.smoothBands[(js * 3) & 63] * 0.45)
            var helixA = state.t * 6.5 * pole + ju * 8.0
            leftJet.push(proj3D(Math.cos(helixA) * coneR, Math.sin(helixA) * coneR, jz))
            rightJet.push(proj3D(Math.cos(helixA + Math.PI) * coneR, Math.sin(helixA + Math.PI) * coneR, jz))
        }

        // Volumetric plasma jet cone fill
        ctx.fillStyle = colourWithAlpha(jetCol, (0.20 + state.bass * 0.22) * (isEcho ? 0.5 : 1.0))
        ctx.strokeStyle = colourWithAlpha(coreCol, 0.85 + state.beatPulse * 0.15)
        ctx.lineWidth = 2.0 + state.bass * 2.2
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
    for (var bl = bellLayers - 1; bl >= 0; bl--) {
        var bFrac = (bl + 1) / bellLayers
        var bellW = minDim * (0.14 + bFrac * 0.22) * (1.0 - pulseContract * 0.14 + state.bass * 0.18)
        var bellH = minDim * (0.09 + bFrac * 0.14) * (1.0 + pulseContract * 0.18 + state.bass * 0.14)
        var canopyCol = palette[(bl * 2 + state.beatCount) % palette.length]
        var rimCol = palette[(bl * 2 + 1 + state.beatCount) % palette.length]

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
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var speed = clamp(cfg.layer2Speed || 1.0, 0.2, 3.0)
    var zoom = clamp(cfg.layer2Zoom || 1.0, 0.5, 2.2)

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    // Helper that appends a segmented Katakana / Matrix digital glyph inside cell (gx, gy, gw, gh)
    function addMatrixGlyph(ctx, gx, gy, gw, gh, seed) {
        var pat = (seed & 7)
        var barH = Math.max(1.3, gh * 0.18)
        var barW = Math.max(1.3, gw * 0.22)
        // Top horizontal stroke (present on most Katakana characters)
        ctx.rect(gx - gw * 0.42, gy - gh * 0.42, gw * 0.84, barH)
        if (pat === 0) {
            // コ / ロ style bracket glyph
            ctx.rect(gx + gw * 0.20, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.24, gw * 0.84, barH)
        } else if (pat === 1) {
            // テ / ナ style T-cross glyph
            ctx.rect(gx - gw * 0.36, gy - gh * 0.06, gw * 0.72, barH)
            ctx.rect(gx - barW * 0.5, gy - gh * 0.06, barW, gh * 0.48)
        } else if (pat === 2) {
            // ミ / ニ style triple horizontal ledger bars
            ctx.rect(gx - gw * 0.34, gy - barH * 0.5, gw * 0.68, barH)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.26, gw * 0.84, barH)
        } else if (pat === 3) {
            // カ / ク style vertical stem + side hook
            ctx.rect(gx - gw * 0.38, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx + gw * 0.16, gy - gh * 0.12, barW, gh * 0.54)
        } else if (pat === 4) {
            // メ / ス style twin split strokes + centre node
            ctx.rect(gx - barW * 0.5, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.04, gw * 0.32, barH)
            ctx.rect(gx + gw * 0.12, gy - gh * 0.12, gw * 0.30, barH)
        } else if (pat === 5) {
            // ヨ / E style comb glyph
            ctx.rect(gx + gw * 0.20, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.36, gy - barH * 0.5, gw * 0.68, barH)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.26, gw * 0.84, barH)
        } else if (pat === 6) {
            // リ / ル style parallel vertical rails
            ctx.rect(gx - gw * 0.32, gy - gh * 0.20, barW, gh * 0.52)
            ctx.rect(gx + gw * 0.12, gy - gh * 0.42, barW, gh * 0.84)
        } else {
            // ホ / キ style cross + lower terminals
            ctx.rect(gx - barW * 0.5, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.40, gy - barH * 0.5, gw * 0.80, barH)
            ctx.rect(gx - gw * 0.38, gy + gh * 0.24, barW, barH * 1.2)
            ctx.rect(gx + gw * 0.18, gy + gh * 0.24, barW, barH * 1.2)
        }
    }

    // 3 Depth Planes of Falling Matrix Digital Rain (0 = far dim rain, 1 = mid-plane rain, 2 = foreground crisp rain)
    var startPlane = isEcho ? 1 : 0
    for (var zPlane = startPlane; zPlane <= 2; zPlane++) {
        var depthScale = (0.58 + zPlane * 0.26) * zoom
        var cols = isEcho
            ? (12 + zPlane * 4)
            : Math.max(16, Math.min(44, Math.round((18 + zPlane * 9) * clamp(comp, 0.65, 1.35))))
        var colW = w / cols
        var glyphW = clamp(colW * 0.66, 4.5, 22.0)
        var glyphH = glyphW * 1.28
        var trailLen = isEcho ? (5 + zPlane * 2) : (7 + zPlane * 4)
        var planeAlpha = (0.36 + zPlane * 0.30) * (isEcho ? 0.55 : 1.0)

        // Authentic Matrix Phosphor Green graded with subtle active palette tint
        var palTint = palette[(zPlane * 2 + state.beatCount) % palette.length]
        var colHead = "#eafff5"                                          // White-hot phosphor-mint leading glyph
        var colNear = zPlane === 2 ? "#00ff66" : "#10d96b"               // Vivid Matrix phosphor green
        var colMid  = zPlane === 1 ? colourWithAlpha(palTint, 0.85) : "#059e47"
        var colTail = "#034d1f"                                          // Deep emerald trailing fade

        // 1. Subtle vertical phosphor scanline beam behind active high-energy columns
        if (!isEcho && zPlane >= 1) {
            ctx.fillStyle = colourWithAlpha("#00ff66", 0.05 + state.bass * 0.07)
            ctx.beginPath()
            for (var cBeam = 0; cBeam < cols; cBeam++) {
                var bBeam = state.smoothBands[(cBeam * 2 + zPlane * 7) & 63]
                if (bBeam < 0.22) continue
                var cSeedB = ((cBeam * 73 + zPlane * 131) % 97) / 97.0
                var fallSpdB = (0.28 + cSeedB * 0.42 + zPlane * 0.14) * speed * (1.0 + state.bass * 0.45)
                var headYB = (((state.t * fallSpdB + cSeedB * 3.7) % 1.45) - 0.15) * h
                var beamH = trailLen * glyphH * (0.75 + bBeam * 0.55)
                var bx = (cBeam + 0.5) * colW
                ctx.rect(bx - glyphW * 0.45, headYB - beamH, glyphW * 0.90, beamH + glyphH)
            }
            ctx.fill()
        }

        // 2. Trailing Phosphor-Green Glyph Cascade (batched into 3 luminance tiers: Near-Head, Mid-Trail, Deep-Tail)
        var tierColours = [colNear, colMid, colTail]
        var tierAlphas = [0.92 * planeAlpha, 0.64 * planeAlpha, 0.34 * planeAlpha]

        for (var tier = 2; tier >= 0; tier--) {
            ctx.fillStyle = colourWithAlpha(tierColours[tier], tierAlphas[tier])
            ctx.beginPath()
            var tStart = tier === 0 ? 1 : (tier === 1 ? 3 : Math.floor(trailLen * 0.55))
            var tEnd = tier === 0 ? 2 : (tier === 1 ? Math.floor(trailLen * 0.55) - 1 : trailLen)

            for (var c = 0; c < cols; c++) {
                var bIdx = (c * 2 + zPlane * 9) & 63
                var bVal = state.smoothBands[bIdx]
                var cSeed = ((c * 73 + zPlane * 131) % 97) / 97.0
                var fallSpeed = (0.28 + cSeed * 0.42 + zPlane * 0.14) * speed * (1.0 + state.bass * 0.45 + bVal * 0.35)
                var streams = (!isEcho && zPlane === 2 && (c % 3 === 0)) ? 2 : 1

                for (var st = 0; st < streams; st++) {
                    var headY = (((state.t * fallSpeed + cSeed * 3.7 + st * 0.68) % 1.45) - 0.15) * h
                    var glitchX = Math.sin(state.t * 5.0 + c * 0.8 + zPlane) * state.beatPulse * 4.5 * depthScale
                    var gx = (c + 0.5) * colW + glitchX

                    for (var k = tStart; k <= tEnd; k++) {
                        var gy = headY - k * glyphH * 1.12
                        if (gy < -glyphH || gy > h + glyphH) continue
                        // Rapidly mutating digital glyph seed (classic Matrix character flip!)
                        var charTick = Math.floor(state.t * (8.0 + (k & 3) * 3.0))
                        var gSeed = (c * 31 + k * 17 + zPlane * 53 + st * 19 + charTick) & 255
                        var scaleK = 1.0 - (k / (trailLen + 2)) * 0.25
                        addMatrixGlyph(ctx, gx, gy, glyphW * scaleK, glyphH * scaleK, gSeed)
                    }
                }
            }
            ctx.fill()
        }

        // 3. White-Hot Phosphor-Mint Leading Head Glyphs dropping at the tip of every Matrix stream
        ctx.fillStyle = colourWithAlpha(colHead, clamp(0.96 * planeAlpha + state.beatPulse * 0.15, 0.2, 1.0))
        ctx.beginPath()
        for (var ch = 0; ch < cols; ch++) {
            var bIdxH = (ch * 2 + zPlane * 9) & 63
            var bValH = state.smoothBands[bIdxH]
            var cSeedH = ((ch * 73 + zPlane * 131) % 97) / 97.0
            var fallSpeedH = (0.28 + cSeedH * 0.42 + zPlane * 0.14) * speed * (1.0 + state.bass * 0.45 + bValH * 0.35)
            var streamsH = (!isEcho && zPlane === 2 && (ch % 3 === 0)) ? 2 : 1

            for (var stH = 0; stH < streamsH; stH++) {
                var headYH = (((state.t * fallSpeedH + cSeedH * 3.7 + stH * 0.68) % 1.45) - 0.15) * h
                if (headYH < -glyphH || headYH > h + glyphH) continue
                var glitchXH = Math.sin(state.t * 5.0 + ch * 0.8 + zPlane) * state.beatPulse * 4.5 * depthScale
                var gxH = (ch + 0.5) * colW + glitchXH
                var headBoost = 1.08 + bValH * 0.28 + state.beatPulse * 0.18
                var headSeed = (ch * 41 + Math.floor(state.t * 14.0) + zPlane * 19 + stH * 11) & 255
                addMatrixGlyph(ctx, gxH, headYH, glyphW * headBoost, glyphH * headBoost, headSeed)
            }
        }
        ctx.fill()
    }

    // 4. Audio-Reactive Matrix Horizontal Digital Pulse Wave across the rain curtain
    if (!isEcho) {
        var scanY = ((state.t * 0.38 * speed) % 1.0) * h
        ctx.strokeStyle = colourWithAlpha("#00ff66", 0.42 + state.bass * 0.38)
        ctx.lineWidth = 1.6 + state.beatPulse * 1.8
        ctx.beginPath()
        var waveCols = 48
        for (var wc = 0; wc <= waveCols; wc++) {
            var wx = (wc / waveCols) * w
            var wb = state.smoothBands[(wc + state.beatCount * 3) & 63]
            var wy = scanY + (wb - 0.18) * h * 0.12 * Math.sin(wc * 0.6 + state.t * 6.0)
            if (wc === 0) ctx.moveTo(wx, wy)
            else ctx.lineTo(wx, wy)
        }
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

        var ribFillCol = palette[(ribbon * 3 + state.beatCount) % palette.length]
        var ribStrokeCol = palette[(ribbon * 3 + 1 + state.beatCount) % palette.length]

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
    var m = ((Number(cfg && cfg.layer2Mode !== undefined ? cfg.layer2Mode : (cfg && cfg.mode)) || 0) % MODE_NAMES.length + MODE_NAMES.length) % MODE_NAMES.length

    // Universal 3D Graded History Tracer Engine across ALL 12 Layer #2 Modes!
    var tracerCount = clamp(Math.round(Number(cfg && cfg.tracerCount !== undefined ? cfg.tracerCount : 9)), 1, 16)
    var tracerSpeed = state.liveTracerSpeed !== undefined
        ? state.liveTracerSpeed
        : clamp(Number(cfg && cfg.tracerSpeed !== undefined ? cfg.tracerSpeed : 1.15), 0.15, 3.0)
    var tracerDrift = state.liveTracerDrift !== undefined
        ? state.liveTracerDrift
        : clamp(Number(cfg && cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0), 0.0, 2.5)
    var tracerDir = Number(cfg && cfg.tracerDirection !== undefined ? cfg.tracerDirection : 1)

    if (tracerCount <= 1) {
        state.isTracerEcho = false
        state.echoIndex = 0
        state.echoLod = 1.0
        drawSingleLayer2Mode(ctx, w, h, state, palette, cfg, m)
        return
    }

    var cx = w * 0.5
    var cy = h * 0.5
    var baseT = state.t
    var basePhase = state.phase
    var endPt = computeTracerEndpoint(w, h, baseT, tracerDrift, tracerSpeed)
    var lagStep = 0.052 * (0.45 + 0.55 * tracerSpeed)
    var effDir = (tracerDir === 0) ? Math.sin(baseT * 0.55 * tracerSpeed) : clamp(tracerDir, -1, 1)
    var echoAtten = 1.0 / (1.0 + Math.sqrt(tracerCount) * 0.45)

    // Render from oldest historical echo slice (e = tracerCount - 1) to leading front edge (e = 0)
    // Performance & Anti-Bleach Optimisation for Qt6 QRasterPaintEngine:
    //   On historical echo slices (e > 0) for polygon modes (m !== 9), suppress ctx.fill() so echoes
    //   render as crisp 3D neon vector wireframe trails — eliminating 80+ full-screen software polygon
    //   rasterisations per frame AND preventing overlapping tracer fills from bleaching colours!
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

        // 3D Z-Flow & Moving Vanishing Endpoint projection:
        //   effDir >= 0 ("Towards User"): geometry spawns near the moving endpoint and historical tracers expand TOWARDS the user!
        //   effDir <  0 ("To Endpoint"):  geometry starts large in the foreground and trails into the moving vanishing endpoint!
        var zScale = 1.0
        var tx = 0.0
        var ty = 0.0
        if (effDir >= 0) {
            var towardsAmt = 0.5 + 0.5 * effDir
            zScale = 0.58 + curveU * (0.85 + 0.52 * tracerSpeed * towardsAmt)
            tx = endPt.dx * (0.45 * (1.0 - curveU) - 0.35 * curveU)
            ty = endPt.dy * (0.45 * (1.0 - curveU) - 0.35 * curveU)
        } else {
            var awayAmt = Math.abs(effDir)
            zScale = 1.12 / (1.0 + curveU * (1.35 + 0.75 * tracerSpeed * awayAmt))
            tx = endPt.dx * curveU
            ty = endPt.dy * curveU
        }

        var alphaE = (e === 0) ? 0.98 : (Math.pow(1.0 - u * 0.86, 1.42) * 0.78 * echoAtten)
        var twistAngle = Math.sin(baseT * 0.36 * tracerSpeed) * 0.14 * curveU

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
    var asciiMode = cfg.layer3AsciiMode || cfg.asciiMode || "braille"
    var isWordsBanner = (l3Mode === 5 || asciiMode === "banner" || cfg.useAlbumArt === false)
    var isBrailleArt = (!isWordsBanner && asciiMode !== "block")

    // When in Omarchy TTE Keyframe Morph mode (l3Mode === 5) or Banner/Words mode (asciiMode === "banner" or !cfg.useAlbumArt),
    // prefer `cfg.bannerLines` (the wrapped & compressed artist/track words, e.g. 'BASS COMMUNION') if available!
    var effectiveLines = asciiLines
    if (isWordsBanner && cfg.bannerLines && cfg.bannerLines.length > 0) {
        effectiveLines = cfg.bannerLines
    } else if (cfg.useAlbumArt && (asciiMode === "braille" || asciiMode === "block") && cfg.artLines && cfg.artLines.length > 0) {
        effectiveLines = cfg.artLines
    }

    if (!effectiveLines || effectiveLines.length === 0) return

    rebuildArtCells(state, effectiveLines, asciiMode)
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
        var fPos = (state.t * 3.2 + state.bass * 2.5) % (ttfxFrames.length * 2)
        var fIdx = Math.floor(fPos >= ttfxFrames.length ? (ttfxFrames.length * 2 - 1 - fPos) : fPos)
        activeTtfxFrame = ttfxFrames[clamp(fIdx, 0, ttfxFrames.length - 1)]
    }

    // Layer #3 3D Graded History Tracers (`layer3Tracers`)
    var l3Tracers = clamp(Math.round(Number(cfg.layer3Tracers !== undefined ? cfg.layer3Tracers : 4)), 1, 8)
    var tracerSpeed = state.liveTracerSpeed !== undefined
        ? state.liveTracerSpeed
        : clamp(Number(cfg.tracerSpeed !== undefined ? cfg.tracerSpeed : 1.15), 0.15, 3.0)
    var tracerDrift = state.liveTracerDrift !== undefined
        ? state.liveTracerDrift
        : clamp(Number(cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0), 0.0, 2.5)
    var tracerDir = Number(cfg.tracerDirection !== undefined ? cfg.tracerDirection : 1)
    var endPt = computeTracerEndpoint(w, h, state.t, tracerDrift, tracerSpeed)
    var numBuckets = 6

    for (var e = l3Tracers - 1; e >= 0; e--) {
        var isEcho = (e > 0)
        var u = l3Tracers > 1 ? (e / (l3Tracers - 1)) : 0.0
        var zScale = (tracerDir >= 0)
            ? (1.0 + u * 0.36 * tracerSpeed)
            : (1.0 / (1.0 + u * 0.55 * tracerSpeed))
        var tx = endPt.dx * u * 0.42 * (tracerDir >= 0 ? -1.0 : 1.0)
        var ty = endPt.dy * u * 0.42 * (tracerDir >= 0 ? -1.0 : 1.0)
        var passAlpha = isEcho ? (Math.pow(1.0 - u * 0.82, 1.4) * 0.34) : (0.84 + state.bass * 0.16)
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
                        px += Math.cos(p.phase + state.t * 3.0) * (14.0 + state.bass * 32.0)
                        py += Math.sin(p.phase - state.t * 3.0) * (14.0 + state.bass * 32.0)
                    }
                }

                var pulseBoost = 0.82 + p.density * 0.18 + bVal * 0.22
                var szW = tileW * pulseBoost
                var szH = tileH * pulseBoost

                if (p.brailleMask > 0 || isBrailleArt) {
                    // Genuine 2x4 Braille pinpoint dot-matrix rendering (NEVER solid blocks!)
                    var mask = p.brailleMask || (((i * 37 + 13) & 0xFF) | 0x09)
                    var dotW = Math.max(1.2, szW * 0.22)
                    var dotH = Math.max(1.2, szH * 0.16)
                    // Draw up to 4 active Braille dots per cell for crisp stipple detail at <0.4ms
                    var drawnDots = 0
                    for (var bit = 0; bit < 8; bit++) {
                        if ((mask >> bit) & 1) {
                            var dx = px + BRAILLE_DOT_DX[bit] * szW
                            var dy = py + BRAILLE_DOT_DY[bit] * szH
                            ctx.rect(dx - dotW * 0.5, dy - dotH * 0.5, dotW, dotH)
                            drawnDots++
                            if (drawnDots >= (isEcho ? 2 : 4)) break
                        }
                    }
                } else if (isWordsBanner) {
                    // Crisp neon laser-stipple typography for Song/Artist Words (NEVER chunky solid blocks!)
                    var dotS = Math.max(1.3, Math.min(szW, szH) * 0.26)
                    if (p.ch === "░" || p.ch === "." || p.ch === "·") {
                        ctx.rect(px - dotS * 0.5, py - dotS * 0.5, dotS, dotS)
                    } else if (p.ch === "▒" || p.ch === ":") {
                        ctx.rect(px - szW * 0.24, py - szH * 0.24, dotS, dotS)
                        ctx.rect(px + szW * 0.12, py + szH * 0.12, dotS, dotS)
                    } else if (p.ch === "▓") {
                        ctx.rect(px - szW * 0.25, py - szH * 0.25, dotS, dotS)
                        ctx.rect(px + szW * 0.12, py - szH * 0.25, dotS, dotS)
                        ctx.rect(px - dotS * 0.5, py + szH * 0.14, dotS, dotS)
                    } else if (p.ch === "▀") {
                        ctx.rect(px - szW * 0.36, py - szH * 0.36, szW * 0.72, Math.max(1.4, szH * 0.28))
                    } else if (p.ch === "▄") {
                        ctx.rect(px - szW * 0.36, py + szH * 0.08, szW * 0.72, Math.max(1.4, szH * 0.28))
                    } else if (p.ch === "▌") {
                        ctx.rect(px - szW * 0.36, py - szH * 0.36, Math.max(1.4, szW * 0.28), szH * 0.72)
                    } else if (p.ch === "▐") {
                        ctx.rect(px + szW * 0.08, py - szH * 0.36, Math.max(1.4, szW * 0.28), szH * 0.72)
                    } else {
                        // Sleek twin neon ledger bars / pinpoints instead of a heavy solid rectangle
                        var barH = Math.max(1.3, szH * 0.24)
                        ctx.rect(px - szW * 0.36, py - szH * 0.32, szW * 0.72, barH)
                        ctx.rect(px - szW * 0.36, py + szH * 0.08, szW * 0.72, barH)
                    }
                } else {
                    // Explicit Block Cover Art mode (`█ Block Art`): classic ANSI half-block mosaic
                    if (p.ch === "▀") {
                        ctx.rect(px - szW * 0.5, py - szH * 0.5, szW, szH * 0.52)
                    } else if (p.ch === "▄") {
                        ctx.rect(px - szW * 0.5, py - szH * 0.02, szW, szH * 0.52)
                    } else if (p.ch === "▌") {
                        ctx.rect(px - szW * 0.5, py - szH * 0.5, szW * 0.52, szH)
                    } else if (p.ch === "▐") {
                        ctx.rect(px - szW * 0.02, py - szH * 0.5, szW * 0.52, szH)
                    } else {
                        ctx.rect(px - szW * 0.46, py - szH * 0.46, szW * 0.92, szH * 0.92)
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
    return {
        playing: c.playing !== undefined ? Boolean(c.playing) : true,
        palette: Number(c.palette) || 0,
        musicDrive: c.musicDrive !== undefined ? Boolean(c.musicDrive) : true,
        trackArcMode: c.trackArcMode !== undefined ? clamp(Math.round(Number(c.trackArcMode)), 0, 4) : 1,
        tracerCount: c.tracerCount !== undefined ? clamp(Math.round(Number(c.tracerCount)), 1, 16) : 9,
        tracerSpeed: c.tracerSpeed !== undefined ? clamp(Number(c.tracerSpeed), 0.15, 3.0) : 1.15,
        tracerDrift: c.tracerDrift !== undefined ? clamp(Number(c.tracerDrift), 0.0, 2.5) : 1.0,
        tracerDirection: c.tracerDirection !== undefined ? Number(c.tracerDirection) : 1,
        layer1Enabled: c.layer1Enabled !== undefined ? Boolean(c.layer1Enabled) : true,
        layer1FieldEnabled: c.layer1FieldEnabled !== undefined ? Boolean(c.layer1FieldEnabled) : true,
        layer1Mode: Number(c.layer1Mode) || 0,
        layer1Trail: Number(c.layer1Trail !== undefined ? c.layer1Trail : (c.layer1Persistence !== undefined ? c.layer1Persistence : 0.85)),
        layer1Speed: Number(c.layer1Speed !== undefined ? c.layer1Speed : 1.0),
        layer1Density: Number(c.layer1Density !== undefined ? c.layer1Density : 1.0),
        layer1Dim: Number(c.layer1Dim !== undefined ? c.layer1Dim : 0.15),
        layer1EqEnabled: c.layer1EqEnabled !== undefined ? Boolean(c.layer1EqEnabled) : false,
        layer1EqStyle: c.layer1EqStyle !== undefined ? clamp(Math.round(Number(c.layer1EqStyle)), 0, 5) : 0,
        layer1EqLayout: c.layer1EqLayout !== undefined ? clamp(Math.round(Number(c.layer1EqLayout)), 0, 2) : 0,
        layer1EqGain: c.layer1EqGain !== undefined ? clamp(Number(c.layer1EqGain), 0.4, 2.5) : 1.25,
        layer1EqDamping: c.layer1EqDamping !== undefined ? clamp(Math.round(Number(c.layer1EqDamping)), 0, 2) : 0,
        layer1ShapesEnabled: c.layer1ShapesEnabled !== undefined ? Boolean(c.layer1ShapesEnabled) : true,
        layer1ShapeStyle: c.layer1ShapeStyle !== undefined ? clamp(Math.round(Number(c.layer1ShapeStyle)), 0, 5) : 0,
        layer1ShapeSpin: c.layer1ShapeSpin !== undefined ? clamp(Number(c.layer1ShapeSpin), -2.5, 2.5) : 0.25,
        layer1ShapeSpeed: c.layer1ShapeSpeed !== undefined ? clamp(Number(c.layer1ShapeSpeed), 0.2, 3.0) : 1.0,
        layer1ShapeScale: c.layer1ShapeScale !== undefined ? clamp(Number(c.layer1ShapeScale), 0.3, 2.5) : 1.0,
        layer2Enabled: c.layer2Enabled !== undefined ? Boolean(c.layer2Enabled) : true,
        layer2Mode: Number(c.layer2Mode !== undefined ? c.layer2Mode : (c.mode !== undefined ? c.mode : (mode || 0))),
        layer2Facets: Number(c.layer2Facets !== undefined ? c.layer2Facets : (c.symmetryFolds !== undefined ? c.symmetryFolds : 6)),
        layer2Complexity: Number(c.layer2Complexity !== undefined ? c.layer2Complexity : 1.0),
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
        layer3Tracers: c.layer3Tracers !== undefined ? clamp(Math.round(Number(c.layer3Tracers)), 1, 8) : 4,
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
