const express = require('express');
const router = express.Router();
const obatController = require('../controllers/obatController');
// Pastikan path dan nama file middleware ini benar di folder Anda
const { authArtikel } = require('../middleware/authArtikel'); 

router.get('/', obatController.getAllObat);
router.get('/:id', obatController.getObatById);

// Terproteksi Admin
router.post('/', authArtikel, obatController.validateObat, obatController.createObat);
router.put('/:id', authArtikel, obatController.validateObat, obatController.updateObat);
router.delete('/:id', authArtikel, obatController.deleteObat);

module.exports = router;