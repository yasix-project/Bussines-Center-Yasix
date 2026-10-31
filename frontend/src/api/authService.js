import axiosClient from "./axiosClient";

export const authService = {
  // Login Umum (Kasir / Siswa)
  login: (credentials) => axiosClient.post("/auth/login", credentials),

  // Login Khusus Admin
  loginAdmin: (credentials) =>
    axiosClient.post("/auth/login/admin", credentials),

  getMe: () => axiosClient.get("/auth/me"),
  updateProfile: (data) => axiosClient.put("/auth/profile", data),
};
