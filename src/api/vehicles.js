// src/api/vehicles.js
import api from "./axios";

export const createVehicle = (data) => api.post("/vehicles", data);

export const getVehicleByPlate = (plate) =>
  api.get("/vehicles/by-plate", { params: { plate } })
    .then(response => response.data);

export const getVehicles = (search = "") =>
  api.get("/vehicles/vehicles", { params: { search } })
    .then(response => response.data);

export const getVehiclesByClient = (clientId) =>
  api.get(`/vehicles/by-client/${clientId}`)
    .then(response => response.data);

export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data);

export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);
