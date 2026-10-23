const prisma = require("../config/prisma");

const getDashboardMetricsService = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // 1. Total Penjualan & Laba Bersih Hari Ini
  const todayTransactions = await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  let todayRevenue = 0;
  let todayHpp = 0;

  todayTransactions.forEach((tx) => {
    todayRevenue += Number(tx.totalAmount);
    tx.items.forEach((item) => {
      if (item.product) {
        todayHpp += Number(item.product.hpp) * item.quantity;
      }
    });
  });

  const todayProfit = todayRevenue - todayHpp;

  // 2. Jumlah Antrean Print Pending
  const pendingPrintOrders = await prisma.printOrder.count({
    where: { status: "PENDING" },
  });

  // 3. Jumlah Produk Low Stock
  const products = await prisma.product.findMany();
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  return {
    todayRevenue,
    todayProfit,
    todayTransactionsCount: todayTransactions.length,
    pendingPrintOrders,
    lowStockCount,
  };
};

const getSalesReportService = async (startDate, endDate) => {
  const whereCondition = {};

  if (startDate && endDate) {
    whereCondition.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const transactions = await prisma.transaction.findMany({
    where: whereCondition,
    include: {
      cashier: { select: { name: true } },
      student: { select: { name: true, nis: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return transactions;
};

module.exports = {
  getDashboardMetricsService,
  getSalesReportService,
};
