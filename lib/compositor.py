"""Encode video + narration into a final MP4 via ffmpeg.

Two entry points:

- ``FrameEncoder``: takes PNG frames one at a time (from export_demo.py's
  frame-stepped renderer) and encodes them with the narration. This is the
  main path for ``demos/*`` scenes.
- ``stitch``: combines an existing recording (webm) with audio. Used by the
  legacy YAML pipeline (generate.py), which records the live site.
"""

from __future__ import annotations

import logging
import subprocess
from pathlib import Path

log = logging.getLogger(__name__)

# `slow` preset + crf 17 + film tuning keeps smooth gradients from banding when
# YUV420 8-bit quantization gets aggressive (radial glows and soft shadows
# exposed the earlier medium/20 defaults). File size goes up modestly.
X264_ARGS = [
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "17",
    "-tune", "film",
    # Psychovisual tuning that preserves gradient precision.
    "-x264-params", "psy-rd=1.0,0.15:aq-strength=0.8",
    "-sws_dither", "ed",
    "-pix_fmt", "yuv420p",
]
AUDIO_ARGS = ["-c:a", "aac", "-b:a", "192k"]

# Screenshots are full-range sRGB. Convert to the standard limited-range
# BT.709 YUV that players expect, and tag the file so they decode it that way.
# (Converting already limited-range video "from full range" a second time is
# what washed whites out to light gray in earlier exports.)
RGB_TO_BT709 = (
    "scale=out_color_matrix=bt709:out_range=tv:"
    "flags=lanczos+accurate_rnd+full_chroma_int+full_chroma_inp,format=yuv420p"
)
BT709_TAGS = [
    "-colorspace", "bt709", "-color_primaries", "bt709",
    "-color_trc", "bt709", "-color_range", "tv",
]


class FrameEncoder:
    """Pipe PNG frames into ffmpeg; narration starts at frame 0.

    The output is exactly ``duration`` long: audio shorter than the video is
    padded with silence, longer audio is cut.
    """

    def __init__(self, *, output: Path, fps: int, audio: Path, duration: float):
        self.output, self.fps, self.audio, self.duration = output, fps, audio, duration
        self.proc: subprocess.Popen | None = None

    def __enter__(self) -> "FrameEncoder":
        self.output.parent.mkdir(parents=True, exist_ok=True)
        cmd = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-f", "image2pipe", "-framerate", str(self.fps), "-c:v", "png", "-i", "-",
            "-i", str(self.audio),
            "-map", "0:v", "-map", "1:a",
            "-vf", RGB_TO_BT709, *X264_ARGS, *BT709_TAGS,
            "-af", "apad", *AUDIO_ARGS,
            "-t", f"{self.duration:.3f}",
            "-movflags", "+faststart",
            str(self.output),
        ]
        log.info("ffmpeg -> %s (%d fps)", self.output, self.fps)
        self.proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        return self

    def write(self, png: bytes) -> None:
        assert self.proc and self.proc.stdin
        self.proc.stdin.write(png)

    def __exit__(self, exc_type, exc, tb) -> None:
        assert self.proc and self.proc.stdin
        self.proc.stdin.close()
        code = self.proc.wait()
        if exc_type is None and code != 0:
            raise RuntimeError(f"ffmpeg exited with {code}")
        if exc_type is None:
            log.info("wrote %s (%s bytes)", self.output, self.output.stat().st_size)


def stitch(
    *,
    video: Path,
    audio: Path,
    output: Path,
    video_start: float = 0.0,
) -> Path:
    """Combine a recorded ``video`` (webm) with ``audio`` (mp3) into an MP4.

    - ``video_start`` skips N seconds at the head of the video (used to drop
      the page-load prefix the recorder captures before interactions begin).
    - ``-shortest`` ends the file when the shorter stream ends.

    The recording is already limited-range video, so it is not range-converted
    (doing that is what washed exports out to gray).
    """
    output.parent.mkdir(parents=True, exist_ok=True)

    cmd = ["ffmpeg", "-y"]
    if video_start > 0:
        # -ss before -i gives fast seeking; re-encoding keeps it frame-accurate.
        cmd.extend(["-ss", f"{video_start:.3f}"])
    cmd.extend([
        "-i", str(video),
        "-i", str(audio),
        "-vf", "scale=flags=lanczos+accurate_rnd+full_chroma_int+full_chroma_inp,format=yuv420p",
        *X264_ARGS,
        *AUDIO_ARGS,
        "-shortest",
        "-movflags", "+faststart",
        str(output),
    ])
    log.info("ffmpeg -> %s (video_start=%.2fs)", output, video_start)
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    log.info("wrote %s (%s bytes)", output, output.stat().st_size)
    return output
