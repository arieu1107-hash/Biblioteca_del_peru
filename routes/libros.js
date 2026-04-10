const express = require('express');
const router = express.Router();
const { pool } = require('../database');

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM Libros ORDER BY id DESC');
        res.json({ exito: true, datos: resultado.rows });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM Libros WHERE id = $1', [req.params.id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Libro no encontrado' });
        }
        res.json({ exito: true, datos: resultado.rows[0] });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.post('/', async (req, res) => {
    const { titulo, autor, imagen_url } = req.body;
    if (!titulo || !autor) {
        return res.status(400).json({ exito: false, mensaje: 'Título y autor son obligatorios' });
    }
    try {
        await pool.query(
            'INSERT INTO Libros (titulo, autor, disponible, imagen_url) VALUES ($1, $2, true, $3)',
            [titulo, autor, imagen_url || null]
        );
        res.status(201).json({ exito: true, mensaje: 'Libro agregado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { titulo, autor, disponible, imagen_url } = req.body;
    try {
        const resultado = await pool.query(
            'UPDATE Libros SET titulo=$1, autor=$2, disponible=$3, imagen_url=$4 WHERE id=$5',
            [titulo, autor, disponible, imagen_url || null, req.params.id]
        );
        if (resultado.rowCount === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Libro no encontrado' });
        }
        res.json({ exito: true, mensaje: 'Libro actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await pool.query('DELETE FROM Libros WHERE id = $1', [req.params.id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Libro no encontrado' });
        }
        res.json({ exito: true, mensaje: 'Libro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

module.exports = router;