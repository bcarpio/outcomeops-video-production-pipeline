# Claude Guidance for the OutcomeOps Video Production Pipeline

## What this tool is

Standalone Python CLI that generates narrated marketing videos of real
OutcomeOps surfaces (the marketing site at `outcomeops.ai` and the app
at `outcomeops.outcomeops.ai`). Pipeline:

```
Claude Sonnet 4.6 (Bedrock) → narration text
        ↓
AWS Polly (Neural)          → narration.mp3
        ↓
Playwright (headless)       → recording.webm
        ↓
ffmpeg                      → final.mp4
```

Per scene, three files land in `output/<scene-name>/`:
`narration.mp3`, `recording.webm`, `final.mp4`. Intermediates are kept
on purpose so `--skip-narration` and `--skip-recording` let you iterate
on one stage without re-running the others.

## Repo layout

```
generate.py                 — main CLI
brand_context.md            — cached system prompt (edit for voice)
scenes/                     — one YAML per scene
lib/
  script.py                 — Bedrock client + narration generation
  narrator.py               — Polly TTS + ffprobe duration measurement
  recorder.py               — Playwright video capture + interaction DSL
  compositor.py             — ffmpeg stitching
output/                     — generated artifacts (gitignored)
venv/                       — local virtualenv (gitignored)
```

## Secrets

Third-party API keys live in **AWS SSM Parameter Store** under
`/outcomeops-video-gen/*` as `SecureString` parameters. Fetch them with
`boto3` + the same AWS credentials the rest of the pipeline uses; never
hardcode or stash in `.env`.

| Parameter | Used by |
|---|---|
| `/outcomeops-video-gen/eleven-labs` | ElevenLabs TTS — voice for everything under `demos/` (see "ElevenLabs voice" below) |

Example:

```python
import boto3, os
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

- **Use AWS Bedrock for Claude calls.** Never reach for the direct
  Anthropic API or `ANTHROPIC_API_KEY` — both AI calls (Bedrock + Polly)
  go through AWS credentials. The Anthropic SDK supports Bedrock via
  `anthropic.AnthropicBedrock(aws_region=...)` — same shape as the
  direct client. The only carve-out is if a feature ships on the direct
  Anthropic API first; in that case ask before adding the dependency.
- **Default model: `us.anthropic.claude-sonnet-4-6`** — matches what
  the parent product uses in prod. Don't escalate to Opus for narration
  generation; Sonnet is more than capable here and 5x cheaper.
- **Never commit `.env`, `output/`, or `venv/`.** All three are in
  `.gitignore`.
- **Never put customer names in scene YAMLs that get committed.**
  Generic ICP language only.

## How a scene works

A scene YAML has:

| Field | Required | Notes |
|---|---|---|
| `name` | ✅ | Used as the output subdirectory |
| `url` | ✅ | The page Playwright loads |
| `viewport` | ❌ | Defaults to 1920×1080 |
| `target_seconds` | ❌ | Hint to Claude; actual length = audio length |
| `narration_prompt` | one of | Sent to Claude with `brand_context.md` |
| `narration` | one of | Verbatim text — skips Claude entirely |
| `voice` | ❌ | Polly voice (default `Joanna`) |
| `interactions` | ❌ | Step-by-step DSL (see below) |

Interaction step types (each is a single-key dict):

- `{wait_for: "selector", timeout: 5000}` — block until selector appears
- `{wait: 3}` — sleep N seconds
- `{click: "selector"}`
- `{hover: "selector"}`
- `{type: "selector", text: "..."}`
- `{scroll: 400}` — scroll window down N pixels
- `{goto: "https://..."}` — navigate to a different URL

Recorder synchronizes to the audio: Polly first → ffprobe measures
duration → Playwright records for that many seconds → ffmpeg combines.
If your interactions finish before the audio, the page just sits idle
until the audio ends.

## What I know about the OutcomeOps surfaces

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

## Brand voice (also in `brand_context.md`)

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

If the Polly voice-over ever sounds like terse marketing copy, stop and
reshape it around "what's happening right now, and what the persona can
now see/do."

## ElevenLabs voice (for `demos/*/` and marketing videos)

Everything under `demos/` — `chat-analytics`, `chat-cve`, `jira-to-pr`,
`marketing`, and the shared CTAs — uses **ElevenLabs Drew** as the
narrator. Polly is reserved for the Playwright-driven scenes under
`scenes/` (`generate.py`). If you're writing a new demo scene with
pre-rendered audio, default to ElevenLabs Drew.

**API key:** SSM SecureString at `/outcomeops-video-gen/eleven-labs`.
Fetch with the same boto3 pattern as any other SSM parameter — never
`.env`, never hardcoded.

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

**Marketing-specific duration trick:** `export_demo.py` uses
`ffmpeg -shortest` so the output trims to whichever stream ends first.
If the Stage runs longer than the narration (e.g., 42s video + 40s
narration + 2s silent logo), pad the mp3 with `ffmpeg -af apad=whole_dur=<sec>`
before export so the silent visual tail survives. Otherwise the CTA
concat abuts the narration's last word instead of the logo hold.

**Loop during export:** `<Stage>` defaults to `loop={true}`. For
exports, pass `loop={!isExport}` so the playhead stops at `duration`
instead of wrapping to scene 1 for the last couple of frames — that
wrap is visible in the final MP4 as a flash of scene 1 right before
the CTA stitch.

## Serving the React demos

`demos/*/` scenes are raw JSX compiled in-browser by Babel, so they need
an HTTP server — not `file://`. Serve from the **repo root** so both
`demos/` (live previews) and `output/` (exported MP4s) are reachable:

```bash
python3 -m http.server 8765
```

- Live preview: `http://localhost:8765/demos/chat-analytics/`
- Exported MP4: `http://localhost:8765/output/chat-analytics/final.mp4`

If you run this on a separate machine and view it from your desktop,
put the machine's LAN address in a local, untracked CLAUDE.md note so
Claude Code shares URLs you can click instead of `localhost`.

## Exporting a demo to MP4

`export_demo.py` records a `demos/*/` scene in headless Chromium and
stitches it with the scene's `narration.mp3` into a shareable MP4.

```bash
# Default: 1920x1080 landscape → output/<demo>/final.mp4
python export_demo.py demos/chat-analytics

# Vertical (TikTok, YouTube Shorts, Instagram Reels)
# NB: Stage is designed for 16:10; vertical is letterboxed.
python export_demo.py demos/chat-analytics --viewport 1080x1920

# Custom output path
python export_demo.py demos/chat-analytics --output /tmp/reel.mp4
```

What it does:
1. Starts a local HTTP server on a free port (no conflict with 8765)
2. Launches headless Chromium with autoplay allowed + backgrounding
   disabled (so the RAF loop keeps 60fps)
3. `localStorage.clear()` via `add_init_script` so Stage starts at t=0
4. Waits for the `<audio>` element to attach (means scene mounted)
5. Records for `duration` seconds (parsed from the Stage's prop in
   `index.html`), then stitches via `lib.compositor.stitch()` with the
   page-load offset trimmed off the front.

The MP4 is H.264 yuv420p + AAC 192kbps, `+faststart` for web streaming.
Works directly on YouTube, LinkedIn, Slack, email attachments.

**Platform notes:**
| Platform | Preferred format | Our default |
|---|---|---|
| YouTube | 1920×1080 MP4 | ✅ |
| LinkedIn | 1920×1080 MP4 | ✅ |
| LinkedIn (square) | 1080×1080 | `--viewport 1080x1080` |
| TikTok / YT Shorts | 1080×1920 | `--viewport 1080x1920` (letterboxed) |

The `demos/` scenes are designed 16:10, so vertical/square variants
will letterbox. If those become important, the right move is a
vertical-native scene layout, not a crop.

## Common tasks

**Add a new YAML scene (legacy pipeline):** copy `scenes/example.yaml`, change `name`, `url`,
and `narration_prompt`. Run `python generate.py scenes/<new>.yaml`.

**Iterate on visuals only:** `--skip-narration` reuses existing audio.
You can tweak `interactions` and re-record without re-generating the
script.

**Iterate on script only:** `--skip-recording` reuses existing video.
Useful when adjusting word choice without paying for another browser
recording.

**Watch the recording happen:** `--headed` opens a visible Chromium
window. Useful when figuring out which CSS selector to click.

**Change voice:** add `voice: Matthew` (or `Stephen`, `Ruth`, ...) to
the scene YAML. Any AWS Polly Neural voice works.

**Longer-than-3000-char script:** Polly Neural caps at 3000 chars per
request. For multi-minute videos, split into multiple scenes and
concatenate the MP4s with ffmpeg's concat demuxer.

## Testing changes

There are no unit tests yet — the failure modes are obvious (missing
deps, Bedrock model not enabled, Polly access denied, selector not
found). A smoke test is `python generate.py scenes/example.yaml`; if
it produces a non-zero `final.mp4`, the pipeline is working.

If adding tests, mock the boto3 + anthropic clients at the module
boundary (`lib.script._get_client`, `lib.narrator._polly_client`) the
same way the parent product does.
