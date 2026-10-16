.pragma library

// PsychedelicEngine.js — 60 FPS Audio-Reactive Omarchy TTE Character Matrix &
// Sacred Geometry Visualiser Engine for Bandarchy.
//
// Combines the Omarchy screensaver paradigm (TerminalTextEffects / `ttfx`
// character matrix effects: waves, blackhole, beams, rings, vhstape, matrix,
// synthgrid, colorshift) with album cover art transcoded via
// `omarchy-transcode-ascii` (Braille or Block glyphs) or `omarchy-ascii`
// (Delta Corps Priest 1 banner), manipulated live by 64-band Cava spectrum data.

var MODE_NAMES = [
    "TTE Waves & ColourShift",
    "TTE Blackhole Vortex",
    "TTE Beams & SynthGrid",
    "TTE Rings & Mandala",
    "TTE VHS Glitch & Matrix",
    "Voyage 34 Sacred Hybrid"
]

var PALETTE_NAMES = [
    "Omarchy Screensaver",
    "Voyage 34 LSD",
    "Aeterna Nebula",
    "Solar Flare",
    "Bioluminescence"
]

var BRAILLE_RAMP = ["⠀", "⠁", "⠃", "⠇", "⠏", "⠟", "⠿", "⡿", "⣿"]
var BLOCK_RAMP = [" ", "░", "▒", "▓", "▄", "▀", "█"]
var MATRIX_GLYPHS = ["0", "1", "◈", "◇", "⟡", "⟐", "∆", "∇", "░", "▒", "▓", "█", "⣿", "⡿", "⠿"]

function createState() {
    var particles = []
    for (var i = 0; i < 120; i++) {
        particles.push({
            angle: (i / 120.0) * Math.PI * 2.0,
            radius: 0.05 + ((i * 73) % 100) / 105.0,
            speed: 0.25 + ((i * 31) % 60) / 120.0,
            size: 1.4 + (i % 4) * 0.9,
            band: i % 64,
            orbitTilt: ((i % 9) - 4) * 0.11,
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
        bassSmooth: 0.08,
        midSmooth: 0.06,
        highSmooth: 0.05,
        energySmooth: 0.07,
        beatPulse: 0.0,
        beatCooldown: 0,
        shockwaves: [],
        particles: particles,
        rings: rings,
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
    var p = (paletteIndex || 0) % PALETTE_NAMES.length
    var tc = themeColours || {}
    var accent = hexToRgb(tc.accent, { r: 110, g: 231, b: 183 })
    var urgent = hexToRgb(tc.urgent, { r: 244, g: 114, b: 182 })
    var fg = hexToRgb(tc.foreground, { r: 226, g: 232, b: 240 })

    if (p === 0) {
        // Omarchy Screensaver palette: theme background -> accent -> foreground -> urgent on peaks
        var cycle = ((t % 1.0) + 1.0) % 1.0
        var base = cycle < 0.5
            ? lerpRgb(accent, fg, cycle * 2.0)
            : lerpRgb(fg, urgent, (cycle - 0.5) * 2.0)
        var boosted = lerpRgb(base, fg, clamp(energy * 0.45, 0.0, 0.65))
        return rgbaObj(boosted, alpha)
    }

    var hue = 0.0
    var sat = 0.90
    var lit = clamp(0.46 + energy * 0.28, 0.22, 0.88)
    if (p === 1) {
        // Voyage 34 LSD: emerald -> cyan -> magenta -> acid gold
        hue = (t * 0.85 + energy * 0.22) % 1.0
        sat = 0.95
    } else if (p === 2) {
        // Aeterna Nebula: indigo -> violet -> rose -> teal
        hue = (0.58 + Math.sin(t * Math.PI * 2.0) * 0.22 + energy * 0.14) % 1.0
        sat = 0.88
    } else if (p === 3) {
        // Solar Flare: crimson -> amber -> white gold -> violet
        hue = (0.96 + t * 0.22 + energy * 0.10) % 1.0
        sat = 0.94
    } else {
        // Bioluminescence: abyssal cyan -> seafoam -> electric lime
        hue = (0.34 + Math.sin(t * Math.PI * 2.0) * 0.14 + energy * 0.10) % 1.0
        sat = 0.90
    }
    var rgb = hslToRgb(hue, sat, lit)
    return rgbaObj(rgb, alpha)
}

function stepAudio(state, rawBands, playing, sensitivity) {
    var sens = clamp(sensitivity || 1.0, 0.25, 3.0)
    var n = 64
    var bassSum = 0.0
    var midSum = 0.0
    var highSum = 0.0

    for (var i = 0; i < n; i++) {
        var raw = (rawBands && i < rawBands.length) ? (Number(rawBands[i]) || 0.0) : 0.0
        var target = clamp((raw / 1000.0) * sens, 0.0, 1.0)
        if (!playing && target < 0.02) {
            target = 0.04 + 0.03 * Math.sin(state.phase * 1.6 + i * 0.21)
        }
        var prev = state.smoothBands[i] || 0.0
        var rate = target > prev ? 0.45 : 0.16
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

    if (bass > state.bassSmooth * 1.26 && bass > 0.18 && state.beatCooldown <= 0) {
        state.beatPulse = 1.0
        state.beatCooldown = 9
        state.shockwaves.push({
            radius: 0.02,
            alpha: clamp(0.55 + bass * 0.45, 0.4, 1.0),
            speed: 0.016 + bass * 0.024,
            hue: (state.phase * 0.17) % 1.0
        })
        if (state.shockwaves.length > 10) {
            state.shockwaves.shift()
        }
    } else {
        state.beatPulse *= 0.86
        if (state.beatCooldown > 0) state.beatCooldown--
    }

    state.bassSmooth = state.bassSmooth * 0.78 + bass * 0.22
    state.midSmooth = state.midSmooth * 0.80 + mid * 0.20
    state.highSmooth = state.highSmooth * 0.80 + high * 0.20
    state.energySmooth = state.energySmooth * 0.80 + energy * 0.20
    state.phase += 0.018 + state.energySmooth * 0.052
    state.ttfxCursor = (state.ttfxCursor || 0.0) + 0.08 + state.energySmooth * 0.48 + state.beatPulse * 0.32

    for (var s = state.shockwaves.length - 1; s >= 0; s--) {
        state.shockwaves[s].radius += state.shockwaves[s].speed
        state.shockwaves[s].alpha *= 0.955
        if (state.shockwaves[s].alpha < 0.03 || state.shockwaves[s].radius > 1.35) {
            state.shockwaves.splice(s, 1)
        }
    }
}

function mutateGlyph(ch, intensity, asciiMode, phase, row, col) {
    if (!ch || ch === " " || ch === "⠀") {
        if (intensity > 0.76 && ((row + col) % 7 === 0)) {
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

function drawBackdrop(ctx, w, h, state, paletteIndex, themeColours) {
    var tc = themeColours || {}
    var bgRgb = hexToRgb(tc.background, { r: 7, g: 9, b: 14 })
    ctx.fillStyle = rgbaObj(bgRgb, 0.30)
    ctx.fillRect(0, 0, w, h)

    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.hypot(cx, cy)
    var grad = ctx.createRadialGradient(
        cx, cy, maxR * 0.02,
        cx, cy, maxR * (0.65 + state.bassSmooth * 0.35)
    )
    grad.addColorStop(0.0, paletteColour(paletteIndex, state.phase * 0.09, state.bassSmooth, 0.16 + state.beatPulse * 0.12, tc))
    grad.addColorStop(0.55, paletteColour(paletteIndex, state.phase * 0.09 + 0.33, state.midSmooth, 0.07, tc))
    grad.addColorStop(1.0, rgbaObj(bgRgb, 0.0))
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)
}

// Core Omarchy Screensaver TTE Character Matrix Renderer:
// Takes the transcoded album cover art (or Omarchy ASCII banner) lines plus
// genuine `/usr/bin/ttfx` animation frames and manipulates every glyph cell
// in real time according to the active TTE mode and 64-band Cava audio spectrum.
function drawAsciiMatrix(ctx, w, h, state, paletteIndex, mode, asciiLines, ttfxFrames, asciiMode, useAlbumArt, themeColours) {
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

    var areaW = w * (useAlbumArt ? 0.78 : 0.84)
    var areaH = h * (useAlbumArt ? 0.72 : 0.48)
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

    // Optional subtle framing box in Omarchy style
    var tc = themeColours || {}
    ctx.strokeStyle = paletteColour(paletteIndex, state.phase * 0.05, state.bassSmooth, 0.22, tc)
    ctx.lineWidth = 1.0
    ctx.strokeRect(startX - 10, startY - 10, cols * cellW + 20, rows * cellH + 20)

    // Precompute beam positions for Mode 2 (TTE Beams & Spotlights)
    var beamX1 = ((Math.sin(state.phase * 1.3) + 1.0) * 0.5) * cols
    var beamY1 = ((Math.cos(state.phase * 0.9) + 1.0) * 0.5) * rows
    var spotX = cols * 0.5 + Math.cos(state.phase * 1.7) * cols * 0.32
    var spotY = rows * 0.5 + Math.sin(state.phase * 1.4) * rows * 0.32

    for (var row = 0; row < rows; row++) {
        var line = asciiLines[row] || ""
        var tLine = (ttfxLines && row < ttfxLines.length) ? (ttfxLines[row] || "") : ""
        var normY = rows > 1 ? (row / (rows - 1)) : 0.5
        // Horizontal VHS glitch offset for Mode 4
        var rowGlitch = 0.0
        if (mode === 4) {
            var glitchBand = state.smoothBands[(row * 2) % 64] || 0.0
            if (glitchBand > 0.32 || state.beatPulse > 0.4) {
                rowGlitch = Math.sin(state.phase * 18.0 + row * 1.9) * (glitchBand * 22.0 + state.beatPulse * 14.0)
            }
        }

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
            var hueT = (col / cols) * 0.5 + (row / rows) * 0.3 + state.phase * 0.08
            var alpha = clamp((hasTtfx ? 0.56 : 0.32) + bandVal * 0.52 + state.beatPulse * 0.18, 0.22, 1.0)
            if (hasTtfx && ttfxCh !== baseCh) {
                hueT += 0.22
            }

            if (mode === 0) {
                // Mode 0: TTE Waves & ColourShift
                var waveY = Math.sin(col * 0.26 - state.phase * 3.4 + row * 0.12) * (4.0 + state.bassSmooth * 18.0 + bandVal * 10.0)
                var waveX = Math.cos(row * 0.31 + state.phase * 2.2) * (2.0 + state.midSmooth * 9.0)
                drawX += waveX
                drawY += waveY
                hueT = (col / cols) + Math.sin(state.phase * 0.8 + row * 0.15) * 0.25 + bandVal * 0.35
            } else if (mode === 1) {
                // Mode 1: TTE Blackhole Vortex
                var swirl = (1.0 - clamp(normDist, 0.0, 1.0)) * (0.35 + state.bassSmooth * 1.65 + state.beatPulse * 0.8)
                var pull = 1.0 - Math.sin(state.phase * 1.8) * 0.18 * state.bassSmooth + state.beatPulse * 0.22
                var rotAngle = angle + swirl * Math.sin(state.phase * 1.2 + normDist * 4.0)
                drawX = cx + Math.cos(rotAngle) * dist * pull
                drawY = cy + Math.sin(rotAngle) * dist * pull
                hueT = normDist + state.phase * 0.14 + bandVal * 0.4
            } else if (mode === 2) {
                // Mode 2: TTE Beams & SynthGrid
                var dBeamCol = Math.abs(col - beamX1)
                var dBeamRow = Math.abs(row - beamY1)
                var dSpot = Math.hypot(col - spotX, row - spotY)
                var beamBoost = Math.max(
                    clamp(1.0 - dBeamCol / 4.5, 0.0, 1.0),
                    clamp(1.0 - dBeamRow / 3.0, 0.0, 1.0),
                    clamp(1.0 - dSpot / 9.0, 0.0, 1.0)
                )
                drawY -= beamBoost * (4.0 + bandVal * 12.0)
                alpha = clamp(0.32 + beamBoost * 0.68 + bandVal * 0.45, 0.25, 1.0)
                hueT = (col / cols) * 0.4 + beamBoost * 0.45 + state.phase * 0.1
            } else if (mode === 3) {
                // Mode 3: TTE Rings & Mandala
                var ringWave = Math.sin(normDist * 14.0 - state.phase * 4.2)
                var radialPush = ringWave * (3.0 + state.bassSmooth * 16.0 + bandVal * 8.0)
                drawX += Math.cos(angle) * radialPush
                drawY += Math.sin(angle) * radialPush
                hueT = normDist * 1.2 - state.phase * 0.15 + (ringWave * 0.15)
                alpha = clamp(0.45 + (ringWave + 1.0) * 0.26 + bandVal * 0.3, 0.28, 1.0)
            } else if (mode === 4) {
                // Mode 4: TTE VHS Glitch & Matrix
                drawX += rowGlitch
                // Chromatic split ghost on strong beats
                if (Math.abs(rowGlitch) > 4.0) {
                    ctx.fillStyle = paletteColour(paletteIndex, hueT + 0.45, 0.9, 0.42, tc)
                    ctx.fillText(ch, drawX - 4.5, drawY)
                }
                hueT = normY * 0.6 + state.phase * 0.12 + bandVal * 0.3
            } else {
                // Mode 5: Voyage 34 Sacred Hybrid
                var breathe = 1.0 + Math.sin(state.phase * 2.0 + normDist * 5.0) * (0.04 + state.bassSmooth * 0.14)
                drawX = cx + dx * breathe
                drawY = cy + dy * breathe + Math.sin(col * 0.3 + state.phase * 2.6) * (bandVal * 7.0)
                hueT = (angle / (Math.PI * 2.0)) + normDist * 0.5 + state.phase * 0.1
            }

            ctx.fillStyle = paletteColour(paletteIndex, hueT, bandVal + state.beatPulse * 0.3, alpha, tc)
            ctx.fillText(ch, drawX, drawY)
        }
    }

    ctx.restore()
}

function drawSynthGridAndBeams(ctx, w, h, state, paletteIndex, themeColours) {
    var tc = themeColours || {}
    var horizon = h * 0.64
    ctx.save()
    ctx.lineWidth = 1.2

    // Perspective horizontal lines
    for (var i = 0; i < 12; i++) {
        var frac = ((i / 12.0) + (state.phase * 0.18) % (1.0 / 12.0))
        var y = horizon + Math.pow(frac, 1.8) * (h - horizon)
        ctx.strokeStyle = paletteColour(paletteIndex, frac + state.phase * 0.06, state.bassSmooth, 0.18 + frac * 0.32, tc)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
    }

    // Perspective radial lines from vanishing point
    var vpX = w * 0.5
    for (var k = -10; k <= 10; k++) {
        var band = state.smoothBands[(k + 10) * 3 % 64] || 0.05
        ctx.strokeStyle = paletteColour(paletteIndex, (k + 10) / 20.0 + state.phase * 0.05, band, 0.22 + band * 0.35, tc)
        ctx.beginPath()
        ctx.moveTo(vpX, horizon)
        ctx.lineTo(vpX + k * (w * 0.095), h)
        ctx.stroke()
    }

    // Bottom 64-bar Cava spectrum skyline
    var barW = w / 64.0
    for (var b = 0; b < 64; b++) {
        var val = state.smoothBands[b] || 0.04
        var barH = val * (h * 0.22)
        ctx.fillStyle = paletteColour(paletteIndex, b / 64.0 + state.phase * 0.08, val, 0.42, tc)
        ctx.fillRect(b * barW + 1, h - barH, Math.max(1.5, barW - 2), barH)
    }

    ctx.restore()
}

function drawSacredMandala(ctx, w, h, state, paletteIndex, themeColours) {
    var tc = themeColours || {}
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)
    var baseR = minDim * (0.20 + state.bassSmooth * 0.14 + state.beatPulse * 0.04)

    ctx.save()
    ctx.translate(cx, cy)

    var petals = 16
    for (var layer = 0; layer < 3; layer++) {
        var layerScale = 0.55 + layer * 0.34
        var rot = state.phase * (layer % 2 === 0 ? 0.38 : -0.29)
        ctx.save()
        ctx.rotate(rot)
        ctx.lineWidth = 1.4 + state.bassSmooth * 1.8
        ctx.strokeStyle = paletteColour(paletteIndex, layer * 0.25 + state.phase * 0.07, state.energySmooth, 0.34, tc)

        ctx.beginPath()
        for (var p = 0; p <= petals * 4; p++) {
            var a = (p / (petals * 4)) * Math.PI * 2.0
            var bandIdx = (p + layer * 16) % 64
            var bVal = state.smoothBands[bandIdx] || 0.05
            var r = baseR * layerScale * (0.78 + 0.26 * Math.sin(a * petals) + bVal * 0.42)
            var px = Math.cos(a) * r
            var py = Math.sin(a) * r
            if (p === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
    }

    // Shockwave rings from beat detector
    for (var s = 0; s < state.shockwaves.length; s++) {
        var sw = state.shockwaves[s]
        ctx.lineWidth = 1.8 + state.bassSmooth * 2.2
        ctx.strokeStyle = paletteColour(paletteIndex, sw.hue, state.bassSmooth, sw.alpha * 0.55, tc)
        ctx.beginPath()
        ctx.arc(0, 0, sw.radius * minDim * 0.65, 0, Math.PI * 2.0)
        ctx.stroke()
    }

    ctx.restore()
}

function drawMatrixRainAndParticles(ctx, w, h, state, paletteIndex, mode, themeColours) {
    var tc = themeColours || {}
    ctx.save()

    if (mode === 4) {
        // Matrix cascading glyph rain in background
        ctx.font = "12px 'JetBrainsMono Nerd Font', monospace"
        var nCols = 48
        var colStep = w / nCols
        for (var c = 0; c < nCols; c++) {
            var rc = state.rainColumns[c]
            var band = state.smoothBands[c % 64] || 0.05
            rc.y = (rc.y + (0.004 + band * 0.018) * rc.speed) % 1.15
            var headY = rc.y * h
            for (var k = 0; k < rc.len; k++) {
                var gy = headY - k * 14
                if (gy < 0 || gy > h) continue
                var g = MATRIX_GLYPHS[(c + k + Math.floor(state.phase * 8)) % MATRIX_GLYPHS.length]
                var a = (1.0 - k / rc.len) * (0.25 + band * 0.45)
                ctx.fillStyle = paletteColour(paletteIndex, c / nCols + state.phase * 0.05, band, a, tc)
                ctx.fillText(g, c * colStep + 6, gy)
            }
        }
    } else {
        // Orbiting TTE glyph swarm particles
        var cx = w * 0.5
        var cy = h * 0.5
        var maxR = Math.hypot(cx, cy)
        ctx.font = "11px 'JetBrainsMono Nerd Font', monospace"
        for (var i = 0; i < state.particles.length; i++) {
            var pt = state.particles[i]
            var bVal = state.smoothBands[pt.band] || 0.05
            pt.angle += (0.005 + bVal * 0.025) * pt.speed * (mode === 1 ? -1.4 : 1.0)
            pt.radius += (0.002 + state.energySmooth * 0.008) * pt.speed * (mode === 1 ? -1.0 : 1.0)
            if (pt.radius > 1.0) pt.radius = 0.04
            if (pt.radius < 0.03) pt.radius = 0.98

            var px = cx + Math.cos(pt.angle) * (pt.radius * maxR)
            var py = cy + Math.sin(pt.angle + pt.orbitTilt) * (pt.radius * maxR * 0.78)
            ctx.fillStyle = paletteColour(paletteIndex, pt.radius + state.phase * 0.08, bVal, 0.35 + bVal * 0.5, tc)
            ctx.fillText(pt.glyph, px, py)
        }
    }

    ctx.restore()
}

function renderFrame(ctx, w, h, state, rawBands, options) {
    if (w <= 0 || h <= 0) return
    var opts = options || {}
    var playing = opts.playing !== undefined ? Boolean(opts.playing) : true
    var mode = (opts.mode || 0) % MODE_NAMES.length
    var paletteIndex = (opts.palette || 0) % PALETTE_NAMES.length
    var sensitivity = opts.sensitivity || 1.0
    var asciiLines = opts.asciiLines || []
    var ttfxFrames = opts.ttfxFrames || []
    var asciiMode = opts.asciiMode || "braille"
    var useAlbumArt = opts.useAlbumArt !== undefined ? Boolean(opts.useAlbumArt) : true
    var themeColours = opts.themeColours || {}

    stepAudio(state, rawBands, playing, sensitivity)

    // 1. Deep Omarchy theme backdrop with bass-reactive radial aura
    drawBackdrop(ctx, w, h, state, paletteIndex, themeColours)

    // 2. Background geometric / synthgrid / matrix rain layer
    if (mode === 2) {
        drawSynthGridAndBeams(ctx, w, h, state, paletteIndex, themeColours)
    } else if (mode === 3 || mode === 5) {
        drawSacredMandala(ctx, w, h, state, paletteIndex, themeColours)
    }

    drawMatrixRainAndParticles(ctx, w, h, state, paletteIndex, mode, themeColours)

    // 3. Foreground Omarchy TTE Character Matrix (manipulating the transcoded
    //    album cover art or Omarchy Delta Corps Priest 1 ASCII banner in real time)
    drawAsciiMatrix(
        ctx, w, h, state,
        paletteIndex, mode,
        asciiLines, ttfxFrames, asciiMode, useAlbumArt,
        themeColours
    )
}
