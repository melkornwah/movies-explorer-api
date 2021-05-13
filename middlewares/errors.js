const errorsHandler = (err, req, res, next) => {
  if (err.message === 'celebrate request validation failed') {
    return res
      .status(400)
      .json(({
        message: err.message,
      }));
  }

  res
    .status(err.statusCode || 500)
    .json({
      message: err.message,
    });

  return next();
};

module.exports = errorsHandler;
