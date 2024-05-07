const mongoose = require('mongoose');
const { ROLES } = require('../constants');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    googleId: { type: String },
    role: {
      type: String,
      default: ROLES.RENTER,
      enum: ROLES,
    },
    phone: { type: String },
    dateOfBirth: {
      day: {
        type: Number,
        required: true,
        min: 1,
        max: 31,
      },
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
    vat: { type: String },
    licence: { type: Number },
    drivingSince: { type: Number },
    profilePictureUrl: { type: String },
    carsOwning: [
      {
        carId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Car',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
