// ====================================================================================================
// ARCHIVO: src/routes/categoryRoutes.js
// ====================================================================================================

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/upload');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Rutas protegidas CON UPLOAD
router.post('/', protect, upload.single('coverImage'), categoryController.createCategory);
router.put('/:id', protect, upload.single('coverImage'), categoryController.updateCategory);
router.delete('/:id', protect, categoryController.deleteCategory);

module.exports = router;