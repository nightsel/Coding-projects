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
              <p>Hello,
            I am Max. I learnt to program after starting my university studies because of
          not knowing about it before. So my degree in applied mathematics isn't the
          best fit even though I took a lot of studies in the side subject of
          software engineering.
          <br /><br />
          However I like programming. It would be great to start a career in this field
          for that reason. I am always interested in learning more. My skills at least in
          theory are good, but I lack work experience.
          <br /><br />
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setActiveTab("Puzzles")}> Puzzles tab</span> contains some puzzles
            and their solvers. Sliding puzzle's solver was not very easy to make
            but it should work reasonably fast and reliably.
            <span
              style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
              onClick={() => setActiveTab("Projects")}>Projects tab</span> contains
              information about other projects.

      </p>
            </p>
          </div>
        );
      case 'Puzzles':
        return (

          // could add a status message to the page. like "Moved piece 1 up".

          <div className="tabcontent" style={{ display: activeTab === "Puzzles" ? "block" : "none" }}>
            <SlidingPuzzle />
            {/* Pass board & setter to SudokuGenerator */}
            <SudokuGenerator/>

            {/*<SudokuGenerator/>
              board={sudokuBoard}
              setBoard={setSudokuBoard}
              secondsElapsed={secondsElapsed}
              setSecondsElapsed={setSecondsElapsed}
            />
            <Timer secondsElapsed={secondsElapsed} />*/}
            <Hangman />
          </div>
        );
      case 'Projects':
        return (
          <div className="tabcontent" style={{ display: activeTab === "Projects" ? "block" : "none" }}>
            <WeatherReporter />
            <p>
    This uses the <a href="https://www.weatherapi.com" target="_blank">WeatherAPI</a> service
    and my own API hosted on <a href="https://coding-projects-dhbrgrgtx-nightsels-projects.vercel.app/" target="_blank">Vercel</a>.
    My API provides a route to /weather/city to fetch results from WeatherAPI.
  </p>
  <p>
    The API key is stored privately in the cloud (Vercel), which is why the functions
    are in the cloud. This setup allowed me to practice building and deploying a serverless architecture.
    I also show my code in the GitHub repository folder <code>my-app</code>.
  </p>
  <p>
    My other projects, and this website's entire code, are in the <a href="https://github.com/nightsel/coding-projects" target="_blank"> GitHub repository </a>and the <span
      style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
      onClick={() => setActiveTab("Puzzles")}> Puzzles tab</span>. In the GitHub repository, I published solution scripts for some
     <a href="https://leetcode.com/problemset/" target="_blank"> LeetCode</a> coding problems.
    I did them to practice programming, so I didn't use ChatGPT other than for questions.
    Other projects that use ChatGPT are related to data analysis, data processing,
    and AI in some video game-related scripts.
  </p>
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
