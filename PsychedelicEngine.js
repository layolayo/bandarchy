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
    return s
}

function buildPalette(theme, hueShift, paletteIndex) {
    var palIdx = ((Number(paletteIndex) || 0) % PALETTES.length + PALETTES.length) % PALETTES.length
    var preset = PALETTES[palIdx] || PALETTES[0]
    var base = [
        preset[0],
        preset[1],
        preset[2],
        preset[3],
        preset[4],
        preset[5],
        (theme && theme.accent) ? theme.accent.toString() : "#6ee7b7",
        (theme && theme.urgent) ? theme.urgent.toString() : "#f472b6",
        hslToHex(hueShift, 0.92, 0.62),
        hslToHex(hueShift + 90, 0.95, 0.60),
        hslToHex(hueShift + 180, 0.92, 0.62),
        hslToHex(hueShift + 270, 0.94, 0.64)
    ]
    return base
}

function createState() {
    var smooth = []
    var peaks = []
    for (var i = 0; i < 64; i++) {
        smooth.push(0.04)
        peaks.push(0.06)
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

    // Sample non-blank cells up to ~680 autonomous particles for locked 60+ FPS
    var candidates = []
    for (var y = 0; y < rows; y++) {
        var line = asciiLines[y] || ""
        for (var x = 0; x < line.length; x++) {
            var ch = line.charAt(x)
            if (ch === " " || ch === "⠀") continue
            var code = ch.charCodeAt(0)
            var density = 0.65
            if (code >= 0x2800 && code <= 0x28FF) {
                var bits = code - 0x2800
                var pop = 0
                for (var b = 0; b < 8; b++) {
                    if ((bits >> b) & 1) pop++
                }
                if (pop <= 1) continue
                density = pop / 8.0
            }
            var nx = (x / Math.max(1, cols - 1)) * 2.0 - 1.0
            var ny = (y / Math.max(1, rows - 1)) * 2.0 - 1.0
            candidates.push({
                gx: x,
                gy: y,
                nx: nx,
                ny: ny,
                ch: ch,
                density: density
            })
        }
    }

    var maxParticles = 1400
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
    dt = clamp(Number(dt) || 0.016, 0.004, 0.055)
    var reactivity = clamp(Number(cfg && cfg.layer2Reactivity !== undefined ? cfg.layer2Reactivity : (cfg && cfg.sensitivity !== undefined ? cfg.sensitivity : 1.35)), 0.15, 4.0)
    var l2Speed = clamp(Number(cfg && cfg.layer2Speed !== undefined ? cfg.layer2Speed : 1.0), 0.1, 4.0)
    var chaos = clamp(Number(cfg && cfg.layer2Chaos !== undefined ? cfg.layer2Chaos : 0.4), 0.0, 2.0)

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

    var bassSum = 0.0
    var midSum = 0.0
    var highSum = 0.0

    for (var i = 0; i < 64; i++) {
        var norm = 0.0
        if (useSynthFallback) {
            // Rhythmic harmonic synthesis when PipeWire/cava stream is warming up
            var beatWave = Math.pow(Math.max(0.0, Math.sin(state.t * 4.4)), 6.0)
            var sub = i < 10 ? beatWave * 0.85 : 0.0
            var harm = (0.28 + 0.24 * Math.sin(state.t * 2.7 + i * 0.22) + 0.18 * Math.cos(state.t * 5.3 - i * 0.35))
            norm = clamp((sub + harm) * reactivity * 0.75, 0.03, 1.0)
        } else if (n > 0) {
            var raw = Number(rawBands[i % n]) || 0.0
            // Non-linear gamma boost so quiet passages still produce vivid movement
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

    var bass = clamp(bassSum / 11.0, 0.0, 1.0)
    var mid = clamp(midSum / 24.0, 0.0, 1.0)
    var high = clamp(highSum / 30.0, 0.0, 1.0)

    // MilkDrop relative audio attenuation (`bass_att`, `mid_att`, `treb_att`)
    // Fast envelope vs 3-second slow baseline so both quiet ambient passages and loud drops react vividly
    state.bassFast = 0.65 * (state.bassFast || bass) + 0.35 * bass
    state.bassSlow = 0.985 * (state.bassSlow || bass) + 0.015 * bass
    state.midFast = 0.65 * (state.midFast || mid) + 0.35 * mid
    state.midSlow = 0.985 * (state.midSlow || mid) + 0.015 * mid
    state.trebFast = 0.65 * (state.trebFast || high) + 0.35 * high
    state.trebSlow = 0.985 * (state.trebSlow || high) + 0.015 * high

    state.bassAtt = clamp(state.bassFast / Math.max(0.04, state.bassSlow), 0.2, 3.5)
    state.midAtt = clamp(state.midFast / Math.max(0.04, state.midSlow), 0.2, 3.5)
    state.trebAtt = clamp(state.trebFast / Math.max(0.04, state.trebSlow), 0.2, 3.5)

    state.bass = bass
    state.mid = mid
    state.high = high
    state.bassSmooth = bass
    state.midSmooth = mid
    state.highSmooth = high
    state.energy = clamp(bass * 0.50 + mid * 0.32 + high * 0.18, 0.0, 1.0)

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

    var timeStep = dt * l2Speed * (active ? (0.85 + state.energy * 1.85 + state.beatPulse * 0.65) : 0.25)
    state.t += timeStep
    state.phase += timeStep * 0.75 * state.rotPolarity
    state.hueShift = (state.hueShift + dt * (22.0 + state.energy * 95.0 + state.beatPulse * 80.0)) % 360.0

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
    var dismantle = clamp(Number(cfg.layer3Dismantle !== undefined ? cfg.layer3Dismantle : 1.15), 0.0, 4.0)
    var rebuild = clamp(Number(cfg.layer3Rebuild !== undefined ? cfg.layer3Rebuild : 1.0), 0.05, 4.0)
    var evoRate = clamp(Number(cfg.layer3Evolution !== undefined ? cfg.layer3Evolution : 0.65), 0.0, 3.0)
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

function drawLayer1Background(ctx, canvasItem, w, h, state, theme, palette, cfg) {
    var bgHex = (theme && theme.background) ? theme.background.toString() : "#06080e"
    var enabled = cfg ? Boolean(cfg.layer1Enabled) : true
    var l1Mode = cfg ? ((Number(cfg.layer1Mode) || 0) % LAYER1_MODES.length) : 0
    var trail = cfg && cfg.layer1Trail !== undefined ? clamp(Number(cfg.layer1Trail), 0.10, 0.97) : 0.84
    var dim = cfg && cfg.layer1Dim !== undefined ? clamp(Number(cfg.layer1Dim), 0.0, 0.92) : 0.16
    var density = cfg && cfg.layer1Density !== undefined ? clamp(Number(cfg.layer1Density), 0.2, 3.0) : 1.0
    var speed = cfg && cfg.layer1Speed !== undefined ? clamp(Number(cfg.layer1Speed), 0.1, 4.0) : 1.0

    if (!enabled) {
        ctx.globalCompositeOperation = "source-over"
        ctx.fillStyle = bgHex
        ctx.fillRect(0, 0, w, h)
        return
    }

    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)

    ctx.globalCompositeOperation = "source-over"

    if (l1Mode === 0 && canvasItem) {
        // Mode 0: MilkDrop / Geiss Iterative Framebuffer Feedback Warp
        // Draw the persistent canvas back onto itself with zoom + slight rotation, then fade veil
        var zoom = 1.0 + (0.010 + state.bass * 0.042 + state.beatPulse * 0.028) * speed
        var rot = Math.sin(state.t * 0.55) * (0.008 + state.mid * 0.022) * speed * state.rotPolarity
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rot)
        ctx.scale(zoom, zoom)
        ctx.globalAlpha = clamp(trail, 0.55, 0.95)
        try {
            ctx.drawImage(canvasItem, -cx, -cy, w, h)
        } catch (e) {}
        ctx.restore()
        ctx.globalAlpha = 1.0
        ctx.fillStyle = colourWithAlpha(bgHex, clamp((1.0 - trail) * 0.85 + dim * 0.35, 0.06, 0.65))
        ctx.fillRect(0, 0, w, h)
    } else if (l1Mode === 1 && canvasItem) {
        // Mode 1: G-Force Polar FlowField Feedback + Vector Streams
        var pull = 1.0 - (0.012 + state.mid * 0.032) * speed
        var curl = (0.014 + state.bass * 0.030) * speed
        ctx.save()
        ctx.translate(cx + Math.cos(state.t * 1.4) * state.bass * 6.0, cy + Math.sin(state.t * 1.4) * state.bass * 6.0)
        ctx.rotate(curl)
        ctx.scale(pull, pull * (1.0 + state.bass * 0.03))
        ctx.globalAlpha = clamp(trail, 0.55, 0.94)
        try {
            ctx.drawImage(canvasItem, -cx, -cy, w, h)
        } catch (e) {}
        ctx.restore()
        ctx.globalAlpha = 1.0
        ctx.fillStyle = colourWithAlpha(bgHex, clamp((1.0 - trail) * 0.90 + dim * 0.35, 0.07, 0.65))
        ctx.fillRect(0, 0, w, h)

        // Flow-field vector filaments batched by colour
        ctx.lineWidth = 1.3
        for (var fb = 0; fb < 3; fb++) {
            ctx.strokeStyle = colourWithAlpha(palette[(fb * 3) % palette.length], (0.16 + state.mid * 0.25) * (1.0 - dim))
            ctx.beginPath()
            var fCount = Math.floor(18 * density)
            for (var fi = 0; fi < fCount; fi++) {
                var fa = (fi / fCount) * Math.PI * 2 + fb * 0.7 + state.t * 0.4
                var fr1 = minDim * (0.12 + ((fi * 0.19 + state.t * 0.25) % 0.55))
                var fr2 = fr1 + minDim * (0.05 + state.smoothBands[(fi * 3) & 63] * 0.12)
                ctx.moveTo(cx + Math.cos(fa) * fr1, cy + Math.sin(fa) * fr1)
                ctx.lineTo(cx + Math.cos(fa + 0.14) * fr2, cy + Math.sin(fa + 0.14) * fr2)
            }
            ctx.stroke()
        }
    } else {
        // Standard trail veil for modes 2..5
        var veilAlpha = l1Mode === 5 ? clamp(0.45 + dim * 0.5, 0.35, 0.95) : clamp((1.0 - trail) + dim * 0.3, 0.08, 0.65)
        ctx.fillStyle = colourWithAlpha(bgHex, veilAlpha)
        ctx.fillRect(0, 0, w, h)
    }

    if (l1Mode === 2) {
        // Mode 2: Cthugha Rave Flame / Plasma Buffer seeded from 64-band spectrum
        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        var flames = state.flames || []
        for (var cBucket = 0; cBucket < 4; cBucket++) {
            ctx.fillStyle = colourWithAlpha(palette[(cBucket * 2) % palette.length], (0.14 + state.bass * 0.24) * (1.0 - dim))
            ctx.beginPath()
            for (var f = cBucket; f < flames.length; f += 4) {
                var fm = flames[f]
                var fx = fm.x * w
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
        // Mode 3: Relativistic 3D Starfield Warp
        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        var starLimit = Math.min(state.stars.length, Math.floor(90 * density))
        for (var sbk = 0; sbk < 3; sbk++) {
            ctx.strokeStyle = colourWithAlpha(palette[(sbk * 3) % palette.length], (0.45 + state.high * 0.4) * (1.0 - dim))
            ctx.lineWidth = 1.4 + sbk * 0.5 + state.bass * 1.2
            ctx.beginPath()
            for (var sIdx = sbk; sIdx < starLimit; sIdx += 3) {
                var st = state.stars[sIdx]
                var sx0 = cx + (st.x / st.pz) * minDim * 0.55
                var sy0 = cy + (st.y / st.pz) * minDim * 0.55
                var sx1 = cx + (st.x / st.z) * minDim * 0.55
                var sy1 = cy + (st.y / st.z) * minDim * 0.55
                ctx.moveTo(sx0, sy0)
                ctx.lineTo(sx1, sy1)
            }
            ctx.stroke()
        }
        ctx.restore()
    } else if (l1Mode === 4) {
        // Mode 4: Synthwave Horizon & High-Excursion 64-Band Skyline Equaliser
        var horizonY = cy + h * 0.08 + Math.sin(state.t * 0.7) * 8.0
        ctx.save()
        ctx.strokeStyle = colourWithAlpha(palette[0], (0.28 + state.bass * 0.42) * (1.0 - dim))
        ctx.lineWidth = 1.2 + state.bass * 1.5
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
            var topX = cx + c * (w * 0.015)
            var botX = cx + c * (w * 0.14)
            ctx.moveTo(topX, horizonY)
            ctx.lineTo(botX, h)
        }
        ctx.stroke()

        // High-excursion 64-band skyline equaliser above the horizon
        ctx.fillStyle = colourWithAlpha(palette[2], (0.22 + state.energy * 0.35) * (1.0 - dim))
        ctx.strokeStyle = colourWithAlpha(palette[1], (0.65 + state.bass * 0.3) * (1.0 - dim))
        ctx.lineWidth = 2.0
        ctx.beginPath()
        ctx.moveTo(0, horizonY)
        for (var b = 0; b < 64; b++) {
            var bx = (b / 63.0) * w
            var bh = state.smoothBands[b] * h * 0.36
            ctx.lineTo(bx, horizonY - bh)
        }
        ctx.lineTo(w, horizonY)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
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
                var vx = cx + Math.cos(ang) * wr
                var vy = cy + Math.sin(ang) * wr
                if (v === 0) ctx.moveTo(vx, vy)
                else ctx.lineTo(vx, vy)
            }
            ctx.stroke()
        }
        ctx.restore()
    }
}

// ---------------------------------------------------------------------------
// LAYER #2 — 12 Psychedelic & Classic Nightclub Visualiser Modes (Batched)
// ---------------------------------------------------------------------------

// Mode 0: MilkDrop Geiss Cathedral (Dual Harmonic Custom Waves + N-Fold Kaleidoscope)
function drawMode0MilkDrop(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var facets = Math.max(1, Math.min(16, Math.round(cfg.layer2Facets || 8)))
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.3, 3.0)
    var pts = Math.floor(36 * clamp(comp, 0.5, 1.8))

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    for (var ring = 0; ring < 4; ring++) {
        ctx.strokeStyle = colourWithAlpha(palette[(ring * 2) % palette.length], 0.58 + state.bass * 0.35)
        ctx.lineWidth = (ring === 0 ? 2.4 : 1.6) + state.beatPulse * 1.5
        ctx.beginPath()

        for (var f = 0; f < facets; f++) {
            var baseAng = (f * Math.PI * 2) / facets + state.phase * (ring % 2 === 0 ? 0.45 : -0.35)
            var flip = (f % 2 === 0) ? 1.0 : -1.0
            for (var i = 0; i <= pts; i++) {
                var u = i / pts
                var bIdx = (i * 2 + ring * 11) & 63
                var bv = state.smoothBands[bIdx]
                var r = minDim * (0.08 + u * 0.38 + bv * 0.18 + state.bass * 0.06)
                var theta = baseAng + flip * (u * (Math.PI * 2 / Math.max(2, facets)) + Math.sin(u * 6.0 + state.t * 2.2 + ring) * (0.22 + state.mid * 0.38))
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
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.3, 3.0)
    var N = Math.floor(140 * clamp(comp, 0.5, 2.0))
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
        ctx.lineWidth = 2.0 + (strand === 0 ? state.bass * 2.2 : 0.5)
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
    var petals = Math.max(2, Math.min(16, Math.round(cfg.layer2Facets || 6)))
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.3, 3.0)
    var steps = Math.floor(120 * clamp(comp, 0.5, 1.8))

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    for (var layer = 0; layer < 4; layer++) {
        ctx.strokeStyle = colourWithAlpha(palette[(layer * 2 + 1) % palette.length], 0.55 + state.energy * 0.35)
        ctx.lineWidth = 1.8 + (3 - layer) * 0.5 + state.bass * 1.6
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

// Mode 3: Cthugha 1990s Rave Oscilloscope & Laser Strobe Spokes
function drawMode3CthughaRave(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.44 * (cfg.layer2Zoom || 1.0)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    // Laser strobe spokes from centre
    var spokes = Math.max(4, Math.round((cfg.layer2Facets || 8) * 2))
    ctx.strokeStyle = colourWithAlpha(palette[3], 0.32 + state.beatPulse * 0.48)
    ctx.lineWidth = 1.5 + state.beatPulse * 2.0
    ctx.beginPath()
    for (var sp = 0; sp < spokes; sp++) {
        var sa = (sp / spokes) * Math.PI * 2 + state.phase * 0.6
        var sbv = state.smoothBands[(sp * 3) & 63]
        var sr0 = maxR * 0.12
        var sr1 = maxR * (0.45 + sbv * 0.65 + state.bass * 0.25)
        ctx.moveTo(Math.cos(sa) * sr0, Math.sin(sa) * sr0)
        ctx.lineTo(Math.cos(sa) * sr1, Math.sin(sa) * sr1)
    }
    ctx.stroke()

    // 3 Concentric High-Excursion Oscilloscope Rings
    for (var ring = 0; ring < 3; ring++) {
        var baseR = maxR * (0.28 + ring * 0.26 + state.bass * 0.12)
        ctx.strokeStyle = colourWithAlpha(palette[ring % palette.length], 0.72 + state.bass * 0.25)
        ctx.lineWidth = 2.2 - ring * 0.4 + state.bass * 1.5
        ctx.beginPath()
        for (var i = 0; i <= 64; i++) {
            var idx = i & 63
            var a = (i / 64.0) * Math.PI * 2 + state.phase * (ring % 2 === 0 ? 1 : -1)
            var disp = (state.smoothBands[(idx + ring * 17) & 63] - 0.18) * maxR * (0.38 + state.energy * 0.25)
            var r = Math.max(12, baseR + disp * (i % 2 === 0 ? 1 : -0.6))
            var x = Math.cos(a) * r
            var y = Math.sin(a) * r
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
    }
    ctx.restore()
}

// Mode 4: Jeff Minter VLM (Virtual Light Machine / Tempest 2000) Neon Vector Lattice
function drawMode4MinterVlm(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.48 * (cfg.layer2Zoom || 1.0)
    var facets = Math.max(3, Math.min(20, Math.round((cfg.layer2Facets || 8) * 1.5)))
    var depthRings = Math.max(4, Math.min(12, Math.floor(7 * (cfg.layer2Complexity || 1.0))))

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    // Tempest 2000 3D Web Rim & Plunging Vector Spikes batched by depth
    for (var d = 0; d < depthRings; d++) {
        var zProg = ((d / depthRings) + (state.t * 0.42) % (1.0 / depthRings)) % 1.0
        var r = Math.pow(zProg, 1.55) * maxR * (1.0 + state.bass * 0.22)
        var twist = (1.0 - zProg) * Math.sin(state.t * 1.1) * (0.65 + state.mid * 0.85) + state.phase * 0.4

        ctx.strokeStyle = colourWithAlpha(palette[(d + state.beatCount) % palette.length], (0.25 + zProg * 0.65))
        ctx.lineWidth = 1.2 + zProg * 1.8 + state.beatPulse * 1.2
        ctx.beginPath()

        for (var s = 0; s <= facets; s++) {
            var bIdx = (s * 4 + d * 5) & 63
            var spike = 1.0 + state.smoothBands[bIdx] * 0.34 * ((s + d) % 2 === 0 ? 1 : -0.5)
            var a = (s / facets) * Math.PI * 2 + twist
            var px = Math.cos(a) * r * spike
            var py = Math.sin(a) * r * spike
            if (s === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.stroke()
    }
    ctx.restore()
}

// Mode 5: Julia & Mandelbrot Fractal Orbit Traps + Sacred Recursive Canopy (Batched by Depth)
function drawMode5JuliaFractals(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var branches = Math.max(3, Math.min(12, Math.round(cfg.layer2Facets || 6)))
    var maxDepth = Math.min(5, Math.max(3, Math.round(3 + (cfg.layer2Complexity || 1.0))))

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    // Pre-collect segments per depth level so we only call ctx.stroke() once per depth!
    var depthBuckets = []
    for (var d = 0; d <= maxDepth; d++) depthBuckets.push([])

    var spread = 0.44 + state.mid * 0.45 + Math.sin(state.t * 0.9) * 0.16
    var decay = 0.68 + state.bass * 0.10

    function collectBranch(x, y, len, angle, depth, bandSeed) {
        if (depth <= 0 || len < 3.0) return
        var bVal = state.smoothBands[bandSeed & 63] || 0.0
        var nx = x + Math.cos(angle) * len * (1.0 + bVal * 0.32)
        var ny = y + Math.sin(angle) * len * (1.0 + bVal * 0.32)
        depthBuckets[depth].push(x, y, nx, ny)
        var curl = Math.sin(state.t * 1.6 + depth) * 0.16 * (1.0 + state.high)
        collectBranch(nx, ny, len * decay, angle + spread + curl, depth - 1, bandSeed + 7)
        collectBranch(nx, ny, len * decay, angle - spread + curl, depth - 1, bandSeed + 15)
    }

    var trunkLen = minDim * (0.14 + state.bass * 0.09)
    for (var b = 0; b < branches; b++) {
        var rootAngle = (b * Math.PI * 2) / branches + state.phase * 0.35
        collectBranch(0, 0, trunkLen, rootAngle, maxDepth, b * 9)
    }

    for (var lv = 1; lv <= maxDepth; lv++) {
        var segs = depthBuckets[lv]
        if (segs.length === 0) continue
        ctx.strokeStyle = colourWithAlpha(palette[(lv * 2) % palette.length], 0.32 + (lv / maxDepth) * 0.52)
        ctx.lineWidth = 0.8 + lv * 0.55 + state.bass * 0.8
        ctx.beginPath()
        for (var j = 0; j < segs.length; j += 4) {
            ctx.moveTo(segs[j], segs[j + 1])
            ctx.lineTo(segs[j + 2], segs[j + 3])
        }
        ctx.stroke()
    }

    // Julia orbit contour rings in the core
    var cRe = -0.72 + Math.cos(state.t * 0.48) * (0.18 + state.bass * 0.18)
    var cIm = 0.27 + Math.sin(state.t * 0.62) * (0.18 + state.mid * 0.18)
    ctx.strokeStyle = colourWithAlpha(palette[1], 0.62 + state.beatPulse * 0.32)
    ctx.lineWidth = 1.8
    ctx.beginPath()
    var jSteps = 72
    for (var s = 0; s <= jSteps; s++) {
        var a = (s / jSteps) * Math.PI * 2
        var zr = Math.cos(a) * 0.85
        var zi = Math.sin(a) * 0.85
        for (var it = 0; it < 3; it++) {
            var tr = zr * zr - zi * zi + cRe
            zi = 2 * zr * zi + cIm
            zr = tr
        }
        var rad = minDim * (0.14 + 0.10 * Math.atan(Math.sqrt(zr * zr + zi * zi)) + state.smoothBands[s & 63] * 0.12)
        var px = Math.cos(a - state.phase) * rad
        var py = Math.sin(a - state.phase) * rad
        if (s === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.stroke()
    ctx.restore()
}

// Mode 6: DMT Chrysanthemum & Sacred Lotus Hyperspace Dome
function drawMode6DmtChrysanthemum(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.45 * (cfg.layer2Zoom || 1.0)
    var symmetry = Math.max(4, Math.min(24, Math.round((cfg.layer2Facets || 8) * 1.5)))
    var rings = Math.max(4, Math.min(10, Math.round(6 * (cfg.layer2Complexity || 1.0))))

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    for (var r = rings; r >= 1; r--) {
        var frac = r / rings
        var baseR = maxR * frac * (0.85 + state.bass * 0.25)
        var rot = state.phase * ((r % 2 === 0) ? 1.0 : -1.0) * (1.2 - frac * 0.5)
        ctx.strokeStyle = colourWithAlpha(palette[(r * 2) % palette.length], 0.48 + (1.0 - frac) * 0.42)
        ctx.fillStyle = colourWithAlpha(palette[(r * 2 + 1) % palette.length], 0.07 + state.bass * 0.08)
        ctx.lineWidth = 1.5 + (1.0 - frac) * 1.5 + state.beatPulse * 1.2
        ctx.beginPath()

        var steps = symmetry * 6
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
        ctx.fill()
        ctx.stroke()
    }
    ctx.restore()
}

// Mode 7: Spacetime Gravity Well & Relativistic Quasar Jets
function drawMode7SpacetimeQuasar(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var gridN = Math.max(8, Math.min(20, Math.round(13 * (cfg.layer2Complexity || 1.0))))

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
    ctx.strokeStyle = colourWithAlpha(palette[2], 0.38 + state.mid * 0.35)
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
    ctx.strokeStyle = colourWithAlpha(palette[1], 0.72 + state.beatPulse * 0.25)
    ctx.lineWidth = 2.2 + state.bass * 2.0
    ctx.beginPath()
    for (var a = 0; a <= 64; a++) {
        var ang = (a / 64.0) * Math.PI * 2 + state.phase
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
    var tendrils = Math.max(6, Math.min(24, Math.round((cfg.layer2Facets || 8) * 2)))
    var segs = Math.max(10, Math.min(24, Math.round(16 * (cfg.layer2Complexity || 1.0))))

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    for (var bucket = 0; bucket < 3; bucket++) {
        ctx.strokeStyle = colourWithAlpha(palette[(bucket * 3) % palette.length], 0.55 + state.mid * 0.35)
        ctx.fillStyle = colourWithAlpha(palette[(bucket * 3 + 1) % palette.length], 0.70)
        ctx.lineWidth = 2.0 + state.bass * 1.8
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
                if (s % 5 === 0 || s === segs) {
                    nodeSpores.push(px, py, 2.2 + bVal * 5.0)
                }
            }
        }
        ctx.stroke()

        // Bioluminescent spore nodes
        ctx.beginPath()
        for (var sp = 0; sp < nodeSpores.length; sp += 3) {
            var sx = nodeSpores[sp], sy = nodeSpores[sp + 1], sr = nodeSpores[sp + 2]
            ctx.moveTo(sx + sr, sy)
            ctx.arc(sx, sy, sr, 0, Math.PI * 2)
        }
        ctx.fill()
    }
    ctx.restore()
}

// Mode 9: Cyber-Shamanic Matrix Vortex Tunnel (Batched vector rings + sparse core glyphs)
function drawMode9CyberMatrix(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.48 * (cfg.layer2Zoom || 1.0)
    var rings = Math.max(6, Math.min(16, Math.round(10 * (cfg.layer2Complexity || 1.0))))
    var sectors = Math.max(8, Math.min(24, Math.round((cfg.layer2Facets || 8) * 2)))

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

// Mode 10: 4D Sacred Polytope (Tesseract + Icosahedron + Star Mandala)
function drawMode10SacredPolytope(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var scale = Math.min(w, h) * 0.30 * (cfg.layer2Zoom || 1.0) * (1.0 + state.bass * 0.28 + state.beatPulse * 0.16)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "lighter"

    // 16 vertices of a 4D Tesseract rotated in XW, YW, ZW and 3D XY, XZ
    var aXW = state.t * 0.72 + state.bass * 0.9
    var aYW = state.t * 0.54 - state.mid * 0.7
    var aZW = state.t * 0.38 + state.high * 0.6
    var cosXW = Math.cos(aXW), sinXW = Math.sin(aXW)
    var cosYW = Math.cos(aYW), sinYW = Math.sin(aYW)
    var cosZW = Math.cos(aZW), sinZW = Math.sin(aZW)

    var proj = []
    for (var i = 0; i < 16; i++) {
        var bVal = state.smoothBands[(i * 4) & 63]
        var m = 1.0 + bVal * 0.34
        var x = ((i & 1) ? 1 : -1) * m
        var y = ((i & 2) ? 1 : -1) * m
        var z = ((i & 4) ? 1 : -1) * m
        var w4 = ((i & 8) ? 1 : -1) * m

        var x1 = x * cosXW - w4 * sinXW
        var w1 = x * sinXW + w4 * cosXW
        var y2 = y * cosYW - w1 * sinYW
        var w2 = y * sinYW + w1 * cosYW
        var z3 = z * cosZW - w2 * sinZW
        var w3 = z * sinZW + w2 * cosZW

        var d4 = 2.6 / (3.4 - clamp(w3, -1.8, 1.8))
        var d3 = 2.2 / (3.2 - clamp(z3 * d4, -1.8, 1.8))
        proj.push({
            x: x1 * d4 * d3 * scale,
            y: y2 * d4 * d3 * scale
        })
    }

    // 32 edges of the 4D hypercube batched into 2 colour paths
    for (var grp = 0; grp < 2; grp++) {
        ctx.strokeStyle = colourWithAlpha(palette[(grp * 3) % palette.length], 0.72 + state.bass * 0.25)
        ctx.lineWidth = 1.8 + grp * 0.6 + state.beatPulse * 1.4
        ctx.beginPath()
        for (var u = 0; u < 16; u++) {
            for (var bit = grp * 2; bit < (grp + 1) * 2; bit++) {
                var v = u ^ (1 << bit)
                if (u < v) {
                    ctx.moveTo(proj[u].x, proj[u].y)
                    ctx.lineTo(proj[v].x, proj[v].y)
                }
            }
        }
        ctx.stroke()
    }

    // Outer Sacred Star Mandala ring
    var points = Math.max(6, Math.min(24, Math.round((cfg.layer2Facets || 8) * 2)))
    var rOuter = scale * 1.38
    ctx.strokeStyle = colourWithAlpha(palette[1], 0.45 + state.mid * 0.4)
    ctx.lineWidth = 1.3
    ctx.beginPath()
    for (var p = 0; p < points; p++) {
        var pa1 = (p / points) * Math.PI * 2 + state.phase * 0.4
        var pa2 = (((p + Math.floor(points / 3)) % points) / points) * Math.PI * 2 + state.phase * 0.4
        var pr1 = rOuter * (1.0 + state.smoothBands[(p * 3) & 63] * 0.24)
        var pr2 = rOuter * (1.0 + state.smoothBands[((p + 5) * 3) & 63] * 0.24)
        ctx.moveTo(Math.cos(pa1) * pr1, Math.sin(pa1) * pr1)
        ctx.lineTo(Math.cos(pa2) * pr2, Math.sin(pa2) * pr2)
    }
    ctx.stroke()
    ctx.restore()
}

// Mode 11: Quantum Strange Attractor (Clifford / De Jong Audio-Morphed Chaos Ribbons)
function drawMode11StrangeAttractor(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var scale = Math.min(w, h) * 0.24 * (cfg.layer2Zoom || 1.0) * (1.0 + state.bass * 0.22)
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.3, 3.0)
    var steps = Math.floor(180 * clamp(comp, 0.5, 2.0))

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

function drawLayer2Visualiser(ctx, w, h, state, palette, cfg) {
    if (cfg && !cfg.layer2Enabled) return
    var m = ((Number(cfg && cfg.layer2Mode !== undefined ? cfg.layer2Mode : (cfg && cfg.mode)) || 0) % MODE_NAMES.length + MODE_NAMES.length) % MODE_NAMES.length
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

// ---------------------------------------------------------------------------
// LAYER #3 — Album Art Dismantle, Evolution & Rebuild Engine (Batched < 1.5ms)
// ---------------------------------------------------------------------------

function drawLayer3AlbumArt(ctx, w, h, state, palette, cfg, asciiLines, ttfxFrames) {
    if (!cfg || !cfg.layer3Enabled) return

    var l3Mode = (Number(cfg.layer3Mode) || 0) % LAYER3_MODES.length
    var asciiMode = cfg.layer3AsciiMode || cfg.asciiMode || "braille"

    // When in Omarchy TTE Keyframe Morph mode (l3Mode === 5) or Banner/Words mode (asciiMode === "banner" or !cfg.useAlbumArt),
    // prefer `cfg.bannerLines` (the wrapped & compressed artist/track words, e.g. 'BASS COMMUNION') if available!
    var effectiveLines = asciiLines
    if ((l3Mode === 5 || asciiMode === "banner" || cfg.useAlbumArt === false) && cfg.bannerLines && cfg.bannerLines.length > 0) {
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

    var tileW = Math.max(2.0, cellW * 0.96)
    var tileH = Math.max(2.0, cellH * 0.96)

    // If Mode 5 (Omarchy TTE Keyframe Evolution) and ttfxFrames are available, modulate positions/visibility from current TTE frame
    var activeTtfxFrame = null
    if (l3Mode === 5 && ttfxFrames && ttfxFrames.length > 0) {
        var fPos = (state.t * 3.2 + state.bass * 2.5) % (ttfxFrames.length * 2)
        var fIdx = Math.floor(fPos >= ttfxFrames.length ? (ttfxFrames.length * 2 - 1 - fPos) : fPos)
        activeTtfxFrame = ttfxFrames[clamp(fIdx, 0, ttfxFrames.length - 1)]
    }

    ctx.save()
    ctx.globalCompositeOperation = "lighter"

    // Batch all autonomous cells into 8 palette colour buckets with exact sub-block geometry (`▀`, `▄`, `▌`, `▐`, `█`)
    var numBuckets = 8
    for (var b = 0; b < numBuckets; b++) {
        var col = palette[(b + Math.floor(state.hueShift / 45)) % palette.length]
        ctx.fillStyle = colourWithAlpha(col, 0.78 + state.bass * 0.20)
        ctx.beginPath()

        for (var i = b; i < cells.length; i += numBuckets) {
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

            var pulseBoost = 0.85 + p.density * 0.25 + bVal * 0.35 + state.beatPulse * 0.22
            var szW = tileW * pulseBoost
            var szH = tileH * pulseBoost

            // Sub-cell geometry preserves the exact typography of Omarchy's Delta Corps Priest 1 font (`▀`, `▄`, `▌`, `▐`, `█`)
            if (p.ch === "▀") {
                ctx.rect(px - szW * 0.5, py - szH * 0.5, szW, szH * 0.54)
            } else if (p.ch === "▄") {
                ctx.rect(px - szW * 0.5, py - szH * 0.04, szW, szH * 0.54)
            } else if (p.ch === "▌") {
                ctx.rect(px - szW * 0.5, py - szH * 0.5, szW * 0.54, szH)
            } else if (p.ch === "▐") {
                ctx.rect(px - szW * 0.04, py - szH * 0.5, szW * 0.54, szH)
            } else {
                ctx.rect(px - szW * 0.5, py - szH * 0.5, szW, szH)
            }
        }
        ctx.fill()
    }

    // Sparse glowing Braille/Unicode glyph accents on high-energy peaks
    if (w >= 260) {
        var glyphStep = Math.max(16, Math.floor(cells.length / 40))
        var fontPx = Math.max(9, Math.min(16, Math.round(tileH * 1.15)))
        ctx.font = "bold " + fontPx + "px 'JetBrainsMono Nerd Font'"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = colourWithAlpha("#ffffff", 0.72 + state.beatPulse * 0.25)
        var evoProg = clamp(Number(cfg.trackProgress) || 0.0, 0.0, 1.0)
        for (var g = 0; g < cells.length; g += glyphStep) {
            var gp = cells[g]
            var gx = cx + gp.x * halfW
            var gy = cy + gp.y * halfH
            var glyph = (evoProg > 0.35 && ((g + state.beatCount) % 3 === 0)) ? gp.mutCh : gp.ch
            ctx.fillText(glyph, gx, gy)
        }
    }

    ctx.restore()
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
        layer1Enabled: c.layer1Enabled !== undefined ? Boolean(c.layer1Enabled) : true,
        layer1Mode: Number(c.layer1Mode) || 0,
        layer1Trail: Number(c.layer1Trail !== undefined ? c.layer1Trail : (c.layer1Persistence !== undefined ? c.layer1Persistence : 0.85)),
        layer1Speed: Number(c.layer1Speed !== undefined ? c.layer1Speed : 1.0),
        layer1Density: Number(c.layer1Density !== undefined ? c.layer1Density : 1.0),
        layer1Dim: Number(c.layer1Dim !== undefined ? c.layer1Dim : 0.15),
        layer2Enabled: c.layer2Enabled !== undefined ? Boolean(c.layer2Enabled) : true,
        layer2Mode: Number(c.layer2Mode !== undefined ? c.layer2Mode : (c.mode !== undefined ? c.mode : (mode || 0))),
        layer2Facets: Number(c.layer2Facets !== undefined ? c.layer2Facets : (c.symmetryFolds !== undefined ? c.symmetryFolds : 8)),
        layer2Complexity: Number(c.layer2Complexity !== undefined ? c.layer2Complexity : 1.0),
        layer2Speed: Number(c.layer2Speed !== undefined ? c.layer2Speed : 1.0),
        layer2Reactivity: Number(c.layer2Reactivity !== undefined ? c.layer2Reactivity : (c.sensitivity !== undefined ? c.sensitivity : 1.35)),
        layer2Zoom: Number(c.layer2Zoom !== undefined ? c.layer2Zoom : 1.0),
        layer2Chaos: Number(c.layer2Chaos !== undefined ? c.layer2Chaos : 0.45),
        layer3Enabled: c.layer3Enabled !== undefined ? Boolean(c.layer3Enabled) : Boolean(c.useAlbumArt || (asciiLines && asciiLines.length > 0)),
        layer3Mode: Number(c.layer3Mode) || 0,
        layer3Dismantle: Number(c.layer3Dismantle !== undefined ? c.layer3Dismantle : 1.15),
        layer3Rebuild: Number(c.layer3Rebuild !== undefined ? c.layer3Rebuild : 1.0),
        layer3Evolution: Number(c.layer3Evolution !== undefined ? c.layer3Evolution : 0.85),
        layer3Scale: Number(c.layer3Scale !== undefined ? c.layer3Scale : 1.0),
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

    // Layer #2: Psychedelic & Nightclub Visualiser Engine
    drawLayer2Visualiser(ctx, w, h, state, palette, effectiveCfg)

    // Layer #3: Album Art Dismantle, Evolution & Rebuild Engine
    drawLayer3AlbumArt(ctx, w, h, state, palette, effectiveCfg, asciiLines, ttfxFrames)
}
