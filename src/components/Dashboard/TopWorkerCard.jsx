import { StarIcon } from "@/components/icons/DashboardIcons";

export default function TopWorkerCard({ topWorkerName, topWorkerServiceCount }) {
  if (!topWorkerName || topWorkerServiceCount === 0) {
    return (
      <div className="relative overflow-hidden rounded-[20px] border-2 border-zinc-300 dark:border-zinc-700 p-6 bg-white dark:bg-zinc-900 hand-drawn-card">
        <h3 className="relative z-10 text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
          Trabajador más eficiente
        </h3>
        <div className="text-center py-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Sin datos en este rango</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[20px] border-2 border-zinc-300 dark:border-zinc-700 p-6 bg-white dark:bg-zinc-900 hand-drawn-card">
      {/* Decorative star illustration in bottom-right corner */}
      <div className="absolute -bottom-6 -right-6 pointer-events-none opacity-[0.08] dark:opacity-[0.06] sm:-bottom-4 sm:-right-4">
        <StarIcon className="w-24 h-24 sm:w-20 sm:h-20 text-violet-500" />
      </div>

      {/* Content with higher z-index */}
      <div className="relative z-10">
        <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide">
          Trabajador más eficiente
        </h3>

        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900 dark:text-white truncate leading-tight">
            {topWorkerName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-normal">
            {topWorkerServiceCount} {topWorkerServiceCount === 1 ? "servicio completado" : "servicios completados"}
          </div>
        </div>
      </div>
    </div>
  );
}
