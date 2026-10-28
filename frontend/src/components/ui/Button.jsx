// src/components/ui/Button.jsx

export default function Button({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  className = "",
  disabled,
  ...props
}) {
  const baseStyle =
    "flex items-center justify-center gap-2 font-semibold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-xs",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-xs",
    amber: "bg-amber-600 text-white hover:bg-amber-700 shadow-xs",
    outline:
      "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-xs",
    dark: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3.5 py-2 text-xs",
    md: "px-4 py-2 text-sm",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
