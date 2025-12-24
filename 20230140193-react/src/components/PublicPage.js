// src/components/PublicPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Search, ShoppingBag, Facebook, Instagram, Phone, Mail, MapPin, ArrowRight, Menu, X, Clock, Shield,
    Truck, Headphones, CheckCircle, ChevronDown, ArrowUp, Star, Package, ChevronLeft, ChevronRight,
    Plus, Minus, ShoppingCart, Trash2
} from 'lucide-react';

const PublicPage = () => {
    const [obats, setObats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentMissionSlide, setCurrentMissionSlide] = useState(0);

    // STATE KERANJANG
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    // LOGO - Upload logo Anda ke folder public/ dan ganti path ini
    const LOGO_URL = "/logo-apotek.jpeg";
    const HERO = "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=1350&q=80";
    const ABOUT = "https://i.pinimg.com/1200x/47/a5/40/47a54046a8a0bf77b047d4189313297b.jpg";

    const missionSlides = [
        {
            title: "LAYANAN RESEP DIGITAL TERPERCAYA",
            subtitle: "DIAWASI APOTEKER RESMI",
            content: "Konsultasi gratis dengan apoteker profesional. Pesan obat dari rumah, aman dan mudah."
        },
        {
            title: "VISI KAMI",
            subtitle: "MENJADI PIONIR TELEFARMASI",
            content: "Menjadi pionir telefarmasi di Indonesia yang terpercaya, menyediakan akses obat yang aman dan konsultasi profesional."
        },
        {
            title: "OBAT TEPAT, TANPA RIBET.",
            subtitle: "KAMI JAMIN KERAHASIAAN DATA ANDA",
            content: "Komitmen Apotek Hadinata: Kami menjaga kerahasiaan data pasien dan mengutamakan keamanan dalam seluruh proses pelayanan."
        }
    ];

    // FUNGSI KERANJANG
    const addToCart = (product, e) => {
        if (e) e.stopPropagation();
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

    // FETCH PRODUK
    useEffect(() => {
        const fetchPublishedObats = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3001/api/obat?public=true');
                const data = await response.json();
                const published = data.data.filter(item => item.is_published === true || item.is_published === 1);
                setObats(published.slice(0, 10));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublishedObats();
    }, []);

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (obats.length <= 5) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.ceil(obats.length / 5));
        }, 5000);
        return () => clearInterval(interval);
    }, [obats.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMissionSlide((prev) => (prev + 1) % missionSlides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    const waMsg = encodeURIComponent("Halo Apotek Hadinata, saya ingin konsultasi");

    // CART MODAL
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

const ProductCard = ({ obat, onClick }) => (
    <div className="bg-white rounded-xl flex flex-col overflow-hidden shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(20%-0.8rem)]">
        <div className="h-28 sm:h-32 overflow-hidden relative bg-slate-100 cursor-pointer" onClick={onClick}>
            <img
                src={obat.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={obat.nama_obat}
                loading="lazy"
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
                        <Star key={i} size={10} className={i < Math.floor(obat.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} />
                    ))}
                </div>
            )}
            <h4 className="font-bold text-xs sm:text-sm text-cyan-900 mb-1.5 line-clamp-2 min-h-[2rem] cursor-pointer hover:text-lime-600 transition" onClick={onClick}>
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
                    onClick={(e) => addToCart(obat, e)}
                    className="p-2 bg-lime-50 text-lime-600 rounded-lg hover:bg-lime-500 hover:text-white transition-all hover:scale-110"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    </div>
);

return (
    <div className="font-sans">
        <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

        {/* HEADER */}
        <header className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white p-4 sm:p-6 sticky top-0 z-50 shadow-xl">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
                    {/* LOGO dengan background putih */}
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

                    {/* TEXT - SELALU MUNCUL */}
                    <div className="text-xl sm:text-2xl font-black leading-tight">
                        APOTEK <span className="text-lime-300">HADINATA</span>
                    </div>
                </div>

                <nav className="hidden md:flex gap-6 lg:gap-8 font-semibold text-sm uppercase items-center">
                    <button onClick={() => scrollTo('hero')} className="hover:text-lime-300 transition">Beranda</button>
                    <button onClick={() => scrollTo('unggah-resep')} className="hover:text-lime-300 transition">Unggah Resep</button>
                    <button onClick={() => scrollTo('produk')} className="hover:text-lime-300 transition">Produk</button>

                    <a
                        href={`https://wa.me/628981335197?text=${waMsg}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-lime-500 px-5 py-2 rounded-full hover:bg-lime-600 transition text-white font-bold"
                    >
                        Konsultasi
                    </a>
            </nav>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
    </div>

    {
    isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-cyan-600 p-6 flex flex-col gap-4 md:hidden shadow-xl z-50">
            <button onClick={() => scrollTo('hero')} className="text-left hover:text-lime-300 transition">Beranda</button>
            <button onClick={() => scrollTo('unggah-resep')} className="text-left hover:text-lime-300 transition">Unggah Resep</button>
            <button onClick={() => scrollTo('produk')} className="text-left hover:text-lime-300 transition">Produk</button>
            <a href={`https://wa.me/628981335197?text=${waMsg}`} className="text-left hover:text-lime-300 transition">Konsultasi</a>
        </div>
    )
}
</header>

    {/* HERO SECTION */ }
    <section id="hero" className="relative min-h-[400px] sm:min-h-[500px] flex items-center text-white overflow-hidden bg-gradient-to-r from-cyan-700 to-cyan-600">
                <div className="absolute inset-0 -z-10">
                    <img src={HERO} alt="Apotek" className="w-full h-full object-cover opacity-20" />
                </div>

                <div className="w-full">
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentMissionSlide * 100}%)` }}
                    >
                        {missionSlides.map((slide, index) => (
                            <div key={index} className="min-w-full">
                                <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                                    <div className="max-w-2xl">
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-1 sm:mb-2">
                                            {slide.title}
                                        </h1>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-4 sm:mb-6 text-lime-300">
                                            {slide.subtitle}
                                        </h2>
                                        <p className="text-sm sm:text-base md:text-lg opacity-90 leading-relaxed">
                                            {slide.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {missionSlides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentMissionSlide(i)}
                            className={`h-2 rounded-full transition-all ${i === currentMissionSlide ? 'w-8 bg-lime-400' : 'w-2 bg-white/50'}`}
                        />
                    ))}
                </div>
            </section>

    {/* ABOUT */ }
    <section className="py-12 sm:py-24 container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
                <div className="relative order-2 md:order-1">
                    <div className="absolute -inset-4 bg-cyan-100 rounded-[2rem] sm:rounded-[3rem] -z-10 rotate-3"></div>
                    <div className="rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white aspect-video">
                        <img src={ABOUT} alt="Apoteker" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-cyan-900">
                        Dipercaya Ribuan <span className="text-lime-600">Keluarga</span>
                    </h2>
                    <p className="text-slate-600 mb-4 sm:mb-6 text-base sm:text-lg">
                        Apotek Hadinata dipimpin apoteker berizin dengan pengalaman 5+ tahun.
                    </p>
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        {["Apoteker berlisensi", "Stok lengkap & asli", "Data pasien terjaga"].map((t, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle className="text-lime-500 shrink-0 mt-1" size={18} />
                                <span className="text-sm sm:text-base">{t}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 sm:p-6 bg-cyan-50 rounded-2xl border-l-4 sm:border-l-8 border-cyan-600 italic text-cyan-900 text-sm sm:text-base">
                        "Kesehatan keluarga Anda prioritas kami."
                    </div>
                </div>
            </section>

    {/* UNGGAH RESEP */ }
    <section id="unggah-resep" className="py-12 sm:py-24 bg-gradient-to-br from-cyan-700 to-cyan-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6 uppercase">Unggah Resep Dokter</h2>
            <div className="h-1.5 w-20 sm:w-24 bg-lime-400 mx-auto mb-6 sm:mb-8 rounded-full"></div>
            <p className="text-base sm:text-xl mb-8 sm:mb-12 opacity-90 max-w-2xl mx-auto">
                Kirim foto resep, kami proses & hubungi Anda
            </p>
            <Link
                to="/unggah-resep"
                className="inline-flex items-center gap-3 bg-lime-500 hover:bg-lime-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold transition text-sm sm:text-base shadow-xl"
            >
                Upload Resep <ArrowRight size={18} />
            </Link>
        </div>
            </section>

    {/* PRODUK */ }
    <section id="produk" className="py-12 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4 uppercase text-cyan-900">Produk Unggulan</h2>
                <div className="h-1.5 w-20 sm:w-24 bg-lime-500 mx-auto rounded-full"></div>
            </div>

            {loading ? (
                <div className="flex flex-wrap gap-3 sm:gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="bg-white rounded-xl h-56 animate-pulse w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] lg:w-[calc(20%-0.64rem)]">
                            <div className="h-28 sm:h-32 bg-slate-200 rounded-t-xl"></div>
                        </div>
                    ))}
                </div>
            ) : obats.length === 0 ? (
                <div className="text-center py-12 sm:py-16 text-slate-400">
                    <Package size={50} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm sm:text-base">Belum ada produk yang dipublikasikan</p>
                </div>
            ) : (
                <div className="relative">
                    <div className="overflow-hidden">
                        <div className="flex gap-3 sm:gap-4 transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                            {obats.map(obat => (
                                <ProductCard key={obat.id} obat={obat} onClick={() => setSelectedProduct(obat)} />
                            ))}
                        </div>
                    </div>
                    {obats.length > 5 && (
                        <>
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + Math.ceil(obats.length / 5)) % Math.ceil(obats.length / 5))}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-white shadow-xl p-2 sm:p-3 rounded-full hover:bg-cyan-50 z-10"
                            >
                                <ChevronLeft className="text-cyan-900" size={20} />
                            </button>
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % Math.ceil(obats.length / 5))}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-white shadow-xl p-2 sm:p-3 rounded-full hover:bg-cyan-50 z-10"
                            >
                                <ChevronRight className="text-cyan-900" size={20} />
                            </button>
                            <div className="flex justify-center gap-2 mt-6">
                                {[...Array(Math.ceil(obats.length / 5))].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentSlide(i)}
                                        className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-cyan-600' : 'w-2 bg-slate-300'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="mt-12 sm:mt-16 text-center">
                <Link
                    to="/semua-obat"
                    className="inline-flex items-center gap-3 bg-cyan-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold hover:bg-cyan-700 shadow-xl group transition text-sm sm:text-base"
                >
                    Lihat Semua Obat <ArrowRight className="group-hover:translate-x-2 transition" size={18} />
                </Link>
            </div>
        </div>
            </section>

    {/* FOOTER */ }
    < footer className = "bg-gradient-to-r from-cyan-700 to-cyan-600 text-white pt-12 sm:pt-20 pb-8 sm:pb-10" >
        <div className="container mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16">
                <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-lime-300">APOTEK HADINATA</h3>
                    <p className="text-cyan-100 mb-4 sm:mb-6 text-xs sm:text-sm">
                        Telefarmasi terpercaya untuk kesehatan keluarga.
                    </p>
                    <div className="flex gap-4">
                        <Facebook className="hover:text-lime-300 cursor-pointer transition" size={20} />
                        <Instagram className="hover:text-lime-300 cursor-pointer transition" size={20} />
                        <Phone className="hover:text-lime-300 cursor-pointer transition" size={20} />
                    </div>
                </div>
                <div>
                    <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 border-b-2 border-lime-400 inline-block pb-2">
                        Jam Operasional
                    </h4>
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
                    <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 border-b-2 border-lime-400 inline-block pb-2">
                        Kontak
                    </h4>
                    <ul className="space-y-3 sm:space-y-4 text-cyan-100 text-xs sm:text-sm">
                        <li className="flex items-start gap-3">
                            <MapPin className="text-lime-400 shrink-0 mt-1" size={16} />
                            Jl. Kopi selatan, Sampit, Kalimantan Tengah
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="text-lime-400" size={16} />
                            <a href="tel:+628981335197" className="hover:text-lime-300 transition">
                                +62 898 1335 197
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="text-lime-400" size={16} />
                            <a href="mailto:info@apotekhadinata.com" className="hover:text-lime-300 transition">
                                info@apotekhadinata.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="pt-6 sm:pt-10 border-t border-cyan-500 text-center text-xs sm:text-sm text-cyan-200">
                <p>© {new Date().getFullYear()} Apotek Hadinata. All Rights Reserved.</p>
            </div>
        </div>
            </footer >

    {/* PRODUCT DETAIL MODAL */ }
{
    selectedProduct && (
        <div
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
        >
            <div
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
                    <h3 className="text-2xl sm:text-3xl font-black text-cyan-900 mb-3 sm:mb-4">
                        {selectedProduct.nama_obat}
                    </h3>
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
                            <p className="text-2xl sm:text-3xl font-black text-lime-600">
                                {selectedProduct.stok}
                            </p>
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
    )
}

{/* CART MODAL */ }
{ showCart && <CartModal /> }

{/* FLOATING CART BUTTON */ }
{
    cart.length > 0 && !showCart && (
        <button
            onClick={() => setShowCart(true)}
            className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 bg-gradient-to-r from-lime-500 to-lime-600 text-white p-4 sm:p-5 rounded-full shadow-2xl hover:shadow-lime-300 hover:scale-110 z-50 transition-all"
        >
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-cyan-600 text-white text-xs font-bold w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center animate-pulse">
                {getTotalItems()}
            </span>
        </button>
    )
}

{/* BACK TO TOP BUTTON */ }
{
    showBackToTop && (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 sm:bottom-8 left-6 sm:left-8 bg-lime-500 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-lime-600 z-50 transition"
        >
            <ArrowUp size={20} />
        </button>
    )
}
        </div>
    );
};

export default PublicPage;