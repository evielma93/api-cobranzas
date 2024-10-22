const express = require('express');
const cors    = require('cors');
const { connection } = require('../config/database');


class Server {

    constructor(){
        this.app  = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json())
        this.app.use(express.static("public"))
    }

    routes() {
        this.app.use('/api/v1',require('../routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Escuchando en: http://localhost: ${this.port}`)
        })
    }

    
}

module.exports = Server;