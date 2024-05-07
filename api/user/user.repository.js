const User = require('./user.model');

async function registerUser(user) {
  return User.create(user);
}

async function findUser(email) {
  return User.findOne({ email });
}

async function createOrUpdateUserByGoogleId(user) {
  return User.findOneAndUpdate({ googleId: user.googleId }, user, {
    upsert: true,
    new: true,
  })
    .lean()
    .exec();
}

module.exports = {
  registerUser,
  findUser,
  createOrUpdateUserByGoogleId,
};
