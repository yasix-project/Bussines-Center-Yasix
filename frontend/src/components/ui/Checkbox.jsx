import { forwardRef } from "react";
import { Check } from "lucide-react";

const Checkbox = forwardRef(
  ({ id, label, error, className = "", ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label
          htmlFor={id}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded-md group-hover:border-blue-500 transition-colors">
            <input
              id={id}
              type="checkbox"
              ref={ref}
              className="peer absolute opacity-0 w-full h-full cursor-pointer"
              {...props}
            />
            <div className="hidden peer-checked:flex bg-blue-600 w-full h-full rounded-sm items-center justify-center">
              <Check size={14} className="text-white" strokeWidth={3} />
            </div>
          </div>
          <span className="text-sm text-gray-600 select-none group-hover:text-gray-900 transition-colors">
            {label}
          </span>
        </label>
        {error && <span className="text-xs text-red-500 ml-8">{error}</span>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
