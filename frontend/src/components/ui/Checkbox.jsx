import { forwardRef } from "react";
import { Check } from "lucide-react";

const Checkbox = forwardRef(
  ({ id, label, error, className = "", ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label
          htmlFor={id}
          className="flex items-center gap-3 cursor-pointer group has-disabled:cursor-not-allowed has-disabled:opacity-60"
        >
          <div className="relative w-5 h-5 shrink-0">
            {/* Input asli (tersembunyi, tetap bisa fokus & diklik) */}
            <input
              id={id}
              type="checkbox"
              ref={ref}
              aria-invalid={error ? true : undefined}
              className="peer absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              {...props}
            />

            {/* Kotak visual */}
            <div
              className={`absolute inset-0 rounded-md border-2 bg-white transition-all duration-150
                ${error ? "border-danger" : "border-slate-300"}
                group-hover:border-primary group-hover:bg-sky/50
                peer-checked:bg-primary peer-checked:border-primary
                peer-checked:group-hover:bg-primary-hover peer-checked:group-hover:border-primary-hover
                peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20
                peer-disabled:bg-slate-100 peer-disabled:border-slate-200`}
            />

            {/* Tanda centang dengan animasi muncul */}
            <Check
              size={14}
              strokeWidth={3.5}
              className="pointer-events-none absolute inset-0 m-auto text-white opacity-0 scale-50 transition-all duration-150 peer-checked:opacity-100 peer-checked:scale-100"
            />
          </div>

          <span className="text-sm text-slate-600 select-none transition-colors group-hover:text-dark">
            {label}
          </span>
        </label>

        {error && (
          <span className="text-xs font-medium text-danger ml-8">{error}</span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
