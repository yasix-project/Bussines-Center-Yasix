import { useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  PackageCheck,
  AlertTriangle,
} from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ProductFormModal from "../../components/admin/ProductFormModal";

// Dummy Data Awal Produk BC Yasix
const initialProducts = [
  {
    id: "1",
    sku: "899275372101",
    name: "Teh Pucuk Harum 350ml",
    category: "Minuman",
    priceBuy: 2800,
    priceSell: 4000,
    stock: 48,
  },
  {
    id: "2",
    sku: "899600130122",
    name: "Chitato Sapi Panggang 68g",
    category: "Makanan ringan",
    priceBuy: 8500,
    priceSell: 11000,
    stock: 12,
  },
  {
    id: "3",
    sku: "899300511002",
    name: "Buku Tulis Sidu 38 Lembar",
    category: "ATK & Alat Tulis",
    priceBuy: 3200,
    priceSell: 4500,
    stock: 3,
  },
  {
    id: "4",
    sku: "YDK-MCH-001",
    name: "Lanyard Logo SMK Yadika 6",
    category: "Merchandise",
    priceBuy: 12000,
    priceSell: 20000,
    stock: 25,
  },
];

const formatRupiah = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val);

export default function KelolaProduk() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filter Data
  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.includes(searchQuery);
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveProduct = async (data) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data } : p)),
      );
    } else {
      const newProduct = { id: Date.now().toString(), ...data };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Tombol Aksi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark tracking-tight">
            Kelola Produk
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen inventaris, stok, dan harga jual Business Center
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="shadow-sm"
        >
          <Plus size={18} /> Tambah Produk Baru
        </Button>
      </div>

      {/* Bar Filter & Pencarian */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama produk / SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Tab Filter Kategori */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            "Semua",
            "Makanan ringan",
            "Minuman",
            "ATK & Alat Tulis",
            "Merchandise",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel Data Produk */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Informasi Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga Beli</th>
                <th className="px-6 py-4">Harga Jual</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const isLowStock = p.stock <= 5;
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-dark">{p.name}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          SKU: {p.sku}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {p.category}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {formatRupiah(p.priceBuy)}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-dark">
                      {formatRupiah(p.priceSell)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-700">
                          {p.stock}
                        </span>
                        {isLowStock ? (
                          <Badge variant="danger" className="gap-1">
                            <AlertTriangle size={12} /> Menipis
                          </Badge>
                        ) : (
                          <Badge variant="success" className="gap-1">
                            <PackageCheck size={12} /> Aman
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit Produk"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-slate-400 font-medium text-xs"
                  >
                    Tidak ada produk yang sesuai dengan pencarian/kategori.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitData={handleSaveProduct}
        initialData={editingProduct}
      />
    </div>
  );
}
