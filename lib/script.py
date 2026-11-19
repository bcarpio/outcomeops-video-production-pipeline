"""Generate narration scripts via Claude on AWS Bedrock.

Uses ``anthropic.AnthropicBedrock`` so the same Anthropic SDK shape works
against Bedrock — billing rolls up under the AWS account, no separate
Anthropic key, IAM-scoped instead of an API key. Falls back to the direct
Anthropic API only if a feature ships there first.

The brand context (a markdown file the user edits) is sent as the system
prompt with prompt caching enabled. The first scene per cache window pays
the full input price; subsequent scenes within ~5 minutes read from cache.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path

import anthropic

log = logging.getLogger(__name__)

# Bedrock inference profile — matches what prd.tfvars uses for the
# product's own ADVANCED_MODEL. Sonnet is more than capable for short
# marketing narration and is roughly 5x cheaper than Opus.
MODEL = "us.anthropic.claude-sonnet-4-6"

SYSTEM_INSTRUCTIONS = """\
You write narration scripts for short marketing videos of a real
software product. The user will give you a scene prompt; you produce
the narration text that AWS Polly will read aloud.

Rules:
- Output narration text ONLY. No stage directions, no scene headers,
  no "Narrator:" prefixes, no markdown formatting, no quotes around
  the text. Just the words Polly should speak.
- Match the brand voice described in the brand context above.
- Keep the pace natural — about 150 words per minute. A 30-second
  scene is roughly 75 words; 60 seconds is 150 words.
- Open strong. The first sentence has to make the viewer keep watching.
- End with something memorable, not a meandering trail-off.
- No "in conclusion", "to wrap up", or other filler.
"""


def generate_narration(
    *,
    brand_context: str,
    scene_prompt: str,
    target_seconds: int,
    region: str | None = None,
) -> str:
    """Ask Claude (via Bedrock) to write narration for one scene.

    The brand context goes in the system prompt with cache_control so
    repeat invocations reuse the cached prefix. AWS credentials come
    from the ambient boto3 chain (env vars or ~/.aws/credentials).
    """
    client = anthropic.AnthropicBedrock(
        aws_region=region or os.environ.get("AWS_REGION", "us-west-2"),
    )

    target_words = max(20, int(target_seconds * 2.5))  # ~150 wpm

    user_message = (
        f"Write the narration for this scene. Target length: about "
        f"{target_words} words ({target_seconds} seconds at natural pace).\n\n"
        f"Scene prompt:\n{scene_prompt}"
    )

    response = client.messages.create(
        model=MODEL,
        max_tokens=2000,
        system=[
            {
                "type": "text",
                "text": brand_context,
                "cache_control": {"type": "ephemeral"},
            },
            {"type": "text", "text": SYSTEM_INSTRUCTIONS},
        ],
        messages=[{"role": "user", "content": user_message}],
    )

    log.info(
        "claude tokens: input=%s cached_read=%s cached_write=%s output=%s",
        response.usage.input_tokens,
        response.usage.cache_read_input_tokens,
        response.usage.cache_creation_input_tokens,
        response.usage.output_tokens,
    )

    text_blocks = [b.text for b in response.content if b.type == "text"]
    return "\n\n".join(text_blocks).strip()


def load_brand_context(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(
            f"brand context not found at {path} — copy and edit brand_context.md"
        )
    return path.read_text(encoding="utf-8")
