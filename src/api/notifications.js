// src/api/notifications.js
import api from "./axios";

// ============================================
// NEW NOTIFICATION MANAGEMENT API
// ============================================

// Get notification automation settings
export const getNotificationSettings = () =>
  api.get("/notifications/settings").then(r => r.data);

// Update notification automation settings
export const updateNotificationSettings = (settings) =>
  api.put("/notifications/settings", settings).then(r => r.data);

// Send client notification using template (Manual tab)
export const sendClientNotification = (payload) =>
  api.post("/notifications/send", payload).then(r => r.data);

// Get email notification logs with filters (History tab)
// Params: dateFrom, dateTo, status, templateType, clientId
export const getNotificationLogs = (params = {}) =>
  api.get("/notifications/logs", { params }).then(r => r.data);

// ============================================
// LEGACY API (kept for backwards compatibility)
// ============================================

// Re-enviar "Auto listo" para un servicio
export const sendCompletedEmail = (serviceId) =>
  api.post(`/notifications/services/${serviceId}/completed-email`);

// Enviar recordatorio de "Próximo servicio" para 1 servicio
export const sendUpcomingForService = (serviceId) =>
  api.post(`/notifications/services/${serviceId}/upcoming-email`);

// Previsualizar próximos servicios (rango)
export const previewUpcoming = ({ from, to }) =>
  api.get("/notifications/upcoming", { params: { from, to } })
     .then(r => r.data);

// Enviar en lote recordatorios (ids de Service)
export const sendUpcomingBulk = (ids) =>
  api.post("/notifications/upcoming/send", { ids }).then(r => r.data);

// Escanear próximos N días (solo envía si DaysLeft coincide con onlyOn)
export const scanUpcoming = ({ days = 7, onlyOn = "7,3,1,0", dryRun = false } = {}) =>
  api.post(`/notifications/upcoming/scan?days=${days}&onlyOn=${onlyOn}&dryRun=${dryRun}`)
     .then(r => r.data);
