import React, { useRef, useEffect, useState } from "react";
import "./style.css";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const audioSourceRef = useRef(null);
  const waveformCanvasRef = useRef(null);
  const freqCanvasRef = useRef(null);

  const [audioUrl, setAudioUrl] = useState("");
  const [audioCtx] = useState(() => new (window.AudioContext || window.webkitAudioContext)());
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const waveformDataRef = useRef(null);
  const numBuckets = 10;

  function downsampleWaveform(data, width) {
    const factor = Math.floor(data.length / width);
    const downsampled = [];

    for (let i = 0; i < width; i++) {
      const slice = data.slice(i * factor, (i + 1) * factor);
      let sumSquares = slice.reduce((sum, v) => sum + v * v, 0);
      const rms = Math.sqrt(sumSquares / slice.length);
      downsampled.push({ min: -rms, max: rms });
    }

    const maxVal = Math.max(...downsampled.map(d => d.max));
    const minVal = Math.min(...downsampled.map(d => d.min));

    return downsampled.map(({ min, max }) => ({
      min: (min - minVal) / (maxVal - minVal) * 2 - 1,
      max: (max - minVal) / (maxVal - minVal) * 2 - 1
    }));
  }

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.35;
    const waveformCanvas = waveformCanvasRef.current;
    const freqCanvas = freqCanvasRef.current;
    const waveformCtx = waveformCanvas.getContext("2d");
    const freqCtx = freqCanvas.getContext("2d");

    analyserRef.current = audioCtx.createAnalyser();
    analyserRef.current.fftSize = 2048;

    if (!sourceRef.current) {
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 1; // fixed gain for analyser
      sourceRef.current = audioCtx.createMediaElementSource(audio);
      sourceRef.current.connect(gainNode);
      gainNode.connect(analyserRef.current);
      analyserRef.current.connect(audioCtx.destination);
    }

    function animateWaveform() {
      if (!waveformDataRef.current || !audio.duration) {
        requestAnimationFrame(animateWaveform);
        return;
      }
      waveformCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
      const middleY = waveformCanvas.height / 2;
      const amplitude = middleY;
      const progressX = Math.floor(audio.currentTime / audio.duration * waveformCanvas.width);

      for (let x = 0; x < waveformDataRef.current.length; x++) {
        const { min, max } = waveformDataRef.current[x];
        const y1 = middleY - max * amplitude;
        const y2 = middleY - min * amplitude;
        waveformCtx.fillStyle = x < progressX ? "#4caf50" : "#ccc";
        waveformCtx.fillRect(x, Math.min(y1, y2), 1, Math.abs(y2 - y1));
      }

      requestAnimationFrame(animateWaveform);
    }
    function drawFrequencies() {
      const analyser = analyserRef.current;
      const floatArray = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(floatArray);

      // Convert dB to linear amplitude
      const linear = floatArray.map(v => Math.pow(10, v / 20));

      // --- Log-frequency buckets ---
      const numBuckets = 12;
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
        val = Math.pow(val, 0.5); // mild compression
        bucketValues.push(val);
      }

      // --- Frequency weighting: downweight bass, boost highs ---
      const weights = [0.5, 0.6, 0.7, 0.8, 1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0];
      for (let i = 0; i < numBuckets; i++) bucketValues[i] *= weights[i];

      // --- Global compression ---
      for (let i = 0; i < numBuckets; i++) bucketValues[i] = Math.pow(bucketValues[i], 0.7);

      // --- Rolling loudness reference + soft limiter ---
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

      // --- Smooth dynamic high-frequency highlighting ---
      const highStart = 4; // start index of top 8 buckets
      const highEnd = 11;  // end index
      const highBuckets = bucketValues.slice(highStart, highEnd + 1);
      const maxHigh = Math.max(...highBuckets);

      for (let i = highStart; i <= highEnd; i++) {
        const v = bucketValues[i];
        const ratio = v / (maxHigh + 1e-6);
        const factor = 0.1 + 0.9 * Math.pow(ratio, 2); // smooth suppression
        bucketValues[i] *= factor;
      }

      // --- Smoothing (applied after suppression) ---
      if (!drawFrequencies.prevBuckets) drawFrequencies.prevBuckets = bucketValues.slice();
      const smoothing = 0.6;
      for (let i = 0; i < numBuckets; i++) {
        bucketValues[i] = smoothing * drawFrequencies.prevBuckets[i] + (1 - smoothing) * bucketValues[i];
      }
      drawFrequencies.prevBuckets = bucketValues.slice();

      // --- Draw bars ---
      const freqCanvas = freqCanvasRef.current;
      const freqCtx = freqCanvas.getContext("2d");
      freqCtx.clearRect(0, 0, freqCanvas.width, freqCanvas.height);
      const barWidth = freqCanvas.width / numBuckets;

      for (let i = 0; i < numBuckets; i++) {
        const barHeight = bucketValues[i] * freqCanvas.height * 0.8;
        freqCtx.fillStyle = "#4caf50";
        freqCtx.fillRect(i * barWidth, freqCanvas.height - barHeight, barWidth - 2, barHeight);
      }

      requestAnimationFrame(drawFrequencies);
    }








    function scaleFrequency(value) {
    // Step 1: cut off noise floor (ignore hiss / tiny overtones)
    if (value < 20) return 0;

    // Step 2: compress dynamic range (square root curve)
    let scaled = Math.pow(value / 255, 0.5) * 255;

    // Step 3: optional boost factor (adjust if you want bars taller/shorter)
    return Math.min(scaled * 1.2, 255);
  }





    waveformCanvas.addEventListener("click", (e) => {
      const rect = waveformCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / waveformCanvas.width;
      audio.currentTime = percentage * audio.duration;
    });

    audio.addEventListener("play", async () => {
      if (audioCtx.state === "suspended") await audioCtx.resume();
      animateWaveform();
      drawFrequencies();
    });
  }, [audioCtx]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // <-- new state for UI messages

  async function downloadAudio() {
      if (!audioUrl) {
        setMessage("Please enter an audio URL.");
        return;
      }

      setLoading(true);
      setMessage(""); // clear previous messages

      try {
        const res = await fetch(
          `https://expressproject-al0i.onrender.com/download-audio?url=${encodeURIComponent(audioUrl)}`
        );

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();

        if (data.error) {
          setMessage("Error: " + data.error); // show error in UI
          return;
        }

        const proxiedUrl = `https://expressproject-al0i.onrender.com/proxy-audio?url=${encodeURIComponent(data.url)}`;
        const arrayBuffer = await (await fetch(proxiedUrl)).arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        waveformDataRef.current = downsampleWaveform(audioBuffer.getChannelData(0), waveformCanvasRef.current.width);

        audioSourceRef.current.src = proxiedUrl;
        audioRef.current.load();
      } catch (err) {
        setMessage("Download failed: " + err.message); // <-- display error instead of alert
      } finally {
        setLoading(false);
      }
    }
    useEffect(() => {
      const loadLuna = async () => {
        try {
          const url = "https://expressproject-al0i.onrender.com/luna";
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

          // Downsample waveform and store it
          waveformDataRef.current = downsampleWaveform(
            audioBuffer.getChannelData(0),
            waveformCanvasRef.current.width
          );

          // Set the <audio> element source and play
          audioSourceRef.current.src = url;
          audioRef.current.load();
        } catch (err) {
          console.error("Failed to load /luna for waveform:", err);
        }
      };

      loadLuna();
    }, []);

    return (
      <div>
        <input
          type="text"
          placeholder="Enter audio URL (e.g., SoundCloud, other direct links)"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          style={{ width: "100%", maxWidth: "600px" }}
        />
        <p style={{ color: "red", fontSize: "0.9em" }}>
          Note: YouTube links will not work due to anti-bot protections. Please use other sources. BE CAREFUL WITH THE VOLUME! Example of a link that works: https://soundcloud.com/stereodivefoundation-music/chronos
        </p>
        <button onClick={downloadAudio} className="puzzle-button" disabled={loading}>
          {loading ? "Loading audio..." : "Load Audio"}
        </button>

        {/* Error / status message */}
        {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}

        <audio ref={audioRef} controls style={{ width: "400px" }} crossOrigin="anonymous">
          <source ref={audioSourceRef} type="audio/mpeg" />
        </audio>
        <canvas ref={waveformCanvasRef} width="600" height="100"></canvas>
        <canvas ref={freqCanvasRef} width="600" height="150"></canvas>
      </div>
    );
  }
