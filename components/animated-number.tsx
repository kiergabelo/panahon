import { useEffect, useRef, useState } from "react";

/**
 * AnimatedNumber — smoothly interpolates between numeric values using rAF.
 * Avoids value-snapping when data refreshes (every 10 min by default).
 */
export function AnimatedNumber({
  value,
  format = (n) => n.toFixed(0),
  duration = 600,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
}) {
  const [shown, setShown] = useState(value);
  const prevRef = useRef(value);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;
    startRef.current = null;
    cancelAnimationFrame(rafRef.current);

    const step = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min(1, (now - startRef.current) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (to - from) * eased;
      setShown(v);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else prevRef.current = to;
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <>{format(shown)}</>;
}
