'use strict';

const User = require('../models/user.model');
const { NotFoundError } = require('../core/error.response');

exports.getUsers = async () => {
  const users = await User.find().lean();

  return {
    status: 'success',
    metadata: {
      users,
    },
  };
};

exports.getUserById = async (_id) => {
  const user = await User.findById(_id).lean();
  if (!user) {
    throw new NotFoundError('No user were found with this ID.');
  }

  return {
    status: 'success',
    metadata: {
      user,
    },
  };
};

exports.updateUser = async (_id, payload) => {
  const user = await User.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });

  return {
    status: 'success',
    metadata: {
      user,
    },
  };
};

exports.deleteUser = async (_id) => {
  const user = await User.findByIdAndUpdate(_id, { active: false });
  if (!user) {
    throw new NotFoundError('No user found with this ID');
  }

  return {
    status: 'success',
    metadata: null,
  };
};
