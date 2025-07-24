import api from "./axios";

export const getAllServices = (search = "") =>
  api.get("/services", { params: { search } }).then(response => response.data);

export const createService = (data) => api.post("/services", data);

export const completeService = (id, data) =>
  api.put(`/services/${id}/complete`, data);

export const getServiceById = (id) => api.get(`/services/${id}`);

export const getHistoryByVehicle = (vehicleId) =>
  api.get(`/services/by-vehicle/${vehicleId}`);
