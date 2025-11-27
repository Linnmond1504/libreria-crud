// ====================================
// Lógica de negocio para usuarios
// ====================================

const User = require('../models/userModel');
const AppError = require('../utils/appError');

class UserService {
  // Obtener todos los usuarios
  async getAllUsers() {
    const users = await User.find().select('-password');
    return users;
  }

  // Obtener usuario por ID
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    
    return user;
  }

  // Crear nuevo usuario
  async createUser(userData) {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      throw new AppError('El email ya está registrado', 400);
    }

    const user = await User.create(userData);
    
    // Retornar usuario sin contraseña
    const userObject = user.toObject();
    delete userObject.password;
    
    return userObject;
  }

  // Actualizar usuario
  async updateUser(userId, updateData) {
    // No permitir actualizar la contraseña por esta ruta
    if (updateData.password) {
      throw new AppError('No se puede actualizar la contraseña por esta ruta', 400);
    }

    // Verificar si el nuevo email ya existe
    if (updateData.email) {
      const existingUser = await User.findOne({ 
        email: updateData.email,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        throw new AppError('El email ya está en uso', 400);
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return user;
  }

  // Eliminar usuario
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return { message: 'Usuario eliminado exitosamente' };
  }

  // Buscar usuario por email (para login)
  async getUserByEmail(email) {
    const user = await User.findOne({ email }).select('+password');
    return user;
  }
}

module.exports = new UserService();