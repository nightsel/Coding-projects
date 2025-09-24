import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import SlidingPuzzle from './SlidingPuzzle';
import SudokuGenerator from './SudokuGenerator';
import Hangman from './Hangman';
import WeatherReporter from './WeatherReporter';

function App() {
  const [activeTab, setActiveTab] = React.useState('Home');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <div className="tabcontent">
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
          <div className="tabcontent">
            <h3>About</h3>
            <p>Hello, I am Max. I learnt to program after starting my university studies...</p>
          </div>
        );
      case 'Puzzles':
        return (
          <div className="tabcontent">
            <SlidingPuzzle />
            <SudokuGenerator />
            <Hangman />
          </div>
        );
      case 'Projects':
        return (
          <div className="tabcontent">
            <WeatherReporter />
            <p>
              This uses{' '}
              <a href="https://www.weatherapi.com" target="_blank" rel="noreferrer">
                WeatherAPI
              </a>{' '}
              service and my own API hosted on{' '}
              <a
                href="https://coding-projects-dhbrgrgtx-nightsels-projects.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                Vercel
              </a>
              .
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
