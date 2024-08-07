const Booking = require('./booking.model');

async function createBooking(booking) {
  return Booking.create(booking);
}

async function getCarBookingsByCarId(car, status, skip, limit) {
  const query = { car };
  query.status =
    status === 'PREVIOUS' ? { $in: ['REJECTED', 'DONE', 'CANCELLED'] } : status;

  return Booking.aggregate([
    { $match: query },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $facet: {
        totalCount: [{ $count: 'count' }],
        paginatedResults: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]);
}

async function findAcceptedBookingsThatEndDatePassed() {
  const now = new Date();
  const passedFiveMins = new Date(now.getTime() - 5 * 60 * 1000);
  return Booking.aggregate([
    {
      $match: {
        status: 'ACCEPTED',
        endDate: { $gte: passedFiveMins, $lt: now },
      },
    },
    {
      $lookup: {
        from: 'cars',
        localField: 'car',
        foreignField: '_id',
        as: 'car',
      },
    },
    {
      $unwind: '$car',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'car.owner',
        foreignField: '_id',
        as: 'owner',
      },
    },
    {
      $unwind: '$owner',
    },
  ]).exec();
}

async function setBookingsAsDone(bookings) {
  return Booking.updateMany(
    {
      _id: { $in: bookings },
    },
    { $set: { status: 'DONE' } }
  );
}

module.exports = {
  createBooking,
  getCarBookingsByCarId,
  findAcceptedBookingsThatEndDatePassed,
  setBookingsAsDone,
};
