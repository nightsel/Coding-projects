const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;



// Enable CORS for local development
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Endpoint to fetch page and count words
/*
app.get("/fetchPage", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send({ error: "Missing URL parameter" });

  try {
    const response = await fetch(url);
    const text = await response.text();

    // Strip HTML tags
    const plainText = text.replace(/<[^>]*>/g, " ");

    // Count words
    const words = plainText
      .toLowerCase()
      .match(/\b\w+\b/g) || [];

    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);

    // Sort by frequency
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20); // top 20

    res.send(sorted);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
*/

// Serve static files from docs folder
app.use(express.static(path.join(__dirname, 'docs')));

app.get('/fetchPage', async (req, res) => {
    const url = req.query.url;
    console.log("Received request for URL:", url); // debug

    if (!url) {
        console.log("No URL provided!");
        return res.status(400).send('Missing URL');
    }

    try {
        const response = await fetch(url);
        const html = await response.text();
        console.log("Fetched page length:", html.length); // debug
        res.send(html);
    } catch (err) {
        console.error("Error fetching URL:", err); // debug
        res.status(500).send('Failed to fetch page');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
