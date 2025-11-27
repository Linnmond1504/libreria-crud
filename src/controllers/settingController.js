// ====================================
// Controlador de configuraciones
// ====================================

const settingService = require('../services/settingService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Obtener todas las configuraciones
// @route   GET /api/settings
// @access  Private/Admin
exports.getAllSettings = asyncHandler(async (req, res) => {
  const settings = await settingService.getAllSettings();

  res.status(200).json({
    success: true,
    count: settings.length,
    data: settings
  });
});

// @desc    Obtener configuración por ID
// @route   GET /api/settings/:id
// @access  Private/Admin
exports.getSettingById = asyncHandler(async (req, res) => {
  const setting = await settingService.getSettingById(req.params.id);

  res.status(200).json({
    success: true,
    data: setting
  });
});

// @desc    Obtener configuración por clave
// @route   GET /api/settings/key/:key
// @access  Private/Admin
exports.getSettingByKey = asyncHandler(async (req, res) => {
  const setting = await settingService.getSettingByKey(req.params.key);

  res.status(200).json({
    success: true,
    data: setting
  });
});

// @desc    Crear nueva configuración
// @route   POST /api/settings
// @access  Private/Admin
exports.createSetting = asyncHandler(async (req, res) => {
  const setting = await settingService.createSetting(req.body);

  res.status(201).json({
    success: true,
    message: 'Configuración creada exitosamente',
    data: setting
  });
});

// @desc    Actualizar configuración
// @route   PUT /api/settings/:id
// @access  Private/Admin
exports.updateSetting = asyncHandler(async (req, res) => {
  const setting = await settingService.updateSetting(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Configuración actualizada exitosamente',
    data: setting
  });
});

// @desc    Eliminar configuración
// @route   DELETE /api/settings/:id
// @access  Private/Admin
exports.deleteSetting = asyncHandler(async (req, res) => {
  const result = await settingService.deleteSetting(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message
  });
});