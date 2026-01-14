// src/components/UnggahResep.js
import React, { useState } from 'react';
import axios from 'axios';
import {
    Upload, Send, ArrowLeft, CheckCircle, Phone, Mail, MapPin,
    Facebook, Instagram, Clock, ShieldCheck, Award, FileText,
    Camera, BadgeCheck, Loader2, Package
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from '../config';
import Particles from './Particles';

const UnggahResep = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        nomor_wa: '',
        keterangan: '',
        foto_resep: null
    });

    const LOGO_URL = "/logo-apotek.jpeg";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('nama_lengkap', formData.nama_lengkap);
        data.append('nomor_wa', formData.nomor_wa);
        data.append('keterangan', formData.keterangan);
        data.append('foto_resep', formData.foto_resep);

        try {
            await axios.post(`${API_BASE_URL}/api/resep/upload`, data);
            setSuccess(true);
            setTimeout(() => navigate('/'), 4000);
        } catch (err) {
            alert(err.response?.data?.message || "Gagal mengirim resep");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-mesh relative overflow-hidden p-6 font-sans">
                <Particles count={40} opacity={0.3} speed={0.3} />
                <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>
                <div className="max-w-md w-full glass-card-dark p-12 text-center shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/10 animate-fade-in relative z-10">
                    <div className="w-24 h-24 bg-lime-500/10 border border-lime-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-lime-500/10">
                        <CheckCircle className="w-12 h-12 text-lime-400" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Resep Terkirim!</h2>
                    <p className="text-slate-400 font-medium mb-10 leading-relaxed italic">
                        Terima kasih. Apoteker kami akan memvalidasi resep Anda dan segera menghubungi Anda melalui WhatsApp.
                    </p>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center gap-4 transition-all hover:bg-white/10">
                        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_100px_rgba(34,211,238,0.8)]"></div>
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">ESTIMASI RESPON: 15-30 MENIT</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mesh font-sans text-white overflow-x-hidden relative">
            <Particles count={100} opacity={0.4} speed={0.4} />
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-dot-pattern opacity-20"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-glow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-lime-500/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '-3s' }}></div>
            </div>

            {/* NAV BAR */}
            <header className="sticky top-0 z-[60] bg-slate-900 border-b border-white/10 shadow-2xl">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center p-2 border border-slate-50 group-hover:rotate-6 transition-transform">
                            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain"
                                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3063/3063067.png"} />
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-white">APOTEK <span className="text-cyan-400">HADINATA</span></h1>
                    </Link>
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 font-black text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400 hover:text-white transition bg-white/5 px-3 py-2 rounded-xl md:px-0 md:py-0 md:bg-transparent">
                        <ArrowLeft size={14} className="md:w-4 md:h-4" /> <span className="hidden xs:inline">Kembali</span>
                    </button>
                </div>
            </header>

            <main className="relative z-10 pt-16 pb-32">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        {/* LEFT CONTENT: INFO */}
                        <div className="animate-fade-in">
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                                <Package size={14} /> APOTEK HADINATA
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 tracking-tighter">
                                Layanan <span className="text-gradient">Resep Digital</span> Terpercaya.
                            </h2>
                            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12">
                                Kami memudahkan proses penebusan obat Anda. Tim apoteker berlisensi kami siap melayani kebutuhan medis Anda secara cepat dan terjaga privasinya.
                            </p>

                            <div className="space-y-8">
                                {[
                                    { icon: Camera, title: "Foto Resep Dokter", desc: "Pastikan foto jelas dan terbaca dengan baik oleh apoteker kami." },
                                    { icon: FileText, title: "Lengkapi Data Diri", desc: "Berikan detail kontak agar kami bisa menghubungi Anda segera." },
                                    { icon: BadgeCheck, title: "Validasi & Konfirmasi", desc: "Apoteker kami akan memeriksa sediaan obat dan harga via WhatsApp." }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0">
                                            <step.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white mb-1">{step.title}</h4>
                                            <p className="text-sm text-slate-400 font-medium">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT CONTENT: FORM */}
                        <div className="glass-card-dark p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-4 mb-10 pb-8 border-b border-white/5">
                                <div className="w-12 h-12 premium-gradient-alt rounded-2xl flex items-center justify-center text-white">
                                    <Upload size={24} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-white">Kirim Resep</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nama Pasien</label>
                                    <input
                                        type="text" required
                                        onChange={e => setFormData({ ...formData, nama_lengkap: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-bold text-sm text-white placeholder:text-slate-600"
                                        placeholder="Nama Lengkap"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nomor WhatsApp Aktif</label>
                                    <input
                                        type="text" required
                                        onChange={e => setFormData({ ...formData, nomor_wa: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-bold text-sm text-white placeholder:text-slate-600"
                                        placeholder="0812xxxx"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Foto Resep Medis</label>
                                    <div className="relative group">
                                        <input
                                            type="file" accept="image/*" required
                                            onChange={e => setFormData({ ...formData, foto_resep: e.target.files[0] })}
                                            className="w-full h-32 opacity-0 absolute inset-0 z-10 cursor-pointer"
                                        />
                                        <div className="w-full h-36 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center group-hover:bg-cyan-500/5 group-hover:border-cyan-500/30 transition-all">
                                            <Camera className="text-slate-500 mb-3 group-hover:text-cyan-400 transition-colors" size={32} />
                                            <p className="text-[10px] font-black text-slate-500 group-hover:text-white transition-colors uppercase tracking-[0.2em]">Pilih atau Seret Foto Resep</p>
                                        </div>
                                    </div>
                                    {formData.foto_resep && <p className="text-[10px] font-black text-lime-400 mt-3 flex items-center gap-2 uppercase tracking-widest bg-lime-400/10 px-4 py-2 rounded-xl border border-lime-400/20"><span>✅</span> Berkas: {formData.foto_resep.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Keterangan (Opsional)</label>
                                    <textarea
                                        onChange={e => setFormData({ ...formData, keterangan: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-bold text-sm h-32 resize-none text-white placeholder:text-slate-700"
                                        placeholder="Contoh: Pesanan untuk diantar ke rumah..."
                                    />
                                </div>

                                <button
                                    type="submit" disabled={loading}
                                    className="w-full py-5 premium-gradient-alt text-white font-black rounded-3xl shadow-xl shadow-lime-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Kirim Resep Sekarang</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* QUICK FOOTER */}
            <footer className="bg-slate-900/40 border-t border-white/5 py-20 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex justify-center gap-10 mb-10">
                        <a href="https://instagram.com/hadinata" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-all hover:scale-125"><Instagram size={24} /></a>
                        <a href="https://facebook.com/hadinata" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-all hover:scale-125"><Facebook size={24} /></a>
                        <a href="https://wa.me/6281390807472" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-all hover:scale-125"><Phone size={24} /></a>
                    </div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2026 APOTEK HADINATA • SECURE TELEPHARMACY SYSTEM</p>
                </div>
            </footer>
        </div>
    );
};

export default UnggahResep;