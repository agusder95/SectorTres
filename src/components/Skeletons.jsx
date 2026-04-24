// Skeleton genérico
export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-zinc-800 rounded ${className}`} />
  )
}

// Skeleton para RaceCard
export function RaceCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-16" />
            <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-full" />
            <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-2/3" />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-24" />
          <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

// Skeleton para Standings
export function StandingsSkeleton({ count = 10 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-1/3" />
            <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-1/4" />
          </div>
          <div className="h-6 bg-gray-100 dark:bg-zinc-800 rounded w-12" />
        </div>
      ))}
    </div>
  )
}