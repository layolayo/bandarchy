import QtQuick

// Vinyl.qml — Audiophile spinning vinyl platter with album art centre label
// and bass-reactive aura.

Item {
    id: root

    property string artPath: ""
    property bool spinning: false
    property color accentColour: "#6ee7b7"
    property real bassLevel: 0.0
    property real angleDeg: 0.0

    implicitWidth: 88
    implicitHeight: 88

    Timer {
        interval: 25
        running: root.visible && root.spinning
        repeat: true
        onTriggered: {
            root.angleDeg = (root.angleDeg + 1.35) % 360.0
            discCanvas.requestPaint()
        }
    }

    onArtPathChanged: discCanvas.requestPaint()
    onBassLevelChanged: discCanvas.requestPaint()

    Rectangle {
        id: halo
        anchors.centerIn: parent
        width: Math.min(parent.width, parent.height) * (0.96 + root.bassLevel * 0.08)
        height: width
        radius: width / 2
        color: "transparent"
        border.width: root.spinning ? 2 : 1
        border.color: root.accentColour
        opacity: root.spinning ? (0.45 + root.bassLevel * 0.45) : 0.22
    }

    Canvas {
        id: discCanvas
        anchors.fill: parent

        onPaint: {
            var ctx = getContext("2d")
            var w = width
            var h = height
            ctx.clearRect(0, 0, w, h)
            var cx = w * 0.5
            var cy = h * 0.5
            var r = Math.min(w, h) * 0.46
            if (r <= 4) return

            ctx.save()
            ctx.translate(cx, cy)
            ctx.rotate((root.angleDeg * Math.PI) / 180.0)

            // Vinyl platter body
            ctx.beginPath()
            ctx.arc(0, 0, r, 0, Math.PI * 2.0)
            ctx.fillStyle = "#0b0e14"
            ctx.fill()

            // Microgroove rings
            for (var g = 0.52; g < 0.94; g += 0.08) {
                ctx.beginPath()
                ctx.arc(0, 0, r * g, 0, Math.PI * 2.0)
                ctx.strokeStyle = "rgba(255,255,255,0.07)"
                ctx.lineWidth = 1.0
                ctx.stroke()
            }

            // Specular highlight wedge
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.arc(0, 0, r * 0.96, -0.35, 0.35)
            ctx.closePath()
            ctx.fillStyle = "rgba(255,255,255,0.06)"
            ctx.fill()

            ctx.restore()
        }
    }

    // Album cover centrepiece
    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width, parent.height) * 0.54
        height: width
        radius: width / 2
        color: "#161b26"
        border.width: 1.5
        border.color: root.accentColour
        clip: true

        Image {
            id: coverImg
            anchors.fill: parent
            anchors.margins: 2
            source: root.artPath ? ("file://" + root.artPath) : ""
            fillMode: Image.PreserveAspectCrop
            asynchronous: true
            cache: false
            visible: status === Image.Ready
        }

        Text {
            anchors.centerIn: parent
            visible: coverImg.status !== Image.Ready
            text: "󰀥"
            textFormat: Text.PlainText
            font.family: "JetBrainsMono Nerd Font"
            font.pixelSize: parent.width * 0.42
            color: root.accentColour
        }

        // Spindle hole
        Rectangle {
            anchors.centerIn: parent
            width: 8
            height: 8
            radius: 4
            color: "#090c10"
            border.width: 1
            border.color: "#59ffffff"
        }
    }
}
