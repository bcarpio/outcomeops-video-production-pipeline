# OutcomeOps Video Production Pipeline

The pipeline that produces the [OutcomeOps](https://www.outcomeops.ai)
product and marketing videos entirely from text files in git. No video
editor is ever opened. Every scene is a small React app on a single
animation clock, narration timestamps drive the timing, and headless
Chromium renders the MP4. `CLAUDE.md` is the full operating manual;
this file is the map.

The `demos/` folder holds the real scenes behind the published
OutcomeOps videos, with staged data only. Use them as worked examples:
the engine (`animations.jsx`, `export_demo.py`, `lib/compositor.py`,
the synth scripts) is product-agnostic, and the pattern of pointing
`CLAUDE.md` at your own product's source repo is the part worth
copying.

Generated media (`*.mp3`, `*.mp4`, `output/`) is not committed. Scenes
preview silently until you synthesize narration with your own
ElevenLabs key; the published videos are on the
[OutcomeOps YouTube channel](https://www.youtube.com/@OutcomeOps).

Licensed under Apache 2.0, like
[OutcomeOps itself](https://github.com/bcarpio/outcome-ops-ai-assist).

A finished video ships three artifacts:

| Artifact | Where |
|---|---|
| Final MP4 (H.264/AAC, faststart) | `output/<name>/final.mp4` |
| YouTube thumbnail (1280×720 PNG) | `output/<name>/thumbnail.png` |
| Title/description/tags for YouTube Studio | `output/<name>/youtube-metadata.md` |

## Main pipeline: React demo scenes (`demos/*/`)

Every recent video is a small folder of text:

```
demos/<name>/
  index.html       — mounts the Stage with the scene's duration
  scene.jsx        — the scene; compiled in-browser by Babel, no build step
  animations.jsx   — shared animation helpers
  narration.txt    — voice-over prose, split into [[B0]]..[[Bn]] beat markers
  narration.mp3    — synthesized voice-over (ElevenLabs Drew)
  narration.marks.json — beat label → start-time seconds
  thumbnail.html   — the YouTube thumbnail, designed in HTML
```

The Stage runs one `requestAnimationFrame` clock; every visual is a
pure function of that clock, so the scene at any given second looks the
same every time. The export is a real-time capture, which is why the
exporter disables throttling and backgrounding to hold 60fps.

The flow, in order:

1. **Visuals first, no audio.** Serve the repo root
   (`python3 -m http.server 8765`) and iterate on the scene in a real
   browser at `http://localhost:8765/demos/<name>/`. Layout tweaks
   are free; synthesis is not.
2. **Narration.** Write `narration.txt` with `[[BEAT]]` markers. A
   per-scene script in `scripts/synth_*.py` sends it to ElevenLabs
   (Drew, `q0IMILNRPxOgtBTS4taI`, `eleven_multilingual_v2`, speed 1.1)
   via the `/with-timestamps` endpoint, maps each beat's character
   offset to a timestamp, writes `narration.mp3` +
   `narration.marks.json`, and prints the timing constants to paste
   into `scene.jsx`. Sync is exact, not eyeballed. Synthesize once;
   iterate on pace with ffmpeg `atempo` instead of re-synthing.
3. **Export.** `python export_demo.py demos/<name>` records the scene
   in headless Chromium (Playwright, autoplay on, throttling off, 60fps)
   for the Stage's declared duration, then stitches with the narration
   via `lib/compositor.py`.
4. **Thumbnail + metadata.** `scripts/screenshot_thumbnail.py`
   screenshots `thumbnail.html` to `output/<name>/thumbnail.png`; write
   `output/<name>/youtube-metadata.md` (recommended title, A/B
   alternates, description, tags — plain ASCII).

The ElevenLabs API key lives in AWS SSM Parameter Store at
`/outcomeops-video-gen/eleven-labs` (SecureString) — fetched with
boto3, never `.env`, never hardcoded.

## Legacy pipeline: scene YAMLs (`generate.py`)

The original pipeline films the live product instead of an authored
scene: a YAML in `scenes/` names a URL and a list of interactions
(click/scroll/type); Claude Sonnet on AWS Bedrock writes the narration
from `brand_context.md`, AWS Polly Neural (default voice: Matthew)
renders it, Playwright records the real site for exactly the audio's
duration, and ffmpeg stitches `output/<scene>/final.mp4`.

```bash
python generate.py scenes/example.yaml     # smoke test
# --skip-narration / --skip-recording to iterate on one stage
# --headed to watch the browser and debug selectors
```

Still functional (used for the `outcomeops-ai-*` site walkthroughs),
but new work should use the demos pipeline above. Requires Bedrock
model access for `us.anthropic.claude-sonnet-4-6` in your region.

## Setup

```bash
git clone https://github.com/bcarpio/outcomeops-video-production-pipeline.git
cd outcomeops-video-production-pipeline
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install chromium
sudo apt-get install -y ffmpeg
```

Credentials: standard AWS credentials (env or `~/.aws/credentials`),
`AWS_REGION` defaults to `us-west-2`. Everything third-party (ElevenLabs)
is fetched from SSM with those same credentials.

## Serving previews

Always serve from the repo root so both `demos/` and `output/` resolve:

```bash
python3 -m http.server 8765
# http://localhost:8765/demos/<n>/  — live scene preview
# http://localhost:8765/output/<n>/final.mp4
```
