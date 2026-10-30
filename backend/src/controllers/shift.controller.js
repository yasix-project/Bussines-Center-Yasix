const shiftService = require("../services/shift.service");

const startShift = async (req, res) => {
  try {
    const cashierId = req.user.id;
    const { startCash } = req.body;

    if (startCash === undefined || startCash === null) {
      return res.status(400).json({
        status: "error",
        message: "Kas awal (startCash) wajib diisi.",
      });
    }

    const shift = await shiftService.startShiftService(cashierId, startCash);

    return res.status(201).json({
      status: "success",
      message: "Shift kasir berhasil dibuka.",
      data: shift,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getActiveShift = async (req, res) => {
  try {
    const cashierId = req.user.id;
    const activeShift = await shiftService.getActiveShiftService(cashierId);

    if (!activeShift) {
      return res.status(200).json({
        status: "success",
        message: "Tidak ada shift aktif saat ini.",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      data: activeShift,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const endShift = async (req, res) => {
  try {
    const cashierId = req.user.id;
    // PERUBAHAN: Ambil shiftId dari body
    const { actualCash, shiftId } = req.body;

    if (actualCash === undefined || actualCash === null) {
      return res.status(400).json({
        status: "error",
        message: "Jumlah kas fisik akhir (actualCash) wajib diisi.",
      });
    }

    // PERUBAHAN: Kirim shiftId ke service sebagai parameter ketiga
    const closedShift = await shiftService.endShiftService(
      cashierId,
      actualCash,
      shiftId,
    );

    return res.status(200).json({
      status: "success",
      message: "Shift kasir berhasil ditutup.",
      data: closedShift,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllShifts = async (req, res) => {
  try {
    const shifts = await shiftService.getAllShiftsService();
    return res.status(200).json({
      status: "success",
      data: shifts,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  startShift,
  getActiveShift,
  endShift,
  getAllShifts,
};
