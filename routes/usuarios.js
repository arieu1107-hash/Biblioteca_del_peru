const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../database');

// =============================================
// GET /api/usuarios → Obtener todos los usuarios
// =============================================
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .query('SELECT id, nombre, apellido, email, rol, activo, fecha_registro FROM usuarios ORDER BY id DESC');
        res.json({ exito: true, datos: resultado.recordset });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

// =============================================
// POST /api/usuarios/registro → Registrar usuario
// =============================================
router.post('/registro', async (req, res) => {
    const { nombre, apellido, email, password, rol } = req.body;

    if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ exito: false, mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        const pool = await poolPromise;

        // Verificar si el email ya existe
        const existe = await pool.request()
            .input('email', sql.VarChar(150), email)
            .query('SELECT id FROM usuarios WHERE email = @email');

        if (existe.recordset.length > 0) {
            return res.status(400).json({ exito: false, mensaje: 'El email ya está registrado' });
        }

        await pool.request()
            .input('nombre',   sql.VarChar(100), nombre)
            .input('apellido', sql.VarChar(100), apellido)
            .input('email',    sql.VarChar(150), email)
            .input('password', sql.VarChar(255), password)
            .input('rol',      sql.VarChar(50),  rol || 'Lector')
            .query(`INSERT INTO usuarios (nombre, apellido, email, password, rol)
                    VALUES (@nombre, @apellido, @email, @password, @rol)`);

        res.status(201).json({ exito: true, mensaje: 'Usuario registrado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

// =============================================
// POST /api/usuarios/login → Iniciar sesión
// =============================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ exito: false, mensaje: 'Email y contraseña son obligatorios' });
    }

    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('email',    sql.VarChar(150), email)
            .input('password', sql.VarChar(255), password)
            .query('SELECT id, nombre, apellido, email, rol FROM usuarios WHERE email = @email AND password = @password AND activo = 1');

        if (resultado.recordset.length === 0) {
            return res.status(401).json({ exito: false, mensaje: 'Credenciales incorrectas' });
        }

        const usuario = resultado.recordset[0];
        res.json({ exito: true, mensaje: 'Login exitoso', usuario });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

// =============================================
// PUT /api/usuarios/:id → Actualizar usuario
// =============================================
router.put('/:id', async (req, res) => {
    const { nombre, apellido, email, rol, activo } = req.body;

    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('id',       sql.Int,         req.params.id)
            .input('nombre',   sql.VarChar(100), nombre)
            .input('apellido', sql.VarChar(100), apellido)
            .input('email',    sql.VarChar(150), email)
            .input('rol',      sql.VarChar(50),  rol)
            .input('activo',   sql.Bit,          activo)
            .query(`UPDATE usuarios 
                    SET nombre = @nombre, apellido = @apellido, email = @email, rol = @rol, activo = @activo
                    WHERE id = @id`);

        if (resultado.rowsAffected[0] === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
        }
        res.json({ exito: true, mensaje: 'Usuario actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

// =============================================
// DELETE /api/usuarios/:id → Eliminar usuario
// =============================================
router.delete('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM usuarios WHERE id = @id');

        if (resultado.rowsAffected[0] === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
        }
        res.json({ exito: true, mensaje: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

module.exports = router;
