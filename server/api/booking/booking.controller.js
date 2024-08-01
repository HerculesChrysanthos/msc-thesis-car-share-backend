const bookingService = require('./booking.service');

async function createBooking(req, res, next) {
  try {
    const { car, startDate, endDate } = req.body;

    const result = await bookingService.createBooking(car, startDate, endDate);

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createBooking,
};
