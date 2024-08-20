const userRepository = require('./user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('../../clients/nodemailer');
const { EMAIL_TYPES } = require('../constants');
const tokenService = require('../token/token.service');
const { deleteTokenByTokenId } = require('../token/token.repository');
const utils = require('../../utils');
const generalHelper = require('../../helpers/general.helper');
const sharpHelper = require('../../helpers/sharp.helper');
const imagekitClient = require('../../clients/imagekit-client');

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
    throw new Error('Λάθος στοιχεία σύνδεσης');
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (!matchedPassword) {
    throw new Error('Λάθος στοιχεία σύνδεσης');
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

async function updateMyUserFields(user, userId) {
  return userRepository.updateMyUserFields(user, userId);
}

async function uploadUserProfileImage(user, image) {
  if (user.profileImage?.url) {
    imagekitClient.deleteImageByFileId(user.profileImage.externalId);
  }
  image.originalname = image.originalname.replace(/[^a-zA-Z0-9.]/g, '_');

  const name = generalHelper.prepareImageName(image.originalname, user._id);

  const resizedImage = await sharpHelper.resizeImage(image.buffer, {
    width: 200,
  });

  const result = await imagekitClient.uploadImage(resizedImage, name);

  const imageUrl = `https://ik.imagekit.io/carsharerentingapp/${name}`;

  const updatedUser = await userRepository.uploadProfileImage(
    user._id,
    imageUrl,
    result.fileId
  );

  return updatedUser;
}

async function updateUserRatingScoreAndAmount(userId, score, amount) {
  return userRepository.updateUserRatingScoreAndAmount(userId, score, amount);
}

async function checkIfUserExists(userId) {
  if (!utils.isValidObjectId(userId)) {
    throw new Error('Ο χρήστης δε βρέθηκε');
  }

  const foundUser = await userRepository.findUserById(userId);

  if (!foundUser) {
    throw new Error('Ο χρήστης δε βρέθηκε');
  }
}

module.exports = {
  register,
  login,
  verify,
  reSendVerifyToken,
  updateMyUserFields,
  uploadUserProfileImage,
  updateUserRatingScoreAndAmount,
  checkIfUserExists,
};
