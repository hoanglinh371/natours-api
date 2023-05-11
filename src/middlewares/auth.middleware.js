'use strict';

const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const { catchAsync } = require('../utils');
const { UnauthorizedError, ForbiddenError } = require('../core/error.response');

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token = '';
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    throw new UnauthorizedError(
      'You are not log in! Please log in to get access.'
    );
  }
  const { _id, iat } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById({ _id });
  if (!user) {
    throw new UnauthorizedError(
      'The user who owns this token no longer exists.'
    );
  }
  if (user.changedPasswordAfter(iat)) {
    throw new UnauthorizedError(
      'User recently changed password! Please log in again'
    );
  }
  req.user = user;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        'You do not have permission to perform this action.'
      );
    }

    next();
  };
};
