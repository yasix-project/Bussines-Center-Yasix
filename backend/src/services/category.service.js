const prisma = require("../config/prisma");

const getAllCategoriesService = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};

const getCategoryByIdService = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });

  if (!category) {
    throw new Error("Kategori tidak ditemukan.");
  }

  return category;
};

const createCategoryService = async (data) => {
  const { name, type } = data;

  const existingCategory = await prisma.category.findFirst({
    where: { name },
  });

  if (existingCategory) {
    throw new Error('Nama kategori sudah digunakan.');
  }

  // Format type ke uppercase, default ke 'ATK' jika kosong
  const formattedType = type ? type.toUpperCase() : 'ATK';

  const newCategory = await prisma.category.create({
    data: {
      name,
      type: formattedType,
    },
  });

  return newCategory;
};

const updateCategoryService = async (id, data) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Kategori tidak ditemukan.");
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data,
  });

  return updatedCategory;
};

const deleteCategoryService = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    throw new Error("Kategori tidak ditemukan.");
  }

  if (category._count.products > 0) {
    throw new Error(
      "Kategori tidak bisa dihapus karena masih digunakan oleh produk.",
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return { message: "Kategori berhasil dihapus." };
};

module.exports = {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
};
