"""Drive a headless browser through the live site and record video.

Uses Playwright's built-in video recording (one webm per BrowserContext).
The recorder runs a YAML-defined sequence of waits/clicks/scrolls/types
synced to the audio duration, then closes the context which finalizes
the file.
"""

from __future__ import annotations

import logging
import shutil
import time
from pathlib import Path
from typing import Any, Iterable, NamedTuple

from playwright.sync_api import Page, sync_playwright

log = logging.getLogger(__name__)


class RecordingResult(NamedTuple):
    """What ``record()`` returns. ``content_start`` is the number of seconds
    at the head of the webm that are page-load overhead (before interactions
    begin). The compositor trims this off so the final video's content
    lines up with the audio's t=0."""

    path: Path
    content_start: float


def record(
    *,
    url: str,
    output_path: Path,
    target_seconds: float,
    viewport: dict[str, int] | None = None,
    interactions: Iterable[dict[str, Any]] | None = None,
    headless: bool = True,
) -> RecordingResult:
    """Record a video of ``url`` for ``target_seconds`` of CONTENT, save to ``output_path``.

    The recording actually starts when Playwright creates the BrowserContext,
    which is before ``page.goto()`` completes. That page-load prefix is
    captured as ``content_start`` (seconds) in the returned tuple so the
    compositor can trim it. After the prefix, the recorder runs interactions
    and holds long enough that the usable tail equals ``target_seconds``.

    ``interactions`` is a list of step dicts. Each step is one of:

    - ``{"wait_for": "css selector", "timeout": 5000}`` — block until selector appears
    - ``{"wait": 3}`` — sleep N seconds
    - ``{"click": "css selector"}`` — click an element
    - ``{"hover": "css selector"}`` — hover over an element
    - ``{"type": "css selector", "text": "..."}`` — type into an input
    - ``{"scroll": 400}`` — scroll the window by N pixels
    - ``{"goto": "https://..."}`` — navigate to a different URL
    """
    viewport = viewport or {"width": 1920, "height": 1080}
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Playwright writes the recording into ``record_video_dir`` with an
    # auto-generated filename, then we move it to ``output_path``.
    tmp_dir = output_path.parent / "_recording_tmp"
    tmp_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=headless)
        context = browser.new_context(
            viewport=viewport,
            record_video_dir=str(tmp_dir),
            record_video_size=viewport,
        )
        page = context.new_page()
        log.info("recording -> %s (target %.1fs of content)", output_path, target_seconds)

        goto_started = time.monotonic()
        page.goto(url, wait_until="networkidle")
        content_start = time.monotonic() - goto_started
        log.info("page loaded in %.2fs; content timing begins now", content_start)

        content_started_at = time.monotonic()
        for step in interactions or []:
            _run_step(page, step)

        elapsed = time.monotonic() - content_started_at
        remaining = target_seconds - elapsed
        if remaining > 0:
            log.info("holding for %.2fs to match audio length", remaining)
            time.sleep(remaining)

        page_video = page.video
        context.close()
        browser.close()

        if page_video is None:
            raise RuntimeError("playwright did not produce a video")
        recorded = Path(page_video.path())

    # Move the recorded webm into place and clean up the tmp dir.
    if output_path.exists():
        output_path.unlink()
    shutil.move(str(recorded), str(output_path))
    shutil.rmtree(tmp_dir, ignore_errors=True)

    log.info("recorded %s (will trim %.2fs of page-load from the front)", output_path, content_start)
    return RecordingResult(path=output_path, content_start=content_start)


def _run_step(page: Page, step: dict[str, Any]) -> None:
    """Dispatch a single interaction step against the live page."""
    if "wait_for" in step:
        page.wait_for_selector(step["wait_for"], timeout=step.get("timeout", 5000))
    elif "wait" in step:
        time.sleep(float(step["wait"]))
    elif "click" in step:
        page.click(step["click"])
    elif "hover" in step:
        page.hover(step["hover"])
    elif "type" in step:
        page.fill(step["type"], step["text"])
    elif "scroll" in step:
        page.evaluate(f"window.scrollBy(0, {int(step['scroll'])})")
    elif "goto" in step:
        page.goto(step["goto"], wait_until="networkidle")
    else:
        raise ValueError(f"unknown interaction step: {step!r}")
