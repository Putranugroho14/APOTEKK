// src/components/LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import { Lock, User, ShieldCheck, ArrowRight, Loader2, Sparkles, Eye, EyeOff } from "lucide-react";
import Particles from "./Particles";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const LOGO_URL = "/logo-apotek.jpeg";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message || "Login gagal."
        : "Gagal terhubung ke server.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh relative overflow-hidden font-sans">
      <Particles count={80} opacity={0.5} />

      {/* Decorative High-End Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-lime-500/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '-4s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-dot-pattern opacity-10 pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg p-6 animate-fade-in">
        <div className="glass-card-dark p-10 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10">

          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-white rounded-[28px] shadow-xl mb-8 border border-white hover-lift">
              <img
                src={LOGO_URL}
                alt="Logo Apotek"
                className="h-14 w-auto object-contain"
                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3063/3063067.png"}
              />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Admin <span className="text-cyan-400">Portal</span></h2>
            <p className="text-slate-400 font-medium tracking-wide">Silakan masuk untuk mengelola apotek.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Username</label>
              <div className="group relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                <input
                  type="text" required
                  value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all font-bold text-sm text-white placeholder:text-slate-600"
                  placeholder="Masukkan username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Password</label>
              <div className="group relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-14 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all font-bold text-sm text-white placeholder:text-slate-600"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 animate-shake">
                <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <p className="text-red-700 text-xs font-black uppercase tracking-wider leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 premium-gradient text-white font-black rounded-[24px] shadow-2xl shadow-cyan-900/10 hover:shadow-cyan-200 transition-all flex items-center justify-center gap-4 disabled:opacity-70 uppercase tracking-[0.3em] text-[11px]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>Masuk Ke Dashboard</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 flex flex-col items-center gap-4">
            <button onClick={() => navigate('/')} className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] transition-colors">
              ← Kembali Ke Halaman Publik
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;