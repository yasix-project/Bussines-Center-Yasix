// src/middlewares/rateLimiter.middleware.js
const rateLimit = require("express-rate-limit");

// 1. Limiter Standar untuk Login Umum (Kasir / Siswa)
const generalLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Maksimal 10x percobaan per IP dalam 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      status: "error",
      message:
        "Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.",
    });
  },
});

// 2. Limiter Ketat Khusus untuk Login Admin
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimal HANYA 5x percobaan per IP dalam 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      status: "error",
      message:
        "Terlalu banyak percobaan login admin yang gagal. Akses diblokir sementara (15 menit).",
    });
  },
});

module.exports = { generalLoginLimiter, adminLoginLimiter };
