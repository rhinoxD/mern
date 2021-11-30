const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authentication.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedData = jwt.verify(token, 'supersecret');
    req.userData = { userId: decodedData.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 401);
    return next(error);
  }
};
