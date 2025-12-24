const express = require('express');
const router = express.Router();
const resepController = require('../controllers/resepController');
const uploadResep = require('../middleware/uploadresep');

// Endpoint Public
router.post('/upload', uploadResep.single('foto_resep'), resepController.validateResep, resepController.uploadResep);

// Endpoint Admin
router.get('/report', resepController.getAllResep);
router.patch('/status/:id', resepController.updateStatus);
router.delete('/:id', resepController.deleteResep);

module.exports = router;