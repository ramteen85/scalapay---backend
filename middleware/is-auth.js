const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = async (req, res, next) => {
  try {
    // auth token stuff
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Error: Not Authorized');
      error.statusCode = 401;
      next(error);
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, config.AUTHKEY);
    } catch (err) {
      const error = new Error('Error: Token verification failed. Please try again.');
      error.statusCode = 401;
      next(error);
    }
    if (!decodedToken) {
      const error = new Error('Invalid Token');
      error.statusCode = 401;
      next(error);
    }

    // wrap up
    req.userId = decodedToken.userId;
    req.email = decodedToken.email;
    req.nickname = decodedToken.nickname;
    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};
