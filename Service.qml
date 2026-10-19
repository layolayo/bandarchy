import QtQuick
import Quickshell
import Quickshell.Io

// Service.qml — Bandarchy background state, mpv IPC, Cava 60 FPS spectrum
// stream, ASCII album art & banner transcoder, Bandcamp auth/login/logout,
// real-time download progress tracker, and intelligent/user playlist manager.

Item {
    id: root
    visible: false

    property var pluginApi: null

    readonly property string baseDir: {
        var u = Qt.resolvedUrl(".").toString()
        if (u.indexOf("file://") === 0) u = u.slice(7)
        if (u.length > 1 && u.charAt(u.length - 1) === "/") u = u.slice(0, -1)
        return u
    }
    readonly property string binPath: baseDir + "/bin/bandarchy"
    readonly property string cavaConfPath: baseDir + "/share/cava.conf"

    // Playback state
    property bool playing: false
    property bool paused: false
    property string trackTitle: ""
    property string trackArtist: ""
    property string trackAlbum: ""
    property string albumId: ""
    property string trackId: ""
    property string playSource: "local"
    property string artPath: ""
    property real position: 0.0
    property real duration: 0.0
    property int volume: 100
    property bool muted: false
    property int playlistPos: 0
    property int playlistCount: 0
    property bool shuffle: false
    property bool loop: false
    property var queue: []

    // Collection, Auth & Search state
    property string username: ""
    property bool authenticated: false
    property bool loggedOut: false
    readonly property bool loggedIn: Boolean(root.authenticated || (root.username && !root.loggedOut))
    property bool hasIdentity: false
    property bool hasBrowserSession: false
    property string downloadDir: ""
    property string preferredFormat: "flac"
    property int albumCount: 0
    property int purchasedCount: 0
    property int localCount: 0
    property int trackCount: 0
    property string activeScope: "all"
    property string searchQuery: ""
    property var albums: []
    property var searchTracks: []
    property var availableZips: []
    property var favourites: []
    property bool syncing: false
    property var syncState: ({ running: false })
    property var downloadState: ({ running: false })
    property var downloadQueue: []
    property string lastError: ""

    // Live download progress convenience properties for UI footers & buttons
    readonly property bool downloading: Boolean(root.downloadState && root.downloadState.running)
    readonly property string downloadAlbumId: (root.downloadState && root.downloadState.albumId) ? String(root.downloadState.albumId) : ""
    readonly property string downloadingAlbumId: downloadAlbumId
    readonly property string downloadTitle: (root.downloadState && root.downloadState.title) ? String(root.downloadState.title) : ""
    readonly property string downloadStage: (root.downloadState && root.downloadState.stage) ? String(root.downloadState.stage) : ""
    readonly property int downloadPercent: (root.downloadState && root.downloadState.percent !== undefined) ? Math.max(0, Math.min(100, Number(root.downloadState.percent) || 0)) : 0
    readonly property int downloadTrackIndex: (root.downloadState && root.downloadState.trackIndex !== undefined) ? Math.max(0, Number(root.downloadState.trackIndex) || 0) : 0
    readonly property int downloadTrackTotal: (root.downloadState && root.downloadState.trackTotal !== undefined) ? Math.max(0, Number(root.downloadState.trackTotal) || 0) : 0
    readonly property string downloadStatusSummary: {
        if (root.downloading) {
            var titlePart = root.downloadTitle ? (" " + root.downloadTitle) : ""
            var trackPart = root.downloadTrackTotal > 0
                ? (" " + root.downloadTrackIndex + "/" + root.downloadTrackTotal)
                : ""
            var pctPart = " (" + root.downloadPercent + "%)"
            var stageVerb = "Downloading"
            if (root.downloadStage === "extracting") stageVerb = "Extracting"
            else if (root.downloadStage === "indexing") stageVerb = "Indexing"
            else if (root.downloadStage === "resolving") stageVerb = "Resolving"
            var qSuffix = root.downloadQueue.length > 0 ? (" [+" + root.downloadQueue.length + " queued]") : ""
            return stageVerb + titlePart + trackPart + pctPart + qSuffix
        }
        if (root.syncing) {
            return "Synchronising Bandcamp & Local Collection…"
        }
        return ""
    }
    readonly property string downloadStatusText: downloadStatusSummary

    // Activity & Button Feedback Toast state
    property string activityMessage: ""
    property int activityCounter: 0

    Timer {
        id: activityClearTimer
        interval: 3800
        repeat: false
        onTriggered: root.activityMessage = ""
    }

    function notifyAction(msg) {
        if (!msg) return
        root.activityMessage = msg
        root.activityCounter = root.activityCounter + 1
        activityClearTimer.restart()
    }

    function notifyActivity(msg) {
        notifyAction(msg)
    }

    // History & Intelligent / Custom Playlists state
    property var lastPlayedTrack: null
    property var recentTracks: []
    property string smartPreset: "radio"
    property var smartPlaylist: ({ title: "Sonic Radio", description: "", tracks: [], seed: null })
    property var playlists: []

    // Stage Mode & 3-Layer Visualiser / Omarchy Screensaver state
    property bool topBarLedEnabled: true
    property string stageMode: "visualiser" // "off", "art", "turntable", "visualiser"
    property bool useAlbumArt: false
    property string asciiMode: "text" // "braille", "block", "text"
    property string asciiSource: "omarchy-ascii"
    property var asciiLines: []
    property var bannerLines: []
    property var artLines: []
    property var ttfxFrames: []
    property string ttfxEffect: "random"
    property bool visualiserActive: false
    property bool fullscreenVisualiserOpen: false
    property var visualiserConfig: ({})
    property bool visualiserConfigLoaded: false

    // Stark Photo Realm (Layer 1 Mode 12) state
    property var photoCategories: ["all", "brutalist", "architecture", "nature", "objects", "cyberpunk", "characters", "custom"]
    property var photoCategoryCounts: ({ "all": 0, "brutalist": 0, "architecture": 0, "nature": 0, "objects": 0, "cyberpunk": 0, "characters": 0, "custom": 0 })
    property string photoActiveCategory: "all"
    property string photoActiveStem: ""
    property var photoActiveVariants: ({})
    property var photoSameEffectPeers: ({})
    property var photoSameEffectByVariant: ({})
    property var photoRandomPoolPeers: ({})
    property int photoTotalProcessed: 0
    property int photoTotalOriginals: 0
    property string photoCustomDir: "~/Pictures/bandarchy/categories/custom"
    property bool photoBusy: false
    property string photoStatusMessage: ""

    // 60 FPS 64-band Cava spectrum
    property var spectrumBands: []

    readonly property bool activelyPlaying: root.playing && !root.paused

    Component.onCompleted: {
        loadVisualiserConfig()
        refreshStatus()
        loadCollection("all", "")
        refreshPhotoStatus()
    }

    property bool _batchUpdatingTrack: false

    onAlbumIdChanged: if (!root._batchUpdatingTrack) refreshAsciiArt()
    onArtPathChanged: if (!root._batchUpdatingTrack) refreshAsciiArt()
    onTrackArtistChanged: if (!root._batchUpdatingTrack) refreshAsciiArt()
    onTrackTitleChanged: if (!root._batchUpdatingTrack) refreshAsciiArt()
    onTrackAlbumChanged: if (!root._batchUpdatingTrack) refreshAsciiArt()

    // Fast status poll during downloads/syncs (450ms), normal poll during playback (1100ms)
    Timer {
        interval: (root.downloading || root.syncing) ? 450 : (root.activelyPlaying ? 1100 : 2500)
        running: true
        repeat: true
        onTriggered: root.refreshStatus()
    }

    // Smooth 250ms local playhead interpolation between mpv status polls
    Timer {
        id: playheadTickTimer
        interval: 250
        running: root.activelyPlaying
        repeat: true
        onTriggered: {
            if (root.activelyPlaying) {
                var nextPos = root.position + 0.25
                root.position = (root.duration > 0.5) ? Math.min(root.duration, nextPos) : nextPos
            }
        }
    }

    // Status process
    Process {
        id: statusProc
        command: [root.binPath, "status"]
        property string outBuf: ""
        stdout: SplitParser {
            onRead: line => { statusProc.outBuf += line }
        }
        onExited: {
            var raw = statusProc.outBuf.trim()
            statusProc.outBuf = ""
            if (!raw) return
            try {
                var d = JSON.parse(raw)
                if (!d.ok) return
                var wasDownloading = root.downloading
                var wasSyncing = root.syncing

                root.username = d.username || ""
                root.authenticated = Boolean(d.authenticated)
                root.loggedOut = Boolean(d.loggedOut)
                root.hasIdentity = Boolean(d.hasIdentity)
                root.hasBrowserSession = Boolean(d.hasBrowserSession)
                root.downloadDir = d.downloadDir || ""
                root.preferredFormat = d.preferredFormat || "flac"
                root.albumCount = Number(d.albumCount) || 0
                root.purchasedCount = Number(d.purchasedCount) || 0
                root.localCount = Number(d.localCount) || 0
                root.trackCount = Number(d.trackCount) || 0
                root.availableZips = d.availableZips || []
                root.favourites = d.favourites || []
                root.syncState = d.sync || ({ running: false })
                root.syncing = Boolean(d.sync && d.sync.running)
                root.downloadState = d.download || ({ running: false })
                root.lastError = d.lastError || ""

                if (!root._topBarLedChangedLocally) {
                    if (d.topBarLedEnabled !== undefined) {
                        root.topBarLedEnabled = Boolean(d.topBarLedEnabled)
                    } else if (d.top_bar_led !== undefined) {
                        root.topBarLedEnabled = Boolean(d.top_bar_led)
                    }
                }

                if (d.stageMode && ["off", "art", "turntable", "visualiser"].indexOf(d.stageMode) >= 0) {
                    if (!root._stageChangedLocally) {
                        root.stageMode = d.stageMode
                    }
                }

                // If a download or sync just finished, reload collection and drain download queue
                if ((wasDownloading && !root.downloading) || (wasSyncing && !root.syncing)) {
                    root.loadCollection(root.activeScope, root.searchQuery)
                    if (wasDownloading && !root.downloading) {
                        if (root.downloadState && root.downloadState.stage === "done") {
                            root.notifyAction("Download complete: " + (root.downloadState.title || "Album") + " (100%)")
                        }
                        root._pumpDownloadQueue()
                    }
                }

                var prevLastId = root.lastPlayedTrack ? (root.lastPlayedTrack.id || "") : ""
                root.lastPlayedTrack = d.lastPlayedTrack || null
                root.recentTracks = d.recentTracks || []
                if (d.playlists) root.playlists = d.playlists

                var newLastId = root.lastPlayedTrack ? (root.lastPlayedTrack.id || "") : ""
                if (newLastId && newLastId !== prevLastId) {
                    root.refreshSmartPlaylist(root.smartPreset, "")
                }

                var p = d.playback || {}
                var inOptimisticWindow = (Date.now() < root._optimisticPlayUntil)
                if (p.playing || !inOptimisticWindow) {
                    var fb = root.lastPlayedTrack || ((root.albums && root.albums.length > 0) ? root.albums[0] : null)
                    var prevTitle = root.trackTitle
                    var prevArtist = root.trackArtist
                    var prevAlbum = root.trackAlbum
                    var prevAlbumId = root.albumId
                    var prevTrackId = root.trackId
                    var prevArtPath = root.artPath

                    root._batchUpdatingTrack = true
                    root.playing = Boolean(p.playing)
                    root.paused = Boolean(p.paused)
                    root.trackTitle = p.title || (fb ? (fb.title || fb.album || "") : root.trackTitle)
                    root.trackArtist = p.artist || (fb ? (fb.artist || "") : root.trackArtist)
                    root.trackAlbum = p.album || (fb ? (fb.album || fb.title || "") : root.trackAlbum)
                    root.albumId = p.albumId || (fb ? (fb.albumId || fb.id || "") : root.albumId)
                    root.trackId = p.trackId || (fb ? (fb.id || "") : root.trackId)
                    root.playSource = p.playSource || "local"
                    root.artPath = p.artPath || (fb ? (fb.artPath || "") : root.artPath)
                    root._batchUpdatingTrack = false

                    root.position = p.playing
                        ? Math.max(0.0, Number(p.position) || 0.0)
                        : ((p.position !== undefined && Number(p.position) > 0) ? Number(p.position) : ((fb && fb.position) ? Number(fb.position) : 0.0))
                    root.duration = Number(p.duration) || (fb && fb.duration ? Number(fb.duration) : 0.0)
                    if (Date.now() >= root._optimisticVolumeUntil) {
                        if (p.volume !== undefined) {
                            root.volume = Math.max(0, Math.min(100, Math.round(Number(p.volume) || 0)))
                        }
                        if (p.muted !== undefined) {
                            root.muted = Boolean(p.muted)
                        }
                    }
                    root.playlistPos = (p.playlistPos !== undefined) ? (Number(p.playlistPos) || 0) : ((fb && fb.playlistPos) ? Number(fb.playlistPos) : 0)
                    root.playlistCount = Number(p.playlistCount) || 0
                    root.shuffle = Boolean(p.shuffle)
                    root.loop = Boolean(p.loop)
                    root.queue = p.queue || []

                    var metaChanged = (
                        root.trackTitle !== prevTitle ||
                        root.trackArtist !== prevArtist ||
                        root.trackAlbum !== prevAlbum ||
                        root.albumId !== prevAlbumId ||
                        root.trackId !== prevTrackId ||
                        root.artPath !== prevArtPath
                    )
                    if (metaChanged && (root.trackTitle || root.trackArtist || root.trackAlbum)) {
                        root.refreshAsciiArt("", "random")
                    }
                }
            } catch (e) {
                root._batchUpdatingTrack = false
            }
        }
    }

    property bool _topBarLedChangedLocally: false
    property bool _stageChangedLocally: false
    property double _optimisticPlayUntil: 0
    property double _optimisticVolumeUntil: 0

    Timer {
        id: fastPlayPollTimer
        interval: 250
        repeat: false
        onTriggered: root.refreshStatus()
    }

    // Collection / search loader process
    Process {
        id: collectionProc
        property string outBuf: ""
        stdout: SplitParser {
            onRead: line => { collectionProc.outBuf += line }
        }
        onExited: {
            var raw = collectionProc.outBuf.trim()
            collectionProc.outBuf = ""
            if (!raw) return
            try {
                var d = JSON.parse(raw)
                if (d.ok) {
                    root.albums = d.albums || []
                    root.searchTracks = d.tracks || []
                    if (d.availableZips) root.availableZips = d.availableZips
                    if (!root.playing && root.albums.length > 0) {
                        var fb = root.lastPlayedTrack || root.albums[0]
                        if (fb) {
                            var prevT = root.trackTitle
                            var prevAr = root.trackArtist
                            var prevAl = root.trackAlbum
                            var prevAp = root.artPath
                            root._batchUpdatingTrack = true
                            root.trackTitle = fb.title || fb.album || root.trackTitle
                            root.trackArtist = fb.artist || root.trackArtist
                            root.trackAlbum = fb.album || fb.title || root.trackAlbum
                            root.albumId = fb.albumId || fb.id || root.albumId
                            if (!root.trackId && fb.id) root.trackId = fb.id
                            root.artPath = fb.artPath || root.artPath
                            root._batchUpdatingTrack = false
                            if (root.position <= 0 && fb.position) root.position = Number(fb.position) || 0.0
                            if (root.duration <= 0 && fb.duration) root.duration = Number(fb.duration) || 0.0
                            if (root.trackTitle !== prevT || root.trackArtist !== prevAr || root.trackAlbum !== prevAl || root.artPath !== prevAp) {
                                root.refreshAsciiArt()
                            }
                        }
                    }
                    if (root.asciiLines.length === 0 && root.albums.length > 0) {
                        root.refreshAsciiArt()
                    }
                }
            } catch (e) {
                root._batchUpdatingTrack = false
            }
        }
    }

    // Album full-tracklist resolver process (for cloud Bandcamp purchases)
    Process {
        id: albumDetailProc
        property string outBuf: ""
        stdout: SplitParser {
            onRead: line => { albumDetailProc.outBuf += line }
        }
        onExited: {
            var raw = albumDetailProc.outBuf.trim()
            albumDetailProc.outBuf = ""
            if (!raw) return
            try {
                var d = JSON.parse(raw)
                if (d.ok && d.album && d.album.id) {
                    var updated = []
                    for (var i = 0; i < root.albums.length; i++) {
                        if (root.albums[i].id === d.album.id) {
                            updated.push(d.album)
                        } else {
                            updated.push(root.albums[i])
                        }
                    }
                    root.albums = updated
                }
            } catch (e) {}
        }
    }

    // ASCII Art & Omarchy Banner transcoder process (`omarchy-transcode-ascii` / `omarchy-ascii` + `/usr/bin/ttfx`)
    Process {
        id: asciiProc
        property string outBuf: ""
        stdout: SplitParser {
            onRead: line => { asciiProc.outBuf += line }
        }
        onExited: {
            var raw = asciiProc.outBuf.trim()
            asciiProc.outBuf = ""
            if (!raw) return
            try {
                var d = JSON.parse(raw)
                if (d.ok && d.lines) {
                    root.asciiLines = d.lines
                    root.bannerLines = d.bannerLines || d.lines
                    root.artLines = d.artLines || []
                    root.ttfxFrames = d.ttfxFrames || []
                    if (d.ttfxEffect) root.ttfxEffect = d.ttfxEffect
                    root.asciiSource = d.source || "omarchy-ascii"
                }
            } catch (e) {}
        }
    }

    // Smart Playlist generator process
    Process {
        id: smartProc
        property string outBuf: ""
        stdout: SplitParser {
            onRead: line => { smartProc.outBuf += line }
        }
        onExited: {
            var raw = smartProc.outBuf.trim()
            smartProc.outBuf = ""
            if (!raw) return
            try {
                var d = JSON.parse(raw)
                if (d.ok) {
                    if (d.smartPlaylist) {
                        root.smartPlaylist = d.smartPlaylist
                    }
                    if (d.savedPlaylist) {
                        root.loadPlaylists()
                    }
                    if (d.playing !== undefined) {
                        root.refreshStatus()
                    }
                }
            } catch (e) {}
        }
    }

    // Custom Playlists process
    Process {
        id: playlistsProc
        property string outBuf: ""
        stdout: SplitParser {
            onRead: line => { playlistsProc.outBuf += line }
        }
        onExited: {
            var raw = playlistsProc.outBuf.trim()
            playlistsProc.outBuf = ""
            if (!raw) return
            try {
                var d = JSON.parse(raw)
                if (d.ok && d.playlists) {
                    root.playlists = d.playlists
                }
            } catch (e) {}
        }
    }

    // Dedicated background download process so transport & play actions never cancel an active download
    Process {
        id: downloadProc
        property string outBuf: ""
        stdout: SplitParser {
            onRead: line => { downloadProc.outBuf += line }
        }
        onExited: {
            var raw = downloadProc.outBuf.trim()
            downloadProc.outBuf = ""
            root.refreshStatus()
            root.loadCollection(root.activeScope, root.searchQuery)
            if (raw) {
                try {
                    var d = JSON.parse(raw)
                    if (d.ok && d.album) {
                        root.notifyAction("Downloaded " + (d.album.title || "Album") + " (" + (d.trackCount || 0) + " tracks)")
                    } else if (d.error) {
                        root.notifyAction("Download error: " + d.error)
                    }
                } catch (e) {}
            }
            root._pumpDownloadQueue()
        }
    }

    // Dedicated sync / auth process
    Process {
        id: syncAuthProc
        property string outBuf: ""
        stdout: SplitParser {
            onRead: line => { syncAuthProc.outBuf += line }
        }
        onExited: {
            var raw = syncAuthProc.outBuf.trim()
            syncAuthProc.outBuf = ""
            root.refreshStatus()
            root.loadCollection(root.activeScope, root.searchQuery)
            root.loadPlaylists()
            root.refreshSmartPlaylist(root.smartPreset, "")
            if (raw) {
                try {
                    var d = JSON.parse(raw)
                    if (d.loggedOut) {
                        root.notifyAction("Logged out of Bandcamp (" + (d.localCount || 0) + " local albums available)")
                    } else if (d.synced || d.loggedIn) {
                        root.notifyAction("Synced " + (d.albumCount || 0) + " albums (" + (d.purchasedCount || 0) + " Bandcamp purchases)")
                    }
                } catch (e) {}
            }
        }
    }

    // Action runner for fast playback / transport / favourites commands
    Process {
        id: actionProc
        property string outBuf: ""
        property bool reloadAfter: false
        stdout: SplitParser {
            onRead: line => { actionProc.outBuf += line }
        }
        onExited: {
            var raw = actionProc.outBuf.trim()
            actionProc.outBuf = ""
            var shouldReload = actionProc.reloadAfter
            actionProc.reloadAfter = false
            root.refreshStatus()
            if (shouldReload) {
                root.loadCollection(root.activeScope, root.searchQuery)
                root.loadPlaylists()
                root.refreshSmartPlaylist(root.smartPreset, "")
            }
            if (raw) {
                try {
                    var d = JSON.parse(raw)
                    if (d.artPath || d.albumId) {
                        root.refreshAsciiArt()
                    }
                } catch (e) {}
            }
        }
    }

    // Persisted visualiser configuration (`~/.config/bandarchy/visualiser.json`) loader/saver process
    Process {
        id: visualiserConfigProc
        command: [root.binPath, "visualiser-config", "--get"]
        property string outBuf: ""
        stdout: SplitParser {
            onRead: line => { visualiserConfigProc.outBuf += line }
        }
        onExited: {
            var raw = visualiserConfigProc.outBuf.trim()
            visualiserConfigProc.outBuf = ""
            if (!raw) return
            try {
                var d = JSON.parse(raw)
                if (d.ok && d.config && typeof d.config === "object") {
                    var cfgObj = Object.assign({}, d.config)
                    if (Array.isArray(d.statements)) cfgObj.statements = d.statements
                    if (typeof d.statementsPath === "string") cfgObj.statementsPath = d.statementsPath
                    root.visualiserConfig = cfgObj
                    root.visualiserConfigLoaded = true
                    if (!root._topBarLedChangedLocally) {
                        if (d.config.topBarLedEnabled !== undefined) {
                            root.topBarLedEnabled = Boolean(d.config.topBarLedEnabled)
                        } else if (d.config.top_bar_led !== undefined) {
                            root.topBarLedEnabled = Boolean(d.config.top_bar_led)
                        }
                    }
                    var changedAscii = false
                    if (d.config.useAlbumArt !== undefined && Boolean(d.config.useAlbumArt) !== root.useAlbumArt) {
                        root.useAlbumArt = Boolean(d.config.useAlbumArt)
                        changedAscii = true
                    }
                    if (!root.useAlbumArt) {
                        if (root.asciiMode !== "text") {
                            root.asciiMode = "text"
                            changedAscii = true
                        }
                    } else if (d.config.asciiMode === "braille" || d.config.asciiMode === "block") {
                        if (root.asciiMode !== d.config.asciiMode) {
                            root.asciiMode = d.config.asciiMode
                            changedAscii = true
                        }
                    }
                    if (changedAscii) {
                        root.refreshAsciiArt()
                    }
                }
            } catch (e) {}
        }
    }

    property bool _screensaverInhibitedByUs: false
    onFullscreenVisualiserOpenChanged: root.syncScreensaverInhibit()

    function syncScreensaverInhibit() {
        var cfg = root.visualiserConfig || ({})
        var inhibitPref = (cfg.disableScreensaverInFullscreenOrVj === undefined) ? true : Boolean(cfg.disableScreensaverInFullscreenOrVj)
        var shouldInhibit = inhibitPref && Boolean(root.fullscreenVisualiserOpen || cfg.vjDeckActive)
        if (shouldInhibit && !root._screensaverInhibitedByUs) {
            root._screensaverInhibitedByUs = true
            Quickshell.execDetached([
                "/bin/sh", "-c",
                "mkdir -p \"$HOME/.local/state/omarchy/toggles\" \"$HOME/.local/state/omarchy/indicators\" && " +
                "if [ ! -f \"$HOME/.local/state/omarchy/toggles/screensaver-off\" ]; then " +
                "  printf 'bandarchy-fs-vj\\n' > \"$HOME/.local/state/omarchy/toggles/screensaver-off\"; " +
                "  touch \"$HOME/.local/state/omarchy/indicators/stay-awake\"; " +
                "fi"
            ])
        } else if (!shouldInhibit && root._screensaverInhibitedByUs) {
            root._screensaverInhibitedByUs = false
            Quickshell.execDetached([
                "/bin/sh", "-c",
                "if [ -f \"$HOME/.local/state/omarchy/toggles/screensaver-off\" ] && " +
                "   grep -q 'bandarchy-fs-vj' \"$HOME/.local/state/omarchy/toggles/screensaver-off\" 2>/dev/null; then " +
                "  rm -f \"$HOME/.local/state/omarchy/toggles/screensaver-off\" \"$HOME/.local/state/omarchy/indicators/stay-awake\"; " +
                "fi"
            ])
        }
    }

    function loadVisualiserConfig() {
        if (visualiserConfigProc.running) visualiserConfigProc.running = false
        visualiserConfigProc.outBuf = ""
        visualiserConfigProc.command = [root.binPath, "visualiser-config", "--get"]
        visualiserConfigProc.running = true
    }

    function openStatementsFile() {
        Quickshell.execDetached([
            root.binPath, "visualiser-config",
            "--open-statements"
        ])
    }

    function saveStatements(statementsArr) {
        if (!Array.isArray(statementsArr)) return
        var cleaned = []
        for (var i = 0; i < statementsArr.length; i++) {
            var line = String(statementsArr[i] || "").trim()
            if (!line || line.charAt(0) === "#") continue
            cleaned.push(line.slice(0, 160))
            if (cleaned.length >= 500) break
        }
        var prevCfg = root.visualiserConfig || ({})
        var merged = Object.assign({}, prevCfg, { statements: cleaned })
        root.visualiserConfig = merged
        root.visualiserConfigLoaded = true
        if (merged.layer3ShowStatements) {
            root.refreshAsciiArt()
        }
        if (visualiserConfigProc.running) visualiserConfigProc.running = false
        visualiserConfigProc.outBuf = ""
        visualiserConfigProc.command = [
            root.binPath, "visualiser-config",
            "--save-statements", JSON.stringify(cleaned)
        ]
        visualiserConfigProc.running = true
    }

    function resetStatementsFile() {
        if (visualiserConfigProc.running) visualiserConfigProc.running = false
        visualiserConfigProc.outBuf = ""
        visualiserConfigProc.command = [
            root.binPath, "visualiser-config",
            "--reset-statements"
        ]
        visualiserConfigProc.running = true
    }

    function saveVisualiserConfig(cfgObj) {
        if (!cfgObj || typeof cfgObj !== "object") return
        var prevCfg = root.visualiserConfig || ({})
        var merged = Object.assign({}, prevCfg, cfgObj)
        root.visualiserConfig = merged
        root.visualiserConfigLoaded = true
        root.syncScreensaverInhibit()
        if (cfgObj.layer3ShowStatements !== prevCfg.layer3ShowStatements
                || cfgObj.statementText !== prevCfg.statementText
                || cfgObj.layer3ShowArtist !== prevCfg.layer3ShowArtist
                || cfgObj.layer3ShowTrack !== prevCfg.layer3ShowTrack
                || cfgObj.layer3ShowAlbum !== prevCfg.layer3ShowAlbum) {
            root.refreshAsciiArt()
        }
        Quickshell.execDetached([
            root.binPath, "visualiser-config",
            "--set", JSON.stringify(merged)
        ])
    }

    // Cava 60 FPS 64-band live audio spectrum process
    Process {
        id: cavaProc
        command: ["/usr/bin/cava", "-p", root.cavaConfPath]
        running: (root.activelyPlaying && root.topBarLedEnabled) || root.visualiserActive || root.fullscreenVisualiserOpen
        stdout: SplitParser {
            onRead: line => {
                var parts = line.trim().split(";")
                if (parts.length < 16) return
                var vals = []
                for (var i = 0; i < parts.length; i++) {
                    if (parts[i] === "") continue
                    var n = parseInt(parts[i], 10)
                    vals.push(isNaN(n) ? 0 : n)
                }
                if (vals.length >= 16) {
                    root.spectrumBands = vals
                }
            }
        }
    }

    function refreshStatus() {
        if (!statusProc.running) {
            statusProc.outBuf = ""
            statusProc.running = true
        }
    }

    function setTopBarLedEnabled(enabled) {
        var nextVal = Boolean(enabled)
        root._topBarLedChangedLocally = true
        root.topBarLedEnabled = nextVal
        Quickshell.execDetached([
            root.binPath, "auth",
            "--top-bar-led", nextVal ? "1" : "0"
        ])
        saveVisualiserConfig({ topBarLedEnabled: nextVal, top_bar_led: nextVal })
        root.notifyAction("Top Bar LED Equaliser: " + (nextVal ? "ON" : "OFF"))
    }

    function setStageMode(newMode) {
        if (["off", "art", "turntable", "visualiser"].indexOf(newMode) < 0) return
        root._stageChangedLocally = true
        root.stageMode = newMode
        Quickshell.execDetached([root.binPath, "auth", "--stage-mode", newMode])
    }

    function loadCollection(scope, query) {
        if (scope !== undefined) root.activeScope = scope
        if (query !== undefined) root.searchQuery = query
        if (collectionProc.running) collectionProc.running = false
        collectionProc.outBuf = ""
        if (root.searchQuery && root.searchQuery.trim().length > 0) {
            collectionProc.command = [
                root.binPath, "search", root.searchQuery.trim(),
                "--scope", root.activeScope
            ]
        } else {
            collectionProc.command = [
                root.binPath, "collection",
                "--scope", root.activeScope
            ]
        }
        collectionProc.running = true
    }

    function ensureAlbumTracks(albumId) {
        if (!albumId) return
        for (var i = 0; i < root.albums.length; i++) {
            var a = root.albums[i]
            if (a.id === albumId) {
                var tr = a.tracks || []
                if (!a.isLocal && a.url && (tr.length <= 1 && (a.numTracks || 0) > 1 || tr.length === 0)) {
                    if (albumDetailProc.running) albumDetailProc.running = false
                    albumDetailProc.outBuf = ""
                    albumDetailProc.command = [root.binPath, "album", "--id", albumId]
                    albumDetailProc.running = true
                }
                return
            }
        }
    }

    function _asciiStyleLabel(m) {
        if (m === "block") return "Block █"
        if (m === "text") return "Crisp Text 󰬴"
        return "Braille ⣿"
    }

    function refreshAsciiArt(customAlbumId, customEffect) {
        root.ttfxEffect = "random"
        if (asciiProc.running) asciiProc.running = false
        asciiProc.outBuf = ""
        var effMode = (root.asciiMode === "block") ? "block" : ((root.asciiMode === "text") ? "text" : "braille")
        var cmd = [
            root.binPath, "ascii-art",
            "--mode", effMode,
            "--use-album-art", root.useAlbumArt ? "1" : "0",
            "--effect", "random",
            "--width", "68",
            "--height", "30"
        ]
        var fb = root.lastPlayedTrack || ((root.albums && root.albums.length > 0) ? root.albums[0] : null)
        var aid = customAlbumId || root.albumId || (fb ? (fb.albumId || fb.id || "") : "")
        var apath = root.artPath || (fb ? (fb.artPath || "") : "")
        if (aid) {
            cmd.push("--album", aid)
        } else if (apath) {
            cmd.push("--image", apath)
        }
        var vc = root.visualiserConfig || ({})
        var showArtist = vc.layer3ShowArtist !== undefined ? Boolean(vc.layer3ShowArtist) : true
        var showTrack = vc.layer3ShowTrack !== undefined ? Boolean(vc.layer3ShowTrack) : true
        var showAlbum = vc.layer3ShowAlbum !== undefined ? Boolean(vc.layer3ShowAlbum) : true
        var showStatements = vc.layer3ShowStatements !== undefined ? Boolean(vc.layer3ShowStatements) : false
        var effArtist = root.trackArtist || (fb ? (fb.artist || "") : "")
        var effTrack = root.trackTitle || (fb ? (fb.title || fb.album || "") : "")
        var effAlbum = root.trackAlbum || (fb ? (fb.album || fb.title || "") : "")
        var effStatement = String(vc.statementText || "").trim()
        var parts = []
        if (showArtist && effArtist) parts.push(effArtist)
        if (showTrack && effTrack) parts.push(effTrack)
        if (showAlbum && effAlbum && effAlbum !== effTrack) parts.push(effAlbum)
        if (showStatements && effStatement) parts.push(effStatement)
        var bannerTxt = parts.length > 0 ? parts.join(" — ") : (effStatement || effArtist || effTrack || effAlbum || "BANDARCHY")
        cmd.push("--text", bannerTxt)
        asciiProc.command = cmd
        asciiProc.running = true
    }

    function setTtfxEffect(effectName) {
        root.ttfxEffect = "random"
        refreshAsciiArt("", "random")
    }

    function setUseAlbumArt(useArt) {
        root.useAlbumArt = Boolean(useArt)
        if (!root.useAlbumArt) {
            root.asciiMode = "text"
        } else if (root.asciiMode !== "braille" && root.asciiMode !== "block") {
            root.asciiMode = "braille"
        }
        Quickshell.execDetached([
            root.binPath, "auth",
            "--use-album-art", root.useAlbumArt ? "1" : "0",
            "--ascii-mode", root.asciiMode
        ])
        refreshAsciiArt()
    }

    function setAsciiGlyphMode(glyphMode) {
        if (!root.useAlbumArt) {
            root.asciiMode = "text"
        } else {
            root.asciiMode = (glyphMode === "block") ? "block" : "braille"
        }
        Quickshell.execDetached([
            root.binPath, "auth",
            "--use-album-art", root.useAlbumArt ? "1" : "0",
            "--ascii-mode", root.asciiMode
        ])
        refreshAsciiArt()
    }

    function toggleUseAlbumArt() {
        setUseAlbumArt(!root.useAlbumArt)
    }

    function toggleAsciiMode() {
        if (root.useAlbumArt) {
            if (root.asciiMode === "braille") {
                root.asciiMode = "block"
            } else {
                root.useAlbumArt = false
                root.asciiMode = "text"
            }
        } else {
            root.useAlbumArt = true
            root.asciiMode = "braille"
        }
        Quickshell.execDetached([
            root.binPath, "auth",
            "--use-album-art", root.useAlbumArt ? "1" : "0",
            "--ascii-mode", root.asciiMode
        ])
        refreshAsciiArt()
    }

    function setAsciiSourceMode(modeStr) {
        var m = String(modeStr || "").toLowerCase()
        if (m === "words" || m === "banner" || m === "text" || m === "crisp" || m === "art-text" || m === "words-braille" || m === "words-block" || m === "words-text") {
            root.useAlbumArt = false
            root.asciiMode = "text"
        } else if (m === "art") {
            root.useAlbumArt = true
            if (root.asciiMode === "text") {
                root.asciiMode = "braille"
            }
        } else if (m === "block" || m === "art-block") {
            root.useAlbumArt = true
            root.asciiMode = "block"
        } else if (m === "braille" || m === "art-braille") {
            root.useAlbumArt = true
            root.asciiMode = "braille"
        }
        if (!root.useAlbumArt) {
            root.asciiMode = "text"
        } else if (root.asciiMode !== "braille" && root.asciiMode !== "block") {
            root.asciiMode = "braille"
        }
        Quickshell.execDetached([
            root.binPath, "auth",
            "--use-album-art", root.useAlbumArt ? "1" : "0",
            "--ascii-mode", root.asciiMode
        ])
        refreshAsciiArt()
    }

    // Stark Photo Realm (Layer 1 Mode 12) background processes & commands
    Process {
        id: photoStatusProc
        property string outBuf: ""
        stdout: SplitParser {
            onRead: line => { photoStatusProc.outBuf += line }
        }
        onExited: {
            var raw = photoStatusProc.outBuf.trim()
            photoStatusProc.outBuf = ""
            if (!raw) return
            try {
                var d = JSON.parse(raw)
                if (d && d.ok) {
                    if (d.discoveredCategories && Array.isArray(d.discoveredCategories) && d.discoveredCategories.length > 0) {
                        root.photoCategories = ["all"].concat(d.discoveredCategories)
                    } else if (d.discovered_categories && Array.isArray(d.discovered_categories) && d.discovered_categories.length > 0) {
                        root.photoCategories = ["all"].concat(d.discovered_categories)
                    } else if (d.categories && typeof d.categories === "object" && !Array.isArray(d.categories)) {
                        root.photoCategories = ["all"].concat(Object.keys(d.categories).sort())
                    } else if (d.categories && Array.isArray(d.categories) && d.categories.length > 0) {
                        root.photoCategories = d.categories
                    } else if (d.standard_categories && d.standard_categories.length > 0) {
                        root.photoCategories = ["all"].concat(d.standard_categories)
                    }
                    if (d.categoryCounts) root.photoCategoryCounts = d.categoryCounts
                    root.photoTotalProcessed = Number(d.totalProcessed || 0)
                    root.photoTotalOriginals = Number(d.totalOriginals || 0)
                    if (d.customDir) root.photoCustomDir = String(d.customDir)
                    if (!root.photoActiveStem && root.photoTotalProcessed > 0) {
                        root.pickPhoto(root.photoActiveCategory, "")
                    }
                }
            } catch (e) {}
        }
    }

    Process {
        id: photoImportProc
        property string outBuf: ""
        stdout: SplitParser {
            onRead: line => { photoImportProc.outBuf += line }
        }
        onExited: {
            root.photoBusy = false
            var raw = photoImportProc.outBuf.trim()
            photoImportProc.outBuf = ""
            if (!raw) return
            try {
                var d = JSON.parse(raw)
                if (d && d.ok) {
                    if (d.discoveredCategories && Array.isArray(d.discoveredCategories) && d.discoveredCategories.length > 0) {
                        root.photoCategories = ["all"].concat(d.discoveredCategories)
                    } else if (d.discovered_categories && Array.isArray(d.discovered_categories) && d.discovered_categories.length > 0) {
                        root.photoCategories = ["all"].concat(d.discovered_categories)
                    } else if (d.categories_summary && typeof d.categories_summary === "object") {
                        root.photoCategories = ["all"].concat(Object.keys(d.categories_summary).sort())
                    }
                    if (d.categoryCounts) root.photoCategoryCounts = d.categoryCounts
                    root.photoTotalProcessed = Number(d.totalProcessed || root.photoTotalProcessed || 0)
                    root.photoTotalOriginals = Number(d.totalOriginals || root.photoTotalOriginals || 0)
                    var impCount = Number(d.importedOriginals !== undefined ? d.importedOriginals : 0)
                    var genCount = Number(d.generatedVariants !== undefined ? d.generatedVariants : 0)
                    root.photoStatusMessage = "Imported " + impCount + " originals (" + genCount + " new variants)"
                    root.notifyAction("Stark Photo Realm: " + root.photoStatusMessage)
                    root.pickPhoto(root.photoActiveCategory, "")
                } else if (d && d.error) {
                    root.photoStatusMessage = "Import error: " + String(d.error)
                    root.notifyAction(root.photoStatusMessage)
                }
            } catch (e) {}
            root.refreshPhotoStatus()
        }
    }

    Process {
        id: photoPickProc
        property string outBuf: ""
        property string requestedCategory: "all"
        stdout: SplitParser {
            onRead: line => { photoPickProc.outBuf += line }
        }
        onExited: {
            var raw = photoPickProc.outBuf.trim()
            photoPickProc.outBuf = ""
            if (!raw) return
            try {
                var d = JSON.parse(raw)
                if (d && d.ok) {
                    if (photoPickProc.requestedCategory && photoPickProc.requestedCategory !== "all" && d.category) {
                        root.photoActiveCategory = String(d.category)
                    }
                    if (d.sourceStem) root.photoActiveStem = String(d.sourceStem)
                    if (d.variants) root.photoActiveVariants = d.variants
                    if (d.sameEffectPeers) root.photoSameEffectPeers = d.sameEffectPeers
                    if (d.sameEffectByVariant) root.photoSameEffectByVariant = d.sameEffectByVariant
                    if (d.randomPoolPeers) root.photoRandomPoolPeers = d.randomPoolPeers
                }
            } catch (e) {}
        }
    }

    function refreshPhotoStatus() {
        if (photoStatusProc.running) return
        photoStatusProc.outBuf = ""
        photoStatusProc.command = [root.binPath, "photo-status"]
        photoStatusProc.running = true
    }

    function importPhotos(sourceDir) {
        if (photoImportProc.running) return
        root.photoBusy = true
        root.photoStatusMessage = "Scanning all folders & generating 16 Stark variants…"
        root.notifyAction(root.photoStatusMessage)
        photoImportProc.outBuf = ""
        var cmd = [root.binPath, "photo-import", "--ensure-demo"]
        var cleanSrc = (sourceDir !== undefined && sourceDir !== null) ? String(sourceDir).trim() : ""
        if (cleanSrc.length > 0 && cleanSrc.toLowerCase() !== "all") {
            cmd.push("--source-dir", cleanSrc)
        }
        photoImportProc.command = cmd
        photoImportProc.running = true
    }

    function pickPhoto(category, stem) {
        if (photoPickProc.running) photoPickProc.running = false
        photoPickProc.outBuf = ""
        var cat = (category && String(category).trim().length > 0) ? String(category).trim() : (root.photoActiveCategory || "all")
        root.photoActiveCategory = cat
        photoPickProc.requestedCategory = cat
        var cmd = [root.binPath, "photo-pick", "--category", cat]
        if (stem && String(stem).trim().length > 0) {
            cmd.push("--stem", String(stem).trim())
        } else if (root.photoActiveStem && String(root.photoActiveStem).trim().length > 0) {
            cmd.push("--exclude-stem", String(root.photoActiveStem).trim())
        }
        photoPickProc.command = cmd
        photoPickProc.running = true
    }

    function cycleLayer3Source() {
        toggleAsciiMode()
    }

    function launchTtfxScreensaver(effectName) {
        var effMode = (!root.useAlbumArt || root.asciiMode === "banner") ? "banner" : root.asciiMode
        var cmd = [
            root.binPath, "screensaver",
            "--mode", effMode,
            "--use-album-art", root.useAlbumArt ? "1" : "0",
            "--effect", "random"
        ]
        if (root.albumId) cmd.push("--album", root.albumId)
        else if (root.artPath) cmd.push("--image", root.artPath)
        if (root.trackArtist || root.trackTitle) {
            cmd.push("--text", root.trackArtist || root.trackTitle)
        }
        Quickshell.execDetached(cmd)
        root.notifyAction("Launched Omarchy TTE Screensaver (Random Effects)")
    }

    function openExternal(target, customMsg) {
        if (!target) return
        var s = String(target).trim()
        if (!s || s.indexOf("-") === 0 || /[\r\n\0]/.test(s)) return
        if (s === "~" || s.indexOf("~/") === 0) {
            var homeDir = Quickshell.env("HOME") || "/home"
            s = homeDir + s.slice(1)
        }
        var isSafeUrl = s.indexOf("https://") === 0
        var isSafePath = s.indexOf("/") === 0 && s.indexOf("/../") === -1 && s.slice(-3) !== "/.."
        if (!isSafeUrl && !isSafePath) {
            root.notifyAction("Blocked unsafe external target")
            return
        }
        Quickshell.execDetached(["/usr/bin/xdg-open", "--", s])
        root.notifyAction(customMsg || ("Opened: " + s))
    }

    function refreshSmartPlaylist(preset, seedTrackId) {
        if (preset) root.smartPreset = preset
        if (smartProc.running) smartProc.running = false
        smartProc.outBuf = ""
        var cmd = [
            root.binPath, "smart-playlist",
            "--preset", root.smartPreset,
            "--limit", "25"
        ]
        if (seedTrackId) cmd.push("--seed-track", seedTrackId)
        smartProc.command = cmd
        smartProc.running = true
    }

    function playSmartPlaylist(preset, seedTrackId, startIndex) {
        if (preset) root.smartPreset = preset
        if (smartProc.running) smartProc.running = false
        smartProc.outBuf = ""
        var cmd = [
            root.binPath, "smart-playlist",
            "--preset", root.smartPreset,
            "--limit", "25",
            "--track-index", String(startIndex || 0),
            "--play"
        ]
        if (seedTrackId) cmd.push("--seed-track", seedTrackId)
        smartProc.command = cmd
        smartProc.running = true
        root.notifyAction("Playing Smart Mix: " + root.smartPreset.toUpperCase())
    }

    function saveSmartPlaylistAs(title, preset, seedTrackId) {
        if (!title) return
        if (smartProc.running) smartProc.running = false
        smartProc.outBuf = ""
        var cmd = [
            root.binPath, "smart-playlist",
            "--preset", preset || root.smartPreset,
            "--limit", "25",
            "--save-as", title
        ]
        if (seedTrackId) cmd.push("--seed-track", seedTrackId)
        smartProc.command = cmd
        smartProc.running = true
        root.notifyAction("Saved Smart Playlist: " + title)
    }

    function loadPlaylists() {
        if (playlistsProc.running) playlistsProc.running = false
        playlistsProc.outBuf = ""
        playlistsProc.command = [root.binPath, "playlists", "list"]
        playlistsProc.running = true
    }

    function createPlaylist(title, description, fromSmartPreset, albumId, tracksCsv) {
        if (!title) return
        if (playlistsProc.running) playlistsProc.running = false
        playlistsProc.outBuf = ""
        var cmd = [root.binPath, "playlists", "create", "--title", title]
        if (description) cmd.push("--description", description)
        if (fromSmartPreset) cmd.push("--from-smart", fromSmartPreset)
        if (albumId) cmd.push("--album", albumId)
        if (tracksCsv) cmd.push("--tracks", tracksCsv)
        playlistsProc.command = cmd
        playlistsProc.running = true
        root.notifyAction("Created Playlist: " + title)
    }

    function addAlbumToPlaylist(playlistId, albumId) {
        if (!playlistId || !albumId) return
        if (playlistsProc.running) playlistsProc.running = false
        playlistsProc.outBuf = ""
        playlistsProc.command = [
            root.binPath, "playlists", "add",
            "--id", playlistId,
            "--album", albumId
        ]
        playlistsProc.running = true
        root.notifyAction("Added album to playlist")
    }

    function addTrackToPlaylist(playlistId, trackId) {
        if (!playlistId || !trackId) return
        if (playlistsProc.running) playlistsProc.running = false
        playlistsProc.outBuf = ""
        playlistsProc.command = [
            root.binPath, "playlists", "add",
            "--id", playlistId,
            "--tracks", trackId
        ]
        playlistsProc.running = true
        root.notifyAction("Added track to playlist")
    }

    function addAlbumOrCreatePlaylist(albumId, albumTitle, artistName, preferredPlaylistId) {
        if (!albumId) return
        if (root.playlists && root.playlists.length > 0) {
            var pid = preferredPlaylistId || root.playlists[0].id
            addAlbumToPlaylist(pid, albumId)
        } else {
            createPlaylist(
                (artistName || "Bandarchy") + " Mix",
                "Created from " + (albumTitle || "album"),
                "",
                albumId,
                ""
            )
        }
    }

    function addTrackOrCreatePlaylist(trackId, trackTitle, artistName, preferredPlaylistId) {
        if (!trackId) return
        if (root.playlists && root.playlists.length > 0) {
            var pid = preferredPlaylistId || root.playlists[0].id
            addTrackToPlaylist(pid, trackId)
        } else {
            createPlaylist(
                (artistName || "Bandarchy") + " Mix",
                "Created from " + (trackTitle || "track"),
                "",
                "",
                trackId
            )
        }
    }

    function removeTrackFromPlaylist(playlistId, index) {
        if (!playlistId) return
        if (playlistsProc.running) playlistsProc.running = false
        playlistsProc.outBuf = ""
        playlistsProc.command = [
            root.binPath, "playlists", "remove-track",
            "--id", playlistId,
            "--index", String(index)
        ]
        playlistsProc.running = true
        root.notifyAction("Removed track from playlist")
    }

    function deletePlaylist(playlistId) {
        if (!playlistId) return
        if (playlistsProc.running) playlistsProc.running = false
        playlistsProc.outBuf = ""
        playlistsProc.command = [
            root.binPath, "playlists", "delete",
            "--id", playlistId
        ]
        playlistsProc.running = true
        root.notifyAction("Deleted playlist")
    }

    function runAction(cmdArgs, reloadCollectionAfter) {
        if (actionProc.running) actionProc.running = false
        actionProc.outBuf = ""
        actionProc.reloadAfter = Boolean(reloadCollectionAfter)
        actionProc.command = [root.binPath].concat(cmdArgs)
        actionProc.running = true
    }

    function playAlbum(albumId, trackIndex, mode, shuffle) {
        var idx = Number(trackIndex) || 0
        root._optimisticPlayUntil = Date.now() + 2400
        root.albumId = albumId || ""
        root.position = 0.0
        root.playing = true
        root.paused = false
        for (var i = 0; i < root.albums.length; i++) {
            var alb = root.albums[i]
            if (alb.id === albumId) {
                root.trackAlbum = alb.title || ""
                root.trackArtist = alb.artist || ""
                if (alb.artPath) root.artPath = alb.artPath
                var trs = alb.tracks || []
                if (idx >= 0 && idx < trs.length) {
                    root.trackTitle = trs[idx].title || alb.title || ""
                    root.trackId = trs[idx].id || ""
                } else {
                    root.trackTitle = alb.title || ""
                }
                break
            }
        }
        var args = ["play", "--album", albumId, "--track-index", String(idx)]
        if (mode) args.push("--mode", mode)
        if (shuffle) args.push("--shuffle")
        runAction(args, false)
        fastPlayPollTimer.restart()
        root.notifyAction("Playing " + (root.trackAlbum || "album") + "...")
    }

    function playTrack(trackId, albumId) {
        root._optimisticPlayUntil = Date.now() + 2400
        if (albumId) root.albumId = albumId
        root.trackId = trackId || ""
        root.position = 0.0
        root.playing = true
        root.paused = false
        var args = ["play", "--track-id", trackId]
        if (albumId) args.push("--album", albumId)
        runAction(args, false)
        fastPlayPollTimer.restart()
        root.notifyAction("Playing selected track...")
    }

    function playPlaylist(playlistId, trackIndex, shuffle) {
        root._optimisticPlayUntil = Date.now() + 2400
        root.position = 0.0
        root.playing = true
        root.paused = false
        var args = ["play", "--playlist", playlistId, "--track-index", String(trackIndex || 0)]
        if (shuffle) args.push("--shuffle")
        runAction(args, false)
        fastPlayPollTimer.restart()
        root.notifyAction(shuffle ? "Shuffling playlist..." : "Playing playlist...")
    }

    function playScope(scope, shuffle) {
        root._optimisticPlayUntil = Date.now() + 2400
        root.position = 0.0
        root.playing = true
        root.paused = false
        var args = ["play", "--scope", scope || "all"]
        if (shuffle) args.push("--shuffle")
        runAction(args, false)
        fastPlayPollTimer.restart()
        root.notifyAction((shuffle ? "Shuffling " : "Playing ") + (scope || "all") + " collection...")
    }

    function _pumpDownloadQueue() {
        if (downloadProc.running || root.downloading) return
        if (!root.downloadQueue || root.downloadQueue.length === 0) return
        var nextItem = root.downloadQueue[0]
        var rest = []
        for (var i = 1; i < root.downloadQueue.length; i++) {
            rest.push(root.downloadQueue[i])
        }
        root.downloadQueue = rest
        _startDownloadNow(nextItem.albumId, nextItem.format, nextItem.title)
    }

    function _startDownloadNow(albumId, format, title) {
        var args = [root.binPath, "download", "--album", albumId]
        if (format) args.push("--format", format)
        root.downloadState = {
            running: true,
            albumId: albumId,
            title: title || albumId,
            stage: "starting",
            percent: 2,
            trackIndex: 0,
            trackTotal: 0
        }
        downloadProc.outBuf = ""
        downloadProc.command = args
        downloadProc.running = true
        root.notifyAction("Downloading " + (title || "album") + "...")
    }

    function downloadAlbum(albumId, format, title) {
        if (!albumId) return
        var albTitle = title || ""
        if (!albTitle) {
            for (var i = 0; i < root.albums.length; i++) {
                if (root.albums[i].id === albumId) {
                    albTitle = root.albums[i].title || albumId
                    break
                }
            }
        }
        if (downloadProc.running || root.downloading) {
            var q = root.downloadQueue ? root.downloadQueue.slice() : []
            q.push({ albumId: albumId, format: format || "", title: albTitle })
            root.downloadQueue = q
            root.notifyAction("Queued download: " + (albTitle || albumId) + " (#" + q.length + " in queue)")
            return
        }
        _startDownloadNow(albumId, format, albTitle)
    }

    function importZips() {
        runAction(["import-zip"], true)
        root.notifyAction("Importing Bandcamp ZIP archives from ~/Downloads...")
    }

    function syncCollection(localOnly) {
        if (syncAuthProc.running) syncAuthProc.running = false
        var args = [root.binPath, "sync"]
        if (localOnly) args.push("--local-only")
        root.syncing = true
        syncAuthProc.outBuf = ""
        syncAuthProc.command = args
        syncAuthProc.running = true
        root.notifyAction(localOnly ? "Scanning local music folders..." : "Synchronising Bandcamp purchases & local library...")
    }

    // Bandcamp Account Log In / Log Out actions
    function openBandcampLogin() {
        Quickshell.execDetached([root.binPath, "auth", "--open-browser"])
        root.notifyAction("Opened bandcamp.com/login in browser — click 'Detect From Browser' after signing in")
    }

    function openBandcampLoginInBrowser() {
        openBandcampLogin()
    }

    function loginFromBrowser(optionalUsername) {
        if (syncAuthProc.running) syncAuthProc.running = false
        var args = [root.binPath, "login", "--detect-browser"]
        if (optionalUsername !== undefined && String(optionalUsername).trim().length > 0) {
            args.push("--username", String(optionalUsername).trim())
        }
        root.syncing = true
        syncAuthProc.outBuf = ""
        syncAuthProc.command = args
        syncAuthProc.running = true
        root.notifyAction("Detecting Bandcamp session from browser & syncing purchases...")
    }

    function detectBrowserAccount(optionalUsername) {
        loginFromBrowser(optionalUsername)
    }

    function logoutBandcamp() {
        if (syncAuthProc.running) syncAuthProc.running = false
        syncAuthProc.outBuf = ""
        syncAuthProc.command = [root.binPath, "logout"]
        syncAuthProc.running = true
        root.username = ""
        root.authenticated = false
        root.loggedOut = true
        root.hasIdentity = false
        root.notifyAction("Logged out of Bandcamp account")
    }

    function saveAuth(username, identity, downloadDir, format) {
        if (syncAuthProc.running) syncAuthProc.running = false
        var args = [root.binPath, "login"]
        if (username !== undefined && String(username).trim().length > 0) {
            args.push("--username", String(username).trim())
        } else {
            args.push("--detect-browser")
        }
        if (identity && String(identity).trim().length > 0) {
            args.push("--identity", String(identity).trim())
        }
        if (downloadDir || format) {
            var authArgs = [root.binPath, "auth"]
            if (downloadDir) authArgs.push("--download-dir", downloadDir)
            if (format) authArgs.push("--format", format)
            Quickshell.execDetached(authArgs)
        }
        root.syncing = true
        syncAuthProc.outBuf = ""
        syncAuthProc.command = args
        syncAuthProc.running = true
        root.notifyAction("Logging in & synchronising Bandcamp collection...")
    }

    function loginBandcamp(username, identity, downloadDir, format) {
        saveAuth(username, identity, downloadDir, format)
    }

    function addBandcampUrl(url) {
        if (!url) return
        runAction(["auth", "--add-url", url], true)
        root.notifyAction("Added Bandcamp URL to collection")
    }

    function toggleFavourite(albumId, title) {
        var wasFav = isFavourite(albumId)
        runAction(["favourites", "toggle", "--id", albumId, "--title", title || albumId], false)
        root.notifyAction((wasFav ? "Removed from Favourites: " : "Added to Favourites: ") + (title || albumId))
    }

    function isFavourite(albumId) {
        for (var i = 0; i < root.favourites.length; i++) {
            if (root.favourites[i].id === albumId) return true
        }
        return false
    }

    function togglePlayPause() {
        var wasActive = root.activelyPlaying
        if (root.playing) {
            root.paused = !root.paused
        } else {
            root._optimisticPlayUntil = Date.now() + 2400
            root.playing = true
            root.paused = false
        }
        runAction(["cmd", "play-pause"], false)
        fastPlayPollTimer.restart()
        root.notifyAction(wasActive ? "Paused playback" : "Resumed playback")
    }
    function nextTrack() {
        root.position = 0.0
        if (!root.playing) {
            root._optimisticPlayUntil = Date.now() + 2400
            root.playing = true
            root.paused = false
        }
        runAction(["cmd", "next"], false)
        fastPlayPollTimer.restart()
        root.notifyAction("Next track 󰒭")
    }
    function prevTrack() {
        root.position = 0.0
        if (!root.playing) {
            root._optimisticPlayUntil = Date.now() + 2400
            root.playing = true
            root.paused = false
        }
        runAction(["cmd", "prev"], false)
        fastPlayPollTimer.restart()
        root.notifyAction("Previous track 󰒮")
    }
    function stopPlayback() {
        root._optimisticPlayUntil = 0
        root.playing = false
        root.paused = false
        runAction(["cmd", "stop"], false)
        fastPlayPollTimer.restart()
        root.notifyAction("Stopped playback")
    }
    function toggleLoop() {
        runAction(["cmd", "loop"], false)
        root.notifyAction(root.loop ? "Loop: OFF" : "Loop: ON")
    }
    function setVolume(vol) {
        var clamped = Math.max(0, Math.min(100, Math.round(Number(vol) || 0)))
        root._optimisticVolumeUntil = Date.now() + 1400
        root.volume = clamped
        if (clamped > 0 && root.muted) {
            root.muted = false
        }
        Quickshell.execDetached([root.binPath, "volume", String(clamped)])
        fastPlayPollTimer.restart()
    }
    function adjustVolume(delta) {
        var step = Math.round(Number(delta) || 0)
        if (step === 0) return
        setVolume(root.volume + step)
        root.notifyAction("Volume: " + root.volume + "%")
    }
    function toggleMute() {
        root._optimisticVolumeUntil = Date.now() + 1400
        root.muted = !root.muted
        Quickshell.execDetached([root.binPath, "volume", "mute"])
        fastPlayPollTimer.restart()
        root.notifyAction(root.muted ? "Muted 󰝟" : ("Unmuted 󰕾 " + root.volume + "%"))
    }
    function seekTo(sec) {
        var targetSec = Math.max(0.0, Number(sec) || 0.0)
        root.position = targetSec
        runAction(["cmd", "seek", "--value", String(targetSec)], false)
        fastPlayPollTimer.restart()
    }
    function jumpQueue(idx) {
        root.position = 0.0
        if (!root.playing) {
            root._optimisticPlayUntil = Date.now() + 2400
            root.playing = true
            root.paused = false
        }
        runAction(["cmd", "jump", "--value", String(idx)], false)
        fastPlayPollTimer.restart()
        root.notifyAction("Jumped to queue track #" + (Number(idx) + 1))
    }

    function launchStandalonePlayer() {
        Quickshell.execDetached([root.baseDir + "/bin/bandarchy-player"])
        root.notifyAction("Launched standalone Bandarchy window")
    }
}
