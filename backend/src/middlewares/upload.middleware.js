const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan direktori tujuan tersedia
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ==========================================
// 1. CONFIG UPLOAD DOKUMEN PDF (JASA PRINT)
// ==========================================
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/documents/";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `print-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const docFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Hanya file berformat PDF yang diperbolehkan!"), false);
  }
};

const uploadDocument = multer({
  storage: docStorage,
  fileFilter: docFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // Max 20MB
});

// ==========================================
// 2. CONFIG UPLOAD GAMBAR (PRODUK / ATK)
// ==========================================
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/products/";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `prod-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
  }
};

const uploadProductImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
});

module.exports = {
  uploadDocument,
  uploadProductImage,
};
