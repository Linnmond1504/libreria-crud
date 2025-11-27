// ====================================================================================================
// ARCHIVO: src/routes/userRoutes.js
// ====================================================================================================

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/upload');

router.use(protect);

router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', upload.single('profileImage'), userController.updateUser); // AGREGADO UPLOAD
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;