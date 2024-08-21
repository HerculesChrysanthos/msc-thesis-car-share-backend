const mongoose = require('mongoose');
const availabilityService = require('../availability/availability.service');
const carService = require('../car/car.service');
const bookingRepository = require('./booking.repository');
const nodemailer = require('../../clients/nodemailer');
const { EMAIL_TYPES } = require('../constants');

async function createBooking(booking) {
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

  nodemailer.sendEmail(EMAIL_TYPES.BOOKING_OWNER, booking.car.owner);

  nodemailer.sendEmail(EMAIL_TYPES.BOOKING_RENTER, booking.user);

  return result;
}

async function getCarBookingsByCarId(car, status, skip, limit) {
  return bookingRepository.getCarBookingsByCarId(car, status, skip, limit);
}

async function setAsDoneAcceptedBookingsThatEndDatePassed() {
  const bookings =
    await bookingRepository.findAcceptedBookingsThatEndDatePassed();

  // send emails

  // update

  return bookings;
}

async function setBookingReview(bookingId, review) {
  return bookingRepository.setBookingReview(bookingId, review);
}

async function getRenterUserBookings(userId, status, skip, limit) {
  return bookingRepository.getRenterUserBookings(userId, status, skip, limit);
}

module.exports = {
  createBooking,
  getCarBookingsByCarId,
  setAsDoneAcceptedBookingsThatEndDatePassed,
  setBookingReview,
  getRenterUserBookings,
};
