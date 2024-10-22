const { query } = require('../config/database');
const { Script } = require('./querys/query');

class ClientModel {

    constructor(){
        this.script = new Script();
    }

    async getAllCxc() {
        try {
            console.log(this.script.selectCxc());
            const result = await query(this.script.selectCxc());
            console.log(result);
            return result;
        } catch (error) {
            console.error('Error al obtener Facturas:', error);
            throw error;
        }
    }
    
    async selectAllCxc() {
        try {
            const result = await query(this.script.selectAllCxc());
            console.log(result);
            return result;
        } catch (error) {
            console.error('Error al obtener Facturas:', error);
            throw error;
        }
    }

}

module.exports = ClientModel;