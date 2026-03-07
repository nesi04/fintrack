const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(err);

  res.status(statusCode).json({
    message: err.message || 'Server error',
    stack: isProd ? undefined : err.stack
  });
};

module.exports = errorHandler;
