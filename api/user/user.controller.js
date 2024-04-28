const userService = require('./user.service');
const userHelper = require('./user.helper');

async function register(req, res, next) {
  try {
    const user = req.body;

    const dbUser = await userService.register(user);

    const response = userHelper.buildUserResponse(dbUser);

    console.log(`SUCCESSFUL_USER_CREATED ${response}`);
    res.status(201).json(response);
  } catch (error) {
    console.log(`error: ${error}`);
    if (error.toString().includes('duplicate key')) {
      error.message = 'Email already exists';
      error.status = 409;
    }

    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const dbUser = await userService.login(email, password);

    const response = userHelper.buildUserResponse(dbUser);

    return res.status(200).json(response);
  } catch (error) {
    if (error.message === 'User not found') {
      error.status = 404;
    }

    if (error.message === 'Invalid password') {
      error.status = 401;
    }

    return next(error);
  }
}

async function getUserProfile(req, res, next) {
  try {
    const isOwner = req.user.isOwner;

    if (!isOwner) {
      return res.status(200).json({});
    }

    // isOwner
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  getUserProfile,
};
