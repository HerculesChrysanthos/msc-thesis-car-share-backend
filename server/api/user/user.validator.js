const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
// const { ROLES } = require('../constants');

const complexityOptions = {
  min: 8,
  max: 16,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 6,
};

const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: passwordComplexity(complexityOptions)
      .required()
      .label('password'),
    passwordConfirmation: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('passwordConfirmation')
      .messages({ 'any.only': 'Οι κωδικοί δεν ταιριάζουν' }),
    // role: Joi.string().valid(...Object.values(ROLES)),
    // phone: Joi.string()
    //   .pattern(/^\+?\d{1,10}$/)
    //   .required(),
    // dateOfBirth: Joi.object({
    //   day: Joi.number().integer().min(1).max(31).required(),
    //   month: Joi.number().integer().min(1).max(12).required(),
    //   year: Joi.number()
    //     .integer()
    //     .min(1900)
    //     .max(new Date().getFullYear() - 18)
    //     .messages({
    //       'number.max': 'Πρέπει να είσαι ενήλικας για να προχωρήσεις',
    //     })
    //     .required(),
    // }).required(),
    // vat: Joi.string().required(),
    // licence: Joi.number().required(),
    // drivingSince: Joi.number().integer().min(1900).required(),
  }).required(),
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(16).required(),
  }),
}).required();

// const googleSchema = Joi.object({
//   query: Joi.object({
//     role: Joi.string().valid(...Object.values(ROLES)),
//   }),
// });

const verifySchema = Joi.object({
  query: Joi.object({
    token: Joi.string().hex().length(64).required(),
  }),
});

const updateMyUserFieldsSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^\+?\d{1,10}$/)
      .required(),
    dateOfBirth: Joi.object({
      day: Joi.number().integer().min(1).max(31).required(),
      month: Joi.number().integer().min(1).max(12).required(),
      year: Joi.number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear() - 18)
        .messages({
          'number.max': 'Πρέπει να είσαι ενήλικας για να προχωρήσεις',
        })
        .required(),
    }).required(),
    vat: Joi.string().required(),
    licenceNumber: Joi.number().required(),
    drivingSince: Joi.object({
      month: Joi.number().integer().min(1).max(12).required(),
      year: Joi.number().integer().min(1900).required(),
    }),
  }),
});

const uploadUserProfileImageSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().required(),
  }).required(),
  image: Joi.array().items(Joi.binary().required()).required(),
});

const getUserReviewsSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().required(),
  }).required(),
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
  }),
});

const getRenterUserBookingsSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().required(),
  }).required(),
  query: Joi.object({
    status: Joi.string().valid('ACCEPTED', 'PREVIOUS'),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
  }),
});

const getUserByIdSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().required(),
  }).required(),
});

const getUserCarsSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().required(),
  }).required(),
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  //googleSchema,
  verifySchema,
  updateMyUserFieldsSchema,
  uploadUserProfileImageSchema,
  getUserReviewsSchema,
  getRenterUserBookingsSchema,
  getUserByIdSchema,
  getUserCarsSchema,
};
