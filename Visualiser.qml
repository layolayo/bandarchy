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
// The 3 Visualiser Layers are independently toggleable and user-configurable:
//   - Layer #1: Background & Iterative Framebuffer Feedback Engine (6 modes)
//   - Layer #2: Psychedelic & Classic Nightclub Visualiser Engine (12 modes)
//   - Layer #3: Album Art Dismantle, Evolution & Rebuild Engine (6 modes)

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

    // Optional Omarchy screensaver / ASCII album art properties
    property var asciiLines: []
    property var bannerLines: []
    property var artLines: []
    property var ttfxFrames: []
    property bool useAlbumArt: false
    property string asciiMode: "braille"
    property string asciiSource: "album-art"
    property string ttfxEffectName: "waves"

    // Exposed engine metadata for callers and tests
    readonly property var modeNames: Engine.MODE_NAMES
    readonly property var layer1Modes: Engine.LAYER1_MODES
    readonly property var layer3Modes: Engine.LAYER3_MODES
    readonly property var paletteNames: Engine.PALETTE_NAMES

    // Layer #1 — Background & Feedback Engine state
    property bool layer1Enabled: true
    property int layer1Mode: 0
    property real layer1Persistence: 0.86
    property real layer1Speed: 1.0
    property real layer1Density: 1.0
    property real layer1Dim: 0.14

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

    // Layer #3 — Album Art Dismantle, Evolution & Rebuild Engine state
    property bool layer3Enabled: useAlbumArt
    property int layer3Mode: 0
    property real layer3Dismantle: 1.0
    property real layer3Rebuild: 1.0
    property real layer3Evolution: 1.0
    property real layer3Scale: 1.0

    // HUD & Drawer state
    property bool showHud: true
    property bool showLayerDrawer: false
    property int activeConfigLayer: 2 // 1 = Layer 1, 2 = Layer 2, 3 = Layer 3
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
        "[ Art Morph",
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
    signal requestLaunchTtfxScreensaver(string effectName)
    signal requestSelectTtfxEffect(string effectName)
    signal requestStageModeChange(string newStageMode)
    signal requestActionFeedback(string message)

    property var engineState: Engine.createState()

    onUseAlbumArtChanged: {
        if (root.useAlbumArt && !root.layer3Enabled) {
            root.layer3Enabled = true
        }
        vizCanvas.requestPaint()
    }

    onVisualModeChanged: {
        if (root.visualMode === 10) {
            root.layer3Enabled = true
        }
        vizCanvas.requestPaint()
    }

    function currentConfig() {
        return {
            playing: root.playing,
            position: root.position,
            duration: root.duration,
            palette: root.paletteIndex,
            sensitivity: root.sensitivity,
            asciiMode: root.asciiMode,
            layer3AsciiMode: root.asciiMode,
            useAlbumArt: root.useAlbumArt,
            bannerLines: root.bannerLines,
            artLines: root.artLines,
            layer1Enabled: root.layer1Enabled,
            layer1Mode: root.layer1Mode,
            layer1Persistence: root.layer1Persistence,
            layer1Speed: root.layer1Speed,
            layer1Density: root.layer1Density,
            layer1Dim: root.layer1Dim,
            layer2Enabled: root.layer2Enabled,
            layer2Mode: root.visualMode,
            mode: root.visualMode,
            symmetryFolds: root.symmetryFolds,
            layer2Complexity: root.layer2Complexity,
            layer2Speed: root.layer2Speed,
            layer2Zoom: root.layer2Zoom,
            layer2Chaos: root.layer2Chaos,
            layer3Enabled: root.layer3Enabled || root.useAlbumArt || root.visualMode === 10,
            layer3Mode: root.layer3Mode,
            layer3Dismantle: root.layer3Dismantle,
            layer3Rebuild: root.layer3Rebuild,
            layer3Evolution: root.layer3Evolution,
            layer3Scale: root.layer3Scale
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

    function cycleMode(delta) {
        var count = Engine.MODE_NAMES.length
        visualMode = (visualMode + delta + count) % count
        root.requestActionFeedback("Layer #2 Mode: " + Engine.MODE_NAMES[visualMode])
    }

    function cycleLayer1Mode(delta) {
        var count = Engine.LAYER1_MODES.length
        layer1Mode = (layer1Mode + delta + count) % count
        if (!layer1Enabled) layer1Enabled = true
        vizCanvas.requestPaint()
        root.requestActionFeedback("Layer #1 Background: " + Engine.LAYER1_MODES[layer1Mode])
    }

    function cycleLayer3Mode(delta) {
        var count = Engine.LAYER3_MODES.length
        layer3Mode = (layer3Mode + delta + count) % count
        if (!layer3Enabled) {
            layer3Enabled = true
        }
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
        root.requestActionFeedback("Kaleidoscope Facets: " + root.symmetryFolds + "x")
    }

    function randomiseVisuals() {
        Engine.randomiseState(root.engineState)
        paletteIndex = (paletteIndex + 1 + Math.floor(Math.random() * (Engine.PALETTE_NAMES.length - 1))) % Engine.PALETTE_NAMES.length
        vizCanvas.requestPaint()
        root.requestActionFeedback("Mutated psychedelic seed + palette (" + Engine.PALETTE_NAMES[paletteIndex] + ")")
    }

    function triggerShatterImpulse() {
        if (!root.layer3Enabled) {
            root.layer3Enabled = true
        }
        Engine.shatterAlbumArt(root.engineState, 1.55)
        vizCanvas.requestPaint()
        root.requestActionFeedback("Triggered Layer #3 Shatter Impulse")
    }

    function activateAndCycleTteInCanvas() {
        // Ensure Layer #3 is active in Omarchy TTE Keyframe Morph mode (mode 5, showing compressed Words)
        root.layer3Enabled = true
        root.layer3Mode = 5
        var idx = root.ttfxEffectsList.indexOf(root.ttfxEffectName)
        var nextEffect = root.ttfxEffectsList[(idx + 1 + root.ttfxEffectsList.length) % root.ttfxEffectsList.length]
        root.ttfxEffectName = nextEffect
        Engine.shatterAlbumArt(root.engineState, 1.25)
        root.requestSelectTtfxEffect(nextEffect)
        vizCanvas.requestPaint()
        root.requestActionFeedback("TTE Words Morph: " + nextEffect)
    }

    function launchExternalTteTerminal() {
        var eff = root.ttfxEffectName || currentTtfxEffect()
        root.requestLaunchTtfxScreensaver(eff)
        root.requestActionFeedback("Launching Omarchy TTE Terminal (" + eff + ")...")
    }

    function currentTtfxEffect() {
        var map = root.ttfxEffectsList
        return map[visualMode % map.length] || "waves"
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
        property int horizontalPad: 12
        property int pillHeight: 26
        signal clicked()

        Layout.preferredHeight: pillHeight
        Layout.preferredWidth: pillLabel.implicitWidth + horizontalPad * 2
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
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                flashTimer.restart()
                pill.clicked()
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
        signal valueEdited(real newVal)

        Layout.fillWidth: true
        spacing: 6

        Text {
            Layout.preferredWidth: 108
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
                    sliderRow.valueEdited(Math.round(v * 100) / 100)
                }
                onPressed: mouse => updateFromX(mouse.x)
                onPositionChanged: mouse => { if (pressed) updateFromX(mouse.x) }
            }
        }

        Text {
            Layout.preferredWidth: 44
            horizontalAlignment: Text.AlignRight
            text: sliderRow.value.toFixed(2) + sliderRow.unitSuffix
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
        else if (event.key === Qt.Key_K) { cycleSymmetry(); event.accepted = true }
        else if (event.key === Qt.Key_R) { randomiseVisuals(); event.accepted = true }
        else if (event.key === Qt.Key_S) { triggerShatterImpulse(); event.accepted = true }
        else if (event.key === Qt.Key_X) {
            autoCycle = !autoCycle
            root.requestActionFeedback("Auto-Morph: " + (autoCycle ? "ON" : "OFF"))
            event.accepted = true
        }
        else if (event.key === Qt.Key_A) {
            root.layer3Enabled = !root.layer3Enabled
            root.requestToggleUseAlbumArt()
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
            event.accepted = true
        }
        else if (event.key === Qt.Key_H) { showHud = !showHud; event.accepted = true }
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
            root.requestToggleFullscreen()
            event.accepted = true
        }
        else if (event.key === Qt.Key_Escape) {
            if (root.showLayerDrawer) root.showLayerDrawer = false
            else if (root.isFullscreen) root.requestToggleFullscreen()
            else root.requestCloseVisualiser()
            event.accepted = true
        }
    }

    Rectangle {
        anchors.fill: parent
        color: root.backgroundColour
    }

    // VSync-locked 60 FPS animation loop (eliminates timer jitter and FBO swapchain tearing)
    FrameAnimation {
        id: frameAnim
        running: root.visible && root.stageMode !== "off"
        onTriggered: {
            var dt = Math.min(0.05, Math.max(0.005, frameTime))
            Engine.stepState(root.engineState, root.bands, root.playing, root.currentConfig(), dt)
            root.liveBass = root.engineState.bassSmooth || 0.0
            root.liveMid = root.engineState.midSmooth || 0.0
            root.liveHigh = root.engineState.highSmooth || 0.0
            root.liveBeat = root.engineState.beatPulse || 0.0
            if (root.stageMode === "visualiser") {
                vizCanvas.requestPaint()
            }
        }
    }

    // Auto-Morph Evolution Timer (when `autoCycle` is toggled ON)
    Timer {
        interval: 12000
        running: root.visible && root.autoCycle && root.stageMode === "visualiser"
        repeat: true
        onTriggered: {
            root.cycleMode(1)
            if (root.layer1Enabled) {
                root.layer1Mode = (root.layer1Mode + 1) % Engine.LAYER1_MODES.length
            }
            if (root.layer3Enabled) {
                root.layer3Mode = (root.layer3Mode + 1) % Engine.LAYER3_MODES.length
            }
            Engine.randomiseState(root.engineState)
            root.paletteIndex = (root.paletteIndex + 1) % Engine.PALETTE_NAMES.length
        }
    }

    // =========================================================================
    // STAGE MODE 1: ALBUM ART AS-IS ("art")
    // =========================================================================
    Item {
        id: artStageView
        anchors.fill: parent
        visible: root.stageMode === "art"

        // Subtle ambient radial glow behind cover art
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
            width: Math.max(160, Math.min(parent.width - 48, parent.height - (root.showHud ? 156 : 48)))
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
            width: Math.max(220, Math.min(parent.width - 28, (parent.height - (root.showHud ? 148 : 28)) * 1.16))
            height: Math.max(190, Math.min(parent.height - (root.showHud ? 148 : 28), width / 1.16))
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
    // =========================================================================
    Canvas {
        id: vizCanvas
        anchors.fill: parent
        visible: root.stageMode === "visualiser"
        // Persistent single-buffer image prevents double-buffer FBO flickering
        // and allows MilkDrop/G-Force/Cthugha self-feedback warp via drawImage(vizCanvas, ...)
        renderTarget: Canvas.Image
        renderStrategy: Canvas.Cooperative

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
        anchors.fill: parent
        z: -1
        acceptedButtons: Qt.LeftButton
        onClicked: root.forceActiveFocus()
        onDoubleClicked: root.requestToggleFullscreen()
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
        height: root.stageMode === "visualiser" ? 80 : 44
        radius: 8
        color: Qt.rgba(0.04, 0.05, 0.08, 0.88)
        border.width: 1
        border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.35)
        visible: root.showHud

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 7
            spacing: 5

            // Row 1: Stage Mode Selector + Layer Toggles + TTE + Fullscreen
            RowLayout {
                Layout.fillWidth: true
                spacing: 5

                // 4 Stage Modes Pill Group
                VizPillButton {
                    text: "󰀥 Art"
                    active: root.stageMode === "art"
                    horizontalPad: 8
                    onClicked: root.setStage("art")
                }

                VizPillButton {
                    text: "󰀥 Turntable"
                    active: root.stageMode === "turntable"
                    horizontalPad: 8
                    onClicked: root.setStage("turntable")
                }

                VizPillButton {
                    text: "󰍹 Visualiser"
                    active: root.stageMode === "visualiser"
                    horizontalPad: 8
                    onClicked: root.setStage("visualiser")
                }

                // Divider
                Rectangle {
                    Layout.preferredWidth: 1
                    Layout.preferredHeight: 18
                    color: Qt.rgba(1, 1, 1, 0.16)
                    visible: root.stageMode === "visualiser"
                }

                // Layer #1 Quick Toggle + Cycle
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "L1 Bg: " + (root.layer1Enabled ? "ON" : "OFF")
                    active: root.layer1Enabled
                    horizontalPad: 8
                    onClicked: {
                        root.layer1Enabled = !root.layer1Enabled
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("Layer #1 Background: " + (root.layer1Enabled ? ("ON (" + Engine.LAYER1_MODES[root.layer1Mode] + ")") : "OFF"))
                    }
                }

                // Layer #2 Quick Toggle
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "L2 Viz: " + (root.layer2Enabled ? (Engine.MODE_NAMES[root.visualMode] || "ON").split(" ")[0] : "OFF")
                    active: root.layer2Enabled
                    horizontalPad: 8
                    onClicked: {
                        root.layer2Enabled = !root.layer2Enabled
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("Layer #2 Visualiser: " + (root.layer2Enabled ? "ON" : "OFF"))
                    }
                }

                // Layer #3 (Album Art / Words Dismantle & Evolution) Quick Toggle
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: (root.layer3Enabled || root.visualMode === 10) ? "󰀥 L3: ON" : "󰀥 L3: OFF"
                    active: root.layer3Enabled || root.visualMode === 10
                    horizontalPad: 8
                    onClicked: {
                        root.layer3Enabled = !root.layer3Enabled
                        vizCanvas.requestPaint()
                        root.requestActionFeedback("Layer #3 Evolution: " + (root.layer3Enabled ? ("ON (" + Engine.LAYER3_MODES[root.layer3Mode] + ")") : "OFF"))
                    }
                }

                // Layer #3 Source Toggle: Words (Banner) vs Braille Cover Art vs Block Cover Art
                VizPillButton {
                    visible: root.stageMode === "visualiser" && (root.layer3Enabled || root.visualMode === 10)
                    text: (!root.useAlbumArt || root.asciiMode === "banner")
                        ? "󰬴 Words"
                        : (root.asciiMode === "block" ? "█ Block Art" : "⣿ Braille Art")
                    active: true
                    horizontalPad: 7
                    onClicked: root.requestToggleAsciiMode()
                }

                // Open 3-Layer Configuration Drawer button
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: root.showLayerDrawer ? "󰒓 Layers ▲" : "󰒓 Layers ▼"
                    active: root.showLayerDrawer
                    urgent: root.showLayerDrawer
                    horizontalPad: 9
                    onClicked: {
                        root.showLayerDrawer = !root.showLayerDrawer
                        root.requestActionFeedback(root.showLayerDrawer ? "Opened 3-Layer Config Drawer" : "Closed 3-Layer Config Drawer")
                    }
                }

                // Palette selector
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "󰏘 " + (Engine.PALETTE_NAMES[root.paletteIndex] || "Prism").split(" ")[0]
                    horizontalPad: 8
                    onClicked: root.cyclePalette(1)
                }

                // Facets selector
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "󰕮 " + root.symmetryFolds + "x"
                    active: root.symmetryFolds > 1
                    horizontalPad: 7
                    onClicked: root.cycleSymmetry()
                }

                // Mutate seed
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "󰒟 Mutate"
                    urgent: true
                    horizontalPad: 8
                    onClicked: root.randomiseVisuals()
                }

                // Auto-Morph
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: root.autoCycle ? "󰑐 Auto: ON" : "󰑐 Auto"
                    active: root.autoCycle
                    horizontalPad: 7
                    onClicked: {
                        root.autoCycle = !root.autoCycle
                        root.requestActionFeedback("Auto-Morph Evolution: " + (root.autoCycle ? "ON" : "OFF"))
                    }
                }

                Item { Layout.fillWidth: true }

                // In-Canvas TTE Effect Activator / Cycler (Immediate visual response)
                VizPillButton {
                    visible: root.stageMode === "visualiser"
                    text: "󰍹 TTE: " + root.ttfxEffectName
                    active: root.layer3Enabled && root.layer3Mode === 5
                    urgent: true
                    horizontalPad: 8
                    onClicked: root.activateAndCycleTteInCanvas()
                }

                // External Omarchy TTE Fullscreen Terminal Launcher
                VizPillButton {
                    text: "󰆍 TTE Term"
                    horizontalPad: 8
                    onClicked: root.launchExternalTteTerminal()
                }

                // Fullscreen toggle
                VizPillButton {
                    text: root.isFullscreen ? "󰊓 Exit" : "󰊓 Full"
                    active: root.isFullscreen
                    horizontalPad: 8
                    onClicked: root.requestToggleFullscreen()
                }
            }

            // Row 2: Direct 12-Mode Quick-Select Strip (when in Visualiser stage)
            RowLayout {
                Layout.fillWidth: true
                spacing: 4
                visible: root.stageMode === "visualiser"

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
        }
    }

    // =========================================================================
    // INTERACTIVE 3-LAYER CONFIGURATION DRAWER
    // =========================================================================
    Rectangle {
        id: layerDrawer
        anchors.top: topHud.bottom
        anchors.right: parent.right
        anchors.margins: 8
        width: Math.min(parent.width - 16, 460)
        height: 256
        radius: 8
        color: Qt.rgba(0.03, 0.04, 0.07, 0.94)
        border.width: 1
        border.color: root.accentColour
        visible: root.showHud && root.showLayerDrawer && root.stageMode === "visualiser"
        z: 20

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 10
            spacing: 8

            // Layer Tab Selector Bar (Layer #1 / Layer #2 / Layer #3)
            RowLayout {
                Layout.fillWidth: true
                spacing: 6

                VizPillButton {
                    text: "Layer #1: Background (" + (root.layer1Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 1
                    horizontalPad: 8
                    onClicked: root.activeConfigLayer = 1
                }

                VizPillButton {
                    text: "Layer #2: Visualiser (" + (root.layer2Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 2
                    horizontalPad: 8
                    onClicked: root.activeConfigLayer = 2
                }

                VizPillButton {
                    text: "Layer #3: Art Morph (" + (root.layer3Enabled ? "ON" : "OFF") + ")"
                    active: root.activeConfigLayer === 3
                    horizontalPad: 8
                    onClicked: root.activeConfigLayer = 3
                }

                Item { Layout.fillWidth: true }

                VizPillButton {
                    text: "✕"
                    horizontalPad: 6
                    onClicked: root.showLayerDrawer = false
                }
            }

            // -----------------------------------------------------------------
            // LAYER #1 CONFIGURATION PANEL
            // -----------------------------------------------------------------
            ColumnLayout {
                Layout.fillWidth: true
                Layout.fillHeight: true
                spacing: 6
                visible: root.activeConfigLayer === 1

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6

                    VizPillButton {
                        text: root.layer1Enabled ? "󰄬 Layer #1 Enabled" : "󰅖 Layer #1 Disabled"
                        active: root.layer1Enabled
                        onClicked: {
                            root.layer1Enabled = !root.layer1Enabled
                            vizCanvas.requestPaint()
                        }
                    }

                    VizPillButton {
                        text: "󰍹 " + (Engine.LAYER1_MODES[root.layer1Mode] || "MilkDrop Warp")
                        active: true
                        onClicked: root.cycleLayer1Mode(1)
                    }
                }

                LayerSlider {
                    label: "Trail Persistence"
                    value: root.layer1Persistence
                    minValue: 0.20
                    maxValue: 0.97
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
                    minValue: 0.02
                    maxValue: 0.65
                    onValueEdited: v => { root.layer1Dim = v; vizCanvas.requestPaint() }
                }
            }

            // -----------------------------------------------------------------
            // LAYER #2 CONFIGURATION PANEL
            // -----------------------------------------------------------------
            ColumnLayout {
                Layout.fillWidth: true
                Layout.fillHeight: true
                spacing: 6
                visible: root.activeConfigLayer === 2

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6

                    VizPillButton {
                        text: root.layer2Enabled ? "󰄬 Layer #2 Enabled" : "󰅖 Layer #2 Disabled"
                        active: root.layer2Enabled
                        onClicked: {
                            root.layer2Enabled = !root.layer2Enabled
                            vizCanvas.requestPaint()
                        }
                    }

                    VizPillButton {
                        text: "󰍹 " + (Engine.MODE_NAMES[root.visualMode] || "MilkDrop")
                        active: true
                        onClicked: root.cycleMode(1)
                    }

                    VizPillButton {
                        text: "󰕮 Facets: " + root.symmetryFolds + "x"
                        active: root.symmetryFolds > 1
                        onClicked: root.cycleSymmetry()
                    }
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
                    label: "Scale / Chaos"
                    value: root.layer2Zoom
                    minValue: 0.50
                    maxValue: 2.00
                    unitSuffix: "x"
                    onValueEdited: v => { root.layer2Zoom = v; root.layer2Chaos = Math.min(1.5, v * 0.6); vizCanvas.requestPaint() }
                }
            }

            // -----------------------------------------------------------------
            // LAYER #3 CONFIGURATION PANEL (ALBUM ART DISMANTLE & REBUILD)
            // -----------------------------------------------------------------
            ColumnLayout {
                Layout.fillWidth: true
                Layout.fillHeight: true
                spacing: 6
                visible: root.activeConfigLayer === 3

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6

                    VizPillButton {
                        text: root.layer3Enabled ? "󰄬 Layer #3 Enabled" : "󰅖 Layer #3 Disabled"
                        active: root.layer3Enabled
                        onClicked: {
                            root.layer3Enabled = !root.layer3Enabled
                            if (root.layer3Enabled !== root.useAlbumArt) {
                                root.requestToggleUseAlbumArt()
                            }
                            vizCanvas.requestPaint()
                        }
                    }

                    VizPillButton {
                        text: "󰀥 " + (Engine.LAYER3_MODES[root.layer3Mode] || "Shatter & Rebuild")
                        active: true
                        onClicked: root.cycleLayer3Mode(1)
                    }

                    VizPillButton {
                        text: (!root.useAlbumArt || root.asciiMode === "banner")
                            ? "󰬴 Words (Banner)"
                            : (root.asciiMode === "block" ? "█ Block Art" : "⣿ Braille Art")
                        onClicked: root.requestToggleAsciiMode()
                    }

                    VizPillButton {
                        text: "󰒟 Shatter!"
                        urgent: true
                        onClicked: root.triggerShatterImpulse()
                    }
                }

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
            }
        }
    }

    // =========================================================================
    // BOTTOM TRACK, LIVE AUDIO TELEMETRY & TRANSPORT HUD
    // =========================================================================
    Rectangle {
        id: bottomHud
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 8
        height: 54
        radius: 8
        color: Qt.rgba(0.04, 0.05, 0.08, 0.86)
        border.width: 1
        border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.30)
        visible: root.showHud

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 10
            anchors.rightMargin: 10
            spacing: 10

            // Clicking the mini vinyl badge switches to the full Turntable stage
            Item {
                Layout.preferredWidth: 38
                Layout.preferredHeight: 38

                Vinyl {
                    anchors.fill: parent
                    artPath: root.artPath
                    spinning: root.playing
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
                spacing: 2

                Text {
                    Layout.fillWidth: true
                    text: root.trackTitle || "Bandarchy Psychedelic Stage"
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 12
                    font.bold: true
                    color: root.foregroundColour
                    elide: Text.ElideRight
                }

                Text {
                    Layout.fillWidth: true
                    text: (root.trackArtist ? root.trackArtist : "Bandarchy") +
                          (root.trackAlbum ? (" · " + root.trackAlbum) : "") +
                          "  [L: Layers · G: L1 Bg · M: L2 Viz · E: L3 Art · S: Shatter · T: TTE · F: Full]"
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 9
                    color: Qt.rgba(root.foregroundColour.r, root.foregroundColour.g, root.foregroundColour.b, 0.72)
                    elide: Text.ElideRight
                }
            }

            // Live 4-Bar Audio Telemetry Meter (BASS / MID / HIGH / BEAT)
            Rectangle {
                Layout.preferredWidth: 96
                Layout.preferredHeight: 34
                radius: 5
                color: Qt.rgba(1, 1, 1, 0.05)
                border.width: 1
                border.color: root.liveBeat > 0.35 ? root.urgentColour : Qt.rgba(1, 1, 1, 0.14)

                RowLayout {
                    anchors.fill: parent
                    anchors.margins: 4
                    spacing: 4

                    Repeater {
                        model: [
                            { tag: "B", val: root.liveBass, col: root.accentColour },
                            { tag: "M", val: root.liveMid,  col: "#38bdf8" },
                            { tag: "H", val: root.liveHigh, col: "#c084fc" },
                            { tag: "!", val: root.liveBeat, col: root.urgentColour }
                        ]

                        delegate: ColumnLayout {
                            required property var modelData
                            Layout.fillWidth: true
                            Layout.fillHeight: true
                            spacing: 1

                            Item {
                                Layout.fillWidth: true
                                Layout.fillHeight: true

                                Rectangle {
                                    anchors.bottom: parent.bottom
                                    width: parent.width
                                    height: Math.max(2, parent.height * Math.min(1.0, parent.parent.modelData.val))
                                    radius: 2
                                    color: parent.parent.modelData.col
                                }
                            }

                            Text {
                                Layout.alignment: Qt.AlignHCenter
                                text: parent.modelData.tag
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
                    pillHeight: 28
                    onClicked: root.requestPrev()
                }

                VizPillButton {
                    text: root.playing ? "󰏤" : "󰐊"
                    active: true
                    fontSize: 14
                    horizontalPad: 10
                    pillHeight: 28
                    onClicked: root.requestPlayPause()
                }

                VizPillButton {
                    text: "󰒭"
                    fontSize: 13
                    horizontalPad: 8
                    pillHeight: 28
                    onClicked: root.requestNext()
                }

                Text {
                    text: root.formatTime(root.position) + " / " + root.formatTime(root.duration)
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 11
                    color: root.accentColour
                }
            }
        }
    }
}
