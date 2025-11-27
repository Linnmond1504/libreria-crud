// ====================================
// Controlador de usuarios (maneja request/response)
// ====================================

const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id; // ← AGREGAR ESTA LÍNEA
  
  // Si se subió una nueva foto de perfil
  if (req.file) {
    req.body.profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
    console.log('✅ Foto de perfil actualizada:', req.body.profileImage);
  }
  
  // No permitir actualizar la contraseña por esta ruta
  if (req.body.password) {
    throw new AppError('No se puede actualizar la contraseña por esta ruta', 400);
  }

  // Verificar si el nuevo email ya existe
  if (req.body.email) {
    const userService = require('../services/userService');
    const existingUser = await userService.getUserByEmail(req.body.email);
    
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new AppError('El email ya está en uso', 400);
    }
  }

  const userService = require('../services/userService');
  const user = await userService.updateUser(userId, req.body);

  res.status(200).json({
    success: true,
    message: 'Usuario actualizado exitosamente',
    data: user
  });
});

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message
  });
});