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
            <header className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 ${scrolled ? 'py-3 md:py-4 bg-slate-900/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl' : 'py-4 md:py-8 bg-transparent'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3 md:gap-5 group cursor-pointer" onClick={scrollToTop}>
                        <div className={`transition-all duration-500 ${scrolled ? 'w-8 h-8 md:w-10 h-10' : 'w-10 h-10 md:w-14 h-14'} bg-white rounded-xl shadow-xl flex items-center justify-center p-1.5 md:p-2 border border-slate-50 group-hover:rotate-6`}>
                            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3063/3063067.png"} />
                        </div>
                        <div>
                            <h1 className={`font-black tracking-tighter leading-none transition-all duration-500 ${scrolled ? 'text-base md:text-2xl' : 'text-lg md:text-4xl'} text-white`}>
                                APOTEK <span className="text-cyan-400">HADINATA</span>
                            </h1>
                            <p className={`text-[8px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.5em] mt-1 transition-all duration-500 ${scrolled ? 'opacity-0 h-0 hidden' : 'opacity-100'}`}>The Standard of Care</p>
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
                <div className={`fixed inset-0 z-[110] lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" onClick={() => setIsMenuOpen(false)}></div>
                    <div className={`absolute top-0 right-0 w-full sm:w-[75%] h-full bg-slate-950 shadow-2xl transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} p-8 sm:p-10 flex flex-col z-[111]`}>
                        <div className="flex justify-between items-center mb-10 sm:mb-16">
                            <h2 className="text-sm font-black tracking-[0.3em] text-slate-500 uppercase">Navigasi</h2>
                            <button onClick={() => setIsMenuOpen(false)} className="text-white w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl"><X size={24} /></button>
                        </div>
                        <nav className="flex flex-col gap-6 sm:gap-10">
                            {['Beranda', 'Produk', 'Layanan', 'Kontak'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollTo(item.toLowerCase())}
                                    className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-left text-white hover:text-cyan-400 transition-all"
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>
                        <div className="mt-auto pt-10 border-t border-white/5 uppercase text-[8px] font-black tracking-[0.5em] text-slate-600">
                            Apotek Hadinata <br /> The Standard of Care
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section id="beranda" className="relative h-[80vh] md:h-screen overflow-hidden flex items-center pt-20 md:pt-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-glow"></div>
                <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] bg-lime-500/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '-3s' }}></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <div className="relative h-[220px] md:h-[400px]">
                            {missionSlides.map((slide, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute top-0 left-0 w-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform
                                        ${idx === currentMissionSlide ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
                                >
                                    <h2 className="text-2xl md:text-8xl font-black text-white leading-[1.1] md:leading-[0.9] mb-4 md:mb-8 tracking-tighter">
                                        {slide.title} <br />
                                        <span className={`bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent`}>
                                            {slide.subtitle}
                                        </span>
                                    </h2>
                                    <p className="text-slate-400 text-xs md:text-xl max-w-2xl font-medium leading-relaxed">
                                        {slide.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-12 md:mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <button onClick={() => scrollTo('produk')} className="w-full sm:w-auto px-8 md:px-12 py-5 premium-gradient text-white font-black rounded-2xl shadow-2xl shadow-cyan-900/40 hover:scale-105 active:scale-95 transition-all text-[10px] md:text-[11px] tracking-[0.2em] uppercase group">
                                <span className="flex items-center gap-3 justify-center">
                                    Cari Produk <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </span>
                            </button>
                            <Link to="/unggah-resep" className="w-full sm:w-auto px-8 md:px-12 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-center">
                                Kirim Resep
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
            <section className="bg-white/5 backdrop-blur-md py-6 md:py-12 border-y border-white/5 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-12 opacity-80 group hover:opacity-100 transition-all duration-700">
                        <div className="flex items-center gap-2 md:gap-3 font-black text-sm md:text-xl tracking-tighter text-white">
                            <ShieldCheck size={20} className="text-cyan-400 md:w-8 md:h-8" /> DISTRIBUTOR RESMI
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 font-black text-sm md:text-xl tracking-tighter text-white">
                            <Award size={20} className="text-lime-400 md:w-8 md:h-8" /> APOTEKER BERLISENSI
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 font-black text-sm md:text-xl tracking-tighter text-white">
                            <CheckCircle size={20} className="text-cyan-400 md:w-8 md:h-8" /> 100% PRODUK ASLI
                        </div>
                    </div>
                </div>
            </section>

            {/* CATALOG */}
            <section id="produk" className="py-20 md:py-40 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
                        <div className="max-w-3xl transform transition-all duration-1000">
                            <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-cyan-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-6 md:mb-10 shadow-sm">
                                <Package size={16} /> APOTEK HADINATA
                            </div>
                            <h2 className="text-3xl md:text-8xl font-black text-white tracking-tighter leading-[1] md:leading-[0.85] mb-6 md:mb-8">
                                Solusi <span className="text-cyan-400">Terpercaya</span> <br className="hidden md:block" />Untuk Anda.
                            </h2>
                            <p className="text-slate-400 font-medium text-sm md:text-2xl leading-relaxed max-w-2xl">Kesehatan keluarga Anda adalah prioritas kami dengan jaminan keaslian 100%.</p>
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
                                            className={`${obats.length > 4 ? 'min-w-[calc(100%-1rem)] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1.333rem)] xl:min-w-[calc(25%-1.5rem)]' : 'w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] xl:w-[calc(25%-1.5rem)]'} shrink-0 group glass-card-dark rounded-[32px] md:rounded-[40px] p-5 md:p-6 border border-white/10 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transition-all duration-700 hover:-translate-y-4 flex flex-col`}
                                        >
                                            <div className="relative h-48 md:h-64 mb-6 md:mb-8 overflow-hidden rounded-[24px] md:rounded-[32px] cursor-pointer" onClick={() => setSelectedProduct(obat)}>
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
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            </div>
                                            <h4 className="font-black text-white text-lg md:text-xl mb-2 md:mb-3 line-clamp-1 group-hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => setSelectedProduct(obat)}>
                                                {obat.nama_obat}
                                            </h4>
                                            <div className="flex items-center gap-2 mb-4 md:mb-6">
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="fill-amber-400 text-amber-400" />)}
                                                <span className="text-[9px] md:text-[10px] font-black text-slate-400 ml-1">4.9 / 5.0</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/5 mt-auto">
                                                <div>
                                                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 md:text-slate-300 uppercase tracking-widest mb-1">HARGA TERBAIK</p>
                                                    <p className="text-xl md:text-2xl font-black text-cyan-400 tracking-tight">Rp{Number(obat.harga).toLocaleString()}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => addToCart(obat, e)}
                                                    className="w-12 h-12 md:w-14 md:h-14 bg-white/5 text-white rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-lime-500 hover:rotate-6 active:scale-95 transition-all shadow-xl shadow-cyan-900/10"
                                                >
                                                    <Plus size={20} className="md:w-6 md:h-6" />
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
            <section id="layanan" className="py-20 md:py-40 relative overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-40"></div>
                <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-lime-500/10 rounded-full blur-[180px] animate-pulse-glow"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto glass-card-dark bg-slate-900/40 border-white/10 p-8 md:p-20 text-center shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] rounded-[40px] md:rounded-[60px]">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-lime-400 to-lime-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-lime-500/30 transform hover:rotate-12 transition-transform duration-500">
                            <FileText size={28} />
                        </div>
                        <h2 className="text-2xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-6 md:mb-8">
                            Penebusan Resep <br /><span className="bg-gradient-to-r from-lime-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Lebih Praktis.</span>
                        </h2>
                        <p className="text-slate-400 text-sm md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-10 italic">
                            Foto resep Anda, kirim online, dan terima obat di rumah.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
                            <Link to="/unggah-resep" className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-lime-400 transition-all shadow-2xl group text-center">
                                Mulai Kirim Resep
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="py-20 md:py-40 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
                        <div className="text-center group p-8 md:p-12 glass-card-dark rounded-[40px] md:rounded-[50px] border-white/5 shadow-xl">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-cyan-500/10 rounded-2xl md:rounded-[40px] flex items-center justify-center mx-auto mb-6 md:mb-10 text-cyan-400 transition-all duration-700 shadow-inner">
                                <Truck size={32} className="md:w-10 md:h-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-white mb-4 tracking-tight">Kurir Prioritas</h3>
                            <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed italic">Pengiriman cepat di bawah 60 menit.</p>
                        </div>
                        <div className="text-center group p-8 md:p-12 glass-card-dark rounded-[40px] md:rounded-[50px] border-white/5 shadow-xl">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-lime-500/10 rounded-2xl md:rounded-[40px] flex items-center justify-center mx-auto mb-6 md:mb-10 text-lime-400 transition-all duration-700 shadow-inner">
                                <ShieldCheck size={32} className="md:w-10 md:h-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-white mb-4 tracking-tight">Kualitas Terjamin</h3>
                            <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed italic">Produk asli dengan izin resmi BPOM.</p>
                        </div>
                        <div className="text-center group p-8 md:p-12 glass-card-dark rounded-[40px] md:rounded-[50px] border-white/5 shadow-xl">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-2xl md:rounded-[40px] flex items-center justify-center mx-auto mb-6 md:mb-10 text-white transition-all duration-700 shadow-inner">
                                <Headphones size={32} className="md:w-10 md:h-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-white mb-4 tracking-tight">Layanan 24/7</h3>
                            <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed italic">Siap melayani konsultasi obat kapan saja.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer id="kontak" className="bg-slate-950 text-white pt-20 pb-12 md:pt-40 md:pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 via-lime-400 to-cyan-600"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 md:gap-20 mb-16 md:mb-32">
                        <div className="col-span-1 lg:col-span-2">
                            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-2xl">
                                    <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter">APOTEK <span className="text-cyan-500">HADINATA</span></h2>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">The Standard of Care</p>
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
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={() => setSelectedProduct(null)}>
                    <div className="bg-white w-full max-w-4xl rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[95vh] relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-14 md:h-14 bg-white/90 backdrop-blur-md rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl z-20 hover:rotate-90 transition-all duration-500"><X size={24} className="md:w-7 md:h-7" /></button>
                        <div className="md:w-1/2 relative h-48 sm:h-64 md:h-auto overflow-hidden">
                            <img src={selectedProduct.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} className="w-full h-full object-cover" alt={selectedProduct.nama_obat} />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10"><span className="bg-cyan-600 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">Official Stock</span></div>
                        </div>
                        <div className="md:w-1/2 p-6 sm:p-8 md:p-20 overflow-y-auto bg-slate-50/30">
                            <div className="mb-8 md:mb-12">
                                <h3 className="text-2xl md:text-5xl font-black tracking-tight mb-4 md:mb-6 text-slate-900">{selectedProduct.nama_obat}</h3>
                                <div className="inline-flex items-center gap-2 md:gap-3 bg-white px-4 py-1.5 md:px-6 md:py-2 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 mb-6 md:mb-10">
                                    <div className="flex gap-1">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="fill-amber-400 text-amber-400 md:w-3.5 md:h-3.5" />)}</div>
                                    <span className="text-[9px] md:text-[11px] font-black text-slate-400">Trusted Product</span>
                                </div>
                                <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed md:leading-loose mb-8 md:mb-12 italic border-l-4 border-cyan-500 pl-6 md:pl-8">{selectedProduct.deskripsi || 'Produk farmasi berkualitas premium untuk menunjang kesehatan optimal Anda.'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
                                <div className="bg-white p-5 md:p-8 rounded-[24px] md:rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-50">
                                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-4">Harga Unit</p>
                                    <p className="text-xl md:text-4xl font-black text-cyan-600 tracking-tight">Rp{Number(selectedProduct.harga).toLocaleString()}</p>
                                </div>
                                <div className="bg-white p-5 md:p-8 rounded-[24px] md:rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-50">
                                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-4">Sedia Stok</p>
                                    <p className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">{selectedProduct.stok} <span className="text-[10px] md:text-sm font-bold opacity-30 uppercase">Unit</span></p>
                                </div>
                            </div>
                            <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full py-4 md:py-6 premium-gradient text-white font-black rounded-2xl md:rounded-3xl shadow-2xl shadow-cyan-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 md:gap-6 text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em]"><ShoppingBag size={20} className="md:w-6 md:h-6" /> Masukkan Keranjang</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CART MODAL */}
            {showCart && (
                <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/60 backdrop-blur-md animate-fade-in" onClick={() => setShowCart(false)}>
                    <div className="w-full max-w-lg bg-white h-screen flex flex-col shadow-2xl animate-slide-in-right overflow-hidden md:rounded-l-[60px] border-l border-white" onClick={e => e.stopPropagation()}>
                        <div className="p-8 md:p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-1 text-slate-900">Pesanan Anda</h3>
                                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{getTotalItems()} Item dalam daftar</p>
                            </div>
                            <button onClick={() => setShowCart(false)} className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center hover:bg-slate-100 transition shadow-xl"><X size={20} className="md:w-6 md:h-6" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 md:space-y-8 scrollbar-hide">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-[40px] md:rounded-[50px] flex items-center justify-center mb-8 md:mb-10 text-slate-200 shadow-inner"><ShoppingBag size={40} className="md:w-12 md:h-12" /></div>
                                    <p className="text-slate-400 font-bold text-lg md:text-xl italic mb-10 md:mb-12">Belum ada item terpilih.</p>
                                    <button onClick={() => setShowCart(false)} className="px-10 py-4 md:px-12 md:py-5 bg-slate-900 text-white font-black rounded-xl md:rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl">Mulai Belanja</button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="group flex gap-5 md:gap-8 p-4 md:p-6 rounded-[32px] md:rounded-[40px] hover:bg-slate-50 transition-all duration-500 border border-transparent hover:border-slate-100 relative">
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-lg shrink-0"><img src={item.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.nama_obat} /></div>
                                        <div className="flex-1 py-1">
                                            <div className="flex justify-between items-start mb-3 md:mb-4">
                                                <h4 className="font-black text-slate-900 text-base md:text-lg">{item.nama_obat}</h4>
                                                <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={18} className="md:w-5 md:h-5" /></button>
                                            </div>
                                            <p className="text-xl md:text-2xl font-black text-cyan-600 mb-4 md:mb-6 tracking-tight">Rp{item.harga.toLocaleString()}</p>
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <div className="flex items-center bg-white border border-slate-100 rounded-xl md:rounded-2xl p-1.5 md:p-2 gap-4 md:gap-6 shadow-sm">
                                                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-cyan-50 hover:text-cyan-600 rounded-lg md:rounded-xl transition-all"><Minus size={16} /></button>
                                                    <span className="text-base md:text-lg font-black text-slate-900 min-w-[20px] md:min-w-[30px] text-center">{item.qty}</span>
                                                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-cyan-50 hover:text-cyan-600 rounded-lg md:rounded-xl transition-all"><Plus size={16} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {cart.length > 0 && (
                            <div className="p-8 md:p-12 bg-white md:rounded-t-[60px] shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.1)] border-t border-slate-50">
                                <div className="flex justify-between items-center mb-8 md:mb-10">
                                    <p className="text-slate-400 font-black text-[9px] md:text-[11px] uppercase tracking-[0.3em]">Total Bayar</p>
                                    <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Rp{getTotalPrice().toLocaleString()}</p>
                                </div>
                                <a href={`https://wa.me/628981335197?text=${generateWhatsAppMessage()}`} target="_blank" rel="noreferrer" className="block w-full py-6 md:py-8 premium-gradient text-white text-center font-black rounded-2xl md:rounded-3xl shadow-2xl shadow-cyan-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] md:text-xs uppercase tracking-[0.4em]">Bayar Via WhatsApp</a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FLOATING ACTION BUTTONS */}
            {!isMenuOpen && (
                <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col gap-4 md:gap-6 z-[60]">
                    {showBackToTop && (
                        <button onClick={scrollToTop} className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-slate-900 group overflow-hidden">
                            <ArrowUp size={20} className="md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform" />
                            <div className="absolute inset-0 bg-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    )}
                    <a href={`https://wa.me/628981335197?text=Halo Apotek Hadinata, saya ingin konsultasi`} target="_blank" rel="noreferrer" className="w-14 h-14 md:w-20 md:h-20 bg-lime-500 text-white rounded-[24px] md:rounded-[32px] shadow-[0_20px_40px_-10px_rgba(132,204,22,0.4)] flex items-center justify-center hover:scale-110 hover:rotate-6 active:scale-95 transition-all group relative overflow-hidden">
                        <Phone size={24} className="md:w-8 md:h-8" /><div className="absolute top-0 left-[-100%] w-full h-full bg-white/30 skew-x-[45deg] group-hover:animate-shine"></div>
                    </a>
                </div>
            )}

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