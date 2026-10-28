/**
 * FeatureCard - Komponen fitur/informasi yang fleksibel
 *
 * @param {React.ElementType} icon - Komponen ikon (misal: Lucide React)
 * @param {string} title - Judul fitur
 * @param {string} description - Deskripsi singkat
 * @param {'glass' | 'light' | 'outline'} variant - Tema tampilan kartu
 * @param {string} className - Kelas Tailwind kustom tambahan
 */
export default function FeatureCard({
  icon: Icon,
  title,
  description,
  variant = "glass",
  className = "",
}) {
  // Preset tampilan berdasarkan variant
  const variants = {
    glass: {
      container: "bg-white/5 hover:bg-white/10 border-white/5",
      icon: "bg-primary-hover text-highlight border-white/10",
      title: "text-white/90",
      description: "text-blue-200/70",
    },
    light: {
      container: "bg-slate-50 hover:bg-slate-100/80 border-slate-200",
      icon: "bg-primary/10 text-primary border-primary/20",
      title: "text-dark",
      description: "text-slate-500",
    },
    outline: {
      container: "bg-transparent hover:bg-slate-50 border-slate-200",
      icon: "bg-slate-100 text-slate-700 border-slate-200",
      title: "text-slate-800",
      description: "text-slate-500",
    },
  };

  const currentVariant = variants[variant] || variants.glass;

  return (
    <div
      className={`flex gap-4 items-start border p-3.5 rounded-xl transition-all duration-300 ${currentVariant.container} ${className}`}
    >
      {Icon && (
        <div
          className={`p-2.5 rounded-xl border shrink-0 ${currentVariant.icon}`}
        >
          <Icon size={20} />
        </div>
      )}
      <div>
        <h4 className={`font-semibold text-sm ${currentVariant.title}`}>
          {title}
        </h4>
        {description && (
          <p
            className={`text-xs mt-0.5 leading-relaxed ${currentVariant.description}`}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
