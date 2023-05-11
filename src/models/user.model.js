'use strict';

const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { min2Millis } = require('../helpers');

const COLLECTION_NAME = 'users';
const DOCUMENT_NAME = 'User';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email.'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['admin', 'lead-guide', 'guide', 'user'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please provide your password.'],
      minLength: [6, 'Password must be at least 6 characters.'],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password.'],
      minLength: [6, 'Confirm password must be at least 6 characters.'],
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: 'Password are not the same.',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;

  console.log('test');

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (iat) {
  if (this.passwordChangedAt) {
    return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > iat; // handle again
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + min2Millis(10);

  return resetToken;
};

const User = model(DOCUMENT_NAME, userSchema);

module.exports = User;
