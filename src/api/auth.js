// src/api/auth.js
import api from "./axios"

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials)

  const { token } = res.data
  localStorage.setItem("token", token)

  return res.data // 👈 Retorna todo: token, subdomain, etc.
}

export const getProfile = () => api.get("/auth/me")
export const isAuthenticated = () => !!localStorage.getItem("token")
export const logout = () => {
  localStorage.clear()
  window.location.href = "/"
}
