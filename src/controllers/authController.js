// ====================================
// Controlador de autenticación
// ====================================

const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

// Función helper para generar JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Crear usuario
  const user = await userService.createUser({
    name,
    email,
    password,
    role: role || 'user'
  });

  // Generar token
  const token = generateToken(user._id);

  // Guardar token en DB
  await tokenService.createToken(user._id, token, 7 * 24 * 60 * 60 * 1000); // 7 días

  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    token,
    data: user
  });
});

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validar campos
  if (!email || !password) {
    throw new AppError('Por favor proporciona email y contraseña', 400);
  }

  // Buscar usuario con contraseña
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new AppError('Credenciales inválidas', 401);
  }

  // Verificar contraseña
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError('Credenciales inválidas', 401);
  }

  // Generar token
  const token = generateToken(user._id);

  // Guardar token en DB
  await tokenService.createToken(user._id, token, 7 * 24 * 60 * 60 * 1000);

  // Remover contraseña del objeto user
  user.password = undefined;

  res.status(200).json({
    success: true,
    message: 'Login exitoso',
    token,
    data: user
  });
});

// @desc    Logout de usuario
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    await tokenService.deleteToken(token);
  }

  res.status(200).json({
    success: true,
    message: 'Logout exitoso'
  });
});

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});