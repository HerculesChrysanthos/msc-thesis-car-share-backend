const Review = require('./review.model');

async function createReview(review) {
  return Review.create(review);
}

module.exports = {
  createReview,
};
