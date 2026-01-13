const express = require('express');
const router = express.Router();
const obatController = require('../controllers/obatController');
// Pastikan path dan nama file middleware ini benar di folder Anda
const { authAdmin } = require('../middleware/authAdmin');

router.get('/', obatController.getAllObat);
router.get('/:id', obatController.getObatById);

// Terproteksi Admin
router.post('/', authAdmin, obatController.validateObat, obatController.createObat);
router.put('/:id', authAdmin, obatController.validateObat, obatController.updateObat);
router.delete('/:id', authAdmin, obatController.deleteObat);

module.exports = router;