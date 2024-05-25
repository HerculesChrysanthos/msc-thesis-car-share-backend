const userRepository = require('./user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('../../clients/nodemailer');
const { EMAIL_TYPES } = require('../constants');
const tokenService = require('../token/token.service');
const { deleteTokenByTokenId } = require('../token/token.repository');
const utils = require('../../utils');

function createToken(user) {
  const expirationTimeInSeconds = 60 * 60 * 24 * 30; // 30days in seconds
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.TOKEN_KEY,
    {
      expiresIn: expirationTimeInSeconds, //'2h',
    }
  );
}

async function register(user) {
  const encryptedPassword = await bcrypt.hash(user.password, 10);
  user.password = encryptedPassword;

  const dbUser = await userRepository.registerUser(user);

  const verificationToken = await tokenService.createToken(dbUser._id);

  nodemailer.sendEmail(EMAIL_TYPES.REGISTRATION, dbUser, verificationToken);

  dbUser.token = createToken(dbUser);

  return dbUser;
}

async function login(email, password) {
  const user = await userRepository.findUser(email);

  if (!user) {
    throw new Error('User not found');
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (!matchedPassword) {
    throw new Error('Invalid password');
  }

  user.token = createToken(user);

  return user;
}

async function verify(tokenId) {
  const token = await tokenService.findTokenByTokenId(tokenId);

  if (!token) {
    throw new Error('Invalid or expired token');
  }

  const verifiedUser = await userRepository.verifyUser(token.userId);

  if (!verifiedUser) {
    throw new Error('Error verifing user');
  }

  await deleteTokenByTokenId(tokenId);

  nodemailer.sendEmail(EMAIL_TYPES.VERIFIED, verifiedUser, token);
}

async function reSendVerifyToken(user) {
  const verifiedUser = user.verified;

  if (verifiedUser) {
    throw new Error('User already verified');
  }

  let token = await tokenService.findTokenByUserId(user._id);

  if (!token) {
    token = tokenService.createToken(user._id);
  }

  nodemailer.sendEmail(EMAIL_TYPES.VERIFICATION, user, token);
}

module.exports = {
  register,
  login,
  verify,
  reSendVerifyToken,
};
