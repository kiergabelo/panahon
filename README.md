# Panahon — PH Weather Dashboard

A real-time Philippine weather dashboard with hand-rolled SVG charts. Powered
by the free Open-Meteo API — no API key, no auth, CORS-enabled. Every chart is
custom SVG with bezier interpolation, gradient fills, and responsive scaling.

**Cebuano:** *panahon* = weather.

**Live:** `panahon.kierabelo.com` — Cloudflare Pages static export.

## Features

- **8 PH cities** — Cebu (default), Manila, Davao, CDO, Iloilo, Baguio, Bacolod, Gen. Santos
- **Current conditions** — temp, apparent temp, humidity, precipitation, WMO weather code
- **Wind compass + gusts** — SVG dial with an animated needle pointing downwind, gust readout
- **Hourly forecast strip** — next 12 hours with temp bars and live hover detail
- **24h temperature area chart** — custom SVG bezier curve, gradient fill, min/max markers, crosshair hover tooltip
- **24h precipitation chart** — probability bars with an animated canvas rain overlay when rain is likely
- **7-day forecast** — click-to-expand detail rows with hourly temp bars, sunrise/sunset, wind, and rain totals
- **Hourly temp bars per day** — expanded daily rows render an SVG bar chart of the day's hours
- **UV index** — color bands (green→violet) with Low/Moderate/High/Very High/Extreme labels
- **Sunrise/sunset tracker** — day-progress bar that advances with the sun
- **Pressure trend** — rising/steady/falling indicator with hPa readout
- **Cloud cover** — percentage gauge
- **Animated number transitions** — rAF-interpolated stats that respect `prefers-reduced-motion`
- **Loading skeleton** — layout-matching placeholders
- **Error retry** — graceful failure card with a retry button (cached data shown if available)
- **Geolocation auto-detect** — prompts once for the nearest city on load
- **PWA manifest** — installable, standalone display
- **Accessibility** — skip link, focus-visible outlines, `prefers-reduced-motion`

## Stack

Next.js 15.3 (App Router, static export) · React 19 · TypeScript 5 (strict) ·
Tailwind CSS 4 · SWR 2 · Open-Meteo API · Geist Sans + JetBrains Mono via `next/font`

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck   # tsc --noEmit (must be clean)
npm run build       # production build -> out/
```

## Deploy

Cloudflare Pages (static export):

- **Framework preset:** None
- **Build command:** `npm run build`
- **Output directory:** `out`
- **Domain:** `panahon.kierabelo.com`

No server-side component — all API calls run client-side to Open-Meteo
(CORS-enabled). `next.config.ts` uses `output: "export"` to produce a fully
static `out/` folder.

## Project structure

```
panahon/
├── app/
│   ├── globals.css            # Tailwind 4 + design tokens, skip link, focus-visible, reduced-motion
│   ├── layout.tsx             # Root layout, Geist Sans + JetBrains Mono, metadata, manifest, viewport
│   └── page.tsx               # Dashboard (SWR fetch, city selector, geolocation auto-detect, switch animation)
├── components/
│   ├── animated-number.tsx    # rAF number transitions (respects reduced-motion)
│   ├── current-conditions.tsx # Big temp panel + stats grid (feels like, humidity, precip, wind + gusts)
│   ├── error-state.tsx        # Error card with retry button
│   ├── forecast-strip.tsx     # 7-day forecast, click-to-expand rows with hourly temp bars + day chips
│   ├── hourly-forecast.tsx    # Next-12-hours strip with temp bars + hover detail
│   ├── last-updated.tsx       # "Updated Xm ago" / "Refreshing…" indicator
│   ├── loading-skeleton.tsx   # Skeleton placeholders matching dashboard layout
│   ├── precip-chart.tsx       # 24h precipitation bars + animated canvas rain overlay + hover tooltip
│   ├── pressure-card.tsx     # Pressure trend + cloud cover gauge
│   ├── sun-times-card.tsx     # Sunrise/sunset + day-progress bar + UV index with color bands
│   ├── temp-chart.tsx         # 24h temperature area chart (bezier + gradient) + hover tooltip
│   ├── weather-icon.tsx       # WMO weather code → hand-rolled SVG icon
│   └── wind-compass.tsx       # SVG dial with animated needle pointing downwind
├── lib/
│   ├── cities.ts              # 8 PH cities with coordinates (Cebu default)
│   ├── weather.ts             # Open-Meteo client + types + WMO code map
│   └── utils.ts               # SVG bezier path builders, formatters, scale + tempColor helpers
├── public/
│   ├── icon.svg               # SVG favicon
│   └── manifest.webmanifest   # PWA manifest
└── package.json
```

## Keyboard shortcuts

None currently. The dashboard auto-detects the nearest city via geolocation on
first load (prompts once; denial keeps the Cebu default).

## License

MIT. Built by Kier Abelo.
