import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  RefreshCw,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import FeatureCard from "../../components/ui/FeatureCard";
import BCYasixLogo from "../../components/ui/BCYasixLogo";
import LogoYadika from "../../assets/yadika-seeklogo.png";

import { useAuthStore } from "../../store/authStore";
import { authService } from "../../api/authService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter." }),
  rememberMe: z.boolean().optional(),
});

export default function Login() {
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  const [, setShowForgotModal] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onLogin = async (data) => {
    setLoginError("");
    try {
      // Panggil Endpoint Backend API v1 (/auth/login)
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      const resData = response.data?.data || response.data;
      const { token, user } = resData;

      if (!token || !user) {
        throw new Error("Respon dari server tidak valid.");
      }

      // Simpan User & Token ke Zustand Store
      loginAction(user, token);

      // Routing Otomatis Berdasarkan Role dari Backend
      const userRole = user.role?.toUpperCase();
      if (userRole === "ADMIN") {
        navigate("/admin");
      } else if (userRole === "KASIR") {
        navigate("/kasir");
      } else {
        navigate("/siswa");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Kredensial tidak valid. Silakan periksa kembali email dan kata sandi Anda.";
      setLoginError(errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-6 font-sans overflow-hidden">
      {/* Glow ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-137.5 h-137.5 bg-primary-gradient rounded-full blur-3xl pointer-events-none" />

      {/* Kontainer Utama */}
      <main className="relative z-10 max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200/80">
        {/* === SISI KIRI: HERO SHOWCASE (Warna bg-dark dari logo Yadika) === */}
        <section className="relative hidden md:flex md:w-5/12 bg-dark p-10 flex-col justify-between text-white overflow-hidden">
          {/* Watermark Logo Yadika di Pojok Kanan Bawah Hero */}
          <img
            src={LogoYadika}
            alt=""
            aria-hidden="true"
            className="absolute -bottom-10 -right-10 w-80 opacity-[0.06] pointer-events-none select-none"
          />

          <div className="space-y-8 relative z-10">
            {/* Logo utama BC Yasix (versi gelap) + badge versi */}
            <div className="flex items-center justify-between gap-3">
              <BCYasixLogo variant="full" theme="dark" size={44} />
              <span className="bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[11px] font-semibold text-highlight">
                v2.4
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white">
                Akses Cerdas & Terpadu Bersama{" "}
                <span className="text-blue-300/90 ">
                  BC <span className="text-blue-500">Yasix</span>
                </span>
              </h1>
              <p className="text-blue-100/75 text-sm leading-relaxed pr-2">
                Platform manajemen dan koordinasi terpusat dengan sistem
                proteksi data berlapis untuk efisiensi operasional harian.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-3.5 pt-2">
              <FeatureCard
                icon={Shield}
                title="Enkripsi Kelas Enterprise"
                description="Proteksi data dengan standar keamanan tinggi."
                variant="glass"
              />

              <FeatureCard
                icon={RefreshCw}
                title="Sinkronisasi Real-Time"
                description="Performa responsif ketersediaan latensi rendah."
                variant="glass"
              />
            </div>
          </div>

          {/* Footer Card */}
          <div className="pt-6 border-t border-white/10 mt-8 flex justify-between items-center text-xs text-blue-200/60 font-medium relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success" />
              Server Normal (99.98%)
            </div>
            <span>© 2026 BC Yasix</span>
          </div>
        </section>

        {/* === SISI KANAN: FORM PANEL === */}
        <section className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          {/* Header Form */}
          <div className="flex items-center gap-4 mb-8">
            <BCYasixLogo
              variant="icon"
              size={56}
              className="shrink-0 transition-transform duration-300 hover:scale-105"
            />
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-dark">
                Masuk ke Akun
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Portal Akses Pengguna BC Yasix
              </p>
            </div>
          </div>

          {/* Form Login */}
          <form
            onSubmit={handleSubmit(onLogin)}
            className="space-y-5 w-full max-w-md"
          >
            {/* Error Alert */}
            {loginError && (
              <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-sm text-danger font-medium flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{loginError}</p>
              </div>
            )}

            <Input
              id="email"
              label="Email atau ID Pengguna"
              icon={Mail}
              placeholder="nama@perusahaan.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              id="password"
              type="password"
              label="Kata Sandi"
              icon={Lock}
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between pt-1">
              <Checkbox
                id="rememberMe"
                label="Ingat saya"
                {...register("rememberMe")}
              />
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                Lupa kata sandi?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full py-3 mt-4 text-base rounded-xl bg-primary hover:bg-primary-hover active:bg-primary text-white shadow-md shadow-primary/20 transition-all font-semibold"
              isLoading={isSubmitting}
            >
              Masuk Sekarang <ArrowRight size={18} className="ml-1.5 inline" />
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
