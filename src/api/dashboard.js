// src/api/dashboard.js
import api from "./axios";

export const getSummary = (from, to, workerId = null) => {
  const params = { from, to };
  if (workerId) {
    params.workerId = workerId;
  }
  return api.get("/dashboard/summary", { params });
};
