// src/components/DashboardPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText, CheckCircle, Clock,
  Activity, Package,
  Bell, Menu, X, LogOut, LayoutDashboard, ChevronRight, Plus, ShoppingCart
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [resResep, resObat] = await Promise.all([
        axios.get(API_URL_RESEP, { headers }),
        axios.get(API_URL_OBAT, { headers })
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
    <div className="flex min-h-screen bg-mesh font-sans text-slate-900 relative overflow-hidden">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-lime-500/10 rounded-full blur-[150px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '-3s' }}></div>

      <Particles count={60} opacity={0.25} speed={0.4} />

      {/* SIDEBAR */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-80 bg-white border-r border-slate-200 flex flex-col p-6 z-[100] transition-transform duration-500 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500 text-white rounded-2xl shadow-lg flex items-center justify-center p-2 rotate-3">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain brightness-0 invert"
                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3063/3063067.png"} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none text-slate-900">APOTEK <br /><span className="text-cyan-500">HADINATA</span></h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-2 flex-1 relative z-10">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={Package} label="Kelola Obat" path="/obat" />
          <SidebarItem icon={FileText} label="Laporan Resep" path="/admin/resep" />
          <SidebarItem icon={ShoppingCart} label="Laporan Penjualan" path="/admin/penjualan" />
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100 relative z-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 text-red-500 font-black text-xs uppercase tracking-widest bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div className="flex items-center justify-between w-full md:w-auto">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-600 mr-4 shadow-sm">
              <Menu size={24} />
            </button>
            <div className="flex-1 lg:flex-none">
              <h2 className="text-xl md:text-4xl font-black tracking-tight text-slate-900 mb-1 md:mb-2 leading-tight">Selamat Datang, <span className="text-cyan-600">{adminData.nama}!</span></h2>
              <p className="text-slate-500 font-bold text-[10px] md:text-base">Ringkasan performa apotek Anda hari ini.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto justify-end">
            <button className="hidden md:flex w-12 h-12 bg-white rounded-2xl border border-slate-200 items-center justify-center text-slate-400 shadow-sm hover:text-cyan-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center font-black">{adminData.nama[0]}</div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-900 leading-none whitespace-nowrap">{adminData.nama}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{adminData.username}</p>
              </div>
            </div>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
          {[
            { label: 'Produk', value: stats.totalObat, icon: Package, color: 'cyan' },
            { label: 'Resep', value: stats.totalResep, icon: FileText, color: 'lime' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber' },
            { label: 'Selesai', value: stats.selesai, icon: CheckCircle, color: 'cyan' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-5 md:p-8 rounded-[24px] md:rounded-[40px] border border-slate-200 shadow-sm hover:translate-y-[-5px] transition-all duration-500 group">
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12
                            ${s.color === 'cyan' ? 'bg-cyan-100 text-cyan-600' : s.color === 'lime' ? 'bg-lime-100 text-lime-600' : 'bg-amber-100 text-amber-600'}`}>
                  <s.icon size={20} className="md:w-[26px] md:h-[26px]" />
                </div>
              </div>
              <p className="text-slate-600 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1">{s.label}</p>
              <h3 className="text-xl md:text-4xl font-black text-slate-900 tracking-tighter">{isLoading ? '...' : s.value}</h3>
            </div>
          ))}
        </div>

        {/* RECENT ACTIVITY & QUICK ACTIONS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Resep Terbaru</h3>
              <button onClick={() => navigate('/admin/resep')} className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">Lihat Semua Laporan</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600">Pasien</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600">Tanggal</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    [1, 2, 3].map(i => <tr key={i}><td colSpan="4" className="p-8"><div className="h-8 bg-slate-100 rounded-2xl animate-pulse"></div></td></tr>)
                  ) : recentResep.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold group-hover:scale-110 group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-all">{r.nama_lengkap[0]}</div>
                          <div className="text-sm font-bold text-slate-900 tracking-tight">{r.nama_lengkap}</div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-slate-600 italic">
                        {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                                            ${r.status === 'selesai' ? 'bg-lime-100 text-lime-700 border-lime-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button onClick={() => navigate('/admin/resep')} className="p-2 text-slate-400 hover:text-cyan-600 transition-all transform hover:translate-x-1">
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
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Aksi Cepat</h3>
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <button onClick={() => navigate('/obat')} className="flex flex-col items-center justify-center p-5 md:p-8 bg-slate-50 rounded-[24px] md:rounded-[32px] hover:bg-cyan-50 hover:text-cyan-600 transition-all transform hover:-translate-y-1 gap-3 md:gap-4 group/btn border border-slate-100">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center group-hover/btn:scale-110 transition-all border border-slate-100"><Plus size={20} className="text-cyan-600 md:w-6 md:h-6" /></div>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover/btn:text-cyan-700">Tambah Obat</span>
                  </button>
                  <button onClick={() => navigate('/admin/resep')} className="flex flex-col items-center justify-center p-5 md:p-8 bg-slate-50 rounded-[24px] md:rounded-[32px] hover:bg-lime-50 hover:text-lime-600 transition-all transform hover:-translate-y-1 gap-3 md:gap-4 group/btn border border-slate-100">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center group-hover/btn:scale-110 transition-all border border-slate-100"><Activity size={20} className="text-lime-600 md:w-6 md:h-6" /></div>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover/btn:text-lime-700">Cek Resep</span>
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
        </div >
      </main >
    </div >
  );
};

export default DashboardPage;