const prisma = require("../config/prisma");

// Helper kalkulasi harga jual berdasarkan HPP & Margin (%)
const calculateSellingPrice = (hpp, margin) => {
  const profit = hpp * (margin / 100);
  return Math.ceil(hpp + profit); // Bulatkan ke atas
};

const getAllProductsService = async (query = {}) => {
  const { search, categoryId, isLowStock } = query;

  const whereCondition = {};

  if (search) {
    whereCondition.OR = [
      { name: { contains: search } },
      { barcode: { contains: search } },
    ];
  }

  if (categoryId) {
    whereCondition.categoryId = categoryId;
  }

  const products = await prisma.product.findMany({
    where: whereCondition,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  if (isLowStock === "true") {
    return products.filter((p) => p.stock <= p.minStock);
  }

  return products;
};

const getProductByIdService = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!product) {
    throw new Error("Produk tidak ditemukan.");
  }

  return product;
};

const createProductService = async (data) => {
  const {
    barcode,
    name,
    categoryId,
    hpp,
    margin = 0,
    stock = 0,
    minStock = 5,
  } = data;

  if (barcode) {
    const existingProduct = await prisma.product.findUnique({
      where: { barcode },
    });
    if (existingProduct) {
      throw new Error("Barcode produk sudah terdaftar.");
    }
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new Error("Kategori tidak ditemukan.");
  }

  const sellingPrice = calculateSellingPrice(Number(hpp), Number(margin));

  const newProduct = await prisma.product.create({
    data: {
      barcode: barcode || null,
      name,
      categoryId,
      hpp: Number(hpp),
      margin: Number(margin),
      sellingPrice,
      stock: Number(stock),
      minStock: Number(minStock),
    },
    include: {
      category: true,
    },
  });

  return newProduct;
};

const updateProductService = async (id, data) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Produk tidak ditemukan.");
  }

  const hpp = data.hpp !== undefined ? Number(data.hpp) : product.hpp;
  const margin =
    data.margin !== undefined ? Number(data.margin) : product.margin;
  const sellingPrice = calculateSellingPrice(hpp, margin);

  // Buang properti unit jika ada yang tidak sengaja mengirim via req.body
  const updateData = { ...data };
  delete updateData.unit;

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...updateData,
      hpp,
      margin,
      sellingPrice,
      stock: data.stock !== undefined ? Number(data.stock) : product.stock,
      minStock:
        data.minStock !== undefined ? Number(data.minStock) : product.minStock,
    },
    include: {
      category: true,
    },
  });

  return updatedProduct;
};

const deleteProductService = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Produk tidak ditemukan.");
  }

  await prisma.product.delete({
    where: { id },
  });

  return { message: "Produk berhasil dihapus." };
};

const getLowStockAlertService = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  return products.filter((p) => p.stock <= p.minStock);
};

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
  getLowStockAlertService,
};
