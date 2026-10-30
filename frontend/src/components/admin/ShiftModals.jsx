import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

// --- MODAL BUKA SHIFT ---
const startShiftSchema = z.object({
  startCash: z.coerce.number().min(0, "Modal awal tidak boleh negatif"),
});

export function StartShiftModal({ isOpen, onClose, onSubmitData }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(startShiftSchema),
    defaultValues: { startCash: 0 },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buka Shift Kasir">
      <form
        onSubmit={handleSubmit((data) => onSubmitData(data, reset))}
        className="space-y-4"
      >
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md text-xs leading-relaxed">
          Masukkan jumlah uang tunai (modal kembalian) yang ada di laci kasir
          saat ini.
        </div>
        <Input
          id="startCash"
          type="number"
          label="Modal Awal (Rp)"
          placeholder="Contoh: 100000"
          {...register("startCash")}
          error={errors.startCash?.message}
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Mulai Shift
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// --- MODAL TUTUP SHIFT ---
const endShiftSchema = z.object({
  actualCash: z.coerce.number().min(0, "Uang fisik tidak boleh negatif"),
});

export function EndShiftModal({
  isOpen,
  onClose,
  onSubmitData,
  systemExpectedCash = 0,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(endShiftSchema),
    defaultValues: { actualCash: 0 },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tutup Shift Kasir">
      <form
        onSubmit={handleSubmit((data) => onSubmitData(data, reset))}
        className="space-y-4"
      >
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-xs leading-relaxed">
          Masukkan total uang tunai fisik di laci kasir saat ini. Sistem akan
          menghitung selisihnya otomatis.
        </div>

        <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-md">
          <span className="text-xs font-semibold text-slate-600">
            Total Kas Sistem:
          </span>
          <span className="text-sm font-bold text-dark">
            Rp {systemExpectedCash.toLocaleString("id-ID")}
          </span>
        </div>

        <Input
          id="actualCash"
          type="number"
          label="Uang Fisik Aktual (Rp)"
          placeholder="Total uang di laci kasir"
          {...register("actualCash")}
          error={errors.actualCash?.message}
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="danger" isLoading={isSubmitting}>
            Akhiri Shift
          </Button>
        </div>
      </form>
    </Modal>
  );
}
