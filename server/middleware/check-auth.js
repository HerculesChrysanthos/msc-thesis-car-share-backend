const jwt = require('jsonwebtoken');
const userRepository = require('../api/user/user.repository');
const utils = require('../utils');
const carRepository = require('../api/car/car.repository');
const bookingService = require('../api/booking/booking.service');
const endpointsWitoutVerification = ['/api/users/re-send-verify-token'];

const auth = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers?.authorization?.split(' ')[1];

      if (!token) {
        throw new Error('A token is required for authentication');
      }

      const decoded = jwt.verify(token, process.env.TOKEN_KEY);

      const foundUser = await userRepository.findUserById(decoded.userId);

      if (!foundUser) {
        throw new Error('Unauthorized');
      }

      if (
        !foundUser.verified &&
        !endpointsWitoutVerification.includes(req.originalUrl)
      ) {
        throw new Error(
          'Πρέπει να κάνεις verify το email σου για να προχωρήσεις.'
        );
      }

      req.user = foundUser;

      return next();
    } catch (error) {
      if (error.message === 'invalid signature') {
        error.message = 'Invalid Token';
        error.status = 401;
      }

      if (error.message === 'jwt malformed') {
        error.message = 'Invalid Token';
        error.status = 401;
      }

      if (error.message === 'A token is required for authentication') {
        error.status = 403;
      }

      if (error.message === 'Unauthorized') {
        error.status = 401;
      }

      if (
        error.message ===
        'Πρέπει να κάνεις verify το email σου για να προχωρήσεις.'
      ) {
        error.status = 401;
      }

      return next(error);
    }
  };
};

function authorization() {
  return (req, res, next) => {
    try {
      const token = req?.headers?.authorization?.split(' ')[1];
      if (!token) {
        return next();
      }

      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decoded;

      req.user.isOwner = req.user.userId === req.params.userId;

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

async function hasCarAccess(req, res, next) {
  try {
    const carId = req.params.carId;

    if (!utils.isValidObjectId(carId)) {
      const error = new Error('Το αυτοκίνητο δε βρέθηκε');
      error.status = 404;
      throw error;
    }

    const car = await carRepository.findCarById(carId);

    if (!car) {
      const error = new Error('Το αυτοκίνητο δε βρέθηκε');
      error.status = 404;
      throw error;
    }

    if (car.owner.toString() !== req.user._id.toString()) {
      const error = new Error('Δεν έχεις πρόσβαση');
      error.status = 403;
      throw error;
    }

    if (!car.isEnabled) {
      const error = new Error(
        'Δεν μπορείς να προχωρήσεις σε τροποποιήσεις γιατί το αυτοκίνητο έχει διαγραφεί'
      );
      error.status = 404;
      throw error;
    }

    req.car = car;

    return next();
  } catch (error) {
    return next(error);
  }
}

async function checkIfUserIsNotOwner(req, res, next) {
  try {
    const carId = req.body.car;

    if (!utils.isValidObjectId(carId)) {
      const error = new Error('Το αυτοκίνητο δε βρέθηκε');
      error.status = 404;
      throw error;
    }

    const car = await carRepository.findCarByIdAndPopulateOnwerMakeModel(carId);

    if (!car) {
      const error = new Error('Το αυτοκίνητο δε βρέθηκε');
      error.status = 404;
      throw error;
    }

    if (car.owner._id.toString() === req.user._id.toString()) {
      const error = new Error(
        'Δεν μπορείς να νοικιάσεις αυτοκίνητο που σου ανήκει.'
      );
      error.status = 409;
      throw error;
    }

    req.car = car;

    return next();
  } catch (error) {
    return next(error);
  }
}

async function isUser(req, res, next) {
  try {
    if (req.params.userId !== req.user._id.toString()) {
      const error = new Error('Δεν έχεις πρόσβαση');
      error.status = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

async function isBookingRenterOrCarOwner(req, res, next) {
  try {
    const bookingId = req.params.bookingId;

    const booking = await bookingService.getBookingById(bookingId);

    req.booking = booking;

    req.user.isRenter =
      booking.renter._id.toString() === req.user._id.toString();
    req.user.isOwner =
      booking.car.owner._id.toString() === req.user._id.toString();

    if (!req.user.isOwner && !req.user.isRenter) {
      const error = new Error('Δεν έχεις πρόσβαση στην κράτηση');
      error.status = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

async function isCarBookingOwner(req, res, next) {
  try {
    const bookingId = req.params.bookingId;
    const booking = await bookingService.getBookingById(bookingId);

    if (booking.car.owner._id.toString() !== req.user._id.toString()) {
      const error = new Error('Δεν έχεις πρόσβαση στην κράτηση');
      error.status = 403;
      throw error;
    }

    req.booking = booking;

    return next();
  } catch (error) {
    return next(error);
  }
}

async function isBookingRenter(req, res, next) {
  try {
    const bookingId = req.params.bookingId;
    const booking = await bookingService.getBookingById(bookingId);

    if (booking.renter._id.toString() !== req.user._id.toString()) {
      const error = new Error('Δεν έχεις πρόσβαση στην κράτηση');
      error.status = 403;
      throw error;
    }

    req.booking = booking;

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  auth,
  authorization,
  hasCarAccess,
  checkIfUserIsNotOwner,
  isUser,
  isBookingRenterOrCarOwner,
  isCarBookingOwner,
  isBookingRenter,
};
