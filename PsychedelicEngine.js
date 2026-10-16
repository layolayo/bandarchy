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

    // Music-Driven Parameter Modulation envelopes (`musicDrive`)
    var rawIntensity = clamp(state.energy * 0.65 + state.beatPulse * 0.45 + (state.bassAtt - 1.0) * 0.25, 0.0, 1.5)
    state.musicIntensity = lerp(state.musicIntensity || 0.35, rawIntensity, clamp(dt * 8.0, 0.05, 0.4))
    state.musicCalm = clamp(1.0 - state.musicIntensity * 0.85, 0.08, 1.0)

    var mDrive = cfg.musicDrive !== undefined ? Boolean(cfg.musicDrive) : true
    state.liveDismantle = mDrive
        ? clamp(cfg.layer3Dismantle * (0.20 + 1.45 * state.musicIntensity + state.beatPulse * 1.15), 0.10, 3.20)
        : cfg.layer3Dismantle
    state.liveRebuild = mDrive
        ? clamp(cfg.layer3Rebuild * (0.45 + 1.65 * state.musicCalm), 0.15, 3.20)
        : cfg.layer3Rebuild
    state.liveEvolution = mDrive
        ? clamp(cfg.layer3Evolution * (0.40 + 1.15 * state.mid + 0.55 * cfg.trackProgress), 0.10, 3.00)
        : cfg.layer3Evolution
    state.liveTracerSpeed = mDrive
        ? clamp(cfg.tracerSpeed * (0.60 + 0.95 * state.musicIntensity + state.beatPulse * 0.55), 0.15, 3.00)
        : cfg.tracerSpeed
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

    // Step shockwaves
    for (var sw = state.shockwaves.length - 1; sw >= 0; sw--) {
        var wave = state.shockwaves[sw]
        wave.r += dt * wave.speed
        wave.alpha -= dt * 0.62
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

    // Evolution blend: increases as the song plays AND slowly breathes with phase,
    // so when the cover art rebuilds it evolves into new forms over the course of the track
    var evoMix = clamp(
        trackProg * 0.72 * evoRate + (0.5 - 0.5 * Math.cos(state.t * 0.22 * evoRate)) * 0.38 * evoRate,
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
// LAYER #1 — Background & Iterative Framebuffer Feedback Engine
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
    var l2On = cfg ? Boolean(cfg.layer2Enabled) : true
    var l3On = cfg ? Boolean(cfg.layer3Enabled) : true

    // Detect any layer ON/OFF toggle so disabled layers clear from the persistent buffer immediately
    if (state.lastL1 !== enabled || state.lastL2 !== l2On || state.lastL3 !== l3On) {
        state.lastL1 = enabled
        state.lastL2 = l2On
        state.lastL3 = l3On
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
    ctx.globalCompositeOperation = "source-over"
    ctx.globalAlpha = 1.0
    var veilAlpha = l1Mode === 5
        ? clamp(0.45 + dim * 0.5, 0.35, 0.95)
        : clamp((1.0 - trail) * 0.85 + dim * 0.30, 0.06, 0.65)
    ctx.fillStyle = colourWithAlpha(bgHex, veilAlpha)
    ctx.fillRect(0, 0, w, h)

    if (l1Mode === 0) {
        // Mode 0: MilkDrop / Geiss Expanding Logarithmic Warp Tunnel Rings with Moving Endpoint Tracers
        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        var ringCount = Math.max(5, Math.min(10, Math.round(7 * density)))
        for (var rb = 0; rb < 3; rb++) {
            ctx.strokeStyle = colourWithAlpha(palette[(rb * 2) % palette.length], (0.22 + state.bass * 0.34) * (1.0 - dim))
            ctx.lineWidth = 1.4 + state.bass * 1.6
            ctx.beginPath()
            for (var rIdx = rb; rIdx < ringCount; rIdx += 3) {
                var rProg = ((rIdx / ringCount) + (state.t * 0.28 * speed) % (1.0 / ringCount)) % 1.0
                var baseR = Math.pow(rProg, 1.42) * minDim * 0.68
                // Rings originate at the moving vanishing endpoint and expand towards the user!
                var ringCX = cx + endPt.dx * 0.65 * (1.0 - rProg)
                var ringCY = cy + endPt.dy * 0.65 * (1.0 - rProg)
                var rot = state.phase * (rIdx % 2 === 0 ? 0.35 : -0.35)
                var segs = 28
                for (var s = 0; s <= segs; s++) {
                    var ang = (s / segs) * Math.PI * 2 + rot
                    var bVal = state.smoothBands[(s * 2 + rIdx * 7) & 63]
                    var rr = baseR * (1.0 + Math.sin(ang * 4.0 + state.t * 1.8) * 0.08 + bVal * 0.16)
                    var wx = ringCX + Math.cos(ang) * rr
                    var wy = ringCY + Math.sin(ang) * rr
                    if (s === 0) ctx.moveTo(wx, wy)
                    else ctx.lineTo(wx, wy)
                }
            }
            ctx.stroke()
        }
        ctx.restore()
    } else if (l1Mode === 1) {
        // Mode 1: G-Force Polar FlowField Vector Streams from Moving Vanishing Endpoint
        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        ctx.lineWidth = 1.4 + state.bass * 1.2
        var focalX = cx + endPt.dx * 0.55
        var focalY = cy + endPt.dy * 0.55
        for (var fb = 0; fb < 3; fb++) {
            ctx.strokeStyle = colourWithAlpha(palette[(fb * 3) % palette.length], (0.24 + state.mid * 0.32) * (1.0 - dim))
            ctx.beginPath()
            var fCount = Math.max(8, Math.min(28, Math.floor(18 * density)))
            for (var fi = 0; fi < fCount; fi++) {
                var fa = (fi / fCount) * Math.PI * 2 + fb * 0.7 + state.t * 0.4 * speed
                var depthP = (fi * 0.19 + state.t * 0.25 * speed) % 0.65
                var fr1 = minDim * (0.06 + depthP)
                var fr2 = fr1 + minDim * (0.07 + state.smoothBands[(fi * 3) & 63] * 0.15)
                var curl = 0.14 + state.mid * 0.18
                var ox = lerp(focalX, cx, depthP)
                var oy = lerp(focalY, cy, depthP)
                ctx.moveTo(ox + Math.cos(fa) * fr1, oy + Math.sin(fa) * fr1)
                ctx.lineTo(ox + Math.cos(fa + curl) * fr2, oy + Math.sin(fa + curl) * fr2)
            }
            ctx.stroke()
        }
        ctx.restore()
    } else if (l1Mode === 2) {
        // Mode 2: Cthugha Rave Flame / Plasma Buffer seeded from 64-band spectrum
        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        var flames = state.flames || []
        for (var cBucket = 0; cBucket < 4; cBucket++) {
            ctx.fillStyle = colourWithAlpha(palette[(cBucket * 2) % palette.length], (0.14 + state.bass * 0.24) * (1.0 - dim))
            ctx.beginPath()
            for (var f = cBucket; f < flames.length; f += 4) {
                var fm = flames[f]
                var fx = fm.x * w + endPt.dx * 0.25 * (1.0 - fm.y)
                var fy = fm.y * h
                var fw = (w / 22.0) * (0.7 + fm.energy * 1.8) * density
                var fh = h * (0.06 + fm.energy * 0.22) * density
                ctx.rect(fx - fw * 0.5, fy - fh * 0.5, fw, fh)
            }
            ctx.fill()
        }
        // Bottom spectrum flame seed bar
        ctx.strokeStyle = colourWithAlpha(palette[1], 0.45 * (1.0 - dim))
        ctx.lineWidth = 2.2
        ctx.beginPath()
        for (var sb = 0; sb < 64; sb++) {
            var sx = (sb / 63.0) * w
            var sy = h - (state.smoothBands[sb] * h * 0.32 * density)
            if (sb === 0) ctx.moveTo(sx, sy)
            else ctx.lineTo(sx, sy)
        }
        ctx.stroke()
        ctx.restore()
    } else if (l1Mode === 3) {
        // Mode 3: Relativistic 3D Starfield Warp streaming from Moving Vanishing Endpoint
        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        var starOriginX = cx + endPt.dx * 0.60
        var starOriginY = cy + endPt.dy * 0.60
        var starLimit = Math.min(state.stars.length, Math.floor(90 * density))
        for (var sbk = 0; sbk < 3; sbk++) {
            ctx.strokeStyle = colourWithAlpha(palette[(sbk * 3) % palette.length], (0.45 + state.high * 0.4) * (1.0 - dim))
            ctx.lineWidth = 1.4 + sbk * 0.5 + state.bass * 1.2
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
        }
        ctx.restore()
    } else if (l1Mode === 4) {
        // Mode 4: Synthwave Horizon & Configurable Equaliser Backdrop (6 Styles, 3 Layouts, Gain & Response)
        var eqStyle = cfg && cfg.layer1EqStyle !== undefined ? ((Number(cfg.layer1EqStyle) || 0) % LAYER1_EQ_STYLES.length) : 0
        var eqLayout = cfg && cfg.layer1EqLayout !== undefined ? ((Number(cfg.layer1EqLayout) || 0) % LAYER1_EQ_LAYOUTS.length) : 0
        var eqGain = cfg && cfg.layer1EqGain !== undefined ? clamp(Number(cfg.layer1EqGain), 0.2, 3.0) : 1.25
        var eqDamping = cfg && cfg.layer1EqDamping !== undefined ? ((Number(cfg.layer1EqDamping) || 0) % 3) : 0

        var horizonY = cy + h * 0.08 + endPt.dy * 0.22
        var vanishX = cx + endPt.dx * 0.48
        ctx.save()
        ctx.globalCompositeOperation = "lighter"

        // Perspective SynthGrid floor below horizonY
        ctx.strokeStyle = colourWithAlpha(palette[0], (0.28 + state.bass * 0.42) * (1.0 - dim))
        ctx.lineWidth = 1.2 + state.bass * 1.4
        ctx.beginPath()
        var rows = Math.max(5, Math.floor(11 * density))
        for (var r = 1; r <= rows; r++) {
            var depth = ((r / rows) + (state.t * 0.45 * speed) % (1.0 / rows))
            if (depth > 1.0) depth -= 1.0
            var gy = horizonY + Math.pow(depth, 1.85) * (h - horizonY)
            ctx.moveTo(0, gy)
            ctx.lineTo(w, gy)
        }
        var cols = Math.max(8, Math.floor(16 * density))
        for (var c = -cols; c <= cols; c++) {
            var topX = vanishX + c * (w * 0.015)
            var botX = cx + c * (w * 0.14)
            ctx.moveTo(topX, horizonY)
            ctx.lineTo(botX, h)
        }
        ctx.stroke()

        var maxEqH = h * 0.42

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
            // Style 3: 3D Waterfall Spectrum Ridges marching down the SynthGrid towards the user!
            var hist = state.waveHistory || []
            var ridgeCount = Math.min(10, hist.length)
            for (var rg = ridgeCount - 1; rg >= 0; rg--) {
                var snap = hist[rg]
                var rFrac = rg / Math.max(1, ridgeCount - 1)
                var ridgeBaseY = lerp(horizonY, h * 0.92, Math.pow(1.0 - rFrac, 1.35))
                var ridgeW = lerp(w * 0.42, w * 0.98, 1.0 - rFrac)
                var leftX = vanishX * rFrac + (w - ridgeW) * 0.5 * (1.0 - rFrac)
                ctx.strokeStyle = colourWithAlpha(palette[(rg * 2) % palette.length], (0.85 - rFrac * 0.58) * (1.0 - dim))
                ctx.lineWidth = 2.4 - rFrac * 1.2
                ctx.beginPath()
                for (var sb3 = 0; sb3 < 32; sb3++) {
                    var bMapped = Math.floor(mapEqBandIndex(sb3, 32, eqLayout) / 2)
                    var bv3 = (snap.bands[bMapped] || 0.05) * eqGain * (1.15 - rFrac * 0.45)
                    var rx = leftX + (sb3 / 31.0) * ridgeW
                    var ry = ridgeBaseY - bv3 * maxEqH * 0.65
                    if (sb3 === 0) ctx.moveTo(rx, ry)
                    else ctx.lineTo(rx, ry)
                }
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

    // Beat-triggered shockwave polygons (batched)
    if (state.shockwaves.length > 0) {
        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        for (var sw = 0; sw < state.shockwaves.length; sw++) {
            var wave = state.shockwaves[sw]
            var wr = wave.r * minDim * 0.68
            ctx.strokeStyle = hslToHex(wave.hueOffset, 0.95, 0.62, wave.alpha * 0.55 * (1.0 - dim))
            ctx.lineWidth = 1.8 + state.bass * 2.5
            ctx.beginPath()
            var sides = wave.sides || 6
            for (var v = 0; v <= sides; v++) {
                var ang = (v / sides) * Math.PI * 2 + state.phase * 0.5
                var vx = cx + endPt.dx * 0.3 * (1.0 - wave.r) + Math.cos(ang) * wr
                var vy = cy + endPt.dy * 0.3 * (1.0 - wave.r) + Math.sin(ang) * wr
                if (v === 0) ctx.moveTo(vx, vy)
                else ctx.lineTo(vx, vy)
            }
            ctx.stroke()
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

// Mode 0: MilkDrop Geiss Cathedral (Dual Harmonic Custom Waves + 6-Fold Kaleidoscope)
function drawMode0MilkDrop(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var facets = 6
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var pts = Math.max(10, Math.floor(24 * clamp(comp, 0.4, 1.5)))

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    for (var ring = 0; ring < 3; ring++) {
        ctx.strokeStyle = colourWithAlpha(palette[(ring * 2) % palette.length], 0.58 + state.bass * 0.35)
        ctx.lineWidth = (ring === 0 ? 2.2 : 1.5) + state.beatPulse * 1.4
        ctx.beginPath()

        for (var f = 0; f < facets; f++) {
            var baseAng = (f * Math.PI * 2) / facets + state.phase * (ring % 2 === 0 ? 0.45 : -0.35)
            var flip = (f % 2 === 0) ? 1.0 : -1.0
            for (var i = 0; i <= pts; i++) {
                var u = i / pts
                var bIdx = (i * 2 + ring * 11) & 63
                var bv = state.smoothBands[bIdx]
                var r = minDim * (0.08 + u * 0.38 + bv * 0.18 + state.bass * 0.06)
                var theta = baseAng + flip * (u * (Math.PI * 2 / facets) + Math.sin(u * 6.0 + state.t * 2.2 + ring) * (0.22 + state.mid * 0.38))
                var px = Math.cos(theta) * r
                var py = Math.sin(theta) * r
                if (i === 0) ctx.moveTo(px, py)
                else ctx.lineTo(px, py)
            }
        }
        ctx.stroke()
    }
    ctx.restore()
}

// Mode 1: Winamp AVS 3D SuperScope (3D Parametric Lissajous / Torus Ribbon with onBeat Snapping)
function drawMode1AvsSuperScope(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var scale = Math.min(w, h) * 0.44 * (cfg.layer2Zoom || 1.0)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var N = Math.max(32, Math.floor(88 * clamp(comp, 0.4, 1.5)))
    var harm = state.avsHarmonics || { m: 3, n: 5, k: 2, twist: 1.4, style: 0 }

    var rotX = state.t * 0.65 + state.bass * 0.8
    var rotY = state.t * 0.85 - state.mid * 0.7
    var cosX = Math.cos(rotX), sinX = Math.sin(rotX)
    var cosY = Math.cos(rotY), sinY = Math.sin(rotY)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    for (var strand = 0; strand < 3; strand++) {
        ctx.strokeStyle = colourWithAlpha(palette[(strand * 3) % palette.length], 0.68 + state.bass * 0.28)
        ctx.lineWidth = 1.9 + (strand === 0 ? state.bass * 2.0 : 0.4)
        ctx.beginPath()

        var sPhase = strand * (Math.PI * 2 / 3.0)
        for (var i = 0; i <= N; i++) {
            var u = (i / N) * Math.PI * 2
            var bIdx = i & 63
            var v = state.smoothBands[bIdx]
            var R = 0.58 + (0.24 + v * 0.38) * Math.cos(harm.n * u + state.t * 1.8 + sPhase)
            var x3 = R * Math.cos(harm.m * u + sPhase)
            var y3 = R * Math.sin(harm.m * u + sPhase)
            var z3 = (0.35 + v * 0.45 + state.bass * 0.25) * Math.sin(harm.k * u + state.t * harm.twist)

            // 3D rotation
            var x1 = x3 * cosY - z3 * sinY
            var z1 = x3 * sinY + z3 * cosY
            var y2 = y3 * cosX - z1 * sinX
            var z2 = y3 * sinX + z1 * cosX

            var persp = 1.65 / (2.25 - clamp(z2, -1.2, 1.2))
            var sx = x1 * scale * persp
            var sy = y2 * scale * persp
            if (i === 0) ctx.moveTo(sx, sy)
            else ctx.lineTo(sx, sy)
        }
        ctx.stroke()
    }
    ctx.restore()
}

// Mode 2: SoundSpectrum G-Force WaveShape & Logarithmic Vortex
function drawMode2GForceWaveShape(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.45 * (cfg.layer2Zoom || 1.0)
    var petals = 6
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var steps = Math.max(28, Math.floor(76 * clamp(comp, 0.4, 1.5)))

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    for (var layer = 0; layer < 4; layer++) {
        ctx.strokeStyle = colourWithAlpha(palette[(layer * 2 + 1) % palette.length], 0.55 + state.energy * 0.35)
        ctx.lineWidth = 1.7 + (3 - layer) * 0.4 + state.bass * 1.4
        ctx.beginPath()

        var dir = (layer % 2 === 0) ? 1.0 : -1.0
        for (var i = 0; i <= steps; i++) {
            var a = (i / steps) * Math.PI * 2
            var bIdx = (i + layer * 13) & 63
            var bv = state.smoothBands[bIdx]
            var wave = Math.sin(a * petals + state.t * 2.4 * dir) * (0.22 + state.mid * 0.28)
                     + Math.cos(a * (petals * 2 - 1) - state.t * 1.7) * (0.14 + bv * 0.34)
            var r = maxR * (0.24 + layer * 0.14 + wave + state.bass * 0.14)
            var spiralA = a + r / maxR * (0.65 + state.high * 0.85) * dir + state.phase * 0.5
            var px = Math.cos(spiralA) * r
            var py = Math.sin(spiralA) * r
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.stroke()
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
    ctx.globalCompositeOperation = "lighter"

    // 1. Volumetric Flame & Plasma Shroud Waves receding in 3D tunnel depth (using waveHistory ring buffer)
    for (var s = numSlices - 1; s >= 0; s--) {
        var depthFrac = s / Math.max(1, numSlices - 1) // 0 = front, 1 = deep core
        var persp = 1.0 - depthFrac * 0.72
        var baseR = maxR * persp * (0.88 + state.bass * 0.24)
        var hIdx = histLen > 0 ? ((state.waveHistoryHead - 1 - s * 2 + histLen * 4) % histLen) : 0
        var waveSlice = (histLen > 0 && hist[hIdx]) ? hist[hIdx] : state.smoothBands
        var rot = state.phase * (s % 2 === 0 ? 0.65 : -0.55) + s * 0.28
        var colFill = palette[(s * 2 + state.beatCount) % palette.length]
        var colStroke = palette[(s * 2 + 3 + state.beatCount) % palette.length]

        ctx.fillStyle = colourWithAlpha(colFill, (0.09 + (1.0 - depthFrac) * 0.14 + state.bass * 0.08) * (isEcho ? 0.55 : 1.0))
        ctx.strokeStyle = colourWithAlpha(colStroke, 0.42 + (1.0 - depthFrac) * 0.52)
        ctx.lineWidth = (1.2 + (1.0 - depthFrac) * 2.2 + state.bass * 1.4) * (isEcho ? 0.75 : 1.0)

        ctx.beginPath()
        for (var i = 0; i <= ringSteps; i++) {
            var u = i / ringSteps
            var a = u * Math.PI * 2 + rot
            var bIdx = (i * 2 + s * 5) & 63
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
        ctx.fillStyle = colourWithAlpha(palette[1 % palette.length], 0.18 + state.bass * 0.16)
        ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], 0.88)
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

// Mode 4: Jeff Minter VLM (Virtual Light Machine / Tempest 2000) Rapid-Zoom Textured Neon Web
function drawMode4MinterVlm(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    // Rapid in-and-out Llamasoft zoom surge driven by bass, beatPulse, and multi-frequency oscillation
    var zoomSurge = 1.0
        + Math.sin(state.t * 4.4 + state.bass * 2.8) * (0.38 + state.bass * 0.34)
        + Math.cos(state.t * 2.1 - state.mid * 2.0) * 0.18
        + state.beatPulse * 0.42
    var maxR = Math.min(w, h) * 0.48 * (cfg.layer2Zoom || 1.0) * clamp(zoomSurge, 0.48, 1.95)
    var facets = 10
    var lod = state.echoLod || 1.0
    var depthRings = Math.max(4, Math.min(9, Math.floor(7 * (cfg.layer2Complexity || 1.0) * lod)))
    var isEcho = Boolean(state.isTracerEcho)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    // Precompute 3D Tempest web ring vertices so we can render both checkered quad textures AND thick neon vector struts
    var ringPts = []
    var ringZ = []
    var scrollSpeed = 0.68 + state.bass * 0.55
    for (var d = 0; d <= depthRings; d++) {
        var zProg = clamp((d + ((state.t * scrollSpeed) % 1.0)) / depthRings, 0.04, 1.15)
        ringZ.push(zProg)
        var r = Math.pow(zProg, 1.48) * maxR
        var twist = (1.0 - zProg) * Math.sin(state.t * 1.85) * (0.75 + state.mid * 0.95) + state.phase * 0.45
        var pts = []
        for (var s = 0; s <= facets; s++) {
            var bIdx = ((s % facets) * 6 + d * 5) & 63
            var spike = 1.0 + state.smoothBands[bIdx] * 0.42 * (((s + d) & 1) === 0 ? 1.0 : -0.55)
            var a = (s / facets) * Math.PI * 2 + twist
            pts.push({
                x: Math.cos(a) * r * spike,
                y: Math.sin(a) * r * spike,
                band: state.smoothBands[bIdx]
            })
        }
        ringPts.push(pts)
    }

    // 1. Textured / Checkered Llamasoft Web Lane Panels (batched into 2 palette buckets for speed)
    if (!isEcho || (state.echoIndex || 0) < 3) {
        for (var pBucket = 0; pBucket < 2; pBucket++) {
            var panelCol = palette[(pBucket * 4 + state.beatCount * 2) % palette.length]
            ctx.fillStyle = colourWithAlpha(panelCol, isEcho ? 0.12 : (0.18 + state.bass * 0.16))
            ctx.beginPath()
            for (var d0 = 0; d0 < depthRings; d0++) {
                var p0 = ringPts[d0]
                var p1 = ringPts[d0 + 1]
                for (var s0 = 0; s0 < facets; s0++) {
                    if (((d0 + s0) & 1) !== pBucket) continue
                    // Sub-panel inner bevel for textured synth-arcade look
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

    // 2. Thick High-Luminance Radial Lane Beams + Tempest Chevron Spikes
    ctx.strokeStyle = colourWithAlpha(palette[(1 + state.beatCount) % palette.length], 0.78 + state.high * 0.22)
    ctx.lineWidth = (isEcho ? 2.0 : 3.2) + state.bass * 2.4
    ctx.beginPath()
    for (var sLane = 0; sLane < facets; sLane++) {
        ctx.moveTo(ringPts[0][sLane].x, ringPts[0][sLane].y)
        for (var dLane = 1; dLane <= depthRings; dLane++) {
            ctx.lineTo(ringPts[dLane][sLane].x, ringPts[dLane][sLane].y)
        }
    }
    ctx.stroke()

    // 3. Thick Neon Concentric Web Rim Polygons surging in & out
    for (var dr = 0; dr <= depthRings; dr++) {
        var zp = ringZ[dr]
        var ptsR = ringPts[dr]
        ctx.strokeStyle = colourWithAlpha(palette[(dr * 2 + state.beatCount) % palette.length], 0.35 + zp * 0.65)
        // Thick arcade vector lines (up to 6.5px on foreground web rim!)
        ctx.lineWidth = (1.8 + zp * 3.4 + state.beatPulse * 1.8) * (isEcho ? 0.72 : 1.0)
        ctx.beginPath()
        for (var sr = 0; sr <= facets; sr++) {
            if (sr === 0) ctx.moveTo(ptsR[sr].x, ptsR[sr].y)
            else ctx.lineTo(ptsR[sr].x, ptsR[sr].y)
        }
        ctx.stroke()
    }

    ctx.restore()
}

// Mode 5: 3D Psychedelic Fractal Landscape & Infinite Julia Horizon Canyon
function drawMode5JuliaFractals(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0

    // Horizon sits above centre with audio-reactive camera pitch & roll
    var camRoll = Math.sin(state.t * 0.52) * 0.08 * (1.0 + state.mid * 0.6)
    var horizonY = h * (0.34 + Math.sin(state.t * 0.38) * 0.04)

    // Live audio-modulated Julia set constant c = cRe + i*cIm
    var cRe = -0.74 + Math.cos(state.t * 0.44) * (0.16 + state.bass * 0.14)
    var cIm = 0.26 + Math.sin(state.t * 0.58) * (0.16 + state.mid * 0.14)

    ctx.save()
    ctx.translate(cx, horizonY)
    ctx.rotate(camRoll)
    ctx.globalCompositeOperation = "lighter"

    // 1. Infinite Zooming 3D Julia Mandelbrot Horizon Portal in the sky above the canyon
    var portalRings = isEcho ? 2 : 4
    var portalSteps = isEcho ? 24 : 40
    var minDim = Math.min(w, h) * zoom
    for (var pr = portalRings - 1; pr >= 0; pr--) {
        var pZoom = ((pr + (state.t * 0.85) % 1.0) / portalRings)
        var pScale = minDim * (0.08 + pZoom * 0.28) * (1.0 + state.bass * 0.22)
        var pCol = palette[(pr * 3 + state.beatCount) % palette.length]
        ctx.fillStyle = colourWithAlpha(pCol, (0.08 + (1.0 - pZoom) * 0.12) * (isEcho ? 0.5 : 1.0))
        ctx.strokeStyle = colourWithAlpha(palette[(pr * 3 + 1) % palette.length], 0.45 + (1.0 - pZoom) * 0.45)
        ctx.lineWidth = 1.4 + (1.0 - pZoom) * 1.8 + state.beatPulse * 1.2
        ctx.beginPath()
        for (var ps = 0; ps <= portalSteps; ps++) {
            var pa = (ps / portalSteps) * Math.PI * 2 + state.phase * (pr % 2 === 0 ? 0.5 : -0.5)
            var zr = Math.cos(pa) * (0.78 + pZoom * 0.25)
            var zi = Math.sin(pa) * (0.78 + pZoom * 0.25)
            for (var it = 0; it < 3; it++) {
                var tr = zr * zr - zi * zi + cRe
                zi = 2.0 * zr * zi + cIm
                zr = tr
            }
            var mag = Math.sqrt(zr * zr + zi * zi)
            var orbR = pScale * (0.62 + 0.32 * Math.atan(mag) + state.smoothBands[(ps + pr * 9) & 63] * 0.25)
            var px = Math.cos(pa) * orbR * 1.35
            var py = -minDim * 0.09 + Math.sin(pa) * orbR * 0.72
            if (ps === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    // 2. Continuous 3D Fractal Canyon & Mountain Landscape flying past the viewer
    var zSlices = isEcho ? 5 : Math.max(8, Math.min(14, Math.round(11 * (cfg.layer2Complexity || 1.0) * lod)))
    var xCols = isEcho ? 12 : 20
    var flySpeed = 2.6 + state.bass * 1.8
    var scrollZ = state.t * flySpeed
    var spanW = w * 0.68 * zoom
    var floorH = h * 0.68 * zoom

    var prevSlicePts = null
    // Render back-to-front (far horizon z = zSlices down to near foreground z = 1)
    for (var z = zSlices; z >= 1; z--) {
        var zDist = z - (scrollZ % 1.0)
        var persp = 1.0 / (0.38 + zDist * 0.28) // 3D perspective projection factor
        var depthNorm = clamp(1.0 - (zDist / (zSlices + 0.5)), 0.05, 1.0)
        var worldZ = Math.floor(scrollZ) + z
        var baseY = floorH * persp * 0.52

        var curPts = []
        for (var c = 0; c <= xCols; c++) {
            var u = (c / xCols) * 2.0 - 1.0 // -1 (left wall) .. 0 (riverbed) .. +1 (right wall)
            // Evaluate 3-iteration Julia fractal potential at world coordinates (u, worldZ)
            var jx = u * 1.15 + Math.sin(worldZ * 0.32) * 0.22
            var jy = Math.cos(worldZ * 0.27 + u * 1.4) * 0.65
            for (var jit = 0; jit < 3; jit++) {
                var jtr = jx * jx - jy * jy + cRe
                jy = 2.0 * jx * jy + cIm
                jx = jtr
            }
            var juliaPot = Math.atan(Math.sqrt(jx * jx + jy * jy)) / 1.5708 // [0..1]
            var bIdx = (c * 3 + (worldZ & 15) * 4) & 63
            var audioLift = state.smoothBands[bIdx] * (0.45 + state.bass * 0.55)

            // Canyon profile: deep bioluminescent riverbed in the centre, towering fractal mountain ridges on both flanks
            var canyonWall = Math.pow(Math.abs(u), 1.25) * 1.35 + 0.12
            var ridgeHeight = (juliaPot * 0.68 + audioLift * 0.62) * canyonWall * minDim * 0.42 * persp
            var sx = (u + Math.sin(worldZ * 0.22 + state.t * 0.4) * 0.08 * (1.0 - depthNorm)) * spanW * persp
            var sy = baseY - ridgeHeight
            curPts.push({ x: sx, y: sy, u: u, pot: juliaPot, band: audioLift })
        }

        var sliceCol = palette[((worldZ % palette.length) + palette.length) % palette.length]
        var ridgeCol = palette[((worldZ + 2) % palette.length + palette.length) % palette.length]

        // Filled translucent 3D terrain curtain + longitudinal canyon ribs connecting to previous depth slice
        if (prevSlicePts && (!isEcho || z <= 3)) {
            ctx.fillStyle = colourWithAlpha(sliceCol, (0.07 + depthNorm * 0.15) * (isEcho ? 0.5 : 1.0))
            ctx.beginPath()
            for (var k = 0; k <= xCols; k++) {
                if (k === 0) ctx.moveTo(curPts[k].x, curPts[k].y)
                else ctx.lineTo(curPts[k].x, curPts[k].y)
            }
            for (var kBack = xCols; kBack >= 0; kBack--) {
                ctx.lineTo(prevSlicePts[kBack].x, prevSlicePts[kBack].y)
            }
            ctx.closePath()
            ctx.fill()

            // Longitudinal 3D wireframe canyon struts
            ctx.strokeStyle = colourWithAlpha(sliceCol, 0.25 + depthNorm * 0.45)
            ctx.lineWidth = 0.9 + depthNorm * 1.4
            ctx.beginPath()
            for (var kRib = 0; kRib <= xCols; kRib += 2) {
                ctx.moveTo(prevSlicePts[kRib].x, prevSlicePts[kRib].y)
                ctx.lineTo(curPts[kRib].x, curPts[kRib].y)
            }
            ctx.stroke()
        }

        // Crisp neon fractal ridge crest across the slice
        ctx.strokeStyle = colourWithAlpha(ridgeCol, 0.38 + depthNorm * 0.60)
        ctx.lineWidth = (1.2 + depthNorm * 2.4 + state.bass * 1.2) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var k2 = 0; k2 <= xCols; k2++) {
            if (k2 === 0) ctx.moveTo(curPts[k2].x, curPts[k2].y)
            else ctx.lineTo(curPts[k2].x, curPts[k2].y)
        }
        ctx.stroke()

        // 3D Fractal Crystal Flora sprouting along foreground canyon peaks
        if (!isEcho && z <= 5 && (worldZ % 2 === 0)) {
            ctx.strokeStyle = colourWithAlpha(palette[(worldZ + 4) % palette.length], 0.55 + depthNorm * 0.42)
            ctx.lineWidth = 1.2 + depthNorm * 1.4
            ctx.beginPath()
            for (var tc = 2; tc <= xCols - 2; tc += (xCols - 4)) {
                var root = curPts[tc]
                var stemH = minDim * 0.14 * persp * (0.75 + root.band * 0.65)
                var sway = Math.sin(state.t * 2.2 + worldZ + tc) * 0.32
                var tipX = root.x + Math.sin(sway) * stemH * 0.45
                var tipY = root.y - stemH
                ctx.moveTo(root.x, root.y)
                ctx.lineTo(tipX, tipY)
                // Twin recursive fractal canopy forks
                var forkLen = stemH * 0.58
                for (var f = -1; f <= 1; f += 2) {
                    var fa = sway + f * (0.52 + state.mid * 0.35)
                    var fx = tipX + Math.sin(fa) * forkLen
                    var fy = tipY - Math.cos(fa) * forkLen
                    ctx.moveTo(tipX, tipY)
                    ctx.lineTo(fx, fy)
                    // Second-order crystal twigs
                    ctx.moveTo(fx, fy)
                    ctx.lineTo(fx + Math.sin(fa + f * 0.45) * forkLen * 0.55, fy - Math.cos(fa + f * 0.45) * forkLen * 0.55)
                    ctx.moveTo(fx, fy)
                    ctx.lineTo(fx + Math.sin(fa - f * 0.45) * forkLen * 0.55, fy - Math.cos(fa - f * 0.45) * forkLen * 0.55)
                }
            }
            ctx.stroke()
        }

        prevSlicePts = curPts
    }

    ctx.restore()
}

// Mode 6: DMT Chrysanthemum & Sacred Lotus Hyperspace Dome
function drawMode6DmtChrysanthemum(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.45 * (cfg.layer2Zoom || 1.0)
    var symmetry = 8
    var lod = state.echoLod || 1.0
    var rings = Math.max(3, Math.min(7, Math.round(5 * (cfg.layer2Complexity || 1.0) * lod)))
    var steps = state.isTracerEcho ? 28 : 44

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    for (var r = rings; r >= 1; r--) {
        var frac = r / rings
        var baseR = maxR * frac * (0.85 + state.bass * 0.25)
        var rot = state.phase * ((r % 2 === 0) ? 1.0 : -1.0) * (1.2 - frac * 0.5)
        ctx.strokeStyle = colourWithAlpha(palette[(r * 2) % palette.length], 0.48 + (1.0 - frac) * 0.42)
        ctx.lineWidth = 1.5 + (1.0 - frac) * 1.5 + state.beatPulse * 1.2
        ctx.beginPath()

        for (var i = 0; i <= steps; i++) {
            var a = (i / steps) * Math.PI * 2
            var bVal = state.smoothBands[(i + r * 7) & 63]
            var petal = Math.sin(a * symmetry + rot) * maxR * (0.06 + bVal * 0.14 + state.mid * 0.06)
            var rad = Math.max(6, baseR + petal)
            var px = Math.cos(a) * rad
            var py = Math.sin(a) * rad
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.stroke()
    }
    ctx.restore()
}

// Mode 7: Spacetime Gravity Well & Relativistic Quasar Jets
function drawMode7SpacetimeQuasar(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var lod = state.echoLod || 1.0
    var gridN = Math.max(5, Math.min(13, Math.round(9 * (cfg.layer2Complexity || 1.0) * lod)))

    var w1x = cx + Math.cos(state.t * 0.9) * minDim * 0.22
    var w1y = cy + Math.sin(state.t * 1.2) * minDim * 0.16
    var w2x = cx + Math.cos(-state.t * 0.8 + 2.2) * minDim * 0.24
    var w2y = cy + Math.sin(-state.t * 1.0 + 2.2) * minDim * 0.18
    var m0 = minDim * (0.14 + state.bass * 0.34 + state.beatPulse * 0.18)
    var m1 = minDim * (0.09 + state.mid * 0.22)

    function warpPt(px, py) {
        var dx0 = px - cx, dy0 = py - cy
        var d0 = Math.sqrt(dx0 * dx0 + dy0 * dy0) + 28.0
        var f0 = (m0 * 32.0) / (d0 + 35.0)
        var ang0 = Math.atan2(dy0, dx0) + (state.bass * 0.65) * (60.0 / (d0 + 40.0))

        var dx1 = px - w1x, dy1 = py - w1y
        var d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) + 24.0
        var f1 = (m1 * 22.0) / (d1 + 30.0)

        var dx2 = px - w2x, dy2 = py - w2y
        var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) + 24.0
        var f2 = (m1 * 22.0) / (d2 + 30.0)

        return {
            x: px - Math.cos(ang0) * f0 - (dx1 / d1) * f1 - (dx2 / d2) * f2,
            y: py - Math.sin(ang0) * f0 - (dy1 / d1) * f1 - (dy2 / d2) * f2
        }
    }

    ctx.save()
    ctx.globalCompositeOperation = "lighter"

    // Horizontal warped grid lines batched in one path
    ctx.strokeStyle = colourWithAlpha(palette[0], 0.42 + state.bass * 0.35)
    ctx.lineWidth = 1.4
    ctx.beginPath()
    for (var r = 0; r <= gridN; r++) {
        var gy = (r / gridN) * h
        for (var c = 0; c <= gridN; c++) {
            var gx = (c / gridN) * w
            var wp = warpPt(gx, gy)
            if (c === 0) ctx.moveTo(wp.x, wp.y)
            else ctx.lineTo(wp.x, wp.y)
        }
    }
    ctx.stroke()

    // Vertical warped grid lines batched in one path
    ctx.strokeStyle = colourWithAlpha(palette[2 % palette.length], 0.38 + state.mid * 0.35)
    ctx.beginPath()
    for (var col = 0; col <= gridN; col++) {
        var vx = (col / gridN) * w
        for (var row = 0; row <= gridN; row++) {
            var vy = (row / gridN) * h
            var wp2 = warpPt(vx, vy)
            if (row === 0) ctx.moveTo(wp2.x, wp2.y)
            else ctx.lineTo(wp2.x, wp2.y)
        }
    }
    ctx.stroke()

    // Quasar relativistic accretion rings
    ctx.strokeStyle = colourWithAlpha(palette[1 % palette.length], 0.72 + state.beatPulse * 0.25)
    ctx.lineWidth = 2.2 + state.bass * 2.0
    ctx.beginPath()
    for (var a = 0; a <= 36; a++) {
        var ang = (a / 36.0) * Math.PI * 2 + state.phase
        var ar = minDim * (0.09 + state.smoothBands[a & 63] * 0.18 + state.bass * 0.08)
        var qx = cx + Math.cos(ang) * ar
        var qy = cy + Math.sin(ang) * ar * 0.55
        if (a === 0) ctx.moveTo(qx, qy)
        else ctx.lineTo(qx, qy)
    }
    ctx.closePath()
    ctx.stroke()
    ctx.restore()
}

// Mode 8: Alien Bioluminescent Mycelium & Jellyfish Tendrils (Batched)
function drawMode8AlienMycelium(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var tendrils = 12
    var lod = state.echoLod || 1.0
    var segs = Math.max(6, Math.min(18, Math.round(12 * (cfg.layer2Complexity || 1.0) * lod)))

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    for (var bucket = 0; bucket < 3; bucket++) {
        ctx.strokeStyle = colourWithAlpha(palette[(bucket * 3) % palette.length], 0.55 + state.mid * 0.35)
        ctx.fillStyle = colourWithAlpha(palette[(bucket * 3 + 1) % palette.length], 0.70)
        ctx.lineWidth = 1.9 + state.bass * 1.6
        ctx.beginPath()

        var nodeSpores = []
        for (var td = bucket; td < tendrils; td += 3) {
            var baseAng = (td / tendrils) * Math.PI * 2 + state.phase * 0.3
            var px = 0.0, py = 0.0
            ctx.moveTo(0, 0)
            var stepLen = (minDim * (0.34 + state.bass * 0.16)) / segs
            for (var s = 1; s <= segs; s++) {
                var frac = s / segs
                var bVal = state.smoothBands[(td * 3 + s) & 63]
                var wave = Math.sin(state.t * 2.8 - s * 0.42 + td) * (0.45 + state.mid * 0.65 + bVal * 0.55)
                var curAng = baseAng + wave * frac
                px += Math.cos(curAng) * stepLen
                py += Math.sin(curAng) * stepLen
                ctx.lineTo(px, py)
                if (!state.isTracerEcho && (s % 5 === 0 || s === segs)) {
                    nodeSpores.push(px, py, 2.2 + bVal * 4.2)
                }
            }
        }
        ctx.stroke()

        if (nodeSpores.length > 0) {
            ctx.beginPath()
            for (var sp = 0; sp < nodeSpores.length; sp += 3) {
                var sx = nodeSpores[sp], sy = nodeSpores[sp + 1], sr = nodeSpores[sp + 2]
                ctx.rect(sx - sr, sy - sr, sr * 2.0, sr * 2.0)
            }
            ctx.fill()
        }
    }
    ctx.restore()
}

// Mode 9: Cyber-Shamanic Matrix Vortex Tunnel (Batched vector rings)
function drawMode9CyberMatrix(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.48 * (cfg.layer2Zoom || 1.0)
    var lod = state.echoLod || 1.0
    var rings = Math.max(4, Math.min(11, Math.round(8 * (cfg.layer2Complexity || 1.0) * lod)))
    var sectors = 12

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    for (var bucket = 0; bucket < 3; bucket++) {
        ctx.strokeStyle = colourWithAlpha(palette[(bucket * 2) % palette.length], 0.55 + state.high * 0.35)
        ctx.lineWidth = 1.6 + state.bass * 1.4
        ctx.beginPath()
        for (var r = bucket; r < rings; r += 3) {
            var z = ((r / rings) + (state.t * 0.38) % (1.0 / rings)) % 1.0
            var rad = Math.pow(z, 1.4) * maxR * (1.0 + state.bass * 0.18)
            var rot = state.phase * (r % 2 === 0 ? 0.6 : -0.6)
            for (var s = 0; s < sectors; s++) {
                var bVal = state.smoothBands[(r * 5 + s * 2) & 63]
                if (bVal < 0.08 && (s % 2 !== 0)) continue
                var a0 = (s / sectors) * Math.PI * 2 + rot
                var a1 = a0 + (Math.PI / sectors) * (0.5 + bVal * 0.9)
                ctx.moveTo(Math.cos(a0) * rad, Math.sin(a0) * rad)
                ctx.lineTo(Math.cos(a1) * (rad + bVal * 16.0), Math.sin(a1) * (rad + bVal * 16.0))
            }
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
    ctx.globalCompositeOperation = "lighter"

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

// Mode 11: Quantum Strange Attractor (Clifford / De Jong Audio-Morphed Chaos Ribbons)
function drawMode11StrangeAttractor(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var scale = Math.min(w, h) * 0.24 * (cfg.layer2Zoom || 1.0) * (1.0 + state.bass * 0.22)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var steps = Math.max(36, Math.floor(110 * clamp(comp, 0.4, 1.5)))

    var a = -1.4 + Math.sin(state.t * 0.35) * (0.45 + state.bass * 0.35)
    var b = 1.6 + Math.cos(state.t * 0.28) * (0.45 + state.mid * 0.35)
    var c = 1.0 + Math.sin(state.t * 0.42) * (0.55 + state.high * 0.35)
    var d = 0.7 + Math.cos(state.t * 0.31) * (0.55 + state.energy * 0.35)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(state.phase * 0.25)
    ctx.globalCompositeOperation = "lighter"

    for (var ribbon = 0; ribbon < 3; ribbon++) {
        ctx.strokeStyle = colourWithAlpha(palette[(ribbon * 3) % palette.length], 0.58 + state.energy * 0.35)
        ctx.lineWidth = 1.6 + state.bass * 1.6
        ctx.beginPath()
        var x = (ribbon - 1) * 0.35
        var y = (ribbon - 1) * 0.25
        for (var i = 0; i < steps; i++) {
            var bVal = state.smoothBands[(i + ribbon * 19) & 63]
            var nx = Math.sin((a + bVal * 0.22) * y) + c * Math.cos((a + bVal * 0.22) * x)
            var ny = Math.sin((b - bVal * 0.22) * x) + d * Math.cos((b - bVal * 0.22) * y)
            x = nx
            y = ny
            var sx = x * scale
            var sy = y * scale
            if (i === 0) ctx.moveTo(sx, sy)
            else ctx.lineTo(sx, sy)
        }
        ctx.stroke()
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

    // Render from oldest historical echo slice (e = tracerCount - 1) to leading front edge (e = 0)
    for (var e = tracerCount - 1; e >= 0; e--) {
        var u = e / Math.max(1, tracerCount - 1)
        var curveU = Math.pow(u, 1.10)

        state.t = baseT - e * lagStep
        state.phase = basePhase - e * lagStep * 1.35
        state.echoIndex = e
        state.echoCount = tracerCount
        state.echoAge = u
        state.isTracerEcho = (e > 0)
        state.echoLod = (e === 0) ? 1.0 : (tracerCount > 8 ? 0.48 : 0.65)

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

        var alphaE = (e === 0) ? 0.98 : (Math.pow(1.0 - u * 0.86, 1.42) * 0.68)
        var twistAngle = Math.sin(baseT * 0.36 * tracerSpeed) * 0.14 * curveU

        ctx.save()
        ctx.globalAlpha = clamp(alphaE, 0.04, 1.0)
        ctx.translate(cx + tx, cy + ty)
        ctx.scale(zScale, zScale)
        ctx.rotate(twistAngle)
        ctx.translate(-cx, -cy)
        drawSingleLayer2Mode(ctx, w, h, state, echoPalette, cfg, m)
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
        var cellStride = isEcho ? (numBuckets * 2) : numBuckets

        ctx.save()
        ctx.globalCompositeOperation = "lighter"
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
                            if (isEcho && drawnDots >= 2) break
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
        tracerCount: c.tracerCount !== undefined ? clamp(Math.round(Number(c.tracerCount)), 1, 16) : 9,
        tracerSpeed: c.tracerSpeed !== undefined ? clamp(Number(c.tracerSpeed), 0.15, 3.0) : 1.15,
        tracerDrift: c.tracerDrift !== undefined ? clamp(Number(c.tracerDrift), 0.0, 2.5) : 1.0,
        tracerDirection: c.tracerDirection !== undefined ? Number(c.tracerDirection) : 1,
        layer1Enabled: c.layer1Enabled !== undefined ? Boolean(c.layer1Enabled) : true,
        layer1Mode: Number(c.layer1Mode) || 0,
        layer1Trail: Number(c.layer1Trail !== undefined ? c.layer1Trail : (c.layer1Persistence !== undefined ? c.layer1Persistence : 0.85)),
        layer1Speed: Number(c.layer1Speed !== undefined ? c.layer1Speed : 1.0),
        layer1Density: Number(c.layer1Density !== undefined ? c.layer1Density : 1.0),
        layer1Dim: Number(c.layer1Dim !== undefined ? c.layer1Dim : 0.15),
        layer1EqStyle: c.layer1EqStyle !== undefined ? clamp(Math.round(Number(c.layer1EqStyle)), 0, 5) : 0,
        layer1EqLayout: c.layer1EqLayout !== undefined ? clamp(Math.round(Number(c.layer1EqLayout)), 0, 2) : 0,
        layer1EqGain: c.layer1EqGain !== undefined ? clamp(Number(c.layer1EqGain), 0.4, 2.5) : 1.25,
        layer1EqDamping: c.layer1EqDamping !== undefined ? clamp(Math.round(Number(c.layer1EqDamping)), 0, 2) : 0,
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
