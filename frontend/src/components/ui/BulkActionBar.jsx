// src/components/ui/BulkActionBar.jsx
import { X } from "lucide-react";

export default function BulkActionBar({
  selectedCount,
  onClear,
  itemLabel = "Terpilih",
  children,
}) {
  if (selectedCount === 0) return null;

  return (
    <div
      role="toolbar"
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
          {itemLabel}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {children}
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
