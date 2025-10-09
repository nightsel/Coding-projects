// Projects.jsx
import React, { useState, useRef, useEffect } from "react";
import WeatherReporter from "./WeatherReporter";
import AudioPlayer from "./AudioPlayer.jsx";

export default function Projects({ section, forceHighlight }) {
  const [submitting, setSubmitting] = useState(false);

  const weatherRef = useRef(null);
  const pollRef = useRef(null);
  const otherRef = useRef(null);
  const audioRef = useRef(null);
  const lyricsRef = useRef(null);
  const lyricsPersistentRef = useRef([]);

  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const artdef = "*Luna";
  const songdef = "ST/A#R";
  const [lyricsArray, setLyricsArray] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentLyricsInfo, setCurrentLyricsInfo] = useState({ artist: artdef, song: songdef });
  const [autoScroll, setAutoScroll] = useState(true);
  const [useRomaji, setUseRomaji] = useState(false);

  const autoScrollRef = useRef(autoScroll);
    useEffect(() => {
      autoScrollRef.current = autoScroll;
    }, [autoScroll]);

  useEffect(() => {
    lyricsPersistentRef.current = lyricsArray;
  }, [lyricsArray]);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });

  /*  ref.current.classList.add("highlight");
    setTimeout(() => ref.current.classList.remove("highlight"), 1000);*/
  };

  const currentLineRef = useRef(-1);

  const scrollLyricsInstant = (progress) => {
    if (!autoScrollRef.current) return; // skip scrolling if disabled

    const lyrics = lyricsPersistentRef.current;
    const container = lyricsRef.current;
    if (!container || !lyrics || lyrics.length === 0) return;

    const offset = 0.1;
    if (progress < offset) return;

    const bias = 0;
    const adjustedProgress = Math.min(1, progress + bias);
    const rawIndex = (adjustedProgress - offset) / (1 - offset) * lyrics.length;
    const currentIndex = Math.min(Math.floor(rawIndex), lyrics.length - 1);

    if (currentIndex === currentLineRef.current) return;
    currentLineRef.current = currentIndex;

    const line = document.getElementById(`lyric-${currentIndex}`);
    if (!line) return;

    const containerTop = container.getBoundingClientRect().top;
    const lineTop = line.getBoundingClientRect().top;
    container.scrollTop += lineTop - containerTop;
  };

  useEffect(() => {
    currentLineRef.current = -1; // reset index
    if (lyricsArray.length > 0) scrollLyricsInstant(0); // scroll to start
  }, [lyricsArray]);

  const handleAudioLoad = () => {
    setLyricsArray([]);           // clear lyrics
    currentLineRef.current = -1;  // reset lyric index
    setCurrentLyricsInfo({});     // optional: clear artist/song info
  };

  useEffect(() => {
    if (section === "weather") weatherRef.current?.scrollIntoView({ behavior: "smooth" });
    if (section === "poll") pollRef.current?.scrollIntoView({ behavior: "smooth" });
    if (section === "other") otherRef.current?.scrollIntoView({ behavior: "smooth" });
    if (section === "audioplayer") audioRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [section]);

  useEffect(() => {
    if (!section) return;

    if (section === "weather") scrollTo(weatherRef);
    if (section === "poll") scrollTo(pollRef);
    if (section === "other") scrollTo(otherRef);
    if (section === "audioplayer") scrollTo(audioRef);
  }, [section, forceHighlight]);

  useEffect(() => {
    const fetchDefaultLyrics = async () => {
      setSearching(true);
      setHasSearched(true);
      try {
        const mode = useRomaji ? "romaji" : "hiragana";
        const url = `https://expressproject-al0i.onrender.com/lyrics?artist=${encodeURIComponent(artdef)}&song=${encodeURIComponent(songdef)}&mode=${mode}`;
        const res = await fetch(url);
        const data = await res.json();
        setLyricsArray(data.lines || []);
        setCurrentLyricsInfo({ artist: artdef, song: songdef });
      } catch (err) {
        setLyricsArray([]);
        setCurrentLyricsInfo({});
      } finally {
        setSearching(false);
      }
    };

    fetchDefaultLyrics();
    // intentionally NOT adding useRomaji here to avoid double-fetch on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (!hasSearched || searching) return; // don’t run on initial mount or mid-search

    const fetchLyricsWithNewMode = async () => {
      setSearching(true);
      try {
        const { artist, song } = currentLyricsInfo;
        if (!artist || !song) return;
        const mode = useRomaji ? "romaji" : "hiragana";
        const url = `https://expressproject-al0i.onrender.com/lyrics?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}&mode=${mode}`;
        const res = await fetch(url);
        const data = await res.json();
        setLyricsArray(data.lines || []);
      } catch (err) {
        setLyricsArray([]);
      } finally {
        setSearching(false);
      }
    };

    fetchLyricsWithNewMode();
  }, [useRomaji]);


  return (
    <div className="tabcontent projects" >
      <div ref={weatherRef} className="highlight-section section-card">
        <h3>Weather Reporter</h3>
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


      <div ref={audioRef}>
        <div className="section-card" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <h3>Audio Player and Lyrics Search</h3>
        {/* Description */}
        <ul style={{ maxWidth: '600px', lineHeight: '1.5' }}>
          {/*
          <li>This is a custom React audio player with a waveform visualizer and clickable seek. Songs can be uploaded from <a href="https://soundcloud.com/">Soundcloud</a> links. Loading audio should take less than a minute depending on file size and network.</li>
          <li>The default song <a href="https://www.youtube.com/watch?v=shBML8HGkRgis">*Luna - ST/A#R</a> is pre-loaded from storage to save functionality testing time and it is used according to the artist’s <a href="https://www.ast-luna.com/guideline">guideline</a> (non-commercial use, credit to *Luna given).</li>
          <li>Audio files you load are temporarily stored in <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer">Supabase Storage</a> under names like <code>temp_audio_[uuid].mp3</code> and are automatically deleted after 15 minutes.</li>
          <li>The backend running on <a href="https://render.com/" target="_blank" rel="noopener noreferrer">Render</a> handles fetching and streaming these audio files to your player.</li>
          <li>Lyrics are fetched from three websites (<a href="https://www.lyrical-nonsense.com/" target="_blank" rel="noopener noreferrer">Lyrical Nonsense</a>, <a href="https://utaten.com/"> UtaTen </a> and <a href="https://lyricstranslate.com/" target="_blank" rel="noopener noreferrer">Lyricstranslate</a>), so some songs may not be found or may be incomplete. Lyrics are not saved anywhere.</li>
          */}
          <li> This is an audio player with a waveform amplitude/frequency visualizer and clickable seek on the amplitude graph.</li>
          <li> The default song is <a href="https://www.youtube.com/watch?v=shBML8HGkRgis">*Luna - ST/A#R</a> (credit to *Luna). For faster testing purposes because
          loading audio can take up to a minute.</li>
          <li> For implementation details see the <a href="https://github.com/nightsel/Coding-projects/blob/main/documentation/audio.md" target="_blank" rel="noopener noreferrer">technical documentation</a>.</li>
      </ul>

          {/* Left column: AudioPlayer + Inputs */}
          <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            <AudioPlayer
              onProgress={scrollLyricsInstant}
              onAudioLoad={handleAudioLoad} // <-- new prop
            />


            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                style={{ padding: '5px' }}
              />
              <input
                type="text"
                placeholder="Song"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                style={{ padding: '5px' }}
              />
              {/* Lyrics button */}
              <button
                className="puzzle-button"
                onClick={async () => {
                  if (!artist || !song) return;

                  setSearching(true);
                  setHasSearched(true);

                  try {
                    const mode = useRomaji ? "romaji" : "hiragana";
                    const url = `https://expressproject-al0i.onrender.com/lyrics?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}&mode=${mode}`;
                    const res = await fetch(url);
                    const data = await res.json();
                    setLyricsArray(data.lines || []);
                    setCurrentLyricsInfo({ artist, song });
                  } catch (err) {
                    setLyricsArray([]);
                    setCurrentLyricsInfo({});
                  } finally {
                    setSearching(false);
                  }
                }}
                disabled={searching}
                style={{ padding: '6px 12px', height: '36px' }}
              >
                {searching ? 'Searching...' : 'Search Lyrics'}
              </button>
              <button className="puzzle-button"
                onClick={() => setAutoScroll(prev => !prev)}
                style={{ marginBottom: '10px', padding: '6px 12px' }}
              >
                {autoScroll ? 'Turn off lyric auto-scroll' : 'Turn on lyric auto-scroll'}
              </button>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={useRomaji}
                  onChange={() => setUseRomaji(!useRomaji)}
                />
                Display lyrics in Romaji
              </label>
            </div>
          </div>

          {/* Right column: Lyrics */}
          <div
            style={{
              flex: 1,                // take remaining horizontal space
              maxWidth: '700px',      // optional max width
              minWidth: '300px',      // ensure it doesn't shrink too small
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #ddd',
              padding: '10px',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <h4 style={{ margin: 0, marginBottom: '4px' }}>
              {lyricsArray.length > 0
                ? `Lyrics for "${currentLyricsInfo.song}" by ${currentLyricsInfo.artist}`
                : 'Lyrics'}
            </h4>
            {lyricsArray.length > 0 ? (
              <div
                ref={lyricsRef} // <- move the ref here
                style={{
                  flex: 1,
                  maxWidth: '700px',
                  minWidth: '300px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  padding: '10px',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.5' }}>
                  {lyricsArray.map((line, index) => (
                    <li key={index} id={`lyric-${index}`}>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

            ) : (
              hasSearched && !searching && (
                <p style={{ color: 'red', margin: 0 }}>Lyrics not found. Please check the artist/song name or try again.</p>
              )
            )}
          </div>
        </div>
        </div>

      <div className="section-card" ref={pollRef}>
        <h3>Vote & Leave Feedback</h3>
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
              <option value="Audio Player">Audio Player </option>
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

          <button className="puzzle-button" type="submit" disabled={submitting} style={{ padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: 'fit-content' }}>
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

      </div>


      <div className="section-card" ref={otherRef}>
        <h3>Other projects</h3>
        <p>The repositories for my projects are organized as follows:</p>
        <ul>
          <li>
            <strong>Main Repository:</strong>
            <a href="https://github.com/nightsel/Coding-projects" target="_blank" rel="noopener noreferrer">
              {' '}Coding-projects
            </a>
          </li>
          <li>
            <strong>Full-Stack Poll and Audio Player API:</strong>
            <a href="https://github.com/nightsel/expressproject" target="_blank" rel="noopener noreferrer">
              {' '}Express repository
            </a>
          </li>
          <li>
            <strong>Other Projects in </strong><a href="https://github.com/nightsel/Coding-projects" target="_blank" rel="noopener noreferrer"> Main repository </a>:
            <ul>
              <li>Back-end code for puzzles and other website functionality</li>
              <li>Solution scripts in C++ for <a href="https://leetcode.com/problemset/" target="_blank" rel="noopener noreferrer">LeetCode</a></li>
              <li>Data analysis, web scraping and a small AI project related to video games</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
