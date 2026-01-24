import { useState } from "react";
import Badge from "../ui/Badge";
import { MileageIcon, CalendarIcon, EntryDateIcon } from "@/components/icons/ServicesIcons";
import EditServiceNotesModal from "../modals/EditServiceNotesModal";

const isValidValue = (v) => {
  if (v === null || v === undefined || v === "") return false;
  if (typeof v === "number" && isNaN(v)) return false;
  return true;
};

const fmt = (n) => {
  if (!isValidValue(n)) return null;
  return Number(n).toLocaleString("es-PA");
};

export default function ServiceCard({ service, onView, onMain, onNotesSaved }) {
  const pending = !service.exitDate;
  const [editNotesOpen, setEditNotesOpen] = useState(false);

  const formatDate = (ds) => {
    const date = new Date(ds);
    return new Intl.DateTimeFormat("es-PA", { day: "2-digit", month: "short", year: "numeric" })
      .format(date)
      .replace(".", "")
      .replace(/(\d{2}) (\w+) (\d{4})/, "$1 de $2 del $3");
  };

  // Build vehicle title
  const vehicleTitle = [service.brand, service.model, service.year]
    .filter(Boolean)
    .join(" ") || "Vehículo";

  return (
    <article className="relative mt-10 mb-5">
      {/* External tabs at top-left - positioned above the card */}
      <div className="absolute top-0 left-2 lg:left-3 -translate-y-full flex items-end gap-0.5 z-10">
        {/* State tab */}
        <div
          className={`px-3 py-1 rounded-t-md text-xs font-semibold ${
            pending
              ? "bg-amber-500 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {pending ? "Pendiente" : "Completado"}
        </div>

        {/* Time tab - only for completed services */}
        {!pending && isValidValue(service.haceCuantosDias) && (
          <div className="px-3 py-1 rounded-t-md text-xs font-medium bg-gray-300 text-gray-800">
            Hace: {service.haceCuantosDias}
          </div>
        )}
      </div>

      {/* Card container */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Clickable card surface */}
        <button
          onClick={onView}
          className="w-full text-left"
          aria-label={`Ver detalles de ${vehicleTitle}`}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 p-4 lg:p-5 space-y-3">
              {/* Header: Vehicle and Client on same line */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {vehicleTitle}
                </h3>
                <span className="text-sm text-gray-500">
                  Cliente:{" "}
                  <span className="font-medium text-gray-700">
                    {service.clientName || "Sin nombre"}
                  </span>
                </span>
              </div>

              {/* Identifiers row: Plate and VIN */}
              <div className="flex flex-wrap items-center gap-2.5">
                {isValidValue(service.plateNumber) && (
                  <Badge tone="slate" className="font-semibold text-sm">
                    {service.plateNumber}
                  </Badge>
                )}
                {isValidValue(service.vin) && (
                  <span className="text-xs text-gray-500 font-mono">
                    VIN: {service.vin}
                  </span>
                )}
              </div>

              {/* Technical mileage row - Kilometraje, Km esperado, and Recibido el on same line */}
              <div className="flex flex-wrap items-center my-5 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-1 flex-wrap">
                  {isValidValue(service.mileage) && (
                    <>
                      <span className="text-gray-400 w-4 h-4 shrink-0">
                        <MileageIcon />
                      </span>
                      <span className="text-gray-500">Kilometraje:</span>
                      <span className="font-medium text-gray-900">{fmt(service.mileage)} km</span>
                    </>
                  )}
                  {isValidValue(service.mileage) && isValidValue(service.nextServiceMileageTarget) && (
                    <span className="text-gray-400 mx-1">/</span>
                  )}
                  {isValidValue(service.nextServiceMileageTarget) && (
                    <>
                      <span className="text-gray-500">Esperado:</span>
                      <span className="font-medium text-gray-900">
                        {fmt(service.nextServiceMileageTarget)} km
                      </span>
                    </>
                  )}
                </div>
                {isValidValue(service.entryDate) && (
                  
                  <div className="text-gray-500 flex gap-1">
                    Recibido el:{" "}
                    <span className="font-medium text-gray-900">{formatDate(service.entryDate)}</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 pt-1"></div>

              {/* Closure row: Worker and Fecha de entrega on same line */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                {isValidValue(service.workerName) && (
                  <div className="text-gray-500">
                    {pending ? "Iniciado por" : "Completado por"}{" "}
                    <span className="font-medium text-gray-700">{service.workerName}</span>
                  </div>
                )}
                {!pending && isValidValue(service.exitDate) && (
                  <div className="text-gray-500">
                    Fecha de entrega:{" "}
                    <span className="font-medium text-gray-900">{formatDate(service.exitDate)}</span>
                  </div>
                )}
              </div>

              {/* Editar Notas button - only for pending services */}
              {pending && (
                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditNotesOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                  >
                    Editar Notas
                  </button>
                </div>
              )}

              {/* Resolution block: Notes (pending) or Cost (completed) */}
              {pending && isValidValue(service.mechanicNotes) && (
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 mt-3">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Notas
                  </div>
                  <p className="text-sm text-gray-900 leading-relaxed line-clamp-3">
                    {service.mechanicNotes}
                  </p>
                  {isValidValue(service.description) && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{service.description}</p>
                  )}
                </div>
              )}

              {!pending && isValidValue(service.cost) && (
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 mt-3">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                    Costo
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${fmt(service.cost)}
                  </div>
                </div>
              )}
            </div>

            {/* Right vertical strip - slim action/state reinforcement */}
            <div className="hidden lg:flex items-center justify-center border-l border-gray-200 w-12 shrink-0">
              {pending ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMain();
                  }}
                  className="h-full w-full flex items-center justify-center bg-amber-50 hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset"
                  aria-label="Completar servicio"
                >
                  <span
                    className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                  >
                    Completar
                  </span>
                </button>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-emerald-50">
                  <span
                    className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                  >
                    Completado
                  </span>
                </div>
              )}
            </div>
          </div>
        </button>

        {/* Mobile: Action element at bottom - full width */}
        <div className="lg:hidden border-t border-gray-200">
          {pending ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMain();
              }}
              className="w-full px-4 py-3 text-sm font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset"
              aria-label="Completar servicio"
            >
              Completar servicio
            </button>
          ) : (
            <div className="w-full px-4 py-2.5 text-sm font-medium text-center text-emerald-700 bg-emerald-50">
              Completado
            </div>
          )}
        </div>
      </div>

      {/* Edit Notes Modal */}
      <EditServiceNotesModal
        isOpen={editNotesOpen}
        onClose={() => setEditNotesOpen(false)}
        service={service}
        onSaved={() => {
          setEditNotesOpen(false);
          onNotesSaved?.();
        }}
      />
    </article>
  );
}
