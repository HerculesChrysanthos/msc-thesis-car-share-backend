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
      $lookup: {
        from: 'users',
        localField: 'renter',
        foreignField: '_id',
        as: 'renter',
      },
    },
    {
      $unwind: '$renter',
    },

    {
      $project: {
        'renter.name': 1,
        'renter.surname': 1,
        'renter._id': 1,
        car: 1,
        startDate: 1,
        endDate: 1,
        totalPrice: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        // TODO reviews
      },
    },
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

async function getBookingById(bookingId) {
  return Booking.findById(bookingId)
    .populate({
      path: 'car',
      populate: {
        path: 'owner',
      },
    })
    .populate('renter')
    .lean()
    .exec();
}

async function setBookingReview(bookingId, review) {
  return Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: review,
    },
    { new: true }
  );
}

module.exports = {
  createBooking,
  getCarBookingsByCarId,
  findAcceptedBookingsThatEndDatePassed,
  setBookingsAsDone,
  getBookingById,
  setBookingReview,
};
