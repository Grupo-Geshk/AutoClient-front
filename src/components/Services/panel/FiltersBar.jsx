import Chip from "../ui/Chip";

export default function FiltersBar({
  statusFilter, setStatusFilter,
  search, setSearch,
  sortBy, setSortBy,
  period, setPeriod,
  onExport,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
      {/* Chips de estado */}
      <div className="flex flex-wrap items-center gap-2">
        <Chip active={statusFilter === ""} onClick={() => setStatusFilter("")}>Todos</Chip>
        <Chip active={statusFilter === "pending"} onClick={() => setStatusFilter("pending")}>Pendientes</Chip>
        <Chip active={statusFilter === "completed"} onClick={() => setStatusFilter("completed")}>Completados</Chip>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar por placa, cliente o teléfono…"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar servicio"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              aria-label="Limpiar búsqueda"
              title="Limpiar"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Orden + Periodo + Export */}
      <div className="flex items-center gap-2">
        <select
          className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Ordenar por"
        >
          <option value="recent">Recientes</option>
          <option value="oldest">Antiguos</option>
          <option value="mileage">Kilometraje</option>
          <option value="cost">Costo</option>
        </select>

        <select
          className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          aria-label="Periodo"
        >
          <option value="all">Todos</option>
          <option value="thisWeek">Esta semana</option>
          <option value="lastWeek">Semana pasada</option>
        </select>

        <button
          onClick={onExport}
          className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
          aria-label="Exportar a Excel"
          title="Exportar a Excel"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M12 3v10.59l3.3-3.3 1.4 1.42L12 17.41l-4.7-4.7 1.4-1.42 3.3 3.3V3h2zM5 19h14v2H5z" />
          </svg>
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>
    </div>
  );
}
