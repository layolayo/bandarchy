import QtQuick
import QtQuick.Layouts
import "PsychedelicEngine.js" as Engine

// Visualiser.qml — Multi-Coloured, Multi-Faceted Psychedelic Full-Screen
// Audio-Reactive Visualiser for Bandarchy (`io.github.layolayo.bandarchy`).
//
// Provides 12 standalone visualiser modes (Fractals, Swirls, Randomised Shapes,
// Space-Time Warp Matrix Landscape, Alien Mycelium & Bioluminescence,
// Multi-Faceted Crystal Hypercube, Sacred Mandala, Blackhole Singularity,
// Cyber SynthGrid, VHS Glitch & Matrix Rain, Album Art ASCII Matrix, and
// Cosmic Chimera Overdrive) and 10 multi-coloured palettes.
//
// The Album Art ASCII/TTE implementation is NOT fixed on top of every mode —
// it is simply one of the selectable options (Mode 10 or the toggleable
// "Album Art: OFF/ON" overlay option).

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

    // Optional Omarchy screensaver / ASCII album art properties
    property var asciiLines: []
    property var ttfxFrames: []
    property bool useAlbumArt: false
    property string asciiMode: "braille"
    property string asciiSource: "album-art"

    // Visualiser state
    property int visualMode: 0
    property int paletteIndex: 0
    property int symmetryIndex: 0
    property bool autoCycle: false
    property real sensitivity: 1.15
    property bool showHud: true
    property bool isFullscreen: false

    readonly property int symmetryFolds: Engine.SYMMETRY_OPTIONS[symmetryIndex % Engine.SYMMETRY_OPTIONS.length] || 1

    readonly property var shortModeLabels: [
        "1 Fractals",
        "2 Swirls",
        "3 Shapes",
        "4 Space-Time",
        "5 Alien",
        "6 Hypercube",
        "7 Mandala",
        "8 Blackhole",
        "9 SynthGrid",
        "0 Matrix",
        "[ Album Art",
        "] Chimera"
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
    signal requestToggleUseAlbumArt()
    signal requestToggleAsciiMode()
    signal requestLaunchTtfxScreensaver(string effectName)
    signal requestSelectTtfxEffect(string effectName)

    property var engineState: Engine.createState()

    onVisualModeChanged: {
        root.requestSelectTtfxEffect(root.currentTtfxEffect())
        vizCanvas.requestPaint()
    }

    function cycleMode(delta) {
        var count = Engine.MODE_NAMES.length
        visualMode = (visualMode + delta + count) % count
    }

    function cyclePalette(delta) {
        var count = Engine.PALETTE_NAMES.length
        paletteIndex = (paletteIndex + delta + count) % count
        vizCanvas.requestPaint()
    }

    function cycleSymmetry() {
        symmetryIndex = (symmetryIndex + 1) % Engine.SYMMETRY_OPTIONS.length
        vizCanvas.requestPaint()
    }

    function randomiseVisuals() {
        Engine.randomiseState(root.engineState)
        paletteIndex = (paletteIndex + 1 + Math.floor(Math.random() * (Engine.PALETTE_NAMES.length - 1))) % Engine.PALETTE_NAMES.length
        vizCanvas.requestPaint()
    }

    function currentTtfxEffect() {
        var map = [
            "colorshift",      // 0: Julia & Mandelbrot Fractals
            "blackhole",       // 1: Hyperspace Swirls & Vortex
            "fireworks",       // 2: Randomised Shapes & Kaleidoscope
            "synthgrid",       // 3: Space-Time Warp Matrix
            "swarm",           // 4: Alien Mycelium & Bioluminescence
            "laseretch",       // 5: Multi-Faceted Crystal Hypercube
            "rings",           // 6: Voyage 34 Sacred Mandala
            "orbittingvolley", // 7: Blackhole Singularity
            "beams",           // 8: Cyber SynthGrid & Beams
            "vhstape",         // 9: VHS Glitch & Matrix Rain
            "waves",           // 10: Album Art ASCII Matrix (TTE)
            "matrix"           // 11: Cosmic Chimera Overdrive
        ]
        return map[visualMode % map.length] || "waves"
    }

    function formatTime(sec) {
        var s = Math.max(0, Math.floor(Number(sec) || 0))
        var m = Math.floor(s / 60)
        var r = s % 60
        return m + ":" + (r < 10 ? "0" + r : r)
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
        else if (event.key === Qt.Key_C) {
            cyclePalette((event.modifiers & Qt.ShiftModifier) ? -1 : 1)
            event.accepted = true
        }
        else if (event.key === Qt.Key_K) { cycleSymmetry(); event.accepted = true }
        else if (event.key === Qt.Key_R) { randomiseVisuals(); event.accepted = true }
        else if (event.key === Qt.Key_X) { autoCycle = !autoCycle; event.accepted = true }
        else if (event.key === Qt.Key_A) { root.requestToggleUseAlbumArt(); event.accepted = true }
        else if (event.key === Qt.Key_B) { root.requestToggleAsciiMode(); event.accepted = true }
        else if (event.key === Qt.Key_T) { root.requestLaunchTtfxScreensaver(currentTtfxEffect()); event.accepted = true }
        else if (event.key === Qt.Key_H) { showHud = !showHud; event.accepted = true }
        else if (event.key === Qt.Key_Plus || event.key === Qt.Key_Equal) {
            sensitivity = Math.min(2.8, sensitivity + 0.15)
            event.accepted = true
        }
        else if (event.key === Qt.Key_Minus) {
            sensitivity = Math.max(0.35, sensitivity - 0.15)
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
            if (root.isFullscreen) root.requestToggleFullscreen()
            else root.requestCloseVisualiser()
            event.accepted = true
        }
    }

    Rectangle {
        anchors.fill: parent
        color: root.backgroundColour
    }

    // 60 FPS Render Loop
    Timer {
        interval: 16
        running: root.visible
        repeat: true
        onTriggered: vizCanvas.requestPaint()
    }

    // Auto-Morph Evolution Timer (when `autoCycle` is toggled ON)
    Timer {
        interval: 11000
        running: root.visible && root.autoCycle
        repeat: true
        onTriggered: {
            root.cycleMode(1)
            Engine.randomiseState(root.engineState)
            root.paletteIndex = (root.paletteIndex + 1) % Engine.PALETTE_NAMES.length
        }
    }

    Canvas {
        id: vizCanvas
        anchors.fill: parent
        renderTarget: Canvas.FramebufferObject
        renderStrategy: Canvas.Cooperative

        onPaint: {
            var ctx = getContext("2d")
            Engine.renderFrame(ctx, width, height, root.engineState, root.bands, {
                playing: root.playing,
                mode: root.visualMode,
                palette: root.paletteIndex,
                symmetryFolds: root.symmetryFolds,
                sensitivity: root.sensitivity,
                asciiLines: root.asciiLines,
                ttfxFrames: root.ttfxFrames,
                asciiMode: root.asciiMode,
                useAlbumArt: root.useAlbumArt,
                themeColours: {
                    accent: root.accentColour.toString(),
                    urgent: root.urgentColour.toString(),
                    foreground: root.foregroundColour.toString(),
                    background: root.backgroundColour.toString()
                }
            })
        }
    }

    // Click to focus for keyboard shortcuts; double-click toggles fullscreen
    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.LeftButton
        onClicked: root.forceActiveFocus()
        onDoubleClicked: root.requestToggleFullscreen()
    }

    // Top Omarchy HUD Bar + 12-Mode Selector Strip
    Rectangle {
        id: topHud
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 10
        height: 76
        radius: 8
        color: Qt.rgba(0.04, 0.05, 0.08, 0.86)
        border.width: 1
        border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.35)
        visible: root.showHud

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 8
            spacing: 6

            // Row 1: Primary Visualiser Controls
            RowLayout {
                Layout.fillWidth: true
                spacing: 6

                // Mode selector pill
                Rectangle {
                    Layout.preferredHeight: 26
                    Layout.preferredWidth: modeLabel.implicitWidth + 18
                    radius: 5
                    color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.18)
                    border.width: 1
                    border.color: root.accentColour

                    Text {
                        id: modeLabel
                        anchors.centerIn: parent
                        text: "󰍹 " + (Engine.MODE_NAMES[root.visualMode] || "Fractals")
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 10
                        font.bold: true
                        color: root.accentColour
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.cycleMode(1)
                    }
                }

                // Multi-coloured Palette selector pill
                Rectangle {
                    Layout.preferredHeight: 26
                    Layout.preferredWidth: palLabel.implicitWidth + 16
                    radius: 5
                    color: Qt.rgba(1, 1, 1, 0.07)
                    border.width: 1
                    border.color: Qt.rgba(1, 1, 1, 0.18)

                    Text {
                        id: palLabel
                        anchors.centerIn: parent
                        text: "󰏘 " + (Engine.PALETTE_NAMES[root.paletteIndex] || "Prism")
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 10
                        color: root.foregroundColour
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.cyclePalette(1)
                    }
                }

                // Multi-Facet Kaleidoscope Symmetry pill
                Rectangle {
                    Layout.preferredHeight: 26
                    Layout.preferredWidth: symLabel.implicitWidth + 14
                    radius: 5
                    color: root.symmetryFolds > 1
                        ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.20)
                        : Qt.rgba(1, 1, 1, 0.07)
                    border.width: 1
                    border.color: root.symmetryFolds > 1 ? root.accentColour : Qt.rgba(1, 1, 1, 0.18)

                    Text {
                        id: symLabel
                        anchors.centerIn: parent
                        text: "󰕮 Facets: " + root.symmetryFolds + "x"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 10
                        font.bold: root.symmetryFolds > 1
                        color: root.symmetryFolds > 1 ? root.accentColour : root.foregroundColour
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.cycleSymmetry()
                    }
                }

                // Randomise / Mutate Seed pill
                Rectangle {
                    Layout.preferredHeight: 26
                    Layout.preferredWidth: randLabel.implicitWidth + 14
                    radius: 5
                    color: Qt.rgba(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 0.16)
                    border.width: 1
                    border.color: root.urgentColour

                    Text {
                        id: randLabel
                        anchors.centerIn: parent
                        text: "󰒟 Mutate"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 10
                        font.bold: true
                        color: root.urgentColour
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.randomiseVisuals()
                    }
                }

                // Auto-Morph toggle pill
                Rectangle {
                    Layout.preferredHeight: 26
                    Layout.preferredWidth: autoLabel.implicitWidth + 14
                    radius: 5
                    color: root.autoCycle
                        ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.24)
                        : Qt.rgba(1, 1, 1, 0.06)
                    border.width: 1
                    border.color: root.autoCycle ? root.accentColour : Qt.rgba(1, 1, 1, 0.18)

                    Text {
                        id: autoLabel
                        anchors.centerIn: parent
                        text: root.autoCycle ? "󰑐 Auto: ON" : "󰑐 Auto: OFF"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 10
                        font.bold: root.autoCycle
                        color: root.autoCycle ? root.accentColour : root.foregroundColour
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.autoCycle = !root.autoCycle
                    }
                }

                // Optional Album Art Overlay toggle (not fixed — simply one of the options)
                Rectangle {
                    Layout.preferredHeight: 26
                    Layout.preferredWidth: albumArtToggleLabel.implicitWidth + 14
                    radius: 5
                    color: (root.useAlbumArt || root.visualMode === 10)
                        ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.24)
                        : Qt.rgba(1, 1, 1, 0.06)
                    border.width: 1
                    border.color: (root.useAlbumArt || root.visualMode === 10) ? root.accentColour : Qt.rgba(1, 1, 1, 0.18)

                    Text {
                        id: albumArtToggleLabel
                        anchors.centerIn: parent
                        text: (root.useAlbumArt || root.visualMode === 10) ? "󰀥 Album Art: ON" : "󰀥 Album Art: OFF"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 10
                        font.bold: root.useAlbumArt || root.visualMode === 10
                        color: (root.useAlbumArt || root.visualMode === 10) ? root.accentColour : root.foregroundColour
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.requestToggleUseAlbumArt()
                    }
                }

                // Braille / Block ASCII transcoding mode toggle (shown when Album Art option or Mode 10 is active)
                Rectangle {
                    Layout.preferredHeight: 26
                    Layout.preferredWidth: asciiModeLabel.implicitWidth + 14
                    radius: 5
                    visible: root.useAlbumArt || root.visualMode === 10
                    color: Qt.rgba(1, 1, 1, 0.07)
                    border.width: 1
                    border.color: Qt.rgba(1, 1, 1, 0.18)

                    Text {
                        id: asciiModeLabel
                        anchors.centerIn: parent
                        text: root.asciiMode === "block" ? "█ Block" : "⣿ Braille"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 10
                        color: root.foregroundColour
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.requestToggleAsciiMode()
                    }
                }

                Item { Layout.fillWidth: true }

                // Launch native Omarchy `ttfx` screensaver terminal
                Rectangle {
                    Layout.preferredHeight: 26
                    Layout.preferredWidth: ttfxBtnLabel.implicitWidth + 14
                    radius: 5
                    color: Qt.rgba(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 0.16)
                    border.width: 1
                    border.color: root.urgentColour

                    Text {
                        id: ttfxBtnLabel
                        anchors.centerIn: parent
                        text: "󰍹 TTE"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 10
                        font.bold: true
                        color: root.urgentColour
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.requestLaunchTtfxScreensaver(root.currentTtfxEffect())
                    }
                }

                // Fullscreen button
                Rectangle {
                    Layout.preferredHeight: 26
                    Layout.preferredWidth: fsLabel.implicitWidth + 14
                    radius: 5
                    color: Qt.rgba(1, 1, 1, 0.08)
                    border.width: 1
                    border.color: Qt.rgba(1, 1, 1, 0.2)

                    Text {
                        id: fsLabel
                        anchors.centerIn: parent
                        text: root.isFullscreen ? "󰊓 Exit" : "󰊓 Full"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 10
                        color: root.foregroundColour
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.requestToggleFullscreen()
                    }
                }
            }

            // Row 2: Direct 12-Mode Quick-Select Strip
            RowLayout {
                Layout.fillWidth: true
                spacing: 4

                Repeater {
                    model: root.shortModeLabels.length

                    delegate: Rectangle {
                        required property int index
                        readonly property bool isCurrent: root.visualMode === index
                        Layout.fillWidth: true
                        Layout.preferredHeight: 22
                        radius: 4
                        color: isCurrent
                            ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.24)
                            : Qt.rgba(1, 1, 1, 0.05)
                        border.width: 1
                        border.color: isCurrent ? root.accentColour : Qt.rgba(1, 1, 1, 0.12)

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
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                root.visualMode = index
                                root.forceActiveFocus()
                            }
                        }
                    }
                }
            }
        }
    }

    // Bottom Track & Transport HUD
    Rectangle {
        id: bottomHud
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 10
        height: 54
        radius: 8
        color: Qt.rgba(0.04, 0.05, 0.08, 0.84)
        border.width: 1
        border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.30)
        visible: root.showHud

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 12
            anchors.rightMargin: 12
            spacing: 12

            Vinyl {
                Layout.preferredWidth: 38
                Layout.preferredHeight: 38
                artPath: root.artPath
                spinning: root.playing
                accentColour: root.accentColour
                bassLevel: root.engineState ? root.engineState.bassSmooth : 0.0
            }

            ColumnLayout {
                Layout.fillWidth: true
                spacing: 2

                Text {
                    Layout.fillWidth: true
                    text: root.trackTitle || "Bandarchy Psychedelic Visualiser"
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
                          "  [Keys: 1-0/[/] Modes · C Palette · K Facets · R Mutate · X Auto · A Album Art · F Full · H HUD]"
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 10
                    color: Qt.rgba(root.foregroundColour.r, root.foregroundColour.g, root.foregroundColour.b, 0.72)
                    elide: Text.ElideRight
                }
            }

            RowLayout {
                spacing: 6

                Rectangle {
                    width: 28; height: 28; radius: 6
                    color: Qt.rgba(1, 1, 1, 0.08)
                    Text {
                        anchors.centerIn: parent
                        text: "󰒮"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 13
                        color: root.foregroundColour
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.requestPrev()
                    }
                }

                Rectangle {
                    width: 32; height: 28; radius: 6
                    color: root.accentColour
                    Text {
                        anchors.centerIn: parent
                        text: root.playing ? "󰏤" : "󰐊"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 14
                        color: "#07090e"
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.requestPlayPause()
                    }
                }

                Rectangle {
                    width: 28; height: 28; radius: 6
                    color: Qt.rgba(1, 1, 1, 0.08)
                    Text {
                        anchors.centerIn: parent
                        text: "󰒭"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 13
                        color: root.foregroundColour
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.requestNext()
                    }
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
