const mongoose = require('mongoose');
const Review = require('./review.model');

async function createReview(review) {
  return Review.create(review);
}

async function getUserReviews(userId, skip, limit, role) {
  const pipeline = [
    {
      $match: {
        reviewedUser: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'reviewer',
        foreignField: '_id',
        as: 'reviewer',
      },
    },
    {
      $unwind: '$reviewer',
    },
    {
      $lookup: {
        from: 'bookings',
        localField: 'booking',
        foreignField: '_id',
        as: 'booking',
      },
    },
    {
      $unwind: '$booking',
    },
  ];

  if (role === 'RENTER') {
    pipeline.push({
      $facet: {
        results: [
          {
            $match: {
              $expr: {
                $eq: [{ $toString: '$booking.renter' }, userId],
              },
            },
          },
          {
            $group: {
              _id: null,
              totalCount: { $sum: 1 },
              docs: { $push: '$$ROOT' },
            },
          },
          {
            $project: {
              _id: 0,
              totalCount: 1,
              paginatedResults: {
                $slice: [
                  {
                    $map: {
                      input: '$docs',
                      as: 'doc',
                      in: {
                        _id: '$$doc._id',
                        reviewer: {
                          _id: '$$doc.reviewer._id',
                          name: '$$doc.reviewer.name',
                          surname: '$$doc.reviewer.surname',
                          email: '$$doc.reviewer.email',
                        },
                        reviewedUser: '$$doc.reviewedUser',
                        booking: '$$doc.booking',
                        rating: '$$doc.rating',
                        comment: '$$doc.comment',
                      },
                    },
                  },
                  skip,
                  limit,
                ],
              },
            },
          },
        ],
      },
    });
  } else {
    pipeline.push({
      $facet: {
        results: [
          {
            $match: {
              $expr: {
                $ne: [{ $toString: '$booking.renter' }, userId],
              },
            },
          },
          {
            $group: {
              _id: null,
              totalCount: { $sum: 1 },
              docs: { $push: '$$ROOT' },
            },
          },
          {
            $project: {
              _id: 0,
              totalCount: 1,
              paginatedResults: {
                $slice: [
                  {
                    $map: {
                      input: '$docs',
                      as: 'doc',
                      in: {
                        _id: '$$doc._id',
                        reviewer: {
                          _id: '$$doc.reviewer._id',
                          name: '$$doc.reviewer.name',
                          surname: '$$doc.reviewer.surname',
                          email: '$$doc.reviewer.email',
                        },
                        reviewedUser: '$$doc.reviewedUser',
                        booking: '$$doc.booking',
                        rating: '$$doc.rating',
                        comment: '$$doc.comment',
                      },
                    },
                  },
                  skip,
                  limit,
                ],
              },
            },
          },
        ],
      },
    });
  }

  return Review.aggregate(pipeline).exec();
}

async function getCarReviews(carId, skip, limit) {
  return Review.aggregate([
    {
      $match: {
        car: new mongoose.Types.ObjectId(carId),
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

module.exports = {
  createReview,
  getUserReviews,
  getCarReviews,
};
