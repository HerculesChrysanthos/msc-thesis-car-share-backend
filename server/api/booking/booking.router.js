const express = require('express');
const router = express.Router();
const { validator } = require('../../middleware/validate');
const {
  auth,
  checkIfUserIsNotOwner,
  hasBookingAccessForReview,
} = require('../../middleware/check-auth');
const bookingRouter = require('./booking.controller');
const bookingValidator = require('./booking.validator');
const reviewController = require('../review/review.controller');

router.post(
  '/',
  auth(),
  validator(bookingValidator.createBookingSchema),
  checkIfUserIsNotOwner,
  bookingRouter.createBooking
);

router.post(
  '/:bookingId/reviews',
  auth(),
  validator(bookingValidator.createReviewSchema),
  hasBookingAccessForReview,
  reviewController.createReview
);

// router.put('/:bookingId/accept');

// router.put('/:bookingId/reject');

module.exports = router;
