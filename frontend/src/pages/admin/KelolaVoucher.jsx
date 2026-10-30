import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit3,
  Trash2,
  Ticket,
  CheckCircle2,
  XCircle,
  Power,
  Ban,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import FilterBar from "../../components/ui/FilterBar";
import BulkActionBar from "../../components/ui/BulkActionBar";
import StatCard from "../../components/admin/StatCard";
import VoucherFormModal from "../../components/admin/VoucherFormModal";

import { voucherService } from "../../api/voucherService";
import { formatRupiah, formatDate } from "../../utils/formatters";

export default function KelolaVoucher() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);

  // 1. Fetch Data
  const {
    data: vouchers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const response = await voucherService.getAll();
      return Array.isArray(response.data?.data)
        ? response.data.data
        : response.data || [];
    },
  });

  // 2. Mutations
  const saveMutation = useMutation({
    mutationFn: (data) =>
      editingVoucher
        ? voucherService.update(editingVoucher.id, data)
        : voucherService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      setIsModalOpen(false);
      setEditingVoucher(null);
    },
    onError: (err) =>
      alert(err.response?.data?.message || "Gagal menyimpan voucher."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => voucherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    },
  });

  // Toggle Single Status
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, currentStatus }) =>
      voucherService.toggleActive(id, currentStatus),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vouchers"] }),
    onError: () => alert("Gagal mengubah status voucher."),
  });

  // Bulk Deactivate
  const bulkDeactivateMutation = useMutation({
    mutationFn: async (ids) => {
      // Set isActive: false
      await Promise.all(
        ids.map((id) => voucherService.update(id, { isActive: false })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      setSelectedIds([]);
    },
  });

  // Bulk Activate (FUNGSI BARU YANG DITAMBAHKAN)
  const bulkActivateMutation = useMutation({
    mutationFn: async (ids) => {
      // Set isActive: true
      await Promise.all(
        ids.map((id) => voucherService.update(id, { isActive: true })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      setSelectedIds([]);
    },
  });

  // Bulk Delete
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => voucherService.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      setSelectedIds([]);
    },
  });

  // 3. Filters & Handlers
  const filteredData = vouchers.filter((v) =>
    v.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeVouchersCount = vouchers.filter(
    (v) => v.isActive && new Date(v.validUntil) > new Date(),
  ).length;

  const handleSelectAll = (e) =>
    setSelectedIds(e.target.checked ? filteredData.map((v) => v.id) : []);
  const handleSelectRow = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const handleToggleStatus = (voucher) => {
    toggleStatusMutation.mutate({
      id: voucher.id,
      currentStatus: voucher.isActive,
    });
  };

  const handleBulkDeactivate = () => {
    if (
      window.confirm(
        `Yakin ingin menonaktifkan ${selectedIds.length} voucher terpilih?`,
      )
    ) {
      bulkDeactivateMutation.mutate(selectedIds);
    }
  };

  const handleBulkActivate = () => {
    if (
      window.confirm(
        `Yakin ingin mengaktifkan kembali ${selectedIds.length} voucher terpilih?`,
      )
    ) {
      bulkActivateMutation.mutate(selectedIds);
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Hapus ${selectedIds.length} voucher terpilih secara permanen?`,
      )
    ) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  // LOGIKA KONSISTENSI SEPERTI DI PRODUK: Cek apakah semua yang dicentang berstatus NONAKTIF
  const selectedVouchers = vouchers.filter((v) => selectedIds.includes(v.id));
  const areAllInactive =
    selectedVouchers.length > 0 &&
    selectedVouchers.every((v) => v.isActive === false);

  // 4. Konfigurasi Kolom Tabel
  const columns = [
    {
      header: "Kode Voucher",
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md text-primary">
            <Ticket size={16} />
          </div>
          <span className="font-bold font-mono text-dark tracking-wide">
            {v.code}
          </span>
        </div>
      ),
    },
    {
      header: "Detail Diskon",
      render: (v) => (
        <div>
          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
            Diskon {v.discountPct}%
          </span>
          {v.maxDiscount > 0 && (
            <p className="text-[10px] text-slate-500 mt-1">
              Maks. {formatRupiah(v.maxDiscount)}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Minimal Belanja",
      cellClassName: "font-mono font-medium text-slate-600",
      render: (v) => formatRupiah(v.minPurchase),
    },
    {
      header: "Berakhir Pada",
      cellClassName: "font-mono text-slate-500 text-[11px]",
      render: (v) => formatDate(v.validUntil),
    },
    {
      header: "Status",
      render: (v) => {
        const isExpired = new Date(v.validUntil) < new Date();
        const active = v.isActive && !isExpired;

        return active ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 size={11} /> Aktif
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-600">
            <XCircle size={11} /> {isExpired ? "Kedaluwarsa" : "Nonaktif"}
          </span>
        );
      },
    },
    {
      header: "Aksi",
      className: "text-center",
      render: (v) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handleToggleStatus(v)}
            disabled={
              toggleStatusMutation.isPending &&
              toggleStatusMutation.variables?.id === v.id
            }
            className={`p-1.5 rounded transition-colors ${
              !v.isActive
                ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
            }`}
            title={v.isActive ? "Nonaktifkan Voucher" : "Aktifkan Voucher"}
          >
            <Power size={15} />
          </button>

          <button
            onClick={() => {
              setEditingVoucher(v);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
            title="Edit"
          >
            <Edit3 size={15} />
          </button>

          <button
            onClick={() => {
              if (window.confirm("Yakin ingin menghapus voucher ini?"))
                deleteMutation.mutate(v.id);
            }}
            className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger/10 rounded transition-colors"
            title="Hapus"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const isStatusLoading =
    bulkActivateMutation.isPending || bulkDeactivateMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark tracking-tight">
            Kelola Voucher Promo
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Atur diskon dan program loyalitas siswa
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingVoucher(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Buat Voucher
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Voucher Promo"
          value={vouchers.length}
          icon={Ticket}
          trendLabel="Promo Terdaftar"
        />
        <StatCard
          title="Promo Aktif"
          value={activeVouchersCount}
          icon={CheckCircle2}
          trendLabel="Bisa digunakan di Kasir"
        />
      </div>

      <FilterBar
        searchPlaceholder="Cari kode voucher..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Table
        columns={columns}
        data={filteredData}
        keyField="id"
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        emptyMessage="Tidak ada data voucher."
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        rowClassName={(v) =>
          !v.isActive || new Date(v.validUntil) < new Date()
            ? "bg-slate-50/80 opacity-70"
            : ""
        }
      />

      {/* BULK ACTION BAR YANG DINAMIS (KONSISTEN DENGAN PRODUK) */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        itemLabel="Voucher Terpilih"
      >
        {areAllInactive ? (
          <Button
            variant="primary"
            size="xs"
            onClick={handleBulkActivate}
            isLoading={isStatusLoading}
            className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30 focus-visible:ring-emerald-300 active:scale-95"
          >
            {!isStatusLoading && <Power size={14} />}
            Aktifkan Terpilih
          </Button>
        ) : (
          <Button
            variant="amber"
            size="xs"
            onClick={handleBulkDeactivate}
            isLoading={isStatusLoading}
            className="shadow-amber-900/30 focus-visible:ring-amber-300 active:scale-95"
          >
            {!isStatusLoading && <Ban size={14} />}
            Nonaktifkan Terpilih
          </Button>
        )}

        <Button
          variant="danger"
          size="xs"
          onClick={handleBulkDelete}
          isLoading={bulkDeleteMutation.isPending}
          className="shadow-red-900/30 focus-visible:ring-red-300 active:scale-95"
        >
          {!bulkDeleteMutation.isPending && <Trash2 size={14} />}
          Hapus Massal
        </Button>
      </BulkActionBar>

      <VoucherFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitData={saveMutation.mutate}
        initialData={editingVoucher}
      />
    </div>
  );
}
