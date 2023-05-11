'use strict';

const { UnauthorizedError } = require('../core/error.response');
const { Ok, Created, NoContent } = require('../core/success.response');
const { catchAsync } = require('../utils');
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../services/review.service');

exports.httpGetReviews = catchAsync(async (req, res, next) => {
  return new Ok({ data: await getReviews(req.params.tourId) }).send(res);
});

exports.httpCreateReview = catchAsync(async (req, res, next) => {
  if (!req.user) {
    throw new UnauthorizedError('You must logged in to post a comment.');
  }

  return new Created({
    data: await createReview({
      tour: req.params.tourId,
      user: req.user._id,
      ...req.body,
    }),
  }).send(res);
});

exports.httpUpdateReview = catchAsync(async (req, res, next) => {
  return new Ok({
    data: await updateReview({
      _id: req.params._id,
      payload: req.body,
    }),
  }).send(res);
});

exports.httpDeleteReview = catchAsync(async (req, res, next) => {
  return new NoContent({ data: await deleteReview(req.params._id) }).send(res);
});
