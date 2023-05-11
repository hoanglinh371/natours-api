'use strict';

const { Schema, model } = require('mongoose');

const Tour = require('./tour.model');

const COLLECTION_NAME = 'reviews';
const DOCUMENT_NAME = 'Review';

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        numberOfRatings: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].averageRating,
      ratingsQuantity: stats[0].numberOfRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.model.findOne(this.getQuery());

  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calculateAverageRatings(this.review.tour);
});

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRatings(this.tour);
});

const Review = model(DOCUMENT_NAME, reviewSchema);

module.exports = Review;
