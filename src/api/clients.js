import api from "./axios";

export const getClients = (search = "") =>
  api.get("/clients", { params: { search } }).then(response => response.data);

export const getClientById = (id) => api.get(`/clients/${id}`);

export const createClient = (data) => api.post("/clients", data);

export const updateClient = (id, data) => api.put(`/clients/${id}`, data);

export const deleteClient = (id) => api.delete(`/clients/${id}`);

export const getVehiclesByClient = (id) => api.get(`/clients/${id}/vehicles`);
