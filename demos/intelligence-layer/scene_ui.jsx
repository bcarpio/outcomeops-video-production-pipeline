// scene_ui.jsx — primitives for "The Layer Underneath" (intelligence-layer)
//
// Visual hero is the Saturn ring: a tilted ellipse with 5 department nodes
// orbiting around a central substrate sphere. The ring is rendered via
// 2D ellipse projection (not literal CSS 3D transforms) — semi-minor axis
// = R * cos(tilt) — which gives the same visual depth with much cleaner
// control over node z-order, scale, and counter-rotation.

const oo = {
  bg:        '#050812',
  bgPanel:   '#0A1020',
  surface:   '#141C30',
  border:    '#273354',
  borderHi:  '#3A4A78',
  text:      '#E6EBF5',
  textDim:   '#8A96B4',
  textFaint: '#5A6686',
  textGhost: '#3A4358',
  accent:    '#5AA9FF',
  accentBg:  'rgba(90,169,255,0.12)',
  cyan:      '#22D3EE',
  cyanBg:    'rgba(34,211,238,0.12)',
  amber:     '#FBBF24',
  amberBg:   'rgba(251,191,36,0.12)',
  red:       '#F87171',
  redBg:     'rgba(248,113,113,0.12)',
  green:     '#4ADE80',
  greenBg:   'rgba(74,222,128,0.12)',
  violet:    '#A78BFA',
  violetBg:  'rgba(167,139,250,0.12)',
  mono:      "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  sans:      "'Inter', system-ui, -apple-system, sans-serif",
};

// Five departments — each queries the same substrate from its own angle.
const DEPARTMENTS = [
  {
    id: 'security',     name: 'Security',     color: oo.red,    bg: oo.redBg,
    icon: 'shield',
    question: 'Which services still call the deprecated auth library?',
  },
  {
    id: 'engineering',  name: 'Engineering',  color: oo.cyan,   bg: oo.cyanBg,
    icon: 'brackets',
    question: 'How do app_a and app_b actually interact?',
  },
  {
    id: 'architecture', name: 'Architecture', color: oo.violet, bg: oo.violetBg,
    icon: 'sitemap',
    question: 'Hybrid migration — which integration patterns survive the split?',
  },
  {
    id: 'support',      name: 'Support',      color: oo.green,  bg: oo.greenBg,
    icon: 'lifesaver',
    question: 'Datadog alert fired. Pull the runbook and the last related incident.',
  },
  {
    id: 'product',      name: 'Product',      color: oo.amber,  bg: oo.amberBg,
    icon: 'lightbulb',
    question: 'Is the data model capable of supporting feature X?',
  },
];

// ── Tiny icon set ───────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = 'currentColor', sw = 1.6 }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
                  stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'shield':    return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'brackets':  return <svg {...props}><path d="M8 4l-5 8 5 8"/><path d="M16 4l5 8-5 8"/><path d="M14 4l-4 16"/></svg>;
    case 'sitemap':   return <svg {...props}><rect x="9" y="2" width="6" height="5" rx="1"/><rect x="3" y="17" width="6" height="5" rx="1"/><rect x="15" y="17" width="6" height="5" rx="1"/><path d="M12 7v3M12 10H6v7M12 10h6v7"/></svg>;
    case 'lifesaver': return <svg {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M9.17 14.83l-4.24 4.24"/></svg>;
    case 'lightbulb': return <svg {...props}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.6V17h8v-2.4A7 7 0 0 0 12 2z"/></svg>;
    default: return null;
  }
};

// ── Stage backdrop: grid + edge-fade + subtle center glow ──────────────────
// Lifted from demos/jira-to-pr -- that backdrop reads crisp in the export
// because the grid pattern itself is the dominant texture; the eye locks on
// the lines, not on quantization noise in flat color. Edge-fade mask keeps
// the grid from feeling rigid; the soft accent-blue glow centers visual
// weight where the substrate sphere sits.
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

// ── Wordmark (top-right, subtle) ────────────────────────────────────────────
// Image is sized 120% of the 32px container (zooming past the PNG's
// internal padding) and absolutely positioned to TRULY center inside the
// circle. The prior version let the img default to top-left placement,
// which shifted the visible portion bottom-right and exposed white at
// the top-left corner.
const Wordmark = ({ opacity = 0.85 }) => (
  <div style={{
    position: 'absolute', top: 40, right: 60,
    display: 'flex', alignItems: 'center', gap: 10,
    opacity, pointerEvents: 'none',
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', background: '#fff',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.18)',
      position: 'relative',
    }}>
      <img src="outcomeops_mark.png" alt="" style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120%', height: '120%', objectFit: 'cover', display: 'block',
      }}/>
    </div>
    <div style={{ fontFamily: oo.sans, fontWeight: 700, fontSize: 17, color: oo.text, letterSpacing: '-0.01em' }}>OutcomeOps</div>
  </div>
);

// ── Question card (cascade beat) ────────────────────────────────────────────
// A floating chat-bubble-ish card with role tag + question.
const QuestionCard = ({ dept, opacity = 1, ty = 0, scale = 1, style }) => (
  <div style={{
    display: 'inline-flex', flexDirection: 'column', gap: 8,
    padding: '14px 20px',
    background: oo.bgPanel,
    border: `1px solid ${dept.color}55`,
    borderRadius: 14,
    boxShadow: `0 0 0 1px ${dept.color}22 inset`,
    opacity, transform: `translateY(${ty}px) scale(${scale})`,
    fontFamily: oo.sans,
    maxWidth: 520,
    ...style,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8,
        background: dept.bg, border: `1px solid ${dept.color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: dept.color,
      }}>
        <Icon name={dept.icon} size={14} color={dept.color}/>
      </div>
      <span style={{
        fontFamily: oo.mono, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em',
        color: dept.color, textTransform: 'uppercase',
      }}>{dept.name}</span>
    </div>
    <div style={{
      fontFamily: oo.sans, fontSize: 19, fontWeight: 500, color: oo.text,
      lineHeight: 1.35, letterSpacing: '-0.005em',
    }}>{dept.question}</div>
  </div>
);

// ── Substrate core — the central sphere ─────────────────────────────────────
// Ruthlessly simplified to match the thumbnail's crispness. No outer halo,
// no soft glow, no large box-shadow blur -- those all band visibly under
// H.264's 8-bit YUV quantization at the gradient transitions. Just the
// sphere itself (a small radial gradient creates the 3D shading) with a
// solid 1px highlight ring and an inner detail ring for visual interest.
// Pulse is done via opacity on the whole component so the crisp edges
// stay crisp through every frame.
const SubstrateCore = ({ cx, cy, r = 110, opacity = 1, pulse = true }) => {
  const pulseStyle = pulse
    ? { animation: 'ilCorePulse 4.2s ease-in-out infinite' }
    : {};
  return (
    <div style={{
      position: 'absolute',
      left: cx - r * 1.2, top: cy - r * 1.2,
      width: r * 2.4, height: r * 2.4,
      pointerEvents: 'none',
      opacity,
    }}>
      {/* Sphere — small radial gradient for 3D illusion. No halo, no blur. */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: r * 1.6, height: r * 1.6, transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 32%, #C2EFFF 0%, ${oo.cyan} 30%, #1B7FA8 75%, #0D3F58 100%)`,
        ...pulseStyle,
      }}/>
      {/* Crisp 1px highlight ring around sphere edge */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: r * 1.6, height: r * 1.6, transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: `1px solid ${oo.cyan}`,
        opacity: 0.5,
      }}/>
      {/* Subtle inner detail ring */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: r * 1.0, height: r * 1.0, transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: `1px solid rgba(255,255,255,0.25)`,
        opacity: 0.6,
      }}/>
    </div>
  );
};

// ── Department node — sits on the Saturn ring ──────────────────────────────
// `front` controls scale + opacity (front nodes larger and brighter,
// back nodes smaller and dimmer) for atmospheric depth.
const DepartmentNode = ({ dept, front = 1, lit = 1, x, y, scale = 1 }) => {
  // front: -1 (back) .. +1 (front). Map to depth-based scale + opacity.
  const depth = (front + 1) / 2;           // 0 .. 1
  const sizeMul = 0.82 + depth * 0.28;     // back nodes 82% size, front 110%
  const opMul   = 0.55 + depth * 0.45;     // back 55% opacity, front 100%
  const size = 88 * sizeMul * scale;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(-50%, -50%)`,
      opacity: lit * opMul,
      pointerEvents: 'none',
    }}>
      {/* Tile -- crisp solid panel, no soft halo, no blurred drop shadow */}
      <div style={{
        width: size, height: size,
        background: oo.bgPanel,
        border: `1.5px solid ${dept.color}`,
        borderRadius: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 6,
        boxShadow: `0 0 0 1px ${dept.color}33`,
      }}>
        <Icon name={dept.icon} size={size * 0.32} color={dept.color} sw={1.7}/>
        <div style={{
          fontFamily: oo.mono, fontSize: size * 0.13, fontWeight: 700,
          color: dept.color, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{dept.name}</div>
      </div>
    </div>
  );
};

// ── Saturn ring — tilted ellipse with 5 department nodes ───────────────────
//
// Props:
//   cx, cy   — ring center on canvas
//   r        — ring radius (semi-major)
//   tiltDeg  — perspective tilt (default 25°)
//   angle    — current rotation around ring axis (radians) — driver for slow spin
//   reveal   — 0..1 ring stroke draw-in progress
//   lit      — array [s, e, a, sp, p] of per-department reveal 0..1
//   particles — boolean; if true, render particles flowing into core
const SaturnRing = ({
  cx, cy, r = 320, tiltDeg = 25, angle = 0,
  reveal = 1, lit = [1,1,1,1,1], particles = false,
}) => {
  const cosT = Math.cos(tiltDeg * Math.PI / 180);
  const sinT = Math.sin(tiltDeg * Math.PI / 180);
  const ry = r * cosT;

  // Compute each department's 2D screen position + depth indicator
  const nodes = DEPARTMENTS.map((dept, i) => {
    const phi = angle + (i / DEPARTMENTS.length) * 2 * Math.PI;
    const px = cx + Math.cos(phi) * r;
    const py = cy + Math.sin(phi) * ry;
    // "front" (+1) when sin(phi)*sinT is positive (toward camera below center)
    // Because we tilted the ring forward, the BOTTOM half (positive y offset) is closer.
    const front = Math.sin(phi);
    return { dept, x: px, y: py, front, phi, lit: lit[i] };
  });

  // Sort by depth so front nodes render on top
  const sortedNodes = [...nodes].sort((a, b) => a.front - b.front);

  // Particle paths from each lit department into the core.
  // SVG path strings going from (px, py) to (cx, cy).
  const particlePaths = particles
    ? nodes.filter(n => n.lit > 0.6).map((n, i) => ({
        id: `il-part-${n.dept.id}`,
        d: `M ${n.x} ${n.y} Q ${(n.x + cx) / 2} ${(n.y + cy) / 2 - 20} ${cx} ${cy}`,
        color: n.dept.color,
        delay: i * 0.4,
      }))
    : [];

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Ring stroke -- solid color, no gradient. Gradients on a 2px stroke
          at low alpha quantize badly under H.264 and look fuzzy. */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        <ellipse cx={cx} cy={cy} rx={r} ry={ry}
          stroke={oo.cyan} strokeOpacity="0.7" strokeWidth="2" fill="none"
          strokeDasharray={`${2 * Math.PI * Math.sqrt((r * r + ry * ry) / 2)} 9999`}
          strokeDashoffset={`${2 * Math.PI * Math.sqrt((r * r + ry * ry) / 2) * (1 - reveal)}`}
          style={{ transition: 'stroke-dashoffset 350ms ease' }}
        />
        {/* Particle paths */}
        {particles && particlePaths.map((p, i) => (
          <React.Fragment key={p.id}>
            <path id={p.id} d={p.d} fill="none" stroke="none"/>
            {[0, 0.33, 0.66].map((off, j) => (
              <circle key={j} r="3" fill={p.color}>
                <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${p.delay + j * 0.8}s`}>
                  <mpath xlinkHref={`#${p.id}`}/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1"
                  dur="2.4s" repeatCount="indefinite" begin={`${p.delay + j * 0.8}s`}/>
              </circle>
            ))}
          </React.Fragment>
        ))}
      </svg>

      {/* Department nodes (HTML, z-ordered by depth) */}
      {sortedNodes.map(n => (
        <DepartmentNode key={n.dept.id}
          dept={n.dept} x={n.x} y={n.y} front={n.front} lit={n.lit}
        />
      ))}
    </div>
  );
};

// ── AI coding agents (inner orbit) ─────────────────────────────────────────
// The substrate isn't just for humans. Cursor, Claude Code, Copilot all
// pull from the same corpus -- this is the antithesis of the local
// optimization trap (every team running its own private context).
// Visual: dashed inner ring at ~60% the radius of the human Saturn ring,
// with 3 named pills. Counter-rotates slowly for visual differentiation.
const AI_AGENTS = [
  { id: 'cursor',      name: 'Cursor' },
  { id: 'claude-code', name: 'Claude Code' },
  { id: 'copilot',     name: 'Copilot' },
];

const AIAgentPill = ({ agent, front = 1, lit = 1, x, y }) => {
  const depth = (front + 1) / 2;
  const sizeMul = 0.85 + depth * 0.25;
  const opMul   = 0.55 + depth * 0.45;
  const padH = 16 * sizeMul;
  const padV = 7  * sizeMul;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: 'translate(-50%, -50%)',
      opacity: lit * opMul,
      pointerEvents: 'none',
    }}>
      {/* pill -- crisp solid, no halo, no blurred shadow */}
      <div style={{
        background: oo.bgPanel,
        border: `1.4px solid ${oo.accent}`,
        borderRadius: 999,
        padding: `${padV}px ${padH}px`,
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: `0 0 0 1px ${oo.accent}33`,
      }}>
        <div style={{
          width: 8 * sizeMul, height: 8 * sizeMul, borderRadius: '50%',
          background: oo.accent, flexShrink: 0,
        }}/>
        <div style={{
          fontFamily: oo.mono, fontSize: 13 * sizeMul, fontWeight: 600,
          color: oo.text, letterSpacing: '0.04em', whiteSpace: 'nowrap',
        }}>{agent.name}</div>
      </div>
    </div>
  );
};

const AIAgentRing = ({
  cx, cy, r = 190, tiltDeg = 25, angle = 0, baseAngle = Math.PI / 6,
  reveal = 1, lit = [1, 1, 1],
}) => {
  const cosT = Math.cos(tiltDeg * Math.PI / 180);
  const ry = r * cosT;

  const nodes = AI_AGENTS.map((agent, i) => {
    const phi = angle + baseAngle + (i / AI_AGENTS.length) * 2 * Math.PI;
    const px = cx + Math.cos(phi) * r;
    const py = cy + Math.sin(phi) * ry;
    const front = Math.sin(phi);
    return { agent, x: px, y: py, front, lit: lit[i] };
  });
  const sortedNodes = [...nodes].sort((a, b) => a.front - b.front);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: reveal }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Dashed inner ring -- visually distinct from the solid outer ring */}
        <ellipse cx={cx} cy={cy} rx={r} ry={ry}
          stroke={oo.accent} strokeOpacity="0.55" strokeWidth="1.5" fill="none"
          strokeDasharray="6 5"
        />
      </svg>
      {sortedNodes.map(n => (
        <AIAgentPill key={n.agent.id}
          agent={n.agent} x={n.x} y={n.y} front={n.front} lit={n.lit}
        />
      ))}
    </div>
  );
};

// ── Brand lockup (for CTA close beat) ──────────────────────────────────────
const BrandLockup = ({ size = 62 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 0 1px ${oo.border}`,
      flexShrink: 0,
    }}>
      <img src="outcomeops_mark.png" alt="OutcomeOps"
           style={{ width: '120%', height: '120%', objectFit: 'cover', display: 'block' }}/>
    </div>
    <div>
      <div style={{ fontFamily: oo.sans, fontSize: size * 0.46, fontWeight: 700, color: oo.text, letterSpacing: '-0.02em', lineHeight: 1 }}>OutcomeOps</div>
      <div style={{ fontFamily: oo.mono, fontSize: size * 0.22, color: oo.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>The Layer Underneath</div>
    </div>
  </div>
);

// ── Scene label (small beat-index tag, top-left, optional) ─────────────────
const SceneLabel = ({ number, subtitle, color = oo.cyan, opacity = 1 }) => (
  <div style={{
    position: 'absolute', left: 70, top: 50,
    fontFamily: oo.mono, fontSize: 12, fontWeight: 600,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: oo.textDim, opacity, pointerEvents: 'none',
    display: 'flex', alignItems: 'center', gap: 10,
  }}>
    <span style={{
      padding: '3px 9px', borderRadius: 5,
      background: `${color}1a`, border: `1px solid ${color}55`,
      color, fontWeight: 700,
    }}>{number}</span>
    <span>{subtitle}</span>
  </div>
);

// ── Pillar primitives ──────────────────────────────────────────────────────
// Reusable building blocks for the 5 pillar micro-visuals (Beat 4).

// PillarHeader — appears at top of frame for each pillar beat.
const PillarHeader = ({ number, title, sub, color = oo.cyan, opacity = 1, ty = 0 }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, top: 70,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    opacity, transform: `translateY(${ty}px)`,
    pointerEvents: 'none',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
      <span style={{
        fontFamily: oo.mono, fontSize: 13, fontWeight: 700,
        letterSpacing: '0.16em',
        padding: '5px 12px', borderRadius: 6,
        background: `${color}1a`, border: `1px solid ${color}55`,
        color,
      }}>PILLAR 0{number}</span>
      <span style={{
        fontFamily: oo.sans, fontSize: 32, fontWeight: 700, color: oo.text,
        letterSpacing: '-0.02em',
      }}>{title}</span>
    </div>
    {sub && (
      <div style={{
        fontFamily: oo.sans, fontSize: 16, fontWeight: 400, color: oo.textDim,
        letterSpacing: '-0.005em',
      }}>{sub}</div>
    )}
  </div>
);

// StandardCard — small monospace card for ADRs/runbooks/standards (P1).
const StandardCard = ({ label, title, color = oo.cyan, style }) => (
  <div style={{
    display: 'inline-flex', flexDirection: 'column', gap: 5,
    padding: '11px 16px',
    background: oo.bgPanel,
    border: `1px solid ${color}55`,
    borderRadius: 10,
    boxShadow: `inset 0 0 0 1px ${color}22`,
    minWidth: 260,
    ...style,
  }}>
    <div style={{
      fontFamily: oo.mono, fontSize: 10.5, fontWeight: 700, color,
      letterSpacing: '0.12em', textTransform: 'uppercase',
    }}>{label}</div>
    <div style={{
      fontFamily: oo.sans, fontSize: 15, fontWeight: 500, color: oo.text,
      letterSpacing: '-0.005em',
    }}>{title}</div>
  </div>
);

// SourceSystemsPanel — the disparate origin systems whose artifacts feed the
// corpus (Pillar 1). Before the standards cards stream toward the substrate,
// this panel makes explicit that the corpus is fed by GitHub, Confluence,
// Jira, SharePoint -- not authored from scratch in OutcomeOps. Each chip
// uses the source vendor's brand color so the read is instant.
const SourceSystemsPanel = ({ opacity = 1, style }) => {
  const sources = [
    { name: 'GitHub',     mono: '#FFFFFF', bg: '#1A1F26', mark: 'GH' },
    { name: 'Confluence', mono: '#0052CC', bg: '#0E1B36', mark: 'C'  },
    { name: 'Jira',       mono: '#0052CC', bg: '#0E1B36', mark: 'J'  },
    { name: 'SharePoint', mono: '#038387', bg: '#0A1F24', mark: 'S'  },
  ];
  return (
    <div style={{
      width: 230, padding: '14px 14px 16px',
      background: oo.surface,
      border: `1px solid ${oo.border}`,
      borderRadius: 12,
      opacity, fontFamily: oo.sans,
      ...style,
    }}>
      <div style={{
        fontFamily: oo.mono, fontSize: 11, fontWeight: 700,
        color: oo.textDim, letterSpacing: '0.14em',
        textTransform: 'uppercase', marginBottom: 11,
      }}>Source systems</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sources.map(s => (
          <div key={s.name} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '7px 10px',
            background: s.bg,
            border: `1px solid ${oo.border}`,
            borderRadius: 8,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 5,
              background: s.mono === '#FFFFFF' ? '#FFFFFF' : s.mono,
              color: s.mono === '#FFFFFF' ? '#1A1F26' : '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: oo.mono, fontSize: 11, fontWeight: 800,
            }}>{s.mark}</div>
            <div style={{
              fontFamily: oo.sans, fontSize: 14, fontWeight: 600,
              color: oo.text, letterSpacing: '-0.005em',
            }}>{s.name}</div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 11, fontFamily: oo.mono, fontSize: 10, color: oo.textFaint,
        letterSpacing: '0.04em', textAlign: 'center',
      }}>indexed into the corpus</div>
    </div>
  );
};

// ConfluencePagePlaceholder — represents the "wiki" that's just one input.
const ConfluencePagePlaceholder = ({ opacity = 1, style }) => (
  <div style={{
    width: 260, padding: '14px 16px',
    background: oo.surface,
    border: `1px solid ${oo.border}`,
    borderRadius: 10,
    opacity,
    fontFamily: oo.sans,
    ...style,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
      <div style={{
        width: 18, height: 18, borderRadius: 4,
        background: '#0052CC',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 11, fontWeight: 700,
      }}>C</div>
      <div style={{ fontSize: 11, color: oo.textFaint, fontWeight: 600, letterSpacing: '0.04em' }}>CONFLUENCE</div>
    </div>
    <div style={{ height: 6, width: '85%', borderRadius: 3, background: oo.borderHi, marginBottom: 5 }}/>
    <div style={{ height: 6, width: '92%', borderRadius: 3, background: oo.borderHi, marginBottom: 5 }}/>
    <div style={{ height: 6, width: '78%', borderRadius: 3, background: oo.borderHi, marginBottom: 5 }}/>
    <div style={{ height: 6, width: '70%', borderRadius: 3, background: oo.borderHi }}/>
    <div style={{
      marginTop: 11, fontFamily: oo.mono, fontSize: 10, color: oo.textFaint,
      letterSpacing: '0.04em',
    }}>one input · not the source of truth</div>
  </div>
);

// DocCodeCompare — side-by-side cards for Pillar 2.
//
// Layout: two cards stacked horizontally; a clean verdict pill flows BELOW
// them when verdictOp > 0. No glow-bomb badge stamped over the content —
// the pill matches the channel's editorial design language (like the
// "Grounded in your own standards" pill in refactor-blast-radius).
const DocCodeCompare = ({ docOp = 1, codeOp = 1, verdictOp = 0, style }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
    ...style,
  }}>
    {/* Two cards side by side */}
    <div style={{ display: 'flex', gap: 36, alignItems: 'center', justifyContent: 'center' }}>
      {/* DOC card */}
      <div style={{
        width: 380, opacity: docOp,
        background: oo.bgPanel,
        border: `1px solid ${oo.amber}77`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: `inset 0 0 0 1px ${oo.amber}22`,
      }}>
        <div style={{
          padding: '10px 14px',
          background: 'rgba(251,191,36,0.10)',
          borderBottom: `1px solid ${oo.amber}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: oo.mono, fontSize: 11, color: oo.amber, fontWeight: 700, letterSpacing: '0.1em' }}>DOC</span>
          <span style={{
            fontFamily: oo.mono, fontSize: 10, fontWeight: 700,
            padding: '3px 8px', borderRadius: 4,
            background: 'rgba(248,113,113,0.18)', color: oo.red,
            border: `1px solid ${oo.red}66`, letterSpacing: '0.06em',
          }}>STALE · 2 YRS</span>
        </div>
        <div style={{ padding: '18px 18px' }}>
          <div style={{
            fontFamily: oo.mono, fontSize: 17, color: oo.text,
            padding: '8px 12px', background: oo.bg, borderRadius: 6,
          }}>count = 100</div>
          <div style={{ fontFamily: oo.mono, fontSize: 11, color: oo.textFaint, marginTop: 10 }}>
            confluence · last updated 2023
          </div>
        </div>
      </div>

      {/* CODE card */}
      <div style={{
        width: 380, opacity: codeOp,
        background: oo.bgPanel,
        border: `1px solid ${oo.green}77`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: `inset 0 0 0 1px ${oo.green}22`,
      }}>
        <div style={{
          padding: '10px 14px',
          background: 'rgba(74,222,128,0.10)',
          borderBottom: `1px solid ${oo.green}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: oo.mono, fontSize: 11, color: oo.green, fontWeight: 700, letterSpacing: '0.1em' }}>CODE</span>
          <span style={{
            fontFamily: oo.mono, fontSize: 10, fontWeight: 700,
            padding: '3px 8px', borderRadius: 4,
            background: 'rgba(74,222,128,0.18)', color: oo.green,
            border: `1px solid ${oo.green}66`, letterSpacing: '0.06em',
          }}>CURRENT</span>
        </div>
        <div style={{ padding: '18px 18px' }}>
          <div style={{
            fontFamily: oo.mono, fontSize: 17, color: oo.text,
            padding: '8px 12px', background: oo.bg, borderRadius: 6,
          }}>
            <span style={{ color: '#9CDCFE' }}>count</span>
            <span style={{ color: oo.text }}>: </span>
            <span style={{ color: '#4EC9B0' }}>Decimal</span>
            <span style={{ color: oo.text }}>(</span>
            <span style={{ color: '#CE9178' }}>'100'</span>
            <span style={{ color: oo.text }}>)</span>
          </div>
          <div style={{ fontFamily: oo.mono, fontSize: 11, color: oo.textFaint, marginTop: 10 }}>
            as of commit <span style={{ color: oo.cyan }}>3a4f12</span> · indexed 4h ago
          </div>
        </div>
      </div>
    </div>

    {/* Verdict pill — flows below the cards, no overlap */}
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 14,
      padding: '11px 22px',
      background: 'rgba(74,222,128,0.08)',
      border: `1.5px solid ${oo.green}77`,
      borderRadius: 99,
      opacity: verdictOp, transform: `translateY(${(1 - verdictOp) * 10}px)`,
      fontFamily: oo.sans,
      boxShadow: 'none',
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7.5" fill="rgba(74,222,128,0.12)" stroke={oo.green} strokeWidth="1.3"/>
        <path d="M4.5 8.2 L7 10.5 L11.5 5.5" stroke={oo.green} strokeWidth="1.8" fill="none"
              strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{
        fontSize: 17, fontWeight: 600, color: oo.text, letterSpacing: '-0.005em',
      }}>Code wins</span>
      <span style={{ width: 1, height: 18, background: `${oo.green}55` }}/>
      <span style={{
        fontFamily: oo.mono, fontSize: 12, fontWeight: 600,
        color: oo.green, letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>discrepancy surfaced</span>
    </div>
  </div>
);

// CloudBoundary — dashed box representing customer cloud (P3).
const CloudBoundary = ({ children, label = 'YOUR AWS ACCOUNT', style, opacity = 1 }) => (
  <div style={{
    position: 'relative',
    border: `2px dashed ${oo.cyan}88`,
    borderRadius: 16,
    background: 'rgba(34,211,238,0.03)',
    opacity,
    ...style,
  }}>
    <div style={{
      position: 'absolute', top: -16, left: 20,
      padding: '3px 14px',
      background: oo.bg,
      fontFamily: oo.mono, fontSize: 14, fontWeight: 700,
      color: oo.cyan, letterSpacing: '0.14em',
    }}>{label}</div>
    {children}
  </div>
);

// AuditEntry — single audit log line (P3).
const AuditEntry = ({ time, kind, text, kindColor = oo.cyan, opacity = 1, style }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '7px 16px',
    opacity,
    fontFamily: oo.mono, fontSize: 13,
    ...style,
  }}>
    <span style={{ color: oo.textFaint, width: 60 }}>{time}</span>
    <span style={{
      width: 78, color: kindColor, fontWeight: 700,
      fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
    }}>{kind}</span>
    <span style={{ color: oo.textDim, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
  </div>
);

// IndustryPetal — small workspace/industry node (P4).
const IndustryPetal = ({ name, kb, color = oo.cyan, opacity = 1, x, y, scale = 1 }) => (
  <div style={{
    position: 'absolute', left: x, top: y,
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    pointerEvents: 'none',
  }}>
    <div style={{
      width: 260, padding: '16px 18px',
      background: oo.bgPanel,
      border: `1.5px solid ${color}`,
      borderRadius: 14,
      boxShadow: `0 0 0 1px ${color}33`,
    }}>
      <div style={{
        fontFamily: oo.mono, fontSize: 13, fontWeight: 700, color,
        letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8,
      }}>{name}</div>
      <div style={{ fontFamily: oo.sans, fontSize: 15, color: oo.textDim, lineHeight: 1.4 }}>{kb}</div>
    </div>
  </div>
);

// ISOControlCard — control with clause ID + short description (P5).
const ISOControlCard = ({ clause, title, opacity = 1, style }) => (
  <div style={{
    padding: '11px 16px',
    background: oo.bgPanel,
    border: `1px solid ${oo.green}55`,
    borderRadius: 8,
    fontFamily: oo.sans,
    opacity,
    ...style,
  }}>
    <div style={{
      fontFamily: oo.mono, fontSize: 13, fontWeight: 700, color: oo.green,
      letterSpacing: '0.06em', marginBottom: 4,
    }}>{clause}</div>
    <div style={{ fontSize: 14.5, color: oo.text, lineHeight: 1.25 }}>{title}</div>
  </div>
);

// OutputFormatCard — one of the answer shapes the corpus can produce.
// Same input pipeline, different output formatting per audience.
const OutputFormatCard = ({ name, audience, detail, color = oo.violet, opacity = 1, style }) => (
  <div style={{
    padding: '13px 16px',
    background: oo.bgPanel,
    border: `1px solid ${color}66`,
    borderRadius: 10,
    fontFamily: oo.sans,
    opacity,
    ...style,
  }}>
    <div style={{
      fontFamily: oo.mono, fontSize: 13, fontWeight: 700, color,
      letterSpacing: '0.1em', marginBottom: 5,
    }}>{name}</div>
    <div style={{
      fontSize: 13, color: oo.text, fontWeight: 500,
      marginBottom: 3,
    }}>for {audience}</div>
    <div style={{
      fontFamily: oo.mono, fontSize: 11, color: oo.textFaint,
      letterSpacing: '0.02em',
    }}>{detail}</div>
  </div>
);

// SynthesisCore — the LLM box in P5 that combines streams.
const SynthesisCore = ({ size = 90, label = 'SYNTHESIS', color = oo.cyan, opacity = 1, processing = false, style }) => (
  <div style={{
    width: size, height: size, borderRadius: 16,
    background: 'linear-gradient(180deg, #1B7FA8, #0D3F58)',
    border: `2px solid ${color}`,
    boxShadow: `0 0 0 1px ${color}55`,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 4,
    opacity,
    ...style,
  }}>
    <div style={{
      width: size * 0.4, height: size * 0.4, borderRadius: '50%',
      background: `radial-gradient(circle at 35% 32%, #C2EFFF 0%, ${color} 50%, #1B7FA8 90%)`,
      boxShadow: 'none',
      animation: processing ? 'ilCorePulse 1.4s ease-in-out infinite' : 'none',
    }}/>
    <div style={{
      fontFamily: oo.mono, fontSize: 9, fontWeight: 700, color: color,
      letterSpacing: '0.14em',
    }}>{label}</div>
  </div>
);

// ── CTA close primitives (Beat 9) ──────────────────────────────────────────

// PillarBadge — compact pillar marker used in the Phase A wiring recap.
const PillarBadge = ({ number, title, color = oo.cyan, opacity = 1, scale = 1, style }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    padding: '12px 16px', width: 198,
    background: oo.bgPanel,
    border: `1px solid ${color}55`,
    borderRadius: 12,
    boxShadow: `0 0 0 1px ${color}22`,
    opacity, transform: `scale(${scale})`,
    fontFamily: oo.sans,
    ...style,
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: `${color}1f`, border: `1px solid ${color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: oo.mono, fontSize: 14, fontWeight: 700, color,
    }}>{number}</div>
    <div style={{
      textAlign: 'center', fontSize: 13, fontWeight: 600,
      color: oo.text, lineHeight: 1.25, letterSpacing: '-0.005em',
    }}>{title}</div>
  </div>
);

// CTAChip — differentiator chip ("Code wins over docs" etc.)
const CTAChip = ({ icon, label, color = oo.cyan, opacity = 1, style }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 9,
    padding: '11px 18px',
    background: `${color}10`,
    border: `1px solid ${color}55`,
    borderRadius: 99,
    fontFamily: oo.sans, fontSize: 15, fontWeight: 600,
    color: oo.text, letterSpacing: '-0.005em',
    opacity,
    ...style,
  }}>
    <span style={{ color, display: 'inline-flex', alignItems: 'center' }}>
      {icon}
    </span>
    {label}
  </div>
);

// TrustBoundaryFrame — large dashed boundary around the whole stage,
// labeled "INSIDE YOUR AWS ACCOUNT" at the top edge.
const TrustBoundaryFrame = ({ reveal = 1, opacity = 1 }) => {
  // SVG ellipse path that draws progressively via stroke-dashoffset
  const perim = 4500; // arbitrary, large enough to cover the dasharray budget
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        <rect x={60} y={60} width={1480} height={780} rx={28} ry={28}
          stroke={oo.cyan} strokeWidth="2.5" fill="none"
          strokeDasharray={`10 8`}
          opacity={0.85 * reveal}
          style={{
            strokeDashoffset: (1 - reveal) * perim,
            transition: 'stroke-dashoffset 400ms ease',
          }}/>
      </svg>
      {/* Label badge breaking the top edge */}
      <div style={{
        position: 'absolute', top: 48, left: '50%', transform: 'translateX(-50%)',
        padding: '5px 18px',
        background: oo.bg,
        fontFamily: oo.mono, fontSize: 13, fontWeight: 700,
        color: oo.cyan, letterSpacing: '0.16em',
        opacity: reveal,
      }}>INSIDE YOUR AWS ACCOUNT</div>
      {/* Bedrock micro-badge bottom-right inside boundary */}
      <div style={{
        position: 'absolute', right: 96, bottom: 96,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 12px',
        background: oo.bgPanel,
        border: `1px solid ${oo.amber}55`,
        borderRadius: 8,
        fontFamily: oo.mono, fontSize: 11, color: oo.amber, fontWeight: 700,
        letterSpacing: '0.1em', opacity: reveal,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={oo.amber} strokeWidth="1.8"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6a3 3 0 0 1 4-2.8 3.5 3.5 0 0 1 6.6 1A2.5 2.5 0 0 1 12 11H4a3 3 0 0 1-1-3z"/>
        </svg>
        BEDROCK · IN ACCOUNT
      </div>
    </div>
  );
};

Object.assign(window, {
  oo, DEPARTMENTS, Icon,
  StageBackdrop, Wordmark, SceneLabel,
  QuestionCard, SubstrateCore, DepartmentNode, SaturnRing,
  BrandLockup,
  PillarHeader, StandardCard, ConfluencePagePlaceholder,
  DocCodeCompare, CloudBoundary, AuditEntry,
  IndustryPetal, ISOControlCard, JiraStoryCard, SynthesisCore,
  PillarBadge, CTAChip, TrustBoundaryFrame,
});
