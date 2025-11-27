// ====================================
// Lógica de negocio para categorías
// ====================================

const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');

class CategoryService {
  // Obtener todas las categorías
  async getAllCategories() {
    const categories = await Category.find().sort({ name: 1 });
    return categories;
  }

  // Obtener categoría por ID
  async getCategoryById(categoryId) {
    const category = await Category.findById(categoryId);
    
    if (!category) {
      throw new AppError('Categoría no encontrada', 404);
    }
    
    return category;
  }

  // Crear nueva categoría
  async createCategory(categoryData) {
    // Verificar si ya existe una categoría con ese nombre
    const existingCategory = await Category.findOne({ 
      name: categoryData.name 
    });
    
    if (existingCategory) {
      throw new AppError('Ya existe una categoría con ese nombre', 400);
    }

    const category = await Category.create(categoryData);
    return category;
  }

  // Actualizar categoría
  async updateCategory(categoryId, updateData) {
    // Verificar si el nuevo nombre ya existe
    if (updateData.name) {
      const existingCategory = await Category.findOne({
        name: updateData.name,
        _id: { $ne: categoryId }
      });
      
      if (existingCategory) {
        throw new AppError('Ya existe una categoría con ese nombre', 400);
      }
    }

    const category = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new AppError('Categoría no encontrada', 404);
    }

    return category;
  }

  // Eliminar categoría
  async deleteCategory(categoryId) {
    // Verificar si existen productos con esta categoría
    const productsCount = await Product.countDocuments({ category: categoryId });
    
    if (productsCount > 0) {
      throw new AppError(
        `No se puede eliminar la categoría porque tiene ${productsCount} producto(s) asociado(s)`,
        400
      );
    }

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      throw new AppError('Categoría no encontrada', 404);
    }

    return { message: 'Categoría eliminada exitosamente' };
  }
}

module.exports = new CategoryService();