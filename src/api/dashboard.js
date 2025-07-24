import api from "./axios";

export const getTodaySummary = () => api.get("/dashboard/today-summary");

export const getTopClients = (month, year) =>
  api.get("/dashboard/top-clients", { params: { month, year } });

export const getTopServices = (month, year) =>
  api.get("/dashboard/top-services", { params: { month, year } });

export const getMonthlyIncome = (month, year) =>
  api.get("/dashboard/monthly-income", { params: { month, year } });

export const getServicesPerDay = (from, to) =>
  api.get("/dashboard/services-per-day", { params: { from, to } });

export const getAverageDeliveryTime = () =>
  api.get("/dashboard/average-delivery-time");

export const getPendingServices = () => api.get("/dashboard/pending-services");
