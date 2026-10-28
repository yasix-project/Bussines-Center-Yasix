require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path"); // <-- Tambahkan baris ini!

const mainRouter = require("./src/routes");
const {
  checkAndCancelExpiredOrders,
} = require("./src/services/transaction.service");

// Jalankan pengecekan pesanan kadaluwarsa setiap 5 menit (300.000 ms)
setInterval(
  async () => {
    try {
      await checkAndCancelExpiredOrders();
    } catch (error) {
      console.error("Gagal membatalkan pesanan kadaluwarsa:", error.message);
    }
  },
  5 * 60 * 1000,
);

const app = express();

// Middlewares Keamanan & Logging
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing Utama API v1
app.use("/api/v1", mainRouter);

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(process.cwd(), "uploads")),
);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Business Center berjalan di http://localhost:${PORT}`);
});
