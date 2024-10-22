const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '35.207.24.45',
    user: 'cobranzas',
    password: '$vEzf9vkvEBfarAus%YYdrnJQ34',
    database: 'cobranzas_mem',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000
});

async function query(sql, data) {
    try {
        const [result] = await pool.query(sql, data);
        return result;
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw error;
    }
}

module.exports = {
    pool,
    query
};