import QtQuick
import QtQuick.Layouts
import QtQuick.Window
import Quickshell
import Quickshell.Io

// App.qml — Dedicated Standalone Bandarchy Desktop Player & 4-Mode Stage / 3-Layer Visualiser
// Launch with: quickshell -p /path/to/App.qml (or `bandarchy-player`)

ShellRoot {
    id: shellRoot

    Service {
        id: service
        visualiserActive: win.visible && (appVisualiser.stageMode === "visualiser" || appVisualiser.stageMode === "turntable")
    }

    FileView {
        id: omarchyThemeFile
        path: (Quickshell.env("HOME") || "/home/matthew") + "/.local/state/omarchy/current/theme/colors.toml"
        watchChanges: true
        onFileChanged: reload()
        onLoaded: win.applyOmarchyTheme(text())
    }

    FloatingWindow {
        id: win
        title: "Bandarchy — Bandcamp & Local Lossless Player"
        implicitWidth: 1240
        implicitHeight: 780
        minimumSize: Qt.size(900, 580)
        color: win.colBg
        visible: true
        property bool hasShown: false
        onVisibleChanged: {
            if (visible) {
                hasShown = true
            } else if (hasShown) {
                Qt.quit()
            }
        }

        property color colBg: "#08080c"
        property color colFg: "#e2e8f0"
        property color colAccent: "#ffab00"
        property color colUrgent: "#ff4a6b"
        property color colSurface: "#121218"
        property color colBorder: "#242e42"
        property color colMuted: "#94a3b8"

        function applyOmarchyTheme(tomlText) {
            if (!tomlText) return
            function extractHex(key) {
                var re = new RegExp("^\\s*" + key + "\\s*=\\s*\"(#[0-9a-fA-F]{6,8})\"", "m")
                var m = tomlText.match(re)
                return m ? m[1] : ""
            }
            var bg = extractHex("background")
            var fg = extractHex("foreground")
            var acc = extractHex("accent")
            var urg = extractHex("red") || extractHex("magenta")
            var surf = extractHex("lighter_background")
            var mut = extractHex("light_foreground") || extractHex("dark_foreground")
            if (bg) win.colBg = bg
            if (fg) win.colFg = fg
            if (acc) win.colAccent = acc
            if (urg) win.colUrgent = urg
            if (surf) win.colSurface = surf
            if (mut) win.colMuted = mut
            win.colBorder = Qt.rgba(win.colFg.r, win.colFg.g, win.colFg.b, 0.16)
        }

        property int leftTab: 0 // 0: Collection, 1: Playlists & Radio, 2: Stage & Visualiser, 3: Account & Sync
        property string selectedAlbumId: ""
        property string selectedPlaylistId: ""
        property bool visualiserMaximised: false

        // Keyboard navigation state
        property int focusedAlbumIndex: 0
        property int focusedTrackIndex: -1
        property int focusedSmartTrackIndex: 0
        property int focusedPlaylistIndex: 0
        property int focusedPlaylistTrackIndex: -1
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

        // Reusable tactile button with high-contrast hover/click flash & scale response
        component ActionPill: Rectangle {
            id: pill
            property string text: ""
            property bool active: false
            property bool primary: false
            property bool danger: false
            property int fontSize: 10
            property int horizontalPad: 12
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
                    return pillMouse.pressed ? Qt.darker(win.colAccent, 1.25)
                         : (pillMouse.containsMouse ? Qt.lighter(win.colAccent, 1.22) : win.colAccent)
                }
                if (pill.danger) {
                    return pillMouse.pressed ? Qt.rgba(win.colUrgent.r, win.colUrgent.g, win.colUrgent.b, 0.45)
                         : (pillMouse.containsMouse ? Qt.rgba(win.colUrgent.r, win.colUrgent.g, win.colUrgent.b, 0.32)
                         : (pill.active ? Qt.rgba(win.colUrgent.r, win.colUrgent.g, win.colUrgent.b, 0.22) : win.colSurface))
                }
                if (pill.active) {
                    return pillMouse.pressed
                        ? Qt.rgba(win.colAccent.r, win.colAccent.g, win.colAccent.b, 0.42)
                        : (pillMouse.containsMouse
                            ? Qt.rgba(win.colAccent.r, win.colAccent.g, win.colAccent.b, 0.30)
                            : Qt.rgba(win.colAccent.r, win.colAccent.g, win.colAccent.b, 0.18))
                }
                return pillMouse.pressed
                    ? Qt.rgba(win.colAccent.r, win.colAccent.g, win.colAccent.b, 0.28)
                    : (pillMouse.containsMouse
                        ? Qt.rgba(win.colAccent.r, win.colAccent.g, win.colAccent.b, 0.18)
                        : win.colSurface)
            }
            border.width: (pill.primary || pillMouse.containsMouse || pillMouse.pressed) ? 1.6 : ((pill.active || pill.danger) ? 1.2 : 1)
            border.color: pill.primary
                ? (pillMouse.containsMouse ? "#ffffff" : win.colAccent)
                : (pill.danger
                    ? win.colUrgent
                    : (pill.active || pillMouse.containsMouse ? win.colAccent : win.colBorder))

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
                        ? win.colUrgent
                        : (pill.active || pillMouse.containsMouse ? win.colAccent : win.colFg))
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
            color: Qt.rgba(1, 1, 1, scrollerMouse.containsMouse || scrollerMouse.pressed ? 0.14 : 0.07)

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
                    ? win.colAccent
                    : Qt.rgba(win.colAccent.r, win.colAccent.g, win.colAccent.b, 0.58)
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

        function handleKeyNavigation(event) {
            if (appSearch.activeFocus || appNewPlaylist.activeFocus || appUserInput.activeFocus || appCookieInput.activeFocus) {
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
                win.leftTab = (win.leftTab + 1) % 4
                appRootRect.forceActiveFocus()
                event.accepted = true
                return
            }
            if (event.key === Qt.Key_Backtab) {
                win.leftTab = (win.leftTab + 3) % 4
                appRootRect.forceActiveFocus()
                event.accepted = true
                return
            }

            var hasAltOrCtrl = Boolean(event.modifiers & (Qt.AltModifier | Qt.ControlModifier))
            if (!hasAltOrCtrl) {
                if (event.key === Qt.Key_1) {
                    win.leftTab = 0
                    appRootRect.forceActiveFocus()
                    event.accepted = true
                    return
                } else if (event.key === Qt.Key_2) {
                    win.leftTab = 1
                    appRootRect.forceActiveFocus()
                    event.accepted = true
                    return
                } else if (event.key === Qt.Key_3) {
                    win.leftTab = 2
                    appRootRect.forceActiveFocus()
                    event.accepted = true
                    return
                } else if (event.key === Qt.Key_4) {
                    win.leftTab = 3
                    appRootRect.forceActiveFocus()
                    event.accepted = true
                    return
                }
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
                } else if (event.key === Qt.Key_Plus || (event.key === Qt.Key_A && !(event.modifiers & Qt.ShiftModifier))) {
                    if (curAlbum) {
                        if (isExpanded && win.focusedTrackIndex >= 0 && win.focusedTrackIndex < tracks.length) {
                            var selTrk = tracks[win.focusedTrackIndex]
                            if (selTrk) {
                                service.addTrackOrCreatePlaylist(selTrk.id, selTrk.title, curAlbum.artist, win.selectedPlaylistId)
                            }
                        } else {
                            service.addAlbumOrCreatePlaylist(curAlbum.id, curAlbum.title, curAlbum.artist, win.selectedPlaylistId)
                        }
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
                var curPl = (customPls.length > 0 && win.focusedPlaylistIndex >= 0 && win.focusedPlaylistIndex < customPls.length)
                    ? customPls[win.focusedPlaylistIndex]
                    : null
                var curPlTracks = (curPl && curPl.tracks) ? curPl.tracks : []
                var isPlExpanded = Boolean(curPl && win.selectedPlaylistId === curPl.id)

                if (event.key === Qt.Key_Left || event.key === Qt.Key_H || event.key === Qt.Key_Backspace) {
                    if (win.playlistPaneFocus === 1 && isPlExpanded && win.focusedPlaylistTrackIndex >= 0) {
                        win.focusedPlaylistTrackIndex = -1
                    } else if (win.playlistPaneFocus === 1 && isPlExpanded) {
                        win.selectedPlaylistId = ""
                        win.focusedPlaylistTrackIndex = -1
                    } else {
                        win.playlistPaneFocus = 0
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Right || event.key === Qt.Key_L) {
                    if (win.playlistPaneFocus === 0) {
                        win.playlistPaneFocus = 1
                    } else if (curPl) {
                        if (!isPlExpanded) {
                            win.selectedPlaylistId = curPl.id
                            win.focusedPlaylistTrackIndex = curPlTracks.length > 0 ? 0 : -1
                        } else if (win.focusedPlaylistTrackIndex < 0 && curPlTracks.length > 0) {
                            win.focusedPlaylistTrackIndex = 0
                        }
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Down || event.key === Qt.Key_J) {
                    if (win.playlistPaneFocus === 0 && smartTracks.length > 0) {
                        win.focusedSmartTrackIndex = Math.min(smartTracks.length - 1, win.focusedSmartTrackIndex + 1)
                        appSmartPlaylistList.positionViewAtIndex(win.focusedSmartTrackIndex, ListView.Contain)
                    } else if (win.playlistPaneFocus === 1 && customPls.length > 0) {
                        if (isPlExpanded && curPlTracks.length > 0 && win.focusedPlaylistTrackIndex < curPlTracks.length - 1) {
                            win.focusedPlaylistTrackIndex = win.focusedPlaylistTrackIndex + 1
                        } else if (win.focusedPlaylistIndex < customPls.length - 1) {
                            win.focusedPlaylistIndex = win.focusedPlaylistIndex + 1
                            win.focusedPlaylistTrackIndex = -1
                            appCustomPlaylistList.positionViewAtIndex(win.focusedPlaylistIndex, ListView.Contain)
                        }
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Up || event.key === Qt.Key_K) {
                    if (win.playlistPaneFocus === 0 && smartTracks.length > 0) {
                        win.focusedSmartTrackIndex = Math.max(0, win.focusedSmartTrackIndex - 1)
                        appSmartPlaylistList.positionViewAtIndex(win.focusedSmartTrackIndex, ListView.Contain)
                    } else if (win.playlistPaneFocus === 1 && customPls.length > 0) {
                        if (isPlExpanded && win.focusedPlaylistTrackIndex >= 0) {
                            win.focusedPlaylistTrackIndex = win.focusedPlaylistTrackIndex - 1
                        } else if (win.focusedPlaylistIndex > 0) {
                            win.focusedPlaylistIndex = win.focusedPlaylistIndex - 1
                            var prevPl = customPls[win.focusedPlaylistIndex]
                            if (prevPl && win.selectedPlaylistId === prevPl.id && prevPl.tracks && prevPl.tracks.length > 0) {
                                win.focusedPlaylistTrackIndex = prevPl.tracks.length - 1
                            } else {
                                win.focusedPlaylistTrackIndex = -1
                            }
                            appCustomPlaylistList.positionViewAtIndex(win.focusedPlaylistIndex, ListView.Contain)
                        }
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                    if (win.playlistPaneFocus === 0 && smartTracks.length > 0) {
                        service.playSmartPlaylist(service.smartPreset, "", win.focusedSmartTrackIndex)
                    } else if (win.playlistPaneFocus === 1 && curPl) {
                        if (event.modifiers & Qt.ShiftModifier) {
                            service.playPlaylist(curPl.id, Math.max(0, win.focusedPlaylistTrackIndex), false)
                        } else if (isPlExpanded && win.focusedPlaylistTrackIndex >= 0) {
                            service.playPlaylist(curPl.id, win.focusedPlaylistTrackIndex, false)
                        } else {
                            win.selectedPlaylistId = isPlExpanded ? "" : curPl.id
                            win.focusedPlaylistTrackIndex = (win.selectedPlaylistId !== "" && curPlTracks.length > 0) ? 0 : -1
                        }
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_P) {
                    if (win.playlistPaneFocus === 0 && smartTracks.length > 0) {
                        service.playSmartPlaylist(service.smartPreset, "", win.focusedSmartTrackIndex)
                    } else if (win.playlistPaneFocus === 1 && curPl) {
                        service.playPlaylist(curPl.id, Math.max(0, win.focusedPlaylistTrackIndex), false)
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Escape) {
                    if (win.selectedPlaylistId !== "") {
                        win.selectedPlaylistId = ""
                        win.focusedPlaylistTrackIndex = -1
                        event.accepted = true
                    }
                }
            } else if (win.leftTab === 2) {
                if (event.key === Qt.Key_Down || event.key === Qt.Key_J || event.key === Qt.Key_Right) {
                    appVisualiser.cycleMode(1)
                    event.accepted = true
                } else if (event.key === Qt.Key_Up || event.key === Qt.Key_Left) {
                    appVisualiser.cycleMode(-1)
                    event.accepted = true
                }
            }

            if (!event.accepted) {
                if (event.key === Qt.Key_M) { appVisualiser.cycleMode((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
                else if (event.key === Qt.Key_G) { appVisualiser.cycleLayer1Mode((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
                else if (event.key === Qt.Key_E) { appVisualiser.cycleLayer3Mode((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
                else if (event.key === Qt.Key_C) { appVisualiser.cyclePalette((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
                else if (event.key === Qt.Key_K) { appVisualiser.cycleTracers((event.modifiers & Qt.ShiftModifier) ? -1 : 1); event.accepted = true }
                else if (event.key === Qt.Key_L) { appVisualiser.showLayerDrawer = !appVisualiser.showLayerDrawer; event.accepted = true }
                else if (event.key === Qt.Key_H) { appVisualiser.toggleHudVisibility(); event.accepted = true }
                else if (event.key === Qt.Key_Z) {
                    if (win.visualiserMaximised && !appVisualiser.showHud) {
                        appVisualiser.showHud = true
                        win.visualiserMaximised = false
                    } else {
                        appVisualiser.setStage("visualiser")
                        appVisualiser.showLayerDrawer = false
                        appVisualiser.showTracerPopover = false
                        appVisualiser.showHud = false
                        win.visualiserMaximised = true
                    }
                    event.accepted = true
                }
                else if (event.key === Qt.Key_R) { appVisualiser.randomiseVisuals(); event.accepted = true }
                else if (event.key === Qt.Key_S) { appVisualiser.triggerShatterImpulse(); event.accepted = true }
                else if (event.key === Qt.Key_X) { appVisualiser.autoCycle = !appVisualiser.autoCycle; event.accepted = true }
                else if (event.key === Qt.Key_A) { service.toggleUseAlbumArt(); event.accepted = true }
                else if (event.key === Qt.Key_B) { service.toggleAsciiMode(); event.accepted = true }
                else if (event.key === Qt.Key_T) { appVisualiser.toggleInCanvasTte(); event.accepted = true }
                else if (event.key === Qt.Key_F || event.key === Qt.Key_V) {
                    if (event.modifiers & Qt.ShiftModifier) {
                        appVisualiser.setStage("visualiser")
                        appVisualiser.showLayerDrawer = false
                        appVisualiser.showTracerPopover = false
                        appVisualiser.showHud = false
                        win.visualiserMaximised = true
                    } else {
                        win.visualiserMaximised = !win.visualiserMaximised
                    }
                    event.accepted = true
                }
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
                spacing: win.visualiserMaximised ? 0 : 8

                // ===============================================================
                // TOP HEADER BAR + ACCOUNT PILL + 4 STAGE MODES + NAVIGATION TABS
                // ===============================================================
                RowLayout {
                    Layout.fillWidth: true
                    visible: !win.visualiserMaximised
                    spacing: 8

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
                        spacing: 1
                        RowLayout {
                            spacing: 8
                            Text {
                                text: "BANDARCHY"
                                textFormat: Text.PlainText
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 13
                                font.bold: true
                                color: win.colFg
                            }

                            // Account status pill (clicks through to Account & Sync tab)
                            ActionPill {
                                text: service.username
                                    ? ("󰀄 @" + service.username + (service.authenticated ? " · Verified" : " · Profile"))
                                    : "󰍂 Log In to Bandcamp"
                                active: Boolean(service.username)
                                danger: !service.username
                                fontSize: 9
                                horizontalPad: 8
                                pillHeight: 20
                                onClicked: {
                                    win.leftTab = 3
                                    appRootRect.forceActiveFocus()
                                }
                            }
                        }
                        Text {
                            text: service.purchasedCount + " Purchased · " +
                                  service.localCount + " Local (" + service.trackCount + " tracks)"
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 10
                            color: win.colMuted
                        }
                    }

                    // Activity Toast Banner (shows immediate confirmation for every action)
                    Rectangle {
                        visible: service.activityMessage !== ""
                        Layout.preferredHeight: 24
                        Layout.preferredWidth: Math.min(340, activityBannerTxt.implicitWidth + 18)
                        radius: 5
                        color: "#15322c"
                        border.width: 1
                        border.color: win.colAccent

                        Text {
                            id: activityBannerTxt
                            anchors.centerIn: parent
                            width: parent.width - 14
                            text: "󰄬 " + service.activityMessage
                            textFormat: Text.PlainText
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 10
                            font.bold: true
                            color: win.colAccent
                            elide: Text.ElideRight
                        }
                    }

                    Item { Layout.fillWidth: true }

                    // 4 Stage Modes Quick Switcher (Off / Art / Turntable / Visualiser)
                    RowLayout {
                        spacing: 4
                        ActionPill {
                            text: "󰅖 Stage Off"
                            active: appVisualiser.stageMode === "off"
                            fontSize: 9
                            horizontalPad: 7
                            pillHeight: 26
                            onClicked: appVisualiser.setStage("off")
                        }
                        ActionPill {
                            text: "󰀥 Art"
                            active: appVisualiser.stageMode === "art"
                            fontSize: 9
                            horizontalPad: 7
                            pillHeight: 26
                            onClicked: appVisualiser.setStage("art")
                        }
                        ActionPill {
                            text: "󰀥 Turntable"
                            active: appVisualiser.stageMode === "turntable"
                            fontSize: 9
                            horizontalPad: 7
                            pillHeight: 26
                            onClicked: appVisualiser.setStage("turntable")
                        }
                        ActionPill {
                            text: "󰍹 Visualiser"
                            active: appVisualiser.stageMode === "visualiser"
                            fontSize: 9
                            horizontalPad: 7
                            pillHeight: 26
                            onClicked: appVisualiser.setStage("visualiser")
                        }
                    }

                    // Left Pane Navigation Tabs
                    Repeater {
                        model: [
                            { idx: 0, label: "󰲸 Collection" },
                            { idx: 1, label: "󰐑 Playlists" },
                            { idx: 2, label: "󰍹 Stage & Layers" },
                            { idx: 3, label: "󰀄 Account & Sync" }
                        ]

                        delegate: ActionPill {
                            required property var modelData
                            text: modelData.label
                            active: win.leftTab === modelData.idx
                            fontSize: 10
                            horizontalPad: 10
                            pillHeight: 28
                            onClicked: {
                                win.leftTab = modelData.idx
                                appRootRect.forceActiveFocus()
                            }
                        }
                    }
                }

                // ===============================================================
                // MAIN SPLIT AREA: LEFT COLLECTION/CONTROLS + RIGHT 4-MODE STAGE
                // ===============================================================
                RowLayout {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    spacing: (win.visualiserMaximised || appVisualiser.stageMode === "off") ? 0 : 12

                    // Left Pane (expands to full width when stage is set to "off")
                    Rectangle {
                        Layout.preferredWidth: appVisualiser.stageMode === "off" ? parent.width : 540
                        Layout.fillWidth: appVisualiser.stageMode === "off"
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

                            // ===================================================
                            // LEFT TAB 0: COLLECTION & SEARCH
                            // ===================================================
                            ColumnLayout {
                                Layout.fillWidth: true
                                Layout.fillHeight: true
                                visible: win.leftTab === 0
                                spacing: 6

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 5

                                    Rectangle {
                                        Layout.fillWidth: true
                                        Layout.preferredHeight: 30
                                        radius: 6
                                        color: "#0b0f17"
                                        border.width: 1
                                        border.color: appSearch.activeFocus ? win.colAccent : win.colBorder

                                        RowLayout {
                                            anchors.fill: parent
                                            anchors.leftMargin: 8
                                            anchors.rightMargin: 8
                                            spacing: 6

                                            Text {
                                                text: "󰍉"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 12
                                                color: win.colMuted
                                            }

                                            TextInput {
                                                id: appSearch
                                                Layout.fillWidth: true
                                                verticalAlignment: Text.AlignVCenter
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 11
                                                color: win.colFg
                                                selectByMouse: true
                                                clip: true
                                                onTextEdited: {
                                                    win.focusedAlbumIndex = 0
                                                    win.focusedTrackIndex = -1
                                                    service.loadCollection(service.activeScope, text)
                                                }
                                                Keys.onPressed: event => win.handleKeyNavigation(event)

                                                Text {
                                                    anchors.fill: parent
                                                    verticalAlignment: Text.AlignVCenter
                                                    text: "Search Bandcamp purchases, artists, or albums… (/)"
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 10
                                                    color: win.colMuted
                                                    visible: !appSearch.text && !appSearch.activeFocus
                                                }
                                            }

                                            Text {
                                                visible: appSearch.text.length > 0
                                                text: "󰅖"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 11
                                                color: win.colMuted
                                                MouseArea {
                                                    anchors.fill: parent
                                                    cursorShape: Qt.PointingHandCursor
                                                    onClicked: {
                                                        appSearch.text = ""
                                                        win.focusedAlbumIndex = 0
                                                        win.focusedTrackIndex = -1
                                                        service.loadCollection(service.activeScope, "")
                                                        appRootRect.forceActiveFocus()
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    Repeater {
                                        model: [
                                            { id: "all", label: "All (" + service.albumCount + ")" },
                                            { id: "purchased", label: "Purchased (" + service.purchasedCount + ")" },
                                            { id: "local", label: "Local (" + service.localCount + ")" },
                                            { id: "cloud", label: "Stream" }
                                        ]
                                        delegate: ActionPill {
                                            required property var modelData
                                            text: modelData.label
                                            active: service.activeScope === modelData.id
                                            fontSize: 9
                                            horizontalPad: 8
                                            pillHeight: 30
                                            onClicked: {
                                                win.focusedAlbumIndex = 0
                                                win.focusedTrackIndex = -1
                                                service.loadCollection(modelData.id, appSearch.text)
                                                appRootRect.forceActiveFocus()
                                            }
                                        }
                                    }
                                }

                                // Keyboard navigation hint bar + quick Shuffle button
                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 6
                                    Text {
                                        Layout.fillWidth: true
                                        text: "󰌌 Keys: ↑↓/jk Navigate · Enter/→ Expand Tracks & Info · ←/Esc Collapse · p Play Album · a/+ +Playlist"
                                        textFormat: Text.PlainText
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 9
                                        color: win.colMuted
                                        elide: Text.ElideRight
                                    }
                                    ActionPill {
                                        text: "󰒟 Shuffle Scope"
                                        fontSize: 9
                                        horizontalPad: 8
                                        pillHeight: 20
                                        onClicked: {
                                            var sc = service.activeScope === "cloud" ? "purchased" : service.activeScope
                                            service.playScope(sc, true)
                                            appRootRect.forceActiveFocus()
                                        }
                                    }
                                }

                                // Album List with visible interactive vertical scrollbar
                                Item {
                                    Layout.fillWidth: true
                                    Layout.fillHeight: true

                                    ListView {
                                        id: appAlbumList
                                        anchors.fill: parent
                                        clip: true
                                        spacing: 5
                                        boundsBehavior: Flickable.StopAtBounds
                                        model: service.albums
                                        onModelChanged: {
                                            Qt.callLater(function() {
                                                if (win.focusedAlbumIndex >= 0 && appAlbumList.count > win.focusedAlbumIndex) {
                                                    appAlbumList.positionViewAtIndex(win.focusedAlbumIndex, ListView.Contain)
                                                }
                                            })
                                        }

                                        delegate: Rectangle {
                                            id: appAlbumCard
                                            required property var modelData
                                            required property int index
                                            readonly property bool expanded: win.selectedAlbumId === modelData.id
                                            readonly property bool isCurrentAlbum: service.albumId === modelData.id
                                            readonly property bool isKeyboardFocused: win.focusedAlbumIndex === index
                                            readonly property var tracksList: modelData.tracks || []
                                            readonly property bool isAlbumDownloading: Boolean(service.downloading && service.downloadAlbumId === modelData.id)

                                            width: ListView.view.width - 12
                                            height: expanded
                                                ? (60 + appAlbumInfoBox.implicitHeight + Math.min(Math.max(tracksList.length, 1), 8) * 26 + 22)
                                                : 56
                                            radius: 6
                                            color: isCurrentAlbum
                                                ? "#15322c"
                                                : (isKeyboardFocused ? "#112224" : "#0b0f17")
                                            border.width: (isCurrentAlbum || isKeyboardFocused || expanded) ? 1.5 : 1
                                            border.color: (isCurrentAlbum || isKeyboardFocused || expanded) ? win.colAccent : win.colBorder

                                            ColumnLayout {
                                                anchors.fill: parent
                                                anchors.margins: 6
                                                spacing: 5

                                                RowLayout {
                                                    Layout.fillWidth: true
                                                    Layout.preferredHeight: 42
                                                    spacing: 7

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

                                                    // Album Title, Artist & Left-Aligned Info Tag (clipped so text never overflows behind right buttons)
                                                    Item {
                                                        Layout.fillWidth: true
                                                        Layout.preferredHeight: 42
                                                        clip: true

                                                        ColumnLayout {
                                                            anchors.fill: parent
                                                            spacing: 2

                                                            Text {
                                                                Layout.fillWidth: true
                                                                text: modelData.title || "Untitled Album"
                                                                textFormat: Text.PlainText
                                                                font.family: "JetBrainsMono Nerd Font"
                                                                font.pixelSize: 11
                                                                font.bold: true
                                                                color: (appAlbumCard.isCurrentAlbum || appAlbumCard.isKeyboardFocused) ? win.colAccent : win.colFg
                                                                elide: Text.ElideRight
                                                            }

                                                            RowLayout {
                                                                Layout.fillWidth: true
                                                                spacing: 5

                                                                Rectangle {
                                                                    Layout.preferredHeight: 14
                                                                    Layout.preferredWidth: appLocBadgeTxt.implicitWidth + 6
                                                                    radius: 3
                                                                    color: modelData.isLocal
                                                                        ? Qt.rgba(win.colAccent.r, win.colAccent.g, win.colAccent.b, 0.14)
                                                                        : Qt.rgba(win.colFg.r, win.colFg.g, win.colFg.b, 0.08)
                                                                    border.width: 0
                                                                    Text {
                                                                        id: appLocBadgeTxt
                                                                        anchors.centerIn: parent
                                                                        text: modelData.isLocal ? "LOCAL" : "CLOUD"
                                                                        textFormat: Text.PlainText
                                                                        font.family: "JetBrainsMono Nerd Font"
                                                                        font.pixelSize: 8
                                                                        font.bold: true
                                                                        color: modelData.isLocal ? win.colAccent : win.colMuted
                                                                    }
                                                                }

                                                                Text {
                                                                    Layout.fillWidth: true
                                                                    text: (modelData.artist || "Unknown Artist") + " · " + (modelData.numTracks || tracksList.length || 0) + " trk"
                                                                    textFormat: Text.PlainText
                                                                    font.family: "JetBrainsMono Nerd Font"
                                                                    font.pixelSize: 10
                                                                    color: win.colMuted
                                                                    elide: Text.ElideRight
                                                                }
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

                                                    // Compact Save / Download button with live track X/Y (Z%) progress
                                                    ActionPill {
                                                        visible: !modelData.isLocal && Boolean(modelData.purchased || modelData.tralbumId || modelData.url)
                                                        text: appAlbumCard.isAlbumDownloading
                                                            ? ("󰇚 " + (service.downloadTrackTotal > 0
                                                                ? (service.downloadTrackIndex + "/" + service.downloadTrackTotal + " (" + service.downloadPercent + "%)")
                                                                : (service.downloadPercent + "%")))
                                                            : "󰇚 Save"
                                                        active: appAlbumCard.isAlbumDownloading
                                                        fontSize: 9
                                                        horizontalPad: 6
                                                        pillHeight: 24
                                                        onClicked: {
                                                            service.downloadAlbum(modelData.id, "flac")
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }

                                                    // Compact Play / Stream Album button (primary fill ONLY when actively playing this album)
                                                    ActionPill {
                                                        text: appAlbumCard.isCurrentAlbum
                                                            ? (service.paused ? "󰐊 Paused" : "󰏤 Playing")
                                                            : "󰐊 Play"
                                                        primary: appAlbumCard.isCurrentAlbum
                                                        active: !appAlbumCard.isCurrentAlbum
                                                        fontSize: 9
                                                        horizontalPad: 7
                                                        pillHeight: 24
                                                        onClicked: {
                                                            win.focusedAlbumIndex = appAlbumCard.index
                                                            if (appAlbumCard.isCurrentAlbum && service.playing) {
                                                                service.togglePlayPause()
                                                            } else {
                                                                service.playAlbum(modelData.id, 0, "auto", false)
                                                            }
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }

                                                    // Compact Add Album to Playlist button
                                                    ActionPill {
                                                        text: "󰐑"
                                                        fontSize: 10
                                                        horizontalPad: 6
                                                        pillHeight: 24
                                                        onClicked: {
                                                            service.addAlbumOrCreatePlaylist(
                                                                modelData.id,
                                                                modelData.title,
                                                                modelData.artist,
                                                                win.selectedPlaylistId
                                                            )
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }

                                                    // Compact Expand Tracks & Info chevron button
                                                    ActionPill {
                                                        text: appAlbumCard.expanded ? "󰅃" : "󰅀"
                                                        active: appAlbumCard.expanded
                                                        fontSize: 10
                                                        horizontalPad: 6
                                                        pillHeight: 24
                                                        onClicked: {
                                                            win.toggleAlbumExpand(modelData.id, appAlbumCard.index)
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }
                                                }

                                                // =======================================================
                                                // EXPANDED ALBUM INFO BREAKDOWN BOX (UN-TRUNCATED)
                                                // =======================================================
                                                Rectangle {
                                                    id: appAlbumInfoBox
                                                    visible: appAlbumCard.expanded
                                                    Layout.fillWidth: true
                                                    implicitHeight: appAlbumInfoCol.implicitHeight + 14
                                                    radius: 5
                                                    color: "#0e1522"
                                                    border.width: 1
                                                    border.color: Qt.rgba(win.colAccent.r, win.colAccent.g, win.colAccent.b, 0.32)

                                                    ColumnLayout {
                                                        id: appAlbumInfoCol
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
                                                                color: win.colAccent
                                                                wrapMode: Text.WordWrap
                                                            }

                                                            ActionPill {
                                                                visible: Boolean(modelData.url)
                                                                text: "󰖟 Bandcamp Page"
                                                                fontSize: 8
                                                                horizontalPad: 7
                                                                pillHeight: 20
                                                                onClicked: service.openExternal(modelData.url, "Opened Bandcamp page in browser")
                                                            }

                                                            ActionPill {
                                                                visible: Boolean(modelData.localPath)
                                                                text: "󰉋 Local Folder"
                                                                fontSize: 8
                                                                horizontalPad: 7
                                                                pillHeight: 20
                                                                onClicked: service.openExternal(modelData.localPath, "Opened local album folder")
                                                            }
                                                        }

                                                        Text {
                                                            Layout.fillWidth: true
                                                            text: "• Collection Status: " +
                                                                  (modelData.purchased
                                                                    ? ("PURCHASED — Owned in Bandcamp Collection" + (service.username ? (" (@" + service.username + ")") : ""))
                                                                    : "LOCAL LIBRARY — Imported from local disk") +
                                                                  "\n• Playback & Format: " +
                                                                  (modelData.isLocal
                                                                    ? ("LOCAL DISK — " + (modelData.audioFormat || "Local Audio") + " · " + (modelData.numTracks || tracksList.length || 0) + " tracks" + (modelData.totalDuration > 0 ? (" · Total " + win.formatDuration(modelData.totalDuration)) : ""))
                                                                    : ("BANDCAMP CLOUD STREAM — Direct bcbits stream · " + (modelData.numTracks || tracksList.length || 0) + " tracks (Click 󰇚 Download to save lossless copy locally)")) +
                                                                  (modelData.localPath ? ("\n• Local Path: " + modelData.localPath) : "") +
                                                                  (modelData.url ? ("\n• Bandcamp URL: " + modelData.url) : "")
                                                            textFormat: Text.PlainText
                                                            font.family: "JetBrainsMono Nerd Font"
                                                            font.pixelSize: 9
                                                            color: win.colMuted
                                                            wrapMode: Text.WrapAnywhere
                                                        }
                                                    }
                                                }

                                                // =======================================================
                                                // EXPANDED TRACK LIST DRAWER
                                                // =======================================================
                                                ListView {
                                                    id: appAlbumTracksListView
                                                    Layout.fillWidth: true
                                                    Layout.fillHeight: true
                                                    visible: appAlbumCard.expanded
                                                    clip: true
                                                    spacing: 2
                                                    model: appAlbumCard.tracksList
                                                    currentIndex: appAlbumCard.isKeyboardFocused ? win.focusedTrackIndex : -1
                                                    onCurrentIndexChanged: {
                                                        if (currentIndex >= 0 && count > currentIndex) {
                                                            positionViewAtIndex(currentIndex, ListView.Contain)
                                                        }
                                                    }

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
                                                            spacing: 5

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

                                                                MouseArea {
                                                                    anchors.fill: parent
                                                                    cursorShape: Qt.PointingHandCursor
                                                                    onClicked: {
                                                                        win.focusedAlbumIndex = appAlbumCard.index
                                                                        win.focusedTrackIndex = index
                                                                        service.playAlbum(appAlbumCard.modelData.id, index, "auto", false)
                                                                        appRootRect.forceActiveFocus()
                                                                    }
                                                                }
                                                            }

                                                            ActionPill {
                                                                text: "󰐊 Play"
                                                                primary: isTrackPlaying
                                                                active: !isTrackPlaying
                                                                fontSize: 8
                                                                horizontalPad: 6
                                                                pillHeight: 18
                                                                onClicked: {
                                                                    win.focusedAlbumIndex = appAlbumCard.index
                                                                    win.focusedTrackIndex = index
                                                                    service.playAlbum(appAlbumCard.modelData.id, index, "auto", false)
                                                                    appRootRect.forceActiveFocus()
                                                                }
                                                            }

                                                            ActionPill {
                                                                text: "󰐑 +List"
                                                                fontSize: 8
                                                                horizontalPad: 6
                                                                pillHeight: 18
                                                                onClicked: {
                                                                    win.focusedAlbumIndex = appAlbumCard.index
                                                                    win.focusedTrackIndex = index
                                                                    service.addTrackOrCreatePlaylist(
                                                                        modelData.id,
                                                                        modelData.title,
                                                                        appAlbumCard.modelData.artist,
                                                                        win.selectedPlaylistId
                                                                    )
                                                                    appRootRect.forceActiveFocus()
                                                                }
                                                            }

                                                            ActionPill {
                                                                text: "󰐑 Radio"
                                                                active: true
                                                                fontSize: 8
                                                                horizontalPad: 6
                                                                pillHeight: 18
                                                                onClicked: {
                                                                    service.refreshSmartPlaylist("radio", modelData.id)
                                                                    win.leftTab = 1
                                                                    appRootRect.forceActiveFocus()
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
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    ListScroller {
                                        flickable: appAlbumList
                                    }
                                }
                            }

                            // ===================================================
                            // LEFT TAB 1: INTELLIGENT & CUSTOM PLAYLISTS
                            // ===================================================
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

                                    ActionPill {
                                        text: "󰐊 Play Mix"
                                        primary: true
                                        fontSize: 9
                                        horizontalPad: 9
                                        pillHeight: 24
                                        onClicked: {
                                            service.playSmartPlaylist(service.smartPreset, "")
                                            appRootRect.forceActiveFocus()
                                        }
                                    }

                                    ActionPill {
                                        text: "󰆓 Save"
                                        active: true
                                        fontSize: 9
                                        horizontalPad: 9
                                        pillHeight: 24
                                        onClicked: {
                                            var title = (service.smartPlaylist && service.smartPlaylist.title) || "Intelligent Mix"
                                            service.saveSmartPlaylistAs(title, service.smartPreset, "")
                                            appRootRect.forceActiveFocus()
                                        }
                                    }
                                }

                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 4
                                    Repeater {
                                        model: ["radio", "kindred", "journey", "purchased"]
                                        delegate: ActionPill {
                                            required property string modelData
                                            Layout.fillWidth: true
                                            text: modelData.toUpperCase()
                                            active: service.smartPreset === modelData
                                            fontSize: 9
                                            horizontalPad: 8
                                            pillHeight: 24
                                            onClicked: {
                                                service.refreshSmartPlaylist(modelData, "")
                                                appRootRect.forceActiveFocus()
                                            }
                                        }
                                    }
                                }

                                Item {
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 165

                                    ListView {
                                        id: appSmartPlaylistList
                                        anchors.fill: parent
                                        clip: true
                                        spacing: 3
                                        model: (service.smartPlaylist && service.smartPlaylist.tracks) ? service.smartPlaylist.tracks : []

                                        delegate: Rectangle {
                                            required property var modelData
                                            required property int index
                                            readonly property bool isSmartFocused: win.playlistPaneFocus === 0 && win.focusedSmartTrackIndex === index
                                            width: ListView.view.width - 12
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

                                    ListScroller {
                                        flickable: appSmartPlaylistList
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

                                    ActionPill {
                                        text: "+ Create"
                                        primary: true
                                        fontSize: 9
                                        horizontalPad: 8
                                        pillHeight: 24
                                        onClicked: {
                                            var t = appNewPlaylist.text.trim()
                                            if (!t) t = "Custom Mix " + (service.playlists.length + 1)
                                            service.createPlaylist(t, "User playlist", "", service.albumId, "")
                                            appNewPlaylist.text = ""
                                            appRootRect.forceActiveFocus()
                                        }
                                    }
                                }

                                Item {
                                    Layout.fillWidth: true
                                    Layout.fillHeight: true

                                    ListView {
                                        id: appCustomPlaylistList
                                        anchors.fill: parent
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

                                            width: ListView.view.width - 12
                                            height: isExpanded ? (38 + Math.min(plTracks.length, 6) * 22 + 8) : 34
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
                                                                win.focusedPlaylistTrackIndex = win.selectedPlaylistId ? 0 : -1
                                                                appRootRect.forceActiveFocus()
                                                            }
                                                        }
                                                    }
                                                    ActionPill {
                                                        text: "󰐊 Play"
                                                        primary: true
                                                        fontSize: 9
                                                        horizontalPad: 8
                                                        pillHeight: 22
                                                        onClicked: {
                                                            service.playPlaylist(modelData.id, 0, false)
                                                            appRootRect.forceActiveFocus()
                                                        }
                                                    }
                                                    ActionPill {
                                                        text: "󰆴"
                                                        danger: true
                                                        fontSize: 9
                                                        horizontalPad: 6
                                                        pillHeight: 22
                                                        onClicked: {
                                                            service.deletePlaylist(modelData.id)
                                                            appRootRect.forceActiveFocus()
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
                                                    currentIndex: appPlCard.isPlFocused ? win.focusedPlaylistTrackIndex : -1
                                                    onCurrentIndexChanged: {
                                                        if (currentIndex >= 0 && count > currentIndex) {
                                                            positionViewAtIndex(currentIndex, ListView.Contain)
                                                        }
                                                    }

                                                    delegate: Rectangle {
                                                        required property var modelData
                                                        required property int index
                                                        readonly property bool isPlTrackFocused: appPlCard.isPlFocused && win.focusedPlaylistTrackIndex === index
                                                        width: ListView.view.width
                                                        height: 20
                                                        radius: 3
                                                        color: isPlTrackFocused ? "#15322c" : "#0b0f17"
                                                        border.width: isPlTrackFocused ? 1 : 0
                                                        border.color: win.colAccent

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
                                                                font.pixelSize: 9
                                                                font.bold: isPlTrackFocused
                                                                color: isPlTrackFocused ? win.colAccent : win.colFg
                                                                elide: Text.ElideRight

                                                                MouseArea {
                                                                    anchors.fill: parent
                                                                    cursorShape: Qt.PointingHandCursor
                                                                    onClicked: {
                                                                        win.playlistPaneFocus = 1
                                                                        win.focusedPlaylistIndex = appPlCard.index
                                                                        win.focusedPlaylistTrackIndex = index
                                                                        service.playPlaylist(appPlCard.modelData.id, index, false)
                                                                        appRootRect.forceActiveFocus()
                                                                    }
                                                                }
                                                            }
                                                            Text {
                                                                text: "󰅖"
                                                                textFormat: Text.PlainText
                                                                font.family: "JetBrainsMono Nerd Font"
                                                                font.pixelSize: 9
                                                                color: win.colMuted
                                                                MouseArea {
                                                                    anchors.fill: parent
                                                                    cursorShape: Qt.PointingHandCursor
                                                                    onClicked: {
                                                                        service.removeTrackFromPlaylist(appPlCard.modelData.id, index)
                                                                        appRootRect.forceActiveFocus()
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
                                        flickable: appCustomPlaylistList
                                    }
                                }
                            }

                            // ===================================================
                            // LEFT TAB 2: 4 STAGE MODES & 3-LAYER VISUALISER DECK
                            // ===================================================
                            ColumnLayout {
                                Layout.fillWidth: true
                                Layout.fillHeight: true
                                visible: win.leftTab === 2
                                spacing: 8

                                Text {
                                    Layout.fillWidth: true
                                    text: "󰍹 4 Stage Modes & 3-Layer Visualiser Engine"
                                    textFormat: Text.PlainText
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 11
                                    font.bold: true
                                    color: win.colAccent
                                }

                                // 4 Stage Mode selector cards
                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 5
                                    ActionPill {
                                        Layout.fillWidth: true
                                        text: "󰅖 1. Off / Closed"
                                        active: appVisualiser.stageMode === "off"
                                        onClicked: appVisualiser.setStage("off")
                                    }
                                    ActionPill {
                                        Layout.fillWidth: true
                                        text: "󰀥 2. Album Art"
                                        active: appVisualiser.stageMode === "art"
                                        onClicked: appVisualiser.setStage("art")
                                    }
                                    ActionPill {
                                        Layout.fillWidth: true
                                        text: "󰀥 3. Turntable"
                                        active: appVisualiser.stageMode === "turntable"
                                        onClicked: appVisualiser.setStage("turntable")
                                    }
                                    ActionPill {
                                        Layout.fillWidth: true
                                        text: "󰍹 4. Visualiser"
                                        active: appVisualiser.stageMode === "visualiser"
                                        onClicked: appVisualiser.setStage("visualiser")
                                    }
                                }

                                // 3 Layer Quick Toggles + Presets & Drawer Toggles
                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 5
                                    ActionPill {
                                        text: "L1 Bg: " + (appVisualiser.layer1Enabled ? "ON" : "OFF")
                                        active: appVisualiser.layer1Enabled
                                        onClicked: appVisualiser.layer1Enabled = !appVisualiser.layer1Enabled
                                    }
                                    ActionPill {
                                        text: "L2 Viz: " + (appVisualiser.layer2Enabled ? "ON" : "OFF")
                                        active: appVisualiser.layer2Enabled
                                        onClicked: appVisualiser.layer2Enabled = !appVisualiser.layer2Enabled
                                    }
                                    ActionPill {
                                        text: "L3 Art/Words: " + (appVisualiser.layer3Enabled ? "ON" : "OFF")
                                        active: appVisualiser.layer3Enabled
                                        onClicked: appVisualiser.layer3Enabled = !appVisualiser.layer3Enabled
                                    }
                                    ActionPill {
                                        text: "󰀻 Presets"
                                        primary: appVisualiser.showLayerDrawer && appVisualiser.activeConfigLayer === 0
                                        active: true
                                        onClicked: {
                                            appVisualiser.setStage("visualiser")
                                            appVisualiser.activeConfigLayer = 0
                                            appVisualiser.showLayerDrawer = true
                                        }
                                    }
                                    ActionPill {
                                        text: "󰒓 Layers"
                                        primary: appVisualiser.showLayerDrawer
                                        active: !appVisualiser.showLayerDrawer
                                        onClicked: {
                                            appVisualiser.setStage("visualiser")
                                            appVisualiser.showLayerDrawer = !appVisualiser.showLayerDrawer
                                        }
                                    }
                                }

                                // Layer 3 Content Source + TTE & Mutate Controls
                                RowLayout {
                                    Layout.fillWidth: true
                                    spacing: 5
                                    ActionPill {
                                        text: (service.useAlbumArt ? "󰀥 L3 Art: " : "󰬴 L3 Words: ") +
                                            (service.asciiMode === "block" ? "Block █" : (service.asciiMode === "text" ? "Crisp Text 󰬴" : "Braille ⣿"))
                                        active: true
                                        onClicked: service.cycleLayer3Source()
                                    }
                                    ActionPill {
                                        text: "󰍹 TTE"
                                        active: appVisualiser.layer3Mode === 5 && appVisualiser.layer3Enabled
                                        onClicked: {
                                            appVisualiser.setStage("visualiser")
                                            appVisualiser.activateAndCycleTteInCanvas()
                                        }
                                    }
                                    ActionPill {
                                        text: "󰆍 TTE Term"
                                        onClicked: service.launchTtfxScreensaver("random")
                                    }
                                    ActionPill {
                                        text: "󰒟 Mutate"
                                        onClicked: appVisualiser.randomiseVisuals()
                                    }
                                }

                                ListView {
                                    Layout.fillWidth: true
                                    Layout.fillHeight: true
                                    clip: true
                                    spacing: 4
                                    model: appVisualiser.modeNames

                                    delegate: Rectangle {
                                        required property string modelData
                                        required property int index
                                        readonly property bool isModeActive: appVisualiser.visualMode === index
                                        width: ListView.view.width
                                        height: 28
                                        radius: 5
                                        color: isModeActive ? "#15322c" : "#0b0f17"
                                        border.width: isModeActive ? 1.5 : 1
                                        border.color: isModeActive ? win.colAccent : win.colBorder

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
                                                font.bold: isModeActive
                                                color: isModeActive ? win.colAccent : win.colMuted
                                            }
                                            Text {
                                                Layout.fillWidth: true
                                                text: modelData
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                font.bold: isModeActive
                                                color: isModeActive ? win.colAccent : win.colFg
                                                elide: Text.ElideRight
                                            }
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: {
                                                appVisualiser.setStage("visualiser")
                                                appVisualiser.visualMode = index
                                                appRootRect.forceActiveFocus()
                                            }
                                        }
                                    }
                                }
                            }

                            // ===================================================
                            // LEFT TAB 3: BANDCAMP ACCOUNT LOG IN / LOG OUT & SYNC
                            // ===================================================
                            ColumnLayout {
                                Layout.fillWidth: true
                                Layout.fillHeight: true
                                visible: win.leftTab === 3
                                spacing: 10

                                Rectangle {
                                    Layout.fillWidth: true
                                    implicitHeight: appAuthCol.implicitHeight + 20
                                    radius: 8
                                    color: "#0b0f17"
                                    border.width: 1
                                    border.color: win.colBorder

                                    ColumnLayout {
                                        id: appAuthCol
                                        anchors.fill: parent
                                        anchors.margins: 10
                                        spacing: 8

                                        RowLayout {
                                            Layout.fillWidth: true
                                            spacing: 8

                                            Text {
                                                Layout.fillWidth: true
                                                text: "󰀄 BANDCAMP ACCOUNT LOG IN & LOG OUT"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 11
                                                font.bold: true
                                                color: win.colAccent
                                            }

                                            Rectangle {
                                                Layout.preferredHeight: 20
                                                Layout.preferredWidth: appAuthStateTxt.implicitWidth + 12
                                                radius: 4
                                                color: service.username ? "#15322c" : "#2a1222"
                                                border.width: 1
                                                border.color: service.username ? win.colAccent : win.colUrgent
                                                Text {
                                                    id: appAuthStateTxt
                                                    anchors.centerIn: parent
                                                    text: service.username
                                                        ? ("LOGGED IN: @" + service.username + (service.authenticated ? " (Cookie)" : " (Public Fan)"))
                                                        : "LOGGED OUT"
                                                    textFormat: Text.PlainText
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 9
                                                    font.bold: true
                                                    color: service.username ? win.colAccent : win.colUrgent
                                                }
                                            }
                                        }

                                        // Quick Browser Auth Row: Open Bandcamp Login + Auto-Detect + Log Out
                                        RowLayout {
                                            Layout.fillWidth: true
                                            spacing: 6

                                            ActionPill {
                                                text: "󰖟 Open Bandcamp Login"
                                                active: true
                                                fontSize: 10
                                                horizontalPad: 10
                                                pillHeight: 28
                                                onClicked: service.openBandcampLogin()
                                            }

                                            ActionPill {
                                                text: "󰑐 Detect From Browser"
                                                primary: true
                                                fontSize: 10
                                                horizontalPad: 10
                                                pillHeight: 28
                                                onClicked: service.loginFromBrowser(appUserInput.text.trim())
                                            }

                                            Item { Layout.fillWidth: true }

                                            ActionPill {
                                                visible: Boolean(service.username || service.authenticated)
                                                text: "󰍃 Log Out"
                                                danger: true
                                                fontSize: 10
                                                horizontalPad: 10
                                                pillHeight: 28
                                                onClicked: {
                                                    appUserInput.text = ""
                                                    appCookieInput.text = ""
                                                    service.logoutBandcamp()
                                                }
                                            }
                                        }

                                        // Username Input Row
                                        RowLayout {
                                            Layout.fillWidth: true
                                            spacing: 8

                                            Text {
                                                Layout.preferredWidth: 110
                                                text: "Fan Username:"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                color: win.colFg
                                            }

                                            Rectangle {
                                                Layout.fillWidth: true
                                                Layout.preferredHeight: 28
                                                radius: 5
                                                color: "#111622"
                                                border.width: 1
                                                border.color: appUserInput.activeFocus ? win.colAccent : win.colBorder

                                                TextInput {
                                                    id: appUserInput
                                                    anchors.fill: parent
                                                    anchors.leftMargin: 8
                                                    anchors.rightMargin: 8
                                                    verticalAlignment: Text.AlignVCenter
                                                    text: service.username
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 11
                                                    color: win.colFg
                                                    selectByMouse: true
                                                    clip: true
                                                    Keys.onPressed: event => win.handleKeyNavigation(event)

                                                    Text {
                                                        anchors.fill: parent
                                                        verticalAlignment: Text.AlignVCenter
                                                        text: "e.g. layolayo"
                                                        textFormat: Text.PlainText
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 10
                                                        color: win.colMuted
                                                        visible: !appUserInput.text && !appUserInput.activeFocus
                                                    }
                                                }
                                            }
                                        }

                                        // Optional Identity Cookie Input Row
                                        RowLayout {
                                            Layout.fillWidth: true
                                            spacing: 8

                                            Text {
                                                Layout.preferredWidth: 110
                                                text: "Identity Cookie:"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                color: win.colFg
                                            }

                                            Rectangle {
                                                Layout.fillWidth: true
                                                Layout.preferredHeight: 28
                                                radius: 5
                                                color: "#111622"
                                                border.width: 1
                                                border.color: appCookieInput.activeFocus ? win.colAccent : win.colBorder

                                                TextInput {
                                                    id: appCookieInput
                                                    anchors.fill: parent
                                                    anchors.leftMargin: 8
                                                    anchors.rightMargin: 8
                                                    verticalAlignment: Text.AlignVCenter
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 10
                                                    color: win.colFg
                                                    selectByMouse: true
                                                    clip: true
                                                    echoMode: TextInput.Password
                                                    Keys.onPressed: event => win.handleKeyNavigation(event)

                                                    Text {
                                                        anchors.fill: parent
                                                        verticalAlignment: Text.AlignVCenter
                                                        text: service.authenticated ? "Saved in settings (leave blank to keep)" : "Optional Bandcamp 'identity' cookie…"
                                                        textFormat: Text.PlainText
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 9
                                                        color: win.colMuted
                                                        visible: !appCookieInput.text && !appCookieInput.activeFocus
                                                    }
                                                }
                                            }

                                            ActionPill {
                                                text: "󰌋 Log In & Sync"
                                                primary: true
                                                fontSize: 10
                                                horizontalPad: 10
                                                pillHeight: 28
                                                onClicked: {
                                                    service.saveAuth(appUserInput.text.trim(), appCookieInput.text.trim(), "", "")
                                                    appRootRect.forceActiveFocus()
                                                }
                                            }
                                        }

                                        // Collection Sync & ZIP Import Actions
                                        RowLayout {
                                            Layout.fillWidth: true
                                            spacing: 8

                                            ActionPill {
                                                text: service.syncing ? "󰑐 Syncing Collection…" : "󰑐 Sync Bandcamp & Local"
                                                primary: true
                                                fontSize: 10
                                                horizontalPad: 10
                                                pillHeight: 28
                                                onClicked: service.syncCollection(false)
                                            }

                                            ActionPill {
                                                text: "󰗄 Import Downloads ZIPs"
                                                active: true
                                                fontSize: 10
                                                horizontalPad: 10
                                                pillHeight: 28
                                                onClicked: service.importZips()
                                            }

                                            ActionPill {
                                                text: "󰉋 Open Music Folder"
                                                fontSize: 10
                                                horizontalPad: 10
                                                pillHeight: 28
                                                onClicked: service.openExternal("~/Music/Bandcamp", "Opened ~/Music/Bandcamp")
                                            }
                                        }

                                        // Top Bar LED Equaliser Setting Toggle Row
                                        RowLayout {
                                            Layout.fillWidth: true
                                            spacing: 8

                                            Text {
                                                Layout.preferredWidth: 110
                                                text: "Omarchy Bar:"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 10
                                                color: win.colFg
                                            }

                                            ActionPill {
                                                text: "󰍹 Top Bar LED Equaliser: " + (service.topBarLedEnabled ? "ON" : "OFF")
                                                active: Boolean(service.topBarLedEnabled)
                                                primary: Boolean(service.topBarLedEnabled)
                                                fontSize: 10
                                                horizontalPad: 12
                                                pillHeight: 26
                                                onClicked: service.setTopBarLedEnabled(!service.topBarLedEnabled)
                                            }

                                            Text {
                                                Layout.fillWidth: true
                                                text: "Show compact segmented LED equaliser in top bar (zero text)"
                                                textFormat: Text.PlainText
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 9
                                                color: win.colMuted
                                                elide: Text.ElideRight
                                            }
                                        }

                                        Text {
                                            Layout.fillWidth: true
                                            text: "Indexes all items in your Bandcamp fan collection with full tracklists & direct streams, and merges them with ~/Music/Bandcamp and ~/Music."
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 9
                                            color: win.colMuted
                                            wrapMode: Text.WordWrap
                                        }
                                    }
                                }

                                Item { Layout.fillHeight: true }
                            }

                            // ===================================================
                            // PERSISTENT BOTTOM OF COLLECTION COLUMN:
                            // LIVE DOWNLOAD & SYNC PROGRESS FOOTER ("Downloading 4/10 (23%)")
                            // ===================================================
                            Rectangle {
                                id: appDownloadFooter
                                Layout.fillWidth: true
                                Layout.preferredHeight: (service.downloading || service.syncing) ? 44 : 28
                                radius: 6
                                color: (service.downloading || service.syncing) ? "#122b26" : "#0b0f17"
                                border.width: 1
                                border.color: (service.downloading || service.syncing) ? win.colAccent : win.colBorder

                                ColumnLayout {
                                    anchors.fill: parent
                                    anchors.leftMargin: 8
                                    anchors.rightMargin: 8
                                    anchors.topMargin: 4
                                    anchors.bottomMargin: 4
                                    spacing: 3

                                    RowLayout {
                                        Layout.fillWidth: true
                                        spacing: 6

                                        Text {
                                            Layout.fillWidth: true
                                            text: (service.downloading || service.syncing)
                                                ? ("󰇚 " + service.downloadStatusSummary)
                                                : (service.downloadStatusText !== ""
                                                    ? ("󰄬 " + service.downloadStatusText)
                                                    : ("󰀥 Collection Ready · " + service.purchasedCount + " Purchased · " + service.localCount + " Local"))
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 10
                                            font.bold: service.downloading || service.syncing
                                            color: (service.downloading || service.syncing) ? win.colAccent : win.colMuted
                                            elide: Text.ElideRight
                                        }

                                        Text {
                                            visible: service.downloading
                                            text: (service.downloadTrackTotal > 0
                                                ? (service.downloadTrackIndex + "/" + service.downloadTrackTotal + " ")
                                                : "") + "(" + service.downloadPercent + "%)"
                                            textFormat: Text.PlainText
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 10
                                            font.bold: true
                                            color: win.colAccent
                                        }
                                    }

                                    // Live Progress Bar Fill
                                    Rectangle {
                                        visible: service.downloading || service.syncing
                                        Layout.fillWidth: true
                                        Layout.preferredHeight: 6
                                        radius: 3
                                        color: "#07090e"

                                        Rectangle {
                                            width: service.downloading
                                                ? Math.max(6, parent.width * Math.min(1.0, Math.max(0.0, service.downloadPercent / 100.0)))
                                                : parent.width * 0.35
                                            height: parent.height
                                            radius: 3
                                            color: win.colAccent
                                            Behavior on width { NumberAnimation { duration: 180; easing.type: Easing.OutQuad } }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Right Pane: 4-Stage Mode Deck (Off / Album Art / Turntable / 3-Layer Psychedelic Visualiser)
                    Rectangle {
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        visible: win.visible && (win.visualiserMaximised || appVisualiser.stageMode !== "off")
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
                            bannerLines: service.bannerLines
                            artLines: service.artLines
                            ttfxFrames: service.ttfxFrames
                            useAlbumArt: service.useAlbumArt
                            asciiMode: service.asciiMode
                            asciiSource: service.asciiSource
                            accentColour: win.colAccent
                            urgentColour: win.colUrgent
                            foregroundColour: win.colFg
                            backgroundColour: win.colBg
                            persistedConfig: service.visualiserConfig

                            onRequestToggleFullscreen: {
                                win.visualiserMaximised = !win.visualiserMaximised
                            }
                            onRequestCloseVisualiser: {
                                win.visualiserMaximised = false
                            }
                            onRequestPlayPause: service.togglePlayPause()
                            onRequestNext: service.nextTrack()
                            onRequestPrev: service.prevTrack()
                            onRequestSeek: seconds => service.seekTo(seconds)
                            onRequestToggleUseAlbumArt: service.toggleUseAlbumArt()
                            onRequestToggleAsciiMode: service.toggleAsciiMode()
                            onRequestSetAsciiSourceMode: modeStr => service.setAsciiSourceMode(modeStr)
                            onRequestLaunchTtfxScreensaver: effectName => {
                                service.launchTtfxScreensaver(effectName)
                            }
                            onRequestSelectTtfxEffect: effectName => {
                                service.setTtfxEffect(effectName)
                            }
                            onRequestStageModeChange: newStageMode => {
                                service.setStageMode(newStageMode)
                            }
                            onRequestActionFeedback: message => {
                                service.notifyAction(message)
                            }
                            onRequestSaveVisualiserConfig: cfg => {
                                service.saveVisualiserConfig(cfg)
                            }

                            Connections {
                                target: service
                                function onUseAlbumArtChanged() {
                                    if (appVisualiser.useAlbumArt !== service.useAlbumArt) {
                                        appVisualiser.useAlbumArt = service.useAlbumArt
                                    }
                                }
                                function onAsciiModeChanged() {
                                    if (appVisualiser.asciiMode !== service.asciiMode) {
                                        appVisualiser.asciiMode = service.asciiMode
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
