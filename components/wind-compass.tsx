/**
 * WindCompass — a small SVG dial that rotates the needle to point toward
 * the wind direction (where the wind is blowing TO, meteorological convention).
 */
export function WindCompass({ directionDeg, size = 56 }: { directionDeg: number; size?: number }) {
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const needleLen = r - 6;
  // Meteorological: wind_direction is "FROM where it's blowing".
  // Rotate needle so its head points away from the source (downwind).
  const angleRad = ((directionDeg + 180) * Math.PI) / 180;
  const tipX = cx + Math.sin(angleRad) * needleLen;
  const tipY = cy - Math.cos(angleRad) * needleLen;
  const tailX = cx - Math.sin(angleRad) * needleLen * 0.4;
  const tailY = cy + Math.cos(angleRad) * needleLen * 0.4;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Wind direction: ${Math.round(directionDeg)}°`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth="1" />
      {/* N marker */}
      <text x={cx} y={9} fill="var(--faint)" fontSize="7" textAnchor="middle" fontFamily="monospace">N</text>
      <text x={cx} y={size - 3} fill="var(--faint)" fontSize="7" textAnchor="middle" fontFamily="monospace">S</text>
      <text x={6} y={cy + 2} fill="var(--faint)" fontSize="7" textAnchor="middle" fontFamily="monospace">W</text>
      <text x={size - 6} y={cy + 2} fill="var(--faint)" fontSize="7" textAnchor="middle" fontFamily="monospace">E</text>
      {/* Needle — animated rotation via CSS transform */}
      <g style={{ transformOrigin: `${cx}px ${cy}px`, transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <line x1={tailX} y1={tailY} x2={tipX} y2={tipY} stroke="var(--cool)" strokeWidth="2" strokeLinecap="round" />
        <circle cx={tailX} cy={tailY} r="1.5" fill="var(--cool)" opacity="0.5" />
        <circle cx={tipX} cy={tipY} r="2" fill="var(--cool)" />
      </g>
      <circle cx={cx} cy={cy} r="1.5" fill="var(--muted)" />
    </svg>
  );
}
