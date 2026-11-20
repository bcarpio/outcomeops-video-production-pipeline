"""Stitch openai-bedrock-power per-beat synths into narration.mp3
with leadIn/tail silence per beat and print the window timings so
scene.jsx's S object can be refit.

Run after scripts/synth_obp.py. Writes:
  demos/openai-bedrock-power/narration.mp3 (the assembled track)
and prints per-beat speech_start times + recommended S windows.

Set TEMPO > 1.0 to speed every beat up via ffmpeg's atempo filter
(token-free per CLAUDE.md). Tested range: 0.95-1.07 is imperceptible.
"""
import subprocess
import sys
from pathlib import Path

TMP = Path(__file__).resolve().parents[2] / "demos/openai-bedrock-power/_synth"
OUT = Path(__file__).resolve().parents[2] / "demos/openai-bedrock-power/narration.mp3"

BEATS = ["b1", "b2", "b2b", "b3", "b4", "b5", "b6"]

# Speed boost. 1.07 is the upper end of "imperceptible artifact" per
# CLAUDE.md. Bump higher only after user feedback.
TEMPO = 1.07

# leadIn / tail per beat (seconds). Tuned so that:
#   - b1 has a 1.0s lead so the headline swarm reads before voice starts
#   - b2 -> b2b transition is 1.5s of silence (b2 tail + b2b leadIn) to let
#     the visual celebration prep land before the OpenAI launch voice
#   - b4 has 2.5s tail so visual Phase C (tfvars + pill) lands after voice
#   - b6 has 2.5s tail so the brand mark holds before fade-out
LEAD_IN = [1.0, 0.5, 1.0, 0.7, 0.6, 0.6, 0.6]
TAIL    = [0.8, 0.5, 1.0, 0.5, 2.5, 0.6, 2.5]


def dur(path: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(r.stdout.strip())


def beat_path(beat: str) -> Path:
    """Return the path to use for this beat. If TEMPO != 1.0, generate
    a tempo-shifted copy (cached) and return that path instead."""
    src = TMP / f"{beat}.mp3"
    if abs(TEMPO - 1.0) < 0.001:
        return src
    dst = TMP / f"{beat}_t{TEMPO:.2f}.mp3"
    if not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime:
        subprocess.run([
            "ffmpeg", "-y", "-i", str(src),
            "-af", f"atempo={TEMPO}",
            "-c:a", "libmp3lame", "-b:a", "192k",
            str(dst),
        ], check=True, capture_output=True)
    return dst


def main():
    paths = [beat_path(b) for b in BEATS]
    durs = [dur(p) for p in paths]

    # Compute beat windows + speech-start moments
    windows = []
    speech_starts = []
    cur = 0.0
    for i, b in enumerate(BEATS):
        start = cur
        speech = start + LEAD_IN[i]
        end = speech + durs[i] + TAIL[i]
        windows.append((start, end))
        speech_starts.append(speech)
        cur = end
    total = cur

    # Build the audio: alternate silence + beat mp3
    segs = []  # list of (kind, value)
    pos = 0.0
    for i, b in enumerate(BEATS):
        gap = speech_starts[i] - pos
        if gap > 0.001:
            segs.append(("sil", gap))
        segs.append(("beat", str(paths[i])))
        pos = speech_starts[i] + durs[i]
    tailpad = total - pos
    if tailpad > 0.001:
        segs.append(("sil", tailpad))

    # Map beat names to their (possibly tempo-shifted) paths
    path_by_beat = dict(zip(BEATS, paths))
    inputs, order, idx = [], [], 0
    for kind, val in segs:
        if kind == "sil":
            inputs += ["-f", "lavfi", "-t", f"{val:.3f}",
                       "-i", "anullsrc=r=44100:cl=mono"]
        else:
            # val was the beat tag; resolve to the (possibly tempo-shifted) path
            inputs += ["-i", val]
        order.append(idx)
        idx += 1
    concat_in = "".join(f"[{i}:a]" for i in order)
    filt = f"{concat_in}concat=n={len(order)}:v=0:a=1[a]"
    cmd = ["ffmpeg", "-y", *inputs,
           "-filter_complex", filt, "-map", "[a]",
           "-c:a", "libmp3lame", "-b:a", "192k",
           "-ar", "44100", "-ac", "1", str(OUT)]
    subprocess.run(cmd, check=True, capture_output=True)

    # Report
    print(f"\nDUR: {total:6.2f}s  ({int(total//60)}:{total % 60:05.2f})\n")
    print(f"{'beat':4s}  {'window':22s}  {'speech':>7s}  {'dur':>6s}")
    print("-" * 56)
    for i, b in enumerate(BEATS):
        ws, we = windows[i]
        print(f"  {b:<4s} [{ws:6.2f}, {we:6.2f}]   "
              f"{speech_starts[i]:>7.2f}  {durs[i]:>6.2f}")

    # Suggest Sprite windows (combine b2 + b2b into bedrock).
    print("\nSuggested S = {")
    print(f"  hook:     [0.00, {windows[0][1]:6.2f}],")
    print(f"  bedrock:  [{windows[1][0]:6.2f}, {windows[2][1]:6.2f}],")
    print(f"  pivot:    [{windows[3][0]:6.2f}, {windows[3][1]:6.2f}],")
    print(f"  outcome:  [{windows[4][0]:6.2f}, {windows[4][1]:6.2f}],")
    print(f"  contrast: [{windows[5][0]:6.2f}, {windows[5][1]:6.2f}],")
    print(f"  outro:    [{windows[6][0]:6.2f}, {windows[6][1]:6.2f}],")
    print(f"}}; DUR = {total:.2f}")


if __name__ == "__main__":
    main()
