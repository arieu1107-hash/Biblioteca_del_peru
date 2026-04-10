const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../database');

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request().query('SELECT * FROM Libros ORDER BY id DESC');
        res.json({ exito: true, datos: resultado.recordset });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Libros WHERE id = @id');

        if (resultado.recordset.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Libro no encontrado' });
        }
        res.json({ exito: true, datos: resultado.recordset[0] });
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
        const pool = await poolPromise;
        await pool.request()
            .input('titulo', sql.VarChar(255), titulo)
            .input('autor', sql.VarChar(255), autor)
            .input('imagen_url', sql.VarChar(sql.MAX), imagen_url || null)
            .query('INSERT INTO Libros (titulo, autor, disponible, imagen_url) VALUES (@titulo, @autor, 1, @imagen_url)');

        res.status(201).json({ exito: true, mensaje: 'Libro agregado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { titulo, autor, disponible, imagen_url } = req.body;

    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('titulo', sql.VarChar(255), titulo)
            .input('autor', sql.VarChar(255), autor)
            .input('disponible', sql.Bit, disponible)
            .input('imagen_url', sql.VarChar(sql.MAX), imagen_url || null)
            .query(`UPDATE Libros 
                    SET titulo = @titulo, autor = @autor, disponible = @disponible, imagen_url = @imagen_url
                    WHERE id = @id`);

        if (resultado.rowsAffected[0] === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Libro no encontrado' });
        }
        res.json({ exito: true, mensaje: 'Libro actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM Libros WHERE id = @id');

        if (resultado.rowsAffected[0] === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Libro no encontrado' });
        }
        res.json({ exito: true, mensaje: 'Libro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

module.exports = router;
