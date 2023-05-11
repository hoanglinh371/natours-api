'use strict';

const crypto = require('crypto');

const User = require('../models/user.model');
const EmailService = require('../services/email.service');
const { signToken } = require('../utils');
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} = require('../core/error.response');

exports.register = async ({ name, email, password, confirmPassword }) => {
  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });
  const accessToken = signToken(newUser._id);

  return {
    status: 'success',
    accessToken,
    metadata: {
      user: newUser,
    },
  };
};

exports.logIn = async ({ email, password }) => {
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password!');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new UnauthorizedError(
      'Email or password is incorrect. Please try again!'
    );
  }
  const accessToken = signToken(user._id);

  return {
    status: 'success',
    accessToken,
    metadata: {
      user,
    },
  };
};

exports.forgotPassword = async (email, { protocol, host }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('There is no user with email and address.');
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${protocol}://${host}:8080/api/v1/auth/reset-password/${resetToken}`;
  const text = resetURL;
  try {
    const emailService = new EmailService({
      to: user.email,
      subject: 'Your password reset token (valid for 10 mins).',
      text,
    });
    await emailService.send();
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new InternalServerError(
      'An error occurred while sending the email. Try later!'
    );
  }

  return {
    status: 'success',
    message: 'Token was sent to email.',
  };
};

exports.resetPassword = async (
  resetToken,
  { newPassword, confirmNewPassword }
) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new NotFoundError('No user found with this ID.');
  }
  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();
  const accessToken = signToken(user._id);

  return {
    status: 'success',
    accessToken,
    metadata: {
      user,
    },
  };
};
