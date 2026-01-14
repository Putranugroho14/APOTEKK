const express = require('express');
const router = express.Router();
const obatController = require('../controllers/obatController');
// Pastikan path dan nama file middleware ini benar di folder Anda
const { authAdmin } = require('../middleware/authAdmin');

const uploadObat = require('../middleware/uploadObat');

router.get('/', obatController.getAllObat);
router.get('/:id', obatController.getObatById);

// Terproteksi Admin
router.post('/', authAdmin, uploadObat.single('gambar'), obatController.validateObat, obatController.createObat);
router.put('/:id', authAdmin, uploadObat.single('gambar'), obatController.validateObat, obatController.updateObat);
router.delete('/:id', authAdmin, obatController.deleteObat);

module.exports = router;