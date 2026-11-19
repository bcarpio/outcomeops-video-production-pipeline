"""Stitch audio + video into a final MP4 via ffmpeg."""

from __future__ import annotations

import logging
import subprocess
from pathlib import Path

log = logging.getLogger(__name__)


def stitch(
    *,
    video: Path,
    audio: Path,
    output: Path,
    video_start: float = 0.0,
) -> Path:
    """Combine ``video`` (webm) + ``audio`` (mp3) into an MP4 at ``output``.

    - Re-encodes video to h.264 for broad compatibility (Slack, email, LinkedIn).
    - Encodes audio to AAC.
    - ``video_start`` skips N seconds at the head of the video (used to drop
      the page-load prefix the recorder captures before interactions begin).
    - ``-shortest`` ensures the final file ends when the shorter stream ends —
      we already match durations in the recorder, so this is a guard.
    """
    output.parent.mkdir(parents=True, exist_ok=True)

    cmd = ["ffmpeg", "-y"]
    if video_start > 0:
        # -ss before -i gives fast, keyframe-accurate seeking, and since we're
        # re-encoding below it's also frame-accurate.
        cmd.extend(["-ss", f"{video_start:.3f}"])
    cmd.extend([
        "-i", str(video),
        "-i", str(audio),
        "-c:v", "libx264",
        # `slow` preset + crf 17 + film tuning keeps smooth gradients from
        # banding when YUV420 8-bit quantization gets aggressive. The
        # intelligence-layer demo's substrate sphere + radial halos exposed
        # the previous medium/20 defaults; this is now the channel-wide
        # default since other demos benefit (substrate glows, code panels,
        # diff card shadows). File size goes up modestly (~40%).
        "-preset", "slow",
        "-crf", "17",
        "-tune", "film",
        # Psychovisual tuning that preserves gradient precision.
        "-x264-params", "psy-rd=1.0,0.15:aq-strength=0.8",
        # Dither during sws conversion -> reduces banding when 8-bit YUV420
        # is the output. `accurate_rnd` keeps rounding errors from cascading.
        "-vf", "scale=in_range=pc:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int+full_chroma_inp,format=yuv420p",
        "-sws_dither", "ed",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        "-movflags", "+faststart",
        str(output),
    ])
    log.info("ffmpeg -> %s (video_start=%.2fs)", output, video_start)
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    log.info("wrote %s (%s bytes)", output, output.stat().st_size)
    return output
