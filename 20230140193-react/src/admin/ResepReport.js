import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, MessageCircle, ExternalLink, Trash2, ArrowLeft, Package, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResepReport = () => {
    const [reseps, setReseps] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fungsi Helper format tanggal yang lebih bagus
    const formatDateTime = (dateString) => {
        if (!dateString) return { date: "Tanggal Kosong", time: "", day: "" };
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return { date: "Format Salah", time: "", day: "" };

        // Format tanggal: 24 Desember 2025
        const formattedDate = new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);

        // Format waktu: 12:42 WIB
        const formattedTime = new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }).format(date).replace('GMT+7', 'WIB');

        // Format hari: Selasa
        const formattedDay = new Intl.DateTimeFormat('id-ID', {
            weekday: 'long'
        }).format(date);

        return {
            date: formattedDate,
            time: formattedTime,
            day: formattedDay
        };
    };

    // Fungsi untuk menghitung berapa lama dari sekarang
    const getTimeAgo = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Baru saja";
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return "";
    };

    const fetchReseps = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3001/api/resep/report');
            console.log("Data dari backend:", res.data.data);
            setReseps(res.data.data);
        } catch (err) {
            console.error("Gagal memuat data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReseps(); }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.patch(`http://localhost:3001/api/resep/status/${id}`, { status });
            fetchReseps();
        } catch (err) {
            alert("Gagal memperbarui status");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Hapus data resep ini secara permanen?")) {
            try {
                await axios.delete(`http://localhost:3001/api/resep/${id}`);
                fetchReseps();
            } catch (err) { 
                alert("Gagal menghapus data"); 
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
            <nav className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-xl p-5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/20 rounded-xl transition">
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Package size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-tight">KELOLA RESEP</h1>
                                <p className="text-xs text-cyan-100">Manajemen Resep Pasien</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-lime-500 text-white px-5 py-2 rounded-full font-black text-sm shadow-lg">
                        Total: {reseps.length} Resep
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6 sm:p-8">
                <div className="bg-white rounded-3xl border-2 border-cyan-200 shadow-2xl overflow-hidden">
                    {loading ? (
                        <div className="p-20 text-center">
                            <div className="animate-spin w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-cyan-900 font-bold">Memuat data...</p>
                        </div>
                    ) : reseps.length === 0 ? (
                        <div className="p-20 text-center">
                            <Package size={80} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold text-lg">Belum ada resep</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white">
                                        <th className="p-6 text-xs font-black uppercase tracking-wider">Waktu Masuk</th>
                                        <th className="p-6 text-xs font-black uppercase tracking-wider">Pasien</th>
                                        <th className="p-6 text-xs font-black uppercase tracking-wider">Keterangan</th>
                                        <th className="p-6 text-xs font-black uppercase tracking-wider">Foto Resep</th>
                                        <th className="p-6 text-xs font-black uppercase tracking-wider">Status</th>
                                        <th className="p-6 text-xs font-black uppercase tracking-wider text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reseps.map(r => {
                                        const dateTime = formatDateTime(r.createdAt);
                                        const timeAgo = getTimeAgo(r.createdAt);
                                        
                                        return (
                                            <tr key={r.id} className="hover:bg-cyan-50/50 transition-all">
                                                <td className="p-6">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white shadow-lg">
                                                            <Calendar size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            {/* Hari */}
                                                            <p className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider mb-0.5">
                                                                {dateTime.day}
                                                            </p>
                                                            {/* Tanggal */}
                                                            <p className="font-black text-cyan-900 text-[15px] leading-tight mb-1">
                                                                {dateTime.date}
                                                            </p>
                                                            {/* Waktu */}
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                <Clock size={13} className="text-slate-400" />
                                                                <p className="text-[13px] font-bold text-slate-600">
                                                                    {dateTime.time}
                                                                </p>
                                                            </div>
                                                            {/* Berapa lama */}
                                                            {timeAgo && (
                                                                <p className="text-[10px] text-lime-600 font-black uppercase tracking-widest bg-lime-50 px-2 py-0.5 rounded-full inline-block">
                                                                    {timeAgo}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <p className="font-black text-cyan-900 text-base mb-1">{r.nama_lengkap}</p>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-lime-700">
                                                        <MessageCircle size={14} /> {r.nomor_wa}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-sm text-slate-600 italic line-clamp-2 max-w-xs">
                                                        {r.keterangan || "Tidak ada keterangan"}
                                                    </p>
                                                </td>
                                                <td className="p-6">
                                                    <a 
                                                        href={`http://localhost:3001/uploads/resep/${r.foto_resep}`} 
                                                        target="_blank" rel="noreferrer" 
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-xl text-xs font-bold hover:bg-cyan-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <ExternalLink size={16} /> Lihat Dokumen
                                                    </a>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide border-2 ${
                                                        r.status === 'selesai' ? 'bg-lime-100 text-lime-700 border-lime-300' : 
                                                        r.status === 'diproses' ? 'bg-amber-100 text-amber-700 border-amber-300' : 
                                                        'bg-slate-100 text-slate-600 border-slate-300'
                                                    }`}>
                                                        {r.status === 'selesai' ? '✓ Selesai' : r.status === 'diproses' ? '⏳ Diproses' : '⏸ Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleUpdateStatus(r.id, 'selesai')} 
                                                            className="p-3 bg-lime-500 text-white rounded-xl hover:bg-lime-600 transition-transform hover:scale-110 shadow-lg"
                                                            title="Tandai Selesai"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <a 
                                                            href={`https://wa.me/${r.nomor_wa.replace(/^0/, '62')}`} 
                                                            target="_blank" 
                                                            rel="noreferrer" 
                                                            className="p-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-transform hover:scale-110 shadow-lg"
                                                            title="Chat WhatsApp"
                                                        >
                                                            <MessageCircle size={18} />
                                                        </a>
                                                        <button 
                                                            onClick={() => handleDelete(r.id)} 
                                                            className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-transform hover:scale-110 shadow-lg"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResepReport;