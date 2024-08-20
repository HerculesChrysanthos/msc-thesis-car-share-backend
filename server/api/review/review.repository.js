const mongoose = require('mongoose');
const Review = require('./review.model');

async function createReview(review) {
  return Review.create(review);
}

async function getUserReviews(userId, skip, limit) {
  return Review.aggregate([
    {
      $match: {
        reviewedUser: new mongoose.Types.ObjectId(userId),
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
