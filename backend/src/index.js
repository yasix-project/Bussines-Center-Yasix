require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const mainRouter = require("./routes");
const {
  checkAndCancelExpiredOrders,
} = require("./services/transaction.service");

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Business Center berjalan di http://localhost:${PORT}`);
});
