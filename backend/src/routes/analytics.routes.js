const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.get(
  "/dashboard",
  verifyToken,
  checkRole("ADMIN"),
  analyticsController.getDashboardMetrics,
);
router.get(
  "/sales",
  verifyToken,
  checkRole("ADMIN"),
  analyticsController.getSalesReport,
);

module.exports = router;
