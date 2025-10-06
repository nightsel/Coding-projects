import React from "react";

export default function Home({ setActiveTab }) {
  return (
    <div className="tabcontent" style={{ padding: '10px' }}>
      <h1>Welcome</h1>
      <p>
        Hi, I’m Max. This website showcases my programming skills and projects. Here’s a quick guide:
      </p>
      <ul>
        <li>
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setActiveTab({ tab: "Puzzles", section: null })}
          >
            Puzzles Tab
          </span>{" "}
          - Explore algorithmic challenges I’ve built and solved, including Sliding Puzzle, Sudoku, Hangman, and their solvers.
        </li>
        <li>
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setActiveTab({ tab: "Projects", section: null })}
          >
            Projects Tab
          </span>{" "}
          - Projects made for personal challenge such as Weather Reporter, Audio Player, Full Stack Poll, and other projects, showcasing skills in cloud/remote databases and backend deployment both locally and on cloud.
          This website itself is a full-stack project.
        </li>
      </ul>
      <p>
        Main repository is available on{" "}
        <a
          href="https://github.com/nightsel/Coding-projects"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub: nightsel/Coding-projects
        </a>
      </p>
    </div>
  );
}
