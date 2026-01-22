// src/admin/ResepReport.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Clock, CheckCircle, MessageCircle, ExternalLink, Trash2,
    ArrowLeft, Package, Calendar, LayoutDashboard, FileText,
    LogOut, Search, RefreshCw, ChevronRight, Eye, User, Menu, X, ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import Particles from '../components/Particles';

const LOGO_URL = "/logo-apotek.jpeg";

const ResepReport = () => {
    const [reseps, setReseps] = useState([]);
    const [filteredReseps, setFilteredReseps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [adminData, setAdminData] = useState({ nama: 'Admin', username: 'admin' });
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
        fetchReseps();
    }, [navigate]);

    const fetchReseps = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/resep/report`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReseps(res.data.data);
            setFilteredReseps(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = reseps.filter(r =>
            r.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.nomor_wa.includes(searchQuery)
        );
        setFilteredReseps(filtered);
    }, [searchQuery, reseps]);

    const handleUpdateStatus = async (id, status) => {
        if (!window.confirm(`Apakah Anda yakin ingin mengubah status menjadi '${status}'?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_BASE_URL}/api/resep/status/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Status berhasil diperbarui!");
            fetchReseps();
        } catch (err) { alert("Gagal memperbarui status"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data resep ini secara permanen?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE_URL}/api/resep/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Data berhasil dihapus!");
                fetchReseps();
            } catch (err) { alert("Gagal menghapus data"); }
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

            <Particles count={70} opacity={0.3} speed={0.4} />
            {/* SIDEBAR */}
            <aside className={`fixed lg:sticky top-0 left-0 h-screen w-80 bg-slate-900/90 lg:bg-slate-900/60 backdrop-blur-3xl lg:backdrop-blur-xl border-r border-white/10 flex flex-col p-6 z-[100] transition-transform duration-500 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex items-center justify-between mb-12 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center p-2 border border-slate-50 rotate-3">
                            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain"
                                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3063/3063067.png"} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight leading-none text-white">APOTEK <br /><span className="text-cyan-400">HADINATA</span></h1>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Admin Panel</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-2 flex-1">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
                    <SidebarItem icon={Package} label="Kelola Obat" path="/obat" />
                    <SidebarItem icon={FileText} label="Laporan Resep" active />
                    <SidebarItem icon={ShoppingCart} label="Laporan Penjualan" path="/admin/penjualan" />
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 py-4 text-slate-400 font-black text-xs uppercase tracking-widest bg-white/5 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* OVERLAY FOR MOBILE SIDEBAR */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[90] lg:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white mr-4">
                            <Menu size={24} />
                        </button>
                        <div className="flex-1 lg:flex-none">
                            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 mb-2 leading-tight underline decoration-cyan-500/30">Laporan <span className="text-cyan-600">Resep Digital</span></h2>
                            <p className="text-slate-500 font-bold italic text-xs md:text-base">Validasi dan tindak lanjuti resep yang dikirim oleh pasien.</p>
                        </div>
                    </div>
                    <div className="glass-card-dark px-8 py-5 border border-slate-200/60 rounded-[24px] shadow-xl w-full md:w-auto bg-white/80">
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] mb-1">Total Antrean</p>
                        <p className="text-3xl font-black text-slate-900 tracking-widest leading-none">{reseps.length}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-card-dark p-6 rounded-[40px] border border-slate-200/60 mb-10 shadow-xl flex flex-col md:flex-row gap-6 bg-white/80">
                    <div className="flex-1 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama pasien atau WhatsApp..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[30px] outline-none focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-sm font-bold text-slate-900 placeholder-slate-400 shadow-inner"
                        />
                    </div>
                    <button onClick={() => setSearchQuery("")} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-[30px] flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-white transition-all transform hover:rotate-90">
                        <RefreshCw size={22} />
                    </button>
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden lg:block glass-card-dark rounded-[40px] border border-slate-200/60 shadow-xl overflow-hidden bg-white/80">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Waktu & Tanggal</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Informasi Pasien</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Dokumen</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [1, 2, 3].map(i => <tr key={i}><td colSpan="5" className="p-8"><div className="h-8 bg-slate-50 rounded-xl animate-pulse"></div></td></tr>)
                                ) : filteredReseps.length === 0 ? (
                                    <tr><td colSpan="5" className="p-20 text-center text-slate-400 italic">Tidak ada data resep ditemukan.</td></tr>
                                ) : (
                                    filteredReseps.map(r => (
                                        <tr key={r.id} className="hover:bg-slate-50 transition-all duration-300 group">
                                            <td className="p-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-slate-100 border border-slate-200 text-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-cyan-100 transition-all">
                                                        <Calendar size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 tracking-tight">{new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                                        <p className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest"><Clock size={10} /> {new Date(r.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-col">
                                                    <p className="text-base font-black text-slate-900 mb-1 tracking-tight">{r.nama_lengkap}</p>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-lime-600 tracking-wider">
                                                        <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div> {r.nomor_wa}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <a
                                                    href={r.foto_resep}
                                                    target="_blank" rel="noreferrer"
                                                    className="inline-flex items-center gap-3 text-xs font-black text-cyan-600 hover:text-slate-900 transition-all group/link"
                                                >
                                                    <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center group-hover/link:bg-white transition-all">
                                                        <Eye size={16} />
                                                    </div>
                                                    <span className="underline underline-offset-8 decoration-cyan-500/30">Detail Foto</span>
                                                </a>
                                            </td>
                                            <td className="p-8">
                                                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border
                                                    ${r.status === 'selesai' ? 'bg-lime-500/10 text-lime-400 border-lime-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                    {r.status === 'selesai' ? '✓ Selesai' : '⏳ Menunggu'}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => handleUpdateStatus(r.id, 'selesai')}
                                                        className="w-12 h-12 bg-lime-500/10 text-lime-400 hover:bg-lime-500 hover:text-white rounded-2xl transition-all flex items-center justify-center shadow-xl border border-lime-500/20"
                                                        title="Selesaikan"
                                                    >
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <a
                                                        href={`https://wa.me/${r.nomor_wa.replace(/^0/, '62')}`} target="_blank" rel="noreferrer"
                                                        className="w-12 h-12 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-2xl transition-all flex items-center justify-center shadow-xl border border-cyan-500/20"
                                                    >
                                                        <MessageCircle size={20} />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(r.id)}
                                                        className="w-12 h-12 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all flex items-center justify-center shadow-xl border border-red-500/20"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card Layout */}
                <div className="lg:hidden space-y-6">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-[30px] animate-pulse"></div>)
                    ) : filteredReseps.length === 0 ? (
                        <div className="p-20 text-center text-slate-400 italic bg-white/5 rounded-[40px]">Tidak ada data resep ditemukan.</div>
                    ) : (
                        filteredReseps.map(r => (
                            <div key={r.id} className="glass-card-dark p-6 rounded-[30px] border border-white/5 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white tracking-tight">{new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                            <p className="text-[10px] font-black text-slate-500 flex items-center gap-1 uppercase tracking-widest"><Clock size={10} /> {new Date(r.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                                        ${r.status === 'selesai' ? 'bg-lime-500/10 text-lime-400 border-lime-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                        {r.status === 'selesai' ? '✓' : '⏳'}
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <p className="text-lg font-black text-white mb-1">{r.nama_lengkap}</p>
                                    <p className="text-sm font-bold text-lime-400">{r.nomor_wa}</p>
                                </div>
                                <div className="flex gap-4 pt-4 border-t border-white/5">
                                    <a
                                        href={r.foto_resep} target="_blank" rel="noreferrer"
                                        className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-cyan-400"
                                    >
                                        <Eye size={16} /> Lihat Resep
                                    </a>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => handleUpdateStatus(r.id, 'selesai')}
                                        className="flex-1 py-4 bg-lime-500/10 text-lime-400 border border-lime-500/20 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <CheckCircle size={16} /> Selesai
                                    </button>
                                    <a
                                        href={`https://wa.me/${r.nomor_wa.replace(/^0/, '62')}`} target="_blank" rel="noreferrer"
                                        className="w-14 h-14 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl flex items-center justify-center"
                                    >
                                        <MessageCircle size={20} />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(r.id)}
                                        className="w-14 h-14 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl flex items-center justify-center"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default ResepReport;