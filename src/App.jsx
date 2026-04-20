import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

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
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
    >
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} isMobile={isMobile} />
      <main style={{
        marginLeft: isMobile ? "0" : "58px",
        marginBottom: isMobile ? "64px" : "0",
        flex: 1,
        padding: isMobile ? "20px 16px" : "36px 44px",
        width: "100%",
        maxWidth: "960px",
        overflowX: "hidden",
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