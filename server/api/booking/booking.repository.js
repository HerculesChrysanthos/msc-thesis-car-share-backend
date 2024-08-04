const Booking = require('./booking.model');

async function createBooking(booking) {
  return Booking.create(booking);
}

async function getCarBookingsByCarId(car) {
  return Booking.find({ car })
    .populate({ path: 'renter', select: '_id name surname email' })
    .sort({ _id: -1 })
    .lean()
    .exec();
}

module.exports = {
  createBooking,
  getCarBookingsByCarId,
};
