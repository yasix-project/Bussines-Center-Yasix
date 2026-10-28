// src/utils/formatters.js

export const formatRupiah = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const exportProductsToCSV = (products, selectedIds = []) => {
  const dataToExport = products.filter(
    (p) => selectedIds.length === 0 || selectedIds.includes(p.id),
  );
  const headers = [
    "ID,Barcode,Nama,Kategori,HPP,Margin,HargaJual,Stok,StatusProduk\n",
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
