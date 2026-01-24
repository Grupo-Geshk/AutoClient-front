// src/components/Invoices/InvoiceLogo.js
// Base64 encoded logo for PDF invoice
// This ensures the logo works reliably in @react-pdf/renderer without CORS issues

export const INVOICE_LOGO_BASE64 = "https://raw.githubusercontent.com/Grupo-Geshk/AutoClient-front/main/public/ASD.jpeg";

// Alternative: If the above doesn't work, use the image from public folder
export const INVOICE_LOGO_LOCAL = "/logo-invoice.jpeg";
