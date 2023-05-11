'use strict';

const BookingService = require('../services/booking.service');

class BookingController {
  static async httpGetCheckoutSession(req, res, next) {
    return res.status(200).json(
      await BookingService.getCheckoutSession({
        tourId: req.params.tourId,
        userEmail: req.user.email,
      })
    );
  }
}

module.exports = BookingController;
