const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
    },
    phone: {
      type: String,
    },
    dateOfBirth: {
      day: {
        type: Number,
        min: 1,
        max: 31,
      },
      month: {
        type: Number,
        min: 1,
        max: 12,
      },
      year: {
        type: Number,
      },
    },
    vat: {
      type: String,
    },
    licenceNumber: {
      type: Number,
    },
    drivingSince: {
      month: {
        type: Number,
        min: 1,
        max: 12,
      },
      year: {
        type: Number,
      },
    },
    profileImage: {
      url: { type: String },
      externalId: { type: String },
    },
    verified: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model('User', userSchema);
