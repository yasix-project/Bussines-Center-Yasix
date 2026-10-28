// src/pages/admin/KelolaProduk.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Download,
  Package,
  Boxes,
  AlertTriangle,
  PackageCheck,
} from "lucide-react";

import Button from "../../components/ui/Button";
import StatCard from "../../components/admin/StatCard";
import ProductFormModal from "../../components/admin/ProductFormModal";
import ProductFilterBar from "../../components/admin/ProductFilterBar";
import ProductTable from "../../components/admin/ProductTable";
import FloatingBulkBar from "../../components/admin/FloatingBulkBar";

import { productService } from "../../api/productService";
import { formatRupiah, exportProductsToCSV } from "../../utils/formatters";

export default function KelolaProduk() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // 1. Queries
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productService.getAll();
      return Array.isArray(response.data?.data)
        ? response.data.data
        : response.data || [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await productService.getCategories();
      return Array.isArray(response.data?.data)
        ? response.data.data
        : response.data || [];
    },
  });

  // 2. Mutations
  const saveProductMutation = useMutation({
    mutationFn: (formData) =>
      editingProduct
        ? productService.update(editingProduct.id, formData)
        : productService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      setEditingProduct(null);
    },
    onError: (err) =>
      alert(err.response?.data?.message || "Gagal menyimpan data produk."),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (product) =>
      productService.update(product.id, {
        isActive: product.isActive === false,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    onError: (err) =>
      alert(err.response?.data?.message || "Gagal mengubah status produk."),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => productService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    },
    onError: () => alert("Gagal menghapus produk dari database."),
  });

  const bulkDeactivateMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(
        ids.map((id) => productService.update(id, { isActive: false })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedIds([]);
    },
    onError: () => alert("Gagal menonaktifkan beberapa produk."),
  });

  // Mutation Aktifkan Massal
  const bulkActivateMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(
        ids.map((id) => productService.update(id, { isActive: true })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedIds([]);
    },
    onError: () => alert("Gagal mengaktifkan beberapa produk."),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => productService.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedIds([]);
    },
    onError: () => alert("Sebagian atau seluruh produk gagal dihapus."),
  });

  // 3. Action Handlers
  const handleToggleActive = (product) => {
    const actionText =
      product.isActive !== false ? "menonaktifkan" : "mengaktifkan kembali";
    if (
      window.confirm(
        `Apakah Anda yakin ingin ${actionText} produk "${product.name}"?`,
      )
    ) {
      toggleActiveMutation.mutate(product);
    }
  };

  const handleBulkDeactivate = () => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menonaktifkan ${selectedIds.length} produk terpilih?`,
      )
    ) {
      bulkDeactivateMutation.mutate(selectedIds);
    }
  };

  const handleBulkActivate = () => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin mengaktifkan kembali ${selectedIds.length} produk terpilih?`,
      )
    ) {
      bulkActivateMutation.mutate(selectedIds);
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus ${selectedIds.length} produk terpilih?`,
      )
    ) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  // 4. Selection & Dynamic Status Check
  const filteredProducts = products.filter((item) => {
    const categoryName = item.category?.name || item.category || "";
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode?.includes(searchQuery);
    const matchesCategory =
      selectedCategory === "Semua" || categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.includes(p.id));

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? filteredProducts.map((p) => p.id) : []);
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Kalkulasi apakah SEMUA produk yang dicentang berstatus NONAKTIF
  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
  const areAllInactive =
    selectedProducts.length > 0 &&
    selectedProducts.every((p) => p.isActive === false);

  // Metriks
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce(
    (acc, item) => acc + Number(item.hpp || 0) * Number(item.stock || 0),
    0,
  );
  const lowStockCount = products.filter(
    (item) => item.stock <= (item.minStock ?? 10),
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark tracking-tight">
            Kelola Inventaris & Produk
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen stok, kalkulasi margin, dan pemantauan aset Business
            Center Yasix
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportProductsToCSV(products, selectedIds)}
          >
            <Download size={15} className="text-slate-500" /> Export CSV
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} /> Tambah Produk Baru
          </Button>
        </div>
      </div>

      {/* Reusable Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Varian"
          value={totalProducts}
          icon={Package}
          trendLabel="Produk Terdaftar"
        />
        <StatCard
          title="Nilai Aset Modal"
          value={formatRupiah(totalInventoryValue)}
          icon={Boxes}
          trendLabel="Berdasarkan HPP x Stok"
        />
        <StatCard
          title="Stok Kritis"
          value={lowStockCount}
          icon={AlertTriangle}
          trendLabel={
            lowStockCount > 0 ? "Perlu Restock Segera" : "Semua Stok Aman"
          }
        />
        <StatCard
          title="Kategori Terdata"
          value={categories.length}
          icon={PackageCheck}
          trendLabel="Sektor Barang"
        />
      </div>

      {/* Filter Bar */}
      <ProductFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Table */}
      <ProductTable
        products={filteredProducts}
        isLoading={isLoading}
        isError={isError}
        error={error}
        selectedIds={selectedIds}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onToggleActive={handleToggleActive}
        onEdit={(p) => {
          setEditingProduct(p);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteProduct}
      />

      {/* Floating Bulk Action Bar */}
      <FloatingBulkBar
        selectedCount={selectedIds.length}
        areAllInactive={areAllInactive}
        onExport={() => exportProductsToCSV(products, selectedIds)}
        onDeactivate={handleBulkDeactivate}
        onActivate={handleBulkActivate}
        onDelete={handleBulkDelete}
        onClear={() => setSelectedIds([])}
        isDeactivating={bulkDeactivateMutation.isPending}
        isActivating={bulkActivateMutation.isPending}
        isDeleting={bulkDeleteMutation.isPending}
      />

      {/* Modal Form */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitData={(formData) => saveProductMutation.mutate(formData)}
        initialData={editingProduct}
      />
    </div>
  );
}
