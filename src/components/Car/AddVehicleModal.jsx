import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { createVehicle } from "@/api/vehicles";
import { getClients } from "@/api/clients"; // Asegúrate de tener este endpoint
import { toast } from "react-toastify";

export default function AddVehicleModal({ isOpen, onClose, onVehicleAdded }) {
  const [form, setForm] = useState({
    plateNumber: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    vin: "", 
    mileageAtRegistration: "",
    clientId: "",
  });

  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (isOpen) {
      getClients().then(setClients);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createVehicle(form);
      toast.success("Vehículo registrado");
      onVehicleAdded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar vehículo");
    }
  };

  return (
    <Transition appear show={isOpen} as="div">
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl space-y-4">
            <Dialog.Title className="text-lg font-semibold">Registrar Vehículo</Dialog.Title>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <input name="plateNumber" placeholder="Placa" className="input" onChange={handleChange} />
              <input name="brand" placeholder="Marca" className="input" onChange={handleChange} />
              <input name="model" placeholder="Modelo" className="input" onChange={handleChange} />
              <input name="year" placeholder="Año" type="number" className="input" onChange={handleChange} />
              <input name="color" placeholder="Color" className="input" onChange={handleChange} />
              <input name="vin" placeholder="VIN" className="input" onChange={handleChange} />
              <input
                name="mileageAtRegistration"
                placeholder="Kilometraje"
                type="number"
                className="input col-span-2"
                onChange={handleChange}
              />
              <select
                name="clientId"
                className="input col-span-2"
                onChange={handleChange}
                defaultValue=""
              >
                <option value="" disabled>Seleccionar Cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} 
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancelar
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Registrar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
