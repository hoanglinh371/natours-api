'use strict';

const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { rateLimit } = require('express-rate-limit');

const { hour2Millis } = require('./helpers');
const router = require('./routes');

dotenv.config();

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: hour2Millis(1),
  message: 'Too many request from this IP. Please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(compression());

require('./databases/mongodb.database');

app.use('/api/v1', router);

app.all('*', (req, res, next) => {
  return res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
