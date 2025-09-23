export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // CORS preflight request
    return res.status(200).end();
  }

  const city = req.query.q;  // frontend passes ?q=Helsinki
  const API_KEY = process.env.WEATHER_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Missing API key" });
  }

  if (!city) return res.status(400).json({ error: "Missing city parameter" });

  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`
  );
  const data = await response.json();
  res.status(200).json(data);
}
