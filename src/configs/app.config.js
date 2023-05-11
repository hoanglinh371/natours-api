'use strict';

const development = {
  port: parseInt(process.env.APP_PORT_DEV, 10) || 8080,
};

const production = {
  port: parseInt(process.env.APP_PORT_PROD, 10) || 8080,
};

const config = { development, production };
const env = process.env.NODE_ENV;

module.exports = config[env];
