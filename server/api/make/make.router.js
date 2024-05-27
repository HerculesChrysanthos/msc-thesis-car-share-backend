const express = require('express');
const router = express.Router();
const makeController = require('./make.controller');

router.get('/', makeController.getAllMakes);

module.exports = router;
