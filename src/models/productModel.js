// ====================================
// Modelo de Producto (Libro) con imagen y contenido
// ====================================

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El título del libro es obligatorio'],
      trim: true,
      maxlength: [200, 'El título no puede exceder 200 caracteres']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    },
    author: {
      type: String,
      trim: true,
      maxlength: [100, 'El nombre del autor no puede exceder 100 caracteres']
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoría es obligatoria']
    },
    coverImage: {
      type: String,
      default: 'https://via.placeholder.com/300x400?text=Sin+Portada'
    },
    content: {
      type: String,
      default: 'Contenido no disponible'
    },
    pages: {
      type: Number,
      default: 0
    },
    year: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 'text', author: 'text' });

module.exports = mongoose.model('Product', productSchema);