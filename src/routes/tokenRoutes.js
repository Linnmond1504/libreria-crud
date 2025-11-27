// ====================================================================================================
// ARCHIVO: src/routes/tokenRoutes.js
// ====================================================================================================

const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin')); // Todas las rutas requieren admin

router.delete('/cleanup', tokenController.cleanupTokens);
router.delete('/user/:userId', tokenController.deleteUserTokens);

module.exports = router;