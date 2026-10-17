import QtQuick
import QtQuick.Effects

// Vinyl.qml — Upgraded Bandarchy Audiophile Turntable & Record Player Deck.
// Evolved from the Omarchy PlexMusic turntable with:
//   - Conical neon audio-reactive & volume-reactive under-platter aura
//   - 78 non-uniform cut microgrooves + stroboscopic platter rim dots
//   - Fixed conical specular light wedges over rotating grooves & circular masked album label
//   - 5 selectable vinyl pressings (Classic Black, Emerald 180g, Nebula Violet, Solar Gold, Picture Disc)
//   - 33⅓ RPM & 45 RPM speed selector + Strobe Illuminator + START/STOP cue button
//   - S-curved metallic tonearm with bearing housing, counterweight, slotted headshell, finger lift & stylus
//   - Interactive groove click-to-seek and tonearm click-to-cue

Item {
    id: root

    property string artPath: ""
    property string art: artPath
    property bool spinning: false
    property bool engaged: spinning || (artPath !== "")
    property bool shown: visible
    property real position: 0.0
    property real duration: 0.0
    property real progress: duration > 0 ? Math.max(0.0, Math.min(1.0, position / duration)) : 0.0  // 0.0 (outer groove) .. 1.0 (inner run-out)
    property real volume: 100.0
    property real bassLevel: 0.0
    property real midLevel: 0.0
    property real highLevel: 0.0
    property real rpm: 33.3              // 33.3 or 45.0
    property int vinylStyle: 0           // 0: Classic Black, 1: Emerald, 2: Nebula, 3: Solar, 4: Picture Disc
    property bool interactive: true
    property bool deckMode: false
    property bool showDeckControls: deckMode || (width >= 180 && height >= 180)

    property color accentColour: "#6ee7b7"
    property color secondaryColour: "#a78bfa"
    property color urgentColour: "#f472b6"
    property color foregroundColour: "#e6edf3"
    property color backgroundColour: "#0c1017"

    signal togglePlayPauseRequested()
    signal requestTogglePlay()
    signal seekRequested(real ratio)
    signal requestSeekRatio(real ratio)
    signal rpmToggled(real newRpm)
    signal vinylStyleCycled(int newStyle)

    readonly property var styleNames: [
        "Classic 180g",
        "Emerald Dub",
        "Nebula Wax",
        "Solar Amber",
        "Picture Disc"
    ]

    readonly property bool isCompact: width < 130 || height < 130
    readonly property real deckPad: isCompact ? 0 : Math.min(width, height) * 0.04
    readonly property real size: Math.max(0, Math.min(width - deckPad * 2, height - (showDeckControls ? 34 : 0) - deckPad))
    readonly property real labelRatio: vinylStyle === 4 ? 0.88 : (isCompact ? 0.50 : 0.32)
    readonly property real labelSize: platter.width * labelRatio

    implicitWidth: 88
    implicitHeight: 88

    onShownChanged: if (shown && spinning) spinAnim.restart()
    onArtPathChanged: {
        grooves.requestPaint()
        neon.requestPaint()
    }
    onVinylStyleChanged: {
        grooves.requestPaint()
        gloss.requestPaint()
        neon.requestPaint()
    }
    onAccentColourChanged: {
        neon.requestPaint()
        armPaint.requestPaint()
        bearingCanvas.requestPaint()
    }

    // Plinth backdrop when rendered as full Turntable Stage
    Rectangle {
        id: plinth
        visible: !root.isCompact
        anchors.fill: parent
        anchors.margins: 2
        radius: 14
        color: Qt.darker(root.backgroundColour, 1.15)
        border.width: 1
        border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.28)

        // Subtle brushed metallic sheen on the plinth
        Rectangle {
            anchors.fill: parent
            radius: 14
            gradient: Gradient {
                orientation: Gradient.Horizontal
                GradientStop { position: 0.0; color: Qt.rgba(1, 1, 1, 0.035) }
                GradientStop { position: 0.45; color: "transparent" }
                GradientStop { position: 0.85; color: Qt.rgba(0, 0, 0, 0.18) }
                GradientStop { position: 1.0; color: Qt.rgba(1, 1, 1, 0.02) }
            }
        }

        // 4 corner isolation feet / bolts
        Repeater {
            model: 4
            delegate: Rectangle {
                width: 8
                height: 8
                radius: 4
                x: (index % 2 === 0) ? 10 : (plinth.width - 18)
                y: (index < 2) ? 10 : (plinth.height - 18)
                color: "#1b2230"
                border.width: 1
                border.color: Qt.rgba(root.foregroundColour.r, root.foregroundColour.g, root.foregroundColour.b, 0.25)
            }
        }
    }

    // ---- Conical Neon Aura behind the Platter ----
    Canvas {
        id: neon
        anchors.centerIn: platter
        width: platter.width * (root.isCompact ? 1.25 : 1.75)
        height: width
        z: 0
        antialiasing: true
        smooth: true
        renderTarget: Canvas.Image
        opacity: root.engaged
            ? Math.min(1.0, (0.18 + 0.65 * Math.max(0, Math.min(100, root.volume)) / 100.0 + root.bassLevel * 0.35))
            : 0.08
        scale: 1.0 + root.bassLevel * 0.05

        onPaint: {
            if (!(width > 0)) return
            var ctx = getContext("2d")
            ctx.reset()
            var c = width / 2
            var r = platter.width / 2
            if (r <= 4) return

            var a = root.accentColour
            var u = root.urgentColour
            var s = root.secondaryColour
            function blend(w) {
                return [
                    u.r * w + a.r * (1 - w),
                    u.g * w + a.g * (1 - w),
                    u.b * w + a.b * (1 - w)
                ]
            }

            var rings = root.isCompact ? 10 : 28
            for (var i = 0; i < rings; i++) {
                var f = i / Math.max(1, rings - 1)
                var rr = r * (1.004 + (root.isCompact ? 0.16 : 0.42) * Math.pow(f, 1.35))
                var lw = (root.isCompact ? 1.5 : 2.5) + (root.isCompact ? 3 : 10) * f
                var al = 0.50 * Math.pow(1 - f, 2.8)
                var g = ctx.createConicalGradient(c, c, 0)
                for (var q = 0; q <= 24; q++) {
                    var ang = (q / 24) * Math.PI * 2
                    var w = 0.5 + 0.5 * Math.cos(2 * ang - 0.85)
                    var col = blend(w)
                    g.addColorStop(
                        q / 24,
                        "rgba(" + Math.round(col[0] * 255) + "," + Math.round(col[1] * 255) + "," + Math.round(col[2] * 255) + "," + al + ")"
                    )
                }
                ctx.strokeStyle = g
                ctx.lineWidth = lw
                ctx.beginPath()
                ctx.arc(c, c, rr, 0, Math.PI * 2)
                ctx.stroke()
            }
        }
    }

    // ---- The Platter & Turning Record ----
    Item {
        id: platter
        z: 1
        width: root.isCompact ? root.size * 0.94 : root.size * 0.80
        height: width
        x: root.isCompact
            ? (root.width - width) * 0.5
            : (root.width - root.size) * 0.5 + root.size * 0.03
        y: root.isCompact
            ? (root.height - height) * 0.5
            : (root.height - (root.showDeckControls ? 34 : 0) - height) * 0.5

        // Machined aluminium platter rim beneath the vinyl
        Rectangle {
            anchors.centerIn: parent
            width: parent.width * 1.035
            height: width
            radius: width / 2
            visible: !root.isCompact
            color: "#151922"
            border.width: 2
            border.color: Qt.rgba(root.foregroundColour.r, root.foregroundColour.g, root.foregroundColour.b, 0.22)
        }

        Item {
            id: turning
            anchors.fill: parent

            // Vinyl substrate colour according to selected pressing style
            Rectangle {
                anchors.fill: parent
                radius: width / 2
                gradient: Gradient {
                    GradientStop {
                        position: 0.0
                        color: root.vinylStyle === 1 ? "#0c3b2e"
                             : (root.vinylStyle === 2 ? "#2b1442"
                             : (root.vinylStyle === 3 ? "#422c0c" : "#22252c"))
                    }
                    GradientStop {
                        position: 0.48
                        color: root.vinylStyle === 1 ? "#062119"
                             : (root.vinylStyle === 2 ? "#160926"
                             : (root.vinylStyle === 3 ? "#241605" : "#0e1015"))
                    }
                    GradientStop {
                        position: 1.0
                        color: root.vinylStyle === 1 ? "#03120d"
                             : (root.vinylStyle === 2 ? "#0b0414"
                             : (root.vinylStyle === 3 ? "#120a02" : "#050609"))
                    }
                }
            }

            // Cut microgrooves & stroboscopic rim dots
            Canvas {
                id: grooves
                anchors.fill: parent
                antialiasing: true
                renderTarget: Canvas.Image
                onWidthChanged: requestPaint()
                onHeightChanged: requestPaint()
                onPaint: {
                    if (!(width > 0) || !(height > 0)) return
                    var c = width / 2
                    var outer = Math.max(0, c * 0.965)
                    var inner = Math.max(0, c * (root.labelRatio / 2) * 1.08)
                    if (!isFinite(outer) || !isFinite(inner) || inner >= outer) return
                    var ctx = getContext("2d")
                    ctx.reset()

                    // Stroboscopic rim dots along outer platter bevel
                    if (!root.isCompact) {
                        var dots = 72
                        var rimR = c * 0.985
                        ctx.fillStyle = "rgba(230,237,243,0.42)"
                        for (var d = 0; d < dots; d++) {
                            var da = (d / dots) * Math.PI * 2
                            var dx = c + Math.cos(da) * rimR
                            var dy = c + Math.sin(da) * rimR
                            ctx.fillRect(dx - 1, dy - 1, 2, 2)
                        }
                    }

                    // Colour splatter / marble veins for special pressings
                    if (root.vinylStyle === 1 || root.vinylStyle === 2 || root.vinylStyle === 3) {
                        var veinCol = root.vinylStyle === 1 ? "rgba(110,231,183,0.12)"
                                    : (root.vinylStyle === 2 ? "rgba(167,139,250,0.14)" : "rgba(251,191,36,0.14)")
                        ctx.strokeStyle = veinCol
                        ctx.lineWidth = Math.max(2, c * 0.04)
                        for (var v = 0; v < 6; v++) {
                            var va = (v / 6) * Math.PI * 2
                            ctx.beginPath()
                            ctx.arc(c, c, inner + (outer - inner) * (0.25 + (v % 3) * 0.25), va, va + 0.75)
                            ctx.stroke()
                        }
                    }

                    // 78 non-uniform microgroove rings with track gap bands
                    var rings = root.isCompact ? 26 : 78
                    for (var i = 0; i < rings; i++) {
                        var t = i / Math.max(1, rings - 1)
                        var r = outer - (outer - inner) * t
                        ctx.beginPath()
                        ctx.arc(c, c, r, 0, Math.PI * 2)
                        var isBandGap = (i % 14 === 0)
                        ctx.lineWidth = isBandGap ? 1.4 : 0.7
                        ctx.strokeStyle = isBandGap
                            ? "rgba(255,255,255,0.085)"
                            : ((i % 5 === 0) ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.028)")
                        ctx.stroke()
                    }

                    // Run-out matrix groove ring near label
                    ctx.beginPath()
                    ctx.arc(c, c, inner * 0.95, 0, Math.PI * 2)
                    ctx.lineWidth = 1.6
                    ctx.strokeStyle = "rgba(255,255,255,0.065)"
                    ctx.stroke()
                }
            }

            // Circular masked Album Cover Centre Label
            Item {
                id: label
                width: root.labelSize
                height: root.labelSize
                anchors.centerIn: parent
                layer.enabled: true
                layer.smooth: true

                Rectangle {
                    anchors.fill: parent
                    radius: width / 2
                    color: "#161b26"
                }

                Image {
                    id: cover
                    anchors.fill: parent
                    source: {
                        var p = String(root.artPath || root.art || "")
                        if (!p || p.indexOf("..") >= 0) return ""
                        if (p.indexOf("file:///") === 0) return p
                        if (p.indexOf("/") === 0) return "file://" + p
                        return ""
                    }
                    fillMode: Image.PreserveAspectCrop
                    cache: true
                    asynchronous: true
                    smooth: true
                    mipmap: true
                    visible: false
                    sourceSize.width: 512
                    sourceSize.height: 512
                }

                MultiEffect {
                    anchors.fill: parent
                    source: cover
                    maskEnabled: true
                    maskSource: labelMask
                    maskThresholdMin: 0.4
                    maskSpreadAtMin: 0.6
                    visible: cover.status === Image.Ready
                }

                Item {
                    id: labelMask
                    width: root.labelSize
                    height: root.labelSize
                    layer.enabled: true
                    layer.smooth: true
                    visible: false
                    Rectangle {
                        anchors.fill: parent
                        radius: width / 2
                        color: "black"
                        antialiasing: true
                    }
                }

                Text {
                    anchors.centerIn: parent
                    visible: cover.status !== Image.Ready
                    text: "󰀥"
                    textFormat: Text.PlainText
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: Math.max(12, parent.height * 0.40)
                    color: root.accentColour
                }

                Rectangle {
                    anchors.fill: parent
                    radius: width / 2
                    color: "transparent"
                    border.width: 1.5
                    border.color: Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.65)
                    antialiasing: true
                }
            }

            // Spindle hole
            Rectangle {
                anchors.centerIn: parent
                width: Math.max(6, root.size * 0.026)
                height: width
                radius: width / 2
                color: "#06080c"
                border.width: 1
                border.color: Qt.rgba(1, 1, 1, 0.35)
            }

            // GUI-thread NumberAnimation so hiding/showing panels never stalls rotation
            NumberAnimation {
                id: spinAnim
                target: turning
                property: "rotation"
                from: 0
                to: 360
                duration: root.rpm > 40 ? 1333 : 1800   // 45 RPM (1.333s) vs 33 1/3 RPM (1.8s)
                loops: Animation.Infinite
                running: root.spinning && root.shown
            }
        }

        // Fixed Conical Specular Light Reflections over rotating grooves
        Canvas {
            id: gloss
            anchors.fill: parent
            antialiasing: true
            renderTarget: Canvas.Image
            onWidthChanged: requestPaint()
            onHeightChanged: requestPaint()
            onPaint: {
                if (!(width > 0) || !(height > 0)) return
                var c = width / 2
                var outer = c * 0.975
                var inner = Math.max(0, c * (root.labelRatio / 2) * 1.05)
                if (!isFinite(outer) || !isFinite(inner) || inner >= outer) return
                var ctx = getContext("2d")
                ctx.reset()

                ctx.beginPath()
                ctx.arc(c, c, outer, 0, Math.PI * 2)
                ctx.arc(c, c, inner, 0, Math.PI * 2, true)
                ctx.clip()

                var cg = ctx.createConicalGradient(c, c, -0.6)
                var stops = [
                    [0.00, 0.00], [0.06, 0.28], [0.10, 0.04], [0.17, 0.16], [0.24, 0.00],
                    [0.31, 0.09], [0.36, 0.00], [0.47, 0.19], [0.53, 0.04], [0.58, 0.25],
                    [0.64, 0.00], [0.74, 0.11], [0.80, 0.00], [0.88, 0.18], [0.94, 0.02],
                    [1.00, 0.00]
                ]
                for (var i = 0; i < stops.length; i++) {
                    cg.addColorStop(stops[i][0], "rgba(165,215,255," + stops[i][1] + ")")
                }
                ctx.fillStyle = cg
                ctx.fillRect(0, 0, width, height)

                // Active groove progress ring indicator
                if (!root.isCompact && root.engaged) {
                    var progR = outer - (outer - inner) * Math.max(0.0, Math.min(1.0, root.progress))
                    ctx.beginPath()
                    ctx.arc(c, c, progR, 0, Math.PI * 2)
                    ctx.lineWidth = 1.5
                    ctx.strokeStyle = Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.32 + root.bassLevel * 0.35)
                    ctx.stroke()
                }
            }
        }

        Connections {
            target: root
            function onProgressChanged() {
                if (!root.isCompact && root.visible) gloss.requestPaint()
            }
        }

        // Interactive Groove Scrubbing / Seeking MouseArea on the Platter
        MouseArea {
            anchors.fill: parent
            enabled: root.interactive && !root.isCompact
            hoverEnabled: true
            cursorShape: Qt.PointingHandCursor
            onClicked: function(mouse) {
                var cx = width * 0.5
                var cy = height * 0.5
                var dx = mouse.x - cx
                var dy = mouse.y - cy
                var dist = Math.sqrt(dx * dx + dy * dy)
                var outer = cx * 0.965
                var inner = cx * (root.labelRatio / 2) * 1.08
                if (dist < inner) {
                    root.togglePlayPauseRequested()
                    root.requestTogglePlay()
                } else if (dist <= outer && outer > inner) {
                    var ratio = Math.max(0.0, Math.min(1.0, (outer - dist) / (outer - inner)))
                    root.seekRequested(ratio)
                    root.requestSeekRatio(ratio)
                }
            }
        }
    }

    // ---- Stroboscopic Speed Illuminator Lamp (Bottom-Left of Platter) ----
    Rectangle {
        visible: !root.isCompact
        x: platter.x + platter.width * 0.04
        y: platter.y + platter.height * 0.86
        width: Math.max(14, root.size * 0.055)
        height: Math.max(14, root.size * 0.055)
        radius: width / 2
        z: 3
        color: root.spinning ? root.urgentColour : "#232a38"
        border.width: 2
        border.color: "#0b0e14"

        Rectangle {
            anchors.centerIn: parent
            width: parent.width * 1.9
            height: width
            radius: width / 2
            color: root.urgentColour
            opacity: root.spinning ? (0.28 + root.bassLevel * 0.25) : 0.0
        }
    }

    // ---- The Pivoting Tonearm, Bearing, Counterweight & Cartridge ----
    readonly property real pivotX: platter.x + platter.width * 1.12
    readonly property real pivotY: platter.y + platter.height * 0.12
    readonly property real armLen: platter.width * 0.74
    readonly property real cwLen: platter.width * 0.085
    readonly property real angleOn: -(68.3 - Math.max(0, Math.min(1, root.progress)) * 20.8)
    readonly property real angleRest: -88.0

    readonly property color metal: Qt.rgba(
        root.foregroundColour.r * 0.85 + 0.10,
        root.foregroundColour.g * 0.85 + 0.10,
        root.foregroundColour.b * 0.85 + 0.10,
        1.0
    )
    readonly property color metalDark: Qt.darker(metal, 1.9)
    readonly property color housing: Qt.rgba(metal.r * 0.55, metal.g * 0.55, metal.b * 0.58, 1.0)

    // Tonearm rest post & clip
    Item {
        visible: !root.isCompact
        x: root.pivotX - root.armLen * 0.55 * Math.cos(88 * Math.PI / 180) - width / 2
        y: root.pivotY + root.armLen * 0.55 * Math.sin(88 * Math.PI / 180) - height * 0.5
        width: root.size * 0.048
        height: root.size * 0.05
        z: 2
        Rectangle {
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.bottom: parent.bottom
            width: parent.width * 0.42
            height: parent.height
            radius: 2
            color: root.housing
            border.width: 1
            border.color: Qt.rgba(0, 0, 0, 0.5)
        }
        Rectangle {
            anchors.top: parent.top
            width: parent.width
            height: parent.height * 0.36
            radius: 3
            color: root.housing
            border.width: 1
            border.color: Qt.rgba(root.foregroundColour.r, root.foregroundColour.g, root.foregroundColour.b, 0.25)
        }
    }

    // Tonearm gimbal bearing assembly
    Item {
        id: bearing
        visible: !root.isCompact
        x: root.pivotX - width / 2
        y: root.pivotY - height / 2
        width: platter.width * 0.15
        height: width
        z: 4
        Canvas {
            id: bearingCanvas
            anchors.fill: parent
            antialiasing: true
            smooth: true
            renderTarget: Canvas.Image
            onWidthChanged: requestPaint()
            onHeightChanged: requestPaint()
            onPaint: {
                if (!(width > 0)) return
                var ctx = getContext("2d")
                ctx.reset()
                var c = width / 2
                var r = c * 0.95
                var m = root.metal
                function rgba(col, a) {
                    return "rgba(" + Math.round(col.r * 255) + "," + Math.round(col.g * 255) + "," + Math.round(col.b * 255) + "," + a + ")"
                }
                var sh = ctx.createRadialGradient(c, c + r * 0.15, r * 0.5, c, c + r * 0.15, r * 1.2)
                sh.addColorStop(0, "rgba(0,0,0,0.45)")
                sh.addColorStop(1, "rgba(0,0,0,0)")
                ctx.fillStyle = sh
                ctx.beginPath()
                ctx.arc(c, c + r * 0.15, r * 1.2, 0, Math.PI * 2)
                ctx.fill()

                var g = ctx.createLinearGradient(c - r, c - r, c + r, c + r)
                g.addColorStop(0, rgba(Qt.lighter(m, 1.35), 1))
                g.addColorStop(0.5, rgba(m, 1))
                g.addColorStop(1, rgba(Qt.darker(m, 2.2), 1))
                ctx.fillStyle = g
                ctx.beginPath()
                ctx.arc(c, c, r, 0, Math.PI * 2)
                ctx.fill()
                ctx.lineWidth = 1
                ctx.strokeStyle = "rgba(0,0,0,0.55)"
                ctx.stroke()

                var g2 = ctx.createLinearGradient(c, c - r * 0.5, c, c + r * 0.5)
                g2.addColorStop(0, rgba(Qt.lighter(m, 1.5), 1))
                g2.addColorStop(1, rgba(Qt.darker(m, 1.9), 1))
                ctx.fillStyle = g2
                ctx.beginPath()
                ctx.arc(c, c, r * 0.5, 0, Math.PI * 2)
                ctx.fill()
                ctx.strokeStyle = rgba(root.accentColour, 0.55)
                ctx.stroke()

                ctx.fillStyle = rgba(Qt.darker(m, 3), 1)
                ctx.beginPath()
                ctx.arc(c, c, r * 0.12, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        MouseArea {
            anchors.fill: parent
            enabled: root.interactive
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                root.togglePlayPauseRequested()
                root.requestTogglePlay()
            }
        }
    }

    // S-curved Tonearm + Counterweight + Headshell + Cartridge + Stylus
    Item {
        id: arm
        visible: !root.isCompact
        readonly property real pad: root.size * 0.16
        readonly property real pivotLocalX: pad + root.armLen
        width: pivotLocalX + root.cwLen + root.size * 0.06
        height: root.size * 0.34
        x: root.pivotX - pivotLocalX
        y: root.pivotY - height / 2
        z: 3
        readonly property real tubeH: Math.max(3, platter.width * 0.028)
        readonly property real cy: height / 2
        readonly property real noseOff: -tubeH * 1.1

        property real swing: root.spinning ? 1.0 : (root.engaged ? 0.88 : 0.0)
        Behavior on swing { NumberAnimation { duration: 850; easing.type: Easing.InOutCubic } }
        property real creep: Math.max(0.0, Math.min(1.0, root.progress))
        Behavior on creep { NumberAnimation { duration: 600; easing.type: Easing.InOutQuad } }
        readonly property real angleOnSmooth: -(68.3 - creep * 20.8)
        readonly property real angle: root.angleRest + (angleOnSmooth - root.angleRest) * swing

        transform: Rotation {
            origin.x: arm.pivotLocalX
            origin.y: arm.cy
            angle: arm.angle
        }

        Canvas {
            id: armPaint
            anchors.fill: parent
            antialiasing: true
            smooth: true
            renderTarget: Canvas.Image
            onWidthChanged: requestPaint()
            onHeightChanged: requestPaint()
            onPaint: {
                if (!(width > 0) || !(height > 0)) return
                var ctx = getContext("2d")
                ctx.reset()
                var m = root.metal
                var md = root.metalDark
                var acc = root.accentColour
                function rgba(col, a) {
                    return "rgba(" + Math.round(col.r * 255) + "," + Math.round(col.g * 255) + "," + Math.round(col.b * 255) + "," + a + ")"
                }
                var px = arm.pivotLocalX
                var cy = arm.cy
                var T = arm.tubeH
                var L = root.armLen
                var nose = arm.pad + root.size * 0.035
                var off = arm.noseOff

                function tubePath(dy) {
                    ctx.beginPath()
                    ctx.moveTo(px + root.size * 0.015, cy + dy)
                    ctx.lineTo(px - L * 0.30, cy + dy)
                    ctx.bezierCurveTo(
                        px - L * 0.72, cy + dy,
                        nose + L * 0.30, cy - off * 1.6 + dy,
                        nose, cy + off + dy
                    )
                }
                ctx.lineCap = "round"
                ctx.lineJoin = "round"
                tubePath(3)
                ctx.lineWidth = T * 1.1
                ctx.strokeStyle = "rgba(0,0,0,0.38)"
                ctx.stroke()

                tubePath(0)
                ctx.lineWidth = T
                ctx.strokeStyle = rgba(md, 1)
                ctx.stroke()

                tubePath(-T * 0.10)
                ctx.lineWidth = T * 0.62
                ctx.strokeStyle = rgba(m, 1)
                ctx.stroke()

                tubePath(-T * 0.26)
                ctx.lineWidth = T * 0.22
                ctx.strokeStyle = rgba(Qt.lighter(m, 1.45), 0.95)
                ctx.stroke()

                // Counterweight cylinder
                var cwX = px + root.size * 0.028
                var cwW = Math.max(4, root.cwLen - root.size * 0.02)
                var cwH = T * 2.6
                var cg = ctx.createLinearGradient(0, cy - cwH / 2, 0, cy + cwH / 2)
                cg.addColorStop(0, rgba(Qt.lighter(m, 1.3), 1))
                cg.addColorStop(0.45, rgba(m, 1))
                cg.addColorStop(1, rgba(Qt.darker(m, 2.4), 1))
                ctx.fillStyle = cg
                ctx.beginPath()
                ctx.roundedRect(cwX, cy - cwH / 2, cwW, cwH, 2.5, 2.5)
                ctx.fill()
                ctx.lineWidth = 1
                ctx.strokeStyle = "rgba(0,0,0,0.55)"
                ctx.stroke()

                // Headshell, cartridge & stylus
                ctx.save()
                ctx.translate(nose, cy + off)
                ctx.rotate(22 * Math.PI / 180)
                var hsL = root.size * 0.155
                var hsH = T * 1.55
                function metalGrad(y0, y1) {
                    var gg = ctx.createLinearGradient(0, y0, 0, y1)
                    gg.addColorStop(0, rgba(Qt.lighter(m, 1.35), 1))
                    gg.addColorStop(0.5, rgba(m, 1))
                    gg.addColorStop(1, rgba(Qt.darker(m, 2.0), 1))
                    return gg
                }
                ctx.fillStyle = metalGrad(-T * 0.9, T * 0.9)
                ctx.beginPath()
                ctx.roundedRect(-hsL * 0.10, -T * 0.9, hsL * 0.14, T * 1.8, T * 0.35, T * 0.35)
                ctx.fill()

                ctx.fillStyle = "rgba(0,0,0,0.32)"
                ctx.beginPath()
                ctx.roundedRect(-hsL, -hsH / 2 + 3, hsL * 0.94, hsH, hsH * 0.3, hsH * 0.3)
                ctx.fill()

                ctx.fillStyle = metalGrad(-hsH / 2, hsH / 2)
                ctx.beginPath()
                ctx.roundedRect(-hsL, -hsH / 2, hsL * 0.94, hsH, hsH * 0.3, hsH * 0.3)
                ctx.fill()
                ctx.strokeStyle = "rgba(0,0,0,0.5)"
                ctx.stroke()

                ctx.fillStyle = "rgba(0,0,0,0.38)"
                for (var q = 0; q < 3; q++) {
                    ctx.beginPath()
                    ctx.roundedRect(-hsL * (0.30 + q * 0.18), -hsH * 0.14, hsL * 0.10, hsH * 0.28, 1, 1)
                    ctx.fill()
                }

                // Finger lift
                ctx.strokeStyle = rgba(Qt.lighter(m, 1.15), 1)
                ctx.lineWidth = Math.max(1.5, T * 0.38)
                ctx.lineCap = "round"
                ctx.beginPath()
                ctx.moveTo(-hsL * 0.40, -hsH * 0.5)
                ctx.lineTo(-hsL * 0.62, -hsH * 1.15)
                ctx.stroke()

                // Cartridge + accent stripe + stylus tip
                ctx.fillStyle = rgba(Qt.darker(m, 2.6), 1)
                ctx.beginPath()
                ctx.roundedRect(-hsL * 0.96, hsH * 0.30, hsL * 0.30, hsH * 0.55, 1.5, 1.5)
                ctx.fill()
                ctx.strokeStyle = rgba(acc, 0.95)
                ctx.lineWidth = 1.4
                ctx.beginPath()
                ctx.moveTo(-hsL * 0.93, hsH * 0.58)
                ctx.lineTo(-hsL * 0.69, hsH * 0.58)
                ctx.stroke()

                ctx.strokeStyle = rgba(root.foregroundColour, 0.95)
                ctx.lineWidth = Math.max(1, T * 0.22)
                ctx.beginPath()
                ctx.moveTo(-hsL * 0.84, hsH * 0.85)
                ctx.lineTo(-hsL * 0.88, hsH * 1.25)
                ctx.stroke()
                ctx.restore()
            }
        }
    }

    // ---- Plinth Tactile Deck Controls (START/STOP Cue, 33⅓ / 45 RPM, Vinyl Pressing) ----
    Row {
        visible: root.showDeckControls
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 8
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: 8
        z: 5

        // START / STOP Cue Button
        Rectangle {
            height: 24
            width: cueTxt.implicitWidth + 18
            radius: 6
            color: cueArea.pressed
                ? root.urgentColour
                : (root.spinning
                    ? Qt.rgba(root.accentColour.r, root.accentColour.g, root.accentColour.b, 0.24)
                    : (cueArea.containsMouse ? "#222938" : "#151a24"))
            border.width: 1
            border.color: root.spinning ? root.accentColour : "#2e3748"
            scale: cueArea.pressed ? 0.94 : 1.0
            Behavior on scale { NumberAnimation { duration: 90 } }

            Text {
                id: cueTxt
                anchors.centerIn: parent
                text: root.spinning ? "󰏤 STOP / CUE" : "󰐊 START DECK"
                textFormat: Text.PlainText
                font.family: "JetBrainsMono Nerd Font"
                font.pixelSize: 10
                font.bold: true
                color: cueArea.pressed ? "#090d14" : (root.spinning ? root.accentColour : root.foregroundColour)
            }

            MouseArea {
                id: cueArea
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    root.togglePlayPauseRequested()
                    root.requestTogglePlay()
                }
            }
        }

        // 33 1/3 vs 45 RPM Speed Toggle
        Rectangle {
            height: 24
            width: rpmTxt.implicitWidth + 16
            radius: 6
            color: rpmArea.pressed
                ? root.accentColour
                : (rpmArea.containsMouse ? "#222938" : "#151a24")
            border.width: 1
            border.color: root.rpm > 40 ? root.urgentColour : "#2e3748"
            scale: rpmArea.pressed ? 0.94 : 1.0
            Behavior on scale { NumberAnimation { duration: 90 } }

            Text {
                id: rpmTxt
                anchors.centerIn: parent
                text: root.rpm > 40 ? "45 RPM" : "33⅓ RPM"
                textFormat: Text.PlainText
                font.family: "JetBrainsMono Nerd Font"
                font.pixelSize: 10
                font.bold: true
                color: rpmArea.pressed ? "#090d14" : (root.rpm > 40 ? root.urgentColour : root.foregroundColour)
            }

            MouseArea {
                id: rpmArea
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    root.rpm = (root.rpm > 40) ? 33.3 : 45.0
                    root.rpmToggled(root.rpm)
                }
            }
        }

        // Vinyl Pressing Style Selector
        Rectangle {
            height: 24
            width: styleTxt.implicitWidth + 16
            radius: 6
            color: styleArea.pressed
                ? root.secondaryColour
                : (styleArea.containsMouse ? "#222938" : "#151a24")
            border.width: 1
            border.color: root.vinylStyle > 0 ? root.secondaryColour : "#2e3748"
            scale: styleArea.pressed ? 0.94 : 1.0
            Behavior on scale { NumberAnimation { duration: 90 } }

            Text {
                id: styleTxt
                anchors.centerIn: parent
                text: "󰀥 " + (root.styleNames[root.vinylStyle % root.styleNames.length] || "Classic 180g")
                textFormat: Text.PlainText
                font.family: "JetBrainsMono Nerd Font"
                font.pixelSize: 10
                font.bold: true
                color: styleArea.pressed ? "#090d14" : (root.vinylStyle > 0 ? root.secondaryColour : root.foregroundColour)
            }

            MouseArea {
                id: styleArea
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    root.vinylStyle = (root.vinylStyle + 1) % root.styleNames.length
                    root.vinylStyleCycled(root.vinylStyle)
                }
            }
        }
    }
}
