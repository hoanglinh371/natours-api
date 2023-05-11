'use strict';

const { HTTP_STATUS_CODE } = require('./constants/http-status-code');

class SuccessResponse {
  constructor({ data, statusCode }) {
    this.statusCode = statusCode;
    this.data = data;
  }

  send(res) {
    return res.status(this.statusCode).json(this.data);
  }
}

class Ok extends SuccessResponse {
  constructor({ data, statusCode = HTTP_STATUS_CODE.OK }) {
    super({ data, statusCode });
  }
}

class Created extends SuccessResponse {
  constructor({ data, statusCode = HTTP_STATUS_CODE.CREATED }) {
    super({ data, statusCode });
  }
}

class NoContent extends SuccessResponse {
  constructor({ data, statusCode = HTTP_STATUS_CODE.NO_CONTENT }) {
    super({ data, statusCode });
  }
}

module.exports = {
  Ok,
  Created,
  NoContent,
};
