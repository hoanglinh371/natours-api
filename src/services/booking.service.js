'use strict';

const stripe = require('stripe')(
  'sk_test_51N6QeHBoe9s9I81BZ7afIeVQMeAPwdXBEQWs1nElAWENA6wlzII6RNt4dzPt6jecbpHTTi0uzoiswOmutUYDhWNw006qqdpl4S'
);

const Tour = require('../models/tour.model');
const Booking = require('../models/booking.model');

class BookingService {
  static async getCheckoutSession({ tourId, userEmail }) {
    const tour = await Tour.findById(tourId);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: 'http://localhost:3000/',
      cancel_url: 'http://localhost:3000/',
      customer_email: userEmail,
      client_reference_id: tourId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: tour.price * 100,
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [
                'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
              ],
            },
          },
        },
      ],
    });

    return {
      status: 'success',
      session,
    };
  }

  static async createBookingCheckout({ tour, user, price }) {
    if (!tour && !user && !price) {
      // do stuff
    }
    await Booking.create({
      tour,
      user,
      price,
    });
  }
}

module.exports = BookingService;
