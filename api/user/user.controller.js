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

module.exports = {
  register,
};
