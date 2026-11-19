// OutcomeOps — Multi-voice debate: CISO skeptic vs. OutcomeOps.
// Visuals-only pass (placeholder MARKS). Retime to the assembled 2-voice
// audio after sign-off (each start time comes from the per-line synth).

const C = {
  bg:'#F4EFE7', ink:'#14110E', ink2:'#2A2520', muted:'#6B6358',
  rule:'#D9CFBF', ruleSoft:'#E5DCCB',
  accent:'oklch(0.50 0.14 255)',            // OutcomeOps blue
  skeptic:'oklch(0.55 0.13 33)',            // terracotta — the CISO
};
const F = {
  serif:"'Instrument Serif', Georgia, serif",
  mono:"'JetBrains Mono', ui-monospace, monospace",
  sans:"'Geist', system-ui, sans-serif",
};
const c01 = (x)=> x<0?0:x>1?1:x;
const fade = (t,a,b,cc,d)=>{ if(t<a)return 0; if(t<b)return c01((t-a)/(b-a)); if(t<cc)return 1; if(t<d)return c01(1-(t-cc)/(d-cc)); return 0; };
const rise = (op,px)=>`translateY(${(1-op)*px}px)`;

const EXCHANGES = [
  { o:"Your AI writes code that doesn’t match our standards. We’d spend more time fixing it than writing it.",
    a:"It generates against your own architecture decisions — and every pull request is checked against them before anyone reviews it." },
  { o:"We can’t send our source code to a third-party model. That’s a non-starter.",
    a:"You don’t. It runs on Bedrock, inside your own cloud. The code never leaves your account." },
  { o:"And when it’s wrong — who’s accountable? Who audits the machine?",
    a:"Every answer cites the standard it’s grounded in. That’s an audit trail — not a promise." },
  { o:"…so it was never really about the model.",
    a:"It never was. Keep your tools. The layer you’re missing is your organization’s knowledge — made queryable." },
];
const TAG = "The organizational intelligence layer every team can query.";

// Placeholder marks (seconds): [objectionStart, answerStart] per exchange.
// Real values come from the assembled audio; keep the SHAPE, swap the numbers.
const MARKS = [[3.0, 9.12], [16.53, 21.0], [27.16, 31.22], [37.54, 40.21]];
const TITLE_OUT = 2.8;
const END_IN = 47.89;      // endcard = CTA start
const TOTAL = 54.09;

function Labels({ op }) {
  const dot = (col)=>({ width:9,height:9,borderRadius:'50%',background:col,display:'inline-block' });
  const lab = { fontFamily:F.mono, fontSize:16, letterSpacing:'0.16em', textTransform:'uppercase', color:C.muted, display:'inline-flex', alignItems:'center', gap:10 };
  return (
    <div style={{ position:'absolute', top:'12%', left:120, right:120, display:'flex', justifyContent:'space-between', opacity:op }}>
      <span style={lab}><span style={dot(C.skeptic)} />CISO</span>
      <span style={lab}>OutcomeOps<span style={dot(C.accent)} /></span>
    </div>
  );
}

function Exchange({ t, ex, oMark, aMark, visEnd }) {
  const vis = fade(t, oMark-0.4, oMark+0.4, visEnd-0.5, visEnd+0.1);
  if (vis <= 0) return null;
  const oOp = fade(t, oMark, oMark+0.6, visEnd-0.5, visEnd+0.1);
  const aOp = fade(t, aMark, aMark+0.6, visEnd-0.5, visEnd+0.1);
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', gap:54, padding:'0 150px', opacity:vis }}>
      {/* CISO objection — left, ink */}
      <div style={{ opacity:oOp, transform:rise(oOp,10), maxWidth:1200 }}>
        <div style={{ fontFamily:F.mono, fontSize:14, letterSpacing:'0.14em', textTransform:'uppercase', color:C.skeptic, marginBottom:12 }}>CISO</div>
        <div style={{ fontFamily:F.serif, fontSize:52, lineHeight:1.16, color:C.ink }}>{ex.o}</div>
      </div>
      {/* OutcomeOps answer — right, accent */}
      <div style={{ opacity:aOp, transform:rise(aOp,10), maxWidth:1200, marginLeft:'auto', textAlign:'right' }}>
        <div style={{ fontFamily:F.mono, fontSize:14, letterSpacing:'0.14em', textTransform:'uppercase', color:C.accent, marginBottom:12 }}>OutcomeOps</div>
        <div style={{ fontFamily:F.serif, fontSize:52, lineHeight:1.16, color:C.accent, fontStyle:'italic' }}>{ex.a}</div>
      </div>
    </div>
  );
}

function TitleCard({ t }) {
  const op = fade(t, 0.4, 1.1, TITLE_OUT-0.4, TITLE_OUT+0.2);
  if (op<=0) return null;
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:op }}>
      <div style={{ fontFamily:F.mono, fontSize:16, letterSpacing:'0.2em', textTransform:'uppercase', color:C.muted, marginBottom:20 }}>The regulated-org debate</div>
      <div style={{ fontFamily:F.serif, fontSize:96, color:C.ink, letterSpacing:'-0.01em' }}>Three objections. <span style={{ fontStyle:'italic', color:C.accent }}>One answer.</span></div>
    </div>
  );
}

function EndCard({ t }) {
  const op = fade(t, END_IN, END_IN+0.8, TOTAL-0.5, TOTAL-0.1);
  if (op<=0) return null;
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:op }}>
      <div style={{ display:'inline-flex', alignItems:'center', gap:16, transform:rise(op,10) }}>
        <img src="outcomeops-mark.png" alt="" style={{ height:58, width:'auto' }} />
        <span style={{ fontFamily:F.serif, fontStyle:'italic', fontSize:60, color:C.ink }}>Outcome<span style={{ color:C.accent }}>Ops</span></span>
      </div>
      <div style={{ marginTop:24, fontFamily:F.serif, fontSize:30, color:C.ink2, maxWidth:940, textAlign:'center' }}>{TAG}</div>
      <div style={{ marginTop:14, fontFamily:F.mono, fontSize:18, letterSpacing:'0.1em', color:C.accent }}>outcomeops.ai</div>
    </div>
  );
}

function DebateScene() {
  const t = useTime();
  const app = c01(t/0.7);
  const labelsOp = fade(t, MARKS[0][0]-0.6, MARKS[0][0]+0.2, END_IN-0.6, END_IN);
  const ends = MARKS.map((m,i)=> i<MARKS.length-1 ? MARKS[i+1][0] : END_IN );
  return (
    <div style={{ position:'absolute', inset:0, background:C.bg, opacity:app, fontFamily:F.sans }}>
      <Labels op={labelsOp} />
      <TitleCard t={t} />
      {EXCHANGES.map((ex,i)=> (
        <Exchange key={i} t={t} ex={ex} oMark={MARKS[i][0]} aMark={MARKS[i][1]} visEnd={ends[i]} />
      ))}
      <EndCard t={t} />
    </div>
  );
}

function AudioTrack({ src }) {
  const { time, playing } = useTimeline();
  const ref = React.useRef(null);
  React.useEffect(()=>{ const a=ref.current; if(!a)return; if(playing)a.play().catch(()=>{}); else a.pause(); },[playing]);
  React.useEffect(()=>{ const a=ref.current; if(!a)return; if(Math.abs(a.currentTime-time)>0.25){ try{a.currentTime=time;}catch(e){} } },[time]);
  return <audio ref={ref} src={src} preload="auto" style={{ display:'none' }} />;
}
