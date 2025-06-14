'use client';

import React from 'react';
import type { CurrentWeatherData } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WeatherIcon, Thermometer, Droplets, Wind, Sunrise, Sunset } from '@/components/WeatherIcon';
import { format } from 'date-fns';

interface CurrentWeatherCardProps {
  data: CurrentWeatherData;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data }) => {
  if (!data) return null;

  const { name, main, weather, wind: windData, sys, dt } = data;
  const weatherCondition = weather[0];

  return (
    <Card className="w-full shadow-xl bg-card/80 backdrop-blur-sm animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-headline text-primary-foreground bg-primary p-3 rounded-t-lg -m-6 mb-0">
          {name}, {sys.country}
        </CardTitle>
        <CardDescription className="text-sm pt-8">
          Last updated: {format(new Date(dt * 1000), 'p, MMM dd')}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="flex flex-col items-center md:items-start">
          <WeatherIcon iconCode={weatherCondition.icon} description={weatherCondition.description} className="w-24 h-24 text-accent mb-2" />
          <p className="text-5xl font-bold text-accent">{Math.round(main.temp)}°C</p>
          <p className="text-lg capitalize">{weatherCondition.description}</p>
          <p className="text-sm text-muted-foreground">Feels like {Math.round(main.feels_like)}°C</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-2 bg-primary/5 rounded-md">
            <span className="flex items-center"><Droplets className="mr-2 h-5 w-5 text-primary" /> Humidity</span>
            <span className="font-semibold">{main.humidity}%</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-primary/5 rounded-md">
            <span className="flex items-center"><Wind className="mr-2 h-5 w-5 text-primary" /> Wind Speed</span>
            <span className="font-semibold">{windData.speed.toFixed(1)} km/h</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-primary/5 rounded-md">
            <span className="flex items-center"><Thermometer className="mr-2 h-5 w-5 text-primary" /> Pressure</span>
            <span className="font-semibold">{main.pressure} hPa</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-primary/5 rounded-md">
            <span className="flex items-center"><Sunrise className="mr-2 h-5 w-5 text-primary" /> Sunrise</span>
            <span className="font-semibold">{format(new Date(sys.sunrise * 1000), 'p')}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-primary/5 rounded-md">
            <span className="flex items-center"><Sunset className="mr-2 h-5 w-5 text-primary" /> Sunset</span>
            <span className="font-semibold">{format(new Date(sys.sunset * 1000), 'p')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeatherCard;
