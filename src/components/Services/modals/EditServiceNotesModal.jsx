// src/components/Services/modals/EditServiceNotesModal.jsx
import { useEffect, useState } from "react";
import { updateServiceNotes } from "@/api/services";

export default function EditServiceNotesModal({ isOpen, onClose, service, onSaved }) {
  const [notes, setNotes] = useState("");
  const [append, setAppend] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (service) setNotes(service.mechanicNotes || "");
  }, [service]);

  if (!isOpen || !service) return null;

  const MAX = 1000; // respeta [MaxLength(1000)] del modelo
  const remaining = MAX - (notes?.length || 0);

  const handleSave = async () => {
    if (!notes.trim() && append === false) {
      // si reemplaza, no permitir vacío por error; quita este guard si quieres permitir vacío
      return;
    }
    try {
      setSaving(true);
      await updateServiceNotes({ id: service.id, notes, append });
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
  <div className="fixed inset-0 z-[90] bg-black/30 flex items-center justify-center pointer-events-none">
    <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl pointer-events-auto">
      <h3 className="text-lg font-semibold">Editar notas del mecánico</h3>
      <p className="text-xs text-gray-500 mt-1">
        Servicio: <b>{service.serviceType}</b> — Placa <b>{service.plateNumber}</b>
      </p>

      <label className="block mt-4">
        <span className="text-sm text-gray-700">Notas</span>
        <textarea
          className="mt-1 w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, MAX))}
          placeholder="Escribe las notas del servicio…"
        />
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={append} onChange={(e) => setAppend(e.target.checked)} />
            Agregar al final (no reemplazar)
          </label>
          <span>{remaining} caracteres</span>
        </div>
      </label>

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300">Cancelar</button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  </div>
);

}
