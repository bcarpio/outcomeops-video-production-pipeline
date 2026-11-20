"""Join exported scene MP4s into one video, in order, without re-encoding.

Use it for videos longer than one ElevenLabs request allows (split the script
across several scenes, export each, then join them) and for appending a shared
call-to-action scene to the end of each video.

Every input must come from export_demo.py with the same --fps and --viewport;
the streams are copied as-is, so the join is lossless and takes seconds.

Usage:
    python scripts/concat.py output/part-1/final.mp4 output/part-2/final.mp4 \\
        --output output/full/final.mp4
    python scripts/concat.py output/my-video/final.mp4 output/cta/final.mp4 \\
        --output output/my-video/with-cta.mp4
"""
import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path


def stream_info(path: Path) -> tuple:
    """(width, height, frame rate, video codec, audio codec, audio sample rate)."""
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries",
        "stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate",
        "-of", "json", str(path),
    ])
    streams = json.loads(out)["streams"]
    v = next(s for s in streams if s["codec_type"] == "video")
    a = next((s for s in streams if s["codec_type"] == "audio"), {})
    return (v["width"], v["height"], v["r_frame_rate"], v["codec_name"],
            a.get("codec_name"), a.get("sample_rate"))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("inputs", type=Path, nargs="+", help="MP4s to join, in order")
    ap.add_argument("--output", type=Path, required=True, help="Joined MP4")
    args = ap.parse_args()

    if len(args.inputs) < 2:
        sys.exit("give at least two MP4s to join")
    for p in args.inputs:
        if not p.exists():
            sys.exit(f"missing: {p}")

    infos = {p: stream_info(p) for p in args.inputs}
    first = infos[args.inputs[0]]
    mismatched = [p for p, info in infos.items() if info != first]
    if mismatched:
        lines = "\n".join(f"  {p}: {infos[p]}" for p in args.inputs)
        sys.exit("inputs differ in size, frame rate or codecs, so they can't be joined "
                 f"losslessly. Re-export them with the same --fps and --viewport.\n{lines}")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", suffix=".txt", dir=args.output.parent, delete=False) as f:
        for p in args.inputs:
            f.write(f"file '{p.resolve().as_posix()}'\n")
        listing = Path(f.name)
    try:
        subprocess.run([
            "ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
            "-i", str(listing), "-c", "copy", "-movflags", "+faststart", str(args.output),
        ], check=True)
    finally:
        listing.unlink(missing_ok=True)
    print(f"wrote {args.output}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
