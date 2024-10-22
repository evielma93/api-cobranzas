const express = require('express');
const router = express.Router();

const { listFile }  = require("../controllers/sftp");


router.get('/',listFile);




module.exports = router;