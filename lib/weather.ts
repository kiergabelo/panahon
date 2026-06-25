import type { City } from "./cities";

export type CurrentWeather = {
  time: string;
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
};

export type HourlyForecast = {
  time: string[];
  temperature: number[];
  precipitationProb: number[];
  precipitation: number[];
};

export type DailyForecast = {
  time: string[];
  weatherCode: number[];
  tempMax: number[];
  tempMin: number[];
  precipitationSum: number[];
  precipitationProb: number[];
  windSpeedMax: number[];
  sunrise: string[];
  sunset: string[];
};

export type WeatherData = {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
};

const BASE = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.lat),
    longitude: String(city.lng),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
    ].join(","),
    hourly: ["temperature_2m", "precipitation_probability", "precipitation"].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "Asia/Manila",
    forecast_days: "7",
    wind_speed_unit: "ms",
  });

  const res = await fetch(`${BASE}?${params}`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const raw = await res.json();

  return {
    current: {
      time: raw.current.time,
      temperature: raw.current.temperature_2m,
      humidity: raw.current.relative_humidity_2m,
      apparentTemperature: raw.current.apparent_temperature,
      precipitation: raw.current.precipitation,
      weatherCode: raw.current.weather_code,
      windSpeed: raw.current.wind_speed_10m,
      windDirection: raw.current.wind_direction_10m,
      windGusts: raw.current.wind_gusts_10m,
    },
    hourly: {
      time: raw.hourly.time as string[],
      temperature: raw.hourly.temperature_2m as number[],
      precipitationProb: raw.hourly.precipitation_probability as number[],
      precipitation: raw.hourly.precipitation as number[],
    },
    daily: {
      time: raw.daily.time as string[],
      weatherCode: raw.daily.weather_code as number[],
      tempMax: raw.daily.temperature_2m_max as number[],
      tempMin: raw.daily.temperature_2m_min as number[],
      precipitationSum: raw.daily.precipitation_sum as number[],
      precipitationProb: raw.daily.precipitation_probability_max as number[],
      windSpeedMax: raw.daily.wind_speed_10m_max as number[],
      sunrise: raw.daily.sunrise as string[],
      sunset: raw.daily.sunset as string[],
    },
  };
}

export const weatherCodeMap: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "sun" },
  1: { label: "Mainly clear", icon: "sun-cloud" },
  2: { label: "Partly cloudy", icon: "sun-cloud" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Fog", icon: "fog" },
  48: { label: "Rime fog", icon: "fog" },
  51: { label: "Light drizzle", icon: "drizzle" },
  53: { label: "Drizzle", icon: "drizzle" },
  55: { label: "Heavy drizzle", icon: "drizzle" },
  56: { label: "Freezing drizzle", icon: "drizzle" },
  57: { label: "Freezing drizzle", icon: "drizzle" },
  61: { label: "Light rain", icon: "rain" },
  63: { label: "Rain", icon: "rain" },
  65: { label: "Heavy rain", icon: "rain" },
  66: { label: "Freezing rain", icon: "rain" },
  67: { label: "Freezing rain", icon: "rain" },
  71: { label: "Light snow", icon: "snow" },
  73: { label: "Snow", icon: "snow" },
  75: { label: "Heavy snow", icon: "snow" },
  77: { label: "Snow grains", icon: "snow" },
  80: { label: "Rain showers", icon: "rain" },
  81: { label: "Rain showers", icon: "rain" },
  82: { label: "Violent showers", icon: "rain" },
  85: { label: "Snow showers", icon: "snow" },
  86: { label: "Snow showers", icon: "snow" },
  95: { label: "Thunderstorm", icon: "storm" },
  96: { label: "Thunderstorm", icon: "storm" },
  99: { label: "Thunderstorm", icon: "storm" },
};

export function describeWeather(code: number): string {
  return weatherCodeMap[code]?.label ?? "Unknown";
}
