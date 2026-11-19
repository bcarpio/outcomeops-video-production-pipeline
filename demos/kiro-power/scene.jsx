// scene.jsx
// "OutcomeOps as a Kiro Power" — Kiro writes spec-driven code; OutcomeOps
// reaches in over MCP and layers the org's ADRs + ISO controls onto it.
// Timeline driven by <Sprite> windows; AudioTrack wired after visuals lock.

const DUR = 114.92; // matches narration.mp3 (Drew @ 1.1)

const S = {
  hook:     [0.0,   8.07],
  connect:  [7.57,  23.64],
  spec:     [23.14, 35.25],
  inject:   [34.75, 69.95],
  contrast: [69.45, 91.77],
  outro:    [91.27, 114.92],
};

const ease = (t) => 1 - Math.pow(1 - t, 3);            // easeOutCubic
const ramp = (lt, a, b) => Math.min(1, Math.max(0, (lt - a) / (b - a)));

// ── Code: Kiro's first draft (local-only) ───────────────────────────────────
const DRAFT = [
  { segs: [['def ', 'kw'], ['lambda_handler', 'fn'], ['(event, context):', 'plain']] },
  { segs: [['    body = ', 'plain'], ['json', 'type'], ['.loads(event[', 'plain'], ['"body"', 'str'], ['])', 'plain']] },
  { segs: [['    amount = ', 'plain'], ['float', 'type'], ['(body[', 'plain'], ['"amount"', 'str'], ['])', 'plain']], state: 'flag' },
  { segs: [['    card = body[', 'plain'], ['"card_number"', 'str'], [']', 'plain']] },
  { segs: [['    logger.info(', 'plain'], ['f"refund {amount} to {card}"', 'str'], [')', 'plain']], state: 'flag' },
  { segs: [['    refund = ', 'plain'], ['stripe', 'type'], ['.Refund.create(', 'plain']] },
  { segs: [['        amount=amount,', 'plain']] },
  { segs: [['        payment_intent=body[', 'plain'], ['"pi"', 'str'], ['])', 'plain']] },
  { segs: [['    return ', 'kw'], ['{', 'plain'], ['"statusCode"', 'str'], [': ', 'plain'], ['200', 'num'], [',', 'plain']] },
  { segs: [['            ', 'plain'], ['"body"', 'str'], [': ', 'plain'], ['json', 'type'], ['.dumps({', 'plain'], ['"id"', 'str'], [': refund.id})}', 'plain']] },
];

// ── Code: governed by the Power ─────────────────────────────────────────────
const GOV = [
  { segs: [['from ', 'kw'], ['decimal', 'type'], [' import ', 'kw'], ['Decimal', 'type']] },                                   // 0  ADR-009
  { segs: [['from ', 'kw'], ['pydantic', 'type'], [' import ', 'kw'], ['BaseModel', 'type']] },                                // 1  ADR-004
  { segs: [['class ', 'kw'], ['RefundInput', 'type'], ['(', 'plain'], ['BaseModel', 'type'], ['):', 'plain']] },               // 2  ADR-004
  { segs: [['    amount: ', 'prop'], ['Decimal', 'type']] },                                                                   // 3  ADR-009
  { segs: [['    card_number: ', 'prop'], ['str', 'type']] },                                                                  // 4
  { segs: [['    payment_intent: ', 'prop'], ['str', 'type']] },                                                              // 5
  { segs: [['def ', 'kw'], ['lambda_handler', 'fn'], ['(event, context):', 'plain']] },                                       // 6
  { segs: [['    data = ', 'plain'], ['RefundInput', 'type'], ['(**', 'plain'], ['json', 'type'], ['.loads(event[', 'plain'], ['"body"', 'str'], [']))', 'plain']] }, // 7
  { segs: [['    masked = ', 'plain'], ['mask_pan', 'fn'], ['(data.card_number)', 'plain']] },                                // 8  A.8.11
  { segs: [['    logger.info(', 'plain'], ['"refund issued"', 'str'], [', extra={', 'plain']] },                              // 9  A.8.15
  { segs: [['        ', 'plain'], ['"amount"', 'str'], [': ', 'plain'], ['str', 'type'], ['(data.amount),', 'plain']] },      // 10 A.8.15
  { segs: [['        ', 'plain'], ['"card"', 'str'], [': masked,', 'plain']] },                                               // 11 A.8.15
  { segs: [['        ', 'plain'], ['"actor"', 'str'], [': ', 'plain'], ['auth_sub', 'fn'], ['(event)})', 'plain']] },         // 12 A.8.15
  { segs: [['    refund = ', 'plain'], ['stripe', 'type'], ['.Refund.create(', 'plain']] },                                   // 13
  { segs: [['        amount=', 'plain'], ['int', 'type'], ['(data.amount * ', 'plain'], ['100', 'num'], ['),', 'plain']] },   // 14
  { segs: [['        payment_intent=data.payment_intent)', 'plain']] },                                                       // 15
  { segs: [['    return ', 'kw'], ['_response', 'fn'], ['(', 'plain'], ['200', 'num'], [', {', 'plain'], ['"id"', 'str'], [': refund.id})', 'plain']] }, // 16 ADR-004
];

// citation -> { land time (s into inject), governed line indices, rerank score }
// score = retrieval relevance the OutcomeOps MCP returns alongside each source.
const CITES = [
  { badge: 'ADR-009', color: () => oo.accent, source: 'Standards & ADRs', title: 'Decimal over float',
    rule: 'Money is a Decimal, never a float. DynamoDB-safe.',
    score: 0.92, land: 18.8, lines: [0, 3] },
  { badge: 'A.8.11', color: () => oo.iso, source: 'ISO/IEC 27001:2022', title: 'Data Masking',
    rule: 'Card numbers masked in logs and non-prod views.',
    score: 0.90, land: 21.2, lines: [8] },
  { badge: 'A.8.15', color: () => oo.iso, source: 'ISO/IEC 27001:2022', title: 'Logging',
    rule: 'Record who performed each action, with timestamps.',
    score: 0.88, land: 24.0, lines: [9, 10, 11, 12] },
  { badge: 'ADR-004', color: () => oo.accent, source: 'Standards & ADRs', title: 'Lambda Handler Standards',
    rule: 'Pydantic on input, standard _response() on output.',
    score: 0.95, land: 27.8, lines: [1, 2, 16] },
];

// ── Beat 1 — Hook ────────────────────────────────────────────────────────────
function HookScene() {
  const { localTime, duration } = useSprite();
  const ideOp  = ramp(localTime, 0.2, 1.2);
  const l1     = ramp(localTime, 1.0, 1.9);
  const l2     = ramp(localTime, 4.0, 4.8);
  const out    = localTime > duration - 0.8 ? ramp(localTime, duration - 0.8, duration) : 0;
  const op     = 1 - out;

  // IDE recedes as the headline lands: dim deepens, container fades back.
  const reveal = Math.max(l1, l2);
  const dimAmt = 0.5 + 0.36 * reveal;          // 0.50 -> 0.86
  const ideContainerOp = ideOp * (1 - 0.45 * reveal); // ~0.9 -> ~0.5

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity: ideContainerOp, transform: `scale(${0.96 + ideOp * 0.04})` }}>
        <KiroIDE connected={false} dim={dimAmt}>
          <CodeEditor lines={DRAFT.map(l => ({ ...l, state: 'normal' }))} fontSize={17} />
        </KiroIDE>
      </div>
      {/* Scrim behind the headline for separation from the code */}
      <div style={{
        position: 'absolute', width: 1400, height: 360,
        background: 'radial-gradient(ellipse at center, rgba(5,8,18,0.9) 30%, rgba(5,8,18,0) 72%)',
        opacity: reveal, pointerEvents: 'none',
      }} />
      {/* Headline overlay */}
      <div style={{ position: 'absolute', textAlign: 'center', maxWidth: 1100 }}>
        <div style={{
          opacity: l1, transform: `translateY(${(1 - l1) * 16}px)`,
          fontFamily: oo.sans, fontSize: 60, fontWeight: 700, color: oo.text, letterSpacing: '-0.03em', lineHeight: 1.05,
        }}>
          A spec-driven <span style={{ color: oo.kiro }}>IDE</span> is brilliant.
        </div>
        <div style={{
          opacity: l2, transform: `translateY(${(1 - l2) * 14}px)`, marginTop: 18,
          fontFamily: oo.sans, fontSize: 30, fontWeight: 500, color: oo.textDim, letterSpacing: '-0.01em',
        }}>
          But it only knows the repository in front of it.
        </div>
      </div>
    </div>
  );
}

// ── Beat 2 — Connect ──────────────────────────────────────────────────────────
function ConnectScene() {
  const { localTime, duration } = useSprite();
  const enter = ramp(localTime, 0.0, 0.7);
  const typed = ramp(localTime, 1.4, 6.0);
  const connected = localTime > 8.5;
  const out = localTime > duration - 0.6 ? ramp(localTime, duration - 0.6, duration) : 0;
  const op = enter * (1 - out);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="01" subtitle="Connect" title="OutcomeOps becomes a Kiro Power." />
      <div style={{ position: 'absolute', left: '50%', top: 150, transform: `translateX(-50%) translateY(${(1 - enter) * 24}px)` }}>
        <KiroIDE activeFile="settings.json" tab=".kiro/settings.json" connected={connected}>
          <McpSettings typed={typed} connected={connected} />
        </KiroIDE>
      </div>
      {/* callout */}
      <div style={{
        position: 'absolute', right: 70, top: 250, width: 250,
        opacity: ramp(localTime, 5.5, 6.3),
        fontFamily: oo.sans,
      }}>
        <div style={{ fontFamily: oo.mono, fontSize: 11, color: oo.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>What it takes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <Chip label="One MCP endpoint" color={oo.accent} />
          <Chip label="One bearer token" color={oo.accent} />
          <Chip label="Runs in your VPC" color={oo.aws} />
        </div>
      </div>
    </div>
  );
}

// ── Beat 3 — Spec ─────────────────────────────────────────────────────────────
function SpecScene() {
  const { localTime, duration } = useSprite();
  const enter = ramp(localTime, 0.0, 0.6);
  const typed = ramp(localTime, 0.6, 4.0);
  const generating = localTime > 4.6;
  const out = localTime > duration - 0.6 ? ramp(localTime, duration - 0.6, duration) : 0;
  const op = enter * (1 - out);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="02" subtitle="Spec" title="The engineer describes the outcome." color={oo.kiro} />
      <div style={{ position: 'absolute', left: '50%', top: 150, transform: `translateX(-50%) translateY(${(1 - enter) * 24}px)` }}>
        <KiroIDE activeFile="refund_handler.py" tab="refund_handler.py" connected={true}>
          <SpecPrompt typed={typed} generating={generating} />
        </KiroIDE>
      </div>
    </div>
  );
}

// ── Beat 4 — Inject (the heart) ──────────────────────────────────────────────
function InjectScene() {
  const { localTime, duration } = useSprite();
  const enter = ramp(localTime, 0.0, 0.6);
  const out = localTime > duration - 0.7 ? ramp(localTime, duration - 0.7, duration) : 0;
  const op = enter * (1 - out);

  const governed = localTime >= 11.8;
  // swap dip: fade editor 11.5->11.8 out, 11.8->12.2 in
  const swapOp = localTime < 11.5 ? 1
    : localTime < 11.8 ? 1 - ramp(localTime, 11.5, 11.8)
    : ramp(localTime, 11.8, 12.2);

  const landed = CITES.map(c => localTime >= c.land);
  const landedCount = landed.filter(Boolean).length;
  const querying = localTime > 6.0 && landedCount === 0;

  // Build editor lines
  let lines;
  if (!governed) {
    lines = DRAFT.map((l, i) => ({ ...l }));
  } else {
    lines = GOV.map((l, i) => {
      let state = 'normal', glow = 0;
      for (let ci = 0; ci < CITES.length; ci++) {
        const c = CITES[ci];
        if (!landed[ci]) continue;
        if (c.lines.includes(i)) {
          state = 'add';
          glow = Math.max(glow, Math.max(0, 1 - (localTime - c.land) / 1.3));
        }
      }
      return { ...l, state, glow };
    });
  }

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="03" subtitle="Govern" title="The Power layers your standards in." />
      <div style={{ position: 'absolute', left: 58, top: 126 }}>
        <KiroIDE
          activeFile="refund_handler.py"
          tab="refund_handler.py"
          connected={true}
          height={706}
          rail={
            <>
              <RailHeader querying={querying} count={landedCount} />
              <div style={{ flex: 1, overflow: 'hidden', paddingBottom: 12 }}>
                {CITES.map((c, ci) => {
                  const ap = ramp(localTime, c.land - 0.5, c.land + 0.4);
                  if (ap <= 0) return null;
                  return (
                    <CitationCard key={ci}
                      badge={c.badge} badgeColor={c.color()} source={c.source}
                      title={c.title} rule={c.rule} score={c.score} appear={ap} />
                  );
                })}
              </div>
            </>
          }
        >
          <div style={{ opacity: swapOp, height: '100%', overflow: 'hidden' }}>
            <CodeEditor lines={lines} fontSize={16} />
          </div>
        </KiroIDE>
      </div>

      {/* Pre-injection annotation: what's wrong with the local draft */}
      {!governed && localTime > 1.4 && (
        <div style={{
          position: 'absolute', left: 58, top: 846,
          fontFamily: oo.sans, fontSize: 16, color: oo.danger, fontWeight: 500,
          opacity: ramp(localTime, 1.4, 2.2) * (1 - ramp(localTime, 11.0, 11.8)),
        }}>
          Locally valid. Logs the full card number; stores money as a float.
        </div>
      )}
      {/* Settled tag */}
      {landedCount === 4 && (
        <div style={{
          position: 'absolute', left: 58, top: 846,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 16px', borderRadius: 99,
          background: oo.successBg, border: `1px solid ${oo.success}`,
          color: oo.success, fontFamily: oo.mono, fontSize: 14, fontWeight: 600,
          opacity: ramp(localTime, 28.5, 29.5),
        }}>
          <svg width="15" height="15" viewBox="0 0 16 16"><path d="M4 8l3 3 5-6" stroke={oo.success} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Grounded in your own standards — every source retrieved, cited, and scored
        </div>
      )}
    </div>
  );
}

// ── Beat 5 — Contrast ─────────────────────────────────────────────────────────
function ContrastScene() {
  const { localTime, duration } = useSprite();
  const enter = ramp(localTime, 0.0, 0.6);
  const out = localTime > duration - 0.7 ? ramp(localTime, duration - 0.7, duration) : 0;
  const op = enter * (1 - out);

  // Staggered choreography fitted to the narration (~19s).
  const mapLabel = ramp(localTime, 12.0, 12.8);
  const chipIn = (i) => ramp(localTime, 15.2 + i * 1.8, 15.9 + i * 1.8);
  const mapTail = ramp(localTime, 20.4, 21.1);

  // x, accent, kicker, head, sub, items, cardStart, itemStart
  const Col = ({ x, accent, kicker, head, sub, items, cardStart, itemStart }) => {
    const opv = ramp(localTime, cardStart, cardStart + 0.8);
    return (
      <div style={{
        position: 'absolute', left: x, top: 200, width: 540, opacity: opv,
        transform: `translateY(${(1 - opv) * 18}px)`,
        background: oo.surface, border: `1px solid ${accent}40`, borderRadius: 16, padding: '26px 28px',
      }}>
        <div style={{ fontFamily: oo.mono, fontSize: 12, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{kicker}</div>
        <div style={{ fontFamily: oo.sans, fontSize: 28, fontWeight: 700, color: oo.text, marginTop: 8, letterSpacing: '-0.02em' }}>{head}</div>
        <div style={{ fontFamily: oo.sans, fontSize: 15, color: oo.textDim, marginTop: 6, lineHeight: 1.45 }}>{sub}</div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((it, i) => {
            const iv = ramp(localTime, itemStart + i * 0.45, itemStart + i * 0.45 + 0.45);
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, fontFamily: oo.sans, fontSize: 16, color: oo.text,
                opacity: iv, transform: `translateX(${(1 - iv) * 10}px)`,
              }}>
                {it.ok ? (
                  <svg width="20" height="20" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={oo.successBg}/><path d="M4.5 8l2.2 2.2L11.5 5.5" stroke={oo.success} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={oo.dangerBg}/><path d="M5.3 5.3l5.4 5.4M10.7 5.3l-5.4 5.4" stroke={oo.danger} strokeWidth="1.8" strokeLinecap="round"/></svg>
                )}
                {it.t}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="04" subtitle="Why it matters" title="House rules become enforced controls." />

      <Col x={120} accent={oo.danger} cardStart={0.6} itemStart={1.4}
        kicker="Without the Power"
        head="Standards live in a wiki"
        sub="The rule exists. Whether it reaches the code is up to whoever reviews the PR."
        items={[{ ok: false, t: 'Caught in review — sometimes' }, { ok: false, t: 'Drift accumulates across repos' }, { ok: false, t: 'Knowledge decays outside the workspace' }]}
      />
      <Col x={940} accent={oo.success} cardStart={6.0} itemStart={6.8}
        kicker="With OutcomeOps"
        head="Enforced at generation"
        sub="The same ADRs and ISO controls shape the code the moment it is written."
        items={[{ ok: true, t: 'Applied every time, not by luck' }, { ok: true, t: 'Sources retrieved, cited, and scored' }, { ok: true, t: 'Knowledge compounds per accepted PR' }]}
      />

      {/* Compliance mapping strip — staggered in after both columns */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 70, transform: `translateX(-50%) translateY(${(1 - mapLabel) * 14}px)`,
        opacity: mapLabel, display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 22px', background: oo.bg2, border: `1px solid ${oo.border}`, borderRadius: 99,
      }}>
        <span style={{ fontFamily: oo.mono, fontSize: 13, color: oo.iso, fontWeight: 600 }}>ISO security standards</span>
        <svg width="22" height="14" viewBox="0 0 22 14"><path d="M0 7h18M14 2l5 5-5 5" stroke={oo.textDim} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <Chip label="PCI DSS" color={oo.accent} style={{ opacity: chipIn(0) }} />
        <Chip label="GDPR" color={oo.accent} style={{ opacity: chipIn(1) }} />
        <Chip label="FedRAMP" color={oo.accent} style={{ opacity: chipIn(2) }} />
        <span style={{ fontFamily: oo.sans, fontSize: 13, color: oo.textDim, opacity: mapTail }}>mapped, not reinvented</span>
      </div>
    </div>
  );
}

// ── Beat 6 — Outro (trust boundary + brand) ──────────────────────────────────
function OutroScene() {
  const { localTime, duration } = useSprite();
  const enter = ramp(localTime, 0.0, 0.6);
  const headIn = ramp(localTime, 0.4, 1.2);
  const diagram = ramp(localTime, 0.8, 2.2);
  // hand off from diagram to brand as the narration turns to the close (~13s)
  const toBrand = ramp(localTime, 13.1, 14.3);
  const brandIn = ramp(localTime, 14.1, 15.1);
  const tagIn = ramp(localTime, 15.0, 15.8);
  const ctaIn = ramp(localTime, 16.0, 16.8);
  const op = enter;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      {/* Phase A — trust boundary */}
      <div style={{ opacity: 1 - toBrand, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', left: '50%', top: 92, transform: 'translateX(-50%)',
          textAlign: 'center', opacity: headIn,
        }}>
          <div style={{ fontFamily: oo.sans, fontSize: 46, fontWeight: 700, color: oo.text, letterSpacing: '-0.025em' }}>
            Nothing leaves your trust boundary.
          </div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: 230, transform: 'translateX(-50%)' }}>
          <TrustBoundary reveal={diagram} />
        </div>
      </div>

      {/* Phase B — brand + CTA */}
      <div style={{
        position: 'absolute', inset: 0, opacity: toBrand,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34,
      }}>
        <div style={{ opacity: brandIn }}><BrandMark size={62} /></div>
        <div style={{
          opacity: tagIn, transform: `translateY(${(1 - tagIn) * 14}px)`,
          fontFamily: oo.sans, fontSize: 50, fontWeight: 700, color: oo.text,
          textAlign: 'center', letterSpacing: '-0.025em', lineHeight: 1.1, maxWidth: 1200,
        }}>
          Keep the IDE you love.<br/>
          <span style={{ background: `linear-gradient(90deg, ${oo.accent}, ${oo.kiro})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Give it the context only your org has.
          </span>
        </div>
        <div style={{
          opacity: ctaIn, transform: `translateY(${(1 - ctaIn) * 10}px)`,
          display: 'flex', alignItems: 'center', gap: 16,
          fontFamily: oo.mono, fontSize: 15, color: oo.textDim, letterSpacing: '0.04em',
        }}>
          <span style={{ color: oo.accent }}>www.outcomeops.ai</span>
          <span style={{ color: oo.border }}>·</span>
          <span>Kiro + OutcomeOps over MCP</span>
        </div>
      </div>
    </div>
  );
}

// ── Progress stepper (top ribbon) ───────────────────────────────────────────
function SceneProgress() {
  const time = useTime();
  const steps = [
    { label: 'Connect', at: S.connect[0],  end: S.connect[1] },
    { label: 'Spec',    at: S.spec[0],     end: S.spec[1] },
    { label: 'Govern',  at: S.inject[0],   end: S.inject[1] },
    { label: 'Why',     at: S.contrast[0], end: S.contrast[1] },
  ];
  const visible = time >= S.connect[0] - 0.3 && time <= S.contrast[1] + 0.3;
  if (!visible) return null;
  return (
    <div style={{
      position: 'absolute', top: 26, right: 34, display: 'flex', gap: 8, alignItems: 'center',
      fontFamily: oo.mono, fontSize: 10, color: oo.textDim, padding: '8px 14px',
      background: 'rgba(10,16,32,0.7)', backdropFilter: 'blur(8px)',
      border: `1px solid ${oo.border}`, borderRadius: 99, zIndex: 10,
    }}>
      {steps.map((s, i) => {
        const active = time >= s.at && time <= s.end;
        const done = time > s.end;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ width: 14, height: 1, background: done ? oo.accent : oo.border }} />}
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: active ? oo.accent : done ? oo.textDim : oo.textFaint,
              fontWeight: active ? 600 : 400, letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              <Dot color={active ? oo.accent : done ? oo.accent : oo.borderHi} size={6} pulse={active} />
              {s.label}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Root composition ────────────────────────────────────────────────────────
function OutcomeOpsVideo() {
  return (
    <>
      <StageBackdrop />
      <Sprite start={S.hook[0]}     end={S.hook[1]}><HookScene /></Sprite>
      <Sprite start={S.connect[0]}  end={S.connect[1]}><ConnectScene /></Sprite>
      <Sprite start={S.spec[0]}     end={S.spec[1]}><SpecScene /></Sprite>
      <Sprite start={S.inject[0]}   end={S.inject[1]}><InjectScene /></Sprite>
      <Sprite start={S.contrast[0]} end={S.contrast[1]}><ContrastScene /></Sprite>
      <Sprite start={S.outro[0]}    end={S.outro[1]}><OutroScene /></Sprite>
      <SceneProgress />
    </>
  );
}

// ── Audio sync (wired after visuals lock) ───────────────────────────────────
function AudioTrack({ src }) {
  const { time, playing } = useTimeline();
  const ref = React.useRef(null);
  React.useEffect(() => {
    const a = ref.current; if (!a) return;
    if (playing) a.play().catch(() => {}); else a.pause();
  }, [playing]);
  React.useEffect(() => {
    const a = ref.current; if (!a) return;
    if (Math.abs(a.currentTime - time) > 0.25) { try { a.currentTime = time; } catch {} }
  }, [time]);
  return <audio ref={ref} src={src} preload="auto" style={{ display: 'none' }} />;
}

Object.assign(window, { OutcomeOpsVideo, AudioTrack, DUR });
