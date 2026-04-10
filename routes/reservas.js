const express = require('express');
const router = express.Router();
const { pool } = require('../database');

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT r.id, r.fecha_reserva, r.fecha_devolucion, r.estado,
                   u.nombre || ' ' || u.apellido AS usuario, u.email,
                   l.titulo AS libro, l.autor
            FROM Reservas r
            INNER JOIN usuarios u ON r.usuario_id = u.id
            INNER JOIN Libros l ON r.libro_id = l.id
            ORDER BY r.fecha_reserva DESC
        `);
        res.json({ exito: true, datos: resultado.rows });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT r.id, r.fecha_reserva, r.fecha_devolucion, r.estado,
                   u.nombre || ' ' || u.apellido AS usuario, u.email,
                   l.titulo AS libro, l.autor
            FROM Reservas r
            INNER JOIN usuarios u ON r.usuario_id = u.id
            INNER JOIN Libros l ON r.libro_id = l.id
            WHERE r.id = $1
        `, [req.params.id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Reserva no encontrada' });
        }
        res.json({ exito: true, datos: resultado.rows[0] });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.post('/', async (req, res) => {
    const { usuario_id, libro_id, fecha_devolucion } = req.body;
    if (!usuario_id || !libro_id || !fecha_devolucion) {
        return res.status(400).json({ exito: false, mensaje: 'usuario_id, libro_id y fecha_devolucion son obligatorios' });
    }
    try {
        const libro = await pool.query('SELECT disponible FROM Libros WHERE id = $1', [libro_id]);
        if (libro.rows.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Libro no encontrado' });
        }
        if (!libro.rows[0].disponible) {
            return res.status(400).json({ exito: false, mensaje: 'El libro no está disponible' });
        }
        await pool.query(
            "INSERT INTO Reservas (usuario_id, libro_id, fecha_devolucion, estado) VALUES ($1, $2, $3, 'Activa')",
            [usuario_id, libro_id, fecha_devolucion]
        );
        await pool.query('UPDATE Libros SET disponible = false WHERE id = $1', [libro_id]);
        res.status(201).json({ exito: true, mensaje: 'Reserva creada correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.put('/:id/devolver', async (req, res) => {
    try {
        const reserva = await pool.query('SELECT libro_id, estado FROM Reservas WHERE id = $1', [req.params.id]);
        if (reserva.rows.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Reserva no encontrada' });
        }
        if (reserva.rows[0].estado === 'Devuelto') {
            return res.status(400).json({ exito: false, mensaje: 'El libro ya fue devuelto' });
        }
        await pool.query("UPDATE Reservas SET estado = 'Devuelto' WHERE id = $1", [req.params.id]);
        await pool.query('UPDATE Libros SET disponible = true WHERE id = $1', [reserva.rows[0].libro_id]);
        res.json({ exito: true, mensaje: 'Libro devuelto correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const reserva = await pool.query('SELECT libro_id, estado FROM Reservas WHERE id = $1', [req.params.id]);
        if (reserva.rows.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Reserva no encontrada' });
        }
        if (reserva.rows[0].estado === 'Activa') {
            await pool.query('UPDATE Libros SET disponible = true WHERE id = $1', [reserva.rows[0].libro_id]);
        }
        await pool.query('DELETE FROM Reservas WHERE id = $1', [req.params.id]);
        res.json({ exito: true, mensaje: 'Reserva eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

module.exports = router;