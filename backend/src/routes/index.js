const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const categoryRoutes = require("./category.routes");
const printRoutes = require("./print.routes");
const transactionRoutes = require("./transaction.routes");

// Health Check
router.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const totalUsers = await prisma.user.count();

    return res.status(200).json({
      status: "success",
      message:
        "Business Center API & Database MySQL Docker terhubung dengan lancar!",
      database: {
        status: "CONNECTED",
        totalUsers,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal terhubung ke Database MySQL!",
      database: {
        status: "DISCONNECTED",
        error: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

// Sub-Routers
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/print", printRoutes);
router.use("/transactions", transactionRoutes);

module.exports = router;
