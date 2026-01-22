const { Penjualan } = require('../models');

// CREATE Order (Public)
exports.createPenjualan = async (req, res) => {
    try {
        const { nama_pelanggan, nomor_wa, alamat, detail_pesanan, total_harga } = req.body;

        const newPenjualan = await Penjualan.create({
            nama_pelanggan,
            nomor_wa,
            alamat,
            detail_pesanan: typeof detail_pesanan === 'string' ? detail_pesanan : JSON.stringify(detail_pesanan),
            total_harga,
            status: 'Menunggu'
        });

        res.status(201).json({
            message: "Pesanan berhasil dibuat",
            data: newPenjualan
        });
    } catch (error) {
        console.error("Error creating penjualan:", error);
        res.status(500).json({ message: "Gagal membuat pesanan", error: error.message });
    }
};

// GET All Orders (Admin Only)
exports.getAllPenjualan = async (req, res) => {
    try {
        const penjualans = await Penjualan.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            data: penjualans
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data penjualan", error: error.message });
    }
};

// UPDATE Status (Admin Only)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const penjualan = await Penjualan.findByPk(id);
        if (!penjualan) return res.status(404).json({ message: "Data penjualan tidak ditemukan" });

        penjualan.status = status;
        await penjualan.save();

        res.status(200).json({
            message: "Status berhasil diperbarui",
            data: penjualan
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui status", error: error.message });
    }
};

// DELETE Order (Admin Only)
exports.deletePenjualan = async (req, res) => {
    try {
        const { id } = req.params;
        const penjualan = await Penjualan.findByPk(id);
        if (!penjualan) return res.status(404).json({ message: "Data penjualan tidak ditemukan" });

        await penjualan.destroy();
        res.status(200).json({ message: "Data penjualan berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus data", error: error.message });
    }
};
