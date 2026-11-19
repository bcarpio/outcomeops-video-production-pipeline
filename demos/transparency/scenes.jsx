// CUT-T // FULL TRANSPARENCY (90-120s)
// 9 scenes demonstrating the OutcomeOps governance moat:
// audit trails, cost transparency, refusal detection, customer-controlled deployment.

function TransparencyCut() {
  return (
    <>
      <div style={{ position:'absolute', inset:0, background: OO_COLORS.bg }}/>
      <GridBG opacity={0.03}/>
      <FrameChrome label="CUT-T // FULL TRANSPARENCY" index={useSceneIndexT(SCENES_T)} total={SCENES_T.length}/>
      <CornerMarks/>

      <Sprite start={0}    end={4.8}>   <SceneT1/></Sprite>
      <Sprite start={4.6}  end={18.8}>  <SceneT2/></Sprite>
      <Sprite start={18.6} end={29.4}>  <SceneT3/></Sprite>
      <Sprite start={29.2} end={56.9}>  <SceneT4/></Sprite>
      <Sprite start={56.7} end={72.3}>  <SceneT5/></Sprite>
      <Sprite start={72.1} end={83.0}>  <SceneT6/></Sprite>
      <Sprite start={82.8} end={92.8}>  <SceneT7/></Sprite>
      <Sprite start={92.6} end={97.6}>  <SceneT8/></Sprite>
      <Sprite start={97.4} end={101}>   <SceneT9/></Sprite>
    </>
  );
}

const SCENES_T = [0, 4.6, 18.6, 29.2, 56.7, 72.1, 82.8, 92.6, 97.4];
function useSceneIndexT(breaks) {
  const t = useTime();
  let idx = 1;
  for (let i=0; i<breaks.length; i++) if (t >= breaks[i]) idx = i + 1;
  return idx;
}

// ── SCENE 1 — Hook ─────────────────────────────────────────────────────
function SceneT1() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.5));
  return (
    <div style={{
      position:'absolute', inset:0,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.cyan,
        letterSpacing:'0.3em', marginBottom: 32,
        opacity: r(0),
      }}>
        00 — THE PROMISE
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 200,
        color: OO_COLORS.ink, letterSpacing:'-0.04em', lineHeight: 1,
        textAlign: 'center',
        opacity: r(0.4),
      }}>
        Full <span style={{ color: OO_COLORS.cyan }}>transparency.</span>
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
        color: OO_COLORS.inkDim, letterSpacing:'-0.02em', lineHeight: 1.3,
        marginTop: 64, textAlign: 'center',
        opacity: r(2),
      }}>
        No black boxes. No hidden fees.<br/>
        Just <span style={{ color: OO_COLORS.ink, fontWeight: 500 }}>data.</span>
      </div>
    </div>
  );
}

// ── SCENE 2 — Deployment Transparency (Terraform) ──────────────────────
const TF_SNIPPET = `resource "aws_kms_key" "data_at_rest" {
  description             = "CMK for data-at-rest encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  policy = jsonencode({
    Statement = [{
      Sid    = "Enable IAM User Permissions"
      Principal = {
        AWS = "arn:aws:iam::\${data.aws_caller_identity
                .current.account_id}:root"
      }
      Action   = "kms:*"
      Resource = "*"
    }]
  })
}`;

function SceneT2() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));
  return (
    <>
      <SectionNumber n="01" label="DEPLOYMENT" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 220, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
        color: OO_COLORS.ink, letterSpacing:'-0.025em', lineHeight: 1.1,
        opacity: r(0),
      }}>
        Terraform deploys into <span style={{ color: OO_COLORS.cyan, fontWeight: 500 }}>your</span> AWS account.
      </div>

      {/* Terraform code panel */}
      <div style={{
        position:'absolute', left: 96, top: 380, width: 980,
        background: '#0F1729',
        border: `1px solid ${OO_COLORS.rule}`, borderRadius: 8,
        padding: '20px 28px',
        opacity: r(1.5),
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid ${OO_COLORS.rule}`,
          fontFamily: OO_TYPE.mono, fontSize: 12, color: OO_COLORS.inkMute, letterSpacing:'0.18em',
        }}>
          <div style={{ width: 9, height: 9, borderRadius: 5, background: '#FF5F56' }}/>
          <div style={{ width: 9, height: 9, borderRadius: 5, background: '#FFBD2E' }}/>
          <div style={{ width: 9, height: 9, borderRadius: 5, background: '#27C93F' }}/>
          <div style={{ marginLeft: 14 }}>terraform/kms-data.tf</div>
        </div>
        <pre style={{
          margin: 0, fontFamily: OO_TYPE.mono, fontSize: 19, lineHeight: 1.45,
          color: '#D1D5DB', whiteSpace: 'pre',
        }}>
{TF_SNIPPET}
        </pre>
      </div>

      {/* Right column callouts */}
      <div style={{
        position:'absolute', left: 1240, right: 96, top: 380,
        display: 'flex', flexDirection: 'column', gap: 28,
      }}>
        {[
          { label: 'YOUR ACCOUNT',  body: 'Your AWS account. Your IAM root. Your keys.', delay: 3 },
          { label: 'YOUR ENCRYPTION', body: 'Customer-managed KMS key. Auto-rotated.',     delay: 5 },
          { label: 'YOUR CONTROL',  body: 'Deploy the entire platform with a single terraform apply.', delay: 7 },
        ].map((c, i) => (
          <div key={i} style={{ opacity: r(c.delay) }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 12, color: OO_COLORS.cyan,
              letterSpacing:'0.22em', marginBottom: 10,
            }}>
              → {c.label}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 26,
              color: OO_COLORS.ink, letterSpacing:'-0.015em', lineHeight: 1.3,
            }}>
              {c.body}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── SCENE 3 — Data Transparency (Architecture Diagram) ─────────────────
function SceneT3() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));
  return (
    <>
      <SectionNumber n="02" label="DATA" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 220, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
        color: OO_COLORS.ink, letterSpacing:'-0.025em', lineHeight: 1.1,
        opacity: r(0),
      }}>
        Bedrock stays <span style={{ color: OO_COLORS.cyan, fontWeight: 500 }}>in-region.</span>
      </div>

      {/* Big AWS account boundary */}
      <div style={{
        position:'absolute', left: 320, top: 380, width: 1280, height: 480,
        border: `2px dashed ${OO_COLORS.cyan}`,
        borderRadius: 16,
        background: 'rgba(34,211,238,0.04)',
        opacity: r(1),
      }}>
        <div style={{
          position: 'absolute', top: -16, left: 32,
          background: OO_COLORS.bg, padding: '0 16px',
          fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.cyan,
          letterSpacing:'0.18em',
        }}>
          YOUR AWS ACCOUNT · us-east-1
        </div>

        {/* Service tiles */}
        <div style={{
          position: 'absolute', inset: 60, display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
        }}>
          {[
            { label: 'BEDROCK',         sub: 'Claude · in-region',     delay: 1.5 },
            { label: 'KMS',             sub: 'Customer-managed',        delay: 2.0 },
            { label: 'LAMBDA',          sub: 'OutcomeOps handlers',     delay: 2.5 },
            { label: 'S3 + DYNAMO',     sub: 'CMK encrypted',           delay: 3.0 },
          ].map((s, i) => (
            <div key={i} style={{
              border: `1px solid ${OO_COLORS.rule}`,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 10, padding: '24px 20px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              opacity: r(s.delay),
            }}>
              <div style={{
                fontFamily: OO_TYPE.mono, fontSize: 13, color: OO_COLORS.cyan,
                letterSpacing:'0.18em', marginBottom: 12,
              }}>{s.label}</div>
              <div style={{
                fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 22,
                color: OO_COLORS.ink, letterSpacing:'-0.01em',
              }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* External "data does not leave" — red X arrows on each side */}
      <div style={{
        position:'absolute', left: 40, top: 560,
        display: 'flex', alignItems: 'center', gap: 18,
        opacity: r(4.5),
      }}>
        <div style={{ fontSize: 72, color: OO_COLORS.red, lineHeight: 1 }}>✕</div>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 22, color: OO_COLORS.ink,
          letterSpacing:'0.12em', maxWidth: 180, lineHeight: 1.25, textTransform: 'uppercase',
        }}>NO TRAINING<br/>ON YOUR DATA</div>
      </div>

      <div style={{
        position:'absolute', right: 40, top: 560,
        display: 'flex', alignItems: 'center', gap: 18,
        opacity: r(5),
      }}>
        <div style={{
          fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 22, color: OO_COLORS.ink,
          letterSpacing:'0.12em', maxWidth: 180, lineHeight: 1.25, textTransform: 'uppercase',
          textAlign: 'right',
        }}>NO EGRESS<br/>NO SHADOW CACHE</div>
        <div style={{ fontSize: 72, color: OO_COLORS.red, lineHeight: 1 }}>✕</div>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 60,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 32,
        color: OO_COLORS.inkDim, textAlign: 'center', letterSpacing:'-0.015em',
        opacity: r(7),
      }}>
        Your prompts and your code never leave your account.
      </div>
    </>
  );
}

// ── SCENE 4 — Audit Dashboard ──────────────────────────────────────────
function SceneT4() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));
  // Highlight refusal row after a few seconds of dashboard appreciation
  const highlightRefusal = localTime > 8;
  return (
    <>
      <SectionNumber n="03" label="AUDIT" x={96} y={70}/>

      <div style={{
        position:'absolute', left: 96, top: 70, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 32,
        color: OO_COLORS.ink, letterSpacing:'-0.02em', textAlign: 'right',
        opacity: r(0),
      }}>
        Every action. Every actor. Every IP.
      </div>

      {/* Dashboard shifted left so right-side callout has room */}
      <div style={{
        position:'absolute', left: 40, top: 140,
        opacity: r(0.5),
      }}>
        <AuditDashboard highlightRefusal={highlightRefusal}/>
      </div>

      {/* Right-side callout: arrow aligned with refusal row, text stacked above */}
      {highlightRefusal && (() => {
        const calloutOpacity = Math.min(1, (localTime - 8) / 0.6);
        // Arrow Y is set to match the 4th row of the Recent Activity table
        // in the AuditDashboard rendered at top: 140. Tune ARROW_Y if scene
        // appears off — values around 780-800 work for current dashboard layout.
        const ARROW_Y = 867;
        return (
          <div style={{
            position:'absolute', left: 1560, top: ARROW_Y,
            opacity: calloutOpacity,
          }}>
            {/* "and flagged." text — placed ABOVE the arrow */}
            <div style={{
              position: 'absolute', bottom: '100%', marginBottom: 16,
              left: 0, whiteSpace: 'nowrap',
              fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 56,
              color: OO_COLORS.red, letterSpacing:'-0.025em', lineHeight: 1,
            }}>
              and flagged.
            </div>

            {/* Red horizontal arrow — points LEFT, line extends RIGHT, line center at ARROW_Y */}
            <div style={{ display: 'flex', alignItems: 'center', height: 28, marginTop: -14 }}>
              <div style={{
                width: 0, height: 0,
                borderTop: '14px solid transparent',
                borderBottom: '14px solid transparent',
                borderRight: `22px solid ${OO_COLORS.red}`,
              }}/>
              <div style={{
                width: 240, height: 4, background: OO_COLORS.red,
              }}/>
            </div>

            {/* Subtitle below the arrow */}
            <div style={{
              marginTop: 18,
              fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 22,
              color: OO_COLORS.inkDim, letterSpacing:'-0.01em',
              maxWidth: 280, lineHeight: 1.35,
            }}>
              A model refusal is logged like any other event.
            </div>
          </div>
        );
      })()}
    </>
  );
}

// ── SCENE 5 — Analytics Dashboard ──────────────────────────────────────
function SceneT5() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));
  const highlightCost = localTime > 5;
  return (
    <>
      <SectionNumber n="04" label="COST" x={96} y={70}/>

      <div style={{
        position:'absolute', left: 96, top: 70, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 32,
        color: OO_COLORS.ink, letterSpacing:'-0.02em', textAlign: 'right',
        opacity: r(0),
      }}>
        Total cost. By workspace. By model. By user.
      </div>

      <div style={{
        position:'absolute', left: 40, top: 140,
        opacity: r(0.5),
      }}>
        <AnalyticsDashboard highlightCost={highlightCost}/>
      </div>

      {highlightCost && (() => {
        const calloutOpacity = Math.min(1, (localTime - 5) / 0.6);
        const stack = ['You', 'pay', 'AWS', 'directly.'];
        return (
          <div style={{
            position:'absolute', left: 1560, top: 240,
            opacity: calloutOpacity,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              fontFamily: OO_TYPE.mono, fontSize: 14, color: OO_COLORS.cyan,
              letterSpacing:'0.22em', marginBottom: 28,
            }}>
              NO MARKUP
            </div>
            {stack.map((word, i) => (
              <div key={i} style={{
                fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 76,
                color: i === stack.length - 1 ? OO_COLORS.cyan : OO_COLORS.ink,
                letterSpacing:'-0.035em', lineHeight: 1.05,
              }}>
                {word}
              </div>
            ))}
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 20,
              color: OO_COLORS.inkDim, letterSpacing:'-0.01em',
              marginTop: 28, maxWidth: 280, lineHeight: 1.35,
            }}>
              You pay AWS for Bedrock usage. Not us.
            </div>
          </div>
        );
      })()}
    </>
  );
}

// ── SCENE 6 — Refusal Detection (SNS Email) ────────────────────────────
function SceneT6() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));
  return (
    <>
      <SectionNumber n="05" label="REAL-TIME ALERT" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 220, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
        color: OO_COLORS.ink, letterSpacing:'-0.025em', lineHeight: 1.1,
        opacity: r(0),
      }}>
        When the AI refuses, <span style={{ color: OO_COLORS.cyan, fontWeight: 500 }}>you know.</span>
      </div>

      {/* Email screenshot */}
      <div style={{
        position:'absolute', left: '50%', top: 360,
        transform: 'translateX(-50%)',
        background: '#FFFFFF',
        borderRadius: 10,
        boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        padding: 0,
        overflow: 'hidden',
        opacity: r(1),
      }}>
        <img src="refusal-email.png" alt="AWS SNS refusal alert"
             style={{ display: 'block', width: 1700, height: 'auto' }}/>
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 60,
        fontFamily: OO_TYPE.sans, fontWeight: 500, fontSize: 30,
        color: OO_COLORS.inkDim, textAlign: 'center', letterSpacing:'-0.015em',
        opacity: r(4),
      }}>
        SNS alert. <span style={{ color: OO_COLORS.ink }}>Real-time.</span> Audit-trailed.
      </div>
    </>
  );
}

// ── SCENE 7 — The Differentiator ───────────────────────────────────────
function SceneT7() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.35));
  const competitors = [
    { name: 'Copilot',    miss: "doesn't log refusals",                          delay: 0.5 },
    { name: 'Cursor',     miss: "doesn't alert on refusals or cost anomalies",   delay: 2.0 },
    { name: 'Claude.ai',  miss: "doesn't give you enterprise audit trails",       delay: 3.5 },
  ];
  return (
    <>
      <SectionNumber n="06" label="THE DIFFERENCE" x={96} y={120}/>

      <div style={{
        position:'absolute', left: 96, top: 220, right: 96,
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
        color: OO_COLORS.ink, letterSpacing:'-0.025em', lineHeight: 1.1,
        opacity: r(0),
      }}>
        No other platform does this.
      </div>

      <div style={{ position:'absolute', left: 96, right: 96, top: 380 }}>
        {competitors.map((c, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '380px 1fr',
            gap: 48, alignItems: 'baseline',
            padding: '24px 0', borderBottom: `1px solid ${OO_COLORS.rule}`,
            opacity: r(c.delay),
          }}>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 64,
              color: OO_COLORS.inkDim, letterSpacing:'-0.025em',
              textDecoration: 'line-through',
              textDecorationColor: OO_COLORS.red,
              textDecorationThickness: 3,
            }}>
              {c.name}
            </div>
            <div style={{
              fontFamily: OO_TYPE.sans, fontWeight: 400, fontSize: 40,
              color: OO_COLORS.ink, letterSpacing:'-0.02em',
            }}>
              {c.miss}.
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position:'absolute', left: 96, right: 96, bottom: 60,
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 56,
        color: OO_COLORS.ink, textAlign: 'center', letterSpacing:'-0.025em',
        opacity: r(5.5),
      }}>
        OutcomeOps does <span style={{ color: OO_COLORS.cyan }}>all three.</span>
      </div>
    </>
  );
}

// ── SCENE 8 — CTA ──────────────────────────────────────────────────────
function SceneT8() {
  const { localTime } = useSprite();
  const r = (d) => Math.min(1, Math.max(0, (localTime - d) / 0.4));
  return (
    <div style={{
      position:'absolute', inset:0,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 300, fontSize: 56,
        color: OO_COLORS.inkDim, letterSpacing:'-0.02em', textAlign: 'center', lineHeight: 1.2,
        opacity: r(0),
      }}>
        No black boxes. No hidden fees.
      </div>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 96,
        color: OO_COLORS.ink, letterSpacing:'-0.04em', textAlign: 'center',
        marginTop: 28,
        opacity: r(1.2),
      }}>
        Just <span style={{ color: OO_COLORS.cyan }}>full transparency.</span>
      </div>
      <div style={{
        fontFamily: OO_TYPE.mono, fontSize: 18, color: OO_COLORS.inkDim,
        letterSpacing:'0.22em', marginTop: 56,
        opacity: r(3.5),
      }}>
        TALK TO OUR TEAM →
      </div>
    </div>
  );
}

// ── SCENE 9 — Lockup ───────────────────────────────────────────────────
function SceneT9() {
  const { localTime } = useSprite();
  const r = Math.min(1, localTime / 0.4);
  return (
    <div style={{
      position:'absolute', inset:0,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      opacity: r,
    }}>
      <div style={{ width: 120, height: 1, background: OO_COLORS.cyan, marginBottom: 32 }}/>
      <div style={{
        fontFamily: OO_TYPE.sans, fontWeight: 600, fontSize: 132,
        color: OO_COLORS.ink, letterSpacing:'-0.04em',
      }}>
        OutcomeOps<span style={{ color: OO_COLORS.cyan }}>.ai</span>
      </div>
      <div style={{
        fontFamily: OO_TYPE.mono, fontSize: 16, color: OO_COLORS.inkDim,
        letterSpacing:'0.3em', marginTop: 24,
      }}>
        AUDIT · COST · CONTROL
      </div>
    </div>
  );
}

Object.assign(window, { TransparencyCut });
