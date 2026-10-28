import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  PackageCheck,
  AlertTriangle,
  Loader2,
  Package,
  Boxes,
  TrendingUp,
  Download,
  X,
  Image as ImageIcon,
  Power,
  Ban,
} from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ProductFormModal from "../../components/admin/ProductFormModal";
import { productService } from "../../api/productService";

// Helper Format Rupiah
const formatRupiah = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

// Helper Format Tanggal
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function KelolaProduk() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // State untuk Multi-Select Checkbox
  const [selectedIds, setSelectedIds] = useState([]);

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // 1. Query: Fetch Produk
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

  // 2. Query: Fetch Kategori untuk Filter Bar
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await productService.getCategories();
      return Array.isArray(response.data?.data)
        ? response.data.data
        : response.data || [];
    },
  });

  // 3. Mutation: Save (Create/Update)
  const saveProductMutation = useMutation({
    mutationFn: async (formData) => {
      if (editingProduct) {
        return await productService.update(editingProduct.id, formData);
      }
      return await productService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      setEditingProduct(null);
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Gagal menyimpan data produk.");
    },
  });

  // 4. Mutation: Single Toggle Status Aktif/Nonaktif
  const toggleActiveMutation = useMutation({
    mutationFn: async (product) => {
      const nextStatus = product.isActive === false ? true : false;
      return await productService.update(product.id, {
        isActive: nextStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Gagal mengubah status produk.");
    },
  });

  // 5. Mutation: Single Delete
  const deleteProductMutation = useMutation({
    mutationFn: (id) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    },
    onError: () => {
      alert("Gagal menghapus produk dari database.");
    },
  });

  // 6. Mutation: Bulk Nonaktifkan Produk via PUT Update
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
    onError: () => {
      alert("Gagal menonaktifkan beberapa produk.");
    },
  });

  // 7. Mutation: Bulk Delete
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => productService.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedIds([]);
    },
    onError: () => {
      alert("Sebagian atau seluruh produk gagal dihapus.");
    },
  });

  // Action Handlers
  const handleToggleActive = (product) => {
    const isCurrentlyActive = product.isActive !== false;
    const actionText = isCurrentlyActive
      ? "menonaktifkan"
      : "mengaktifkan kembali";
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const dataToExport = products.filter(
      (p) => selectedIds.length === 0 || selectedIds.includes(p.id),
    );
    const headers = [
      "ID,Barcode,Nama,Kategori,HPP,Margin,HargaJual,Stok,Status\n",
    ];
    const rows = dataToExport.map(
      (p) =>
        `"${p.id}","${p.barcode}","${p.name}","${p.category?.name || p.category || ""}","${p.hpp}","${p.margin}","${p.sellingPrice}","${p.stock}","${p.isActive !== false ? "Aktif" : "Nonaktif"}"\n`,
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bc-yasix-products-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Calculated Stats
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce(
    (acc, item) => acc + Number(item.hpp || 0) * Number(item.stock || 0),
    0,
  );
  const lowStockCount = products.filter(
    (item) => item.stock <= (item.minStock ?? 10),
  ).length;
  const totalCategoriesCount = categories.length;

  // Filter Lokal
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Utama */}
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
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white text-slate-700 border border-slate-200/80 rounded-lg hover:bg-slate-50 transition-all shadow-xs"
          >
            <Download size={15} className="text-slate-500" /> Export CSV
          </button>

          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="shadow-xs rounded-lg text-xs"
          >
            <Plus size={16} /> Tambah Produk Baru
          </Button>
        </div>
      </div>

      {/* 4 Mini Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Varian
            </p>
            <h3 className="text-2xl font-bold text-dark font-mono mt-1">
              {totalProducts}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Produk Terdaftar
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Package size={20} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Nilai Aset Modal
            </p>
            <h3 className="text-xl font-bold text-dark font-mono mt-1">
              {formatRupiah(totalInventoryValue)}
            </h3>
            <p className="text-[10px] text-success font-medium mt-0.5 flex items-center gap-1">
              <TrendingUp size={11} /> Berdasarkan HPP x Stok
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-success flex items-center justify-center shrink-0 border border-emerald-100">
            <Boxes size={20} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Stok Kritis
            </p>
            <h3
              className={`text-2xl font-bold ${lowStockCount > 0 ? "text-danger" : "text-success"} font-mono mt-1`}
            >
              {lowStockCount}
            </h3>
            <p
              className={`text-[10px] ${lowStockCount > 0 ? "text-danger" : "text-success"} font-medium mt-0.5`}
            >
              {lowStockCount > 0 ? "Perlu Restock Segera" : "Semua Stok Aman"}
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-lg ${lowStockCount > 0 ? "bg-danger/10" : "bg-success/10"} ${lowStockCount > 0 ? "text-danger" : "text-success"} flex items-center justify-center shrink-0`}
          >
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Kategori Terdata
            </p>
            <h3 className="text-2xl font-bold text-dark font-mono mt-1">
              {totalCategoriesCount}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Sektor Barang</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <PackageCheck size={20} />
          </div>
        </div>
      </div>

      {/* Bar Filter & Search */}
      <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Cari nama produk / Barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory("Semua")}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "Semua"
                ? "bg-primary text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel Data Produk */}
      <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-400 gap-2">
            <Loader2 className="animate-spin" size={18} />
            <span className="text-xs font-medium">Memuat data produk...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-danger text-xs font-medium">
            {error?.message || "Gagal mengambil data produk dari server."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-800 text-slate-200 font-semibold border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="rounded border-slate-600 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">Informasi Produk</th>
                  <th className="px-4 py-3">Kategori & Dibuat</th>
                  <th className="px-4 py-3">HPP (Modal)</th>
                  <th className="px-4 py-3 text-center">Margin</th>
                  <th className="px-4 py-3">Harga Jual</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3">Status Stok</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stock <= (p.minStock ?? 10);
                  const isInactive = p.isActive === false;
                  const categoryName = p.category?.name || p.category || "-";
                  const isSelected = selectedIds.includes(p.id);

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isInactive
                          ? "bg-slate-50 opacity-60"
                          : isSelected
                            ? "bg-blue-50/50"
                            : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Checkbox Single Row */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(p.id)}
                          className="rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                        />
                      </td>

                      {/* Thumbnail Image + Product Info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon size={18} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-dark text-xs">
                                {p.name}
                              </p>
                              {isInactive && (
                                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-slate-200 text-slate-600 rounded">
                                  NONAKTIF
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Barcode: {p.barcode}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Kategori & Tanggal */}
                      <td className="px-4 py-3">
                        <div>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-semibold border border-slate-200/60">
                            {categoryName}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono mt-1">
                            {formatDate(p.createdAt)}
                          </p>
                        </div>
                      </td>

                      {/* HPP */}
                      <td className="px-4 py-3 font-mono text-slate-500 font-medium">
                        {formatRupiah(p.hpp)}
                      </td>

                      {/* Margin (%) */}
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono font-semibold text-[11px] text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded">
                          {p.margin}%
                        </span>
                      </td>

                      {/* Selling Price */}
                      <td className="px-4 py-3 font-mono font-bold text-dark">
                        {formatRupiah(p.sellingPrice)}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        {p.stock}
                      </td>

                      {/* Status Stock */}
                      <td className="px-4 py-3">
                        {isLowStock ? (
                          <Badge
                            variant="danger"
                            className="gap-1 rounded text-[10px]"
                          >
                            <AlertTriangle size={11} /> Menipis
                          </Badge>
                        ) : (
                          <Badge
                            variant="success"
                            className="gap-1 rounded text-[10px]"
                          >
                            <PackageCheck size={11} /> Aman
                          </Badge>
                        )}
                      </td>

                      {/* Aksi Single Row */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {/* Tombol Toggle Aktif/Nonaktif */}
                          <button
                            onClick={() => handleToggleActive(p)}
                            disabled={toggleActiveMutation.isPending}
                            className={`p-1.5 rounded transition-colors ${
                              p.isActive === false
                                ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                                : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                            }`}
                            title={
                              p.isActive === false
                                ? "Aktifkan Produk"
                                : "Nonaktifkan Produk"
                            }
                          >
                            <Power size={15} />
                          </button>

                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                            title="Edit Produk"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger/10 rounded transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-10 text-slate-400 font-medium text-xs"
                    >
                      Tidak ada produk yang sesuai dengan kriteria pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FLOATING BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-dark text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-5 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
            <span className="w-6 h-6 rounded-full bg-accent text-dark font-mono font-bold text-xs flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-semibold text-slate-200">
              Produk Terpilih
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              <Download size={14} /> Export CSV
            </button>

            {/* Tombol Nonaktifkan Massal */}
            <button
              onClick={handleBulkDeactivate}
              disabled={bulkDeactivateMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {bulkDeactivateMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Ban size={14} />
              )}
              Nonaktifkan Terpilih
            </button>

            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-danger hover:bg-red-600 text-white rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {bulkDeleteMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Hapus Massal
            </button>
          </div>

          <button
            onClick={() => setSelectedIds([])}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
            title="Batal Pilih"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Modal Form Product */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitData={(formData) => saveProductMutation.mutate(formData)}
        initialData={editingProduct}
      />
    </div>
  );
}
