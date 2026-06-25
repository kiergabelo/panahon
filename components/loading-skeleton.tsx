export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-[72px] h-[72px] rounded-full bg-panel animate-pulse-slow" />
          <div className="flex flex-col gap-2">
            <div className="h-12 w-28 bg-panel rounded animate-pulse-slow" />
            <div className="h-4 w-36 bg-panel rounded animate-pulse-slow" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full sm:w-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="h-3 w-16 bg-panel rounded animate-pulse-slow" />
              <div className="h-6 w-20 bg-panel rounded animate-pulse-slow" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card p-6 h-[180px] flex items-center justify-center">
            <div className="h-full w-full bg-panel rounded animate-pulse-slow" />
          </div>
        ))}
      </div>
      <div className="card p-6 h-[340px]">
        <div className="h-4 w-32 bg-panel rounded mb-4 animate-pulse-slow" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="h-4 w-10 bg-panel rounded animate-pulse-slow" />
            <div className="w-8 h-8 bg-panel rounded animate-pulse-slow" />
            <div className="h-4 w-8 bg-panel rounded animate-pulse-slow" />
            <div className="flex-1 h-1.5 bg-panel rounded-full animate-pulse-slow" />
            <div className="h-4 w-8 bg-panel rounded animate-pulse-slow" />
          </div>
        ))}
      </div>
    </div>
  );
}
