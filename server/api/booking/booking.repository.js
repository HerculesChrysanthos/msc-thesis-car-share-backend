const { default: mongoose } = require('mongoose');
const Booking = require('./booking.model');

async function createBooking(booking, session) {
  return Booking.create([booking], { session });
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
      $lookup: {
        from: 'reviews',
        localField: 'renterReview',
        foreignField: '_id',
        as: 'renterReview',
      },
    },
    {
      $unwind: {
        path: '$renterReview',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: 'ownerReview',
        foreignField: '_id',
        as: 'ownerReview',
      },
    },
    {
      $unwind: {
        path: '$ownerReview',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        'renter.name': 1,
        'renter.surname': 1,
        'renter._id': 1,
        'renter.ratingsScore': 1,
        'renter.ratingsAmount': 1,
        car: 1,
        startDate: 1,
        endDate: 1,
        totalPrice: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        renterReview: 1,
        ownerReview: 1,
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $facet: {
        total: [{ $count: 'count' }],
        paginatedResults: [{ $skip: skip }, { $limit: limit }],
      },
    },
    {
      $addFields: {
        totalCount: {
          $ifNull: [{ $arrayElemAt: ['$total.count', 0] }, 0],
        },
      },
    },
    {
      $project: {
        totalCount: 1,
        paginatedResults: 1,
        general: 1,
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
    {
      $lookup: {
        from: 'makes',
        localField: 'car.make',
        foreignField: '_id',
        as: 'car.make',
      },
    },
    { $unwind: '$car.make' },
    {
      $lookup: {
        from: 'models',
        localField: 'car.model',
        foreignField: '_id',
        as: 'car.model',
      },
    },
    { $unwind: '$car.model' },
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
      populate: [
        {
          path: 'owner',
        },
        { path: 'make' },
        { path: 'model' },
      ],
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

async function getRenterUserBookings(renter, status, skip, limit) {
  const query = { renter };
  query.status = status === 'PREVIOUS' ? { $in: ['DONE'] } : status;

  return Booking.aggregate([
    {
      $match: query,
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
        as: 'car.owner',
      },
    },
    {
      $unwind: '$car.owner',
    },
    {
      $lookup: {
        from: 'makes',
        localField: 'car.make',
        foreignField: '_id',
        as: 'car.make',
      },
    },
    { $unwind: '$car.make' },
    {
      $lookup: {
        from: 'models',
        localField: 'car.model',
        foreignField: '_id',
        as: 'car.model',
      },
    },
    { $unwind: '$car.model' },
    {
      $lookup: {
        from: 'reviews',
        localField: 'renterReview',
        foreignField: '_id',
        as: 'renterReview',
      },
    },
    {
      $unwind: {
        path: '$renterReview',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: 'ownerReview',
        foreignField: '_id',
        as: 'ownerReview',
      },
    },
    {
      $unwind: {
        path: '$ownerReview',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        'car.owner.name': 1,
        'car.owner.surname': 1,
        'car.owner._id': 1,
        'car.owner.ratingsScore': 1,
        'car.owner.ratingsAmount': 1,
        'car._id': 1,
        'car.model': 1,
        'car.make': 1,
        'car.thumbnail': 1,
        startDate: 1,
        endDate: 1,
        totalPrice: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        renterReview: 1,
        ownerReview: 1,
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $facet: {
        total: [{ $count: 'count' }],
        paginatedResults: [{ $skip: skip }, { $limit: limit }],
      },
    },
    {
      $addFields: {
        totalCount: {
          $ifNull: [{ $arrayElemAt: ['$total.count', 0] }, 0],
        },
      },
    },
    {
      $project: {
        totalCount: 1,
        paginatedResults: 1,
      },
    },
  ]).exec();
}

async function changeBookingStatus(bookingId, status) {
  return Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: { status },
    },
    { new: true }
  )
    .lean()
    .exec();
}

async function findAcceptedAndPendingBookingsByCarId(carId, session) {
  return Booking.find({
    car: new mongoose.Types.ObjectId(carId),
    status: { $in: ['ACCEPTED', 'PENDING'] },
  })
    .session(session)
    .lean()
    .exec();
}

module.exports = {
  createBooking,
  getCarBookingsByCarId,
  findAcceptedBookingsThatEndDatePassed,
  setBookingsAsDone,
  getBookingById,
  setBookingReview,
  getRenterUserBookings,
  changeBookingStatus,
  findAcceptedAndPendingBookingsByCarId,
};
