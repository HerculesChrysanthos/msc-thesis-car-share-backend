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

async function getCarBookings(req, res, next) {
  try {
    const { status, page, limit } = req.query;

    const pageSize = limit ? Number(limit) : 9;
    const skipSize = page ? (Number(page) - 1) * pageSize : 0;

    const bookings = await bookingService.getCarBookingsByCarId(
      req.car._id,
      status,
      skipSize,
      pageSize
    );
    return res.status(200).json(bookings);
  } catch (error) {
    return next(error);
  }
}

async function getRenterUserBookings(req, res, next) {
  try {
    const { status, page, limit } = req.query;

    const pageSize = limit ? Number(limit) : 9;
    const skipSize = page ? (Number(page) - 1) * pageSize : 0;

    const bookings = await bookingService.getRenterUserBookings(
      req.user._id,
      status,
      skipSize,
      pageSize
    );

    return res.status(200).json(bookings);
  } catch (error) {
    if (error.toString().includes('δε βρέθηκε')) {
      error.status = 404;
    }

    return next(error);
  }
}

async function acceptBooking(req, res, next) {
  try {
    const updatedBooking = await bookingService.acceptBooking(req.booking);

    return res.status(200).json(updatedBooking);
  } catch (error) {
    if (error.toString().includes('Η κράτηση')) {
      error.status = 409;
    }

    return next(error);
  }
}

async function rejectBooking(req, res, next) {
  try {
  } catch (error) {
    if (error.toString().includes('δε βρέθηκε')) {
      error.status = 404;
    }

    return next(error);
  }
}

async function cancelBooking(req, res, next) {
  try {
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createBooking,
  getCarBookings,
  getRenterUserBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking,
};
