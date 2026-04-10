const sql = require('mssql/msnodesqlv8');

const config = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-UF090I2;Database=Biblioteca;Trusted_Connection=yes;'
};

// Creamos el pool de conexión
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Conexión exitosa con SQL Server - Base de datos Biblioteca');
        return pool;
    })
    .catch(err => {
        console.error('❌ Error de conexión a la base de datos:', err.message);
        process.exit(1); // Detiene el servidor si no hay conexión
    });

module.exports = { sql, poolPromise };
