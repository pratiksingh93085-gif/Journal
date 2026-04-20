import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Write from "./pages/Write";
import Entries from "./pages/Entries";
import Stats from "./pages/Stats";

function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div
      className={darkMode ? "" : "light"}
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
        transition: "background 0.3s",
      }}
    >
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main style={{
        marginLeft: "58px",
        flex: 1,
        padding: "32px 40px",
        maxWidth: "960px",
        width: "100%",
      }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/write" element={<Write />} />
            <Route path="/entries" element={<Entries />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;