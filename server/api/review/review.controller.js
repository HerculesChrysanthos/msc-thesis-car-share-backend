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

module.exports = {
  createReview,
};
