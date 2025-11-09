/**
 * Error Handling Middleware
 * Centralized error handling for Express application
 */

/**
 * Custom error class for application errors
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global error handler middleware
 * Should be used as the last middleware in Express app
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error('Error:', err);
    if (process.env.NODE_ENV === 'development') {
        console.error('Stack:', err.stack);
    }

    // MSSQL Server specific errors
    if (err.code === 'ETIMEOUT') {
        const message = 'Database connection timeout';
        error = new AppError(message, 500);
    }

    if (err.code === 'ESOCKET') {
        const message = 'Database connection error';
        error = new AppError(message, 500);
    }

    // Database constraint errors (e.g., unique constraint violation)
    if (err.number === 2627 || err.number === 2601) {
        // SQL Server unique constraint violation
        const message = 'A record with this information already exists';
        error = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new AppError(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new AppError(message, 401);
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new AppError(message, 400);
    }

    // AppError instances (already formatted)
    if (err.isOperational) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }

    // Default to 500 server error
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    errorHandler,
    asyncHandler,
    AppError
};

