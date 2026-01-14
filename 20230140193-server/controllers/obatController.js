const db = require("../models");
const Obat = db.Obat;
const User = db.User;
const { body, validationResult } = require("express-validator");

// Validasi Input (Diberi prefix unik untuk tes koneksi)
exports.validateObat = [
  body("nama_obat").trim().notEmpty().withMessage("VERIFIKASI-BARU: Nama obat tidak boleh kosong"),
  body("deskripsi").trim().notEmpty().withMessage("VERIFIKASI-BARU: Deskripsi tidak boleh kosong"),
  body("harga").custom((val) => !isNaN(parseFloat(val))).withMessage("VERIFIKASI-BARU: Harga harus berupa angka"),
  body("stok").custom((val) => !isNaN(parseInt(val))).withMessage("VERIFIKASI-BARU: Stok harus berupa angka"),
];

// 1. Create Obat (Menambahkan dukungan is_published & Upload Gambar)
exports.createObat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation Errors:", errors.array());
    console.log("Received Body:", req.body);
    return res.status(400).json({
      message: "Validasi gagal",
      errors: errors.array()
    });
  }

  try {
    const { id: authorId } = req.user;
    const {
      nama_obat,
      deskripsi,
      stok,
      harga,
      gambar_url, // Bisa dari input manual
      kategori,
      is_published,
      rating
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
      is_published: is_published === 'true' || is_published === true, // Handle string "true" from FormData
      rating: parseFloat(rating) || 4.5
    };

    const newObat = await Obat.create(createPayload);

    res.status(201).json({ message: "Obat berhasil ditambahkan.", data: newObat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error saat menambah obat", error: error.message });
  }
};

// 2. Get All Obat
exports.getAllObat = async (req, res) => {
  try {
    const { published } = req.query;
    const where = published === 'true' ? { is_published: true } : {};

    const obats = await Obat.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    return res.json({ data: obats });
  } catch (error) {
    console.error("Error in getAllObat:", error);
    return res.status(500).json({
      message: "Gagal mengambil data obat",
      error: error.message,
      detail: error.original ? error.original.message : null
    });
  }
};

// 3. Get Obat By ID
exports.getObatById = async (req, res) => {
  try {
    const obat = await Obat.findByPk(req.params.id);
    if (!obat) return res.status(404).json({ message: "Obat tidak ditemukan" });
    return res.json({ data: obat });
  } catch (error) {
    console.error("Error in getObatById:", error);
    return res.status(500).json({
      message: "Gagal mengambil data obat",
      error: error.message
    });
  }
};

// 4. Update Obat
exports.updateObat = async (req, res) => {
  console.log("REQ.BODY:", JSON.stringify(req.body, null, 2));
  console.log("REQ.PARAMS:", JSON.stringify(req.params, null, 2));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("SERVER-SIDE-DEBUG: Validation failed.");
    return res.status(400).json({
      status: "fail",
      message: "Gagal Validasi Data (Versi Terbaru)",
      errors: errors.array(),
      info: "Jika Anda melihat pesan ini, berarti Anda sudah memanggil backend yang BENAR.",
      received_keys: Object.keys(req.body)
    });
  }

  try {
    const { id } = req.params;
    console.log(`ATTEMPTING UPDATE FOR ID: ${id}`);

    const obat = await Obat.findByPk(id);
    if (!obat) return res.status(404).json({ message: "Obat tidak ditemukan" });

    const {
      nama_obat,
      deskripsi,
      stok,
      harga,
      gambar_url,
      kategori,
      is_published,
      rating
    } = req.body;

    const updateData = {
      nama_obat,
      deskripsi,
      stok: parseInt(stok) || 0,
      harga: parseFloat(harga) || 0,
      gambar_url: (req.file && req.file.path) ? req.file.path : (gambar_url || obat.gambar_url),
      kategori: kategori || "Obat Bebas",
      is_published: is_published === 'true' || is_published === true,
      rating: parseFloat(rating) || 4.5
    };

    console.log("MAPPING UPDATE DATA:", JSON.stringify(updateData, null, 2));

    await obat.update(updateData);

    res.json({ message: "Data obat berhasil diperbarui", data: obat });
  } catch (error) {
    console.error("DATABASE OR SYSTEM ERROR:", error);
    res.status(500).json({ message: "Gagal update ke database", error: error.message });
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