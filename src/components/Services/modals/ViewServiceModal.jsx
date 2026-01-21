// src/components/Services/ViewServiceModal.jsx
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { adminUpdateService } from "@/api/services";
import { getAllWorkers } from "@/api/worker";
import { sendCompletedEmail, sendUpcomingForService } from "@/api/notifications"; // ⬅️ Notificaciones
import EditServiceNotesModal from "./EditServiceNotesModal";

const none = (v) => (v === null || v === undefined || v === "" ? "—" : v);
const fmt = (n) =>
  n === null || n === undefined || n === ""
    ? "—"
    : Number(n).toLocaleString("es-PA");

export default function ViewServiceModal({
  open,
  service,
  onClose,
  onSaved,
  onRequestComplete,
}) {
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({});
  const [workers, setWorkers] = useState([]);
  const [editNotesOpen, setEditNotesOpen] = useState(false);

  // ⬇️ estados de envío de correos
  const [sendingCompleted, setSendingCompleted] = useState(false);
  const [sendingUpcoming, setSendingUpcoming] = useState(false);

  // ⬇️ helper: ¿la fecha está entre hoy y N días?
  const inNextDays = (dateStr, days = 60) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    const start = new Date(today.toDateString()); // sin hora
    const end = new Date(today);
    end.setDate(end.getDate() + days);
    return d >= start && d <= end;
  };

  useEffect(() => {
    if (open && service) {
      setEdit(false);
      setShowConfirm(false);
      // AUTOLLENADO
      setForm({
        entryDate: service.entryDate
          ? new Date(service.entryDate).toISOString().slice(0, 16)
          : "",
        exitDate: service.exitDate
          ? new Date(service.exitDate).toISOString().slice(0, 16)
          : "",
        mileage: service.mileage ?? "",
        serviceType: service.serviceType ?? "",
        description: service.description ?? "",
        mechanicNotes: service.mechanicNotes ?? "",
        nextServiceDate: service.nextServiceDate
          ? new Date(service.nextServiceDate).toISOString().split("T")[0]
          : "",
        nextServiceMileageTarget: service.nextServiceMileageTarget ?? "",
        cost: service.cost ?? "",
        workerId: service.workerId ?? "",
      });

      // CARGA TRABAJADORES PARA EL DROPDOWN
      getAllWorkers()
        .then((list) => setWorkers(Array.isArray(list) ? list : []))
        .catch(() => setWorkers([]));
    }
  }, [open, service]);

  const buildPayload = () => {
    const p = {};
    if (form.entryDate) p.entryDate = new Date(form.entryDate).toISOString();
    if (form.exitDate) p.exitDate = new Date(form.exitDate).toISOString();
    if (form.mileage !== "") p.mileage = Number(form.mileage);
    if (form.serviceType !== undefined) p.serviceType = form.serviceType;
    if (form.description !== undefined) p.description = form.description;
    if (form.mechanicNotes !== undefined) p.mechanicNotes = form.mechanicNotes;
    if (form.nextServiceDate)
      p.nextServiceDate = new Date(form.nextServiceDate).toISOString();
    if (form.nextServiceMileageTarget !== undefined)
      p.nextServiceMileageTarget = form.nextServiceMileageTarget;
    if (form.cost !== "") p.cost = Number(form.cost);
    if (form.workerId) p.workerId = form.workerId;
    return p;
  };

  if (!open || !service) return null;

  const isPending = !service.exitDate;
  const formatDate = (ds) =>
    !ds
      ? "—"
      : new Intl.DateTimeFormat("es-PA", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
          .format(new Date(ds))
          .replace(".", "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const doSave = async () => {
    try {
      setSaving(true);
      await adminUpdateService(service.id, buildPayload());
      onSaved?.(); // <- notifica al padre para refrescar lista
      setEdit(false);
      setShowConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  // ⬇️ handlers de notificaciones
  const onResendCompleted = async () => {
    try {
      setSendingCompleted(true);
      await sendCompletedEmail(service.id);
      alert("Correo 'Auto listo' re-enviado");
    } catch (e) {
      alert(
        e?.response?.data?.message || "No se pudo enviar el correo de 'Auto listo'"
      );
    } finally {
      setSendingCompleted(false);
    }
  };

  const onSendUpcoming = async () => {
    try {
      setSendingUpcoming(true);
      await sendUpcomingForService(service.id);
      alert("Aviso de próxima visita enviado");
    } catch (e) {
      alert(
        e?.response?.data?.message ||
          "No se pudo enviar el aviso de próxima visita"
      );
    } finally {
      setSendingUpcoming(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Dialog.Title className="text-lg sm:text-xl font-bold leading-tight">
                  Detalle del servicio
                </Dialog.Title>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {service.clientName} • {service.plateNumber}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={isPending ? "amber" : "green"}>
                  {isPending ? "Pendiente" : "Completado"}
                </Badge>

                {isPending ? (
                  <>
                    <Button variant="ghost" onClick={() => setEditNotesOpen(true)}>
                      Editar Notas
                    </Button>
                    <Button onClick={() => onRequestComplete?.(service)}>
                      Completar servicio
                    </Button>
                  </>
                ) : (
                  <>
                    {/* ⬇️ Botón: Re-enviar Auto listo */}
                    <Button
                      variant="ghost"
                      onClick={onResendCompleted}
                      disabled={sendingCompleted}
                      title="Re-enviar correo de 'Auto listo' al cliente"
                    >
                      {sendingCompleted ? "Enviando…" : "Re-enviar 'Auto listo'"}
                    </Button>

                    {/* ⬇️ Botón: Avisar próxima visita (manual) — visible si hay próxima fecha */}
                    {service.nextServiceDate && (
                      <Button
                        variant="ghost"
                        onClick={onSendUpcoming}
                        disabled={sendingUpcoming}
                        title="Avisar manualmente la próxima visita al cliente"
                      >
                        {sendingUpcoming ? "Enviando…" : "Avisar próxima visita"}
                      </Button>
                    )}
                    <Button
                        variant="ghost"
                        onClick={onSendUpcoming}
                        disabled={sendingUpcoming}
                        title="Avisar manualmente la próxima visita al cliente"
                      >
                        {sendingUpcoming ? "Enviando…" : "Avisar próxima visita"}
                      </Button>
                    <Button variant="ghost" onClick={() => setEdit((v) => !v)}>
                      {edit ? "Cancelar" : "Editar"}
                    </Button>
                  </>
                )}

                <Button variant="neutral" onClick={onClose}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
            {/* --- Resumen --- */}
            <FormCard title="Resumen">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Read label="Cliente" value={none(service.clientName)} />
                <Read label="Placa" value={none(service.plateNumber)} />
                <Read
                  label="Vehículo"
                  value={`${none(service.brand)} ${none(service.model)} ${none(
                    service.year
                  )}`}
                />
                <Read
                  label="Estado"
                  value={isPending ? "Pendiente" : "Completado"}
                />
              </div>
            </FormCard>

            {/* --- Fechas & Kilometraje --- */}
            <FormCard title="Fechas & Kilometraje">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  edit={edit}
                  label="Entrada"
                  name="entryDate"
                  type="datetime-local"
                  value={form.entryDate}
                  display={formatDate(service.entryDate)}
                  onChange={handleChange}
                />
                <Field
                  edit={edit}
                  label="Salida"
                  name="exitDate"
                  type="datetime-local"
                  value={form.exitDate}
                  display={formatDate(service.exitDate)}
                  onChange={handleChange}
                />
                <Field
                  edit={edit}
                  label="Kilometraje"
                  name="mileage"
                  type="number"
                  value={form.mileage}
                  display={fmt(service.mileage)}
                  onChange={handleChange}
                  min="0"
                />
                <Read
                  label="Último (días)"
                  value={service.exitDate ? none(service.haceCuantosDias) : "—"}
                />
              </div>
            </FormCard>

            {/* --- Responsable & Costos --- */}
            <FormCard title="Responsable & Costos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DROPDOWN DE TRABAJADOR EN MODO EDICIÓN */}
                {edit ? (
                  <label className="min-w-0 block">
                    <Label>
                      {isPending ? "Iniciado por" : "Completado por"}
                    </Label>
                    <select
                      name="workerId"
                      value={form.workerId ?? ""}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-400"
                    >
                      <option value="">Seleccionar trabajador…</option>
                      {workers.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <Read
                    label={isPending ? "Iniciado por" : "Completado por"}
                    value={none(service.workerName)}
                  />
                )}

                <Field
                  edit={edit}
                  label="Costo"
                  name="cost"
                  type="number"
                  value={form.cost}
                  display={`$ ${fmt(service.cost)}`}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </FormCard>

            {/* --- Próximo servicio --- */}
            <FormCard title="Próximo servicio">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  edit={edit}
                  label="Fecha"
                  name="nextServiceDate"
                  type="date"
                  value={form.nextServiceDate}
                  display={formatDate(service.nextServiceDate)}
                  onChange={handleChange}
                />
                <Field
                  edit={edit}
                  label="Km objetivo"
                  name="nextServiceMileageTarget"
                  type="text"
                  value={form.nextServiceMileageTarget}
                  display={none(service.nextServiceMileageTarget)}
                  onChange={handleChange}
                />
              </div>
            </FormCard>

            {/* --- Detalles --- */}
            <FormCard title="Detalles">
              <Field
                edit={edit}
                label="Descripción"
                name="description"
                type="textarea"
                value={form.description}
                display={none(service.description)}
                onChange={handleChange}
              />
              <Field
                edit={edit}
                label="Notas del mecánico"
                name="mechanicNotes"
                type="textarea"
                value={form.mechanicNotes}
                display={none(service.mechanicNotes)}
                onChange={handleChange}
              />
            </FormCard>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 bg-white/90 backdrop-blur border-t px-4 sm:px-6 py-3 flex items-center justify-end gap-2">
            {edit ? (
              <>
                <Button variant="ghost" onClick={() => setEdit(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowConfirm(true)} disabled={saving}>
                  {saving ? "Guardando…" : "Guardar"}
                </Button>
              </>
            ) : (
              <Button variant="neutral" onClick={onClose}>
                Cerrar
              </Button>
            )}
          </div>

          {/* Confirmación */}
          {showConfirm && (
            <div className="absolute inset-0 bg-black/40 grid place-items-center">
              <div className="bg-white rounded-2xl p-5 shadow-xl w-full max-w-md">
                <h4 className="font-semibold">
                  ¿Seguro que quieres editar este servicio?
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Se actualizarán los campos modificados.
                </p>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={doSave} disabled={saving}>
                    Confirmar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>

      {/* Edit Notes Modal - renders outside the main Dialog to avoid z-index issues */}
      <EditServiceNotesModal
        isOpen={editNotesOpen}
        onClose={() => setEditNotesOpen(false)}
        service={service}
        onSaved={() => {
          setEditNotesOpen(false);
          onSaved?.();
        }}
      />
    </Dialog>
  );
}

/* ===== Componentes UI internos (Field/Read/etc.) ===== */

function FormCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-zinc-200 p-4">
      <h3 className="font-medium mb-3">{title}</h3>
      {children}
    </section>
  );
}
function Label({ children }) {
  return <span className="block text-xs text-gray-600">{children}</span>;
}
function Read({ label, value }) {
  return (
    <label className="min-w-0 block">
      <Label>{label}</Label>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </label>
  );
}
function Field({
  edit,
  label,
  name,
  type = "text",
  value,
  display,
  onChange,
  ...rest
}) {
  if (!edit) return <Read label={label} value={display} />;

  if (type === "textarea") {
    return (
      <label className="min-w-0 block">
        <Label>{label}</Label>
        <textarea
          name={name}
          value={value ?? ""}
          onChange={onChange}
          className="mt-1 w-full h-28 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-400"
          {...rest}
        />
      </label>
    );
  }

  return (
    <label className="min-w-0 block">
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-400"
        {...rest}
      />
    </label>
  );
}

// Badge / Button minimalistas (puedes usar los de tu lib)
function Badge({ tone = "slate", children }) {
  const tones = {
    amber: "bg-amber-100 text-amber-700 ring-amber-200",
    green: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}
function Button({ variant = "primary", ...props }) {
  const base =
    "px-3 py-2 rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed transition";
  const map = {
    primary: "bg-violet-600 text-white hover:bg-violet-700",
    neutral: "bg-zinc-800 text-white hover:bg-zinc-900",
    ghost: "border border-zinc-300 hover:bg-zinc-100",
  };
  return <button className={`${base} ${map[variant]}`} {...props} />;
}
