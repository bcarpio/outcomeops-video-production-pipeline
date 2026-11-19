// Variation G: "A DAY AT AN OUTCOMEOPS SHOP"
// Narrative: 08:00 standup → agents work → 16:00 human reviews → CTA.
// Duration: 42s. 8 scenes. (Extended from design's 25s to fit narration
// at speed 1.1 + a baked-in CTA scene matching A/B's pattern.)

function VariationG() {
  return (
    <>
      <div style={{ position:'absolute', inset:0, background: OO_COLORS.bg }}/>
      <GridBG/>
      <FrameChrome label="CUT-G // ONE DAY" index={useSceneIndexG(SCENES_G)} total={SCENES_G.length}/>
      <CornerMarks/>

      <Sprite start={0}    end={3.5}>  <SceneG1/></Sprite>
      <Sprite start={3.3}  end={10.0}> <SceneG2/></Sprite>
      <Sprite start={9.8}  end={16.0}> <SceneG3/></Sprite>
      <Sprite start={15.8} end={21.0}> <SceneG4/></Sprite>
      <Sprite start={20.8} end={27.0}> <SceneG5/></Sprite>
      <Sprite start={26.8} end={33.0}> <SceneG6/></Sprite>
      <Sprite start={32.8} end={36.0}> <SceneG7/></Sprite>
      <Sprite start={35.8} end={42}>   <SceneG8/></Sprite>
    </>
  );
}
const SCENES_G = [0, 3.3, 9.8, 15.8, 20.8, 26.8, 32.8, 35.8];
function useSceneIndexG(breaks) {
  const t = useTime();
  let idx = 1;
  for (let i=0; i<breaks.length; i++) if (t >= breaks[i]) idx = i + 1;
  return idx;
}

// Time-of-day stamp element
function TimeStamp({ time, label }) {
  return (
    <div style={{ position:'absolute', left: 96, top: 96, display:'flex', alignItems:'baseline', gap: 24 }}>
      <div style={{ fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.cyan, letterSpacing:'0.24em' }}>
        {label}
      </div>
      <div style={{ fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 72, color: OO_COLORS.ink, letterSpacing:'-0.03em', lineHeight: 1, fontVariantNumeric:'tabular-nums' }}>
        {time}
      </div>
    </div>
  );
}

// SCENE 1 — Cold open
function SceneG1() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));
  return (
    <>
      <SectionNumber n="00" label="ONE DAY" x={96} y={260}/>
      <div style={{
        position:'absolute', left: 96, top: 440, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 60,
        color: OO_COLORS.inkDim, letterSpacing:'-0.02em',
        opacity: r(0),
      }}>
        A day at a team running
      </div>
      <div style={{
        position:'absolute', left: 96, top: 540, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 156,
        color: OO_COLORS.ink, letterSpacing:'-0.04em', lineHeight: 0.95,
        opacity: r(0.5),
      }}>
        OutcomeOps<span style={{ color: OO_COLORS.cyan }}>.</span>
      </div>
      <div style={{
        position:'absolute', left: 96, bottom: 180, right: 96,
        fontFamily: OO_TYPE.mono, fontSize: 18, color: OO_COLORS.inkMute, letterSpacing:'0.2em',
        opacity: r(1.5),
      }}>
        NO TIME-LAPSE. NO SLIDES MARKED "DEMO". JUST TIME-STAMPS.
      </div>
    </>
  );
}

// SCENE 2 — 08:00 standup
function SceneG2() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));

  const tickets = [
    { id: 'PAY-442', title: 'Idempotency keys on /charge retries',      owner: 'Agent-3', prio: 'P1' },
    { id: 'PAY-448', title: 'Backfill audit table for Q1 reconciliation', owner: 'Agent-1', prio: 'P2' },
    { id: 'PAY-451', title: 'Migrate Stripe webhook verifier to KMS',    owner: 'Agent-2', prio: 'P1' },
    { id: 'RISK-89', title: 'Add SAR flag to suspicious-txn pipeline',   owner: 'Agent-4', prio: 'P1' },
  ];

  return (
    <>
      <TimeStamp time="08:00" label="STANDUP"/>
      <div style={{
        position:'absolute', left: 96, top: 240, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
        color: OO_COLORS.ink, letterSpacing:'-0.02em', lineHeight: 1.05,
        opacity: r(0),
      }}>
        Four engineers. <span style={{ color: OO_COLORS.inkDim }}>Eighteen tickets.</span>
      </div>
      <div style={{
        position:'absolute', left: 96, top: 340,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 44,
        color: OO_COLORS.cyan, letterSpacing:'-0.02em',
        opacity: r(0.25),
      }}>
        They pick four. The rest go to agents.
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 500 }}>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 13, color: OO_COLORS.inkMute, letterSpacing:'0.18em',
          display:'grid', gridTemplateColumns: '160px 1fr 200px 100px', gap: 24,
          padding: '12px 0', borderBottom: `1px solid ${OO_COLORS.rule}`,
          opacity: r(0.5),
        }}>
          <div>TICKET</div><div>TITLE</div><div>ASSIGNED</div><div>PRIO</div>
        </div>
        {tickets.map((t, i) => (
          <div key={i} style={{
            fontFamily: OO_TYPE.mono, fontSize: 20, color: OO_COLORS.ink,
            display:'grid', gridTemplateColumns: '160px 1fr 200px 100px', gap: 24,
            padding: '18px 0', borderBottom: `1px solid ${OO_COLORS.rule}`,
            opacity: r(0.7 + i * 0.1),
            alignItems: 'baseline',
          }}>
            <div style={{ color: OO_COLORS.cyan }}>{t.id}</div>
            <div>{t.title}</div>
            <div style={{ color: OO_COLORS.cyan, letterSpacing:'0.1em' }}>◆ {t.owner}</div>
            <div style={{ color: t.prio === 'P1' ? OO_COLORS.amber : OO_COLORS.inkDim }}>{t.prio}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// SCENE 3 — 10:30 agents working (live terminal)
function SceneG3() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.3));

  // Typed terminal lines
  const lines = [
    { t: 0.3,  text: 'Agent-3 → reading ADR-017 (retry semantics)',           c: OO_COLORS.inkDim },
    { t: 0.8,  text: 'Agent-3 → reading PR #1204 (prior attempt, reverted)',  c: OO_COLORS.inkDim },
    { t: 1.3,  text: 'Agent-3 → querying code-map: @charge_handler callers',  c: OO_COLORS.inkDim },
    { t: 1.9,  text: 'Agent-3 → drafting patch: idempotency_key.py (+84 -11)',c: OO_COLORS.cyan   },
    { t: 2.5,  text: 'Agent-3 → running: pytest payments/ -k retry',          c: OO_COLORS.inkDim },
    { t: 3.1,  text: 'Agent-3 → ✓ 47 passed · 0 failed · coverage +2.1%',     c: OO_COLORS.green  },
    { t: 3.6,  text: 'Agent-3 → opening PR #1219 → ready for review',         c: OO_COLORS.cyan   },
  ];

  return (
    <>
      <TimeStamp time="10:30" label="AGENTS WORKING"/>

      <div style={{
        position:'absolute', left: 96, top: 260,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 44, color: OO_COLORS.inkDim, letterSpacing:'-0.01em',
        opacity: r(0),
      }}>
        Engineers are in the design doc.<br/>
        <span style={{ color: OO_COLORS.ink }}>Agents are in the code.</span>
      </div>

      {/* Terminal */}
      <div style={{
        position:'absolute', left: 96, right: 96, top: 520, height: 440,
        background: OO_COLORS.bgPanel,
        border: `1px solid ${OO_COLORS.rule}`, borderRadius: 6,
        padding: '24px 32px',
        fontFamily: OO_TYPE.mono, fontSize: 20, lineHeight: 1.6,
        opacity: r(0.15),
      }}>
        <div style={{
          display:'flex', gap: 8, paddingBottom: 16, borderBottom: `1px solid ${OO_COLORS.rule}`, marginBottom: 16,
          fontSize: 13, color: OO_COLORS.inkMute, letterSpacing:'0.18em',
        }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: '#ff5f56' }}/>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: '#ffbd2e' }}/>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: '#27c93f' }}/>
          <div style={{ marginLeft: 16 }}>outcomeops/agents · live</div>
        </div>
        {lines.map((ln, i) => {
          const shown = r(ln.t);
          if (shown <= 0) return null;
          return (
            <div key={i} style={{ color: ln.c, opacity: shown, whiteSpace:'nowrap', overflow:'hidden' }}>
              <span style={{ color: OO_COLORS.inkMute }}>{String(10 + i).padStart(2,'0')}:{String(30 + i*7 % 60).padStart(2,'0')}  </span>
              {ln.text}
            </div>
          );
        })}
      </div>
    </>
  );
}

// SCENE 4 — 13:15 PR queue
function SceneG4() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.3));
  const prs = [
    { num: '#1219', title: 'feat(payments): idempotent retry keys on /charge',    by: 'Agent-3', delta: '+84 -11',  adr: 'ADR-017', check: true },
    { num: '#1220', title: 'chore(audit): backfill Q1 reconciliation table',      by: 'Agent-1', delta: '+312 -0',  adr: 'ADR-022', check: true },
    { num: '#1221', title: 'fix(webhooks): move Stripe verifier to KMS signing',  by: 'Agent-2', delta: '+94 -38',  adr: 'ADR-011', check: true },
    { num: '#1222', title: 'feat(risk): SAR flag on suspicious-txn pipeline',     by: 'Agent-4', delta: '+156 -4',  adr: 'ADR-031', check: true },
  ];
  return (
    <>
      <TimeStamp time="13:15" label="PR QUEUE"/>
      <div style={{
        position:'absolute', left: 96, top: 260,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 44, color: OO_COLORS.ink, letterSpacing:'-0.015em',
        opacity: r(0),
      }}>
        Four PRs. Each one cites the ADR it honors.
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 420 }}>
        {prs.map((p, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns: '120px 1fr 180px 160px 160px 48px', gap: 24,
            alignItems:'center',
            padding: '22px 0', borderBottom: `1px solid ${OO_COLORS.rule}`,
            fontFamily: OO_TYPE.mono, fontSize: 20, color: OO_COLORS.ink,
            opacity: r(0.2 + i * 0.18),
          }}>
            <div style={{ color: OO_COLORS.cyan }}>{p.num}</div>
            <div style={{ fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 24, letterSpacing:'-0.01em' }}>{p.title}</div>
            <div style={{ color: OO_COLORS.cyan, fontSize: 18, letterSpacing:'0.06em' }}>◆ {p.by}</div>
            <div style={{ color: OO_COLORS.inkDim, fontSize: 18 }}>{p.delta}</div>
            <div style={{
              color: OO_COLORS.inkDim, fontSize: 14, letterSpacing:'0.12em',
              border: `1px solid ${OO_COLORS.rule}`, padding: '4px 10px', borderRadius: 3,
              display:'inline-block', justifySelf:'start',
            }}>
              cites {p.adr}
            </div>
            <div style={{ color: OO_COLORS.green, fontSize: 24 }}>✓</div>
          </div>
        ))}
      </div>
    </>
  );
}

// SCENE 5 — 16:00 human review
function SceneG5() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));
  return (
    <>
      <TimeStamp time="16:00" label="HUMAN REVIEW"/>
      <div style={{
        position:'absolute', left: 96, top: 260, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 52,
        color: OO_COLORS.inkDim, letterSpacing:'-0.02em', maxWidth: 1200,
        opacity: r(0),
      }}>
        The engineer reviews. Not the syntax —<br/>
        <span style={{ color: OO_COLORS.ink, fontWeight: 500 }}>the intent.</span>
      </div>

      {/* Review panel */}
      <div style={{
        position:'absolute', left: 96, right: 96, top: 480,
        padding: '40px 48px',
        background: OO_COLORS.bgPanel, border: `1px solid ${OO_COLORS.rule}`, borderRadius: 6,
        opacity: r(0.3),
      }}>
        <div style={{ fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.inkMute, letterSpacing:'0.18em', marginBottom: 20 }}>
          PR #1219 · REVIEWER: LEAD ENG
        </div>
        <div style={{ fontFamily: OO_TYPE.sans, fontSize: 38, color: OO_COLORS.ink, letterSpacing:'-0.02em', lineHeight: 1.3, fontWeight: 400, opacity: r(0.5) }}>
          "Good call on the replay window. Pull it from config —<br/>
          ops will want to tune it per-region."
        </div>
        <div style={{ marginTop: 40, display:'flex', gap: 16, opacity: r(0.9) }}>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 14, letterSpacing:'0.18em',
            color: OO_COLORS.cyan, border: `1px solid ${OO_COLORS.cyan}`, padding: '10px 20px', borderRadius: 3,
          }}>
            REQUEST CHANGES
          </div>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 14, letterSpacing:'0.18em',
            color: OO_COLORS.inkMute, border: `1px solid ${OO_COLORS.rule}`, padding: '10px 20px', borderRadius: 3,
          }}>
            12-SECOND COMMENT → AGENT-3 REVISES
          </div>
        </div>
      </div>
    </>
  );
}

// SCENE 6 — 17:30 scoreboard
function SceneG6() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));
  const count = (target, delay, dur=1.4) => {
    const t = Math.min(1, Math.max(0, (localTime - delay) / dur));
    const eased = 1 - Math.pow(1 - t, 3);
    return Math.floor(target * eased);
  };
  return (
    <>
      <TimeStamp time="17:30" label="END OF DAY"/>
      <div style={{
        position:'absolute', left: 96, top: 260,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 44, color: OO_COLORS.inkDim, letterSpacing:'-0.015em',
        opacity: r(0),
      }}>
        What actually shipped.
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 420, display:'flex', gap: 40 }}>
        {[
          { v: count(14, 0.2), u: '',   l: 'stories merged to main',       d: 0.1 },
          { v: count(4, 0.7),  u: '',   l: 'engineers who shipped them',   d: 0.5 },
          { v: count(42, 1.2), u: ' min', l: 'average review time per PR', d: 0.9 },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, borderTop: `1px solid ${OO_COLORS.rule}`, paddingTop: 36,
            opacity: r(s.d),
          }}>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 220,
              color: OO_COLORS.ink, letterSpacing:'-0.045em', lineHeight: 1,
              fontVariantNumeric:'tabular-nums',
            }}>
              {s.v}<span style={{ color: OO_COLORS.cyan, fontSize: 120 }}>{s.u}</span>
            </div>
            <div style={{ fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.inkDim, letterSpacing:'0.12em', marginTop: 24 }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// SCENE 7 — Tagline (philosophical close, no brand mark — that lands in scene 8)
function SceneG7() {
  const { localTime } = useSprite();
  const r = Math.min(1, localTime / 0.4);
  return (
    <div style={{
      position:'absolute', inset:0,
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      opacity: r,
    }}>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 96,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', textAlign:'center',
        lineHeight: 1.05,
      }}>
        The day your <span style={{ color: OO_COLORS.cyan }}>backlog</span><br/>
        clears itself.
      </div>
    </div>
  );
}

// SCENE 8 — CTA lockup
function SceneG8() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.5));
  return (
    <div style={{
      position:'absolute', inset:0,
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 56,
        color: OO_COLORS.inkDim, letterSpacing:'-0.02em',
        textAlign:'center', maxWidth: 1500, lineHeight: 1.25,
        opacity: r(0),
      }}>
        How many <span style={{ color: OO_COLORS.ink, fontWeight: 500 }}>outcomes</span> can your engineers ship today?
      </div>
      <div style={{
        width: 120, height: 1, background: OO_COLORS.cyan,
        margin: '64px 0 40px',
        opacity: r(0.6),
      }}/>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 132,
        color: OO_COLORS.ink, letterSpacing:'-0.04em',
        opacity: r(0.8),
      }}>
        OutcomeOps<span style={{ color: OO_COLORS.cyan }}>.ai</span>
      </div>
    </div>
  );
}

Object.assign(window, { VariationG });
