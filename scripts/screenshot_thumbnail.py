"""Screenshot a static HTML thumbnail to a PNG at 1280x720.

Usage:
  python scripts/screenshot_thumbnail.py demos/outcome-engineering/thumbnail.html \
      output/outcome-engineering/thumbnail.png
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


def main():
    html_path = Path(sys.argv[1]).resolve()
    out_path = Path(sys.argv[2]).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={"width": 1280, "height": 720},
            device_scale_factor=2,  # retina-quality source; YouTube re-encodes anyway
        )
        page = ctx.new_page()
        page.goto(html_path.as_uri())
        # Give fonts a beat to load
        page.wait_for_load_state("networkidle", timeout=10_000)
        page.wait_for_timeout(800)
        page.screenshot(path=str(out_path), omit_background=False, full_page=False)
        browser.close()

    print(f"Wrote {out_path} ({out_path.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
