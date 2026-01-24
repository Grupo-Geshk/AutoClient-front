import { useState } from "react";
import Chip from "../ui/Chip";

export default function ServicesFiltersPanel({
  isOpen,
  onClose,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  period,
  setPeriod,
  onApply,
}) {
  const [localStatus, setLocalStatus] = useState(statusFilter);
  const [localSort, setLocalSort] = useState(sortBy);
  const [localPeriod, setLocalPeriod] = useState(period);

  if (!isOpen) return null;

  const handleApply = () => {
    setStatusFilter(localStatus);
    setSortBy(localSort);
    setPeriod(localPeriod);
    if (onApply) onApply();
    onClose();
  };

  const handleReset = () => {
    setLocalStatus("");
    setLocalSort("recent");
    setLocalPeriod("all");
  };

  const activeFiltersCount = [
    statusFilter !== "",
    sortBy !== "recent",
    period !== "all",
  ].filter(Boolean).length;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Filtros y Ordenamiento
            </h2>
            {activeFiltersCount > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? "s" : ""} activo{activeFiltersCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar filtros"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Estado
            </label>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={localStatus === ""}
                onClick={() => setLocalStatus("")}
              >
                Todos
              </Chip>
              <Chip
                active={localStatus === "pending"}
                onClick={() => setLocalStatus("pending")}
              >
                Pendientes
              </Chip>
              <Chip
                active={localStatus === "completed"}
                onClick={() => setLocalStatus("completed")}
              >
                Completados
              </Chip>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label
              htmlFor="sort-select"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Ordenar por
            </label>
            <select
              id="sort-select"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              value={localSort}
              onChange={(e) => setLocalSort(e.target.value)}
            >
              <option value="recent">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="mileage">Kilometraje (mayor a menor)</option>
              <option value="cost">Costo (mayor a menor)</option>
            </select>
          </div>

          {/* Time Range */}
          <div>
            <label
              htmlFor="period-select"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Rango de tiempo
            </label>
            <select
              id="period-select"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              value={localPeriod}
              onChange={(e) => setLocalPeriod(e.target.value)}
            >
              <option value="all">Todo el tiempo</option>
              <option value="thisWeek">Esta semana</option>
              <option value="lastWeek">Semana pasada</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Restablecer
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </>
  );
}
