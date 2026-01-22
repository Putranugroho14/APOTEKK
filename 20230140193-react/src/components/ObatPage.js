// src/components/ObatPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Trash2, Plus, X, Package,
    Pill, Search, LayoutDashboard,
    FileText, LogOut, Save, Eye, EyeOff, Menu, Upload, ShoppingCart
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import Particles from "./Particles";

const API_URL = `${API_BASE_URL}/api/obat`;
const LOGO_URL = "/logo-apotek.jpeg";

function getToken() { return localStorage.getItem("token"); }

const decodeTokenPayload = (token) => {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) { return null; }
};

const kategoriOptions = ["Obat Bebas", "Obat Keras", "Suplemen", "Obat Bebas Terbatas", "Vitamin", "Antibiotik"];

const initialFormState = {
    nama_obat: "", deskripsi: "", kategori: "", stok: 0, harga: 0, gambar_url: "", gambar_file: null, is_published: true
};

const ObatPage = () => {
    const navigate = useNavigate();
    const [obats, setObats] = useState([]);
    const [filteredObats, setFilteredObats] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingObat, setEditingObat] = useState(null);
    const [formData, setFormData] = useState(initialFormState);

    const user = decodeTokenPayload(getToken());

    useEffect(() => {
        if (!getToken()) navigate('/login');
        fetchObats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" }
    });

    const fetchObats = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL, getHeaders());
            setObats(response.data.data || []);
            setFilteredObats(response.data.data || []);
        } catch (err) {
            console.error("fetchObats error:", err);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        let filtered = obats.filter(obat =>
            obat.nama_obat.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedKategori === "" || obat.kategori === selectedKategori)
        );
        setFilteredObats(filtered);
    }, [searchQuery, selectedKategori, obats]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("nama_obat", formData.nama_obat || "");
            data.append("deskripsi", formData.deskripsi || "");
            data.append("stok", formData.stok || 0);
            data.append("harga", formData.harga || 0);
            data.append("kategori", formData.kategori || "Obat Bebas");
            data.append("is_published", formData.is_published);
            data.append("rating", formData.rating || 4.5);

            if (formData.gambar_file) {
                data.append("gambar", formData.gambar_file);
            }
            if (formData.gambar_url) {
                data.append("gambar_url", formData.gambar_url);
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            };

            if (editingObat) {
                await axios.put(`${API_URL}/${editingObat.id}`, data, config);
            } else {
                await axios.post(API_URL, data, config);
            }
            setShowAddForm(false);
            setEditingObat(null);
            setFormData(initialFormState);
            fetchObats();
        } catch (err) {
            console.error("FULL SUBMIT ERROR:", err);
            if (err.response && err.response.data) {
                console.log("SERVER ERROR DATA:", err.response.data);
                alert("SERVER ERROR:\n" + JSON.stringify(err.response.data, null, 2));
            } else {
                alert("Gagal terhubung ke server atau terjadi kesalahan fatal.");
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus produk ini?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`, getHeaders());
            fetchObats();
        } catch (err) { alert("Gagal menghapus produk"); }
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
            {/* BACKGROUND DECORATIONS - Light Theme Friendly */}
            <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>

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

                {/* ... Sidebar Items ... */}
                <div className="space-y-2 flex-1 relative z-10">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
                    <SidebarItem icon={Package} label="Kelola Obat" active />
                    <SidebarItem icon={FileText} label="Laporan Resep" path="/admin/resep" />
                    <SidebarItem icon={ShoppingCart} label="Laporan Penjualan" path="/admin/penjualan" />
                </div>

                <div className="mt-8 mb-4 relative z-10">
                    <button
                        onClick={() => { setEditingObat(null); setFormData(initialFormState); setShowAddForm(true); }}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 flex items-center justify-center gap-3"
                    >
                        <Plus size={16} /> Tambah Obat
                    </button>
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
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-600 mr-4 shadow-xl">
                            <Menu size={24} />
                        </button>
                        <div className="flex-1 lg:flex-none">
                            <h2 className="text-xl md:text-4xl font-black tracking-tight text-slate-900 mb-1 md:mb-2 leading-tight underline decoration-cyan-500/30">Manajemen <span className="text-cyan-500">Katalog Obat</span></h2>
                            <p className="text-slate-500 font-medium italic text-[10px] md:text-base">Update stok, harga, dan informasi secara real-time.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setShowAddForm(true); setEditingObat(null); }}
                        className="w-full md:w-auto px-6 py-4 md:px-10 md:py-5 premium-gradient text-white font-black rounded-xl md:rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 md:gap-4 uppercase tracking-[0.1em] md:tracking-[0.2em] text-[10px]"
                    >
                        <Plus size={18} className="md:w-5 md:h-5" /> Tambah Baru
                    </button>
                </header>

                {/* Filters */}
                <div className="glass-card-dark p-4 md:p-6 rounded-[24px] md:rounded-[40px] border border-white/5 mb-8 md:mb-14 shadow-2xl flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nama obat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 md:pl-14 md:pr-8 md:py-5 bg-white/5 border border-white/10 rounded-[20px] md:rounded-[30px] outline-none focus:bg-white/10 transition-all text-xs md:text-sm font-bold text-white placeholder-slate-600 shadow-inner"
                        />
                    </div>
                    <div className="w-full md:w-72">
                        <select
                            value={selectedKategori}
                            onChange={(e) => setSelectedKategori(e.target.value)}
                            className="w-full px-6 py-4 md:px-8 md:py-5 bg-white/5 border border-white/10 rounded-[20px] md:rounded-[30px] outline-none transition-all text-[10px] md:text-sm font-black text-slate-400 appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-slate-900 text-white">Semua Kategori</option>
                            {kategoriOptions.map(kat => <option key={kat} value={kat} className="bg-slate-900 text-white">{kat}</option>)}
                        </select>
                    </div>
                    <button onClick={() => { setSearchQuery(""); setSelectedKategori(""); }} className="hidden md:flex w-16 h-16 bg-white/5 border border-white/10 rounded-[30px] items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-white transition-all transform hover:rotate-90">
                        <RefreshCw size={22} />
                    </button>
                </div>

                {/* Grid Obat */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                    {isLoading ? (
                        [1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-white rounded-[32px] animate-pulse border border-slate-100"></div>)
                    ) : filteredObats.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                                <Package size={40} />
                            </div>
                            <p className="text-slate-400 font-bold">Produk tidak ditemukan</p>
                        </div>
                    ) : (
                        filteredObats.map(obat => (
                            <div key={obat.id} className="glass-card-dark rounded-[24px] md:rounded-[40px] border border-white/5 overflow-hidden shadow-2xl transition-all duration-500 group flex flex-col">
                                <div className="h-32 md:h-56 relative overflow-hidden bg-slate-900">
                                    <img src={obat.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"}
                                        alt={obat.nama_obat}
                                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[2000ms] opacity-60 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                                    <div className="absolute top-4 left-4 md:top-5 md:left-5">
                                        <span className="bg-cyan-500 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black shadow-xl uppercase tracking-widest">
                                            {obat.kategori}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4 md:top-5 md:right-5">
                                        {obat.is_published ?
                                            <div className="bg-lime-400/20 backdrop-blur-md text-lime-400 p-2 md:p-2.5 rounded-xl md:rounded-2xl border border-lime-400/20 shadow-lg"><Eye size={14} className="md:w-4 md:h-4" /></div> :
                                            <div className="bg-red-400/20 backdrop-blur-md text-red-500 p-2 md:p-2.5 rounded-xl md:rounded-2xl border border-red-500/20 shadow-lg"><EyeOff size={14} className="md:w-4 md:h-4" /></div>
                                        }
                                    </div>
                                </div>
                                <div className="p-3 md:p-6 flex flex-col flex-1 relative">
                                    <h4 className="font-black text-white mb-2 md:mb-3 truncate text-sm md:text-base tracking-tight" title={obat.nama_obat}>{obat.nama_obat}</h4>
                                    <p className="text-[10px] md:text-[11px] text-slate-500 font-medium line-clamp-2 mb-4 md:mb-6 italic leading-relaxed">"{obat.deskripsi}"</p>

                                    <div className="mt-auto grid grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-6 border-t border-white/5 mb-6 md:mb-8">
                                        <div>
                                            <p className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 md:mb-1.5">Stok</p>
                                            <p className={`text-sm md:text-base font-black ${obat.stok < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{obat.stok} <span className="text-[8px] opacity-30">UNIT</span></p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 md:mb-1.5">Harga</p>
                                            <p className="text-sm md:text-base font-black text-cyan-400">Rp{obat.harga.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 md:gap-4">
                                        <button
                                            onClick={() => { setEditingObat(obat); setFormData(obat); setShowAddForm(true); }}
                                            className="flex-1 py-3 md:py-4 bg-white/10 text-white hover:bg-cyan-500 hover:text-white border border-white/10 rounded-xl md:rounded-[20px] transition-all font-black text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em]"
                                        >
                                            Edit Item
                                        </button>
                                        <button
                                            onClick={() => handleDelete(obat.id)}
                                            className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl md:rounded-[20px] transition-all"
                                        >
                                            <Trash2 size={16} className="md:w-5 md:h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* MODAL FORM */}
            {showAddForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in" onClick={() => setShowAddForm(false)}>
                    <div className="glass-card-dark bg-slate-900/90 w-full max-w-2xl rounded-[30px] md:rounded-[60px] overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.2)] border border-white/10 animate-slide-in-up" onClick={e => e.stopPropagation()}>
                        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-white mb-1 uppercase">{editingObat ? 'Edit Produk' : 'Tambah Baru'}</h3>
                                <p className="text-xs font-black text-cyan-400 tracking-[0.3em] uppercase">Inventory System</p>
                            </div>
                            <button onClick={() => setShowAddForm(false)} className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all transform hover:rotate-90"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Identitas Produk</label>
                                <input
                                    type="text" required value={formData.nama_obat}
                                    onChange={e => setFormData({ ...formData, nama_obat: e.target.value })}
                                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[25px] outline-none focus:bg-white/10 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 transition-all font-bold text-base text-white placeholder-slate-700"
                                    placeholder="Nama Obat / Produk..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Kategori</label>
                                    <select
                                        required value={formData.kategori}
                                        onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[25px] outline-none focus:bg-white/10 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 transition-all font-black text-sm text-slate-400 appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-slate-900">Pilih Kategori</option>
                                        {kategoriOptions.map(k => <option key={k} value={k} className="bg-slate-900">{k}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Harga (IDR)</label>
                                    <input
                                        type="number" required value={formData.harga}
                                        onChange={e => setFormData({ ...formData, harga: parseInt(e.target.value) || 0 })}
                                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[25px] outline-none focus:bg-white/10 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 transition-all font-bold text-base text-white"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Stok Tersedia</label>
                                    <input
                                        type="number" required value={formData.stok}
                                        onChange={e => setFormData({ ...formData, stok: parseInt(e.target.value) || 0 })}
                                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[25px] outline-none focus:bg-white/10 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 transition-all font-bold text-base text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Visibilitas</label>
                                    <div className="flex items-center h-[60px] bg-white/5 border border-white/10 rounded-[25px] px-8 gap-4">
                                        <input
                                            type="checkbox" checked={formData.is_published}
                                            onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                                            className="w-6 h-6 rounded-lg text-cyan-500 focus:ring-cyan-500 border-white/10 bg-slate-800"
                                        />
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tayangkan di Katalog</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Rating Produk (1.0 - 5.0)</label>
                                <input
                                    type="number" step="0.1" min="1" max="5" value={formData.rating || 4.5}
                                    onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[25px] outline-none focus:bg-white/10 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 transition-all font-bold text-base text-white"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Foto Produk</label>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            type="file" accept="image/*"
                                            onChange={e => setFormData({ ...formData, gambar_file: e.target.files[0] })}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-full px-8 py-5 bg-white/5 border border-dashed border-white/10 rounded-[25px] flex items-center justify-center gap-3 group-hover:bg-white/10 transition-all">
                                            <Upload size={20} className="text-cyan-400" />
                                            <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                                                {formData.gambar_file ? formData.gambar_file.name : "Klik untuk unggah foto dari galeri"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">- ATAU GUNAKAN URL -</div>
                                    <input
                                        type="url" value={formData.gambar_url}
                                        onChange={e => setFormData({ ...formData, gambar_url: e.target.value })}
                                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[25px] outline-none focus:bg-white/10 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 transition-all font-bold text-base text-white placeholder-slate-700 font-mono text-sm"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">Detail Deskripsi</label>
                                <textarea
                                    required value={formData.deskripsi}
                                    onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[25px] outline-none focus:bg-white/10 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400 transition-all font-bold text-sm text-white h-32 resize-none placeholder-slate-700"
                                    placeholder="Jelaskan manfaat dan aturan pakai..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-6 premium-gradient text-white font-black rounded-[30px] shadow-[0_20px_40px_-10px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs"
                            >
                                <Save size={20} /> Konfirmasi & Simpan
                            </button>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

export default ObatPage;