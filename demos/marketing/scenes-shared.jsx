// Shared visual primitives for OutcomeOps marketing videos
// Palette + type system + reusable frame bits.

const OO_COLORS = {
  bg:       '#050910',
  bgPanel:  '#0a111d',
  ink:      '#f4f6fb',
  inkDim:   '#8a97ad',
  inkMute:  '#4d5a70',
  rule:     'rgba(255,255,255,0.08)',
  ruleSoft: 'rgba(255,255,255,0.04)',
  cyan:     '#22d3ee',
  cyanDim:  '#0891b2',
  red:      '#f87171',
  amber:    '#fbbf24',
  green:    '#34d399',
};

const OO_TYPE = {
  sans: "'Inter', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

// Corner crosshair marks — editorial frame device
function CornerMarks({ color = 'rgba(255,255,255,0.14)', inset = 48, size = 16 }) {
  const arms = (x, y, corner) => {
    const h = corner.includes('r') ? { right: 0 } : { left: 0 };
    const v = corner.includes('b') ? { bottom: 0 } : { top: 0 };
    return (
      <div style={{ position: 'absolute', width: size, height: size, left: x, top: y }}>
        <div style={{ position: 'absolute', width: size, height: 1, background: color, ...h, ...(corner.includes('b') ? { bottom: 0 } : { top: 0 }) }}/>
        <div style={{ position: 'absolute', width: 1, height: size, background: color, ...v, ...(corner.includes('r') ? { right: 0 } : { left: 0 }) }}/>
      </div>
    );
  };
  return (
    <>
      {arms(inset, inset, 'tl')}
      {arms(`calc(100% - ${inset + size}px)`, inset, 'tr')}
      {arms(inset, `calc(100% - ${inset + size}px)`, 'bl')}
      {arms(`calc(100% - ${inset + size}px)`, `calc(100% - ${inset + size}px)`, 'br')}
    </>
  );
}

// Timecode / file-index readout in the top bar
function FrameChrome({ label, index, total, color = OO_COLORS.inkDim }) {
  const { time } = useTimeline();
  const mono = OO_TYPE.mono;
  const fmt = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    const f = Math.floor((t * 24) % 24);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(f).padStart(2,'0')}`;
  };
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      fontFamily: mono, fontSize: 12, color,
      letterSpacing: '0.12em', textTransform: 'uppercase',
    }}>
      <div style={{ position: 'absolute', top: 32, left: 48, display: 'flex', gap: 20 }}>
        <span style={{ color: OO_COLORS.cyan }}>● REC</span>
        <span>OUTCOMEOPS / {label}</span>
      </div>
      <div style={{ position: 'absolute', top: 32, right: 48, display: 'flex', gap: 20, fontVariantNumeric: 'tabular-nums' }}>
        <span>{fmt(time)}</span>
        <span>SC {String(index).padStart(2,'0')}/{String(total).padStart(2,'0')}</span>
      </div>
      <div style={{ position: 'absolute', bottom: 32, left: 48, letterSpacing: '0.18em' }}>
        OUTCOMEOPS.AI
      </div>
      <div style={{ position: 'absolute', bottom: 32, right: 48, letterSpacing: '0.18em' }}>
        F500 / REGULATED
      </div>
    </div>
  );
}

// Grid overlay — very subtle
function GridBG({ opacity = 0.04, cell = 80, color = '#22d3ee' }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, opacity,
      backgroundImage: `
        linear-gradient(${color} 1px, transparent 1px),
        linear-gradient(90deg, ${color} 1px, transparent 1px)
      `,
      backgroundSize: `${cell}px ${cell}px`,
      pointerEvents: 'none',
    }}/>
  );
}

// Thin horizontal scan line that sweeps down — adds motion even in held frames
function Scanline({ color = 'rgba(34,211,238,0.22)', period = 6 }) {
  const t = useTime();
  const y = ((t % period) / period) * 100;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: `${y}%`,
      height: 1, background: color, pointerEvents: 'none',
      boxShadow: `0 0 18px ${color}`,
    }}/>
  );
}

// "Section marker" big slab type — used for Scene titles
function SectionNumber({ n, label, x, y }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: OO_TYPE.mono, color: OO_COLORS.inkDim, fontSize: 14, letterSpacing: '0.2em' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
        <span style={{ color: OO_COLORS.cyan }}>{n}</span>
        <span style={{ width: 40, height: 1, background: OO_COLORS.rule, alignSelf: 'center' }}/>
        <span>{label}</span>
      </div>
    </div>
  );
}

// Animated typed-text for code/monospace reveals
function TypedLine({ text, x, y, size = 16, color = OO_COLORS.ink, delay = 0, speed = 40, prefix = '' }) {
  const { localTime } = useSprite();
  const t = Math.max(0, localTime - delay);
  const chars = Math.min(text.length, Math.floor(t * speed));
  const shown = text.slice(0, chars);
  const showCaret = chars < text.length;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      fontFamily: OO_TYPE.mono, fontSize: size, color,
      whiteSpace: 'pre',
    }}>
      {prefix && <span style={{ color: OO_COLORS.inkMute }}>{prefix}</span>}
      {shown}
      {showCaret && <span style={{ color: OO_COLORS.cyan }}>▌</span>}
    </div>
  );
}

Object.assign(window, { OO_COLORS, OO_TYPE, CornerMarks, FrameChrome, GridBG, Scanline, SectionNumber, TypedLine });
