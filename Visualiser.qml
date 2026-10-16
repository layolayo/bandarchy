import QtQuick
import QtQuick.Layouts
import "PsychedelicEngine.js" as Engine

// Visualiser.qml — Psychedelic Full-Screen Audio-Reactive Visualiser
// Retains the Omarchy look and feel, uses the Omarchy screensaver TTE
// character matrix paradigm, and supports the "Use Album Art" option that
// translates album cover art via `omarchy-transcode-ascii` (Braille / Block)
// and manipulates the character grid live as the song plays.

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

    // Omarchy screensaver / ASCII album art properties
    property var asciiLines: []
    property var ttfxFrames: []
    property bool useAlbumArt: true
    property string asciiMode: "braille"
    property string asciiSource: "album-art"

    // Visualiser state
    property int visualMode: 0
    property int paletteIndex: 0
    property real sensitivity: 1.15
    property bool showHud: true
    property bool isFullscreen: false

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

    function currentTtfxEffect() {
        var map = ["waves", "blackhole", "beams", "rings", "vhstape", "matrix"]
        return map[visualMode % map.length] || "waves"
    }

    function formatTime(sec) {
        var s = Math.max(0, Math.floor(Number(sec) || 0))
        var m = Math.floor(s / 60)
        var r = s % 60
        return m + ":" + (r < 10 ? "0" + r : r)
    }

    Keys.onPressed: event => {
        if (event.key === Qt.Key_1) { visualMode = 0; event.accepted = true }
        else if (event.key === Qt.Key_2) { visualMode = 1; event.accepted = true }
        else if (event.key === Qt.Key_3) { visualMode = 2; event.accepted = true }
        else if (event.key === Qt.Key_4) { visualMode = 3; event.accepted = true }
        else if (event.key === Qt.Key_5) { visualMode = 4; event.accepted = true }
        else if (event.key === Qt.Key_6) { visualMode = 5; event.accepted = true }
        else if (event.key === Qt.Key_M) { cycleMode(1); event.accepted = true }
        else if (event.key === Qt.Key_C) { cyclePalette(1); event.accepted = true }
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
        else if (event.key === Qt.Key_Right) { root.requestNext(); event.accepted = true }
        else if (event.key === Qt.Key_Left) { root.requestPrev(); event.accepted = true }
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

    Timer {
        interval: 16
        running: root.visible
        repeat: true
        onTriggered: vizCanvas.requestPaint()
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

    // Subtle double-click anywhere on canvas toggles fullscreen
    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.LeftButton
        onClicked: root.forceActiveFocus()
        onDoubleClicked: root.requestToggleFullscreen()
    }

    // Top Omarchy HUD Bar
    Rectangle {
        id: topHud
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 12
        height: 44
        radius: 8
        color: Qt.rgba(0.04, 0.05, 0.08, 0.84)
        border.width: 1
        border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.35)
        visible: root.showHud

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 12
            anchors.rightMargin: 12
            spacing: 8

            // Mode selector pill
            Rectangle {
                Layout.preferredHeight: 28
                Layout.preferredWidth: modeLabel.implicitWidth + 20
                radius: 6
                color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.16)
                border.width: 1
                border.color: root.accentColour

                Text {
                    id: modeLabel
                    anchors.centerIn: parent
                    text: "Auto  " + (Engine.MODE_NAMES[root.visualMode] || "TTE Waves")
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 11
                    font.bold: true
                    color: root.accentColour
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.cycleMode(1)
                }
            }

            // Palette selector pill
            Rectangle {
                Layout.preferredHeight: 28
                Layout.preferredWidth: palLabel.implicitWidth + 18
                radius: 6
                color: Qt.rgba(1, 1, 1, 0.07)
                border.width: 1
                border.color: Qt.rgba(1, 1, 1, 0.18)

                Text {
                    id: palLabel
                    anchors.centerIn: parent
                    text: "󰏘 " + (Engine.PALETTE_NAMES[root.paletteIndex] || "Omarchy")
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 11
                    color: root.foregroundColour
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.cyclePalette(1)
                }
            }

            // Use Album Art toggle (Requirement #3: "use album art" option)
            Rectangle {
                Layout.preferredHeight: 28
                Layout.preferredWidth: albumArtToggleLabel.implicitWidth + 18
                radius: 6
                color: root.useAlbumArt
                    ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.24)
                    : Qt.rgba(1, 1, 1, 0.06)
                border.width: 1
                border.color: root.useAlbumArt ? root.accentColour : Qt.rgba(1, 1, 1, 0.18)

                Text {
                    id: albumArtToggleLabel
                    anchors.centerIn: parent
                    text: root.useAlbumArt ? "󰀥 Use Album Art: ON" : "󰀥 Use Album Art: OFF"
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 11
                    font.bold: root.useAlbumArt
                    color: root.useAlbumArt ? root.accentColour : root.foregroundColour
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.requestToggleUseAlbumArt()
                }
            }

            // Braille / Block ASCII transcoding mode toggle
            Rectangle {
                Layout.preferredHeight: 28
                Layout.preferredWidth: asciiModeLabel.implicitWidth + 16
                radius: 6
                visible: root.useAlbumArt
                color: Qt.rgba(1, 1, 1, 0.07)
                border.width: 1
                border.color: Qt.rgba(1, 1, 1, 0.18)

                Text {
                    id: asciiModeLabel
                    anchors.centerIn: parent
                    text: root.asciiMode === "block" ? "█ Block Art" : "⣿ Braille Art"
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 11
                    color: root.foregroundColour
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.requestToggleAsciiMode()
                }
            }

            // Launch native Omarchy `ttfx` screensaver terminal with transcoded album art
            Rectangle {
                Layout.preferredHeight: 28
                Layout.preferredWidth: ttfxBtnLabel.implicitWidth + 16
                radius: 6
                color: Qt.rgba(root.urgentColour.r, root.urgentColour.g, root.urgentColour.b, 0.18)
                border.width: 1
                border.color: root.urgentColour

                Text {
                    id: ttfxBtnLabel
                    anchors.centerIn: parent
                    text: "󰍹 TTE Screensaver"
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 11
                    font.bold: true
                    color: root.urgentColour
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.requestLaunchTtfxScreensaver(root.currentTtfxEffect())
                }
            }

            Item { Layout.fillWidth: true }

            // Fullscreen button
            Rectangle {
                Layout.preferredHeight: 28
                Layout.preferredWidth: fsLabel.implicitWidth + 16
                radius: 6
                color: Qt.rgba(1, 1, 1, 0.08)
                border.width: 1
                border.color: Qt.rgba(1, 1, 1, 0.2)

                Text {
                    id: fsLabel
                    anchors.centerIn: parent
                    text: root.isFullscreen ? "󰊓 Exit Fullscreen" : "󰊓 Fullscreen"
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 11
                    color: root.foregroundColour
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.requestToggleFullscreen()
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
        anchors.margins: 12
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
                    text: root.trackTitle || "Omarchy Psychedelic Visualiser"
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
                          "  [Keys: 1-6 Mode · A Album Art · B Braille/Block · C Palette · T ttfx · F Fullscreen · H HUD]"
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
