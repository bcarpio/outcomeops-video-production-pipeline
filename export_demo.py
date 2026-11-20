#!/usr/bin/env python3
"""Export a ``demos/<name>/`` React scene to a shareable MP4, frame by frame.

Headless Chromium loads the scene with Playwright's fake clock installed and
paused. For every output frame the exporter advances the clock by exactly
1/fps of a second (which drives the Stage's requestAnimationFrame loop), lets
React commit, advances any CSS animations and transitions by the same amount,
and takes a lossless screenshot. ffmpeg encodes the PNG frames with the
scene's ``narration.mp3`` starting at t=0.

Because nothing depends on wall-clock time, the output is a true N fps,
has no lossy intermediate recording, keeps audio in exact sync, and is the
same on every run regardless of how fast the machine is. Rendering takes
roughly 0.1 s per frame (about 6 minutes for a 60-second video at 60 fps);
use ``--fps 30`` for quicker drafts.

Default output: 1920x1080, 60 fps MP4 under ``output/<demo>/final.mp4``.

Usage:
    python export_demo.py demos/starter
    python export_demo.py demos/starter --fps 30
    python export_demo.py demos/starter --viewport 1080x1920
    python export_demo.py demos/starter --output /path/to/out.mp4
"""

from __future__ import annotations

import argparse
import functools
import http.server
import logging
import re
import socket
import socketserver
import sys
import threading
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

from lib.compositor import FrameEncoder

REPO_ROOT = Path(__file__).resolve().parent
log = logging.getLogger(__name__)

# Clock time the fake clock starts at, in ms. Any fixed value works; it only
# has to be the same on every run.
CLOCK_START_MS = 1_000

# Playwright's fake clock fires requestAnimationFrame on its own fixed 16 ms
# grid, which would quantize the Stage's clock and make frames judder. Instead,
# rAF callbacks are queued here and run by STEP_JS exactly once per frame, with
# the frame's exact timestamp. Installed after the fake clock, so it wins.
RAF_JS = """
(() => {
  const queue = new Map(); let next = 0;
  window.__exportRaf = queue;
  window.requestAnimationFrame = (cb) => { next += 1; queue.set(next, cb); return next; };
  window.cancelAnimationFrame = (id) => { queue.delete(id); };
})();
"""

# Runs once per frame, after the fake clock has advanced by dt:
#  1. Run the queued animation-frame callbacks (the Stage's clock) once, at
#     the current fake time.
#  2. Wait for React to commit. Its scheduler uses MessageChannel, not the
#     faked timers, so a few channel round trips let the render finish.
#  3. Advance CSS animations and transitions by the same step. They run on
#     the compositor's real clock, so each one is paused and seeked by hand:
#     a new animation is held at 0, an existing one moves forward by dt.
STEP_JS = """
async (dt) => {
  const flush = () => new Promise(r => {
    const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0);
  });
  const ts = performance.now();
  const due = [...window.__exportRaf.entries()];
  window.__exportRaf.clear();
  for (const [, cb] of due) cb(ts);
  for (let i = 0; i < 4; i++) await flush();
  const seen = (window.__exportSeenAnimations ||= new WeakSet());
  for (const a of document.getAnimations()) {
    if (!seen.has(a)) { seen.add(a); a.pause(); a.currentTime = 0; continue; }
    a.pause();
    a.currentTime = (a.currentTime || 0) + dt;
  }
}
"""


def free_port() -> int:
    with socket.socket() as s:
        s.bind(("", 0))
        return s.getsockname()[1]


def duration_from_index(index_html: Path) -> float:
    """Parse Stage's ``duration={...}`` prop from index.html."""
    text = index_html.read_text(encoding="utf-8")
    # Accepts duration={42.5} and duration={window.SCENE_DURATION || 42.5}.
    m = re.search(r"duration=\{[^}]*?(\d+(?:\.\d+)?)\s*\}", text)
    if not m:
        raise ValueError(f"could not find a numeric Stage duration={{...}} in {index_html}")
    return float(m.group(1))


def duration_from_beats(demo_dir: Path) -> float | None:
    """Read ``window.SCENE_DURATION`` from a beats.js written by scripts/synth.py."""
    beats = demo_dir / "beats.js"
    if not beats.exists():
        return None
    m = re.search(r"window\.SCENE_DURATION\s*=\s*(\d+(?:\.\d+)?)", beats.read_text(encoding="utf-8"))
    return float(m.group(1)) if m else None


def serve_directory(directory: Path, port: int) -> socketserver.TCPServer:
    """Start a quiet threaded HTTP server serving ``directory`` on ``port``."""
    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **kw):
            pass

    server = socketserver.ThreadingTCPServer(
        ("127.0.0.1", port), functools.partial(Handler, directory=str(directory)))
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def render_frames(url: str, viewport: dict[str, int], duration: float, fps: int, encoder: FrameEncoder) -> int:
    """Step the scene frame by frame and hand each PNG to ``encoder``."""
    total = round(duration * fps)
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=["--autoplay-policy=no-user-gesture-required"])
        ctx = browser.new_context(viewport=viewport)
        # Stage persists its playhead in localStorage; clear it so every
        # export starts at t=0.
        ctx.add_init_script("try { localStorage.clear(); } catch (e) {}")
        page = ctx.new_page()

        # Fake clock, paused before any page script runs: Date, timers,
        # performance.now and requestAnimationFrame only move when we say so.
        page.clock.install(time=0)
        page.clock.pause_at(CLOCK_START_MS)
        page.add_init_script(RAF_JS)

        page.goto(url, wait_until="load", timeout=60000)
        page.wait_for_selector("audio", state="attached", timeout=30000)
        page.evaluate("() => document.fonts.ready.then(() => true)")

        # Prime one frame: the Stage's first animation frame only records its
        # start timestamp, so frame 0 is the scene at exactly t=0.
        page.evaluate(STEP_JS, 0)

        started, elapsed_ms = time.monotonic(), 0
        for i in range(total):
            if i:
                target_ms = round(i * 1000 / fps)
                dt = target_ms - elapsed_ms
                page.clock.run_for(dt)
                page.evaluate(STEP_JS, dt)
                elapsed_ms = target_ms
            encoder.write(page.screenshot(type="png"))
            if (i + 1) % (fps * 5) == 0 or i + 1 == total:
                rate = (i + 1) / (time.monotonic() - started)
                log.info("frame %d/%d (%.1fs of video, %.1f frames/s, ~%ds left)",
                         i + 1, total, (i + 1) / fps, rate, (total - i - 1) / rate)
        browser.close()
    return total


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("demo_dir", type=Path, help="Path to demos/<name>/")
    ap.add_argument("--output", type=Path, default=None,
                    help="Output MP4 (default: output/<demo>/final.mp4)")
    ap.add_argument("--viewport", default="1920x1080",
                    help="Viewport WxH (default: 1920x1080)")
    ap.add_argument("--fps", type=int, default=60, help="Frames per second (default: 60)")
    ap.add_argument("--audio", type=Path, default=None,
                    help="Audio file (default: <demo>/narration.mp3)")
    ap.add_argument("--query", default="",
                    help="Extra URL query string appended after ?export=1 (e.g. 'variation=A')")
    ap.add_argument("--duration", type=float, default=None,
                    help="Override the duration in seconds (default: beats.js, else index.html)")
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
        sys.exit(f"missing audio: {audio} (run scripts/synth.py first, or pass --audio)")

    output = args.output or (REPO_ROOT / "output" / demo_dir.name / "final.mp4")
    output.parent.mkdir(parents=True, exist_ok=True)

    w, h = map(int, args.viewport.split("x"))
    viewport = {"width": w, "height": h}

    duration = args.duration or duration_from_beats(demo_dir) or duration_from_index(index_html)
    log.info("duration %.2fs at %d fps = %d frames", duration, args.fps, round(duration * args.fps))

    # Serve demos/ as the web root so relative paths inside the scene work.
    port = free_port()
    server = serve_directory(demo_dir.parent, port)
    try:
        # ?export=1 lets the scene switch to its export layout (no playback bar).
        extra = f"&{args.query}" if args.query else ""
        url = f"http://127.0.0.1:{port}/{demo_dir.name}/?export=1{extra}"
        with FrameEncoder(output=output, fps=args.fps, audio=audio, duration=duration) as encoder:
            frames = render_frames(url, viewport, duration, args.fps, encoder)
        log.info("done: %s (%d frames)", output, frames)
        return 0
    finally:
        server.shutdown()


if __name__ == "__main__":
    sys.exit(main())
