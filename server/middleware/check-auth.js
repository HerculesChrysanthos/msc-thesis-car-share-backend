const jwt = require('jsonwebtoken');

const auth = (role = []) => {
  return (req, res, next) => {
    const token = req.headers?.authorization?.split(' ')[1];

    if (!token && role.length !== 0) {
      throw new Error('A token is required for authentication');
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decoded;

      if (!role.includes(req.user.role)) {
        throw new Error('Unauthorized');
      }

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
