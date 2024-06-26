const User = require('./user.model');

async function registerUser(user) {
  return User.create(user);
}

async function findUser(email) {
  return User.findOne({ email });
}

async function createOrUpdateUserByGoogleId(user) {
  return User.findOneAndUpdate(
    { googleId: user.googleId },
    {
      $set: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        googleId: user.googleId,
        profilePictureUrl: user.profilePictureUrl,
      },
      //$setOnInsert: { role: user.role },
    },
    {
      upsert: true,
      new: true,
      rawResult: true,
    }
  )
    .lean()
    .exec();
}

async function verifyUser(_id) {
  return User.findOneAndUpdate(
    { _id },
    { $set: { verified: true } },
    { new: true }
  )
    .lean()
    .exec();
}

async function findUserById(id) {
  return User.findById(id);
}

module.exports = {
  registerUser,
  findUser,
  createOrUpdateUserByGoogleId,
  verifyUser,
  findUserById,
};
