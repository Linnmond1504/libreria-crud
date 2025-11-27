// ====================================
// Controlador de tokens
// ====================================

const tokenService = require('../services/tokenService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Limpiar tokens expirados
// @route   DELETE /api/tokens/cleanup
// @access  Private/Admin
exports.cleanupTokens = asyncHandler(async (req, res) => {
  const result = await tokenService.cleanExpiredTokens();

  res.status(200).json({
    success: true,
    message: result.message
  });
});

// @desc    Eliminar todos los tokens de un usuario
// @route   DELETE /api/tokens/user/:userId
// @access  Private/Admin
exports.deleteUserTokens = asyncHandler(async (req, res) => {
  const result = await tokenService.deleteUserTokens(req.params.userId);

  res.status(200).json({
    success: true,
    message: result.message
  });
});