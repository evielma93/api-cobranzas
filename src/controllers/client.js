const { response, request } = require('express');
const ClientModel = require('../models/client');

const client = new ClientModel();

const getAllCxc = async (req, res) => {
    try {
        const invoices = await client.getAllCxc();
        res.json(invoices);
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
};



module.exports = {
    getAllCxc
}