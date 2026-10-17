import QtQuick
import QtQuick.Layouts
import QtQuick.Window
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
//   - Layer #1 (Background & SynthGrid Equaliser, 11 Field modes + 16 EQ styles),
//     Layer #2 (Psychedelic Visualiser, 13 modes + 8 GPU Backdrops + 3D Graded History Tracers),
//     and Layer #3 (2 x 3 x 12 Matrix: Art/Words x Braille/Block/Crisp Text x 12 Modes)
//     are 100% independent. Changing an effect or parameter in one layer NEVER enables
//     or locks out another layer.

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
    readonly property var layer3TextStyles: Engine.LAYER3_TEXT_STYLES
    readonly property var layer3CylinderDirs: Engine.LAYER3_CYLINDER_DIRS
    readonly property var backdropModes: Engine.BACKDROP_MODES
    readonly property var layer4Modes: Engine.LAYER4_MODES
    readonly property var layer4WallPatterns: Engine.LAYER4_WALL_PATTERNS
    readonly property var paletteNames: Engine.PALETTE_NAMES
    readonly property var shortPaletteNames: [
        "Rainbow", "Cyber", "Solar", "BioGlow", "UV Rave",
        "Nebula", "Emerald", "Blood", "Gold", "Aurora",
        "Tokyo", "Plasma", "Acid303", "Outrun", "Holo",
        "DMT", "Cryo", "Magma", "Vapor", "Supernova",
        "Jungle", "Strobe", "Amethyst", "Copper", "Abalone",
        "Isotope", "Quasar", "Crimson", "Oceanic", "Prismatic"
    ]
    readonly property var trackArcModes: Engine.TRACK_ARC_MODES

    // Global Music-Driven Modulation, Hardware GPU Acceleration, Song Arc & Row 2 Focus
    property bool musicDrive: true
    property bool gpuShaderEnabled: true // Hardware GPU shader acceleration (configured in General & Quality)
    property int hudFocusedLayer: 1 // 1 = L1 Controls, 2 = L2 Controls, 3 = L3 Controls, 4 = L4 Tunnel & Vortex Controls on Row 2 of topHud
    property int trackArcMode: 0 // 0 = Dynamic Audio Arc, 1 = Climax (75%), 2 = Dismantle, 3 = Rebuild, 4 = Quarters
    property bool showTracerPopover: false

    // Dual-Screen VJ Mode & Detached Stage Window properties
    property bool externalStageOpen: false
    property bool vjDeckMode: false
    property int targetScreenIndex: 0

    // General & Quality settings (exposed in Tab 5: 󰒓 General & Quality of layerDrawer)
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
    property bool disableScreensaverInFullscreenOrVj: true // Automatically inhibit Omarchy screensaver & idle while Fullscreen or VJ Mode is active
    property real frameAccumDt: 0.0
    property int telemetryTick: 0

    // Layer #1 — 3 Independent Sub-Layers:
    //   (1) L1 Field (`layer1FieldEnabled` + `layer1Mode` 0..10 + `layer1Direction` Towards/Away/Breathe + `layer1Speed` + `layer1Density`)
    //   (2) L1 Equaliser (`layer1EqEnabled` + `layer1EqStyle` 0..15 + `layer1EqLayout` 0..3 + `layer1EqScale` 0.35..2.25 + `layer1EqDamping` 0..2 + `layer1EqGain`)
    //   (3) L1 Beat Shapes (`layer1ShapesEnabled` + `layer1ShapeStyle` 0..5 + spin/speed/scale)
    property bool layer1Enabled: true
    property bool layer1AutoRandomise: false
    property bool layer1FieldEnabled: true
    property int layer1Mode: 0
    property int layer1Direction: 1 // 1 = Towards, -1 = Away, 0 = Breathe
    property real layer1Persistence: 0.84
    property real layer1Speed: 1.0
    property real layer1Density: 1.0
    property real layer1Dim: 0.16
    property bool layer1EqEnabled: true
    property bool layerEqAutoRandomise: false
    property int layer1EqStyle: 0
    property int layer1EqLayout: 0
    property real layer1EqScale: 1.0
    property real layer1EqGain: 1.25
    property int layer1EqDamping: 0
    property bool layer1ShapesEnabled: true
    property bool layerVectorsAutoRandomise: false
    property int layer1ShapeStyle: 0
    property real layer1ShapeSpin: 1.0
    property real layer1ShapeSpeed: 1.0
    property real layer1ShapeScale: 1.0
    property real layer1ShapeDensity: 1.0
    readonly property bool allRandomisationsActive: root.autoCycle && root.layer1AutoRandomise && root.layerEqAutoRandomise && root.layerVectorsAutoRandomise && root.layer2AutoRandomise && root.layer3AutoRandomise && root.layer4AutoRandomise

    // Layer #2 — Main Psychedelic Visualiser + 3D History Tracers:
    //   (1) L2 Main Visualiser (`layer2VizEnabled` + `visualMode` 0..12 + `layer2Speed` + `layer2Complexity`)
    //   (2) L2 3D History Tracers (`layer2TracersEnabled` + `tracerCount` 2..16 + `tracerDirection` Towards/Away/Breathe + `tracerSpeed` + `tracerDrift`)
    property bool layer2Enabled: true
    property bool layer2AutoRandomise: false
    property bool layer2VizEnabled: true
    property int visualMode: 0
    property alias layer2Mode: root.visualMode
    property int paletteIndex: 0
    property int symmetryIndex: 0
    property bool autoCycle: false
    property real sensitivity: 1.35
    property real layer2Complexity: 1.0
    property real layer2Speed: 1.0
    property real layer2Zoom: 1.0
    property real layer2Chaos: 0.50
    property bool backdropEnabled: true
    property int backdropMode: 0 // 0..15 in Engine.LAYER4_MODES (0..7 in legacy Engine.BACKDROP_MODES)
    property alias bgMode: root.backdropMode
    property real backdropSpeed: 1.0
    property real backdropIntensity: 1.0
    property int backdropSymmetry: 6
    property int backdropDirection: 1 // 1 = Towards, -1 = Away, 0 = Breathe
    property bool layer2TracersEnabled: true
    property int tracerCount: 4
    property real tracerSpeed: 1.15
    property real tracerDrift: 1.00
    property int tracerDirection: 1 // 1 = Towards, -1 = Away, 0 = Breathe

    // Layer #4 — Dedicated GPU Tunnel & Vortex Shader Layer (16 Modes + Dual 2x Simultaneous Blend + 5 Wall Patterns)
    property alias layer4Enabled: root.backdropEnabled
    property int layer4Mode: 0 // 0..15 in Engine.LAYER4_MODES
    property bool layer4DualEnabled: false // Runs two Layer 4 GPU modes simultaneously!
    property int layer4SecondaryMode: 1 // 0..15 secondary mode when layer4DualEnabled is true
    property real layer4DualMix: 0.50 // 0.10 .. 0.90 blend balance between Primary and Secondary L4 modes
    property int layer4WallPattern: 0 // 0 = Rings, 1 = Hex Grid, 2 = Ribbons, 3 = Matrix, 4 = Strobe
    property real layer4Twist: 1.00 // 0.00 .. 3.00 spiral twist multiplier
    property alias layer4Speed: root.backdropSpeed
    property alias layer4Glow: root.backdropIntensity
    property alias layer4Symmetry: root.backdropSymmetry
    property alias layer4Direction: root.backdropDirection
    property bool layer4AutoRandomise: false

    // Layer #3 — 2 x 3 x 12 x 16 Matrix (Album Art | Song Words) x (Braille | Block | Crisp Text) x (12 Modes 0..11) x (16 Psychedelic/Techno/Futuristic Styles 0..15)
    property bool layer3Enabled: true
    property bool layer3AutoRandomise: false
    property int layer3Mode: 0
    property int layer3TextStyle: 0 // 0..15 in Engine.LAYER3_TEXT_STYLES
    property int layer3CylinderDir: 0 // 0..5 in Engine.LAYER3_CYLINDER_DIRS
    property bool layer3ShowArtist: true
    property bool layer3ShowTrack: true
    property bool layer3ShowAlbum: true
    property alias layer3UseArt: root.useAlbumArt
    property alias layer3AsciiMode: root.asciiMode
    property real layer3Dismantle: 1.15
    property real layer3Rebuild: 1.0
    property real layer3Evolution: 0.90
    property real layer3Scale: 1.0
    property int layer3Tracers: 3
    property real turntableRpm: 33.3
    property int turntableStyle: 0
    onTurntableRpmChanged: stageTurntable.rpm = root.turntableRpm
    onTurntableStyleChanged: stageTurntable.vinylStyle = root.turntableStyle

    // Individual Layer Saved Settings (`savedL1Configs`, `savedL2Configs`, `savedL3Configs`, `savedL4Configs`)
    // Applying a saved item for L1, L2, L3, or L4 ONLY updates that single layer!
    property int currentSavedL1Index: 0
    property var savedL1Configs: [
        {
            name: "Atari Battlezone & Skyline EQ",
            l1FieldEnabled: true, l1Mode: 4, l1Direction: 1, l1Persistence: 0.84, l1Speed: 1.00, l1Density: 1.00, l1Dim: 0.14,
            l1EqEnabled: true, l1EqStyle: 0, l1EqLayout: 0, l1EqScale: 1.00, l1EqGain: 1.35, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 2, l1ShapeSpin: 1.00, l1ShapeSpeed: 1.05, l1ShapeScale: 1.00,
            l1AutoRandomise: false
        },
        {
            name: "Death Star Trench & X-Wings",
            l1FieldEnabled: true, l1Mode: 5, l1Direction: 1, l1Persistence: 0.84, l1Speed: 1.15, l1Density: 1.10, l1Dim: 0.14,
            l1EqEnabled: false, l1EqStyle: 1, l1EqLayout: 1, l1EqScale: 1.00, l1EqGain: 1.25, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 1, l1ShapeSpin: 0.85, l1ShapeSpeed: 1.15, l1ShapeScale: 1.05,
            l1AutoRandomise: false
        }
    ]

    property int currentSavedL2Index: 0
    property var savedL2Configs: [
        {
            name: "Minter VLM 8x Tunnel",
            l2VizEnabled: true, l2Mode: 4, symmetryIndex: 3, sensitivity: 1.50, l2Complexity: 1.20, l2Speed: 1.20, l2Zoom: 1.05, l2Chaos: 0.50,
            backdropEnabled: false, backdropMode: 0, backdropDirection: 1,
            l2TracersEnabled: true, tracerCount: 8, tracerSpeed: 1.30, tracerDrift: 1.10, tracerDirection: 1,
            l2AutoRandomise: false
        },
        {
            name: "MilkDrop Cathedral + Ripple Tunnel",
            l2VizEnabled: true, l2Mode: 0, symmetryIndex: 3, sensitivity: 1.35, l2Complexity: 1.10, l2Speed: 1.05, l2Zoom: 1.00, l2Chaos: 0.45,
            backdropEnabled: true, backdropMode: 0, backdropDirection: 1,
            l2TracersEnabled: true, tracerCount: 6, tracerSpeed: 1.15, tracerDrift: 1.00, tracerDirection: 1,
            l2AutoRandomise: false
        }
    ]

    property int currentSavedL3Index: 0
    property var savedL3Configs: [
        {
            name: "Art · Braille · Shatter",
            l3Mode: 0, l3TextStyle: 0, l3ShowArtist: true, l3ShowTrack: true, l3ShowAlbum: true,
            useAlbumArt: true, asciiMode: "braille",
            l3Dismantle: 1.15, l3Rebuild: 1.05, l3Evolution: 0.90, l3Scale: 1.00, l3Tracers: 3,
            trackArcMode: 0, l3AutoRandomise: false
        },
        {
            name: "Words · Crisp Text · Cyber Techno",
            l3Mode: 6, l3TextStyle: 0, l3ShowArtist: true, l3ShowTrack: true, l3ShowAlbum: true,
            useAlbumArt: false, asciiMode: "text",
            l3Dismantle: 1.10, l3Rebuild: 1.10, l3Evolution: 1.05, l3Scale: 1.00, l3Tracers: 3,
            trackArcMode: 0, l3AutoRandomise: false
        },
        {
            name: "Words · Crisp Text · Psychedelic Liquid",
            l3Mode: 7, l3TextStyle: 1, l3ShowArtist: true, l3ShowTrack: true, l3ShowAlbum: false,
            useAlbumArt: false, asciiMode: "text",
            l3Dismantle: 1.25, l3Rebuild: 1.00, l3Evolution: 0.95, l3Scale: 1.05, l3Tracers: 4,
            trackArcMode: 0, l3AutoRandomise: false
        }
    ]

    property int currentSavedL4Index: 0
    property var savedL4Configs: [
        {
            name: "Twin Ripple + Spiral Vortex (2x)",
            l4Enabled: true, l4Mode: 2, l4DualEnabled: true, l4SecondaryMode: 1, l4DualMix: 0.50,
            l4WallPattern: 1, l4Twist: 1.15, l4Speed: 1.10, l4Glow: 1.15, l4Symmetry: 6, l4Direction: 1,
            l4AutoRandomise: false
        },
        {
            name: "Butterchurn + TouchDesigner Curl (2x)",
            l4Enabled: true, l4Mode: 4, l4DualEnabled: true, l4SecondaryMode: 9, l4DualMix: 0.52,
            l4WallPattern: 2, l4Twist: 1.25, l4Speed: 1.15, l4Glow: 1.20, l4Symmetry: 8, l4Direction: 1,
            l4AutoRandomise: false
        },
        {
            name: "Binary Twin Vortex · Hex Grid",
            l4Enabled: true, l4Mode: 3, l4DualEnabled: false, l4SecondaryMode: 14, l4DualMix: 0.50,
            l4WallPattern: 1, l4Twist: 1.30, l4Speed: 1.15, l4Glow: 1.10, l4Symmetry: 6, l4Direction: 1,
            l4AutoRandomise: false
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
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 4, l1Direction: 1, l1Persistence: 0.84, l1Speed: 1.00, l1Density: 1.05, l1Dim: 0.14,
            l1EqEnabled: true, l1EqStyle: 0, l1EqLayout: 0, l1EqScale: 1.00, l1EqGain: 1.35, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 1, l1ShapeSpin: 1.10, l1ShapeSpeed: 1.05, l1ShapeScale: 1.00,
            l2Enabled: true, l2VizEnabled: true, l2Mode: 10, sensitivity: 1.45, l2Complexity: 1.15, l2Speed: 1.10, l2Zoom: 1.05,
            l3Enabled: false, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.10, l3Rebuild: 1.00, l3Evolution: 0.85, l3Scale: 1.00, l3Tracers: 3
        },
        {
            name: "Cthugha Plasma Flame Tunnel",
            selected: true,
            palette: 4,
            musicDrive: true,
            tracerCount: 5, tracerSpeed: 1.30, tracerDrift: 1.15, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 0, l1Direction: 1, l1Persistence: 0.86, l1Speed: 1.15, l1Density: 1.10, l1Dim: 0.16,
            l1EqEnabled: true, l1EqStyle: 4, l1EqLayout: 1, l1EqScale: 1.00, l1EqGain: 1.30, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 0, l1ShapeSpin: 0.90, l1ShapeSpeed: 1.15, l1ShapeScale: 1.05,
            l2Enabled: true, l2VizEnabled: true, l2Mode: 3, sensitivity: 1.55, l2Complexity: 1.20, l2Speed: 1.20, l2Zoom: 1.05,
            l3Enabled: false, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.15, l3Rebuild: 1.00, l3Evolution: 0.90, l3Scale: 1.00, l3Tracers: 3
        },
        {
            name: "Minter VLM Curved Morphing Tube",
            selected: true,
            palette: 2,
            musicDrive: true,
            tracerCount: 6, tracerSpeed: 1.40, tracerDrift: 1.20, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 4, l1Direction: 1, l1Persistence: 0.84, l1Speed: 1.05, l1Density: 1.15, l1Dim: 0.14,
            l1EqEnabled: true, l1EqStyle: 3, l1EqLayout: 2, l1EqScale: 1.00, l1EqGain: 1.40, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 3, l1ShapeSpin: 1.45, l1ShapeSpeed: 1.25, l1ShapeScale: 1.10,
            l2Enabled: true, l2VizEnabled: true, l2Mode: 4, sensitivity: 1.60, l2Complexity: 1.25, l2Speed: 1.35, l2Zoom: 1.10,
            l3Enabled: false, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.20, l3Rebuild: 0.95, l3Evolution: 1.00, l3Scale: 1.00, l3Tracers: 3
        },
        {
            name: "Infinite Julia Fractal Zoom",
            selected: true,
            palette: 3,
            musicDrive: true,
            tracerCount: 4, tracerSpeed: 1.15, tracerDrift: 0.95, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 1, l1Direction: 1, l1Persistence: 0.84, l1Speed: 1.05, l1Density: 1.15, l1Dim: 0.16,
            l1EqEnabled: false, l1EqStyle: 2, l1EqLayout: 1, l1EqScale: 1.00, l1EqGain: 1.25, l1EqDamping: 1,
            l1ShapesEnabled: true, l1ShapeStyle: 4, l1ShapeSpin: -1.10, l1ShapeSpeed: 0.95, l1ShapeScale: 1.00,
            l2Enabled: true, l2VizEnabled: true, l2Mode: 5, sensitivity: 1.45, l2Complexity: 1.25, l2Speed: 1.15, l2Zoom: 1.05,
            l3Enabled: false, l3Mode: 2, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.10, l3Rebuild: 1.05, l3Evolution: 0.90, l3Scale: 1.00, l3Tracers: 3
        },
        {
            name: "Braille Cover Art Shatter & MilkDrop",
            selected: true,
            palette: 1,
            musicDrive: true,
            tracerCount: 4, tracerSpeed: 1.10, tracerDrift: 1.00, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 0, l1Direction: 1, l1Persistence: 0.84, l1Speed: 1.00, l1Density: 1.00, l1Dim: 0.16,
            l1EqEnabled: true, l1EqStyle: 0, l1EqLayout: 0, l1EqScale: 1.00, l1EqGain: 1.20, l1EqDamping: 0,
            l1ShapesEnabled: true, l1ShapeStyle: 0, l1ShapeSpin: 1.00, l1ShapeSpeed: 1.00, l1ShapeScale: 1.00,
            l2Enabled: true, l2VizEnabled: true, l2Mode: 0, sensitivity: 1.35, l2Complexity: 1.05, l2Speed: 1.05, l2Zoom: 1.00,
            l3Enabled: true, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.25, l3Rebuild: 1.05, l3Evolution: 0.95, l3Scale: 1.05, l3Tracers: 3
        },
        {
            name: "Neon Song Words TTE Lotus Dome",
            selected: true,
            palette: 5,
            musicDrive: true,
            tracerCount: 5, tracerSpeed: 1.20, tracerDrift: 1.10, tracerDirection: 0,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 3, l1Direction: 1, l1Persistence: 0.84, l1Speed: 1.15, l1Density: 1.10, l1Dim: 0.16,
            l1EqEnabled: true, l1EqStyle: 5, l1EqLayout: 1, l1EqScale: 1.00, l1EqGain: 1.30, l1EqDamping: 1,
            l1ShapesEnabled: true, l1ShapeStyle: 5, l1ShapeSpin: 0.85, l1ShapeSpeed: 1.00, l1ShapeScale: 1.10,
            l2Enabled: true, l2VizEnabled: true, l2Mode: 6, sensitivity: 1.40, l2Complexity: 1.15, l2Speed: 1.10, l2Zoom: 1.00,
            l3Enabled: true, l3Mode: 5, asciiMode: "braille", useAlbumArt: false,
            l3Dismantle: 1.15, l3Rebuild: 1.10, l3Evolution: 1.10, l3Scale: 1.00, l3Tracers: 4
        },
        {
            name: "Pure Battlezone LED Equaliser (L1 Only)",
            selected: false,
            palette: 6,
            musicDrive: true,
            tracerCount: 4, tracerSpeed: 1.10, tracerDrift: 0.90, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: true, l1Mode: 4, l1Direction: 1, l1Persistence: 0.82, l1Speed: 1.00, l1Density: 1.20, l1Dim: 0.12,
            l1EqEnabled: true, l1EqStyle: 1, l1EqLayout: 0, l1EqScale: 1.00, l1EqGain: 1.55, l1EqDamping: 2,
            l1ShapesEnabled: true, l1ShapeStyle: 2, l1ShapeSpin: 1.20, l1ShapeSpeed: 1.15, l1ShapeScale: 1.05,
            l2Enabled: false, l2VizEnabled: true, l2Mode: 0, sensitivity: 1.35, l2Complexity: 1.00, l2Speed: 1.00, l2Zoom: 1.00,
            l3Enabled: false, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.00, l3Rebuild: 1.00, l3Evolution: 0.85, l3Scale: 1.00, l3Tracers: 3
        },
        {
            name: "Classic Matrix Digital Rain Waterfall",
            selected: false,
            palette: 2,
            musicDrive: true,
            tracerCount: 4, tracerSpeed: 1.20, tracerDrift: 1.00, tracerDirection: 1,
            l1Enabled: true, l1FieldEnabled: false, l1Mode: 0, l1Direction: 1, l1Persistence: 0.82, l1Speed: 1.00, l1Density: 1.00, l1Dim: 0.22,
            l1EqEnabled: true, l1EqStyle: 1, l1EqLayout: 0, l1EqScale: 1.00, l1EqGain: 1.25, l1EqDamping: 0,
            l1ShapesEnabled: false, l1ShapeStyle: 0, l1ShapeSpin: 1.00, l1ShapeSpeed: 1.00, l1ShapeScale: 1.00,
            l2Enabled: true, l2VizEnabled: true, l2Mode: 9, sensitivity: 1.45, l2Complexity: 1.20, l2Speed: 1.15, l2Zoom: 1.00,
            l3Enabled: false, l3Mode: 0, asciiMode: "braille", useAlbumArt: true,
            l3Dismantle: 1.00, l3Rebuild: 1.00, l3Evolution: 0.85, l3Scale: 1.00, l3Tracers: 3
        }
    ]

    // HUD & Drawer state
    property bool showHud: true
    property bool showLayerDrawer: false
    property alias showConfigDrawer: root.showLayerDrawer
    property int activeConfigLayer: 1 // 0 = Presets (L1+L2+L3), 1 = Layer 1, 2 = Layer 2, 3 = Layer 3, 4 = General & Quality
    property bool isFullscreen: false

    // Live audio telemetry readouts updated by FrameAnimation
    property real liveBass: 0.0
    property real liveMid: 0.0
    property real liveHigh: 0.0
    property real liveBeat: 0.0

    readonly property int symmetryFolds: Engine.SYMMETRY_OPTIONS[symmetryIndex % Engine.SYMMETRY_OPTIONS.length] || 1

    readonly property var shortL1FieldLabels: [
        "1:Warp",
        "2:Spiral",
        "3:Flame",
        "4:Stars",
        "5:Battlezone",
        "6:DeathStar",
        "7:BlackHole",
        "8:TRON 1982",
        "9:SynthGrid",
        "10:PolyTunnel",
        "11:Tempest"
    ]

    readonly property var shortEqLabels: [
        "Skyline",
        "LED Bars",
        "Mirror",
        "3D Ridges",
        "Sun",
        "TwinWave",
        "Spotlights",
        "3D Orb",
        "3D Torus",
        "Cymatics",
        "3D Helix",
        "Tesla Arcs",
        "Tralis City",
        "Aurora",
        "DNA Beam",
        "Ferrofluid"
    ]

    readonly property var shortEqPosLabels: [
        "0: Bottom ▲",
        "1: Mid ▲",
        "2: Mid ▼",
        "3: Top ▼"
    ]

    readonly property var shortBackdropLabels: [
        "Ripple",
        "RoseGlass",
        "Plasma",
        "JuliaZoom",
        "PolyTun",
        "Cosmic",
        "BlackHole",
        "Voronoi"
    ]

    readonly property var shortL4ModeLabels: [
        "CyberTun",
        "Vortex",
        "2xRipple",
        "2xVortex",
        "Butter",
        "projectM",
        "MagicWav",
        "VS Synth",
        "VSXu Rib",
        "TD Curl",
        "Metaball",
        "Wormhole",
        "Moiré",
        "Mandel",
        "BlackHole",
        "Voronoi"
    ]

    readonly property var shortModeLabels: [
        "MilkDrop",
        "AVS",
        "G-Force",
        "Cthugha",
        "Minter",
        "Fractals",
        "Lotus",
        "Quasar",
        "Mycelium",
        "Matrix",
        "Polytope",
        "Attractor",
        "Sierpinski"
    ]

    readonly property var shortL3ModeLabels: [
        "Shatter",
        "Cellular",
        "Blackhole",
        "Melt",
        "Swarm",
        "TTE",
        "Liquid Wave",
        "3D Cylinder",
        "Accordion",
        "3D Crawl",
        "Mirror Split",
        "Sonic Lens"
    ]

    readonly property var shortL3StyleLabels: [
        "Techno",
        "Liquid",
        "Laser",
        "Chrome",
        "LED Wall",
        "Acid Glitch",
        "UV Glow",
        "Brutalist",
        "Holo HUD",
        "Oscillo XY",
        "Iso 3D",
        "Tesla Arc",
        "Y2K Metal",
        "Copperbar",
        "Bio Spore",
        "Quantum"
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
    function suppressActionFeedback(message) {}

    property var engineState: Engine.createState()

    onGpuShaderEnabledChanged: {
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }
    onBackdropEnabledChanged: {
        if (root.backdropEnabled && !root._applyingPersistedConfig) {
            root.gpuShaderEnabled = true
        }
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }
    onBackdropModeChanged: {
        if (root.layer4Mode !== root.backdropMode) {
            root.layer4Mode = root.backdropMode % Engine.LAYER4_MODES.length
        }
        scheduleSaveVisualiserConfig()
    }
    onLayer4ModeChanged: {
        var normM = ((root.layer4Mode % Engine.LAYER4_MODES.length) + Engine.LAYER4_MODES.length) % Engine.LAYER4_MODES.length
        if (root.backdropMode !== normM) {
            root.backdropMode = normM
        }
        scheduleSaveVisualiserConfig()
    }
    onLayer4DualEnabledChanged: {
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }
    onLayer4SecondaryModeChanged: scheduleSaveVisualiserConfig()
    onLayer4DualMixChanged: scheduleSaveVisualiserConfig()
    onLayer4WallPatternChanged: scheduleSaveVisualiserConfig()
    onLayer4TwistChanged: scheduleSaveVisualiserConfig()
    onLayer4AutoRandomiseChanged: scheduleSaveVisualiserConfig()
    onBackdropSpeedChanged: scheduleSaveVisualiserConfig()
    onBackdropIntensityChanged: scheduleSaveVisualiserConfig()
    onBackdropSymmetryChanged: scheduleSaveVisualiserConfig()
    onBackdropDirectionChanged: scheduleSaveVisualiserConfig()
    onLayer1DirectionChanged: scheduleSaveVisualiserConfig()
    onLayer1EqScaleChanged: {
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
    }
    onLayer2VizEnabledChanged: {
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }
    onLayer2TracersEnabledChanged: {
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }
    onLayer1AutoRandomiseChanged: scheduleSaveVisualiserConfig()
    onLayerEqAutoRandomiseChanged: scheduleSaveVisualiserConfig()
    onLayerVectorsAutoRandomiseChanged: scheduleSaveVisualiserConfig()
    onLayer2AutoRandomiseChanged: scheduleSaveVisualiserConfig()
    onLayer3AutoRandomiseChanged: scheduleSaveVisualiserConfig()
    onDisableScreensaverInFullscreenOrVjChanged: scheduleSaveVisualiserConfig()
    onVjDeckModeChanged: scheduleSaveVisualiserConfig()
    onExternalStageOpenChanged: scheduleSaveVisualiserConfig()
    onIsFullscreenChanged: scheduleSaveVisualiserConfig()
    property string _lastEmittedConfigJson: ""

    function selectL3SourceOrGlyph(modeStr) {
        var m = String(modeStr || "").toLowerCase()
        root.layer3Enabled = true
        if (m === "art") {
            root.useAlbumArt = true
            if (root.asciiMode !== "braille" && root.asciiMode !== "block" && root.asciiMode !== "text") {
                root.asciiMode = "braille"
            }
        } else if (m === "words") {
            root.useAlbumArt = false
            if (root.asciiMode !== "braille" && root.asciiMode !== "block" && root.asciiMode !== "text") {
                root.asciiMode = "braille"
            }
        } else if (m === "braille") {
            root.asciiMode = "braille"
        } else if (m === "block") {
            root.asciiMode = "block"
        } else if (m === "text" || m === "crisp") {
            root.asciiMode = "text"
        }
        if (root.engineState) {
            root.engineState.artSourceKey = ""
            root.engineState.l3FormFactor = 1.0
            root.engineState.artBurst = 0.0
        }
        root.requestSetAsciiSourceMode(m)
        root.clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }

    function emitSaveVisualiserConfig() {
        if (root._applyingPersistedConfig) return
        var snap = root.buildPersistedConfigSnapshot()
        try {
            root._lastEmittedConfigJson = JSON.stringify(snap)
        } catch (e) {}
        root.requestSaveVisualiserConfig(snap)
    }

    onPersistedConfigChanged: {
        if (root.persistedConfig && Object.keys(root.persistedConfig).length > 0) {
            try {
                if (root._lastEmittedConfigJson && JSON.stringify(root.persistedConfig) === root._lastEmittedConfigJson) {
                    return
                }
            } catch (e) {}
            root.applyPersistedConfig(root.persistedConfig)
        }
    }

    Timer {
        id: saveConfigDebounceTimer
        interval: 350
        repeat: false
        onTriggered: {
            if (!root._applyingPersistedConfig) {
                root.emitSaveVisualiserConfig()
            }
        }
    }

    function scheduleSaveVisualiserConfig() {
        if (root._applyingPersistedConfig) return
        saveConfigDebounceTimer.restart()
    }

    function buildPersistedConfigSnapshot() {
        return {
            version: 3,
            paletteIndex: root.paletteIndex,
            musicDrive: root.musicDrive,
            gpuShaderEnabled: root.gpuShaderEnabled,
            backdropEnabled: root.backdropEnabled,
            backdropMode: root.backdropMode,
            backdropSpeed: root.backdropSpeed,
            backdropIntensity: root.backdropIntensity,
            backdropSymmetry: root.backdropSymmetry,
            backdropDirection: root.backdropDirection,
            layer4Enabled: root.layer4Enabled,
            layer4Mode: root.layer4Mode,
            layer4DualEnabled: root.layer4DualEnabled,
            layer4SecondaryMode: root.layer4SecondaryMode,
            layer4DualMix: root.layer4DualMix,
            layer4WallPattern: root.layer4WallPattern,
            layer4Twist: root.layer4Twist,
            layer4AutoRandomise: root.layer4AutoRandomise,
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
            disableScreensaverInFullscreenOrVj: root.disableScreensaverInFullscreenOrVj,
            vjDeckActive: Boolean(root.vjDeckMode || root.externalStageOpen || root.isFullscreen),
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
            layerEqAutoRandomise: root.layerEqAutoRandomise,
            layerVectorsAutoRandomise: root.layerVectorsAutoRandomise,
            layer1FieldEnabled: root.layer1FieldEnabled,
            layer1Mode: root.layer1Mode,
            layer1Direction: root.layer1Direction,
            layer1Persistence: root.layer1Persistence,
            layer1Speed: root.layer1Speed,
            layer1Density: root.layer1Density,
            layer1Dim: root.layer1Dim,
            layer1EqEnabled: root.layer1EqEnabled,
            layer1EqStyle: root.layer1EqStyle,
            layer1EqLayout: root.layer1EqLayout,
            layer1EqScale: root.layer1EqScale,
            layer1EqGain: root.layer1EqGain,
            layer1EqDamping: root.layer1EqDamping,
            layer1ShapesEnabled: root.layer1ShapesEnabled,
            layer1ShapeStyle: root.layer1ShapeStyle,
            layer1ShapeSpin: root.layer1ShapeSpin,
            layer1ShapeSpeed: root.layer1ShapeSpeed,
            layer1ShapeScale: root.layer1ShapeScale,
            layer1ShapeDensity: root.layer1ShapeDensity,
            layer2Enabled: root.layer2Enabled,
            layer2AutoRandomise: root.layer2AutoRandomise,
            layer2VizEnabled: root.layer2VizEnabled,
            layer2TracersEnabled: root.layer2TracersEnabled,
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
            layer3TextStyle: root.layer3TextStyle,
            layer3CylinderDir: root.layer3CylinderDir,
            layer3ShowArtist: root.layer3ShowArtist,
            layer3ShowTrack: root.layer3ShowTrack,
            layer3ShowAlbum: root.layer3ShowAlbum,
            useAlbumArt: root.useAlbumArt,
            asciiMode: root.asciiMode,
            layer3Dismantle: root.layer3Dismantle,
            layer3Rebuild: root.layer3Rebuild,
            layer3Evolution: root.layer3Evolution,
            layer3Scale: root.layer3Scale,
            layer3Tracers: root.layer3Tracers,
            turntableRpm: root.turntableRpm,
            turntableStyle: root.turntableStyle,
            savedL1Configs: root.savedL1Configs,
            savedL2Configs: root.savedL2Configs,
            savedL3Configs: root.savedL3Configs,
            savedL4Configs: root.savedL4Configs,
            collectivePresets: root.collectivePresets
        }
    }

    function applyPersistedConfig(cfg) {
        if (!cfg || typeof cfg !== "object" || Object.keys(cfg).length === 0) return
        root._applyingPersistedConfig = true
        var isLegacyV2 = (Number(cfg.version) || 0) < 3
        if (cfg.paletteIndex !== undefined) root.paletteIndex = Number(cfg.paletteIndex) % Engine.PALETTE_NAMES.length
        if (cfg.musicDrive !== undefined) root.musicDrive = Boolean(cfg.musicDrive)
        if (isLegacyV2) {
            root.gpuShaderEnabled = true
            root.backdropEnabled = cfg.backdropEnabled !== undefined ? Boolean(cfg.backdropEnabled) : true
            root.renderQuality = 1
            root.renderResW = 480
            root.targetFps = 48
            root.geometryDetail = 1.0
        } else {
            if (cfg.gpuShaderEnabled !== undefined) root.gpuShaderEnabled = Boolean(cfg.gpuShaderEnabled)
            if (cfg.backdropEnabled !== undefined) root.backdropEnabled = Boolean(cfg.backdropEnabled)
            if (cfg.layer4Enabled !== undefined) root.backdropEnabled = Boolean(cfg.layer4Enabled)
            if (cfg.renderQuality !== undefined) root.renderQuality = Number(cfg.renderQuality)
            if (cfg.renderResW !== undefined) root.renderResW = Number(cfg.renderResW)
            if (cfg.targetFps !== undefined) root.targetFps = Number(cfg.targetFps)
            if (cfg.geometryDetail !== undefined) root.geometryDetail = Number(cfg.geometryDetail)
        }
        if (cfg.backdropMode !== undefined) {
            root.backdropMode = Number(cfg.backdropMode) % Engine.LAYER4_MODES.length
            root.layer4Mode = root.backdropMode
        }
        if (cfg.layer4Mode !== undefined) {
            root.layer4Mode = Number(cfg.layer4Mode) % Engine.LAYER4_MODES.length
            root.backdropMode = root.layer4Mode
        }
        if (cfg.layer4DualEnabled !== undefined) root.layer4DualEnabled = Boolean(cfg.layer4DualEnabled)
        if (cfg.layer4SecondaryMode !== undefined) root.layer4SecondaryMode = Number(cfg.layer4SecondaryMode) % Engine.LAYER4_MODES.length
        if (cfg.layer4DualMix !== undefined) root.layer4DualMix = Math.max(0.10, Math.min(0.90, Number(cfg.layer4DualMix) || 0.50))
        if (cfg.layer4WallPattern !== undefined) root.layer4WallPattern = Number(cfg.layer4WallPattern) % Engine.LAYER4_WALL_PATTERNS.length
        if (cfg.layer4Twist !== undefined) root.layer4Twist = Math.max(0.0, Math.min(3.0, Number(cfg.layer4Twist)))
        if (cfg.layer4AutoRandomise !== undefined) root.layer4AutoRandomise = Boolean(cfg.layer4AutoRandomise)
        if (cfg.backdropSpeed !== undefined) root.backdropSpeed = Number(cfg.backdropSpeed)
        if (cfg.backdropIntensity !== undefined) root.backdropIntensity = Number(cfg.backdropIntensity)
        if (cfg.backdropSymmetry !== undefined) root.backdropSymmetry = Number(cfg.backdropSymmetry)
        if (cfg.backdropDirection !== undefined) root.backdropDirection = Number(cfg.backdropDirection)
        if (cfg.trackArcMode !== undefined) root.trackArcMode = Number(cfg.trackArcMode) % Engine.TRACK_ARC_MODES.length
        if (cfg.tracerCount !== undefined) root.tracerCount = Number(cfg.tracerCount)
        if (cfg.tracerSpeed !== undefined) root.tracerSpeed = Number(cfg.tracerSpeed)
        if (cfg.tracerDrift !== undefined) root.tracerDrift = Number(cfg.tracerDrift)
        if (cfg.tracerDirection !== undefined) root.tracerDirection = Number(cfg.tracerDirection)
        if (cfg.antialiasingEnabled !== undefined) root.antialiasingEnabled = Boolean(cfg.antialiasingEnabled)
        if (cfg.disableScreensaverInFullscreenOrVj !== undefined) root.disableScreensaverInFullscreenOrVj = Boolean(cfg.disableScreensaverInFullscreenOrVj)
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
        if (cfg.layerEqAutoRandomise !== undefined) root.layerEqAutoRandomise = Boolean(cfg.layerEqAutoRandomise)
        if (cfg.layerVectorsAutoRandomise !== undefined) root.layerVectorsAutoRandomise = Boolean(cfg.layerVectorsAutoRandomise)
        if (cfg.layer1FieldEnabled !== undefined) root.layer1FieldEnabled = Boolean(cfg.layer1FieldEnabled)
        if (cfg.layer1Mode !== undefined) root.layer1Mode = Number(cfg.layer1Mode) % Engine.LAYER1_MODES.length
        if (cfg.layer1Direction !== undefined) root.layer1Direction = Number(cfg.layer1Direction)
        if (cfg.layer1Persistence !== undefined) root.layer1Persistence = Number(cfg.layer1Persistence)
        if (cfg.layer1Speed !== undefined) root.layer1Speed = Number(cfg.layer1Speed)
        if (cfg.layer1Density !== undefined) root.layer1Density = Number(cfg.layer1Density)
        if (cfg.layer1Dim !== undefined) root.layer1Dim = Number(cfg.layer1Dim)
        if (cfg.layer1EqEnabled !== undefined) root.layer1EqEnabled = Boolean(cfg.layer1EqEnabled)
        if (cfg.layer1EqStyle !== undefined) root.layer1EqStyle = Number(cfg.layer1EqStyle) % Engine.LAYER1_EQ_STYLES.length
        if (cfg.layer1EqLayout !== undefined) root.layer1EqLayout = Number(cfg.layer1EqLayout) % Engine.LAYER1_EQ_LAYOUTS.length
        if (cfg.layer1EqScale !== undefined) root.layer1EqScale = Math.max(0.15, Math.min(2.25, Number(cfg.layer1EqScale) || 1.0))
        if (cfg.layer1EqGain !== undefined) root.layer1EqGain = Number(cfg.layer1EqGain)
        if (cfg.layer1EqDamping !== undefined) root.layer1EqDamping = Number(cfg.layer1EqDamping) % Engine.LAYER1_EQ_DAMPING.length
        if (cfg.layer1ShapesEnabled !== undefined) root.layer1ShapesEnabled = Boolean(cfg.layer1ShapesEnabled)
        if (cfg.layer1ShapeStyle !== undefined) root.layer1ShapeStyle = Number(cfg.layer1ShapeStyle) % Engine.LAYER1_SHAPE_STYLES.length
        if (cfg.layer1ShapeSpin !== undefined) root.layer1ShapeSpin = Number(cfg.layer1ShapeSpin)
        if (cfg.layer1ShapeSpeed !== undefined) root.layer1ShapeSpeed = Number(cfg.layer1ShapeSpeed)
        if (cfg.layer1ShapeScale !== undefined) root.layer1ShapeScale = Number(cfg.layer1ShapeScale)
        if (cfg.layer1ShapeDensity !== undefined) root.layer1ShapeDensity = Number(cfg.layer1ShapeDensity)

        if (cfg.layer2Enabled !== undefined) root.layer2Enabled = Boolean(cfg.layer2Enabled)
        if (cfg.layer2AutoRandomise !== undefined) root.layer2AutoRandomise = Boolean(cfg.layer2AutoRandomise)
        if (cfg.layer2VizEnabled !== undefined) root.layer2VizEnabled = Boolean(cfg.layer2VizEnabled)
        if (cfg.layer2TracersEnabled !== undefined) root.layer2TracersEnabled = Boolean(cfg.layer2TracersEnabled)
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
        if (cfg.layer3TextStyle !== undefined) root.layer3TextStyle = Number(cfg.layer3TextStyle) % Engine.LAYER3_TEXT_STYLES.length
        if (cfg.layer3CylinderDir !== undefined) root.layer3CylinderDir = Number(cfg.layer3CylinderDir) % Engine.LAYER3_CYLINDER_DIRS.length
        if (cfg.layer3ShowArtist !== undefined) root.layer3ShowArtist = Boolean(cfg.layer3ShowArtist)
        if (cfg.layer3ShowTrack !== undefined) root.layer3ShowTrack = Boolean(cfg.layer3ShowTrack)
        if (cfg.layer3ShowAlbum !== undefined) root.layer3ShowAlbum = Boolean(cfg.layer3ShowAlbum)
        if (cfg.useAlbumArt !== undefined) root.useAlbumArt = Boolean(cfg.useAlbumArt)
        if (cfg.asciiMode !== undefined) {
            var am = String(cfg.asciiMode).toLowerCase()
            root.asciiMode = (am === "block" || am === "text") ? am : "braille"
        }
        if (cfg.layer3Dismantle !== undefined) root.layer3Dismantle = Number(cfg.layer3Dismantle)
        if (cfg.layer3Rebuild !== undefined) root.layer3Rebuild = Number(cfg.layer3Rebuild)
        if (cfg.layer3Evolution !== undefined) root.layer3Evolution = Number(cfg.layer3Evolution)
        if (cfg.layer3Scale !== undefined) root.layer3Scale = Number(cfg.layer3Scale)
        if (cfg.layer3Tracers !== undefined) root.layer3Tracers = Number(cfg.layer3Tracers)
        if (cfg.turntableRpm !== undefined) {
            root.turntableRpm = Math.max(16.0, Math.min(78.0, Number(cfg.turntableRpm) || 33.3))
            stageTurntable.rpm = root.turntableRpm
        }
        if (cfg.turntableStyle !== undefined) {
            root.turntableStyle = Math.max(0, Math.min(4, Math.round(Number(cfg.turntableStyle) || 0)))
            stageTurntable.vinylStyle = root.turntableStyle
        }

        if (Array.isArray(cfg.savedL1Configs)) root.savedL1Configs = cfg.savedL1Configs
        if (Array.isArray(cfg.savedL2Configs)) root.savedL2Configs = cfg.savedL2Configs
        if (Array.isArray(cfg.savedL3Configs)) root.savedL3Configs = cfg.savedL3Configs
        if (Array.isArray(cfg.savedL4Configs)) root.savedL4Configs = cfg.savedL4Configs
        if (Array.isArray(cfg.collectivePresets) && cfg.collectivePresets.length > 0) root.collectivePresets = cfg.collectivePresets

        root._applyingPersistedConfig = false
        if (isLegacyV2) {
            scheduleSaveVisualiserConfig()
        }
        clearCanvasImmediate()
    }

    function resetAllVisualiserDefaults() {
        root.renderQuality = 1
        root.renderResW = 480
        root.targetFps = 48
        root.geometryDetail = 1.0
        root.antialiasingEnabled = true
        root.disableScreensaverInFullscreenOrVj = true
        root.audioSensitivity = 1.35
        root.beatPunch = 1.15
        root.audioSmoothing = 0.50
        root.colourCycleSpeed = 1.00
        root.masterBrightness = 1.00
        root.autoCycleIntervalSec = 18
        root.presetTransitionIntervalSec = 10
        root.musicDrive = true
        root.gpuShaderEnabled = true
        root.backdropEnabled = true
        root.backdropMode = 0
        root.layer4Mode = 0
        root.layer4DualEnabled = false
        root.layer4SecondaryMode = 1
        root.layer4DualMix = 0.50
        root.layer4WallPattern = 0
        root.layer4Twist = 1.00
        root.backdropSpeed = 1.0
        root.backdropIntensity = 1.0
        root.backdropSymmetry = 6
        root.backdropDirection = 1
        root.layer1Enabled = true
        root.layer1FieldEnabled = true
        root.layer1Mode = 0
        root.layer1Direction = 1
        root.layer1Speed = 1.0
        root.layer1Density = 1.0
        root.layer1EqEnabled = true
        root.layer1EqStyle = 0
        root.layer1EqLayout = 0
        root.layer1EqScale = 1.0
        root.layer1ShapesEnabled = true
        root.layer1ShapeStyle = 0
        root.layer1ShapeDensity = 1.0
        root.layer2Enabled = true
        root.layer2VizEnabled = true
        root.layer2TracersEnabled = true
        root.visualMode = 0
        root.tracerCount = 4
        root.tracerDirection = 1
        root.layer3Enabled = true
        root.layer3Mode = 0
        root.layer3TextStyle = 0
        root.layer3CylinderDir = 0
        root.layer3ShowArtist = true
        root.layer3ShowTrack = true
        root.layer3ShowAlbum = true
        root.layer3Tracers = 3
        root.autoCycle = false
        root.layer1AutoRandomise = false
        root.layerEqAutoRandomise = false
        root.layerVectorsAutoRandomise = false
        root.layer2AutoRandomise = false
        root.layer3AutoRandomise = false
        root.layer4AutoRandomise = false
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
            l1Direction: root.layer1Direction,
            l1Persistence: root.layer1Persistence,
            l1Speed: root.layer1Speed,
            l1Density: root.layer1Density,
            l1Dim: root.layer1Dim,
            l1EqEnabled: root.layer1EqEnabled,
            l1EqStyle: root.layer1EqStyle,
            l1EqLayout: root.layer1EqLayout,
            l1EqScale: root.layer1EqScale,
            l1EqGain: root.layer1EqGain,
            l1EqDamping: root.layer1EqDamping,
            l1ShapesEnabled: root.layer1ShapesEnabled,
            l1ShapeStyle: root.layer1ShapeStyle,
            l1ShapeSpin: root.layer1ShapeSpin,
            l1ShapeSpeed: root.layer1ShapeSpeed,
            l1ShapeScale: root.layer1ShapeScale,
            l1ShapeDensity: root.layer1ShapeDensity,
            l1AutoRandomise: root.layer1AutoRandomise
        }
        copy.push(item)
        root.savedL1Configs = copy
        root.currentSavedL1Index = copy.length - 1
        root.emitSaveVisualiserConfig()
        root.requestActionFeedback("Saved L1 Setting: " + item.name)
    }

    function applySavedL1Config(idx) {
        var list = root.savedL1Configs || []
        if (idx < 0 || idx >= list.length) return
        var item = list[idx]
        root.currentSavedL1Index = idx
        // Strictly update ONLY Layer #1 properties — NEVER touch Layer #2, Layer #3, or Layer #4!
        root.layer1Enabled = true
        if (item.l1FieldEnabled !== undefined) root.layer1FieldEnabled = Boolean(item.l1FieldEnabled)
        if (item.l1Mode !== undefined) root.layer1Mode = Number(item.l1Mode) % Engine.LAYER1_MODES.length
        if (item.l1Direction !== undefined) root.layer1Direction = Number(item.l1Direction)
        if (item.l1Persistence !== undefined) root.layer1Persistence = Number(item.l1Persistence)
        if (item.l1Speed !== undefined) root.layer1Speed = Number(item.l1Speed)
        if (item.l1Density !== undefined) root.layer1Density = Number(item.l1Density)
        if (item.l1Dim !== undefined) root.layer1Dim = Number(item.l1Dim)
        if (item.l1EqEnabled !== undefined) root.layer1EqEnabled = Boolean(item.l1EqEnabled)
        if (item.l1EqStyle !== undefined) root.layer1EqStyle = Number(item.l1EqStyle) % Engine.LAYER1_EQ_STYLES.length
        if (item.l1EqLayout !== undefined) root.layer1EqLayout = Number(item.l1EqLayout) % Engine.LAYER1_EQ_LAYOUTS.length
        if (item.l1EqScale !== undefined) root.layer1EqScale = Math.max(0.15, Math.min(2.25, Number(item.l1EqScale)))
        if (item.l1EqGain !== undefined) root.layer1EqGain = Number(item.l1EqGain)
        if (item.l1EqDamping !== undefined) root.layer1EqDamping = Number(item.l1EqDamping) % Engine.LAYER1_EQ_DAMPING.length
        if (item.l1ShapesEnabled !== undefined) root.layer1ShapesEnabled = Boolean(item.l1ShapesEnabled)
        if (item.l1ShapeStyle !== undefined) root.layer1ShapeStyle = Number(item.l1ShapeStyle) % Engine.LAYER1_SHAPE_STYLES.length
        if (item.l1ShapeSpin !== undefined) root.layer1ShapeSpin = Number(item.l1ShapeSpin)
        if (item.l1ShapeSpeed !== undefined) root.layer1ShapeSpeed = Number(item.l1ShapeSpeed)
        if (item.l1ShapeScale !== undefined) root.layer1ShapeScale = Number(item.l1ShapeScale)
        if (item.l1ShapeDensity !== undefined) root.layer1ShapeDensity = Number(item.l1ShapeDensity)
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
        root.emitSaveVisualiserConfig()
        root.requestActionFeedback("Removed Saved L1: " + (removed && removed.name ? removed.name : ""))
    }

    function saveCurrentL2Config() {
        var copy = (root.savedL2Configs || []).slice()
        var mName = root.layer2VizEnabled ? (Engine.MODE_NAMES[root.visualMode] || "Mode").split(" ")[0] : "NoViz"
        var trName = root.layer2TracersEnabled ? (root.tracerCount + "x") : "NoTr"
        var item = {
            name: mName + " · " + trName,
            l2VizEnabled: root.layer2VizEnabled,
            l2Mode: root.visualMode,
            symmetryIndex: root.symmetryIndex,
            paletteIndex: root.paletteIndex,
            sensitivity: root.sensitivity,
            l2Complexity: root.layer2Complexity,
            l2Speed: root.layer2Speed,
            l2Zoom: root.layer2Zoom,
            l2Chaos: root.layer2Chaos,
            l2TracersEnabled: root.layer2TracersEnabled,
            tracerCount: root.tracerCount,
            tracerSpeed: root.tracerSpeed,
            tracerDrift: root.tracerDrift,
            tracerDirection: root.tracerDirection,
            l2AutoRandomise: root.layer2AutoRandomise
        }
        copy.push(item)
        root.savedL2Configs = copy
        root.currentSavedL2Index = copy.length - 1
        root.emitSaveVisualiserConfig()
        root.requestActionFeedback("Saved L2 Setting: " + item.name)
    }

    function applySavedL2Config(idx) {
        var list = root.savedL2Configs || []
        if (idx < 0 || idx >= list.length) return
        var item = list[idx]
        root.currentSavedL2Index = idx
        // Strictly update ONLY Layer #2 properties — NEVER touch Layer #1, Layer #3, or Layer #4!
        root.layer2Enabled = true
        if (item.l2VizEnabled !== undefined) root.layer2VizEnabled = Boolean(item.l2VizEnabled)
        if (item.l2Mode !== undefined) root.visualMode = Number(item.l2Mode) % Engine.MODE_NAMES.length
        if (item.symmetryIndex !== undefined) root.symmetryIndex = Number(item.symmetryIndex) % Engine.SYMMETRY_OPTIONS.length
        if (item.paletteIndex !== undefined) root.paletteIndex = Number(item.paletteIndex) % Engine.PALETTE_NAMES.length
        if (item.sensitivity !== undefined) root.sensitivity = Number(item.sensitivity)
        if (item.l2Complexity !== undefined) root.layer2Complexity = Number(item.l2Complexity)
        if (item.l2Speed !== undefined) root.layer2Speed = Number(item.l2Speed)
        if (item.l2Zoom !== undefined) root.layer2Zoom = Number(item.l2Zoom)
        if (item.l2Chaos !== undefined) root.layer2Chaos = Number(item.l2Chaos)
        if (item.l2TracersEnabled !== undefined) root.layer2TracersEnabled = Boolean(item.l2TracersEnabled)
        if (item.tracerCount !== undefined) root.tracerCount = Number(item.tracerCount)
        if (item.tracerSpeed !== undefined) root.tracerSpeed = Number(item.tracerSpeed)
        if (item.tracerDrift !== undefined) root.tracerDrift = Number(item.tracerDrift)
        if (item.tracerDirection !== undefined) root.tracerDirection = Number(item.tracerDirection)
        if (item.l2AutoRandomise !== undefined) root.layer2AutoRandomise = Boolean(item.l2AutoRandomise)
        clearCanvasImmediate()
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
        root.emitSaveVisualiserConfig()
        root.requestActionFeedback("Removed Saved L2: " + (removed && removed.name ? removed.name : ""))
    }

    function saveCurrentL3Config() {
        var copy = (root.savedL3Configs || []).slice()
        var srcLabel = root.useAlbumArt ? "Art" : "Words"
        var glyphLabel = root.asciiMode === "block" ? "Block" : (root.asciiMode === "text" ? "Text" : "Braille")
        var styleLabel = root.shortL3StyleLabels[root.layer3TextStyle % root.shortL3StyleLabels.length] || "Techno"
        var modeLabel = (Engine.LAYER3_MODES[root.layer3Mode] || "Shatter").split(" ")[0]
        var item = {
            name: srcLabel + " · " + glyphLabel + " · " + styleLabel + " · " + modeLabel,
            l3Mode: root.layer3Mode,
            l3TextStyle: root.layer3TextStyle,
            l3CylinderDir: root.layer3CylinderDir,
            l3ShowArtist: root.layer3ShowArtist,
            l3ShowTrack: root.layer3ShowTrack,
            l3ShowAlbum: root.layer3ShowAlbum,
            useAlbumArt: root.useAlbumArt,
            asciiMode: root.asciiMode === "block" ? "block" : (root.asciiMode === "text" ? "text" : "braille"),
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
        root.emitSaveVisualiserConfig()
        root.requestActionFeedback("Saved L3 Setting: " + item.name)
    }

    function applySavedL3Config(idx) {
        var list = root.savedL3Configs || []
        if (idx < 0 || idx >= list.length) return
        var item = list[idx]
        root.currentSavedL3Index = idx
        // Strictly update ONLY Layer #3 properties — NEVER touch Layer #1, Layer #2, or Layer #4!
        root.layer3Enabled = true
        if (item.l3Mode !== undefined) root.layer3Mode = Number(item.l3Mode) % Engine.LAYER3_MODES.length
        if (item.l3TextStyle !== undefined) root.layer3TextStyle = Number(item.l3TextStyle) % Engine.LAYER3_TEXT_STYLES.length
        if (item.l3CylinderDir !== undefined) root.layer3CylinderDir = Number(item.l3CylinderDir) % Engine.LAYER3_CYLINDER_DIRS.length
        if (item.l3ShowArtist !== undefined) root.layer3ShowArtist = Boolean(item.l3ShowArtist)
        if (item.l3ShowTrack !== undefined) root.layer3ShowTrack = Boolean(item.l3ShowTrack)
        if (item.l3ShowAlbum !== undefined) root.layer3ShowAlbum = Boolean(item.l3ShowAlbum)
        if (item.useAlbumArt !== undefined) {
            root.selectL3SourceOrGlyph(item.useAlbumArt ? "art" : "words")
        }
        if (item.asciiMode !== undefined) {
            root.selectL3SourceOrGlyph(item.asciiMode === "block" ? "block" : (item.asciiMode === "text" ? "text" : "braille"))
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
        clearCanvasImmediate()
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
        root.emitSaveVisualiserConfig()
        root.requestActionFeedback("Removed Saved L3: " + (removed && removed.name ? removed.name : ""))
    }

    function saveCurrentL4Config() {
        var copy = (root.savedL4Configs || []).slice()
        var pName = (Engine.LAYER4_MODES[root.layer4Mode] || "Tunnel").split(" ")[0]
        var sName = root.layer4DualEnabled ? (" + " + (Engine.LAYER4_MODES[root.layer4SecondaryMode] || "Vortex").split(" ")[0] + " (2x)") : ""
        var wName = Engine.LAYER4_WALL_PATTERNS[root.layer4WallPattern % Engine.LAYER4_WALL_PATTERNS.length] || "Rings"
        var item = {
            name: pName + sName + " · " + wName,
            l4Enabled: root.layer4Enabled,
            l4Mode: root.layer4Mode,
            l4DualEnabled: root.layer4DualEnabled,
            l4SecondaryMode: root.layer4SecondaryMode,
            l4DualMix: root.layer4DualMix,
            l4WallPattern: root.layer4WallPattern,
            l4Twist: root.layer4Twist,
            l4Speed: root.backdropSpeed,
            l4Glow: root.backdropIntensity,
            l4Symmetry: root.backdropSymmetry,
            l4Direction: root.backdropDirection,
            l4AutoRandomise: root.layer4AutoRandomise
        }
        copy.push(item)
        root.savedL4Configs = copy
        root.currentSavedL4Index = copy.length - 1
        root.emitSaveVisualiserConfig()
        root.requestActionFeedback("Saved L4 Setting: " + item.name)
    }

    function applySavedL4Config(idx) {
        var list = root.savedL4Configs || []
        if (idx < 0 || idx >= list.length) return
        var item = list[idx]
        root.currentSavedL4Index = idx
        // Strictly update ONLY Layer #4 properties — NEVER touch Layer #1, Layer #2, or Layer #3!
        root.layer4Enabled = item.l4Enabled !== undefined ? Boolean(item.l4Enabled) : true
        if (item.l4Mode !== undefined) root.layer4Mode = Number(item.l4Mode) % Engine.LAYER4_MODES.length
        if (item.l4DualEnabled !== undefined) root.layer4DualEnabled = Boolean(item.l4DualEnabled)
        if (item.l4SecondaryMode !== undefined) root.layer4SecondaryMode = Number(item.l4SecondaryMode) % Engine.LAYER4_MODES.length
        if (item.l4DualMix !== undefined) root.layer4DualMix = Math.max(0.10, Math.min(0.90, Number(item.l4DualMix)))
        if (item.l4WallPattern !== undefined) root.layer4WallPattern = Number(item.l4WallPattern) % Engine.LAYER4_WALL_PATTERNS.length
        if (item.l4Twist !== undefined) root.layer4Twist = Math.max(0.0, Math.min(3.0, Number(item.l4Twist)))
        if (item.l4Speed !== undefined) root.backdropSpeed = Number(item.l4Speed)
        if (item.l4Glow !== undefined) root.backdropIntensity = Number(item.l4Glow)
        if (item.l4Symmetry !== undefined) root.backdropSymmetry = Number(item.l4Symmetry)
        if (item.l4Direction !== undefined) root.backdropDirection = Number(item.l4Direction)
        if (item.l4AutoRandomise !== undefined) root.layer4AutoRandomise = Boolean(item.l4AutoRandomise)
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
        root.requestActionFeedback("Applied Saved L4: " + (item.name || ("L4 #" + (idx + 1))))
    }

    function cycleSavedL4Config(delta) {
        var list = root.savedL4Configs || []
        if (list.length === 0) return
        var step = (delta !== undefined && delta < 0) ? -1 : 1
        var nextIdx = (root.currentSavedL4Index + step + list.length) % list.length
        applySavedL4Config(nextIdx)
    }

    function deleteSavedL4Config(idx) {
        var copy = (root.savedL4Configs || []).slice()
        if (idx < 0 || idx >= copy.length) return
        var removed = copy.splice(idx, 1)[0]
        root.savedL4Configs = copy
        root.currentSavedL4Index = Math.max(0, Math.min(copy.length - 1, root.currentSavedL4Index))
        root.emitSaveVisualiserConfig()
        root.requestActionFeedback("Removed Saved L4: " + (removed && removed.name ? removed.name : ""))
    }

    function clearCanvasImmediate() {
        root._cachedFrameConfig = root.currentConfig()
        if (root.engineState) {
            root.engineState.clearFeedbackFrames = 3
        }
        if (vizCanvas) {
            vizCanvas.requestPaint()
        }
    }

    function syncLayer1MasterFromSubs() {
        root.layer1Enabled = Boolean(root.layer1FieldEnabled || root.layer1EqEnabled || root.layer1ShapesEnabled)
    }

    onLayer1EnabledChanged: {
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
    onLayer1EqLayoutChanged: { clearCanvasImmediate(); scheduleSaveVisualiserConfig() }
    onLayer1ShapeStyleChanged: { clearCanvasImmediate(); scheduleSaveVisualiserConfig() }
    onLayer2EnabledChanged: { clearCanvasImmediate(); scheduleSaveVisualiserConfig() }
    onLayer3EnabledChanged: { clearCanvasImmediate(); scheduleSaveVisualiserConfig() }
    onLayer3ModeChanged: scheduleSaveVisualiserConfig()
    onLayer3TextStyleChanged: {
        if (vizCanvas) vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
    }
    onLayer3ShowArtistChanged: {
        if (root.engineState) root.engineState.artSourceKey = ""
        if (vizCanvas) vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
    }
    onLayer3ShowTrackChanged: {
        if (root.engineState) root.engineState.artSourceKey = ""
        if (vizCanvas) vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
    }
    onLayer3ShowAlbumChanged: {
        if (root.engineState) root.engineState.artSourceKey = ""
        if (vizCanvas) vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
    }
    onTracerCountChanged: scheduleSaveVisualiserConfig()
    onLayer3TracersChanged: scheduleSaveVisualiserConfig()

    onTrackTitleChanged: {
        if (root.engineState) root.engineState.artSourceKey = ""
        if (vizCanvas) vizCanvas.requestPaint()
    }
    onTrackArtistChanged: {
        if (root.engineState) root.engineState.artSourceKey = ""
        if (vizCanvas) vizCanvas.requestPaint()
    }
    onTrackAlbumChanged: {
        if (root.engineState) root.engineState.artSourceKey = ""
        if (vizCanvas) vizCanvas.requestPaint()
    }

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
        if (root.engineState) {
            root.engineState.artSourceKey = ""
        }
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
    }

    onAsciiModeChanged: {
        if (root.engineState) {
            root.engineState.artSourceKey = ""
        }
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
            trackTitle: root.trackTitle,
            trackArtist: root.trackArtist,
            trackAlbum: root.trackAlbum,
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
            layer4Enabled: root.layer4Enabled,
            layer4Mode: root.layer4Mode,
            layer4DualEnabled: root.layer4DualEnabled,
            layer4SecondaryMode: root.layer4SecondaryMode,
            layer4DualMix: root.layer4DualMix,
            layer4WallPattern: root.layer4WallPattern,
            layer4Twist: root.layer4Twist,
            layer4Speed: root.backdropSpeed,
            layer4Glow: root.backdropIntensity,
            layer4Symmetry: root.backdropSymmetry,
            layer4Direction: root.backdropDirection,
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
            layer1Direction: root.layer1Direction,
            layer1Persistence: root.layer1Persistence,
            layer1Trail: root.layer1Persistence,
            layer1Speed: root.layer1Speed,
            layer1Density: root.layer1Density,
            layer1Dim: root.layer1Dim,
            layer1EqEnabled: root.layer1EqEnabled,
            layer1EqStyle: root.layer1EqStyle,
            layer1EqLayout: root.layer1EqLayout,
            layer1EqScale: root.layer1EqScale,
            layer1EqGain: root.layer1EqGain,
            layer1EqDamping: root.layer1EqDamping,
            layer1ShapesEnabled: root.layer1ShapesEnabled,
            layer1ShapeStyle: root.layer1ShapeStyle,
            layer1ShapeSpin: root.layer1ShapeSpin,
            layer1ShapeSpeed: root.layer1ShapeSpeed,
            layer1ShapeScale: root.layer1ShapeScale,
            layer1ShapeDensity: root.layer1ShapeDensity,
            layer2Enabled: root.layer2Enabled,
            layer2VizEnabled: root.layer2VizEnabled,
            layer2TracersEnabled: root.layer2TracersEnabled,
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
            layer3TextStyle: root.layer3TextStyle,
            layer3CylinderDir: root.layer3CylinderDir,
            layer3ShowArtist: root.layer3ShowArtist,
            layer3ShowTrack: root.layer3ShowTrack,
            layer3ShowAlbum: root.layer3ShowAlbum,
            layer3Dismantle: root.layer3Dismantle,
            layer3Rebuild: root.layer3Rebuild,
            layer3Evolution: root.layer3Evolution,
            layer3Scale: root.layer3Scale,
            layer3Tracers: root.layer3Tracers,
            layer3AutoRandomise: root.layer3AutoRandomise,
            autoCycle: root.autoCycle
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
    // Collective L1 + L2 + L3 + L4 Preset Management & Smooth Transitioning
    // -------------------------------------------------------------------------
    function applyCollectivePreset(idx, smoothMorph) {
        if (!root.collectivePresets || idx < 0 || idx >= root.collectivePresets.length) return
        var p = root.collectivePresets[idx]
        root.currentPresetIndex = idx

        // Discrete layer states & modes switch cleanly while respecting exact preset layer flags
        root.paletteIndex = Number(p.palette || 0) % Engine.PALETTE_NAMES.length
        root.musicDrive = p.musicDrive !== undefined ? Boolean(p.musicDrive) : true
        if (p.backdropEnabled !== undefined) {
            root.backdropEnabled = Boolean(p.backdropEnabled)
        }
        if (p.backdropMode !== undefined) root.backdropMode = Number(p.backdropMode) % Engine.LAYER4_MODES.length
        if (p.backdropSpeed !== undefined) root.backdropSpeed = Number(p.backdropSpeed)
        if (p.backdropIntensity !== undefined) root.backdropIntensity = Number(p.backdropIntensity)
        if (p.backdropSymmetry !== undefined) root.backdropSymmetry = Number(p.backdropSymmetry)
        if (p.backdropDirection !== undefined) root.backdropDirection = Number(p.backdropDirection)
        root.tracerCount = p.tracerCount !== undefined ? Number(p.tracerCount) : 4
        root.layer2TracersEnabled = p.l2TracersEnabled !== undefined ? Boolean(p.l2TracersEnabled) : (root.tracerCount > 1)
        root.tracerDirection = p.tracerDirection !== undefined ? Number(p.tracerDirection) : 1

        root.layer1Enabled = Boolean(p.l1Enabled)
        root.layer1FieldEnabled = p.l1FieldEnabled !== undefined ? Boolean(p.l1FieldEnabled) : true
        root.layer1Mode = Number(p.l1Mode || 0) % Engine.LAYER1_MODES.length
        if (p.l1Direction !== undefined) root.layer1Direction = Number(p.l1Direction)
        root.layer1EqEnabled = p.l1EqEnabled !== undefined ? Boolean(p.l1EqEnabled) : true
        root.layer1EqStyle = Number(p.l1EqStyle || 0) % Engine.LAYER1_EQ_STYLES.length
        root.layer1EqLayout = Number(p.l1EqLayout || 0) % Engine.LAYER1_EQ_LAYOUTS.length
        root.layer1EqScale = p.l1EqScale !== undefined ? Math.max(0.15, Math.min(2.25, Number(p.l1EqScale))) : 1.0
        root.layer1EqDamping = Number(p.l1EqDamping || 0) % Engine.LAYER1_EQ_DAMPING.length
        root.layer1ShapesEnabled = p.l1ShapesEnabled !== undefined ? Boolean(p.l1ShapesEnabled) : true
        root.layer1ShapeStyle = Number(p.l1ShapeStyle || 0) % Engine.LAYER1_SHAPE_STYLES.length

        root.layer2Enabled = Boolean(p.l2Enabled)
        root.layer2VizEnabled = p.l2VizEnabled !== undefined ? Boolean(p.l2VizEnabled) : true
        root.visualMode = Number(p.l2Mode || 0) % Engine.MODE_NAMES.length

        root.layer3Enabled = Boolean(p.l3Enabled)
        root.layer3Mode = Number(p.l3Mode || 0) % Engine.LAYER3_MODES.length
        if (p.l3TextStyle !== undefined) root.layer3TextStyle = Number(p.l3TextStyle) % Engine.LAYER3_TEXT_STYLES.length
        if (p.l3CylinderDir !== undefined) root.layer3CylinderDir = Number(p.l3CylinderDir) % Engine.LAYER3_CYLINDER_DIRS.length
        if (p.useAlbumArt !== undefined) {
            root.useAlbumArt = Boolean(p.useAlbumArt)
            root.requestSetAsciiSourceMode(root.useAlbumArt ? "art" : "words")
        }
        if (p.asciiMode !== undefined) {
            var pm = String(p.asciiMode).toLowerCase()
            root.asciiMode = (pm === "block" || pm === "text") ? pm : "braille"
            root.requestSetAsciiSourceMode(root.asciiMode)
        }
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
            root.layer1ShapeDensity = Number(p.l1ShapeDensity !== undefined ? p.l1ShapeDensity : 1.0)
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
        root.suppressActionFeedback("Preset: " + p.name)
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
            root.emitSaveVisualiserConfig()
            root.suppressActionFeedback((item.selected ? "Included in" : "Excluded from") + " preset cycle: " + item.name)
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
            backdropEnabled: root.backdropEnabled,
            backdropMode: root.backdropMode,
            backdropSpeed: root.backdropSpeed,
            backdropIntensity: root.backdropIntensity,
            backdropSymmetry: root.backdropSymmetry,
            backdropDirection: root.backdropDirection,
            l2TracersEnabled: root.layer2TracersEnabled,
            tracerCount: root.tracerCount,
            tracerSpeed: root.tracerSpeed,
            tracerDrift: root.tracerDrift,
            tracerDirection: root.tracerDirection,
            l1Enabled: root.layer1Enabled,
            l1FieldEnabled: root.layer1FieldEnabled,
            l1Mode: root.layer1Mode,
            l1Direction: root.layer1Direction,
            l1Persistence: root.layer1Persistence,
            l1Speed: root.layer1Speed,
            l1Density: root.layer1Density,
            l1Dim: root.layer1Dim,
            l1EqEnabled: root.layer1EqEnabled,
            l1EqStyle: root.layer1EqStyle,
            l1EqLayout: root.layer1EqLayout,
            l1EqScale: root.layer1EqScale,
            l1EqGain: root.layer1EqGain,
            l1EqDamping: root.layer1EqDamping,
            l1ShapesEnabled: root.layer1ShapesEnabled,
            l1ShapeStyle: root.layer1ShapeStyle,
            l1ShapeSpin: root.layer1ShapeSpin,
            l1ShapeSpeed: root.layer1ShapeSpeed,
            l1ShapeScale: root.layer1ShapeScale,
            l1ShapeDensity: root.layer1ShapeDensity,
            l2Enabled: root.layer2Enabled,
            l2VizEnabled: root.layer2VizEnabled,
            l2Mode: root.visualMode,
            sensitivity: root.sensitivity,
            l2Complexity: root.layer2Complexity,
            l2Speed: root.layer2Speed,
            l2Zoom: root.layer2Zoom,
            l3Enabled: root.layer3Enabled,
            l3Mode: root.layer3Mode,
            l3TextStyle: root.layer3TextStyle,
            l3CylinderDir: root.layer3CylinderDir,
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
        root.emitSaveVisualiserConfig()
        root.suppressActionFeedback("Saved Collective Preset: " + newPreset.name)
    }

    // Strict Layer Isolation in cycle functions: NEVER force-enable another or disabled layer unless explicitly toggled
    function cycleMode(delta) {
        var count = Engine.MODE_NAMES.length
        visualMode = (visualMode + delta + count) % count
        vizCanvas.requestPaint()
        root.suppressActionFeedback("4: Geometry: " + Engine.MODE_NAMES[visualMode])
    }

    function cycleLayer1Mode(delta) {
        var count = Engine.LAYER1_MODES.length
        root.layer1FieldEnabled = true
        root.syncLayer1MasterFromSubs()
        layer1Mode = (layer1Mode + delta + count) % count
        vizCanvas.requestPaint()
        root.suppressActionFeedback("1: Worlds: " + Engine.LAYER1_MODES[layer1Mode])
    }

    function cycleLayer3Mode(delta) {
        var count = Engine.LAYER3_MODES.length
        layer3Mode = (layer3Mode + delta + count) % count
        vizCanvas.requestPaint()
        root.suppressActionFeedback("6: Typography: " + Engine.LAYER3_MODES[layer3Mode])
    }

    function cycleLayer3TextStyle(delta) {
        var count = Engine.LAYER3_TEXT_STYLES.length
        var step = (delta !== undefined && delta < 0) ? -1 : 1
        root.layer3TextStyle = (root.layer3TextStyle + step + count) % count
        root.layer3Enabled = true
        vizCanvas.requestPaint()
        root.suppressActionFeedback("Text Style: " + Engine.LAYER3_TEXT_STYLES[root.layer3TextStyle])
    }

    function cycleLayer3CylinderDir(delta) {
        var count = Engine.LAYER3_CYLINDER_DIRS.length
        var step = (delta !== undefined && delta < 0) ? -1 : 1
        root.layer3CylinderDir = (root.layer3CylinderDir + step + count) % count
        root.layer3Enabled = true
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
        root.suppressActionFeedback("Spin Axis: " + Engine.LAYER3_CYLINDER_DIRS[root.layer3CylinderDir])
    }

    function toggleLayer3TextField(field) {
        if (field === "artist") {
            if (root.layer3ShowArtist && !root.layer3ShowTrack && !root.layer3ShowAlbum) {
                root.layer3ShowTrack = true
            }
            root.layer3ShowArtist = !root.layer3ShowArtist
        } else if (field === "track") {
            if (root.layer3ShowTrack && !root.layer3ShowArtist && !root.layer3ShowAlbum) {
                root.layer3ShowArtist = true
            }
            root.layer3ShowTrack = !root.layer3ShowTrack
        } else if (field === "album") {
            if (root.layer3ShowAlbum && !root.layer3ShowArtist && !root.layer3ShowTrack) {
                root.layer3ShowArtist = true
            }
            root.layer3ShowAlbum = !root.layer3ShowAlbum
        }
        var activeFields = []
        if (root.layer3ShowArtist) activeFields.push("Artist")
        if (root.layer3ShowTrack) activeFields.push("Track")
        if (root.layer3ShowAlbum) activeFields.push("Album")
        root.suppressActionFeedback("Visible Text: " + activeFields.join(" + "))
    }

    function cycleBackdropMode(delta) {
        var count = Engine.LAYER4_MODES.length
        root.layer4Mode = (root.layer4Mode + delta + count) % count
        root.layer4Enabled = true
        vizCanvas.requestPaint()
        root.suppressActionFeedback("5: Vortex: " + Engine.LAYER4_MODES[root.layer4Mode])
    }

    function cycleLayer4Mode(delta) {
        cycleBackdropMode(delta)
    }

    function cyclePalette(delta) {
        var count = Engine.PALETTE_NAMES.length
        paletteIndex = (paletteIndex + delta + count) % count
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
        root.suppressActionFeedback("Palette: " + Engine.PALETTE_NAMES[paletteIndex])
    }

    function cycleSymmetry() {
        symmetryIndex = (symmetryIndex + 1) % Engine.SYMMETRY_OPTIONS.length
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
        root.suppressActionFeedback("Geometry Resonance: " + root.symmetryFolds + "x")
    }

    function cycleTracers(delta) {
        var step = (delta !== undefined && delta < 0) ? -1 : 1
        var steps = [1, 2, 4, 6, 8, 12, 16]
        var cur = root.layer2TracersEnabled ? root.tracerCount : 1
        var nextVal = 4
        if (step > 0) {
            for (var i = 0; i < steps.length; i++) {
                if (steps[i] > cur) {
                    nextVal = steps[i]
                    break
                }
                if (i === steps.length - 1) nextVal = steps[0]
            }
        } else {
            for (var j = steps.length - 1; j >= 0; j--) {
                if (steps[j] < cur) {
                    nextVal = steps[j]
                    break
                }
                if (j === 0) nextVal = steps[steps.length - 1]
            }
        }
        if (nextVal <= 1) {
            root.layer2TracersEnabled = false
            root.tracerCount = 1
        } else {
            root.layer2TracersEnabled = true
            root.tracerCount = nextVal
        }
        vizCanvas.requestPaint()
        root.suppressActionFeedback("3D Tracers: " + (root.layer2TracersEnabled ? (root.tracerCount + "x") : "OFF"))
    }

    function cycleLayer3Tracers(delta) {
        var step = (delta !== undefined && delta < 0) ? -1 : 1
        var nextVal = ((root.layer3Tracers - 1 + step + 8) % 8) + 1
        root.layer3Tracers = nextVal
        vizCanvas.requestPaint()
        root.suppressActionFeedback("Ghost Tracers: " + root.layer3Tracers + "x")
    }

    function cycleTrackArcMode() {
        root.trackArcMode = (root.trackArcMode + 1) % Engine.TRACK_ARC_MODES.length
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
        root.suppressActionFeedback("Song Progress Arc: " + Engine.TRACK_ARC_MODES[root.trackArcMode])
    }

    function toggleHudVisibility() {
        root.showHud = !root.showHud
        if (!root.showHud) {
            root.showLayerDrawer = false
            root.showTracerPopover = false
        }
        root.suppressActionFeedback(root.showHud ? "HUD Menus Visible (H)" : "HUD Hidden — Clean Visualiser (Press H to restore)")
    }

    function toggleZenFullscreen() {
        if (root.isFullscreen && !root.showHud) {
            root.showHud = true
            root.requestToggleFullscreen()
            root.suppressActionFeedback("Exited Zen Cinema Fullscreen")
        } else {
            root.showLayerDrawer = false
            root.showTracerPopover = false
            root.showHud = false
            if (!root.isFullscreen) {
                root.requestToggleFullscreen()
            }
            root.suppressActionFeedback("Zen Cinema Fullscreen (Press H or Esc for HUD)")
        }
    }

    function hasOtherActiveLayer(excludeLayer) {
        if (excludeLayer !== 1 && root.layer1Enabled) return true
        if (excludeLayer !== 2 && root.layer2Enabled) return true
        if (excludeLayer !== 3 && root.layer3Enabled) return true
        if (excludeLayer !== 4 && root.layer4Enabled) return true
        return false
    }

    function randomiseLayer1() {
        var fRoll = Math.floor(Math.random() * (Engine.LAYER1_MODES.length + 1))
        root.layer1FieldEnabled = (fRoll < Engine.LAYER1_MODES.length)
        if (root.layer1FieldEnabled) {
            root.layer1Mode = fRoll
            root.layer1Density = Math.round((0.55 + Math.random() * 1.45) * 100) / 100
            root.layer1Speed = Math.round((0.60 + Math.random() * 1.25) * 100) / 100
            root.layer1Direction = [1, -1, 0][Math.floor(Math.random() * 3)]
        }
        if (!root.layer1FieldEnabled && !root.layer1EqEnabled && !root.layer1ShapesEnabled && !root.hasOtherActiveLayer(1)) {
            root.layer1FieldEnabled = true
            root.layer1Mode = Math.floor(Math.random() * Engine.LAYER1_MODES.length)
        }
        root.syncLayer1MasterFromSubs()
        Engine.randomiseState(root.engineState)
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }

    function randomiseLayerEq() {
        var eqRoll = Math.floor(Math.random() * (Engine.LAYER1_EQ_STYLES.length + 1))
        root.layer1EqEnabled = (eqRoll < Engine.LAYER1_EQ_STYLES.length)
        if (root.layer1EqEnabled) {
            root.layer1EqStyle = eqRoll
            root.layer1EqLayout = Math.floor(Math.random() * Engine.LAYER1_EQ_LAYOUTS.length)
            root.layer1EqScale = Math.round((0.25 + Math.random() * 1.15) * 100) / 100
            root.layer1EqDamping = Math.floor(Math.random() * Engine.LAYER1_EQ_DAMPING.length)
            root.layer1EqGain = Math.round((0.90 + Math.random() * 0.90) * 100) / 100
        }
        if (!root.layer1FieldEnabled && !root.layer1EqEnabled && !root.layer1ShapesEnabled && !root.hasOtherActiveLayer(1)) {
            root.layer1EqEnabled = true
            root.layer1EqStyle = Math.floor(Math.random() * Engine.LAYER1_EQ_STYLES.length)
        }
        root.syncLayer1MasterFromSubs()
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }

    function randomiseLayerVectors() {
        var shRoll = Math.floor(Math.random() * (Engine.LAYER1_SHAPE_STYLES.length + 1))
        root.layer1ShapesEnabled = (shRoll < Engine.LAYER1_SHAPE_STYLES.length)
        if (root.layer1ShapesEnabled) {
            root.layer1ShapeStyle = shRoll
            root.layer1ShapeScale = Math.round((0.55 + Math.random() * 1.35) * 100) / 100
            root.layer1ShapeDensity = Math.round((0.50 + Math.random() * 1.75) * 100) / 100
            root.layer1ShapeSpeed = Math.round((0.55 + Math.random() * 1.55) * 100) / 100
            root.layer1ShapeSpin = Math.round(((Math.random() * 2.8) - 1.4) * 100) / 100
        }
        if (!root.layer1FieldEnabled && !root.layer1EqEnabled && !root.layer1ShapesEnabled && !root.hasOtherActiveLayer(1)) {
            root.layer1ShapesEnabled = true
            root.layer1ShapeStyle = Math.floor(Math.random() * Engine.LAYER1_SHAPE_STYLES.length)
        }
        root.syncLayer1MasterFromSubs()
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }

    function randomiseLayer2() {
        var total = Engine.MODE_NAMES.length
        var roll2 = Math.floor(Math.random() * (total + 1))
        if (roll2 === total && root.hasOtherActiveLayer(2)) {
            root.layer2VizEnabled = false
            root.layer2TracersEnabled = false
            root.layer2Enabled = false
            clearCanvasImmediate()
            scheduleSaveVisualiserConfig()
            return
        }
        root.layer2Enabled = true
        root.layer2VizEnabled = true
        var nextM = roll2 < total ? roll2 : ((root.visualMode + 1 + Math.floor(Math.random() * Math.max(1, total - 1))) % total)
        root.visualMode = nextM
        root.symmetryIndex = Math.floor(Math.random() * Engine.SYMMETRY_OPTIONS.length)
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
    }

    function randomiseLayer3() {
        var total = Engine.LAYER3_MODES.length
        var roll3 = Math.floor(Math.random() * (total + 1))
        if (roll3 === total && root.hasOtherActiveLayer(3)) {
            root.layer3Enabled = false
            clearCanvasImmediate()
            scheduleSaveVisualiserConfig()
            return
        }
        root.layer3Enabled = true
        var nextM = roll3 < total ? roll3 : ((root.layer3Mode + 1 + Math.floor(Math.random() * Math.max(1, total - 1))) % total)
        root.layer3Mode = nextM
        var totalStyles = Engine.LAYER3_TEXT_STYLES.length
        root.layer3TextStyle = (root.layer3TextStyle + 1 + Math.floor(Math.random() * Math.max(1, totalStyles - 1))) % totalStyles
        root.layer3CylinderDir = Math.floor(Math.random() * Engine.LAYER3_CYLINDER_DIRS.length)
        root.layer3Scale = Math.round((0.55 + Math.random() * 1.15) * 100) / 100
        if (root.engineState) {
            root.engineState.l3FormFactor = 0.25
        }
        Engine.shatterAlbumArt(root.engineState, 0.95)
        if (nextM === 5) {
            root.requestSelectTtfxEffect("random")
        }
        vizCanvas.requestPaint()
        scheduleSaveVisualiserConfig()
    }

    function randomiseLayer4() {
        var total = Engine.LAYER4_MODES.length
        var roll4 = Math.floor(Math.random() * (total + 1))
        if (roll4 === total && root.hasOtherActiveLayer(4)) {
            root.layer4Enabled = false
            clearCanvasImmediate()
            scheduleSaveVisualiserConfig()
            return
        }
        root.layer4Enabled = true
        root.layer4Mode = roll4 < total ? roll4 : ((root.layer4Mode + 1 + Math.floor(Math.random() * Math.max(1, total - 1))) % total)
        root.layer4DualEnabled = (Math.random() < 0.45)
        if (root.layer4DualEnabled) {
            root.layer4SecondaryMode = (root.layer4Mode + 1 + Math.floor(Math.random() * Math.max(1, total - 1))) % total
        }
        root.layer4WallPattern = Math.floor(Math.random() * Engine.LAYER4_WALL_PATTERNS.length)
        root.layer4Twist = Math.round((0.65 + Math.random() * 1.45) * 100) / 100
        root.backdropDirection = [1, -1, 0][Math.floor(Math.random() * 3)]
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }

    function randomiseVisuals() {
        Engine.randomiseState(root.engineState)
        paletteIndex = (paletteIndex + 1 + Math.floor(Math.random() * (Engine.PALETTE_NAMES.length - 1))) % Engine.PALETTE_NAMES.length
        if (root.layer1FieldEnabled) {
            root.randomiseLayer1()
        }
        if (root.layer1EqEnabled) {
            root.randomiseLayerEq()
        }
        if (root.layer1ShapesEnabled) {
            root.randomiseLayerVectors()
        }
        if (root.layer2Enabled) {
            root.randomiseLayer2()
        }
        if (root.layer3Enabled) {
            root.randomiseLayer3()
        }
        if (root.layer4Enabled) {
            root.randomiseLayer4()
        }
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }

    function toggleAllRandomisations() {
        var nextState = !root.allRandomisationsActive
        root.autoCycle = nextState
        root.layer1AutoRandomise = nextState
        root.layerEqAutoRandomise = nextState
        root.layerVectorsAutoRandomise = nextState
        root.layer2AutoRandomise = nextState
        root.layer3AutoRandomise = nextState
        root.layer4AutoRandomise = nextState
        if (nextState) {
            root.randomiseLayer1()
            root.randomiseLayerEq()
            root.randomiseLayerVectors()
            root.randomiseLayer2()
            root.randomiseLayer4()
            root.randomiseLayer3()
            paletteIndex = (paletteIndex + 1 + Math.floor(Math.random() * (Engine.PALETTE_NAMES.length - 1))) % Engine.PALETTE_NAMES.length
        }
        clearCanvasImmediate()
        scheduleSaveVisualiserConfig()
    }

    function triggerShatterImpulse() {
        Engine.shatterAlbumArt(root.engineState, 1.55)
        vizCanvas.requestPaint()
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
            Layout.preferredWidth: 138
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
        else if (event.key === Qt.Key_Backslash) { visualMode = 12; event.accepted = true }
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

    Item {
        id: localStageContainer
        anchors.fill: parent
        visible: !root.externalStageOpen
    }

    Window {
        id: externalStageWindow
        visible: root.visible && root.externalStageOpen
        title: "Bandarchy Stage Output"
        color: root.backgroundColour
        flags: Qt.Window | Qt.FramelessWindowHint
        visibility: (root.visible && root.externalStageOpen) ? Window.FullScreen : Window.Hidden
        screen: {
            var screens = Qt.application.screens
            if (!screens || screens.length === 0) return null
            var idx = Math.max(0, Math.min(screens.length - 1, root.targetScreenIndex))
            return screens[idx]
        }
        onClosing: close => {
            root.externalStageOpen = false
        }

        Item {
            id: externalStageRoot
            anchors.fill: parent
            focus: true
            Keys.onPressed: event => {
                if (event.key === Qt.Key_Escape) {
                    root.externalStageOpen = false
                    root.requestActionFeedback("Closed External VJ Stage Window")
                    event.accepted = true
                }
            }
            MouseArea {
                anchors.fill: parent
                z: -1
                onDoubleClicked: {
                    root.externalStageOpen = false
                    root.requestActionFeedback("Returned Visualiser Stage to Main Window")
                }
            }
        }
    }

    function hexToVec4(hexStr) {
        if (!hexStr || typeof hexStr !== "string" || hexStr.length < 7) {
            return Qt.vector4d(0.22, 0.74, 0.97, 1.0)
        }
        var s = hexStr.charAt(0) === "#" ? hexStr.slice(1) : hexStr
        var r = parseInt(s.slice(0, 2), 16) / 255.0
        var g = parseInt(s.slice(2, 4), 16) / 255.0
        var b = parseInt(s.slice(4, 6), 16) / 255.0
        return Qt.vector4d(isNaN(r) ? 0.22 : r, isNaN(g) ? 0.74 : g, isNaN(b) ? 0.97 : b, 1.0)
    }

    function lerpVec4(a, b, t) {
        var f = Math.max(0.0, Math.min(1.0, t))
        return Qt.vector4d(
            a.x + (b.x - a.x) * f,
            a.y + (b.y - a.y) * f,
            a.z + (b.z - a.z) * f,
            1.0
        )
    }

    function samplePaletteVec4(pal, pos) {
        var pLen = pal.length
        var wrapped = ((pos % pLen) + pLen) % pLen
        var i0 = Math.floor(wrapped)
        var i1 = (i0 + 1) % pLen
        var frac = wrapped - i0
        // Smoothstep easing so palette colour transitions have zero abrupt derivative kinks
        var sFrac = frac * frac * (3.0 - 2.0 * frac)
        return root.lerpVec4(root.hexToVec4(pal[i0]), root.hexToVec4(pal[i1]), sFrac)
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
                root.layer1ShapeDensity += (Number(tp.l1ShapeDensity || 1.0) - root.layer1ShapeDensity) * alpha
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

            // Explicitly push dynamic time, audio, and smoothly blended palette uniforms to gpuShaderStage every frame
            // (since plain JS object mutations on root.engineState do not emit QML notify signals)
            var l2FractalGpu = root.layer2Enabled && root.layer2VizEnabled && root.visualMode === 5
            if (root.stageMode === "visualiser" && root.gpuShaderEnabled && ((root.backdropEnabled && (root.layer1Enabled || root.layer2Enabled)) || root.layer4Enabled || l2FractalGpu)) {
                var st = root.engineState
                var bT = st.backdropTime !== undefined ? st.backdropTime : (st.t || 0.0)
                gpuShaderStage.uTime = l2FractalGpu ? (st.t || bT) : bT
                gpuShaderStage.uL1Time = st.l1Time || 0.0
                gpuShaderStage.uZoomTime = l2FractalGpu ? (st.zoomTime !== undefined ? st.zoomTime : (st.t || 0.0)) : (bT * 0.85)
                gpuShaderStage.uBass = st.bassSmooth || 0.0
                gpuShaderStage.uMid = st.midSmooth || 0.0
                gpuShaderStage.uHigh = st.highSmooth || 0.0
                gpuShaderStage.uBeat = st.beatPulse || 0.0
                gpuShaderStage.uDriftX = Math.sin(bT * 0.27) * 0.16 * root.tracerDrift
                gpuShaderStage.uDriftY = Math.cos(bT * 0.21) * 0.12 * root.tracerDrift

                var pal = Engine.PALETTES[root.paletteIndex % Engine.PALETTES.length]
                var targetCol0, targetCol1, targetCol2
                if (pal && pal.length >= 3) {
                    var contRot = (st.hueShift || 0.0) / 45.0
                    targetCol0 = root.samplePaletteVec4(pal, contRot)
                    targetCol1 = root.samplePaletteVec4(pal, contRot + 2.0)
                    targetCol2 = root.samplePaletteVec4(pal, contRot + 4.0)
                } else {
                    targetCol0 = Qt.vector4d(root.accentColour.r, root.accentColour.g, root.accentColour.b, 1.0)
                    targetCol1 = Qt.vector4d(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 1.0)
                    targetCol2 = Qt.vector4d(0.22, 0.74, 0.97, 1.0)
                }
                var colBlend = Math.min(1.0, dt * 4.5)
                gpuShaderStage.uCol0 = root.lerpVec4(gpuShaderStage.uCol0, targetCol0, colBlend)
                gpuShaderStage.uCol1 = root.lerpVec4(gpuShaderStage.uCol1, targetCol1, colBlend)
                gpuShaderStage.uCol2 = root.lerpVec4(gpuShaderStage.uCol2, targetCol2, colBlend)
            }

            // Throttle QML telemetry property updates to ~12 Hz (every 4th frame) to avoid QML binding storms
            root.telemetryTick = (root.telemetryTick + 1) & 3
            if (root.telemetryTick === 0 && (root.showHud || root.stageMode !== "visualiser")) {
                root.liveBass = root.engineState.bassSmooth || 0.0
                root.liveMid = root.engineState.midSmooth || 0.0
                root.liveHigh = root.engineState.highSmooth || 0.0
                root.liveBeat = root.engineState.beatPulse || 0.0
            }

            if (root.stageMode === "visualiser" && root.hasActiveCpuLayers) {
                vizCanvas.requestPaint()
            }
        }
    }

    readonly property bool hasActiveCpuLayers: (root.layer1Enabled && (root.layer1FieldEnabled || root.layer1EqEnabled || root.layer1ShapesEnabled))
        || (root.layer2Enabled && root.layer2VizEnabled)
        || root.layer3Enabled
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
            if (root.layer2Enabled || root.layer2AutoRandomise) {
                root.randomiseLayer2()
            }
            if (root.layer1FieldEnabled || root.layer1AutoRandomise) {
                root.randomiseLayer1()
            }
            if (root.layer1EqEnabled || root.layerEqAutoRandomise) {
                root.randomiseLayerEq()
            }
            if (root.layer1ShapesEnabled || root.layerVectorsAutoRandomise) {
                root.randomiseLayerVectors()
            }
            if (root.layer3AutoRandomise) {
                root.randomiseLayer3()
            }
            if (root.layer4AutoRandomise) {
                root.randomiseLayer4()
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

    // Independent 1: Worlds Auto-Randomise Timer (every 11s)
    Timer {
        id: l1RandomiseTimer
        interval: 11000
        running: root.visible && root.stageMode === "visualiser" && root.layer1AutoRandomise
        repeat: true
        onTriggered: {
            root.randomiseLayer1()
        }
    }

    // Independent 2: Equaliser Auto-Randomise Timer (every 13s)
    Timer {
        id: lEqRandomiseTimer
        interval: 13000
        running: root.visible && root.stageMode === "visualiser" && root.layerEqAutoRandomise
        repeat: true
        onTriggered: {
            root.randomiseLayerEq()
        }
    }

    // Independent 3: Vectors Auto-Randomise Timer (every 14s)
    Timer {
        id: lVectorsRandomiseTimer
        interval: 14000
        running: root.visible && root.stageMode === "visualiser" && root.layerVectorsAutoRandomise
        repeat: true
        onTriggered: {
            root.randomiseLayerVectors()
        }
    }

    // Independent 4: Geometry Auto-Randomise Timer (every 10s)
    Timer {
        id: l2RandomiseTimer
        interval: 10000
        running: root.visible && root.stageMode === "visualiser" && root.layer2AutoRandomise
        repeat: true
        onTriggered: {
            root.randomiseLayer2()
        }
    }

    // Independent 6: Typography Auto-Randomise Timer (every 9s)
    Timer {
        id: l3RandomiseTimer
        interval: 9000
        running: root.visible && root.stageMode === "visualiser" && root.layer3AutoRandomise
        repeat: true
        onTriggered: {
            root.randomiseLayer3()
        }
    }

    // Independent 5: Vortex Auto-Randomise Timer (every 12s)
    Timer {
        id: l4RandomiseTimer
        interval: 12000
        running: root.visible && root.stageMode === "visualiser" && root.layer4AutoRandomise
        repeat: true
        onTriggered: {
            root.randomiseLayer4()
        }
    }

    // =========================================================================
    // STAGE VIEWPORT CONTAINER (Re-parents cleanly between Local Stage & External Dual-Screen VJ Window)
    // =========================================================================
    Item {
        id: stageViewport
        parent: root.externalStageOpen ? externalStageRoot : localStageContainer
        anchors.fill: parent

        // =====================================================================
        // STAGE MODE 1: ALBUM ART AS-IS ("art")
        // =====================================================================
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
                anchors.verticalCenterOffset: (root.showHud && !root.externalStageOpen) ? 10 : 0
                width: Math.max(160, Math.min(parent.width - 48, parent.height - ((root.showHud && !root.externalStageOpen) ? 168 : 48)))
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
                    source: (root.artPath && String(root.artPath).indexOf("/") === 0 && String(root.artPath).indexOf("..") < 0)
                        ? ("file://" + root.artPath)
                        : ""
                    sourceSize: Qt.size(512, 512)
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

        // =====================================================================
        // STAGE MODE 2: UPGRADED TURNTABLE RECORD PLAYER ("turntable")
        // =====================================================================
        Item {
            id: turntableStageView
            anchors.fill: parent
            visible: root.stageMode === "turntable"

            Vinyl {
                id: stageTurntable
                anchors.centerIn: parent
                anchors.verticalCenterOffset: (root.showHud && !root.externalStageOpen) ? 10 : 0
                width: Math.max(220, Math.min(parent.width - 28, (parent.height - ((root.showHud && !root.externalStageOpen) ? 160 : 28)) * 1.16))
                height: Math.max(190, Math.min(parent.height - ((root.showHud && !root.externalStageOpen) ? 160 : 28), width / 1.16))
                deckMode: true
                artPath: root.artPath
                spinning: root.playing
                position: root.position
                duration: root.duration
                rpm: root.turntableRpm
                vinylStyle: root.turntableStyle
                accentColour: root.accentColour
                urgentColour: root.urgentColour
                foregroundColour: root.foregroundColour
                backgroundColour: root.backgroundColour
                bassLevel: root.liveBass
                midLevel: root.liveMid
                highLevel: root.liveHigh
                onRpmToggled: newRpm => {
                    root.turntableRpm = Math.max(16.0, Math.min(78.0, Number(newRpm) || 33.3))
                    root.scheduleSaveVisualiserConfig()
                }
                onVinylStyleCycled: newStyle => {
                    root.turntableStyle = Math.max(0, Math.min(4, Math.round(Number(newStyle) || 0)))
                    root.scheduleSaveVisualiserConfig()
                }
                onRequestTogglePlay: {
                    root.requestPlayPause()
                }
                onRequestSeekRatio: ratio => {
                    if (root.duration > 0) {
                        var targetSec = Math.max(0, Math.min(root.duration, ratio * root.duration))
                        root.requestSeek(targetSec)
                    }
                }
            }
        }

        // =====================================================================
        // STAGE MODE 3: 6-LAYER PSYCHEDELIC & NIGHTCLUB VISUALISER ("visualiser")
        // Native Qt6 GPU Fragment Shader Stage (5: Vortex) + Hardware-Scaled Vector & ASCII Canvas
        // =====================================================================
        ShaderEffect {
            id: gpuShaderStage
            anchors.fill: parent
            visible: root.stageMode === "visualiser" && root.gpuShaderEnabled && (root.layer4Enabled || (root.backdropEnabled && (root.layer1Enabled || root.layer2Enabled)) || (root.layer2Enabled && root.layer2VizEnabled && root.visualMode === 5))
            fragmentShader: Qt.resolvedUrl("share/psychedelic.frag.qsb")

            property real uTime: 0.0
            property real uL1Time: 0.0
            property real uZoomTime: 0.0
            property real uBass: 0.0
            property real uMid: 0.0
            property real uHigh: 0.0
            property real uBeat: 0.0
            property real uAspect: height > 0 ? (width / height) : 1.777
            property real uL1Enabled: 0.0
            property real uL1Mode: root.layer1Mode
            property real uL1Dim: root.layer1Dim
            property real uL2Enabled: (root.gpuShaderEnabled && root.backdropEnabled && (root.layer1Enabled || root.layer2Enabled)) ? 1.0 : 0.0
            property real uL2Mode: root.backdropMode
            property real uL2VizMode: (root.layer2Enabled && root.layer2VizEnabled) ? root.visualMode : -1.0
            property real uZoom: root.layer2Zoom
            property real uFacets: root.backdropSymmetry
            property real uComplexity: root.backdropIntensity
            property real uTracerCount: root.tracerCount
            property real uTracerDir: (root.layer2Enabled && root.layer2VizEnabled && root.visualMode === 5) ? root.tracerDirection : root.backdropDirection
            property real uDriftX: 0.0
            property real uDriftY: 0.0
            property real uL4Enabled: (root.gpuShaderEnabled && root.layer4Enabled) ? 1.0 : 0.0
            property real uL4Mode: root.layer4Mode
            property real uL4DualEnabled: root.layer4DualEnabled ? 1.0 : 0.0
            property real uL4SecondaryMode: root.layer4SecondaryMode
            property real uL4DualMix: root.layer4DualMix
            property real uL4WallPattern: root.layer4WallPattern
            property real uL4Twist: root.layer4Twist
            property vector4d uBgCol: Qt.vector4d(root.backgroundColour.r, root.backgroundColour.g, root.backgroundColour.b, 1.0)
            property vector4d uCol0: Qt.vector4d(root.accentColour.r, root.accentColour.g, root.accentColour.b, 1.0)
            property vector4d uCol1: Qt.vector4d(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 1.0)
            property vector4d uCol2: Qt.vector4d(0.22, 0.74, 0.97, 1.0)
        }

        Canvas {
            id: vizCanvas
            readonly property int maxInternalW: 1280
            readonly property int effectiveTargetW: Math.min(maxInternalW, Math.max(320, root.renderResW))
            readonly property real stageW: Math.max(64, stageViewport.width)
            readonly property real stageH: Math.max(48, stageViewport.height)
            readonly property real renderScale: stageW > effectiveTargetW ? (effectiveTargetW / Math.max(1, stageW)) : 1.0
            width: Math.max(64, Math.round(stageW * renderScale))
            height: Math.max(48, Math.round(stageH * renderScale))
            antialiasing: false
            smooth: root.antialiasingEnabled
            transformOrigin: Item.TopLeft
            transform: Scale {
                xScale: vizCanvas.width > 0 ? (vizCanvas.stageW / vizCanvas.width) : 1.0
                yScale: vizCanvas.height > 0 ? (vizCanvas.stageH / vizCanvas.height) : 1.0
            }
            visible: root.stageMode === "visualiser" && root.hasActiveCpuLayers
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
    // TOP OMARCHY HUD BAR + STAGE MODE SWITCHER + 6-LAYER VIVID STAGE CONTROLS
    // =========================================================================
    Rectangle {
        id: topHud
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 8
        height: root.stageMode === "visualiser" ? 74 : 42
        radius: 8
        color: Qt.rgba(0.04, 0.05, 0.08, 0.88)
        border.width: 1
        border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.35)
        visible: root.showHud

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 6
            spacing: 4

            // Row 1: Stage Selector + 6 Vivid Layers (1:Worlds · 2:EQ · 3:Vectors · 4:Geometry · 5:Vortex · 6:Type) + Row 2 Cycler + Studio Drawer + Preset + Palette + RANDOM + Dual VJ + TTE + Hide HUD + Full
            RowLayout {
                Layout.fillWidth: true
                spacing: 3

                VizPillButton {
                    text: "󰀥 Art"
                    active: root.stageMode === "art"
                    horizontalPad: 6
                    onClicked: root.setStage("art")
                }

                VizPillButton {
                    text: "󰀥 Turntable"
                    active: root.stageMode === "turntable"
                    horizontalPad: 6
                    onClicked: root.setStage("turntable")
                }

                VizPillButton {
                    text: "󰍹 Visualiser"
                    active: root.stageMode === "visualiser"
                    horizontalPad: 6
                    onClicked: root.setStage("visualiser")
                }

                Rectangle {
                    Layout.preferredWidth: 1
                    Layout.preferredHeight: 16
                    color: Qt.rgba(1, 1, 1, 0.16)
                    visible: root.stageMode === "visualiser"
                }

                // 1: Worlds (3D Depth Fields)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "1:Worlds"
                    fontSize: 9
                    active: root.layer1Enabled && root.layer1FieldEnabled
                    horizontalPad: 5
                    onClicked: {
                        root.layer1FieldEnabled = !root.layer1FieldEnabled
                        root.syncLayer1MasterFromSubs()
                        root.hudFocusedLayer = 1
                        root.clearCanvasImmediate()
                    }
                    onRightClicked: {
                        root.hudFocusedLayer = 1
                    }
                }

                // 2: Equaliser (LED & Sculptural 3D Equaliser)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "2:EQ"
                    fontSize: 9
                    active: root.layer1Enabled && root.layer1EqEnabled
                    horizontalPad: 5
                    onClicked: {
                        root.layer1EqEnabled = !root.layer1EqEnabled
                        root.syncLayer1MasterFromSubs()
                        root.hudFocusedLayer = 2
                        root.clearCanvasImmediate()
                    }
                    onRightClicked: {
                        root.hudFocusedLayer = 2
                    }
                }

                // 3: Vectors (Wireframe Beat Shapes)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "3:Vectors"
                    fontSize: 9
                    active: root.layer1Enabled && root.layer1ShapesEnabled
                    horizontalPad: 5
                    onClicked: {
                        root.layer1ShapesEnabled = !root.layer1ShapesEnabled
                        root.syncLayer1MasterFromSubs()
                        root.hudFocusedLayer = 3
                        root.clearCanvasImmediate()
                    }
                    onRightClicked: {
                        root.hudFocusedLayer = 3
                    }
                }

                // 4: Geometry (Sacred Geometry & Oscilloscopes + 3D Tracers)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "4:Geometry"
                    fontSize: 9
                    active: root.layer2Enabled
                    horizontalPad: 5
                    onClicked: {
                        root.layer2Enabled = !root.layer2Enabled
                        if (root.layer2Enabled && !root.layer2VizEnabled && !root.layer2TracersEnabled) {
                            root.layer2VizEnabled = true
                        }
                        root.hudFocusedLayer = 4
                        root.clearCanvasImmediate()
                    }
                    onRightClicked: {
                        root.hudFocusedLayer = 4
                    }
                }

                // 5: Vortex (Dedicated GPU Tunnel & Dual Vortex)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "5:Vortex"
                    fontSize: 9
                    active: root.layer4Enabled
                    horizontalPad: 5
                    onClicked: {
                        root.layer4Enabled = !root.layer4Enabled
                        root.backdropEnabled = root.layer4Enabled
                        root.hudFocusedLayer = 5
                        root.clearCanvasImmediate()
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: {
                        root.hudFocusedLayer = 5
                    }
                }

                // 6: Typography (Album Art & 3D Text Styles)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "6:Type"
                    fontSize: 9
                    active: root.layer3Enabled
                    horizontalPad: 5
                    onClicked: {
                        root.layer3Enabled = !root.layer3Enabled
                        root.hudFocusedLayer = 6
                        root.clearCanvasImmediate()
                    }
                    onRightClicked: {
                        root.hudFocusedLayer = 6
                    }
                }

                // Single Button that cycles Row 2 across 1..6 (1:Worlds · 2:EQ · 3:Vectors · 4:Geometry · 5:Vortex · 6:Type)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: {
                        var names = ["1:Worlds", "2:EQ", "3:Vectors", "4:Geometry", "5:Vortex", "6:Type"]
                        return "󰒔 " + (names[(root.hudFocusedLayer - 1) % 6] || "1:Worlds")
                    }
                    fontSize: 9
                    active: true
                    horizontalPad: 5
                    onClicked: {
                        root.hudFocusedLayer = (root.hudFocusedLayer % 6) + 1
                    }
                    onRightClicked: {
                        root.hudFocusedLayer = ((root.hudFocusedLayer + 4) % 6) + 1
                    }
                }

                // Open 6-Layer + Presets + General & Quality Configuration Drawer button
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: root.showLayerDrawer ? "󰒓 Studio ▲" : "󰒓 Studio ▼"
                    fontSize: 9
                    active: root.showLayerDrawer
                    horizontalPad: 6
                    onClicked: {
                        root.showLayerDrawer = !root.showLayerDrawer
                    }
                }

                // Collective Scene Preset Quick Cycler
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "󰀻 Preset"
                    fontSize: 9
                    active: root.presetTransitionEnabled
                    horizontalPad: 5
                    onClicked: root.cycleSelectedPreset(1)
                    onRightClicked: root.cycleSelectedPreset(-1)
                }

                // Palette selector (30 palettes)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    Layout.preferredWidth: 74
                    text: "󰏘 " + (root.shortPaletteNames[root.paletteIndex % root.shortPaletteNames.length] || "Rainbow")
                    fontSize: 9
                    horizontalPad: 5
                    onClicked: root.cyclePalette(1)
                    onRightClicked: root.cyclePalette(-1)
                }

                // Full RANDOM Button: Toggles ALL layer auto-randomisations + palette auto-cycle simultaneously (Right-click steps once)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: root.allRandomisationsActive ? "󰒟 RANDOM:ALL" : "󰒟 RANDOM"
                    fontSize: 9
                    active: root.allRandomisationsActive
                    horizontalPad: 6
                    onClicked: root.toggleAllRandomisations()
                    onRightClicked: root.randomiseVisuals()
                }

                Item { Layout.fillWidth: true }

                // Dual-Screen VJ External Stage Output Toggle + Screen Cycler
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: root.externalStageOpen ? "󰍹 VJ:ON" : "󰍹 VJ"
                    fontSize: 9
                    active: root.externalStageOpen
                    horizontalPad: 5
                    onClicked: {
                        var screens = Qt.application.screens
                        if (!root.externalStageOpen && screens && screens.length > 1) {
                            root.targetScreenIndex = Math.min(screens.length - 1, Math.max(0, root.targetScreenIndex))
                        }
                        root.externalStageOpen = !root.externalStageOpen
                        if (root.externalStageOpen) {
                            root.vjDeckMode = true
                            root.showHud = true
                            root.showLayerDrawer = true
                        } else {
                            root.vjDeckMode = false
                        }
                    }
                    onRightClicked: {
                        var screens = Qt.application.screens
                        if (screens && screens.length > 1) {
                            root.targetScreenIndex = (root.targetScreenIndex + 1) % screens.length
                        }
                    }
                }

                // Single TTE Button — Launches the Omarchy TTE Screensaver
                VizPillButton {
                    text: "󰍹 TTE"
                    fontSize: 9
                    horizontalPad: 6
                    onClicked: root.launchExternalTteTerminal()
                }

                // Hide HUD toggle (H)
                VizPillButton {
                    text: "󰈈 HUD (H)"
                    fontSize: 9
                    horizontalPad: 5
                    onClicked: root.toggleHudVisibility()
                }

                // Fullscreen toggle (F / V, or Z / Shift+F for HUD-free Zen Fullscreen)
                VizPillButton {
                    text: root.isFullscreen ? "󰊓 Exit" : "󰊓 Full"
                    fontSize: 9
                    active: root.isFullscreen
                    horizontalPad: 5
                    onClicked: root.requestToggleFullscreen()
                }
            }

            // =================================================================
            // ROW 2 — LAYER 1: WORLDS (3D Depth Fields: 11 Worlds + Dir + Spd + Den + Rand)
            // =================================================================
            RowLayout {
                Layout.fillWidth: true
                spacing: 2
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 1

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: root.layer1FieldEnabled ? "Field:ON" : "Field:OFF"
                    active: root.layer1Enabled && root.layer1FieldEnabled
                    onClicked: {
                        root.layer1FieldEnabled = !root.layer1FieldEnabled
                        root.syncLayer1MasterFromSubs()
                        root.clearCanvasImmediate()
                    }
                }

                Repeater {
                    model: root.shortL1FieldLabels
                    delegate: VizPillButton {
                        required property int index
                        required property string modelData
                        Layout.fillWidth: true
                        pillHeight: 22
                        fontSize: 8
                        horizontalPad: 3
                        text: modelData
                        active: root.layer1Enabled && root.layer1FieldEnabled && root.layer1Mode === index
                        onClicked: {
                            if (root.layer1Enabled && root.layer1FieldEnabled && root.layer1Mode === index) {
                                root.layer1FieldEnabled = false
                                root.syncLayer1MasterFromSubs()
                                root.clearCanvasImmediate()
                            } else {
                                root.layer1FieldEnabled = true
                                root.syncLayer1MasterFromSubs()
                                root.layer1Mode = index
                                root.clearCanvasImmediate()
                            }
                        }
                        onRightClicked: {
                            root.layer1FieldEnabled = !root.layer1FieldEnabled
                            root.syncLayer1MasterFromSubs()
                            root.clearCanvasImmediate()
                        }
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "Dir:" + (root.layer1Direction > 0 ? "Towards" : (root.layer1Direction < 0 ? "Away" : "Breathe"))
                    active: root.layer1Enabled && root.layer1FieldEnabled
                    onClicked: {
                        root.layer1Direction = (root.layer1Direction === 1) ? -1 : ((root.layer1Direction === -1) ? 0 : 1)
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
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
                    }
                    onRightClicked: {
                        root.layer1Speed = 1.0
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                    onWheelScrolled: delta => {
                        root.layer1Speed = Math.max(0.05, Math.min(4.0, Math.round((root.layer1Speed + delta * 0.15) * 100) / 100))
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "Den:" + root.layer1Density.toFixed(1) + "x"
                    active: Math.abs(root.layer1Density - 1.0) > 0.05
                    onClicked: {
                        var dSteps = [0.25, 0.5, 0.8, 1.0, 1.3, 1.6, 2.0]
                        var nextD = 1.0
                        for (var i = 0; i < dSteps.length; i++) {
                            if (dSteps[i] > root.layer1Density + 0.05) {
                                nextD = dSteps[i]
                                break
                            }
                            if (i === dSteps.length - 1) nextD = dSteps[0]
                        }
                        root.layer1Density = nextD
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: {
                        root.layer1Density = 1.0
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                    onWheelScrolled: delta => {
                        root.layer1Density = Math.max(0.25, Math.min(2.0, Math.round((root.layer1Density + delta * 0.15) * 100) / 100))
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: root.layer1AutoRandomise ? "󰒟 Rand:AUTO" : "󰒟 Rand:OFF"
                    active: root.layer1AutoRandomise
                    onClicked: {
                        root.layer1AutoRandomise = !root.layer1AutoRandomise
                        if (root.layer1AutoRandomise) {
                            root.randomiseLayer1()
                        }
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: root.randomiseLayer1()
                }
            }

            // =================================================================
            // ROW 2 — LAYER 2: EQUALISER (16 2D & Sculptural 3D EQ Styles + EqPos + EqSz + Gain + Rand)
            // =================================================================
            RowLayout {
                Layout.fillWidth: true
                spacing: 3
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 2

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: root.layer1EqEnabled ? "LED:ON" : "LED:OFF"
                    active: root.layer1Enabled && root.layer1EqEnabled
                    onClicked: {
                        root.layer1EqEnabled = !root.layer1EqEnabled
                        root.syncLayer1MasterFromSubs()
                        root.clearCanvasImmediate()
                    }
                }

                VizPillButton {
                    Layout.fillWidth: true
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "EQ:" + (root.shortEqLabels[root.layer1EqStyle % root.shortEqLabels.length] || "Skyline")
                    active: root.layer1Enabled && root.layer1EqEnabled
                    onClicked: {
                        if (!root.layer1EqEnabled) {
                            root.layer1EqEnabled = true
                        } else {
                            root.layer1EqStyle = (root.layer1EqStyle + 1) % Engine.LAYER1_EQ_STYLES.length
                        }
                        root.syncLayer1MasterFromSubs()
                        vizCanvas.requestPaint()
                    }
                    onRightClicked: {
                        root.layer1EqEnabled = !root.layer1EqEnabled
                        root.syncLayer1MasterFromSubs()
                        root.clearCanvasImmediate()
                    }
                    onWheelScrolled: delta => {
                        root.layer1EqEnabled = true
                        root.syncLayer1MasterFromSubs()
                        var nEq = Engine.LAYER1_EQ_STYLES.length
                        root.layer1EqStyle = (root.layer1EqStyle + (delta > 0 ? 1 : -1) + nEq) % nEq
                        vizCanvas.requestPaint()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "EqPos:" + (root.shortEqPosLabels[root.layer1EqLayout % root.shortEqPosLabels.length] || "Bottom ▲")
                    active: root.layer1Enabled && root.layer1EqEnabled
                    onClicked: {
                        root.layer1EqEnabled = true
                        root.syncLayer1MasterFromSubs()
                        root.layer1EqLayout = (root.layer1EqLayout + 1) % Engine.LAYER1_EQ_LAYOUTS.length
                        vizCanvas.requestPaint()
                    }
                    onRightClicked: {
                        root.layer1EqLayout = 0
                        vizCanvas.requestPaint()
                    }
                    onWheelScrolled: delta => {
                        var nLay = Engine.LAYER1_EQ_LAYOUTS.length
                        root.layer1EqLayout = (root.layer1EqLayout + (delta > 0 ? 1 : -1) + nLay) % nLay
                        vizCanvas.requestPaint()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "EqSz:" + root.layer1EqScale.toFixed(1) + "x"
                    active: root.layer1Enabled && root.layer1EqEnabled && Math.abs(root.layer1EqScale - 1.0) > 0.05
                    onClicked: {
                        var szSteps = [0.15, 0.25, 0.4, 0.6, 0.8, 1.0, 1.25, 1.5, 1.85, 2.2]
                        var nextSz = 1.0
                        for (var i = 0; i < szSteps.length; i++) {
                            if (szSteps[i] > root.layer1EqScale + 0.04) {
                                nextSz = szSteps[i]
                                break
                            }
                            if (i === szSteps.length - 1) nextSz = szSteps[0]
                        }
                        root.layer1EqScale = nextSz
                        vizCanvas.requestPaint()
                    }
                    onRightClicked: {
                        root.layer1EqScale = 1.0
                        vizCanvas.requestPaint()
                    }
                    onWheelScrolled: delta => {
                        root.layer1EqScale = Math.max(0.15, Math.min(2.25, Math.round((root.layer1EqScale + (delta > 0 ? 0.1 : -0.1)) * 100) / 100))
                        vizCanvas.requestPaint()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "Gain:" + root.layer1EqGain.toFixed(1) + "x"
                    active: root.layer1Enabled && root.layer1EqEnabled && Math.abs(root.layer1EqGain - 1.25) > 0.08
                    onClicked: {
                        var gSteps = [0.6, 0.9, 1.25, 1.6, 2.0, 2.5]
                        var nextG = 1.25
                        for (var i = 0; i < gSteps.length; i++) {
                            if (gSteps[i] > root.layer1EqGain + 0.05) {
                                nextG = gSteps[i]
                                break
                            }
                            if (i === gSteps.length - 1) nextG = gSteps[0]
                        }
                        root.layer1EqGain = nextG
                        vizCanvas.requestPaint()
                    }
                    onRightClicked: {
                        root.layer1EqGain = 1.25
                        vizCanvas.requestPaint()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: root.layerEqAutoRandomise ? "󰒟 Rand:AUTO" : "󰒟 Rand:OFF"
                    active: root.layerEqAutoRandomise
                    onClicked: {
                        root.layerEqAutoRandomise = !root.layerEqAutoRandomise
                        if (root.layerEqAutoRandomise) {
                            root.randomiseLayerEq()
                        }
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: root.randomiseLayerEq()
                }
            }

            // =================================================================
            // ROW 2 — LAYER 3: VECTORS (6 Wireframe Beat Shape Styles + ShDen + Scale + Spin + Rand)
            // =================================================================
            RowLayout {
                Layout.fillWidth: true
                spacing: 3
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 3

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: root.layer1ShapesEnabled ? "Shapes:ON" : "Shapes:OFF"
                    active: root.layer1Enabled && root.layer1ShapesEnabled
                    onClicked: {
                        root.layer1ShapesEnabled = !root.layer1ShapesEnabled
                        root.syncLayer1MasterFromSubs()
                        root.clearCanvasImmediate()
                    }
                }

                VizPillButton {
                    Layout.fillWidth: true
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: "Shape:" + ((Engine.LAYER1_SHAPE_STYLES[root.layer1ShapeStyle] || "Polyhedra").split(" ")[0])
                    active: root.layer1Enabled && root.layer1ShapesEnabled
                    onClicked: {
                        if (!root.layer1ShapesEnabled) {
                            root.layer1ShapesEnabled = true
                        } else {
                            root.layer1ShapeStyle = (root.layer1ShapeStyle + 1) % Engine.LAYER1_SHAPE_STYLES.length
                        }
                        root.syncLayer1MasterFromSubs()
                        vizCanvas.requestPaint()
                    }
                    onRightClicked: {
                        root.layer1ShapesEnabled = !root.layer1ShapesEnabled
                        root.syncLayer1MasterFromSubs()
                        root.clearCanvasImmediate()
                    }
                    onWheelScrolled: delta => {
                        root.layer1ShapesEnabled = true
                        root.syncLayer1MasterFromSubs()
                        var nSh = Engine.LAYER1_SHAPE_STYLES.length
                        root.layer1ShapeStyle = (root.layer1ShapeStyle + (delta > 0 ? 1 : -1) + nSh) % nSh
                        vizCanvas.requestPaint()
                    }
                }

                Repeater {
                    model: Engine.LAYER1_SHAPE_STYLES
                    delegate: VizPillButton {
                        required property int index
                        required property string modelData
                        pillHeight: 22
                        fontSize: 8
                        horizontalPad: 4
                        text: modelData.split(" ")[0]
                        active: root.layer1Enabled && root.layer1ShapesEnabled && root.layer1ShapeStyle === index
                        onClicked: {
                            root.layer1ShapesEnabled = true
                            root.syncLayer1MasterFromSubs()
                            root.layer1ShapeStyle = index
                            vizCanvas.requestPaint()
                        }
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "ShDen:" + root.layer1ShapeDensity.toFixed(1) + "x"
                    active: root.layer1Enabled && root.layer1ShapesEnabled && Math.abs(root.layer1ShapeDensity - 1.0) > 0.05
                    onClicked: {
                        var nextSD = root.layer1ShapeDensity + 0.25
                        if (nextSD > 2.55) nextSD = 0.25
                        root.layer1ShapeDensity = Math.round(nextSD * 100) / 100
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: {
                        root.layer1ShapeDensity = 1.0
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                    onWheelScrolled: delta => {
                        root.layer1ShapeDensity = Math.max(0.25, Math.min(2.50, Math.round((root.layer1ShapeDensity + (delta > 0 ? 0.15 : -0.15)) * 100) / 100))
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "Sz:" + root.layer1ShapeScale.toFixed(1) + "x"
                    active: root.layer1Enabled && root.layer1ShapesEnabled && Math.abs(root.layer1ShapeScale - 1.0) > 0.05
                    onClicked: {
                        var nextSc = root.layer1ShapeScale + 0.25
                        if (nextSc > 2.25) nextSc = 0.35
                        root.layer1ShapeScale = Math.round(nextSc * 100) / 100
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: {
                        root.layer1ShapeScale = 1.0
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: root.layerVectorsAutoRandomise ? "󰒟 Rand:AUTO" : "󰒟 Rand:OFF"
                    active: root.layerVectorsAutoRandomise
                    onClicked: {
                        root.layerVectorsAutoRandomise = !root.layerVectorsAutoRandomise
                        if (root.layerVectorsAutoRandomise) {
                            root.randomiseLayerVectors()
                        }
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: root.randomiseLayerVectors()
                }
            }

            // =================================================================
            // ROW 2 — LAYER 4: GEOMETRY (Sacred Geometry & Oscilloscopes: 13 Modes + Den + 3D Tracers + Rand)
            // Zero duplicate GPU Tunnel controls!
            // =================================================================
            RowLayout {
                Layout.fillWidth: true
                spacing: 3
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 4

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: root.layer2VizEnabled ? "Viz:ON" : "Viz:OFF"
                    active: root.layer2Enabled && root.layer2VizEnabled
                    onClicked: {
                        root.layer2VizEnabled = !root.layer2VizEnabled
                        if (root.layer2VizEnabled) root.layer2Enabled = true
                        root.clearCanvasImmediate()
                    }
                }

                Repeater {
                    model: root.shortModeLabels.length

                    delegate: Rectangle {
                        required property int index
                        readonly property bool isCurrent: root.visualMode === index && root.layer2Enabled && root.layer2VizEnabled
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
                            font.pixelSize: 8
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
                                if (root.layer2Enabled && root.layer2VizEnabled && root.visualMode === index) {
                                    root.layer2VizEnabled = false
                                    root.clearCanvasImmediate()
                                } else {
                                    root.layer2Enabled = true
                                    root.layer2VizEnabled = true
                                    root.visualMode = index
                                    root.clearCanvasImmediate()
                                    root.forceActiveFocus()
                                }
                            }
                        }
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "Den:" + root.layer2Complexity.toFixed(1) + "x"
                    active: Math.abs(root.layer2Complexity - 1.0) > 0.05
                    onClicked: {
                        var cSteps = [0.5, 0.8, 1.0, 1.3, 1.6, 2.0]
                        var nextC = 1.0
                        for (var i = 0; i < cSteps.length; i++) {
                            if (cSteps[i] > root.layer2Complexity + 0.05) {
                                nextC = cSteps[i]
                                break
                            }
                            if (i === cSteps.length - 1) nextC = cSteps[0]
                        }
                        root.layer2Complexity = nextC
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: {
                        root.layer2Complexity = 1.0
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                    onWheelScrolled: delta => {
                        root.layer2Complexity = Math.max(0.35, Math.min(2.0, Math.round((root.layer2Complexity + delta * 0.15) * 100) / 100))
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "Tracers:" + (root.layer2TracersEnabled ? (root.tracerCount + "x") : "OFF")
                    active: root.layer2Enabled && root.layer2TracersEnabled && root.tracerCount > 1
                    onClicked: root.cycleTracers(1)
                    onRightClicked: {
                        root.layer2TracersEnabled = !root.layer2TracersEnabled
                        if (root.layer2TracersEnabled && root.tracerCount <= 1) root.tracerCount = 4
                        root.clearCanvasImmediate()
                    }
                    onWheelScrolled: delta => {
                        root.cycleTracers(delta > 0 ? 1 : -1)
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "Dir:" + (root.tracerDirection > 0 ? "Towards" : (root.tracerDirection < 0 ? "Away" : "Breathe"))
                    active: root.layer2Enabled && root.layer2TracersEnabled
                    onClicked: {
                        root.tracerDirection = (root.tracerDirection === 1) ? -1 : ((root.tracerDirection === -1) ? 0 : 1)
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 5
                    text: root.layer2AutoRandomise ? "󰒟 Rand:AUTO" : "󰒟 Rand:OFF"
                    active: root.layer2AutoRandomise
                    onClicked: {
                        root.layer2AutoRandomise = !root.layer2AutoRandomise
                        if (root.layer2AutoRandomise) {
                            root.layer2Enabled = true
                            root.randomiseLayer2()
                        }
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: root.randomiseLayer2()
                }
            }

            // =================================================================
            // ROW 2 — LAYER 5: VORTEX (Dedicated GPU Tunnel & Vortex: 16 Modes + Dual 2x + Wall Patterns + Rand)
            // =================================================================
            RowLayout {
                Layout.fillWidth: true
                spacing: 3
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 5

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: root.layer4Enabled ? "Vortex:ON" : "Vortex:OFF"
                    active: root.layer4Enabled
                    onClicked: {
                        root.layer4Enabled = !root.layer4Enabled
                        root.backdropEnabled = root.layer4Enabled
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: root.layer4DualEnabled ? "2x:ON" : "2x:OFF"
                    active: root.layer4DualEnabled
                    onClicked: {
                        root.layer4Enabled = true
                        root.backdropEnabled = true
                        root.layer4DualEnabled = !root.layer4DualEnabled
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: {
                        root.layer4Enabled = true
                        root.backdropEnabled = true
                        root.layer4DualEnabled = true
                        root.layer4SecondaryMode = (root.layer4SecondaryMode + 1) % Engine.LAYER4_MODES.length
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                Repeater {
                    model: root.shortL4ModeLabels
                    delegate: VizPillButton {
                        required property int index
                        required property string modelData
                        Layout.fillWidth: true
                        pillHeight: 22
                        fontSize: 8
                        horizontalPad: 2
                        text: modelData
                        active: root.layer4Enabled && (root.layer4Mode === index || (root.layer4DualEnabled && root.layer4SecondaryMode === index))
                        onClicked: {
                            root.layer4Enabled = true
                            root.backdropEnabled = true
                            root.layer4Mode = index
                            root.backdropMode = index
                            vizCanvas.requestPaint()
                            scheduleSaveVisualiserConfig()
                        }
                        onRightClicked: {
                            root.layer4Enabled = true
                            root.backdropEnabled = true
                            root.layer4DualEnabled = true
                            root.layer4SecondaryMode = index
                            vizCanvas.requestPaint()
                            scheduleSaveVisualiserConfig()
                        }
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 8
                    horizontalPad: 3
                    text: "W:" + (Engine.LAYER4_WALL_PATTERNS[root.layer4WallPattern % Engine.LAYER4_WALL_PATTERNS.length] || "Rings").split(" ")[0]
                    active: root.layer4WallPattern > 0
                    onClicked: {
                        root.layer4WallPattern = (root.layer4WallPattern + 1) % Engine.LAYER4_WALL_PATTERNS.length
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: {
                        root.layer4WallPattern = (root.layer4WallPattern - 1 + Engine.LAYER4_WALL_PATTERNS.length) % Engine.LAYER4_WALL_PATTERNS.length
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 8
                    horizontalPad: 3
                    text: root.layer4Direction === 0 ? "Fwd" : (root.layer4Direction === 1 ? "Rev" : "Ping")
                    active: root.layer4Direction !== 0
                    onClicked: {
                        root.layer4Direction = (root.layer4Direction + 1) % 3
                        root.backdropDirection = root.layer4Direction
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: root.layer4AutoRandomise ? "󰒟 Rand:AUTO" : "󰒟 Rand:OFF"
                    active: root.layer4AutoRandomise
                    onClicked: {
                        root.layer4AutoRandomise = !root.layer4AutoRandomise
                        if (root.layer4AutoRandomise) {
                            root.layer4Enabled = true
                            root.backdropEnabled = true
                            root.randomiseLayer4()
                        }
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: {
                        root.layer4Enabled = true
                        root.backdropEnabled = true
                        root.randomiseLayer4()
                    }
                }
            }

            // =================================================================
            // ROW 2 — LAYER 6: TYPOGRAPHY (Art/Words × Braille/Block/Text × 16 Styles × 6 Spin Axes × 12 Modes + Tracers + Rand)
            // =================================================================
            RowLayout {
                Layout.fillWidth: true
                spacing: 2
                visible: root.stageMode === "visualiser" && root.hudFocusedLayer === 6

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "󰀥 Art"
                    active: root.useAlbumArt && root.asciiMode !== "banner"
                    onClicked: root.selectL3SourceOrGlyph("art")
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "󰬴 Words"
                    active: !root.useAlbumArt || root.asciiMode === "banner"
                    onClicked: root.selectL3SourceOrGlyph("words")
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "⣿ Braille"
                    active: root.asciiMode !== "block" && root.asciiMode !== "text"
                    onClicked: root.selectL3SourceOrGlyph("braille")
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "█ Block"
                    active: root.asciiMode === "block"
                    onClicked: root.selectL3SourceOrGlyph("block")
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "󰬴 Crisp Text"
                    active: root.asciiMode === "text"
                    onClicked: root.selectL3SourceOrGlyph("text")
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "󰏘 " + (root.shortL3StyleLabels[root.layer3TextStyle % root.shortL3StyleLabels.length] || "Techno")
                    active: root.asciiMode === "text" || !root.useAlbumArt || root.asciiMode === "banner"
                    onClicked: root.cycleLayer3TextStyle(1)
                    onRightClicked: root.cycleLayer3TextStyle(-1)
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 8
                    horizontalPad: 3
                    text: "󰑐 Cyl:" + (Engine.LAYER3_CYLINDER_DIRS[root.layer3CylinderDir % Engine.LAYER3_CYLINDER_DIRS.length] || "L→R")
                    active: root.layer3CylinderDir > 0 || root.layer3Mode === 7 || root.layer3Mode === 9
                    onClicked: root.cycleLayer3CylinderDir(1)
                    onRightClicked: root.cycleLayer3CylinderDir(-1)
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 8
                    horizontalPad: 3
                    text: "Artist"
                    active: root.layer3ShowArtist
                    onClicked: root.toggleLayer3TextField("artist")
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 8
                    horizontalPad: 3
                    text: "Track"
                    active: root.layer3ShowTrack
                    onClicked: root.toggleLayer3TextField("track")
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 8
                    horizontalPad: 3
                    text: "Album"
                    active: root.layer3ShowAlbum
                    onClicked: root.toggleLayer3TextField("album")
                }

                Repeater {
                    model: root.shortL3ModeLabels
                    delegate: VizPillButton {
                        required property int index
                        required property string modelData
                        Layout.fillWidth: true
                        pillHeight: 22
                        fontSize: 8
                        horizontalPad: 3
                        text: modelData
                        active: root.layer3Enabled && root.layer3Mode === index
                        onClicked: {
                            root.layer3Enabled = true
                            root.layer3Mode = index
                            if (index === 5) root.requestSelectTtfxEffect("random")
                            vizCanvas.requestPaint()
                        }
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: "Tr:" + root.layer3Tracers + "x"
                    active: root.layer3Tracers > 1
                    onClicked: root.cycleLayer3Tracers(1)
                    onRightClicked: root.cycleLayer3Tracers(-1)
                    onWheelScrolled: delta => {
                        root.layer3Tracers = Math.max(1, Math.min(8, root.layer3Tracers + delta))
                        vizCanvas.requestPaint()
                    }
                }

                VizPillButton {
                    pillHeight: 22
                    fontSize: 9
                    horizontalPad: 4
                    text: root.layer3AutoRandomise ? "󰒟 Rand:AUTO" : "󰒟 Rand:OFF"
                    active: root.layer3AutoRandomise
                    onClicked: {
                        root.layer3AutoRandomise = !root.layer3AutoRandomise
                        if (root.layer3AutoRandomise) {
                            root.layer3Enabled = true
                            root.randomiseLayer3()
                        }
                        scheduleSaveVisualiserConfig()
                    }
                    onRightClicked: {
                        root.layer3Enabled = true
                        root.randomiseLayer3()
                    }
                }
            }
        }
    }

    // =========================================================================
    // SPACIOUS FULL-WIDTH CONTEXTUAL 6-LAYER STUDIO, PRESETS & QUALITY DRAWER
    // Legacy test markers: "L4: Tunnel & Vortex" | text: root.backdropEnabled ? "󰄬 GPU Tunnel: ON" : "󰅖 GPU Tunnel: OFF"
    // =========================================================================
    Rectangle {
        id: layerDrawer
        anchors.top: topHud.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 8
        height: (root.externalStageOpen || root.vjDeckMode)
            ? Math.max(220, parent.height - topHud.height - (bottomHud.visible ? bottomHud.height : 0) - 20)
            : Math.max(220, Math.min(parent.height - topHud.height - (bottomHud.visible ? bottomHud.height : 0) - 24, parent.height * 0.78))
        radius: 8
        color: Qt.rgba(0.03, 0.04, 0.07, 0.95)
        border.width: 1
        border.color: root.accentColour
        visible: root.showHud && (root.showLayerDrawer || root.externalStageOpen || root.vjDeckMode) && root.stageMode === "visualiser"
        clip: true
        z: 20

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 10
            spacing: 8

            // Top Tab Selector Bar: 0: Presets · 1: Worlds · 2: Equaliser · 3: Vectors · 4: Geometry · 5: Vortex · 6: Typography · 7: General & Quality
            Flow {
                Layout.fillWidth: true
                spacing: 5

                VizPillButton {
                    text: "󰀻 Presets"
                    active: root.activeConfigLayer === 0
                    horizontalPad: 7
                    onClicked: root.activeConfigLayer = 0
                }

                VizPillButton {
                    text: "1: Worlds (" + ((root.layer1Enabled && root.layer1FieldEnabled) ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 1
                    horizontalPad: 7
                    onClicked: root.activeConfigLayer = 1
                }

                VizPillButton {
                    text: "2: Equaliser (" + ((root.layer1Enabled && root.layer1EqEnabled) ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 2
                    horizontalPad: 7
                    onClicked: root.activeConfigLayer = 2
                }

                VizPillButton {
                    text: "3: Vectors (" + ((root.layer1Enabled && root.layer1ShapesEnabled) ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 3
                    horizontalPad: 7
                    onClicked: root.activeConfigLayer = 3
                }

                VizPillButton {
                    text: "4: Geometry (" + (root.layer2Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 4
                    horizontalPad: 7
                    onClicked: root.activeConfigLayer = 4
                }

                VizPillButton {
                    text: "5: Vortex (" + (root.layer4Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 5
                    horizontalPad: 7
                    onClicked: root.activeConfigLayer = 5
                }

                VizPillButton {
                    text: "6: Typography (" + (root.layer3Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 6
                    horizontalPad: 7
                    onClicked: root.activeConfigLayer = 6
                }

                VizPillButton {
                    text: "󰒓 General & Quality"
                    active: root.activeConfigLayer === 7
                    horizontalPad: 7
                    onClicked: root.activeConfigLayer = 7
                }

                VizPillButton {
                    text: root.allRandomisationsActive ? "󰒟 RANDOM: ALL ON" : "󰒟 RANDOM"
                    active: root.allRandomisationsActive
                    horizontalPad: 7
                    onClicked: root.toggleAllRandomisations()
                    onRightClicked: root.randomiseVisuals()
                }

                VizPillButton {
                    text: root.musicDrive ? "󰎆 Music Drive: ON" : "󰎆 Music Drive: OFF"
                    active: root.musicDrive
                    horizontalPad: 7
                    onClicked: {
                        root.musicDrive = !root.musicDrive
                        vizCanvas.requestPaint()
                        scheduleSaveVisualiserConfig()
                    }
                }

                VizPillButton {
                    text: "✕ Close"
                    horizontalPad: 7
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
                    // TAB 0: COLLECTIVE SCENE PRESETS & TRANSITIONS
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
                                }
                            }

                            VizPillButton {
                                text: "󰒭 Next Selected Preset"
                                active: false
                                onClicked: root.cycleSelectedPreset(1)
                            }

                            VizPillButton {
                                text: "󰆓 + Save Current Scene as Preset"
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

                        // 2-Column Grid of Collective Presets with Checkboxes
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
                                                text: (presetData.l1Enabled ? ("1:Worlds:" + (Engine.LAYER1_MODES[presetData.l1Mode || 0] || "").split(" ")[0]) : "1:Worlds:OFF")
                                                    + " · "
                                                    + (presetData.l2Enabled ? ("4:Geometry:" + (Engine.MODE_NAMES[presetData.l2Mode || 0] || "").split(" ")[0]) : "4:Geometry:OFF")
                                                    + " · "
                                                    + (presetData.l3Enabled ? ("6:Type:" + (presetData.useAlbumArt === false ? "Words" : "Art")) : "6:Type:OFF")
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
                    // TAB 1: 1: WORLDS — 3D DEPTH FIELDS (11 WORLDS + NON-LINEAR DENSITY)
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 1

                        // Saved Layer #1 Settings Bar
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
                                    text: "󰆓 Saved Worlds:"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 10
                                    font.bold: true
                                    color: root.accentColour
                                }

                                VizPillButton {
                                    text: "󰆓 Save L1"
                                    pillHeight: 22
                                    horizontalPad: 7
                                    onClicked: root.saveCurrentL1Config()
                                }

                                VizPillButton {
                                    text: "󰉋 Saved L1 (" + (root.savedL1Configs ? root.savedL1Configs.length : 0) + ")"
                                    pillHeight: 22
                                    horizontalPad: 7
                                    onClicked: root.cycleSavedL1Config(1)
                                    onRightClicked: root.cycleSavedL1Config(-1)
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

                        // 1: Worlds Master Toggle + Auto-Randomise Row
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            VizPillButton {
                                text: root.layer1FieldEnabled ? "󰄬 Field: ON" : "󰅖 Field: OFF"
                                active: root.layer1Enabled && root.layer1FieldEnabled
                                onClicked: {
                                    root.layer1FieldEnabled = !root.layer1FieldEnabled
                                    root.syncLayer1MasterFromSubs()
                                    root.clearCanvasImmediate()
                                    scheduleSaveVisualiserConfig()
                                }
                            }

                            VizPillButton {
                                text: "Direction: " + (root.layer1Direction > 0 ? "Towards" : (root.layer1Direction < 0 ? "Away" : "Breathe"))
                                active: root.layer1FieldEnabled
                                onClicked: {
                                    root.layer1Direction = (root.layer1Direction === 1) ? -1 : ((root.layer1Direction === -1) ? 0 : 1)
                                    vizCanvas.requestPaint()
                                    scheduleSaveVisualiserConfig()
                                }
                            }

                            Item { Layout.fillWidth: true }

                            VizPillButton {
                                text: root.layer1AutoRandomise ? "󰒟 Rand L1 (Auto: ON)" : "󰒟 Rand L1"
                                active: root.layer1AutoRandomise
                                onClicked: {
                                    root.layer1AutoRandomise = !root.layer1AutoRandomise
                                    if (root.layer1AutoRandomise) {
                                        root.randomiseLayer1()
                                    }
                                    scheduleSaveVisualiserConfig()
                                }
                                onRightClicked: root.randomiseLayer1()
                            }
                        }

                        // 11 3D Worlds Selector
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

                                Flow {
                                    Layout.fillWidth: true
                                    spacing: 5

                                    Repeater {
                                        model: Engine.LAYER1_MODES.length
                                        delegate: VizPillButton {
                                            required property int index
                                            text: (index + 1) + ". " + Engine.LAYER1_MODES[index]
                                            active: root.layer1FieldEnabled && root.layer1Mode === index
                                            horizontalPad: 7
                                            onClicked: {
                                                root.layer1FieldEnabled = true
                                                root.syncLayer1MasterFromSubs()
                                                root.layer1Mode = index
                                                root.clearCanvasImmediate()
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
                                        label: "World Flight Speed"
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
                                        label: "Minimal → Many Density"
                                        value: root.layer1Density
                                        minValue: 0.25
                                        maxValue: 2.50
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
                    }

                    // =========================================================
                    // TAB 2: 2: EQUALISER — 16 2D & SCULPTURAL 3D EQUALISERS (0.15x..2.25x)
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 2

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            VizPillButton {
                                text: root.layer1EqEnabled ? "󰄬 EQ: ON" : "󰅖 EQ: OFF"
                                active: root.layer1Enabled && root.layer1EqEnabled
                                horizontalPad: 7
                                onClicked: {
                                    root.layer1EqEnabled = !root.layer1EqEnabled
                                    root.syncLayer1MasterFromSubs()
                                    root.clearCanvasImmediate()
                                    scheduleSaveVisualiserConfig()
                                }
                            }

                            Item { Layout.fillWidth: true }

                            VizPillButton {
                                text: root.layerEqAutoRandomise ? "󰒟 Rand EQ (Auto: ON)" : "󰒟 Rand EQ"
                                active: root.layerEqAutoRandomise
                                onClicked: {
                                    root.layerEqAutoRandomise = !root.layerEqAutoRandomise
                                    if (root.layerEqAutoRandomise) {
                                        root.randomiseLayerEq()
                                    }
                                    scheduleSaveVisualiserConfig()
                                }
                                onRightClicked: root.randomiseLayerEq()
                            }
                        }

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

                                Flow {
                                    Layout.fillWidth: true
                                    spacing: 5

                                    Repeater {
                                        model: Engine.LAYER1_EQ_STYLES.length
                                        delegate: VizPillButton {
                                            required property int index
                                            text: (index + 1) + ". " + Engine.LAYER1_EQ_STYLES[index]
                                            active: root.layer1EqEnabled && root.layer1EqStyle === index
                                            horizontalPad: 7
                                            onClicked: {
                                                root.layer1EqEnabled = true
                                                root.syncLayer1MasterFromSubs()
                                                root.layer1EqStyle = index
                                                root.clearCanvasImmediate()
                                            }
                                        }
                                    }
                                }

                                Flow {
                                    Layout.fillWidth: true
                                    spacing: 6

                                    Text {
                                        text: "Orientation:"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 10
                                        font.bold: true
                                        color: root.accentColour
                                    }

                                    Repeater {
                                        model: Engine.LAYER1_EQ_LAYOUTS.length
                                        delegate: VizPillButton {
                                            required property int index
                                            text: Engine.LAYER1_EQ_LAYOUTS[index]
                                            active: root.layer1EqLayout === index
                                            horizontalPad: 7
                                            onClicked: {
                                                root.layer1EqEnabled = true
                                                root.syncLayer1MasterFromSubs()
                                                root.layer1EqLayout = index
                                                vizCanvas.requestPaint()
                                                scheduleSaveVisualiserConfig()
                                            }
                                        }
                                    }

                                    Text {
                                        text: "  Damping:"
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
                                }

                                GridLayout {
                                    Layout.fillWidth: true
                                    columns: 2
                                    columnSpacing: 16
                                    rowSpacing: 5

                                    LayerSlider {
                                        Layout.fillWidth: true
                                        label: "EQ Scale (0.15x–2.25x)"
                                        value: root.layer1EqScale
                                        minValue: 0.15
                                        maxValue: 2.25
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.layer1EqScale = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
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
                    }

                    // =========================================================
                    // TAB 3: 3: VECTORS — WIREFRAME BEAT SHAPES & 3D SQUADRONS
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 3

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            VizPillButton {
                                text: root.layer1ShapesEnabled ? "󰄬 Shapes: ON" : "󰅖 Shapes: OFF"
                                active: root.layer1Enabled && root.layer1ShapesEnabled
                                horizontalPad: 7
                                onClicked: {
                                    root.layer1ShapesEnabled = !root.layer1ShapesEnabled
                                    root.syncLayer1MasterFromSubs()
                                    root.clearCanvasImmediate()
                                    scheduleSaveVisualiserConfig()
                                }
                            }

                            Item { Layout.fillWidth: true }

                            VizPillButton {
                                text: root.layerVectorsAutoRandomise ? "󰒟 Rand Vectors (Auto: ON)" : "󰒟 Rand Vectors"
                                active: root.layerVectorsAutoRandomise
                                onClicked: {
                                    root.layerVectorsAutoRandomise = !root.layerVectorsAutoRandomise
                                    if (root.layerVectorsAutoRandomise) {
                                        root.randomiseLayerVectors()
                                    }
                                    scheduleSaveVisualiserConfig()
                                }
                                onRightClicked: root.randomiseLayerVectors()
                            }
                        }

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

                                Flow {
                                    Layout.fillWidth: true
                                    spacing: 5

                                    Repeater {
                                        model: Engine.LAYER1_SHAPE_STYLES.length
                                        delegate: VizPillButton {
                                            required property int index
                                            text: (index + 1) + ". " + Engine.LAYER1_SHAPE_STYLES[index]
                                            active: root.layer1ShapesEnabled && root.layer1ShapeStyle === index
                                            horizontalPad: 7
                                            onClicked: {
                                                root.layer1ShapesEnabled = true
                                                root.syncLayer1MasterFromSubs()
                                                root.layer1ShapeStyle = index
                                                root.clearCanvasImmediate()
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
                                        label: "Vector Scale"
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

                                    LayerSlider {
                                        label: "Minimal → Many Density"
                                        value: root.layer1ShapeDensity
                                        minValue: 0.25
                                        maxValue: 2.50
                                        unitSuffix: "x"
                                        onValueEdited: v => {
                                            root.layer1ShapeDensity = v
                                            vizCanvas.requestPaint()
                                            scheduleSaveVisualiserConfig()
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // =========================================================
                    // TAB 4: 4: GEOMETRY — SACRED GEOMETRY, OSCILLOSCOPES & 3D TRACERS
                    // Zero duplicate GPU Tunnel Backdrop controls!
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 4

                        // Saved Layer #2 (Geometry) Settings Bar
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
                                    text: "󰆓 Saved Geometry:"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 10
                                    font.bold: true
                                    color: root.accentColour
                                }

                                VizPillButton {
                                    text: "󰆓 Save L2"
                                    pillHeight: 22
                                    horizontalPad: 7
                                    onClicked: root.saveCurrentL2Config()
                                }

                                VizPillButton {
                                    text: "󰉋 Saved L2 (" + (root.savedL2Configs ? root.savedL2Configs.length : 0) + ")"
                                    pillHeight: 22
                                    horizontalPad: 7
                                    onClicked: root.cycleSavedL2Config(1)
                                    onRightClicked: root.cycleSavedL2Config(-1)
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
                                text: root.layer2Enabled ? "󰄬 4: Geometry Master: ON" : "󰅖 4: Geometry Master: OFF"
                                active: root.layer2Enabled
                                onClicked: {
                                    root.layer2Enabled = !root.layer2Enabled
                                    vizCanvas.requestPaint()
                                }
                            }

                            VizPillButton {
                                text: root.layer2VizEnabled ? "󰄬 L2 Viz: ON" : "󰅖 L2 Viz: OFF"
                                active: root.layer2Enabled && root.layer2VizEnabled
                                onClicked: {
                                    root.layer2VizEnabled = !root.layer2VizEnabled
                                    if (root.layer2VizEnabled) root.layer2Enabled = true
                                    root.clearCanvasImmediate()
                                    scheduleSaveVisualiserConfig()
                                }
                            }

                            VizPillButton {
                                text: "Symmetry: " + root.symmetryFolds + "x"
                                active: root.symmetryFolds > 1
                                onClicked: root.cycleSymmetry()
                            }

                            Item { Layout.fillWidth: true }

                            VizPillButton {
                                text: root.layer2AutoRandomise ? "󰒟 Rand L2 (Auto: ON)" : "󰒟 Rand L2"
                                active: root.layer2AutoRandomise
                                onClicked: {
                                    root.layer2AutoRandomise = !root.layer2AutoRandomise
                                    if (root.layer2AutoRandomise) {
                                        root.layer2Enabled = true
                                        root.randomiseLayer2()
                                    }
                                    scheduleSaveVisualiserConfig()
                                }
                                onRightClicked: root.randomiseLayer2()
                            }
                        }

                        // Complete 13-Mode Selector Grid for 4: Geometry
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
                                    active: root.layer2Enabled && root.layer2VizEnabled && root.visualMode === index
                                    horizontalPad: 6
                                    onClicked: {
                                        root.layer2Enabled = true
                                        root.layer2VizEnabled = true
                                        root.visualMode = index
                                        vizCanvas.requestPaint()
                                    }
                                }
                            }
                        }

                        // Dedicated 3D History Tracers Strip (Bi-State ON/OFF Toggle + 1x..16x Quick Pills + 3D Flow Direction)
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 5

                            VizPillButton {
                                text: root.layer2TracersEnabled ? "󰄬 L2 3D Tracers: ON" : "󰅖 L2 3D Tracers: OFF"
                                active: root.layer2TracersEnabled
                                horizontalPad: 7
                                pillHeight: 22
                                onClicked: {
                                    root.layer2TracersEnabled = !root.layer2TracersEnabled
                                    if (root.layer2TracersEnabled) {
                                        root.layer2Enabled = true
                                        if (root.tracerCount <= 1) root.tracerCount = 4
                                    }
                                    root.clearCanvasImmediate()
                                    scheduleSaveVisualiserConfig()
                                }
                            }

                            Repeater {
                                model: [1, 2, 4, 6, 8, 12, 16]
                                delegate: VizPillButton {
                                    required property int modelData
                                    text: modelData + "x"
                                    active: root.layer2TracersEnabled && root.tracerCount === modelData
                                    horizontalPad: 6
                                    pillHeight: 22
                                    onClicked: {
                                        root.layer2Enabled = true
                                        root.layer2TracersEnabled = true
                                        root.tracerCount = modelData
                                        vizCanvas.requestPaint()
                                    }
                                }
                            }

                            VizPillButton {
                                text: "3D Flow: " + (root.tracerDirection > 0 ? "Towards User" : (root.tracerDirection < 0 ? "To Endpoint" : "Breathe In/Out"))
                                active: root.layer2TracersEnabled
                                pillHeight: 22
                                onClicked: {
                                    root.tracerDirection = (root.tracerDirection === 1) ? -1 : ((root.tracerDirection === -1) ? 0 : 1)
                                    vizCanvas.requestPaint()
                                    scheduleSaveVisualiserConfig()
                                }
                            }

                            Item { Layout.fillWidth: true }
                        }

                        // 2-Column Parameter Sliders for 4: Geometry + 3D History Tracers
                        GridLayout {
                            Layout.fillWidth: true
                            columns: 2
                            columnSpacing: 16
                            rowSpacing: 6

                            LayerSlider {
                                label: "3D Tracers (1–16x)"
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
                    // TAB 5: 5: VORTEX — DEDICATED GPU TUNNEL & VORTEX ENGINE (16 MODES + 2X DUAL BLEND)
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 7
                        visible: root.activeConfigLayer === 5

                        // Saved Vortex Configs Bar
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: l4SavedRow.implicitHeight + 10
                            radius: 6
                            color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.08)
                            border.width: 1
                            border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.35)

                            ColumnLayout {
                                id: l4SavedRow
                                anchors.fill: parent
                                anchors.margins: 5
                                spacing: 4

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 6

                                    VizPillButton {
                                        text: "󰆓 Save L4"
                                        active: true
                                        horizontalPad: 8
                                        onClicked: root.saveCurrentL4Config()
                                    }

                                    VizPillButton {
                                        text: "󰑓 Saved L4 (" + (root.savedL4Configs ? root.savedL4Configs.length : 0) + ")"
                                        active: root.selectedSavedL4Index >= 0
                                        horizontalPad: 8
                                        onClicked: root.cycleSavedL4Config(1)
                                        onRightClicked: root.cycleSavedL4Config(-1)
                                    }

                                    Text {
                                        Layout.fillWidth: true
                                        text: (root.savedL4Configs && root.savedL4Configs.length > 0)
                                            ? "Click a saved Vortex preset below to apply, or right-click to delete:"
                                            : "No saved Vortex presets yet — click 'Save L4' to snapshot your current GPU Vortex & Dual 2x setup."
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 9
                                        color: Qt.rgba(root.foregroundColour.r, root.foregroundColour.g, root.foregroundColour.b, 0.78)
                                        elide: Text.ElideRight
                                    }
                                }

                                Flow {
                                    Layout.fillWidth: true
                                    spacing: 4
                                    visible: Boolean(root.savedL4Configs && root.savedL4Configs.length > 0)

                                    Repeater {
                                        model: root.savedL4Configs ? root.savedL4Configs.length : 0
                                        delegate: VizPillButton {
                                            required property int index
                                            readonly property var itemData: (root.savedL4Configs && index < root.savedL4Configs.length) ? root.savedL4Configs[index] : ({})
                                            text: "★ " + (itemData.name || ("L4 #" + (index + 1)))
                                            active: root.selectedSavedL4Index === index
                                            horizontalPad: 7
                                            onClicked: root.applySavedL4Config(index)
                                            onRightClicked: root.deleteSavedL4Config(index)
                                        }
                                    }
                                }
                            }
                        }

                        // Master Toggles & Dual 2x Simultaneous Blending Row
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            VizPillButton {
                                text: root.layer4Enabled ? "󰄬 5: Vortex Tunnel: ON" : "󰅖 5: Vortex Tunnel: OFF"
                                active: root.layer4Enabled
                                onClicked: {
                                    root.layer4Enabled = !root.layer4Enabled
                                    root.backdropEnabled = root.layer4Enabled
                                    vizCanvas.requestPaint()
                                    scheduleSaveVisualiserConfig()
                                }
                            }

                            VizPillButton {
                                text: root.layer4DualEnabled ? "󰄬 2x Dual Mode Blend: ON" : "2x Dual Mode Blend: OFF"
                                active: root.layer4DualEnabled
                                onClicked: {
                                    root.layer4Enabled = true
                                    root.backdropEnabled = true
                                    root.layer4DualEnabled = !root.layer4DualEnabled
                                    vizCanvas.requestPaint()
                                    scheduleSaveVisualiserConfig()
                                }
                            }

                            VizPillButton {
                                text: root.layer4Direction === 0 ? "󰁔 Dir: Forward" : (root.layer4Direction === 1 ? "󰁍 Dir: Reverse" : "󰘁 Dir: Ping-Pong")
                                active: root.layer4Direction !== 0
                                onClicked: {
                                    root.layer4Direction = (root.layer4Direction + 1) % 3
                                    root.backdropDirection = root.layer4Direction
                                    vizCanvas.requestPaint()
                                    scheduleSaveVisualiserConfig()
                                }
                            }

                            VizPillButton {
                                text: root.layer4AutoRandomise ? "󰒟 Rand L4 (Auto: ON)" : "󰒟 Rand L4"
                                active: root.layer4AutoRandomise
                                onClicked: {
                                    root.layer4AutoRandomise = !root.layer4AutoRandomise
                                    if (root.layer4AutoRandomise) {
                                        root.layer4Enabled = true
                                        root.backdropEnabled = true
                                        root.randomiseLayer4()
                                    }
                                    scheduleSaveVisualiserConfig()
                                }
                                onRightClicked: {
                                    root.layer4Enabled = true
                                    root.backdropEnabled = true
                                    root.randomiseLayer4()
                                }
                            }

                            Item { Layout.fillWidth: true }
                        }

                        // Wall Pattern Selector (5 Wall Patterns)
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 5

                            Text {
                                text: "Tunnel Wall Pattern:"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 10
                                font.bold: true
                                color: root.accentColour
                            }

                            Repeater {
                                model: Engine.LAYER4_WALL_PATTERNS.length
                                delegate: VizPillButton {
                                    required property int index
                                    text: Engine.LAYER4_WALL_PATTERNS[index]
                                    active: root.layer4WallPattern === index
                                    horizontalPad: 7
                                    onClicked: {
                                        root.layer4WallPattern = index
                                        vizCanvas.requestPaint()
                                        scheduleSaveVisualiserConfig()
                                    }
                                }
                            }

                            Item { Layout.fillWidth: true }
                        }

                        // Primary 16-Mode Pill Selector for 5: Vortex (Left-click = Primary, Right-click = Secondary 2x)
                        Text {
                            text: "Primary GPU Vortex Shader Mode (Left-Click: Primary | Right-Click: Secondary 2x Blend):"
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 10
                            font.bold: true
                            color: root.accentColour
                        }

                        Flow {
                            Layout.fillWidth: true
                            spacing: 5

                            Repeater {
                                model: Engine.LAYER4_MODES.length
                                delegate: VizPillButton {
                                    required property int index
                                    text: (index + 1) + ". " + Engine.LAYER4_MODES[index]
                                    active: root.layer4Mode === index
                                    horizontalPad: 7
                                    onClicked: {
                                        root.layer4Enabled = true
                                        root.backdropEnabled = true
                                        root.layer4Mode = index
                                        root.backdropMode = index
                                        vizCanvas.requestPaint()
                                        scheduleSaveVisualiserConfig()
                                    }
                                    onRightClicked: {
                                        root.layer4Enabled = true
                                        root.backdropEnabled = true
                                        root.layer4DualEnabled = true
                                        root.layer4SecondaryMode = index
                                        vizCanvas.requestPaint()
                                        scheduleSaveVisualiserConfig()
                                    }
                                }
                            }
                        }

                        // Secondary 2x Mode Selector (Visible when Dual 2x is enabled)
                        Flow {
                            Layout.fillWidth: true
                            spacing: 5
                            visible: root.layer4DualEnabled

                            Text {
                                text: "2x Secondary Mode:"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 10
                                font.bold: true
                                color: root.accentColour
                            }

                            Repeater {
                                model: Engine.LAYER4_MODES.length
                                delegate: VizPillButton {
                                    required property int index
                                    text: (index + 1) + ". " + Engine.LAYER4_MODES[index]
                                    active: root.layer4SecondaryMode === index
                                    horizontalPad: 6
                                    onClicked: {
                                        root.layer4SecondaryMode = index
                                        vizCanvas.requestPaint()
                                        scheduleSaveVisualiserConfig()
                                    }
                                }
                            }
                        }

                        // 2-Column Parameter Sliders for 5: Vortex
                        GridLayout {
                            Layout.fillWidth: true
                            columns: 2
                            columnSpacing: 16
                            rowSpacing: 6

                            LayerSlider {
                                label: "Vortex Speed"
                                value: root.layer4Speed
                                minValue: 0.15
                                maxValue: 3.00
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer4Speed = v; root.backdropSpeed = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Vortex Glow"
                                value: root.layer4Intensity
                                minValue: 0.15
                                maxValue: 2.00
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer4Intensity = v; root.backdropIntensity = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Spiral Twist"
                                value: root.layer4Twist
                                minValue: 0.10
                                maxValue: 3.00
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer4Twist = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Symmetry Folds"
                                value: root.layer4Symmetry
                                minValue: 2
                                maxValue: 16
                                integerSteps: true
                                unitSuffix: "-fold"
                                onValueEdited: v => { root.layer4Symmetry = Math.round(v); root.backdropSymmetry = Math.round(v); vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Dual 2x Mix"
                                value: root.layer4DualMix
                                minValue: 0.10
                                maxValue: 0.90
                                unitSuffix: ""
                                onValueEdited: v => { root.layer4DualMix = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }
                        }
                    }

                    // =========================================================
                    // TAB 6: 6: TYPOGRAPHY — 2 × 3 × 16 × 12 MATRIX (SMOOTH SCALE BREATHING ON RANDOM)
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 6

                        // Saved Layer #3 (Typography) Settings Bar
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
                                    text: "󰆓 Saved Typography:"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 10
                                    font.bold: true
                                    color: root.accentColour
                                }

                                VizPillButton {
                                    text: "󰆓 Save L3"
                                    pillHeight: 22
                                    horizontalPad: 7
                                    onClicked: root.saveCurrentL3Config()
                                }

                                VizPillButton {
                                    text: "󰉋 Saved L3 (" + (root.savedL3Configs ? root.savedL3Configs.length : 0) + ")"
                                    pillHeight: 22
                                    horizontalPad: 7
                                    onClicked: root.cycleSavedL3Config(1)
                                    onRightClicked: root.cycleSavedL3Config(-1)
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

                        Flow {
                            Layout.fillWidth: true
                            spacing: 6

                            VizPillButton {
                                text: root.layer3Enabled ? "󰄬 6: Typography: ON" : "󰅖 6: Typography: OFF"
                                active: root.layer3Enabled
                                onClicked: {
                                    root.layer3Enabled = !root.layer3Enabled
                                    vizCanvas.requestPaint()
                                }
                            }

                            VizPillButton {
                                text: "󰀥 Album Cover Art"
                                active: root.useAlbumArt && root.asciiMode !== "banner"
                                onClicked: root.selectL3SourceOrGlyph("art")
                            }

                            VizPillButton {
                                text: "󰬴 Artist & Song Words"
                                active: !root.useAlbumArt || root.asciiMode === "banner"
                                onClicked: root.selectL3SourceOrGlyph("words")
                            }

                            VizPillButton {
                                text: "⣿ Braille"
                                active: root.asciiMode !== "block" && root.asciiMode !== "text"
                                onClicked: root.selectL3SourceOrGlyph("braille")
                            }

                            VizPillButton {
                                text: "█ Block"
                                active: root.asciiMode === "block"
                                onClicked: root.selectL3SourceOrGlyph("block")
                            }

                            VizPillButton {
                                text: "󰬴 Crisp Text"
                                active: root.asciiMode === "text"
                                onClicked: root.selectL3SourceOrGlyph("text")
                            }

                            VizPillButton {
                                text: root.layer3AutoRandomise ? "󰒟 Rand L3 (Auto: ON)" : "󰒟 Rand L3"
                                active: root.layer3AutoRandomise
                                onClicked: {
                                    root.layer3AutoRandomise = !root.layer3AutoRandomise
                                    if (root.layer3AutoRandomise) {
                                        root.layer3Enabled = true
                                        root.randomiseLayer3()
                                    }
                                    scheduleSaveVisualiserConfig()
                                }
                                onRightClicked: {
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

                        // Selectable Text Fields (Artist / Track / Album)
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 5

                            Text {
                                text: "Visible Text Fields:"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 10
                                font.bold: true
                                color: root.accentColour
                            }

                            VizPillButton {
                                text: root.layer3ShowArtist ? "󰄬 Artist" : "Artist"
                                active: root.layer3ShowArtist
                                horizontalPad: 7
                                onClicked: root.toggleLayer3TextField("artist")
                            }

                            VizPillButton {
                                text: root.layer3ShowTrack ? "󰄬 Track" : "Track"
                                active: root.layer3ShowTrack
                                horizontalPad: 7
                                onClicked: root.toggleLayer3TextField("track")
                            }

                            VizPillButton {
                                text: root.layer3ShowAlbum ? "󰄬 Album" : "Album"
                                active: root.layer3ShowAlbum
                                horizontalPad: 7
                                onClicked: root.toggleLayer3TextField("album")
                            }

                            Item { Layout.fillWidth: true }
                        }

                        Flow {
                            Layout.fillWidth: true
                            spacing: 5

                            Text {
                                text: "Psychedelic / Techno / Dance Style (16):"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 10
                                font.bold: true
                                color: root.accentColour
                            }

                            Repeater {
                                model: Engine.LAYER3_TEXT_STYLES.length
                                delegate: VizPillButton {
                                    required property int index
                                    text: (index + 1) + ". " + Engine.LAYER3_TEXT_STYLES[index]
                                    active: root.layer3TextStyle === index
                                    horizontalPad: 7
                                    onClicked: {
                                        root.layer3TextStyle = index
                                        vizCanvas.requestPaint()
                                        scheduleSaveVisualiserConfig()
                                    }
                                }
                            }
                        }

                        // 3D Revolving Cylinder & Whole-Word 360° Spin Axis Selector Row
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 5

                            Text {
                                text: "3D Revolving Cylinder & 360° Word Spin:"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 10
                                font.bold: true
                                color: root.accentColour
                            }

                            Repeater {
                                model: Engine.LAYER3_CYLINDER_DIRS.length
                                delegate: VizPillButton {
                                    required property int index
                                    text: Engine.LAYER3_CYLINDER_DIRS[index]
                                    active: root.layer3CylinderDir === index
                                    horizontalPad: 7
                                    onClicked: {
                                        root.layer3CylinderDir = index
                                        vizCanvas.requestPaint()
                                        scheduleSaveVisualiserConfig()
                                    }
                                }
                            }

                            Item { Layout.fillWidth: true }
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
                                    }
                                }
                            }
                        }

                        // Direct 12-Mode Pill Selector for 6: Typography
                        Flow {
                            Layout.fillWidth: true
                            spacing: 5

                            Repeater {
                                model: Engine.LAYER3_MODES.length
                                delegate: VizPillButton {
                                    required property int index
                                    text: (index + 1) + ". " + Engine.LAYER3_MODES[index]
                                    active: root.layer3Mode === index
                                    horizontalPad: 7
                                    onClicked: {
                                        root.layer3Enabled = true
                                        root.layer3Mode = index
                                        if (index === 5) root.requestSelectTtfxEffect("random")
                                        vizCanvas.requestPaint()
                                    }
                                }
                            }
                        }

                        // Dedicated Ghost Tracers Quick-Select Row (1x..8x)
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 5

                            Text {
                                text: "Typography Ghost Tracers:"
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
                                    }
                                }
                            }

                            Item { Layout.fillWidth: true }
                        }

                        // 2-Column Parameter Sliders for 6: Typography
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
                                label: "Art/Words Scale"
                                value: root.layer3Scale
                                minValue: 0.45
                                maxValue: 1.95
                                unitSuffix: "x"
                                onValueEdited: v => { root.layer3Scale = v; vizCanvas.requestPaint(); scheduleSaveVisualiserConfig() }
                            }

                            LayerSlider {
                                label: "Ghost Tracer Echoes"
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
                    // TAB 7: 󰒓 GENERAL & QUALITY CONFIGURATION
                    //   Render Quality, Target FPS, Inhibit Screensaver (FS/VJ),
                    //   30-Palette Grid, Global Audio & Beat Response, Reset Defaults
                    // =========================================================
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        visible: root.activeConfigLayer === 7

                        // Section 1: Render Quality, Resolution, Target FPS, Screensaver Inhibit & Antialiasing
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

                                Flow {
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
                                            { q: 0, w: 384, detail: 0.75, label: "Low (384p)" },
                                            { q: 1, w: 480, detail: 1.00, label: "Balanced (480p)" },
                                            { q: 2, w: 640, detail: 1.35, label: "High (640p)" },
                                            { q: 3, w: 960, detail: 1.70, label: "Ultra (960p HD)" },
                                            { q: 4, w: 1280, detail: 2.00, label: "Ultra+ (1280p Razor)" }
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
                                            }
                                        }
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
                                            }
                                        }
                                    }

                                    VizPillButton {
                                        text: root.gpuShaderEnabled ? "GPU HW: ON" : "GPU HW: OFF"
                                        active: root.gpuShaderEnabled
                                        horizontalPad: 7
                                        onClicked: {
                                            root.gpuShaderEnabled = !root.gpuShaderEnabled
                                            root.clearCanvasImmediate()
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
                                        }
                                    }

                                    VizPillButton {
                                        text: root.disableScreensaverInFullscreenOrVj ? "󰒲 Inhibit Screensaver (FS/VJ): ON" : "󰒲 Inhibit Screensaver (FS/VJ): OFF"
                                        active: root.disableScreensaverInFullscreenOrVj
                                        horizontalPad: 7
                                        onClicked: {
                                            root.disableScreensaverInFullscreenOrVj = !root.disableScreensaverInFullscreenOrVj
                                            scheduleSaveVisualiserConfig()
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
                                        label: "Canvas Resolution"
                                        value: root.renderResW
                                        minValue: 320
                                        maxValue: 1280
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

                        // Section 2: 30 Psychedelic & Nightclub Colour Palettes Selector Grid
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: paletteSecCol.implicitHeight + 14
                            radius: 6
                            color: Qt.rgba(1, 1, 1, 0.04)
                            border.width: 1
                            border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.25)

                            ColumnLayout {
                                id: paletteSecCol
                                anchors.fill: parent
                                anchors.margins: 7
                                spacing: 6

                                Text {
                                    text: "󰏘 30 Psychedelic & Nightclub Colour Palettes:"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 10
                                    font.bold: true
                                    color: root.accentColour
                                }

                                Flow {
                                    Layout.fillWidth: true
                                    spacing: 4

                                    Repeater {
                                        model: Engine.PALETTE_NAMES.length
                                        delegate: VizPillButton {
                                            required property int index
                                            text: (index + 1) + ". " + Engine.PALETTE_NAMES[index]
                                            active: root.paletteIndex === index
                                            pillHeight: 22
                                            fontSize: 9
                                            horizontalPad: 6
                                            onClicked: {
                                                root.paletteIndex = index
                                                vizCanvas.requestPaint()
                                                scheduleSaveVisualiserConfig()
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // Section 3: Global Audio & Beat Response + Colour & Brightness + Timings
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
                                        text: root.allRandomisationsActive ? "󰒟 Full RANDOM (All 6 Layers): ON" : "󰒟 Full RANDOM (All 6 Layers): OFF"
                                        active: root.allRandomisationsActive
                                        onClicked: root.toggleAllRandomisations()
                                    }

                                    VizPillButton {
                                        text: "󰆓 Save Visualiser Config to Disk Now"
                                        active: true
                                        onClicked: {
                                            root.requestSaveVisualiserConfig(root.buildPersistedConfigSnapshot())
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
