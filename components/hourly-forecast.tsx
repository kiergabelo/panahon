"use client";

import { useState } from "react";
import { describeWeather, weatherCodeMap, type WeatherData } from "@/lib/weather";
import { formatTime, tempColor } from "@/lib/utils";
import { WeatherIcon } from "./weather-icon";

export function HourlyForecast({ data }: { data: WeatherData }) {
  const [hovered, setHovered] = useState<number>(0);
  const now = new Date();
  const hourly = data.hourly;
  const startIdx = hourly.time.findIndex((t) => new Date(t) >= now);
  const idx = startIdx >= 0 ? startIdx : 0;
  const hours = 12;
  const times = hourly.time.slice(idx, idx + hours);
  const temps = hourly.temperature.slice(idx, idx + hours);
  const probs = hourly.precipitationProb.slice(idx, idx + hours);

  if (!times.length) return null;

  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const dailyCode = data.daily.weatherCode[Math.floor(idx / 24)] ?? 0;
  const desc = describeWeather(dailyCode);

  const hv = Math.min(hovered, times.length - 1);
  const hvTemp = temps[hv] ?? temps[0]!;
  const hvProb = probs[hv] ?? 0;
  const hvTime = times[hv] ?? times[0]!;

  return (
    <div className="card p-6 animate-fade-in">
      <h2 className="text-sm text-faint uppercase tracking-wide mb-4">Next 12 Hours</h2>
      <div
        className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: "thin" }}
        onMouseLeave={() => setHovered(0)}
      >
        {times.map((time, i) => {
          const temp = temps[i]!;
          const prob = probs[i] ?? 0;
          const isNow = i === 0;
          const isHover = i === hovered;
          const barH = ((temp - minT) / Math.max(maxT - minT, 1)) * 100;
          const icon = weatherCodeMap[dailyCode]?.icon ?? "cloud";

          return (
            <div
              key={time}
              onMouseEnter={() => setHovered(i)}
              className={[
                "flex-shrink-0 w-[68px] relative flex flex-col items-center gap-2 rounded-lg p-2.5 border transition-all duration-200 cursor-default",
                "border-transparent",
                isHover
                  ? "bg-panel/70 scale-[1.06] border-accent/40"
                  : isNow
                    ? "bg-panel"
                    : "hover:bg-panel/50 hover:scale-[1.04] hover:border-accent/20",
              ].join(" ")}
            >
              <span className="text-xs text-faint">{isNow ? "Now" : formatTime(time, { hourOnly: true })}</span>
              <div className="w-7 h-7 flex items-center justify-center">
                <WeatherIcon name={icon} size={28} />
              </div>
              <span className="text-sm font-medium tabular" style={{ color: tempColor(temp) }}>
                {Math.round(temp)}°
              </span>
              <div className="w-full h-8 flex items-end">
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${Math.max(8, barH)}%`,
                    background: `linear-gradient(180deg, ${tempColor(temp)}, ${tempColor(temp)}88)`,
                  }}
                />
              </div>
              <span className={`text-[10px] tabular ${prob > 20 ? "text-rain" : "text-faint"}`}>
                {prob > 0 ? `${prob}%` : "—"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-line min-h-[3.25rem]">
        <div key={hv} className="animate-fade-in flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="text-muted tabular">{formatTime(hvTime, { hourOnly: true })}</span>
          <span className="text-base font-semibold tabular" style={{ color: tempColor(hvTemp) }}>
            {hvTemp.toFixed(1)}°
          </span>
          <span className="text-rain tabular">{hvProb}% rain</span>
          <span className="text-faint">{desc}</span>
        </div>
      </div>
    </div>
  );
}
