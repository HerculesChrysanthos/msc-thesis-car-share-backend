const mongoose = require('mongoose');

const availabilitySchema = mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
    date: { type: Date, required: true },
    hours: [
      {
        hour: {
          type: Number,
          min: 0,
          max: 23,
        },
        status: {
          type: String,
          enum: ['available', 'reserved', 'unavailable'],
          default: 'available',
        },
        booking: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Availability', availabilitySchema);
