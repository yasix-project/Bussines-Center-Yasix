const transactionService = require("../services/transaction.service");

const createTransaction = async (req, res) => {
  try {
    const cashierId = req.user.id;
    const transaction = await transactionService.createTransactionService(
      cashierId,
      req.body,
    );

    return res.status(201).json({
      status: "success",
      message: "Transaksi berhasil diproses.",
      data: transaction,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactionsService();
    return res.status(200).json({
      status: "success",
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionByIdService(
      req.params.id,
    );
    return res.status(200).json({
      status: "success",
      data: transaction,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
};
