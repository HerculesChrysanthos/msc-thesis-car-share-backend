const reviewRepository = require('./review.repository');
const bookingService = require('../booking/booking.service');
const userService = require('../user/user.service');
const carService = require('../car/car.service');

async function createReview(user, booking, review) {
  let createdReview;

  review.reviewer = user._id;
  review.booking = booking._id;

  if (user.isOwner) {
    if (booking.ownerReview) {
      throw new Error('Έχεις ήδη προσθέσει κριτική');
    }
    review.reviewedUser = booking.renter._id;

    createdReview = await reviewRepository.createReview(review);

    const currentScore = booking.renter.ratingsScore || 0;
    const currentAmount = booking.renter.ratingsAmount || 0;

    const newScore =
      (currentScore * currentAmount + review.rating) / (currentAmount + 1);

    await Promise.all([
      userService.updateUserRatingScoreAndAmount(
        review.reviewedUser,
        newScore,
        currentAmount + 1
      ),
      bookingService.setBookingReview(booking._id, {
        ownerReview: createdReview._id,
      }),
    ]);
  }

  if (user.isRenter) {
    if (booking.renterReview) {
      throw new Error('Έχεις ήδη προσθέσει κριτική');
    }

    review.reviewedUser = booking.car.owner._id;
    review.car = booking.car._id;

    createdReview = await reviewRepository.createReview(review);

    const currentScore = booking.car.owner.ratingsScore || 0;
    const currentAmount = booking.car.owner.ratingsAmount || 0;

    const newScore =
      (currentScore * currentAmount + review.rating) / (currentAmount + 1);

    const currentCarScore = booking.car.ratingsScore || 0;
    const currentCarAmount = booking.car.ratingsAmount || 0;

    const newCarScore =
      (currentCarScore * currentCarAmount + review.rating) /
      (currentCarAmount + 1);

    await Promise.all([
      userService.updateUserRatingScoreAndAmount(
        review.reviewedUser,
        newScore,
        currentAmount + 1
      ),
      bookingService.setBookingReview(booking._id, {
        renterReview: createdReview._id,
      }),
      carService.updateCarRatingScoreAndAmount(
        booking.car._id,
        newCarScore,
        currentCarAmount + 1
      ),
    ]);
  }

  return createdReview;
}

async function getUserReviews(userId, page, limit) {
  await userService.checkIfUserExists(userId);

  return reviewRepository.getUserReviews(userId, page, limit);
}

module.exports = {
  createReview,
  getUserReviews,
};
