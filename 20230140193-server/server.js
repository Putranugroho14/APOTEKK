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

// 1. PRIORITY: CORS Configuration (Must be first)
app.use(cors({
  origin: true, // Allow all origins dynamically
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true
}));

// Handle OPTIONS explicitly for Vercel
app.options('*', (req, res) => {
  res.status(200).end();
});

// 2. Core Middleware
app.use(express.json());
app.use(morgan("dev"));

const db = require("./models");

// 3. Database Sync (Non-blocking / Background)
// In serverless, we generally avoid blocking startup for DB sync
(async () => {
  try {
    // Only verify connection, don't auto-alter in standard production runs to avoid timeout
    await db.sequelize.authenticate();
    console.log("Database connected.");

    // Lazy sync hook - check conditions before running heavy operations
    // db.sequelize.sync({ alter: true }).catch(err => console.error("Sync error:", err)); 
  } catch (err) {
    console.error("DB Connection Failed (Server still running):", err.message);
  }
})();

// Penanganan folder uploads
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
app.get("/", async (req, res) => {
  let dbStatus = "Unknown";
  let dbError = null;
  let adminStatus = "Checking...";

  try {
    await db.sequelize.authenticate();
    dbStatus = "Connected";

    // Pastikan admin ada (Seringkali cold start vercel melewati blok .then di atas)
    const { User } = db;
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        nama: 'Administrator',
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      adminStatus = "Default created (admin/admin123)";
    } else {
      adminStatus = "Ready";
    }

  } catch (err) {
    dbStatus = "Failed";
    dbError = err.message;
  }

  res.status(200).json({
    status: "Success",
    message: "Server Apotek Online Berjalan!",
    database: dbStatus,
    database_error: dbError,
    admin_system: adminStatus
  });
});

// Penanganan Error 404
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Konfigurasi Port
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Ekspor app untuk digunakan oleh runtime Vercel
module.exports = app;