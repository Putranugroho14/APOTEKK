// src/pages/KatalogObatPage.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, ShoppingBag, ArrowLeft, Star, Package,
  X, Trash2, Plus, Minus, ShoppingCart, Phone,
  Facebook, Instagram, ChevronDown
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
  const [address, setAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
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
    setShowCart(true); // Auto-open cart when item added
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
    message += `\nTotal: Rp${getTotalPrice().toLocaleString()}`;

    if (address.trim()) {
      message += `\n\nAlamat Pengiriman:\n${address}`;
    }

    message += `\n\nMohon diproses. Terima kasih!`;
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
    <div className="min-h-screen bg-mesh font-sans text-slate-900 relative overflow-hidden">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 bg-dot-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-lime-500/5 rounded-full blur-[150px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '-5s' }}></div>

      <Particles count={50} opacity={0.2} speed={0.4} color="#06b6d4" />

      <header className={`sticky top-0 z-[60] bg-slate-50/80 border-b border-slate-200/60 shadow-xl backdrop-blur-md transition-all duration-300`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center p-2 border border-slate-100 group-hover:rotate-6 transition-transform shadow-cyan-500/5">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain"
                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3063/3063067.png"} />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900">APOTEK <span className="text-cyan-500">HADINATA</span></h1>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCart(true)}
              className="relative w-10 h-10 md:w-12 md:h-12 bg-cyan-500/10 text-cyan-600 border border-cyan-100 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-cyan-500/20 transition-all shadow-xl shadow-cyan-500/5"
            >
              <ShoppingCart size={18} className="md:w-5 md:h-5" />
              {getTotalItems() > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-lime-500 text-white text-[9px] flex items-center justify-center rounded-full font-black animate-bounce shadow-lg">{getTotalItems()}</span>}
            </button>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 font-black text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 hover:text-cyan-600 transition bg-slate-50 px-3 py-2 rounded-xl md:px-0 md:py-0 md:bg-transparent">
              <ArrowLeft size={14} className="md:w-4 md:h-4" /> <span className="hidden xs:inline">Kembali</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-16 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-cyan-50 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-100/50 text-cyan-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 shadow-sm">
              <Package size={14} /> APOTEK HADINATA
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-6">
              Temukan Produk <br /><span className="text-gradient">Kesehatan Terbaik.</span>
            </h2>
            <p className="text-lg text-slate-600 font-bold max-w-2xl leading-relaxed">Pencarian obat lengkap dengan jaminan keaslian 100% dan pengiriman instan langsung ke rumah Anda.</p>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="bg-slate-100/40 backdrop-blur-xl p-6 md:p-8 rounded-[40px] border border-slate-200/60 shadow-premium mb-16 flex flex-col lg:flex-row gap-6 md:gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex-1 relative">
              <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 focus-within:text-cyan-600 transition-colors" size={20} />
              <input
                type="text" placeholder="Cari obat..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 md:pl-16 pr-6 md:pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] outline-none focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500/30 transition-all font-bold text-xs md:text-sm text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div className="grid grid-cols-2 lg:flex gap-3 md:gap-4">
              <div className="relative">
                <select
                  value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full lg:w-auto pl-4 pr-10 py-5 bg-slate-50 border border-slate-100 rounded-[28px] outline-none font-black text-[8px] md:text-[10px] uppercase tracking-wider text-slate-600 cursor-pointer shadow-sm hover:border-cyan-500 transition-all appearance-none relative"
                >
                  {categories.map(c => <option key={c} value={c} className="bg-white text-slate-900">{c}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>

              <div className="relative">
                <select
                  value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="w-full lg:w-auto pl-4 pr-10 py-5 bg-slate-50 border border-slate-100 rounded-[28px] outline-none font-black text-[8px] md:text-[10px] uppercase tracking-wider text-slate-600 cursor-pointer shadow-sm hover:border-cyan-500 transition-all appearance-none relative"
                >
                  <option value="nama" className="bg-white text-slate-900">Urut Nama</option>
                  <option value="harga-asc" className="bg-white text-slate-900">Termurah</option>
                  <option value="harga-desc" className="bg-white text-slate-900">Termahal</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 md:h-96 bg-slate-900/50 rounded-[32px] md:rounded-[40px] animate-pulse"></div>)
            ) : filtered.length === 0 ? (
              <div className="col-span-full py-40 text-center animate-fade-in">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300"><Package size={40} /></div>
                <p className="text-slate-400 font-bold italic">Produk tidak ditemukan.</p>
              </div>
            ) : (
              filtered.map(obat => (
                <div key={obat.id} className="group bg-white rounded-2xl md:rounded-[28px] p-2.5 md:p-3.5 border border-slate-100 shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center animate-fade-in max-w-[220px] mx-auto w-full">
                  <div className="relative w-full aspect-[1/1.2] mb-3 md:mb-4 overflow-hidden rounded-xl md:rounded-[20px] cursor-pointer bg-slate-50" onClick={() => setSelectedProduct(obat)}>
                    <img src={obat.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={obat.nama_obat} />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90%]">
                      <span className="block text-center bg-white/95 backdrop-blur-md px-1.5 py-1 rounded-full text-[6px] md:text-[8px] font-black text-cyan-600 uppercase tracking-[0.2em] shadow-lg border border-slate-100">{obat.kategori}</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col w-full">
                    <h4 className="font-black text-slate-800 text-[11px] md:text-sm mb-1.5 md:mb-2 line-clamp-1 group-hover:text-cyan-600 transition-colors cursor-pointer text-center" onClick={() => setSelectedProduct(obat)}>{obat.nama_obat}</h4>

                    <div className="flex items-center justify-center gap-1.5 mb-3 md:mb-4 w-full">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={8} className={`${s <= (obat.rating || 4.5) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} md:w-2.5 md:h-2.5`} />
                        ))}
                      </div>
                      <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase">{(obat.rating || 4.8).toFixed(1)} / 5</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto w-full">
                      <div className="text-left">
                        <p className="text-[6px] md:text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">HARGA TERBAIK</p>
                        <p className="text-xs md:text-lg font-black text-cyan-600 tracking-tighter leading-none">Rp{Math.floor(obat.harga).toLocaleString()}</p>
                      </div>
                      <button onClick={() => addToCart(obat)} className="w-7 h-7 md:w-9 md:h-9 bg-slate-50 text-cyan-600 border border-slate-100 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-cyan-500 hover:text-white hover:rotate-6 active:scale-95 transition-all">
                        <Plus size={14} className="md:w-5 md:h-5" />
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
      <footer className="bg-white border-t border-slate-100 py-20 relative z-10 shadow-inner">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center gap-8 mb-12">
            <a href="https://instagram.com/hadinata" target="_blank" rel="noreferrer"><Instagram className="text-slate-400 hover:text-cyan-500 transition cursor-pointer" size={24} /></a>
            <a href="https://facebook.com/hadinata" target="_blank" rel="noreferrer"><Facebook className="text-slate-400 hover:text-cyan-500 transition cursor-pointer" size={24} /></a>
            <a href="https://wa.me/6281390807472" target="_blank" rel="noreferrer" className="flex items-center gap-2 group decoration-transparent">
              <Phone className="text-slate-600 group-hover:text-cyan-500 transition cursor-pointer" size={24} />
              <span className="text-slate-600 group-hover:text-cyan-500 font-black transition text-sm">0813-9080-7472</span>
            </a>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">© 2026 HADINATA PHARMACY GROUP • ALL RIGHTS RESERVED</p>
        </div>
      </footer>

      {/* CART MODAL - MODERN E-COMMERCE STYLE */}
      {showCart && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 animate-fade-in" onClick={() => setShowCart(false)}>
          <div className="w-full max-w-md bg-white h-screen flex flex-col shadow-2xl animate-slide-in-right overflow-hidden" onClick={e => e.stopPropagation()}>

            {/* HEADER */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
              <h2 className="text-lg font-bold text-gray-800">Keranjang Saya</h2>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <ShoppingBag size={64} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">Keranjang masih kosong</p>
                  <p className="text-gray-400 text-sm mt-2">Mulai belanja sekarang!</p>
                </div>
              ) : (
                <>
                  {/* PRODUCT LIST */}
                  <div className="p-4 space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-3 bg-white border border-gray-200 rounded-lg p-3">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200"}
                            alt={item.nama_obat}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-1">{item.nama_obat}</h3>
                          <p className="text-sm font-bold text-gray-900">Rp {item.harga.toLocaleString()}</p>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-amber-100 hover:bg-amber-200 text-amber-700 rounded transition"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-semibold text-sm">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-amber-100 hover:bg-amber-200 text-amber-700 rounded transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition self-start"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* CHECKOUT FORM */}
                  <div className="px-4 pb-4 space-y-4">
                    {/* Address Section */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-sm text-gray-800 mb-3">Detail Pengiriman</h3>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                          placeholder="Masukkan nama Anda"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nomor WhatsApp</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                          placeholder="08xxxxxxxxxx"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Alamat Lengkap</label>
                        <textarea
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition resize-none"
                          placeholder="Masukkan alamat pengiriman lengkap..."
                          rows="3"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* STICKY BOTTOM - SUMMARY & CHECKOUT */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 bg-white p-4 space-y-3">
                {/* Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span className="font-semibold">Rp {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-200">
                    <span>TOTAL</span>
                    <span className="text-amber-600">Rp {getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={async () => {
                    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
                      alert("Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat pengiriman!");
                      return;
                    }

                    try {
                      await fetch(`${API_BASE_URL}/api/penjualan`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          nama_pelanggan: customerName,
                          nomor_wa: customerPhone,
                          alamat: address,
                          detail_pesanan: cart,
                          total_harga: getTotalPrice()
                        })
                      });

                      window.open(`https://wa.me/6281390807472?text=${generateWhatsAppMessage()}`, '_blank');
                      setShowCart(false);
                      setCart([]);
                      setCustomerName("");
                      setCustomerPhone("");
                      setAddress("");
                      alert("Pesanan berhasil dibuat! Silahkan lanjutkan konfirmasi di WhatsApp.");
                    } catch (error) {
                      console.error("Gagal menyimpan pesanan:", error);
                      alert("Terjadi kesalahan. Mengalihkan ke WhatsApp...");
                      window.open(`https://wa.me/6281390807472?text=${generateWhatsAppMessage()}`, '_blank');
                    }
                  }}
                  disabled={!address.trim() || !customerName.trim() || !customerPhone.trim()}
                  className={`w-full py-3.5 rounded-lg font-bold text-sm transition-all ${(!address.trim() || !customerName.trim() || !customerPhone.trim())
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 active:scale-95'
                    }`}
                >
                  Pesan Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full max-w-6xl rounded-[40px] md:rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col md:flex-row h-auto max-h-[90vh] relative animate-scale-in" onClick={e => e.stopPropagation()}>
            {/* CLOSE BUTTON */}
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-16 md:h-16 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-50 hover:text-red-500 transition-all z-20 border border-slate-100"><X size={28} /></button>

            {/* LEFT SIDE: IMAGE CONTAINER */}
            <div className="md:w-1/2 h-80 md:h-auto bg-[#f1f5f9] relative flex items-center justify-center p-12">
              <div className="relative w-full h-full flex items-center justify-center animate-float">
                <img src={selectedProduct.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"}
                  className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]" alt={selectedProduct.nama_obat} />
              </div>
              <div className="absolute bottom-10 left-10">
                <span className="bg-[#0097b2] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Apotek Hadinata</span>
              </div>
            </div>

            {/* RIGHT SIDE: INFO SECTION */}
            <div className="md:w-1/2 p-8 md:p-16 bg-white overflow-y-auto custom-scrollbar flex flex-col justify-center">
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 tracking-tighter leading-tight drop-shadow-sm">{selectedProduct.nama_obat}</h3>

              <div className="flex items-center gap-1 mb-6">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={18} className={`${s <= (selectedProduct.rating || 4.5) ? "fill-[#ffc107] text-[#ffc107]" : "fill-slate-200 text-slate-200"}`} />
                  ))}
                </div>
                <span className="ml-3 text-slate-400 font-bold text-sm tracking-widest">({selectedProduct.rating || 4.5})</span>
              </div>

              <div className="mb-8">
                <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed italic pr-4">
                  {selectedProduct.deskripsi || 'Produk farmasi berkualitas tinggi dikembangkan untuk pemulihan yang efektif dan aman.'}
                </p>
              </div>

              <div className="flex flex-row gap-4 md:gap-6 mb-8">
                <div className="bg-slate-50 p-5 md:p-6 rounded-[24px] border border-slate-100 flex-1 flex flex-row items-center justify-between min-w-0">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Harga Unit</p>
                  <p className="text-base md:text-xl font-black text-cyan-600 tracking-tighter">Rp{Number(selectedProduct.harga).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-5 md:p-6 rounded-[24px] border border-slate-100 flex-1 flex flex-row items-center justify-between min-w-0">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sedia Stok</p>
                  <p className="text-base md:text-xl font-black text-slate-800 tracking-tighter">{selectedProduct.stok} <span className="text-[10px] text-slate-500 uppercase">Unit</span></p>
                </div>
              </div>

              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full py-6 md:py-8 bg-[#0097b2] hover:bg-[#00829a] text-white font-black rounded-3xl text-sm md:text-base uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <ShoppingBag size={24} className="group-hover:-rotate-12 transition-transform" /> Masukkan Keranjang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KatalogObatPage;