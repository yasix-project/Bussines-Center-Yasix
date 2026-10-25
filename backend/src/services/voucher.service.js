const prisma = require("../config/prisma");

const validateVoucherService = async (code, subtotal) => {
  const voucher = await prisma.voucher.findUnique({
    where: { code },
  });

  if (!voucher) {
    throw new Error("Kode voucher tidak ditemukan.");
  }

  if (!voucher.isActive) {
    throw new Error("Voucher sudah tidak aktif.");
  }

  if (new Date(voucher.validUntil) < new Date()) {
    throw new Error("Voucher telah kadaluwarsa.");
  }

  if (Number(subtotal) < Number(voucher.minPurchase)) {
    throw new Error(
      `Minimal pembelian untuk voucher ini adalah Rp ${voucher.minPurchase}`,
    );
  }

  let discountAmount = (Number(subtotal) * Number(voucher.discountPct)) / 100;
  if (voucher.maxDiscount && discountAmount > Number(voucher.maxDiscount)) {
    discountAmount = Number(voucher.maxDiscount);
  }

  return {
    voucherId: voucher.id,
    code: voucher.code,
    discountPct: voucher.discountPct,
    discountAmount,
  };
};

const createVoucherService = async (data) => {
  const { code, discountPct, maxDiscount, minPurchase, validUntil } = data;

  const existing = await prisma.voucher.findUnique({ where: { code } });
  if (existing) {
    throw new Error("Kode voucher sudah digunakan.");
  }

  return await prisma.voucher.create({
    data: {
      code,
      discountPct: parseFloat(discountPct),
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
      minPurchase: minPurchase ? parseFloat(minPurchase) : 0,
      validUntil: new Date(validUntil),
    },
  });
};

// Penukaran Poin Siswa Menjadi Voucher Diskon (100 Poin = Diskon Rp10.000)
const redeemPointsToVoucherService = async (studentId) => {
  return await prisma.$transaction(async (tx) => {
    const student = await tx.user.findUnique({ where: { id: studentId } });

    if (!student || student.role !== "SISWA") {
      throw new Error("Akun siswa tidak ditemukan.");
    }

    const REQUIRED_POINTS = 100;
    if (student.points < REQUIRED_POINTS) {
      throw new Error(
        `Poin tidak cukup. Diperlukan minimal ${REQUIRED_POINTS} poin (Poin Anda: ${student.points}).`,
      );
    }

    // Kurangi poin siswa
    await tx.user.update({
      where: { id: studentId },
      data: { points: student.points - REQUIRED_POINTS },
    });

    // Buat kode voucher unik khusus siswa tersebut
    const code = `REDEEM-${student.nis || "STU"}-${Date.now().toString().slice(-4)}`;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // Berlaku 30 hari

    const voucher = await tx.voucher.create({
      data: {
        code,
        studentId,
        discountPct: 0,
        maxDiscount: 10000,
        minPurchase: 20000,
        validUntil,
        isActive: true,
      },
    });

    return {
      voucher,
      remainingPoints: student.points - REQUIRED_POINTS,
    };
  });
};

module.exports = {
  validateVoucherService,
  createVoucherService,
  redeemPointsToVoucherService,
};
