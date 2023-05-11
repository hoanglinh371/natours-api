'use strict';

const Review = require('../models/review.model');
const { NotFoundError } = require('../core/error.response');

exports.getReviews = async (tourId) => {
  const reviews = await Review.find({ tour: tourId }).lean();

  return {
    status: 'success',
    metadata: {
      reviews,
    },
  };
};

exports.createReview = async (payload) => {
  const newReview = await Review.create(payload);

  return {
    status: 'success',
    metadata: {
      review: newReview,
    },
  };
};

exports.updateReview = async ({ _id, payload }) => {
  const review = await Review.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    throw new NotFoundError('No review found with ID.');
  }

  return {
    status: 'success',
    metadata: {
      review,
    },
  };
};

exports.deleteReview = async (_id) => {
  const review = await Review.findByIdAndDelete(_id);
  if (!review) {
    throw new NotFoundError('No review found with ID.');
  }

  return {
    status: 'success',
    metadata: null,
  };
};
