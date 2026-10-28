import { Outlet, Link, useLocation } from "react-router-dom";
import { MonitorPlay, History, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function KasirLayout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold italic">BC-Yasix POS</h1>
            <nav className="flex gap-1">
              <Link
                to="/kasir"
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  location.pathname === "/kasir"
                    ? "bg-blue-700 font-semibold"
                    : "hover:bg-blue-500"
                }`}
              >
                <MonitorPlay size={18} />
                Terminal
              </Link>
              <Link
                to="/kasir/riwayat"
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  location.pathname === "/kasir/riwayat"
                    ? "bg-blue-700 font-semibold"
                    : "hover:bg-blue-500"
                }`}
              >
                <History size={18} />
                Riwayat Transaksi
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium bg-blue-700 px-3 py-1 rounded-full">
              Kasir: {user?.name || "Siswa Piket"}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-500 rounded-full transition-colors"
              title="Keluar"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
