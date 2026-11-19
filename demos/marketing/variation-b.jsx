// Variation B: "ORGANIZATIONAL INTELLIGENCE"
// Angle: Beyond code — Jira + Confluence + SharePoint + full codebase = a map of your company.
// Duration: 46s. 8 scenes. (Extended from the Designer bundle's original
// 32s so Drew's narration has breathing room between beats. Scene 8
// holds for ~6s to cover the CTA voice-over.)

function VariationB() {
  return (
    <>
      <div style={{ position:'absolute', inset:0, background: OO_COLORS.bg }}/>
      <GridBG/>
      <FrameChrome label="CUT-B // ORGANIZATIONAL-INTELLIGENCE" index={useSceneIndexB(SCENES_B)} total={SCENES_B.length}/>
      <CornerMarks/>

      <Sprite start={0} end={4.7}><SceneB1/></Sprite>
      <Sprite start={4.5} end={11.2}><SceneB2/></Sprite>
      <Sprite start={11} end={17.7}><SceneB3/></Sprite>
      <Sprite start={17.5} end={21.7}><SceneB4/></Sprite>
      <Sprite start={21.5} end={29.2}><SceneB5/></Sprite>
      <Sprite start={29} end={35.2}><SceneB6/></Sprite>
      <Sprite start={35} end={40}><SceneB7/></Sprite>
      <Sprite start={40} end={46}><SceneB8/></Sprite>
    </>
  );
}

const SCENES_B = [0, 4.5, 11, 17.5, 21.5, 29, 35, 40];
function useSceneIndexB(breaks) {
  const t = useTime();
  let idx = 1;
  for (let i=0; i<breaks.length; i++) if (t >= breaks[i]) idx = i + 1;
  return idx;
}

// ── SCENE 1 — Opening question ─────────────────────
function SceneB1() {
  const { localTime, progress } = useSprite();
  return (
    <>
      <SectionNumber n="01" label="A QUESTION" x={96} y={180}/>
      <div style={{
        position:'absolute', left: 96, top: 360, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 88,
        color: OO_COLORS.inkDim, letterSpacing:'-0.03em', lineHeight: 1.05,
        opacity: Math.min(1, localTime / 0.5),
      }}>
        Who in your company
      </div>
      <div style={{
        position:'absolute', left: 96, top: 500, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 120,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', lineHeight: 1.02,
        opacity: Math.min(1, Math.max(0, (localTime - 0.9) / 0.5)),
      }}>
        actually knows<br/>
        <span style={{ color: OO_COLORS.inkDim }}>how the whole thing</span><br/>
        <span style={{
          color: OO_COLORS.cyan,
          borderBottom: `2px solid ${OO_COLORS.cyan}`,
          paddingBottom: 4,
        }}>fits together?</span>
      </div>
      <div style={{
        position:'absolute', left: 96, bottom: 120,
        fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.inkMute, letterSpacing:'0.2em',
        opacity: Math.min(1, Math.max(0, (localTime - 2.5) / 0.5)),
      }}>
        — PROBABLY NOT ENOUGH PEOPLE.
      </div>
    </>
  );
}

// ── SCENE 2 — The silos ────────────────────────────
function SceneB2() {
  const { localTime } = useSprite();
  const reveal = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));

  const silos = [
    { name: 'GITHUB',     lines: ['2.4M lines', '18 services', '140 repos'],              color: '#8b5cf6' },
    { name: 'JIRA',       lines: ['12,400 tickets', '6 years of context', 'every decision'], color: '#3b82f6' },
    { name: 'CONFLUENCE', lines: ['4,200 pages', 'ADRs, RFCs, runbooks', 'half stale'],     color: '#22d3ee' },
    { name: 'SHAREPOINT', lines: ['a swamp', 'nobody dares touch it', '...still the source of truth'], color: '#f59e0b' },
  ];

  return (
    <>
      <SectionNumber n="02" label="YOUR KNOWLEDGE, TODAY" x={96} y={180}/>
      <div style={{
        position:'absolute', left: 96, top: 230,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 48,
        color: OO_COLORS.ink, letterSpacing:'-0.02em',
        opacity: reveal(0),
      }}>
        Four systems. Four silos.<br/>
        <span style={{ color: OO_COLORS.inkDim }}>Nothing talks to anything.</span>
      </div>

      {/* Silo columns */}
      <div style={{ position:'absolute', left: 96, right: 96, top: 460, display:'flex', gap: 24 }}>
        {silos.map((s, i) => {
          const r = reveal(0.4 + i * 0.15);
          return (
            <div key={i} style={{
              flex: 1, height: 440,
              border: `1px solid ${OO_COLORS.rule}`, borderRadius: 4,
              background: 'rgba(255,255,255,0.015)',
              padding: 32, position:'relative',
              opacity: r, transform: `translateY(${(1-r) * 32}px)`,
            }}>
              <div style={{ width: 24, height: 24, background: s.color, borderRadius: 2, marginBottom: 24 }}/>
              <div style={{ fontFamily: OO_TYPE.mono, fontSize: 18, color: OO_COLORS.ink, letterSpacing:'0.18em', marginBottom: 32 }}>
                {s.name}
              </div>
              {s.lines.map((ln, j) => (
                <div key={j} style={{
                  fontFamily: OO_TYPE.sans, fontSize: 22, color: j === 0 ? OO_COLORS.ink : OO_COLORS.inkDim,
                  lineHeight: 1.6, letterSpacing:'-0.01em',
                }}>
                  {ln}
                </div>
              ))}
              {/* Padlock */}
              <div style={{ position:'absolute', top: 32, right: 32, fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.inkMute }}>
                ISOLATED
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── SCENE 3 — The graph forms ──────────────────────
function SceneB3() {
  const { localTime, progress } = useSprite();
  const reveal = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));

  // Graph nodes
  const nodes = React.useMemo(() => {
    const n = [];
    const seed = 42;
    const r = (i) => ((Math.sin(seed + i * 12.9898) * 43758.5453) % 1 + 1) % 1;
    // Code cluster
    for (let i = 0; i < 20; i++) {
      n.push({ x: 380 + r(i) * 260, y: 460 + r(i+100) * 260, type: 'code', color: '#8b5cf6' });
    }
    // Jira cluster
    for (let i = 0; i < 16; i++) {
      n.push({ x: 820 + r(i+200) * 260, y: 360 + r(i+300) * 200, type: 'jira', color: '#3b82f6' });
    }
    // Confluence cluster
    for (let i = 0; i < 14; i++) {
      n.push({ x: 1260 + r(i+400) * 260, y: 460 + r(i+500) * 260, type: 'doc', color: '#22d3ee' });
    }
    // SharePoint cluster
    for (let i = 0; i < 10; i++) {
      n.push({ x: 820 + r(i+600) * 260, y: 740 + r(i+700) * 160, type: 'sp', color: '#f59e0b' });
    }
    return n;
  }, []);

  const edgeProgress = Math.min(1, Math.max(0, (localTime - 1.5) / 2));

  return (
    <>
      <SectionNumber n="03" label="THE SHIFT" x={96} y={180}/>
      <div style={{
        position:'absolute', left: 96, top: 230,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 52,
        color: OO_COLORS.ink, letterSpacing:'-0.02em', maxWidth: 820,
        opacity: reveal(0),
      }}>
        We ingest all of it.<br/>
        Code, tickets, docs, the swamp.<br/>
        <span style={{ color: OO_COLORS.cyan, fontWeight: 500 }}>Then we draw the map.</span>
      </div>

      {/* Graph canvas */}
      <svg width="1920" height="1080" style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        {/* Edges */}
        {nodes.slice(0, 40).map((a, i) => {
          const b = nodes[(i * 7 + 3) % nodes.length];
          const p = Math.min(1, Math.max(0, edgeProgress * 2 - (i / 40)));
          if (p <= 0) return null;
          const mx = a.x + (b.x - a.x) * p;
          const my = a.y + (b.y - a.y) * p;
          return (
            <line key={i} x1={a.x} y1={a.y} x2={mx} y2={my}
              stroke={OO_COLORS.cyan} strokeWidth="0.6" opacity={0.35}/>
          );
        })}
        {/* Nodes */}
        {nodes.map((n, i) => {
          const p = Math.min(1, Math.max(0, (localTime - 0.8 - i * 0.02) / 0.4));
          if (p <= 0) return null;
          return (
            <circle key={i} cx={n.x} cy={n.y} r={3.5 * p} fill={n.color} opacity={0.9}/>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{
        position:'absolute', right: 96, bottom: 120,
        display:'flex', gap: 28, fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.inkDim, letterSpacing:'0.15em',
        opacity: reveal(2.5),
      }}>
        {[['#8b5cf6','CODE'],['#3b82f6','TICKETS'],['#22d3ee','DOCS'],['#f59e0b','SHAREPOINT']].map(([c,l]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, background: c, borderRadius: 5 }}/>{l}
          </div>
        ))}
      </div>
    </>
  );
}

// ── SCENE 4 — Reveal: Organizational Intelligence ──
function SceneB4() {
  const { localTime } = useSprite();
  return (
    <>
      <div style={{
        position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      }}>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.cyan, letterSpacing:'0.3em',
          opacity: Math.min(1, localTime * 3),
        }}>
          04 — WHAT YOU GET
        </div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
          color: OO_COLORS.inkDim, marginTop: 48, letterSpacing:'-0.02em', textAlign:'center',
          opacity: Math.min(1, Math.max(0, (localTime - 0.4) / 0.4)),
        }}>
          Not a chatbot. Not a wiki search.
        </div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 156,
          color: OO_COLORS.ink, marginTop: 32, letterSpacing:'-0.045em', lineHeight: 0.95, textAlign:'center',
          opacity: Math.min(1, Math.max(0, (localTime - 1.0) / 0.5)),
        }}>
          Organizational<br/>
          <span style={{ color: OO_COLORS.cyan }}>Intelligence.</span>
        </div>
      </div>
    </>
  );
}

// ── SCENE 5 — What it unlocks ──────────────────────
function SceneB5() {
  const { localTime } = useSprite();
  const reveal = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));

  const items = [
    {
      persona: 'PRODUCT',
      head: 'Write stories against what actually exists.',
      body: 'Agents know every endpoint, every flag, every half-built feature. Your PRDs cite line numbers.',
    },
    {
      persona: 'SUPPORT',
      head: 'Answer the deep question without paging an engineer.',
      body: 'Agents traverse the code, the ADR, and the Jira thread that explains why.',
    },
    {
      persona: 'LEADERSHIP',
      head: 'Spot the market trend against the roadmap — in one query.',
      body: '"Where are we exposed if FedNow mandates real-time ISO 20022?" Answered against 6 years of context.',
    },
  ];

  return (
    <>
      <SectionNumber n="05" label="WHO BENEFITS" x={96} y={180}/>

      <div style={{ position:'absolute', left: 96, right: 96, top: 320 }}>
        {items.map((it, i) => {
          const r = reveal(0.1 + i * 0.5);
          return (
            <div key={i} style={{
              display:'flex', gap: 64, padding: '44px 0',
              borderTop: i === 0 ? `1px solid ${OO_COLORS.rule}` : 'none',
              borderBottom: `1px solid ${OO_COLORS.rule}`,
              opacity: r, transform: `translateY(${(1-r) * 16}px)`,
            }}>
              <div style={{
                width: 260, fontFamily: OO_TYPE.mono, fontSize: 18,
                color: OO_COLORS.cyan, letterSpacing:'0.2em',
                paddingTop: 12,
              }}>
                {it.persona}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 48,
                  color: OO_COLORS.ink, letterSpacing:'-0.02em', lineHeight: 1.05,
                }}>
                  {it.head}
                </div>
                <div style={{
                  fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 24,
                  color: OO_COLORS.inkDim, marginTop: 16, letterSpacing:'-0.005em', lineHeight: 1.4,
                  maxWidth: 1100,
                }}>
                  {it.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── SCENE 6 — The regulated angle ──────────────────
function SceneB6() {
  const { localTime } = useSprite();
  const reveal = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));
  return (
    <>
      <SectionNumber n="06" label="WHERE IT MATTERS MOST" x={96} y={180}/>

      <div style={{
        position:'absolute', left: 96, top: 280,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 52,
        color: OO_COLORS.ink, letterSpacing:'-0.02em', maxWidth: 1100,
        opacity: reveal(0),
      }}>
        In regulated industries, "just use ChatGPT"<br/>
        is <span style={{ color: OO_COLORS.red }}>not an answer</span>.
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 560,
        display:'flex', gap: 32,
      }}>
        {[
          { t: 'HEALTHCARE',  l: 'HIPAA · PHI · HITRUST' },
          { t: 'FINANCIAL',   l: 'SOX · PCI · FedRAMP' },
          { t: 'AEROSPACE',   l: 'ITAR · CMMC · export controls' },
        ].map((v, i) => {
          const r = reveal(0.3 + i * 0.2);
          return (
            <div key={i} style={{
              flex: 1, padding: 40,
              border: `1px solid ${OO_COLORS.rule}`, borderRadius: 4,
              background: 'rgba(255,255,255,0.015)',
              opacity: r, transform: `translateY(${(1-r) * 24}px)`,
            }}>
              <div style={{ fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.cyan, letterSpacing:'0.2em' }}>
                ✓ IN-VPC / YOUR BEDROCK
              </div>
              <div style={{
                fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 56,
                color: OO_COLORS.ink, letterSpacing:'-0.03em', marginTop: 32, lineHeight: 1,
              }}>
                {v.t}
              </div>
              <div style={{
                fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.inkDim,
                letterSpacing:'0.12em', marginTop: 20,
              }}>
                {v.l}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── SCENE 7 — Closing ──────────────────────────────
function SceneB7() {
  const { localTime } = useSprite();
  return (
    <>
      <div style={{
        position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      }}>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.cyan, letterSpacing:'0.3em',
          opacity: Math.min(1, localTime * 3),
        }}>
          07 — THE POINT
        </div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 60,
          color: OO_COLORS.inkDim, marginTop: 40, letterSpacing:'-0.02em', textAlign:'center', lineHeight: 1.1,
          opacity: Math.min(1, Math.max(0, (localTime - 0.4) / 0.4)),
        }}>
          Everyone has the same AI models.
        </div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 96,
          color: OO_COLORS.ink, marginTop: 48, letterSpacing:'-0.035em', textAlign:'center', lineHeight: 1.02,
          opacity: Math.min(1, Math.max(0, (localTime - 1.2) / 0.5)),
        }}>
          The moat is the context<br/>
          <span style={{ color: OO_COLORS.cyan }}>only you can give them.</span>
        </div>
      </div>
    </>
  );
}

// ── SCENE 8 — Lockup ───────────────────────────────
function SceneB8() {
  const { localTime } = useSprite();
  const r = Math.min(1, localTime / 0.5);
  const urlFade = Math.min(1, Math.max(0, (localTime - 1.5) / 0.6));
  return (
    <div style={{
      position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      opacity: r,
    }}>
      <div style={{ width: 120, height: 1, background: OO_COLORS.cyan, marginBottom: 32 }}/>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 120,
        color: OO_COLORS.ink, letterSpacing:'-0.04em',
      }}>
        OutcomeOps<span style={{ color: OO_COLORS.cyan }}>.ai</span>
      </div>
      <div style={{ fontFamily: OO_TYPE.mono, fontSize: 18, color: OO_COLORS.inkDim, letterSpacing:'0.25em', marginTop: 24 }}>
        MAP YOUR ORG · SHIP FASTER · STAY COMPLIANT
      </div>
      <div style={{
        fontFamily: OO_TYPE.mono, fontSize: 26, color: OO_COLORS.cyan, letterSpacing:'0.04em',
        marginTop: 40, opacity: urlFade,
      }}>
        outcomeops.ai/contact
      </div>
    </div>
  );
}

Object.assign(window, { VariationB });
