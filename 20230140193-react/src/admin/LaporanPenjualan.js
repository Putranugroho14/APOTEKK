import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Clock, CheckCircle, MessageCircle, ShoppingCart, Package,
    LogOut, Search, RefreshCw, Eye, Menu, X, LayoutDashboard, FileText,
    TrendingUp, TrendingDown, Trash2, Calendar, PieChart, Filter, Award, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import Particles from '../components/Particles';

const LOGO_URL = "/logo-apotek.jpeg";

const LaporanPenjualan = () => {
    const [penjualans, setPenjualans] = useState([]);
    const [filteredPenjualans, setFilteredPenjualans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState('all'); // all, daily, monthly, range
    const [dateFilter, setDateFilter] = useState({
        specificDate: new Date().toISOString().split('T')[0],
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        start: "",
        end: ""
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();



    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        fetchPenjualans();
    }, [navigate]);

    const fetchPenjualans = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/penjualan`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPenjualans(res.data.data);
            setFilteredPenjualans(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...penjualans];

        // 1. Filter by Date/Type
        if (filterType === 'daily') {
            filtered = filtered.filter(p => new Date(p.createdAt).toISOString().split('T')[0] === dateFilter.specificDate);
        } else if (filterType === 'monthly') {
            filtered = filtered.filter(p => new Date(p.createdAt).toISOString().slice(0, 7) === dateFilter.month);
        } else if (filterType === 'range' && dateFilter.start && dateFilter.end) {
            const start = new Date(dateFilter.start);
            const end = new Date(dateFilter.end);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(p => {
                const pDate = new Date(p.createdAt);
                return pDate >= start && pDate <= end;
            });
        }

        // 2. Filter by Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p => {
                const name = (p.nama_pelanggan || "").toLowerCase();
                const wa = (p.nomor_wa || "").toLowerCase();
                const address = (p.alamat || "").toLowerCase();
                return name.includes(query) || wa.includes(query) || address.includes(query);
            });
        }

        setFilteredPenjualans(filtered);
    }, [searchQuery, penjualans, filterType, dateFilter]);

    // ANALYTICS CALCULATIONS
    const stats = React.useMemo(() => {
        // Total Income from current filtered view
        const totalIncome = filteredPenjualans.reduce((sum, p) => sum + Number(p.total_harga), 0);

        // Month comparison logic
        const now = new Date();
        const thisMonth = now.toISOString().slice(0, 7);
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonth = lastMonthDate.toISOString().slice(0, 7);

        const currentMonthSales = penjualans.filter(p => new Date(p.createdAt).toISOString().slice(0, 7) === thisMonth);
        const lastMonthSales = penjualans.filter(p => new Date(p.createdAt).toISOString().slice(0, 7) === lastMonth);

        const currentMonthIncome = currentMonthSales.reduce((sum, p) => sum + Number(p.total_harga), 0);
        const lastMonthIncome = lastMonthSales.reduce((sum, p) => sum + Number(p.total_harga), 0);

        let growth = 0;
        if (lastMonthIncome > 0) {
            growth = ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;
        } else if (currentMonthIncome > 0) {
            growth = 100;
        }

        // Product Analytics (Most & Least Sold)
        const productMap = {};
        filteredPenjualans.forEach(p => {
            const items = parseItems(p.detail_pesanan);
            items.forEach(item => {
                if (!productMap[item.nama_obat]) {
                    productMap[item.nama_obat] = { name: item.nama_obat, qty: 0, revenue: 0 };
                }
                productMap[item.nama_obat].qty += Number(item.qty);
                productMap[item.nama_obat].revenue += (Number(item.qty) * Number(item.harga));
            });
        });

        const sortedProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty);

        return {
            totalIncome,
            currentMonthIncome,
            growth,
            topProduct: sortedProducts[0] || null,
            leastProduct: sortedProducts.length > 1 ? sortedProducts[sortedProducts.length - 1] : null,
            totalOrders: filteredPenjualans.length
        };
    }, [filteredPenjualans, penjualans]);

    const handleUpdateStatus = async (id, status) => {
        if (!window.confirm(`Ubah status menjadi '${status}'?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/penjualan/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Status berhasil diperbarui!");
            fetchPenjualans();
        } catch (err) { alert("Gagal memperbarui status"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus data penjualan ini secara permanen? Stok tidak akan dikembalikan otomatis.")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/penjualan/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Data berhasil dihapus!");
            fetchPenjualans();
        } catch (err) {
            console.error(err);
            alert("Gagal menghapus data");
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

    const parseItems = (jsonString) => {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            return [];
        }
    };

    return (
        <div className="flex min-h-screen bg-mesh font-sans text-slate-900 relative overflow-hidden">
            {/* BACKGROUND DECORATIONS */}
            <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-glow pointer-events-none"></div>

            <Particles count={70} opacity={0.3} speed={0.4} />

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
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-900">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-2 flex-1">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
                    <SidebarItem icon={Package} label="Kelola Obat" path="/obat" />
                    <SidebarItem icon={FileText} label="Laporan Resep" path="/admin/resep" />
                    <SidebarItem icon={ShoppingCart} label="Laporan Penjualan" active />
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 relative z-10">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-4 text-red-500 font-black text-xs uppercase tracking-widest bg-red-50 rounded-2xl hover:bg-red-100 transition-colors">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* OVERLAY FOR MOBILE SIDEBAR */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] lg:hidden animate-fade-in" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-600 mr-4 shadow-sm">
                            <Menu size={24} />
                        </button>
                        <div className="flex-1 lg:flex-none">
                            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 mb-2 leading-tight underline decoration-cyan-500/30">Laporan <span className="text-cyan-600">Penjualan</span></h2>
                            <p className="text-slate-500 font-bold italic text-xs md:text-base">Monitor pesanan yang masuk melalui katalog online.</p>
                        </div>
                    </div>
                    <div className="bg-white px-8 py-5 border border-slate-200 rounded-[24px] shadow-sm w-full md:w-auto">
                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] mb-1">Total Pesanan</p>
                        <p className="text-3xl font-black text-slate-900 tracking-widest leading-none">{penjualans.length}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                    {/* TOTAL INCOME */}
                    <div className="bg-white p-8 border border-slate-200 rounded-[32px] shadow-premium group hover:border-cyan-500 transition-all duration-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-cyan-50 text-cyan-500 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                <TrendingUp size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${stats.growth >= 0 ? 'text-lime-600' : 'text-red-500'}`}>
                                {stats.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {Math.abs(stats.growth).toFixed(1)}%
                            </div>
                        </div>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Total Pendapatan</p>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">Rp{stats.totalIncome.toLocaleString()}</h4>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold italic">Bulan lalu: Rp{((stats.currentMonthIncome / (1 + stats.growth / 100)) || 0).toLocaleString()}</p>
                    </div>

                    {/* TOTAL ORDERS */}
                    <div className="bg-white p-8 border border-slate-200 rounded-[32px] shadow-premium group hover:border-amber-500 transition-all duration-500 text-center md:text-left">
                        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-4 md:mb-4 mx-auto md:mx-0 group-hover:bg-amber-500 group-hover:text-white transition-all">
                            <ShoppingCart size={24} />
                        </div>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Total Pesanan</p>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalOrders}</h4>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold italic">Berdasarkan filter saat ini</p>
                    </div>

                    {/* TOP PRODUCT */}
                    <div className="bg-white p-8 border border-slate-200 rounded-[32px] shadow-premium group hover:border-lime-500 transition-all duration-500">
                        <div className="w-12 h-12 bg-lime-50 text-lime-500 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-lime-500 group-hover:text-white transition-all">
                            <Award size={24} />
                        </div>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Produk Terlaris</p>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight line-clamp-1">{stats.topProduct ? stats.topProduct.name : "N/A"}</h4>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold italic">Terjual: {stats.topProduct ? stats.topProduct.qty : 0} pcs</p>
                    </div>

                    {/* WORST PRODUCT */}
                    <div className="bg-white p-8 border border-slate-200 rounded-[32px] shadow-premium group hover:border-red-500 transition-all duration-500">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:text-white transition-all">
                            <AlertCircle size={24} />
                        </div>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Kurang Diminati</p>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight line-clamp-1">{stats.leastProduct ? stats.leastProduct.name : (stats.topProduct ? "Hanya 1 Produk" : "N/A")}</h4>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold italic">Terjual: {stats.leastProduct ? stats.leastProduct.qty : 0} pcs</p>
                    </div>
                </div>

                {/* FILTERS & SEARCH */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-200 mb-10 shadow-premium">
                    <div className="flex flex-col xl:flex-row gap-6 mb-6">
                        {/* SEARCH */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari nama pembeli, WA, atau alamat..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[28px] outline-none focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-sm font-bold text-slate-900 placeholder-slate-400 shadow-inner"
                            />
                        </div>

                        {/* FILTER TYPES */}
                        <div className="flex bg-slate-50 p-1.5 rounded-[28px] border border-slate-200">
                            {[
                                { id: 'all', label: 'Semua', icon: Filter },
                                { id: 'daily', label: 'Harian', icon: Calendar },
                                { id: 'monthly', label: 'Bulanan', icon: PieChart },
                                { id: 'range', label: 'Rentang', icon: Calendar }
                            ].map(btn => (
                                <button
                                    key={btn.id}
                                    onClick={() => setFilterType(btn.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all
                                    ${filterType === btn.id ? 'bg-white text-cyan-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <btn.icon size={14} /> {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DYNAMIC DATE INPUTS */}
                    {filterType !== 'all' && (
                        <div className="flex flex-wrap gap-4 p-6 bg-cyan-50/50 border border-cyan-100 rounded-[28px] animate-fade-in">
                            {filterType === 'daily' && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-cyan-700 tracking-widest ml-1">PILIH TANGGAL</label>
                                    <input
                                        type="date"
                                        value={dateFilter.specificDate}
                                        onChange={(e) => setDateFilter({ ...dateFilter, specificDate: e.target.value })}
                                        className="px-6 py-3 bg-white border border-cyan-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                            )}
                            {filterType === 'monthly' && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-cyan-700 tracking-widest ml-1">PILIH BULAN</label>
                                    <input
                                        type="month"
                                        value={dateFilter.month}
                                        onChange={(e) => setDateFilter({ ...dateFilter, month: e.target.value })}
                                        className="px-6 py-3 bg-white border border-cyan-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                            )}
                            {filterType === 'range' && (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-cyan-700 tracking-widest ml-1">DARI TANGGAL</label>
                                        <input
                                            type="date"
                                            value={dateFilter.start}
                                            onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                                            className="px-6 py-3 bg-white border border-cyan-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center text-cyan-300 pt-6 px-2">
                                        <ArrowRight size={20} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-cyan-700 tracking-widest ml-1">SAMPAI TANGGAL</label>
                                        <input
                                            type="date"
                                            value={dateFilter.end}
                                            onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                                            className="px-6 py-3 bg-white border border-cyan-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </div>
                                </>
                            )}
                            <button
                                onClick={() => {
                                    setFilterType('all');
                                    setSearchQuery("");
                                }}
                                className="mt-auto ml-auto px-6 py-3 bg-white text-red-500 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2"
                            >
                                <RefreshCw size={14} /> Reset Filter
                            </button>
                        </div>
                    )}
                </div>

                {/* Table Layout */}
                <div className="hidden lg:block bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Tanggal</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Pelanggan</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Total Belanja</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Status</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [1, 2, 3].map(i => <tr key={i}><td colSpan="5" className="p-8"><div className="h-8 bg-slate-50 rounded-xl animate-pulse"></div></td></tr>)
                                ) : filteredPenjualans.length === 0 ? (
                                    <tr><td colSpan="5" className="p-20 text-center text-slate-400 italic">
                                        {loading ? "Memuat data..." : "Tidak ada data penjualan. Pastikan koneksi API sudah benar."}
                                    </td></tr>
                                ) : (
                                    filteredPenjualans.map(order => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-all duration-300 group">
                                            <td className="p-8">
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                                <p className="text-[10px] font-black text-slate-500 flex items-center gap-1 uppercase tracking-widest"><Clock size={10} /> {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-col">
                                                    <p className="text-base font-black text-slate-900 mb-1 tracking-tight">{order.nama_pelanggan}</p>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-lime-600 tracking-wider">
                                                        {order.nomor_wa}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <p className="text-base font-black text-cyan-600">Rp{Number(order.total_harga).toLocaleString()}</p>
                                            </td>
                                            <td className="p-8">
                                                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border
                                                    ${order.status === 'Selesai' ? 'bg-lime-500/10 text-lime-600 border-lime-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex justify-center gap-3">
                                                    <button onClick={() => setSelectedOrder(order)} className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-cyan-50 hover:text-cyan-600 rounded-xl flex items-center justify-center transition-all border border-slate-100" title="Lihat Order">
                                                        <Eye size={16} />
                                                    </button>
                                                    {order.nomor_wa !== "N/A" && (
                                                        <a href={`https://wa.me/${order.nomor_wa.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-lime-50 text-lime-600 hover:bg-lime-500 hover:text-white rounded-xl flex items-center justify-center transition-all border border-lime-100" title="WhatsApp">
                                                            <MessageCircle size={16} />
                                                        </a>
                                                    )}
                                                    {order.status !== 'Selesai' ? (
                                                        <button onClick={() => handleUpdateStatus(order.id, 'Selesai')} className="w-10 h-10 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl flex items-center justify-center transition-all border border-amber-100" title="Selesaikan">
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    ) : (
                                                        <div className="w-10 h-10 bg-lime-500 text-white rounded-xl flex items-center justify-center" title="Sudah Selesai">
                                                            <CheckCircle size={16} />
                                                        </div>
                                                    )}
                                                    <button onClick={() => handleDelete(order.id)} className="w-10 h-10 bg-white text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center transition-all border border-slate-100" title="Hapus Permanen">
                                                        <Trash2 size={16} />
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

                {/* Mobile Layout */}
                <div className="lg:hidden space-y-4">
                    {filteredPenjualans.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-black text-slate-900">{order.nama_pelanggan}</h4>
                                    <p className="text-xs text-slate-500">{order.nomor_wa}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${order.status === 'Selesai' ? 'bg-lime-100 text-lime-600' : 'bg-amber-100 text-amber-600'}`}>{order.status}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-4">
                                <p className="font-black text-cyan-600">Rp{Number(order.total_harga).toLocaleString()}</p>
                                <button onClick={() => setSelectedOrder(order)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">Detail</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* DETAIL MODAL */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white w-full max-w-lg rounded-[30px] overflow-hidden shadow-2xl animate-slide-in-up" onClick={e => e.stopPropagation()}>
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-black text-slate-900">Detail Pesanan</h3>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"><X size={20} /></button>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            <div className="mb-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Pengiriman</p>
                                <p className="text-sm font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl">{selectedOrder.alamat}</p>
                            </div>
                            <div className="space-y-4">
                                {parseItems(selectedOrder.detail_pesanan).map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 border border-slate-100 rounded-2xl">
                                        <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden">
                                            <img src={item.gambar_url || "https://placehold.co/100"} alt={item.nama_obat} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-sm">{item.nama_obat}</p>
                                            <p className="text-xs text-slate-500">Qty: {item.qty} x Rp{item.harga.toLocaleString()}</p>
                                            <p className="font-bold text-cyan-600 text-sm mt-1">Rp{(item.harga * item.qty).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LaporanPenjualan;
