const db = require("../models");
const Obat = db.Obat;
const User = db.User;
const { body, validationResult } = require("express-validator");

// Validasi Input
exports.validateObat = [
  body("nama_obat").notEmpty().withMessage("Nama obat tidak boleh kosong"),
  body("deskripsi").notEmpty().withMessage("Deskripsi tidak boleh kosong"),
  body("harga").isNumeric().withMessage("Harga harus berupa angka"),
  body("stok").isNumeric().withMessage("Stok harus berupa angka"),
];

// 1. Create Obat (Menambahkan dukungan is_published)
exports.createObat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id: authorId } = req.user;
    const {
      nama_obat,
      deskripsi,
      stok,
      harga,
      gambar_url,
      kategori,
      is_published // Tambahkan field ini
    } = req.body;

    // Debug: log incoming payload and computed values
    console.log('createObat called by user:', req.user);
    console.log('createObat req.body:', req.body);

    const createPayload = {
      nama_obat,
      deskripsi,
      stok,
      harga,
      gambar_url,
      kategori,
      authorId,
      is_published: is_published || false // Default false jika tidak dikirim
    };
    console.log('createObat payload:', createPayload);

    const newObat = await Obat.create(createPayload);

    res.status(201).json({ message: "Obat berhasil ditambahkan.", data: newObat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error saat menambah obat", error: error.message });
  }
};

// 2. Get All Obat (Untuk Admin & Publik)
exports.getAllObat = async (req, res) => {
  try {
    // Jika ada query ?public=true, hanya tampilkan yang is_published: true
    const isPublicRequest = req.query.public === 'true';
    const whereCondition = isPublicRequest ? { is_published: true } : {};

    const data = await Obat.findAll({
      where: whereCondition,
      order: [['nama_obat', 'ASC']],
      include: [{ model: User, as: 'Admin', attributes: ['nama'] }]
    });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get Obat By ID
exports.getObatById = async (req, res) => {
  try {
    const data = await Obat.findByPk(req.params.id, {
      include: [{ model: User, as: 'Admin', attributes: ['nama'] }]
    });
    if (!data) return res.status(404).json({ message: "Obat tidak ditemukan" });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update Obat (Mendukung perubahan is_published dari Menu Edit)
exports.updateObat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const obat = await Obat.findByPk(req.params.id);
    if (!obat) return res.status(404).json({ message: "Obat tidak ditemukan" });

    const { 
      nama_obat, 
      deskripsi, 
      stok, 
      harga, 
      gambar_url, 
      kategori, 
      is_published // Field status publikasi
    } = req.body;

    await obat.update({ 
      nama_obat, 
      deskripsi, 
      stok, 
      harga, 
      gambar_url, 
      kategori,
      is_published 
    });

    res.json({ message: "Data obat berhasil diperbarui", data: obat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete Obat
exports.deleteObat = async (req, res) => {
  try {
    const obat = await Obat.findByPk(req.params.id);
    if (!obat) return res.status(404).json({ message: "Obat tidak ditemukan" });

    await obat.destroy();
    res.json({ message: "Obat berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};