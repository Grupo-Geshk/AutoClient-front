// src/utils/invoicePdf.js
//
// ⚠️ DEPRECATED - DO NOT USE ⚠️
//
// This file is deprecated and should not be used for new invoice generation.
// It uses the old jsPDF + preprinted image approach which is no longer maintained.
//
// RECOMMENDED APPROACH:
// Use the InvoiceEditorPanel component with InvoicePrintHTML for invoice generation.
// This provides a single, stable HTML+CSS to PDF pipeline using html2pdf.js.
//
// Location: src/components/Invoices/InvoiceEditorPanel.jsx
//           src/components/Invoices/InvoicePrintHTML.jsx
//
// This file is kept for backwards compatibility only and may be removed in future versions.
//
import jsPDF from "jspdf";
import plantilla from "@/components/imgs/Factura-Diogenes.png";

/**
 * @deprecated Use InvoiceEditorPanel with html2pdf.js instead
 *
 * Genera el PDF de la factura con la plantilla de Diógenes.
 * @param {Object} factura  // {date:{day,month,year}, client:{name,address,email}, paymentType, receivedBy, items[], taxRate}
 * @returns {Promise<{doc: jsPDF, blob: Blob, filename: string}>}
 */
export async function generarFacturaPDF(factura) {
  console.warn(
    "⚠️ generarFacturaPDF is deprecated. Use InvoiceEditorPanel with html2pdf.js instead. " +
    "See: src/components/Invoices/InvoiceEditorPanel.jsx"
  );
  // === Ajustes globales (mueven TODO el contenido) ===
  const NUDGE_X = -6;   // mueve todo a la izquierda(+) o derecha(-)
  const NUDGE_Y =  -2;  // mueve todo hacia abajo(+) o arriba(-)

  // A4 en pt
  const W = 595, H = 842;

  // === Coordenadas pulidas (ya con buen encaje) ===
  const POS = {
    // Fecha (tres cajitas)
    fecha_dia_x:  415 + NUDGE_X,  fecha_y: 134 + NUDGE_Y,
    fecha_mes_x:  462 + NUDGE_X,
    fecha_ano_x:  512 + NUDGE_X,

    // Cliente / Dirección (líneas largas)
    cliente_x:    100 + NUDGE_X,  cliente_y: 214 + NUDGE_Y,
    dir_x:        100 + NUDGE_X,  dir_y:     242 + NUDGE_Y,

    // Crédito / Contado (la X dentro del cuadro)
    credito_x:    404 + NUDGE_X,  credito_y: 213 + NUDGE_Y,
    contado_x:    404 + NUDGE_X,  contado_y: 237 + NUDGE_Y,

    // Primer renglón de la tabla
    fila_y:       292 + NUDGE_Y,
    lh:           22,

    // Columnas
    cant_x:        35 + NUDGE_X,
    desc_x:       110 + NUDGE_X,
    punit_x:      341 + NUDGE_X,   // borde izq. de columna P.Unit.
    punit_r:      410 + NUDGE_X,   // borde der. (para alinear a la derecha)
    total_x:      462 + NUDGE_X,   // borde izq. de columna Total
    total_r:      522 + NUDGE_X,   // borde der.

    // Totales
    subtotal_r:   508 + NUDGE_X,   subtotal_y: 690 + NUDGE_Y,
    itbms_r:      508 + NUDGE_X,   itbms_y:    712 + NUDGE_Y,
    total_r:      508 + NUDGE_X,   total_y:    746 + NUDGE_Y,

    // Recibido por (línea inferior)
    recibido_x:   90 + NUDGE_X,    recibido_y: 792 + NUDGE_Y,
  };

  // Cargar plantilla como dataURL (para evitar CORS)
  const imgData = await fetch(plantilla)
    .then(r => r.blob())
    .then(b => new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(b); }));

  const doc = new jsPDF("p", "pt", "a4");
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);

  const drawBg = () => doc.addImage(imgData, "PNG", 0, 0, W, H);

  const drawHeader = () => {
    const d = String(factura.date?.day ?? new Date().getDate()).padStart(2, "0");
    const m = String(factura.date?.month ?? (new Date().getMonth() + 1)).padStart(2, "0");
    const a = String(factura.date?.year ?? new Date().getFullYear());

    doc.text(d, POS.fecha_dia_x, POS.fecha_y);
    doc.text(m, POS.fecha_mes_x, POS.fecha_y);
    doc.text(a, POS.fecha_ano_x, POS.fecha_y);

    // Cliente / Dirección
    doc.text(factura.client?.name || "", POS.cliente_x, POS.cliente_y);
    doc.text(factura.client?.address || "", POS.dir_x, POS.dir_y);

    // Marca de pago
    if ((factura.paymentType || "").toUpperCase() === "CREDITO") doc.text("X", POS.credito_x, POS.credito_y);
    else doc.text("X", POS.contado_x, POS.contado_y);
  };

  const fmt = (n) => (Number(n || 0)).toFixed(2);
  const textRight = (txt, xRight, y) => doc.text(String(txt), xRight, y, { align: "right" });

  const wrapText = (text, maxWidth) => {
    if (!text) return [""];
    const words = String(text).split(" ");
    const lines = [];
    let line = "";
    for (const w of words) {
      const t = line ? line + " " + w : w;
      if (doc.getTextWidth(t) <= maxWidth) line = t;
      else { lines.push(line); line = w; }
    }
    if (line) lines.push(line);
    return lines;
  };

  // Paginación
  let rowY = POS.fila_y;
  const bottomLimit = 655 + NUDGE_Y;
  const newPage = (first = false) => {
    if (!first) doc.addPage("a4", "p");
    drawBg();
    drawHeader();
    rowY = POS.fila_y;
  };

  newPage(true);

  // Items
  const items = (Array.isArray(factura.items) && factura.items.length)
    ? factura.items
    : [{ qty: 1, description: "", unitPrice: 0 }];

  const maxDescWidth = POS.punit_x - POS.desc_x - 8;

  for (const it of items) {
    const lines = wrapText(it.description || "", maxDescWidth);
    // Salto si no cabe
    if (rowY + lines.length * POS.lh > bottomLimit) newPage();

    // Cantidad
    doc.text(String(it.qty ?? 1), POS.cant_x, rowY);

    // Descripción multilínea
    lines.forEach((ln, idx) => doc.text(ln, POS.desc_x, rowY + idx * POS.lh));

    // P.Unit y Total alineados a la derecha del borde
    const pu = fmt(it.unitPrice ?? 0);
    const to = fmt((it.qty || 1) * (it.unitPrice || 0));
    textRight(pu, POS.punit_r, rowY);
    textRight(to, POS.total_r, rowY);

    rowY += lines.length * POS.lh;
  }

  // Totales
  const subtotal = items.reduce((a, it) => a + Number(it.qty || 0) * Number(it.unitPrice || 0), 0);
  const taxRate  = factura.taxRate != null ? Number(factura.taxRate) : 0.07;
  const itbms    = subtotal * taxRate;
  const total    = subtotal + itbms;

  textRight(fmt(subtotal), POS.subtotal_r, POS.subtotal_y);
  textRight(fmt(itbms),    POS.itbms_r,    POS.itbms_y);
  doc.setFont(undefined, "bold");
  textRight(fmt(total),    POS.total_r,    POS.total_y);
  doc.setFont(undefined, "normal");

  // Recibido por
  if (factura.receivedBy) doc.text(` ${factura.receivedBy}`, POS.recibido_x, POS.recibido_y);

  const filename = `Factura_${(factura.client?.name || "cliente").replace(/\s+/g, "_")}.pdf`;
  const blob = doc.output("blob");
  return { doc, blob, filename };
}
