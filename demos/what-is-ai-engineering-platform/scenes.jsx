// CUT-AIEP -- WHAT IS AN AI ENGINEERING PLATFORM? (~7:00)
// Series 3: Platform Patterns, Video 09.
// Authority piece pairing with the May 2026 blog. 8 scenes:
//   01 Hook -- the category rename
//   02 New scope -- platform vs assistant
//   03 Five components -- context, generation, output, audit, deployment
//   04 The paved-road precedent -- Liberty Mutual Fusion (2016)
//   05 What changed in 2026 -- vocabulary, multi-region, pricing
//   06 The four platforms -- OutcomeOps, Devin, Cursor, GitHub Copilot
//   07 Five questions -- evaluation framework
//   08 CTA

function AiEnginPlatformCut() {
  return (
    <>
      <div style={{ position:'absolute', inset:0, background: OO_COLORS.bg }}/>
      <GridBG opacity={0.03}/>
      <FrameChrome label="PLATFORM PATTERNS // 09 — AI ENGINEERING PLATFORMS" index={useSceneIndexAIEP(SCENES_AIEP)} total={SCENES_AIEP.length}/>
      <CornerMarks/>

      <Sprite start={0}      end={25.41}>  <SceneAIEP1/></Sprite>
      <Sprite start={25.21}  end={77.31}>  <SceneAIEP2/></Sprite>
      <Sprite start={77.11}  end={152.81}> <SceneAIEP3/></Sprite>
      <Sprite start={152.61} end={237.55}> <SceneAIEP4/></Sprite>
      <Sprite start={237.35} end={289.01}> <SceneAIEP5/></Sprite>
      <Sprite start={288.81} end={358.23}> <SceneAIEP6/></Sprite>
      <Sprite start={358.03} end={422.34}> <SceneAIEP7/></Sprite>
      <Sprite start={422.14} end={443}>    <SceneAIEP8/></Sprite>
    </>
  );
}

const SCENES_AIEP = [0, 25.21, 77.11, 152.61, 237.35, 288.81, 358.03, 422.14];
function useSceneIndexAIEP(breaks) {
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

// ── SCENE 1 — Hook: the category rename ─────────────────
function SceneAIEP1() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const failurePoints = [
    { label: 'The model works.',       icon: '✓', color: OO_COLORS.green, delay: 4.0 },
    { label: 'The prompts work.',      icon: '✓', color: OO_COLORS.green, delay: 5.0 },
    { label: 'RAG works.',             icon: '✓', color: OO_COLORS.green, delay: 6.0 },
    { label: 'Output is still wrong.', icon: '✗', color: OO_COLORS.red,   delay: 7.5 },
  ];

  return (
    <SceneFrame>
      <SectionNumber n="00" label="THE CATEGORY" x={96} y={180}/>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 320,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 88,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', lineHeight: 1.05,
        opacity: r(0.4),
      }}>
        Every enterprise AI initiative hits{' '}
        <span style={{ color: OO_COLORS.cyan }}>the same wall.</span>
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 540 }}>
        {failurePoints.map((p, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 24,
            padding: '10px 0',
            opacity: r(p.delay),
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 36,
              color: p.color, width: 50, textAlign: 'center',
            }}>{p.icon}</div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 36,
              color: i === 3 ? OO_COLORS.ink : OO_COLORS.inkDim,
              letterSpacing:'-0.015em',
            }}>
              {p.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 130,
        opacity: r(15),
      }}>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 32,
          color: OO_COLORS.inkDim, letterSpacing:'-0.01em',
          textDecoration: 'line-through', textDecorationColor: OO_COLORS.red,
          marginBottom: 14,
        }}>
          AI coding tool
        </div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 72,
          color: OO_COLORS.ink, letterSpacing:'-0.035em', lineHeight: 1.0,
        }}>
          AI <span style={{ color: OO_COLORS.cyan }}>engineering platform.</span>
        </div>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 2 — Platform vs Assistant ─────────────────────
function SceneAIEP2() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  return (
    <SceneFrame>
      <SectionNumber n="01" label="NEW SCOPE" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 230, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 80,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', lineHeight: 1.0,
        opacity: r(0),
      }}>
        Engineer scope <span style={{ color: OO_COLORS.inkDim, fontWeight: 400 }}>→</span>{' '}
        <span style={{ color: OO_COLORS.cyan }}>org scope.</span>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 420,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80,
      }}>
        <div style={{ opacity: r(3.0) }}>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.red,
            letterSpacing:'0.22em', marginBottom: 22, textTransform: 'uppercase',
          }}>
            ASSISTANT (2024)
          </div>
          <div style={{ borderLeft: `2px solid ${OO_COLORS.red}`, paddingLeft: 28 }}>
            {['One engineer', 'One IDE', 'One function', 'Unit: completion'].map((line, i) => (
              <div key={i} style={{
                fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 30,
                color: OO_COLORS.inkDim, letterSpacing:'-0.01em',
                padding: '12px 0',
                opacity: r(3.5 + i * 0.5),
              }}>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div style={{ opacity: r(7.0) }}>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.cyan,
            letterSpacing:'0.22em', marginBottom: 22, textTransform: 'uppercase',
          }}>
            PLATFORM (2026)
          </div>
          <div style={{ borderLeft: `2px solid ${OO_COLORS.cyan}`, paddingLeft: 28 }}>
            {['Team scope', 'Org scope', 'Governed generation', 'Unit: pull request'].map((line, i) => (
              <div key={i} style={{
                fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 30,
                color: OO_COLORS.ink, letterSpacing:'-0.01em',
                padding: '12px 0',
                opacity: r(7.5 + i * 0.5),
              }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 130,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 30,
        color: OO_COLORS.ink, letterSpacing: '-0.015em',
        textAlign: 'center', lineHeight: 1.4,
        opacity: r(24),
      }}>
        A chat turn is <span style={{ color: OO_COLORS.red }}>unreviewable.</span>{' '}
        A pull request <span style={{ color: OO_COLORS.cyan }}>is.</span>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 70,
        fontFamily: OO_TYPE.mono, fontSize: 16,
        color: OO_COLORS.inkMute, letterSpacing: '0.18em',
        textAlign: 'center', textTransform: 'uppercase',
        opacity: r(35),
      }}>
        FROM $20/MO SUBSCRIPTION → ORG INFRASTRUCTURE
      </div>
    </SceneFrame>
  );
}

// ── SCENE 3 — Five Components ───────────────────────────
function SceneAIEP3() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const layers = [
    { id: '01', name: 'Context',     desc: 'ADRs · code maps · runbooks · Confluence · Jira -- weighted',     delay: 5.0 },
    { id: '02', name: 'Generation',  desc: 'retrieval + model + standards enforcement, one pipeline',         delay: 14.0 },
    { id: '03', name: 'Output',      desc: 'pull requests with citations -- not chat turns',                  delay: 26.0 },
    { id: '04', name: 'Audit',       desc: 'every interaction logged · queryable by your compliance team',    delay: 36.0 },
    { id: '05', name: 'Deployment',  desc: 'where the whole stack actually runs',                              delay: 48.0 },
  ];

  return (
    <SceneFrame>
      <SectionNumber n="02" label="FIVE LAYERS" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 230,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 76,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', lineHeight: 1.0,
        opacity: r(0),
      }}>
        Every serious platform has{' '}
        <span style={{ color: OO_COLORS.cyan }}>five components.</span>
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 400 }}>
        {layers.map((l, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '80px 320px 1fr',
            gap: 32, alignItems: 'baseline',
            padding: '18px 0',
            borderBottom: `1px solid ${OO_COLORS.rule}`,
            opacity: r(l.delay),
            transform: `translateX(${(1 - r(l.delay)) * -16}px)`,
            transition: 'transform 400ms',
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 28, color: OO_COLORS.cyan,
              letterSpacing: '0',
            }}>
              {l.id}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 44,
              color: OO_COLORS.ink, letterSpacing: '-0.025em', lineHeight: 1.0,
            }}>
              {l.name}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 24,
              color: OO_COLORS.inkDim, letterSpacing: '-0.005em', lineHeight: 1.4,
            }}>
              {l.desc}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 70,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 28,
        color: OO_COLORS.inkDim, letterSpacing: '-0.012em',
        textAlign: 'center',
        opacity: r(58),
      }}>
        Same five components.{' '}
        <span style={{ color: OO_COLORS.ink }}>Where each runs is what differs.</span>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 4 — The Paved-Road Precedent (Liberty Mutual Fusion) ──
function SceneAIEP4() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  return (
    <SceneFrame>
      <SectionNumber n="03" label="THE PRECEDENT" x={96} y={120}/>

      {/* Year stamp */}
      <div style={{
        position:'absolute', left: 96, top: 220,
        fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.cyan,
        letterSpacing: '0.22em',
        opacity: r(0.3),
      }}>
        DECEMBER 2016
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 250,
        fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 44,
        color: OO_COLORS.inkDim, letterSpacing:'-0.018em', lineHeight: 1.0,
        opacity: r(0.6),
      }}>
        A struggling Docker migration story:
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 320,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 96,
        color: OO_COLORS.ink, letterSpacing:'-0.04em', lineHeight: 1.0,
        opacity: r(1.2),
      }}>
        <span style={{ color: OO_COLORS.cyan }}>Liberty Mutual.</span>
      </div>

      {/* The Fusionfile as a code-block visual */}
      <div style={{
        position:'absolute', left: 96, top: 470, width: 720,
        background: OO_COLORS.bgPanel,
        border: `1px solid ${OO_COLORS.rule}`,
        borderRadius: 6,
        padding: '24px 28px',
        opacity: r(37),
      }}>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 12, color: OO_COLORS.cyan,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          THE FUSIONFILE
        </div>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 18, color: OO_COLORS.ink,
          lineHeight: 1.7,
        }}>
          <div>sidecars:</div>
          <div style={{ paddingLeft: 24, color: OO_COLORS.inkDim }}>upstream · downstream</div>
          <div>data:</div>
          <div style={{ paddingLeft: 24, color: OO_COLORS.inkDim }}>postgres · redis</div>
          <div>hooks:</div>
          <div style={{ paddingLeft: 24, color: OO_COLORS.inkDim }}>pre-deploy · post-deploy</div>
        </div>
      </div>

      {/* The pattern: teams declare, platform figures out the rest */}
      <div style={{
        position:'absolute', left: 880, right: 96, top: 470,
        fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 28,
        color: OO_COLORS.inkDim, letterSpacing: '-0.005em', lineHeight: 1.45,
        opacity: r(40),
      }}>
        Teams declare{' '}
        <span style={{ color: OO_COLORS.ink, fontWeight: 500 }}>what they need.</span>
        <br/>The platform figures out{' '}
        <span style={{ color: OO_COLORS.cyan, fontWeight: 500 }}>the rest.</span>
        <br/><br/>
        <span style={{ fontSize: 22, color: OO_COLORS.inkMute, fontFamily: OO_TYPE.mono, letterSpacing: '0.05em' }}>
          configuration · networking ·<br/>security · monitoring
        </span>
      </div>

      {/* The numbers */}
      <div style={{
        position:'absolute', left: 96, right: 96, top: 800,
        display: 'flex', gap: 80,
        opacity: r(60),
      }}>
        <div>
          <div style={{
            fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 72,
            color: OO_COLORS.cyan, letterSpacing: '-0.04em', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>300+</div>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 13, color: OO_COLORS.inkMute,
            letterSpacing: '0.16em', marginTop: 12, textTransform: 'uppercase',
          }}>SERVICES IN CONTAINERS</div>
        </div>
        <div>
          <div style={{
            fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 72,
            color: OO_COLORS.cyan, letterSpacing: '-0.04em', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>100s/day</div>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 13, color: OO_COLORS.inkMute,
            letterSpacing: '0.16em', marginTop: 12, textTransform: 'uppercase',
          }}>DEPLOYMENTS</div>
        </div>
        <div>
          <div style={{
            fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 72,
            color: OO_COLORS.cyan, letterSpacing: '-0.04em', lineHeight: 1,
          }}>Docker</div>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 13, color: OO_COLORS.inkMute,
            letterSpacing: '0.16em', marginTop: 12, textTransform: 'uppercase',
          }}>ENTERPRISE CASE STUDY</div>
        </div>
      </div>

      {/* Thesis line */}
      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 70,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 36,
        color: OO_COLORS.ink, letterSpacing: '-0.025em',
        textAlign: 'center', lineHeight: 1.3,
        opacity: r(80),
      }}>
        Different layer. <span style={{ color: OO_COLORS.cyan }}>Same paved-road thesis.</span>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 5 — What Changed in 2026 ──────────────────────
function SceneAIEP5() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const changes = [
    {
      n: '01',
      head: 'Vocabulary stabilized.',
      sub: 'AI coding tool → AI engineering platform',
      detail: 'Individual subscription → organizational infrastructure.',
      delay: 3.0,
    },
    {
      n: '02',
      head: 'Multi-region became table stakes.',
      sub: 'us-east-1 · October 2025',
      detail: 'Every architecture review now asks for the H A story.',
      delay: 14.0,
    },
    {
      n: '03',
      head: 'Pricing model fractured.',
      sub: 'Per-seat · per-task · fixed enterprise',
      detail: 'Customer-paid inference became the cost-transparency model.',
      delay: 25.0,
    },
  ];

  return (
    <SceneFrame>
      <SectionNumber n="04" label="WHAT CHANGED" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 220,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 76,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', lineHeight: 1.0,
        opacity: r(0),
      }}>
        Three things changed in{' '}
        <span style={{ color: OO_COLORS.cyan }}>2026.</span>
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 380 }}>
        {changes.map((c, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '100px 1fr',
            gap: 32, alignItems: 'baseline',
            padding: '22px 0',
            borderBottom: `1px solid ${OO_COLORS.rule}`,
            opacity: r(c.delay),
            transform: `translateX(${(1 - r(c.delay)) * -16}px)`,
            transition: 'transform 400ms',
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 56, color: OO_COLORS.cyan,
              letterSpacing: '0',
            }}>
              {c.n}
            </div>
            <div>
              <div style={{
                fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 42,
                color: OO_COLORS.ink, letterSpacing: '-0.025em', lineHeight: 1.05,
              }}>
                {c.head}
              </div>
              <div style={{
                fontFamily: OO_TYPE.mono, fontSize: 16,
                color: OO_COLORS.cyan, letterSpacing: '0.18em',
                marginTop: 8, textTransform: 'uppercase',
              }}>
                {c.sub}
              </div>
              <div style={{
                fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 22,
                color: OO_COLORS.inkDim, letterSpacing: '-0.005em',
                marginTop: 8, lineHeight: 1.4,
              }}>
                {c.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SceneFrame>
  );
}

// ── SCENE 6 — Four Platforms comparison table ───────────
function SceneAIEP6() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const platforms = [
    { name: 'OutcomeOps',     accent: true,  runs: 'Customer AWS (Terraform)',  unit: 'Pull request',                fit: 'Regulated enterprise · audit',     delay: 3.0 },
    { name: 'Devin',          accent: false, runs: 'Cognition cloud (SaaS)',    unit: 'Task',                        fit: 'Managed execution · no audit',     delay: 16.0 },
    { name: 'Cursor',         accent: false, runs: 'Laptop + Cursor cloud',     unit: 'File / inline edit',          fit: 'Individual engineer productivity', delay: 30.0 },
    { name: 'GitHub Copilot', accent: false, runs: 'Microsoft cloud (SaaS)',    unit: 'Completion · chat · agent',   fit: 'GitHub-native shops',              delay: 48.0 },
  ];

  return (
    <SceneFrame>
      <SectionNumber n="05" label="THE PLATFORMS" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 220,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 68,
        color: OO_COLORS.ink, letterSpacing:'-0.03em', lineHeight: 1.0,
        opacity: r(0),
      }}>
        Four platforms{' '}
        <span style={{ color: OO_COLORS.cyan }}>define the category.</span>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 380,
        display: 'grid', gridTemplateColumns: '300px 380px 320px 1fr',
        gap: 24,
        padding: '14px 0',
        borderBottom: `2px solid ${OO_COLORS.rule}`,
        opacity: r(1.0),
      }}>
        {['Platform', 'Where it runs', 'Unit of work', 'Best fit'].map((h, i) => (
          <div key={i} style={{
            fontFamily: OO_TYPE.mono, fontSize: 13, color: OO_COLORS.inkMute,
            letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>
            {h}
          </div>
        ))}
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 440 }}>
        {platforms.map((p, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '300px 380px 320px 1fr',
            gap: 24, alignItems: 'center',
            padding: '20px 0',
            borderBottom: `1px solid ${OO_COLORS.rule}`,
            opacity: r(p.delay),
            background: p.accent && r(p.delay) > 0.5 ? 'rgba(34,211,238,0.04)' : 'transparent',
          }}>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 32,
              color: p.accent ? OO_COLORS.cyan : OO_COLORS.ink,
              letterSpacing: '-0.018em',
            }}>
              {p.name}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 22,
              color: OO_COLORS.inkDim, letterSpacing: '-0.005em',
            }}>
              {p.runs}
            </div>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 18,
              color: p.accent ? OO_COLORS.cyan : OO_COLORS.ink,
              letterSpacing: '0.02em',
            }}>
              {p.unit}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 22,
              color: OO_COLORS.inkDim, letterSpacing: '-0.005em',
            }}>
              {p.fit}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 60,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 28,
        color: OO_COLORS.ink, letterSpacing: '-0.012em',
        textAlign: 'center',
        opacity: r(62),
      }}>
        Same category.{' '}
        <span style={{ color: OO_COLORS.cyan }}>Different architectural choices.</span>
      </div>
    </SceneFrame>
  );
}

// ── SCENE 7 — Five Questions checklist ──────────────────
function SceneAIEP7() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const questions = [
    { n: '1', text: 'Where does the platform run?',                    sub: 'Customer cloud · vendor cloud · laptop',           delay: 7.0,  primary: true },
    { n: '2', text: 'What is the unit of work?',                       sub: 'Completion · chat · file · task · pull request',   delay: 19.0 },
    { n: '3', text: 'What is the cost model?',                         sub: 'Per seat · per token · per task · fixed',          delay: 29.0 },
    { n: '4', text: 'What is the audit story?',                        sub: 'Queryable log: asked / retrieved / generated',     delay: 40.0 },
    { n: '5', text: 'Does the platform know your patterns?',           sub: 'Or guess them from generic best practices',         delay: 50.0 },
  ];

  return (
    <SceneFrame>
      <SectionNumber n="06" label="FIVE QUESTIONS" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 220,
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 64,
        color: OO_COLORS.ink, letterSpacing:'-0.03em', lineHeight: 1.05,
        opacity: r(0),
      }}>
        Five questions{' '}
        <span style={{ color: OO_COLORS.cyan }}>cut through the feature lists.</span>
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 360 }}>
        {questions.map((q, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '70px 1fr',
            gap: 28, alignItems: 'baseline',
            padding: '16px 0',
            borderBottom: `1px solid ${OO_COLORS.rule}`,
            opacity: r(q.delay),
            transform: `translateX(${(1 - r(q.delay)) * -12}px)`,
            transition: 'transform 400ms',
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 44,
              color: q.primary ? OO_COLORS.cyan : OO_COLORS.inkMute,
              textAlign: 'right', fontWeight: q.primary ? 700 : 500,
            }}>
              {q.n}
            </div>
            <div>
              <div style={{
                fontFamily: OO_TYPE.sans, fontWeight: q.primary ? 700 : 500,
                fontSize: 32,
                color: OO_COLORS.ink, letterSpacing: '-0.018em', lineHeight: 1.1,
              }}>
                {q.text}
              </div>
              <div style={{
                fontFamily: OO_TYPE.mono, fontSize: 14,
                color: OO_COLORS.inkMute, letterSpacing: '0.06em',
                marginTop: 6, textTransform: 'uppercase',
              }}>
                {q.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 60,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 26,
        color: OO_COLORS.ink, letterSpacing: '-0.012em',
        textAlign: 'center',
        opacity: r(55),
      }}>
        <span style={{ color: OO_COLORS.cyan }}>Question one</span>{' '}
        usually determines three and four by structural consequence.
      </div>
    </SceneFrame>
  );
}

// ── SCENE 8 — CTA ───────────────────────────────────────
function SceneAIEP8() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  return (
    <SceneFrame>
    <div style={{
      position:'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 96px',
    }}>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 44,
        color: OO_COLORS.inkDim, letterSpacing: '-0.015em', textAlign: 'center',
        opacity: r(0),
      }}>
        The model layer is increasingly commodity.
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 72,
        color: OO_COLORS.ink, letterSpacing: '-0.03em', textAlign: 'center',
        marginTop: 18, lineHeight: 1.1,
        opacity: r(2.0),
      }}>
        The <span style={{ color: OO_COLORS.cyan }}>platform layer</span> is where
        enterprise AI lives or dies.
      </div>

      <div style={{
        fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.inkMute,
        letterSpacing: '0.22em', marginTop: 64,
        opacity: r(8.0),
      }}>
        READ THE FULL GUIDE · BOOK A BRIEFING
      </div>

      <div style={{
        width: 160, height: 1, background: OO_COLORS.cyan,
        margin: '36px 0 36px',
        opacity: r(10),
      }}/>

      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 128,
        color: OO_COLORS.ink, letterSpacing: '-0.04em',
        opacity: r(10),
      }}>
        OutcomeOps<span style={{ color: OO_COLORS.cyan }}>.ai</span>
      </div>
    </div>
    </SceneFrame>
  );
}

Object.assign(window, { AiEnginPlatformCut });
