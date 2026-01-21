export default function SecondaryMetrics({ summary }) {
  const averageTicketValue = summary?.averageTicketValue ?? 0;
  const topWorkerName = summary?.topWorkerName;
  const topWorkerServiceCount = summary?.topWorkerServiceCount ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Average Ticket Value */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Ticket promedio
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${averageTicketValue.toFixed(0)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            De servicios completados
          </p>
        </div>
      </div>

      {/* Most Efficient Worker */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Más eficiente
          </span>
          {topWorkerName ? (
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {topWorkerName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {topWorkerServiceCount} servicio{topWorkerServiceCount !== 1 ? "s" : ""} completado{topWorkerServiceCount !== 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sin datos
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
