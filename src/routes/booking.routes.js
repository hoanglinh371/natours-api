'use strict';

const express = require('express');

const BookingController = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');

const bookingRouter = express.Router();

bookingRouter.get(
  '/checkout-session/:tourId',
  protect,
  BookingController.httpGetCheckoutSession
);

module.exports = bookingRouter;
