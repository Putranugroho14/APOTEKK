const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    // 💡 Penyesuaian: Menambahkan 'nama' sesuai dengan skema DB
    const { nama, username, password, role } = req.body;

    if (!nama || !username || !password) {
      return res.status(400).json({ message: "Nama, username, dan password harus diisi" });
    }

    // Karena role HANYA 'admin' di DB:
    if (role && role !== 'admin') {
      return res.status(400).json({ message: "Role tidak valid. Hanya 'admin' yang diizinkan." });
    }

    // Set role secara eksplisit ke 'admin'
    const finalRole = 'admin';

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      nama,           // 💡 Baru: Menyimpan nama
      username,       // Menyimpan username
      password: hashedPassword,
      role: finalRole // Selalu 'admin'
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      // Mengembalikan nama juga dalam respons
      data: { id: newUser.id, nama: newUser.nama, username: newUser.username, role: newUser.role }
    });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Username harus unik
      return res.status(400).json({ message: "Username sudah terdaftar." });
    }
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password harus diisi" });
    }

    // Mencari berdasarkan 'username'
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "Username tidak ditemukan." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah." });
    }

    // Pemeriksaan role (meskipun di DB hanya 'admin', ini adalah keamanan tambahan)
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Akses ditolak. Hanya user 'admin' yang diizinkan." });
    }

    const payload = {
      id: user.id,
      nama: user.nama,     // 💡 Baru: Sertakan nama di payload JWT
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({
      message: "Login berhasil",
      token: token
    });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};