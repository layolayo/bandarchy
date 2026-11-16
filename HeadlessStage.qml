import QtQuick
import QtQuick.Window

Window {
    id: stageWin
    visible: true
    width: 1920
    height: 1080
    color: "#05070b"
    title: "Bandarchy HDMI Stage Output"

    property double lastServerUpdatedAt: -1.0
    property int lastActionSeq: 0
    property int lastPhotoSeq: -1
    property string cachedArtSeed: ""
    property bool busyPolling: false

    Visualiser {
        id: viz
        anchors.fill: parent
        visible: true
        isFullscreen: true
        showHud: false
        showLayerDrawer: false
        playing: true

        onRequestSaveVisualiserConfig: configObj => {
            // Sync any autonomous randomiser timer updates back to bandarchy-web
            var xhr = new XMLHttpRequest()
            xhr.open("POST", "http://127.0.0.1:8765/api/from-stage")
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.send(JSON.stringify(configObj || {}))
        }

        onRequestPhotoPick: (category, stem) => {
            var xhr = new XMLHttpRequest()
            xhr.open("POST", "http://127.0.0.1:8765/api/action")
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.send(JSON.stringify({
                name: "photoPick",
                arg: {
                    category: category || viz.photoActiveCategory || "all",
                    stem: stem || "",
                    photoMotionMode: viz.photoMotionMode,
                    photoMotionActivity: viz.photoMotionActivity,
                    photoXyzTilt: viz.photoXyzTilt,
                    photoZoomPunch: viz.photoZoomPunch,
                    photoPaletteBloom: viz.photoPaletteBloom,
                    photoWarpIntensity: viz.photoWarpIntensity,
                    photoStrobeSpeed: viz.photoStrobeSpeed,
                    photoPlaneShearEnabled: viz.photoPlaneShearEnabled,
                    photoPlaneShear: viz.photoPlaneShear
                }
            }))
        }
    }

    function fetchFullState() {
        var xhr = new XMLHttpRequest()
        xhr.open("GET", "http://127.0.0.1:8765/api/state")
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText)
                    var cfg = data.config || ({})
                    var srvUpd = Number(cfg.updatedAt || 0.0)
                    var cfgChanged = Math.abs(srvUpd - stageWin.lastServerUpdatedAt) > 0.0001
                    stageWin.lastServerUpdatedAt = srvUpd
                    if (data.artLines && data.artLines.length > 0 && data.artSeed !== stageWin.cachedArtSeed) {
                        stageWin.cachedArtSeed = String(data.artSeed || "")
                        viz.artLines = data.artLines
                        viz.asciiLines = data.artLines
                    }
                    if (data.photo && typeof data.photo === "object") {
                        var p = data.photo
                        var pSeq = Number(p.seq || 0)
                        if (pSeq !== stageWin.lastPhotoSeq) {
                            stageWin.lastPhotoSeq = pSeq
                            if (Array.isArray(p.categories)) viz.photoCategories = p.categories
                            if (p.categoryCounts) viz.photoCategoryCounts = p.categoryCounts
                            if (p.totalOriginals !== undefined) viz.photoTotalOriginals = Number(p.totalOriginals || 0)
                            if (p.totalProcessed !== undefined) viz.photoTotalProcessed = Number(p.totalProcessed || 0)
                            if (p.activeCategory) viz.photoActiveCategory = String(p.activeCategory)
                            if (p.activeStem !== undefined && String(p.activeStem) !== viz.photoActiveStem) {
                                viz.photoPreviousVariants = viz.photoActiveVariants || ({})
                                viz.photoActiveStem = String(p.activeStem)
                            }
                            if (p.variants) viz.photoActiveVariants = p.variants
                            if (p.sameEffectPeers) viz.photoSameEffectPeers = p.sameEffectPeers
                            if (p.sameEffectByVariant) viz.photoSameEffectByVariant = p.sameEffectByVariant
                            if (p.randomPoolPeers) viz.photoRandomPoolPeers = p.randomPoolPeers
                        }
                    }
                    if (cfgChanged) {
                        if (cfg.trackArtist !== undefined) viz.trackArtist = String(cfg.trackArtist)
                        if (cfg.trackTitle !== undefined) viz.trackTitle = String(cfg.trackTitle)
                        if (cfg.trackAlbum !== undefined) viz.trackAlbum = String(cfg.trackAlbum)
                        if (cfg.artPath !== undefined) viz.artPath = String(cfg.artPath)
                        if (cfg.stageMode !== undefined) viz.stageMode = String(cfg.stageMode)
                        if (cfg.showHud !== undefined) viz.showHud = Boolean(cfg.showHud)
                        viz.applyPersistedConfig(cfg)
                    }
                    viz.playing = Boolean(cfg.playing !== false)

                    var actSeq = Number(data.actionSeq || 0)
                    if (actSeq > stageWin.lastActionSeq) {
                        stageWin.lastActionSeq = actSeq
                        stageWin.dispatchAction(String(data.actionName || ""), data.actionArg)
                    }
                } catch (e) {}
            }
        }
        xhr.send()
    }

    function dispatchAction(name, arg) {
        if (name === "randomiseAll") viz.randomiseVisuals()
        else if (name === "toggleAllRand") viz.toggleAllRandomisations()
        else if (name === "shatter") viz.triggerShatterImpulse()
        else if (name === "randL1") viz.randomiseLayer1()
        else if (name === "randEq") viz.randomiseLayerEq()
        else if (name === "randVectors") viz.randomiseLayerVectors()
        else if (name === "randL2") viz.randomiseLayer2()
        else if (name === "randL4") viz.randomiseLayer4()
        else if (name === "randL3") viz.randomiseLayer3()
        else if (name === "applyPreset") viz.applyCollectivePreset(Number(arg || 0), true)
        else if (name === "applyL3Preset") viz.applySavedL3Config(Number(arg || 0))
        else if (name === "photoHold") viz.triggerPhotoHoldByKey()
        else if (name === "photoRandFx") viz.syncPhotoStateFromRoot()
    }

    // Fast lightweight 60 Hz audio bands + change-check poll (~250 bytes, zero heavy JSON/art rebuilds)
    Timer {
        interval: 16
        running: true
        repeat: true
        triggeredOnStart: true
        onTriggered: {
            if (stageWin.busyPolling) return
            stageWin.busyPolling = true
            var xhr = new XMLHttpRequest()
            xhr.open("GET", "http://127.0.0.1:8765/api/fast")
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    stageWin.busyPolling = false
                    if (xhr.status === 200) {
                        try {
                            var fast = JSON.parse(xhr.responseText)
                            if (fast.bands) {
                                viz.bands = fast.bands
                            }
                            var shouldPlay = Boolean(fast.playing !== false)
                            if (viz.playing !== shouldPlay) {
                                viz.playing = shouldPlay
                            }
                            var srvUpd = Number(fast.updatedAt || 0.0)
                            var actSeq = Number(fast.actionSeq || 0)
                            var pSeq = Number(fast.photoSeq || 0)
                            if (Math.abs(srvUpd - stageWin.lastServerUpdatedAt) > 0.0001 || actSeq > stageWin.lastActionSeq || pSeq !== stageWin.lastPhotoSeq) {
                                stageWin.fetchFullState()
                            }
                        } catch (e) {}
                    }
                }
            }
            xhr.send()
        }
    }
}
