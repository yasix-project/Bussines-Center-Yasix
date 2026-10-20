const categoryService = require("../services/category.service");

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategoriesService();
    return res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryByIdService(id);
    return res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Nama kategori wajib diisi.",
      });
    }

    const category = await categoryService.createCategoryService(req.body);
    return res.status(201).json({
      status: "success",
      message: "Kategori berhasil ditambahkan.",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryService.updateCategoryService(
      id,
      req.body,
    );

    return res.status(200).json({
      status: "success",
      message: "Kategori berhasil diperbarui.",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategoryService(id);

    return res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
