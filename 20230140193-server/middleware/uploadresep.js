const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'resep_apotek',
        allowed_formats: ['jpg', 'png', 'jpeg', 'heic', 'heif', 'webp'],
        public_id: (req, file) => `RESEP-${Date.now()}`
    },
});

const uploadResep = multer({ storage: storage });

module.exports = uploadResep;