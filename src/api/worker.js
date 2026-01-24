// src/api/worker.js
import api from "./axios";

// Obtener todos los trabajadores
export const getAllWorkers = () =>
  api.get("/workers").then((res) => res.data);

// Obtener un trabajador por ID
export const getWorkerById = (id) =>
  api.get(`/workers/${id}`).then((res) => res.data);

export const getWorkerOverview = (id) =>
  api.get(`/workers/${id}/overview`).then(r => r.data);

// Crear un nuevo trabajador
export const createWorker = (data) =>
  api.post("/workers", data);

export const updateWorker = (id, data) =>
  api.put(`/workers/${id}`, data).then(r => r.data); // ← endpoint de actualización

// Eliminar un trabajador
export const deleteWorker = (id) =>
  api.delete(`/workers/${id}`);
