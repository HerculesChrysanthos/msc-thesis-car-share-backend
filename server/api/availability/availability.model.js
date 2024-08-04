const mongoose = require('mongoose');

const availabilitySchema = mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['AVAILABLE', 'RESERVED', 'UNAVAILABLE'],
      default: 'AVAILABLE',
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Availability', availabilitySchema);
