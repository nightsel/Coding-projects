import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import SlidingPuzzle from './SlidingPuzzle';
import SudokuGenerator from './SudokuGenerator';
import Hangman from './Hangman';
import WeatherReporter from './WeatherReporter';

// Example: createEmptyGrid() function should return initial board array
import { createEmptyGrid } from './SudokuGenerator';

function App() {
  const [activeTab, setActiveTab] = useState('Home');

  // Lift Sudoku board state
  const [sudokuBoard, setSudokuBoard] = useState(() => {
    const saved = localStorage.getItem("sudokuBoard");
    return saved ? JSON.parse(saved) : createEmptyGrid();
  });

  // Save Sudoku board to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sudokuBoard", JSON.stringify(sudokuBoard));
  }, [sudokuBoard]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <div className="tabcontent" style={{ display: activeTab === "Home" ? "block" : "none" }}>
            <h1>Hissipuheeni</h1>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/cKqKmzKE51o"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            <p>
              <a
                href="https://www.youtube.com/watch?v=cKqKmzKE51o"
                target="_blank"
                rel="noreferrer"
              >
                Videon linkki
              </a>
            </p>
          </div>
        );
      case 'About':
        return (
          <div className="tabcontent" style={{ display: activeTab === "About" ? "block" : "none" }}>
            <h3>About</h3>
            <p>
              Hello, I am Max...
            </p>
          </div>
        );
      case 'Puzzles':
        return (

          <div className="tabcontent" style={{ display: activeTab === "Puzzles" ? "block" : "none" }}>
            <SlidingPuzzle />
            {/* Pass board & setter to SudokuGenerator */}
            <SudokuGenerator board={sudokuBoard} setBoard={setSudokuBoard} />
            <Hangman />
          </div>
        );
      case 'Projects':
        return (
          <div className="tabcontent" style={{ display: activeTab === "Projects" ? "block" : "none" }}>
            <WeatherReporter />
            <p>My other projects...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>My Website</h2>
      <div className="tab">
        {['Home', 'About', 'Puzzles', 'Projects'].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderTabContent()}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
