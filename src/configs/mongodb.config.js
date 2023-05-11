'use strict';

const development = {
  host: process.env.MONGODB_HOST_DEV || '127.0.0.1',
  port: parseInt(process.env.MONGODB_PORT_DEV, 10) || 27017,
  dbname: process.env.MONGODB_DBNAME_DEV || 'natours-db-dev',
};

const production = {
  host: process.env.MONGODB_HOST_PROD || '127.0.0.1',
  port: parseInt(process.env.MONGODB_PORT_PROD, 10) || 27017,
  dbname: process.env.MONGODB_DBNAME_PROD || 'natours-db-prod',
};

const config = { development, production };
const env = process.env.NODE_ENV;

module.exports = config[env];
