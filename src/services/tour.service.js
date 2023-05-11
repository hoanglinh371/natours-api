'use strict';

const Tour = require('../models/tour.model');
const { NotFoundError, BadRequestError } = require('../core/error.response');

exports.getTours = async () => {
  const tours = await Tour.find().lean();

  return {
    status: 'success',
    results: tours.length,
    metadata: {
      tours,
    },
  };
};

exports.getTourById = async (_id) => {
  const tour = await Tour.findById(_id)
    .populate({ path: 'guides', select: '+name +email +photo +role' })
    .populate('reviews')
    .lean();
  if (!tour) {
    throw new NotFoundError('No tour found with this ID.');
  }

  return {
    status: 'success',
    metadata: {
      tour,
    },
  };
};

exports.getToursWithin = async ({ distance, latlon, unit }) => {
  const [lat, lon] = latlon.split(',');
  const radius = unit === 'mi' ? distance / 3958.8 : distance / 6371;
  if (!lat || !lon) {
    throw BadRequestError('Please provide latitude and longitude');
  }
  const tours = await Tour.find({
    locations: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
  });

  return {
    status: 'success',
    results: tours.length,
    metadata: {
      tours,
    },
  };
};

exports.createTour = async (payload) => {
  const newTour = await Tour.create(payload);
  if (!newTour) {
    throw new BadRequestError('Bad request.');
  }

  return {
    status: 'success',
    message: '',
    metadata: {
      tour: newTour,
    },
  };
};

exports.updateTour = async ({ _id, payload }) => {
  const tour = await Tour.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    throw new NotFoundError('No tour found with this ID.');
  }

  return {
    status: 'success',
    message: '',
    metadata: {
      tour,
    },
  };
};

exports.deleteTour = async (_id) => {
  const tour = await Tour.findByIdAndDelete(_id);
  if (!tour) {
    throw new NotFoundError('No tour found with this ID.');
  }

  return {
    status: 'success',
    message: '',
    metadata: null,
  };
};
