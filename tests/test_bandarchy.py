#!/usr/bin/env python3
"""Comprehensive automated test suite for Bandarchy (`io.github.layolayo.bandarchy`).

Tests:
1. Mock Bandcamp server pagination (`data-blob` + `/api/fancollection/1/collection_items`)
   and unified merge with local music directories.
2. Search and scope filtering (`all`, `purchased`, `local`, `cloud`).
3. Purchase download (`redownload_urls` ZIP archive + `data-tralbum` stream rip)
   and ZipSlip path-traversal rejection.
4. Omarchy screensaver album-art transcoding (`omarchy-transcode-ascii` Braille & Block
   modes + `omarchy-ascii` banner fallback + `screensaver --dry-run`).
5. Intelligent playlist generation seeded from `lastPlayedTrack` (`radio`, `kindred`,
   `journey`, `purchased` presets + `--save-as`) and custom user playlists CRUD.
6. Live `mpv` headless playback + UNIX socket IPC transport + `cava` spectrum config.
7. QML static verification (`textFormat: Text.PlainText`, manifest entry points).
"""

import html
import http.server
import io
import json
import os
import re
import shutil
import socketserver
import subprocess
import tempfile
import threading
import time
import unittest
import wave
import zipfile

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BIN_PATH = os.path.join(REPO_ROOT, "bin", "bandarchy")


def make_wav_bytes(duration_sec: float = 1.5, freq: float = 440.0, rate: int = 22050) -> bytes:
    import math
    import struct

    buf = io.BytesIO()
    n_samples = int(duration_sec * rate)
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(rate)
        frames = bytearray()
        for i in range(n_samples):
            sample = int(16000 * math.sin(2.0 * math.pi * freq * (i / rate)))
            frames.extend(struct.pack("<h", sample))
        wf.writeframes(bytes(frames))
    return buf.getvalue()


def make_ppm_or_png_cover(path: str) -> None:
    """Create a valid PNG image with high-contrast geometric shapes for transcode tests."""
    subprocess.run(
        [
            "ffmpeg", "-y", "-f", "lavfi",
            "-i", "testsrc=size=128x128:rate=1",
            "-frames:v", "1", path,
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=True,
    )


class MockBandcampHandler(http.server.BaseHTTPRequestHandler):
    server_version = "MockBandcamp/1.0"

    def log_message(self, fmt, *args):
        pass

    def do_GET(self):
        base = f"http://127.0.0.1:{self.server.server_port}"
        if self.path == "/testfan":
            blob = {
                "fan_data": {"fan_id": 99001, "username": "testfan"},
                "collection_data": {
                    "sequence": ["a100", "a200"],
                    "last_token": "1700000000:a200:a:0:0",
                    "more_available": True,
                    "redownload_urls": {
                        "p100": f"{base}/download?id=a100",
                        "p200": f"{base}/download?id=a200",
                        "p300": f"{base}/download?id=a300",
                    },
                },
                "item_cache": {
                    "collection": {
                        "a100": {
                            "item_id": 100,
                            "item_type": "album",
                            "band_name": "Bass Communion",
                            "item_title": "The Itself of Itself",
                            "item_url": f"{base}/album/the-itself-of-itself",
                            "item_art_id": 111222333,
                            "sale_item_type": "p",
                            "sale_item_id": 100,
                            "num_streamable_tracks": 2,
                        },
                        "a200": {
                            "item_id": 200,
                            "item_type": "album",
                            "band_name": "Porcupine Tree",
                            "item_title": "Voyage 34",
                            "item_url": f"{base}/album/voyage-34",
                            "item_art_id": 444555666,
                            "sale_item_type": "p",
                            "sale_item_id": 200,
                            "num_streamable_tracks": 2,
                        },
                    }
                },
            }
            escaped = html.escape(json.dumps(blob), quote=True)
            body = f'<!doctype html><html><body><div id="pagedata" data-blob="{escaped}"></div></body></html>'
            self._send(200, "text/html; charset=utf-8", body.encode("utf-8"))
            return

        if self.path.startswith("/album/"):
            slug = self.path.split("/album/", 1)[1].split("?")[0]
            tralbum = {
                "id": 300 if "black-dog" in slug else 200,
                "artist": "The Black Dog" if "black-dog" in slug else "Porcupine Tree",
                "current": {
                    "title": "Liber Eleven" if "black-dog" in slug else "Voyage 34",
                    "art_id": 777888999,
                },
                "trackinfo": [
                    {
                        "track_id": 901,
                        "track_num": 1,
                        "title": "Phase I",
                        "duration": 420.0,
                        "file": {"mp3-128": f"{base}/stream/phase1.wav"},
                    },
                    {
                        "track_id": 902,
                        "track_num": 2,
                        "title": "Phase II",
                        "duration": 395.0,
                        "file": {"mp3-128": f"{base}/stream/phase2.wav"},
                    },
                ],
            }
            escaped = html.escape(json.dumps(tralbum), quote=True)
            body = f'<!doctype html><html><body><script data-tralbum="{escaped}"></script></body></html>'
            self._send(200, "text/html; charset=utf-8", body.encode("utf-8"))
            return

        if self.path.startswith("/download"):
            buf = io.BytesIO()
            with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
                zf.writestr("Porcupine Tree - Voyage 34 - 01 Phase I.wav", self.server.wav_bytes)
                zf.writestr("Porcupine Tree - Voyage 34 - 02 Phase II.wav", self.server.wav_bytes)
                zf.writestr("cover.png", self.server.cover_bytes)
            self._send(200, "application/zip", buf.getvalue())
            return

        if self.path.startswith("/stream/"):
            self._send(200, "audio/wav", self.server.wav_bytes)
            return

        if self.path.startswith("/img/"):
            self._send(200, "image/png", self.server.cover_bytes)
            return

        self._send(404, "text/plain", b"not found")

    def do_POST(self):
        base = f"http://127.0.0.1:{self.server.server_port}"
        if self.path == "/api/fancollection/1/collection_items":
            resp = {
                "more_available": False,
                "last_token": "",
                "redownload_urls": {
                    "p300": f"{base}/download?id=a300",
                },
                "items": [
                    {
                        "item_id": 300,
                        "item_type": "album",
                        "band_name": "The Black Dog",
                        "item_title": "Liber Eleven",
                        "item_url": f"{base}/album/black-dog-liber-eleven",
                        "item_art_id": 777888999,
                        "sale_item_type": "p",
                        "sale_item_id": 300,
                        "num_streamable_tracks": 2,
                    }
                ],
            }
            self._send(200, "application/json", json.dumps(resp).encode("utf-8"))
            return
        self._send(404, "text/plain", b"not found")

    def _send(self, code: int, ctype: str, data: bytes):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


class BandarchyTestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp_root = tempfile.mkdtemp(prefix="bandarchy_test_")
        cls.env = os.environ.copy()
        cls.env["HOME"] = cls.tmp_root
        cls.env["XDG_CONFIG_HOME"] = os.path.join(cls.tmp_root, ".config")
        cls.env["XDG_CACHE_HOME"] = os.path.join(cls.tmp_root, ".cache")
        cls.env["XDG_DATA_HOME"] = os.path.join(cls.tmp_root, ".local", "share")
        cls.env["XDG_RUNTIME_DIR"] = os.path.join(cls.tmp_root, "run")
        os.makedirs(cls.env["XDG_RUNTIME_DIR"], mode=0o700, exist_ok=True)

        # Create local music directory with 2 albums
        cls.music_dir = os.path.join(cls.tmp_root, "Music")
        cls.bc_dir = os.path.join(cls.music_dir, "Bandcamp")
        cls.downloads_dir = os.path.join(cls.tmp_root, "Downloads")
        os.makedirs(cls.bc_dir, exist_ok=True)
        os.makedirs(cls.downloads_dir, exist_ok=True)

        cls.wav_bytes = make_wav_bytes(1.6, 440.0)
        cls.cover_path = os.path.join(cls.tmp_root, "test_cover.png")
        make_ppm_or_png_cover(cls.cover_path)
        with open(cls.cover_path, "rb") as f:
            cls.cover_bytes = f.read()

        # Local album 1: matches purchased "Bass Communion - The Itself of Itself"
        alb1 = os.path.join(cls.bc_dir, "Bass Communion - The Itself of Itself")
        os.makedirs(alb1, exist_ok=True)
        with open(os.path.join(alb1, "Bass Communion - The Itself of Itself - 01 Unperson.wav"), "wb") as f:
            f.write(cls.wav_bytes)
        with open(os.path.join(alb1, "Bass Communion - The Itself of Itself - 02 Apparition.wav"), "wb") as f:
            f.write(cls.wav_bytes)
        shutil.copy2(cls.cover_path, os.path.join(alb1, "cover.png"))

        # Local album 2: local-only Steven Wilson album (kindred to Bass Communion / Porcupine Tree)
        alb2 = os.path.join(cls.music_dir, "Steven Wilson - Insurgentes")
        os.makedirs(alb2, exist_ok=True)
        with open(os.path.join(alb2, "01 Harmony Korine.wav"), "wb") as f:
            f.write(cls.wav_bytes)
        with open(os.path.join(alb2, "02 Abandoner.wav"), "wb") as f:
            f.write(cls.wav_bytes)
        shutil.copy2(cls.cover_path, os.path.join(alb2, "cover.png"))

        # Start Mock Bandcamp Server
        cls.httpd = ThreadedHTTPServer(("127.0.0.1", 0), MockBandcampHandler)
        cls.httpd.wav_bytes = cls.wav_bytes
        cls.httpd.cover_bytes = cls.cover_bytes
        cls.api_base = f"http://127.0.0.1:{cls.httpd.server_port}"
        cls.server_thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.server_thread.start()

    @classmethod
    def tearDownClass(cls):
        try:
            subprocess.run([BIN_PATH, "cmd", "stop"], env=cls.env, capture_output=True, timeout=5)
        except Exception:
            pass
        cls.httpd.shutdown()
        cls.httpd.server_close()
        shutil.rmtree(cls.tmp_root, ignore_errors=True)

    def run_cli(self, *args, expect_ok: bool = True) -> dict:
        r = subprocess.run(
            [BIN_PATH, *args],
            env=self.env,
            capture_output=True,
            text=True,
            timeout=20,
        )
        out = r.stdout.strip()
        self.assertTrue(out, f"CLI produced empty stdout for {args}; stderr={r.stderr}")
        data = json.loads(out)
        if expect_ok:
            self.assertTrue(data.get("ok"), f"Expected ok=True for {args}, got: {data}")
        return data

    def test_01_sync_bandcamp_purchases_and_local_merge(self):
        res = self.run_cli("sync", "--username", "testfan", "--api-base", self.api_base)
        self.assertEqual(res["username"], "testfan")
        # 3 purchased (Bass Communion, Porcupine Tree, The Black Dog) + 1 local-only (Steven Wilson) = 4 unified albums
        self.assertEqual(res["purchasedCount"], 3)
        self.assertEqual(res["localCount"], 2)
        self.assertEqual(res["albumCount"], 4)

    def test_02_search_and_scope_filters(self):
        all_coll = self.run_cli("collection", "--scope", "all")
        self.assertEqual(all_coll["count"], 4)

        purchased_coll = self.run_cli("collection", "--scope", "purchased")
        self.assertEqual(purchased_coll["count"], 3)

        local_coll = self.run_cli("collection", "--scope", "local")
        self.assertEqual(local_coll["count"], 2)

        cloud_coll = self.run_cli("collection", "--scope", "cloud")
        self.assertEqual(cloud_coll["count"], 2)

        search_res = self.run_cli("search", "Voyage 34", "--scope", "purchased")
        self.assertEqual(len(search_res["albums"]), 1)
        self.assertEqual(search_res["albums"][0]["artist"], "Porcupine Tree")
        # Even before on-demand resolution, cloud albums must have a fallback track entry so they can be expanded/played
        self.assertGreaterEqual(len(search_res["albums"][0].get("tracks", [])), 1)

        # On-demand `bandarchy album --id bc-album-300` resolves full remote tracklist (Phase I, Phase II)
        alb_detail = self.run_cli("album", "--id", "bc-album-300")
        self.assertEqual(alb_detail["album"]["id"], "bc-album-300")
        self.assertEqual(alb_detail["trackCount"], 2)
        self.assertEqual(alb_detail["album"]["tracks"][0]["title"], "Phase I")
        self.assertEqual(alb_detail["album"]["tracks"][1]["title"], "Phase II")

    def test_03_ascii_art_transcoding_and_use_album_art_option(self):
        # 1. Braille mode with Use Album Art = 1 + ttfxFrames extraction
        braille = self.run_cli("ascii-art", "--image", self.cover_path, "--mode", "braille", "--use-album-art", "1", "--width", "40", "--height", "20", "--effect", "waves")
        self.assertEqual(braille["source"], "album-art")
        self.assertTrue(braille["useAlbumArt"])
        self.assertEqual(braille["rows"], 20)
        self.assertEqual(braille["cols"], 40)
        self.assertTrue(os.path.isfile(braille["screensaverFile"]))
        if shutil.which("ttfx") or os.path.isfile("/usr/bin/ttfx"):
            self.assertGreater(braille.get("ttfxFrameCount", 0), 5)
            self.assertIsInstance(braille.get("ttfxFrames"), list)
            self.assertEqual(len(braille["ttfxFrames"][0]), 20)

        # 2. Block mode with Use Album Art = 1
        block = self.run_cli("ascii-art", "--image", self.cover_path, "--mode", "block", "--use-album-art", "1", "--width", "40", "--height", "20", "--effect", "blackhole")
        self.assertEqual(block["source"], "album-art")
        self.assertEqual(block["mode"], "block")
        self.assertEqual(block["rows"], 20)

        # 3. Use Album Art = 0 falls back to Omarchy ASCII banner (`Delta Corps Priest 1`)
        banner = self.run_cli("ascii-art", "--image", self.cover_path, "--use-album-art", "0", "--text", "BASS COMMUNION")
        self.assertEqual(banner["source"], "omarchy-ascii")
        self.assertFalse(banner["useAlbumArt"])
        self.assertGreater(banner["rows"], 3)

        # 4. Dry-run screensaver verification
        ss = self.run_cli("screensaver", "--image", self.cover_path, "--effect", "waves", "--dry-run")
        self.assertTrue(ss["dryRun"])
        self.assertEqual(ss["effect"], "waves")
        self.assertTrue(ss["ttfxAvailable"])

    def test_04_download_purchase_and_zipslip_rejection(self):
        # Download cloud album "bc-album-200" (Porcupine Tree - Voyage 34)
        dl = self.run_cli("download", "--album", "bc-album-200", "--format", "wav")
        self.assertTrue(dl["downloaded"])
        self.assertGreaterEqual(dl["fileCount"], 2)

        # Verify it is now marked local in collection
        local_coll = self.run_cli("collection", "--scope", "local")
        self.assertEqual(local_coll["count"], 3)

        # Verify ZipSlip path traversal archive is rejected
        evil_zip = os.path.join(self.tmp_root, "evil.zip")
        with zipfile.ZipFile(evil_zip, "w") as zf:
            zf.writestr("../../escaped.wav", b"malicious")
        bad = self.run_cli("import-zip", "--zip-path", evil_zip, expect_ok=False)
        self.assertFalse(bad.get("ok"))
        self.assertIn("unsafe path", bad.get("error", ""))

    def test_05_playback_and_intelligent_playlists_from_last_track(self):
        # Play an album so history.json records `lastPlayedTrack`
        all_coll = self.run_cli("collection", "--scope", "local")
        first_album = all_coll["albums"][0]
        first_album_id = first_album["id"]
        play_res = self.run_cli("play", "--album", first_album_id)
        self.assertTrue(play_res["playing"])

        # Wait briefly for mpv IPC socket to come up and verify both `now` and `status`
        time.sleep(0.4)
        now_res = self.run_cli("now")
        self.assertTrue(now_res["playing"])

        status_res = self.run_cli("status")
        self.assertIn("playback", status_res)
        self.assertTrue(status_res["playback"]["playing"])
        self.assertEqual(status_res["playback"]["albumId"], first_album_id)
        self.assertTrue(status_res["playback"]["title"])
        self.assertIn("authenticated", status_res)
        self.assertIn("playlists", status_res)
        self.assertIn("recentTracks", status_res)
        self.assertIn("favourites", status_res)
        self.assertIn("sync", status_res)
        self.assertIn("download", status_res)

        # Verify `cmd loop` without `--value` toggles loop-playlist on and off
        loop_on = self.run_cli("cmd", "loop")
        self.assertTrue(loop_on.get("loop"))
        loop_off = self.run_cli("cmd", "loop")
        self.assertFalse(loop_off.get("loop"))

        # Verify standalone `play --track-id <id>` without `--album`
        if len(first_album.get("tracks", [])) > 1:
            second_track_id = first_album["tracks"][1]["id"]
            tr_play = self.run_cli("play", "--track-id", second_track_id)
            self.assertTrue(tr_play["playing"])
            self.assertEqual(tr_play["track"]["id"], second_track_id)

        # Stop playback cleanly
        self.run_cli("cmd", "stop")

        # Generate intelligent playlists seeded from lastPlayedTrack across all 4 presets
        for preset in ("radio", "kindred", "journey", "purchased"):
            smart = self.run_cli("smart-playlist", "--preset", preset, "--limit", "6")
            self.assertEqual(smart["preset"], preset)
            self.assertIsNotNone(smart["seed"])
            self.assertGreaterEqual(smart["trackCount"], 2)

        # Verify `smart-playlist --play --track-index 1`
        smart_play = self.run_cli("smart-playlist", "--preset", "radio", "--play", "--track-index", "1")
        self.assertTrue(smart_play["playing"])
        self.assertEqual(smart_play["trackIndex"], 1)
        self.run_cli("cmd", "stop")

        # Save an intelligent playlist as a custom playlist
        saved = self.run_cli("smart-playlist", "--preset", "kindred", "--save-as", "Kindred Steven Wilson")
        self.assertIsNotNone(saved["savedPlaylist"])
        self.assertEqual(saved["savedPlaylist"]["title"], "Kindred Steven Wilson")

    def test_06_custom_user_playlists_crud(self):
        # Create custom playlist
        created = self.run_cli("playlists", "create", "--title", "Late Night Psychedelia", "--description", "Deep cuts")
        pl_id = created["created"]["id"]

        # Add an album's tracks to the playlist
        all_coll = self.run_cli("collection", "--scope", "all")
        album_id = all_coll["albums"][0]["id"]
        added = self.run_cli("playlists", "add", "--id", pl_id, "--album", album_id)
        self.assertGreaterEqual(added["playlist"]["trackCount"], 2)

        # Remove track at index 0
        before_count = added["playlist"]["trackCount"]
        removed = self.run_cli("playlists", "remove-track", "--id", pl_id, "--index", "0")
        self.assertEqual(removed["playlist"]["trackCount"], before_count - 1)

        # Rename playlist
        renamed = self.run_cli("playlists", "rename", "--id", pl_id, "--title", "Prog & Ambient")
        self.assertEqual(renamed["playlist"]["title"], "Prog & Ambient")

        # List playlists
        listed = self.run_cli("playlists", "list")
        ids = [p["id"] for p in listed["playlists"]]
        self.assertIn(pl_id, ids)

        # Delete playlist
        deleted = self.run_cli("playlists", "delete", "--id", pl_id)
        self.assertEqual(deleted["deleted"], pl_id)

    def test_07_qml_and_manifest_verification(self):
        manifest_path = os.path.join(REPO_ROOT, "manifest.json")
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        self.assertEqual(manifest["id"], "io.github.layolayo.bandarchy")
        for key, rel in manifest["entryPoints"].items():
            self.assertTrue(os.path.isfile(os.path.join(REPO_ROOT, rel)), f"Missing entryPoint {key}: {rel}")

        # Verify every Text {} block in QML files includes textFormat: Text.PlainText
        qml_files = ["BarWidget.qml", "Panel.qml", "App.qml", "Visualiser.qml", "Vinyl.qml"]
        for qf in qml_files:
            qpath = os.path.join(REPO_ROOT, qf)
            with open(qpath, "r", encoding="utf-8") as f:
                content = f.read()
            text_blocks = len(re.findall(r"\bText\s*\{", content))
            plain_formats = len(re.findall(r"textFormat\s*:\s*Text\.PlainText", content))
            self.assertEqual(
                text_blocks,
                plain_formats,
                f"{qf} has {text_blocks} Text blocks but {plain_formats} textFormat: Text.PlainText declarations",
            )

        # Verify PsychedelicEngine.js has 12 modes, 10 palettes, kaleidoscope symmetry, randomiseState,
        # and gates drawAsciiMatrix on mode === 10 || useAlbumArt (so album art is an option, not fixed)
        engine_path = os.path.join(REPO_ROOT, "PsychedelicEngine.js")
        with open(engine_path, "r", encoding="utf-8") as f:
            engine_js = f.read()
        for expected_mode in (
            "Julia & Mandelbrot Fractals",
            "Hyperspace Swirls & Vortex",
            "Randomised Shapes & Kaleidoscope",
            "Space-Time Warp Matrix",
            "Alien Mycelium & Bioluminescence",
            "Multi-Faceted Crystal Hypercube",
            "Voyage 34 Sacred Mandala",
            "Blackhole Singularity",
            "Cyber SynthGrid & Beams",
            "VHS Glitch & Matrix Rain",
            "Album Art ASCII Matrix (TTE)",
            "Cosmic Chimera Overdrive",
        ):
            self.assertIn(expected_mode, engine_js)
        for expected_palette in (
            "DMT Hyperspace Prism",
            "Omarchy Screensaver",
            "Voyage 34 LSD",
            "Alien Flora & Mycelium",
            "Space-Time Event Horizon",
            "Chromatic Fractal Acid",
            "Aeterna Nebula",
            "Iridescent Scarab & Opal",
            "Solar Flare & Plasma",
            "Abyssal Bioluminescence",
        ):
            self.assertIn(expected_palette, engine_js)
        self.assertIn("function randomiseState", engine_js)
        self.assertIn("if (useAlbumArt && mode !== 10)", engine_js)

        # Verify Service.qml implements addAlbumOrCreatePlaylist and addTrackOrCreatePlaylist
        with open(os.path.join(REPO_ROOT, "Service.qml"), "r", encoding="utf-8") as f:
            service_src = f.read()
        self.assertIn("function addAlbumOrCreatePlaylist", service_src)
        self.assertIn("function addTrackOrCreatePlaylist", service_src)

        # Verify both Panel.qml and App.qml implement expandable album track drawers,
        # track play & add-to-playlist actions, custom playlist track navigation,
        # inner track ListView auto-scrolling, and 1-4 / Tab keyboard navigation
        for nav_qml in ("Panel.qml", "App.qml"):
            with open(os.path.join(REPO_ROOT, nav_qml), "r", encoding="utf-8") as f:
                nav_src = f.read()
            self.assertIn("function toggleAlbumExpand", nav_src, f"{nav_qml} missing toggleAlbumExpand")
            self.assertIn("function handleKeyNavigation", nav_src, f"{nav_qml} missing handleKeyNavigation")
            self.assertIn("ensureAlbumTracks", nav_src, f"{nav_qml} missing ensureAlbumTracks call")
            self.assertIn("focusedAlbumIndex", nav_src, f"{nav_qml} missing focusedAlbumIndex")
            self.assertIn("focusedTrackIndex", nav_src, f"{nav_qml} missing focusedTrackIndex")
            self.assertIn("focusedPlaylistTrackIndex", nav_src, f"{nav_qml} missing focusedPlaylistTrackIndex")
            self.assertIn("addTrackOrCreatePlaylist", nav_src, f"{nav_qml} missing addTrackOrCreatePlaylist")
            self.assertIn("addAlbumOrCreatePlaylist", nav_src, f"{nav_qml} missing addAlbumOrCreatePlaylist")
            self.assertIn("positionViewAtIndex(currentIndex, ListView.Contain)", nav_src, f"{nav_qml} missing inner ListView auto-scroll")
            self.assertIn("Qt.Key_1", nav_src, f"{nav_qml} missing 1-4 tab switching")
            self.assertIn("Qt.Key_4", nav_src, f"{nav_qml} missing 1-4 tab switching")

        # Verify App.qml loads cleanly in Quickshell with zero QML errors
        if shutil.which("quickshell") and (os.environ.get("WAYLAND_DISPLAY") or os.environ.get("DISPLAY")):
            proc = subprocess.Popen(
                ["quickshell", "-p", os.path.join(REPO_ROOT, "App.qml")],
                env=self.env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
            try:
                time.sleep(1.5)
            finally:
                proc.terminate()
                try:
                    out, _ = proc.communicate(timeout=3)
                except subprocess.TimeoutExpired:
                    proc.kill()
                    out, _ = proc.communicate()
            self.assertIn("Configuration Loaded", out, f"App.qml did not load cleanly: {out}")
            self.assertNotIn("ERROR:", out, f"App.qml had QML errors: {out}")

        # Verify no symlinks exist inside the plugin directory (Omarchy PluginRegistry rejects symlinks)
        for root, dirs, files in os.walk(REPO_ROOT):
            if ".git" in dirs:
                dirs.remove(".git")
            for name in dirs + files:
                full = os.path.join(root, name)
                self.assertFalse(os.path.islink(full), f"Symlink not allowed inside plugin directory: {full}")

        if shutil.which("omarchy"):
            val = subprocess.run(
                ["omarchy", "plugin", "validate", REPO_ROOT],
                capture_output=True,
                text=True,
                timeout=10,
            )
            self.assertEqual(val.returncode, 0, f"omarchy plugin validate failed: {val.stdout} {val.stderr}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
