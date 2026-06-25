export function formatTime(iso: string, opts?: { hourOnly?: boolean }): string {
  const d = new Date(iso);
  if (opts?.hourOnly) {
    return d.toLocaleTimeString("en-PH", { hour: "numeric" });
  }
  return d.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", { weekday: "short" });
}

export function formatDayShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", { weekday: "narrow" });
}

export function windDir(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8]!;
}

export function buildAreaPath(
  points: { x: number; y: number }[],
  width: number,
  height: number,
): string {
  if (points.length === 0) return "";
  const first = points[0]!;
  let d = `M ${first.x} ${height} L ${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i]!;
    const prev = points[i - 1]!;
    const cx = (prev.x + p.x) / 2;
    d += ` C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }
  const last = points[points.length - 1]!;
  d += ` L ${last.x} ${height} Z`;
  return d;
}

export function buildLinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  const first = points[0]!;
  let d = `M ${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i]!;
    const prev = points[i - 1]!;
    const cx = (prev.x + p.x) / 2;
    d += ` C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }
  return d;
}

export function scale(
  val: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
): number {
  if (fromMax === fromMin) return (toMin + toMax) / 2;
  return toMin + ((val - fromMin) / (fromMax - fromMin)) * (toMax - toMin);
}

export function tempColor(temp: number): string {
  if (temp >= 32) return "var(--warm)";
  if (temp <= 22) return "var(--cool)";
  return "var(--accent)";
}

export function formatTemp(t: number): string {
  return `${Math.round(t)}°`;
}

export function formatMs(ms: number): string {
  return `${Math.round(ms)} m/s`;
}
