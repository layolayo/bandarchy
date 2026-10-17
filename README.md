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

4. **Top Status Bar LED Equaliser (`BarWidget.qml`)**
   - Displays a compact 9-band × 6-segment audio-reactive LED equaliser directly in the Omarchy top status bar with zero text clutter, toggleable via `topBarLedEnabled` (`bandarchy auth --top-bar-led 1|0`) or from the `Account & Sync` settings tab.

5. **3 Independently Toggleable & Configurable Visualiser Layers + Dual-Screen VJ Stage**
   - **GPU Backdrop Engine (`backdropMode` 0–7)** — 8 hardware-accelerated backdrops (`Off`, `Deep Void Gradient`, `Album Cover Aura`, `Radial Plasma Glow`, `Prismatic Horizon`, `Liquid Mirror`, `VHS Scanline CRT`, `Solar Flare Corona`).
   - **Layer 1: Field & Equaliser Engine** (`layer1Enabled`, key `!` or `1`-chip) — 11 Field modes (`MilkDrop Liquid Feedback Warp`, `Starfield Hyperspace Tunnel`, `Nebula Plasma Cloud`, `Sacred Mandala Grid`, `Synthwave Horizon Grid`, `Cyber Matrix Rain`, `Bioluminescent Mycelium`, `Event Horizon Accretion`, `Aurora Borealis Curtains`, `Voronoi Cellular Lattice`, `Moire Interference Field`) paired with 16 Equaliser styles (`0..15`), 4 EQ layout orientations (`Bottom`, `Mirror`, `Ring`, `Sides`), and continuous EQ scale (`0.35..2.25`).
   - **Layer 2: Psychedelic Visualiser Geometry** (`layer2Enabled`, key `@` or `2`-chip) — 13 audio-reactive 3D/2D modes (`MilkDrop Geiss Cathedral`, `AVS 3D SuperScope`, `G-Force WaveShape Vortex`, `Cthugha Rave Oscilloscope`, `Minter VLM Neon Lattice`, `4D Tesseract Hypercube`, `Sacred Torus Knot`, `Lorenz Strange Attractor`, `Chladni Cymatic Plate`, `Demoscene Polygon Tunnel`, `Lissajous Laser Cage`, `Fibonacci Spiral Galaxy`, `Spirograph Epitrochoid`).
   - **Layer 3: Art & Words Matrix (`2 × 3 × 12`)** (`layer3Enabled`, key `#` / `A` or `3`-chip) — Combines `(Album Art | Words Banner)` × `(Braille ⣿ | Block █ | Crisp Text A)` × 12 animation modes (`Shatter & Evolving Rebuild`, `Omarchy TTE Keyframe Morph`, `Gravity Vortex Assembly`, `Wavefront Sine Ripple`, `Quantum Glitch Teleport`, `Breathing Mandala Lattice`, `Exploding Supernova Ring`, `DNA Double Helix Weave`, `Crystalline Shockwave`, `Liquid Mercury Melt`, `Orbital Satellite Swarm`, `Kaleidoscopic Mirror Shards`), plus a **`󰆍 Launch TTE`** button (`T` key) that opens `/usr/bin/ttfx` in a dedicated fullscreen terminal window.
   - **Dual-Screen VJ Mode (`󰍺 Dual VJ` / key `D`)** — Launches a chromeless secondary stage window (`externalStageWindow`) synchronised at 60 FPS so you can browse your collection, manage playlists, and adjust layer drawers on your primary monitor while projecting a clean visualiser or turntable stage onto an external display or projector.

6. **Full Keyboard Navigation (`Panel.qml` & `App.qml`)**
   - `↑` / `↓` (`j` / `k`): Move highlight across albums, through tracks inside an expanded album, or through intelligent and custom playlist tracks.
   - `Enter` / `→` (`l`): Expand or collapse the selected album's breakdown and tracklist; when a track is highlighted, `Enter` plays that track immediately.
   - `Shift+Enter` or `p`: Play the highlighted album or playlist immediately.
   - `a` or `+`: Add the highlighted track or album to the active custom playlist.
   - `←` (`h`) / `Backspace` / `Esc`: Collapse the expanded tracklist or step focus back from tracks to the album row.
   - `/`: Focus the collection search bar.

## Your Credentials & Privacy

- **Explicit Opt-In Browser Cookie Import**: Bandarchy never reads browser databases during background syncs or normal startup. Browser session discovery (`discover_from_browsers`) runs **only** when you explicitly invoke `bandarchy auth --detect-browser`, `bandarchy login --detect-browser`, or click **`󰑐 Import Session from Browser`** in the UI.
- **Scoped Domain Queries & In-Process Decryption**: When you explicitly request browser session import, Bandarchy copies the SQLite database to a `0600` temporary file inside your private runtime directory (`$XDG_RUNTIME_DIR/bandarchy-runtime`), queries strictly `host LIKE '%bandcamp.com'`, and decrypts Chromium cookies in-process via `libcrypto` (`EVP_DecryptInit_ex`) without exposing keys in process arguments or `/tmp`.
- **Private `0600` Credential Storage & Strict Host Allowlisting**: Your Bandcamp `identity` cookie is stored with `0600` permissions in `~/.config/bandarchy/auth.json` and is transmitted **exclusively** over HTTPS to `bandcamp.com` and `*.bandcamp.com` (never to CDN hosts such as `*.bcbits.com` or any third-party domain).
- **One-Click Revocation**: Running `bandarchy logout` (or clicking **`󰍃 Log Out`**) immediately wipes `~/.config/bandarchy/auth.json`, sets `loggedOut: true`, and removes cloud-only purchase metadata while leaving your local music files untouched.

## CLI Usage

```bash
# Synchronise Bandcamp purchases and local music directories
bandarchy sync

# Log in to Bandcamp (explicitly import browser cookie, open browser login, or pass credentials)
bandarchy login --detect-browser
bandarchy login --open-browser
bandarchy login --username <fan_username> --identity <cookie>

# Log out of Bandcamp (retaining local music files)
bandarchy logout

# Search across purchases and local files
bandarchy search "Bass Communion" --scope all

# Resolve and inspect full tracklist for any local or cloud album
bandarchy album --id <album_id>

# Transcode an album's cover art & multi-line banner into Braille, Block, or Text glyphs
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

