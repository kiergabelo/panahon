export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="card p-12 text-center animate-fade-in flex flex-col items-center gap-4">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="1.5">
        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <div className="text-lg font-medium text-fg">Failed to load weather data</div>
        <div className="text-sm text-muted mt-1">Check your connection and try again.</div>
      </div>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 bg-accent text-onaccent rounded-lg text-sm font-medium cursor-pointer hover:brightness-110 transition-all"
      >
        Retry
      </button>
    </div>
  );
}
