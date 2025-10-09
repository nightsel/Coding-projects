import React, { useRef, useEffect, useState } from "react";
import "./style.css";

export default function AudioPlayer({ onProgress}) {
  const audioRef = useRef(null);
  const audioSourceRef = useRef(null);
  const waveformCanvasRef = useRef(null);
  const freqCanvasRef = useRef(null);

  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [audioCtx] = useState(() => new (window.AudioContext || window.webkitAudioContext)());
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const waveformDataRef = useRef(null);

  const numBuckets = 12;

  // --- Downsample the waveform ---
  function downsampleWaveform(data, width) {
    const factor = Math.floor(data.length / width);
    const downsampled = [];

    for (let i = 0; i < width; i++) {
      const slice = data.slice(i * factor, (i + 1) * factor);
      const rms = Math.sqrt(slice.reduce((sum, v) => sum + v * v, 0) / slice.length);
      downsampled.push({ min: -rms, max: rms });
    }

    const maxVal = Math.max(...downsampled.map(d => d.max));
    const minVal = Math.min(...downsampled.map(d => d.min));

    return downsampled.map(({ min, max }) => ({
      min: (min - minVal) / (maxVal - minVal) * 2 - 1,
      max: (max - minVal) / (maxVal - minVal) * 2 - 1,
    }));
  }

  // --- Draw waveform instantly ---
  function drawWaveform(progress = null) {
    const canvas = waveformCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!waveformDataRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const middleY = canvas.height / 2;
    const amplitude = middleY;

    for (let x = 0; x < waveformDataRef.current.length; x++) {
      const { min, max } = waveformDataRef.current[x];
      const y1 = middleY - max * amplitude;
      const y2 = middleY - min * amplitude;

      if (progress === null) ctx.fillStyle = "#ccc"; // full waveform
      else ctx.fillStyle = x < progress ? "#4caf50" : "#ccc"; // playback progress

      ctx.fillRect(x, Math.min(y1, y2), 1, Math.abs(y2 - y1));
    }
  }

  // --- Animate waveform during playback ---
  function animateWaveform() {
    if (!waveformDataRef.current || !audioRef.current.duration) {
      requestAnimationFrame(animateWaveform);
      return;
    }

    const progress = audioRef.current.currentTime / audioRef.current.duration;

    // call the parent callback if it exists
    if (onProgress) onProgress(progress);


    const progressX = Math.floor(audioRef.current.currentTime / audioRef.current.duration * waveformCanvasRef.current.width);
    drawWaveform(progressX);

    requestAnimationFrame(animateWaveform);
  }

  // --- Frequency analyzer ---
  function drawFrequencies() {
    const analyser = analyserRef.current;
    const canvas = freqCanvasRef.current;
    const ctx = canvas.getContext("2d");

    const floatArray = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(floatArray);

    const linear = floatArray.map(v => Math.pow(10, v / 20));

    const bucketValues = [];
    const sampleRate = audioCtx.sampleRate;
    const fftSize = analyser.fftSize;
    const binFreq = sampleRate / fftSize;
    const minFreq = 20;
    const maxFreq = 20000;

    for (let i = 0; i < numBuckets; i++) {
      const freqStart = minFreq * Math.pow(maxFreq / minFreq, i / numBuckets);
      const freqEnd = minFreq * Math.pow(maxFreq / minFreq, (i + 1) / numBuckets);
      const startBin = Math.floor(freqStart / binFreq);
      const endBin = Math.min(Math.floor(freqEnd / binFreq), linear.length - 1);

      let sum = 0;
      for (let j = startBin; j <= endBin; j++) sum += linear[j];
      let val = sum / (endBin - startBin + 1);
      val = Math.pow(val, 0.5);
      bucketValues.push(val);
    }

    // Weighting and compression
    const weights = [0.5, 0.6, 0.7, 0.8, 1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0];
    for (let i = 0; i < numBuckets; i++) bucketValues[i] *= weights[i];

    const avgVal = bucketValues.reduce((a, b) => a + b, 0) / numBuckets;
    if (!drawFrequencies.loudnessRef) drawFrequencies.loudnessRef = avgVal;
    drawFrequencies.loudnessRef = 0.98 * drawFrequencies.loudnessRef + 0.02 * avgVal;

    const scale = 0.6 / (drawFrequencies.loudnessRef + 1e-6);
    for (let i = 0; i < numBuckets; i++) {
      let v = bucketValues[i] * scale;
      const limit = 0.75;
      if (v > limit) v = limit + (v - limit) * 0.3;
      bucketValues[i] = Math.min(v, 0.9);
    }

    // Draw frequency bars
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / numBuckets;

    for (let i = 0; i < numBuckets; i++) {
      const barHeight = bucketValues[i] * canvas.height * 0.8;
      ctx.fillStyle = "#4caf50";
      ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
    }

    requestAnimationFrame(drawFrequencies);
  }

  // --- Setup audio context, analyser, and click-to-seek ---
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.35;

    analyserRef.current = audioCtx.createAnalyser();
    analyserRef.current.fftSize = 2048;

    if (!sourceRef.current) {
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 1;
      sourceRef.current = audioCtx.createMediaElementSource(audio);
      sourceRef.current.connect(gainNode);
      gainNode.connect(analyserRef.current);
      analyserRef.current.connect(audioCtx.destination);
    }

    const waveformCanvas = waveformCanvasRef.current;
    waveformCanvas.addEventListener("click", e => {
      const rect = waveformCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      audio.currentTime = (clickX / waveformCanvas.width) * audio.duration;
    });

    audio.addEventListener("play", async () => {
      if (audioCtx.state === "suspended") await audioCtx.resume();
      animateWaveform();      // updates the "played" portion of waveform
      drawFrequencies();      // starts frequency bars animation
    });
  }, [audioCtx]);

  // --- Load audio from URL or default track ---
  async function loadAudioFromUrl(url) {
    try {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      // Downsample waveform
      waveformDataRef.current = downsampleWaveform(audioBuffer.getChannelData(0), waveformCanvasRef.current.width);

      // Draw waveform instantly
      drawWaveform();

      audioSourceRef.current.src = url;
      audioRef.current.load();
    } catch (err) {
      console.error("Failed to load audio:", err);
    }
  }

  async function downloadAudio() {
    if (!audioUrl) {
      setMessage("Please enter an audio URL.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`https://expressproject-al0i.onrender.com/download-audio?url=${encodeURIComponent(audioUrl)}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.error) { setMessage("Error: " + data.error); return; }

      const proxiedUrl = `https://expressproject-al0i.onrender.com/proxy-audio?url=${encodeURIComponent(data.url)}`;
      await loadAudioFromUrl(proxiedUrl);
    } catch (err) {
      setMessage("Download failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Load default /luna track
    loadAudioFromUrl("https://expressproject-al0i.onrender.com/luna");
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <input
            type="text"
            placeholder="Enter audio URL (e.g., SoundCloud, other direct links)"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            style={{ width: "300px" }}
          />
          <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>
            Note: YouTube links will not work due to anti-bot protections. Please use other sources. <strong>BE CAREFUL WITH THE VOLUME!</strong>
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
            Example of a link that works:
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ color: "#007bff", textDecoration: "underline" }}
            >
              https://soundcloud.com/stereodivefoundation-music/chronos
            </a>
            <button
              onClick={() => {
                const exampleUrl = "https://soundcloud.com/stereodivefoundation-music/chronos";
                navigator.clipboard.writeText(exampleUrl);
              }}
              style={{ padding: "2px 6px", fontSize: "11px" }}
            >
              Copy
            </button>
          </div>
        </div>
        <button
          onClick={downloadAudio}
          className="puzzle-button"
          disabled={loading}
          style={{ width: "fit-content" }}
        >
          {loading ? "Loading audio..." : "Load Audio"}
        </button>
        {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <audio ref={audioRef} controls className="styled-audio" crossOrigin="anonymous">
          <source ref={audioSourceRef} type="audio/mpeg" />
        </audio>
        <canvas ref={waveformCanvasRef} className="waveform-canvas" width="600" height="100"></canvas>
        <canvas ref={freqCanvasRef} className="freq-canvas" width="600" height="150"></canvas>
      </div>
    </div>
  );
}
