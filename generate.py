#!/usr/bin/env python3
"""Generate a narrated marketing video from a scene YAML.

Pipeline per scene:

  1. Generate (or reuse) the narration script via Claude.
  2. Render the script to MP3 via AWS Polly Neural.
  3. Measure the audio duration and record the live site for that long.
  4. Stitch audio + video into a final MP4.

Each scene drops three files into ``output/<scene-name>/``:
``narration.mp3``, ``recording.webm``, ``final.mp4``. The intermediate
artifacts are kept so you can iterate on just the recorder or just the
script without re-running the whole pipeline.
"""

from __future__ import annotations

import argparse
import logging
import os
import sys
from pathlib import Path

import yaml
from dotenv import load_dotenv

from lib import compositor, narrator, recorder, script as scriptgen

REPO_ROOT = Path(__file__).resolve().parent
DEFAULT_BRAND_CONTEXT = REPO_ROOT / "brand_context.md"
DEFAULT_OUTPUT_ROOT = REPO_ROOT / "output"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("scene", type=Path, help="Path to a scene YAML file.")
    parser.add_argument(
        "--brand-context",
        type=Path,
        default=DEFAULT_BRAND_CONTEXT,
        help=f"Path to the brand context markdown (default: {DEFAULT_BRAND_CONTEXT.name})",
    )
    parser.add_argument(
        "--output-root",
        type=Path,
        default=DEFAULT_OUTPUT_ROOT,
        help=f"Where to write outputs (default: {DEFAULT_OUTPUT_ROOT.relative_to(REPO_ROOT)}/)",
    )
    parser.add_argument(
        "--skip-narration",
        action="store_true",
        help="Reuse an existing narration.mp3 if present (faster iteration on visuals).",
    )
    parser.add_argument(
        "--skip-recording",
        action="store_true",
        help="Reuse an existing recording.webm if present (faster iteration on audio).",
    )
    parser.add_argument(
        "--headed",
        action="store_true",
        help="Run the browser headed so you can watch the recording happen.",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Verbose logging.",
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )

    load_dotenv(REPO_ROOT / ".env")

    scene = _load_scene(args.scene)
    out_dir = args.output_root / scene["name"]
    out_dir.mkdir(parents=True, exist_ok=True)

    audio_path = out_dir / "narration.mp3"
    video_path = out_dir / "recording.webm"
    # Sidecar storing the seconds of page-load overhead at the head of the
    # webm. Written by the recorder, read by the compositor so that
    # --skip-recording still trims correctly.
    video_meta_path = out_dir / "recording.meta"
    final_path = out_dir / "final.mp4"
    narration_path = out_dir / "narration.txt"

    # 1. Narration script
    if args.skip_narration and audio_path.exists() and narration_path.exists():
        narration = narration_path.read_text(encoding="utf-8")
        logging.info("reusing existing narration (%s chars)", len(narration))
    else:
        narration = _resolve_narration(scene, args.brand_context)
        narration_path.write_text(narration, encoding="utf-8")
        logging.info("narration: %s chars\n%s", len(narration), narration)

    # 2. Polly TTS
    if args.skip_narration and audio_path.exists():
        logging.info("reusing existing %s", audio_path)
    else:
        narrator.synthesize(
            text=narration,
            output_path=audio_path,
            voice=scene.get("voice", narrator.DEFAULT_VOICE),
            region=os.environ.get("AWS_REGION"),
        )

    duration = narrator.measure_duration(audio_path)
    logging.info("audio duration: %.2fs", duration)

    # 3. Browser recording
    if args.skip_recording and video_path.exists():
        video_start = float(video_meta_path.read_text().strip()) if video_meta_path.exists() else 0.0
        logging.info("reusing existing %s (trim %.2fs from front)", video_path, video_start)
    else:
        result = recorder.record(
            url=scene["url"],
            output_path=video_path,
            target_seconds=duration + 0.5,  # tiny tail buffer
            viewport=scene.get("viewport"),
            interactions=scene.get("interactions"),
            headless=not args.headed,
        )
        video_start = result.content_start
        video_meta_path.write_text(f"{video_start:.3f}\n", encoding="utf-8")

    # 4. Stitch
    compositor.stitch(
        video=video_path,
        audio=audio_path,
        output=final_path,
        video_start=video_start,
    )

    logging.info("done — %s", final_path)
    return 0


def _load_scene(path: Path) -> dict:
    if not path.exists():
        sys.exit(f"scene file not found: {path}")
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        sys.exit(f"scene file must be a YAML mapping, got {type(data).__name__}")
    for required in ("name", "url"):
        if required not in data:
            sys.exit(f"scene is missing required field: {required}")
    if "narration" not in data and "narration_prompt" not in data:
        sys.exit("scene must define either 'narration' (verbatim) or 'narration_prompt' (for Claude)")
    return data


def _resolve_narration(scene: dict, brand_context_path: Path) -> str:
    """Use the verbatim narration if provided, otherwise ask Claude."""
    if "narration" in scene:
        return scene["narration"].strip()

    brand_context = scriptgen.load_brand_context(brand_context_path)
    target_seconds = int(scene.get("target_seconds", 30))
    return scriptgen.generate_narration(
        brand_context=brand_context,
        scene_prompt=scene["narration_prompt"],
        target_seconds=target_seconds,
        region=os.environ.get("AWS_REGION"),
    )


if __name__ == "__main__":
    sys.exit(main())
