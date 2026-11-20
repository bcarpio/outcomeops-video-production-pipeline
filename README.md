# OutcomeOps Video Production Pipeline

The pipeline that produces the [OutcomeOps](https://www.outcomeops.ai)
product and marketing videos entirely from text files in git. No video
editor is ever opened. Every scene is a small React app on a single
animation clock, narration timestamps drive the timing, and headless
Chromium renders the MP4. This file is the map. `CLAUDE.md` is
OutcomeOps' own manual for Claude Code, kept as a worked example;
`CLAUDE.template.md` is the product-neutral version to start from.

**Who it's for.** Engineers, or a coding agent like Claude Code, making
short narrated product explainers: typed text, cards, rebuilt UI,
dashboards, 30 seconds to a few minutes, remade whenever the product or
the script changes. It is not a video editor: you write React against
seconds. It is the wrong tool for footage, people on camera, b-roll, or
a team that wants to edit on a timeline.

## Example output

[![Audit. Cost. Control. Why InfoSec Picks OutcomeOps](https://www.briancarpio.com/videos/transparency-60fps-poster.jpg)](https://www.briancarpio.com/videos/transparency-60fps.mp4)

[Audit. Cost. Control. Why InfoSec Picks OutcomeOps](https://www.briancarpio.com/videos/transparency-60fps.mp4)
was compiled by this pipeline at a true 60 fps. The product was never
screen recorded and no editor was opened. Its source is
[`demos/transparency/`](demos/transparency/), and you can play the scene
yourself from the catalog (see "Serving previews" below).

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
   own line before each beat, one beat per visual moment. ElevenLabs has
   a per-request character limit (see their docs for your model), so
   split a long video into several scenes rather than one huge script.
5. Synthesize the voice and the timings:
   ```bash
   ELEVENLABS_API_KEY=... python scripts/synth.py demos/my-video/narration.txt
   ```
   (or put `ELEVENLABS_API_KEY=...` in a `.env` file in the repo root).
   It writes `narration.mp3` and `beats.js`; the starter scene loads
   `beats.js`, so each beat starts when its line does and the video is as
   long as the voice-over, with nothing to copy. Motion *inside* a beat
   (fades, typing, rows appearing) is still yours: the starter expresses
   it as fractions of each beat's length so a re-recorded line reflows,
   and a new `[[B4]]` needs its own visual in `scene.jsx`. The default voice is Drew, one of ElevenLabs' stock
   voices; pass `--voice <voice_id>` to use another. Commercial use of
   the audio needs a paid ElevenLabs plan.
6. Export: `python export_demo.py demos/my-video` writes
   `output/my-video/final.mp4` (1920x1080, 60 fps). Use `--fps 30`
   for quicker drafts.

To have Claude Code build scenes for you, copy `CLAUDE.template.md` over
`CLAUDE.md` and fill in your product: where its UI source lives, its
routes and page components, and where its styling lives. That catalog is
what keeps scenes faithful to the real product. Then ask for a scene the
way you would describe the video to an editor.

The other folders in `demos/` are the real scenes behind the published
OutcomeOps videos, with staged data only. They are worked examples, not
templates: they span the layouts this pipeline grew through (`scene.jsx`
vs `scenes.jsx`, several narration files, one-off `scripts/synth_*.py`),
and some palettes are admitted approximations of the app. Copy
`demos/starter/`, and read the others for ideas.

Generated media (`*.mp3`, `*.mp4`, `output/`) is not committed. Scenes
preview silently until you synthesize narration with your own
ElevenLabs key; the published videos are on the
[OutcomeOps YouTube channel](https://www.youtube.com/@OutcomeOps).

Licensed under Apache 2.0, like
[OutcomeOps itself](https://github.com/bcarpio/outcome-ops-ai-assist).

What a finished OutcomeOps video consists of:

| Artifact | Where | Made by |
|---|---|---|
| Final MP4 (H.264/AAC, faststart) | `output/<name>/final.mp4` | `export_demo.py` |
| YouTube thumbnail (1280×720 PNG) | `output/<name>/thumbnail.png` | `scripts/screenshot_thumbnail.py` from the scene's `thumbnail.html` |
| Title, description and tags | `output/<name>/youtube-metadata.md` | written by hand (or by Claude Code); nothing generates it |

## How this compares

[Remotion](https://www.remotion.dev) and
[Motion Canvas](https://motioncanvas.io) are established tools built on
the same idea: video as code, rendered frame by frame. Reach for them if
you want a larger component ecosystem, a studio UI, or cloud rendering;
check Remotion's license terms for company use. This repo is smaller and
narrower: no build step (scenes are plain JSX compiled in the browser),
Apache 2.0, narration timestamps from ElevenLabs drive the beats, and the
CLAUDE.md pattern is designed for a coding agent writing scenes against
your real product's source.

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
4. **Thumbnail + metadata.** `scripts/screenshot_thumbnail.py
   demos/<name>/thumbnail.html output/<name>/thumbnail.png` renders the
   thumbnail; `output/<name>/youtube-metadata.md` (title, A/B
   alternates, description, tags) is written by hand.

**ElevenLabs API key.** The scripts use `ELEVENLABS_API_KEY` from the
environment when it is set. Otherwise they read it from AWS SSM
Parameter Store at `/outcomeops-video-gen/eleven-labs` (SecureString),
which is how this repo runs for OutcomeOps. SSM is our choice, not a
requirement. Whichever you use, never hardcode or commit the key.

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

Previews and exports need internet access: each scene's `index.html`
loads React, ReactDOM and Babel from unpkg.com and its fonts from Google
Fonts. Offline, or behind a proxy that blocks those hosts, the Stage
renders blank. To work offline, download those files into the repo and
point the `<script>` and font links at the local copies.

Credentials: for the demos pipeline you only need an ElevenLabs key,
either in `ELEVENLABS_API_KEY` (environment or a `.env` file; copy
`.env.example`) or in SSM (see above). No AWS account is needed unless
you want the SSM fallback, which uses your normal AWS credentials
(`AWS_REGION` defaults to `us-west-2`).

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
