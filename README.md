# Bandarchy (`io.github.layolayo.bandarchy`)

**Bandarchy** is a native Omarchy shell plugin (`service`, `bar-widget`, `panel`) and dedicated desktop audio player (`App.qml`) for your **Bandcamp purchased collection** and **local lossless music library**.

## Highlights

1. **Unified Bandcamp Purchased Collection & Local Lossless Library**
   - Automatically discovers your Bandcamp fan username and purchased collection from your browser session or configured account, paginating through your Bandcamp collection and merging it with local albums in `~/Music/Bandcamp` and `~/Music`.
   - Search and filter instantaneously across **All**, **Purchased**, **Local**, and **Cloud** albums and tracks.
   - Stream purchases live from Bandcamp or download purchased releases (`FLAC`, `WAV`, `MP3-320`, `OGG`) and import Bandcamp `.zip` archives from `~/Downloads` for bit-perfect local playback via `mpv`.

2. **Omarchy Screensaver Psychedelic Audio-Reactive Visualiser (with Album Art Transcoding)**
   - Retains the signature Omarchy look and feel (`Commons.Color.accent`, `Commons.Color.urgent`, `Commons.Color.foreground`, `Commons.Color.background`, monospace glyph matrix).
   - Uses the Omarchy screensaver paradigm (`ttfx` / TerminalTextEffects character matrix animations) driven at 60 FPS by 64-band `cava` spectrum analysis.
   - Includes a **Use Album Art** option (`A` key or HUD toggle) that translates the currently playing album cover art into screensaver-style **Braille (`⠀..⣿`)** or **Block (`█ ▀ ▄`)** character art via `omarchy-transcode-ascii` (or falls back to `omarchy-ascii` `Delta Corps Priest 1` banners when disabled), manipulating every character cell in real time as the song plays.
   - Includes a 1-click **TTE Screensaver (`T`)** button that launches the native `/usr/bin/ttfx` terminal screensaver with the transcoded album cover art.

3. **Intelligent Playlists (Seeded from Last Track Played) & Custom User Playlists**
   - Tracks playback history in `~/.local/share/bandarchy/history.json` (`lastPlayedTrack` and `recentTracks`).
   - Generates adaptive intelligent playlists seeded from the last track played across four presets:
     - **Sonic Radio** — balanced flow across kindred artists, matching track durations, and deep cuts.
     - **Kindred Spirits** — focused constellation around the seed artist and related musical projects.
     - **Psychedelic Journey** — extended atmospheric and progressive suites resonant with the seed track.
     - **Purchased Mix** — curated sequence drawn exclusively from your Bandcamp purchases.
   - Full CRUD support for user-created custom playlists (`create`, `add`, `remove-track`, `rename`, `delete`) stored in `~/.config/bandarchy/playlists.json`.

## CLI Usage

```bash
# Synchronise Bandcamp purchases and local music directories
bandarchy sync

# Import Bandcamp ZIP archives from ~/Downloads into ~/Music/Bandcamp
bandarchy import-zip

# Search across purchases and local files
bandarchy search "Bass Communion" --scope all

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

- `1` – `6` or `M`: Cycle TTE Visualiser Modes (`TTE Waves & ColourShift`, `TTE Blackhole Vortex`, `TTE Beams & SynthGrid`, `TTE Rings & Mandala`, `TTE VHS Glitch & Matrix`, `Voyage 34 Sacred Hybrid`)
- `A`: Toggle **Use Album Art** (`ON` transcodes album cover via `omarchy-transcode-ascii`; `OFF` uses `omarchy-ascii` banner)
- `B`: Toggle **Braille (`⣿`)** / **Block (`█`)** album art transcoding mode
- `C`: Cycle Colour Palettes (`Omarchy Screensaver`, `Voyage 34 LSD`, `Aeterna Nebula`, `Solar Flare`, `Bioluminescence`)
- `T`: Launch native `/usr/bin/ttfx` terminal screensaver with the active album art
- `+` / `-`: Adjust audio spectrum sensitivity
- `H`: Show / hide HUD overlay
- `F` / `V` / `Double-Click`: Toggle Fullscreen visualiser
- `Space`, `Left`, `Right`: Play/Pause, Previous track, Next track

## Licence

MIT
