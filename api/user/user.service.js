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

module.exports = {
  register,
};
