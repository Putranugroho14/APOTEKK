// src/components/RegisterPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import { Lock, User, ShieldCheck, ArrowRight, Loader2, Mail, BadgeCheck, Sparkles } from "lucide-react";
import Particles from "./Particles";

function RegisterPage() {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const LOGO_URL = "/logo-apotek.jpeg";
  const role = "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        nama,
        username,
        password,
        role,
      });

      alert("Registrasi admin berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message || "Registrasi gagal."
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
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-lime-500/10 rounded-full blur-[150px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '-2s' }}></div>
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
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Admin <span className="text-lime-400">Register</span></h2>
            <p className="text-slate-400 font-medium tracking-wide">Daftarkan akun administrator baru.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Nama Lengkap</label>
                <div className="group relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-lime-400 transition-colors" size={20} />
                  <input
                    type="text" required
                    value={nama} onChange={(e) => setNama(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-bold text-sm text-white placeholder:text-slate-600"
                    placeholder="Nama Anda"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Username Baru</label>
                <div className="group relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-lime-400 transition-colors" size={20} />
                  <input
                    type="text" required
                    value={username} onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-bold text-sm text-white placeholder:text-slate-600"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Password</label>
                <div className="group relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-lime-400 transition-colors" size={20} />
                  <input
                    type="password" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-bold text-sm text-white placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                </div>
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
              type="submit" disabled={isLoading}
              className="w-full py-6 premium-gradient-alt text-white font-black rounded-[24px] shadow-2xl shadow-lime-900/10 hover:shadow-lime-200 transition-all flex items-center justify-center gap-4 disabled:opacity-70 uppercase tracking-[0.3em] text-[11px]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>Registrasi Admin Baru</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-xs font-black text-slate-400 hover:text-cyan-600 uppercase tracking-widest transition-colors flex items-center gap-2">
              Sudah Ada Akun? Login Disini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;