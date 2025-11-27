# 📚 Sistema de Gestión de Librería Digital

## 📋 Descripción del Proyecto

**Librería Digital** es un sistema completo de gestión de biblioteca desarrollado con Node.js, Express y MongoDB. Implementa un API RESTful con autenticación JWT, sistema de roles (Usuario, Bibliotecario, Administrador), gestión de libros, categorías, préstamos y reseñas. Incluye un frontend interactivo con diseño tipo Netflix.

---

## 🗄️ Esquema de la Base de Datos

### Colección: `users`
```javascript
{
  _id: ObjectId,
  name: String,              // Requerido, 3-50 caracteres
  email: String,             // Único, requerido, validado
  password: String,          // Hasheado con bcrypt, requerido
  role: String,              // 'user' | 'librarian' | 'admin'
  profileImage: String,      // URL de la imagen
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: `categories`
```javascript
{
  _id: ObjectId,
  name: String,              // Único, requerido
  description: String,
  coverImage: String,        // URL de imagen de portada
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: `products` (Libros)
```javascript
{
  _id: ObjectId,
  name: String,              // Título, requerido
  description: String,       // Sinopsis
  price: Number,             // Requerido, mínimo 0
  stock: Number,             // Requerido, mínimo 0
  author: String,
  isbn: String,              // Único
  category: ObjectId,        // Referencia a categories, requerido
  coverImage: String,        // URL de portada
  content: String,           // Contenido del libro
  pages: Number,
  year: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: `loans` (Préstamos)
```javascript
{
  _id: ObjectId,
  user: ObjectId,            // Referencia a users, requerido
  product: ObjectId,         // Referencia a products, requerido
  loanDate: Date,            // Fecha de préstamo
  returnDate: Date,          // Fecha de devolución, requerido
  returned: Boolean,         // Estado de devolución
  status: String,            // 'active' | 'returned' | 'overdue'
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: `testimonials` (Reseñas)
```javascript
{
  _id: ObjectId,
  user: ObjectId,            // Referencia a users, requerido
  product: ObjectId,         // Referencia a products, requerido
  rating: Number,            // 1-5, requerido
  comment: String,           // Requerido, máx 1000 caracteres
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: `settings` (Configuraciones)
```javascript
{
  _id: ObjectId,
  key: String,               // Clave única
  value: Mixed,              // Cualquier tipo
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: `tokens` (Tokens JWT)
```javascript
{
  _id: ObjectId,
  user: ObjectId,            // Referencia a users
  token: String,             // JWT token único
  expiresAt: Date,           // Fecha de expiración
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** v18+ - Entorno de ejecución JavaScript
- **Express.js** v4.18+ - Framework web
- **MongoDB** v6+ - Base de datos NoSQL
- **Mongoose** v7+ - ODM para MongoDB

### Autenticación y Seguridad
- **jsonwebtoken** v9+ - Autenticación JWT
- **bcrypt** v5.1+ - Encriptación de contraseñas
- **helmet** v7+ - Seguridad HTTP headers
- **cors** v2.8+ - Control de acceso CORS
- **express-rate-limit** v6+ - Limitación de peticiones

### Gestión de Archivos
- **multer** v1.4+ - Subida de archivos multipart/form-data

### Utilidades
- **dotenv** v16+ - Variables de entorno
- **morgan** v1.10+ - Logging HTTP
- **validator** v13+ - Validación de datos

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos y animaciones
- **JavaScript ES6+** - Lógica del cliente

---

## 🚀 Instrucciones de Instalación y Ejecución

### Prerrequisitos
```bash
Node.js v18 o superior
npm v8 o superior
MongoDB v6 o superior
```

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/libreria-crud.git
cd libreria-crud
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto con:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/libreria
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRE=7d
CORS_ORIGIN=*
```

### Paso 4: Crear carpeta de uploads
```bash
mkdir uploads
```

### Paso 5: Iniciar MongoDB
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Paso 6: Iniciar el servidor
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará corriendo en: **http://localhost:5000**

### Paso 7: Abrir el frontend
Abrir `frontend/index.html` en el navegador o usar Live Server en VS Code.

---

## 📡 Listado Completo de Endpoints

### Base URL
```
http://localhost:5000/api
```

### Autenticación
Rutas protegidas requieren header:
```
Authorization: Bearer <token_jwt>
```

---

### 🔐 Autenticación (`/api/auth`)

#### **POST** `/api/auth/register` - Registrar nuevo usuario
- **Acceso:** Público
- **Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "Password123!",
  "role": "user"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "64f3a1b2c3d4e5f6a7b8c9d0",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "role": "user",
    "profileImage": "https://..."
  }
}
```

---

#### **POST** `/api/auth/login` - Iniciar sesión
- **Acceso:** Público
- **Body:**
```json
{
  "email": "juan@ejemplo.com",
  "password": "Password123!"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "64f3a1b2c3d4e5f6a7b8c9d0",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "role": "user"
  }
}
```

---

#### **POST** `/api/auth/logout` - Cerrar sesión
- **Acceso:** Privado (requiere token)
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

---

#### **GET** `/api/auth/me` - Obtener usuario actual
- **Acceso:** Privado (requiere token)
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f3a1b2c3d4e5f6a7b8c9d0",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "role": "user"
  }
}
```

---

### 👥 Usuarios (`/api/users`)

#### **GET** `/api/users` - Listar todos los usuarios
- **Acceso:** Privado (solo Admin)
- **Headers:** `Authorization: Bearer <token>`

#### **GET** `/api/users/:id` - Obtener usuario por ID
- **Acceso:** Privado

#### **PUT** `/api/users/:id` - Actualizar usuario
- **Acceso:** Privado
- **Body (FormData):**
```javascript
name: "Nuevo Nombre"
email: "nuevo@email.com"
profileImage: [archivo de imagen]
```

#### **DELETE** `/api/users/:id` - Eliminar usuario
- **Acceso:** Privado (solo Admin)

---

### 📁 Categorías (`/api/categories`)

#### **GET** `/api/categories` - Listar todas las categorías
- **Acceso:** Público

#### **GET** `/api/categories/:id` - Obtener categoría por ID
- **Acceso:** Público

#### **POST** `/api/categories` - Crear nueva categoría
- **Acceso:** Privado (Librarian o Admin)
- **Body (FormData):**
```javascript
name: "Ficción"
description: "Libros de ficción literaria"
coverImage: [archivo de imagen]
```
- **Response:**
```json
{
  "success": true,
  "message": "Categoría creada exitosamente",
  "data": {
    "_id": "64f3a1b2c3d4e5f6a7b8c9d1",
    "name": "Ficción",
    "description": "Libros de ficción literaria",
    "coverImage": "http://localhost:5000/uploads/...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### **PUT** `/api/categories/:id` - Actualizar categoría
- **Acceso:** Privado (Librarian o Admin)
- **Body (FormData):**
```javascript
name: "Ficción Actualizada"
description: "Nueva descripción"
coverImage: [archivo de imagen opcional]
```

#### **DELETE** `/api/categories/:id` - Eliminar categoría
- **Acceso:** Privado (Librarian o Admin)

---

### 📚 Productos/Libros (`/api/products`)

#### **GET** `/api/products` - Listar todos los libros
- **Acceso:** Público
- **Query params opcionales:**
  - `category`: ID de categoría
  - `minPrice`: Precio mínimo
  - `maxPrice`: Precio máximo
  - `inStock`: true/false

#### **GET** `/api/products/:id` - Obtener libro por ID
- **Acceso:** Público

#### **GET** `/api/products/category/:categoryId` - Libros por categoría
- **Acceso:** Público

#### **POST** `/api/products` - Crear nuevo libro
- **Acceso:** Privado (Librarian o Admin)
- **Body (FormData):**
```javascript
name: "Cien Años de Soledad"
author: "Gabriel García Márquez"
isbn: "978-0307474728"
category: "64f3a1b2c3d4e5f6a7b8c9d1"
price: 25.99
stock: 15
year: 1967
pages: 417
description: "Obra maestra del realismo mágico..."
content: "Contenido completo del libro para lectura..."
coverImage: [archivo de imagen]
```
- **Response:**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "_id": "64f3a1b2c3d4e5f6a7b8c9d2",
    "name": "Cien Años de Soledad",
    "author": "Gabriel García Márquez",
    "price": 25.99,
    "stock": 15,
    "isbn": "978-0307474728",
    "category": {
      "_id": "64f3a1b2c3d4e5f6a7b8c9d1",
      "name": "Ficción"
    },
    "coverImage": "http://localhost:5000/uploads/...",
    "year": 1967,
    "pages": 417
  }
}
```

#### **PUT** `/api/products/:id` - Actualizar libro
- **Acceso:** Privado (Librarian o Admin)

#### **DELETE** `/api/products/:id` - Eliminar libro
- **Acceso:** Privado (Librarian o Admin)

---

### 📅 Préstamos (`/api/loans`)

#### **GET** `/api/loans` - Listar préstamos
- **Acceso:** Privado
- **Usuarios normales:** Solo ven sus préstamos
- **Librarian/Admin:** Ven todos los préstamos
- **Query params:**
  - `status`: active, returned, overdue
  - `userId`: ID del usuario

#### **GET** `/api/loans/:id` - Obtener préstamo por ID
- **Acceso:** Privado

#### **GET** `/api/loans/my-loans` - Obtener préstamos del usuario actual
- **Acceso:** Privado

#### **POST** `/api/loans` - Crear nuevo préstamo
- **Acceso:** Privado
- **Body:**
```json
{
  "product": "64f3a1b2c3d4e5f6a7b8c9d2",
  "returnDate": "2024-12-31T00:00:00.000Z"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Préstamo creado exitosamente",
  "data": {
    "_id": "64f3a1b2c3d4e5f6a7b8c9d3",
    "user": {
      "_id": "64f3a1b2c3d4e5f6a7b8c9d0",
      "name": "Juan Pérez"
    },
    "product": {
      "_id": "64f3a1b2c3d4e5f6a7b8c9d2",
      "name": "Cien Años de Soledad"
    },
    "loanDate": "2024-01-01T00:00:00.000Z",
    "returnDate": "2024-12-31T00:00:00.000Z",
    "returned": false,
    "status": "active"
  }
}
```

#### **PUT** `/api/loans/:id` - Actualizar préstamo
- **Acceso:** Privado

#### **POST** `/api/loans/:id/return` - Marcar libro como devuelto
- **Acceso:** Privado

#### **DELETE** `/api/loans/:id` - Eliminar préstamo
- **Acceso:** Privado (Librarian o Admin)

#### **GET** `/api/loans/overdue` - Obtener préstamos vencidos
- **Acceso:** Privado (Librarian o Admin)

---

### ⭐ Reseñas (`/api/testimonials`)

#### **GET** `/api/testimonials` - Listar todas las reseñas
- **Acceso:** Público

#### **GET** `/api/testimonials/:id` - Obtener reseña por ID
- **Acceso:** Público

#### **GET** `/api/testimonials/product/:productId` - Reseñas por libro
- **Acceso:** Público

#### **POST** `/api/testimonials` - Crear nueva reseña
- **Acceso:** Privado
- **Body:**
```json
{
  "product": "64f3a1b2c3d4e5f6a7b8c9d2",
  "rating": 5,
  "comment": "Excelente libro, altamente recomendado."
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Testimonio creado exitosamente",
  "data": {
    "_id": "64f3a1b2c3d4e5f6a7b8c9d4",
    "user": {
      "_id": "64f3a1b2c3d4e5f6a7b8c9d0",
      "name": "Juan Pérez"
    },
    "product": {
      "_id": "64f3a1b2c3d4e5f6a7b8c9d2",
      "name": "Cien Años de Soledad"
    },
    "rating": 5,
    "comment": "Excelente libro, altamente recomendado.",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### **PUT** `/api/testimonials/:id` - Actualizar reseña
- **Acceso:** Privado (solo propia)

#### **DELETE** `/api/testimonials/:id` - Eliminar reseña
- **Acceso:** Privado (propia o Admin)

---

### ⚙️ Configuraciones (`/api/settings`)

#### **GET** `/api/settings` - Listar configuraciones
- **Acceso:** Privado (solo Admin)

#### **GET** `/api/settings/key/:key` - Obtener configuración por clave
- **Acceso:** Privado (solo Admin)

#### **GET** `/api/settings/:id` - Obtener configuración por ID
- **Acceso:** Privado (solo Admin)

#### **POST** `/api/settings` - Crear configuración
- **Acceso:** Privado (solo Admin)
- **Body:**
```json
{
  "key": "max_loan_days",
  "value": 30,
  "description": "Máximo de días permitidos para un préstamo"
}
```

#### **PUT** `/api/settings/:id` - Actualizar configuración
- **Acceso:** Privado (solo Admin)

#### **DELETE** `/api/settings/:id` - Eliminar configuración
- **Acceso:** Privado (solo Admin)

---

### 🔑 Tokens (`/api/tokens`)

#### **DELETE** `/api/tokens/cleanup` - Limpiar tokens expirados
- **Acceso:** Privado (solo Admin)

#### **DELETE** `/api/tokens/user/:userId` - Eliminar tokens de un usuario
- **Acceso:** Privado (solo Admin)

---

## 📝 Ejemplos de Datos Mock (JSON)

### Usuarios de Prueba
```json
// Usuario Normal
{
  "name": "Ana Usuario",
  "email": "ana@libreria.com",
  "password": "User123!",
  "role": "user"
}

// Bibliotecario
{
  "name": "Carlos Bibliotecario",
  "email": "carlos@libreria.com",
  "password": "Biblio123!",
  "role": "librarian"
}

// Administrador
{
  "name": "Admin Principal",
  "email": "admin@libreria.com",
  "password": "Admin123!",
  "role": "admin"
}
```

### Categorías
```json
{
  "name": "Ficción",
  "description": "Libros de ficción literaria, novelas y cuentos"
}

{
  "name": "No Ficción",
  "description": "Libros basados en hechos reales, biografías, historia"
}

{
  "name": "Ciencia y Tecnología",
  "description": "Libros sobre ciencia, tecnología y programación"
}
```

### Libros (Productos)
```json
{
  "name": "Cien Años de Soledad",
  "description": "Obra maestra de Gabriel García Márquez",
  "price": 25.99,
  "stock": 15,
  "author": "Gabriel García Márquez",
  "isbn": "978-0307474728",
  "category": "ID_DE_CATEGORIA_FICCION",
  "year": 1967,
  "pages": 417,
  "content": "Muchos años después, frente al pelotón de fusilamiento..."
}

{
  "name": "1984",
  "description": "Novela distópica de George Orwell",
  "price": 18.50,
  "stock": 20,
  "author": "George Orwell",
  "isbn": "978-0451524935",
  "category": "ID_DE_CATEGORIA_FICCION",
  "year": 1949,
  "pages": 328
}

{
  "name": "Clean Code",
  "description": "Manual de estilo para el desarrollo ágil de software",
  "price": 45.00,
  "stock": 8,
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "category": "ID_DE_CATEGORIA_CIENCIA",
  "year": 2008,
  "pages": 464
}
```

### Préstamos
```json
{
  "product": "ID_DEL_LIBRO",
  "returnDate": "2024-12-31T00:00:00.000Z"
}
```

### Reseñas
```json
{
  "product": "ID_DEL_LIBRO",
  "rating": 5,
  "comment": "Excelente libro, una obra maestra de la literatura. Altamente recomendado para todos los amantes de la lectura."
}

{
  "product": "ID_DEL_LIBRO",
  "rating": 4,
  "comment": "Muy buen libro, aunque algunas partes son un poco densas. Vale la pena leerlo."
}
```

### Configuraciones
```json
{
  "key": "max_loan_days",
  "value": 30,
  "description": "Máximo de días permitidos para un préstamo"
}

{
  "key": "max_loans_per_user",
  "value": 5,
  "description": "Máximo de préstamos simultáneos por usuario"
}
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu@email.com

---

**Repositorio:** [https://github.com/tu-usuario/libreria-crud](https://github.com/tu-usuario/libreria-crud)