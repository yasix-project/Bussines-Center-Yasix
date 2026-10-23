const analyticsService = require("../services/analytics.service");

const getDashboardMetrics = async (req, res) => {
  try {
    const metrics = await analyticsService.getDashboardMetricsService();
    return res.status(200).json({ status: "success", data: metrics });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await analyticsService.getSalesReportService(
      startDate,
      endDate,
    );
    return res.status(200).json({ status: "success", data: report });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { getDashboardMetrics, getSalesReport };
