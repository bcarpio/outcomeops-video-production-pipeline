// scene.jsx — MCP setup video orchestration.
// Two acts: (1) get the Bearer token from OutcomeOps Settings, then
// (2) use it in Claude Desktop with a banking-credible PCI-scope query.
//
// Timings retuned to actual ElevenLabs Drew @ 1.1 narration boundaries
// (see narration.txt header markers + scripts/synth_mcp_setup.py output).
// Total audio: 114.78s; Stage: 116s.

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (t, a, b) => a + (b - a) * clamp(t, 0, 1);
const ramp = (t, t0, t1) => clamp((t - t0) / (t1 - t0), 0, 1);

const API_KEY_FULL = 'ooa_4f7a829d3e6b1c8f5a92b7d40e6c1f8a3b9d2e7c';
const API_KEY_PREFIX = 'ooa_4f7a82';

const PCI_QUERY = 'Where do we touch PCI-scoped card data, and how is it masked in logs?';

// Narration beat boundaries (from synth_mcp_setup.py output)
const B = {
  intro:     0.00,
  settings:  10.48,
  modal:     20.04,
  reveal:    30.72,
  active:    39.68,
  guide:     48.69,
  cdOpen:    63.69,
  cdQuery:   68.88,
  cdTools:   78.52,
  cdResp:    88.74,
  cdSettle: 101.54,
  cta:      108.46,
  end:      113.95,
};

function McpSetupScene() {
  const t = useTime();

  // ── Act 1: Settings page state ──────────────────────────

  // Intro overlay fades out at end of s1 narration
  const introOpacity = 1 - ramp(t, B.settings - 0.8, B.settings + 0.3);
  const pageOpacity  = ramp(t, B.settings - 0.8, B.settings + 0.3) - ramp(t, B.cdOpen - 0.4, B.cdOpen + 1.6);

  // AdminNav highlight when narrator says "opens settings from the admin nav"
  const adminNavHi = t > B.settings + 0.5 && t < B.settings + 4.0 ? 'logout' : null;

  // "They click create" → modal opens
  const createBtnHi = t > B.modal - 0.5 && t < B.modal + 1.2;

  // Modal lifecycle
  const showModal      = t >= B.modal && t < B.active - 0.3;
  const modalOpacity   = ramp(t, B.modal, B.modal + 0.6) - ramp(t, B.active - 0.6, B.active - 0.1);

  // Form sub-state — narrator says "name the key something memorable — Claude Desktop"
  // word "Claude Desktop" lands ~22.5-24s. Type from 22.0 → 25.0.
  const fullName       = 'Claude Desktop';
  const typeProgress   = ramp(t, B.modal + 2.5, B.modal + 5.5);
  const keyName        = fullName.slice(0, Math.round(typeProgress * fullName.length));

  // "choose an expiration. Ninety days is a sensible default" — change at ~26-27
  const expiration     = t > B.modal + 7.0 ? '90 days' : 'No expiration';

  // Highlight + "click" Create button near end of s3 (just before reveal)
  const createCtaHi    = t > B.reveal - 2.0 && t < B.reveal - 0.2;

  // Modal flips to reveal at exact narration boundary
  const modalView      = t < B.reveal ? 'form' : 'reveal';

  // Reveal sub-state
  // Narrator: "shown exactly once" ~31s; "yellow banner: copy it now or it's gone" ~33-37
  // "The user copies" ~37; "A green check confirms" ~38-39
  let copyState = 'idle';
  if (t >= B.reveal + 8.0)      copyState = 'copied';
  else if (t >= B.reveal + 5.0) copyState = 'highlight';

  // s5: Active key appears as modal closes
  const showActiveKey  = t > B.active - 0.2;
  // Hold highlight while narrator describes the row
  const activeKeyHi    = t > B.active && t < B.active + 6.0;

  // s6: Connection guide expands as narrator says "The connection guide shows..."
  const guideExpanded  = t > B.guide + 0.5;

  // Tab cycling — narrator names "Claude Code, VS Code, Cursor, Claude Desktop" ~50-53s
  // Each name ~0.6s. Cycle one tab per name.
  let guideClient = 'claudeDesktop';
  if (t < B.guide + 1.8)        guideClient = 'claudeCode';
  else if (t < B.guide + 2.6)   guideClient = 'vscode';
  else if (t < B.guide + 3.4)   guideClient = 'cursor';
  else                          guideClient = 'claudeDesktop';

  // Token highlight — narrator says "pastes the token into claude_desktop_config.json, and restarts"
  // That phrase lands around s6+8 to s6+15 (57s-64s)
  const tokenHi = t > B.guide + 7.5 && t < B.cdOpen;

  // Page scroll for Act 1
  let scrollY = 0;
  if (t < B.active)         scrollY = 0;
  else if (t < B.guide)     scrollY = lerp(ramp(t, B.active, B.guide), 0, -60);
  else if (t < B.guide + 4) scrollY = lerp(ramp(t, B.guide, B.guide + 4), -60, -380);
  else                      scrollY = -380;

  // ── Act 2: Claude Desktop ───────────────────────────────

  // CD window fades in just before s7 narration ("Claude Desktop now sees OutcomeOps...")
  const showClaudeDesktop = t >= B.cdOpen - 0.3 && t < B.cta + 0.4;
  const cdOpacity         = ramp(t, B.cdOpen - 0.3, B.cdOpen + 1.4) - ramp(t, B.cta - 0.8, B.cta + 0.4);

  // s8: User PCI query — narrator says "A banking engineer asks a question they actually
  // have to answer for compliance" then "Where do we touch PCI-scoped card data..."
  // Bubble in just before the question is spoken (~71s, mid-s8)
  const showUserMsg   = t >= B.cdQuery + 1.0;
  const userMsgOp     = ramp(t, B.cdQuery + 1.0, B.cdQuery + 2.0);

  // s9: Tool chips. Narrator:
  //  "Claude reaches into OutcomeOps over MCP" — chip 1 appears (~79.5)
  //  "queries the knowledge base"              — chip 1 still highlighted (~81)
  //  "lists the right workspace"               — chip 2 appears (~83.5)
  //  "and pulls the relevant architecture design patterns" — chip 3 (~86.5)
  //  All done by start of s10
  const chip1Op       = ramp(t, B.cdTools + 0.3,  B.cdTools + 0.9);
  const chip2Op       = ramp(t, B.cdTools + 3.0,  B.cdTools + 3.6);
  const chip3Op       = ramp(t, B.cdTools + 5.8,  B.cdTools + 6.4);
  const chipsDone     = t >= B.cdResp - 0.3;

  // s10: Response streams — narrator describes "three specific files" + masking + redactor
  // Stream 11 lines across 89.5 - 100.5 (10s window inside the 12.7s s10 beat)
  const respStart     = B.cdResp + 0.4;
  const respEnd       = B.cdResp + 11.0;
  const TOTAL_LINES   = 11;
  const respProg      = ramp(t, respStart, respEnd);
  const linesShown    = Math.floor(respProg * TOTAL_LINES);

  // ADR highlight when narrator says "the design pattern for policies ties it all together"
  // That phrase lands roughly t = 97-100 inside s10
  const adrHi         = t > B.cdResp + 7.5 && t < B.cdSettle + 1.5;

  // ── CTA ─────────────────────────────────────────────────
  const showCta      = t > B.cta - 0.4;
  const ctaOpacity   = ramp(t, B.cta - 0.4, B.cta + 1.2);

  // ── Render ──────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .cursor { animation: blink 1.1s steps(2) infinite; }
      `}</style>

      {/* Act 1: Settings page */}
      {pageOpacity > 0.01 && (
        <div style={{
          position: 'absolute', inset: 0,
          opacity: pageOpacity,
          transition: 'opacity 300ms',
        }}>
          <BrowserFrame url="outcomeops.outcomeops.ai/settings">
            <SettingsHeader adminNavHighlight={adminNavHi}/>
            <div style={{
              position: 'absolute', inset: '110px 0 0 0',
              overflow: 'hidden',
            }}>
              <main style={{
                maxWidth: 1400, margin: '0 auto',
                padding: '40px 32px 80px',
                transform: `translateY(${scrollY}px)`,
                transition: 'transform 1500ms cubic-bezier(0.22, 0.61, 0.36, 1)',
              }}>
                <ProfileCard/>

                <div style={{ marginTop: 32 }}>
                  <ApiKeysHeader buttonHighlight={createBtnHi}/>
                  <InfoBanner/>
                  <Card>
                    <CardHeader
                      icon={<I.Key size={22} stroke={C.gray700}/>}
                      title="Active Keys"
                      count={showActiveKey ? 1 : 0}
                    />
                    {showActiveKey ? (
                      <ActiveKeyRow
                        name="Claude Desktop"
                        prefix={API_KEY_PREFIX}
                        created="just now"
                        lastUsed="Never"
                        highlight={activeKeyHi}
                      />
                    ) : (
                      <EmptyKeysState/>
                    )}
                  </Card>

                  {guideExpanded
                    ? <ConnectionGuideExpanded activeClient={guideClient} tokenHighlight={tokenHi}/>
                    : <ConnectionGuideCollapsed/>}
                </div>
              </main>
            </div>
          </BrowserFrame>
        </div>
      )}

      {/* Modal overlay (Act 1) */}
      {showModal && (
        <ModalOverlay opacity={modalOpacity}>
          {modalView === 'form' ? (
            <CreateModalForm
              keyName={keyName}
              expiration={expiration}
              createHighlight={createCtaHi}
            />
          ) : (
            <CreateModalReveal
              apiKey={API_KEY_FULL}
              copyState={copyState}
            />
          )}
        </ModalOverlay>
      )}

      {/* Intro overlay (Act 1) */}
      {introOpacity > 0.01 && (
        <IntroOverlay opacity={introOpacity} t={t}/>
      )}

      {/* Act 2: Claude Desktop */}
      {showClaudeDesktop && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#050505',
          opacity: cdOpacity,
        }}>
          <ClaudeDesktopWindow>
            <ClaudeSidebar/>
            <ClaudeMainArea connected={t > B.cdOpen + 1.2}>
              <div style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', gap: 20,
                overflow: 'hidden',
              }}>
                {showUserMsg && (
                  <div style={{
                    opacity: userMsgOp,
                    transform: `translateY(${(1 - userMsgOp) * 12}px)`,
                    transition: 'opacity 400ms, transform 400ms',
                    display: 'flex', justifyContent: 'flex-end',
                  }}>
                    <ClaudeUserMessage text={PCI_QUERY}/>
                  </div>
                )}

                {t >= B.cdTools + 0.3 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {chip1Op > 0 && (
                      <div style={{ opacity: chip1Op }}>
                        <ClaudeToolChip
                          call='query_knowledge_base("PCI scope card data masking")'
                          status={chipsDone ? 'done' : 'running'}
                        />
                      </div>
                    )}
                    {chip2Op > 0 && (
                      <div style={{ opacity: chip2Op }}>
                        <ClaudeToolChip
                          call='list_workspace_documents("payments-service")'
                          status={chipsDone ? 'done' : 'running'}
                        />
                      </div>
                    )}
                    {chip3Op > 0 && (
                      <div style={{ opacity: chip3Op }}>
                        <ClaudeToolChip
                          call='query_knowledge_base("ADR audit logging PAN")'
                          status={chipsDone ? 'done' : 'running'}
                        />
                      </div>
                    )}
                  </div>
                )}

                {t >= respStart && linesShown > 0 && (
                  <ClaudeResponseBlock
                    linesShown={linesShown}
                    highlightAdr={adrHi}
                  />
                )}
              </div>

              <ClaudeInputBox/>
            </ClaudeMainArea>
          </ClaudeDesktopWindow>
        </div>
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
        fontFamily: F.mono, fontSize: 18,
        color: '#22d3ee', letterSpacing: '0.22em',
        marginBottom: 32,
        opacity: r(0.2),
      }}>
        OUTCOMEOPS / MCP SETUP
      </div>
      <div style={{
        fontFamily: F.ui, fontWeight: 700, fontSize: 132,
        color: '#f4f6fb', letterSpacing: '-0.04em', lineHeight: 0.95,
        opacity: r(0.6),
      }}>
        Get your<br/>
        <span style={{ color: '#22d3ee' }}>Bearer token.</span>
      </div>
      <div style={{
        fontFamily: F.ui, fontWeight: 300, fontSize: 32,
        color: '#8a97ad', letterSpacing: '-0.015em',
        marginTop: 36, maxWidth: 1000,
        opacity: r(3.5),
      }}>
        Then use it in <span style={{ color: '#f4f6fb', fontWeight: 500 }}>Claude Desktop</span>
        {' '}— grounded in your organization's code.
      </div>
    </div>
  );
}

function CtaOverlay({ opacity, t }) {
  const r = (d) => clamp((t - d) / 0.5, 0, 1);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#050910',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity,
    }}>
      <div style={{
        fontFamily: F.ui, fontWeight: 300, fontSize: 44,
        color: '#8a97ad', letterSpacing: '-0.015em', textAlign: 'center',
        opacity: r(0),
      }}>
        One key. One endpoint.
      </div>
      <div style={{
        fontFamily: F.ui, fontWeight: 600, fontSize: 80,
        color: '#f4f6fb', letterSpacing: '-0.035em', textAlign: 'center',
        marginTop: 18, lineHeight: 1.1,
        opacity: r(1.2),
      }}>
        Every answer cited back to<br/>
        <span style={{ color: '#22d3ee' }}>your own code.</span>
      </div>
      <div style={{
        width: 160, height: 1, background: '#22d3ee',
        margin: '56px 0 36px',
        opacity: r(3.5),
      }}/>
      <div style={{
        fontFamily: F.ui, fontWeight: 600, fontSize: 120,
        color: '#f4f6fb', letterSpacing: '-0.04em',
        opacity: r(3.5),
      }}>
        OutcomeOps<span style={{ color: '#22d3ee' }}>.ai</span>
      </div>
    </div>
  );
}

Object.assign(window, { McpSetupScene });
