"""Synthesize narration.txt via ElevenLabs Drew at speed 1.1 (saved default
for OutcomeOps videos — see memory feedback_drew_speed.md), per-beat,
then concatenate and report scene boundaries for the React Sprite timings.
"""
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
    "speed": 1.1,
}


def parse_scenes(text: str) -> list[tuple[str, str]]:
    scenes = []
    current_id, current_lines = None, []
    for line in text.splitlines():
        m = re.match(r"^\[\s*[\d.]+s\s*—\s*(\w+)\s*\]", line)
        if m:
            if current_id:
                scenes.append((current_id, " ".join(current_lines).strip()))
            current_id = m.group(1)
            current_lines = []
        elif line.strip() and current_id:
            current_lines.append(line.strip())
    if current_id:
        scenes.append((current_id, " ".join(current_lines).strip()))
    return scenes


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


def synth_scene(api_key: str, text: str) -> bytes:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    body = json.dumps({
        "text": text,
        "model_id": MODEL,
        "voice_settings": BASE_SETTINGS,
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
                    "demos/mcp-setup/narration.txt").resolve()
    scenes = parse_scenes(txt_path.read_text())
    print(f"Parsed {len(scenes)} scenes\n")

    api_key = get_api_key()
    work_dir = txt_path.parent / "_synth_tmp"
    work_dir.mkdir(exist_ok=True)

    parts: list[Path] = []
    boundaries = [0.0]
    for sid, prose in scenes:
        print(f"  {sid}: {prose[:70]}...")
        audio_bytes = synth_scene(api_key, prose)
        part_path = work_dir / f"{sid}.mp3"
        part_path.write_bytes(audio_bytes)
        dur = ffprobe_duration(part_path)
        boundaries.append(boundaries[-1] + dur)
        print(f"    → {dur:.2f}s  (scene starts at {boundaries[-2]:.2f}s)")
        parts.append(part_path)

    concat_list = work_dir / "concat.txt"
    concat_list.write_text("\n".join(f"file '{p.name}'" for p in parts))
    out_path = txt_path.with_suffix(".mp3")

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

    print("=== Suggested narration markers (paste into narration.txt) ===")
    for i, (sid, _) in enumerate(scenes):
        print(f"  [{boundaries[i]:.2f}s — {sid}]")


if __name__ == "__main__":
    main()
