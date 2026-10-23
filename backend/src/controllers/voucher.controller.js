const voucherService = require("../services/voucher.service");

const validateVoucher = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const result = await voucherService.validateVoucherService(code, subtotal);
    return res.status(200).json({ status: "success", data: result });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

const createVoucher = async (req, res) => {
  try {
    const result = await voucherService.createVoucherService(req.body);
    return res
      .status(201)
      .json({
        status: "success",
        message: "Voucher berhasil dibuat.",
        data: result,
      });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = { validateVoucher, createVoucher };
