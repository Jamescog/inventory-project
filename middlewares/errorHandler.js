const ErrorHandler = require("../utils/error");

const handleError = (err, req, res, next) => {
  res.status(err._statusCode).json({
    success: false,
    error: err.message,
  });
};

module.exports = handleError;
