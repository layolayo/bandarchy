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
    readonly property var backdropModes: Engine.BACKDROP_MODES
    readonly property var paletteNames: Engine.PALETTE_NAMES
    readonly property var trackArcModes: Engine.TRACK_ARC_MODES

    // Global Music-Driven Modulation, Independent GPU Shader Backdrop, Song Arc & 3D History Tracer state
    property bool musicDrive: true
    property bool gpuShaderEnabled: true
    property bool backdropEnabled: true
    property int backdropMode: 0 // 0..6 in Engine.BACKDROP_MODES
    property real backdropSpeed: 1.0
    property real backdropIntensity: 1.0
    property int backdropSymmetry: 6
    property int backdropDirection: 1 // 1 = Towards User, -1 = To Endpoint, 0 = Breathe
    property int hudFocusedLayer: 2 // 1 = L1 Strip, 2 = L2 Strip, 3 = L3 Strip on Row 2 of topHud
    property int trackArcMode: 0 // 0 = Dynamic Audio Arc, 1 = Climax (75%), 2 = Dismantle, 3 = Rebuild, 4 = Quarters
    property int tracerCount: 4
    property real tracerSpeed: 1.15
    property real tracerDrift: 1.00
    property int tracerDirection: 1 // 1 = Towards User, -1 = To Endpoint, 0 = Breathe
    property bool showTracerPopover: false

    // General & Quality settings (exposed in Tab 4: 󰒓 General & Quality of layerDrawer)
    property int renderQuality: 1 // 0 = Low (384p), 1 = Balanced (480p), 2 = High (560p), 3 = Ultra (640p)
    property int renderResW: 480
    property int targetFps: 48 // 30, 48, or 60 FPS
    property real geometryDetail: 1.0 // 0.5x .. 2.0x global vertex/segment/grid density multiplier
    property bool antialiasingEnabled: true
    property real audioSensitivity: 1.35 // 0.35x .. 3.00x global audio gain
    property real beatPunch: 1.15 // 0.25x .. 2.50x beat kick impulse strength
    property real audioSmoothing: 0.50 // 0.10 .. 0.90 FFT attack/decay smoothing
    property real colourCycleSpeed: 1.00 // 0.00x .. 2.50x hue rotation speed
    property real masterBrightness: 1.00 // 0.30x .. 1.60x master visualiser brightness
    property int autoCycleIntervalSec: 18 // 5s .. 60s global auto-cycle interval
    property real frameAccumDt: 0.0
    property int telemetryTick: 0

    // Layer #1 — 3 Independent Sub-Systems:
    //   (1) L1 Field (`layer1FieldEnabled` + `layer1Mode` 0..6)
    //   (2) L1 Equaliser (`layer1EqEnabled` + `layer1EqStyle` 0..6 + `layer1EqLayout` 0..2 + `layer1EqDamping` 0..2 + `layer1EqGain`)
    //   (3) L1 Beat Shapes (`layer1ShapesEnabled` + `layer1ShapeStyle` 0..5 + spin/speed/scale)
    property bool layer1Enabled: true
    property bool layer1AutoRandomise: false
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
    property bool layer2AutoRandomise: false
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
    property bool layer3AutoRandomise: false
    property int layer3Mode: 0
    property real layer3Dismantle: 1.15
    property real layer3Rebuild: 1.0
    property real layer3Evolution: 0.90
    property real layer3Scale: 1.0
    property int layer3Tracers: 3

    // Individual Layer Saved Settings (`savedL1Configs`, `savedL2Configs`, `savedL3Configs`)
    // Applying a saved item for L1, L2, or L3 ONLY updates that single layer!
    property int currentSavedL1Index: 0
    property var savedL1Configs: [
        {
            name: "TRON Horizon & Skyline EQ",
            l1FieldEnabled: true, l1Mode: 4, l1Persistence: 0.84, l1Speed: 1.10, l1Density: 1.15, l1Dim: 0.14,
            l1EqEnabled: true, l1EqStyle: 0, l1EqLayout: 0, l1EqGain: 1.35, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 2, l1ShapeSpin: 1.00, l1ShapeSpeed: 1.05, l1ShapeScale: 1.00,
            l1AutoRandomise: false
        },
        {
            name: "Death Star Trench & X-Wings",
            l1FieldEnabled: true, l1Mode: 5, l1Persistence: 0.84, l1Speed: 1.20, l1Density: 1.15, l1Dim: 0.14,
            l1EqEnabled: false, l1EqStyle: 1, l1EqLayout: 1, l1EqGain: 1.25, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 1, l1ShapeSpin: 0.85, l1ShapeSpeed: 1.15, l1ShapeScale: 1.05,
            l1AutoRandomise: false
        }
    ]

    property int currentSavedL2Index: 0
    property var savedL2Configs: [
        {
            name: "Minter VLM 8x Tunnel",
            l2Mode: 4, symmetryIndex: 3, sensitivity: 1.50, l2Complexity: 1.20, l2Speed: 1.20, l2Zoom: 1.05, l2Chaos: 0.50,
            tracerCount: 8, tracerSpeed: 1.30, tracerDrift: 1.10, tracerDirection: 1,
            l2AutoRandomise: false
        },
        {
            name: "MilkDrop Cathedral 6x",
            l2Mode: 0, symmetryIndex: 3, sensitivity: 1.35, l2Complexity: 1.10, l2Speed: 1.05, l2Zoom: 1.00, l2Chaos: 0.45,
            tracerCount: 6, tracerSpeed: 1.15, tracerDrift: 1.00, tracerDirection: 1,
            l2AutoRandomise: false
        }
    ]

    property int currentSavedL3Index: 0
    property var savedL3Configs: [
        {
            name: "Art · Braille · Shatter",
            l3Mode: 0, useAlbumArt: true, asciiMode: "braille",
            l3Dismantle: 1.15, l3Rebuild: 1.05, l3Evolution: 0.90, l3Scale: 1.00, l3Tracers: 3,
            trackArcMode: 0, l3AutoRandomise: false
        },
        {
            name: "Words · Braille · TTE Morph",
            l3Mode: 5, useAlbumArt: false, asciiMode: "braille",
            l3Dismantle: 1.10, l3Rebuild: 1.10, l3Evolution: 1.05, l3Scale: 1.00, l3Tracers: 4,
            trackArcMode: 1, l3AutoRandomise: false
        },
        {
            name: "Art · Block · Blackhole",
            l3Mode: 2, useAlbumArt: true, asciiMode: "block",
            l3Dismantle: 1.25, l3Rebuild: 1.00, l3Evolution: 0.95, l3Scale: 1.05, l3Tracers: 4,
            trackArcMode: 0, l3AutoRandomise: false
        }
    ]

    // Disk persistence binding (`Service.visualiserConfig` <-> `~/.config/bandarchy/visualiser.json`)
    property var persistedConfig: ({})
    property bool _applyingPersistedConfig: false
    signal requestSaveVisualiserConfig(var configObj)

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
    property int activeConfigLayer: 2 // 0 = Presets (L1+L2+L3), 1 = Layer 1, 2 = Layer 2, 3 = Layer 3, 4 = GPU Backdrop
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

    onGpuShaderEnabledChanged: {
        if (root.backdropEnabled !== root.gpuShaderEnabled) {
            root.backdropEnabled = root.gpuShaderEnabled
        }
        scheduleSaveVisualiserConfig()
    }
    onBackdropEnabledChanged: {
        if (root.gpuShaderEnabled !== root.backdropEnabled) {
            root.gpuShaderEnabled = root.backdropEnabled
        }
        scheduleSaveVisualiserConfig()
    }
    onBackdropModeChanged: scheduleSaveVisualiserConfig()
    onBackdropSpeedChanged: scheduleSaveVisualiserConfig()
    onBackdropIntensityChanged: scheduleSaveVisualiserConfig()
    onBackdropSymmetryChanged: scheduleSaveVisualiserConfig()
    onBackdropDirectionChanged: scheduleSaveVisualiserConfig()
    onLayer1AutoRandomiseChanged: scheduleSaveVisualiserConfig()
    onLayer2AutoRandomiseChanged: scheduleSaveVisualiserConfig()
    onLayer3AutoRandomiseChanged: scheduleSaveVisualiserConfig()
    onPersistedConfigChanged: {
        if (root.persistedConfig && Object.keys(root.persistedConfig).length > 0) {
            root.applyPersistedConfig(root.persistedConfig)
        }
    }

    Timer {
        id: saveConfigDebounceTimer
        interval: 350
        repeat: false
        onTriggered: {
            if (!root._applyingPersistedConfig) {
                root.requestSaveVisualiserConfig(root.buildPersistedConfigSnapshot())
            }
        }
    }

    function scheduleSaveVisualiserConfig() {
        if (root._applyingPersistedConfig) return
        saveConfigDebounceTimer.restart()
    }

    function buildPersistedConfigSnapshot() {
        return {
            version: 1,
            paletteIndex: root.paletteIndex,
            musicDrive: root.musicDrive,
            gpuShaderEnabled: root.gpuShaderEnabled,
            backdropEnabled: root.backdropEnabled,
            backdropMode: root.backdropMode,
            backdropSpeed: root.backdropSpeed,
            backdropIntensity: root.backdropIntensity,
            backdropSymmetry: root.backdropSymmetry,
            backdropDirection: root.backdropDirection,
            trackArcMode: root.trackArcMode,
            tracerCount: root.tracerCount,
            tracerSpeed: root.tracerSpeed,
            tracerDrift: root.tracerDrift,
            tracerDirection: root.tracerDirection,
            renderQuality: root.renderQuality,
            renderResW: root.renderResW,
            targetFps: root.targetFps,
            geometryDetail: root.geometryDetail,
            antialiasingEnabled: root.antialiasingEnabled,
            audioSensitivity: root.audioSensitivity,
            beatPunch: root.beatPunch,
            audioSmoothing: root.audioSmoothing,
            colourCycleSpeed: root.colourCycleSpeed,
            masterBrightness: root.masterBrightness,
            autoCycleIntervalSec: root.autoCycleIntervalSec,
            presetTransitionIntervalSec: root.presetTransitionIntervalSec,
            autoCycle: root.autoCycle,
            layer1Enabled: root.layer1Enabled,
            layer1AutoRandomise: root.layer1AutoRandomise,
            layer1FieldEnabled: root.layer1FieldEnabled,
            layer1Mode: root.layer1Mode,
            layer1Persistence: root.layer1Persistence,
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
            layer2AutoRandomise: root.layer2AutoRandomise,
            visualMode: root.visualMode,
            symmetryIndex: root.symmetryIndex,
            sensitivity: root.sensitivity,
            layer2Complexity: root.layer2Complexity,
            layer2Speed: root.layer2Speed,
            layer2Zoom: root.layer2Zoom,
            layer2Chaos: root.layer2Chaos,
            layer3Enabled: root.layer3Enabled,
            layer3AutoRandomise: root.layer3AutoRandomise,
            layer3Mode: root.layer3Mode,
            useAlbumArt: root.useAlbumArt,
            asciiMode: root.asciiMode,
            layer3Dismantle: root.layer3Dismantle,
            layer3Rebuild: root.layer3Rebuild,
            layer3Evolution: root.layer3Evolution,
            layer3Scale: root.layer3Scale,
            layer3Tracers: root.layer3Tracers,
            savedL1Configs: root.savedL1Configs,
            savedL2Configs: root.savedL2Configs,
            savedL3Configs: root.savedL3Configs,
            collectivePresets: root.collectivePresets
        }
    }

    function applyPersistedConfig(cfg) {
        if (!cfg || typeof cfg !== "object" || Object.keys(cfg).length === 0) return
        root._applyingPersistedConfig = true
        if (cfg.paletteIndex !== undefined) root.paletteIndex = Number(cfg.paletteIndex) % Engine.PALETTE_NAMES.length
        if (cfg.musicDrive !== undefined) root.musicDrive = Boolean(cfg.musicDrive)
        if (cfg.backdropEnabled !== undefined) {
            root.backdropEnabled = Boolean(cfg.backdropEnabled)
            root.gpuShaderEnabled = Boolean(cfg.backdropEnabled)
        } else if (cfg.gpuShaderEnabled !== undefined) {
            root.gpuShaderEnabled = Boolean(cfg.gpuShaderEnabled)
            root.backdropEnabled = Boolean(cfg.gpuShaderEnabled)
        }
        if (cfg.backdropMode !== undefined) root.backdropMode = Number(cfg.backdropMode) % Engine.BACKDROP_MODES.length
        if (cfg.backdropSpeed !== undefined) root.backdropSpeed = Number(cfg.backdropSpeed)
        if (cfg.backdropIntensity !== undefined) root.backdropIntensity = Number(cfg.backdropIntensity)
        if (cfg.backdropSymmetry !== undefined) root.backdropSymmetry = Number(cfg.backdropSymmetry)
        if (cfg.backdropDirection !== undefined) root.backdropDirection = Number(cfg.backdropDirection)
        if (cfg.trackArcMode !== undefined) root.trackArcMode = Number(cfg.trackArcMode) % Engine.TRACK_ARC_MODES.length
        if (cfg.tracerCount !== undefined) root.tracerCount = Number(cfg.tracerCount)
        if (cfg.tracerSpeed !== undefined) root.tracerSpeed = Number(cfg.tracerSpeed)
        if (cfg.tracerDrift !== undefined) root.tracerDrift = Number(cfg.tracerDrift)
        if (cfg.tracerDirection !== undefined) root.tracerDirection = Number(cfg.tracerDirection)
        if (cfg.renderQuality !== undefined) root.renderQuality = Number(cfg.renderQuality)
        if (cfg.renderResW !== undefined) root.renderResW = Number(cfg.renderResW)
        if (cfg.targetFps !== undefined) root.targetFps = Number(cfg.targetFps)
        if (cfg.geometryDetail !== undefined) root.geometryDetail = Number(cfg.geometryDetail)
        if (cfg.antialiasingEnabled !== undefined) root.antialiasingEnabled = Boolean(cfg.antialiasingEnabled)
        if (cfg.audioSensitivity !== undefined) root.audioSensitivity = Number(cfg.audioSensitivity)
        if (cfg.beatPunch !== undefined) root.beatPunch = Number(cfg.beatPunch)
        if (cfg.audioSmoothing !== undefined) root.audioSmoothing = Number(cfg.audioSmoothing)
        if (cfg.colourCycleSpeed !== undefined) root.colourCycleSpeed = Number(cfg.colourCycleSpeed)
        if (cfg.masterBrightness !== undefined) root.masterBrightness = Number(cfg.masterBrightness)
        if (cfg.autoCycleIntervalSec !== undefined) root.autoCycleIntervalSec = Number(cfg.autoCycleIntervalSec)
        if (cfg.presetTransitionIntervalSec !== undefined) root.presetTransitionIntervalSec = Number(cfg.presetTransitionIntervalSec)
        if (cfg.autoCycle !== undefined) root.autoCycle = Boolean(cfg.autoCycle)

        if (cfg.layer1Enabled !== undefined) root.layer1Enabled = Boolean(cfg.layer1Enabled)
        if (cfg.layer1AutoRandomise !== undefined) root.layer1AutoRandomise = Boolean(cfg.layer1AutoRandomise)
        if (cfg.layer1FieldEnabled !== undefined) root.layer1FieldEnabled = Boolean(cfg.layer1FieldEnabled)
        if (cfg.layer1Mode !== undefined) root.layer1Mode = Number(cfg.layer1Mode) % Engine.LAYER1_MODES.length
        if (cfg.layer1Persistence !== undefined) root.layer1Persistence = Number(cfg.layer1Persistence)
        if (cfg.layer1Speed !== undefined) root.layer1Speed = Number(cfg.layer1Speed)
        if (cfg.layer1Density !== undefined) root.layer1Density = Number(cfg.layer1Density)
        if (cfg.layer1Dim !== undefined) root.layer1Dim = Number(cfg.layer1Dim)
        if (cfg.layer1EqEnabled !== undefined) root.layer1EqEnabled = Boolean(cfg.layer1EqEnabled)
        if (cfg.layer1EqStyle !== undefined) root.layer1EqStyle = Number(cfg.layer1EqStyle) % Engine.LAYER1_EQ_STYLES.length
        if (cfg.layer1EqLayout !== undefined) root.layer1EqLayout = Number(cfg.layer1EqLayout) % Engine.LAYER1_EQ_LAYOUTS.length
        if (cfg.layer1EqGain !== undefined) root.layer1EqGain = Number(cfg.layer1EqGain)
        if (cfg.layer1EqDamping !== undefined) root.layer1EqDamping = Number(cfg.layer1EqDamping) % Engine.LAYER1_EQ_DAMPING.length
        if (cfg.layer1ShapesEnabled !== undefined) root.layer1ShapesEnabled = Boolean(cfg.layer1ShapesEnabled)
        if (cfg.layer1ShapeStyle !== undefined) root.layer1ShapeStyle = Number(cfg.layer1ShapeStyle) % Engine.LAYER1_SHAPE_STYLES.length
        if (cfg.layer1ShapeSpin !== undefined) root.layer1ShapeSpin = Number(cfg.layer1ShapeSpin)
        if (cfg.layer1ShapeSpeed !== undefined) root.layer1ShapeSpeed = Number(cfg.layer1ShapeSpeed)
        if (cfg.layer1ShapeScale !== undefined) root.layer1ShapeScale = Number(cfg.layer1ShapeScale)

        if (cfg.layer2Enabled !== undefined) root.layer2Enabled = Boolean(cfg.layer2Enabled)
        if (cfg.layer2AutoRandomise !== undefined) root.layer2AutoRandomise = Boolean(cfg.layer2AutoRandomise)
        if (cfg.visualMode !== undefined) root.visualMode = Number(cfg.visualMode) % Engine.MODE_NAMES.length
        if (cfg.symmetryIndex !== undefined) root.symmetryIndex = Number(cfg.symmetryIndex) % Engine.SYMMETRY_OPTIONS.length
        if (cfg.sensitivity !== undefined) root.sensitivity = Number(cfg.sensitivity)
        if (cfg.layer2Complexity !== undefined) root.layer2Complexity = Number(cfg.layer2Complexity)
        if (cfg.layer2Speed !== undefined) root.layer2Speed = Number(cfg.layer2Speed)
        if (cfg.layer2Zoom !== undefined) root.layer2Zoom = Number(cfg.layer2Zoom)
        if (cfg.layer2Chaos !== undefined) root.layer2Chaos = Number(cfg.layer2Chaos)

        if (cfg.layer3Enabled !== undefined) root.layer3Enabled = Boolean(cfg.layer3Enabled)
        if (cfg.layer3AutoRandomise !== undefined) root.layer3AutoRandomise = Boolean(cfg.layer3AutoRandomise)
        if (cfg.layer3Mode !== undefined) root.layer3Mode = Number(cfg.layer3Mode) % Engine.LAYER3_MODES.length
        if (cfg.useAlbumArt !== undefined) root.useAlbumArt = Boolean(cfg.useAlbumArt)
        if (cfg.asciiMode !== undefined) root.asciiMode = String(cfg.asciiMode)
        if (cfg.layer3Dismantle !== undefined) root.layer3Dismantle = Number(cfg.layer3Dismantle)
        if (cfg.layer3Rebuild !== undefined) root.layer3Rebuild = Number(cfg.layer3Rebuild)
        if (cfg.layer3Evolution !== undefined) root.layer3Evolution = Number(cfg.layer3Evolution)
        if (cfg.layer3Scale !== undefined) root.layer3Scale = Number(cfg.layer3Scale)
        if (cfg.layer3Tracers !== undefined) root.layer3Tracers = Number(cfg.layer3Tracers)

        if (Array.isArray(cfg.savedL1Configs) && cfg.savedL1Configs.length > 0) root.savedL1Configs = cfg.savedL1Configs
        if (Array.isArray(cfg.savedL2Configs) && cfg.savedL2Configs.length > 0) root.savedL2Configs = cfg.savedL2Configs
        if (Array.isArray(cfg.savedL3Configs) && cfg.savedL3Configs.length > 0) root.savedL3Configs = cfg.savedL3Configs
        if (Array.isArray(cfg.collectivePresets) && cfg.collectivePresets.length > 0) root.collectivePresets = cfg.collectivePresets

        root._applyingPersistedConfig = false
        clearCanvasImmediate()
    }

    function resetAllVisualiserDefaults() {
        root.renderQuality = 1
        root.renderResW = 480
        root.targetFps = 48
        root.geometryDetail = 1.0
        root.antialiasingEnabled = true
        root.audioSensitivity = 1.35
        root.beatPunch = 1.15
        root.audioSmoothing = 0.50
        root.colourCycleSpeed = 1.00
        root.masterBrightness = 1.00
        root.autoCycleIntervalSec = 18
        root.presetTransitionIntervalSec = 10
        root.musicDrive = true
        root.backdropEnabled = true
        root.gpuShaderEnabled = true
        root.backdropMode = 0
        root.backdropSpeed = 1.0
        root.backdropIntensity = 1.0
        root.backdropSymmetry = 6
        root.backdropDirection = 1
        root.layer1Enabled = true
        root.layer1FieldEnabled = true
        root.layer1Mode = 0
        root.layer1EqEnabled = true
        root.layer1EqStyle = 0
        root.layer1ShapesEnabled = true
        root.layer1ShapeStyle = 0
        root.layer2Enabled = true
        root.visualMode = 0
        root.tracerCount = 4
        root.layer3Enabled = true
        root.layer3Mode = 0
        root.layer3Tracers = 3
        root.layer1AutoRandomise = false
        root.layer2AutoRandomise = false
        root.layer3AutoRandomise = false
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
        root.requestActionFeedback("Reset Visualiser & Quality Settings to Defaults")
    }

    // -------------------------------------------------------------------------
    // Individual Layer Saved Configurations (Strict Single-Layer Isolation!)
    // -------------------------------------------------------------------------
    function saveCurrentL1Config() {
        var copy = (root.savedL1Configs || []).slice()
        var fieldLabel = root.layer1FieldEnabled ? (Engine.LAYER1_MODES[root.layer1Mode] || "Field").split(" ")[0] : "NoField"
        var eqLabel = root.layer1EqEnabled ? (Engine.LAYER1_EQ_STYLES[root.layer1EqStyle] || "EQ").split(" ")[0] : "NoEQ"
        var shLabel = root.layer1ShapesEnabled ? (Engine.LAYER1_SHAPE_STYLES[root.layer1ShapeStyle] || "Shapes").split(" ")[0] : "NoShapes"
        var item = {
            name: fieldLabel + " · " + eqLabel + " · " + shLabel,
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
            l1AutoRandomise: root.layer1AutoRandomise
        }
        copy.push(item)
        root.savedL1Configs = copy
        root.currentSavedL1Index = copy.length - 1
        root.requestSaveVisualiserConfig(root.buildPersistedConfigSnapshot())
        root.requestActionFeedback("Saved L1 Setting: " + item.name)
    }

    function applySavedL1Config(idx) {
        var list = root.savedL1Configs || []
        if (idx < 0 || idx >= list.length) return
        var item = list[idx]
        root.currentSavedL1Index = idx
        // Strictly update ONLY Layer #1 properties — NEVER touch Layer #2 or Layer #3!
        root.layer1Enabled = true
        if (item.l1FieldEnabled !== undefined) root.layer1FieldEnabled = Boolean(item.l1FieldEnabled)
        if (item.l1Mode !== undefined) root.layer1Mode = Number(item.l1Mode) % Engine.LAYER1_MODES.length
        if (item.l1Persistence !== undefined) root.layer1Persistence = Number(item.l1Persistence)
        if (item.l1Speed !== undefined) root.layer1Speed = Number(item.l1Speed)
        if (item.l1Density !== undefined) root.layer1Density = Number(item.l1Density)
        if (item.l1Dim !== undefined) root.layer1Dim = Number(item.l1Dim)
        if (item.l1EqEnabled !== undefined) root.layer1EqEnabled = Boolean(item.l1EqEnabled)
        if (item.l1EqStyle !== undefined) root.layer1EqStyle = Number(item.l1EqStyle) % Engine.LAYER1_EQ_STYLES.length
        if (item.l1EqLayout !== undefined) root.layer1EqLayout = Number(item.l1EqLayout) % Engine.LAYER1_EQ_LAYOUTS.length
        if (item.l1EqGain !== undefined) root.layer1EqGain = Number(item.l1EqGain)
        if (item.l1EqDamping !== undefined) root.layer1EqDamping = Number(item.l1EqDamping) % Engine.LAYER1_EQ_DAMPING.length
        if (item.l1ShapesEnabled !== undefined) root.layer1ShapesEnabled = Boolean(item.l1ShapesEnabled)
        if (item.l1ShapeStyle !== undefined) root.layer1ShapeStyle = Number(item.l1ShapeStyle) % Engine.LAYER1_SHAPE_STYLES.length
        if (item.l1ShapeSpin !== undefined) root.layer1ShapeSpin = Number(item.l1ShapeSpin)
        if (item.l1ShapeSpeed !== undefined) root.layer1ShapeSpeed = Number(item.l1ShapeSpeed)
        if (item.l1ShapeScale !== undefined) root.layer1ShapeScale = Number(item.l1ShapeScale)
        if (item.l1AutoRandomise !== undefined) root.layer1AutoRandomise = Boolean(item.l1AutoRandomise)
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
        root.requestActionFeedback("Applied Saved L1: " + (item.name || ("L1 #" + (idx + 1))))
    }

    function cycleSavedL1Config(delta) {
        var list = root.savedL1Configs || []
        if (list.length === 0) return
        var step = (delta !== undefined && delta < 0) ? -1 : 1
        var nextIdx = (root.currentSavedL1Index + step + list.length) % list.length
        applySavedL1Config(nextIdx)
    }

    function deleteSavedL1Config(idx) {
        var copy = (root.savedL1Configs || []).slice()
        if (idx < 0 || idx >= copy.length) return
        var removed = copy.splice(idx, 1)[0]
        root.savedL1Configs = copy
        root.currentSavedL1Index = Math.max(0, Math.min(copy.length - 1, root.currentSavedL1Index))
        root.requestSaveVisualiserConfig(root.buildPersistedConfigSnapshot())
        root.requestActionFeedback("Removed Saved L1: " + (removed && removed.name ? removed.name : ""))
    }

    function saveCurrentL2Config() {
        var copy = (root.savedL2Configs || []).slice()
        var mName = (Engine.MODE_NAMES[root.visualMode] || "Mode").split(" ")[0]
        var item = {
            name: mName + " · " + root.tracerCount + "x Tracers · " + root.symmetryFolds + "x",
            l2Mode: root.visualMode,
            symmetryIndex: root.symmetryIndex,
            sensitivity: root.sensitivity,
            l2Complexity: root.layer2Complexity,
            l2Speed: root.layer2Speed,
            l2Zoom: root.layer2Zoom,
            l2Chaos: root.layer2Chaos,
            tracerCount: root.tracerCount,
            tracerSpeed: root.tracerSpeed,
            tracerDrift: root.tracerDrift,
            tracerDirection: root.tracerDirection,
            l2AutoRandomise: root.layer2AutoRandomise
        }
        copy.push(item)
        root.savedL2Configs = copy
        root.currentSavedL2Index = copy.length - 1
        root.requestSaveVisualiserConfig(root.buildPersistedConfigSnapshot())
        root.requestActionFeedback("Saved L2 Setting: " + item.name)
    }

    function applySavedL2Config(idx) {
        var list = root.savedL2Configs || []
        if (idx < 0 || idx >= list.length) return
        var item = list[idx]
        root.currentSavedL2Index = idx
        // Strictly update ONLY Layer #2 properties — NEVER touch Layer #1 or Layer #3!
        root.layer2Enabled = true
        if (item.l2Mode !== undefined) root.visualMode = Number(item.l2Mode) % Engine.MODE_NAMES.length
        if (item.symmetryIndex !== undefined) root.symmetryIndex = Number(item.symmetryIndex) % Engine.SYMMETRY_OPTIONS.length
        if (item.sensitivity !== undefined) root.sensitivity = Number(item.sensitivity)
        if (item.l2Complexity !== undefined) root.layer2Complexity = Number(item.l2Complexity)
        if (item.l2Speed !== undefined) root.layer2Speed = Number(item.l2Speed)
        if (item.l2Zoom !== undefined) root.layer2Zoom = Number(item.l2Zoom)
        if (item.l2Chaos !== undefined) root.layer2Chaos = Number(item.l2Chaos)
        if (item.tracerCount !== undefined) root.tracerCount = Number(item.tracerCount)
        if (item.tracerSpeed !== undefined) root.tracerSpeed = Number(item.tracerSpeed)
        if (item.tracerDrift !== undefined) root.tracerDrift = Number(item.tracerDrift)
        if (item.tracerDirection !== undefined) root.tracerDirection = Number(item.tracerDirection)
        if (item.l2AutoRandomise !== undefined) root.layer2AutoRandomise = Boolean(item.l2AutoRandomise)
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
        root.requestActionFeedback("Applied Saved L2: " + (item.name || ("L2 #" + (idx + 1))))
    }

    function cycleSavedL2Config(delta) {
        var list = root.savedL2Configs || []
        if (list.length === 0) return
        var step = (delta !== undefined && delta < 0) ? -1 : 1
        var nextIdx = (root.currentSavedL2Index + step + list.length) % list.length
        applySavedL2Config(nextIdx)
    }

    function deleteSavedL2Config(idx) {
        var copy = (root.savedL2Configs || []).slice()
        if (idx < 0 || idx >= copy.length) return
        var removed = copy.splice(idx, 1)[0]
        root.savedL2Configs = copy
        root.currentSavedL2Index = Math.max(0, Math.min(copy.length - 1, root.currentSavedL2Index))
        root.requestSaveVisualiserConfig(root.buildPersistedConfigSnapshot())
        root.requestActionFeedback("Removed Saved L2: " + (removed && removed.name ? removed.name : ""))
    }

    function saveCurrentL3Config() {
        var copy = (root.savedL3Configs || []).slice()
        var srcLabel = root.useAlbumArt ? "Art" : "Words"
        var glyphLabel = root.asciiMode === "block" ? "Block" : "Braille"
        var modeLabel = (Engine.LAYER3_MODES[root.layer3Mode] || "Shatter").split(" ")[0]
        var item = {
            name: srcLabel + " · " + glyphLabel + " · " + modeLabel + " (" + root.layer3Tracers + "x)",
            l3Mode: root.layer3Mode,
            useAlbumArt: root.useAlbumArt,
            asciiMode: root.asciiMode === "block" ? "block" : "braille",
            l3Dismantle: root.layer3Dismantle,
            l3Rebuild: root.layer3Rebuild,
            l3Evolution: root.layer3Evolution,
            l3Scale: root.layer3Scale,
            l3Tracers: root.layer3Tracers,
            trackArcMode: root.trackArcMode,
            l3AutoRandomise: root.layer3AutoRandomise
        }
        copy.push(item)
        root.savedL3Configs = copy
        root.currentSavedL3Index = copy.length - 1
        root.requestSaveVisualiserConfig(root.buildPersistedConfigSnapshot())
        root.requestActionFeedback("Saved L3 Setting: " + item.name)
    }

    function applySavedL3Config(idx) {
        var list = root.savedL3Configs || []
        if (idx < 0 || idx >= list.length) return
        var item = list[idx]
        root.currentSavedL3Index = idx
        // Strictly update ONLY Layer #3 properties — NEVER touch Layer #1 or Layer #2!
        root.layer3Enabled = true
        if (item.l3Mode !== undefined) root.layer3Mode = Number(item.l3Mode) % Engine.LAYER3_MODES.length
        if (item.useAlbumArt !== undefined) {
            root.useAlbumArt = Boolean(item.useAlbumArt)
            root.requestSetAsciiSourceMode(root.useAlbumArt ? "art" : "words")
        }
        if (item.asciiMode !== undefined) {
            root.asciiMode = item.asciiMode === "block" ? "block" : "braille"
            root.requestSetAsciiSourceMode(root.asciiMode)
        }
        if (item.l3Dismantle !== undefined) root.layer3Dismantle = Number(item.l3Dismantle)
        if (item.l3Rebuild !== undefined) root.layer3Rebuild = Number(item.l3Rebuild)
        if (item.l3Evolution !== undefined) root.layer3Evolution = Number(item.l3Evolution)
        if (item.l3Scale !== undefined) root.layer3Scale = Number(item.l3Scale)
        if (item.l3Tracers !== undefined) root.layer3Tracers = Number(item.l3Tracers)
        if (item.trackArcMode !== undefined) root.trackArcMode = Number(item.trackArcMode) % Engine.TRACK_ARC_MODES.length
        if (item.l3AutoRandomise !== undefined) root.layer3AutoRandomise = Boolean(item.l3AutoRandomise)
        if (root.layer3Mode === 5) {
            root.requestSelectTtfxEffect("random")
        }
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
        root.requestActionFeedback("Applied Saved L3: " + (item.name || ("L3 #" + (idx + 1))))
    }

    function cycleSavedL3Config(delta) {
        var list = root.savedL3Configs || []
        if (list.length === 0) return
        var step = (delta !== undefined && delta < 0) ? -1 : 1
        var nextIdx = (root.currentSavedL3Index + step + list.length) % list.length
        applySavedL3Config(nextIdx)
    }

    function deleteSavedL3Config(idx) {
        var copy = (root.savedL3Configs || []).slice()
        if (idx < 0 || idx >= copy.length) return
        var removed = copy.splice(idx, 1)[0]
        root.savedL3Configs = copy
        root.currentSavedL3Index = Math.max(0, Math.min(copy.length - 1, root.currentSavedL3Index))
        root.requestSaveVisualiserConfig(root.buildPersistedConfigSnapshot())
        root.requestActionFeedback("Removed Saved L3: " + (removed && removed.name ? removed.name : ""))
    }

    function clearCanvasImmediate() {
        root._cachedFrameConfig = root.currentConfig()
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

    function syncLayer1MasterFromSubs() {
        if (!root.layer1FieldEnabled && !root.layer1EqEnabled && !root.layer1ShapesEnabled) {
            if (root.layer1Enabled) root.layer1Enabled = false
        }
    }

    onLayer1EnabledChanged: {
        if (root.layer1Enabled && !root.layer1FieldEnabled && !root.layer1EqEnabled && !root.layer1ShapesEnabled) {
            root.layer1FieldEnabled = true
        }
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }
    onLayer1FieldEnabledChanged: {
        syncLayer1MasterFromSubs()
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }
    onLayer1EqEnabledChanged: {
        syncLayer1MasterFromSubs()
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }
    onLayer1ShapesEnabledChanged: {
        syncLayer1MasterFromSubs()
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }
    onLayer1ModeChanged: { clearCanvasImmediate(); scheduleSaveVisualiserConfig() }
    onLayer1EqStyleChanged: { clearCanvasImmediate(); scheduleSaveVisualiserConfig() }
    onLayer1ShapeStyleChanged: { clearCanvasImmediate(); scheduleSaveVisualiserConfig() }
    onLayer2EnabledChanged: { clearCanvasImmediate(); scheduleSaveVisualiserConfig() }
    onLayer3EnabledChanged: { clearCanvasImmediate(); scheduleSaveVisualiserConfig() }
    onLayer3ModeChanged: scheduleSaveVisualiserConfig()
    onTracerCountChanged: scheduleSaveVisualiserConfig()
    onLayer3TracersChanged: scheduleSaveVisualiserConfig()

    onBannerLinesChanged: {
        if (root.engineState) {
            root.engineState.artSourceKey = ""
            root.engineState.l3FormFactor = 1.0
            root.engineState.artBurst = 0.0
        }
        if (vizCanvas) vizCanvas.requestPaint()
    }

    onArtLinesChanged: {
        if (root.engineState) {
            root.engineState.artSourceKey = ""
            root.engineState.l3FormFactor = 1.0
            root.engineState.artBurst = 0.0
        }
        if (vizCanvas) vizCanvas.requestPaint()
    }

    onUseAlbumArtChanged: {
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
    }

    // Strict Layer Isolation: changing visualMode (Layer #2) NEVER turns on Layer #1 or Layer #3!
    onVisualModeChanged: {
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
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
            backdropEnabled: root.backdropEnabled,
            backdropMode: root.backdropMode,
            backdropSpeed: root.backdropSpeed,
            backdropIntensity: root.backdropIntensity,
            backdropSymmetry: root.backdropSymmetry,
            backdropDirection: root.backdropDirection,
            renderQuality: root.renderQuality,
            targetFps: root.targetFps,
            geometryDetail: root.geometryDetail,
            antialiasing: root.antialiasingEnabled,
            audioSensitivity: root.audioSensitivity,
            beatPunch: root.beatPunch,
            audioSmoothing: root.audioSmoothing,
            colourCycleSpeed: root.colourCycleSpeed,
            masterBrightness: root.masterBrightness,
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
        scheduleSaveVisualiserConfig()
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
            root.requestSaveVisualiserConfig(root.buildPersistedConfigSnapshot())
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
        root.requestSaveVisualiserConfig(root.buildPersistedConfigSnapshot())
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

    function cycleBackdropMode(delta) {
        var count = Engine.BACKDROP_MODES.length
        root.backdropMode = (root.backdropMode + delta + count) % count
        root.backdropEnabled = true
        vizCanvas.requestPaint()
        root.requestActionFeedback("GPU Backdrop: " + Engine.BACKDROP_MODES[root.backdropMode])
    }

    function cyclePalette(delta) {
        var count = Engine.PALETTE_NAMES.length
        paletteIndex = (paletteIndex + delta + count) % count
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
        root.requestActionFeedback("Palette: " + Engine.PALETTE_NAMES[paletteIndex])
    }

    function cycleSymmetry() {
        symmetryIndex = (symmetryIndex + 1) % Engine.SYMMETRY_OPTIONS.length
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
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

    function cycleLayer3Tracers(delta) {
        var step = (delta !== undefined && delta < 0) ? -1 : 1
        var nextVal = ((root.layer3Tracers - 1 + step + 8) % 8) + 1
        root.layer3Tracers = nextVal
        vizCanvas.requestPaint()
        root.requestActionFeedback("L3 Art Ghost Tracers: " + root.layer3Tracers + "x")
    }

    function cycleTrackArcMode() {
        root.trackArcMode = (root.trackArcMode + 1) % Engine.TRACK_ARC_MODES.length
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
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

    function randomiseLayer1() {
        root.layer1Enabled = true
        if (root.layer1FieldEnabled) {
            root.layer1Mode = (root.layer1Mode + 1 + Math.floor(Math.random() * Math.max(1, Engine.LAYER1_MODES.length - 1))) % Engine.LAYER1_MODES.length
        }
        if (root.layer1EqEnabled) {
            root.layer1EqStyle = (root.layer1EqStyle + 1 + Math.floor(Math.random() * Math.max(1, Engine.LAYER1_EQ_STYLES.length - 1))) % Engine.LAYER1_EQ_STYLES.length
        }
        if (root.layer1ShapesEnabled) {
            root.layer1ShapeStyle = (root.layer1ShapeStyle + 1 + Math.floor(Math.random() * Math.max(1, Engine.LAYER1_SHAPE_STYLES.length - 1))) % Engine.LAYER1_SHAPE_STYLES.length
        }
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
        root.requestActionFeedback("Layer #1 Randomised: " + Engine.LAYER1_MODES[root.layer1Mode])
    }

    function randomiseLayer2() {
        root.layer2Enabled = true
        var total = Engine.MODE_NAMES.length
        var nextM = (root.visualMode + 1 + Math.floor(Math.random() * Math.max(1, total - 1))) % total
        root.visualMode = nextM
        root.symmetryIndex = Math.floor(Math.random() * Engine.SYMMETRY_OPTIONS.length)
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
        root.requestActionFeedback("Layer #2 Randomised: " + Engine.MODE_NAMES[nextM])
    }

    function randomiseLayer3() {
        var total = Engine.LAYER3_MODES.length
        var nextM = (root.layer3Mode + 1 + Math.floor(Math.random() * Math.max(1, total - 1))) % total
        root.layer3Mode = nextM
        if (root.engineState) {
            root.engineState.l3FormFactor = 0.25
        }
        Engine.shatterAlbumArt(root.engineState, 0.95)
        if (nextM === 5) {
            root.requestSelectTtfxEffect("random")
        }
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
        root.requestActionFeedback("Layer #3 Randomised: " + Engine.LAYER3_MODES[nextM])
    }

    function randomiseVisuals() {
        Engine.randomiseState(root.engineState)
        paletteIndex = (paletteIndex + 1 + Math.floor(Math.random() * (Engine.PALETTE_NAMES.length - 1))) % Engine.PALETTE_NAMES.length
        if (root.layer1Enabled) {
            root.randomiseLayer1()
        }
        if (root.layer2Enabled) {
            root.randomiseLayer2()
        }
        if (root.layer3Enabled) {
            root.randomiseLayer3()
        }
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
        root.requestActionFeedback("Randomised active layers & palette (" + Engine.PALETTE_NAMES[paletteIndex] + ")")
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

    // Reusable tactile button with unmistakably clear ON (`active: true`) vs OFF (`active: false`) visual state
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
            if (pillArea.pressed) return Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.44)
            if (pill.urgent) {
                return pillArea.containsMouse
                    ? Qt.rgba(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 0.30)
                    : Qt.rgba(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 0.16)
            }
            if (pill.active) {
                return pillArea.containsMouse
                    ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.38)
                    : Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.28)
            }
            return pillArea.containsMouse ? Qt.rgba(1, 1, 1, 0.13) : Qt.rgba(1, 1, 1, 0.04)
        }
        border.width: pill.active ? 1.5 : 1
        border.color: {
            if (flashTimer.running) return "#ffffff"
            if (pill.urgent) return root.urgentColour
            if (pill.active) return root.accentColour
            if (pillArea.containsMouse) return Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.55)
            return Qt.rgba(1, 1, 1, 0.14)
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
                return Qt.rgba(root.foregroundColour.r, root.foregroundColour.g, root.foregroundColour.b, 0.74)
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

    // Frame-paced animation loop (honours root.targetFps: 30, 48, or 60 FPS)
    FrameAnimation {
        id: frameAnim
        running: root.visible && root.stageMode !== "off"
        onTriggered: {
            var minFrameInterval = 1.0 / Math.max(24, Math.min(62, (root.targetFps || 48) + 2))
            root.frameAccumDt += Math.min(0.05, Math.max(0.002, frameTime))
            if (root.frameAccumDt < minFrameInterval) {
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

            // Explicitly push dynamic time and audio uniforms to gpuShaderStage every frame
            // (since plain JS object mutations on root.engineState do not emit QML notify signals)
            if (root.stageMode === "visualiser" && (root.backdropEnabled || (root.layer1Enabled && root.layer1FieldEnabled))) {
                var st = root.engineState
                var bT = st.backdropTime !== undefined ? st.backdropTime : (st.t || 0.0)
                gpuShaderStage.uTime = bT
                gpuShaderStage.uL1Time = st.l1Time || 0.0
                gpuShaderStage.uZoomTime = st.zoomTime || 0.0
                gpuShaderStage.uBass = st.bassSmooth || 0.0
                gpuShaderStage.uMid = st.midSmooth || 0.0
                gpuShaderStage.uHigh = st.highSmooth || 0.0
                gpuShaderStage.uBeat = st.beatPulse || 0.0
                gpuShaderStage.uDriftX = Math.sin(bT * 0.27) * 0.16 * root.tracerDrift
                gpuShaderStage.uDriftY = Math.cos(bT * 0.21) * 0.12 * root.tracerDrift
            }

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

    // Auto-Cycle Evolution Timer: strictly respects each layer's enabled state (default interval: 18000)
    Timer {
        interval: root.autoCycleIntervalSec > 0 ? Math.max(4, root.autoCycleIntervalSec) * 1000 : 18000
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

    // Independent Layer #1 Auto-Randomise Timer (Cycles active L1 sub-systems every 11s when L1 Auto-Randomise is ON)
    Timer {
        id: l1RandomiseTimer
        interval: 11000
        running: root.visible && root.stageMode === "visualiser" && root.layer1Enabled && root.layer1AutoRandomise
        repeat: true
        onTriggered: {
            root.randomiseLayer1()
        }
    }

    // Independent Layer #2 Auto-Randomise Timer (Cycles L2 Modes & Symmetry every 10s when L2 Auto-Randomise is ON)
    Timer {
        id: l2RandomiseTimer
        interval: 10000
        running: root.visible && root.stageMode === "visualiser" && root.layer2Enabled && root.layer2AutoRandomise
        repeat: true
        onTriggered: {
            root.randomiseLayer2()
        }
    }

    // Independent Layer #3 Auto-Randomise Timer (Cycles L3 Modes & TTE effects automatically every 9s when L3 Auto-Randomise is ON)
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
        visible: root.stageMode === "visualiser" && (root.backdropEnabled || (root.layer1Enabled && root.layer1FieldEnabled && (root.layer1Mode === 0 || root.layer1Mode === 3)))
        fragmentShader: Qt.resolvedUrl("share/psychedelic.frag.qsb")

        property real uTime: 0.0
        property real uL1Time: 0.0
        property real uZoomTime: 0.0
        property real uBass: 0.0
        property real uMid: 0.0
        property real uHigh: 0.0
        property real uBeat: 0.0
        property real uAspect: height > 0 ? (width / height) : 1.777
        property real uL1Enabled: root.layer1Enabled && root.layer1FieldEnabled ? 1.0 : 0.0
        property real uL1Mode: root.layer1Mode
        property real uL1Dim: root.layer1Dim
        property real uL2Enabled: root.backdropEnabled ? 1.0 : 0.0
        property real uL2Mode: root.backdropMode
        property real uZoom: root.layer2Zoom
        property real uFacets: root.backdropSymmetry
        property real uComplexity: root.backdropIntensity
        property real uTracerCount: root.tracerCount
        property real uTracerDir: root.backdropDirection
        property real uDriftX: 0.0
        property real uDriftY: 0.0
        property vector4d uBgCol: Qt.vector4d(root.backgroundColour.r, root.backgroundColour.g, root.backgroundColour.b, 1.0)
        property vector4d uCol0: Qt.vector4d(root.accentColour.r, root.accentColour.g, root.accentColour.b, 1.0)
        property vector4d uCol1: Qt.vector4d(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 1.0)
        property vector4d uCol2: Qt.vector4d(0.22, 0.74, 0.97, 1.0)
    }

    Canvas {
        id: vizCanvas
        readonly property int maxInternalW: 640
        readonly property int effectiveTargetW: Math.min(maxInternalW, Math.max(320, root.renderResW))
        readonly property real renderScale: root.width > effectiveTargetW ? (effectiveTargetW / Math.max(1, root.width)) : 1.0
        width: Math.max(64, Math.round(root.width * renderScale))
        height: Math.max(48, Math.round(root.height * renderScale))
        antialiasing: root.antialiasingEnabled
        smooth: root.antialiasingEnabled
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
                root.currentConfig(),
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

            // Row 1: Stage Mode Selector + Layer Toggles + Strip Tabs (#1 BG / #2 Viz / #3 Art) + Layers Drawer + GPU Backdrop + Presets + TTE + Fullscreen
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
                    Layout.preferredWidth: 62
                    text: root.layer1Enabled ? "L1: ON" : "L1: OFF"
                    active: root.layer1Enabled
                    horizontalPad: 5
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
                    Layout.preferredWidth: 62
                    text: root.layer2Enabled ? "L2: ON" : "L2: OFF"
                    active: root.layer2Enabled
                    horizontalPad: 5
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
                    Layout.preferredWidth: 62
                    text: root.layer3Enabled ? "L3: ON" : "L3: OFF"
                    active: root.layer3Enabled
                    horizontalPad: 5
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

                // 3 Direct-Click Row 2 Strip Selector Pills (#1 BG / #2 Viz / #3 Art)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "#1 BG"
                    active: root.hudFocusedLayer === 1
                    horizontalPad: 6
                    onClicked: {
                        root.hudFocusedLayer = 1
                        root.requestActionFeedback("HUD Row 2 Strip: Layer #1 Background")
                    }
                }

                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "#2 Viz"
                    active: root.hudFocusedLayer === 2
                    horizontalPad: 6
                    onClicked: {
                        root.hudFocusedLayer = 2
                        root.requestActionFeedback("HUD Row 2 Strip: Layer #2 Visualiser")
                    }
                }

                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "#3 Art"
                    active: root.hudFocusedLayer === 3
                    horizontalPad: 6
                    onClicked: {
                        root.hudFocusedLayer = 3
                        root.requestActionFeedback("HUD Row 2 Strip: Layer #3 Art & Words")
                    }
                }

                // Open 3-Layer + Presets + General & Quality Configuration Drawer button
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: root.showLayerDrawer ? "󰒓 Layers ▲" : "󰒓 Layers ▼"
                    active: root.showLayerDrawer
                    horizontalPad: 8
                    onClicked: {
                        root.showLayerDrawer = !root.showLayerDrawer
                        root.requestActionFeedback(root.showLayerDrawer ? "Opened Layers, Presets & Quality Editor" : "Closed Layers, Presets & Quality Editor")
                    }
                }

                // Independent GPU Shader Backdrop Cycler & Toggle Pill (7 GPU Shader Modes + OFF)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 112
                    text: "󰢮 GPU: " + (root.backdropEnabled ? (Engine.BACKDROP_MODES[root.backdropMode] || "ON").split(" ")[0] : "OFF")
                    active: root.backdropEnabled
                    horizontalPad: 6
                    onClicked: {
                        if (!root.backdropEnabled) {
                            root.backdropEnabled = true
                            vizCanvas.requestPaint()
                            root.requestActionFeedback("GPU Backdrop ON: " + Engine.BACKDROP_MODES[root.backdropMode])
                        } else if (root.backdropMode + 1 >= Engine.BACKDROP_MODES.length) {
                            root.backdropEnabled = false
                            vizCanvas.requestPaint()
                            root.requestActionFeedback("GPU Backdrop: OFF")
                        } else {
                            root.backdropMode = root.backdropMode + 1
                            vizCanvas.requestPaint()
                            root.requestActionFeedback("GPU Backdrop: " + Engine.BACKDROP_MODES[root.backdropMode])
                        }
                    }
                    onRightClicked: {
                        root.backdropEnabled = !root.backdropEnabled
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("GPU Backdrop: " + (root.backdropEnabled ? ("ON (" + Engine.BACKDROP_MODES[root.backdropMode] + ")") : "OFF"))
                    }
                    onWheelScrolled: delta => {
                        root.cycleBackdropMode(delta > 0 ? 1 : -1)
                    }
                }

                // Collective Scene Preset Quick Cycler
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "󰀻 Preset"
                    active: root.presetTransitionEnabled
                    horizontalPad: 7
                    onClicked: root.cycleSelectedPreset(1)
                    onRightClicked: root.cycleSelectedPreset(-1)
                }

                // Palette selector (fixed width so Row 1 never shifts)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 80
                    text: "󰏘 " + (Engine.PALETTE_NAMES[root.paletteIndex] || "Prism").split(" ")[0]
                    horizontalPad: 6
                    onClicked: root.cyclePalette(1)
                    onRightClicked: root.cyclePalette(-1)
                }

                // Randomise active layers & palette (non-destructive action button — urgent: false)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "󰒟 Randomise"
                    horizontalPad: 7
                    onClicked: root.randomiseVisuals()
                }

                // Auto-Cycle active layers & palette
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 108
                    text: root.autoCycle ? "󰑐 Auto-Cycle: ON" : "󰑐 Auto-Cycle: OFF"
                    active: root.autoCycle
                    horizontalPad: 6
                    onClicked: {
                        root.autoCycle = !root.autoCycle
                        scheduleSaveVisualiserConfig()
                        root.requestActionFeedback("Auto-Cycle " + (root.autoCycle ? ("ON (every " + root.autoCycleIntervalSec + "s)") : "OFF"))
                    }
                }

                Item { Layout.fillWidth: true }

                // In-Canvas TTE Random Effect Activator
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "󰍹 TTE"
                    active: root.layer3Enabled && root.layer3Mode === 5
                    horizontalPad: 8
                    onClicked: root.activateAndCycleTteInCanvas()
                }

                // External Omarchy TTE Fullscreen Terminal Launcher
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

            // Row 2A: Contextual Strip for Layer #1 (Saved L1 + Field Toggle + 7 Field Modes + Ground Speed + Equaliser + Beat Shapes + L1 Auto-Randomise)
            RowLayout {
                Layout.fillWidth: true
                spacing: 4
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 1

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "󰆓 L1 (" + (root.savedL1Configs ? root.savedL1Configs.length : 0) + ")"
                    active: false
                    onClicked: root.cycleSavedL1Config(1)
                    onRightClicked: root.saveCurrentL1Config()
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 6
                    text: root.layer1FieldEnabled ? "Field: ON" : "Field: OFF"
                    active: root.layer1Enabled && root.layer1FieldEnabled
                    onClicked: {
                        root.layer1FieldEnabled = !root.layer1FieldEnabled
                        if (root.layer1FieldEnabled) root.layer1Enabled = true
                        root.clearCanvasImmediate()
                        root.requestActionFeedback("L1 Field: " + (root.layer1FieldEnabled ? ("ON (" + Engine.LAYER1_MODES[root.layer1Mode] + ")") : "OFF"))
                    }
                }

                Repeater {
                    model: ["Flame", "SynthGrid", "StarWarp", "Nebula", "Battlezone", "DeathStar", "BlackHole"]
                    delegate: VizPillButton {
                        required property int index
                        required property string modelData
                        Layout.fillWidth: true
                        pillHeight: 22
                        fontSize: 9
                        horizontalPad: 4
                        text: modelData
                        active: root.layer1Enabled && root.layer1FieldEnabled && root.layer1Mode === index
                        onClicked: {
                            if (root.layer1Enabled && root.layer1FieldEnabled && root.layer1Mode === index) {
                                root.layer1FieldEnabled = false
                                root.clearCanvasImmediate()
                                root.requestActionFeedback("L1 Field: OFF")
                            } else {
                                root.layer1Enabled = true
                                root.layer1FieldEnabled = true
                                root.layer1Mode = index
                                root.clearCanvasImmediate()
                                root.requestActionFeedback("L1 Field: " + Engine.LAYER1_MODES[index])
                            }
                        }
                        onRightClicked: {
                            root.layer1FieldEnabled = !root.layer1FieldEnabled
                            root.clearCanvasImmediate()
                        }
                    }
                }

                // Direct Ground & Field Speed Control Pill (Click steps 0.5x..4.0x, mouse wheel fine-tunes)
                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "Spd:" + root.layer1Speed.toFixed(1) + "x"
                    active: Math.abs(root.layer1Speed - 1.0) > 0.05
                    onClicked: {
                        var steps = [0.5, 1.0, 1.5, 2.0, 3.0, 4.0]
                        var nextS = 1.0
                        for (var i = 0; i < steps.length; i++) {
                            if (steps[i] > root.layer1Speed + 0.05) {
                                nextS = steps[i]
                                break
                            }
                            if (i === steps.length - 1) nextS = steps[0]
                        }
                        root.layer1Speed = nextS
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                        root.requestActionFeedback("L1 Ground & Field Speed: " + root.layer1Speed.toFixed(2) + "x")
                    }
                    onRightClicked: {
                        root.layer1Speed = 1.0
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                        root.requestActionFeedback("L1 Ground & Field Speed reset to 1.00x")
                    }
                    onWheelScrolled: delta => {
                        root.layer1Speed = Math.max(0.05, Math.min(4.0, Math.round((root.layer1Speed + delta * 0.15) * 100) / 100))
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                        root.requestActionFeedback("L1 Ground & Field Speed: " + root.layer1Speed.toFixed(2) + "x")
                    }
                }

                // Equaliser pill: left-click cycles 0 -> ... -> N-1 -> OFF -> 0
                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "EQ: " + (root.layer1EqEnabled ? (Engine.LAYER1_EQ_STYLES[root.layer1EqStyle] || "ON").split(" ")[0] : "OFF")
                    active: root.layer1Enabled && root.layer1EqEnabled
                    onClicked: {
                        root.layer1Enabled = true
                        if (!root.layer1EqEnabled) {
                            root.layer1EqEnabled = true
                            root.layer1EqStyle = 0
                            vizCanvas.requestPaint()
                            root.requestActionFeedback("L1 Equaliser: " + Engine.LAYER1_EQ_STYLES[0])
                        } else if (root.layer1EqStyle + 1 >= Engine.LAYER1_EQ_STYLES.length) {
                            root.layer1EqEnabled = false
                            root.clearCanvasImmediate()
                            root.requestActionFeedback("L1 Equaliser: OFF")
                        } else {
                            root.layer1EqStyle = root.layer1EqStyle + 1
                            vizCanvas.requestPaint()
                            root.requestActionFeedback("L1 Equaliser: " + Engine.LAYER1_EQ_STYLES[root.layer1EqStyle])
                        }
                    }
                    onRightClicked: {
                        root.layer1EqEnabled = !root.layer1EqEnabled
                        root.clearCanvasImmediate()
                        root.requestActionFeedback("L1 Equaliser: " + (root.layer1EqEnabled ? "ON" : "OFF"))
                    }
                }

                // Beat Shapes pill: left-click cycles 0 -> ... -> N-1 -> OFF -> 0
                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "Shapes: " + (root.layer1ShapesEnabled ? (Engine.LAYER1_SHAPE_STYLES[root.layer1ShapeStyle] || "ON").split(" ")[0] : "OFF")
                    active: root.layer1Enabled && root.layer1ShapesEnabled
                    onClicked: {
                        root.layer1Enabled = true
                        if (!root.layer1ShapesEnabled) {
                            root.layer1ShapesEnabled = true
                            root.layer1ShapeStyle = 0
                            vizCanvas.requestPaint()
                            root.requestActionFeedback("L1 Beat Shapes: " + Engine.LAYER1_SHAPE_STYLES[0])
                        } else if (root.layer1ShapeStyle + 1 >= Engine.LAYER1_SHAPE_STYLES.length) {
                            root.layer1ShapesEnabled = false
                            root.clearCanvasImmediate()
                            root.requestActionFeedback("L1 Beat Shapes: OFF")
                        } else {
                            root.layer1ShapeStyle = root.layer1ShapeStyle + 1
                            vizCanvas.requestPaint()
                            root.requestActionFeedback("L1 Beat Shapes: " + Engine.LAYER1_SHAPE_STYLES[root.layer1ShapeStyle])
                        }
                    }
                    onRightClicked: {
                        root.layer1ShapesEnabled = !root.layer1ShapesEnabled
                        root.clearCanvasImmediate()
                        root.requestActionFeedback("L1 Beat Shapes: " + (root.layer1ShapesEnabled ? "ON" : "OFF"))
                    }
                }

                // Unambiguous L1 Auto-Randomise ON/OFF toggle + 1-shot dice button
                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: root.layer1AutoRandomise ? "󰒟 Rand L1: ON" : "󰒟 Rand L1: OFF"
                    active: root.layer1AutoRandomise
                    onClicked: {
                        root.layer1AutoRandomise = !root.layer1AutoRandomise
                        if (root.layer1AutoRandomise) {
                            root.layer1Enabled = true
                            root.randomiseLayer1()
                        } else {
                            root.requestActionFeedback("Layer #1 Auto-Randomise: OFF")
                        }
                    }
                    onRightClicked: root.randomiseLayer1()
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "🎲"
                    onClicked: root.randomiseLayer1()
                }
            }

            // Row 2B: Direct 12-Mode Quick-Select Strip for Layer #2 + Saved L2 + L2 Tracers + L2 Auto-Randomise
            RowLayout {
                Layout.fillWidth: true
                spacing: 4
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 2

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "󰆓 L2 (" + (root.savedL2Configs ? root.savedL2Configs.length : 0) + ")"
                    active: false
                    onClicked: root.cycleSavedL2Config(1)
                    onRightClicked: root.saveCurrentL2Config()
                }

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
                            ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.28)
                            : (modePillMouse.containsMouse ? Qt.rgba(1, 1, 1, 0.14) : Qt.rgba(1, 1, 1, 0.04))
                        border.width: isCurrent ? 1.5 : 1
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

                // Dedicated L2 Tracers Pill on Row 2B (Click steps 1..16x, wheel scrolls)
                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "Tracers: " + root.tracerCount + "x"
                    active: root.tracerCount > 1
                    onClicked: root.cycleTracers(1)
                    onRightClicked: root.cycleTracers(-1)
                    onWheelScrolled: delta => {
                        root.tracerCount = Math.max(1, Math.min(16, root.tracerCount + delta))
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("L2 Tracers: " + root.tracerCount + "x")
                    }
                }

                // Unambiguous L2 Auto-Randomise ON/OFF toggle + 1-shot dice button
                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: root.layer2AutoRandomise ? "󰒟 Rand L2: ON" : "󰒟 Rand L2: OFF"
                    active: root.layer2AutoRandomise
                    onClicked: {
                        root.layer2AutoRandomise = !root.layer2AutoRandomise
                        if (root.layer2AutoRandomise) {
                            root.layer2Enabled = true
                            root.randomiseLayer2()
                        } else {
                            root.requestActionFeedback("Layer #2 Auto-Randomise: OFF")
                        }
                    }
                    onRightClicked: root.randomiseLayer2()
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "🎲"
                    onClicked: root.randomiseLayer2()
                }
            }

            // Row 2C: Contextual Strip for Layer #3 (Saved L3 + Art/Words + Braille/Block + 6 L3 Modes + L3 Tracers + L3 Auto-Randomise)
            RowLayout {
                Layout.fillWidth: true
                spacing: 4
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 3

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "󰆓 L3 (" + (root.savedL3Configs ? root.savedL3Configs.length : 0) + ")"
                    active: false
                    onClicked: root.cycleSavedL3Config(1)
                    onRightClicked: root.saveCurrentL3Config()
                }

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

                // Dedicated L3 Ghost Tracers Pill on Row 2C (Click steps 1..8x, wheel scrolls)
                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "Tracers: " + root.layer3Tracers + "x"
                    active: root.layer3Tracers > 1
                    onClicked: root.cycleLayer3Tracers(1)
                    onRightClicked: root.cycleLayer3Tracers(-1)
                    onWheelScrolled: delta => {
                        root.layer3Tracers = Math.max(1, Math.min(8, root.layer3Tracers + delta))
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("L3 Art Ghost Tracers: " + root.layer3Tracers + "x")
                    }
                }

                // Unambiguous L3 Auto-Randomise ON/OFF toggle + 1-shot dice button
                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: root.layer3AutoRandomise ? "󰒟 Rand L3: ON" : "󰒟 Rand L3: OFF"
                    active: root.layer3AutoRandomise
                    onClicked: {
                        root.layer3AutoRandomise = !root.layer3AutoRandomise
                        if (root.layer3AutoRandomise) {
                            root.layer3Enabled = true
                            root.randomiseLayer3()
                        } else {
                            root.requestActionFeedback("Layer #3 Auto-Randomise: OFF")
                        }
                    }
                    onRightClicked: root.randomiseLayer3()
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "🎲"
                    onClicked: {
                        root.layer3Enabled = true
                        root.randomiseLayer3()
                    }
                }
            }
        }
    }

    // =========================================================================
    // SPACIOUS FULL-WIDTH CONTEXTUAL 3-LAYER, PRESETS & QUALITY DRAWER
    // =========================================================================
    Rectangle {
        id: layerDrawer
        anchors.top: topHud.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 8
        height: Math.max(240, Math.min(parent.height - topHud.height - bottomHud.height - 28, 410))
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

            // Top Tab Selector Bar: Collective Presets (0) / Layer #1 (1) / Layer #2 (2) / Layer #3 (3) / General & Quality (4)
            RowLayout {
                Layout.fillWidth: true
                spacing: 6

                VizPillButton {
                    text: "󰀻 Presets (L1+L2+L3)"
                    active: root.activeConfigLayer === 0
                    horizontalPad: 8
                    onClicked: root.activeConfigLayer = 0
                }

                VizPillButton {
                    text: "L1: Background (" + (root.layer1Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 1
                    horizontalPad: 8
                    onClicked: root.activeConfigLayer = 1
                }

                VizPillButton {
                    text: "L2: Visualiser (" + (root.layer2Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 2
                    horizontalPad: 8
                    onClicked: root.activeConfigLayer = 2
                }

                VizPillButton {
                    text: "L3: Art & Words (" + (root.layer3Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 3
                    horizontalPad: 8
                    onClicked: root.activeConfigLayer = 3
                }

                VizPillButton {
                    text: "󰒓 General & Quality"
                    active: root.activeConfigLayer === 4
                    horizontalPad: 8
                    onClicked: root.activeConfigLayer = 4
                }

                VizPillButton {
                    text: root.musicDrive ? "󰎆 Music Drive: ON" : "󰎆 Music Drive: OFF"
                    active: root.musicDrive
                    horizontalPad: 8
                    onClicked: {
                        root.musicDrive = !root.musicDrive
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
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
                                onClicked: {
                                    root.presetTransitionEnabled = !root.presetTransitionEnabled
                                    root.requestActionFeedback("Selected Presets Auto-Transition: " + (root.presetTransitionEnabled ? "ON" : "OFF"))
                                }
                            }

                            VizPillButton {
                                text: "󰒭 Next Selected Preset"
                                active: false
                                onClicked: root.cycleSelectedPreset(1)
                            }

                            VizPillButton {
                                text: "󰆓 + Save Current (L1+L2+L3) as Preset"
                                active: false
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
                                onValueEdited: v => {
                                    root.presetTransitionIntervalSec = Math.round(v)
                                    scheduleSaveVisualiserConfig()
                                }
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
                                                    + " · " + (presetData.tracerCount || 4) + "x Tracers"
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
                    // TAB 1: LAYER #1 CONFIGURATION — SAVED L1 SETTINGS + 4 SUB-SYSTEMS
                    //   (1) L1 Field  (2) L1 Equaliser  (3) L1 Beat Shapes  (4) GPU Shader Backdrop
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 1

                        // Saved Layer #1 Settings Bar (Single-Layer Isolation: Never touches L2 or L3!)
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: savedL1Row.implicitHeight + 12
                            radius: 6
                            color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.06)
                            border.width: 1
                            border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.28)

                            RowLayout {
                                id: savedL1Row
                                anchors.fill: parent
                                anchors.margins: 6
                                spacing: 5

                                Text {
                                    text: "󰆓 Saved L1:"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 10
                                    font.bold: true
                                    color: root.accentColour
                                }

                                VizPillButton {
                                    text: "+ Save Current L1 Setting"
                                    pillHeight: 22
                                    horizontalPad: 7
                                    onClicked: root.saveCurrentL1Config()
                                }

                                Repeater {
                                    model: root.savedL1Configs ? root.savedL1Configs.length : 0
                                    delegate: RowLayout {
                                        required property int index
                                        readonly property var itemData: root.savedL1Configs[index] || ({})
                                        spacing: 2

                                        VizPillButton {
                                            text: itemData.name || ("L1 #" + (index + 1))
                                            active: root.currentSavedL1Index === index
                                            pillHeight: 22
                                            horizontalPad: 6
                                            onClicked: root.applySavedL1Config(index)
                                        }

                                        VizPillButton {
                                            text: "✕"
                                            pillHeight: 22
                                            horizontalPad: 4
                                            onClicked: root.deleteSavedL1Config(index)
                                        }
                                    }
                                }

                                Item { Layout.fillWidth: true }
                            }
                        }

                        // Master Layer #1 Toggle + Per-Layer Auto-Randomise + Quick Sub-System Summary Row
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

                            Item { Layout.fillWidth: true }

                            VizPillButton {
                                text: root.layer1AutoRandomise ? "󰒟 Auto-Randomise L1: ON" : "󰒟 Auto-Randomise L1: OFF"
                                active: root.layer1AutoRandomise
                                onClicked: {
                                    root.layer1AutoRandomise = !root.layer1AutoRandomise
                                    if (root.layer1AutoRandomise) {
                                        root.layer1Enabled = true
                                        root.randomiseLayer1()
                                    } else {
                                        root.requestActionFeedback("Layer #1 Auto-Randomise: OFF")
                                    }
                                }
                            }

                            VizPillButton {
                                text: "🎲 Step Random L1"
                                onClicked: root.randomiseLayer1()
                            }
                        }

                        // SUB-SYSTEM 1: L1 Ambient / Perspective Field (Explicit OFF pill + 7 Modes + Ground Speed & Sliders)
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
                                        text: "󰅖 OFF"
                                        active: !root.layer1FieldEnabled
                                        horizontalPad: 7
                                        onClicked: {
                                            root.layer1FieldEnabled = false
                                            root.clearCanvasImmediate()
                                            root.requestActionFeedback("L1 Field: OFF")
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
                                        label: "Ground & Field Speed"
                                        value: root.layer1Speed
                                        minValue: 0.05
                                        maxValue: 4.00
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.layer1Speed = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }

                                    LayerSlider {
                                        label: "Trail Persistence"
                                        value: root.layer1Persistence
                                        minValue: 0.20
                                        maxValue: 0.96
                                        onValueEdited: v => {
                                            root.layer1Persistence = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }

                                    LayerSlider {
                                        label: "Field Density"
                                        value: root.layer1Density
                                        minValue: 0.25
                                        maxValue: 2.00
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.layer1Density = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }

                                    LayerSlider {
                                        label: "Backdrop Dim"
                                        value: root.layer1Dim
                                        minValue: 0.04
                                        maxValue: 0.65
                                        onValueEdited: v => {
                                            root.layer1Dim = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }
                                }
                            }
                        }

                        // SUB-SYSTEM 2: Independent L1 SynthGrid Equaliser (Explicit OFF pill + 7 Styles including Horizon Spotlights)
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
                                        text: "󰅖 OFF"
                                        active: !root.layer1EqEnabled
                                        horizontalPad: 7
                                        onClicked: {
                                            root.layer1EqEnabled = false
                                            root.clearCanvasImmediate()
                                            root.requestActionFeedback("L1 Equaliser: OFF")
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
                                                scheduleSaveVisualiserConfig()
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
                                                scheduleSaveVisualiserConfig()
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
                                        onValueEdited: v => {
                                            root.layer1EqGain = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }
                                }
                            }
                        }

                        // SUB-SYSTEM 3: Independent L1 Beat Shapes (Explicit OFF pill + 6 3D Rotating Styles)
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
                                        text: "󰅖 OFF"
                                        active: !root.layer1ShapesEnabled
                                        horizontalPad: 7
                                        onClicked: {
                                            root.layer1ShapesEnabled = false
                                            root.clearCanvasImmediate()
                                            root.requestActionFeedback("L1 Beat Shapes: OFF")
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
                                        label: "3D Spin Rate"
                                        value: root.layer1ShapeSpin
                                        minValue: -2.50
                                        maxValue: 2.50
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.layer1ShapeSpin = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }

                                    LayerSlider {
                                        label: "Flight Speed"
                                        value: root.layer1ShapeSpeed
                                        minValue: 0.20
                                        maxValue: 3.00
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.layer1ShapeSpeed = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }

                                    LayerSlider {
                                        label: "Shape Scale"
                                        value: root.layer1ShapeScale
                                        minValue: 0.30
                                        maxValue: 2.50
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.layer1ShapeScale = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }
                                }
                            }
                        }

                        // SUB-SYSTEM 4: Independent GPU Shader Backdrop (7 GPU Shaders + Explicit OFF pill)
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: gpuSubCol.implicitHeight + 14
                            radius: 6
                            color: Qt.rgba(0.22, 0.74, 0.97, 0.06)
                            border.width: 1
                            border.color: root.backdropEnabled ? Qt.rgba(0.22, 0.74, 0.97, 0.38) : Qt.rgba(1, 1, 1, 0.14)

                            ColumnLayout {
                                id: gpuSubCol
                                anchors.fill: parent
                                anchors.margins: 7
                                spacing: 6

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 5

                                    Text {
                                        text: "󰢮 GPU Backdrop:"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 10
                                        font.bold: true
                                        color: root.accentColour
                                    }

                                    VizPillButton {
                                        text: "󰅖 OFF"
                                        active: !root.backdropEnabled
                                        horizontalPad: 7
                                        onClicked: {
                                            root.backdropEnabled = false
                                            vizCanvas.requestPaint()
                                            root.requestActionFeedback("GPU Shader Backdrop: OFF")
                                        }
                                    }

                                    Repeater {
                                        model: Engine.BACKDROP_MODES.length
                                        delegate: VizPillButton {
                                            required property int index
                                            text: Engine.BACKDROP_MODES[index]
                                            active: root.backdropEnabled && root.backdropMode === index
                                            horizontalPad: 6
                                            onClicked: {
                                                root.backdropEnabled = true
                                                root.backdropMode = index
                                                vizCanvas.requestPaint()
                                                root.requestActionFeedback("GPU Shader Backdrop: " + Engine.BACKDROP_MODES[index])
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
                                        label: "Backdrop Speed"
                                        value: root.backdropSpeed
                                        minValue: 0.10
                                        maxValue: 3.00
                                        unitSuffix: "x"
                                        onValueEdited: v => { root.backdropSpeed = v; vizCanvas.requestPaint() }
                                    }

                                    LayerSlider {
                                        label: "Backdrop Glow"
                                        value: root.backdropIntensity
                                        minValue: 0.20
                                        maxValue: 2.20
                                        unitSuffix: "x"
                                        onValueEdited: v => { root.backdropIntensity = v; vizCanvas.requestPaint() }
                                    }
                                }
                            }
                        }
                    }

                    // =========================================================
                    // TAB 2: LAYER #2 CONFIGURATION (SAVED L2 SETTINGS, 12 MODES & L2 3D TRACERS)
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 2

                        // Saved Layer #2 Settings Bar (Single-Layer Isolation: Never touches L1 or L3!)
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: savedL2Row.implicitHeight + 12
                            radius: 6
                            color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.06)
                            border.width: 1
                            border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.28)

                            RowLayout {
                                id: savedL2Row
                                anchors.fill: parent
                                anchors.margins: 6
                                spacing: 5

                                Text {
                                    text: "󰆓 Saved L2:"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 10
                                    font.bold: true
                                    color: root.accentColour
                                }

                                VizPillButton {
                                    text: "+ Save Current L2 Setting"
                                    pillHeight: 22
                                    horizontalPad: 7
                                    onClicked: root.saveCurrentL2Config()
                                }

                                Repeater {
                                    model: root.savedL2Configs ? root.savedL2Configs.length : 0
                                    delegate: RowLayout {
                                        required property int index
                                        readonly property var itemData: root.savedL2Configs[index] || ({})
                                        spacing: 2

                                        VizPillButton {
                                            text: itemData.name || ("L2 #" + (index + 1))
                                            active: root.currentSavedL2Index === index
                                            pillHeight: 22
                                            horizontalPad: 6
                                            onClicked: root.applySavedL2Config(index)
                                        }

                                        VizPillButton {
                                            text: "✕"
                                            pillHeight: 22
                                            horizontalPad: 4
                                            onClicked: root.deleteSavedL2Config(index)
                                        }
                                    }
                                }

                                Item { Layout.fillWidth: true }
                            }
                        }

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
                                text: "󰏘 Palette: " + (Engine.PALETTE_NAMES[root.paletteIndex] || "Prism")
                                onClicked: root.cyclePalette(1)
                            }

                            VizPillButton {
                                text: "Symmetry: " + root.symmetryFolds + "x"
                                active: root.symmetryFolds > 1
                                onClicked: root.cycleSymmetry()
                            }

                            VizPillButton {
                                text: "󰑐 Song Arc: " + (Engine.TRACK_ARC_MODES[root.trackArcMode] || "Climax")
                                active: root.trackArcMode > 0
                                onClicked: root.cycleTrackArcMode()
                            }

                            Item { Layout.fillWidth: true }

                            VizPillButton {
                                text: root.layer2AutoRandomise ? "󰒟 Auto-Randomise L2: ON" : "󰒟 Auto-Randomise L2: OFF"
                                active: root.layer2AutoRandomise
                                onClicked: {
                                    root.layer2AutoRandomise = !root.layer2AutoRandomise
                                    if (root.layer2AutoRandomise) {
                                        root.layer2Enabled = true
                                        root.randomiseLayer2()
                                    } else {
                                        root.requestActionFeedback("Layer #2 Auto-Randomise: OFF")
                                    }
                                }
                            }

                            VizPillButton {
                                text: "🎲 Step Random L2"
                                onClicked: root.randomiseLayer2()
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
                                        root.layer2Enabled = true
                                        root.visualMode = index
                                        vizCanvas.requestPaint()
                                        root.requestActionFeedback("Layer #2 Mode: " + Engine.MODE_NAMES[index])
                                    }
                                }
                            }
                        }

                        // Dedicated L2 3D History Tracers Strip (1x..16x Quick Pills + 3D Flow Direction)
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 5

                            Text {
                                text: "L2 3D Tracers:"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 10
                                font.bold: true
                                color: root.accentColour
                            }

                            Repeater {
                                model: [1, 2, 4, 6, 8, 12, 16]
                                delegate: VizPillButton {
                                    required property int modelData
                                    text: modelData + "x"
                                    active: root.tracerCount === modelData
                                    horizontalPad: 6
                                    pillHeight: 22
                                    onClicked: {
                                        root.tracerCount = modelData
                                        vizCanvas.requestPaint()
                                        root.requestActionFeedback("L2 3D Tracers: " + modelData + "x")
                                    }
                                }
                            }

                            VizPillButton {
                                text: "3D Flow: " + (root.tracerDirection > 0 ? "Towards User" : (root.tracerDirection < 0 ? "To Endpoint" : "Breathe In/Out"))
                                active: true
                                pillHeight: 22
                                onClicked: {
                                    root.tracerDirection = (root.tracerDirection === 1) ? -1 : ((root.tracerDirection === -1) ? 0 : 1)
                                    vizCanvas.requestPaint()
                                    scheduleSaveVisualiserConfig()
                                }
                            }

                            Item { Layout.fillWidth: true }
                        }

                        // 2-Column Parameter Sliders for Layer #2 + L2 3D History Tracers
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
                                onValueEdited: v => { root.tracerSpeed = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Endpoint Drift"
                                value: root.tracerDrift
                                minValue: 0.00
                                maxValue: 2.40
                                unitSuffix: "x"
                                onValueEdited: v => { root.tracerDrift = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Audio Reactivity"
                                value: root.sensitivity
                                minValue: 0.35
                                maxValue: 2.80
                                unitSuffix: "x"
                                onValueEdited: v => { root.sensitivity = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Mode Complexity"
                                value: root.layer2Complexity
                                minValue: 0.35
                                maxValue: 2.00
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer2Complexity = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Evolution Speed"
                                value: root.layer2Speed
                                minValue: 0.20
                                maxValue: 2.50
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer2Speed = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Scale / Zoom"
                                value: root.layer2Zoom
                                minValue: 0.50
                                maxValue: 2.00
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer2Zoom = v; root.layer2Chaos = Math.min(1.5, v * 0.6); vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }
                        }
                    }

                    // =========================================================
                    // TAB 3: LAYER #3 CONFIGURATION (SAVED L3 SETTINGS, BRAILLE ART & SONG WORDS)
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 3

                        // Saved Layer #3 Settings Bar (Single-Layer Isolation: Never touches L1 or L2!)
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: savedL3Row.implicitHeight + 12
                            radius: 6
                            color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.06)
                            border.width: 1
                            border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.28)

                            RowLayout {
                                id: savedL3Row
                                anchors.fill: parent
                                anchors.margins: 6
                                spacing: 5

                                Text {
                                    text: "󰆓 Saved L3:"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 10
                                    font.bold: true
                                    color: root.accentColour
                                }

                                VizPillButton {
                                    text: "+ Save Current L3 Setting"
                                    pillHeight: 22
                                    horizontalPad: 7
                                    onClicked: root.saveCurrentL3Config()
                                }

                                Repeater {
                                    model: root.savedL3Configs ? root.savedL3Configs.length : 0
                                    delegate: RowLayout {
                                        required property int index
                                        readonly property var itemData: root.savedL3Configs[index] || ({})
                                        spacing: 2

                                        VizPillButton {
                                            text: itemData.name || ("L3 #" + (index + 1))
                                            active: root.currentSavedL3Index === index
                                            pillHeight: 22
                                            horizontalPad: 6
                                            onClicked: root.applySavedL3Config(index)
                                        }

                                        VizPillButton {
                                            text: "✕"
                                            pillHeight: 22
                                            horizontalPad: 4
                                            onClicked: root.deleteSavedL3Config(index)
                                        }
                                    }
                                }

                                Item { Layout.fillWidth: true }
                            }
                        }

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
                                text: root.layer3AutoRandomise ? "󰒟 Auto-Randomise L3: ON" : "󰒟 Auto-Randomise L3: OFF"
                                active: root.layer3AutoRandomise
                                onClicked: {
                                    root.layer3AutoRandomise = !root.layer3AutoRandomise
                                    if (root.layer3AutoRandomise) {
                                        root.layer3Enabled = true
                                        root.randomiseLayer3()
                                    } else {
                                        root.requestActionFeedback("Layer #3 Auto-Randomise: OFF")
                                    }
                                }
                            }

                            VizPillButton {
                                text: "🎲 Step Random L3"
                                onClicked: {
                                    root.layer3Enabled = true
                                    root.randomiseLayer3()
                                }
                            }

                            VizPillButton {
                                text: "󰒟 Shatter!"
                                onClicked: root.triggerShatterImpulse()
                            }

                            VizPillButton {
                                text: "󰍹 TTE"
                                active: root.layer3Enabled && root.layer3Mode === 5
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
                                        scheduleSaveVisualiserConfig()
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

                        // Dedicated L3 Ghost Tracers Quick-Select Row (1x..8x)
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 5

                            Text {
                                text: "L3 Art Ghost Tracers:"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 10
                                font.bold: true
                                color: root.accentColour
                            }

                            Repeater {
                                model: [1, 2, 3, 4, 5, 6, 8]
                                delegate: VizPillButton {
                                    required property int modelData
                                    text: modelData + "x"
                                    active: root.layer3Tracers === modelData
                                    horizontalPad: 6
                                    pillHeight: 22
                                    onClicked: {
                                        root.layer3Tracers = modelData
                                        vizCanvas.requestPaint()
                                        root.requestActionFeedback("L3 Art Ghost Tracers: " + modelData + "x")
                                    }
                                }
                            }

                            Item { Layout.fillWidth: true }
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
                                onValueEdited: v => { root.layer3Dismantle = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Rebuild Cohesion"
                                value: root.layer3Rebuild
                                minValue: 0.10
                                maxValue: 2.50
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer3Rebuild = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Song Evolution"
                                value: root.layer3Evolution
                                minValue: 0.10
                                maxValue: 2.50
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer3Evolution = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Art Matrix Scale"
                                value: root.layer3Scale
                                minValue: 0.50
                                maxValue: 1.85
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer3Scale = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
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

                    // =========================================================
                    // TAB 4: 󰒓 GENERAL & QUALITY CONFIGURATION
                    //   Render Quality, Target FPS, Geometry Detail, Antialiasing,
                    //   GPU Shader Backdrop, Global Audio & Beat Response,
                    //   Colour Cycle & Master Brightness, Timings & Reset Defaults
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 4

                        // Section 1: Render Quality, Resolution, Target FPS & Antialiasing
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: qualitySecCol.implicitHeight + 14
                            radius: 6
                            color: Qt.rgba(1, 1, 1, 0.04)
                            border.width: 1
                            border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.32)

                            ColumnLayout {
                                id: qualitySecCol
                                anchors.fill: parent
                                anchors.margins: 7
                                spacing: 6

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 6

                                    Text {
                                        text: "󰍹 Render Quality:"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 10
                                        font.bold: true
                                        color: root.accentColour
                                    }

                                    Repeater {
                                        model: [
                                            { q: 0, w: 384, detail: 0.75, label: "Low (384p Fast)" },
                                            { q: 1, w: 480, detail: 1.00, label: "Balanced (480p)" },
                                            { q: 2, w: 560, detail: 1.30, label: "High (560p)" },
                                            { q: 3, w: 640, detail: 1.65, label: "Ultra (640p Crisp)" }
                                        ]
                                        delegate: VizPillButton {
                                            required property var modelData
                                            text: modelData.label
                                            active: root.renderQuality === modelData.q
                                            horizontalPad: 7
                                            onClicked: {
                                                root.renderQuality = modelData.q
                                                root.renderResW = modelData.w
                                                root.geometryDetail = modelData.detail
                                                vizCanvas.requestPaint()
                                                scheduleSaveVisualiserConfig()
                                                root.requestActionFeedback("Render Quality: " + modelData.label)
                                            }
                                        }
                                    }

                                    Item { Layout.fillWidth: true }

                                    Text {
                                        text: "Target FPS:"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 10
                                        color: root.foregroundColour
                                    }

                                    Repeater {
                                        model: [30, 48, 60]
                                        delegate: VizPillButton {
                                            required property int modelData
                                            text: modelData + " FPS"
                                            active: root.targetFps === modelData
                                            horizontalPad: 6
                                            onClicked: {
                                                root.targetFps = modelData
                                                scheduleSaveVisualiserConfig()
                                                root.requestActionFeedback("Target Frame Rate: " + modelData + " FPS")
                                            }
                                        }
                                    }

                                    VizPillButton {
                                        text: root.antialiasingEnabled ? "AA Smooth: ON" : "AA Smooth: OFF"
                                        active: root.antialiasingEnabled
                                        horizontalPad: 7
                                        onClicked: {
                                            root.antialiasingEnabled = !root.antialiasingEnabled
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                            root.requestActionFeedback("Canvas Antialiasing: " + (root.antialiasingEnabled ? "ON" : "OFF"))
                                        }
                                    }
                                }

                                GridLayout {
                                    Layout.fillWidth: true
                                    columns: 2
                                    columnSpacing: 16
                                    rowSpacing: 5

                                    LayerSlider {
                                        label: "Geometry Detail"
                                        value: root.geometryDetail
                                        minValue: 0.50
                                        maxValue: 2.00
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.geometryDetail = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }

                                    LayerSlider {
                                        label: "Internal Width"
                                        value: root.renderResW
                                        minValue: 320
                                        maxValue: 640
                                        integerSteps: true
                                        unitSuffix: "px"
                                        onValueEdited: v => {
                                            root.renderResW = Math.round(v)
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }
                                }
                            }
                        }

                        // Section 2: Global Audio & Beat Response + Colour & Brightness + Timings
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: audioSecCol.implicitHeight + 14
                            radius: 6
                            color: Qt.rgba(1, 1, 1, 0.04)
                            border.width: 1
                            border.color: Qt.rgba(1, 1, 1, 0.14)

                            ColumnLayout {
                                id: audioSecCol
                                anchors.fill: parent
                                anchors.margins: 7
                                spacing: 6

                                GridLayout {
                                    Layout.fillWidth: true
                                    columns: 2
                                    columnSpacing: 16
                                    rowSpacing: 5

                                    LayerSlider {
                                        label: "Audio Sensitivity"
                                        value: root.audioSensitivity
                                        minValue: 0.35
                                        maxValue: 3.00
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.audioSensitivity = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }

                                    LayerSlider {
                                        label: "Beat Punch"
                                        value: root.beatPunch
                                        minValue: 0.25
                                        maxValue: 2.50
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.beatPunch = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }

                                    LayerSlider {
                                        label: "Audio Smoothing"
                                        value: root.audioSmoothing
                                        minValue: 0.10
                                        maxValue: 0.90
                                        onValueEdited: v => {
                                            root.audioSmoothing = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }

                                    LayerSlider {
                                        label: "Colour Cycle Spd"
                                        value: root.colourCycleSpeed
                                        minValue: 0.00
                                        maxValue: 2.50
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.colourCycleSpeed = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }

                                    LayerSlider {
                                        label: "Master Brightness"
                                        value: root.masterBrightness
                                        minValue: 0.30
                                        maxValue: 1.60
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.masterBrightness = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }

                                    LayerSlider {
                                        label: "Auto-Cycle Every"
                                        value: root.autoCycleIntervalSec
                                        minValue: 5
                                        maxValue: 60
                                        integerSteps: true
                                        unitSuffix: "s"
                                        onValueEdited: v => {
                                            root.autoCycleIntervalSec = Math.round(v)
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }
                                }

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 6

                                    VizPillButton {
                                        text: "󰏘 Palette: " + (Engine.PALETTE_NAMES[root.paletteIndex] || "Prism")
                                        onClicked: root.cyclePalette(1)
                                    }

                                    VizPillButton {
                                        text: "󰆓 Save Visualiser Config to Disk Now"
                                        active: true
                                        onClicked: {
                                            root.requestSaveVisualiserConfig(root.buildPersistedConfigSnapshot())
                                            root.requestActionFeedback("Saved Visualiser Config to ~/.config/bandarchy/visualiser.json")
                                        }
                                    }

                                    Item { Layout.fillWidth: true }

                                    VizPillButton {
                                        text: "󰑐 Reset All Visualiser Defaults"
                                        urgent: true
                                        onClicked: root.resetAllVisualiserDefaults()
                                    }
                                }
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
