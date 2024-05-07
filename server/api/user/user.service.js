const userRepository = require('./user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function createToken(user) {
  const expirationTimeInSeconds = 60 * 60 * 24 * 30; // 30days in seconds
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
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

module.exports = {
  register,
  login,
};
