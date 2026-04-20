import { NavLink } from "react-router-dom";

function Sidebar({ darkMode, toggleDarkMode }) {
  const links = [
    { to: "/", label: "Home", icon: "⌂" },
    { to: "/write", label: "Write", icon: "✎" },
    { to: "/entries", label: "Entries", icon: "≡" },
    { to: "/stats", label: "Stats", icon: "◎" },
  ];

  const isMobile = window.innerWidth <= 768;

  const navStyle = {
    position: "fixed",
    zIndex: 100,
    background: "rgba(10, 8, 20, 0.7)",
    backdropFilter: "blur(20px)",
    borderColor: "rgba(61, 42, 122, 0.5)",
    ...(isMobile ? {
      bottom: 0, left: 0, right: 0,
      width: "100%", height: "60px",
      borderTop: "1px solid rgba(61, 42, 122, 0.5)",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "0 16px",
    } : {
      top: 0, left: 0,
      width: "58px", minHeight: "100vh",
      borderRight: "1px solid rgba(61, 42, 122, 0.5)",
      flexDirection: "column",
      alignItems: "center",
      padding: "16px 0",
      gap: "4px",
    }),
    display: "flex",
  };

  return (
    <aside style={navStyle}>
      {!isMobile && (
        <div style={{
          width: "34px", height: "34px",
          background: "linear-gradient(135deg, #7c4fe0, #9b6dff)",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff",
          fontFamily: "var(--font-serif)",
          fontSize: "16px", fontWeight: 700,
          marginBottom: "28px",
          boxShadow: "0 4px 16px rgba(155, 109, 255, 0.4)",
        }}>J</div>
      )}

      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          title={label}
          style={({ isActive }) => ({
            width: "38px", height: "38px",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "10px",
            border: isActive ? "1px solid rgba(155,109,255,0.5)" : "1px solid transparent",
            background: isActive ? "rgba(42, 26, 94, 0.8)" : "transparent",
            color: isActive ? "var(--purple)" : "var(--text3)",
            transition: "all 0.2s",
            textDecoration: "none",
            fontSize: "18px",
            boxShadow: isActive ? "0 0 16px rgba(155,109,255,0.2)" : "none",
          })}
        >
          {icon}
        </NavLink>
      ))}

      {!isMobile && <div style={{ flex: 1 }} />}

      <button
        onClick={toggleDarkMode}
        title={darkMode ? "Light mode" : "Dark mode"}
        style={{
          width: "38px", height: "38px",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "10px", fontSize: "15px",
          border: "1px solid var(--border2)",
          background: "transparent",
          color: "var(--text3)", padding: 0,
        }}
      >
        {darkMode ? "☀" : "🌙"}
      </button>
    </aside>
  );
}

export default Sidebar;