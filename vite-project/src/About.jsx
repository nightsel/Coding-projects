import React from "react";

export default function About({ setActiveTab }) {
  return (
    <div className="tabcontent" style={{ padding: '10px' }}>
      <h3>About</h3>
      <p>
        Hello, Hi, I'm Max. I discovered programming during my university studies
        in applied mathematics and quickly realized it's what I enjoy most. I've
        focused on software engineering through side studies and personal projects,
        and I'm eager to start a career in this field.
      </p>
      <p>
        I like diving into new technologies on my own and experimenting until I
        understand them fully. I find solving algorithmic puzzles exciting and
        enjoy figuring out creative solutions.
      </p>
      <p>
        The{' '}
        <span
          style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
          onClick={() => setActiveTab({ tab: "Puzzles", section: null })}
        >
          Puzzles Tab
        </span>
         &nbsp; showcases some of the challenges I’ve built and solved. The{' '}
        <span
          style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
          onClick={() => setActiveTab({tab: "Projects", section: null})}
        >
          Projects tab
        </span>{' '}
         contains other projects I’ve worked on, highlighting my skills and approach
        to programming, with links to repositories and relevant architecture.
      </p>
    </div>
  );
}
