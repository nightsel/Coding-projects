import React, { useState, useEffect} from "react";
import ReactDOM from "react-dom/client";
import './style.css';
import Puzzles from "./Puzzles";
import Projects from "./Projects";
import Home from "./Home";
import About from "./About";

function App() {
  const [activeTab, setActiveTab] = useState({ tab: "Home", section: null , key: Date.now()});
  const [forceHighlight, setForceHighlight] = useState(false);
  <Puzzles section={activeTab.section} forceHighlight={activeTab.forceHighlight} />

  const renderTabContent = () => {
    switch (activeTab.tab) {
      case "Home":
        return <Home />;
      case "About":
        return <About setActiveTab={setActiveTab} />;
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
      <h2>My Website</h2>

      {/* Navbar */}
      <div className="tab">
        <button onClick={() => handleTabClick("Home", null)}>Home</button>
        <button onClick={() => handleTabClick("About", null)}>About</button>

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
    onClick={() => handleTabClick("Projects", null)} // top button
  >
    Projects ▼
  </button>
        <div className="dropdown-content">
          <span onClick={() => handleTabClick("Projects", "weather")}>Weather Reporter</span>
    <span onClick={() => handleTabClick("Projects", "poll")}>Poll</span>
    <span onClick={() => handleTabClick("Projects", "other")}>Other Projects</span>
        </div>
      </div>
      </div>

      {renderTabContent()}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
