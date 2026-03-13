import { useState, useEffect, useRef } from "react";

// ============================================================
// DESIGN SYSTEM — cinematic dark, neon-crimson accent
// ============================================================
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #090b0f;
  --surface:  #0f1318;
  --card:     #141921;
  --border:   #1e2530;
  --muted:    #2a3345;
  --accent:   #e8293c;
  --accent2:  #ff6b35;
  --gold:     #f5c842;
  --teal:     #00d4aa;
  --text:     #eaf0fb;
  --sub:      #7a8faa;
  --font-h:   'Bebas Neue', sans-serif;
  --font-b:   'DM Sans', sans-serif;
  --font-m:   'JetBrains Mono', monospace;
  --r:        12px;
  --glow:     0 0 24px rgba(232,41,60,0.35);
}

html, body, #root { height: 100%; width: 100%; background: var(--bg); color: var(--text); font-family: var(--font-b); }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

/* Layout */
.app { display: flex; height: 100vh; overflow: hidden; }
.sidebar { width: 220px; min-width: 220px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 0; overflow-y: auto; }
.main { flex: 1; overflow-y: auto; background: var(--bg); }

/* Sidebar */
.sidebar-logo { padding: 24px 20px 16px; border-bottom: 1px solid var(--border); }
.sidebar-logo h1 { font-family: var(--font-h); font-size: 28px; letter-spacing: 2px; color: var(--accent); line-height: 1; }
.sidebar-logo p { font-size: 11px; color: var(--sub); letter-spacing: 1px; margin-top: 2px; text-transform: uppercase; }

.nav-section { padding: 12px 0; }
.nav-label { font-size: 10px; color: var(--sub); letter-spacing: 1.5px; text-transform: uppercase; padding: 6px 20px; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; cursor: pointer; font-size: 13px; font-weight: 500; color: var(--sub); transition: all 0.15s; border-left: 2px solid transparent; }
.nav-item:hover { color: var(--text); background: rgba(255,255,255,0.04); }
.nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(232,41,60,0.08); }
.nav-icon { font-size: 16px; width: 20px; text-align: center; }

/* Top bar */
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; border-bottom: 1px solid var(--border); background: var(--surface); position: sticky; top: 0; z-index: 10; }
.topbar-title { font-family: var(--font-h); font-size: 22px; letter-spacing: 1.5px; }
.topbar-actions { display: flex; gap: 10px; align-items: center; }

/* Buttons */
.btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: var(--r); font-family: var(--font-b); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: none; }
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: #c41f31; box-shadow: var(--glow); }
.btn-ghost { background: transparent; color: var(--sub); border: 1px solid var(--border); }
.btn-ghost:hover { color: var(--text); border-color: var(--muted); }
.btn-teal { background: var(--teal); color: #000; }
.btn-teal:hover { opacity: 0.85; }
.btn-gold { background: var(--gold); color: #000; }
.btn-gold:hover { opacity: 0.85; }
.btn-sm { padding: 6px 13px; font-size: 12px; }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* Cards */
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 20px; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.card-title { font-family: var(--font-h); font-size: 18px; letter-spacing: 1px; color: var(--text); }
.card-sub { font-size: 12px; color: var(--sub); margin-top: 2px; }

/* Grid layouts */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }

/* Stats */
.stat-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 18px 20px; }
.stat-label { font-size: 11px; color: var(--sub); text-transform: uppercase; letter-spacing: 1px; }
.stat-value { font-family: var(--font-h); font-size: 32px; letter-spacing: 1px; margin: 4px 0 2px; }
.stat-change { font-size: 12px; }
.stat-change.up { color: var(--teal); }
.stat-change.down { color: var(--accent); }

/* Chart bar */
.bar-wrap { display: flex; align-items: flex-end; gap: 5px; height: 80px; }
.bar { flex: 1; border-radius: 3px 3px 0 0; transition: all 0.4s; cursor: pointer; }
.bar:hover { opacity: 0.8; }

/* Tags / badges */
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-red { background: rgba(232,41,60,0.15); color: var(--accent); border: 1px solid rgba(232,41,60,0.3); }
.badge-teal { background: rgba(0,212,170,0.12); color: var(--teal); border: 1px solid rgba(0,212,170,0.3); }
.badge-gold { background: rgba(245,200,66,0.12); color: var(--gold); border: 1px solid rgba(245,200,66,0.3); }
.badge-purple { background: rgba(149,128,255,0.12); color: #9580ff; border: 1px solid rgba(149,128,255,0.3); }

/* Forms */
.input, .textarea, .select { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: var(--font-b); font-size: 13px; padding: 10px 14px; width: 100%; outline: none; transition: border 0.15s; }
.input:focus, .textarea:focus, .select:focus { border-color: var(--accent); }
.textarea { resize: vertical; min-height: 100px; }
.select { cursor: pointer; }
.label { font-size: 12px; color: var(--sub); margin-bottom: 6px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group { margin-bottom: 14px; }
option { background: var(--surface); }

/* Page padding */
.page { padding: 24px 28px; }

/* Divider */
.divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }

/* Loading spinner */
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }

/* Glow accent line */
.glow-line { height: 2px; background: linear-gradient(90deg, var(--accent), var(--accent2), transparent); border-radius: 1px; margin-bottom: 20px; }

/* Progress bar */
.progress-bar { height: 6px; background: var(--muted); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 0.5s; }

/* Timeline */
.timeline-item { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border); }
.timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); margin-top: 4px; flex-shrink: 0; }

/* Topic cards */
.topic-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: all 0.15s; }
.topic-card:hover { border-color: var(--accent); background: rgba(232,41,60,0.05); }

/* AI response box */
.ai-box { background: rgba(0,212,170,0.05); border: 1px solid rgba(0,212,170,0.2); border-radius: var(--r); padding: 16px; font-size: 13px; line-height: 1.7; color: var(--text); white-space: pre-wrap; font-family: var(--font-b); }

/* Script display */
.script-section { margin-bottom: 16px; }
.script-section-label { font-family: var(--font-h); font-size: 14px; letter-spacing: 1px; color: var(--accent); margin-bottom: 6px; }
.script-text { font-size: 13px; line-height: 1.8; color: var(--text); }

/* Calendar grid */
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.cal-day { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 8px; min-height: 80px; font-size: 11px; }
.cal-day.has-post { border-color: var(--accent); background: rgba(232,41,60,0.06); }
.cal-day-num { font-family: var(--font-h); font-size: 16px; color: var(--sub); }
.cal-post { background: var(--accent); color: #fff; border-radius: 4px; padding: 2px 5px; font-size: 10px; margin-top: 4px; }

/* Thumbnail preview */
.thumb-preview { width: 100%; aspect-ratio: 16/9; border-radius: 10px; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; }

/* Tabs */
.tabs { display: flex; gap: 4px; background: var(--surface); padding: 4px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border); }
.tab { flex: 1; padding: 8px; text-align: center; font-size: 12px; font-weight: 600; border-radius: 7px; cursor: pointer; transition: all 0.15s; color: var(--sub); }
.tab.active { background: var(--accent); color: #fff; }

/* Connection status */
.connected-badge { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(0,212,170,0.1); border: 1px solid rgba(0,212,170,0.3); border-radius: 20px; font-size: 12px; color: var(--teal); font-weight: 600; }
.dot-pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--teal); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

/* Responsive */
@media (max-width: 900px) {
  .sidebar { display: none; }
  .grid-4 { grid-template-columns: 1fr 1fr; }
  .grid-3 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .page { padding: 16px; }
}

/* Animations */
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-in { animation: fadeIn 0.3s ease; }

/* Upload progress */
.upload-step { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.step-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.step-done { background: rgba(0,212,170,0.15); color: var(--teal); }
.step-active { background: rgba(232,41,60,0.15); color: var(--accent); }
.step-wait { background: var(--muted); color: var(--sub); }
`;

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_VIDEOS = [
  { id: 1, title: "जो लोग सुबह 5 बजे उठते हैं उनके साथ क्या होता है?", views: 284000, likes: 18400, comments: 1230, ctr: 8.4, duration: "8:12", date: "2025-01-15", watch: 72 },
  { id: 2, title: "The Dark Psychology Behind Social Media Addiction", views: 192000, likes: 12800, comments: 890, ctr: 6.9, duration: "7:45", date: "2025-01-22", watch: 68 },
  { id: 3, title: "Mind Trap #12 — Why You Procrastinate EVERYTHING", views: 456000, likes: 31200, comments: 2100, ctr: 11.2, duration: "9:03", date: "2025-01-29", watch: 81 },
  { id: 4, title: "Hinglish: Dopamine Detox क्यों करना चाहिए", views: 143000, likes: 9800, comments: 672, ctr: 5.8, duration: "6:30", date: "2025-02-05", watch: 64 },
  { id: 5, title: "The Sunk Cost Fallacy — Stop Wasting Your Life", views: 321000, likes: 21300, comments: 1540, ctr: 9.7, duration: "8:55", date: "2025-02-12", watch: 77 },
];

const MOCK_WEEKLY = [65, 72, 58, 81, 74, 90, 83];
const MOCK_SUBS = [1200, 1800, 2400, 3100, 3800, 4900, 6200, 7800];
const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];

const TOPICS = [
  { id:1, title:"The Mirror Effect — Why We Hate What We See in Others", hook:"Your biggest enemy might be yourself", pain:"Self-awareness blind spot", score:94, lang:"English", tag:"Psychology" },
  { id:2, title:"दिमाग का सबसे बड़ा जाल — Confirmation Bias", hook:"आप वही देखते हो जो देखना चाहते हो", pain:"Bad decision making", score:91, lang:"Hindi", tag:"Mind Trap" },
  { id:3, title:"Why Smart People Make Dumb Decisions", hook:"Intelligence doesn't protect from bias", pain:"Overthinking trap", score:89, lang:"English", tag:"Self-improvement" },
  { id:4, title:"Ego Depletion — Willpower एक Battery है", hook:"जितना सोचोगे, उतना थकोगे", pain:"Motivation crash", score:87, lang:"Hinglish", tag:"Psychology" },
  { id:5, title:"The Comparison Trap: Social Media vs Reality", hook:"Scroll करते-करते कब खुद से दूर हो गए?", pain:"Inferiority complex", score:85, lang:"Hinglish", tag:"Self-improvement" },
  { id:6, title:"Imposter Syndrome — Success Ke Baad Kyun Darte Ho?", hook:"Why success feels fake", pain:"Self-doubt loop", score:83, lang:"Hinglish", tag:"Mind Trap" },
  { id:7, title:"The Zeigarnik Effect — Unfinished Tasks Haunt You", hook:"Your brain can't let go of incomplete things", pain:"Mental clutter", score:82, lang:"English", tag:"Psychology" },
  { id:8, title:"Dark Triad Personalities — कैसे पहचानें?", hook:"Some people are wired differently", pain:"Toxic relationship damage", score:80, lang:"Hindi", tag:"Psychology" },
];

const VOICE_OPTIONS = [
  { id:"hi-m", label:"Hindi Male", flag:"🇮🇳", desc:"Deep, authoritative" },
  { id:"hi-f", label:"Hindi Female", flag:"🇮🇳", desc:"Warm, conversational" },
  { id:"en-m", label:"English Male", flag:"🇺🇸", desc:"Confident, clear" },
  { id:"en-f", label:"English Female", flag:"🇺🇸", desc:"Engaging, relatable" },
];

const CALENDAR_POSTS = {
  3: { title: "Mind Trap #13", type: "Long" },
  7: { title: "Shorts Clip", type: "Short" },
  10: { title: "Psychology Series", type: "Long" },
  14: { title: "Shorts Clip", type: "Short" },
  17: { title: "Mind Trap #14", type: "Long" },
  21: { title: "Shorts Clip", type: "Short" },
  24: { title: "Hinglish Special", type: "Long" },
  28: { title: "Shorts Clip", type: "Short" },
};

// ============================================================
// MINI CHART
// ============================================================
function BarChart({ data, color = "var(--accent)" }) {
  const max = Math.max(...data);
  return (
    <div className="bar-wrap">
      {data.map((v, i) => (
        <div key={i} className="bar" style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.7 + (i / data.length) * 0.3 }} title={v} />
      ))}
    </div>
  );
}

function LineSparkline({ data, color = "var(--teal)" }) {
  const w = 200, h = 50;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min + 1)) * h}`).join(" ");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================================
// LOADING BUTTON
// ============================================================
function AIButton({ label, onClick, loading, className = "btn btn-primary" }) {
  return (
    <button className={className} onClick={onClick} disabled={loading}>
      {loading ? <span className="spinner" /> : "✦"}
      {loading ? "Generating..." : label}
    </button>
  );
}

// ============================================================
// PAGES
// ============================================================

// — CONNECT CHANNEL
function PageConnect({ connected, setConnected, channelInfo, setChannelInfo }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("tt_apikey") || "");
  const [channelId, setChannelId] = useState(() => localStorage.getItem("tt_channelid") || "");
  const [oauthId, setOauthId] = useState(() => localStorage.getItem("tt_oauthid") || "");
  const [channelName, setChannelName] = useState(() => localStorage.getItem("tt_channelname") || "");
  const [channelHandle, setChannelHandle] = useState(() => localStorage.getItem("tt_channelhandle") || "");
  const [claudeKey, setClaudeKey] = useState(() => localStorage.getItem("tt_claudekey") || "");

  function save() {
    if (!channelName) { alert("Channel name zaroori hai!"); return; }
    localStorage.setItem("tt_apikey", apiKey);
    localStorage.setItem("tt_channelid", channelId);
    localStorage.setItem("tt_oauthid", oauthId);
    localStorage.setItem("tt_channelname", channelName);
    localStorage.setItem("tt_channelhandle", channelHandle);
    localStorage.setItem("tt_claudekey", claudeKey);
    setChannelInfo({ name: channelName, handle: channelHandle, apiKey, channelId, oauthId, claudeKey });
    setConnected(true);
  }

  function disconnect() {
    localStorage.removeItem("tt_apikey");
    localStorage.removeItem("tt_channelid");
    localStorage.removeItem("tt_oauthid");
    localStorage.removeItem("tt_channelname");
    localStorage.removeItem("tt_channelhandle");
    localStorage.removeItem("tt_claudekey");
    setConnected(false);
    setChannelInfo(null);
  }

  return (
    <div className="page fade-in">
      <div className="glow-line" />
      <div style={{ maxWidth: 560 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🔗 Connect YouTube Channel</div>
              <div className="card-sub">Aapki details permanently save ho jaayengi</div>
            </div>
            {connected && <span className="connected-badge"><span className="dot-pulse" /> Connected</span>}
          </div>
          {!connected ? (
            <>
              <div style={{ background: "rgba(245,200,66,0.08)", border: "1px solid rgba(245,200,66,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "var(--gold)" }}>
                💾 Aapki details browser mein save ho jaayengi — har baar daalni nahi padengi!
              </div>
              <div className="form-group">
                <div className="label">Channel Name *</div>
                <input className="input" placeholder="Think Trap" value={channelName} onChange={e => setChannelName(e.target.value)} />
              </div>
              <div className="form-group">
                <div className="label">Channel Handle</div>
                <input className="input" placeholder="@ThinkTrap_4" value={channelHandle} onChange={e => setChannelHandle(e.target.value)} />
              </div>
              <div className="form-group">
                <div className="label">Channel ID</div>
                <input className="input" placeholder="UCtnTosDIBsRWTUMrmXsEYj" value={channelId} onChange={e => setChannelId(e.target.value)} />
              </div>
              <div className="form-group">
                <div className="label">YouTube Data API Key</div>
                <input className="input" placeholder="AIza..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
              </div>
              <div className="form-group">
                <div className="label">OAuth Client ID</div>
                <input className="input" placeholder="xxxxx.apps.googleusercontent.com" value={oauthId} onChange={e => setOauthId(e.target.value)} />
              </div>
              <div className="form-group">
                <div className="label">Claude API Key (AI features ke liye)</div>
                <input className="input" placeholder="sk-ant-..." value={claudeKey} onChange={e => setClaudeKey(e.target.value)} type="password" />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary" onClick={save}>⚡ Save & Connect</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", bac
