const mongoose = require('mongoose');
const availabilityService = require('../availability/availability.service');
const bookingRepository = require('./booking.repository');
const nodemailer = require('../../clients/nodemailer');
const { EMAIL_TYPES } = require('../constants');
const utils = require('../../utils');
const moment = require('moment');

async function createBooking(booking) {
  const momentStartDate = moment(booking.startDate);
  const momentEndDate = moment(booking.endDate);

  if (!momentStartDate.isBefore(momentEndDate)) {
    throw new Error(
      'Η αρχική ημερομηνία θα πρέπει να είναι αργότερα από την τελική'
    );
  }

  const oneHourFromNow = moment().add(1, 'hour');

  if (!momentStartDate.isAfter(oneHourFromNow)) {
    throw new Error(
      'Η κράτηση θα πρέπει να ξεκινάει τουλάχιστον μια ώρα αργότερα από τώρα'
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const bookingToCreate = {
    car: booking.car._id,
    renter: booking.user._id,
    startDate: booking.startDate,
    endDate: booking.endDate,
    status: 'PENDING',
  };

  let result;
  let availabilities = [];

  try {
    availabilities =
      await availabilityService.findCarAvailabilitiesOnSpecificDates(
        booking.car._id,
        booking.startDate,
        booking.endDate,
        session
      );

    await availabilityService.changeAvailabilitiesStatus(
      availabilities,
      'RESERVED',
      session
    );

    bookingToCreate.totalPrice =
      availabilities.length * booking.car.rentPerHour;

    if (bookingToCreate.totalPrice !== booking.price) {
      throw new Error('Υπάρχει ασυμφωνία στις τιμές.');
    }

    result = await bookingRepository.createBooking(bookingToCreate);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  availabilityService.setBookingOnAvailabilities(result._id, availabilities);

  const emailInfo = {
    type: EMAIL_TYPES.BOOKING_OWNER,
    user: booking.car.owner,
    booking,
  };
  nodemailer.sendEmail(emailInfo);

  const emailInfoRenter = {
    type: EMAIL_TYPES.BOOKING_RENTER,
    user: booking.user,
    booking,
  };
  nodemailer.sendEmail(emailInfoRenter);

  return result;
}

async function getCarBookingsByCarId(car, status, skip, limit) {
  return bookingRepository.getCarBookingsByCarId(car, status, skip, limit);
}

async function setAsDoneAcceptedBookingsThatEndDatePassed() {
  const bookings =
    await bookingRepository.findAcceptedBookingsThatEndDatePassed();

  const results = await bookingRepository.setBookingsAsDone(bookings);

  bookings.forEach((booking) => {
    const ownerPrompt = {
      type: EMAIL_TYPES.REVIEW_PROMP_ONWER,
      user: booking.owner,
      info: booking,
    };
    nodemailer.sendEmail(ownerPrompt);

    const renterPrompt = {
      type: EMAIL_TYPES.REVIEW_PROMP_RENTER,
      user: booking.renter,
      info: booking,
    };
    nodemailer.sendEmail(renterPrompt);
  });

  return results;
}

async function setBookingReview(bookingId, review) {
  return bookingRepository.setBookingReview(bookingId, review);
}

async function getRenterUserBookings(userId, status, skip, limit) {
  return bookingRepository.getRenterUserBookings(userId, status, skip, limit);
}

async function getBookingById(bookingId) {
  if (!utils.isValidObjectId(bookingId)) {
    const error = new Error('Η κράτηση δε βρέθηκε');
    error.status = 404;
    throw error;
  }

  const booking = await bookingRepository.getBookingById(bookingId);

  if (!booking) {
    const error = new Error('Η κράτηση δε βρέθηκε');
    error.status = 404;
    throw error;
  }

  return booking;
}

async function acceptBooking(existingBooking) {
  if (existingBooking.status !== 'PENDING') {
    switch (existingBooking.status) {
      case 'ACCEPTED':
        throw new Error('Η κράτηση έχει ήδη γίνει αποδεχτή');
      case 'REJECTED' || 'CANCELLED':
        throw new Error(
          'Η κράτηση δεν μπορεί να γίνει αποδεχτή καθώς έχει ακυρωθεί'
        );
      case 'DONE':
        throw new Error(
          'Η κράτηση δεν μπορεί να γίνει αποδεχτή καθώς έχει ολοκληρωθεί'
        );
      default:
        throw new Error('Η κράτηση δεν μπορεί να αλλάξει σε αποδεχτή');
    }
  }

  const booking = await bookingRepository.changeBookingStatus(
    existingBooking._id,
    'ACCEPTED'
  );

  const emailInfo = {
    type: EMAIL_TYPES.BOOKING_ACCEPTANCE,
    user: existingBooking.renter,
    info: existingBooking,
  };

  nodemailer.sendEmail(emailInfo);

  return booking;
}

async function rejectBooking(existingBooking) {
  if (existingBooking.status !== 'PENDING') {
    switch (existingBooking.status) {
      case 'ACCEPTED':
        throw new Error('Η κράτηση έχει ήδη γίνει αποδεχτή');
      case 'REJECTED' || 'CANCELLED':
        throw new Error('Η κράτηση έχει ήδη ακυρωθεί');
      case 'DONE':
        throw new Error(
          'Η κράτηση δεν μπορεί να απορριφθεί καθώς έχει ολοκληρωθεί'
        );
      default:
        throw new Error('Η κράτηση δεν μπορεί να απορριφθεί');
    }
  }

  const booking = await bookingRepository.changeBookingStatus(
    existingBooking._id,
    'REJECTED'
  );

  await availabilityService.setAvailabilitiesAsAvailableByBookingId(
    booking._id
  );

  const emailInfo = {
    type: EMAIL_TYPES.BOOKING_REJECTION,
    user: existingBooking.renter,
    info: existingBooking,
  };

  nodemailer.sendEmail(emailInfo);

  return booking;
}

async function cancelBooking(existingBooking, user) {
  const now = moment();

  if (existingBooking.status === 'CANCELLED') {
    throw new Error('Δεν μπορείς να ακυρώσεις κράτηση που έχει ήδη ακυρωθεί');
  }

  if (existingBooking.status === 'DONE') {
    throw new Error('Δεν μπορείς να ακυρώσεις κράτηση που έχει ολοκληρωθεί');
  }

  if (existingBooking.status === 'REJECTED') {
    throw new Error('Δεν μπορείς να ακυρώσεις κράτηση που έχει απορριφθεί');
  }

  if (
    existingBooking.status === 'ACCEPTED' &&
    existingBooking.startDate <= now.toISOString()
  ) {
    throw new Error(
      'Δεν μπορείς να ακυρώσεις κράτηση που βρίσκεται σε εξέλιξη'
    );
  }

  if (existingBooking.car.owner._id.toString() === user._id.toString()) {
    if (existingBooking.status !== 'ACCEPTED') {
      throw new Error(
        'Μπορείς να ακυρώσεις μόνο κράτηση την οποία έχεις προηγουμένως αποδεκτεί'
      );
    }

    const oneDayBefore = moment().subtract(1, 'days');
    const oneDayAfter = moment().add(1, 'days');

    const isWithinOneDayBeforeAndOneAfter = moment(
      existingBooking.startDate
    ).isBetween(oneDayBefore, oneDayAfter);

    if (isWithinOneDayBeforeAndOneAfter) {
      throw new Error(
        'Δεν μπορείς να ακυρώσεις κράτηση η οποία αρχίζει σε λιγότερο από μία ημέρα'
      );
    }
  }

  const oneHourBefore = moment().subtract(1, 'hours');

  const oneHourAfter = moment().add(1, 'hours');

  const isWithinLastHourAndNextHour = moment(
    existingBooking.startDate
  ).isBetween(oneHourBefore, oneHourAfter);

  if (isWithinLastHourAndNextHour) {
    throw new Error(
      'Δεν μπορείς να ακυρώσεις κράτηση η οποία αρχίζει σε λιγότερο από μία ώρα'
    );
  }

  const booking = await bookingRepository.changeBookingStatus(
    existingBooking._id,
    'CANCELLED'
  );

  await availabilityService.setAvailabilitiesAsAvailableByBookingId(
    booking._id
  );

  if (existingBooking.car.owner._id.toString() === user._id.toString()) {
    const emailInfo = {
      type: EMAIL_TYPES.BOOKING_CANCELEATION_BY_OWNER,
      user: existingBooking.renter,
      info: existingBooking,
    };

    nodemailer.sendEmail(emailInfo);
  }

  if (existingBooking.renter._id.toString() === user._id.toString()) {
    const emailInfo = {
      type: EMAIL_TYPES.BOOKING_CANCELEATION_BY_RENTER,
      user: existingBooking.car.owner,
      info: existingBooking,
    };

    nodemailer.sendEmail(emailInfo);
  }

  return booking;
}

async function findAcceptedAndPendingBookingsByCarId(carId, session) {
  return bookingRepository.findAcceptedAndPendingBookingsByCarId(
    carId,
    session
  );
}

module.exports = {
  createBooking,
  getCarBookingsByCarId,
  setAsDoneAcceptedBookingsThatEndDatePassed,
  setBookingReview,
  getRenterUserBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  findAcceptedAndPendingBookingsByCarId,
};
