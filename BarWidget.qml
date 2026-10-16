import QtQuick
import QtQuick.Layouts
import qs.Commons as Commons
import qs.Modules.Bar.Extras as BarExtras
import qs.Services.UI as UI

// BarWidget.qml — Omarchy Status Bar Widget for Bandarchy
// Displays Bandcamp emblem, mini live spectrum bars when playing, and
// current track or collection count.
// Left-click: toggle Bandarchy overlay panel
// Middle-click: play/pause
// Right-click: launch dedicated standalone Bandarchy player window

Item {
    id: root

    property var pluginApi: null
    property var screen: null
    property string widgetId: ""
    property string section: ""
    property int sectionWidgetIndex: -1
    property int sectionWidgetsCount: 0

    readonly property var service: pluginApi ? pluginApi.mainInstance : null
    readonly property bool isPlaying: service ? service.activelyPlaying : false
    readonly property bool hasTrack: service ? Boolean(service.playing && service.trackTitle) : false

    readonly property string barPosition: Commons.Settings.data.bar.position || "top"
    readonly property bool isVertical: barPosition === "left" || barPosition === "right"

    readonly property string displayText: {
        if (!service) return "BC"
        if (service.syncing) return "Syncing…"
        if (hasTrack) {
            var artist = service.trackArtist ? (service.trackArtist + " — ") : ""
            return artist + service.trackTitle
        }
        if (service.purchasedCount > 0) {
            return service.purchasedCount + " BC · " + service.localCount + " Local"
        }
        return "Bandarchy"
    }

    readonly property string tooltipText: {
        if (!service) return "Bandarchy — Bandcamp & Local Audio Player"
        var lines = []
        if (hasTrack) {
            lines.push((service.paused ? "Paused: " : "Playing: ") + service.trackTitle)
            if (service.trackArtist) lines.push("Artist: " + service.trackArtist)
            if (service.trackAlbum) lines.push("Album: " + service.trackAlbum)
            lines.push("Source: " + (service.playSource === "local" ? "Lossless Local" : "Bandcamp Stream"))
        } else {
            lines.push("Bandarchy — Bandcamp & Local Collection")
            lines.push("Purchased: " + service.purchasedCount + " · Local: " + service.localCount + " (" + service.trackCount + " tracks)")
        }
        lines.push("Left-click: Panel · Mid-click: Play/Pause · Right-click: Dedicated Player")
        return lines.join("\n")
    }

    implicitWidth: pill.width
    implicitHeight: pill.height

    BarExtras.BarPill {
        id: pill

        screen: root.screen
        oppositeDirection: UI.BarService.getPillDirection(root)
        icon: isPlaying ? "󰀥" : "󰎆"
        text: root.displayText
        autoHide: false
        forceOpen: !root.isVertical && (root.hasTrack || (root.service && root.service.albumCount > 0))
        tooltipText: root.tooltipText

        customIconColor: root.isPlaying
            ? Commons.Color.accent
            : (root.hasTrack ? Commons.Color.foreground : Commons.Color.foreground)

        onClicked: {
            if (root.pluginApi) {
                root.pluginApi.togglePanel(root.screen, pill)
            }
        }

        onMiddleClicked: {
            if (root.service) {
                root.service.togglePlayPause()
            }
        }

        onRightClicked: {
            if (root.service) {
                root.service.launchStandalonePlayer()
            }
        }

        onWheel: delta => {
            if (!root.service) return
            if (delta > 0) root.service.nextTrack()
            else if (delta < 0) root.service.prevTrack()
        }
    }
}
