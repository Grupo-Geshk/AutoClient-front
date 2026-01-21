// components/Workers/WorkerDetailModal.jsx
import { useEffect, useState } from "react";
import { getWorkerOverview, deleteWorker, updateWorker } from "@/api/worker";
import { X, Trash2, Pencil, Save, Ban } from "lucide-react";
import { toast } from "react-toastify";

export default function WorkerDetailModal({ workerId, onClose }) {
  const [data, setData] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "", cedula: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getWorkerOverview(workerId).then(d => {
      setData(d);
      setForm({
        name: d.name || "",
        email: d.email || "",
        phone: d.phone || "",
        role: d.role || "",
        cedula: d.cedula || "", // ← requiere que el overview incluya cedula
      });
    }).catch(console.error);
  }, [workerId]);

  const handleDelete = async () => {
    if (!data) return;
    try {
      setDeleting(true);
      await deleteWorker(data.id);
      toast.success("Trabajador eliminado");
      setConfirmOpen(false);
      onClose();
      setTimeout(() => window.location.reload(), 400);
    } catch (e) {
      console.error(e);
      toast.error("No se pudo eliminar");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await updateWorker(data.id, form);
      toast.success("Trabajador actualizado");
      setData(prev => ({ ...prev, ...updated })); // refresca vista
      setEditing(false);
    } catch (e) {
      console.error(e);
      toast.error("No se pudo actualizar");
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">Cargando…</div>
      </div>
    );
  }

  const exactMatch = confirmText === data.name;

  return (
    <div onClick={onClose} className="fixed p-5 inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 truncate mb-1">{data.name}</h2>
            <p className="text-sm text-gray-500">{data.role || "Sin rol"}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Pencil size={16}/> Editar
              </button>
            ) : (
              <>
                <button onClick={handleSave} disabled={saving} className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 text-sm font-medium">
                  <Save size={16}/> {saving ? "Guardando…" : "Guardar"}
                </button>
                <button onClick={() => setEditing(false)} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Ban size={16}/> Cancelar
                </button>
              </>
            )}
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <X size={20}/>
            </button>
          </div>
        </div>

        {/* Datos / Form */}
        {!editing ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Info label="Correo" value={data.email || "—"} />
            <Info label="Teléfono" value={data.phone || "—"} />
            <Info label="Cédula" value={data.cedula || "—"} />
            <Info label="Fecha de alta" value={new Date(data.createdAt).toLocaleDateString()} />
            <KPI label="Servicios completados" value={data.completedServices} />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="name"   label="Nombre completo" value={form.name}   onChange={e=>setForm(p=>({...p, name:e.target.value}))}/>
            <Input name="role"   label="Rol"             value={form.role}   onChange={e=>setForm(p=>({...p, role:e.target.value}))}/>
            <Input name="phone"  label="Teléfono"        value={form.phone}  onChange={e=>setForm(p=>({...p, phone:e.target.value}))}/>
            <Input name="cedula" label="Cédula"          value={form.cedula} onChange={e=>setForm(p=>({...p, cedula:e.target.value}))}/>
            <div className="sm:col-span-2">
              <Input name="email"  label="Correo"         value={form.email}  onChange={e=>setForm(p=>({...p, email:e.target.value}))}/>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setConfirmOpen(true)}
            className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm font-medium"
          >
            <Trash2 size={16}/> Eliminar
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            Cerrar
          </button>
        </div>
      </div>

      {/* Confirmación de borrado */}
      {confirmOpen && (
        <div onClick={() => setConfirmOpen(false)} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div onClick={e => e.stopPropagation()} className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-red-600">Eliminar trabajador</h3>
            <p className="mt-2 text-sm text-gray-600">
              Esta acción es permanente. Para confirmar, escribe exactamente el nombre del trabajador:
            </p>
            <div className="mt-3 p-3 rounded-lg bg-gray-50 text-sm">
              <span className="text-gray-500">Nombre a escribir:</span>
              <div className="font-semibold">{data.name}</div>
            </div>

            <label className="block mt-4">
              <span className="text-sm text-gray-700">Confirmación</span>
              <input
                autoFocus
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Escribe el nombre exacto"
                className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </label>

            <div className="mt-4 text-xs text-gray-500">
              *Este trabajador tiene <b>{data.completedServices}</b> servicios completados en el historial.
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => { setConfirmOpen(false); setConfirmText(""); }}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={confirmText !== data.name || deleting}
                className={`px-4 py-2 rounded-xl text-white ${confirmText === data.name ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"}`}
              >
                {deleting ? "Eliminando…" : "Eliminar definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-900 truncate">{value}</div>
    </div>
  );
}

function KPI({ label, value }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input {...props} className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </label>
  );
}
