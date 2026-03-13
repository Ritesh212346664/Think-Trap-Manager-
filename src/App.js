import { useState, useEffect } from "react";

export default function PageConnect({ connected, setConnected, channelInfo, setChannelInfo }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem("tt_apikey") || "");
  const [channelId, setChannelId] = useState(localStorage.getItem("tt_channelid") || "");
  const [oauthId, setOauthId] = useState(localStorage.getItem("tt_oauthid") || "");
  const [channelName, setChannelName] = useState(localStorage.getItem("tt_channelname") || "");
  const [channelHandle, setChannelHandle] = useState(localStorage.getItem("tt_channelhandle") || "");
  const [claudeKey, setClaudeKey] = useState(localStorage.getItem("tt_claudekey") || "");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  function save() {
    if (!channelName || !channelId || !apiKey) {
      alert("Channel Name, ID aur API Key zaroori hai!");
      return;
    }
    localStorage.setItem("tt_apikey", apiKey);
    localStorage.setItem("tt_channelid", channelId);
    localStorage.setItem("tt_oauthid", oauthId);
    localStorage.setItem("tt_channelname", channelName);
    localStorage.setItem("tt_channelhandle", channelHandle);
    localStorage.setItem("tt_claudekey", claudeKey);

    setChannelInfo({ name: channelName, handle: channelHandle, apiKey, channelId, oauthId, claudeKey });
    setConnected(true);

    fetchVideos();
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
    setVideos([]);
  }

  async function fetchVideos() {
    if (!apiKey || !channelId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`
      );
      const data = await res.json();
      if (data.items) {
        // Map YouTube API data to simplified structure
        const vids = data.items.map(v => ({
          id: v.id.videoId,
          title: v.snippet.title,
          date: v.snippet.publishedAt,
          thumbnail: v.snippet.thumbnails.medium.url,
        }));
        setVideos(vids);
      } else {
        alert("Videos fetch nahi ho paaye! Check API Key aur Channel ID.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching videos!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (connected) fetchVideos();
  }, [connected]);

  return (
    <div className="page fade-in">
      <div className="glow-line" />
      <div style={{ maxWidth: 560 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🔗 Connect YouTube Channel</div>
              <div className="card-sub">Aapki details browser mein safe rahengi</div>
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
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary" onClick={save}>⚡ Save & Connect</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <button className="btn btn-ghost" onClick={disconnect}>🔌 Disconnect</button>
                <button className="btn btn-teal" onClick={fetchVideos}>{loading ? "Fetching..." : "🔄 Refresh Videos"}</button>
              </div>

              <div className="grid-2">
                {videos.length > 0 ? videos.map(v => (
                  <div key={v.id} className="topic-card">
                    <img src={v.thumbnail} alt={v.title} style={{ width: "100%", borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{v.title}</div>
                    <div style={{ fontSize: 11, color: "var(--sub)" }}>{new Date(v.date).toLocaleDateString()}</div>
                  </div>
                )) : <div>No videos found.</div>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
  }
