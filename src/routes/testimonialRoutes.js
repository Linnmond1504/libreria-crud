// ====================================================================================================
// ARCHIVO: src/routes/testimonialRoutes.js
// ====================================================================================================

const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', testimonialController.getAllTestimonials);
router.get('/product/:productId', testimonialController.getTestimonialsByProduct);
router.get('/:id', testimonialController.getTestimonialById);

// Rutas protegidas
router.post('/', protect, testimonialController.createTestimonial);
router.put('/:id', protect, testimonialController.updateTestimonial);
router.delete('/:id', protect, testimonialController.deleteTestimonial);

module.exports = router;
