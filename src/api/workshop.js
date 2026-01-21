// src/api/workshop.js
import api from "./axios";

/**
 * Get the current workshop's profile.
 * @returns {Promise<Object>} Workshop profile data
 */
export const getWorkshopProfile = () =>
  api.get("/workshops/me").then((response) => response.data);

/**
 * Update the current workshop's profile.
 * @param {Object} payload - Fields to update (workshopName, email, phone, logo)
 * @returns {Promise<Object>} Updated workshop profile data
 */
export const updateWorkshopProfile = (payload) =>
  api.put("/workshops/me", payload).then((response) => response.data);
