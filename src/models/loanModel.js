// ====================================
// Modelo de Préstamo
// ====================================

const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
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
    loanDate: {
      type: Date,
      default: Date.now
    },
    returnDate: {
      type: Date,
      required: [true, 'La fecha de devolución es obligatoria']
    },
    returned: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'returned', 'overdue'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Actualizar estado automáticamente
loanSchema.pre('save', function (next) {
  if (this.returned) {
    this.status = 'returned';
  } else if (new Date() > this.returnDate) {
    this.status = 'overdue';
  } else {
    this.status = 'active';
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);