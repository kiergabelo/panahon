import type { WeatherData } from "@/lib/weather";
import { AnimatedNumber } from "./animated-number";

export function PressureCard({ data }: { data: WeatherData }) {
  const c = data.current;
  const pressure = c.pressure;
  const trend = pressure < 1010 ? "falling" : pressure > 1020 ? "rising" : "steady";
  const trendColor = pressure < 1010 ? "var(--rain)" : pressure > 1020 ? "var(--accent)" : "var(--muted)";
  const trendLabel = pressure < 1010 ? "↓ Low" : pressure > 1020 ? "↑ High" : "→ Normal";

  return (
    <div className="card p-6 animate-fade-in flex flex-col gap-3">
      <h2 className="text-sm text-faint uppercase tracking-wide">Air & Pressure</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-faint mb-1">Pressure</div>
          <div className="text-xl font-semibold tabular" style={{ color: trendColor }}>
            <AnimatedNumber value={pressure} format={(n) => `${Math.round(n)}`} />
            <span className="text-xs text-faint ml-1">hPa</span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: trendColor }}>{trendLabel}</div>
        </div>
        <div>
          <div className="text-xs text-faint mb-1">Cloud Cover</div>
          <div className="text-xl font-semibold tabular">
            <AnimatedNumber value={c.cloudCover} format={(n) => `${Math.round(n)}%`} />
          </div>
          <div className="mt-1.5 h-1.5 bg-line rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${c.cloudCover}%`, background: "var(--faint)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
