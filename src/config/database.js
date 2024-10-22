const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.SFTP_HOST,
    user: process.env.SFTP_HOST,
    password: process.env.SFTP_HOST,
    database: process.env.SFTP_HOST,
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