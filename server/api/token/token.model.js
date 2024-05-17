const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  tokenId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24,
  },
});

module.exports = mongoose.model('Token', tokenSchema);
