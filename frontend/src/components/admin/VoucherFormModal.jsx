import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

const voucherSchema = z.object({
  code: z
    .string()
    .min(3, { message: "Kode voucher minimal 3 karakter." })
    .toUpperCase(),
  discountPct: z.coerce
    .number()
    .min(1, "Diskon minimal 1%")
    .max(100, "Maksimal 100%"),
  maxDiscount: z.coerce
    .number()
    .min(0, "Maksimal diskon tidak valid.")
    .optional(),
  minPurchase: z.coerce.number().min(0, "Minimal belanja tidak boleh negatif."),
  validUntil: z.string().min(1, "Batas waktu kedaluwarsa wajib diisi."),
});

export default function VoucherFormModal({
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
    resolver: zodResolver(voucherSchema),
  });

  useEffect(() => {
    if (initialData) {
      // Format tanggal dari ISO string ke format YYYY-MM-DDTHH:mm untuk input html datetime-local
      const formattedDate = initialData.validUntil
        ? new Date(initialData.validUntil).toISOString().slice(0, 16)
        : "";

      reset({
        code: initialData.code || "",
        discountPct: initialData.discountPct || "",
        maxDiscount: initialData.maxDiscount || 0,
        minPurchase: initialData.minPurchase || 0,
        validUntil: formattedDate,
      });
    } else {
      reset({
        code: "",
        discountPct: "",
        maxDiscount: 0,
        minPurchase: 0,
        validUntil: "",
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data) => {
    // Konversi kembali format datetime-local ke format ISO untuk Backend (Prisma)
    const payload = {
      ...data,
      validUntil: new Date(data.validUntil).toISOString(),
    };
    onSubmitData(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Voucher Promo" : "Buat Voucher Baru"}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          id="code"
          label="Kode Voucher"
          placeholder="Contoh: YASIX20"
          {...register("code")}
          error={errors.code?.message}
          className="uppercase font-mono font-bold"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="discountPct"
            type="number"
            label="Diskon (%)"
            placeholder="20"
            {...register("discountPct")}
            error={errors.discountPct?.message}
          />
          <Input
            id="maxDiscount"
            type="number"
            label="Maksimal Potongan (Rp)"
            placeholder="10000"
            {...register("maxDiscount")}
            error={errors.maxDiscount?.message}
          />
        </div>

        <Input
          id="minPurchase"
          type="number"
          label="Minimal Belanja (Rp)"
          placeholder="50000"
          {...register("minPurchase")}
          error={errors.minPurchase?.message}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="validUntil"
            className="text-xs font-semibold text-slate-700"
          >
            Masa Berlaku Hingga
          </label>
          <input
            id="validUntil"
            type="datetime-local"
            {...register("validUntil")}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {errors.validUntil && (
            <span className="text-xs font-medium text-red-500 mt-0.5">
              {errors.validUntil.message}
            </span>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Simpan Voucher
          </Button>
        </div>
      </form>
    </Modal>
  );
}
