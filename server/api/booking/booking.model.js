const { required } = require('joi');
const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'DONE', 'CANCELLED'],
    },
    renterReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
    ownerReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
