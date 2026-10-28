const express = require("express");
const router = express.Router();
const printController = require("../controllers/print.controller");
const { uploadDocument } = require("../middlewares/upload.middleware");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Hitung estimasi biaya cetak (Unggah PDF sementara)
router.post(
  "/estimate",
  verifyToken,
  uploadDocument.single("document"),
  printController.estimatePrintCost,
);

// Buat order cetak dokumen
router.post(
  "/order",
  verifyToken,
  uploadDocument.single("document"),
  printController.createPrintOrder,
);

// Lihat semua order cetak (Khusus Admin & Kasir)
router.get(
  "/orders",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  printController.getAllPrintOrders,
);

module.exports = router;
