// src/components/Workshop/InvoiceTemplatesModal.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  listInvoiceTemplates,
  createInvoiceTemplate,
  updateInvoiceTemplate,
  deleteInvoiceTemplate,
  activateInvoiceTemplate,
} from "@/api/invoiceTemplates";

export default function InvoiceTemplatesModal({ isOpen, onClose, onUpdate }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch templates when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await listInvoiceTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching templates:", err);
      // If endpoint doesn't exist yet, show empty state
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (template) => {
    try {
      await activateInvoiceTemplate(template.id);
      toast.success("Plantilla activada");
      fetchTemplates();
      onUpdate?.();
    } catch (err) {
      console.error("Error activating template:", err);
      toast.error("Error al activar la plantilla");
    }
  };

  const handleDelete = async (template) => {
    if (!window.confirm(`¿Eliminar plantilla "${template.name || `#${template.id.slice(0, 8)}`}"?`)) {
      return;
    }
    try {
      await deleteInvoiceTemplate(template.id);
      toast.success("Plantilla eliminada");
      fetchTemplates();
      onUpdate?.();
    } catch (err) {
      console.error("Error deleting template:", err);
      toast.error("Error al eliminar la plantilla");
    }
  };

  const handleSaveTemplate = async (templateData) => {
    try {
      if (editingTemplate?.id) {
        await updateInvoiceTemplate(editingTemplate.id, templateData);
        toast.success("Plantilla actualizada");
      } else {
        await createInvoiceTemplate(templateData);
        toast.success("Plantilla creada");
      }
      setEditingTemplate(null);
      setIsCreating(false);
      fetchTemplates();
      onUpdate?.();
    } catch (err) {
      console.error("Error saving template:", err);
      toast.error("Error al guardar la plantilla");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Plantillas de Factura</h2>
              <p className="text-violet-100 text-sm mt-1">
                Gestiona las plantillas de datos fiscales para tus facturas
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {editingTemplate !== null || isCreating ? (
            <TemplateForm
              template={editingTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => {
                setEditingTemplate(null);
                setIsCreating(false);
              }}
            />
          ) : (
            <>
              {/* Templates List */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner className="w-8 h-8 text-violet-600" />
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DocumentIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sin plantillas
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Crea una plantilla para almacenar tus datos fiscales
                  </p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    <PlusIcon />
                    Crear Plantilla
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {templates.map((template, index) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      index={index}
                      onEdit={() => setEditingTemplate(template)}
                      onActivate={() => handleActivate(template)}
                      onDelete={() => handleDelete(template)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!editingTemplate && !isCreating && templates.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
            >
              <PlusIcon />
              Nueva Plantilla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== Template Card ========== */

function TemplateCard({ template, index, onEdit, onActivate, onDelete }) {
  const isActive = template.isActive;
  const displayName = template.name || `Plantilla #${index + 1}`;

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        isActive
          ? "border-violet-300 bg-violet-50 ring-1 ring-violet-200"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-gray-900 truncate">{displayName}</h3>
            {isActive && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Activa
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            {template.ruc && (
              <p>
                <span className="font-medium">RUC:</span> {template.ruc}
                {template.dv && ` D.V. ${template.dv}`}
              </p>
            )}
            {template.address && (
              <p className="truncate">
                <span className="font-medium">Dirección:</span> {template.address}
              </p>
            )}
            {template.phone && (
              <p>
                <span className="font-medium">Tel:</span> {template.phone}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isActive && (
            <button
              onClick={onActivate}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Activar plantilla"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
            title="Editar"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== Template Form ========== */

function TemplateForm({ template, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: template?.name || "",
    ruc: template?.ruc || "",
    dv: template?.dv || "",
    address: template?.address || "",
    phone: template?.phone || "",
    businessDescription: template?.businessDescription || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-medium text-gray-900">
          {template?.id ? "Editar Plantilla" : "Nueva Plantilla"}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la plantilla
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Plantilla Principal"
            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            R.U.C.
          </label>
          <input
            type="text"
            name="ruc"
            value={form.ruc}
            onChange={handleChange}
            placeholder="Ej: 4-248-714"
            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            D.V.
          </label>
          <input
            type="text"
            name="dv"
            value={form.dv}
            onChange={handleChange}
            placeholder="Ej: 18"
            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Ej: 507 6623-8950"
            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Ej: Los Anastacios, Urbanización Rincón Largo..."
            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del negocio
          </label>
          <textarea
            name="businessDescription"
            value={form.businessDescription}
            onChange={handleChange}
            rows={2}
            placeholder="Ej: Ventas al por menor de partes, piezas y accesorios..."
            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Spinner className="w-4 h-4" />}
          {template?.id ? "Guardar Cambios" : "Crear Plantilla"}
        </button>
      </div>
    </form>
  );
}

/* ========== Icons ========== */

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EditIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function Spinner({ className }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
