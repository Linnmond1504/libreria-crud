// ====================================
// Lógica de negocio para préstamos
// ====================================

const Loan = require('../models/loanModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const productService = require('./productService');
const AppError = require('../utils/appError');

class LoanService {
  // Obtener todos los préstamos
  async getAllLoans(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.userId) {
      query.user = filters.userId;
    }

    const loans = await Loan.find(query)
      .populate('user', 'name email')
      .populate('product', 'name author stock')
      .sort({ createdAt: -1 });
    
    return loans;
  }

  // Obtener préstamo por ID
  async getLoanById(loanId) {
    const loan = await Loan.findById(loanId)
      .populate('user', 'name email')
      .populate('product', 'name author stock');
    
    if (!loan) {
      throw new AppError('Préstamo no encontrado', 404);
    }
    
    return loan;
  }

  // Obtener préstamos por usuario
  async getLoansByUser(userId) {
    const loans = await Loan.find({ user: userId })
      .populate('product', 'name author')
      .sort({ createdAt: -1 });
    
    return loans;
  }

  // Crear nuevo préstamo
  async createLoan(loanData, userId) {
    // Verificar que el producto existe y tiene stock
    const product = await Product.findById(loanData.product);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    if (product.stock < 1) {
      throw new AppError('No hay stock disponible para este producto', 400);
    }

    // Verificar que el usuario no tenga préstamos activos del mismo libro
    const activeLoan = await Loan.findOne({
      user: userId,
      product: loanData.product,
      returned: false
    });

    if (activeLoan) {
      throw new AppError('Ya tienes un préstamo activo de este libro', 400);
    }

    // Validar fecha de devolución
    const returnDate = new Date(loanData.returnDate);
    const today = new Date();
    
    if (returnDate <= today) {
      throw new AppError('La fecha de devolución debe ser futura', 400);
    }

    // Crear préstamo
    loanData.user = userId;
    const loan = await Loan.create(loanData);

    // Reducir stock
    await productService.reduceStock(loanData.product, 1);

    // Retornar con populate
    return await Loan.findById(loan._id)
      .populate('user', 'name email')
      .populate('product', 'name author stock');
  }

  // Actualizar préstamo
  async updateLoan(loanId, updateData) {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      throw new AppError('Préstamo no encontrado', 404);
    }

    if (loan.returned) {
      throw new AppError('No se puede actualizar un préstamo ya devuelto', 400);
    }

    // Actualizar solo fecha de devolución
    if (updateData.returnDate) {
      const returnDate = new Date(updateData.returnDate);
      const today = new Date();
      
      if (returnDate <= today) {
        throw new AppError('La fecha de devolución debe ser futura', 400);
      }
      
      loan.returnDate = returnDate;
    }

    await loan.save();

    return await Loan.findById(loanId)
      .populate('user', 'name email')
      .populate('product', 'name author stock');
  }

  // Marcar préstamo como devuelto
  async returnLoan(loanId) {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      throw new AppError('Préstamo no encontrado', 404);
    }

    if (loan.returned) {
      throw new AppError('Este préstamo ya fue devuelto', 400);
    }

    loan.returned = true;
    loan.status = 'returned';
    await loan.save();

    // Aumentar stock
    await productService.increaseStock(loan.product, 1);

    return await Loan.findById(loanId)
      .populate('user', 'name email')
      .populate('product', 'name author stock');
  }

  // Eliminar préstamo
  async deleteLoan(loanId) {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      throw new AppError('Préstamo no encontrado', 404);
    }

    // Si el préstamo no fue devuelto, restaurar stock
    if (!loan.returned) {
      await productService.increaseStock(loan.product, 1);
    }

    await Loan.findByIdAndDelete(loanId);

    return { message: 'Préstamo eliminado exitosamente' };
  }

  // Obtener préstamos vencidos
  async getOverdueLoans() {
    const today = new Date();
    
    const loans = await Loan.find({
      returned: false,
      returnDate: { $lt: today }
    })
      .populate('user', 'name email')
      .populate('product', 'name author');

    return loans;
  }
}

module.exports = new LoanService();