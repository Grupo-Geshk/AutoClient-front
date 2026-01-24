// src/components/Invoices/InvoicePDF.jsx
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

// Utility function to format currency
const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString('es-PA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Utility function to safely render text
const safeText = (value) => String(value ?? '');

// Professional PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    color: '#1a1a1a',
  },

  // Header section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: '2 solid #0c1632',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingRight: 24
  },

  logo: {
    width: 64,
    height: 64,
    marginRight: 12,
    objectFit: 'contain',
  },

  companyInfo: {
    flex: 1,
    marginLeft: 0,
  },

  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0c1632',
    marginBottom: 0,
  },

  companyDetail: {
    fontSize: 9,
    color: '#4a4a4a',
    marginBottom: 2,
    lineHeight: 1.4,
  },

  headerRight: {
    alignItems: 'flex-end',
  },

  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0c1632',
    marginBottom: 8
  },

  invoiceNumber: {
    fontSize: 10,
    color: '#4a4a4a',
    marginBottom: 4,
  },

  // Date section
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    padding: 6,
    border: '1 solid #0c1632',
    borderRadius: 2,
  },

  dateLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0c1632',
    marginRight: 6,
  },

  dateValue: {
    fontSize: 9,
    color: '#1a1a1a',
    marginHorizontal: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    border: '1 solid #d0d0d0',
    borderRadius: 2,
    minWidth: 24,
    textAlign: 'center',
  },

  // Client and payment info section
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  clientInfo: {
    flex: 1,
    marginRight: 20,
  },

  infoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0c1632',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 10,
    color: '#1a1a1a',
    paddingBottom: 8,
    borderBottom: '1 solid #0c1632',
    marginBottom: 10,
  },

  paymentInfo: {
    width: 140,
  },

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  checkbox: {
    width: 14,
    height: 14,
    border: '1.5 solid #0c1632',
    marginRight: 8,
    borderRadius: 1,
  },

  checkboxChecked: {
    backgroundColor: '#0c1632',
  },

  paymentLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },

  // Table section
  table: {
    marginBottom: 16,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#182a45',
    padding: 8,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 8,
    minHeight: 32,
    alignItems: 'center',
  },

  tableRowAlt: {
    backgroundColor: '#f9f9f9',
  },

  tableCell: {
    fontSize: 10,
    color: '#1a1a1a',
  },

  // Column widths
  colQty: {
    width: '12%',
    textAlign: 'center',
  },

  colDescription: {
    width: '56%',
    paddingRight: 8,
  },

  colUnitPrice: {
    width: '16%',
    textAlign: 'right',
  },

  colTotal: {
    width: '16%',
    textAlign: 'right',
  },

  // Totals section
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },

  totalsBox: {
    width: 240,
    border: '1.5 solid #0c1632',
    borderRadius: 2,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottom: '1 solid #d0d0d0',
  },

  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#182a45',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },

  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },

  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'right',
  },

  totalLabelFinal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  totalValueFinal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'right',
  },

  // Signature section
  signatureSection: {
    marginTop: 48,
  },

  signatureLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },

  signatureLine: {
    borderBottom: '1 solid #0c1632',
    marginTop: 2,
    paddingBottom: 4,
    minWidth: 280,
  },

  signatureText: {
    fontSize: 10,
    color: '#1a1a1a',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#7a7a7a',
    paddingTop: 8,
    borderTop: '1 solid #e0e0e0',
  },
});

/**
 * Professional PDF Invoice Component
 *
 * @param {Object} props.data - Invoice data
 * @param {Object} props.data.client - Client information (name, address, email)
 * @param {Object} props.data.date - Invoice date (day, month, year)
 * @param {string} props.data.invoiceNumber - Invoice number
 * @param {string} props.data.paymentType - Payment type ('credito' or 'contado')
 * @param {Array} props.data.items - Line items array
 * @param {number} props.data.taxRate - Tax rate (default: 0.07)
 * @param {string} props.data.receivedBy - Name of person who received
 * @param {string} props.data.ruc - Company RUC number
 * @param {string} props.data.currency - Currency symbol (default: '$')
 * @param {string} props.logoSrc - Logo image source (base64 or URL)
 */
const InvoicePDF = ({ data = {}, logoSrc }) => {
  // Extract and validate data
  const client = data.client || {};
  const dateObj = data.date || {};
  const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : [];
  const taxRate = Number(data.taxRate ?? 0.07);
  const paymentType = (data.paymentType || 'contado').toLowerCase();
  const currency = data.currency || '$';

  // Format date
  const day = String(dateObj.day || new Date().getDate()).padStart(2, '0');
  const month = String(dateObj.month || (new Date().getMonth() + 1)).padStart(2, '0');
  const year = String(dateObj.year || new Date().getFullYear());

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    return sum + (Number(item.qty || 0) * Number(item.unitPrice || 0));
  }, 0);

  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const isCredito = paymentType.includes('cred');
  const isContado = !isCredito;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Logo - using base64 or URL passed via props */}
            {logoSrc && (
              <Image
                src={logoSrc}
                style={styles.logo}
              />
            )}
            <View style={[styles.companyInfo, logoSrc && { marginLeft: 12 }]}>
              <Text style={styles.companyName}>AUTO SERVICIOS DIÓGENES</Text>
              <Text style={styles.companyDetail}>
                R.U.C. {safeText(data.ruc) || '4-248-714 D.V. 18'}
              </Text>
              <Text style={styles.companyDetail}>
                Ventas al por menor de partes, piezas y accesorios de vehículos y automotores
              </Text>
              <Text style={styles.companyDetail}>
                Los Anastacios, Urbanización Rinco Largo • Calle Principal, Casa 2X • Tel. 507 66238950
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>FACTURA</Text>
            {data.invoiceNumber && (
              <Text style={styles.invoiceNumber}>
                No. {safeText(data.invoiceNumber)}
              </Text>
            )}
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>FECHA:</Text>
              <Text style={styles.dateValue}>{day}</Text>
              <Text style={styles.dateValue}>{month}</Text>
              <Text style={[styles.dateValue, { minWidth: 40 }]}>{year}</Text>
            </View>
          </View>
        </View>

        {/* Client and Payment Information */}
        <View style={styles.infoSection}>
          <View style={styles.clientInfo}>
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.infoLabel}>Cliente:</Text>
              <Text style={styles.infoValue}>{safeText(client.name)}</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Dirección:</Text>
              <Text style={styles.infoValue}>{safeText(client.address)}</Text>
            </View>
          </View>

          <View style={styles.paymentInfo}>
            <Text style={[styles.infoLabel, { marginBottom: 8 }]}>Forma de Pago:</Text>
            <View style={styles.paymentOption}>
              <View style={[styles.checkbox, isCredito && styles.checkboxChecked]} />
              <Text style={styles.paymentLabel}>CRÉDITO</Text>
            </View>
            <View style={styles.paymentOption}>
              <View style={[styles.checkbox, isContado && styles.checkboxChecked]} />
              <Text style={styles.paymentLabel}>CONTADO</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>CANT.</Text>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>DESCRIPCIÓN</Text>
            <Text style={[styles.tableHeaderCell, styles.colUnitPrice]}>P. UNIT.</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>TOTAL</Text>
          </View>

          {/* Table Rows */}
          {items.map((item, index) => {
            const qty = Number(item.qty || 0);
            const unitPrice = Number(item.unitPrice || 0);
            const lineTotal = qty * unitPrice;

            return (
              <View
                key={index}
                style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
              >
                <Text style={[styles.tableCell, styles.colQty]}>{qty}</Text>
                <Text style={[styles.tableCell, styles.colDescription]}>
                  {safeText(item.description)}
                </Text>
                <Text style={[styles.tableCell, styles.colUnitPrice]}>
                  {currency}{formatCurrency(unitPrice)}
                </Text>
                <Text style={[styles.tableCell, styles.colTotal]}>
                  {currency}{formatCurrency(lineTotal)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SUB-TOTAL</Text>
              <Text style={styles.totalValue}>
                {currency}{formatCurrency(subtotal)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                I.T.B.M.S ({(taxRate * 100).toFixed(0)}%)
              </Text>
              <Text style={styles.totalValue}>
                {currency}{formatCurrency(tax)}
              </Text>
            </View>

            <View style={styles.totalRowFinal}>
              <Text style={styles.totalLabelFinal}>TOTAL</Text>
              <Text style={styles.totalValueFinal}>
                {currency}{formatCurrency(total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Signature */}
        {data.receivedBy && (
          <View style={styles.signatureSection}>
            <Text style={styles.signatureLabel}>
              Recibido por:{' '}
              <Text style={styles.signatureLine}>
                <Text style={styles.signatureText}> {safeText(data.receivedBy)} </Text>
              </Text>
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Documento generado electrónicamente • Auto Servicios Diógenes • R.U.C. 4-248-714 D.V. 18
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
