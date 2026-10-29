// src/routes/voucher.routes.js
const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucher.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Endpoint GET Data Voucher (Bisa diakses Admin/Kasir)
router.get("/", verifyToken, voucherController.getAllVouchers);
router.get("/:id", verifyToken, voucherController.getVoucherById);

// Endpoint Transaksional
router.post("/validate", verifyToken, voucherController.validateVoucher);
router.post(
  "/",
  verifyToken,
  checkRole("ADMIN"),
  voucherController.createVoucher,
);
router.post(
  "/redeem",
  verifyToken,
  checkRole("SISWA"),
  voucherController.redeemPoints,
);

router.put(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  voucherController.updateVoucher,
); // <-- Endpoint Edit
router.delete(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  voucherController.deleteVoucher,
); // <-- Endpoint Hapus

module.exports = router;
