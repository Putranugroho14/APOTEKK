// src/components/DashboardPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ShoppingBag, Users, FileText, CheckCircle, Clock,
  ArrowRight, Activity, Package, TrendingUp, Calendar,
  Bell, Search, Menu, X, LogOut, LayoutDashboard, ChevronRight, Plus
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import Particles from "./Particles";

const API_URL_RESEP = `${API_BASE_URL}/api/resep/report`;
const API_URL_OBAT = `${API_BASE_URL}/api/obat`;
const LOGO_URL = "/logo-apotek.jpeg";

const DashboardPage = () => {
  const [stats, setStats] = useState({ totalResep: 0, totalObat: 0, pending: 0, selesai: 0 });
  const [recentResep, setRecentResep] = useState([]);
  const [adminData, setAdminData] = useState({ nama: 'Admin', username: 'admin' });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (e) { return null; }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    const decoded = decodeToken(token);
    if (decoded) setAdminData({ nama: decoded.nama, username: decoded.username });
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resResep, resObat] = await Promise.all([
        axios.get(API_URL_RESEP),
        axios.get(API_URL_OBAT)
      ]);

      const reseps = resResep.data.data;
      const obats = resObat.data.data;

      setStats({
        totalResep: reseps.length,
        totalObat: obats.length,
        pending: reseps.filter(r => r.status === 'pending' || r.status === 'diproses').length,
        selesai: reseps.filter(r => r.status === 'selesai').length
      });
      setRecentResep(reseps.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <button
      onClick={() => path && navigate(path)}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group
        ${active ? 'premium-gradient text-white shadow-lg shadow-cyan-200' : 'text-slate-500 hover:bg-slate-50 hover:text-cyan-600'}`}
    >
      <Icon size={20} className={active ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
      <span className="font-bold text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-mesh font-sans text-white relative overflow-hidden">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-lime-500/10 rounded-full blur-[150px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '-3s' }}></div>

      <Particles count={60} opacity={0.25} speed={0.4} />

      {/* SIDEBAR */}
      <aside className="w-80 bg-slate-900/60 backdrop-blur-xl border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen z-50">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center p-2 border border-slate-50 rotate-3">
            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain"
              onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3063/3063067.png"} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white">APOTEK <br /><span className="text-cyan-400">HADINATA</span></h1>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Admin Panel</p>
          </div>
        </div>

        <div className="space-y-2 flex-1 relative z-10">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={Package} label="Kelola Obat" path="/obat" />
          <SidebarItem icon={FileText} label="Laporan Resep" path="/admin/resep" />
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 text-red-400 font-black text-xs uppercase tracking-widest bg-white/5 rounded-2xl hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-white mb-2">Selamat Datang, <span className="text-cyan-400">{adminData.nama}!</span></h2>
            <p className="text-slate-400 font-medium">Ini adalah ringkasan performa apotek Anda hari ini.</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-slate-400 shadow-sm hover:text-cyan-400 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-2xl border border-white/10 shadow-sm">
              <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center font-black">{adminData.nama[0]}</div>
              <div className="text-left">
                <p className="text-xs font-black text-white leading-none">{adminData.nama}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{adminData.username}</p>
              </div>
            </div>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Total Produk', value: stats.totalObat, icon: Package, color: 'cyan', trend: '+12%' },
            { label: 'Total Resep', value: stats.totalResep, icon: FileText, color: 'lime', trend: '+5%' },
            { label: 'Resep Pending', value: stats.pending, icon: Clock, color: 'amber', trend: '-2%' },
            { label: 'Resep Selesai', value: stats.selesai, icon: CheckCircle, color: 'cyan', trend: '+18%' },
          ].map((s, i) => (
            <div key={i} className="glass-card-dark p-8 rounded-[40px] border border-white/10 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)] hover:-translate-y-2 transition-all duration-500 group">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12
                            ${s.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' : s.color === 'lime' ? 'bg-lime-500/10 text-lime-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  <s.icon size={26} />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${s.trend.startsWith('+') ? 'bg-lime-500/10 text-lime-400' : 'bg-red-500/10 text-red-400'}`}>
                  {s.trend}
                </span>
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{s.label}</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{isLoading ? '...' : s.value}</h3>
            </div>
          ))}
        </div>

        {/* RECENT ACTIVITY & QUICK ACTIONS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 glass-card-dark rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-black text-white tracking-tight">Resep Terbaru</h3>
              <button onClick={() => navigate('/admin/resep')} className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] hover:text-white transition-colors">Lihat Semua Laporan</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Pasien</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Tanggal</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    [1, 2, 3].map(i => <tr key={i}><td colSpan="4" className="p-8"><div className="h-8 bg-white/5 rounded-2xl animate-pulse"></div></td></tr>)
                  ) : recentResep.map(r => (
                    <tr key={r.id} className="hover:bg-white/5 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 font-bold group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-all">{r.nama_lengkap[0]}</div>
                          <div className="text-sm font-bold text-white tracking-tight">{r.nama_lengkap}</div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-400 italic font-serif">
                        {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                                            ${r.status === 'selesai' ? 'bg-lime-500/10 text-lime-400 border-lime-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button onClick={() => navigate('/admin/resep')} className="p-2 text-slate-600 hover:text-white transition-all transform hover:translate-x-1">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card-dark p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-black text-white mb-8 tracking-tight">Aksi Cepat</h3>
                <div className="grid grid-cols-2 gap-6">
                  <button onClick={() => navigate('/obat')} className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-[32px] hover:bg-cyan-500/20 hover:text-white transition-all transform hover:-translate-y-2 gap-4 group/btn">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl shadow-xl flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:rotate-6 transition-all border border-white/10"><Plus size={24} className="text-cyan-400" /></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/btn:text-white">Tambah Obat</span>
                  </button>
                  <button onClick={() => navigate('/admin/resep')} className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-[32px] hover:bg-lime-500/20 hover:text-white transition-all transform hover:-translate-y-2 gap-4 group/btn">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl shadow-xl flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:rotate-6 transition-all border border-white/10"><Activity size={24} className="text-lime-400" /></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/btn:text-white">Cek Resep</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="premium-gradient p-8 rounded-[32px] shadow-xl shadow-cyan-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-white text-xl font-black mb-2">Butuh Bantuan?</h3>
                <p className="text-cyan-100 text-xs font-medium mb-8 leading-relaxed">Punya kendala dengan sistem? Tim teknis kami siap membantu operasional apotek Anda.</p>
                <button className="w-full py-4 bg-white text-cyan-600 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg hover:shadow-cyan-400/20 transition-all">Hubungi Support</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;