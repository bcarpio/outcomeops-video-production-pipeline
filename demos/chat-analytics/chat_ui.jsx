// chat_ui.jsx — OutcomeOps Chat UI primitives (static, no animation logic here)
// Pure visual components. The scene file drives them via props + time.

const T = {
  // Cool-neutral palette, Linear/Vercel-ish restraint
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
  sidebarHover: 'oklch(0.25 0.02 260)',
  sidebarActive: 'oklch(0.28 0.025 260)',
  indigo:    'oklch(0.55 0.17 265)',
  indigoSoft:'oklch(0.96 0.03 265)',
  indigoBorder: 'oklch(0.88 0.08 265)',
  sky:       'oklch(0.68 0.13 230)',
  skySoft:   'oklch(0.96 0.03 230)',
  skyBorder: 'oklch(0.86 0.08 230)',
  teal:      'oklch(0.68 0.10 200)',
  tealSoft:  'oklch(0.96 0.025 200)',
  tealBorder:'oklch(0.86 0.07 200)',
  ok:        'oklch(0.62 0.12 155)',
  amber:     'oklch(0.72 0.14 75)',
};

const FONT = {
  ui: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
  mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
};

// ── Tiny icon set (stroke-style, 16px) ─────────────────────────────────────
const Icon = ({ d, size = 16, stroke = 'currentColor', fill = 'none', sw = 1.6, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
       style={{ display: 'block', flexShrink: 0 }}>
    {children || <path d={d}/>}
  </svg>
);

const Icons = {
  Plus: (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  Msg:  (p) => <Icon {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>,
  Folder:(p) => <Icon {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></Icon>,
  Server:(p) => <Icon {...p}><rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/></Icon>,
  Chev:  (p) => <Icon {...p}><path d="M6 9l6 6 6-6"/></Icon>,
  Send:  (p) => <Icon {...p}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></Icon>,
  Zap:   (p) => <Icon {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></Icon>,
  Search:(p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>,
  File:  (p) => <Icon {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></Icon>,
  Book:  (p) => <Icon {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M19 17H6a2 2 0 0 0-2 2"/></Icon>,
  Check: (p) => <Icon {...p}><path d="M20 6 9 17l-5-5"/></Icon>,
  Copy:  (p) => <Icon {...p}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Icon>,
  Spark: (p) => <Icon {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></Icon>,
  Share: (p) => <Icon {...p}><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8 11 8-5M8 13l8 5"/></Icon>,
  Logout:(p) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></Icon>,
  Trash: (p) => <Icon {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></Icon>,
  Dot:   (p) => <Icon {...p} fill="currentColor" stroke="none"><circle cx="12" cy="12" r="4"/></Icon>,
  Git:   (p) => <Icon {...p}><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M6 8.5v7M18 8.5v1.5a3 3 0 0 1-3 3h-3"/></Icon>,
  Cmd:   (p) => <Icon {...p}><path d="M18 6a3 3 0 1 1-3 3V6M6 18a3 3 0 1 1 3-3v3M18 18a3 3 0 1 1-3-3h3M6 6a3 3 0 1 1 3 3H6M9 9h6v6H9z"/></Icon>,
};

// ── Brand ──────────────────────────────────────────────────────────────────
function Wordmark({ compact = false, color = T.sidebarText, accent = T.sky }) {
  return (
    <div style={{
      fontFamily: FONT.ui, fontWeight: 600, fontSize: 13.5,
      letterSpacing: '-0.01em', color,
      display: 'flex', alignItems: 'baseline', gap: 0,
    }}>
      <span>Outcome</span>
      <span style={{ color: accent }}>Ops</span>
      {!compact && <span style={{
        marginLeft: 8, fontWeight: 400, fontSize: 11.5,
        color: T.sidebarMuted, letterSpacing: '0.02em',
      }}>AI Assist</span>}
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ conversations, activeId, highlightNew = false }) {
  return (
    <div style={{
      width: 248, flexShrink: 0,
      background: T.sidebarBg,
      color: T.sidebarText,
      display: 'flex', flexDirection: 'column',
      fontFamily: FONT.ui,
      borderRight: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* New chat */}
      <div style={{ padding: 12 }}>
        <button style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '8px 12px',
          background: highlightNew ? 'oklch(0.32 0.04 260)' : 'oklch(0.26 0.025 260)',
          color: T.sidebarText,
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          fontSize: 13, fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 160ms',
        }}>
          <Icons.Plus size={14}/>
          New chat
          <span style={{ marginLeft: 'auto', fontSize: 10.5, color: T.sidebarMuted, fontFamily: FONT.mono }}>⌘K</span>
        </button>
      </div>

      <div style={{
        padding: '4px 16px 6px', fontSize: 10.5, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: T.sidebarMuted, fontWeight: 500,
      }}>Recent</div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 8px' }}>
        {conversations.map((c) => (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px',
            borderRadius: 6,
            background: c.id === activeId ? T.sidebarActive : 'transparent',
            color: c.id === activeId ? T.sidebarText : 'oklch(0.78 0.015 250)',
            fontSize: 12.5,
            marginBottom: 1,
            cursor: 'pointer',
            position: 'relative',
          }}>
            <Icons.Msg size={13} stroke={c.id === activeId ? T.sky : T.sidebarMuted}/>
            <span style={{
              flex: 1,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{c.title}</span>
            {c.badge && (
              <span style={{
                fontSize: 9.5, fontFamily: FONT.mono,
                color: T.sidebarMuted,
              }}>{c.badge}</span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Wordmark />
        <div style={{ display: 'flex', gap: 4, color: T.sidebarMuted }}>
          <Icons.Folder size={14}/>
          <span style={{ width: 8 }}/>
          <Icons.Logout size={14}/>
        </div>
      </div>
    </div>
  );
}

// ── Header Chips ───────────────────────────────────────────────────────────
function Chip({ icon, label, tone = 'neutral', active = false, pulse = 0 }) {
  const tones = {
    neutral: { bg: T.surface2, border: T.border, text: T.text, iconColor: T.textMuted },
    sky:     { bg: T.skySoft, border: T.skyBorder, text: 'oklch(0.40 0.10 230)', iconColor: T.sky },
    indigo:  { bg: T.indigoSoft, border: T.indigoBorder, text: 'oklch(0.40 0.12 265)', iconColor: T.indigo },
    teal:    { bg: T.tealSoft, border: T.tealBorder, text: 'oklch(0.40 0.08 200)', iconColor: T.teal },
  };
  const s = tones[tone];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 9px 5px 8px',
      background: s.bg,
      border: `1px solid ${active ? s.iconColor : s.border}`,
      borderRadius: 7,
      fontSize: 12, color: s.text,
      fontFamily: FONT.ui, fontWeight: 500,
      whiteSpace: 'nowrap',
      transition: 'all 200ms',
      boxShadow: pulse > 0 ? `0 0 0 ${pulse * 6}px ${s.iconColor}22` : 'none',
    }}>
      <span style={{ color: s.iconColor, display: 'flex' }}>{icon}</span>
      {label}
      <Icons.Chev size={11} stroke={s.iconColor}/>
    </div>
  );
}

function HeaderBar({ title, workspacesLabel = 'All workspaces', mcpCount = 0, mcpActive = false, promptLabel = 'Default', workspacesPulse = 0, mcpPulse = 0 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px',
      borderBottom: `1px solid ${T.border}`,
      background: T.surface,
      height: 52, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button style={{
          width: 28, height: 28, border: 'none', background: 'transparent',
          borderRadius: 6, color: T.textMuted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icons.Msg size={15}/>
        </button>
        <h1 style={{
          margin: 0, fontFamily: FONT.ui, fontWeight: 550,
          fontSize: 13.5, color: T.text, letterSpacing: '-0.005em',
        }}>{title}</h1>
        <span style={{
          fontFamily: FONT.mono, fontSize: 10.5, color: T.textFaint,
          padding: '1px 6px', border: `1px solid ${T.border}`, borderRadius: 4,
        }}>main</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Chip icon={<Icons.Folder size={13}/>} label={workspacesLabel} tone="sky" pulse={workspacesPulse}/>
        <Chip icon={<Icons.Server size={13}/>} label={mcpCount > 0 ? `${mcpCount} MCP server${mcpCount > 1 ? 's' : ''}` : 'MCP (0)'} tone={mcpActive ? 'indigo' : 'neutral'} pulse={mcpPulse}/>
        <Chip icon={<Icons.Spark size={13}/>} label={`Voice: ${promptLabel}`} tone="teal"/>
      </div>
    </div>
  );
}

// ── Message bubbles ────────────────────────────────────────────────────────
function UserBubble({ text, opacity = 1, ty = 0 }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-end',
      opacity, transform: `translateY(${ty}px)`,
      transition: 'none',
    }}>
      <div style={{
        maxWidth: '75%',
        padding: '10px 14px',
        background: T.text,
        color: 'white',
        borderRadius: 12,
        borderTopRightRadius: 4,
        fontSize: 13.5,
        lineHeight: 1.5,
        fontFamily: FONT.ui,
        whiteSpace: 'pre-wrap',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
      }}>{text}</div>
    </div>
  );
}

// Streaming assistant bubble — shows partial content, optional caret, optional search indicator.
function AssistantBubble({ content, streaming = false, searchingLabel = null, toolCall = null, opacity = 1 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', opacity }}>
      <div style={{
        maxWidth: '88%',
        minWidth: searchingLabel ? 280 : 0,
        padding: '12px 16px',
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        borderTopLeftRadius: 4,
        fontSize: 13.5, lineHeight: 1.6, color: T.text,
        fontFamily: FONT.ui,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
      }}>
        {searchingLabel && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: T.textMuted, fontSize: 12.5,
          }}>
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              border: `2px solid ${T.border}`,
              borderTopColor: T.indigo,
              animation: 'oo-spin 700ms linear infinite',
              display: 'inline-block',
            }}/>
            <span style={{ fontFamily: FONT.ui }}>{searchingLabel}</span>
          </div>
        )}
        {toolCall && (
          <div style={{
            marginTop: searchingLabel ? 8 : 0,
            padding: '6px 8px',
            background: T.indigoSoft,
            border: `1px solid ${T.indigoBorder}`,
            borderRadius: 6,
            fontFamily: FONT.mono, fontSize: 11.5,
            color: 'oklch(0.40 0.12 265)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icons.Server size={12}/>
            <span>calling {toolCall}</span>
          </div>
        )}
        {content && (
          <AssistantContent content={content} streaming={streaming}/>
        )}
      </div>
    </div>
  );
}

// Render markdown-like content — supports headings, paragraphs, code blocks, lists.
// Content is an array of blocks: {type: 'p'|'h3'|'code'|'ul', text, items, lang}
function AssistantContent({ content, streaming }) {
  return (
    <div>
      {content.map((block, i) => {
        const isLast = i === content.length - 1;
        if (block.type === 'h3') {
          return <div key={i} style={{
            fontSize: 14, fontWeight: 600, color: T.text,
            marginTop: i === 0 ? 0 : 14, marginBottom: 6,
            letterSpacing: '-0.005em',
          }}>{block.text}{isLast && streaming && <Caret/>}</div>;
        }
        if (block.type === 'p') {
          return <p key={i} style={{
            margin: '0 0 10px', color: T.text, fontSize: 13.5, lineHeight: 1.6,
          }}>{renderInline(block.text)}{isLast && streaming && <Caret/>}</p>;
        }
        if (block.type === 'code') {
          return <CodeBlock key={i} code={block.text} lang={block.lang} streaming={streaming && isLast}/>;
        }
        if (block.type === 'ul') {
          const shownItems = block.items;
          return (
            <ul key={i} style={{
              margin: '2px 0 10px', paddingLeft: 20,
              color: T.text, fontSize: 13.5, lineHeight: 1.6,
            }}>
              {shownItems.map((item, j) => (
                <li key={j} style={{ marginBottom: 2 }}>
                  {renderInline(item)}
                  {isLast && streaming && j === shownItems.length - 1 && <Caret/>}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'table') {
          const header = block.header || [];
          const rows = block.rows || [];
          // Verdict cell gets semantic colour: EXCEEDS (sky), MATCHES (ok), GAP (warn)
          const verdictStyle = (v) => {
            const up = (v || '').toString().toUpperCase();
            if (up.includes('EXCEED')) return { color: T.indigo, fontWeight: 600 };
            if (up.includes('MATCH'))  return { color: T.textMuted, fontWeight: 500 };
            if (up.includes('GAP'))    return { color: 'oklch(0.55 0.17 40)', fontWeight: 600 };
            return {};
          };
          return (
            <div key={i} style={{ margin: '4px 0 12px', overflow: 'hidden',
              border: `1px solid ${T.border}`, borderRadius: 8, background: T.surface }}>
              <table style={{
                width: '100%', borderCollapse: 'collapse',
                fontSize: 12.5, lineHeight: 1.45, fontFamily: FONT.ui,
              }}>
                {header.length > 0 && (
                  <thead>
                    <tr style={{ background: T.surface2 }}>
                      {header.map((h, k) => (
                        <th key={k} style={{
                          padding: '6px 10px',
                          textAlign: 'left',
                          fontWeight: 600, fontSize: 11, color: T.textMuted,
                          letterSpacing: '0.02em', textTransform: 'uppercase',
                          borderBottom: `1px solid ${T.border}`,
                          whiteSpace: 'nowrap',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rows.map((row, j) => {
                    const isVerdictCol = (k) => k === row.length - 1;
                    return (
                      <tr key={j} style={{
                        borderTop: j === 0 && header.length === 0 ? 'none' : `1px solid ${T.border}`,
                      }}>
                        {row.map((cell, k) => (
                          <td key={k} style={{
                            padding: '6px 10px',
                            color: T.text,
                            verticalAlign: 'top',
                            ...(isVerdictCol(k) ? verdictStyle(cell) : {}),
                            fontFamily: isVerdictCol(k) ? FONT.ui : FONT.ui,
                            whiteSpace: isVerdictCol(k) ? 'nowrap' : 'normal',
                          }}>
                            {renderInline(String(cell))}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {isLast && streaming && (
                <div style={{ padding: '0 10px 6px' }}><Caret/></div>
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function renderInline(text) {
  // Parse `code` spans and **bold**
  const parts = [];
  let rest = text;
  let key = 0;
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/;
  while (rest.length > 0) {
    const m = rest.match(re);
    if (!m) { parts.push(rest); break; }
    if (m.index > 0) parts.push(rest.slice(0, m.index));
    const tok = m[0];
    if (tok.startsWith('`')) {
      parts.push(<code key={++key} style={{
        fontFamily: FONT.mono, fontSize: 12,
        background: T.surface2, border: `1px solid ${T.border}`,
        padding: '1px 5px', borderRadius: 4,
        color: 'oklch(0.40 0.12 265)',
      }}>{tok.slice(1, -1)}</code>);
    } else {
      parts.push(<strong key={++key} style={{ fontWeight: 600 }}>{tok.slice(2, -2)}</strong>);
    }
    rest = rest.slice(m.index + tok.length);
  }
  return parts;
}

function Caret() {
  return <span style={{
    display: 'inline-block',
    width: 7, height: 14,
    background: T.indigo, marginLeft: 2,
    verticalAlign: '-2px',
    animation: 'oo-blink 900ms steps(2) infinite',
  }}/>;
}

function CodeBlock({ code, lang = 'python', streaming = false }) {
  const lines = code.split('\n');
  return (
    <div style={{
      background: 'oklch(0.20 0.02 260)',
      borderRadius: 8,
      margin: '8px 0 10px',
      overflow: 'hidden',
      border: `1px solid oklch(0.25 0.025 260)`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 12px',
        background: 'oklch(0.23 0.02 260)',
        borderBottom: '1px solid oklch(0.28 0.025 260)',
      }}>
        <span style={{
          fontFamily: FONT.mono, fontSize: 10.5,
          color: 'oklch(0.72 0.015 250)', letterSpacing: '0.04em',
        }}>{lang}</span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          color: 'oklch(0.62 0.015 250)', fontSize: 11,
        }}>
          <Icons.Copy size={11}/>
          <span>Copy</span>
        </div>
      </div>
      <pre style={{
        margin: 0, padding: '10px 12px',
        fontFamily: FONT.mono, fontSize: 11.5, lineHeight: 1.65,
        color: 'oklch(0.88 0.01 240)',
        overflow: 'hidden', whiteSpace: 'pre',
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <span style={{ color: 'oklch(0.45 0.02 260)', minWidth: 18, textAlign: 'right', marginRight: 12, userSelect: 'none' }}>{i + 1}</span>
            <span style={{ flex: 1 }}>
              {syntaxHighlight(line)}
              {streaming && i === lines.length - 1 && <Caret/>}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}

// Very light python-ish syntax highlighting
function syntaxHighlight(line) {
  const tokens = [];
  const rules = [
    { re: /^(#[^\n]*)/, cls: 'c' },
    { re: /^("""[^"]*"""|"[^"]*"|'[^']*')/, cls: 's' },
    { re: /^\b(def|class|return|from|import|if|else|elif|raise|try|except|for|in|with|as|lambda|None|True|False|await|async)\b/, cls: 'k' },
    { re: /^\b([A-Z][A-Za-z0-9_]*)\b/, cls: 'ty' },
    { re: /^\b(\d+(?:\.\d+)?)\b/, cls: 'n' },
    { re: /^([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/, cls: 'fn' },
  ];
  let rest = line;
  let key = 0;
  while (rest.length > 0) {
    let matched = false;
    for (const r of rules) {
      const m = rest.match(r.re);
      if (m) {
        tokens.push(<span key={++key} className={r.cls}>{m[0]}</span>);
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push(rest[0]);
      rest = rest.slice(1);
    }
  }
  return tokens;
}

// ── Input Bar ──────────────────────────────────────────────────────────────
function InputBar({ text, caretVisible = false, topK = 5, advanced = false, advancedDepth = 10, advancedPillOpacity = 0, status = 'idle', statusText = '' }) {
  return (
    <div style={{
      padding: '12px 20px 14px',
      borderTop: `1px solid ${T.border}`,
      background: T.surface,
      flexShrink: 0,
    }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {advancedPillOpacity > 0 && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 10px',
            marginBottom: 8,
            borderRadius: 999,
            border: `1px solid ${T.indigoBorder}`,
            background: T.indigoSoft,
            color: T.indigo,
            fontFamily: FONT.mono, fontSize: 11,
            letterSpacing: '0.01em',
            opacity: advancedPillOpacity,
            transform: `translateY(${(1 - advancedPillOpacity) * -4}px)`,
            transition: 'opacity 160ms, transform 160ms',
          }}>
            <Icons.Zap size={11}/>
            <span>Advanced · depth {advancedDepth}</span>
          </div>
        )}
        <div style={{
          display: 'flex', alignItems: 'stretch', gap: 8,
        }}>
          <div style={{
            flex: 1,
            minHeight: 46,
            padding: '12px 14px',
            border: `1px solid ${status === 'idle' && text ? T.indigoBorder : T.border}`,
            borderRadius: 10,
            background: status === 'idle' ? T.surface : T.surface2,
            fontFamily: FONT.ui, fontSize: 13.5, lineHeight: 1.5, color: T.text,
            display: 'flex', alignItems: 'center',
            boxShadow: status === 'idle' && text ? `0 0 0 3px ${T.indigoSoft}` : 'none',
            transition: 'box-shadow 160ms, border-color 160ms',
          }}>
            {text ? (
              <span style={{ whiteSpace: 'pre-wrap' }}>
                {text}
                {caretVisible && <Caret/>}
              </span>
            ) : (
              <span style={{ color: T.textFaint }}>
                Ask about your codebase…
                {caretVisible && <Caret/>}
              </span>
            )}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '0 4px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              height: 46, padding: '0 10px',
              border: `1px solid ${T.border}`, borderRadius: 10,
              background: T.surface2, color: T.textMuted,
              fontFamily: FONT.mono, fontSize: 11.5,
            }}>
              <Icons.Search size={12}/>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{topK}</span>
            </div>
            <div style={{
              position: 'relative',
              width: 46, height: 46,
              border: `1px solid ${advanced ? T.indigoBorder : T.border}`,
              borderRadius: 10,
              background: advanced ? T.indigoSoft : T.surface2,
              color: advanced ? T.indigo : T.textMuted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 160ms, border-color 160ms, color 160ms',
            }}>
              <Icons.Zap size={16}/>
              {advanced && (
                <div style={{
                  position: 'absolute', top: -5, right: -5,
                  minWidth: 18, height: 18, padding: '0 4px',
                  borderRadius: 9,
                  background: T.indigo, color: 'white',
                  fontFamily: FONT.mono, fontSize: 10, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  letterSpacing: 0,
                  boxShadow: `0 0 0 2px ${T.surface}`,
                }}>
                  {advancedDepth}
                </div>
              )}
            </div>
            <div style={{
              width: 46, height: 46,
              borderRadius: 10,
              background: status === 'idle' && text ? T.text : 'oklch(0.75 0.015 250)',
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 160ms',
            }}>
              {status === 'thinking' || status === 'typing' ? (
                <span style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  animation: 'oo-spin 700ms linear infinite',
                }}/>
              ) : (
                <Icons.Send size={15}/>
              )}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 8,
          fontSize: 11, fontFamily: FONT.ui, color: T.textFaint,
        }}>
          <span style={{
            color: status === 'idle' ? T.textFaint : T.indigo,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {status !== 'idle' && (
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: T.indigo,
                animation: 'oo-pulse 1.2s ease-in-out infinite',
              }}/>
            )}
            {statusText || 'Enter to send   •   Shift+Enter for new line'}
          </span>
          <span style={{ fontFamily: FONT.mono, color: T.textFaint }}>
            {advanced ? 'Advanced' : 'Standard'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Sources panel ──────────────────────────────────────────────────────────
function SourcesPanel({ sources, expanded = false, heightProgress = 0 }) {
  const targetHeight = expanded ? 32 + Math.min(sources.length, 10) * 26 : 32;
  const h = 32 + (targetHeight - 32) * heightProgress;

  return (
    <div style={{
      borderTop: `1px solid ${T.border}`,
      background: T.surface,
      flexShrink: 0,
      height: h,
      overflow: 'hidden',
      transition: 'none',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 20px',
        fontSize: 12, color: T.textMuted, fontFamily: FONT.ui,
        height: 32,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icons.Book size={13} stroke={T.sky}/>
          <span style={{ fontWeight: 500 }}>{sources.length} sources</span>
          <span style={{ color: T.textFaint, fontFamily: FONT.mono, fontSize: 11 }}>
            reranked via Cohere 3.5
          </span>
        </span>
        <Icons.Chev size={13} stroke={T.textMuted}/>
      </div>
      <div style={{ padding: '0 20px 8px' }}>
        {sources.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '4px 0',
            fontSize: 11.5, fontFamily: FONT.mono,
            color: T.textMuted,
            opacity: heightProgress,
          }}>
            <Icons.File size={12} stroke={T.textFaint}/>
            <span style={{ color: T.text, fontWeight: 500 }}>{s.repo}</span>
            <span style={{ color: T.textFaint }}>/</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.path}</span>
            <span style={{
              padding: '1px 6px', borderRadius: 4,
              background: T.skySoft, color: 'oklch(0.40 0.10 230)',
              fontSize: 10, letterSpacing: '0.02em',
            }}>{s.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Knowledge retrieval overlay (ephemeral) ────────────────────────────────
// Shows chips floating up and settling into the sources panel as search happens.
function SearchPulse({ progress }) {
  // progress 0..1 — draw a thin line sweeping across the content area
  const p = progress;
  return (
    <div style={{
      position: 'absolute',
      left: 0, right: 0, top: 0, height: 2,
      background: `linear-gradient(90deg, transparent 0%, ${T.indigo} 50%, transparent 100%)`,
      opacity: p > 0 && p < 1 ? 0.8 : 0,
      transform: `translateX(${(p - 0.5) * 100}%)`,
      pointerEvents: 'none',
    }}/>
  );
}

// ── Global keyframes ───────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @keyframes oo-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
      @keyframes oo-spin  { to { transform: rotate(360deg); } }
      @keyframes oo-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
      .k  { color: oklch(0.78 0.13 290); }
      .s  { color: oklch(0.80 0.10 145); }
      .c  { color: oklch(0.55 0.015 250); font-style: italic; }
      .fn { color: oklch(0.82 0.12 230); }
      .ty { color: oklch(0.82 0.09 85); }
      .n  { color: oklch(0.80 0.10 40); }
    `}</style>
  );
}

Object.assign(window, {
  T, FONT, Icons, Wordmark, Sidebar, HeaderBar, Chip,
  UserBubble, AssistantBubble, AssistantContent, CodeBlock, Caret,
  InputBar, SourcesPanel, SearchPulse, GlobalStyles, renderInline,
});
