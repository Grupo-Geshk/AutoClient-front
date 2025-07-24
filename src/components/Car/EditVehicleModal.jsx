import { useState } from "react";
import { updateVehicle } from "@/api/vehicles";
import { toast } from "react-toastify";

export default function EditVehicleModal({ isOpen, onClose, vehicle, onUpdate }) {
  const [formData, setFormData] = useState({ ...vehicle });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await updateVehicle(vehicle.id, formData);
      toast.success("Vehículo actualizado");
      onUpdate(); // para refrescar datos
      onClose();
    } catch (err) {
      toast.error("Error al actualizar");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow max-w-md w-full"
      >
        <h2 className="text-lg font-bold mb-4">Editar Vehículo</h2>

        <div className="space-y-3">
          {["plateNumber", "brand", "model", "year", "color", "VIN", "mileage"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={formData[field] || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
