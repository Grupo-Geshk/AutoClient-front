import { useNavigate } from "react-router-dom";
import { UserPlus, Car, FileText } from "lucide-react";

export default function NextActionsCard({ nextActions }) {
  const navigate = useNavigate();

  if (!nextActions || nextActions.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Acciones rápidas
        </h3>
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/clients")}
              className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-150"
            >
              <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Añadir Cliente
              </span>
            </button>

            <button
              onClick={() => navigate("/cars")}
              className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-150"
            >
              <Car className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Añadir Vehículo
              </span>
            </button>
          </div>

          {/* Secondary Action - Invoices */}
          <button
            onClick={() => navigate("/invoices")}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 transition-all duration-150"
          >
            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ver Facturas
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Acciones inmediatas
        </h3>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
          {nextActions.length} {nextActions.length === 1 ? "servicio" : "servicios"}
        </span>
      </div>

      <div className="space-y-2">
        {nextActions.map((action) => (
          <button
            key={action.serviceId}
            onClick={() => navigate(`/services`)}
            className="w-full text-left px-4 py-3.5 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 hover:shadow-sm transition-all duration-150"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {action.plateNumber}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {action.clientName}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {action.serviceName}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    action.status === "En progreso"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}
                >
                  {action.status}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Hace {action.daysOpen} {action.daysOpen === 1 ? "día" : "días"}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
