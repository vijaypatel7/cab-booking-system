const sendResponse = require('../utils/sendResponse');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle Mongoose validation errors
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(messages.join('. '), 400);
};

// Handle Mongoose duplicate key errors
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue).join(', ');
  return new AppError(`Duplicate value for: ${field}`, 400);
};

// Handle Mongoose cast errors
const handleCastError = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

// Handle JWT errors
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Token expired. Please log in again.', 401);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for development
  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 Error:', err);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') error = handleValidationError(err);
  // Mongoose duplicate key
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  // Mongoose cast error
  if (err.name === 'CastError') error = handleCastError(err);
  // JWT errors
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  sendResponse(res, statusCode, false, message);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

module.exports = { AppError, errorHandler, notFound };
