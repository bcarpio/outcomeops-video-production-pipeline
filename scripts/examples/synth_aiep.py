"""Synthesize narration.txt via ElevenLabs Hank for the
"What Is an AI Engineering Platform?" video.

Switched from Liam (had close-mic proximity artifact baked into training)
to Hank, who reads cleaner with the same low-settings tuning. Hank's
native pace is slower than Drew, so atempo bumps slightly faster (1.07)
rather than slower.

Voice settings:
  - stability=0.4
  - similarity_boost=0.5
  - use_speaker_boost=False
  - speed=1.0 (native synth; atempo=1.07 in post)

Per-scene atempo applied so concatenated boundaries are already in final
post-processed time.
"""
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

import boto3

VOICE_ID = "6F5Zhi321D3Oq7v1oNT4"  # Hank
MODEL = "eleven_multilingual_v2"
SETTINGS = {
    "stability": 0.4,
    "similarity_boost": 0.5,
    "style": 0.0,
    "use_speaker_boost": False,
    "speed": 1.0,
}
ATEMPO = 1.13  # ~13% faster than native; slightly into marginal artifact zone but reads clean


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
        "voice_settings": SETTINGS,
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
    with urllib.request.urlopen(req, timeout=180) as resp:
        return resp.read()


def ffprobe_duration(path: Path) -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path),
    ])
    return float(out.strip())


def apply_atempo(in_path: Path, out_path: Path) -> None:
    subprocess.run([
        "ffmpeg", "-y", "-i", str(in_path),
        "-af", f"atempo={ATEMPO}",
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(out_path),
    ], check=True, capture_output=True)


def main():
    txt_path = Path(sys.argv[1] if len(sys.argv) > 1 else
                    "demos/what-is-ai-engineering-platform/narration.txt").resolve()
    scenes = parse_scenes(txt_path.read_text())
    print(f"Parsed {len(scenes)} scenes (Hank @ stability=0.4, similarity=0.5, atempo={ATEMPO})\n")

    api_key = get_api_key()
    work_dir = txt_path.parent / "_synth_tmp"
    work_dir.mkdir(exist_ok=True)

    parts: list[Path] = []
    boundaries = [0.0]
    for sid, prose in scenes:
        print(f"  {sid}: {prose[:70]}...")
        # Synth raw at native speed
        raw_path = work_dir / f"{sid}_raw.mp3"
        raw_path.write_bytes(synth_scene(api_key, prose))
        # Apply atempo for final pacing
        final_path = work_dir / f"{sid}.mp3"
        apply_atempo(raw_path, final_path)
        dur = ffprobe_duration(final_path)
        boundaries.append(boundaries[-1] + dur)
        print(f"    → {dur:.2f}s  (scene starts at {boundaries[-2]:.2f}s)")
        parts.append(final_path)

    # Concatenate atempo-adjusted parts
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

    print("=== Scene boundaries (atempo-adjusted, final timing) ===")
    for i, (sid, _) in enumerate(scenes):
        print(f"  {sid}: {boundaries[i]:>8.2f}s")
    print(f"  END: {total:>8.2f}s\n")

    print("=== Suggested B object (paste into scene.jsx) ===")
    short_keys = {
        's1_hook': 'hook',
        's2_platform_vs_assistant': 'scope',
        's3_five_components': 'layers',
        's4_four_platforms': 'platforms',
        's5_five_questions': 'questions',
        's6_cta': 'cta',
    }
    print("const B = {")
    for i, (sid, _) in enumerate(scenes):
        key = short_keys.get(sid, sid)
        print(f"  {key:<10}: {boundaries[i]:>7.2f},")
    print(f"  end       : {total:>7.2f},")
    print("};")


if __name__ == "__main__":
    main()
