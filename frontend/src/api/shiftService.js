// src/api/shiftService.js
import axiosClient from "./axiosClient";

export const shiftService = {
  startShift: (data) => axiosClient.post("/shifts/start", data),
  getActiveShift: () => axiosClient.get("/shifts/active"),
  // Perubahan: Tambahkan shiftId ke dalam data payload untuk admin (Force Close)
  endShift: (data) => axiosClient.post("/shifts/end", data),
  getAllShifts: () => axiosClient.get("/shifts"),
};
