const Booking = require('./booking.model');

async function createBooking(booking) {
  return Booking.create(booking);
}

async function getCarBookingsByCarId(car) {
  return Booking.find({ car })
    .populate({ path: 'renter', select: '_id name surname email' })
    .lean()
    .exec();
}

module.exports = {
  createBooking,
  getCarBookingsByCarId,
};
