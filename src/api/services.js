// src/api/services.js
import api from "./axios";

// Lista de servicios (con búsqueda opcional)
export const getAllServices = (search = "") =>
  api.get("/services", { params: { search } }).then((r) => r.data);

// Crear servicio
export const createService = (data) => api.post("/services", data);

// Completar servicio
export const completeService = (id, data) =>
  api.put(`/services/${id}/complete`, data);

// Obtener servicio por ID
export const getServiceById = (id) => api.get(`/services/${id}`);

// Historial por vehículo
export const getHistoryByVehicle = (vehicleId) =>
  api.get(`/services/by-vehicle/${vehicleId}`);

// Notas del servicio (append = concatena, false = reemplaza)
export const updateServiceNotes = ({ id, notes, append = false }) =>
  api.patch(`/services/${id}/notes`, { notes, append }).then((r) => r.data);

// ✨ Editar (admin) campos sueltos del servicio
// Antes esto hacía fetch contra ruta relativa y devolvía 404 en dev.
// Ahora usa el cliente Axios con baseURL correcta.
export const adminUpdateService = (id, payload) =>
  api.put(`/services/${id}/admin-update`, payload);
