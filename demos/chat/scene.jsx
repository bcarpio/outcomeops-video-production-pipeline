// scene.jsx — OutcomeOps Chat timeline, re-anchored to narration.mp3 beats.
//
// The narration MP3 has SSML <mark> tags at each beat. Polly returns the
// exact audio timestamps in narration.marks.json. We mirror those here as
// BEATS so the visual timeline moves with the voice — no drift, and if the
// narration is regenerated we only need to update BEATS.
//
// Synchronisation: AudioTrack (bottom of this file) reads useTimeline() and
// slaves narration.mp3 to the Stage playhead. Stage.setPlaying drives
// audio.play/pause; large drift triggers a seek (scrub, loop). The Stage
// RAF loop remains the clock.
//
// Target beats (from narration.marks.json):
//   2.00s  ask       — user starts typing
//   6.74s  search    — chips pulse, send, "Searching knowledge base…"
//  13.79s  grounded  — assistant begins streaming the answer
//  26.91s  code      — code block streams
//  32.33s  sources   — closing paragraph + sources expand
//  45.69s  next      — second prompt starts typing
//
// Total audio: ~53.9s. Stage duration in index.html should be 55s.

const BEATS = {
  ask:      2.00,
  search:   6.74,
  grounded: 13.79,
  code:     26.91,
  sources:  32.33,
  next:     45.69,
};

// Derived timings. Tweaking these controls the pacing of individual
// animations — e.g. how long the code block streams, how fast the user
// types, etc. Beat anchors stay fixed.
const TIMING = {
  fadeIn:         [0.0, 0.8],
  typePrompt:     [BEATS.ask, BEATS.search - 0.4],
  chipPulse:      [BEATS.search - 0.4, BEATS.search - 0.1],

  searchState:    [BEATS.search + 0.3, BEATS.grounded - 0.2],
  searchSweep:    [BEATS.search + 0.5, BEATS.search + 5.5],
  sourcesVisible:  BEATS.search + 2.0,
  toolCall:       [BEATS.search + 3.5, BEATS.grounded - 0.2],

  heading:        [BEATS.grounded, BEATS.grounded + 1.5],
  intro:          [BEATS.grounded + 1.5, BEATS.grounded + 5.0],
  bullets:        [BEATS.grounded + 5.0, BEATS.code - 0.3],
  codeStream:     [BEATS.code, BEATS.sources - 0.8],
  closing:        [BEATS.sources - 0.8, BEATS.sources + 1.5],

  sourcesExpand:  [BEATS.sources + 1.5, BEATS.sources + 3.0],
  copyAppears:     BEATS.sources + 1.5,
  copyTooltip:    [BEATS.sources + 6.0, BEATS.sources + 8.0],

  secondPrompt:   [BEATS.next, BEATS.next + 4.3],
  fade:           [53.0, 55.0],

  scroll:         [BEATS.grounded + 4.0, BEATS.sources + 3.0],
};

const SCRIPT = {
  userPrompt: "How do I write a Lambda handler that follows our ADR-001 error handling and Pydantic validation patterns?",
  answer: [
    { type: 'h3', text: 'Lambda handler following ADR-001 + Pydantic' },
    { type: 'p',  text: "Based on `ADR-001` (error handling) and `ADR-006` (Python patterns) in your knowledge base, here's the canonical shape we use across the `lambda/` tree:" },
    { type: 'ul', items: [
      "Validate input with a `Pydantic` model; surface field errors as 400s.",
      "Wrap business logic in `try/except` and emit a structured `audit` event.",
      "Return a typed `Response` — never `dict` — so the API gateway mapping is stable.",
    ]},
    { type: 'code', lang: 'python', text:
`from pydantic import BaseModel, ValidationError
from shared.audit import audit_event
from shared.responses import Response, ok, bad_request

class AskRequest(BaseModel):
    query: str
    top_k: int = 5

def lambda_handler(event, context) -> Response:
    try:
        req = AskRequest.model_validate(event["body"])
    except ValidationError as e:
        return bad_request(detail=e.errors())

    try:
        answer = knowledge_base.query(req.query, top_k=req.top_k)
        audit_event("ask_claude.ok", user=event["user"])
        return ok(answer)
    except Exception as exc:
        audit_event("ask_claude.error", error=str(exc))
        raise`
    },
    { type: 'p', text: "This matches the pattern used in `lambda/ask-claude/handler.py` and the new `query-kb` flow. The `audit_event` call is required by ADR-008 for license-compliance logging." },
  ],
  sources: [
    { repo: 'outcome-ops', path: 'docs/adr/ADR-001-create-adrs.md',            score: '0.94' },
    { repo: 'outcome-ops', path: 'docs/adr/ADR-006-python-dependency-management.md', score: '0.91' },
    { repo: 'outcome-ops', path: 'lambda/ask-claude/handler.py',                score: '0.88' },
    { repo: 'outcome-ops', path: 'lambda/query-kb/handler.py',                  score: '0.85' },
    { repo: 'outcome-ops', path: 'lambda/shared/audit.py',                      score: '0.81' },
    { repo: 'outcome-ops', path: 'docs/adr/ADR-008-license-compliance.md',      score: '0.79' },
  ],
  conversations: [
    { id: 'c1', title: 'Lambda handler following ADR-001' },
    { id: 'c2', title: 'Cohere reranker top_k tuning' },
    { id: 'c3', title: 'Migrating to S3 Vectors', badge: '2d' },
    { id: 'c4', title: 'process-pr-check coverage gaps', badge: '3d' },
    { id: 'c5', title: 'Confluence sync pagination bug', badge: '5d' },
    { id: 'c6', title: 'Terraform workflow for new lambda', badge: '1w' },
    { id: 'c7', title: 'Why do we rerank after vector search?', badge: '1w' },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;

function typewriter(full, start, end, t) {
  if (t < start) return '';
  if (t >= end) return full;
  const p = (t - start) / (end - start);
  const eased = 1 - Math.pow(1 - p, 1.6);
  const n = Math.floor(eased * full.length);
  return full.slice(0, n);
}

function progressiveAnswer(t, windows) {
  const out = [];
  for (const w of windows) {
    if (t < w.start) break;
    const local = clamp01((t - w.start) / Math.max(0.01, w.end - w.start));
    if (w.block.type === 'code') {
      const lines = w.block.text.split('\n');
      const shown = Math.ceil(lines.length * local);
      out.push({ ...w.block, text: lines.slice(0, shown).join('\n') });
    } else if (w.block.type === 'ul') {
      const shown = Math.ceil(w.block.items.length * local);
      if (shown === 0) continue;
      const lastIdx = shown - 1;
      const perItem = 1 / w.block.items.length;
      const lastItemP = clamp01((local - lastIdx * perItem) / perItem);
      const items = w.block.items.slice(0, shown - 1);
      const lastFull = w.block.items[lastIdx];
      const lastShown = lastFull.slice(0, Math.ceil(lastFull.length * lastItemP));
      items.push(lastShown);
      out.push({ ...w.block, items });
    } else if (w.block.type === 'h3' || w.block.type === 'p') {
      const shown = w.block.text.slice(0, Math.ceil(w.block.text.length * local));
      out.push({ ...w.block, text: shown });
    } else {
      out.push(w.block);
    }
  }
  return out;
}

// ── Audio sync ─────────────────────────────────────────────────────────────
// Hidden <audio> whose currentTime follows the Stage playhead. Stage is the
// clock; we only force-seek the audio on large drifts (scrub, loop wrap).
// Browsers block unmuted autoplay until the user interacts with the page —
// the user's first click on play or the scrubber counts as interaction and
// subsequent play() calls will succeed.
function AudioTrack({ src }) {
  const { time, playing } = useTimeline();
  const ref = React.useRef(null);

  React.useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (playing) a.play().catch(() => {});
    else a.pause();
  }, [playing]);

  React.useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (Math.abs(a.currentTime - time) > 0.25) {
      try { a.currentTime = time; } catch {}
    }
  }, [time]);

  return (
    <audio
      ref={ref}
      src={src}
      preload="auto"
      style={{ display: 'none' }}
    />
  );
}

// ── Main Scene ─────────────────────────────────────────────────────────────
function OutcomeOpsChatScene() {
  const t = useTime();

  const appOpacity = clamp01((t - TIMING.fadeIn[0]) / (TIMING.fadeIn[1] - TIMING.fadeIn[0]));

  const typedInput = typewriter(SCRIPT.userPrompt, TIMING.typePrompt[0], TIMING.typePrompt[1], t);
  const inputCaret =
    (t > TIMING.typePrompt[0] && t < BEATS.search) ||
    (Math.floor((t - TIMING.typePrompt[0]) * 2) % 2 === 0);

  const chipStart = TIMING.chipPulse[0];
  const chipEnd   = TIMING.chipPulse[1];
  const workspacesPulse = t >= chipStart && t <= chipEnd ? clamp01(1 - (t - chipStart) / (chipEnd - chipStart)) : 0;
  const mcpPulse        = t >= chipStart + 0.1 && t <= chipEnd + 0.1 ? clamp01(1 - (t - chipStart - 0.1) / (chipEnd - chipStart)) : 0;
  const mcpActive       = t >= BEATS.search - 0.2;

  const userBubbleVisible = t >= BEATS.search;
  const userBubbleAnim = clamp01((t - BEATS.search) / 0.3);

  const statusPhase =
    t < BEATS.search            ? 'idle' :
    t < TIMING.toolCall[0]      ? 'thinking' :
    t < BEATS.grounded          ? 'tool_use' :
    t < BEATS.sources + 2.0     ? 'typing' :
    'idle';
  const statusText =
    statusPhase === 'thinking' ? 'Searching knowledge base…' :
    statusPhase === 'tool_use' ? 'Calling knowledge_base.query…' :
    statusPhase === 'typing'   ? 'Generating response…' :
    'Enter to send   •   Shift+Enter for new line';

  const searchingVisible = t >= TIMING.searchState[0] && t < TIMING.searchState[1];
  const toolCallVisible  = t >= TIMING.toolCall[0] && t < TIMING.toolCall[1];

  const answerWindows = [
    { start: TIMING.heading[0],    end: TIMING.heading[1],    block: SCRIPT.answer[0] },
    { start: TIMING.intro[0],      end: TIMING.intro[1],      block: SCRIPT.answer[1] },
    { start: TIMING.bullets[0],    end: TIMING.bullets[1],    block: SCRIPT.answer[2] },
    { start: TIMING.codeStream[0], end: TIMING.codeStream[1], block: SCRIPT.answer[3] },
    { start: TIMING.closing[0],    end: TIMING.closing[1],    block: SCRIPT.answer[4] },
  ];
  const visibleAnswer = t >= BEATS.grounded ? progressiveAnswer(t, answerWindows) : [];
  const answerStreaming = t >= BEATS.grounded && t < TIMING.closing[1];

  const sourcesVisible = t >= TIMING.sourcesVisible;
  const sourcesExpanded = t >= TIMING.sourcesExpand[0];
  const sourcesExpandProgress = smooth(clamp01((t - TIMING.sourcesExpand[0]) / (TIMING.sourcesExpand[1] - TIMING.sourcesExpand[0])));

  const scrollShift =
    t < TIMING.scroll[0] ? 0 :
    t < TIMING.scroll[1] ? -interpolate(TIMING.scroll, [0, 180])(t) :
    -180;

  const secondPrompt = "Generate tests for that handler matching ADR-005…";
  const secondTyped = t >= TIMING.secondPrompt[0]
    ? typewriter(secondPrompt, TIMING.secondPrompt[0], TIMING.secondPrompt[1], t)
    : '';
  const secondCaret = t >= TIMING.secondPrompt[0] && t < TIMING.fade[0]
    && Math.floor((t - TIMING.secondPrompt[0]) * 2) % 2 === 0;

  const loopFade = t > TIMING.fade[0]
    ? clamp01(1 - (t - TIMING.fade[0]) / (TIMING.fade[1] - TIMING.fade[0]))
    : 1;

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex',
      background: T.bg,
      fontFamily: FONT.ui,
      opacity: appOpacity * loopFade,
      position: 'relative',
    }}>
      <GlobalStyles/>
      <Sidebar
        conversations={SCRIPT.conversations}
        activeId={t < 1.0 ? null : 'c1'}
        highlightNew={t < 1.0}
      />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        minWidth: 0, position: 'relative',
      }}>
        <HeaderBar
          title={t < BEATS.search ? 'New chat' : 'Lambda handler following ADR-001'}
          workspacesLabel="3 workspaces"
          mcpCount={mcpActive ? 2 : 0}
          mcpActive={mcpActive}
          promptLabel="Engineering"
          workspacesPulse={workspacesPulse}
          mcpPulse={mcpPulse}
        />

        <div style={{
          flex: 1, minHeight: 0,
          overflow: 'hidden',
          position: 'relative',
          background: T.bg,
        }}>
          {t >= TIMING.searchSweep[0] && t < TIMING.searchSweep[1] && (
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 0, height: 2, zIndex: 2,
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, height: 2,
                width: '30%',
                left: `${-30 + ((t - TIMING.searchSweep[0]) / (TIMING.searchSweep[1] - TIMING.searchSweep[0])) * 130}%`,
                background: `linear-gradient(90deg, transparent, ${T.indigo}, transparent)`,
                opacity: 0.9,
              }}/>
            </div>
          )}

          {t < BEATS.search && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              color: T.textMuted,
              opacity: clamp01(1 - (t - (BEATS.search - 2.0)) / 1.0),
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                border: `1px solid ${T.border}`, background: T.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Icons.Msg size={22} stroke={T.sky}/>
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, color: T.text, letterSpacing: '-0.005em' }}>
                Ask anything about your codebase
              </div>
              <div style={{ fontSize: 12.5, marginTop: 6, color: T.textMuted }}>
                ADRs, code patterns, lambda handlers, infrastructure — grounded in your knowledge base.
              </div>
            </div>
          )}

          <div style={{
            position: 'absolute', inset: 0,
            overflow: 'hidden',
          }}>
            <div style={{
              maxWidth: 900, margin: '0 auto',
              padding: '24px 32px 24px',
              display: 'flex', flexDirection: 'column', gap: 14,
              transform: `translateY(${scrollShift}px)`,
              transition: 'none',
            }}>
              {userBubbleVisible && (
                <UserBubble
                  text={SCRIPT.userPrompt}
                  opacity={userBubbleAnim}
                  ty={(1 - userBubbleAnim) * 10}
                />
              )}

              {(searchingVisible || toolCallVisible || visibleAnswer.length > 0) && (
                <AssistantBubble
                  content={visibleAnswer}
                  streaming={answerStreaming}
                  searchingLabel={searchingVisible ? 'Searching knowledge base — 6 repos, ~1,400 files indexed' : null}
                  toolCall={toolCallVisible ? 'knowledge_base.query' : null}
                />
              )}

              {t > TIMING.copyAppears && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  paddingLeft: 4,
                  fontSize: 11.5, color: T.textFaint,
                  opacity: clamp01((t - TIMING.copyAppears) / 0.5),
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', borderRadius: 5,
                    border: `1px solid ${T.border}`, background: T.surface,
                    cursor: 'pointer',
                  }}>
                    {t > TIMING.copyTooltip[0] && t < TIMING.copyTooltip[1] ? (
                      <><Icons.Check size={11} stroke={T.ok}/><span style={{ color: T.ok }}>Copied</span></>
                    ) : (
                      <><Icons.Copy size={11}/><span>Copy</span></>
                    )}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', borderRadius: 5,
                    border: `1px solid ${T.border}`, background: T.surface,
                  }}>
                    <Icons.Share size={11}/><span>Share</span>
                  </span>
                  <span style={{ marginLeft: 'auto', fontFamily: FONT.mono, color: T.textFaint }}>
                    {t > BEATS.sources - 1 && (
                      <span>2,148 in / 612 out · $0.0041</span>
                    )}
                  </span>
                </div>
              )}

              {t >= TIMING.secondPrompt[1] + 0.3 && (
                <UserBubble
                  text={secondPrompt}
                  opacity={clamp01((t - TIMING.secondPrompt[1] - 0.3) / 0.4)}
                />
              )}
            </div>
          </div>
        </div>

        {sourcesVisible && (
          <SourcesPanel
            sources={SCRIPT.sources}
            expanded={sourcesExpanded}
            heightProgress={sourcesExpandProgress}
          />
        )}

        <InputBar
          text={t < BEATS.search ? typedInput : (t >= TIMING.secondPrompt[0] ? secondTyped : '')}
          caretVisible={
            (t < BEATS.search && inputCaret) ||
            (t >= TIMING.secondPrompt[0] && t < TIMING.fade[0] && secondCaret)
          }
          topK={5}
          advanced={t > TIMING.typePrompt[0] + 2.2 && t < TIMING.secondPrompt[0]}
          status={statusPhase}
          statusText={statusText}
        />
      </div>
    </div>
  );
}

Object.assign(window, { OutcomeOpsChatScene, AudioTrack, SCRIPT, BEATS });
