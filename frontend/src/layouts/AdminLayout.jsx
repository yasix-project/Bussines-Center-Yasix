import { useState } from "react"; // [BARU]
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  LogOut,
  Settings,
  ChevronRight,
  ChevronsLeft, // [BARU]
  ChevronsRight, // [BARU]
  FolderTree,
  Ticket,
  Clock,
  Users,
} from "lucide-react";
import BCYasixLogo from "../components/ui/BcYasixLogo"; // [BARU] menggantikan LogoYadika
import { useAuthStore } from "../store/authStore";

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false); // [BARU]

  const navigationGroups = [
    {
      title: "UTAMA",
      items: [{ name: "Dashboard", path: "/admin", icon: LayoutDashboard }],
    },
    {
      title: "SISTEM & OPERASIONAL",
      items: [
        { name: "Kelola Produk", path: "/admin/produk", icon: Package },
        { name: "Kelola Kategori", path: "/admin/kategori", icon: FolderTree },
        { name: "Kelola Voucher", path: "/admin/voucher", icon: Ticket },
        { name: "Monitoring Shift", path: "/admin/shift", icon: Clock },
        { name: "Kelola Siswa", path: "/admin/siswa", icon: Users },
      ],
    },
    {
      title: "PENGATURAN",
      items: [
        { name: "Pengaturan", path: "/admin/pengaturan", icon: Settings },
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
      <aside
        className={`relative ${
          collapsed ? "w-20" : "w-64"
        } transition-all duration-300 bg-white border-r border-slate-200/80 flex flex-col justify-between hidden md:flex z-20`}
      >
        {/* [BARU] Tombol buka/tutup sidebar */}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-8 w-6 h-6 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-primary border border-slate-200 shadow-sm z-30"
          title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
          aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>

        <div>
          {/* [BARU] Logo Yasix Merch di atas */}
          <div
            className={`h-20 flex items-center border-b border-slate-100 ${
              collapsed ? "justify-center" : "px-6"
            }`}
          >
            {collapsed ? (
              <BCYasixLogo variant="icon" theme="light" size={40} />
            ) : (
              <BCYasixLogo
                variant="full"
                theme="light"
                size={40}
                tagline={false}
              />
            )}
          </div>

          {/* Navigasi Terkelompok */}
          <nav className="p-4 space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.title}>
                {collapsed ? (
                  <div className="mx-3 mb-2 border-t border-slate-200" />
                ) : (
                  <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 mb-2 uppercase">
                    {group.title}
                  </p>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        title={collapsed ? item.name : undefined}
                        className={`flex items-center ${
                          collapsed ? "justify-center" : "justify-between"
                        } px-3 py-2.5 rounded-xl text-sm font-normal transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-slate-500 hover:bg-slate-50 hover:text-dark"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                          {!collapsed && <span>{item.name}</span>}
                        </div>
                        {!collapsed && isActive && <ChevronRight size={14} />}
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
          <div
            className={`flex items-center ${
              collapsed ? "flex-col gap-2" : "justify-between"
            } p-2.5 bg-slate-50 rounded-xl border border-slate-200/60`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                className="w-9 h-9 rounded-lg bg-primary text-white font-bold flex items-center justify-center shrink-0"
                title={collapsed ? user?.name || "Admin Manager" : undefined}
              >
                {user?.name?.charAt(0) || "A"}
              </div>
              {!collapsed && (
                <div className="truncate">
                  <p className="text-xs font-bold text-dark truncate">
                    {user?.name || "Admin Manager"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    Administrator
                  </p>
                </div>
              )}
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
        {/* Mobile Header (Logo di Ponsel) */}
        <header className="bg-white border-b border-slate-200/80 h-16 flex items-center justify-between px-6 md:hidden">
          {/* [BARU] logo Yasix Merch menggantikan logo lama */}
          <BCYasixLogo variant="full" theme="light" size={32} tagline={false} />
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
