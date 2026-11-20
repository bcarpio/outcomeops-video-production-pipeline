"""Synthesize a scene's narration with ElevenLabs and print its beat timings.

This is the generic version of the per-scene synth_*.py scripts. Point it at a
narration.txt written with [[LABEL]] beat markers:

    [[B0]]
    An engineer files a ticket.

    [[B1]]
    The user story is three sentences.

It sends the prose (markers stripped) to ElevenLabs' /with-timestamps endpoint
once, then writes, next to the narration file:

  narration.mp3          the voice-over
  narration.marks.json   {"beats": {label: start_seconds}, "raw_duration": ...}

and prints a BEATS constant to paste into scene.jsx plus the Stage duration
to put in index.html.

API key: ELEVENLABS_API_KEY if set; otherwise the SSM SecureString named by
--ssm-param (this repo's own setup). Use whichever you prefer.

Usage:
    python scripts/synth.py demos/starter/narration.txt
    python scripts/synth.py demos/my-scene/narration.txt --voice <voice_id> --speed 1.0
"""
import argparse
import base64
import json
import os
import re
import subprocess
import urllib.request
from pathlib import Path

DEFAULT_VOICE = "q0IMILNRPxOgtBTS4taI"   # ElevenLabs "Drew", used for every OutcomeOps video
DEFAULT_MODEL = "eleven_multilingual_v2"
DEFAULT_SSM_PARAM = "/outcomeops-video-gen/eleven-labs"
SEP = "\n\n"


def parse_beats(text: str):
    """Return an ordered list of (label, prose) from a [[LABEL]]-marked file."""
    beats, label, buf = [], None, []
    for line in text.splitlines():
        m = re.match(r"^\s*\[\[([^\]]+)\]\]\s*$", line)
        if m:
            if label is not None:
                beats.append((label, " ".join(buf).strip()))
            label, buf = m.group(1).strip(), []
        elif line.strip() and label is not None:
            buf.append(line.strip())
    if label is not None:
        beats.append((label, " ".join(buf).strip()))
    beats = [(lbl, prose) for lbl, prose in beats if prose]
    if not beats:
        raise SystemExit("No [[LABEL]] beats found. Put a marker like [[B0]] on its own line before each beat.")
    return beats


def build_prose(beats):
    """Join beats with SEP; return (prose, {label: char_offset_of_beat_start})."""
    prose, offsets = "", {}
    for i, (label, chunk) in enumerate(beats):
        if i:
            prose += SEP
        offsets[label] = len(prose)
        prose += chunk
    return prose, offsets


def get_api_key(ssm_param: str) -> str:
    key = os.environ.get("ELEVENLABS_API_KEY")
    if key:
        return key
    import boto3  # only needed for the SSM fallback
    ssm = boto3.client("ssm", region_name=os.environ.get("AWS_REGION", "us-west-2"))
    return ssm.get_parameter(Name=ssm_param, WithDecryption=True)["Parameter"]["Value"]


def synthesize(api_key: str, text: str, voice: str, model: str, settings: dict) -> dict:
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps",
        data=json.dumps({"text": text, "model_id": model, "voice_settings": settings}).encode(),
        headers={"xi-api-key": api_key, "Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        return json.loads(resp.read())


def ffprobe_duration(path: Path) -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path),
    ])
    return float(out.strip())


def pad_tail(path: Path, target: float) -> None:
    """Pad the mp3 with silence to `target` seconds so an end card survives export."""
    tmp = path.with_name(path.stem + "-padded.mp3")
    subprocess.run(["ffmpeg", "-y", "-i", str(path), "-af", f"apad=whole_dur={target}",
                    "-c:a", "libmp3lame", "-b:a", "192k", str(tmp)], check=True, capture_output=True)
    tmp.replace(path)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("narration", type=Path, help="Path to a [[LABEL]]-marked narration.txt")
    ap.add_argument("--voice", default=DEFAULT_VOICE, help="ElevenLabs voice ID")
    ap.add_argument("--model", default=DEFAULT_MODEL, help="ElevenLabs model ID")
    ap.add_argument("--speed", type=float, default=1.1, help="Speaking speed (default 1.1)")
    ap.add_argument("--stability", type=float, default=0.72)
    ap.add_argument("--similarity", type=float, default=0.75)
    ap.add_argument("--style", type=float, default=0.0)
    ap.add_argument("--tail", type=float, default=1.5, help="Seconds of silence after the last word, for an end card")
    ap.add_argument("--ssm-param", default=DEFAULT_SSM_PARAM, help="SSM parameter used when ELEVENLABS_API_KEY is unset")
    args = ap.parse_args()

    txt = args.narration.resolve()
    beats = parse_beats(txt.read_text())
    prose, offsets = build_prose(beats)
    print(f"Beats: {', '.join(lbl for lbl, _ in beats)} ({len(prose.split())} words)")

    settings = {"stability": args.stability, "similarity_boost": args.similarity,
                "style": args.style, "use_speaker_boost": True, "speed": args.speed}
    resp = synthesize(get_api_key(args.ssm_param), prose, args.voice, args.model, settings)

    mp3 = txt.with_name("narration.mp3")
    mp3.write_bytes(base64.b64decode(resp["audio_base64"]))
    raw = ffprobe_duration(mp3)

    starts = resp["alignment"]["character_start_times_seconds"]
    times = {lbl: round(starts[min(off, len(starts) - 1)], 3) for lbl, off in offsets.items()}
    txt.with_name("narration.marks.json").write_text(
        json.dumps({"beats": times, "raw_duration": round(raw, 3)}, indent=2))

    total = round(raw + args.tail, 2)
    if args.tail > 0:
        pad_tail(mp3, total)

    print(f"Wrote {mp3} ({raw:.2f}s of speech, {total:.2f}s with tail) and narration.marks.json\n")
    print("--- paste into scene.jsx ---")
    print("const BEATS = {")
    for lbl, _ in beats:
        print(f"  {json.dumps(lbl)}: {times[lbl]:.2f},")
    print("};")
    print(f"\n--- set the Stage duration in index.html ---\nduration={{{total}}}")


if __name__ == "__main__":
    main()
