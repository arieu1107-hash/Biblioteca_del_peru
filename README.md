# 📚 Biblioteca Digital — Sistema de Gestión

Proyecto de segundo ciclo de Ingeniería de Sistemas.
Backend con Node.js + Express + SQL Server. Frontend en HTML/CSS/JS puro.

---

## 🗂️ Estructura del Proyecto

```
biblioteca-digital/
├── server.js                  ← Servidor principal
├── database.js                ← Conexión a SQL Server
├── package.json               ← Dependencias
├── respaldo_biblioteca_final.sql  ← Script de base de datos
├── middleware/
│   └── validaciones.js        ← Logger y manejo de errores
├── routes/
│   ├── libros.js              ← CRUD de libros
│   ├── usuarios.js            ← Registro, login, CRUD usuarios
│   └── reservas.js            ← CRUD de reservas
└── public/
    └── index.html             ← Frontend (interfaz web)
```

---

## ⚙️ Requisitos previos

- Node.js v18 o superior → https://nodejs.org
- SQL Server (cualquier edición, incluida Express)
- ODBC Driver 17 for SQL Server instalado

---

## 🚀 Pasos para ejecutar

### 1. Restaurar la base de datos

Abre SQL Server Management Studio (SSMS) y ejecuta el archivo:
```
respaldo_biblioteca_final.sql
```
Esto creará la base de datos "Biblioteca" con las tablas Libros, usuarios y Reservas.

### 2. Verificar la cadena de conexión

Abre `database.js` y asegúrate de que el nombre del servidor sea correcto:

```js
connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=TU_SERVIDOR;Database=Biblioteca;Trusted_Connection=yes;'
```

Reemplaza `TU_SERVIDOR` con el nombre de tu equipo o instancia de SQL Server.
Por defecto está configurado como: `DESKTOP-UF090I2`

### 3. Instalar dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:
```bash
npm install
```

### 4. Iniciar el servidor

```bash
npm start
```

O si tienes nodemon instalado (para desarrollo):
```bash
npm run dev
```

### 5. Abrir en el navegador

```
http://localhost:3000
```

---

## 🔑 Usuarios de prueba

| Email                    | Contraseña  | Rol           |
|--------------------------|-------------|---------------|
| arieu1107@gmail.com      | 123456789   | Administrador |
| sorrita22222@gmail.com   | 123456789   | Lector        |

---

## 📡 Endpoints de la API

### Libros
| Método | Ruta                | Descripción          |
|--------|---------------------|----------------------|
| GET    | /api/libros         | Listar todos          |
| GET    | /api/libros/:id     | Obtener uno          |
| POST   | /api/libros         | Crear libro          |
| PUT    | /api/libros/:id     | Editar libro         |
| DELETE | /api/libros/:id     | Eliminar libro       |

### Usuarios
| Método | Ruta                       | Descripción          |
|--------|----------------------------|----------------------|
| GET    | /api/usuarios              | Listar todos          |
| POST   | /api/usuarios/registro     | Registrar usuario    |
| POST   | /api/usuarios/login        | Iniciar sesión       |
| PUT    | /api/usuarios/:id          | Editar usuario       |
| DELETE | /api/usuarios/:id          | Eliminar usuario     |

### Reservas
| Método | Ruta                          | Descripción          |
|--------|-------------------------------|----------------------|
| GET    | /api/reservas                 | Listar todas          |
| GET    | /api/reservas/:id             | Obtener una          |
| POST   | /api/reservas                 | Crear reserva        |
| PUT    | /api/reservas/:id/devolver    | Devolver libro       |
| DELETE | /api/reservas/:id             | Eliminar reserva     |

---

## 🎯 Funcionalidades

- ✅ Login y Registro de usuarios
- ✅ Catálogo de libros con imágenes
- ✅ Reserva de libros (cambia disponibilidad automáticamente)
- ✅ Devolución de libros
- ✅ Panel de administrador (agregar, editar y eliminar libros/usuarios)
- ✅ Vistas diferenciadas por rol (Lector / Administrador)
