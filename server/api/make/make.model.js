const mongoose = require('mongoose');

const makeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model('Make', makeSchema);
