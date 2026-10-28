import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Search, QrCode, ShoppingCart } from "lucide-react";

export default function SiswaLayout() {
  const location = useLocation();

  const navItems = [
    { name: "Beranda", path: "/siswa", icon: Home },
    { name: "Katalog", path: "/siswa/katalog", icon: Search },
    { name: "QR Tiket", path: "/siswa/tiket", icon: QrCode },
    { name: "Keranjang", path: "/siswa/checkout", icon: ShoppingCart },
  ];

  return (
    <div className="mx-auto max-w-md bg-gray-50 min-h-screen relative shadow-2xl">
      {/* Area Konten Utama */}
      <main className="pb-20 min-h-screen overflow-y-auto">
        <Outlet />
      </main>

      {/* Navigasi Bawah */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center rounded-t-xl z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${
                isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
