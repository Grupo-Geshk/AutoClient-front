// src/components/Invoices/InvoiceEditorPanel.jsx
import { useEffect, useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/Invoices/InvoicePDF";
import { useInvoiceImage, LOGO_URL } from "@/components/Invoices/useInvoiceImage"; 

const emptyRow = () => ({ qty: 1, description: "", unitPrice: 0 });

export default function InvoiceEditorPanel({
  serviceId = null,
  defaults = null,
  onClose,
  onSaved,
}) {
  const today = new Date();
  const initial = {
    template: "preprinted",
    client: {
      name: defaults?.client?.name ?? "",
      email: defaults?.client?.email ?? "",
      address: defaults?.client?.address ?? "",
    },
    date: {
      day: defaults?.date?.day ?? today.getDate(),
      month: defaults?.date?.month ?? today.getMonth() + 1,
      year: defaults?.date?.year ?? today.getFullYear(),
    },
    paymentType: "contado",
    receivedBy: "",
    items: defaults?.items?.length ? defaults.items : [emptyRow()],
    taxRate: 0.07,
    sendEmail: true,
    serviceId: serviceId,
  };

  const [form, setForm] = useState(initial);

  // Pre-load logo as base64 for reliable PDF rendering
  const logoBase64 = useInvoiceImage(LOGO_URL);

  useEffect(() => {
    setForm(initial); /* eslint-disable-next-line */
  }, []);

  const subtotal = useMemo(
    () =>
      form.items.reduce(
        (acc, it) => acc + Number(it.qty || 0) * Number(it.unitPrice || 0),
        0
      ),
    [form.items]
  );
  const tax = useMemo(
    () => Number((subtotal * Number(form.taxRate || 0)).toFixed(2)),
    [subtotal, form.taxRate]
  );
  const total = useMemo(
    () => Number((subtotal + tax).toFixed(2)),
    [subtotal, tax]
  );

  const setField = (path, value) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      const segs = path.split(".");
      let cursor = next;
      for (let i = 0; i < segs.length - 1; i++) cursor = cursor[segs[i]];
      cursor[segs[segs.length - 1]] = value;
      return next;
    });
  };

  const setItem = (idx, key, value) =>
    setForm((prev) => {
      const next = structuredClone(prev);
      next.items[idx][key] =
        key === "qty" || key === "unitPrice" ? Number(value) : value;
      return next;
    });

  const addItem = () =>
    setForm((p) => ({ ...p, items: [...p.items, emptyRow()] }));
  const removeItem = (i) =>
    setForm((p) => ({
      ...p,
      items: p.items.filter((_, idx) => idx !== i) || [emptyRow()],
    }));

  // Generate filename for PDF
  const generateFilename = () => {
    const sanitizedName = (form.client.name || "cliente")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .substring(0, 50);
    const dateStr = `${form.date.year}${String(form.date.month).padStart(2, "0")}${String(form.date.day).padStart(2, "0")}`;
    return `Factura_${sanitizedName}_${dateStr}.pdf`;
  };

  // ======== UI ========
  return (
    <div className="w-full max-w-5xl">
      {/* ============ SECTION 1: INVOICE HEADER ============ */}
      <div className="border-b-2 border-gray-200 pb-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-start">

          {/* LEFT: Business Identity */}
          <div className="flex items-start gap-3">
            <img
              src="https://github.com/Grupo-Geshk/AutoClient-front/blob/main/public/ASD.jpeg?raw=true"
              alt="Logo"
              className="h-16 w-16 object-contain flex-shrink-0 rounded-lg shadow-sm border border-gray-200"
            />
            <div className="leading-tight">
              <h2 className="text-base font-bold tracking-wide text-gray-900">
                AUTO SERVICIOS DIÓGENES
              </h2>
              <p className="text-xs text-gray-600 mt-1 font-medium">R.U.C. 4-248-714 D.V. 18</p>
              <p className="text-[11px] text-gray-500 mt-0.5 max-w-[280px]">
                Ventas al por menor de partes, piezas y accesorios de vehículos y automotores
              </p>
            </div>
          </div>

          {/* CENTER: Client Information (editable) */}
          <div className="space-y-3 min-w-[260px]">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Cliente
              </label>
              <input
                className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={form.client.name}
                onChange={(e) => setField("client.name", e.target.value)}
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Dirección
              </label>
              <input
                className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={form.client.address}
                onChange={(e) => setField("client.address", e.target.value)}
                placeholder="Dirección del cliente"
              />
            </div>
          </div>

          {/* RIGHT: Invoice Metadata */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-800 mb-3 text-center">FACTURA</p>

            {/* Date selector */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 text-center mb-1">
                  DÍA
                </label>
                <input
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="number"
                  min="1"
                  max="31"
                  value={form.date.day}
                  onChange={(e) => setField("date.day", Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 text-center mb-1">
                  MES
                </label>
                <input
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="number"
                  min="1"
                  max="12"
                  value={form.date.month}
                  onChange={(e) => setField("date.month", Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 text-center mb-1">
                  AÑO
                </label>
                <input
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="number"
                  min="2000"
                  max="2100"
                  value={form.date.year}
                  onChange={(e) => setField("date.year", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Payment type */}
            <div className="flex items-center justify-center gap-4 text-xs font-medium">
              <label className="inline-flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
                <input
                  type="radio"
                  name="pay"
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  checked={form.paymentType === "credito"}
                  onChange={() => setField("paymentType", "credito")}
                />
                <span>CRÉDITO</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
                <input
                  type="radio"
                  name="pay"
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  checked={form.paymentType === "contado"}
                  onChange={() => setField("paymentType", "contado")}
                />
                <span>CONTADO</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ============ SECTION 2: SERVICE DETAILS (Dynamic Table) ============ */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Detalles del Servicio
          </h3>
          <button
            onClick={addItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Fila
          </button>
        </div>

        {/* Table for larger screens */}
        <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700 text-white">
                <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider w-20">Cant.</th>
                <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider">Descripción</th>
                <th className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wider w-28">P. Unit.</th>
                <th className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wider w-28 bg-slate-600">Total</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider w-16 bg-slate-700"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {form.items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 py-8 text-center text-sm text-gray-400">
                    No hay ítems. Haz clic en "Agregar Fila" para comenzar.
                  </td>
                </tr>
              ) : (
                form.items.map((it, idx) => {
                  const line = Number(it.qty || 0) * Number(it.unitPrice || 0);
                  return (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                      {/* Quantity */}
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className="w-full px-2 py-2 bg-amber-50/70 border border-amber-200 rounded-lg text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                          min="0"
                          step="0.01"
                          value={it.qty}
                          onChange={(e) => setItem(idx, "qty", e.target.value)}
                          placeholder="0"
                        />
                      </td>
                      {/* Description */}
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                          value={it.description}
                          onChange={(e) => setItem(idx, "description", e.target.value)}
                          placeholder="Descripción del servicio o producto"
                        />
                      </td>
                      {/* Unit Price */}
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className="w-full px-2 py-2 bg-green-50/70 border border-green-200 rounded-lg text-sm text-right font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                          min="0"
                          step="0.01"
                          value={it.unitPrice}
                          onChange={(e) => setItem(idx, "unitPrice", e.target.value)}
                          placeholder="0.00"
                        />
                      </td>
                      {/* Line Total (calculated, read-only) */}
                      <td className="px-3 py-2">
                        <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-right font-bold text-gray-700">
                          ${line.toFixed(2)}
                        </div>
                      </td>
                      {/* Delete */}
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => removeItem(idx)}
                          disabled={form.items.length === 1}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Eliminar fila"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Cards for mobile */}
        <div className="md:hidden space-y-3">
          {form.items.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl py-12 text-center">
              <p className="text-sm text-gray-400">No hay ítems. Haz clic en "Agregar Fila".</p>
            </div>
          ) : (
            form.items.map((it, idx) => {
              const line = Number(it.qty || 0) * Number(it.unitPrice || 0);
              return (
                <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500">ÍTEM #{idx + 1}</span>
                    <button
                      onClick={() => removeItem(idx)}
                      disabled={form.items.length === 1}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Descripción</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={it.description}
                      onChange={(e) => setItem(idx, "description", e.target.value)}
                      placeholder="Descripción del servicio"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cantidad</label>
                      <input
                        type="number"
                        className="w-full px-2 py-2 bg-amber-50/70 border border-amber-200 rounded-lg text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                        value={it.qty}
                        onChange={(e) => setItem(idx, "qty", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">P. Unit.</label>
                      <input
                        type="number"
                        className="w-full px-2 py-2 bg-green-50/70 border border-green-200 rounded-lg text-sm text-right font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                        value={it.unitPrice}
                        onChange={(e) => setItem(idx, "unitPrice", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-600">Total:</span>
                      <span className="text-lg font-bold text-gray-800">${line.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ============ SECTION 3: TOTALS & SIGNATURE ============ */}
      <div className="border-t-2 border-gray-200 pt-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT: Received By */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Recibido por
            </label>
            <input
              className="w-full max-w-md px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nombre del responsable"
              value={form.receivedBy}
              onChange={(e) => setField("receivedBy", e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Esta persona confirma la recepción del servicio
            </p>
          </div>

          {/* RIGHT: Totals Container */}
          <div className="lg:justify-self-end w-full lg:max-w-sm">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-md overflow-hidden">

              {/* Subtotal */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                <span className="text-sm font-semibold text-gray-700">SUB-TOTAL</span>
                <span className="text-base font-bold text-gray-800 font-mono">${subtotal.toFixed(2)}</span>
              </div>

              {/* Tax (with configurable rate) */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">I.T.B.M.S</span>
                  <span className="text-xs text-gray-500">
                    (
                    <input
                      className="w-12 px-1 py-0.5 bg-white border border-slate-300 rounded text-center text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={form.taxRate}
                      onChange={(e) => setField("taxRate", Number(e.target.value))}
                    />
                    %)
                  </span>
                </div>
                <span className="text-base font-bold text-gray-800 font-mono">${tax.toFixed(2)}</span>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-700 to-slate-800">
                <span className="text-base font-bold text-white uppercase tracking-wide">TOTAL</span>
                <span className="text-2xl font-black text-white font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-right">
              El impuesto se calcula automáticamente sobre el subtotal
            </p>
          </div>
        </div>
      </div>

      {/* ============ SECTION 4: ACTIONS ============ */}
      <div className="border-t border-gray-200 pt-6 flex flex-wrap items-center justify-end gap-3">
        {onClose && (
          <button
            className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            onClick={() => onClose()}
          >
            Cancelar
          </button>
        )}
        <PDFDownloadLink
          document={<InvoicePDF data={form} logoSrc={logoBase64} />}
          fileName={generateFilename()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          style={form.items.length === 0 || !logoBase64 ? { pointerEvents: 'none', opacity: 0.6 } : {}}
        >
          {({ loading: pdfLoading }) =>
            (pdfLoading || !logoBase64) ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generando PDF...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span>Descargar Factura PDF</span>
              </>
            )
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
}
