const mongoose = require('mongoose');
const { FUEL_TYPES, GEARBOX_TYPES, FEATURES } = require('../constants');

const carSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    make: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Make',
      required: true,
    },
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Model',
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    registration: {
      month: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
      },
      year: {
        type: Number,
        required: true,
      },
    },
    registrationPlate: {
      type: String,
      required: true,
      unique: true,
    },
    mileage: {
      type: Number,
    },
    fuelType: {
      type: String,
      enum: FUEL_TYPES,
    },
    kilowatt: {
      type: Number,
    },
    engineSize: {
      type: Number,
    },
    enginePower: {
      type: Number,
      required: true,
    },
    gearboxType: {
      type: String,
      enum: GEARBOX_TYPES,
    },
    exteriorColor: {
      type: String,
    },
    interiorColor: {
      type: String,
    },
    euroClass: {
      type: Number,
    },
    doors: {
      type: String,
    },
    seats: {
      type: String,
    },
    rentPerHour: {
      type: Number,
    },
    features: [
      {
        type: String,
        enum: FEATURES,
      },
    ],
    address: {
      city: { type: String },
      street: { type: String },
      number: { type: Number },
      postalCode: { type: String },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    },
    images: [
      {
        url: { type: String },
        /**
         * externalId is about the imagekit
         */
        externalId: { type: String },
      },
    ],
    thumbnail: {
      url: { type: String },
      imageId: { type: String },
      /**
       * externalId is about the imagekit
       */
      externalId: { type: String },
    },
    ratingsScore: {
      type: Number,
    },
    ratingsAmount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Car', carSchema);
