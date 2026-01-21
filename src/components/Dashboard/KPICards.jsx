export default function KPICards({ summary }) {
  const kpis = [
    {
      label: "Pendientes",
      value: summary?.pendingCount ?? 0,
      color: "amber",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      label: "En proceso",
      value: summary?.inProgressCount ?? 0,
      color: "blue",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      label: "Atrasados",
      value: summary?.overdueCount ?? 0,
      color: "red",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-400",
      borderColor: "border-red-200 dark:border-red-800",
    },
    {
      label: "Ingresos",
      value: (summary?.totalRevenue ?? 0).toLocaleString("es-PA", {
        style: "currency",
        currency: "USD",
      }),
      color: "emerald",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-700 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className={`rounded-xl border ${kpi.borderColor} ${kpi.bgColor} p-4`}
        >
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              {kpi.label}
            </span>
            <span className={`text-3xl font-bold ${kpi.textColor}`}>
              {kpi.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
