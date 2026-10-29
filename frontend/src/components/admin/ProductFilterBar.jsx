// src/components/admin/ProductFilterBar.jsx
import FilterBar from "../ui/FilterBar";

export default function ProductFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = [],
}) {
  const tabs = [
    { label: "Semua", value: "Semua" },
    ...categories.map((cat) => ({ label: cat.name, value: cat.name })),
  ];

  return (
    <FilterBar
      searchPlaceholder="Cari nama produk / Barcode..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      filterTabs={tabs}
      activeTab={selectedCategory}
      onTabChange={setSelectedCategory}
    />
  );
}
