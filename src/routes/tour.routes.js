'use strict';

const express = require('express');

const { protect, restrictTo } = require('../middlewares/auth.middleware');
const reviewRouter = require('./review.routes');
const {
  httpGetTours,
  httpGetTourById,
  httpCreateTour,
  httpUpdateTour,
  httpDeleteTour,
} = require('../controllers/tour.controller');

const tourRouter = express.Router();

tourRouter.get('/', httpGetTours);

tourRouter.use(protect);
tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter.use(restrictTo('admin'));
tourRouter.post('/', httpCreateTour);
tourRouter
  .route('/:_id')
  .get(httpGetTourById)
  .patch(httpUpdateTour)
  .delete(httpDeleteTour);

module.exports = tourRouter;
