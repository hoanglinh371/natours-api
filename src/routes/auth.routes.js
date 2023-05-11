'use strict';

const express = require('express');

const {
  httpRegister,
  httpLogIn,
  httpForgotPassword,
  httpResetPassword,
} = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter.post('/registration', httpRegister);
authRouter.post('/login', httpLogIn);
authRouter.post('/forgot-password', httpForgotPassword);
authRouter.patch('/reset-password/:resetToken', httpResetPassword);

module.exports = authRouter;
