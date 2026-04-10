const express = require('express');
const router = express.Router();
const { pool } = require('../database');

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT id, nombre, apellido, email, rol, activo, fecha_registro FROM usuarios ORDER BY id DESC'
        );
        res.json({ exito: true, datos: resultado.rows });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.post('/registro', async (req, res) => {
    const { nombre, apellido, email, password, rol } = req.body;
    if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ exito: false, mensaje: 'Todos los campos son obligatorios' });
    }
    try {
        const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ exito: false, mensaje: 'El email ya está registrado' });
        }
        await pool.query(
            'INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES ($1, $2, $3, $4, $5)',
            [nombre, apellido, email, password, rol || 'Lector']
        );
        res.status(201).json({ exito: true, mensaje: 'Usuario registrado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ exito: false, mensaje: 'Email y contraseña son obligatorios' });
    }
    try {
        const resultado = await pool.query(
            'SELECT id, nombre, apellido, email, rol FROM usuarios WHERE email = $1 AND password = $2 AND activo = true',
            [email, password]
        );
        if (resultado.rows.length === 0) {
            return res.status(401).json({ exito: false, mensaje: 'Credenciales incorrectas' });
        }
        res.json({ exito: true, mensaje: 'Login exitoso', usuario: resultado.rows[0] });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { nombre, apellido, email, rol, activo } = req.body;
    try {
        const resultado = await pool.query(
            'UPDATE usuarios SET nombre=$1, apellido=$2, email=$3, rol=$4, activo=$5 WHERE id=$6',
            [nombre, apellido, email, rol, activo, req.params.id]
        );
        if (resultado.rowCount === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
        }
        res.json({ exito: true, mensaje: 'Usuario actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await pool.query('DELETE FROM usuarios WHERE id = $1', [req.params.id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
        }
        res.json({ exito: true, mensaje: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

module.exports = router;