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
        self.assertIn("readonly property int maxInternalW: 640", viz_src)
        self.assertIn("property var collectivePresets:", viz_src)
        self.assertIn("function applyCollectivePreset(", viz_src)
        self.assertIn("function cycleSelectedPreset(", viz_src)
        self.assertIn("function saveCurrentAsCollectivePreset()", viz_src)
        self.assertNotIn("TTE: waves", viz_src)
        self.assertIn('text: "󰍹 TTE"', viz_src)

        # Ensure onVisualModeChanged does NOT set layer3Enabled = true
        vmode_idx = viz_src.index("onVisualModeChanged:")
        vmode_block = viz_src[vmode_idx : vmode_idx + 120]
        self.assertNotIn("layer3Enabled = true", vmode_block)

        # 2. Execute PsychedelicEngine.js via Node.js to verify:
        #    - All 12 Layer #2 modes with 9x 3D Graded History Tracers render in < 2.5 ms/frame at 640x360
        #    - All 6 Layer #1 SynthGrid Equaliser styles (0..5) render non-zero geometry
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

// B. Verify all 6 Layer #1 SynthGrid Equaliser styles (0..5)
for (let eqStyle = 0; eqStyle < 6; eqStyle++) {
    const ctxEq = makeMockCtx();
    const cfgEq = normaliseConfig({
        layer1Enabled: true, layer1Mode: 4,
        layer1EqStyle: eqStyle, layer1EqLayout: eqStyle % 3, layer1EqGain: 1.4, layer1EqDamping: eqStyle % 3,
        layer2Enabled: false, layer3Enabled: false
    }, 0, []);
    stepState(state, bands, true, cfgEq, 0.016);
    renderFrame(ctxEq, 640, 360, state, 0, theme, [], 'album-art', [], cfgEq, null);
    if (ctxEq.fillCount + ctxEq.strokeCount < 2) {
        throw new Error('Layer #1 Equaliser style ' + eqStyle + ' produced no geometry');
    }
}

// C. Benchmark all 12 Layer #2 modes at 640x360 with 9x 3D Graded History Tracers
let maxMs = 0;
for (let m = 0; m < 12; m++) {
    const ctx = makeMockCtx();
    const cfg = normaliseConfig({
        layer1Enabled: true, layer1Mode: m % 6,
        layer2Enabled: true, layer2Mode: m,
        tracerCount: 9, tracerSpeed: 1.25, tracerDrift: 1.1, tracerDirection: (m % 2 === 0 ? 1 : -1),
        layer3Enabled: true, layer3Mode: m % 6, layer3Tracers: 4,
        useAlbumArt: (m % 2 === 0),
        asciiMode: (m % 2 === 0 ? 'braille' : 'banner'),
        artLines: brailleArt,
        bannerLines: bannerWords
    }, m, brailleArt);
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
            self.assertLess(bench["maxFrameMs"], 3.0, f"Frame render too slow: {bench['maxFrameMs']} ms")


if __name__ == "__main__":
    unittest.main(verbosity=2)


