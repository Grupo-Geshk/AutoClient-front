// src/components/Vehicles/AddVehicleModal.jsx
import { useEffect, useState, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { createVehicle } from "@/api/vehicles";
import { getClients } from "@/api/clients";
import { uploadImageToImgbb } from "@/api/imgbb";
import { toast } from "react-toastify";

export default function AddVehicleModal({ isOpen, onClose, onVehicleAdded, initialClient = null }) {
  const [form, setForm] = useState({
    plateNumber: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    vin: "",
    mileageAtRegistration: "",
    clientId: "",
    clientName: "",
    imageUrl: "",
  });

  const [clients, setClients] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) getClients().then(setClients).catch(console.error);
  }, [isOpen]);

  // Pre-fill client when initialClient is provided
  useEffect(() => {
    if (isOpen && initialClient) {
      setForm((p) => ({
        ...p,
        clientId: initialClient.id,
        clientName: initialClient.name,
      }));
    }
  }, [isOpen, initialClient]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setForm({
        plateNumber: "",
        brand: "",
        model: "",
        year: "",
        color: "",
        vin: "",
        mileageAtRegistration: "",
        clientId: "",
        clientName: "",
        imageUrl: "",
      });
    }
  }, [isOpen]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await uploadImageToImgbb(file);
      setForm((p) => ({ ...p, imageUrl }));
      toast.success("Imagen subida");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const canSave =
    form.plateNumber &&
    form.brand &&
    form.model &&
    form.year &&
    form.mileageAtRegistration &&
    form.clientId &&
    !uploading &&
    !saving;

  const handleSubmit = async () => {
    if (!canSave) return;
    try {
      setSaving(true);
      await createVehicle(form);
      toast.success("Vehículo registrado");
      onVehicleAdded?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar vehículo");
    } finally {
      setSaving(false);
    }
  };

  // Cerrar con ESC (HeadlessUI ya lo hace si onClose cambia el estado)
  const handleClose = useCallback(() => {
    // No cierro por clic en backdrop automáticamente para evitar cierres accidentales.
    // HeadlessUI llamará esto en ESC; botones llaman onClose directamente.
  }, []);

  return (
    <Transition show={isOpen} as={Fragment}>
      {/* Asegura estar por encima del VehicleModal */}
      <Dialog onClose={handleClose} className="fixed inset-0 z-[90]">
        {/* Backdrop que bloquea clics */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-2 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-2 scale-95"
          >
            <Dialog.Panel
              className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden"
              // evita click-through
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-5 pb-3 border-b">
                <div className="flex items-start justify-between gap-3">
                  <Dialog.Title className="text-lg font-semibold">
                    Registrar Vehículo
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="text-2xl leading-none px-2 rounded hover:bg-gray-100"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Completa los datos del vehículo. Este estilo coincide con “Registrar Nuevo Servicio”.
                </p>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Formulario (2/3) */}
                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <Field label="Placa">
                      <input
                        name="plateNumber"
                        placeholder="Ej. CA1234"
                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={form.plateNumber}
                        onChange={onChange}
                        autoFocus
                      />
                    </Field>
                    <Field label="Marca">
                      <input
                        name="brand"
                        placeholder="Toyota, Hyundai…"
                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={form.brand}
                        onChange={onChange}
                      />
                    </Field>

                    <Field label="Modelo">
                      <input
                        name="model"
                        placeholder="Corolla, Tucson…"
                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={form.model}
                        onChange={onChange}
                      />
                    </Field>
                    <Field label="Año">
                      <input
                        name="year"
                        type="number"
                        placeholder="2018"
                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={form.year}
                        onChange={onChange}
                      />
                    </Field>

                    <Field label="Color">
                      <input
                        name="color"
                        placeholder="Blanco"
                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={form.color}
                        onChange={onChange}
                      />
                    </Field>
                    <Field label="VIN">
                      <input
                        name="vin"
                        placeholder="JTDBU4EE9B9…"
                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={form.vin}
                        onChange={onChange}
                      />
                    </Field>

                    <Field label="Kilometraje">
                      <input
                        name="mileageAtRegistration"
                        type="number"
                        placeholder="78500"
                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={form.mileageAtRegistration}
                        onChange={onChange}
                      />
                    </Field>

                    <Field label="Cliente">
                      <input
                        type="text"
                        placeholder="Buscar cliente..."
                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1"
                        value={form.clientName || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm((p) => ({
                            ...p,
                            clientName: val,
                            clientId: "",
                          }));
                        }}
                      />
                      <div className="max-h-40 overflow-y-auto border rounded-lg">
                        {clients
                          .filter((c) =>
                            (form.clientName || "")
                              .toLowerCase()
                              .split(" ")
                              .every((word) =>
                                c.name.toLowerCase().includes(word)
                              )
                          )
                          .map((c) => (
                            <div
                              key={c.id}
                              onClick={() =>
                                setForm((p) => ({
                                  ...p,
                                  clientId: c.id,
                                  clientName: c.name,
                                }))
                              }
                              className={`px-3 py-1 cursor-pointer hover:bg-blue-100 ${
                                form.clientId === c.id
                                  ? "bg-blue-50 font-semibold"
                                  : ""
                              }`}
                            >
                              {c.name}
                            </div>
                          ))}
                        {clients.filter((c) =>
                          (form.clientName || "")
                            .toLowerCase()
                            .split(" ")
                            .every((word) =>
                              c.name.toLowerCase().includes(word)
                            )
                        ).length === 0 && (
                          <div className="px-3 py-1 text-gray-400 text-sm">
                            No se encontraron resultados
                          </div>
                        )}
                      </div>
                    </Field>
                  </div>

                  {/* Imagen (1/3) */}
                  <div className="lg:col-span-1">
                    <div className="rounded-xl border p-4">
                      <div className="text-sm font-medium">
                        Imagen del Vehículo
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Opcional, aparecerá en el perfil del auto.
                      </p>

                      <label className="mt-3 block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="block w-full text-sm"
                        />
                      </label>

                      {uploading && (
                        <div className="mt-2 text-xs text-gray-500">
                          Subiendo…
                        </div>
                      )}

                      {form.imageUrl ? (
                        <img
                          src={form.imageUrl}
                          alt="Vista previa"
                          className="mt-3 w-full aspect-video object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="mt-3 w-full aspect-video rounded-lg border bg-gray-50 grid place-items-center text-xs text-gray-400">
                          Sin imagen
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 pt-3 border-t flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSave}
                  className={`px-4 py-2 rounded-xl text-white ${
                    canSave
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-300 cursor-not-allowed"
                  }`}
                >
                  {saving ? "Guardando…" : "Registrar Vehículo"}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

/* helpers */
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[13px] text-gray-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
