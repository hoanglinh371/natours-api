'use strict';

const mongoose = require('mongoose');

const { host, port, dbname } = require('../configs/mongodb.config');
const connectionString = `mongodb://${host}:${port}/${dbname}`;

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose.connect(connectionString).then(() => {
      console.log('Database connection successful!');
    });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const mongodbInstance = Database.getInstance();

module.exports = mongodbInstance;
