'use client';

import React, { useState, useEffect } from 'react';
import type { CurrentWeatherData } from '@/types/weather';
import { weatherTips } from '@/ai/flows/weather-tips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherTipCardProps {
  currentWeather: CurrentWeatherData | null;
}

const WeatherTipCard: React.FC<WeatherTipCardProps> = ({ currentWeather }) => {
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentWeather) {
      const fetchTip = async () => {
        setLoading(true);
        setError(null);
        try {
          const aiInput = {
            temperature: Math.round(currentWeather.main.temp),
            humidity: currentWeather.main.humidity,
            windSpeed: currentWeather.wind.speed,
            condition: currentWeather.weather[0].main,
          };
          const result = await weatherTips(aiInput);
          setTip(result.tip);
        } catch (err) {
          console.error("Error fetching AI weather tip:", err);
          setError("Could not fetch a weather tip at this time.");
          setTip(null); 
        } finally {
          setLoading(false);
        }
      };
      fetchTip();
    } else {
      setTip(null); 
    }
  }, [currentWeather]);

  const tipKey = currentWeather ? `${currentWeather.dt}-${currentWeather.name}` : 'no-weather';

  return (
    <Card className="w-full shadow-xl bg-card/80 backdrop-blur-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline text-primary">
          <Lightbulb className="mr-2 h-6 w-6 text-accent" />
          AI Weather Tip
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[60px]">
        {loading && (
          <div className="space-y-2 pt-1">
            <Skeleton className="h-4 w-full bg-muted/50" />
            <Skeleton className="h-4 w-3/4 bg-muted/50" />
          </div>
        )}
        {error && <p className="text-destructive text-sm">{error}</p>}
        {!loading && !error && tip && (
          <p key={tipKey} className="text-sm text-foreground/90 animate-slide-in-up opacity-0 [--slide-in-delay:300ms]">
            {tip}
          </p>
        )}
        {!loading && !error && !tip && !currentWeather && (
          <p className="text-sm text-muted-foreground">Enter a location to get weather tips.</p>
        )}
         {!loading && !error && !tip && currentWeather && (
          <p className="text-sm text-muted-foreground">No tip available right now.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherTipCard;
