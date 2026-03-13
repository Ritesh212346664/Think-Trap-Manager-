import { useState, useEffect } from "react";

// ============================================================
// DESIGN SYSTEM CSS (same as original, short for space)
// ============================================================
const CSS = `
/* paste your full original CSS here - no change needed */
`;

// ============================================================
// HARD CODED YOUR CHANNEL & KEY (auto connect & fetch)
// ============================================================
const YOUR_CHANNEL_ID = "UCtnTosDIBsRWTUMrmXsEYj";
const YOUR_API_KEY = "AIzaSyBpriF7Ncmtw0qfFSh6lG6Sa17oQXLXaJA";

// ============================================================
// STATE & REAL FETCH (no mock data anymore)
// ============================================================
function App() {
  const [channelStats, setChannelStats] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadYourChannelData() {
      setLoading(true);
      setError(null);

      try {
        // Channel Stats (subs, views, video count)
        const statsRes = await fetch(
          `https://youtube.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=\( {YOUR_CHANNEL_ID}&key= \){YOUR_API_KEY}`
        );
        const statsData = await statsRes.json();

        if (!statsData.items?.length) throw new Error("Channel not found or invalid ID/key");

        const item = statsData.items[0];
        setChannelStats({
          name: item.snippet.title,
          handle: item.snippet.customUrl ? `@${item.snippet.customUrl}` : "N/A",
          thumbnail: item.snippet.thumbnails?.medium?.url || "",
          subscribers: Number(item.statistics.subscriberCount || 0).toLocaleString() + "K",
          totalViews: Number(item.statistics.viewCount || 0).toLocaleString() + " views",
          videoCount: Number(item.statistics.videoCount || 0).toLocaleString(),
        });

        // Recent Videos (top/latest from your channel)
        const searchRes = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=\( {YOUR_CHANNEL_ID}&maxResults=10&order=date&type=video&key= \){YOUR_API_KEY}`
        );
        const searchData = await searchRes.json();

        if (searchData.items?.length) {
          const videoIds = searchData.items.map(v => v.id.videoId).join(",");
          const detailsRes = await fetch(
            `https://youtube.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=\( {videoIds}&key= \){YOUR_API_KEY}`
          );
          const detailsData = await detailsRes.json();

          const videos = detailsData.items.map(v => {
            const dur = v.contentDetails?.duration || "PT0M0S";
            const m = dur.match(/(\d+)M/)?.[1] || "0";
            const s = dur.match(/(\d+)S/)?.[1]?.padStart(2, "0") || "00";
            return {
              title: v.snippet.title,
              views: Number(v.statistics?.viewCount || 0).toLocaleString(),
              likes: Number(v.statistics?.likeCount || 0).toLocaleString(),
              comments: Number(v.statistics?.commentCount || 0).toLocaleString(),
              duration: `\( {m}: \){s}`,
              date: new Date(v.snippet.publishedAt).toLocaleDateString(),
            };
          });
          setRecentVideos(videos);
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      }
      setLoading(false);
    }

    loadYourChannelData();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Sidebar same as original */}
        <div className="sidebar">
          {/* your original sidebar code */}
          <div className="sidebar-logo">
            <h1>THINK TRAP</h1>
            <p>AI YouTube Manager</p>
          </div>
          {/* ... rest of sidebar */}
        </div>

        <div className="main">
          <div className="topbar">
            <div className="topbar-title">DASHBOARD (Your Channel Live)</div>
          </div>

          <div className="page">
            {loading ? (
              <div style={{ textAlign: "center", padding: "100px 0" }}>
                <span className="spinner" style={{ width: "40px", height: "40px" }} /> Loading your real channel data...
              </div>
            ) : error ? (
              <div className="card" style={{ textAlign: "center", color: "var(--accent)" }}>
                Error: {error}<br />
                Check console (F12) or try new API key / correct Channel ID.
              </div>
            ) : (
              <>
                {/* Your Channel Info Header */}
                <div className="card" style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {channelStats?.thumbnail && (
                      <img src={channelStats.thumbnail} alt="" style={{ width: 80, height: 80, borderRadius: "50%" }} />
                    )}
                    <div>
                      <h2 style={{ margin: 0 }}>{channelStats?.name || "Your Channel"}</h2>
                      <p style={{ color: "var(--sub)", margin: "4px 0 0" }}>{channelStats?.handle}</p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid - Real Data */}
                <div className="grid-4" style={{ marginBottom: 32 }}>
                  <div className="stat-card">
                    <div className="stat-label">SUBSCRIBERS</div>
                    <div className="stat-value">{channelStats?.subscribers || "—"}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">TOTAL VIEWS</div>
                    <div className="stat-value">{channelStats?.totalViews || "—"}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">VIDEOS</div>
                    <div className="stat-value">{channelStats?.videoCount || "—"}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">WATCH TIME</div>
                    <div className="stat-value">Calculating...</div> {/* Exact needs Analytics API */}
                  </div>
                </div>

                {/* Recent / Top Videos Table - Real from your channel */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">YOUR RECENT VIDEOS (Live Data)</div>
                  </div>
                  {recentVideos.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Views</th>
                          <th>Likes</th>
                          <th>Comments</th>
                          <th>Duration</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentVideos.map((v, i) => (
                          <tr key={i}>
                            <td>{v.title}</td>
                            <td>{v.views}</td>
                            <td>{v.likes}</td>
                            <td>{v.comments}</td>
                            <td>{v.duration}</td>
                            <td>{v.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No videos found or loading...</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
