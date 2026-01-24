// src/components/Clients/ClientDetailsModal.jsx
import { Dialog } from "@headlessui/react";
import { useEffect, useState, Fragment } from "react";
import { getVehiclesByClient } from "@/api/vehicles";
import VehicleModal from "../Car/VehicleModal";
import EditClientModal from "@/components/Clients/EditClientModal";
import AddVehicleModal from "../Car/AddVehicleModal";

export default function ClientDetailsModal({
  isOpen,
  onClose,
  client,
  onReloadClients,
}) {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  useEffect(() => {
    if (isOpen && client?.id) {
      getVehiclesByClient(client.id)
        .then(setVehicles)
        .catch(() => setVehicles([]));
    }
  }, [isOpen, client?.id]);

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleOpen(true);
  };

  const handleEditSaved = () => {
    onReloadClients?.();
    if (client?.id) {
      getVehiclesByClient(client.id)
        .then(setVehicles)
        .catch(() => {});
    }
  };

  const handleVehicleAdded = () => {
    // Reload vehicles list when new vehicle is added
    if (client?.id) {
      getVehiclesByClient(client.id)
        .then(setVehicles)
        .catch(() => {});
    }
    onReloadClients?.();
  };

  if (!isOpen || !client) return null;

return (
  <>
    {/* Modal del Cliente — solo cierra con la X */}
    <Dialog
      open={isOpen}
      onClose={() => { /* bloqueamos backdrop/Esc; solo X */ }}
      className="fixed inset-0 z-[60] pointer-events-none"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <Dialog.Panel className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-full max-w-6xl relative overflow-y-auto max-h-[90vh] p-6">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-2xl font-bold text-gray-900 truncate">
              {client.name}
            </Dialog.Title>

            {/* Al cerrar el cliente, cerramos también hijas por si están abiertas */}
            <button
              onClick={() => {
                setVehicleOpen(false);
                setSelectedVehicle(null);
                setEditOpen(false);
                setAddVehicleOpen(false);
                onClose?.();
              }}
              className="text-2xl leading-none px-2 rounded hover:bg-gray-100"
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* IZQUIERDA */}
            <div className="w-full md:w-1/3 space-y-4 md:pr-4 md:border-r">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                  {(client.name || "?").charAt(0).toUpperCase()}
                </div>
                <h2 className="mt-2 text-xl md:text-2xl font-bold text-gray-900">
                  {client.name}
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <h3 className="text-base font-semibold text-gray-900">Información de contacto</h3>

                <div className="grid grid-cols-3 items-start gap-2">
                  <span className="col-span-1 text-gray-500">Correo</span>
                  <span className="col-span-2 font-medium break-all">
                    {client.email || "Sin email"}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-start gap-2">
                  <span className="col-span-1 text-gray-500">Teléfono</span>
                  <span className="col-span-2 font-medium">
                    {client.phone || "N/D"}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setEditOpen(true)}
                  className="w-full md:w-auto mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Editar
                </button>
              </div>
            </div>

            {/* DERECHA */}
            <div className="w-full md:w-2/3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Vehículos registrados</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {vehicles.length} {vehicles.length === 1 ? "vehículo" : "vehículos"}
                  </span>
                  <button
                    onClick={() => setAddVehicleOpen(true)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Añadir Vehículo
                  </button>
                </div>
              </div>

              {vehicles.length === 0 ? (
                <p className="text-sm text-gray-500">Sin vehículos registrados.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicles.map((v) => (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => {
                        setSelectedVehicle(v);
                        setVehicleOpen(true);
                      }}
                      className="text-left border rounded-xl p-4 hover:shadow-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold truncate">
                            {v.brand} {v.model} {v.year}
                          </p>
                          <p className="text-sm text-gray-600">Placa: {v.plateNumber}</p>
                          <p className="text-xs text-gray-500">Último km: {v.lastMileage ?? "—"}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>

    {/* Child modals rendered OUTSIDE parent Dialog to avoid z-index issues */}
    <EditClientModal
      isOpen={editOpen}
      client={client}
      onClose={() => setEditOpen(false)}
      onUpdated={handleEditSaved}
    />

    {selectedVehicle && (
      <VehicleModal
        isOpen={vehicleOpen}
        vehicle={selectedVehicle}
        onClose={() => {
          setVehicleOpen(false);
          setSelectedVehicle(null);
        }}
      />
    )}

    <AddVehicleModal
      isOpen={addVehicleOpen}
      onClose={() => setAddVehicleOpen(false)}
      onVehicleAdded={handleVehicleAdded}
      initialClient={client}
    />
  </>
);
}
