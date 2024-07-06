const express = require('express');
const router = express.Router();
const { validator } = require('../../middleware/validate');
const carController = require('./car.controller');
const {
  auth,
  authorization,
  hasCarAccess,
} = require('../../middleware/check-auth');
const carValidator = require('./car.validator');

router.post(
  '/',
  auth(),
  validator(carValidator.createCarSchema),
  carController.createCar
);

router.patch(
  '/:carId',
  auth(),
  hasCarAccess,
  validator(carValidator.updateCarSpecificFieldsSchema),
  carController.updateCarSpecificFields
);

module.exports = router;
