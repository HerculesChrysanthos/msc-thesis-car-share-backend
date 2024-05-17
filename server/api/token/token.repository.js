const Token = require('./token.model');

async function findTokenByTokenId(tokenId) {
  return Token.findOne({ tokenId }).lean().exec();
}

async function deleteTokenByTokenId(tokenId) {
  return Token.findOneAndDelete({ tokenId });
}

async function createToken(token) {
  return Token.create(token);
}

module.exports = {
  findTokenByTokenId,
  deleteTokenByTokenId,
  createToken,
};
