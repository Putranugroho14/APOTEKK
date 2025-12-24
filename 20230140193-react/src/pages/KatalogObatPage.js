// src/pages/KatalogObatPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, ShoppingBag, ArrowLeft, Star, Package, Filter, XCircle, 
  X, Trash2, Plus, Minus, ShoppingCart, Phone, Mail, MapPin, 
  Facebook, Instagram, Clock
} from 'lucide-react';

const KatalogObatPage = () => {
  const [obats, setObats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("nama");
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // STATE KERANJANG
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const LOGO_URL = "/logo-apotek.jpeg";

  // FETCH SEMUA PRODUK PUBLISHED DARI API
  useEffect(() => {
    const fetchPublishedObats = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/obat');
        const data = await response.json();
        const published = data.data.filter(item => item.is_published === true || item.is_published === 1);
        setObats(published);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishedObats();
  }, []);

  // FUNGSI KERANJANG
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, qty: newQty }
          : item
      ));
    }
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
  };

  const generateWhatsAppMessage = () => {
    let message = "Halo Apotek Hadinata, saya ingin pesan:\n\n";
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.nama_obat} - Qty: ${item.qty} - Rp${(item.harga * item.qty).toLocaleString()}\n`;
    });
    
    message += `\nTotal: Rp${getTotalPrice().toLocaleString()}\n\nMohon diproses. Terima kasih!`;
    
    return encodeURIComponent(message);
  };

  // FILTER DAN SORT
  const categories = ["Semua", ...new Set(obats.map(o => o.kategori))].filter(Boolean);
  const filtered = obats
    .filter(o => selectedCategory === "Semua" || o.kategori === selectedCategory)
    .filter(o => o.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "nama") return a.nama_obat.localeCompare(b.nama_obat);
      if (sortBy === "harga-asc") return a.harga - b.harga;
      if (sortBy === "harga-desc") return b.harga - a.harga;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  // CART MODAL COMPONENT
  const CartModal = () => (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-end md:items-center md:justify-end p-4" onClick={() => setShowCart(false)}>
      <div className="bg-white rounded-3xl w-full max-w-md h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <ShoppingCart size={28} />
            <div>
              <h3 className="text-2xl font-black">Keranjang</h3>
              <p className="text-sm opacity-90">{getTotalItems()} item</p>
            </div>
          </div>
          <button onClick={() => setShowCart(false)} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag size={80} className="text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg font-bold">Keranjang masih kosong</p>
            <p className="text-slate-400 text-sm mt-2">Mulai belanja sekarang!</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-slate-50 rounded-2xl p-4 flex gap-4 border-2 border-slate-100 hover:border-cyan-200 transition">
                  <img 
                    src={item.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} 
                    alt={item.nama_obat} 
                    className="w-20 h-20 object-cover rounded-xl" 
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-cyan-900 mb-1 text-sm line-clamp-2">{item.nama_obat}</h4>
                    <p className="text-cyan-700 font-black text-lg">Rp{Number(item.harga).toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button 
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-cyan-50 transition border border-slate-200"
                      >
                        <Minus size={16} className="text-cyan-900" />
                      </button>
                      <span className="font-bold text-cyan-900 w-8 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-cyan-50 transition border border-slate-200"
                      >
                        <Plus size={16} className="text-cyan-900" />
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-slate-50">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Total Items</span>
                <span className="font-bold text-cyan-900">{getTotalItems()} item</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-slate-600 font-semibold">Total Harga</span>
                <span className="text-3xl font-black text-cyan-900">Rp{getTotalPrice().toLocaleString()}</span>
              </div>
              <a 
                href={`https://wa.me/628981335197?text=${generateWhatsAppMessage()}`}
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition shadow-lg shadow-lime-200"
              >
                <ShoppingBag size={24} /> Pesan via WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* HEADER - SAMA DENGAN PUBLIC */}
      <header className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white p-4 sm:p-6 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-lg">
              <img
                src={LOGO_URL}
                alt="Logo Apotek Hadinata"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.parentElement.style.display = 'none';
                }}
              />
            </div>
            <div className="text-xl sm:text-2xl font-black leading-tight">
              APOTEK <span className="text-lime-300">HADINATA</span>
            </div>
          </Link>
          <Link to="/" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 sm:px-6 py-2 rounded-full font-semibold transition text-sm sm:text-base">
            <ArrowLeft size={18} /> Kembali
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-lime-500 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm mb-4 sm:mb-6 uppercase">
              🛒 Belanja Online
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 leading-tight">
              Katalog <span className="text-lime-300">Lengkap</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8">
              Temukan ribuan produk kesehatan berkualitas
            </p>
            
            {/* SEARCH BAR */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-cyan-300" size={20} />
              <input 
                type="text" 
                placeholder="Cari obat atau suplemen..." 
                className="w-full p-3 sm:p-4 pl-12 sm:pl-16 pr-12 sm:pr-16 rounded-xl sm:rounded-2xl shadow-xl focus:ring-4 ring-lime-300 outline-none bg-white text-slate-800 text-sm sm:text-base font-medium" 
                onChange={(e) => setSearchTerm(e.target.value)} 
                value={searchTerm} 
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 hover:scale-110 transition">
                  <XCircle size={20} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* FILTER SECTION */}
        <div className="mb-8 sm:mb-12">
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="overflow-x-auto scrollbar-hide flex-1">
                <div className="flex gap-2 sm:gap-3">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setSelectedCategory(cat)} 
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                        selectedCategory === cat 
                          ? 'bg-cyan-600 text-white shadow-lg' 
                          : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button className="p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl hover:bg-slate-50 transition border-2 border-slate-200">
                  <Filter size={18} className="text-slate-600" />
                </button>
                
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="bg-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl outline-none text-xs sm:text-sm font-semibold cursor-pointer text-slate-700 hover:bg-slate-50 transition border-2 border-slate-200"
                >
                  <option value="nama">A-Z</option>
                  <option value="harga-asc">Termurah</option>
                  <option value="harga-desc">Termahal</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
            <p>
              Menampilkan <span className="font-bold text-slate-900">{filtered.length}</span> produk
              {selectedCategory !== "Semua" && <span> di <span className="font-bold text-cyan-600">{selectedCategory}</span></span>}
            </p>
            {(searchTerm || selectedCategory !== "Semua") && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Semua");
                }}
                className="text-cyan-600 font-semibold hover:text-cyan-700 transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyan-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-slate-500 font-semibold">Memuat produk...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl sm:rounded-3xl shadow-lg">
            <Package size={60} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-bold mb-2">Tidak ada produk</p>
            <p className="text-slate-500 text-sm">Coba ubah filter pencarian</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map(obat => (
              <div 
                key={obat.id} 
                className="bg-white rounded-xl flex flex-col overflow-hidden shadow hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div 
                  className="h-28 sm:h-32 overflow-hidden relative bg-slate-100 cursor-pointer" 
                  onClick={() => setSelectedProduct(obat)}
                >
                  <img 
                    src={obat.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={obat.nama_obat} 
                  />
                  {obat.kategori && (
                    <div className="absolute top-1.5 left-1.5 bg-cyan-600/90 px-2 py-0.5 rounded-full text-xs font-bold text-white">
                      {obat.kategori}
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  {obat.rating && (
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={10} 
                          className={i < Math.floor(obat.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} 
                        />
                      ))}
                    </div>
                  )}
                  <h4 
                    className="font-bold text-xs sm:text-sm text-cyan-900 mb-1.5 line-clamp-2 min-h-[2rem] cursor-pointer hover:text-lime-600 transition" 
                    onClick={() => setSelectedProduct(obat)}
                  >
                    {obat.nama_obat}
                  </h4>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-2 flex-1">
                    {obat.deskripsi || "Produk berkualitas"}
                  </p>
                  <div className="pt-2 border-t flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400 uppercase mb-0.5">Harga</p>
                      <p className="text-sm sm:text-base font-black text-cyan-700">
                        Rp{Number(obat.harga).toLocaleString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => addToCart(obat)}
                      className="p-2 bg-lime-50 text-lime-600 rounded-lg hover:bg-lime-500 hover:text-white transition-all hover:scale-110"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" 
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-60 sm:h-80">
              <img 
                src={selectedProduct.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} 
                alt={selectedProduct.nama_obat} 
                className="w-full h-full object-cover" 
              />
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition"
              >
                <X size={24} />
              </button>
              {selectedProduct.kategori && (
                <div className="absolute top-4 left-4 bg-cyan-600/90 px-4 py-2 rounded-full text-sm font-bold text-white">
                  {selectedProduct.kategori}
                </div>
              )}
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-black text-cyan-900 mb-3 sm:mb-4">{selectedProduct.nama_obat}</h3>
              {selectedProduct.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      className={i < Math.floor(selectedProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} 
                    />
                  ))}
                  <span className="text-slate-600 ml-2">({selectedProduct.rating})</span>
                </div>
              )}
              <p className="text-slate-600 text-base sm:text-lg mb-4 sm:mb-6">
                {selectedProduct.deskripsi || "Produk berkualitas tinggi"}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 sm:p-6 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 mb-1">Harga</p>
                  <p className="text-2xl sm:text-3xl font-black text-cyan-700">
                    Rp{Number(selectedProduct.harga).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 mb-1">Stok</p>
                  <p className="text-2xl sm:text-3xl font-black text-lime-600">{selectedProduct.stok}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="w-full bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-bold py-3 sm:py-4 rounded-2xl flex items-center justify-center gap-3 transition shadow-lg shadow-lime-200"
              >
                <Plus size={20} /> Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}

      {showCart && <CartModal />}

      {cart.length > 0 && !showCart && (
        <button 
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 bg-gradient-to-r from-lime-500 to-lime-600 text-white p-4 sm:p-5 rounded-full shadow-2xl hover:shadow-lime-300 hover:scale-110 z-50 transition-all"
        >
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-cyan-600 text-white text-xs font-bold w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center animate-pulse">
            {getTotalItems()}
          </span>
        </button>
      )}

      {/* FOOTER - SAMA DENGAN PUBLIC */}
      <footer className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white pt-12 sm:pt-16 pb-8 sm:pb-10 mt-16 sm:mt-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-lime-300">APOTEK HADINATA</h3>
              <p className="text-cyan-100 mb-4 sm:mb-6 text-xs sm:text-sm">Telefarmasi terpercaya untuk kesehatan keluarga.</p>
              <div className="flex gap-4">
                <Facebook className="hover:text-lime-300 cursor-pointer transition" size={20} />
                <Instagram className="hover:text-lime-300 cursor-pointer transition" size={20} />
                <Phone className="hover:text-lime-300 cursor-pointer transition" size={20} />
              </div>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 border-b-2 border-lime-400 inline-block pb-2">Jam Operasional</h4>
              <ul className="space-y-2 sm:space-y-3 text-cyan-100 text-xs sm:text-sm">
                <li className="flex items-center gap-2">
                  <Clock size={14} className="text-lime-400" /> Senin-Jumat: 08.00-20.00
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={14} className="text-lime-400" /> Sabtu: 08.00-17.00
                </li>
                <li className="pt-2 text-lime-300 font-semibold">*Konsultasi WhatsApp 24/7</li>
              </ul>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 border-b-2 border-lime-400 inline-block pb-2">Kontak</h4>
              <ul className="space-y-3 sm:space-y-4 text-cyan-100 text-xs sm:text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="text-lime-400 shrink-0 mt-1" size={16} /> 
                  Jl. Raya Kesehatan 123, Bandung
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-lime-400" size={16} /> 
                  <a href="tel:+628981335197" className="hover:text-lime-300 transition">+62 898 1335 197</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-lime-400" size={16} /> 
                  <a href="mailto:info@apotekhadinata.com" className="hover:text-lime-300 transition">info@apotekhadinata.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-cyan-500 text-center text-xs sm:text-sm text-cyan-200">
            <p>© {new Date().getFullYear()} Apotek Hadinata. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KatalogObatPage;