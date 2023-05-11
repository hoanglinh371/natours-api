'use strict';

const { Ok, NoContent } = require('../core/success.response');
const { catchAsync } = require('../utils');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../services/user.service');

exports.httpGetUsers = catchAsync(async (req, res, next) => {
  return new Ok({ data: await getUsers() }).send(res);
});

exports.httpGetUserById = catchAsync(async (req, res, next) => {
  return new Ok({ data: await getUserById(req.params._id) }).send(res);
});

exports.httpUpdateUser = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  return new Ok({
    data: await updateUser(req.params._id, {
      name,
      email,
      photo: req.file.filename,
    }),
  }).send(res);
});

exports.httpDeleteUser = catchAsync(async (req, res, next) => {
  return new NoContent({ data: await deleteUser(req.params._id) }).send(res);
});
