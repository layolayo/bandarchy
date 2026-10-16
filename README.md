# Bandarchy (`io.github.layolayo.bandarchy`)

**Bandarchy** is a native Omarchy shell plugin (`service`, `bar-widget`, `panel`) and dedicated desktop audio player (`App.qml`) for your **Bandcamp purchased collection** and **local lossless music library**.

## Highlights

1. **Unified Bandcamp Purchased Collection & Local Lossless Library**
   - Automatically discovers your Bandcamp fan username and purchased collection from your browser session or configured account, paginating through your Bandcamp collection and merging it with local albums in `~/Music/Bandcamp` and `~/Music`.
   - Search and filter instantaneously across **All**, **Purchased**, **Local**, and **Cloud** albums and tracks.
   - Click any album row (or press `Enter` / `→` / `l`) in either `Panel.qml` or `App.qml` to open its expandable track list drawer, resolving remote Bandcamp tracklists on demand (`bandarchy album --id <id>`) and playing any individual track immediately.
   - Stream purchases live from Bandcamp or download purchased releases (`FLAC`, `WAV`, `MP3-320`, `OGG`) and import Bandcamp `.zip` archives from `~/Downloads` for bit-perfect local playback via `mpv`.

2. **Multi-Faceted Psychedelic Audio-Reactive Visualiser (12 Modes, 10 Palettes, Kaleidoscope & Optional Album Art)**
   - Driven at 60 FPS by 64-band `cava` spectrum analysis with 12 distinct full-canvas visualiser modes:
     1. **Julia & Mandelbrot Fractals** — multi-coloured audio-warped complex plane fractals with Orbit-Trap glowing tendrils and recursive fractal trees.
     2. **Hyperspace Swirls & Vortex** — logarithmic multi-arm colour spirals, counter-rotating fluid eddies, and bass-reactive vortex tunnels.
     3. **Randomised Shapes & Kaleidoscope** — mutating polyhedra, Lissajous ribbons, Spirograph hypotrochoids, and shattering geometric shards.
     4. **Space-Time Warp Matrix** — 3D relativistic gravity-well grid deformed by bass mass wells, Einstein lensing rings, and wormhole horizons.
     5. **Alien Mycelium & Bioluminescence** — organic glowing tendrils, pulsing bioluminescent jellyfish/spores, neural synaptic webs, and alien flora.
     6. **Multi-Faceted Crystal Hypercube** — 4D tesseract & 24-cell projections with translucent rainbow dispersion facets and refracted light rays.
     7. **Voyage 34 Sacred Mandala** — concentric sacred geometry, Metatron's cube, flower-of-life rings, and phase-locked harmonic interference waves.
     8. **Blackhole Singularity** — relativistic accretion disc, gravitational lensing, Hawking radiation jets, and orbital particle volleys.
     9. **Cyber SynthGrid & Beams** — outrun horizon terrain, dual-peak mountain wireframe, retro-futuristic sun, and sweeping volumetric laser beams.
     10. **VHS Glitch & Matrix Rain** — chromatic aberration scanlines, digital character rain cascades, and audio-triggered tape tracking warps.
     11. **Album Art ASCII Matrix (TTE)** — dedicated full-canvas Omarchy screensaver (`omarchy-transcode-ascii` Braille/Block + `/usr/bin/ttfx`) mode.
     12. **Cosmic Chimera Overdrive** — mind-bending synthesis layering fractals, swirls, space-time gravity warps, bioluminescence, and crystal geometry.
   - **Album Art as a Selectable Option (Not Fixed)**: Modes 1–10 and 12 run as pure full-canvas psychedelic visualisers without a fixed ASCII box on top. Select Mode 11 (`[` key or `[ Album Art` chip) for the dedicated Album Art ASCII Matrix mode, or press `A` (`Album Art: OFF/ON`) to optionally overlay transcoded album art onto any mode.

3. **Full Keyboard Navigation (`Panel.qml` & `App.qml`)**
   - `↑` / `↓` (`j` / `k`): Move highlight across albums, through tracks inside an expanded album, or through playlist tracks.
   - `Enter` / `→` (`l`): Expand or collapse the selected album's track list; when a track is highlighted inside an expanded album, `Enter` plays that track immediately.
   - `Shift+Enter` or `p`: Play the highlighted album immediately from the first (or selected) track.
   - `←` (`h`) / `Backspace` / `Esc`: Collapse the expanded track list or step focus back from tracks to the album row.
   - `/`: Focus the collection search bar (`Esc`, `↓`, or `Enter` returns focus to the album list).
   - `Tab` / `Shift+Tab`: Switch between Collection, Intelligent & Custom Playlists, Visualiser, and Sync tabs.

4. **Intelligent Playlists (Seeded from Last Track Played) & Custom User Playlists**
   - Tracks playback history in `~/.local/share/bandarchy/history.json` (`lastPlayedTrack` and `recentTracks`).
   - Generates adaptive intelligent playlists seeded from the last track played across four presets (`radio`, `kindred`, `journey`, `purchased`).
   - Full CRUD support for user-created custom playlists (`create`, `add`, `remove-track`, `rename`, `delete`) stored in `~/.config/bandarchy/playlists.json`.

## CLI Usage

```bash
# Synchronise Bandcamp purchases and local music directories
bandarchy sync

# Import Bandcamp ZIP archives from ~/Downloads into ~/Music/Bandcamp
bandarchy import-zip

# Search across purchases and local files
bandarchy search "Bass Communion" --scope all

# Resolve and inspect full tracklist for any local or cloud album
bandarchy album --id <album_id>

# Transcode an album's cover art into Omarchy screensaver Braille or Block glyphs
bandarchy ascii-art --album <album_id> --mode braille --use-album-art 1

# Launch the native Omarchy ttfx screensaver with the current album's transcoded art
bandarchy screensaver --effect waves

# Generate and play an intelligent playlist based on the last track played
bandarchy smart-playlist --preset radio --play

# Create and manage custom user playlists
bandarchy playlists create --title "Late Night Ambient" --from-smart journey
bandarchy playlists list

# Launch the dedicated standalone desktop player and visualiser
bandarchy-player
```

## Visualiser Keyboard Shortcuts

- `1` – `9`, `0`, `[`, `]` or `M` / `Shift+M`: Select or cycle through all 12 Psychedelic Visualiser Modes
- `C` / `Shift+C`: Cycle through 10 Multi-Coloured Psychedelic Palettes (`DMT Hyperspace Prism`, `Omarchy Screensaver`, `Voyage 34 LSD`, `Alien Flora & Mycelium`, `Space-Time Event Horizon`, `Chromatic Fractal Acid`, `Aeterna Nebula`, `Iridescent Scarab & Opal`, `Solar Flare & Plasma`, `Abyssal Bioluminescence`)
- `K`: Cycle Kaleidoscope Mirror Symmetry (`1x`, `2x`, `4x`, `6x`, `8x`, `12x` facets)
- `R`: Mutate / Randomise visualiser geometry, fractal constants, swirl arms, and palette
- `X`: Toggle Auto-Morph evolution (automatically mutates parameters and cross-fades modes)
- `A`: Toggle optional **Album Art Overlay** (`OFF` by default; `ON` overlays `omarchy-transcode-ascii` album art on any mode)
- `B`: Toggle **Braille (`⣿`)** / **Block (`█`)** album art transcoding mode
- `T`: Launch native `/usr/bin/ttfx` terminal screensaver with the active album art
- `+` / `-`: Adjust audio spectrum sensitivity
- `H`: Show / hide HUD overlay
- `F` / `V` / `Double-Click`: Toggle Fullscreen visualiser
- `Space`, `N`, `P`: Play/Pause, Next track, Previous track

## Licence

MIT
