const express = require('express');
const router = express.Router();
const penjualanController = require('../controllers/penjualanController');
const { authAdmin } = require('../middleware/authAdmin');

// Wait, previous file view said: const { authAdmin } = require('../middleware/authAdmin');
// I need to check if it's auth.js or authAdmin.js in middleware.
// Step 8 ls showed middleware folder has 4 items.
// Step 12 showed routes folder.
// Let's check middleware folder content first or just try authAdmin which was used in obat.js.
// obat.js used '../middleware/authAdmin'.
// Step 71 confirmed: const { authAdmin } = require('../middleware/authAdmin');

router.post('/', penjualanController.createPenjualan); // Public

// Protected Admin Routes
router.get('/', authAdmin, penjualanController.getAllPenjualan);
router.put('/:id', authAdmin, penjualanController.updateStatus);
router.delete('/:id', authAdmin, penjualanController.deletePenjualan);

module.exports = router;
