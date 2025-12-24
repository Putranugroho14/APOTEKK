const db = require("../models");
const Resep = db.Resep; // Pastikan di models/index.js sudah terdaftar
const { body, validationResult } = require("express-validator");

// Validasi Input untuk User
exports.validateResep = [
  body("nama_lengkap").notEmpty().withMessage("Nama lengkap tidak boleh kosong"),
  body("nomor_wa").notEmpty().withMessage("Nomor WhatsApp tidak boleh kosong"),
];

// 1. Create Resep (Untuk Public User)
exports.uploadResep = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { nama_lengkap, nomor_wa, keterangan } = req.body;
    const foto_resep = req.file ? req.file.filename : null;

    if (!foto_resep) {
      return res.status(400).json({ message: "Foto resep wajib diunggah" });
    }

    const newResep = await Resep.create({
      nama_lengkap,
      nomor_wa,
      foto_resep,
      keterangan,
      status: "pending" // Default status
    });

    res.status(201).json({ message: "Resep berhasil dikirim ke apotek.", data: newResep });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengirim resep", error: error.message });
  }
};

// 2. Get All Resep (Untuk Admin Report)
exports.getAllResep = async (req, res) => {
  try {
    const data = await Resep.findAll({
      // Menggunakan created_at karena underscored: true di model
      order: [['created_at', 'DESC']] 
    });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Update Status Resep (Untuk Admin di Halaman Report)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // pending, diproses, selesai

    const resep = await Resep.findByPk(id);
    if (!resep) return res.status(404).json({ message: "Resep tidak ditemukan" });

    await resep.update({ status });
    res.json({ message: "Status resep berhasil diperbarui", data: resep });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Delete Resep (Jika Admin ingin menghapus data)
exports.deleteResep = async (req, res) => {
  try {
    const resep = await Resep.findByPk(req.params.id);
    if (!resep) return res.status(404).json({ message: "Resep tidak ditemukan" });

    await resep.destroy();
    res.json({ message: "Data resep berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};