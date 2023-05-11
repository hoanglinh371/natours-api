'use strict';

const { Schema, model } = require('mongoose');

const COLLECTION_NAME = 'bookings';
const DOCUMENT_NAME = 'Booking';

const bookingSchema = new Schema(
  {
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour.'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user.'],
    },
    price: {
      type: Number,
      required: [true, 'Booking must have price.'],
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
});

const Booking = model(DOCUMENT_NAME, bookingSchema);

module.exports = Booking;
