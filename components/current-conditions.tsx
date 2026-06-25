import { WeatherIcon } from "./weather-icon";
import { describeWeather, weatherCodeMap, type WeatherData } from "@/lib/weather";
import { formatTemp, formatMs } from "@/lib/utils";

export function CurrentConditions({ data }: { data: WeatherData }) {
  const c = data.current;
  const iconName = weatherCodeMap[c.weatherCode]?.icon ?? "cloud";

  const stats = [
    { label: "Feels like", value: formatTemp(c.apparentTemperature) },
    { label: "Humidity", value: `${c.humidity}%` },
    { label: "Wind", value: formatMs(c.windSpeed) },
    { label: "Precip.", value: `${c.precipitation} mm` },
  ];

  return (
    <div className="card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-fade-in">
      <div className="flex items-center gap-4 flex-1">
        <WeatherIcon name={iconName} size={72} />
        <div>
          <div className="text-5xl sm:text-6xl font-bold tabular" style={{ color: "var(--fg)" }}>
            {formatTemp(c.temperature)}
          </div>
          <div className="text-sm text-muted mt-1">
            {describeWeather(c.weatherCode)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full sm:w-auto">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <span className="text-xs text-faint uppercase tracking-wide">{s.label}</span>
            <span className="text-lg font-medium tabular">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
