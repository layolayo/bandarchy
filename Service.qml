import QtQuick
import Quickshell
import Quickshell.Io

// Service.qml — Bandarchy background state, mpv IPC, Cava 60 FPS spectrum
// stream, ASCII album art transcoder, and intelligent/user playlist manager.

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

    // Collection & search state
    property string username: ""
    property bool authenticated: false
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
    property var downloadState: ({ running: false })
    property string lastError: ""

    // History & Intelligent / Custom Playlists state
    property var lastPlayedTrack: null
    property var recentTracks: []
    property string smartPreset: "radio"
    property var smartPlaylist: ({ title: "Sonic Radio", description: "", tracks: [], seed: null })
    property var playlists: []

    // Omarchy Screensaver / ASCII Album Art state (optional — not fixed on top of every mode)
    property bool useAlbumArt: false
    property string asciiMode: "braille"
    property string asciiSource: "album-art"
    property var asciiLines: []
    property var ttfxFrames: []
    property string ttfxEffect: "waves"
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

    // Periodic status poll
    Timer {
        interval: root.activelyPlaying ? 1200 : 2800
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
                root.username = d.username || ""
                root.authenticated = Boolean(d.authenticated)
                root.albumCount = Number(d.albumCount) || 0
                root.purchasedCount = Number(d.purchasedCount) || 0
                root.localCount = Number(d.localCount) || 0
                root.trackCount = Number(d.trackCount) || 0
                root.availableZips = d.availableZips || []
                root.favourites = d.favourites || []
                root.syncing = Boolean(d.sync && d.sync.running)
                root.downloadState = d.download || ({ running: false })
                root.lastError = d.lastError || ""

                if (d.useAlbumArt !== undefined && Boolean(d.useAlbumArt) !== root.useAlbumArt) {
                    root.useAlbumArt = Boolean(d.useAlbumArt)
                }
                if (d.asciiMode && d.asciiMode !== root.asciiMode) {
                    root.asciiMode = d.asciiMode
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

    // ASCII Art transcoder process (`omarchy-transcode-ascii` / `omarchy-ascii` + `/usr/bin/ttfx`)
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
                    root.ttfxFrames = d.ttfxFrames || []
                    if (d.ttfxEffect) root.ttfxEffect = d.ttfxEffect
                    root.asciiSource = d.source || "album-art"
                    if (d.mode) root.asciiMode = d.mode
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

    // Action runner for play / cmd / download / sync / import-zip
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
        if (customEffect) root.ttfxEffect = customEffect
        if (asciiProc.running) asciiProc.running = false
        asciiProc.outBuf = ""
        var cmd = [
            root.binPath, "ascii-art",
            "--mode", root.asciiMode,
            "--use-album-art", "1",
            "--effect", root.ttfxEffect || "waves",
            "--width", "68",
            "--height", "30"
        ]
        var aid = customAlbumId || root.albumId
        if (aid) {
            cmd.push("--album", aid)
        } else if (root.artPath) {
            cmd.push("--image", root.artPath)
        }
        if (root.trackArtist || root.trackTitle) {
            cmd.push("--text", root.trackArtist || root.trackTitle)
        }
        asciiProc.command = cmd
        asciiProc.running = true
    }

    function setTtfxEffect(effectName) {
        if (!effectName || effectName === root.ttfxEffect) return
        root.ttfxEffect = effectName
        refreshAsciiArt("", effectName)
    }

    function toggleUseAlbumArt() {
        root.useAlbumArt = !root.useAlbumArt
        Quickshell.execDetached([
            root.binPath, "auth",
            "--use-album-art", root.useAlbumArt ? "1" : "0"
        ])
        refreshAsciiArt()
    }

    function toggleAsciiMode() {
        root.asciiMode = (root.asciiMode === "braille") ? "block" : "braille"
        Quickshell.execDetached([
            root.binPath, "auth",
            "--ascii-mode", root.asciiMode
        ])
        refreshAsciiArt()
    }

    function launchTtfxScreensaver(effectName) {
        var cmd = [
            root.binPath, "screensaver",
            "--mode", root.asciiMode,
            "--use-album-art", root.useAlbumArt ? "1" : "0",
            "--effect", effectName || "random"
        ]
        if (root.albumId) cmd.push("--album", root.albumId)
        else if (root.artPath) cmd.push("--image", root.artPath)
        Quickshell.execDetached(cmd)
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
    }

    function playTrack(trackId, albumId) {
        var args = ["play", "--track-id", trackId]
        if (albumId) args.push("--album", albumId)
        runAction(args, false)
    }

    function playPlaylist(playlistId, trackIndex, shuffle) {
        var args = ["play", "--playlist", playlistId, "--track-index", String(trackIndex || 0)]
        if (shuffle) args.push("--shuffle")
        runAction(args, false)
    }

    function playScope(scope, shuffle) {
        var args = ["play", "--scope", scope || "all"]
        if (shuffle) args.push("--shuffle")
        runAction(args, false)
    }

    function downloadAlbum(albumId, format) {
        var args = ["download", "--album", albumId]
        if (format) args.push("--format", format)
        runAction(args, true)
    }

    function importZips() {
        runAction(["import-zip"], true)
    }

    function syncCollection(localOnly) {
        var args = ["sync"]
        if (localOnly) args.push("--local-only")
        runAction(args, true)
    }

    function saveAuth(username, identity, downloadDir, format) {
        var args = ["auth"]
        if (username !== undefined) args.push("--username", username)
        if (identity) args.push("--identity", identity)
        if (downloadDir) args.push("--download-dir", downloadDir)
        if (format) args.push("--format", format)
        runAction(args, true)
    }

    function addBandcampUrl(url) {
        if (!url) return
        runAction(["auth", "--add-url", url], true)
    }

    function toggleFavourite(albumId, title) {
        runAction(["favourites", "toggle", "--id", albumId, "--title", title || albumId], false)
    }

    function isFavourite(albumId) {
        for (var i = 0; i < root.favourites.length; i++) {
            if (root.favourites[i].id === albumId) return true
        }
        return false
    }

    function togglePlayPause() { runAction(["cmd", "play-pause"], false) }
    function nextTrack() { runAction(["cmd", "next"], false) }
    function prevTrack() { runAction(["cmd", "prev"], false) }
    function stopPlayback() { runAction(["cmd", "stop"], false) }
    function toggleLoop() { runAction(["cmd", "loop"], false) }
    function setVolume(vol) { runAction(["cmd", "volume", "--value", String(vol)], false) }
    function seekTo(sec) { runAction(["cmd", "seek", "--value", String(sec)], false) }
    function jumpQueue(idx) { runAction(["cmd", "jump", "--value", String(idx)], false) }

    function launchStandalonePlayer() {
        Quickshell.execDetached(["quickshell", "-p", root.baseDir + "/App.qml"])
    }
}
