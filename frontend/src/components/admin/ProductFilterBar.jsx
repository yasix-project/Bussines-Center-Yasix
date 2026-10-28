// src/components/admin/ProductFilterBar.jsx
import { Search } from "lucide-react";

export default function ProductFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = [],
}) {
  return (
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
  );
}
