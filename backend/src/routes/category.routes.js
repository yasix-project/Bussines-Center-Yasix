const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Public / Logged-in Users
router.get("/", verifyToken, categoryController.getCategories);
router.get("/:id", verifyToken, categoryController.getCategoryById);

// Admin Only
router.post(
  "/",
  verifyToken,
  checkRole("ADMIN"),
  categoryController.createCategory,
);
router.put(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  categoryController.deleteCategory,
);

module.exports = router;
