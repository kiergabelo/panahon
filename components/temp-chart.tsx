import type { WeatherData } from "@/lib/weather";
import { buildAreaPath, scale, formatTemp, formatTime, tempColor } from "@/lib/utils";

export function TempChart({ data }: { data: WeatherData }) {
  const now = new Date();
  const hourly = data.hourly;

  const startIdx = hourly.time.findIndex((t) => {
    const d = new Date(t);
    return d >= now;
  });
  const idx = startIdx >= 0 ? startIdx : 0;
  const hours = 24;
  const temps = hourly.temperature.slice(idx, idx + hours);
  const times = hourly.time.slice(idx, idx + hours);

  if (!temps.length) return null;

  const minT = Math.min(...temps) - 2;
  const maxT = Math.max(...temps) + 2;
  const W = 800;
  const H = 200;
  const padL = 20;
  const padR = 20;
  const padT = 30;
  const padB = 25;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const points = temps.map((t, i) => ({
    x: padL + (i / (temps.length - 1)) * chartW,
    y: padT + scale(t, minT, maxT, chartH, 0),
    val: t,
    time: times[i]!,
  }));

  const areaPath = buildAreaPath(points, W - padR, H - padB);
  const minPoint = points.reduce((a, b) => (b.val < a.val ? b : a));
  const maxPoint = points.reduce((a, b) => (b.val > a.val ? b : a));

  const labelIdxs = [0, 6, 12, 18, 23].filter((i) => i < points.length);

  return (
    <div className="card p-6 animate-fade-in">
      <h2 className="text-sm text-faint uppercase tracking-wide mb-2">24h Temperature</h2>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="24-hour temperature forecast">
        <defs>
          <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--warm)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--warm)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={padL}
            x2={W - padR}
            y1={padT + chartH * t}
            y2={padT + chartH * t}
            stroke="var(--line)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        ))}
        <path d={areaPath} fill="url(#tempFill)" />
        <path
          d={`M ${padL} ${minPoint.y} ${(points.map((p) => `L ${p.x} ${p.y}`)).join(" ")}`}
          fill="none"
          stroke="var(--warm)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={maxPoint.x} cy={maxPoint.y} r="4" fill="var(--warm)" />
        <text x={maxPoint.x} y={maxPoint.y - 10} fill="var(--warm)" fontSize="12" textAnchor="middle" className="tabular">
          {formatTemp(maxPoint.val)}
        </text>
        <circle cx={minPoint.x} cy={minPoint.y} r="4" fill="var(--cool)" />
        <text x={minPoint.x} y={minPoint.y + 20} fill="var(--cool)" fontSize="12" textAnchor="middle" className="tabular">
          {formatTemp(minPoint.val)}
        </text>
        {labelIdxs.map((i) => {
          const p = points[i]!;
          return (
            <text key={i} x={p.x} y={H - 5} fill="var(--faint)" fontSize="11" textAnchor="middle">
              {formatTime(p.time, { hourOnly: true })}
            </text>
          );
        })}
        {/* "Now" vertical line */}
        <line
          x1={padL} x2={padL}
          y1={padT} y2={padT + chartH}
          stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"
        />
        <text x={padL + 4} y={padT + 12} fill="var(--accent)" fontSize="9" textAnchor="start" opacity="0.7">NOW</text>
      </svg>
    </div>
  );
}
