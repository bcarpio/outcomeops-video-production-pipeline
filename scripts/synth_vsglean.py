"""Synthesize the OutcomeOps-vs-Glean narration via ElevenLabs Drew (speed 1.1).

This scene has seven timed beats ([[B0]]..[[B5]], [[CTA]]) whose reveals must
line up with the spoken sentences, so we use ElevenLabs' /with-timestamps
endpoint. The script:

  1. Parses demos/vs-glean/narration.txt into ordered [[LABEL]] beats.
  2. Concatenates the prose (markers stripped) and records the character
     offset where each beat begins.
  3. Synthesizes once at Drew's settings, decoding audio + per-character
     alignment.
  4. Maps each beat's offset -> start-time, writes narration.mp3 and
     narration.marks.json, and pads a short silent tail so the logo hold
     survives export_demo.py's `-shortest` stitch.
  5. Prints the scene.jsx timing constants to paste in (BEATS, FRAME_IN,
     REFRAME_IN, CTA_IN, TOTAL, ...).

Usage:
    python scripts/synth_vsglean.py                       # default narration.txt
    python scripts/synth_vsglean.py demos/vs-glean/narration.txt
"""
import base64
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import boto3
import urllib.request

VOICE_ID = "q0IMILNRPxOgtBTS4taI"   # Drew
MODEL = "eleven_multilingual_v2"
SETTINGS = {
    "stability": 0.72,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": True,
    "speed": 1.1,
}
SEP = "\n\n"          # what beats are joined with when sent to ElevenLabs
TAIL_SECONDS = 1.5    # silent hold on the logo end-card after the last word

DEFAULT_TXT = Path(__file__).resolve().parent.parent / "demos" / "vs-glean" / "narration.txt"


def parse_beats(text: str):
    """Return an ordered list of (label, prose) from a [[LABEL]]-marked file."""
    beats = []
    label, buf = None, []
    for line in text.splitlines():
        m = re.match(r"^\s*\[\[([^\]]+)\]\]\s*$", line)
        if m:
            if label is not None:
                beats.append((label, " ".join(buf).strip()))
            label, buf = m.group(1).strip(), []
            continue
        if line.strip():
            buf.append(line.strip())
    if label is not None:
        beats.append((label, " ".join(buf).strip()))
    return [(lbl, prose) for lbl, prose in beats if prose]


def build_prose(beats):
    """Join beats with SEP; return (prose, {label: char_offset_of_beat_start})."""
    prose, offsets, pos = "", {}, 0
    for i, (label, chunk) in enumerate(beats):
        if i > 0:
            prose += SEP
            pos += len(SEP)
        offsets[label] = pos
        prose += chunk
        pos += len(chunk)
    return prose, offsets


def get_api_key() -> str:
    """ELEVENLABS_API_KEY if set, otherwise the SSM SecureString this repo uses."""
    key = os.environ.get("ELEVENLABS_API_KEY")
    if key:
        return key
    ssm = boto3.client("ssm", region_name=os.environ.get("AWS_REGION", "us-west-2"))
    return ssm.get_parameter(
        Name="/outcomeops-video-gen/eleven-labs",
        WithDecryption=True,
    )["Parameter"]["Value"]


def synthesize(api_key: str, text: str) -> dict:
    """Call the with-timestamps endpoint; return the parsed JSON response."""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps"
    body = json.dumps({
        "text": text,
        "model_id": MODEL,
        "voice_settings": SETTINGS,
    }).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        return json.loads(resp.read())


def beat_times(alignment: dict, offsets: dict) -> dict:
    """Map each beat's character offset to its start time (seconds)."""
    starts = alignment["character_start_times_seconds"]
    n = len(starts)
    return {label: round(starts[min(off, n - 1)], 3) for label, off in offsets.items()}


def ffprobe_duration(path: Path) -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path),
    ])
    return float(out.strip())


def pad_tail(path: Path, target: float) -> None:
    """Pad the mp3 in place to `target` seconds so a silent logo hold survives."""
    tmp = path.with_name(path.stem + "-padded.mp3")
    subprocess.run([
        "ffmpeg", "-y", "-i", str(path),
        "-af", f"apad=whole_dur={target}",
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(tmp),
    ], check=True, capture_output=True)
    tmp.replace(path)


def print_scene_constants(times: dict, total: float) -> None:
    """Emit the scene.jsx timing block from the measured beat times."""
    b1, b2, b3, b4 = times["B1"], times["B2"], times["B3"], times["B4"]
    b5, cta = times["B5"], times["CTA"]
    print("\n--- paste into demos/vs-glean/scene.jsx ---")
    print(f"const TITLE_OUT = {round(max(b1 - 0.6, 0.5), 2)};")
    print(f"const FRAME_IN  = {round(max(b1 - 0.2, 0.6), 2)};")
    print("const BEATS = [")
    print(f"  {{ s:{round(b1, 2)},  e:{round(b2, 2)} }},       // B1 Retrieve vs Act")
    print(f"  {{ s:{round(b2, 2)}, e:{round(b3, 2)} }},       // B2 Code depth vs wikis")
    print(f"  {{ s:{round(b3, 2)}, e:{round(b4, 2)} }},       // B3 Your cloud vs theirs")
    print(f"  {{ s:{round(b4, 2)}, e:{round(b5, 2)} }},       // B4 Governed + auditable")
    print("];")
    print(f"const FRAME_OUT   = {round(b5, 2)};")
    print(f"const REFRAME_IN  = {round(b5, 2)};")
    print(f"const CTA_IN      = {round(cta, 2)};")
    print(f"const TOTAL       = {round(total, 2)};")
    print("--- also update duration={…} in index.html to match TOTAL ---")


def main():
    txt_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DEFAULT_TXT
    beats = parse_beats(txt_path.read_text())
    prose, offsets = build_prose(beats)
    print(f"Beats: {', '.join(lbl for lbl, _ in beats)}")
    print(f"Prose ({len(prose.split())} words):\n{prose}\n")

    api_key = get_api_key()
    resp = synthesize(api_key, prose)

    audio = base64.b64decode(resp["audio_base64"])
    mp3_path = txt_path.with_suffix(".mp3")
    mp3_path.write_bytes(audio)
    raw = ffprobe_duration(mp3_path)
    print(f"Wrote {mp3_path} ({len(audio):,} bytes, {raw:.2f}s)")

    times = beat_times(resp["alignment"], offsets)
    marks_path = txt_path.with_name("narration.marks.json")
    marks_path.write_text(json.dumps({"beats": times, "raw_duration": round(raw, 3)}, indent=2))
    print(f"Wrote {marks_path}")
    for label, _ in beats:
        print(f"  {label:<4} {times[label]:>6.2f}s")

    total = raw + TAIL_SECONDS
    pad_tail(mp3_path, total)
    print(f"Padded to {total:.2f}s (+{TAIL_SECONDS}s logo hold)")

    print_scene_constants(times, total)


if __name__ == "__main__":
    main()
