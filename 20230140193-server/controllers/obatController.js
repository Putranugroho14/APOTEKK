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

// 1. Create Obat (Menambahkan dukungan is_published & Upload Gambar)
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
      gambar_url, // Bisa dari input manual
      kategori,
      is_published
    } = req.body;

    let finalGambarUrl = gambar_url;
    if (req.file && req.file.path) {
      finalGambarUrl = req.file.path;
    }

    const createPayload = {
      nama_obat,
      deskripsi,
      stok,
      harga,
      gambar_url: finalGambarUrl,
      kategori,
      authorId,
      is_published: is_published === 'true' || is_published === true // Handle string "true" from FormData
    };

    const newObat = await Obat.create(createPayload);

    res.status(201).json({ message: "Obat berhasil ditambahkan.", data: newObat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error saat menambah obat", error: error.message });
  }
};

// ... getAllObat and getObatById remain same ...

// 4. Update Obat
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
      is_published
    } = req.body;

    let finalGambarUrl = gambar_url || obat.gambar_url; // Default to existing if not provided
    if (req.file && req.file.path) {
      finalGambarUrl = req.file.path;
    }

    await obat.update({
      nama_obat,
      deskripsi,
      stok,
      harga,
      gambar_url: finalGambarUrl,
      kategori,
      is_published: is_published === 'true' || is_published === true
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