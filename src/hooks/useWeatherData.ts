'use client';

import { useState, useEffect } from 'react';
import { WeatherData, HistoricalWeather } from '../types/weather';
import { API_KEYS } from '../utils/weatherUtils';

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalWeather[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (city: string) => {
    if (API_KEYS.OPENWEATHER === 'YOUR_OPENWEATHER_API_KEY') {
      // Mock data for demo when API key is not provided
      const mockData: WeatherData = {
        location: {
          name: city,
          country: 'Demo Country',
          lat: 40.7128,
          lon: -74.0060
        },
        current: {
          temp: 22.5,
          feels_like: 24.2,
          humidity: 65,
          wind_speed: 3.4,
          weather: [{
            main: 'Clouds',
            description: 'scattered clouds',
            icon: '03d'
          }],
          sunrise: Math.floor(Date.now() / 1000) - 21600,
          sunset: Math.floor(Date.now() / 1000) + 21600,
          uvi: 5.2
        },
        hourly: Array.from({ length: 12 }, (_, i) => ({
          dt: Math.floor(Date.now() / 1000) + (i * 3600),
          temp: 20 + Math.random() * 10,
          weather: [{
            main: 'Clouds',
            description: 'scattered clouds',
            icon: '03d'
          }],
          pop: Math.random() * 0.8
        })),
        daily: Array.from({ length: 7 }, (_, i) => ({
          dt: Math.floor(Date.now() / 1000) + (i * 86400),
          temp: {
            day: 20 + Math.random() * 10,
            night: 15 + Math.random() * 5,
            min: 15 + Math.random() * 3,
            max: 25 + Math.random() * 8
          },
          weather: [{
            main: 'Clouds',
            description: 'scattered clouds',
            icon: '03d'
          }],
          pop: Math.random() * 0.7,
          humidity: 60 + Math.random() * 20,
          wind_speed: 2 + Math.random() * 5,
          sunrise: Math.floor(Date.now() / 1000) + (i * 86400) - 21600,
          sunset: Math.floor(Date.now() / 1000) + (i * 86400) + 21600
        }))
      };
      
      // Add mock alert if it's supposed to be stormy
      if (Math.random() > 0.7) {
        mockData.alerts = [{
          sender_name: 'National Weather Service',
          event: 'Thunderstorm Watch',
          start: Math.floor(Date.now() / 1000),
          end: Math.floor(Date.now() / 1000) + 7200,
          description: 'Thunderstorms are possible in your area. Stay indoors and avoid outdoor activities.',
          tags: ['Thunderstorm']
        }];
      }

      setWeatherData(mockData);
      
      // Mock historical data
      const mockHistorical: HistoricalWeather[] = [
        {
          date: 'Same day last year',
          temp: 18.5,
          description: 'sunny with light clouds',
          year: new Date().getFullYear() - 1
        },
        {
          date: 'Same day 2 years ago',
          temp: 25.3,
          description: 'partly cloudy',
          year: new Date().getFullYear() - 2
        }
      ];
      setHistoricalData(mockHistorical);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get coordinates for the city
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEYS.OPENWEATHER}`
      );
      
      if (!geoResponse.ok) {
        throw new Error('City not found');
      }

      const geoData = await geoResponse.json();
      if (geoData.length === 0) {
        throw new Error('City not found');
      }

      const { lat, lon, name, country } = geoData[0];

      // Get current weather and forecasts
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_KEYS.OPENWEATHER}&units=metric`
      );

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await weatherResponse.json();

      const weatherData: WeatherData = {
        location: { name, country, lat, lon },
        current: data.current,
        hourly: data.hourly.slice(0, 12),
        daily: data.daily.slice(0, 7),
        alerts: data.alerts || []
      };

      setWeatherData(weatherData);

      // Fetch historical data for fun facts (last 2-3 years, same day)
      await fetchHistoricalData(lat, lon);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalData = async (lat: number, lon: number) => {
    try {
      const historical: HistoricalWeather[] = [];
      const today = new Date();
      const currentYear = today.getFullYear();

      // Fetch data for same day in previous years
      for (let yearOffset = 1; yearOffset <= 3; yearOffset++) {
        const targetYear = currentYear - yearOffset;
        const targetDate = new Date(targetYear, today.getMonth(), today.getDate());
        const timestamp = Math.floor(targetDate.getTime() / 1000);

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${API_KEYS.OPENWEATHER}&units=metric`
          );

          if (response.ok) {
            const data = await response.json();
            historical.push({
              date: `Same day ${yearOffset} year${yearOffset > 1 ? 's' : ''} ago`,
              temp: data.data[0]?.temp || data.current?.temp,
              description: data.data[0]?.weather[0]?.description || data.current?.weather[0]?.description,
              year: targetYear
            });
          }
        } catch (error) {
          console.warn(`Failed to fetch historical data for ${targetYear}:`, error);
        }
      }

      setHistoricalData(historical);
    } catch (error) {
      console.warn('Failed to fetch historical data:', error);
    }
  };

  return {
    weatherData,
    historicalData,
    loading,
    error,
    fetchWeatherData
  };
};
