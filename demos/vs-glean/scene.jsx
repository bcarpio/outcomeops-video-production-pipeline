// OutcomeOps vs Glean — split-screen Q&A.
// "Search finds it. OutcomeOps ships it."
// Visuals-only pass. Left column stays category-level ("ENTERPRISE SEARCH");
// Glean is named only in the title card + the exported description.
// Retime the beat windows to the assembled Drew narration after sign-off.

const C = {
  bg:'#F4EFE7', ink:'#14110E', ink2:'#2A2520', muted:'#6B6358',
  rule:'#D9CFBF', ruleSoft:'#E5DCCB', panel:'#EFE8DC',
  accent:'oklch(0.50 0.14 255)',            // OutcomeOps blue
  accentSoft:'oklch(0.50 0.14 255 / 0.10)',
  neg:'oklch(0.52 0.13 33)',                // terracotta — the "non-starter"
};
const F = {
  serif:"'Instrument Serif', Georgia, serif",
  mono:"'JetBrains Mono', ui-monospace, monospace",
  sans:"'Geist', system-ui, sans-serif",
};
const c01 = (x)=> x<0?0:x>1?1:x;
const fade = (t,a,b,cc,d)=>{ if(t<a)return 0; if(t<b)return c01((t-a)/(b-a)); if(t<cc)return 1; if(t<d)return c01(1-(t-cc)/(d-cc)); return 0; };
const rise = (op,px)=>`translateY(${(1-op)*px}px)`;

// ---- Beat windows (retimed to Drew narration, narration.marks.json) ------
const TITLE_OUT = 7.13;
const FRAME_IN  = 7.53;     // split frame appears
const BEATS = [
  { s:7.73,  e:26.82 },     // B1 Retrieve vs Act
  { s:26.82, e:43.26 },     // B2 Code depth vs wikis
  { s:43.26, e:57.99 },     // B3 Your cloud vs theirs
  { s:57.99, e:67.4 },      // B4 Governed + auditable
];
const FRAME_OUT   = 67.4;
const REFRAME_IN  = 67.4;
const CTA_IN      = 75.12;
const TOTAL       = 81.83;

// ---- Content ------------------------------------------------------------
const Q = [
  "Is our payment service still meeting PCI?",
  "Where does this app break our architecture patterns?",
  "Now do it on code that can't leave the building.",
  "Prove it.",
];
const LEFT = [
  { rows:["PCI-DSS Policy   ·  Confluence","#payments-security   ·  MS Teams","soc2-audit-2025.pdf","Tokenization RFC   ·  SharePoint"],
    verdict:"Policy says: compliant", cap:"Surfaces what people wrote about PCI." },
  { rows:["System Design   ·  SharePoint","ADR-031   ·  Confluence","#arch-review   ·  MS Teams"],
    cap:"Finds what was discussed." },
  { rows:["Your source indexed in the vendor's cloud."], verdict:"Regulated: non-starter", verdictNeg:true },
  { rows:["A confidence score."] },
];
const RIGHT = [
  { steps:["Ingested the same PCI policy","Read the payment service code — it disagrees","Tokenization drift in charge_handler. Code wins."], pill:"opened PR #1284", cap:"Same corpus as search, plus the code. Code wins." },
  { steps:["Walks the code-maps and code knowledge graph","Names the files that deviate: src/ingest/*","They bypass the payment gateway"], cap:"Reasons over the running code." },
  { steps:["Deployed in your own cloud.","The code never leaves your account."], verdict:"Runs in your account", cap:null },
  { steps:["Every answer cites the standard it's grounded in."], verdict:"Audit trail, not a promise" },
];

// ---- Title --------------------------------------------------------------
function TitleCard({ t }) {
  const op = fade(t, 0.3, 1.1, TITLE_OUT-0.5, TITLE_OUT+0.2);
  if (op<=0) return null;
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:op }}>
      <div style={{ fontFamily:F.mono, fontSize:15, letterSpacing:'0.22em', textTransform:'uppercase', color:C.muted, marginBottom:22 }}>OutcomeOps vs. Glean</div>
      <div style={{ fontFamily:F.serif, fontSize:92, lineHeight:1.06, color:C.ink, textAlign:'center', letterSpacing:'-0.01em' }}>
        Search finds it.<br/><span style={{ fontStyle:'italic', color:C.accent }}>OutcomeOps ships it.</span>
      </div>
    </div>
  );
}

// ---- Persistent split frame --------------------------------------------
function SplitFrame({ op }) {
  if (op<=0) return null;
  const lab = { fontFamily:F.mono, fontSize:15, letterSpacing:'0.16em', textTransform:'uppercase' };
  return (
    <div style={{ position:'absolute', inset:0, opacity:op, pointerEvents:'none' }}>
      <div style={{ position:'absolute', top:250, bottom:120, left:800, width:1, background:C.rule }} />
      <div style={{ position:'absolute', top:212, left:80, ...lab, color:C.muted }}>Enterprise Search</div>
      <div style={{ position:'absolute', top:212, right:80, ...lab, color:C.accent, display:'flex', alignItems:'center', gap:9 }}>
        OutcomeOps<span style={{ width:8, height:8, borderRadius:'50%', background:C.accent, display:'inline-block' }} />
      </div>
      {/* Persistent ingest strip — one corpus: the code, and the docs */}
      <div style={{ position:'absolute', top:706, right:80, width:660, display:'flex', flexDirection:'column', gap:9 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
          <span style={{ fontFamily:F.mono, fontSize:12, letterSpacing:'0.18em', textTransform:'uppercase', color:C.accent, flex:'0 0 auto' }}>Code</span>
          <span style={{ fontFamily:F.mono, fontSize:13, color:C.ink2 }}>Code-maps · Symbol-graphs</span>
        </div>
        <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
          <span style={{ fontFamily:F.mono, fontSize:12, letterSpacing:'0.18em', textTransform:'uppercase', color:C.muted, flex:'0 0 auto' }}>Docs</span>
          <span style={{ fontFamily:F.mono, fontSize:13, color:C.muted }}>Confluence · Jira · SharePoint · OneDrive · Teams · GitHub · Azure DevOps</span>
        </div>
        <div style={{ fontFamily:F.sans, fontSize:13, fontStyle:'italic', color:C.muted, marginTop:2 }}>One corpus: your docs, and the code itself.</div>
      </div>
    </div>
  );
}

// ---- One Q&A beat -------------------------------------------------------
function Beat({ t, i }) {
  const { s, e } = BEATS[i];
  const vis = fade(t, s-0.35, s+0.45, e-0.5, e+0.05);
  if (vis<=0) return null;
  const qOp = fade(t, s+0.15, s+0.8, e-0.5, e+0.05);
  const L = LEFT[i], R = RIGHT[i];

  const itemOp = (base, k)=> fade(t, base+k*0.32, base+k*0.32+0.55, e-0.5, e+0.05);

  return (
    <div style={{ position:'absolute', inset:0, opacity:vis }}>
      {/* Question */}
      <div style={{ position:'absolute', top:96, left:120, right:120, textAlign:'center', opacity:qOp, transform:rise(qOp,8) }}>
        <div style={{ fontFamily:F.mono, fontSize:13, letterSpacing:'0.2em', textTransform:'uppercase', color:C.muted, marginBottom:14 }}>The question</div>
        <div style={{ fontFamily:F.serif, fontSize:52, lineHeight:1.12, color:C.ink }}>{Q[i]}</div>
      </div>

      {/* Left column — enterprise search */}
      <div style={{ position:'absolute', top:270, left:80, width:660, display:'flex', flexDirection:'column', gap:14 }}>
        {L.rows.map((r,k)=> (
          <div key={k} style={{ opacity:itemOp(s+1.0,k), transform:rise(itemOp(s+1.0,k),8),
              display:'flex', alignItems:'center', gap:14, padding:'16px 20px',
              background:C.panel, border:`1px solid ${C.ruleSoft}`, borderRadius:10 }}>
            <span style={{ width:7, height:7, borderRadius:2, background:C.muted, flex:'0 0 auto', opacity:0.6 }} />
            <span style={{ fontFamily:F.mono, fontSize:18, color:C.ink2 }}>{r}</span>
          </div>
        ))}
        {L.verdict && (
          <div style={{ opacity:itemOp(s+1.0,L.rows.length), marginTop:6, fontFamily:F.mono, fontSize:16, letterSpacing:'0.04em',
              color:L.verdictNeg?C.neg:C.muted }}>{L.verdict}</div>
        )}
        {L.cap && (
          <div style={{ opacity:itemOp(s+1.0,L.rows.length), marginTop:8, fontFamily:F.sans, fontSize:17, color:C.muted, fontStyle:'italic' }}>{L.cap}</div>
        )}
      </div>

      {/* Right column — OutcomeOps */}
      <div style={{ position:'absolute', top:270, right:80, width:660, display:'flex', flexDirection:'column', gap:14 }}>
        {R.steps.map((r,k)=> (
          <div key={k} style={{ opacity:itemOp(s+2.1,k), transform:rise(itemOp(s+2.1,k),8),
              display:'flex', alignItems:'flex-start', gap:14, padding:'16px 20px',
              background:C.accentSoft, border:`1px solid ${C.accent}`, borderRadius:10 }}>
            <span style={{ fontFamily:F.mono, fontSize:15, color:C.accent, flex:'0 0 auto', marginTop:2 }}>{String(k+1).padStart(2,'0')}</span>
            <span style={{ fontFamily:F.serif, fontSize:26, lineHeight:1.25, color:C.ink }}>{r}</span>
          </div>
        ))}
        {R.pill && (
          <div style={{ opacity:itemOp(s+2.1,R.steps.length), marginTop:2, alignSelf:'flex-start',
              fontFamily:F.mono, fontSize:16, letterSpacing:'0.04em', color:'#fff', background:C.accent,
              padding:'8px 16px', borderRadius:999 }}>{R.pill}</div>
        )}
        {R.verdict && (
          <div style={{ opacity:itemOp(s+2.1,R.steps.length), marginTop:6, fontFamily:F.mono, fontSize:16, letterSpacing:'0.04em', color:C.accent }}>✓ {R.verdict}</div>
        )}
        {R.cap && (
          <div style={{ opacity:itemOp(s+2.1,R.steps.length+ (R.pill?1:0)), marginTop:8, fontFamily:F.sans, fontSize:17, color:C.ink2, fontStyle:'italic' }}>{R.cap}</div>
        )}
      </div>
    </div>
  );
}

// ---- Reframe ------------------------------------------------------------
function Reframe({ t }) {
  const op = fade(t, REFRAME_IN, REFRAME_IN+0.9, CTA_IN-0.5, CTA_IN+0.1);
  if (op<=0) return null;
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:op, padding:'0 200px' }}>
      <div style={{ fontFamily:F.serif, fontSize:46, lineHeight:1.28, color:C.ink, textAlign:'center' }}>
        Enterprise search finds what's already written.<br/>
        <span style={{ fontStyle:'italic', color:C.accent }}>OutcomeOps grounds the agents that write what's next</span> — in your standards, your cloud.
      </div>
    </div>
  );
}

// ---- CTA end card -------------------------------------------------------
function EndCard({ t }) {
  const op = fade(t, CTA_IN, CTA_IN+0.8, TOTAL-0.5, TOTAL-0.1);
  if (op<=0) return null;
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:op }}>
      <div style={{ display:'inline-flex', alignItems:'center', gap:16, transform:rise(op,10) }}>
        <img src="outcomeops-mark.png" alt="" style={{ height:58, width:'auto' }} />
        <span style={{ fontFamily:F.serif, fontStyle:'italic', fontSize:60, color:C.ink }}>Outcome<span style={{ color:C.accent }}>Ops</span></span>
      </div>
      <div style={{ marginTop:24, fontFamily:F.serif, fontSize:30, color:C.ink2, maxWidth:940, textAlign:'center' }}>The organizational intelligence layer every team can query.</div>
      <div style={{ marginTop:14, fontFamily:F.mono, fontSize:18, letterSpacing:'0.1em', color:C.accent }}>outcomeops.ai</div>
    </div>
  );
}

// ---- Audio (synced to the Stage timeline; also lets export detect mount) --
function AudioTrack({ src }) {
  const { time, playing } = useTimeline();
  const ref = React.useRef(null);
  React.useEffect(()=>{ const a=ref.current; if(!a)return; if(playing)a.play().catch(()=>{}); else a.pause(); },[playing]);
  React.useEffect(()=>{ const a=ref.current; if(!a)return; if(Math.abs(a.currentTime-time)>0.25){ try{a.currentTime=time;}catch(e){} } },[time]);
  return <audio ref={ref} src={src} preload="auto" style={{ display:'none' }} />;
}

// ---- Scene --------------------------------------------------------------
function VsGleanScene() {
  const t = useTime();
  const app = c01(t/0.7);
  const frameOp = fade(t, FRAME_IN-0.3, FRAME_IN+0.6, FRAME_OUT-0.4, FRAME_OUT+0.1);
  return (
    <div style={{ position:'absolute', inset:0, background:C.bg, opacity:app, fontFamily:F.sans }}>
      <TitleCard t={t} />
      <SplitFrame op={frameOp} />
      {BEATS.map((_,i)=> <Beat key={i} t={t} i={i} />)}
      <Reframe t={t} />
      <EndCard t={t} />
      <AudioTrack src="narration.mp3" />
    </div>
  );
}
