import type { WeatherData } from "@/lib/weather";
import { formatTime, tempColor } from "@/lib/utils";
import { WeatherIcon } from "./weather-icon";
import { weatherCodeMap } from "@/lib/weather";

export function HourlyForecast({ data }: { data: WeatherData }) {
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

  return (
    <div className="card p-6 animate-fade-in overflow-hidden">
      <h2 className="text-sm text-faint uppercase tracking-wide mb-4">Next 12 Hours</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "thin" }}>
        {times.map((time, i) => {
          const temp = temps[i]!;
          const prob = probs[i] ?? 0;
          const isNow = i === 0;
          const barH = ((temp - minT) / Math.max(maxT - minT, 1)) * 100;
          const icon = weatherCodeMap[data.daily.weatherCode[Math.floor(idx / 24)] ?? 0]?.icon ?? "cloud";

          return (
            <div
              key={time}
              className={`flex-shrink-0 w-[68px] flex flex-col items-center gap-2 rounded-lg p-2.5 transition-colors ${
                isNow ? "bg-panel" : "hover:bg-panel/50"
              }`}
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
    </div>
  );
}
