// scene_ui.jsx
// Static UI primitives for the "OutcomeOps as a Kiro Power" walkthrough.
// Purely presentational — animation happens in scene.jsx via <Sprite>.
//
// Cast:
//   KiroIDE      — VS Code / Kiro-style editor shell (sidebar, tabs, status bar)
//   CodeEditor   — gutter + lines, each line carries a render state + cite badge
//   CitationCard — an OutcomeOps knowledge-base hit (ADR / ISO control)
//   McpSettings  — the .kiro/settings.json block that wires up the Power
//   SpecPrompt   — the natural-language spec the engineer types
//   TrustBoundary— laptop -> your-VPC diagram for the closing beat

// ── Design tokens ───────────────────────────────────────────────────────────
const oo = {
  bg:        '#0A1020',
  bg2:       '#0F172A',
  surface:   '#141C30',
  surface2:  '#1B2540',
  border:    '#273354',
  borderHi:  '#3A4A78',
  text:      '#E6EBF5',
  textDim:   '#8A96B4',
  textFaint: '#5A6686',
  accent:    '#5AA9FF',        // OutcomeOps electric blue
  accentDim: '#2B5FA8',
  accentBg:  'rgba(90,169,255,0.12)',
  success:   '#4ADE80',
  successBg: 'rgba(74,222,128,0.12)',
  warn:      '#FBBF24',
  danger:    '#F87171',
  dangerBg:  'rgba(248,113,113,0.12)',
  purple:    '#A78BFA',
  magenta:   '#F472B6',
  iso:       '#34D399',        // ISO controls — emerald
  isoBg:     'rgba(52,211,153,0.12)',
  kiro:      '#8B5CF6',        // Kiro brand — violet
  kiroBg:    'rgba(139,92,246,0.14)',
  aws:       '#FF9900',
  // editor chrome
  ide:       '#11151F',        // editor background
  ideBar:    '#0B0E16',        // activity / side bar
  ideTab:    '#161B28',
  ideLine:   '#1C2435',        // active line
  gutter:    '#3A4358',
  mono:      "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  sans:      "'Inter', system-ui, -apple-system, sans-serif",
};

// VS Code Dark+ -ish syntax palette
const code = {
  plain:   '#D4D4D4',
  kw:      '#C586C0',   // def, class, return, from, import
  type:    '#4EC9B0',   // Decimal, BaseModel, str
  fn:      '#DCDCAA',   // function names
  str:     '#CE9178',   // strings
  num:     '#B5CEA8',   // numbers
  comment: '#6A9955',   // comments
  prop:    '#9CDCFE',   // attributes / params
  punc:    '#808080',
};

// ── Low-level atoms ─────────────────────────────────────────────────────────

const Dot = ({ color = oo.accent, size = 8, pulse = false, style }) => (
  <span style={{
    display: 'inline-block',
    width: size, height: size, borderRadius: size / 2,
    background: color,
    boxShadow: pulse ? `0 0 0 4px ${color}33, 0 0 0 8px ${color}15` : `0 0 6px ${color}80`,
    ...style,
  }} />
);

const Chip = ({ label, color = oo.accent, bg, icon, size = 'md', style }) => {
  const h = size === 'sm' ? 22 : size === 'lg' ? 30 : 26;
  const fs = size === 'sm' ? 11 : size === 'lg' ? 13 : 12;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      height: h, padding: `0 ${h / 2.2}px`,
      background: bg || `${color}1f`,
      color, border: `1px solid ${color}40`,
      borderRadius: h / 2,
      fontFamily: oo.sans, fontWeight: 600, fontSize: fs,
      letterSpacing: '0.01em', whiteSpace: 'nowrap',
      ...style,
    }}>
      {icon}{label}
    </span>
  );
};

// ── Code editor ─────────────────────────────────────────────────────────────
// A line = { segs: [[text, colorKey], ...], state, cite, glow }
//   state: 'normal' | 'add' | 'del' | 'dim' | 'flag'
//   cite : { label, color } -> inline badge pinned to the right of the line
//   glow : 0..1 highlight intensity (for the moment a rule lands)

const CodeLine = ({ n, segs, state = 'normal', cite, glow = 0, fontSize = 17 }) => {
  const bg =
    state === 'add'  ? `rgba(52,211,153,${0.10 + glow * 0.18})` :
    state === 'del'  ? 'rgba(248,113,113,0.10)' :
    state === 'flag' ? 'rgba(248,113,113,0.10)' :
    glow > 0         ? `rgba(90,169,255,${glow * 0.16})` :
    'transparent';
  const marker =
    state === 'add' ? oo.success :
    state === 'del' ? oo.danger  :
    state === 'flag'? oo.danger  : 'transparent';
  const opacity = state === 'dim' ? 0.32 : 1;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      minHeight: fontSize * 1.55,
      background: bg,
      borderLeft: `2px solid ${marker}`,
      opacity,
      paddingRight: 10,
      transition: 'background 240ms ease',
    }}>
      <div style={{
        width: 42, flexShrink: 0, textAlign: 'right', paddingRight: 14,
        color: oo.gutter, fontFamily: oo.mono, fontSize: fontSize - 2,
        lineHeight: `${fontSize * 1.55}px`, userSelect: 'none',
      }}>{n}</div>
      <div style={{
        flex: 1, fontFamily: oo.mono, fontSize, lineHeight: `${fontSize * 1.55}px`,
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        {segs.map((s, i) => (
          <span key={i} style={{ color: code[s[1]] || code.plain }}>{s[0]}</span>
        ))}
        {state === 'flag' && (
          <span style={{
            marginLeft: 10, fontFamily: oo.sans, fontSize: fontSize - 5,
            color: oo.danger, fontWeight: 600, letterSpacing: '0.02em',
          }}>⚠ violates standard</span>
        )}
      </div>
      {cite && (
        <span style={{
          flexShrink: 0, alignSelf: 'center',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 22, padding: '0 9px', borderRadius: 11,
          background: `${cite.color}1f`, border: `1px solid ${cite.color}55`,
          color: cite.color, fontFamily: oo.mono, fontSize: fontSize - 6, fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          <Dot color={cite.color} size={6} />{cite.label}
        </span>
      )}
    </div>
  );
};

const CodeEditor = ({ lines, fontSize = 17, style }) => (
  <div style={{ padding: '10px 0', fontFamily: oo.mono, ...style }}>
    {lines.map((ln, i) => (
      <CodeLine key={i} n={i + 1} {...ln} fontSize={fontSize} />
    ))}
  </div>
);

// ── Kiro IDE shell ──────────────────────────────────────────────────────────
// Sidebar (file tree) + editor tabs + main pane (children) + status bar.
// `connected` flips the status-bar OutcomeOps indicator green.
// `rail` renders the right-hand context panel (the Power), if provided.

const SideIcon = ({ d, active }) => (
  <div style={{
    width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderLeft: `2px solid ${active ? oo.kiro : 'transparent'}`,
    color: active ? '#E6EBF5' : '#5A6686',
  }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  </div>
);

const KiroIDE = ({ activeFile = 'refund_handler.py', tab = 'refund_handler.py', connected = false, children, rail, dim = 0, height = 660 }) => {
  const files = [
    { name: 'lambda/', dir: true, depth: 0 },
    { name: 'refund_handler.py', depth: 1, active: activeFile === 'refund_handler.py' },
    { name: 'models.py', depth: 1 },
    { name: 'requirements.txt', depth: 1 },
    { name: '.kiro/', dir: true, depth: 0 },
    { name: 'settings.json', depth: 1, active: activeFile === 'settings.json' },
    { name: 'steering.md', depth: 1 },
  ];
  return (
    <div style={{
      width: rail ? 1480 : 1180, height,
      background: oo.ide,
      border: `1px solid ${oo.border}`,
      borderRadius: 12, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 30px 80px -30px rgba(0,0,0,0.85)',
      fontFamily: oo.sans, position: 'relative',
    }}>
      {/* Title bar */}
      <div style={{
        height: 38, flexShrink: 0, background: oo.ideBar,
        borderBottom: `1px solid ${oo.border}`,
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
        fontSize: 12, color: oo.textDim,
      }}>
        <div style={{ display: 'flex', gap: 7 }}>
          <Dot color="#FF5F57" size={11} /><Dot color="#FEBC2E" size={11} /><Dot color="#28C840" size={11} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', letterSpacing: '0.02em' }}>
          <span style={{ color: oo.kiro, fontWeight: 600 }}>Kiro</span>
          <span style={{ color: oo.textFaint }}> — ai-assist · refund-handler</span>
        </div>
        <div style={{ width: 54 }} />
      </div>

      {/* Body: activity bar | sidebar | editor | rail */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Activity bar */}
        <div style={{ width: 50, flexShrink: 0, background: oo.ideBar, borderRight: `1px solid ${oo.border}`, paddingTop: 6 }}>
          <SideIcon active d={<><path d="M3 6h18M3 12h18M3 18h18"/></>} />
          <SideIcon d={<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>} />
          <SideIcon d={<><path d="M6 3v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9c0 7-12 5-12 6"/></>} />
          <SideIcon d={<><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.6 5.7 21l2.3-7.2-6-4.4h7.6z"/></>} />
        </div>

        {/* File explorer */}
        <div style={{ width: 218, flexShrink: 0, background: oo.bg, borderRight: `1px solid ${oo.border}`, padding: '12px 0' }}>
          <div style={{ padding: '0 16px 10px', fontSize: 11, color: oo.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Explorer</div>
          {files.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: `5px 16px 5px ${16 + f.depth * 16}px`,
              fontSize: 13.5,
              color: f.active ? oo.text : f.dir ? oo.textDim : oo.textFaint,
              background: f.active ? oo.kiroBg : 'transparent',
              borderLeft: `2px solid ${f.active ? oo.kiro : 'transparent'}`,
              fontFamily: oo.mono,
            }}>
              <span style={{ color: f.dir ? oo.aws : f.active ? oo.kiro : oo.textFaint }}>{f.dir ? '▾' : '·'}</span>
              {f.name}
            </div>
          ))}
        </div>

        {/* Editor column */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: oo.ide }}>
          {/* Tabs */}
          <div style={{ height: 38, flexShrink: 0, display: 'flex', background: oo.ideBar, borderBottom: `1px solid ${oo.border}` }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 9, padding: '0 18px',
              background: oo.ide, borderRight: `1px solid ${oo.border}`,
              borderTop: `2px solid ${oo.kiro}`,
              fontSize: 13, color: oo.text, fontFamily: oo.mono,
            }}>
              <span style={{ color: tab.endsWith('.json') ? oo.warn : oo.accent }}>●</span>{tab}
            </div>
          </div>
          {/* Main editor area */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
            {children}
          </div>
        </div>

        {/* Right context rail (the Power) */}
        {rail && (
          <div style={{ width: 372, flexShrink: 0, background: oo.bg2, borderLeft: `1px solid ${oo.border}`, display: 'flex', flexDirection: 'column' }}>
            {rail}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{
        height: 30, flexShrink: 0, background: connected ? '#0E2233' : oo.ideBar,
        borderTop: `1px solid ${oo.border}`,
        display: 'flex', alignItems: 'center', gap: 18, padding: '0 14px',
        fontFamily: oo.mono, fontSize: 12, color: oo.textDim,
        transition: 'background 400ms ease',
      }}>
        <span style={{ color: oo.kiro }}>◇ Kiro</span>
        <span>Python 3.12</span>
        <div style={{ flex: 1 }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          color: connected ? oo.success : oo.textFaint, fontWeight: 600,
        }}>
          <Dot color={connected ? oo.success : oo.textFaint} size={7} pulse={connected} />
          OutcomeOps {connected ? 'Connected' : 'not configured'}
        </span>
      </div>

      {dim > 0 && (
        <div style={{ position: 'absolute', inset: 0, background: `rgba(5,8,18,${dim})`, pointerEvents: 'none' }} />
      )}
    </div>
  );
};

// ── The Power rail header + citation cards ──────────────────────────────────

const RailHeader = ({ querying = false, count = 0 }) => (
  <div style={{ padding: '16px 18px', borderBottom: `1px solid ${oo.border}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, overflow: 'hidden', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        boxShadow: `0 0 0 1px ${oo.accent}55`,
      }}>
        <img src="outcomeops_mark.png" alt="" style={{ width: '120%', height: '120%', objectFit: 'cover' }} />
      </div>
      <div>
        <div style={{ fontFamily: oo.sans, fontSize: 14, fontWeight: 700, color: oo.text }}>OutcomeOps</div>
        <div style={{ fontFamily: oo.mono, fontSize: 10.5, color: oo.accent, letterSpacing: '0.06em' }}>MCP POWER · ACTIVE</div>
      </div>
      <div style={{ flex: 1 }} />
      {querying ? (
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={pulseDot(0)} /><span style={pulseDot(0.2)} /><span style={pulseDot(0.4)} />
        </div>
      ) : count > 0 ? (
        <Chip label={`${count} cited`} color={oo.success} size="sm" />
      ) : null}
    </div>
    <div style={{ marginTop: 12, fontFamily: oo.mono, fontSize: 11.5, color: oo.textDim, lineHeight: 1.5 }}>
      <span style={{ color: oo.textFaint }}>›</span> query_knowledge_base(<br/>
      <span style={{ paddingLeft: 14, color: oo.str }}>"payment refund handler"</span>)
    </div>
  </div>
);

const pulseDot = (delay) => ({
  width: 6, height: 6, borderRadius: 3, background: oo.accent,
  animation: `ooBlink 0.9s ease-in-out ${delay}s infinite`,
});

const CitationCard = ({ badge, badgeColor, source, title, rule, score, appear = 1 }) => (
  <div style={{
    margin: '10px 14px 0',
    background: oo.surface,
    border: `1px solid ${badgeColor}40`,
    borderRadius: 10, padding: '11px 13px',
    opacity: appear,
    transform: `translateX(${(1 - appear) * 24}px)`,
    boxShadow: appear > 0.6 ? `0 0 0 1px ${badgeColor}22, 0 8px 22px -12px ${badgeColor}88` : 'none',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <span style={{
        fontFamily: oo.mono, fontSize: 11, fontWeight: 700, color: badgeColor,
        background: `${badgeColor}1f`, border: `1px solid ${badgeColor}55`,
        borderRadius: 5, padding: '2px 7px',
      }}>{badge}</span>
      <span style={{ fontFamily: oo.mono, fontSize: 10.5, color: oo.textFaint, letterSpacing: '0.04em' }}>{source}</span>
      {score != null && (
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: oo.mono, fontSize: 13, fontWeight: 600, color: oo.success, fontVariantNumeric: 'tabular-nums' }}>{score.toFixed(2)}</span>
          <span style={{ fontFamily: oo.mono, fontSize: 9, color: oo.textFaint, textTransform: 'uppercase', letterSpacing: '0.06em' }}>rerank</span>
        </span>
      )}
    </div>
    <div style={{ fontFamily: oo.sans, fontSize: 14, fontWeight: 600, color: oo.text, lineHeight: 1.25 }}>{title}</div>
    <div style={{ fontFamily: oo.sans, fontSize: 12, color: oo.textDim, lineHeight: 1.35, marginTop: 3 }}>{rule}</div>
  </div>
);

// ── .kiro/settings.json — wiring the Power ──────────────────────────────────

const McpSettings = ({ typed = 1, connected = false }) => {
  // typed: 0..1 progressive reveal of the mcpServers block
  const lines = [
    [['{', 'punc']],
    [['  ', 'plain'], ['"mcpServers"', 'prop'], [': {', 'punc']],
    [['    ', 'plain'], ['"outcomeops"', 'prop'], [': {', 'punc']],
    [['      ', 'plain'], ['"url"', 'prop'], [': ', 'punc'], ['"https://mcp.your-vpc.aws/sse"', 'str'], [',', 'punc']],
    [['      ', 'plain'], ['"headers"', 'prop'], [': {', 'punc']],
    [['        ', 'plain'], ['"Authorization"', 'prop'], [': ', 'punc'], ['"Bearer ${OUTCOMEOPS_TOKEN}"', 'str']],
    [['      ', 'plain'], ['}', 'punc']],
    [['    ', 'plain'], ['}', 'punc']],
    [['  ', 'plain'], ['}', 'punc']],
    [['}', 'punc']],
  ];
  const shown = Math.round(typed * lines.length);
  return (
    <div style={{ padding: '18px 0 0', position: 'relative', height: '100%' }}>
      <CodeEditor
        fontSize={18}
        lines={lines.map((segs, i) => ({
          segs,
          state: (i >= 1 && i <= 8) ? (i < shown ? 'add' : 'dim') : 'normal',
        }))}
      />
      {/* caret while "typing" */}
      {typed < 1 && (
        <div style={{
          position: 'absolute', left: 42 + 14, top: 18 + shown * 28,
          width: 9, height: 20, background: oo.accent, animation: 'ooCaret 1s step-end infinite',
        }} />
      )}
      {connected && (
        <div style={{
          position: 'absolute', right: 26, bottom: 22,
          display: 'inline-flex', alignItems: 'center', gap: 9,
          padding: '9px 16px', borderRadius: 99,
          background: oo.successBg, border: `1px solid ${oo.success}`,
          color: oo.success, fontFamily: oo.mono, fontSize: 14, fontWeight: 600,
        }}>
          <Dot color={oo.success} size={8} pulse />
          MCP server connected · 9 tools available
        </div>
      )}
    </div>
  );
};

// ── Spec prompt (the Kiro chat / spec input) ────────────────────────────────

const SpecPrompt = ({ typed = 1, generating = false }) => {
  const full = 'Build a Lambda handler that processes a payment refund.';
  const shown = full.slice(0, Math.round(typed * full.length));
  return (
    <div style={{ padding: '26px 30px', height: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ fontFamily: oo.mono, fontSize: 12, color: oo.kiro, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Kiro · Spec
      </div>
      <div style={{
        background: oo.surface, border: `1px solid ${oo.kiro}55`, borderRadius: 12,
        padding: '20px 22px', fontFamily: oo.sans, fontSize: 22, color: oo.text, lineHeight: 1.5,
        boxShadow: `0 0 0 1px ${oo.kiro}22`,
      }}>
        {shown}
        {typed < 1 && <span style={{ display: 'inline-block', width: 11, height: 22, marginLeft: 2, background: oo.kiro, verticalAlign: 'middle', animation: 'ooCaret 1s step-end infinite' }} />}
      </div>
      {generating && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: oo.mono, fontSize: 14, color: oo.textDim }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <span style={{ ...pulseDot(0), background: oo.kiro }} />
            <span style={{ ...pulseDot(0.2), background: oo.kiro }} />
            <span style={{ ...pulseDot(0.4), background: oo.kiro }} />
          </div>
          Generating implementation…
        </div>
      )}
    </div>
  );
};

// ── Trust boundary diagram (closing beat) ───────────────────────────────────

const TrustBoundary = ({ reveal = 1 }) => {
  const r2 = Math.min(1, Math.max(0, (reveal - 0.3) / 0.7));
  return (
    <div style={{ position: 'relative', width: 1180, height: 440 }}>
      {/* Laptop (Kiro) — left */}
      <div style={{ position: 'absolute', left: 20, top: 130, opacity: reveal, transform: `translateX(${(1 - reveal) * -20}px)` }}>
        <div style={{
          width: 240, height: 160, background: oo.surface, border: `2px solid ${oo.kiro}`,
          borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: `0 0 40px -8px ${oo.kiro}66`,
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={oo.kiro} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="13" rx="2"/><path d="M2 20h20"/>
          </svg>
          <div style={{ fontFamily: oo.sans, fontWeight: 700, fontSize: 17, color: oo.text }}>Kiro IDE</div>
          <div style={{ fontFamily: oo.mono, fontSize: 11, color: oo.textDim }}>on the laptop</div>
        </div>
      </div>

      {/* VPC boundary box — right */}
      <div style={{
        position: 'absolute', left: 470, top: 20, width: 690, height: 400,
        border: `2px dashed ${oo.aws}`, borderRadius: 18,
        background: 'rgba(255,153,0,0.04)',
        opacity: r2, transform: `scale(${0.97 + r2 * 0.03})`, transformOrigin: 'center',
      }}>
        <div style={{
          position: 'absolute', top: -13, left: 24, padding: '2px 12px',
          background: oo.bg, color: oo.aws, fontFamily: oo.mono, fontSize: 12, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Your AWS account · air-gapped VPC</div>

        {[
          { x: 40,  label: 'OutcomeOps MCP', sub: 'server in your VPC', icon: 'srv' },
          { x: 270, label: 'Knowledge base', sub: 'ADRs · ISO · code maps', icon: 'kb' },
          { x: 490, label: 'Inference', sub: 'Bedrock, in-account', icon: 'cpu' },
        ].map((n, i) => (
          <div key={i} style={{
            position: 'absolute', left: n.x, top: 150, width: 170, height: 150,
            background: oo.surface, border: `1px solid ${oo.border}`, borderRadius: 12,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            opacity: Math.min(1, Math.max(0, (reveal - 0.5 - i * 0.12) / 0.4)),
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={oo.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {n.icon === 'srv' && <><rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/></>}
              {n.icon === 'kb' && <><path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2z"/><path d="M9 3v18"/></>}
              {n.icon === 'cpu' && <><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></>}
            </svg>
            <div style={{ fontFamily: oo.sans, fontWeight: 600, fontSize: 15, color: oo.text, textAlign: 'center' }}>{n.label}</div>
            <div style={{ fontFamily: oo.mono, fontSize: 10.5, color: oo.textDim, textAlign: 'center' }}>{n.sub}</div>
          </div>
        ))}
      </div>

      {/* Connector laptop -> VPC (MCP over the boundary) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
        <defs>
          <marker id="tbArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={oo.accent} />
          </marker>
        </defs>
        {reveal > 0.4 && (
          <>
            <line x1="262" y1="210" x2="468" y2="210" stroke={oo.accent} strokeWidth="2.5" strokeDasharray="7 6" markerEnd="url(#tbArrow)" />
            <circle r="5" fill={oo.accent}>
              <animateMotion dur="1.6s" repeatCount="indefinite" path="M 262 210 L 460 210" />
            </circle>
          </>
        )}
      </svg>
      {reveal > 0.5 && (
        <div style={{
          position: 'absolute', left: 286, top: 168, fontFamily: oo.mono, fontSize: 11.5,
          color: oo.accent, opacity: Math.min(1, (reveal - 0.5) * 3),
        }}>MCP · bearer token</div>
      )}
    </div>
  );
};

// ── Shared chrome (reused from house style) ─────────────────────────────────

const SceneLabel = ({ number, title, subtitle, x = 60, y = 54, color = oo.accent }) => (
  <div style={{ position: 'absolute', left: x, top: y, fontFamily: oo.sans, color: oo.text, zIndex: 5 }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: oo.mono, fontSize: 11, color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
    }}>
      <span style={{ padding: '3px 8px', borderRadius: 4, background: `${color}1f`, border: `1px solid ${color}40` }}>{number}</span>
      {subtitle}
    </div>
    <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05, maxWidth: 900 }}>{title}</div>
  </div>
);

const Caption = ({ text, style }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center', pointerEvents: 'none', ...style }}>
    <div style={{
      padding: '10px 22px', background: 'rgba(10,16,32,0.88)', backdropFilter: 'blur(8px)',
      border: `1px solid ${oo.border}`, borderRadius: 8,
      fontFamily: oo.sans, fontSize: 18, fontWeight: 500, color: oo.text,
      maxWidth: 1040, textAlign: 'center', lineHeight: 1.4,
    }}>{text}</div>
  </div>
);

const StageBackdrop = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `linear-gradient(${oo.border}30 1px, transparent 1px), linear-gradient(90deg, ${oo.border}30 1px, transparent 1px)`,
      backgroundSize: '48px 48px',
      maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
      WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
    }} />
    <div style={{
      position: 'absolute', left: '50%', top: '50%', width: 1000, height: 1000,
      transform: 'translate(-50%, -50%)',
      background: 'radial-gradient(circle, rgba(90,169,255,0.07), transparent 70%)',
    }} />
  </div>
);

const BrandMark = ({ size = 48 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 0 1px ${oo.border}, 0 8px 24px -8px rgba(90,169,255,0.4)`, flexShrink: 0,
    }}>
      <img src="outcomeops_mark.png" alt="OutcomeOps" style={{ width: '120%', height: '120%', objectFit: 'cover', display: 'block' }} />
    </div>
    <div>
      <div style={{ fontFamily: oo.sans, fontSize: size * 0.45, fontWeight: 700, color: oo.text, letterSpacing: '-0.02em', lineHeight: 1 }}>OutcomeOps</div>
      <div style={{ fontFamily: oo.mono, fontSize: size * 0.22, color: oo.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>AI Assist</div>
    </div>
  </div>
);

// ── Export to window ──────────────────────────────────────────────────────
Object.assign(window, {
  oo, code,
  Dot, Chip,
  CodeLine, CodeEditor,
  KiroIDE, RailHeader, CitationCard, McpSettings, SpecPrompt, TrustBoundary,
  SceneLabel, Caption, StageBackdrop, BrandMark,
});
