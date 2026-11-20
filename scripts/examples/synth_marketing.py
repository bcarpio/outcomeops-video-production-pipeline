"""Synthesize a marketing narration mp3 via ElevenLabs Drew at speed 1.1.

Usage:
    python scripts/examples/synth_marketing.py demos/marketing/narration-C.txt
    python scripts/examples/synth_marketing.py demos/marketing/narration-G.txt

Reads a [t — beat_id]-tagged narration file, strips the markers, sends the
prose to ElevenLabs, writes <input>.replace('.txt', '.mp3').
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import boto3
import urllib.request

VOICE_ID = "q0IMILNRPxOgtBTS4taI"  # Drew
MODEL = "eleven_multilingual_v2"
SETTINGS = {
    "stability": 0.72,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": True,
    "speed": 1.1,
}
TARGET_DURATION = 32.0  # seconds — marketing Stage runs 32s for C and G


def strip_markers(text: str) -> str:
    """Remove [t — beat_id] lines, return prose joined by paragraph breaks."""
    blocks = []
    current = []
    for line in text.splitlines():
        if re.match(r"^\s*\[", line):
            if current:
                blocks.append(" ".join(current).strip())
                current = []
            continue
        if line.strip():
            current.append(line.strip())
    if current:
        blocks.append(" ".join(current).strip())
    return "\n\n".join(b for b in blocks if b)


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


def synthesize(api_key: str, text: str) -> bytes:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
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


def pad_to(path: Path, target: float) -> Path:
    """If audio shorter than target, write a -padded.mp3 sibling at exactly target."""
    cur = ffprobe_duration(path)
    if cur >= target:
        return path
    padded = path.with_name(path.stem + "-padded.mp3")
    subprocess.run([
        "ffmpeg", "-y", "-i", str(path),
        "-af", f"apad=whole_dur={target}",
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(padded),
    ], check=True, capture_output=True)
    return padded


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    txt_path = Path(sys.argv[1]).resolve()
    text = strip_markers(txt_path.read_text())
    print(f"Prose ({len(text.split())} words):\n{text}\n")

    api_key = get_api_key()
    audio = synthesize(api_key, text)

    mp3_path = txt_path.with_suffix(".mp3")
    mp3_path.write_bytes(audio)
    dur = ffprobe_duration(mp3_path)
    print(f"Wrote {mp3_path} ({len(audio):,} bytes, {dur:.2f}s)")

    padded = pad_to(mp3_path, TARGET_DURATION)
    if padded != mp3_path:
        print(f"Padded to {TARGET_DURATION}s → {padded}")


if __name__ == "__main__":
    main()
