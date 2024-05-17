const tokenRepository = require('./token.repository');
const utils = require('../../utils');

async function findTokenByTokenId(token) {
  return tokenRepository.findTokenByTokenId(token);
}

async function deleteTokenByTokenId(token) {
  return tokenRepository.deleteTokenByTokenId(token);
}

async function createToken(userId) {
  let createdToken;
  while (true) {
    try {
      let tokenId = utils.generateCryptoToken();

      const token = {
        userId,
        tokenId,
      };

      createdToken = await tokenRepository.createToken(token);

      break;
    } catch (error) {
      console.log('Token collision detected, generating a new token...');
    }
  }

  return createToken;
}

module.exports = {
  findTokenByTokenId,
  deleteTokenByTokenId,
  createToken,
};
