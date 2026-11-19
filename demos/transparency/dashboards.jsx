// Dashboard mocks for CUT-T // FULL TRANSPARENCY
// Pixel-faithful JSX recreations of the /audit and /analytics pages
// from outcome-ops-ai-assist-private/ui. Realistic backfilled data,
// no real customer info.
//
// Designed to render at 1280×720 inside the 1920×1080 Stage, with
// browser chrome around it. Light theme — the dashboards are the
// product, not the brand chrome (which stays dark behind them).

const APP_INK     = '#111827';   // gray-900
const APP_INK_DIM = '#374151';   // gray-700
const APP_INK_MUTE= '#6B7280';   // gray-500
const APP_BG      = '#F9FAFB';   // gray-50
const APP_PANEL   = '#FFFFFF';
const APP_BORDER  = '#E5E7EB';   // gray-200
const APP_RULE    = '#F3F4F6';   // gray-100
const APP_BLUE    = '#2563EB';
const APP_BLUE_50 = '#EFF6FF';
const APP_BLUE_700= '#1D4ED8';
const APP_ROSE_50 = '#FFF1F2';
const APP_ROSE_300= '#FDA4AF';
const APP_ROSE_700= '#BE123C';
const APP_ROSE_500= '#F43F5E';
const APP_AMBER_50= '#FFFBEB';
const APP_AMBER_700='#92400E';
const APP_AMBER_500='#F59E0B';
const APP_EMERALD_50='#ECFDF5';
const APP_EMERALD_700='#047857';
const APP_EMERALD_500='#10B981';
const APP_SKY_500 = '#0EA5E9';
const APP_INDIGO_50='#EEF2FF';
const APP_INDIGO_700='#4338CA';
const APP_PURPLE_500='#A855F7';
const APP_FUCHSIA_50='#FDF4FF';
const APP_FUCHSIA_700='#A21CAF';
const APP_TEAL_50 = '#F0FDFA';
const APP_TEAL_700= '#0F766E';

// ── Browser chrome wrapper ─────────────────────────────────────────────
function BrowserChrome({ url, children, width = 1480, height = 880 }) {
  return (
    <div style={{
      width, height,
      background: APP_PANEL,
      borderRadius: 10,
      boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        height: 42, background: '#F3F4F6', borderBottom: `1px solid ${APP_BORDER}`,
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#FF5F56' }}/>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#FFBD2E' }}/>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#27C93F' }}/>
        </div>
        <div style={{
          flex: 1, marginLeft: 16, height: 26, padding: '0 14px',
          background: '#FFFFFF', border: `1px solid ${APP_BORDER}`, borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: APP_INK_MUTE,
        }}>
          <span style={{ color: APP_EMERALD_500 }}>●</span>
          <span>{url}</span>
        </div>
      </div>
      <div style={{ flex: 1, background: APP_BG, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ── Lucide-style inline icons (subset) ─────────────────────────────────
function Icon({ d, size = 18, color = 'currentColor', stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={d}/>
    </svg>
  );
}
const ICON_SHIELD = "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z M12 8v4 M12 16h.01";
const ICON_BAR = "M3 3v18h18 M7 16V8 M12 16v-5 M17 16v-9";
const ICON_ACTIVITY = "M22 12h-4l-3 9L9 3l-3 9H2";
const ICON_USERS = "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75";
const ICON_ALERT = "M12 9v4 M12 17h.01 M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z";
const ICON_TRENDING = "M22 7 13.5 15.5l-5-5L2 17 M16 7h6v6";

// ── AdminNav cluster (right side of header) ────────────────────────────
function AdminNav({ active }) {
  const items = [
    { id: 'chat',   label: 'Chat' },
    { id: 'work',   label: 'Workspaces' },
    { id: 'set',    label: 'Settings' },
    { id: 'an',     label: 'Analytics' },
    { id: 'budg',   label: 'Budgets' },
    { id: 'org',    label: 'Org' },
    { id: 'audit',  label: 'Audit' },
  ];
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {items.filter(i => i.id !== active).map(i => (
        <div key={i.id} style={{
          width: 30, height: 30, borderRadius: 6,
          border: `1px solid ${APP_BORDER}`, background: APP_PANEL,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: APP_INK_MUTE, fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        }}>
          {i.label[0]}
        </div>
      ))}
    </div>
  );
}

// ── Audit data fixtures ────────────────────────────────────────────────
const AUDIT_STATS = {
  total: 1487,
  most_common: 'WORKSPACE_BUDGET_UPDATED',
  active_actors: 23,
  critical: 4,  // includes the refusal
};

const AUDIT_ACTIONS_BY_TYPE = [
  { action: 'WORKSPACE_BUDGET_UPDATED', count: 312, tone: { bg: APP_TEAL_50, text: APP_TEAL_700, stroke: '#14B8A6' } },
  { action: 'WORKSPACE_MEMBER_ADDED',   count: 248, tone: { bg: APP_EMERALD_50, text: APP_EMERALD_700, stroke: '#10B981' } },
  { action: 'WORKSPACE_REPO_LINKED',    count: 187, tone: { bg: APP_INDIGO_50, text: APP_INDIGO_700, stroke: '#6366F1' } },
  { action: 'SYSTEM_PROMPT_UPDATED',    count: 154, tone: { bg: APP_FUCHSIA_50, text: APP_FUCHSIA_700, stroke: '#D946EF' } },
  { action: 'MCP_SERVER_ADDED',         count: 96,  tone: { bg: '#FAF5FF', text: '#7E22CE', stroke: '#A855F7' } },
  { action: 'WORKSPACE_CREATED',        count: 63,  tone: { bg: '#F0F9FF', text: '#0369A1', stroke: '#0EA5E9' } },
  { action: 'API_KEY_CREATED',          count: 41,  tone: { bg: APP_AMBER_50, text: APP_AMBER_700, stroke: '#F59E0B' } },
  { action: 'BEDROCK_REFUSAL',          count: 4,   tone: { bg: APP_ROSE_50, text: APP_ROSE_700, stroke: APP_ROSE_500 } },
];

const AUDIT_ACTIONS_BY_WORKSPACE = [
  { name: 'Platform Engineering',      count: 421 },
  { name: 'Payments Risk',             count: 318 },
  { name: 'Data Platform',             count: 244 },
  { name: 'Security Operations',       count: 187 },
  { name: 'Mobile Apps',               count: 142 },
  { name: 'Customer Identity',         count: 98 },
  { name: 'Reconciliation Services',   count: 77 },
];

const AUDIT_TOP_ACTORS = [
  { email: 'a.fitzgerald@outcomeops.onmicrosoft.com',  count: 187, last: '2026-05-04 02:14:18' },
  { email: 'd.morales@outcomeops.onmicrosoft.com',     count: 142, last: '2026-05-04 01:51:02' },
  { email: 's.chen@outcomeops.onmicrosoft.com',        count: 119, last: '2026-05-03 22:09:44' },
  { email: 'r.okafor@outcomeops.onmicrosoft.com',       count: 96,  last: '2026-05-03 19:33:08' },
  { email: 'k.ivanova@outcomeops.onmicrosoft.com',     count: 88,  last: '2026-05-03 16:47:51' },
];

const AUDIT_RECENT = [
  { time: '2026-05-04 02:14:18', actor: 'a.fitzgerald@outcomeops.onmicrosoft.com', action: 'WORKSPACE_BUDGET_UPDATED', tone: 'budget',  workspace: 'platform-eng',     ip: '10.42.18.9' },
  { time: '2026-05-04 02:09:11', actor: 'd.morales@outcomeops.onmicrosoft.com',     action: 'WORKSPACE_MEMBER_ADDED',   tone: 'member',  workspace: 'payments-risk',    ip: '10.42.18.42' },
  { time: '2026-05-04 02:06:54', actor: 's.chen@outcomeops.onmicrosoft.com',        action: 'SYSTEM_PROMPT_UPDATED',    tone: 'prompt',  workspace: 'security-ops',     ip: '10.42.21.183' },
  { time: '2026-05-04 02:01:29', actor: 'bcarpio@outcomeops.onmicrosoft.com',       action: 'REFUSAL',                  tone: 'refusal', workspace: 'lBlBpLnULE',       ip: '10.42.18.91' },
  { time: '2026-05-04 01:54:02', actor: 'r.okafor@outcomeops.onmicrosoft.com',       action: 'WORKSPACE_REPO_LINKED',    tone: 'repo',    workspace: 'data-platform',    ip: '10.42.21.7' },
  { time: '2026-05-04 01:48:40', actor: 'k.ivanova@outcomeops.onmicrosoft.com',     action: 'MCP_SERVER_ADDED',         tone: 'mcp',     workspace: 'mobile-apps',      ip: '10.42.18.118' },
  { time: '2026-05-04 01:42:17', actor: 'a.fitzgerald@outcomeops.onmicrosoft.com',  action: 'WORKSPACE_CREATED',        tone: 'workspace', workspace: 'recon-services', ip: '10.42.18.9' },
  { time: '2026-05-04 01:36:51', actor: 'j.park@outcomeops.onmicrosoft.com',         action: 'API_KEY_CREATED',          tone: 'apikey',  workspace: 'customer-identity', ip: '10.42.18.204' },
];

const TONE_MAP = {
  workspace: { bg: '#F0F9FF', text: '#0369A1', ring: '#7DD3FC' },
  member:    { bg: APP_EMERALD_50, text: APP_EMERALD_700, ring: '#A7F3D0' },
  repo:      { bg: APP_INDIGO_50, text: APP_INDIGO_700, ring: '#A5B4FC' },
  mcp:       { bg: '#FAF5FF', text: '#7E22CE', ring: '#D8B4FE' },
  apikey:    { bg: APP_AMBER_50, text: APP_AMBER_700, ring: '#FCD34D' },
  budget:    { bg: APP_TEAL_50, text: APP_TEAL_700, ring: '#5EEAD4' },
  prompt:    { bg: APP_FUCHSIA_50, text: APP_FUCHSIA_700, ring: '#F0ABFC' },
  refusal:   { bg: APP_ROSE_50, text: APP_ROSE_700, ring: APP_ROSE_300 },
};

// ── AuditDashboard ────────────────────────────────────────────────────
function AuditDashboard({ highlightRefusal = false }) {
  return (
    <BrowserChrome url="outcomeops.outcomeops.ai/audit" width={1480} height={880}>
      {/* App header */}
      <div style={{
        background: APP_PANEL, borderBottom: `1px solid ${APP_BORDER}`,
        padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon d={ICON_SHIELD} size={22} color={APP_BLUE}/>
          <div style={{ fontSize: 19, fontWeight: 600, color: APP_INK }}>Audit</div>
        </div>
        <AdminNav active="audit"/>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 800, overflow: 'hidden' }}>
        {/* Date range tabs */}
        <div style={{
          display: 'inline-flex', borderRadius: 8,
          border: `1px solid ${APP_BORDER}`, background: APP_PANEL, overflow: 'hidden',
          alignSelf: 'flex-start',
        }}>
          {[7, 30, 90].map(d => (
            <div key={d} style={{
              padding: '6px 14px', fontSize: 13,
              background: d === 30 ? APP_BLUE : 'transparent',
              color: d === 30 ? '#fff' : APP_INK_DIM,
            }}>Last {d} days</div>
          ))}
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <StatCardAudit label="Total Actions"       value="1,487" iconD={ICON_ACTIVITY} iconColor="#3B82F6" accent="blue"/>
          <StatCardAudit label="Most Common Action"  value="WORKSPACE_BUDGET_UPDATED" kind="action" accent="indigo"/>
          <StatCardAudit label="Active Actors"       value="23"    iconD={ICON_USERS} iconColor={APP_EMERALD_500} accent="emerald"/>
          <StatCardAudit label="Critical Actions"    value="4"     iconD={ICON_ALERT} iconColor={APP_ROSE_500} accent="danger"/>
        </div>

        {/* Bar lists */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <BarListPanel title="Actions by Type" rows={AUDIT_ACTIONS_BY_TYPE.slice(0, 6).map(a => ({
            label: a.action, count: a.count, color: a.tone.stroke, labelStyle: { fontFamily: "'JetBrains Mono', monospace", color: a.tone.text, fontSize: 11 },
          }))}/>
          <BarListPanel title="Actions by Workspace" rows={AUDIT_ACTIONS_BY_WORKSPACE.slice(0, 6).map(w => ({
            label: w.name, count: w.count, color: APP_SKY_500,
          }))}/>
        </div>

        {/* Recent activity table */}
        <div style={{
          background: APP_PANEL, border: `1px solid ${APP_BORDER}`, borderRadius: 8, padding: 16,
          flex: 1, overflow: 'hidden',
        }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: APP_INK_DIM, marginBottom: 8 }}>Recent Activity</div>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                borderBottom: `1px solid ${APP_BORDER}`,
                fontSize: 10, textTransform: 'uppercase', color: APP_INK_MUTE, letterSpacing: '0.06em',
              }}>
                <th style={{ textAlign: 'left', padding: '6px 8px 6px 0' }}>Time</th>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>Actor</th>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>Action</th>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>Workspace</th>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>IP</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_RECENT.map((ev, i) => {
                const t = TONE_MAP[ev.tone];
                const isRefusal = ev.tone === 'refusal';
                return (
                  <tr key={i} style={{
                    borderBottom: `1px solid ${APP_RULE}`,
                    background: highlightRefusal && isRefusal ? '#FEF2F2' : 'transparent',
                    boxShadow: highlightRefusal && isRefusal ? `inset 0 0 0 2px ${APP_ROSE_500}` : 'none',
                  }}>
                    <td style={{ padding: '10px 8px 10px 0', fontSize: 11, color: APP_INK_MUTE, fontFamily: "'JetBrains Mono', monospace" }}>{ev.time}</td>
                    <td style={{ padding: '10px 8px', color: APP_INK }}>{ev.actor}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 10px', borderRadius: 999, fontSize: 11,
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: 500,
                        background: t.bg, color: t.text,
                        boxShadow: `inset 0 0 0 1px ${t.ring}`,
                      }}>
                        {isRefusal && <Icon d={ICON_ALERT} size={10}/>}
                        {ev.action}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: 11, color: APP_INK_DIM, fontFamily: "'JetBrains Mono', monospace" }}>{ev.workspace}</td>
                    <td style={{ padding: '10px 8px', fontSize: 11, color: APP_INK_DIM, fontFamily: "'JetBrains Mono', monospace" }}>{ev.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </BrowserChrome>
  );
}

function StatCardAudit({ label, value, iconD, iconColor, accent = 'neutral', kind = 'number' }) {
  const accentClass = {
    neutral:  { border: APP_BORDER,    bg: APP_PANEL },
    danger:   { border: APP_ROSE_300,  bg: APP_ROSE_50 },
    blue:     { border: '#BFDBFE',     bg: APP_BLUE_50 },
    indigo:   { border: '#C7D2FE',     bg: APP_INDIGO_50 },
    emerald:  { border: '#A7F3D0',     bg: APP_EMERALD_50 },
  }[accent];
  return (
    <div style={{
      border: `1px solid ${accentClass.border}`,
      background: accentClass.bg,
      borderRadius: 8, padding: '12px 14px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 10, textTransform: 'uppercase', color: APP_INK_DIM, fontWeight: 500,
        letterSpacing: '0.04em',
      }}>
        <span>{label}</span>
        {iconD && <Icon d={iconD} size={16} color={iconColor}/>}
      </div>
      <div style={{
        marginTop: 4,
        fontSize: kind === 'action' ? 14 : 26,
        fontWeight: 600,
        fontFamily: kind === 'action' ? "'JetBrains Mono', monospace" : 'Inter, sans-serif',
        color: kind === 'action' ? APP_INDIGO_700 : APP_INK,
        wordBreak: 'break-all',
      }}>{value}</div>
    </div>
  );
}

function BarListPanel({ title, rows, dollarFormat = false }) {
  const max = rows[0]?.count || 1;
  const fmt = (n) => dollarFormat ? `$${n.toFixed(2)}` : n.toLocaleString();
  return (
    <div style={{
      background: APP_PANEL, border: `1px solid ${APP_BORDER}`,
      borderRadius: 8, padding: 16,
    }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: APP_INK_DIM, marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((r, i) => {
          const pct = Math.max(4, (r.count / max) * 100);
          return (
            <div key={i}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3,
                ...(r.labelStyle || {}),
              }}>
                <span style={{ color: r.labelStyle?.color || APP_INK_DIM, ...(r.labelStyle || {}) }}>{r.label}</span>
                <span style={{ color: APP_INK_DIM, fontFamily: 'inherit' }}>{fmt(r.count)}</span>
              </div>
              <div style={{ height: 6, background: APP_RULE, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: r.color }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Analytics data fixtures ────────────────────────────────────────────
const ANALYTICS_STATS = {
  total_cost: '$1,847.23',
  queries: 12_847,
  input_tokens: '4.2M',
  output_tokens: '1.1M',
  avg_cost: '$0.1438',
  cost_delta: '-12.3%',  // good when cost goes down
  query_delta: '+18.7%',
};

const ANALYTICS_BY_WORKSPACE = [
  { name: 'Platform Engineering',     cost: 612.40 },
  { name: 'Payments Risk',            cost: 481.18 },
  { name: 'Data Platform',            cost: 312.66 },
  { name: 'Security Operations',      cost: 198.52 },
  { name: 'Mobile Apps',              cost: 124.75 },
  { name: 'Customer Identity',         cost: 71.40 },
  { name: 'Reconciliation Services',   cost: 46.32 },
];

const ANALYTICS_BY_MODEL = [
  { model: 'claude-haiku-4-5',     cost: 1326.39 },
  { model: 'claude-sonnet-4-6',    cost: 503.71 },
  { model: 'titan-embed-v2',        cost: 17.13 },
];

const ANALYTICS_TOP_USERS = [
  { email: 'a.fitzgerald@outcomeops.onmicrosoft.com',  queries: 1842, cost: '$284.91', last: 'Today' },
  { email: 'd.morales@outcomeops.onmicrosoft.com',     queries: 1417, cost: '$219.04', last: 'Today' },
  { email: 's.chen@outcomeops.onmicrosoft.com',        queries: 1188, cost: '$172.55', last: 'Today' },
  { email: 'r.okafor@outcomeops.onmicrosoft.com',      queries: 942,  cost: '$148.18', last: 'Yesterday' },
  { email: 'k.ivanova@outcomeops.onmicrosoft.com',     queries: 819,  cost: '$127.92', last: 'Today' },
  { email: 'j.park@outcomeops.onmicrosoft.com',         queries: 671,  cost: '$104.46', last: 'Today' },
];

// ── AnalyticsDashboard ────────────────────────────────────────────────
function AnalyticsDashboard({ highlightCost = false }) {
  return (
    <BrowserChrome url="outcomeops.outcomeops.ai/analytics" width={1480} height={880}>
      <div style={{
        background: APP_PANEL, borderBottom: `1px solid ${APP_BORDER}`,
        padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon d={ICON_BAR} size={22} color={APP_BLUE}/>
          <div style={{ fontSize: 19, fontWeight: 600, color: APP_INK }}>Analytics</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            display: 'inline-flex', borderRadius: 8,
            border: `1px solid ${APP_BORDER}`, background: APP_PANEL, overflow: 'hidden',
          }}>
            {[30, 60, 90].map(d => (
              <div key={d} style={{
                padding: '5px 12px', fontSize: 12,
                background: d === 30 ? APP_BLUE : 'transparent',
                color: d === 30 ? '#fff' : APP_INK_DIM,
              }}>{d}d</div>
            ))}
          </div>
          <div style={{
            padding: '5px 12px', fontSize: 12,
            border: `1px solid ${APP_BORDER}`, borderRadius: 8, background: APP_PANEL,
            color: APP_INK_DIM,
          }}>All workspaces ▾</div>
          <AdminNav active="an"/>
        </div>
      </div>

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <StatCardAnalytics label="Total Cost" value={ANALYTICS_STATS.total_cost}
            sublabel="last 30 days" delta={ANALYTICS_STATS.cost_delta} deltaGood
            highlight={highlightCost}/>
          <StatCardAnalytics label="Queries" value={ANALYTICS_STATS.queries.toLocaleString()}
            delta={ANALYTICS_STATS.query_delta} deltaGood/>
          <StatCardAnalytics label="Input Tokens" value={ANALYTICS_STATS.input_tokens}
            sublabel={`${ANALYTICS_STATS.output_tokens} out`}/>
          <StatCardAnalytics label="Avg Cost/Query" value={ANALYTICS_STATS.avg_cost}
            sublabel="efficiency"/>
        </div>

        {/* Daily trend (sparkline placeholder) */}
        <div style={{
          background: APP_PANEL, border: `1px solid ${APP_BORDER}`, borderRadius: 8, padding: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icon d={ICON_TRENDING} size={14} color={APP_INK_MUTE}/>
            <div style={{ fontSize: 13, fontWeight: 500, color: APP_INK }}>Daily Cost Trend</div>
            <div style={{ fontSize: 12, color: APP_INK_MUTE, marginLeft: 4 }}>(last 30 days)</div>
          </div>
          <Sparkline width={1430} height={120} color={APP_BLUE}/>
        </div>

        {/* Cost by workspace + model */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <BarListPanel title="Cost by Workspace" rows={ANALYTICS_BY_WORKSPACE.map(w => ({
            label: w.name, count: w.cost,
            color: APP_SKY_500,
            labelStyle: { color: APP_INK_DIM },
            displayCount: '$' + w.cost.toFixed(2),
          })).map(r => ({ ...r, count: r.count, label: r.label, color: r.color, displayCount: r.displayCount }))} dollarFormat/>
          <BarListPanel title="Cost by Model" rows={ANALYTICS_BY_MODEL.map(m => ({
            label: m.model, count: m.cost, color: APP_PURPLE_500,
            labelStyle: { color: APP_INK_DIM },
          }))} dollarFormat/>
        </div>

        {/* Top users */}
        <div style={{
          background: APP_PANEL, border: `1px solid ${APP_BORDER}`, borderRadius: 8,
        }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${APP_BORDER}`,
                        fontSize: 13, fontWeight: 500, color: APP_INK }}>Top Users</div>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 10, textTransform: 'uppercase', color: APP_INK_MUTE, letterSpacing: '0.06em' }}>
                <th style={{ textAlign: 'left', padding: '8px 16px' }}>User</th>
                <th style={{ textAlign: 'left', padding: '8px 16px' }}>Queries</th>
                <th style={{ textAlign: 'left', padding: '8px 16px' }}>Cost</th>
                <th style={{ textAlign: 'left', padding: '8px 16px' }}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {ANALYTICS_TOP_USERS.map((u, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${APP_BORDER}` }}>
                  <td style={{ padding: '10px 16px', color: APP_INK }}>{u.email}</td>
                  <td style={{ padding: '10px 16px', color: APP_INK_DIM }}>{u.queries.toLocaleString()}</td>
                  <td style={{ padding: '10px 16px', color: APP_INK_DIM, fontWeight: 500 }}>{u.cost}</td>
                  <td style={{ padding: '10px 16px', color: APP_INK_MUTE }}>{u.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BrowserChrome>
  );
}

function StatCardAnalytics({ label, value, sublabel, delta, deltaGood, highlight }) {
  return (
    <div style={{
      background: APP_PANEL,
      border: `1px solid ${highlight ? APP_BLUE : APP_BORDER}`,
      borderRadius: 8, padding: '12px 14px',
      boxShadow: highlight ? `0 0 0 3px rgba(37,99,235,0.18)` : 'none',
    }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: APP_INK_MUTE, letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 26, fontWeight: 600, color: APP_INK }}>{value}</div>
      {delta ? (
        <div style={{
          marginTop: 4, fontSize: 11,
          color: deltaGood ? APP_EMERALD_700 : APP_ROSE_700,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {delta} <span style={{ color: APP_INK_MUTE, fontWeight: 400 }}>vs prior 7d</span>
        </div>
      ) : sublabel ? (
        <div style={{ marginTop: 4, fontSize: 11, color: APP_INK_MUTE }}>{sublabel}</div>
      ) : null}
    </div>
  );
}

function Sparkline({ width, height, color }) {
  // Procedural sine-with-noise sparkline so the chart looks alive.
  const points = [];
  const N = 30;
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * width;
    const base = height * 0.55 + Math.sin(i / 2.5) * height * 0.18;
    const noise = (Math.sin(i * 1.7) * 0.5 + Math.cos(i * 0.7) * 0.5) * height * 0.12;
    const y = base + noise;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const path = 'M ' + points.join(' L ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${path} L ${width},${height} L 0,${height} Z`} fill="url(#spark-fill)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="2"/>
    </svg>
  );
}

Object.assign(window, {
  AuditDashboard, AnalyticsDashboard, BrowserChrome,
  AuditEmailScreenshot: null, // reserved
});
