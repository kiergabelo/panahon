import { WeatherIcon } from "./weather-icon";
import { WindCompass } from "./wind-compass";
import { AnimatedNumber } from "./animated-number";
import { describeWeather, weatherCodeMap, type WeatherData } from "@/lib/weather";
import { formatTemp, formatMs } from "@/lib/utils";

export function CurrentConditions({ data }: { data: WeatherData }) {
  const c = data.current;
  const iconName = weatherCodeMap[c.weatherCode]?.icon ?? "cloud";

  return (
    <div className="card p-6 sm:p-8 flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <WeatherIcon name={iconName} size={72} />
        <div>
          <div className="text-5xl sm:text-6xl font-bold tabular" style={{ color: "var(--fg)" }}>
            <AnimatedNumber value={c.temperature} format={(n) => `${Math.round(n)}°`} />
          </div>
          <div className="text-sm text-muted mt-1">
            {describeWeather(c.weatherCode)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
        <Stat
          label="Feels like"
          value={<AnimatedNumber value={c.apparentTemperature} format={(n) => `${Math.round(n)}°`} />}
        />
        <Stat
          label="Humidity"
          value={<AnimatedNumber value={c.humidity} format={(n) => `${Math.round(n)}%`} />}
        />
        <Stat
          label="Precip."
          value={<AnimatedNumber value={c.precipitation} format={(n) => `${n.toFixed(1)} mm`} />}
        />
        <div className="flex flex-col items-start gap-2">
          <span className="text-xs text-faint uppercase tracking-wide">Wind</span>
          <div className="flex items-center gap-3">
            <WindCompass directionDeg={c.windDirection} size={48} />
            <div className="flex flex-col">
              <span className="text-lg font-medium tabular">
                <AnimatedNumber value={c.windSpeed} format={(n) => formatMs(n)} />
              </span>
              <span className="text-xs text-faint tabular">
                gusts <AnimatedNumber value={c.windGusts} format={(n) => formatMs(n)} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-faint uppercase tracking-wide">{label}</span>
      <span className="text-lg font-medium tabular">{value}</span>
    </div>
  );
}
