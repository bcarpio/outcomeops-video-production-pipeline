"""Synth b3b for intelligence-layer demo (AI coding agents on the substrate).

Drew @ 1.1, standard settings. Writes _synth/b3b.mp3.
"""
import base64
import json
import os
import urllib.request
from pathlib import Path

import boto3

VOICE_ID = "q0IMILNRPxOgtBTS4taI"  # Drew
MODEL = "eleven_multilingual_v2"
SETTINGS = {
    "stability": 0.72,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": True,
    "speed": 1.1,
}

TEXT = (
    "And it's not just humans asking. Every A I coding agent in the "
    "organization -- Cursor, Claude Code, Copilot -- gets fed from the "
    "same substrate. The whole organization shares one corpus. This is "
    "the antithesis of the local optimization trap, where every team "
    "builds their own private context. One source of truth. Every "
    "consumer, human and machine."
)

OUT = Path(__file__).resolve().parents[2] / "demos/intelligence-layer/_synth/b3b.mp3"


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


def main():
    api_key = get_api_key()
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    body = json.dumps({
        "text": TEXT,
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
    with urllib.request.urlopen(req, timeout=120) as resp:
        audio = resp.read()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(audio)
    print(f"wrote {OUT} ({len(audio):,} bytes)")


if __name__ == "__main__":
    main()
