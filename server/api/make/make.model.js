const mongoose = require('mongoose');

const makeSchema = mongoose.Schema(
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
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model('Make', makeSchema);
