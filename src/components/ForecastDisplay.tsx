'use client';

import React from 'react';
import type { ProcessedForecastDay } from '@/types/weather';
import ForecastItem from './ForecastItem';
import { CalendarDays } from 'lucide-react';

interface ForecastDisplayProps {
  forecast: ProcessedForecastDay[];
}

const ForecastDisplay: React.FC<ForecastDisplayProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="mt-8 animate-fade-in">
      <h2 className="text-2xl font-headline mb-4 flex items-center text-primary">
        <CalendarDays className="mr-2 h-6 w-6" />
        5-Day Forecast
      </h2>
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        {forecast.map((day, index) => (
          <ForecastItem key={day.date} day={day} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ForecastDisplay;
