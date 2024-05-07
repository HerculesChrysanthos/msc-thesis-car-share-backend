const express = require('express');
const router = express.Router();
const { validator } = require('../middleware/validate');
const userValidator = require('./user.validator');
const { auth, authorization } = require('../middleware/check-auth');
const userController = require('./user.controller');
const passport = require('passport');
require('../../server/clients/google-client');

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
  validator(userValidator.googleSchema),
  (req, res, next) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: req.query.role,
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

router.get('/:userId', authorization(), userController.getUserProfile);

// router.put('/:userId');
// // change password
// router.put('/:userId/password');

// router.post('/:userId/profile-picture');

// router.post('/forgot-password');

module.exports = router;
