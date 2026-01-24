// src/components/ClientCard.jsx
import { useState } from "react";
import ClientDetailsModal from "./ClientDetailsModal";
import AddVehicleModal from "../Car/AddVehicleModal";
import { CarIcon } from "@/components/icons/ClientsIcons";

export default function ClientCard({ client, onAddVehicle, onReloadClients }) {
  const [openModal, setOpenModal] = useState(false);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  // Inicial del nombre
  const initial = client.name ? client.name.charAt(0).toUpperCase() : "?";

  // Vehicle count with safe fallback
  const vehicleCount =
    client.vehiclesCount ??
    client.totalVehicles ??
    client.vehicles?.length ??
    0;

  const vehicleLabel = vehicleCount === 1 ? "1 vehículo" : `${vehicleCount} vehículos`;

  const handleAddVehicle = (e) => {
    e.stopPropagation();
    setAddVehicleOpen(true);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    setOpenModal(true);
  };

  const handleVehicleAdded = () => {
    // Reload clients list when new vehicle is added
    onReloadClients?.();
  };

  return (
    <>
      <div
        className="bg-white shadow-md rounded-2xl p-6 w-full cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
        onClick={() => setOpenModal(true)}
      >
        {/* Vehicle count badge - top right */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {vehicleLabel}
          </span>
        </div>

        {/* Main content area */}
        <div className="flex items-start gap-4 mb-6">
          {/* Large circular avatar */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-violet-100 text-violet-700 font-semibold text-2xl flex-shrink-0">
            {initial}
          </div>

          {/* Identity block */}
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
              {client.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {client.email || "Sin correo"}
            </p>
          </div>
        </div>

        {/* Bottom action area */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium">
            Acciones rápidas
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewDetails}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <span>Detalle</span>
            </button>
            <button
              onClick={handleAddVehicle}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <span className="w-5 h-5">
                <CarIcon />
              </span>
              <span>Añadir Vehículo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      <ClientDetailsModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        client={client}
        onReloadClients={onReloadClients}
      />

      {/* Modal para añadir vehículo */}
      <AddVehicleModal
        isOpen={addVehicleOpen}
        onClose={() => setAddVehicleOpen(false)}
        onVehicleAdded={handleVehicleAdded}
        initialClient={client}
      />
    </>
  );
}
