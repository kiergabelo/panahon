"use client";

import { useEffect, useRef, useState } from "react";
import type { WeatherData } from "@/lib/weather";
import { scale, formatTime } from "@/lib/utils";

export function PrecipChart({ data }: { data: WeatherData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const now = new Date();
  const hourly = data.hourly;
  const startIdx = hourly.time.findIndex((t) => new Date(t) >= now);
  const idx = startIdx >= 0 ? startIdx : 0;
  const hours = 24;
  const probs = hourly.precipitationProb.slice(idx, idx + hours);
  const times = hourly.time.slice(idx, idx + hours);
  const amounts = hourly.precipitation.slice(idx, idx + hours);

  if (!probs.length) return null;

  // Animated rain overlay — only when forecast shows non-trivial precipitation
  // in the next 6 hours. Drops fall within the chart area.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Decide if we should draw rain: peak probability > 30% in next 6h.
    const peakProb = Math.max(...probs.slice(0, 6));
    if (peakProb < 30) return;

    const W = canvas.width;
    const H = canvas.height;
    const dropCount = Math.floor(peakProb * 0.6);
    const drops = Array.from({ length: dropCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      v: 80 + Math.random() * 80,                     // px/s
      len: 6 + Math.random() * 10,
      alpha: 0.2 + Math.random() * 0.4,
    }));

    let last = performance.now();
    let raf = 0;
    const draw = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(129, 140, 248, 0.6)";
      ctx.lineWidth = 1;
      for (const d of drops) {
        d.y += d.v * dt;
        d.x -= d.v * dt * 0.15; // slight slant
        if (d.y > H) { d.y = -d.len; d.x = Math.random() * W; }
        if (d.x < 0) d.x = W;
        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * 0.15, d.y + d.len);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [probs]);

  // SVG chart stays the same — probs as bars.
  const W = 800;
  const H = 180;
  const padL = 20, padR = 20, padT = 20, padB = 25;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const slot = chartW / probs.length;
  const barW = slot - 2;
  const labelIdxs = [0, 6, 12, 18, 23].filter((i) => i < probs.length);

  const handleMove = (e: React.MouseEvent<SVGRectElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg || probs.length === 0) return;
    const r = svg.getBoundingClientRect();
    const vbX = ((e.clientX - r.left) / r.width) * W;
    const raw = Math.floor((vbX - padL) / slot);
    setHover(Math.max(0, Math.min(probs.length - 1, raw)));
  };

  return (
    <div className="card p-6 animate-fade-in relative overflow-hidden">
      <h2 className="text-sm text-faint uppercase tracking-wide mb-2">Precipitation Probability</h2>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="24-hour precipitation probability">
          <defs>
            <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--rain)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="var(--rain)" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <line x1={padL} x2={W - padR} y1={padT + chartH} y2={padT + chartH}
            stroke="var(--line)" strokeWidth="1" />
          {probs.map((prob, i) => {
            const barH = scale(prob, 0, 100, 0, chartH);
            const x = padL + i * slot;
            const y = padT + (chartH - barH);
            const isRaining = amounts[i]! > 0;
            return (
              <rect key={i} x={x} y={y} width={barW} height={barH} rx="2"
                fill={isRaining ? "url(#rainFill)" : "var(--rain)"}
                opacity={isRaining ? 1 : 0.4} />
            );
          })}
          {labelIdxs.map((i) => {
            const x = padL + i * slot + barW / 2;
            return (
              <text key={i} x={x} y={H - 5} fill="var(--faint)" fontSize="11" textAnchor="middle">
                {i < times.length ? formatTime(times[i]!, { hourOnly: true }) : ""}
              </text>
            );
          })}
          <line
            x1={padL} x2={padL}
            y1={padT} y2={padT + chartH}
            stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"
          />

          <rect
            x={padL}
            y={0}
            width={chartW}
            height={H}
            fill="transparent"
            style={{ cursor: "crosshair", pointerEvents: "all" }}
            onMouseMove={handleMove}
            onMouseLeave={() => setHover(null)}
          />
          {hover !== null && (() => {
            const prob = probs[hover]!;
            const mm = amounts[hover]!;
            const time = times[hover]!;
            const cx = padL + hover * slot + barW / 2;
            const flip = cx > W - 110;
            const boxW = 116;
            const boxH = mm > 0 ? 54 : 38;
            const offset = flip ? -boxW - 8 : 8;
            const by = padT + 4;
            return (
              <g className="chart-tooltip" pointerEvents="none" transform={`translate(${cx} 0)`}>
                <line x1={0} x2={0} y1={padT} y2={padT + chartH} stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
                <g transform={`translate(${offset} ${by})`}>
                  <rect width={boxW} height={boxH} rx="6" fill="var(--panel)" stroke="var(--line)" />
                  <text x={10} y={18} fill="var(--faint)" fontSize="10" className="tabular">
                    {formatTime(time, { hourOnly: true })}
                  </text>
                  <text x={10} y={34} fill="var(--rain)" fontSize="15" fontWeight="600" className="tabular">
                    {prob}% rain
                  </text>
                  {mm > 0 && (
                    <text x={10} y={48} fill="var(--muted)" fontSize="10" className="tabular">
                      {mm.toFixed(1)} mm
                    </text>
                  )}
                </g>
              </g>
            );
          })()}
        </svg>
        <canvas
          ref={canvasRef}
          width={W * 2}
          height={H * 2}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", transform: "scale(0.5)", transformOrigin: "top left" }}
        />
      </div>
    </div>
  );
}
