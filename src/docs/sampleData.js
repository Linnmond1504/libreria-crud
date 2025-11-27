// src/docs/sampleData.js
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

const sampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB...');

    // Limpiar datos existentes
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Base de datos limpiada...');

    // Crear usuarios de prueba
    const users = await User.create([
      {
        name: 'Ana Usuario',
        email: 'ana@libreria.com',
        password: 'User123!',
        role: 'user'
      },
      {
        name: 'Carlos Bibliotecario',
        email: 'carlos@libreria.com',
        password: 'Biblio123!',
        role: 'librarian'
      },
      {
        name: 'Admin Principal',
        email: 'admin@libreria.com',
        password: 'Admin123!',
        role: 'admin'
      }
    ]);
    console.log('Usuarios creados:', users.length);

    // Crear categorías
    const categories = await Category.create([
      {
        name: 'Ficción',
        description: 'Libros de ficción literaria, novelas y cuentos'
      },
      {
        name: 'No Ficción',
        description: 'Libros basados en hechos reales, biografías, historia'
      },
      {
        name: 'Ciencia y Tecnología',
        description: 'Libros sobre ciencia, tecnología y programación'
      }
    ]);
    console.log('Categorías creadas:', categories.length);

    // Crear libros
    const products = await Product.create([
      {
        name: 'Cien Años de Soledad',
        description: 'Obra maestra del realismo mágico de Gabriel García Márquez',
        price: 25.99,
        stock: 15,
        author: 'Gabriel García Márquez',
        isbn: '978-0307474728',
        category: categories[0]._id,
        year: 1967,
        pages: 417,
        content: 'Muchos años después, frente al pelotón de fusilamiento...'
      },
      {
        name: '1984',
        description: 'Novela distópica de George Orwell sobre un régimen totalitario',
        price: 18.50,
        stock: 20,
        author: 'George Orwell',
        isbn: '978-0451524935',
        category: categories[0]._id,
        year: 1949,
        pages: 328,
        content: 'Era un día luminoso y frío de abril...'
      },
      {
        name: 'Clean Code',
        description: 'Manual de estilo para el desarrollo ágil de software',
        price: 45.00,
        stock: 8,
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        category: categories[2]._id,
        year: 2008,
        pages: 464,
        content: 'Guía completa para escribir código limpio y mantenible...'
      },
      {
        name: 'El Principito',
        description: 'Clásico de la literatura infantil con profundas reflexiones',
        price: 12.99,
        stock: 30,
        author: 'Antoine de Saint-Exupéry',
        isbn: '978-0156012195',
        category: categories[0]._id,
        year: 1943,
        pages: 96,
        content: 'Cuando yo tenía seis años vi una magnífica lámina...'
      },
      {
        name: 'Sapiens',
        description: 'De animales a dioses: Breve historia de la humanidad',
        price: 32.00,
        stock: 12,
        author: 'Yuval Noah Harari',
        isbn: '978-0062316097',
        category: categories[1]._id,
        year: 2011,
        pages: 443,
        content: 'Hace unos 13.500 millones de años...'
      }
    ]);
    console.log('Libros creados:', products.length);

    console.log('\n✅ Datos de ejemplo cargados exitosamente!');
    console.log('\n📧 Credenciales de prueba:');
    console.log('Usuario: ana@libreria.com / User123!');
    console.log('Bibliotecario: carlos@libreria.com / Biblio123!');
    console.log('Admin: admin@libreria.com / Admin123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
    process.exit(1);
  }
};

sampleData();