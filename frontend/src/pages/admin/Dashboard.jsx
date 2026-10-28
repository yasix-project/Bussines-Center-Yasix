import {
  Wallet,
  ShoppingCart,
  Users,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import StatCard from "../../components/admin/CategoryDonutChart";
import SalesBarChart from "../../components/admin/SalesBarChart";
import CategoryDonutChart from "../../components/admin/CategoryDonutChart";

// Data Dummy Grafik Penjualan Harian
const salesData = [
  { date: "1 Jul", pendapatan: 450000, keuntungan: 180000 },
  { date: "2 Jul", pendapatan: 620000, keuntungan: 250000 },
  { date: "3 Jul", pendapatan: 380000, keuntungan: 120000 },
  { date: "4 Jul", pendapatan: 890000, keuntungan: 340000 },
  { date: "5 Jul", pendapatan: 750000, keuntungan: 290000 },
  { date: "6 Jul", pendapatan: 980000, keuntungan: 410000 },
  { date: "7 Jul", pendapatan: 540000, keuntungan: 210000 },
];

// Data Dummy Donut Chart Kategori
const categoryData = [
  { name: "Makanan ringan", value: 42, color: "#1C62C4" }, // Primary
  { name: "Minuman", value: 28, color: "#38BDF8" }, // Cyan
  { name: "ATK & Alat Tulis", value: 18, color: "#FFC800" }, // Accent Emas
  { name: "Merchandise", value: 12, color: "#0F2B5B" }, // Dark
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ringkasan performa penjualan Business Center Yasix
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-600 shadow-xs">
            <Calendar size={14} className="text-slate-400" />
            <span>7 Hari Terakhir</span>
          </div>
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pendapatan"
          value="Rp 4.610.000"
          icon={Wallet}
          trend={12.5}
        />
        <StatCard
          title="Total Transaksi"
          value="1.136"
          icon={ShoppingCart}
          trend={-0.8}
        />
        <StatCard
          title="Siswa/Pelanggan"
          value="567"
          icon={Users}
          trend={4.2}
        />
        <StatCard
          title="Laba Bersih"
          value="Rp 1.800.000"
          icon={ArrowUpRight}
          trend={8.1}
        />
      </div>

      {/* Row 2: Bar Chart Utama */}
      <SalesBarChart data={salesData} />

      {/* Row 3: Donut Chart & Ringkasan Penjualan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoryDonutChart data={categoryData} />
        </div>

        {/* Quick Info Card */}
        <div className="bg-gradient-to-br from-dark to-primary rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-full text-cyan border border-white/10">
              Pemberitahuan
            </span>
            <h3 className="text-lg font-bold text-white pt-2">
              Piket Kasir Hari Ini
            </h3>
            <p className="text-xs text-sky leading-relaxed">
              Tim piket shift 1: <br />
              <strong className="text-white">
                Ahmad Rizky (XII TJKT 3)
              </strong> &{" "}
              <strong className="text-white">Siti Nur (XI AKL 1)</strong>
            </p>
          </div>

          <div className="relative z-10 pt-6">
            <button className="w-full py-2.5 bg-accent text-dark text-xs font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-sm">
              Cek Jadwal Piket Lengkap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
