const crypto = require('crypto');

function generateCryptoToken(bytes = 32) {
  try {
    const buffer = crypto.randomBytes(bytes);

    return buffer.toString('hex');
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

module.exports = {
  generateCryptoToken,
};
