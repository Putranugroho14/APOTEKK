// src/components/DashboardPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Package, FileText, CheckCircle, Clock, TrendingUp, Activity, LayoutDashboard, LogOut, Pill } from "lucide-react";

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Gagal mendekode token:", error);
    return null;
  }
};

function DashboardPage() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({ 
    nama: 'Admin Farmasi', 
    username: 'admin' 
  });
  
  // State untuk statistik real-time
  const [totalResep, setTotalResep] = useState(0);
  const [totalObat, setTotalObat] = useState(0);
  const [resepPending, setResepPending] = useState(0);
  const [resepSelesai, setResepSelesai] = useState(0);
  const [recentReseps, setRecentReseps] = useState([]);

  // LOGO - sama seperti di PublicPage
  const LOGO_URL = "/logo-apotek.jpeg";

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.nama && decoded.username) {
        setAdminData({ 
          nama: decoded.nama, 
          username: decoded.username 
        });
      }

      // Ambil statistik resep
      axios.get('http://localhost:3001/api/resep/report')
        .then(res => {
          const data = res.data.data;
          setTotalResep(data.length);
          setResepPending(data.filter(r => r.status === 'pending').length);
          setResepSelesai(data.filter(r => r.status === 'selesai').length);
          // Ambil 8 resep terbaru
          setRecentReseps(data.slice(0, 8));
        })
        .catch(err => console.error("Gagal ambil resep:", err));

      // Ambil statistik obat
      axios.get('http://localhost:3001/api/obat')
        .then(res => setTotalObat(res.data.data.length))
        .catch(err => console.error("Gagal ambil obat:", err));

    } else {
      navigate('/login');
    }
  }, [navigate]);

  const navigateTo = (path) => {
    navigate(path);
  };
    
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const Sidebar = () => (
    <div className="w-72 bg-white min-h-screen shadow-2xl flex flex-col border-r-4 border-cyan-500">
      {/* Logo & Branding */}
      <div className="p-6 bg-gradient-to-br from-cyan-600 to-cyan-500">
        <div className="flex items-center gap-4 mb-6">
          {/* Logo Apotek */}
          <div className="bg-white p-2 rounded-xl shadow-xl">
            <img
              src={LOGO_URL}
              alt="Logo Apotek Hadinata"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="w-12 h-12 bg-white rounded-xl items-center justify-center shadow-xl hidden">
              <Pill className="text-cyan-600" size={28} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">APOTEK</h1>
            <p className="text-sm font-bold text-cyan-100">HADINATA</p>
          </div>
        </div>
        
        {/* Admin Profile Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center shadow-lg font-black text-white text-lg">
              {adminData.nama.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white text-sm truncate" title={adminData.nama}>
                {adminData.nama}
              </p>
              <p className="text-xs text-cyan-100 font-medium">@{adminData.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse shadow-lg shadow-lime-400/50"></div>
            <span className="text-xs text-white font-bold">Status: Online</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-grow px-4 py-6">
        <div className="space-y-2">
          <div className="px-3 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold cursor-default shadow-lg flex items-center gap-3">
            <LayoutDashboard size={20} strokeWidth={2.5} />
            <span>Dashboard</span>
          </div>

          <div className="h-px bg-slate-200 my-4"></div>

          <p className="text-xs font-black text-slate-400 uppercase tracking-wider px-3 mb-3">
            Manajemen Data
          </p>

          <button 
            onClick={() => navigateTo("/obat")}
            className="w-full px-3 py-3 rounded-xl flex items-center gap-3 hover:bg-cyan-50 transition duration-200 font-semibold text-slate-700 hover:text-cyan-600 group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-cyan-100 flex items-center justify-center transition">
              <Package size={20} className="text-slate-600 group-hover:text-cyan-600" strokeWidth={2.5} />
            </div>
            <span>Kelola Obat</span>
          </button>

          <button 
            onClick={() => navigateTo("/admin/resep")}
            className="w-full px-3 py-3 rounded-xl flex items-center gap-3 hover:bg-cyan-50 transition duration-200 font-semibold text-slate-700 hover:text-cyan-600 group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-cyan-100 flex items-center justify-center transition">
              <FileText size={20} className="text-slate-600 group-hover:text-cyan-600" strokeWidth={2.5} />
            </div>
            <span>Kelola Resep</span>
          </button>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t-2 border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition duration-200 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span>Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 text-center border-t-2 border-slate-100 bg-slate-50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin System</p>
        <p className="text-xs font-black text-cyan-600">Version 1.0</p>
      </div>
    </div>
  );

  const Header = () => (
    <header className="h-32 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-xl flex items-center justify-between px-10 border-b-4 border-lime-500">
      <div className="flex items-center gap-6">
        {/* Logo Apotek di Header */}
        <div className="bg-white p-3 rounded-2xl shadow-2xl">
          <img
            src={LOGO_URL}
            alt="Logo Apotek Hadinata"
            className="h-16 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div className="w-16 h-16 bg-white rounded-2xl items-center justify-center shadow-2xl hidden">
            <Pill className="text-cyan-600" size={40} strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-black tracking-tight">Dashboard</h2>
          <p className="text-lg text-cyan-100 font-semibold mt-1">Sistem Manajemen Apotek</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-lime-500 px-6 py-3 rounded-full shadow-xl">
          <p className="text-sm font-black">ADMINISTRATOR</p>
        </div>
      </div>
    </header>
  );

  const StatCard = ({ icon, value, title, color, bgColor, onClick }) => (
    <div 
      onClick={onClick}
      className={`${bgColor} p-6 rounded-2xl shadow-xl border-2 border-white/50 transition-all hover:scale-105 duration-300 hover:shadow-2xl ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`text-5xl w-16 h-16 rounded-2xl flex items-center justify-center ${color} shadow-lg`}>
          {icon}
        </div>
        <p className="text-4xl font-black text-white">{value}</p>
      </div>
      <p className="text-sm font-bold text-white/90 uppercase tracking-wide">{title}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 flex-1">
          {/* Statistik Cards */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-cyan-900 mb-6">Statistik Apotek</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon="📦" 
              value={totalObat}
              title="Total Produk Obat" 
              color="bg-cyan-600" 
              bgColor="bg-gradient-to-br from-cyan-500 to-cyan-600"
              onClick={() => navigateTo("/obat")}
            />
            <StatCard 
              icon="🧾" 
              value={totalResep}
              title="Total Resep" 
              color="bg-lime-600" 
              bgColor="bg-gradient-to-br from-lime-500 to-lime-600"
              onClick={() => navigateTo("/admin/resep")}
            />
            <StatCard 
              icon="⏸️" 
              value={resepPending}
              title="Resep Pending" 
              color="bg-amber-600" 
              bgColor="bg-gradient-to-br from-amber-500 to-amber-600"
              onClick={() => navigateTo("/admin/resep")}
            />
            <StatCard 
              icon="✅" 
              value={resepSelesai}
              title="Resep Selesai" 
              color="bg-emerald-600" 
              bgColor="bg-gradient-to-br from-emerald-500 to-emerald-600"
              onClick={() => navigateTo("/admin/resep")}
            />
          </div>

          {/* Resep Terbaru - Full Width */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-cyan-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-cyan-900">Resep Terbaru</h4>
                  <p className="text-sm text-slate-500">8 resep terakhir masuk ke sistem</p>
                </div>
              </div>
              <button 
                onClick={() => navigateTo("/admin/resep")}
                className="text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-2.5 rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition shadow-lg flex items-center gap-2"
              >
                Lihat Semua
                <span>→</span>
              </button>
            </div>

            {recentReseps.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText size={40} className="text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold">Belum ada resep masuk</p>
                <p className="text-sm text-slate-400 mt-1">Resep dari pasien akan muncul di sini</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentReseps.map((resep, idx) => (
                  <div key={idx} className="group p-4 bg-gradient-to-br from-slate-50 to-cyan-50/30 rounded-xl hover:shadow-lg transition-all border-2 border-slate-100 hover:border-cyan-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-200 group-hover:border-cyan-300 transition">
                        <span className="text-lg font-black text-cyan-600">{idx + 1}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                        resep.status === 'selesai' ? 'bg-lime-500 text-white' : 
                        resep.status === 'diproses' ? 'bg-amber-500 text-white' : 
                        'bg-slate-400 text-white'
                      }`}>
                        {resep.status}
                      </span>
                    </div>
                    <p className="font-black text-cyan-900 text-base mb-1 truncate" title={resep.nama_lengkap}>
                      {resep.nama_lengkap}
                    </p>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                      <Clock size={12} />
                      <p className="text-xs font-semibold">{formatDate(resep.createdAt)}</p>
                    </div>
                    <p className="text-xs text-slate-600 truncate">📱 {resep.nomor_wa}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <footer className="p-4 text-center text-xs text-slate-500 border-t bg-white">
          © 2025 Apotek Hadinata Admin System | Powered by React & Tailwind CSS
        </footer>
      </div>
    </div>
  );
}

export default DashboardPage;