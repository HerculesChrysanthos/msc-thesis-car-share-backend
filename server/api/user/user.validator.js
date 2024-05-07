const Joi = require('joi');
const { ROLES } = require('../constants');

const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().lowercase().required(),
    surname: Joi.string().lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(16).required().label('password'),
    passwordConfirmation: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} Δεν ταιριάζουν' }),
    role: Joi.string().valid(...Object.values(ROLES)),
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
    licence: Joi.number().required(),
    drivingSince: Joi.number().integer().min(1900).required(),
  }).required(),
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(16).required(),
  }),
}).required();

const googleSchema = Joi.object({
  query: Joi.object({
    role: Joi.string().valid(...Object.values(ROLES)),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  googleSchema,
};
