import axiosClient from "./axiosClient";

export const productService = {
  // GET /api/v1/products
  getAll: (params) => axiosClient.get("/products", { params }),

  // GET /api/v1/products/low-stock
  getLowStock: () => axiosClient.get("/products/low-stock"),

  // POST /api/v1/products
  create: (data) => axiosClient.post("/products", data),

  // PUT /api/v1/products/:id
  update: (id, data) => axiosClient.put(`/products/${id}`, data),

  // DELETE /api/v1/products/:id
  delete: (id) => axiosClient.delete(`/products/${id}`),

  // GET /api/v1/categories
  getCategories: () => axiosClient.get("/categories"),

  // POST /api/v1/categories
  createCategory: (data) => axiosClient.post("/categories", data),
};
