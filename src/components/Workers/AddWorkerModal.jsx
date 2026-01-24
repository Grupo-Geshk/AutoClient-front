// components/Workers/AddWorkerModal.jsx
import { useState, useEffect } from "react";
import { createWorker } from "@/api/worker";
import { toast } from "react-toastify";

const PREDEFINED_ROLES = [
  { value: "Mechanic", label: "Mecánico" },
  { value: "Assistant", label: "Asistente" },
  { value: "Manager", label: "Gerente" },
  { value: "Technician", label: "Técnico" },
  { value: "Supervisor", label: "Supervisor" },
  { value: "custom", label: "Otro (especificar)" },
];

export default function AddWorkerModal({ isOpen, onClose, onWorkerAdded }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    customRole: "",
    cedula: ""
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isCustomRole, setIsCustomRole] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", phone: "", email: "", role: "", customRole: "", cedula: "" });
      setTouched({});
      setErrors({});
      setIsCustomRole(false);
    }
  }, [isOpen]);

  // Real-time validation
  useEffect(() => {
    const newErrors = {};

    // Name validation
    if (touched.name && !form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (touched.name && form.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    // Phone validation
    if (touched.phone && !form.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (touched.phone && form.phone.replace(/\D/g, "").length < 8) {
      newErrors.phone = "Ingrese un teléfono válido";
    }

    // Role validation
    if (touched.role && !form.role) {
      newErrors.role = "El rol es obligatorio";
    } else if (touched.role && isCustomRole && !form.customRole.trim()) {
      newErrors.role = "Especifique el rol personalizado";
    }

    // Email validation (optional but if provided must be valid)
    if (form.email.trim() && touched.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Ingrese un correo válido";
      }
    }

    // Cedula validation (optional but if provided must be valid)
    if (form.cedula.trim() && touched.cedula) {
      const cedulaClean = form.cedula.replace(/\D/g, "");
      if (cedulaClean.length < 6) {
        newErrors.cedula = "La cédula debe tener al menos 6 dígitos";
      }
    }

    setErrors(newErrors);
  }, [form, touched, isCustomRole]);

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2]].filter(Boolean).join("-");
    }
    return cleaned;
  };

  const formatCedula = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,1})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join("-");
    }
    return cleaned;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    // Apply formatting
    if (name === "phone") {
      formattedValue = formatPhone(value);
    } else if (name === "cedula") {
      formattedValue = formatCedula(value);
    }

    setForm(p => ({ ...p, [name]: formattedValue }));

    // Handle role change
    if (name === "role") {
      setIsCustomRole(value === "custom");
      if (value !== "custom") {
        setForm(p => ({ ...p, customRole: "" }));
      }
    }
  };

  const handleBlur = (field) => {
    setTouched(p => ({ ...p, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      phone: true,
      email: true,
      role: true,
      cedula: true,
    });

    // Check for errors
    if (!form.name.trim() || !form.phone.trim() || !form.role) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }

    if (isCustomRole && !form.customRole.trim()) {
      toast.error("Especifique el rol personalizado");
      return;
    }

    if (Object.keys(errors).length > 0) {
      toast.error("Corrija los errores antes de continuar");
      return;
    }

    try {
      setLoading(true);

      // Prepare payload
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        role: isCustomRole ? form.customRole.trim() : form.role,
        cedula: form.cedula.trim() || undefined,
      };

      await createWorker(payload);
      toast.success("Trabajador creado exitosamente");
      onWorkerAdded?.();
      onClose();
    } catch (e) {
      console.error(e);
      const errorMessage = e?.response?.data?.message || "No se pudo crear el trabajador";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-screen sm:max-h-[90vh]"
      >
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-5 flex-shrink-0">
          <h2 id="modal-title" className="text-2xl font-bold text-white">
            Nuevo Trabajador
          </h2>
          <p className="text-violet-100 text-sm mt-1">
            Complete la información del nuevo miembro del equipo
          </p>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <form id="worker-form" onSubmit={handleSubmit} className="p-6 pb-0">
            {/* Personal Information Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-violet-600 rounded"></span>
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField
                    label="Nombre completo"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    error={touched.name && errors.name}
                    required
                    placeholder="Ej: Juan Pérez"
                    autoFocus
                  />
                </div>
                <InputField
                  label="Cédula"
                  name="cedula"
                  value={form.cedula}
                  onChange={handleChange}
                  onBlur={() => handleBlur("cedula")}
                  error={touched.cedula && errors.cedula}
                  placeholder="Ej: 8-123-4567"
                  helperText="Opcional. Formato: N-NNN-NNNN"
                />
                <div></div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-violet-600 rounded"></span>
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Teléfono"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur("phone")}
                  error={touched.phone && errors.phone}
                  required
                  placeholder="Ej: 6123-4567"
                  helperText="Formato: NNNN-NNNN"
                />
                <InputField
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  error={touched.email && errors.email}
                  placeholder="Ej: juan@ejemplo.com"
                  helperText="Opcional"
                />
              </div>
            </div>

            {/* Role/Position Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-violet-600 rounded"></span>
                Cargo y Función
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Rol"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  onBlur={() => handleBlur("role")}
                  error={touched.role && errors.role}
                  required
                  options={PREDEFINED_ROLES}
                />
                {isCustomRole && (
                  <InputField
                    label="Rol personalizado"
                    name="customRole"
                    value={form.customRole}
                    onChange={handleChange}
                    onBlur={() => handleBlur("role")}
                    error={touched.role && errors.role}
                    required
                    placeholder="Especifique el rol"
                  />
                )}
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
            form="worker-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-lg shadow-violet-500/30 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <SaveIcon />
                <span>Guardar Trabajador</span>
              </>
            )}
          </button>
        </div>
      </div>
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
  autoFocus
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
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        className={`mt-1 w-full border rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50"
            : "border-gray-300 focus:border-violet-500 focus:ring-violet-200"
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
  options
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
            : "border-gray-300 focus:border-violet-500 focus:ring-violet-200"
        }`}
      >
        <option value="">Seleccionar rol...</option>
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
