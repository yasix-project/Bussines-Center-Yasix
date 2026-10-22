const prisma = require("../config/prisma");

const createTransactionService = async (cashierId, transactionData) => {
  const { studentId, voucherId, paymentMethod, payAmount, items } =
    transactionData;

  if (!items || items.length === 0) {
    throw new Error("Detail barang transaksi tidak boleh kosong.");
  }

  // Menggunakan Prisma $transaction untuk menjaga atomisitas data
  return await prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const transactionItemsData = [];

    // 1. Validasi & Hitung Item Transaksi
    for (const item of items) {
      if (item.productId) {
        // Jika Item adalah Produk ATK
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(
            `Produk dengan ID ${item.productId} tidak ditemukan.`,
          );
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Stok produk ${product.name} tidak mencukupi (Sisa: ${product.stock}).`,
          );
        }

        // Potong Stok Produk
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });

        const itemSubtotal = Number(product.sellingPrice) * item.quantity;
        subtotal += itemSubtotal;

        transactionItemsData.push({
          productId: product.id,
          itemName: product.name,
          price: product.sellingPrice,
          quantity: item.quantity,
          subtotal: itemSubtotal,
        });
      } else if (item.printOrderId) {
        // Jika Item adalah Order Print
        const printOrder = await tx.printOrder.findUnique({
          where: { id: item.printOrderId },
        });

        if (!printOrder) {
          throw new Error(`Order cetak tidak ditemukan.`);
        }

        // Pengecekan apakah order cetak sudah pernah dibayar/selesai
        if (printOrder.status === "COMPLETED") {
          throw new Error(
            `Order cetak (${printOrder.orderNumber}) sudah pernah diproses/dibayar sebelumnya.`,
          );
        }

        // Ubah Status Print Order menjadi COMPLETED
        await tx.printOrder.update({
          where: { id: item.printOrderId },
          data: { status: "COMPLETED" },
        });

        const itemSubtotal = Number(printOrder.totalPrice);
        subtotal += itemSubtotal;

        transactionItemsData.push({
          printOrderId: printOrder.id,
          itemName: `Print: ${printOrder.fileName}`,
          price: printOrder.totalPrice,
          quantity: 1,
          subtotal: itemSubtotal,
        });
      }
    }

    // 2. Kalkulasi Diskone & Voucher
    let discountAmount = 0;
    if (voucherId) {
      const voucher = await tx.voucher.findUnique({
        where: { id: voucherId },
      });

      if (
        voucher &&
        voucher.isActive &&
        new Date(voucher.validUntil) >= new Date()
      ) {
        if (subtotal >= Number(voucher.minPurchase)) {
          discountAmount = (subtotal * Number(voucher.discountPct)) / 100;
          if (
            voucher.maxDiscount &&
            discountAmount > Number(voucher.maxDiscount)
          ) {
            discountAmount = Number(voucher.maxDiscount);
          }
        }
      }
    }

    const totalAmount = subtotal - discountAmount;

    if (payAmount < totalAmount) {
      throw new Error(`Jumlah pembayaran kurang. Total: Rp ${totalAmount}`);
    }

    const changeAmount = payAmount - totalAmount;
    const invoiceNumber = `INV-${Date.now()}`;

    // 3. Simpan Transaksi Utama
    const newTransaction = await tx.transaction.create({
      data: {
        invoiceNumber,
        cashierId,
        studentId: studentId || null,
        voucherId: voucherId || null,
        subtotal,
        discountAmount,
        totalAmount,
        payAmount,
        changeAmount,
        paymentMethod: paymentMethod || "CASH",
        items: {
          create: transactionItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // 4. Tambah Poin ke Siswa (1 Poin per Kelipatan Rp 10.000)
    if (studentId) {
      const earnedPoints = Math.floor(totalAmount / 10000);
      if (earnedPoints > 0) {
        await tx.user.update({
          where: { id: studentId },
          data: { points: { increment: earnedPoints } },
        });
      }
    }

    return newTransaction;
  });
};

// Mendapatkan Semua Riwayat Transaksi (Kasir & Admin)
const getAllTransactionsService = async () => {
  return await prisma.transaction.findMany({
    include: {
      cashier: {
        select: { id: true, name: true, email: true },
      },
      student: {
        select: { id: true, name: true, nis: true },
      },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// Mendapatkan Detail Transaksi Spesifik (Untuk Struk / Nota)
const getTransactionByIdService = async (transactionId) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      cashier: {
        select: { id: true, name: true },
      },
      student: {
        select: { id: true, name: true, nis: true, points: true },
      },
      items: {
        include: {
          product: {
            select: { name: true, barcode: true },
          },
        },
      },
      voucher: true,
    },
  });

  if (!transaction) {
    throw new Error("Transaksi tidak ditemukan.");
  }

  return transaction;
};

module.exports = {
  createTransactionService,
  getAllTransactionsService,
  getTransactionByIdService,
};
