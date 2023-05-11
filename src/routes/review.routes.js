'use strict';

const express = require('express');

const {
  httpGetReviews,
  httpCreateReview,
  httpUpdateReview,
  httpDeleteReview,
} = require('../controllers/review.controller');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.route('/').get(httpGetReviews).post(httpCreateReview);
reviewRouter.route('/:_id').patch(httpUpdateReview).delete(httpDeleteReview);

module.exports = reviewRouter;
