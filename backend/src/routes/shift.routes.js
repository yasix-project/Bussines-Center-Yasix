const express = require("express");
const router = express.Router();
const shiftController = require("../controllers/shift.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Buka Shift Kasir
router.post(
  "/start",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  shiftController.startShift,
);

// Cek Shift Aktif Kasir saat ini
router.get(
  "/active",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  shiftController.getActiveShift,
);

// Tutup Shift Kasir
router.post(
  "/end",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  shiftController.endShift,
);

// Lihat Seluruh Riwayat Shift (Khusus Admin)
router.get("/", verifyToken, checkRole("ADMIN"), shiftController.getAllShifts);

module.exports = router;
