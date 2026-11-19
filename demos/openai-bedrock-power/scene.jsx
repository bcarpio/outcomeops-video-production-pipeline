// scene.jsx -- "OutcomeOps + OpenAI on Bedrock: Pick the Model. Keep the Substrate."
//
// Beat structure:
//   Beat 1  HOOK      0.0 - 14.5   Model-war headline swarm collapses to a thesis line
//   Beat 2  BEDROCK   14.0 - 42.5  AWS gets a sincere thank-you (wordmark + 20 models)
//   Beat 3  PIVOT     42.0 - 60.5  Editorial moment -- "doesn't matter which you pick"
//   Beat 4  OUTCOME   60.0 - 110.5 SAME query, three models, same cited answer
//   Beat 5  CONTRAST  110.0 - 128.5 What the industry debates vs what ships outcomes
//   Beat 6  OUTRO     128.0 - 140.0 Three-tier stack + brand + CTA
//
// Silent build mode -- no AudioTrack mounted. Stage's RAF tick drives time.
// Audio synth happens after visuals are approved.

// Windows fitted to narration.mp3 (Drew @ 1.1 + atempo=1.07 = effective 1.18).
// Per-beat speech start:
//   b1     1.00s  -- "For two years..."
//   b2    16.35s  -- "Then A W S did something remarkable..."
//   b2b   39.30s  -- "And the latest addition just landed..." (OpenAI launch)
//   b3    55.60s  -- "We're going to argue something a little contrarian..."
//   b4    69.84s  -- "When a security architect asks..."
//   b5   103.71s  -- "The model is a commodity..."
//   b6   124.30s  -- "OpenAI brings the synthesis..."
const DUR = 136.49;

const S = {
  hook:     [  0.00,  16.35],
  bedrock:  [ 15.35,  55.40],  // covers both b2 and b2b
  pivot:    [ 54.40,  69.74],
  outcome:  [ 68.74, 103.61],
  contrast: [102.61, 124.20],
  outro:    [123.20, 136.49],
};

const ease  = (t) => 1 - Math.pow(1 - t, 3);
const ramp  = (lt, a, b) => Math.min(1, Math.max(0, (lt - a) / Math.max(0.0001, (b - a))));

// ── Beat 1: HOOK -- model wars ────────────────────────────────────────────
//
// 12 mocked tech-discourse cards drift across the canvas at random
// trajectories. They appear staggered through the first ~8s, then around
// lt=9 they fade and the "for two years..." thesis headline lands.

const HEADLINES = [
  { kind: 'tweet',    source: 'twitter',         handle: '@frontier_ai',     text: 'Claude 4.6 still owns long-context coding. GPT-5 is faster but loses the thread.' },
  { kind: 'headline', source: 'venturebeat',     handle: '',                 text: 'Why Grok\'s new context window changes everything for agentic workloads' },
  { kind: 'tweet',    source: 'twitter',         handle: '@ml_practical',    text: 'Just ran the same eval on GPT-5.5 and Claude Sonnet 4.6. Within 2%. The benchmark wars are over.' },
  { kind: 'talk',     source: 'reinvent 2025',   handle: 'breakout session', text: 'From Converse to Mantle: A Multi-Family LLM Strategy on Bedrock' },
  { kind: 'headline', source: 'the verge',       handle: '',                 text: 'Mistral Large 3 matches Claude Opus at one-third the cost, benchmarks suggest' },
  { kind: 'tweet',    source: 'linkedin',        handle: 'cto · series b',   text: 'We spent six weeks evaluating GPT-5 vs Claude. Picked Claude. Six months later we\'re evaluating again. This is unsustainable.' },
  { kind: 'headline', source: 'techcrunch',      handle: '',                 text: 'GPT-5.5 redefines frontier reasoning -- but at what integration cost?' },
  { kind: 'tweet',    source: 'hacker news',     handle: 'top story · 412↑', text: 'Llama 4 catches up. Open weights are no longer the trailing tier.' },
  { kind: 'talk',     source: 'qcon london',     handle: 'keynote',          text: 'The Five Frontier Models Your CISO Will Approve in 2026' },
  { kind: 'headline', source: 'wired',           handle: '',                 text: 'DeepSeek v3 is the open-weights inflection point everyone underestimated' },
  { kind: 'tweet',    source: 'twitter',         handle: '@ai_eng_weekly',   text: 'POV: your platform team is choosing between three frontier vendors every quarter and your roadmap is on hold.' },
  { kind: 'headline', source: 'ars technica',    handle: '',                 text: 'Anthropic, OpenAI, and xAI: who actually wins the enterprise reasoning race?' },
];

// Pseudo-random but deterministic placements for the cards.
// (x, y, rotation, scale, appearAt, swarmTrajectory)
const HEADLINE_POSITIONS = [
  { x: 320,  y: 200, rot: -6,  scale: 0.95, appear: 0.3,  drift: { dx: -40, dy:  20 } },
  { x: 1280, y: 250, rot:  8,  scale: 1.0,  appear: 0.9,  drift: { dx:  30, dy: -20 } },
  { x: 220,  y: 540, rot:  4,  scale: 1.0,  appear: 1.5,  drift: { dx: -30, dy:  30 } },
  { x: 1340, y: 580, rot: -7,  scale: 0.92, appear: 2.1,  drift: { dx:  40, dy:  10 } },
  { x: 560,  y: 720, rot:  3,  scale: 0.98, appear: 2.7,  drift: { dx:  10, dy:  30 } },
  { x: 1100, y: 730, rot: -4,  scale: 0.95, appear: 3.3,  drift: { dx:  20, dy:  20 } },
  { x: 200,  y: 350, rot:  6,  scale: 0.90, appear: 3.9,  drift: { dx: -20, dy:  10 } },
  { x: 1380, y: 410, rot: -5,  scale: 0.97, appear: 4.5,  drift: { dx:  40, dy: -10 } },
  { x: 800,  y: 180, rot: -2,  scale: 0.94, appear: 5.1,  drift: { dx:   0, dy: -20 } },
  { x: 480,  y: 380, rot:  5,  scale: 1.02, appear: 5.7,  drift: { dx: -10, dy:  10 } },
  { x: 1080, y: 380, rot: -6,  scale: 0.94, appear: 6.3,  drift: { dx:  30, dy:  20 } },
  { x: 760,  y: 600, rot:  4,  scale: 0.99, appear: 6.9,  drift: { dx:   0, dy:  20 } },
];

function HookScene() {
  const { localTime, duration } = useSprite();
  // Cards fade out 9.0..10.5 to clear stage for the headline
  const cardsHold = 1 - ramp(localTime, 9.0, 10.5);
  // Thesis headline rises 10.0..12.0
  const heroIn = ramp(localTime, 10.0, 12.0);
  // Out at end of beat
  const out = localTime > duration - 0.6 ? ramp(localTime, duration - 0.6, duration) : 0;
  const op = 1 - out;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op, pointerEvents: 'none' }}>
      {/* Headline swarm */}
      {HEADLINES.map((h, i) => {
        const p = HEADLINE_POSITIONS[i];
        const appear = ramp(localTime, p.appear, p.appear + 0.5);
        const driftP = ease(ramp(localTime, p.appear, p.appear + 3.0));
        const x = p.x + p.drift.dx * driftP;
        const y = p.y + p.drift.dy * driftP;
        const cardOp = appear * cardsHold;
        if (cardOp <= 0.01) return null;
        return (
          <HeadlineCard key={i}
            kind={h.kind} source={h.source} handle={h.handle} text={h.text}
            x={x} y={y} rot={p.rot} scale={p.scale} opacity={cardOp}/>
        );
      })}

      {/* Thesis headline */}
      <EditorialHero
        headline="For two years, the conversation has been about which model wins."
        opacity={heroIn} ty={(1 - heroIn) * 12}
        size={48} subSize={18}
      />
    </div>
  );
}

// ── Beat 2: BEDROCK -- AWS gets a sincere thank-you ───────────────────────
//
// Two phases. Phase 1 (0..21s) is the generic Bedrock achievement: header
// rises, 20-badge grid cascades, three "control plane / IAM / your account"
// callouts orbit. Phase 2 (21..34s) is the OpenAI GPT-5.5 celebration --
// the OpenAI tile lifts out of the grid into a hero position, the shelf
// dims behind it, and fireworks pop across the canvas. Tone is sincerely
// congratulatory; the editorial "so what" lives in Beat 3.

// OpenAI GPT-5.5 lives at MODEL_GRID[1][0] -- index 5 in the flat layout.
const OPENAI_GRID_INDEX = 5;

function BedrockScene() {
  const { localTime, duration } = useSprite();
  const enter = ramp(localTime, 0.0, 0.6);
  const out = localTime > duration - 0.6 ? ramp(localTime, duration - 0.6, duration) : 0;
  const op = enter * (1 - out);

  // Phase 1 -- generic Bedrock thank-you
  const headerOp = ramp(localTime, 0.4, 2.6);
  const gridReveal = Array.from({ length: 20 }, (_, i) => {
    const start = 3.0 + i * 0.55;
    return ramp(localTime, start, start + 1.0);
  });
  const calloutOps = [
    ramp(localTime, 17.0, 18.4),
    ramp(localTime, 18.0, 19.4),
    ramp(localTime, 19.0, 20.4),
  ];

  // Phase 2 -- OpenAI celebration. Synced to b2b voice (tempo 1.07):
  //   b2  voice ends at lt 22.45 ("...deserves to be named.")
  //   lt 22.5..24.0  OpenAI tile lifts out of the grid into hero position
  //   lt 23.95       b2b voice starts ("And the latest addition just landed...")
  //   lt 23.5..29.5  fireworks bursts across the canvas
  //   lt 24.5..38    "Congrats to OpenAI" caption visible
  //   b2b voice ends at lt 38.55 ("...officially commodified.")
  //   lt 38.5..40    everything fades back out -- aligned with beat-level
  //                  fade-out so the empty GPT-5.5 grid slot is never
  //                  visible without the hero card covering it
  const celebrationIn  = ramp(localTime, 22.5, 24.0);
  const celebrationOut = ramp(localTime, 38.5, 40.0);
  const celebrationOp  = celebrationIn * (1 - celebrationOut);
  const captionIn      = ramp(localTime, 24.5, 26.0);
  const captionOp      = captionIn * (1 - celebrationOut);

  // Hide the OpenAI tile from the grid the moment it starts to lift.
  // The hero CelebrationCard replaces it.
  const hideIndex = celebrationIn > 0.05 ? OPENAI_GRID_INDEX : -1;

  // Dim the rest of the shelf hard during celebration so the hero tile
  // and the caption own the spotlight. Drops to 15% opacity at peak.
  const shelfDim = 1 - 0.85 * celebrationOp;

  // Fireworks reference -- prog clock starts when celebration begins.
  // Caption uses small Y offset for a subtle rise feel.
  const fwTime = Math.max(0, localTime - 23.0);
  const fwOp   = celebrationIn * (1 - celebrationOut);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="01" subtitle="The Bedrock Achievement" title="Twenty-plus frontier models. One control plane."/>

      {/* The shelf itself -- dims during celebration */}
      <div style={{ opacity: shelfDim }}>
        <BedrockShelf
          headerOp={headerOp}
          gridReveal={gridReveal}
          calloutOps={calloutOps}
          hideIndex={hideIndex}/>
      </div>

      {/* Fireworks layer -- only present during celebration */}
      <FireworksLayer t={fwTime} opacity={fwOp}/>

      {/* Hero OpenAI celebration card -- lifts to center, scales up */}
      <CelebrationCard
        opacity={celebrationOp}
        scale={0.55 + 0.45 * ease(celebrationIn)}
        ty={(1 - ease(celebrationIn)) * 30}
      />

      {/* Congrats caption beneath the hero card */}
      <CelebrationCaption opacity={captionOp} ty={(1 - captionIn) * 8}/>
    </div>
  );
}

// ── Beat 3: PIVOT -- editorial moment ─────────────────────────────────────
function PivotScene() {
  const { localTime, duration } = useSprite();
  const enter = ramp(localTime, 0.0, 0.6);
  const out = localTime > duration - 0.6 ? ramp(localTime, duration - 0.6, duration) : 0;
  const op = enter * (1 - out);

  // Earlier iteration tried to carry the Bedrock shelf over (shrunk + pushed
  // to the bottom). It clashed badly with the sub-headline. The editorial
  // moment actually lands harder on an empty stage -- abrupt visual silence
  // after Beat 2's density makes the "doesn't matter which one you pick"
  // headline feel like the verdict that follows the demonstration.

  // Phase A headline 1.5..4.5 (small, leading)
  const phaseAIn  = ramp(localTime, 1.5, 3.0);
  const phaseAOut = ramp(localTime, 6.5, 8.0);
  const phaseAOp  = phaseAIn * (1 - phaseAOut);

  // Phase B headline 8.0..end (the giant payoff)
  const phaseBIn  = ramp(localTime, 8.0, 10.0);
  const phaseBSubIn = ramp(localTime, 12.0, 13.5);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      {/* Phase A -- leading editorial */}
      <div style={{ position: 'absolute', inset: 0, opacity: phaseAOp }}>
        <EditorialHero
          headline="And we're going to argue something a little contrarian."
          opacity={1}
          size={36}
        />
      </div>

      {/* Phase B -- the payoff */}
      <div style={{ position: 'absolute', inset: 0, opacity: phaseBIn }}>
        <EditorialHero
          headline={
            <span>
              It doesn't matter
              <br/>
              <span style={{ color: '#5AA9FF' }}>which one you pick.</span>
            </span>
          }
          sub={phaseBSubIn > 0 ? (
            <span style={{ opacity: phaseBSubIn }}>
              Because picking a model is still picking a tool.
              <br/>
              We're not in that business.
            </span>
          ) : null}
          size={68} subSize={20}
        />
      </div>
    </div>
  );
}

// ── Beat 4: OUTCOME -- the heart ──────────────────────────────────────────
//
// Same question, three models, same cited answer.
// Three AnswerPanels render side-by-side. The PROSE is slightly different
// per model (because models phrase differently) but the CITATIONS are
// identical -- that's the whole point of the beat.

const CITATIONS = [
  { source: 'handler.py · ADR-031',       badge: 'ADR',     color: '#5AA9FF' },
  { source: 'mask_pan.py · A.8.11',       badge: 'ISO',     color: '#34D399' },
  { source: 'audit_log.py · A.8.15',      badge: 'ISO',     color: '#34D399' },
  { source: 'RUNBOOK · PCI refund flow',  badge: 'RUNBOOK', color: '#A78BFA' },
];

const ANSWERS = [
  {
    model: { name: 'Claude Sonnet 4.6', vendor: 'anthropic' },
    prose: 'PCI card data is handled in three places. handler.py routes the request through the auth gateway pattern from ADR-031. mask_pan.py masks the card number per ISO A.8.11 before any log emission. audit_log.py records the access event per A.8.15. The complete operational sequence is in RUNBOOK · PCI refund flow.',
  },
  {
    model: { name: 'OpenAI GPT-5.5', vendor: 'openai' },
    prose: 'Three call sites touch PCI card data in this codebase. The auth gateway pattern (ADR-031) is enforced inside handler.py. Masking per ISO A.8.11 is applied via mask_pan.py prior to logging. Access logging per A.8.15 is wired through audit_log.py. RUNBOOK · PCI refund flow contains the full operational walkthrough.',
  },
  {
    model: { name: 'Grok 4.3', vendor: 'xai' },
    prose: 'PCI card data appears at three points in the codebase. handler.py invokes the auth gateway from ADR-031. mask_pan.py performs masking per ISO A.8.11 ahead of logging. audit_log.py captures the access event per A.8.15. The RUNBOOK · PCI refund flow documents the complete refund sequence.',
  },
];

function OutcomeScene() {
  const { localTime, duration } = useSprite();
  const enter = ramp(localTime, 0.0, 0.6);
  const out = localTime > duration - 0.7 ? ramp(localTime, duration - 0.7, duration) : 0;
  const op = enter * (1 - out);

  // Phase A 0.0-3.0: query bubble lands
  const queryOp = ramp(localTime, 0.6, 2.0);
  // Phase B 4.0-37.0: three answer panels appear staggered, each types prose
  // and lands citations
  const panelAppear = (i) => ramp(localTime, 4.0 + i * 1.4, 5.2 + i * 1.4);
  const proseReveal = (i) => ramp(localTime, 6.0 + i * 1.4, 14.0 + i * 1.4);
  const citeReveal = (i, c) =>
    ramp(localTime, 14.5 + i * 1.4 + c * 0.6, 15.3 + i * 1.4 + c * 0.6);

  // Phase C: tfvars panel rises + green pill lands. Synced to b4 voice
  // (tempo 1.07):
  //   b4 voice ends at lt 31.87 ("...The customer picks the model. We don't.")
  //   lt 26.2     panels begin dimming as voice closes
  //   lt 26.7     tfvars rises -- visual pivot to "the customer picks"
  //   lt 30.5     green pill lands -- punchline syncs with "We don't"
  //   lt 34.9     Sprite fades out
  const tfvarsOp = ramp(localTime, 26.7, 28.0);
  const pillIn = ramp(localTime, 30.5, 31.8);
  const panelDim = 1 - 0.65 * ramp(localTime, 26.2, 27.6);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="02" subtitle="The Outcome" title="Same question. Three models. Same answer."/>

      <QueryBubble
        persona="Security Architect"
        question="Where do we touch PCI card data?"
        opacity={queryOp}
        ty={(1 - queryOp) * 8}
      />

      {/* Three panels */}
      <div style={{
        position: 'absolute', left: '50%', top: 280,
        transform: 'translateX(-50%)',
        display: 'flex', gap: 18,
        opacity: panelDim,
      }}>
        {ANSWERS.map((a, i) => (
          <AnswerPanel key={i}
            model={a.model}
            prose={a.prose}
            citations={CITATIONS}
            appear={panelAppear(i)}
            proseReveal={proseReveal(i)}
            citeReveal={[citeReveal(i, 0), citeReveal(i, 1), citeReveal(i, 2), citeReveal(i, 3)]}
          />
        ))}
      </div>

      {/* tfvars triplet -- "the customer picks" */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 120,
        transform: `translateX(-50%) translateY(${(1 - tfvarsOp) * 16}px)`,
        opacity: tfvarsOp,
      }}>
        <TfvarsTriPanel opacity={1}/>
      </div>

      {/* Green pill: "The customer picks. We don't." */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 50,
        transform: `translateX(-50%) translateY(${(1 - pillIn) * 6}px)`,
        opacity: pillIn,
      }}>
        <Chip color={oo.success}>
          <Dot color={oo.success} size={7}/>
          The Customer Picks · We Don't
        </Chip>
      </div>
    </div>
  );
}

// ── Beat 5: CONTRAST -- what's debated vs what ships outcomes ─────────────
function ContrastScene() {
  const { localTime, duration } = useSprite();
  const enter = ramp(localTime, 0.0, 0.6);
  const out = localTime > duration - 0.7 ? ramp(localTime, duration - 0.7, duration) : 0;
  const op = enter * (1 - out);

  // b5 voice runs lt 1.1 -> 20.48 (tempo 1.07).  Items stagger across
  // lt 3.3..11.5 so they continue landing while voice walks through
  // "outcomes are what your engineers trust / auditors accept / C I S O
  // signs off."  The bottom tagline lands at lt 16.4 to coincide with
  // voice's closing line: "The model is the commodity. The outcome is
  // the moat."
  const leftCol = ramp(localTime, 0.8, 2.0);
  const rightCol = ramp(localTime, 1.6, 3.0);
  const itemAt = (col, i) => ramp(localTime,
    3.3 + (col === 'r' ? 0.5 : 0) + i * 1.12,
    4.0 + (col === 'r' ? 0.5 : 0) + i * 1.12);
  const tagIn = ramp(localTime, 16.4, 17.8);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <SceneLabel number="03" subtitle="Tools vs Outcomes" title="Where the moat actually is."/>

      <div style={{
        position: 'absolute', left: '50%', top: 200,
        transform: 'translateX(-50%)',
        display: 'flex', gap: 24,
      }}>
        <div style={{ opacity: leftCol, transform: `translateX(${(1 - leftCol) * -10}px)` }}>
          <ContrastColumn
            title="What the industry debates"
            accent={oo.danger}
            items={[
              'Benchmark scores and leaderboard position',
              'Context window size',
              'Cost per million tokens',
              'P50 / P95 latency comparisons',
              'Which vendor "wins" this quarter',
            ]}
            itemReveal={[itemAt('l', 0), itemAt('l', 1), itemAt('l', 2), itemAt('l', 3), itemAt('l', 4)]}
          />
        </div>
        <div style={{ opacity: rightCol, transform: `translateX(${(1 - rightCol) * 10}px)` }}>
          <ContrastColumn
            title="What actually ships outcomes"
            accent={oo.success}
            items={[
              'Your standards retrieved, cited, scored',
              'Your decisions enforced at generation time',
              'Your audit trail records who · when · which model',
              'Your trust boundary holds',
              'The answer your team actually trusts',
            ]}
            itemReveal={[itemAt('r', 0), itemAt('r', 1), itemAt('r', 2), itemAt('r', 3), itemAt('r', 4)]}
          />
        </div>
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 60,
        textAlign: 'center', opacity: tagIn,
        transform: `translateY(${(1 - tagIn) * 8}px)`,
        fontFamily: oo.sans, fontSize: 22, fontWeight: 600,
        color: oo.text, letterSpacing: '-0.015em',
      }}>
        The model is the <span style={{ color: oo.warn }}>commodity</span>.
        {' '}
        The outcome is the <span style={{ color: oo.success }}>moat</span>.
      </div>
    </div>
  );
}

// ── Beat 6: OUTRO -- three-tier stack + brand + CTA ───────────────────────
function OutroScene() {
  const { localTime, duration } = useSprite();
  const enter = ramp(localTime, 0.0, 0.6);

  // b6 voice runs lt 1.1 -> 10.76 at tempo 1.07. Three phrases:
  //   lt 1.1 - 5.2   "OpenAI brings the synthesis. A W S brings the
  //                  deployment. OutcomeOps brings the outcome."
  //   lt 5.2 - 7.5   "Pick the model. Keep the substrate."
  //   lt 7.5 - 10.7  "OutcomeOps dot A I."

  // Phase A: 3-tier stack assembles bottom-up during the attribution
  // voice; headline lands as voice arrives at "Pick the model"
  const tierOp = [
    ramp(localTime, 1.0, 1.9),   // bottom: AWS Account (during "OpenAI brings...")
    ramp(localTime, 1.9, 2.8),   // middle: Bedrock     (during "A W S brings...")
    ramp(localTime, 2.8, 3.7),   // top: OutcomeOps     (during "OutcomeOps brings...")
  ];
  const headIn = ramp(localTime, 5.2, 6.1);

  // Phase B: crossfade to brand mark + URL CTA during the closing
  // "OutcomeOps dot A I" line.
  const toBrand = ramp(localTime, 7.4, 8.5);
  const brandIn = ramp(localTime, 7.9, 8.8);
  const tagIn   = ramp(localTime, 8.6, 9.3);
  const ctaIn   = ramp(localTime, 9.2, 9.9);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: enter }}>
      {/* Phase A: stack + headline */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - toBrand }}>
        <BetterTogetherStack tierOp={tierOp}/>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 90,
          textAlign: 'center', opacity: headIn,
          transform: `translateY(${(1 - headIn) * 8}px)`,
          fontFamily: oo.sans, fontSize: 44, fontWeight: 800,
          color: oo.text, letterSpacing: '-0.022em',
        }}>
          Pick the model. <span style={{ color: oo.accent }}>Keep the substrate.</span>
        </div>
      </div>

      {/* Phase B: brand + tagline + CTA */}
      <div style={{
        position: 'absolute', inset: 0, opacity: brandIn,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 30,
      }}>
        <BrandMark size={1.2}/>
        <div style={{
          opacity: tagIn,
          textAlign: 'center',
          fontFamily: oo.sans, fontSize: 28, fontWeight: 700,
          color: oo.text, letterSpacing: '-0.018em',
        }}>
          We deliver <span style={{ color: oo.accent }}>outcomes</span>.
        </div>
        <div style={{
          opacity: ctaIn,
          padding: '14px 28px', borderRadius: 99,
          background: oo.bg2, border: `1px solid ${oo.accent}55`,
          display: 'flex', alignItems: 'center', gap: 16,
          fontFamily: oo.mono, fontSize: 14, fontWeight: 700,
          color: oo.text, letterSpacing: '0.04em',
        }}>
          <span style={{ color: oo.accent }}>www.outcomeops.ai</span>
          <span style={{ color: oo.textFaint }}>·</span>
          <span>OpenAI + AWS Bedrock + OutcomeOps over MCP</span>
        </div>
      </div>
    </div>
  );
}

// ── Progress stepper (top-right) ──────────────────────────────────────────
// Mirrors kiro-power's pattern -- shows scene number + label while we're
// in the body of the video (beats 2-5).
function SceneProgress() {
  const { time } = useTimeline();
  if (time < S.bedrock[0] - 0.3 || time > S.contrast[1] + 0.3) return null;

  const steps = [
    { key: 'bedrock',  label: 'Bedrock',  window: S.bedrock  },
    { key: 'pivot',    label: 'But',      window: S.pivot    },
    { key: 'outcome',  label: 'Outcome',  window: S.outcome  },
    { key: 'contrast', label: 'Outcomes', window: S.contrast },
  ];

  return (
    <div style={{
      position: 'absolute', top: 26, right: 34, zIndex: 10,
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '8px 16px',
      background: 'rgba(10,16,32,0.7)',
      backdropFilter: 'blur(8px)',
      border: `1px solid ${oo.border}`,
      borderRadius: 99,
      fontFamily: oo.mono, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
    }}>
      {steps.map((s, i) => {
        const active = time >= s.window[0] && time < s.window[1];
        const done   = time >= s.window[1];
        const color  = active ? oo.accent : done ? oo.success : oo.textFaint;
        return (
          <React.Fragment key={s.key}>
            {i > 0 && <span style={{ color: oo.textFaint }}>·</span>}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color, opacity: active ? 1 : 0.7,
            }}>
              <Dot color={color} size={6} pulse={active}/>
              {s.label}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Top-level composition ─────────────────────────────────────────────────
function OutcomeOpsVideo() {
  return (
    <>
      <StageBackdrop />
      <Sprite start={S.hook[0]}     end={S.hook[1]}><HookScene /></Sprite>
      <Sprite start={S.bedrock[0]}  end={S.bedrock[1]}><BedrockScene /></Sprite>
      <Sprite start={S.pivot[0]}    end={S.pivot[1]}><PivotScene /></Sprite>
      <Sprite start={S.outcome[0]}  end={S.outcome[1]}><OutcomeScene /></Sprite>
      <Sprite start={S.contrast[0]} end={S.contrast[1]}><ContrastScene /></Sprite>
      <Sprite start={S.outro[0]}    end={S.outro[1]}><OutroScene /></Sprite>
      <SceneProgress />
    </>
  );
}

// ── Audio sync (lifted from kiro-power) ──────────────────────────────────
// Minimal <audio> wrapper that follows the Stage timeline: plays/pauses
// with the timeline and resyncs currentTime when drift exceeds 0.25s.
function AudioTrack({ src }) {
  const { time, playing } = useTimeline();
  const ref = React.useRef(null);
  React.useEffect(() => {
    const a = ref.current; if (!a) return;
    if (playing) a.play().catch(() => {}); else a.pause();
  }, [playing]);
  React.useEffect(() => {
    const a = ref.current; if (!a) return;
    if (Math.abs(a.currentTime - time) > 0.25) {
      try { a.currentTime = time; } catch {}
    }
  }, [time]);
  return <audio ref={ref} src={src} preload="auto" style={{ display: 'none' }} />;
}

Object.assign(window, { OutcomeOpsVideo, AudioTrack, DUR });
