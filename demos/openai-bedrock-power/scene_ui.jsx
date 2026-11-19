// scene_ui.jsx -- "OutcomeOps + OpenAI on Bedrock: Pick the Model. Keep the Substrate."
//
// Primitives for the better-together video. Heavily mirrored from
// demos/kiro-power/scene_ui.jsx so the SceneLabel / StageBackdrop /
// BrandMark / Chip / Dot semantics match the rest of the channel.
//
// New to this demo:
//   ModelBadge       -- one tile in the BedrockShelf grid
//   BedrockShelf     -- the Bedrock wordmark + 4x5 model grid (Beat 2 hero)
//   HeadlineCard     -- one mocked tech-headline card flying past (Beat 1)
//   EditorialHero    -- giant centered headline used in Beats 3 + 6
//   QueryBubble      -- the security-architect question (Beat 4 top)
//   AnswerPanel      -- one model answer panel with prose + cited sources
//   ToolsVsOutcomes  -- the Beat 5 two-column contrast
//   BetterTogether   -- the Beat 6 three-tier stack

// ── Design tokens ──────────────────────────────────────────────────────────
const oo = {
  bg:        '#0A1020',
  bg2:       '#0F172A',
  surface:   '#141C30',
  surface2:  '#1B2540',
  border:    '#273354',
  borderHi:  '#3A4A78',
  text:      '#E6EBF5',
  textDim:   '#8A96B4',
  textFaint: '#5A6686',
  accent:    '#5AA9FF',           // OutcomeOps electric blue
  accentDim: '#2B5FA8',
  accentBg:  'rgba(90,169,255,0.12)',
  success:   '#4ADE80',
  successBg: 'rgba(74,222,128,0.12)',
  warn:      '#FBBF24',
  danger:    '#F87171',
  dangerBg:  'rgba(248,113,113,0.12)',
  purple:    '#A78BFA',
  magenta:   '#F472B6',
  aws:       '#FF9900',           // AWS orange (Bedrock)
  awsDeep:   '#232F3E',           // AWS console navy
  mono:      "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  sans:      "'Inter', system-ui, -apple-system, sans-serif",
};

// Vendor brand approximations for ModelBadge accents.
// Not pixel-perfect to corporate guidelines -- legible category cues only.
const VENDOR = {
  anthropic: { color: '#D97757', mark: 'A',  name: 'Anthropic' },
  openai:    { color: '#10A37F', mark: 'O',  name: 'OpenAI'    },
  xai:       { color: '#E6EBF5', mark: 'X',  name: 'xAI'       },
  meta:      { color: '#1877F2', mark: 'M',  name: 'Meta'      },
  amazon:    { color: '#FF9900', mark: 'a',  name: 'Amazon'    },
  mistral:   { color: '#FA520F', mark: 'M',  name: 'Mistral'   },
  alibaba:   { color: '#FF6A00', mark: 'Q',  name: 'Alibaba'   },
  deepseek:  { color: '#4D6BFE', mark: 'D',  name: 'DeepSeek'  },
  nvidia:    { color: '#76B900', mark: 'N',  name: 'NVIDIA'    },
  google:    { color: '#4285F4', mark: 'G',  name: 'Google'    },
  moonshot:  { color: '#FFCC33', mark: 'K',  name: 'Moonshot'  },
  writer:    { color: '#7C3AED', mark: 'W',  name: 'Writer'    },
  zai:       { color: '#A78BFA', mark: 'Z',  name: 'Z.AI'      },
};

// ── Shared chrome ──────────────────────────────────────────────────────────

const SceneLabel = ({ number, title, subtitle, x = 60, y = 54, color = oo.accent }) => (
  <div style={{
    position: 'absolute', left: x, top: y,
    fontFamily: oo.sans, pointerEvents: 'none',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      <span style={{
        fontFamily: oo.mono, fontSize: 12, fontWeight: 700,
        padding: '4px 10px', borderRadius: 5,
        background: `${color}1f`, border: `1px solid ${color}55`,
        color, letterSpacing: '0.14em',
      }}>{number}</span>
      <span style={{
        fontFamily: oo.mono, fontSize: 11, fontWeight: 700,
        color: oo.textDim, letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>{subtitle}</span>
    </div>
    <div style={{
      fontFamily: oo.sans, fontSize: 28, fontWeight: 700, color: oo.text,
      letterSpacing: '-0.018em',
    }}>{title}</div>
  </div>
);

const Chip = ({ icon, color = oo.accent, children, style }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '7px 14px', borderRadius: 99,
    background: `${color}14`,
    border: `1px solid ${color}55`,
    fontFamily: oo.mono, fontSize: 12, fontWeight: 700,
    color, letterSpacing: '0.08em', textTransform: 'uppercase',
    ...style,
  }}>
    {icon}{children}
  </div>
);

const Dot = ({ color = oo.accent, size = 8, pulse = false }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: color,
    animation: pulse ? 'ooPulse 1.6s ease-in-out infinite' : 'none',
    flexShrink: 0,
  }}/>
);

// ── Background -- jira-to-pr grid + center glow (matches intelligence-layer) ─
const StageBackdrop = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `linear-gradient(${oo.border}30 1px, transparent 1px), linear-gradient(90deg, ${oo.border}30 1px, transparent 1px)`,
      backgroundSize: '48px 48px',
      maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
      WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
    }} />
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      width: 900, height: 900,
      transform: 'translate(-50%, -50%)',
      background: 'radial-gradient(circle, rgba(90,169,255,0.08), transparent 70%)',
      pointerEvents: 'none',
    }} />
  </div>
);

// ── Brand mark (Beat 6) ────────────────────────────────────────────────────
const BrandMark = ({ size = 1 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 * size }}>
    <div style={{
      width: 72 * size, height: 72 * size, borderRadius: '50%',
      overflow: 'hidden', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 0 1px ${oo.border}`, flexShrink: 0,
      position: 'relative',
    }}>
      <img src="outcomeops_mark.png" alt="OutcomeOps" style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120%', height: '120%', objectFit: 'cover', display: 'block',
      }}/>
    </div>
    <div>
      <div style={{
        fontFamily: oo.sans, fontSize: 30 * size, fontWeight: 800,
        color: oo.text, letterSpacing: '-0.02em', lineHeight: 1,
      }}>OutcomeOps</div>
      <div style={{
        fontFamily: oo.mono, fontSize: 11 * size, fontWeight: 600,
        color: oo.textDim, letterSpacing: '0.16em',
        textTransform: 'uppercase', marginTop: 6,
      }}>The Substrate Underneath</div>
    </div>
  </div>
);

// ── Beat 1: HeadlineCard -- one mocked tech-discourse card ────────────────
// Used in a swarm to convey two years of "which model wins" debate.
// Source kind drives the visual treatment (Twitter-style vs blog headline
// vs conference talk title). Author/handle is fabricated; text is the
// kind of argument you actually see in this space.
const HeadlineCard = ({ kind = 'tweet', source, handle, text, x, y, rot = 0, scale = 1, opacity = 1 }) => {
  const styles = {
    tweet: {
      width: 360,
      background: '#0E1525',
      border: `1px solid ${oo.border}`,
      borderRadius: 14,
      sourceColor: '#1D9BF0',
    },
    headline: {
      width: 420,
      background: '#101729',
      border: `1px solid ${oo.borderHi}`,
      borderRadius: 8,
      sourceColor: oo.warn,
    },
    talk: {
      width: 380,
      background: '#121A2E',
      border: `1px solid ${oo.accent}55`,
      borderRadius: 10,
      sourceColor: oo.accent,
    },
  };
  const s = styles[kind];
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
      width: s.width, padding: '14px 18px',
      background: s.background, border: s.border, borderRadius: s.borderRadius,
      fontFamily: oo.sans,
      opacity, pointerEvents: 'none',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9,
        fontFamily: oo.mono, fontSize: 10, fontWeight: 700,
        color: s.sourceColor, letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>
        <Dot color={s.sourceColor} size={6}/>
        <span>{source}</span>
        {handle && (
          <span style={{ color: oo.textFaint, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'none' }}>
            {handle}
          </span>
        )}
      </div>
      <div style={{
        fontSize: kind === 'headline' ? 17 : 14.5,
        fontWeight: kind === 'headline' ? 700 : 500,
        color: oo.text, lineHeight: 1.35, letterSpacing: '-0.005em',
      }}>{text}</div>
    </div>
  );
};

// ── Beat 2: BedrockShelf -- AWS Bedrock wordmark + 4x5 model grid ─────────
// The Beat 2 hero. AWS gets a clean, generous moment: wordmark at top,
// twenty model badges fanned underneath, three callouts orbiting.

const ModelBadge = ({ name, vendor, opacity = 1, scale = 1, style }) => {
  const v = VENDOR[vendor] || VENDOR.amazon;
  return (
    <div style={{
      width: 208, padding: '12px 14px',
      background: oo.surface,
      border: `1px solid ${v.color}55`,
      borderRadius: 10,
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: oo.sans,
      opacity, transform: `scale(${scale})`,
      ...style,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 6,
        background: `${v.color}22`,
        border: `1px solid ${v.color}88`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: oo.mono, fontSize: 13, fontWeight: 800,
        color: v.color, flexShrink: 0,
      }}>{v.mark}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontFamily: oo.mono, fontSize: 9.5, fontWeight: 700,
          color: oo.textDim, letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: 1,
        }}>{v.name}</div>
        <div style={{
          fontSize: 13, fontWeight: 600, color: oo.text,
          letterSpacing: '-0.005em', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name}</div>
      </div>
    </div>
  );
};

// The model grid -- 4 rows x 5 columns. Each row has a "family" feel:
// row 1 Anthropic/Meta/Amazon foundations; row 2 OpenAI/xAI/Alibaba/DeepSeek
// frontier; row 3 Mistral family; row 4 specialists.
const MODEL_GRID = [
  // row 1
  [{ name: 'Claude Sonnet 4.6', vendor: 'anthropic' },
   { name: 'Claude Haiku 4.5',  vendor: 'anthropic' },
   { name: 'Llama 4',           vendor: 'meta'      },
   { name: 'Titan',             vendor: 'amazon'    },
   { name: 'Nova',              vendor: 'amazon'    }],
  // row 2
  [{ name: 'GPT-5.5',           vendor: 'openai'    },
   { name: 'GPT-OSS',           vendor: 'openai'    },
   { name: 'Grok 4.3',          vendor: 'xai'       },
   { name: 'Qwen 3 Coder',      vendor: 'alibaba'   },
   { name: 'DeepSeek v3',       vendor: 'deepseek'  }],
  // row 3
  [{ name: 'Mistral Large 3',   vendor: 'mistral'   },
   { name: 'Magistral',         vendor: 'mistral'   },
   { name: 'Devstral',          vendor: 'mistral'   },
   { name: 'Voxtral',           vendor: 'mistral'   },
   { name: 'Ministral',         vendor: 'mistral'   }],
  // row 4
  [{ name: 'Nemotron Super',    vendor: 'nvidia'    },
   { name: 'Gemma 3',           vendor: 'google'    },
   { name: 'Moonshot Kimi',     vendor: 'moonshot'  },
   { name: 'Writer Palmyra',    vendor: 'writer'    },
   { name: 'GLM',               vendor: 'zai'       }],
];

// BedrockHeader renders the "AWS Bedrock" wordmark with subtle AWS-orange
// underline. Used as the top of the BedrockShelf and reused in Beat 6.
const BedrockHeader = ({ opacity = 1, size = 1 }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    opacity, fontFamily: oo.sans,
  }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <span style={{
        fontSize: 28 * size, fontWeight: 800, color: oo.text,
        letterSpacing: '-0.02em',
      }}>AWS</span>
      <span style={{
        fontSize: 28 * size, fontWeight: 800, color: oo.aws,
        letterSpacing: '-0.02em',
      }}>Bedrock</span>
    </div>
    <div style={{
      fontFamily: oo.mono, fontSize: 11 * size, fontWeight: 600,
      color: oo.textDim, letterSpacing: '0.16em', textTransform: 'uppercase',
    }}>20+ frontier model families</div>
  </div>
);

// BedrockShelf renders the wordmark + 4x5 grid + 3 callouts. Each
// element accepts its own opacity for staggered reveal in Beat 2.
//   gridReveal -- array of 20 numbers, one per badge (left-to-right,
//                 top-to-bottom). 0..1 each.
//   calloutOps -- array of 3 numbers for the orbiting callout chips.
//   shelfScale -- whole shelf scale (used in Beat 6 to shrink it as the
//                 stack diagram assembles).
const BedrockShelf = ({
  gridReveal = Array(20).fill(1), calloutOps = [1,1,1],
  headerOp = 1, shelfScale = 1, hideIndex = -1,
}) => (
  <div style={{
    position: 'absolute', left: '50%', top: 250,
    transform: `translateX(-50%) scale(${shelfScale})`,
    transformOrigin: 'top center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
  }}>
    <BedrockHeader opacity={headerOp}/>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {MODEL_GRID.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 12 }}>
          {row.map((m, ci) => {
            const idx = ri * 5 + ci;
            const op = (idx === hideIndex) ? 0 : (gridReveal[idx] ?? 0);
            return (
              <div key={ci} style={{
                opacity: op, transform: `translateY(${(1 - op) * 6}px)`,
                visibility: idx === hideIndex ? 'hidden' : 'visible',
              }}>
                <ModelBadge name={m.name} vendor={m.vendor}/>
              </div>
            );
          })}
        </div>
      ))}
    </div>
    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
      <div style={{ opacity: calloutOps[0] }}>
        <Chip color={oo.aws}>One Control Plane</Chip>
      </div>
      <div style={{ opacity: calloutOps[1] }}>
        <Chip color={oo.aws}>One I A M Boundary</Chip>
      </div>
      <div style={{ opacity: calloutOps[2] }}>
        <Chip color={oo.success}>Inside Your AWS Account</Chip>
      </div>
    </div>
  </div>
);

// ── Fireworks -- one starburst at (x,y) with timed pop+expand+fade ────────
// Drives off a single 0..1 prog input; caller schedules N bursts across the
// celebration window. Pure SVG so it stays crisp under H.264.
const Firework = ({ x, y, color = '#FFD86B', prog = 0, raysCount = 8, size = 60 }) => {
  if (prog <= 0 || prog >= 1) return null;
  // Phase 1 (0..0.2): scale 0 -> 1, opacity 0 -> 1 (the pop)
  // Phase 2 (0.2..1.0): scale 1 -> 2.4, opacity 1 -> 0 (the expansion fade)
  const popScale = prog < 0.2 ? prog / 0.2 : 1;
  const expScale = prog >= 0.2 ? 1 + ((prog - 0.2) / 0.8) * 1.4 : 1;
  const scale = popScale * expScale;
  const op = prog < 0.2 ? prog / 0.2 : 1 - (prog - 0.2) / 0.8;
  const rays = Array.from({ length: raysCount }, (_, i) => (i / raysCount) * 360);
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity: op, pointerEvents: 'none',
    }}>
      <svg width={size} height={size} viewBox={`-${size/2} -${size/2} ${size} ${size}`} style={{ display: 'block' }}>
        {/* Central bright dot */}
        <circle cx="0" cy="0" r={size * 0.05} fill={color}/>
        {/* Rays */}
        {rays.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const r1 = size * 0.10;
          const r2 = size * 0.42;
          const x1 = Math.cos(rad) * r1, y1 = Math.sin(rad) * r1;
          const x2 = Math.cos(rad) * r2, y2 = Math.sin(rad) * r2;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.95"/>
          );
        })}
        {/* Trailing sparkles at the ray tips */}
        {rays.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const r = size * 0.46;
          const sx = Math.cos(rad) * r, sy = Math.sin(rad) * r;
          return (
            <circle key={'s'+i} cx={sx} cy={sy} r={size * 0.025} fill={color}/>
          );
        })}
      </svg>
    </div>
  );
};

// FireworksLayer -- a fixed schedule of bursts at random points. Each
// burst's prog is driven by `t` relative to its start time.
const FIREWORK_SCHEDULE = [
  { x: 280,  y: 220, color: '#FFD86B', start: 0.0, dur: 1.6, size: 80 },
  { x: 1320, y: 250, color: '#10A37F', start: 0.3, dur: 1.6, size: 90 },
  { x: 220,  y: 540, color: '#A78BFA', start: 0.6, dur: 1.5, size: 70 },
  { x: 1380, y: 600, color: '#FFD86B', start: 0.9, dur: 1.6, size: 85 },
  { x: 420,  y: 720, color: '#10A37F', start: 1.2, dur: 1.5, size: 70 },
  { x: 1180, y: 720, color: '#5AA9FF', start: 1.5, dur: 1.6, size: 80 },
  { x: 760,  y: 180, color: '#FFD86B', start: 1.8, dur: 1.4, size: 65 },
  { x: 880,  y: 760, color: '#A78BFA', start: 2.1, dur: 1.6, size: 90 },
  { x: 380,  y: 380, color: '#10A37F', start: 2.5, dur: 1.4, size: 60 },
  { x: 1240, y: 420, color: '#FFD86B', start: 2.9, dur: 1.5, size: 75 },
  { x: 620,  y: 580, color: '#5AA9FF', start: 3.3, dur: 1.5, size: 70 },
  { x: 1100, y: 540, color: '#10A37F', start: 3.7, dur: 1.5, size: 80 },
  { x: 320,  y: 660, color: '#FFD86B', start: 4.1, dur: 1.5, size: 65 },
  { x: 1380, y: 360, color: '#A78BFA', start: 4.5, dur: 1.4, size: 75 },
  { x: 480,  y: 250, color: '#10A37F', start: 4.9, dur: 1.5, size: 70 },
  { x: 1060, y: 280, color: '#FFD86B', start: 5.3, dur: 1.5, size: 75 },
];

const FireworksLayer = ({ t, opacity = 1 }) => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}>
    {FIREWORK_SCHEDULE.map((fw, i) => {
      const lt = t - fw.start;
      if (lt < 0 || lt > fw.dur) return null;
      return (
        <Firework key={i} x={fw.x} y={fw.y}
          color={fw.color} prog={lt / fw.dur} size={fw.size}/>
      );
    })}
  </div>
);

// CelebrationCard -- the OpenAI GPT-5.5 hero tile that lifts out of the
// grid. Bigger than ModelBadge, with a "JUST LANDED ON BEDROCK" badge,
// the OpenAI brand color stripe, and a release-style "NEW" pulse.
const CelebrationCard = ({ opacity = 1, scale = 1, ty = 0 }) => {
  const v = VENDOR.openai;
  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      transform: `translate(-50%, -50%) translateY(${ty}px) scale(${scale})`,
      opacity, pointerEvents: 'none',
      fontFamily: oo.sans,
    }}>
      {/* Outer halo ring -- the "VIP spotlight" frame */}
      <div style={{
        position: 'absolute', inset: -22, borderRadius: 22,
        background: `radial-gradient(ellipse, ${v.color}1a, transparent 70%)`,
      }}/>
      {/* The card */}
      <div style={{
        position: 'relative',
        width: 480, padding: '22px 26px',
        background: oo.surface,
        border: `2px solid ${v.color}`,
        borderRadius: 16,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {/* "NEW" pulse badge floats above the top-left corner */}
        <div style={{
          position: 'absolute', top: -14, left: 22,
          padding: '4px 12px', borderRadius: 99,
          background: v.color, color: '#062D22',
          fontFamily: oo.mono, fontSize: 11, fontWeight: 800,
          letterSpacing: '0.16em',
          animation: 'ooPulse 1.4s ease-in-out infinite',
        }}>JUST LANDED ON BEDROCK</div>

        {/* Vendor row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: `${v.color}22`,
            border: `1.5px solid ${v.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: oo.mono, fontSize: 26, fontWeight: 800,
            color: v.color, flexShrink: 0,
          }}>{v.mark}</div>
          <div>
            <div style={{
              fontFamily: oo.mono, fontSize: 11, fontWeight: 700,
              color: oo.textDim, letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>{v.name}</div>
            <div style={{
              fontSize: 26, fontWeight: 800, color: oo.text,
              letterSpacing: '-0.018em', marginTop: 2,
            }}>GPT-5.5</div>
          </div>
        </div>

        {/* Spec strip */}
        <div style={{
          display: 'flex', gap: 8,
        }}>
          <span style={{
            padding: '4px 10px', borderRadius: 6,
            background: `${v.color}14`, color: v.color,
            border: `1px solid ${v.color}44`,
            fontFamily: oo.mono, fontSize: 10.5, fontWeight: 700,
            letterSpacing: '0.08em',
          }}>FRONTIER REASONING</span>
          <span style={{
            padding: '4px 10px', borderRadius: 6,
            background: `${oo.aws}14`, color: oo.aws,
            border: `1px solid ${oo.aws}44`,
            fontFamily: oo.mono, fontSize: 10.5, fontWeight: 700,
            letterSpacing: '0.08em',
          }}>RESPONSES API</span>
        </div>
      </div>
    </div>
  );
};

// CelebrationCaption -- the small caption beneath the celebration tile.
// Genuinely congratulatory; the "so what" lives in the next beat.
const CelebrationCaption = ({ opacity = 1, ty = 0 }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, bottom: 80,
    textAlign: 'center', opacity,
    transform: `translateY(${ty}px)`,
    fontFamily: oo.sans, pointerEvents: 'none',
  }}>
    <div style={{
      fontSize: 26, fontWeight: 700, color: oo.text,
      letterSpacing: '-0.015em', marginBottom: 6,
    }}>
      Congrats to <span style={{ color: VENDOR.openai.color }}>OpenAI</span> on the launch.
    </div>
    <div style={{
      fontSize: 15, color: oo.textDim, letterSpacing: '-0.005em',
    }}>
      Twentieth frontier family on Bedrock. The model layer is officially commodified.
    </div>
  </div>
);

// ── Beat 3: EditorialHero -- giant centered headline with optional sub ────
const EditorialHero = ({ headline, sub, opacity = 1, ty = 0, scale = 1,
                         headlineColor = oo.text, subColor = oo.textDim,
                         size = 56, subSize = 19 }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, top: '38%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
    opacity, transform: `translateY(${ty}px) scale(${scale})`,
    fontFamily: oo.sans, pointerEvents: 'none', textAlign: 'center',
  }}>
    <div style={{
      fontSize: size, fontWeight: 800, color: headlineColor,
      letterSpacing: '-0.025em', lineHeight: 1.1, maxWidth: 1300, padding: '0 60px',
    }}>{headline}</div>
    {sub && (
      <div style={{
        fontSize: subSize, fontWeight: 500, color: subColor,
        letterSpacing: '-0.005em', lineHeight: 1.5, maxWidth: 980, padding: '0 60px',
      }}>{sub}</div>
    )}
  </div>
);

// ── Beat 4: QueryBubble -- the security-architect question ────────────────
const QueryBubble = ({ persona, question, opacity = 1, ty = 0 }) => (
  <div style={{
    position: 'absolute', left: '50%', top: 130,
    transform: `translateX(-50%) translateY(${ty}px)`,
    opacity,
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
    fontFamily: oo.sans,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      paddingLeft: 8,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: `${oo.danger}22`,
        border: `1px solid ${oo.danger}77`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: oo.danger,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={oo.danger}
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <span style={{
        fontFamily: oo.mono, fontSize: 11, fontWeight: 700,
        color: oo.danger, letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>{persona}</span>
    </div>
    <div style={{
      padding: '16px 22px',
      background: oo.surface, border: `1px solid ${oo.border}`,
      borderRadius: 14,
      fontSize: 22, fontWeight: 500, color: oo.text,
      letterSpacing: '-0.01em', maxWidth: 780,
    }}>{question}</div>
  </div>
);

// ── Beat 4: AnswerPanel -- one model answer with prose + citations ────────
//
// Three of these render side-by-side. The point is that the cited sources
// are IDENTICAL across all three; only the synthesizing prose differs.
//
// Props:
//   model    -- { name, vendor }
//   prose    -- string (~3-4 sentence answer)
//   citations -- array of { source, badge, color }
//   appear   -- 0..1 entry opacity
//   proseReveal -- 0..1 ramps how much of the prose has rendered
//                  (used to stagger the text in just after the header).
//   citeReveal -- array of 4 numbers, one per citation card.
const AnswerPanel = ({ model, prose, citations, appear = 1,
                       proseReveal = 1, citeReveal = [1,1,1,1] }) => {
  const v = VENDOR[model.vendor];
  // Reveal prose character-by-character based on proseReveal
  const proseLen = Math.floor(prose.length * proseReveal);
  const shownProse = prose.slice(0, proseLen);
  return (
    <div style={{
      width: 462, height: 520,
      background: oo.surface, border: `1px solid ${oo.border}`,
      borderRadius: 14, overflow: 'hidden',
      opacity: appear, transform: `translateY(${(1 - appear) * 8}px)`,
      display: 'flex', flexDirection: 'column',
      fontFamily: oo.sans,
    }}>
      {/* Header strip -- model badge */}
      <div style={{
        padding: '14px 18px',
        background: `${v.color}10`,
        borderBottom: `1px solid ${v.color}44`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 7,
          background: `${v.color}22`,
          border: `1px solid ${v.color}88`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: oo.mono, fontSize: 15, fontWeight: 800, color: v.color,
        }}>{v.mark}</div>
        <div>
          <div style={{
            fontFamily: oo.mono, fontSize: 9.5, fontWeight: 700,
            color: oo.textDim, letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>Powered by</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: oo.text,
                        letterSpacing: '-0.005em' }}>{model.name}</div>
        </div>
      </div>
      {/* Prose answer */}
      <div style={{
        padding: '18px 20px',
        fontSize: 14.5, color: oo.text, lineHeight: 1.55,
        letterSpacing: '-0.002em',
        minHeight: 200,
      }}>
        {shownProse}
        {proseLen < prose.length && (
          <span style={{
            display: 'inline-block', width: 7, height: 16,
            background: oo.accent, marginLeft: 2, verticalAlign: 'text-bottom',
            animation: 'ooCaret 0.85s steps(2) infinite',
          }}/>
        )}
      </div>
      {/* Cited sources -- the IDENTICAL list across all three panels */}
      <div style={{
        padding: '14px 20px 18px', borderTop: `1px solid ${oo.border}`,
        background: oo.bg2,
        marginTop: 'auto',
      }}>
        <div style={{
          fontFamily: oo.mono, fontSize: 10, fontWeight: 700,
          color: oo.textDim, letterSpacing: '0.14em',
          textTransform: 'uppercase', marginBottom: 10,
        }}>Cited Sources</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {citations.map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: citeReveal[i] ?? 1,
              transform: `translateX(${(1 - (citeReveal[i] ?? 1)) * -10}px)`,
            }}>
              <span style={{
                fontFamily: oo.mono, fontSize: 10, fontWeight: 800,
                padding: '3px 7px', borderRadius: 4,
                background: `${c.color}22`,
                color: c.color, letterSpacing: '0.06em',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>{c.badge}</span>
              <span style={{
                fontFamily: oo.mono, fontSize: 12.5, color: oo.text,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{c.source}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Beat 4: TfvarsTriPanel -- 3-row tfvars card "customer picks" ──────────
const TfvarsTriPanel = ({ opacity = 1 }) => (
  <div style={{
    width: 940, padding: '14px 18px',
    background: oo.bg2, border: `1px solid ${oo.border}`,
    borderRadius: 12, fontFamily: oo.mono,
    opacity,
  }}>
    <div style={{
      fontSize: 10.5, fontWeight: 700, color: oo.textDim,
      letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{
        padding: '2px 7px', borderRadius: 4,
        background: `${oo.accent}22`, color: oo.accent,
        border: `1px solid ${oo.accent}55`,
      }}>terraform.tfvars</span>
      <span style={{ color: oo.textFaint, fontWeight: 500, textTransform: 'none', letterSpacing: '0.02em' }}>
        // each team picks the model that fits their workload
      </span>
    </div>
    {[
      { team: 'team A', val: '"us.anthropic.claude-sonnet-4-6"', color: VENDOR.anthropic.color },
      { team: 'team B', val: '"openai.gpt-5.5"',                  color: VENDOR.openai.color    },
      { team: 'team C', val: '"xai.grok-4.3"',                    color: VENDOR.xai.color       },
    ].map((row, i) => (
      <div key={i} style={{
        fontSize: 14, color: oo.text, padding: '4px 0',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ color: oo.purple }}>bedrock_advanced_model_id</span>
        <span style={{ color: oo.textFaint }}>=</span>
        <span style={{ color: row.color, fontWeight: 600 }}>{row.val}</span>
        <span style={{ color: oo.textFaint, marginLeft: 'auto', fontSize: 12 }}>
          # {row.team}
        </span>
      </div>
    ))}
  </div>
);

// ── Beat 5: ToolsVsOutcomes -- two-column contrast ────────────────────────
const ContrastColumn = ({ title, items, accent, opacity = 1, itemReveal = [] }) => (
  <div style={{
    width: 580, opacity,
    background: oo.surface, border: `1px solid ${oo.border}`,
    borderRadius: 14, padding: '24px 26px',
    fontFamily: oo.sans,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
    }}>
      <Dot color={accent} size={10}/>
      <span style={{
        fontFamily: oo.mono, fontSize: 11, fontWeight: 700,
        color: accent, letterSpacing: '0.14em', textTransform: 'uppercase',
      }}>{title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      {items.map((item, i) => {
        const op = itemReveal[i] ?? 1;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            fontSize: 16, lineHeight: 1.4, color: oo.text,
            opacity: op, transform: `translateX(${(1 - op) * -8}px)`,
          }}>
            <span style={{
              flexShrink: 0, marginTop: 4,
              width: 16, height: 16, borderRadius: '50%',
              background: `${accent}22`, color: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800,
            }}>{accent === oo.danger ? '×' : '✓'}</span>
            <span style={{ letterSpacing: '-0.005em' }}>{item}</span>
          </div>
        );
      })}
    </div>
  </div>
);

// ── Beat 6: BetterTogetherStack -- 3-tier "AWS account / Bedrock / OO" ───
const BetterTogetherStack = ({ tierOp = [1,1,1] }) => (
  <div style={{
    position: 'absolute', left: '50%', top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 980,
    display: 'flex', flexDirection: 'column', gap: 14,
    fontFamily: oo.sans,
  }}>
    {/* Top tier: OutcomeOps */}
    <div style={{
      opacity: tierOp[2], transform: `translateY(${(1 - tierOp[2]) * 8}px)`,
      padding: '20px 26px',
      background: `linear-gradient(180deg, ${oo.accent}1f, ${oo.accent}0c)`,
      border: `1.5px solid ${oo.accent}`,
      borderRadius: 12,
      display: 'flex', alignItems: 'center', gap: 18,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        overflow: 'hidden', background: '#fff', position: 'relative',
        flexShrink: 0,
      }}>
        <img src="outcomeops_mark.png" alt="" style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%', height: '120%', objectFit: 'cover', display: 'block',
        }}/>
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: oo.text,
                      letterSpacing: '-0.015em' }}>OutcomeOps</div>
        <div style={{ fontFamily: oo.mono, fontSize: 12, fontWeight: 600,
                      color: oo.accent, letterSpacing: '0.1em',
                      textTransform: 'uppercase', marginTop: 2 }}>
          the substrate the synthesis runs against
        </div>
      </div>
    </div>
    {/* Middle tier: Bedrock */}
    <div style={{
      opacity: tierOp[1], transform: `translateY(${(1 - tierOp[1]) * 8}px)`,
      padding: '20px 26px',
      background: oo.surface, border: `1.5px solid ${oo.aws}88`,
      borderRadius: 12,
      display: 'flex', alignItems: 'center', gap: 18,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: `${oo.aws}22`, border: `1px solid ${oo.aws}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: oo.mono, fontSize: 22, fontWeight: 800, color: oo.aws,
        flexShrink: 0,
      }}>a</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: oo.text,
                      letterSpacing: '-0.015em' }}>AWS Bedrock</div>
        <div style={{ fontFamily: oo.mono, fontSize: 12, fontWeight: 600,
                      color: oo.aws, letterSpacing: '0.1em',
                      textTransform: 'uppercase', marginTop: 2 }}>
          20+ frontier model families
        </div>
      </div>
    </div>
    {/* Bottom tier: customer's AWS account envelope */}
    <div style={{
      opacity: tierOp[0], transform: `translateY(${(1 - tierOp[0]) * 8}px)`,
      padding: '20px 26px',
      background: 'rgba(34,211,238,0.04)',
      border: `2px dashed ${oo.accent}77`,
      borderRadius: 12,
      display: 'flex', alignItems: 'center', gap: 18,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: 'rgba(90,169,255,0.12)',
        border: `1px solid ${oo.accent}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={oo.accent}
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: oo.text,
                      letterSpacing: '-0.015em' }}>Your AWS Account</div>
        <div style={{ fontFamily: oo.mono, fontSize: 12, fontWeight: 600,
                      color: oo.accent, letterSpacing: '0.1em',
                      textTransform: 'uppercase', marginTop: 2 }}>
          one trust boundary -- nothing crosses out
        </div>
      </div>
    </div>
  </div>
);

// Export everything that scene.jsx needs.
Object.assign(window, {
  oo, VENDOR, MODEL_GRID,
  SceneLabel, Chip, Dot, StageBackdrop, BrandMark,
  HeadlineCard,
  BedrockHeader, ModelBadge, BedrockShelf,
  Firework, FireworksLayer, CelebrationCard, CelebrationCaption,
  EditorialHero,
  QueryBubble, AnswerPanel, TfvarsTriPanel,
  ContrastColumn,
  BetterTogetherStack,
});
