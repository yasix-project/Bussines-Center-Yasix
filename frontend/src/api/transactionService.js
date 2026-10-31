// src/api/transactionService.js
import axiosClient from "./axiosClient";

export const transactionService = {
  getAll: () => axiosClient.get("/transactions"),
  getById: (id) => axiosClient.get(`/transactions/${id}`),
  cancel: (id) => axiosClient.patch(`/transactions/${id}/cancel`),
  markReady: (id) => axiosClient.patch(`/transactions/${id}/ready`),
  complete: (id, data) =>
    axiosClient.patch(`/transactions/${id}/complete`, data),
};
