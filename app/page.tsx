"use client";

import { useState } from "react";
import useSWR from "swr";
import { cities, defaultCity, type City } from "@/lib/cities";
import { fetchWeather, type WeatherData } from "@/lib/weather";
import { CurrentConditions } from "@/components/current-conditions";
import { ForecastStrip } from "@/components/forecast-strip";
import { TempChart } from "@/components/temp-chart";
import { PrecipChart } from "@/components/precip-chart";

export default function Home() {
  const [city, setCity] = useState<City>(defaultCity);

  const { data, error, isLoading } = useSWR<WeatherData>(
    ["weather", city.id],
    () => fetchWeather(city),
    { refreshInterval: 600_000, revalidateOnFocus: false },
  );

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panahon</h1>
          <p className="text-sm text-muted mt-1">
            Real-time Philippine weather · powered by Open-Meteo
          </p>
        </div>
        <select
          value={city.id}
          onChange={(e) => {
            const found = cities.find((c) => c.id === e.target.value);
            if (found) setCity(found);
          }}
          className="bg-panel border border-line rounded-lg px-4 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Select city"
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.region}
            </option>
          ))}
        </select>
      </header>

      {error && (
        <div className="card p-6 text-center text-muted animate-fade-in">
          <p>Failed to load weather data.</p>
          <p className="text-xs text-faint mt-1">Retrying automatically…</p>
        </div>
      )}

      {isLoading && (
        <div className="card p-12 text-center text-faint animate-pulse-slow">
          Loading weather data…
        </div>
      )}

      {data && !error && (
        <div className="flex flex-col gap-4">
          <CurrentConditions data={data} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TempChart data={data} />
            <PrecipChart data={data} />
          </div>
          <ForecastStrip data={data} />
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-line text-xs text-faint">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            Data:{" "}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener"
              className="underline hover:text-muted"
            >
              Open-Meteo
            </a>{" "}
            (no API key required)
          </span>
          <span>Cebuano: panahon = weather · built by Kier Abelo</span>
        </div>
      </footer>
    </main>
  );
}
