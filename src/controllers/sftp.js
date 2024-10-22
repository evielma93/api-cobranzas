const { config } = require('../config/sftp');
const { pool } = require('../config/database');
const Client = require('ssh2-sftp-client');

const fs    = require('fs');
const path  = require('path');
const csv   = require('csv-parser');
const iconv = require('iconv-lite');

const { Script } = require('../models/querys/query');

const sftp = new Client();
const script = new Script();

const remoteDirectory = `/home/sftp_user/intl/BANCOS/REPORTES`;
const localDirectory = path.join(__dirname, '..', 'public');

async function listFile() {
    try {
        // Conectarse al servidor SFTP antes de listar y descargar archivos
        await sftp.connect(config);
        // Leer el contenido del directorio remoto
        const fileList = await sftp.list(remoteDirectory);
        console.log(fileList);
        const sortedFiles = fileList.sort((a, b) => b.modifyTime - a.modifyTime);
        // Verificamos que existan archivos en la ruta del SFTP
        if (sortedFiles.length === 0) {
            console.log('No hay archivos en el directorio remoto.');
            return;
        }
        const latestFile = "cuentasxcobrar.csv"; // Nombre del archivo
        const remoteFilePath = `${remoteDirectory}/${latestFile}`;
        const localFilePath = path.join(localDirectory, latestFile);
        // Descargamos el archivo desde el servidor SFTP 
        await downloadFile(remoteFilePath, localFilePath);
        // Leemos y almacenamos el archivo descargado
        await readAndStoreCSV(localFilePath);
    } catch (err) {
        console.error('Error al listar y descargar el archivo:', err);
    } finally {
        // Cerrar la conexión SFTP después de todas las operaciones
        sftp.end();
    }
}

async function downloadFile(remoteFilePath, localFilePath) {
    try {
        // Descargar el archivo del sftp
        console.log(`Ingresando: ${remoteFilePath}`);
        await sftp.get(remoteFilePath, localFilePath);
        console.log(`Archivo descargado exitosamente: ${localFilePath}`);
        // Leemos el contenido del archivo descargado
        const content = fs.readFileSync(localFilePath);
        // Convertimos el contenido de Windows-1252 (ANSI) a UTF-8
        const utf8Content = iconv.decode(content, 'windows-1252');
        const utf8Buffer = iconv.encode(utf8Content, 'utf-8');
        // Guardamos el archivo convertido en UTF-8
        fs.writeFileSync(localFilePath, utf8Buffer);
        console.log(`Archivo convertido de ANSI a UTF-8: ${localFilePath}`);
    } catch (err) {
        console.error('Error al descargar o convertir el archivo:', err);
    }
}

async function readAndStoreCSV(localFilePath) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const data = await new Promise((resolve, reject) => {
            const rows = [];
            fs.createReadStream(localFilePath, { encoding: 'utf8' })
                .pipe(csv({ separator: ';' }))
                .on('data', (row) => {
                    rows.push([
                        row.ruc,
                        row.cliente,
                        row.contrato,
                        row.valor_cuota,
                        row.tesoreria,
                        row.telefono,
                        row.correo,
                        row.agencia,
                        row.plan,
                        row.cartera,
                        row.nota,
                        row.status_poliza,
                        row.periodo_pago,
                        row.fechaVencimientoCxc,
                        row.dias_vencidos,
                        row.idcxc,
                        row.fechaVentaContrato,
                        row.edad || 0,
                        row.poliza,
                        row.Ciudad,
                        row.Sexo,
                        row.fechaInicioPoliza,
                        row.status_contract
                    ]);
                })
                .on('end', () => resolve(rows))
                .on('error', (err) => reject(err));
        });

        await connection.query(script.truncateCxc());
        console.log('Tabla vaciada antes de la inserción.');
        console.log('CSV leído correctamente, insertando datos...');

        const query = script.insertCxc();

        const chunkSize = 500;
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            await executeQueryWithRetry(connection, query, [chunk]);
        }

        await connection.commit();
        console.log('Datos almacenados en la base de datos.');
        await connection.query(script.updateCharacters());
    } catch (err) {
        console.error('Error al leer y almacenar el archivo:', err);
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('Error al hacer rollback:', rollbackError);
            }
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function executeQueryWithRetry(connection, query, params, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const [result] = await connection.query(query, params);
            return result;
        } catch (error) {
            if (error.code === 'ECONNRESET' && i < retries - 1) {
                console.log(`Reintento de conexión (${i + 1}) tras ECONNRESET`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                console.error('Error en la consulta:', error);
                throw error;
            }
        }
    }
}



module.exports = { listFile }