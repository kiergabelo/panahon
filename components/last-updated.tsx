export function LastUpdated({ time, isLoading }: { time: Date; isLoading: boolean }) {
  const ago = Math.floor((Date.now() - time.getTime()) / 1000);
  const agoStr = ago < 60 ? "just now" : ago < 3600 ? `${Math.floor(ago / 60)}m ago` : `${Math.floor(ago / 3600)}h ago`;

  return (
    <div className="flex items-center gap-2 text-xs text-faint">
      {isLoading ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>Refreshing…</span>
        </>
      ) : (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-faint" />
          <span>Updated {agoStr}</span>
        </>
      )}
    </div>
  );
}
