import QtQuick
import QtQuick.Layouts
import "PsychedelicEngine.js" as Engine

// Visualiser.qml — 4-Stage Deck & 3-Layer Configurable Audio-Reactive
// Psychedelic Visualiser for Bandarchy (`io.github.layolayo.bandarchy`).
//
// Supports 4 Stage Modes:
//   - "off"        : Stage collapsed / hidden
//   - "art"        : Clean high-resolution Album Art stage with ambient aura
//   - "turntable"  : Upgraded interactive Audiophile Turntable / Record Player (Vinyl.qml)
//   - "visualiser" : 3-Layer VSync-Locked 60 FPS Psychedelic & Nightclub Visualiser
//
// Strict Layer Isolation:
//   - Layer #1 (Background & SynthGrid Equaliser, 6 modes), Layer #2 (Psychedelic
//     Visualiser, 12 modes + 3D Graded History Tracers), and Layer #3 (Braille/Block
//     Album Art & Laser-Stipple Song Words Dismantle/Rebuild, 6 modes) are 100%
//     independent. Changing an effect or parameter in one layer NEVER enables
//     another layer that was switched off.

FocusScope {
    id: root
    focus: true

    property var bands: []
    property bool playing: false
    property string trackTitle: ""
    property string trackArtist: ""
    property string trackAlbum: ""
    property string artPath: ""
    property string playSource: "local"
    property real position: 0.0
    property real duration: 0.0

    // Stage mode: "off", "art", "turntable", "visualiser"
    property string stageMode: "visualiser"

    // Omarchy screensaver / ASCII album art & song words properties
    property var asciiLines: []
    property var bannerLines: []
    property var artLines: []
    property var ttfxFrames: []
    property bool useAlbumArt: true
    property string asciiMode: "braille"
    property string asciiSource: "album-art"
    property string ttfxEffectName: "random"

    // Exposed engine metadata for callers and tests
    readonly property var modeNames: Engine.MODE_NAMES
    readonly property var layer1Modes: Engine.LAYER1_MODES
    readonly property var layer1EqStyles: Engine.LAYER1_EQ_STYLES
    readonly property var layer1EqLayouts: Engine.LAYER1_EQ_LAYOUTS
    readonly property var layer1EqDampingNames: Engine.LAYER1_EQ_DAMPING
    readonly property var layer1ShapeStyles: Engine.LAYER1_SHAPE_STYLES
    readonly property var layer3Modes: Engine.LAYER3_MODES
    readonly property var paletteNames: Engine.PALETTE_NAMES
    readonly property var trackArcModes: Engine.TRACK_ARC_MODES

    // Global Music-Driven Modulation, GPU Shader, Song Arc & Universal 3D Graded History Tracer state
    property bool musicDrive: true
    property bool gpuShaderEnabled: false
    property int hudFocusedLayer: 2 // 1 = L1 Strip, 2 = L2 Strip, 3 = L3 Strip on Row 2 of topHud
    property int trackArcMode: 1 // 0 = Dynamic Audio Arc, 1 = Climax (75%), 2 = Dismantle, 3 = Rebuild, 4 = Quarters
    property int tracerCount: 4
    property real tracerSpeed: 1.15
    property real tracerDrift: 1.00
    property int tracerDirection: 1 // 1 = Towards User, -1 = To Endpoint, 0 = Breathe
    property bool showTracerPopover: false

    // Configurable internal render buffer width (384 = Fast, 480 = Balanced 486/686 Demoscene, 640 = Crisp)
    property int renderResW: 480
    property real frameAccumDt: 0.0
    property int telemetryTick: 0

    // Layer #1 — 3 Independent Sub-Systems:
    //   (1) L1 Field (`layer1FieldEnabled` + `layer1Mode` 0..5)
    //   (2) L1 Equaliser (`layer1EqEnabled` + `layer1EqStyle` 0..5 + `layer1EqLayout` 0..2 + `layer1EqDamping` 0..2 + `layer1EqGain`)
    //   (3) L1 Beat Shapes (`layer1ShapesEnabled` + `layer1ShapeStyle` 0..5 + spin/speed/scale)
    property bool layer1Enabled: true
    property bool layer1FieldEnabled: true
    property int layer1Mode: 0
    property real layer1Persistence: 0.84
    property real layer1Speed: 1.0
    property real layer1Density: 1.0
    property real layer1Dim: 0.16
    property bool layer1EqEnabled: true
    property int layer1EqStyle: 0
    property int layer1EqLayout: 0
    property real layer1EqGain: 1.25
    property int layer1EqDamping: 0
    property bool layer1ShapesEnabled: true
    property int layer1ShapeStyle: 0
    property real layer1ShapeSpin: 1.0
    property real layer1ShapeSpeed: 1.0
    property real layer1ShapeScale: 1.0

    // Layer #2 — Psychedelic & Nightclub Visualiser Engine state
    property bool layer2Enabled: true
    property int visualMode: 0
    property int paletteIndex: 0
    property int symmetryIndex: 0
    property bool autoCycle: false
    property real sensitivity: 1.35
    property real layer2Complexity: 1.0
    property real layer2Speed: 1.0
    property real layer2Zoom: 1.0
    property real layer2Chaos: 0.50

    // Layer #3 — Album Art & Song Words Dismantle, Evolution & Rebuild Engine state
    property bool layer3Enabled: true
    property bool layer3AutoRandomise: true
    property int layer3Mode: 0
    property real layer3Dismantle: 1.15
    property real layer3Rebuild: 1.0
    property real layer3Evolution: 0.90
    property real layer3Scale: 1.0
    property int layer3Tracers: 3

    // Collective L1 + L2 + L3 Scene Presets & Smooth Transition state
    property int currentPresetIndex: 0
    property bool presetTransitionEnabled: false
    property int presetTransitionIntervalSec: 10
    property var targetPresetSnapshot: null
    property real presetMorphProgress: 1.0

    property var collectivePresets: [
        {
            name: "4D Hypercube & Synth Skyline",
            selected: true,
            palette: 0,
            musicDrive: true,
            tracerCount: 6, tracerSpeed: 1.20, tracerDrift: 1.05, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 4, l1Persistence: 0.84, l1Speed: 1.10, l1Density: 1.15, l1Dim: 0.14,
            l1EqEnabled: true, l1EqStyle: 0, l1EqLayout: 0, l1EqGain: 1.35, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 1, l1ShapeSpin: 1.10, l1ShapeSpeed: 1.05, l1ShapeScale: 1.00,
            l2Enabled: true, l2Mode: 10, sensitivity: 1.45, l2Complexity: 1.15, l2Speed: 1.10, l2Zoom: 1.05,
            l3Enabled: false, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.10, l3Rebuild: 1.00, l3Evolution: 0.85, l3Scale: 1.00, l3Tracers: 3
        },
        {
            name: "Cthugha Plasma Flame Tunnel",
            selected: true,
            palette: 4,
            musicDrive: true,
            tracerCount: 5, tracerSpeed: 1.30, tracerDrift: 1.15, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 0, l1Persistence: 0.86, l1Speed: 1.25, l1Density: 1.10, l1Dim: 0.16,
            l1EqEnabled: true, l1EqStyle: 4, l1EqLayout: 1, l1EqGain: 1.30, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 0, l1ShapeSpin: 0.90, l1ShapeSpeed: 1.15, l1ShapeScale: 1.05,
            l2Enabled: true, l2Mode: 3, sensitivity: 1.55, l2Complexity: 1.20, l2Speed: 1.20, l2Zoom: 1.05,
            l3Enabled: false, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.15, l3Rebuild: 1.00, l3Evolution: 0.90, l3Scale: 1.00, l3Tracers: 3
        },
        {
            name: "Minter VLM Curved Morphing Tube",
            selected: true,
            palette: 2,
            musicDrive: true,
            tracerCount: 6, tracerSpeed: 1.40, tracerDrift: 1.20, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 4, l1Persistence: 0.84, l1Speed: 1.30, l1Density: 1.25, l1Dim: 0.14,
            l1EqEnabled: true, l1EqStyle: 3, l1EqLayout: 2, l1EqGain: 1.40, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 3, l1ShapeSpin: 1.45, l1ShapeSpeed: 1.25, l1ShapeScale: 1.10,
            l2Enabled: true, l2Mode: 4, sensitivity: 1.60, l2Complexity: 1.25, l2Speed: 1.35, l2Zoom: 1.10,
            l3Enabled: false, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.20, l3Rebuild: 0.95, l3Evolution: 1.00, l3Scale: 1.00, l3Tracers: 3
        },
        {
            name: "Infinite Julia Fractal Zoom",
            selected: true,
            palette: 3,
            musicDrive: true,
            tracerCount: 4, tracerSpeed: 1.15, tracerDrift: 0.95, tracerDirection: -1,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 1, l1Persistence: 0.84, l1Speed: 1.05, l1Density: 1.15, l1Dim: 0.16,
            l1EqEnabled: false, l1EqStyle: 2, l1EqLayout: 1, l1EqGain: 1.25, l1EqDamping: 1,
            l1ShapesEnabled: true, l1ShapeStyle: 4, l1ShapeSpin: -1.10, l1ShapeSpeed: 0.95, l1ShapeScale: 1.00,
            l2Enabled: true, l2Mode: 5, sensitivity: 1.45, l2Complexity: 1.25, l2Speed: 1.15, l2Zoom: 1.05,
            l3Enabled: false, l3Mode: 2, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.10, l3Rebuild: 1.05, l3Evolution: 0.90, l3Scale: 1.00, l3Tracers: 3
        },
        {
            name: "Braille Cover Art Shatter & MilkDrop",
            selected: true,
            palette: 1,
            musicDrive: true,
            tracerCount: 4, tracerSpeed: 1.10, tracerDrift: 1.00, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 0, l1Persistence: 0.84, l1Speed: 1.00, l1Density: 1.00, l1Dim: 0.16,
            l1EqEnabled: true, l1EqStyle: 0, l1EqLayout: 0, l1EqGain: 1.20, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 0, l1ShapeSpin: 1.00, l1ShapeSpeed: 1.00, l1ShapeScale: 1.00,
            l2Enabled: true, l2Mode: 0, sensitivity: 1.35, l2Complexity: 1.05, l2Speed: 1.05, l2Zoom: 1.00,
            l3Enabled: true, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.25, l3Rebuild: 1.05, l3Evolution: 0.95, l3Scale: 1.05, l3Tracers: 3
        },
        {
            name: "Neon Song Words TTE Lotus Dome",
            selected: true,
            palette: 5,
            musicDrive: true,
            tracerCount: 5, tracerSpeed: 1.20, tracerDrift: 1.10, tracerDirection: 0,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 3, l1Persistence: 0.84, l1Speed: 1.15, l1Density: 1.10, l1Dim: 0.16,
            l1EqEnabled: true, l1EqStyle: 5, l1EqLayout: 1, l1EqGain: 1.30, l1EqDamping: 1,
            l1ShapesEnabled: true, l1ShapeStyle: 5, l1ShapeSpin: 0.85, l1ShapeSpeed: 1.00, l1ShapeScale: 1.10,
            l2Enabled: true, l2Mode: 6, sensitivity: 1.40, l2Complexity: 1.15, l2Speed: 1.10, l2Zoom: 1.00,
            l3Enabled: true, l3Mode: 5, asciiMode: "banner", useAlbumArt: false,
            l3Dismantle: 1.15, l3Rebuild: 1.10, l3Evolution: 1.10, l3Scale: 1.00, l3Tracers: 4
        },
        {
            name: "Pure SynthGrid LED Equaliser (L1 Only)",
            selected: false,
            palette: 6,
            musicDrive: true,
            tracerCount: 4, tracerSpeed: 1.10, tracerDrift: 0.90, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 4, l1Persistence: 0.82, l1Speed: 1.20, l1Density: 1.35, l1Dim: 0.12,
            l1EqEnabled: true, l1EqStyle: 1, l1EqLayout: 0, l1EqGain: 1.55, l1EqDamping: 2,
            l1ShapesEnabled: true, l1ShapeStyle: 2, l1ShapeSpin: 1.20, l1ShapeSpeed: 1.15, l1ShapeScale: 1.05,
            l2Enabled: false, l2Mode: 0, sensitivity: 1.35, l2Complexity: 1.00, l2Speed: 1.00, l2Zoom: 1.00,
            l3Enabled: false, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.00, l3Rebuild: 1.00, l3Evolution: 0.85, l3Scale: 1.00, l3Tracers: 3
        },
        {
            name: "Classic Matrix Digital Rain Waterfall",
            selected: false,
            palette: 2,
            musicDrive: true,
            tracerCount: 4, tracerSpeed: 1.20, tracerDrift: 1.00, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: false, l1Mode: 0, l1Persistence: 0.82, l1Speed: 1.00, l1Density: 1.00, l1Dim: 0.22,
            l1EqEnabled: true, l1EqStyle: 1, l1EqLayout: 0, l1EqGain: 1.25, l1EqDamping: 0,
            l1ShapesEnabled: false, l1ShapeStyle: 0, l1ShapeSpin: 1.00, l1ShapeSpeed: 1.00, l1ShapeScale: 1.00,
            l2Enabled: true, l2Mode: 9, sensitivity: 1.45, l2Complexity: 1.20, l2Speed: 1.15, l2Zoom: 1.00,
            l3Enabled: false, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.00, l3Rebuild: 1.00, l3Evolution: 0.85, l3Scale: 1.00, l3Tracers: 3
        }
    ]

    // HUD & Drawer state
    property bool showHud: true
    property bool showLayerDrawer: false
    property alias showConfigDrawer: root.showLayerDrawer
    property int activeConfigLayer: 2 // 0 = Presets (L1+L2+L3), 1 = Layer 1, 2 = Layer 2, 3 = Layer 3
    property bool isFullscreen: false

    // Live audio telemetry readouts updated by FrameAnimation
    property real liveBass: 0.0
    property real liveMid: 0.0
    property real liveHigh: 0.0
    property real liveBeat: 0.0

    readonly property int symmetryFolds: Engine.SYMMETRY_OPTIONS[symmetryIndex % Engine.SYMMETRY_OPTIONS.length] || 1

    readonly property var shortModeLabels: [
        "1 MilkDrop",
        "2 AVS Scope",
        "3 G-Force",
        "4 Cthugha",
        "5 Minter VLM",
        "6 Fractals",
        "7 DMT Lotus",
        "8 Spacetime",
        "9 Mycelium",
        "0 Matrix",
        "[ Hypercube",
        "] Attractor"
    ]

    readonly property var ttfxEffectsList: [
        "waves",
        "colorshift",
        "blackhole",
        "fireworks",
        "synthgrid",
        "swarm",
        "laseretch",
        "rings",
        "orbittingvolley",
        "beams",
        "vhstape",
        "matrix"
    ]

    // Omarchy theme colours
    property color accentColour: "#6ee7b7"
    property color urgentColour: "#f472b6"
    property color foregroundColour: "#e2e8f0"
    property color backgroundColour: "#07090e"

    signal requestToggleFullscreen()
    signal requestCloseVisualiser()
    signal requestPlayPause()
    signal requestNext()
    signal requestPrev()
    signal requestSeek(real seconds)
    signal requestToggleUseAlbumArt()
    signal requestToggleAsciiMode()
    signal requestSetAsciiSourceMode(string modeStr)
    signal requestLaunchTtfxScreensaver(string effectName)
    signal requestSelectTtfxEffect(string effectName)
    signal requestStageModeChange(string newStageMode)
    signal requestActionFeedback(string message)

    property var engineState: Engine.createState()

    function clearCanvasImmediate() {
        if (root.engineState) {
            root.engineState.clearFeedbackFrames = 3
        }
        if (vizCanvas && vizCanvas.available) {
            var c = vizCanvas.getContext("2d")
            if (c) {
                c.clearRect(0, 0, vizCanvas.width, vizCanvas.height)
            }
        }
        if (vizCanvas) {
            vizCanvas.requestPaint()
        }
    }

    onLayer1EnabledChanged: clearCanvasImmediate()
    onLayer2EnabledChanged: clearCanvasImmediate()
    onLayer3EnabledChanged: clearCanvasImmediate()

    onUseAlbumArtChanged: {
        vizCanvas.requestPaint()
    }

    // Strict Layer Isolation: changing visualMode (Layer #2) NEVER turns on Layer #1 or Layer #3!
    onVisualModeChanged: {
        vizCanvas.requestPaint()
    }

    function currentConfig() {
        var dur = Number(root.duration) || 0.0
        var pos = Number(root.position) || 0.0
        var trackProg = dur > 0.5 ? Math.max(0.0, Math.min(1.0, pos / dur)) : 0.0
        return {
            playing: root.playing,
            position: root.position,
            duration: root.duration,
            trackProgress: trackProg,
            trackArcMode: root.trackArcMode,
            palette: root.paletteIndex,
            musicDrive: root.musicDrive,
            gpuShaderEnabled: root.gpuShaderEnabled,
            tracerCount: root.tracerCount,
            tracerSpeed: root.tracerSpeed,
            tracerDrift: root.tracerDrift,
            tracerDirection: root.tracerDirection,
            sensitivity: root.sensitivity,
            layer2Reactivity: root.sensitivity,
            asciiMode: root.asciiMode,
            layer3AsciiMode: root.asciiMode,
            useAlbumArt: root.useAlbumArt,
            bannerLines: root.bannerLines,
            artLines: root.artLines,
            layer1Enabled: root.layer1Enabled,
            layer1FieldEnabled: root.layer1FieldEnabled,
            layer1Mode: root.layer1Mode,
            layer1Persistence: root.layer1Persistence,
            layer1Trail: root.layer1Persistence,
            layer1Speed: root.layer1Speed,
            layer1Density: root.layer1Density,
            layer1Dim: root.layer1Dim,
            layer1EqEnabled: root.layer1EqEnabled,
            layer1EqStyle: root.layer1EqStyle,
            layer1EqLayout: root.layer1EqLayout,
            layer1EqGain: root.layer1EqGain,
            layer1EqDamping: root.layer1EqDamping,
            layer1ShapesEnabled: root.layer1ShapesEnabled,
            layer1ShapeStyle: root.layer1ShapeStyle,
            layer1ShapeSpin: root.layer1ShapeSpin,
            layer1ShapeSpeed: root.layer1ShapeSpeed,
            layer1ShapeScale: root.layer1ShapeScale,
            layer2Enabled: root.layer2Enabled,
            layer2Mode: root.visualMode,
            mode: root.visualMode,
            symmetryFolds: root.symmetryFolds,
            layer2Facets: root.symmetryFolds,
            layer2Complexity: root.layer2Complexity,
            layer2Speed: root.layer2Speed,
            layer2Zoom: root.layer2Zoom,
            layer2Chaos: root.layer2Chaos,
            layer3Enabled: root.layer3Enabled,
            layer3Mode: root.layer3Mode,
            layer3Dismantle: root.layer3Dismantle,
            layer3Rebuild: root.layer3Rebuild,
            layer3Evolution: root.layer3Evolution,
            layer3Scale: root.layer3Scale,
            layer3Tracers: root.layer3Tracers
        }
    }

    function currentTheme() {
        return {
            accent: root.accentColour.toString(),
            urgent: root.urgentColour.toString(),
            foreground: root.foregroundColour.toString(),
            background: root.backgroundColour.toString()
        }
    }

    // -------------------------------------------------------------------------
    // Collective L1 + L2 + L3 Preset Management & Smooth Transitioning
    // -------------------------------------------------------------------------
    function applyCollectivePreset(idx, smoothMorph) {
        if (!root.collectivePresets || idx < 0 || idx >= root.collectivePresets.length) return
        var p = root.collectivePresets[idx]
        root.currentPresetIndex = idx

        // Discrete layer states & modes switch cleanly while respecting exact preset layer flags
        root.paletteIndex = Number(p.palette || 0) % Engine.PALETTE_NAMES.length
        root.musicDrive = p.musicDrive !== undefined ? Boolean(p.musicDrive) : true
        root.tracerCount = p.tracerCount !== undefined ? Number(p.tracerCount) : 4
        root.tracerDirection = p.tracerDirection !== undefined ? Number(p.tracerDirection) : 1

        root.layer1Enabled = Boolean(p.l1Enabled)
        root.layer1FieldEnabled = p.l1FieldEnabled !== undefined ? Boolean(p.l1FieldEnabled) : true
        root.layer1Mode = Number(p.l1Mode || 0) % Engine.LAYER1_MODES.length
        root.layer1EqEnabled = p.l1EqEnabled !== undefined ? Boolean(p.l1EqEnabled) : true
        root.layer1EqStyle = Number(p.l1EqStyle || 0) % Engine.LAYER1_EQ_STYLES.length
        root.layer1EqLayout = Number(p.l1EqLayout || 0) % Engine.LAYER1_EQ_LAYOUTS.length
        root.layer1EqDamping = Number(p.l1EqDamping || 0) % Engine.LAYER1_EQ_DAMPING.length
        root.layer1ShapesEnabled = p.l1ShapesEnabled !== undefined ? Boolean(p.l1ShapesEnabled) : true
        root.layer1ShapeStyle = Number(p.l1ShapeStyle || 0) % Engine.LAYER1_SHAPE_STYLES.length

        root.layer2Enabled = Boolean(p.l2Enabled)
        root.visualMode = Number(p.l2Mode || 0) % Engine.MODE_NAMES.length

        root.layer3Enabled = Boolean(p.l3Enabled)
        root.layer3Mode = Number(p.l3Mode || 0) % Engine.LAYER3_MODES.length
        if (p.asciiMode !== undefined) root.asciiMode = p.asciiMode
        if (p.useAlbumArt !== undefined) root.useAlbumArt = Boolean(p.useAlbumArt)
        if (p.l3Tracers !== undefined) root.layer3Tracers = Number(p.l3Tracers)

        if (smoothMorph) {
            root.targetPresetSnapshot = p
            root.presetMorphProgress = 0.0
        } else {
            root.targetPresetSnapshot = null
            root.presetMorphProgress = 1.0
            root.tracerSpeed = Number(p.tracerSpeed !== undefined ? p.tracerSpeed : 1.15)
            root.tracerDrift = Number(p.tracerDrift !== undefined ? p.tracerDrift : 1.0)
            root.layer1Persistence = Number(p.l1Persistence !== undefined ? p.l1Persistence : 0.84)
            root.layer1Speed = Number(p.l1Speed !== undefined ? p.l1Speed : 1.0)
            root.layer1Density = Number(p.l1Density !== undefined ? p.l1Density : 1.0)
            root.layer1Dim = Number(p.l1Dim !== undefined ? p.l1Dim : 0.16)
            root.layer1EqGain = Number(p.l1EqGain !== undefined ? p.l1EqGain : 1.25)
            root.layer1ShapeSpin = Number(p.l1ShapeSpin !== undefined ? p.l1ShapeSpin : 1.0)
            root.layer1ShapeSpeed = Number(p.l1ShapeSpeed !== undefined ? p.l1ShapeSpeed : 1.0)
            root.layer1ShapeScale = Number(p.l1ShapeScale !== undefined ? p.l1ShapeScale : 1.0)
            root.sensitivity = Number(p.sensitivity !== undefined ? p.sensitivity : 1.35)
            root.layer2Complexity = Number(p.l2Complexity !== undefined ? p.l2Complexity : 1.0)
            root.layer2Speed = Number(p.l2Speed !== undefined ? p.l2Speed : 1.0)
            root.layer2Zoom = Number(p.l2Zoom !== undefined ? p.l2Zoom : 1.0)
            root.layer3Dismantle = Number(p.l3Dismantle !== undefined ? p.l3Dismantle : 1.15)
            root.layer3Rebuild = Number(p.l3Rebuild !== undefined ? p.l3Rebuild : 1.0)
            root.layer3Evolution = Number(p.l3Evolution !== undefined ? p.l3Evolution : 0.90)
            root.layer3Scale = Number(p.l3Scale !== undefined ? p.l3Scale : 1.0)
        }

        clearCanvasImmediate()
        root.requestActionFeedback("Preset: " + p.name)
    }

    function cycleSelectedPreset(delta) {
        var list = root.collectivePresets || []
        if (list.length === 0) return
        var step = delta >= 0 ? 1 : -1
        for (var i = 1; i <= list.length; i++) {
            var cand = (root.currentPresetIndex + step * i + list.length * 4) % list.length
            if (list[cand].selected) {
                applyCollectivePreset(cand, true)
                return
            }
        }
        // Fallback if none checked: cycle all presets
        var nextIdx = (root.currentPresetIndex + step + list.length) % list.length
        applyCollectivePreset(nextIdx, true)
    }

    function togglePresetSelected(idx) {
        var copy = root.collectivePresets.slice()
        if (idx >= 0 && idx < copy.length) {
            var item = Object.assign({}, copy[idx])
            item.selected = !item.selected
            copy[idx] = item
            root.collectivePresets = copy
            root.requestActionFeedback((item.selected ? "Included in" : "Excluded from") + " preset cycle: " + item.name)
        }
    }

    function saveCurrentAsCollectivePreset() {
        var copy = root.collectivePresets.slice()
        var customNum = copy.length + 1
        var l1Tag = root.layer1Enabled ? ("L1:" + (Engine.LAYER1_MODES[root.layer1Mode] || "").split(" ")[0]) : "L1:Off"
        var l2Tag = root.layer2Enabled ? ("L2:" + (Engine.MODE_NAMES[root.visualMode] || "").split(" ")[0]) : "L2:Off"
        var l3Tag = root.layer3Enabled ? ("L3:" + (root.useAlbumArt ? "Art" : "Words")) : "L3:Off"
        var newPreset = {
            name: "Custom #" + customNum + " (" + l1Tag + " + " + l2Tag + " + " + l3Tag + ")",
            selected: true,
            palette: root.paletteIndex,
            musicDrive: root.musicDrive,
            tracerCount: root.tracerCount,
            tracerSpeed: root.tracerSpeed,
            tracerDrift: root.tracerDrift,
            tracerDirection: root.tracerDirection,
            l1Enabled: root.layer1Enabled,
            l1FieldEnabled: root.layer1FieldEnabled,
            l1Mode: root.layer1Mode,
            l1Persistence: root.layer1Persistence,
            l1Speed: root.layer1Speed,
            l1Density: root.layer1Density,
            l1Dim: root.layer1Dim,
            l1EqEnabled: root.layer1EqEnabled,
            l1EqStyle: root.layer1EqStyle,
            l1EqLayout: root.layer1EqLayout,
            l1EqGain: root.layer1EqGain,
            l1EqDamping: root.layer1EqDamping,
            l1ShapesEnabled: root.layer1ShapesEnabled,
            l1ShapeStyle: root.layer1ShapeStyle,
            l1ShapeSpin: root.layer1ShapeSpin,
            l1ShapeSpeed: root.layer1ShapeSpeed,
            l1ShapeScale: root.layer1ShapeScale,
            l2Enabled: root.layer2Enabled,
            l2Mode: root.visualMode,
            sensitivity: root.sensitivity,
            l2Complexity: root.layer2Complexity,
            l2Speed: root.layer2Speed,
            l2Zoom: root.layer2Zoom,
            l3Enabled: root.layer3Enabled,
            l3Mode: root.layer3Mode,
            asciiMode: root.asciiMode,
            useAlbumArt: root.useAlbumArt,
            l3Dismantle: root.layer3Dismantle,
            l3Rebuild: root.layer3Rebuild,
            l3Evolution: root.layer3Evolution,
            l3Scale: root.layer3Scale,
            l3Tracers: root.layer3Tracers
        }
        copy.push(newPreset)
        root.collectivePresets = copy
        root.currentPresetIndex = copy.length - 1
        root.requestActionFeedback("Saved Collective Preset: " + newPreset.name)
    }

    // Strict Layer Isolation in cycle functions: NEVER force-enable another or disabled layer unless explicitly toggled
    function cycleMode(delta) {
        var count = Engine.MODE_NAMES.length
        visualMode = (visualMode + delta + count) % count
        vizCanvas.requestPaint()
        root.requestActionFeedback("Layer #2 Mode: " + Engine.MODE_NAMES[visualMode])
    }

    function cycleLayer1Mode(delta) {
        var count = Engine.LAYER1_MODES.length
        layer1Mode = (layer1Mode + delta + count) % count
        vizCanvas.requestPaint()
        root.requestActionFeedback("Layer #1 Field: " + Engine.LAYER1_MODES[layer1Mode])
    }

    function cycleLayer3Mode(delta) {
        var count = Engine.LAYER3_MODES.length
        layer3Mode = (layer3Mode + delta + count) % count
        vizCanvas.requestPaint()
        root.requestActionFeedback("Layer #3 Art Evolution: " + Engine.LAYER3_MODES[layer3Mode])
    }

    function cyclePalette(delta) {
        var count = Engine.PALETTE_NAMES.length
        paletteIndex = (paletteIndex + delta + count) % count
        vizCanvas.requestPaint()
        root.requestActionFeedback("Palette: " + Engine.PALETTE_NAMES[paletteIndex])
    }

    function cycleSymmetry() {
        symmetryIndex = (symmetryIndex + 1) % Engine.SYMMETRY_OPTIONS.length
        vizCanvas.requestPaint()
        root.requestActionFeedback("Geometry Resonance: " + root.symmetryFolds + "x")
    }

    function cycleTracers(delta) {
        var step = (delta !== undefined && delta < 0) ? -1 : 1
        var steps = [1, 2, 4, 6, 8, 12, 16]
        var nextVal = 4
        if (step > 0) {
            for (var i = 0; i < steps.length; i++) {
                if (steps[i] > root.tracerCount) {
                    nextVal = steps[i]
                    break
                }
                if (i === steps.length - 1) nextVal = steps[0]
            }
        } else {
            for (var j = steps.length - 1; j >= 0; j--) {
                if (steps[j] < root.tracerCount) {
                    nextVal = steps[j]
                    break
                }
                if (j === 0) nextVal = steps[steps.length - 1]
            }
        }
        root.tracerCount = nextVal
        vizCanvas.requestPaint()
        root.requestActionFeedback("L2 Tracers: " + root.tracerCount + "x")
    }

    function cycleTrackArcMode() {
        root.trackArcMode = (root.trackArcMode + 1) % Engine.TRACK_ARC_MODES.length
        vizCanvas.requestPaint()
        root.requestActionFeedback("Song Progress Arc: " + Engine.TRACK_ARC_MODES[root.trackArcMode])
    }

    function toggleHudVisibility() {
        root.showHud = !root.showHud
        if (!root.showHud) {
            root.showLayerDrawer = false
            root.showTracerPopover = false
        }
        root.requestActionFeedback(root.showHud ? "HUD Menus Visible (H)" : "HUD Hidden — Clean Visualiser (Press H to restore)")
    }

    function toggleZenFullscreen() {
        if (root.isFullscreen && !root.showHud) {
            root.showHud = true
            root.requestToggleFullscreen()
            root.requestActionFeedback("Exited Zen Cinema Fullscreen")
        } else {
            root.showLayerDrawer = false
            root.showTracerPopover = false
            root.showHud = false
            if (!root.isFullscreen) {
                root.requestToggleFullscreen()
            }
            root.requestActionFeedback("Zen Cinema Fullscreen (Press H or Esc for HUD)")
        }
    }

    function randomiseLayer3() {
        var total = Engine.LAYER3_MODES.length
        var nextM = (root.layer3Mode + 1 + Math.floor(Math.random() * Math.max(1, total - 1))) % total
        root.layer3Mode = nextM
        Engine.shatterAlbumArt(root.engineState, 1.35)
        if (nextM === 5) {
            root.requestSelectTtfxEffect("random")
        }
        vizCanvas.requestPaint()
        root.requestActionFeedback("Layer #3 Randomised: " + Engine.LAYER3_MODES[nextM])
    }

    function randomiseVisuals() {
        Engine.randomiseState(root.engineState)
        paletteIndex = (paletteIndex + 1 + Math.floor(Math.random() * (Engine.PALETTE_NAMES.length - 1))) % Engine.PALETTE_NAMES.length
        if (root.layer3Enabled && root.layer3AutoRandomise) {
            root.randomiseLayer3()
        }
        vizCanvas.requestPaint()
        root.requestActionFeedback("Mutated psychedelic seed + palette (" + Engine.PALETTE_NAMES[paletteIndex] + ")")
    }

    function triggerShatterImpulse() {
        Engine.shatterAlbumArt(root.engineState, 1.55)
        vizCanvas.requestPaint()
        root.requestActionFeedback("Triggered Layer #3 Shatter Impulse")
    }

    function pickRandomTtfxEffect() {
        var list = root.ttfxEffectsList
        if (!list || list.length === 0) return "waves"
        var candidates = []
        for (var i = 0; i < list.length; i++) {
            if (list[i] !== root.ttfxEffectName) candidates.push(list[i])
        }
        var pool = candidates.length > 0 ? candidates : list
        return pool[Math.floor(Math.random() * pool.length)]
    }

    function activateAndCycleTteInCanvas() {
        var randomEffect = pickRandomTtfxEffect()
        root.ttfxEffectName = randomEffect
        root.layer3Mode = 5
        Engine.shatterAlbumArt(root.engineState, 1.25)
        root.requestSelectTtfxEffect("random")
        vizCanvas.requestPaint()
        root.requestActionFeedback("󰍹 TTE Randomised Effect: " + randomEffect)
    }

    function toggleInCanvasTte() {
        activateAndCycleTteInCanvas()
    }

    function launchExternalTteTerminal() {
        var randomEffect = pickRandomTtfxEffect()
        root.ttfxEffectName = randomEffect
        root.requestLaunchTtfxScreensaver("random")
        root.requestActionFeedback("Launching Omarchy TTE Terminal (Random Effect)...")
    }

    function currentTtfxEffect() {
        return pickRandomTtfxEffect()
    }

    function setStage(modeStr) {
        root.stageMode = modeStr
        root.requestStageModeChange(modeStr)
        var labels = {
            "off": "Stage Closed",
            "art": "Stage: Album Art As-Is",
            "turntable": "Stage: Audiophile Turntable Deck",
            "visualiser": "Stage: 3-Layer Psychedelic Visualiser"
        }
        root.requestActionFeedback(labels[modeStr] || ("Stage: " + modeStr))
    }

    function formatTime(sec) {
        var s = Math.max(0, Math.floor(Number(sec) || 0))
        var m = Math.floor(s / 60)
        var r = s % 60
        return m + ":" + (r < 10 ? "0" + r : r)
    }

    // Reusable tactile button with hover highlight + click flash + scale bounce
    component VizPillButton: Rectangle {
        id: pill
        property string text: ""
        property bool active: false
        property bool urgent: false
        property int fontSize: 10
        property int horizontalPad: 10
        property int pillHeight: 24
        signal clicked()
        signal rightClicked()
        signal wheelScrolled(int delta)

        implicitHeight: pillHeight
        implicitWidth: pillLabel.implicitWidth + horizontalPad * 2
        Layout.preferredHeight: implicitHeight
        Layout.preferredWidth: implicitWidth
        radius: 5
        scale: pillArea.pressed ? 0.94 : (pillArea.containsMouse ? 1.02 : 1.0)
        color: {
            if (flashTimer.running) return pill.urgent ? root.urgentColour : root.accentColour
            if (pillArea.pressed) return Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.42)
            if (pill.urgent) {
                return pillArea.containsMouse
                    ? Qt.rgba(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 0.30)
                    : Qt.rgba(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 0.16)
            }
            if (pill.active) {
                return pillArea.containsMouse
                    ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.32)
                    : Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.20)
            }
            return pillArea.containsMouse ? Qt.rgba(1, 1, 1, 0.15) : Qt.rgba(1, 1, 1, 0.07)
        }
        border.width: 1
        border.color: {
            if (flashTimer.running) return "#ffffff"
            if (pill.urgent) return root.urgentColour
            if (pill.active || pillArea.containsMouse) return root.accentColour
            return Qt.rgba(1, 1, 1, 0.18)
        }

        Behavior on scale { NumberAnimation { duration: 90; easing.type: Easing.OutQuad } }
        Behavior on color { ColorAnimation { duration: 110 } }

        Timer {
            id: flashTimer
            interval: 130
            repeat: false
        }

        Text {
            id: pillLabel
            anchors.centerIn: parent
            text: pill.text
            textFormat: Text.PlainText
            font.family: "JetBrainsMono Nerd Font"
            font.pixelSize: pill.fontSize
            font.bold: pill.active || pill.urgent || flashTimer.running
            color: {
                if (flashTimer.running) return "#07090e"
                if (pill.urgent) return root.urgentColour
                if (pill.active) return root.accentColour
                return root.foregroundColour
            }
        }

        MouseArea {
            id: pillArea
            anchors.fill: parent
            hoverEnabled: true
            acceptedButtons: Qt.LeftButton | Qt.RightButton
            cursorShape: Qt.PointingHandCursor
            onClicked: mouse => {
                flashTimer.restart()
                if (mouse.button === Qt.RightButton) {
                    pill.rightClicked()
                } else {
                    pill.clicked()
                }
            }
            onWheel: wheel => {
                if (wheel.angleDelta.y !== 0) {
                    pill.wheelScrolled(wheel.angleDelta.y > 0 ? 1 : -1)
                }
            }
        }
    }

    // Reusable compact slider row for Layer 1 / 2 / 3 parameter tuning
    component LayerSlider: RowLayout {
        id: sliderRow
        property string label: ""
        property real value: 1.0
        property real minValue: 0.0
        property real maxValue: 2.0
        property string unitSuffix: ""
        property bool integerSteps: false
        signal valueEdited(real newVal)

        Layout.fillWidth: true
        spacing: 6

        Text {
            Layout.preferredWidth: 112
            text: sliderRow.label
            textFormat: Text.PlainText
            font.family: "JetBrainsMono Nerd Font"
            font.pixelSize: 10
            color: root.foregroundColour
            elide: Text.ElideRight
        }

        Rectangle {
            id: trackRect
            Layout.fillWidth: true
            Layout.preferredHeight: 8
            radius: 4
            color: Qt.rgba(1, 1, 1, 0.12)
            border.width: 1
            border.color: Qt.rgba(1, 1, 1, 0.16)

            readonly property real norm: Math.max(0, Math.min(1, (sliderRow.value - sliderRow.minValue) / Math.max(0.0001, sliderRow.maxValue - sliderRow.minValue)))

            Rectangle {
                width: parent.width * parent.norm
                height: parent.height
                radius: 4
                color: root.accentColour
            }

            Rectangle {
                x: Math.max(0, Math.min(parent.width - width, parent.width * parent.norm - width * 0.5))
                anchors.verticalCenter: parent.verticalCenter
                width: 12
                height: 12
                radius: 6
                color: sliderMouse.pressed ? root.urgentColour : "#ffffff"
                border.width: 2
                border.color: root.accentColour
            }

            MouseArea {
                id: sliderMouse
                anchors.fill: parent
                anchors.topMargin: -4
                anchors.bottomMargin: -4
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                function updateFromX(mx) {
                    var ratio = Math.max(0, Math.min(1, mx / Math.max(1, trackRect.width)))
                    var v = sliderRow.minValue + ratio * (sliderRow.maxValue - sliderRow.minValue)
                    if (sliderRow.integerSteps) {
                        sliderRow.valueEdited(Math.round(v))
                    } else {
                        sliderRow.valueEdited(Math.round(v * 100) / 100)
                    }
                }
                onPressed: mouse => updateFromX(mouse.x)
                onPositionChanged: mouse => { if (pressed) updateFromX(mouse.x) }
            }
        }

        Text {
            Layout.preferredWidth: 44
            horizontalAlignment: Text.AlignRight
            text: (sliderRow.integerSteps ? Math.round(sliderRow.value).toString() : sliderRow.value.toFixed(2)) + sliderRow.unitSuffix
            textFormat: Text.PlainText
            font.family: "JetBrainsMono Nerd Font"
            font.pixelSize: 10
            font.bold: true
            color: root.accentColour
        }
    }

    Keys.onPressed: event => {
        var allowDirectMode1To4 = root.isFullscreen || Boolean(event.modifiers & (Qt.AltModifier | Qt.ControlModifier))
        if (event.key === Qt.Key_1 && allowDirectMode1To4) { visualMode = 0; event.accepted = true }
        else if (event.key === Qt.Key_2 && allowDirectMode1To4) { visualMode = 1; event.accepted = true }
        else if (event.key === Qt.Key_3 && allowDirectMode1To4) { visualMode = 2; event.accepted = true }
        else if (event.key === Qt.Key_4 && allowDirectMode1To4) { visualMode = 3; event.accepted = true }
        else if (event.key === Qt.Key_5) { visualMode = 4; event.accepted = true }
        else if (event.key === Qt.Key_6) { visualMode = 5; event.accepted = true }
        else if (event.key === Qt.Key_7) { visualMode = 6; event.accepted = true }
        else if (event.key === Qt.Key_8) { visualMode = 7; event.accepted = true }
        else if (event.key === Qt.Key_9) { visualMode = 8; event.accepted = true }
        else if (event.key === Qt.Key_0) { visualMode = 9; event.accepted = true }
        else if (event.key === Qt.Key_BracketLeft) { visualMode = 10; event.accepted = true }
        else if (event.key === Qt.Key_BracketRight) { visualMode = 11; event.accepted = true }
        else if (event.key === Qt.Key_M) {
            cycleMode((event.modifiers & Qt.ShiftModifier) ? -1 : 1)
            event.accepted = true
        }
        else if (event.key === Qt.Key_G) {
            cycleLayer1Mode((event.modifiers & Qt.ShiftModifier) ? -1 : 1)
            event.accepted = true
        }
        else if (event.key === Qt.Key_E) {
            cycleLayer3Mode((event.modifiers & Qt.ShiftModifier) ? -1 : 1)
            event.accepted = true
        }
        else if (event.key === Qt.Key_C) {
            cyclePalette((event.modifiers & Qt.ShiftModifier) ? -1 : 1)
            event.accepted = true
        }
        else if (event.key === Qt.Key_K) {
            cycleTracers((event.modifiers & Qt.ShiftModifier) ? -1 : 1)
            event.accepted = true
        }
        else if (event.key === Qt.Key_R) { randomiseVisuals(); event.accepted = true }
        else if (event.key === Qt.Key_S) { triggerShatterImpulse(); event.accepted = true }
        else if (event.key === Qt.Key_X) {
            autoCycle = !autoCycle
            root.requestActionFeedback("Auto-Morph: " + (autoCycle ? "ON" : "OFF"))
            event.accepted = true
        }
        else if (event.key === Qt.Key_A) {
            root.layer3Enabled = !root.layer3Enabled
            root.requestActionFeedback("Layer #3 Album Art: " + (root.layer3Enabled ? "ON" : "OFF"))
            event.accepted = true
        }
        else if (event.key === Qt.Key_B) {
            root.requestToggleAsciiMode()
            root.requestActionFeedback("ASCII Glyph Mode toggled")
            event.accepted = true
        }
        else if (event.key === Qt.Key_T) {
            if (event.modifiers & Qt.ShiftModifier) {
                root.launchExternalTteTerminal()
            } else {
                root.activateAndCycleTteInCanvas()
            }
            event.accepted = true
        }
        else if (event.key === Qt.Key_L) {
            showLayerDrawer = !showLayerDrawer
            if (showLayerDrawer) showHud = true
            event.accepted = true
        }
        else if (event.key === Qt.Key_H) {
            root.toggleHudVisibility()
            event.accepted = true
        }
        else if (event.key === Qt.Key_Z) {
            root.toggleZenFullscreen()
            event.accepted = true
        }
        else if (event.key === Qt.Key_Plus || event.key === Qt.Key_Equal) {
            sensitivity = Math.min(3.0, Math.round((sensitivity + 0.15) * 100) / 100)
            root.requestActionFeedback("Audio Reactivity: " + sensitivity.toFixed(2) + "x")
            event.accepted = true
        }
        else if (event.key === Qt.Key_Minus) {
            sensitivity = Math.max(0.35, Math.round((sensitivity - 0.15) * 100) / 100)
            root.requestActionFeedback("Audio Reactivity: " + sensitivity.toFixed(2) + "x")
            event.accepted = true
        }
        else if (event.key === Qt.Key_Space) { root.requestPlayPause(); event.accepted = true }
        else if (event.key === Qt.Key_N || event.key === Qt.Key_Right) { root.requestNext(); event.accepted = true }
        else if (event.key === Qt.Key_P || event.key === Qt.Key_Left) { root.requestPrev(); event.accepted = true }
        else if (event.key === Qt.Key_F || event.key === Qt.Key_V) {
            if (event.modifiers & Qt.ShiftModifier) {
                root.toggleZenFullscreen()
            } else {
                root.requestToggleFullscreen()
            }
            event.accepted = true
        }
        else if (event.key === Qt.Key_Escape) {
            if (root.showTracerPopover) root.showTracerPopover = false
            else if (root.showLayerDrawer) root.showLayerDrawer = false
            else if (root.isFullscreen) {
                root.showHud = true
                root.requestToggleFullscreen()
            }
            else if (!root.showHud) root.showHud = true
            else root.requestCloseVisualiser()
            event.accepted = true
        }
    }

    // Auto-hide HUD after 4 seconds of mouse inactivity while in Fullscreen (when drawers are closed)
    Timer {
        id: hudAutoHideTimer
        interval: 4000
        running: root.visible && root.isFullscreen && root.showHud && !root.showLayerDrawer && !root.showTracerPopover
        repeat: false
        onTriggered: {
            if (root.isFullscreen && !root.showLayerDrawer && !root.showTracerPopover) {
                root.showHud = false
            }
        }
    }

    Rectangle {
        anchors.fill: parent
        color: root.backgroundColour
    }

    // Frame-paced ~48 FPS animation loop (prevents 120Hz/165Hz/240Hz monitors from running 4x redundant software canvas paints)
    FrameAnimation {
        id: frameAnim
        running: root.visible && root.stageMode !== "off"
        onTriggered: {
            root.frameAccumDt += Math.min(0.05, Math.max(0.002, frameTime))
            if (root.frameAccumDt < 0.0195) {
                return
            }
            var dt = Math.min(0.05, root.frameAccumDt)
            root.frameAccumDt = 0.0

            if (root.targetPresetSnapshot && root.presetMorphProgress < 1.0) {
                var tp = root.targetPresetSnapshot
                var alpha = Math.min(1.0, dt * 3.5)
                root.presetMorphProgress = Math.min(1.0, root.presetMorphProgress + dt * 0.8)
                root.tracerSpeed += (Number(tp.tracerSpeed || 1.15) - root.tracerSpeed) * alpha
                root.tracerDrift += (Number(tp.tracerDrift || 1.0) - root.tracerDrift) * alpha
                root.layer1Persistence += (Number(tp.l1Persistence || 0.84) - root.layer1Persistence) * alpha
                root.layer1Speed += (Number(tp.l1Speed || 1.0) - root.layer1Speed) * alpha
                root.layer1Density += (Number(tp.l1Density || 1.0) - root.layer1Density) * alpha
                root.layer1Dim += (Number(tp.l1Dim || 0.16) - root.layer1Dim) * alpha
                root.layer1EqGain += (Number(tp.l1EqGain || 1.25) - root.layer1EqGain) * alpha
                root.sensitivity += (Number(tp.sensitivity || 1.35) - root.sensitivity) * alpha
                root.layer2Complexity += (Number(tp.l2Complexity || 1.0) - root.layer2Complexity) * alpha
                root.layer2Speed += (Number(tp.l2Speed || 1.0) - root.layer2Speed) * alpha
                root.layer2Zoom += (Number(tp.l2Zoom || 1.0) - root.layer2Zoom) * alpha
                root.layer3Dismantle += (Number(tp.l3Dismantle || 1.15) - root.layer3Dismantle) * alpha
                root.layer3Rebuild += (Number(tp.l3Rebuild || 1.0) - root.layer3Rebuild) * alpha
                root.layer3Evolution += (Number(tp.l3Evolution || 0.90) - root.layer3Evolution) * alpha
                root.layer3Scale += (Number(tp.l3Scale || 1.0) - root.layer3Scale) * alpha
            }

            var cfg = root.currentConfig()
            root._cachedFrameConfig = cfg
            Engine.stepState(root.engineState, root.bands, root.playing, cfg, dt)

            // Throttle QML telemetry property updates to ~12 Hz (every 4th frame) to avoid QML binding storms
            root.telemetryTick = (root.telemetryTick + 1) & 3
            if (root.telemetryTick === 0 && (root.showHud || root.stageMode !== "visualiser")) {
                root.liveBass = root.engineState.bassSmooth || 0.0
                root.liveMid = root.engineState.midSmooth || 0.0
                root.liveHigh = root.engineState.highSmooth || 0.0
                root.liveBeat = root.engineState.beatPulse || 0.0
            }

            if (root.stageMode === "visualiser") {
                vizCanvas.requestPaint()
            }
        }
    }

    property var _cachedFrameConfig: null

    // Auto-Morph Evolution Timer: strictly respects each layer's enabled state (NEVER turns on a disabled layer!)
    Timer {
        interval: 10000
        running: root.visible && root.autoCycle && root.stageMode === "visualiser"
        repeat: true
        onTriggered: {
            if (root.presetTransitionEnabled) {
                root.cycleSelectedPreset(1)
                return
            }
            if (root.layer2Enabled) {
                root.cycleMode(1)
            }
            if (root.layer1Enabled) {
                if (root.layer1FieldEnabled) {
                    root.layer1Mode = (root.layer1Mode + 1) % Engine.LAYER1_MODES.length
                }
                if (root.layer1EqEnabled) {
                    root.layer1EqStyle = (root.layer1EqStyle + 1) % Engine.LAYER1_EQ_STYLES.length
                }
                if (root.layer1ShapesEnabled) {
                    root.layer1ShapeStyle = (root.layer1ShapeStyle + 1) % Engine.LAYER1_SHAPE_STYLES.length
                }
            }
            if (root.layer3Enabled && root.layer3AutoRandomise) {
                root.layer3Mode = Math.floor(Math.random() * Engine.LAYER3_MODES.length)
            }
            Engine.randomiseState(root.engineState)
            root.paletteIndex = (root.paletteIndex + 1) % Engine.PALETTE_NAMES.length
        }
    }

    // Selected Collective Presets Transition Timer
    Timer {
        interval: Math.max(4, root.presetTransitionIntervalSec) * 1000
        running: root.visible && root.presetTransitionEnabled && root.stageMode === "visualiser"
        repeat: true
        onTriggered: {
            root.cycleSelectedPreset(1)
        }
    }

    // Independent Layer #3 Auto-Randomise Timer (Cycles L3 Modes & TTE effects automatically when L3 Auto-Randomise is ON)
    Timer {
        id: l3RandomiseTimer
        interval: 9000
        running: root.visible && root.stageMode === "visualiser" && root.layer3Enabled && root.layer3AutoRandomise
        repeat: true
        onTriggered: {
            root.randomiseLayer3()
        }
    }

    // =========================================================================
    // STAGE MODE 1: ALBUM ART AS-IS ("art")
    // =========================================================================
    Item {
        id: artStageView
        anchors.fill: parent
        visible: root.stageMode === "art"

        Rectangle {
            anchors.centerIn: parent
            width: Math.min(parent.width, parent.height) * 0.78
            height: width
            radius: width / 2
            color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.08 + root.liveBass * 0.14)
            scale: 1.0 + root.liveBeat * 0.04
        }

        Rectangle {
            id: artFrame
            anchors.centerIn: parent
            anchors.verticalCenterOffset: root.showHud ? 10 : 0
            width: Math.max(160, Math.min(parent.width - 48, parent.height - (root.showHud ? 168 : 48)))
            height: width
            radius: 10
            color: "#0b0f17"
            border.width: 2
            border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.45)
            clip: true

            Image {
                id: cleanCoverImage
                anchors.fill: parent
                anchors.margins: 2
                source: root.artPath ? (root.artPath.indexOf("file://") === 0 ? root.artPath : "file://" + root.artPath) : ""
                fillMode: Image.PreserveAspectCrop
                asynchronous: true
                mipmap: true
                visible: status === Image.Ready
            }

            ColumnLayout {
                anchors.centerIn: parent
                visible: cleanCoverImage.status !== Image.Ready
                spacing: 8

                Text {
                    Layout.alignment: Qt.AlignHCenter
                    text: "󰀥"
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 54
                    color: root.accentColour
                }
                Text {
                    Layout.alignment: Qt.AlignHCenter
                    text: root.trackAlbum || root.trackTitle || "Bandarchy"
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 13
                    font.bold: true
                    color: root.foregroundColour
                }
            }
        }
    }

    // =========================================================================
    // STAGE MODE 2: UPGRADED TURNTABLE RECORD PLAYER ("turntable")
    // =========================================================================
    Item {
        id: turntableStageView
        anchors.fill: parent
        visible: root.stageMode === "turntable"

        Vinyl {
            id: stageTurntable
            anchors.centerIn: parent
            anchors.verticalCenterOffset: root.showHud ? 10 : 0
            width: Math.max(220, Math.min(parent.width - 28, (parent.height - (root.showHud ? 160 : 28)) * 1.16))
            height: Math.max(190, Math.min(parent.height - (root.showHud ? 160 : 28), width / 1.16))
            deckMode: true
            artPath: root.artPath
            spinning: root.playing
            position: root.position
            duration: root.duration
            accentColour: root.accentColour
            urgentColour: root.urgentColour
            foregroundColour: root.foregroundColour
            backgroundColour: root.backgroundColour
            bassLevel: root.liveBass
            midLevel: root.liveMid
            highLevel: root.liveHigh
            onRequestTogglePlay: {
                root.requestPlayPause()
                root.requestActionFeedback(root.playing ? "Turntable Cued: Pause" : "Turntable Cued: Start Platter")
            }
            onRequestSeekRatio: ratio => {
                if (root.duration > 0) {
                    var targetSec = Math.max(0, Math.min(root.duration, ratio * root.duration))
                    root.requestSeek(targetSec)
                    root.requestActionFeedback("Tonearm dropped at " + root.formatTime(targetSec))
                }
            }
        }
    }

    // =========================================================================
    // STAGE MODE 3: 3-LAYER PSYCHEDELIC & NIGHTCLUB VISUALISER ("visualiser")
    // Native Qt6 GPU Fragment Shader Stage + Hardware-Scaled Vector & ASCII Canvas
    // =========================================================================
    ShaderEffect {
        id: gpuShaderStage
        anchors.fill: parent
        visible: root.stageMode === "visualiser" && root.gpuShaderEnabled
        fragmentShader: Qt.resolvedUrl("share/psychedelic.frag.qsb")

        property real uTime: root.engineState ? (root.engineState.t || 0.0) : 0.0
        property real uAspect: height > 0 ? (width / height) : 1.777
        property real uBass: root.liveBass
        property real uMid: root.liveMid
        property real uHigh: root.liveHigh
        property real uBeat: root.liveBeat
        property real uMode: (root.visualMode === 4 ? 1.0 : (root.visualMode === 5 ? 2.0 : 0.0))
        property real uZoom: root.layer2Zoom
        property real uEndX: Math.sin(uTime * 0.27) * 0.18
        property real uEndY: Math.cos(uTime * 0.21) * 0.14
        property vector4d uCol0: Qt.vector4d(root.accentColour.r, root.accentColour.g, root.accentColour.b, 1.0)
        property vector4d uCol1: Qt.vector4d(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 1.0)
        property vector4d uCol2: Qt.vector4d(0.22, 0.74, 0.97, 1.0)
        property vector4d uBgCol: Qt.vector4d(root.backgroundColour.r, root.backgroundColour.g, root.backgroundColour.b, 1.0)
    }

    Canvas {
        id: vizCanvas
        readonly property int maxInternalW: 640
        readonly property int effectiveTargetW: Math.min(maxInternalW, Math.max(320, root.renderResW))
        readonly property real renderScale: root.width > effectiveTargetW ? (effectiveTargetW / Math.max(1, root.width)) : 1.0
        width: Math.max(64, Math.round(root.width * renderScale))
        height: Math.max(48, Math.round(root.height * renderScale))
        transformOrigin: Item.TopLeft
        transform: Scale {
            xScale: vizCanvas.width > 0 ? (root.width / vizCanvas.width) : 1.0
            yScale: vizCanvas.height > 0 ? (root.height / vizCanvas.height) : 1.0
        }
        visible: root.stageMode === "visualiser"
        renderTarget: Canvas.Image
        renderStrategy: Canvas.Threaded

        onPaint: {
            var ctx = getContext("2d")
            Engine.renderFrame(
                ctx,
                width,
                height,
                root.engineState,
                root.visualMode,
                root.currentTheme(),
                root.asciiLines,
                root.asciiSource,
                root.ttfxFrames,
                root._cachedFrameConfig || root.currentConfig(),
                vizCanvas
            )
        }
    }

    // Click to focus for keyboard shortcuts; double-click toggles fullscreen
    MouseArea {
        id: stageBgMouse
        anchors.fill: parent
        z: -1
        hoverEnabled: root.isFullscreen
        property real lastX: -1
        property real lastY: -1
        acceptedButtons: Qt.LeftButton
        onClicked: {
            root.forceActiveFocus()
            if (root.showTracerPopover) root.showTracerPopover = false
        }
        onDoubleClicked: root.requestToggleFullscreen()
        onPositionChanged: mouse => {
            if (root.isFullscreen) {
                var dx = Math.abs(mouse.x - lastX)
                var dy = Math.abs(mouse.y - lastY)
                if (lastX >= 0 && (dx > 8 || dy > 8)) {
                    if (!root.showHud) root.showHud = true
                    hudAutoHideTimer.restart()
                }
                lastX = mouse.x
                lastY = mouse.y
            }
        }
    }

    // =========================================================================
    // TOP OMARCHY HUD BAR + STAGE MODE SWITCHER + 3-LAYER CONTROLS
    // =========================================================================
    Rectangle {
        id: topHud
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 8
        height: root.stageMode === "visualiser" ? 78 : 42
        radius: 8
        color: Qt.rgba(0.04, 0.05, 0.08, 0.88)
        border.width: 1
        border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.35)
        visible: root.showHud

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 6
            spacing: 4

            // Row 1: Stage Mode Selector + Layer Toggles + Presets + L2 Tracers Slider Popover + TTE + Fullscreen
            RowLayout {
                Layout.fillWidth: true
                spacing: 4

                VizPillButton {
                    text: "󰀥 Art"
                    active: root.stageMode === "art"
                    horizontalPad: 7
                    onClicked: root.setStage("art")
                }

                VizPillButton {
                    text: "󰀥 Turntable"
                    active: root.stageMode === "turntable"
                    horizontalPad: 7
                    onClicked: root.setStage("turntable")
                }

                VizPillButton {
                    text: "󰍹 Visualiser"
                    active: root.stageMode === "visualiser"
                    horizontalPad: 7
                    onClicked: root.setStage("visualiser")
                }

                Rectangle {
                    Layout.preferredWidth: 1
                    Layout.preferredHeight: 16
                    color: Qt.rgba(1, 1, 1, 0.16)
                    visible: root.stageMode === "visualiser"
                }

                // Layer #1 Independent Quick Toggle (Fixed width so Row 1 never resizes!)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 64
                    text: root.layer1Enabled ? "L1: ON" : "L1: OFF"
                    active: root.layer1Enabled
                    urgent: root.hudFocusedLayer === 1 && !root.layer1Enabled
                    horizontalPad: 6
                    onClicked: {
                        root.layer1Enabled = !root.layer1Enabled
                        root.hudFocusedLayer = 1
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("Layer #1 Background: " + (root.layer1Enabled ? ("ON (" + Engine.LAYER1_MODES[root.layer1Mode] + ")") : "OFF"))
                    }
                    onRightClicked: {
                        root.hudFocusedLayer = 1
                        root.requestActionFeedback("Row 2 focused on Layer #1 Controls")
                    }
                }

                // Layer #2 Independent Quick Toggle (Fixed width so Row 1 never resizes!)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 64
                    text: root.layer2Enabled ? "L2: ON" : "L2: OFF"
                    active: root.layer2Enabled
                    urgent: root.hudFocusedLayer === 2 && !root.layer2Enabled
                    horizontalPad: 6
                    onClicked: {
                        root.layer2Enabled = !root.layer2Enabled
                        root.hudFocusedLayer = 2
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("Layer #2 Visualiser: " + (root.layer2Enabled ? ("ON (" + Engine.MODE_NAMES[root.visualMode] + ")") : "OFF"))
                    }
                    onRightClicked: {
                        root.hudFocusedLayer = 2
                        root.requestActionFeedback("Row 2 focused on Layer #2 Modes")
                    }
                }

                // Layer #3 Independent Quick Toggle (Fixed width so Row 1 never resizes!)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 64
                    text: root.layer3Enabled ? "L3: ON" : "L3: OFF"
                    active: root.layer3Enabled
                    urgent: root.hudFocusedLayer === 3 && !root.layer3Enabled
                    horizontalPad: 6
                    onClicked: {
                        root.layer3Enabled = !root.layer3Enabled
                        root.hudFocusedLayer = 3
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("Layer #3 Art/Words: " + (root.layer3Enabled ? ("ON (" + Engine.LAYER3_MODES[root.layer3Mode] + ")") : "OFF"))
                    }
                    onRightClicked: {
                        root.hudFocusedLayer = 3
                        root.requestActionFeedback("Row 2 focused on Layer #3 Controls")
                    }
                }

                // Contextual Row 2 Strip Switcher (L1 / L2 / L3 Quick Strip)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 68
                    text: "Strip: L" + root.hudFocusedLayer
                    active: true
                    horizontalPad: 6
                    onClicked: {
                        root.hudFocusedLayer = (root.hudFocusedLayer % 3) + 1
                        root.requestActionFeedback("HUD Row 2 Strip: Layer #" + root.hudFocusedLayer)
                    }
                    onRightClicked: {
                        root.hudFocusedLayer = ((root.hudFocusedLayer + 1) % 3) + 1
                    }
                }

                // Open 3-Layer + Presets Configuration Drawer button
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: root.showLayerDrawer ? "󰒓 Layers ▲" : "󰒓 Layers ▼"
                    active: root.showLayerDrawer
                    urgent: root.showLayerDrawer
                    horizontalPad: 8
                    onClicked: {
                        root.showLayerDrawer = !root.showLayerDrawer
                        if (root.showLayerDrawer) root.showTracerPopover = false
                        root.requestActionFeedback(root.showLayerDrawer ? "Opened Layers & Presets Editor" : "Closed Layers & Presets Editor")
                    }
                }

                // Native Qt6 GPU ShaderEffect Toggle Pill
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 74
                    text: root.gpuShaderEnabled ? "󰢮 GPU: ON" : "󰢮 GPU"
                    active: root.gpuShaderEnabled
                    horizontalPad: 6
                    onClicked: {
                        root.gpuShaderEnabled = !root.gpuShaderEnabled
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("GPU Fragment Shader Stage: " + (root.gpuShaderEnabled ? "ON" : "OFF"))
                    }
                }

                // Collective Scene Preset Quick Cycler
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "󰀻 Preset"
                    active: root.presetTransitionEnabled
                    horizontalPad: 7
                    onClicked: root.cycleSelectedPreset(1)
                }

                // Interactive L2/L3 3D Graded History Tracers Button -> Opens Slider Popover (plus mouse wheel adjust!)
                VizPillButton {
                    id: tracerBtnPill
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 146
                    text: "Tracers: L2 " + root.tracerCount + "x·L3 " + root.layer3Tracers + "x " + (root.showTracerPopover ? "▲" : "▾")
                    active: root.showTracerPopover || root.tracerCount > 1 || root.layer3Tracers > 1
                    urgent: root.showTracerPopover
                    horizontalPad: 6
                    onClicked: {
                        root.showTracerPopover = !root.showTracerPopover
                        if (root.showTracerPopover) root.showLayerDrawer = false
                        root.requestActionFeedback(root.showTracerPopover ? "Opened 3D Tracers Sliders" : "Closed 3D Tracers Sliders")
                    }
                    onRightClicked: root.cycleTracers(-1)
                    onWheelScrolled: delta => {
                        root.tracerCount = Math.max(1, Math.min(16, root.tracerCount + delta))
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("L2 Tracers: " + root.tracerCount + "x")
                    }
                }

                // Palette selector (fixed width so Row 1 never shifts)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 82
                    text: "󰏘 " + (Engine.PALETTE_NAMES[root.paletteIndex] || "Prism").split(" ")[0]
                    horizontalPad: 6
                    onClicked: root.cyclePalette(1)
                }

                // Mutate seed
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "󰒟 Mutate"
                    urgent: true
                    horizontalPad: 7
                    onClicked: root.randomiseVisuals()
                }

                // Auto-Morph
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 74
                    text: root.autoCycle ? "󰑐 Auto: ON" : "󰑐 Auto"
                    active: root.autoCycle
                    horizontalPad: 6
                    onClicked: {
                        root.autoCycle = !root.autoCycle
                        root.requestActionFeedback("Auto-Morph Evolution: " + (root.autoCycle ? "ON" : "OFF"))
                    }
                }

                Item { Layout.fillWidth: true }

                // In-Canvas TTE Random Effect Activator (Always randomises effect)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "󰍹 TTE"
                    active: root.layer3Enabled && root.layer3Mode === 5
                    urgent: true
                    horizontalPad: 8
                    onClicked: root.activateAndCycleTteInCanvas()
                }

                // External Omarchy TTE Fullscreen Terminal Launcher (Always randomises effect)
                VizPillButton {
                    text: "󰆍 TTE Term"
                    horizontalPad: 7
                    onClicked: root.launchExternalTteTerminal()
                }

                // Hide HUD toggle (H)
                VizPillButton {
                    text: "󰈈 Hide HUD (H)"
                    horizontalPad: 7
                    onClicked: root.toggleHudVisibility()
                }

                // Fullscreen toggle (F / V, or Z / Shift+F for HUD-free Zen Fullscreen)
                VizPillButton {
                    text: root.isFullscreen ? "󰊓 Exit" : "󰊓 Full"
                    active: root.isFullscreen
                    horizontalPad: 7
                    onClicked: root.requestToggleFullscreen()
                }
            }

            // Row 2A: Contextual Strip for Layer #1 (7 Field Modes + Equaliser + Beat Shapes)
            RowLayout {
                Layout.fillWidth: true
                spacing: 4
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 1

                Repeater {
                    model: ["Flame", "SynthGrid", "StarWarp", "Nebula", "Battlezone", "DeathStar", "BlackHole"]
                    delegate: VizPillButton {
                        required property int index
                        required property string modelData
                        Layout.fillWidth: true
                        pillHeight: 22
                        fontSize: 9
                        horizontalPad: 5
                        text: modelData
                        active: root.layer1Enabled && root.layer1FieldEnabled && root.layer1Mode === index
                        onClicked: {
                            root.layer1Enabled = true
                            root.layer1FieldEnabled = true
                            root.layer1Mode = index
                            root.clearCanvasImmediate()
                            root.requestActionFeedback("L1 Field: " + Engine.LAYER1_MODES[index])
                        }
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 6
                    text: "EQ: " + (root.layer1EqEnabled ? (Engine.LAYER1_EQ_STYLES[root.layer1EqStyle] || "ON").split(" ")[0] : "OFF")
                    active: root.layer1Enabled && root.layer1EqEnabled
                    onClicked: {
                        root.layer1Enabled = true
                        if (!root.layer1EqEnabled) {
                            root.layer1EqEnabled = true
                        } else {
                            root.layer1EqStyle = (root.layer1EqStyle + 1) % Engine.LAYER1_EQ_STYLES.length
                        }
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("L1 Equaliser: " + Engine.LAYER1_EQ_STYLES[root.layer1EqStyle])
                    }
                    onRightClicked: {
                        root.layer1EqEnabled = !root.layer1EqEnabled
                        vizCanvas.requestPaint()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 6
                    text: "Shapes: " + (root.layer1ShapesEnabled ? (Engine.LAYER1_SHAPE_STYLES[root.layer1ShapeStyle] || "ON").split(" ")[0] : "OFF")
                    active: root.layer1Enabled && root.layer1ShapesEnabled
                    onClicked: {
                        root.layer1Enabled = true
                        if (!root.layer1ShapesEnabled) {
                            root.layer1ShapesEnabled = true
                        } else {
                            root.layer1ShapeStyle = (root.layer1ShapeStyle + 1) % Engine.LAYER1_SHAPE_STYLES.length
                        }
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("L1 Beat Shapes: " + Engine.LAYER1_SHAPE_STYLES[root.layer1ShapeStyle])
                    }
                    onRightClicked: {
                        root.layer1ShapesEnabled = !root.layer1ShapesEnabled
                        vizCanvas.requestPaint()
                    }
                }
            }

            // Row 2B: Direct 12-Mode Quick-Select Strip for Layer #2
            RowLayout {
                Layout.fillWidth: true
                spacing: 4
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 2

                Repeater {
                    model: root.shortModeLabels.length

                    delegate: Rectangle {
                        required property int index
                        readonly property bool isCurrent: root.visualMode === index && root.layer2Enabled
                        Layout.fillWidth: true
                        Layout.preferredHeight: 22
                        radius: 4
                        scale: modePillMouse.pressed ? 0.95 : 1.0
                        color: isCurrent
                            ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.26)
                            : (modePillMouse.containsMouse ? Qt.rgba(1, 1, 1, 0.14) : Qt.rgba(1, 1, 1, 0.05))
                        border.width: 1
                        border.color: isCurrent ? root.accentColour : (modePillMouse.containsMouse ? Qt.rgba(1, 1, 1, 0.3) : Qt.rgba(1, 1, 1, 0.12))

                        Text {
                            anchors.centerIn: parent
                            text: root.shortModeLabels[index]
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 9
                            font.bold: parent.isCurrent
                            color: parent.isCurrent ? root.accentColour : root.foregroundColour
                            elide: Text.ElideRight
                        }

                        MouseArea {
                            id: modePillMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                root.layer2Enabled = true
                                root.visualMode = index
                                root.forceActiveFocus()
                                root.requestActionFeedback("Layer #2 Mode: " + Engine.MODE_NAMES[index])
                            }
                        }
                    }
                }
            }

            // Row 2C: Contextual Strip for Layer #3 (Decoupled Art/Words + Braille/Block + 6 L3 Modes + Randomise L3)
            RowLayout {
                Layout.fillWidth: true
                spacing: 4
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 3

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 6
                    text: "󰀥 Art"
                    active: root.useAlbumArt
                    onClicked: {
                        root.layer3Enabled = true
                        root.requestSetAsciiSourceMode("art")
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 6
                    text: "󰬴 Words"
                    active: !root.useAlbumArt
                    onClicked: {
                        root.layer3Enabled = true
                        root.requestSetAsciiSourceMode("words")
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 6
                    text: "⣿ Braille"
                    active: root.asciiMode !== "block"
                    onClicked: {
                        root.layer3Enabled = true
                        root.requestSetAsciiSourceMode("braille")
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 6
                    text: "█ Block"
                    active: root.asciiMode === "block"
                    onClicked: {
                        root.layer3Enabled = true
                        root.requestSetAsciiSourceMode("block")
                    }
                }

                Repeater {
                    model: ["Shatter", "Automata", "Blackhole", "Ripple", "Scanline", "TTE Morph"]
                    delegate: VizPillButton {
                        required property int index
                        required property string modelData
                        Layout.fillWidth: true
                        pillHeight: 22
                        fontSize: 9
                        horizontalPad: 5
                        text: modelData
                        active: root.layer3Enabled && root.layer3Mode === index
                        onClicked: {
                            root.layer3Enabled = true
                            root.layer3Mode = index
                            if (index === 5) root.requestSelectTtfxEffect("random")
                            vizCanvas.requestPaint()
                            root.requestActionFeedback("Layer #3 Mode: " + Engine.LAYER3_MODES[index])
                        }
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 6
                    text: "󰒟 Rand L3"
                    urgent: true
                    onClicked: {
                        root.layer3Enabled = true
                        root.randomiseLayer3()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 6
                    text: root.layer3AutoRandomise ? "󰑐 Auto L3: ON" : "󰑐 Auto L3"
                    active: root.layer3AutoRandomise
                    onClicked: {
                        root.layer3AutoRandomise = !root.layer3AutoRandomise
                        root.requestActionFeedback("Layer #3 Auto-Randomise: " + (root.layer3AutoRandomise ? "ON" : "OFF"))
                    }
                }
            }
        }
    }

    // =========================================================================
    // INTERACTIVE L2 / L3 3D TRACER SLIDER POPOVER (Clean Sliders Only)
    // =========================================================================
    Rectangle {
        id: tracerPopover
        anchors.top: topHud.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 8
        height: tracerPopoverCol.implicitHeight + 18
        radius: 8
        color: Qt.rgba(0.03, 0.04, 0.07, 0.96)
        border.width: 1
        border.color: root.accentColour
        visible: root.showHud && root.showTracerPopover && root.stageMode === "visualiser"
        z: 25

        ColumnLayout {
            id: tracerPopoverCol
            anchors.fill: parent
            anchors.margins: 9
            spacing: 7

            RowLayout {
                Layout.fillWidth: true
                spacing: 6

                Text {
                    text: "󰒓 3D Graded History Tracers (L2 Visualiser & L3 Art/Words)"
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 10
                    font.bold: true
                    color: root.accentColour
                }

                Item { Layout.fillWidth: true }

                VizPillButton {
                    text: "3D Flow: " + (root.tracerDirection > 0 ? "Towards User" : (root.tracerDirection < 0 ? "To Endpoint" : "Breathe"))
                    active: true
                    horizontalPad: 7
                    pillHeight: 22
                    onClicked: {
                        root.tracerDirection = (root.tracerDirection === 1) ? -1 : ((root.tracerDirection === -1) ? 0 : 1)
                        vizCanvas.requestPaint()
                    }
                }

                VizPillButton {
                    text: "✕"
                    horizontalPad: 7
                    pillHeight: 22
                    onClicked: root.showTracerPopover = false
                }
            }

            GridLayout {
                Layout.fillWidth: true
                columns: 2
                columnSpacing: 16
                rowSpacing: 6

                LayerSlider {
                    label: "L2 Tracers (1–16x)"
                    value: root.tracerCount
                    minValue: 1
                    maxValue: 16
                    integerSteps: true
                    unitSuffix: "x"
                    onValueEdited: v => { root.tracerCount = Math.round(v); vizCanvas.requestPaint() }
                }

                LayerSlider {
                    label: "L3 Tracers (1–8x)"
                    value: root.layer3Tracers
                    minValue: 1
                    maxValue: 8
                    integerSteps: true
                    unitSuffix: "x"
                    onValueEdited: v => { root.layer3Tracers = Math.round(v); vizCanvas.requestPaint() }
                }

                LayerSlider {
                    label: "Tracer Z-Speed"
                    value: root.tracerSpeed
                    minValue: 0.20
                    maxValue: 2.80
                    unitSuffix: "x"
                    onValueEdited: v => { root.tracerSpeed = v; vizCanvas.requestPaint() }
                }

                LayerSlider {
                    label: "Endpoint Drift"
                    value: root.tracerDrift
                    minValue: 0.00
                    maxValue: 2.40
                    unitSuffix: "x"
                    onValueEdited: v => { root.tracerDrift = v; vizCanvas.requestPaint() }
                }
            }
        }
    }

    // =========================================================================
    // SPACIOUS FULL-WIDTH CONTEXTUAL 3-LAYER & COLLECTIVE PRESETS DRAWER
    // =========================================================================
    Rectangle {
        id: layerDrawer
        anchors.top: topHud.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 8
        height: Math.max(240, Math.min(parent.height - topHud.height - bottomHud.height - 28, 390))
        radius: 8
        color: Qt.rgba(0.03, 0.04, 0.07, 0.95)
        border.width: 1
        border.color: root.accentColour
        visible: root.showHud && root.showLayerDrawer && root.stageMode === "visualiser"
        clip: true
        z: 20

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 10
            spacing: 8

            // Top Tab Selector Bar: Collective Presets (0) / Layer #1 (1) / Layer #2 (2) / Layer #3 (3)
            RowLayout {
                Layout.fillWidth: true
                spacing: 6

                VizPillButton {
                    text: "󰀻 Presets (L1+L2+L3)"
                    active: root.activeConfigLayer === 0
                    horizontalPad: 9
                    onClicked: root.activeConfigLayer = 0
                }

                VizPillButton {
                    text: "L1: Background (" + (root.layer1Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 1
                    horizontalPad: 9
                    onClicked: root.activeConfigLayer = 1
                }

                VizPillButton {
                    text: "L2: Visualiser (" + (root.layer2Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 2
                    horizontalPad: 9
                    onClicked: root.activeConfigLayer = 2
                }

                VizPillButton {
                    text: "L3: Art & Words (" + (root.layer3Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 3
                    horizontalPad: 9
                    onClicked: root.activeConfigLayer = 3
                }

                VizPillButton {
                    text: root.musicDrive ? "󰎆 Music Drive: ON" : "󰎆 Music Drive: OFF"
                    active: root.musicDrive
                    horizontalPad: 8
                    onClicked: {
                        root.musicDrive = !root.musicDrive
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("Music-Driven Parameter Modulation: " + (root.musicDrive ? "ON" : "OFF"))
                    }
                }

                Item { Layout.fillWidth: true }

                VizPillButton {
                    text: "✕ Close"
                    horizontalPad: 8
                    onClicked: root.showLayerDrawer = false
                }
            }

            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 1
                color: Qt.rgba(1, 1, 1, 0.14)
            }

            // Scrollable Contextual Content Area
            Flickable {
                id: drawerFlick
                Layout.fillWidth: true
                Layout.fillHeight: true
                contentWidth: width
                contentHeight: activePageColumn.implicitHeight + 8
                clip: true
                boundsBehavior: Flickable.StopAtBounds

                ColumnLayout {
                    id: activePageColumn
                    width: drawerFlick.width
                    spacing: 8

                    // =========================================================
                    // TAB 0: COLLECTIVE L1 + L2 + L3 SCENE PRESETS & TRANSITIONS
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 0

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            VizPillButton {
                                text: root.presetTransitionEnabled ? "󰑐 Cycle Selected Presets: ON" : "󰑐 Cycle Selected Presets: OFF"
                                active: root.presetTransitionEnabled
                                urgent: root.presetTransitionEnabled
                                onClicked: {
                                    root.presetTransitionEnabled = !root.presetTransitionEnabled
                                    root.requestActionFeedback("Selected Presets Auto-Transition: " + (root.presetTransitionEnabled ? "ON" : "OFF"))
                                }
                            }

                            VizPillButton {
                                text: "󰒭 Next Selected Preset"
                                active: true
                                onClicked: root.cycleSelectedPreset(1)
                            }

                            VizPillButton {
                                text: "+ Save Current (L1+L2+L3) as Preset"
                                urgent: true
                                onClicked: root.saveCurrentAsCollectivePreset()
                            }

                            Item { Layout.fillWidth: true }

                            LayerSlider {
                                Layout.preferredWidth: 260
                                label: "Transition Every"
                                value: root.presetTransitionIntervalSec
                                minValue: 4
                                maxValue: 30
                                integerSteps: true
                                unitSuffix: "s"
                                onValueEdited: v => { root.presetTransitionIntervalSec = Math.round(v) }
                            }
                        }

                        // 2-Column Grid of Collective L1+L2+L3 Presets with Checkboxes
                        GridLayout {
                            Layout.fillWidth: true
                            columns: 2
                            columnSpacing: 8
                            rowSpacing: 6

                            Repeater {
                                model: root.collectivePresets.length

                                delegate: Rectangle {
                                    required property int index
                                    readonly property var presetData: root.collectivePresets[index] || ({})
                                    readonly property bool isCurrentPreset: root.currentPresetIndex === index
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 42
                                    radius: 6
                                    color: isCurrentPreset
                                        ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.22)
                                        : Qt.rgba(1, 1, 1, 0.05)
                                    border.width: 1
                                    border.color: isCurrentPreset ? root.accentColour : Qt.rgba(1, 1, 1, 0.15)

                                    RowLayout {
                                        anchors.fill: parent
                                        anchors.margins: 6
                                        spacing: 6

                                        // Selection Checkbox for Preset Transition Cycle
                                        VizPillButton {
                                            text: presetData.selected ? "☑" : "☐"
                                            active: Boolean(presetData.selected)
                                            horizontalPad: 6
                                            pillHeight: 26
                                            onClicked: root.togglePresetSelected(index)
                                        }

                                        ColumnLayout {
                                            Layout.fillWidth: true
                                            spacing: 1

                                            Text {
                                                Layout.fillWidth: true
                                                text: presetData.name || ("Preset #" + (index + 1))
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                font.bold: isCurrentPreset
                                                color: isCurrentPreset ? root.accentColour : root.foregroundColour
                                                elide: Text.ElideRight
                                            }

                                            Text {
                                                Layout.fillWidth: true
                                                text: (presetData.l1Enabled ? ("L1:" + (Engine.LAYER1_MODES[presetData.l1Mode || 0] || "").split(" ")[0]) : "L1:OFF")
                                                    + " · "
                                                    + (presetData.l2Enabled ? ("L2:" + (Engine.MODE_NAMES[presetData.l2Mode || 0] || "").split(" ")[0]) : "L2:OFF")
                                                    + " · "
                                                    + (presetData.l3Enabled ? ("L3:" + (presetData.useAlbumArt === false ? "Words" : "Art")) : "L3:OFF")
                                                    + " · " + (presetData.tracerCount || 9) + "x Tracers"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 8
                                                color: Qt.rgba(root.foregroundColour.r, root.foregroundColour.g, root.foregroundColour.b, 0.68)
                                                elide: Text.ElideRight
                                            }
                                        }

                                        VizPillButton {
                                            text: isCurrentPreset ? "Active" : "Load"
                                            active: isCurrentPreset
                                            horizontalPad: 8
                                            pillHeight: 26
                                            onClicked: root.applyCollectivePreset(index, true)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // =========================================================
                    // TAB 1: LAYER #1 CONFIGURATION — 3 INDEPENDENT SUB-SYSTEMS
                    //   (1) L1 Field  (2) L1 Equaliser  (3) L1 Beat Shapes
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 1

                        // Master Layer #1 Toggle + Quick Sub-System Summary Row
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            VizPillButton {
                                text: root.layer1Enabled ? "󰄬 Layer #1 Master: ON" : "󰅖 Layer #1 Master: OFF"
                                active: root.layer1Enabled
                                onClicked: {
                                    root.layer1Enabled = !root.layer1Enabled
                                    vizCanvas.requestPaint()
                                }
                            }

                            VizPillButton {
                                text: root.layer1FieldEnabled ? "󰄬 (1) L1 Field: ON" : "󰅖 (1) L1 Field: OFF"
                                active: root.layer1Enabled && root.layer1FieldEnabled
                                onClicked: {
                                    root.layer1FieldEnabled = !root.layer1FieldEnabled
                                    if (root.layer1FieldEnabled) root.layer1Enabled = true
                                    root.clearCanvasImmediate()
                                    root.requestActionFeedback("L1 Field Sub-System: " + (root.layer1FieldEnabled ? "ON" : "OFF"))
                                }
                            }

                            VizPillButton {
                                text: root.layer1EqEnabled ? "󰄬 (2) L1 Equaliser: ON" : "󰅖 (2) L1 Equaliser: OFF"
                                active: root.layer1Enabled && root.layer1EqEnabled
                                onClicked: {
                                    root.layer1EqEnabled = !root.layer1EqEnabled
                                    if (root.layer1EqEnabled) root.layer1Enabled = true
                                    root.clearCanvasImmediate()
                                    root.requestActionFeedback("L1 Equaliser Sub-System: " + (root.layer1EqEnabled ? "ON" : "OFF"))
                                }
                            }

                            VizPillButton {
                                text: root.layer1ShapesEnabled ? "󰄬 (3) L1 Beat Shapes: ON" : "󰅖 (3) L1 Beat Shapes: OFF"
                                active: root.layer1Enabled && root.layer1ShapesEnabled
                                onClicked: {
                                    root.layer1ShapesEnabled = !root.layer1ShapesEnabled
                                    if (root.layer1ShapesEnabled) root.layer1Enabled = true
                                    root.clearCanvasImmediate()
                                    root.requestActionFeedback("L1 Beat Shapes Sub-System: " + (root.layer1ShapesEnabled ? "ON" : "OFF"))
                                }
                            }
                        }

                        // SUB-SYSTEM 1: L1 Ambient / Perspective Field (7 Modes + Sliders)
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: fieldSubCol.implicitHeight + 14
                            radius: 6
                            color: Qt.rgba(1, 1, 1, 0.04)
                            border.width: 1
                            border.color: root.layer1FieldEnabled ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.35) : Qt.rgba(1, 1, 1, 0.12)

                            ColumnLayout {
                                id: fieldSubCol
                                anchors.fill: parent
                                anchors.margins: 7
                                spacing: 6

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 5

                                    VizPillButton {
                                        text: root.layer1FieldEnabled ? "Field: ON" : "Field: OFF"
                                        active: root.layer1FieldEnabled
                                        horizontalPad: 7
                                        onClicked: {
                                            root.layer1FieldEnabled = !root.layer1FieldEnabled
                                            if (root.layer1FieldEnabled) root.layer1Enabled = true
                                            root.clearCanvasImmediate()
                                        }
                                    }

                                    Repeater {
                                        model: Engine.LAYER1_MODES.length
                                        delegate: VizPillButton {
                                            required property int index
                                            text: (index + 1) + " " + Engine.LAYER1_MODES[index]
                                            active: root.layer1FieldEnabled && root.layer1Mode === index
                                            horizontalPad: 7
                                            onClicked: {
                                                root.layer1Enabled = true
                                                root.layer1FieldEnabled = true
                                                root.layer1Mode = index
                                                root.clearCanvasImmediate()
                                                root.requestActionFeedback("L1 Field Mode: " + Engine.LAYER1_MODES[index])
                                            }
                                        }
                                    }
                                }

                                GridLayout {
                                    Layout.fillWidth: true
                                    columns: 2
                                    columnSpacing: 16
                                    rowSpacing: 5

                                    LayerSlider {
                                        label: "Trail Persistence"
                                        value: root.layer1Persistence
                                        minValue: 0.20
                                        maxValue: 0.96
                                        onValueEdited: v => { root.layer1Persistence = v; vizCanvas.requestPaint() }
                                    }

                                    LayerSlider {
                                        label: "Feedback Speed"
                                        value: root.layer1Speed
                                        minValue: 0.20
                                        maxValue: 2.50
                                        unitSuffix: "x"
                                        onValueEdited: v => { root.layer1Speed = v; vizCanvas.requestPaint() }
                                    }

                                    LayerSlider {
                                        label: "Field Density"
                                        value: root.layer1Density
                                        minValue: 0.25
                                        maxValue: 2.00
                                        unitSuffix: "x"
                                        onValueEdited: v => { root.layer1Density = v; vizCanvas.requestPaint() }
                                    }

                                    LayerSlider {
                                        label: "Backdrop Dim"
                                        value: root.layer1Dim
                                        minValue: 0.04
                                        maxValue: 0.65
                                        onValueEdited: v => { root.layer1Dim = v; vizCanvas.requestPaint() }
                                    }
                                }
                            }
                        }

                        // SUB-SYSTEM 2: Independent L1 SynthGrid Equaliser (Can run over ANY L1 Field or solo!)
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: eqControlsCol.implicitHeight + 14
                            radius: 6
                            color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.07)
                            border.width: 1
                            border.color: root.layer1EqEnabled ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.35) : Qt.rgba(1, 1, 1, 0.14)

                            ColumnLayout {
                                id: eqControlsCol
                                anchors.fill: parent
                                anchors.margins: 7
                                spacing: 6

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 5

                                    VizPillButton {
                                        text: root.layer1EqEnabled ? "󰄬 L1 Equaliser: ON" : "󰅖 L1 Equaliser: OFF"
                                        active: root.layer1EqEnabled
                                        horizontalPad: 8
                                        onClicked: {
                                            root.layer1EqEnabled = !root.layer1EqEnabled
                                            if (root.layer1EqEnabled) root.layer1Enabled = true
                                            root.clearCanvasImmediate()
                                            root.requestActionFeedback("L1 Equaliser: " + (root.layer1EqEnabled ? "ON" : "OFF"))
                                        }
                                    }

                                    Repeater {
                                        model: Engine.LAYER1_EQ_STYLES.length
                                        delegate: VizPillButton {
                                            required property int index
                                            text: Engine.LAYER1_EQ_STYLES[index]
                                            active: root.layer1EqEnabled && root.layer1EqStyle === index
                                            horizontalPad: 7
                                            onClicked: {
                                                root.layer1Enabled = true
                                                root.layer1EqEnabled = true
                                                root.layer1EqStyle = index
                                                root.clearCanvasImmediate()
                                                root.requestActionFeedback("L1 Equaliser Style: " + Engine.LAYER1_EQ_STYLES[index])
                                            }
                                        }
                                    }
                                }

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 6

                                    Text {
                                        text: "Band Layout:"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 10
                                        color: root.foregroundColour
                                    }

                                    Repeater {
                                        model: Engine.LAYER1_EQ_LAYOUTS.length
                                        delegate: VizPillButton {
                                            required property int index
                                            text: Engine.LAYER1_EQ_LAYOUTS[index]
                                            active: root.layer1EqLayout === index
                                            horizontalPad: 7
                                            onClicked: {
                                                root.layer1EqLayout = index
                                                vizCanvas.requestPaint()
                                            }
                                        }
                                    }

                                    Text {
                                        text: "Damping:"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 10
                                        color: root.foregroundColour
                                    }

                                    Repeater {
                                        model: Engine.LAYER1_EQ_DAMPING.length
                                        delegate: VizPillButton {
                                            required property int index
                                            text: Engine.LAYER1_EQ_DAMPING[index]
                                            active: root.layer1EqDamping === index
                                            horizontalPad: 7
                                            onClicked: {
                                                root.layer1EqDamping = index
                                                vizCanvas.requestPaint()
                                            }
                                        }
                                    }

                                    LayerSlider {
                                        Layout.fillWidth: true
                                        label: "Equaliser Gain"
                                        value: root.layer1EqGain
                                        minValue: 0.40
                                        maxValue: 2.50
                                        unitSuffix: "x"
                                        onValueEdited: v => { root.layer1EqGain = v; vizCanvas.requestPaint() }
                                    }
                                }
                            }
                        }

                        // SUB-SYSTEM 3: Independent L1 Beat Shapes (Audio-Reactive Shapes Flying Towards User)
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: shapesControlsCol.implicitHeight + 14
                            radius: 6
                            color: Qt.rgba(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 0.06)
                            border.width: 1
                            border.color: root.layer1ShapesEnabled ? Qt.rgba(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 0.35) : Qt.rgba(1, 1, 1, 0.14)

                            ColumnLayout {
                                id: shapesControlsCol
                                anchors.fill: parent
                                anchors.margins: 7
                                spacing: 6

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 5

                                    VizPillButton {
                                        text: root.layer1ShapesEnabled ? "󰄬 L1 Beat Shapes: ON" : "󰅖 L1 Beat Shapes: OFF"
                                        active: root.layer1ShapesEnabled
                                        urgent: root.layer1ShapesEnabled
                                        horizontalPad: 8
                                        onClicked: {
                                            root.layer1ShapesEnabled = !root.layer1ShapesEnabled
                                            if (root.layer1ShapesEnabled) root.layer1Enabled = true
                                            root.clearCanvasImmediate()
                                            root.requestActionFeedback("L1 Beat Shapes: " + (root.layer1ShapesEnabled ? "ON" : "OFF"))
                                        }
                                    }

                                    Repeater {
                                        model: Engine.LAYER1_SHAPE_STYLES.length
                                        delegate: VizPillButton {
                                            required property int index
                                            text: Engine.LAYER1_SHAPE_STYLES[index]
                                            active: root.layer1ShapesEnabled && root.layer1ShapeStyle === index
                                            horizontalPad: 7
                                            onClicked: {
                                                root.layer1Enabled = true
                                                root.layer1ShapesEnabled = true
                                                root.layer1ShapeStyle = index
                                                root.clearCanvasImmediate()
                                                root.requestActionFeedback("L1 Beat Shape Style: " + Engine.LAYER1_SHAPE_STYLES[index])
                                            }
                                        }
                                    }
                                }

                                GridLayout {
                                    Layout.fillWidth: true
                                    columns: 3
                                    columnSpacing: 12
                                    rowSpacing: 5

                                    LayerSlider {
                                        label: "Shape Spin"
                                        value: root.layer1ShapeSpin
                                        minValue: -2.50
                                        maxValue: 2.50
                                        unitSuffix: "x"
                                        onValueEdited: v => { root.layer1ShapeSpin = v; vizCanvas.requestPaint() }
                                    }

                                    LayerSlider {
                                        label: "Flight Speed"
                                        value: root.layer1ShapeSpeed
                                        minValue: 0.20
                                        maxValue: 3.00
                                        unitSuffix: "x"
                                        onValueEdited: v => { root.layer1ShapeSpeed = v; vizCanvas.requestPaint() }
                                    }

                                    LayerSlider {
                                        label: "Shape Scale"
                                        value: root.layer1ShapeScale
                                        minValue: 0.30
                                        maxValue: 2.50
                                        unitSuffix: "x"
                                        onValueEdited: v => { root.layer1ShapeScale = v; vizCanvas.requestPaint() }
                                    }
                                }
                            }
                        }
                    }

                    // =========================================================
                    // TAB 2: LAYER #2 CONFIGURATION (12 VISUALISER MODES, SONG ARC & 3D TRACERS)
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 2

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            VizPillButton {
                                text: root.layer2Enabled ? "󰄬 Layer #2: ON" : "󰅖 Layer #2: OFF"
                                active: root.layer2Enabled
                                onClicked: {
                                    root.layer2Enabled = !root.layer2Enabled
                                    vizCanvas.requestPaint()
                                }
                            }

                            VizPillButton {
                                text: "3D Flow: " + (root.tracerDirection > 0 ? "Towards User" : (root.tracerDirection < 0 ? "To Endpoint" : "Breathe In/Out"))
                                active: true
                                onClicked: {
                                    root.tracerDirection = (root.tracerDirection === 1) ? -1 : ((root.tracerDirection === -1) ? 0 : 1)
                                    vizCanvas.requestPaint()
                                }
                            }

                            VizPillButton {
                                text: "󰏘 Palette: " + (Engine.PALETTE_NAMES[root.paletteIndex] || "Prism")
                                onClicked: root.cyclePalette(1)
                            }

                            VizPillButton {
                                text: "󰑐 Song Arc: " + (Engine.TRACK_ARC_MODES[root.trackArcMode] || "Climax")
                                active: root.trackArcMode > 0
                                onClicked: root.cycleTrackArcMode()
                            }

                            Item { Layout.fillWidth: true }

                            // Demoscene Internal Render Resolution Selector (CPU Efficiency Control)
                            Repeater {
                                model: [
                                    { w: 384, label: "384p Fast" },
                                    { w: 480, label: "480p Demoscene" },
                                    { w: 640, label: "640p Crisp" }
                                ]
                                delegate: VizPillButton {
                                    required property var modelData
                                    text: modelData.label
                                    active: root.renderResW === modelData.w
                                    horizontalPad: 6
                                    onClicked: {
                                        root.renderResW = modelData.w
                                        vizCanvas.requestPaint()
                                        root.requestActionFeedback("Internal Render Scale: " + modelData.label)
                                    }
                                }
                            }
                        }

                        // Complete 12-Mode Selector Grid for Layer #2
                        GridLayout {
                            Layout.fillWidth: true
                            columns: 4
                            columnSpacing: 6
                            rowSpacing: 5

                            Repeater {
                                model: Engine.MODE_NAMES.length
                                delegate: VizPillButton {
                                    required property int index
                                    Layout.fillWidth: true
                                    text: (index + 1) + ". " + Engine.MODE_NAMES[index]
                                    active: root.layer2Enabled && root.visualMode === index
                                    horizontalPad: 6
                                    onClicked: {
                                        root.visualMode = index
                                        vizCanvas.requestPaint()
                                        root.requestActionFeedback("Layer #2 Mode: " + Engine.MODE_NAMES[index])
                                    }
                                }
                            }
                        }

                        // 2-Column Parameter Sliders for Layer #2 + 3D Graded History Tracers
                        GridLayout {
                            Layout.fillWidth: true
                            columns: 2
                            columnSpacing: 16
                            rowSpacing: 6

                            LayerSlider {
                                label: "L2 Tracers (1–16x)"
                                value: root.tracerCount
                                minValue: 1
                                maxValue: 16
                                integerSteps: true
                                unitSuffix: "x"
                                onValueEdited: v => { root.tracerCount = Math.round(v); vizCanvas.requestPaint() }
                            }

                            LayerSlider {
                                label: "Tracer Z-Speed"
                                value: root.tracerSpeed
                                minValue: 0.20
                                maxValue: 2.80
                                unitSuffix: "x"
                                onValueEdited: v => { root.tracerSpeed = v; vizCanvas.requestPaint() }
                            }

                            LayerSlider {
                                label: "Endpoint Drift"
                                value: root.tracerDrift
                                minValue: 0.00
                                maxValue: 2.40
                                unitSuffix: "x"
                                onValueEdited: v => { root.tracerDrift = v; vizCanvas.requestPaint() }
                            }

                            LayerSlider {
                                label: "Audio Reactivity"
                                value: root.sensitivity
                                minValue: 0.35
                                maxValue: 2.80
                                unitSuffix: "x"
                                onValueEdited: v => { root.sensitivity = v; vizCanvas.requestPaint() }
                            }

                            LayerSlider {
                                label: "Geometry Detail"
                                value: root.layer2Complexity
                                minValue: 0.35
                                maxValue: 2.00
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer2Complexity = v; vizCanvas.requestPaint() }
                            }

                            LayerSlider {
                                label: "Evolution Speed"
                                value: root.layer2Speed
                                minValue: 0.20
                                maxValue: 2.50
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer2Speed = v; vizCanvas.requestPaint() }
                            }

                            LayerSlider {
                                label: "Scale / Zoom"
                                value: root.layer2Zoom
                                minValue: 0.50
                                maxValue: 2.00
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer2Zoom = v; root.layer2Chaos = Math.min(1.5, v * 0.6); vizCanvas.requestPaint() }
                            }
                        }
                    }

                    // =========================================================
                    // TAB 3: LAYER #3 CONFIGURATION (BRAILLE ART & SONG WORDS)
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 3

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            VizPillButton {
                                text: root.layer3Enabled ? "󰄬 Layer #3: ON" : "󰅖 Layer #3: OFF"
                                active: root.layer3Enabled
                                onClicked: {
                                    root.layer3Enabled = !root.layer3Enabled
                                    vizCanvas.requestPaint()
                                    root.requestActionFeedback("Layer #3 Art/Words: " + (root.layer3Enabled ? "ON" : "OFF"))
                                }
                            }

                            VizPillButton {
                                text: "󰀥 Cover Art"
                                active: root.useAlbumArt && root.asciiMode !== "banner"
                                onClicked: {
                                    root.layer3Enabled = true
                                    root.useAlbumArt = true
                                    if (root.asciiMode === "banner") root.asciiMode = "braille"
                                    root.requestSetAsciiSourceMode("art")
                                    vizCanvas.requestPaint()
                                }
                            }

                            VizPillButton {
                                text: "󰬴 Song Words"
                                active: !root.useAlbumArt || root.asciiMode === "banner"
                                onClicked: {
                                    root.layer3Enabled = true
                                    root.useAlbumArt = false
                                    if (root.asciiMode === "banner") root.asciiMode = "braille"
                                    root.requestSetAsciiSourceMode("words")
                                    vizCanvas.requestPaint()
                                }
                            }

                            VizPillButton {
                                text: "⣿ Braille"
                                active: root.asciiMode !== "block"
                                onClicked: {
                                    root.layer3Enabled = true
                                    root.asciiMode = "braille"
                                    root.requestSetAsciiSourceMode("braille")
                                    vizCanvas.requestPaint()
                                }
                            }

                            VizPillButton {
                                text: "█ Block"
                                active: root.asciiMode === "block"
                                onClicked: {
                                    root.layer3Enabled = true
                                    root.asciiMode = "block"
                                    root.requestSetAsciiSourceMode("block")
                                    vizCanvas.requestPaint()
                                }
                            }

                            VizPillButton {
                                text: "󰒟 Randomise L3"
                                onClicked: root.randomiseLayer3()
                            }

                            VizPillButton {
                                text: root.layer3AutoRandomise ? "󰑐 Auto-Randomise L3: ON" : "󰑐 Auto-Randomise L3: OFF"
                                active: root.layer3AutoRandomise
                                onClicked: {
                                    root.layer3AutoRandomise = !root.layer3AutoRandomise
                                    root.requestActionFeedback("Layer #3 Auto-Randomise: " + (root.layer3AutoRandomise ? "ON" : "OFF"))
                                }
                            }

                            VizPillButton {
                                text: "󰒟 Shatter!"
                                urgent: true
                                onClicked: root.triggerShatterImpulse()
                            }

                            VizPillButton {
                                text: "󰍹 TTE"
                                urgent: true
                                onClicked: root.activateAndCycleTteInCanvas()
                            }
                        }

                        // Song Progress Arc Selector Row (0% -> 100% Song Journey Options)
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 5

                            Text {
                                text: "Song Progress Arc (0→100%):"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 10
                                font.bold: true
                                color: root.accentColour
                            }

                            Repeater {
                                model: Engine.TRACK_ARC_MODES.length
                                delegate: VizPillButton {
                                    required property int index
                                    text: Engine.TRACK_ARC_MODES[index]
                                    active: root.trackArcMode === index
                                    horizontalPad: 7
                                    onClicked: {
                                        root.trackArcMode = index
                                        vizCanvas.requestPaint()
                                        root.requestActionFeedback("Song Progress Arc: " + Engine.TRACK_ARC_MODES[index])
                                    }
                                }
                            }
                        }

                        // Direct 6-Mode Pill Selector for Layer #3 (Never alters Layer #1 or Layer #2!)
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 5

                            Repeater {
                                model: Engine.LAYER3_MODES.length
                                delegate: VizPillButton {
                                    required property int index
                                    text: (index + 1) + " " + Engine.LAYER3_MODES[index]
                                    active: root.layer3Mode === index
                                    horizontalPad: 7
                                    onClicked: {
                                        root.layer3Enabled = true
                                        root.layer3Mode = index
                                        vizCanvas.requestPaint()
                                        root.requestActionFeedback("Layer #3 Mode: " + Engine.LAYER3_MODES[index])
                                    }
                                }
                            }
                        }

                        // 2-Column Parameter Sliders for Layer #3
                        GridLayout {
                            Layout.fillWidth: true
                            columns: 2
                            columnSpacing: 16
                            rowSpacing: 6

                            LayerSlider {
                                label: "Dismantle Force"
                                value: root.layer3Dismantle
                                minValue: 0.10
                                maxValue: 2.50
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer3Dismantle = v; vizCanvas.requestPaint() }
                            }

                            LayerSlider {
                                label: "Rebuild Cohesion"
                                value: root.layer3Rebuild
                                minValue: 0.10
                                maxValue: 2.50
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer3Rebuild = v; vizCanvas.requestPaint() }
                            }

                            LayerSlider {
                                label: "Song Evolution"
                                value: root.layer3Evolution
                                minValue: 0.10
                                maxValue: 2.50
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer3Evolution = v; vizCanvas.requestPaint() }
                            }

                            LayerSlider {
                                label: "Art Matrix Scale"
                                value: root.layer3Scale
                                minValue: 0.50
                                maxValue: 1.85
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer3Scale = v; vizCanvas.requestPaint() }
                            }

                            LayerSlider {
                                label: "L3 Tracer Echoes"
                                value: root.layer3Tracers
                                minValue: 1
                                maxValue: 8
                                integerSteps: true
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer3Tracers = Math.round(v); vizCanvas.requestPaint() }
                            }
                        }
                    }
                }
            }
        }
    }

    // =========================================================================
    // BOTTOM TRACK, INTERACTIVE PROGRESS SCRUBBER (0%->100%) & TRANSPORT HUD
    // (Only shown in fullscreen visualiser mode; embedded view uses main footer)
    // =========================================================================
    Rectangle {
        id: bottomHud
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 8
        height: 68
        radius: 8
        color: Qt.rgba(0.04, 0.05, 0.08, 0.88)
        border.width: 1
        border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.30)
        visible: root.showHud && root.isFullscreen

        readonly property real trackRatio: root.duration > 0.5 ? Math.max(0.0, Math.min(1.0, root.position / root.duration)) : 0.0
        readonly property int trackPercent: Math.round(trackRatio * 100)

        ColumnLayout {
            anchors.fill: parent
            anchors.leftMargin: 10
            anchors.rightMargin: 10
            anchors.topMargin: 5
            anchors.bottomMargin: 5
            spacing: 4

            // Top Row inside Bottom HUD: Interactive Track Progress & Seek Scrubber Bar (0% -> 100%)
            RowLayout {
                Layout.fillWidth: true
                spacing: 8

                Text {
                    text: root.formatTime(root.position)
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 10
                    font.bold: true
                    color: root.accentColour
                }

                // Interactive Seek & Song-Arc Progress Bar
                Rectangle {
                    id: seekBarTrack
                    Layout.fillWidth: true
                    Layout.preferredHeight: 8
                    radius: 4
                    color: Qt.rgba(1, 1, 1, 0.12)
                    border.width: 1
                    border.color: Qt.rgba(1, 1, 1, 0.18)

                    // Quarter-track chapter markers (25% / 50% / 75% Climax)
                    Repeater {
                        model: [0.25, 0.50, 0.75]
                        delegate: Rectangle {
                            required property real modelData
                            x: parent.width * modelData
                            width: 1
                            height: parent.height
                            color: modelData === 0.75
                                ? Qt.rgba(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 0.55)
                                : Qt.rgba(1, 1, 1, 0.22)
                        }
                    }

                    Rectangle {
                        width: parent.width * bottomHud.trackRatio
                        height: parent.height
                        radius: 4
                        color: bottomHud.trackRatio >= 0.70 && bottomHud.trackRatio <= 0.85
                            ? root.urgentColour
                            : root.accentColour
                    }

                    Rectangle {
                        x: Math.max(0, Math.min(parent.width - width, parent.width * bottomHud.trackRatio - width * 0.5))
                        anchors.verticalCenter: parent.verticalCenter
                        width: 12
                        height: 12
                        radius: 6
                        color: seekMouseArea.pressed ? root.urgentColour : "#ffffff"
                        border.width: 2
                        border.color: root.accentColour
                    }

                    MouseArea {
                        id: seekMouseArea
                        anchors.fill: parent
                        anchors.topMargin: -5
                        anchors.bottomMargin: -5
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        function seekAtX(mx) {
                            if (root.duration > 0.5) {
                                var ratio = Math.max(0.0, Math.min(1.0, mx / Math.max(1, seekBarTrack.width)))
                                var targetSec = ratio * root.duration
                                root.position = targetSec
                                root.requestSeek(targetSec)
                                vizCanvas.requestPaint()
                            }
                        }
                        onPressed: mouse => seekAtX(mouse.x)
                        onPositionChanged: mouse => { if (pressed) seekAtX(mouse.x) }
                    }
                }

                Text {
                    text: bottomHud.trackPercent + "% · -" + root.formatTime(Math.max(0, root.duration - root.position)) + " / " + root.formatTime(root.duration)
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 10
                    color: root.foregroundColour
                }

                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "Arc: " + (Engine.TRACK_ARC_MODES[root.trackArcMode] || "Climax").split(" ")[0]
                    active: root.trackArcMode > 0
                    horizontalPad: 6
                    pillHeight: 18
                    fontSize: 9
                    onClicked: root.cycleTrackArcMode()
                }
            }

            // Bottom Row inside Bottom HUD: Vinyl Badge + Track Metadata + Live 4-Bar Audio Telemetry + Transport
            RowLayout {
                Layout.fillWidth: true
                spacing: 10

                // Clicking the mini vinyl badge switches to the full Turntable stage
                Item {
                    Layout.preferredWidth: 34
                    Layout.preferredHeight: 34

                    Vinyl {
                        anchors.fill: parent
                        artPath: root.artPath
                        spinning: root.playing && root.showHud
                        accentColour: root.accentColour
                        bassLevel: root.liveBass
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            root.setStage(root.stageMode === "turntable" ? "visualiser" : "turntable")
                        }
                    }
                }

                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: 1

                    Text {
                        Layout.fillWidth: true
                        text: root.trackTitle || "Bandarchy Psychedelic Stage"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 11
                        font.bold: true
                        color: root.foregroundColour
                        elide: Text.ElideRight
                    }

                    Text {
                        Layout.fillWidth: true
                        text: (root.trackArtist ? root.trackArtist : "Bandarchy") +
                              (root.trackAlbum ? (" · " + root.trackAlbum) : "") +
                              "  [L: Layers & Presets · G: L1 Field · M: L2 Viz · E: L3 Art · K: L2 Tracers · T: TTE · F: Full]"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 9
                        color: Qt.rgba(root.foregroundColour.r, root.foregroundColour.g, root.foregroundColour.b, 0.72)
                        elide: Text.ElideRight
                    }
                }

                // Live 4-Bar Audio Telemetry Meter (BASS / MID / HIGH / BEAT)
                Rectangle {
                    Layout.preferredWidth: 92
                    Layout.preferredHeight: 30
                    radius: 5
                    color: Qt.rgba(1, 1, 1, 0.05)
                    border.width: 1
                    border.color: root.liveBeat > 0.35 ? root.urgentColour : Qt.rgba(1, 1, 1, 0.14)

                    RowLayout {
                        anchors.fill: parent
                        anchors.margins: 3
                        spacing: 4

                        Repeater {
                            model: 4

                            delegate: ColumnLayout {
                                required property int index
                                readonly property string barTag: index === 0 ? "B" : (index === 1 ? "M" : (index === 2 ? "H" : "!"))
                                readonly property real barVal: index === 0 ? root.liveBass : (index === 1 ? root.liveMid : (index === 2 ? root.liveHigh : root.liveBeat))
                                readonly property color barCol: index === 0 ? root.accentColour : (index === 1 ? "#38bdf8" : (index === 2 ? "#c084fc" : root.urgentColour))
                                Layout.fillWidth: true
                                Layout.fillHeight: true
                                spacing: 1

                                Item {
                                    Layout.fillWidth: true
                                    Layout.fillHeight: true

                                    Rectangle {
                                        anchors.bottom: parent.bottom
                                        width: parent.width
                                        height: Math.max(2, parent.height * Math.min(1.0, parent.parent.barVal))
                                        radius: 2
                                        color: parent.parent.barCol
                                    }
                                }

                                Text {
                                    Layout.alignment: Qt.AlignHCenter
                                    text: parent.barTag
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 7
                                    font.bold: true
                                    color: root.foregroundColour
                                }
                            }
                        }
                    }
                }

                RowLayout {
                    spacing: 6

                    VizPillButton {
                        text: "󰒮"
                        fontSize: 13
                        horizontalPad: 8
                        pillHeight: 26
                        onClicked: root.requestPrev()
                    }

                    VizPillButton {
                        text: root.playing ? "󰏤" : "󰐊"
                        active: true
                        fontSize: 14
                        horizontalPad: 10
                        pillHeight: 26
                        onClicked: root.requestPlayPause()
                    }

                    VizPillButton {
                        text: "󰒭"
                        fontSize: 13
                        horizontalPad: 8
                        pillHeight: 26
                        onClicked: root.requestNext()
                    }
                }
            }
        }
    }
}
