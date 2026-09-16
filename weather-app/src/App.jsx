import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [unit, setUnit] = useState('metric');
  
  // LocalStorage වලින් Recent Searches Load කරගැනීම
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentWeatherCities');
    return saved ? JSON.parse(saved) : ['Colombo', 'Kandy', 'London'];
  });

  const API_KEY = "e3b8feae841672959160bf3ad23de6b1";

  // LocalStorage Update කිරීම
  useEffect(() => {
    localStorage.setItem('recentWeatherCities', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // App එක මුලින්ම Open වෙද්දී Geo-location එක අරන් Current Weather load කිරීම
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude, unit);
        },
        (err) => {
          console.warn("Geolocation denied or error. Falling back to default city.");
          // User Location Permission දුන්නේ නැත්නම් Colombo Weather එක Load වන Fallback එක
          fetchWeatherData('Colombo', unit);
        }
      );
    } else {
      fetchWeatherData('Colombo', unit);
    }
  }, []);

  // Coordinates (Latitude & Longitude) මගින් Weather ලබාගැනීම
  const fetchWeatherByCoords = async (lat, lon, currentUnit) => {
    setLoading(true);
    setError('');

    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`
      );
      setWeather(weatherRes.data);

      // Current City එක Recent Searches වලට auto add වීම
      addToRecentSearches(weatherRes.data.name);

      const airRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      setAirQuality(airRes.data.list[0].main.aqi);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`
      );

      const dailyForecast = forecastRes.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);

    } catch (err) {
      setError('Error fetching weather data for your current location!');
    } finally {
      setLoading(false);
    }
  };

  // Recent Searches වලට එකතු කිරීම
  const addToRecentSearches = (cityName) => {
    if (!cityName) return;
    const formattedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
    
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== formattedCity.toLowerCase());
      return [formattedCity, ...filtered].slice(0, 5);
    });
  };

  const removeRecentSearch = (e, cityToRemove) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((c) => c !== cityToRemove));
  };

  // City Name මගින් Search කිරීම
  const fetchWeatherData = async (searchCity, currentUnit) => {
    if (!searchCity) return;

    setLoading(true);
    setError('');

    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=${currentUnit}`
      );
      setWeather(weatherRes.data);

      addToRecentSearches(weatherRes.data.name);

      const { lat, lon } = weatherRes.data.coord;

      const airRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      setAirQuality(airRes.data.list[0].main.aqi);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=${currentUnit}`
      );

      const dailyForecast = forecastRes.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);

    } catch (err) {
      setError('City not found or API key error!');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData(city, unit);
    setCity('');
  };

  const handleQuickAccess = (cityName) => {
    setCity(cityName);
    fetchWeatherData(cityName, unit);
  };

  // User ට ඕනෑම වෙලාවක Current Location එකට Refresh කිරීමට අලුතෙන් Button එකක් එකතු කිරීම
  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude, unit);
        },
        () => {
          setError("Geolocation permission denied!");
          setLoading(false);
        }
      );
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    if (weather) {
      if (weather.coord) {
        fetchWeatherByCoords(weather.coord.lat, weather.coord.lon, newUnit);
      } else {
        fetchWeatherData(weather.name, newUnit);
      }
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

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAQIDescription = (aqi) => {
    switch (aqi) {
      case 1: return { text: 'Good 🟢', color: '#4ade80' };
      case 2: return { text: 'Fair 🟡', color: '#facc15' };
      case 3: return { text: 'Moderate 🟠', color: '#fb923c' };
      case 4: return { text: 'Poor 🔴', color: '#f87171' };
      case 5: return { text: 'Very Poor 🟣', color: '#c084fc' };
      default: return { text: 'N/A', color: '#fff' };
    }
  };

  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className={`app-wrapper ${getWeatherClass()}`}>
      
      {videoSrc && (
        <video key={videoSrc} autoPlay loop muted playsInline className="background-video">
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div className="glass-overlay"></div>

      <div className="app-container">
        
        <div className="header-bar">
          <h1>Weather App 🌤️</h1>
          <button className="unit-toggle-btn" onClick={toggleUnit}>
            {unit === 'metric' ? 'Switch to °F' : 'Switch to °C'}
          </button>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter City (e.g. Colombo)..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Search</button>
          
          {/* Current Location Quick Button */}
          <button 
            type="button" 
            className="location-btn" 
            onClick={handleCurrentLocationClick} 
            title="Use My Location"
          >
            🎯
          </button>
        </form>

        {/* Quick Access / Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="quick-access-container">
            <span className="quick-title">Recent / Favorites:</span>
            <div className="quick-chips">
              {recentSearches.map((item, idx) => (
                <button
                  key={idx}
                  className={`chip-btn ${weather?.name?.toLowerCase() === item.toLowerCase() ? 'active-chip' : ''}`}
                  onClick={() => handleQuickAccess(item)}
                >
                  📍 {item}
                  <span className="chip-remove" onClick={(e) => removeRecentSearch(e, item)}>×</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <p className="status">Loading data...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card">
            
            {/* Left Column: Current Main Temp */}
            <div className="main-weather-left">
              <h2>{weather.name}, {weather.sys.country}</h2>
              <div className="temp-box">
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                  alt={weather.weather[0].description} 
                  className="weather-icon"
                />
                <h3>{Math.round(weather.main.temp)}{unitSymbol}</h3>
                <p>{weather.weather[0].description}</p>
              </div>

              <div className="details">
                <div>
                  <strong>Humidity</strong>
                  <span>{weather.main.humidity}%</span>
                </div>
                <div>
                  <strong>Wind Speed</strong>
                  <span>{weather.wind.speed} {speedUnit}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Highlights & Forecast */}
            <div className="secondary-weather-right">
              
              <div className="highlights-section">
                <h4>Today's Highlights</h4>
                <div className="highlights-grid">
                  <div className="highlight-card">
                    <span className="hl-title">Sunrise & Sunset</span>
                    <div className="hl-value-group">
                      <p>🌅 {formatTime(weather.sys.sunrise)}</p>
                      <p>🌇 {formatTime(weather.sys.sunset)}</p>
                    </div>
                  </div>

                  <div className="highlight-card">
                    <span className="hl-title">Air Quality</span>
                    {airQuality && (
                      <p className="hl-value" style={{ color: getAQIDescription(airQuality).color }}>
                        {getAQIDescription(airQuality).text}
                      </p>
                    )}
                  </div>

                  <div className="highlight-card">
                    <span className="hl-title">Visibility</span>
                    <p className="hl-value">{(weather.visibility / 1000).toFixed(1)} km</p>
                  </div>

                  <div className="highlight-card">
                    <span className="hl-title">Pressure</span>
                    <p className="hl-value">{weather.main.pressure} hPa</p>
                  </div>
                </div>
              </div>

              {forecast.length > 0 && (
                <div className="forecast-section">
                  <h4>5-Day Forecast</h4>
                  <div className="forecast-container">
                    {forecast.map((item, index) => (
                      <div key={index} className="forecast-card">
                        <span className="forecast-day">{getDayName(item.dt_txt)}</span>
                        <img
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                          alt={item.weather[0].description}
                        />
                        <span className="forecast-temp">{Math.round(item.main.temp)}{unitSymbol}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;