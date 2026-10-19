import QtQuick
import QtQuick.Layouts
import QtQuick.Window
import Quickshell
import Quickshell.Wayland
import qs.Commons as Commons
import qs.Commons
import qs.Ui

// Panel.qml — Bandarchy Omarchy Shell Overlay Panel
// Provides:
// 1. Unified Bandcamp Purchased Collection + Local Library browser, search, and expandable Album Info Breakdown
// 2. Intelligent Playlists (seeded from last track played) + Custom Playlists CRUD
// 3. 4-Stage Mode Deck (Off, Album Art, Turntable, 3-Layer Psychedelic Visualiser) + full-screen Wayland overlay
// 4. Bandcamp Account Log In / Log Out, Collection Sync, ZIP importer, live download progress footer, and mpv transport deck

Item {
    id: root

    property var bar: null
    property var shell: null
    property var manifest: null
    property string omarchyPath: ""
    property var barWidgetRegistry: null
    property var pluginRegistry: null
    property var pluginApi: null
    property var customService: null
    property bool standaloneMode: false
    property bool opened: false

    property var service: customService
        ? customService
        : (pluginApi
            ? pluginApi.mainInstance
            : (shell && typeof shell.serviceFor === "function"
                ? shell.serviceFor("io.github.layolayo.bandarchy")
                : null))

    readonly property var geometryPlaceholder: panelFrame
    property real contentPreferredWidth: activeTab === 2 ? 900 : 760
    property real contentPreferredHeight: activeTab === 2 ? 640 : 620
    readonly property bool allowAttach: true

    // Omarchy theme colours
    readonly property color colBg: Commons.Color.background
    readonly property color colFg: Commons.Color.foreground
    readonly property color colAccent: Commons.Color.accent
    readonly property color colUrgent: Commons.Color.urgent
    readonly property color colSurface: Qt.rgba(colFg.r, colFg.g, colFg.b, 0.06)
    readonly property color colBorder: Qt.rgba(colFg.r, colFg.g, colFg.b, 0.14)
    readonly property color colMuted: Qt.rgba(colFg.r, colFg.g, colFg.b, 0.62)

    property int activeTab: 0 // 0: Library, 1: Playlists & Radio, 2: Stage & Visualiser, 3: Account & Sync
    property string selectedAlbumId: ""
    property string selectedPlaylistId: ""
    property string targetPlaylistForAdd: ""
    property int focusedAlbumIndex: 0
    property int focusedTrackIndex: -1
    property int focusedSmartTrackIndex: 0
    property int focusedPlaylistIndex: 0
    property int focusedPlaylistTrackIndex: -1
    property int playlistPaneFocus: 0

    // Reusable tactile button with high-contrast hover/click flash & scale response
    component ActionPill: Rectangle {
        id: pill
        property string text: ""
        property bool active: false
        property bool primary: false
        property bool danger: false
        property int fontSize: 10
        property int horizontalPad: 11
        property int pillHeight: 26
        signal clicked()

        property real flashOpacity: 0.0
        NumberAnimation on flashOpacity {
            id: pillFlashAnim
            from: 0.65
            to: 0.0
            duration: 240
            running: false
        }

        Layout.preferredHeight: pillHeight
        Layout.preferredWidth: pillLabel.implicitWidth + horizontalPad * 2
        implicitHeight: pillHeight
        implicitWidth: pillLabel.implicitWidth + horizontalPad * 2
        radius: 5
        scale: pillMouse.pressed ? 0.92 : (pillMouse.containsMouse ? 1.05 : 1.0)
        Behavior on scale { NumberAnimation { duration: 75; easing.type: Easing.OutQuad } }
        Behavior on color { ColorAnimation { duration: 85 } }

        color: {
            if (pill.primary) {
                return pillMouse.pressed ? Qt.darker(root.colAccent, 1.25)
                     : (pillMouse.containsMouse ? Qt.lighter(root.colAccent, 1.22) : root.colAccent)
            }
            if (pill.danger) {
                return pillMouse.pressed ? Qt.rgba(root.colUrgent.r, root.colUrgent.g, root.colUrgent.b, 0.45)
                     : (pillMouse.containsMouse ? Qt.rgba(root.colUrgent.r, root.colUrgent.g, root.colUrgent.b, 0.32)
                     : (pill.active ? Qt.rgba(root.colUrgent.r, root.colUrgent.g, root.colUrgent.b, 0.22) : root.colSurface))
            }
            if (pill.active) {
                return pillMouse.pressed
                    ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.42)
                    : (pillMouse.containsMouse
                        ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.30)
                        : Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.20))
            }
            return pillMouse.pressed
                ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.28)
                : (pillMouse.containsMouse
                    ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.18)
                    : root.colSurface)
        }
        border.width: (pill.primary || pillMouse.containsMouse || pillMouse.pressed) ? 1.6 : ((pill.active || pill.danger) ? 1.2 : 1)
        border.color: pill.primary
            ? (pillMouse.containsMouse ? "#ffffff" : root.colAccent)
            : (pill.danger
                ? root.colUrgent
                : (pill.active || pillMouse.containsMouse ? root.colAccent : root.colBorder))

        Rectangle {
            anchors.fill: parent
            radius: parent.radius
            color: "#ffffff"
            opacity: pill.flashOpacity
        }

        Text {
            id: pillLabel
            anchors.centerIn: parent
            text: pill.text
            textFormat: Text.PlainText
            font.family: "JetBrainsMono Nerd Font"
            font.pixelSize: pill.fontSize
            font.bold: pill.primary || pill.active || pill.danger || pillMouse.containsMouse
            color: pill.primary
                ? "#07090e"
                : (pill.danger
                    ? root.colUrgent
                    : (pill.active || pillMouse.containsMouse ? root.colAccent : root.colFg))
        }

        MouseArea {
            id: pillMouse
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                pillFlashAnim.restart()
                pill.clicked()
            }
        }
    }

    // Visible, interactive vertical scrollbar for ListViews
    component ListScroller: Rectangle {
        id: scroller
        property Flickable flickable: null
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        anchors.margins: 2
        width: 7
        radius: 3.5
        z: 20
        visible: Boolean(flickable && flickable.contentHeight > flickable.height + 4)
        color: Qt.rgba(root.colFg.r, root.colFg.g, root.colFg.b, scrollerMouse.containsMouse || scrollerMouse.pressed ? 0.16 : 0.08)

        Rectangle {
            id: thumb
            width: parent.width
            radius: parent.radius
            readonly property real ratio: scroller.flickable
                ? Math.min(1.0, Math.max(0.08, scroller.flickable.height / Math.max(1, scroller.flickable.contentHeight)))
                : 1.0
            height: Math.max(24, parent.height * ratio)
            y: {
                if (!scroller.flickable) return 0
                var maxScroll = Math.max(1, scroller.flickable.contentHeight - scroller.flickable.height)
                var availTrack = Math.max(0, scroller.height - height)
                return Math.max(0, Math.min(availTrack, (scroller.flickable.contentY / maxScroll) * availTrack))
            }
            color: (scrollerMouse.pressed || scrollerMouse.containsMouse)
                ? root.colAccent
                : Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.58)
        }

        MouseArea {
            id: scrollerMouse
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: Qt.PointingHandCursor
            function scrollToY(mouseY) {
                if (!scroller.flickable) return
                var maxScroll = Math.max(0, scroller.flickable.contentHeight - scroller.flickable.height)
                var availTrack = Math.max(1, scroller.height - thumb.height)
                var norm = Math.max(0, Math.min(1, (mouseY - thumb.height * 0.5) / availTrack))
                scroller.flickable.contentY = norm * maxScroll
            }
            onPressed: mouse => scrollToY(mouse.y)
            onPositionChanged: mouse => { if (pressed) scrollToY(mouse.y) }
        }
    }

    function toggleAlbumExpand(albumId, albumIdx) {
        if (albumIdx !== undefined && albumIdx >= 0) {
            root.focusedAlbumIndex = albumIdx
        }
        if (root.selectedAlbumId === albumId) {
            root.selectedAlbumId = ""
            root.focusedTrackIndex = -1
        } else {
            root.selectedAlbumId = albumId
            root.focusedTrackIndex = 0
            if (root.service) root.service.ensureAlbumTracks(albumId)
        }
    }

    function handleKeyNavigation(event) {
        if (panelVisualiser.textInputFocused) {
            return
        }
        if (searchInput.activeFocus || newPlaylistInput.activeFocus || userInput.activeFocus || cookieInput.activeFocus) {
            if (event.key === Qt.Key_Escape || event.key === Qt.Key_Down || event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                if (searchInput.activeFocus && (event.key === Qt.Key_Down || event.key === Qt.Key_Return || event.key === Qt.Key_Enter)) {
                    root.focusedAlbumIndex = 0
                    root.focusedTrackIndex = -1
                }
                panelFrame.forceActiveFocus()
                event.accepted = true
            }
            return
        }

        var isFsViz = Boolean(root.service && root.service.fullscreenVisualiserOpen)
        var hasCtrlOrAlt = Boolean(event.modifiers & (Qt.ControlModifier | Qt.AltModifier))

        if (event.key === Qt.Key_Slash) {
            root.activeTab = 0
            searchInput.forceActiveFocus()
            searchInput.selectAll()
            event.accepted = true
            return
        }
        if (event.key === Qt.Key_Tab) {
            root.activeTab = (root.activeTab + 1) % 4
            panelFrame.forceActiveFocus()
            event.accepted = true
            return
        }
        if (event.key === Qt.Key_Backtab) {
            root.activeTab = (root.activeTab + 3) % 4
            panelFrame.forceActiveFocus()
            event.accepted = true
            return
        }
        if (!isFsViz && !hasCtrlOrAlt && (root.activeTab !== 2 || panelVisualiser.stageMode !== "visualiser")) {
            if (event.key === Qt.Key_1) {
                root.activeTab = 0
                panelFrame.forceActiveFocus()
                event.accepted = true
                return
            }
            if (event.key === Qt.Key_2) {
                root.activeTab = 1
                panelFrame.forceActiveFocus()
                event.accepted = true
                return
            }
            if (event.key === Qt.Key_3) {
                root.activeTab = 2
                panelFrame.forceActiveFocus()
                event.accepted = true
                return
            }
            if (event.key === Qt.Key_4) {
                root.activeTab = 3
                panelFrame.forceActiveFocus()
                event.accepted = true
                return
            }
        }
        if (event.key === Qt.Key_Space) {
            if (root.service) root.service.togglePlayPause()
            event.accepted = true
            return
        }

        if (!hasCtrlOrAlt && (root.activeTab === 2 || isFsViz || panelVisualiser.stageMode === "visualiser")) {
            if ((event.modifiers & Qt.ShiftModifier) && (event.key === Qt.Key_1 || event.key === Qt.Key_Exclam || event.text === "!")) { panelVisualiser.toggleLayerRandomByNumber(1); event.accepted = true; return }
            else if ((event.modifiers & Qt.ShiftModifier) && (event.key === Qt.Key_2 || event.key === Qt.Key_At || event.key === Qt.Key_QuoteDbl || event.text === "@" || event.text === "\"")) { panelVisualiser.toggleLayerRandomByNumber(2); event.accepted = true; return }
            else if ((event.modifiers & Qt.ShiftModifier) && (event.key === Qt.Key_3 || event.key === Qt.Key_NumberSign || event.key === Qt.Key_sterling || event.text === "#" || event.text === "£")) { panelVisualiser.toggleLayerRandomByNumber(3); event.accepted = true; return }
            else if ((event.modifiers & Qt.ShiftModifier) && (event.key === Qt.Key_4 || event.key === Qt.Key_Dollar || event.text === "$")) { panelVisualiser.toggleLayerRandomByNumber(4); event.accepted = true; return }
            else if ((event.modifiers & Qt.ShiftModifier) && (event.key === Qt.Key_5 || event.key === Qt.Key_Percent || event.text === "%")) { panelVisualiser.toggleLayerRandomByNumber(5); event.accepted = true; return }
            else if ((event.modifiers & Qt.ShiftModifier) && (event.key === Qt.Key_6 || event.key === Qt.Key_AsciiCircum || event.text === "^")) { panelVisualiser.toggleLayerRandomByNumber(6); event.accepted = true; return }
            else if (event.key === Qt.Key_BraceLeft || event.text === "{") { panelVisualiser.stepPhotoCategoryByKey(-1); event.accepted = true; return }
            else if (event.key === Qt.Key_BraceRight || event.text === "}") { panelVisualiser.stepPhotoCategoryByKey(1); event.accepted = true; return }
            else if (event.key === Qt.Key_BracketLeft || event.text === "[") {
                if (event.modifiers & Qt.ShiftModifier) panelVisualiser.stepPhotoCategoryByKey(-1)
                else panelVisualiser.stepPhotoHistoryByKey(-1)
                event.accepted = true; return
            }
            else if (event.key === Qt.Key_BracketRight || event.text === "]") {
                if (event.modifiers & Qt.ShiftModifier) panelVisualiser.stepPhotoCategoryByKey(1)
                else panelVisualiser.stepPhotoHistoryByKey(1)
                event.accepted = true; return
            }
            else if (event.key === Qt.Key_Apostrophe || event.text === "'") {
                if (event.modifiers & Qt.ShiftModifier) panelVisualiser.cyclePhotoVariantEffect(-1)
                else panelVisualiser.cyclePhotoMotionMode(-1)
                event.accepted = true; return
            }
            else if (event.key === Qt.Key_NumberSign || event.text === "#") {
                if (event.modifiers & Qt.ShiftModifier) panelVisualiser.cyclePhotoVariantEffect(1)
                else panelVisualiser.cyclePhotoMotionMode(1)
                event.accepted = true; return
            }
            else if (event.key === Qt.Key_Colon || event.text === ":" || (event.key === Qt.Key_Semicolon && (event.modifiers & Qt.ShiftModifier))) {
                panelVisualiser.togglePhotoPlaneShearByKey(); event.accepted = true; return
            }
            else if (event.key === Qt.Key_Semicolon || event.text === ";") {
                panelVisualiser.cyclePhotoPoolModeByKey(1); event.accepted = true; return
            }
            else if (event.key === Qt.Key_At || event.key === Qt.Key_QuoteDbl || event.text === "@" || event.text === "\"") { panelVisualiser.cyclePhotoVariantEffect(-1); event.accepted = true; return }
            else if (event.key === Qt.Key_AsciiTilde || event.text === "~") { panelVisualiser.togglePhotoAutoMotionByKey(); event.accepted = true; return }
        }

        if (root.activeTab === 2 || isFsViz) {
            if (event.key === Qt.Key_1) { panelVisualiser.toggleVisualiserLayerByNumber(1); event.accepted = true }
            else if (event.key === Qt.Key_2) { panelVisualiser.toggleVisualiserLayerByNumber(2); event.accepted = true }
            else if (event.key === Qt.Key_3) { panelVisualiser.toggleVisualiserLayerByNumber(3); event.accepted = true }
            else if (event.key === Qt.Key_4) { panelVisualiser.toggleVisualiserLayerByNumber(4); event.accepted = true }
            else if (event.key === Qt.Key_5) { panelVisualiser.toggleVisualiserLayerByNumber(5); event.accepted = true }
            else if (event.key === Qt.Key_6) { panelVisualiser.toggleVisualiserLayerByNumber(6); event.accepted = true }
            else if (event.key === Qt.Key_M) { panelVisualiser.cycleMode((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
            else if (event.key === Qt.Key_G) { panelVisualiser.cycleLayer1Mode((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
            else if (event.key === Qt.Key_A) { panelVisualiser.cycleLayer3Mode((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
            else if (event.key === Qt.Key_C) { panelVisualiser.cyclePalette((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
            else if (event.key === Qt.Key_K) { panelVisualiser.cycleTracers((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
            else if (event.key === Qt.Key_Y) { panelVisualiser.randomiseVisuals(); event.accepted = true }
            else if (event.key === Qt.Key_S) { panelVisualiser.triggerShatterImpulse(); event.accepted = true }
            else if (event.key === Qt.Key_X) { panelVisualiser.toggleAllRandomisations(); event.accepted = true }
            else if (event.key === Qt.Key_Q) { panelVisualiser.toggleLayer3TextField("artist"); event.accepted = true }
            else if (event.key === Qt.Key_W) { panelVisualiser.toggleLayer3TextField("track"); event.accepted = true }
            else if (event.key === Qt.Key_E) { panelVisualiser.toggleLayer3TextField("album"); event.accepted = true }
            else if (event.key === Qt.Key_R) { panelVisualiser.toggleLayer3TextField("statements"); event.accepted = true }
            else if (event.key === Qt.Key_T) { panelVisualiser.cycleLayer3ColourMode((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
            else if (event.key === Qt.Key_B) { if (root.service) root.service.toggleAsciiMode(); event.accepted = true }
            else if (event.key === Qt.Key_D) { panelVisualiser.toggleInCanvasTte(); event.accepted = true }
            else if (event.key === Qt.Key_H) {
                if ((event.modifiers & Qt.ShiftModifier) || (panelVisualiser.layer1Enabled && panelVisualiser.layer1FieldEnabled && panelVisualiser.layer1Mode === 11)) {
                    panelVisualiser.triggerPhotoHoldByKey()
                } else {
                    panelVisualiser.toggleHudVisibility()
                }
                event.accepted = true
            }
            else if (event.key === Qt.Key_Z) {
                panelVisualiser.showHud = false
                if (root.service) root.service.fullscreenVisualiserOpen = !root.service.fullscreenVisualiserOpen
                event.accepted = true
            }
            else if (event.key === Qt.Key_F || event.key === Qt.Key_V) {
                if (event.modifiers & Qt.ShiftModifier) panelVisualiser.showHud = false
                if (root.service) root.service.fullscreenVisualiserOpen = !root.service.fullscreenVisualiserOpen
                event.accepted = true
            }
            return
        }

        if (root.activeTab === 0) {
            var albums = (root.service && root.service.albums) ? root.service.albums : []
            if (albums.length === 0) return
            var curIdx = Math.max(0, Math.min(albums.length - 1, root.focusedAlbumIndex))
            root.focusedAlbumIndex = curIdx
            var curAlbum = albums[curIdx]
            var tracks = (curAlbum && curAlbum.tracks) ? curAlbum.tracks : []
            var isExpanded = curAlbum && root.selectedAlbumId === curAlbum.id

            if (event.key === Qt.Key_Down || event.key === Qt.Key_J) {
                if (isExpanded && tracks.length > 0 && root.focusedTrackIndex < tracks.length - 1) {
                    root.focusedTrackIndex = root.focusedTrackIndex + 1
                } else if (curIdx < albums.length - 1) {
                    root.focusedAlbumIndex = curIdx + 1
                    root.focusedTrackIndex = -1
                    albumList.positionViewAtIndex(root.focusedAlbumIndex, ListView.Contain)
                }
                event.accepted = true
            } else if (event.key === Qt.Key_Up || event.key === Qt.Key_K) {
                if (isExpanded && root.focusedTrackIndex >= 0) {
                    root.focusedTrackIndex = root.focusedTrackIndex - 1
                } else if (curIdx > 0) {
                    root.focusedAlbumIndex = curIdx - 1
                    var prevAlb = albums[root.focusedAlbumIndex]
                    if (prevAlb && root.selectedAlbumId === prevAlb.id && prevAlb.tracks && prevAlb.tracks.length > 0) {
                        root.focusedTrackIndex = prevAlb.tracks.length - 1
                    } else {
                        root.focusedTrackIndex = -1
                    }
                    albumList.positionViewAtIndex(root.focusedAlbumIndex, ListView.Contain)
                }
                event.accepted = true
            } else if (event.key === Qt.Key_Right || event.key === Qt.Key_L) {
                if (curAlbum) {
                    if (!isExpanded) {
                        root.selectedAlbumId = curAlbum.id
                        root.focusedTrackIndex = 0
                        if (root.service) root.service.ensureAlbumTracks(curAlbum.id)
                    } else if (root.focusedTrackIndex < 0 && tracks.length > 0) {
                        root.focusedTrackIndex = 0
                    }
                    albumList.positionViewAtIndex(curIdx, ListView.Contain)
                }
                event.accepted = true
            } else if (event.key === Qt.Key_Left || event.key === Qt.Key_H || event.key === Qt.Key_Backspace) {
                if (isExpanded) {
                    if (root.focusedTrackIndex >= 0) {
                        root.focusedTrackIndex = -1
                    } else {
                        root.selectedAlbumId = ""
                    }
                    event.accepted = true
                }
            } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                if (!curAlbum) return
                if ((event.modifiers & Qt.ShiftModifier) && root.service) {
                    root.service.playAlbum(curAlbum.id, Math.max(0, root.focusedTrackIndex), "auto", false)
                } else if (isExpanded && root.focusedTrackIndex >= 0 && root.service) {
                    root.service.playAlbum(curAlbum.id, root.focusedTrackIndex, "auto", false)
                } else {
                    root.toggleAlbumExpand(curAlbum.id, curIdx)
                    albumList.positionViewAtIndex(curIdx, ListView.Contain)
                }
                event.accepted = true
            } else if (event.key === Qt.Key_P) {
                if (curAlbum && root.service) {
                    root.service.playAlbum(curAlbum.id, Math.max(0, root.focusedTrackIndex), "auto", false)
                }
                event.accepted = true
            } else if (event.key === Qt.Key_A || event.key === Qt.Key_Plus) {
                if (curAlbum && root.service) {
                    if (isExpanded && root.focusedTrackIndex >= 0 && root.focusedTrackIndex < tracks.length) {
                        var tr = tracks[root.focusedTrackIndex]
                        root.service.addTrackOrCreatePlaylist(tr.id, tr.title, curAlbum.artist, root.selectedPlaylistId)
                    } else {
                        root.service.addAlbumOrCreatePlaylist(curAlbum.id, curAlbum.title, curAlbum.artist, root.selectedPlaylistId)
                    }
                }
                event.accepted = true
            } else if (event.key === Qt.Key_Escape) {
                if (root.selectedAlbumId !== "") {
                    root.selectedAlbumId = ""
                    root.focusedTrackIndex = -1
                    event.accepted = true
                }
            }
        } else if (root.activeTab === 1) {
            var smartTracks = (root.service && root.service.smartPlaylist && root.service.smartPlaylist.tracks) ? root.service.smartPlaylist.tracks : []
            var customPls = (root.service && root.service.playlists) ? root.service.playlists : []
            var curPlIdx = customPls.length > 0 ? Math.max(0, Math.min(customPls.length - 1, root.focusedPlaylistIndex)) : 0
            root.focusedPlaylistIndex = curPlIdx
            var curPl = customPls.length > 0 ? customPls[curPlIdx] : null
            var curPlTracks = (curPl && curPl.tracks) ? curPl.tracks : []
            var isPlExpanded = Boolean(curPl && root.selectedPlaylistId === curPl.id)

            if (event.key === Qt.Key_Left || event.key === Qt.Key_H || event.key === Qt.Key_Backspace) {
                if (root.playlistPaneFocus === 1 && isPlExpanded) {
                    if (root.focusedPlaylistTrackIndex >= 0) {
                        root.focusedPlaylistTrackIndex = -1
                    } else {
                        root.selectedPlaylistId = ""
                    }
                } else {
                    root.playlistPaneFocus = 0
                }
                event.accepted = true
            } else if (event.key === Qt.Key_Right || event.key === Qt.Key_L) {
                if (root.playlistPaneFocus === 0) {
                    root.playlistPaneFocus = 1
                } else if (curPl) {
                    if (!isPlExpanded) {
                        root.selectedPlaylistId = curPl.id
                        root.focusedPlaylistTrackIndex = curPlTracks.length > 0 ? 0 : -1
                    } else if (root.focusedPlaylistTrackIndex < 0 && curPlTracks.length > 0) {
                        root.focusedPlaylistTrackIndex = 0
                    }
                }
                event.accepted = true
            } else if (event.key === Qt.Key_Down || event.key === Qt.Key_J) {
                if (root.playlistPaneFocus === 0 && smartTracks.length > 0) {
                    root.focusedSmartTrackIndex = Math.min(smartTracks.length - 1, root.focusedSmartTrackIndex + 1)
                    smartPlaylistList.positionViewAtIndex(root.focusedSmartTrackIndex, ListView.Contain)
                } else if (root.playlistPaneFocus === 1 && customPls.length > 0) {
                    if (isPlExpanded && curPlTracks.length > 0 && root.focusedPlaylistTrackIndex < curPlTracks.length - 1) {
                        root.focusedPlaylistTrackIndex = root.focusedPlaylistTrackIndex + 1
                    } else if (curPlIdx < customPls.length - 1) {
                        root.focusedPlaylistIndex = curPlIdx + 1
                        root.focusedPlaylistTrackIndex = -1
                        customPlaylistList.positionViewAtIndex(root.focusedPlaylistIndex, ListView.Contain)
                    }
                }
                event.accepted = true
            } else if (event.key === Qt.Key_Up || event.key === Qt.Key_K) {
                if (root.playlistPaneFocus === 0 && smartTracks.length > 0) {
                    root.focusedSmartTrackIndex = Math.max(0, root.focusedSmartTrackIndex - 1)
                    smartPlaylistList.positionViewAtIndex(root.focusedSmartTrackIndex, ListView.Contain)
                } else if (root.playlistPaneFocus === 1 && customPls.length > 0) {
                    if (isPlExpanded && root.focusedPlaylistTrackIndex >= 0) {
                        root.focusedPlaylistTrackIndex = root.focusedPlaylistTrackIndex - 1
                    } else if (curPlIdx > 0) {
                        root.focusedPlaylistIndex = curPlIdx - 1
                        var prevPl = customPls[root.focusedPlaylistIndex]
                        if (prevPl && root.selectedPlaylistId === prevPl.id && prevPl.tracks && prevPl.tracks.length > 0) {
                            root.focusedPlaylistTrackIndex = prevPl.tracks.length - 1
                        } else {
                            root.focusedPlaylistTrackIndex = -1
                        }
                        customPlaylistList.positionViewAtIndex(root.focusedPlaylistIndex, ListView.Contain)
                    }
                }
                event.accepted = true
            } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                if (root.playlistPaneFocus === 0 && smartTracks.length > 0 && root.service) {
                    root.service.playSmartPlaylist(root.service.smartPreset, "", root.focusedSmartTrackIndex)
                } else if (root.playlistPaneFocus === 1 && curPl) {
                    if ((event.modifiers & Qt.ShiftModifier) && root.service) {
                        root.service.playPlaylist(curPl.id, Math.max(0, root.focusedPlaylistTrackIndex), false)
                    } else if (isPlExpanded && root.focusedPlaylistTrackIndex >= 0 && root.service) {
                        root.service.playPlaylist(curPl.id, root.focusedPlaylistTrackIndex, false)
                    } else {
                        if (isPlExpanded) {
                            root.selectedPlaylistId = ""
                            root.focusedPlaylistTrackIndex = -1
                        } else {
                            root.selectedPlaylistId = curPl.id
                            root.focusedPlaylistTrackIndex = curPlTracks.length > 0 ? 0 : -1
                        }
                    }
                }
                event.accepted = true
            } else if (event.key === Qt.Key_P) {
                if (root.playlistPaneFocus === 0 && smartTracks.length > 0 && root.service) {
                    root.service.playSmartPlaylist(root.service.smartPreset, "", root.focusedSmartTrackIndex)
                } else if (root.playlistPaneFocus === 1 && curPl && root.service) {
                    root.service.playPlaylist(curPl.id, Math.max(0, root.focusedPlaylistTrackIndex), false)
                }
                event.accepted = true
            } else if (event.key === Qt.Key_Escape) {
                if (root.selectedPlaylistId !== "") {
                    root.selectedPlaylistId = ""
                    root.focusedPlaylistTrackIndex = -1
                    event.accepted = true
                }
            }
        }
    }

    Timer {
        interval: 250
        repeat: true
        running: Boolean(!root.service && root.shell && typeof root.shell.serviceFor === "function")
        onTriggered: {
            var svc = root.shell.serviceFor("io.github.layolayo.bandarchy")
            if (svc) root.service = svc
        }
    }

    function syncVisualiserActive() {
        if (!root.service) return
        var stageOn = (panelVisualiser.stageMode === "visualiser" || panelVisualiser.stageMode === "turntable")
        root.service.visualiserActive = Boolean((root.opened || root.standaloneMode) && root.visible && root.activeTab === 2 && stageOn)
    }

    function open(payloadJson) {
        root.opened = true
        if (!root.service && root.shell && typeof root.shell.serviceFor === "function") {
            root.service = root.shell.serviceFor("io.github.layolayo.bandarchy")
        }
        if (root.service) {
            root.service.refreshStatus()
            root.service.loadCollection(root.service.activeScope, root.service.searchQuery)
            root.service.loadPlaylists()
            root.service.refreshSmartPlaylist(root.service.smartPreset, "")
            root.syncVisualiserActive()
            if (root.activeTab === 2) {
                root.service.refreshAsciiArt()
            }
        }
    }

    function close() {
        root.opened = false
        if (root.service) {
            root.service.visualiserActive = false
        }
    }

    function toggle() {
        if (root.opened) root.close()
        else root.open("{}")
    }

    onVisibleChanged: {
        if (!root.visible && !root.standaloneMode) {
            root.opened = false
        }
        root.syncVisualiserActive()
    }

    onActiveTabChanged: {
        if (service) {
            root.syncVisualiserActive()
            if (activeTab === 2 && (root.opened || root.standaloneMode) && root.visible) service.refreshAsciiArt()
            if (activeTab === 1 && (root.opened || root.standaloneMode) && root.visible) {
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

    // Full-screen Wayland Overlay Window for the 4-Stage / 3-Layer Visualiser
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
                id: fsVisualiser
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
                bannerLines: root.service ? root.service.bannerLines : []
                artLines: root.service ? root.service.artLines : []
                ttfxFrames: root.service ? root.service.ttfxFrames : []
                useAlbumArt: root.service ? root.service.useAlbumArt : false
                asciiMode: root.service ? root.service.asciiMode : "braille"
                asciiSource: root.service ? root.service.asciiSource : "album-art"
                photoCategories: root.service ? root.service.photoCategories : []
                photoCategoryCounts: root.service ? root.service.photoCategoryCounts : ({})
                photoActiveCategory: root.service ? root.service.photoActiveCategory : "all"
                photoActiveStem: root.service ? root.service.photoActiveStem : ""
                photoActiveVariants: root.service ? root.service.photoActiveVariants : ({})
                photoSameEffectPeers: root.service ? root.service.photoSameEffectPeers : ({})
                photoSameEffectByVariant: root.service ? root.service.photoSameEffectByVariant : ({})
                photoRandomPoolPeers: root.service ? root.service.photoRandomPoolPeers : ({})
                photoTotalProcessed: root.service ? root.service.photoTotalProcessed : 0
                photoTotalOriginals: root.service ? root.service.photoTotalOriginals : 0
                photoCustomDir: root.service ? root.service.photoCustomDir : ""
                photoBusy: root.service ? root.service.photoBusy : false
                photoStatusMessage: root.service ? root.service.photoStatusMessage : ""
                accentColour: root.colAccent
                urgentColour: root.colUrgent
                foregroundColour: root.colFg
                backgroundColour: root.colBg
                persistedConfig: root.service ? root.service.visualiserConfig : ({})

                onRequestToggleFullscreen: {
                    if (root.service) root.service.fullscreenVisualiserOpen = false
                }
                onRequestCloseVisualiser: {
                    if (root.service) root.service.fullscreenVisualiserOpen = false
                }
                onRequestPlayPause: if (root.service) root.service.togglePlayPause()
                onRequestNext: if (root.service) root.service.nextTrack()
                onRequestPrev: if (root.service) root.service.prevTrack()
                onRequestSeek: sec => { if (root.service) root.service.seekTo(sec) }
                onRequestToggleUseAlbumArt: if (root.service) root.service.toggleUseAlbumArt()
                onRequestToggleAsciiMode: if (root.service) root.service.toggleAsciiMode()
                onRequestSetAsciiSourceMode: modeStr => { if (root.service) root.service.setAsciiSourceMode(modeStr) }
                onRequestLaunchTtfxScreensaver: effectName => {
                    if (root.service) root.service.launchTtfxScreensaver(effectName)
                }
                onRequestSelectTtfxEffect: effectName => {
                    if (root.service) root.service.setTtfxEffect(effectName)
                }
                onRequestStageModeChange: newStageMode => {
                    if (root.service) root.service.setStageMode(newStageMode)
                }
                onRequestActionFeedback: msg => {}
                onRequestSaveVisualiserConfig: cfg => {
                    if (root.service) root.service.saveVisualiserConfig(cfg)
                }
                onRequestOpenStatementsFile: {
                    if (root.service) root.service.openStatementsFile()
                }
                onRequestReloadStatementsFile: {
                    if (root.service) root.service.loadVisualiserConfig()
                }
                onRequestSaveStatements: statementsArr => {
                    if (root.service) root.service.saveStatements(statementsArr)
                }
                onRequestResetStatements: {
                    if (root.service) root.service.resetStatementsFile()
                }
                onRequestPhotoImport: srcDir => {
                    if (root.service) root.service.importPhotos(srcDir)
                }
                onRequestPhotoRefreshStatus: {
                    if (root.service) root.service.refreshPhotoStatus()
                }
                onRequestPhotoPick: (cat, stem) => {
                    if (root.service) root.service.pickPhoto(cat, stem)
                }

                Connections {
                    target: root.service
                    function onUseAlbumArtChanged() {
                        if (root.service && fsVisualiser.useAlbumArt !== root.service.useAlbumArt) {
                            fsVisualiser.useAlbumArt = root.service.useAlbumArt
                        }
                    }
                    function onAsciiModeChanged() {
                        if (root.service && fsVisualiser.asciiMode !== root.service.asciiMode) {
                            fsVisualiser.asciiMode = root.service.asciiMode
                        }
                    }
                }
            }
        }
    }

    FloatingWindow {
        id: panelWindow
        title: "Bandarchy — Bandcamp & Local Lossless Player"
        implicitWidth: root.contentPreferredWidth
        implicitHeight: root.contentPreferredHeight
        minimumSize: Qt.size(700, 540)
        color: root.colBg
        visible: root.opened || root.standaloneMode

        onVisibleChanged: {
            if (visible) {
                Qt.callLater(function() { panelFrame.forceActiveFocus() })
                return
            }
            if (root.opened) {
                root.close()
                if (root.shell && typeof root.shell.hide === "function") {
                    root.shell.hide("io.github.layolayo.bandarchy")
                }
            }
        }

        Rectangle {
            id: panelFrame
            anchors.fill: parent
            focus: true
            radius: root.standaloneMode ? 0 : Commons.Style.cornerRadius
            color: root.colBg
            border.width: root.standaloneMode ? 0 : 1
            border.color: root.colBorder
            clip: true

            Keys.onPressed: event => {
                root.handleKeyNavigation(event)
                if (!event.accepted && event.key === Qt.Key_Escape) {
                    if (root.shell && typeof root.shell.hide === "function") {
                        root.shell.hide("io.github.layolayo.bandarchy")
                    } else {
                        root.close()
                    }
                    event.accepted = true
                }
            }

            ColumnLayout {
                anchors.fill: parent
                anchors.margins: 12
                spacing: 8

                // ---------------------------------------------------------------
                // 1. Header, Account Pill, Activity Toast & Navigation Tabs
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
                        spacing: 1
                        RowLayout {
                            spacing: 6
                            Text {
                                text: "BANDARCHY"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 13
                                font.bold: true
                                color: root.colFg
                            }

                            ActionPill {
                                text: (root.service && root.service.username)
                                    ? ("󰀄 @" + root.service.username + (root.service.authenticated ? " · Verified" : ""))
                                    : "󰍂 Log In"
                                active: Boolean(root.service && root.service.username)
                                danger: Boolean(!root.service || !root.service.username)
                                fontSize: 9
                                horizontalPad: 7
                                pillHeight: 20
                                onClicked: {
                                    root.activeTab = 3
                                    panelFrame.forceActiveFocus()
                                }
                            }
                        }
                        Text {
                            text: root.service
                                ? (root.service.purchasedCount + " Purchased · " +
                                   root.service.localCount + " Local (" + root.service.trackCount + " tracks)")
                                : "Bandcamp & Local Lossless Player"
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 10
                            color: root.colMuted
                        }
                    }

                    // Activity Toast Banner
                    Rectangle {
                        visible: Boolean(root.service && root.service.activityMessage !== "")
                        Layout.preferredHeight: 22
                        Layout.preferredWidth: Math.min(240, panelActivityTxt.implicitWidth + 14)
                        radius: 4
                        color: Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.18)
                        border.width: 1
                        border.color: root.colAccent

                        Text {
                            id: panelActivityTxt
                            anchors.centerIn: parent
                            width: parent.width - 10
                            text: "󰄬 " + (root.service ? root.service.activityMessage : "")
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 9
                            font.bold: true
                            color: root.colAccent
                            elide: Text.ElideRight
                        }
                    }

                    Item { Layout.fillWidth: true }

                    // Navigation Tab Pills
                    Repeater {
                        model: [
                            { idx: 0, label: "󰲸 Library" },
                            { idx: 1, label: "󰐑 Playlists" },
                            { idx: 2, label: "󰍹 Visuals" },
                            { idx: 3, label: "󰀄 Account & Sync" }
                        ]

                        delegate: ActionPill {
                            required property var modelData
                            text: modelData.label
                            active: root.activeTab === modelData.idx
                            fontSize: 10
                            horizontalPad: 10
                            pillHeight: 28
                            onClicked: {
                                root.activeTab = modelData.idx
                                panelFrame.forceActiveFocus()
                            }
                        }
                    }

                    // Launch Standalone Window button (when in panel mode)
                    ActionPill {
                        visible: !root.standaloneMode
                        text: "󰖯"
                        fontSize: 12
                        horizontalPad: 8
                        pillHeight: 28
                        onClicked: if (root.service) root.service.launchStandalonePlayer()
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
                        spacing: 6

                        // Search Bar + Scope Filter Pills
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 6

                            Rectangle {
                                Layout.fillWidth: true
                                Layout.preferredHeight: 30
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
                                        font.pixelSize: 11
                                        color: root.colFg
                                        clip: true
                                        selectByMouse: true
                                        onTextEdited: {
                                            root.focusedAlbumIndex = 0
                                            root.focusedTrackIndex = -1
                                            if (root.service) {
                                                root.service.loadCollection(root.service.activeScope, text)
                                            }
                                        }
                                        Keys.onPressed: event => root.handleKeyNavigation(event)

                                        Text {
                                            anchors.fill: parent
                                            verticalAlignment: Text.AlignVCenter
                                            text: "Search Bandcamp purchases, artists, albums, or local tracks… (/)"
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 10
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
                                                root.focusedAlbumIndex = 0
                                                root.focusedTrackIndex = -1
                                                if (root.service) root.service.loadCollection(root.service.activeScope, "")
                                                panelFrame.forceActiveFocus()
                                            }
                                        }
                                    }
                                }
                            }

                            Repeater {
                                model: [
                                    { scope: "all", label: "All" },
                                    { scope: "purchased", label: "Purchased" },
                                    { scope: "local", label: "Local" },
                                    { scope: "cloud", label: "Stream" }
                                ]

                                delegate: ActionPill {
                                    required property var modelData
                                    text: modelData.label
                                    active: Boolean(root.service && root.service.activeScope === modelData.scope)
                                    fontSize: 10
                                    horizontalPad: 9
                                    pillHeight: 30
                                    onClicked: {
                                        root.focusedAlbumIndex = 0
                                        root.focusedTrackIndex = -1
                                        if (root.service) {
                                            root.service.loadCollection(modelData.scope, searchInput.text)
                                        }
                                        panelFrame.forceActiveFocus()
                                    }
                                }
                            }

                            ActionPill {
                                text: "󰒟 Shuffle"
                                active: true
                                fontSize: 10
                                horizontalPad: 9
                                pillHeight: 30
                                onClicked: {
                                    if (root.service) {
                                        var sc = root.service.activeScope === "cloud" ? "purchased" : root.service.activeScope
                                        root.service.playScope(sc, true)
                                    }
                                    panelFrame.forceActiveFocus()
                                }
                            }

                            ActionPill {
                                text: (root.service && root.service.syncing) ? "󰑐 Syncing…" : "󰑐 Sync"
                                active: Boolean(root.service && root.service.syncing)
                                fontSize: 10
                                horizontalPad: 9
                                pillHeight: 30
                                onClicked: {
                                    if (root.service && !root.service.syncing) {
                                        root.service.syncCollection(root.service.activeScope === "local")
                                    }
                                    panelFrame.forceActiveFocus()
                                }
                            }
                        }

                        // Keyboard Navigation Hint Bar
                        Text {
                            Layout.fillWidth: true
                            text: "󰌌 Keys: ↑↓/jk Navigate · Enter/→ Expand Tracks & Info · ←/Esc Collapse · p Play Album · a/+ +Playlist · / Search"
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 9
                            color: root.colMuted
                            elide: Text.ElideRight
                        }

                        // Album List View + Interactive Vertical Scrollbar
                        Item {
                            Layout.fillWidth: true
                            Layout.fillHeight: true

                            ListView {
                                id: albumList
                                anchors.fill: parent
                                clip: true
                                spacing: 6
                                boundsBehavior: Flickable.StopAtBounds
                                model: root.service ? root.service.albums : []
                                onModelChanged: {
                                    Qt.callLater(function() {
                                        if (root.focusedAlbumIndex >= 0 && albumList.count > root.focusedAlbumIndex) {
                                            albumList.positionViewAtIndex(root.focusedAlbumIndex, ListView.Contain)
                                        }
                                    })
                                }

                                delegate: Rectangle {
                                    id: albumCard
                                    required property var modelData
                                    required property int index
                                    readonly property bool expanded: root.selectedAlbumId === modelData.id
                                    readonly property bool isCurrentAlbum: root.service && root.service.albumId === modelData.id
                                    readonly property bool isKeyboardFocused: root.focusedAlbumIndex === index
                                    readonly property var tracksList: modelData.tracks || []
                                    readonly property bool isAlbumDownloading: Boolean(root.service && root.service.downloading && root.service.downloadAlbumId === modelData.id)

                                    width: albumList.width - 12
                                    height: expanded
                                        ? (66 + panelAlbumInfoBox.implicitHeight + Math.min(Math.max(tracksList.length, 1), 8) * 28 + 24)
                                        : 62
                                    radius: 8
                                    color: isCurrentAlbum
                                        ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.14)
                                        : (isKeyboardFocused
                                            ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.08)
                                            : root.colSurface)
                                    border.width: (isCurrentAlbum || isKeyboardFocused || expanded) ? 1.5 : 1
                                    border.color: (isCurrentAlbum || isKeyboardFocused || expanded) ? root.colAccent : root.colBorder

                                    ColumnLayout {
                                        anchors.fill: parent
                                        anchors.margins: 8
                                        spacing: 6

                                        RowLayout {
                                            Layout.fillWidth: true
                                            Layout.preferredHeight: 46
                                            spacing: 8

                                            // Cover Art thumbnail
                                            Rectangle {
                                                Layout.preferredWidth: 44
                                                Layout.preferredHeight: 44
                                                radius: 6
                                                color: "#121620"
                                                border.width: 1
                                                border.color: root.colBorder
                                                clip: true

                                                Image {
                                                    id: artThumb
                                                    anchors.fill: parent
                                                    source: (modelData.artPath && String(modelData.artPath).indexOf("/") === 0 && String(modelData.artPath).indexOf("..") < 0)
                                                        ? ("file://" + modelData.artPath)
                                                        : ""
                                                    sourceSize: Qt.size(88, 88)
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
                                                        root.focusedAlbumIndex = albumCard.index
                                                        if (root.service) root.service.playAlbum(modelData.id, 0, "auto", false)
                                                        panelFrame.forceActiveFocus()
                                                    }
                                                }
                                            }

                                            // Album Title, Artist & Left-Aligned Info Tag (clipped so text never overflows behind right buttons)
                                            Item {
                                                Layout.fillWidth: true
                                                Layout.preferredHeight: 44
                                                clip: true

                                                ColumnLayout {
                                                    anchors.fill: parent
                                                    spacing: 3

                                                    Text {
                                                        Layout.fillWidth: true
                                                        text: (modelData.title || "Untitled Album")
                                                        textFormat: Text.PlainText
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 12
                                                        font.bold: true
                                                        color: (albumCard.isCurrentAlbum || albumCard.isKeyboardFocused) ? root.colAccent : root.colFg
                                                        elide: Text.ElideRight
                                                    }

                                                    RowLayout {
                                                        Layout.fillWidth: true
                                                        spacing: 5

                                                        Rectangle {
                                                            Layout.preferredHeight: 15
                                                            Layout.preferredWidth: locTxt.implicitWidth + 6
                                                            radius: 3
                                                            color: modelData.isLocal
                                                                ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.14)
                                                                : Qt.rgba(root.colFg.r, root.colFg.g, root.colFg.b, 0.08)
                                                            border.width: 0
                                                            Text {
                                                                id: locTxt
                                                                anchors.centerIn: parent
                                                                text: modelData.isLocal ? "LOCAL" : "CLOUD"
                                                                textFormat: Text.PlainText
                                                                font.family: "JetBrainsMono Nerd Font"
                                                                font.pixelSize: 8
                                                                font.bold: true
                                                                color: modelData.isLocal ? root.colAccent : root.colMuted
                                                            }
                                                        }

                                                        Text {
                                                            Layout.fillWidth: true
                                                            text: (modelData.artist || "Unknown Artist") + " · " + (modelData.numTracks || tracksList.length || 0) + " trk"
                                                            textFormat: Text.PlainText
                                                            font.family: "JetBrainsMono Nerd Font"
                                                            font.pixelSize: 10
                                                            color: root.colMuted
                                                            elide: Text.ElideRight
                                                        }
                                                    }
                                                }

                                                MouseArea {
                                                    anchors.fill: parent
                                                    cursorShape: Qt.PointingHandCursor
                                                    onClicked: {
                                                        root.toggleAlbumExpand(modelData.id, albumCard.index)
                                                        panelFrame.forceActiveFocus()
                                                    }
                                                }
                                            }

                                            // Compact Action buttons: Save/Download, Play, +Playlist, Expand Tracks
                                            RowLayout {
                                                spacing: 4

                                                ActionPill {
                                                    visible: !modelData.isLocal && Boolean(modelData.purchased || modelData.tralbumId || modelData.url)
                                                    text: albumCard.isAlbumDownloading
                                                        ? ("󰇚 " + (root.service.downloadTrackTotal > 0
                                                            ? (root.service.downloadTrackIndex + "/" + root.service.downloadTrackTotal + " (" + root.service.downloadPercent + "%)")
                                                            : (root.service.downloadPercent + "%")))
                                                        : "󰇚 Save"
                                                    active: albumCard.isAlbumDownloading
                                                    fontSize: 9
                                                    horizontalPad: 6
                                                    pillHeight: 24
                                                    onClicked: {
                                                        if (root.service) root.service.downloadAlbum(modelData.id, "flac")
                                                        panelFrame.forceActiveFocus()
                                                    }
                                                }

                                                ActionPill {
                                                    text: albumCard.isCurrentAlbum
                                                        ? ((root.service && root.service.activelyPlaying) ? "󰏤 Playing" : "󰐊 Paused")
                                                        : "󰐊 Play"
                                                    primary: albumCard.isCurrentAlbum
                                                    active: !albumCard.isCurrentAlbum
                                                    fontSize: 9
                                                    horizontalPad: 7
                                                    pillHeight: 24
                                                    onClicked: {
                                                        root.focusedAlbumIndex = albumCard.index
                                                        if (root.service) {
                                                            if (albumCard.isCurrentAlbum) {
                                                                root.service.togglePlayPause()
                                                            } else {
                                                                root.service.playAlbum(modelData.id, 0, "auto", false)
                                                            }
                                                        }
                                                        panelFrame.forceActiveFocus()
                                                    }
                                                }

                                                ActionPill {
                                                    text: "󰐑"
                                                    fontSize: 10
                                                    horizontalPad: 6
                                                    pillHeight: 24
                                                    onClicked: {
                                                        if (!root.service) return
                                                        root.service.addAlbumOrCreatePlaylist(
                                                            modelData.id,
                                                            modelData.title,
                                                            modelData.artist,
                                                            root.selectedPlaylistId
                                                        )
                                                        panelFrame.forceActiveFocus()
                                                    }
                                                }

                                                ActionPill {
                                                    text: albumCard.expanded ? "󰅃" : "󰅀"
                                                    active: albumCard.expanded
                                                    fontSize: 10
                                                    horizontalPad: 6
                                                    pillHeight: 24
                                                    onClicked: {
                                                        root.toggleAlbumExpand(modelData.id, albumCard.index)
                                                        panelFrame.forceActiveFocus()
                                                    }
                                                }
                                            }
                                        }

                                        // =======================================================
                                        // EXPANDED ALBUM INFO BREAKDOWN BOX (UN-TRUNCATED)
                                        // =======================================================
                                        Rectangle {
                                            id: panelAlbumInfoBox
                                            visible: albumCard.expanded
                                            Layout.fillWidth: true
                                            implicitHeight: panelAlbumInfoCol.implicitHeight + 14
                                            radius: 6
                                            color: Qt.rgba(root.colFg.r, root.colFg.g, root.colFg.b, 0.04)
                                            border.width: 1
                                            border.color: Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.35)

                                            ColumnLayout {
                                                id: panelAlbumInfoCol
                                                anchors.fill: parent
                                                anchors.margins: 7
                                                spacing: 4

                                                RowLayout {
                                                    Layout.fillWidth: true
                                                    spacing: 6

                                                    Text {
                                                        Layout.fillWidth: true
                                                        text: "󰋼 ALBUM BREAKDOWN · " + (modelData.title || "Untitled") + " — " + (modelData.artist || "Unknown Artist")
                                                        textFormat: Text.PlainText
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 10
                                                        font.bold: true
                                                        color: root.colAccent
                                                        wrapMode: Text.WordWrap
                                                    }

                                                    ActionPill {
                                                        visible: Boolean(modelData.url)
                                                        text: "󰖟 Bandcamp Page"
                                                        fontSize: 9
                                                        horizontalPad: 7
                                                        pillHeight: 20
                                                        onClicked: if (root.service) root.service.openExternal(modelData.url, "Opened Bandcamp page in browser")
                                                    }

                                                    ActionPill {
                                                        visible: Boolean(modelData.localPath)
                                                        text: "󰉋 Local Folder"
                                                        fontSize: 9
                                                        horizontalPad: 7
                                                        pillHeight: 20
                                                        onClicked: if (root.service) root.service.openExternal(modelData.localPath, "Opened local album folder")
                                                    }
                                                }

                                                Text {
                                                    Layout.fillWidth: true
                                                    text: "• Collection Status: " +
                                                          (modelData.purchased
                                                            ? ("PURCHASED — Owned in Bandcamp Collection" + (root.service && root.service.username ? (" (@" + root.service.username + ")") : ""))
                                                            : "LOCAL LIBRARY — Imported from local disk") +
                                                          "\n• Playback & Format: " +
                                                          (modelData.isLocal
                                                            ? ("LOCAL DISK — " + (modelData.audioFormat || "Local Audio") + " · " + (modelData.numTracks || tracksList.length || 0) + " tracks" + (modelData.totalDuration > 0 ? (" · Total " + root.formatDuration(modelData.totalDuration)) : ""))
                                                            : ("BANDCAMP CLOUD STREAM — Direct bcbits stream · " + (modelData.numTracks || tracksList.length || 0) + " tracks (Click 󰇚 Download to save lossless copy locally)")) +
                                                          (modelData.localPath ? ("\n• Local Path: " + modelData.localPath) : "") +
                                                          (modelData.url ? ("\n• Bandcamp URL: " + modelData.url) : "")
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 9
                                                    color: root.colMuted
                                                    wrapMode: Text.WrapAnywhere
                                                }
                                            }
                                        }

                                        // Expanded Track List Drawer
                                        ListView {
                                            id: albumTracksListView
                                            Layout.fillWidth: true
                                            Layout.fillHeight: true
                                            visible: albumCard.expanded
                                            clip: true
                                            spacing: 2
                                            model: albumCard.expanded ? albumCard.tracksList : []
                                            currentIndex: albumCard.isKeyboardFocused ? root.focusedTrackIndex : -1
                                            onCurrentIndexChanged: {
                                                if (currentIndex >= 0 && count > currentIndex) {
                                                    positionViewAtIndex(currentIndex, ListView.Contain)
                                                }
                                            }

                                            delegate: Rectangle {
                                                required property var modelData
                                                required property int index
                                                readonly property bool isTrackPlaying: Boolean(root.service && root.service.trackId === modelData.id)
                                                readonly property bool isTrackFocused: albumCard.isKeyboardFocused && root.focusedTrackIndex === index
                                                width: ListView.view.width
                                                height: 26
                                                radius: 4
                                                color: isTrackPlaying
                                                    ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.24)
                                                    : (isTrackFocused
                                                        ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.16)
                                                        : Qt.rgba(1, 1, 1, index % 2 === 0 ? 0.03 : 0.0))
                                                border.width: isTrackFocused ? 1 : 0
                                                border.color: root.colAccent

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
                                                        color: (isTrackPlaying || isTrackFocused) ? root.colAccent : root.colMuted
                                                    }

                                                    Text {
                                                        Layout.fillWidth: true
                                                        text: modelData.title || ("Track " + (index + 1))
                                                        textFormat: Text.PlainText
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 11
                                                        font.bold: isTrackPlaying || isTrackFocused
                                                        color: (isTrackPlaying || isTrackFocused) ? root.colAccent : root.colFg
                                                        elide: Text.ElideRight

                                                        MouseArea {
                                                            anchors.fill: parent
                                                            cursorShape: Qt.PointingHandCursor
                                                            onClicked: {
                                                                root.focusedAlbumIndex = albumCard.index
                                                                root.focusedTrackIndex = index
                                                                if (root.service) {
                                                                    root.service.playAlbum(albumCard.modelData.id, index, "auto", false)
                                                                }
                                                                panelFrame.forceActiveFocus()
                                                            }
                                                        }
                                                    }

                                                    ActionPill {
                                                        text: isTrackPlaying ? ((root.service && root.service.activelyPlaying) ? "󰏤 Pause" : "󰐊 Play") : "󰐊 Play"
                                                        primary: isTrackPlaying
                                                        active: !isTrackPlaying
                                                        fontSize: 9
                                                        horizontalPad: 6
                                                        pillHeight: 20
                                                        onClicked: {
                                                            root.focusedAlbumIndex = albumCard.index
                                                            root.focusedTrackIndex = index
                                                            if (root.service) {
                                                                if (isTrackPlaying) {
                                                                    root.service.togglePlayPause()
                                                                } else {
                                                                    root.service.playAlbum(albumCard.modelData.id, index, "auto", false)
                                                                }
                                                            }
                                                            panelFrame.forceActiveFocus()
                                                        }
                                                    }

                                                    ActionPill {
                                                        text: "󰐑 +List"
                                                        fontSize: 9
                                                        horizontalPad: 6
                                                        pillHeight: 20
                                                        onClicked: {
                                                            root.focusedAlbumIndex = albumCard.index
                                                            root.focusedTrackIndex = index
                                                            if (root.service) {
                                                                root.service.addTrackOrCreatePlaylist(
                                                                    modelData.id,
                                                                    modelData.title,
                                                                    albumCard.modelData.artist,
                                                                    root.selectedPlaylistId
                                                                )
                                                            }
                                                            panelFrame.forceActiveFocus()
                                                        }
                                                    }

                                                    ActionPill {
                                                        text: "󰐑 Radio"
                                                        active: true
                                                        fontSize: 9
                                                        horizontalPad: 6
                                                        pillHeight: 20
                                                        onClicked: {
                                                            if (root.service) {
                                                                root.service.refreshSmartPlaylist("radio", modelData.id)
                                                                root.activeTab = 1
                                                            }
                                                            panelFrame.forceActiveFocus()
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
                                            }
                                        }
                                    }
                                }
                            }

                            ListScroller {
                                flickable: albumList
                            }
                        }

                        // =======================================================
                        // PERSISTENT BOTTOM OF COLLECTION LIST:
                        // LIVE DOWNLOAD & SYNC PROGRESS FOOTER ("Downloading 4/10 (23%)")
                        // =======================================================
                        Rectangle {
                            id: panelDownloadFooter
                            Layout.fillWidth: true
                            Layout.preferredHeight: (root.service && (root.service.downloading || root.service.syncing)) ? 42 : 26
                            radius: 6
                            color: (root.service && (root.service.downloading || root.service.syncing))
                                ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.14)
                                : root.colSurface
                            border.width: 1
                            border.color: (root.service && (root.service.downloading || root.service.syncing))
                                ? root.colAccent
                                : root.colBorder

                            ColumnLayout {
                                anchors.fill: parent
                                anchors.leftMargin: 8
                                anchors.rightMargin: 8
                                anchors.topMargin: 3
                                anchors.bottomMargin: 3
                                spacing: 2

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 6

                                    Text {
                                        Layout.fillWidth: true
                                        text: {
                                            if (!root.service) return "Bandarchy Collection"
                                            if (root.service.downloading || root.service.syncing) {
                                                return "󰇚 " + root.service.downloadStatusSummary
                                            }
                                            if (root.service.downloadStatusText !== "") {
                                                return "󰄬 " + root.service.downloadStatusText
                                            }
                                            return "󰀥 Collection Ready · " + root.service.purchasedCount + " Purchased · " + root.service.localCount + " Local"
                                        }
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 10
                                        font.bold: Boolean(root.service && (root.service.downloading || root.service.syncing))
                                        color: (root.service && (root.service.downloading || root.service.syncing)) ? root.colAccent : root.colMuted
                                        elide: Text.ElideRight
                                    }

                                    Text {
                                        visible: Boolean(root.service && root.service.downloading)
                                        text: root.service
                                            ? ((root.service.downloadTrackTotal > 0
                                                ? (root.service.downloadTrackIndex + "/" + root.service.downloadTrackTotal + " ")
                                                : "") + "(" + root.service.downloadPercent + "%)")
                                            : ""
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 10
                                        font.bold: true
                                        color: root.colAccent
                                    }
                                }

                                Rectangle {
                                    visible: Boolean(root.service && (root.service.downloading || root.service.syncing))
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 5
                                    radius: 2.5
                                    color: Qt.rgba(0, 0, 0, 0.35)

                                    Rectangle {
                                        width: (root.service && root.service.downloading)
                                            ? Math.max(6, parent.width * Math.min(1.0, Math.max(0.0, root.service.downloadPercent / 100.0)))
                                            : parent.width * 0.35
                                        height: parent.height
                                        radius: 2.5
                                        color: root.colAccent
                                        Behavior on width { NumberAnimation { duration: 180; easing.type: Easing.OutQuad } }
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

                                    ActionPill {
                                        text: "󰐊 Play Mix"
                                        primary: true
                                        fontSize: 10
                                        horizontalPad: 9
                                        pillHeight: 24
                                        onClicked: {
                                            if (root.service) root.service.playSmartPlaylist(root.service.smartPreset, "")
                                        }
                                    }

                                    ActionPill {
                                        text: "󰆓 Save"
                                        active: true
                                        fontSize: 10
                                        horizontalPad: 9
                                        pillHeight: 24
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

                                        delegate: ActionPill {
                                            required property var modelData
                                            Layout.fillWidth: true
                                            text: modelData.label
                                            active: Boolean(root.service && root.service.smartPreset === modelData.id)
                                            fontSize: 10
                                            horizontalPad: 8
                                            pillHeight: 24
                                            onClicked: {
                                                if (root.service) root.service.refreshSmartPlaylist(modelData.id, "")
                                            }
                                        }
                                    }
                                }

                                // Generated Intelligent Playlist Track List
                                Item {
                                    Layout.fillWidth: true
                                    Layout.fillHeight: true

                                    ListView {
                                        id: smartPlaylistList
                                        anchors.fill: parent
                                        clip: true
                                        spacing: 3
                                        model: (root.service && root.service.smartPlaylist && root.service.smartPlaylist.tracks)
                                            ? root.service.smartPlaylist.tracks
                                            : []

                                        delegate: Rectangle {
                                            required property var modelData
                                            required property int index
                                            readonly property bool isSmartFocused: root.playlistPaneFocus === 0 && root.focusedSmartTrackIndex === index
                                            width: ListView.view.width - 12
                                            height: 28
                                            radius: 5
                                            color: isSmartFocused
                                                ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.22)
                                                : (index === 0
                                                    ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.14)
                                                    : Qt.rgba(1, 1, 1, index % 2 === 0 ? 0.04 : 0.0))
                                            border.width: isSmartFocused ? 1 : 0
                                            border.color: root.colAccent

                                            RowLayout {
                                                anchors.fill: parent
                                                anchors.leftMargin: 8
                                                anchors.rightMargin: 8
                                                spacing: 6

                                                Text {
                                                    text: index === 0 ? "󰀥" : ((index + 1) + ".")
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 10
                                                    font.bold: isSmartFocused
                                                    color: (index === 0 || isSmartFocused) ? root.colAccent : root.colMuted
                                                }

                                                Text {
                                                    Layout.fillWidth: true
                                                    text: (modelData.title || "Track") + " — " + (modelData.artist || "")
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 10
                                                    font.bold: index === 0 || isSmartFocused
                                                    color: (index === 0 || isSmartFocused) ? root.colAccent : root.colFg
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
                                                    root.playlistPaneFocus = 0
                                                    root.focusedSmartTrackIndex = index
                                                    if (root.service) {
                                                        root.service.playSmartPlaylist(root.service.smartPreset, "", index)
                                                    }
                                                    panelFrame.forceActiveFocus()
                                                }
                                            }
                                        }
                                    }

                                    ListScroller {
                                        flickable: smartPlaylistList
                                    }
                                }
                            }
                        }

                        // Right Column: Custom User Playlists
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
                                            Keys.onPressed: event => root.handleKeyNavigation(event)

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

                                    ActionPill {
                                        text: "+ Create"
                                        primary: true
                                        fontSize: 10
                                        horizontalPad: 10
                                        pillHeight: 28
                                        onClicked: {
                                            var t = newPlaylistInput.text.trim()
                                            if (!t) t = "Custom Mix " + ((root.service && root.service.playlists) ? (root.service.playlists.length + 1) : 1)
                                            if (root.service) {
                                                root.service.createPlaylist(t, "User playlist", "", root.service.albumId, "")
                                                newPlaylistInput.text = ""
                                            }
                                            panelFrame.forceActiveFocus()
                                        }
                                    }
                                }

                                // User Playlists ListView
                                Item {
                                    Layout.fillWidth: true
                                    Layout.fillHeight: true

                                    ListView {
                                        id: customPlaylistList
                                        anchors.fill: parent
                                        clip: true
                                        spacing: 5
                                        model: root.service ? root.service.playlists : []

                                        delegate: Rectangle {
                                            id: plCard
                                            required property var modelData
                                            required property int index
                                            readonly property bool isExpanded: root.selectedPlaylistId === modelData.id
                                            readonly property bool isPlFocused: root.playlistPaneFocus === 1 && root.focusedPlaylistIndex === index
                                            readonly property var plTracks: modelData.tracks || []

                                            width: ListView.view.width - 12
                                            height: isExpanded ? (42 + Math.min(plTracks.length, 6) * 24 + 8) : 38
                                            radius: 6
                                            color: isExpanded
                                                ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.14)
                                                : (isPlFocused
                                                    ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.10)
                                                    : Qt.rgba(1, 1, 1, 0.04))
                                            border.width: (isExpanded || isPlFocused) ? 1.5 : 1
                                            border.color: (isExpanded || isPlFocused) ? root.colAccent : root.colBorder

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
                                                        color: isPlFocused ? root.colAccent : root.colFg
                                                        elide: Text.ElideRight

                                                        MouseArea {
                                                            anchors.fill: parent
                                                            cursorShape: Qt.PointingHandCursor
                                                            onClicked: {
                                                                root.playlistPaneFocus = 1
                                                                root.focusedPlaylistIndex = plCard.index
                                                                root.selectedPlaylistId = plCard.isExpanded ? "" : modelData.id
                                                                root.focusedPlaylistTrackIndex = root.selectedPlaylistId ? 0 : -1
                                                                panelFrame.forceActiveFocus()
                                                            }
                                                        }
                                                    }

                                                    ActionPill {
                                                        text: "󰐊 Play"
                                                        primary: true
                                                        fontSize: 10
                                                        horizontalPad: 8
                                                        pillHeight: 22
                                                        onClicked: {
                                                            if (root.service) root.service.playPlaylist(modelData.id, 0, false)
                                                            panelFrame.forceActiveFocus()
                                                        }
                                                    }

                                                    ActionPill {
                                                        text: "󰆴"
                                                        danger: true
                                                        fontSize: 10
                                                        horizontalPad: 6
                                                        pillHeight: 22
                                                        onClicked: {
                                                            if (root.service) root.service.deletePlaylist(modelData.id)
                                                            panelFrame.forceActiveFocus()
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
                                                    currentIndex: plCard.isPlFocused ? root.focusedPlaylistTrackIndex : -1
                                                    onCurrentIndexChanged: {
                                                        if (currentIndex >= 0 && count > currentIndex) {
                                                            positionViewAtIndex(currentIndex, ListView.Contain)
                                                        }
                                                    }

                                                    delegate: Rectangle {
                                                        required property var modelData
                                                        required property int index
                                                        readonly property bool isPlTrackFocused: plCard.isPlFocused && root.focusedPlaylistTrackIndex === index
                                                        width: ListView.view.width
                                                        height: 22
                                                        radius: 3
                                                        color: isPlTrackFocused
                                                            ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.20)
                                                            : Qt.rgba(1, 1, 1, 0.03)
                                                        border.width: isPlTrackFocused ? 1 : 0
                                                        border.color: root.colAccent

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
                                                                font.bold: isPlTrackFocused
                                                                color: isPlTrackFocused ? root.colAccent : root.colFg
                                                                elide: Text.ElideRight

                                                                MouseArea {
                                                                    anchors.fill: parent
                                                                    cursorShape: Qt.PointingHandCursor
                                                                    onClicked: {
                                                                        root.playlistPaneFocus = 1
                                                                        root.focusedPlaylistIndex = plCard.index
                                                                        root.focusedPlaylistTrackIndex = index
                                                                        if (root.service) root.service.playPlaylist(plCard.modelData.id, index, false)
                                                                        panelFrame.forceActiveFocus()
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
                                                                        panelFrame.forceActiveFocus()
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    ListScroller {
                                        flickable: customPlaylistList
                                    }
                                }
                            }
                        }
                    }

                    // ===========================================================
                    // TAB 2: 4-STAGE DECK & 3-LAYER PSYCHEDELIC VISUALISER
                    // ===========================================================
                    Visualiser {
                        id: panelVisualiser
                        anchors.fill: parent
                        visible: (root.opened || root.standaloneMode) && root.activeTab === 2 && !(root.service && root.service.fullscreenVisualiserOpen)
                        isFullscreen: false
                        showBottomHud: false
                        bands: (visible && root.service) ? root.service.spectrumBands : []
                        playing: root.service ? root.service.activelyPlaying : false
                        trackTitle: root.service ? root.service.trackTitle : ""
                        trackArtist: root.service ? root.service.trackArtist : ""
                        trackAlbum: root.service ? root.service.trackAlbum : ""
                        artPath: root.service ? root.service.artPath : ""
                        playSource: root.service ? root.service.playSource : "local"
                        position: root.service ? root.service.position : 0.0
                        duration: root.service ? root.service.duration : 0.0
                        asciiLines: root.service ? root.service.asciiLines : []
                        bannerLines: root.service ? root.service.bannerLines : []
                        artLines: root.service ? root.service.artLines : []
                        ttfxFrames: root.service ? root.service.ttfxFrames : []
                        useAlbumArt: root.service ? root.service.useAlbumArt : false
                        asciiMode: root.service ? root.service.asciiMode : "braille"
                        asciiSource: root.service ? root.service.asciiSource : "album-art"
                        photoCategories: root.service ? root.service.photoCategories : []
                        photoCategoryCounts: root.service ? root.service.photoCategoryCounts : ({})
                        photoActiveCategory: root.service ? root.service.photoActiveCategory : "all"
                        photoActiveStem: root.service ? root.service.photoActiveStem : ""
                        photoActiveVariants: root.service ? root.service.photoActiveVariants : ({})
                        photoSameEffectPeers: root.service ? root.service.photoSameEffectPeers : ({})
                        photoSameEffectByVariant: root.service ? root.service.photoSameEffectByVariant : ({})
                        photoRandomPoolPeers: root.service ? root.service.photoRandomPoolPeers : ({})
                        photoTotalProcessed: root.service ? root.service.photoTotalProcessed : 0
                        photoTotalOriginals: root.service ? root.service.photoTotalOriginals : 0
                        photoCustomDir: root.service ? root.service.photoCustomDir : ""
                        photoBusy: root.service ? root.service.photoBusy : false
                        photoStatusMessage: root.service ? root.service.photoStatusMessage : ""
                        accentColour: root.colAccent
                        urgentColour: root.colUrgent
                        foregroundColour: root.colFg
                        backgroundColour: root.colBg
                        persistedConfig: root.service ? root.service.visualiserConfig : ({})

                        onRequestToggleFullscreen: {
                            if (root.service) {
                                root.service.fullscreenVisualiserOpen = !root.service.fullscreenVisualiserOpen
                            }
                        }
                        onRequestCloseVisualiser: root.activeTab = 0
                        onRequestPlayPause: if (root.service) root.service.togglePlayPause()
                        onRequestNext: if (root.service) root.service.nextTrack()
                        onRequestPrev: if (root.service) root.service.prevTrack()
                        onRequestSeek: sec => { if (root.service) root.service.seekTo(sec) }
                        onRequestToggleUseAlbumArt: if (root.service) root.service.toggleUseAlbumArt()
                        onRequestToggleAsciiMode: if (root.service) root.service.toggleAsciiMode()
                        onRequestSetAsciiSourceMode: modeStr => { if (root.service) root.service.setAsciiSourceMode(modeStr) }
                        onRequestLaunchTtfxScreensaver: effectName => {
                            if (root.service) root.service.launchTtfxScreensaver(effectName)
                        }
                        onRequestSelectTtfxEffect: effectName => {
                            if (root.service) root.service.setTtfxEffect(effectName)
                        }
                        onRequestStageModeChange: newStageMode => {
                            if (root.service) root.service.setStageMode(newStageMode)
                            root.syncVisualiserActive()
                        }
                        onRequestActionFeedback: msg => {}
                        onRequestSaveVisualiserConfig: cfg => {
                            if (root.service) root.service.saveVisualiserConfig(cfg)
                        }
                        onRequestOpenStatementsFile: {
                            if (root.service) root.service.openStatementsFile()
                        }
                        onRequestReloadStatementsFile: {
                            if (root.service) root.service.loadVisualiserConfig()
                        }
                        onRequestSaveStatements: statementsArr => {
                            if (root.service) root.service.saveStatements(statementsArr)
                        }
                        onRequestResetStatements: {
                            if (root.service) root.service.resetStatementsFile()
                        }
                        onRequestPhotoImport: srcDir => {
                            if (root.service) root.service.importPhotos(srcDir)
                        }
                        onRequestPhotoRefreshStatus: {
                            if (root.service) root.service.refreshPhotoStatus()
                        }
                        onRequestPhotoPick: (cat, stem) => {
                            if (root.service) root.service.pickPhoto(cat, stem)
                        }

                        Connections {
                            target: root.service
                            function onUseAlbumArtChanged() {
                                if (root.service && panelVisualiser.useAlbumArt !== root.service.useAlbumArt) {
                                    panelVisualiser.useAlbumArt = root.service.useAlbumArt
                                }
                            }
                            function onAsciiModeChanged() {
                                if (root.service && panelVisualiser.asciiMode !== root.service.asciiMode) {
                                    panelVisualiser.asciiMode = root.service.asciiMode
                                }
                            }
                        }
                    }

                    // ===========================================================
                    // TAB 3: BANDCAMP ACCOUNT LOG IN / LOG OUT, SYNC & ZIP IMPORT
                    // ===========================================================
                    ColumnLayout {
                        anchors.fill: parent
                        visible: root.activeTab === 3
                        spacing: 10

                        Rectangle {
                            Layout.fillWidth: true
                            implicitHeight: panelAuthCol.implicitHeight + 24
                            radius: 8
                            color: root.colSurface
                            border.width: 1
                            border.color: root.colBorder

                            ColumnLayout {
                                id: panelAuthCol
                                anchors.fill: parent
                                anchors.margins: 12
                                spacing: 10

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 8

                                    Text {
                                        Layout.fillWidth: true
                                        text: "󰀄 BANDCAMP ACCOUNT LOG IN & COLLECTION SYNCHRONISATION"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 11
                                        font.bold: true
                                        color: root.colAccent
                                    }

                                    Rectangle {
                                        Layout.preferredHeight: 20
                                        Layout.preferredWidth: panelAuthBadgeTxt.implicitWidth + 12
                                        radius: 4
                                        color: (root.service && root.service.username)
                                            ? Qt.rgba(root.colAccent.r, root.colAccent.g, root.colAccent.b, 0.18)
                                            : Qt.rgba(root.colUrgent.r, root.colUrgent.g, root.colUrgent.b, 0.18)
                                        border.width: 1
                                        border.color: (root.service && root.service.username) ? root.colAccent : root.colUrgent

                                        Text {
                                            id: panelAuthBadgeTxt
                                            anchors.centerIn: parent
                                            text: (root.service && root.service.username)
                                                ? ("LOGGED IN: @" + root.service.username + (root.service.authenticated ? " (Cookie)" : " (Public Fan)"))
                                                : "LOGGED OUT"
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 9
                                            font.bold: true
                                            color: (root.service && root.service.username) ? root.colAccent : root.colUrgent
                                        }
                                    }
                                }

                                // Browser Login + Auto-Detect + Log Out Row
                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 8

                                    ActionPill {
                                        text: "󰖟 Open Bandcamp Login"
                                        active: true
                                        fontSize: 10
                                        horizontalPad: 11
                                        pillHeight: 28
                                        onClicked: if (root.service) root.service.openBandcampLogin()
                                    }

                                    ActionPill {
                                        text: "󰑐 Detect From Browser"
                                        primary: true
                                        fontSize: 10
                                        horizontalPad: 11
                                        pillHeight: 28
                                        onClicked: if (root.service) root.service.loginFromBrowser(userInput.text.trim())
                                    }

                                    Item { Layout.fillWidth: true }

                                    ActionPill {
                                        visible: Boolean(root.service && (root.service.username || root.service.authenticated))
                                        text: "󰍃 Log Out"
                                        danger: true
                                        fontSize: 10
                                        horizontalPad: 11
                                        pillHeight: 28
                                        onClicked: {
                                            userInput.text = ""
                                            cookieInput.text = ""
                                            if (root.service) root.service.logoutBandcamp()
                                        }
                                    }
                                }

                                // Fan Username Row
                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 8

                                    Text {
                                        Layout.preferredWidth: 120
                                        text: "Fan Username:"
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
                                        border.color: userInput.activeFocus ? root.colAccent : root.colBorder

                                        TextInput {
                                            id: userInput
                                            anchors.fill: parent
                                            anchors.leftMargin: 8
                                            anchors.rightMargin: 8
                                            verticalAlignment: Text.AlignVCenter
                                            text: root.service ? root.service.username : ""
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 11
                                            color: root.colFg
                                            selectByMouse: true
                                            clip: true
                                            Keys.onPressed: event => root.handleKeyNavigation(event)

                                            Text {
                                                anchors.fill: parent
                                                verticalAlignment: Text.AlignVCenter
                                                text: "e.g. layolayo"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                color: root.colMuted
                                                visible: !userInput.text && !userInput.activeFocus
                                            }
                                        }
                                    }
                                }

                                // Optional Identity Cookie Row
                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 8

                                    Text {
                                        Layout.preferredWidth: 120
                                        text: "Identity Cookie:"
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
                                        border.color: cookieInput.activeFocus ? root.colAccent : root.colBorder

                                        TextInput {
                                            id: cookieInput
                                            anchors.fill: parent
                                            anchors.leftMargin: 8
                                            anchors.rightMargin: 8
                                            verticalAlignment: Text.AlignVCenter
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 10
                                            color: root.colFg
                                            selectByMouse: true
                                            clip: true
                                            echoMode: TextInput.Password
                                            Keys.onPressed: event => root.handleKeyNavigation(event)

                                            Text {
                                                anchors.fill: parent
                                                verticalAlignment: Text.AlignVCenter
                                                text: (root.service && root.service.authenticated)
                                                    ? "Saved in settings (leave blank to keep)"
                                                    : "Optional Bandcamp 'identity' cookie…"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                color: root.colMuted
                                                visible: !cookieInput.text && !cookieInput.activeFocus
                                            }
                                        }
                                    }

                                    ActionPill {
                                        text: "󰌋 Log In & Sync"
                                        primary: true
                                        fontSize: 10
                                        horizontalPad: 11
                                        pillHeight: 28
                                        onClicked: {
                                            if (root.service) {
                                                root.service.saveAuth(userInput.text.trim(), cookieInput.text.trim(), "", "")
                                            }
                                            panelFrame.forceActiveFocus()
                                        }
                                    }
                                }

                                // Sync & ZIP Import Actions
                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 8

                                    ActionPill {
                                        text: (root.service && root.service.syncing) ? "󰑐 Syncing Collection…" : "󰑐 Sync Bandcamp & Local"
                                        primary: true
                                        fontSize: 10
                                        horizontalPad: 12
                                        pillHeight: 28
                                        onClicked: {
                                            if (root.service) {
                                                root.service.syncCollection(false)
                                            }
                                        }
                                    }

                                    ActionPill {
                                        text: "󰗄 Import Downloads ZIPs"
                                        active: true
                                        fontSize: 10
                                        horizontalPad: 12
                                        pillHeight: 28
                                        onClicked: {
                                            if (root.service) root.service.importZips()
                                        }
                                    }

                                    ActionPill {
                                        text: "󰉋 Open Music Folder"
                                        fontSize: 10
                                        horizontalPad: 12
                                        pillHeight: 28
                                        onClicked: {
                                            if (root.service) root.service.openExternal("~/Music/Bandcamp", "Opened ~/Music/Bandcamp")
                                        }
                                    }

                                    ActionPill {
                                        text: "󰍹 Top Bar LED Equaliser: " + ((root.service && root.service.topBarLedEnabled) ? "ON" : "OFF")
                                        active: Boolean(root.service && root.service.topBarLedEnabled)
                                        primary: Boolean(root.service && root.service.topBarLedEnabled)
                                        fontSize: 10
                                        horizontalPad: 12
                                        pillHeight: 28
                                        onClicked: {
                                            if (root.service) {
                                                root.service.setTopBarLedEnabled(!root.service.topBarLedEnabled)
                                            }
                                        }
                                    }
                                }

                                Text {
                                    Layout.fillWidth: true
                                    text: "Discovers all items in your Bandcamp fan collection with full tracklists & direct streams, and merges them with ~/Music/Bandcamp and ~/Music."
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
                            spinning: Boolean(root.service && root.service.activelyPlaying && root.activeTab !== 2 && !root.service.fullscreenVisualiserOpen)
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
                                    : "Lossless mpv playback + 4-Stage Turntable & 3-Layer Visualiser"
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

                        // Live 24-Bar Mini Spectrum Strip (paused only when fullscreen overlay is active)
                        Spectrum {
                            Layout.preferredWidth: 96
                            Layout.preferredHeight: 38
                            barCount: 24
                            active: Boolean((root.opened || root.standaloneMode) && root.service && root.service.activelyPlaying && !root.service.fullscreenVisualiserOpen)
                            bands: (active && root.service) ? root.service.spectrumBands : []
                            accentColour: root.colAccent
                            peakColour: root.colUrgent
                        }

                        // Transport Controls
                        RowLayout {
                            spacing: 6

                            ActionPill {
                                text: "󰒮"
                                fontSize: 13
                                horizontalPad: 8
                                pillHeight: 30
                                onClicked: if (root.service) root.service.prevTrack()
                            }

                            ActionPill {
                                text: (root.service && root.service.activelyPlaying) ? "󰏤" : "󰐊"
                                primary: true
                                fontSize: 15
                                horizontalPad: 10
                                pillHeight: 32
                                onClicked: if (root.service) root.service.togglePlayPause()
                            }

                            ActionPill {
                                text: "󰒭"
                                fontSize: 13
                                horizontalPad: 8
                                pillHeight: 30
                                onClicked: if (root.service) root.service.nextTrack()
                            }

                            // Fullscreen Visualiser quick-launch button
                            ActionPill {
                                text: "󰍹"
                                danger: true
                                fontSize: 13
                                horizontalPad: 8
                                pillHeight: 30
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
