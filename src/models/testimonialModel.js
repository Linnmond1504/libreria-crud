// ====================================
// Modelo de Reseña/Testimonio
// ====================================

const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio']
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El producto es obligatorio']
    },
    rating: {
      type: Number,
      required: [true, 'La calificación es obligatoria'],
      min: [1, 'La calificación mínima es 1'],
      max: [5, 'La calificación máxima es 5']
    },
    comment: {
      type: String,
      required: [true, 'El comentario es obligatorio'],
      trim: true,
      maxlength: [1000, 'El comentario no puede exceder 1000 caracteres']
    }
  },
  {
    timestamps: true
  }
);

// Un usuario solo puede dejar una reseña por producto
testimonialSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);