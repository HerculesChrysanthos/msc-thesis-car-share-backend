const User = require('./user.model');

async function registerUser(user) {
  return User.create(user);
}

module.exports = {
  registerUser,
};
