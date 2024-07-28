const mongoose = require('mongoose');

const modelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
