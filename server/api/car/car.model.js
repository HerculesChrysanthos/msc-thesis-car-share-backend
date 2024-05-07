const mongoose = require('mongoose');
const { MAKES, FUEL_TYPES } = require('../constants');

const carSchema = mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    make: {
      type: String,
      required: true,
      enum: MAKES,
    },
    model: {
      type: String,
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
      enum: ['Αυτόματο', 'Μηχανικό', 'Ημιαυτόματο'],
    },
    exteriorColor: {
      type: String,
      required: true,
    },
    interiorColor: {
      type: String,
      required: true,
    },
    rimSize: {
      type: Number,
      required: true,
    },
    euroClass: {
      type: Number,
      required: true,
    },
    driveType: {
      type: String,
      enum: ['Κίνηση στους εμπρός τροχούς', 'Κίνηση στους πίσω τροχούς', '4x4'],
    },
    doors: {
      type: Number,
      required: true,
    },
    rentPerDay: {
      type: Number,
      required: true,
    },
    features: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Car', carSchema);
