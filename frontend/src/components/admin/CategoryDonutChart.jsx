// src/components/admin/CategoryDonutChart.jsx
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function CategoryDonutChart({ data = [] }) {
  // Guard check jika data kosong
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-center h-64 text-slate-400 text-xs font-semibold">
        Data kategori belum tersedia.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-dark mb-1">
          Kategori Terlaris
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Proporsi Transaksi Berdasarkan Jenis Produk
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Donut Chart */}
        <div className="h-48 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Porsi"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend List */}
        <div className="space-y-2.5">
          {data?.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="font-medium text-slate-600">{item.name}</span>
              </div>
              <span className="font-mono font-bold text-dark">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
