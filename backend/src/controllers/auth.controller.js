const authService = require("../services/auth.service");

const login = async (req, res) => {
  //[cite: 6]
  try {
    const { email, password } = req.body; //[cite: 6]
    const ipAddress =
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!email || !password) {
      //[cite: 6]
      return res.status(400).json({
        //[cite: 6]
        status: "error", //[cite: 6]
        message: "Email dan password wajib diisi.", //[cite: 6]
      });
    }

    const result = await authService.loginService(email, password, ipAddress); //[cite: 6]
    return res.status(200).json({
      //[cite: 6]
      status: "success", //[cite: 6]
      message: "Login berhasil.", //[cite: 6]
      data: result, //[cite: 6]
    });
  } catch (error) {
    //[cite: 6]
    return res.status(401).json({
      // Gunakan 401 Unauthorized untuk gagal login
      status: "error", //[cite: 6]
      message: error.message, //[cite: 6]
    });
  }
};

// --- CONTROLLER LOGIN KHUSUS ADMIN ---
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress =
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email dan password wajib diisi.",
      });
    }

    const result = await authService.loginAdminService(
      email,
      password,
      ipAddress,
      userAgent,
    );
    return res.status(200).json({
      status: "success",
      message: "Login Admin berhasil.",
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: error.message,
    });
  }
};

const registerSiswa = async (req, res) => {
  try {
    const { nis, name, email, password } = req.body;

    if (!nis || !name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "NIS, nama, email, dan password wajib diisi.",
      });
    }

    const result = await authService.registerSiswaService({
      nis,
      name,
      email,
      password,
    });
    return res.status(201).json({
      status: "success",
      message: "Pendaftaran siswa berhasil.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    status: "success",
    data: req.user,
  });
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Diambil otomatis dari token via verifyToken middleware
    const updatedUser = await authService.updateProfileService(
      userId,
      req.body,
    );

    return res.status(200).json({
      status: "success",
      message: "Profil berhasil diperbarui.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message || "Gagal memperbarui profil.",
    });
  }
};

module.exports = {
  login,
  loginAdmin,
  registerSiswa,
  updateProfile,
  getMe,
};
