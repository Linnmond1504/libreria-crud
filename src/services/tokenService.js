// ====================================
// Lógica de negocio para tokens
// ====================================

const Token = require('../models/tokenModel');
const AppError = require('../utils/appError');

class TokenService {
  // Crear token
  async createToken(userId, token, expiresIn) {
    const expiresAt = new Date(Date.now() + expiresIn);

    const tokenDoc = await Token.create({
      user: userId,
      token,
      expiresAt
    });

    return tokenDoc;
  }

  // Buscar token
  async findToken(token) {
    const tokenDoc = await Token.findOne({ token }).populate('user', '-password');
    return tokenDoc;
  }

  // Eliminar token (logout)
  async deleteToken(token) {
    const result = await Token.findOneAndDelete({ token });
    
    if (!result) {
      throw new AppError('Token no encontrado', 404);
    }

    return { message: 'Token eliminado exitosamente' };
  }

  // Eliminar todos los tokens de un usuario
  async deleteUserTokens(userId) {
    await Token.deleteMany({ user: userId });
    return { message: 'Todos los tokens del usuario fueron eliminados' };
  }

  // Limpiar tokens expirados
  async cleanExpiredTokens() {
    const result = await Token.deleteMany({
      expiresAt: { $lt: new Date() }
    });

    return { message: `${result.deletedCount} tokens expirados eliminados` };
  }
}

module.exports = new TokenService();