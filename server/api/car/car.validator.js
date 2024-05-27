const Joi = require('joi');
const {
  DRIVE_TYPES,
  GEARBOX_TYPES,
  FUEL_TYPES,
  FEATURES,
} = require('../constants');

// const createCarSchema = Joi.object({
//   body: Joi.object({
//     make: Joi.string().required(),
//     model: Joi.string().required(),
//     // make: Joi.string()
//     //   .lowercase()
//     //   .valid(...Object.values(MAKES))
//     //   .required(),
//     // model: Joi.string()
//     //   .required()
//     //   .when('make', {
//     //     is: Joi.string().valid(...Object.values(MAKES)),
//     //     then: Joi.custom((value, helpers) => {
//     //       const make = helpers.state.ancestors[0].make;
//     //       if (!MODELS[make].includes(value)) {
//     //         return helpers.error('any.invalid');
//     //       }
//     //       return value;
//     //     }, 'Model validation'),
//     //   }),
//     registration: Joi.object({
//       month: Joi.number().integer().min(1).max(12).required(),
//       year: Joi.number().integer().max(new Date().getFullYear()).required(),
//     }).required(),
//     mileage: Joi.number().integer().min(0).required(),
//     fuelType: Joi.string()
//       .valid(...Object.values(FUEL_TYPES))
//       .required(),
//     engineSize: Joi.number().integer().min(0).required(),
//     enginePower: Joi.number().integer().min(0).required(),
//     gearboxType: Joi.string()
//       .valid(...Object.values(GEARBOX_TYPES))
//       .required(),
//     exteriorColor: Joi.string().required(),
//     interiorColor: Joi.string().required(),
//     rimSize: Joi.number().integer().min(0).required(),
//     eurocClass: Joi.number().integer().min(0).required(),
//     driveType: Joi.string()
//       .valid(...Object.values(DRIVE_TYPES))
//       .required(),
//     doors: Joi.number().integer(),
//     seats: Joi.number().min(1).integer().required(),
//     rentPerHour: Joi.number().integer().min(0).required(),
//     features: Joi.array().items(
//       Joi.string()
//         .valid(...Object.values(FEATURES))
//         .required()
//     ),
//   }),
//   image: Joi.array().items(Joi.binary().required()).required(),
// });

//const updateCarSchema = Joi.object({});

const createCarSchema = Joi.object({
  body: Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    registration: Joi.object({
      month: Joi.number().integer().min(1).max(12).required(),
      year: Joi.number().integer().max(new Date().getFullYear()).required(),
    }).required(),
    mileage: Joi.number().integer().min(0).required(),
    engineSize: Joi.number().integer().min(0).required(),
    enginePower: Joi.number().integer().min(0),
    fuelType: Joi.string()
      .valid(...Object.values(FUEL_TYPES))
      .required(),
    kilowatt: Joi.number().when('fuelType', {
      is: FUEL_TYPES.ELECTRIC,
      then: Joi.number().integer().min(0).required(),
      otherwise: Joi.forbidden(),
    }),
    engineSize: Joi.number().when('fuelType', {
      not: FUEL_TYPES.ELECTRIC,
      then: Joi.number().integer().min(0).required(),
      otherwise: Joi.forbidden(),
    }),
    gearboxType: Joi.string()
      .valid(...Object.values(GEARBOX_TYPES))
      .required(),
    euroClass: Joi.number().integer().min(0).required(),
  }),
});

module.exports = {
  createCarSchema,
  // updateCarSchema,
};
