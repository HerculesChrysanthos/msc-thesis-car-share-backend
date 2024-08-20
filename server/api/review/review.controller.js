const reviewService = require('./review.service');

async function createReview(req, res, next) {
  try {
    const user = req.user;
    const booking = req.booking;
    const review = req.body;

    const createdReview = await reviewService.createReview(
      user,
      booking,
      review
    );

    return res.status(201).json(createdReview);
  } catch (error) {
    if (error.toString().includes('Έχεις ήδη προσθέσει κριτική')) {
      error.status = 409;
    }

    return next(error);
  }
}

async function getUserReviews(req, res, next) {
  try {
    const userId = req.params.userId;
    const { page, limit } = req.query;

    const pageSize = limit ? Number(limit) : 9;
    const skipSize = page ? (Number(page) - 1) * pageSize : 0;

    const reviews = await reviewService.getUserReviews(
      userId,
      skipSize,
      pageSize
    );

    return res.status(200).json(reviews);
  } catch (error) {
    if (error.toString().includes('δε βρέθηκε')) {
      error.status = 404;
    }
    return next(error);
  }
}

module.exports = {
  createReview,
  getUserReviews,
};
