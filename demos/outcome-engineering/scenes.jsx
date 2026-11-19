// CUT-OE — WHAT IS OUTCOME ENGINEERING? (~2:10)
// 7 scenes that plant the flag: outcome engineering is a ROLE, not a
// consulting service line. Polly Generative Matthew narrates.
// Designed to outrank PwC + Cognizant for the "outcome engineering" keyword.

function OutcomeEngineeringCut() {
  return (
    <>
      <div style={{ position:'absolute', inset:0, background: OO_COLORS.bg }}/>
      <GridBG opacity={0.03}/>
      <FrameChrome label="CUT-OE // OUTCOME ENGINEERING" index={useSceneIndexOE(SCENES_OE)} total={SCENES_OE.length}/>
      <CornerMarks/>

      <Sprite start={0}      end={13.7}>  <SceneOE1/></Sprite>
      <Sprite start={13.5}   end={35.6}>  <SceneOE2/></Sprite>
      <Sprite start={35.4}   end={54.9}>  <SceneOE3/></Sprite>
      <Sprite start={54.7}   end={81.9}>  <SceneOE4/></Sprite>
      <Sprite start={81.7}   end={99.2}>  <SceneOE5/></Sprite>
      <Sprite start={99.0}   end={112.0}> <SceneOE6/></Sprite>
      <Sprite start={111.8}  end={123.5}> <SceneOE7/></Sprite>
    </>
  );
}

const SCENES_OE = [0, 13.5, 35.4, 54.7, 81.7, 99.0, 111.8];
function useSceneIndexOE(breaks) {
  const t = useTime();
  let idx = 1;
  for (let i=0; i<breaks.length; i++) if (t >= breaks[i]) idx = i + 1;
  return idx;
}

// ── SCENE 1 — Hook: "the term is everywhere" ───────────
function SceneOE1() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.5));

  const sightings = [
    { text: 'Consulting websites',  delay: 5.0 },
    { text: 'Keynote decks',        delay: 6.4 },
    { text: 'LinkedIn manifestos',  delay: 7.8 },
  ];

  return (
    <>
      <SectionNumber n="00" label="EVERYWHERE" x={96} y={180}/>

      <div style={{
        position:'absolute', left: 96, top: 320, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 132,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', lineHeight: 0.95,
        opacity: r(0.4),
      }}>
        What is{' '}
        <span style={{ color: OO_COLORS.cyan }}>outcome engineering?</span>
      </div>

      <div style={{
        position:'absolute', left: 96, top: 590,
        fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.inkMute,
        letterSpacing:'0.22em',
        opacity: r(4.0),
      }}>
        SHOWING UP EVERYWHERE
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 640 }}>
        {sightings.map((s, i) => (
          <div key={i} style={{
            fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 38,
            color: OO_COLORS.inkDim, letterSpacing:'-0.015em',
            padding: '10px 0',
            opacity: r(s.delay),
          }}>
            <span style={{ color: OO_COLORS.cyan, marginRight: 20 }}>—</span>
            {s.text}
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 110,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 44,
        color: OO_COLORS.ink, letterSpacing:'-0.02em',
        opacity: r(10.5),
      }}>
        So what does it{' '}
        <span style={{ color: OO_COLORS.cyan }}>actually</span> mean?
      </div>
    </>
  );
}

// ── SCENE 2 — Definition: not a service, not a methodology, a role ──
function SceneOE2() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.45));

  return (
    <>
      <SectionNumber n="01" label="THE DEFINITION" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 230,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 44,
        color: OO_COLORS.inkDim, letterSpacing:'-0.015em',
        opacity: r(0),
      }}>
        Outcome engineering is...
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 340 }}>
        <div style={{
          display:'grid', gridTemplateColumns:'80px 1fr',
          gap: 36, alignItems:'baseline',
          padding: '16px 0',
          opacity: r(1.6),
        }}>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 52, color: OO_COLORS.red,
            textAlign:'right',
          }}>✗</div>
          <div style={{
            fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 52,
            color: OO_COLORS.inkDim, letterSpacing:'-0.02em',
          }}>
            <span style={{ textDecoration: 'line-through', textDecorationColor: OO_COLORS.red }}>
              a consulting service
            </span>
          </div>
        </div>
        <div style={{
          display:'grid', gridTemplateColumns:'80px 1fr',
          gap: 36, alignItems:'baseline',
          padding: '16px 0',
          opacity: r(4.0),
        }}>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 52, color: OO_COLORS.red,
            textAlign:'right',
          }}>✗</div>
          <div style={{
            fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 52,
            color: OO_COLORS.inkDim, letterSpacing:'-0.02em',
          }}>
            <span style={{ textDecoration: 'line-through', textDecorationColor: OO_COLORS.red }}>
              a process methodology
            </span>
          </div>
        </div>
        <div style={{
          display:'grid', gridTemplateColumns:'80px 1fr',
          gap: 36, alignItems:'baseline',
          padding: '24px 0 16px',
          opacity: r(7.0),
        }}>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 64, color: OO_COLORS.cyan,
            textAlign:'right',
          }}>=</div>
          <div style={{
            fontFamily: OO_TYPE.sans, fontWeight: 700, fontSize: 96,
            color: OO_COLORS.ink, letterSpacing:'-0.035em',
            lineHeight: 1.0,
          }}>
            a <span style={{ color: OO_COLORS.cyan }}>role.</span>
          </div>
        </div>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 780,
        fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 32,
        color: OO_COLORS.inkDim, letterSpacing:'-0.01em', lineHeight: 1.4,
        opacity: r(11.5),
      }}>
        A new kind of engineer who owns the entire journey —
        from <span style={{ color: OO_COLORS.ink }}>business problem</span> to{' '}
        <span style={{ color: OO_COLORS.ink }}>measured result.</span>
      </div>

      <div style={{
        position:'absolute', left: 280, right: 280, bottom: 70,
        fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.inkMute,
        letterSpacing:'0.22em', marginBottom: 14,
        opacity: r(16),
      }}>
        THEY SPEAK IN
      </div>
      <div style={{
        position:'absolute', left: 280, right: 280, bottom: 30,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 28,
        color: OO_COLORS.ink, letterSpacing:'-0.01em',
        opacity: r(16),
      }}>
        <span style={{ color: OO_COLORS.cyan }}>Customer lifetime value</span>
        {' · '}
        <span style={{ color: OO_COLORS.cyan }}>Attributed revenue</span>
        {' · '}
        <span style={{ color: OO_COLORS.cyan }}>Feature adoption</span>
        <span style={{ color: OO_COLORS.inkMute }}>{'  —  not story points.'}</span>
      </div>
    </>
  );
}

// ── SCENE 3 — The Shift: handoff vs ownership ──────────
function SceneOE3() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const oldWay = [
    'Receive the user story',
    'Implement the spec',
    'Ship the code',
  ];
  const newWay = [
    'Identify the business problem',
    'Define the metric',
    'Ship the result',
  ];

  return (
    <>
      <SectionNumber n="02" label="THE SHIFT" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 230, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 48,
        color: OO_COLORS.ink, letterSpacing:'-0.02em', lineHeight: 1.15,
        opacity: r(0),
      }}>
        For thirty years, an engineer&apos;s job was to{' '}
        <span style={{ color: OO_COLORS.inkDim }}>deliver a feature.</span>
      </div>

      {/* Two columns */}
      <div style={{
        position:'absolute', left: 96, right: 96, top: 420,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80,
      }}>
        {/* OLD */}
        <div style={{ opacity: r(3.0) }}>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.red,
            letterSpacing:'0.22em', marginBottom: 24,
          }}>
            TRADITIONAL ENGINEER
          </div>
          <div style={{ borderLeft: `2px solid ${OO_COLORS.red}`, paddingLeft: 32 }}>
            {oldWay.map((line, i) => (
              <div key={i} style={{
                fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 32,
                color: OO_COLORS.inkDim, letterSpacing:'-0.01em',
                padding: '14px 0',
                opacity: r(3.6 + i * 0.6),
              }}>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* NEW */}
        <div style={{ opacity: r(7.0) }}>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.cyan,
            letterSpacing:'0.22em', marginBottom: 24,
          }}>
            OUTCOME ENGINEER
          </div>
          <div style={{ borderLeft: `2px solid ${OO_COLORS.cyan}`, paddingLeft: 32 }}>
            {newWay.map((line, i) => (
              <div key={i} style={{
                fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 32,
                color: OO_COLORS.ink, letterSpacing:'-0.01em',
                padding: '14px 0',
                opacity: r(7.6 + i * 0.6),
              }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 90,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 32,
        color: OO_COLORS.ink, letterSpacing:'-0.015em',
        textAlign: 'center', lineHeight: 1.35,
        opacity: r(14),
      }}>
        When implementation is{' '}
        <span style={{ color: OO_COLORS.cyan }}>AI-assisted and effectively free,</span>
        {' '}the bottleneck shifts — to intent, to taste, to ownership.
      </div>
    </>
  );
}

// ── SCENE 4 — Three Pillars ────────────────────────────
function SceneOE4() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const pillars = [
    {
      n: '01',
      title: 'Business\nFluency',
      body: 'They translate KPIs natively. No product owner in the middle.',
      tag: 'CLV · CAC · ARR',
      delay: 3.0,
    },
    {
      n: '02',
      title: 'Context\nMastery',
      body: 'Organizational knowledge as a queryable layer — ADRs, code-maps, institutional memory captured in vectors.',
      tag: 'CONTEXT ENGINEERING',
      delay: 10.0,
    },
    {
      n: '03',
      title: 'AI\nOrchestration',
      body: 'AI is a teammate grounded in their organization. Not a chatbot generating snippets.',
      tag: 'GROUNDED · NOT GUESSING',
      delay: 17.0,
    },
  ];

  return (
    <>
      <SectionNumber n="03" label="THREE PILLARS" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 230, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 52,
        color: OO_COLORS.ink, letterSpacing:'-0.02em',
        opacity: r(0),
      }}>
        Outcome engineering rests on{' '}
        <span style={{ color: OO_COLORS.cyan, fontWeight: 500 }}>three pillars.</span>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 400,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 56,
      }}>
        {pillars.map((p, i) => (
          <div key={i} style={{
            opacity: r(p.delay),
            borderTop: `1px solid ${OO_COLORS.rule}`,
            paddingTop: 28,
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 64, color: OO_COLORS.cyan,
              letterSpacing:'0',
              marginBottom: 24,
            }}>
              {p.n}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 56,
              color: OO_COLORS.ink, letterSpacing:'-0.025em',
              lineHeight: 1.0, whiteSpace: 'pre-line',
              marginBottom: 32,
            }}>
              {p.title}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 24,
              color: OO_COLORS.inkDim, letterSpacing:'-0.005em', lineHeight: 1.45,
              marginBottom: 36, minHeight: 140,
            }}>
              {p.body}
            </div>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 13, color: OO_COLORS.cyan,
              letterSpacing:'0.18em',
            }}>
              {p.tag}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 70,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 32,
        color: OO_COLORS.inkDim, letterSpacing:'-0.015em', textAlign: 'center',
        opacity: r(23.5),
      }}>
        Three pillars.{' '}
        <span style={{ color: OO_COLORS.cyan }}>One outcome owner.</span>
      </div>
    </>
  );
}

// ── SCENE 5 — Metrics Diff ─────────────────────────────
function SceneOE5() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const devops = [
    '10 deployments per week',
    '99.9% uptime',
    'MTTR under 1 hour',
  ];
  const outcome = [
    'Feature adoption hit 73%',
    'Churn down 12 points',
    'Time-to-learning: 48h',
  ];

  return (
    <>
      <SectionNumber n="04" label="WHAT THEY CELEBRATE" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 230, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 52,
        color: OO_COLORS.ink, letterSpacing:'-0.02em',
        opacity: r(0),
      }}>
        DevOps teams celebrated{' '}
        <span style={{ color: OO_COLORS.inkDim }}>deployments.</span>
      </div>
      <div style={{
        position:'absolute', left: 96, top: 310, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 52,
        color: OO_COLORS.cyan, letterSpacing:'-0.02em',
        opacity: r(2.0),
      }}>
        Outcome engineers celebrate <span style={{ color: OO_COLORS.ink }}>revenue.</span>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 470,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80,
      }}>
        <div style={{
          background: OO_COLORS.bgPanel,
          padding: '36px 40px', borderRadius: 4,
          opacity: r(4.5),
        }}>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 13, color: OO_COLORS.inkMute,
            letterSpacing:'0.22em', marginBottom: 22,
          }}>
            DEVOPS CELEBRATED
          </div>
          {devops.map((line, i) => (
            <div key={i} style={{
              fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 30,
              color: OO_COLORS.inkDim, letterSpacing:'-0.01em',
              padding: '10px 0',
              opacity: r(5.0 + i * 0.5),
            }}>
              {line}
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(34,211,238,0.05)',
          padding: '36px 40px', borderRadius: 4,
          border: `1px solid rgba(34,211,238,0.18)`,
          opacity: r(8.5),
        }}>
          <div style={{
            fontFamily: OO_TYPE.mono, fontSize: 13, color: OO_COLORS.cyan,
            letterSpacing:'0.22em', marginBottom: 22,
          }}>
            OUTCOME ENGINEERS CELEBRATE
          </div>
          {outcome.map((line, i) => (
            <div key={i} style={{
              fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 30,
              color: OO_COLORS.ink, letterSpacing:'-0.01em',
              padding: '10px 0',
              opacity: r(9.0 + i * 0.5),
            }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 80,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 36,
        color: OO_COLORS.ink, letterSpacing:'-0.02em',
        textAlign: 'center', lineHeight: 1.3,
        opacity: r(11),
      }}>
        The C-suite never cared how many times you deployed.<br/>
        <span style={{ color: OO_COLORS.cyan }}>They care if revenue is up.</span>
      </div>
    </>
  );
}

// ── SCENE 6 — Proof: F500 numbers ──────────────────────
function SceneOE6() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const stats = [
    { value: '16h → 20m', label: 'TASK COMPLETION',      delay: 1.5 },
    { value: '$2.24',     label: 'PER FEATURE',           delay: 3.0 },
    { value: '90%',       label: 'FIRST-TIME APPROVAL',   delay: 4.5 },
    { value: 'F500',      label: 'SCALE',                 delay: 6.0 },
  ];

  return (
    <>
      <SectionNumber n="05" label="THE NUMBERS" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 240, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 48,
        color: OO_COLORS.inkDim, letterSpacing:'-0.015em',
        opacity: r(0),
      }}>
        This is <span style={{ color: OO_COLORS.ink }}>not a hypothesis.</span>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 400,
        display:'flex', gap: 24,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            flex: 1, borderTop: `1px solid ${OO_COLORS.rule}`, paddingTop: 32,
            opacity: r(s.delay),
          }}>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 96,
              color: OO_COLORS.ink, letterSpacing:'-0.045em', lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {s.value}
            </div>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 13, color: OO_COLORS.cyan,
              letterSpacing:'0.16em', marginTop: 24,
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', right: 96, bottom: 80,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 36,
        color: OO_COLORS.ink, letterSpacing:'-0.02em', textAlign: 'right',
        opacity: r(8.5),
      }}>
        Production data.{' '}
        <span style={{ color: OO_COLORS.cyan }}>Not whitepapers.</span>
      </div>
    </>
  );
}

// ── SCENE 7 — CTA ──────────────────────────────────────
function SceneOE7() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  return (
    <div style={{
      position:'absolute', inset: 0,
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 44,
        color: OO_COLORS.inkDim, letterSpacing:'-0.015em', textAlign:'center',
        opacity: r(0),
      }}>
        The question isn&apos;t whether to adopt it.
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 72,
        color: OO_COLORS.ink, letterSpacing:'-0.03em', textAlign:'center',
        marginTop: 24, lineHeight: 1.1, maxWidth: 1400,
        opacity: r(2.0),
      }}>
        It&apos;s whether your platform{' '}
        <span style={{ color: OO_COLORS.cyan }}>supports it.</span>
      </div>
      <div style={{
        width: 160, height: 1, background: OO_COLORS.cyan,
        margin: '56px 0 40px',
        opacity: r(5.0),
      }}/>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 120,
        color: OO_COLORS.ink, letterSpacing:'-0.04em',
        opacity: r(5.0),
      }}>
        OutcomeOps<span style={{ color: OO_COLORS.cyan }}>.ai</span>
      </div>
      <div style={{
        fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.inkMute,
        letterSpacing:'0.22em', marginTop: 28,
        opacity: r(7.0),
      }}>
        BUILT FOR THE OUTCOME ENGINEER
      </div>
    </div>
  );
}

Object.assign(window, { OutcomeEngineeringCut });
