'use client';

import React from 'react';
import type { ProcessedForecastDay } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from '@/components/WeatherIcon';
import { Thermometer } from 'lucide-react';

interface ForecastItemProps {
  day: ProcessedForecastDay;
  index: number;
}

const ForecastItem: React.FC<ForecastItemProps> = ({ day, index }) => {
  return (
    <Card 
      className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.66rem)] lg:w-[calc(20%-0.8rem)] bg-card/70 backdrop-blur-sm shadow-lg animate-slide-in-up opacity-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="p-3 text-center bg-primary/10 rounded-t-md">
        <CardTitle className="text-md font-medium">{day.date}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col items-center text-center">
        <WeatherIcon iconCode={day.icon} description={day.condition} className="w-16 h-16 text-accent mb-2" />
        <p className="text-lg font-semibold text-accent">{Math.round(day.maxTemp)}°C</p>
        <p className="text-sm text-muted-foreground">{Math.round(day.minTemp)}°C</p>
        <p className="text-xs capitalize mt-1 text-muted-foreground h-8 overflow-hidden">{day.condition}</p>
      </CardContent>
    </Card>
  );
};

export default ForecastItem;
