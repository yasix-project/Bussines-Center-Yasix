// BARIS PERTAMA (Wajib sebelum Prisma atau route di-import)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mainRouter = require("./src/routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Business Center berjalan di port ${PORT}`);
});
