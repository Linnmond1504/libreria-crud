// ====================================================================================================
// ARCHIVO: src/routes/loanRoutes.js
// ====================================================================================================

const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // Todas las rutas requieren autenticación

router.get('/', loanController.getAllLoans);
router.get('/my-loans', loanController.getMyLoans);
router.get('/overdue', authorize('admin', 'librarian'), loanController.getOverdueLoans);
router.get('/:id', loanController.getLoanById);
router.post('/', loanController.createLoan);
router.put('/:id', loanController.updateLoan);
router.post('/:id/return', loanController.returnLoan);
router.delete('/:id', authorize('admin', 'librarian'), loanController.deleteLoan);

module.exports = router;