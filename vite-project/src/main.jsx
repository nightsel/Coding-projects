/* TODO list

For Sudoku, show the coordinates of the hint or highlight the hinted cell briefly

*/

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

  const [submitting, setSubmitting] = useState(false);


  // Save Sudoku board to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sudokuBoard", JSON.stringify(sudokuBoard));
  }, [sudokuBoard]);

  const pingBackend = () => {
    fetch('https://expressproject-al0i.onrender.com/ping')
      .then(() => console.log('Backend pinged'))
      .catch(() => console.log('Ping failed'));
  };


useEffect(() => {
  if (activeTab) {
    pingBackend();
  }
}, [activeTab]);

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

              <p>Hello,
            Hi, I'm Max. I discovered programming during my university studies in applied mathematics and quickly realized it's what I enjoy most. I've focused on software engineering through side studies and personal projects, and I'm eager to start a career in this field.
          <br /><br />
          I like diving into new technologies on my own and experimenting until I understand them fully. I find solving algorithmic puzzles exciting and enjoy figuring out creative solutions.
          I enjoy building projects that are both practical and meaningful. Instead of creating random functions, I focused on features that make sense on this site while still showcasing my skills.
          <br /><br />
          The
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setActiveTab("Puzzles")}> Puzzles tab</span> showcases some of the challenges I’ve built and solved, like a sliding puzzle solver, which runs efficiently and reliably.
            The <span
              style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
              onClick={() => setActiveTab("Projects")}>Projects tab</span> contains other projects I’ve worked on, highlighting my skills and approach to programming.
              It also contains links to repositories which have the code for this website and the relevant system architecture.
      </p>

          </div>
        );
      case 'Puzzles':
        return (

          // could add a status message to the page. like "Moved piece 1 up".

          <div
      className="tabcontent"
      style={{ display: activeTab === "Puzzles" ? "block" : "none", padding: '10px', maxWidth: '800px', margin: '0 auto' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <SlidingPuzzle />
        <SudokuGenerator />
        <Hangman />
      </div>
    </div>
        );
      case 'Projects':
        return (
          <div className="tabcontent" style={{ display: activeTab === "Projects" ? "block" : "none" }}>
            <WeatherReporter />
            <p>
  This uses the <a href="https://www.weatherapi.com" target="_blank">WeatherAPI</a> service
  and my own API hosted on <a href="https://coding-projects-dhbrgrgtx-nightsels-projects.vercel.app/" target="_blank">Vercel</a>:
</p>
<ul>
  <li>API provides a route to <code>/weather/city</code> to fetch results from WeatherAPI.</li>
  <li>API key is stored privately in the cloud (Vercel).</li>
  <li>Setup allowed me to practice building and deploying a serverless architecture.</li>
  <li>Code is available in the main GitHub repository folder <code>my-app</code>.</li>
</ul>

  <h5>Vote & Leave Feedback</h5>
  <ul style={{maxWidth:'600px', lineHeight: '1.5'}}>
    <li>Pick your favorite feature of this website and optionally leave a comment.</li>
    <li>Your vote and comment are stored in a private PostgreSQL database on <a href='https://render.com/' target='_blank'>Render</a>, which I can access securely via the Express backend.</li>
    <li>Only your vote is shown in the results; comments are stored privately and not displayed.</li>
    <li>You’re welcome to test it yourself — the database has enough space for multiple votes.</li>
    <li>Submitting may take a few seconds if the cloud service is still starting.</li>
  </ul>

<form
  onSubmit={async (e) => {
    e.preventDefault();
    const option = e.target.elements.option.value;
    const feedback = e.target.elements.feedback.value;
    if (!option) return;
      setSubmitting(true);
    const res = await fetch('https://expressproject-al0i.onrender.com/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ option, feedback })
    });
    if (res.ok) alert('Vote submitted!');
    setSubmitting(false);
    e.target.reset();
  }}
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    marginBottom: '20px'
  }}
>
  <label style={{ display: 'flex', flexDirection: 'column' }}>
    Choose your favorite feature:
    <select name="option" required style={{ padding: '5px', marginTop: '5px' }}>
      <option value="">Select...</option>
      <option value="Sliding Puzzle">Sliding Puzzle</option>
      <option value="Sudoku Generator">Sudoku Generator</option>
      <option value="Hangman">Hangman</option>
      <option value="Weather Reporter">Weather Reporter</option>
      <option value="Full-Stack Poll">Full-Stack Poll</option>
    </select>
  </label>

  <label style={{ display: 'flex', flexDirection: 'column' }}>
    Optional feedback:
    <input
      name="feedback"
      type="text"
      placeholder="Your comments..."
      style={{ padding: '5px', marginTop: '5px' }}
    />
  </label>

  <button
    type="submit" disabled={submitting}
    style={{
      padding: '8px 12px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      width: 'fit-content'
    }}
  >
    {submitting ? 'Submitting...' : 'Submit'}
  </button>
</form>

<button
  onClick={async () => {
    const res = await fetch('https://expressproject-al0i.onrender.com/results');
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  }}
  style={{
    padding: '6px 10px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: 'fit-content'
  }}
>
  Show current votes
</button>


<br/>
<br/>
<br/>

  <h5>Other projects</h5>

  <p>The repositories for my projects are organized as follows:</p>
<ul>
  <li>
    <strong>Full-Stack Poll Backend:</strong>
    <a href="https://github.com/nightsel/expressproject" target="_blank"> Express repository</a>
  </li>
  <li>
    <strong>Front-End & Website Code:</strong> Included in the main repository
    <a href="https://github.com/nightsel/coding-projects" target="_blank"> coding-projects</a>
  </li>
  <li>
    <strong>Other Projects in Main Repository:</strong>
    <ul>
      <li>Back-end code for puzzles and other website functionality</li>
      <li>Solution scripts for <a href="https://leetcode.com/problemset/" target="_blank"> LeetCode</a> problems (done for practice)</li>
      <li>Other projects using ChatGPT for data analysis, data processing, and AI in video game-related scripts</li>
    </ul>
  </li>
</ul>



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
