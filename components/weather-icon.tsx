const ICONS: Record<string, React.ReactNode> = {
  sun: (
    <>
      <circle cx="32" cy="32" r="14" fill="var(--warm)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="32"
          y1="6"
          x2="32"
          y2="14"
          stroke="var(--warm)"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
    </>
  ),
  "sun-cloud": (
    <>
      <circle cx="24" cy="24" r="10" fill="var(--warm)" opacity="0.8" />
      <path d="M 22 42 Q 14 42 14 34 Q 14 28 20 28 Q 22 20 30 22 Q 36 22 36 30 Q 44 30 44 38 Q 44 42 38 42 Z"
        fill="var(--muted)" />
    </>
  ),
  cloud: (
    <path d="M 16 40 Q 10 40 10 32 Q 10 24 18 24 Q 20 16 30 18 Q 38 18 38 28 Q 50 28 50 36 Q 50 40 44 40 Z"
      fill="var(--faint)" />
  ),
  fog: (
    <>
      <path d="M 16 32 Q 10 32 10 24 Q 10 16 18 16 Q 20 10 30 12 Q 38 12 38 20 Q 50 20 50 28 Q 50 32 44 32 Z"
        fill="var(--faint)" />
      <line x1="14" y1="42" x2="40" y2="42" stroke="var(--faint)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="20" y1="50" x2="46" y2="50" stroke="var(--faint)" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
    </>
  ),
  drizzle: (
    <>
      <path d="M 16 34 Q 10 34 10 26 Q 10 18 18 18 Q 20 12 30 14 Q 38 14 38 22 Q 50 22 50 30 Q 50 34 44 34 Z"
        fill="var(--faint)" />
      <line x1="20" y1="42" x2="17" y2="50" stroke="var(--rain)" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="42" x2="27" y2="50" stroke="var(--rain)" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="42" x2="37" y2="50" stroke="var(--rain)" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  rain: (
    <>
      <path d="M 16 30 Q 10 30 10 22 Q 10 14 18 14 Q 20 8 30 10 Q 38 10 38 18 Q 50 18 50 26 Q 50 30 44 30 Z"
        fill="var(--rain)" opacity="0.6" />
      <line x1="18" y1="36" x2="14" y2="50" stroke="var(--rain)" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="36" x2="24" y2="50" stroke="var(--rain)" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="36" x2="34" y2="50" stroke="var(--rain)" strokeWidth="3" strokeLinecap="round" />
      <line x1="48" y1="36" x2="44" y2="50" stroke="var(--rain)" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  snow: (
    <>
      <path d="M 16 30 Q 10 30 10 22 Q 10 14 18 14 Q 20 8 30 10 Q 38 10 38 18 Q 50 18 50 26 Q 50 30 44 30 Z"
        fill="var(--faint)" />
      <circle cx="18" cy="46" r="3" fill="var(--cool)" />
      <circle cx="32" cy="46" r="3" fill="var(--cool)" />
      <circle cx="46" cy="46" r="3" fill="var(--cool)" />
    </>
  ),
  storm: (
    <>
      <path d="M 16 28 Q 10 28 10 20 Q 10 12 18 12 Q 20 6 30 8 Q 38 8 38 16 Q 50 16 50 24 Q 50 28 44 28 Z"
        fill="var(--warm)" opacity="0.8" />
      <path d="M 30 30 L 22 44 L 28 44 L 24 56 L 38 38 L 32 38 L 36 30 Z"
        fill="var(--warm)" />
    </>
  ),
};

export function WeatherIcon({ name, size = 64 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      {ICONS[name] ?? ICONS.cloud}
    </svg>
  );
}
