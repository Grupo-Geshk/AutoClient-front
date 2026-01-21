// src/components/Clients/EditClientModal.jsx
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { updateClient } from "@/api/clients";
import { toast } from "react-toastify";

export default function EditClientModal({ isOpen, onClose, client, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load client data when modal opens
  useEffect(() => {
    if (isOpen && client) {
      setForm({
        name: client.name || "",
        phone: client.phone || "",
        email: client.email || "",
        address: client.address || "",
      });
      setTouched({});
      setErrors({});
    }
  }, [isOpen, client]);

  // Real-time validation
  useEffect(() => {
    const newErrors = {};

    // Name validation
    if (touched.name && !form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (touched.name && form.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    // Phone validation
    if (touched.phone && !form.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (touched.phone && form.phone.replace(/\D/g, "").length < 8) {
      newErrors.phone = "Ingrese un teléfono válido";
    }

    // Email validation (optional but if provided must be valid)
    if (form.email.trim() && touched.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Ingrese un correo válido";
      }
    }

    setErrors(newErrors);
  }, [form, touched]);

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2]].filter(Boolean).join("-");
    }
    return cleaned;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    // Apply formatting for phone
    if (name === "phone") {
      formattedValue = formatPhone(value);
    }

    setForm((p) => ({ ...p, [name]: formattedValue }));
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
      address: true,
    });

    // Check for errors
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }

    if (Object.keys(errors).length > 0) {
      toast.error("Corrija los errores antes de continuar");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        address: form.address.trim() || undefined,
      };

      await updateClient(client.id, payload);
      toast.success("Cliente actualizado exitosamente");
      onUpdated?.();
      onClose();
    } catch (e) {
      console.error(e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        "No se pudo actualizar el cliente";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-[70]"
      aria-labelledby="modal-title"
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
        <Dialog.Panel className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-screen sm:max-h-[90vh]">
          {/* Fixed Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex-shrink-0">
            <Dialog.Title id="modal-title" className="text-2xl font-bold text-white">
              Editar Cliente
            </Dialog.Title>
            <p className="text-blue-100 text-sm mt-1">
              Modifique la información del cliente {client?.name}
            </p>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <form id="edit-client-form" onSubmit={handleSubmit} className="p-6 pb-0">
              {/* Personal Information Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded"></span>
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
                      placeholder="Ej: María González"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded"></span>
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
                    placeholder="Ej: maria@ejemplo.com"
                    helperText="Opcional"
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Dirección"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      onBlur={() => handleBlur("address")}
                      placeholder="Ej: Calle 50, Edificio XYZ, Apto 101"
                      helperText="Opcional"
                    />
                  </div>
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
              form="edit-client-form"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
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
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
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
