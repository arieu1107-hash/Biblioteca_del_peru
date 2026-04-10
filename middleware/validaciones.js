
const logger = (req, res, next) => {
    const ahora = new Date().toLocaleString('es-PE');
    console.log(`[${ahora}] ${req.method} ${req.url}`);
    next();
};

const manejarErrores = (err, req, res, next) => {
    console.error('❌ Error del servidor:', err.message);
    res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor',
        error: err.message
    });
};

module.exports = { logger, manejarErrores };
