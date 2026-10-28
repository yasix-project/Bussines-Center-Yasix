import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

const productSchema = z.object({
  name: z.string().min(3, { message: "Nama produk minimal 3 karakter." }),
  category: z.string().min(1, { message: "Pilih kategori produk." }),
  sku: z.string().min(3, { message: "Kode Barcode / SKU wajib diisi." }),
  priceBuy: z.coerce.number().min(100, { message: "Harga beli tidak valid." }),
  priceSell: z.coerce.number().min(100, { message: "Harga jual tidak valid." }),
  stock: z.coerce.number().min(0, { message: "Stok tidak boleh negatif." }),
});

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmitData,
  initialData = null,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        category: "Makanan ringan",
        sku: "",
        priceBuy: "",
        priceSell: "",
        stock: "",
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = async (data) => {
    await onSubmitData(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Data Produk" : "Tambah Produk Baru"}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          id="name"
          label="Nama Produk"
          placeholder="Contoh: Pulpy Orange 300ml"
          {...register("name")}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="category"
              className="text-sm font-semibold text-slate-700"
            >
              Kategori
            </label>
            <select
              id="category"
              {...register("category")}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-sm font-medium"
            >
              <option value="Makanan ringan">Makanan Ringan</option>
              <option value="Minuman">Minuman</option>
              <option value="ATK & Alat Tulis">ATK & Alat Tulis</option>
              <option value="Merchandise">Merchandise Yadika</option>
            </select>
          </div>

          <Input
            id="sku"
            label="Kode SKU / Barcode"
            placeholder="8991234567"
            {...register("sku")}
            error={errors.sku?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="priceBuy"
            type="number"
            label="Harga Beli (Modal)"
            placeholder="3000"
            {...register("priceBuy")}
            error={errors.priceBuy?.message}
          />

          <Input
            id="priceSell"
            type="number"
            label="Harga Jual"
            placeholder="5000"
            {...register("priceSell")}
            error={errors.priceSell?.message}
          />
        </div>

        <Input
          id="stock"
          type="number"
          label="Jumlah Stok"
          placeholder="50"
          {...register("stock")}
          error={errors.stock?.message}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? "Simpan Perubahan" : "Tambah Produk"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
