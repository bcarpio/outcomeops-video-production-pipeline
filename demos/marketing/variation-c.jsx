// Variation C: "ENGINEERS OWN OUTCOMES, NOT OUTPUTS"
// The manifesto cut. Provocative, philosophy-forward.
// Duration: 32s. 7 scenes. (Re-timed from design's 25s to fit narration at speed 1.1.)

function VariationC() {
  return (
    <>
      <div style={{ position:'absolute', inset:0, background: OO_COLORS.bg }}/>
      <GridBG/>
      <FrameChrome label="CUT-C // MANIFESTO" index={useSceneIndexC(SCENES_C)} total={SCENES_C.length}/>
      <CornerMarks/>

      <Sprite start={0}    end={4.0}>  <SceneC1/></Sprite>
      <Sprite start={3.8}  end={8.5}>  <SceneC2/></Sprite>
      <Sprite start={8.3}  end={12.5}> <SceneC3/></Sprite>
      <Sprite start={12.3} end={17.5}> <SceneC4/></Sprite>
      <Sprite start={17.3} end={22.5}> <SceneC5/></Sprite>
      <Sprite start={22.3} end={28.5}> <SceneC6/></Sprite>
      <Sprite start={28.3} end={32}>   <SceneC7/></Sprite>
    </>
  );
}
const SCENES_C = [0, 3.8, 8.3, 12.3, 17.3, 22.3, 28.3];
function useSceneIndexC(breaks) {
  const t = useTime();
  let idx = 1;
  for (let i=0; i<breaks.length; i++) if (t >= breaks[i]) idx = i + 1;
  return idx;
}

// SCENE 1 — Cold open
function SceneC1() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));
  return (
    <>
      <SectionNumber n="01" label="ENOUGH" x={96} y={180}/>
      <div style={{
        position:'absolute', left: 96, top: 420, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 72,
        color: OO_COLORS.inkDim, letterSpacing:'-0.025em', lineHeight: 1.05,
        opacity: r(0),
      }}>
        Stop reviewing prompts.
      </div>
      <div style={{
        position:'absolute', left: 96, top: 540, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 72,
        color: OO_COLORS.inkDim, letterSpacing:'-0.025em', lineHeight: 1.05,
        opacity: r(0.5),
      }}>
        Stop grading AI homework.
      </div>
      <div style={{
        position:'absolute', left: 96, top: 680, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 140,
        color: OO_COLORS.ink, letterSpacing:'-0.04em', lineHeight: 0.95,
        opacity: r(1.1),
      }}>
        Stop <span style={{ color: OO_COLORS.red }}>babysitting</span> AI output.
      </div>
    </>
  );
}

// SCENE 2 — Two columns: OUTPUTS vs OUTCOMES
function SceneC2() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));
  const outputs = [
    '1,400 generated suggestions',
    '84% accepted (by someone)',
    'an inbox of PRs',
    'a Slack channel of prompts',
    'tokens burned',
  ];
  const outcomes = [
    'a ticket closed',
    'a merge-ready PR',
    'a story shipped',
    'a customer unblocked',
    'revenue moved',
  ];
  return (
    <>
      <SectionNumber n="02" label="THE DIFFERENCE" x={96} y={180}/>
      <div style={{ position:'absolute', left: 96, top: 300, width: 820 }}>
        <div style={{ fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.red, letterSpacing:'0.22em', marginBottom: 32, opacity: r(0) }}>
          WHAT VENDORS SELL YOU
        </div>
        <div style={{ fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 96, color: OO_COLORS.ink, letterSpacing:'-0.04em', lineHeight: 0.95, textDecoration: 'line-through', textDecorationColor: OO_COLORS.red, textDecorationThickness: 3, opacity: r(0.15) }}>
          Outputs
        </div>
        <div style={{ marginTop: 40 }}>
          {outputs.map((o, i) => (
            <div key={i} style={{
              fontFamily: OO_TYPE.mono, fontSize: 20, color: OO_COLORS.inkDim,
              padding: '10px 0', borderBottom: `1px solid ${OO_COLORS.rule}`,
              opacity: r(0.3 + i * 0.08),
            }}>
              <span style={{ color: OO_COLORS.inkMute, marginRight: 12 }}>—</span>{o}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position:'absolute', left: 1004, top: 300, width: 820 }}>
        <div style={{ fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.cyan, letterSpacing:'0.22em', marginBottom: 32, opacity: r(0.3) }}>
          WHAT THE BUSINESS PAID FOR
        </div>
        <div style={{ fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 96, color: OO_COLORS.cyan, letterSpacing:'-0.04em', lineHeight: 0.95, opacity: r(0.45) }}>
          Outcomes
        </div>
        <div style={{ marginTop: 40 }}>
          {outcomes.map((o, i) => (
            <div key={i} style={{
              fontFamily: OO_TYPE.mono, fontSize: 20, color: OO_COLORS.ink,
              padding: '10px 0', borderBottom: `1px solid ${OO_COLORS.rule}`,
              opacity: r(0.6 + i * 0.08),
            }}>
              <span style={{ color: OO_COLORS.cyan, marginRight: 12 }}>→</span>{o}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// SCENE 3 — The manifesto line
function SceneC3() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.cyan, letterSpacing:'0.3em', opacity: r(0) }}>
        03 — THE LINE
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 180,
        color: OO_COLORS.ink, letterSpacing:'-0.045em', lineHeight: 0.92,
        marginTop: 56, textAlign:'center',
        opacity: r(0.4),
      }}>
        Engineers own<br/>
        <span style={{ color: OO_COLORS.cyan }}>outcomes,</span>
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 72,
        color: OO_COLORS.inkDim, letterSpacing:'-0.02em',
        marginTop: 40, textAlign:'center', fontStyle:'italic',
        opacity: r(1.4),
      }}>
        not outputs.
      </div>
    </div>
  );
}

// SCENE 4 — The translation
function SceneC4() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));
  return (
    <>
      <SectionNumber n="04" label="THE REDEFINITION" x={96} y={180}/>
      <div style={{
        position:'absolute', left: 96, top: 280,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 44,
        color: OO_COLORS.inkDim, letterSpacing:'-0.01em',
        opacity: r(0),
      }}>
        "AI-assisted development" is a stepping stone.
      </div>

      <div style={{ position:'absolute', left: 96, top: 420, right: 96 }}>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 18, color: OO_COLORS.inkMute, letterSpacing:'0.2em',
          opacity: r(0.3),
        }}>
          HUMAN ROLE →
        </div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 120,
          color: OO_COLORS.ink, letterSpacing:'-0.04em', lineHeight: 0.95, marginTop: 16,
          opacity: r(0.5),
        }}>
          Set the <span style={{ color: OO_COLORS.cyan }}>outcome.</span><br/>
          Set the <span style={{ color: OO_COLORS.cyan }}>standards.</span><br/>
          Review the <span style={{ color: OO_COLORS.cyan }}>merge.</span>
        </div>
      </div>

      <div style={{
        position:'absolute', left: 96, bottom: 120, right: 96,
        fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.inkDim,
        letterSpacing:'0.18em',
        opacity: r(1.5),
      }}>
        — EVERYTHING BETWEEN IS AGENTS, NOT HUMANS.
      </div>
    </>
  );
}

// SCENE 5 — What we're not
function SceneC5() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));
  const items = [
    { not: 'a copilot', is: 'a coworker that clears the backlog overnight' },
    { not: 'a prompt library', is: 'your standards compiled into agents' },
    { not: 'a chatbot',  is: 'a pull request reviewed against your ADRs' },
  ];
  return (
    <>
      <SectionNumber n="05" label="WHAT WE'RE NOT" x={96} y={180}/>
      <div style={{ position:'absolute', left: 96, top: 300, right: 96 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            padding: '32px 0', borderBottom: `1px solid ${OO_COLORS.rule}`,
            opacity: r(i * 0.4),
            display:'flex', gap: 48, alignItems:'baseline',
          }}>
            <div style={{
              width: 680, fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
              color: OO_COLORS.inkDim, letterSpacing:'-0.02em', lineHeight: 1.05,
              textDecoration: 'line-through', textDecorationColor: OO_COLORS.red,
            }}>
              Not {it.not}.
            </div>
            <div style={{
              flex: 1, fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 48,
              color: OO_COLORS.ink, letterSpacing:'-0.02em', lineHeight: 1.1,
            }}>
              <span style={{ color: OO_COLORS.cyan }}>→ </span>{it.is}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// SCENE 6 — Call
function SceneC6() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.cyan, letterSpacing:'0.3em', opacity: r(0) }}>
        06 — A CHOICE
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 72,
        color: OO_COLORS.inkDim, letterSpacing:'-0.02em', marginTop: 48, textAlign:'center', lineHeight: 1.1,
        opacity: r(0.3),
      }}>
        Hire more reviewers,
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 108,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', marginTop: 24, textAlign:'center', lineHeight: 1.02,
        opacity: r(1.0),
      }}>
        or hire the <span style={{ color: OO_COLORS.cyan }}>engineers who ship.</span>
      </div>
    </div>
  );
}

// SCENE 7 — Lockup
function SceneC7() {
  const { localTime } = useSprite();
  const r = Math.min(1, localTime / 0.5);
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity: r }}>
      <div style={{ width: 120, height: 1, background: OO_COLORS.cyan, marginBottom: 32 }}/>
      <div style={{ fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 120, color: OO_COLORS.ink, letterSpacing:'-0.04em' }}>
        OutcomeOps<span style={{ color: OO_COLORS.cyan }}>.ai</span>
      </div>
      <div style={{ fontFamily: OO_TYPE.mono, fontSize: 18, color: OO_COLORS.inkDim, letterSpacing:'0.25em', marginTop: 24 }}>
        OUTCOMES. NOT OUTPUTS.
      </div>
    </div>
  );
}

Object.assign(window, { VariationC });
