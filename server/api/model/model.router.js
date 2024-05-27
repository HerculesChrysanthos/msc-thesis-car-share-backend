const express = require('express');
const router = express.Router();
const modelController = require('./model.controller');
const { validator } = require('../../middleware/validate');
const modelValidator = require('./model.validator');

router.get(
  '/',
  validator(modelValidator.getModelsByMakeSchema),
  modelController.getModelsByMake
);

module.exports = router;
