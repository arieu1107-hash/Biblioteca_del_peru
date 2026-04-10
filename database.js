const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(() => console.log('✅ Conexión exitosa con PostgreSQL'))
    .catch(err => {
        console.error('❌ Error de conexión:', err.message);
        process.exit(1);
    });

module.exports = { pool };