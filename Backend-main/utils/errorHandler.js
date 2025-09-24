function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default error response
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || undefined;

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation Error';
    details = err.errors;
  }

  // Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Invalid or expired token';
  }

  // Duplicate key error (MongoDB)
  if (err.code && err.code === 11000) {
    status = 409;
    message = 'Duplicate key error';
    details = err.keyValue;
  }

  // Network errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    status = 503;
    message = 'Network error: Unable to connect to service';
  }

  // Database errors
  if (err.name === 'MongoError') {
    status = 500;
    message = 'Database error';
    details = err;
  }

  // Syntax errors (e.g., JSON parse)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    status = 400;
    message = 'Invalid JSON payload';
  }

  // Application errors (custom thrown)
  if (err.name === 'AppError') {
    status = err.status || 500;
    message = err.message || 'Application error';
    details = err.details;
  }

  // Not found errors
  if (err.status === 404) {
    message = 'Resource not found';
  }

  // Unauthorized errors
  if (err.status === 401) {
    message = 'Unauthorized';
  }

  // Forbidden errors
  if (err.status === 403) {
    message = 'Forbidden';
  }

  // Request timeout
  if (err.code === 'ETIMEDOUT') {
    status = 408;
    message = 'Request timed out';
  }

  // Add more error types as needed...

  res.status(status).json({
    error: message,
    details,
  });
}

module.exports = errorHandler;
