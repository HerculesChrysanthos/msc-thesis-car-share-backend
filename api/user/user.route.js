const express = require('express');
const router = express.Router();
const { validator } = require('../middleware/validate');
const userValidator = require('./user.validator');
const { auth, authorization } = require('../middleware/check-auth');
const userController = require('./user.controller');

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

//router.get('/:userId', authorization(), userController.getUser);

// router.put('/:userId');
// // change password
// router.put('/:userId/password');

// router.post('/:userId/profile-picture');

// router.post('/forgot-password');

module.exports = router;
