// ====================================
// Lógica de negocio para testimonios/reseñas
// ====================================

const Testimonial = require('../models/testimonialModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

class TestimonialService {
  // Obtener todos los testimonios
  async getAllTestimonials() {
    const testimonials = await Testimonial.find()
      .populate('user', 'name email')
      .populate('product', 'name author')
      .sort({ createdAt: -1 });
    
    return testimonials;
  }

  // Obtener testimonio por ID
  async getTestimonialById(testimonialId) {
    const testimonial = await Testimonial.findById(testimonialId)
      .populate('user', 'name email')
      .populate('product', 'name author');
    
    if (!testimonial) {
      throw new AppError('Testimonio no encontrado', 404);
    }
    
    return testimonial;
  }

  // Obtener testimonios por producto
  async getTestimonialsByProduct(productId) {
    // Verificar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    const testimonials = await Testimonial.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    return testimonials;
  }

  // Obtener testimonios por usuario
  async getTestimonialsByUser(userId) {
    const testimonials = await Testimonial.find({ user: userId })
      .populate('product', 'name author')
      .sort({ createdAt: -1 });
    
    return testimonials;
  }

  // Crear nuevo testimonio
  async createTestimonial(testimonialData, userId) {
    // Verificar que el producto existe
    const product = await Product.findById(testimonialData.product);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    // Verificar que el usuario no haya dejado ya una reseña para este producto
    const existingTestimonial = await Testimonial.findOne({
      user: userId,
      product: testimonialData.product
    });

    if (existingTestimonial) {
      throw new AppError('Ya has dejado una reseña para este producto', 400);
    }

    // Agregar userId al testimonial
    testimonialData.user = userId;

    const testimonial = await Testimonial.create(testimonialData);
    
    // Retornar con populate
    return await Testimonial.findById(testimonial._id)
      .populate('user', 'name email')
      .populate('product', 'name author');
  }

  // Actualizar testimonio
  async updateTestimonial(testimonialId, updateData, userId) {
    const testimonial = await Testimonial.findById(testimonialId);

    if (!testimonial) {
      throw new AppError('Testimonio no encontrado', 404);
    }

    // Verificar que el usuario sea el propietario del testimonio
    if (testimonial.user.toString() !== userId.toString()) {
      throw new AppError('No tienes permiso para actualizar este testimonio', 403);
    }

    // Actualizar solo rating y comment
    testimonial.rating = updateData.rating || testimonial.rating;
    testimonial.comment = updateData.comment || testimonial.comment;

    await testimonial.save();

    return await Testimonial.findById(testimonialId)
      .populate('user', 'name email')
      .populate('product', 'name author');
  }

  // Eliminar testimonio
  async deleteTestimonial(testimonialId, userId, userRole) {
    const testimonial = await Testimonial.findById(testimonialId);

    if (!testimonial) {
      throw new AppError('Testimonio no encontrado', 404);
    }

    // Verificar permisos: propietario o admin
    if (testimonial.user.toString() !== userId.toString() && userRole !== 'admin') {
      throw new AppError('No tienes permiso para eliminar este testimonio', 403);
    }

    await Testimonial.findByIdAndDelete(testimonialId);

    return { message: 'Testimonio eliminado exitosamente' };
  }
}

module.exports = new TestimonialService();