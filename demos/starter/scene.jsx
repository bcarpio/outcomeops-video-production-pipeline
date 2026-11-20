// scene.jsx: a minimal, product-neutral scene to copy.
//
// Every visual is a pure function of t (seconds), read with useTime(). Nothing
// keeps its own state, so the frame at any given second is always the same.
//
// 1. Write narration.txt with [[B0]]..[[Bn]] markers.
// 2. python scripts/synth.py demos/<name>/narration.txt
// 3. Paste the BEATS it prints over the placeholder below, and set duration in index.html.

// Placeholder beat times (seconds). scripts/synth.py prints the real ones.
const BEATS = {
  "B0": 0.00,
  "B1": 4.20,
  "B2": 9.60,
  "B3": 14.80,
};

// Palette. When this scene imitates your product's UI, take these values from
// the product's own styles (its Tailwind classes, CSS variables or theme), and
// note the source file here. Never invent them.
const C = {
  bg: '#f8fafc', card: '#ffffff', ink: '#0f172a', muted: '#64748b',
  rule: '#e2e8f0', accent: '#2563eb', accentBg: '#eff6ff', ok: '#16a34a',
};
const F = { sans: "'Inter', system-ui, sans-serif", mono: "'JetBrains Mono', ui-monospace, monospace" };

const QUESTION = 'Which services still call the legacy billing API?';
const ROWS = [
  'invoice-service: 3 call sites, src/billing/client.ts',
  'reports-job: 1 call site, jobs/monthly.py',
  'Covered by the billing migration decision record, ADR-014',
];

// Small time helpers: fade in over [a,b], hold, fade out over [c,d].
const c01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const fade = (t, a, b, c = Infinity, d = Infinity) =>
  t < a ? 0 : t < b ? c01((t - a) / (b - a)) : t < c ? 1 : t < d ? c01(1 - (t - c) / (d - c)) : 0;
const typed = (text, a, b, t) => text.slice(0, Math.floor(c01((t - a) / (b - a)) * text.length));
const rise = (op, px = 10) => `translateY(${(1 - op) * px}px)`;

function Title({ t }) {
  const op = fade(t, BEATS.B0, BEATS.B0 + 0.8, BEATS.B1 - 0.6, BEATS.B1);
  if (op <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontSize: 64, fontWeight: 700, color: C.ink, letterSpacing: '-0.02em', transform: rise(op, 14) }}>
        Every demo starts with a question.
      </div>
    </div>
  );
}

function AskAndAnswer({ t }) {
  const op = fade(t, BEATS.B1, BEATS.B1 + 0.6, BEATS.B3 - 0.6, BEATS.B3);
  if (op <= 0) return null;
  const q = typed(QUESTION, BEATS.B1 + 0.8, BEATS.B1 + 3.2, t);
  const answerOp = fade(t, BEATS.B2, BEATS.B2 + 0.6);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, opacity: op }}>
      <div style={{ width: 1100, background: C.card, border: `1.5px solid ${C.rule}`, borderRadius: 14, padding: '22px 26px', fontSize: 26, color: C.ink, boxShadow: '0 2px 14px rgba(15,23,42,0.06)' }}>
        {q}<span style={{ color: C.accent, opacity: Math.floor(t * 2) % 2 ? 1 : 0 }}>|</span>
      </div>
      <div style={{ width: 1100, background: C.card, border: `1.5px solid ${C.rule}`, borderRadius: 12, padding: '28px 30px', minHeight: 170, opacity: answerOp, transform: rise(answerOp) }}>
        {ROWS.map((row, i) => {
          const rowOp = fade(t, BEATS.B2 + 0.8 + i * 0.9, BEATS.B2 + 1.4 + i * 0.9);
          return (
            <div key={row} style={{ display: 'flex', gap: 12, fontFamily: F.mono, fontSize: 20, color: C.ink, margin: '8px 0', opacity: rowOp, transform: rise(rowOp, 6) }}>
              <span style={{ color: C.ok }}>&#10003;</span>{row}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EndCard({ t }) {
  const op = fade(t, BEATS.B3, BEATS.B3 + 0.8);
  if (op <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: op }}>
      <div style={{ fontSize: 56, fontWeight: 700, color: C.ink, transform: rise(op, 12) }}>Your product here.</div>
      <div style={{ marginTop: 18, fontFamily: F.mono, fontSize: 20, color: C.accent }}>edit scene.jsx, then re-render</div>
    </div>
  );
}

function StarterScene() {
  const t = useTime();
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: F.sans }}>
      <Title t={t} />
      <AskAndAnswer t={t} />
      <EndCard t={t} />
    </div>
  );
}

// Plays narration.mp3 in sync with the Stage clock (seeks if it drifts).
function AudioTrack({ src }) {
  const { time, playing } = useTimeline();
  const ref = React.useRef(null);
  React.useEffect(() => { const a = ref.current; if (!a) return; if (playing) a.play().catch(() => {}); else a.pause(); }, [playing]);
  React.useEffect(() => { const a = ref.current; if (!a) return; if (Math.abs(a.currentTime - time) > 0.25) { try { a.currentTime = time; } catch (e) {} } }, [time]);
  return <audio ref={ref} src={src} preload="auto" style={{ display: 'none' }} />;
}
