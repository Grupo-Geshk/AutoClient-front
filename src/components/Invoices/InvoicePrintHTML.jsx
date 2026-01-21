// src/components/Invoices/InvoicePrintHTML.jsx
import { forwardRef, useMemo } from "react";

const money = (n) =>
  (Number(n) || 0).toLocaleString("es-PA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const safe = (s) => (s ?? "").toString();

const styles = {
  page: {
    position: "relative",
    width: "180mm",
    height: "297mm",
    background: "#ffffff",
    color: "#0c1632",
    fontFamily: "Arial, Helvetica, sans-serif",
    boxSizing: "border-box",
    padding: "14mm 12mm 16mm 12mm",
  },
  center: { display: "flex", alignItems: "center", justifyContent: "center" },
  row: { display: "flex", alignItems: "center" },
  between: { display: "flex", alignItems: "center", justifyContent: "space-between" },

  brandBox: { textAlign: "center", lineHeight: 1.2 },
  brandTitle: { margin: 0, fontSize: "24px", fontWeight: 800, letterSpacing: "0.5px" },
  brandRuc: { marginTop: "4px", fontWeight: 700, fontSize: "14px" },
  brandSmall: { marginTop: "2px", fontSize: "12px" },
  brandAddr: { marginTop: "2px", fontSize: "12px" },

  facturaLineWrap: { fontSize: "16px", fontWeight: 700 },
  facturaLine: {
    display: "inline-block",
    minWidth: "380px",
    borderBottom: "1px solid #0c1632",
    transform: "translateY(-2px)",
  },

  rightBox: { border: "1px solid #0c1632", padding: "6px 8px", minWidth: "180px", borderRadius: "2px" },
  dateGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 30px 30px 40px",
    gap: "6px",
    alignItems: "center",
  },
  dateLabel: { fontSize: "12px", fontWeight: 700, textAlign: "right", paddingRight: "6px" },
  cell: {
    border: "1px solid #0c1632",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "13px",
  },

  label: { fontWeight: 700, marginRight: "8px", fontSize: "14px" },
  lineFill: {
    flex: 1,
    borderBottom: "1px solid #0c1632",
    minHeight: "28px",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    fontSize: "14px",
  },

  paymentBox: { minWidth: "120px", marginLeft: "16px" },
  check: { width: "18px", height: "18px", border: "1px solid #0c1632", display: "inline-block", marginRight: "8px" },
  checked: { background: "#0c1632" },

  tableWrap: { marginTop: "16px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    background: "#182a45",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: "13px",
    padding: "8px 10px",
    border: "1px solid #0c1632",
    textAlign: "left",
  },
  td: {
    border: "1px solid #0c1632",
    padding: "8px 10px",
    fontSize: "13px",
    height: "40px",
    verticalAlign: "middle",
  },
  colQty: { width: "15%", textAlign: "center" },
  colDesc: { width: "53%" },
  colUnit: { width: "16%", textAlign: "right" },
  colTotal: { width: "16%", textAlign: "right" },

  totals: {
    marginTop: "10px",
    display: "grid",
    gridTemplateColumns: "1fr 240px",
    gap: "12px",
    alignItems: "end",
  },
  totBox: { border: "1px solid #0c1632" },
  totRow: {
    display: "grid",
    gridTemplateColumns: "1fr 120px",
    borderBottom: "1px solid #0c1632",
  },
  totCell: { padding: "8px 10px", fontWeight: 700, fontSize: "14px" },
  totRight: { textAlign: "right" },
  totFinalRow: {
    display: "grid",
    gridTemplateColumns: "1fr 120px",
    background: "#182a45",
    color: "#ffffff",
    fontWeight: 900,
  },
  recibido: { marginTop: "64px", fontWeight: 700, fontSize: "14px" },
  recibidoLine: {
    display: "inline-block",
    minWidth: "240px",
    borderBottom: "1px solid #0c1632",
    transform: "translateY(-2px)",
  },
};

export default forwardRef(function InvoicePrintHTML({ data = {} }, ref) {
  const items = data.items || data.rows || data.lines || data.concepts || [];
  const itbmsPct = data.itbms ?? 0.07;

    // --- Fecha segura ---
  let _date;
  if (data.date && typeof data.date === "object" && "day" in data.date) {
    // viene de InvoiceEditorPanel: {day, month, year}
    const y = Number(data.date.year) || new Date().getFullYear();
    const m = (Number(data.date.month) || 1) - 1; // JS month = 0-11
    const d = Number(data.date.day) || 1;
    _date = new Date(y, m, d);
  } else if (data.date) {
    // si fuera string o timestamp
    _date = new Date(data.date);
  } else {
    _date = new Date();
  }

  const dd = String(_date.getDate()).padStart(2, "0");
  const mm = String(_date.getMonth() + 1).padStart(2, "0");
  const yy = String(_date.getFullYear()).slice(-2);


  const calc = useMemo(() => {
    const sub = items.reduce((a, r) => a + (Number(r.qty) || 0) * (Number(r.unitPrice) || 0), 0);
    const itb = +(sub * itbmsPct).toFixed(2);
    const tot = +(sub + itb).toFixed(2);
    return { sub, itb, tot };
  }, [items, itbmsPct]);

  // Fija 12 filas visibles
  const VISIBLE_ROWS = 12;
  const viewRows = [...items];
  while (viewRows.length < VISIBLE_ROWS) viewRows.push({});

  const isCredito = (data.paymentType || data.tipoPago || "").toLowerCase().includes("cr");
  const isContado = (data.paymentType || data.tipoPago || "").toLowerCase().includes("co");

  return (
    <div ref={ref} style={styles.page}>
      {/* Encabezado */}
      <div style={styles.brandBox}>
        <h1 style={styles.brandTitle}>AUTO SERVICIOS DIÓGENES</h1>
        <div style={styles.brandRuc}>R.U.C. {safe(data.ruc) || "4-248-714  D.V. 18"}</div>
        <div style={styles.brandSmall}>Ventas al por menor de partes, piezas accesorios de vehículos y automotores</div>
        <div style={styles.brandAddr}>Los Anastacios, Urbanización Rinco Largo • Calle Principal, Casa 2X • Tel. 507 66238950</div>
      </div>

      <div style={{ ...styles.between, marginTop: "16px" }}>
        <div style={styles.facturaLineWrap}>
          FACTURA <span style={styles.facturaLine}>{safe(data.invoiceNumber) || ""}</span>
        </div>

        <div style={styles.rightBox}>
          <div style={styles.dateGrid}>
            <div style={styles.dateLabel}>FECHA</div>
            <div style={styles.cell}>{dd}</div>
            <div style={styles.cell}>{mm}</div>
            <div style={styles.cell}>{yy}</div>
          </div>
        </div>
      </div>

      {/* Cliente / Dirección + Pago */}
      <div style={{ ...styles.row, marginTop: "16px" }}>
        <div style={styles.label}>Cliente:</div>
        <div style={styles.lineFill}>{safe(data.client?.name || data.clientName)}</div>
      </div>

      <div style={{ ...styles.between, marginTop: "10px" }}>
        <div style={{ ...styles.row, flex: 1, marginRight: "16px" }}>
          <div style={styles.label}>Dirección:</div>
          <div style={styles.lineFill}>{safe(data.client?.address || data.clientAddress)}</div>
        </div>

        <div style={styles.paymentBox}>
          <div style={{ ...styles.row, marginBottom: "8px" }}>
            <span style={{ ...styles.check, ...(isCredito ? styles.checked : {}) }}></span> CRÉDITO
          </div>
          <div style={styles.row}>
            <span style={{ ...styles.check, ...(isContado ? styles.checked : {}) }}></span> CONTADO
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, ...styles.colQty }}>CANT.</th>
              <th style={{ ...styles.th, ...styles.colDesc }}>DESCRIPCIÓN</th>
              <th style={{ ...styles.th, ...styles.colUnit }}>P. UNIT.</th>
              <th style={{ ...styles.th, ...styles.colTotal }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {viewRows.map((r, i) => {
              const qty = r?.qty ?? "";
              const up = r?.unitPrice ?? r?.price ?? "";
              const tot = r?.qty && r?.unitPrice ? Number(r.qty) * Number(r.unitPrice) : "";
              return (
                <tr key={i}>
                  <td style={{ ...styles.td, ...styles.colQty }}>{qty}</td>
                  <td style={{ ...styles.td, ...styles.colDesc }}>{safe(r?.description || r?.detail || "")}</td>
                  <td style={{ ...styles.td, ...styles.colUnit }}>{up === "" ? "" : money(up)}</td>
                  <td style={{ ...styles.td, ...styles.colTotal }}>{tot === "" ? "" : money(tot)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div style={styles.totals}>
        <div />
        <div style={styles.totBox}>
          <div style={styles.totRow}>
            <div style={styles.totCell}>SUB-TOTAL</div>
            <div style={{ ...styles.totCell, ...styles.totRight }}>{money(calc.sub)}</div>
          </div>
          <div style={styles.totRow}>
            <div style={styles.totCell}>I.T.B.M.S</div>
            <div style={{ ...styles.totCell, ...styles.totRight }}>{money(calc.itb)}</div>
          </div>
          <div style={styles.totFinalRow}>
            <div style={{ ...styles.totCell, borderTop: "1px solid #0c1632" }}>TOTAL</div>
            <div style={{ ...styles.totCell, ...styles.totRight, borderTop: "1px solid #0c1632" }}>{money(calc.tot)}</div>
          </div>
        </div>
      </div>

      {/* Recibido */}
      <div style={styles.recibido}>
        Recibido por <span style={styles.recibidoLine}>&nbsp;</span>
      </div>
    </div>
  );
});
