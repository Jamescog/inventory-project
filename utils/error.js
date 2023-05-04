class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this._statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;
