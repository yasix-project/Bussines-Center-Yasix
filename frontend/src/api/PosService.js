import axiosClient from "./axiosClient";

export const posService = {
  // Shifts
  startShift: (data) => axiosClient.post("/shifts/start", data),
  getActiveShift: () => axiosClient.get("/shifts/active"),
  endShift: (data) => axiosClient.post("/shifts/end", data),
  getShiftsHistory: () => axiosClient.get("/shifts"),

  // Transactions
  checkout: (transactionData) =>
    axiosClient.post("/transactions/checkout", transactionData),
  getTransactions: (params) => axiosClient.get("/transactions", { params }),
  getTransactionDetail: (id) => axiosClient.get(`/transactions/${id}`),

  // Vouchers
  validateVoucher: (code) => axiosClient.post("/vouchers/validate", { code }),
};
