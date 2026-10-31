// src/components/admin/StudentFormModal.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

const studentSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  nis: z.string().optional(),
  password: z.string().optional(),
  points: z.coerce.number().min(0, "Poin tidak boleh negatif").default(0),
});

export default function StudentFormModal({
  isOpen,
  onClose,
  onSubmitData,
  initialData = null,
}) {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      nis: "",
      password: "",
      points: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        email: initialData.email || "",
        nis: initialData.nis || "",
        password: "", // Kosongkan password saat edit
        points: initialData.points || 0,
      });
    } else {
      reset({
        name: "",
        email: "",
        nis: "",
        password: "",
        points: 0,
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data) => {
    // Jika password kosong saat edit, hapus dari payload agar tidak ter-overwrite
    if (isEditing && !data.password) {
      delete data.password;
    }
    onSubmitData(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Data Siswa" : "Tambah Siswa Baru"}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          id="name"
          label="Nama Lengkap Siswa"
          placeholder="Contoh: Budi Santoso"
          {...register("name")}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="siswa@yasix.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            id="nis"
            label="NIS (Nomor Induk Siswa)"
            placeholder="12345678"
            {...register("nis")}
            error={errors.nis?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="password"
            type="password"
            label={isEditing ? "Password Baru (Opsional)" : "Password"}
            placeholder={isEditing ? "Kosongkan jika tak diubah" : "******"}
            {...register("password")}
            error={errors.password?.message}
          />

          <Input
            id="points"
            type="number"
            label="Poin Loyalitas"
            placeholder="0"
            {...register("points")}
            error={errors.points?.message}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Simpan Perubahan" : "Tambah Siswa"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
