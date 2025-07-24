import { useEffect, useState } from "react";
import { getHistoryByVehicle } from "@/api/services";
import AddServiceModal from "../Services/AddServiceModal";
import EditVehicleModal from "./EditVehicleModal";
import { EditIcon } from "@/components/icons/VehicleIcons";

export default function VehicleModal({ isOpen, onClose, vehicle }) {
  const [history, setHistory] = useState([]);
  const lastMileage =
    history
      .slice()
      .sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))[0]
      ?.mileage || "N/A";
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (vehicle?.id) {
      getHistoryByVehicle(vehicle.id).then((res) => setHistory(res.data));
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg max-w-5xl w-full p-6 relative z-50"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Detalles del Vehículo</h2>
            <button
              onClick={() => setEditModalOpen(true)}
              className="text-gray-600 hover:text-gray-800"
              title="Editar vehículo"
            >
              <EditIcon />
            </button>
          </div>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>

        {/* CONTENIDO EN 2 COLUMNAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* INFORMACIÓN DEL VEHÍCULO */}
          <div className="text-sm text-gray-700 dark:text-gray-200 space-y-2">
            <span className="flex gap-5">
              <p className="flex flex-col text-2xl">
                <span className="text-sm">Placa:</span> {vehicle.plateNumber}
              </p>
              <p className="flex flex-col text-2xl">
                <span className="text-sm">Marca:</span> {vehicle.brand}
              </p>
            </span>
            <span className="flex gap-5">
              <p className="flex flex-col text-2xl">
                <span className="text-sm">Modelo:</span> {vehicle.model}
              </p>
              <p className="flex flex-col text-2xl">
                <span className="text-sm">Año:</span> {vehicle.year}
              </p>
            </span>
            <span className="flex gap-5">
              <p className="flex flex-col text-2xl">
                <span className="text-sm">Color:</span> {vehicle.color || "N/A"}
              </p>
              <p className="flex flex-col text-2xl">
                <span className="text-sm">Kilometraje:</span>{" "}
                {lastMileage || "N/A"} km
              </p>
            </span>
          </div>

          {/* HISTORIAL DE SERVICIOS */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Historial de Servicios
            </h3>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500">
                Sin servicios registrados.
              </p>
            ) : (
              <div className="overflow-y-auto max-h-60 border rounded">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <tr>
                      <th>Fecha Entrada</th>
                      <th>Salida</th>
                      <th>Kilometraje</th>
                      <th>Servicios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry) => (
                      <tr key={entry.id} className="border-b">
                        <td>{entry.entryDate}</td>
                        <td>{entry.exitDate || "Pendiente"}</td>
                        <td>{entry.mileage} km</td>
                        <td>{entry.ServiceType || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-400 hover:bg-red-700 text-white rounded text-sm"
          >
            Cerrar
          </button>
          <button
            onClick={() => setServiceFormOpen(true)}
            className="px-4 py-2 bg-violet-400 text-white rounded hover:bg-violet-700 text-sm"
          >
            Añadir Servicio
          </button>
        </div>
      </div>

      {/* MODAL DE NUEVO SERVICIO */}
      <AddServiceModal
        vehicleId={vehicle.id}
        isOpen={serviceFormOpen}
        onClose={() => setServiceFormOpen(false)}
        lastMileage={history[0]?.mileage || 0}
        onSuccess={() =>
          getHistoryByVehicle(vehicle.id).then((res) => setHistory(res.data))
        }
      />
      <EditVehicleModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        vehicle={vehicle}
        onUpdate={() =>
          getHistoryByVehicle(vehicle.id).then((res) => setHistory(res.data))
        }
      />
    </div>
  );
}
