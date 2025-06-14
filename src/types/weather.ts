
export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  main: string; // e.g., "Clouds", "Rain"
  description: string; // e.g., "scattered clouds"
  icon: string; // e.g., "03d"
  id: number; // Weather condition id
}

export interface CurrentWeatherData {
  coord: Coordinates;
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number; // Timestamp
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number; // City ID
  name: string; // City name
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: WeatherCondition[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number; // Probability of precipitation
  sys: {
    pod: "d" | "n"; // Part of day (d = day, n = night)
  };
  dt_txt: string; // "YYYY-MM-DD HH:MM:SS"
}

export interface ProcessedForecastDay {
  date: string; // Formatted date string e.g., "Mon, Oct 28"
  minTemp: number;
  maxTemp: number;
  condition: string; // e.g., "scattered clouds"
  icon: string; // e.g., "03d"
  conditionId: number;
}

export interface WeatherApiResponse<T> {
  cod: string; // For forecast, usually "200"
  message: number; // For forecast
  cnt: number; // For forecast, count of items
  list: T[]; // For forecast
  city: { // For forecast
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Combined data structure for the app state
export interface AppWeatherData {
  current: CurrentWeatherData;
  forecast: ProcessedForecastDay[];
}
