


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Importar configuración de base de datos
const connectDB = require('./src/config/db');

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const productRoutes = require('./src/routes/productRoutes');
const testimonialRoutes = require('./src/routes/testimonialRoutes');
const loanRoutes = require('./src/routes/loanRoutes');
const settingRoutes = require('./src/routes/settingRoutes');
const tokenRoutes = require('./src/routes/tokenRoutes');

// Importar middleware de manejo de errores
const errorHandler = require('./src/middleware/errorHandler');

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// ==================== MIDDLEWARES ====================

// Seguridad HTTP headers
app.use(helmet());

// CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}



//limitar peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.'
});
app.use('/api/', limiter);

// ==================== RUTAS ====================

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '📚 API de Gestión de Librería',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products',
      testimonials: '/api/testimonials',
      loans: '/api/loans',
      settings: '/api/settings',
      tokens: '/api/tokens'
    }
  });
});

// Montar rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/tokens', tokenRoutes);

// Ruta 404 - No encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});



// Endpoint de debug para verificar uploads
app.get('/debug-uploads', (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, 'uploads');
  
  // Verificar si existe el directorio
  if (!fs.existsSync(uploadsPath)) {
    return res.json({
      error: 'La carpeta uploads NO existe',
      path: uploadsPath
    });
  }
  
  // Listar archivos
  fs.readdir(uploadsPath, (err, files) => {
    if (err) {
      return res.json({
        error: 'Error al leer carpeta',
        message: err.message,
        path: uploadsPath
      });
    }
    
    res.json({
      message: 'Carpeta uploads encontrada',
      path: uploadsPath,
      files: files,
      count: files.length,
      exists: fs.existsSync(uploadsPath)
    });
  });
});



// Servir archivos estáticos CON LOGGING
const uploadsPath = path.join(__dirname, 'uploads');
console.log('📁 Carpeta uploads en:', uploadsPath);

app.use('/uploads', express.static(uploadsPath));

// Middleware para loggear peticiones a /uploads
app.use('/uploads', (req, res, next) => {
  console.log('🔍 Buscando archivo:', req.url);
  console.log('📂 En la ruta:', uploadsPath);
  next();
});



// Middleware de manejo de errores
app.use(errorHandler);

// ==================== INICIAR SERVIDOR ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en modo ${process.env.NODE_ENV} en puerto ${PORT}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.log('❌ Error no manejado:', err.message);
  process.exit(1);
});