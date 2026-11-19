"""Synthesize narration-O.txt at per-scene variable speeds via Drew,
then concatenate into a single mp3 + report scene boundaries.

Pacing plan:
  s1 provocation  — 1.15 (punchy opener)
  s2 first commit — 1.10
  s3..s7 body     — 1.05 (documentary cadence)
  s8 numbers      — 1.10
  s9 cta          — 1.10
"""
import base64
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

import boto3

VOICE_ID = "q0IMILNRPxOgtBTS4taI"  # Drew
MODEL = "eleven_multilingual_v2"
BASE_SETTINGS = {
    "stability": 0.72,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": True,
}
SCENE_SPEEDS = {
    "o1": 1.15,
    "o2": 1.10,
    "o3": 1.05,
    "o4": 1.05,
    "o5": 1.05,
    "o6": 1.05,
    "o7": 1.05,
    "o8": 1.10,
    "o9": 1.10,
}


def parse_scenes(text: str) -> list[tuple[str, str]]:
    """Split narration text on [t — beat_id] markers. Returns (id, prose) tuples."""
    scenes = []
    current_id, current_lines = None, []
    for line in text.splitlines():
        m = re.match(r"^\[\s*[\d.]+s\s*—\s*(\w+)\s*\]", line)
        if m:
            if current_id:
                scenes.append((current_id, " ".join(current_lines).strip()))
            current_id = m.group(1).split("_")[0]  # e.g. "o1" from "o1_provocation"
            current_lines = []
        elif line.strip() and current_id:
            current_lines.append(line.strip())
    if current_id:
        scenes.append((current_id, " ".join(current_lines).strip()))
    return scenes


def get_api_key() -> str:
    ssm = boto3.client("ssm", region_name=os.environ.get("AWS_REGION", "us-west-2"))
    return ssm.get_parameter(
        Name="/outcomeops-video-gen/eleven-labs",
        WithDecryption=True,
    )["Parameter"]["Value"]


def synth_scene(api_key: str, text: str, speed: float) -> bytes:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    settings = {**BASE_SETTINGS, "speed": speed}
    body = json.dumps({
        "text": text,
        "model_id": MODEL,
        "voice_settings": settings,
    }).encode("utf-8")
    req = urllib.request.Request(
        url, data=body,
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read()


def ffprobe_duration(path: Path) -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path),
    ])
    return float(out.strip())


def main():
    txt_path = Path(sys.argv[1] if len(sys.argv) > 1 else
                    "demos/origin/narration-O.txt").resolve()
    scenes = parse_scenes(txt_path.read_text())
    print(f"Parsed {len(scenes)} scenes\n")

    api_key = get_api_key()
    work_dir = txt_path.parent / "_synth_tmp"
    work_dir.mkdir(exist_ok=True)

    parts: list[Path] = []
    boundaries = [0.0]
    for sid, prose in scenes:
        speed = SCENE_SPEEDS.get(sid, 1.05)
        print(f"  {sid} (speed {speed}): {prose[:70]}...")
        audio_bytes = synth_scene(api_key, prose, speed)
        part_path = work_dir / f"{sid}.mp3"
        part_path.write_bytes(audio_bytes)
        dur = ffprobe_duration(part_path)
        boundaries.append(boundaries[-1] + dur)
        print(f"    → {dur:.2f}s  (scene starts at {boundaries[-2]:.2f}s)")
        parts.append(part_path)

    # Concat all parts with ffmpeg.
    concat_list = work_dir / "concat.txt"
    concat_list.write_text("\n".join(f"file '{p.name}'" for p in parts))
    out_path = txt_path.with_suffix(".mp3")

    # Use re-encode (not -c copy) — different speeds at synth time can produce
    # subtly different headers; re-encoding to a uniform bitrate avoids glitches.
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(out_path),
    ], check=True, capture_output=True)

    total = ffprobe_duration(out_path)
    print(f"\nWrote {out_path} ({total:.2f}s)\n")

    print("=== Scene boundaries (concatenated mp3) ===")
    for i, (sid, _) in enumerate(scenes):
        print(f"  {sid}: {boundaries[i]:>7.2f}s")
    print(f"  END: {total:>7.2f}s\n")

    print("=== Suggested Sprite ranges ===")
    for i, (sid, _) in enumerate(scenes):
        start = boundaries[i]
        end = boundaries[i + 1] + 0.2 if i + 1 < len(scenes) else total + 1
        print(f"  <Sprite start={{{start:.1f}}}  end={{{end:.1f}}}> <SceneO{i+1}/></Sprite>")

    print("\n=== Suggested SCENES_O ===")
    starts = [round(b, 1) for b in boundaries[:-1]]
    print(f"  const SCENES_O = {starts};")
    print(f"\n=== Suggested Stage duration ===\n  duration={{{round(total + 1)}}}\n")


if __name__ == "__main__":
    main()
