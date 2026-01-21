// src/Pages/WorkshopProfile.jsx
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getWorkshopProfile, updateWorkshopProfile } from "@/api/workshop";
import { uploadImageToImgbb } from "@/api/imgbb";
import { getSummary } from "@/api/dashboard";
import InvoiceTemplatesModal from "@/components/Workshop/InvoiceTemplatesModal";

export default function WorkshopProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const fileInputRef = useRef(null);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
    fetchMetrics();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getWorkshopProfile();
      setProfile(data);
      setForm({
        workshopName: data.workshopName || "",
        email: data.email || "",
        phone: data.phone || "",
        ruc: data.ruc || "",
        dv: data.dv || "",
        address: data.address || "",
        businessDescription: data.businessDescription || "",
        notificationEmail: data.notificationEmail || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      // Get metrics for all time (last 5 years as a proxy)
      const now = new Date();
      const fiveYearsAgo = new Date(now.getFullYear() - 5, 0, 1);
      const { data } = await getSummary(fiveYearsAgo.toISOString(), now.toISOString());
      setMetrics(data);
    } catch (err) {
      console.error("Error fetching metrics:", err);
      // Non-blocking error
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    try {
      setUploadingLogo(true);
      const imageUrl = await uploadImageToImgbb(file);
      await updateWorkshopProfile({ logo: imageUrl });
      setProfile((prev) => ({ ...prev, logo: imageUrl }));
      toast.success("Logo actualizado");
    } catch (err) {
      console.error("Error uploading logo:", err);
      toast.error("Error al subir el logo");
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updated = await updateWorkshopProfile(form);
      setProfile(updated);
      setEditMode(false);
      toast.success("Perfil actualizado");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({
      workshopName: profile?.workshopName || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      ruc: profile?.ruc || "",
      dv: profile?.dv || "",
      address: profile?.address || "",
      businessDescription: profile?.businessDescription || "",
      notificationEmail: profile?.notificationEmail || "",
    });
    setEditMode(false);
  };

  // Configuration warnings
  const getWarnings = () => {
    const warnings = [];
    if (!profile?.ruc || !profile?.dv) {
      warnings.push({ type: "warning", message: "RUC/DV incompleto" });
    }
    if (!profile?.address) {
      warnings.push({ type: "warning", message: "Dirección no configurada" });
    }
    if (!profile?.logo) {
      warnings.push({ type: "info", message: "Logo no configurado (opcional)" });
    }
    if (!profile?.notificationEmail) {
      warnings.push({ type: "info", message: "Email de notificaciones no configurado" });
    }
    return warnings;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner className="w-10 h-10 text-violet-600" />
      </div>
    );
  }

  const warnings = getWarnings();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Taller</h1>
          <p className="text-gray-600 mt-1">
            Administra la identidad, datos fiscales y configuración de tu taller
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Configuration Warnings */}
        {warnings.length > 0 && (
          <section className="space-y-2">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                  warning.type === "warning"
                    ? "bg-amber-50 border border-amber-200 text-amber-800"
                    : "bg-blue-50 border border-blue-200 text-blue-800"
                }`}
              >
                {warning.type === "warning" ? (
                  <WarningIcon className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <InfoIcon className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{warning.message}</span>
              </div>
            ))}
          </section>
        )}

        {/* Identity & Contact Section */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Identidad y Contacto</h2>
              <p className="text-sm text-gray-500">Información básica del taller</p>
            </div>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
              >
                Editar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Spinner className="w-4 h-4" />}
                  Guardar
                </button>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Logo Upload */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {uploadingLogo ? (
                      <Spinner className="w-8 h-8 text-violet-600" />
                    ) : profile?.logo ? (
                      <img
                        src={profile.logo}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <CameraIcon className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Cambiar
                    </span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Haz clic para subir un logo
                </p>
              </div>

              {/* Form Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Taller
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={form.workshopName}
                      onChange={(e) => setForm({ ...form, workshopName: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile?.workshopName || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile?.email || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile?.phone || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subdominio
                  </label>
                  <p className="text-gray-500 py-2 flex items-center gap-1">
                    <LockIcon className="w-4 h-4" />
                    {profile?.subdomain || "-"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email de Notificaciones (BCC)
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      value={form.notificationEmail}
                      onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })}
                      placeholder="copia@ejemplo.com"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile?.notificationEmail || "-"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fiscal Data Section */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Datos Fiscales</h2>
            <p className="text-sm text-gray-500">Información para facturas y documentos</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  R.U.C.
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={form.ruc}
                    onChange={(e) => setForm({ ...form, ruc: e.target.value })}
                    placeholder="Ej: 4-248-714"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.ruc || "-"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  D.V.
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={form.dv}
                    onChange={(e) => setForm({ ...form, dv: e.target.value })}
                    placeholder="Ej: 18"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.dv || "-"}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Dirección completa del taller"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.address || "-"}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del Negocio
                </label>
                {editMode ? (
                  <textarea
                    value={form.businessDescription}
                    onChange={(e) => setForm({ ...form, businessDescription: e.target.value })}
                    rows={2}
                    placeholder="Actividad económica del negocio"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 resize-none"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.businessDescription || "-"}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Invoice Templates Section */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Plantillas de Factura</h2>
              <p className="text-sm text-gray-500">
                Gestiona las plantillas de datos para tus facturas
              </p>
            </div>
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <SettingsIcon className="w-4 h-4" />
              Gestionar
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <DocumentIcon className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Plantillas configuradas</p>
                <p className="text-sm text-gray-500">
                  Haz clic en "Gestionar" para ver, crear o editar plantillas
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Resumen Operativo</h2>
            <p className="text-sm text-gray-500">Estadísticas generales del taller (solo lectura)</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Facturas Emitidas"
                value={metrics?.invoicesCount ?? "-"}
                icon={<InvoiceMetricIcon />}
              />
              <MetricCard
                label="Clientes"
                value={metrics?.clientsCount ?? "-"}
                icon={<ClientMetricIcon />}
              />
              <MetricCard
                label="Trabajadores"
                value={metrics?.workersCount ?? "-"}
                icon={<WorkerMetricIcon />}
              />
              <MetricCard
                label="Vehículos"
                value={metrics?.vehiclesCount ?? "-"}
                icon={<VehicleMetricIcon />}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Invoice Templates Modal */}
      <InvoiceTemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onUpdate={fetchProfile}
      />
    </div>
  );
}

/* ========== Metric Card ========== */

function MetricCard({ label, value, icon }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

/* ========== Icons ========== */

function Spinner({ className }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function CameraIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function WarningIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function InfoIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SettingsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function DocumentIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function InvoiceMetricIcon() {
  return (
    <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ClientMetricIcon() {
  return (
    <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function WorkerMetricIcon() {
  return (
    <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function VehicleMetricIcon() {
  return (
    <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-4 5v-5m-8 9h16a1 1 0 001-1v-4a1 1 0 00-.293-.707l-3-3A1 1 0 0017 7H7a1 1 0 00-.707.293l-3 3A1 1 0 003 11v4a1 1 0 001 1h1m13-1h1" />
    </svg>
  );
}
