'use client';

import React from "react"
import { useState, useEffect } from 'react';

export const WeatherDashboard = () => {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setWeather({
        temp: 22,
        description: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        feelsLike: 20
      });
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-purple-300 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <span className="text-5xl">🌤️</span>
            <div>
              <h1 className="text-3xl font-bold">Weather Whisper</h1>
              <p className="text-sm opacity-90">Your beautiful weather companion</p>
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:outline-none"
            />
            <button className="px-6 py-2 rounded-lg bg-white/30 hover:bg-white/40 transition">
              Search
            </button>
          </div>
        </div>

        {!loading && weather && (
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-8 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="text-center space-y-4">
                <div className="text-8xl">🌤️</div>
                <div>
                  <div className="text-5xl font-bold">{weather.temp}°C</div>
                  <div className="text-lg opacity-90">Feels like {weather.feelsLike}°C</div>
                  <div className="text-2xl mt-2">{weather.description}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm opacity-75 mb-2">Humidity</div>
                  <div className="text-3xl font-bold">{weather.humidity}%</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm opacity-75 mb-2">Wind Speed</div>
                  <div className="text-3xl font-bold">{weather.windSpeed} km/h</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 col-span-2">
                  <div className="text-sm opacity-75 mb-2">Location</div>
                  <div className="text-2xl font-bold">{city}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-8 text-center text-white">
            <div className="text-5xl mb-4">🌤️</div>
            <div className="text-xl">Loading weather data...</div>
          </div>
        )}
      </div>
    </div>
  );
};
