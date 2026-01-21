import { useEffect, useState } from "react";
import { getHistoryByVehicle } from "@/api/services";
import AddServiceModal from "../Services/modals/AddServiceModal";
import EditVehicleModal from "./EditVehicleModal";
import { EditIcon } from "@/components/icons/VehicleIcons";
import EditServiceNotesModal from "../Services/modals/EditServiceNotesModal";
import CompleteServiceModal from "../Services/modals/CompleteServiceModal";

export default function VehicleModal({ isOpen, onClose, vehicle }) {
  const [vehicleInfo, setVehicleInfo] = useState(vehicle);
  const [history, setHistory] = useState([]);
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    setVehicleInfo(vehicle);
    if (vehicle?.id && isOpen) {
      getHistoryByVehicle(vehicle.id).then((res) => setHistory(res.data || []));
    }
  }, [vehicle, isOpen]);

  if (!isOpen || !vehicle) return null;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("es-PA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const refreshHistory = () => {
    if (vehicle?.id) {
      getHistoryByVehicle(vehicle.id).then((res) => setHistory(res.data || []));
    }
  };
  const anyChildOpen =
  serviceFormOpen || editModalOpen || notesModalOpen || completeModalOpen;

  return (
    <div
    role="dialog"
    aria-modal="true"
    className={`fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 ${
      anyChildOpen ? "" : "pointer-events-none"
    }`}
  >
      {/* Panel */}
      <div className="relative z-[71] bg-white w-full max-w-6xl rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden max-h-[92vh] flex flex-col pointer-events-auto">
       {/* Header */}
        <div className="px-6 py-4 border-b bg-white/95 backdrop-blur flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-xl font-bold truncate">
              Detalles del Vehículo
            </h2>
            <button
              onClick={() => setEditModalOpen(true)}
              className="text-gray-600 hover:text-gray-800"
              title="Editar vehículo"
            >
              <EditIcon />
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-2xl leading-none px-2 rounded hover:bg-gray-100"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del vehículo */}
            <section className="space-y-4">
              <div className="rounded-2xl border border-gray-200 shadow-sm">
                <div className="px-5 py-3 border-b">
                  <h3 className="text-sm font-semibold">
                    Información del Vehículo
                  </h3>
                </div>
                <div className="px-5 py-4 bg-gray-50/60">
                  <dl className="divide-y divide-gray-200 text-sm">
                    <Row
                      label="Propietario"
                      value={vehicle.clientName || "N/D"}
                    />
                    <Row label="Placa" value={vehicle.plateNumber} />
                    <Row label="Marca" value={vehicle.brand} />
                    <Row label="Modelo" value={vehicle.model} />
                    <Row label="Año" value={vehicle.year} />
                    <Row label="Color" value={vehicle.color || "N/D"} />
                    <Row label="VIN" value={vehicle.vin || "N/D"} />
                    <Row
                      label="Último kilometraje"
                      value={`${vehicle.lastMileage ?? "N/D"} km`}
                    />
                  </dl>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Los cambios se reflejarán cuando refresques la página.
              </p>

              <div>
                <button
                  onClick={() => setServiceFormOpen(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                >
                  Registrar nuevo servicio
                </button>
              </div>
            </section>

            {/* Historial de servicios */}
            <section>
              <h3 className="text-lg font-semibold mb-2">
                Historial de Servicios
              </h3>

              {history.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Sin servicios registrados.
                </p>
              ) : (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                  {/* Pendientes */}
                  {history.some((s) => s.estado === "Pendiente") && (
                    <div>
                      <h4 className="text-md font-semibold text-amber-600 mb-2">
                        Pendientes
                      </h4>
                      <div className="space-y-3">
                        {history
                          .filter((s) => s.estado === "Pendiente")
                          .map((s) => (
                            <article
                              key={s.id}
                              className="border-l-4 border-amber-400 bg-amber-50 p-3 rounded-md shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm">
                                  {s.serviceType}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Entrada: {formatDate(s.entryDate)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-line mt-1">
                                {s.description}
                              </p>
                              <p className="text-xs mt-1 text-gray-600">
                                Kilometraje: {s.mileage} km • Mecánico:{" "}
                                {s.workerName}
                              </p>
                              {s.mechanicNotes && (
                                <p className="text-xs mt-1 text-gray-500 whitespace-pre-line">
                                  Notas: {s.mechanicNotes}
                                </p>
                              )}

                              <div className="mt-2 flex gap-2 justify-end">
                                <button
                                  onClick={() => {
                                    setSelectedService(s);
                                    setCompleteModalOpen(true);
                                  }}
                                  className="text-xs px-3 py-1 rounded border border-green-400 text-green-700 hover:bg-green-50"
                                >
                                  Completar
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingService(s);
                                    setNotesModalOpen(true);
                                  }}
                                  className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                                >
                                  Notas
                                </button>
                              </div>
                            </article>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Completados */}
                  {history.some((s) => s.estado === "Completado") && (
                    <div>
                      <h4 className="text-md font-semibold text-emerald-700 mb-2">
                        Completados
                      </h4>
                      <div className="space-y-3">
                        {history
                          .filter((s) => s.estado === "Completado")
                          .map((s) => (
                            <article
                              key={s.id}
                              className="border-l-4 border-emerald-400 bg-emerald-50 p-3 rounded-md shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm">
                                  {s.serviceType}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Entrada: {formatDate(s.entryDate)} | Salida:{" "}
                                  {formatDate(s.exitDate)}
                                </span>
                              </div>

                              <p className="text-sm text-gray-700 whitespace-pre-line mt-1">
                                {s.description}
                              </p>

                              {s.finalObservations && (
                                <p className="text-xs mt-1 text-gray-600">
                                  Estado Final: {s.vehicleState || "N/D"}
                                  <br />
                                  {s.finalObservations}
                                </p>
                              )}

                              <p className="text-xs mt-1 text-gray-600">
                                Kilometraje Esperado:{" "}
                                {s.nextServiceMileage ?? "km"} | Mecánico:{" "}
                                {s.workerName} | Hace: {s.daysAgo} días
                              </p>

                              <div className="mt-2 flex justify-end">
                                <button
                                  onClick={() => {
                                    setEditingService(s);
                                    setNotesModalOpen(true);
                                  }}
                                  className="text-xs px-3 py-1 rounded border border-violet-300 text-violet-600 hover:bg-violet-50"
                                >
                                  Editar
                                </button>
                              </div>
                            </article>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Modales hijas (z-[90]) */}
      <AddServiceModal
        isOpen={serviceFormOpen}
        onClose={() => setServiceFormOpen(false)}
        lastMileage={vehicle.lastMileage || 0}
        vehicleId={vehicle.id}
        onSuccess={refreshHistory}
      />

      {editModalOpen && (
      <EditVehicleModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        vehicle={vehicleInfo || vehicle}
        onUpdate={(v) => setVehicleInfo(v)}
      />
    )}

      <EditServiceNotesModal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        service={editingService}
        onSaved={refreshHistory}
      />

      {selectedService && (
        <CompleteServiceModal
          open={!!completeModalOpen}
          service={selectedService}
          onDone={refreshHistory}
          onClose={() => {
            setCompleteModalOpen(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
