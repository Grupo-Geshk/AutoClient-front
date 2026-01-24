// src/api/invoices.js
import api from "./axios";

// POST /invoices
export const createInvoice = (data) =>
  api.post("/invoices", data).then(r => r.data);

// POST /invoices/from-service/{serviceId}
export const createInvoiceFromService = (serviceId, data) =>
  api.post(`/invoices/from-service/${serviceId}`, data).then(r => r.data);

// GET stream pdf
export const getInvoicePdf = (id) =>
  api.get(`/invoices/${id}/pdf`, { responseType: "blob" });
