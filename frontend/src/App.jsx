import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Komponen Pelindung
import ProtectedRoute from "./components/ui/ProtectedRoute";

// Halaman
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import KasirLayout from "./layouts/KasirLayout";
import SiswaLayout from "./layouts/SiswaLayout";
import KelolaProduk from "./pages/admin/KelolaProduk";
import KelolaKategori from "./pages/admin/KelolaKategori";
import KelolaVoucher from "./pages/admin/KelolaVoucher";
import MonitoringShift from "./pages/admin/ShiftMonitoring";
import KelolaSiswa from "./pages/admin/KelolaSiswa";
import Pengaturan from "./pages/admin/Pengaturan";
import AdminLogin from "./pages/auth/AdminLogin";

// Fallback Halaman 403
const Unauthorized = () => (
  <div className="flex h-screen items-center justify-center text-danger font-bold text-xl">
    403 - Akses Ditolak
  </div>
);

// Konfigurasi Rute
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/login/admin",
    element: <AdminLogin />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "produk",
        element: <KelolaProduk />,
      },
      {
        path: "kategori",
        element: <KelolaKategori />,
      },
      {
        path: "voucher",
        element: <KelolaVoucher />,
      },
      {
        path: "shift",
        element: <MonitoringShift />,
      },
      {
        path: "siswa",
        element: <KelolaSiswa />,
      },
      {
        path: "pengaturan",
        element: <Pengaturan />,
      },
    ],
  },
  {
    path: "/kasir",
    element: (
      <ProtectedRoute allowedRoles={["KASIR", "ADMIN"]}>
        <KasirLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <div className="p-4">Halaman Terminal POS (Segera Hadir)</div>,
      },
    ],
  },
  {
    path: "/siswa",
    element: (
      <ProtectedRoute allowedRoles={["SISWA"]}>
        <SiswaLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <div className="p-4">Halaman Beranda Siswa (Segera Hadir)</div>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
