import { useState } from "react";
import type { WeatherData } from "@/lib/weather";
import { weatherCodeMap, describeWeather } from "@/lib/weather";
import { WeatherIcon } from "./weather-icon";
import { AnimatedNumber } from "./animated-number";
import { formatDay, scale, tempColor, formatTime } from "@/lib/utils";

export function ForecastStrip({ data }: { data: WeatherData }) {
  const d = data.daily;
  const [expanded, setExpanded] = useState<number | null>(0); // today expanded by default

  const allMin = Math.min(...d.tempMin);
  const allMax = Math.max(...d.tempMax);

  // Slice the 168 hourly entries into 7-day buckets of 24 hours.
  const hourlyByDay: number[][] = [];
  for (let day = 0; day < d.time.length; day++) {
    const start = day * 24;
    const end = Math.min(start + 24, data.hourly.time.length);
    hourlyByDay.push(Array.from({ length: end - start }, (_, i) => start + i));
  }

  return (
    <div className="card p-4 sm:p-6 animate-fade-in">
      <h2 className="text-sm text-faint uppercase tracking-wide mb-3">7-Day Forecast</h2>
      <div className="flex flex-col">
        {d.time.map((day, i) => {
          const lo = d.tempMin[i]!;
          const hi = d.tempMax[i]!;
          const x1 = scale(lo, allMin, allMax, 0, 100);
          const x2 = scale(hi, allMin, allMax, 0, 100);
          const iconName = weatherCodeMap[d.weatherCode[i]!]?.icon ?? "cloud";
          const isToday = i === 0;
          const isOpen = expanded === i;

          return (
            <div key={day} className="border-b border-line last:border-b-0">
              {/* Tap row */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className={`w-full flex items-center gap-3 py-2.5 px-2 rounded-lg transition-colors text-left ${
                  isOpen ? "bg-panel" : "hover:bg-panel/50"
                }`}
                aria-expanded={isOpen}
              >
                <span className={`w-12 text-sm flex-shrink-0 ${isToday ? "text-accent font-medium" : "text-muted"}`}>
                  {isToday ? "Today" : formatDay(day)}
                </span>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <WeatherIcon name={iconName} size={28} />
                </div>
                <span className="text-xs text-faint hidden sm:inline flex-shrink-0 w-24 truncate">
                  {describeWeather(d.weatherCode[i]!)}
                </span>
                <span className="text-sm text-faint tabular w-8 text-right flex-shrink-0">
                  {Math.round(lo)}°
                </span>
                {/* Temp range bar */}
                <div className="flex-1 h-1.5 bg-line rounded-full relative overflow-hidden min-w-[40px]">
                  <div
                    className="absolute h-full rounded-full transition-all duration-500"
                    style={{
                      left: `${x1}%`,
                      width: `${Math.max(2, x2 - x1)}%`,
                      background: `linear-gradient(90deg, ${tempColor(lo)}, ${tempColor(hi)})`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium tabular w-8 text-left flex-shrink-0">
                  {Math.round(hi)}°
                </span>
                {d.precipitationProb[i]! > 0 && (
                  <span className="text-xs text-rain tabular w-10 text-right flex-shrink-0">
                    {d.precipitationProb[i]}%
                  </span>
                )}
                {/* Chevron */}
                <svg
                  className={`w-4 h-4 text-faint flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="pb-4 pt-1 px-2 animate-fade-in">
                  <DayDetail
                    data={data}
                    dayIndex={i}
                    hourlyIndices={hourlyByDay[i] ?? []}
                    sunrise={d.sunrise[i]!}
                    sunset={d.sunset[i]!}
                    windMax={d.windSpeedMax[i]!}
                    precipSum={d.precipitationSum[i]!}
                    precipProb={d.precipitationProb[i]!}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayDetail({
  data,
  dayIndex,
  hourlyIndices,
  sunrise,
  sunset,
  windMax,
  precipSum,
  precipProb,
}: {
  data: WeatherData;
  dayIndex: number;
  hourlyIndices: number[];
  sunrise: string;
  sunset: string;
  windMax: number;
  precipSum: number;
  precipProb: number;
}) {
  const hours = hourlyIndices.map((idx) => ({
    time: data.hourly.time[idx]!,
    temp: data.hourly.temperature[idx]!,
    precip: data.hourly.precipitation[idx]!,
    precipProb: data.hourly.precipitationProb[idx]!,
  }));

  // Show 6 AM to 11 PM (18 hours), or all if less.
  const visibleHours = hours.filter((h) => {
    const hr = new Date(h.time).getHours();
    return hr >= 6;
  }).slice(0, 18);
  const display = visibleHours.length > 0 ? visibleHours : hours.slice(0, 12);

  const temps = display.map((h) => h.temp);
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);

  const sun = new Date(sunrise);
  const set = new Date(sunset);

  return (
    <div className="flex flex-col gap-3">
      {/* Stat chips */}
      <div className="flex gap-3 flex-wrap text-xs">
        <Chip label="Sunrise" value={formatTime(sunrise, { hourOnly: false })} />
        <Chip label="Sunset" value={formatTime(sunset, { hourOnly: false })} />
        <Chip label="Wind" value={`${Math.round(windMax)} m/s`} />
        <Chip label="Rain total" value={`${precipSum.toFixed(1)} mm`} />
        <Chip label="Rain chance" value={`${precipProb}%`} />
      </div>

      {/* Hourly temperature chart */}
      <div className="relative">
        <svg viewBox={`0 0 ${display.length * 32 + 16} 80`} className="w-full h-auto" role="img" aria-label="Hourly temperature">
          <defs>
            <linearGradient id={`dayGrad-${dayIndex}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--warm)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--warm)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Bars */}
          {display.map((h, i) => {
            const x = i * 32 + 8;
            const tempH = scale(h.temp, minT - 2, maxT + 2, 10, 55);
            const barY = 65 - tempH;
            const color = tempColor(h.temp);
            return (
              <g key={i}>
                <rect
                  x={x} y={barY} width="20" height={tempH}
                  rx="3" fill={color} opacity="0.7"
                />
                <text x={x + 10} y={barY - 3} fill={color} fontSize="9" textAnchor="middle" className="tabular">
                  {Math.round(h.temp)}°
                </text>
                <text x={x + 10} y={75} fill="var(--faint)" fontSize="8" textAnchor="middle">
                  {new Date(h.time).getHours() === 0 ? "12a" : new Date(h.time).getHours() <= 12 ? `${new Date(h.time).getHours()}a` : `${new Date(h.time).getHours() - 12}p`}
                </text>
              </g>
            );
          })}
          {/* Precipitation prob as a thin overlay bar */}
          {display.map((h, i) => {
            if (h.precipProb < 10) return null;
            const x = i * 32 + 8;
            const ph = (h.precipProb / 100) * 12;
            return (
              <rect key={`p${i}`} x={x + 20} y={65 - ph} width="3" height={ph} rx="1" fill="var(--rain)" opacity="0.6" />
            );
          })}
        </svg>
      </div>

      {/* Mobile-friendly: scrollable hourly list for touch */}
      <div className="flex gap-1 overflow-x-auto pb-1 sm:hidden" style={{ scrollbarWidth: "thin" }}>
        {display.map((h, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center w-12 text-xs">
            <span className="text-faint tabular">{formatTime(h.time, { hourOnly: true })}</span>
            <span className="font-medium tabular" style={{ color: tempColor(h.temp) }}>{Math.round(h.temp)}°</span>
            {h.precipProb > 10 && <span className="text-rain text-[10px] tabular">{h.precipProb}%</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-faint uppercase tracking-wide text-[10px]">{label}</span>
      <span className="text-muted font-medium tabular">{value}</span>
    </div>
  );
}
