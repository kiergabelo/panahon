import type { WeatherData } from "@/lib/weather";
import { AnimatedNumber } from "./animated-number";

export function SunTimesCard({ data }: { data: WeatherData }) {
  const d = data.daily;
  const today = 0;
  const sunrise = new Date(d.sunrise[today]!);
  const sunset = new Date(d.sunset[today]!);
  const now = new Date();
  const isDay = now >= sunrise && now <= sunset;

  const dayLength = (sunset.getTime() - sunrise.getTime()) / 3600000;
  const progress = isDay
    ? (now.getTime() - sunrise.getTime()) / (sunset.getTime() - sunrise.getTime())
    : 0;

  function formatClock(d: Date): string {
    return d.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
  }

  const uvLevel = data.current.uvIndex;
  const uvLabel = uvLevel < 3 ? "Low" : uvLevel < 6 ? "Moderate" : uvLevel < 8 ? "High" : uvLevel < 11 ? "Very High" : "Extreme";
  const uvColor = uvLevel < 3 ? "var(--cool)" : uvLevel < 6 ? "var(--accent)" : uvLevel < 8 ? "var(--warm)" : "#ef4444";

  return (
    <div className="card p-6 animate-fade-in flex flex-col gap-5">
      <h2 className="text-sm text-faint uppercase tracking-wide">Sun & UV</h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={isDay ? "var(--warm)" : "var(--cool)"} strokeWidth="1.5">
            {isDay ? (
              <>
                <circle cx="12" cy="12" r="5" fill="var(--warm)" fillOpacity="0.3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
              </>
            ) : (
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="var(--cool)" fillOpacity="0.2" />
            )}
          </svg>
          <div>
            <div className="text-xs text-faint">{isDay ? "Sunrise" : "Sunset"}</div>
            <div className="text-sm font-medium tabular">{formatClock(isDay ? sunrise : sunset)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-faint">{isDay ? "Sunset" : "Sunrise"}</div>
          <div className="text-sm font-medium tabular">{formatClock(isDay ? sunset : sunrise)}</div>
        </div>
      </div>

      {isDay && (
        <div className="relative h-1.5 bg-line rounded-full overflow-hidden">
          <div
            className="absolute h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(100, progress * 100)}%`,
              background: "linear-gradient(90deg, var(--warm), var(--accent))",
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-warm shadow"
            style={{ left: `calc(${Math.min(100, progress * 100)}% - 4px)` }}
          />
        </div>
      )}

      <div className="text-xs text-faint">
        Day length: {Math.floor(dayLength)}h {Math.round((dayLength % 1) * 60)}m
      </div>

      <div className="border-t border-line pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">UV Index</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${uvColor}22`, color: uvColor }}>
            {uvLabel}
          </span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold tabular" style={{ color: uvColor }}>
            <AnimatedNumber value={uvLevel} format={(n) => n.toFixed(1)} />
          </span>
          <span className="text-xs text-faint mb-1">/ 11+</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full overflow-hidden flex">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            const bandColors = ["#22c55e", "#22c55e", "#22c55e", "#eab308", "#eab308", "#eab308", "#f97316", "#f97316", "#ef4444", "#ef4444", "#a855f7"];
            return (
              <div
                key={i}
                className="flex-1"
                style={{
                  background: i <= uvLevel ? bandColors[i] : "var(--line)",
                  opacity: i <= uvLevel ? 1 : 0.4,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
