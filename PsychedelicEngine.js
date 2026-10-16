.pragma library

// PsychedelicEngine.js — 60 FPS Multi-Coloured, Multi-Faceted Audio-Reactive
// Psychedelic Visualiser Engine for Bandarchy (`io.github.layolayo.bandarchy`).
//
// Provides 12 standalone visualiser modes:
//   0: Julia & Mandelbrot Fractals (complex-plane orbit traps + recursive fractal trees)
//   1: Hyperspace Swirls & Vortex (logarithmic Fibonacci spirals + phyllotaxis vortex)
//   2: Randomised Shapes & Kaleidoscope (mutating polygons, Lissajous knots, N-fold mirrors)
//   3: Space-Time Warp Matrix (3D perspective wireframe terrain + relativistic gravity well)
//   4: Alien Mycelium & Bioluminescence (undulating abyssal tentacles + Voronoi neural spores)
//   5: Multi-Faceted Crystal Hypercube (4D tesseract projection + prismatic dispersion)
//   6: Voyage 34 Sacred Mandala (multi-ring lotus geometry + Metatron web + shockwaves)
//   7: Blackhole Singularity (relativistic accretion disc + Einstein lensing arcs)
//   8: Cyber SynthGrid & Beams (outrun horizon grid + volumetric sweeping laser cones)
//   9: VHS Glitch & Matrix Rain (cascading digital glyph rain + scanline chromatic split)
//  10: Album Art ASCII Matrix (TTE) (dedicated Omarchy `omarchy-transcode-ascii` + `ttfx` mode)
//  11: Cosmic Chimera Overdrive (multi-layered synthesis of fractals, swirls, warp & alien flora)
//
// Note: The Album Art / TTE ASCII matrix implementation is NOT fixed on top of
// every mode; it runs as Mode 10 (`Album Art ASCII Matrix (TTE)`) or as an
// optional overlay when `options.useAlbumArt` is explicitly enabled (`true`).

var MODE_NAMES = [
    "Julia & Mandelbrot Fractals",
    "Hyperspace Swirls & Vortex",
    "Randomised Shapes & Kaleidoscope",
    "Space-Time Warp Matrix",
    "Alien Mycelium & Bioluminescence",
    "Multi-Faceted Crystal Hypercube",
    "Voyage 34 Sacred Mandala",
    "Blackhole Singularity",
    "Cyber SynthGrid & Beams",
    "VHS Glitch & Matrix Rain",
    "Album Art ASCII Matrix (TTE)",
    "Cosmic Chimera Overdrive"
]

var PALETTE_NAMES = [
    "DMT Hyperspace Prism",
    "Omarchy Screensaver",
    "Voyage 34 LSD",
    "Alien Flora & Mycelium",
    "Space-Time Event Horizon",
    "Chromatic Fractal Acid",
    "Aeterna Nebula",
    "Iridescent Scarab & Opal",
    "Solar Flare & Plasma",
    "Abyssal Bioluminescence"
]

var SYMMETRY_OPTIONS = [1, 2, 4, 6, 8, 12]

var BRAILLE_RAMP = ["⠀", "⠁", "⠃", "⠇", "⠏", "⠟", "⠿", "⡿", "⣿"]
var BLOCK_RAMP = [" ", "░", "▒", "▓", "▄", "▀", "█"]
var MATRIX_GLYPHS = ["0", "1", "◈", "◇", "⟡", "⟐", "∆", "∇", "░", "▒", "▓", "█", "⣿", "⡿", "⠿"]

// Precomputed 4D Tesseract (16 vertices, 32 edges, 24 quad faces)
var TESSERACT_VERTICES = (function() {
    var v = []
    for (var i = 0; i < 16; i++) {
        v.push([
            (i & 1) ? 1.0 : -1.0,
            (i & 2) ? 1.0 : -1.0,
            (i & 4) ? 1.0 : -1.0,
            (i & 8) ? 1.0 : -1.0
        ])
    }
    return v
})()

var TESSERACT_EDGES = (function() {
    var e = []
    for (var i = 0; i < 16; i++) {
        for (var bit = 0; bit < 4; bit++) {
            var j = i ^ (1 << bit)
            if (i < j) e.push([i, j, bit])
        }
    }
    return e
})()

var TESSERACT_FACES = [
    [0, 1, 3, 2], [4, 5, 7, 6], [8, 9, 11, 10], [12, 13, 15, 14],
    [0, 1, 9, 8], [2, 3, 11, 10], [4, 5, 13, 12], [6, 7, 15, 14],
    [0, 2, 10, 8], [1, 3, 11, 9], [4, 6, 14, 12], [5, 7, 15, 13],
    [0, 4, 12, 8], [1, 5, 13, 9], [2, 6, 14, 10], [3, 7, 15, 11]
]

function pseudoRandom(seed) {
    var x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
    return x - Math.floor(x)
}

function buildRandomShapes(seedBase) {
    var shapes = []
    for (var i = 0; i < 28; i++) {
        var s = seedBase + i * 17.37
        var r1 = pseudoRandom(s)
        var r2 = pseudoRandom(s + 1.1)
        var r3 = pseudoRandom(s + 2.2)
        var r4 = pseudoRandom(s + 3.3)
        var r5 = pseudoRandom(s + 4.4)
        shapes.push({
            kind: Math.floor(r1 * 6), // 0: star/poly, 1: crystal shard, 2: Lissajous, 3: merkaba, 4: spirograph, 5: irregular alien poly
            dist: 0.06 + r2 * 0.86,
            angle: r3 * Math.PI * 2.0,
            orbitSpeed: (r4 - 0.5) * 1.4,
            rot: r5 * Math.PI * 2.0,
            rotSpeed: (pseudoRandom(s + 5.5) - 0.5) * 2.4,
            scale: 0.04 + pseudoRandom(s + 6.6) * 0.14,
            vertices: 3 + Math.floor(pseudoRandom(s + 7.7) * 9),
            innerRatio: 0.30 + pseudoRandom(s + 8.8) * 0.55,
            freqA: 2 + Math.floor(r2 * 5),
            freqB: 3 + Math.floor(r3 * 6),
            hueOffset: r1,
            band: (i * 3) % 64
        })
    }
    return shapes
}

function buildAlienNodes(seedBase) {
    var nodes = []
    for (var i = 0; i < 16; i++) {
        var s = seedBase + i * 23.1
        nodes.push({
            angle: (i / 16.0) * Math.PI * 2.0 + pseudoRandom(s) * 0.3,
            baseR: 0.14 + pseudoRandom(s + 1.0) * 0.52,
            speed: 0.3 + pseudoRandom(s + 2.0) * 0.9,
            tentacles: 2 + (i % 3),
            segments: 16,
            hueOffset: i / 16.0,
            band: (i * 4) % 64
        })
    }
    return nodes
}

function createState() {
    var particles = []
    for (var i = 0; i < 140; i++) {
        particles.push({
            angle: (i / 140.0) * Math.PI * 2.0,
            radius: 0.04 + ((i * 73) % 100) / 104.0,
            speed: 0.25 + ((i * 31) % 60) / 110.0,
            size: 1.5 + (i % 5) * 0.85,
            band: i % 64,
            orbitTilt: ((i % 9) - 4) * 0.12,
            hueOffset: (i % 17) / 17.0,
            glyph: MATRIX_GLYPHS[i % MATRIX_GLYPHS.length]
        })
    }

    var rings = []
    for (var r = 0; r < 8; r++) {
        rings.push({
            radius: r / 8.0,
            energy: 0.2,
            hueOffset: r * 0.12
        })
    }

    return {
        phase: 0.0,
        ttfxCursor: 0.0,
        seed: 1.0,
        fractalOffsetRe: 0.0,
        fractalOffsetIm: 0.0,
        swirlArms: 5,
        terrainFreq: 1.0,
        bassSmooth: 0.08,
        midSmooth: 0.06,
        highSmooth: 0.05,
        energySmooth: 0.07,
        beatPulse: 0.0,
        beatCooldown: 0,
        beatCount: 0,
        shockwaves: [],
        particles: particles,
        rings: rings,
        randomShapes: buildRandomShapes(1.0),
        alienNodes: buildAlienNodes(1.0),
        smoothBands: (function() {
            var arr = []
            for (var k = 0; k < 64; k++) arr.push(0.04)
            return arr
        })(),
        peakBands: (function() {
            var arr = []
            for (var k = 0; k < 64; k++) arr.push(0.06)
            return arr
        })(),
        terrainHistory: (function() {
            var rows = []
            for (var r = 0; r < 22; r++) {
                var row = []
                for (var c = 0; c < 32; c++) row.push(0.05)
                rows.push(row)
            }
            return rows
        })(),
        rainColumns: (function() {
            var cols = []
            for (var c = 0; c < 96; c++) {
                cols.push({
                    y: ((c * 37) % 100) / 100.0,
                    speed: 0.35 + ((c * 19) % 50) / 100.0,
                    len: 5 + (c % 9)
                })
            }
            return cols
        })()
    }
}

function randomiseState(state) {
    if (!state) return
    state.seed = (state.seed || 1.0) + 13.37 + (state.phase || 0.0) * 0.71
    state.fractalOffsetRe = (pseudoRandom(state.seed) - 0.5) * 0.24
    state.fractalOffsetIm = (pseudoRandom(state.seed + 3.1) - 0.5) * 0.24
    state.swirlArms = 3 + Math.floor(pseudoRandom(state.seed + 7.7) * 7)
    state.terrainFreq = 0.65 + pseudoRandom(state.seed + 11.3) * 1.15
    state.randomShapes = buildRandomShapes(state.seed)
    state.alienNodes = buildAlienNodes(state.seed)
    state.beatPulse = 1.0
    for (var k = 0; k < 3; k++) {
        state.shockwaves.push({
            radius: 0.02 + k * 0.06,
            alpha: 0.9 - k * 0.2,
            speed: 0.022 + k * 0.008,
            hue: (pseudoRandom(state.seed + k) + k * 0.33) % 1.0
        })
    }
}

function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v))
}

function hslToRgb(h, s, l) {
    h = ((h % 1.0) + 1.0) % 1.0
    s = clamp(s, 0.0, 1.0)
    l = clamp(l, 0.0, 1.0)
    var c = (1.0 - Math.abs(2.0 * l - 1.0)) * s
    var x = c * (1.0 - Math.abs(((h * 6.0) % 2.0) - 1.0))
    var m = l - c / 2.0
    var r = 0, g = 0, b = 0
    var seg = Math.floor(h * 6.0)
    if (seg === 0) { r = c; g = x; b = 0 }
    else if (seg === 1) { r = x; g = c; b = 0 }
    else if (seg === 2) { r = 0; g = c; b = x }
    else if (seg === 3) { r = 0; g = x; b = c }
    else if (seg === 4) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    }
}

function hexToRgb(hex, fallback) {
    if (!hex) return fallback || { r: 110, g: 231, b: 183 }
    var s = String(hex).trim()
    if (s.charAt(0) === "#") s = s.slice(1)
    if (s.length === 3) {
        s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2)
    }
    if (s.length >= 6) {
        var offset = s.length === 8 ? 2 : 0
        var r = parseInt(s.slice(offset, offset + 2), 16)
        var g = parseInt(s.slice(offset + 2, offset + 4), 16)
        var b = parseInt(s.slice(offset + 4, offset + 6), 16)
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            return { r: r, g: g, b: b }
        }
    }
    return fallback || { r: 110, g: 231, b: 183 }
}

function rgbaObj(c, a) {
    return "rgba(" + clamp(Math.round(c.r), 0, 255) + "," +
                     clamp(Math.round(c.g), 0, 255) + "," +
                     clamp(Math.round(c.b), 0, 255) + "," +
                     clamp(a, 0.0, 1.0).toFixed(3) + ")"
}

function lerpRgb(c1, c2, t) {
    var k = clamp(t, 0.0, 1.0)
    return {
        r: c1.r + (c2.r - c1.r) * k,
        g: c1.g + (c2.g - c1.g) * k,
        b: c1.b + (c2.b - c1.b) * k
    }
}

function paletteColour(paletteIndex, t, energy, alpha, themeColours) {
    var p = ((paletteIndex || 0) % PALETTE_NAMES.length + PALETTE_NAMES.length) % PALETTE_NAMES.length
    var tc = themeColours || {}
    var accent = hexToRgb(tc.accent, { r: 110, g: 231, b: 183 })
    var urgent = hexToRgb(tc.urgent, { r: 244, g: 114, b: 182 })
    var fg = hexToRgb(tc.foreground, { r: 226, g: 232, b: 240 })

    if (p === 1) {
        // Omarchy Screensaver palette: theme accent -> foreground -> urgent
        var cycle = ((t % 1.0) + 1.0) % 1.0
        var base = cycle < 0.5
            ? lerpRgb(accent, fg, cycle * 2.0)
            : lerpRgb(fg, urgent, (cycle - 0.5) * 2.0)
        var boosted = lerpRgb(base, fg, clamp(energy * 0.45, 0.0, 0.65))
        return rgbaObj(boosted, alpha)
    }

    if (p === 5) {
        // Chromatic Fractal Acid: Inigo Quilez cosine polychromatic interference
        var aR = 0.5 + 0.5 * Math.cos(6.28318 * (t * 1.15 + 0.00 + energy * 0.25))
        var aG = 0.5 + 0.5 * Math.cos(6.28318 * (t * 1.15 + 0.33 + energy * 0.18))
        var aB = 0.5 + 0.5 * Math.cos(6.28318 * (t * 1.15 + 0.67 - energy * 0.20))
        return rgbaObj({ r: aR * 255, g: aG * 255, b: aB * 255 }, alpha)
    }

    var hue = 0.0
    var sat = 0.94
    var lit = clamp(0.46 + energy * 0.30, 0.22, 0.90)

    if (p === 0) {
        // DMT Hyperspace Prism: full 360-degree multi-faceted rainbow prism
        hue = (t * 1.35 + Math.sin(t * Math.PI * 4.0) * 0.08 + energy * 0.28) % 1.0
        sat = 0.98
        lit = clamp(0.48 + energy * 0.32, 0.25, 0.92)
    } else if (p === 2) {
        // Voyage 34 LSD: emerald -> cyan -> magenta -> acid gold
        hue = (t * 0.88 + energy * 0.24) % 1.0
        sat = 0.96
    } else if (p === 3) {
        // Alien Flora & Mycelium: spore lime -> bioluminescent cyan -> orchid violet -> coral
        hue = (0.26 + t * 0.68 + Math.sin(t * Math.PI * 3.0) * 0.12 + energy * 0.20) % 1.0
        sat = 0.95
    } else if (p === 4) {
        // Space-Time Event Horizon: Cherenkov blue -> cyan -> Hawking orange -> deep violet
        hue = (0.52 + Math.sin(t * Math.PI * 2.0) * 0.36 + energy * 0.22) % 1.0
        sat = 0.92
    } else if (p === 6) {
        // Aeterna Nebula: indigo -> violet -> supernova rose -> starlight teal
        hue = (0.58 + Math.sin(t * Math.PI * 2.0) * 0.25 + energy * 0.16) % 1.0
        sat = 0.90
    } else if (p === 7) {
        // Iridescent Scarab & Opal: turquoise -> molten gold -> amethyst -> crimson
        hue = (0.12 + t * 0.78 + Math.cos(t * Math.PI * 5.0) * 0.11 + energy * 0.25) % 1.0
        sat = 0.94
    } else if (p === 8) {
        // Solar Flare & Plasma: crimson -> amber -> white gold -> ultraviolet
        hue = (0.94 + t * 0.26 + energy * 0.14) % 1.0
        sat = 0.96
    } else {
        // Abyssal Bioluminescence: trench cyan -> seafoam -> electric lime -> medusa violet
        hue = (0.34 + Math.sin(t * Math.PI * 2.4) * 0.22 + energy * 0.18) % 1.0
        sat = 0.92
    }
    var rgb = hslToRgb(hue, sat, lit)
    return rgbaObj(rgb, alpha)
}

function stepAudio(state, rawBands, playing, sensitivity) {
    if (!state.smoothBands) state.smoothBands = []
    if (!state.peakBands) state.peakBands = []
    if (!state.shockwaves) state.shockwaves = []
    if (state.phase === undefined) state.phase = 0.0
    if (state.bassSmooth === undefined) state.bassSmooth = 0.0
    if (state.midSmooth === undefined) state.midSmooth = 0.0
    if (state.highSmooth === undefined) state.highSmooth = 0.0
    if (state.energySmooth === undefined) state.energySmooth = 0.0
    if (state.beatPulse === undefined) state.beatPulse = 0.0
    if (state.beatCooldown === undefined) state.beatCooldown = 0
    var sens = clamp(sensitivity || 1.0, 0.25, 3.0)
    var n = 64
    var bassSum = 0.0
    var midSum = 0.0
    var highSum = 0.0

    for (var i = 0; i < n; i++) {
        var raw = (rawBands && i < rawBands.length) ? (Number(rawBands[i]) || 0.0) : 0.0
        var target = clamp((raw / 1000.0) * sens, 0.0, 1.0)
        if (!playing && target < 0.02) {
            target = 0.06 + 0.05 * Math.sin(state.phase * 1.8 + i * 0.23) + 0.03 * Math.cos(state.phase * 0.9 - i * 0.11)
        }
        var prev = state.smoothBands[i] || 0.0
        var rate = target > prev ? 0.46 : 0.16
        var val = prev + (target - prev) * rate
        state.smoothBands[i] = val
        if (val >= (state.peakBands[i] || 0.0)) {
            state.peakBands[i] = val
        } else {
            state.peakBands[i] = Math.max(val, (state.peakBands[i] || 0.0) - 0.012)
        }
        if (i < 12) bassSum += val
        else if (i < 36) midSum += val
        else highSum += val
    }

    var bass = bassSum / 12.0
    var mid = midSum / 24.0
    var high = highSum / 28.0
    var energy = bass * 0.48 + mid * 0.34 + high * 0.18

    if (bass > state.bassSmooth * 1.24 && bass > 0.16 && state.beatCooldown <= 0) {
        state.beatPulse = 1.0
        state.beatCooldown = 8
        state.beatCount = (state.beatCount || 0) + 1
        state.shockwaves.push({
            radius: 0.02,
            alpha: clamp(0.60 + bass * 0.40, 0.45, 1.0),
            speed: 0.016 + bass * 0.026,
            hue: (state.phase * 0.19 + state.beatCount * 0.13) % 1.0
        })
        if (state.shockwaves.length > 12) {
            state.shockwaves.shift()
        }
        // Mutate a subset of random shapes on strong beat transients
        if (state.randomShapes && bass > 0.34) {
            var mutateIdx = state.beatCount % state.randomShapes.length
            var sh = state.randomShapes[mutateIdx]
            sh.vertices = 3 + ((sh.vertices + 1 + Math.floor(bass * 5)) % 9)
            sh.kind = (sh.kind + 1) % 6
            sh.hueOffset = (sh.hueOffset + 0.27) % 1.0
        }
    } else {
        state.beatPulse *= 0.86
        if (state.beatCooldown > 0) state.beatCooldown--
    }

    state.bassSmooth = state.bassSmooth * 0.78 + bass * 0.22
    state.midSmooth = state.midSmooth * 0.80 + mid * 0.20
    state.highSmooth = state.highSmooth * 0.80 + high * 0.20
    state.energySmooth = state.energySmooth * 0.80 + energy * 0.20
    state.phase += 0.018 + state.energySmooth * 0.054
    state.ttfxCursor = (state.ttfxCursor || 0.0) + 0.08 + state.energySmooth * 0.48 + state.beatPulse * 0.32

    // Push current spectrum snapshot into 3D terrain history for Space-Time Warp Matrix
    if (state.terrainHistory) {
        var newRow = []
        for (var c = 0; c < 32; c++) {
            var b0 = state.smoothBands[c * 2] || 0.04
            var b1 = state.smoothBands[c * 2 + 1] || 0.04
            newRow.push((b0 + b1) * 0.5)
        }
        state.terrainHistory.unshift(newRow)
        if (state.terrainHistory.length > 22) {
            state.terrainHistory.pop()
        }
    }

    for (var s = state.shockwaves.length - 1; s >= 0; s--) {
        state.shockwaves[s].radius += state.shockwaves[s].speed
        state.shockwaves[s].alpha *= 0.955
        if (state.shockwaves[s].alpha < 0.03 || state.shockwaves[s].radius > 1.45) {
            state.shockwaves.splice(s, 1)
        }
    }
}

function drawBackdrop(ctx, w, h, state, paletteIndex, themeColours) {
    var tc = themeColours || {}
    var bgRgb = hexToRgb(tc.background, { r: 7, g: 9, b: 14 })
    ctx.fillStyle = rgbaObj(bgRgb, 0.26)
    ctx.fillRect(0, 0, w, h)

    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.hypot(cx, cy)
    var grad = ctx.createRadialGradient(
        cx, cy, maxR * 0.02,
        cx, cy, maxR * (0.68 + state.bassSmooth * 0.35)
    )
    grad.addColorStop(0.0, paletteColour(paletteIndex, state.phase * 0.08, state.bassSmooth, 0.18 + state.beatPulse * 0.14, tc))
    grad.addColorStop(0.45, paletteColour(paletteIndex, state.phase * 0.08 + 0.33, state.midSmooth, 0.09, tc))
    grad.addColorStop(0.80, paletteColour(paletteIndex, state.phase * 0.08 + 0.67, state.highSmooth, 0.04, tc))
    grad.addColorStop(1.0, rgbaObj(bgRgb, 0.0))
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)
}

// ===========================================================================
// MODE 0: JULIA & MANDELBROT FRACTALS
// Complex-plane Julia orbit-trap field + multi-symmetrical recursive fractal
// canopies + Koch/Sierpiński sacred geometry filaments.
// ===========================================================================
function drawFractalBranch(ctx, x, y, len, angle, depth, maxDepth, state, paletteIndex, tc, branchSeed) {
    if (depth <= 0 || len < 2.5) return
    var bandIdx = (depth * 9 + branchSeed * 5) % 64
    var bVal = state.smoothBands[bandIdx] || 0.06
    var x2 = x + Math.cos(angle) * len
    var y2 = y + Math.sin(angle) * len

    var tHue = (depth / maxDepth) * 0.55 + branchSeed * 0.14 + state.phase * 0.09 + bVal * 0.25
    ctx.strokeStyle = paletteColour(paletteIndex, tHue, bVal + state.beatPulse * 0.3, 0.35 + (depth / maxDepth) * 0.55, tc)
    ctx.lineWidth = Math.max(0.9, depth * (0.65 + state.bassSmooth * 0.55))
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    if (depth <= 2) {
        ctx.fillStyle = paletteColour(paletteIndex, tHue + 0.32, 0.85, 0.72, tc)
        ctx.beginPath()
        ctx.arc(x2, y2, 1.8 + bVal * 4.5, 0, Math.PI * 2.0)
        ctx.fill()
    }

    var spread = 0.42 + state.midSmooth * 0.52 + Math.sin(state.phase * 1.4 + depth) * 0.14
    var shrink = 0.66 + state.bassSmooth * 0.10
    drawFractalBranch(ctx, x2, y2, len * shrink, angle + spread, depth - 1, maxDepth, state, paletteIndex, tc, branchSeed + 1)
    drawFractalBranch(ctx, x2, y2, len * shrink, angle - spread, depth - 1, maxDepth, state, paletteIndex, tc, branchSeed + 2)
}

function drawJuliaAndFractals(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours) {
    var tc = themeColours || {}
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)

    // 1. Complex-plane Julia Set Orbit-Trap Lattice
    var cRe = -0.745 + (state.fractalOffsetRe || 0.0) + 0.16 * Math.cos(state.phase * 0.37) + (state.bassSmooth - 0.2) * 0.12
    var cIm = 0.186 + (state.fractalOffsetIm || 0.0) + 0.16 * Math.sin(state.phase * 0.29) + (state.midSmooth - 0.2) * 0.12
    var gridCols = 32
    var gridRows = 20
    var cellW = w / gridCols
    var cellH = h / gridRows
    var zoom = 1.45 - state.bassSmooth * 0.38
    var cosRot = Math.cos(state.phase * 0.16)
    var sinRot = Math.sin(state.phase * 0.16)

    ctx.save()
    for (var gy = 0; gy < gridRows; gy++) {
        var ny = ((gy + 0.5) / gridRows - 0.5) * 2.0 * zoom
        for (var gx = 0; gx < gridCols; gx++) {
            var nx = ((gx + 0.5) / gridCols - 0.5) * 2.0 * (w / h) * zoom
            var zr = nx * cosRot - ny * sinRot
            var zi = nx * sinRot + ny * cosRot
            var iter = 0
            var maxIter = 14
            var minTrap = 99.0
            while (iter < maxIter) {
                var zr2 = zr * zr
                var zi2 = zi * zi
                if (zr2 + zi2 > 4.0) break
                var trap = Math.min(Math.abs(zr), Math.abs(zi), Math.abs(zr2 + zi2 - 0.35))
                if (trap < minTrap) minTrap = trap
                zi = 2.0 * zr * zi + cIm
                zr = zr2 - zi2 + cRe
                iter++
            }
            var bandVal = state.smoothBands[(gx * 2 + gy * 3) % 64] || 0.05
            var normIter = iter / maxIter
            var trapFactor = clamp(1.0 - minTrap * 2.2, 0.0, 1.0)
            var intensity = clamp(normIter * 0.65 + trapFactor * 0.55 + bandVal * 0.4, 0.0, 1.0)
            if (intensity < 0.18) continue

            var px = (gx + 0.5) * cellW
            var py = (gy + 0.5) * cellH
            var hue = normIter * 0.85 + trapFactor * 0.4 + state.phase * 0.07 + bandVal * 0.25
            var rad = (0.28 + intensity * 0.62) * Math.min(cellW, cellH)
            var cellRot = zr * 0.5 + state.phase * 0.4

            ctx.fillStyle = paletteColour(paletteIndex, hue, intensity, 0.24 + intensity * 0.48, tc)
            ctx.strokeStyle = paletteColour(paletteIndex, hue + 0.22, intensity, 0.42 + intensity * 0.45, tc)
            ctx.lineWidth = 1.1

            // Multi-faceted fractal diamond / hex cell (computed in screen coords to avoid 640 ctx.save/restore per frame)
            ctx.beginPath()
            var sides = (iter % 2 === 0) ? 4 : 6
            for (var s = 0; s < sides; s++) {
                var a = (s / sides) * Math.PI * 2.0 + cellRot
                var r = rad * (s % 2 === 0 ? 1.0 : 0.62 + trapFactor * 0.38)
                var vx = px + Math.cos(a) * r
                var vy = py + Math.sin(a) * r
                if (s === 0) ctx.moveTo(vx, vy)
                else ctx.lineTo(vx, vy)
            }
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
        }
    }
    ctx.restore()

    // 2. Symmetrical Recursive Audio-Reactive Fractal Canopies radiating from centre
    var trunks = Math.min(8, Math.max(5, symmetryFolds > 1 ? symmetryFolds : 6))
    var trunkLen = minDim * (0.11 + state.bassSmooth * 0.09 + state.beatPulse * 0.03)
    var branchDepth = trunks >= 8 ? 4 : 5
    ctx.save()
    for (var t = 0; t < trunks; t++) {
        var baseAngle = (t / trunks) * Math.PI * 2.0 + state.phase * 0.22
        drawFractalBranch(ctx, cx, cy, trunkLen, baseAngle, branchDepth, branchDepth, state, paletteIndex, tc, t)
    }
    ctx.restore()
}

// ===========================================================================
// MODE 1: HYPERSPACE SWIRLS & VORTEX
// Multi-armed logarithmic Fibonacci spirals + golden-angle phyllotaxis swirl
// florets + counter-rotating plasma turbulence ribbons.
// ===========================================================================
function drawHyperspaceSwirls(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours) {
    var tc = themeColours || {}
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.hypot(cx, cy) * 0.92
    var arms = Math.max(3, symmetryFolds > 1 ? symmetryFolds : (state.swirlArms || 5))

    ctx.save()
    ctx.translate(cx, cy)

    // 1. Multi-Armed Logarithmic Spiral Plasma Ribbons
    for (var arm = 0; arm < arms; arm++) {
        var armBaseAngle = (arm / arms) * Math.PI * 2.0
        for (var strand = 0; strand < 2; strand++) {
            var dir = strand === 0 ? 1.0 : -0.65
            ctx.beginPath()
            var steps = 54
            for (var i = 0; i <= steps; i++) {
                var frac = i / steps
                var bVal = state.smoothBands[(i + arm * 7) % 64] || 0.05
                var twist = frac * (4.2 + state.bassSmooth * 3.2) * dir - state.phase * (1.5 * dir)
                var wobble = Math.sin(frac * 18.0 - state.phase * 4.5 + arm) * (8.0 + bVal * 26.0)
                var r = frac * maxR + wobble
                var a = armBaseAngle + twist
                var px = Math.cos(a) * r
                var py = Math.sin(a) * r
                if (i === 0) ctx.moveTo(px, py)
                else ctx.lineTo(px, py)
            }
            var hue = (arm / arms) + strand * 0.25 + state.phase * 0.11
            ctx.strokeStyle = paletteColour(paletteIndex, hue, state.energySmooth + 0.25, strand === 0 ? 0.72 : 0.42, tc)
            ctx.lineWidth = (strand === 0 ? 3.2 : 1.8) + state.bassSmooth * 4.0
            ctx.stroke()
        }
    }

    // 2. Golden-Angle (137.50776 deg) Phyllotaxis Swirl Vortex
    var goldenAngle = 2.399963229728653
    var floretCount = 180
    for (var n = 1; n <= floretCount; n++) {
        var normN = n / floretCount
        var band = state.smoothBands[n % 64] || 0.05
        var r = Math.sqrt(normN) * maxR * (0.78 + state.bassSmooth * 0.18)
        var shear = Math.sin(normN * 6.0 - state.phase * 2.4) * (0.4 + state.midSmooth * 1.1)
        var theta = n * goldenAngle + state.phase * (0.9 - normN * 1.4) + shear
        var fx = Math.cos(theta) * r
        var fy = Math.sin(theta) * r
        var fSize = (1.8 + normN * 4.8) * (0.65 + band * 1.45 + state.beatPulse * 0.35)
        var fHue = normN * 0.9 + (n % 7) * 0.09 + state.phase * 0.12

        ctx.fillStyle = paletteColour(paletteIndex, fHue, band + 0.2, 0.45 + band * 0.5, tc)
        ctx.beginPath()
        // Swirl teardrop / petal oriented along tangent
        ctx.ellipse(fx, fy, fSize * 1.45, fSize * 0.72, theta + Math.PI * 0.25, 0, Math.PI * 2.0)
        ctx.fill()
    }

    ctx.restore()
}

// ===========================================================================
// MODE 2: RANDOMISED SHAPES & KALEIDOSCOPE
// Beat-mutating randomised polygons, star polyhedra, Lissajous harmonic knots,
// Penrose crystal shards, and N-fold mirror kaleidoscope reflections.
// ===========================================================================
function drawSingleRandomShape(ctx, sh, radiusScale, bVal, state, paletteIndex, tc) {
    var sz = sh.scale * radiusScale * (0.75 + bVal * 1.15 + state.beatPulse * 0.28)
    var hue = sh.hueOffset + state.phase * 0.09 + bVal * 0.3
    ctx.fillStyle = paletteColour(paletteIndex, hue, bVal + 0.2, 0.28 + bVal * 0.42, tc)
    ctx.strokeStyle = paletteColour(paletteIndex, hue + 0.18, bVal + 0.35, 0.75 + bVal * 0.25, tc)
    ctx.lineWidth = 1.4 + bVal * 2.2

    ctx.beginPath()
    if (sh.kind === 0 || sh.kind === 3) {
        // Star polyhedron or sacred merkaba polygon
        var pts = sh.vertices * 2
        for (var i = 0; i < pts; i++) {
            var a = (i / pts) * Math.PI * 2.0
            var r = (i % 2 === 0) ? sz : (sz * sh.innerRatio)
            if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    } else if (sh.kind === 1) {
        // Multi-faceted Penrose crystal shard with internal facet lines
        ctx.moveTo(0, -sz * 1.35)
        ctx.lineTo(sz * 0.75, 0)
        ctx.lineTo(0, sz * 1.35)
        ctx.lineTo(-sz * 0.75, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, -sz * 1.35)
        ctx.lineTo(0, sz * 1.35)
        ctx.moveTo(-sz * 0.75, 0)
        ctx.lineTo(sz * 0.75, 0)
        ctx.stroke()
    } else if (sh.kind === 2) {
        // Lissajous harmonic knot
        var steps = 36
        for (var k = 0; k <= steps; k++) {
            var t = (k / steps) * Math.PI * 2.0
            var lx = Math.sin(sh.freqA * t + state.phase) * sz
            var ly = Math.sin(sh.freqB * t) * sz
            if (k === 0) ctx.moveTo(lx, ly)
            else ctx.lineTo(lx, ly)
        }
        ctx.closePath()
        ctx.stroke()
    } else if (sh.kind === 4) {
        // Hypotrochoid spirograph rose
        var petals = sh.vertices
        var sSteps = 42
        for (var p = 0; p <= sSteps; p++) {
            var ang = (p / sSteps) * Math.PI * 2.0
            var rad = sz * (0.45 + 0.55 * Math.cos(petals * ang + state.phase * 1.5))
            if (p === 0) ctx.moveTo(Math.cos(ang) * rad, Math.sin(ang) * rad)
            else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    } else {
        // Irregular multi-faceted alien polyhedron
        var vCount = sh.vertices
        for (var v = 0; v < vCount; v++) {
            var va = (v / vCount) * Math.PI * 2.0
            var vr = sz * (0.65 + 0.35 * Math.sin(v * 2.7 + state.phase * 2.2))
            if (v === 0) ctx.moveTo(Math.cos(va) * vr, Math.sin(va) * vr)
            else ctx.lineTo(Math.cos(va) * vr, Math.sin(va) * vr)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}

function drawRandomisedShapesAndKaleidoscope(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours) {
    var tc = themeColours || {}
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)
    var folds = symmetryFolds > 1 ? symmetryFolds : 6
    var shapes = state.randomShapes || []

    // Advance shape orbits
    for (var i = 0; i < shapes.length; i++) {
        var sh = shapes[i]
        var bVal = state.smoothBands[sh.band] || 0.05
        sh.angle += (0.004 + bVal * 0.018) * sh.orbitSpeed
        sh.rot += (0.008 + bVal * 0.032) * sh.rotSpeed
    }

    ctx.save()
    ctx.translate(cx, cy)

    var shapeStride = folds >= 8 ? 2 : 1
    for (var f = 0; f < folds; f++) {
        ctx.save()
        ctx.rotate((f / folds) * Math.PI * 2.0)
        if (f % 2 === 1) {
            ctx.scale(1.0, -1.0)
        }

        for (var s = 0; s < shapes.length; s += shapeStride) {
            var shape = shapes[s]
            var bandVal = state.smoothBands[shape.band] || 0.05
            var r = shape.dist * minDim * 0.48 * (0.85 + state.bassSmooth * 0.22)
            var a = (shape.angle % (Math.PI * 2.0 / folds))
            var sx = Math.cos(a) * r
            var sy = Math.sin(a) * r

            ctx.save()
            ctx.translate(sx, sy)
            ctx.rotate(shape.rot)
            drawSingleRandomShape(ctx, shape, minDim, bandVal, state, paletteIndex, tc)
            ctx.restore()
        }
        ctx.restore()
    }

    ctx.restore()
}

// ===========================================================================
// MODE 3: SPACE-TIME WARP MATRIX LANDSCAPE
// 3D perspective wireframe terrain mesh + relativistic Einstein-Rosen
// gravitational curvature funnel + warp starfield & binary horizon suns.
// ===========================================================================
function drawSpaceTimeWarpLandscape(ctx, w, h, state, paletteIndex, themeColours) {
    var tc = themeColours || {}
    var cx = w * 0.5
    var horizonY = h * 0.36
    var fov = Math.min(w, h) * 0.72
    var tFreq = state.terrainFreq || 1.0

    ctx.save()

    // 1. Relativistic Warp Starfield & Gravitational Lensing Arcs above horizon
    for (var p = 0; p < 60; p++) {
        var pt = state.particles[p % state.particles.length]
        var bVal = state.smoothBands[pt.band] || 0.05
        var starAngle = pt.angle + state.phase * 0.25
        var starR = (0.08 + pt.radius * 0.85) * Math.max(w, h) * 0.55
        var sx = cx + Math.cos(starAngle) * starR
        var sy = horizonY * 0.65 + Math.sin(starAngle) * starR * 0.42
        if (sy < horizonY + 20) {
            var streak = 4.0 + (state.bassSmooth + bVal) * 18.0
            ctx.strokeStyle = paletteColour(paletteIndex, pt.hueOffset + state.phase * 0.06, bVal + 0.3, 0.55, tc)
            ctx.lineWidth = 1.4
            ctx.beginPath()
            ctx.moveTo(sx, sy)
            ctx.lineTo(sx + Math.cos(starAngle) * streak, sy + Math.sin(starAngle) * streak * 0.4)
            ctx.stroke()
        }
    }

    // Binary Relativistic Horizon Sun with gravitational ring
    var sunR = Math.min(w, h) * (0.09 + state.bassSmooth * 0.04)
    var sunGrad = ctx.createRadialGradient(cx, horizonY, sunR * 0.1, cx, horizonY, sunR * 2.1)
    sunGrad.addColorStop(0.0, paletteColour(paletteIndex, state.phase * 0.05 + 0.1, 0.95, 0.82, tc))
    sunGrad.addColorStop(0.5, paletteColour(paletteIndex, state.phase * 0.05 + 0.4, 0.75, 0.35, tc))
    sunGrad.addColorStop(1.0, "rgba(0,0,0,0)")
    ctx.fillStyle = sunGrad
    ctx.beginPath()
    ctx.arc(cx, horizonY, sunR * 2.1, 0, Math.PI * 2.0)
    ctx.fill()

    // 2. 3D Space-Time Curvature & Audio Terrain Mesh
    var rows = 20
    var cols = 28
    var gridPts = []
    var wormholeStrength = 0.55 + state.bassSmooth * 0.95 + state.beatPulse * 0.45

    for (var r = 0; r < rows; r++) {
        var rowArr = []
        var zNorm = (r + 1) / rows // 0 (near) .. 1 (far)
        var zDepth = 0.45 + zNorm * 3.4
        var histRow = (state.terrainHistory && r < state.terrainHistory.length) ? state.terrainHistory[r] : null

        for (var c = 0; c < cols; c++) {
            var xNorm = (c / (cols - 1) - 0.5) * 2.0 // -1 .. 1
            var worldX = xNorm * 2.4 * zDepth
            var specVal = histRow ? (histRow[c % histRow.length] || 0.05) : (state.smoothBands[(c * 2 + r) % 64] || 0.05)

            // Relativistic wormhole funnel at centre (xNorm ~ 0, zNorm ~ 0.42) + ridge waves on flanks
            var dxW = xNorm * 1.65
            var dzW = (zNorm - 0.42) * 1.85
            var distW2 = dxW * dxW + dzW * dzW
            var gravityWell = -wormholeStrength * Math.exp(-distW2 * 3.8)
            var ridgeWave = Math.sin(xNorm * 5.5 * tFreq + state.phase * 2.1 - r * 0.35) * 0.14
            var mountainLift = Math.pow(Math.abs(xNorm), 0.75) * specVal * (0.95 + state.bassSmooth * 0.65)
            var worldY = 0.52 - mountainLift - ridgeWave - gravityWell

            var projScale = fov / zDepth
            var screenX = cx + worldX * projScale * 0.42
            var screenY = horizonY + worldY * projScale * 0.65

            rowArr.push({
                x: screenX,
                y: screenY,
                val: specVal,
                well: -gravityWell,
                zNorm: zNorm,
                xNorm: xNorm
            })
        }
        gridPts.push(rowArr)
    }

    // Draw back-to-front multi-coloured wireframe quads
    for (var qr = rows - 2; qr >= 0; qr--) {
        for (var qc = 0; qc < cols - 1; qc++) {
            var p00 = gridPts[qr][qc]
            var p10 = gridPts[qr][qc + 1]
            var p11 = gridPts[qr + 1][qc + 1]
            var p01 = gridPts[qr + 1][qc]

            var energy = clamp(p00.val + p00.well * 0.6, 0.05, 1.0)
            var hue = (qc / cols) * 0.65 + (qr / rows) * 0.35 + p00.well * 0.4 + state.phase * 0.08
            var alpha = clamp((1.0 - p00.zNorm * 0.65) * (0.28 + energy * 0.62), 0.12, 0.92)

            ctx.fillStyle = paletteColour(paletteIndex, hue, energy, alpha * 0.24, tc)
            ctx.strokeStyle = paletteColour(paletteIndex, hue + 0.12, energy + 0.15, alpha, tc)
            ctx.lineWidth = 1.0 + energy * 1.3

            ctx.beginPath()
            ctx.moveTo(p00.x, p00.y)
            ctx.lineTo(p10.x, p10.y)
            ctx.lineTo(p11.x, p11.y)
            ctx.lineTo(p01.x, p01.y)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
        }
    }

    ctx.restore()
}

// ===========================================================================
// MODE 4: ALIEN MYCELIUM & BIOLUMINESCENCE
// Organic alien flora, undulating multi-jointed medusa tentacles with glowing
// cilia fronds, cellular Voronoi synaptic membranes, and spore bursts.
// ===========================================================================
function drawAlienBioluminescence(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours) {
    var tc = themeColours || {}
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)
    var nodes = state.alienNodes || []

    ctx.save()

    // 1. Synaptic Mycelium Web connecting organic cell nuclei
    var cellPositions = []
    for (var i = 0; i < nodes.length; i++) {
        var nd = nodes[i]
        var bVal = state.smoothBands[nd.band] || 0.05
        var a = nd.angle + Math.sin(state.phase * 0.55 * nd.speed + i) * 0.65
        var r = nd.baseR * minDim * 0.52 * (0.82 + 0.25 * Math.cos(state.phase * 0.7 + i * 1.3) + bVal * 0.28)
        cellPositions.push({
            x: cx + Math.cos(a) * r * (w / minDim) * 0.78,
            y: cy + Math.sin(a) * r * 0.85,
            bVal: bVal,
            hue: nd.hueOffset + state.phase * 0.07,
            node: nd
        })
    }

    // Draw branching neural-mycelium filaments between nearby nuclei
    for (var m = 0; m < cellPositions.length; m++) {
        for (var n = m + 1; n < cellPositions.length; n++) {
            var c1 = cellPositions[m]
            var c2 = cellPositions[n]
            var dist = Math.hypot(c2.x - c1.x, c2.y - c1.y)
            var maxConn = minDim * 0.46
            if (dist < maxConn) {
                var connStrength = 1.0 - dist / maxConn
                var midX = (c1.x + c2.x) * 0.5 + Math.sin(state.phase * 2.2 + m * n) * 24.0 * connStrength
                var midY = (c1.y + c2.y) * 0.5 + Math.cos(state.phase * 1.9 + m + n) * 24.0 * connStrength
                ctx.strokeStyle = paletteColour(paletteIndex, (c1.hue + c2.hue) * 0.5, (c1.bVal + c2.bVal) * 0.5, connStrength * 0.55, tc)
                ctx.lineWidth = 1.0 + connStrength * 2.4
                ctx.beginPath()
                ctx.moveTo(c1.x, c1.y)
                ctx.quadraticCurveTo(midX, midY, c2.x, c2.y)
                ctx.stroke()
            }
        }
    }

    // 2. Undulating Bioluminescent Medusa / Alien Flora Tentacles
    var totalTentacles = Math.max(8, symmetryFolds > 1 ? symmetryFolds * 2 : 12)
    for (var t = 0; t < totalTentacles; t++) {
        var baseAng = (t / totalTentacles) * Math.PI * 2.0 + state.phase * 0.14
        var segs = 18
        var segLen = minDim * (0.022 + state.bassSmooth * 0.010)
        var curX = cx + Math.cos(baseAng) * (minDim * 0.05)
        var curY = cy + Math.sin(baseAng) * (minDim * 0.05)
        var curAng = baseAng

        for (var s = 0; s < segs; s++) {
            var sFrac = s / segs
            var sBand = state.smoothBands[(t * 4 + s * 2) % 64] || 0.05
            curAng += Math.sin(state.phase * 3.2 - s * 0.45 + t * 0.9) * (0.14 + sBand * 0.24)
            var nx = curX + Math.cos(curAng) * segLen
            var ny = curY + Math.sin(curAng) * segLen
            var tHue = (t / totalTentacles) + sFrac * 0.42 + state.phase * 0.09

            ctx.strokeStyle = paletteColour(paletteIndex, tHue, sBand + 0.25, (1.0 - sFrac * 0.55) * 0.82, tc)
            ctx.lineWidth = Math.max(1.2, (1.0 - sFrac) * (5.5 + state.bassSmooth * 4.5))
            ctx.beginPath()
            ctx.moveTo(curX, curY)
            ctx.lineTo(nx, ny)
            ctx.stroke()

            // Glowing bioluminescent cilia / spore pods along tentacle vertebrae
            if (s % 2 === 0) {
                var normalAng = curAng + Math.PI * 0.5
                var ciliaLen = (1.0 - sFrac * 0.5) * (8.0 + sBand * 22.0)
                var cosN = Math.cos(normalAng)
                var sinN = Math.sin(normalAng)
                for (var side = -1; side <= 1; side += 2) {
                    var cxEnd = nx + cosN * ciliaLen * side
                    var cyEnd = ny + sinN * ciliaLen * side
                    ctx.strokeStyle = paletteColour(paletteIndex, tHue + 0.16, sBand + 0.3, 0.44, tc)
                    ctx.lineWidth = 1.0
                    ctx.beginPath()
                    ctx.moveTo(nx, ny)
                    ctx.lineTo(cxEnd, cyEnd)
                    ctx.stroke()

                    ctx.fillStyle = paletteColour(paletteIndex, tHue + 0.28, sBand + 0.4, 0.68, tc)
                    ctx.beginPath()
                    ctx.arc(cxEnd, cyEnd, 1.6 + sBand * 3.2, 0, Math.PI * 2.0)
                    ctx.fill()
                }
            }
            curX = nx
            curY = ny
        }
    }

    // 3. Cellular Organelle Nuclei with pulsing membranes
    for (var c = 0; c < cellPositions.length; c++) {
        var cp = cellPositions[c]
        var cellR = 7.0 + cp.bVal * 18.0 + state.beatPulse * 5.0
        ctx.fillStyle = paletteColour(paletteIndex, cp.hue, cp.bVal + 0.3, 0.35, tc)
        ctx.strokeStyle = paletteColour(paletteIndex, cp.hue + 0.2, 0.9, 0.8, tc)
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.arc(cp.x, cp.y, cellR, 0, Math.PI * 2.0)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = paletteColour(paletteIndex, cp.hue + 0.45, 0.95, 0.9, tc)
        ctx.beginPath()
        ctx.arc(cp.x, cp.y, cellR * 0.36, 0, Math.PI * 2.0)
        ctx.fill()
    }

    ctx.restore()
}

// ===========================================================================
// MODE 5: MULTI-FACETED CRYSTAL HYPERCUBE
// 4D Tesseract (8-cell) rotating in XW, YW, ZW, and XY planes, projected
// 4D -> 3D -> 2D with stained-glass iridescent facets & prismatic rays.
// ===========================================================================
function drawCrystalHypercube(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours) {
    var tc = themeColours || {}
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)
    var scale = minDim * (0.26 + state.bassSmooth * 0.10 + state.beatPulse * 0.04)

    var aXW = state.phase * 0.62
    var aYW = state.phase * 0.47 + state.bassSmooth * 0.8
    var aZW = state.phase * 0.39 + state.midSmooth * 0.7
    var aXY = state.phase * 0.51
    var aXZ = state.phase * 0.33

    var cXW = Math.cos(aXW), sXW = Math.sin(aXW)
    var cYW = Math.cos(aYW), sYW = Math.sin(aYW)
    var cZW = Math.cos(aZW), sZW = Math.sin(aZW)
    var cXY = Math.cos(aXY), sXY = Math.sin(aXY)
    var cXZ = Math.cos(aXZ), sXZ = Math.sin(aXZ)

    var projected = []
    for (var i = 0; i < TESSERACT_VERTICES.length; i++) {
        var v = TESSERACT_VERTICES[i]
        var bVal = state.smoothBands[(i * 4) % 64] || 0.05
        var morph = 1.0 + bVal * 0.38
        var x = v[0] * morph
        var y = v[1] * morph
        var z = v[2] * morph
        var w4 = v[3] * morph

        // 4D rotations: XW, YW, ZW
        var tx = x * cXW - w4 * sXW
        var tw = x * sXW + w4 * cXW
        x = tx; w4 = tw

        var ty = y * cYW - w4 * sYW
        tw = y * sYW + w4 * cYW
        y = ty; w4 = tw

        var tz = z * cZW - w4 * sZW
        tw = z * sZW + w4 * cZW
        z = tz; w4 = tw

        // 3D rotations: XY, XZ
        tx = x * cXY - y * sXY
        ty = x * sXY + y * cXY
        x = tx; y = ty

        tx = x * cXZ - z * sXZ
        tz = x * sXZ + z * cXZ
        x = tx; z = tz

        // Stereographic 4D -> 3D -> 2D projection
        var wPersp = 1.9 / (2.8 - w4)
        var x3 = x * wPersp
        var y3 = y * wPersp
        var z3 = z * wPersp
        var zPersp = 2.2 / (3.4 - z3)

        projected.push({
            x: x3 * zPersp * scale,
            y: y3 * zPersp * scale,
            w4: w4,
            z3: z3,
            bVal: bVal
        })
    }

    ctx.save()
    ctx.translate(cx, cy)

    var copies = symmetryFolds > 1 ? Math.min(6, symmetryFolds) : 1
    for (var rep = 0; rep < copies; rep++) {
        ctx.save()
        if (copies > 1) {
            ctx.rotate((rep / copies) * Math.PI * 2.0)
        }

        // 1. Stained-Glass Multi-Faceted Crystal Quad Faces
        for (var f = 0; f < TESSERACT_FACES.length; f++) {
            var face = TESSERACT_FACES[f]
            var p0 = projected[face[0]]
            var p1 = projected[face[1]]
            var p2 = projected[face[2]]
            var p3 = projected[face[3]]
            var fBand = state.smoothBands[(f * 3) % 64] || 0.05
            var fHue = (f / TESSERACT_FACES.length) + (p0.w4 + 1.0) * 0.18 + state.phase * 0.10

            ctx.fillStyle = paletteColour(paletteIndex, fHue, fBand + 0.25, 0.14 + fBand * 0.24, tc)
            ctx.beginPath()
            ctx.moveTo(p0.x, p0.y)
            ctx.lineTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.lineTo(p3.x, p3.y)
            ctx.closePath()
            ctx.fill()
        }

        // 2. Glowing Prismatic Hypercube Edges
        for (var e = 0; e < TESSERACT_EDGES.length; e++) {
            var edge = TESSERACT_EDGES[e]
            var va = projected[edge[0]]
            var vb = projected[edge[1]]
            var dimAxis = edge[2]
            var eBand = state.smoothBands[(e * 2) % 64] || 0.05
            var eHue = dimAxis * 0.25 + (e / TESSERACT_EDGES.length) * 0.4 + state.phase * 0.12

            ctx.strokeStyle = paletteColour(paletteIndex, eHue, eBand + 0.35, 0.65 + eBand * 0.35, tc)
            ctx.lineWidth = 1.5 + eBand * 2.8 + (dimAxis === 3 ? 0.8 : 0.0)
            ctx.beginPath()
            ctx.moveTo(va.x, va.y)
            ctx.lineTo(vb.x, vb.y)
            ctx.stroke()
        }

        // 3. Spectral Dispersion Rays & Vertex Jewels
        for (var vIdx = 0; vIdx < projected.length; vIdx++) {
            var pv = projected[vIdx]
            var vHue = (vIdx / 16.0) + state.phase * 0.14
            if (pv.bVal > 0.25 || state.beatPulse > 0.35) {
                ctx.strokeStyle = paletteColour(paletteIndex, vHue + 0.35, pv.bVal, 0.36, tc)
                ctx.lineWidth = 1.2
                ctx.beginPath()
                ctx.moveTo(pv.x, pv.y)
                ctx.lineTo(pv.x * 1.45, pv.y * 1.45)
                ctx.stroke()
            }
            ctx.fillStyle = paletteColour(paletteIndex, vHue, 0.9, 0.88, tc)
            ctx.beginPath()
            ctx.arc(pv.x, pv.y, 2.6 + pv.bVal * 4.5, 0, Math.PI * 2.0)
            ctx.fill()
        }

        ctx.restore()
    }

    ctx.restore()
}

// ===========================================================================
// MODE 6: VOYAGE 34 SACRED MANDALA
// Multi-ring lotus petals + Metatron geometric web + beat shockwaves.
// ===========================================================================
function drawSacredMandala(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours) {
    var tc = themeColours || {}
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)
    var baseR = minDim * (0.22 + state.bassSmooth * 0.14 + state.beatPulse * 0.05)

    ctx.save()
    ctx.translate(cx, cy)

    var petals = symmetryFolds > 1 ? symmetryFolds * 2 : 16
    for (var layer = 0; layer < 4; layer++) {
        var layerScale = 0.42 + layer * 0.30
        var rot = state.phase * (layer % 2 === 0 ? 0.38 : -0.29)
        ctx.save()
        ctx.rotate(rot)
        ctx.lineWidth = 1.5 + state.bassSmooth * 2.0
        ctx.strokeStyle = paletteColour(paletteIndex, layer * 0.22 + state.phase * 0.07, state.energySmooth + 0.15, 0.58, tc)
        ctx.fillStyle = paletteColour(paletteIndex, layer * 0.22 + 0.12 + state.phase * 0.07, state.energySmooth, 0.10, tc)

        ctx.beginPath()
        for (var p = 0; p <= petals * 4; p++) {
            var a = (p / (petals * 4)) * Math.PI * 2.0
            var bandIdx = (p + layer * 16) % 64
            var bVal = state.smoothBands[bandIdx] || 0.05
            var r = baseR * layerScale * (0.78 + 0.26 * Math.sin(a * petals) + bVal * 0.44)
            var px = Math.cos(a) * r
            var py = Math.sin(a) * r
            if (p === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }

    // Metatron's Cube inner sacred star chord web
    var hexPts = []
    var hexR = baseR * 0.65
    for (var hIdx = 0; hIdx < 12; hIdx++) {
        var ha = (hIdx / 12.0) * Math.PI * 2.0 - state.phase * 0.25
        var hr = (hIdx % 2 === 0) ? hexR : hexR * 0.52
        hexPts.push({ x: Math.cos(ha) * hr, y: Math.sin(ha) * hr })
    }
    for (var i = 0; i < hexPts.length; i++) {
        for (var j = i + 1; j < hexPts.length; j++) {
            if ((j - i) % 2 === 1 || (j - i) === 6) {
                ctx.strokeStyle = paletteColour(paletteIndex, (i + j) / 24.0 + state.phase * 0.08, state.midSmooth, 0.28, tc)
                ctx.lineWidth = 1.0
                ctx.beginPath()
                ctx.moveTo(hexPts[i].x, hexPts[i].y)
                ctx.lineTo(hexPts[j].x, hexPts[j].y)
                ctx.stroke()
            }
        }
    }

    // Shockwave rings from beat detector
    for (var s = 0; s < state.shockwaves.length; s++) {
        var sw = state.shockwaves[s]
        ctx.lineWidth = 1.8 + state.bassSmooth * 2.4
        ctx.strokeStyle = paletteColour(paletteIndex, sw.hue, state.bassSmooth, sw.alpha * 0.65, tc)
        ctx.beginPath()
        ctx.arc(0, 0, sw.radius * minDim * 0.68, 0, Math.PI * 2.0)
        ctx.stroke()
    }

    ctx.restore()
}

// ===========================================================================
// MODE 7: BLACKHOLE SINGULARITY
// Relativistic accretion disc, gravitational lensing arcs, and event horizon.
// ===========================================================================
function drawBlackholeSingularity(ctx, w, h, state, paletteIndex, themeColours) {
    var tc = themeColours || {}
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)
    var horizonR = minDim * (0.09 + state.bassSmooth * 0.04)

    ctx.save()
    ctx.translate(cx, cy)

    // Accretion disc tilted ellipses with Doppler colour shift
    var rings = 28
    for (var r = rings; r >= 1; r--) {
        var frac = r / rings
        var bVal = state.smoothBands[(r * 2) % 64] || 0.05
        var rx = horizonR * 1.15 + frac * minDim * 0.44 * (1.0 + bVal * 0.16)
        var ry = rx * (0.28 + 0.14 * Math.sin(state.phase * 0.35 + frac * 2.0))
        var tilt = -0.32 + Math.sin(state.phase * 0.22) * 0.12
        var hue = frac * 0.75 - state.phase * 0.15 + bVal * 0.3

        ctx.strokeStyle = paletteColour(paletteIndex, hue, bVal + 0.3, (1.0 - frac * 0.65) * 0.68, tc)
        ctx.lineWidth = 1.6 + bVal * 3.5
        ctx.beginPath()
        ctx.ellipse(0, 0, rx, ry, tilt, 0, Math.PI * 2.0)
        ctx.stroke()
    }

    // Gravitational Lensing Photon Ring
    ctx.strokeStyle = paletteColour(paletteIndex, state.phase * 0.15, 0.95, 0.88, tc)
    ctx.lineWidth = 2.4 + state.beatPulse * 2.5
    ctx.beginPath()
    ctx.arc(0, 0, horizonR * 1.08, 0, Math.PI * 2.0)
    ctx.stroke()

    // Event Horizon Shadow
    ctx.fillStyle = "rgba(3, 5, 9, 0.94)"
    ctx.beginPath()
    ctx.arc(0, 0, horizonR, 0, Math.PI * 2.0)
    ctx.fill()

    ctx.restore()
}

// ===========================================================================
// MODE 8: CYBER SYNTHGRID & LASER BEAMS
// Perspective outrun grid, volumetric sweeping spotlight cones, and 64-band skyline.
// ===========================================================================
function drawSynthGridAndBeams(ctx, w, h, state, paletteIndex, themeColours) {
    var tc = themeColours || {}
    var horizon = h * 0.58
    ctx.save()

    // Sweeping Volumetric Laser Cones above horizon
    var beamCount = 6
    for (var b = 0; b < beamCount; b++) {
        var bVal = state.smoothBands[(b * 10) % 64] || 0.05
        var originX = w * ((b + 0.5) / beamCount)
        var sweepAngle = Math.sin(state.phase * (0.9 + b * 0.21) + b * 1.3) * 0.65
        var topX1 = originX + Math.sin(sweepAngle - 0.08 - bVal * 0.08) * h * 0.9
        var topX2 = originX + Math.sin(sweepAngle + 0.08 + bVal * 0.08) * h * 0.9

        ctx.fillStyle = paletteColour(paletteIndex, b / beamCount + state.phase * 0.09, bVal + 0.25, 0.14 + bVal * 0.22, tc)
        ctx.beginPath()
        ctx.moveTo(originX, horizon)
        ctx.lineTo(topX1, 0)
        ctx.lineTo(topX2, 0)
        ctx.closePath()
        ctx.fill()
    }

    ctx.lineWidth = 1.3
    // Perspective horizontal lines
    for (var i = 0; i < 14; i++) {
        var frac = ((i / 14.0) + (state.phase * 0.18) % (1.0 / 14.0))
        var y = horizon + Math.pow(frac, 1.8) * (h - horizon)
        ctx.strokeStyle = paletteColour(paletteIndex, frac + state.phase * 0.06, state.bassSmooth, 0.22 + frac * 0.42, tc)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
    }

    // Perspective radial lines from vanishing point
    var vpX = w * 0.5
    for (var k = -12; k <= 12; k++) {
        var band = state.smoothBands[(k + 12) * 2 % 64] || 0.05
        ctx.strokeStyle = paletteColour(paletteIndex, (k + 12) / 24.0 + state.phase * 0.05, band, 0.24 + band * 0.42, tc)
        ctx.beginPath()
        ctx.moveTo(vpX, horizon)
        ctx.lineTo(vpX + k * (w * 0.09), h)
        ctx.stroke()
    }

    // Horizon 64-bar Cava spectrum skyline
    var barW = w / 64.0
    for (var s = 0; s < 64; s++) {
        var val = state.smoothBands[s] || 0.04
        var barH = val * (h * 0.28)
        ctx.fillStyle = paletteColour(paletteIndex, s / 64.0 + state.phase * 0.08, val, 0.62, tc)
        ctx.fillRect(s * barW + 1, horizon - barH, Math.max(1.5, barW - 2), barH)
    }

    ctx.restore()
}

// ===========================================================================
// MODE 9: VHS GLITCH & MATRIX RAIN + ORBITING GLYPH SWARM
// ===========================================================================
function drawMatrixRainAndParticles(ctx, w, h, state, paletteIndex, mode, themeColours) {
    var tc = themeColours || {}
    ctx.save()

    if (mode === 9) {
        // Full Cyber Matrix cascading glyph rain + VHS scanline glitch bars
        ctx.font = "bold 13px 'JetBrainsMono Nerd Font', monospace"
        var nCols = 52
        var colStep = w / nCols
        for (var c = 0; c < nCols; c++) {
            var rc = state.rainColumns[c % state.rainColumns.length]
            var band = state.smoothBands[c % 64] || 0.05
            rc.y = (rc.y + (0.005 + band * 0.022) * rc.speed) % 1.18
            var headY = rc.y * h
            for (var k = 0; k < rc.len; k++) {
                var gy = headY - k * 15
                if (gy < 0 || gy > h) continue
                var g = MATRIX_GLYPHS[(c + k + Math.floor(state.phase * 9)) % MATRIX_GLYPHS.length]
                var a = (1.0 - k / rc.len) * (0.35 + band * 0.58)
                var hue = (c / nCols) * 0.5 + (k === 0 ? 0.35 : 0.0) + state.phase * 0.06
                ctx.fillStyle = paletteColour(paletteIndex, hue, band + (k === 0 ? 0.45 : 0.1), a, tc)
                ctx.fillText(g, c * colStep + 6, gy)
            }
        }

        // VHS tracking glitch slices on bass beats
        for (var s = 0; s < 6; s++) {
            var gBand = state.smoothBands[(s * 11) % 64] || 0.05
            if (gBand > 0.24 || state.beatPulse > 0.3) {
                var sliceY = ((pseudoRandom(state.phase + s * 3.7) * h) % h)
                var sliceH = 4 + gBand * 24
                ctx.fillStyle = paletteColour(paletteIndex, s * 0.19 + state.phase * 0.2, 0.9, 0.18 + state.beatPulse * 0.2, tc)
                ctx.fillRect(0, sliceY, w, sliceH)
            }
        }
    } else {
        // Subtle multi-coloured cosmic dust / particle field
        var cx = w * 0.5
        var cy = h * 0.5
        var maxR = Math.hypot(cx, cy)
        var count = (mode === 10) ? state.particles.length : 55
        for (var i = 0; i < count; i++) {
            var pt = state.particles[i]
            var bVal = state.smoothBands[pt.band] || 0.05
            pt.angle += (0.004 + bVal * 0.022) * pt.speed * (mode === 7 ? -1.4 : 1.0)
            pt.radius += (0.002 + state.energySmooth * 0.007) * pt.speed * (mode === 7 ? -1.0 : 1.0)
            if (pt.radius > 1.0) pt.radius = 0.04
            if (pt.radius < 0.03) pt.radius = 0.98

            var px = cx + Math.cos(pt.angle) * (pt.radius * maxR)
            var py = cy + Math.sin(pt.angle + pt.orbitTilt) * (pt.radius * maxR * 0.78)
            ctx.fillStyle = paletteColour(paletteIndex, pt.radius + pt.hueOffset + state.phase * 0.08, bVal, 0.32 + bVal * 0.48, tc)
            ctx.beginPath()
            ctx.arc(px, py, pt.size * (0.7 + bVal * 0.9), 0, Math.PI * 2.0)
            ctx.fill()
        }
    }

    ctx.restore()
}

// ===========================================================================
// MODE 10 (AND OPTIONAL OVERLAY): OMARCHY TTE / ALBUM ART ASCII MATRIX
// Manipulates transcoded album art (`omarchy-transcode-ascii` Braille/Block)
// or `omarchy-ascii` banner + `/usr/bin/ttfx` frames when selected as Mode 10
// OR when `useAlbumArt` is toggled ON.
// ===========================================================================
function mutateGlyph(ch, intensity, asciiMode, phase, row, col) {
    if (!ch || ch === " " || ch === "⠀") {
        if (intensity > 0.78 && ((row + col) % 7 === 0)) {
            return asciiMode === "block" ? "░" : "⠁"
        }
        return ""
    }
    if (intensity > 0.82 && Math.sin(phase * 6.0 + row * 0.7 + col * 0.5) > 0.55) {
        if (asciiMode === "block") {
            return BLOCK_RAMP[Math.min(BLOCK_RAMP.length - 1, Math.floor(intensity * BLOCK_RAMP.length))]
        }
        return BRAILLE_RAMP[Math.min(BRAILLE_RAMP.length - 1, Math.floor(intensity * BRAILLE_RAMP.length))]
    }
    return ch
}

function drawAsciiMatrix(ctx, w, h, state, paletteIndex, mode, asciiLines, ttfxFrames, asciiMode, isOverlay, themeColours) {
    if (!asciiLines || asciiLines.length === 0) return

    var ttfxLines = null
    if (ttfxFrames && ttfxFrames.length > 0) {
        var totalF = ttfxFrames.length
        var minF = Math.min(totalF - 1, Math.floor(totalF * 0.22))
        var span = Math.max(1, totalF - minF)
        var cyc = Math.floor(state.ttfxCursor || 0) % Math.max(1, span * 2 - 2)
        var offset = cyc < span ? cyc : (span * 2 - 2 - cyc)
        ttfxLines = ttfxFrames[minF + offset] || null
    }

    var rows = asciiLines.length
    var cols = 0
    for (var r = 0; r < rows; r++) {
        if (asciiLines[r] && asciiLines[r].length > cols) {
            cols = asciiLines[r].length
        }
    }
    if (cols === 0) return

    var areaW = w * 0.80
    var areaH = h * 0.74
    var cellW = areaW / cols
    var cellH = areaH / rows
    var fontSize = clamp(Math.floor(Math.min(cellW * 1.65, cellH * 0.95)), 8, 28)

    ctx.save()
    ctx.font = "bold " + fontSize + "px 'JetBrainsMono Nerd Font', 'JetBrains Mono', monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    var startX = (w - cols * cellW) * 0.5
    var startY = (h - rows * cellH) * 0.5
    var cx = w * 0.5
    var cy = h * 0.5
    var maxDist = Math.hypot(cols * cellW * 0.5, rows * cellH * 0.5) || 1.0
    var tc = themeColours || {}
    var alphaScale = isOverlay ? 0.76 : 1.0

    for (var row = 0; row < rows; row++) {
        var line = asciiLines[row] || ""
        var tLine = (ttfxLines && row < ttfxLines.length) ? (ttfxLines[row] || "") : ""
        var normY = rows > 1 ? (row / (rows - 1)) : 0.5

        for (var col = 0; col < cols; col++) {
            var baseCh = col < line.length ? line.charAt(col) : " "
            var ttfxCh = col < tLine.length ? tLine.charAt(col) : " "
            var hasTtfx = ttfxCh && ttfxCh !== " " && ttfxCh !== "⠀"
            var rawCh = hasTtfx ? ttfxCh : baseCh
            var bandIdx = (col + row * 2) % 64
            var bandVal = state.smoothBands[bandIdx] || 0.05
            var ch = mutateGlyph(rawCh, bandVal + state.beatPulse * 0.35, asciiMode, state.phase, row, col)
            if (!ch) continue

            var baseX = startX + (col + 0.5) * cellW
            var baseY = startY + (row + 0.5) * cellH
            var dx = baseX - cx
            var dy = baseY - cy
            var dist = Math.hypot(dx, dy)
            var normDist = dist / maxDist
            var angle = Math.atan2(dy, dx)

            var drawX = baseX
            var drawY = baseY
            var hueT = (col / cols) * 0.55 + (row / rows) * 0.35 + state.phase * 0.09 + bandVal * 0.35
            var alpha = clamp(((hasTtfx ? 0.58 : 0.38) + bandVal * 0.52 + state.beatPulse * 0.18) * alphaScale, 0.18, 1.0)

            if (mode === 1 || mode === 7) {
                // Swirl / Blackhole vortex distortion
                var swirl = (1.0 - clamp(normDist, 0.0, 1.0)) * (0.45 + state.bassSmooth * 1.65)
                var rotAngle = angle + swirl * Math.sin(state.phase * 1.4 + normDist * 4.0)
                drawX = cx + Math.cos(rotAngle) * dist
                drawY = cy + Math.sin(rotAngle) * dist
                hueT = normDist + state.phase * 0.14 + bandVal * 0.4
            } else if (mode === 3) {
                // Space-Time gravity well depression
                var wellPull = 1.0 - 0.28 * Math.exp(-normDist * normDist * 4.5) * (0.5 + state.bassSmooth)
                drawX = cx + dx * wellPull
                drawY = cy + dy * wellPull + Math.sin(col * 0.25 - state.phase * 3.0) * (bandVal * 12.0)
            } else if (mode === 6) {
                // Mandala radial ripple
                var ringWave = Math.sin(normDist * 14.0 - state.phase * 4.2)
                var radialPush = ringWave * (3.0 + state.bassSmooth * 16.0 + bandVal * 8.0)
                drawX += Math.cos(angle) * radialPush
                drawY += Math.sin(angle) * radialPush
                hueT = normDist * 1.2 - state.phase * 0.15
            } else if (mode === 9) {
                // VHS Glitch horizontal tear
                var glitchBand = state.smoothBands[(row * 2) % 64] || 0.0
                if (glitchBand > 0.28 || state.beatPulse > 0.4) {
                    drawX += Math.sin(state.phase * 18.0 + row * 1.9) * (glitchBand * 22.0 + state.beatPulse * 14.0)
                }
            } else {
                // Multi-dimensional harmonic wave + breathing
                var waveY = Math.sin(col * 0.26 - state.phase * 3.4 + row * 0.14) * (4.0 + state.bassSmooth * 16.0 + bandVal * 9.0)
                var waveX = Math.cos(row * 0.31 + state.phase * 2.2) * (2.5 + state.midSmooth * 9.0)
                drawX += waveX
                drawY += waveY
            }

            ctx.fillStyle = paletteColour(paletteIndex, hueT, bandVal + state.beatPulse * 0.3, alpha, tc)
            ctx.fillText(ch, drawX, drawY)
        }
    }

    ctx.restore()
}

// ===========================================================================
// MAIN FRAME DISPATCHER
// ===========================================================================
function renderFrame(ctx, w, h, state, rawBands, options) {
    if (w <= 0 || h <= 0) return
    var opts = options || {}
    var playing = opts.playing !== undefined ? Boolean(opts.playing) : true
    var mode = ((opts.mode || 0) % MODE_NAMES.length + MODE_NAMES.length) % MODE_NAMES.length
    var paletteIndex = ((opts.palette || 0) % PALETTE_NAMES.length + PALETTE_NAMES.length) % PALETTE_NAMES.length
    var sensitivity = opts.sensitivity || 1.0
    var symmetryFolds = opts.symmetryFolds || 1
    var asciiLines = opts.asciiLines || []
    var ttfxFrames = opts.ttfxFrames || []
    var asciiMode = opts.asciiMode || "braille"
    // Album art overlay is NOT fixed on top of everything; it is off by default
    // unless explicitly enabled (`useAlbumArt: true`) or when Mode 10 is selected.
    var useAlbumArt = opts.useAlbumArt !== undefined ? Boolean(opts.useAlbumArt) : false
    var themeColours = opts.themeColours || {}

    stepAudio(state, rawBands, playing, sensitivity)

    // 1. Deep audio-reactive backdrop
    drawBackdrop(ctx, w, h, state, paletteIndex, themeColours)

    // 2. Render active psychedelic visual mode
    if (mode === 0) {
        drawJuliaAndFractals(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours)
        drawMatrixRainAndParticles(ctx, w, h, state, paletteIndex, mode, themeColours)
    } else if (mode === 1) {
        drawHyperspaceSwirls(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours)
        drawMatrixRainAndParticles(ctx, w, h, state, paletteIndex, mode, themeColours)
    } else if (mode === 2) {
        drawRandomisedShapesAndKaleidoscope(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours)
        drawMatrixRainAndParticles(ctx, w, h, state, paletteIndex, mode, themeColours)
    } else if (mode === 3) {
        drawSpaceTimeWarpLandscape(ctx, w, h, state, paletteIndex, themeColours)
    } else if (mode === 4) {
        drawAlienBioluminescence(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours)
    } else if (mode === 5) {
        drawCrystalHypercube(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours)
        drawMatrixRainAndParticles(ctx, w, h, state, paletteIndex, mode, themeColours)
    } else if (mode === 6) {
        drawSacredMandala(ctx, w, h, state, paletteIndex, symmetryFolds, themeColours)
        drawMatrixRainAndParticles(ctx, w, h, state, paletteIndex, mode, themeColours)
    } else if (mode === 7) {
        drawBlackholeSingularity(ctx, w, h, state, paletteIndex, themeColours)
        drawMatrixRainAndParticles(ctx, w, h, state, paletteIndex, mode, themeColours)
    } else if (mode === 8) {
        drawSynthGridAndBeams(ctx, w, h, state, paletteIndex, themeColours)
    } else if (mode === 9) {
        drawMatrixRainAndParticles(ctx, w, h, state, paletteIndex, mode, themeColours)
    } else if (mode === 10) {
        // Dedicated Omarchy TTE / Album Art ASCII Matrix Mode
        drawMatrixRainAndParticles(ctx, w, h, state, paletteIndex, mode, themeColours)
        drawAsciiMatrix(ctx, w, h, state, paletteIndex, mode, asciiLines, ttfxFrames, asciiMode, false, themeColours)
    } else {
        // Mode 11: Cosmic Chimera Overdrive (multi-layered mind-bending fusion)
        var chimeraFolds = Math.min(6, Math.max(4, symmetryFolds))
        drawSpaceTimeWarpLandscape(ctx, w, h, state, paletteIndex, themeColours)
        drawHyperspaceSwirls(ctx, w, h, state, paletteIndex, chimeraFolds, themeColours)
        drawRandomisedShapesAndKaleidoscope(ctx, w, h, state, paletteIndex, chimeraFolds, themeColours)
        drawAlienBioluminescence(ctx, w, h, state, paletteIndex, Math.min(4, chimeraFolds), themeColours)
    }

    // 3. Optional Album Art / TTE ASCII overlay when explicitly toggled ON in other modes
    if (useAlbumArt && mode !== 10) {
        drawAsciiMatrix(ctx, w, h, state, paletteIndex, mode, asciiLines, ttfxFrames, asciiMode, true, themeColours)
    }
}
