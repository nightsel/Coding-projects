// Projects.jsx
import React, { useState, useRef, useEffect } from "react";
import WeatherReporter from "./WeatherReporter";

export default function Projects({ section }) {
  const [submitting, setSubmitting] = useState(false);

  const weatherRef = useRef(null);
  const pollRef = useRef(null);
  const otherRef = useRef(null);

  useEffect(() => {
    if (section === "weather") weatherRef.current?.scrollIntoView({ behavior: "smooth" });
    if (section === "poll") pollRef.current?.scrollIntoView({ behavior: "smooth" });
    if (section === "other") otherRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [section]);

  return (
    <div className="tabcontent" style={{ padding: "10px", maxWidth: "800px", margin: "0 auto" }}>
      <div ref={weatherRef}>
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
      </div>

      <div ref={pollRef}>
        <h5>Vote & Leave Feedback</h5>
        <ul style={{ maxWidth:'600px', lineHeight: '1.5' }}>
          <li>Pick your favorite feature of this website and optionally leave a comment.</li>
          <li>Your vote and comment are stored in a private PostgreSQL database on <a href='https://render.com/' target='_blank'>Render</a>.</li>
          <li>Only your vote is shown in the results; comments are stored privately.</li>
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
          style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', marginBottom: '20px' }}
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

          <button type="submit" disabled={submitting} style={{ padding: '8px 12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: 'fit-content' }}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      <div ref={otherRef}>
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
              <li>Solution scripts for <a href="https://leetcode.com/problemset/" target="_blank">LeetCode</a></li>
              <li>Other projects using ChatGPT for data analysis, data processing, and AI in video game-related scripts</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
