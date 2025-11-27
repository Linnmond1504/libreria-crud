// ====================================================================================================
// Middleware de autenticación JWT
// ====================================================================================================

const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const tokenService = require('../services/tokenService');

// Proteger rutas - verificar JWT
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Verificar si el token existe en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('No autorizado, token no proporcionado', 401);
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que el token existe en la base de datos
    const tokenDoc = await tokenService.findToken(token);
    if (!tokenDoc) {
      throw new AppError('Token inválido o expirado', 401);
    }

    // Obtener usuario del token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new AppError('Usuario no encontrado', 401);
    }

    // Agregar usuario al request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Token inválido', 401);
    }
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expirado', 401);
    }
    throw error;
  }
});

// Autorizar roles específicos
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `El rol ${req.user.role} no tiene permiso para acceder a esta ruta`,
        403
      );
    }
    next();
  };
};

// Verificar permisos específicos
exports.checkPermission = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        `Permisos insuficientes. Se requiere rol: ${allowedRoles.join(' o ')}`,
        403
      );
    }
    next();
  };
};