import QtQuick
import qs.Commons as Commons
import qs.Commons
import qs.Ui

// BarWidget.qml — Omarchy Status Bar Widget for Bandarchy
// Displays Bandcamp emblem, mini live spectrum bars when playing, and
// current track or collection count.
// Left-click: toggle Bandarchy overlay panel
// Middle-click: play/pause
// Right-click: launch dedicated standalone Bandarchy player window

BarWidget {
    id: root
    moduleName: "io.github.layolayo.bandarchy"

    property var pluginApi: null
    property var bandarchyService: null

    readonly property var service: bandarchyService
        ? bandarchyService
        : (bar && bar.shell
            ? bar.shell.serviceFor("io.github.layolayo.bandarchy")
            : (pluginApi ? pluginApi.mainInstance : null))

    readonly property bool showTrack: {
        var v = setting("showTrack", true)
        return v !== false && v !== "false"
    }
    readonly property int maxTrackChars: Math.max(8, Number(setting("maxTrackChars", 28)) || 28)

    readonly property bool isPlaying: {
        try {
            return root.service ? Boolean(root.service.activelyPlaying) : false
        } catch (e) {
            return false
        }
    }

    readonly property bool hasTrack: {
        try {
            return root.service ? Boolean(root.service.playing && root.service.trackTitle) : false
        } catch (e) {
            return false
        }
    }

    // Poll until serviceFor() resolves if the service loads asynchronously after the bar widget
    Timer {
        interval: 250
        repeat: true
        running: Boolean(root.bar && root.bar.shell && !root.bandarchyService)
        onTriggered: {
            var svc = root.bar.shell.serviceFor("io.github.layolayo.bandarchy")
            if (svc) root.bandarchyService = svc
        }
    }

    function displayText() {
        try {
            if (!root.service) return "Bandarchy"
            if (root.service.syncing) return "Syncing…"
            if (root.hasTrack) {
                var artist = root.service.trackArtist ? (root.service.trackArtist + " — ") : ""
                var s = artist + (root.service.trackTitle || "")
                if (s.length > root.maxTrackChars) {
                    s = s.substring(0, root.maxTrackChars - 1) + "…"
                }
                return s
            }
            if (root.service.purchasedCount > 0) {
                return root.service.purchasedCount + " BC · " + root.service.localCount + " Local"
            }
            return "Bandarchy"
        } catch (e) {
            return "Bandarchy"
        }
    }

    function tooltipText() {
        try {
            if (!root.service) return "Bandarchy — Bandcamp & Local Audio Player"
            var lines = []
            if (root.hasTrack) {
                lines.push((root.service.paused ? "Paused: " : "Playing: ") + root.service.trackTitle)
                if (root.service.trackArtist) lines.push("Artist: " + root.service.trackArtist)
                if (root.service.trackAlbum) lines.push("Album: " + root.service.trackAlbum)
                lines.push("Source: " + (root.service.playSource === "local" ? "Lossless Local" : "Bandcamp Stream"))
            } else {
                lines.push("Bandarchy — Bandcamp & Local Collection")
                lines.push("Purchased: " + root.service.purchasedCount + " · Local: " + root.service.localCount + " (" + root.service.trackCount + " tracks)")
            }
            lines.push("Left-click: Panel · Mid-click: Play/Pause · Right-click: Dedicated Player")
            return lines.join("\n")
        } catch (e) {
            return "Bandarchy — Bandcamp & Local Audio Player"
        }
    }

    readonly property var miniBands: {
        try {
            var raw = root.service ? root.service.spectrumBands : []
            if (!raw || raw.length === 0) return []
            var maxRaw = 85.0
            for (var r = 0; r < raw.length; r++) {
                var rv = Number(raw[r]) || 0
                if (rv > maxRaw) maxRaw = rv
            }
            var count = 8
            var step = Math.max(1, Math.floor(raw.length / count))
            var out = []
            for (var i = 0; i < count; i++) {
                var idx = Math.min(raw.length - 1, i * step)
                var norm = Math.pow(Math.min(1.0, Math.max(0.0, (Number(raw[idx]) || 0) / maxRaw)), 0.78)
                out.push(Math.min(1.0, Math.max(0.10, norm)))
            }
            return out
        } catch (e) {
            return []
        }
    }

    readonly property bool meterLive: !root.vertical && root.isPlaying && root.miniBands.length > 0

    implicitWidth: button.implicitWidth + (meter.visible ? meter.width + 2 : 0)
    implicitHeight: root.vertical ? button.implicitHeight : root.barSize

    property bool clickFlash: false
    Timer {
        id: clickFlashTimer
        interval: 160
        repeat: false
        onTriggered: root.clickFlash = false
    }

    WidgetButton {
        id: button
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        bar: root.bar
        tooltipText: root.tooltipText()
        dimmed: !root.isPlaying && !root.hasTrack && !root.clickFlash
        foreground: root.clickFlash ? Commons.Color.urgent : (root.isPlaying ? Commons.Color.accent : Commons.Color.foreground)
        fontSize: Style.font.body
        horizontalMargin: 6
        verticalPadding: 2
        scale: root.clickFlash ? 0.96 : 1.0
        Behavior on scale { NumberAnimation { duration: 100 } }

        text: {
            var icon = root.isPlaying ? "󰀥" : (root.hasTrack ? "󰏤" : "󰎆")
            if (root.vertical) return icon
            var label = root.showTrack ? root.displayText() : ""
            return label ? (icon + "  " + label) : icon
        }

        onPressed: function(mouseButton) {
            root.clickFlash = true
            clickFlashTimer.restart()
            if (mouseButton === Qt.MiddleButton) {
                if (root.service) root.service.togglePlayPause()
                return
            }
            if (mouseButton === Qt.RightButton) {
                if (root.service) root.service.launchStandalonePlayer()
                return
            }
            if (root.bar && root.bar.shell) {
                if (typeof root.bar.shell.toggle === "function")
                    root.bar.shell.toggle(root.moduleName, "{}")
                else if (typeof root.bar.shell.summon === "function")
                    root.bar.shell.summon(root.moduleName, "{}")
            } else if (root.pluginApi && typeof root.pluginApi.togglePanel === "function") {
                root.pluginApi.togglePanel(null, button)
            }
        }
    }

    Item {
        id: meter
        anchors.left: button.right
        anchors.leftMargin: 2
        anchors.verticalCenter: parent.verticalCenter
        visible: root.meterLive
        readonly property int bars: root.miniBands.length
        readonly property real barW: 3
        readonly property real gap: 1
        width: bars > 0 ? bars * (barW + gap) - gap + 8 : 0
        height: Math.max(10, root.barSize - 8)

        Row {
            anchors.fill: parent
            anchors.leftMargin: 4
            anchors.rightMargin: 4
            spacing: meter.gap

            Repeater {
                model: meter.bars
                delegate: Item {
                    width: meter.barW
                    height: meter.height
                    readonly property real v: index < root.miniBands.length ? root.miniBands[index] : 0.1

                    Rectangle {
                        anchors.bottom: parent.bottom
                        width: parent.width
                        height: Math.max(2, parent.height * v)
                        radius: 1
                        color: index % 2 === 0 ? Commons.Color.accent : Commons.Color.urgent
                        opacity: 0.92
                    }
                }
            }
        }

        MouseArea {
            anchors.fill: parent
            onClicked: {
                if (root.bar && root.bar.shell && typeof root.bar.shell.toggle === "function") {
                    root.bar.shell.toggle(root.moduleName, "{}")
                }
            }
        }
    }

    WheelHandler {
        onWheel: event => {
            if (!root.service) return
            if (event.angleDelta.y > 0) root.service.nextTrack()
            else if (event.angleDelta.y < 0) root.service.prevTrack()
        }
    }
}
