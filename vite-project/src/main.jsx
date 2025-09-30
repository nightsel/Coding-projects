import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import './style.css';
import Puzzles from "./Puzzles";
import Projects from "./Projects";
import Home from "./Home";
import About from "./About";

function App() {
  const [activeTab, setActiveTab] = useState({ tab: "Home", section: null });

  const renderTabContent = () => {
    switch (activeTab.tab) {
      case "Home":
        return <Home />;
      case "About":
        return <About setActiveTab={setActiveTab} />;
      case "Puzzles":
        return <Puzzles section={activeTab.section} />;
      case "Projects":
        return <Projects section={activeTab.section} />;
      default:
        return null;
    }
  };

  // helper function to reset then set section
  const handleTabClick = (tab, section) => {
    setActiveTab({ tab, section: null }); // reset
    setTimeout(() => {
      setActiveTab({ tab, section });
    }, 0);
  };

  return (
    <div>
      <h2>My Website</h2>

      {/* Navbar */}
      <div className="tab">
        <button onClick={() => handleTabClick("Home", null)}>Home</button>
        <button onClick={() => handleTabClick("About", null)}>About</button>

        <div className="dropdown">
          <button className={activeTab.tab === "Puzzles" ? "active" : ""}>
            Puzzles ▼
          </button>
          <div className="dropdown-content">
            <span onClick={() => handleTabClick("Puzzles", "sliding")}>Sliding Puzzle</span>
            <span onClick={() => handleTabClick("Puzzles", "sudoku")}>Sudoku</span>
            <span onClick={() => handleTabClick("Puzzles", "hangman")}>Hangman</span>
          </div>
        </div>

        <div className="dropdown">
          <button className={activeTab.tab === "Projects" ? "active" : ""}>
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
