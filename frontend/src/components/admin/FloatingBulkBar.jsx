// src/components/admin/FloatingBulkBar.jsx
import { Download, Ban, Trash2, Power, Edit3 } from "lucide-react";
import Button from "../ui/Button";
import BulkActionBar from "../ui/BulkActionBar";

export default function FloatingBulkBar({
  selectedCount,
  onExport,
  onBulkEdit,
  onDeactivate,
  onActivate,
  areAllInactive = false,
  onDelete,
  onClear,
  isDeactivating,
  isActivating,
  isDeleting,
}) {
  const isStatusLoading = isDeactivating || isActivating;

  return (
    <BulkActionBar
      selectedCount={selectedCount}
      onClear={onClear}
      itemLabel="Produk Terpilih"
    >
      <Button
        variant="outline"
        size="xs"
        onClick={onExport}
        className="border-white/10 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white/60 active:scale-95"
      >
        <Download size={14} /> Export CSV
      </Button>

      {onBulkEdit && (
        <Button
          variant="secondary"
          size="xs"
          onClick={onBulkEdit}
          className="bg-white/15 text-white border-white/10 hover:bg-white/25 active:scale-95"
        >
          <Edit3 size={14} /> Edit Massal
        </Button>
      )}

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
    </BulkActionBar>
  );
}
