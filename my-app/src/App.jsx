import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);


  const fetchWeather = async () => {
    try {
      const response = await fetch(`/api/weather?q=${city}`); // calls Vercel function
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {weather && weather.location ? (
        <div>
          <h2>{weather.location.name}, {weather.location.country}</h2>
          <p>{weather.current.condition.text}</p>
          <p>{weather.current.temp_c} °C</p>
        </div>
      ) : weather && weather.error ? (
        <p>City not found</p>
      ) : null}
    </div>
  );
}

export default App;
