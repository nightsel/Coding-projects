import React, { useState, useEffect} from "react";
import ReactDOM from "react-dom/client";
import './style.css';
import Puzzles from "./Puzzles";
import Projects from "./Projects";
import Home from "./Home";
//import About from "./About";


export default function CloudStatus() {
  const [statuses, setStatuses] = useState({
    render: "checking",
    vercel: "checking",
  });

  useEffect(() => {
    const checkStatuses = async () => {
      const newStatuses = { ...statuses };

      // --- Check Render & Supabase via backend ---
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch("https://expressproject-al0i.onrender.com/ping", {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        newStatuses.render = res.ok ? "online" : "offline";
      } catch {
        newStatuses.render = "offline";
      }

      // --- Check Vercel directly ---
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(
          "https://coding-projects-nightsel-nightsels-projects.vercel.app/api/hello",
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        newStatuses.vercel = res.ok ? "online" : "offline";
      } catch {
        newStatuses.vercel = "offline";
      }

      setStatuses(newStatuses);
    };

    checkStatuses();
    const interval = setInterval(checkStatuses, 60000);
    return () => clearInterval(interval);
  }, []);

  const renderDot = (status) => {
    const color =
      status === "online" ? "limegreen" :
      status === "checking" ? "orange" : "red";

    return (
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: color,
          display: "inline-block",
        }}
      ></span>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "6px",
        padding: "4px 8px",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        fontSize: "0.85em",
        color: "black",
      }}
    >
      {/* Heading */}
      <strong style={{ marginBottom: "4px" }}>Cloud Services</strong>

      {/* Render & Supabase */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {renderDot(statuses.render)}
        <span>Render & Supabase</span>
        <span style={{ marginLeft: "6px", fontWeight: "bold" }}>
          {statuses.render.charAt(0).toUpperCase() + statuses.render.slice(1)}
        </span>
      </div>

      {/* Vercel */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {renderDot(statuses.vercel)}
        <span>Vercel</span>
        <span style={{ marginLeft: "6px", fontWeight: "bold" }}>
          {statuses.vercel.charAt(0).toUpperCase() + statuses.vercel.slice(1)}
        </span>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState({ tab: "Home", section: null , key: Date.now()});
  const [forceHighlight, setForceHighlight] = useState(false);


  const renderTabContent = () => {
    switch (activeTab.tab) {
      case "Home":
        return <Home setActiveTab={setActiveTab} />;

      case "Puzzles":
  return <Puzzles section={activeTab.section} forceHighlight={forceHighlight} />;
      case "Projects":
  return <Projects section={activeTab.section} forceHighlight={forceHighlight} />;
      default:
        return null;
    }
  };



  useEffect(() => {
    const pingBackend = () => {
      fetch('https://expressproject-al0i.onrender.com/ping')
        .then(() => console.log("Backend pinged"))
        .catch(() => console.log("Backend ping failed"));
    };


    // Ping every 600 seconds
    const intervalId = setInterval(pingBackend, 600000);

    pingBackend();

    return () => clearInterval(intervalId); // clean up
  }, []); // runs once on mount

  // helper function to reset then set section

  const handleTabClick = (tab, section = null) => {
    setActiveTab({ tab, section });
    setForceHighlight(prev => !prev); // toggle to force child effect
  };

  return (
    <div>
      {/* Navbar */}
      <div className="full-width-navbar" style={{ display: "flex", alignItems: "center", padding: "0 12px" }}>
        <div>
          <div className="tab" style={{ display: "flex", gap: "12px" }}>

            <button
              className={activeTab.tab === "Home" ? "active" : ""}
              onClick={() => handleTabClick("Home", null)}
            >
              Home
            </button>
        <div className="dropdown">
          <button
            className={activeTab.tab === "Puzzles" ? "active" : ""}
            onClick={() => handleTabClick("Puzzles", null)}
          >
            Puzzles ▼
          </button>
          <div className="dropdown-content">
            <span onClick={() => handleTabClick("Puzzles", "sliding")}>Sliding Puzzle</span>
            <span onClick={() => handleTabClick("Puzzles", "sudoku")}>Sudoku</span>
            <span onClick={() => handleTabClick("Puzzles", "hangman")}>Hangman</span>
          </div>
        </div>
        <div className="dropdown">
          <button
            className={activeTab.tab === "Projects" ? "active" : ""}
            onClick={() => handleTabClick("Projects", null)}
          >
            Projects ▼
          </button>
          <div className="dropdown-content">
            <span onClick={() => handleTabClick("Projects", "weather")}>Weather Reporter</span>
            <span onClick={() => handleTabClick("Projects", "audioplayer")}>Audio Player</span>
            <span onClick={() => handleTabClick("Projects", "poll")}>Poll</span>
            <span onClick={() => handleTabClick("Projects", "other")}>Other Projects</span>
          </div>
        </div>
        </div>
        {/* Blue bar */}
        <div className="blue-bar"></div>
      </div>
      <div style={{ marginLeft: "20%" }}>
        <CloudStatus />
      </div>
    </div>

      {renderTabContent()}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
