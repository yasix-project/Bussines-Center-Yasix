// src/components/ui/Table.jsx
import { Loader2 } from "lucide-react";

export default function Table({
  columns = [],
  data = [],
  keyField = "id",
  isLoading,
  isError,
  errorMessage = "Gagal mengambil data dari server.",
  emptyMessage = "Tidak ada data.",
  selectedIds = [],
  onSelectAll,
  onSelectRow,
  rowClassName, // Fungsi (row) => string untuk custom class per baris
}) {
  const isAllSelected =
    data.length > 0 &&
    data.every((item) => selectedIds.includes(item[keyField]));

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-12 flex items-center justify-center text-slate-400 gap-2">
        <Loader2 className="animate-spin" size={18} />
        <span className="text-xs font-medium">Memuat data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-8 text-center text-danger text-xs font-medium">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-800 text-slate-200 font-semibold border-b border-slate-700">
            <tr>
              {onSelectAll && onSelectRow && (
                <th className="px-4 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onSelectAll}
                    className="rounded border-slate-600 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col, index) => (
                <th key={index} className={`px-4 py-3 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-sans">
            {data.map((row) => {
              const isSelected = selectedIds.includes(row[keyField]);
              const customClass = rowClassName ? rowClassName(row) : "";

              return (
                <tr
                  key={row[keyField]}
                  className={`transition-colors ${
                    isSelected ? "bg-blue-50/50" : "hover:bg-slate-50/80"
                  } ${customClass}`}
                >
                  {onSelectAll && onSelectRow && (
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow(row[keyField])}
                        className="rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col, index) => (
                    <td
                      key={index}
                      className={`px-4 py-3 ${col.cellClassName || ""}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              );
            })}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (onSelectAll ? 1 : 0)}
                  className="text-center py-10 text-slate-400 font-medium text-xs"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
