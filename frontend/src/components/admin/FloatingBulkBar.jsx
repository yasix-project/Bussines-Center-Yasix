// src/components/admin/FloatingBulkBar.jsx
import { Download, Ban, Trash2, X, Power } from "lucide-react";
import Button from "../ui/Button";

export default function FloatingBulkBar({
  selectedCount,
  onExport,
  onDeactivate,
  onActivate,
  areAllInactive = false,
  onDelete,
  onClear,
  isDeactivating,
  isActivating,
  isDeleting,
}) {
  if (selectedCount === 0) return null;

  const isStatusLoading = isDeactivating || isActivating;

  return (
    <div
      role="toolbar"
      aria-label="Aksi massal produk"
      className="fixed bottom-6 left-1/2 z-40 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-2xl border border-white/10 bg-primary/90 px-5 py-3 text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 motion-reduce:animate-none"
    >
      <div className="flex items-center gap-2.5 border-r border-white/10 pr-5">
        <span
          aria-hidden="true"
          className="flex h-7 min-w-7 items-center justify-center rounded-full bg-accent px-1.5 font-mono text-xs font-bold tabular-nums text-dark ring-4 ring-accent/20"
        >
          {selectedCount}
        </span>
        <span className="text-xs font-semibold tracking-wide text-slate-100">
          <span className="sr-only">{selectedCount} </span>
          Produk Terpilih
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          size="xs"
          onClick={onExport}
          className="border-white/10 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white/60 active:scale-95"
        >
          <Download size={14} /> Export CSV
        </Button>

        {/* Dynamic Button: Aktifkan vs Nonaktifkan */}
        {areAllInactive ? (
          <Button
            variant="primary"
            size="xs"
            onClick={onActivate || onDeactivate}
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
            onClick={onDeactivate}
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
          onClick={onDelete}
          isLoading={isDeleting}
          className="shadow-red-900/30 focus-visible:ring-red-300 active:scale-95"
        >
          {!isDeleting && <Trash2 size={14} />}
          Hapus Massal
        </Button>
      </div>

      <button
        onClick={onClear}
        aria-label="Batal Pilih"
        className="ml-1 rounded-full p-1.5 text-slate-400 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        title="Batal Pilih"
      >
        <X size={16} />
      </button>
    </div>
  );
}
