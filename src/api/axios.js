// src/api/axios.js
import axios from "axios";

// 🔒 Clave de almacenamiento local (implícita)
const TOKEN_KEY = "token";

// 🌐 Base de API - Priority: env var → development mode → production fallback
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "https://autoclient-production.up.railway.app"
    ? "https://localhost:7127"
    : "https://autoclient-production.up.railway.app");

// 🔧 Configuración principal de Axios
const api = axios.create({
  baseURL: "https://localhost:7127",
  headers: { "Content-Type": "application/json" },
});

// 🔑 Interceptor para adjuntar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
