// Variation A: "YOUR CODE NEVER LEAVES"
// Angle: IP exfiltration / runs in your cloud — provocative.
// Duration: 46s. 8 scenes. (Extended from the Designer bundle's original
// 32s so Drew's narration has breathing room between beats. Scene 8
// holds for ~6s to cover the CTA voice-over.)

function VariationA() {
  return (
    <>
      {/* Base chrome — always on */}
      <div style={{ position:'absolute', inset:0, background: OO_COLORS.bg }}/>
      <GridBG/>
      <FrameChrome label="CUT-A // YOUR-CODE-NEVER-LEAVES" index={useSceneIndex(SCENES_A)} total={SCENES_A.length}/>
      <CornerMarks/>

      {/* SCENE 1 — Opening provocation (0–7s) */}
      <Sprite start={0} end={7.2}>
        <SceneA1/>
      </Sprite>

      {/* SCENE 2 — "Everyone else" exfil (7–15s) */}
      <Sprite start={7} end={15.2}>
        <SceneA2/>
      </Sprite>

      {/* SCENE 3 — The compliance price tag (15–21s) */}
      <Sprite start={15} end={21.2}>
        <SceneA3/>
      </Sprite>

      {/* SCENE 4 — Cut: "So we built it differently" (20.5–22s) */}
      <Sprite start={20.5} end={22.2}>
        <SceneA4/>
      </Sprite>

      {/* SCENE 5 — Architecture — runs in your VPC (22–30s) */}
      <Sprite start={22} end={30.2}>
        <SceneA5/>
      </Sprite>

      {/* SCENE 6 — Proof stats (30–36.5s) */}
      <Sprite start={30} end={36.7}>
        <SceneA6/>
      </Sprite>

      {/* SCENE 7 — Closing statement (36.5–40s) */}
      <Sprite start={36.5} end={40.2}>
        <SceneA7/>
      </Sprite>

      {/* SCENE 8 — Lockup + CTA voice-over (40–46s) */}
      <Sprite start={40} end={46}>
        <SceneA8/>
      </Sprite>
    </>
  );
}

const SCENES_A = [0, 7, 15, 20.5, 22, 30, 36.5, 40];
function useSceneIndex(breaks) {
  const t = useTime();
  let idx = 1;
  for (let i=0; i<breaks.length; i++) if (t >= breaks[i]) idx = i + 1;
  return idx;
}

// ── SCENE 1 ─────────────────────────────────────────
function SceneA1() {
  const { progress, localTime } = useSprite();
  const lineWidth = Math.min(1, progress * 3) * 820;
  return (
    <>
      <SectionNumber n="01" label="A PROVOCATION" x={960 - 120} y={360}/>
      <div style={{
        position:'absolute', left: 960, top: 430,
        transform:'translateX(-50%)',
        width: lineWidth, height: 1, background: OO_COLORS.cyan,
        boxShadow: `0 0 20px ${OO_COLORS.cyan}`,
      }}/>
      <div style={{
        position:'absolute', left:0, right:0, top: 480,
        textAlign:'center',
        fontFamily: OO_TYPE.sans,
        fontWeight: 300, fontSize: 84,
        color: OO_COLORS.ink, letterSpacing: '-0.03em', lineHeight: 1,
        opacity: Math.min(1, Math.max(0, (localTime - 0.6) / 0.5)),
        transform: `translateY(${Math.max(0, 20 - localTime*40)}px)`,
      }}>
        Every time your engineers
      </div>
      <div style={{
        position:'absolute', left:0, right:0, top: 580,
        textAlign:'center',
        fontFamily: OO_TYPE.sans,
        fontWeight: 600, fontSize: 104,
        letterSpacing: '-0.035em', lineHeight: 1,
        opacity: Math.min(1, Math.max(0, (localTime - 1.3) / 0.5)),
      }}>
        <span style={{ color: OO_COLORS.ink }}>prompt an AI,</span>
      </div>
      <div style={{
        position:'absolute', left:0, right:0, top: 700,
        textAlign:'center',
        fontFamily: OO_TYPE.sans,
        fontWeight: 600, fontSize: 104,
        letterSpacing: '-0.035em', lineHeight: 1,
        opacity: Math.min(1, Math.max(0, (localTime - 2.2) / 0.5)),
      }}>
        <span style={{ color: OO_COLORS.red }}>your IP leaves the building.</span>
      </div>
    </>
  );
}

// ── SCENE 2 — Exfil diagram ────────────────────────
function SceneA2() {
  const { localTime } = useSprite();
  const reveal = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));

  // Flowing packets from VPC -> cloud AI vendor
  const packets = [0, 0.35, 0.7, 1.05, 1.4, 1.75, 2.1, 2.45];
  return (
    <>
      <SectionNumber n="02" label="THE DEFAULT" x={96} y={180}/>
      <div style={{
        position:'absolute', left: 96, top: 230,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 52,
        color: OO_COLORS.ink, letterSpacing: '-0.02em', lineHeight: 1.05,
        maxWidth: 720, opacity: reveal(0),
      }}>
        Copilot, Cursor, ChatGPT —<br/>
        every keystroke is <span style={{ color: OO_COLORS.red, fontWeight: 500 }}>a round trip</span> to
        someone else's datacenter.
      </div>

      {/* Diagram */}
      <div style={{ position:'absolute', left: 240, top: 555, fontFamily: OO_TYPE.mono, color: OO_COLORS.inkDim, fontSize: 16, letterSpacing:'0.15em' }}>
        YOUR VPC
      </div>
      <div style={{
        position:'absolute', left: 240, top: 590, width: 560, height: 240,
        border: `1px solid ${OO_COLORS.rule}`, borderRadius: 4,
        background: 'rgba(255,255,255,0.015)',
        opacity: reveal(0.3),
      }}>
        <div style={{ padding: 28, fontFamily: OO_TYPE.mono, color: OO_COLORS.inkDim, fontSize: 18, lineHeight: 1.8 }}>
          <div>proprietary/</div>
          <div>  pricing-engine.py</div>
          <div>  claims-processor/</div>
          <div>  risk-model.ipynb</div>
          <div style={{ color: OO_COLORS.amber }}>  patient-data.sql</div>
        </div>
      </div>

      <div style={{
        position:'absolute', left: 1120, top: 555,
        fontFamily: OO_TYPE.mono, color: OO_COLORS.red, fontSize: 16, letterSpacing:'0.15em',
        opacity: reveal(0.6),
      }}>
        3RD-PARTY LLM INFRA
      </div>
      <div style={{
        position:'absolute', left: 1120, top: 590, width: 560, height: 240,
        border: `1px solid ${OO_COLORS.red}`, borderRadius: 4,
        background: 'rgba(248,113,113,0.05)',
        opacity: reveal(0.6),
      }}>
        <div style={{ padding: 28, fontFamily: OO_TYPE.mono, color: OO_COLORS.red, fontSize: 18, lineHeight: 1.8 }}>
          <div>logs/</div>
          <div>  tenant_A/prompts.jsonl</div>
          <div>  tenant_A/completions.jsonl</div>
          <div>  training_set_2026.tar</div>
          <div style={{ color: '#fff' }}>  ...your code.</div>
        </div>
      </div>

      {/* Flowing packets */}
      {packets.map((d, i) => {
        const p = Math.min(1, Math.max(0, (localTime - 0.8 - d) / 1.8));
        if (p <= 0 || p >= 1) return null;
        const x = 800 + (1120 - 800) * p;
        const opacity = Math.sin(p * Math.PI);
        return (
          <div key={i} style={{
            position:'absolute', left: x, top: 710,
            width: 16, height: 2, background: OO_COLORS.red, opacity,
            boxShadow: `0 0 8px ${OO_COLORS.red}`,
          }}/>
        );
      })}

      {/* Arrow line */}
      <div style={{
        position:'absolute', left: 800, top: 711, width: 320, height: 1,
        background: `linear-gradient(90deg, transparent, ${OO_COLORS.rule}, transparent)`,
        opacity: reveal(0.3),
      }}/>
    </>
  );
}

// ── SCENE 3 — Compliance price tag ─────────────────
function SceneA3() {
  const { localTime } = useSprite();
  const reveal = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));

  const items = [
    { law: 'HIPAA',     cost: '$1.5M', what: '/ violation' },
    { law: 'SOX',       cost: '$5M',   what: 'avg settlement' },
    { law: 'GDPR Art.32', cost: '€20M', what: 'or 4% revenue' },
    { law: 'FedRAMP',   cost: 'ATO revoked', what: 'zero notice' },
  ];

  return (
    <>
      <SectionNumber n="03" label="THE BILL" x={96} y={180}/>
      <div style={{
        position:'absolute', left: 96, top: 230,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 52,
        color: OO_COLORS.ink, letterSpacing: '-0.02em',
        opacity: reveal(0),
      }}>
        What it costs when <span style={{ color: OO_COLORS.red }}>"accept all"</span> was the wrong button.
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 420 }}>
        {items.map((it, i) => {
          const r = reveal(0.4 + i * 0.25);
          return (
            <div key={i} style={{
              display:'flex', alignItems:'baseline', gap: 48,
              padding: '28px 0', borderBottom: `1px solid ${OO_COLORS.rule}`,
              opacity: r, transform: `translateX(${(1-r) * -24}px)`,
            }}>
              <div style={{ width: 280, fontFamily: OO_TYPE.mono, fontSize: 22, color: OO_COLORS.inkDim, letterSpacing:'0.1em' }}>
                {it.law}
              </div>
              <div style={{ flex: 1, fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 88, color: OO_COLORS.ink, letterSpacing:'-0.03em', lineHeight: 1 }}>
                {it.cost}
              </div>
              <div style={{ fontFamily: OO_TYPE.sans, fontSize: 22, color: OO_COLORS.inkDim, fontStyle:'italic' }}>
                {it.what}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── SCENE 4 — Pivot ─────────────────────────────────
function SceneA4() {
  const { localTime, progress } = useSprite();
  const wipeWidth = Math.min(1, progress * 2.2) * 1920;
  return (
    <>
      <div style={{
        position:'absolute', left: 0, top: 0, width: wipeWidth, height: '100%',
        background: OO_COLORS.cyan,
        mixBlendMode: 'normal',
        opacity: progress < 0.45 ? 1 : Math.max(0, 1 - (progress - 0.45) * 4),
      }}/>
      <div style={{
        position:'absolute', inset: 0, display:'flex', alignItems:'center', justifyContent:'center',
        opacity: Math.min(1, Math.max(0, (localTime - 0.9) / 0.4)),
      }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily: OO_TYPE.mono, color: OO_COLORS.cyan, fontSize: 16, letterSpacing:'0.3em', marginBottom: 32 }}>
            — SO WE BUILT IT DIFFERENTLY —
          </div>
          <div style={{
            fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 160,
            color: OO_COLORS.ink, letterSpacing:'-0.04em', lineHeight: 0.95,
          }}>
            Your code<br/>
            <span style={{ color: OO_COLORS.cyan }}>never leaves.</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── SCENE 5 — Architecture diagram ─────────────────
function SceneA5() {
  const { localTime } = useSprite();
  const reveal = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));

  return (
    <>
      <SectionNumber n="04" label="THE ARCHITECTURE" x={96} y={180}/>
      <div style={{
        position:'absolute', left: 96, top: 230,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 52,
        color: OO_COLORS.ink, letterSpacing: '-0.02em', lineHeight: 1.05,
        opacity: reveal(0),
      }}>
        OutcomeOps agents run <span style={{ color: OO_COLORS.cyan, fontWeight: 500 }}>inside your VPC</span>.
        <br/>Your Bedrock. Your keys. Your logs.
      </div>

      {/* Big enclosing box = Your Cloud */}
      <div style={{
        position:'absolute', left: 96, top: 440, width: 1728, height: 480,
        border: `1px solid ${OO_COLORS.cyan}`, borderRadius: 8,
        background: 'rgba(34,211,238,0.03)',
        opacity: reveal(0.3),
      }}/>
      <div style={{
        position:'absolute', left: 120, top: 420,
        background: OO_COLORS.bg, padding: '0 12px',
        fontFamily: OO_TYPE.mono, color: OO_COLORS.cyan, fontSize: 13, letterSpacing:'0.18em',
        opacity: reveal(0.3),
      }}>
        YOUR AWS ACCOUNT / YOUR VPC
      </div>

      {/* Inner nodes */}
      {[
        { label: 'CODE REPO', sub: 'Bitbucket / GH Enterprise', x: 140, c: OO_COLORS.ink, d: 0.5 },
        { label: 'OUTCOMEOPS', sub: 'Agent runtime · ECS Fargate', x: 540, c: OO_COLORS.cyan, d: 0.65 },
        { label: 'BEDROCK', sub: 'Claude · your region · your logs', x: 940, c: OO_COLORS.ink, d: 0.8 },
        { label: 'JIRA + CONFLUENCE', sub: 'private link only', x: 1340, c: OO_COLORS.ink, d: 0.95 },
      ].map((n, i) => (
        <div key={i} style={{
          position:'absolute', left: n.x, top: 550, width: 360, height: 160,
          border: `1px solid ${n.c === OO_COLORS.cyan ? OO_COLORS.cyan : OO_COLORS.rule}`, borderRadius: 4,
          background: n.c === OO_COLORS.cyan ? 'rgba(34,211,238,0.07)' : 'rgba(255,255,255,0.015)',
          padding: 24,
          opacity: reveal(n.d),
        }}>
          <div style={{ fontFamily: OO_TYPE.mono, fontSize: 14, color: n.c, letterSpacing:'0.15em' }}>{n.label}</div>
          <div style={{ fontFamily: OO_TYPE.sans, fontSize: 22, color: OO_COLORS.ink, marginTop: 20, letterSpacing:'-0.01em' }}>{n.sub}</div>
        </div>
      ))}

      {/* Egress X-out */}
      <div style={{
        position:'absolute', left: 96, top: 960, right: 96,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        fontFamily: OO_TYPE.mono, fontSize: 14, letterSpacing:'0.18em',
        opacity: reveal(1.1),
      }}>
        <div style={{ color: OO_COLORS.red }}>✕ NO EGRESS TO VENDOR APIS</div>
        <div style={{ color: OO_COLORS.red }}>✕ NO TRAINING ON YOUR CODE</div>
        <div style={{ color: OO_COLORS.red }}>✕ NO SHADOW CACHES</div>
        <div style={{ color: OO_COLORS.cyan }}>✓ FULL AUDIT TRAIL IN CLOUDWATCH</div>
      </div>
    </>
  );
}

// ── SCENE 6 — Proof stats ──────────────────────────
function SceneA6() {
  const { localTime } = useSprite();
  const reveal = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));
  const count = (target, delay, dur=1.6) => {
    const t = Math.min(1, Math.max(0, (localTime - delay) / dur));
    const eased = 1 - Math.pow(1 - t, 3);
    return Math.floor(target * eased);
  };
  return (
    <>
      <SectionNumber n="05" label="IN PRODUCTION" x={96} y={180}/>

      <div style={{ position:'absolute', left: 96, top: 380, right: 96, display:'flex', gap: 48 }}>
        {[
          { val: count(100,0.2), unit: '%', label: 'of prompts + completions\nstayed in customer VPCs', d: 0.1 },
          { val: count(0,1.0),   unit: '',  label: 'bytes of proprietary code\nsent to 3rd-party vendors', d: 0.4, zero: true },
          { val: count(15,1.6),  unit: 'x', label: 'engineering velocity\nvs. offshore baseline', d: 0.7 },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, borderTop: `1px solid ${OO_COLORS.rule}`, paddingTop: 40,
            opacity: reveal(s.d),
          }}>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 200,
              color: s.zero ? OO_COLORS.cyan : OO_COLORS.ink,
              letterSpacing:'-0.04em', lineHeight: 1,
              fontVariantNumeric:'tabular-nums',
            }}>
              {s.zero ? '0' : s.val}<span style={{ color: OO_COLORS.cyan }}>{s.unit}</span>
            </div>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.inkDim,
              letterSpacing:'0.12em', marginTop: 32, whiteSpace:'pre-line',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── SCENE 7 — Closing ──────────────────────────────
function SceneA7() {
  const { localTime } = useSprite();
  return (
    <>
      <div style={{
        position:'absolute', inset: 0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      }}>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.cyan, letterSpacing:'0.3em',
          opacity: Math.min(1, localTime * 3),
        }}>
          06 — THE POINT
        </div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 72,
          color: OO_COLORS.inkDim, letterSpacing:'-0.02em', marginTop: 48, textAlign:'center',
          opacity: Math.min(1, Math.max(0, (localTime - 0.4) / 0.4)),
        }}>
          The offshore consultancy<br/>was never the real cost.
        </div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 104,
          letterSpacing:'-0.035em', marginTop: 48, textAlign:'center', lineHeight: 1.05,
          opacity: Math.min(1, Math.max(0, (localTime - 1.2) / 0.5)),
        }}>
          <span style={{ color: OO_COLORS.ink }}>Your leverage is your code.</span><br/>
          <span style={{ color: OO_COLORS.cyan }}>Stop giving it away.</span>
        </div>
      </div>
    </>
  );
}

// ── SCENE 8 — Lockup ───────────────────────────────
function SceneA8() {
  const { localTime } = useSprite();
  const r = Math.min(1, localTime / 0.5);
  // URL fades in 1.5s after the lockup so the eye lands on the wordmark first
  const urlFade = Math.min(1, Math.max(0, (localTime - 1.5) / 0.6));
  return (
    <>
      <div style={{
        position:'absolute', inset: 0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
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
          BOOK AN ENTERPRISE BRIEFING →
        </div>
        <div style={{
          fontFamily: OO_TYPE.mono, fontSize: 26, color: OO_COLORS.cyan, letterSpacing:'0.04em',
          marginTop: 40, opacity: urlFade,
        }}>
          outcomeops.ai/enterprise-briefing
        </div>
      </div>
    </>
  );
}

Object.assign(window, { VariationA });
