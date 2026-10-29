import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Layers, Printer, Briefcase, ShoppingBag, Grid } from "lucide-react";

export default function CategoryTypeModal({ isOpen, onClose, onSelectType }) {
  const [selectedType, setSelectedType] = useState("");

  const categoryTypes = [
    {
      value: "ATK",
      label: "Alat Tulis Kantor",
      description: "Buku, pulpen, kertas, dan perlengkapan sekolah.",
      icon: <Layers size={20} className="text-blue-500" />,
      color:
        "border-blue-200 bg-blue-50/50 hover:border-blue-300 hover:bg-blue-50",
    },
    {
      value: "JASA_PRINT",
      label: "Jasa Print / Cetak",
      description: "Layanan cetak dokumen hitam putih atau warna.",
      icon: <Printer size={20} className="text-emerald-500" />,
      color:
        "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-50",
    },
    {
      value: "KIK_PRODUCT",
      label: "Produk KIK",
      description: "Hasil karya atau produk wirausaha siswa (KIK).",
      icon: <Briefcase size={20} className="text-amber-500" />,
      color:
        "border-amber-200 bg-amber-50/50 hover:border-amber-300 hover:bg-amber-50",
    },
    {
      value: "KEBUTUHAN_SISWA",
      label: "Kebutuhan Siswa",
      description: "Atribut sekolah, seragam, atau kelengkapan lainnya.",
      icon: <ShoppingBag size={20} className="text-indigo-500" />,
      color:
        "border-indigo-200 bg-indigo-50/50 hover:border-indigo-300 hover:bg-indigo-50",
    },
    {
      value: "LAINNYA",
      label: "Lainnya",
      description: "Kategori produk umum yang tidak termasuk di atas.",
      icon: <Grid size={20} className="text-slate-500" />,
      color:
        "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50",
    },
  ];

  const handleSelect = (value) => {
    setSelectedType(value);
  };

  const handleConfirm = () => {
    if (selectedType) {
      onSelectType(selectedType);
      setSelectedType("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pilih Tipe Kategori"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Tentukan tipe dasar untuk kategori ini. Tipe ini akan menentukan
          bagaimana produk di dalam kategori ini diproses di kasir (misal: Jasa
          Print memiliki form khusus).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
          {categoryTypes.map((type) => {
            const isSelected = selectedType === type.value;
            return (
              <div
                key={type.value}
                onClick={() => handleSelect(type.value)}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex flex-col gap-2 relative ${
                  isSelected
                    ? `ring-2 ring-primary border-primary bg-primary/5`
                    : type.color
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-white shadow-sm border ${isSelected ? "border-primary/20" : "border-slate-200"}`}
                  >
                    {type.icon}
                  </div>
                  <h3
                    className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-slate-700"}`}
                  >
                    {type.label}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 ml-1 leading-relaxed">
                  {type.description}
                </p>

                {/* Indikator Terpilih (Dot) */}
                {isSelected && (
                  <div className="absolute top-4 right-4 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-4">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={!selectedType}
          >
            Lanjutkan
          </Button>
        </div>
      </div>
    </Modal>
  );
}
