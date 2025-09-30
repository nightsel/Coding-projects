import React, { useState } from 'react';

export default function WeatherReporter() {
  const [city, setCity] = useState('');
  const [output, setOutput] = useState('');

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://coding-projects-3ncfzqb6w-nightsels-projects.vercel.app/api/weather?q=${encodeURIComponent(city)}`
      );
      const data = await response.json();

      if (data.error) {
        setOutput(data.error.message || data.error);
      } else {
        const { name, country } = data.location;
        const { temp_c, condition, humidity, wind_kph } = data.current;

        setOutput(
          <div>
            <strong>{name}, {country}</strong><br/>
            Temp: {temp_c} °C<br/>
            Condition: {condition.text || condition}<br/>
            Humidity: {humidity}%<br/>
            Wind: {wind_kph} kph
          </div>
        );
      }
    } catch (err) {
      setOutput('Error fetching weather: ' + err.message);
    }
  };

  return (
    <div className="weather-reporter">
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={fetchWeather}>Get Weather</button>
      <div id="output">{output}</div>
    </div>
  );
}
