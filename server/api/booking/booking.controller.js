const bookingService = require('./booking.service');

async function createBooking(req, res, next) {
  try {
    const { startDate, endDate, price } = req.body;
    const user = req.user;
    const car = req.car;

    const booking = {
      car: car,
      startDate,
      endDate,
      price,
      user,
    };

    const result = await bookingService.createBooking(booking);

    return res.status(201).json(result);
  } catch (error) {
    console.log(`error: ${error}`);

    if (
      error
        .toString()
        .includes('Το αυτοκίνητο δεν είναι διαθέσιμο τις επιλεγμένες ώρες') ||
      error.toString().includes('Υπάρχει ασυμφωνία στις τιμές.')
    ) {
      error.status = 409;
    }

    return next(error);
  }
}

module.exports = {
  createBooking,
};
