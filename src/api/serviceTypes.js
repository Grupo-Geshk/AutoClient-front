// src/api/serviceTypes.js
import api from "./axios";

// Lista de tipos (GET /service-types)
export const getServiceTypes = () =>
  api.get("/service-types").then((r) => r.data);

// Crear tipo (POST /service-types)
export const createServiceType = (name) =>
  api.post("/service-types", { serviceTypeName: name }).then((r) => r.data);

// Eliminar tipo (DELETE /service-types/{id})
export const deleteServiceType = (id) =>
  api.delete(`/service-types/${id}`);

// "Renombrar": crear nuevo y borrar el anterior (mientras no exista PUT)
export const renameServiceType = async (id, oldName, newName) => {
  // CREA el nuevo nombre
  await createServiceType(newName);
  // Opcional: elimina el anterior
  if (id) await deleteServiceType(id);
  return true;
};
