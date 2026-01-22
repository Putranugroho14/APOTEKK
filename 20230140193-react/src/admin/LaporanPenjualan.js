import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Clock, CheckCircle, MessageCircle, ShoppingCart, Package,
    LogOut, Search, RefreshCw, Eye, Menu, X, LayoutDashboard, FileText
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
    // const [adminData, setAdminData] = useState({ nama: 'Admin', username: 'admin' });
    const [selectedOrder, setSelectedOrder] = useState(null); // For Detail Modal
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
        const filtered = penjualans.filter(p =>
            p.nama_pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nomor_wa.includes(searchQuery)
        );
        setFilteredPenjualans(filtered);
    }, [searchQuery, penjualans]);

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

    // const handleDelete = async (id) => {
    //     if (window.confirm("Hapus data penjualan ini permanen?")) {
    //         try {
    //             const token = localStorage.getItem('token');
    //             await axios.delete(`${API_BASE_URL}/api/penjualan/${id}`, {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });
    //             alert("Data berhasil dihapus!");
    //             fetchPenjualans();
    //         } catch (err) { alert("Gagal menghapus data"); }
    //     }
    // };

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
                    <div className="glass-card-dark px-8 py-5 border border-white/10 rounded-[24px] shadow-xl w-full md:w-auto bg-white">
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] mb-1">Total Pesanan</p>
                        <p className="text-3xl font-black text-slate-900 tracking-widest leading-none">{penjualans.length}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-card-dark p-6 rounded-[40px] border border-white/10 mb-10 shadow-xl flex flex-col md:flex-row gap-6 bg-white">
                    <div className="flex-1 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama pembeli atau WhatsApp..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[30px] outline-none focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-sm font-bold text-slate-900 placeholder-slate-400 shadow-inner"
                        />
                    </div>
                    <button onClick={() => setSearchQuery("")} className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-[30px] flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-white transition-all transform hover:rotate-90">
                        <RefreshCw size={22} />
                    </button>
                </div>

                {/* Table Layout */}
                <div className="hidden lg:block glass-card-dark rounded-[40px] border border-white/10 shadow-xl overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tanggal</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pelanggan</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Total Belanja</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [1, 2, 3].map(i => <tr key={i}><td colSpan="5" className="p-8"><div className="h-8 bg-slate-50 rounded-xl animate-pulse"></div></td></tr>)
                                ) : filteredPenjualans.length === 0 ? (
                                    <tr><td colSpan="5" className="p-20 text-center text-slate-400 italic">Tidak ada data penjualan.</td></tr>
                                ) : (
                                    filteredPenjualans.map(order => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-all duration-300 group">
                                            <td className="p-8">
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                                <p className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest"><Clock size={10} /> {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
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
                                                    <button onClick={() => setSelectedOrder(order)} className="w-10 h-10 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all" title="Lihat Order">
                                                        <Eye size={16} />
                                                    </button>
                                                    <a href={`https://wa.me/${order.nomor_wa.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-cyan-100 text-cyan-600 hover:bg-cyan-200 rounded-xl flex items-center justify-center transition-all" title="WhatsApp">
                                                        <MessageCircle size={16} />
                                                    </a>
                                                    {order.status !== 'Selesai' && (
                                                        <button onClick={() => handleUpdateStatus(order.id, 'Selesai')} className="w-10 h-10 bg-lime-100 text-lime-600 hover:bg-lime-200 rounded-xl flex items-center justify-center transition-all" title="Selesaikan">
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
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
