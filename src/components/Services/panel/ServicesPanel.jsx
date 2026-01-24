import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getAllServices } from "@/api/services";

import ServiceCard from "./ServiceCard";
import Pagination from "./Pagination";
import ServicesFiltersPanel from "../filters/ServicesFiltersPanel";

import CompleteServiceModal from "../modals/CompleteServiceModal";
import EditServiceNotesModal from "../modals/EditServiceNotesModal";
import ViewServiceModal from "../modals/ViewServiceModal";

const none = (v) => (v === null || v === undefined || v === "" ? "—" : v);
const fmt = (n) =>
  n === null || n === undefined || n === ""
    ? "—"
    : Number(n).toLocaleString("es-PA");

const startOfWeek = (d) => {
  const date = new Date(d);
  const day = date.getDay(); // 0=Dom
  const diff = day === 0 ? 6 : day - 1; // semana inicia Lunes
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
};
const endOfWeek = (d) => {
  const s = startOfWeek(d);
  const e = new Date(s);
  e.setDate(s.getDate() + 7);
  return e;
};

export default function ServicesPanel() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState(""); // "", "pending", "completed"
  const [period, setPeriod] = useState("all"); // "all", "thisWeek", "lastWeek"
  const [sortBy, setSortBy] = useState("recent"); // "recent","oldest","mileage","cost"

  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  const [isCompleteOpen, setCompleteOpen] = useState(false);
  const [isNotesOpen, setNotesOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isFiltersOpen, setFiltersOpen] = useState(false);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setServices((await getAllServices()) || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isPending = (s) => !s.exitDate;

  const inPeriod = (s) => {
    if (period === "all") return true;
    const now = new Date();
    const thisStart = startOfWeek(now);
    const thisEnd = endOfWeek(now);
    const lastStart = new Date(thisStart);
    lastStart.setDate(thisStart.getDate() - 7);
    const lastEnd = new Date(thisStart);
    const ref = s.exitDate ? new Date(s.exitDate) : new Date(s.entryDate);
    if (period === "thisWeek") return ref >= thisStart && ref < thisEnd;
    if (period === "lastWeek") return ref >= lastStart && ref < lastEnd;
    return true;
  };

  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = (services || []).filter((s) => {
      const matchesStatus =
        statusFilter === ""
          ? true
          : statusFilter === "completed"
          ? !isPending(s)
          : isPending(s);
      const haystack = [
        s.plateNumber || "",
        s.clientName || "",
        s.clientPhone || s.phone || "",
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = q ? haystack.includes(q) : true;
      return matchesStatus && matchesSearch && inPeriod(s);
    });

    list.sort((a, b) => {
      if (sortBy === "recent")
        return new Date(b.entryDate) - new Date(a.entryDate);
      if (sortBy === "oldest")
        return new Date(a.entryDate) - new Date(b.entryDate);
      if (sortBy === "mileage")
        return (Number(b.mileage) || 0) - (Number(a.mileage) || 0);
      if (sortBy === "cost")
        return (Number(b.cost) || 0) - (Number(a.cost) || 0);
      return 0;
    });

    setPage(1);
    return list;
  }, [services, statusFilter, search, period, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / PAGE_SIZE)
  );
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredServices.slice(start, start + PAGE_SIZE);
  }, [filteredServices, page]);

  function handleMainAction(s) {
    setSelectedService(s);
    if (isPending(s)) setCompleteOpen(true);
    else setNotesOpen(true);
  }

  function handleExport() {
    const data = filteredServices.map((s) => ({
      Placa: s.plateNumber,
      Cliente: s.clientName,
      Telefono: s.clientPhone || "",
      Entrada: s.entryDate,
      Salida: s.exitDate || "Pendiente",
      Estado: s.exitDate ? "Completado" : "Pendiente",
      Kilometraje: `${fmt(s.mileage)} km`,
      "Km objetivo": fmt(s.nextServiceMileageTarget),
      "Días desde cierre": s.exitDate ? none(s.haceCuantosDias) : "—",
      Costo: s.exitDate ? Number(s.cost || 0) : "",
      Trabajador: s.workerName || "",
      "Tipo de servicio": s.serviceType || "",
      Descripcion: s.description || "",
      "Notas mecánico": s.mechanicNotes || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Servicios");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "servicios.xlsx");
  }

  const activeFiltersCount = [
    statusFilter !== "",
    sortBy !== "recent",
    period !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Search Bar with Export */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input with Filter Icon */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre, placa o teléfono…"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-12 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar servicios"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpiar búsqueda"
              title="Limpiar"
            >
              <svg
                className="w-4 h-4"
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
          )}
          <button
            onClick={() => setFiltersOpen(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Abrir filtros"
            title="Filtros y ordenamiento"
          >
            <div className="relative">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          aria-label="Exportar a Excel"
          title="Exportar resultados actuales a Excel"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M12 3v10.59l3.3-3.3 1.4 1.42L12 17.41l-4.7-4.7 1.4-1.42 3.3 3.3V3h2zM5 19h14v2H5z" />
          </svg>
          <span>Exportar</span>
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-3">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Array.from({ length: 5 }).map((__, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-200 animate-pulse rounded"
                  />
                ))}
              </div>
            </div>
          ))}

        {!loading &&
          paginated.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              onView={() => {
                setSelectedService(s);
                setViewOpen(true);
              }}
              onMain={() => handleMainAction(s)}
            />
          ))}

        {!loading && filteredServices.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No se encontraron servicios. Prueba buscar por <b>placa</b>,{" "}
            <b>cliente</b> o <b>teléfono</b>.
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPage={setPage} />

      {/* Filters Panel */}
      <ServicesFiltersPanel
        isOpen={isFiltersOpen}
        onClose={() => setFiltersOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        period={period}
        setPeriod={setPeriod}
      />

      {/* Modales */}
      <CompleteServiceModal
        open={isCompleteOpen}
        service={selectedService}
        onClose={() => {
          setCompleteOpen(false);
          setSelectedService(null);
        }}
        onDone={async () => setServices((await getAllServices()) || [])}
      />
      <EditServiceNotesModal
        isOpen={isNotesOpen}
        onClose={() => {
          setNotesOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
        onSaved={async () => setServices((await getAllServices()) || [])}
      />
      <ViewServiceModal
        open={isViewOpen}
        service={selectedService}
        onClose={() => {
          setViewOpen(false);
          setSelectedService(null);
        }}
        onSaved={async () => {
          try {
            setServices((await getAllServices()) || []);
          } catch {}
        }}
        onRequestComplete={(svc) => {
          setViewOpen(false);
          setSelectedService(svc || selectedService);
          setCompleteOpen(true); // <- abre la modal de completar
        }}
      />
    </div>
  );
}
