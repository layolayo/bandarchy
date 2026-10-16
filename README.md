# Bandarchy (`io.github.layolayo.bandarchy`)

**Bandarchy** is a native Omarchy shell plugin (`service`, `bar-widget`, `panel`) and dedicated desktop audio player (`App.qml`) for your **Bandcamp purchased collection** and **local lossless music library**.

## Highlights

1. **Unified Bandcamp Purchased Collection & Local Lossless Library**
   - Automatically indexes all items in your Bandcamp fan collection (`collection_summary` + paginated `collection_items` + embedded `tracklists` + mobile `tralbum_details` fallback) and merges them with local albums in `~/Music/Bandcamp` and `~/Music`.
   - Search and filter instantaneously across **All**, **Purchased**, **Local**, and **Cloud** albums and tracks with interactive, draggable scrollbars (`ListScroller`).
   - Non-truncating album status badges (`PURCHASED`, `LOCAL` / `STREAM`, track count, and audio format) plus an expandable **Album Info Breakdown Box** above every expanded album's tracklist showing full un-truncated Title, Artist, Collection Status, Playback & Format (`FLAC`/`WAV`/`MP3` + total duration), local disk path, Bandcamp URL, and quick action buttons (`󰖟 Bandcamp Page`, `󰉋 Local Folder`).
   - Live download progress footer (`Downloading X/Y (Z%)`) at the bottom of the collection view as well as on the active album download button.

2. **Bandcamp Account Log In & Log Out Flow**
   - Built-in account management in both `App.qml` and `Panel.qml` (`Account & Sync` tab) plus header status pill (`󰌋 <user>` + `󰍃 Log Out` when signed in, or `󰌋 Log In to Bandcamp` when signed out).
   - Three sign-in methods:
     1. **`󰖟 Open Bandcamp Login`**: Opens `https://bandcamp.com/login` in your browser (`bandarchy login --browser`).
     2. **`󰑐 Detect From Browser`**: Reads your active Bandcamp session cookie from Chromium/Brave/Firefox (`bandarchy auth --detect-browser`) and synchronises your purchases.
     3. **Username + Identity Cookie (`󰌋 Log In & Sync`)**: Direct login and collection sync.
   - **`󰍃 Log Out`** (`bandarchy logout`): Sets `loggedOut: true` in `~/.config/bandarchy/settings.json`, clears stored identity credentials, removes cloud-only entries from `~/.local/share/bandarchy/collection.json`, and retains local music files on disk.

3. **4 Selectable Stage Modes (`stageMode` 0–3)**
   - **`0: Off / Closed`** — Collapses the visualiser/art stage completely so the collection and playlists occupy 100% of the player width.
   - **`1: Album Art As-Is`** — Displays high-resolution un-cropped album cover art with ambient colour glow, metadata badge, and quick `󰀻 ASCII / TTE` + `󰐰 Fullscreen` actions.
   - **`2: Turntable Record Player (`Vinyl.qml`)`** — Audiophile turntable deck evolved from Omarchy PlexMusic with a conical audio/volume-reactive under-platter neon aura, 78 cut microgrooves, stroboscopic platter rim dots, 5 selectable vinyl pressings (`Classic 180g`, `Emerald Dub`, `Nebula Wax`, `Solar Amber`, `Picture Disc`), `33⅓ RPM` / `45 RPM` speed toggle, S-curved metallic tonearm with counterweight and stylus, interactive groove click-to-seek, and tonearm cueing.
   - **`3: Psychedelic Visualiser`** — 60 FPS 64-band `cava`-driven canvas with 3 independently toggleable and configurable layers.

4. **3 Independently Toggleable & Configurable Visualiser Layers**
   - **Layer 1: Psychedelic Backdrop** (`layer1Enabled`, key `!` or `1`-chip) — 11 backdrop styles (`Julia & Mandelbrot Fractals`, `Hyperspace Swirls & Vortex`, `Randomised Shapes & Kaleidoscope`, `Space-Time Warp Matrix`, `Alien Mycelium & Bioluminescence`, `Multi-Faceted Crystal Hypercube`, `Voyage 34 Sacred Mandala`, `Blackhole Singularity`, `Cyber SynthGrid & Beams`, `VHS Glitch & Matrix Rain`, `Cosmic Chimera Overdrive`) with configurable **Opacity** and **Warp**.
   - **Layer 2: 3D Geometric Mesh** (`layer2Enabled`, key `@` or `2`-chip) — 6 audio-reactive 3D wireframe/faceted geometries (`Tesseract 4D`, `Sacred Torus`, `Icosahedron`, `DNA Double Helix`, `Merkaba Star`, `Geodesic Sphere`) with configurable **Scale** and **Spin**.
   - **Layer 3: ASCII Art & TTE Overlay** (`layer3Enabled`, key `#` / `A` or `3`-chip) — Word-wrapped sub-block ASCII artist banner (`BASS COMMUNION` fitted across lines without clipping) + `omarchy-transcode-ascii` album art with 6 in-canvas **TTE Animation Effects** (`Waves`, `Matrix Rain`, `Laser Etch`, `Vortex Spiral`, `Fireworks`, `Pulse`), toggleable **Braille (`⣿`) / Block (`█`)** glyphs, configurable **Scale**, and a **`󰆍 Launch TTE`** button (`T` key) that opens `/usr/bin/ttfx` in a dedicated terminal window.

5. **Full Keyboard Navigation (`Panel.qml` & `App.qml`)**
   - `↑` / `↓` (`j` / `k`): Move highlight across albums, through tracks inside an expanded album, or through intelligent and custom playlist tracks.
   - `Enter` / `→` (`l`): Expand or collapse the selected album's breakdown and tracklist; when a track is highlighted, `Enter` plays that track immediately.
   - `Shift+Enter` or `p`: Play the highlighted album or playlist immediately.
   - `a` or `+`: Add the highlighted track or album to the active custom playlist.
   - `←` (`h`) / `Backspace` / `Esc`: Collapse the expanded tracklist or step focus back from tracks to the album row.
   - `/`: Focus the collection search bar.

## CLI Usage

```bash
# Synchronise Bandcamp purchases and local music directories
bandarchy sync

# Log in to Bandcamp (auto-detect browser cookie, open browser login, or pass credentials)
bandarchy login --detect-browser
bandarchy login --browser
bandarchy login --username <fan_username> --identity <cookie>

# Log out of Bandcamp (retaining local music files)
bandarchy logout

# Search across purchases and local files
bandarchy search "Bass Communion" --scope all

# Resolve and inspect full tracklist for any local or cloud album
bandarchy album --id <album_id>

# Transcode an album's cover art & multi-line banner into Braille or Block glyphs
bandarchy ascii-art --album <album_id> --mode braille --use-album-art 1

# Launch the native Omarchy ttfx terminal screensaver with the current album's art
bandarchy screensaver --effect waves

# Generate and play an intelligent playlist based on the last track played
bandarchy smart-playlist --preset radio --play

# Launch the dedicated standalone desktop player and visualiser
bandarchy-player
```

## Licence

MIT
