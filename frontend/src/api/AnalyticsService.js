import axiosClient from "./axiosClient";

export const analyticsService = {
  // GET /api/v1/analytics/dashboard
  getDashboardStats: () => axiosClient.get("/analytics/dashboard"),

  // GET /api/v1/analytics/sales
  getSalesReport: (params) => axiosClient.get("/analytics/sales", { params }),
};
