// scene.jsx — OutcomeOps Chat: analytics Q + advanced-mode follow-up.
// Two-turn chat anchored to narration.mp3 beats. Observational narrator
// voice (see CLAUDE.md > Video narration style).
//
// The narration teaches TWO capabilities using analytics as the example:
//   Turn 1 → semantic search across the portfolio
//   Turn 2 → advanced mode: AI industry knowledge + application knowledge
//
// Beat marks (from narration.marks.json, ElevenLabs Drew, flat/newsreader tuning):
//   0.00s  ask
//   9.65s  query
//  17.15s  answers   → h3 heading starts streaming
//  25.26s  supports  → bullet list starts streaming
//  34.81s  architect → closing paragraph
//  44.34s  advanced
//  54.25s  reviewed
//  67.57s  exceeds   → Turn 2 heading + intro
//  76.58s  gaps      → late table rows
//  86.82s  ship      → final close
//
// Total audio: 95.0s. Stage duration = 97s.
//
// Voice: ElevenLabs Drew (q0IMILNRPxOgtBTS4taI), eleven_multilingual_v2
// Settings: stability=0.72, similarity_boost=0.75, style=0.0, speaker_boost=true, speed=1.0

const BEATS = {
  ask:        0.00,
  query:      9.65,
  answers:   17.15,
  supports:  25.26,
  architect: 34.81,
  advanced:  44.34,
  reviewed:  54.25,
  exceeds:   67.57,
  gaps:      76.58,
  ship:      86.82,
};

const TIMING = {
  fadeIn:          [0.0, 0.8],

  // Turn 1: type Q1 → chips → send → search → stream answer
  typePrompt1:     [BEATS.ask, BEATS.query - 0.3],
  chipPulse1:      [BEATS.query - 0.4, BEATS.query - 0.1],

  // Searching visible until the assistant starts streaming (at BEATS.answers).
  // Narrator does "queries" then a 5s silence then "answers" during this window.
  search1State:    [BEATS.query + 0.2, BEATS.answers - 0.2],
  sourcesVisible1:  BEATS.query + 2.5,
  toolCall1:       [BEATS.query + 5.0, BEATS.answers - 0.2],

  // Heading streams AS narrator says "the system answers that…"
  heading1:        [BEATS.answers,      BEATS.answers + 1.0],
  intro1:          [BEATS.answers + 1.0, BEATS.answers + 3.8],
  // Bullets begin AS narrator says "it already supports…"
  bullets1:        [BEATS.supports,      BEATS.architect - 1.8],
  closing1:        [BEATS.architect - 1.8, BEATS.architect + 1.0],
  copyRow1:         BEATS.architect + 1.5,

  // Transition: user activates Advanced between Turn 1 and Turn 2
  advancedClick:    BEATS.architect + 2.8,
  advancedPill:    [BEATS.architect + 2.8, BEATS.architect + 5.0],

  // Turn 2: type Q1a → send → advanced search → stream gap matrix
  typePrompt2:     [BEATS.architect + 5.5, BEATS.advanced + 0.5],
  chipPulse2:      [BEATS.advanced + 0.2, BEATS.advanced + 0.6],

  // Advanced search phase is longer — narrator lands two beats inside it
  // ("wants more depth" during typing, "reviews seven controls" mid-search).
  search2State:    [BEATS.advanced + 0.8, BEATS.exceeds - 0.2],
  sourcesExpand2:  [BEATS.reviewed - 3.0, BEATS.reviewed + 2.0],
  toolCall2:       [BEATS.reviewed + 2.0, BEATS.exceeds - 0.2],

  heading2:        [BEATS.exceeds,        BEATS.exceeds + 1.2],
  intro2:          [BEATS.exceeds + 1.2,  BEATS.exceeds + 3.8],
  table2:          [BEATS.exceeds + 3.8,  BEATS.gaps + 1.5],
  closing2:        [BEATS.gaps + 1.5,     BEATS.ship + 2.5],

  // Loop
  fade:            [94.0, 96.5],

  // Scrolling — push messages column up as content grows
  // Scroll tracks content-vs-visible as the sources panel grows and the
  // assistant bubble changes size. Two discrete jumps land on top of the
  // row-by-row ramp:
  //   · sources reach 10 rows   (56.25s) → visible -104px
  //   · tool-call bubble appears (56.25s) → content +36px → scroll -170
  // After the search phase, the search/tool-call rows disappear and the
  // Turn 2 answer streams in: scroll follows the growing content.
  // Waypoints at every content-changing moment so scroll tracks content
  // exactly instead of catching up. Plateaus at -565 after 82.7s per
  // preference — further closing text is acceptable to clip.
  scrollStops: {
    ts: [
      38,     // Q1 finished, still viewing
      44.94,  // Q2 sent (UserBubble 2 appears)
      45.5,   // search bubble also visible → overflow ~108
      51.25,  // stable while sources still at 6
      52.5,   // 7 sources (-26px visible)
      53.75,  // 8 sources
      55.0,   // 9 sources
      56.25,  // 10 sources (sources fully expanded)
      56.5,   // toolCall bubble appears (+36px in bubble)
      67.5,   // search/toolCall gone, heading streaming
      71.4,   // table first row lands (+80px jump for header+row)
      72.5,   // 2 rows
      74.0,   // 4 rows (halfway)
      76.0,   // 6 rows
      78.0,   // 7 rows (table done)
      82.7,   // closing paragraph ~40% done — plateau per user preference
      89.0,   // closing continues but scroll holds
    ],
    ys: [
      0,      // 38
      0,      // 44.94
      -110,   // 45.5
      -110,   // 51.25
      -140,   // 52.5
      -170,   // 53.75
      -200,   // 55
      -230,   // 56.25
      -270,   // 56.5
      -270,   // 67.5
      -340,   // 71.4
      -380,   // 72.5
      -440,   // 74
      -500,   // 76
      -550,   // 78
      -565,   // 82.7
      -565,   // 89 (plateau)
    ],
  },
};

const SCRIPT = {
  userPrompt:
    "We need to add web analytics tracking to our platform — page views, click-throughs, bounce rates. Search our codebase and infrastructure for any analytics we already have or if we need to build something new.",
  secondPrompt:
    "How does our existing analytics platform meet or exceed industry best practices, and what gaps if any should we address?",

  answer1: [
    { type: 'h3', text: 'You already have a production analytics platform' },
    { type: 'p',  text: "`analytics-service` is fully deployed. Dual pipeline: server-side CloudFront logs into DynamoDB (unblockable — ad blockers can't touch it) plus a client-side beacon for real-time events." },
    { type: 'ul', items: [
      "Page views, click-throughs, bounce rates — `GET /analytics/stats/{domain}`",
      "Funnel + cohort retention — `/analytics/funnel`, `/analytics/cohorts`",
      "Referrer + UTM campaign tracking — `/analytics/referrers`, `/analytics/campaigns`",
      "Organization ID from IP enrichment — `GET /analytics/orgs/{domain}`",
      "AI-traffic detection — `/analytics/hallucinations` catches referrals GA4 reports as `(direct)`",
    ]},
    { type: 'p',  text: "Don't build. Add the domain to `domain_list` in tfvars, run `make tf-apply ENV=prd`, drop the tracker on the page. Done." },
  ],

  answer2: [
    { type: 'h3', text: 'Industry comparison — 7 controls' },
    { type: 'p',  text: "Reviewed against GA4, Amplitude, Mixpanel, and reference CDP architectures. Depth 10 — every control traced to source." },
    { type: 'table',
      header: ['Control', 'Ours', 'Industry', 'Verdict'],
      rows: [
        ['Data accuracy',                 '100% capture',                 'GA4 loses 40–60% to blockers',  'EXCEEDS'],
        ['First-party tracking',          'per-domain `t.{domain}`',      'cross-origin common',            'EXCEEDS'],
        ['AI-traffic visibility',         '`hallucinations` endpoint',    'reported as (direct)',           'EXCEEDS'],
        ['Cost (10k events/day)',         '~$5/mo',                       '$500–2,000/mo',                  'EXCEEDS'],
        ['Auth, encryption, tenancy',     'SES magic link, partition keys, OAC', 'industry standard',      'MATCHES'],
        ['Real-time streaming',           'batched (S3 latency)',         'sub-second on Amplitude',        'GAP'],
        ['A/B testing + mobile SDK',      'not implemented',              'standard elsewhere',             'GAP'],
      ],
    },
    { type: 'p',  text: "Three gaps — real-time, A/B, mobile. They only matter if you're running experiments or shipping mobile. Otherwise: ship." },
  ],

  sources1: [
    { repo: 'analytics-service', path: 'README.md',                                                     score: '0.94' },
    { repo: 'analytics-service', path: 'terraform/modules/analytics-api/main.tf',                       score: '0.91' },
    { repo: 'analytics-service', path: 'lambda/log-parser/handler.py',                                  score: '0.89' },
    { repo: 'analytics-service', path: 'lambda/journey-tracker/handler.py',                             score: '0.87' },
    { repo: 'analytics-service', path: 'docs/architecture.md',                                          score: '0.84' },
    { repo: 'analytics-service', path: 'frontend/tracker/analytics-tracker.ts',                         score: '0.81' },
  ],
  sources2Extra: [
    { repo: 'analytics-service', path: 'docs/adr/ADR-003-analytics-architecture.md',                    score: '0.93' },
    { repo: 'analytics-service', path: 'docs/adr/ADR-005-tracking-privacy.md',                          score: '0.90' },
    { repo: 'analytics-service', path: 'docs/comparisons/analytics-platforms.md',                       score: '0.88' },
    { repo: 'analytics-service', path: 'docs/best-practices/iso-27001-analytics-controls.md',           score: '0.85' },
  ],

  conversations: [
    { id: 'c1', title: 'Web analytics gap analysis' },
    { id: 'c2', title: 'CDN caching strategy for API responses' },
    { id: 'c3', title: 'RDS Postgres upgrade path', badge: '2d' },
    { id: 'c4', title: 'Kafka consumer group rebalancing', badge: '4d' },
    { id: 'c5', title: 'Cross-region failover runbook', badge: '1w' },
    { id: 'c6', title: 'Service mesh adoption checklist', badge: '1w' },
    { id: 'c7', title: 'Why we moved off Kinesis', badge: '2w' },
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

// Piecewise-linear interpolation over multiple keypoints.
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

  // Typing (Turn 1)
  const typed1 = typewriter(SCRIPT.userPrompt, TIMING.typePrompt1[0], TIMING.typePrompt1[1], t);
  const caret1 = t > TIMING.typePrompt1[0] && t < BEATS.query && Math.floor((t - TIMING.typePrompt1[0]) * 2) % 2 === 0;

  // Typing (Turn 2)
  const typed2 = typewriter(SCRIPT.secondPrompt, TIMING.typePrompt2[0], TIMING.typePrompt2[1], t);
  const caret2 = t > TIMING.typePrompt2[0] && t < BEATS.reviewed && Math.floor((t - TIMING.typePrompt2[0]) * 2) % 2 === 0;

  // Chip pulses
  const pulse1 = (() => {
    const [a, b] = TIMING.chipPulse1;
    return t >= a && t <= b ? clamp01(1 - (t - a) / (b - a)) : 0;
  })();
  const pulse2 = (() => {
    const [a, b] = TIMING.chipPulse2;
    return t >= a && t <= b ? clamp01(1 - (t - a) / (b - a)) : 0;
  })();
  const mcpActive = t >= BEATS.query - 0.4;

  // Advanced mode: clicks on at TIMING.advancedClick, pill fades in
  const advanced = t >= TIMING.advancedClick;
  const advancedPillOpacity = clamp01((t - TIMING.advancedPill[0]) / (TIMING.advancedPill[1] - TIMING.advancedPill[0]));

  // User bubbles
  const user1Visible = t >= BEATS.query;
  const user1Anim = clamp01((t - BEATS.query) / 0.3);
  // User bubble for Q2 appears the moment Q2 is sent (right after chipPulse2),
  // not later at the narration beat. Otherwise the assistant's search label
  // streams with no user bubble above it.
  const user2Visible = t >= TIMING.chipPulse2[1];
  const user2Anim = clamp01((t - TIMING.chipPulse2[1]) / 0.3);

  // Status phase
  const statusPhase =
    // Turn 1 phases
    t < BEATS.query             ? 'idle' :
    t < TIMING.toolCall1[0]     ? 'thinking' :
    t < BEATS.answers              ? 'tool_use' :
    t < BEATS.architect + 1.0   ? 'typing' :
    // Between turns
    t < BEATS.advanced          ? 'idle' :
    // Turn 2 phases (user typing Q1a counts as idle for the send-button state)
    t < BEATS.reviewed          ? 'idle' :
    t < TIMING.toolCall2[0]     ? 'thinking' :
    t < BEATS.exceeds           ? 'tool_use' :
    t < BEATS.ship + 1.0        ? 'typing' :
    'idle';

  const statusText = (() => {
    if (statusPhase === 'thinking') {
      return t >= BEATS.reviewed
        ? 'Searching knowledge base — advanced, depth 10'
        : 'Searching knowledge base…';
    }
    if (statusPhase === 'tool_use') return 'Calling knowledge_base.query…';
    if (statusPhase === 'typing')   return 'Generating response…';
    return 'Enter to send   •   Shift+Enter for new line';
  })();

  // Assistant bubble states — Turn 1
  const searching1Visible = t >= TIMING.search1State[0] && t < TIMING.search1State[1];
  const toolCall1Visible  = t >= TIMING.toolCall1[0] && t < TIMING.toolCall1[1];
  const answer1Windows = [
    { start: TIMING.heading1[0],  end: TIMING.heading1[1],  block: SCRIPT.answer1[0] },
    { start: TIMING.intro1[0],    end: TIMING.intro1[1],    block: SCRIPT.answer1[1] },
    { start: TIMING.bullets1[0],  end: TIMING.bullets1[1],  block: SCRIPT.answer1[2] },
    { start: TIMING.closing1[0],  end: TIMING.closing1[1],  block: SCRIPT.answer1[3] },
  ];
  const visibleAnswer1 = t >= BEATS.answers ? progressiveAnswer(t, answer1Windows) : [];
  const answer1Streaming = t >= BEATS.answers && t < TIMING.closing1[1];

  // Assistant bubble states — Turn 2
  const searching2Visible = t >= TIMING.search2State[0] && t < TIMING.search2State[1];
  const toolCall2Visible  = t >= TIMING.toolCall2[0] && t < TIMING.toolCall2[1];
  const answer2Windows = [
    { start: TIMING.heading2[0], end: TIMING.heading2[1], block: SCRIPT.answer2[0] },
    { start: TIMING.intro2[0],   end: TIMING.intro2[1],   block: SCRIPT.answer2[1] },
    { start: TIMING.table2[0],   end: TIMING.table2[1],   block: SCRIPT.answer2[2] },
    { start: TIMING.closing2[0], end: TIMING.closing2[1], block: SCRIPT.answer2[3] },
  ];
  const visibleAnswer2 = t >= BEATS.exceeds ? progressiveAnswer(t, answer2Windows) : [];
  const answer2Streaming = t >= BEATS.exceeds && t < TIMING.closing2[1];

  // Sources panel — visible from Turn 1 search, grows with Turn 2
  const sourcesVisible = t >= TIMING.sourcesVisible1;
  const sourcesExpanded1 = t >= BEATS.answers;
  const sourcesExpandProgress1 = smooth(clamp01((t - BEATS.answers) / 1.2));
  // For Turn 2, gradually add sources2Extra after reviewed beat
  const extraCount = (() => {
    const [a, b] = TIMING.sourcesExpand2;
    if (t < a) return 0;
    if (t >= b) return SCRIPT.sources2Extra.length;
    return Math.floor(((t - a) / (b - a)) * SCRIPT.sources2Extra.length);
  })();
  const shownSources = [...SCRIPT.sources1, ...SCRIPT.sources2Extra.slice(0, extraCount)];
  const sourcesExpanded = sourcesExpanded1;
  const sourcesExpandProgress =
    t < BEATS.answers ? 0 :
    t < BEATS.answers + 1.2 ? sourcesExpandProgress1 :
    1;

  // Scroll shift — piecewise to accommodate two turns
  const scrollShift = piecewise(TIMING.scrollStops.ts, TIMING.scrollStops.ys, t);

  // Copy row / cost readout on Turn 1
  const copy1Opacity = clamp01((t - TIMING.copyRow1) / 0.5);

  // Final fade
  const loopFade = t > TIMING.fade[0]
    ? clamp01(1 - (t - TIMING.fade[0]) / (TIMING.fade[1] - TIMING.fade[0]))
    : 1;

  // Which prompt is in the input bar right now?
  const inputText =
    t < BEATS.query              ? typed1 :
    t >= TIMING.typePrompt2[0]   ? typed2 :
    '';
  const inputCaretVisible =
    (t < BEATS.query              && caret1) ||
    (t >= TIMING.typePrompt2[0] && t < BEATS.reviewed && caret2);

  // Header title reflects active conversation
  const headerTitle =
    t < BEATS.query ? 'New chat' :
    'Web analytics gap analysis';

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
          promptLabel="Architecture"
          workspacesPulse={Math.max(pulse1, pulse2)}
          mcpPulse={Math.max(pulse1, pulse2)}
        />

        <div style={{
          flex: 1, minHeight: 0,
          overflow: 'hidden',
          position: 'relative',
          background: T.bg,
        }}>
          {/* Empty state before first send */}
          {t < BEATS.query && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              color: T.textMuted,
              opacity: clamp01(1 - (t - (BEATS.query - 2.0)) / 1.0),
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

          {/* Conversation */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <div style={{
              maxWidth: 900, margin: '0 auto',
              padding: '24px 32px 24px',
              display: 'flex', flexDirection: 'column', gap: 14,
              transform: `translateY(${scrollShift}px)`,
              transition: 'none',
            }}>
              {user1Visible && (
                <UserBubble
                  text={SCRIPT.userPrompt}
                  opacity={user1Anim}
                  ty={(1 - user1Anim) * 10}
                />
              )}

              {(searching1Visible || toolCall1Visible || visibleAnswer1.length > 0) && (
                <AssistantBubble
                  content={visibleAnswer1}
                  streaming={answer1Streaming}
                  searchingLabel={searching1Visible ? 'Searching knowledge base — 6 repos, ~1,400 files indexed' : null}
                  toolCall={toolCall1Visible ? 'knowledge_base.query' : null}
                />
              )}

              {t > TIMING.copyRow1 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  paddingLeft: 4,
                  fontSize: 11.5, color: T.textFaint,
                  opacity: copy1Opacity,
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', borderRadius: 5,
                    border: `1px solid ${T.border}`, background: T.surface,
                  }}>
                    <Icons.Copy size={11}/><span>Copy</span>
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', borderRadius: 5,
                    border: `1px solid ${T.border}`, background: T.surface,
                  }}>
                    <Icons.Share size={11}/><span>Share</span>
                  </span>
                  <span style={{ marginLeft: 'auto', fontFamily: FONT.mono, color: T.textFaint }}>
                    1,740 in / 412 out · $0.0031
                  </span>
                </div>
              )}

              {user2Visible && (
                <UserBubble
                  text={SCRIPT.secondPrompt}
                  opacity={user2Anim}
                  ty={(1 - user2Anim) * 10}
                />
              )}

              {(searching2Visible || toolCall2Visible || visibleAnswer2.length > 0) && (
                <AssistantBubble
                  content={visibleAnswer2}
                  streaming={answer2Streaming}
                  searchingLabel={
                    searching2Visible
                      ? 'Searching knowledge base — advanced reasoning, depth 10 across repos and ADRs'
                      : null
                  }
                  toolCall={toolCall2Visible ? 'knowledge_base.query' : null}
                />
              )}
            </div>
          </div>
        </div>

        {sourcesVisible && (
          <SourcesPanel
            sources={shownSources}
            expanded={sourcesExpanded}
            heightProgress={sourcesExpandProgress}
          />
        )}

        <InputBar
          text={inputText}
          caretVisible={inputCaretVisible}
          topK={5}
          advanced={advanced}
          advancedDepth={10}
          advancedPillOpacity={advancedPillOpacity}
          status={statusPhase}
          statusText={statusText}
        />
      </div>
    </div>
  );
}

Object.assign(window, { OutcomeOpsChatScene, AudioTrack, SCRIPT, BEATS, TIMING });
