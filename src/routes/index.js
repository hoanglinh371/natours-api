'use strict';

const express = require('express');

const tourRouter = require('./tour.routes');
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const bookingRouter = require('./booking.routes');

const router = express.Router();

router.use('/tours', tourRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/bookings', bookingRouter);

module.exports = router;
