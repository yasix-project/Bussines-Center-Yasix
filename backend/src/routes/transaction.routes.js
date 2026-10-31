const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Hanya Kasir & Admin yang bisa melakukan Checkout POS
router.post(
  "/checkout",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  transactionController.createTransaction,
);

// GET Semua Riwayat Transaksi (Khusus Admin & Kasir)
router.get(
  "/",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  transactionController.getAllTransactions,
);

// GET Detail 1 Transaksi Berdasarkan ID (Untuk Cetak Struk)
router.get(
  "/:id",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  transactionController.getTransactionById,
);

// Pre-order Mandiri Siswa
router.post(
  "/pre-order",
  verifyToken,
  checkRole("SISWA"),
  transactionController.studentPreOrder,
);

// Pelunasan & Pick-up di Konter oleh Kasir/Admin
router.patch(
  "/:id/complete",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  transactionController.completePreOrder,
);

router.patch(
  "/:id/cancel",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  transactionController.cancelTransaction,
);

module.exports = router;
