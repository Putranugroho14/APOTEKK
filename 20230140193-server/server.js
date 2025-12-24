const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const fs = require('fs');
const path = require('path'); // Tambahkan path

// Impor router
const obatRoutes = require("./routes/obat");
const authRoutes = require("./routes/auth");
const resepRoutes = require("./routes/resep");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Perbaikan untuk Vercel: Gunakan folder /tmp untuk folder sementara jika perlu
// Namun untuk statis file, sebaiknya folder uploads sudah ada di repo
const uploadDir = './uploads/resep';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Akses statis folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routing API
app.use("/api/obat", obatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resep", resepRoutes);

// Tambahkan route testing untuk cek apakah server hidup
app.get("/", (req, res) => {
  res.send("Server Apotek Online Berjalan!");
});

// PERBAIKAN PORT UNTUK VERCEL/CLOUD
const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Tambahkan ini untuk Vercel