// chat_ui.jsx -- OutcomeOps chat UI primitives for the GKG impact-analysis
// demo. Pure visual components; the scene file drives them via props + time.
// Modeled on demos/chat-analytics/chat_ui.jsx but focused on the primitives
// this demo needs (chat panel, user/assistant bubbles, tool chips, router
// pill, graph fanout SVG, ADR citation card).

const UI = {
  bg:        'oklch(0.985 0.003 240)',
  surface:   '#ffffff',
  surface2:  'oklch(0.975 0.004 240)',
  border:    'oklch(0.92 0.008 240)',
  borderStrong: 'oklch(0.88 0.01 240)',
  text:      'oklch(0.22 0.02 250)',
  textMuted: 'oklch(0.52 0.02 250)',
  textFaint: 'oklch(0.70 0.015 250)',
  sidebar:   'oklch(0.22 0.02 255)',
  sidebarBg: 'oklch(0.18 0.02 260)',
  sidebarText: 'oklch(0.88 0.01 240)',
  sidebarMuted: 'oklch(0.62 0.02 250)',
  sidebarActive: 'oklch(0.28 0.025 260)',
  indigo:    'oklch(0.55 0.17 265)',
  indigoSoft:'oklch(0.96 0.03 265)',
  sky:       'oklch(0.68 0.13 230)',
  skySoft:   'oklch(0.96 0.03 230)',
  skyBorder: 'oklch(0.86 0.08 230)',
  teal:      'oklch(0.68 0.10 200)',
  tealSoft:  'oklch(0.96 0.025 200)',
  ok:        'oklch(0.62 0.12 155)',
  okSoft:    'oklch(0.96 0.03 155)',
  amber:     'oklch(0.72 0.14 75)',
  amberSoft: 'oklch(0.96 0.04 75)',
  red:       'oklch(0.62 0.20 25)',
  redSoft:   'oklch(0.96 0.03 25)',
};

const F = {
  ui:   "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

// ── Icons (subset matching chat-analytics) ────────────────────────────────
const Ic = ({ d, size = 14, stroke = 'currentColor', fill = 'none', sw = 1.6, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
       style={{ display: 'block', flexShrink: 0 }}>
    {children || <path d={d}/>}
  </svg>
);

const Icons = {
  Msg:    (p) => <Ic {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Ic>,
  Folder: (p) => <Ic {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></Ic>,
  Server: (p) => <Ic {...p}><rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/></Ic>,
  Spark:  (p) => <Ic {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></Ic>,
  Chev:   (p) => <Ic {...p}><path d="M6 9l6 6 6-6"/></Ic>,
  Plus:   (p) => <Ic {...p}><path d="M12 5v14M5 12h14"/></Ic>,
};

// ── Brand wordmark ────────────────────────────────────────────────────────
function Wordmark({ color = UI.sidebarText, accent = UI.sky }) {
  return (
    <div style={{
      fontFamily: F.ui, fontWeight: 600, fontSize: 14,
      letterSpacing: '-0.01em', color,
      display: 'flex', alignItems: 'baseline', gap: 0,
    }}>
      <span>Outcome</span>
      <span style={{ color: accent }}>Ops</span>
      <span style={{
        marginLeft: 8, fontWeight: 400, fontSize: 12,
        color: UI.sidebarMuted, letterSpacing: '0.02em',
      }}>AI Assist</span>
    </div>
  );
}

// ── Header Chip (matches chat-analytics) ──────────────────────────────────
function HeaderChip({ icon, label, tone = 'neutral', active = false }) {
  const tones = {
    neutral: { bg: UI.surface2,  border: UI.border,    text: UI.text,                      iconColor: UI.textMuted },
    sky:     { bg: UI.skySoft,   border: UI.skyBorder, text: 'oklch(0.40 0.10 230)',       iconColor: UI.sky },
    indigo:  { bg: UI.indigoSoft, border: 'oklch(0.88 0.08 265)', text: 'oklch(0.40 0.12 265)', iconColor: UI.indigo },
    teal:    { bg: UI.tealSoft,  border: 'oklch(0.86 0.07 200)', text: 'oklch(0.40 0.08 200)', iconColor: UI.teal },
  };
  const s = tones[tone];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '6px 10px 6px 9px',
      background: s.bg,
      border: `1px solid ${active ? s.iconColor : s.border}`,
      borderRadius: 7,
      fontSize: 13, color: s.text,
      fontFamily: F.ui, fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ color: s.iconColor, display: 'flex' }}>{icon}</span>
      {label}
      <Icons.Chev size={12} stroke={s.iconColor}/>
    </div>
  );
}

// ── HeaderBar (matches chat-analytics with workspace/MCP/Voice dropdowns) ─
function HeaderBar({ title = 'Impact analysis: validateCardToken', workspacesLabel = 'payments-core', mcpCount = 2, mcpActive = true, promptLabel = 'Default' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 18px',
      borderBottom: `1px solid ${UI.border}`,
      background: UI.surface,
      height: 56, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{
          width: 30, height: 30, border: 'none', background: 'transparent',
          borderRadius: 6, color: UI.textMuted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icons.Msg size={16}/>
        </button>
        <h1 style={{
          margin: 0, fontFamily: F.ui, fontWeight: 600,
          fontSize: 15, color: UI.text, letterSpacing: '-0.005em',
        }}>{title}</h1>
        <span style={{
          fontFamily: F.mono, fontSize: 11, color: UI.textFaint,
          padding: '2px 7px', border: `1px solid ${UI.border}`, borderRadius: 4,
        }}>main</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <HeaderChip icon={<Icons.Folder size={14}/>} label={workspacesLabel} tone="sky"/>
        <HeaderChip icon={<Icons.Server size={14}/>} label={`${mcpCount} MCP server${mcpCount === 1 ? '' : 's'}`} tone={mcpActive ? 'indigo' : 'neutral'} active={mcpActive}/>
        <HeaderChip icon={<Icons.Spark size={14}/>} label={`Voice: ${promptLabel}`} tone="teal"/>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar() {
  const convos = [
    { title: 'Impact analysis: validateCardToken', active: true,  preview: 'What would break if...' },
    { title: 'PCI scope walkthrough',              active: false, preview: 'Where do we touch...' },
    { title: 'Refund flow refactor',               active: false, preview: 'Current path goes...' },
    { title: 'Aurora migration plan',              active: false, preview: 'Per ADR-014...' },
  ];
  return (
    <div style={{
      width: 280, flexShrink: 0,
      background: UI.sidebarBg,
      color: UI.sidebarText,
      display: 'flex', flexDirection: 'column',
      fontFamily: F.ui,
      borderRight: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Brand strip */}
      <div style={{
        padding: '20px 16px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Wordmark/>
      </div>

      {/* New chat button */}
      <div style={{ padding: 12 }}>
        <div style={{
          width: '100%', boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '10px 12px',
          background: 'oklch(0.26 0.025 260)',
          color: UI.sidebarText,
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          fontSize: 14, fontWeight: 500,
        }}>
          + New chat
          <span style={{ marginLeft: 'auto', fontSize: 11, color: UI.sidebarMuted, fontFamily: F.mono }}>⌘K</span>
        </div>
      </div>

      {/* Section label */}
      <div style={{
        padding: '8px 16px 6px',
        fontSize: 11, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: UI.sidebarMuted, fontWeight: 500,
      }}>
        Recent
      </div>

      {/* Conversation list */}
      <div style={{ padding: '0 8px', flex: 1, overflow: 'hidden' }}>
        {convos.map((c, i) => (
          <div key={i} style={{
            padding: '10px 12px',
            borderRadius: 8,
            background: c.active ? UI.sidebarActive : 'transparent',
            marginBottom: 2,
          }}>
            <div style={{
              fontFamily: F.ui, fontSize: 14, color: UI.sidebarText, fontWeight: 500,
              letterSpacing: '-0.005em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {c.title}
            </div>
            <div style={{
              fontFamily: F.ui, fontSize: 12, color: UI.sidebarMuted, marginTop: 2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {c.preview}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontFamily: F.mono, fontSize: 11,
        color: UI.sidebarMuted, letterSpacing: '0.16em',
        textTransform: 'uppercase',
      }}>
        <span style={{ color: 'oklch(0.65 0.15 155)' }}>●</span> Workspace · payments-core
      </div>
    </div>
  );
}

// ── Main chat area ────────────────────────────────────────────────────────
function ChatMain({ children }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: UI.bg, overflow: 'hidden',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '16px 32px',
        borderBottom: `1px solid ${UI.border}`,
        background: UI.surface,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: F.ui, fontSize: 16, fontWeight: 600,
          color: UI.text, letterSpacing: '-0.01em',
        }}>
          Impact analysis: validateCardToken
        </div>
        <div style={{
          fontFamily: F.mono, fontSize: 11, letterSpacing: '0.18em',
          color: UI.textMuted, textTransform: 'uppercase',
        }}>
          PAYMENTS-CORE · MAIN
        </div>
      </div>

      {/* Conversation body */}
      <div style={{
        flex: 1, overflow: 'hidden',
        padding: '32px 48px 24px',
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        {children}
      </div>
    </div>
  );
}

// ── User message bubble (matches chat-analytics: dark bg, white text) ────
function UserBubble({ text, typedChars = null }) {
  const shown = typedChars !== null ? text.slice(0, typedChars) : text;
  const showCaret = typedChars !== null && typedChars < text.length;
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-end',
    }}>
      <div style={{
        maxWidth: '75%',
        padding: '12px 18px',
        background: UI.text,
        color: '#ffffff',
        borderRadius: 14,
        borderTopRightRadius: 4,
        fontSize: 18, lineHeight: 1.45,
        fontFamily: F.ui, fontWeight: 450,
        letterSpacing: '-0.005em',
        whiteSpace: 'pre-wrap',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
      }}>
        {shown}
        {showCaret && <span className="cursor" style={{
          display: 'inline-block', width: 2, height: 20,
          background: '#ffffff', marginLeft: 2,
          verticalAlign: 'middle',
        }}/>}
      </div>
    </div>
  );
}

// ── Router decision pill (the unique insight) ─────────────────────────────
function RouterPill({ label = 'WIRING + CONTEXT', target = 'RAG + Graph' }) {
  return (
    <div style={{ alignSelf: 'flex-start' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 14,
        padding: '10px 18px',
        background: UI.surface,
        border: `1px solid ${UI.border}`,
        borderRadius: 999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <span style={{
          fontFamily: F.mono, fontSize: 11, letterSpacing: '0.22em',
          color: UI.textMuted, textTransform: 'uppercase', fontWeight: 600,
        }}>
          ROUTER
        </span>
        <span style={{
          fontFamily: F.mono, fontSize: 13, letterSpacing: '0.06em',
          color: UI.text, fontWeight: 500,
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: F.mono, fontSize: 13, color: UI.textFaint,
        }}>→</span>
        <span style={{
          fontFamily: F.mono, fontSize: 13, color: UI.indigo,
          fontWeight: 700, letterSpacing: '0.04em',
        }}>
          {target}
        </span>
      </div>
    </div>
  );
}

// ── Tool call chip ────────────────────────────────────────────────────────
function ToolChip({ call, status = 'running' }) {
  const isDone = status === 'done';
  const color = isDone ? UI.ok : UI.indigo;
  const bg    = isDone ? UI.okSoft : UI.indigoSoft;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '8px 14px',
      background: bg,
      border: `1px solid ${color}55`,
      borderRadius: 999,
      fontFamily: F.mono, fontSize: 13,
      color: color, fontWeight: 500,
      transition: 'all 300ms',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: 4,
        background: color,
        boxShadow: `0 0 8px ${color}`,
      }}/>
      {call}
      {isDone && <span style={{ marginLeft: 4 }}>✓</span>}
    </div>
  );
}

// ── Assistant intro text ──────────────────────────────────────────────────
function AssistantIntro({ children }) {
  return (
    <div style={{
      alignSelf: 'flex-start', maxWidth: '85%',
      padding: '4px 0',
      fontFamily: F.ui, fontSize: 22, color: UI.text,
      lineHeight: 1.45, letterSpacing: '-0.005em',
      fontWeight: 500,
    }}>
      {children}
    </div>
  );
}

// ── ADR citation card (the RAG context layer) ─────────────────────────────
function AdrCard({ id, title, body, opacity = 1 }) {
  return (
    <div style={{
      alignSelf: 'flex-start',
      maxWidth: '90%',
      padding: '18px 22px',
      background: UI.amberSoft,
      border: `1px solid oklch(0.86 0.08 75)`,
      borderRadius: 10,
      boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
      opacity,
      transition: 'opacity 400ms, transform 400ms',
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 12,
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: F.mono, fontSize: 12,
          color: UI.amber, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}>
          RAG CONTEXT
        </span>
        <span style={{
          fontFamily: F.mono, fontSize: 13, color: UI.text, fontWeight: 600,
        }}>
          {id}
        </span>
      </div>
      <div style={{
        fontFamily: F.ui, fontSize: 18, color: UI.text, fontWeight: 600,
        letterSpacing: '-0.01em', marginBottom: 6,
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: F.ui, fontSize: 16, color: UI.textMuted,
        lineHeight: 1.5, letterSpacing: '-0.003em',
      }}>
        {body}
      </div>
    </div>
  );
}

// ── Graph fanout visualization (the visual climax) ────────────────────────
// Layout: center hub (validateCardToken) with 3 clusters of direct + transitive
// callers arranged at roughly 120° around it.
//
// Each node is rendered as a labeled "card" with file path + line ref.
// Edges are dashed SVG lines with optional labels.
function GraphFanout({ phase = 'idle' /* idle | hub | direct | transitive | done */ }) {
  // Coordinates in the fixed 1920x1080 stage. Graph occupies the main chat
  // body region: roughly x=320..1900, y=160..950 (since the sidebar eats 280px).
  // Hub positioned at cx=850 (moderate-left of center) with reduced radii
  // so D3 cluster on the left clears the ADR card AND D1/D2 transitives on
  // the right clear the decision text overlay.
  const cx = 850;   // graph center x
  const cy = 540;   // graph center y

  const hub = { id: 'C', label: 'validateCardToken', sub: 'lib/pci/scope.go', x: cx, y: cy };

  // Three direct callers around the hub (smaller radius so the whole graph
  // is more compact)
  const direct = [
    { id: 'D1', label: 'payments/checkout.go', sub: ':142',                  angle: -45,  radius: 260 },
    { id: 'D2', label: 'refunds/processor.go', sub: ':88',                   angle:  45,  radius: 260 },
    { id: 'D3', label: 'admin/lookup.go',      sub: ':34',                   angle: 180,  radius: 260 },
  ];

  // Transitive callers — compact offsets so each cluster doesn't bleed into
  // the bottom-right (decision text) or bottom-left (ADR card) regions.
  const transitive = [
    // D1 cluster (extends up-right of hub)
    { id: 'T1', parent: 'D1', label: 'api/handlers/charge.go',    sub: ':56',  offsetAngle: -25, offsetRadius: 180 },
    { id: 'T2', parent: 'D1', label: 'api/handlers/refund.go',    sub: ':22',  offsetAngle:  -5, offsetRadius: 200 },
    { id: 'T3', parent: 'D1', label: 'workers/batch_payments.go', sub: ':91',  offsetAngle:  15, offsetRadius: 180 },
    // D2 cluster (extends down-right of hub)
    { id: 'T4', parent: 'D2', label: 'workers/refund_retry.go',   sub: ':74',  offsetAngle:  35, offsetRadius: 180 },
    { id: 'T5', parent: 'D2', label: 'api/handlers/dispute.go',   sub: ':40',  offsetAngle:  55, offsetRadius: 200 },
    { id: 'T6', parent: 'D2', label: 'workers/chargeback.go',     sub: ':18',  offsetAngle:  75, offsetRadius: 180 },
    // D3 cluster (extends left of hub)
    { id: 'T7', parent: 'D3', label: 'admin/audit_export.go',     sub: ':62',  offsetAngle: 165, offsetRadius: 180 },
    { id: 'T8', parent: 'D3', label: 'admin/csv_dump.go',         sub: ':29',  offsetAngle: 195, offsetRadius: 180 },
  ];

  // Compute positions
  const directPos = direct.map(d => ({
    ...d,
    x: cx + Math.cos(d.angle * Math.PI / 180) * d.radius,
    y: cy + Math.sin(d.angle * Math.PI / 180) * d.radius,
  }));

  const transitivePos = transitive.map(t => {
    const parent = directPos.find(d => d.id === t.parent);
    const x = parent.x + Math.cos(t.offsetAngle * Math.PI / 180) * t.offsetRadius * 0.6;
    const y = parent.y + Math.sin(t.offsetAngle * Math.PI / 180) * t.offsetRadius * 0.6;
    return { ...t, x, y, parentNode: parent };
  });

  const showHub        = phase !== 'idle';
  const showDirect     = phase === 'direct' || phase === 'transitive' || phase === 'done';
  const showTransitive = phase === 'transitive' || phase === 'done';

  return (
    <div style={{
      position: 'absolute',
      left: 320, right: 0, top: 100, bottom: 80,
      pointerEvents: 'none',
    }}>
      {/* SVG layer for edges */}
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        {/* Edges from direct to hub */}
        {showDirect && directPos.map((d, i) => (
          <line
            key={d.id}
            x1={d.x - 320} y1={d.y - 100} x2={hub.x - 320} y2={hub.y - 100}
            stroke="oklch(0.55 0.17 265)" strokeWidth={2}
            strokeDasharray="6 5"
            opacity={0.55}
          />
        ))}
        {/* Edges from transitive to their parent direct */}
        {showTransitive && transitivePos.map((t, i) => (
          <line
            key={t.id}
            x1={t.x - 320} y1={t.y - 100} x2={t.parentNode.x - 320} y2={t.parentNode.y - 100}
            stroke="oklch(0.68 0.13 230)" strokeWidth={1.5}
            strokeDasharray="4 4"
            opacity={0.45}
          />
        ))}
      </svg>

      {/* Hub node — validateCardToken */}
      {showHub && (
        <GraphNode
          x={hub.x - 320} y={hub.y - 100}
          label={hub.label} sub={hub.sub}
          color={UI.indigo} bg="oklch(0.96 0.04 265)"
          weight="hub"
        />
      )}

      {/* Direct caller nodes */}
      {showDirect && directPos.map(d => (
        <GraphNode key={d.id}
          x={d.x - 320} y={d.y - 100}
          label={d.label} sub={d.sub}
          color={UI.text} bg={UI.surface}
          weight="direct"
        />
      ))}

      {/* Transitive caller nodes */}
      {showTransitive && transitivePos.map(t => (
        <GraphNode key={t.id}
          x={t.x - 320} y={t.y - 100}
          label={t.label} sub={t.sub}
          color={UI.textMuted} bg={UI.surface2}
          weight="transitive"
        />
      ))}
    </div>
  );
}

function GraphNode({ x, y, label, sub, color, bg, weight = 'direct' }) {
  const sizes = {
    hub:        { padding: '14px 22px', fontSize: 22, subSize: 13, borderWidth: 2,   minWidth: 280 },
    direct:     { padding: '11px 16px', fontSize: 17, subSize: 12, borderWidth: 1.5, minWidth: 240 },
    transitive: { padding: '8px 12px',  fontSize: 13, subSize: 11, borderWidth: 1,   minWidth: 200 },
  };
  const s = sizes[weight];
  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: 'translate(-50%, -50%)',
      padding: s.padding,
      background: bg,
      border: `${s.borderWidth}px solid ${color}`,
      borderRadius: 6,
      boxShadow: weight === 'hub'
        ? '0 8px 24px rgba(85,84,243,0.25)'
        : '0 2px 8px rgba(0,0,0,0.06)',
      minWidth: s.minWidth, textAlign: 'center',
      fontFamily: F.mono,
    }}>
      <div style={{ fontSize: s.fontSize, fontWeight: 600, color, letterSpacing: '0.01em' }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: s.subSize, color: UI.textMuted, marginTop: 3, letterSpacing: '0.02em' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ── Input box at bottom ───────────────────────────────────────────────────
function ChatInput({ placeholder = 'Reply...', text = '' }) {
  return (
    <div style={{
      padding: '16px 48px 28px',
      background: UI.bg,
    }}>
      <div style={{
        padding: '16px 22px',
        background: UI.surface,
        border: `1px solid ${UI.borderStrong}`,
        borderRadius: 14,
        fontFamily: F.ui, fontSize: 17, color: text ? UI.text : UI.textFaint,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        {text || placeholder}
      </div>
    </div>
  );
}

Object.assign(window, {
  UI, F, Icons,
  Wordmark, HeaderBar, HeaderChip,
  Sidebar, ChatMain,
  UserBubble, RouterPill, ToolChip, AssistantIntro, AdrCard,
  GraphFanout, ChatInput,
});
