const express = require('express');
const router = express.Router();
const { validator } = require('../../middleware/validate');
const userValidator = require('./user.validator');
const { auth, isUser } = require('../../middleware/check-auth');
const userController = require('./user.controller');
const passport = require('passport');
require('../../clients/passport-google-client');
const multerHelper = require('../../helpers/multer.helper');
const reviewController = require('../review/review.controller');
const bookingController = require('../booking/booking.controller');
const carController = require('../car/car.controller');

router.post(
  '/register',
  validator(userValidator.registerSchema),
  userController.register
);

router.post(
  '/login',
  validator(userValidator.loginSchema),
  userController.login
);

router.get(
  '/google',
  // validator(userValidator.googleSchema),
  (req, res, next) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      // state: req.query.role,
    })(req, res, next);
  }
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  userController.googleAuth
  // (req, res, next) => {
  //   // Redirect or respond with the JWT token
  //   res.send('Google authentication successful!');
  // }
);

router.post(
  '/verify',
  validator(userValidator.verifySchema),
  userController.verify
);

router.post('/re-send-verify-token', auth(), userController.reSendVerfiyToken);

router.get('/me', auth(), userController.getMe);

router.patch(
  '/:userId',
  auth(),
  isUser,
  validator(userValidator.updateMyUserFieldsSchema),
  userController.updateMyUserFields
);

router.post(
  '/:userId/profile-image',
  auth(),
  isUser,
  multerHelper.prepareImages(1),
  validator(userValidator.uploadUserProfileImageSchema),
  userController.uploadUserProfileImage
);

router.get(
  '/:userId/reviews',
  validator(userValidator.getUserReviewsSchema),
  reviewController.getUserReviews
);

router.get(
  '/:userId/bookings',
  auth(),
  isUser,
  validator(userValidator.getRenterUserBookingsSchema),
  bookingController.getRenterUserBookings
);

router.get(
  '/:userId',
  validator(userValidator.getUserByIdSchema),
  userController.getUserById
);

router.get(
  '/:userId/cars',
  validator(userValidator.getUserCarsSchema),
  carController.getCarsByOwnerId
);

module.exports = router;
