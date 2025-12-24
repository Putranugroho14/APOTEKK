// src/components/UnggahResep.js
import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Send, ArrowLeft, CheckCircle, Phone, Mail, MapPin, Facebook, Instagram, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            await axios.post('http://localhost:3001/api/resep/upload', data);
            setSuccess(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            alert(err.response?.data?.message || "Gagal mengirim resep");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-lime-50">
                <div className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-md border-4 border-lime-500">
                    <div className="w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-16 h-16 text-lime-500" />
                    </div>
                    <h2 className="text-3xl font-black text-cyan-900 mb-4">Resep Terkirim!</h2>
                    <p className="text-slate-600 text-lg mb-6">Apoteker kami akan segera menghubungi Anda melalui WhatsApp.</p>
                    <div className="bg-cyan-50 p-4 rounded-2xl border-l-4 border-cyan-600">
                        <p className="text-sm text-cyan-900 font-semibold">💬 Mohon tunggu konfirmasi dari tim kami</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans">
            {/* HEADER - SAMA DENGAN PUBLIC */}
            <header className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white p-4 sm:p-6 shadow-xl">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
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
                    </div>
                    <button 
                        onClick={() => navigate('/')} 
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 sm:px-6 py-2 rounded-full font-semibold transition text-sm sm:text-base"
                    >
                        <ArrowLeft size={18} /> Kembali
                    </button>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-block bg-lime-500 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm mb-4 sm:mb-6 uppercase">
                            📋 Layanan Resep Digital
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 leading-tight">
                            Kirim <span className="text-lime-300">Resep Dokter</span> Anda
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8">
                            Unggah foto resep, tim apoteker kami akan memproses dan menghubungi Anda segera
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-lime-500 rounded-full flex items-center justify-center font-black text-xl sm:text-2xl">1</div>
                                <div>
                                    <p className="font-bold text-sm sm:text-base">Foto Resep</p>
                                    <p className="text-xs sm:text-sm opacity-75">Ambil foto jelas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-lime-500 rounded-full flex items-center justify-center font-black text-xl sm:text-2xl">2</div>
                                <div>
                                    <p className="font-bold text-sm sm:text-base">Isi Form</p>
                                    <p className="text-xs sm:text-sm opacity-75">Data diri singkat</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-lime-500 rounded-full flex items-center justify-center font-black text-xl sm:text-2xl">3</div>
                                <div>
                                    <p className="font-bold text-sm sm:text-base">Kami Hubungi</p>
                                    <p className="text-xs sm:text-sm opacity-75">Via WhatsApp</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FORM SECTION */}
            <section className="py-12 sm:py-16 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 border-2 border-cyan-100">
                            <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-lime-100 rounded-2xl flex items-center justify-center">
                                    <Upload className="text-lime-600" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-cyan-900 uppercase tracking-tight">Form Unggah Resep</h2>
                                    <p className="text-slate-500 text-xs sm:text-sm">Isi data dengan lengkap dan benar</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-black text-cyan-900 mb-2 sm:mb-3 uppercase">
                                        Nama Lengkap Pasien <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all font-medium text-sm sm:text-base" 
                                        placeholder="Masukkan nama sesuai KTP" 
                                        onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} 
                                        required 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-black text-cyan-900 mb-2 sm:mb-3 uppercase">
                                        Nomor WhatsApp <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all font-medium text-sm sm:text-base" 
                                        placeholder="Contoh: 08123456789" 
                                        onChange={e => setFormData({...formData, nomor_wa: e.target.value})} 
                                        required 
                                    />
                                    <p className="text-xs text-slate-500 mt-2 ml-1">
                                        💬 Pastikan nomor aktif untuk dihubungi apoteker
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-black text-cyan-900 mb-2 sm:mb-3 uppercase">
                                        Foto Resep Dokter <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="w-full p-4 sm:p-6 bg-gradient-to-br from-cyan-50 to-lime-50 rounded-xl sm:rounded-2xl border-2 border-dashed border-cyan-300 cursor-pointer hover:border-lime-400 hover:bg-lime-50 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 text-sm sm:text-base" 
                                            onChange={e => setFormData({...formData, foto_resep: e.target.files[0]})} 
                                            required 
                                        />
                                        <div className="mt-3 p-3 sm:p-4 bg-cyan-50 rounded-xl border-l-4 border-cyan-600">
                                            <p className="text-xs font-semibold text-cyan-900">📸 Tips Foto Resep:</p>
                                            <ul className="text-xs text-cyan-800 mt-2 space-y-1 ml-4 list-disc">
                                                <li>Pastikan tulisan jelas dan tidak buram</li>
                                                <li>Foto dalam pencahayaan yang cukup</li>
                                                <li>Format: JPG, JPEG, PNG (Max 5MB)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-black text-cyan-900 mb-2 sm:mb-3 uppercase">
                                        Keterangan Tambahan
                                    </label>
                                    <textarea 
                                        className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all h-24 sm:h-32 font-medium resize-none text-sm sm:text-base" 
                                        placeholder="Contoh: Alamat pengantaran atau informasi keluhan..." 
                                        onChange={e => setFormData({...formData, keterangan: e.target.value})} 
                                    />
                                </div>

                                <div className="pt-4 sm:pt-6 border-t-2 border-slate-100">
                                    <button 
                                        type="submit" 
                                        disabled={loading} 
                                        className="w-full bg-gradient-to-r from-lime-500 to-lime-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-lime-200 hover:shadow-2xl hover:from-lime-600 hover:to-lime-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 sm:w-6 h-5 sm:h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} /> Kirim ke Apoteker
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-xs text-slate-500 mt-3 sm:mt-4">
                                        Dengan mengirim, Anda setuju dengan <span className="text-cyan-600 font-semibold">kebijakan privasi</span> kami
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* INFO BOX */}
                        <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-cyan-100">
                            <h3 className="font-black text-cyan-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                                <Clock className="text-lime-500" size={18} />
                                Waktu Respon Cepat
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                <div className="flex items-start gap-3 bg-cyan-50 p-3 sm:p-4 rounded-xl">
                                    <div className="w-2 h-2 bg-cyan-600 rounded-full mt-1.5"></div>
                                    <div>
                                        <p className="font-bold text-cyan-900">Hari Kerja</p>
                                        <p className="text-slate-600">Respon dalam 15-30 menit</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-lime-50 p-3 sm:p-4 rounded-xl">
                                    <div className="w-2 h-2 bg-lime-600 rounded-full mt-1.5"></div>
                                    <div>
                                        <p className="font-bold text-lime-900">Akhir Pekan</p>
                                        <p className="text-slate-600">Respon dalam 1-2 jam</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER - SAMA DENGAN PUBLIC */}
            <footer className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white pt-12 sm:pt-16 pb-8 sm:pb-10">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
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
                                    Jl. Raya Kesehatan 123, Bandung
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
                    <div className="pt-6 sm:pt-8 border-t border-cyan-500 text-center text-xs sm:text-sm text-cyan-200">
                        <p>© {new Date().getFullYear()} Apotek Hadinata. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UnggahResep;