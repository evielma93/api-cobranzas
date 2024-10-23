const ClientModel = require('../models/client');

const { create_or_update_contact } = require('./respond');

const client = new ClientModel();

const getAllCxc = async (req, res) => {
    try {
        const invoices = await client.getAllCxc();
        res.json(invoices);
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
};

const selectAllCxc = async (req, res) => {
    try {
        const invoices = await client.selectAllCxc();
        res.json(invoices);
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
};


const processAllCxc = async (req, res) => {
    try {
        // Llamamos al método para obtener todas las cuentas por cobrar
        const clients = await client.selectAllCxc();

        // Iteramos sobre cada una de las facturas y ejecutamos `create_or_update_contact`
        for (const client of clients) {
            // Aquí llamamos a la función que crea o actualiza el contacto con los datos del cliente
            await create_or_update_contact(client);
        }

        // Si todo sale bien, devolvemos una respuesta exitosa
        res.status(200).send('Contactos procesados exitosamente.');
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
};

module.exports = {
    getAllCxc,
    selectAllCxc,
    processAllCxc
}