// src/components/Services/ManageServiceTypesModal.jsx
import { useEffect, useState } from "react";
import {
  getServiceTypes,
  createServiceType,
  deleteServiceType,
  renameServiceType,
} from "@/api/serviceTypes";

export default function ManageServiceTypesModal({ isOpen, onClose, onChanged }) {
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null); // { id, name } si estás renombrando
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getServiceTypes().then(setItems);
      setNewName("");
      setEditing(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const addItem = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await createServiceType(newName.trim());
      const list = await getServiceTypes();
      setItems(list);
      setNewName("");
      onChanged?.();
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id) => {
    setSaving(true);
    try {
      await deleteServiceType(id);
      const list = await getServiceTypes();
      setItems(list);
      onChanged?.();
    } finally {
      setSaving(false);
    }
  };

  const doRename = async () => {
    if (!editing?.id || !editing?.name?.trim()) {
      setEditing(null);
      return;
    }
    setSaving(true);
    try {
      await renameServiceType(editing.id, null, editing.name.trim());
      const list = await getServiceTypes();
      setItems(list);
      setEditing(null);
      onChanged?.();
    } finally {
      setSaving(false);
    }
  };

  return (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90] flex items-center justify-center pointer-events-none">
    <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl pointer-events-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gestionar tipos de servicio</h3>
        <button onClick={onClose} className="text-2xl" aria-label="Cerrar">&times;</button>
      </div>

      <div className="mt-4 space-y-4">
        {/* Agregar nuevo */}
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 text-sm"
            placeholder="Nuevo tipo de servicio"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            onClick={addItem}
            disabled={saving}
            className="px-3 py-2 rounded bg-violet-600 text-white hover:bg-violet-700 text-sm"
          >
            Añadir
          </button>
        </div>

        {/* Lista */}
        <ul className="divide-y border rounded">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-2 p-2">
              {editing?.id === it.id ? (
                <>
                  <input
                    className="flex-1 border rounded px-2 py-1 text-sm "
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                  <button onClick={doRename} className="px-2 py-1 rounded bg-green-600 text-white text-xs">
                    Guardar
                  </button>
                  <button onClick={() => setEditing(null)} className="px-2 py-1 rounded border text-xs">
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm">{it.serviceTypeName}</span>
                  <button
                    onClick={() => setEditing({ id: it.id, name: it.serviceTypeName })}
                    className="px-2 py-1 rounded border text-xs"
                    title="Renombrar"
                  >
                    Renombrar
                  </button>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="px-2 py-1 rounded border border-red-200 text-red-600 text-xs"
                    title="Eliminar"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </li>
          ))}
          {items.length === 0 && (
            <li className="p-3 text-sm text-gray-500">No hay tipos de servicio aún.</li>
          )}
        </ul>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
          Cerrar
        </button>
      </div>
    </div>
  </div>
);

}
