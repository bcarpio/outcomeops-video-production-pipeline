// CUT-O — ORIGIN STORY (channel anchor, 3:30)
// 9 scenes documenting the 14-year arc from Nibiru to OutcomeOps.
// Drew @ speed 1.0. Designed to be embedded on outcomeops.ai/about.

function OriginCut() {
  return (
    <>
      <div style={{ position:'absolute', inset:0, background: OO_COLORS.bg }}/>
      <GridBG opacity={0.03}/>
      <FrameChrome label="CUT-O // ORIGIN" index={useSceneIndexO(SCENES_O)} total={SCENES_O.length}/>
      <CornerMarks/>

      <Sprite start={0}     end={13.3}>  <SceneO1/></Sprite>
      <Sprite start={13.1}  end={45.0}>  <SceneO2/></Sprite>
      <Sprite start={44.8}  end={91.9}>  <SceneO3/></Sprite>
      <Sprite start={91.7}  end={116.3}> <SceneO4/></Sprite>
      <Sprite start={116.1} end={141.3}> <SceneO5/></Sprite>
      <Sprite start={141.1} end={172.3}> <SceneO6/></Sprite>
      <Sprite start={172.1} end={205.2}> <SceneO7/></Sprite>
      <Sprite start={205.0} end={226.2}> <SceneO8/></Sprite>
      <Sprite start={226.0} end={236}>   <SceneO9/></Sprite>
    </>
  );
}

const SCENES_O = [0, 13.1, 44.8, 91.7, 116.1, 141.1, 172.1, 205.0, 226.0];
function useSceneIndexO(breaks) {
  const t = useTime();
  let idx = 1;
  for (let i=0; i<breaks.length; i++) if (t >= breaks[i]) idx = i + 1;
  return idx;
}

// ── SCENE 1 — Provocation ──────────────────────────────
function SceneO1() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.5));
  return (
    <>
      <SectionNumber n="00" label="THE WARNING" x={96} y={180}/>
      <div style={{
        position:'absolute', left: 96, top: 320, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 200,
        color: OO_COLORS.ink, letterSpacing:'-0.04em', lineHeight: 0.95,
        opacity: r(0.4),
      }}>
        DevOps is <span style={{ color: OO_COLORS.red }}>dead.</span>
      </div>
      <div style={{
        position:'absolute', left: 96, top: 600, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 44,
        color: OO_COLORS.inkDim, letterSpacing:'-0.015em', lineHeight: 1.3,
        maxWidth: 1500,
        opacity: r(3.0),
      }}>
        Not because the ideas were wrong — because the implementation lost the plot.
      </div>
      <div style={{
        position:'absolute', left: 96, top: 800, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 64,
        color: OO_COLORS.ink, letterSpacing:'-0.025em',
        opacity: r(11),
      }}>
        AI is now becoming <span style={{ color: OO_COLORS.cyan }}>the new waste.</span>
      </div>
    </>
  );
}

// ── SCENE 2 — The First Commit ─────────────────────────
function SceneO2() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.5));
  return (
    <>
      <SectionNumber n="01" label="THE FIRST COMMIT" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 240,
        fontFamily: OO_TYPE.mono, fontSize: 18, color: OO_COLORS.cyan, letterSpacing:'0.22em',
        opacity: r(0),
      }}>
        AUGUST 18, 2012
      </div>
      <div style={{
        position:'absolute', left: 96, top: 290,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 88,
        color: OO_COLORS.ink, letterSpacing:'-0.03em', lineHeight: 1,
        opacity: r(0.5),
      }}>
        First commit.{' '}
        <span style={{
          color: OO_COLORS.cyan, fontFamily: OO_TYPE.mono,
          fontSize: 60, letterSpacing: 0,
        }}>awsdeploy</span>
      </div>

      <div style={{
        position:'absolute', left: 96, top: 460, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 36,
        color: OO_COLORS.inkDim, letterSpacing:'-0.01em', lineHeight: 1.4,
        maxWidth: 1700,
        opacity: r(5),
      }}>
        <span style={{ color: OO_COLORS.ink, fontWeight: 500 }}>Pearson's CIO</span>{' '}
        had given a simple directive: take us to the cloud.
      </div>

      <div style={{
        position:'absolute', left: 96, top: 580,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 44,
        color: OO_COLORS.inkDim, letterSpacing:'-0.015em',
        opacity: r(13),
      }}>
        Three months later, that script had a name.
      </div>
      <div style={{
        position:'absolute', left: 96, top: 660,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 144,
        color: OO_COLORS.cyan, letterSpacing:'-0.04em', lineHeight: 1,
        opacity: r(15),
      }}>
        Nibiru.
      </div>

      <div style={{
        position:'absolute', left: 96, bottom: 100, right: 96,
        opacity: r(24),
      }}>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.inkMute,
          letterSpacing:'0.22em', marginBottom: 18,
        }}>
          70 TEAMS · 3 REGIONS · ZERO TICKETS
        </div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 36,
          color: OO_COLORS.ink, letterSpacing:'-0.015em', lineHeight: 1.4,
        }}>
          The configuration was <span style={{ color: OO_COLORS.cyan }}>opinionated.</span>{' '}
          The naming convention was <span style={{ color: OO_COLORS.cyan }}>queryable.</span>{' '}
          The standards were <span style={{ color: OO_COLORS.cyan }}>structural</span> — not documents, infrastructure.
        </div>
      </div>
    </>
  );
}

// ── SCENE 3 — The Pattern (5 customers, 14 years) ──────
function SceneO3() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const customers = [
    { year: '2012', name: 'PEARSON',         outcome: 'Nibiru — push-button cloud',          delay: 0.5  },
    { year: '2014', name: 'AETNA',           outcome: '0.05% defect density · Docker mandate', delay: 3 },
    { year: '2016', name: 'LIBERTY MUTUAL',  outcome: "Fusion — Docker's leading case study", delay: 9  },
    { year: '2019', name: 'COMCAST',         outcome: 'SEED — zero Terraform, dev to prod in minutes', delay: 12 },
    { year: '2022', name: 'GILEAD SCIENCES', outcome: 'Full AWS transformation · 55 engineers · re:Invent 2023 keynote · early Bedrock', delay: 19 },
  ];

  return (
    <>
      <SectionNumber n="02" label="THE PATTERN" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 230, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
        color: OO_COLORS.ink, letterSpacing:'-0.025em', lineHeight: 1.1,
        opacity: r(0),
      }}>
        Then I built the <span style={{ color: OO_COLORS.cyan, fontWeight: 500 }}>same product</span> four more times.
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 380 }}>
        {customers.map((c, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns: '160px 380px 1fr',
            gap: 32, alignItems: 'baseline',
            padding: '20px 0', borderBottom: `1px solid ${OO_COLORS.rule}`,
            opacity: r(c.delay),
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 32, color: OO_COLORS.cyan,
              letterSpacing:'0.05em',
            }}>
              {c.year}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 36,
              color: OO_COLORS.ink, letterSpacing:'-0.015em',
            }}>
              {c.name}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 30,
              color: OO_COLORS.inkDim, letterSpacing:'-0.01em',
            }}>
              {c.outcome}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 90,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 48,
        color: OO_COLORS.ink, letterSpacing:'-0.02em', textAlign: 'center',
        lineHeight: 1.25,
        opacity: r(27),
      }}>
        The tools change.{' '}
        <span style={{ color: OO_COLORS.cyan }}>The failure mode doesn't.</span>
      </div>
    </>
  );
}

// ── SCENE 4 — Four Phases ──────────────────────────────
function SceneO4() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const phases = [
    { n: '1', label: 'Individual productivity',           delay: 3   },
    { n: '2', label: 'Local optimization',                delay: 5   },
    { n: '3', label: 'The reckoning',                     delay: 7,  color: OO_COLORS.amber },
    { n: '4', label: 'Organizational intelligence wins',  delay: 9,  color: OO_COLORS.cyan },
  ];

  return (
    <>
      <SectionNumber n="03" label="FOUR PHASES" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 240, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
        color: OO_COLORS.ink, letterSpacing:'-0.025em',
        opacity: r(0),
      }}>
        Every platform shift goes through{' '}
        <span style={{ color: OO_COLORS.cyan, fontWeight: 500 }}>four phases.</span>
      </div>

      {/* Left column — phases (constrained width so right column has room) */}
      <div style={{ position:'absolute', left: 96, width: 1100, top: 380 }}>
        {phases.map((p, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns: '140px 1fr',
            gap: 48, alignItems: 'baseline',
            padding: '24px 0',
            opacity: r(p.delay),
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 80,
              color: p.color || OO_COLORS.inkDim, letterSpacing:'0',
              textAlign:'right',
            }}>
              0{p.n}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 48,
              color: p.color || OO_COLORS.ink, letterSpacing:'-0.02em',
              whiteSpace: 'nowrap',
            }}>
              {p.label}
            </div>
          </div>
        ))}
      </div>

      {/* Right column — the spine line, parallel to phases */}
      <div style={{
        position:'absolute', left: 1240, right: 96, top: 380, height: 560,
        display:'flex', flexDirection:'column', justifyContent:'center',
        opacity: r(17),
      }}>
        <div style={{
          width: 80, height: 1, background: OO_COLORS.cyan, marginBottom: 36,
        }}/>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 52,
          color: OO_COLORS.ink, letterSpacing:'-0.025em', lineHeight: 1.15,
        }}>
          Make the right path<br/>
          the <span style={{ color: OO_COLORS.cyan }}>easy path.</span>
        </div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 52,
          color: OO_COLORS.ink, letterSpacing:'-0.025em', lineHeight: 1.15,
          marginTop: 56,
        }}>
          Replace gatekeepers<br/>
          with <span style={{ color: OO_COLORS.cyan }}>guardrails.</span>
        </div>
      </div>
    </>
  );
}

// ── SCENE 5 — Phase 3 / The Reckoning ──────────────────
function SceneO5() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));

  const pains = [
    { text: "Every team writing prompts",                       delay: 2.0 },
    { text: "Every team reinventing context",                    delay: 3.5 },
    { text: "Vibe coding looks good in Reels — doesn't ship",    delay: 5.0 },
    { text: "AI hallucinating patterns nobody approved",         delay: 7.0 },
    { text: "Production incidents · Compliance violations",      delay: 9.0 },
  ];

  return (
    <>
      <SectionNumber n="04" label="WHERE WE ARE" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 220,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
        color: OO_COLORS.inkDim, letterSpacing:'-0.02em',
        opacity: r(0),
      }}>
        AI is in
      </div>
      <div style={{
        position:'absolute', left: 96, top: 310,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 200,
        color: OO_COLORS.amber, letterSpacing:'-0.04em', lineHeight: 1,
        opacity: r(0.4),
      }}>
        Phase 3
      </div>
      <div style={{
        position:'absolute', left: 96, top: 530,
        fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.amber,
        letterSpacing:'0.22em',
        opacity: r(0.4),
      }}>
        — THE RECKONING
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 620 }}>
        {pains.map((p, i) => (
          <div key={i} style={{
            fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 30,
            color: OO_COLORS.inkDim, letterSpacing:'-0.01em',
            padding: '11px 0',
            borderBottom: `1px solid ${OO_COLORS.ruleSoft}`,
            opacity: r(p.delay),
          }}>
            <span style={{ color: OO_COLORS.red, marginRight: 16 }}>—</span>
            {p.text}
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 60,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 44,
        color: OO_COLORS.ink, letterSpacing:'-0.02em', textAlign: 'center',
        opacity: r(13),
      }}>
        The tools changed.{' '}
        <span style={{ color: OO_COLORS.cyan }}>The failure mode didn't.</span>
      </div>
    </>
  );
}

// ── SCENE 6 — The Answer ───────────────────────────────
function SceneO6() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.5));

  return (
    <>
      <SectionNumber n="05" label="THE ANSWER" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 220,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 96,
        color: OO_COLORS.ink, letterSpacing:'-0.04em', lineHeight: 1,
        opacity: r(0),
      }}>
        OutcomeOps<span style={{ color: OO_COLORS.cyan }}>.</span>
      </div>
      <div style={{
        position:'absolute', left: 96, top: 350,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 36,
        color: OO_COLORS.inkDim, letterSpacing:'-0.01em',
        opacity: r(2),
      }}>
        Nibiru, 14 years later. One abstraction up.
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 460 }}>
        {[
          { label: 'ADRs',          arrow: '→', body: 'become queryable',                   delay: 6  },
          { label: 'Code-maps',     arrow: '→', body: 'codebase reasons about itself',      delay: 9  },
          { label: 'AI generation', arrow: '→', body: 'queries your standards first',        delay: 12 },
        ].map((m, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns: '320px 60px 1fr',
            gap: 32, alignItems: 'baseline',
            padding: '14px 0',
            opacity: r(m.delay),
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 28, color: OO_COLORS.cyan,
              letterSpacing:'0.05em',
            }}>
              {m.label}
            </div>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 28, color: OO_COLORS.inkMute,
              textAlign: 'center',
            }}>
              {m.arrow}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 32,
              color: OO_COLORS.ink, letterSpacing:'-0.01em',
            }}>
              {m.body}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 760,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 84,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', textAlign: 'center',
        lineHeight: 1.1,
        opacity: r(19),
      }}>
        Documentation is the <span style={{ color: OO_COLORS.cyan }}>runtime.</span>
      </div>
      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 100,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 36,
        color: OO_COLORS.inkDim, letterSpacing:'-0.015em', textAlign: 'center',
        opacity: r(24),
      }}>
        Code is the execution layer beneath it.
      </div>
    </>
  );
}

// ── SCENE 7 — Convergence (Anthropic + Cory Ondrejka) ──
function SceneO7() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.45));

  const validations = [
    {
      date: 'DECEMBER 2025',
      headline: '"Build skills, not agents."',
      attribution: 'Anthropic',
      counter: "We'd been shipping ADRs at F500 scale since mid-2025.",
      delay: 0,
    },
    {
      date: 'FEBRUARY 2026',
      headline: 'Outcome Engineering manifesto',
      attribution: 'Cory Ondrejka — the engineer who saved Meta',
      counter: "We'd been building the implementation since July.",
      delay: 8,
    },
  ];

  return (
    <>
      <SectionNumber n="06" label="CONVERGENCE" x={96} y={120}/>

      <div style={{ position:'absolute', left: 96, right: 96, top: 240 }}>
        {validations.map((v, i) => (
          <div key={i} style={{
            marginBottom: 56,
            opacity: r(v.delay),
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.cyan,
              letterSpacing:'0.22em', marginBottom: 16,
            }}>
              {v.date}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 64,
              color: OO_COLORS.ink, letterSpacing:'-0.03em', lineHeight: 1.05,
              marginBottom: 12,
            }}>
              {v.headline}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 24,
              color: OO_COLORS.inkDim, letterSpacing:'-0.005em',
              marginBottom: 16,
            }}>
              — {v.attribution}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 28,
              color: OO_COLORS.cyan, letterSpacing:'-0.01em',
              borderLeft: `2px solid ${OO_COLORS.cyan}`,
              paddingLeft: 20,
            }}>
              {v.counter}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 80,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 48,
        color: OO_COLORS.ink, letterSpacing:'-0.025em', textAlign: 'center',
        opacity: r(16),
      }}>
        Independent convergence.
      </div>
    </>
  );
}

// ── SCENE 8 — The Numbers ──────────────────────────────
function SceneO8() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  const stats = [
    { value: '16h → 20m', label: 'TASK COMPLETION',     delay: 1   },
    { value: '$2.24',     label: 'PER FEATURE',          delay: 3   },
    { value: '90%',       label: 'FIRST-TIME APPROVAL',  delay: 5   },
    { value: '90 / 120',  label: 'LAMBDAS / DAYS · SOLO', delay: 7  },
  ];

  return (
    <>
      <SectionNumber n="07" label="THE NUMBERS" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 240, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 48,
        color: OO_COLORS.inkDim, letterSpacing:'-0.015em',
        opacity: r(0),
      }}>
        What encoded knowledge actually ships.
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, top: 380,
        display:'flex', gap: 24,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            flex: 1, borderTop: `1px solid ${OO_COLORS.rule}`, paddingTop: 32,
            opacity: r(s.delay),
          }}>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 88,
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
        position:'absolute', left: 96, top: 720, right: 96,
        opacity: r(10),
      }}>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 56,
          color: OO_COLORS.ink, letterSpacing:'-0.025em',
        }}>
          <span style={{ color: OO_COLORS.cyan }}>6 days</span> from domain registration to paying customers.
        </div>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.inkMute,
          letterSpacing:'0.16em', marginTop: 12,
        }}>
          RETRIEVEIT.AI · MULTI-TENANT SAAS
        </div>
      </div>

      <div style={{
        position:'absolute', right: 96, bottom: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 36,
        color: OO_COLORS.ink, letterSpacing:'-0.02em', textAlign: 'right',
        opacity: r(15),
      }}>
        Production data.{' '}
        <span style={{ color: OO_COLORS.cyan }}>Not whitepapers.</span>
      </div>
    </>
  );
}

// ── SCENE 9 — CTA Lockup ───────────────────────────────
function SceneO9() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));
  return (
    <div style={{
      position:'absolute', inset:0,
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
        color: OO_COLORS.inkDim, letterSpacing:'-0.02em', textAlign:'center',
        opacity: r(0),
      }}>
        The pattern keeps repeating.
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 88,
        color: OO_COLORS.ink, letterSpacing:'-0.035em', textAlign:'center',
        marginTop: 28, lineHeight: 1.1,
        opacity: r(2),
      }}>
        Encode the <span style={{ color: OO_COLORS.cyan }}>knowledge.</span>
      </div>
      <div style={{
        width: 160, height: 1, background: OO_COLORS.cyan,
        margin: '64px 0 40px',
        opacity: r(5),
      }}/>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 132,
        color: OO_COLORS.ink, letterSpacing:'-0.04em',
        opacity: r(5),
      }}>
        OutcomeOps<span style={{ color: OO_COLORS.cyan }}>.ai</span>
      </div>
    </div>
  );
}

Object.assign(window, { OriginCut });
