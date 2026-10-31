// src/controllers/student.controller.js
const studentService = require("../services/student.service");

const getAllStudents = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const result = await studentService.getAllStudentsService({
      search,
      page,
      limit,
    });

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data siswa.",
      data: result.students,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Gagal mengambil data siswa.",
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentByIdService(id);

    return res.status(200).json({
      status: "success",
      data: student,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const createStudent = async (req, res) => {
  try {
    const { name, email, password, nis, points, qrCodeMember } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        status: "error",
        message: "Nama dan Email wajib diisi.",
      });
    }

    const newStudent = await studentService.createStudentService({
      name,
      email,
      password,
      nis,
      points,
      qrCodeMember,
    });

    return res.status(201).json({
      status: "success",
      message: "Data siswa berhasil ditambahkan.",
      data: newStudent,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await studentService.updateStudentService(
      id,
      req.body,
    );

    return res.status(200).json({
      status: "success",
      message: "Data siswa berhasil diperbarui.",
      data: updatedStudent,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await studentService.deleteStudentService(id);

    return res.status(200).json({
      status: "success",
      message: "Data siswa berhasil dihapus.",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const updatePoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { pointsDelta } = req.body;

    if (pointsDelta === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Perubahan poin (pointsDelta) wajib diisi.",
      });
    }

    const result = await studentService.updateStudentPointsService(
      id,
      pointsDelta,
    );

    return res.status(200).json({
      status: "success",
      message: "Poin siswa berhasil diperbarui.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  updatePoints,
};
