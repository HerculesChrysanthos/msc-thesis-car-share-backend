const Booking = require('./booking.model');

async function createBooking(booking) {
  return Booking.create(booking);
}

module.exports = {
  createBooking,
};
