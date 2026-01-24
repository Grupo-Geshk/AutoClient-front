// src/api/invoiceTemplates.js
import api from "./axios";

/**
 * List all invoice templates for the current workshop.
 * @returns {Promise<Array>} Array of invoice templates
 */
export const listInvoiceTemplates = () =>
  api.get("/invoice-templates").then((response) => response.data);

/**
 * Create a new invoice template.
 * @param {Object} data - Template data (ruc, dv, address, phone, businessDescription, etc.)
 * @returns {Promise<Object>} Created template
 */
export const createInvoiceTemplate = (data) =>
  api.post("/invoice-templates", data).then((response) => response.data);

/**
 * Update an existing invoice template by ID.
 * @param {string} id - Template ID
 * @param {Object} data - Updated template data
 * @returns {Promise<Object>} Updated template
 */
export const updateInvoiceTemplate = (id, data) =>
  api.put(`/invoice-templates/${id}`, data).then((response) => response.data);

/**
 * Delete an invoice template by ID.
 * @param {string} id - Template ID
 * @returns {Promise<void>}
 */
export const deleteInvoiceTemplate = (id) =>
  api.delete(`/invoice-templates/${id}`).then((response) => response.data);

/**
 * Activate an invoice template by ID (sets it as the default).
 * @param {string} id - Template ID
 * @returns {Promise<Object>} Activated template
 */
export const activateInvoiceTemplate = (id) =>
  api.post(`/invoice-templates/${id}/activate`).then((response) => response.data);
