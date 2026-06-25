"use client";

import { useCallback, useState } from "react";
import useSWR from "swr";
import { cities, defaultCity, type City } from "@/lib/cities";
import { fetchWeather, type WeatherData } from "@/lib/weather";
import { CurrentConditions } from "@/components/current-conditions";
import { ForecastStrip } from "@/components/forecast-strip";
import { TempChart } from "@/components/temp-chart";
import { PrecipChart } from "@/components/precip-chart";
import { HourlyForecast } from "@/components/hourly-forecast";
import { SunTimesCard } from "@/components/sun-times-card";
import { PressureCard } from "@/components/pressure-card";
import { LastUpdated } from "@/components/last-updated";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { ErrorState } from "@/components/error-state";

export default function Home() {
  const [city, setCity] = useState<City>(defaultCity);

  const { data, error, isLoading, mutate } = useSWR<WeatherData>(
    ["weather", city.id],
    () => fetchWeather(city),
    {
      refreshInterval: 600_000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const handleRetry = useCallback(() => mutate(), [mutate]);

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <a href="#content" className="skip-link">Skip to content</a>
      <div id="content" />
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 100 100" className="flex-shrink-0">
            <rect width="100" height="100" rx="22" fill="var(--card)" stroke="var(--line)" />
            <circle cx="50" cy="42" r="18" fill="var(--warm)" opacity="0.9" />
            <g stroke="var(--warm)" strokeWidth="3.5" strokeLinecap="round">
              <line x1="50" y1="12" x2="50" y2="18" />
              <line x1="50" y1="66" x2="50" y2="72" />
              <line x1="20" y1="42" x2="26" y2="42" />
              <line x1="74" y1="42" x2="80" y2="42" />
              <line x1="28" y1="20" x2="32" y2="24" />
              <line x1="68" y1="60" x2="72" y2="64" />
              <line x1="28" y1="64" x2="32" y2="60" />
              <line x1="68" y1="24" x2="72" y2="20" />
            </g>
            <path d="M 28 82 Q 50 72 72 82" stroke="var(--cool)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.5" />
          </svg>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Panahon</h1>
            <p className="text-sm text-muted mt-0.5">
              Real-time PH weather · powered by Open-Meteo
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:items-end gap-2">
          <select
            value={city.id}
            onChange={(e) => {
              const found = cities.find((c) => c.id === e.target.value);
              if (found) setCity(found);
            }}
            className="bg-panel border border-line rounded-lg px-4 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            aria-label="Select city"
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.region}
              </option>
            ))}
          </select>
          {data && <LastUpdated time={new Date(data.current.time)} isLoading={isLoading} />}
        </div>
      </header>

      {error && !data && <ErrorState onRetry={handleRetry} />}

      {isLoading && !data && <LoadingSkeleton />}

      {error && data && (
        <div className="card p-4 mb-4 flex items-center gap-3 border-l-2 border-warm">
          <span className="text-sm text-muted">Showing cached data — refresh failed.</span>
          <button onClick={handleRetry} className="text-xs text-accent underline cursor-pointer">Retry</button>
        </div>
      )}

      {data && !error && (
        <div className="flex flex-col gap-4">
          <CurrentConditions data={data} />
          <HourlyForecast data={data} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TempChart data={data} />
            <PrecipChart data={data} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SunTimesCard data={data} />
            <PressureCard data={data} />
            <ForecastStrip data={data} />
          </div>
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-line">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-faint">
          <div className="flex items-center gap-3">
            <span>
              Data:{" "}
              <a href="https://open-meteo.com" target="_blank" rel="noopener" className="underline hover:text-muted transition-colors">
                Open-Meteo
              </a>
              {" "}· No API key required
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Cebuano: panahon = weather</span>
            <span className="text-line">|</span>
            <a href="https://kierabelo.com" target="_blank" rel="noopener" className="underline hover:text-muted transition-colors">
              Kier Abelo
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
