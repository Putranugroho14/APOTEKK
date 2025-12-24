// src/components/ObatPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit3, PlusCircle, X, Package, Image as ImageIcon, Tag, Settings2, Layers, ArrowLeft, Pill, Search, Filter, RefreshCw } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001/api/obat";
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

const stokOptions = Array.from({ length: 101 }, (_, i) => i);
const hargaOptions = [500, 1000, 2000, 5000, 10000, 15000, 20000, 25000, 50000, 75000, 100000];
const kategoriOptions = ["Obat Bebas", "Obat Keras", "Suplemen", "Obat Bebas Terbatas", "Vitamin", "Antibiotik"];

const EditObatModal = ({ isOpen, onClose, obatData, onUpdate, getHeaders }) => {
    const [formData, setFormData] = useState(obatData);

    useEffect(() => { setFormData(obatData); }, [obatData]);

    const handleModalChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/${formData.id}`, formData, getHeaders());
            onUpdate("Data berhasil diperbarui!");
            onClose();
        } catch (err) { onUpdate(null, "Gagal memperbarui data."); }
    };

    if (!isOpen || !formData) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xl border-2 border-cyan-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-black text-cyan-900 flex items-center gap-2">
                        <Settings2 className="text-cyan-600" size={20} /> Edit Produk
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
                        <X className="text-slate-600" size={20} />
                    </button>
                </div>

                <form onSubmit={handleModalSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">Nama Produk</label>
                            <input
                                type="text"
                                name="nama_obat"
                                value={formData.nama_obat}
                                onChange={handleModalChange}
                                required
                                className="w-full p-2.5 rounded-lg bg-slate-50 border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">Kategori</label>
                            <select
                                name="kategori"
                                value={formData.kategori || ""}
                                onChange={handleModalChange}
                                className="w-full p-2.5 rounded-lg bg-slate-50 border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 transition"
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {kategoriOptions.map(kat => <option key={kat} value={kat}>{kat}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">Stok</label>
                            <select
                                name="stok"
                                value={formData.stok}
                                onChange={handleModalChange}
                                className="w-full p-2.5 rounded-lg bg-slate-50 border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 transition"
                            >
                                {stokOptions.map(n => <option key={n} value={n}>{n} Unit</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">Harga</label>
                            <select
                                name="harga"
                                value={formData.harga}
                                onChange={handleModalChange}
                                className="w-full p-2.5 rounded-lg bg-slate-50 border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 transition"
                            >
                                {hargaOptions.map(h => <option key={h} value={h}>Rp {h.toLocaleString()}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">Deskripsi</label>
                        <textarea
                            name="deskripsi"
                            value={formData.deskripsi || ""}
                            onChange={handleModalChange}
                            className="w-full p-2.5 rounded-lg bg-slate-50 border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 h-20 resize-none transition"
                            placeholder="Deskripsi produk..."
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">Gambar (URL)</label>
                        <input
                            type="url"
                            name="gambar_url"
                            value={formData.gambar_url}
                            onChange={handleModalChange}
                            className="w-full p-2.5 rounded-lg bg-slate-50 border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 transition"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="bg-cyan-50 p-3 rounded-xl border-2 border-cyan-200 flex justify-between items-center">
                        <div>
                            <p className="text-sm font-bold text-cyan-900">Publikasikan Produk</p>
                            <p className="text-xs text-cyan-700">Tampilkan di katalog publik</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_published"
                                checked={formData.is_published}
                                onChange={handleModalChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 text-sm"
                    >
                        💾 Simpan Perubahan
                    </button>
                </form>
            </div>
        </div>
    );
};

const ObatPage = () => {
    const navigate = useNavigate();
    const [obats, setObats] = useState([]);
    const [filteredObats, setFilteredObats] = useState([]);
    const [createForm, setCreateForm] = useState({
        nama_obat: "",
        deskripsi: "",
        kategori: "",
        stok: 0,
        harga: 500,
        gambar_url: "",
        is_published: true
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingObat, setEditingObat] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedKategori, setSelectedKategori] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [stokFilter, setStokFilter] = useState("");

    const user = decodeTokenPayload(getToken());
    const isAdmin = user && user.role === "admin";

    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" }
    });

    const fetchObats = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL);
            setObats(response.data.data || []);
            setFilteredObats(response.data.data || []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchObats(); }, []);

    useEffect(() => {
        let filtered = [...obats];

        if (searchQuery) {
            filtered = filtered.filter(obat =>
                obat.nama_obat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (obat.deskripsi && obat.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (selectedKategori) {
            filtered = filtered.filter(obat => obat.kategori === selectedKategori);
        }

        if (selectedStatus === "published") {
            filtered = filtered.filter(obat => obat.is_published);
        } else if (selectedStatus === "draft") {
            filtered = filtered.filter(obat => !obat.is_published);
        }

        if (stokFilter === "low") {
            filtered = filtered.filter(obat => obat.stok < 10);
        } else if (stokFilter === "available") {
            filtered = filtered.filter(obat => obat.stok >= 10);
        } else if (stokFilter === "out") {
            filtered = filtered.filter(obat => obat.stok === 0);
        }

        setFilteredObats(filtered);
    }, [searchQuery, selectedKategori, selectedStatus, stokFilter, obats]);

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedKategori("");
        setSelectedStatus("");
        setStokFilter("");
    };

    const handleCreateObat = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, createForm, getHeaders());
            setMessage("Produk baru berhasil ditambahkan!");
            setCreateForm({
                nama_obat: "",
                deskripsi: "",
                kategori: "",
                stok: 0,
                harga: 500,
                gambar_url: "",
                is_published: true
            });
            fetchObats();
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Gagal menambah data.";
            alert(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus produk ini?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`, getHeaders());
            setMessage("Produk berhasil dihapus.");
            fetchObats();
            setTimeout(() => setMessage(""), 3000);
        } catch (err) { alert("Gagal menghapus produk."); }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 text-slate-800 pb-20 font-sans">
            <nav className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-2xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-white/20 rounded-xl transition"
                            >
                                <ArrowLeft size={24} />
                            </button>

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
                                    <Package className="text-cyan-600" size={28} />
                                </div>
                            </div>

                            <div>
                                <h1 className="text-2xl font-black tracking-tight">KELOLA PRODUK</h1>
                                <p className="text-sm text-cyan-100">Manajemen Stok Obat</p>
                            </div>
                        </div>

                        <div className="bg-lime-500 px-6 py-3 rounded-full shadow-xl">
                            <p className="text-sm font-black">
                                {filteredObats.length} / {obats.length} Produk
                            </p>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 mt-8">
                {message && (
                    <div className="mb-6 p-3 bg-lime-100 border-2 border-lime-500 text-lime-800 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                        <span className="text-lg">✓</span> {message}
                    </div>
                )}

                {isAdmin && (
                    <section className="mb-8">
                        <div className="bg-white border-2 border-cyan-200 rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-black text-cyan-900 mb-4 flex items-center gap-2">
                                <PlusCircle className="text-lime-600" size={20} /> Tambah Produk Baru
                            </h3>

                            <form onSubmit={handleCreateObat} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block flex items-center gap-2">
                                            <Package size={12} /> Nama Produk
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Paracetamol 500mg"
                                            value={createForm.nama_obat}
                                            onChange={(e) => setCreateForm({ ...createForm, nama_obat: e.target.value })}
                                            required
                                            className="w-full bg-slate-50 p-3 rounded-lg border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block flex items-center gap-2">
                                            <Layers size={12} /> Kategori
                                        </label>
                                        <select
                                            value={createForm.kategori}
                                            onChange={(e) => setCreateForm({ ...createForm, kategori: e.target.value })}
                                            className="w-full bg-slate-50 p-3 rounded-lg border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 transition"
                                        >
                                            <option value="">-- Pilih Kategori --</option>
                                            {kategoriOptions.map(kat => <option key={kat} value={kat}>{kat}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">Stok Awal</label>
                                        <select
                                            value={createForm.stok}
                                            onChange={(e) => setCreateForm({ ...createForm, stok: e.target.value })}
                                            className="w-full bg-slate-50 p-3 rounded-lg border-2 border-cyan-200 text-cyan-900 text-sm outline-none"
                                        >
                                            {stokOptions.map(n => <option key={n} value={n}>{n} Unit</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">Harga Jual</label>
                                        <select
                                            value={createForm.harga}
                                            onChange={(e) => setCreateForm({ ...createForm, harga: e.target.value })}
                                            className="w-full bg-slate-50 p-3 rounded-lg border-2 border-cyan-200 text-cyan-900 text-sm outline-none"
                                        >
                                            {hargaOptions.map(h => <option key={h} value={h}>Rp {h.toLocaleString('id-ID')}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">URL Gambar</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-3 text-cyan-400" size={16} />
                                        <input
                                            type="url"
                                            placeholder="https://example.com/image.jpg"
                                            value={createForm.gambar_url}
                                            onChange={(e) => setCreateForm({ ...createForm, gambar_url: e.target.value })}
                                            className="w-full bg-slate-50 p-3 pl-11 rounded-lg border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">Deskripsi</label>
                                    <textarea
                                        placeholder="Contoh: Pereda demam dan nyeri..."
                                        value={createForm.deskripsi}
                                        onChange={(e) => setCreateForm({ ...createForm, deskripsi: e.target.value })}
                                        required
                                        className="w-full bg-slate-50 p-3 rounded-lg border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 h-20 resize-none transition"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 text-sm"
                                >
                                    💾 Simpan Produk
                                </button>
                            </form>
                        </div>
                    </section>
                )}

                <div className="bg-white rounded-2xl border-2 border-cyan-200 shadow-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Filter className="text-cyan-600" size={20} />
                            <h3 className="text-lg font-black text-cyan-900">Filter & Pencarian</h3>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition"
                        >
                            <RefreshCw size={16} /> Reset
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2">
                            <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">
                                Cari Produk
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-cyan-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari nama obat atau deskripsi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-3 pl-11 rounded-lg bg-slate-50 border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">
                                Kategori
                            </label>
                            <select
                                value={selectedKategori}
                                onChange={(e) => setSelectedKategori(e.target.value)}
                                className="w-full p-3 rounded-lg bg-slate-50 border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 transition"
                            >
                                <option value="">Semua Kategori</option>
                                {kategoriOptions.map(kat => (
                                    <option key={kat} value={kat}>{kat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full p-3 rounded-lg bg-slate-50 border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 transition"
                            >
                                <option value="">Semua Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="text-xs font-bold text-cyan-900 uppercase ml-1 mb-1.5 block">
                                Stok
                            </label>
                            <select
                                value={stokFilter}
                                onChange={(e) => setStokFilter(e.target.value)}
                                className="w-full p-3 rounded-lg bg-slate-50 border-2 border-cyan-200 text-cyan-900 text-sm outline-none focus:border-cyan-500 transition"
                            >
                                <option value="">Semua Stok</option>
                                <option value="available">Stok Tersedia (≥10)</option>
                                <option value="low">Stok Menipis (&lt;10)</option>
                                <option value="out">Stok Habis (0)</option>
                            </select>
                        </div>

                        <div className="lg:col-span-2 flex items-end">
                            <div className="text-xs text-slate-600 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200 w-full">
                                <span className="font-bold text-cyan-900">Hasil:</span> Menampilkan {filteredObats.length} dari {obats.length} produk
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {isLoading ? (
                        <div className="col-span-full text-center py-20">
                            <div className="animate-spin w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                            <p className="text-cyan-900 font-bold text-sm">Memuat data...</p>
                        </div>
                    ) : filteredObats.length === 0 ? (
                        <div className="col-span-full text-center py-20">
                            <Package size={64} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold text-lg">Tidak ada produk ditemukan</p>
                            <p className="text-slate-400 text-sm mt-2">Coba ubah filter pencarian Anda</p>
                        </div>
                    ) : filteredObats.map(obat => (
                        <div key={obat.id} className="group bg-white rounded-2xl border-2 border-cyan-100 flex flex-col shadow-md hover:shadow-xl hover:border-cyan-300 transition-all duration-300 overflow-hidden">
                            <div className="h-40 relative overflow-hidden bg-slate-100">
                                <img
                                    src={obat.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"}
                                    alt={obat.nama_obat}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {obat.kategori && (
                                    <div className="absolute top-2 left-2">
                                        <div className="px-2 py-1 rounded-full text-[10px] font-bold bg-cyan-600 text-white shadow-lg">
                                            {obat.kategori}
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-2 right-2">
                                    <div className={`px-2 py-1 rounded-full text-[10px] font-bold shadow-lg ${obat.is_published ? 'bg-lime-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {obat.is_published ? '● Live' : '○ Draft'}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-base font-black text-cyan-900 leading-tight line-clamp-2">{obat.nama_obat}</h4>
                                    <Tag className="text-cyan-400 flex-shrink-0 ml-2" size={14} />
                                </div>
                                <p className="text-slate-600 text-xs mb-4 line-clamp-2 italic">"{obat.deskripsi}"</p>

                                <div className="flex gap-3 mb-4">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Harga</p>
                                        <p className="text-base font-black text-cyan-700">Rp{Number(obat.harga).toLocaleString()}</p>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Stok</p>
                                        <p className={`text-base font-black ${obat.stok < 10 ? 'text-red-500' : 'text-lime-600'}`}>
                                            {obat.stok} <span className="text-[10px] font-normal text-slate-500">unit</span>
                                        </p>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <div className="flex gap-2 pt-3 border-t-2 border-slate-100">
                                        <button
                                            onClick={() => { setEditingObat(obat); setIsModalOpen(true); }}
                                            className="flex-1 py-2 bg-cyan-100 hover:bg-cyan-600 text-cyan-700 hover:text-white rounded-lg transition-all font-bold text-xs flex items-center justify-center gap-1.5"
                                        >
                                            <Edit3 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(obat.id)}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isAdmin && isModalOpen && (
                <EditObatModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    obatData={editingObat}
                    onUpdate={(msg, err) => { if (msg) { setMessage(msg); fetchObats(); } }}
                    getHeaders={getHeaders}
                />
            )}
        </div>
    );
};

export default ObatPage;