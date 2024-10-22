const express = require('express');
const { getAllCxc,selectAllCxc,processAllCxc } = require('../controllers/client');
const router = express.Router();


// router.get('/',getAllCxc);
//router.get('/',selectAllCxc);
router.get('/',processAllCxc);

//router.post('/',createContact);

module.exports = router