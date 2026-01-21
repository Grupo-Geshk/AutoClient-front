// src/components/Services/CompleteServiceModal.jsx
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { completeService } from "@/api/services";
import { getAllWorkers } from "@/api/worker";

export default function CompleteServiceModal({
  open,
  service,
  onClose,
  onDone,
}) {
  const [form, setForm] = useState({
    exitDate: new Date().toISOString(),
    finalObservations: "",
    vehicleState: "",
    deliveredBy: "",
    nextServiceDate: "",
    nextServiceMileageTarget: "",
    cost: 0,
  });

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    getAllWorkers().then((data) => {
      setWorkers(data || []);
      const matching = (data || []).find((w) => w.name === service?.workerName);
      if (matching) setForm((p) => ({ ...p, deliveredBy: matching.id }));
    });
  }, [open, service?.workerName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validaciones suaves
    if (Number(form.cost) < 0) {
      setError("El costo no puede ser negativo.");
      return;
    }
    if (
      form.nextServiceMileageTarget !== "" &&
      Number(form.nextServiceMileageTarget) < 0
    ) {
      setError("El kilometraje objetivo debe ser un número positivo.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await completeService(service.id, form);
      onDone?.(); // <-- avisa al padre para refrescar + toast
      onClose?.();
    } catch {
      setError("Error al completar el servicio.");
    } finally {
      setLoading(false);
    }
  };

  // Si ya está completado, no renderizamos
  if (service?.exitDate) return null;

  return (
    <Dialog
      open={!!open}
      onClose={() => {}}
      className="fixed inset-0 z-200 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <Dialog.Panel className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Dialog.Title className="text-xl font-bold">
            Completar Servicio
          </Dialog.Title>
          <button
            onClick={onClose}
            className="text-2xl leading-none px-2 rounded hover:bg-gray-100"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium">
              Estado del vehículo
            </label>
            <input
              name="vehicleState"
              value={form.vehicleState}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Estado actual del vehículo"
              aria-label="Estado del vehículo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Observaciones finales
            </label>
            <textarea
              name="finalObservations"
              value={form.finalObservations}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Notas adicionales del mecánico"
              aria-label="Observaciones finales"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Próximo servicio
            </label>
            <input
              type="date"
              name="nextServiceDate"
              value={
                form.nextServiceDate ? form.nextServiceDate.split("T")[0] : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                setForm((p) => ({
                  ...p,
                  nextServiceDate: val
                    ? new Date(val + "T00:00:00Z").toISOString()
                    : null,
                }));
              }}
              className="w-full border rounded p-2"
              aria-label="Fecha del próximo servicio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Kilometraje objetivo para la próxima visita
            </label>
            <input
              type="number"
              name="nextServiceMileageTarget"
              value={form.nextServiceMileageTarget}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  nextServiceMileageTarget: e.target.value,
                }))
              }
              className="w-full border rounded p-2"
              placeholder="Dejar vacío para guardar “—”"
              min="0"
              aria-label="Kilometraje objetivo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Costo</label>
            <input
              type="number"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              className="w-full border rounded p-2"
              min="0"
              aria-label="Costo del servicio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Entregado por</label>
            <select
              name="deliveredBy"
              value={form.deliveredBy}
              onChange={handleChange}
              className="w-full border rounded p-2"
              aria-label="Trabajador que entrega"
            >
              {(workers || []).map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            disabled={loading}
            aria-label="Confirmar completar servicio"
            title="Completar servicio"
          >
            {loading ? "Guardando..." : "Completar"}
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
