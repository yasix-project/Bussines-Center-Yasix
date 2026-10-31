import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

// Validasi Zod diperbarui untuk menangkap "type"
const categorySchema = z.object({
  name: z.string().min(3, { message: "Nama kategori minimal 3 karakter." }),
  description: z.string().optional(),
  type: z.enum([
    "ATK",
    "JASA_PRINT",
    "KIK_PRODUCT",
    "KEBUTUHAN_SISWA",
    "LAINNYA",
  ]),
});

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSubmitData,
  initialData = null,
  selectedType = "LAINNYA", // Terima tipe dari Modal 1
  isSubmitting = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        type: initialData.type || "LAINNYA",
      });
    } else {
      reset({
        name: "",
        description: "",
        type: selectedType, // Gunakan tipe yang dipilih dari modal sebelumnya
      });
    }
  }, [initialData, reset, isOpen, selectedType]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Kategori" : "Detail Kategori Baru"}
    >
      <form onSubmit={handleSubmit(onSubmitData)} className="space-y-4">
        {/* Tampilan Tipe Kategori Terpilih (Read-only) */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-500">
            Tipe Kategori:
          </span>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
            {initialData ? initialData.type : selectedType}
          </span>
          {/* Input hidden untuk mengirim value type ke handleSubmit */}
          <input type="hidden" {...register("type")} />
        </div>

        <Input
          id="name"
          label="Nama Kategori"
          placeholder="Contoh: Alat Tulis Kantor"
          {...register("name")}
          error={errors.name?.message}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-xs font-semibold text-slate-700"
          >
            Deskripsi (Opsional)
          </label>
          <textarea
            id="description"
            rows="3"
            placeholder="Tambahkan keterangan kategori..."
            {...register("description")}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={isFormSubmitting || isSubmitting}
          >
            Simpan Kategori
          </Button>
        </div>
      </form>
    </Modal>
  );
}
