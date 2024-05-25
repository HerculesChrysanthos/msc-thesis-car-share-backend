const mongoose = require('mongoose');

const modelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    label: {
      type: String,
      unique: true,
      required: true,
    },
    make: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'make',
    },
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model('Model', modelSchema);
