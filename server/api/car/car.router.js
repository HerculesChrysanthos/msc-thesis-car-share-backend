const express = require('express');
const router = express.Router();
const { validator } = require('../../middleware/validate');
const carController = require('./car.controller');
const availabilityController = require('../availability/availability.controller');
const bookingController = require('../booking/booking.controller');
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

router.get('/my-cars', auth(), carController.getMyCars);

router.get(
  '/:carId',
  validator(carValidator.getCarByIdSchema),
  carController.getCarById
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

router.post(
  '/:carId/availabilities',
  auth(),
  hasCarAccess,
  validator(carValidator.addCarAvailabilitySchema),
  availabilityController.createAvailability
);

// change general car availability
router.put(
  '/:carId/availabilities',
  auth(),
  hasCarAccess,
  validator(carValidator.updateCarAvailabilitySchema),
  availabilityController.updateCarAvailabilities
);

// TODO allazei diathesimothta se range mesa mesa sth geniki diathesimothta
router.put(
  '/:carId/availabilities?status=unavailable&startDate=isodate&endDate=isodate'
);

// TODO na gurnaei start kai enddate
router.get(
  '/:carId/availabilities?status=unavailable|available',
  auth(),
  hasCarAccess,
  validator(carValidator.getCarAvailabilitiesSchema),
  availabilityController.findCarAvailabilities
);

router.get(
  '/',
  validator(carValidator.findCarByFiltersAndByAvailabilityDaysSchema),
  carController.findCarByFiltersAndByAvailabilityDays
);

router.get(
  '/:carId/bookings',
  auth(),
  hasCarAccess,
  validator(carValidator.getCarBookingsSchema),
  bookingController.getCarBookings
);

module.exports = router;
