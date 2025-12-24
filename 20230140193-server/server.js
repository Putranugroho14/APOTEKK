const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

// Impor router
const obatRoutes = require("./routes/obat");
const authRoutes = require("./routes/auth");
const resepRoutes = require("./routes/resep");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Penanganan folder uploads untuk Vercel (Serverless bersifat Read-Only)
// Kita gunakan folder /tmp sebagai fallback untuk mencegah error sistem
const uploadDir = path.join(process.cwd(), 'uploads', 'resep');
if (!fs.existsSync(uploadDir) && process.env.NODE_ENV !== 'production') {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Akses statis folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routing API
app.use("/api/obat", obatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resep", resepRoutes);

// Route testing untuk cek status server
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Server Apotek Online Berjalan!",
    environment: process.env.NODE_ENV || "development"
  });
});

// Penanganan Error 404
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Konfigurasi Port
const PORT = process.env.PORT || 3001;

// Hanya jalankan app.listen jika tidak sedang di lingkungan Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// Ekspor app untuk digunakan oleh runtime Vercel
module.exports = app;