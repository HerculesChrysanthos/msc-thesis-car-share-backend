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
const multerHelper = require('../../helpers/multer.helper');

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

router.post(
  '/:carId/images',
  auth(),
  hasCarAccess,
  multerHelper.prepareImages(1),
  validator(carValidator.uploadCarImageSchema),
  carController.uploadCarImage
);

router.delete(
  '/:carId/images/:imageId',
  auth(),
  hasCarAccess,
  validator(carValidator.deleteCarImageSchema),
  carController.deleteCarImage
);

module.exports = router;
