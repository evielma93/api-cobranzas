const express = require('express');
const { getContact } = require('../controllers/respond');
const router = express.Router();


router.get('/',getContact);

//router.post('/',createContact);

module.exports = router