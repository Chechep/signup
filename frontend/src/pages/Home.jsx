// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  MapPin,
  Thermometer,
  Droplet,
  Wind,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
} from "lucide-react";
import News from "./News";

export default function Home() {
  const { logout } = useAuth();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [time, setTime] = useState(new Date());
  const [map, setMap] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // clock updater
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isDayTime = () => {
    if (!weather) return true;
    const now = Date.now() / 1000;
    return now >= weather.sys.sunrise && now < weather.sys.sunset;
  };

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Enter a city name");
      setWeather(null);
      setForecast([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (res.ok) {
        setWeather(data);
        setError("");
        if (map && data.coord) {
          map.setView([data.coord.lat, data.coord.lon], 10); // move map
        }
      } else {
        setError(data.message);
        setWeather(null);
        setForecast([]);
        return;
      }

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();
      if (forecastRes.ok) {
        const dailyForecast = forecastData.list.filter((f) =>
          f.dt_txt.includes("12:00:00")
        );
        setForecast(dailyForecast);
      } else {
        setForecast([]);
      }
    } catch {
      setError("Failed to fetch weather");
      setWeather(null);
      setForecast([]);
    }
  };

  // init map
  useEffect(() => {
    const L = window.L;
    if (L && !map) {
      const newMap = L.map("map", {
        center: [0, 0],
        zoom: 2,
        zoomControl: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(newMap);
      setMap(newMap);
    }
  }, [map]);

  const renderWeatherIcons = () => {
    if (!weather) return null;
    const main = weather.weather[0].main.toLowerCase();

    if (main.includes("rain"))
      return <CloudRain className="absolute top-3 left-3 w-7 h-7 text-blue-500 animate-bounce" />;
    if (main.includes("snow"))
      return <CloudSnow className="absolute top-3 left-3 w-7 h-7 text-white animate-bounce" />;
    if (main.includes("cloud"))
      return <Cloud className="absolute top-3 left-3 w-8 h-8 text-gray-400 animate-bounce" />;
    if (main.includes("clear") && isDayTime())
      return <Sun className="absolute top-3 left-3 w-8 h-8 text-yellow-400 animate-spin-slow" />;
    if (main.includes("clear") && !isDayTime())
      return <Moon className="absolute top-3 left-3 w-7 h-7 text-gray-300 animate-spin-slow" />;
    return null;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Map Background */}
      <div id="map" className="absolute top-0 left-0 w-full h-full z-0"></div>

      {/* Weather Dashboard */}
      <div className="relative z-10 w-full bg-white/80 backdrop-blur-md shadow p-4 flex flex-col items-center">
        {renderWeatherIcons()}
        <div className="w-full max-w-5xl">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-bold">Weather Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>

          {/* Time */}
          <p className="text-xs text-gray-600 mb-2 text-right">
            {time.toLocaleDateString()} | {time.toLocaleTimeString()}
          </p>

          {/* Input */}
          <div className="flex gap-2 mb-3 items-center">
            <MapPin className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="flex-1 border p-2 rounded focus:outline-none text-sm"
            />
            <button
              onClick={fetchWeather}
              className="flex items-center gap-1 bg-teal-500 text-white py-1 px-3 rounded hover:bg-teal-700 text-sm transition"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </div>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          {/* Current weather */}
          {weather && (
            <div className="text-center mb-3">
              <h2 className="text-base font-bold mb-1">
                {weather.name}, {weather.sys.country}
              </h2>
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto w-12 h-12"
              />
              <p className="text-xl font-bold my-1 flex items-center justify-center gap-1">
                <Thermometer className="w-4 h-4 text-red-500" />{" "}
                {weather.main.temp}°C
              </p>
              <p className="capitalize text-xs">{weather.weather[0].description}</p>
              <div className="flex justify-around mt-1 text-xs text-gray-700">
                <p>
                  <Droplet className="w-3 h-3 inline" /> {weather.main.humidity}%
                </p>
                <p>
                  <Wind className="w-3 h-3 inline" /> {weather.wind.speed} m/s
                </p>
              </div>
            </div>
          )}

          {/* Forecast */}
          {forecast.length > 0 && (
            <div className="grid grid-cols-5 gap-1 mt-2 text-center text-xs">
              {forecast.map((f) => (
                <div
                  key={f.dt}
                  className="bg-gray-100/70 rounded p-1 flex flex-col items-center"
                >
                  <p className="font-bold">{getDayName(f.dt_txt)}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
                    alt={f.weather[0].description}
                    className="w-6 h-6"
                  />
                  <p className="font-bold flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-red-500" />{" "}
                    {Math.round(f.main.temp)}°C
                  </p>
                  <p className="capitalize">{f.weather[0].description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* News Section */}
      <div className="relative z-10 w-full max-w-6xl mx-auto mt-6 px-4">
        <News city={weather?.name || city} />
      </div>
    </div>
  );
}
