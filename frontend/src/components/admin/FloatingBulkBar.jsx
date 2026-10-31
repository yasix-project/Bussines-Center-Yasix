// src/components/admin/FloatingBulkBar.jsx
import { Download, Ban, Trash2, Power, Edit3, Printer } from "lucide-react";
import Button from "../ui/Button";
import BulkActionBar from "../ui/BulkActionBar";

export default function FloatingBulkBar({
  selectedCount,
  onExport,
  onPrint,
  onCancel,
  onBulkEdit,
  onDeactivate,
  onActivate,
  areAllInactive = false,
  onDelete,
  onClear,
  itemLabel = "Produk Terpilih",
  isDeactivating,
  isActivating,
  isDeleting,
}) {
  const isStatusLoading = isDeactivating || isActivating;

  return (
    <BulkActionBar
      selectedCount={selectedCount}
      onClear={onClear}
      itemLabel={itemLabel}
    >
      <Button
        variant="outline"
        size="xs"
        onClick={onExport}
        className="active:scale-95"
      >
        <Download size={14} /> Export CSV
      </Button>

      {onPrint && (
        <Button
          variant="secondary"
          size="xs"
          onClick={onPrint}
          className="active:scale-95"
        >
          <Printer size={14} /> Cetak Struk
        </Button>
      )}

      {onCancel && (
        <Button
          variant="danger"
          size="xs"
          onClick={onCancel}
          className="active:scale-95"
        >
          <Trash2 size={14} /> Batalkan
        </Button>
      )}

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

      {(onActivate || onDeactivate) &&
        (areAllInactive ? (
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
        ))}

      {onDelete && (
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
      )}
    </BulkActionBar>
  );
}
