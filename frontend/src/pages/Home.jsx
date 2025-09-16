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

  const getBackground = () => {
    if (!weather) return "bg-gradient-to-b from-blue-300 to-blue-100";
    const main = weather.weather[0].main.toLowerCase();
    const day = isDayTime();

    if (main.includes("cloud"))
      return day
        ? "bg-gradient-to-b from-gray-400 to-gray-200"
        : "bg-gradient-to-b from-gray-700 to-gray-900";
    if (main.includes("rain") || main.includes("drizzle"))
      return day
        ? "bg-gradient-to-b from-blue-600 to-blue-400"
        : "bg-gradient-to-b from-blue-900 to-blue-700";
    if (main.includes("snow"))
      return day
        ? "bg-gradient-to-b from-white to-gray-200"
        : "bg-gradient-to-b from-gray-200 to-gray-500";
    if (main.includes("clear"))
      return day
        ? "bg-gradient-to-b from-yellow-300 to-orange-200"
        : "bg-gradient-to-b from-indigo-800 to-black";
    return day
      ? "bg-gradient-to-b from-blue-300 to-blue-100"
      : "bg-gradient-to-b from-indigo-900 to-gray-800";
  };

  const renderWeatherIcons = () => {
    if (!weather) return null;
    const main = weather.weather[0].main.toLowerCase();

    if (main.includes("rain"))
      return (
        <CloudRain className="absolute top-5 left-5 w-10 h-10 animate-bounce text-blue-500" />
      );
    if (main.includes("snow"))
      return (
        <CloudSnow className="absolute top-5 left-5 w-10 h-10 animate-bounce text-white" />
      );
    if (main.includes("cloud"))
      return (
        <Cloud className="absolute top-5 left-5 w-12 h-12 animate-bounce text-gray-400" />
      );
    if (main.includes("clear") && isDayTime())
      return (
        <Sun className="absolute top-5 left-5 w-12 h-12 animate-spin-slow text-yellow-400" />
      );
    if (main.includes("clear") && !isDayTime())
      return (
        <Moon className="absolute top-5 left-5 w-10 h-10 animate-spin-slow text-gray-300" />
      );

    return null;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start relative transition-colors duration-1000 ${getBackground()}`}
    >
      {renderWeatherIcons()}

      {/* Weather Dashboard */}
      <div className="w-full max-w-3xl bg-white rounded shadow p-5 relative z-10 mt-6 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold">Weather Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Time */}
        <p className="text-xs text-gray-600 mb-2">
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
            className="flex items-center gap-1 bg-teal-500 text-white py-1 px-3 rounded hover:bg-teal-700 text-sm"
          >
            <Search className="w-4 h-4" /> Search
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        {/* Current weather */}
        {weather && (
          <div className="text-center mb-3">
            <h2 className="text-lg font-bold mb-1">
              {weather.name}, {weather.sys.country}
            </h2>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="mx-auto w-16 h-16"
            />
            <p className="text-2xl font-bold my-1 flex items-center justify-center gap-1">
              <Thermometer className="w-5 h-5 text-red-500" />{" "}
              {weather.main.temp}°C
            </p>
            <p className="capitalize text-sm">
              {weather.weather[0].description}
            </p>
            <div className="flex justify-around mt-1 text-xs text-gray-700">
              <p>
                <Droplet className="w-3 h-3 inline" /> Humidity:{" "}
                {weather.main.humidity}%
              </p>
              <p>
                <Wind className="w-3 h-3 inline" /> Wind: {weather.wind.speed}{" "}
                m/s
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
                className="bg-gray-100 rounded p-1 flex flex-col items-center"
              >
                <p className="font-bold">{getDayName(f.dt_txt)}</p>
                <img
                  src={`http://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
                  alt={f.weather[0].description}
                  className="w-8 h-8"
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

      {/* News section */}
      <div className="w-full max-w-5xl px-4">
        <News />
      </div>
    </div>
  );
}
