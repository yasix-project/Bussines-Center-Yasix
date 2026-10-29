// src/components/ui/FilterBar.jsx
import { Search } from "lucide-react";

export default function FilterBar({
  searchPlaceholder = "Cari...",
  searchValue,
  onSearchChange,
  filterTabs = [], // Format: [{ label: "Semua", value: "all" }, ...]
  activeTab,
  onTabChange,
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
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
        />
      </div>

      {filterTabs.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.value
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
