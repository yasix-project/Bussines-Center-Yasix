import axiosClient from "./axiosClient";

export const authService = {
  // POST /api/v1/auth/login
  login: (credentials) => axiosClient.post("/auth/login", credentials),

  getMe: () => axiosClient.get("/auth/me"),
  updateProfile: (data) => axiosClient.put("/auth/profile", data),
};
