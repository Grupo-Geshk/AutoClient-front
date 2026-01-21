export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Primary Summary Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8"
          >
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Metrics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
          >
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Visualization & Operational Data Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Distribution Skeleton */}
        <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Next Actions Skeleton */}
        <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 dark:border-zinc-700 p-4"
              >
                <div className="flex justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
