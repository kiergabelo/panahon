import { weatherCodeMap, type WeatherData } from "@/lib/weather";
import { WeatherIcon } from "./weather-icon";
import { formatDay, formatTemp, scale } from "@/lib/utils";
import { tempColor } from "@/lib/utils";

export function ForecastStrip({ data }: { data: WeatherData }) {
  const d = data.daily;

  const allMin = Math.min(...d.tempMin);
  const allMax = Math.max(...d.tempMax);

  return (
    <div className="card p-6 animate-fade-in">
      <h2 className="text-sm text-faint uppercase tracking-wide mb-4">7-Day Forecast</h2>
      <div className="flex flex-col gap-1">
        {d.time.map((day, i) => {
          const lo = d.tempMin[i]!;
          const hi = d.tempMax[i]!;
          const x1 = scale(lo, allMin, allMax, 0, 100);
          const x2 = scale(hi, allMin, allMax, 0, 100);
          const iconName = weatherCodeMap[d.weatherCode[i]!]?.icon ?? "cloud";
          const isToday = i === 0;
          return (
            <div
              key={day}
              className={`flex items-center gap-3 rounded-lg px-2 py-2 ${isToday ? "bg-panel" : ""}`}
            >
              <span className={`w-10 text-sm ${isToday ? "text-accent font-medium" : "text-muted"}`}>
                {isToday ? "Today" : formatDay(day)}
              </span>
              <div className="w-8 h-8 flex items-center justify-center">
                <WeatherIcon name={iconName} size={28} />
              </div>
              <span className="text-sm text-faint tabular w-10 text-right">
                {formatTemp(lo)}
              </span>
              <div className="flex-1 h-1.5 bg-line rounded-full relative overflow-hidden">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${x1}%`,
                    width: `${Math.max(2, x2 - x1)}%`,
                    background: `linear-gradient(90deg, ${tempColor(lo)}, ${tempColor(hi)})`,
                  }}
                />
              </div>
              <span className="text-sm font-medium tabular w-10 text-left">
                {formatTemp(hi)}
              </span>
              {d.precipitationProb[i]! > 0 && (
                <span className="text-xs text-rain tabular w-10 text-right">
                  {d.precipitationProb[i]}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
