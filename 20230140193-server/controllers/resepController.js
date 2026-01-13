const db = require("../models");
const Resep = db.Resep; // Pastikan di models/index.js sudah terdaftar
const { body, validationResult } = require("express-validator");

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Storage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resep_apotek',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

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
    // req.file.path sekarang berisi URL lengkap dari Cloudinary
    const foto_resep = req.file ? req.file.path : null;

    if (!foto_resep) {
      return res.status(400).json({ message: "Foto resep wajib diunggah" });
    }

    const newResep = await Resep.create({
      nama_lengkap,
      nomor_wa,
      foto_resep, // Simpan URL, bukan cuma filename
      keterangan,
      status: "pending"
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
      order: [['createdAt', 'DESC']]
    });
    res.json({ data });
  } catch (error) {
    console.error("Error in getAllResep:", error);
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