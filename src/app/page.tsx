'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { AppWeatherData, CurrentWeatherData, ProcessedForecastDay, Coordinates } from '@/types/weather';
import {
  getCurrentWeather,
  getCurrentWeatherByCity,
  getForecast,
  getForecastByCity,
  processForecastData,
} from '@/lib/weatherService';
import LocationForm from '@/components/LocationForm';
import CurrentWeatherCard from '@/components/CurrentWeatherCard';
import ForecastDisplay from '@/components/ForecastDisplay';
import WeatherTipCard from '@/components/WeatherTipCard';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const API_KEY_CONFIGURED = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY && process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY !== "YOUR_OPENWEATHERMAP_API_KEY";

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<AppWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWeatherData = useCallback(async (location: string | Coordinates) => {
    setLoading(true);
    setError(null);
    setWeatherData(null); // Clear previous data

    if (!API_KEY_CONFIGURED) {
      setError("OpenWeatherMap API key is not configured. Please set NEXT_PUBLIC_OPENWEATHERMAP_API_KEY in your .env.local file. Showing sample data.");
      // Load sample data if API key is not configured
      setWeatherData({
        current: {
          coord: { lat: 51.5074, lon: -0.1278 },
          weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d', id: 802 }],
          main: { temp: 15, feels_like: 14, temp_min: 13, temp_max: 17, pressure: 1012, humidity: 60 },
          visibility: 10000,
          wind: { speed: 5.5, deg: 270 },
          clouds: { all: 40 },
          dt: Date.now() / 1000,
          sys: { country: 'GB', sunrise: Date.now() / 1000 - 3600*5, sunset: Date.now() / 1000 + 3600*5 },
          timezone: 3600,
          id: 2643743,
          name: 'Sample City (London)',
          cod: 200,
        },
        forecast: [
          { date: 'Mon, Oct 28', minTemp: 10, maxTemp: 18, condition: 'Sunny', icon: '01d', conditionId: 800 },
          { date: 'Tue, Oct 29', minTemp: 9, maxTemp: 16, condition: 'Few clouds', icon: '02d', conditionId: 801 },
          { date: 'Wed, Oct 30', minTemp: 11, maxTemp: 15, condition: 'Rain', icon: '10d', conditionId: 500 },
          { date: 'Thu, Oct 31', minTemp: 8, maxTemp: 14, condition: 'Cloudy', icon: '04d', conditionId: 803 },
          { date: 'Fri, Nov 1', minTemp: 10, maxTemp: 17, condition: 'Partly cloudy', icon: '03d', conditionId: 802 },
        ],
      });
      setLoading(false);
      return;
    }

    try {
      let current: CurrentWeatherData;
      let forecastRaw;

      if (typeof location === 'string') {
        current = await getCurrentWeatherByCity(location);
        forecastRaw = await getForecastByCity(location);
      } else {
        current = await getCurrentWeather(location.lat, location.lon);
        forecastRaw = await getForecast(location.lat, location.lon);
      }
      
      const forecast = processForecastData(forecastRaw.list);
      setWeatherData({ current, forecast });

    } catch (err: any) {
      console.error("Failed to fetch weather data:", err);
      const errorMessage = err.message || "Failed to fetch weather data. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Attempt to get geolocation on initial load (optional, can be user-triggered only)
  useEffect(() => {
    // You could add logic here to fetch default location or user's last known location
    // For now, we wait for user interaction.
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center bg-gradient-to-br from-background to-primary/10">
      <header className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-5xl font-headline font-bold text-primary drop-shadow-md">
          WeatherWise
        </h1>
        <p className="text-lg text-foreground/80 mt-2">
          Your friendly weather companion with AI tips
        </p>
      </header>

      <main className="w-full max-w-5xl">
        <LocationForm onLocationSubmit={fetchWeatherData} loading={loading} />

        {loading && (
          <div className="flex justify-center items-center mt-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-xl">Fetching weather data...</p>
          </div>
        )}

        {error && !loading && (
           <Card className="mt-8 bg-destructive/10 border-destructive text-destructive-foreground animate-fade-in">
            <CardContent className="p-6 flex items-center">
              <AlertCircle className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">An error occurred</h3>
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!loading && !error && !weatherData && (
          <Card className="mt-8 bg-primary/5 animate-fade-in">
            <CardContent className="p-10 text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome to WeatherWise!</h2>
              <p className="text-muted-foreground">
                Enter a city name or use your current location to get the latest weather updates and AI-powered tips.
              </p>
            </CardContent>
          </Card>
        )}

        {weatherData && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CurrentWeatherCard data={weatherData.current} />
              </div>
              <div>
                <WeatherTipCard currentWeather={weatherData.current} />
              </div>
            </div>
            <ForecastDisplay forecast={weatherData.forecast} />
          </div>
        )}
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} WeatherWise. Powered by OpenWeatherMap.</p>
         {!API_KEY_CONFIGURED && <p className="text-xs text-destructive mt-1">Note: API key not configured, showing sample data.</p>}
      </footer>
    </div>
  );
}
