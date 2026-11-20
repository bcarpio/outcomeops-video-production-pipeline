# OutcomeOps Video Production Pipeline

The pipeline that produces the [OutcomeOps](https://www.outcomeops.ai)
product and marketing videos entirely from text files in git. No video
editor is ever opened. Every scene is a small React app on a single
animation clock, narration timestamps drive the timing, and headless
Chromium renders the MP4. `CLAUDE.md` is the full operating manual;
this file is the map.

## Example output

[![Audit. Cost. Control. Why InfoSec Picks OutcomeOps](https://img.youtube.com/vi/RpCEbzA0_Zs/maxresdefault.jpg)](https://www.youtube.com/watch?v=RpCEbzA0_Zs)

[Audit. Cost. Control. Why InfoSec Picks OutcomeOps](https://www.youtube.com/watch?v=RpCEbzA0_Zs)
was compiled by this pipeline. The product was never screen recorded
and no editor was opened. Its
source is [`demos/transparency/`](demos/transparency/), and you can
play the scene yourself from the catalog (see "Serving previews"
below).

## Build your own video

Everything in `demos/` except `demos/starter/` is OutcomeOps' own
material, kept as worked examples. To make a video for your product:

1. Follow **Setup** below.
2. Copy the starter scene: `cp -r demos/starter demos/my-video`. It is
   product-neutral: a title, a typed question, an answer that builds
   line by line, and an end card.
3. Serve the repo (`python3 -m http.server 8765`) and open
   `http://localhost:8765/demos/my-video/`. Edit `scene.jsx` until the
   visuals are right. No audio is needed yet, so this costs nothing.
4. Write `narration.txt` with a `[[B0]]`, `[[B1]]`, ... marker on its
   own line before each beat, one beat per visual moment.
5. Synthesize the voice and the timings:
   ```bash
   ELEVENLABS_API_KEY=... python scripts/synth.py demos/my-video/narration.txt
   ```
   (or put `ELEVENLABS_API_KEY=...` in a `.env` file in the repo root).
   It writes `narration.mp3` and `beats.js`; the starter scene loads
   `beats.js`, so its animation and duration follow the voice-over with
   nothing to copy. The default voice is Drew, one of ElevenLabs' stock
   voices; pass `--voice <voice_id>` to use another. Commercial use of
   the audio needs a paid ElevenLabs plan.
6. Export: `python export_demo.py demos/my-video` writes
   `output/my-video/final.mp4` (1920x1080, 60 fps). Use `--fps 30`
   for quicker drafts.

To have Claude Code build scenes for you, give it the same thing this
repo gives it for OutcomeOps: a CLAUDE.md that catalogs your product's
source repo, its routes and page components, stable selectors, and where
its styling lives. The sections of `CLAUDE.md` marked **(OutcomeOps
example)** show the shape; replace them with yours. Then ask for a scene
the way you would describe the video to an editor.

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
  beats.js         — the same beat times plus the duration, for the scene to load
  thumbnail.html   — the YouTube thumbnail, designed in HTML
```

`demos/starter/` is the minimal version of the same layout.

The Stage runs one animation clock; every visual is a pure function of
that clock, so the scene at any given second looks the same every time.
The exporter steps that clock exactly one frame at a time and
screenshots each frame, so the MP4 is a true 60 fps, in exact sync with
the narration, and identical on every run.

The flow, in order:

1. **Visuals first, no audio.** Serve the repo root
   (`python3 -m http.server 8765`) and iterate on the scene in a real
   browser at `http://localhost:8765/demos/<name>/`. Layout tweaks
   are free; synthesis is not.
2. **Narration.** Write `narration.txt` with `[[BEAT]]` markers.
   `scripts/synth.py` (or a per-scene `scripts/synth_*.py`, kept as
   examples of scenes with special timing needs) sends it to ElevenLabs
   (Drew, `q0IMILNRPxOgtBTS4taI`, `eleven_multilingual_v2`, speed 1.1)
   via the `/with-timestamps` endpoint, maps each beat's character
   offset to a timestamp, writes `narration.mp3` +
   `narration.marks.json`, and prints the timing constants to paste
   into `scene.jsx`. Sync is exact, not eyeballed. Synthesize once;
   iterate on pace with ffmpeg `atempo` instead of re-synthing.
   `scripts/synth.py` also writes `beats.js`, which `demos/starter`
   loads, so new scenes don't need any copying by hand.
3. **Export.** `python export_demo.py demos/<name>` loads the scene in
   headless Chromium with a paused fake clock, steps it 1/60 s per
   frame, screenshots each frame, and encodes the frames with the
   narration via `lib/compositor.py`. Expect about 0.1 s per frame
   (roughly 6 minutes for a 60-second video); `--fps 30` halves that
   for drafts.
4. **Thumbnail + metadata.** `scripts/screenshot_thumbnail.py`
   screenshots `thumbnail.html` to `output/<name>/thumbnail.png`; write
   `output/<name>/youtube-metadata.md` (recommended title, A/B
   alternates, description, tags — plain ASCII).

**ElevenLabs API key.** The scripts use `ELEVENLABS_API_KEY` from the
environment when it is set. Otherwise they read it from AWS SSM
Parameter Store at `/outcomeops-video-gen/eleven-labs` (SecureString),
which is how this repo runs for OutcomeOps. SSM is our choice, not a
requirement. Whichever you use, never hardcode or commit the key.

## Legacy pipeline: scene YAMLs (`generate.py`)

The original pipeline films the live product instead of an authored
scene: a YAML in `scenes/` names a URL and a list of interactions
(click/scroll/type); Claude Sonnet on AWS Bedrock writes the narration
from `brand_context.md`, AWS Polly Neural (default voice: Joanna)
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
sudo apt-get install -y ffmpeg   # macOS: brew install ffmpeg
```

Credentials: for the demos pipeline you only need an ElevenLabs key,
either in `ELEVENLABS_API_KEY` (environment or a `.env` file; copy
`.env.example`) or in SSM (see above). AWS credentials
(env or `~/.aws/credentials`, `AWS_REGION` defaults to `us-west-2`) are
needed for the SSM fallback and for the legacy YAML pipeline, which uses
Bedrock and Polly.

## Security checks

`.github/workflows/security.yml` runs on every push, every pull request
and weekly:

- **Talisman** scans every tracked file for secrets. `.talismanrc` holds
  the reviewed allowlist (the pinned CDN integrity hashes, binary logos,
  `.env.example`, and the fake API key shown in the MCP demo) and fails
  only on high or critical findings.
- **Trivy** checks the Python dependencies, resolved to exact versions,
  for HIGH and CRITICAL CVEs, and scans the repo for secrets.

To catch secrets before they are committed, install
[Talisman](https://github.com/thoughtworks/talisman) as a local
pre-commit hook. It reads the same `.talismanrc`.

## Serving previews

Serve from the repo root. The scenes are compiled in the browser by
Babel, so they need HTTP, not `file://`:

```bash
python3 -m http.server 8765
# http://localhost:8765/             — catalog of every scene
# http://localhost:8765/demos/<n>/   — live scene preview (silent until you synthesize narration)
```

The repo ships no MP4s. `output/` is created when you run
`export_demo.py`, and the exported file is then at
`http://localhost:8765/output/<n>/final.mp4`.
