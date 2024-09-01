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

    if (
      error
        .toString()
        .includes(
          'Δεν μπορείς να προσθέσεις κριτική σε κράτηση που δεν έχει ολοκληρωθεί'
        )
    ) {
      error.status = 409;
    }

    return next(error);
  }
}

async function getUserReviews(req, res, next) {
  try {
    const userId = req.params.userId;
    const { page, limit, role } = req.query;

    const pageSize = limit ? Number(limit) : 9;
    const skipSize = page ? (Number(page) - 1) * pageSize : 0;

    const reviews = await reviewService.getUserReviews(
      userId,
      skipSize,
      pageSize,
      role
    );

    const response = {
      totalCount: reviews[0].results[0]?.totalCount || 0,
      paginatedResults: reviews[0].results[0]?.paginatedResults || [],
    };

    return res.status(200).json(response);
  } catch (error) {
    if (error.toString().includes('δε βρέθηκε')) {
      error.status = 404;
    }
    return next(error);
  }
}

async function getCarReviews(req, res, next) {
  try {
    const carId = req.params.carId;
    const { page, limit } = req.query;

    const pageSize = limit ? Number(limit) : 9;
    const skipSize = page ? (Number(page) - 1) * pageSize : 0;

    const reviews = await reviewService.getCarReviews(
      carId,
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
  getCarReviews,
};
