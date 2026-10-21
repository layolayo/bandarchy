import QtQuick

// Spectrum.qml — 64-band Cava audio spectrum analyser strip with peak hold,
// adaptive gain normalisation, and Omarchy theme colour gradients.

Item {
    id: root

    property var bands: []
    property bool active: false
    property int barCount: 32
    property color accentColour: "#6ee7b7"
    property color secondaryColour: "#38bdf8"
    property color peakColour: "#c084fc"
    property real sensitivity: 1.0

    property var smoothValues: []
    property var peakValues: []
    property real rollingPeak: 140.0

    onBandsChanged: canvas.requestPaint()
    onActiveChanged: canvas.requestPaint()

    FrameAnimation {
        running: root.visible && root.active
        onTriggered: canvas.requestPaint()
    }

    Canvas {
        id: canvas
        anchors.fill: parent
        renderTarget: Canvas.Image

        onPaint: {
            var ctx = getContext("2d")
            var w = width
            var h = height
            ctx.clearRect(0, 0, w, h)
            if (w <= 2 || h <= 2) return

            var count = Math.max(4, Math.min(64, root.barCount))
            var raw = root.bands || []
            var step = raw.length > 0 ? Math.max(1, Math.floor(raw.length / count)) : 1

            while (root.smoothValues.length < count) root.smoothValues.push(0.06)
            while (root.peakValues.length < count) root.peakValues.push(0.08)

            var maxRaw = 0.0
            for (var r = 0; r < raw.length; r++) {
                var rv = Number(raw[r]) || 0
                if (rv > maxRaw) maxRaw = rv
            }
            if (maxRaw > root.rollingPeak) {
                root.rollingPeak = root.rollingPeak + (maxRaw - root.rollingPeak) * 0.45
            } else {
                root.rollingPeak = Math.max(85.0, root.rollingPeak * 0.992)
            }
            var denom = Math.max(85.0, root.rollingPeak)

            var gap = count > 24 ? 2 : 1.5
            var barW = Math.max(1.5, (w - gap * (count - 1)) / count)

            var grad = ctx.createLinearGradient(0, h, 0, 0)
            grad.addColorStop(0.0, root.accentColour.toString())
            grad.addColorStop(0.65, root.secondaryColour.toString())
            grad.addColorStop(1.0, root.peakColour.toString())

            ctx.fillStyle = grad
            for (var i = 0; i < count; i++) {
                var idx = Math.min(raw.length - 1, i * step)
                var rawVal = (raw.length > 0 && idx >= 0) ? (Number(raw[idx]) || 0) : 0.0
                var norm = Math.pow(Math.min(1.0, Math.max(0.0, rawVal / denom)), 0.78) * root.sensitivity
                var v = norm
                if (!root.active) {
                    v = 0.06
                } else if (v < 0.05) {
                    v = 0.05
                }
                v = Math.min(1.0, v)

                var prev = root.smoothValues[i] || 0.06
                var next = prev + (v - prev) * (v > prev ? 0.58 : 0.25)
                root.smoothValues[i] = next

                if (next >= (root.peakValues[i] || 0.0)) {
                    root.peakValues[i] = next
                } else {
                    root.peakValues[i] = Math.max(next, (root.peakValues[i] || 0.0) - 0.018)
                }

                var bh = Math.max(2, next * (h - 3))
                var bx = i * (barW + gap)
                var by = h - bh
                ctx.fillRect(bx, by, barW, bh)
            }

            if (root.active && h >= 18) {
                ctx.fillStyle = root.peakColour.toString()
                for (var p = 0; p < count; p++) {
                    var px = p * (barW + gap)
                    var py = Math.max(0, h - root.peakValues[p] * (h - 3) - 2)
                    ctx.fillRect(px, py, barW, 1.5)
                }
            }
        }
    }
}
