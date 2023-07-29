const APIError = require('../utils/APIError');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    errdev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'ValidationError') err = handleValidationError(err);
    errPro(err, res);
  }
};

const errdev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errStack: err.stack,
    error: err,
  });
};

const errPro = (err, res) => {
  if (err.operational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    res.status(400).json({
      message: 'Somthing went wrong.. Please try again.',
    });
  }
};

///Mongoose Errors

function handleValidationError(err) {
  const message = Object.values(err.errors).map((el) => el.message);
  return new APIError(`${message.join('. ')}`, 404);
}
