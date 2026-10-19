const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Public / Logged-in Users (Siswa, Kasir, Admin)
router.get("/", verifyToken, productController.getProducts);
router.get(
  "/low-stock",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  productController.getLowStockAlert,
);
router.get("/:id", verifyToken, productController.getProductById);

// Protected Admin Only (Tambah, Edit, Hapus Barang)
router.post(
  "/",
  verifyToken,
  checkRole("ADMIN"),
  productController.createProduct,
);
router.put(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  productController.updateProduct,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  productController.deleteProduct,
);

module.exports = router;
