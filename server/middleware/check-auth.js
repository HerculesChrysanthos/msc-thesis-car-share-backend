const jwt = require('jsonwebtoken');
const userRepository = require('../api/user/user.repository');

const auth = () => {
  return async (req, res, next) => {
    const token = req.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('A token is required for authentication');
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);

      const foundUser = await userRepository.findUserById(decoded.userId);

      if (!foundUser) {
        throw new Error('Unauthorized');
      }

      req.user = foundUser;

      return next();
    } catch (error) {
      if (error.message === 'invalid signature') {
        error.message = 'Invalid Token';
        error.status = 401;
      }

      if (error.message === 'A token is required for authentication') {
        error.status = 403;
      }

      if (error.message === 'Unauthorized') {
        error.status = 401;
      }

      return next(error);
    }
  };
};

function authorization() {
  return (req, res, next) => {
    try {
      const token = req?.headers?.authorization?.split(' ')[1];
      if (!token) {
        return next();
      }

      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decoded;

      req.user.isOwner = req.user.userId === req.params.userId;

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = {
  auth,
  authorization,
};