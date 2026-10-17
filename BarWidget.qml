import QtQuick
import qs.Commons as Commons
import qs.Commons
import qs.Ui

// BarWidget.qml — Omarchy Status Bar Widget for Bandarchy
// Displays ONLY a compact multi-tier segmented LED Equaliser (zero text labels).
// Controlled by Main Settings toggle `topBarLedEnabled` (default: true).
// Left-click: toggle Bandarchy overlay panel
// Middle-click: play/pause
// Right-click: launch dedicated standalone Bandarchy player window
// Scroll wheel: next/previous track

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

    readonly property bool topBarLedEnabled: {
        try {
            if (root.service && root.service.topBarLedEnabled !== undefined) {
                return Boolean(root.service.topBarLedEnabled)
            }
            return true
        } catch (e) {
            return true
        }
    }

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

    property bool interactive: true
    property bool pressable: true
    property bool concealed: false
    property var registeredBar: null
    readonly property bool tooltipHovered: visible && interactive && !concealed && (ledHover.hovered || ledMouse.containsMouse)

    function tooltipText() {
        try {
            if (root.isPlaying && root.service && root.service.trackTitle) {
                var t = String(root.service.trackTitle || "")
                var a = String(root.service.trackArtist || "")
                return "Bandarchy · " + (a ? (a + " — " + t) : t)
            }
            return "Bandarchy · Click for player & visualiser"
        } catch (e) {
            return "Bandarchy"
        }
    }

    function syncClickRegistration() {
        if (root.registeredBar && typeof root.registeredBar.unregisterClickTarget === "function") {
            root.registeredBar.unregisterClickTarget(root)
        }
        root.registeredBar = root.bar
        if (root.registeredBar && typeof root.registeredBar.registerClickTarget === "function") {
            root.registeredBar.registerClickTarget(root)
        }
    }

    function triggerPress(button) {
        root.clickFlash = true
        clickFlashTimer.restart()
        if (root.bar && typeof root.bar.hideTooltip === "function") {
            root.bar.hideTooltip(root)
        }
        if (button === Qt.MiddleButton) {
            if (root.service) root.service.togglePlayPause()
            return
        }
        if (button === Qt.RightButton) {
            if (root.service) root.service.launchStandalonePlayer()
            return
        }
        if (root.bar && root.bar.shell) {
            if (typeof root.bar.shell.toggle === "function")
                root.bar.shell.toggle(root.moduleName, "{}")
            else if (typeof root.bar.shell.summon === "function")
                root.bar.shell.summon(root.moduleName, "{}")
        } else if (root.bar && typeof root.bar.run === "function") {
            root.bar.run("omarchy-shell shell toggle " + root.moduleName + " '{}'")
        } else if (root.pluginApi && typeof root.pluginApi.togglePanel === "function") {
            root.pluginApi.togglePanel(null, ledContainer)
        }
    }

    onBarChanged: {
        root.syncClickRegistration()
        lateClickRegTimer.ticks = 0
        lateClickRegTimer.restart()
    }
    onXChanged: root.syncClickRegistration()
    onWidthChanged: root.syncClickRegistration()
    Component.onCompleted: {
        root.syncClickRegistration()
        lateClickRegTimer.ticks = 0
        lateClickRegTimer.restart()
    }
    Component.onDestruction: {
        if (root.registeredBar && typeof root.registeredBar.unregisterClickTarget === "function") {
            root.registeredBar.unregisterClickTarget(root)
        }
    }

    // Re-register after deferred tray drawer items (e.g. field-notes, arcana) finish loading
    // so Bandarchy always sits at the top of clickTargets above collapsed tray items.
    Timer {
        id: lateClickRegTimer
        property int ticks: 0
        interval: 300
        repeat: true
        onTriggered: {
            root.syncClickRegistration()
            ticks += 1
            if (ticks >= 8) stop()
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

    // Fallback phase timer ONLY when actively playing and waiting for spectrum frames
    property real breathPhase: 0.0
    Timer {
        interval: 90
        repeat: true
        running: root.topBarLedEnabled && (!root.isPlaying || root.miniBands.length === 0)
        onTriggered: {
            if (root.isPlaying) root.breathPhase = (root.breathPhase + 0.22) % (Math.PI * 2)
        }
    }

    readonly property int columnCount: 9
    readonly property int segmentTiers: 6

    readonly property var miniBands: {
        try {
            var raw = root.service ? root.service.spectrumBands : []
            if (!raw || raw.length === 0) return []
            var maxRaw = 80.0
            for (var r = 0; r < raw.length; r++) {
                var rv = Number(raw[r]) || 0
                if (rv > maxRaw) maxRaw = rv
            }
            var count = root.columnCount
            var step = Math.max(1, Math.floor(raw.length / count))
            var out = []
            for (var i = 0; i < count; i++) {
                var idx = Math.min(raw.length - 1, i * step)
                var norm = Math.pow(Math.min(1.0, Math.max(0.0, (Number(raw[idx]) || 0) / maxRaw)), 0.76)
                out.push(Math.min(1.0, Math.max(0.14, norm)))
            }
            return out
        } catch (e) {
            return []
        }
    }

    visible: root.topBarLedEnabled
    implicitWidth: root.topBarLedEnabled ? ledContainer.width : 0
    implicitHeight: root.topBarLedEnabled ? root.barSize : 0

    HoverHandler {
        id: ledHover
        onHoveredChanged: {
            if (hovered) {
                root.syncClickRegistration()
                if (root.bar && typeof root.bar.showTooltip === "function") {
                    root.bar.showTooltip(root, root.tooltipText())
                }
            } else if (root.bar && typeof root.bar.hideTooltip === "function") {
                root.bar.hideTooltip(root)
            }
        }
    }

    property bool clickFlash: false
    Timer {
        id: clickFlashTimer
        interval: 150
        repeat: false
        onTriggered: root.clickFlash = false
    }

    function segmentColour(tierIdx) {
        // tierIdx: 0 = bottom .. 5 = top peak
        if (tierIdx >= 5) return "#f43f5e" // Crimson peak tier
        if (tierIdx === 4) return "#f59e0b" // Amber upper tier
        if (tierIdx >= 2) return "#06b6d4" // Cyan mid tiers
        return "#10b981" // Emerald green bottom tiers
    }

    Rectangle {
        id: ledContainer
        visible: root.topBarLedEnabled
        anchors.verticalCenter: parent.verticalCenter
        readonly property int colW: 3
        readonly property int colGap: 2
        readonly property int hPad: 6
        width: root.columnCount * colW + (root.columnCount - 1) * colGap + hPad * 2
        height: Math.max(14, root.barSize - 6)
        radius: 5
        color: root.clickFlash
            ? Qt.rgba(0.96, 0.25, 0.37, 0.22)
            : ((ledHover.hovered || ledMouse.containsMouse) ? Qt.rgba(0.06, 0.71, 0.83, 0.14) : Qt.rgba(0.04, 0.06, 0.10, 0.55))
        border.width: 1
        border.color: root.clickFlash
            ? "#f43f5e"
            : (root.isPlaying
                ? Qt.rgba(0.06, 0.72, 0.51, 0.65)
                : ((ledHover.hovered || ledMouse.containsMouse) ? Qt.rgba(0.06, 0.71, 0.83, 0.45) : Qt.rgba(1, 1, 1, 0.12)))
        scale: root.clickFlash ? 0.94 : 1.0
        Behavior on scale { NumberAnimation { duration: 90 } }

        Row {
            anchors.centerIn: parent
            spacing: ledContainer.colGap

            Repeater {
                model: root.columnCount
                delegate: Item {
                    id: colItem
                    required property int index
                    width: ledContainer.colW
                    height: Math.max(10, ledContainer.height - 4)

                    readonly property real bandVal: {
                        if (root.isPlaying && root.miniBands.length > index) {
                            return root.miniBands[index]
                        }
                        if (root.isPlaying) {
                            return 0.35 + 0.25 * Math.sin(root.breathPhase + index * 0.7)
                        }
                        // Static calm bottom baseline when not playing (no idle bouncing)
                        return 0.12
                    }

                    readonly property int litSegments: root.isPlaying
                        ? Math.max(1, Math.min(root.segmentTiers, Math.round(bandVal * root.segmentTiers)))
                        : 1

                    Column {
                        anchors.centerIn: parent
                        spacing: 1

                        Repeater {
                            model: root.segmentTiers
                            delegate: Rectangle {
                                required property int index
                                // Top-down repeater: tierIdx 0 is bottom, segmentTiers-1 is top
                                readonly property int tierIdx: (root.segmentTiers - 1) - index
                                readonly property bool isLit: tierIdx < colItem.litSegments
                                readonly property bool isPeak: tierIdx === (colItem.litSegments - 1)
                                width: ledContainer.colW
                                height: Math.max(1, Math.floor((colItem.height - (root.segmentTiers - 1)) / root.segmentTiers))
                                radius: 0.75
                                color: isLit ? root.segmentColour(tierIdx) : "#161f2e"
                                opacity: isLit
                                    ? (root.isPlaying ? (isPeak ? 1.0 : 0.90) : 0.55)
                                    : 0.26
                            }
                        }
                    }
                }
            }
        }

        // Middle and Right clicks pass through Bar.qml's left-button modulePointer MouseArea
        MouseArea {
            id: ledMouse
            anchors.fill: parent
            hoverEnabled: true
            acceptedButtons: Qt.MiddleButton | Qt.RightButton
            cursorShape: Qt.PointingHandCursor
            onEntered: root.syncClickRegistration()
            onClicked: mouse => {
                root.triggerPress(mouse.button)
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
