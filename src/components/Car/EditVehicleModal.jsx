// EditVehicleModal.jsx
import { useEffect, useState, useCallback } from "react";
import { updateVehicle } from "@/api/vehicles";
import { toast } from "react-toastify";
import { uploadImageToImgbb } from "@/api/imgbb";

export default function EditVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onUpdate,
}) {
  const [formData, setFormData] = useState({ ...vehicle });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sincroniza cuando cambie el vehículo o se reabra el modal
  useEffect(() => {
    if (isOpen && vehicle) {
      setFormData({
        plateNumber: vehicle.plateNumber || "",
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        year: vehicle.year || "",
        color: vehicle.color || "",
        VIN: vehicle.vin || "", // Map lowercase 'vin' to uppercase 'VIN'
        mileageAtRegistration: vehicle.mileageAtRegistration || "",
        imageUrl: vehicle.imageUrl || "",
      });
    }
  }, [isOpen, vehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToImgbb(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      toast.success("Imagen actualizada");
    } catch (err) {
      toast.error("Error al subir imagen");
      console.error("Error ImgBB:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await updateVehicle(vehicle.id, {
        plateNumber: (formData.plateNumber || "").toUpperCase().trim(),
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        color: formData.color,
        vin: formData.VIN, // respeta tu forma de mapear VIN -> vin si aplica
        mileageAtRegistration: parseInt(formData.mileageAtRegistration),
        imageUrl: formData.imageUrl,
      });

      toast.success("Vehículo actualizado");
      onUpdate?.({
        ...vehicle,
        plateNumber: (formData.plateNumber || "").toUpperCase().trim(),
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        color: formData.color,
        vin: formData.VIN,
        mileageAtRegistration: parseInt(formData.mileageAtRegistration),
        imageUrl: formData.imageUrl,
      });
      onClose();
    } catch (err) {
      toast.error("Error al actualizar");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Cerrar con ESC (opcional, cómodo)
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    // Backdrop: captura los clics y evita “click-through” a la modal de atrás
    <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Panel: no cierro por click en fondo; solo por X o Cancelar */}
      <div
        className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Editar Vehículo</h2>
              <p className="text-sm text-gray-500">
                Ajusta los datos del vehículo. Diseño alineado con “Registrar Nuevo Servicio”.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="text-2xl leading-none px-2 rounded hover:bg-gray-100"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario (2/3) */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Field label="Placa">
                <input
                  name="plateNumber"
                  value={formData.plateNumber || ""}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, plateNumber: e.target.value }))
                  }
                  placeholder="Ej. AC1234"
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase tracking-widest"
                />
              </Field>

              <Field label="Marca">
                <input
                  name="brand"
                  value={formData.brand || ""}
                  onChange={handleChange}
                  placeholder="Hyundai, Toyota…"
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Field>

              <Field label="Modelo">
                <input
                  name="model"
                  value={formData.model || ""}
                  onChange={handleChange}
                  placeholder="Tucson, Corolla…"
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Field>

              <Field label="Año">
                <input
                  name="year"
                  type="number"
                  value={formData.year || ""}
                  onChange={handleChange}
                  placeholder="2020"
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Field>

              <Field label="Color">
                <input
                  name="color"
                  value={formData.color || ""}
                  onChange={handleChange}
                  placeholder="Negro"
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Field>

              <Field label="VIN">
                <input
                  name="VIN"
                  value={formData.VIN || ""}
                  onChange={handleChange}
                  placeholder="JTDBU4EE9B9…"
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Field>

              <Field label="Kilometraje">
                <input
                  name="mileageAtRegistration"
                  type="number"
                  value={formData.mileageAtRegistration || ""}
                  onChange={handleChange}
                  placeholder="78500"
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Field>
            </div>

            {/* Imagen (1/3) */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border p-4">
                <div className="text-sm font-medium">Imagen del Vehículo</div>
                <p className="text-xs text-gray-500 mt-1">
                  Opcional, aparecerá en el perfil del auto.
                </p>

                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Vista previa"
                    className="mt-3 w-full aspect-video object-cover rounded-lg border"
                  />
                ) : (
                  <div className="mt-3 w-full aspect-video rounded-lg border bg-gray-50 grid place-items-center text-xs text-gray-400">
                    Sin imagen
                  </div>
                )}

                <label className="mt-3 block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm"
                  />
                </label>

                {uploading && (
                  <div className="mt-2 text-xs text-gray-500">Subiendo…</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-3 border-t bg-white/95 backdrop-blur flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[13px] text-gray-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
