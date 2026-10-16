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

        // Keyboard navigation state
        property int focusedAlbumIndex: 0
        property int focusedTrackIndex: -1
        property int focusedSmartTrackIndex: 0
        property int focusedPlaylistIndex: 0
        property int playlistPaneFocus: 0 // 0: Intelligent Mix, 1: Custom Playlists

        function formatDuration(sec) {
            var s = Math.max(0, Math.floor(Number(sec) || 0))
            var m = Math.floor(s / 60)
            var r = s % 60
            return m + ":" + (r < 10 ? "0" + r : r)
        }

        function toggleAlbumExpand(albumId, albumIdx) {
            if (albumIdx !== undefined && albumIdx >= 0) {
                win.focusedAlbumIndex = albumIdx
            }
            if (win.selectedAlbumId === albumId) {
                win.selectedAlbumId = ""
                win.focusedTrackIndex = -1
            } else {
                win.selectedAlbumId = albumId
                win.focusedTrackIndex = 0
                service.ensureAlbumTracks(albumId)
            }
        }

        function handleKeyNavigation(event) {
            if (appSearch.activeFocus || appNewPlaylist.activeFocus) {
                if (event.key === Qt.Key_Escape || event.key === Qt.Key_Down || event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                    if (appSearch.activeFocus && (event.key === Qt.Key_Down || event.key === Qt.Key_Return || event.key === Qt.Key_Enter)) {
                        win.focusedAlbumIndex = 0
                        win.focusedTrackIndex = -1
                    }
                    appRootRect.forceActiveFocus()
                    event.accepted = true
                }
                return
            }

            if (win.visualiserMaximised) return

            if (event.key === Qt.Key_Slash) {
                win.leftTab = 0
                appSearch.forceActiveFocus()
                appSearch.selectAll()
                event.accepted = true
                return
            }
            if (event.key === Qt.Key_Tab) {
                win.leftTab = (win.leftTab + 1) % 3
                appRootRect.forceActiveFocus()
                event.accepted = true
                return
            }
            if (event.key === Qt.Key_Backtab) {
                win.leftTab = (win.leftTab + 2) % 3
                appRootRect.forceActiveFocus()
                event.accepted = true
                return
            }

            if (win.leftTab === 0) {
                var albums = service.albums || []
                if (albums.length === 0) return
                var curIdx = Math.max(0, Math.min(albums.length - 1, win.focusedAlbumIndex))
                win.focusedAlbumIndex = curIdx
                var curAlbum = albums[curIdx]
                var tracks = (curAlbum && curAlbum.tracks) ? curAlbum.tracks : []
                var isExpanded = curAlbum && win.selectedAlbumId === curAlbum.id

                if (event.key === Qt.Key_Down || event.key === Qt.Key_J) {
                    if (isExpanded && tracks.length > 0 && win.focusedTrackIndex < tracks.length - 1) {
                        win.focusedTrackIndex = win.focusedTrackIndex + 1
                    } else if (curIdx < albums.length - 1) {
                        win.focusedAlbumIndex = curIdx + 1
                        win.focusedTrackIndex = -1
                        appAlbumList.positionViewAtIndex(win.focusedAlbumIndex, ListView.Contain)
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Up || event.key === Qt.Key_K) {
                    if (isExpanded && win.focusedTrackIndex >= 0) {
                        win.focusedTrackIndex = win.focusedTrackIndex - 1
                    } else if (curIdx > 0) {
                        win.focusedAlbumIndex = curIdx - 1
                        var prevAlb = albums[win.focusedAlbumIndex]
                        if (prevAlb && win.selectedAlbumId === prevAlb.id && prevAlb.tracks && prevAlb.tracks.length > 0) {
                            win.focusedTrackIndex = prevAlb.tracks.length - 1
                        } else {
                            win.focusedTrackIndex = -1
                        }
                        appAlbumList.positionViewAtIndex(win.focusedAlbumIndex, ListView.Contain)
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Right || event.key === Qt.Key_L) {
                    if (curAlbum) {
                        if (!isExpanded) {
                            win.selectedAlbumId = curAlbum.id
                            win.focusedTrackIndex = 0
                            service.ensureAlbumTracks(curAlbum.id)
                        } else if (win.focusedTrackIndex < 0 && tracks.length > 0) {
                            win.focusedTrackIndex = 0
                        }
                        appAlbumList.positionViewAtIndex(curIdx, ListView.Contain)
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Left || event.key === Qt.Key_H || event.key === Qt.Key_Backspace) {
                    if (isExpanded) {
                        if (win.focusedTrackIndex >= 0) {
                            win.focusedTrackIndex = -1
                        } else {
                            win.selectedAlbumId = ""
                        }
                        event.accepted = true
                    }
                } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                    if (!curAlbum) return
                    if (event.modifiers & Qt.ShiftModifier) {
                        service.playAlbum(curAlbum.id, Math.max(0, win.focusedTrackIndex), "auto", false)
                    } else if (isExpanded && win.focusedTrackIndex >= 0) {
                        service.playAlbum(curAlbum.id, win.focusedTrackIndex, "auto", false)
                    } else {
                        win.toggleAlbumExpand(curAlbum.id, curIdx)
                        appAlbumList.positionViewAtIndex(curIdx, ListView.Contain)
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_P) {
                    if (curAlbum) {
                        service.playAlbum(curAlbum.id, Math.max(0, win.focusedTrackIndex), "auto", false)
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Escape) {
                    if (win.selectedAlbumId !== "") {
                        win.selectedAlbumId = ""
                        win.focusedTrackIndex = -1
                        event.accepted = true
                    }
                }
            } else if (win.leftTab === 1) {
                var smartTracks = (service.smartPlaylist && service.smartPlaylist.tracks) ? service.smartPlaylist.tracks : []
                var customPls = service.playlists || []
                if (event.key === Qt.Key_Left || event.key === Qt.Key_H) {
                    win.playlistPaneFocus = 0
                    event.accepted = true
                } else if (event.key === Qt.Key_Right || event.key === Qt.Key_L) {
                    win.playlistPaneFocus = 1
                    event.accepted = true
                } else if (event.key === Qt.Key_Down || event.key === Qt.Key_J) {
                    if (win.playlistPaneFocus === 0 && smartTracks.length > 0) {
                        win.focusedSmartTrackIndex = Math.min(smartTracks.length - 1, win.focusedSmartTrackIndex + 1)
                    } else if (win.playlistPaneFocus === 1 && customPls.length > 0) {
                        win.focusedPlaylistIndex = Math.min(customPls.length - 1, win.focusedPlaylistIndex + 1)
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Up || event.key === Qt.Key_K) {
                    if (win.playlistPaneFocus === 0 && smartTracks.length > 0) {
                        win.focusedSmartTrackIndex = Math.max(0, win.focusedSmartTrackIndex - 1)
                    } else if (win.playlistPaneFocus === 1 && customPls.length > 0) {
                        win.focusedPlaylistIndex = Math.max(0, win.focusedPlaylistIndex - 1)
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                    if (win.playlistPaneFocus === 0 && smartTracks.length > 0) {
                        service.playSmartPlaylist(service.smartPreset, "", win.focusedSmartTrackIndex)
                    } else if (win.playlistPaneFocus === 1 && customPls.length > 0) {
                        var pl = customPls[win.focusedPlaylistIndex]
                        if (pl) {
                            if (event.modifiers & Qt.ShiftModifier) {
                                service.playPlaylist(pl.id, 0, false)
                            } else {
                                win.selectedPlaylistId = (win.selectedPlaylistId === pl.id) ? "" : pl.id
                            }
                        }
                    }
                    event.accepted = true
                }
            }

            if (!event.accepted) {
                if (event.key === Qt.Key_1) { appVisualiser.visualMode = 0; event.accepted = true }
                else if (event.key === Qt.Key_2) { appVisualiser.visualMode = 1; event.accepted = true }
                else if (event.key === Qt.Key_3) { appVisualiser.visualMode = 2; event.accepted = true }
                else if (event.key === Qt.Key_4) { appVisualiser.visualMode = 3; event.accepted = true }
                else if (event.key === Qt.Key_5) { appVisualiser.visualMode = 4; event.accepted = true }
                else if (event.key === Qt.Key_6) { appVisualiser.visualMode = 5; event.accepted = true }
                else if (event.key === Qt.Key_7) { appVisualiser.visualMode = 6; event.accepted = true }
                else if (event.key === Qt.Key_8) { appVisualiser.visualMode = 7; event.accepted = true }
                else if (event.key === Qt.Key_9) { appVisualiser.visualMode = 8; event.accepted = true }
                else if (event.key === Qt.Key_0) { appVisualiser.visualMode = 9; event.accepted = true }
                else if (event.key === Qt.Key_BracketLeft) { appVisualiser.visualMode = 10; event.accepted = true }
                else if (event.key === Qt.Key_BracketRight) { appVisualiser.visualMode = 11; event.accepted = true }
                else if (event.key === Qt.Key_M) { appVisualiser.cycleMode((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
                else if (event.key === Qt.Key_C) { appVisualiser.cyclePalette((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
                else if (event.key === Qt.Key_R) { appVisualiser.randomiseVisuals(); event.accepted = true }
                else if (event.key === Qt.Key_X) { appVisualiser.autoCycle = !appVisualiser.autoCycle; event.accepted = true }
                else if (event.key === Qt.Key_A) { service.toggleUseAlbumArt(); event.accepted = true }
                else if (event.key === Qt.Key_B) { service.toggleAsciiMode(); event.accepted = true }
                else if (event.key === Qt.Key_T) { service.launchTtfxScreensaver(appVisualiser.currentTtfxEffect()); event.accepted = true }
                else if (event.key === Qt.Key_F || event.key === Qt.Key_V) { win.visualiserMaximised = !win.visualiserMaximised; event.accepted = true }
                else if (event.key === Qt.Key_Space) { service.togglePlayPause(); event.accepted = true }
                else if (event.key === Qt.Key_N) { service.nextTrack(); event.accepted = true }
            }
        }

        Rectangle {
            id: appRootRect
            anchors.fill: parent
            color: win.colBg
            focus: !win.visualiserMaximised
            Keys.onPressed: event => win.handleKeyNavigation(event)

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
                                onClicked: {
                                    win.leftTab = modelData.idx
                                    appRootRect.forceActiveFocus()
                                }
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
                                spacing: 6

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
                                            selectByMouse: true
                                            onTextEdited: {
                                                win.focusedAlbumIndex = 0
                                                win.focusedTrackIndex = -1
                                                service.loadCollection(service.activeScope, text)
                                            }
                                            Keys.onPressed: event => win.handleKeyNavigation(event)

                                            Text {
                                                anchors.fill: parent
                                                verticalAlignment: Text.AlignVCenter
                                                text: "Search Bandcamp purchases or local albums… (/)"
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
                                                onClicked: {
                                                    win.focusedAlbumIndex = 0
                                                    win.focusedTrackIndex = -1
                                                    service.loadCollection(modelData, appSearch.text)
                                                    appRootRect.forceActiveFocus()
                                                }
                                            }
                                        }
                                    }
                                }

                                // Keyboard navigation hint bar
                                Text {
                                    Layout.fillWidth: true
                                    text: "󰌌 Keys: ↑↓/jk Navigate · Enter/→ Open Tracks & Play · ←/Esc Collapse · Shift+Enter Play Album · / Search"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 9
                                    color: win.colMuted
                                    elide: Text.ElideRight
                                }

                                ListView {
                                    id: appAlbumList
                                    Layout.fillWidth: true
                                    Layout.fillHeight: true
                                    clip: true
                                    spacing: 5
                                    model: service.albums

                                    delegate: Rectangle {
                                        id: appAlbumCard
                                        required property var modelData
                                        required property int index
                                        readonly property bool expanded: win.selectedAlbumId === modelData.id
                                        readonly property bool isCurrentAlbum: service.albumId === modelData.id
                                        readonly property bool isKeyboardFocused: win.focusedAlbumIndex === index
                                        readonly property var tracksList: modelData.tracks || []

                                        width: ListView.view.width
                                        height: expanded ? (58 + Math.min(Math.max(tracksList.length, 1), 8) * 26 + 12) : 56
                                        radius: 6
                                        color: isCurrentAlbum
                                            ? "#15322c"
                                            : (isKeyboardFocused ? "#112224" : "#0b0f17")
                                        border.width: (isCurrentAlbum || isKeyboardFocused || expanded) ? 1.5 : 1
                                        border.color: (isCurrentAlbum || isKeyboardFocused || expanded) ? win.colAccent : win.colBorder

                                        ColumnLayout {
                                            anchors.fill: parent
                                            anchors.margins: 6
                                            spacing: 4

                                            RowLayout {
                                                Layout.fillWidth: true
                                                Layout.preferredHeight: 42
                                                spacing: 8

                                                // Cover Art thumbnail
                                                Rectangle {
                                                    Layout.preferredWidth: 40
                                                    Layout.preferredHeight: 40
                                                    radius: 5
                                                    color: "#121620"
                                                    border.width: 1
                                                    border.color: win.colBorder
                                                    clip: true

                                                    Image {
                                                        id: appArtThumb
                                                        anchors.fill: parent
                                                        source: modelData.artPath ? ("file://" + modelData.artPath) : ""
                                                        fillMode: Image.PreserveAspectCrop
                                                        asynchronous: true
                                                        visible: status === Image.Ready
                                                    }

                                                    Text {
                                                        anchors.centerIn: parent
                                                        visible: appArtThumb.status !== Image.Ready
                                                        text: "󰀥"
                                                        textFormat: Text.PlainText
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 15
                                                        color: win.colAccent
                                                    }

                                                    MouseArea {
                                                        anchors.fill: parent
                                                        cursorShape: Qt.PointingHandCursor
                                                        onClicked: {
                                                            win.focusedAlbumIndex = appAlbumCard.index
                                                            service.playAlbum(modelData.id, 0, "auto", false)
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }
                                                }

                                                // Album title & artist (click to expand/collapse tracks)
                                                Item {
                                                    Layout.fillWidth: true
                                                    Layout.preferredHeight: 40

                                                    ColumnLayout {
                                                        anchors.fill: parent
                                                        spacing: 2
                                                        Text {
                                                            Layout.fillWidth: true
                                                            text: modelData.title || "Album"
                                                            textFormat: Text.PlainText
                                                            font.family: "JetBrainsMono Nerd Font"
                                                            font.pixelSize: 11
                                                            font.bold: true
                                                            color: appAlbumCard.isKeyboardFocused ? win.colAccent : win.colFg
                                                            elide: Text.ElideRight
                                                        }
                                                        Text {
                                                            Layout.fillWidth: true
                                                            text: (modelData.artist || "") +
                                                                  " · " + (modelData.numTracks || tracksList.length || 0) + " tracks" +
                                                                  (modelData.purchased ? " · [PURCHASED]" : "") +
                                                                  (modelData.isLocal ? " · [LOCAL]" : " · [STREAM]")
                                                            textFormat: Text.PlainText
                                                            font.family: "JetBrainsMono Nerd Font"
                                                            font.pixelSize: 10
                                                            color: modelData.purchased ? win.colAccent : win.colMuted
                                                            elide: Text.ElideRight
                                                        }
                                                    }

                                                    MouseArea {
                                                        anchors.fill: parent
                                                        cursorShape: Qt.PointingHandCursor
                                                        onClicked: {
                                                            win.toggleAlbumExpand(modelData.id, appAlbumCard.index)
                                                            appRootRect.forceActiveFocus()
                                                        }
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
                                                        onClicked: {
                                                            service.downloadAlbum(modelData.id)
                                                            appRootRect.forceActiveFocus()
                                                        }
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
                                                        onClicked: {
                                                            win.focusedAlbumIndex = appAlbumCard.index
                                                            service.playAlbum(modelData.id, 0, "auto", false)
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }
                                                }

                                                // Expand Tracks button
                                                Rectangle {
                                                    width: 58; height: 26; radius: 5
                                                    color: appAlbumCard.expanded ? "#15322c" : "#111622"
                                                    border.width: 1
                                                    border.color: appAlbumCard.expanded ? win.colAccent : win.colBorder
                                                    Text {
                                                        anchors.centerIn: parent
                                                        text: (appAlbumCard.expanded ? "󰅃 " : "󰅀 ") + "Tracks"
                                                        textFormat: Text.PlainText
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 9
                                                        font.bold: appAlbumCard.expanded
                                                        color: appAlbumCard.expanded ? win.colAccent : win.colFg
                                                    }
                                                    MouseArea {
                                                        anchors.fill: parent
                                                        cursorShape: Qt.PointingHandCursor
                                                        onClicked: {
                                                            win.toggleAlbumExpand(modelData.id, appAlbumCard.index)
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }
                                                }
                                            }

                                            // Expanded Track List Drawer
                                            ListView {
                                                Layout.fillWidth: true
                                                Layout.fillHeight: true
                                                visible: appAlbumCard.expanded
                                                clip: true
                                                spacing: 2
                                                model: appAlbumCard.tracksList

                                                delegate: Rectangle {
                                                    required property var modelData
                                                    required property int index
                                                    readonly property bool isTrackPlaying: service.trackId === modelData.id
                                                    readonly property bool isTrackFocused: appAlbumCard.isKeyboardFocused && win.focusedTrackIndex === index
                                                    width: ListView.view.width
                                                    height: 24
                                                    radius: 4
                                                    color: isTrackPlaying
                                                        ? "#193c34"
                                                        : (isTrackFocused
                                                            ? "#142e2a"
                                                            : (index % 2 === 0 ? "#0f1520" : "transparent"))
                                                    border.width: isTrackFocused ? 1 : 0
                                                    border.color: win.colAccent

                                                    RowLayout {
                                                        anchors.fill: parent
                                                        anchors.leftMargin: 8
                                                        anchors.rightMargin: 8
                                                        spacing: 6

                                                        Text {
                                                            text: isTrackPlaying ? "󰐊" : ((index + 1) + ".")
                                                            textFormat: Text.PlainText
                                                            font.family: "JetBrainsMono Nerd Font"
                                                            font.pixelSize: 10
                                                            font.bold: isTrackPlaying || isTrackFocused
                                                            color: (isTrackPlaying || isTrackFocused) ? win.colAccent : win.colMuted
                                                        }

                                                        Text {
                                                            Layout.fillWidth: true
                                                            text: modelData.title || ("Track " + (index + 1))
                                                            textFormat: Text.PlainText
                                                            font.family: "JetBrainsMono Nerd Font"
                                                            font.pixelSize: 10
                                                            font.bold: isTrackPlaying || isTrackFocused
                                                            color: (isTrackPlaying || isTrackFocused) ? win.colAccent : win.colFg
                                                            elide: Text.ElideRight
                                                        }

                                                        Rectangle {
                                                            Layout.preferredHeight: 18
                                                            Layout.preferredWidth: appSeedTxt.implicitWidth + 8
                                                            radius: 3
                                                            color: "#15322c"
                                                            Text {
                                                                id: appSeedTxt
                                                                anchors.centerIn: parent
                                                                text: "󰐑 Radio"
                                                                textFormat: Text.PlainText
                                                                font.family: "JetBrainsMono Nerd Font"
                                                                font.pixelSize: 8
                                                                color: win.colAccent
                                                            }
                                                            MouseArea {
                                                                anchors.fill: parent
                                                                cursorShape: Qt.PointingHandCursor
                                                                onClicked: {
                                                                    service.refreshSmartPlaylist("radio", modelData.id)
                                                                    win.leftTab = 1
                                                                    appRootRect.forceActiveFocus()
                                                                }
                                                            }
                                                        }

                                                        Text {
                                                            text: win.formatDuration(modelData.duration)
                                                            textFormat: Text.PlainText
                                                            font.family: "JetBrainsMono Nerd Font"
                                                            font.pixelSize: 9
                                                            color: win.colMuted
                                                        }
                                                    }

                                                    MouseArea {
                                                        anchors.fill: parent
                                                        anchors.rightMargin: 60
                                                        cursorShape: Qt.PointingHandCursor
                                                        onClicked: {
                                                            win.focusedAlbumIndex = appAlbumCard.index
                                                            win.focusedTrackIndex = index
                                                            service.playAlbum(appAlbumCard.modelData.id, index, "auto", false)
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }
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
                                            onClicked: {
                                                service.playSmartPlaylist(service.smartPreset, "")
                                                appRootRect.forceActiveFocus()
                                            }
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
                                                appRootRect.forceActiveFocus()
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
                                                onClicked: {
                                                    service.refreshSmartPlaylist(modelData, "")
                                                    appRootRect.forceActiveFocus()
                                                }
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
                                        readonly property bool isSmartFocused: win.playlistPaneFocus === 0 && win.focusedSmartTrackIndex === index
                                        width: ListView.view.width
                                        height: 24
                                        radius: 4
                                        color: isSmartFocused ? "#15322c" : "#0b0f17"
                                        border.width: isSmartFocused ? 1 : 0
                                        border.color: win.colAccent
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
                                                font.bold: isSmartFocused
                                                color: (index === 0 || isSmartFocused) ? win.colAccent : win.colFg
                                                elide: Text.ElideRight
                                            }
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: {
                                                win.playlistPaneFocus = 0
                                                win.focusedSmartTrackIndex = index
                                                service.playSmartPlaylist(service.smartPreset, "", index)
                                                appRootRect.forceActiveFocus()
                                            }
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
                                            Keys.onPressed: event => win.handleKeyNavigation(event)

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
                                                appRootRect.forceActiveFocus()
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
                                        id: appPlCard
                                        required property var modelData
                                        required property int index
                                        readonly property bool isExpanded: win.selectedPlaylistId === modelData.id
                                        readonly property bool isPlFocused: win.playlistPaneFocus === 1 && win.focusedPlaylistIndex === index
                                        readonly property var plTracks: modelData.tracks || []

                                        width: ListView.view.width
                                        height: isExpanded ? (36 + Math.min(plTracks.length, 6) * 22 + 8) : 32
                                        radius: 5
                                        color: (isExpanded || isPlFocused) ? "#15322c" : "#0b0f17"
                                        border.width: (isExpanded || isPlFocused) ? 1.5 : 1
                                        border.color: (isExpanded || isPlFocused) ? win.colAccent : win.colBorder

                                        ColumnLayout {
                                            anchors.fill: parent
                                            anchors.margins: 5
                                            spacing: 3

                                            RowLayout {
                                                Layout.fillWidth: true
                                                spacing: 6
                                                Text {
                                                    Layout.fillWidth: true
                                                    text: (appPlCard.isExpanded ? "󰅃 " : "󰅀 ") + (modelData.title || "Playlist") + " (" + (modelData.trackCount || plTracks.length) + " tracks)"
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 10
                                                    font.bold: isPlFocused || isExpanded
                                                    color: isPlFocused ? win.colAccent : win.colFg
                                                    elide: Text.ElideRight

                                                    MouseArea {
                                                        anchors.fill: parent
                                                        cursorShape: Qt.PointingHandCursor
                                                        onClicked: {
                                                            win.playlistPaneFocus = 1
                                                            win.focusedPlaylistIndex = appPlCard.index
                                                            win.selectedPlaylistId = appPlCard.isExpanded ? "" : modelData.id
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }
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
                                                        onClicked: {
                                                            service.playPlaylist(modelData.id, 0, false)
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }
                                                }
                                            }

                                            ListView {
                                                Layout.fillWidth: true
                                                Layout.fillHeight: true
                                                visible: appPlCard.isExpanded
                                                clip: true
                                                spacing: 2
                                                model: appPlCard.plTracks

                                                delegate: Rectangle {
                                                    required property var modelData
                                                    required property int index
                                                    width: ListView.view.width
                                                    height: 20
                                                    radius: 3
                                                    color: "#0b0f17"

                                                    RowLayout {
                                                        anchors.fill: parent
                                                        anchors.leftMargin: 6
                                                        anchors.rightMargin: 6
                                                        Text {
                                                            Layout.fillWidth: true
                                                            text: (index + 1) + ". " + (modelData.title || "Track") + " — " + (modelData.artist || "")
                                                            textFormat: Text.PlainText
                                                            font.family: "JetBrainsMono Nerd Font"
                                                            font.pixelSize: 9
                                                            color: win.colFg
                                                            elide: Text.ElideRight
                                                        }
                                                    }

                                                    MouseArea {
                                                        anchors.fill: parent
                                                        cursorShape: Qt.PointingHandCursor
                                                        onClicked: {
                                                            service.playPlaylist(appPlCard.modelData.id, index, false)
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }
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
                            id: appVisualiser
                            anchors.fill: parent
                            focus: win.visualiserMaximised
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
