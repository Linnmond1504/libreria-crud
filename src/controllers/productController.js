// ====================================
// Controlador de productos (libros)
// ====================================

const productService = require('../services/productService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res) => {
  // Filtros opcionales desde query params
  const filters = {
    category: req.query.category,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    inStock: req.query.inStock === 'true'
  };

  const products = await productService.getAllProducts(filters);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Obtener producto por ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Obtener productos por categoría
// @route   GET /api/products/category/:categoryId
// @access  Public
exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await productService.getProductsByCategory(req.params.categoryId);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Crear nuevo producto
// @route   POST /api/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res) => {
  // Si se subió una imagen, agregar la ruta
  if (req.file) {
    req.body.coverImage = `http://localhost:5000/uploads/${req.file.filename}`;
  }
  
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    message: 'Producto creado exitosamente',
    data: product
  });
});

// @desc    Actualizar producto
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res) => {
  // Si se subió una nueva imagen, agregar la ruta
  if (req.file) {
    req.body.coverImage = `http://localhost:5000/uploads/${req.file.filename}`;
  }
  
  const product = await productService.updateProduct(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Producto actualizado exitosamente',
    data: product
  });
});

// @desc    Eliminar producto
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message
  });
});