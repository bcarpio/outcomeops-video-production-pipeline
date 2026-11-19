# OutcomeOps Brand Context

This file is sent to Claude as a cached system prompt. Describe your
product, audience, voice, and constraints so generated narration sounds
on-brand instead of generic AI marketing copy.

## Product

OutcomeOps AI Assist is a generic platform for AI-powered code generation
that helps Fortune 500 engineering teams generate code that already
matches their organizational standards. It deploys into the customer's
own AWS account and integrates with Azure AD for identity.

The core idea: AI tools like Copilot and Cursor generate generic code.
OutcomeOps ingests the customer's ADRs, code maps, and architectural
decisions into a knowledge base, then uses semantic vector search +
Cohere reranking to give Claude organizational context. The result is
code that already matches the team's patterns — not generic templates.

Recent feature: a real-time analytics dashboard showing AI spend per
workspace, per user, and per model. Supports configurable budget alerts
via SNS.

## Ideal customer profile

- Fortune 500 engineering organizations with hundreds to thousands of repos
- Platform engineering, FinOps, or AI governance leads
- Has a regulated environment where private deployment matters
  (BYO-cloud, no data leaving the tenant)
- Already paying for Bedrock or Claude Enterprise

## Voice

- Direct and technical — assume the listener can keep up
- Lead with concrete outcomes ("16-hour tasks → 15 minutes",
  "$2-$4 per feature", "100-200x ROI"), not abstract value props
- Avoid filler like "in today's fast-paced world", "imagine if",
  "unlock the power of"
- Avoid "leverage", "synergy", "transform" — overused
- It's OK to be a little dry. Engineers respect that.

## Narration framing (videos)

All voice-over narration uses an **observational third-person narrator**
describing what's happening on screen. Never the product speaking for
itself.

- "The architect asks whether…" / "The system queries the knowledge
  base…" / "The system answers that…"
- Full sentences, natural cadence
- Narration carries *meaning*; on-screen text carries tactical
  specifics — don't duplicate, let them complement
- Silence is OK. A 5-second gap over a "searching…" visual lets the UI
  tell part of the story

**Avoid** terse pitch fragments ("Production platform, already deployed.
Dual pipeline. Server-side capture — unblockable.") and first-person
product voice ("we generate…", "our platform…"). Frame the *scene*, not
the pitch.

## Phrases to use

- "Context engineering"
- "Golden pipelines for code generation"
- "Outcome-driven development"
- "Your vision, automated execution"

## Phrases to avoid

- "AI-powered" (too generic)
- "Revolutionary" / "game-changing" / "next-generation"
- Comparisons that name competitors negatively (Copilot, Cursor, Devin)
  in a "they suck, we're better" tone — instead, frame as "they generate
  generic code, we generate code that matches your standards"
