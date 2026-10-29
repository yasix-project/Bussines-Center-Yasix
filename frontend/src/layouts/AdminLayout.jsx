import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Calendar,
  LogOut,
  Settings,
  ChevronRight,
  FolderTree,
  Ticket,
} from "lucide-react";
import LogoYadika from "../assets/yadika-seeklogo.png";
import { useAuthStore } from "../store/authStore";

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navigationGroups = [
    {
      title: "UTAMA",
      items: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Kelola Produk", path: "/admin/produk", icon: Package },
        { name: "Kelola Kategori", path: "/admin/kategori", icon: FolderTree },
        { name: "Kelola Voucher", path: "/admin/voucher", icon: Ticket },
        { name: "Analitik", path: "/admin/analitik", icon: BarChart3 },
      ],
    },
    {
      title: "SISTEM & OPERASIONAL",
      items: [
        { name: "Jadwal Piket", path: "/admin/piket", icon: Calendar },
        { name: "Pengaturan", path: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-bright font-sans antialiased text-slate-800">
      {/* Sidebar Minimalis */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between hidden md:flex z-20">
        <div>
          {/* Top Brand & Logo Yadika */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <img src={LogoYadika} alt="Logo Yadika" className="w-10 h-10" />
            <div>
              <h1 className="font-bold text-base text-dark tracking-tight leading-none">
                BC-YASIX
              </h1>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                SMK Yadika 6
              </p>
            </div>
          </div>

          {/* Navigasi Terkelompok */}
          <nav className="p-4 space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.title}>
                <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 mb-2 uppercase">
                  {group.title}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-normal transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-slate-500 hover:bg-slate-50 hover:text-dark"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                          <span>{item.name}</span>
                        </div>
                        {isActive && <ChevronRight size={14} />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Profil Pengguna di Bawah Sidebar */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-primary text-white font-bold flex items-center justify-center shrink-0">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-dark truncate">
                  {user?.name || "Admin Manager"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  Administrator
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors shrink-0"
              title="Keluar"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (Ikon Logo di Ponsel) */}
        <header className="bg-white border-b border-slate-200/80 h-16 flex items-center justify-between px-6 md:hidden">
          <div className="flex items-center gap-3">
            <img src={LogoYadika} alt="Logo Yadika" className="w-8 h-8" />
            <span className="font-bold text-dark">BC-YASIX</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-danger"
          >
            Keluar
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
