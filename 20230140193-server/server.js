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
const db = require("./models");

// Sinkronisasi Database (Penting untuk pertama kali deploy)
db.sequelize.sync({ alter: true })
  .then(async () => {
    console.log("Database synced successfully");

    // Auto Create Default Admin: admin / admin123
    try {
      const { User } = db;
      const adminExists = await User.findOne({ where: { username: 'admin' } });

      if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
          nama: 'Administrator',
          username: 'admin',
          password: hashedPassword,
          role: 'admin'
        });
        console.log("Default Admin created: admin / admin123");
      }
    } catch (adminErr) {
      console.error("Failed to create default admin:", adminErr);
    }
  })
  .catch(err => console.error("Database sync failed:", err));

// Middleware
app.use(cors({
  origin: "*", // Allow all for debugging CORS 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// Handle preflight requests specifically
app.options('*', cors());

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