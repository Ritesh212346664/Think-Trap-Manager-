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
`;

// ============================================================
// MOCK DATA (fallback only)
// ============================================================
const MOCK_VIDEOS = [
  { id: 1, title: "जो लोग सुबह 5 बजे उठते हैं उनके साथ क्या होता है?", views: "284K", likes: "18.4K", comments: "1.2K", ctr: 8.4, duration: "8:12", date: "2025-01-15" },
  // ... baaki mock videos agar chahiye to daal dena
];

// ============================================================
// MINI COMPONENTS
// ============================================================
function AIButton({ label, onClick, loading, className = "btn btn-primary" }) {
  return (
    <button className={className} onClick={onClick} disabled={loading}>
      {loading ? <span className="spinner" /> : "✦"}
      {loading ? "Processing..." : label}
    </button>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value || "—"}</div>
    </div>
  );
}

// ============================================================
// CONNECT PAGE
// ============================================================
function PageConnect({ connected, setConnected, channelInfo, setChannelInfo, fetchChannelData }) {
  const [channelId, setChannelId] = useState(localStorage.getItem("tt_channelid") || "");
  const [apiKey, setApiKey] = useState(localStorage.getItem("tt_apikey") || "");
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    if (!channelId || !apiKey) {
      alert("Channel ID aur API Key dono daal do bhai!");
      return;
    }

    setLoading(true);

    try {
      // Pehle basic channel info fetch kar lenge
      const url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=\( {channelId}&key= \){apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      if (!data.items?.length) throw new Error("Channel nahi mila – ID check kar");

      const ch = data.items[0];
      const name = ch.snippet.title;
      const handle = ch.snippet.customUrl || `@${name.replace(/\s+/g, '').toLowerCase()}`;
      const thumbnail = ch.snippet.thumbnails?.medium?.url || ch.snippet.thumbnails?.default?.url;

      localStorage.setItem("tt_apikey", apiKey);
      localStorage.setItem("tt_channelid", channelId);
      localStorage.setItem("tt_channelname", name);
      localStorage.setItem("tt_channelhandle", handle);
      localStorage.setItem("tt_channelthumbnail", thumbnail);

      setChannelInfo({ name, handle, thumbnail, apiKey, channelId });
      setConnected(true);

      // Ab full live data fetch
      await fetchChannelData(apiKey, channelId);

      alert(`Connected! → ${name}`);
    } catch (err) {
      alert("Connect fail: " + err.message + "\nAPI key ya channel ID galat lag raha hai.");
    } finally {
      setLoading(false);
    }
  }

  function disconnect() {
    localStorage.clear(); // ya sirf specific keys remove kar sakte ho
    setConnected(false);
    setChannelInfo(null);
  }

  return (
    <div className="page fade-in">
      <div className="glow-line" />
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🔗 YouTube Channel Connect</div>
              <div className="card-sub">Live stats & videos fetch honge</div>
            </div>
            {connected && <span className="connected-badge"><span className="dot-pulse" /> LIVE</span>}
          </div>

          {!connected ? (
            <>
              <div className="form-group">
                <div className="label">Channel ID *</div>
                <input className="input" placeholder="UCxxxxxxxxxxxxxxxxxxxxxx" value={channelId} onChange={e => setChannelId(e.target.value.trim())} />
              </div>

              <div className="form-group">
                <div className="label">YouTube Data API v3 Key *</div>
                <input className="input" type="password" placeholder="AIzaSy..." value={apiKey} onChange={e => setApiKey(e.target.value.trim())} />
              </div>

              <AIButton label="Connect & Fetch Live Data" onClick={handleConnect} loading={loading} />

              <p style={{ fontSize: 12, color: "var(--sub)", marginTop: 16 }}>
                Channel ID video URL se milta hai.<br/>
                API Key → https://console.cloud.google.com/apis/library/youtube.googleapis.com
              </p>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                {channelInfo?.thumbnail && (
                  <img src={channelInfo.thumbnail} alt="Channel" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
                )}
                <div>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>{channelInfo?.name}</div>
                  <div style={{ color: "var(--sub)" }}>{channelInfo?.handle}</div>
                </div>
              </div>
              <button className="btn btn-ghost" onClick={disconnect}>Disconnect</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [connected, setConnected] = useState(!!localStorage.getItem("tt_apikey"));
  const [channelInfo, setChannelInfo] = useState(() => {
    const name = localStorage.getItem("tt_channelname");
    const handle = localStorage.getItem("tt_channelhandle");
    const thumbnail = localStorage.getItem("tt_channelthumbnail");
    const apiKey = localStorage.getItem("tt_apikey");
    const channelId = localStorage.getItem("tt_channelid");
    return name && apiKey && channelId ? { name, handle, thumbnail, apiKey, channelId } : null;
  });

  const [channelStats, setChannelStats] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  async function fetchChannelData(apiKey, channelId) {
    if (!apiKey || !channelId) return;

    setLoadingData(true);

    try {
      // ── Channel statistics ──
      const statsUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=\( {channelId}&key= \){apiKey}`;
      const statsRes = await fetch(statsUrl);
      if (!statsRes.ok) throw new Error("Channel stats failed");
      const statsData = await statsRes.json();

      if (statsData.items?.[0]) {
        const item = statsData.items[0];
        setChannelStats({
          subscribers: Number(item.statistics.subscriberCount || 0).toLocaleString(),
          totalViews: Number(item.statistics.viewCount || 0).toLocaleString(),
          videoCount: Number(item.statistics.videoCount || 0).toLocaleString(),
        });

        // Update channel info if needed
        setChannelInfo(prev => ({
          ...prev,
          name: item.snippet?.title || prev.name,
          handle: item.snippet?.customUrl || prev.handle,
          thumbnail: item.snippet?.thumbnails?.medium?.url || prev.thumbnail,
        }));
      }

      // ── Recent videos ──
      const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=\( {channelId}&maxResults=8&order=date&type=video&key= \){apiKey}`;
      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) throw new Error("Video search failed");
      const searchData = await searchRes.json();

      if (searchData.items?.length) {
        const videoIds = searchData.items.map(v => v.id.videoId).join(",");
        const detailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=\( {videoIds}&key= \){apiKey}`;
        const detailsRes = await fetch(detailsUrl);
        const detailsData = await detailsRes.json();

        const videos = detailsData.items.map(item => {
          const dur = item.contentDetails?.duration || "PT0M0S";
          const matchM = dur.match(/PT(\d+)M/);
          const matchS = dur.match(/(\d+)S/);
          const min = matchM ? matchM[1] : "0";
          const sec = matchS ? matchS[1].padStart(2, "0") : "00";

          return {
            id: item.id,
            title: item.snippet.title,
            views: Number(item.statistics?.viewCount || 0).toLocaleString(),
            likes: Number(item.statistics?.likeCount || 0).toLocaleString(),
            comments: Number(item.statistics?.commentCount || 0).toLocaleString(),
            duration: `\( {min}: \){sec}`,
            date: new Date(item.snippet.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
          };
        });

        setRecentVideos(videos);
      }
    } catch (err) {
      console.error("Live fetch error:", err);
      // alert mat daal dena production mein – silent fail better
    } finally {
      setLoadingData(false);
    }
  }

  // Auto fetch jab app khule aur connected ho
  useEffect(() => {
    if (connected && channelInfo?.apiKey && channelInfo?.channelId) {
      fetchChannelData(channelInfo.apiKey, channelInfo.channelId);
    }
  }, [connected]);

  const [activePage, setActivePage] = useState("dashboard");

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* ── Sidebar ── */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <h1>THINK TRAP</h1>
            <p>Dashboard</p>
          </div>

          <div className="nav-section">
            <div className="nav-label">Main</div>
            <div className={`nav-item ${activePage === "dashboard" ? "active" : ""}`} onClick={() => setActivePage("dashboard")}>
              <span className="nav-icon">📊</span> Dashboard
            </div>
            <div className={`nav-item ${activePage === "connect" ? "active" : ""}`} onClick={() => setActivePage("connect")}>
              <span className="nav-icon">🔗</span> Connect Channel
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">
              {activePage === "dashboard" ? "Dashboard" : "Connect Channel"}
            </div>
          </div>

          {activePage === "connect" ? (
            <PageConnect
              connected={connected}
              setConnected={setConnected}
              channelInfo={channelInfo}
              setChannelInfo={setChannelInfo}
              fetchChannelData={fetchChannelData}
            />
          ) : (
            <div className="page">
              {!connected ? (
                <div className="card" style={{ textAlign: "center", padding: 40 }}>
                  <h2>Channel Connect nahi hai</h2>
                  <p>Sidebar se "Connect Channel" select kar ke API key daal do.</p>
                </div>
              ) : (
                <>
                  <div className="grid-3" style={{ marginBottom: 32 }}>
                    <StatCard label="Subscribers" value={channelStats?.subscribers} />
                    <StatCard label="Total Views" value={channelStats?.totalViews} />
                    <StatCard label="Videos" value={channelStats?.videoCount} />
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Recent Videos</div>
                      {loadingData && <span className="spinner" />}
                    </div>

                    {recentVideos.length === 0 ? (
                      <p style={{ color: "var(--sub)" }}>No recent videos found or still loading...</p>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                            <th style={{ padding: "12px 8px" }}>Title</th>
                            <th style={{ padding: "12px 8px" }}>Views</th>
                            <th style={{ padding: "12px 8px" }}>Likes</th>
                            <th style={{ padding: "12px 8px" }}>Comments</th>
                            <th style={{ padding: "12px 8px" }}>Duration</th>
                            <th style={{ padding: "12px 8px" }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentVideos.map(v => (
                            <tr key={v.id} style={{ borderBottom: "1px solid var(--border)" }}>
                              <td style={{ padding: "12px 8px" }}>{v.title}</td>
                              <td style={{ padding: "12px 8px" }}>{v.views}</td>
                              <td style={{ padding: "12px 8px" }}>{v.likes}</td>
                              <td style={{ padding: "12px 8px" }}>{v.comments}</td>
                              <td style={{ padding: "12px 8px" }}>{v.duration}</td>
                              <td style={{ padding: "12px 8px" }}>{v.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}.sidebar-logo p { font-size: 11px; color: var(--sub); letter-spacing: 1px; margin-top: 2px; text-transform: uppercase; }

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
`;

// ============================================================
// MOCK DATA (fallback only)
// ============================================================
const MOCK_VIDEOS = [
  { id: 1, title: "जो लोग सुबह 5 बजे उठते हैं उनके साथ क्या होता है?", views: "284K", likes: "18.4K", comments: "1.2K", ctr: 8.4, duration: "8:12", date: "2025-01-15" },
  // ... baaki mock videos agar chahiye to daal dena
];

// ============================================================
// MINI COMPONENTS
// ============================================================
function AIButton({ label, onClick, loading, className = "btn btn-primary" }) {
  return (
    <button className={className} onClick={onClick} disabled={loading}>
      {loading ? <span className="spinner" /> : "✦"}
      {loading ? "Processing..." : label}
    </button>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value || "—"}</div>
    </div>
  );
}

// ============================================================
// CONNECT PAGE
// ============================================================
function PageConnect({ connected, setConnected, channelInfo, setChannelInfo, fetchChannelData }) {
  const [channelId, setChannelId] = useState(localStorage.getItem("tt_channelid") || "");
  const [apiKey, setApiKey] = useState(localStorage.getItem("tt_apikey") || "");
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    if (!channelId || !apiKey) {
      alert("Channel ID aur API Key dono daal do bhai!");
      return;
    }

    setLoading(true);

    try {
      // Pehle basic channel info fetch kar lenge
      const url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=\( {channelId}&key= \){apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      if (!data.items?.length) throw new Error("Channel nahi mila – ID check kar");

      const ch = data.items[0];
      const name = ch.snippet.title;
      const handle = ch.snippet.customUrl || `@${name.replace(/\s+/g, '').toLowerCase()}`;
      const thumbnail = ch.snippet.thumbnails?.medium?.url || ch.snippet.thumbnails?.default?.url;

      localStorage.setItem("tt_apikey", apiKey);
      localStorage.setItem("tt_channelid", channelId);
      localStorage.setItem("tt_channelname", name);
      localStorage.setItem("tt_channelhandle", handle);
      localStorage.setItem("tt_channelthumbnail", thumbnail);

      setChannelInfo({ name, handle, thumbnail, apiKey, channelId });
      setConnected(true);

      // Ab full live data fetch
      await fetchChannelData(apiKey, channelId);

      alert(`Connected! → ${name}`);
    } catch (err) {
      alert("Connect fail: " + err.message + "\nAPI key ya channel ID galat lag raha hai.");
    } finally {
      setLoading(false);
    }
  }

  function disconnect() {
    localStorage.clear(); // ya sirf specific keys remove kar sakte ho
    setConnected(false);
    setChannelInfo(null);
  }

  return (
    <div className="page fade-in">
      <div className="glow-line" />
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🔗 YouTube Channel Connect</div>
              <div className="card-sub">Live stats & videos fetch honge</div>
            </div>
            {connected && <span className="connected-badge"><span className="dot-pulse" /> LIVE</span>}
          </div>

          {!connected ? (
            <>
              <div className="form-group">
                <div className="label">Channel ID *</div>
                <input className="input" placeholder="UCxxxxxxxxxxxxxxxxxxxxxx" value={channelId} onChange={e => setChannelId(e.target.value.trim())} />
              </div>

              <div className="form-group">
                <div className="label">YouTube Data API v3 Key *</div>
                <input className="input" type="password" placeholder="AIzaSy..." value={apiKey} onChange={e => setApiKey(e.target.value.trim())} />
              </div>

              <AIButton label="Connect & Fetch Live Data" onClick={handleConnect} loading={loading} />

              <p style={{ fontSize: 12, color: "var(--sub)", marginTop: 16 }}>
                Channel ID video URL se milta hai.<br/>
                API Key → https://console.cloud.google.com/apis/library/youtube.googleapis.com
              </p>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                {channelInfo?.thumbnail && (
                  <img src={channelInfo.thumbnail} alt="Channel" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
                )}
                <div>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>{channelInfo?.name}</div>
                  <div style={{ color: "var(--sub)" }}>{channelInfo?.handle}</div>
                </div>
              </div>
              <button className="btn btn-ghost" onClick={disconnect}>Disconnect</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [connected, setConnected] = useState(!!localStorage.getItem("tt_apikey"));
  const [channelInfo, setChannelInfo] = useState(() => {
    const name = localStorage.getItem("tt_channelname");
    const handle = localStorage.getItem("tt_channelhandle");
    const thumbnail = localStorage.getItem("tt_channelthumbnail");
    const apiKey = localStorage.getItem("tt_apikey");
    const channelId = localStorage.getItem("tt_channelid");
    return name && apiKey && channelId ? { name, handle, thumbnail, apiKey, channelId } : null;
  });

  const [channelStats, setChannelStats] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  async function fetchChannelData(apiKey, channelId) {
    if (!apiKey || !channelId) return;

    setLoadingData(true);

    try {
      // ── Channel statistics ──
      const statsUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=\( {channelId}&key= \){apiKey}`;
      const statsRes = await fetch(statsUrl);
      if (!statsRes.ok) throw new Error("Channel stats failed");
      const statsData = await statsRes.json();

      if (statsData.items?.[0]) {
        const item = statsData.items[0];
        setChannelStats({
          subscribers: Number(item.statistics.subscriberCount || 0).toLocaleString(),
          totalViews: Number(item.statistics.viewCount || 0).toLocaleString(),
          videoCount: Number(item.statistics.videoCount || 0).toLocaleString(),
        });

        // Update channel info if needed
        setChannelInfo(prev => ({
          ...prev,
          name: item.snippet?.title || prev.name,
          handle: item.snippet?.customUrl || prev.handle,
          thumbnail: item.snippet?.thumbnails?.medium?.url || prev.thumbnail,
        }));
      }

      // ── Recent videos ──
      const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=\( {channelId}&maxResults=8&order=date&type=video&key= \){apiKey}`;
      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) throw new Error("Video search failed");
      const searchData = await searchRes.json();

      if (searchData.items?.length) {
        const videoIds = searchData.items.map(v => v.id.videoId).join(",");
        const detailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=\( {videoIds}&key= \){apiKey}`;
        const detailsRes = await fetch(detailsUrl);
        const detailsData = await detailsRes.json();

        const videos = detailsData.items.map(item => {
          const dur = item.contentDetails?.duration || "PT0M0S";
          const matchM = dur.match(/PT(\d+)M/);
          const matchS = dur.match(/(\d+)S/);
          const min = matchM ? matchM[1] : "0";
          const sec = matchS ? matchS[1].padStart(2, "0") : "00";

          return {
            id: item.id,
            title: item.snippet.title,
            views: Number(item.statistics?.viewCount || 0).toLocaleString(),
            likes: Number(item.statistics?.likeCount || 0).toLocaleString(),
            comments: Number(item.statistics?.commentCount || 0).toLocaleString(),
            duration: `\( {min}: \){sec}`,
            date: new Date(item.snippet.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
          };
        });

        setRecentVideos(videos);
      }
    } catch (err) {
      console.error("Live fetch error:", err);
      // alert mat daal dena production mein – silent fail better
    } finally {
      setLoadingData(false);
    }
  }

  // Auto fetch jab app khule aur connected ho
  useEffect(() => {
    if (connected && channelInfo?.apiKey && channelInfo?.channelId) {
      fetchChannelData(channelInfo.apiKey, channelInfo.channelId);
    }
  }, [connected]);

  const [activePage, setActivePage] = useState("dashboard");

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* ── Sidebar ── */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <h1>THINK TRAP</h1>
            <p>Dashboard</p>
          </div>

          <div className="nav-section">
            <div className="nav-label">Main</div>
            <div className={`nav-item ${activePage === "dashboard" ? "active" : ""}`} onClick={() => setActivePage("dashboard")}>
              <span className="nav-icon">📊</span> Dashboard
            </div>
            <div className={`nav-item ${activePage === "connect" ? "active" : ""}`} onClick={() => setActivePage("connect")}>
              <span className="nav-icon">🔗</span> Connect Channel
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">
              {activePage === "dashboard" ? "Dashboard" : "Connect Channel"}
            </div>
          </div>

          {activePage === "connect" ? (
            <PageConnect
              connected={connected}
              setConnected={setConnected}
              channelInfo={channelInfo}
              setChannelInfo={setChannelInfo}
              fetchChannelData={fetchChannelData}
            />
          ) : (
            <div className="page">
              {!connected ? (
                <div className="card" style={{ textAlign: "center", padding: 40 }}>
                  <h2>Channel Connect nahi hai</h2>
                  <p>Sidebar se "Connect Channel" select kar ke API key daal do.</p>
                </div>
              ) : (
                <>
                  <div className="grid-3" style={{ marginBottom: 32 }}>
                    <StatCard label="Subscribers" value={channelStats?.subscribers} />
                    <StatCard label="Total Views" value={channelStats?.totalViews} />
                    <StatCard label="Videos" value={channelStats?.videoCount} />
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Recent Videos</div>
                      {loadingData && <span className="spinner" />}
                    </div>

                    {recentVideos.length === 0 ? (
                      <p style={{ color: "var(--sub)" }}>No recent videos found or still loading...</p>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                            <th style={{ padding: "12px 8px" }}>Title</th>
                            <th style={{ padding: "12px 8px" }}>Views</th>
                            <th style={{ padding: "12px 8px" }}>Likes</th>
                            <th style={{ padding: "12px 8px" }}>Comments</th>
                            <th style={{ padding: "12px 8px" }}>Duration</th>
                            <th style={{ padding: "12px 8px" }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentVideos.map(v => (
                            <tr key={v.id} style={{ borderBottom: "1px solid var(--border)" }}>
                              <td style={{ padding: "12px 8px" }}>{v.title}</td>
                              <td style={{ padding: "12px 8px" }}>{v.views}</td>
                              <td style={{ padding: "12px 8px" }}>{v.likes}</td>
                              <td style={{ padding: "12px 8px" }}>{v.comments}</td>
                              <td style={{ padding: "12px 8px" }}>{v.duration}</td>
                              <td style={{ padding: "12px 8px" }}>{v.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
