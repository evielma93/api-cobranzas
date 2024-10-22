const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000
});


pool.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))")
    .then(() => {
        console.log('Modo ONLY_FULL_GROUP_BY desactivado para la sesión.');
    })
    .catch(err => {
        console.error('Error al desactivar ONLY_FULL_GROUP_BY:', err);
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