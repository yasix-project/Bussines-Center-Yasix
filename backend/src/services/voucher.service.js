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

module.exports = {
  validateVoucherService,
  createVoucherService,
};
