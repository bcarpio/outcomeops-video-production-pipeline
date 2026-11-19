// mcp_ui.jsx — OutcomeOps Settings page replica (visual primitives only).
// Mirrors Settings.tsx + AdminNav.tsx tailwind styling. Pure static
// components; the scene file drives them via props + time.

const C = {
  bg:        '#f9fafb',
  white:     '#ffffff',
  gray100:   '#f3f4f6',
  gray200:   '#e5e7eb',
  gray300:   '#d1d5db',
  gray400:   '#9ca3af',
  gray500:   '#6b7280',
  gray600:   '#4b5563',
  gray700:   '#374151',
  gray800:   '#1f2937',
  gray900:   '#111827',
  blue50:    '#eff6ff',
  blue100:   '#dbeafe',
  blue200:   '#bfdbfe',
  blue600:   '#2563eb',
  blue700:   '#1d4ed8',
  blue900:   '#1e3a8a',
  green50:   '#f0fdf4',
  green100:  '#dcfce7',
  green600:  '#16a34a',
  yellow50:  '#fefce8',
  yellow200: '#fef08a',
  yellow800: '#854d0e',
  red50:     '#fef2f2',
  red200:    '#fecaca',
  red600:    '#dc2626',
};

const F = {
  ui:   "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

const SHADOW_SM = '0 1px 2px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)';
const SHADOW_XL = '0 25px 50px -12px rgba(0,0,0,0.30)';

// ── Icons (lucide replicas, stroke-style, scalable) ─────────────────────
const Ic = ({ d, size = 22, stroke = 'currentColor', fill = 'none', sw = 2, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
       style={{ display: 'block', flexShrink: 0 }}>
    {children || <path d={d}/>}
  </svg>
);

const I = {
  ArrowLeft: (p) => <Ic {...p}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></Ic>,
  MessageSquare: (p) => <Ic {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Ic>,
  Folder: (p) => <Ic {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></Ic>,
  Settings: (p) => <Ic {...p}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></Ic>,
  BarChart3: (p) => <Ic {...p}><path d="M3 3v18h18"/><path d="M7 16v-5"/><path d="M12 16V8"/><path d="M17 16v-3"/></Ic>,
  Wallet: (p) => <Ic {...p}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></Ic>,
  ShieldAlert: (p) => <Ic {...p}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></Ic>,
  Shield: (p) => <Ic {...p}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></Ic>,
  LogOut: (p) => <Ic {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></Ic>,
  Plus: (p) => <Ic {...p}><path d="M5 12h14"/><path d="M12 5v14"/></Ic>,
  Key: (p) => <Ic {...p}><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></Ic>,
  Trash2: (p) => <Ic {...p}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Ic>,
  Copy: (p) => <Ic {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Ic>,
  Check: (p) => <Ic {...p}><path d="M20 6 9 17l-5-5"/></Ic>,
  X: (p) => <Ic {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Ic>,
  ChevronDown: (p) => <Ic {...p}><path d="m6 9 6 6 6-6"/></Ic>,
  ChevronUp: (p) => <Ic {...p}><path d="m18 15-6-6-6 6"/></Ic>,
  User: (p) => <Ic {...p}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Ic>,
  Mail: (p) => <Ic {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></Ic>,
};

// ── Browser frame (chrome) ───────────────────────────────────────────────
function BrowserFrame({ url = 'outcomeops.outcomeops.ai/settings', children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.gray100,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top chrome */}
      <div style={{
        background: C.gray200,
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
        borderBottom: `1px solid ${C.gray300}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fc5753' }}/>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fdbc40' }}/>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#33c948' }}/>
        </div>
        <div style={{
          background: C.white,
          padding: '8px 16px', borderRadius: 8,
          fontFamily: F.ui, fontSize: 16, color: C.gray600,
          letterSpacing: '0.005em',
          flex: 1, maxWidth: 720,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: C.green600, fontWeight: 600 }}>🔒</span>
          <span>{url}</span>
        </div>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, overflow: 'hidden', background: C.bg, position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}

// ── Page header (Settings header strip) ──────────────────────────────────
function SettingsHeader({ adminNavHighlight = null }) {
  return (
    <div style={{
      background: C.white,
      borderBottom: `1px solid ${C.gray200}`,
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{
            padding: 10,
            color: C.gray500,
            background: 'transparent',
            border: 'none', borderRadius: 8,
            cursor: 'pointer',
          }}>
            <I.ArrowLeft size={26}/>
          </button>
          <div>
            <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 28, color: C.gray900, letterSpacing: '-0.015em' }}>
              Settings
            </div>
            <div style={{ fontFamily: F.ui, fontSize: 18, color: C.gray500, marginTop: 4 }}>
              Your profile and API keys
            </div>
          </div>
        </div>
        <AdminNav highlight={adminNavHighlight}/>
      </div>
    </div>
  );
}

function AdminNav({ highlight = null }) {
  const buttons = [
    { id: 'chat',       icon: I.MessageSquare, title: 'Chat' },
    { id: 'workspaces', icon: I.Folder,        title: 'Workspaces' },
    { id: 'analytics',  icon: I.BarChart3,     title: 'Analytics' },
    { id: 'budgets',    icon: I.Wallet,        title: 'Budgets' },
    { id: 'audit',      icon: I.ShieldAlert,   title: 'Audit' },
    { id: 'org',        icon: I.Shield,        title: 'Org Settings' },
    { id: 'logout',     icon: I.LogOut,        title: 'Sign out' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {buttons.map((b) => {
        const isHi = highlight === b.id;
        return (
          <div key={b.id} style={{
            padding: 12,
            background: isHi ? C.gray100 : 'transparent',
            color: isHi ? C.gray700 : C.gray500,
            borderRadius: 10,
            boxShadow: isHi ? `0 0 0 2px ${C.blue600}` : 'none',
            transition: 'all 200ms',
          }}>
            <b.icon size={26}/>
          </div>
        );
      })}
    </div>
  );
}

// ── Profile card ────────────────────────────────────────────────────────
function ProfileCard() {
  return (
    <Card>
      <CardHeader icon={<I.User size={22} color={C.gray700}/>} title="Profile"/>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: C.blue100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <I.User size={42} stroke={C.blue600}/>
          </div>
          <div>
            <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 26, color: C.gray900, letterSpacing: '-0.01em' }}>
              Sarah Chen
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: C.gray500, marginTop: 6,
              fontFamily: F.ui, fontSize: 18,
            }}>
              <I.Mail size={18}/>
              <span>sarah.chen@acme-corp.com</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Card primitives ─────────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background: C.white,
      border: `1px solid ${C.gray200}`,
      borderRadius: 10,
      boxShadow: SHADOW_SM,
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardHeader({ icon, title, count = null }) {
  return (
    <div style={{
      padding: '18px 24px',
      borderBottom: `1px solid ${C.gray200}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      {icon}
      <span style={{
        fontFamily: F.ui, fontWeight: 500, fontSize: 22,
        color: C.gray900, letterSpacing: '-0.01em',
      }}>
        {title}{count !== null && ` (${count})`}
      </span>
    </div>
  );
}

// ── Section H2 + Create button ──────────────────────────────────────────
function ApiKeysHeader({ buttonHighlight = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 20,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: F.ui, fontWeight: 600, fontSize: 26,
        color: C.gray900, letterSpacing: '-0.015em',
      }}>
        <I.Key size={28} stroke={C.gray900}/>
        API Keys
      </div>
      <button style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 22px',
        background: C.blue600, color: C.white,
        border: 'none', borderRadius: 10,
        fontFamily: F.ui, fontWeight: 500, fontSize: 18,
        cursor: 'pointer',
        transition: 'all 200ms',
        boxShadow: buttonHighlight ? `0 0 0 4px ${C.blue200}, 0 6px 20px rgba(37,99,235,0.35)` : 'none',
        transform: buttonHighlight ? 'scale(1.04)' : 'scale(1)',
      }}>
        <I.Plus size={20}/>
        Create API Key
      </button>
    </div>
  );
}

function InfoBanner() {
  return (
    <div style={{
      padding: 20,
      background: C.blue50,
      border: `1px solid ${C.blue200}`,
      borderRadius: 10,
      marginBottom: 24,
      display: 'flex', alignItems: 'flex-start', gap: 14,
    }}>
      <div style={{ color: C.blue600, marginTop: 2 }}>
        <I.Key size={22}/>
      </div>
      <div>
        <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 18, color: C.blue900 }}>
          About API Keys
        </div>
        <div style={{ fontFamily: F.ui, fontSize: 16, color: C.blue700, marginTop: 6, lineHeight: 1.5 }}>
          API keys let you connect <strong>MCP-compatible tools</strong> (Claude Code, VS Code, Cursor) to the OutcomeOps knowledge base.
          Each key is personal and scoped to your workspace access.
        </div>
      </div>
    </div>
  );
}

// ── Active keys: empty + populated ──────────────────────────────────────
function EmptyKeysState() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{
        display: 'inline-flex',
        padding: 16, borderRadius: '50%',
        background: C.gray100,
        marginBottom: 18,
      }}>
        <I.Key size={48} stroke={C.gray400}/>
      </div>
      <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 22, color: C.gray900 }}>
        No API keys yet
      </div>
      <div style={{ fontFamily: F.ui, fontSize: 16, color: C.gray500, marginTop: 6 }}>
        Create one to connect MCP clients like Claude Code or VS Code.
      </div>
    </div>
  );
}

function ActiveKeyRow({ name, prefix, created, lastUsed, highlight = false }) {
  return (
    <div style={{
      padding: '20px 24px',
      background: highlight ? C.green50 : C.white,
      transition: 'background 400ms',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: C.green50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <I.Key size={22} stroke={C.green600}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 18, color: C.gray900 }}>
          {name}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 18,
          fontFamily: F.ui, fontSize: 14, color: C.gray500, marginTop: 4,
        }}>
          <span style={{ fontFamily: F.mono, color: C.gray600 }}>{prefix}...</span>
          <span>Created {created}</span>
          <span>Last used {lastUsed}</span>
        </div>
      </div>
      <button style={{
        padding: 10,
        color: C.gray400,
        background: 'transparent',
        border: 'none', borderRadius: 8,
        cursor: 'pointer',
      }}>
        <I.Trash2 size={20}/>
      </button>
    </div>
  );
}

// ── Modal (overlay + dialog) ────────────────────────────────────────────
function ModalOverlay({ children, opacity = 1 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `rgba(0,0,0,${0.5 * opacity})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50,
      opacity,
      transition: 'opacity 300ms',
    }}>
      {children}
    </div>
  );
}

function CreateModalForm({ keyName = '', expiration = 'No expiration', createHighlight = false }) {
  return (
    <div style={{
      background: C.white, borderRadius: 14,
      boxShadow: SHADOW_XL,
      width: 580,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '24px 28px',
        borderBottom: `1px solid ${C.gray200}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: F.ui, fontWeight: 600, fontSize: 22,
          color: C.gray900, letterSpacing: '-0.01em',
        }}>
          Create API Key
        </span>
        <div style={{ padding: 6, color: C.gray400 }}>
          <I.X size={22}/>
        </div>
      </div>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: F.ui, fontWeight: 500, fontSize: 16,
            color: C.gray700, marginBottom: 8,
          }}>
            Key Name
          </div>
          <div style={{
            width: '100%', boxSizing: 'border-box',
            padding: '12px 16px',
            border: `1px solid ${keyName ? C.blue600 : C.gray300}`,
            borderRadius: 10,
            fontFamily: F.ui, fontSize: 17,
            color: keyName ? C.gray900 : C.gray400,
            background: C.white,
            boxShadow: keyName ? `0 0 0 3px rgba(37,99,235,0.18)` : 'none',
          }}>
            {keyName || 'e.g., Claude Code - Laptop'}
            {keyName && <span className="cursor" style={{
              display: 'inline-block', width: 2, height: 22,
              background: C.blue600, marginLeft: 1,
              verticalAlign: 'middle',
              animation: 'blink 1s infinite',
            }}/>}
          </div>
        </div>
        <div>
          <div style={{
            fontFamily: F.ui, fontWeight: 500, fontSize: 16,
            color: C.gray700, marginBottom: 8,
          }}>
            Expiration
          </div>
          <div style={{
            width: '100%', boxSizing: 'border-box',
            padding: '12px 16px',
            border: `1px solid ${C.gray300}`,
            borderRadius: 10,
            fontFamily: F.ui, fontSize: 17,
            color: expiration === 'No expiration' ? C.gray400 : C.gray900,
            background: C.white,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>{expiration}</span>
            <I.ChevronDown size={20} stroke={C.gray400}/>
          </div>
        </div>
      </div>
      <div style={{
        padding: '20px 28px',
        borderTop: `1px solid ${C.gray200}`,
        display: 'flex', justifyContent: 'flex-end', gap: 12,
      }}>
        <div style={{
          padding: '11px 22px',
          background: C.gray100, color: C.gray700,
          borderRadius: 10,
          fontFamily: F.ui, fontWeight: 500, fontSize: 16,
        }}>
          Cancel
        </div>
        <div style={{
          padding: '11px 22px',
          background: keyName ? C.blue600 : C.gray300,
          color: C.white,
          borderRadius: 10,
          fontFamily: F.ui, fontWeight: 500, fontSize: 16,
          boxShadow: createHighlight ? `0 0 0 4px ${C.blue200}, 0 8px 20px rgba(37,99,235,0.4)` : 'none',
          transform: createHighlight ? 'scale(1.04)' : 'scale(1)',
          transition: 'all 200ms',
        }}>
          Create Key
        </div>
      </div>
    </div>
  );
}

function CreateModalReveal({ apiKey, copyState = 'idle' }) {
  return (
    <div style={{
      background: C.white, borderRadius: 14,
      boxShadow: SHADOW_XL,
      width: 680,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '24px 28px',
        borderBottom: `1px solid ${C.gray200}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: F.ui, fontWeight: 600, fontSize: 22,
          color: C.gray900, letterSpacing: '-0.01em',
        }}>
          API Key Created
        </span>
        <div style={{ padding: 6, color: C.gray400 }}>
          <I.X size={22}/>
        </div>
      </div>
      <div style={{ padding: 28 }}>
        <div style={{
          padding: 14,
          background: C.yellow50,
          border: `1px solid ${C.yellow200}`,
          borderRadius: 10,
          fontFamily: F.ui, fontSize: 16, color: C.yellow800,
          marginBottom: 20,
        }}>
          This key will only be shown once. <strong>Copy it now.</strong>
        </div>
        <div style={{
          fontFamily: F.ui, fontWeight: 500, fontSize: 16,
          color: C.gray700, marginBottom: 8,
        }}>
          Your API Key
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: 1,
            padding: '12px 14px',
            border: `1px solid ${C.gray300}`,
            borderRadius: 10,
            fontFamily: F.mono, fontSize: 16,
            color: C.gray900,
            background: C.gray100,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {apiKey}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '11px 18px',
            background: copyState === 'copied' ? C.green600 : C.blue600,
            color: C.white,
            borderRadius: 10,
            fontFamily: F.ui, fontWeight: 500, fontSize: 16,
            boxShadow: copyState === 'highlight'
              ? `0 0 0 4px ${C.blue200}, 0 8px 20px rgba(37,99,235,0.4)`
              : 'none',
            transform: copyState === 'highlight' ? 'scale(1.04)' : 'scale(1)',
            transition: 'all 200ms',
          }}>
            {copyState === 'copied' ? <I.Check size={18}/> : <I.Copy size={18}/>}
            {copyState === 'copied' ? 'Copied' : 'Copy'}
          </div>
        </div>
      </div>
      <div style={{
        padding: '20px 28px',
        borderTop: `1px solid ${C.gray200}`,
        display: 'flex', justifyContent: 'flex-end',
      }}>
        <div style={{
          padding: '11px 22px',
          background: C.gray100, color: C.gray700,
          borderRadius: 10,
          fontFamily: F.ui, fontWeight: 500, fontSize: 16,
        }}>
          Done
        </div>
      </div>
    </div>
  );
}

// ── Connection Guide ────────────────────────────────────────────────────
function ConnectionGuideCollapsed({ highlight = false }) {
  return (
    <Card style={{ marginTop: 24 }}>
      <div style={{
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: highlight ? C.gray100 : C.white,
        transition: 'all 200ms',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: F.ui, fontWeight: 500, fontSize: 22,
          color: C.gray900, letterSpacing: '-0.01em',
        }}>
          <I.Key size={22} stroke={C.gray700}/>
          Connection Guide
        </div>
        <I.ChevronDown size={22} stroke={C.gray400}/>
      </div>
    </Card>
  );
}

function ConnectionGuideExpanded({ activeClient = 'claudeDesktop', tokenHighlight = false }) {
  const clients = [
    { id: 'claudeCode',    label: 'Claude Code (CLI)' },
    { id: 'vscode',        label: 'VS Code (GitHub Copilot)' },
    { id: 'cursor',        label: 'Cursor' },
    { id: 'claudeDesktop', label: 'Claude Desktop' },
  ];

  return (
    <Card style={{ marginTop: 24 }}>
      <div style={{
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.gray200}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: F.ui, fontWeight: 500, fontSize: 22,
          color: C.gray900, letterSpacing: '-0.01em',
        }}>
          <I.Key size={22} stroke={C.gray700}/>
          Connection Guide
        </div>
        <I.ChevronUp size={22} stroke={C.gray400}/>
      </div>
      <div style={{ padding: '20px 24px 24px' }}>
        <div style={{
          fontFamily: F.ui, fontSize: 16, color: C.gray600,
          marginBottom: 18, lineHeight: 1.5,
        }}>
          Connect your AI coding tools to OutcomeOps. This single connection gives you
          access to all tools — the knowledge base plus any MCP servers assigned to
          your workspaces.
        </div>

        {/* Client tabs row */}
        <div style={{
          display: 'flex', gap: 4,
          borderBottom: `1px solid ${C.gray200}`,
          marginBottom: 20,
        }}>
          {clients.map((c) => {
            const isActive = c.id === activeClient;
            return (
              <div key={c.id} style={{
                padding: '10px 16px',
                fontFamily: F.ui, fontWeight: isActive ? 600 : 400, fontSize: 16,
                color: isActive ? C.blue700 : C.gray500,
                borderBottom: `2px solid ${isActive ? C.blue600 : 'transparent'}`,
                marginBottom: -1,
                transition: 'all 200ms',
              }}>
                {c.label}
              </div>
            );
          })}
        </div>

        {/* Active client snippet */}
        {activeClient === 'claudeDesktop' && (
          <ClaudeDesktopSnippet tokenHighlight={tokenHighlight}/>
        )}
        {activeClient === 'claudeCode' && (
          <ClaudeCodeSnippet/>
        )}
        {activeClient === 'vscode' && (
          <VsCodeSnippet/>
        )}
        {activeClient === 'cursor' && (
          <CursorSnippet/>
        )}
      </div>
    </Card>
  );
}

function ClaudeDesktopSnippet({ tokenHighlight = false }) {
  const token = 'ooa_4f7a829d3e6b1c8f5a92b7d40e6c1f8a3b9d2e7c';
  return (
    <>
      <div style={{
        fontFamily: F.ui, fontSize: 16, color: C.gray600,
        marginBottom: 12, lineHeight: 1.5,
      }}>
        Open <strong>Settings → Developer → Edit Config</strong> and add this to{' '}
        <code style={{
          fontFamily: F.mono, fontSize: 14,
          background: C.gray100, padding: '2px 6px', borderRadius: 4,
        }}>claude_desktop_config.json</code>:
      </div>
      <CodeBlock>
{`{
  "mcpServers": {
    "outcomeops": {
      "command": "npx.cmd",
      "args": [
        "mcp-remote@latest",
        "https://outcomeops.outcomeops.ai/mcp/v1",
        "--header",
        `}<span style={{
          background: tokenHighlight ? 'rgba(34,197,94,0.25)' : 'transparent',
          color: tokenHighlight ? '#86efac' : '#e5e7eb',
          padding: tokenHighlight ? '2px 4px' : 0,
          borderRadius: 3,
          transition: 'all 300ms',
        }}>{`"Authorization: Bearer ${token}"`}</span>{`
      ]
    }
  }
}`}
      </CodeBlock>
    </>
  );
}

function ClaudeCodeSnippet() {
  return (
    <CodeBlock>{`claude mcp add --transport http outcomeops \\
  https://outcomeops.outcomeops.ai/mcp/v1 \\
  --header "Authorization: Bearer ooa_4f7a829d3e6b1c..."`}</CodeBlock>
  );
}

function VsCodeSnippet() {
  return (
    <CodeBlock>
{`{
  "servers": {
    "outcomeops": {
      "type": "streamableHttp",
      "url": "https://outcomeops.outcomeops.ai/mcp/v1",
      "headers": {
        "Authorization": "Bearer ooa_4f7a829d3e6b1c..."
      }
    }
  }
}`}
    </CodeBlock>
  );
}

function CursorSnippet() {
  return (
    <div style={{
      padding: 16,
      fontFamily: F.ui, fontSize: 16, color: C.gray700, lineHeight: 1.6,
    }}>
      <strong>Cursor Settings → MCP Servers → Add Server</strong>
      <ul style={{ margin: '12px 0 0 24px', padding: 0 }}>
        <li>Transport: Streamable HTTP</li>
        <li>URL: <code style={{ fontFamily: F.mono, fontSize: 14, background: C.gray100, padding: '2px 6px', borderRadius: 4 }}>https://outcomeops.outcomeops.ai/mcp/v1</code></li>
        <li>Headers: <code style={{ fontFamily: F.mono, fontSize: 14, background: C.gray100, padding: '2px 6px', borderRadius: 4 }}>Authorization: Bearer ooa_...</code></li>
      </ul>
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <pre style={{
      background: '#0f172a',
      color: '#e5e7eb',
      fontFamily: F.mono, fontSize: 16,
      padding: 20, borderRadius: 10,
      overflow: 'hidden',
      margin: 0,
      lineHeight: 1.55,
      whiteSpace: 'pre-wrap',
    }}>
      {children}
    </pre>
  );
}

// ── Claude Desktop (stylized chat UI for the banking-query payoff) ─────
const CD = {
  bg:        '#0f0f10',  // warm near-black, matches Claude Desktop
  bgSoft:    '#1a1a1c',
  panel:     '#1f1f22',
  panelHi:   '#26262a',
  ink:       '#ece8e2',  // warm off-white
  inkDim:    '#8c8c94',
  inkFaint:  '#54545c',
  rule:      'rgba(236,232,226,0.08)',
  accent:    '#dd6b5e',  // Claude coral
  accentSoft:'rgba(221,107,94,0.10)',
  ok:        '#5cd47b',
  okSoft:    'rgba(92,212,123,0.12)',
};

function ClaudeDesktopWindow({ children }) {
  return (
    <div style={{
      position: 'absolute', inset: '40px 80px',
      borderRadius: 14,
      background: CD.bg,
      boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 8px 18px rgba(0,0,0,0.30)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Window chrome — traffic lights row */}
      <div style={{
        background: CD.bgSoft,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 16,
        borderBottom: `1px solid ${CD.rule}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fc5753' }}/>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fdbc40' }}/>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#33c948' }}/>
        </div>
        <span style={{
          fontFamily: F.ui, fontSize: 14, color: CD.inkDim, fontWeight: 500,
        }}>Claude</span>
      </div>

      {/* Body: sidebar + main */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function ClaudeSidebar() {
  const convos = [
    { title: 'PCI scope review',          active: true,  preview: 'Where do we touch PCI...' },
    { title: 'Q4 board prep',             active: false, preview: 'Pulling the latest...' },
    { title: 'ACH return code logic',     active: false, preview: 'How does NACHA...' },
    { title: 'Refund flow refactor',      active: false, preview: 'The current path...' },
  ];
  return (
    <div style={{
      width: 280, flexShrink: 0,
      background: CD.bgSoft,
      borderRight: `1px solid ${CD.rule}`,
      padding: '20px 12px',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{
        padding: '8px 12px 18px',
        fontFamily: F.mono, fontSize: 11, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: CD.inkFaint, fontWeight: 600,
      }}>
        Recent
      </div>
      {convos.map((c, i) => (
        <div key={i} style={{
          padding: '10px 12px',
          borderRadius: 8,
          background: c.active ? CD.panelHi : 'transparent',
          cursor: 'pointer',
        }}>
          <div style={{
            fontFamily: F.ui, fontSize: 14, color: CD.ink, fontWeight: 500,
            letterSpacing: '-0.005em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {c.title}
          </div>
          <div style={{
            fontFamily: F.ui, fontSize: 12, color: CD.inkFaint, marginTop: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {c.preview}
          </div>
        </div>
      ))}
    </div>
  );
}

function ClaudeMainArea({ children, connected = true }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Top bar — model + connection pill */}
      <div style={{
        padding: '14px 24px',
        borderBottom: `1px solid ${CD.rule}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: F.ui, fontSize: 14, color: CD.inkDim, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: CD.ink, fontWeight: 600 }}>Claude Sonnet 4.6</span>
        </div>
        {connected && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px',
            background: CD.okSoft,
            border: `1px solid ${CD.ok}55`,
            borderRadius: 999,
            fontFamily: F.mono, fontSize: 11, letterSpacing: '0.18em',
            color: CD.ok, fontWeight: 700, textTransform: 'uppercase',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: 4, background: CD.ok,
              boxShadow: `0 0 8px ${CD.ok}`,
            }}/>
            OutcomeOps · MCP
          </div>
        )}
      </div>

      {/* Conversation area */}
      <div style={{
        flex: 1, overflow: 'hidden',
        padding: '32px 60px',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {children}
      </div>
    </div>
  );
}

function ClaudeUserMessage({ text }) {
  return (
    <div style={{
      alignSelf: 'flex-end',
      maxWidth: '78%',
      padding: '14px 20px',
      background: CD.accentSoft,
      border: `1px solid ${CD.accent}44`,
      borderRadius: 14,
      fontFamily: F.ui, fontSize: 20, color: CD.ink,
      lineHeight: 1.45, letterSpacing: '-0.005em',
    }}>
      {text}
    </div>
  );
}

function ClaudeToolChip({ call, status = 'running' }) {
  const isDone = status === 'done';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '8px 14px',
      background: isDone ? CD.okSoft : CD.accentSoft,
      border: `1px solid ${(isDone ? CD.ok : CD.accent)}44`,
      borderRadius: 999,
      fontFamily: F.mono, fontSize: 14,
      color: isDone ? CD.ok : CD.accent, fontWeight: 500,
      transition: 'all 300ms',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: 4,
        background: isDone ? CD.ok : CD.accent,
        boxShadow: `0 0 8px ${isDone ? CD.ok : CD.accent}`,
      }}/>
      {call}
      {isDone && <span style={{ marginLeft: 4 }}>✓</span>}
    </div>
  );
}

function ClaudeResponseBlock({ linesShown, highlightAdr = false }) {
  // Each item is a logical paragraph or line. Some lines have inline highlights.
  const lines = [
    { kind: 'lead',   text: 'You handle PCI-scoped card data in three places, all routed through ' },
    { kind: 'leadFile', text: 'lib/pci/scope.go' },
    { kind: 'lead2',  text: ':' },
    { kind: 'gap' },
    { kind: 'numbered', n: '1', text: 'services/payments/checkout.go:142', body: ' — accepts the PAN at the boundary, immediately tokenizes via your Vault provider.' },
    { kind: 'numbered', n: '2', text: 'services/refunds/processor.go:88', body: ' — re-vaults the token on partial refunds.' },
    { kind: 'numbered', n: '3', text: 'services/admin/cardholder_lookup.go:34', body: ' — read-path, returns only the last-4.' },
    { kind: 'gap' },
    { kind: 'closing', text: 'For logging, ', emphasis: 'ADR-031', tail: ' mandates that any function touching the CardData struct emit through ', code: 'lib/audit/redact.go', tail2: '. PAN is masked to last-4, CVV is suppressed, expiry year-only. Enforcement is automated via a CI lint check that fails any new code bypassing the redactor.' },
    { kind: 'gap' },
    { kind: 'scope', text: "You're SAQ-D scope today. Your last quarterly attestation references this control structure." },
  ];

  const visible = lines.slice(0, linesShown);

  return (
    <div style={{
      fontFamily: F.ui, fontSize: 19, color: CD.ink,
      lineHeight: 1.55, letterSpacing: '-0.003em',
      paddingLeft: 16,
      borderLeft: `2px solid ${CD.accent}33`,
      overflow: 'hidden',
    }}>
      {visible.map((l, i) => {
        if (l.kind === 'gap') return <div key={i} style={{ height: 12 }}/>;
        if (l.kind === 'lead' || l.kind === 'lead2') {
          return <span key={i}>{l.text}</span>;
        }
        if (l.kind === 'leadFile') {
          return <code key={i} style={{
            fontFamily: F.mono, fontSize: 16, color: CD.accent,
            background: CD.accentSoft, padding: '2px 6px', borderRadius: 4,
          }}>{l.text}</code>;
        }
        if (l.kind === 'numbered') {
          return (
            <div key={i} style={{ marginTop: 6, marginBottom: 6 }}>
              <strong style={{ color: CD.ink, fontWeight: 600 }}>{l.n}.</strong>{' '}
              <code style={{
                fontFamily: F.mono, fontSize: 16, color: CD.accent,
                background: CD.accentSoft, padding: '2px 6px', borderRadius: 4,
              }}>{l.text}</code>
              <span style={{ color: CD.inkDim }}>{l.body}</span>
            </div>
          );
        }
        if (l.kind === 'closing') {
          return (
            <div key={i} style={{ marginTop: 8 }}>
              <span style={{ color: CD.inkDim }}>{l.text}</span>
              <strong style={{
                fontWeight: 700,
                color: highlightAdr ? CD.ok : CD.ink,
                background: highlightAdr ? CD.okSoft : 'transparent',
                padding: highlightAdr ? '2px 6px' : 0,
                borderRadius: 4,
                transition: 'all 300ms',
              }}>{l.emphasis}</strong>
              <span style={{ color: CD.inkDim }}>{l.tail}</span>
              <code style={{
                fontFamily: F.mono, fontSize: 16, color: CD.accent,
                background: CD.accentSoft, padding: '2px 6px', borderRadius: 4,
              }}>{l.code}</code>
              <span style={{ color: CD.inkDim }}>{l.tail2}</span>
            </div>
          );
        }
        if (l.kind === 'scope') {
          return (
            <div key={i} style={{
              marginTop: 8,
              fontFamily: F.ui, fontSize: 18, fontStyle: 'italic',
              color: CD.inkDim, letterSpacing: '-0.005em',
            }}>
              {l.text}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function ClaudeInputBox({ text = '' }) {
  return (
    <div style={{
      flexShrink: 0,
      padding: '16px 60px 32px',
    }}>
      <div style={{
        padding: '16px 22px',
        background: CD.panel,
        border: `1px solid ${CD.rule}`,
        borderRadius: 14,
        fontFamily: F.ui, fontSize: 18, color: text ? CD.ink : CD.inkFaint,
        display: 'flex', alignItems: 'center',
      }}>
        {text || 'Reply to Claude...'}
      </div>
    </div>
  );
}

Object.assign(window, {
  C, F, I, CD,
  BrowserFrame, SettingsHeader, AdminNav,
  ProfileCard, Card, CardHeader,
  ApiKeysHeader, InfoBanner, EmptyKeysState, ActiveKeyRow,
  ModalOverlay, CreateModalForm, CreateModalReveal,
  ConnectionGuideCollapsed, ConnectionGuideExpanded, ClaudeDesktopSnippet,
  ClaudeDesktopWindow, ClaudeSidebar, ClaudeMainArea,
  ClaudeUserMessage, ClaudeToolChip, ClaudeResponseBlock, ClaudeInputBox,
});
