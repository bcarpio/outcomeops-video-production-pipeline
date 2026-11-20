"""Synth all 7 beats for openai-bedrock-power via ElevenLabs Drew.

Beats land in demos/openai-bedrock-power/_synth/<beat>.mp3. Run once;
re-run an individual beat by passing its tag (e.g. `python scripts/examples/synth_obp.py b4`).

Drew @ 1.1, standard settings. Per CLAUDE.md the ElevenLabs API key
lives in SSM SecureString at /outcomeops-video-gen/eleven-labs.
"""
import json
import os
import sys
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

OUT_DIR = Path(__file__).resolve().parents[2] / "demos/openai-bedrock-power/_synth"

BEATS = {
    "b1": (
        "For two years, the conversation in this industry has been about "
        "which frontier model wins. Claude or G P T. Grok or Mistral. "
        "Open weights or hosted. Benchmark after benchmark. Leaderboard "
        "after leaderboard."
    ),
    "b2": (
        "Then A W S did something remarkable. Bedrock pulled twenty-plus "
        "frontier model families behind one control plane. One I A M "
        "boundary. One audit log. All inside the customer's own A W S "
        "account. The frontier-model question stopped being an "
        "integration problem. Choice was returned to the buyer. That is "
        "a real accomplishment, and it deserves to be named."
    ),
    "b2b": (
        "And the latest addition just landed. OpenAI's G P T five point "
        "five is now live on Bedrock -- the twentieth frontier family in "
        "the catalog. Congratulations to the OpenAI team. This is a "
        "genuine shipping moment. The model layer is officially "
        "commodified."
    ),
    "b3": (
        "And we're going to argue something a little contrarian. Now "
        "that the integration problem is solved, it doesn't actually "
        "matter which model you pick. Because picking a model is still "
        "picking a tool. And OutcomeOps isn't in that business. We "
        "deliver something different."
    ),
    "b4": (
        "When a security architect asks where this platform touches "
        "P C I card data, the answer cites the same architectural "
        "decision record. The same masking utility. The same auditing "
        "standard. The same runbook. Same role-scoped retrieval. Same "
        "audit entry. The synthesizing prose differs, because Claude "
        "phrases differently than G P T, and G P T phrases differently "
        "than Grok. But the substance is identical. The model is the "
        "synthesis. Your corpus is the substance. The customer picks "
        "the model. We don't."
    ),
    "b5": (
        "The model is a commodity. That's a compliment. Frontier "
        "capability is real, and now the choice belongs to the buyer "
        "instead of the platform. But outcomes are a different "
        "category. Outcomes are what your engineers actually trust. "
        "What your auditors actually accept. What your C I S O actually "
        "signs off on. The model is the commodity. The outcome is the "
        "moat."
    ),
    "b6": (
        "OpenAI brings the synthesis. A W S brings the deployment. "
        "OutcomeOps brings the outcome. Pick the model. Keep the "
        "substrate. OutcomeOps dot A I."
    ),
}


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


def synth_beat(api_key: str, beat: str, text: str) -> int:
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
        audio = resp.read()
    out = OUT_DIR / f"{beat}.mp3"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(audio)
    return len(audio)


def main():
    api_key = get_api_key()
    targets = sys.argv[1:] if len(sys.argv) > 1 else list(BEATS.keys())
    for beat in targets:
        if beat not in BEATS:
            print(f"!! unknown beat: {beat}", file=sys.stderr)
            continue
        size = synth_beat(api_key, beat, BEATS[beat])
        print(f"  {beat:4s}  {size:>8,d} bytes")


if __name__ == "__main__":
    main()
