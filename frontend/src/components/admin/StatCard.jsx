import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "vs minggu lalu",
}) {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between text-slate-400 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && <Icon size={18} className="text-slate-400" />}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold text-dark font-mono tracking-tight">
          {value}
        </span>

        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? "text-success bg-success/10"
                : "text-danger bg-danger/10"
            }`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span className="font-mono">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 mt-2 font-medium">
        {trendLabel}
      </p>
    </div>
  );
}
