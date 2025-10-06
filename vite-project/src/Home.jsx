import React from "react";
export default function Home({ setActiveTab }) {
  return (
    <div className="tabcontent" style={{ padding: '10px' }}>
      <h1>Welcome</h1>
      <p>
        This website showcases my programming skills and projects. Here's a quick guide:
      </p>
      <ul>
        <li>
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setActiveTab({ tab: "About", section: null })}
          >
            About Tab
          </span>{" "}
          – Learn about me, my background, and my approach to programming.
        </li>
        <li>
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setActiveTab({ tab: "Puzzles", section: null })}
          >
            Puzzles Tab
          </span>{" "}
          – Explore algorithmic challenges I’ve built and solved.
        </li>
        <li>
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setActiveTab({ tab: "Projects", section: null })}
          >
            Projects Tab
          </span>{" "}
          – See other projects I’ve worked on, with links to repositories and project details.
        </li>
      </ul>
      <p>
        Main repository is in{" "}
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
