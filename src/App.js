import { useState, useEffect } from "react";

function PageConnect() {
  const [apiKey, setApiKey] = useState("");
  const [channelId, setChannelId] = useState("");
  const [connected, setConnected] = useState(false);
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch channel data from YouTube API
  const fetchChannelData = async () => {
    if (!apiKey || !channelId) {
      alert("Please enter API key and Channel ID");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
      );
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const ch = data.items[0];
        setChannelData({
          title: ch.snippet.title,
          subs: ch.statistics.subscriberCount,
          views: ch.statistics.viewCount,
          videos: ch.statistics.videoCount,
          thumbnail: ch.snippet.thumbnails.default.url,
        });
        setConnected(true);
      } else {
        alert("Channel not found. Check Channel ID or API key.");
      }
    } catch (e) {
      alert("Error connecting to YouTube API");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => {
      fetchChannelData();
    }, 30000);
    return () => clearInterval(interval);
  }, [connected]);

  return (
    <div className="page fade-in">
      <div className="glow-line" />
      <div style={{ maxWidth: 560 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🔗 Connect YouTube Channel</div>
              <div className="card-sub">Link your channel to Think Trap</div>
            </div>
            {connected && (
              <span className="connected-badge">
                <span className="dot-pulse" /> Connected
              </span>
            )}
          </div>

          {/* Input section */}
          {!connected && (
            <>
              <div className="form-group">
                <div className="label">YouTube Data API Key</div>
                <input
                  className="input"
                  placeholder="AIza..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div className="form-group">
                <div className="label">Channel ID</div>
                <input
                  className="input"
                  placeholder="UC..."
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn btn-primary"
                  onClick={fetchChannelData}
                  disabled={loading}
                >
                  {loading ? <span className="spinner" /> : "⚡ Connect Channel"}
                </button>
              </div>
            </>
          )}

          {/* Connected channel info */}
          {connected && channelData && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <img
                  src={channelData.thumbnail}
                  alt="Channel"
                  style={{ width: 56, height: 56, borderRadius: "50%" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {channelData.title}
                  </div>
                  <div style={{ color: "var(--sub)", fontSize: 13 }}>
                    Subscribers: {channelData.subs}
                  </div>
                  <div style={{ color: "var(--sub)", fontSize: 13 }}>
                    Total Views: {channelData.views}
                  </div>
                  <div style={{ color: "var(--sub)", fontSize: 13 }}>
                    Total Videos: {channelData.videos}
                  </div>
                  <div style={{ color: "var(--teal)", fontSize: 12, marginTop: 3 }}>
                    ✓ Live Connected
                  </div>
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 16 }}
                onClick={() => {
                  setConnected(false);
                  setChannelData(null);
                  setApiKey("");
                  setChannelId("");
                }}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageConnect;
