// src/pages/AdminInvoiceForm.jsx
import InvoiceEditorPanel from "@/components/Invoices/InvoiceEditorPanel";

export default function AdminInvoiceForm() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Genera facturas con el diseño de tu talonario preimpreso o versión digital.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5">
        <InvoiceEditorPanel />
      </div>
    </div>
  );
}
