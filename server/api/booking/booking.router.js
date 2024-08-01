const express = require('express');
const router = express.Router();
const { validator } = require('../../middleware/validate');
const { auth, checkIfUserIsNotOwner } = require('../../middleware/check-auth');
const bookingRouter = require('./booking.controller');

router.post('/', auth(), checkIfUserIsNotOwner, bookingRouter.createBooking);

module.exports = router;
