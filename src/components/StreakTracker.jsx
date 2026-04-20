import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

function StreakTracker() {
  const [entryDates, setEntryDates] = useState(new Set());
  const [streak, setStreak] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [activeDays, setActiveDays] = useState(0);

  useEffect(() => {
    const journalRef = ref(db, "entries");

    onValue(journalRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setEntryDates(new Set());
        setStreak(0);
        setTotalEntries(0);
        setActiveDays(0);
        return;
      }

      const allEntries = Object.values(data);

      const dateStrings = new Set(
        allEntries.map((item) => new Date(item.date).toDateString())
      );

      setEntryDates(dateStrings);
      setTotalEntries(allEntries.length);
      setActiveDays(dateStrings.size);

      let currentStreak = 0;
      let currentDate = new Date();

      while (true) {
        if (dateStrings.has(currentDate.toDateString())) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    });
  }, []);

  const buildGrid = () => {
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const getColor = (date) => {
    if (entryDates.has(date.toDateString())) {
      return "#378ADD"; // blue — has entry
    }
    return "var(--color-border-tertiary, #e0e0e0)";
  };

  const getMonthLabels = () => {
    const labels = [];
    const today = new Date();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      if (d.getDate() === 1) {
        const weekIndex = Math.floor((364 - i) / 7);
        labels.push({ label: months[d.getMonth()], col: weekIndex });
      }
    }
    return labels;
  };

  const days = buildGrid();
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const monthLabels = getMonthLabels();

  return (
    <div style={{ padding: "16px 0" }}>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: 500, color: "#378ADD" }}>
            {streak}
          </div>
          <div style={{ fontSize: "12px", color: "var(--color-text-secondary, #666)" }}>
            current streak
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: 500, color: "#378ADD" }}>
            {activeDays}
          </div>
          <div style={{ fontSize: "12px", color: "var(--color-text-secondary, #666)" }}>
            active days
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: 500, color: "#378ADD" }}>
            {totalEntries}
          </div>
          <div style={{ fontSize: "12px", color: "var(--color-text-secondary, #666)" }}>
            total entries
          </div>
        </div>
      </div>

      {/* Month labels */}
      <div style={{ display: "flex", marginBottom: "4px", marginLeft: "28px", position: "relative", height: "16px" }}>
        {monthLabels.map(({ label, col }) => (
          <span
            key={label + col}
            style={{
              position: "absolute",
              left: `${col * 14}px`,
              fontSize: "11px",
              color: "var(--color-text-secondary, #888)",
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "flex", gap: "2px", overflowX: "auto" }}>

        {/* Day labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginRight: "4px" }}>
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <div key={i} style={{ height: "12px", fontSize: "10px", color: "var(--color-text-secondary, #888)", lineHeight: "12px" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Week columns */}
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {week.map((day, di) => (
              <div
                key={di}
                title={day.toDateString()}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "2px",
                  backgroundColor: getColor(day),
                  cursor: "default",
                  transition: "transform 0.1s",
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.4)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", justifyContent: "flex-end" }}>
        <span style={{ fontSize: "11px", color: "var(--color-text-secondary, #888)" }}>Less</span>
        <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: "var(--color-border-tertiary, #e0e0e0)" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: "#B5D4F4" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: "#378ADD" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: "#185FA5" }} />
        <span style={{ fontSize: "11px", color: "var(--color-text-secondary, #888)" }}>More</span>
      </div>

    </div>
  );
}

export default StreakTracker;