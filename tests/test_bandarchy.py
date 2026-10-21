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
        cls.cfg_dir = os.path.join(cls.tmp_root, ".config", "bandarchy")
        cls.data_dir = os.path.join(cls.tmp_root, ".local", "share", "bandarchy")
        cls.cache_dir = os.path.join(cls.tmp_root, ".cache", "bandarchy")
        cls.run_dir = os.path.join(cls.tmp_root, "run")
        cls.mpv_sock = os.path.join(cls.run_dir, "bandarchy", "bandarchy.sock")
        os.makedirs(cls.run_dir, mode=0o700, exist_ok=True)
        os.makedirs(cls.cfg_dir, mode=0o700, exist_ok=True)
        os.makedirs(cls.data_dir, mode=0o700, exist_ok=True)
        os.makedirs(cls.cache_dir, mode=0o700, exist_ok=True)

        cls._orig_env = {
            k: os.environ.get(k)
            for k in (
                "HOME",
                "XDG_CONFIG_HOME",
                "XDG_CACHE_HOME",
                "XDG_DATA_HOME",
                "XDG_RUNTIME_DIR",
                "BANDARCHY_CONFIG_DIR",
                "BANDARCHY_DATA_DIR",
                "BANDARCHY_CACHE_DIR",
                "BANDARCHY_MPV_SOCKET",
            )
        }
        orig_rt = cls._orig_env.get("XDG_RUNTIME_DIR")
        if orig_rt and os.path.isdir(orig_rt):
            try:
                for entry in os.listdir(orig_rt):
                    if entry.startswith("wayland-"):
                        src_sock = os.path.join(orig_rt, entry)
                        dst_sock = os.path.join(cls.run_dir, entry)
                        if not os.path.exists(dst_sock):
                            os.symlink(src_sock, dst_sock)
            except OSError:
                pass
        cls.env = os.environ.copy()
        cls.env["HOME"] = cls.tmp_root
        cls.env["XDG_CONFIG_HOME"] = os.path.join(cls.tmp_root, ".config")
        cls.env["XDG_CACHE_HOME"] = os.path.join(cls.tmp_root, ".cache")
        cls.env["XDG_DATA_HOME"] = os.path.join(cls.tmp_root, ".local", "share")
        cls.env["XDG_RUNTIME_DIR"] = cls.run_dir
        cls.env["BANDARCHY_CONFIG_DIR"] = cls.cfg_dir
        cls.env["BANDARCHY_DATA_DIR"] = cls.data_dir
        cls.env["BANDARCHY_CACHE_DIR"] = cls.cache_dir
        cls.env["BANDARCHY_MPV_SOCKET"] = cls.mpv_sock
        for k in (
            "HOME",
            "XDG_CONFIG_HOME",
            "XDG_CACHE_HOME",
            "XDG_DATA_HOME",
            "XDG_RUNTIME_DIR",
            "BANDARCHY_CONFIG_DIR",
            "BANDARCHY_DATA_DIR",
            "BANDARCHY_CACHE_DIR",
            "BANDARCHY_MPV_SOCKET",
        ):
            os.environ[k] = cls.env[k]

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
        for k, v in getattr(cls, "_orig_env", {}).items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v
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
                time.sleep(2.8)
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
        step_body = engine_src[step_idx : step_idx + 4000]
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
        self.assertIn("visible: root.showHud && root.showBottomHud", viz_src)
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
if (LAYER1_MODES.length !== 12) throw new Error('Expected 12 LAYER1_MODES, got ' + LAYER1_MODES.length);
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

// Verify all 12 L1 Field modes (0..11) render geometry
const theme = { accent: '#ffab00', urgent: '#ff4a6b', foreground: '#e2e8f0', background: '#08080c' };
for (let l1m = 0; l1m < 12; l1m++) {
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
        self.assertIn("running: root.activelyPlaying || root.visualiserActive || root.fullscreenVisualiserOpen", svc_src)
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
        self.assertIn('label: "󰍹 Visuals"', app_src)
        self.assertIn('label: "󰍹 Visuals"', panel_src)
        self.assertNotIn("root.selectedSavedL4Index", viz_src)
        self.assertNotIn("root.layer4Intensity", viz_src)
        self.assertNotIn("root.requestActionFeedback(", viz_src)
        self.assertIn("function toggleAllRandomisations()", viz_src)
        self.assertIn("disableScreensaverInFullscreenOrVj", viz_src)
        self.assertIn("disableScreensaverInFullscreenOrVj", svc_src)

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
        self.assertIn('["/usr/bin/cava", "-p", root.cavaConfPath]', svc_src)
        self.assertIn('s.indexOf("~/") === 0', svc_src)
        self.assertNotIn('s.indexOf("http://") === 0', svc_src)
        self.assertNotIn('"-c", runner_sh', bin_src)
        self.assertIn('"--tty-loop"', bin_src)
        self.assertIn("umask 077", player_src)
        self.assertNotIn(":-/tmp}", player_src)
        self.assertIn('ln -snf "${QS_BIN}" "${RUNTIME_DIR}/bandarchy"', player_src)
        self.assertIn("## Your Credentials & Privacy", readme_src)
        self.assertIn('(am === "block" || am === "text") ? am : "braille"', viz_src)
        self.assertIn("turntableRpm: root.turntableRpm", viz_src)
        self.assertIn("turntableStyle: root.turntableStyle", viz_src)

        # Verify unit-level security functions in bin/bandarchy via isolated Python import
        import importlib.machinery
        import importlib.util

        os.environ["HOME"] = self.tmp_root
        os.environ["BANDARCHY_CONFIG_DIR"] = self.cfg_dir
        os.environ["BANDARCHY_DATA_DIR"] = self.data_dir
        os.environ["BANDARCHY_CACHE_DIR"] = self.cache_dir
        os.environ["BANDARCHY_MPV_SOCKET"] = self.mpv_sock

        loader = importlib.machinery.SourceFileLoader("bandarchy_mod", BIN_PATH)
        spec = importlib.util.spec_from_loader("bandarchy_mod", loader)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)

        self.assertTrue(mod.AUTH_FILE.startswith(self.tmp_root))
        self.assertTrue(mod.SETTINGS_FILE.startswith(self.tmp_root))

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

        # CRIT-4 & HIGH-2: safe_load_json / safe_read_bytes refuses symlinks & user hardlinks, allows root system files
        sym_target = os.path.join(self.tmp_root, "real_secret.json")
        sym_link = os.path.join(self.tmp_root, "symlink_secret.json")
        hard_link = os.path.join(self.tmp_root, "hardlink_secret.json")
        with open(sym_target, "w", encoding="utf-8") as f:
            f.write('{"secret": 1}')
        if os.path.lexists(sym_link):
            os.unlink(sym_link)
        os.symlink(sym_target, sym_link)
        self.assertEqual(mod.safe_load_json(sym_link, {"fallback": True}), {"fallback": True})
        os.unlink(sym_link)

        if os.path.lexists(hard_link):
            os.unlink(hard_link)
        os.link(sym_target, hard_link)
        self.assertIsNone(mod.safe_read_bytes(hard_link))
        # MEDIUM-NEW-3: take_lock refuses hardlinked files without truncating them
        self.assertIsNone(mod.take_lock(hard_link))
        with open(sym_target, "r", encoding="utf-8") as f:
            self.assertEqual(f.read(), '{"secret": 1}')
        os.unlink(hard_link)

        # Root-owned system file is readable via safe_read_bytes
        if os.path.isfile("/usr/share/omarchy/logo.txt"):
            self.assertIsNotNone(mod.safe_read_text("/usr/share/omarchy/logo.txt"))
        elif os.path.isfile("/etc/os-release") and not os.path.islink("/etc/os-release"):
            self.assertIsNotNone(mod.safe_read_text("/etc/os-release"))

        # HIGH-1: http_request and download_file enforce max_bytes and clean up temp file on overflow
        with self.assertRaises(ValueError):
            mod.http_request(f"{self.api_base}/stream/track1.wav", max_bytes=64)
        dl_dest = os.path.join(self.tmp_root, "overflow_test.bin")
        with self.assertRaises(mod.BandarchyError):
            mod.download_file(f"{self.api_base}/stream/track1.wav", dl_dest, max_bytes=64)
        self.assertFalse(os.path.exists(dl_dest))

        # HIGH-2: probe_image_dimensions and is_valid_media_file use safe_read_bytes
        self.assertEqual(mod.probe_image_dimensions(self.cover_path), (128, 128))
        self.assertTrue(mod.is_valid_media_file(self.cover_path))

        # HIGH-3: safe_extract_zip refuses symlinked zip_path and preserves multi-disc duplicate basenames
        real_zip = os.path.join(self.tmp_root, "valid_test.zip")
        sym_zip = os.path.join(self.tmp_root, "symlink_test.zip")
        with zipfile.ZipFile(real_zip, "w") as zf:
            zf.writestr("CD1/01.wav", b"RIFF0001WAVE")
            zf.writestr("CD2/01.wav", b"RIFF0002WAVE")
        if os.path.lexists(sym_zip):
            os.unlink(sym_zip)
        os.symlink(real_zip, sym_zip)
        with self.assertRaises(mod.BandarchyError):
            mod.safe_extract_zip(sym_zip, os.path.join(self.tmp_root, "zip_out"))
        os.unlink(sym_zip)
        extracted_multi = mod.safe_extract_zip(real_zip, os.path.join(self.tmp_root, "zip_multi_out"))
        self.assertEqual(len(extracted_multi), 2)

    def test_15_statements_editor_keys_1_to_6_and_random_layer_pins(self):
        # 1. CLI statements persistence (--save-statements, --reset-statements, and saveStatements in --set)
        saved_res = self.run_cli(
            "visualiser-config",
            "--save-statements",
            json.dumps(["  # comment ignored ", "", "ACID CATHEDRAL", "SUBWOOFER MEDITATION\nCYBERNETIC PULSE"]),
        )
        self.assertEqual(saved_res["status"], "ok")
        self.assertEqual(saved_res["statements"], ["ACID CATHEDRAL", "SUBWOOFER MEDITATION", "CYBERNETIC PULSE"])

        get_res = self.run_cli("visualiser-config", "--get")
        self.assertEqual(get_res["statements"], ["ACID CATHEDRAL", "SUBWOOFER MEDITATION", "CYBERNETIC PULSE"])

        # Empty input falls back to default collection rather than leaving 0 statements
        empty_res = self.run_cli("visualiser-config", "--save-statements", "   \n# only comment\n")
        self.assertGreaterEqual(len(empty_res["statements"]), 10)

        # Reset restores default collection from share/statements.txt
        reset_res = self.run_cli("visualiser-config", "--reset-statements")
        self.assertGreaterEqual(len(reset_res["statements"]), 20)
        self.assertIn("WE ARE THE FREQUENCIES", reset_res["statements"])

        # 2. Verify Built-in Statements Editor, Keys 1-6 Layer Toggles, and Full Random Layer Pinning in QML
        with open(os.path.join(REPO_ROOT, "Visualiser.qml"), "r", encoding="utf-8") as f:
            viz_src = f.read()
        with open(os.path.join(REPO_ROOT, "Service.qml"), "r", encoding="utf-8") as f:
            svc_src = f.read()
        with open(os.path.join(REPO_ROOT, "App.qml"), "r", encoding="utf-8") as f:
            app_src = f.read()
        with open(os.path.join(REPO_ROOT, "Panel.qml"), "r", encoding="utf-8") as f:
            panel_src = f.read()

        for expected in (
            "property bool showStatementsEditor: false",
            "property bool statementsEditorBulkMode: false",
            "signal requestSaveStatements(",
            "signal requestResetStatements()",
            "function submitSingleStatementInput(",
            "function deleteStatementAt(",
            "function saveBulkStatementsText()",
            "function resetStatementsToDefaults()",
            "function toggleVisualiserLayerByNumber(",
            "function resetUserLayerPins()",
            "property bool layer1PinnedByUser: false",
            "property bool layer6PinnedByUser: false",
            "if (root.layer1PinnedByUser && !root.layer1FieldEnabled)",
            "if (root.layer2PinnedByUser && !root.layer1EqEnabled)",
            "if (root.layer3PinnedByUser && !root.layer1ShapesEnabled)",
            "if (root.layer4PinnedByUser && (!root.layer2Enabled || !root.layer2VizEnabled))",
            "if (root.layer5PinnedByUser && !root.layer4Enabled)",
            "if (root.layer6PinnedByUser && !root.layer3Enabled)",
            "property real layer1EqSpin: 1.0",
            'label: "3D Spin & Rotation"',
            '"Spin:" + root.layer1EqSpin.toFixed(1) + "x"',
            'text: "↻ Forward"',
            'text: "↺ Reverse"',
            'text: "⏸ Static (0x)"',
            "id: statementsEditorBox",
            "id: statementSingleInput",
            "id: statementBulkEdit",
        ):
            self.assertIn(expected, viz_src, f"Missing {expected} in Visualiser.qml")

        for k in range(1, 7):
            self.assertIn(f"toggleVisualiserLayerByNumber({k})", viz_src)
            self.assertIn(f"toggleVisualiserLayerByNumber({k})", app_src)
            self.assertIn(f"toggleVisualiserLayerByNumber({k})", panel_src)

        self.assertIn("function saveStatements(", svc_src)
        self.assertIn("function resetStatementsFile()", svc_src)

        # 3. Verify PsychedelicEngine.js eqSpinTime accumulator and layer1EqSpin (-2.5..2.5)
        if shutil.which("node"):
            node_script = r"""
const fs = require('fs');
let code = fs.readFileSync('PsychedelicEngine.js', 'utf8').replace(/^\.pragma library\s*/m, '');
eval(code);

const bands = new Array(64).fill(320);
const stFwd = createState();
const stRev = createState();
const stZero = createState();
stepState(stFwd, bands, true, normaliseConfig({ layer1EqSpin: 1.8 }, 0, []), 0.05);
stepState(stRev, bands, true, normaliseConfig({ layer1EqSpin: -1.8 }, 0, []), 0.05);
stepState(stZero, bands, true, normaliseConfig({ layer1EqSpin: 0.0 }, 0, []), 0.05);
if (!(stFwd.eqSpinTime > 0 && stRev.eqSpinTime < 0 && Math.abs(stZero.eqSpinTime) < 1e-9)) {
    throw new Error('eqSpinTime failed: fwd=' + stFwd.eqSpinTime + ' rev=' + stRev.eqSpinTime + ' zero=' + stZero.eqSpinTime);
}
const cfgClampedHigh = normaliseConfig({ layer1EqSpin: 9.0 }, 0, []);
const cfgClampedLow = normaliseConfig({ layer1EqSpin: -9.0 }, 0, []);
if (cfgClampedHigh.layer1EqSpin !== 2.5 || cfgClampedLow.layer1EqSpin !== -2.5) {
    throw new Error('layer1EqSpin clamping failed: high=' + cfgClampedHigh.layer1EqSpin + ' low=' + cfgClampedLow.layer1EqSpin);
}
console.log('OK');
"""
            res = subprocess.run(["node", "-e", node_script], cwd=REPO_ROOT, capture_output=True, text=True, timeout=10)
            self.assertEqual(res.returncode, 0, f"Node layer1EqSpin test failed: {res.stderr}")

        # 4. Verify playback resume from saved track & position when mpv is stopped / restarted
        local_coll = self.run_cli("collection", "--scope", "local")
        target_alb = local_coll["albums"][0]
        play_res = self.run_cli("play", "--album", target_alb["id"], "--track-index", "1")
        self.assertTrue(play_res["playing"])
        self.assertEqual(play_res["trackIndex"], 1)
        expected_track_id = play_res["track"]["id"]

        time.sleep(0.35)
        self.run_cli("cmd", "seek", "--value", "0.75")
        time.sleep(0.15)

        # Stop mpv (simulating app restart / kill saving playback resume state)
        self.run_cli("cmd", "stop")

        stopped_status = self.run_cli("status")
        self.assertFalse(stopped_status["playback"]["playing"])
        self.assertTrue(stopped_status["playback"]["resumable"])
        self.assertEqual(stopped_status["playback"]["trackId"], expected_track_id)
        self.assertEqual(stopped_status["playback"]["playlistPos"], 1)
        self.assertGreaterEqual(stopped_status["playback"]["position"], 0.4)

        # Seeking while stopped updates the saved resume position
        self.run_cli("cmd", "seek", "--value", "0.55")
        seeked_status = self.run_cli("status")
        self.assertAlmostEqual(seeked_status["playback"]["position"], 0.55, places=1)

        # Pressing Play/Pause (`cmd play-pause`) while mpv is stopped automatically relaunches mpv at the saved track & position
        resume_res = self.run_cli("cmd", "play-pause")
        self.assertTrue(resume_res.get("resumed"))
        self.assertTrue(resume_res.get("playing"))
        self.assertEqual(resume_res.get("trackIndex"), 1)
        self.assertEqual(resume_res["track"]["id"], expected_track_id)
        self.assertAlmostEqual(resume_res.get("position", 0.0), 0.55, places=1)

        live_now = self.run_cli("now")
        self.assertTrue(live_now["playing"])
        self.assertEqual(live_now["trackId"], expected_track_id)
        self.assertGreaterEqual(live_now["position"], 0.45)

        # Let the last track of the album play through to natural completion (EOF),
        # then verify that `cmd play-pause` restarts the album from Track 1 (index 0, 0.0s)
        self.run_cli("cmd", "seek", "--value", "1.35")
        time.sleep(0.45)
        replay_res = self.run_cli("cmd", "play-pause")
        self.assertTrue(replay_res.get("resumed"))
        self.assertTrue(replay_res.get("playing"))
        self.assertEqual(replay_res.get("trackIndex"), 0)
        self.assertLessEqual(replay_res.get("position", 0.0), 0.35)

        self.run_cli("cmd", "stop")

    def test_16_layer6_braille_block_no_text_and_l1_photo_tools_studio(self):
        # 1. Verify .gitignore excludes all custom/ photo folders and processed photo outputs
        with open(os.path.join(REPO_ROOT, ".gitignore"), "r", encoding="utf-8") as f:
            gitignore_src = f.read()
        for pat in ("custom/", "**/custom/", "**/custom/**", "categories/", "processed/", "photo_manifest.json"):
            self.assertIn(pat, gitignore_src, f"Missing {pat} in .gitignore")

        # 2. Verify dedicated L1 Photo-Tools Studio section and keybindings in Visualiser.qml, App.qml, Panel.qml, Service.qml
        with open(os.path.join(REPO_ROOT, "Visualiser.qml"), "r", encoding="utf-8") as f:
            viz_src = f.read()
        with open(os.path.join(REPO_ROOT, "Service.qml"), "r", encoding="utf-8") as f:
            svc_src = f.read()
        with open(os.path.join(REPO_ROOT, "App.qml"), "r", encoding="utf-8") as f:
            app_src = f.read()
        with open(os.path.join(REPO_ROOT, "Panel.qml"), "r", encoding="utf-8") as f:
            panel_src = f.read()

        for expected in (
            'import "PhotoMotionEngine.js" as PhotoMotion',
            '"12:StarkPhoto"',
            "id: l1PhotoToolsSection",
            "󰄀 L1 PHOTO-TOOLS STUDIO — 12. STARK PHOTO REALM",
            "function stepPhotoHistoryByKey(",
            "function stepPhotoCategoryByKey(",
            "function triggerPhotoHoldByKey()",
            "function renderPhotoStageToCanvas(",
            "Qt.Key_BraceLeft",
            "Qt.Key_BraceRight",
            "Qt.Key_BracketLeft",
            "Qt.Key_BracketRight",
            "signal requestPhotoImport(",
            "signal requestPhotoRefreshStatus()",
            "signal requestPhotoPick(",
        ):
            self.assertIn(expected, viz_src, f"Missing {expected} in Visualiser.qml")

        # Verify l1PhotoToolsSection is placed inside Tab 1 (activeConfigLayer === 1) before Tab 2 (activeConfigLayer === 2)
        tab1_idx = viz_src.index("visible: root.activeConfigLayer === 1")
        photo_sec_idx = viz_src.index("id: l1PhotoToolsSection")
        tab2_idx = viz_src.index("visible: root.activeConfigLayer === 2")
        self.assertTrue(tab1_idx < photo_sec_idx < tab2_idx, "l1PhotoToolsSection must be inside Tab 1 (L1 Studio controls)")

        for expected_svc in (
            "function refreshPhotoStatus()",
            "function importPhotos(",
            "function pickPhoto(",
            "property var photoActiveVariants:",
        ):
            self.assertIn(expected_svc, svc_src, f"Missing {expected_svc} in Service.qml")

        for name, src in (("App.qml", app_src), ("Panel.qml", panel_src)):
            self.assertIn("onRequestPhotoImport:", src, f"{name} must bind onRequestPhotoImport")
            self.assertIn("onRequestPhotoRefreshStatus:", src, f"{name} must bind onRequestPhotoRefreshStatus")
            self.assertIn("onRequestPhotoPick:", src, f"{name} must bind onRequestPhotoPick")
            self.assertIn("photoSameEffectPeers:", src, f"{name} must bind photoSameEffectPeers")
            self.assertIn("photoSameEffectByVariant:", src, f"{name} must bind photoSameEffectByVariant")
            self.assertIn("photoRandomPoolPeers:", src, f"{name} must bind photoRandomPoolPeers")
            self.assertIn('event.text === "{"', src, f"{name} must check event.text for '{{'")
            self.assertIn('event.text === "}"', src, f"{name} must check event.text for '}}'")
            self.assertIn('event.text === "["', src, f"{name} must check event.text for '['")
            self.assertIn('event.text === "]"', src, f"{name} must check event.text for ']'")
            self.assertIn('event.text === "\'"', src, f"{name} must check event.text for '\\''")
            self.assertIn('event.text === "#"', src, f"{name} must check event.text for '#'")
            self.assertIn('event.text === ":"', src, f"{name} must check event.text for ':'")
            self.assertIn('event.text === ";"', src, f"{name} must check event.text for ';'")
            self.assertIn('event.text === "~"', src, f"{name} must check event.text for '~'")

        self.assertIn("win.visualiserMaximised || appVisualiser.stageMode === \"visualiser\"", app_src)
        self.assertIn("function ensurePhotoLayerActive()", viz_src)
        self.assertIn("property bool photoAutoMotionEvents:", viz_src)
        self.assertIn("function triggerRandomPhotoMotionEvent()", viz_src)
        self.assertIn("id: photoCategoryDropdownButton", viz_src)
        self.assertIn("id: photoCategoryDropdownMenu", viz_src)
        self.assertIn("property bool showPhotoCategoryDropdown:", viz_src)
        self.assertIn("PhotoMotion.formatPhotoCategoryLabel(", viz_src)
        self.assertIn("Import Photos (Scan All Folders)", viz_src)
        self.assertIn('"characters"', viz_src)
        self.assertIn('"characters"', svc_src)

        # 3. Verify CLI photo-status, photo-import (into custom/ and arbitrary new folders), and photo-pick subcommands
        st_res = self.run_cli("photo-status", "--init-dirs")
        self.assertTrue(st_res["ok"])
        self.assertIn("custom", st_res["categories"])
        self.assertIn("characters", st_res["categories"])

        # Create a synthetic test image in a temp folder and import it into custom/
        from PIL import Image
        custom_src_dir = os.path.join(self.tmp_root, "user_custom_photos")
        os.makedirs(custom_src_dir, exist_ok=True)
        test_img_path = os.path.join(custom_src_dir, "neon_band_portrait.png")
        img = Image.new("RGB", (96, 64), (18, 20, 26))
        for y in range(16, 48):
            for x in range(24, 72):
                img.putpixel((x, y), (240, 45, 160) if (x + y) % 3 == 0 else (235, 240, 250))
        img.save(test_img_path)

        # Also create a brand-new non-standard source folder directly inside the library root (`my_new_set/`)
        # to verify that a full library import (`photo-import`) discovers it, creates `processed/my_new_set/`,
        # processes its image into 16 variants, and exposes `my_new_set` ("My New Set") in `discoveredCategories`.
        pics_bandarchy_root = st_res["root_dir"]
        new_folder_dir = os.path.join(pics_bandarchy_root, "my_new_set")
        os.makedirs(new_folder_dir, exist_ok=True)
        new_folder_img = os.path.join(new_folder_dir, "dynamic_set_sample.png")
        img2 = Image.new("RGB", (96, 64), (12, 30, 42))
        for y in range(10, 54):
            for x in range(18, 78):
                img2.putpixel((x, y), (56, 189, 248) if (x + y) % 2 == 0 else (250, 204, 21))
        img2.save(new_folder_img)

        imp_res = self.run_cli("photo-import", custom_src_dir, "--max-size", "96")
        self.assertTrue(imp_res["ok"])
        self.assertGreaterEqual(imp_res["totalProcessed"], 34)
        self.assertEqual(len(imp_res["activeVariants"]), 17)
        self.assertIn("17_Original_Accessible_Compressed", imp_res["activeVariants"])
        self.assertIn("my_new_set", imp_res["discoveredCategories"])
        self.assertEqual(imp_res["categoryLabels"].get("my_new_set"), "My New Set")

        pick_res = self.run_cli("photo-pick", "--category", "custom")
        self.assertTrue(pick_res["ok"])
        self.assertEqual(pick_res["category"], "custom")
        self.assertEqual(len(pick_res["variants"]), 17)
        self.assertIn("17_Original_Accessible_Compressed", pick_res["variants"])
        self.assertIn("sameEffectPeers", pick_res)
        self.assertIn("sameEffectByVariant", pick_res)
        self.assertIn("randomPoolPeers", pick_res)

        pick_dyn = self.run_cli("photo-pick", "--category", "my_new_set")
        self.assertTrue(pick_dyn["ok"])
        self.assertEqual(pick_dyn["category"], "my_new_set")
        self.assertEqual(pick_dyn["sourceStem"], "dynamic_set_sample")
        self.assertEqual(len(pick_dyn["variants"]), 17)

        # Verify moving processed PNG variants from processed/custom/ into a newly created processed/hitler/
        # subfolder discovers 'hitler' ("Hitler") and does NOT re-create them in processed/custom/ on re-import
        proc_custom_dir = os.path.join(pics_bandarchy_root, "processed", "custom")
        proc_hitler_dir = os.path.join(pics_bandarchy_root, "processed", "hitler")
        os.makedirs(proc_hitler_dir, exist_ok=True)
        for fn in list(os.listdir(proc_custom_dir)):
            if fn.endswith(".png"):
                shutil.move(os.path.join(proc_custom_dir, fn), os.path.join(proc_hitler_dir, fn))
        reimp_res = self.run_cli("photo-import", "--max-size", "96")
        self.assertTrue(reimp_res["ok"])
        self.assertIn("hitler", reimp_res["discoveredCategories"])
        self.assertEqual(reimp_res["categoryLabels"].get("hitler"), "Hitler")
        self.assertEqual(reimp_res["categoryCounts"].get("hitler"), 1)
        self.assertEqual(reimp_res["categoryCounts"].get("custom"), 0)
        self.assertEqual([f for f in os.listdir(proc_custom_dir) if f.endswith(".png")], [])

        # 4. Verify in Node.js:
        #    (a) Layer 6 (`drawLayer3AlbumArt`) NEVER calls fillText or strokeText when using Art, Braille, or Block
        #        (even if asciiMode='text' with useAlbumArt=true or layer3ShowStatements=true)
        #    (b) PhotoMotionEngine.js has 25 modes (M01..M25), 16 Stage-1 effects, keybindings [, ], H (60s hold), {, },
        #        characters category, Auto Photo-Motion / Random Events, and renders all 25 modes cleanly in QQuickContext2D
        if shutil.which("node"):
            node_script = r"""
const fs = require('fs');
let engCode = fs.readFileSync('PsychedelicEngine.js', 'utf8').replace(/^\.pragma library\s*/m, '');
eval(engCode);

const state = createState();
const theme = { accent: '#6ee7b7', urgent: '#f472b6', foreground: '#e2e8f0', background: '#07090e' };
const brailleArt = Array.from({length: 12}, () => '⣿⣷⣯⣟⡿⢿⣻⣽'.repeat(4));
const bannerWords = Array.from({length: 10}, () => '█▀▄░▒▓ STARK REALM ▓▒░▄▀█');

function makeStrictCtx() {
    return {
        rectCount: 0, fillCount: 0, fillRectCount: 0, strokeCount: 0, fillTextCount: 0, strokeTextCount: 0,
        drawImageCount: 0, clipCount: 0, transformCount: 0, destOutCount: 0,
        fillTextStyles: [], fillRectStyles: [],
        fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1, globalCompositeOperation: 'source-over',
        save() {}, restore() {}, translate() {}, rotate() {}, scale() {},
        transform() { this.transformCount++; },
        clip() { this.clipCount++; },
        beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, arc() {},
        rect() { this.rectCount++; },
        fill() { this.fillCount++; },
        stroke() { this.strokeCount++; },
        fillRect() { this.fillCount++; this.fillRectCount++; this.fillRectStyles.push(this.fillStyle); },
        clearRect() {},
        drawImage() { this.drawImageCount++; },
        fillText() {
            this.fillTextCount++;
            this.fillTextStyles.push(this.fillStyle);
            if (this.globalCompositeOperation === 'destination-out') this.destOutCount++;
        },
        strokeText() { this.strokeTextCount++; },
        createLinearGradient() { return { addColorStop() {} }; },
        createRadialGradient() { return { addColorStop() {} }; }
    };
}

// Test Art (with braille, block, and even accidental 'text'), and Words (with braille and block):
// NONE of these may ever call fillText or strokeText!
const pureCellCombos = [
    { useAlbumArt: true, asciiMode: 'braille', layer3ShowStatements: true },
    { useAlbumArt: true, asciiMode: 'block', layer3ShowStatements: true },
    { useAlbumArt: true, asciiMode: 'text', layer3ShowStatements: true },
    { useAlbumArt: false, asciiMode: 'braille', layer3ShowStatements: true },
    { useAlbumArt: false, asciiMode: 'block', layer3ShowStatements: true }
];

for (const combo of pureCellCombos) {
    for (let m = 0; m < LAYER3_MODES.length; m++) {
        const ctx = makeStrictCtx();
        const cfg = normaliseConfig({
            layer1Enabled: false, layer2Enabled: false, layer3Enabled: true,
            layer3Mode: m,
            useAlbumArt: combo.useAlbumArt,
            asciiMode: combo.asciiMode,
            layer3ShowStatements: combo.layer3ShowStatements,
            statementText: 'NO TEXT OVERLAY IN BRAILLE OR BLOCK',
            artLines: brailleArt,
            bannerLines: bannerWords
        }, 0, combo.useAlbumArt ? brailleArt : bannerWords);
        stepState(state, new Array(64).fill(420), true, cfg, 0.016);
        renderFrame(ctx, 640, 360, state, 0, theme, combo.useAlbumArt ? brailleArt : bannerWords, combo.useAlbumArt ? 'album-art' : 'banner', [], cfg, null);
        if (ctx.fillTextCount !== 0 || ctx.strokeTextCount !== 0) {
            throw new Error(`Forbidden text draw in combo=${JSON.stringify(combo)} mode=${m}: fillText=${ctx.fillTextCount} strokeText=${ctx.strokeTextCount}`);
        }
        if (ctx.rectCount < 5) {
            throw new Error(`Expected Braille/Block rect cells in combo=${JSON.stringify(combo)} mode=${m}, got rectCount=${ctx.rectCount}`);
        }
    }
}

// Now verify PhotoMotionEngine.js (25 modes, 16 variants, [, ], H, {, }, characters, dynamic formatPhotoCategoryLabel, Auto Photo-Motion)
let photoCode = fs.readFileSync('PhotoMotionEngine.js', 'utf8').replace(/^\.pragma library\s*/m, '');
const PhotoMotion = (new Function(photoCode + '; return { DEFAULT_PHOTO_CATEGORIES, PHOTO_CATEGORY_LABELS, formatPhotoCategoryLabel, PHOTO_MOTION_MODES, STAGE1_EFFECT_IDS, PHOTO_POOL_MODES, createPhotoMotionState, stepPhotoMotionState, renderPhotoMotionLayer, triggerPhotoHoldOneMinute, stepPhotoImageHistory, stepPhotoCategory, triggerRandomPhotoMotionEvent, drawTextured3DQuad, render3DPhotoCube, setActiveQuadShear, togglePhotoPlaneShear, cyclePhotoPoolMode, togglePhotoAutoMotionEvents, togglePhotoEffectAutoRandomise, togglePhotoRandomiseMotionControls, captureUserPhotoMotionSettings, restoreUserPhotoMotionSettings, randomiseMotionControlsForEvent, stepPhotoMotionMode, cyclePhotoMotionMode, selectPhotoMotionMode, resolvePoolVariantImagesMap, resolveMultiPhotoPool, rollSnapshotFocalSection, getVariantSectionOffset };'))();

if (PhotoMotion.PHOTO_MOTION_MODES.length !== 25) {
    throw new Error('Expected 25 PHOTO_MOTION_MODES, got ' + PhotoMotion.PHOTO_MOTION_MODES.length);
}
if (PhotoMotion.STAGE1_EFFECT_IDS.length !== 17) {
    throw new Error('Expected 17 STAGE1_EFFECT_IDS, got ' + PhotoMotion.STAGE1_EFFECT_IDS.length);
}
if (!PhotoMotion.DEFAULT_PHOTO_CATEGORIES.includes('characters') || PhotoMotion.PHOTO_CATEGORY_LABELS.characters !== 'Characters') {
    throw new Error('Expected characters category in DEFAULT_PHOTO_CATEGORIES and PHOTO_CATEGORY_LABELS');
}
if (PhotoMotion.formatPhotoCategoryLabel('my_new_set') !== 'My New Set' || PhotoMotion.formatPhotoCategoryLabel('hitler') !== 'Hitler') {
    throw new Error('Expected formatPhotoCategoryLabel to title-case arbitrary dynamic folder names');
}

const pState = PhotoMotion.createPhotoMotionState();
let pickSeq = 0;
const mockPicker = (cat) => ({ category: cat, sourceStem: 'stem_' + (++pickSeq), variantPaths: {} });

const snap0X = pState.snapshotFocalX;
const snap0Y = pState.snapshotFocalY;
if (Math.hypot(snap0X, snap0Y) < 0.35) {
    throw new Error('Initial snapshot focal section must be off-centre, got (' + snap0X + ', ' + snap0Y + ')');
}
const fwd1 = PhotoMotion.stepPhotoImageHistory(pState, 1, mockPicker);
const snap1X = pState.snapshotFocalX;
const snap1Y = pState.snapshotFocalY;
if (Math.hypot(snap1X, snap1Y) < 0.40 || (Math.abs(snap1X - snap0X) < 0.05 && Math.abs(snap1Y - snap0Y) < 0.05)) {
    throw new Error('Stepping photo snapshot must select a new off-centre section, got (' + snap1X + ', ' + snap1Y + ')');
}
const fwd2 = PhotoMotion.stepPhotoImageHistory(pState, 1, mockPicker);
if (Math.hypot(pState.snapshotFocalX, pState.snapshotFocalY) < 0.40 || (Math.abs(pState.snapshotFocalX - snap1X) < 0.05 && Math.abs(pState.snapshotFocalY - snap1Y) < 0.05)) {
    throw new Error('Second photo snapshot must select a distinct off-centre section');
}
const back1 = PhotoMotion.stepPhotoImageHistory(pState, -1, mockPicker);
if (back1.entry.sourceStem !== fwd1.entry.sourceStem) {
    throw new Error('History [ step backward mismatch');
}

const holdOn = PhotoMotion.triggerPhotoHoldOneMinute(pState, false);
if (!holdOn.holdActive || Math.abs(holdOn.holdRemainingSec - 60.0) > 0.01) {
    throw new Error('Expected 60s hold on H');
}
// Stepping photo releases 1-minute hold immediately
PhotoMotion.stepPhotoImageHistory(pState, 1, mockPicker);
if (pState.holdActive) {
    throw new Error('Stepping photo with ] must release 1-minute hold');
}

const catNext = PhotoMotion.stepPhotoCategory(pState, 1, mockPicker);
if (catNext.category !== 'brutalist') {
    throw new Error('Expected category brutalist on }, got ' + catNext.category);
}

// Verify Auto Photo-Motion / Random Events:
// 1. Pressing '/# when random events is active calls triggerRandomPhotoMotionEvent, which picks a new motionMode AND steps the image
const prevMode = pState.motionMode;
const prevStem = pState.currentSourceStem;
const randEv = PhotoMotion.triggerRandomPhotoMotionEvent(pState, mockPicker, () => 0.42);
if (pState.motionMode === prevMode || pState.currentSourceStem === prevStem) {
    throw new Error('triggerRandomPhotoMotionEvent must change motionMode and step to next photo');
}
// 2. When autoMotionEvents is enabled, it respects photoEffectChangeIntervalSec without being blocked by slow variantStrobePhase
pState.autoMotionEvents = true;
pState.photoEffectChangeIntervalSec = 4.0;
const modeBeforeCycle = pState.motionMode;
const stemBeforeCycle = pState.currentSourceStem;
const earlyStep = PhotoMotion.stepPhotoMotionState(pState, 0.1, { bass: 0.5, mid: 0.5, high: 0.5, beat: 0.5 }, mockPicker);
if (earlyStep.autoMotionEventTriggered || pState.motionMode !== modeBeforeCycle) {
    throw new Error('autoMotionEvents switched too early before photoEffectChangeIntervalSec');
}
pState.autoMotionElapsedSec = 4.05;
const fullPassStep = PhotoMotion.stepPhotoMotionState(pState, 0.1, { bass: 0.5, mid: 0.5, high: 0.5, beat: 0.5 }, mockPicker);
if (!fullPassStep.autoMotionEventTriggered || pState.motionMode === modeBeforeCycle || pState.currentSourceStem === stemBeforeCycle) {
    throw new Error('autoMotionEvents must switch motionMode and step photo once photoEffectChangeIntervalSec elapses');
}
// 2b. Verify 1.0s minimum interval works without being clamped to 3.0s or 4.0s
pState.photoEffectChangeIntervalSec = 1.0;
pState.autoMotionElapsedSec = 0.4;
const modeBefore1s = pState.motionMode;
const stepAt05s = PhotoMotion.stepPhotoMotionState(pState, 0.1, { bass: 0.5, mid: 0.5, high: 0.5, beat: 0.5 }, mockPicker);
if (stepAt05s.autoMotionEventTriggered || pState.motionMode !== modeBefore1s) {
    throw new Error('autoMotionEvents switched too early at 0.5s when photoEffectChangeIntervalSec=1.0');
}
pState.autoMotionElapsedSec = 0.95;
const stepAt105s = PhotoMotion.stepPhotoMotionState(pState, 0.1, { bass: 0.5, mid: 0.5, high: 0.5, beat: 0.5 }, mockPicker);
if (!stepAt105s.autoMotionEventTriggered || pState.motionMode === modeBefore1s) {
    throw new Error('autoMotionEvents must switch once 1.0s photoEffectChangeIntervalSec elapses');
}
pState.autoMotionEvents = false;

const mockVariants = {};
for (let vi = 0; vi < PhotoMotion.STAGE1_EFFECT_IDS.length; vi++) {
    mockVariants[PhotoMotion.STAGE1_EFFECT_IDS[vi]] = { width: 320, height: 240, id: vi };
}

// Step physics state so 3D rotation angles and flips are active
PhotoMotion.stepPhotoMotionState(pState, 0.1, { bass: 0.85, mid: 0.65, high: 0.75, beat: 0.9 }, mockPicker);

// Render all 25 Photo Motion modes through L1 Mode 11 callback
for (let pm = 0; pm < 25; pm++) {
    pState.motionMode = pm;
    const ctx = makeStrictCtx();
    const cfg = normaliseConfig({
        layer1Enabled: true, layer1FieldEnabled: true, layer1Mode: 11,
        layer1EqEnabled: false, layer1ShapesEnabled: false,
        layer2Enabled: false, layer3Enabled: false,
        photoMotionRenderCallback: function(c, w, h) {
            PhotoMotion.renderPhotoMotionLayer(c, w, h, pState, mockVariants, pm % 30, theme, { bass: 0.7, mid: 0.5, high: 0.6, beat: 0.8 });
            return true;
        }
    }, pm % 30, []);
    renderFrame(ctx, 640, 360, state, 0, theme, [], 'album-art', [], cfg, null);
    if (ctx.drawImageCount < 1) {
        throw new Error('PhotoMotion mode ' + pm + ' failed to draw photo image');
    }
    if (ctx.fillCount + ctx.strokeCount < 2) {
        throw new Error('PhotoMotion mode ' + pm + ' failed to draw geometry/strobe');
    }
    if (pm === 0 && (ctx.clipCount < 5 || ctx.transformCount < 5)) {
        throw new Error('M01 must render 3D textured quads + receding ghost planes via clip+transform, got clip=' + ctx.clipCount);
    }
    if (pm === 1 && (ctx.clipCount < 12 || ctx.transformCount < 12 || ctx.strokeCount < 13)) {
        throw new Error('M02 must render 6 outer + 6 inner 3D cube faces and 4D struts, got clip=' + ctx.clipCount + ' stroke=' + ctx.strokeCount);
    }
}

// Verify 3D cube front vs back face winding & passFilter ('front' vs 'back') with clean un-sheared default (3 quads = 3 drawImages) and sheared mode (6 triangles = 6 drawImages)
const ctxFront = makeStrictCtx();
const ctxBack = makeStrictCtx();
PhotoMotion.setActiveQuadShear(false, 0.0);
PhotoMotion.render3DPhotoCube(ctxFront, 320, 180, 90, 0.35, 0.45, 0.1, 450, mockVariants, mockVariants.V01_STARK_THRESHOLD, 0, 0.9, ['#ff0055', '#00ffcc'], 0.9, 0.15, 'front');
PhotoMotion.render3DPhotoCube(ctxBack, 320, 180, 90, 0.35, 0.45, 0.1, 450, mockVariants, mockVariants.V01_STARK_THRESHOLD, 0, 0.9, ['#ff0055', '#00ffcc'], 0.9, 0.15, 'back');
if (ctxFront.drawImageCount !== 3 || ctxBack.drawImageCount !== 3) {
    throw new Error('Expected 3 un-sheared front quads (3 drawImages) and 3 back quads (3 drawImages), got front=' + ctxFront.drawImageCount + ' back=' + ctxBack.drawImageCount);
}
const ctxShearFront = makeStrictCtx();
PhotoMotion.setActiveQuadShear(true, 0.85);
PhotoMotion.render3DPhotoCube(ctxShearFront, 320, 180, 90, 0.35, 0.45, 0.1, 450, mockVariants, mockVariants.V01_STARK_THRESHOLD, 0, 0.9, ['#ff0055', '#00ffcc'], 0.9, 0.15, 'front');
PhotoMotion.setActiveQuadShear(false, 0.0);
if (ctxShearFront.drawImageCount !== 6) {
    throw new Error('Expected 3 sheared front faces (6 triangle drawImages) when planeShearEnabled=true, got ' + ctxShearFront.drawImageCount);
}

// Verify ":" togglePhotoPlaneShear, ";" cyclePhotoPoolMode (3 modes), "~" togglePhotoEffectAutoRandomise, and image iteration on effect change
const ctrlState = PhotoMotion.createPhotoMotionState();
if (ctrlState.planeShearEnabled !== false || ctrlState.planeShearAmount !== 0.0 || ctrlState.poolMode !== 0 || ctrlState.effectAutoRandomise !== false) {
    throw new Error('Unexpected initial photo motion state defaults');
}
const shearOn = PhotoMotion.togglePhotoPlaneShear(ctrlState);
if (!shearOn.enabled || shearOn.amount <= 0) {
    throw new Error('togglePhotoPlaneShear should enable plane shear and assign a non-zero default amount');
}
const pool1 = PhotoMotion.cyclePhotoPoolMode(ctrlState, 1);
const pool2 = PhotoMotion.cyclePhotoPoolMode(ctrlState, 1);
const pool0 = PhotoMotion.cyclePhotoPoolMode(ctrlState, 1);
if (pool1.mode !== 1 || pool2.mode !== 2 || pool0.mode !== 0) {
    throw new Error('cyclePhotoPoolMode must cycle 0 -> 1 -> 2 -> 0');
}
const autoOn = PhotoMotion.togglePhotoEffectAutoRandomise(ctrlState);
if (!autoOn.enabled) {
    throw new Error('togglePhotoEffectAutoRandomise must enable dedicated photo effect randomiser');
}
let pickedOnEffectStep = 0;
PhotoMotion.cyclePhotoMotionMode(ctrlState, 1, (cat) => {
    pickedOnEffectStep++;
    return { category: cat, sourceStem: 'stepped_stem_' + pickedOnEffectStep, variantPaths: mockVariants };
});
if (pickedOnEffectStep !== 1 || ctrlState.currentSourceStem !== 'stepped_stem_1') {
    throw new Error('cyclePhotoMotionMode must iterate/randomise the main photograph within the active category');
}

// Verify Layer 6 (6: Typography) 21 LAYER3_TEXT_STYLES (all 16 original at 0..15 including #6 Acid Glitch IDM at index 5 + 5 added ASCII styles at 16..20)
if (LAYER3_TEXT_STYLES.length !== 21 ||
    SHORT_LAYER3_TEXT_STYLES.length !== 21 ||
    LAYER3_TEXT_STYLES[5] !== 'Acid Glitch IDM' ||
    LAYER3_TEXT_STYLES[16] !== 'ASCII Black Block / White Text' ||
    LAYER3_TEXT_STYLES[17] !== 'ASCII White Back / Black Text' ||
    LAYER3_TEXT_STYLES[18] !== 'ASCII Transparent Back / Text' ||
    LAYER3_TEXT_STYLES[19] !== 'ASCII Coloured Back / Transparent Text' ||
    LAYER3_TEXT_STYLES[20] !== 'ASCII Cell Matrix') {
    throw new Error('Expected 21 LAYER3_TEXT_STYLES (0..15 original + 16..20 5 ASCII variants)');
}
for (let st = 0; st < 21; st++) {
    for (let cm = 0; cm < 6; cm++) {
        const ctxTypo = makeStrictCtx();
        const cfgTypo = normaliseConfig({
            layer1Enabled: false, layer2Enabled: false, layer3Enabled: true,
            useAlbumArt: false, asciiMode: 'text', layer3Tracers: 1,
            layer3Mode: st % 12, layer3TextStyle: st, layer3ColourMode: cm,
            layer3ShowArtist: false, layer3ShowTrack: true, layer3ShowAlbum: false, layer3ShowStatements: false,
            trackTitle: 'BANDARCHY TEST'
        }, 0, []);
        const palTypo = buildPalette(theme, state.hueShift, cfgTypo.palette);
        drawLayer3AlbumArt(ctxTypo, 640, 360, state, palTypo, cfgTypo, [], []);
        if (st < 16) {
            if (ctxTypo.fillTextCount < 1) {
                throw new Error('Typography style ' + st + ' colourMode ' + cm + ' failed to render text');
            }
        } else {
            // Styles 16..20 are authentic Cool-Retro-Term 7-scanline-row horizontal phosphor bar cells (rendered via drawCrtScanlineCell fillRect bars, zero fillText)
            if (ctxTypo.fillTextCount !== 0 || ctxTypo.fillRectCount < 20) {
                throw new Error('CRT Scanline ASCII style ' + st + ' colourMode ' + cm + ' must render 7-row horizontal scanline phosphor bars via fillRect, got fillRect=' + ctxTypo.fillRectCount + ' fillText=' + ctxTypo.fillTextCount);
            }
        }
    }
}
// Verify shifting palette (paletteIndex > 0) shifts Style 16 & Style 17 CRT phosphor bar colours
const ctxS16Default = makeStrictCtx();
const ctxS16Shifted = makeStrictCtx();
const cfg16Def = normaliseConfig({
    layer1Enabled: false, layer2Enabled: false, layer3Enabled: true,
    useAlbumArt: false, asciiMode: 'text', palette: 0, layer3Tracers: 1,
    layer3Mode: 0, layer3TextStyle: 16, layer3ColourMode: 0,
    layer3ShowArtist: false, layer3ShowTrack: true, layer3ShowAlbum: false, trackTitle: 'CRT'
}, 0, []);
const cfg16Shf = normaliseConfig({
    layer1Enabled: false, layer2Enabled: false, layer3Enabled: true,
    useAlbumArt: false, asciiMode: 'text', palette: 3, layer3Tracers: 1,
    layer3Mode: 0, layer3TextStyle: 16, layer3ColourMode: 0,
    layer3ShowArtist: false, layer3ShowTrack: true, layer3ShowAlbum: false, trackTitle: 'CRT'
}, 3, []);
drawLayer3AlbumArt(ctxS16Default, 640, 360, state, buildPalette(theme, state.hueShift, 0), cfg16Def, [], []);
drawLayer3AlbumArt(ctxS16Shifted, 640, 360, state, buildPalette(theme, state.hueShift, 3), cfg16Shf, [], []);
if (ctxS16Default.fillRectStyles.join(',') === ctxS16Shifted.fillRectStyles.join(',')) {
    throw new Error('Style 16 must shift its CRT scanline phosphor bar colours when palette changes');
}
const ctxS17Default = makeStrictCtx();
const ctxS17Shifted = makeStrictCtx();
const cfg17Def = normaliseConfig({
    layer1Enabled: false, layer2Enabled: false, layer3Enabled: true,
    useAlbumArt: false, asciiMode: 'text', palette: 0, layer3Tracers: 1,
    layer3Mode: 0, layer3TextStyle: 17, layer3ColourMode: 0,
    layer3ShowArtist: false, layer3ShowTrack: true, layer3ShowAlbum: false, trackTitle: 'CRT'
}, 0, []);
const cfg17Shf = normaliseConfig({
    layer1Enabled: false, layer2Enabled: false, layer3Enabled: true,
    useAlbumArt: false, asciiMode: 'text', palette: 3, layer3Tracers: 1,
    layer3Mode: 0, layer3TextStyle: 17, layer3ColourMode: 0,
    layer3ShowArtist: false, layer3ShowTrack: true, layer3ShowAlbum: false, trackTitle: 'CRT'
}, 3, []);
drawLayer3AlbumArt(ctxS17Default, 640, 360, state, buildPalette(theme, state.hueShift, 0), cfg17Def, [], []);
drawLayer3AlbumArt(ctxS17Shifted, 640, 360, state, buildPalette(theme, state.hueShift, 3), cfg17Shf, [], []);
if (ctxS17Default.fillRectStyles.join(',') === ctxS17Shifted.fillRectStyles.join(',')) {
    throw new Error('Style 17 must shift its reverse-video CRT scanline phosphor bar colours when palette changes');
}


// Verify degenerate edge-on quad guard in drawTextured3DQuad does not call transform with singular matrix
const ctxDegenerate = makeStrictCtx();
const colPt = { x: 200, y: 150 };
PhotoMotion.drawTextured3DQuad(ctxDegenerate, mockVariants.V01_STARK_THRESHOLD, colPt, colPt, colPt, colPt, 0.9, '#ffffff', 2.0, null);
if (ctxDegenerate.transformCount !== 0) {
    throw new Error('Expected degenerate 0-area quad to skip singular ctx.transform, got ' + ctxDegenerate.transformCount);
}

// Verify asyncPending picker does not push duplicate stale stems onto historyStack
const asyncState = PhotoMotion.createPhotoMotionState();
PhotoMotion.stepPhotoImageHistory(asyncState, 1, () => ({ category: 'brutalist', sourceStem: 'photo_1', variantPaths: {} }));
PhotoMotion.stepPhotoImageHistory(asyncState, 1, () => ({ category: 'brutalist', sourceStem: 'photo_2', variantPaths: {} }));
const histLenBeforeAsync = asyncState.historyStack.length;
PhotoMotion.triggerRandomPhotoMotionEvent(asyncState, () => ({ category: 'brutalist', sourceStem: '', asyncPending: true }), () => 0.5);
if (asyncState.historyStack.length !== histLenBeforeAsync) {
    throw new Error('asyncPending pick must not push duplicate stale stem onto historyStack');
}

// Verify stepping backward with [ in category A then switching category with } truncates forward history from category A
PhotoMotion.stepPhotoImageHistory(asyncState, -1, mockPicker);
if (asyncState.currentSourceStem !== 'photo_1') {
    throw new Error('Expected step backward to photo_1, got ' + asyncState.currentSourceStem);
}
const catSwitchRes = PhotoMotion.stepPhotoCategory(asyncState, 1, (cat) => ({ category: cat, sourceStem: 'new_cat_photo', variantPaths: {} }));
if (asyncState.currentSourceStem !== 'new_cat_photo' || asyncState.historyStack[asyncState.historyCursor].category !== catSwitchRes.category) {
    throw new Error('stepPhotoCategory after [ backward step must pick from the new category instead of stale forward history');
}

// Verify user motion settings (including photoMotionActivity) are saved when FX Rand [~] or Rand Photo Motion is turned ON,
// randomised during events/mode steps, and restored when switched OFF
const actState = PhotoMotion.createPhotoMotionState();
actState.photoMotionActivity = 1.65;
actState.photoXyzTilt = 1.80;
actState.photoWarpIntensity = 1.45;
actState.photoStrobeSpeed = 1.85;
PhotoMotion.togglePhotoRandomiseMotionControls(actState, true, () => 0.15);
if (!actState.randomiseMotionControls || (actState.photoMotionActivity === 1.65 && actState.photoXyzTilt === 1.80)) {
    throw new Error('Expected togglePhotoRandomiseMotionControls(true) to enable persistent toggle and randomise live motion controls');
}
const prevTiltAfterToggle = actState.photoXyzTilt;
PhotoMotion.stepPhotoMotionMode(actState, 1, mockPicker, true);
if (!actState.randomiseMotionControls) {
    throw new Error('randomiseMotionControls must stay ON across effect mode changes');
}
PhotoMotion.togglePhotoRandomiseMotionControls(actState, false);
if (actState.randomiseMotionControls ||
    Math.abs(actState.photoMotionActivity - 1.65) > 1e-6 ||
    Math.abs(actState.photoXyzTilt - 1.80) > 1e-6 ||
    Math.abs(actState.photoWarpIntensity - 1.45) > 1e-6 ||
    Math.abs(actState.photoStrobeSpeed - 1.85) > 1e-6) {
    throw new Error('Switching Rand Photo Motion OFF must restore user motion settings, got ' + JSON.stringify(actState));
}

console.log('OK');
"""
            res = subprocess.run(["node", "-e", node_script], cwd=REPO_ROOT, capture_output=True, text=True, timeout=20)
            self.assertEqual(res.returncode, 0, f"Node test_16 failed: {res.stderr}")

    def test_19_phase1_gpu_hardware_migration_l1_worlds_and_photo_motion(self):
        """Verify Phase 1 GPU hardware graphics migration for L1 Worlds (0..10) & L1 Photo-Motion (11)."""
        import pathlib
        repo = pathlib.Path(REPO_ROOT)
        photo_frag = repo / "share" / "photo_motion.frag"
        photo_qsb = repo / "share" / "photo_motion.frag.qsb"
        psych_frag = repo / "share" / "psychedelic.frag"
        psych_qsb = repo / "share" / "psychedelic.frag.qsb"

        self.assertTrue(photo_frag.is_file(), "Missing share/photo_motion.frag")
        self.assertTrue(photo_qsb.is_file(), "Missing compiled share/photo_motion.frag.qsb")
        self.assertGreater(photo_qsb.stat().st_size, 10240, "share/photo_motion.frag.qsb is unexpectedly small")
        self.assertTrue(psych_frag.is_file(), "Missing share/psychedelic.frag")
        self.assertTrue(psych_qsb.is_file(), "Missing compiled share/psychedelic.frag.qsb")
        self.assertGreater(psych_qsb.stat().st_size, 10240, "share/psychedelic.frag.qsb is unexpectedly small")

        photo_frag_src = photo_frag.read_text(encoding="utf-8")
        for sampler in ("texPrimary", "texSecondary", "texPrev", "texPeer"):
            self.assertIn(f"uniform sampler2D {sampler};", photo_frag_src)
        required_photo_uniforms = (
            "uMotionMode",
            "uPanX", "uPanY", "uZoom",
            "uMacroSlide", "uMacroScale", "uMacroRoll", "uPitch", "uYaw", "uRoll", "uPlaneShear",
            "uPhotoOpacity", "uBlackOpacity", "uMidOpacity", "uWhiteOpacity", "uColourSnatchOpacity", "uPaletteBloom",
            "uVariantMix", "uSnapshotMix", "uPoolMode",
            "uCol0", "uCol1", "uCol2", "uBgCol",
        )
        for u_name in required_photo_uniforms:
            self.assertIn(u_name, photo_frag_src, f"Missing uniform {u_name} in share/photo_motion.frag")
        for m_idx in range(24):
            self.assertIn(f"mode == {m_idx}", photo_frag_src)
        for m_code in (f"M{i:02d}:" for i in range(1, 26)):
            self.assertIn(m_code, photo_frag_src, f"Missing authentic mode {m_code} in share/photo_motion.frag")

        psych_frag_src = psych_frag.read_text(encoding="utf-8")
        for u_name in ("uL1Speed", "uL1Density", "uL1Direction"):
            self.assertIn(f"float {u_name};", psych_frag_src)
        for w_idx in range(10):
            self.assertIn(f"l1m == {w_idx}", psych_frag_src)
        for world_marker in (
            "MilkDrop Liquid Feedback Warp",
            "G-Force Polar FlowField",
            "Cthugha Rave Flame",
            "Relativistic Starfield",
            "Hybrid DNA Helix Intelligence",
            "Death Star Trench",
            "BlackHole",
            "Swooping & Rotational Banking 3D Surface Grid",
            "Shader Dyson Hyper-Orrery",
            "Demoscene Polygon Tunnel",
            "Tempest & Asteroids",
        ):
            self.assertIn(world_marker, psych_frag_src, f"Missing L1 World {world_marker} in share/psychedelic.frag")
        self.assertNotIn("uL1Time * l1Dir * max(0.05, l1Spd)", psych_frag_src)

        viz_src = (repo / "Visualiser.qml").read_text(encoding="utf-8")
        self.assertIn("id: gpuPhotoStage", viz_src)
        self.assertIn('fragmentShader: Qt.resolvedUrl("share/photo_motion.frag.qsb")', viz_src)
        for tex_id in ("photoTexPrimary", "photoTexSecondary", "photoTexPrev", "photoTexPeer"):
            self.assertIn(f"id: {tex_id}", viz_src)
        for u_name in required_photo_uniforms:
            self.assertIn(f"property ", viz_src)
            self.assertIn(u_name, viz_src, f"Missing uniform binding {u_name} in Visualiser.qml")
        for bogus_prop in (
            "pSt.macroPanX",
            "pSt.macroTiltX",
            "pSt.morphCrossfade",
            "pSt.sectorOpacityMultipliers",
            "stepInfo.effectiveActivity",
            "stepInfo.effectiveWarp ",
            "stepInfo.effectiveWarp!",
        ):
            self.assertNotIn(bogus_prop, viz_src, f"Bogus non-existent property {bogus_prop} found in Visualiser.qml")
        self.assertIn("stepInfo.effectiveMotionActivity", viz_src)
        self.assertIn("stepInfo.effectiveWarpIntensity", viz_src)
        self.assertIn("onPhotoPreviousVariantsChanged:", viz_src)
        self.assertIn("if (uPoolMode == 0 || uHasSecondary == 0)", photo_frag_src)
        self.assertIn("bool isPinned = (uVariantIndex == uSecondaryVariantIndex);", photo_frag_src)
        self.assertIn("sin(clamp(uVariantMix, 0.0, 1.0) * PI)", photo_frag_src)
        self.assertIn("id: photoAutoMotionTimer", viz_src)
        self.assertIn("Math.max(1000, Math.min(60000, Math.round((Number(root.photoEffectChangeIntervalSec) || 10.0) * 1000)))", viz_src)
        self.assertIn("exponentialScale: true", viz_src)
        self.assertIn("(root.photoAutoMotionEvents || root.photoRandomiseMotionControls)", viz_src)
        self.assertIn("property bool _paintPending: false", viz_src)
        self.assertIn("(!root.gpuShaderEnabled && root.layer1FieldEnabled)", viz_src)

        node_script = r"""
const fs = require('fs');
const vm = require('vm');
let code = fs.readFileSync('PsychedelicEngine.js', 'utf8').replace(/^\.pragma\s+library\s*$/m, '');
vm.runInThisContext(code);

function makeCtx() {
    return {
        fillCount: 0,
        strokeCount: 0,
        clearCount: 0,
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        font: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        save() {},
        restore() {},
        beginPath() {},
        closePath() {},
        moveTo() {},
        lineTo() {},
        bezierCurveTo() {},
        quadraticCurveTo() {},
        arc() {},
        rect() {},
        clip() {},
        fill() { this.fillCount++; },
        stroke() { this.strokeCount++; },
        fillRect() { this.fillCount++; },
        strokeRect() { this.strokeCount++; },
        clearRect() { this.clearCount++; },
        fillText() { this.fillCount++; },
        strokeText() { this.strokeCount++; },
        translate() {},
        rotate() {},
        scale() {},
        transform() {},
        setTransform() {},
        createLinearGradient() { return { addColorStop() {} }; },
        createRadialGradient() { return { addColorStop() {} }; },
        drawImage() {}
    };
}

const bands = new Array(64).fill(0.45);
const theme = { background: '#07090e', foreground: '#e2e8f0', accent: '#6ee7b7', urgent: '#f472b6' };

for (let m = 0; m < 12; m++) {
    // 1. When gpuShaderEnabled & gpuL1Active are true and only L1 Field is active, CPU canvas draws 0 fills/strokes
    const stGpu = createState();
    const cfgGpu = normaliseConfig({
        gpuShaderEnabled: true,
        gpuL1Active: true,
        layer1Enabled: true,
        layer1FieldEnabled: true,
        layer1Mode: m,
        layer1EqEnabled: false,
        layer1ShapesEnabled: false,
        layer2Enabled: false,
        layer2VizEnabled: false,
        layer2TracersEnabled: false,
        layer3Enabled: false
    }, 0, []);
    stepState(stGpu, bands, true, cfgGpu, 0.016);
    const ctxGpu = makeCtx();
    renderFrame(ctxGpu, 640, 360, stGpu, 0, theme, [], [], [], cfgGpu, null);
    if (ctxGpu.fillCount !== 0 || ctxGpu.strokeCount !== 0 || ctxGpu.clearCount === 0) {
        throw new Error(`Expected 0 CPU fills/strokes when gpuL1Active=true for mode ${m}, got fill=${ctxGpu.fillCount} stroke=${ctxGpu.strokeCount} clear=${ctxGpu.clearCount}`);
    }

    // 2. When gpuShaderEnabled is false, CPU fallback still renders every L1 mode (0..11)
    const stCpu = createState();
    const cfgCpu = normaliseConfig({
        gpuShaderEnabled: false,
        gpuL1Active: false,
        layer1Enabled: true,
        layer1FieldEnabled: true,
        layer1Mode: m,
        layer1EqEnabled: false,
        layer1ShapesEnabled: false,
        layer2Enabled: false,
        layer2VizEnabled: false,
        layer2TracersEnabled: false,
        layer3Enabled: false
    }, 0, []);
    stepState(stCpu, bands, true, cfgCpu, 0.016);
    const ctxCpu = makeCtx();
    renderFrame(ctxCpu, 640, 360, stCpu, 0, theme, [], [], [], cfgCpu, null);
    if (ctxCpu.fillCount + ctxCpu.strokeCount <= 1) {
        throw new Error(`Expected CPU fallback draws when gpuShaderEnabled=false for mode ${m}`);
    }
}

// 3. Extract and execute _toPhotoFileUrl, _firstAvailableFileUrl, and syncGpuPhotoTextures from Visualiser.qml
//    against PhotoMotionEngine.js to verify stable texture URLs across strobing frames and pool modes.
const pmCode = fs.readFileSync('PhotoMotionEngine.js', 'utf8').replace(/^\.pragma\s+library\s*$/m, '');
const PhotoMotion = {};
vm.runInNewContext(pmCode, PhotoMotion);

const vizSrc = fs.readFileSync('Visualiser.qml', 'utf8');
const fnToUrl = vizSrc.match(/function _toPhotoFileUrl\([^)]*\)\s*\{[\s\S]*?\n    \}/)[0];
const fnFirstUrl = vizSrc.match(/function _firstAvailableFileUrl\([^)]*\)\s*\{[\s\S]*?\n    \}/)[0];
const fnSyncTex = vizSrc.match(/function syncGpuPhotoTextures\([^)]*\)\s*\{[\s\S]*?\n    \}/)[0];

// Verify frameAnim does NOT call root.syncGpuPhotoTextures()
const frameAnimBlock = vizSrc.slice(vizSrc.indexOf('FrameAnimation {'), vizSrc.indexOf('id: photoAutoMotionTimer'));
if (frameAnimBlock.includes('syncGpuPhotoTextures()')) {
    throw new Error('frameAnim must NOT call syncGpuPhotoTextures() on every frame');
}

const activeVars = {};
const prevVars = {};
PhotoMotion.STAGE1_EFFECT_IDS.forEach((id, idx) => {
    activeVars[id] = `/tmp/photoA_${idx}.png`;
    prevVars[id] = `/tmp/photoPrev_${idx}.png`;
});
const samePeers = {
    [PhotoMotion.STAGE1_EFFECT_IDS[0]]: '/tmp/photoA_0.png',
    [PhotoMotion.STAGE1_EFFECT_IDS[1]]: '/tmp/peerSame_1.png'
};
const randPeers = {
    [PhotoMotion.STAGE1_EFFECT_IDS[0]]: '/tmp/peerRand_0.png'
};

const rootMock = {
    photoPinnedVariant: -1,
    photoPoolMode: 0,
    photoActiveVariants: activeVars,
    photoPreviousVariants: prevVars,
    photoSameEffectByVariant: { [PhotoMotion.STAGE1_EFFECT_IDS[0]]: samePeers },
    photoSameEffectPeers: samePeers,
    photoRandomPoolPeers: randPeers,
    photoState: { snapshotCrossfadeProgress: 1.0 },
    _gpuPhotoUrlPrimary: '',
    _gpuPhotoUrlSecondary: '',
    _gpuPhotoUrlPeer: '',
    _gpuPhotoUrlPrev: ''
};
const sandbox = { root: rootMock, PhotoMotion, String, Object };
vm.runInNewContext(
    `${fnToUrl}\n${fnFirstUrl}\n${fnSyncTex}\n` +
    `root._toPhotoFileUrl = _toPhotoFileUrl; root._firstAvailableFileUrl = _firstAvailableFileUrl; root.syncGpuPhotoTextures = syncGpuPhotoTextures;`,
    sandbox
);

rootMock.syncGpuPhotoTextures();
if (rootMock._gpuPhotoUrlPrimary !== 'file:///tmp/photoA_0.png') {
    throw new Error('Expected primary URL file:///tmp/photoA_0.png, got ' + rootMock._gpuPhotoUrlPrimary);
}
if (rootMock._gpuPhotoUrlSecondary !== 'file:///tmp/photoA_5.png') {
    throw new Error('Expected secondary URL file:///tmp/photoA_5.png, got ' + rootMock._gpuPhotoUrlSecondary);
}
if (rootMock._gpuPhotoUrlPrev !== 'file:///tmp/photoPrev_0.png') {
    throw new Error('Expected prev URL file:///tmp/photoPrev_0.png, got ' + rootMock._gpuPhotoUrlPrev);
}

// Pool Mode 1 must pick a peer differing from pUrl
rootMock.photoPoolMode = 1;
rootMock.syncGpuPhotoTextures();
if (rootMock._gpuPhotoUrlPeer !== 'file:///tmp/peerSame_1.png') {
    throw new Error('Pool mode 1 must pick peer differing from pUrl, got ' + rootMock._gpuPhotoUrlPeer);
}

// Pool Mode 2 must pick a random pool peer differing from pUrl
rootMock.photoPoolMode = 2;
rootMock.syncGpuPhotoTextures();
if (rootMock._gpuPhotoUrlPeer !== 'file:///tmp/peerRand_0.png') {
    throw new Error('Pool mode 2 must pick random pool peer differing from pUrl, got ' + rootMock._gpuPhotoUrlPeer);
}

// Rapid step / external photo change: when photoActiveVariants switches to photoB while photoPreviousVariants is empty,
// _gpuPhotoUrlPrev must preserve the outgoing _gpuPhotoUrlPrimary ('file:///tmp/photoA_0.png') and reset snapshotCrossfadeProgress to 0.0
const nextVars = {};
PhotoMotion.STAGE1_EFFECT_IDS.forEach((id, idx) => {
    nextVars[id] = `/tmp/photoB_${idx}.png`;
});
rootMock.photoPreviousVariants = {};
rootMock.photoActiveVariants = nextVars;
rootMock.photoState.snapshotCrossfadeProgress = 0.85;
rootMock.syncGpuPhotoTextures();
if (rootMock._gpuPhotoUrlPrimary !== 'file:///tmp/photoB_0.png') {
    throw new Error('Expected primary URL file:///tmp/photoB_0.png, got ' + rootMock._gpuPhotoUrlPrimary);
}
if (rootMock._gpuPhotoUrlPrev !== 'file:///tmp/photoA_0.png') {
    throw new Error('Expected rapid-step prev URL to preserve outgoing primary file:///tmp/photoA_0.png, got ' + rootMock._gpuPhotoUrlPrev);
}
if (rootMock.photoState.snapshotCrossfadeProgress !== 0.0) {
    throw new Error('Expected snapshotCrossfadeProgress to reset to 0.0 on primary URL switch, got ' + rootMock.photoState.snapshotCrossfadeProgress);
}

// Verify stepPhotoMotionState returns effectiveMotionActivity and effectiveWarpIntensity
const pSt = PhotoMotion.createPhotoMotionState();
const sInfo = PhotoMotion.stepPhotoMotionState(pSt, 0.016, { bass: 0.6, mid: 0.5, high: 0.4, beat: 0.8, spectrum: bands });
if (typeof sInfo.effectiveMotionActivity !== 'number' || typeof sInfo.effectiveWarpIntensity !== 'number') {
    throw new Error('stepPhotoMotionState must return numeric effectiveMotionActivity and effectiveWarpIntensity');
}

console.log('OK');
"""
        res = subprocess.run(["node", "-e", node_script], cwd=REPO_ROOT, capture_output=True, text=True, timeout=20)
        self.assertEqual(res.returncode, 0, f"Node test_19 failed: {res.stderr}")

    def test_20_stage_a_and_b_all_24_worlds_24_eq_14_vectors_and_ui_polish(self):
        """Verify Stage A & B: 24 L1 Worlds (OG 3D + Photo + 12 GPU), 24 EQs, 14 Vectors, L4 3D Tubes, L6 size clamp, Photo M20/M21/16-variants, Toast & 24-bar Spectrum."""
        import pathlib
        repo = pathlib.Path(REPO_ROOT)
        photo_frag_src = (repo / "share" / "photo_motion.frag").read_text(encoding="utf-8")
        psych_frag_src = (repo / "share" / "psychedelic.frag").read_text(encoding="utf-8")
        viz_src = (repo / "Visualiser.qml").read_text(encoding="utf-8")

        photo_eng_src = (repo / "PhotoMotionEngine.js").read_text(encoding="utf-8")

        # 1. Verify Photo-Motion M20 organic breathing, M21 slowed constant-rate time, and 16 distinct darkroom variants
        self.assertIn("wellSwell", photo_frag_src)
        self.assertNotIn("uTime * (0.28 + bass * 0.25)", photo_frag_src)
        self.assertNotIn("uTime * (0.28 + bass * 0.25)", photo_eng_src)
        self.assertIn("float v = 0.68 / (r + 0.28 + 0.010 * sin(rPhase * 0.24)) + rPhase * 0.052;", photo_frag_src)
        self.assertIn("var tFlow = (rT * 0.14) % 1.0", photo_eng_src)
        for v_idx in range(15):
            self.assertIn(f"vid == {v_idx}", photo_frag_src)

        # 2. Verify psychedelic.frag has 12 GPU L1 Worlds (l1m == 0..10 + else Death Star 3D Warp Trench), no Battlezone cockpit, no Death Star targetBox, no SynthGrid keyboards, and new DNA/TRON/Orrery worlds
        self.assertIn("l1m == 10", psych_frag_src)
        self.assertIn("Death Star 3D Warp Trench", psych_frag_src)
        self.assertNotIn("targetBox", psych_frag_src)
        self.assertNotIn("inBlackKey", psych_frag_src)
        self.assertIn("strandA", psych_frag_src)
        self.assertIn("towerAcc", psych_frag_src)
        self.assertIn("dCrystal", psych_frag_src)
        self.assertIn("catwalkBarriers", psych_frag_src)
        self.assertIn("tieShape", psych_frag_src)
        self.assertIn("tieShapeW", psych_frag_src)
        self.assertIn("codonNode", psych_frag_src)

        # 3. Verify Visualiser.qml has bottom-left keybinding toast, 24-bar Spectrum bound to root.bands + 4-bar toggle, Quick Bar steppers, full drawer repeaters, Shift+1..6 random toggles, Vector lifespan/fill ratio, and intact position binding on seek
        self.assertIn("id: keybindingToastBadge", viz_src)
        self.assertIn("function showKeybindingFeedback(", viz_src)
        self.assertIn("property bool _inHudPillInteraction: false", viz_src)
        self.assertIn("if (root._inKeybindingDispatch || (!root._inHudPillInteraction && !root._internalLayerChange))", viz_src)
        self.assertIn("id: bottomMeterBox", viz_src)
        self.assertIn("property bool showSpectrumMeter: true", viz_src)
        self.assertIn("bands: root.bands", viz_src)
        self.assertIn("readonly property var spectrumBands: root.bands", viz_src)
        self.assertIn("barCount: 24", viz_src)
        self.assertIn("model: root.layer1Modes.length", viz_src)
        self.assertIn("model: root.layer1EqStyles.length", viz_src)
        self.assertIn("function toggleLayerRandomByNumber(layerNum)", viz_src)
        self.assertIn("property real layer1ShapeLifespan: 1.0", viz_src)
        self.assertIn("property real layer1ShapeFillRatio: 0.35", viz_src)
        self.assertIn("property bool showBottomHud: true", viz_src)
        self.assertNotIn("root.position = targetSec", viz_src)

        node_script = r"""
const fs = require('fs');
const vm = require('vm');
let code = fs.readFileSync('PsychedelicEngine.js', 'utf8').replace(/^\.pragma\s+library\s*$/m, '');
vm.runInThisContext(code);

if (ALL_LAYER1_MODES.length !== 27 || SHORT_LAYER1_MODES.length !== 27) {
    throw new Error('Expected 27 ALL_LAYER1_MODES and 27 SHORT_LAYER1_MODES, got ' + ALL_LAYER1_MODES.length);
}
if (PALETTE_COLLECTIONS.length !== 8 || PALETTE_RANDOM_MODES.length !== 3) {
    throw new Error('Expected 8 PALETTE_COLLECTIONS and 3 PALETTE_RANDOM_MODES');
}
if (ALL_LAYER1_EQ_STYLES.length !== 24) {
    throw new Error('Expected 24 ALL_LAYER1_EQ_STYLES, got ' + ALL_LAYER1_EQ_STYLES.length);
}
if (LAYER1_SHAPE_STYLES.length !== 17) {
    throw new Error('Expected 17 LAYER1_SHAPE_STYLES, got ' + LAYER1_SHAPE_STYLES.length);
}

function makeTrackCtx() {
    return {
        fillCount: 0,
        strokeCount: 0,
        clearCount: 0,
        fonts: [],
        lineCaps: [],
        lineJoins: [],
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        _font: '',
        set font(v) { this._font = v; this.fonts.push(v); },
        get font() { return this._font; },
        _cap: 'butt',
        set lineCap(v) { this._cap = v; this.lineCaps.push(v); },
        get lineCap() { return this._cap; },
        _join: 'miter',
        set lineJoin(v) { this._join = v; this.lineJoins.push(v); },
        get lineJoin() { return this._join; },
        save() {},
        restore() {},
        beginPath() {},
        closePath() {},
        moveTo(x, y) { if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error('NaN/non-finite moveTo: ' + x + ',' + y); },
        lineTo(x, y) { if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error('NaN/non-finite lineTo: ' + x + ',' + y); },
        bezierCurveTo() {},
        quadraticCurveTo() {},
        arc(x, y, r, a0, a1) { if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(r) || r < 0) throw new Error('Invalid arc: ' + x + ',' + y + ',' + r); },
        rect() {},
        clip() {},
        fill() { this.fillCount++; },
        stroke() { this.strokeCount++; },
        fillRect() { this.fillCount++; },
        strokeRect() { this.strokeCount++; },
        clearRect() { this.clearCount++; },
        fillText() { this.fillCount++; },
        strokeText() { this.strokeCount++; },
        translate(x, y) { if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error('NaN/non-finite translate: ' + x + ',' + y); },
        rotate(a) { if (!Number.isFinite(a)) throw new Error('NaN/non-finite rotate: ' + a); },
        scale() {},
        transform() {},
        setTransform() {},
        createLinearGradient() { return { addColorStop() {} }; },
        createRadialGradient() { return { addColorStop() {} }; },
        drawImage() {}
    };
}

const bands = new Array(64).fill(520);
const theme = { background: '#07090e', foreground: '#e2e8f0', accent: '#6ee7b7', urgent: '#f472b6' };

// 1. Verify all 27 L1 Worlds normalise and render (0..10 and 24..26 on CPU canvas when gpuL1Active=false; 12..23 map to CPU fallback when gpuShaderEnabled=false)
for (let m = 0; m < 27; m++) {
    const st = createState();
    const cfg = normaliseConfig({
        gpuShaderEnabled: false,
        gpuL1Active: false,
        layer1Enabled: true,
        layer1FieldEnabled: true,
        layer1Mode: m,
        layer1EqEnabled: false,
        layer1ShapesEnabled: false,
        layer2Enabled: false,
        layer3Enabled: false
    }, 0, []);
    if (cfg.layer1Mode !== m) {
        throw new Error(`Expected normaliseConfig to preserve layer1Mode=${m}, got ${cfg.layer1Mode}`);
    }
    stepState(st, bands, true, cfg, 0.03);
    const ctx = makeTrackCtx();
    renderFrame(ctx, 640, 360, st, 0, theme, [], [], [], cfg, null);
    if (m !== 11 && ctx.fillCount + ctx.strokeCount < 2) {
        throw new Error(`L1 World ${m} (${ALL_LAYER1_MODES[m]}) failed to render geometry`);
    }
}
for (const dirVal of [1, -1, 0]) {
    const stPac = createState();
    const cfgPac = normaliseConfig({
        gpuShaderEnabled: true,
        gpuL1Active: true,
        layer1Enabled: true,
        layer1FieldEnabled: true,
        layer1Mode: 24,
        layer1Direction: dirVal,
        layer1Speed: 1.5,
        layer1Density: 1.4,
        layer1EqEnabled: false,
        layer1ShapesEnabled: false,
        layer2Enabled: false,
        layer3Enabled: false
    }, 0, []);
    let minMaxArc = Infinity, maxMaxArc = -Infinity;
    for (let f = 0; f < 40; f++) {
        stepState(stPac, bands, true, cfgPac, 0.35);
        const ctxPac = makeTrackCtx();
        let frameMaxArc = 0;
        const origArc = ctxPac.arc.bind(ctxPac);
        ctxPac.arc = function(x, y, r, a0, a1) {
            origArc(x, y, r, a0, a1);
            if (r > frameMaxArc) frameMaxArc = r;
        };
        renderFrame(ctxPac, 1280, 720, stPac, 0, theme, [], [], [], cfgPac, null);
        if (ctxPac.strokeCount < 22 || ctxPac.fillCount < 8) {
            throw new Error(`World #25 (layer1Mode=24, dir=${dirVal}) rendered insufficient strokes/fills: ${ctxPac.strokeCount}/${ctxPac.fillCount}`);
        }
        minMaxArc = Math.min(minMaxArc, frameMaxArc);
        maxMaxArc = Math.max(maxMaxArc, frameMaxArc);
    }
    if (!(maxMaxArc > minMaxArc * 1.45)) {
        throw new Error(`Expected World #25 (dir=${dirVal}) 3D camera zoom & board flip to vary character scale >=1.45x, got min=${minMaxArc}, max=${maxMaxArc}`);
    }
}

// 2. Verify all 24 Equaliser styles (including 16..23 3D Shader-Inspired Equalisers) render across all 4 orientations (0..3)
for (let eq = 0; eq < 24; eq++) {
    for (let lay = 0; lay < 4; lay++) {
        const st = createState();
        const cfg = normaliseConfig({
            layer1Enabled: true,
            layer1FieldEnabled: false,
            layer1EqEnabled: true,
            layer1EqStyle: eq,
            layer1EqLayout: lay,
            layer1ShapesEnabled: false,
            layer2Enabled: false,
            layer3Enabled: false
        }, 0, []);
        if (cfg.layer1EqStyle !== eq) {
            throw new Error(`Expected layer1EqStyle=${eq}, got ${cfg.layer1EqStyle}`);
        }
        stepState(st, bands, true, cfg, 0.03);
        const ctx = makeTrackCtx();
        renderFrame(ctx, 640, 360, st, 0, theme, [], [], [], cfg, null);
        if (ctx.fillCount + ctx.strokeCount < 4) {
            throw new Error(`EQ style ${eq} (${ALL_LAYER1_EQ_STYLES[eq]}) layout ${lay} failed to draw`);
        }
    }
}

// 3. Verify all 14 Vector craft styles (0..13) render in drawLayer1BeatShapes, including in 17. ShdBattlezone (layer1Mode=16) and 5. Battlezone 1980 (layer1Mode=4)
for (let sh = 0; sh < 14; sh++) {
    const st = createState();
    const cfg = normaliseConfig({
        layer1Enabled: true,
        layer1FieldEnabled: false,
        layer1EqEnabled: false,
        layer1ShapesEnabled: true,
        layer1ShapeStyle: sh,
        layer1ShapeDensity: 1.5,
        layer2Enabled: false,
        layer3Enabled: false
    }, 0, []);
    if (cfg.layer1ShapeStyle !== sh) {
        throw new Error(`Expected layer1ShapeStyle=${sh}, got ${cfg.layer1ShapeStyle}`);
    }
    stepState(st, bands, true, cfg, 0.04);
    const ctx = makeTrackCtx();
    renderFrame(ctx, 640, 360, st, 0, theme, [], [], [], cfg, null);
    if (ctx.strokeCount < 4) {
        throw new Error(`Vector craft style ${sh} (${LAYER1_SHAPE_STYLES[sh]}) failed to draw strokes`);
    }

    // Also verify 17. ShdBattlezone (layer1Mode=16, gpuL1Active=true) draws 3: Vectors
    const stShdBz = createState();
    const cfgShdBz = normaliseConfig({
        gpuShaderEnabled: true,
        gpuL1Active: true,
        layer1Enabled: true,
        layer1FieldEnabled: true,
        layer1Mode: 16,
        layer1EqEnabled: false,
        layer1ShapesEnabled: true,
        layer1ShapeStyle: sh,
        layer2Enabled: false,
        layer3Enabled: false
    }, 0, []);
    stepState(stShdBz, bands, true, cfgShdBz, 0.04);
    const ctxShdBz = makeTrackCtx();
    renderFrame(ctxShdBz, 640, 360, stShdBz, 0, theme, [], [], [], cfgShdBz, null);
    if (ctxShdBz.strokeCount < 2) {
        throw new Error(`ShdBattlezone (layer1Mode=16) failed to draw vector craft style ${sh}`);
    }

    // Also verify OG 5. Battlezone 1980 (layer1Mode=4, gpuL1Active=false) draws vector craft styles 6..13 via SUB-SYSTEM 3 in addition to field obstacles
    if (sh >= 6) {
        const stOgBz = createState();
        const cfgOgBzNoShapes = normaliseConfig({
            gpuShaderEnabled: true,
            gpuL1Active: false,
            layer1Enabled: true,
            layer1FieldEnabled: true,
            layer1Mode: 4,
            layer1EqEnabled: false,
            layer1ShapesEnabled: false,
            layer1ShapeStyle: sh,
            layer2Enabled: false,
            layer3Enabled: false
        }, 0, []);
        stepState(stOgBz, bands, true, cfgOgBzNoShapes, 0.04);
        const ctxNoSh = makeTrackCtx();
        renderFrame(ctxNoSh, 640, 360, stOgBz, 0, theme, [], [], [], cfgOgBzNoShapes, null);

        const stOgBzSh = createState();
        const cfgOgBzSh = normaliseConfig({
            gpuShaderEnabled: true,
            gpuL1Active: false,
            layer1Enabled: true,
            layer1FieldEnabled: true,
            layer1Mode: 4,
            layer1EqEnabled: false,
            layer1ShapesEnabled: true,
            layer1ShapeStyle: sh,
            layer2Enabled: false,
            layer3Enabled: false
        }, 0, []);
        stepState(stOgBzSh, bands, true, cfgOgBzSh, 0.04);
        const ctxWithSh = makeTrackCtx();
        renderFrame(ctxWithSh, 640, 360, stOgBzSh, 0, theme, [], [], [], cfgOgBzSh, null);
        if (ctxWithSh.strokeCount <= ctxNoSh.strokeCount) {
            throw new Error(`OG Battlezone (layer1Mode=4) did not add SUB-SYSTEM 3 strokes for style ${sh}`);
        }
    }
}

// 4. Verify Layer 5 Vortex (layer4Enabled=true) + OG vector world (layer1Mode=0) keeps gpuOn=true (clearRect instead of opaque fillRect) even if backdropEnabled is omitted
{
    const stVortex = createState();
    const cfgVortex = {
        gpuShaderEnabled: true,
        gpuL1Active: false,
        layer1Enabled: true,
        layer1FieldEnabled: true,
        layer1Mode: 0,
        layer1EqEnabled: false,
        layer1ShapesEnabled: false,
        layer2Enabled: false,
        layer3Enabled: false,
        layer4Enabled: true
    };
    stepState(stVortex, bands, true, cfgVortex, 0.03);
    const ctxVortex = makeTrackCtx();
    renderFrame(ctxVortex, 640, 360, stVortex, 0, theme, [], [], [], cfgVortex, null);
    if (ctxVortex.clearCount < 1) {
        throw new Error('Expected clearRect when layer4Enabled=true with OG vector world (layer1Mode=0)');
    }
}

// 5. Verify all 21 Layer 4 Geometry modes (0..20) apply 3D tubular shading with round caps/joins
if (ALL_MODE_NAMES.length !== 21) {
    throw new Error('Expected 21 Layer 4 Geometry modes in ALL_MODE_NAMES, got ' + ALL_MODE_NAMES.length);
}
for (let vmIdx = 0; vmIdx < 21; vmIdx++) {
    const st = createState();
    const cfg = normaliseConfig({
        layer1Enabled: false,
        layer2Enabled: true,
        layer2VizEnabled: true,
        visualMode: vmIdx,
        layer3Enabled: false
    }, 0, []);
    stepState(st, bands, true, cfg, 0.03);
    const ctx = makeTrackCtx();
    renderFrame(ctx, 640, 360, st, vmIdx, theme, [], [], [], cfg, null);
    if (!ctx.lineCaps.includes('round') || !ctx.lineJoins.includes('round')) {
        throw new Error(`Expected Layer 4 Geometry mode ${vmIdx} (${ALL_MODE_NAMES[vmIdx]}) to set round lineCap/lineJoin for 3D tubes`);
    }
}

// 5b. Verify all 24 Equaliser styles are numbered 1..24 and support all 3 EQ Band Orders (Low->High, Centre-Out, Stereo Mirror)
if (LAYER1_EQ_BAND_ORDERS.length !== 3) {
    throw new Error('Expected 3 LAYER1_EQ_BAND_ORDERS, got ' + LAYER1_EQ_BAND_ORDERS.length);
}
for (let eq = 0; eq < 24; eq++) {
    if (!SHORT_LAYER1_EQ_STYLES[eq].startsWith((eq + 1) + ':')) {
        throw new Error('Expected SHORT_LAYER1_EQ_STYLES[' + eq + '] to start with "' + (eq + 1) + ':", got: ' + SHORT_LAYER1_EQ_STYLES[eq]);
    }
    for (let bo = 0; bo < 3; bo++) {
        const stBo = createState();
        const cfgBo = normaliseConfig({
            layer1Enabled: true,
            layer1FieldEnabled: false,
            layer1EqEnabled: true,
            layer1EqStyle: eq,
            layer1EqBandOrder: bo,
            layer1ShapesEnabled: false,
            layer2Enabled: false,
            layer3Enabled: false
        }, 0, []);
        if (cfgBo.layer1EqBandOrder !== bo) {
            throw new Error(`Expected layer1EqBandOrder=${bo}, got ${cfgBo.layer1EqBandOrder}`);
        }
        stepState(stBo, bands, true, cfgBo, 0.03);
        const ctxBo = makeTrackCtx();
        renderFrame(ctxBo, 640, 360, stBo, 0, theme, [], [], [], cfgBo, null);
        if (ctxBo.fillCount + ctxBo.strokeCount < 4) {
            throw new Error(`EQ style ${eq} with bandOrder ${bo} failed to draw`);
        }
    }
}

// 6. Verify Layer 6 Typography clamps font size to <= 44px even at extreme scale (layer3Scale=2.5, beatPulse=1.0, bass=1.0)
//    and Cool Retro Term CRT Cell Matrix (textStyle=20) renders fixed-cell CRT phosphor blocks across all 6 phosphor profiles
if (COOL_RETRO_TERM_PHOSPHORS.length !== 6) {
    throw new Error('Expected 6 COOL_RETRO_TERM_PHOSPHORS profiles');
}
const stTypo = createState();
const cfgTypo = normaliseConfig({
    layer1Enabled: false,
    layer2Enabled: false,
    layer3Enabled: true,
    useAlbumArt: false,
    asciiMode: 'text',
    layer3Scale: 2.5,
    layer3Tracers: 8,
    layer3Mode: 0,
    layer3TextStyle: 0,
    trackTitle: 'TYPOGRAPHY CLAMP CHECK'
}, 0, []);
stepState(stTypo, new Array(64).fill(950), true, cfgTypo, 0.03);
stTypo.beatPulse = 1.0;
stTypo.bass = 1.0;
const ctxTypo = makeTrackCtx();
renderFrame(ctxTypo, 1920, 1080, stTypo, 0, theme, [], [], [], cfgTypo, null);
for (const fStr of ctxTypo.fonts) {
    const m = fStr.match(/(\d+)px/);
    if (m && Number(m[1]) > 118) {
        throw new Error(`Typography font size exceeded clamp: ${fStr}`);
    }
}
for (let cm = 0; cm < 4; cm++) {
    const cfgCrt = normaliseConfig({
        layer1Enabled: false,
        layer2Enabled: false,
        layer3Enabled: true,
        useAlbumArt: false,
        asciiMode: 'text',
        layer3TextStyle: 20,
        layer3ColourMode: cm,
        layer3Tracers: 1,
        trackTitle: 'COOL RETRO CRT'
    }, 0, []);
    const ctxCrt = makeTrackCtx();
    renderFrame(ctxCrt, 1280, 720, stTypo, 0, theme, [], [], [], cfgCrt, null);
    if (ctxCrt.fillCount < 40) {
        throw new Error(`Expected ASCII Cell Matrix (textStyle=20, colourMode=${cm}) to render 7-scanline-row CRT cells, got fillCount=${ctxCrt.fillCount}`);
    }
}

// 7. Verify all 14 Layer 3 Vector craft styles (0..13) render finite coordinates and honour layer1ShapeLifespan & layer1ShapeFillRatio
for (let shIdx = 0; shIdx < 14; shIdx++) {
    const stVec = createState();
    const cfgVec0 = normaliseConfig({
        layer1Enabled: true,
        layer1FieldEnabled: false,
        layer1EqEnabled: false,
        layer1ShapesEnabled: true,
        layer1ShapeStyle: shIdx,
        layer1ShapeDensity: 1.5,
        layer1ShapeLifespan: 2.0,
        layer1ShapeFillRatio: 0.0,
        layer2Enabled: false,
        layer3Enabled: false
    }, 0, []);
    if (Math.abs(cfgVec0.layer1ShapeLifespan - 2.0) > 0.01 || Math.abs(cfgVec0.layer1ShapeFillRatio - 0.0) > 0.01) {
        throw new Error('normaliseConfig failed to preserve layer1ShapeLifespan / layer1ShapeFillRatio');
    }
    stepState(stVec, new Array(64).fill(900), true, cfgVec0, 0.04);
    stVec.beatPulse = 0.9;
    stepState(stVec, new Array(64).fill(900), true, cfgVec0, 0.04);
    const ctxVec0 = makeTrackCtx();
    renderFrame(ctxVec0, 640, 360, stVec, 0, theme, [], [], [], cfgVec0, null);
    const cfgVec1 = normaliseConfig(Object.assign({}, cfgVec0, { layer1ShapeFillRatio: 0.85 }), 0, []);
    const ctxVec1 = makeTrackCtx();
    renderFrame(ctxVec1, 640, 360, stVec, 0, theme, [], [], [], cfgVec1, null);
    if (ctxVec1.fillCount <= ctxVec0.fillCount) {
        throw new Error(`Expected shapeStyle ${shIdx} with fillRatio=0.85 to fill more facets than fillRatio=0.0 (${ctxVec1.fillCount} vs ${ctxVec0.fillCount})`);
    }
}

console.log('OK');
"""
        res = subprocess.run(["node", "-e", node_script], cwd=REPO_ROOT, capture_output=True, text=True, timeout=20)
        self.assertEqual(res.returncode, 0, f"Node test_20 failed: {res.stderr}")
        with open(os.path.join(REPO_ROOT, "Visualiser.qml"), "r", encoding="utf-8") as f:
            viz_src = f.read()
        self.assertIn("property bool showKeybindingsSheet: false", viz_src)
        self.assertIn("id: keybindingsSheetModal", viz_src)
        self.assertIn("󰌌 Keys (?)", viz_src)
        self.assertIn("layer1EqBandOrder:", viz_src)

    def test_21_shader_worlds_layer_opacity_toast_and_volume_controls(self):
        # 1. Verify ShdTrench (l1m == 5) and ShdTRON (l1m == 7) in share/psychedelic.frag
        frag_path = os.path.join(REPO_ROOT, "share", "psychedelic.frag")
        qsb_path = os.path.join(REPO_ROOT, "share", "psychedelic.frag.qsb")
        with open(frag_path, "r", encoding="utf-8") as f:
            frag_src = f.read()
        self.assertIn("ShdTrench: True 3D Star Wars Death Star Trench Run", frag_src)
        self.assertIn("Exhaust Port Torpedo Bay", frag_src)
        self.assertIn("Separated 3D Armoured Gun Turrets with Articulated Twin Laser Cannons", frag_src)
        self.assertIn("stage1Yellow", frag_src)
        self.assertIn("stage2Green", frag_src)
        self.assertIn("stage3Red", frag_src)
        self.assertIn("float l1Bright = clamp(1.0 - uL1Dim, 0.04, 1.0);", frag_src)
        self.assertIn("float bIntensity = clamp(uComplexity, 0.04, 2.0);", frag_src)
        self.assertGreaterEqual(os.path.getmtime(qsb_path), os.path.getmtime(frag_path) - 5.0)

        # 2. Verify Node.js evaluation of:
        #    - Distinct EQ geometries for eqStyle 0, 1, 5, 6, 7, 13, 16, 18, 22, 23
        #    - Alien Mycelium (shapeStyle 9) bounded radius cap
        #    - All 6 per-layer opacities (layer1Opacity, layer1EqOpacity, layer1ShapesOpacity, layer2Opacity, layer4Opacity, layer3Opacity)
        if shutil.which("node"):
            node_script = r"""
const fs = require('fs');
let code = fs.readFileSync('PsychedelicEngine.js', 'utf8').replace(/^\.pragma library\s*/m, '');
eval(code);

function makeAlphaCtx() {
    return {
        alphas: [], fillCount: 0, strokeCount: 0, maxArcR: 0,
        fillStyle: '', strokeStyle: '', lineWidth: 1, lineCap: 'butt', lineJoin: 'miter',
        globalAlpha: 1, globalCompositeOperation: 'source-over', font: '12px monospace',
        save() {}, restore() {}, translate() {}, rotate() {}, scale() {},
        beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, quadraticCurveTo() {}, bezierCurveTo() {},
        rect() {},
        arc(x, y, r) { if (r > this.maxArcR) this.maxArcR = r; },
        fill() { this.fillCount++; this.alphas.push(this.globalAlpha); },
        stroke() { this.strokeCount++; this.alphas.push(this.globalAlpha); },
        fillRect(rx, ry, rw, rh) { this.fillCount++; if (rw < 600) this.alphas.push(this.globalAlpha); },
        strokeRect() { this.strokeCount++; this.alphas.push(this.globalAlpha); },
        clearRect() {},
        fillText() { this.fillCount++; this.alphas.push(this.globalAlpha); },
        strokeText() { this.strokeCount++; this.alphas.push(this.globalAlpha); },
        drawImage() {},
        createLinearGradient() { return { addColorStop() {} }; },
        createRadialGradient() { return { addColorStop() {} }; }
    };
}

const bands = Array.from({length: 64}, (_, i) => 450 + 350 * Math.sin(i * 0.25));
const theme = { accent: '#6ee7b7', urgent: '#f472b6', foreground: '#e2e8f0', background: '#07090e' };

// A. Verify all 6 per-layer opacities normalise and clamp [0.05, 1.0] and scale canvas globalAlpha
const cfgOp = normaliseConfig({
    layer1Opacity: 0.35,
    layer1EqOpacity: 0.40,
    layer1ShapesOpacity: 0.45,
    layer2Opacity: 0.50,
    layer4Opacity: 0.55,
    layer3Opacity: 0.60
}, 0, []);
if (Math.abs(cfgOp.layer1Opacity - 0.35) > 0.001 ||
    Math.abs(cfgOp.layer1EqOpacity - 0.40) > 0.001 ||
    Math.abs(cfgOp.layer1ShapesOpacity - 0.45) > 0.001 ||
    Math.abs(cfgOp.layer2Opacity - 0.50) > 0.001 ||
    Math.abs(cfgOp.layer4Opacity - 0.55) > 0.001 ||
    Math.abs(cfgOp.layer3Opacity - 0.60) > 0.001) {
    throw new Error('normaliseConfig failed to preserve 6 per-layer opacities');
}

// Verify Layer 2 EQ opacity scales alpha down when layer1EqOpacity=0.20 vs 1.0 across all differentiated EQ styles
for (const eqIdx of [0, 1, 5, 6, 7, 13, 16, 18, 22, 23]) {
    const stFull = createState();
    const cfgFull = normaliseConfig({
        layer1Enabled: true, layer1FieldEnabled: false,
        layer1EqEnabled: true, layer1EqStyle: eqIdx, layer1EqOpacity: 1.0,
        layer1ShapesEnabled: false, layer2Enabled: false, layer3Enabled: false
    }, 0, []);
    stepState(stFull, bands, true, cfgFull, 0.03);
    const ctxFull = makeAlphaCtx();
    renderFrame(ctxFull, 640, 360, stFull, 0, theme, [], [], [], cfgFull, null);

    const cfgDim = normaliseConfig(Object.assign({}, cfgFull, { layer1EqOpacity: 0.20 }), 0, []);
    const ctxDim = makeAlphaCtx();
    renderFrame(ctxDim, 640, 360, stFull, 0, theme, [], [], [], cfgDim, null);

    const maxAlphaFull = Math.max(...ctxFull.alphas);
    const maxAlphaDim = Math.max(...ctxDim.alphas);
    if (!(maxAlphaDim < maxAlphaFull * 0.35)) {
        throw new Error(`EQ style ${eqIdx} did not scale alpha with layer1EqOpacity=0.20 (${maxAlphaDim} vs ${maxAlphaFull})`);
    }
}

// B. Verify Alien Mycelium (shapeStyle 9) caps node radius even at extreme scale (layer1ShapeScale=2.5, beatPulse=1.0)
const stMyc = createState();
const cfgMyc = normaliseConfig({
    layer1Enabled: true, layer1FieldEnabled: false, layer1EqEnabled: false,
    layer1ShapesEnabled: true, layer1ShapeStyle: 9, layer1ShapeScale: 2.5, layer1ShapeDensity: 2.0,
    layer2Enabled: false, layer3Enabled: false
}, 0, []);
for (let f = 0; f < 6; f++) {
    stMyc.beatPulse = 1.0;
    stMyc.bass = 1.0;
    stepState(stMyc, new Array(64).fill(990), true, cfgMyc, 0.04);
}
const ctxMyc = makeAlphaCtx();
renderFrame(ctxMyc, 640, 360, stMyc, 0, theme, [], [], [], cfgMyc, null);
if (ctxMyc.maxArcR > 640 * 0.14) {
    throw new Error(`Alien Mycelium arc radius exceeded screen cap: ${ctxMyc.maxArcR}`);
}
console.log('OK');
"""
            res = subprocess.run(["node", "-e", node_script], cwd=REPO_ROOT, capture_output=True, text=True, timeout=15)
            self.assertEqual(res.returncode, 0, f"Node test_21 failed: {res.stderr}")

        # 3. Verify Visualiser.qml, Service.qml, App.qml, and Panel.qml wire up:
        #    - keybindingToastEnabled toggle in Tab 7 (using keybindingToastTimer.stop(), no undefined keybindingToastHideTimer)
        #    - 6 per-layer opacity sliders in Studio Tabs 1..6 and Quick Bar Row 2
        #    - volume/muted properties + PgUp/PgDn shortcuts + mute/slider transport controls
        with open(os.path.join(REPO_ROOT, "Visualiser.qml"), "r", encoding="utf-8") as f:
            viz_src = f.read()
        with open(os.path.join(REPO_ROOT, "Service.qml"), "r", encoding="utf-8") as f:
            svc_src = f.read()
        with open(os.path.join(REPO_ROOT, "App.qml"), "r", encoding="utf-8") as f:
            app_src = f.read()
        with open(os.path.join(REPO_ROOT, "Panel.qml"), "r", encoding="utf-8") as f:
            panel_src = f.read()

        self.assertNotIn("keybindingToastHideTimer", viz_src)
        for prop in (
            "property bool keybindingToastEnabled: true",
            "property int paletteRandomMode: 0",
            "property int paletteCollectionIndex: 0",
            "function pickRandomPalette(stepSequential)",
            "function selectPaletteCollection(idx)",
            '"27:Invaders"',
            "property real layer1Opacity: 1.0",
            "property real layer1EqOpacity: 1.0",
            "property real layer1ShapesOpacity: 1.0",
            "property real layer2Opacity: 1.0",
            "property real layer4Opacity: 1.0",
            "property real layer3Opacity: 1.0",
            'label: "Layer 1 Opacity"',
            'label: "Layer 2 Opacity"',
            'label: "Layer 3 Opacity"',
            'label: "Layer 4 Opacity"',
            'label: "Layer 5 Opacity"',
            'label: "Layer 6 Opacity"',
            "⌨ Key Toast: ON",
            "signal requestSetVolume(int vol)",
            "signal requestAdjustVolume(int delta)",
            "signal requestToggleMute()",
            "function rebalanceRandomLayerOpacities()",
            "property real layer1ShapeFillOpacity: 0.55",
            "property real layer1EqGain: 0.80",
        ):
            self.assertIn(prop, viz_src, f"Visualiser.qml missing {prop}")

        self.assertIn("bandarchy-prev-state", svc_src)
        self.assertIn("omarchy-shell notifications setDnd", svc_src)

        for fn in ("function setVolume(vol)", "function adjustVolume(delta)", "function toggleMute()"):
            self.assertIn(fn, svc_src, f"Service.qml missing {fn}")

        for qml_name, src in (("App.qml", app_src), ("Panel.qml", panel_src)):
            self.assertIn("onRequestSetVolume:", src, f"{qml_name} missing onRequestSetVolume")
            self.assertIn("onRequestAdjustVolume:", src, f"{qml_name} missing onRequestAdjustVolume")
            self.assertIn("onRequestToggleMute:", src, f"{qml_name} missing onRequestToggleMute")
            self.assertIn("Qt.Key_PageUp", src, f"{qml_name} missing PgUp volume keybinding")
            self.assertIn("Qt.Key_PageDown", src, f"{qml_name} missing PgDn volume keybinding")
            self.assertIn("function selectPlayingAlbumInCatalog(", src, f"{qml_name} missing selectPlayingAlbumInCatalog")

        # 4. Verify CLI `bandarchy volume` and `bandarchy cmd volume/mute` + boundary clamping
        vol_set = self.run_cli("volume", "65")
        self.assertEqual(vol_set["volume"], 65)
        self.assertFalse(vol_set["muted"])

        vol_up = self.run_cli("volume", "+10")
        self.assertEqual(vol_up["volume"], 75)

        vol_clamp_hi = self.run_cli("volume", "+999")
        self.assertEqual(vol_clamp_hi["volume"], 100)

        vol_clamp_lo = self.run_cli("volume", "-999")
        self.assertEqual(vol_clamp_lo["volume"], 0)

        vol_cmd = self.run_cli("cmd", "volume", "80")
        self.assertEqual(vol_cmd["volume"], 80)

        vol_mute = self.run_cli("volume", "mute")
        self.assertTrue(vol_mute["muted"])

        vol_unmute = self.run_cli("volume", "unmute")
        self.assertFalse(vol_unmute["muted"])

        # Restore 100% volume
        self.run_cli("volume", "100")

        # 5. Verify End-of-Album Track 1 Replay vs Stopped-Mid-Track Resume
        self.run_cli("cmd", "stop")
        queue_file = os.path.join(self.data_dir, "queue.json")
        t1 = os.path.join(self.music_dir, "Steven Wilson - Insurgentes", "01 Harmony Korine.wav")
        t2 = os.path.join(self.music_dir, "Steven Wilson - Insurgentes", "02 Abandoner.wav")
        # Case A: Natural end-of-album (mpv exited on last track, stoppedMidTrack=False) -> status resets to Track 1 (playlistPos 0, position 0.0)
        with open(queue_file, "w", encoding="utf-8") as qf:
            json.dump({
                "tracks": [
                    {"title": "Harmony Korine", "artist": "Steven Wilson", "album": "Insurgentes", "source": t1, "duration": 96.0},
                    {"title": "Abandoner", "artist": "Steven Wilson", "album": "Insurgentes", "source": t2, "duration": 96.0},
                ],
                "playlistPos": 1,
                "position": 95.5,
                "stoppedMidTrack": False,
                "albumTitle": "Insurgentes",
                "artist": "Steven Wilson",
            }, qf)
        st_eoa = self.run_cli("now")
        self.assertEqual(st_eoa["playlistPos"], 0)
        self.assertEqual(st_eoa["title"], "Harmony Korine")
        self.assertEqual(st_eoa["position"], 0.0)

        # Case B: User explicitly stopped mid-track on Track 2 (stoppedMidTrack=True) -> preserves Track 2 (playlistPos 1) and position
        with open(queue_file, "w", encoding="utf-8") as qf:
            json.dump({
                "tracks": [
                    {"title": "Harmony Korine", "artist": "Steven Wilson", "album": "Insurgentes", "source": t1, "duration": 96.0},
                    {"title": "Abandoner", "artist": "Steven Wilson", "album": "Insurgentes", "source": t2, "duration": 96.0},
                ],
                "playlistPos": 1,
                "position": 42.5,
                "stoppedMidTrack": True,
                "albumTitle": "Insurgentes",
                "artist": "Steven Wilson",
            }, qf)
        st_mid = self.run_cli("now")
        self.assertEqual(st_mid["playlistPos"], 1)
        self.assertEqual(st_mid["title"], "Abandoner")
        self.assertAlmostEqual(st_mid["position"], 42.5, places=1)

    def test_22_layer6_numbered_styles_album_palette_synthesis_3mode_rand_and_equaliser(self):
        with open(os.path.join(REPO_ROOT, "Visualiser.qml"), "r", encoding="utf-8") as f:
            viz_src = f.read()
        with open(os.path.join(REPO_ROOT, "Spectrum.qml"), "r", encoding="utf-8") as f:
            spec_src = f.read()
        with open(os.path.join(REPO_ROOT, "Panel.qml"), "r", encoding="utf-8") as f:
            panel_src = f.read()

        # 1. Verify Visualiser.qml wires up 3-mode Layer 6 randomiser, 0..30s transition pause, Toast ON/OFF pill & U/I/J/O shortcuts, and non-red windowed equaliser
        for expected in (
            "readonly property var layer3RandomModes: Engine.LAYER3_RANDOM_MODES",
            "readonly property var shortL3RandomModes: Engine.SHORT_LAYER3_RANDOM_MODES",
            "property int layer3RandomMode: 0",
            "function cycleLayer3RandomMode(delta)",
            "function toggleKeybindingToast()",
            'text: root.keybindingToastEnabled ? "⌨ Toast:ON" : "⌨ Toast:OFF"',
            'label: "Transition Pause (0–30s)"',
            "active: root.playing && bottomHud.visible && bottomMeterBox.showSpectrumMeter",
            'text: "#" + (index + 1) + ": " + (root.useAlbumArt ? Engine.LAYER3_ART_STYLES[index] : Engine.LAYER3_TEXT_STYLES[index])',
            "Shift + 6       : Cycle Layer 6 Rand (OFF / Selected / Art⟷Words)",
            "U               : Toggle Keypress Feedback Toast ON / OFF",
        ):
            self.assertIn(expected, viz_src, f"Missing {expected} in Visualiser.qml")

        self.assertNotIn("active: root.playing && root.showHud && root.isFullscreen && bottomMeterBox.showSpectrumMeter", viz_src)
        self.assertNotIn("colUrgent", spec_src)
        self.assertNotIn("peakColour: root.colUrgent", panel_src)

        # 2. Verify in Node.js:
        #    - #1..#21 prefixes on SHORT_LAYER3_ART_STYLES and SHORT_LAYER3_TEXT_STYLES
        #    - LAYER3_RANDOM_MODES (3 modes) & normaliseConfig clamping for layer3RandomMode (0..2) and layer3TransitionPauseSec (0.0..30.0)
        #    - Slimmed #3 Rave Laser Stencil text border (lineWidth <= 1.25)
        #    - All 21 album art styles (0..20, including #17 Turing Coral at index 16 and #21 Tomography at index 20)
        #      synthesise BOTH album-cover RGB colours AND active palette colours, with zero dark backing plates
        if shutil.which("node"):
            node_script = r"""
const fs = require('fs');
let code = fs.readFileSync('PsychedelicEngine.js', 'utf8').replace(/^\.pragma library\s*/m, '');
eval(code);

if (SHORT_LAYER3_ART_STYLES.length !== 21 || SHORT_LAYER3_TEXT_STYLES.length !== 21) {
    throw new Error('Expected 21 SHORT_LAYER3_ART_STYLES and SHORT_LAYER3_TEXT_STYLES');
}
for (let i = 0; i < 21; i++) {
    const prefix = '#' + (i + 1) + ' ';
    if (!SHORT_LAYER3_ART_STYLES[i].startsWith(prefix)) {
        throw new Error(`SHORT_LAYER3_ART_STYLES[${i}] missing "${prefix}": ${SHORT_LAYER3_ART_STYLES[i]}`);
    }
    if (!SHORT_LAYER3_TEXT_STYLES[i].startsWith(prefix)) {
        throw new Error(`SHORT_LAYER3_TEXT_STYLES[${i}] missing "${prefix}": ${SHORT_LAYER3_TEXT_STYLES[i]}`);
    }
}

if (LAYER3_RANDOM_MODES.length !== 3 || SHORT_LAYER3_RANDOM_MODES.length !== 3) {
    throw new Error('Expected 3 LAYER3_RANDOM_MODES');
}

// Verify 0.0..30.0 clamping on layer3TransitionPauseSec and 0..2 on layer3RandomMode
const cfgZero = normaliseConfig({ layer3TransitionPauseSec: 0.0, layer3RandomMode: 0 }, 0, []);
const cfgMid  = normaliseConfig({ layer3TransitionPauseSec: 12.5, layer3RandomMode: 1 }, 0, []);
const cfgHigh = normaliseConfig({ layer3TransitionPauseSec: 45.0, layer3RandomMode: 9 }, 0, []);
const cfgNeg  = normaliseConfig({ layer3TransitionPauseSec: -5.0, layer3RandomMode: -2 }, 0, []);
if (cfgZero.layer3TransitionPauseSec !== 0.0 || cfgZero.layer3RandomMode !== 0) {
    throw new Error('Failed 0.0s pause / mode 0 normalisation: ' + JSON.stringify(cfgZero));
}
if (Math.abs(cfgMid.layer3TransitionPauseSec - 12.5) > 0.001 || cfgMid.layer3RandomMode !== 1) {
    throw new Error('Failed 12.5s pause / mode 1 normalisation');
}
if (cfgHigh.layer3TransitionPauseSec !== 30.0 || cfgHigh.layer3RandomMode !== 2) {
    throw new Error('Failed upper bound clamping (30.0s / mode 2): ' + JSON.stringify(cfgHigh));
}
if (cfgNeg.layer3TransitionPauseSec !== 0.0 || cfgNeg.layer3RandomMode !== 0) {
    throw new Error('Failed lower bound clamping (0.0s / mode 0): ' + JSON.stringify(cfgNeg));
}

function makeInspectCtx() {
    return {
        fillStyles: [], strokeStyles: [], lineWidths: [], strokeTextCount: 0, fillTextCount: 0,
        fillCount: 0, strokeCount: 0, arcCount: 0, darkPlateCount: 0,
        fillStyle: '', strokeStyle: '', lineWidth: 1, lineCap: 'butt', lineJoin: 'miter',
        globalAlpha: 1, globalCompositeOperation: 'source-over', font: '12px monospace',
        save() {}, restore() {}, translate() {}, rotate() {}, scale() {},
        beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, quadraticCurveTo() {}, bezierCurveTo() {},
        rect() {}, arc() { this.arcCount++; },
        fill() {
            this.fillCount++;
            this.fillStyles.push(String(this.fillStyle));
            if (String(this.fillStyle).startsWith('rgba(4, 6, 12') || String(this.fillStyle).startsWith('rgba(2, 4, 8')) {
                this.darkPlateCount++;
            }
        },
        stroke() {
            this.strokeCount++;
            this.strokeStyles.push(String(this.strokeStyle));
            this.lineWidths.push(this.lineWidth);
        },
        fillRect() {
            this.fillCount++;
            this.fillStyles.push(String(this.fillStyle));
        },
        strokeRect() {
            this.strokeCount++;
            this.strokeStyles.push(String(this.strokeStyle));
            this.lineWidths.push(this.lineWidth);
        },
        clearRect() {},
        fillText() { this.fillTextCount++; this.fillStyles.push(String(this.fillStyle)); },
        strokeText() { this.strokeTextCount++; this.strokeStyles.push(String(this.strokeStyle)); this.lineWidths.push(this.lineWidth); },
        drawImage() {},
        createLinearGradient() { return { addColorStop() {} }; },
        createRadialGradient() { return { addColorStop() {} }; }
    };
}

const state = createState();
const theme = { accent: '#6ee7b7', urgent: '#f472b6', foreground: '#e2e8f0', background: '#07090e' };
const bands = Array.from({length: 64}, (_, i) => 500 + 300 * Math.sin(i * 0.3));

// Verify #3: Rave Laser Stencil (layer3TextStyle = 2) uses slim border (lineWidth <= 1.25)
const ctxLaser = makeInspectCtx();
const cfgLaser = normaliseConfig({
    layer1Enabled: false, layer2Enabled: false, layer3Enabled: true,
    useAlbumArt: false, asciiMode: 'text', layer3Tracers: 1,
    layer3Mode: 0, layer3TextStyle: 2, layer3ColourMode: 0,
    layer3ShowArtist: false, layer3ShowTrack: true, layer3ShowAlbum: false,
    trackTitle: 'RAVE LASER STENCIL'
}, 0, []);
stepState(state, bands, true, cfgLaser, 0.03);
drawLayer3AlbumArt(ctxLaser, 640, 360, state, buildPalette(theme, state.hueShift, 0), cfgLaser, [], []);
if (ctxLaser.strokeTextCount < 1 || Math.max(...ctxLaser.lineWidths) > 1.25) {
    throw new Error('Expected slimmed #3 Rave Laser Stencil border <= 1.25px, got ' + JSON.stringify(ctxLaser.lineWidths));
}

// Verify all 21 Album Art styles (0..20, including #17 Turing Coral at 16 and #21 Tomography at 20)
// synthesise BOTH true album-cover RGB colours AND active palette colours, with zero dark backing plates
const artWarm = Array.from({length: 14}, (_, r) =>
    '\x1b[38;2;250;' + (60 + r * 8) + ';30m⣿⣷⣯⣟⡿⢿⣻⣽\x1b[0m'.repeat(3)
);
const artCool = Array.from({length: 14}, (_, r) =>
    '\x1b[38;2;20;' + (140 + r * 6) + ';250m⣿⣷⣯⣟⡿⢿⣻⣽\x1b[0m'.repeat(3)
);

for (let stIdx = 0; stIdx < 21; stIdx++) {
    const ctxWarmP0 = makeInspectCtx();
    const ctxCoolP0 = makeInspectCtx();
    const ctxWarmP5 = makeInspectCtx();

    const cfgW0 = normaliseConfig({
        layer1Enabled: false, layer2Enabled: false, layer3Enabled: true,
        useAlbumArt: true, asciiMode: 'braille', layer3Tracers: 1,
        layer3Mode: 0, layer3TextStyle: stIdx, palette: 0, artLines: artWarm
    }, 0, artWarm);
    const cfgC0 = normaliseConfig({
        layer1Enabled: false, layer2Enabled: false, layer3Enabled: true,
        useAlbumArt: true, asciiMode: 'braille', layer3Tracers: 1,
        layer3Mode: 0, layer3TextStyle: stIdx, palette: 0, artLines: artCool
    }, 0, artCool);
    const cfgW5 = normaliseConfig({
        layer1Enabled: false, layer2Enabled: false, layer3Enabled: true,
        useAlbumArt: true, asciiMode: 'braille', layer3Tracers: 1,
        layer3Mode: 0, layer3TextStyle: stIdx, palette: 5, artLines: artWarm
    }, 5, artWarm);

    drawLayer3AlbumArt(ctxWarmP0, 640, 360, state, buildPalette(theme, state.hueShift, 0), cfgW0, artWarm, []);
    drawLayer3AlbumArt(ctxCoolP0, 640, 360, state, buildPalette(theme, state.hueShift, 0), cfgC0, artCool, []);
    drawLayer3AlbumArt(ctxWarmP5, 640, 360, state, buildPalette(theme, state.hueShift, 5), cfgW5, artWarm, []);

    if (ctxWarmP0.fillCount + ctxWarmP0.strokeCount < 6) {
        throw new Error(`Art style #${stIdx + 1} (${SHORT_LAYER3_ART_STYLES[stIdx]}) failed to draw geometry`);
    }
    if (ctxWarmP0.darkPlateCount !== 0) {
        throw new Error(`Art style #${stIdx + 1} (${SHORT_LAYER3_ART_STYLES[stIdx]}) drew forbidden dark backing plate`);
    }
    const sigW0 = ctxWarmP0.fillStyles.concat(ctxWarmP0.strokeStyles).join('|');
    const sigC0 = ctxCoolP0.fillStyles.concat(ctxCoolP0.strokeStyles).join('|');
    const sigW5 = ctxWarmP5.fillStyles.concat(ctxWarmP5.strokeStyles).join('|');
    if (sigW0 === sigC0) {
        throw new Error(`Art style #${stIdx + 1} (${SHORT_LAYER3_ART_STYLES[stIdx]}) did not respond to album-cover RGB colours`);
    }
    if (sigW0 === sigW5) {
        throw new Error(`Art style #${stIdx + 1} (${SHORT_LAYER3_ART_STYLES[stIdx]}) did not respond to active palette change`);
    }
}
console.log('OK');
"""
            res = subprocess.run(["node", "-e", node_script], cwd=REPO_ROOT, capture_output=True, text=True, timeout=25)
            self.assertEqual(res.returncode, 0, f"Node test_22 failed: {res.stderr}")


if __name__ == "__main__":
    unittest.main(verbosity=2)


