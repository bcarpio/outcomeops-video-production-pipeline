"""Re-synthesize narration-O.mp3 with ElevenLabs alignment data, then
print scene boundaries derived from the actual word timings.

Output: prints suggested SCENES_O array + Sprite ranges that match Drew's
actual delivery, so we can stop guessing scene transitions.
"""
import base64
import json
import os
import re
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
    "speed": 1.15,
}

# First word/phrase of each scene narration — used to locate scene boundaries.
SCENE_MARKERS = [
    ("o1", "DevOps"),       # scene 1 starts
    ("o2", "August"),       # scene 2: "August eighteenth..."
    ("o3", "Then I"),       # scene 3: "Then I built..."
    ("o4", "Every"),        # scene 4: "Every platform shift..."
    ("o5", "AI is in"),     # scene 5: "AI is in Phase 3..."
    ("o6", "OutcomeOps"),   # scene 6: "OutcomeOps is Nibiru..."
    ("o7", "December"),     # scene 7: "December twenty-twenty-five..."
    ("o8", "Sixteen"),      # scene 8: "Sixteen-hour tasks..."
    ("o9", "The pattern"),  # scene 9: "The pattern keeps repeating..."
]


def strip_markers(text: str) -> str:
    blocks, current = [], []
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


def synthesize_with_timestamps(api_key: str, text: str) -> dict:
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
    with urllib.request.urlopen(req, timeout=240) as resp:
        return json.loads(resp.read().decode("utf-8"))


def find_phrase_start(alignment: dict, phrase: str, start_idx: int = 0) -> tuple[float, int]:
    """Find the timestamp (seconds) where `phrase` starts in the alignment.
    Returns (start_seconds, character_index_after_phrase) for chained searches."""
    chars = alignment["characters"]
    starts = alignment["character_start_times_seconds"]
    haystack = "".join(chars[start_idx:])
    pos = haystack.find(phrase)
    if pos < 0:
        raise ValueError(f"phrase not found from idx {start_idx}: {phrase!r}")
    abs_idx = start_idx + pos
    return starts[abs_idx], abs_idx + len(phrase)


def main():
    txt_path = Path(sys.argv[1] if len(sys.argv) > 1 else "demos/origin/narration-O.txt").resolve()
    text = strip_markers(txt_path.read_text())

    api_key = get_api_key()
    print(f"Synthesizing {len(text.split())} words with timestamps...")
    resp = synthesize_with_timestamps(api_key, text)

    audio_bytes = base64.b64decode(resp["audio_base64"])
    mp3_path = txt_path.with_suffix(".mp3")
    mp3_path.write_bytes(audio_bytes)
    print(f"Wrote {mp3_path} ({len(audio_bytes):,} bytes)")

    alignment = resp["alignment"]
    marks_path = txt_path.with_suffix(".marks.json")
    marks_path.write_text(json.dumps(alignment, indent=2))
    print(f"Wrote {marks_path} (alignment data)")

    # Derive scene boundaries from phrase positions.
    print("\n=== Scene boundaries (Drew's actual timings) ===\n")
    cursor = 0
    boundaries = []
    for tag, phrase in SCENE_MARKERS:
        ts, cursor = find_phrase_start(alignment, phrase, cursor)
        boundaries.append((tag, phrase, ts))
        print(f"  {tag:5s}  {ts:6.2f}s   first words: {phrase!r}")

    # End of narration
    total_dur = alignment["character_end_times_seconds"][-1]
    print(f"\n  END    {total_dur:6.2f}s   (total narration)")

    print("\n=== Suggested Sprite ranges (with 0.2s overlap) ===\n")
    for i, (tag, _, ts) in enumerate(boundaries):
        next_ts = boundaries[i + 1][2] if i + 1 < len(boundaries) else total_dur + 2
        end = next_ts + 0.2 if i + 1 < len(boundaries) else total_dur + 2
        scene_n = i + 1
        print(f"  <Sprite start={{{ts:.1f}}}  end={{{end:.1f}}}> <SceneO{scene_n}/></Sprite>")

    print("\n=== Suggested SCENES_O array ===\n")
    starts = [round(b[2], 1) for b in boundaries]
    print(f"  const SCENES_O = {starts};")
    print(f"\n=== Suggested Stage duration ===\n  duration={{{total_dur + 2:.0f}}}\n")


if __name__ == "__main__":
    main()
