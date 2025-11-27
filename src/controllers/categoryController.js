// ====================================
// Controlador de categorías
// ====================================

const categoryService = require('../services/categoryService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Obtener todas las categorías
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Obtener categoría por ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Crear nueva categoría
// @route   POST /api/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {

  if (req.file) {
    req.body.coverImage = `http://localhost:5000/uploads/${req.file.filename}`;
  }
  
  const category = await categoryService.createCategory(req.body);

  res.status(201).json({
    success: true,
    message: 'Categoría creada exitosamente',
    data: category
  });
});

// @desc    Actualizar categoría
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res) => {
  // Si se subió una nueva imagen
  if (req.file) {
    req.body.coverImage = `http://localhost:5000/uploads/${req.file.filename}`;
  }
  
  const category = await categoryService.updateCategory(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Categoría actualizada exitosamente',
    data: category
  });
});

// @desc    Eliminar categoría
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message
  });
});