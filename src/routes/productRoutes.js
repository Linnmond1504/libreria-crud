// ====================================
// ARCHIVO: src/routes/productRoutes.js
// ====================================

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/upload');

router.get('/', productController.getAllProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);

// Rutas protegidas con subida de imagen
router.post('/', protect, upload.single('coverImage'), productController.createProduct);
router.put('/:id', protect, upload.single('coverImage'), productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;