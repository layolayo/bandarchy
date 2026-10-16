import QtQuick
import QtQuick.Layouts
import Quickshell
import Quickshell.Wayland
import qs.Commons as Commons

// Panel.qml — Bandarchy Omarchy Shell Overlay Panel
// Provides:
// 1. Unified Bandcamp Purchased Collection + Local Library browser & search
// 2. Intelligent Playlists (seeded from last track played) + Custom Playlists CRUD
// 3. Psychedelic Audio-Reactive Visualiser (Omarchy TTE character matrix +
//    "Use Album Art" omarchy-transcode-ascii Braille/Block option + full-screen)
// 4. Bandcamp Sync, ZIP importer, download manager, and mpv transport deck

Item {
    id: root

    property var pluginApi: null
    property var customService: null
    property bool standaloneMode: false

    readonly property var service: customService ? customService : (pluginApi ? pluginApi.mainInstance : null)

    readonly property var geometryPlaceholder: panelFrame
    property real contentPreferredWidth: activeTab === 2 ? 860 : 720
    property real contentPreferredHeight: activeTab === 2 ? 620 : 600
    readonly property bool allowAttach: true

    // Omarchy theme colours
    readonly property color colBg: Commons.Color.background
    readonly property color colFg: Commons.Color.foreground
    readonly property color colAccent: Commons.Color.accent
    readonly property color colUrgent: Commons.Color.urgent
    readonly property color colSurface: Qt.rgba(colFg.r, colFg.g, colFg.b, 0.06)
    readonly property color colBorder: Qt.rgba(colFg.r, colFg.g, colFg.b, 0.14)
    readonly property color colMuted: Qt.rgba(colFg.r, colFg.g, colFg.b, 0.62)

    property int activeTab: 0 // 0: Library, 1: Playlists & Radio, 2: Visualiser, 3: Settings
    property string selectedAlbumId: ""
    property string selectedPlaylistId: ""
    property string targetPlaylistForAdd: ""

    onActiveTabChanged: {
        if (service) {
            service.visualiserActive = (activeTab === 2)
            if (activeTab === 2) service.refreshAsciiArt()
            if (activeTab === 1) {
                service.loadPlaylists()
                service.refreshSmartPlaylist(service.smartPreset, "")
            }
        }
    }

    Component.onDestruction: {
        if (service) service.visualiserActive = false
    }

    function formatDuration(sec) {
        var s = Math.max(0, Math.floor(Number(sec) || 0))
        var m = Math.floor(s / 60)
        var r = s % 60
        return m + ":" + (r < 10 ? "0" + r : r)
    }

    // Full-screen Wayland Overlay Window for the Psychedelic Visualiser
    Variants {
        model: (root.service && root.service.fullscreenVisualiserOpen) ? Quickshell.screens : []

        PanelWindow {
            id: fsWindow
            required property var modelData
            screen: modelData

            anchors {
                top: true
                bottom: true
                left: true
                right: true
            }

            WlrLayershell.layer: WlrLayer.Overlay
            WlrLayershell.keyboardFocus: WlrKeyboardFocus.Exclusive
            WlrLayershell.namespace: "bandarchy-visualiser"
            exclusionMode: ExclusionMode.Ignore
            color: "#05070b"

            Visualiser {
                anchors.fill: parent
                focus: true
                isFullscreen: true
                bands: root.service ? root.service.spectrumBands : []
                playing: root.service ? root.service.activelyPlaying : false
                trackTitle: root.service ? root.service.trackTitle : ""
                trackArtist: root.service ? root.service.trackArtist : ""
                trackAlbum: root.service ? root.service.trackAlbum : ""
                artPath: root.service ? root.service.artPath : ""
                playSource: root.service ? root.service.playSource : "local"
                position: root.service ? root.service.position : 0.0
                duration: root.service ? root.service.duration : 0.0
                asciiLines: root.service ? root.service.asciiLines : []
                ttfxFrames: root.service ? root.service.ttfxFrames : []
                useAlbumArt: root.service ? root.service.useAlbumArt : true
                asciiMode: root.service ? root.service.asciiMode : "braille"
                asciiSource: root.service ? root.service.asciiSource : "album-art"
                accentColour: root.colAccent
                urgentColour: root.colUrgent
                foregroundColour: root.colFg
                backgroundColour: root.colBg

                onRequestToggleFullscreen: {
                    if (root.service) root.service.fullscreenVisualiserOpen = false
                }
                onRequestCloseVisualiser: {
                    if (root.service) root.service.fullscreenVisualiserOpen = false
                }
                onRequestPlayPause: if (root.service) root.service.togglePlayPause()
                onRequestNext: if (root.service) root.service.nextTrack()
                onRequestPrev: if (root.service) root.service.prevTrack()
                onRequestToggleUseAlbumArt: if (root.service) root.service.toggleUseAlbumArt()
                onRequestToggleAsciiMode: if (root.service) root.service.toggleAsciiMode()
                onRequestLaunchTtfxScreensaver: effectName => {
                    if (root.service) root.service.launchTtfxScreensaver(effectName)
                }
                onRequestSelectTtfxEffect: effectName => {
                    if (root.service) root.service.setTtfxEffect(effectName)
                }
            }
        }
    }

    Rectangle {
        id: panelFrame
        anchors.fill: parent
        radius: root.standaloneMode ? 0 : Commons.Style.radiusL
        color: root.colBg
        border.width: root.standaloneMode ? 0 : 1
        border.color: root.colBorder
        clip: true

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 14
            spacing: 10

            // ---------------------------------------------------------------
            // 1. Header & Navigation Tabs
            // ---------------------------------------------------------------
            RowLayout {
                Layout.fillWidth: true
                spacing: 8

                Rectangle {
                    width: 28; height: 28; radius: 6
                    color: Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.18)
                    border.width: 1
                    border.color: root.colAccent
                    Text {
                        anchors.centerIn: parent
                        text: "󰀥"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 15
                        color: root.colAccent
                    }
                }

                ColumnLayout {
                    spacing: 0
                    Text {
                        text: "BANDARCHY"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 13
                        font.bold: true
                        color: root.colFg
                    }
                    Text {
                        text: root.service
                            ? ((root.service.username ? ("@" + root.service.username + " · ") : "") +
                               root.service.purchasedCount + " Purchased · " +
                               root.service.localCount + " Local (" + root.service.trackCount + " tracks)")
                            : "Bandcamp & Local Lossless Player"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 10
                        color: root.colMuted
                    }
                }

                Item { Layout.fillWidth: true }

                // Navigation Tab Pills
                Repeater {
                    model: [
                        { idx: 0, label: "󰲸 Library" },
                        { idx: 1, label: "󰐑 Playlists & Radio" },
                        { idx: 2, label: "󰍹 Visualiser" },
                        { idx: 3, label: "󰒓 Sync" }
                    ]

                    delegate: Rectangle {
                        required property var modelData
                        Layout.preferredHeight: 28
                        Layout.preferredWidth: tabTxt.implicitWidth + 18
                        radius: 6
                        color: root.activeTab === modelData.idx
                            ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.22)
                            : root.colSurface
                        border.width: 1
                        border.color: root.activeTab === modelData.idx ? root.colAccent : root.colBorder

                        Text {
                            id: tabTxt
                            anchors.centerIn: parent
                            text: modelData.label
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 11
                            font.bold: root.activeTab === modelData.idx
                            color: root.activeTab === modelData.idx ? root.colAccent : root.colFg
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.activeTab = modelData.idx
                        }
                    }
                }

                // Launch Standalone Window button (when in panel mode)
                Rectangle {
                    visible: !root.standaloneMode
                    Layout.preferredHeight: 28
                    Layout.preferredWidth: 28
                    radius: 6
                    color: root.colSurface
                    border.width: 1
                    border.color: root.colBorder

                    Text {
                        anchors.centerIn: parent
                        text: "󰖯"
                        textFormat: Text.PlainText
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 13
                        color: root.colFg
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: if (root.service) root.service.launchStandalonePlayer()
                    }
                }
            }

            // ---------------------------------------------------------------
            // 2. Main Tab Content Stack
            // ---------------------------------------------------------------
            Item {
                Layout.fillWidth: true
                Layout.fillHeight: true

                // ===========================================================
                // TAB 0: LIBRARY & BANDCAMP PURCHASES
                // ===========================================================
                ColumnLayout {
                    anchors.fill: parent
                    visible: root.activeTab === 0
                    spacing: 8

                    // Search Bar + Scope Filter Pills
                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 6

                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: 32
                            radius: 6
                            color: root.colSurface
                            border.width: 1
                            border.color: searchInput.activeFocus ? root.colAccent : root.colBorder

                            RowLayout {
                                anchors.fill: parent
                                anchors.leftMargin: 10
                                anchors.rightMargin: 8
                                spacing: 6

                                Text {
                                    text: "󰍉"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 13
                                    color: root.colMuted
                                }

                                TextInput {
                                    id: searchInput
                                    Layout.fillWidth: true
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 12
                                    color: root.colFg
                                    clip: true
                                    selectByMouse: true
                                    onTextEdited: {
                                        if (root.service) {
                                            root.service.loadCollection(root.service.activeScope, text)
                                        }
                                    }

                                    Text {
                                        anchors.fill: parent
                                        verticalAlignment: Text.AlignVCenter
                                        text: "Search Bandcamp purchases, artists, albums, or local tracks…"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 11
                                        color: root.colMuted
                                        visible: !searchInput.text && !searchInput.activeFocus
                                    }
                                }

                                Text {
                                    visible: searchInput.text.length > 0
                                    text: "󰅖"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 12
                                    color: root.colMuted
                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: {
                                            searchInput.text = ""
                                            if (root.service) root.service.loadCollection(root.service.activeScope, "")
                                        }
                                    }
                                }
                            }
                        }

                        // Scope filter buttons: All, Purchased, Local, Cloud
                        Repeater {
                            model: [
                                { scope: "all", label: "All" },
                                { scope: "purchased", label: "Purchased" },
                                { scope: "local", label: "Local" },
                                { scope: "cloud", label: "Cloud" }
                            ]

                            delegate: Rectangle {
                                required property var modelData
                                property bool isCurrent: root.service && root.service.activeScope === modelData.scope
                                Layout.preferredHeight: 32
                                Layout.preferredWidth: scopeLbl.implicitWidth + 16
                                radius: 6
                                color: isCurrent
                                    ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.22)
                                    : root.colSurface
                                border.width: 1
                                border.color: isCurrent ? root.colAccent : root.colBorder

                                Text {
                                    id: scopeLbl
                                    anchors.centerIn: parent
                                    text: modelData.label
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 11
                                    font.bold: parent.isCurrent
                                    color: parent.isCurrent ? root.colAccent : root.colFg
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        if (root.service) {
                                            root.service.loadCollection(modelData.scope, searchInput.text)
                                        }
                                    }
                                }
                            }
                        }

                        // Shuffle Play Scope button
                        Rectangle {
                            Layout.preferredHeight: 32
                            Layout.preferredWidth: shufScopeTxt.implicitWidth + 16
                            radius: 6
                            color: Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.16)
                            border.width: 1
                            border.color: root.colAccent

                            Text {
                                id: shufScopeTxt
                                anchors.centerIn: parent
                                text: "󰒟 Shuffle"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 11
                                font.bold: true
                                color: root.colAccent
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    if (root.service) {
                                        var sc = root.service.activeScope === "cloud" ? "purchased" : root.service.activeScope
                                        root.service.playScope(sc, true)
                                    }
                                }
                            }
                        }
                    }

                    // Album List View
                    ListView {
                        id: albumList
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        clip: true
                        spacing: 6
                        model: root.service ? root.service.albums : []

                        delegate: Rectangle {
                            id: albumCard
                            required property var modelData
                            readonly property bool expanded: root.selectedAlbumId === modelData.id
                            readonly property bool isCurrentAlbum: root.service && root.service.albumId === modelData.id
                            readonly property var tracksList: modelData.tracks || []

                            width: albumList.width
                            height: expanded ? (66 + Math.min(tracksList.length, 8) * 28 + 14) : 64
                            radius: 8
                            color: isCurrentAlbum
                                ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.12)
                                : root.colSurface
                            border.width: 1
                            border.color: isCurrentAlbum ? root.colAccent : root.colBorder

                            ColumnLayout {
                                anchors.fill: parent
                                anchors.margins: 8
                                spacing: 6

                                RowLayout {
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 48
                                    spacing: 10

                                    // Cover Art thumbnail
                                    Rectangle {
                                        Layout.preferredWidth: 46
                                        Layout.preferredHeight: 46
                                        radius: 6
                                        color: "#121620"
                                        border.width: 1
                                        border.color: root.colBorder
                                        clip: true

                                        Image {
                                            id: artThumb
                                            anchors.fill: parent
                                            source: modelData.artPath ? ("file://" + modelData.artPath) : ""
                                            fillMode: Image.PreserveAspectCrop
                                            asynchronous: true
                                            visible: status === Image.Ready
                                        }

                                        Text {
                                            anchors.centerIn: parent
                                            visible: artThumb.status !== Image.Ready
                                            text: "󰀥"
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 18
                                            color: root.colAccent
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: {
                                                if (root.service) root.service.playAlbum(modelData.id, 0, "auto", false)
                                            }
                                        }
                                    }

                                    // Artist, Album Title & Badges
                                    ColumnLayout {
                                        Layout.fillWidth: true
                                        spacing: 3

                                        RowLayout {
                                            Layout.fillWidth: true
                                            spacing: 6

                                            Text {
                                                Layout.fillWidth: true
                                                text: (modelData.title || "Untitled Album")
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 12
                                                font.bold: true
                                                color: root.colFg
                                                elide: Text.ElideRight
                                            }

                                            // PURCHASED badge
                                            Rectangle {
                                                visible: Boolean(modelData.purchased)
                                                Layout.preferredHeight: 18
                                                Layout.preferredWidth: purTxt.implicitWidth + 10
                                                radius: 4
                                                color: Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.20)
                                                border.width: 1
                                                border.color: root.colAccent
                                                Text {
                                                    id: purTxt
                                                    anchors.centerIn: parent
                                                    text: "PURCHASED"
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 9
                                                    font.bold: true
                                                    color: root.colAccent
                                                }
                                            }

                                            // LOCAL vs CLOUD badge
                                            Rectangle {
                                                Layout.preferredHeight: 18
                                                Layout.preferredWidth: locTxt.implicitWidth + 10
                                                radius: 4
                                                color: modelData.isLocal
                                                    ? Qt.rgba(0.2, 0.85, 0.6, 0.16)
                                                    : Qt.rgba(root.colUrgent.r, root.colUrgent.g, root.colUrgent.b, 0.16)
                                                border.width: 1
                                                border.color: modelData.isLocal ? root.colAccent : root.colUrgent
                                                Text {
                                                    id: locTxt
                                                    anchors.centerIn: parent
                                                    text: modelData.isLocal ? "LOCAL" : "STREAM"
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 9
                                                    color: modelData.isLocal ? root.colAccent : root.colUrgent
                                                }
                                            }
                                        }

                                        Text {
                                            Layout.fillWidth: true
                                            text: (modelData.artist || "Unknown Artist") +
                                                  " · " + (modelData.numTracks || tracksList.length || 0) + " tracks"
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 11
                                            color: root.colMuted
                                            elide: Text.ElideRight
                                        }
                                    }

                                    // Action buttons: Play, Stream, Download (if cloud), Expand tracks
                                    RowLayout {
                                        spacing: 5

                                        // Play Local / Auto
                                        Rectangle {
                                            Layout.preferredHeight: 28
                                            Layout.preferredWidth: playBtnTxt.implicitWidth + 16
                                            radius: 6
                                            color: root.colAccent

                                            Text {
                                                id: playBtnTxt
                                                anchors.centerIn: parent
                                                text: modelData.isLocal ? "󰐊 Play" : "󰐊 Stream"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 11
                                                font.bold: true
                                                color: "#07090e"
                                            }

                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: {
                                                    if (root.service) root.service.playAlbum(modelData.id, 0, "auto", false)
                                                }
                                            }
                                        }

                                        // Download Purchased Album for Local Playback
                                        Rectangle {
                                            visible: Boolean(modelData.purchased && !modelData.isLocal)
                                            Layout.preferredHeight: 28
                                            Layout.preferredWidth: dlBtnTxt.implicitWidth + 14
                                            radius: 6
                                            color: Qt.rgba(root.colUrgent.r, root.colUrgent.g, root.colUrgent.b, 0.18)
                                            border.width: 1
                                            border.color: root.colUrgent

                                            Text {
                                                id: dlBtnTxt
                                                anchors.centerIn: parent
                                                text: "󰇚 Download"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                font.bold: true
                                                color: root.colUrgent
                                            }

                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: {
                                                    if (root.service) root.service.downloadAlbum(modelData.id, "flac")
                                                }
                                            }
                                        }

                                        // Add Album to first custom playlist (or create one)
                                        Rectangle {
                                            Layout.preferredHeight: 28
                                            Layout.preferredWidth: 28
                                            radius: 6
                                            color: root.colSurface
                                            border.width: 1
                                            border.color: root.colBorder

                                            Text {
                                                anchors.centerIn: parent
                                                text: "󰐑"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 13
                                                color: root.colFg
                                            }

                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: {
                                                    if (!root.service) return
                                                    if (root.service.playlists && root.service.playlists.length > 0) {
                                                        var pid = root.selectedPlaylistId || root.service.playlists[0].id
                                                        root.service.addAlbumToPlaylist(pid, modelData.id)
                                                    } else {
                                                        root.service.createPlaylist(
                                                            (modelData.artist || "Bandarchy") + " Mix",
                                                            "Created from " + (modelData.title || "album"),
                                                            "",
                                                            modelData.id,
                                                            ""
                                                        )
                                                    }
                                                }
                                            }
                                        }

                                        // Expand Tracks button
                                        Rectangle {
                                            Layout.preferredHeight: 28
                                            Layout.preferredWidth: 28
                                            radius: 6
                                            color: root.colSurface
                                            border.width: 1
                                            border.color: root.colBorder

                                            Text {
                                                anchors.centerIn: parent
                                                text: albumCard.expanded ? "󰅃" : "󰅀"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 13
                                                color: root.colFg
                                            }

                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: {
                                                    root.selectedAlbumId = albumCard.expanded ? "" : modelData.id
                                                }
                                            }
                                        }
                                    }
                                }

                                // Expanded Track List Drawer
                                ListView {
                                    Layout.fillWidth: true
                                    Layout.fillHeight: true
                                    visible: albumCard.expanded
                                    clip: true
                                    spacing: 2
                                    model: albumCard.tracksList

                                    delegate: Rectangle {
                                        required property var modelData
                                        required property int index
                                        width: ListView.view.width
                                        height: 26
                                        radius: 4
                                        color: (root.service && root.service.trackId === modelData.id)
                                            ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.20)
                                            : Qt.rgba(1, 1, 1, index % 2 === 0 ? 0.03 : 0.0)

                                        RowLayout {
                                            anchors.fill: parent
                                            anchors.leftMargin: 8
                                            anchors.rightMargin: 8
                                            spacing: 8

                                            Text {
                                                text: (index + 1) + "."
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                color: root.colMuted
                                            }

                                            Text {
                                                Layout.fillWidth: true
                                                text: modelData.title || ("Track " + (index + 1))
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 11
                                                color: root.colFg
                                                elide: Text.ElideRight
                                            }

                                            // Seed Intelligent Radio from this track
                                            Rectangle {
                                                Layout.preferredHeight: 20
                                                Layout.preferredWidth: seedRowTxt.implicitWidth + 10
                                                radius: 4
                                                color: Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.14)
                                                Text {
                                                    id: seedRowTxt
                                                    anchors.centerIn: parent
                                                    text: "󰐑 Radio"
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 9
                                                    color: root.colAccent
                                                }
                                                MouseArea {
                                                    anchors.fill: parent
                                                    cursorShape: Qt.PointingHandCursor
                                                    onClicked: {
                                                        if (root.service) {
                                                            root.service.refreshSmartPlaylist("radio", modelData.id)
                                                            root.activeTab = 1
                                                        }
                                                    }
                                                }
                                            }

                                            Text {
                                                text: root.formatDuration(modelData.duration)
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                color: root.colMuted
                                            }
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            anchors.rightMargin: 70
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: {
                                                if (root.service) {
                                                    root.service.playAlbum(albumCard.modelData.id, index, "auto", false)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // ===========================================================
                // TAB 1: INTELLIGENT PLAYLISTS (LAST TRACK PLAYED) & CUSTOM PLAYLISTS
                // ===========================================================
                RowLayout {
                    anchors.fill: parent
                    visible: root.activeTab === 1
                    spacing: 12

                    // Left Column: Intelligent Playlist Generator (seeded from last track played)
                    Rectangle {
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        radius: 8
                        color: root.colSurface
                        border.width: 1
                        border.color: root.colBorder

                        ColumnLayout {
                            anchors.fill: parent
                            anchors.margins: 10
                            spacing: 8

                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 8

                                Text {
                                    text: "Auto  INTELLIGENT PLAYLIST"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 12
                                    font.bold: true
                                    color: root.colAccent
                                }

                                Item { Layout.fillWidth: true }

                                Rectangle {
                                    Layout.preferredHeight: 24
                                    Layout.preferredWidth: playSmartTxt.implicitWidth + 14
                                    radius: 5
                                    color: root.colAccent
                                    Text {
                                        id: playSmartTxt
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
                                            if (root.service) root.service.playSmartPlaylist(root.service.smartPreset, "")
                                        }
                                    }
                                }

                                Rectangle {
                                    Layout.preferredHeight: 24
                                    Layout.preferredWidth: saveSmartTxt.implicitWidth + 14
                                    radius: 5
                                    color: Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.18)
                                    border.width: 1
                                    border.color: root.colAccent
                                    Text {
                                        id: saveSmartTxt
                                        anchors.centerIn: parent
                                        text: "󰆓 Save"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 10
                                        color: root.colAccent
                                    }
                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: {
                                            if (root.service && root.service.smartPlaylist) {
                                                root.service.saveSmartPlaylistAs(
                                                    root.service.smartPlaylist.title || "Intelligent Mix",
                                                    root.service.smartPreset,
                                                    ""
                                                )
                                            }
                                        }
                                    }
                                }
                            }

                            // Seed Track indicator (Last Track Played)
                            Rectangle {
                                Layout.fillWidth: true
                                Layout.preferredHeight: 38
                                radius: 6
                                color: Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.10)
                                border.width: 1
                                border.color: Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.30)

                                ColumnLayout {
                                    anchors.fill: parent
                                    anchors.leftMargin: 8
                                    anchors.rightMargin: 8
                                    spacing: 1

                                    Text {
                                        Layout.fillWidth: true
                                        text: {
                                            var seed = (root.service && root.service.smartPlaylist && root.service.smartPlaylist.seed)
                                                ? root.service.smartPlaylist.seed
                                                : (root.service ? root.service.lastPlayedTrack : null)
                                            if (!seed) return "Seeded from your collection"
                                            return "Seeded from Last Track: " + (seed.title || "Track") + " — " + (seed.artist || "")
                                        }
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 10
                                        font.bold: true
                                        color: root.colAccent
                                        elide: Text.ElideRight
                                    }

                                    Text {
                                        Layout.fillWidth: true
                                        text: (root.service && root.service.smartPlaylist && root.service.smartPlaylist.description)
                                            ? root.service.smartPlaylist.description
                                            : "Automatically adapts as you listen to tracks."
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 9
                                        color: root.colMuted
                                        elide: Text.ElideRight
                                    }
                                }
                            }

                            // Preset Selector Pills: Radio, Kindred, Journey, Purchased
                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 4

                                Repeater {
                                    model: [
                                        { id: "radio", label: "Sonic Radio" },
                                        { id: "kindred", label: "Kindred" },
                                        { id: "journey", label: "Journey" },
                                        { id: "purchased", label: "Purchased" }
                                    ]

                                    delegate: Rectangle {
                                        required property var modelData
                                        property bool active: root.service && root.service.smartPreset === modelData.id
                                        Layout.fillWidth: true
                                        Layout.preferredHeight: 24
                                        radius: 5
                                        color: active
                                            ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.24)
                                            : Qt.rgba(1, 1, 1, 0.05)
                                        border.width: 1
                                        border.color: active ? root.colAccent : root.colBorder

                                        Text {
                                            anchors.centerIn: parent
                                            text: modelData.label
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 10
                                            font.bold: parent.active
                                            color: parent.active ? root.colAccent : root.colFg
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: {
                                                if (root.service) root.service.refreshSmartPlaylist(modelData.id, "")
                                            }
                                        }
                                    }
                                }
                            }

                            // Generated Intelligent Playlist Track List
                            ListView {
                                Layout.fillWidth: true
                                Layout.fillHeight: true
                                clip: true
                                spacing: 3
                                model: (root.service && root.service.smartPlaylist && root.service.smartPlaylist.tracks)
                                    ? root.service.smartPlaylist.tracks
                                    : []

                                delegate: Rectangle {
                                    required property var modelData
                                    required property int index
                                    width: ListView.view.width
                                    height: 28
                                    radius: 5
                                    color: index === 0
                                        ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.14)
                                        : Qt.rgba(1, 1, 1, 0.03)

                                    RowLayout {
                                        anchors.fill: parent
                                        anchors.leftMargin: 8
                                        anchors.rightMargin: 8
                                        spacing: 6

                                        Text {
                                            text: index === 0 ? "★" : (index + 1) + "."
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 10
                                            color: index === 0 ? root.colAccent : root.colMuted
                                        }

                                        Text {
                                            Layout.fillWidth: true
                                            text: (modelData.title || "Track") + " — " + (modelData.artist || "")
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 10
                                            color: root.colFg
                                            elide: Text.ElideRight
                                        }

                                        Text {
                                            text: root.formatDuration(modelData.duration)
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 9
                                            color: root.colMuted
                                        }
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: {
                                            if (root.service) root.service.playSmartPlaylist(root.service.smartPreset, "", index)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Right Column: User-Created Custom Playlists
                    Rectangle {
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        radius: 8
                        color: root.colSurface
                        border.width: 1
                        border.color: root.colBorder

                        ColumnLayout {
                            anchors.fill: parent
                            anchors.margins: 10
                            spacing: 8

                            Text {
                                text: "󰐑 CUSTOM PLAYLISTS"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 12
                                font.bold: true
                                color: root.colFg
                            }

                            // Create New Playlist Row
                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 6

                                Rectangle {
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 28
                                    radius: 5
                                    color: Qt.rgba(1, 1, 1, 0.05)
                                    border.width: 1
                                    border.color: newPlaylistInput.activeFocus ? root.colAccent : root.colBorder

                                    TextInput {
                                        id: newPlaylistInput
                                        anchors.fill: parent
                                        anchors.leftMargin: 8
                                        anchors.rightMargin: 8
                                        verticalAlignment: Text.AlignVCenter
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 11
                                        color: root.colFg
                                        clip: true

                                        Text {
                                            anchors.fill: parent
                                            verticalAlignment: Text.AlignVCenter
                                            text: "New playlist name…"
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 10
                                            color: root.colMuted
                                            visible: !newPlaylistInput.text && !newPlaylistInput.activeFocus
                                        }
                                    }
                                }

                                Rectangle {
                                    Layout.preferredHeight: 28
                                    Layout.preferredWidth: createPlTxt.implicitWidth + 14
                                    radius: 5
                                    color: root.colAccent
                                    Text {
                                        id: createPlTxt
                                        anchors.centerIn: parent
                                        text: "+ Create"
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
                                            var t = newPlaylistInput.text.trim()
                                            if (!t) t = "Custom Mix " + ((root.service && root.service.playlists) ? (root.service.playlists.length + 1) : 1)
                                            if (root.service) {
                                                root.service.createPlaylist(t, "User playlist", "", root.service.albumId, "")
                                                newPlaylistInput.text = ""
                                            }
                                        }
                                    }
                                }
                            }

                            // User Playlists ListView
                            ListView {
                                Layout.fillWidth: true
                                Layout.fillHeight: true
                                clip: true
                                spacing: 5
                                model: root.service ? root.service.playlists : []

                                delegate: Rectangle {
                                    id: plCard
                                    required property var modelData
                                    readonly property bool isExpanded: root.selectedPlaylistId === modelData.id
                                    readonly property var plTracks: modelData.tracks || []

                                    width: ListView.view.width
                                    height: isExpanded ? (42 + Math.min(plTracks.length, 6) * 24 + 8) : 38
                                    radius: 6
                                    color: isExpanded
                                        ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.14)
                                        : Qt.rgba(1, 1, 1, 0.04)
                                    border.width: 1
                                    border.color: isExpanded ? root.colAccent : root.colBorder

                                    ColumnLayout {
                                        anchors.fill: parent
                                        anchors.margins: 6
                                        spacing: 4

                                        RowLayout {
                                            Layout.fillWidth: true
                                            spacing: 6

                                            Text {
                                                Layout.fillWidth: true
                                                text: (modelData.title || "Playlist") + " (" + (modelData.trackCount || plTracks.length) + ")"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 11
                                                font.bold: true
                                                color: root.colFg
                                                elide: Text.ElideRight

                                                MouseArea {
                                                    anchors.fill: parent
                                                    cursorShape: Qt.PointingHandCursor
                                                    onClicked: {
                                                        root.selectedPlaylistId = plCard.isExpanded ? "" : modelData.id
                                                    }
                                                }
                                            }

                                            Rectangle {
                                                width: 48; height: 22; radius: 4
                                                color: root.colAccent
                                                Text {
                                                    anchors.centerIn: parent
                                                    text: "󰐊 Play"
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
                                                        if (root.service) root.service.playPlaylist(modelData.id, 0, false)
                                                    }
                                                }
                                            }

                                            Rectangle {
                                                width: 22; height: 22; radius: 4
                                                color: Qt.rgba(root.colUrgent.r, root.colUrgent.g, root.colUrgent.b, 0.18)
                                                Text {
                                                    anchors.centerIn: parent
                                                    text: "󰆴"
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 11
                                                    color: root.colUrgent
                                                }
                                                MouseArea {
                                                    anchors.fill: parent
                                                    cursorShape: Qt.PointingHandCursor
                                                    onClicked: {
                                                        if (root.service) root.service.deletePlaylist(modelData.id)
                                                    }
                                                }
                                            }
                                        }

                                        ListView {
                                            Layout.fillWidth: true
                                            Layout.fillHeight: true
                                            visible: plCard.isExpanded
                                            clip: true
                                            spacing: 2
                                            model: plCard.plTracks

                                            delegate: Rectangle {
                                                required property var modelData
                                                required property int index
                                                width: ListView.view.width
                                                height: 22
                                                radius: 3
                                                color: Qt.rgba(1, 1, 1, 0.03)

                                                RowLayout {
                                                    anchors.fill: parent
                                                    anchors.leftMargin: 6
                                                    anchors.rightMargin: 6
                                                    spacing: 6

                                                    Text {
                                                        Layout.fillWidth: true
                                                        text: (index + 1) + ". " + (modelData.title || "Track") + " — " + (modelData.artist || "")
                                                        textFormat: Text.PlainText
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 10
                                                        color: root.colFg
                                                        elide: Text.ElideRight

                                                        MouseArea {
                                                            anchors.fill: parent
                                                            cursorShape: Qt.PointingHandCursor
                                                            onClicked: {
                                                                if (root.service) root.service.playPlaylist(plCard.modelData.id, index, false)
                                                            }
                                                        }
                                                    }

                                                    Text {
                                                        text: "󰅖"
                                                        textFormat: Text.PlainText
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 10
                                                        color: root.colMuted
                                                        MouseArea {
                                                            anchors.fill: parent
                                                            cursorShape: Qt.PointingHandCursor
                                                            onClicked: {
                                                                if (root.service) root.service.removeTrackFromPlaylist(plCard.modelData.id, index)
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // ===========================================================
                // TAB 2: PSYCHEDELIC OMARCHY SCREENSAVER VISUALISER
                // ===========================================================
                Visualiser {
                    anchors.fill: parent
                    visible: root.activeTab === 2
                    isFullscreen: false
                    bands: root.service ? root.service.spectrumBands : []
                    playing: root.service ? root.service.activelyPlaying : false
                    trackTitle: root.service ? root.service.trackTitle : ""
                    trackArtist: root.service ? root.service.trackArtist : ""
                    trackAlbum: root.service ? root.service.trackAlbum : ""
                    artPath: root.service ? root.service.artPath : ""
                    playSource: root.service ? root.service.playSource : "local"
                    position: root.service ? root.service.position : 0.0
                    duration: root.service ? root.service.duration : 0.0
                    asciiLines: root.service ? root.service.asciiLines : []
                    ttfxFrames: root.service ? root.service.ttfxFrames : []
                    useAlbumArt: root.service ? root.service.useAlbumArt : true
                    asciiMode: root.service ? root.service.asciiMode : "braille"
                    asciiSource: root.service ? root.service.asciiSource : "album-art"
                    accentColour: root.colAccent
                    urgentColour: root.colUrgent
                    foregroundColour: root.colFg
                    backgroundColour: root.colBg

                    onRequestToggleFullscreen: {
                        if (root.service) {
                            root.service.fullscreenVisualiserOpen = !root.service.fullscreenVisualiserOpen
                        }
                    }
                    onRequestCloseVisualiser: root.activeTab = 0
                    onRequestPlayPause: if (root.service) root.service.togglePlayPause()
                    onRequestNext: if (root.service) root.service.nextTrack()
                    onRequestPrev: if (root.service) root.service.prevTrack()
                    onRequestToggleUseAlbumArt: if (root.service) root.service.toggleUseAlbumArt()
                    onRequestToggleAsciiMode: if (root.service) root.service.toggleAsciiMode()
                    onRequestLaunchTtfxScreensaver: effectName => {
                        if (root.service) root.service.launchTtfxScreensaver(effectName)
                    }
                    onRequestSelectTtfxEffect: effectName => {
                        if (root.service) root.service.setTtfxEffect(effectName)
                    }
                }

                // ===========================================================
                // TAB 3: BANDCAMP SYNC, ZIP IMPORT & SETTINGS
                // ===========================================================
                ColumnLayout {
                    anchors.fill: parent
                    visible: root.activeTab === 3
                    spacing: 10

                    Rectangle {
                        Layout.fillWidth: true
                        Layout.preferredHeight: 150
                        radius: 8
                        color: root.colSurface
                        border.width: 1
                        border.color: root.colBorder

                        ColumnLayout {
                            anchors.fill: parent
                            anchors.margins: 12
                            spacing: 8

                            Text {
                                text: "BANDCAMP ACCOUNT & COLLECTION SYNCHRONISATION"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 11
                                font.bold: true
                                color: root.colAccent
                            }

                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 8

                                Text {
                                    text: "Username:"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 11
                                    color: root.colFg
                                }

                                Rectangle {
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 28
                                    radius: 5
                                    color: Qt.rgba(1, 1, 1, 0.05)
                                    border.width: 1
                                    border.color: root.colBorder

                                    TextInput {
                                        id: userInput
                                        anchors.fill: parent
                                        anchors.leftMargin: 8
                                        anchors.rightMargin: 8
                                        verticalAlignment: Text.AlignVCenter
                                        text: root.service ? root.service.username : "layolayo"
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 11
                                        color: root.colFg
                                    }
                                }

                                Rectangle {
                                    Layout.preferredHeight: 28
                                    Layout.preferredWidth: syncNowTxt.implicitWidth + 16
                                    radius: 5
                                    color: root.colAccent
                                    Text {
                                        id: syncNowTxt
                                        anchors.centerIn: parent
                                        text: (root.service && root.service.syncing) ? "󰑐 Syncing…" : "󰑐 Sync Collection"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 11
                                        font.bold: true
                                        color: "#07090e"
                                    }
                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: {
                                            if (root.service) {
                                                root.service.saveAuth(userInput.text.trim(), "", "", "")
                                                root.service.syncCollection(false)
                                            }
                                        }
                                    }
                                }

                                Rectangle {
                                    Layout.preferredHeight: 28
                                    Layout.preferredWidth: importZipTxt.implicitWidth + 16
                                    radius: 5
                                    color: Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.18)
                                    border.width: 1
                                    border.color: root.colAccent
                                    Text {
                                        id: importZipTxt
                                        anchors.centerIn: parent
                                        text: "󰗄 Import Downloads ZIPs"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 11
                                        color: root.colAccent
                                    }
                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: {
                                            if (root.service) root.service.importZips()
                                        }
                                    }
                                }
                            }

                            Text {
                                Layout.fillWidth: true
                                text: "Discovers your Bandcamp purchases from your fan profile and browser session, and merges them with ~/Music/Bandcamp and ~/Music."
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 10
                                color: root.colMuted
                                wrapMode: Text.WordWrap
                            }
                        }
                    }

                    Item { Layout.fillHeight: true }
                }
            }

            // ---------------------------------------------------------------
            // 3. Persistent Bottom Now Playing Transport & Live Spectrum Deck
            // ---------------------------------------------------------------
            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 74
                radius: 8
                color: Qt.rgba(root.colFg.r, root.colFg.g, root.colFg.b, 0.05)
                border.width: 1
                border.color: root.colBorder

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 10
                    anchors.rightMargin: 10
                    spacing: 12

                    Vinyl {
                        Layout.preferredWidth: 54
                        Layout.preferredHeight: 54
                        artPath: root.service ? root.service.artPath : ""
                        spinning: root.service ? root.service.activelyPlaying : false
                        accentColour: root.colAccent
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 4

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 8

                            Text {
                                Layout.fillWidth: true
                                text: (root.service && root.service.trackTitle)
                                    ? root.service.trackTitle
                                    : "Ready to Play — Select any Bandcamp purchase or local album"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 12
                                font.bold: true
                                color: root.colFg
                                elide: Text.ElideRight
                            }

                            Text {
                                text: root.service
                                    ? (root.formatDuration(root.service.position) + " / " + root.formatDuration(root.service.duration))
                                    : "0:00 / 0:00"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 10
                                color: root.colAccent
                            }
                        }

                        Text {
                            Layout.fillWidth: true
                            text: (root.service && root.service.trackArtist)
                                ? (root.service.trackArtist + (root.service.trackAlbum ? (" — " + root.service.trackAlbum) : ""))
                                : "Lossless mpv playback + 60 FPS Cava & Omarchy TTE Visualiser"
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 10
                            color: root.colMuted
                            elide: Text.ElideRight
                        }

                        // Interactive Progress Seek Bar
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: 6
                            radius: 3
                            color: Qt.rgba(1, 1, 1, 0.12)

                            Rectangle {
                                width: {
                                    if (!root.service || root.service.duration <= 0) return 0
                                    return Math.min(parent.width, (root.service.position / root.service.duration) * parent.width)
                                }
                                height: parent.height
                                radius: 3
                                color: root.colAccent
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: mouse => {
                                    if (root.service && root.service.duration > 0) {
                                        var targetSec = (mouse.x / width) * root.service.duration
                                        root.service.seekTo(targetSec)
                                    }
                                }
                            }
                        }
                    }

                    // Live 24-Bar Mini Spectrum Strip
                    Spectrum {
                        Layout.preferredWidth: 96
                        Layout.preferredHeight: 38
                        barCount: 24
                        bands: root.service ? root.service.spectrumBands : []
                        active: root.service ? root.service.activelyPlaying : false
                        accentColour: root.colAccent
                        peakColour: root.colUrgent
                    }

                    // Transport Controls
                    RowLayout {
                        spacing: 6

                        Rectangle {
                            width: 30; height: 30; radius: 6
                            color: root.colSurface
                            border.width: 1
                            border.color: root.colBorder
                            Text {
                                anchors.centerIn: parent
                                text: "󰒮"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 14
                                color: root.colFg
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: if (root.service) root.service.prevTrack()
                            }
                        }

                        Rectangle {
                            width: 36; height: 32; radius: 6
                            color: root.colAccent
                            Text {
                                anchors.centerIn: parent
                                text: (root.service && root.service.activelyPlaying) ? "󰏤" : "󰐊"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 16
                                color: "#07090e"
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: if (root.service) root.service.togglePlayPause()
                            }
                        }

                        Rectangle {
                            width: 30; height: 30; radius: 6
                            color: root.colSurface
                            border.width: 1
                            border.color: root.colBorder
                            Text {
                                anchors.centerIn: parent
                                text: "󰒭"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 14
                                color: root.colFg
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: if (root.service) root.service.nextTrack()
                            }
                        }

                        // Fullscreen Visualiser quick-launch button
                        Rectangle {
                            width: 32; height: 30; radius: 6
                            color: Qt.rgba(root.colUrgent.r, root.colUrgent.g, root.colUrgent.b, 0.18)
                            border.width: 1
                            border.color: root.colUrgent
                            Text {
                                anchors.centerIn: parent
                                text: "󰍹"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 14
                                color: root.colUrgent
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    root.activeTab = 2
                                    if (root.service) {
                                        root.service.fullscreenVisualiserOpen = true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
