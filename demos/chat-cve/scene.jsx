// scene.jsx — OutcomeOps Chat: CVE-2026-21884 portfolio scan.
// Single-turn chat anchored to narration.mp3 beats. Observational narrator
// voice (see CLAUDE.md > Video narration style).
//
// The narration teaches ONE capability: high-depth RAG (topK = 30) for
// portfolio-wide coverage. Explicitly contrasts with chat-analytics'
// advanced mode — see the b9 "different questions want different tools"
// close.
//
// Beat marks (from narration.marks.json, ElevenLabs Drew):
//   0.00s  alert      — "A security engineer gets a CVE alert..."
//  10.45s  question   — "They need to know, right now..."
//  16.50s  depth      — "They bump the depth from 5 to 30..."
//                       → topK selector animates 5 → 30 here
//  26.77s  search     — "OutcomeOps runs a portfolio-wide retrieval..."
//  37.59s  found      — "Three applications have react-router installed"
//                       → heading + app table streams
//  43.59s  vuln       — "Two are on vulnerable releases..."
//  51.77s  priority   — "The response ranks them by impact..."
//                       → priority plan + P0/P1/P2 cards stream
//  65.06s  commands   — "Each priority comes with the exact upgrade command..."
//  71.44s  oi         — "Thirty matches across every repo. Three apps identified…"
//
// Total audio: 83.3s. Stage duration = 85s.
//
// Voice: ElevenLabs Drew (q0IMILNRPxOgtBTS4taI), eleven_multilingual_v2
// Settings: stability=0.72, similarity_boost=0.75, style=0.0, speaker_boost=true, speed=1.0

const BEATS = {
  alert:     0.00,
  question: 10.45,
  depth:    16.50,
  search:   26.77,
  found:    37.59,
  vuln:     43.59,
  priority: 51.77,
  commands: 65.06,
  oi:       71.44,
};

const TIMING = {
  fadeIn:         [0.0, 0.8],

  // Type the long CVE prompt through b1 + b2 narration
  typePrompt:     [2.0, BEATS.depth + 0.5],

  // Depth (topK) selector ticks 5 → 30 during b3
  depthChange:    [BEATS.depth + 0.3, BEATS.depth + 2.3],

  // Short pause after depth change, then send just before b4
  chipPulse:      [BEATS.search - 6.0, BEATS.search - 5.7],

  // Searching phase spans the end of b3 and all of b4
  searchState:    [BEATS.search - 5.7, BEATS.found - 0.3],
  sourcesVisible:  BEATS.search - 2.5,
  toolCall:       [BEATS.search + 5.5, BEATS.found - 0.3],

  // App-list answer streams during b5/b6
  heading:        [BEATS.found,        BEATS.found + 1.0],
  intro:          [BEATS.found + 1.0,  BEATS.found + 4.0],
  table:          [BEATS.found + 4.0,  BEATS.priority - 3.5],

  // Priority plan streams during b7 (53.21) → b8 (66.72) ≈ 13s for 7 blocks
  priorityHeading:[BEATS.priority,        BEATS.priority + 1.0],
  p0Text:         [BEATS.priority + 1.0,  BEATS.priority + 2.4],
  p0Code:         [BEATS.priority + 2.4,  BEATS.priority + 4.3],
  p1Text:         [BEATS.priority + 4.6,  BEATS.priority + 6.0],
  p1Code:         [BEATS.priority + 6.0,  BEATS.priority + 7.9],
  p2Text:         [BEATS.priority + 8.2,  BEATS.priority + 9.6],
  p2Code:         [BEATS.priority + 9.6,  BEATS.priority + 11.5],

  fade:           [82.0, 84.5],

  // Hold scroll at 0 until content actually overflows the messages area.
  // Everything through heading → intro → table → priority heading fits.
  // Scrolling begins only as the P0 code block starts pushing past the
  // sources-panel top, then ramps gently to keep the latest line visible.
  scrollStops: {
    ts: [BEATS.priority + 2, BEATS.priority + 5, BEATS.priority + 9, BEATS.priority + 12, BEATS.commands, BEATS.commands + 2],
    ys: [0,                   -60,                -170,               -290,                 -380,           -400],
  },
};

const SCRIPT = {
  userPrompt:
    "CVE-2026-21884 was just published — XSS in react-router's ScrollRestoration API affecting 7.0.0 through 7.11.0, patched in 7.12.0. Search our portfolio: which apps have react-router, which version each is running, whether Framework Mode SSR is enabled, and produce a prioritized remediation plan.",

  answer: [
    { type: 'h3', text: '3 applications with react-router installed' },
    { type: 'p',  text: "Dependency manifests across the portfolio. Two are on versions in the vulnerable range (`7.0.0` – `7.11.0`). The third needs manual version confirmation before patch." },
    { type: 'table',
      header: ['App', 'Version', 'Status'],
      rows: [
        ['`customer-portal`',    '7.11.0',  'VULNERABLE'],
        ['`analytics-service`',  '7.10.1',  'VULNERABLE'],
        ['`ai-assist-api`',      'unclear', 'VERIFY'],
      ],
    },
    { type: 'h3', text: 'Prioritized remediation plan' },

    { type: 'p',    text: "**P0 — `customer-portal`** · critical, user-facing auth and uploads. XSS here could compromise sessions and billing data." },
    { type: 'code', lang: 'bash', text: 'npm install react-router@7.12.0\nnpm run test' },

    { type: 'p',    text: "**P1 — `analytics-service`** · high, first-party session + journey data." },
    { type: 'code', lang: 'bash', text: 'npm install react-router@7.12.0' },

    { type: 'p',    text: "**P2 — `ai-assist-api`** · verify installed version before patching." },
    { type: 'code', lang: 'bash', text: 'npm list react-router   # check\nnpm install react-router@7.12.0' },
  ],

  // 10 portfolio sources — shows the 30-topK RAG actually cast wide across
  // the org's repositories. Apps above the vulnerable 7.x line AND apps on
  // older versions (not affected) all surface because the query matched
  // package.json semantically regardless of version.
  sources: [
    { repo: 'customer-portal',    path: 'package.json',        score: '0.95' },
    { repo: 'customer-portal',    path: 'package-lock.json',   score: '0.94' },
    { repo: 'analytics-service',  path: 'package.json',        score: '0.93' },
    { repo: 'analytics-service',  path: 'package-lock.json',   score: '0.92' },
    { repo: 'ai-assist-api',      path: 'package.json',        score: '0.88' },
    { repo: 'ai-assist-api',      path: 'package-lock.json',   score: '0.87' },
    { repo: 'docs-site',          path: 'package.json',        score: '0.81' },
    { repo: 'status-page',        path: 'package.json',        score: '0.79' },
    { repo: 'marketing-site',     path: 'package.json',        score: '0.76' },
    { repo: 'internal-tools',     path: 'package.json',        score: '0.73' },
  ],

  conversations: [
    { id: 'c1', title: 'CVE-2026-21884 react-router XSS' },
    { id: 'c2', title: 'Dependabot alerts triage' },
    { id: 'c3', title: 'Log4Shell postmortem review', badge: '3d' },
    { id: 'c4', title: 'Snyk false-positive exclusions', badge: '5d' },
    { id: 'c5', title: 'SBOM generation rollout', badge: '1w' },
    { id: 'c6', title: 'Audit log retention policy', badge: '2w' },
    { id: 'c7', title: 'Secrets scanning coverage gaps', badge: '2w' },
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

function piecewise(ts, ys, t) {
  if (t <= ts[0]) return ys[0];
  if (t >= ts[ts.length - 1]) return ys[ys.length - 1];
  for (let i = 0; i < ts.length - 1; i++) {
    if (t >= ts[i] && t <= ts[i + 1]) {
      const p = (t - ts[i]) / (ts[i + 1] - ts[i]);
      return ys[i] + (ys[i + 1] - ys[i]) * p;
    }
  }
  return ys[ys.length - 1];
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
    } else if (w.block.type === 'table') {
      const shown = Math.ceil(w.block.rows.length * local);
      if (shown === 0) continue;
      out.push({ ...w.block, rows: w.block.rows.slice(0, shown) });
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

  return <audio ref={ref} src={src} preload="auto" style={{ display: 'none' }} />;
}

// ── Main Scene ─────────────────────────────────────────────────────────────
function OutcomeOpsChatScene() {
  const t = useTime();

  const appOpacity = clamp01((t - TIMING.fadeIn[0]) / (TIMING.fadeIn[1] - TIMING.fadeIn[0]));

  // Typing the CVE query
  const typed = typewriter(SCRIPT.userPrompt, TIMING.typePrompt[0], TIMING.typePrompt[1], t);
  const caret = t > TIMING.typePrompt[0] && t < BEATS.search - 5.7
    && Math.floor((t - TIMING.typePrompt[0]) * 2) % 2 === 0;

  // topK ticks from 5 → 30 during b3_depth. This is the scene's key visual —
  // synced to the narrator saying "bump the depth from 5 to 30".
  const [dcStart, dcEnd] = TIMING.depthChange;
  const topK = (() => {
    if (t < dcStart) return 5;
    if (t >= dcEnd) return 30;
    const p = (t - dcStart) / (dcEnd - dcStart);
    return Math.round(5 + p * 25);
  })();
  // Subtle indigo highlight on the topK chip during + briefly after the change
  const topKHighlight = t >= dcStart && t < dcEnd + 1.5;

  // Chip pulses before send — workspace feel like chat-analytics
  const pulse = (() => {
    const [a, b] = TIMING.chipPulse;
    return t >= a && t <= b ? clamp01(1 - (t - a) / (b - a)) : 0;
  })();
  const mcpActive = t >= 1.0;  // workspaces + MCP attached from the start

  const userBubbleVisible = t >= TIMING.chipPulse[1];
  const userBubbleAnim = clamp01((t - TIMING.chipPulse[1]) / 0.3);

  // Status phases — single turn, simpler than chat-analytics
  const statusPhase =
    t < TIMING.chipPulse[1]    ? 'idle' :
    t < TIMING.toolCall[0]     ? 'thinking' :
    t < BEATS.found            ? 'tool_use' :
    t < BEATS.commands + 1.0   ? 'typing' :
    'idle';
  const statusText =
    statusPhase === 'thinking' ? 'Searching knowledge base — depth 30 across all repos' :
    statusPhase === 'tool_use' ? 'Calling knowledge_base.query…' :
    statusPhase === 'typing'   ? 'Generating response…' :
    'Enter to send   •   Shift+Enter for new line';

  // Assistant bubble states
  const searchingVisible = t >= TIMING.searchState[0] && t < TIMING.searchState[1];
  const toolCallVisible  = t >= TIMING.toolCall[0] && t < TIMING.toolCall[1];

  // Progressive answer — 10 block windows
  const answerWindows = [
    { start: TIMING.heading[0],         end: TIMING.heading[1],         block: SCRIPT.answer[0] },
    { start: TIMING.intro[0],           end: TIMING.intro[1],           block: SCRIPT.answer[1] },
    { start: TIMING.table[0],           end: TIMING.table[1],           block: SCRIPT.answer[2] },
    { start: TIMING.priorityHeading[0], end: TIMING.priorityHeading[1], block: SCRIPT.answer[3] },
    { start: TIMING.p0Text[0],          end: TIMING.p0Text[1],          block: SCRIPT.answer[4] },
    { start: TIMING.p0Code[0],          end: TIMING.p0Code[1],          block: SCRIPT.answer[5] },
    { start: TIMING.p1Text[0],          end: TIMING.p1Text[1],          block: SCRIPT.answer[6] },
    { start: TIMING.p1Code[0],          end: TIMING.p1Code[1],          block: SCRIPT.answer[7] },
    { start: TIMING.p2Text[0],          end: TIMING.p2Text[1],          block: SCRIPT.answer[8] },
    { start: TIMING.p2Code[0],          end: TIMING.p2Code[1],          block: SCRIPT.answer[9] },
  ];
  const visibleAnswer = t >= BEATS.found ? progressiveAnswer(t, answerWindows) : [];
  const answerStreaming = t >= BEATS.found && t < TIMING.p2Code[1];

  // Sources rail visible during search, expanded once answer begins
  const sourcesVisible = t >= TIMING.sourcesVisible;
  const sourcesExpanded = t >= BEATS.found;
  const sourcesExpandProgress = smooth(clamp01((t - BEATS.found) / 1.2));

  // Scroll
  const scrollShift = piecewise(TIMING.scrollStops.ts, TIMING.scrollStops.ys, t);

  // Final fade for loop
  const loopFade = t > TIMING.fade[0]
    ? clamp01(1 - (t - TIMING.fade[0]) / (TIMING.fade[1] - TIMING.fade[0]))
    : 1;

  const headerTitle = t < TIMING.chipPulse[1] ? 'New chat' : 'CVE-2026-21884 react-router XSS';

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
          title={headerTitle}
          workspacesLabel="3 workspaces"
          mcpCount={mcpActive ? 2 : 0}
          mcpActive={mcpActive}
          promptLabel="Security"
          workspacesPulse={pulse}
          mcpPulse={pulse}
        />

        <div style={{
          flex: 1, minHeight: 0,
          overflow: 'hidden',
          position: 'relative',
          background: T.bg,
        }}>
          {/* Empty state until send */}
          {t < TIMING.chipPulse[1] && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              color: T.textMuted,
              opacity: clamp01(1 - (t - (TIMING.chipPulse[1] - 2.0)) / 1.0),
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
                Dependencies, CVEs, infrastructure, code patterns — grounded in your knowledge base.
              </div>
            </div>
          )}

          {/* Conversation */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
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
                  searchingLabel={searchingVisible
                    ? 'Searching knowledge base — 10 repos, depth 30'
                    : null}
                  toolCall={toolCallVisible ? 'knowledge_base.query' : null}
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
          text={t < TIMING.chipPulse[1] ? typed : ''}
          caretVisible={t < TIMING.chipPulse[1] && caret}
          topK={topK}
          topKHighlight={topKHighlight}
          advanced={false}
          status={statusPhase}
          statusText={statusText}
        />
      </div>
    </div>
  );
}

Object.assign(window, { OutcomeOpsChatScene, AudioTrack, SCRIPT, BEATS, TIMING });
