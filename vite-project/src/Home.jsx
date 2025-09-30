import React from "react";
export default function Home() {
  return (
    <div className="tabcontent" style={{ padding: '10px' }}>
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
}
