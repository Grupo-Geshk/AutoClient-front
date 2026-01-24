// src/api/auth.js
import api from "./axios"

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials)
  return res.data // puede devolver { token, ... } o { needOtp: true, otpToken }
}

export const adminLogin = async (credentials) => {
  const res = await api.post("/auth/adminLogin", credentials)
  const { token } = res.data
  localStorage.setItem("token", token)
  return res.data
}

export const verifyOtp = async ({ otpToken, code }) => {
  const res = await api.post("/auth/verify-otp", { otpToken, code })
  const { token } = res.data
  localStorage.setItem("token", token)
  return res.data
}

export const getProfile = () => api.get("/auth/me")
export const isAuthenticated = () => !!localStorage.getItem("token")
export const logout = () => {
  localStorage.clear()
  window.location.href = "/"
}
