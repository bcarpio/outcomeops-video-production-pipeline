# Claude Guidance for the OutcomeOps Video Production Pipeline

This file holds two kinds of guidance. Most of it is about the pipeline
and applies to any product. The sections marked **(OutcomeOps example)**
describe OutcomeOps itself: its product surfaces, brand voice and
narrator settings. If you are using this repo for your own product,
replace those sections with your product's equivalents and keep the rest,
or start from `CLAUDE.template.md`, which has only the product-neutral
parts plus placeholders for yours.

## What this tool is

A pipeline that turns text files into narrated product videos, with no
video editor. The main path is **React demo scenes** in `demos/<name>/`:

```
scene.jsx + narration.txt          you (or Claude Code) write these
        ↓ scripts/synth.py         ElevenLabs /with-timestamps
narration.mp3 + beats.js           voice-over + the second each beat starts
        ↓ export_demo.py           headless Chromium, stepped frame by frame
output/<name>/final.mp4            H.264, 60 fps by default
```

Every scene is a small React app on one animation clock (`Stage` in
`animations.jsx`); every visual is a pure function of the time from
`useTime()`. The export steps that clock exactly 1/fps per frame and
screenshots each frame, so output is frame-accurate and identical on
every run.

`demos/starter/` is the minimal scene to copy. The other folders in
`demos/` are OutcomeOps' own videos, kept as worked examples.

The only external service the pipeline calls is ElevenLabs, for the
voice. No AWS account is needed (OutcomeOps happens to keep its
ElevenLabs key in AWS SSM; see "Secrets").

## Repo layout

```
demos/<name>/               — one React scene per video
  index.html                — mounts the Stage (loads beats.js if the scene uses it)
  scene.jsx                 — the scene; compiled in the browser by Babel
  animations.jsx            — Stage, useTime, Sprite, easing helpers
  narration.txt             — voice-over with [[B0]]..[[Bn]] beat markers
  beats.js                  — window.BEATS / SCENE_DURATION, written by synth.py
demos/starter/              — minimal product-neutral scene to copy
scripts/synth.py            — ElevenLabs synthesis for any scene
scripts/concat.py           — joins exported scenes (multi-part videos, CTAs)
scripts/examples/           — per-scene synth scripts (OutcomeOps examples)
scripts/screenshot_thumbnail.py — renders a scene's thumbnail.html to PNG
export_demo.py              — frame-stepped export to MP4
lib/compositor.py           — ffmpeg encoding (frames + narration → MP4)
output/                     — generated artifacts (gitignored)
```

## Secrets

The scripts read the ElevenLabs key from the `ELEVENLABS_API_KEY`
environment variable when it is set (`scripts/synth.py` also reads it
from a `.env` file in the repo root; `.env` is gitignored). Otherwise they fall back to **AWS
SSM Parameter Store**, which is how this repo runs for OutcomeOps: keys
live under `/outcomeops-video-gen/*` as `SecureString` parameters,
fetched with `boto3` and your AWS credentials. That fallback is
OutcomeOps' setup, not a requirement: with `ELEVENLABS_API_KEY` set, no
AWS account or credentials are needed. Either way, never hardcode a key
or commit it.

| Parameter | Used by |
|---|---|
| `/outcomeops-video-gen/eleven-labs` | ElevenLabs TTS — voice for everything under `demos/` (see "ElevenLabs voice" below) |

Example:

```python
import boto3, os
api_key = os.environ.get('ELEVENLABS_API_KEY')
if not api_key:
    ssm = boto3.client('ssm', region_name=os.environ.get('AWS_REGION', 'us-west-2'))
    api_key = ssm.get_parameter(
        Name='/outcomeops-video-gen/eleven-labs',
        WithDecryption=True,
    )['Parameter']['Value']
```

When adding a new third-party key:
1. `aws ssm put-parameter --name /outcomeops-video-gen/<slug> --type SecureString --value ...`
2. Add a row to the table above so future sessions know it exists.

## Hard rules

- **Never commit `.env`, `output/`, or `venv/`.** All three are in
  `.gitignore`.
- **Never put real customer names, repositories or tickets in a scene.**
  Scenes are committed source; use staged data and generic language.

## Visual fidelity: the product's styles are the source of truth

When a scene rebuilds the product's UI (`chat_ui.jsx`, `scene_ui.jsx`,
dashboards), every color, font, radius and spacing value comes from the
product's own styling, never from taste.

- Read the page component the scene imitates and the styles it uses:
  the Tailwind classes in the component, `tailwind.config.*`, and any
  CSS variables in `index.css`.
- Turn those into the scene's palette object, with a comment above it
  naming the source files, e.g. `// From ui/src/pages/Chat.tsx + ui/src/index.css`.
- If the product uses stock Tailwind with no custom theme, use
  Tailwind's stock values for the classes it uses (`gray-50` is
  `#f9fafb`, `blue-600` is `#2563eb`, and so on).
- Never describe a palette by a style reference ("Linear-ish",
  "Vercel-ish"). A palette described that way was invented.

The `chat_ui.jsx` palettes in `chat`, `chat-analytics`, `chat-cve` and
`refactor-blast-radius` predate this rule and are approximations of the
app. They stay as they are so the source matches the published videos.
Do not copy them as the starting point for a new scene.

## Product catalog (OutcomeOps example)

This catalog is what keeps scenes faithful to the real product: where
its source lives, which page renders each route, what makes good scene
material, and which selectors survive a redesign. For your own product,
replace it with the same information about yours, including where its
styling lives (see "Visual fidelity" above).

### Marketing site — `outcomeops.ai`

React 19 + Vite + Tailwind. Source at
`../outcomeops.ai/ui/src/` (a private repo; point this at your own
product's source). Pages of note:

| Route | Page | Good scene material |
|---|---|---|
| `/` | `Home.tsx` | Hero stats (16h→15min, $2-$4, 100-200x ROI), pain-points list, Enterprise Platform grid |
| `/why-outcomeops` | `WhyOutcomeOps.tsx` | Side-by-side vs Copilot/Cursor/Devin |
| `/how-it-works` | `HowItWorks.tsx` | Numbered architecture walkthrough (1. Ingest knowledge, 2. Vector search, 3. AI generation, 4. Review) |
| `/philosophy` | `Philosophy.tsx` | Context engineering as a discipline |
| `/context-engineering` | `ContextEngineering.tsx` | Methodology deep-dive |
| `/case-studies` | `CaseStudies.tsx` | Anonymized customer outcomes |
| `/contact` | `Contact.tsx` | Contact form + Calendly embed |

### App — `outcomeops.outcomeops.ai`

React 18 + Tailwind. Source at
`../outcome-ops-ai-assist/ui/src/`, cloned from the open source
[outcome-ops-ai-assist](https://github.com/bcarpio/outcome-ops-ai-assist)
repo next to this one. Pages of note:

| Route | Page | Good scene material |
|---|---|---|
| `/` `/chat` | `Chat.tsx` | Sidebar with conversations, workspace selector, streaming chat |
| `/workspaces` | `Workspaces.tsx` | Grid of workspace cards |
| `/workspaces/:id` | `WorkspaceSettings.tsx` | Tabs: General / Members / Integrations / Sharing / Documents / Advanced |
| `/analytics` | `Analytics.tsx` | Stat cards (cost, queries, tokens), recharts line chart, cost-by-workspace + cost-by-model bar lists, top users table |
| `/analytics/workspace/:id` | `WorkspaceAnalytics.tsx` | Per-workspace drilldown — by-user, by-model, daily trend, refusal count |
| `/analytics/budgets` | `AnalyticsBudgets.tsx` | Org-admin-only table — every workspace + MTD spend + budget input + over/within-budget status |
| `/org/settings` | `OrgSettings.tsx` | Org admin management, "MCP Servers" + "Add Member" buttons, full AdminNav |
| `/settings` | `Settings.tsx` | Personal API keys |

All admin pages render `<AdminNav />` (right-side icon cluster: Chat,
Workspaces, Settings, Analytics, Budgets, Org Settings, Sign out). The
icon for the page you're on is auto-hidden. Analytics + Budgets are
gated on `org_admin`. The Budgets icon is `Wallet` (lucide), not
`DollarSign` — the user explicitly rejected the dollar sign.

When writing scenes for the app, look for `data-test=` attributes
first, otherwise use `button[title='...']` (every nav icon has a title)
or text-content selectors like `button:text('Save Budget')`.

## Brand voice (OutcomeOps example)

- Lead with concrete outcomes (numbers, time savings), not abstractions
- Avoid filler: "in today's fast-paced world", "imagine if", "unlock"
- Avoid: "leverage", "synergy", "transform", "revolutionary"
- It's OK to be a little dry — engineers respect that

## Video narration style

All voice-over narration (Playwright scenes and React `demos/` scenes)
uses an **observational third-person narrator**. The narrator describes
what the viewer is seeing and what the persona is doing — it does not
speak in the product's own voice.

**Prefer:**
- Third-person framing: "The architect asks…", "The system queries the
  knowledge base…", "The system answers that…", "An engineer can already
  tell what exists in their ecosystem…"
- Full sentences, natural rhythm
- Narration that sells *meaning* while the on-screen text carries the
  *tactical specifics*. Don't duplicate; let them complement each other.
- Breathing room. A 5-second silence over a "searching" or "thinking"
  visual is fine — the UI is doing the work.

**Avoid:**
- Clipped bullet-fragment pitch: "Production platform, already deployed.
  Dual pipeline. Server-side capture — unblockable." Reads robotic.
- Restating the on-screen answer in shorter form. The viewer can already
  read it.
- The product speaking about itself in first person ("we generate…",
  "our platform…"). Narrator frames the *scene*, not the pitch.

If the voice-over ever sounds like terse marketing copy, stop and
reshape it around "what's happening right now, and what the persona can
now see/do."

## ElevenLabs voice (OutcomeOps example)

Everything under `demos/` — `chat-analytics`, `chat-cve`, `jira-to-pr`,
`marketing`, and the shared CTAs — uses **ElevenLabs Drew** as the
narrator. If you're writing a new demo scene, default to ElevenLabs
Drew.

**API key:** OutcomeOps keeps it in SSM at `/outcomeops-video-gen/eleven-labs`.
For your own setup, `ELEVENLABS_API_KEY` in the environment or in `.env`
works too (see "Secrets"). Never hardcode or commit it.

**About Drew:** Drew is one of ElevenLabs' stock (premade) voices, not
a custom clone, so anyone with an ElevenLabs account can use the same
voice ID. Commercial use of generated audio needs a paid ElevenLabs
plan; check their current terms.

**Voice:** Drew, `voice_id=q0IMILNRPxOgtBTS4taI`, model
`eleven_multilingual_v2`.

**Default settings** (used by `jira-to-pr`, `chat-cve`,
`cta-marketing-{A,B}`, and the marketing main videos):

```python
voice_settings = {
    'stability': 0.72,
    'similarity_boost': 0.75,
    'style': 0.0,
    'use_speaker_boost': True,
    'speed': 1.1,  # universal Drew default — see "Speed" below
}
```

**Alternate tuning** (used by `chat-analytics` for a more expressive,
dynamic delivery): `stability=0.35, similarity_boost=0.80, style=0.55`.
Use this when the scene is long-form explanatory rather than punchy.

**Speed:** `1.1` is the universal default — marketing, demos, and
long-form documentary alike. Earlier per-content anchors (1.0 for
observational, 1.05 sweet spot) are obsolete: 1.0 reads slow across
the board. 1.15+ reads "too fast" even for punchy short-form — do not
exceed `1.15` without the user explicitly asking.

**Token-saving speed iteration via ffmpeg `atempo`:** Re-synthesizing
to compare narration speeds burns ElevenLabs tokens (~1k tokens per
100 chars). For small speed tweaks after the initial synth, use
ffmpeg's `atempo` filter — it stretches/compresses tempo with pitch
preserved, producing audio nearly indistinguishable from a native
speed-setting re-synth at small adjustments.

```bash
ffmpeg -y -i narration.mp3 -af 'atempo=1.03' \
  -c:a libmp3lame -b:a 192k narration-tempo.mp3
```

Tested ranges (Drew, eleven_multilingual_v2):

- `atempo=0.95` to `1.07` — imperceptible artifacts, sounds native
- `atempo=1.10+` — subtle warble may appear on consonants
- Below `0.90` — slowing too far loses Drew's natural breath rhythm

**Workflow:** synth once at the 1.1 default, then iterate on perceived
pace via `atempo` filter without burning more tokens. Only re-synth if
the user reports artifacts or if the pace adjustment exceeds 7%.

**Two synthesis endpoints:**

- `POST /v1/text-to-speech/{voice_id}` — returns audio bytes directly.
  Use for simple scenes that don't need per-beat timestamps (CTAs, any
  single-block narration).
- `POST /v1/text-to-speech/{voice_id}/with-timestamps` — returns
  `{audio_base64, alignment}` JSON. Use when the scene has multiple
  beats that need to trigger visuals at specific times. Parse
  `alignment.character_start_times_seconds` + `.characters` to locate
  beats in the audio and write them to `narration.marks.json`.

**Silent tail for an end card:** the export always runs for the
scene's full duration and pads the narration with silence, so a logo
hold after the last word survives. `scripts/synth.py --tail <sec>`
sets how long that hold is (default 1.5 s).

**Changing tempo after synthesis:** `atempo` changes when every beat
lands. Divide the times in `beats.js` (and `SCENE_DURATION`) by the
tempo factor, or re-synthesize.

**Loop during export:** `<Stage>` defaults to `loop={true}`. For
exports, pass `loop={!isExport}` so the playhead stops at `duration`
instead of wrapping to scene 1 for the last couple of frames — that
wrap is visible in the final MP4 as a flash of scene 1 right before
the CTA is joined on with `scripts/concat.py`.

## Serving the React demos

`demos/*/` scenes are raw JSX compiled in-browser by Babel, so they need
an HTTP server — not `file://`. Serve from the **repo root** so both
`demos/` (live previews) and `output/` (exported MP4s) are reachable:

```bash
python3 -m http.server 8765
```

- Live preview: `http://localhost:8765/demos/chat-analytics/`
- Exported MP4 (only after `export_demo.py` has run; the repo ships no
  MP4s): `http://localhost:8765/output/chat-analytics/final.mp4`

If you run this on a separate machine and view it from your desktop,
put the machine's LAN address in a local, untracked CLAUDE.md note so
Claude Code shares URLs you can click instead of `localhost`.

## Exporting a demo to MP4

`export_demo.py` renders a `demos/*/` scene frame by frame in headless
Chromium and encodes it with the scene's `narration.mp3`.

```bash
# Default: 1920x1080, 60 fps → output/<demo>/final.mp4
python export_demo.py demos/starter

# Quicker draft
python export_demo.py demos/starter --fps 30

# Vertical (TikTok, YouTube Shorts, Instagram Reels)
python export_demo.py demos/starter --viewport 1080x1920
```

How it works:
1. Serves `demos/` on a free local port and opens the scene with
   `?export=1` (scenes use that to hide the playback bar).
2. Installs Playwright's fake clock, paused, before any page script runs,
   and clears `localStorage` so the Stage starts at t=0.
3. For each frame: advances the clock by exactly 1/fps, runs the Stage's
   animation-frame callback once at that time, waits for React to
   commit, advances CSS animations/transitions by the same step, and
   takes a PNG screenshot.
4. Pipes the PNGs to ffmpeg (`lib.compositor.FrameEncoder`), with the
   narration starting at frame 0. The file is exactly the scene's
   duration: shorter audio is padded with silence.

Duration comes from `beats.js` (`window.SCENE_DURATION`) if the scene
has one, otherwise from the numeric `duration={...}` on the Stage in
`index.html`; `--duration` overrides both. Rendering takes about 0.1 s
per frame (roughly 6 minutes for 60 s at 60 fps). Output is identical
on every run.

Drive all motion from `useTime()`. CSS animations and transitions are
stepped too, but anything that reads wall-clock time some other way
(a `<video>` element, a canvas loop on its own timer) won't be in sync.

The MP4 is H.264 yuv420p (BT.709, limited range, tagged) + AAC 192kbps,
`+faststart` for web streaming. Works directly on YouTube, LinkedIn,
Slack and email.

**Platform notes:**
| Platform | Preferred format | Our default |
|---|---|---|
| YouTube | 1920×1080 MP4 | ✅ |
| LinkedIn | 1920×1080 MP4 | ✅ |
| LinkedIn (square) | 1080×1080 | `--viewport 1080x1080` |
| TikTok / YT Shorts | 1080×1920 | `--viewport 1080x1920` (letterboxed) |

The Stage's `width`×`height` is a design size that gets scaled to fit
the viewport, letterboxed when the aspect ratios differ. The starter is
1600×900 (16:9), so it fills a 1920×1080 export exactly; the OutcomeOps
scenes vary (1920×1080, 1600×900, and some 1440×900 previews), and all
of them letterbox in vertical or square exports. For vertical video,
design a vertical scene (e.g. a 900×1600 Stage) rather than cropping.

## Common tasks

**New video:** `cp -r demos/starter demos/<name>`, edit `scene.jsx` and
`narration.txt`, preview at `http://localhost:8765/demos/<name>/`, then
`python scripts/synth.py demos/<name>/narration.txt` and
`python export_demo.py demos/<name>`.

**Iterate on visuals:** edit `scene.jsx` and reload the preview. No
synthesis or export needed until the visuals are right.

**Change the narration:** edit `narration.txt` and re-run
`scripts/synth.py`. It rewrites `narration.mp3` and `beats.js`, so the
scene's timings follow the new voice-over automatically.

**Use a different voice:** `scripts/synth.py ... --voice <voice_id>`
(plus `--speed`, `--stability`, `--similarity`, `--style`).

**Draft export:** `python export_demo.py demos/<name> --fps 30`.

**Thumbnail:** design `demos/<name>/thumbnail.html`, then
`python scripts/screenshot_thumbnail.py demos/<name>/thumbnail.html output/<name>/thumbnail.png`.

## Testing changes

There are no unit tests yet. Smoke test for the demos pipeline, with no
API key needed (a silent track stands in for narration):

```bash
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 20 -c:a libmp3lame demos/starter/narration.mp3
python export_demo.py demos/starter --fps 30
```

It should write a 20-second `output/starter/final.mp4`. Delete the
silent `narration.mp3` afterwards.

If adding tests for the synth scripts, mock the ElevenLabs HTTP call
(`synthesize` in `scripts/synth.py`) rather than hitting the API.
