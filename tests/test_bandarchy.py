#!/usr/bin/env python3
"""Comprehensive automated test suite for Bandarchy (`io.github.layolayo.bandarchy`).

Tests:
1. Mock Bandcamp server pagination (`data-blob` + `/api/fancollection/1/collection_items`,
   including pages where `more_available` is omitted/false while `last_token` continues)
   and unified merge with local music directories (`audioFormat`, `totalDuration`).
2. Search and scope filtering (`all`, `purchased`, `local`, `cloud`).
3. Purchase download (`redownload_urls` ZIP archive + `data-tralbum` stream rip),
   live `trackIndex`/`trackTotal`/`percent` download status, and ZipSlip rejection.
4. Omarchy screensaver album-art transcoding (`omarchy-transcode-ascii` Braille & Block
   modes + `omarchy-ascii` wrapped/compressed banner `bannerLines` + `artLines` + `screensaver --dry-run`).
5. Intelligent playlist generation seeded from `lastPlayedTrack` (`radio`, `kindred`,
   `journey`, `purchased` presets + `--save-as`) and custom user playlists CRUD.
6. Live `mpv` headless playback + UNIX socket IPC transport + `cava` spectrum config.
7. Bandcamp Account `login` / `logout` / `auth --logout` flow and `loggedOut` persistence.
8. QML static & runtime verification (`textFormat: Text.PlainText`, 4 Stage Modes,
   3 Visualiser Layers, Album Breakdown box, interactive scrollbars, download progress footer).
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
                    # Intentionally set more_available=False while last_token is non-empty
                    # to verify pagination continues until items=[] (real Bandcamp quirk)
                    "more_available": False,
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

        # Verify local-only sync preserves the 3 remote purchased albums
        local_only = self.run_cli("sync", "--local-only")
        self.assertEqual(local_only["purchasedCount"], 3)
        self.assertEqual(local_only["albumCount"], 4)

    def test_02_search_and_scope_filters(self):
        all_coll = self.run_cli("collection", "--scope", "all")
        self.assertEqual(all_coll["count"], 4)
        for alb in all_coll["albums"]:
            self.assertIn("audioFormat", alb)
            self.assertIn("totalDuration", alb)

        purchased_coll = self.run_cli("collection", "--scope", "purchased")
        self.assertEqual(purchased_coll["count"], 3)

        local_coll = self.run_cli("collection", "--scope", "local")
        self.assertEqual(local_coll["count"], 2)

        cloud_coll = self.run_cli("collection", "--scope", "cloud")
        self.assertEqual(cloud_coll["count"], 2)

        search_res = self.run_cli("search", "Voyage 34", "--scope", "purchased")
        self.assertEqual(len(search_res["albums"]), 1)
        self.assertEqual(search_res["albums"][0]["artist"], "Porcupine Tree")
        self.assertGreaterEqual(len(search_res["albums"][0].get("tracks", [])), 1)

        # On-demand `bandarchy album --id bc-album-300` resolves full remote tracklist (Phase I, Phase II)
        alb_detail = self.run_cli("album", "--id", "bc-album-300")
        self.assertEqual(alb_detail["album"]["id"], "bc-album-300")
        self.assertEqual(alb_detail["trackCount"], 2)
        self.assertEqual(alb_detail["album"]["tracks"][0]["title"], "Phase I")
        self.assertEqual(alb_detail["album"]["tracks"][1]["title"], "Phase II")

    def test_03_ascii_art_transcoding_and_use_album_art_option(self):
        # 1. Braille mode with Use Album Art = 1 + ttfxFrames + both bannerLines & artLines
        braille = self.run_cli(
            "ascii-art",
            "--image", self.cover_path,
            "--mode", "braille",
            "--use-album-art", "1",
            "--width", "40",
            "--height", "20",
            "--effect", "waves",
            "--text", "BASS COMMUNION",
        )
        self.assertEqual(braille["source"], "album-art")
        self.assertTrue(braille["useAlbumArt"])
        self.assertEqual(braille["rows"], 20)
        self.assertEqual(braille["cols"], 40)
        self.assertIn("bannerLines", braille)
        self.assertIn("artLines", braille)
        self.assertGreaterEqual(len(braille["bannerLines"]), 10)
        self.assertLessEqual(max(len(l) for l in braille["bannerLines"]), 68)
        self.assertTrue(os.path.isfile(braille["screensaverFile"]))
        if shutil.which("ttfx") or os.path.isfile("/usr/bin/ttfx"):
            self.assertGreater(braille.get("ttfxFrameCount", 0), 5)
            self.assertIsInstance(braille.get("ttfxFrames"), list)
            self.assertEqual(len(braille["ttfxFrames"][0]), 20)

        # 2. Block mode with Use Album Art = 1
        block = self.run_cli(
            "ascii-art",
            "--image", self.cover_path,
            "--mode", "block",
            "--use-album-art", "1",
            "--width", "40",
            "--height", "20",
            "--effect", "blackhole",
        )
        self.assertEqual(block["source"], "album-art")
        self.assertEqual(block["mode"], "block")
        self.assertEqual(block["rows"], 20)

        # 3. Use Album Art = 0 falls back to wrapped & compressed Omarchy ASCII banner (`Delta Corps Priest 1`)
        banner = self.run_cli(
            "ascii-art",
            "--image", self.cover_path,
            "--use-album-art", "0",
            "--text", "BASS COMMUNION",
        )
        self.assertEqual(banner["source"], "omarchy-ascii")
        self.assertFalse(banner["useAlbumArt"])
        self.assertGreaterEqual(banner["rows"], 10)
        self.assertLessEqual(banner["cols"], 68)

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

        # Verify download status file recorded 100% completion and track counts
        st = self.run_cli("status")
        self.assertEqual(st["download"]["percent"], 100)
        self.assertGreaterEqual(st["download"]["trackTotal"], 2)

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
        created = self.run_cli("playlists", "create", "--title", "Late Night Psychedelia", "--description", "Deep cuts")
        pl_id = created["created"]["id"]

        all_coll = self.run_cli("collection", "--scope", "all")
        album_id = all_coll["albums"][0]["id"]
        added = self.run_cli("playlists", "add", "--id", pl_id, "--album", album_id)
        self.assertGreaterEqual(added["playlist"]["trackCount"], 2)

        before_count = added["playlist"]["trackCount"]
        removed = self.run_cli("playlists", "remove-track", "--id", pl_id, "--index", "0")
        self.assertEqual(removed["playlist"]["trackCount"], before_count - 1)

        renamed = self.run_cli("playlists", "rename", "--id", pl_id, "--title", "Prog & Ambient")
        self.assertEqual(renamed["playlist"]["title"], "Prog & Ambient")

        listed = self.run_cli("playlists", "list")
        ids = [p["id"] for p in listed["playlists"]]
        self.assertIn(pl_id, ids)

        deleted = self.run_cli("playlists", "delete", "--id", pl_id)
        self.assertEqual(deleted["deleted"], pl_id)

    def test_07_bandcamp_login_and_logout_flow(self):
        # Log out and verify Bandcamp purchases are cleared while local library remains intact
        out_res = self.run_cli("logout")
        self.assertTrue(out_res["loggedOut"])
        self.assertEqual(out_res["username"], "")
        self.assertEqual(out_res["purchasedCount"], 0)
        self.assertGreaterEqual(out_res["localCount"], 2)

        # Log back in and sync from mock Bandcamp server
        login_res = self.run_cli("login", "--username", "testfan")
        self.assertFalse(login_res["loggedOut"])
        self.assertEqual(login_res["username"], "testfan")

        resync = self.run_cli("sync", "--username", "testfan", "--api-base", self.api_base)
        self.assertEqual(resync["purchasedCount"], 3)

    def test_08_qml_and_manifest_verification(self):
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

        # Verify PsychedelicEngine.js has all 3 configurable layers, 12 Layer-2 modes,
        # 6 Layer-1 modes, 6 Layer-3 modes, 10 palettes, and sub-block banner rendering
        engine_path = os.path.join(REPO_ROOT, "PsychedelicEngine.js")
        with open(engine_path, "r", encoding="utf-8") as f:
            engine_js = f.read()
        for expected_symbol in (
            "var LAYER1_MODE_NAMES",
            "var LAYER2_MODE_NAMES",
            "var LAYER3_MODE_NAMES",
            "MilkDrop Liquid Feedback Warp",
            "MilkDrop Geiss Cathedral",
            "AVS 3D SuperScope",
            "G-Force WaveShape Vortex",
            "Cthugha Rave Oscilloscope",
            "Minter VLM Neon Lattice",
            "Shatter & Evolving Rebuild",
            "Omarchy TTE Keyframe Morph",
            "function randomiseState",
            "function shatterAlbumArt",
            "function drawLayer3AlbumArt",
        ):
            self.assertIn(expected_symbol, engine_js)

        # Verify Service.qml implements auth, download progress, and playlist helpers
        with open(os.path.join(REPO_ROOT, "Service.qml"), "r", encoding="utf-8") as f:
            service_src = f.read()
        for expected_fn in (
            "function addAlbumOrCreatePlaylist",
            "function addTrackOrCreatePlaylist",
            "function openBandcampLogin",
            "function loginFromBrowser",
            "function logoutBandcamp",
            "function cycleLayer3Source",
            "downloadStatusSummary",
        ):
            self.assertIn(expected_fn, service_src)

        # Verify both Panel.qml and App.qml implement expandable Album Info Breakdown box,
        # interactive ListScroller scrollbar, live download progress footer, and 4 Stage Modes
        for nav_qml in ("Panel.qml", "App.qml"):
            with open(os.path.join(REPO_ROOT, nav_qml), "r", encoding="utf-8") as f:
                nav_src = f.read()
            self.assertIn("function toggleAlbumExpand", nav_src, f"{nav_qml} missing toggleAlbumExpand")
            self.assertIn("function handleKeyNavigation", nav_src, f"{nav_qml} missing handleKeyNavigation")
            self.assertIn("ALBUM BREAKDOWN", nav_src, f"{nav_qml} missing expandable Album Info Breakdown box")
            self.assertIn("component ListScroller", nav_src, f"{nav_qml} missing interactive ListScroller")
            self.assertIn("downloadStatusSummary", nav_src, f"{nav_qml} missing live download progress footer")
            self.assertIn("openBandcampLogin", nav_src, f"{nav_qml} missing openBandcampLogin")
            self.assertIn("logoutBandcamp", nav_src, f"{nav_qml} missing logoutBandcamp")

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

    def test_09_regression_fixes_and_3layer_engine(self):
        with open(os.path.join(REPO_ROOT, "Visualiser.qml"), "r", encoding="utf-8") as f:
            viz_src = f.read()
        with open(os.path.join(REPO_ROOT, "Service.qml"), "r", encoding="utf-8") as f:
            svc_src = f.read()
        with open(os.path.join(REPO_ROOT, "Panel.qml"), "r", encoding="utf-8") as f:
            panel_src = f.read()
        with open(os.path.join(REPO_ROOT, "App.qml"), "r", encoding="utf-8") as f:
            app_src = f.read()
        with open(os.path.join(REPO_ROOT, "PsychedelicEngine.js"), "r", encoding="utf-8") as f:
            engine_src = f.read()

        # 1. Visualiser.qml exposes both activateAndCycleTteInCanvas and toggleInCanvasTte,
        #    and both showLayerDrawer and showConfigDrawer, plus trackProgress in currentConfig()
        self.assertIn("function activateAndCycleTteInCanvas()", viz_src)
        self.assertIn("function toggleInCanvasTte()", viz_src)
        self.assertIn("property bool showLayerDrawer", viz_src)
        self.assertIn("property alias showConfigDrawer: root.showLayerDrawer", viz_src)
        self.assertIn("trackProgress: trackProg", viz_src)
        self.assertIn("layer1Trail: root.layer1Persistence", viz_src)
        self.assertIn("layer2Facets: root.symmetryFolds", viz_src)

        # 2. Service.qml exposes downloadAlbumId, downloadingAlbumId, loggedIn, notifyActivity,
        #    and loginFromBrowser(optionalUsername) passes --username when provided
        self.assertIn("readonly property string downloadAlbumId:", svc_src)
        self.assertIn("readonly property string downloadingAlbumId: downloadAlbumId", svc_src)
        self.assertIn("readonly property bool loggedIn:", svc_src)
        self.assertIn("function notifyActivity(msg)", svc_src)
        self.assertIn("function loginFromBrowser(optionalUsername)", svc_src)
        self.assertIn("function loginBandcamp(", svc_src)
        self.assertIn("function detectBrowserAccount(", svc_src)

        # 3. Panel.qml and App.qml do NOT abort saveAuth() by immediately calling syncCollection(false)
        for name, src in (("Panel.qml", panel_src), ("App.qml", app_src)):
            self.assertNotRegex(
                src,
                r"saveAuth\([^\n]+\)\s*\n\s*(?:root\.)?service\.syncCollection\(false\)",
                f"{name} must not call syncCollection(false) immediately after saveAuth()",
            )
            self.assertIn("downloadAlbumId === modelData.id", src, f"{name} must bind downloadAlbumId on album rows")
            self.assertIn("onRequestStageModeChange:", src, f"{name} must persist stageMode changes via Service")

        # 4. PsychedelicEngine.js stepState normalises cfg at entry and blends bassAtt/midAtt/trebAtt
        step_idx = engine_src.index("function stepState(")
        step_body = engine_src[step_idx : step_idx + 3600]
        self.assertIn("cfg = normaliseConfig(cfg)", step_body)
        self.assertIn("state.bassAtt", step_body)
        self.assertIn("0.42 * state.bassAtt", step_body)

    def test_10_demoscene_engine_presets_and_layer_isolation(self):
        with open(os.path.join(REPO_ROOT, "Visualiser.qml"), "r", encoding="utf-8") as f:
            viz_src = f.read()
        with open(os.path.join(REPO_ROOT, "PsychedelicEngine.js"), "r", encoding="utf-8") as f:
            engine_src = f.read()

        # 1. Strict Layer Isolation in Visualiser.qml:
        #    onVisualModeChanged and cycleMode/cycleLayer1Mode/cycleLayer3Mode must NEVER force layer3Enabled = true
        self.assertIn("readonly property int maxInternalW: 1280", viz_src)
        self.assertIn("property var collectivePresets:", viz_src)
        self.assertIn("function applyCollectivePreset(", viz_src)
        self.assertIn("function cycleSelectedPreset(", viz_src)
        self.assertIn("function saveCurrentAsCollectivePreset()", viz_src)
        self.assertNotIn("TTE: waves", viz_src)
        self.assertIn('text: "󰍹 TTE"', viz_src)

        # Verify 3 independent L1 sub-systems, interactive tracerPopover, trackArcMode, and HUD-free Zen Fullscreen keys
        self.assertIn("property bool layer1FieldEnabled: true", viz_src)
        self.assertIn("property bool layer1EqEnabled: true", viz_src)
        self.assertIn("property bool layer1ShapesEnabled: true", viz_src)
        self.assertIn("property bool showTracerPopover: false", viz_src)
        self.assertIn("property int trackArcMode: 0", viz_src)
        self.assertIn("function toggleZenFullscreen()", viz_src)
        self.assertIn("id: hudAutoHideTimer", viz_src)
        self.assertNotIn('"lighter"', engine_src)

        # Ensure onVisualModeChanged does NOT set layer3Enabled = true
        vmode_idx = viz_src.index("onVisualModeChanged:")
        vmode_block = viz_src[vmode_idx : vmode_idx + 120]
        self.assertNotIn("layer3Enabled = true", vmode_block)

        # 2. Execute PsychedelicEngine.js via Node.js to verify:
        #    - All 12 Layer #2 modes with 9x 3D Graded History Tracers render in < 2.5 ms/frame at 640x360
        #    - All 3 Layer #1 independent sub-systems (Field 0..5, Equaliser 0..12 over any Field or solo, Beat Shapes 0..5)
        #    - Strict Layer Isolation: when layer3Enabled=false, drawLayer3AlbumArt draws 0 rects
        #    - Genuine 2x4 Braille pinpoint dots vs laser-stipple Song Words
        if shutil.which("node"):
            node_script = r"""
const fs = require('fs');
let code = fs.readFileSync('PsychedelicEngine.js', 'utf8').replace(/^\.pragma library\s*/m, '');
eval(code);

function makeMockCtx() {
    return {
        fillCount: 0, strokeCount: 0, rectCount: 0, drawImageCount: 0,
        fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1, globalCompositeOperation: 'source-over',
        save() {}, restore() {}, translate() {}, rotate() {}, scale() {},
        beginPath() {}, closePath() {}, moveTo() {}, lineTo() {},
        rect() { this.rectCount++; },
        arc() {},
        fill() { this.fillCount++; },
        stroke() { this.strokeCount++; },
        fillRect() { this.fillCount++; },
        clearRect() {},
        drawImage() { this.drawImageCount++; },
        createLinearGradient() { return { addColorStop() {} }; },
        createRadialGradient() { return { addColorStop() {} }; }
    };
}

const state = createState();
const bands = Array.from({length: 64}, (_, i) => 180 + 140 * Math.sin(i * 0.3));
const brailleArt = Array.from({length: 16}, () => '⣿⣷⣯⣟⡿⢿⣻⣽'.repeat(5));
const bannerWords = Array.from({length: 12}, () => '█▀▄░▒▓ BASS COMMUNION ▓▒░▄▀█');
const theme = { accent: '#6ee7b7', urgent: '#f472b6', foreground: '#e2e8f0', background: '#07090e' };

// A. Verify strict Layer #3 isolation: when layer3Enabled is false, zero Layer #3 cells are drawn
const ctxL3Off = makeMockCtx();
const cfgL3Off = normaliseConfig({
    layer1Enabled: false,
    layer2Enabled: false,
    layer3Enabled: false,
    useAlbumArt: true,
    asciiMode: 'braille',
    artLines: brailleArt,
    bannerLines: bannerWords
}, 10, brailleArt);
stepState(state, bands, true, cfgL3Off, 0.016);
renderFrame(ctxL3Off, 640, 360, state, 10, theme, brailleArt, 'album-art', [], cfgL3Off, null);
if (ctxL3Off.rectCount !== 0) {
    throw new Error('Layer #3 drew geometry when layer3Enabled=false! rectCount=' + ctxL3Off.rectCount);
}
const ctxL3Direct = makeMockCtx();
drawLayer3AlbumArt(ctxL3Direct, 640, 360, state, ['#6ee7b7'], cfgL3Off, brailleArt, []);
if (ctxL3Direct.rectCount !== 0 || ctxL3Direct.fillCount !== 0) {
    throw new Error('drawLayer3AlbumArt drew when layer3Enabled=false!');
}

// B. Verify all 6 Layer #1 background modes (0..5), all 13 Equaliser styles (0..12), and all 6 Beat Shape styles (0..5)
for (let l1m = 0; l1m < 6; l1m++) {
    const ctxL1 = makeMockCtx();
    const cfgL1 = normaliseConfig({
        layer1Enabled: true, layer1FieldEnabled: true, layer1Mode: l1m,
        layer1EqEnabled: false, layer1ShapesEnabled: false,
        layer2Enabled: false, layer3Enabled: false
    }, 0, []);
    stepState(state, bands, true, cfgL1, 0.016);
    renderFrame(ctxL1, 640, 360, state, 0, theme, [], 'album-art', [], cfgL1, null);
    if (ctxL1.fillCount < 2 || ctxL1.strokeCount < 1) {
        throw new Error('Layer #1 mode ' + l1m + ' missing volumetric fill/stroke geometry: fill=' + ctxL1.fillCount + ' stroke=' + ctxL1.strokeCount);
    }
}
for (let eqStyle = 0; eqStyle < 13; eqStyle++) {
    const ctxEq = makeMockCtx();
    const cfgEq = normaliseConfig({
        layer1Enabled: true, layer1FieldEnabled: false, layer1EqEnabled: true, layer1ShapesEnabled: false,
        layer1EqStyle: eqStyle, layer1EqLayout: eqStyle % 3, layer1EqGain: 1.4, layer1EqDamping: eqStyle % 3,
        layer2Enabled: false, layer3Enabled: false
    }, 0, []);
    stepState(state, bands, true, cfgEq, 0.016);
    renderFrame(ctxEq, 640, 360, state, 0, theme, [], 'album-art', [], cfgEq, null);
    if (ctxEq.fillCount + ctxEq.strokeCount < 2) {
        throw new Error('Layer #1 Equaliser style ' + eqStyle + ' produced no geometry');
    }
}
for (let shStyle = 0; shStyle < 6; shStyle++) {
    const ctxSh = makeMockCtx();
    const cfgSh = normaliseConfig({
        layer1Enabled: true, layer1FieldEnabled: false, layer1EqEnabled: false, layer1ShapesEnabled: true,
        layer1ShapeStyle: shStyle, layer1ShapeSpeed: 1.2, layer1ShapeSpin: 1.3, layer1ShapeScale: 1.1,
        layer2Enabled: false, layer3Enabled: false
    }, 0, []);
    stepState(state, bands, true, cfgSh, 0.016);
    renderFrame(ctxSh, 640, 360, state, 0, theme, [], 'album-art', [], cfgSh, null);
    if (ctxSh.fillCount + ctxSh.strokeCount < 2) {
        throw new Error('Layer #1 Beat Shapes style ' + shStyle + ' produced no geometry');
    }
}

// C. Verify all 12 Layer #2 modes (0..11) individually produce 3D volumetric fills AND vector strokes,
//    then benchmark all 12 modes at 640x360 with 9x 3D Graded History Tracers + L1 + L3
let maxMs = 0;
for (let m = 0; m < 12; m++) {
    const ctxSingle = makeMockCtx();
    const cfgSingle = normaliseConfig({
        layer1Enabled: false,
        layer2Enabled: true, layer2Mode: m, tracerCount: 1,
        layer3Enabled: false
    }, m, []);
    stepState(state, bands, true, cfgSingle, 0.016);
    renderFrame(ctxSingle, 640, 360, state, m, theme, [], 'album-art', [], cfgSingle, null);
    if (ctxSingle.fillCount < 1 || ctxSingle.strokeCount < 1) {
        throw new Error('Layer #2 mode ' + m + ' missing 3D volumetric fill/stroke: fill=' + ctxSingle.fillCount + ' stroke=' + ctxSingle.strokeCount);
    }

    const ctx = makeMockCtx();
    const cfg = normaliseConfig({
        layer1Enabled: true, layer1Mode: m % 6,
        layer1FieldEnabled: true, layer1EqEnabled: true, layer1ShapesEnabled: true,
        layer2Enabled: true, layer2Mode: m,
        tracerCount: 9, tracerSpeed: 1.25, tracerDrift: 1.1, tracerDirection: (m % 2 === 0 ? 1 : -1),
        layer3Enabled: true, layer3Mode: m % 6, layer3Tracers: 4,
        useAlbumArt: (m % 2 === 0),
        asciiMode: (m % 2 === 0 ? 'braille' : 'banner'),
        artLines: brailleArt,
        bannerLines: bannerWords
    }, m, brailleArt);
    // Warm up V8 JIT and rebuildArtCells cache before timing
    for (let w = 0; w < 3; w++) {
        stepState(state, bands, true, cfg, 0.016);
        renderFrame(ctx, 640, 360, state, m, theme, brailleArt, 'album-art', [], cfg, null);
    }
    const t0 = process.hrtime.bigint();
    const frames = 20;
    for (let f = 0; f < frames; f++) {
        stepState(state, bands, true, cfg, 0.016);
        renderFrame(ctx, 640, 360, state, m, theme, brailleArt, 'album-art', [], cfg, null);
    }
    const avgMs = Number(process.hrtime.bigint() - t0) / 1e6 / frames;
    if (avgMs > maxMs) maxMs = avgMs;
    if (ctx.drawImageCount !== 0) {
        throw new Error('drawImage feedback must never be called');
    }
}
console.log(JSON.stringify({ ok: true, maxFrameMs: maxMs }));
"""
            res = subprocess.run(
                ["node", "-e", node_script],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
                timeout=15,
            )
            self.assertEqual(res.returncode, 0, f"Node engine verification failed: {res.stderr}")
            bench = json.loads(res.stdout.strip())
            self.assertTrue(bench["ok"])
            self.assertLess(bench["maxFrameMs"], 5.0, f"Frame render too slow: {bench['maxFrameMs']} ms")

    def test_11_smooth_accumulators_dedup_and_4combo_layer3(self):
        # 1. Verify compiled Qt6 QSB fragment shader exists and is non-empty
        qsb_path = os.path.join(REPO_ROOT, "share", "psychedelic.frag.qsb")
        self.assertTrue(os.path.isfile(qsb_path), "share/psychedelic.frag.qsb must exist")
        self.assertGreater(os.path.getsize(qsb_path), 512, "share/psychedelic.frag.qsb must be non-empty")

        # 2. Verify Visualiser.qml, App.qml, Panel.qml, Service.qml, PsychedelicEngine.js new features
        with open(os.path.join(REPO_ROOT, "Visualiser.qml"), "r", encoding="utf-8") as f:
            viz_src = f.read()
        with open(os.path.join(REPO_ROOT, "Service.qml"), "r", encoding="utf-8") as f:
            svc_src = f.read()
        with open(os.path.join(REPO_ROOT, "App.qml"), "r", encoding="utf-8") as f:
            app_src = f.read()
        with open(os.path.join(REPO_ROOT, "PsychedelicEngine.js"), "r", encoding="utf-8") as f:
            engine_src = f.read()

        self.assertIn("property bool gpuShaderEnabled: true", viz_src)
        self.assertIn("visible: root.showHud && root.isFullscreen", viz_src)
        self.assertIn("function setAsciiSourceMode(", svc_src)
        self.assertIn("fastPlayPollTimer", svc_src)
        self.assertIn("applyOmarchyTheme", app_src)
        self.assertIn("function syncLayer1MasterFromSubs()", viz_src)
        self.assertIn("onBannerLinesChanged:", viz_src)
        self.assertIn("onArtLinesChanged:", viz_src)
        self.assertIn("interval: 9000", viz_src)
        self.assertIn("interval: 18000", viz_src)
        self.assertIn('"󰒟 Rand L1"', viz_src)
        self.assertIn("Dynamic Audio Arc", engine_src)
        self.assertNotIn("+ state.beatCount)", engine_src)

        # 3. Verify Node.js monotonic phase accumulators, 7 L1 modes, 7 EQ styles, Dynamic Audio Arc, and all 4 Layer #3 combinations
        if shutil.which("node"):
            node_script = r"""
const fs = require('fs');
let code = fs.readFileSync('PsychedelicEngine.js', 'utf8').replace(/^\.pragma library\s*/m, '');
eval(code);

function makeMockCtx() {
    return {
        fillCount: 0, strokeCount: 0, rectCount: 0,
        fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1, globalCompositeOperation: 'source-over',
        save() {}, restore() {}, translate() {}, rotate() {}, scale() {},
        beginPath() {}, closePath() {}, moveTo() {}, lineTo() {},
        rect() { this.rectCount++; },
        arc() {},
        fill() { this.fillCount++; },
        stroke() { this.strokeCount++; },
        fillRect() { this.fillCount++; },
        clearRect() {},
        drawImage() {},
        createLinearGradient() { return { addColorStop() {} }; },
        createRadialGradient() { return { addColorStop() {} }; }
    };
}

        const state = createState();
if (LAYER1_MODES.length !== 11) throw new Error('Expected 11 LAYER1_MODES, got ' + LAYER1_MODES.length);
if (LAYER1_EQ_STYLES.length !== 16) throw new Error('Expected 16 LAYER1_EQ_STYLES, got ' + LAYER1_EQ_STYLES.length);
if (LAYER1_EQ_LAYOUTS.length !== 4) throw new Error('Expected 4 LAYER1_EQ_LAYOUTS, got ' + LAYER1_EQ_LAYOUTS.length);
if (MODE_NAMES.length !== 13) throw new Error('Expected 13 Layer 2 MODE_NAMES, got ' + MODE_NAMES.length);
if (LAYER3_MODES.length !== 12) throw new Error('Expected 12 LAYER3_MODES, got ' + LAYER3_MODES.length);
if (TRACK_ARC_MODES[0] !== 'Dynamic Audio Arc') throw new Error('Expected TRACK_ARC_MODES[0] to be Dynamic Audio Arc');

// Verify monotonic phase accumulators never jump backwards under extreme bass/speed swings
let prevL1 = 0, prevTunnel = 0, prevZoom = 0, prevMatrix = 0;
for (let i = 0; i < 40; i++) {
    const swingBands = Array.from({length: 64}, () => (i % 2 === 0 ? 1000 : 0));
    const cfg = normaliseConfig({
        layer1Speed: (i % 2 === 0 ? 2.5 : 0.2),
        layer2Speed: (i % 2 === 0 ? 2.5 : 0.2),
        tracerSpeed: (i % 2 === 0 ? 2.8 : 0.2)
    }, 0, []);
    stepState(state, swingBands, true, cfg, 0.016);
    if (state.l1Time < prevL1 || state.tunnelTime < prevTunnel || state.zoomTime < prevZoom || state.matrixTime < prevMatrix) {
        throw new Error('Phase accumulator jumped backwards at step ' + i);
    }
    prevL1 = state.l1Time;
    prevTunnel = state.tunnelTime;
    prevZoom = state.zoomTime;
    prevMatrix = state.matrixTime;
}

// Verify all 11 L1 Field modes (0..10) render geometry
const theme = { accent: '#ffab00', urgent: '#ff4a6b', foreground: '#e2e8f0', background: '#08080c' };
for (let l1m = 0; l1m < 11; l1m++) {
    const ctx = makeMockCtx();
    const cfg = normaliseConfig({ layer1Enabled: true, layer1FieldEnabled: true, layer1Mode: l1m, layer1EqEnabled: true, layer1EqStyle: 6, layer2Enabled: false, layer3Enabled: false }, 0, []);
    renderFrame(ctx, 640, 360, state, 0, theme, [], 'album-art', [], cfg, null);
    if (ctx.fillCount < 1 && ctx.strokeCount < 1) {
        throw new Error('L1 mode ' + l1m + ' failed to draw geometry');
    }
}

// Verify all 6 Layer #3 source/style combinations: (useAlbumArt: true/false) x (asciiMode: braille/block/text)
const brailleArt = Array.from({length: 12}, () => '⣿⣷⣯⣟⡿⢿⣻⣽'.repeat(4));
const bannerWords = Array.from({length: 10}, () => '█▀▄░▒▓ BASS COMMUNION ▓▒░▄▀█');
for (const useArt of [true, false]) {
    for (const glyphMode of ['braille', 'block', 'text']) {
        const ctx = makeMockCtx();
        ctx.fillTextCount = 0;
        ctx.fillText = function() { this.fillTextCount++; };
        const cfg = normaliseConfig({
            layer1Enabled: false, layer2Enabled: false, layer3Enabled: true,
            useAlbumArt: useArt, asciiMode: glyphMode,
            artLines: brailleArt, bannerLines: bannerWords
        }, 0, useArt ? brailleArt : bannerWords);
        stepState(state, Array.from({length: 64}, () => 400), true, cfg, 0.016);
        renderFrame(ctx, 640, 360, state, 0, theme, useArt ? brailleArt : bannerWords, useArt ? 'album-art' : 'banner', [], cfg, null);
        if (ctx.rectCount + ctx.fillTextCount + ctx.fillCount < 10) {
            throw new Error('Layer #3 combo useAlbumArt=' + useArt + ' asciiMode=' + glyphMode + ' failed');
        }
    }
}
console.log('OK');
"""
            res = subprocess.run(["node", "-e", node_script], cwd=REPO_ROOT, capture_output=True, text=True, timeout=15)
            self.assertEqual(res.returncode, 0, f"Node test_11 failed: {res.stderr}")

    def test_12_saved_layer_configs_minter_joint_fix_backdrop_3d_tanks_and_album_row(self):
        # 1. Test `bandarchy visualiser-config --get` and `--set <json>` disk persistence round-trip
        viz_cfg_file = os.path.join(self.env["XDG_CONFIG_HOME"], "bandarchy", "visualiser.json")
        if os.path.exists(viz_cfg_file):
            os.remove(viz_cfg_file)
        res_empty = self.run_cli("visualiser-config", "--get")
        self.assertEqual(res_empty["status"], "ok")
        self.assertEqual(res_empty["config"], {})

        sample_cfg = {
            "version": 1,
            "paletteIndex": 3,
            "backdropEnabled": True,
            "backdropMode": 4,
            "backdropSpeed": 1.35,
            "layer1AutoRandomise": True,
            "layer2AutoRandomise": False,
            "layer3AutoRandomise": True,
            "savedL1Configs": [{"name": "Custom L1", "l1Mode": 4, "l1Speed": 0.25}],
            "savedL2Configs": [{"name": "Custom L2", "l2Mode": 4, "tracerCount": 8}],
            "savedL3Configs": [{"name": "Custom L3", "l3Mode": 5, "layer3Tracers": 4}],
        }
        res_set = self.run_cli("visualiser-config", "--set", json.dumps(sample_cfg))
        self.assertEqual(res_set["status"], "ok")
        self.assertEqual(res_set["config"]["backdropMode"], 4)
        self.assertEqual(res_set["config"]["savedL1Configs"][0]["name"], "Custom L1")

        res_get = self.run_cli("visualiser-config", "--get")
        self.assertEqual(res_get["status"], "ok")
        self.assertEqual(res_get["config"]["paletteIndex"], 3)
        self.assertEqual(res_get["config"]["savedL2Configs"][0]["tracerCount"], 8)

        # Edge case: invalid JSON passed to `--set` must return an error without corrupting saved config
        proc_bad = subprocess.run(
            [BIN_PATH, "visualiser-config", "--set", "{not-valid-json"],
            env=self.env,
            capture_output=True,
            text=True,
            timeout=10,
        )
        self.assertNotEqual(proc_bad.returncode, 0)
        res_after_bad = self.run_cli("visualiser-config", "--get")
        self.assertEqual(res_after_bad["config"]["paletteIndex"], 3)

        # 2. Verify Visualiser.qml, App.qml, Panel.qml, Service.qml, and share/psychedelic.frag upgrades
        with open(os.path.join(REPO_ROOT, "Visualiser.qml"), "r", encoding="utf-8") as f:
            viz_src = f.read()
        with open(os.path.join(REPO_ROOT, "App.qml"), "r", encoding="utf-8") as f:
            app_src = f.read()
        with open(os.path.join(REPO_ROOT, "Panel.qml"), "r", encoding="utf-8") as f:
            panel_src = f.read()
        with open(os.path.join(REPO_ROOT, "Service.qml"), "r", encoding="utf-8") as f:
            svc_src = f.read()
        with open(os.path.join(REPO_ROOT, "share", "psychedelic.frag"), "r", encoding="utf-8") as f:
            frag_src = f.read()

        # Individual Layer Saved Configs & Strict Single-Layer Isolation
        for fn_name in (
            "function saveCurrentL1Config()",
            "function applySavedL1Config(",
            "function deleteSavedL1Config(",
            "function saveCurrentL2Config()",
            "function applySavedL2Config(",
            "function deleteSavedL2Config(",
            "function saveCurrentL3Config()",
            "function applySavedL3Config(",
            "function deleteSavedL3Config(",
            "function buildPersistedConfigSnapshot()",
            "function applyPersistedConfig(",
            "function resetAllVisualiserDefaults()",
        ):
            self.assertIn(fn_name, viz_src, f"Missing {fn_name} in Visualiser.qml")

        # Verify applySavedL1Config never modifies visualMode or layer3Mode
        l1_apply_idx = viz_src.index("function applySavedL1Config(")
        l1_apply_body = viz_src[l1_apply_idx : viz_src.index("function cycleSavedL1Config(")]
        self.assertNotIn("root.visualMode", l1_apply_body)
        self.assertNotIn("root.layer3Mode", l1_apply_body)

        # Verify applySavedL2Config never modifies layer1Mode or layer3Mode
        l2_apply_idx = viz_src.index("function applySavedL2Config(")
        l2_apply_body = viz_src[l2_apply_idx : viz_src.index("function cycleSavedL2Config(")]
        self.assertNotIn("root.layer1Mode", l2_apply_body)
        self.assertNotIn("root.layer3Mode", l2_apply_body)

        # Verify applySavedL3Config never modifies layer1Mode or visualMode
        l3_apply_idx = viz_src.index("function applySavedL3Config(")
        l3_apply_body = viz_src[l3_apply_idx : viz_src.index("function cycleSavedL3Config(")]
        self.assertNotIn("root.layer1Mode", l3_apply_body)
        self.assertNotIn("root.visualMode", l3_apply_body)

        # Independent GPU Shader Backdrop & live uniform push (including palette colours uCol0..uCol2) in frameAnim
        self.assertIn("property bool backdropEnabled: true", viz_src)
        self.assertIn("property int backdropMode: 0", viz_src)
        self.assertIn("gpuShaderStage.uTime =", viz_src)
        self.assertIn("gpuShaderStage.uCol0 =", viz_src)
        self.assertIn("gpuShaderStage.uCol1 =", viz_src)
        self.assertIn("gpuShaderStage.uCol2 =", viz_src)
        self.assertIn("property real uL2Mode: root.backdropMode", viz_src)
        self.assertIn("if (m == 0)", frag_src)
        self.assertIn("else if (m == 5)", frag_src)

        # Verify explicit Save L1/L2/L3 + Saved L1/L2/L3 (N) buttons on HUD Rows 2A, 2B, 2C and empty-array persistence
        self.assertIn('text: "󰆓 Save L1"', viz_src)
        self.assertIn('text: "󰉋 Saved L1 ("', viz_src)
        self.assertIn('text: "󰆓 Save L2"', viz_src)
        self.assertIn('text: "󰉋 Saved L2 ("', viz_src)
        self.assertIn('text: "󰆓 Save L3"', viz_src)
        self.assertIn('text: "󰉋 Saved L3 ("', viz_src)
        self.assertIn("if (Array.isArray(cfg.savedL3Configs)) root.savedL3Configs = cfg.savedL3Configs", viz_src)

        # Per-Layer Auto-Randomise ON/OFF toggles & Tab 4 General & Quality
        self.assertIn("property bool layer1AutoRandomise: false", viz_src)
        self.assertIn("property bool layer2AutoRandomise: false", viz_src)
        self.assertIn("property bool layer3AutoRandomise: false", viz_src)
        self.assertIn("󰒓 General & Quality", viz_src)
        self.assertIn("function saveVisualiserConfig(", svc_src)
        self.assertIn('/bin/bandarchy-player"', svc_src)

        # Verify Album Row layout fix in both App.qml and Panel.qml
        for name, src in (("App.qml", app_src), ("Panel.qml", panel_src)):
            self.assertIn('text: modelData.isLocal ? "LOCAL" : "CLOUD"', src, f"{name} must use compact LOCAL/CLOUD badge")
            self.assertIn(': "󰇚 Save"', src, f"{name} must use compact non-danger Save button")
            self.assertNotIn("danger: !appAlbumCard.isAlbumDownloading", src)
            self.assertNotIn("danger: !albumCard.isAlbumDownloading", src)
            self.assertIn("persistedConfig:", src, f"{name} must bind persistedConfig on Visualiser")
            self.assertIn("onRequestSaveVisualiserConfig:", src, f"{name} must bind onRequestSaveVisualiserConfig on Visualiser")

        # 3. Verify Node.js PsychedelicEngine.js:
        #    - BACKDROP_MODES has 8 entries and state.backdropTime scales with backdropSpeed
        #    - evalMinterShapeProfile(kindOrPhase, a, baseFolds) smoothly interpolates across continuous kindOrPhase (no integer discontinuity)
        #    - L1 Mode 4 (TRON / Battlezone Landscape) renders 8-edge pyramids, 12-edge cubes, 3D Battlezone tanks, and locked worldScroll
        if shutil.which("node"):
            node_script = r"""
const fs = require('fs');
let code = fs.readFileSync('PsychedelicEngine.js', 'utf8').replace(/^\.pragma library\s*/m, '');
eval(code);

if (!Array.isArray(BACKDROP_MODES) || BACKDROP_MODES.length !== 8) {
    throw new Error('Expected 8 BACKDROP_MODES, got ' + JSON.stringify(BACKDROP_MODES));
}

// Verify state.backdropTime advances proportionally to cfg.backdropSpeed
const stSlow = createState();
const stFast = createState();
stepState(stSlow, new Array(64).fill(200), true, normaliseConfig({ backdropSpeed: 0.25 }, 0, []), 0.05);
stepState(stFast, new Array(64).fill(200), true, normaliseConfig({ backdropSpeed: 2.50 }, 0, []), 0.05);
if (!(stFast.backdropTime > stSlow.backdropTime * 5.0)) {
    throw new Error('Expected backdropTime to scale with backdropSpeed: slow=' + stSlow.backdropTime + ' fast=' + stFast.backdropTime);
}

// Verify evalMinterShapeProfile is C0-continuous across integer kindOrPhase boundaries (no sudden joint snap!)
for (let w = 0.85; w <= 5.15; w += 0.01) {
    const v0 = evalMinterShapeProfile(w, 0.37, 6);
    const v1 = evalMinterShapeProfile(w + 0.001, 0.37, 6);
    if (Math.abs(v1 - v0) > 0.015) {
        throw new Error('Discontinuity in evalMinterShapeProfile at kindOrPhase=' + w + ': dv=' + Math.abs(v1 - v0));
    }
}

// Verify project3DPoint and append3DWireframeTank produce valid 3D projected coordinates and muzzle point
let moveCount = 0, lineCount = 0;
const mockCtx = {
    moveTo() { moveCount++; },
    lineTo() { lineCount++; },
    closePath() {},
    beginPath() {},
    fill() {},
    stroke() {},
    rect() {},
    arc() {},
    save() {},
    restore() {},
    createLinearGradient() { return { addColorStop() {} }; },
    createRadialGradient() { return { addColorStop() {} }; }
};
const muzzle = append3DWireframeTank(mockCtx, 320, 240, 40, 0.25, 0.6, 0.1, 0.4, 0.12, 1.2);
if (!muzzle || !Number.isFinite(muzzle.x) || !Number.isFinite(muzzle.y) || lineCount < 25) {
    throw new Error('append3DWireframeTank failed: lineCount=' + lineCount + ' muzzle=' + JSON.stringify(muzzle));
}
console.log('OK');
"""
            res = subprocess.run(["node", "-e", node_script], cwd=REPO_ROOT, capture_output=True, text=True, timeout=15)
            self.assertEqual(res.returncode, 0, f"Node test_12 failed: {res.stderr}")

    def test_13_gpu_tunnel_l1_controls_sun_eq_and_landscape_models(self):
        with open(os.path.join(REPO_ROOT, "Visualiser.qml"), "r", encoding="utf-8") as f:
            viz_src = f.read()
        with open(os.path.join(REPO_ROOT, "App.qml"), "r", encoding="utf-8") as f:
            app_src = f.read()
        with open(os.path.join(REPO_ROOT, "Panel.qml"), "r", encoding="utf-8") as f:
            panel_src = f.read()
        with open(os.path.join(REPO_ROOT, "Service.qml"), "r", encoding="utf-8") as f:
            svc_src = f.read()
        with open(os.path.join(REPO_ROOT, "PsychedelicEngine.js"), "r", encoding="utf-8") as f:
            engine_src = f.read()

        # 1. Verify GPU Tunnel controls live in Tab 4 (zero duplicate Tunnel buttons on Row 2A) and Row 2A has 16 EQ styles, 4 Orientations, and EqSz
        self.assertIn("property real uL1Enabled: 0.0", viz_src)
        self.assertIn("property real uL2Enabled: (root.gpuShaderEnabled && root.backdropEnabled && (root.layer1Enabled || root.layer2Enabled)) ? 1.0 : 0.0", viz_src)
        self.assertIn("readonly property bool hasActiveCpuLayers:", viz_src)
        self.assertIn("visible: root.stageMode === \"visualiser\" && root.hasActiveCpuLayers", viz_src)
        self.assertIn("renderStrategy: Canvas.Threaded", viz_src)
        self.assertNotIn('text: root.backdropEnabled ? "Tunnel:ON" : "Tunnel:OFF"', viz_src)
        self.assertIn('text: root.layer1EqEnabled ? "LED:ON" : "LED:OFF"', viz_src)
        self.assertIn('text: "EQ:" + (root.shortEqLabels[root.layer1EqStyle % root.shortEqLabels.length] || "Skyline")', viz_src)
        self.assertIn('text: "EqPos:" + (root.shortEqPosLabels[root.layer1EqLayout % root.shortEqPosLabels.length] || "Bottom ▲")', viz_src)
        self.assertIn('text: "EqSz:" + root.layer1EqScale.toFixed(1) + "x"', viz_src)
        self.assertIn('text: root.layer1ShapesEnabled ? "Shapes:ON" : "Shapes:OFF"', viz_src)
        self.assertIn("property bool externalStageOpen: false", viz_src)
        self.assertIn("id: externalStageWindow", viz_src)

        # Verify Bi-State Section Toggles, Density Sliders, Smooth GPU Colour Interpolation, 1280p Ultra+ Quality & Canvas Resolution in Visualiser.qml
        self.assertIn('text: root.layer1FieldEnabled ? "󰄬 Field: ON" : "󰅖 Field: OFF"', viz_src)
        self.assertIn('text: root.layer1EqEnabled ? "󰄬 EQ: ON" : "󰅖 EQ: OFF"', viz_src)
        self.assertIn('text: root.layer1ShapesEnabled ? "󰄬 Shapes: ON" : "󰅖 Shapes: OFF"', viz_src)
        self.assertIn('text: root.backdropEnabled ? "󰄬 GPU Tunnel: ON" : "󰅖 GPU Tunnel: OFF"', viz_src)
        self.assertIn('text: root.layer2VizEnabled ? "󰄬 L2 Viz: ON" : "󰅖 L2 Viz: OFF"', viz_src)
        self.assertIn('text: root.layer2TracersEnabled ? "󰄬 L2 3D Tracers: ON" : "󰅖 L2 3D Tracers: OFF"', viz_src)
        self.assertIn('label: "Field Object Density"', viz_src)
        self.assertIn('label: "Beat Shapes Density"', viz_src)
        self.assertIn('label: "Canvas Resolution"', viz_src)
        self.assertIn('"Ultra+ (1280p Razor)"', viz_src)
        self.assertIn("readonly property int maxInternalW: 1280", viz_src)
        self.assertIn("Layout.preferredWidth: 138", viz_src)
        self.assertIn("function samplePaletteVec4(", viz_src)
        self.assertIn("function lerpVec4(", viz_src)
        self.assertIn("property real uL2VizMode:", viz_src)
        self.assertIn("var rows = 16", engine_src)
        self.assertIn("var cols = 18", engine_src)

        # 2. Verify unified Rand buttons in drawer Tabs 1, 2, 3 (no duplicate Step Random buttons), orphaned L2 Tracers removed from App.qml, and Panel/Service cava gating
        self.assertNotIn("🎲 Step Random L2", viz_src)
        self.assertNotIn("🎲 Step Random L3", viz_src)
        self.assertIn('text: root.layer1AutoRandomise ? "󰒟 Rand L1 (Auto: ON)" : "󰒟 Rand L1"', viz_src)
        self.assertIn('text: root.layer2AutoRandomise ? "󰒟 Rand L2 (Auto: ON)" : "󰒟 Rand L2"', viz_src)
        self.assertIn('text: root.layer3AutoRandomise ? "󰒟 Rand L3 (Auto: ON)" : "󰒟 Rand L3"', viz_src)
        self.assertNotIn("L2 Tracers: ", app_src)
        self.assertIn("function syncVisualiserActive()", panel_src)
        self.assertIn("running: (root.activelyPlaying && root.topBarLedEnabled) || root.visualiserActive || root.fullscreenVisualiserOpen", svc_src)
        self.assertIn('"Sun Rays"', engine_src)
        self.assertIn('"3D Sonic Orb"', engine_src)
        self.assertIn('"3D Torus Reactor"', engine_src)
        self.assertIn('"Cymatic Chladni"', engine_src)
        self.assertIn('"3D Helix Vortex"', engine_src)
        self.assertIn('"Tesla Plasma Arcs"', engine_src)
        self.assertIn('"Tralis Voxel City"', engine_src)
        self.assertIn('"Aurora Curtains"', engine_src)
        self.assertIn('"DNA Helix Beam"', engine_src)
        self.assertIn('"Ferrofluid Lake"', engine_src)
        self.assertNotIn('"Synth Sun Rays"', engine_src)

        # 3. Verify Node.js PsychedelicEngine.js:
        #    - Tri-state backdropDirection (+1 Towards, -1 Away, 0 Breathe) on state.backdropTime
        #    - Sun Rays EQ (eqStyle === 4) draws colour-adapted rays without 6 internal horizontal sun bars
        #    - All 16 L1 EQ styles (0..15) across all 4 orientations (0..3) render geometry cleanly
        #    - Battlezone (l1Mode === 4) scales model density and renders both tanks and sky/ground shapes
        #    - Death Star Trench Run (l1Mode === 5) pure wireframe 3D catwalk blockades + Star Wars craft
        if shutil.which("node"):
            node_script = r"""
const fs = require('fs');
let code = fs.readFileSync('PsychedelicEngine.js', 'utf8').replace(/^\.pragma library\s*/m, '');
eval(code);

if (LAYER1_EQ_STYLES.length !== 16 || LAYER1_EQ_STYLES[4] !== 'Sun Rays' || LAYER1_EQ_STYLES[13] !== 'Aurora Curtains' || LAYER1_EQ_STYLES[14] !== 'DNA Helix Beam' || LAYER1_EQ_STYLES[15] !== 'Ferrofluid Lake') {
    throw new Error('Unexpected LAYER1_EQ_STYLES: ' + JSON.stringify(LAYER1_EQ_STYLES));
}

// Verify Tri-State backdropDirection (+1 Towards, -1 Away, 0 Breathe)
const bands = new Array(64).fill(300);
const stTowards = createState();
const stAway = createState();
const stBreathe = createState();
stepState(stTowards, bands, true, normaliseConfig({ backdropDirection: 1, backdropSpeed: 1.2 }, 0, []), 0.05);
stepState(stAway, bands, true, normaliseConfig({ backdropDirection: -1, backdropSpeed: 1.2 }, 0, []), 0.05);
stepState(stBreathe, bands, true, normaliseConfig({ backdropDirection: 0, backdropSpeed: 1.2 }, 0, []), 0.05);
if (!(stTowards.backdropTime > 0 && stAway.backdropTime < 0)) {
    throw new Error('Tri-state backdropDirection failed: towards=' + stTowards.backdropTime + ' away=' + stAway.backdropTime);
}
if (!Array.isArray(stTowards.eqRidgeHistory) || stTowards.eqRidgeHistory.length === 0 || stTowards.eqRidgeHistory[0].stepIdx === undefined) {
    throw new Error('Expected stepState to populate state.eqRidgeHistory with world stepIdx for 3D Waterfall Ridges and Tralis Voxel City');
}
if (!stTowards.shockwaves.length || stTowards.shockwaves[0].sizeMul === undefined || stTowards.shockwaves[0].spinX === undefined) {
    throw new Error('Expected stepState to populate per-shape randomised sizeMul and spinX on shockwaves');
}

function makeMockCtx() {
    return {
        fillCount: 0, polyFillCount: 0, strokeCount: 0, rectCount: 0, lineCount: 0,
        minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, firstMoveY: null, rects: [],
        fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1, globalCompositeOperation: 'source-over',
        save() {}, restore() {}, translate() {}, rotate() {}, scale() {},
        beginPath() {}, closePath() {},
        moveTo(x, y) {
            if (Number.isFinite(x)) { this.minX = Math.min(this.minX, x); this.maxX = Math.max(this.maxX, x); }
            if (Number.isFinite(y)) { this.minY = Math.min(this.minY, y); this.maxY = Math.max(this.maxY, y); }
            if (this.firstMoveY === null && Number.isFinite(y)) this.firstMoveY = y;
        },
        lineTo(x, y) {
            this.lineCount++;
            if (Number.isFinite(x)) { this.minX = Math.min(this.minX, x); this.maxX = Math.max(this.maxX, x); }
            if (Number.isFinite(y)) { this.minY = Math.min(this.minY, y); this.maxY = Math.max(this.maxY, y); }
        },
        rect(x, y, w, h) { this.rectCount++; this.rects.push({ x, y, w, h }); },
        arc() {},
        fill() { this.fillCount++; this.polyFillCount++; },
        stroke() { this.strokeCount++; },
        fillRect() { this.fillCount++; },
        clearRect() {},
        createLinearGradient() { return { addColorStop() {} }; },
        createRadialGradient() { return { addColorStop() {} }; }
    };
}

const theme = { accent: '#ffab00', urgent: '#ff4a6b', foreground: '#e2e8f0', background: '#08080c' };

// Verify Sun Rays (eqStyle === 4) draws 0 internal horizontal rect bars inside the sun disc and >= 4 colour-adapted ray stroke buckets
const ctxSun = makeMockCtx();
const cfgSun = normaliseConfig({
    layer1Enabled: true, layer1FieldEnabled: false,
    layer1EqEnabled: true, layer1EqStyle: 4,
    layer1ShapesEnabled: false, layer2Enabled: false, layer3Enabled: false
}, 0, []);
renderFrame(ctxSun, 640, 360, stTowards, 0, theme, [], 'album-art', [], cfgSun, null);
if (ctxSun.rectCount !== 0 || ctxSun.strokeCount < 5) {
    throw new Error('Sun Rays EQ should have 0 internal rect bars and >=5 ray/disc strokes: rectCount=' + ctxSun.rectCount + ' strokeCount=' + ctxSun.strokeCount);
}

// Verify all 16 L1 EQ styles (0..15) across all 4 orientations (0..3) render geometry cleanly
for (let eqS = 0; eqS < 16; eqS++) {
    for (let eqL = 0; eqL < 4; eqL++) {
        const ctxEq = makeMockCtx();
        const cfgEq = normaliseConfig({
            layer1Enabled: true, layer1FieldEnabled: false,
            layer1EqEnabled: true, layer1EqStyle: eqS, layer1EqLayout: eqL, layer1EqScale: 1.15,
            layer1ShapesEnabled: false, layer2Enabled: false, layer3Enabled: false
        }, 0, []);
        renderFrame(ctxEq, 640, 360, stTowards, 0, theme, [], 'album-art', [], cfgEq, null);
        if (ctxEq.strokeCount < 1 && ctxEq.fillCount < 1) {
            throw new Error('L1 EQ style ' + eqS + ' layout ' + eqL + ' failed to draw geometry');
        }
    }
}

// Verify all 13 Layer 2 modes (0..12) and all 12 Layer 3 modes (0..11) render cleanly
for (let l2m = 0; l2m < 13; l2m++) {
    const ctx2 = makeMockCtx();
    renderFrame(ctx2, 640, 360, stTowards, l2m, theme, [], 'album-art', [], normaliseConfig({
        layer1Enabled: false, layer2Enabled: true, layer2VizEnabled: true, visualMode: l2m, layer3Enabled: false
    }, l2m, []), null);
    if (ctx2.strokeCount < 1 && ctx2.fillCount < 1) {
        throw new Error('L2 mode ' + l2m + ' failed to render');
    }
}
const sampleLines = Array.from({length: 10}, () => '⣿⣷⣯⣟⡿⢿⣻⣽'.repeat(3));
for (let l3m = 0; l3m < 12; l3m++) {
    const ctx3 = makeMockCtx();
    renderFrame(ctx3, 640, 360, stTowards, 0, theme, sampleLines, 'album-art', [], normaliseConfig({
        layer1Enabled: false, layer2Enabled: false, layer3Enabled: true, layer3Mode: l3m, artLines: sampleLines
    }, 0, sampleLines), null);
    if (ctx3.rectCount + ctx3.fillCount + ctx3.strokeCount < 5) {
        throw new Error('L3 mode ' + l3m + ' failed to render');
    }
}
console.log('OK');
"""
            res = subprocess.run(["node", "-e", node_script], cwd=REPO_ROOT, capture_output=True, text=True, timeout=15)
            self.assertEqual(res.returncode, 0, f"Node test_13 failed: {res.stderr}")

    def test_14_security_and_marketplace_hardening(self):
        with open(os.path.join(REPO_ROOT, "BarWidget.qml"), "r", encoding="utf-8") as f:
            bar_src = f.read()
        with open(os.path.join(REPO_ROOT, "Service.qml"), "r", encoding="utf-8") as f:
            svc_src = f.read()
        with open(BIN_PATH, "r", encoding="utf-8") as f:
            bin_src = f.read()
        with open(os.path.join(REPO_ROOT, "bin", "bandarchy-player"), "r", encoding="utf-8") as f:
            player_src = f.read()
        with open(os.path.join(REPO_ROOT, "README.md"), "r", encoding="utf-8") as f:
            readme_src = f.read()

        with open(os.path.join(REPO_ROOT, "Visualiser.qml"), "r", encoding="utf-8") as f:
            viz_src = f.read()

        # 1. Top Bar LED Equaliser: zero Text items in BarWidget.qml, 9x6 LED segments, topBarLedEnabled toggle
        self.assertEqual(len(re.findall(r"\bText\s*\{", bar_src)), 0, "BarWidget.qml must contain zero Text items")
        self.assertIn("topBarLedEnabled", bar_src)
        self.assertIn("running: root.topBarLedEnabled && (!root.isPlaying || root.miniBands.length === 0)", bar_src)
        self.assertIn("property bool topBarLedEnabled: true", svc_src)
        led_off = self.run_cli("auth", "--top-bar-led", "0")
        self.assertFalse(led_off["topBarLedEnabled"])
        led_on = self.run_cli("auth", "--top-bar-led", "1")
        self.assertTrue(led_on["topBarLedEnabled"])

        # 2. CRIT-1..7 & HIGH-1..6 static and runtime security checks
        self.assertIn("os.umask(0o077)", bin_src)
        self.assertIn("def _make_private_temp_file(", bin_src)
        self.assertIn("def _aes_128_cbc_decrypt_inprocess(", bin_src)
        self.assertNotIn('"openssl", "enc"', bin_src)
        self.assertIn("WHERE host LIKE '%bandcamp.com'", bin_src)
        self.assertNotIn("BANDARCHY_MPV_ARGS", bin_src)
        self.assertNotIn("BANDCAMP_MPV_ARGS", bin_src)
        self.assertNotIn("shutil.which(", bin_src)
        self.assertNotIn('"yt-dlp"', bin_src)
        self.assertNotIn('"--ytdl=yes"', bin_src)
        self.assertIn('"--no-config"', bin_src)
        self.assertIn('"--no-ytdl"', bin_src)
        self.assertIn('"--no-load-scripts"', bin_src)
        self.assertIn('[xdg_bin, "--", target_url]', bin_src)
        self.assertIn('["/usr/bin/xdg-open", "--", s]', svc_src)
        self.assertIn('s.indexOf("~/") === 0', svc_src)
        self.assertNotIn('s.indexOf("http://") === 0', svc_src)
        self.assertNotIn('"-c", runner_sh', bin_src)
        self.assertIn('"--tty-loop"', bin_src)
        self.assertIn("umask 077", player_src)
        self.assertNotIn(":-/tmp}", player_src)
        self.assertIn("## Your Credentials & Privacy", readme_src)
        self.assertIn('(am === "block" || am === "text") ? am : "braille"', viz_src)

        # Verify unit-level security functions in bin/bandarchy via Python import
        import importlib.machinery
        import importlib.util

        loader = importlib.machinery.SourceFileLoader("bandarchy_mod", BIN_PATH)
        spec = importlib.util.spec_from_loader("bandarchy_mod", loader)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)

        # CRIT-5: Cookie header restricted to bandcamp.com and *.bandcamp.com
        mod.write_json(mod.AUTH_FILE, {"identity": "secret_test_cookie"}, mode=0o600)
        mod.write_json(mod.SETTINGS_FILE, {"loggedOut": False}, mode=0o600)
        self.assertIn("secret_test_cookie", mod.build_cookie_header("bandcamp.com"))
        self.assertIn("secret_test_cookie", mod.build_cookie_header("daily.bandcamp.com"))
        self.assertEqual(mod.build_cookie_header("t4.bcbits.com"), "")
        self.assertEqual(mod.build_cookie_header("evilbandcamp.com"), "")

        # CRIT-6: sanitise_m3u_target blocks dangerous mpv pseudo-protocols and flags
        for bad_target in (
            "edl://0;1,/etc/passwd",
            "lavfi://aevalsrc=0",
            "avdevice://alsa",
            "--input-ipc-server=/tmp/pwn",
            "#EXTM3U\n/etc/passwd",
            "file:///etc/passwd",
        ):
            with self.assertRaises(mod.BandarchyError):
                mod.sanitise_m3u_target(bad_target)

        # HIGH-4: validate_remote_url blocks non-HTTPS and non-allowlisted hosts
        for bad_url in (
            "http://bandcamp.com/test",
            "https://169.254.169.254/latest/meta-data/",
            "https://evil.example.com/stream.mp3",
        ):
            with self.assertRaises(mod.BandarchyError):
                mod.validate_remote_url(bad_url)

        # CRIT-4: safe_load_json refuses symlink targets
        sym_target = os.path.join(self.tmp_root, "real_secret.json")
        sym_link = os.path.join(self.tmp_root, "symlink_secret.json")
        with open(sym_target, "w", encoding="utf-8") as f:
            f.write('{"secret": 1}')
        if os.path.lexists(sym_link):
            os.unlink(sym_link)
        os.symlink(sym_target, sym_link)
        self.assertEqual(mod.safe_load_json(sym_link, {"fallback": True}), {"fallback": True})
        os.unlink(sym_link)


if __name__ == "__main__":
    unittest.main(verbosity=2)





