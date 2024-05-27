const crypto = require('crypto');
const mongoose = require('mongoose');

function generateCryptoToken(bytes = 32) {
  try {
    const buffer = crypto.randomBytes(bytes);

    return buffer.toString('hex');
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

function isValidObjectId(recipeId) {
  return mongoose.Types.ObjectId.isValid(recipeId);
}

module.exports = {
  generateCryptoToken,
  isValidObjectId,
};
