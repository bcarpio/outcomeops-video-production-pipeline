// scene.jsx -- GKG impact-analysis demo orchestration.
// Two visual modes:
//   1) CHAT MODE (0-34s): real OutcomeOps chat UI showing query, router
//      decision, tool chips, and a brief assistant text response.
//   2) BEHIND-THE-SCENES MODE (34s+): chat fades to dark backdrop and the
//      graph fanout + RAG context card render as a system-internal viz.
//      Caption makes it clear this is what the platform found, not chat UI.
//
// Timings retuned to actual Drew @ 1.1 narration boundaries (70.11s total).

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ramp = (t, t0, t1) => clamp((t - t0) / (t1 - t0), 0, 1);

const USER_QUERY = 'What would break if I remove validateCardToken?';

// Beat boundaries from the Drew synth
const B = {
  hook:      0.00,
  openChat:  2.87,
  router:    8.75,
  toolChips: 16.40,
  introResp: 29.02,
  graph:     33.52,
  context:   45.04,
  decision:  57.16,
  cta:       65.28,
  end:       68.57,
};

function ImpactAnalysisScene() {
  const t = useTime();

  // ── Mode transitions ──
  const introOpacity = 1 - ramp(t, B.openChat - 1.0, B.openChat + 0.5);
  const chatOpacity  = ramp(t, B.openChat - 1.0, B.openChat + 0.5) - ramp(t, B.graph - 1.5, B.graph - 0.2);
  const darkBackdropOpacity = ramp(t, B.graph - 1.5, B.graph - 0.2) - ramp(t, B.end - 0.4, B.end + 0.5);

  // ── Chat content ──
  // User types over the s2_open_chat beat (2.93 - 8.59)
  const showUserBubble = t > B.openChat + 0.2;
  const userTypeProg   = ramp(t, B.openChat + 0.4, B.openChat + 4.5);
  const userTyping     = t < B.openChat + 4.5;
  const userTypedChars = Math.round(userTypeProg * USER_QUERY.length);

  // Router pill -- narrator says "classifier reads the query" at start of s3 (8.59)
  const showRouter     = t > B.router + 0.2;
  const routerOp       = ramp(t, B.router + 0.2, B.router + 1.4);

  // Tool chips -- narrator describes graph + RAG calls during s4 (16.80 - 29.75)
  const chipsBase      = B.toolChips + 0.3;
  const chip1Op        = ramp(t, chipsBase + 0.0, chipsBase + 0.6);
  const chip2Op        = ramp(t, chipsBase + 3.5, chipsBase + 4.1);
  const chip3Op        = ramp(t, chipsBase + 8.0, chipsBase + 8.6);
  const chipsDone      = t >= B.introResp - 0.5;
  const showChipsRow   = t > chipsBase;

  // Assistant intro -- s5 (29.75 - 34.25)
  const showIntroResp  = t > B.introResp + 0.2;
  const introRespOp    = ramp(t, B.introResp + 0.2, B.introResp + 1.0);

  // ── Graph fanout phases (s6 narration, 34.25 - 46.50) ──
  // Narrator beats:
  //   "Three direct callers" (~0s into s6)
  //   "payments checkout / refunds processor / admin lookup" (~2-5s)
  //   "From each, the graph expands. Eight transitive callers." (~6-9s)
  //   "The full blast radius." (~10-12s)
  let graphPhase = 'idle';
  if      (t >= B.graph + 0.0  && t < B.graph + 1.5)  graphPhase = 'hub';
  else if (t >= B.graph + 1.5  && t < B.graph + 6.0)  graphPhase = 'direct';
  else if (t >= B.graph + 6.0  && t < B.context)      graphPhase = 'transitive';
  else if (t >= B.context && t < B.end - 0.4)         graphPhase = 'done';

  const showGraph     = graphPhase !== 'idle';

  // Viz caption -- appears as chat fades
  const showVizLabel  = t > B.graph - 0.8;
  const vizLabelOp    = ramp(t, B.graph - 0.8, B.graph + 0.4) - ramp(t, B.end - 0.4, B.end + 0.4);

  // ADR card -- s7 (46.50 - 58.80)
  const showAdr       = t > B.context + 0.2;
  const adrOp         = ramp(t, B.context + 0.2, B.context + 1.5) - ramp(t, B.end - 0.4, B.end + 0.5);

  // Decision -- s8 (58.80 - 66.56)
  const showDecision  = t > B.decision + 0.2;
  const decisionOp    = ramp(t, B.decision + 0.2, B.decision + 1.2) - ramp(t, B.end - 0.4, B.end + 0.5);

  // CTA -- s9 (66.56 - 70.11)
  const showCta       = t > B.cta - 0.3;
  const ctaOpacity    = ramp(t, B.cta - 0.3, B.cta + 0.8);

  return (
    <>
      <style>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .cursor { animation: blink 1.1s steps(2) infinite; }
      `}</style>

      {/* Dark backdrop for the viz mode -- sits BEHIND chat, revealed when chat fades */}
      {darkBackdropOpacity > 0.01 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#050910',
          opacity: darkBackdropOpacity,
        }}/>
      )}

      {/* Chat UI -- visible during the conversational phases */}
      {chatOpacity > 0.01 && (
        <div style={{
          position: 'absolute', inset: 0,
          opacity: chatOpacity,
          display: 'flex',
          background: UI.bg,
        }}>
          <Sidebar/>
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            background: UI.bg, overflow: 'hidden',
          }}>
            <HeaderBar
              title="Impact analysis: validateCardToken"
              workspacesLabel="payments-core"
              mcpCount={2}
              mcpActive={true}
              promptLabel="Default"
            />

            {/* Conversation body */}
            <div style={{
              flex: 1, overflow: 'hidden',
              padding: '32px 48px 24px',
              display: 'flex', flexDirection: 'column', gap: 18,
            }}>
              {showUserBubble && (
                <UserBubble
                  text={USER_QUERY}
                  typedChars={userTyping ? userTypedChars : null}
                />
              )}

              {showRouter && (
                <div style={{
                  opacity: routerOp,
                  transform: `translateY(${(1 - routerOp) * 8}px)`,
                  transition: 'opacity 400ms, transform 400ms',
                }}>
                  <RouterPill label="WIRING + CONTEXT" target="RAG + Graph"/>
                </div>
              )}

              {showChipsRow && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {chip1Op > 0 && (
                    <div style={{ opacity: chip1Op }}>
                      <ToolChip
                        call="graph_callers(validateCardToken, depth=1)"
                        status={chipsDone ? 'done' : 'running'}
                      />
                    </div>
                  )}
                  {chip2Op > 0 && (
                    <div style={{ opacity: chip2Op }}>
                      <ToolChip
                        call="graph_callers(..., depth=2)"
                        status={chipsDone ? 'done' : 'running'}
                      />
                    </div>
                  )}
                  {chip3Op > 0 && (
                    <div style={{ opacity: chip3Op }}>
                      <ToolChip
                        call='query_knowledge_base("PCI redactor purpose")'
                        status={chipsDone ? 'done' : 'running'}
                      />
                    </div>
                  )}
                </div>
              )}

              {showIntroResp && (
                <div style={{
                  opacity: introRespOp,
                  transform: `translateY(${(1 - introRespOp) * 8}px)`,
                  transition: 'opacity 400ms, transform 400ms',
                }}>
                  <AssistantIntro>
                    Removing <code style={{
                      fontFamily: F.mono, fontSize: 19, padding: '2px 6px',
                      background: UI.indigoSoft, color: UI.indigo, borderRadius: 4,
                    }}>validateCardToken</code> affects{' '}
                    <strong>11 callers across 3 services.</strong>
                  </AssistantIntro>
                </div>
              )}
            </div>

            <ChatInput placeholder="Ask a follow-up..."/>
          </div>
        </div>
      )}

      {/* ── BEHIND-THE-SCENES VIZ MODE ── */}

      {/* Caption: signals this is the system view, not the chat UI */}
      {showVizLabel && (
        <div style={{
          position: 'absolute',
          left: 96, top: 80,
          opacity: vizLabelOp,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
            color: '#22d3ee', fontWeight: 600, letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}>
            08 / IMPACT MAP
          </span>
          <span style={{
            width: 40, height: 1, background: 'rgba(255,255,255,0.10)',
          }}/>
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: 14,
            color: '#8a97ad', fontWeight: 400,
            letterSpacing: '0.04em',
          }}>
            What the graph found
          </span>
        </div>
      )}

      {/* Graph fanout on dark backdrop */}
      {showGraph && <GraphFanout phase={graphPhase}/>}

      {/* ADR / PCI context card */}
      {showAdr && (
        <div style={{
          position: 'absolute',
          left: 96, bottom: 96,
          width: 800,
          opacity: adrOp,
          transform: `translateY(${(1 - Math.min(1, adrOp)) * 20}px)`,
          transition: 'opacity 500ms, transform 500ms',
        }}>
          <AdrCard
            id="ADR-031"
            title="PCI redactor: entry point"
            body="validateCardToken is the mandated entry point for PCI-scoped card data. Removing it triggers SAQ-D re-attestation with the assessor."
          />
        </div>
      )}

      {/* Decision close caption */}
      {showDecision && (
        <div style={{
          position: 'absolute',
          right: 96, bottom: 140,
          maxWidth: 640,
          opacity: decisionOp,
          textAlign: 'right',
        }}>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 26, fontWeight: 500,
            color: '#f4f6fb', letterSpacing: '-0.015em', lineHeight: 1.3,
          }}>
            Wiring <span style={{ color: '#22d3ee', fontWeight: 700 }}>+ context.</span>
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 400,
            color: '#8a97ad', letterSpacing: '-0.015em', lineHeight: 1.4,
            marginTop: 10,
          }}>
            The engineer has the full picture before touching a file.
          </div>
        </div>
      )}

      {/* Intro overlay */}
      {introOpacity > 0.01 && (
        <IntroOverlay opacity={introOpacity} t={t}/>
      )}

      {/* CTA overlay */}
      {showCta && (
        <CtaOverlay opacity={ctaOpacity} t={t - B.cta}/>
      )}
    </>
  );
}

function IntroOverlay({ opacity, t }) {
  const r = (d) => clamp((t - d) / 0.5, 0, 1);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#050910',
      display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', justifyContent: 'center',
      padding: '0 120px',
      opacity,
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 18,
        color: '#22d3ee', letterSpacing: '0.22em',
        marginBottom: 32,
        opacity: r(0.2),
      }}>
        CE PATTERNS · 08 — IMPACT ANALYSIS
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 124,
        color: '#f4f6fb', letterSpacing: '-0.04em', lineHeight: 1.0,
        opacity: r(0.6),
      }}>
        An engineer wants<br/>to remove a <span style={{ color: '#fbbf24' }}>function.</span>
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: 44,
        color: '#8a97ad', letterSpacing: '-0.015em',
        marginTop: 32,
        opacity: r(4.5),
      }}>
        What <span style={{ color: '#f4f6fb', fontWeight: 500 }}>breaks?</span>
      </div>
    </div>
  );
}

function CtaOverlay({ opacity, t }) {
  // Reveals compressed to fit Drew's 3.6s s9 narration:
  //   t-cta 0.0  : "Real impact analysis." spoken -> fades in
  //   t-cta 1.0  : "Not a guess." spoken
  //   t-cta 1.7  : "OutcomeOps dot A I" spoken -> rule + lockup hit together
  //   t-cta 2.7  : tag fades in after URL spoken
  const r = (d) => clamp((t - d) / 0.4, 0, 1);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#050910',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity,
    }}>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 80,
        color: '#f4f6fb', letterSpacing: '-0.035em', textAlign: 'center',
        lineHeight: 1.1,
        opacity: r(0),
      }}>
        Real <span style={{ color: '#22d3ee' }}>impact analysis.</span>
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 40,
        color: '#8a97ad', letterSpacing: '-0.015em', textAlign: 'center',
        marginTop: 18,
        opacity: r(1.0),
      }}>
        Not a guess.
      </div>

      <div style={{
        width: 160, height: 1, background: '#22d3ee',
        margin: '40px 0 30px',
        opacity: r(1.7),
      }}/>

      <div style={{
        fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 128,
        color: '#f4f6fb', letterSpacing: '-0.04em',
        opacity: r(1.7),
      }}>
        OutcomeOps<span style={{ color: '#22d3ee' }}>.ai</span>
      </div>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: '#4d5a70',
        letterSpacing: '0.22em', marginTop: 24,
        opacity: r(2.7),
      }}>
        RAG + GRAPH · WIRING + CONTEXT
      </div>
    </div>
  );
}

Object.assign(window, { ImpactAnalysisScene });
