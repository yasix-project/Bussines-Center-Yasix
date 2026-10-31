// src/routes/student.routes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Get All Students & Get By ID / NIS / QR
router.get(
  "/",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  studentController.getAllStudents,
);

router.get(
  "/:id",
  verifyToken,
  checkRole("ADMIN", "KASIR", "SISWA"),
  studentController.getStudentById,
);

// Admin-Only CRUD Actions
router.post(
  "/",
  verifyToken,
  checkRole("ADMIN"),
  studentController.createStudent,
);

router.put(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  studentController.updateStudent,
);

router.delete(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  studentController.deleteStudent,
);

// Special Action: Update Point Siswa
router.patch(
  "/:id/points",
  verifyToken,
  checkRole("ADMIN", "KASIR"),
  studentController.updatePoints,
);

module.exports = router;
