// CUT-CEPE — CONTEXT vs PROMPT ENGINEERING (~60s)
// Series 2: Context Engineering Patterns, Video 06.
// Three-tier framing: prompt = instructions, local context (Skills /
// OpenSpec / Spec Kit) = trap, systemic context (ADRs / code maps / legacy)
// = OutcomeOps' tier.

function ContextVsPromptCut() {
  return (
    <>
      <div style={{ position:'absolute', inset:0, background: OO_COLORS.bg }}/>
      <GridBG opacity={0.03}/>
      <FrameChrome label="CE PATTERNS // 06 — CONTEXT vs PROMPT" index={useSceneIndexCEPE(SCENES_CEPE)} total={SCENES_CEPE.length}/>
      <CornerMarks/>

      <Sprite start={0}     end={5.53}>  <SceneCEPE1/></Sprite>
      <Sprite start={5.33}  end={14.96}> <SceneCEPE2/></Sprite>
      <Sprite start={14.76} end={31.29}> <SceneCEPE3/></Sprite>
      <Sprite start={31.09} end={50.28}> <SceneCEPE4/></Sprite>
      <Sprite start={50.08} end={60}>    <SceneCEPE5/></Sprite>
    </>
  );
}

const SCENES_CEPE = [0, 5.33, 14.76, 31.09, 50.08];
function useSceneIndexCEPE(breaks) {
  const t = useTime();
  let idx = 1;
  for (let i=0; i<breaks.length; i++) if (t >= breaks[i]) idx = i + 1;
  return idx;
}

// Scene-level fade wrapper. Crossfades cleanly between adjacent Sprites so
// the next scene's section-number doesn't pop in over the previous scene's
// still-visible content.
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

// ── SCENE 1 — Hook: the two terms ────────────────────────
function SceneCEPE1() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.5));

  return (
    <SceneFrame>
      <SectionNumber n="00" label="TWO TERMS" x={96} y={180}/>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 270,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 132,
        color: OO_COLORS.inkDim, letterSpacing:'-0.035em', lineHeight: 1.0,
        opacity: r(0.6),
      }}>
        Prompt engineering.
      </div>

      <div style={{
        position:'absolute', left: 96, top: 432,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontStyle: 'italic',
        fontSize: 88, color: OO_COLORS.amber,
        letterSpacing:'-0.02em', lineHeight: 1.0,
        opacity: r(1.5),
      }}>
        vs.
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 560,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 132,
        color: OO_COLORS.ink, letterSpacing:'-0.04em', lineHeight: 1.0,
        opacity: r(1.9),
      }}>
        <span style={{ color: OO_COLORS.cyan }}>Context</span> engineering.
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 130,
        fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 36,
        color: OO_COLORS.inkDim, letterSpacing:'-0.015em',
        opacity: r(3.0),
      }}>
        They're both real. <span style={{ color: OO_COLORS.ink, fontWeight: 500 }}>They're not the same.</span>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 2 — Prompt engineering: good instructions ──────
function SceneCEPE2() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  return (
    <SceneFrame>
      <SectionNumber n="01" label="PROMPT ENGINEERING" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 230,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 96,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', lineHeight: 1.0,
        opacity: r(0),
      }}>
        Good <span style={{ color: OO_COLORS.cyan }}>instructions.</span>
      </div>

      {/* Prompt card */}
      <div style={{
        position:'absolute', left: 96, top: 400, width: 1100,
        background: OO_COLORS.bgPanel,
        border: `1px solid ${OO_COLORS.rule}`,
        borderRadius: 10,
        padding: '32px 36px',
        fontFamily: OO_TYPE.mono, fontSize: 22,
        color: OO_COLORS.ink, lineHeight: 1.7,
        opacity: r(1.5),
      }}>
        <div style={{ color: OO_COLORS.inkDim, fontSize: 13, letterSpacing: '0.18em', marginBottom: 18 }}>
          PROMPT
        </div>
        <div>You are a <span style={{ color: OO_COLORS.cyan }}>senior</span> engineer</div>
        <div>who writes idiomatic Go.</div>
        <div style={{ marginTop: 12 }}>Here are <span style={{ color: OO_COLORS.cyan }}>3 examples</span> of well-</div>
        <div>structured handler functions:</div>
        <div style={{ color: OO_COLORS.inkMute }}>&nbsp;&nbsp;...</div>
        <div style={{ marginTop: 12 }}>Return <span style={{ color: OO_COLORS.cyan }}>JSON</span> with these fields:</div>
        <div style={{ color: OO_COLORS.inkMute }}>&nbsp;&nbsp;...</div>
      </div>

      {/* Annotations */}
      <div style={{
        position:'absolute', left: 1240, top: 468,
        fontFamily: OO_TYPE.mono, fontSize: 26, fontWeight: 500,
        color: OO_COLORS.cyan,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        opacity: r(3.0),
      }}>
        ← Right verb
      </div>
      <div style={{
        position:'absolute', left: 1240, top: 564,
        fontFamily: OO_TYPE.mono, fontSize: 26, fontWeight: 500,
        color: OO_COLORS.cyan,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        opacity: r(4.0),
      }}>
        ← Give examples
      </div>
      <div style={{
        position:'absolute', left: 1240, top: 672,
        fontFamily: OO_TYPE.mono, fontSize: 26, fontWeight: 500,
        color: OO_COLORS.cyan,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        opacity: r(5.0),
      }}>
        ← Structure output
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 110,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 38,
        color: OO_COLORS.ink, letterSpacing:'-0.02em',
        opacity: r(6.5),
      }}>
        It's a <span style={{ color: OO_COLORS.cyan }}>skill.</span> It scales with{' '}
        <span style={{ color: OO_COLORS.inkDim, fontWeight: 400 }}>the person typing.</span>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 3 — The local optimization trap ────────────────
function SceneCEPE3() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const cards = [
    { name: 'Anthropic Skills',  tag: 'AGENT MARKETPLACE',      delay: 5.5 },
    { name: 'OpenSpec',          tag: 'DETERMINISTIC SPECS',    delay: 6.3 },
    { name: 'GitHub Spec Kit',   tag: 'SEPT 2025 · CLI',         delay: 7.2 },
  ];

  return (
    <SceneFrame>
      <SectionNumber n="02" label="LOCAL OPTIMIZATION" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 230, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 38,
        color: OO_COLORS.inkDim, letterSpacing:'-0.015em', lineHeight: 1.3,
        opacity: r(0),
      }}>
        Most of what people call{' '}
        <span style={{ color: OO_COLORS.ink, fontWeight: 500 }}>context engineering</span>{' '}
        today —
      </div>

      {/* Three cards */}
      <div style={{
        position:'absolute', left: 96, right: 96, top: 360,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32,
      }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            background: OO_COLORS.bgPanel,
            border: `1px solid ${OO_COLORS.rule}`,
            borderRadius: 10,
            padding: '32px 28px',
            opacity: r(c.delay),
            transform: `translateY(${(1 - r(c.delay)) * 18}px)`,
            transition: 'transform 400ms',
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 12, color: OO_COLORS.inkMute,
              letterSpacing: '0.22em', marginBottom: 20,
            }}>
              {c.tag}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 46,
              color: OO_COLORS.ink, letterSpacing: '-0.025em', lineHeight: 1.0,
            }}>
              {c.name}
            </div>
          </div>
        ))}
      </div>

      {/* The trap banner */}
      <div style={{
        position:'absolute', left: 96, right: 96, top: 630,
        padding: '28px 36px',
        background: 'rgba(251,191,36,0.06)',
        border: `2px solid ${OO_COLORS.amber}`,
        borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        opacity: r(12.5),
      }}>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 56,
          color: OO_COLORS.amber, letterSpacing: '-0.025em',
        }}>
          The local optimization trap.
        </div>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.amber,
          letterSpacing: '0.22em',
        }}>
          MUDA / SUB-OPTIMIZATION
        </div>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 100,
        fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 32,
        color: OO_COLORS.inkDim, letterSpacing:'-0.012em',
        opacity: r(9.0),
      }}>
        A few repos.{' '}
        <span style={{ color: OO_COLORS.inkDim }}>A small team.</span>{' '}
        <span style={{ color: OO_COLORS.ink, fontWeight: 500 }}>One greenfield project.</span>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 4 — Systemic context engineering ───────────────
function SceneCEPE4() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const rails = [
    { label: 'ADRs',                   arrow: '→', body: 'encoded',     tag: 'THE WHY, VERSIONED',               delay: 2.5 },
    { label: 'Code maps',              arrow: '→', body: 'queryable',   tag: 'YOUR CODEBASE REASONS ABOUT ITSELF', delay: 5.0 },
    { label: 'Decades of legacy',      arrow: '→', body: 'grounded',    tag: 'JAVA · .NET · PYTHON · ABAP',       delay: 7.0 },
  ];

  return (
    <SceneFrame>
      <SectionNumber n="03" label="SYSTEMIC" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 230, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 96,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', lineHeight: 1.0,
        opacity: r(0),
      }}>
        Above the <span style={{ color: OO_COLORS.cyan }}>repo.</span>
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 420 }}>
        {rails.map((r2, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns: '420px 80px 1fr 320px',
            gap: 24, alignItems: 'baseline',
            padding: '20px 0',
            borderBottom: `1px solid ${OO_COLORS.rule}`,
            opacity: r(r2.delay),
            transform: `translateX(${(1 - r(r2.delay)) * -20}px)`,
            transition: 'transform 400ms',
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 32, color: OO_COLORS.cyan,
              letterSpacing:'0.04em',
            }}>
              {r2.label}
            </div>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 32, color: OO_COLORS.inkMute,
              textAlign: 'center',
            }}>
              {r2.arrow}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 40,
              color: OO_COLORS.ink, letterSpacing:'-0.02em',
            }}>
              {r2.body}
            </div>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 12, color: OO_COLORS.inkMute,
              letterSpacing:'0.22em', textAlign: 'right',
            }}>
              {r2.tag}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 100,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 56,
        color: OO_COLORS.ink, letterSpacing:'-0.025em',
        opacity: r(16.5),
      }}>
        The AI doesn't have to be told.{' '}
        <span style={{ color: OO_COLORS.cyan }}>It already knows.</span>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 5 — CTA ────────────────────────────────────────
function SceneCEPE5() {
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
        fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 40,
        color: OO_COLORS.inkDim, letterSpacing: '-0.015em', textAlign: 'center',
        opacity: r(0),
      }}>
        Local optimization is a <span style={{ color: OO_COLORS.amber, fontWeight: 500 }}>skill.</span>
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 60,
        color: OO_COLORS.ink, letterSpacing: '-0.025em', textAlign: 'center',
        marginTop: 20, lineHeight: 1.1,
        opacity: r(2.5),
      }}>
        Systemic context engineering is a{' '}
        <span style={{ color: OO_COLORS.cyan }}>system.</span>
      </div>

      <div style={{
        fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.inkMute,
        letterSpacing: '0.22em', marginTop: 64,
        opacity: r(5.5),
      }}>
        BUILT FOR THE SYSTEMIC LAYER
      </div>

      <div style={{
        width: 160, height: 1, background: OO_COLORS.cyan,
        margin: '36px 0 36px',
        opacity: r(7.0),
      }}/>

      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 128,
        color: OO_COLORS.ink, letterSpacing: '-0.04em',
        opacity: r(7.0),
      }}>
        OutcomeOps<span style={{ color: OO_COLORS.cyan }}>.ai</span>
      </div>
    </div>
    </SceneFrame>
  );
}

Object.assign(window, { ContextVsPromptCut });
