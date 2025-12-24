const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resep/'); // Pastikan folder ini ada di root project Anda
    },
    filename: (req, file, cb) => {
        cb(null, `RESEP-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadResep = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) return cb(null, true);
        cb(new Error("Hanya file gambar (jpg/png) yang diperbolehkan"));
    }
});

module.exports = uploadResep;