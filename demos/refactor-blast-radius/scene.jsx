// scene.jsx — Refactor blast radius
//
// Standalone video. Same underlying code-graph capability behind chat-cve
// (the security framing), reframed for the senior-engineer / architect
// buyer: "what breaks if I refactor a shared function?" Opens with a
// "graph of unknowns" intro overlay so the viewer feels the engineer's
// pain BEFORE the product UI shows up. The chat then answers it: a ranked
// list of services that call the function, each with exact file:line
// call sites.
//
// Silent build. Beats are placeholder; narration is synthed later and
// windows will be refit against the audio.

// ── Beat windows fitted to narration.mp3 (Drew @ 1.1) ─────────────────────
// Four-beat arc + brand close. Demo is the short middle; value carries the rest.
//
//   Beat 1  The need        [0.00,  6.93]   intro graph
//   Beat 2  The blocker     [6.43, 18.02]   git blame fade-out
//   Beat 3  The answer      [17.52, 37.02]  chat demo
//   Beat 4  The outcome     [36.52, 47.86]  pillar slide
//   Beat 5  Brand / CTA     [47.36, 56.01]  brand close
//
// Speech starts (absolute): b1=0.40, b2=7.23, b3=18.22, b4=37.22, b5=47.86
const BEATS = {
  // Beat 1 — intro graph
  introIn:    0.3,
  introHold:  1.5,
  introOut:   6.0,

  // Beat 2 — git blame fade-out (window 6.43-18.02; speech 7.23-16.92)
  blameIn:    6.4,
  blameOut:  17.4,

  // Beat 3 — chat demo (window 17.52-41.72; speech 18.22-36.22)
  chatShow:  17.9,
  typeStart: 20.7,   // "they open the chat and type what they need"
  typeEnd:   24.5,
  send:      24.8,   // voice transitions to "the answer comes back"
  searchEnd: 26.4,
  heading:   26.6,   // heading appears right at end of search
  paragraph: 27.4,   // synced to voice "Twelve services. Forty-seven call sites."
  table:     29.0,   // rows start streaming
  tableEnd:  36.5,   // 12 rows over ~7.5s, ends just after voice
  chatHold:  37.0,   // settled hold trimmed; b4 takes over almost immediately

  // Beat 4 — outcome slide (window 36.52-47.86; speech 37.22-46.86)
  outcomeIn:  36.52,
  outcomeOut: 46.8,

  // Beat 5 — brand (window 47.36-56.01; speech 47.86-54.21)
  brandIn:   47.36,
  fadeOut:   54.0,
};

const TIMING = {
  fadeIn:        [0.0, 0.4],

  // Beat 1 — intro overlay covers the chat, then crossfades to Beat 2.
  introHeadline: [BEATS.introIn,         BEATS.introIn + 1.0],
  introGraph:    [BEATS.introHold - 0.2, BEATS.introOut - 0.4],
  introOut:      [BEATS.introOut,        BEATS.introOut + 0.7],

  // Beat 2 — blame fades in BEFORE intro starts fading, so it's already
  // fully covering the chat when intro begins crossfading out. Intro sits
  // on a higher z-index (see IntroOverlay zIndex=105) so it stays on top
  // until it fades, at which point blame underneath is revealed cleanly.
  // (Author depart timings still anchor to BEATS.blameIn, not TIMING.blameIn.)
  blameIn:       [5.5,                   5.9],
  blameCard:     [BEATS.blameIn + 0.4,   BEATS.blameIn + 1.4],
  blamePunch:    [BEATS.blameOut - 1.0,  BEATS.blameOut - 0.3],
  blameOut:      [BEATS.blameOut,        BEATS.blameOut + 0.6],

  // Beat 3 — chat demo internals, retimed against narration phrases.
  typePrompt:    [BEATS.typeStart,       BEATS.typeEnd],
  chipPulse:     [BEATS.send - 0.3,      BEATS.send],
  searchState:   [BEATS.send,            BEATS.searchEnd],
  sourcesVisible: BEATS.send + 0.6,
  toolCall:      [BEATS.send + 0.8,      BEATS.searchEnd - 0.1],
  heading:       [BEATS.heading,         BEATS.heading + 0.6],
  paragraph:     [BEATS.paragraph,       BEATS.paragraph + 1.4],
  table:         [BEATS.table,           BEATS.tableEnd],

  // Beat 4 — outcome overlay fades in, headline + pillars stagger.
  outcomeIn:     [BEATS.outcomeIn,       BEATS.outcomeIn + 0.6],
  outcomeOut:    [BEATS.outcomeOut,      BEATS.outcomeOut + 0.6],

  // Beat 5 — brand backdrop fades in BEFORE outcome starts fading, so it
  // masks the chat through the entire b4->b5 transition. Outcome sits on
  // higher z (z=125) so it fades out cleanly on top; brand content waits
  // until outcome is fully gone (see BrandOutro internals).
  brandIn:       [46.2,                  46.8],

  fade:          [BEATS.fadeOut,         BEATS.fadeOut + 2.0],

  // Scroll the messages area as the table grows. Tight pace for fast demo.
  scrollStops: {
    ts: [BEATS.table,  BEATS.table + 1.5, BEATS.table + 4, BEATS.table + 6, BEATS.tableEnd],
    ys: [0,            -30,               -110,            -200,            -260],
  },
};

const SCRIPT = {
  userPrompt: "Which services call check_permission?",

  answer: [
    { type: 'h3', text: 'Callers of `check_permission`' },
    { type: 'p',  text: "Across the codebase, `check_permission` is called by **12 Lambda services** at **47 direct call sites**. Two patterns repeat: a handler-level guard at function entry, and per-action checks before resource mutations. Refactoring the signature touches both." },
    { type: 'table',
      header: ['Service', 'Calls', 'Sites'],
      rows: [
        ['`lambda/billing`',         '2', '`handler.py:412, 1188`'],
        ['`lambda/payments`',        '2', '`handler.py:893, 1342`'],
        ['`lambda/notifications`',   '1', '`handler.py:201`'],
        ['`lambda/user-profile`',    '2', '`handler.py:614, 802`'],
        ['`lambda/admin-portal`',    '3', '`handler.py:155, 478, 1024`'],
        ['`lambda/file-upload`',     '1', '`handler.py:1109`'],
        ['`lambda/webhooks`',        '2', '`handler.py:344, 351`'],
        ['`lambda/audit-trail`',     '1', '`handler.py:721`'],
        ['`lambda/data-export`',     '2', '`handler.py:267, 519`'],
        ['`lambda/sso-callback`',    '2', '`handler.py:88, 142`'],
        ['`lambda/api-gateway`',     '3', '`handler.py:931, 1455, 1602`'],
        ['`lambda/rate-limiter`',    '1', '`handler.py:608`'],
      ],
    },
  ],

  // Symbol-graph sources — same retrieval shape as chat-cve's RAG sources,
  // but here every hit is a code-graph caller, not a doc.
  sources: [
    { repo: 'platform-api', path: 'lambda/admin-portal/handler.py',    score: '0.97' },
    { repo: 'platform-api', path: 'lambda/api-gateway/handler.py',     score: '0.96' },
    { repo: 'platform-api', path: 'lambda/payments/handler.py',        score: '0.95' },
    { repo: 'platform-api', path: 'lambda/billing/handler.py',         score: '0.95' },
    { repo: 'platform-api', path: 'lambda/sso-callback/handler.py',    score: '0.94' },
    { repo: 'platform-api', path: 'lambda/data-export/handler.py',     score: '0.92' },
    { repo: 'platform-api', path: 'lambda/webhooks/handler.py',        score: '0.91' },
    { repo: 'platform-api', path: 'lambda/user-profile/handler.py',    score: '0.90' },
    { repo: 'platform-api', path: 'lambda/file-upload/handler.py',     score: '0.88' },
    { repo: 'platform-api', path: 'lambda/audit-trail/handler.py',     score: '0.87' },
  ],

  conversations: [
    { id: 'c1', title: 'Which services call check_permission?' },
    { id: 'c2', title: 'Impact of renaming validate_token',  badge: '2d' },
    { id: 'c3', title: 'Callers for emit_event',             badge: '3d' },
    { id: 'c4', title: 'Who depends on calculate_tax?',      badge: '5d' },
    { id: 'c5', title: 'Safe to rename get_current_user?',   badge: '1w' },
    { id: 'c6', title: 'Consumers of audit_log',             badge: '1w' },
    { id: 'c7', title: 'Imports of legacy_helpers',          badge: '2w' },
  ],

  // Intro graph: tiles that resolve from "?" to a name. Eight is plenty
  // to communicate "many unknowns" without crowding the frame.
  introTiles: [
    'billing', 'payments', 'notifications', 'user-profile',
    'admin-portal', 'webhooks', 'audit-trail', 'api-gateway',
  ],
};

// ── Helpers (cloned from chat-cve) ────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;

function typewriter(full, start, end, t) {
  if (t <= start) return '';
  if (t >= end) return full;
  const p = (t - start) / (end - start);
  return full.slice(0, Math.ceil(full.length * p));
}

function piecewise(ts, ys, t) {
  if (t <= ts[0]) return ys[0];
  if (t >= ts[ts.length - 1]) return ys[ys.length - 1];
  for (let i = 0; i < ts.length - 1; i++) {
    if (t >= ts[i] && t <= ts[i + 1]) {
      const local = (t - ts[i]) / (ts[i + 1] - ts[i]);
      return lerp(ys[i], ys[i + 1], smooth(local));
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
      out.push({ ...w.block, items: w.block.items.slice(0, shown) });
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

// ── Audio sync (slaved to playhead; wired when narration.mp3 is synthed) ──
function AudioTrack({ src }) {
  const { time, playing } = useTimeline();
  const ref = React.useRef(null);
  React.useEffect(() => {
    const a = ref.current; if (!a) return;
    if (playing) a.play().catch(() => {}); else a.pause();
  }, [playing]);
  React.useEffect(() => {
    const a = ref.current; if (!a) return;
    if (Math.abs(a.currentTime - time) > 0.25) { try { a.currentTime = time; } catch {} }
  }, [time]);
  return <audio ref={ref} src={src} preload="auto" style={{ display: 'none' }} />;
}

// ── Intro overlay: graph of unknowns resolving to names ───────────────────
//
// Rendered on top of the chat from 0..~8s, then fades out to reveal it.
// Layout is computed inside a centered 1000x520 region so it works for both
// preview (1440) and export (1600) Stage widths.
function IntroOverlay({ t }) {
  const opOverlay = (() => {
    if (t < TIMING.fadeIn[0]) return 0;
    if (t < TIMING.fadeIn[1]) return clamp01((t - TIMING.fadeIn[0]) / (TIMING.fadeIn[1] - TIMING.fadeIn[0]));
    if (t < TIMING.introOut[0]) return 1;
    if (t < TIMING.introOut[1]) return 1 - clamp01((t - TIMING.introOut[0]) / (TIMING.introOut[1] - TIMING.introOut[0]));
    return 0;
  })();
  if (opOverlay <= 0) return null;

  const headlineOp = clamp01((t - TIMING.introHeadline[0]) / (TIMING.introHeadline[1] - TIMING.introHeadline[0]));
  const graphOp    = clamp01((t - TIMING.introGraph[0])    / 0.8);

  // 8 tiles around a circle. Each tile has its own "resolve" time.
  const tileNames = SCRIPT.introTiles;
  const N = tileNames.length;
  const startResolve = BEATS.introHold + 1.2;
  const resolveStep = 0.32;
  const resolveDur = 0.35;

  // Center point of the graph area (within the 1000x520 region).
  const cx = 500, cy = 280;
  const rx = 380, ry = 200; // ellipse radii for tile placement

  const tiles = tileNames.map((name, i) => {
    // Angle: start at top, go clockwise.
    const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;
    const resolveAt = startResolve + i * resolveStep;
    const p = clamp01((t - resolveAt) / resolveDur);
    return { name, x, y, a, p };
  });

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'oklch(0.16 0.02 260)',
      opacity: opOverlay,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONT.ui, color: '#eef1f6',
      // Above BlameOverlay (z=100) so intro sits on top during the b1->b2
      // crossfade. As intro fades, blame underneath is revealed cleanly
      // without exposing the chat behind.
      zIndex: 105,
      pointerEvents: 'none',
    }}>
      {/* Faint dot-grid wash */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 78%)',
      }} />

      {/* Headline */}
      <div style={{
        opacity: headlineOp, transform: `translateY(${(1 - headlineOp) * 12}px)`,
        textAlign: 'center', marginBottom: 24,
      }}>
        <div style={{ fontSize: 52, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
          Before you refactor
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 4 }}>
          a <span style={{ color: 'oklch(0.78 0.14 230)' }}>shared function.</span>
        </div>
      </div>

      {/* Graph region */}
      <div style={{ position: 'relative', width: 1000, height: 520, opacity: graphOp }}>
        {/* Connectors */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="oklch(0.78 0.14 230)" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="oklch(0.78 0.14 230)" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r="110" fill="url(#hubGlow)"/>
          {tiles.map((tile, i) => {
            // Edge from hub to tile.
            const len = Math.hypot(tile.x - cx, tile.y - cy);
            // Pull edges slightly inward so they meet the tile edge, not the centre.
            const tileR = 60;
            const ux = (tile.x - cx) / len, uy = (tile.y - cy) / len;
            const ex = tile.x - ux * tileR, ey = tile.y - uy * tileR;
            return (
              <line key={i}
                x1={cx} y1={cy} x2={ex} y2={ey}
                stroke="oklch(0.55 0.05 240)"
                strokeWidth="1.5" strokeDasharray="5 5"
                opacity="0.55"
              />
            );
          })}
        </svg>

        {/* Center node */}
        <div style={{
          position: 'absolute', left: cx, top: cy, transform: 'translate(-50%, -50%)',
          padding: '14px 22px',
          background: 'oklch(0.24 0.04 250)',
          border: '1.5px solid oklch(0.78 0.14 230)',
          borderRadius: 12,
          fontFamily: FONT.mono, fontSize: 22, fontWeight: 600, letterSpacing: '0.005em',
          color: 'oklch(0.92 0.06 230)',
          boxShadow: '0 0 30px oklch(0.78 0.14 230 / 0.35), 0 0 60px oklch(0.78 0.14 230 / 0.15)',
          whiteSpace: 'nowrap',
        }}>
          check_permission
        </div>

        {/* Tiles */}
        {tiles.map((tile, i) => (
          <div key={i} style={{
            position: 'absolute', left: tile.x, top: tile.y,
            transform: `translate(-50%, -50%) scale(${0.94 + tile.p * 0.06})`,
            minWidth: 96, height: 38,
            padding: '0 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: tile.p > 0.4 ? 'oklch(0.22 0.03 250)' : 'oklch(0.20 0.02 260)',
            border: `1px solid ${tile.p > 0.4 ? 'oklch(0.55 0.06 240)' : 'oklch(0.34 0.02 260)'}`,
            borderRadius: 8,
            fontFamily: FONT.mono, fontSize: 14.5, fontWeight: 500,
            color: tile.p > 0.4 ? 'oklch(0.92 0.02 240)' : 'oklch(0.58 0.04 260)',
            transition: 'background 200ms, border-color 200ms, color 200ms',
            whiteSpace: 'nowrap',
          }}>
            {tile.p < 0.5 ? '?' : tile.name}
          </div>
        ))}
      </div>

      {/* Subhead */}
      <div style={{
        opacity: clamp01((t - (TIMING.introGraph[1] - 0.5)) / 0.6),
        marginTop: 16,
        fontSize: 22, fontWeight: 400, color: 'oklch(0.72 0.02 240)',
        letterSpacing: '-0.01em',
      }}>
        Know what breaks. <span style={{ color: '#eef1f6', fontWeight: 600 }}>First.</span>
      </div>
    </div>
  );
}

// ── Beat 2: git blame fade-out (knowledge loss) ───────────────────────────
//
// Eight lines of git blame for check_permission. Four unique authors,
// staggered. Each author greys out + a "departed / moved teams / on PTO /
// promoted out" chip slides in. Then the punchline: "Who knows what
// depends on this function?" The institutional-knowledge pain in 10s.
function BlameOverlay({ t }) {
  const op = (() => {
    if (t < TIMING.blameIn[0]) return 0;
    if (t < TIMING.blameIn[1]) return clamp01((t - TIMING.blameIn[0]) / (TIMING.blameIn[1] - TIMING.blameIn[0]));
    if (t < TIMING.blameOut[0]) return 1;
    if (t < TIMING.blameOut[1]) return 1 - clamp01((t - TIMING.blameOut[0]) / (TIMING.blameOut[1] - TIMING.blameOut[0]));
    return 0;
  })();
  if (op <= 0) return null;

  // Backdrop fades in 5.5..5.9 (TIMING.blameIn) so the chat is masked while
  // the intro overlay (on top, z=105) is still 100% opaque. Content stays
  // hidden until intro is fully faded (~6.7) to avoid overlapping headlines.
  const headlineOp = clamp01((t - 6.7) / 0.4);
  const cardOp     = clamp01((t - TIMING.blameCard[0])      / (TIMING.blameCard[1] - TIMING.blameCard[0]));
  const punchOp    = clamp01((t - TIMING.blamePunch[0])     / (TIMING.blamePunch[1] - TIMING.blamePunch[0]));

  // Four authors, two consecutive lines each. Staggered "depart" times.
  const blame = [
    { sha: '3a4f12', author: 'Sarah Chen',   date: '2022-03-15', code: 'def check_permission(user, resource, action):' },
    { sha: '3a4f12', author: 'Sarah Chen',   date: '2022-03-15', code: '    if not user.is_active:' },
    { sha: '8c91e0', author: 'Tom Bryant',   date: '2022-08-04', code: '        raise UnauthorizedError(' },
    { sha: '8c91e0', author: 'Tom Bryant',   date: '2022-08-04', code: '            "Inactive user", code=403)' },
    { sha: 'b724ff', author: 'Priya Shah',   date: '2023-01-22', code: '    policy = load_policy(resource, action)' },
    { sha: 'b724ff', author: 'Priya Shah',   date: '2023-01-22', code: '    decision = policy.evaluate(user.role)' },
    { sha: '22e9ac', author: 'Marcus King',  date: '2023-09-10', code: '    audit_log.record(user, resource, decision)' },
    { sha: '22e9ac', author: 'Marcus King',  date: '2023-09-10', code: '    return decision.allowed' },
  ];
  // (firstLineIdx, status text, depart time)
  // Departures track the narration phrase boundaries:
  //   3.3  voice: "...senior engineer who wrote it is gone."
  //   6.2  voice: "...architect who reviewed it changed teams."
  //   8.3  voice: "...team lead is on leave."
  //  10.1  voice: "...went with them."
  const authors = [
    { name: 'Sarah Chen',  firstLine: 0, status: 'departed 2023',  tone: 'red',   depart: BEATS.blameIn + 3.3 },
    { name: 'Tom Bryant',  firstLine: 2, status: 'moved teams',    tone: 'amber', depart: BEATS.blameIn + 6.2 },
    { name: 'Priya Shah',  firstLine: 4, status: 'on PTO 6 wks',   tone: 'cyan',  depart: BEATS.blameIn + 8.3 },
    { name: 'Marcus King', firstLine: 6, status: 'promoted out',   tone: 'mauve', depart: BEATS.blameIn + 10.1 },
  ];
  const authorByName = Object.fromEntries(authors.map(a => [a.name, a]));
  const toneColor = (tone) => ({
    red:   'oklch(0.65 0.18 25)',
    amber: 'oklch(0.74 0.13 75)',
    cyan:  'oklch(0.72 0.12 230)',
    mauve: 'oklch(0.68 0.10 310)',
  }[tone]);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'oklch(0.16 0.02 260)',
      opacity: op,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONT.ui, color: '#eef1f6',
      zIndex: 100, pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        maskImage: 'radial-gradient(ellipse at center, black 18%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 18%, transparent 78%)',
      }}/>

      {/* Headline */}
      <div style={{
        opacity: headlineOp, transform: `translateY(${(1 - headlineOp) * 10}px)`,
        textAlign: 'center', marginBottom: 28,
      }}>
        <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
          The people who wrote this
        </div>
        <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 4 }}>
          <span style={{ color: 'oklch(0.78 0.14 25)' }}>aren't here anymore.</span>
        </div>
      </div>

      {/* Git blame card */}
      <div style={{
        opacity: cardOp,
        width: 1060,
        background: 'oklch(0.20 0.025 260)',
        border: '1px solid oklch(0.34 0.02 260)',
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: '0 30px 80px -28px rgba(0,0,0,0.7)',
        fontFamily: FONT.mono,
      }}>
        {/* Title bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 18px',
          background: 'oklch(0.16 0.02 260)',
          borderBottom: '1px solid oklch(0.30 0.02 260)',
          fontSize: 13, color: 'oklch(0.65 0.02 240)',
          letterSpacing: '0.04em',
        }}>
          <span style={{ color: 'oklch(0.78 0.14 230)' }}>$</span>
          git blame lambda/auth/check_permission.py
        </div>

        {/* Lines */}
        <div style={{ padding: '8px 0', fontSize: 13.5, lineHeight: 1.65 }}>
          {blame.map((line, i) => {
            const author = authorByName[line.author];
            const departed = t >= author.depart;
            const dim = departed ? 0.30 : 1.0;
            // Reveal chip only on the first line of each author group
            const isFirst = author.firstLine === i;
            const chipP = isFirst ? clamp01((t - author.depart) / 0.45) : 0;

            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '0 18px',
                color: 'oklch(0.85 0.02 240)',
                opacity: dim,
                transition: 'opacity 350ms ease',
                whiteSpace: 'pre',
              }}>
                <span style={{ color: 'oklch(0.58 0.06 280)', width: 60 }}>{line.sha}</span>
                <span style={{
                  width: 130, color: 'oklch(0.72 0.04 220)',
                  textDecorationLine: departed ? 'line-through' : 'none',
                  textDecorationColor: 'oklch(0.55 0.12 25)',
                }}>{line.author}</span>
                <span style={{ width: 100, color: 'oklch(0.55 0.02 240)' }}>{line.date}</span>
                <span style={{ flex: 1, color: 'oklch(0.92 0.02 230)' }}>{line.code}</span>
                {isFirst && chipP > 0 && (
                  <span style={{
                    opacity: chipP, transform: `translateX(${(1 - chipP) * 8}px)`,
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '2px 9px', borderRadius: 11,
                    fontSize: 11, fontFamily: FONT.ui, fontWeight: 600,
                    color: toneColor(author.tone),
                    background: 'oklch(0.16 0.02 260)',
                    border: `1px solid ${toneColor(author.tone)}`,
                    whiteSpace: 'nowrap',
                  }}>
                    <span style={{ fontSize: 9 }}>✕</span>{author.status}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Punchline */}
      <div style={{
        opacity: punchOp,
        transform: `translateY(${(1 - punchOp) * 8}px)`,
        marginTop: 24,
        fontSize: 24, fontWeight: 500, color: 'oklch(0.78 0.02 240)',
        letterSpacing: '-0.01em',
      }}>
        Who knows what <span style={{ color: '#eef1f6', fontWeight: 700 }}>depends on it</span>?
      </div>
    </div>
  );
}

// ── Beat 4: outcome slide (tribal -> queryable knowledge) ─────────────────
function OutcomeOverlay({ t }) {
  const op = (() => {
    if (t < TIMING.outcomeIn[0]) return 0;
    if (t < TIMING.outcomeIn[1]) return clamp01((t - TIMING.outcomeIn[0]) / (TIMING.outcomeIn[1] - TIMING.outcomeIn[0]));
    if (t < TIMING.outcomeOut[0]) return 1;
    if (t < TIMING.outcomeOut[1]) return 1 - clamp01((t - TIMING.outcomeOut[0]) / (TIMING.outcomeOut[1] - TIMING.outcomeOut[0]));
    return 0;
  })();
  if (op <= 0) return null;

  // Headline lands as voice begins ("What used to be tribal knowledge...").
  // Pillars track the narration: "Any engineer can ask" / "Every caller is
  // seen before the change" / "the work does not wait on whoever is on leave."
  const headlineOp = clamp01((t - (TIMING.outcomeIn[0] + 0.5)) / 0.7);
  const pillarOp = (i) => clamp01((t - (TIMING.outcomeIn[0] + 4.5 + i * 2.25)) / 0.55);

  const pillars = [
    { title: 'Any engineer asks',  sub: 'Senior or new hire. Same answer.',        color: 'oklch(0.78 0.14 230)' },
    { title: 'Risk reduced',       sub: 'Every caller seen, before the change.',   color: 'oklch(0.70 0.16 155)' },
    { title: "No “ask Steve”", sub: 'Knowledge isn’t gated on tenure or PTO.', color: 'oklch(0.78 0.14 75)' },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'oklch(0.16 0.02 260)',
      opacity: op,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONT.ui, color: '#eef1f6',
      zIndex: 125, pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 78%)',
      }}/>

      <div style={{
        opacity: headlineOp, transform: `translateY(${(1 - headlineOp) * 10}px)`,
        textAlign: 'center', marginBottom: 48, maxWidth: 1100,
      }}>
        <div style={{ fontSize: 52, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
          Tribal knowledge
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 6 }}>
          becomes <span style={{ color: 'oklch(0.78 0.14 230)' }}>queryable knowledge</span>.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 22 }}>
        {pillars.map((p, i) => {
          const pop = pillarOp(i);
          return (
            <div key={i} style={{
              width: 290, padding: '24px 26px',
              background: 'oklch(0.22 0.025 260)',
              border: `1px solid oklch(0.34 0.02 260)`,
              borderRadius: 12,
              boxShadow: pop > 0.5 ? `0 20px 60px -28px ${p.color}55` : 'none',
              opacity: pop, transform: `translateY(${(1 - pop) * 14}px)`,
            }}>
              <div style={{
                fontFamily: FONT.mono, fontSize: 11, color: p.color,
                letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
                marginBottom: 10,
              }}>0{i + 1}</div>
              <div style={{
                fontFamily: FONT.ui, fontSize: 22, fontWeight: 700, letterSpacing: '-0.018em',
                color: '#eef1f6', lineHeight: 1.15, marginBottom: 8,
              }}>{p.title}</div>
              <div style={{
                fontSize: 15, fontWeight: 400, color: 'oklch(0.72 0.02 240)',
                lineHeight: 1.45, letterSpacing: '-0.005em',
              }}>{p.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Beat 5: brand outro ───────────────────────────────────────────────────
function BrandOutro({ t }) {
  const op = (() => {
    if (t < TIMING.brandIn[0]) return 0;
    if (t < TIMING.brandIn[1]) return clamp01((t - TIMING.brandIn[0]) / (TIMING.brandIn[1] - TIMING.brandIn[0]));
    return 1;
  })();
  if (op <= 0) return null;

  // Backdrop fades in 46.2..46.8 (TIMING.brandIn) to mask the chat while
  // outcome (z=125) is still 100% opaque. Content stays hidden until
  // outcome is fully faded out (~47.4) so we never overlap two slides.
  const markOp    = clamp01((t - 47.4) / 0.6);
  const taglineOp = clamp01((t - 47.9) / 0.6);
  const ctaOp     = clamp01((t - 48.5) / 0.6);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'oklch(0.16 0.02 260)',
      opacity: op,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 30,
      fontFamily: FONT.ui, color: '#eef1f6',
      zIndex: 120, pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        maskImage: 'radial-gradient(ellipse at center, black 18%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 18%, transparent 78%)',
      }}/>

      <div style={{
        opacity: markOp, display: 'flex', alignItems: 'center', gap: 16,
        transform: `translateY(${(1 - markOp) * 10}px)`,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          overflow: 'hidden', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 0 1px oklch(0.34 0.02 260), 0 8px 24px -8px oklch(0.78 0.14 230 / 0.5)',
        }}>
          <img src="outcomeops_mark.png" alt="OutcomeOps"
               style={{ width: '120%', height: '120%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div>
          <div style={{ fontFamily: FONT.ui, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
            OutcomeOps
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 12, color: 'oklch(0.65 0.02 240)', letterSpacing: '0.1em', marginTop: 4, textTransform: 'uppercase' }}>
            AI Assist
          </div>
        </div>
      </div>

      <div style={{
        opacity: taglineOp, transform: `translateY(${(1 - taglineOp) * 10}px)`,
        textAlign: 'center', maxWidth: 1000,
      }}>
        <div style={{ fontSize: 42, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
          Your code,
        </div>
        <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: 4 }}>
          queryable by <span style={{
            background: 'linear-gradient(90deg, oklch(0.78 0.14 230), oklch(0.78 0.14 75))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>every engineer</span> who needs it.
        </div>
      </div>

      <div style={{
        opacity: ctaOp, transform: `translateY(${(1 - ctaOp) * 8}px)`,
        display: 'flex', alignItems: 'center', gap: 14,
        fontFamily: FONT.mono, fontSize: 14, letterSpacing: '0.04em', color: 'oklch(0.72 0.02 240)',
      }}>
        <span style={{ color: 'oklch(0.78 0.14 230)' }}>www.outcomeops.ai</span>
        <span style={{ color: 'oklch(0.34 0.02 260)' }}>·</span>
        <span>The codebase, queryable.</span>
      </div>
    </div>
  );
}

// ── Main Scene ────────────────────────────────────────────────────────────
function OutcomeOpsChatScene() {
  const t = useTime();
  const appOpacity = clamp01((t - TIMING.fadeIn[0]) / (TIMING.fadeIn[1] - TIMING.fadeIn[0]));

  // Type the prompt during the ask beat.
  const typed = typewriter(SCRIPT.userPrompt, TIMING.typePrompt[0], TIMING.typePrompt[1], t);
  const caret = t > TIMING.typePrompt[0] && t < BEATS.send
    && Math.floor((t - TIMING.typePrompt[0]) * 2) % 2 === 0;

  // Chip pulse just before send.
  const pulse = (() => {
    const [a, b] = TIMING.chipPulse;
    return t >= a && t <= b ? clamp01(1 - (t - a) / (b - a)) : 0;
  })();
  const mcpActive = t >= BEATS.chatShow + 0.2;

  const userBubbleVisible = t >= TIMING.chipPulse[1];
  const userBubbleAnim = clamp01((t - TIMING.chipPulse[1]) / 0.3);

  // Status text mirrors chat-cve but framed for code graph (not RAG).
  const statusPhase =
    t < TIMING.chipPulse[1]   ? 'idle' :
    t < TIMING.toolCall[0]    ? 'thinking' :
    t < BEATS.heading         ? 'tool_use' :
    t < BEATS.tableEnd        ? 'typing' :
    'idle';
  const statusText =
    statusPhase === 'thinking' ? 'Searching the code graph for callers of `check_permission`' :
    statusPhase === 'tool_use' ? 'Calling graph.callers...' :
    statusPhase === 'typing'   ? 'Generating response...' :
    'Enter to send   •   Shift+Enter for new line';

  const searchingVisible = t >= TIMING.searchState[0] && t < TIMING.searchState[1];
  const toolCallVisible  = t >= TIMING.toolCall[0] && t < TIMING.toolCall[1];

  // Three answer blocks: heading, intro paragraph, table.
  const answerWindows = [
    { start: TIMING.heading[0],   end: TIMING.heading[1],   block: SCRIPT.answer[0] },
    { start: TIMING.paragraph[0], end: TIMING.paragraph[1], block: SCRIPT.answer[1] },
    { start: TIMING.table[0],     end: TIMING.table[1],     block: SCRIPT.answer[2] },
  ];
  const visibleAnswer = t >= BEATS.heading ? progressiveAnswer(t, answerWindows) : [];
  const answerStreaming = t >= BEATS.heading && t < TIMING.table[1];

  const sourcesVisible = t >= TIMING.sourcesVisible;
  const sourcesExpanded = t >= BEATS.heading;
  const sourcesExpandProgress = smooth(clamp01((t - BEATS.heading) / 1.2));

  const scrollShift = piecewise(TIMING.scrollStops.ts, TIMING.scrollStops.ys, t);

  const loopFade = t > TIMING.fade[0]
    ? clamp01(1 - (t - TIMING.fade[0]) / (TIMING.fade[1] - TIMING.fade[0]))
    : 1;

  const headerTitle = t < TIMING.chipPulse[1]
    ? 'New chat'
    : 'Callers of check_permission';

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
        activeId={t < BEATS.chatShow ? null : 'c1'}
        highlightNew={t < BEATS.chatShow}
      />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        minWidth: 0, position: 'relative',
      }}>
        <HeaderBar
          title={headerTitle}
          workspacesLabel="All workspaces"
          mcpCount={mcpActive ? 2 : 0}
          mcpActive={mcpActive}
          promptLabel="Engineering"
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
                Symbol graph, dependencies, callers, impact — grounded in your real code.
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
                    ? 'Searching the code graph - callers of check_permission'
                    : null}
                  toolCall={toolCallVisible ? 'graph.callers' : null}
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
          topK={10}
          advanced={false}
          status={statusPhase}
          statusText={statusText}
        />
      </div>

      {/* Beat 1: graph of unknowns (engineer pain) */}
      <IntroOverlay t={t} />
      {/* Beat 2: git blame fade-out (the people who wrote it are gone) */}
      <BlameOverlay t={t} />
      {/* Beat 4: outcome slide (tribal -> queryable) */}
      <OutcomeOverlay t={t} />
      {/* Beat 5: brand close */}
      <BrandOutro t={t} />
    </div>
  );
}

Object.assign(window, { OutcomeOpsChatScene, AudioTrack, SCRIPT, BEATS, TIMING });
