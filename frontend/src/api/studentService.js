// src/api/studentService.js
import axiosClient from "./axiosClient";

export const studentService = {
  getAll: (params) => axiosClient.get("/students", { params }),
  getById: (id) => axiosClient.get(`/students/${id}`),
  create: (data) => axiosClient.post("/students", data),
  update: (id, data) => axiosClient.put(`/students/${id}`, data),
  delete: (id) => axiosClient.delete(`/students/${id}`),
  updatePoints: (id, pointsDelta) =>
    axiosClient.patch(`/students/${id}/points`, { pointsDelta }),
};
