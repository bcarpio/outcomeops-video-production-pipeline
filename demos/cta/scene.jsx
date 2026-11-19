// scene.jsx — Shared 7-second CTA card used at the tail of each main video.
//
// Variant-aware: reads window.__CTA_VARIANT__ (set by index.html from the
// ?variant= URL param) and picks tagline + voice-over audio accordingly.
// Visually identical across variants — only words and voice change.
//
// Stitching: export_demo.py records this to a standalone MP4 per variant;
// ffmpeg concat appends it to the corresponding main video.

const CTA_DUR = 7;

const VARIANTS = {
  analytics: {
    line1: 'Ask your codebase anything.',
    line2: 'Grounded answers, not guesses.',
    audio: 'narration-analytics.mp3',
  },
  cve: {
    line1: 'Portfolio-wide answers.',
    line2: 'Ship the patch plan Friday, not Monday.',
    audio: 'narration-cve.mp3',
  },
  jira: {
    line1: 'Design outcomes.',
    line2: 'Ship standards-compliant code.',
    audio: 'narration-jira.mp3',
  },
};

// OutcomeOps palette (cool-dark to match the jira-to-pr hero treatment)
const oo = {
  bg:         '#0A1020',
  text:       '#E6EBF5',
  textDim:    '#8B95AC',
  textFaint:  '#5A6680',
  accent:     '#00D9A3',
  accentAlt:  '#5BC0E8',
  purple:     '#8B7FE8',
  border:     'rgba(255,255,255,0.08)',
};

// ── Audio sync ─────────────────────────────────────────────────────────────
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

// ── Backdrop — soft grid + radial glow ─────────────────────────────────────
function Backdrop() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: oo.bg,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(1200px 700px at 50% 55%, rgba(91,192,232,0.08), transparent 60%),
          radial-gradient(900px 600px at 50% 100%, rgba(139,127,232,0.08), transparent 60%)
        `,
      }}/>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.25,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}/>
    </div>
  );
}

// ── Main scene ─────────────────────────────────────────────────────────────
function CTAScene() {
  const t = useTime();

  const variantKey = (typeof window !== 'undefined' && window.__CTA_VARIANT__) || 'analytics';
  const variant = VARIANTS[variantKey] || VARIANTS.analytics;

  const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
  const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);

  // Fade schedule — simple, no overthinking
  const brand     = easeOut((t - 0.3) / 0.9);          // 0.3–1.2s
  const line1     = easeOut((t - 1.1) / 1.0);          // 1.1–2.1s
  const line2     = easeOut((t - 1.9) / 1.0);          // 1.9–2.9s
  const urlFade   = easeOut((t - 3.0) / 1.0);          // 3.0–4.0s
  const finalFade = t > 6.5 ? clamp01(1 - (t - 6.5) / 0.5) : 1;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: oo.text,
      fontFamily: 'Inter, system-ui, sans-serif',
      opacity: finalFade,
      gap: 0,
    }}>
      <Backdrop/>

      {/* Brand */}
      <div style={{
        position: 'relative',
        opacity: brand,
        transform: `translateY(${(1 - brand) * 14}px)`,
        display: 'flex', alignItems: 'center', gap: 14,
        marginBottom: 36,
      }}>
        <img src="outcomeops_mark.png" alt="OutcomeOps" style={{
          width: 56, height: 56, display: 'block',
        }}/>
        <div style={{
          fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em',
        }}>
          <span>Outcome</span>
          <span style={{ color: oo.accentAlt }}>Ops</span>
        </div>
      </div>

      {/* Line 1 — the headline */}
      <div style={{
        position: 'relative',
        opacity: line1,
        transform: `translateY(${(1 - line1) * 16}px)`,
        fontSize: 64, fontWeight: 700, letterSpacing: '-0.035em',
        lineHeight: 1.05, textAlign: 'center',
        maxWidth: 1400,
        marginBottom: 14,
      }}>
        {variant.line1}
      </div>

      {/* Line 2 — supporting, muted */}
      <div style={{
        position: 'relative',
        opacity: line2,
        transform: `translateY(${(1 - line2) * 12}px)`,
        fontSize: 28, fontWeight: 400, letterSpacing: '-0.005em',
        lineHeight: 1.35, textAlign: 'center',
        color: oo.textDim,
        maxWidth: 1100,
        marginBottom: 52,
      }}>
        {variant.line2}
      </div>

      {/* URL with gradient accent */}
      <div style={{
        position: 'relative',
        opacity: urlFade,
        transform: `translateY(${(1 - urlFade) * 8}px)`,
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 32, fontWeight: 600,
        letterSpacing: '0.01em',
      }}>
        <span style={{
          background: `linear-gradient(90deg, ${oo.accent}, ${oo.accentAlt}, ${oo.purple})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          outcomeops.ai
        </span>
      </div>

      <AudioTrack src={variant.audio}/>
    </div>
  );
}

Object.assign(window, { CTAScene, AudioTrack, CTA_DUR, VARIANTS });
