const { Penjualan, Obat, sequelize } = require('../models');

// CREATE Order (Public)
exports.createPenjualan = async (req, res) => {
    console.log("Menerima pesanan baru:", req.body);
    const t = await sequelize.transaction();
    try {
        const { nama_pelanggan, nomor_wa, alamat, detail_pesanan, total_harga } = req.body;

        // 1. Create Penjualan Record
        const newPenjualan = await Penjualan.create({
            nama_pelanggan,
            nomor_wa,
            alamat,
            detail_pesanan: typeof detail_pesanan === 'string' ? detail_pesanan : JSON.stringify(detail_pesanan),
            total_harga,
            status: 'Menunggu'
        }, { transaction: t });

        // 2. Reduce Stock
        const items = typeof detail_pesanan === 'string' ? JSON.parse(detail_pesanan) : detail_pesanan;

        for (const item of items) {
            const obat = await Obat.findByPk(item.id, { transaction: t });
            if (obat) {
                if (obat.stok < item.qty) {
                    throw new Error(`Stok obat ${obat.nama_obat} tidak mencukupi`);
                }
                obat.stok -= item.qty;
                await obat.save({ transaction: t });
            }
        }

        await t.commit();
        console.log("Pesanan berhasil disimpan & stok diperbarui ID:", newPenjualan.id);

        res.status(201).json({
            message: "Pesanan berhasil dibuat dan stok diperbarui",
            data: newPenjualan
        });
    } catch (error) {
        await t.rollback();
        console.error("Error creating penjualan:", error);
        res.status(500).json({ message: error.message || "Gagal membuat pesanan", error: error.message });
    }
};

// GET All Orders (Admin Only)
exports.getAllPenjualan = async (req, res) => {
    try {
        console.log("Mencoba mengambil data penjualan...");
        const penjualans = await Penjualan.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            data: penjualans
        });
    } catch (error) {
        console.error("Gagal mengambil data penjualan:", error);
        res.status(500).json({
            message: "Gagal mengambil data penjualan",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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
