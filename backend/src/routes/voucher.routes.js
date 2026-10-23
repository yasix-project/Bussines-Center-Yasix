const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucher.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.post("/validate", verifyToken, voucherController.validateVoucher);
router.post(
  "/",
  verifyToken,
  checkRole("ADMIN"),
  voucherController.createVoucher,
);

module.exports = router;
