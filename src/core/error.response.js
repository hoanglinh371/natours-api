'use strict';

const { HTTP_STATUS_CODE } = require('./constants/http-status-code');

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);

    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message, statusCode = HTTP_STATUS_CODE.BAD_REQUEST) {
    super(message, statusCode);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(message, statusCode = HTTP_STATUS_CODE.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message, statusCode = HTTP_STATUS_CODE.FORBIDDEN) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message, statusCode = HTTP_STATUS_CODE.NOT_FOUND) {
    super(message, statusCode);
  }
}

class ConflictError extends ErrorResponse {
  constructor(message, statusCode = HTTP_STATUS_CODE.CONFLICT) {
    super(message, statusCode);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(message, statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER) {
    super(message, statusCode);
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
