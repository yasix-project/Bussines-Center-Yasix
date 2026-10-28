import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { token, role } = useAuthStore();

  // Jika tidak ada token, kembalikan ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika role pengguna tidak termasuk dalam daftar yang diizinkan
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Jika lolos validasi, render komponen anak
  return children;
}
