const express = require('express');
const router = express.Router();
const { validator } = require('../../middleware/validate');
const {
  auth,
  checkIfUserIsNotOwner,
  isBookingRenterOrCarOwner,
  isBookingRenter,
  isCarBookingOwner,
} = require('../../middleware/check-auth');
const bookingController = require('./booking.controller');
const bookingValidator = require('./booking.validator');
const reviewController = require('../review/review.controller');

router.post(
  '/',
  auth(),
  validator(bookingValidator.createBookingSchema),
  checkIfUserIsNotOwner,
  bookingController.createBooking
);

router.post(
  '/:bookingId/reviews',
  auth(),
  validator(bookingValidator.createReviewSchema),
  isBookingRenterOrCarOwner,
  reviewController.createReview
);

router.put(
  '/:bookingId/accept',
  auth(),
  isCarBookingOwner,
  validator(bookingValidator.acceptBookingSchema),
  bookingController.acceptBooking
);

router.put(
  '/:bookingId/reject',
  auth(),
  isCarBookingOwner,
  validator(bookingValidator.rejectBookingSchema),
  bookingController.rejectBooking
);

router.put(
  '/:bookingId/cancel',
  auth(),
  isBookingRenterOrCarOwner,
  validator(bookingValidator.cancelBookingSchema),
  bookingController.cancelBooking
);

module.exports = router;
