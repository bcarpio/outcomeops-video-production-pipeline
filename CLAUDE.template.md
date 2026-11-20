# Claude Guidance for <Your Product> Videos

<!--
Starting point for your own CLAUDE.md. Copy this file over CLAUDE.md (that one
is OutcomeOps' own manual, kept as a worked example) and fill in every
<angle-bracket> placeholder. The pipeline sections are product-neutral; the
"Your product" sections are what make Claude Code's scenes faithful to it.
-->

## What this repo does

Turns text files into narrated product videos with no video editor:

```
scene.jsx + narration.txt          written by you or Claude Code
        ↓ scripts/synth.py         ElevenLabs /with-timestamps
narration.mp3 + beats.js           voice-over + the second each beat starts
        ↓ export_demo.py           headless Chromium, stepped frame by frame
output/<name>/final.mp4            1920x1080, 60 fps by default
```

Each video is a folder in `demos/`. New videos start as a copy of
`demos/starter/`; the other folders are someone else's examples and are not
templates.

## Rules

- **Every visual is a pure function of time.** Read the time with `useTime()`
  and compute position, opacity and text from it. No component state, no
  `setTimeout`, no media with its own clock. This is what makes previews match
  exports and exports identical on every run.
- **Beats come from the narration, motion inside a beat is yours.**
  `scripts/synth.py` writes `beats.js` (`window.BEATS`,
  `window.SCENE_DURATION`); never type beat times by hand. Express in-beat
  offsets as fractions of the beat's length (see `at()` / `span()` in
  `demos/starter/scene.jsx`) so a re-recorded line reflows instead of
  overlapping the next beat. Adding a beat to `narration.txt` means adding the
  visual for it in `scene.jsx` too.
- **Staged data only.** Scenes are committed source. No real customer names,
  repositories, tickets or credentials, ever.
- **Visual fidelity: the product's styles are the source of truth.** When a
  scene imitates the product's UI, take every color, font, radius and spacing
  value from the product's own styles (see "Your product" below) and name the
  source file in a comment above the palette. Never invent a palette.
- **Never commit `.env`, `output/` or `venv/`**, or an API key anywhere.

## Workflow

1. `cp -r demos/starter demos/<name>`.
2. Serve the repo root (`python3 -m http.server 8765`) and iterate on
   `scene.jsx` at `http://localhost:8765/demos/<name>/`. This is free.
3. Write `narration.txt` with `[[B0]]`, `[[B1]]`, ... on their own lines, one
   beat per visual moment. Keep a single file under ElevenLabs' per-request
   character limit; split long videos into several scenes.
4. `python scripts/synth.py demos/<name>/narration.txt` (costs ElevenLabs
   credits). Re-run it whenever the narration changes.
5. `python export_demo.py demos/<name>` (`--fps 30` for drafts).

The ElevenLabs key comes from `ELEVENLABS_API_KEY` in the environment or in
`.env` in the repo root. Previews and exports need internet access: scenes
load React, Babel and fonts from unpkg.com and Google Fonts.

## Your product

<!-- Replace this section. It is what keeps scenes faithful to the product. -->

- **Source:** `<path to the product's UI source, cloned next to this repo>`
- **Styling lives in:** `<tailwind.config.js / src/index.css / theme file>`
- **Fonts:** `<font families and where they are loaded>`

| Route | Page component | Good scene material |
|---|---|---|
| `<route>` | `<Page.tsx>` | `<what on this page is worth showing>` |

Product decisions an agent would otherwise get wrong: `<e.g. which icon a nav
item uses, naming conventions, features that must not appear>`.

## Narration style

<!-- Replace with your voice. A good default: -->

- Observational narrator: describe what the viewer sees and what the persona
  is doing ("The engineer asks...", "The answer cites..."), not the product
  speaking about itself.
- Let the narration carry meaning and the screen carry specifics; don't read
  the on-screen text aloud.
- Voice: `<ElevenLabs voice ID and settings, e.g. --voice ... --speed 1.0>`.
