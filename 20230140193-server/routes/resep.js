const express = require('express');
const router = express.Router();
const resepController = require('../controllers/resepController');
const uploadResep = require('../middleware/uploadresep');
const { authAdmin } = require('../middleware/authAdmin');

// Endpoint Public
router.post('/upload', uploadResep.single('foto_resep'), resepController.validateResep, resepController.uploadResep);

// Endpoint Admin (Terproteksi)
router.get('/report', authAdmin, resepController.getAllResep);
router.patch('/status/:id', authAdmin, resepController.updateStatus);
router.delete('/:id', authAdmin, resepController.deleteResep);

module.exports = router;