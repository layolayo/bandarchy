import QtQuick
import QtQuick.Layouts
import QtQuick.Window
import Quickshell

// App.qml — Dedicated Standalone Bandarchy Desktop Player & Psychedelic Visualiser
// Launch with: quickshell -p /path/to/App.qml (or `bandarchy-player`)

ShellRoot {
    id: shellRoot

    Service {
        id: service
        visualiserActive: true
    }

    FloatingWindow {
        id: win
        title: "Bandarchy — Bandcamp & Local Lossless Player"
        implicitWidth: 1180
        implicitHeight: 740
        minimumSize: Qt.size(860, 560)
        color: "#07090e"
        visible: true

        property color colBg: "#07090e"
        property color colFg: "#e2e8f0"
        property color colAccent: "#6ee7b7"
        property color colUrgent: "#f472b6"
        property color colSurface: "#111622"
        property color colBorder: "#242e42"
        property color colMuted: "#94a3b8"

        property int leftTab: 0 // 0: Library, 1: Playlists & Radio, 2: Sync & Zips
        property string selectedAlbumId: ""
        property string selectedPlaylistId: ""
        property bool visualiserMaximised: false

        function formatDuration(sec) {
            var s = Math.max(0, Math.floor(Number(sec) || 0))
            var m = Math.floor(s / 60)
            var r = s % 60
            return m + ":" + (r < 10 ? "0" + r : r)
        }

        Rectangle {
            anchors.fill: parent
            color: win.colBg

            ColumnLayout {
                anchors.fill: parent
                anchors.margins: win.visualiserMaximised ? 0 : 12
                spacing: win.visualiserMaximised ? 0 : 10

                // Top Header Bar (hidden when visualiser is maximised)
                RowLayout {
                    Layout.fillWidth: true
                    visible: !win.visualiserMaximised
                    spacing: 10

                    Rectangle {
                        width: 30; height: 30; radius: 6
                        color: "#122b26"
                        border.width: 1
                        border.color: win.colAccent
                        Text {
                            anchors.centerIn: parent
                            text: "󰀥"
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 16
                            color: win.colAccent
                        }
                    }

                    ColumnLayout {
                        spacing: 0
                        Text {
                            text: "BANDARCHY · DEDICATED PLAYER & OMARCHY VISUALISER"
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 13
                            font.bold: true
                            color: win.colFg
                        }
                        Text {
                            text: (service.username ? ("@" + service.username + " · ") : "") +
                                  service.purchasedCount + " Purchased · " +
                                  service.localCount + " Local (" + service.trackCount + " tracks)"
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 10
                            color: win.colMuted
                        }
                    }

                    Item { Layout.fillWidth: true }

                    Repeater {
                        model: [
                            { idx: 0, label: "󰲸 Collection" },
                            { idx: 1, label: "󰐑 Intelligent & Custom Playlists" },
                            { idx: 2, label: "󰒓 Sync & ZIP Import" }
                        ]

                        delegate: Rectangle {
                            required property var modelData
                            Layout.preferredHeight: 28
                            Layout.preferredWidth: tLbl.implicitWidth + 18
                            radius: 6
                            color: win.leftTab === modelData.idx ? "#15322c" : win.colSurface
                            border.width: 1
                            border.color: win.leftTab === modelData.idx ? win.colAccent : win.colBorder

                            Text {
                                id: tLbl
                                anchors.centerIn: parent
                                text: modelData.label
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 11
                                font.bold: win.leftTab === modelData.idx
                                color: win.leftTab === modelData.idx ? win.colAccent : win.colFg
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: win.leftTab = modelData.idx
                            }
                        }
                    }
                }

                // Main Split Area: Left Browser + Right Psychedelic Visualiser
                RowLayout {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    spacing: win.visualiserMaximised ? 0 : 12

                    // Left Pane (hidden when visualiser is maximised)
                    Rectangle {
                        Layout.preferredWidth: 520
                        Layout.fillHeight: true
                        visible: !win.visualiserMaximised
                        radius: 8
                        color: win.colSurface
                        border.width: 1
                        border.color: win.colBorder
                        clip: true

                        ColumnLayout {
                            anchors.fill: parent
                            anchors.margins: 10
                            spacing: 8

                            // Left Tab 0: Collection & Search
                            ColumnLayout {
                                Layout.fillWidth: true
                                Layout.fillHeight: true
                                visible: win.leftTab === 0
                                spacing: 8

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 6

                                    Rectangle {
                                        Layout.fillWidth: true
                                        Layout.preferredHeight: 30
                                        radius: 6
                                        color: "#0b0f17"
                                        border.width: 1
                                        border.color: appSearch.activeFocus ? win.colAccent : win.colBorder

                                        TextInput {
                                            id: appSearch
                                            anchors.fill: parent
                                            anchors.leftMargin: 10
                                            anchors.rightMargin: 10
                                            verticalAlignment: Text.AlignVCenter
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 11
                                            color: win.colFg
                                            onTextEdited: service.loadCollection(service.activeScope, text)

                                            Text {
                                                anchors.fill: parent
                                                verticalAlignment: Text.AlignVCenter
                                                text: "Search Bandcamp purchases or local albums…"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 11
                                                color: win.colMuted
                                                visible: !appSearch.text && !appSearch.activeFocus
                                            }
                                        }
                                    }

                                    Repeater {
                                        model: ["all", "purchased", "local", "cloud"]
                                        delegate: Rectangle {
                                            required property string modelData
                                            property bool active: service.activeScope === modelData
                                            Layout.preferredHeight: 30
                                            Layout.preferredWidth: scTxt.implicitWidth + 14
                                            radius: 6
                                            color: active ? "#15322c" : "#0b0f17"
                                            border.width: 1
                                            border.color: active ? win.colAccent : win.colBorder
                                            Text {
                                                id: scTxt
                                                anchors.centerIn: parent
                                                text: modelData.charAt(0).toUpperCase() + modelData.slice(1)
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                font.bold: parent.active
                                                color: parent.active ? win.colAccent : win.colFg
                                            }
                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: service.loadCollection(modelData, appSearch.text)
                                            }
                                        }
                                    }
                                }

                                ListView {
                                    Layout.fillWidth: true
                                    Layout.fillHeight: true
                                    clip: true
                                    spacing: 5
                                    model: service.albums

                                    delegate: Rectangle {
                                        required property var modelData
                                        width: ListView.view.width
                                        height: 54
                                        radius: 6
                                        color: service.albumId === modelData.id ? "#15322c" : "#0b0f17"
                                        border.width: 1
                                        border.color: service.albumId === modelData.id ? win.colAccent : win.colBorder

                                        RowLayout {
                                            anchors.fill: parent
                                            anchors.margins: 6
                                            spacing: 8

                                            ColumnLayout {
                                                Layout.fillWidth: true
                                                spacing: 2
                                                Text {
                                                    Layout.fillWidth: true
                                                    text: modelData.title || "Album"
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 11
                                                    font.bold: true
                                                    color: win.colFg
                                                    elide: Text.ElideRight
                                                }
                                                Text {
                                                    Layout.fillWidth: true
                                                    text: (modelData.artist || "") +
                                                          (modelData.purchased ? " · [PURCHASED]" : "") +
                                                          (modelData.isLocal ? " · [LOCAL]" : " · [STREAM]")
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 10
                                                    color: modelData.purchased ? win.colAccent : win.colMuted
                                                    elide: Text.ElideRight
                                                }
                                            }

                                            Rectangle {
                                                visible: !modelData.isLocal && Boolean(modelData.purchased || modelData.tralbumId || modelData.url)
                                                width: 68; height: 26; radius: 5
                                                color: "#15322c"
                                                border.width: 1
                                                border.color: win.colAccent
                                                Text {
                                                    anchors.centerIn: parent
                                                    text: (service.downloading && service.downloadingAlbumId === modelData.id) ? "󰇚 Sync…" : "󰇚 Download"
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 10
                                                    color: win.colAccent
                                                }
                                                MouseArea {
                                                    anchors.fill: parent
                                                    cursorShape: Qt.PointingHandCursor
                                                    onClicked: service.downloadAlbum(modelData.id)
                                                }
                                            }

                                            Rectangle {
                                                width: 56; height: 26; radius: 5
                                                color: win.colAccent
                                                Text {
                                                    anchors.centerIn: parent
                                                    text: modelData.isLocal ? "󰐊 Play" : "󰐊 Stream"
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 10
                                                    font.bold: true
                                                    color: "#07090e"
                                                }
                                                MouseArea {
                                                    anchors.fill: parent
                                                    cursorShape: Qt.PointingHandCursor
                                                    onClicked: service.playAlbum(modelData.id, 0, "auto", false)
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // Left Tab 1: Intelligent & Custom Playlists
                            ColumnLayout {
                                Layout.fillWidth: true
                                Layout.fillHeight: true
                                visible: win.leftTab === 1
                                spacing: 8

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 6

                                    Text {
                                        Layout.fillWidth: true
                                        text: "Auto  Intelligent Mix (From Last Track Played)"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 11
                                        font.bold: true
                                        color: win.colAccent
                                    }

                                    Rectangle {
                                        width: 68; height: 24; radius: 5
                                        color: win.colAccent
                                        Text {
                                            anchors.centerIn: parent
                                            text: "󰐊 Play Mix"
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 10
                                            font.bold: true
                                            color: "#07090e"
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: service.playSmartPlaylist(service.smartPreset, "")
                                        }
                                    }

                                    Rectangle {
                                        width: 64; height: 24; radius: 5
                                        color: "#15322c"
                                        border.width: 1
                                        border.color: win.colAccent
                                        Text {
                                            anchors.centerIn: parent
                                            text: "󰆓 Save"
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 10
                                            color: win.colAccent
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: {
                                                var title = (service.smartPlaylist && service.smartPlaylist.title) || "Intelligent Mix"
                                                service.saveSmartPlaylistAs(title, service.smartPreset, "")
                                            }
                                        }
                                    }
                                }

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 4
                                    Repeater {
                                        model: ["radio", "kindred", "journey", "purchased"]
                                        delegate: Rectangle {
                                            required property string modelData
                                            property bool active: service.smartPreset === modelData
                                            Layout.fillWidth: true
                                            Layout.preferredHeight: 24
                                            radius: 4
                                            color: active ? "#15322c" : "#0b0f17"
                                            border.width: 1
                                            border.color: active ? win.colAccent : win.colBorder
                                            Text {
                                                anchors.centerIn: parent
                                                text: modelData.toUpperCase()
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 9
                                                font.bold: parent.active
                                                color: parent.active ? win.colAccent : win.colFg
                                            }
                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: service.refreshSmartPlaylist(modelData, "")
                                            }
                                        }
                                    }
                                }

                                ListView {
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 165
                                    clip: true
                                    spacing: 3
                                    model: (service.smartPlaylist && service.smartPlaylist.tracks) ? service.smartPlaylist.tracks : []

                                    delegate: Rectangle {
                                        required property var modelData
                                        required property int index
                                        width: ListView.view.width
                                        height: 24
                                        radius: 4
                                        color: "#0b0f17"
                                        RowLayout {
                                            anchors.fill: parent
                                            anchors.leftMargin: 6
                                            anchors.rightMargin: 6
                                            Text {
                                                Layout.fillWidth: true
                                                text: (index + 1) + ". " + (modelData.title || "") + " — " + (modelData.artist || "")
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                color: index === 0 ? win.colAccent : win.colFg
                                                elide: Text.ElideRight
                                            }
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: service.playSmartPlaylist(service.smartPreset, "", index)
                                        }
                                    }
                                }

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 6

                                    Text {
                                        text: "󰐑 Custom Playlists (" + service.playlists.length + ")"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 11
                                        font.bold: true
                                        color: win.colFg
                                    }

                                    Rectangle {
                                        Layout.fillWidth: true
                                        Layout.preferredHeight: 24
                                        radius: 4
                                        color: "#0b0f17"
                                        border.width: 1
                                        border.color: appNewPlaylist.activeFocus ? win.colAccent : win.colBorder

                                        TextInput {
                                            id: appNewPlaylist
                                            anchors.fill: parent
                                            anchors.leftMargin: 6
                                            anchors.rightMargin: 6
                                            verticalAlignment: Text.AlignVCenter
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 10
                                            color: win.colFg
                                            clip: true

                                            Text {
                                                anchors.fill: parent
                                                verticalAlignment: Text.AlignVCenter
                                                text: "New playlist name…"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 9
                                                color: win.colMuted
                                                visible: !appNewPlaylist.text && !appNewPlaylist.activeFocus
                                            }
                                        }
                                    }

                                    Rectangle {
                                        width: 58; height: 24; radius: 4
                                        color: win.colAccent
                                        Text {
                                            anchors.centerIn: parent
                                            text: "+ Create"
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 9
                                            font.bold: true
                                            color: "#07090e"
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: {
                                                var t = appNewPlaylist.text.trim()
                                                if (!t) t = "Custom Mix " + (service.playlists.length + 1)
                                                service.createPlaylist(t, "User playlist", "", service.albumId, "")
                                                appNewPlaylist.text = ""
                                            }
                                        }
                                    }
                                }

                                ListView {
                                    Layout.fillWidth: true
                                    Layout.fillHeight: true
                                    clip: true
                                    spacing: 4
                                    model: service.playlists

                                    delegate: Rectangle {
                                        required property var modelData
                                        width: ListView.view.width
                                        height: 32
                                        radius: 5
                                        color: "#0b0f17"
                                        border.width: 1
                                        border.color: win.colBorder

                                        RowLayout {
                                            anchors.fill: parent
                                            anchors.leftMargin: 8
                                            anchors.rightMargin: 8
                                            Text {
                                                Layout.fillWidth: true
                                                text: (modelData.title || "Playlist") + " (" + (modelData.trackCount || 0) + " tracks)"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                color: win.colFg
                                                elide: Text.ElideRight
                                            }
                                            Rectangle {
                                                width: 48; height: 22; radius: 4
                                                color: win.colAccent
                                                Text {
                                                    anchors.centerIn: parent
                                                    text: "󰐊 Play"
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 9
                                                    font.bold: true
                                                    color: "#07090e"
                                                }
                                                MouseArea {
                                                    anchors.fill: parent
                                                    cursorShape: Qt.PointingHandCursor
                                                    onClicked: service.playPlaylist(modelData.id, 0, false)
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // Left Tab 2: Sync & ZIP Import
                            ColumnLayout {
                                Layout.fillWidth: true
                                Layout.fillHeight: true
                                visible: win.leftTab === 2
                                spacing: 10

                                Text {
                                    text: "Bandcamp Collection & Local Sync"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 12
                                    font.bold: true
                                    color: win.colAccent
                                }

                                RowLayout {
                                    spacing: 8
                                    Rectangle {
                                        width: 140; height: 30; radius: 6
                                        color: win.colAccent
                                        Text {
                                            anchors.centerIn: parent
                                            text: "󰑐 Sync Collection"
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 11
                                            font.bold: true
                                            color: "#07090e"
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: service.syncCollection(false)
                                        }
                                    }

                                    Rectangle {
                                        width: 160; height: 30; radius: 6
                                        color: "#15322c"
                                        border.width: 1
                                        border.color: win.colAccent
                                        Text {
                                            anchors.centerIn: parent
                                            text: "󰗄 Import Downloads ZIPs"
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 11
                                            color: win.colAccent
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: service.importZips()
                                        }
                                    }
                                }

                                Item { Layout.fillHeight: true }
                            }
                        }
                    }

                    // Right Pane: Psychedelic Omarchy Screensaver Visualiser
                    Rectangle {
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        radius: win.visualiserMaximised ? 0 : 8
                        color: win.colBg
                        border.width: win.visualiserMaximised ? 0 : 1
                        border.color: win.colBorder
                        clip: true

                        Visualiser {
                            anchors.fill: parent
                            focus: true
                            isFullscreen: win.visualiserMaximised
                            bands: service.spectrumBands
                            playing: service.activelyPlaying
                            trackTitle: service.trackTitle
                            trackArtist: service.trackArtist
                            trackAlbum: service.trackAlbum
                            artPath: service.artPath
                            playSource: service.playSource
                            position: service.position
                            duration: service.duration
                            asciiLines: service.asciiLines
                            ttfxFrames: service.ttfxFrames
                            useAlbumArt: service.useAlbumArt
                            asciiMode: service.asciiMode
                            asciiSource: service.asciiSource
                            accentColour: win.colAccent
                            urgentColour: win.colUrgent
                            foregroundColour: win.colFg
                            backgroundColour: win.colBg

                            onRequestToggleFullscreen: {
                                win.visualiserMaximised = !win.visualiserMaximised
                            }
                            onRequestCloseVisualiser: {
                                win.visualiserMaximised = false
                            }
                            onRequestPlayPause: service.togglePlayPause()
                            onRequestNext: service.nextTrack()
                            onRequestPrev: service.prevTrack()
                            onRequestToggleUseAlbumArt: service.toggleUseAlbumArt()
                            onRequestToggleAsciiMode: service.toggleAsciiMode()
                            onRequestLaunchTtfxScreensaver: effectName => {
                                service.launchTtfxScreensaver(effectName)
                            }
                            onRequestSelectTtfxEffect: effectName => {
                                service.setTtfxEffect(effectName)
                            }
                        }
                    }
                }
            }
        }
    }
}
