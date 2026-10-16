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
    property real volume: 100.0
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
    property string stageMode: "visualiser" // "off", "art", "turntable", "visualiser"
    property bool useAlbumArt: false
    property string asciiMode: "banner" // "banner" (Words), "braille" (Cover Art), "block" (Cover Art)
    property string asciiSource: "omarchy-ascii"
    property var asciiLines: []
    property var bannerLines: []
    property var artLines: []
    property var ttfxFrames: []
    property string ttfxEffect: "random"
    property bool visualiserActive: false
    property bool fullscreenVisualiserOpen: false

    // 60 FPS 64-band Cava spectrum
    property var spectrumBands: []

    readonly property bool activelyPlaying: root.playing && !root.paused

    Component.onCompleted: {
        refreshStatus()
        loadCollection("all", "")
        loadPlaylists()
        refreshSmartPlaylist("radio", "")
        refreshAsciiArt()
    }

    onAlbumIdChanged: refreshAsciiArt()
    onArtPathChanged: refreshAsciiArt()
    onTrackArtistChanged: refreshAsciiArt()
    onTrackTitleChanged: refreshAsciiArt()

    // Fast status poll during downloads/syncs (450ms), normal poll during playback (1100ms)
    Timer {
        interval: (root.downloading || root.syncing) ? 450 : (root.activelyPlaying ? 1100 : 2500)
        running: true
        repeat: true
        onTriggered: root.refreshStatus()
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
                root.playing = Boolean(p.playing)
                root.paused = Boolean(p.paused)
                root.trackTitle = p.title || ""
                root.trackArtist = p.artist || ""
                root.trackAlbum = p.album || ""
                root.albumId = p.albumId || ""
                root.trackId = p.trackId || ""
                root.playSource = p.playSource || "local"
                root.artPath = p.artPath || ""
                root.position = Number(p.position) || 0.0
                root.duration = Number(p.duration) || 0.0
                root.volume = p.volume !== undefined ? Number(p.volume) : 100.0
                root.playlistPos = Number(p.playlistPos) || 0
                root.playlistCount = Number(p.playlistCount) || 0
                root.shuffle = Boolean(p.shuffle)
                root.loop = Boolean(p.loop)
                root.queue = p.queue || []
            } catch (e) {}
        }
    }

    property bool _stageChangedLocally: false

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
                    if (root.asciiLines.length === 0 && root.albums.length > 0) {
                        root.refreshAsciiArt()
                    }
                }
            } catch (e) {}
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

    // Cava 60 FPS 64-band live audio spectrum process
    Process {
        id: cavaProc
        command: ["cava", "-p", root.cavaConfPath]
        running: root.activelyPlaying || root.visualiserActive || root.fullscreenVisualiserOpen
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

    function setStageMode(newMode) {
        if (["off", "art", "turntable", "visualiser"].indexOf(newMode) < 0) return
        root._stageChangedLocally = true
        root.stageMode = newMode
        root.visualiserActive = (newMode === "visualiser" || newMode === "turntable")
        Quickshell.execDetached([root.binPath, "auth", "--stage-mode", newMode])
        var labels = {
            "off": "Stage Closed",
            "art": "Stage: Album Art As-Is",
            "turntable": "Stage: Audiophile Turntable Deck",
            "visualiser": "Stage: 3-Layer Psychedelic Visualiser"
        }
        root.notifyAction(labels[newMode] || ("Stage: " + newMode))
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

    function refreshAsciiArt(customAlbumId, customEffect) {
        root.ttfxEffect = "random"
        if (asciiProc.running) asciiProc.running = false
        asciiProc.outBuf = ""
        var effMode = (!root.useAlbumArt || root.asciiMode === "banner") ? "banner" : root.asciiMode
        var cmd = [
            root.binPath, "ascii-art",
            "--mode", effMode,
            "--use-album-art", root.useAlbumArt ? "1" : "0",
            "--effect", "random",
            "--width", "68",
            "--height", "30"
        ]
        var aid = customAlbumId || root.albumId
        if (aid) {
            cmd.push("--album", aid)
        } else if (root.artPath) {
            cmd.push("--image", root.artPath)
        }
        var bannerTxt = root.trackArtist || root.trackTitle || "BANDARCHY"
        cmd.push("--text", bannerTxt)
        asciiProc.command = cmd
        asciiProc.running = true
    }

    function setTtfxEffect(effectName) {
        root.ttfxEffect = "random"
        refreshAsciiArt("", "random")
        root.notifyAction("TTE Effect Randomised")
    }

    function toggleUseAlbumArt() {
        root.useAlbumArt = !root.useAlbumArt
        if (root.useAlbumArt && root.asciiMode === "banner") {
            root.asciiMode = "braille"
        }
        Quickshell.execDetached([
            root.binPath, "auth",
            "--use-album-art", root.useAlbumArt ? "1" : "0",
            "--ascii-mode", root.asciiMode
        ])
        refreshAsciiArt()
        root.notifyAction(root.useAlbumArt ? "Layer #3 Source: Album Cover Art" : "Layer #3 Source: Artist/Track Words")
    }

    function toggleAsciiMode() {
        // Cycle cleanly across 3 distinct visual sources:
        //   1. Words (Banner) -> 2. Braille Cover Art -> 3. Block Cover Art -> 1. Words (Banner)
        if (!root.useAlbumArt || root.asciiMode === "banner") {
            root.useAlbumArt = true
            root.asciiMode = "braille"
            root.notifyAction("Layer #3 Source: Cover Art (Braille ⣿)")
        } else if (root.asciiMode === "braille") {
            root.useAlbumArt = true
            root.asciiMode = "block"
            root.notifyAction("Layer #3 Source: Cover Art (Block █)")
        } else {
            root.useAlbumArt = false
            root.asciiMode = "banner"
            root.notifyAction("Layer #3 Source: Artist/Track Words (Banner)")
        }
        Quickshell.execDetached([
            root.binPath, "auth",
            "--use-album-art", root.useAlbumArt ? "1" : "0",
            "--ascii-mode", root.asciiMode
        ])
        refreshAsciiArt()
    }

    function setAsciiSourceMode(modeStr) {
        if (modeStr === "banner" || modeStr === "words") {
            root.useAlbumArt = false
            root.asciiMode = "banner"
            root.notifyAction("Layer #3 Source: Artist/Track Words (Banner)")
        } else if (modeStr === "block") {
            root.useAlbumArt = true
            root.asciiMode = "block"
            root.notifyAction("Layer #3 Source: Cover Art (Block █)")
        } else {
            root.useAlbumArt = true
            root.asciiMode = "braille"
            root.notifyAction("Layer #3 Source: Cover Art (Braille ⣿)")
        }
        Quickshell.execDetached([
            root.binPath, "auth",
            "--use-album-art", root.useAlbumArt ? "1" : "0",
            "--ascii-mode", root.asciiMode
        ])
        refreshAsciiArt()
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
        Quickshell.execDetached(["xdg-open", String(target)])
        root.notifyAction(customMsg || ("Opened: " + String(target)))
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
        var args = ["play", "--album", albumId, "--track-index", String(trackIndex || 0)]
        if (mode) args.push("--mode", mode)
        if (shuffle) args.push("--shuffle")
        runAction(args, false)
        root.notifyAction("Starting playback...")
    }

    function playTrack(trackId, albumId) {
        var args = ["play", "--track-id", trackId]
        if (albumId) args.push("--album", albumId)
        runAction(args, false)
        root.notifyAction("Playing selected track...")
    }

    function playPlaylist(playlistId, trackIndex, shuffle) {
        var args = ["play", "--playlist", playlistId, "--track-index", String(trackIndex || 0)]
        if (shuffle) args.push("--shuffle")
        runAction(args, false)
        root.notifyAction(shuffle ? "Shuffling playlist..." : "Playing playlist...")
    }

    function playScope(scope, shuffle) {
        var args = ["play", "--scope", scope || "all"]
        if (shuffle) args.push("--shuffle")
        runAction(args, false)
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
        runAction(["cmd", "play-pause"], false)
        root.notifyAction(root.activelyPlaying ? "Paused playback" : "Resumed playback")
    }
    function nextTrack() {
        runAction(["cmd", "next"], false)
        root.notifyAction("Next track 󰒭")
    }
    function prevTrack() {
        runAction(["cmd", "prev"], false)
        root.notifyAction("Previous track 󰒮")
    }
    function stopPlayback() {
        runAction(["cmd", "stop"], false)
        root.notifyAction("Stopped playback")
    }
    function toggleLoop() {
        runAction(["cmd", "loop"], false)
        root.notifyAction(root.loop ? "Loop: OFF" : "Loop: ON")
    }
    function setVolume(vol) {
        runAction(["cmd", "volume", "--value", String(vol)], false)
    }
    function seekTo(sec) {
        runAction(["cmd", "seek", "--value", String(sec)], false)
    }
    function jumpQueue(idx) {
        runAction(["cmd", "jump", "--value", String(idx)], false)
        root.notifyAction("Jumped to queue track #" + (Number(idx) + 1))
    }

    function launchStandalonePlayer() {
        Quickshell.execDetached(["quickshell", "-p", root.baseDir + "/App.qml"])
        root.notifyAction("Launched standalone Bandarchy window")
    }
}
