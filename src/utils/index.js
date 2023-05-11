'use strict';

const jwt = require('jsonwebtoken');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const signToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = {
  catchAsync,
  signToken,
};
