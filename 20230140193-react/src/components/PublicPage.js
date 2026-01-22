// src/components/PublicPage.js
import React, { useState, useEffect } from "react";
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
    const [address, setAddress] = useState("");
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

    const [visibleItems, setVisibleItems] = useState(4);

    useEffect(() => {
        const updateVisibleItems = () => {
            if (window.innerWidth < 640) setVisibleItems(2);
            else if (window.innerWidth < 1024) setVisibleItems(3);
            else if (window.innerWidth < 1280) setVisibleItems(4);
            else setVisibleItems(5);
        };
        updateVisibleItems();
        window.addEventListener('resize', updateVisibleItems);
        return () => window.removeEventListener('resize', updateVisibleItems);
    }, []);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        message += `\nTotal: Rp${getTotalPrice().toLocaleString()}`;

        if (address.trim()) {
            message += `\n\nAlamat Pengiriman:\n${address}`;
        }

        message += `\n\nMohon informasi pembayarannya ya.`;
        return encodeURIComponent(message);
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-mesh font-sans text-slate-900 overflow-x-hidden relative">
            <Particles count={40} opacity={0.15} speed={0.4} color="#06b6d4" />

            {/* Liquid Orbs Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-cyan-500/5 rounded-full blur-[120px] animate-float opacity-30"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-lime-500/5 rounded-full blur-[120px] animate-float opacity-30" style={{ animationDelay: '-4s' }}></div>
                <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] bg-blue-500/3 rounded-full blur-[100px] animate-pulse-glow"></div>
            </div>

            <div className="absolute inset-0 bg-dot-pattern opacity-5 pointer-events-none"></div>

            {/* NAV BAR */}
            <header className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-300 ${scrolled ? 'py-3 bg-slate-50/90 border-b border-slate-200/60 shadow-xl backdrop-blur-md' : 'py-4 md:py-8 bg-transparent'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3 md:gap-5 group cursor-pointer" onClick={scrollToTop}>
                        <div className={`transition-all duration-500 ${scrolled ? 'w-8 h-8 md:w-10 h-10' : 'w-10 h-10 md:w-14 h-14'} bg-white rounded-xl shadow-xl flex items-center justify-center p-1.5 md:p-2 border border-slate-100 group-hover:rotate-6`}>
                            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3063/3063067.png"} />
                        </div>
                        <h1 className={`font-black tracking-tighter leading-none transition-all duration-500 ${scrolled ? 'text-base md:text-2xl' : 'text-lg md:text-4xl'} text-slate-900`}>
                            APOTEK <span className="text-cyan-500">HADINATA</span>
                        </h1>
                    </div>

                    <nav className="hidden lg:flex items-center gap-12">
                        {[
                            { name: 'Beranda', type: 'scroll', target: 'beranda' },
                            { name: 'Produk', type: 'link', path: '/katalog' },
                            { name: 'Layanan', type: 'link', path: '/unggah-resep' },
                            { name: 'Kontak', type: 'scroll', target: 'kontak' }
                        ].map((item) => (
                            item.type === 'scroll' ? (
                                <button
                                    key={item.name}
                                    onClick={() => scrollTo(item.target)}
                                    className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-cyan-600 transition-all relative group"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-500 group-hover:w-full"></span>
                                </button>
                            ) : (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-cyan-600 transition-all relative group"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-500 group-hover:w-full"></span>
                                </Link>
                            )
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowCart(true)}
                            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${scrolled ? 'bg-cyan-500/10 text-cyan-600 border border-cyan-100 hover:bg-cyan-500/20' : 'bg-white/40 text-slate-900 backdrop-blur-md border border-white/40 hover:bg-white/60'}`}
                        >
                            <ShoppingCart size={20} />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-lime-500 text-white text-[10px] flex items-center justify-center rounded-full font-black shadow-lg animate-bounce">
                                    {getTotalItems()}
                                </span>
                            )}
                        </button>

                        <button className="lg:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU DRAWER */}
                <div className={`fixed inset-0 z-[110] lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
                    <div className={`absolute top-0 right-0 w-[65%] sm:w-[50%] h-full bg-white border-l border-slate-100 shadow-premium transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} p-6 md:p-10 flex flex-col z-[111]`}>
                        <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
                            <span className="font-black text-slate-900 text-[10px] tracking-widest uppercase opacity-40">Menu Navigasi</span>
                            <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 w-10 h-10 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all shadow-sm"><X size={18} /></button>
                        </div>
                        <nav className="flex flex-col gap-6">
                            {[
                                { name: 'Beranda', type: 'scroll', target: 'beranda' },
                                { name: 'Katalog Produk', type: 'link', path: '/katalog' },
                                { name: 'Kirim Resep', type: 'link', path: '/unggah-resep' },
                                { name: 'Kontak Apotek', type: 'scroll', target: 'kontak' }
                            ].map((item) => (
                                item.type === 'scroll' ? (
                                    <button
                                        key={item.name}
                                        onClick={() => { scrollTo(item.target); setIsMenuOpen(false); }}
                                        className="text-left text-xl font-black uppercase tracking-tighter text-slate-800 hover:text-cyan-600 transition-all flex items-center justify-between group"
                                    >
                                        {item.name}
                                        <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-500" size={18} />
                                    </button>
                                ) : (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-left text-xl font-black uppercase tracking-tighter text-slate-800 hover:text-cyan-600 transition-all flex items-center justify-between group"
                                    >
                                        {item.name}
                                        <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-500" size={18} />
                                    </Link>
                                )
                            ))}
                        </nav>
                        <div className="mt-auto pt-8 border-t border-slate-50 text-[7px] font-black uppercase tracking-[0.4em] text-slate-400">
                            Apotek Hadinata <br /> &copy; 2026
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section id="beranda" className="relative min-h-screen overflow-hidden flex items-center pt-32 md:pt-40">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-glow"></div>
                <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] bg-lime-500/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '-3s' }}></div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center py-20 md:py-32">
                    <div className="max-w-5xl">
                        <div className="relative h-[200px] md:h-[350px]">
                            {missionSlides.map((slide, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute top-0 left-0 w-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform
                                        ${idx === currentMissionSlide ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
                                >
                                    <h2 className="text-2xl md:text-8xl font-black text-slate-900 leading-[1.1] md:leading-[0.9] mb-4 md:mb-8 tracking-tighter">
                                        {slide.title} <br />
                                        <span className={`bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent underline decoration-cyan-500/20 decoration-8 underline-offset-8`}>
                                            {slide.subtitle}
                                        </span>
                                    </h2>
                                    <p className="text-slate-600 text-xs md:text-xl max-w-2xl font-semibold leading-relaxed">
                                        {slide.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 md:gap-7 mt-8 md:mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <button
                                onClick={() => scrollTo('produk')}
                                className="w-full sm:w-auto px-10 md:px-16 py-5 bg-cyan-500 text-white font-black rounded-[32px] shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all text-[11px] md:text-[13px] tracking-[0.3em] uppercase group flex items-center justify-center gap-4"
                            >
                                Cari Produk <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                            <Link
                                to="/unggah-resep"
                                className="w-full sm:w-auto px-10 md:px-16 py-5 bg-white text-slate-900 border border-slate-100 font-black rounded-[32px] hover:bg-slate-50 transition-all text-[11px] md:text-[13px] tracking-[0.3em] uppercase text-center flex items-center justify-center hover:scale-105 active:scale-95 shadow-xl"
                            >
                                Kirim Resep
                            </Link>
                        </div>
                    </div>
                </div>

            </section>

            {/* TRUST BAR */}
            <section className="py-8 md:py-16 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="liquid-glass rounded-[32px] md:rounded-[60px] p-8 md:p-14 flex flex-wrap justify-center md:justify-between items-center gap-10 md:gap-12 group transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 md:gap-5 font-black text-xs md:text-2xl tracking-tighter text-slate-900 group-hover:scale-105 transition-all">
                            <div className="w-10 h-10 md:w-16 md:h-16 bg-cyan-500/5 rounded-2xl md:rounded-3xl flex items-center justify-center border border-cyan-500/10"><ShieldCheck className="text-cyan-500 w-5 h-5 md:w-8 md:h-8" /></div>
                            DISTRIBUTOR RESMI
                        </div>
                        <div className="flex items-center gap-3 md:gap-5 font-black text-xs md:text-2xl tracking-tighter text-slate-900 group-hover:scale-105 transition-all" style={{ transitionDelay: '0.1s' }}>
                            <div className="w-10 h-10 md:w-16 md:h-16 bg-lime-500/5 rounded-2xl md:rounded-3xl flex items-center justify-center border border-lime-500/10"><Award className="text-lime-500 w-5 h-5 md:w-8 md:h-8" /></div>
                            APOTEKER BERLISENSI
                        </div>
                        <div className="flex items-center gap-3 md:gap-5 font-black text-xs md:text-2xl tracking-tighter text-slate-900 group-hover:scale-105 transition-all" style={{ transitionDelay: '0.2s' }}>
                            <div className="w-10 h-10 md:w-16 md:h-16 bg-cyan-500/5 rounded-2xl md:rounded-3xl flex items-center justify-center border border-cyan-500/10"><CheckCircle className="text-cyan-500 w-5 h-5 md:w-8 md:h-8" /></div>
                            100% PRODUK ASLI
                        </div>
                    </div>
                </div>
            </section>

            {/* CATALOG */}
            <section id="produk" className="py-20 md:py-40 relative overflow-hidden"
                style={{
                    '--visible-items': window.innerWidth >= 1280 ? 4 : (window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1))
                }}>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
                        <div className="max-w-3xl transform transition-all duration-1000">
                            <div className="inline-flex items-center gap-4 liquid-glass px-6 py-3 rounded-2xl text-cyan-400 text-[9px] md:text-xs font-black uppercase tracking-[0.4em] mb-6 md:mb-10">
                                <Package size={16} className="animate-float" /> PRODUK UNGGULAN
                            </div>
                            <h2 className="text-3xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[1] md:leading-[0.85] mb-6 md:mb-8">
                                Pilih Obat <br className="hidden md:block" /><span className="text-cyan-500">Terbaik</span> Anda.
                            </h2>
                            <p className="text-slate-600 font-bold text-xs md:text-2xl leading-relaxed max-w-2xl">Jaminan keaslian 100% dan pengiriman instan langsung ke rumah.</p>
                        </div>
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

                            <div className={`${obats.length > 4 ? 'overflow-visible lg:overflow-hidden' : ''} px-2 md:px-4 -mx-2 md:-mx-4`}>
                                <div
                                    onTransitionEnd={handleTransitionEnd}
                                    className={`flex gap-3 md:gap-6 ${obats.length > 4 ? (transitionEnabled ? 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]' : 'transition-none') : 'flex-wrap justify-center'}`}
                                    style={obats.length > 4 ? {
                                        transform: `translateX(calc(-${productSlideIndex * 100}% / ${visibleItems} - ${productSlideIndex * (window.innerWidth < 768 ? 1 : 2)}rem))`
                                    } : {}}
                                >
                                    {(obats.length < 5 ? obats : [...obats.slice(0, 10), ...obats.slice(0, 10), ...obats.slice(0, 10), ...obats.slice(0, 10), ...obats.slice(0, 10)]).map((obat, idx) => (
                                        <div
                                            key={`${obat.id}-${idx}`}
                                            className={`${obats.length > 4 ? 'min-w-[calc(50%-0.5rem)] sm:min-w-[calc(33.333%-1rem)] md:min-w-[calc(25%-1rem)] lg:min-w-[calc(20%-1.5rem)] xl:min-w-[calc(16.666%-1.5rem)]' : 'w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] md:w-[calc(25%-1rem)]'} max-w-[240px] shrink-0 group bg-white rounded-2xl md:rounded-[28px] p-2.5 md:p-3.5 border border-slate-100 shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center`}
                                        >
                                            <div className="relative w-full aspect-[1/1.2] mb-3 md:mb-4 overflow-hidden rounded-xl md:rounded-[20px] cursor-pointer bg-white/5" onClick={() => setSelectedProduct(obat)}>
                                                <img
                                                    src={obat.gambar_url || "https://images.unsplash.com/photo-1576091160550-217359f48f4c?w=500"}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    alt={obat.nama_obat}
                                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"; }}
                                                />
                                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90%]">
                                                    <span className="block text-center bg-white/95 backdrop-blur-md px-1.5 py-1 rounded-full text-[6px] md:text-[8px] font-black text-cyan-600 uppercase tracking-[0.2em] shadow-lg border border-slate-100">
                                                        {obat.kategori}
                                                    </span>
                                                </div>
                                            </div>

                                            <h4 className="font-black text-slate-800 text-[11px] md:text-sm mb-1.5 md:mb-2 line-clamp-1 group-hover:text-cyan-600 transition-colors cursor-pointer w-full text-center" onClick={() => setSelectedProduct(obat)}>
                                                {obat.nama_obat}
                                            </h4>

                                            <div className="flex items-center justify-center gap-1.5 mb-3 md:mb-4 w-full">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star
                                                            key={s}
                                                            size={8}
                                                            className={`${s <= (obat.rating || 4.5) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} md:w-2.5 md:h-2.5`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase">{(obat.rating || 4.8).toFixed(1)} / 5</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto w-full">
                                                <div className="text-left">
                                                    <p className="text-[6px] md:text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">HARGA TERBAIK</p>
                                                    <p className="text-xs md:text-lg font-black text-cyan-600 tracking-tighter leading-none">Rp{Number(obat.harga).toLocaleString()}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => addToCart(obat, e)}
                                                    className="w-7 h-7 md:w-9 md:h-9 bg-slate-50 text-cyan-600 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-cyan-500 hover:text-white hover:rotate-6 active:scale-95 transition-all border border-slate-100"
                                                >
                                                    <Plus size={14} className="md:w-5 md:h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-8 mt-12 md:mt-20">
                                <div className="flex justify-center gap-3 xl:hidden">
                                    {obats.slice(0, 10).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                const count = obats.slice(0, 10).length;
                                                setProductSlideIndex(count * 2 + i);
                                            }}
                                            className={`h-1.5 transition-all duration-500 rounded-full ${i === (productSlideIndex % (obats.slice(0, 10).length || 1)) ? 'w-10 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                                        />
                                    ))}
                                </div>

                                <Link to="/katalog" className="group flex items-center gap-4 md:gap-6 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 px-8 py-4 md:px-12 md:py-6 rounded-2xl md:rounded-[32px] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm">
                                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-600 group-hover:text-cyan-600 transition-colors">LIHAT SEMUA PRODUK</span>
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white text-cyan-600 transition-all duration-500 shadow-xl shadow-cyan-500/5">
                                        <ArrowRight size={18} className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section >

            {/* CTA SECTION */}
            < section id="layanan" className="py-20 md:py-40 relative overflow-hidden" >
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto glass-card border-slate-100 p-8 md:p-20 text-center shadow-premium rounded-[40px] md:rounded-[60px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-mesh opacity-30"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-lime-500 to-lime-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-lime-500/20 transform hover:rotate-12 transition-transform duration-500">
                                <FileText size={28} />
                            </div>
                            <h2 className="text-2xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-6 md:mb-8">
                                Penebusan Resep <br /><span className="bg-gradient-to-r from-lime-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">Lebih Praktis.</span>
                            </h2>
                            <p className="text-slate-600 text-sm md:text-xl font-bold max-w-2xl mx-auto leading-relaxed mb-10">
                                Foto resep Anda, kirim online, dan terima obat di rumah.
                            </p>
                            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
                                <Link to="/unggah-resep" className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-lime-500 transition-all shadow-xl text-center">
                                    Mulai Kirim Resep
                                </Link>
                                <a href="https://wa.me/6281390807472" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-slate-50 transition-all shadow-xl text-center">
                                    Tanya Apoteker
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* SERVICES */}
            < section className="py-20 md:py-40 relative overflow-hidden" >
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
                        <div className="text-center group p-8 md:p-12 glass-card rounded-[40px] md:rounded-[50px] border-slate-100 shadow-xl">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-cyan-500/5 rounded-2xl md:rounded-[40px] flex items-center justify-center mx-auto mb-6 md:mb-10 text-cyan-500 transition-all duration-700 shadow-inner">
                                <Truck size={32} className="md:w-10 md:h-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tighter">Kurir Prioritas</h3>
                            <p className="text-slate-600 text-sm md:text-base font-bold leading-relaxed">Pengiriman cepat di bawah 60 menit.</p>
                        </div>
                        <div className="text-center group p-8 md:p-12 glass-card rounded-[40px] md:rounded-[50px] border-slate-100 shadow-xl">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-lime-500/5 rounded-2xl md:rounded-[40px] flex items-center justify-center mx-auto mb-6 md:mb-10 text-lime-500 transition-all duration-700 shadow-inner">
                                <ShieldCheck size={32} className="md:w-10 md:h-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tighter">Kualitas Terjamin</h3>
                            <p className="text-slate-600 text-sm md:text-base font-bold leading-relaxed">Produk asli dengan izin resmi BPOM.</p>
                        </div>
                        <div className="text-center group p-8 md:p-12 glass-card rounded-[40px] md:rounded-[50px] border-slate-100 shadow-xl">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-cyan-500/5 rounded-2xl md:rounded-[40px] flex items-center justify-center mx-auto mb-6 md:mb-10 text-cyan-500 transition-all duration-700 shadow-inner">
                                <Headphones size={32} className="md:w-10 md:h-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tighter">Layanan 24/7</h3>
                            <p className="text-slate-600 text-sm md:text-base font-bold leading-relaxed">Siap melayani konsultasi obat kapan saja.</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* FOOTER */}
            < footer id="kontak" className="bg-slate-50/50 border-t border-slate-200/60 pt-20 pb-12 md:pt-40 md:pb-20 relative overflow-hidden" >
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 md:gap-20 mb-16 md:mb-32">
                        <div className="col-span-1 lg:col-span-2">
                            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl border border-slate-100">
                                    <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900">APOTEK <span className="text-cyan-500">HADINATA</span></h2>
                            </div>
                            <p className="text-slate-600 font-bold leading-loose text-lg max-w-xl mb-12 italic">
                                "Membangun akses kesehatan digital yang lebih manusiawi, cepat, dan terpercaya untuk seluruh lapisan masyarakat."
                            </p>
                            <div className="flex gap-6">
                                <a href="https://instagram.com/hadinata" target="_blank" rel="noreferrer" className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-white hover:-translate-y-2 transition-all duration-500 shadow-sm"><Instagram size={24} /></a>
                                <a href="https://facebook.com/hadinata" target="_blank" rel="noreferrer" className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:-translate-y-2 transition-all duration-500 shadow-sm"><Facebook size={24} /></a>
                                <a href="https://wa.me/6281390807472" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl hover:bg-lime-500 hover:text-white hover:-translate-y-2 transition-all duration-500 group shadow-sm">
                                    <Phone size={24} className="text-slate-400 group-hover:text-white" />
                                    <span className="font-bold text-sm text-slate-600 group-hover:text-white transition-colors hidden md:block tracking-widest">0813-9080-7472</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-600 mb-12">Navigasi</h4>
                            <ul className="space-y-6 text-sm font-black uppercase tracking-widest text-slate-500">
                                <li><button onClick={scrollToTop} className="hover:text-cyan-600 transition-colors">Beranda</button></li>
                                <li><button onClick={() => scrollTo('produk')} className="hover:text-cyan-600 transition-colors">Katalog Obat</button></li>
                                <li><button onClick={() => scrollTo('layanan')} className="hover:text-cyan-600 transition-colors">Layanan Resep</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-lime-600 mb-12">Lokasi Utama</h4>
                            <div className="relative glass-card bg-white border-slate-100 rounded-[40px] overflow-hidden group shadow-premium">
                                <div className="h-64 w-full opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15951.713568858276!2d112.964522!3d-2.529845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dfcc159f8c679b3%3A0x67347a504ead2e!2sApotek%20Hadinata!5e0!3m2!1sid!2sid!4v1704987654321!5m2!1sid!2sid"
                                        width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Lokasi Apotek Hadinata" className="hover:grayscale-0 transition-all duration-700"
                                    ></iframe>
                                </div>
                                <div className="p-8">
                                    <p className="text-sm font-bold leading-relaxed mb-6 text-slate-600">Jl. Kopi Selatan, RT.013/RW.004 <br />Sampit, Kalimantan Tengah 74322</p>
                                    <a href="https://maps.app.goo.gl/9yG4N3v2XU3FmC4f6" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-cyan-600 hover:text-cyan-800 transition-colors">
                                        Buka di Google Maps <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer >

            {/* PRODUCT MODAL */}
            {
                selectedProduct && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedProduct(null)}>
                        <div className="bg-white w-full max-w-6xl rounded-[40px] md:rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col md:flex-row h-auto max-h-[90vh] relative animate-scale-in" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-16 md:h-16 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-50 hover:text-red-500 transition-all z-20 border border-slate-100"><X size={28} /></button>

                            <div className="md:w-1/2 h-80 md:h-auto bg-[#f1f5f9] relative flex items-center justify-center p-12">
                                <div className="relative w-full h-full flex items-center justify-center animate-float">
                                    <img src={selectedProduct.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"}
                                        className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]" alt={selectedProduct.nama_obat} />
                                </div>
                                <div className="absolute bottom-10 left-10">
                                    <span className="bg-[#0097b2] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Apotek Hadinata</span>
                                </div>
                            </div>

                            <div className="md:w-1/2 p-8 md:p-16 bg-slate-50/30 overflow-y-auto custom-scrollbar flex flex-col justify-center">
                                <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 tracking-tighter leading-tight">{selectedProduct.nama_obat}</h3>

                                <div className="flex items-center gap-1 mb-6">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={18} className={`${s <= (selectedProduct.rating || 4.5) ? "fill-[#ffc107] text-[#ffc107]" : "fill-slate-200 text-slate-200"}`} />
                                        ))}
                                    </div>
                                    <span className="ml-3 text-slate-400 font-bold text-sm tracking-widest">({(selectedProduct.rating || 4.5).toFixed(1)})</span>
                                </div>

                                <div className="mb-8">
                                    <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed italic pr-4">
                                        {selectedProduct.deskripsi || 'Produk farmasi berkualitas tinggi dikembangkan untuk pemulihan yang efektif dan aman.'}
                                    </p>
                                </div>

                                <div className="flex flex-row gap-4 md:gap-6 mb-8">
                                    <div className="bg-slate-50 p-5 md:p-6 rounded-[24px] border border-slate-100 flex-1 flex flex-row items-center justify-between min-w-0">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Harga Unit</p>
                                        <p className="text-base md:text-xl font-black text-[#0097b2] tracking-tighter">Rp{Number(selectedProduct.harga).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-slate-50 p-5 md:p-6 rounded-[24px] border border-slate-100 flex-1 flex flex-row items-center justify-between min-w-0">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sedia Stok</p>
                                        <p className="text-base md:text-xl font-black text-slate-800 tracking-tighter">{selectedProduct.stok} <span className="text-[10px] text-slate-400 uppercase">Unit</span></p>
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
                )
            }

            {/* CART MODAL */}
            {
                showCart && (
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
                                        <div key={item.id} className="group flex gap-4 md:gap-8 p-3 md:p-6 rounded-[24px] md:rounded-[40px] hover:bg-slate-50 transition-all duration-500 border border-transparent hover:border-slate-100 relative">
                                            <div className="w-16 h-16 md:w-32 md:h-32 rounded-[20px] md:rounded-[32px] overflow-hidden shadow-lg shrink-0"><img src={item.gambar_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.nama_obat} /></div>
                                            <div className="flex-1 py-1">
                                                <div className="flex justify-between items-start mb-2 md:mb-4">
                                                    <h4 className="font-black text-slate-900 text-xs md:text-lg">{item.nama_obat}</h4>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={16} className="md:w-5 md:h-5" /></button>
                                                </div>
                                                <p className="text-base md:text-2xl font-black text-cyan-600 mb-3 md:mb-6 tracking-tight">Rp{item.harga.toLocaleString()}</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center bg-white border border-slate-100 rounded-lg md:rounded-2xl p-1 md:p-2 gap-3 md:gap-6 shadow-sm">
                                                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center hover:bg-cyan-50 hover:text-cyan-600 rounded-md md:rounded-xl transition-all"><Minus size={14} /></button>
                                                        <span className="text-sm md:text-lg font-black text-slate-900 min-w-[15px] md:min-w-[30px] text-center">{item.qty}</span>
                                                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center hover:bg-cyan-50 hover:text-cyan-600 rounded-md md:rounded-xl transition-all"><Plus size={14} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {cart.length > 0 && (
                                <div className="p-6 md:p-12 bg-white md:rounded-t-[60px] shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.1)] border-t border-slate-50">
                                    <div className="mb-6">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Pengiriman</label>
                                        <textarea
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-cyan-500 transition-colors resize-none h-24"
                                            placeholder="Masukkan alamat lengkap..."
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-between items-center mb-6 md:mb-10">
                                        <p className="text-slate-400 font-black text-[7px] md:text-[11px] uppercase tracking-[0.3em]">Total Bayar</p>
                                        <p className="text-lg md:text-5xl font-black text-slate-900 tracking-tighter">Rp{getTotalPrice().toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!address.trim()) {
                                                alert("Mohon isi alamat pengiriman terlebih dahulu!");
                                                return;
                                            }
                                            window.open(`https://wa.me/6281390807472?text=${generateWhatsAppMessage()}`, '_blank');
                                        }}
                                        className={`block w-full py-4 md:py-8 text-white text-center font-black rounded-xl md:rounded-3xl text-[10px] md:text-xs uppercase tracking-[0.4em] shadow-2xl transition-all ${!address.trim() ? 'bg-slate-300 cursor-not-allowed' : 'premium-gradient shadow-cyan-900/20 hover:scale-[1.02] active:scale-[0.98]'}`}
                                    >
                                        Bayar Via WhatsApp
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* FLOATING ACTION BUTTONS */}
            {
                !isMenuOpen && (
                    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col gap-4 md:gap-6 z-[60]">
                        <a href={`https://wa.me/6281390807472?text=Halo Apotek Hadinata, saya ingin konsultasi`} target="_blank" rel="noreferrer" className="w-14 h-14 md:w-20 md:h-20 bg-lime-500 text-white rounded-[24px] md:rounded-[32px] shadow-premium flex items-center justify-center hover:scale-110 hover:rotate-6 active:scale-95 transition-all group relative overflow-hidden">
                            <Phone size={24} className="md:w-8 md:h-8" /><div className="absolute top-0 left-[-100%] w-full h-full bg-white/30 skew-x-[45deg] group-hover:animate-shine"></div>
                        </a>
                        {showBackToTop && (
                            <button onClick={scrollToTop} className="w-14 h-14 md:w-20 md:h-20 bg-white shadow-2xl rounded-[24px] md:rounded-[32px] border border-slate-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-cyan-600 group overflow-hidden">
                                <ArrowUp size={24} className="md:w-8 md:h-8 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        )}
                    </div>
                )
            }

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shine { 0% { transform: translateX(-100%) skewX(45deg); } 100% { transform: translateX(200%) skewX(45deg); } }
                .animate-shine { animation: shine 1.5s infinite; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />
        </div >
    );
};

export default PublicPage;