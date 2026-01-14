// src/components/PublicPage.js
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Star, ShoppingCart, Plus, Minus, Search, Menu, X, ChevronRight, ChevronLeft, Zap,
    MapPin, Phone, Mail, Instagram, Twitter, Facebook, ArrowRight, Upload, Clock,
    ShieldCheck, Award, Heart, Package, Trash2, LogOut, LayoutDashboard, User,
    ChevronDown, CheckCircle, FileText, Truck, Headphones, ShoppingBag, ArrowUp
} from 'lucide-react';
import API_BASE_URL from '../config';
import Particles from "./Particles";

/**
 * PublicPage - Main Landing Page for Apotek Hadinata
 */
const PublicPage = () => {
    const [obats, setObats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentMissionSlide, setCurrentMissionSlide] = useState(0);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [productSlideIndex, setProductSlideIndex] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const [hasInitializedIndex, setHasInitializedIndex] = useState(false);

    const LOGO_URL = "/logo-apotek.jpeg";

    const missionSlides = [
        {
            title: "Solusi Kesehatan Keluarga",
            subtitle: "Modern & Terpercaya",
            content: "Kini pesan obat tidak perlu antre. Kami hadir dengan layanan resep digital yang diawasi tenaga ahli profesional.",
            accent: "from-cyan-400 to-cyan-600"
        },
        {
            title: "Pengiriman Cepat",
            subtitle: "Langsung ke Rumah",
            content: "Kesehatan tidak bisa menunggu. Nikmati layanan pengiriman instan untuk menjamin ketersediaan obat saat Anda butuhkan.",
            accent: "from-lime-400 to-lime-600"
        },
        {
            title: "Konsultasi Ahli",
            subtitle: "Apoteker Berlisensi",
            content: "Bingung dengan dosis atau jenis obat? Hubungi apoteker kami melalui WhatsApp untuk konsultasi gratis kapan saja.",
            accent: "from-cyan-400 to-lime-500"
        }
    ];

    useEffect(() => {
        const fetchPublishedObats = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/obat?public=true`);
                const data = await response.json();
                setObats(data.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublishedObats();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const items = obats.slice(0, 10);
        if (items.length > 0 && !hasInitializedIndex) {
            setProductSlideIndex(items.length);
            setHasInitializedIndex(true);
        }
    }, [obats, hasInitializedIndex]);

    useEffect(() => {
        if (obats.length > 4) {
            const interval = setInterval(() => {
                setProductSlideIndex((prev) => prev + 1);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [obats]);

    const handleTransitionEnd = () => {
        const count = obats.slice(0, 10).length;
        if (count === 0) return;

        if (productSlideIndex >= count * 2) {
            setTransitionEnabled(false);
            setProductSlideIndex(productSlideIndex - count);
            setTimeout(() => setTransitionEnabled(true), 10);
        } else if (productSlideIndex < count) {
            setTransitionEnabled(false);
            setProductSlideIndex(productSlideIndex + count);
            setTimeout(() => setTransitionEnabled(true), 10);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMissionSlide((prev) => (prev + 1) % missionSlides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const addToCart = (product, e) => {
        if (e) e.stopPropagation();
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
        setShowCart(true);
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
            message += `${index + 1}. ${item.nama_obat} (${item.qty}x) - Rp${(item.harga * item.qty).toLocaleString()} \n`;
        });
        message += `\nTotal: Rp${getTotalPrice().toLocaleString()} \n\nMohon informasi pembayarannya ya.`;
        return encodeURIComponent(message);
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-mesh font-sans text-white overflow-x-hidden relative">
            <Particles count={120} opacity={0.4} speed={0.3} />
            <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>

            {/* NAV BAR */}
            <header className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 ${scrolled ? 'py-5 bg-slate-900/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl' : 'py-10 bg-transparent'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3 md:gap-6 group cursor-pointer" onClick={scrollToTop}>
                        <div className={`transition-all duration-500 ${scrolled ? 'w-10 h-10' : 'w-12 h-12 md:w-16 h-16'} bg-white rounded-xl md:rounded-2xl shadow-xl flex items-center justify-center p-1.5 md:p-2 border border-slate-50 group-hover:rotate-6`}>
                            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3063/3063067.png"} />
                        </div>
                        <div>
                            <h1 className={`font-black tracking-tighter leading-none transition-all duration-500 ${scrolled ? 'text-lg md:text-2xl' : 'text-xl md:text-4xl'} text-white`}>
                                APOTEK <span className="text-cyan-400">HADINATA</span>
                            </h1>
                            <p className={`text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.5em] mt-1 md:mt-2 transition-all duration-500 ${scrolled ? 'opacity-0 h-0' : 'opacity-100'}`}>The Standard of Care</p>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-12">
                        {['Beranda', 'Produk', 'Layanan', 'Kontak'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollTo(item.toLowerCase())}
                                className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all relative group"
                            >
                                {item}
                                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-cyan-400 rounded-full transition-all duration-500 group-hover:w-full"></span>
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowCart(true)}
                            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${scrolled ? 'bg-white/5 text-white border border-white/10 hover:bg-cyan-500/20' : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20'}`}
                        >
                            <ShoppingCart size={20} />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-lime-500 text-white text-[10px] flex items-center justify-center rounded-full font-black shadow-lg animate-bounce">
                                    {getTotalItems()}
                                </span>
                            )}
                        </button>

                        <button className="lg:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU DRAWER */}
                <div className={`fixed inset-0 z-[80] lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
                    <div className={`absolute top-0 right-0 w-[80%] h-full bg-slate-900 shadow-2xl transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} p-12 flex flex-col`}>
                        <div className="flex justify-between items-center mb-16">
                            <h2 className="text-xl font-black tracking-tighter text-white">MENU</h2>
                            <button onClick={() => setIsMenuOpen(false)} className="text-white"><X size={32} /></button>
                        </div>
                        <nav className="flex flex-col gap-10">
                            {['Beranda', 'Produk', 'Layanan', 'Kontak'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollTo(item.toLowerCase())}
                                    className="text-2xl font-black uppercase tracking-[0.2em] text-left text-slate-400 hover:text-cyan-400 transition-all"
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>
                        <div className="mt-auto pt-10 border-t border-white/5 uppercase text-[9px] font-black tracking-[0.5em] text-slate-500">
                            Apotek Hadinata Hadir Untuk Anda
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section id="beranda" className="relative h-screen overflow-hidden flex items-center">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-glow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-lime-500/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '-3s' }}></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <div className="relative h-[320px] md:h-[400px]">
                            {missionSlides.map((slide, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute top-0 left-0 w-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform
                                        ${idx === currentMissionSlide ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
                                >
                                    <h2 className="text-3xl md:text-8xl font-black text-white leading-[1] md:leading-[0.9] mb-6 md:mb-8 tracking-tighter">
                                        {slide.title} <br />
                                        <span className={`bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent`}>
                                            {slide.subtitle}
                                        </span>
                                    </h2>
                                    <p className="text-slate-400 text-sm md:text-xl max-w-2xl font-medium leading-relaxed">
                                        {slide.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-6 mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <button onClick={() => scrollTo('produk')} className="px-12 py-5 premium-gradient text-white font-black rounded-2xl shadow-2xl shadow-cyan-900/40 hover:scale-105 active:scale-95 transition-all text-[11px] tracking-[0.2em] uppercase group">
                                <span className="flex items-center gap-3">
                                    Cari Produk <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </span>
                            </button>
                            <Link to="/unggah-resep" className="px-12 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all text-[11px] tracking-[0.2em] uppercase">
                                Kirim Resep Dokter
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-12 left-6 right-6 flex flex-col items-center">
                    <div className="flex gap-3 mb-4">
                        {missionSlides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentMissionSlide(i)}
                                className={`h-1.5 transition-all duration-500 rounded-full ${i === currentMissionSlide ? 'w-16 bg-cyan-500' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                            />
                        ))}
                    </div>
                    <button onClick={() => scrollTo('produk')} className="text-white/40 animate-bounce hover:text-white transition-colors">
                        <ChevronDown size={32} />
                    </button>
                </div>
            </section>

            {/* TRUST BAR */}
            <section className="bg-white/5 backdrop-blur-md py-12 border-y border-white/5 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-between items-center gap-12 opacity-80 group hover:opacity-100 transition-all duration-700">
                        <div className="flex items-center gap-3 font-black text-xl tracking-tighter text-white">
                            <ShieldCheck size={32} className="text-cyan-400" /> DISTRIBUTOR RESMI
                        </div>
                        <div className="flex items-center gap-3 font-black text-xl tracking-tighter text-white">
                            <Award size={32} className="text-lime-400" /> APOTEKER BERLISENSI
                        </div>
                        <div className="flex items-center gap-3 font-black text-xl tracking-tighter text-white">
                            <CheckCircle size={32} className="text-cyan-400" /> 100% PRODUK ASLI
                        </div>
                        <div className="flex items-center gap-3 font-black text-xl tracking-tighter text-white">
                            <Zap size={32} className="text-lime-400" /> PENGIRIMAN INSTAN
                        </div>
                    </div>
                </div>
            </section>

            {/* CATALOG */}
            <section id="produk" className="py-40 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div className="max-w-3xl transform transition-all duration-1000">
                            <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-10 shadow-sm">
                                <Package size={18} /> Pharma Catalog
                            </div>
                            <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8">
                                Solusi <span className="text-cyan-400">Terpercaya</span> <br />Untuk Anda & Keluarga.
                            </h2>
                            <p className="text-slate-400 font-medium text-xl md:text-2xl leading-relaxed max-w-2xl">Pilih kategori obat yang Anda butuhkan dengan jaminan keaslian 100%.</p>
                        </div>
                        <Link to="/semua-obat" className="font-black text-sm uppercase tracking-[0.4em] text-slate-400 hover:text-white transition-all flex items-center gap-6 group mb-4">
                            Lihat Semua <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-cyan-50 group-hover:text-white transition-all active:scale-90"><ArrowRight size={24} /></div>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-[450px] bg-white rounded-[40px] animate-pulse opacity-10"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative group/catalog">
                            <div className="absolute top-1/2 -left-10 -translate-y-1/2 z-20 hidden xl:block">
                                <button
                                    onClick={() => setProductSlideIndex(prev => prev - 1)}
                                    className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 bg-slate-900/80 backdrop-blur-xl text-white hover:bg-cyan-500 hover:scale-110 shadow-2xl"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                            </div>
                            <div className="absolute top-1/2 -right-10 -translate-y-1/2 z-20 hidden xl:block">
                                <button
                                    onClick={() => setProductSlideIndex(prev => prev + 1)}
                                    className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 bg-slate-900/80 backdrop-blur-xl text-white hover:bg-cyan-500 hover:scale-110 shadow-2xl"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </div>

                            <div className={`${obats.length > 4 ? 'overflow-visible lg:overflow-hidden' : ''} px-4 -mx-4`}>
                                <div
                                    onTransitionEnd={handleTransitionEnd}
                                    className={`flex gap-8 ${obats.length > 4 ? (transitionEnabled ? 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]' : 'transition-none') : 'flex-wrap justify-center'}`}
                                    style={obats.length > 4 ? {
                                        transform: `translateX(calc(-${productSlideIndex * 100}% / var(--visible-items, 1) - ${productSlideIndex * 2}rem))`
                                    } : {}}
                                >
                                    {(obats.length < 5 ? obats : [...obats.slice(0, 10), ...obats.slice(0, 10), ...obats.slice(0, 10), ...obats.slice(0, 10), ...obats.slice(0, 10)]).map((obat, idx) => (
                                        <div
                                            key={`${obat.id}-${idx}`}
                                            className={`${obats.length > 4 ? 'min-w-full md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1.333rem)] xl:min-w-[calc(25%-1.5rem)]' : 'w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] xl:w-[calc(25%-1.5rem)]'} shrink-0 group glass-card-dark rounded-[40px] p-6 border border-white/10 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transition-all duration-700 hover:-translate-y-4 flex flex-col`}
                                        >
                                            <div className="relative h-64 mb-8 overflow-hidden rounded-[32px] cursor-pointer" onClick={() => setSelectedProduct(obat)}>
                                                <img
                                                    src={obat.gambar_url || "https://images.unsplash.com/photo-1576091160550-217359f48f4c?w=500"}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    alt={obat.nama_obat}
                                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"; }}
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest shadow-xl border border-white/10">
                                                        {obat.kategori}
                                                    </span>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl">
                                                        <Zap size={24} />
                                                    </div>
                                                </div>
                                            </div>
                                            <h4 className="font-black text-white text-xl mb-3 line-clamp-1 group-hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => setSelectedProduct(obat)}>
                                                {obat.nama_obat}
                                            </h4>
                                            <div className="flex items-center gap-2 mb-6">
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="fill-amber-400 text-amber-400" />)}
                                                <span className="text-[10px] font-black text-slate-400 ml-1">4.9 / 5.0</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">HARGA TERBAIK</p>
                                                    <p className="text-2xl font-black text-cyan-400 tracking-tight">Rp{Number(obat.harga).toLocaleString()}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => addToCart(obat, e)}
                                                    className="w-14 h-14 bg-white/5 text-white rounded-2xl flex items-center justify-center hover:bg-lime-500 hover:rotate-6 active:scale-95 transition-all shadow-xl shadow-cyan-900/10"
                                                >
                                                    <Plus size={24} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center gap-3 mt-12 xl:hidden">
                                {obats.slice(0, 10).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            const count = obats.slice(0, 10).length;
                                            setProductSlideIndex(count * 2 + i);
                                        }}
                                        className={`h-1.5 transition-all duration-500 rounded-full ${i === (productSlideIndex % (obats.slice(0, 10).length || 1)) ? 'w-10 bg-cyan-400' : 'w-2 bg-white/10 hover:bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <style jsx>{`
                    #produk { --visible-items: 1; }
                    @media(min-width: 768px) { #produk { --visible-items: 2; } }
                    @media(min-width: 1024px) { #produk { --visible-items: 3; } }
                    @media(min-width: 1280px) { #produk { --visible-items: 4; } }
                `}</style>
            </section>

            {/* CTA SECTION */}
            <section id="layanan" className="py-40 relative overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-40"></div>
                <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-lime-500/10 rounded-full blur-[180px] animate-pulse-glow"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto glass-card-dark bg-slate-900/40 border-white/10 p-10 md:p-20 text-center shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] rounded-[60px]">
                        <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-lime-500/30 transform hover:rotate-12 transition-transform duration-500">
                            <FileText size={32} />
                        </div>
                        <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-8">
                            Penebusan Resep <br /><span className="bg-gradient-to-r from-lime-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Lebih Mudah & Cepat.</span>
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-12 italic">
                            Foto resep dokter Anda, kirim secara online, dan dapatkan konfirmasi instan dari tim apoteker profesional kami.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <Link to="/unggah-resep" className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-lime-400 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/40 group">
                                <span className="flex items-center gap-3 justify-center">
                                    Mulai Kirim Resep <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </span>
                            </Link>
                            <a href="https://wa.me/628981335197" className="px-10 py-5 bg-white/5 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-4">
                                <Phone size={18} className="text-lime-400" /> Konsultasi Gratis
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="py-40 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                        <div className="text-center group p-12 glass-card-dark rounded-[50px] border-white/5 shadow-xl hover-lift">
                            <div className="w-24 h-24 bg-cyan-500/10 rounded-[40px] flex items-center justify-center mx-auto mb-10 text-cyan-400 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-inner">
                                <Truck size={40} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Kurir Prioritas</h3>
                            <p className="text-slate-400 font-medium leading-relaxed italic">Kami menjamin obat sampai di tangan Anda dalam waktu kurang dari 60 menit untuk area lokal.</p>
                        </div>
                        <div className="text-center group p-12 glass-card-dark rounded-[50px] border-white/5 shadow-xl hover-lift">
                            <div className="w-24 h-24 bg-lime-500/10 rounded-[40px] flex items-center justify-center mx-auto mb-10 text-lime-400 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-inner">
                                <ShieldCheck size={40} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Jaminan Kualitas</h3>
                            <p className="text-slate-400 font-medium leading-relaxed italic">Seluruh produk memiliki izin BPOM dan bersumber dari distributor utama yang resmi.</p>
                        </div>
                        <div className="text-center group p-12 glass-card-dark rounded-[50px] border-white/5 shadow-xl hover-lift">
                            <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-10 text-white transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-inner">
                                <Headphones size={40} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Apoteker 24/7</h3>
                            <p className="text-slate-400 font-medium leading-relaxed italic">Pertanyaan seputar kesehatan dan aturan pakai obat dapat didiskusikan setiap saat via chat.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer id="kontak" className="bg-slate-950 text-white pt-40 pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 via-lime-400 to-cyan-600"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-32">
                        <div className="col-span-1 lg:col-span-2">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center p-3 shadow-2xl">
                                    <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter">APOTEK <span className="text-cyan-500">HADINATA</span></h2>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">The Standard of Care</p>
                                </div>
                            </div>
                            <p className="text-slate-500 font-bold leading-loose text-lg max-w-xl mb-12 italic">
                                "Membangun akses kesehatan digital yang lebih manusiawi, cepat, dan terpercaya untuk seluruh lapisan masyarakat."
                            </p>
                            <div className="flex gap-6">
                                <a href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-cyan-600 hover:-translate-y-2 transition-all duration-500"><Instagram size={24} /></a>
                                <a href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:-translate-y-2 transition-all duration-500"><Facebook size={24} /></a>
                                <a href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-lime-500 hover:-translate-y-2 transition-all duration-500"><Phone size={24} /></a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-12">Navigasi</h4>
                            <ul className="space-y-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                                <li><button onClick={scrollToTop} className="hover:text-white transition-colors">Beranda</button></li>
                                <li><button onClick={() => scrollTo('produk')} className="hover:text-white transition-colors">Katalog Obat</button></li>
                                <li><button onClick={() => scrollTo('layanan')} className="hover:text-white transition-colors">Layanan Resep</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-12">Lokasi Utama</h4>
                            <div className="relative glass-card-dark bg-white/5 border-white/10 rounded-[40px] overflow-hidden group shadow-2xl">
                                <div className="h-64 w-full opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15951.713568858276!2d112.964522!3d-2.529845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dfcc159f8c679b3%3A0x67347a504ead2e!2sApotek%20Hadinata!5e0!3m2!1sid!2sid!4v1704987654321!5m2!1sid!2sid"
                                        width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Lokasi Apotek Hadinata" className="grayscale hover:grayscale-0 transition-all duration-700"
                                    ></iframe>
                                </div>
                                <div className="p-8">
                                    <p className="text-sm font-bold leading-relaxed mb-6 text-slate-300">Jl. Kopi Selatan, RT.013/RW.004 <br />Sampit, Kalimantan Tengah 74322</p>
                                    <a href="https://maps.app.goo.gl/9yG4N3v2XU3FmC4f6" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-white transition-colors">
                                        Buka di Google Maps <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* PRODUCT MODAL */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={() => setSelectedProduct(null)}>
                    <div className="bg-white w-full max-w-5xl rounded-[60px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[95vh] relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 w-14 h-14 bg-white/90 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl z-20 hover:rotate-90 transition-all duration-500"><X size={28} /></button>
                        <div className="md:w-1/2 relative h-[400px] md:h-auto overflow-hidden">
                            <img src={selectedProduct.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} className="w-full h-full object-cover" alt={selectedProduct.nama_obat} />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                            <div className="absolute bottom-10 left-10"><span className="bg-cyan-600 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">Official Stock</span></div>
                        </div>
                        <div className="md:w-1/2 p-12 md:p-20 overflow-y-auto bg-slate-50/30">
                            <div className="mb-12">
                                <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-slate-900">{selectedProduct.nama_obat}</h3>
                                <div className="inline-flex items-center gap-3 bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-100 mb-10">
                                    <div className="flex gap-1">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}</div>
                                    <span className="text-[11px] font-black text-slate-400">Trusted By 100+ Customers</span>
                                </div>
                                <p className="text-slate-500 text-lg font-medium leading-loose mb-12 italic border-l-4 border-cyan-500 pl-8">{selectedProduct.deskripsi || 'Produk farmasi berkualitas premium untuk menunjang kesehatan optimal Anda.'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-8 mb-12">
                                <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Harga Unit</p>
                                    <p className="text-4xl font-black text-cyan-600 tracking-tight">Rp{Number(selectedProduct.harga).toLocaleString()}</p>
                                </div>
                                <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Sedia Stok</p>
                                    <p className="text-4xl font-black text-slate-900 tracking-tight">{selectedProduct.stok} <span className="text-sm font-bold opacity-30 uppercase">Unit</span></p>
                                </div>
                            </div>
                            <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full py-6 premium-gradient text-white font-black rounded-3xl shadow-2xl shadow-cyan-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-6 text-xs uppercase tracking-[0.3em]"><ShoppingBag size={24} /> Masukkan Keranjang</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CART MODAL */}
            {showCart && (
                <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/40 backdrop-blur-md animate-fade-in" onClick={() => setShowCart(false)}>
                    <div className="w-full max-w-lg bg-white h-screen flex flex-col shadow-2xl animate-slide-in-right overflow-hidden rounded-l-[60px] border-l border-white" onClick={e => e.stopPropagation()}>
                        <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-3xl font-black tracking-tight mb-2 text-slate-900">Pesanan Anda</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{getTotalItems()} Item terpilih dalam daftar</p>
                            </div>
                            <button onClick={() => setShowCart(false)} className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center hover:bg-slate-100 transition shadow-xl"><X size={24} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-32 h-32 bg-slate-50 rounded-[50px] flex items-center justify-center mb-10 text-slate-200 shadow-inner"><ShoppingBag size={50} /></div>
                                    <p className="text-slate-400 font-bold text-xl italic mb-12">Belum ada item terpilih.</p>
                                    <button onClick={() => setShowCart(false)} className="px-12 py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl">Mulai Belanja</button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="group flex gap-8 p-6 rounded-[40px] hover:bg-slate-50 transition-all duration-500 border border-transparent hover:border-slate-100 relative">
                                        <div className="w-32 h-32 rounded-[32px] overflow-hidden shadow-lg shrink-0"><img src={item.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.nama_obat} /></div>
                                        <div className="flex-1 py-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-black text-slate-900 text-lg">{item.nama_obat}</h4>
                                                <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                            </div>
                                            <p className="text-2xl font-black text-cyan-600 mb-6 tracking-tight">Rp{item.harga.toLocaleString()}</p>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center bg-white border border-slate-100 rounded-2xl p-2 gap-6 shadow-sm">
                                                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-10 h-10 flex items-center justify-center hover:bg-cyan-50 hover:text-cyan-600 rounded-xl transition-all"><Minus size={18} /></button>
                                                    <span className="text-lg font-black text-slate-900 min-w-[30px] text-center">{item.qty}</span>
                                                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-cyan-50 hover:text-cyan-600 rounded-xl transition-all"><Plus size={18} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {cart.length > 0 && (
                            <div className="p-12 bg-white rounded-t-[60px] shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.1)] border-t border-slate-50">
                                <div className="flex justify-between items-center mb-10">
                                    <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.3em]">Total Pembayaran</p>
                                    <p className="text-5xl font-black text-slate-900 tracking-tighter">Rp{getTotalPrice().toLocaleString()}</p>
                                </div>
                                <a href={`https://wa.me/628981335197?text=${generateWhatsAppMessage()}`} target="_blank" rel="noreferrer" className="block w-full py-8 premium-gradient text-white text-center font-black rounded-3xl shadow-2xl shadow-cyan-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs uppercase tracking-[0.4em]">Bayar Via WhatsApp</a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FLOATING ACTION BUTTONS */}
            <div className="fixed bottom-10 right-10 flex flex-col gap-6 z-[60]">
                {showBackToTop && (
                    <button onClick={scrollToTop} className="w-16 h-16 bg-white rounded-3xl shadow-2xl border border-slate-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-slate-900 group overflow-hidden">
                        <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
                        <div className="absolute inset-0 bg-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                )}
                <a href={`https://wa.me/628981335197?text=Halo Apotek Hadinata, saya ingin konsultasi`} target="_blank" rel="noreferrer" className="w-20 h-20 bg-lime-500 text-white rounded-[32px] shadow-[0_24px_48px_-12px_rgba(132,204,22,0.4)] flex items-center justify-center hover:scale-110 hover:rotate-6 active:scale-95 transition-all group relative overflow-hidden">
                    <Phone size={32} /><div className="absolute top-0 left-[-100%] w-full h-full bg-white/30 skew-x-[45deg] group-hover:animate-shine"></div>
                </a>
            </div>

            <style jsx>{`
                @keyframes shine { 0% { transform: translateX(-100%) skewX(45deg); } 100% { transform: translateX(200%) skewX(45deg); } }
                .animate-shine { animation: shine 1.5s infinite; }
                .shadow-glow { box-shadow: 0 0 20px rgba(6, 182, 212, 0.4); }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default PublicPage;