const prisma = require("../config/prisma");

// 1. Buka Shift Kasir
const startShiftService = async (cashierId, startCash) => {
  // Cek apakah kasir masih memiliki shift yang belum ditutup
  const activeShift = await prisma.cashierShift.findFirst({
    where: {
      cashierId,
      endTime: null,
    },
  });

  if (activeShift) {
    throw new Error(
      "Anda masih memiliki shift yang aktif. Selesaikan shift sebelumnya terlebih dahulu.",
    );
  }

  const shift = await prisma.cashierShift.create({
    data: {
      cashierId,
      startCash: parseFloat(startCash),
      startTime: new Date(),
    },
  });

  return shift;
};

// 2. Cek Shift Aktif
const getActiveShiftService = async (cashierId) => {
  const activeShift = await prisma.cashierShift.findFirst({
    where: {
      cashierId,
      endTime: null,
    },
  });

  if (!activeShift) {
    return null;
  }

  // Hitung total transaksi tunai (CASH) selama shift aktif berjalan
  const totalCashTransactions = await prisma.transaction.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      cashierId,
      paymentMethod: "CASH",
      createdAt: {
        gte: activeShift.startTime,
      },
    },
  });

  const cashSales = Number(totalCashTransactions._sum.totalAmount || 0);
  const expectedEndCash = Number(activeShift.startCash) + cashSales;

  return {
    ...activeShift,
    cashSales,
    expectedEndCash,
  };
};

// 3. Tutup Shift Kasir (Rekap & Hitung Selisih)
const endShiftService = async (cashierId, actualCash, shiftId = null) => {
  let activeShift;

  // Jika shiftId dikirim (Admin force close), cari shift berdasarkan ID tersebut
  if (shiftId) {
    activeShift = await prisma.cashierShift.findUnique({
      where: { id: shiftId },
    });

    if (!activeShift || activeShift.endTime) {
      throw new Error("Shift tidak ditemukan atau sudah ditutup.");
    }

    // Kita butuh kalkulasi expectedEndCash, panggil getActiveShiftService memakai cashierId milik shift tersebut
    const calculatedShift = await getActiveShiftService(activeShift.cashierId);
    activeShift.expectedEndCash = calculatedShift.expectedEndCash;
  } else {
    // Jika kasir menutup sendiri, cari shift aktif miliknya
    activeShift = await getActiveShiftService(cashierId);
    if (!activeShift) {
      throw new Error("Tidak ditemukan shift aktif untuk kasir ini.");
    }
  }

  const actualCashNum = parseFloat(actualCash);
  const expectedEndCash = activeShift.expectedEndCash;
  const difference = actualCashNum - expectedEndCash;

  const closedShift = await prisma.cashierShift.update({
    where: { id: activeShift.id },
    data: {
      endCash: expectedEndCash,
      actualCash: actualCashNum,
      difference,
      endTime: new Date(),
    },
  });

  return closedShift;
};

// 4. Riwayat Shift (Admin / Audit)
const getAllShiftsService = async () => {
  return await prisma.cashierShift.findMany({
    include: {
      cashier: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { startTime: "desc" },
  });
};

module.exports = {
  startShiftService,
  getActiveShiftService,
  endShiftService,
  getAllShiftsService,
};
