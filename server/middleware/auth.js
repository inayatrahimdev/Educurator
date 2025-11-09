/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Validate JWT_SECRET is set
if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set in environment variables');
    console.error('   Please set JWT_SECRET in your .env file');
    throw new Error('JWT_SECRET is required for authentication');
}

/**
 * Middleware to verify JWT token
 * Adds user information to request object if token is valid
 */
const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Add user info to request object
        req.user = user;
        next();
    });
};

/**
 * Generate JWT token for user
 * @param {object} user - User object with id and email
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    if (!user || !user.id || !user.email) {
        throw new Error('Invalid user data for token generation');
    }

    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires after 1 hour
    );
};

/**
 * Optional: Middleware to check if user is admin
 * Can be extended based on role-based access control
 */
const isAdmin = (req, res, next) => {
    // This is a placeholder - implement based on your role system
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
};

module.exports = {
    authenticateToken,
    generateToken,
    isAdmin
};

