// ====================================
// Controlador de préstamos
// ====================================

const loanService = require('../services/loanService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Obtener todos los préstamos
// @route   GET /api/loans
// @access  Private
exports.getAllLoans = asyncHandler(async (req, res) => {
  const filters = {
    status: req.query.status,
    userId: req.query.userId
  };

  const loans = await loanService.getAllLoans(filters);

  res.status(200).json({
    success: true,
    count: loans.length,
    data: loans
  });
});

// @desc    Obtener préstamo por ID
// @route   GET /api/loans/:id
// @access  Private
exports.getLoanById = asyncHandler(async (req, res) => {
  const loan = await loanService.getLoanById(req.params.id);

  res.status(200).json({
    success: true,
    data: loan
  });
});

// @desc    Obtener préstamos del usuario actual
// @route   GET /api/loans/my-loans
// @access  Private
exports.getMyLoans = asyncHandler(async (req, res) => {
  const loans = await loanService.getLoansByUser(req.user.id);

  res.status(200).json({
    success: true,
    count: loans.length,
    data: loans
  });
});

// @desc    Crear nuevo préstamo
// @route   POST /api/loans
// @access  Private
exports.createLoan = asyncHandler(async (req, res) => {
  const loan = await loanService.createLoan(req.body, req.user.id);

  res.status(201).json({
    success: true,
    message: 'Préstamo creado exitosamente',
    data: loan
  });
});

// @desc    Actualizar préstamo
// @route   PUT /api/loans/:id
// @access  Private
exports.updateLoan = asyncHandler(async (req, res) => {
  const loan = await loanService.updateLoan(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Préstamo actualizado exitosamente',
    data: loan
  });
});

// @desc    Marcar préstamo como devuelto
// @route   POST /api/loans/:id/return
// @access  Private
exports.returnLoan = asyncHandler(async (req, res) => {
  const loan = await loanService.returnLoan(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Libro devuelto exitosamente',
    data: loan
  });
});

// @desc    Eliminar préstamo
// @route   DELETE /api/loans/:id
// @access  Private/Admin
exports.deleteLoan = asyncHandler(async (req, res) => {
  const result = await loanService.deleteLoan(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message
  });
});

// @desc    Obtener préstamos vencidos
// @route   GET /api/loans/overdue
// @access  Private/Admin
exports.getOverdueLoans = asyncHandler(async (req, res) => {
  const loans = await loanService.getOverdueLoans();

  res.status(200).json({
    success: true,
    count: loans.length,
    data: loans
  });
});