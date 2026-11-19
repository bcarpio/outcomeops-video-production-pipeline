// CUT-RAGVG — RAG vs GRAPH: Why You Need Both (~60s)
// Series 2: Context Engineering Patterns, Video 07.
// Plants the flag: RAG handles meaning, code knowledge graph handles
// wiring. OutcomeOps routes per query and combines them.

function RagVsGraphCut() {
  return (
    <>
      <div style={{ position:'absolute', inset:0, background: OO_COLORS.bg }}/>
      <GridBG opacity={0.03}/>
      <FrameChrome label="CE PATTERNS // 07 — RAG vs GRAPH" index={useSceneIndexRAGVG(SCENES_RAGVG)} total={SCENES_RAGVG.length}/>
      <CornerMarks/>

      <Sprite start={0}     end={3.44}>  <SceneRAGVG1/></Sprite>
      <Sprite start={3.24}  end={22.09}> <SceneRAGVG2/></Sprite>
      <Sprite start={21.89} end={43.41}> <SceneRAGVG3/></Sprite>
      <Sprite start={43.21} end={55.11}> <SceneRAGVG4/></Sprite>
      <Sprite start={54.91} end={64}>    <SceneRAGVG5/></Sprite>
    </>
  );
}

const SCENES_RAGVG = [0, 3.24, 21.89, 43.21, 54.91];
function useSceneIndexRAGVG(breaks) {
  const t = useTime();
  let idx = 1;
  for (let i=0; i<breaks.length; i++) if (t >= breaks[i]) idx = i + 1;
  return idx;
}

function SceneFrame({ children, fadeIn = 0.35, fadeOut = 0.35 }) {
  const { localTime, duration } = useSprite();
  const opIn  = Math.min(1, Math.max(0, localTime / fadeIn));
  const opOut = Math.min(1, Math.max(0, (duration - localTime) / fadeOut));
  const opacity = Math.min(opIn, opOut);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {children}
    </div>
  );
}

// ── SCENE 1 — Hook ───────────────────────────────────────
function SceneRAGVG1() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  return (
    <SceneFrame>
      <SectionNumber n="00" label="THE CLAIM" x={96} y={180}/>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 340,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 144,
        color: OO_COLORS.inkDim, letterSpacing:'-0.04em', lineHeight: 1.0,
        opacity: r(0.1),
      }}>
        RAG is everywhere.
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 540,
        fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 56,
        color: OO_COLORS.inkDim, letterSpacing:'-0.02em',
        opacity: r(1.0),
      }}>
        It's good.
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 660,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 132,
        color: OO_COLORS.ink, letterSpacing:'-0.04em', lineHeight: 1.0,
        opacity: r(1.6),
      }}>
        But it has a <span style={{ color: OO_COLORS.amber }}>blind spot.</span>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 2 — RAG strengths: meaning + code-maps + application graph ──
function SceneRAGVG2() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  return (
    <SceneFrame>
      <SectionNumber n="01" label="WHAT OUTCOMEOPS RAG DOES" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 220, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 76,
        color: OO_COLORS.ink, letterSpacing:'-0.03em', lineHeight: 1.05,
        opacity: r(0),
      }}>
        Matches <span style={{ color: OO_COLORS.cyan }}>meaning.</span>{' '}
        Maps the <span style={{ color: OO_COLORS.cyan }}>application graph.</span>
      </div>

      {/* Three green-check rows: docs + decisions + app graph */}
      <div style={{ position:'absolute', left: 96, right: 96, top: 410 }}>
        {[
          { q: '"What does our auth policy say?"',                a: 'policy.md',                                tag: 'DOC LOOKUP',           delay: 3.5 },
          { q: '"Why did we pick Aurora over RDS?"',              a: 'ADR-014',                                  tag: 'DECISION RATIONALE',   delay: 7.0 },
          { q: '"Which services call the recommendation handler?"', a: 'event-mapper · ingestor · email-builder', tag: 'APPLICATION GRAPH',    delay: 9.5 },
        ].map((row, i) => (
          <div key={i} style={{
            padding: '18px 0',
            borderBottom: `1px solid ${OO_COLORS.rule}`,
            opacity: r(row.delay),
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '52px 1fr auto',
              gap: 24, alignItems: 'center',
            }}>
              <div style={{
                fontFamily: OO_TYPE.mono, fontSize: 32,
                color: OO_COLORS.green, textAlign: 'center',
              }}>✓</div>
              <div style={{
                fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 28,
                color: OO_COLORS.ink, letterSpacing: '-0.01em',
              }}>{row.q}</div>
              <div style={{
                fontFamily: OO_TYPE.mono, fontSize: 11, color: OO_COLORS.cyan,
                letterSpacing: '0.22em', textTransform: 'uppercase',
              }}>{row.tag}</div>
            </div>
            <div style={{
              marginLeft: 76, marginTop: 6,
              fontFamily: OO_TYPE.mono, fontSize: 22,
              color: OO_COLORS.green, letterSpacing: '0.02em',
            }}>→ {row.a}</div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 60,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 30,
        color: OO_COLORS.inkDim, letterSpacing: '-0.015em',
        opacity: r(15.0),
      }}>
        The application graph,{' '}
        <span style={{ color: OO_COLORS.ink }}>reasoned from the docs you've already written.</span>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 3 — Graph = wiring ─────────────────────────────
function SceneRAGVG3() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  // Node positions for the mini graph diagram
  const nodes = [
    { id: 'A', label: 'payments.go',     x: 360,  y: 620, delay: 11.5 },
    { id: 'B', label: 'refunds.go',      x: 760,  y: 540, delay: 12.0 },
    { id: 'C', label: 'validateCard…',   x: 960,  y: 700, delay: 11.0, hub: true },
    { id: 'D', label: 'admin.go',        x: 760,  y: 860, delay: 12.5 },
    { id: 'E', label: 'CardData',        x: 1360, y: 590, delay: 13.0, type: true },
    { id: 'F', label: 'lib/audit',       x: 1360, y: 800, delay: 13.5, type: true },
  ];
  const edges = [
    { from: 'A', to: 'C', label: 'calls',       delay: 14.0 },
    { from: 'B', to: 'C', label: 'calls',       delay: 14.4 },
    { from: 'D', to: 'C', label: 'calls',       delay: 14.8 },
    { from: 'C', to: 'E', label: 'returns',     delay: 15.2 },
    { from: 'C', to: 'F', label: 'emits via',   delay: 15.6 },
  ];

  return (
    <SceneFrame>
      <SectionNumber n="02" label="THE GAP CODE-MAPS LEAVE" x={96} y={120}/>

      {/* Top caveat — code-maps' limits */}
      <div style={{
        position:'absolute', left: 96, right: 96, top: 220,
        padding: '20px 28px',
        background: 'rgba(251,191,36,0.05)',
        border: `1px solid ${OO_COLORS.amber}55`,
        borderRadius: 6,
        opacity: r(0),
      }}>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 12, color: OO_COLORS.amber,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          BUT CODE-MAPS LAG THE SOURCE
        </div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 26,
          color: OO_COLORS.inkDim, letterSpacing: '-0.005em', lineHeight: 1.5,
        }}>
          Won't always list every caller of a shared library, or every class that extends a specific handler.
        </div>
      </div>

      <div style={{
        position:'absolute', left: 96, top: 410,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 64,
        color: OO_COLORS.ink, letterSpacing:'-0.03em', lineHeight: 1.0,
        opacity: r(10),
      }}>
        A code knowledge graph reads the{' '}
        <span style={{ color: OO_COLORS.cyan }}>AST directly.</span>
      </div>

      {/* The mini graph — SVG edges + DIV nodes */}
      <svg style={{ position:'absolute', inset: 0, pointerEvents: 'none' }} width="1920" height="1080">
        {edges.map((e, i) => {
          const from = nodes.find(n => n.id === e.from);
          const to   = nodes.find(n => n.id === e.to);
          if (!from || !to) return null;
          const op = r(e.delay);
          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={OO_COLORS.cyan} strokeWidth={1.5}
                strokeDasharray="6 4"
                opacity={op * 0.6}
              />
              <text
                x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8}
                fill={OO_COLORS.cyan} fontSize={14}
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing="0.16em" textAnchor="middle"
                opacity={op * 0.85}
              >
                {e.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {nodes.map((n, i) => {
        const op = r(n.delay);
        const color = n.hub
          ? OO_COLORS.cyan
          : n.type
            ? OO_COLORS.amber
            : OO_COLORS.ink;
        const bg = n.hub
          ? 'rgba(34,211,238,0.12)'
          : n.type
            ? 'rgba(251,191,36,0.08)'
            : OO_COLORS.bgPanel;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: n.x - 110, top: n.y - 28,
            width: 220, padding: '14px 16px',
            background: bg,
            border: `1.5px solid ${color}`,
            borderRadius: 6,
            fontFamily: OO_TYPE.mono, fontSize: 18, fontWeight: 500,
            color: color, letterSpacing: '0.01em',
            textAlign: 'center',
            opacity: op,
            transform: `scale(${0.85 + op * 0.15})`,
          }}>
            {n.label}
          </div>
        );
      })}

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 60,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 30,
        color: OO_COLORS.ink, letterSpacing: '-0.015em',
        opacity: r(17),
      }}>
        Every caller. Every override. Every consumer —{' '}
        <span style={{ color: OO_COLORS.cyan }}>including the ones nobody documented yet.</span>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 4 — Router picks per query ─────────────────────
function SceneRAGVG4() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  return (
    <SceneFrame>
      <SectionNumber n="03" label="THE ROUTER" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 230, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 80,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', lineHeight: 1.0,
        opacity: r(0),
      }}>
        A classifier picks{' '}
        <span style={{ color: OO_COLORS.cyan }}>per query.</span>
      </div>

      {/* Router decision viz */}
      <div style={{ position:'absolute', left: 96, right: 96, top: 420 }}>
        {[
          {
            q: '"Which services call the recommendation handler?"',
            tag: 'APPLICATION',
            target: 'RAG',
            color: OO_COLORS.cyan,
            delay: 3.5,
          },
          {
            q: '"What extends BaseCardHandler?"',
            tag: 'SPECIFIC SYMBOL',
            target: 'GRAPH',
            color: OO_COLORS.amber,
            delay: 5.0,
          },
          {
            q: '"What\'s the impact of removing validateCardToken?"',
            tag: 'WIRING + CONTEXT',
            target: 'RAG + GRAPH',
            color: OO_COLORS.green,
            delay: 6.5,
          },
        ].map((row, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 200px 220px',
            gap: 32, alignItems: 'center',
            padding: '20px 0',
            borderBottom: `1px solid ${OO_COLORS.rule}`,
            opacity: r(row.delay),
          }}>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 30,
              color: OO_COLORS.ink, letterSpacing: '-0.01em',
            }}>{row.q}</div>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 14,
              color: row.color, letterSpacing: '0.20em',
              textAlign: 'center', textTransform: 'uppercase',
            }}>
              → {row.tag} →
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 28,
              color: row.color, letterSpacing: '-0.01em',
              textAlign: 'right',
            }}>{row.target}</div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 70,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 30,
        color: OO_COLORS.inkDim, letterSpacing: '-0.015em',
      }}>
        <span style={{ opacity: r(8.5) }}>The engineer never sees the routing. </span>
        <span style={{ color: OO_COLORS.ink, fontWeight: 600, opacity: r(9.5) }}>They just get the right answer.</span>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 5 — CTA ────────────────────────────────────────
function SceneRAGVG5() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  return (
    <SceneFrame>
    <div style={{
      position:'absolute', inset: 0,
      display:'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 96px',
    }}>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 64,
        color: OO_COLORS.ink, letterSpacing: '-0.025em', textAlign: 'center',
        opacity: r(0),
      }}>
        <span style={{ color: OO_COLORS.cyan }}>RAG</span> plus <span style={{ color: OO_COLORS.cyan }}>Graph.</span>
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 40,
        color: OO_COLORS.inkDim, letterSpacing: '-0.015em', textAlign: 'center',
        marginTop: 18,
        opacity: r(1.5),
      }}>
        Code-maps plus AST. Two retrieval modes. One platform.
      </div>

      <div style={{
        fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.inkMute,
        letterSpacing: '0.22em', marginTop: 64,
        opacity: r(3.5),
      }}>
        BUILT FOR BOTH
      </div>

      <div style={{
        width: 160, height: 1, background: OO_COLORS.cyan,
        margin: '36px 0 36px',
        opacity: r(5.5),
      }}/>

      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 128,
        color: OO_COLORS.ink, letterSpacing: '-0.04em',
        opacity: r(5.5),
      }}>
        OutcomeOps<span style={{ color: OO_COLORS.cyan }}>.ai</span>
      </div>
    </div>
    </SceneFrame>
  );
}

Object.assign(window, { RagVsGraphCut });
