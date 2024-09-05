const Joi = require('joi');
const {
  GEARBOX_TYPES,
  FUEL_TYPES,
  FEATURES,
  INTERIOR_COLORS,
  EXTERIOR_COLORS,
} = require('../constants');

const createCarSchema = Joi.object({
  body: Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    registration: Joi.object({
      month: Joi.number().integer().min(1).max(12).required(),
      year: Joi.number().integer().max(new Date().getFullYear()).required(),
    }).required(),
    registrationPlate: Joi.string()
      .pattern(/^[Α-Ω]{3}-\d{4}$/)
      .message('Το πεδίο πρέπει να είναι της μορφής "ΑΒΓ-1234"')
      .required(),
    mileage: Joi.number().integer().min(0).required(),
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
    // euroClass: Joi.number().integer().min(0).required(),
    rentPerHour: Joi.number().integer().min(0),
  }),
});

const updateCarSpecificFieldsSchema = Joi.object({
  params: Joi.object({
    carId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    make: Joi.string(),
    model: Joi.string(),
    registration: Joi.object({
      month: Joi.number().integer().min(1).max(12),
      year: Joi.number().integer().max(new Date().getFullYear()),
    }),
    registrationPlate: Joi.string()
      .pattern(/^[Α-Ω]{3}-\d{4}$/)
      .message('Το πεδίο πρέπει να είναι της μορφής "ΑΒΓ-1234"'),
    mileage: Joi.number().integer().min(0),
    enginePower: Joi.number().integer().min(0),
    fuelType: Joi.string().valid(...Object.values(FUEL_TYPES)),
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
    gearboxType: Joi.string().valid(...Object.values(GEARBOX_TYPES)),
    rentPerHour: Joi.number().integer().min(0),
    exteriorColor: Joi.string().valid(...Object.values(EXTERIOR_COLORS)),
    interiorColor: Joi.string().valid(...Object.values(INTERIOR_COLORS)),
    doors: Joi.string().valid('3', '5', '7+'),
    seats: Joi.string().valid('2', '3', '4', '5', '6', '7+'),
    thumbnail: Joi.string(),
    features: Joi.array()
      .items(Joi.string().valid(...Object.values(FEATURES)))
      .unique(),
    address: Joi.object({
      city: Joi.string().required(),
      street: Joi.string().required(),
      number: Joi.number().required(),
      postalCode: Joi.string().required(),
      lat: Joi.number().min(-90).max(90).required(),
      long: Joi.number().min(-180).max(180).required(),
    }),
  }),
});

const uploadCarImageSchema = Joi.object({
  params: Joi.object({
    carId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    setThumbnail: Joi.boolean(),
  }),
  image: Joi.array().items(Joi.binary().required()).required(),
});

const deleteCarImageSchema = Joi.object({
  params: Joi.object({
    carId: Joi.string().required(),
    imageId: Joi.string().required(),
  }).required(),
});

const addCarAvailabilitySchema = Joi.object({
  params: Joi.object({
    carId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    available: Joi.boolean(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date()
      .iso()
      .required()
      .greater(Joi.ref('startDate'))
      .messages({
        'date.greater':
          'Η αρχική ημερομηνία πρέπει να είναι αργότερα από την αρχική.',
      }),
  }).required(),
});

const updateCarAvailabilitySchema = Joi.object({
  params: Joi.object({
    carId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    available: Joi.boolean(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date()
      .iso()
      .required()
      .greater(Joi.ref('startDate'))
      .messages({
        'date.greater':
          'Η αρχική ημερομηνία πρέπει να είναι αργότερα από την αρχική.',
      }),
    status: Joi.string().valid('UNAVAILABLE', 'AVAILABLE'),
  }).required(),
});

const getCarByIdSchema = Joi.object({
  params: Joi.object({
    carId: Joi.string().required(),
  }).required(),
});

const findCarByFiltersAndByAvailabilityDaysSchema = Joi.object({
  query: Joi.object({
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
    lat: Joi.number().min(-90).max(90).required(),
    long: Joi.number().min(-180).max(180).required(),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(1),
    make: Joi.string(),
    model: Joi.string(),
    gearboxType: Joi.string().valid(...Object.values(GEARBOX_TYPES)),
  }).required(),
});

const getCarBookingsSchema = Joi.object({
  params: Joi.object({
    carId: Joi.string().required(),
  }).required(),
  query: Joi.object({
    status: Joi.string().valid('PENDING', 'ACCEPTED', 'PREVIOUS').required(),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
  }).required(),
});

const getCarAvailabilitiesSchema = Joi.object({
  params: Joi.object({
    carId: Joi.string().required(),
  }).required(),
  query: Joi.object({
    status: Joi.string().valid('UNAVAILABLE', 'AVAILABLE', 'RESERVED'),
  }),
});

const getCarReviewsSchema = Joi.object({
  params: Joi.object({
    carId: Joi.string().required(),
  }).required(),
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
  }),
});

const deleteCarSchema = Joi.object({
  params: Joi.object({
    carId: Joi.string().required(),
  }).required(),
});

module.exports = {
  createCarSchema,
  // updateCarSchema,
  updateCarSpecificFieldsSchema,
  uploadCarImageSchema,
  deleteCarImageSchema,
  addCarAvailabilitySchema,
  updateCarAvailabilitySchema,
  getCarByIdSchema,
  findCarByFiltersAndByAvailabilityDaysSchema,
  getCarBookingsSchema,
  getCarAvailabilitiesSchema,
  getCarReviewsSchema,
  deleteCarSchema,
};
