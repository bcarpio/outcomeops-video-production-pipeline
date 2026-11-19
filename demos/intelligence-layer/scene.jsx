// scene.jsx — "The Layer Underneath" (intelligence-layer)
//
// Capstone video about the organizational intelligence layer. Five
// departments orbit a shared substrate; five pillars define why this is
// a distinct category. Silent build — narration synthed later and
// windows refit to the audio.

// Windows fitted to narration.mp3 (Drew @ 1.1). Per-beat speech start:
//   b1    1.00
//   b2    8.53
//   b3   12.05
//   b3b  26.90
//   b4   52.32
//   b5   69.66
//   b6   86.82
//   b7  104.74
//   b8  122.89   (b8 extended +6.4s to list 4 output formats)
//   b9a 148.95
//   b9b 163.07
//   b9c 175.82
const DUR = 190.01;

const S = {
  cascade:  [   0.00,   8.03],
  thesis:   [   8.03,  11.75],
  reveal:   [  11.75,  26.40],
  agents:   [  26.40,  51.62],
  pillar1:  [  51.62,  68.96],
  pillar2:  [  68.96,  86.12],
  pillar3:  [  86.12, 104.04],
  pillar4:  [ 104.04, 122.19],
  pillar5:  [ 122.19, 147.95],
  cta:      [ 147.95, 190.01],
};

// Canvas-relative anchor positions for the cascade beat (top-left of each card).
// Asymmetric placement reads more organic than a grid.
const CASCADE_POS = [
  { dx: 140,  dy: 180 },   // Security      — top-left
  { dx: 1020, dy: 200 },   // Engineering   — top-right
  { dx: 100,  dy: 430 },   // Architecture  — middle-left
  { dx: 1040, dy: 470 },   // Support       — middle-right
  { dx: 480,  dy: 690 },   // Product       — bottom-center
];

// Ring center on a 1600x900 stage. Slightly above middle for visual balance.
const RING_CX = 800;
const RING_CY = 470;
const RING_R  = 320;

// Slow orbital rotation: one full revolution per ~110s.
const RING_OMEGA = (2 * Math.PI) / 110;

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ramp = (t, a, b) => clamp01((t - a) / Math.max(0.0001, b - a));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// ── Audio with click-to-play fallback ─────────────────────────────────────
// Browsers block audio autoplay-with-sound until a user gesture is detected.
// On page load, video advances silently (RAF doesn't need user gesture) but
// audio.play() rejects. We catch that rejection, show a "click to play"
// overlay, and dismiss it once the user clicks (which is the gesture the
// browser was waiting for).
function AudioTrack({ src }) {
  const { time, playing } = useTimeline();
  const ref = React.useRef(null);
  const [blocked, setBlocked] = React.useState(false);

  React.useEffect(() => {
    const a = ref.current; if (!a) return;
    if (playing) {
      const p = a.play();
      if (p && typeof p.then === 'function') {
        p.then(() => setBlocked(false)).catch(() => setBlocked(true));
      }
    } else {
      a.pause();
    }
  }, [playing]);

  React.useEffect(() => {
    const a = ref.current; if (!a) return;
    if (Math.abs(a.currentTime - time) > 0.25) { try { a.currentTime = time; } catch {} }
  }, [time]);

  const dismiss = (e) => {
    if (e) e.stopPropagation();
    const a = ref.current;
    if (!a) { setBlocked(false); return; }
    const p = a.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setBlocked(false)).catch(() => setBlocked(false));
    } else {
      setBlocked(false);
    }
  };

  return (
    <>
      <audio ref={ref} src={src} preload="auto" style={{ display: 'none' }}/>
      {blocked && (
        <div onClick={dismiss} style={{
          position: 'absolute', inset: 0,
          background: 'rgba(5,9,18,0.78)', backdropFilter: 'blur(2px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 22, cursor: 'pointer', zIndex: 9999,
          fontFamily: 'Inter, system-ui, sans-serif', color: '#f4f6fb',
        }}>
          <div style={{
            width: 110, height: 110, borderRadius: '50%',
            background: '#22d3ee',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 50px rgba(34,211,238,0.55), 0 20px 60px -10px rgba(0,0,0,0.6)',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#050910" style={{ marginLeft: 4 }}>
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>
            Click to play with sound
          </div>
          <div style={{ fontSize: 14, color: '#8a97ad', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
            (your browser blocked autoplay)
          </div>
        </div>
      )}
    </>
  );
}

// ── Beat 1: Questions cascade ──────────────────────────────────────────────
// Five questions appear in sequence, each in a different area of the canvas.
// Hold all five for the voice line, then transition to thesis.
function CascadeOverlay({ t }) {
  const inWindow = t >= S.cascade[0] && t < S.thesis[1];
  if (!inWindow) return null;

  // Per-question reveal timing (relative to beat start).
  // Tightened stagger 1.7 -> 1.4 so all 5 land before voice b1 ends.
  const stagger = 1.4;
  const firstAt = 0.8;
  const fadeIn  = 0.5;

  // During the thesis beat, all questions collapse inward to the center.
  // Center of canvas for the collapse target.
  const cx = RING_CX;
  const cy = RING_CY;

  // Tighter collapse — 2s, snappier, fully gone by t=17 so the single
  // bright point can take over without visual overlap.
  const collapseStart = S.thesis[0];
  const collapseEnd   = S.thesis[0] + 2.0;
  const collapseP     = ramp(t, collapseStart, collapseEnd);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {DEPARTMENTS.map((dept, i) => {
        const appearAt = S.cascade[0] + firstAt + i * stagger;
        const cardOpRaw = ramp(t, appearAt, appearAt + fadeIn);
        const cardOp = easeOut(cardOpRaw);

        // After thesis transition starts, collapse to center
        const startPos = CASCADE_POS[i];
        const cardCx = startPos.dx + 230;        // card horizontal center estimate
        const cardCy = startPos.dy + 65;         // card vertical center estimate
        const dxToCenter = (cx - cardCx);
        const dyToCenter = (cy - cardCy);
        const collapse = easeInOut(collapseP);
        const tx = dxToCenter * collapse;
        const ty = dyToCenter * collapse;
        const collapseScale = 1 - collapse * 0.92;
        // Fade out faster than collapse so questions are gone by ~ collapseP=0.65
        const collapseFade  = 1 - clamp01((collapseP - 0.2) / 0.45);

        // Floating drift while held (subtle organic motion)
        const driftPhase = i * 1.3;
        const localT = t - appearAt;
        const drift = Math.sin(localT * 0.45 + driftPhase) * 6;

        const finalOp = cardOp * collapseFade;
        if (finalOp <= 0) return null;

        return (
          <div key={dept.id} style={{
            position: 'absolute',
            left: startPos.dx, top: startPos.dy,
            transform: `translate(${tx}px, ${ty + drift}px) scale(${collapseScale})`,
            transformOrigin: 'center',
            opacity: finalOp,
          }}>
            <QuestionCard dept={dept}/>
          </div>
        );
      })}
    </div>
  );
}

// ── Beat 2: Thesis transition ──────────────────────────────────────────────
// After questions collapse, a single bright point pulses at center — the
// "essence" of every question. It grows smoothly into the substrate sphere
// during the ring-reveal beat. No text headline — voice carries the line.
function ThesisBrightPoint({ t }) {
  // Tightened: bright point pulses 17..19 (2s, was 2.5s), then grows into
  // the core 19..21 (was 20..22). Whole thesis-to-substrate handoff is now
  // 4s instead of 5s, killing the dead air at the start of the ring reveal.
  const showStart = S.thesis[0] + 2.0;   // 17
  const showEnd   = S.thesis[0] + 6.0;   // 21 — fully replaced by core
  if (t < showStart - 0.3 || t > showEnd) return null;

  // Fade in 17.0..17.4, hold pulsing 17.4..19, grow & fade into core 19..21
  const fadeIn = ramp(t, showStart, showStart + 0.4);
  const grow   = ramp(t, showEnd - 2.0, showEnd);   // 19..21

  // Pulse for the held phase
  const pulse = 0.85 + 0.15 * Math.sin((t - showStart) * 3.2);
  // Size grows from 14px to ~120px (handing off to SubstrateCore at r=108)
  const size = 14 + grow * 220;
  // Fade out at the very end as core takes over
  const handoff = 1 - clamp01((grow - 0.7) / 0.3);
  const op = fadeIn * handoff;

  return (
    <div style={{
      position: 'absolute', left: RING_CX, top: RING_CY,
      transform: 'translate(-50%, -50%)',
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle, #DAF6FF 0%, ${oo.cyan} 60%, ${oo.cyan} 100%)`,
      opacity: op * pulse, pointerEvents: 'none',
    }}/>
  );
}

// ── Beat 3: Ring reveal ────────────────────────────────────────────────────
// Substrate core fades in, ring stroke draws, departments light up in
// sequence, particles start flowing. After this beat, the ring persists.
function RingScene({ t }) {
  // Core handoff from bright point starts at t=19 (was 20). Visible earlier
  // to overlap with the bright point growing, giving continuous motion
  // through the 18-30s window the user flagged as too quiet.
  if (t < S.thesis[0] + 3.5) return null;

  // Core fades in 19..21 (was 20..23) — fully in just as bright point exits.
  const coreOp = ramp(t, S.thesis[0] + 4.0, S.thesis[0] + 6.0);

  // Ring stroke draws over 5s right after the core handoff.
  const ringReveal = ramp(t, S.thesis[0] + 6.0, S.thesis[0] + 11.0);

  // Department lit sequence starts as the ring finishes drawing.
  // Anchored to S.thesis[0] so it tracks whatever the upstream timing is.
  const litTimes = [S.thesis[0] + 11.0,
                    S.thesis[0] + 13.0,
                    S.thesis[0] + 15.0,
                    S.thesis[0] + 17.0,
                    S.thesis[0] + 19.0];
  const lit = litTimes.map(at => ramp(t, at, at + 1.0));

  // Particles activate once all 5 departments are lit.
  const particlesActive = t >= S.thesis[0] + 20.0;

  // Continuous slow rotation, starting once ring begins drawing
  const spinStart = S.thesis[0] + 6.0;
  const angle = t > spinStart ? (t - spinStart) * RING_OMEGA : 0;

  // AI agent inner ring -- appears during b3b. Inner ring stroke fades in
  // over 27..29s (right as voice "Every A I coding agent" lands), and each
  // pill staggers in 1s apart during "Cursor, Claude Code, Copilot."
  // Counter-rotates at 70% speed for visual differentiation from the outer
  // (human) ring.
  const aiSpinStart = S.thesis[0] + 19.0;
  const aiAngle = t > aiSpinStart ? -(t - aiSpinStart) * RING_OMEGA * 0.7 : 0;
  const aiRingReveal = ramp(t, S.thesis[0] + 19.0, S.thesis[0] + 21.0);
  const aiLitTimes = [S.thesis[0] + 21.0,
                      S.thesis[0] + 22.5,
                      S.thesis[0] + 24.0];
  const aiLit = aiLitTimes.map(at => ramp(t, at, at + 1.2));

  // During pillar beats (50-140) the ring dims to ~45% so the pillar
  // micro-visual reads cleanly, but stays visible as the constant anchor.
  // Brightens back to full during Phases A and B of the CTA. Then during
  // Phase C (the brand close, 164+), the ring fades all the way to zero
  // so the brand lockup has the stage to itself.
  const pillarDim = ramp(t, S.pillar1[0] - 2, S.pillar1[0] + 1)
                  * (1 - ramp(t, S.cta[0] - 2, S.cta[0] + 1));
  const ctaFade = ramp(t, S.cta[0] + 25.5, S.cta[0] + 27);
  const sceneOp = (1 - pillarDim * 0.55) * (1 - ctaFade);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: sceneOp, pointerEvents: 'none' }}>
      <SubstrateCore cx={RING_CX} cy={RING_CY} r={108} opacity={coreOp} pulse/>
      <SaturnRing
        cx={RING_CX} cy={RING_CY} r={RING_R}
        tiltDeg={25}
        angle={angle}
        reveal={ringReveal}
        lit={lit}
        particles={particlesActive}
      />
      <AIAgentRing
        cx={RING_CX} cy={RING_CY} r={190}
        tiltDeg={25}
        angle={aiAngle}
        reveal={aiRingReveal}
        lit={aiLit}
      />
    </div>
  );
}

// ── Pillar wrapper: shared fade-in/out around an 18s window ────────────────
// Each pillar content component renders inside <PillarWrap> which handles
// the entry/exit envelope and provides a normalized localT (relative to
// the window start) so internal animations are easier to author.
function PillarWrap({ window, t, children }) {
  if (t < window[0] - 0.3 || t > window[1] + 0.3) return null;
  const op = ramp(t, window[0],       window[0] + 1.0)
           * (1 - ramp(t, window[1] - 1.0, window[1]));
  if (op <= 0) return null;
  const localT = t - window[0];
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op, pointerEvents: 'none' }}>
      {typeof children === 'function' ? children(localT) : children}
    </div>
  );
}

// ── Beat 4 — Pillar 1: Codified knowledge as data ─────────────────────────
function Pillar1({ t }) {
  return (
    <PillarWrap window={S.pillar1} t={t}>
      {(lt) => {
        // 5 standards cards stream in from left starting at lt=2.0, each
        // 1.0s apart. After they settle, the Confluence page appears at
        // lt=10 with the "one input, not source of truth" label.
        const standards = [
          { label: 'ADR-009', title: 'Decimal over float',         color: oo.cyan },
          { label: 'RUNBOOK', title: 'Payment refund flow',         color: oo.green },
          { label: 'ISO 27001 · A.8.11', title: 'Data masking',     color: oo.violet },
          { label: 'STANDARD', title: 'Pydantic validation',        color: oo.cyan },
          { label: 'ADR-031', title: 'Auth gateway pattern',        color: oo.amber },
        ];
        const headerOp = ramp(lt, 0.4, 1.2);
        const sourcesOp = ramp(lt, 1.0, 2.0);
        const captionOp = ramp(lt, 12.0, 13.0);
        return (
          <>
            <PillarHeader number={1} title="Codified knowledge as data"
              sub="Standards live as queryable documents, not vendor features."
              color={oo.cyan} opacity={headerOp} ty={(1 - headerOp) * 8}/>

            {/* Standards stream from left edge toward the substrate */}
            {standards.map((s, i) => {
              const appearAt = 2.0 + i * 0.9;
              const flightAt = appearAt + 1.6;
              const appearP = ramp(lt, appearAt, appearAt + 0.5);
              const flightP = easeOut(ramp(lt, flightAt, flightAt + 1.4));

              // Start position: emerging from the SourceSystemsPanel on the
              // left (x=60..290). Card center at x=420 keeps them clear of
              // the source panel and reads as "documents pulled from the
              // sources" flowing right toward the substrate.
              const startX = 420;
              const startY = 240 + i * 90;
              // End position: substrate center (800, 470)
              const endX = 800;
              const endY = 470;

              const x = startX + (endX - startX) * flightP;
              const y = startY + (endY - startY) * flightP;
              const scale = 1 - 0.7 * flightP;
              const op = appearP * (1 - clamp01((flightP - 0.7) / 0.3));
              if (op <= 0) return null;
              return (
                <div key={s.label} style={{
                  position: 'absolute', left: x, top: y,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  opacity: op,
                }}>
                  <StandardCard label={s.label} title={s.title} color={s.color}/>
                </div>
              );
            })}

            {/* Source systems panel on the left -- makes it explicit that
                the corpus is fed by GitHub, Confluence, Jira, SharePoint.
                Standards cards then stream from here toward the substrate. */}
            <div style={{
              position: 'absolute', left: 60, top: 240,
              opacity: sourcesOp, transform: `translateY(${(1 - sourcesOp) * 6}px)`,
            }}>
              <SourceSystemsPanel opacity={1}/>
            </div>

            {/* Subcaption */}
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 80,
              textAlign: 'center', opacity: captionOp,
              fontFamily: oo.sans, fontSize: 17, color: oo.textDim,
              letterSpacing: '-0.005em',
            }}>Indexed documents, not roadmap tickets.</div>
          </>
        );
      }}
    </PillarWrap>
  );
}

// ── Beat 4 — Pillar 2: Ground-truth grounding ─────────────────────────────
function Pillar2({ t }) {
  return (
    <PillarWrap window={S.pillar2} t={t}>
      {(lt) => {
        const headerOp = ramp(lt, 0.4, 1.2);
        const docOp    = ramp(lt, 2.0, 3.3);
        const codeOp   = ramp(lt, 4.0, 5.3);
        const verdictOp = ramp(lt, 7.0, 8.4);
        const captionOp = ramp(lt, 12.0, 13.0);
        return (
          <>
            <PillarHeader number={2} title="Ground-truth grounding"
              sub="When docs disagree with code, code wins. Discrepancy surfaced."
              color={oo.cyan} opacity={headerOp} ty={(1 - headerOp) * 8}/>

            <div style={{
              position: 'absolute', left: 0, right: 0, top: 270,
              display: 'flex', justifyContent: 'center',
            }}>
              <DocCodeCompare docOp={docOp} codeOp={codeOp} verdictOp={verdictOp}/>
            </div>

            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 80,
              textAlign: 'center', opacity: captionOp,
              fontFamily: oo.sans, fontSize: 17, color: oo.textDim,
              letterSpacing: '-0.005em',
            }}>The AI never confidently relays a stale wiki.</div>
          </>
        );
      }}
    </PillarWrap>
  );
}

// ── Beat 4 — Pillar 3: Customer-owned accountability ──────────────────────
function Pillar3({ t }) {
  return (
    <PillarWrap window={S.pillar3} t={t}>
      {(lt) => {
        const headerOp = ramp(lt, 0.4, 1.2);
        const boundaryOp = ramp(lt, 1.4, 2.4);

        // Audit log entries stream in
        const entries = [
          { time: '18:42:01', kind: 'user_q',   text: 'where do we touch PCI card data?',          color: oo.cyan },
          { time: '18:42:01', kind: 'retrieve', text: 'handler.py · ADR-031 · mask_pan.py',         color: oo.violet },
          { time: '18:42:02', kind: 'llm',     text: 'answer cited from 3 files',                  color: oo.green },
          { time: '18:42:15', kind: 'user_q',   text: 'show me exfiltration tooling',              color: oo.cyan },
          { time: '18:42:15', kind: 'refused', text: 'flagged · alert dispatched',                 color: oo.red },
        ];
        const ocsfOp = ramp(lt, 10.5, 11.7);
        const captionOp = ramp(lt, 12.5, 13.5);

        return (
          <>
            <PillarHeader number={3} title="Customer-owned accountability"
              sub="Every interaction logged. Refusals alert. Bytes never leave."
              color={oo.cyan} opacity={headerOp} ty={(1 - headerOp) * 8}/>

            <CloudBoundary opacity={boundaryOp}
              style={{
                position: 'absolute', left: 200, top: 230, width: 940, height: 460,
                padding: '32px 28px 28px',
              }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {entries.map((e, i) => {
                  const at = 3.0 + i * 1.3;
                  const op = ramp(lt, at, at + 0.6);
                  const refusal = e.kind === 'refused';
                  return (
                    <AuditEntry key={i}
                      time={e.time} kind={e.kind} text={e.text}
                      kindColor={e.color} opacity={op}
                      style={{
                        background: refusal && op > 0.5 ? 'rgba(248,113,113,0.10)' : 'transparent',
                        borderLeft: refusal && op > 0.5 ? `2px solid ${oo.red}` : '2px solid transparent',
                      }}
                    />
                  );
                })}
              </div>

              {/* SNS bell + OCSF arrow appearing late */}
              <div style={{
                position: 'absolute', right: 28, top: 60,
                opacity: ramp(lt, 9.5, 10.7),
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14,
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px',
                  background: 'rgba(248,113,113,0.10)',
                  border: `1px solid ${oo.red}66`,
                  borderRadius: 8,
                  fontFamily: oo.mono, fontSize: 12, color: oo.red, fontWeight: 700,
                  letterSpacing: '0.08em',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={oo.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                  </svg>
                  SNS · REAL-TIME ALERT
                </div>
              </div>
            </CloudBoundary>

            {/* OCSF export arrow leading to "Your SIEM" outside the boundary */}
            <div style={{
              position: 'absolute', left: 1160, top: 410,
              opacity: ocsfOp,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <svg width="60" height="20" viewBox="0 0 60 20">
                <path d="M0 10 L48 10 M40 4 L48 10 L40 16" stroke={oo.cyan} strokeWidth="2" fill="none"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{
                padding: '14px 20px',
                background: oo.bgPanel,
                border: `1px solid ${oo.cyan}77`,
                borderRadius: 10,
                fontFamily: oo.mono, fontSize: 16, color: oo.cyan, fontWeight: 700,
                letterSpacing: '0.1em',
              }}>YOUR SIEM<br/><span style={{ fontSize: 12, color: oo.textDim, fontWeight: 400 }}>OCSF stream</span></div>
            </div>

            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 80,
              textAlign: 'center', opacity: captionOp,
              fontFamily: oo.sans, fontSize: 17, color: oo.textDim,
              letterSpacing: '-0.005em',
            }}>The audit trail is auditable because it never left.</div>
          </>
        );
      }}
    </PillarWrap>
  );
}

// ── Beat 4 — Pillar 4: Domain-agnostic platform ───────────────────────────
function Pillar4({ t }) {
  return (
    <PillarWrap window={S.pillar4} t={t}>
      {(lt) => {
        const headerOp = ramp(lt, 0.4, 1.2);
        const engineOp = ramp(lt, 1.8, 3.0);

        // Five industries arranged around a central engine
        const industries = [
          { name: 'Healthcare',         kb: 'HIPAA, PHI handling, Epic patterns', color: oo.green,  angle: -90 },
          { name: 'Financial Services', kb: 'PCI DSS, SOX, transaction patterns', color: oo.cyan,   angle: 0   },
          { name: 'Public Sector',      kb: 'FedRAMP, ATO, CUI handling',         color: oo.violet, angle: 90  },
          { name: 'Aerospace',          kb: 'ITAR, AS9100, supply-chain trace',   color: oo.red,    angle: 180 },
        ];
        const cx = 800, cy = 480, r = 230;

        const captionOp = ramp(lt, 12.5, 13.5);

        return (
          <>
            <PillarHeader number={4} title="Same engine. Different knowledge."
              sub="Zero domain knowledge in the engine. All of it in the corpus."
              color={oo.cyan} opacity={headerOp} ty={(1 - headerOp) * 8}/>

            {/* Connecting lines from engine to each industry */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                          opacity: engineOp, pointerEvents: 'none', overflow: 'visible' }}>
              {industries.map((ind, i) => {
                const a = (ind.angle * Math.PI) / 180;
                const x = cx + Math.cos(a) * r;
                const y = cy + Math.sin(a) * r;
                const at = 3.5 + i * 1.0;
                const lineP = ramp(lt, at, at + 0.7);
                const x2 = cx + (x - cx) * lineP;
                const y2 = cy + (y - cy) * lineP;
                return (
                  <line key={i} x1={cx} y1={cy} x2={x2} y2={y2}
                    stroke={ind.color} strokeWidth="1.5" strokeDasharray="5 5"
                    opacity={0.55}/>
                );
              })}
            </svg>

            {/* Central engine */}
            <div style={{
              position: 'absolute', left: cx, top: cy,
              transform: `translate(-50%, -50%) scale(${engineOp})`,
              opacity: engineOp,
            }}>
              <SynthesisCore size={120} label="ENGINE" color={oo.cyan}/>
            </div>

            {/* Industry petals */}
            {industries.map((ind, i) => {
              const a = (ind.angle * Math.PI) / 180;
              const x = cx + Math.cos(a) * r;
              const y = cy + Math.sin(a) * r;
              const at = 3.8 + i * 1.0;
              const op = ramp(lt, at, at + 0.6);
              const scale = 0.85 + op * 0.15;
              if (op <= 0) return null;
              return (
                <IndustryPetal key={i}
                  name={ind.name} kb={ind.kb} color={ind.color}
                  x={x} y={y} opacity={op} scale={scale}/>
              );
            })}

            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 80,
              textAlign: 'center', opacity: captionOp,
              fontFamily: oo.sans, fontSize: 17, color: oo.textDim,
              letterSpacing: '-0.005em',
            }}>Same substrate. The intelligence is the knowledge base.</div>
          </>
        );
      }}
    </PillarWrap>
  );
}

// ── Beat 4 — Pillar 5: Outcome-oriented orchestration ─────────────────────
function Pillar5({ t }) {
  return (
    <PillarWrap window={S.pillar5} t={t}>
      {(lt) => {
        const headerOp = ramp(lt, 0.4, 1.2);

        // 3 input streams, then synthesis, then ISO clauses, then Jira stories
        const streams = [
          { label: 'CODE-MAP',    text: 'lambda/auth/handler.py',          color: oo.cyan,   y: 250 },
          { label: 'ISO STANDARDS', text: 'ISO 27001 · 27017 · 27018',     color: oo.violet, y: 380 },
          { label: 'ADRs',        text: 'ADR-009 · ADR-031',                color: oo.amber,  y: 510 },
        ];
        const synthOp = ramp(lt, 4.0, 5.0);
        const processing = lt >= 5.0 && lt < 6.5;
        const controlsStart = 6.5;

        const isoControls = [
          { clause: 'CLD.6.3.1',  title: 'Shared responsibility' },
          { clause: 'CLD.12.4.5', title: 'Cloud monitoring' },
          { clause: 'CLD.13.1.4', title: 'Virtual network alignment' },
          { clause: 'A.8.24',     title: 'Cloud key management' },
          { clause: 'A.8.11',     title: 'Data masking' },
          { clause: 'A.8.15',     title: 'Logging & audit' },
          { clause: 'CLD.9.5.1',  title: 'Tenant isolation' },
          { clause: 'A.5.23',     title: 'Cloud services policy' },
        ];

        // Output formats — same corpus, different answer shapes per audience.
        // Each card lands as the voice names its format (~2s apart, matching
        // the cadence of "sprint backlog... compliance document... runbook...
        // change-impact summary"). First card at lt=13.5 syncs to the voice
        // arriving at "sprint backlog" around lt~13.5.
        const outputsStart = 13.5;
        const outputs = [
          { name: 'SPRINT BACKLOG',        audience: 'engineering', detail: '4 stories · story points',     color: oo.violet },
          { name: 'COMPLIANCE DOC',        audience: 'security',    detail: 'ISO 27001 control mapping',    color: oo.green  },
          { name: 'RUNBOOK',               audience: 'ops',         detail: 'step-by-step procedure',       color: oo.cyan   },
          { name: 'CHANGE-IMPACT SUMMARY', audience: 'compliance',  detail: 'systems · sign-offs',          color: oo.amber  },
        ];

        const captionOp = ramp(lt, 22.0, 23.5);

        return (
          <>
            <PillarHeader number={5} title="Synthesis, not search results"
              sub="Precision retrieval. Multi-source reconciliation. Trained format, grounded content."
              color={oo.cyan} opacity={headerOp} ty={(1 - headerOp) * 8}/>

            {/* Input streams on left */}
            {streams.map((s, i) => {
              const at = 2.0 + i * 0.7;
              const op = ramp(lt, at, at + 0.6);
              const flowP = ramp(lt, 4.5, 5.5);
              const x = 240 + (600 - 240) * flowP;
              return (
                <div key={i} style={{
                  position: 'absolute', left: x, top: s.y,
                  transform: `translate(-50%, -50%)`, opacity: op,
                }}>
                  <div style={{
                    padding: '12px 18px',
                    background: oo.bgPanel,
                    border: `1px solid ${s.color}77`,
                    borderRadius: 9,
                  }}>
                    <div style={{
                      fontFamily: oo.mono, fontSize: 13, fontWeight: 700, color: s.color,
                      letterSpacing: '0.12em', marginBottom: 4,
                    }}>{s.label}</div>
                    <div style={{ fontFamily: oo.mono, fontSize: 15, color: oo.text }}>{s.text}</div>
                  </div>
                </div>
              );
            })}

            {/* Synthesis core */}
            <div style={{
              position: 'absolute', left: 760, top: 380,
              opacity: synthOp,
            }}>
              <SynthesisCore size={140} processing={processing} color={oo.cyan}/>
            </div>

            {/* ISO control cards stream out below the synthesis */}
            <div style={{
              position: 'absolute', left: 970, top: 220, width: 540,
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 9,
            }}>
              {isoControls.map((c, i) => {
                const at = controlsStart + i * 0.4;
                const op = ramp(lt, at, at + 0.4);
                return (
                  <ISOControlCard key={i} clause={c.clause} title={c.title} opacity={op}/>
                );
              })}
            </div>

            {/* Output formats -- 2x2 grid of answer shapes. Replaces the
                old single Jira example. Each card surfaces during the
                matching narration: "sprint backlog, compliance document,
                runbook, change-impact summary." */}
            <div style={{
              position: 'absolute', left: 90, top: 620, width: 560,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{
                fontFamily: oo.mono, fontSize: 13, fontWeight: 700,
                color: oo.violet, letterSpacing: '0.1em', textTransform: 'uppercase',
                opacity: ramp(lt, outputsStart - 0.5, outputsStart),
                marginBottom: 4,
              }}>Outputs · same corpus, different shapes</div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 9,
              }}>
                {outputs.map((o, i) => {
                  const at = outputsStart + i * 2.0;
                  const op = ramp(lt, at, at + 0.6);
                  return (
                    <OutputFormatCard key={i}
                      name={o.name} audience={o.audience} detail={o.detail}
                      color={o.color} opacity={op}/>
                  );
                })}
              </div>
            </div>

            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 50,
              textAlign: 'center', opacity: captionOp,
              fontFamily: oo.sans, fontSize: 17, color: oo.textDim,
              letterSpacing: '-0.005em',
            }}>Same corpus. Different answer shapes.</div>
          </>
        );
      }}
    </PillarWrap>
  );
}

// ── Beat 9: CTA close (140-180s) ──────────────────────────────────────────
//
// Three phases:
//   Phase A · Wiring recap   (140-152s) — 5 pillar badges in a row at bottom,
//                              ring stays bright above. "Five wires of one fabric."
//   Phase B · Trust boundary (152-164s) — large dashed boundary draws around
//                              everything. "INSIDE YOUR AWS ACCOUNT."
//   Phase C · Brand close    (164-180s) — ring + boundary dim. Brand lockup,
//                              tagline, 3 differentiator chips, CTA line.
function Beat9CTA({ t }) {
  if (t < S.cta[0] - 0.5) return null;

  // Phase fades, timed to audio boundaries:
  //   b9a voice lt  1.0 - 13.62 (Phase A)
  //   b9b voice lt 15.12 - 23.37 (Phase B)
  //   b9c voice lt 27.87 - 37.56 (Phase C)
  const phaseA_in  = ramp(t, S.cta[0],         S.cta[0] + 1.2);
  const phaseA_out = ramp(t, S.cta[0] + 25.5,  S.cta[0] + 27.0);
  const phaseB_in  = ramp(t, S.cta[0] + 13.5,  S.cta[0] + 15.0);
  const phaseB_out = ramp(t, S.cta[0] + 25.5,  S.cta[0] + 27.0);
  const phaseC_in  = ramp(t, S.cta[0] + 26.0,  S.cta[0] + 27.5);

  // Phase C fades the ring + boundary + pillar badges to zero so the
  // brand lockup is the sole visual.
  const phaseCDim = phaseC_in;
  const fgOp = (1 - phaseCDim);

  const pillarSummaries = [
    { n: 1, title: 'Codified knowledge', color: oo.cyan },
    { n: 2, title: 'Code-anchored truth', color: oo.green },
    { n: 3, title: 'Audit in your cloud', color: oo.violet },
    { n: 4, title: 'Domain-agnostic engine', color: oo.amber },
    { n: 5, title: 'Synthesis, not search', color: oo.cyan },
  ];

  // Phase A: pillar badges enter from below, staggered
  const lt = t - S.cta[0];
  const pillarBadgeOp = (i) => {
    const at = 0.8 + i * 0.35;
    return ramp(lt, at, at + 0.6) * (1 - phaseCDim);
  };

  // Phase B: boundary reveal
  const boundaryReveal = ramp(lt, 11.5, 14.5);
  const boundaryOp = phaseB_in * (1 - phaseCDim);

  // Phase A header line ("Five wires of one fabric.") — visible during b9a,
  // fades as Phase B comes in.
  const phaseAHeaderOp = ramp(lt, 2.5, 3.5) * (1 - ramp(lt, 13.0, 14.5));
  // Phase B caption ("Code, schemas, decisions ...") — appears with the b9b
  // voice line; fades as Phase C comes in.
  const phaseBCaptionOp = ramp(lt, 16.0, 17.5) * (1 - ramp(lt, 25.0, 26.5));

  // Phase C internal staggers (ctaT 0 ~= lt 26)
  const ctaT = lt - 26.0;
  const brandOp   = ramp(ctaT, 0.5, 1.6);
  const taglineOp = ramp(ctaT, 1.4, 2.4);
  const chipsOp   = (i) => ramp(ctaT, 2.6 + i * 0.35, 3.2 + i * 0.35);
  const ctaLineOp = ramp(ctaT, 4.6, 5.6);

  return (
    <>
      {/* Phase A — Pillar badges in a row at bottom */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 60,
        display: 'flex', justifyContent: 'center', gap: 18,
        opacity: fgOp,
        pointerEvents: 'none',
      }}>
        {pillarSummaries.map((p, i) => {
          const op = pillarBadgeOp(i);
          if (op <= 0) return null;
          return (
            <PillarBadge key={p.n} number={p.n} title={p.title}
              color={p.color} opacity={op} scale={0.96 + op * 0.04}/>
          );
        })}
      </div>

      {/* Phase A header */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 130,
        textAlign: 'center', opacity: phaseAHeaderOp * fgOp,
        pointerEvents: 'none',
        fontFamily: oo.sans,
      }}>
        <div style={{
          fontSize: 38, fontWeight: 700, color: oo.text,
          letterSpacing: '-0.025em', lineHeight: 1.1,
        }}>
          Five wires of <span style={{ color: oo.cyan }}>one fabric.</span>
        </div>
      </div>

      {/* Phase B — Trust boundary draws around everything */}
      {boundaryOp > 0 && (
        <TrustBoundaryFrame reveal={boundaryReveal} opacity={boundaryOp}/>
      )}

      {/* Phase B caption */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 174,
        textAlign: 'center', opacity: phaseBCaptionOp * fgOp,
        pointerEvents: 'none',
        fontFamily: oo.sans, fontSize: 17, color: oo.textDim,
        letterSpacing: '-0.005em',
      }}>
        Code, schemas, decisions, audit trails &mdash; none of it crosses the boundary.
      </div>

      {/* Phase C — Brand close */}
      {phaseC_in > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 30,
          opacity: phaseC_in, pointerEvents: 'none',
        }}>
          <div style={{ opacity: brandOp, transform: `translateY(${(1 - brandOp) * 10}px)` }}>
            <BrandLockup size={68}/>
          </div>
          <div style={{
            opacity: taglineOp, transform: `translateY(${(1 - taglineOp) * 10}px)`,
            fontFamily: oo.sans, fontSize: 56, fontWeight: 700,
            color: oo.text, letterSpacing: '-0.03em', lineHeight: 1.0,
            textAlign: 'center',
          }}>
            The Layer <span style={{ color: oo.cyan }}>Underneath.</span>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            <CTAChip
              color={oo.cyan}
              opacity={chipsOp(0)}
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>}
              label="Code wins over docs"
            />
            <CTAChip
              color={oo.green}
              opacity={chipsOp(1)}
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>}
              label="Citations mandatory"
            />
            <CTAChip
              color={oo.amber}
              opacity={chipsOp(2)}
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>}
              label="Audit trails standard"
            />
          </div>
          <div style={{
            opacity: ctaLineOp, transform: `translateY(${(1 - ctaLineOp) * 8}px)`,
            display: 'flex', alignItems: 'center', gap: 16,
            fontFamily: oo.mono, fontSize: 16, color: oo.textDim, letterSpacing: '0.04em',
            marginTop: 14,
          }}>
            <span style={{ color: oo.cyan }}>outcomeops.ai</span>
            <span style={{ color: oo.border }}>&middot;</span>
            <span>Book an enterprise briefing</span>
          </div>
        </div>
      )}
    </>
  );
}

// ── Root composition ──────────────────────────────────────────────────────
function IntelligenceLayerVideo() {
  const t = useTime();
  return (
    <>
      <StageBackdrop/>
      {/* Top-right wordmark visible from ring reveal through CTA Phase B;
          fades out before Phase C so it doesn't compete with the central brand. */}
      <Wordmark opacity={
        t < S.reveal[0] ? 0
        : t < S.cta[0] + 25.5 ? 0.85
        : 0.85 * (1 - clamp01((t - (S.cta[0] + 25.5)) / 1.5))
      }/>
      <RingScene t={t}/>
      <ThesisBrightPoint t={t}/>
      <CascadeOverlay t={t}/>
      <Pillar1 t={t}/>
      <Pillar2 t={t}/>
      <Pillar3 t={t}/>
      <Pillar4 t={t}/>
      <Pillar5 t={t}/>
      <Beat9CTA t={t}/>
    </>
  );
}

Object.assign(window, { IntelligenceLayerVideo, AudioTrack, DUR, S });
