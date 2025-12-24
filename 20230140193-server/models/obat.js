const db = require('../models/index'); // Sesuaikan path ke folder models
const Obat = db.obat; // GUNAKAN HURUF KECIL sesuai modelName di file Anda

export default async function handler(req, res) {
  try {
    // Pastikan database terkoneksi
    await db.sequelize.authenticate();
    
    // Gunakan variabel Obat (huruf kecil)
    const data = await Obat.findAll(); 
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack // Ini akan membantu kita debug lebih dalam di browser
    });
  }
}