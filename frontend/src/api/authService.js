import axiosClient from "./axiosClient";

export const authService = {
  // POST /api/v1/auth/login
  login: (credentials) => axiosClient.post("/auth/login", credentials),

  // GET /api/v1/auth/me
  getProfile: () => axiosClient.get("/auth/me"),
};
