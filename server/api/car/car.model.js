const mongoose = require('mongoose');
const {
  MAKES,
  FUEL_TYPES,
  DRIVE_TYPES,
  GEARBOX_TYPES,
} = require('../constants');

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
    mileage: {
      type: Number,
    },
    fuelType: {
      type: String,
      enum: FUEL_TYPES,
    },
    engineSize: {
      type: Number,
      required: true,
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
    rimSize: {
      type: Number,
    },
    euroClass: {
      type: Number,
    },
    driveType: {
      type: String,
      enum: DRIVE_TYPES,
    },
    doors: {
      type: Number,
    },
    seats: {
      type: Number,
    },
    rentPerHour: {
      type: Number,
    },
    images: [
      {
        type: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    address: {
      city: { type: String, required: true },
      street: { type: String, required: true },
      number: { type: Number, required: true },
      postalCode: { type: String, required: true },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Car', carSchema);
