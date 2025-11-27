// ====================================
// Lógica de negocio para productos (libros)
// ====================================

const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const AppError = require('../utils/appError');

class ProductService {
  // Obtener todos los productos con populate de categoría
  async getAllProducts(filters = {}) {
    const query = {};

    // Filtros opcionales
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.minPrice) {
      query.price = { ...query.price, $gte: parseFloat(filters.minPrice) };
    }
    if (filters.maxPrice) {
      query.price = { ...query.price, $lte: parseFloat(filters.maxPrice) };
    }
    if (filters.inStock) {
      query.stock = { $gt: 0 };
    }

    const products = await Product.find(query)
      .populate('category', 'name description')
      .sort({ createdAt: -1 });
    
    return products;
  }

  // Obtener producto por ID con populate
  async getProductById(productId) {
    const product = await Product.findById(productId)
      .populate('category', 'name description');
    
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }
    
    return product;
  }

  // Obtener productos por categoría
  async getProductsByCategory(categoryId) {
    // Verificar que la categoría existe
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new AppError('Categoría no encontrada', 404);
    }

    const products = await Product.find({ category: categoryId })
      .populate('category', 'name description');
    
    return products;
  }

  // Crear nuevo producto
  async createProduct(productData) {
    // Verificar que la categoría existe
    const category = await Category.findById(productData.category);
    if (!category) {
      throw new AppError('La categoría especificada no existe', 404);
    }

    // Verificar ISBN único si se proporciona
    if (productData.isbn) {
      const existingProduct = await Product.findOne({ isbn: productData.isbn });
      if (existingProduct) {
        throw new AppError('Ya existe un producto con ese ISBN', 400);
      }
    }

    const product = await Product.create(productData);
    
    // Retornar con populate
    return await Product.findById(product._id)
      .populate('category', 'name description');
  }

  // Actualizar producto
  async updateProduct(productId, updateData) {
    // Verificar categoría si se está actualizando
    if (updateData.category) {
      const category = await Category.findById(updateData.category);
      if (!category) {
        throw new AppError('La categoría especificada no existe', 404);
      }
    }

    // Verificar ISBN único si se está actualizando
    if (updateData.isbn) {
      const existingProduct = await Product.findOne({
        isbn: updateData.isbn,
        _id: { $ne: productId }
      });
      if (existingProduct) {
        throw new AppError('Ya existe un producto con ese ISBN', 400);
      }
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name description');

    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    return product;
  }

  // Eliminar producto
  async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    return { message: 'Producto eliminado exitosamente' };
  }

  // Actualizar stock
  async updateStock(productId, quantity) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    product.stock = quantity;
    await product.save();

    return product;
  }

  // Reducir stock (para préstamos)
  async reduceStock(productId, quantity = 1) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    if (product.stock < quantity) {
      throw new AppError('Stock insuficiente', 400);
    }

    product.stock -= quantity;
    await product.save();

    return product;
  }

  // Aumentar stock (cuando se devuelve un préstamo)
  async increaseStock(productId, quantity = 1) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    product.stock += quantity;
    await product.save();

    return product;
  }
}

module.exports = new ProductService();