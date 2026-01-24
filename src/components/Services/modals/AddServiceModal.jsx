// src/components/Services/AddServiceModal.jsx
import { useState, useEffect } from "react";
import { createService } from "@/api/services";
import { getAllWorkers } from "@/api/worker";
import { getServiceTypes } from "@/api/serviceTypes";
import { toast } from "react-toastify";
import ManageServiceTypesModal from "./ManageServiceTypesModal";

export default function AddServiceModal({
  isOpen,
  onClose,
  lastMileage = 0,
  vehicleId,
  onSuccess,
}) {
  const [form, setForm] = useState({
    entryDate: new Date().toISOString().slice(0, 16),
    mileage: lastMileage,
    serviceType: "",
    description: "",
    mechanicNotes: "",
    workerId: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [manageOpen, setManageOpen] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        entryDate: new Date().toISOString().slice(0, 16),
        mileage: lastMileage,
        serviceType: "",
        description: "",
        mechanicNotes: "",
        workerId: "",
      });
      setTouched({});
      setErrors({});
      getAllWorkers().then(setWorkers).catch(() => setWorkers([]));
      getServiceTypes().then(setServiceTypes).catch(() => setServiceTypes([]));
    }
  }, [isOpen, lastMileage]);

  // Real-time validation
  useEffect(() => {
    const newErrors = {};

    // Entry date validation
    if (touched.entryDate && !form.entryDate) {
      newErrors.entryDate = "La fecha de entrada es obligatoria";
    }

    // Worker validation
    if (touched.workerId && !form.workerId) {
      newErrors.workerId = "Debe seleccionar un mecánico";
    }

    // Mileage validation
    if (touched.mileage && (!form.mileage || form.mileage < 0)) {
      newErrors.mileage = "Ingrese un kilometraje válido";
    }

    // Service type validation
    if (touched.serviceType && !form.serviceType) {
      newErrors.serviceType = "Debe seleccionar un tipo de servicio";
    }

    setErrors(newErrors);
  }, [form, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((p) => ({ ...p, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all required fields as touched
    setTouched({
      entryDate: true,
      workerId: true,
      mileage: true,
      serviceType: true,
    });

    // Check for errors
    if (!form.entryDate || !form.workerId || !form.mileage || !form.serviceType) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }

    if (Object.keys(errors).length > 0) {
      toast.error("Corrija los errores antes de continuar");
      return;
    }

    try {
      setLoading(true);

      await createService({
        vehicleId,
        entryDate: new Date(form.entryDate).toISOString(),
        mileage: parseInt(form.mileage),
        serviceType: form.serviceType,
        description: form.description.trim() || undefined,
        mechanicNotes: form.mechanicNotes.trim() || undefined,
        workerId: form.workerId,
      });

      toast.success("Servicio registrado exitosamente");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error al crear servicio:", err);
      const errorMessage = err?.response?.data?.message || "No se pudo registrar el servicio";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-screen sm:max-h-[90vh]">
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-5 flex-shrink-0">
          <h2 id="modal-title" className="text-2xl font-bold text-white">
            Nuevo Servicio
          </h2>
          <p className="text-amber-100 text-sm mt-1">
            Registre la información del servicio a realizar
          </p>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <form id="service-form" onSubmit={handleSubmit} className="p-6 pb-0">
            {/* Service Details Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-600 rounded"></span>
                Detalles del Servicio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Fecha y hora de entrada"
                  name="entryDate"
                  type="datetime-local"
                  value={form.entryDate}
                  onChange={handleChange}
                  onBlur={() => handleBlur("entryDate")}
                  error={touched.entryDate && errors.entryDate}
                  required
                  autoFocus
                />
                <InputField
                  label="Kilometraje"
                  name="mileage"
                  type="number"
                  value={form.mileage}
                  onChange={handleChange}
                  onBlur={() => handleBlur("mileage")}
                  error={touched.mileage && errors.mileage}
                  required
                  min="0"
                  placeholder="Ej: 50000"
                  helperText="Kilometraje actual del vehículo"
                />
                <SelectField
                  label="Mecánico responsable"
                  name="workerId"
                  value={form.workerId}
                  onChange={handleChange}
                  onBlur={() => handleBlur("workerId")}
                  error={touched.workerId && errors.workerId}
                  required
                  options={workers.map(w => ({ value: w.id, label: w.name }))}
                  placeholder="Seleccione un mecánico"
                />
                <ServiceTypeField
                  label="Tipo de servicio"
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  onBlur={() => handleBlur("serviceType")}
                  error={touched.serviceType && errors.serviceType}
                  required
                  options={serviceTypes.map(t => ({ value: t.serviceTypeName, label: t.serviceTypeName }))}
                  placeholder="Seleccione un tipo"
                  onManage={() => setManageOpen(true)}
                />
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-600 rounded"></span>
                Información Adicional
              </h3>
              <div className="space-y-4">
                <TextAreaField
                  label="Descripción"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describa los detalles del servicio (opcional)"
                  helperText="Opcional. Detalles generales del trabajo a realizar"
                  rows={3}
                />
                <TextAreaField
                  label="Notas del mecánico"
                  name="mechanicNotes"
                  value={form.mechanicNotes}
                  onChange={handleChange}
                  placeholder="Notas técnicas o diagnóstico inicial (opcional)"
                  helperText="Opcional. Observaciones técnicas del mecánico"
                  rows={3}
                />
              </div>
            </div>

            {/* Spacer to ensure last field is visible above sticky footer */}
            <div className="h-6"></div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="service-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-lg shadow-amber-500/30 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <SaveIcon />
                <span>Registrar Servicio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal para gestionar tipos */}
      {manageOpen && (
        <ManageServiceTypesModal
          isOpen={manageOpen}
          onClose={() => setManageOpen(false)}
          onChanged={() => getServiceTypes().then(setServiceTypes).catch(() => {})}
        />
      )}
    </div>
  );
}

/* ========== UI Components ========== */

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  required,
  placeholder,
  helperText,
  autoFocus,
  min,
  max,
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500" aria-label="required">*</span>}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        min={min}
        max={max}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        className={`mt-1 w-full border rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50"
            : "border-gray-300 focus:border-amber-500 focus:ring-amber-200"
        }`}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600 flex items-center gap-1" role="alert">
          <ErrorIcon />
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${name}-helper`} className="mt-1.5 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required,
  options,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500" aria-label="required">*</span>}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`mt-1 w-full border rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-amber-500 focus:ring-amber-200"
        }`}
      >
        <option value="">{placeholder || "Seleccionar..."}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600 flex items-center gap-1" role="alert">
          <ErrorIcon />
          {error}
        </p>
      )}
    </label>
  );
}

function ServiceTypeField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required,
  options,
  placeholder,
  onManage,
}) {
  return (
    <div className="block">
      <span className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500" aria-label="required">*</span>}
      </span>
      <div className="mt-1 flex gap-2">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`flex-1 border rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-amber-500 focus:ring-amber-200"
          }`}
        >
          <option value="">{placeholder || "Seleccionar..."}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onManage}
          className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
          title="Gestionar tipos de servicio"
        >
          Gestionar
        </button>
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600 flex items-center gap-1" role="alert">
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  helperText,
  rows = 3,
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        {label}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        aria-describedby={helperText ? `${name}-helper` : undefined}
        className="mt-1 w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-amber-500 focus:ring-amber-200"
      />
      {helperText && (
        <p id={`${name}-helper`} className="mt-1.5 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </label>
  );
}

/* ========== Icons ========== */

function SaveIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
