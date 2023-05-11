'use strict';

const { Ok, Created, NoContent } = require('../core/success.response');
const {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} = require('../services/tour.service');
const { catchAsync } = require('../utils');

exports.httpGetTours = catchAsync(async (req, res, next) => {
  return new Ok({ data: await getTours() }).send(res);
});

exports.httpGetTourById = catchAsync(async (req, res, next) => {
  return new Ok({
    data: await getTourById(req.params._id),
  }).send(res);
});

exports.httpCreateTour = catchAsync(async (req, res, next) => {
  return new Created({ data: await createTour(req.body) }).send(res);
});

exports.httpUpdateTour = catchAsync(async (req, res, next) => {
  return new Ok({
    data: await updateTour({
      _id: req.params._id,
      payload: req.body,
    }),
  });
});

exports.httpDeleteTour = catchAsync(async (req, res, next) => {
  return new NoContent({ data: await deleteTour(req.params._id) }).send(res);
});
