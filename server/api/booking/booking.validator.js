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

module.exports = {
  createBookingSchema,
};
