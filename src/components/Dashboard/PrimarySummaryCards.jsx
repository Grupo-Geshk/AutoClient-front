export default function PrimarySummaryCards({ summary, workloadPercentage }) {
  const totalRevenue = summary?.totalRevenue ?? 0;
  const pendingCount = summary?.pendingCount ?? 0;
  const completedCount = summary?.completedCount ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Card - Primary */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white dark:from-emerald-950/20 dark:via-emerald-950/10 dark:to-zinc-900 p-8 shadow-sm">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Ingresos totales
          </h3>
          <div className="text-5xl font-bold text-emerald-700 dark:text-emerald-400">
            {totalRevenue.toLocaleString("es-PA", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
            })}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            En el período seleccionado
          </p>
        </div>
      </div>

      {/* Operational Load Card - Primary */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gradient-to-br from-blue-50 via-blue-50/50 to-white dark:from-blue-950/20 dark:via-blue-950/10 dark:to-zinc-900 p-8 shadow-sm">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Carga operativa
          </h3>
          <div className="flex items-baseline gap-4">
            <div className="text-5xl font-bold text-blue-700 dark:text-blue-400">
              {workloadPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{completedCount} completado{completedCount !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>{pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Porcentaje de servicios completados
          </p>
        </div>
      </div>
    </div>
  );
}
