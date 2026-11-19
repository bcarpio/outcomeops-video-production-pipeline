#!/usr/bin/env python3
"""Export a ``demos/<name>/`` React scene to a shareable MP4.

Headless Chromium loads the scene over a local HTTP server, records the
viewport for the Stage's duration, then ffmpeg stitches the recording
with the scene's ``narration.mp3`` and trims any page-load prefix.

Default output: 1920x1080 MP4 under ``output/<demo>/final.mp4`` — ready
to upload to YouTube or LinkedIn.

Usage:
    python export_demo.py demos/chat-analytics
    python export_demo.py demos/chat-analytics --viewport 1080x1920
    python export_demo.py demos/chat-analytics --output /tmp/out.mp4
"""

from __future__ import annotations

import argparse
import http.server
import logging
import re
import shutil
import socket
import socketserver
import sys
import threading
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

from lib.compositor import stitch

REPO_ROOT = Path(__file__).resolve().parent
log = logging.getLogger(__name__)


def free_port() -> int:
    with socket.socket() as s:
        s.bind(("", 0))
        return s.getsockname()[1]


def duration_from_index(index_html: Path) -> float:
    """Parse Stage's ``duration={...}`` prop from index.html."""
    text = index_html.read_text(encoding="utf-8")
    m = re.search(r"duration=\{(\d+(?:\.\d+)?)\}", text)
    if not m:
        raise ValueError(f"could not find Stage duration in {index_html}")
    return float(m.group(1))


def serve_directory(directory: Path, port: int) -> socketserver.TCPServer:
    """Start a quiet threaded HTTP server serving ``directory`` on ``port``."""
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=str(directory), **kw)
        def log_message(self, *a, **kw):
            pass

    server = socketserver.TCPServer(("127.0.0.1", port), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def record_scene(
    url: str,
    viewport: dict[str, int],
    duration: float,
    tmp_dir: Path,
) -> tuple[Path, float]:
    """Record ``duration`` seconds of the scene at ``url``.

    Clears the Stage's persisted playhead in localStorage before any page
    script runs so the recording always starts at t=0. Returns the webm
    path and the page-load offset (seconds to trim from the front of the
    recording before stitching with audio).
    """
    tmp_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            args=[
                "--autoplay-policy=no-user-gesture-required",
                "--disable-renderer-backgrounding",
                "--disable-backgrounding-occluded-windows",
            ],
        )
        ctx = browser.new_context(
            viewport=viewport,
            record_video_dir=str(tmp_dir),
            record_video_size=viewport,
        )
        # Wipe Stage's persisted playhead before Stage mounts — guarantees
        # recording starts at t=0 regardless of any prior browsing.
        ctx.add_init_script("try { localStorage.clear(); } catch (e) {}")

        page = ctx.new_page()

        goto_start = time.monotonic()
        page.goto(url, wait_until="load", timeout=60000)
        # Give Babel/React a moment to compile and mount the scene.
        page.wait_for_selector("audio", state="attached", timeout=10000)
        content_start = time.monotonic() - goto_start
        log.info(
            "page loaded + scene mounted in %.2fs; recording %.1fs of content",
            content_start, duration,
        )

        time.sleep(duration + 0.3)

        video = page.video
        ctx.close()
        browser.close()

        if video is None:
            raise RuntimeError("playwright did not produce a video")
        return Path(video.path()), content_start


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("demo_dir", type=Path, help="Path to demos/<name>/")
    ap.add_argument("--output", type=Path, default=None,
                    help="Output MP4 (default: output/<demo>/final.mp4)")
    ap.add_argument("--viewport", default="1920x1080",
                    help="Viewport WxH (default: 1920x1080)")
    ap.add_argument("--audio", type=Path, default=None,
                    help="Audio file (default: <demo>/narration.mp3)")
    ap.add_argument("--query", default="",
                    help="Extra URL query string appended after ?export=1 (e.g. 'variant=cve')")
    ap.add_argument("--duration", type=float, default=None,
                    help="Override Stage duration in seconds (default: parse from index.html)")
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )

    demo_dir = args.demo_dir.resolve()
    if not demo_dir.is_dir():
        sys.exit(f"not a directory: {demo_dir}")
    index_html = demo_dir / "index.html"
    if not index_html.exists():
        sys.exit(f"missing {index_html}")
    audio = args.audio or (demo_dir / "narration.mp3")
    if not audio.exists():
        sys.exit(f"missing audio: {audio}")

    output = args.output or (REPO_ROOT / "output" / demo_dir.name / "final.mp4")
    output.parent.mkdir(parents=True, exist_ok=True)

    w, h = map(int, args.viewport.split("x"))
    viewport = {"width": w, "height": h}

    if args.duration is not None:
        duration = args.duration
        log.info("Stage duration: %.1fs (override)", duration)
    else:
        duration = duration_from_index(index_html)
        log.info("Stage duration: %.1fs", duration)

    # Serve demos/ as the web root so relative paths inside the scene work.
    serve_root = demo_dir.parent
    port = free_port()
    server = serve_directory(serve_root, port)
    log.info("serving %s on port %s", serve_root, port)

    try:
        # ?export=1 lets the scene switch to a 16:9 full-bleed layout
        # (no playback bar, width tuned for zero letterboxing at 1920x1080).
        extra = f"&{args.query}" if args.query else ""
        url = f"http://127.0.0.1:{port}/{demo_dir.name}/?export=1{extra}"
        tmp_dir = output.parent / "_export_tmp"

        webm_path, content_start = record_scene(url, viewport, duration, tmp_dir)
        log.info("recorded %s (will trim %.2fs from front)", webm_path, content_start)

        stitch(
            video=webm_path,
            audio=audio,
            output=output,
            video_start=content_start,
        )
        shutil.rmtree(tmp_dir, ignore_errors=True)
        log.info("done — %s", output)
        return 0
    finally:
        server.shutdown()


if __name__ == "__main__":
    sys.exit(main())
