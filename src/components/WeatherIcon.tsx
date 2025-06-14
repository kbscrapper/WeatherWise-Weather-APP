'use client';

import React from 'react';
import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, Cloudy,
  CloudDrizzle, CloudRain, CloudLightning, CloudSnow, Snowflake,
  CloudFog, Wind, Thermometer, Droplets, Sunrise, Sunset
} from 'lucide-react';

interface WeatherIconProps extends React.SVGProps<SVGSVGElement> {
  iconCode: string; // OpenWeatherMap icon code (e.g., "01d", "10n")
  description?: string; // Weather description for aria-label
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, description, className, ...props }) => {
  const baseCode = iconCode.substring(0, 2); // "01", "02", ..., "50"
  const dayNight = iconCode.substring(2, 3); // "d" or "n"

  let IconComponent: React.ElementType = Cloud; // Default icon

  switch (baseCode) {
    case '01': // clear sky
      IconComponent = dayNight === 'd' ? Sun : Moon;
      break;
    case '02': // few clouds
      IconComponent = dayNight === 'd' ? CloudSun : CloudMoon;
      break;
    case '03': // scattered clouds
      IconComponent = Cloud;
      break;
    case '04': // broken clouds, overcast clouds
      IconComponent = Cloudy;
      break;
    case '09': // shower rain
      IconComponent = CloudDrizzle;
      break;
    case '10': // rain
      IconComponent = CloudRain;
      break;
    case '11': // thunderstorm
      IconComponent = CloudLightning;
      break;
    case '13': // snow
      IconComponent = Snowflake; // CloudSnow is also an option
      break;
    case '50': // mist, fog, etc.
      IconComponent = CloudFog;
      break;
    default:
      IconComponent = Cloud; // Fallback for unknown codes
  }
  
  const defaultClassName = "w-12 h-12 text-accent"; // Default size and color

  return <IconComponent aria-label={description || `Weather icon: ${iconCode}`} className={className || defaultClassName} {...props} />;
};

export { WeatherIcon, Thermometer, Droplets, Wind, Sunrise, Sunset };
