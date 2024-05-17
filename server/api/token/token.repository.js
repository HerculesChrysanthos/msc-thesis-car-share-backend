const Token = require('./token.model');

async function findTokenByTokenId(tokenId) {
  return Token.find({ tokenId }).lean().exec();
}

async function deleteTokenByTokenId(tokenId) {
  return Token.delete({ tokenId });
}

async function createToken(token) {
  return Token.create(token);
}

module.exports = {
  findTokenByTokenId,
  deleteTokenByTokenId,
  createToken,
};
