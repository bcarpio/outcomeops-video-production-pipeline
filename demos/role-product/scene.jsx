const CONTENT = {"persona": "Product owner", "question": "What can our billing feature already do — and what’s missing?", "oldway": "The old way — pull an engineer into the code, or trust a stale PRD.", "verdict": "Billing supports plans, proration, and refunds — but not dunning.", "l1": "shipped: subscribe, change-plan, prorate, refund", "l2": "gap: failed-payment retries (dunning) not implemented", "cite": "Drafted · 4 stories from the gaps", "outLead": "The backlog writes itself —", "outAccent": "from what you’ve actually shipped.", "tag": "The organizational intelligence layer every team can query.", "narr": 21.68};

const C = { bg:'#F4EFE7', ink:'#14110E', ink2:'#2A2520', muted:'#6B6358', rule:'#D9CFBF',
  accent:'oklch(0.50 0.14 255)', accentBg:'oklch(0.95 0.03 255)', green:'oklch(0.55 0.08 150)' };
const F = { serif:"'Instrument Serif', Georgia, serif", mono:"'JetBrains Mono', ui-monospace, monospace", sans:"'Geist', system-ui, sans-serif" };
const c01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const fade = (t, a, b, cc, d) => { if (t < a) return 0; if (t < b) return c01((t-a)/(b-a)); if (t < cc) return 1; if (t < d) return c01(1-(t-cc)/(d-cc)); return 0; };
const type = (full, a, b, t) => { if (t < a) return ''; if (t >= b) return full; const p=(t-a)/(b-a); const e=1-Math.pow(1-p,1.6); return full.slice(0, Math.floor(e*full.length)); };
const rise = (op, px) => `translateY(${(1 - op) * px}px)`;

const NARR = CONTENT.narr;
const AOUT = Math.max(NARR - 4.8, 16.8);   // answer fades as the outcome line arrives
const AF = AOUT + 0.8;

function Persona({ op }) {
  return (<div style={{ position:'absolute', top:'15%', left:0, right:0, textAlign:'center', opacity:op, transform:rise(op,-8) }}>
    <span style={{ fontFamily:F.mono, fontSize:17, letterSpacing:'0.18em', textTransform:'uppercase', color:C.muted, display:'inline-flex', alignItems:'center', gap:11 }}>
      <span style={{ width:9, height:9, borderRadius:'50%', background:C.accent, display:'inline-block' }} />{CONTENT.persona}
    </span></div>);
}
function CenterBox({ children, op }) {
  return (<div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 130px', opacity:op, pointerEvents:'none' }}>{children}</div>);
}
function PhaseQuestion({ t }) {
  const op = fade(t, 0.4, 1.2, 7.7, 8.4);
  if (op <= 0) return null;
  const q = type(CONTENT.question, 1.5, 4.6, t);
  const caret = t > 1.5 && t < 4.9 && Math.floor(t*2)%2===0;
  const oldOp = fade(t, 4.6, 5.3, 6.9, 7.6);
  return (<CenterBox op={op}>
    <div style={{ fontFamily:F.serif, fontSize:58, lineHeight:1.14, color:C.ink, maxWidth:1180, textAlign:'center', letterSpacing:'-0.01em' }}>{q}<span style={{ opacity:caret?1:0, color:C.accent }}>|</span></div>
    <div style={{ marginTop:34, fontFamily:F.sans, fontSize:23, color:C.muted, maxWidth:940, textAlign:'center', opacity:oldOp, transform:rise(oldOp,10) }}>{CONTENT.oldway}</div>
  </CenterBox>);
}
function AskBar({ t }) {
  const bq = type(CONTENT.question, 9.1, 10.6, t);
  return (<div style={{ display:'flex', alignItems:'center', gap:16, width:1020, maxWidth:'84%', background:'#fff', border:`1.5px solid ${C.rule}`, borderRadius:14, padding:'18px 22px', boxShadow:'0 2px 14px rgba(20,17,14,0.06)' }}>
    <img src="outcomeops-mark.png" alt="" style={{ height:26, width:'auto' }} />
    <div style={{ fontFamily:F.sans, fontSize:22, color:C.ink2, flex:1 }}>{bq}</div>
    <span style={{ fontFamily:F.mono, fontSize:13, letterSpacing:'0.1em', textTransform:'uppercase', color:'#fff', background:C.accent, borderRadius:8, padding:'8px 14px' }}>Ask</span>
  </div>);
}
function Row({ text, op }) {
  return (<div style={{ display:'flex', alignItems:'baseline', gap:12, opacity:op, transform:rise(op,8) }}>
    <span style={{ color:C.green, fontSize:18, fontFamily:F.mono }}>&#10003;</span>
    <span style={{ fontFamily:F.mono, fontSize:19, color:C.ink2, letterSpacing:'0.01em' }}>{text}</span>
  </div>);
}
function PhaseAnswer({ t }) {
  const op = fade(t, 8.9, 9.7, AOUT, AF);
  if (op <= 0) return null;
  const thinking = t >= 10.6 && t < 11.4;
  const vOp = fade(t, 11.4, 12.0, AOUT, AF);
  const l1 = fade(t, 12.8, 13.4, AOUT, AF);
  const l2 = fade(t, 13.9, 14.5, AOUT, AF);
  const cOp = fade(t, 15.4, 16.1, AOUT, AF);
  return (<div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:26, padding:'0 120px', opacity:op }}>
    <AskBar t={t} />
    <div style={{ width:1020, maxWidth:'84%', background:'rgba(255,255,255,0.6)', border:`1.5px solid ${C.rule}`, borderRadius:12, padding:'30px 34px', minHeight:196 }}>
      {thinking ? (<div style={{ fontFamily:F.mono, fontSize:15, letterSpacing:'0.12em', textTransform:'uppercase', color:C.muted }}>searching your code + standards&#8230;</div>)
      : (<div>
        <div style={{ fontFamily:F.serif, fontSize:38, lineHeight:1.12, color:C.ink, opacity:vOp, transform:rise(vOp,8) }}><span style={{ color:C.accent, fontStyle:'italic' }}>{CONTENT.verdict}</span></div>
        <div style={{ marginTop:18, display:'flex', flexDirection:'column', gap:10 }}><Row text={CONTENT.l1} op={l1} /><Row text={CONTENT.l2} op={l2} /></div>
        <div style={{ marginTop:20, opacity:cOp, transform:rise(cOp,8) }}><span style={{ fontFamily:F.mono, fontSize:14, letterSpacing:'0.06em', textTransform:'uppercase', color:C.accent, background:C.accentBg, border:`1px solid ${C.accent}`, borderRadius:999, padding:'7px 14px', display:'inline-block' }}>{CONTENT.cite}</span></div>
      </div>)}
    </div>
  </div>);
}
function PhaseOutcome({ t }) {
  const op = fade(t, AOUT + 0.4, AOUT + 1.2, NARR + 0.3, NARR + 1.0);
  if (op <= 0) return null;
  return (<CenterBox op={op}>
    <div style={{ fontFamily:F.serif, fontSize:66, lineHeight:1.1, color:C.ink, maxWidth:1280, textAlign:'center', letterSpacing:'-0.01em', transform:rise(op,12) }}>{CONTENT.outLead}{' '}<span style={{ fontStyle:'italic', color:C.accent }}>{CONTENT.outAccent}</span></div>
  </CenterBox>);
}
function EndCard({ t }) {
  const ENDT = NARR + 7.68; const op = fade(t, NARR + 1.2, NARR + 2.0, ENDT - 0.5, ENDT - 0.1);
  if (op <= 0) return null;
  return (<CenterBox op={op}>
    <div style={{ display:'inline-flex', alignItems:'center', gap:16, transform:rise(op,10) }}>
      <img src="outcomeops-mark.png" alt="" style={{ height:58, width:'auto' }} />
      <span style={{ fontFamily:F.serif, fontStyle:'italic', fontSize:60, color:C.ink }}>Outcome<span style={{ color:C.accent }}>Ops</span></span>
    </div>
    <div style={{ marginTop:24, fontFamily:F.serif, fontSize:30, color:C.ink2, maxWidth:900, textAlign:'center' }}>{CONTENT.tag}</div>
    <div style={{ marginTop:14, fontFamily:F.mono, fontSize:18, letterSpacing:'0.1em', color:C.accent }}>outcomeops.ai</div>
  </CenterBox>);
}
function RoleScene() {
  const t = useTime();
  const app = c01((t - 0) / 0.7);
  const personaOp = fade(t, 0.4, 1.2, AOUT, AF);
  return (<div style={{ position:'absolute', inset:0, background:C.bg, opacity:app, fontFamily:F.sans }}>
    <Persona op={personaOp} /><PhaseQuestion t={t} /><PhaseAnswer t={t} /><PhaseOutcome t={t} /><EndCard t={t} />
  </div>);
}

function AudioTrack({ src }) {
  const { time, playing } = useTimeline();
  const ref = React.useRef(null);
  React.useEffect(() => { const a = ref.current; if (!a) return; if (playing) a.play().catch(() => {}); else a.pause(); }, [playing]);
  React.useEffect(() => { const a = ref.current; if (!a) return; if (Math.abs(a.currentTime - time) > 0.25) { try { a.currentTime = time; } catch (e) {} } }, [time]);
  return <audio ref={ref} src={src} preload="auto" style={{ display: 'none' }} />;
}
