import axios from "axios";

const api = axios.create({
  baseURL: "https://autoclient-production.up.railway.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Agregar token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
