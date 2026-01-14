// src/pages/KatalogObatPage.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, ShoppingBag, ArrowLeft, Star, Package, Filter, XCircle,
  X, Trash2, Plus, Minus, ShoppingCart, Phone, Mail, MapPin,
  Facebook, Instagram, Clock, ArrowRight, Zap, Award
} from 'lucide-react';
import API_BASE_URL from '../config';
import Particles from "../components/Particles";

const KatalogObatPage = () => {
  const [obats, setObats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("nama");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const LOGO_URL = "/logo-apotek.jpeg";

  useEffect(() => {
    const fetchPublishedObats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/obat`);
        const data = await response.json();
        const published = (data.data || []).filter(item => item.is_published === true || item.is_published === 1);
        setObats(published);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishedObats();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => setCart(cart.filter(item => item.id !== productId));
  const updateQty = (productId, newQty) => {
    if (newQty <= 0) removeFromCart(productId);
    else setCart(cart.map(item => item.id === productId ? { ...item, qty: newQty } : item));
  };
  const getTotalItems = () => cart.reduce((sum, item) => sum + item.qty, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);

  const generateWhatsAppMessage = () => {
    let message = "Halo Apotek Hadinata, saya ingin pesan:\n\n";
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.nama_obat} - Qty: ${item.qty} - Rp${(item.harga * item.qty).toLocaleString()} \n`;
    });
    message += `\nTotal: Rp${getTotalPrice().toLocaleString()} \n\nMohon diproses. Terima kasih!`;
    return encodeURIComponent(message);
  };

  const categories = ["Semua", ...new Set(obats.map(o => o.kategori).filter(Boolean))];
  const filtered = obats
    .filter(o => selectedCategory === "Semua" || o.kategori === selectedCategory)
    .filter(o => o.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "nama") return a.nama_obat.localeCompare(b.nama_obat);
      if (sortBy === "harga-asc") return a.harga - b.harga;
      if (sortBy === "harga-desc") return b.harga - a.harga;
      return 0;
    });

  return (
    <div className="min-h-screen bg-mesh font-sans text-white relative overflow-hidden">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-lime-500/10 rounded-full blur-[150px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '-5s' }}></div>

      <Particles count={100} opacity={0.4} speed={0.4} />

      <header className="sticky top-0 z-[60] bg-slate-900/60 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center p-2 border border-slate-50 group-hover:rotate-6 transition-transform">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain"
                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3063/3063067.png"} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">APOTEK <span className="text-cyan-400">HADINATA</span></h1>
          </Link>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowCart(true)}
              className="relative w-12 h-12 bg-white/5 text-white border border-white/10 rounded-2xl flex items-center justify-center hover:bg-cyan-500/20 transition-all shadow-xl"
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && <span className="absolute -top-2 -right-2 w-6 h-6 bg-lime-500 text-white text-[10px] flex items-center justify-center rounded-full font-black animate-bounce shadow-lg">{getTotalItems()}</span>}
            </button>
            <button onClick={() => navigate('/')} className="hidden md:flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-white transition bg-transparent">
              <ArrowLeft size={16} /> Kembali
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-16 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-cyan-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8">
              <Package size={14} /> APOTEK HADINATA
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
              Temukan Produk <br /><span className="text-gradient">Kesehatan Terbaik.</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium max-w-2xl leading-relaxed">Pencarian obat lengkap dengan jaminan keaslian 100% dan pengiriman instan langsung ke rumah Anda.</p>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] mb-16 flex flex-col md:flex-row gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text" placeholder="Cari nama produk..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[28px] outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 transition-all font-bold text-sm text-white placeholder:text-slate-600"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] outline-none font-black text-[10px] uppercase tracking-widest text-slate-300 cursor-pointer shadow-sm hover:border-cyan-500 transition-all appearance-none"
              >
                {categories.map(c => <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>)}
              </select>
              <select
                value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="px-8 py-5 bg-white/5 border border-white/10 rounded-[28px] outline-none font-black text-[10px] uppercase tracking-widest text-slate-300 cursor-pointer shadow-sm hover:border-cyan-500 transition-all appearance-none"
              >
                <option value="nama" className="bg-slate-900 text-white">Urut Nama</option>
                <option value="harga-asc" className="bg-slate-900 text-white">Termurah</option>
                <option value="harga-desc" className="bg-slate-900 text-white">Termahal</option>
              </select>
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 md:h-96 bg-slate-900/50 rounded-[32px] md:rounded-[40px] animate-pulse"></div>)
            ) : filtered.length === 0 ? (
              <div className="col-span-full py-40 text-center animate-fade-in">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500"><Package size={40} /></div>
                <p className="text-slate-400 font-bold italic">Produk tidak ditemukan.</p>
              </div>
            ) : (
              filtered.map(obat => (
                <div key={obat.id} className="group glass-card-dark rounded-[24px] md:rounded-[40px] p-3 md:p-6 border border-white/10 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 flex flex-col animate-fade-in">
                  <div className="relative h-32 sm:h-40 md:h-56 mb-4 md:mb-8 overflow-hidden rounded-[16px] md:rounded-[32px] cursor-pointer" onClick={() => setSelectedProduct(obat)}>
                    <img src={obat.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={obat.nama_obat} />
                    <div className="absolute top-2 left-2 md:top-4 md:left-4"><span className="bg-slate-900/80 backdrop-blur-md px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-[7px] md:text-[9px] font-black text-cyan-400 uppercase tracking-widest shadow-xl border border-white/10">{obat.kategori}</span></div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-black text-white text-xs md:text-lg mb-1 md:mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => setSelectedProduct(obat)}>{obat.nama_obat}</h4>
                    <p className="hidden md:block text-[11px] text-slate-400 font-medium italic mb-6 line-clamp-2">"{obat.deskripsi || 'Produk farmasi berkualitas premium'}"</p>
                    <div className="flex items-center justify-between pt-3 md:pt-6 border-t border-white/5 mt-auto">
                      <div>
                        <p className="text-[7px] md:text-[9px] font-black text-slate-400 md:text-slate-300 uppercase tracking-widest mb-0.5 md:mb-1">HARGA</p>
                        <p className="text-sm md:text-2xl font-black text-cyan-400 tracking-tight">Rp{Math.floor(obat.harga).toLocaleString()}</p>
                      </div>
                      <button onClick={() => addToCart(obat)} className="w-8 h-8 md:w-14 md:h-14 bg-white/5 text-white border border-white/10 rounded-lg md:rounded-2xl flex items-center justify-center hover:bg-lime-500 hover:rotate-6 active:scale-95 transition-all">
                        <Plus size={16} className="md:w-6 md:h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950/80 backdrop-blur-xl text-white py-20 relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center gap-8 mb-12">
            <Instagram className="text-slate-500 hover:text-cyan-400 transition cursor-pointer" size={24} />
            <Facebook className="text-slate-500 hover:text-cyan-400 transition cursor-pointer" size={24} />
            <Phone className="text-slate-500 hover:text-cyan-400 transition cursor-pointer" size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2026 HADINATA PHARMACY GROUP • ALL RIGHTS RESERVED</p>
        </div>
      </footer>

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/60 backdrop-blur-md animate-fade-in" onClick={() => setShowCart(false)}>
          <div className="w-full max-w-lg bg-slate-900 h-screen flex flex-col shadow-2xl animate-slide-in-right overflow-hidden rounded-l-[60px] border-l border-white/10" onClick={e => e.stopPropagation()}>
            <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div>
                <h3 className="text-3xl font-black tracking-tight mb-2 text-white">Keranjang</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{getTotalItems()} Item terpilih</p>
              </div>
              <button onClick={() => setShowCart(false)} className="w-14 h-14 bg-white/5 text-white border border-white/10 rounded-3xl flex items-center justify-center hover:bg-red-500/20 transition shadow-xl"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={50} className="text-slate-800 mb-8" />
                  <p className="text-slate-500 font-bold italic">Belum ada item terpilih.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-6 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
                      <img src={item.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-white text-sm mb-1">{item.nama_obat}</h4>
                      <p className="text-lg font-black text-cyan-400 mb-4">Rp{item.harga.toLocaleString()}</p>
                      <div className="flex items-center gap-4">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center bg-white/5 text-white rounded-lg border border-white/10 shadow-sm"><Minus size={14} /></button>
                        <span className="font-black text-white">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center bg-white/5 text-white rounded-lg border border-white/10 shadow-sm"><Plus size={14} /></button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-12 bg-white/5 rounded-t-[60px] shadow-2xl border-t border-white/10">
                <div className="flex justify-between items-center mb-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Harga</p>
                  <p className="text-4xl font-black text-cyan-400">Rp{getTotalPrice().toLocaleString()}</p>
                </div>
                <a href={`https://wa.me/628981335197?text=${generateWhatsAppMessage()}`} target="_blank" rel="noreferrer" className="block w-full py-8 premium-gradient text-white text-center font-black rounded-3xl text-xs uppercase tracking-[0.4em] shadow-xl shadow-cyan-500/20">Pesan Via WhatsApp</a>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={() => setSelectedProduct(null)}>
          <div className="glass-card-dark w-full max-w-4xl rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[95vh] relative border border-white/10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-white/10 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl hover:rotate-90 transition-all border border-white/10 z-20"><X size={20} className="md:w-6 md:h-6" /></button>
            <div className="md:w-1/2 h-48 sm:h-64 md:h-auto border-r border-white/5 overflow-hidden">
              <img src={selectedProduct.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto">
              <h3 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tighter leading-tight">{selectedProduct.nama_obat}</h3>
              <div className="flex gap-1 mb-6 md:mb-8">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="fill-amber-400 text-amber-400 md:w-3.5 md:h-3.5" />)}</div>
              <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed italic mb-8 md:mb-12 border-l-4 border-cyan-500 pl-6 md:pl-8">{selectedProduct.deskripsi || 'Produk farmasi berkualitas tinggi.'}</p>
              <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
                <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5">
                  <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Harga</p>
                  <p className="text-lg md:text-3xl font-black text-cyan-400">Rp{Number(selectedProduct.harga).toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5">
                  <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Stok</p>
                  <p className="text-lg md:text-3xl font-black text-white">{selectedProduct.stok} <span className="text-[8px] md:text-xs">UNIT</span></p>
                </div>
              </div>
              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full py-4 md:py-6 premium-gradient text-white font-black rounded-2xl md:rounded-3xl text-[10px] md:text-sm uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl shadow-cyan-500/20"
              >
                <Plus size={18} className="md:w-5 md:h-5" /> Tambah Ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KatalogObatPage;