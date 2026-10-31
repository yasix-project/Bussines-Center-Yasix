const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Public Route
router.post("/login", authController.login);

// Protected Route (Hanya Admin yang bisa daftarkan siswa baru)
router.post(
  "/register-siswa",
  verifyToken,
  checkRole("ADMIN"),
  authController.registerSiswa,
);

// Protected Route (Cek Profil Akun Aktif)
router.get("/me", verifyToken, authController.getMe);

router.put("/profile", verifyToken, authController.updateProfile);
module.exports = router;
