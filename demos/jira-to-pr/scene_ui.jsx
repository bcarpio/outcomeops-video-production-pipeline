// scene_ui.jsx
// Static UI primitives for the OutcomeOps Jira→PR walkthrough.
// Every component here is purely presentational — layout, colors, type.
// Animation happens in scene.jsx by wrapping these in <Sprite>.

// ── Design tokens ───────────────────────────────────────────────────────────
const oo = {
  bg:        '#0A1020',        // deep navy
  bg2:       '#0F172A',        // slightly lighter
  surface:   '#141C30',        // card surface
  surface2:  '#1B2540',        // hover / inner surface
  border:    '#273354',        // subtle border
  borderHi:  '#3A4A78',        // brighter border
  text:      '#E6EBF5',        // primary text
  textDim:   '#8A96B4',        // secondary text
  textFaint: '#5A6686',        // tertiary
  accent:    '#5AA9FF',        // electric blue — OutcomeOps accent
  accentDim: '#2B5FA8',
  accentBg:  'rgba(90,169,255,0.12)',
  success:   '#4ADE80',
  successBg: 'rgba(74,222,128,0.12)',
  warn:      '#FBBF24',
  danger:    '#F87171',
  purple:    '#A78BFA',
  magenta:   '#F472B6',
  // Jira blue
  jira:      '#2684FF',
  // GitHub
  gh:        '#F0F6FC',
  ghBg:      '#0D1117',
  ghBorder:  '#30363D',
  ghGreen:   '#3FB950',
  ghRed:     '#F85149',
  mono:      "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  sans:      "'Inter', system-ui, -apple-system, sans-serif",
};

// ── Low-level atoms ─────────────────────────────────────────────────────────

const Card = ({ children, style, glow }) => (
  <div style={{
    background: oo.surface,
    border: `1px solid ${oo.border}`,
    borderRadius: 12,
    boxShadow: glow
      ? `0 0 0 1px ${oo.accent}40, 0 8px 32px -8px ${oo.accent}60`
      : '0 8px 24px -12px rgba(0,0,0,0.6)',
    ...style,
  }}>
    {children}
  </div>
);

const Chip = ({ label, color = oo.accent, bg, icon, size = 'md' }) => {
  const h = size === 'sm' ? 20 : size === 'lg' ? 28 : 24;
  const fs = size === 'sm' ? 10 : size === 'lg' ? 12 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: h,
      padding: `0 ${h / 2.5}px`,
      background: bg || `${color}1f`,
      color,
      border: `1px solid ${color}40`,
      borderRadius: h / 2,
      fontFamily: oo.sans,
      fontWeight: 600,
      fontSize: fs,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      {icon}
      {label}
    </span>
  );
};

const Dot = ({ color = oo.accent, size = 8, pulse = false, style }) => (
  <span style={{
    display: 'inline-block',
    width: size, height: size, borderRadius: size / 2,
    background: color,
    boxShadow: pulse ? `0 0 0 4px ${color}33, 0 0 0 8px ${color}15` : `0 0 6px ${color}80`,
    ...style,
  }} />
);

// ── Window chrome (for IDE/terminal/GitHub frames) ──────────────────────────

const WindowChrome = ({ title, children, tone = 'dark', tabs, style }) => {
  const dark = tone === 'dark';
  return (
    <div style={{
      background: dark ? oo.ghBg : '#ffffff',
      border: `1px solid ${dark ? oo.ghBorder : '#e5e7eb'}`,
      borderRadius: 10,
      overflow: 'hidden',
      fontFamily: oo.sans,
      color: dark ? oo.gh : '#111',
      ...style,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px',
        background: dark ? '#161B22' : '#f8fafc',
        borderBottom: `1px solid ${dark ? oo.ghBorder : '#e5e7eb'}`,
        fontSize: 12,
        color: dark ? '#8B949E' : '#64748b',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <Dot color="#FF5F57" size={10} />
          <Dot color="#FEBC2E" size={10} />
          <Dot color="#28C840" size={10} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', letterSpacing: '0.02em' }}>{title}</div>
        <div style={{ width: 54 }} />
      </div>
      {tabs && (
        <div style={{
          display: 'flex',
          background: dark ? '#0D1117' : '#f1f5f9',
          borderBottom: `1px solid ${dark ? oo.ghBorder : '#e5e7eb'}`,
          padding: '0 8px',
        }}>
          {tabs}
        </div>
      )}
      {children}
    </div>
  );
};

// ── Jira ticket card ────────────────────────────────────────────────────────

const JiraTicket = ({ highlighted = false, labelPulse = false, style }) => (
  <div style={{
    width: 520,
    background: '#FFFFFF',
    border: `1px solid ${highlighted ? oo.accent : '#DFE1E6'}`,
    borderRadius: 10,
    boxShadow: highlighted
      ? `0 0 0 3px ${oo.accent}33, 0 12px 40px -12px rgba(0,0,0,0.5)`
      : '0 8px 24px -12px rgba(0,0,0,0.5)',
    fontFamily: oo.sans,
    color: '#172B4D',
    overflow: 'hidden',
    ...style,
  }}>
    {/* Top bar — Jira chrome */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 16px',
      background: '#F4F5F7',
      borderBottom: '1px solid #DFE1E6',
      fontSize: 12,
      color: '#5E6C84',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 4,
        background: oo.jira,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 11, fontWeight: 700,
      }}>J</div>
      <span style={{ fontWeight: 600, color: '#172B4D' }}>CPE Project</span>
      <span style={{ color: '#97A0AF' }}>›</span>
      <span style={{ fontFamily: oo.mono, fontWeight: 600, color: oo.jira }}>CPE-42</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 11 }}>Story</span>
    </div>
    {/* Body */}
    <div style={{ padding: '18px 20px 20px' }}>
      <h3 style={{
        margin: 0, fontSize: 18, fontWeight: 600,
        color: '#091E42', letterSpacing: '-0.01em',
      }}>
        [Lambda] Add list-recent-docs handler for KB verification
      </h3>
      <div style={{ marginTop: 10, fontSize: 13, color: '#5E6C84', lineHeight: 1.55 }}>
        <div style={{ color: '#172B4D', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>User Story</div>
        As a DevOps engineer,<br />
        I want to list recently ingested KB documents,<br />
        So that I can verify ingestion is working correctly.
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 24, padding: '0 10px',
          background: labelPulse ? '#E3FCEF' : '#DFE1E6',
          color: labelPulse ? '#006644' : '#42526E',
          border: `1px solid ${labelPulse ? '#ABF5D1' : '#C1C7D0'}`,
          borderRadius: 3, fontSize: 11, fontWeight: 600,
          animation: labelPulse ? 'ooPulse 1.4s ease-in-out infinite' : 'none',
        }}>
          <Dot color={labelPulse ? '#00875A' : '#5E6C84'} size={6} pulse={labelPulse} />
          approved-for-generation
        </span>
        <span style={{
          height: 24, padding: '0 10px', background: '#DEEBFF', color: '#0747A6',
          border: '1px solid #B3D4FF', borderRadius: 3,
          display: 'inline-flex', alignItems: 'center',
          fontSize: 11, fontWeight: 600,
        }}>lambda</span>
        <span style={{
          height: 24, padding: '0 10px', background: '#EAE6FF', color: '#403294',
          border: '1px solid #C0B6F2', borderRadius: 3,
          display: 'inline-flex', alignItems: 'center',
          fontSize: 11, fontWeight: 600,
        }}>python</span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginTop: 14,
        paddingTop: 12, borderTop: '1px solid #F4F5F7',
        fontSize: 11, color: '#5E6C84',
      }}>
        <span><b style={{ color: '#172B4D' }}>Reporter:</b> b.carpio</span>
        <span><b style={{ color: '#172B4D' }}>Priority:</b> High</span>
        <span><b style={{ color: '#172B4D' }}>Est:</b> 16 hrs</span>
      </div>
    </div>
  </div>
);

// ── AWS-style Lambda node ──────────────────────────────────────────────────

const LambdaNode = ({ name, active = false, processing = false, size = 'md', style }) => {
  const w = size === 'lg' ? 200 : size === 'sm' ? 120 : 160;
  const h = size === 'lg' ? 120 : size === 'sm' ? 72 : 96;
  const color = active ? oo.accent : oo.borderHi;
  return (
    <div style={{
      width: w, height: h,
      background: active ? `linear-gradient(180deg, ${oo.surface} 0%, ${oo.surface2} 100%)` : oo.surface,
      border: `1px solid ${color}`,
      borderRadius: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 8,
      fontFamily: oo.mono,
      boxShadow: active
        ? `0 0 0 2px ${oo.accent}30, 0 0 24px -4px ${oo.accent}80`
        : '0 2px 8px rgba(0,0,0,0.3)',
      position: 'relative',
      ...style,
    }}>
      {/* Lambda icon — AWS-ish lambda lambda */}
      <svg width={size === 'lg' ? 36 : 26} height={size === 'lg' ? 36 : 26} viewBox="0 0 40 40">
        <rect x="1" y="1" width="38" height="38" rx="4"
          fill={active ? '#F58536' : '#3A4A78'}
          opacity={active ? 1 : 0.6}
        />
        <path d="M11 31 L18 15 L22 15 L19 21.5 L23 31 L19 31 L17 26 L15 31 Z"
          fill="#fff"
        />
      </svg>
      <div style={{
        fontSize: size === 'lg' ? 12 : 10,
        fontWeight: 600,
        color: active ? oo.text : oo.textDim,
        letterSpacing: '0.02em',
        textAlign: 'center',
        padding: '0 6px',
      }}>
        {name}
      </div>
      {processing && (
        <div style={{
          position: 'absolute', bottom: 6, right: 6,
          display: 'flex', gap: 3,
        }}>
          <span style={dotStyle(0)} />
          <span style={dotStyle(0.2)} />
          <span style={dotStyle(0.4)} />
        </div>
      )}
    </div>
  );
};

const dotStyle = (delay) => ({
  width: 4, height: 4, borderRadius: 2,
  background: oo.accent,
  animation: `ooBlink 0.9s ease-in-out ${delay}s infinite`,
});

// ── ADR chip (knowledge base document) ─────────────────────────────────────

const AdrChip = ({ id, title, score, rerankScore, style }) => (
  <div style={{
    background: oo.surface,
    border: `1px solid ${oo.border}`,
    borderRadius: 10,
    padding: '20px 22px',
    display: 'flex', alignItems: 'center', gap: 18,
    fontFamily: oo.sans,
    minWidth: 320,
    ...style,
  }}>
    <div style={{
      width: 52, height: 52, borderRadius: 10,
      background: oo.accentBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="26" height="26" viewBox="0 0 16 16" fill="none">
        <path d="M3 2h7l3 3v9H3V2z" stroke={oo.accent} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5 8h6M5 11h4" stroke={oo.accent} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: oo.mono, fontSize: 15, color: oo.accent,
        fontWeight: 600, letterSpacing: '0.04em',
      }}>{id}</div>
      <div style={{
        fontSize: 20, color: oo.text, fontWeight: 500,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        marginTop: 4,
      }}>{title}</div>
    </div>
    {score != null && (
      <div style={{
        fontFamily: oo.mono, fontSize: 18,
        color: rerankScore != null ? oo.success : oo.textDim,
        fontVariantNumeric: 'tabular-nums',
        textAlign: 'right', flexShrink: 0,
      }}>
        {rerankScore != null ? rerankScore.toFixed(3) : score.toFixed(3)}
        <div style={{ fontSize: 11, color: oo.textFaint, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
          {rerankScore != null ? 'rerank' : 'vector'}
        </div>
      </div>
    )}
  </div>
);

// ── Plan document (the hero artifact) ──────────────────────────────────────

const PlanDocument = ({ revealedSteps = 0, completedSteps = 0, currentStep = null, title = 'Code Generation Plan', subtitle, style }) => {
  const steps = [
    { n: 1, title: 'Create Pydantic models for request/response validation', files: ['lambda/list-recent-docs/models.py'] },
    { n: 2, title: 'Create Lambda handler with DynamoDB query logic',        files: ['lambda/list-recent-docs/handler.py'] },
    { n: 3, title: 'Create requirements.txt with pinned dependencies',        files: ['lambda/list-recent-docs/requirements.txt'] },
    { n: 4, title: 'Create Terraform Lambda function resource',               files: ['terraform/lambda.tf'] },
    { n: 5, title: 'Create unit tests for happy path scenarios',              files: ['lambda/tests/unit/test_list_recent_docs.py'] },
    { n: 6, title: 'Create unit tests for input validation errors',           files: ['lambda/tests/unit/test_list_recent_docs.py'] },
    { n: 7, title: 'Create unit tests for DynamoDB error handling',           files: ['lambda/tests/unit/test_list_recent_docs.py'] },
    { n: 8, title: 'Create unit tests for edge cases',                        files: ['lambda/tests/unit/test_list_recent_docs.py'] },
  ];

  return (
    <div style={{
      width: 640,
      background: oo.surface,
      border: `1px solid ${oo.border}`,
      borderRadius: 12,
      fontFamily: oo.sans,
      color: oo.text,
      boxShadow: '0 20px 60px -20px rgba(0,0,0,0.8)',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: oo.bg2,
        borderBottom: `1px solid ${oo.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M3 2h7l3 3v9H3V2z" stroke={oo.accent} strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M10 2v3h3" stroke={oo.accent} strokeWidth="1.5"/>
          </svg>
          <div style={{ fontFamily: oo.mono, fontSize: 11, color: oo.textDim }}>
            issues/42-cpe-42-...-plan.md
          </div>
        </div>
        <h3 style={{ margin: '10px 0 0', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>
          {title}
        </h3>
        <div style={{ marginTop: 8, display: 'flex', gap: 16, fontSize: 12, color: oo.textDim }}>
          <span><b style={{ color: oo.text }}>Issue:</b> #42</span>
          <span><b style={{ color: oo.text }}>Backend:</b> python</span>
          <span><b style={{ color: oo.text }}>Steps:</b> {completedSteps}/8</span>
        </div>
      </div>
      {/* Steps list */}
      <div style={{ padding: '8px 0' }}>
        {steps.map((s, i) => {
          const revealed = i < revealedSteps;
          const done = i < completedSteps;
          const current = i === currentStep;
          return (
            <div key={s.n} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 20px',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateX(0)' : 'translateX(-8px)',
              transition: 'opacity 280ms ease, transform 280ms ease',
              background: current ? oo.accentBg : 'transparent',
              borderLeft: `3px solid ${current ? oo.accent : 'transparent'}`,
            }}>
              {/* Step number / check */}
              <div style={{
                width: 22, height: 22, borderRadius: 11,
                background: done ? oo.successBg : current ? oo.accentBg : oo.bg2,
                border: `1px solid ${done ? oo.success : current ? oo.accent : oo.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                fontFamily: oo.mono, fontSize: 10,
                color: done ? oo.success : current ? oo.accent : oo.textDim,
                fontWeight: 700,
              }}>
                {done
                  ? <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke={oo.success} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : s.n}
              </div>
              {/* Title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 500,
                  color: done ? oo.textDim : oo.text,
                  textDecoration: done ? 'line-through' : 'none',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {s.title}
                </div>
                <div style={{
                  fontFamily: oo.mono, fontSize: 10, color: oo.textFaint,
                  marginTop: 2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {s.files[0]}
                </div>
              </div>
              {current && (
                <div style={{ display: 'flex', gap: 3 }}>
                  <span style={dotStyle(0)} />
                  <span style={dotStyle(0.2)} />
                  <span style={dotStyle(0.4)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── SQS queue visualization ────────────────────────────────────────────────

const SqsQueue = ({ messages = [], style }) => (
  <div style={{
    width: 260,
    background: oo.surface,
    border: `1px solid ${oo.border}`,
    borderRadius: 10,
    padding: '18px 16px',
    fontFamily: oo.mono,
    ...style,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 13, color: oo.textDim,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 16,
    }}>
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="10" rx="1" stroke="#FF9900" strokeWidth="1.5" fill="#FF990022"/>
        <path d="M4 6h8M4 9h6M4 12h4" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      SQS · code-gen-queue
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {messages.length === 0 && (
        <div style={{
          fontSize: 14, color: oo.textFaint, fontStyle: 'italic',
          padding: '16px 8px', textAlign: 'center',
        }}>
          empty
        </div>
      )}
      {messages.map((m, i) => (
        <div key={i} style={{
          padding: '12px 12px',
          background: oo.bg2,
          border: `1px solid ${oo.border}`,
          borderRadius: 6,
          fontSize: 14, color: oo.text,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Dot color={oo.warn} size={7} />
          step: {m}
        </div>
      ))}
    </div>
  </div>
);

// ── File tree that lights up as files are written ──────────────────────────

const FileTree = ({ writtenFiles = new Set(), currentFile = null, style }) => {
  const tree = [
    { path: 'lambda/',                                            depth: 0, dir: true },
    { path: 'list-recent-docs/',                                  depth: 1, dir: true },
    { path: 'models.py',                                          depth: 2, full: 'lambda/list-recent-docs/models.py' },
    { path: 'handler.py',                                         depth: 2, full: 'lambda/list-recent-docs/handler.py' },
    { path: 'requirements.txt',                                   depth: 2, full: 'lambda/list-recent-docs/requirements.txt' },
    { path: 'tests/unit/',                                        depth: 1, dir: true },
    { path: 'test_list_recent_docs.py',                           depth: 2, full: 'lambda/tests/unit/test_list_recent_docs.py' },
    { path: 'terraform/',                                         depth: 0, dir: true },
    { path: 'lambda.tf',                                          depth: 1, full: 'terraform/lambda.tf' },
  ];

  return (
    <div style={{
      width: 300,
      background: oo.surface,
      border: `1px solid ${oo.border}`,
      borderRadius: 10,
      padding: 12,
      fontFamily: oo.mono,
      fontSize: 12,
      ...style,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 10, color: oo.textDim,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: 10,
      }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M1 4a1 1 0 011-1h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" stroke={oo.textDim} strokeWidth="1.3"/>
        </svg>
        ai-assist
      </div>
      {tree.map((n, i) => {
        const written = n.full && writtenFiles.has(n.full);
        const current = n.full && currentFile === n.full;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            paddingLeft: n.depth * 14,
            padding: `3px 0 3px ${n.depth * 14}px`,
            color: n.dir ? oo.textDim : written ? oo.success : current ? oo.accent : oo.textFaint,
            background: current ? oo.accentBg : 'transparent',
            borderRadius: 4,
            marginLeft: current ? -4 : 0, marginRight: current ? -4 : 0,
            paddingLeft: (current ? 4 : 0) + (n.depth * 14),
            paddingRight: current ? 4 : 0,
            transition: 'color 200ms, background 200ms',
          }}>
            {n.dir ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 2.5a.5.5 0 01.5-.5h2l1 1h4a.5.5 0 01.5.5v4.5a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-5.5z" fill="currentColor" opacity="0.5"/>
              </svg>
            ) : written ? (
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke={oo.success} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <span style={{ width: 10, height: 10, display: 'inline-block' }} />
            )}
            <span style={{ fontWeight: current ? 600 : 400 }}>{n.path}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── GitHub PR view ─────────────────────────────────────────────────────────

const GithubPR = ({ checksState = 'pending', checksCompleted = 0, style }) => {
  const checks = [
    { name: 'ADR Compliance',              detail: 'ADR-004 · ADR-005 · ADR-006 · ADR-012 — all satisfied' },
    { name: 'Test Coverage',               detail: '8 unit tests · 94% coverage · handler + edge cases' },
    { name: 'Breaking Changes',            detail: 'No modified public handlers · additive only' },
    { name: 'Architectural Duplication',   detail: 'No overlapping handlers in lambda/' },
    { name: 'README Freshness',            detail: 'lambda/list-recent-docs/README.md updated' },
    { name: 'License Compliance',          detail: '14 deps scanned · MIT / Apache-2.0 only' },
  ];

  return (
    <div style={{
      width: 640,
      background: oo.ghBg,
      border: `1px solid ${oo.ghBorder}`,
      borderRadius: 12,
      fontFamily: oo.sans,
      color: oo.gh,
      overflow: 'hidden',
      boxShadow: '0 20px 60px -20px rgba(0,0,0,0.8)',
      ...style,
    }}>
      {/* Top */}
      <div style={{ padding: '14px 20px 12px', borderBottom: `1px solid ${oo.ghBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#8B949E' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#8B949E">
            <path d="M8 0a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.22.48-2.69-1.07-2.69-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.23 1.87.87 2.33.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.03 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.28.24.54.72.54 1.45v2.15c0 .21.15.46.55.38A8 8 0 008 0z"/>
          </svg>
          outcome-ops / ai-assist
        </div>
        <h3 style={{ margin: '8px 0 8px', fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em' }}>
          [Lambda] Add list-recent-docs handler for KB verification <span style={{ color: '#8B949E', fontWeight: 400 }}>#47</span>
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 99,
            background: '#238636', color: '#fff',
            fontSize: 11, fontWeight: 600,
          }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="#fff"><path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/></svg>
            Open
          </span>
          <span style={{ color: '#8B949E', fontSize: 13 }}>
            <b style={{ color: oo.gh }}>outcome-ops-bot</b> wants to merge <b style={{ color: oo.gh }}>1 commit</b> into <span style={{ fontFamily: oo.mono, fontSize: 12, background: '#30363D', padding: '2px 6px', borderRadius: 4 }}>main</span> from <span style={{ fontFamily: oo.mono, fontSize: 12, background: '#30363D', padding: '2px 6px', borderRadius: 4 }}>42-cpe-42-lambda-...</span>
          </span>
        </div>
      </div>

      {/* Summary row */}
      <div style={{
        display: 'flex', gap: 24,
        padding: '12px 20px',
        background: '#0D1117',
        borderBottom: `1px solid ${oo.ghBorder}`,
        fontFamily: oo.mono, fontSize: 12,
      }}>
        <span style={{ color: '#8B949E' }}><b style={{ color: oo.gh }}>5</b> files changed</span>
        <span style={{ color: oo.ghGreen }}>+342</span>
        <span style={{ color: oo.ghRed }}>−0</span>
        <div style={{ flex: 1 }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: oo.accent, fontWeight: 600,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke={oo.accent} strokeWidth="1.5"/>
            <path d="M4 6l1.5 1.5L8 4.5" stroke={oo.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Generated by OutcomeOps
        </span>
      </div>

      {/* Checks / PR Analyzer comments */}
      <div style={{ padding: '14px 20px 18px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12, color: '#8B949E',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 10,
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#8B949E" strokeWidth="1.3"/>
            <path d="M5 8l2 2 4-4" stroke="#8B949E" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          PR Analyzer · {checksCompleted} / {checks.length} checks
        </div>
        {checks.map((c, i) => {
          const done = i < checksCompleted;
          const running = i === checksCompleted && checksState === 'running';
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px',
              borderBottom: i < checks.length - 1 ? `1px solid ${oo.ghBorder}` : 'none',
              opacity: done || running ? 1 : 0.35,
              transition: 'opacity 250ms',
            }}>
              {done ? (
                <div style={{
                  width: 20, height: 20, borderRadius: 10,
                  background: '#238636',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              ) : running ? (
                <div style={{
                  width: 20, height: 20, borderRadius: 10,
                  border: `2px solid ${oo.warn}`,
                  borderTopColor: 'transparent',
                  animation: 'ooSpin 0.8s linear infinite',
                }} />
              ) : (
                <div style={{
                  width: 20, height: 20, borderRadius: 10,
                  border: `1px solid ${oo.ghBorder}`,
                }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: oo.gh }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#8B949E', marginTop: 1, fontFamily: oo.mono }}>{c.detail}</div>
              </div>
              {done && <span style={{ fontSize: 11, color: oo.ghGreen, fontWeight: 600, fontFamily: oo.mono }}>PASS</span>}
              {running && <span style={{ fontSize: 11, color: oo.warn, fontWeight: 600, fontFamily: oo.mono }}>running…</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Connector line between two points (SVG) ───────────────────────────────

const Connector = ({ x1, y1, x2, y2, color = oo.borderHi, width = 2, dashed = false, flow = 0, style }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', ...style }}>
      <defs>
        <marker id={`arrow-${color.replace('#', '')}`} viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={width}
        strokeDasharray={dashed ? '6 6' : undefined}
        markerEnd={`url(#arrow-${color.replace('#', '')})`}
      />
      {flow > 0 && (
        <circle r="4" fill={color}>
          <animateMotion dur={`${1.2 / flow}s`} repeatCount="indefinite"
            path={`M ${x1} ${y1} L ${x2} ${y2}`} />
        </circle>
      )}
    </svg>
  );
};

// ── Section label (screen title) ──────────────────────────────────────────

const SceneLabel = ({ number, title, subtitle, x = 60, y = 60 }) => (
  <div style={{ position: 'absolute', left: x, top: y, fontFamily: oo.sans, color: oo.text }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: oo.mono, fontSize: 11,
      color: oo.accent, letterSpacing: '0.12em', textTransform: 'uppercase',
      marginBottom: 8,
    }}>
      <span style={{
        padding: '3px 8px', borderRadius: 4,
        background: oo.accentBg,
        border: `1px solid ${oo.accent}40`,
      }}>{number}</span>
      {subtitle}
    </div>
    <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05, maxWidth: 780 }}>
      {title}
    </div>
  </div>
);

// ── Background grid + vignette ────────────────────────────────────────────

const StageBackdrop = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {/* Grid */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `linear-gradient(${oo.border}30 1px, transparent 1px), linear-gradient(90deg, ${oo.border}30 1px, transparent 1px)`,
      backgroundSize: '48px 48px',
      maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
      WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
    }} />
    {/* Subtle radial glow */}
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      width: 900, height: 900,
      transform: 'translate(-50%, -50%)',
      background: 'radial-gradient(circle, rgba(90,169,255,0.08), transparent 70%)',
      pointerEvents: 'none',
    }} />
  </div>
);

// ── Caption (bottom-of-stage narrator line) ───────────────────────────────

const Caption = ({ text, style }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, bottom: 56,
    display: 'flex', justifyContent: 'center',
    pointerEvents: 'none',
    ...style,
  }}>
    <div style={{
      padding: '10px 20px',
      background: 'rgba(10,16,32,0.85)',
      backdropFilter: 'blur(8px)',
      border: `1px solid ${oo.border}`,
      borderRadius: 8,
      fontFamily: oo.sans, fontSize: 18, fontWeight: 500,
      color: oo.text,
      letterSpacing: '-0.005em',
      maxWidth: 960,
      textAlign: 'center',
      lineHeight: 1.4,
    }}>
      {text}
    </div>
  </div>
);

// ── Brand lockup (opening/closing) ────────────────────────────────────────

const BrandMark = ({ size = 48 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 0 1px ${oo.border}, 0 8px 24px -8px rgba(90,169,255,0.4)`,
      flexShrink: 0,
    }}>
      <img
        src="outcomeops_mark.png"
        alt="OutcomeOps"
        style={{
          width: '120%', height: '120%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
    <div>
      <div style={{ fontFamily: oo.sans, fontSize: size * 0.45, fontWeight: 700, color: oo.text, letterSpacing: '-0.02em', lineHeight: 1 }}>
        OutcomeOps
      </div>
      <div style={{ fontFamily: oo.mono, fontSize: size * 0.22, color: oo.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>
        AI Assist
      </div>
    </div>
  </div>
);

// ── Export to window ──────────────────────────────────────────────────────

Object.assign(window, {
  oo,
  Card, Chip, Dot, WindowChrome,
  JiraTicket, LambdaNode, AdrChip,
  PlanDocument, SqsQueue, FileTree,
  GithubPR, Connector,
  SceneLabel, StageBackdrop, Caption, BrandMark,
});
