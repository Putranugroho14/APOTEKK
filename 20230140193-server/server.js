const express = require("express");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

// Impor router
const obatRoutes = require("./routes/obat");
const authRoutes = require("./routes/auth");
const resepRoutes = require("./routes/resep");

const app = express();

// 1. CORS (Kembali ke versi paling dasar yang sebelumnya jalan)
app.use(cors());

// 2. Middleware Dasar
app.use(express.json());
app.use(morgan("dev"));

// Database model
const db = require("./models");

// Sinkronisasi Database (Penting untuk pertama kali/perubahan skema)
// Kita gunakan sync() biasa, dan handle error agar tidak membunuh main process
db.sequelize.sync({ alter: true }).catch(err => {
  console.error("Database sync failed, but server continues:", err);
});

// Routing API
app.use("/api/obat", obatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resep", resepRoutes);

// Route testing untuk cek status server
app.get("/", async (req, res) => {
  let dbStatus = "Unknown";
  let dbError = null;

  try {
    await db.sequelize.authenticate();
    dbStatus = "Connected";
  } catch (err) {
    dbStatus = "Failed";
    dbError = err.message;
  }

  res.status(200).json({
    status: "Success",
    message: "Server Apotek Online Berjalan!",
    database: dbStatus,
    database_error: dbError
  });
});

// Penanganan Error 404
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Konfigurasi Port
const PORT = process.env.PORT || 3001;

// Jangan panggil app.listen di Vercel jika diekspor, 
// tapi biasanya aman (Vercel mengabaikannya). 
// Namun untuk keamanan, kita cek jika tidak dideploy di Vercel.
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Ekspor app untuk digunakan oleh runtime Vercel
module.exports = app;