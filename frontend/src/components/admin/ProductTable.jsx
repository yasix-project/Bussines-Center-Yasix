// src/components/admin/ProductTable.jsx
import {
  Edit3,
  Trash2,
  PackageCheck,
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
  Power,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Badge from "../ui/Badge";
import { formatRupiah, formatDate } from "../../utils/formatters";

export default function ProductTable({
  products = [],
  isLoading,
  isError,
  error,
  selectedIds = [],
  isAllSelected,
  onSelectAll,
  onSelectRow,
  onToggleActive,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-12 flex items-center justify-center text-slate-400 gap-2">
        <Loader2 className="animate-spin" size={18} />
        <span className="text-xs font-medium">Memuat data produk...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-8 text-center text-danger text-xs font-medium">
        {error?.message || "Gagal mengambil data produk dari server."}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-800 text-slate-200 font-semibold border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-center w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="rounded border-slate-600 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                />
              </th>
              <th className="px-4 py-3">Informasi Produk</th>
              <th className="px-4 py-3">Kategori & Dibuat</th>
              <th className="px-4 py-3">HPP (Modal)</th>
              <th className="px-4 py-3 text-center">Margin</th>
              <th className="px-4 py-3">Harga Jual</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3">Status Sistem</th>
              <th className="px-4 py-3">Status Stok</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-sans">
            {products.map((p) => {
              const isLowStock = p.stock <= (p.minStock ?? 10);
              const isInactive = p.isActive === false;
              const categoryName = p.category?.name || p.category || "-";
              const isSelected = selectedIds.includes(p.id);

              return (
                <tr
                  key={p.id}
                  className={`transition-colors ${
                    isInactive
                      ? "bg-slate-50/80 opacity-70"
                      : isSelected
                        ? "bg-blue-50/50"
                        : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectRow(p.id)}
                      className="rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                        {p.imageUrl ? (
                          <img
                            src={
                              p.imageUrl.startsWith("http")
                                ? p.imageUrl
                                : `http://localhost:5000${p.imageUrl}`
                            }
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-dark text-xs">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Barcode: {p.barcode}
                        </p>
                      </div>
                    </div>
                  </td>

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

                  <td className="px-4 py-3 font-mono text-slate-500 font-medium">
                    {formatRupiah(p.hpp)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className="font-mono font-semibold text-[11px] text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded">
                      {p.margin}%
                    </span>
                  </td>

                  <td className="px-4 py-3 font-mono font-bold text-dark">
                    {formatRupiah(p.sellingPrice)}
                  </td>

                  <td className="px-4 py-3 font-mono font-bold text-slate-700">
                    {p.stock}
                  </td>

                  <td className="px-4 py-3">
                    {isInactive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                        <XCircle size={11} className="text-slate-500" />{" "}
                        Nonaktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 size={11} className="text-emerald-600" />{" "}
                        Aktif
                      </span>
                    )}
                  </td>

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

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onToggleActive(p)}
                        className={`p-1.5 rounded transition-colors ${
                          isInactive
                            ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                            : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                        }`}
                        title={
                          isInactive ? "Aktifkan Produk" : "Nonaktifkan Produk"
                        }
                      >
                        <Power size={15} />
                      </button>

                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Edit Produk"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        onClick={() => onDelete(p.id)}
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

            {products.length === 0 && (
              <tr>
                <td
                  colSpan="10"
                  className="text-center py-10 text-slate-400 font-medium text-xs"
                >
                  Tidak ada produk yang sesuai dengan kriteria pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
