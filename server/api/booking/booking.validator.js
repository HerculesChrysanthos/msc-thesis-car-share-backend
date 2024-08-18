const Joi = require('joi');

const createBookingSchema = Joi.object({
  body: Joi.object({
    car: Joi.string().required(),
    startDate: Joi.date()
      .iso()
      .custom((value, helpers) => {
        const minutes = value.getUTCMinutes();
        const seconds = value.getUTCSeconds();
        if (minutes !== 0 || seconds !== 0) {
          return helpers.error('any.only');
        }
      })
      .required()
      .messages({
        'any.only': 'Επέλεξε μόνο ακέραιες ώρες.',
      }),
    endDate: Joi.date()
      .iso()
      .custom((value, helpers) => {
        const minutes = value.getUTCMinutes();
        const seconds = value.getUTCSeconds();

        if (minutes !== 0 || seconds !== 0) {
          return helpers.error('any.only');
        }
      })
      .required()
      .messages({
        'any.only': 'Επέλεξε μόνο ακέραιες ώρες.',
      }),
    price: Joi.number().integer().min(0).required(),
  }),
});

const createReviewSchema = Joi.object({
  params: Joi.object({
    bookingId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(500),
  }),
});

module.exports = {
  createBookingSchema,
  createReviewSchema,
};
