import type { CurrentWeatherData, ForecastItem, ProcessedForecastDay, WeatherApiResponse } from '@/types/weather';
import { format } from 'date-fns';

const PLACEHOLDER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Standard placeholder
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || PLACEHOLDER_API_KEY;

if (API_KEY === PLACEHOLDER_API_KEY) {
  console.warn(`OpenWeatherMap API key is not configured or is using the placeholder value. Please set NEXT_PUBLIC_OPENWEATHERMAP_API_KEY in your .env file with a valid key. The application may be using a fallback key or showing sample data if this is the case. Key detected by service: ${API_KEY}`);
}

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const fetchData = async <T>(endpoint: string, params: Record<string, string | number>): Promise<T> => {
  const queryParams = new URLSearchParams({
    ...params,
    appid: API_KEY,
    units: 'metric', // Use Celsius
  }).toString();
  
  const response = await fetch(`${BASE_URL}/${endpoint}?${queryParams}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getCurrentWeather = async (lat: number, lon: number): Promise<CurrentWeatherData> => {
  return fetchData<CurrentWeatherData>('weather', { lat, lon });
};

export const getCurrentWeatherByCity = async (city: string): Promise<CurrentWeatherData> => {
  return fetchData<CurrentWeatherData>('weather', { q: city });
};

export const getForecast = async (lat: number, lon: number): Promise<WeatherApiResponse<ForecastItem>> => {
  return fetchData<WeatherApiResponse<ForecastItem>>('forecast', { lat, lon });
};

export const getForecastByCity = async (city: string): Promise<WeatherApiResponse<ForecastItem>> => {
  return fetchData<WeatherApiResponse<ForecastItem>>('forecast', { q: city });
};

export const processForecastData = (forecastItems: ForecastItem[]): ProcessedForecastDay[] => {
  const dailyData: Record<string, { temps: number[], conditions: ForecastItem[] }> = {};

  forecastItems.forEach(item => {
    const dateKey = format(new Date(item.dt_txt), 'yyyy-MM-dd');
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = { temps: [], conditions: [] };
    }
    dailyData[dateKey].temps.push(item.main.temp_min, item.main.temp_max);
    dailyData[dateKey].conditions.push(item);
  });
  
  const processedDays: ProcessedForecastDay[] = Object.keys(dailyData).slice(0, 5).map(dateKey => {
    const dayTemps = dailyData[dateKey].temps;
    const dayConditions = dailyData[dateKey].conditions;
    
    // Find condition closest to midday (or most frequent)
    // For simplicity, take the condition from an entry around 12:00-15:00
    const middayCondition = 
      dayConditions.find(c => new Date(c.dt_txt).getHours() >= 12 && new Date(c.dt_txt).getHours() <= 15) || 
      dayConditions[Math.floor(dayConditions.length / 2)] || // fallback to middle entry
      dayConditions[0]; // fallback to first entry

    return {
      date: format(new Date(dateKey), 'EEE, MMM d'),
      minTemp: Math.min(...dayTemps),
      maxTemp: Math.max(...dayTemps),
      condition: middayCondition.weather[0].description,
      icon: middayCondition.weather[0].icon,
      conditionId: middayCondition.weather[0].id,
    };
  });

  return processedDays;
};
