const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(`[${new Date().toISOString()}] ${err.message}`);
  if (!isProd && err.stack) {
    console.error(err.stack);
  }

  res.status(status).json({
    status,
    error: err.name || 'InternalServerError',
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
};

export default errorHandler; 
