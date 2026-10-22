const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const prisma = require("../config/prisma");

// Menghitung Jumlah Halaman PDF
const countPdfPagesService = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(dataBuffer);
  return pdfDoc.getPageCount();
};

// Menghitung Biaya Cetak
const calculatePrintCostService = (totalPages, colorType, paperSize = "A4") => {
  const pricePerPage = colorType === "COLOR" ? 1000 : 500;
  const totalPrice = totalPages * pricePerPage;

  return {
    totalPages,
    colorType,
    paperSize,
    pricePerPage,
    totalPrice,
  };
};

// Membuat Order Cetak Baru
const createPrintOrderService = async (fileData, bodyData, studentId) => {
  if (!fileData) {
    throw new Error("File PDF wajib diunggah.");
  }

  const { colorType, paperSize, finishing, notes } = bodyData;
  const pageCount = await countPdfPagesService(fileData.path);

  // Buat nomor order unik (PO-YYYYMMDD-XXXX)
  const orderNumber = `PO-${Date.now()}`;

  const validColorType = colorType === "COLOR" ? "COLOR" : "BW";
  const calculation = calculatePrintCostService(
    pageCount,
    validColorType,
    paperSize,
  );

  const printOrder = await prisma.printOrder.create({
    data: {
      orderNumber,
      studentId,
      fileUrl: fileData.path,
      fileName: fileData.originalname,
      pageCount,
      colorType: validColorType,
      paperSize: paperSize || "A4",
      finishing: finishing || null,
      totalPrice: calculation.totalPrice,
      notes: notes || null,
      status: "PENDING",
    },
  });

  return printOrder;
};

// Mendapatkan Semua Order Cetak
const getAllPrintOrdersService = async () => {
  return await prisma.printOrder.findMany({
    include: {
      student: {
        select: { id: true, name: true, email: true, nis: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  countPdfPagesService,
  calculatePrintCostService,
  createPrintOrderService,
  getAllPrintOrdersService,
};
