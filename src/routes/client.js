const express = require('express');
const { getAllCxc } = require('../controllers/client');
const router = express.Router();


router.get('/',getAllCxc);

//router.post('/',createContact);

module.exports = router