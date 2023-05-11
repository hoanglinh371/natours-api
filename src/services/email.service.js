'use strict';

const nodemailer = require('nodemailer');

class EmailService {
  constructor(options) {
    this.createTransport();
    this.options = {
      from: 'Natours <admin@natours.com>',
      ...options,
    };
  }

  createTransport() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST_DEV,
      port: process.env.EMAIL_PORT_DEV,
      auth: {
        user: process.env.EMAIL_USER_DEV,
        pass: process.env.EMAIL_PASS_DEV,
      },
    });
  }

  async send() {
    await this.transporter.sendMail(this.options);
  }
}

module.exports = EmailService;
