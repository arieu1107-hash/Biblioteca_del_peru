const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const { logger, manejarErrores } = require('./middleware/validaciones');

// Importar rutas
const rutasLibros   = require('./routes/libros');
const rutasUsuarios = require('./routes/usuarios');
const rutasReservas = require('./routes/reservas');

const app = express();
const PUERTO = process.env.PORT || 3000;

// =============================================
// MIDDLEWARE GLOBAL
// =============================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger);

// =============================================
// RUTAS DE LA API
// =============================================
app.use('/api/libros',   rutasLibros);
app.use('/api/usuarios', rutasUsuarios);
app.use('/api/reservas', rutasReservas);

// Ruta raíz → sirve el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ exito: false, mensaje: 'Ruta no encontrada' });
});

// Middleware de errores
app.use(manejarErrores);

// =============================================
// INICIAR SERVIDOR
// =============================================
app.listen(PUERTO, () => {
    console.log(`🌸 Servidor corriendo en http://localhost:${PUERTO}`);
    console.log(`📚 API Lista:`);
    console.log(`   → http://localhost:${PUERTO}/api/libros`);
    console.log(`   → http://localhost:${PUERTO}/api/usuarios`);
    console.log(`   → http://localhost:${PUERTO}/api/reservas`);
});

module.exports = app;
