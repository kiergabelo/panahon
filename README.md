# Panahon — PH Weather Dashboard

Real-time Philippine weather dashboard with hand-rolled SVG charts. No chart
library, no API key.

**Live:** `panahon.kierabelo.com` — deployed on Cloudflare Pages (static export).

## Why this exists

Portfolio piece proving data-visualization depth — every chart is custom SVG
with bezier interpolation, gradient fills, and responsive scaling. No
Recharts, no Chart.js, no Tremor. Matches the hand-rolled SVG mockup aesthetic
of the main portfolio site.

## Tech Stack

Next.js 15.3 (App Router) · React 19 · TypeScript 5 (strict) ·
Tailwind CSS 4 · SWR 2 · Open-Meteo API

## Features

- **8 PH cities** — Cebu (default), Manila, Davao, CDO, Iloilo, Baguio, Bacolod, Gen. Santos
- **Current conditions** — temp, apparent temp, humidity, wind, precipitation, WMO weather code
- **24h temperature area chart** — custom SVG with smooth bezier curves, gradient fill, min/max markers
- **24h precipitation probability bars** — custom SVG with rain gradient, distinct bars for precipitation > 0mm
- **7-day forecast strip** — gradient temp-range bars (cool→warm), WMO weather icons, precip %
- **10-min auto-refresh** via SWR with error retry
- **Dark mode** only — matches the main portfolio's identity
- **Zero API key** — Open-Meteo is free, no auth, CORS-enabled

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck   # tsc --noEmit (must be clean)
npm run build       # production build (static)
```

## Project Structure

```
panahon/
├── app/
│   ├── globals.css           # Tailwind 4 + design tokens (dark mode)
│   ├── layout.tsx            # Root layout, Geist Sans + JetBrains Mono
│   └── page.tsx              # Dashboard page (SWR fetch + city selector)
├── components/
│   ├── current-conditions.tsx # Big temp panel + stats grid
│   ├── forecast-strip.tsx    # 7-day forecast with gradient temp-range bars
│   ├── temp-chart.tsx        # Custom SVG area chart (bezier + gradient fill)
│   ├── precip-chart.tsx      # Custom SVG bar chart
│   └── weather-icon.tsx      # WMO weather code → SVG icon
├── lib/
│   ├── cities.ts             # 8 PH cities with coordinates
│   ├── weather.ts            # Open-Meteo client + types + WMO code map
│   └── utils.ts              # SVG path builders, formatters, scale helpers
├── INTEGRATION.md            # Portfolio site integration guide
└── package.json
```

## Data Source

[Open-Meteo](https://open-meteo.com) — free non-commercial API, no API key
required, CORS-enabled. Provides current conditions, hourly forecasts, and
daily forecasts globally. Weather codes follow the WMO standard.

## License

MIT
