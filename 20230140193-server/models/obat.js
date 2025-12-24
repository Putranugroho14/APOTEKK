const db = require('../models/index');
const modelObat = db.obat; // Pastikan menggunakan db.obat

export default async function handler(req, res) {
  try {
    const data = await modelObat.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}