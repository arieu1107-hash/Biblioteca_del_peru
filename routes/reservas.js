const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../database');

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request().query(`
            SELECT 
                r.id,
                r.fecha_reserva,
                r.fecha_devolucion,
                r.estado,
                u.nombre + ' ' + u.apellido AS usuario,
                u.email,
                l.titulo AS libro,
                l.autor
            FROM Reservas r
            INNER JOIN usuarios u ON r.usuario_id = u.id
            INNER JOIN Libros   l ON r.libro_id   = l.id
            ORDER BY r.fecha_reserva DESC
        `);
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
            .query(`
                SELECT 
                    r.id, r.fecha_reserva, r.fecha_devolucion, r.estado,
                    u.nombre + ' ' + u.apellido AS usuario, u.email,
                    l.titulo AS libro, l.autor
                FROM Reservas r
                INNER JOIN usuarios u ON r.usuario_id = u.id
                INNER JOIN Libros   l ON r.libro_id   = l.id
                WHERE r.id = @id
            `);

        if (resultado.recordset.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Reserva no encontrada' });
        }
        res.json({ exito: true, datos: resultado.recordset[0] });
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
        const pool = await poolPromise;

        const libro = await pool.request()
            .input('libro_id', sql.Int, libro_id)
            .query('SELECT disponible FROM Libros WHERE id = @libro_id');

        if (libro.recordset.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Libro no encontrado' });
        }
        if (!libro.recordset[0].disponible) {
            return res.status(400).json({ exito: false, mensaje: 'El libro no está disponible para reserva' });
        }

        await pool.request()
            .input('usuario_id',      sql.Int,      usuario_id)
            .input('libro_id',        sql.Int,      libro_id)
            .input('fecha_devolucion', sql.DateTime, new Date(fecha_devolucion))
            .query(`INSERT INTO Reservas (usuario_id, libro_id, fecha_devolucion, estado)
                    VALUES (@usuario_id, @libro_id, @fecha_devolucion, 'Activa')`);

        // Marcar el libro como no disponible
        await pool.request()
            .input('libro_id', sql.Int, libro_id)
            .query('UPDATE Libros SET disponible = 0 WHERE id = @libro_id');

        res.status(201).json({ exito: true, mensaje: 'Reserva creada correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.put('/:id/devolver', async (req, res) => {
    try {
        const pool = await poolPromise;

        const reserva = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT libro_id, estado FROM Reservas WHERE id = @id');

        if (reserva.recordset.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Reserva no encontrada' });
        }
        if (reserva.recordset[0].estado === 'Devuelto') {
            return res.status(400).json({ exito: false, mensaje: 'El libro ya fue devuelto' });
        }

        const libro_id = reserva.recordset[0].libro_id;

        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query("UPDATE Reservas SET estado = 'Devuelto' WHERE id = @id");

        // Marcar el libro como disponible
        await pool.request()
            .input('libro_id', sql.Int, libro_id)
            .query('UPDATE Libros SET disponible = 1 WHERE id = @libro_id');

        res.json({ exito: true, mensaje: 'Libro devuelto correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;

        const reserva = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT libro_id, estado FROM Reservas WHERE id = @id');

        if (reserva.recordset.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Reserva no encontrada' });
        }

        if (reserva.recordset[0].estado === 'Activa') {
            await pool.request()
                .input('libro_id', sql.Int, reserva.recordset[0].libro_id)
                .query('UPDATE Libros SET disponible = 1 WHERE id = @libro_id');
        }

        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM Reservas WHERE id = @id');

        res.json({ exito: true, mensaje: 'Reserva eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ exito: false, mensaje: err.message });
    }
});

module.exports = router;
