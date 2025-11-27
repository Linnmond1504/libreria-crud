// ====================================
// Modelo de Categoría
// ====================================

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
      unique: true,
      trim: true,
      maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    coverImage: {
      type: String,
      default: 'https://via.placeholder.com/400x200/37468D/FFFFFF?text=Categoria'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Category', categorySchema);