import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = "e3b8feae841672959160bf3ad23de6b1";

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      setError('City not found or API key is activating. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherClass = () => {
    if (!weather) return 'default-bg';
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('clear')) return 'sunny-bg';
    if (main.includes('cloud')) return 'cloudy-bg';
    if (main.includes('rain') || main.includes('drizzle')) return 'rainy-bg';
    if (main.includes('thunderstorm')) return 'thunder-bg';
    if (main.includes('snow')) return 'snowy-bg';
    return 'default-bg';
  };

  // කාලගුණය අනුව නිවැරදි Video Path එක තෝරාගැනීම
  const getVideoSrc = () => {
    if (!weather) return null;
    const main = weather.weather[0].main.toLowerCase();

    if (main.includes('rain') || main.includes('drizzle') || main.includes('thunderstorm')) {
      return '/rain.mp4';
    } else {
      return '/clear.mp4';
    }
  };

  const videoSrc = getVideoSrc();

  return (
    <div className={`app-wrapper ${getWeatherClass()}`}>
      
      {/* Dynamic Video Background */}
      {videoSrc && (
        <video key={videoSrc} autoPlay loop muted playsInline className="background-video">
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Glass Droplet Overlay */}
      <div className="glass-overlay"></div>

      <div className="app-container">
        <h1>Weather App 🌤️</h1>

        <form onSubmit={fetchWeather} className="search-form">
          <input
            type="text"
            placeholder="Enter City (e.g. Colombo)..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && <p className="status">Loading data...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}, {weather.sys.country}</h2>
            
            <div className="temp-box">
              <img 
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                alt={weather.weather[0].description} 
                className="weather-icon"
              />
              <h3>{Math.round(weather.main.temp)}°C</h3>
              <p>{weather.weather[0].description}</p>
            </div>

            <div className="details">
              <div>
                <strong>Humidity</strong>
                <span>{weather.main.humidity}%</span>
              </div>
              <div>
                <strong>Wind Speed</strong>
                <span>{weather.wind.speed} m/s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;