import { describeWeather, weatherCodeMap, type WeatherData } from "@/lib/weather";
import { WeatherIcon } from "./weather-icon";
import { formatDay, formatTemp, formatTime, scale } from "@/lib/utils";
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
          const code = d.weatherCode[i]!;
          const iconName = weatherCodeMap[code]?.icon ?? "cloud";
          const isToday = i === 0;
          const windMax = d.windSpeedMax[i]!;
          const sunrise = d.sunrise[i]!;
          const sunset = d.sunset[i]!;
          const precipSum = d.precipitationSum[i]!;
          return (
            <div
              key={day}
              className={[
                "group relative flex flex-col rounded-lg px-2 py-2 transition-all duration-200",
                isToday ? "bg-panel/60" : "hover:bg-panel/40",
                "hover:shadow-[inset_3px_0_0_0_var(--accent)]",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
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
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-200 ease-out">
                <div className="overflow-hidden">
                  <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <span>{describeWeather(code)}</span>
                    <span className="tabular">Wind max {Math.round(windMax)} m/s</span>
                    <span className="tabular">Sunrise {formatTime(sunrise)}</span>
                    <span className="tabular">Sunset {formatTime(sunset)}</span>
                    {precipSum > 0 && (
                      <span className="text-rain tabular">{precipSum.toFixed(1)} mm</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
