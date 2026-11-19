"""Render narration text to MP3 via AWS Polly Neural voices."""

from __future__ import annotations

import logging
import subprocess
from pathlib import Path

import boto3

log = logging.getLogger(__name__)

# Polly Neural voices — see https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
DEFAULT_VOICE = "Joanna"


def synthesize(
    *,
    text: str,
    output_path: Path,
    voice: str = DEFAULT_VOICE,
    region: str | None = None,
) -> Path:
    """Synthesize ``text`` to an MP3 at ``output_path`` and return the path.

    Uses Polly's Neural engine. Polly has a 3000-character limit per
    request — for longer scripts we'd need to chunk and concatenate, but
    typical 30-90 second narrations are well under that.
    """
    if len(text) > 3000:
        raise ValueError(
            f"narration is {len(text)} chars; Polly Neural caps at 3000. "
            "Split the scene or shorten the script."
        )

    polly = boto3.client("polly", region_name=region)
    response = polly.synthesize_speech(
        Text=text,
        OutputFormat="mp3",
        VoiceId=voice,
        Engine="neural",
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(response["AudioStream"].read())

    log.info("polly wrote %s (voice=%s, %s chars)", output_path, voice, len(text))
    return output_path


def measure_duration(audio_path: Path) -> float:
    """Return the duration of an audio file in seconds via ffprobe."""
    result = subprocess.run(
        [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(audio_path),
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(result.stdout.strip())
