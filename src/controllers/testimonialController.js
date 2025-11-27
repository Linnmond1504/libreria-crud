// ====================================
// Controlador de testimonios/reseñas
// ====================================

const testimonialService = require('../services/testimonialService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Obtener todos los testimonios
// @route   GET /api/testimonials
// @access  Public
exports.getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.getAllTestimonials();

  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials
  });
});

// @desc    Obtener testimonio por ID
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.getTestimonialById(req.params.id);

  res.status(200).json({
    success: true,
    data: testimonial
  });
});

// @desc    Obtener testimonios por producto
// @route   GET /api/testimonials/product/:productId
// @access  Public
exports.getTestimonialsByProduct = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.getTestimonialsByProduct(req.params.productId);

  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials
  });
});

// @desc    Crear nuevo testimonio
// @route   POST /api/testimonials
// @access  Private
exports.createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.createTestimonial(req.body, req.user.id);

  res.status(201).json({
    success: true,
    message: 'Testimonio creado exitosamente',
    data: testimonial
  });
});

// @desc    Actualizar testimonio
// @route   PUT /api/testimonials/:id
// @access  Private
exports.updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.updateTestimonial(
    req.params.id,
    req.body,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: 'Testimonio actualizado exitosamente',
    data: testimonial
  });
});

// @desc    Eliminar testimonio
// @route   DELETE /api/testimonials/:id
// @access  Private
exports.deleteTestimonial = asyncHandler(async (req, res) => {
  const result = await testimonialService.deleteTestimonial(
    req.params.id,
    req.user.id,
    req.user.role
  );

  res.status(200).json({
    success: true,
    message: result.message
  });
});