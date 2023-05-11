'use strict';

const { Ok, Created } = require('../core/success.response');
const { catchAsync } = require('../utils');
const {
  register,
  logIn,
  forgotPassword,
  resetPassword,
} = require('../services/auth.service');

exports.httpRegister = catchAsync(async (req, res, next) => {
  return new Created({ data: await register(req.body) }).send(res);
});

exports.httpLogIn = catchAsync(async (req, res, next) => {
  return new Ok({ data: await logIn(req.body) }).send(res);
});

exports.httpForgotPassword = catchAsync(async (req, res, next) => {
  return new Ok({
    data: await forgotPassword(req.body.email, {
      protocol: req.protocol,
      host: req.hostname,
    }),
  }).send(res);
});

exports.httpResetPassword = catchAsync(async (req, res, next) => {
  return new Ok({
    data: await resetPassword(req.params.resetToken, req.body),
  }).send(res);
});
