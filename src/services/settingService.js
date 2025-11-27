// ====================================
// Lógica de negocio para configuraciones
// ====================================

const Setting = require('../models/settingModel');
const AppError = require('../utils/appError');

class SettingService {
  // Obtener todas las configuraciones
  async getAllSettings() {
    const settings = await Setting.find().sort({ key: 1 });
    return settings;
  }

  // Obtener configuración por ID
  async getSettingById(settingId) {
    const setting = await Setting.findById(settingId);
    
    if (!setting) {
      throw new AppError('Configuración no encontrada', 404);
    }
    
    return setting;
  }

  // Obtener configuración por clave
  async getSettingByKey(key) {
    const setting = await Setting.findOne({ key });
    
    if (!setting) {
      throw new AppError('Configuración no encontrada', 404);
    }
    
    return setting;
  }

  // Crear nueva configuración
  async createSetting(settingData) {
    // Verificar que la clave no exista
    const existingSetting = await Setting.findOne({ key: settingData.key });
    
    if (existingSetting) {
      throw new AppError('Ya existe una configuración con esa clave', 400);
    }

    const setting = await Setting.create(settingData);
    return setting;
  }

  // Actualizar configuración
  async updateSetting(settingId, updateData) {
    // Si se actualiza la clave, verificar que no exista
    if (updateData.key) {
      const existingSetting = await Setting.findOne({
        key: updateData.key,
        _id: { $ne: settingId }
      });
      
      if (existingSetting) {
        throw new AppError('Ya existe una configuración con esa clave', 400);
      }
    }

    const setting = await Setting.findByIdAndUpdate(
      settingId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!setting) {
      throw new AppError('Configuración no encontrada', 404);
    }

    return setting;
  }

  // Eliminar configuración
  async deleteSetting(settingId) {
    const setting = await Setting.findByIdAndDelete(settingId);

    if (!setting) {
      throw new AppError('Configuración no encontrada', 404);
    }

    return { message: 'Configuración eliminada exitosamente' };
  }
}

module.exports = new SettingService();