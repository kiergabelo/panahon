import type { WeatherData } from "@/lib/weather";
import { scale, formatTime } from "@/lib/utils";

export function PrecipChart({ data }: { data: WeatherData }) {
  const now = new Date();
  const hourly = data.hourly;

  const startIdx = hourly.time.findIndex((t) => {
    const d = new Date(t);
    return d >= now;
  });
  const idx = startIdx >= 0 ? startIdx : 0;
  const hours = 24;
  const probs = hourly.precipitationProb.slice(idx, idx + hours);
  const times = hourly.time.slice(idx, idx + hours);
  const amounts = hourly.precipitation.slice(idx, idx + hours);

  if (!probs.length) return null;

  const W = 800;
  const H = 180;
  const padL = 20;
  const padR = 20;
  const padT = 20;
  const padB = 25;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const gap = 2;
  const barW = (chartW / probs.length) - gap;

  const labelIdxs = [0, 6, 12, 18, 23].filter((i) => i < probs.length);

  return (
    <div className="card p-6 animate-fade-in">
      <h2 className="text-sm text-faint uppercase tracking-wide mb-2">Precipitation Probability</h2>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="24-hour precipitation probability">
        <defs>
          <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--rain)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--rain)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <line x1={padL} x2={W - padR} y1={padT + chartH} y2={padT + chartH}
          stroke="var(--line)" strokeWidth="1" />
        {probs.map((prob, i) => {
          const barH = scale(prob, 0, 100, 0, chartH);
          const x = padL + (i / probs.length) * chartW;
          const y = padT + (chartH - barH);
          const isRaining = amounts[i]! > 0;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx="2"
                fill={isRaining ? "url(#rainFill)" : "var(--rain)"}
                opacity={isRaining ? 1 : 0.35}
              />
            </g>
          );
        })}
        {labelIdxs.map((i) => {
          const x = padL + (i / probs.length) * chartW + barW / 2;
          return (
            <text key={i} x={x} y={H - 5} fill="var(--faint)" fontSize="11" textAnchor="middle">
              {i < times.length ? formatTime(times[i]!, { hourOnly: true }) : ""}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
