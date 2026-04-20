import { useNavigate } from "react-router-dom";
import StreakTracker from "../components/StreakTracker";
import PageTransition from "../components/PageTransition";
import useStats from "../hooks/useStats";

function Home() {
  const navigate = useNavigate();
  const { streak, totalEntries, activeDays } = useStats();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <PageTransition>
      <div className="section-tag">Dashboard</div>
      <h1 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(22px, 5vw, 30px)",
        fontWeight: 700, color: "var(--text)", marginBottom: "4px",
      }}>
        Hello, <span style={{ color: "var(--purple)" }}>writer.</span>
      </h1>
      <p style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "8px", lineHeight: 1.7 }}>
        {today}
      </p>

      <blockquote style={{
        fontFamily: "var(--font-serif)", fontSize: "13px", fontStyle: "italic",
        color: "var(--text3)", borderLeft: "2px solid var(--purple-border)",
        padding: "8px 14px", marginBottom: "22px",
        background: "rgba(19, 15, 36, 0.6)", borderRadius: "0 8px 8px 0",
        lineHeight: 1.7, backdropFilter: "blur(8px)",
      }}>
        "The life of every man is a diary in which he means to write one story, and writes another."
      </blockquote>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        <button
          className="btn-primary"
          onClick={() => navigate("/write")}
          style={{ padding: "8px 20px", borderRadius: "99px", border: "none" }}
        >
          ✦ Write today
        </button>
        <button onClick={() => navigate("/entries")} style={{ padding: "8px 18px" }}>
          Browse entries
        </button>
        <button onClick={() => navigate("/stats")} style={{ padding: "8px 18px" }}>
          View stats
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gap: "10px", marginBottom: "16px",
      }}>
        {[
          [streak, "day streak"],
          [totalEntries, "entries"],
          [activeDays, "active days"],
        ].map(([num, label]) => (
          <div key={label} style={{
            background: "rgba(19, 15, 36, 0.6)",
            border: "1px solid var(--border2)",
            borderRadius: "10px", padding: "14px", textAlign: "center",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{
              fontFamily: "var(--font-serif)", fontSize: "26px",
              fontWeight: 700, color: "var(--purple)",
            }}>{num}</div>
            <div style={{
              fontSize: "10px", color: "var(--text3)",
              textTransform: "uppercase", letterSpacing: "0.08em",
              marginTop: "3px", fontWeight: 600,
            }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-tag">Activity — last 52 weeks</div>
        <StreakTracker />
      </div>
    </PageTransition>
  );
}

export default Home;