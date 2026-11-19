// scene.jsx
// Timeline composition for the OutcomeOps Jira→PR walkthrough.
// Uses Sprite windows + useTime to orchestrate state across scenes.

const DUR = 82; // total seconds

// ── Scene windows (seconds) ─────────────────────────────────────────────────
const S = {
  intro:     [0.0,  6.0],
  jira:      [5.5,  13.5],
  webhook:   [13.0, 21.5],
  rag:       [21.0, 32.0],
  plan:      [31.0, 40.0],
  sqsLoop:   [39.5, 59.0],
  pr:        [58.5, 66.0],
  analyzer:  [65.5, 75.0],
  outro:     [74.5, 82.0],
};

// ── Intro scene ────────────────────────────────────────────────────────────

function IntroScene() {
  const { localTime, progress, duration } = useSprite();
  const brandOp = Math.min(1, Math.max(0, (localTime - 0.3) / 0.6));
  const titleOp = Math.min(1, Math.max(0, (localTime - 1.6) / 0.7));
  const subOp   = Math.min(1, Math.max(0, (localTime - 2.4) / 0.7));
  const fadeOut = localTime > duration - 0.8 ? Math.max(0, 1 - (localTime - (duration - 0.8)) / 0.8) : 1;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 28,
      opacity: fadeOut,
    }}>
      <div style={{ opacity: brandOp, transform: `translateY(${(1 - brandOp) * 20}px)` }}>
        <BrandMark size={84} />
      </div>
      <div style={{
        opacity: titleOp,
        transform: `translateY(${(1 - titleOp) * 16}px)`,
        fontFamily: oo.sans,
        fontSize: 72, fontWeight: 700,
        color: oo.text, letterSpacing: '-0.035em',
        textAlign: 'center', lineHeight: 1.0,
        maxWidth: 1400,
      }}>
        From Jira ticket to production PR<br/>
        <span style={{
          background: `linear-gradient(90deg, ${oo.accent}, ${oo.purple})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>in 12 minutes.</span>
      </div>
      <div style={{
        opacity: subOp,
        transform: `translateY(${(1 - subOp) * 10}px)`,
        fontFamily: oo.mono, fontSize: 18,
        color: oo.textDim, letterSpacing: '0.04em',
        textAlign: 'center',
      }}>
        Context Engineering · RAG + Reranking · Autonomous code generation
      </div>
      <div style={{
        opacity: subOp * 0.7,
        marginTop: 24,
        display: 'flex', gap: 14, alignItems: 'center',
        fontFamily: oo.mono, fontSize: 13,
        color: oo.textFaint,
      }}>
        <span>ADR-004</span>
        <span style={{ color: oo.border }}>·</span>
        <span>ADR-005</span>
        <span style={{ color: oo.border }}>·</span>
        <span>ADR-006</span>
        <span style={{ color: oo.border }}>·</span>
        <span>CPE-42</span>
      </div>
    </div>
  );
}

// ── Jira scene ─────────────────────────────────────────────────────────────

function JiraScene() {
  const { localTime, duration } = useSprite();
  const enterT  = Math.min(1, Math.max(0, (localTime - 0.1) / 0.7));
  const labelT  = Math.min(1, Math.max(0, (localTime - 2.2) / 0.3));
  const exitT   = localTime > duration - 1.0 ? Math.min(1, (localTime - (duration - 1.0)) / 1.0) : 0;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeIn  = (t) => t * t;

  const enter = easeOut(enterT);
  const exit  = easeIn(exitT);

  const ty = (1 - enter) * 40 + exit * -30;
  const op = enter - exit;

  const ticketScale = 1.45;
  const ticketX = 800 - (520 * ticketScale) / 2; // center horizontally
  const ticketY = 240 - exit * 40;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <SceneLabel number="01" subtitle="Trigger" title="An engineer files a ticket." />
      <div style={{
        position: 'absolute',
        left: ticketX, top: ticketY,
        transform: `translateY(${ty}px) scale(${ticketScale})`,
        transformOrigin: 'top left',
        opacity: Math.max(0, op),
      }}>
        <JiraTicket highlighted={labelT > 0.4} labelPulse={labelT > 0.6} />
      </div>
      {/* Annotation arrow pointing at the label */}
      {labelT > 0.5 && (
        <div style={{
          position: 'absolute',
          left: 1360, top: 620,
          opacity: (labelT - 0.5) * 2 - exit,
          fontFamily: oo.mono,
          color: oo.accent, fontSize: 14,
          lineHeight: 1.4,
          maxWidth: 220,
        }}>
          <svg width="140" height="40" style={{ display: 'block', marginLeft: -130, marginBottom: -10 }}>
            <path d="M 130 30 Q 80 10, 20 20" stroke={oo.accent} strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
            <path d="M 20 20 L 28 14 M 20 20 L 28 24" stroke={oo.accent} strokeWidth="1.5" fill="none" />
          </svg>
          <div style={{ fontWeight: 600 }}>The handoff.</div>
          <div style={{ color: oo.textDim, marginTop: 4, fontSize: 12 }}>
            Engineer defines the outcome.<br/>Label hands it to OutcomeOps.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Webhook scene — Jira → AWS Cloud (SSM Document → Lambda) ─────────────

function WebhookScene() {
  const { localTime, duration } = useSprite();
  // Staggered reveal across the flow
  const jiraT   = Math.min(1, Math.max(0, (localTime - 0.1) / 0.5));
  const line1T  = Math.min(1, Math.max(0, (localTime - 0.7) / 0.9));
  const cloudT  = Math.min(1, Math.max(0, (localTime - 1.2) / 0.6));
  const ssmT    = Math.min(1, Math.max(0, (localTime - 1.8) / 0.5));
  const line2T  = Math.min(1, Math.max(0, (localTime - 2.4) / 0.8));
  const lambdaT = Math.min(1, Math.max(0, (localTime - 3.0) / 0.6));
  const storyT  = Math.min(1, Math.max(0, (localTime - 1.6) / 0.7));
  const exitT   = localTime > duration - 0.6 ? (localTime - (duration - 0.6)) / 0.6 : 0;
  const op      = 1 - Math.min(1, exitT);

  // Layout — stage is 1600×900. Big AWS cloud on right, Jira on left.
  const jiraCx   = 220, nodeY = 560;
  // Cloud bounding box
  const cloudX   = 760, cloudY = 340;
  const cloudW   = 780, cloudH = 420;
  // Items inside the cloud (absolute page coords)
  const ssmX     = cloudX + 90,  ssmY = cloudY + 190; // left side
  const lambdaX  = cloudX + 530, lambdaY = cloudY + 200; // right side

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="02" subtitle="Automation" title="Jira kicks off an SSM runbook." />

      {/* ── Story caption on left ────────────────────────────────────── */}
      <div style={{
        position: 'absolute', left: 80, top: 240, width: 560,
        opacity: storyT,
        transform: `translateY(${(1 - storyT) * 12}px)`,
        fontFamily: oo.sans,
      }}>
        <div style={{
          fontFamily: oo.mono, fontSize: 11, color: oo.accent,
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10,
        }}>What actually happens</div>
        <div style={{ fontSize: 19, color: oo.text, lineHeight: 1.45, fontWeight: 500 }}>
          A Jira <b style={{ color: oo.accent }}>Automation rule</b> fires when the label
          lands. Inside the customer's AWS, an <b style={{ color: '#FF9900' }}>SSM Document</b> picks it up and
          securely invokes the generation Lambda — no public endpoints, no shared secrets.
        </div>
        <div style={{
          marginTop: 18, display: 'flex', gap: 8, flexWrap: 'wrap',
        }}>
          <Chip label="Runs in your AWS" color={oo.warn} size="sm"/>
          <Chip label="IAM-scoped" color={oo.purple} size="sm"/>
          <Chip label="No public endpoints" color={oo.success} size="sm"/>
        </div>
      </div>

      {/* ── Jira (left) ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        left: jiraCx - 60, top: nodeY - 60,
        opacity: jiraT,
        transform: `scale(${0.85 + jiraT * 0.15})`,
        transformOrigin: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 120, height: 120, borderRadius: 22,
          background: oo.jira,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 40px -4px ${oo.jira}80, 0 0 0 6px ${oo.jira}20`,
        }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="#fff">
            <text x="30" y="44" textAnchor="middle" fontSize="38" fontWeight="700" fontFamily={oo.sans}>J</text>
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: oo.sans, fontSize: 16, fontWeight: 600, color: oo.text }}>Jira Automation</div>
          <div style={{ fontFamily: oo.mono, fontSize: 12, color: oo.textDim, marginTop: 2 }}>label = approved-for-generation</div>
        </div>
      </div>

      {/* ── AWS Cloud (right) containing SSM + Lambda ───────────────── */}
      <div style={{
        position: 'absolute',
        left: cloudX, top: cloudY,
        width: cloudW, height: cloudH,
        opacity: cloudT,
        transform: `scale(${0.94 + cloudT * 0.06})`,
        transformOrigin: 'center',
      }}>
        {/* Cloud shape */}
        <svg width={cloudW} height={cloudH} viewBox={`0 0 ${cloudW} ${cloudH}`}
          style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id="cloudFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B2540" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95"/>
            </linearGradient>
          </defs>
          <g>
            <ellipse cx={cloudW*0.22} cy={cloudH*0.60} rx={cloudW*0.20} ry={cloudH*0.34} fill="url(#cloudFill)" stroke="#FF9900" strokeWidth="2" opacity="0.95"/>
            <ellipse cx={cloudW*0.42} cy={cloudH*0.38} rx={cloudW*0.20} ry={cloudH*0.38} fill="url(#cloudFill)" stroke="#FF9900" strokeWidth="2" opacity="0.95"/>
            <ellipse cx={cloudW*0.62} cy={cloudH*0.34} rx={cloudW*0.22} ry={cloudH*0.40} fill="url(#cloudFill)" stroke="#FF9900" strokeWidth="2" opacity="0.95"/>
            <ellipse cx={cloudW*0.80} cy={cloudH*0.56} rx={cloudW*0.18} ry={cloudH*0.36} fill="url(#cloudFill)" stroke="#FF9900" strokeWidth="2" opacity="0.95"/>
            <ellipse cx={cloudW*0.50} cy={cloudH*0.70} rx={cloudW*0.40} ry={cloudH*0.22} fill="url(#cloudFill)" stroke="#FF9900" strokeWidth="2" opacity="0.95"/>
            {/* Unifying fill over the interior so seams disappear */}
            <ellipse cx={cloudW*0.50} cy={cloudH*0.54} rx={cloudW*0.46} ry={cloudH*0.38} fill="url(#cloudFill)" opacity="1"/>
          </g>
        </svg>

        {/* AWS cloud label */}
        <div style={{
          position: 'absolute', left: 120, top: 30,
          fontFamily: oo.mono, fontSize: 12,
          color: '#FF9900', letterSpacing: '0.12em', textTransform: 'uppercase',
          fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 14 14"><path d="M3 8a3 3 0 014-2.8 3.5 3.5 0 016.6 1A2.5 2.5 0 0112 11H4a3 3 0 01-1-3z" fill="#FF9900"/></svg>
          AWS · Customer VPC
        </div>
      </div>

      {/* ── SSM Document (inside cloud, left) ───────────────────────── */}
      <div style={{
        position: 'absolute',
        left: ssmX, top: ssmY,
        opacity: Math.min(cloudT, ssmT),
        transform: `scale(${0.85 + ssmT * 0.15})`,
        transformOrigin: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 160, height: 120, borderRadius: 14,
          background: `linear-gradient(180deg, #232F3E 0%, #141B26 100%)`,
          border: `1px solid ${ssmT > 0.5 ? '#FF9900' : oo.borderHi}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8,
          boxShadow: ssmT > 0.5 ? `0 0 0 2px rgba(255,153,0,0.2), 0 0 28px -4px rgba(255,153,0,0.6)` : '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <rect x="3" y="3" width="34" height="34" rx="4" fill="#FF9900" opacity="0.95"/>
            <path d="M12 13h16M12 20h16M12 27h10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
            <circle cx="26" cy="27" r="2" fill="#fff"/>
          </svg>
          <div style={{ fontFamily: oo.mono, fontSize: 11, color: '#FF9900', fontWeight: 600 }}>SSM Document</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: oo.sans, fontSize: 14, fontWeight: 600, color: oo.text }}>Systems Manager</div>
          <div style={{ fontFamily: oo.mono, fontSize: 11, color: oo.textDim, marginTop: 2 }}>OutcomeOps-InvokeGenerator</div>
        </div>
      </div>

      {/* ── Lambda (inside cloud, right) ────────────────────────────── */}
      <div style={{
        position: 'absolute',
        left: lambdaX, top: lambdaY,
        opacity: Math.min(cloudT, lambdaT),
        transform: `translateX(${(1 - lambdaT) * -12}px) scale(${0.9 + lambdaT * 0.1})`,
        transformOrigin: 'center',
      }}>
        <LambdaNode name="generate-plan" active={lambdaT > 0.5} processing={lambdaT > 0.8} size="lg" />
      </div>

      {/* ── Connectors ──────────────────────────────────────────────── */}
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
        <defs>
          <marker id="webhookArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={oo.accent} />
          </marker>
          <marker id="ssmArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF9900" />
          </marker>
        </defs>
        {/* Jira → SSM (crosses into the cloud) */}
        {(() => {
          const x1 = jiraCx + 60;
          const y1 = nodeY;
          const x2 = ssmX; // left edge of SSM node
          const y2 = ssmY + 60;
          const curX = x1 + (x2 - x1) * line1T;
          return (
            <>
              <line x1={x1} y1={y1} x2={curX} y2={y1 + (y2 - y1) * line1T}
                stroke={oo.accent} strokeWidth="2.5" strokeDasharray="8 6"
                markerEnd={line1T > 0.95 ? 'url(#webhookArrow)' : undefined} />
              {line1T > 0.2 && line1T < 1 && (
                <circle r="5" fill={oo.accent}>
                  <animateMotion dur="0.9s" repeatCount="indefinite" path={`M ${x1} ${y1} L ${x2} ${y2}`} />
                </circle>
              )}
            </>
          );
        })()}
        {/* SSM → Lambda (inside the cloud) */}
        {(() => {
          const x1 = ssmX + 160;
          const y1 = ssmY + 60;
          const x2 = lambdaX;
          const y2 = lambdaY + 60;
          return (
            <>
              <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * line2T} y2={y1 + (y2 - y1) * line2T}
                stroke="#FF9900" strokeWidth="2.5" strokeDasharray="8 6"
                markerEnd={line2T > 0.95 ? 'url(#ssmArrow)' : undefined} />
              {line2T > 0.2 && line2T < 1 && (
                <circle r="5" fill="#FF9900">
                  <animateMotion dur="0.9s" repeatCount="indefinite" path={`M ${x1} ${y1} L ${x2} ${y2}`} />
                </circle>
              )}
            </>
          );
        })()}
      </svg>

      {/* Event labels on the lines */}
      {line1T > 0.5 && (
        <div style={{
          position: 'absolute',
          left: (jiraCx + 60 + ssmX) / 2 - 100, top: (nodeY + ssmY + 60) / 2 - 44,
          width: 200, textAlign: 'center',
          fontFamily: oo.mono, fontSize: 12,
          color: oo.accent,
          padding: '3px 10px',
          background: oo.bg,
          border: `1px solid ${oo.accent}60`,
          borderRadius: 4,
          opacity: Math.min(1, (line1T - 0.5) * 3),
        }}>
          automation rule
        </div>
      )}
      {line2T > 0.5 && (
        <div style={{
          position: 'absolute',
          left: (ssmX + 160 + lambdaX) / 2 - 130, top: ssmY + 20,
          width: 260, textAlign: 'center',
          fontFamily: oo.mono, fontSize: 12,
          color: '#FF9900',
          padding: '3px 10px',
          background: oo.bg,
          border: `1px solid #FF990060`,
          borderRadius: 4,
          opacity: Math.min(1, (line2T - 0.5) * 3),
        }}>
          ssm:StartAutomationExecution
        </div>
      )}
    </div>
  );
}

// ── RAG retrieval scene ──────────────────────────────────────────────────

function RagScene() {
  const { localTime, duration } = useSprite();

  const queryT  = Math.min(1, Math.max(0, (localTime - 0.2) / 0.6));
  // ADRs stream in staggered
  const adrAppear = (idx) => Math.min(1, Math.max(0, (localTime - (1.4 + idx * 0.25)) / 0.5));
  // Rerank moment (around 5.5s)
  const rerankT = Math.min(1, Math.max(0, (localTime - 5.5) / 1.0));
  const exitT   = localTime > duration - 0.8 ? (localTime - (duration - 0.8)) / 0.8 : 0;
  const op      = 1 - Math.min(1, exitT);

  // vector scores -> rerank scores (rerank = better ordering, higher)
  const adrs = [
    { id: 'ADR-004', title: 'Lambda Handler Standards',      vector: 0.812, rerank: 0.994, finalRank: 0 },
    { id: 'ADR-006', title: 'Python Dependency Management',  vector: 0.768, rerank: 0.972, finalRank: 1 },
    { id: 'ADR-005', title: 'Testing Standards',             vector: 0.742, rerank: 0.931, finalRank: 2 },
    { id: 'ADR-001', title: 'Terraform Infrastructure Patterns', vector: 0.701, rerank: 0.887, finalRank: 3 },
    { id: 'ADR-012', title: 'Code Generation Verbosity',     vector: 0.654, rerank: 0.821, finalRank: 4 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="03" subtitle="Retrieval" title="It queries YOUR knowledge base." />

      {/* Query box (left) */}
      <div style={{
        position: 'absolute', left: 80, top: 260,
        width: 520,
        opacity: queryT,
        transform: `translateY(${(1 - queryT) * 12}px)`,
      }}>
        <div style={{
          padding: 26,
          background: oo.surface,
          border: `1px solid ${oo.border}`,
          borderRadius: 14,
          fontFamily: oo.sans,
        }}>
          <div style={{
            fontFamily: oo.mono, fontSize: 13,
            color: oo.accent, letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 14,
          }}>Semantic query</div>
          <div style={{
            fontFamily: oo.mono, fontSize: 18,
            color: oo.text, lineHeight: 1.55,
          }}>
            <span style={{ color: oo.textFaint }}>›</span>{' '}
            Lambda handler standards for<br/>
            <span style={{ color: oo.accent }}>Python · DynamoDB · list endpoint</span>
          </div>
          <div style={{
            marginTop: 20,
            display: 'flex', gap: 10, flexWrap: 'wrap',
          }}>
            <Chip label="Vector search" color={oo.accent} size="lg"/>
            <Chip label="Cohere Rerank 3.5" color={oo.purple} size="lg"/>
            <Chip label="Bedrock KB" color={oo.warn} size="lg"/>
          </div>
        </div>

        {/* Connector to ADRs */}
        <svg width="260" height="100" style={{ position: 'absolute', right: -260, top: 60, overflow: 'visible' }}>
          <path d="M 0 30 Q 130 30, 260 40" stroke={oo.accent} strokeWidth="2.5" fill="none"
            strokeDasharray="7 5" opacity="0.6"/>
        </svg>
      </div>

      {/* ADR stack (right). When rerankT > 0, reorder by finalRank. */}
      <div style={{
        position: 'absolute',
        left: 760, top: 220,
        width: 760,
      }}>
        <div style={{
          fontFamily: oo.mono, fontSize: 13,
          color: oo.textDim, letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span>Retrieved standards</span>
          {rerankT > 0.2 && (
            <span style={{
              padding: '5px 12px', background: oo.purple + '22',
              color: oo.purple, border: `1px solid ${oo.purple}60`,
              borderRadius: 5, letterSpacing: '0.08em',
              opacity: Math.min(1, rerankT * 2),
              fontSize: 12,
            }}>reranked</span>
          )}
        </div>
        {adrs.map((a, i) => {
          const ap = adrAppear(i);
          if (ap <= 0) return null;
          const order = rerankT < 0.5 ? i : a.finalRank;
          const targetY = order * 112;
          return (
            <div key={a.id} style={{
              position: 'absolute',
              left: 0, top: 44,
              width: 760,
              transform: `translateY(${targetY}px) scale(${0.92 + ap * 0.08})`,
              transformOrigin: 'top left',
              opacity: ap,
              transition: 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
              <AdrChip
                id={a.id}
                title={a.title}
                score={a.vector}
                rerankScore={rerankT > 0.3 ? a.rerank : undefined}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Plan document scene ────────────────────────────────────────────────────

function PlanScene() {
  const { localTime, duration } = useSprite();
  const docT = Math.min(1, Math.max(0, (localTime - 0.2) / 0.7));
  // Steps reveal 1..8 over 3.5s
  const stepsRevealed = Math.min(8, Math.floor((localTime - 1.3) / 0.35) + 1);
  const revealed = Math.max(0, stepsRevealed);
  const exitT = localTime > duration - 0.8 ? (localTime - (duration - 0.8)) / 0.8 : 0;
  const op = (1 - Math.min(1, exitT)) * docT;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="04" subtitle="Planning" title="It writes a plan." />

      {/* Centered plan doc — shifted left to make room for side annotation */}
      <div style={{
        position: 'absolute',
        left: '38%', top: 150,
        transform: `translateX(-50%) translateY(${(1 - docT) * 30}px) scale(${(0.95 + docT * 0.05) * 1.35})`,
        transformOrigin: 'top center',
      }}>
        <PlanDocument revealedSteps={revealed} completedSteps={0} currentStep={null} />
      </div>

      {/* Side annotation — right column, clear of the card */}
      <div style={{
        position: 'absolute', right: 70, top: 280, width: 340,
        opacity: Math.min(1, Math.max(0, (localTime - 3) / 0.8)),
      }}>
        <div style={{ fontFamily: oo.mono, fontSize: 13, color: oo.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          What just happened
        </div>
        <div style={{ fontFamily: oo.sans, fontSize: 18, color: oo.text, lineHeight: 1.5, marginTop: 12 }}>
          OutcomeOps broke the story into
          <span style={{ color: oo.accent, fontWeight: 600 }}> 8 atomic steps</span>, each bound to specific files
          and the ADRs that govern them.
          <div style={{
            marginTop: 14, padding: '10px 12px',
            background: oo.surface, border: `1px solid ${oo.border}`,
            borderRadius: 8, fontSize: 15, fontFamily: oo.mono, color: oo.textDim,
          }}>
            <div style={{ color: oo.text }}>Cost · $0.049</div>
            <div>11,741 in · 952 out tokens</div>
          </div>
        </div>
      </div>

      <Caption text="The plan is checked into the branch as a markdown file — a contract between the AI and the codebase." />
    </div>
  );
}

// ── SQS loop scene — the core insight ─────────────────────────────────────

function SqsLoopScene() {
  const { localTime, duration } = useSprite();

  // Scene choreography:
  //  0.0 - 1.5   layout lays out (plan left, SQS center, Lambda+files right)
  //  1.5 - 18.0  step loop: step appears in SQS -> Lambda processes -> file written
  //
  const layoutT = Math.min(1, Math.max(0, (localTime - 0.1) / 1.3));

  // We have 8 steps; each takes ~2.0s across the loop
  const STEP_START = 1.6;
  const STEP_DUR = 2.05;
  const stepIdx = Math.min(7, Math.max(-1, Math.floor((localTime - STEP_START) / STEP_DUR)));
  const stepLocal = (localTime - STEP_START - stepIdx * STEP_DUR) / STEP_DUR;

  const files = [
    'lambda/list-recent-docs/models.py',
    'lambda/list-recent-docs/handler.py',
    'lambda/list-recent-docs/requirements.txt',
    'terraform/lambda.tf',
    'lambda/tests/unit/test_list_recent_docs.py',
    'lambda/tests/unit/test_list_recent_docs.py',
    'lambda/tests/unit/test_list_recent_docs.py',
    'lambda/tests/unit/test_list_recent_docs.py',
  ];

  const completedSteps = stepIdx < 0 ? 0 : (stepLocal > 0.85 ? stepIdx + 1 : stepIdx);
  const currentStep    = stepIdx < 0 ? null : (stepLocal > 0.85 ? null : stepIdx);

  // Track which files are written
  const writtenFiles = new Set(files.slice(0, completedSteps));
  const currentFile  = currentStep != null ? files[currentStep] : null;

  // SQS messages: show current step as in-flight, plus next queued ones
  let queueMsgs = [];
  if (stepIdx < 0) {
    queueMsgs = ['1/8'];
  } else if (currentStep != null) {
    queueMsgs = [`${currentStep + 1}/8`];
    if (currentStep + 1 < 8) queueMsgs.push(`${currentStep + 2}/8 (pending)`);
  } else if (completedSteps < 8) {
    queueMsgs = [`${completedSteps + 1}/8`];
  }

  const exitT = localTime > duration - 0.8 ? (localTime - (duration - 0.8)) / 0.8 : 0;
  const op = (1 - Math.min(1, exitT)) * layoutT;

  // Cost accumulator
  const costPerStep = [0.082, 0.108, 0.074, 0.126, 0.163, 0.178, 0.196, 0.243];
  const accumCost = costPerStep.slice(0, completedSteps).reduce((a, b) => a + b, 0)
    + (currentStep != null ? costPerStep[currentStep] * stepLocal : 0);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="05" subtitle="Execution" title="The plan feeds itself through SQS." />

      {/* Plan doc (left, enlarged so the text is legible) */}
      <div style={{ position: 'absolute', left: 40, top: 160, transform: 'scale(1.05)', transformOrigin: 'top left' }}>
        <PlanDocument revealedSteps={8} completedSteps={completedSteps} currentStep={currentStep} />
      </div>

      {/* SQS queue (center-right, moved further from plan doc) */}
      <div style={{ position: 'absolute', left: 760, top: 330 }}>
        <SqsQueue messages={queueMsgs} />
      </div>

      {/* generate-code Lambda (directly under SQS tile — same width) */}
      <div style={{ position: 'absolute', left: 760, top: 535 }}>
        <LambdaNode
          name="generate-code"
          active={currentStep != null}
          processing={currentStep != null}
          size="md"
          style={{ width: 260, height: 130 }}
        />
      </div>

      {/* File tree (right, enlarged to fill more of the canvas) */}
      <div style={{ position: 'absolute', right: 30, top: 150, transform: 'scale(1.6)', transformOrigin: 'top right' }}>
        <FileTree writtenFiles={writtenFiles} currentFile={currentFile} />
      </div>

      {/* Continuous bidirectional dots between SQS ↔ Lambda (vertical) */}
      <svg width="1600" height="900" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
        {/* SQS → Lambda (top to bottom, left lane) */}
        <circle r="3" fill={oo.accent} opacity="1">
          <animateMotion dur="1.1s" repeatCount="indefinite" path="M 870 503 L 870 533" />
        </circle>
        <circle r="3" fill={oo.accent} opacity="0.6">
          <animateMotion dur="1.1s" begin="0.35s" repeatCount="indefinite" path="M 870 503 L 870 533" />
        </circle>
        <circle r="3" fill={oo.accent} opacity="0.35">
          <animateMotion dur="1.1s" begin="0.7s" repeatCount="indefinite" path="M 870 503 L 870 533" />
        </circle>
        {/* Lambda → SQS (bottom to top, right lane) */}
        <circle r="3" fill={oo.warn} opacity="1">
          <animateMotion dur="1.1s" repeatCount="indefinite" path="M 910 533 L 910 503" />
        </circle>
        <circle r="3" fill={oo.warn} opacity="0.6">
          <animateMotion dur="1.1s" begin="0.35s" repeatCount="indefinite" path="M 910 533 L 910 503" />
        </circle>
        <circle r="3" fill={oo.warn} opacity="0.35">
          <animateMotion dur="1.1s" begin="0.7s" repeatCount="indefinite" path="M 910 533 L 910 503" />
        </circle>
      </svg>

      {/* Live counter (bottom right) — larger */}
      <div style={{
        position: 'absolute', right: 60, bottom: 80,
        display: 'flex', gap: 16,
      }}>
        <div style={{
          padding: '14px 22px',
          background: oo.surface, border: `1px solid ${oo.border}`,
          borderRadius: 10, fontFamily: oo.mono,
        }}>
          <div style={{ fontSize: 12, color: oo.textFaint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step</div>
          <div style={{ fontSize: 32, color: oo.text, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            {String(Math.min(8, Math.max(0, (currentStep ?? completedSteps) + (currentStep != null ? 1 : 0)))).padStart(1,'0')}/8
          </div>
        </div>
        <div style={{
          padding: '14px 22px',
          background: oo.surface, border: `1px solid ${oo.border}`,
          borderRadius: 10, fontFamily: oo.mono,
        }}>
          <div style={{ fontSize: 12, color: oo.textFaint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cost</div>
          <div style={{ fontSize: 32, color: oo.success, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            ${accumCost.toFixed(3)}
          </div>
        </div>
      </div>

      <Caption text="Each step writes files, then re-enqueues the next. No orchestrator. Just SQS, a Lambda, and a plan." />
    </div>
  );
}

// ── PR scene ──────────────────────────────────────────────────────────────

function PrScene() {
  const { localTime, duration } = useSprite();
  const enterT = Math.min(1, Math.max(0, (localTime - 0.1) / 0.7));
  const exitT  = localTime > duration - 0.6 ? (localTime - (duration - 0.6)) / 0.6 : 0;
  const op = (1 - Math.min(1, exitT));

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="06" subtitle="Commit" title="A pull request appears." />
      <div style={{
        position: 'absolute',
        left: '50%', top: 170,
        transform: `translateX(-50%) translateY(${(1 - enterT) * 30}px) scale(${1.1 + enterT * 0.1})`,
        transformOrigin: 'top center',
        opacity: enterT,
      }}>
        <GithubPR checksState="pending" checksCompleted={0} />
      </div>
    </div>
  );
}

// ── PR Analyzer scene ─────────────────────────────────────────────────────

function AnalyzerScene() {
  const { localTime, duration } = useSprite();
  const enterT = Math.min(1, Math.max(0, (localTime - 0.1) / 0.5));
  // 6 checks, ~1.05s each
  const checkStart = 0.8;
  const checkDur = 1.05;
  const completed = Math.min(6, Math.max(0, Math.floor((localTime - checkStart) / checkDur)));
  const running = localTime > checkStart && completed < 6 ? 'running' : 'pending';
  const exitT  = localTime > duration - 0.6 ? (localTime - (duration - 0.6)) / 0.6 : 0;
  const op = (1 - Math.min(1, exitT));

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="07" subtitle="Review" title="The PR Analyzer reviews itself." />
      <div style={{
        position: 'absolute',
        left: '50%', top: 170,
        transform: `translateX(-50%) scale(${1.1 + enterT * 0.1})`,
        transformOrigin: 'top center',
        opacity: enterT,
      }}>
        <GithubPR checksState={running} checksCompleted={completed} />
      </div>

      {/* Side annotation */}
      <div style={{
        position: 'absolute', right: 40, bottom: 60, width: 280,
        opacity: Math.min(1, Math.max(0, (localTime - 2) / 0.8)),
      }}>
        <div style={{ fontFamily: oo.mono, fontSize: 11, color: oo.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Second RAG pass
        </div>
        <div style={{ fontSize: 14, color: oo.text, lineHeight: 1.55, marginTop: 10, fontFamily: oo.sans }}>
          The analyzer re-queries the same ADRs and checks the generated code against them.
          Comments drop inline if anything drifts.
        </div>
      </div>

      {completed >= 6 && (
        <div style={{
          position: 'absolute',
          left: '50%', bottom: 100,
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          background: oo.successBg,
          border: `1px solid ${oo.success}`,
          borderRadius: 99,
          fontFamily: oo.mono, fontSize: 14,
          color: oo.success, fontWeight: 600,
          letterSpacing: '0.02em',
          display: 'flex', alignItems: 'center', gap: 10,
          opacity: Math.min(1, (localTime - 7.1) * 2),
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 8l3 3 5-6" stroke={oo.success} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ALL CHECKS PASSED · READY FOR HUMAN REVIEW
        </div>
      )}
    </div>
  );
}

// ── Outro — the receipts ─────────────────────────────────────────────────

function OutroScene() {
  const { localTime, duration } = useSprite();
  const t = Math.min(1, localTime / 1.0);
  const stat1 = Math.min(1, Math.max(0, (localTime - 0.8) / 0.4));
  const stat2 = Math.min(1, Math.max(0, (localTime - 1.3) / 0.4));
  const stat3 = Math.min(1, Math.max(0, (localTime - 1.8) / 0.4));
  const cta   = Math.min(1, Math.max(0, (localTime - 3.0) / 0.6));

  const stats = [
    { label: 'Time',     was: '16 hrs',   is: '12 min',  color: oo.accent, op: stat1 },
    { label: 'Cost',     was: '—',        is: '$1.17',   color: oo.success, op: stat2 },
    { label: 'Standards', was: 'drift',   is: '100%',    color: oo.purple, op: stat3 },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 48,
      opacity: t,
    }}>
      <div style={{ opacity: t }}>
        <BrandMark size={60} />
      </div>

      <div style={{
        fontFamily: oo.sans, fontSize: 56, fontWeight: 700,
        letterSpacing: '-0.03em', color: oo.text,
        textAlign: 'center', lineHeight: 1.05,
        maxWidth: 1200,
      }}>
        Ship features at the speed of<br/>
        <span style={{
          background: `linear-gradient(90deg, ${oo.accent}, ${oo.purple})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>context engineering.</span>
      </div>

      <div style={{ display: 'flex', gap: 40 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            opacity: s.op,
            transform: `translateY(${(1 - s.op) * 16}px)`,
            textAlign: 'center', minWidth: 180,
          }}>
            <div style={{ fontFamily: oo.mono, fontSize: 11, color: oo.textDim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {s.label}
            </div>
            <div style={{ fontFamily: oo.mono, fontSize: 13, color: oo.textFaint, textDecoration: 'line-through', marginTop: 6 }}>
              {s.was}
            </div>
            <div style={{ fontFamily: oo.sans, fontSize: 46, color: s.color, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {s.is}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        opacity: cta,
        transform: `translateY(${(1 - cta) * 10}px)`,
        display: 'flex', alignItems: 'center', gap: 16,
        fontFamily: oo.mono, fontSize: 14, color: oo.textDim,
        letterSpacing: '0.04em',
      }}>
        <span>outcomeops.ai</span>
        <span style={{ color: oo.border }}>·</span>
        <span>Context engineering for AI-assisted development</span>
      </div>
    </div>
  );
}

// ── Root composition ───────────────────────────────────────────────────────

function OutcomeOpsVideo() {
  return (
    <>
      <StageBackdrop />
      <Sprite start={S.intro[0]}    end={S.intro[1]}><IntroScene /></Sprite>
      <Sprite start={S.jira[0]}     end={S.jira[1]}><JiraScene /></Sprite>
      <Sprite start={S.webhook[0]}  end={S.webhook[1]}><WebhookScene /></Sprite>
      <Sprite start={S.rag[0]}      end={S.rag[1]}><RagScene /></Sprite>
      <Sprite start={S.plan[0]}     end={S.plan[1]}><PlanScene /></Sprite>
      <Sprite start={S.sqsLoop[0]}  end={S.sqsLoop[1]}><SqsLoopScene /></Sprite>
      <Sprite start={S.pr[0]}       end={S.pr[1]}><PrScene /></Sprite>
      <Sprite start={S.analyzer[0]} end={S.analyzer[1]}><AnalyzerScene /></Sprite>
      <Sprite start={S.outro[0]}    end={S.outro[1]}><OutroScene /></Sprite>

      {/* Progress stepper at top of stage */}
      <SceneProgress />
    </>
  );
}

// ── Progress stepper (top ribbon) ──────────────────────────────────────────

function SceneProgress() {
  const time = useTime();
  const steps = [
    { label: 'Ticket',   at: S.jira[0],     end: S.jira[1]     },
    { label: 'Webhook',  at: S.webhook[0],  end: S.webhook[1]  },
    { label: 'Retrieve', at: S.rag[0],      end: S.rag[1]      },
    { label: 'Plan',     at: S.plan[0],     end: S.plan[1]     },
    { label: 'Execute',  at: S.sqsLoop[0],  end: S.sqsLoop[1]  },
    { label: 'PR',       at: S.pr[0],       end: S.pr[1]       },
    { label: 'Review',   at: S.analyzer[0], end: S.analyzer[1] },
  ];

  // Don't show during intro/outro
  const visible = time >= S.jira[0] - 0.3 && time <= S.analyzer[1] + 0.3;
  if (!visible) return null;

  return (
    <div style={{
      position: 'absolute', top: 24, right: 32,
      display: 'flex', gap: 6, alignItems: 'center',
      fontFamily: oo.mono, fontSize: 10,
      color: oo.textDim,
      padding: '8px 12px',
      background: 'rgba(10,16,32,0.7)',
      backdropFilter: 'blur(8px)',
      border: `1px solid ${oo.border}`,
      borderRadius: 99,
    }}>
      {steps.map((s, i) => {
        const active = time >= s.at && time <= s.end;
        const done = time > s.end;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ width: 12, height: 1, background: done ? oo.accent : oo.border }}/>}
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: active ? oo.accent : done ? oo.textDim : oo.textFaint,
              fontWeight: active ? 600 : 400,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              <Dot color={active ? oo.accent : done ? oo.accent : oo.borderHi} size={6} pulse={active}/>
              {s.label}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Audio sync ─────────────────────────────────────────────────────────────
// Hidden <audio> element that slaves narration.mp3 to the Stage playhead.
// See demos/chat-analytics/scene.jsx for the pattern.
function AudioTrack({ src }) {
  const { time, playing } = useTimeline();
  const ref = React.useRef(null);

  React.useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (playing) a.play().catch(() => {});
    else a.pause();
  }, [playing]);

  React.useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (Math.abs(a.currentTime - time) > 0.25) {
      try { a.currentTime = time; } catch {}
    }
  }, [time]);

  return <audio ref={ref} src={src} preload="auto" style={{ display: 'none' }} />;
}

Object.assign(window, { OutcomeOpsVideo, AudioTrack, DUR });
