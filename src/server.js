'use strict';

const http = require('http');

const app = require('./app');
const { port } = require('./configs/app.config');

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on PORT: ${8080}`);
});
