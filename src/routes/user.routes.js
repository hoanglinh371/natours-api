'use strict';

const express = require('express');

const { protect } = require('../middlewares/auth.middleware');
const {
  httpGetUsers,
  httpGetUserById,
  httpUpdateUser,
  httpDeleteUser,
} = require('../controllers/user.controller');
const {
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../middlewares/upload.middleware');

const userRouter = express.Router();

userRouter.use(protect);

userRouter.get('/', httpGetUsers);
userRouter
  .route('/:_id')
  .get(httpGetUserById)
  .patch(uploadUserPhoto, resizeUserPhoto, httpUpdateUser)
  .delete(httpDeleteUser);

module.exports = userRouter;
